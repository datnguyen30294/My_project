<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\Partner\Controllers;

use App\Common\Controllers\BaseController;
use App\Common\Exceptions\BusinessException;
use App\Modules\Marketplace\Partner\Contracts\PartnerServiceInterface;
use App\Modules\Marketplace\Partner\ExternalServices\ResiMartProvisioningException;
use App\Modules\Marketplace\Partner\Requests\AttachTenantPartnerRequest;
use App\Modules\Marketplace\Partner\Requests\CreateTenantPartnerRequest;
use App\Modules\Marketplace\Partner\Requests\DetachTenantPartnerRequest;
use App\Modules\Marketplace\Partner\Requests\ListTenantPartnerRequest;
use App\Modules\Marketplace\Partner\Requests\UpdateTenantPartnerRequest;
use App\Modules\Marketplace\Partner\Resources\PartnerDetailResource;
use App\Modules\Marketplace\Partner\Resources\PartnerListResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

/**
 * @tags Marketplace Partners (Tenant)
 */
class TenantPartnerController extends BaseController
{
    public function __construct(
        protected PartnerServiceInterface $service,
    ) {}

    /**
     * List marketplace partners owned by the current tenant.
     */
    public function index(ListTenantPartnerRequest $request): AnonymousResourceCollection
    {
        return PartnerListResource::collection(
            $this->service->listForTenant($this->currentTenantId(), $request->validated()),
        )->additional(['success' => true]);
    }

    /**
     * Catalog of active vendors the current tenant can add to its projects.
     * Each row includes an `is_linked` flag.
     */
    public function catalog(ListTenantPartnerRequest $request): AnonymousResourceCollection
    {
        return PartnerListResource::collection(
            $this->service->catalogForTenant($this->currentTenantId(), $request->validated()),
        )->additional(['success' => true]);
    }

    /**
     * Get a partner owned by the current tenant.
     */
    public function show(int $id): PartnerDetailResource
    {
        return new PartnerDetailResource(
            $this->service->findByIdForTenant($id, $this->currentTenantId()),
        );
    }

    /**
     * Create a new partner owned by the current tenant.
     */
    public function store(CreateTenantPartnerRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['actor_id'] = $request->user()?->id;

        return (new PartnerDetailResource(
            $this->service->createForTenant($this->currentTenantId(), $data),
        ))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * Update a partner owned by the current tenant.
     */
    public function update(UpdateTenantPartnerRequest $request, int $id): PartnerDetailResource
    {
        $data = $request->validated();
        $data['actor_id'] = $request->user()?->id;

        return new PartnerDetailResource(
            $this->service->updateForTenant($id, $this->currentTenantId(), $data),
        );
    }

    /**
     * Soft-delete a partner owned by the current tenant. Provisioned vendors
     * cannot be deleted by tenants — they must contact Platform admin.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->service->deleteForTenant($id, $this->currentTenantId());

        return response()->json(['success' => true], Response::HTTP_NO_CONTENT);
    }

    /**
     * Link an existing active vendor to one or more of the tenant's projects.
     * No ownership required — the vendor may belong to another PMC or platform.
     */
    public function attach(AttachTenantPartnerRequest $request, int $id): PartnerDetailResource
    {
        /** @var list<int> $projectIds */
        $projectIds = $request->validated('project_ids');

        return new PartnerDetailResource(
            $this->service->attachForTenant(
                $id,
                $this->currentTenantId(),
                $projectIds,
                $request->user()?->id,
            ),
        );
    }

    /**
     * Unlink a vendor from one or more of the tenant's projects. Blocked when
     * a targeted project still has an active commission contract.
     */
    public function detach(DetachTenantPartnerRequest $request, int $id): PartnerDetailResource
    {
        /** @var list<int> $projectIds */
        $projectIds = $request->validated('project_ids');

        return new PartnerDetailResource(
            $this->service->detachForTenant(
                $id,
                $this->currentTenantId(),
                $projectIds,
                $request->user()?->id,
            ),
        );
    }

    /**
     * Retry resi_mart provisioning for a partner whose create-time call
     * failed. Available only to the partner's owner tenant.
     *
     * @throws BusinessException when resi_mart still cannot be reached
     */
    public function provision(int $id): PartnerDetailResource
    {
        try {
            return new PartnerDetailResource(
                $this->service->provisionForTenant($id, $this->currentTenantId()),
            );
        } catch (ResiMartProvisioningException $e) {
            throw new BusinessException(
                message: 'Không thể kích hoạt shop trên resi_mart: '.$e->getMessage(),
                errorCode: 'RESI_MART_UNAVAILABLE',
                httpStatusCode: Response::HTTP_BAD_GATEWAY,
                context: $e->context,
                previous: $e,
            );
        }
    }

    /**
     * Resolve the current tenant id (string slug). Always present because
     * the route is mounted behind the `tenant` + `tenant.vendor_enabled`
     * middleware chain.
     */
    protected function currentTenantId(): string
    {
        $tenant = function_exists('tenant') ? tenant() : null;

        if (! $tenant) {
            throw new BusinessException(
                message: 'Không xác định được tenant hiện tại.',
                errorCode: 'TENANT_NOT_RESOLVED',
                httpStatusCode: Response::HTTP_FORBIDDEN,
            );
        }

        return (string) $tenant->getKey();
    }
}
