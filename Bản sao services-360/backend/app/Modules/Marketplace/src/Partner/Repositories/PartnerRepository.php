<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\Partner\Repositories;

use App\Common\Repositories\BaseRepository;
use App\Modules\Marketplace\Partner\Enums\PartnerStatus;
use App\Modules\Marketplace\Partner\Models\Partner;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class PartnerRepository extends BaseRepository
{
    public function __construct()
    {
        parent::__construct(new Partner);
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
     * List partners scoped to a single owner tenant.
     *
     * @param  array<string, mixed>  $filters
     */
    public function listOwnedBy(string $ownerTenantId, array $filters): LengthAwarePaginator
    {
        return $this->buildListQuery($filters)
            ->where('owner_tenant_id', $ownerTenantId)
            ->paginate($this->getPerPage($filters));
    }

    /**
     * Catalog of vendors a PMC tenant can add to its projects: every `active`
     * partner, regardless of which tenant owns it.
     *
     * @param  array<string, mixed>  $filters
     */
    public function listCatalog(array $filters): LengthAwarePaginator
    {
        return $this->buildListQuery($filters)
            ->where('status', PartnerStatus::Active->value)
            ->paginate($this->getPerPage($filters));
    }

    /**
     * Partners a PMC tenant works with: ones it owns, plus ones it has linked
     * to at least one of its projects via the `partner_project` pivot.
     *
     * @param  list<int>  $linkedPartnerIds
     * @param  array<string, mixed>  $filters
     */
    public function listVisibleToTenant(string $tenantId, array $linkedPartnerIds, array $filters): LengthAwarePaginator
    {
        return $this->buildListQuery($filters)
            ->where(function ($query) use ($tenantId, $linkedPartnerIds): void {
                $query->where('owner_tenant_id', $tenantId);

                if ($linkedPartnerIds !== []) {
                    $query->orWhereIn('id', $linkedPartnerIds);
                }
            })
            ->paginate($this->getPerPage($filters));
    }

    /**
     * Count partners grouped by status (excludes soft-deleted). Drives the
     * console stats cards.
     *
     * @return array<string, int>
     */
    public function statusCounts(): array
    {
        /** @var array<string, int> */
        return $this->newQuery()
            ->selectRaw('status, COUNT(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status')
            ->map(fn ($v) => (int) $v)
            ->all();
    }

    public function findBySlug(string $slug): ?Partner
    {
        /** @var Partner|null */
        return $this->newQuery()->where('slug', $slug)->first();
    }

    public function findByIdOrNull(int $id): ?Partner
    {
        /** @var Partner|null */
        return $this->newQuery()->where('id', $id)->first();
    }

    public function findByIdOwnedBy(int $id, string $ownerTenantId): ?Partner
    {
        /** @var Partner|null */
        return $this->newQuery()
            ->where('id', $id)
            ->where('owner_tenant_id', $ownerTenantId)
            ->first();
    }

    /**
     * Load a set of partners by id (excludes soft-deleted).
     *
     * @param  list<int>  $ids
     * @return Collection<int, Partner>
     */
    public function findByIds(array $ids): Collection
    {
        if ($ids === []) {
            return new Collection;
        }

        /** @var Collection<int, Partner> */
        return $this->newQuery()
            ->whereIn('id', $ids)
            ->get();
    }

    /**
     * Partners đã provision (có schema resi_mart) mà tenant hiện tại nhìn thấy:
     * platform-owned (owner_tenant_id = null) hoặc do chính tenant sở hữu.
     *
     * @return Collection<int, Partner>
     */
    public function allProvisionedVisibleTo(string $tenantId): Collection
    {
        /** @var Collection<int, Partner> */
        return $this->newQuery()
            ->whereNotNull('tenant_id')
            ->where(function ($query) use ($tenantId): void {
                $query->whereNull('owner_tenant_id')
                    ->orWhere('owner_tenant_id', $tenantId);
            })
            ->orderBy('name')
            ->get();
    }

    /**
     * Mọi partner đã provision (có schema resi_mart) — platform-wide, không scope
     * theo tenant. Phục vụ aggregate cross-tenant của Platform/Report.
     *
     * @return Collection<int, Partner>
     */
    public function allPlatformPartners(): Collection
    {
        /** @var Collection<int, Partner> */
        return $this->newQuery()
            ->whereNotNull('tenant_id')
            ->orderBy('name')
            ->get();
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return \Illuminate\Database\Eloquent\Builder<Partner>
     */
    protected function buildListQuery(array $filters): \Illuminate\Database\Eloquent\Builder
    {
        $query = $this->newQuery();

        if (! empty($filters['search'])) {
            $query->search((string) $filters['search']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', (string) $filters['status']);
        }

        if (! empty($filters['category'])) {
            $query->whereJsonContains('categories', (string) $filters['category']);
        }

        if (array_key_exists('provisioned', $filters) && $filters['provisioned'] !== null) {
            $filters['provisioned']
                ? $query->whereNotNull('tenant_id')
                : $query->whereNull('tenant_id');
        }

        if (! empty($filters['owner_source'])) {
            $filters['owner_source'] === 'platform'
                ? $query->whereNull('owner_tenant_id')
                : $query->whereNotNull('owner_tenant_id');
        }

        $this->applySorting($query, $filters);

        return $query;
    }
}
