<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\PartnerCommissionContract\Repositories;

use App\Common\Repositories\BaseRepository;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\ContractStatus;
use App\Modules\Marketplace\PartnerCommissionContract\Models\PartnerCommissionContract;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class PartnerCommissionContractRepository extends BaseRepository
{
    public function __construct()
    {
        parent::__construct(new PartnerCommissionContract);
    }

    /**
     * @param  array<string, mixed>  $filters
     */
    public function list(array $filters): LengthAwarePaginator
    {
        return $this->buildListQuery($filters)
            ->paginate($this->getPerPage($filters));
    }

    /**
     * List contracts scoped to a single (tenant, partner, project).
     *
     * @param  array<string, mixed>  $filters
     */
    public function listForScope(string $tenantId, int $partnerId, int $projectId, array $filters): LengthAwarePaginator
    {
        $query = $this->buildListQuery($filters)
            ->where('partner_id', $partnerId)
            ->where('tenant_id', $tenantId)
            ->where('project_id', $projectId);

        return $query->paginate($this->getPerPage($filters));
    }

    public function findActiveFor(int $partnerId, string $tenantId, int $projectId): ?PartnerCommissionContract
    {
        /** @var PartnerCommissionContract|null */
        return $this->newQuery()
            ->where('partner_id', $partnerId)
            ->where('tenant_id', $tenantId)
            ->where('project_id', $projectId)
            ->where('status', ContractStatus::Active->value)
            ->first();
    }

    /**
     * @return Collection<int, PartnerCommissionContract>
     */
    public function getHistoryFor(int $partnerId, string $tenantId, int $projectId): Collection
    {
        /** @var Collection<int, PartnerCommissionContract> */
        return $this->newQuery()
            ->where('partner_id', $partnerId)
            ->where('tenant_id', $tenantId)
            ->where('project_id', $projectId)
            ->orderByDesc('created_at')
            ->get();
    }

    public function findLatestCodeForYear(int $year): ?string
    {
        $prefix = sprintf('HD-%04d-', $year);

        /** @var string|null */
        return $this->model->newQueryWithoutScopes()
            ->where('contract_code', 'like', $prefix.'%')
            ->orderByDesc('contract_code')
            ->value('contract_code');
    }

    /**
     * Whether the (partner, tenant, project) scope already has a live contract
     * (draft / pending / active). Used by the bulk "default" fan-out to skip
     * scopes that already have a config when "don't override" is requested.
     */
    public function hasNonTerminalFor(int $partnerId, string $tenantId, int $projectId): bool
    {
        return $this->newQuery()
            ->where('partner_id', $partnerId)
            ->where('tenant_id', $tenantId)
            ->where('project_id', $projectId)
            ->whereIn('status', [
                ContractStatus::Draft->value,
                ContractStatus::Pending->value,
                ContractStatus::Active->value,
            ])
            ->exists();
    }

    public function countActiveOrPendingForPartner(int $partnerId): int
    {
        return $this->newQuery()
            ->where('partner_id', $partnerId)
            ->whereIn('status', [ContractStatus::Active->value, ContractStatus::Pending->value])
            ->count();
    }

    public function countActiveOrPendingForPartnerProject(int $partnerId, string $tenantId, int $projectId): int
    {
        return $this->newQuery()
            ->where('partner_id', $partnerId)
            ->where('tenant_id', $tenantId)
            ->where('project_id', $projectId)
            ->whereIn('status', [ContractStatus::Active->value, ContractStatus::Pending->value])
            ->count();
    }

    /**
     * Trả về các project_id (trong tập đã cho) còn contract đang `active` cho
     * partner trong tenant này. Dùng để chặn detach khi còn hoa hồng hiệu lực.
     *
     * @param  list<int>  $projectIds
     * @return list<int>
     */
    public function activeProjectIdsFor(int $partnerId, string $tenantId, array $projectIds): array
    {
        if ($projectIds === []) {
            return [];
        }

        /** @var list<int> */
        return $this->newQuery()
            ->where('partner_id', $partnerId)
            ->where('tenant_id', $tenantId)
            ->whereIn('project_id', array_values(array_unique(array_map('intval', $projectIds))))
            ->where('status', ContractStatus::Active->value)
            ->distinct()
            ->pluck('project_id')
            ->map(fn ($v) => (int) $v)
            ->values()
            ->all();
    }

    /**
     * Point-in-time lookup: trả contract đã active tại thời điểm $at.
     * Dùng tính bất biến của contract — activated_at / replaced_at là cố định.
     */
    public function findActiveAt(
        int $partnerId,
        string $tenantId,
        int $projectId,
        CarbonInterface $at,
    ): ?PartnerCommissionContract {
        /** @var PartnerCommissionContract|null */
        return $this->newQuery()
            ->where('partner_id', $partnerId)
            ->where('tenant_id', $tenantId)
            ->where('project_id', $projectId)
            ->where('activated_at', '<=', $at)
            ->where(function ($q) use ($at) {
                $q->whereNull('replaced_at')->orWhere('replaced_at', '>', $at);
            })
            ->whereIn('status', [
                ContractStatus::Active->value,
                ContractStatus::Replaced->value,
                ContractStatus::Expired->value,
                ContractStatus::Cancelled->value,
            ])
            ->orderByDesc('activated_at')
            ->first();
    }

    /**
     * Bulk: lấy hết contracts liên quan (partner, tenant, project_ids) để
     * caller match in-memory với từng order, tránh N+1.
     *
     * @param  array<int, int>  $projectIds
     * @return Collection<int, PartnerCommissionContract>
     */
    public function getCandidateContractsForLookup(
        int $partnerId,
        string $tenantId,
        array $projectIds,
    ): Collection {
        if ($projectIds === []) {
            return collect();
        }

        /** @var Collection<int, PartnerCommissionContract> */
        return $this->newQuery()
            ->where('partner_id', $partnerId)
            ->where('tenant_id', $tenantId)
            ->whereIn('project_id', $projectIds)
            ->whereNotNull('activated_at')
            ->whereIn('status', [
                ContractStatus::Active->value,
                ContractStatus::Replaced->value,
                ContractStatus::Expired->value,
                ContractStatus::Cancelled->value,
            ])
            ->orderBy('project_id')
            ->orderByDesc('activated_at')
            ->get();
    }

    /**
     * Platform-level variant của {@see getCandidateContractsForLookup}: lấy hết
     * candidate contracts của partner across MỌI tenant — để match order
     * cross-tenant theo (tenant_id, project_id, completed_at).
     *
     * @return Collection<int, PartnerCommissionContract>
     */
    public function getCandidateContractsForPartner(int $partnerId): Collection
    {
        /** @var Collection<int, PartnerCommissionContract> */
        return $this->newQuery()
            ->where('partner_id', $partnerId)
            ->whereNotNull('activated_at')
            ->whereIn('status', [
                ContractStatus::Active->value,
                ContractStatus::Replaced->value,
                ContractStatus::Expired->value,
                ContractStatus::Cancelled->value,
            ])
            ->orderBy('tenant_id')
            ->orderBy('project_id')
            ->orderByDesc('activated_at')
            ->get();
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return Builder<PartnerCommissionContract>
     */
    protected function buildListQuery(array $filters): Builder
    {
        $query = $this->newQuery()->with('partner');

        if (! empty($filters['search'])) {
            $query->search((string) $filters['search']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', (string) $filters['status']);
        }

        if (! empty($filters['commission_mode'])) {
            $query->where('commission_mode', (string) $filters['commission_mode']);
        }

        if (! empty($filters['partner_id'])) {
            $query->where('partner_id', (int) $filters['partner_id']);
        }

        if (! empty($filters['tenant_id'])) {
            $query->where('tenant_id', (string) $filters['tenant_id']);
        }

        if (! empty($filters['project_id'])) {
            $query->where('project_id', (int) $filters['project_id']);
        }

        $this->applySorting($query, $filters);

        return $query;
    }
}
