<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\Partner\Services;

use App\Common\Exceptions\BusinessException;
use App\Common\Services\BaseService;
use App\Modules\Marketplace\Partner\Contracts\PartnerServiceInterface;
use App\Modules\Marketplace\Partner\Enums\PartnerStatus;
use App\Modules\Marketplace\Partner\Exceptions\InvalidPartnerTransitionException;
use App\Modules\Marketplace\Partner\ExternalServices\ResiMartProvisioningException;
use App\Modules\Marketplace\Partner\ExternalServices\ResiMartProvisioningServiceInterface;
use App\Modules\Marketplace\Partner\Models\Partner;
use App\Modules\Marketplace\Partner\Repositories\PartnerRepository;
use App\Modules\Marketplace\PartnerCommissionContract\Repositories\PartnerCommissionContractRepository;
use App\Modules\Marketplace\PartnerProject\Repositories\PartnerProjectRepository;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class PartnerService extends BaseService implements PartnerServiceInterface
{
    public function __construct(
        protected PartnerRepository $repository,
        protected ResiMartProvisioningServiceInterface $resiMart,
        protected PartnerProjectRepository $partnerProjectRepository,
        protected PartnerCommissionContractRepository $contractRepository,
    ) {}

    /**
     * @param  array<string, mixed>  $filters
     */
    public function list(array $filters): LengthAwarePaginator
    {
        return $this->repository->list($filters);
    }

    public function findById(int $id): Partner
    {
        /** @var Partner $partner */
        $partner = $this->repository->findById($id);

        if ($partner->owner_tenant_id !== null) {
            $partner->setAttribute(
                'project_ids',
                $this->partnerProjectRepository->listProjectIdsForTenant(
                    $partner->id,
                    $partner->owner_tenant_id,
                ),
            );
        }

        return $partner;
    }

    public function findBySlug(string $slug): Partner
    {
        $partner = $this->repository->findBySlug($slug);

        if (! $partner) {
            throw new BusinessException(
                message: "Không tìm thấy partner với slug {$slug}.",
                errorCode: 'PARTNER_NOT_FOUND',
                httpStatusCode: Response::HTTP_NOT_FOUND,
            );
        }

        return $partner;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Partner
    {
        $ownerTenantId = isset($data['owner_tenant_id']) && $data['owner_tenant_id'] !== ''
            ? (string) $data['owner_tenant_id']
            : null;

        $partner = $this->executeInTransaction(function () use ($data, $ownerTenantId): Partner {
            $payload = $this->buildCreatePayload($data);
            $payload['owner_tenant_id'] = $ownerTenantId;

            /** @var Partner $partner */
            $partner = $this->repository->create($payload);

            return $partner;
        });

        $this->tryProvisionRemote($partner);

        if ($ownerTenantId !== null && isset($data['project_ids']) && is_array($data['project_ids'])) {
            $this->partnerProjectRepository->syncForPartnerInTenant(
                $partner->id,
                $ownerTenantId,
                array_map('intval', $data['project_ids']),
                $data['actor_id'] ?? null,
            );
        }

        $fresh = $partner->fresh() ?? $partner;

        if ($ownerTenantId !== null) {
            $fresh->setAttribute(
                'project_ids',
                $this->partnerProjectRepository->listProjectIdsForTenant($fresh->id, $ownerTenantId),
            );
        }

        return $fresh;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data): Partner
    {
        $hasOwnerTenant = array_key_exists('owner_tenant_id', $data);
        $newOwnerTenantId = $hasOwnerTenant && $data['owner_tenant_id'] !== null && $data['owner_tenant_id'] !== ''
            ? (string) $data['owner_tenant_id']
            : null;

        $partner = $this->executeInTransaction(function () use ($id, $data, $hasOwnerTenant, $newOwnerTenantId): Partner {
            /** @var Partner $partner */
            $partner = $this->repository->findById($id);

            $payload = $this->buildUpdatePayload($data);

            if ($hasOwnerTenant) {
                $payload['owner_tenant_id'] = $newOwnerTenantId;
            }

            if ($payload !== []) {
                $partner->update($payload);
            }

            return $partner->fresh() ?? $partner;
        });

        if ($newOwnerTenantId !== null
            && array_key_exists('project_ids', $data)
            && is_array($data['project_ids'])
        ) {
            $this->partnerProjectRepository->syncForPartnerInTenant(
                $partner->id,
                $newOwnerTenantId,
                array_map('intval', $data['project_ids']),
                $data['actor_id'] ?? null,
            );
        }

        if ($newOwnerTenantId !== null) {
            $partner->setAttribute(
                'project_ids',
                $this->partnerProjectRepository->listProjectIdsForTenant($partner->id, $newOwnerTenantId),
            );
        }

        return $partner;
    }

    public function delete(int $id): void
    {
        $partner = $this->findById($id);
        $partner->delete();
    }

    public function approve(int $id, ?int $actorId = null): Partner
    {
        return $this->transitionStatus($id, PartnerStatus::Pending, PartnerStatus::Active, $actorId);
    }

    public function deactivate(int $id, ?int $actorId = null): Partner
    {
        return $this->transitionStatus($id, PartnerStatus::Active, PartnerStatus::Suspended, $actorId);
    }

    public function reactivate(int $id, ?int $actorId = null): Partner
    {
        return $this->transitionStatus($id, PartnerStatus::Suspended, PartnerStatus::Active, $actorId);
    }

    /**
     * Move a vendor between approval states. Fetches the raw model (not the
     * project_ids-decorated one from {@see findById}) so the persisted update
     * never tries to write the virtual `project_ids` attribute.
     */
    private function transitionStatus(int $id, PartnerStatus $from, PartnerStatus $to, ?int $actorId): Partner
    {
        /** @var Partner $partner */
        $partner = $this->repository->findById($id);

        if ($partner->status !== $from) {
            throw InvalidPartnerTransitionException::from($partner->status, $to);
        }

        $partner->update([
            'status' => $to->value,
            'updated_by' => $actorId,
        ]);

        return $partner->refresh();
    }

    public function provision(int $id): Partner
    {
        // Fetch raw via repository — avoid the project_ids virtual attribute
        // that findById() sets when owner_tenant_id is present, which would
        // otherwise become a "dirty" attribute and get persisted by update().
        /** @var Partner $partner */
        $partner = $this->repository->findById($id);

        if ($partner->tenant_id !== null) {
            return $this->findById($id);
        }

        $vendor = $this->resiMart->provisionVendor($this->buildProvisionPayload($partner));

        $partner->update(['tenant_id' => $vendor->tenantId]);

        return $this->findById($id);
    }

    /**
     * @param  array<string, mixed>  $filters
     */
    public function listForTenant(string $ownerTenantId, array $filters): LengthAwarePaginator
    {
        $linkedPartnerIds = $this->partnerProjectRepository->listPartnerIdsForTenant($ownerTenantId);

        return $this->repository->listVisibleToTenant($ownerTenantId, $linkedPartnerIds, $filters);
    }

    /**
     * Catalog of every `active` vendor the tenant can add to its projects.
     * Each row carries an `is_linked` flag telling whether the tenant already
     * uses that vendor in at least one project.
     *
     * @param  array<string, mixed>  $filters
     */
    public function catalogForTenant(string $ownerTenantId, array $filters): LengthAwarePaginator
    {
        $linkedPartnerIds = $this->partnerProjectRepository->listPartnerIdsForTenant($ownerTenantId);
        $linkedSet = array_flip($linkedPartnerIds);

        $paginator = $this->repository->listCatalog($filters);

        $paginator->getCollection()->each(function (Partner $partner) use ($linkedSet): void {
            $partner->setAttribute('is_linked', isset($linkedSet[$partner->id]));
        });

        return $paginator;
    }

    /**
     * Link an existing (active) vendor to one or more of the tenant's projects.
     * Does not require ownership — any tenant may add a shared vendor. Never
     * re-provisions or mutates the vendor record itself.
     *
     * @param  list<int>  $projectIds
     */
    public function attachForTenant(int $id, string $ownerTenantId, array $projectIds, ?int $actorId = null): Partner
    {
        $partner = $this->requireActivePartner($id);

        $this->partnerProjectRepository->attachProjects($partner->id, $ownerTenantId, $projectIds, $actorId);

        $partner->setAttribute(
            'project_ids',
            $this->partnerProjectRepository->listProjectIdsForTenant($partner->id, $ownerTenantId),
        );

        return $partner;
    }

    /**
     * Unlink a vendor from one or more of the tenant's projects. Blocked when
     * any targeted project still has an `active` commission contract — the
     * tenant must cancel the contract first.
     *
     * @param  list<int>  $projectIds
     */
    public function detachForTenant(int $id, string $ownerTenantId, array $projectIds, ?int $actorId = null): Partner
    {
        $partner = $this->repository->findByIdOrNull($id);

        if (! $partner) {
            throw new BusinessException(
                message: "Không tìm thấy partner với id {$id}.",
                errorCode: 'PARTNER_NOT_FOUND',
                httpStatusCode: Response::HTTP_NOT_FOUND,
            );
        }

        $targets = array_values(array_unique(array_map('intval', $projectIds)));

        $blockedProjectIds = $this->contractRepository->activeProjectIdsFor($partner->id, $ownerTenantId, $targets);

        if ($blockedProjectIds !== []) {
            throw new BusinessException(
                message: 'Vendor còn hợp đồng hoa hồng đang hiệu lực ở dự án đã chọn. Vui lòng huỷ hợp đồng trước khi gỡ vendor khỏi dự án.',
                errorCode: 'PARTNER_HAS_ACTIVE_CONTRACT',
                httpStatusCode: Response::HTTP_CONFLICT,
                context: ['project_ids' => $blockedProjectIds],
            );
        }

        $this->partnerProjectRepository->detachProjects($partner->id, $ownerTenantId, $targets, $actorId);

        $partner->setAttribute(
            'project_ids',
            $this->partnerProjectRepository->listProjectIdsForTenant($partner->id, $ownerTenantId),
        );

        return $partner;
    }

    private function requireActivePartner(int $id): Partner
    {
        $partner = $this->repository->findByIdOrNull($id);

        if (! $partner) {
            throw new BusinessException(
                message: "Không tìm thấy partner với id {$id}.",
                errorCode: 'PARTNER_NOT_FOUND',
                httpStatusCode: Response::HTTP_NOT_FOUND,
            );
        }

        if ($partner->status !== PartnerStatus::Active) {
            throw new BusinessException(
                message: 'Chỉ có thể thêm vendor đang hoạt động vào dự án.',
                errorCode: 'PARTNER_NOT_ACTIVE',
                httpStatusCode: Response::HTTP_CONFLICT,
            );
        }

        return $partner;
    }

    /**
     * Resolve a partner the tenant is allowed to mutate (edit / delete /
     * provision). A shared vendor (owned by Platform or another tenant) is
     * read-only for this tenant — it yields PARTNER_NOT_OWNED rather than the
     * misleading PARTNER_NOT_FOUND.
     */
    private function requireOwnedPartner(int $id, string $ownerTenantId): Partner
    {
        $partner = $this->repository->findByIdOwnedBy($id, $ownerTenantId);

        if ($partner) {
            return $partner;
        }

        if ($this->repository->findByIdOrNull($id)) {
            throw new BusinessException(
                message: "Partner với id {$id} không thuộc quyền quản lý của bạn. Vui lòng liên hệ Platform admin.",
                errorCode: 'PARTNER_NOT_OWNED',
                httpStatusCode: Response::HTTP_FORBIDDEN,
            );
        }

        throw new BusinessException(
            message: "Không tìm thấy partner với id {$id}.",
            errorCode: 'PARTNER_NOT_FOUND',
            httpStatusCode: Response::HTTP_NOT_FOUND,
        );
    }

    public function findByIdForTenant(int $id, string $ownerTenantId): Partner
    {
        // A tenant may view any vendor it can also add to its projects: the
        // shared catalog is every `active` vendor (regardless of owner), plus
        // the tenant's own vendors even while inactive. Mirrors listCatalog()
        // + attachForTenant(); ownership is still enforced for update/delete.
        $partner = $this->repository->findByIdOrNull($id);

        if (! $partner) {
            throw new BusinessException(
                message: "Không tìm thấy partner với id {$id}.",
                errorCode: 'PARTNER_NOT_FOUND',
                httpStatusCode: Response::HTTP_NOT_FOUND,
            );
        }

        $ownedByTenant = $partner->owner_tenant_id === $ownerTenantId;

        if (! $ownedByTenant && $partner->status !== PartnerStatus::Active) {
            throw new BusinessException(
                message: "Không tìm thấy partner với id {$id}.",
                errorCode: 'PARTNER_NOT_FOUND',
                httpStatusCode: Response::HTTP_NOT_FOUND,
            );
        }

        $partner->setAttribute(
            'project_ids',
            $this->partnerProjectRepository->listProjectIdsForTenant($partner->id, $ownerTenantId),
        );

        return $partner;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function createForTenant(string $ownerTenantId, array $data): Partner
    {
        // Vendor registered by a PMC tenant always starts as `pending` and must
        // be approved by a platform admin before it goes active (spec §3.2).
        $data['status'] = PartnerStatus::Pending->value;

        $partner = $this->executeInTransaction(function () use ($ownerTenantId, $data): Partner {
            $payload = $this->buildCreatePayload($data);
            $payload['owner_tenant_id'] = $ownerTenantId;

            /** @var Partner $partner */
            $partner = $this->repository->create($payload);

            return $partner;
        });

        $this->tryProvisionRemote($partner);

        if (array_key_exists('project_ids', $data) && is_array($data['project_ids'])) {
            $this->partnerProjectRepository->syncForPartnerInTenant(
                $partner->id,
                $ownerTenantId,
                array_map('intval', $data['project_ids']),
                $data['actor_id'] ?? null,
            );
        }

        $fresh = $partner->fresh() ?? $partner;
        $fresh->setAttribute(
            'project_ids',
            $this->partnerProjectRepository->listProjectIdsForTenant($fresh->id, $ownerTenantId),
        );

        return $fresh;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function updateForTenant(int $id, string $ownerTenantId, array $data): Partner
    {
        $partner = $this->executeInTransaction(function () use ($id, $ownerTenantId, $data): Partner {
            $partner = $this->requireOwnedPartner($id, $ownerTenantId);

            $payload = $this->buildUpdatePayload($data);

            if ($payload !== []) {
                $partner->update($payload);
            }

            return $partner->fresh() ?? $partner;
        });

        if (array_key_exists('project_ids', $data) && is_array($data['project_ids'])) {
            $this->partnerProjectRepository->syncForPartnerInTenant(
                $partner->id,
                $ownerTenantId,
                array_map('intval', $data['project_ids']),
                $data['actor_id'] ?? null,
            );
        }

        $partner->setAttribute(
            'project_ids',
            $this->partnerProjectRepository->listProjectIdsForTenant($partner->id, $ownerTenantId),
        );

        return $partner;
    }

    public function deleteForTenant(int $id, string $ownerTenantId): void
    {
        $partner = $this->requireOwnedPartner($id, $ownerTenantId);

        if ($partner->tenant_id !== null) {
            throw new BusinessException(
                message: 'Vendor đã được kích hoạt. Vui lòng liên hệ Platform admin để xóa.',
                errorCode: 'VENDOR_ALREADY_PROVISIONED',
                httpStatusCode: Response::HTTP_FORBIDDEN,
            );
        }

        $partner->delete();
    }

    public function provisionForTenant(int $id, string $ownerTenantId): Partner
    {
        $partner = $this->requireOwnedPartner($id, $ownerTenantId);

        if ($partner->tenant_id === null) {
            $vendor = $this->resiMart->provisionVendor($this->buildProvisionPayload($partner));
            $partner->update(['tenant_id' => $vendor->tenantId]);
            $partner = $partner->fresh() ?? $partner;
        }

        $partner->setAttribute(
            'project_ids',
            $this->partnerProjectRepository->listProjectIdsForTenant($partner->id, $ownerTenantId),
        );

        return $partner;
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    protected function buildCreatePayload(array $data): array
    {
        return [
            'slug' => $data['slug'],
            'tenant_id' => null,
            'name' => $data['name'],
            'display_name' => $data['display_name'] ?? $data['name'],
            'status' => $data['status'] ?? PartnerStatus::Active->value,
            'custom_domain' => $data['custom_domain'] ?? null,
            'categories' => $data['categories'] ?? [],
            'owner_email' => $data['owner_email'],
            'owner_phone' => $data['owner_phone'] ?? null,
            'logo_url' => $data['logo_url'] ?? null,
            'description' => $data['description'] ?? null,
            'created_by' => $data['actor_id'] ?? null,
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    protected function buildUpdatePayload(array $data): array
    {
        $payload = array_filter([
            'name' => $data['name'] ?? null,
            'display_name' => $data['display_name'] ?? null,
            'status' => $data['status'] ?? null,
            'custom_domain' => $data['custom_domain'] ?? null,
            'categories' => $data['categories'] ?? null,
            'owner_email' => $data['owner_email'] ?? null,
            'owner_phone' => $data['owner_phone'] ?? null,
            'logo_url' => $data['logo_url'] ?? null,
            'description' => $data['description'] ?? null,
            'updated_by' => $data['actor_id'] ?? null,
        ], fn ($v) => $v !== null);

        unset($payload['slug'], $payload['tenant_id'], $payload['owner_tenant_id']);

        return $payload;
    }

    private function tryProvisionRemote(Partner $partner): void
    {
        if (! $this->resiMart->isEnabled()) {
            Log::info('resi_mart.provision.skipped', [
                'reason' => 'integration_disabled',
                'partner_id' => $partner->id,
                'slug' => $partner->slug,
            ]);

            return;
        }

        try {
            $vendor = $this->resiMart->provisionVendor($this->buildProvisionPayload($partner));

            $partner->update(['tenant_id' => $vendor->tenantId]);
        } catch (ResiMartProvisioningException $e) {
            Log::warning('resi_mart.provision.deferred', [
                'partner_id' => $partner->id,
                'slug' => $partner->slug,
                'message' => $e->getMessage(),
                'context' => $e->context,
            ]);
        }
    }

    /**
     * @return array{partner_id: int, slug: string, name: string, subdomain: string, custom_domain: ?string, owner_email: ?string, categories: list<string>}
     */
    private function buildProvisionPayload(Partner $partner): array
    {
        $baseHost = trim((string) config('services.resi_mart.tenant_base_host', 'localhost'), '.');
        $subdomain = strtolower($partner->slug.($baseHost !== '' ? '.'.$baseHost : ''));

        $customDomain = $partner->custom_domain !== null
            ? strtolower(trim($partner->custom_domain))
            : null;

        if ($customDomain === $subdomain) {
            $customDomain = null;
        }

        return [
            'partner_id' => $partner->id,
            'slug' => $partner->slug,
            'name' => $partner->name,
            'subdomain' => $subdomain,
            'custom_domain' => $customDomain,
            'owner_email' => $partner->owner_email,
            'categories' => $partner->categories ?? [],
        ];
    }
}
