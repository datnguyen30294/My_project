<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\PartnerCommissionContract\Services;

use App\Common\Services\BaseService;
use App\Modules\Marketplace\PartnerCommissionContract\Contracts\PartnerCommissionContractServiceInterface;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\CommissionMode;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\ContractCreatedScope;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\ContractStatus;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\RevenueRecipient;
use App\Modules\Marketplace\PartnerCommissionContract\Exceptions\ContractImmutableException;
use App\Modules\Marketplace\PartnerCommissionContract\Exceptions\InvalidContractTransitionException;
use App\Modules\Marketplace\PartnerCommissionContract\Models\PartnerCommissionContract;
use App\Modules\Marketplace\PartnerCommissionContract\Repositories\PartnerCommissionContractRepository;
use App\Modules\Marketplace\PartnerProject\Repositories\PartnerProjectRepository;
use App\Modules\Platform\Tenant\ExternalServices\Marketplace\OrganizationLookupExternalServiceInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class PartnerCommissionContractService extends BaseService implements PartnerCommissionContractServiceInterface
{
    public function __construct(
        protected PartnerCommissionContractRepository $repository,
        protected OrganizationLookupExternalServiceInterface $orgLookup,
        protected PartnerProjectRepository $partnerProjectRepository,
    ) {}

    /**
     * @param  array<string, mixed>  $filters
     */
    public function listForPlatform(array $filters): LengthAwarePaginator
    {
        $paginator = $this->repository->list($filters);

        $this->decorateNames($paginator->getCollection());

        return $paginator;
    }

    /**
     * @param  array<string, mixed>  $filters
     */
    public function listForTenant(string $tenantId, int $partnerId, int $projectId, array $filters): LengthAwarePaginator
    {
        return $this->repository->listForScope($tenantId, $partnerId, $projectId, $filters);
    }

    public function getDetail(int $id): PartnerCommissionContract
    {
        /** @var PartnerCommissionContract */
        return $this->repository->findById($id, ['*'], ['partner']);
    }

    public function getDetailForPlatform(int $id): PartnerCommissionContract
    {
        $contract = $this->getDetail($id);

        $this->decorateNames(collect([$contract]));

        return $contract;
    }

    /**
     * Gắn tên tenant + tên project (resolve cross-tenant) vào mỗi contract để
     * resource render — phục vụ platform scope nơi 1 vendor trải nhiều tenant.
     *
     * @param  Collection<int, PartnerCommissionContract>  $contracts
     */
    private function decorateNames(Collection $contracts): void
    {
        if ($contracts->isEmpty()) {
            return;
        }

        $tenantIds = $contracts
            ->pluck('tenant_id')
            ->filter(fn ($v) => $v !== null && $v !== '')
            ->unique()
            ->values()
            ->all();

        $tenantNames = $this->orgLookup->getTenantNames($tenantIds);

        $projectNames = [];

        foreach ($contracts->groupBy('tenant_id') as $tenantId => $group) {
            if ($tenantId === null || $tenantId === '') {
                continue;
            }

            $projectIds = $group
                ->pluck('project_id')
                ->filter()
                ->map(fn ($v) => (int) $v)
                ->unique()
                ->values()
                ->all();

            $projectNames[$tenantId] = $this->orgLookup->getProjectNamesForTenant((string) $tenantId, $projectIds);
        }

        foreach ($contracts as $contract) {
            $contract->tenant_name = $tenantNames[$contract->tenant_id] ?? null;
            $contract->project_name = $projectNames[$contract->tenant_id][(int) $contract->project_id] ?? null;
        }
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function createDraft(array $data, ?int $actorId = null): PartnerCommissionContract
    {
        return $this->executeInTransaction(function () use ($data, $actorId): PartnerCommissionContract {
            $payload = [
                'contract_code' => $data['contract_code'] ?? $this->generateContractCode(),
                'partner_id' => (int) $data['partner_id'],
                'tenant_id' => (string) $data['tenant_id'],
                'project_id' => (int) $data['project_id'],
                'commission_mode' => $data['commission_mode'],
                'terms' => $data['terms'],
                'revenue_recipient' => $data['revenue_recipient'] ?? RevenueRecipient::Platform->value,
                'status' => ContractStatus::Draft->value,
                'starts_at' => $data['starts_at'] ?? null,
                'ends_at' => $data['ends_at'] ?? null,
                'notes' => $data['notes'] ?? null,
                'created_scope' => $data['created_scope'] ?? ContractCreatedScope::Platform->value,
                'created_by' => $actorId,
            ];

            /** @var PartnerCommissionContract */
            return $this->repository->create($payload);
        });
    }

    /**
     * Apply one "default" commission terms set across every project the vendor
     * is linked to: fan-out one draft contract per (tenant, project) scope.
     * Scopes that already have a live contract are skipped unless
     * `skip_existing` is explicitly false.
     *
     * @param  array<string, mixed>  $data
     * @return array{
     *     created: list<PartnerCommissionContract>,
     *     skipped: list<array{tenant_id: string, project_id: int}>,
     * }
     */
    public function bulkCreateDefaults(int $partnerId, array $data, ?int $actorId = null): array
    {
        $skipExisting = ! array_key_exists('skip_existing', $data) || (bool) $data['skip_existing'];

        $scopes = $this->partnerProjectRepository->listScopesForPartner($partnerId);

        $created = [];
        $skipped = [];

        foreach ($scopes as $scope) {
            $tenantId = (string) $scope->tenant_id;
            $projectId = (int) $scope->project_id;

            if ($skipExisting && $this->repository->hasNonTerminalFor($partnerId, $tenantId, $projectId)) {
                $skipped[] = ['tenant_id' => $tenantId, 'project_id' => $projectId];

                continue;
            }

            $created[] = $this->createDraft([
                'partner_id' => $partnerId,
                'tenant_id' => $tenantId,
                'project_id' => $projectId,
                'commission_mode' => $data['commission_mode'],
                'terms' => $data['terms'],
                'revenue_recipient' => $data['revenue_recipient'] ?? RevenueRecipient::Platform->value,
                'starts_at' => $data['starts_at'] ?? null,
                'ends_at' => $data['ends_at'] ?? null,
                'notes' => $data['notes'] ?? null,
                'created_scope' => ContractCreatedScope::Platform->value,
            ], $actorId);
        }

        return ['created' => $created, 'skipped' => $skipped];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function updateDraft(int $id, array $data, ?int $actorId = null): PartnerCommissionContract
    {
        return $this->executeInTransaction(function () use ($id, $data, $actorId): PartnerCommissionContract {
            /** @var PartnerCommissionContract $contract */
            $contract = $this->repository->findById($id);

            if (! $contract->status->isEditable()) {
                throw new ContractImmutableException(
                    message: 'Chỉ hợp đồng đang ở trạng thái Nháp mới được sửa toàn bộ.',
                    context: ['current_status' => $contract->status->value],
                );
            }

            $payload = array_filter([
                'partner_id' => isset($data['partner_id']) ? (int) $data['partner_id'] : null,
                'tenant_id' => $data['tenant_id'] ?? null,
                'project_id' => isset($data['project_id']) ? (int) $data['project_id'] : null,
                'commission_mode' => $data['commission_mode'] ?? null,
                'terms' => $data['terms'] ?? null,
                'revenue_recipient' => $data['revenue_recipient'] ?? null,
                'starts_at' => $data['starts_at'] ?? null,
                'ends_at' => array_key_exists('ends_at', $data) ? $data['ends_at'] : null,
                'notes' => array_key_exists('notes', $data) ? $data['notes'] : null,
                'contract_code' => array_key_exists('contract_code', $data) ? $data['contract_code'] : null,
                'updated_by' => $actorId,
            ], fn ($v) => $v !== null);

            if ($payload !== []) {
                $contract->update($payload);
            }

            return $contract->refresh();
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function updatePendingNotes(int $id, array $data, ?int $actorId = null): PartnerCommissionContract
    {
        return $this->executeInTransaction(function () use ($id, $data, $actorId): PartnerCommissionContract {
            /** @var PartnerCommissionContract $contract */
            $contract = $this->repository->findById($id);

            if (! $contract->status->isNonFinancialEditable()) {
                throw new ContractImmutableException(
                    message: 'Chỉ hợp đồng ở trạng thái Nháp hoặc Chờ kích hoạt mới được sửa.',
                    context: ['current_status' => $contract->status->value],
                );
            }

            $payload = array_filter([
                'contract_code' => array_key_exists('contract_code', $data) ? $data['contract_code'] : null,
                'notes' => array_key_exists('notes', $data) ? $data['notes'] : null,
                'updated_by' => $actorId,
            ], fn ($v) => $v !== null);

            if ($payload !== []) {
                $contract->update($payload);
            }

            return $contract->refresh();
        });
    }

    public function discardDraft(int $id, ?int $actorId = null): void
    {
        $this->executeInTransaction(function () use ($id, $actorId): void {
            /** @var PartnerCommissionContract $contract */
            $contract = $this->repository->findById($id);

            if (! $contract->status->isEditable()) {
                throw new InvalidContractTransitionException(
                    message: 'Chỉ hợp đồng ở trạng thái Nháp mới có thể xoá.',
                    context: ['current_status' => $contract->status->value],
                );
            }

            if ($actorId !== null) {
                $contract->update(['deleted_by' => $actorId]);
            }

            // Hard delete drafts — they never reached pending so no audit need.
            $contract->forceDelete();
        });
    }

    public function sign(int $id, ?int $actorId = null): PartnerCommissionContract
    {
        return $this->executeInTransaction(function () use ($id, $actorId): PartnerCommissionContract {
            /** @var PartnerCommissionContract $contract */
            $contract = $this->repository->findById($id);

            if ($contract->status !== ContractStatus::Draft) {
                throw InvalidContractTransitionException::from($contract->status, ContractStatus::Pending);
            }

            $contract->update([
                'status' => ContractStatus::Pending->value,
                'signed_at' => now(),
                'signed_by' => $actorId,
                'updated_by' => $actorId,
            ]);

            return $contract->refresh();
        });
    }

    public function revokePending(int $id, string $reason, ?int $actorId = null): PartnerCommissionContract
    {
        return $this->executeInTransaction(function () use ($id, $reason, $actorId): PartnerCommissionContract {
            /** @var PartnerCommissionContract $contract */
            $contract = $this->repository->findById($id);

            if ($contract->status !== ContractStatus::Pending) {
                throw InvalidContractTransitionException::from($contract->status, ContractStatus::Revoked);
            }

            $contract->update([
                'status' => ContractStatus::Revoked->value,
                'cancelled_at' => now(),
                'cancelled_by' => $actorId,
                'cancellation_reason' => $reason,
                'updated_by' => $actorId,
            ]);

            return $contract->refresh();
        });
    }

    public function switchTo(int $pendingContractId, ?int $actorId = null): PartnerCommissionContract
    {
        /** @var PartnerCommissionContract $pending */
        $pending = $this->repository->findById($pendingContractId);

        $effective = $pending->getCurrentStatus();

        if ($effective === ContractStatus::Expired) {
            throw new InvalidContractTransitionException(
                message: 'Hợp đồng đã hết hạn, không thể kích hoạt.',
                context: ['contract_id' => $pending->id],
            );
        }

        if ($pending->status !== ContractStatus::Pending) {
            throw InvalidContractTransitionException::from($pending->status, ContractStatus::Active);
        }

        $callback = function () use ($pending, $actorId): PartnerCommissionContract {
            $current = $this->repository->findActiveFor(
                $pending->partner_id,
                $pending->tenant_id,
                $pending->project_id,
            );

            if ($current !== null && $current->id !== $pending->id) {
                $current->update([
                    'status' => ContractStatus::Replaced->value,
                    'replaced_at' => now(),
                    'replaced_by_contract_id' => $pending->id,
                    'updated_by' => $actorId,
                ]);
            }

            $pending->update([
                'status' => ContractStatus::Active->value,
                'activated_at' => now(),
                'updated_by' => $actorId,
            ]);

            return $pending->refresh();
        };

        if ($pending->getConnectionName() === 'central') {
            return DB::connection('central')->transaction($callback);
        }

        return $this->executeInTransaction($callback);
    }

    public function cancelActive(int $id, string $reason, ?int $actorId = null): PartnerCommissionContract
    {
        return $this->executeInTransaction(function () use ($id, $reason, $actorId): PartnerCommissionContract {
            /** @var PartnerCommissionContract $contract */
            $contract = $this->repository->findById($id);

            if ($contract->status !== ContractStatus::Active) {
                throw InvalidContractTransitionException::from($contract->status, ContractStatus::Cancelled);
            }

            $contract->update([
                'status' => ContractStatus::Cancelled->value,
                'cancelled_at' => now(),
                'cancelled_by' => $actorId,
                'cancellation_reason' => $reason,
                'updated_by' => $actorId,
            ]);

            return $contract->refresh();
        });
    }

    public function getActiveContractFor(int $partnerId, string $tenantId, int $projectId): ?PartnerCommissionContract
    {
        $contract = $this->repository->findActiveFor($partnerId, $tenantId, $projectId);

        if ($contract === null) {
            return null;
        }

        // Lazy expiry — an active contract whose ends_at is past is treated as expired.
        if ($contract->getCurrentStatus() === ContractStatus::Expired) {
            return null;
        }

        return $contract;
    }

    /**
     * @return Collection<int, PartnerCommissionContract>
     */
    public function getHistoryFor(int $partnerId, string $tenantId, int $projectId): Collection
    {
        return $this->repository->getHistoryFor($partnerId, $tenantId, $projectId);
    }

    /**
     * Generate a `HD-YYYY-NNNN` contract code, with NNNN auto-incremented per
     * calendar year based on existing codes (soft-deleted included).
     */
    protected function generateContractCode(): string
    {
        $year = (int) now()->format('Y');
        $latest = $this->repository->findLatestCodeForYear($year);

        $seq = 1;

        if ($latest !== null && preg_match('/HD-\d{4}-(\d+)$/', $latest, $matches) === 1) {
            $seq = (int) $matches[1] + 1;
        }

        return sprintf('HD-%04d-%04d', $year, $seq);
    }

    /**
     * Internal helper to look up commission mode enum.
     */
    public function resolveMode(string $value): ?CommissionMode
    {
        return CommissionMode::tryFrom($value);
    }
}
