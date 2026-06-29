<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOffer\Repositories;

use App\Modules\Marketplace\VendorOffer\Models\VendorOffer;
use App\Modules\Marketplace\VendorOrder\Support\ResiMartConnection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

/**
 * Read-only repository for a vendor's resi_mart product catalog (`products`)
 * plus the per-project offer count (`product_project`). Caller MUST switch the
 * connection to the vendor's schema first (see {@see ResiMartConnection}).
 */
class VendorOfferRepository
{
    /**
     * Paginate the vendor's offers (products) flattened by listing scope: one
     * row per (product × project) it is published to, read from the
     * `product_project` pivot. Products not yet assigned to any project still
     * appear once (LEFT JOIN) with null `link_*` columns. The pivot's
     * `tenant_id` / `project_id` resolve to PMC names in the service layer.
     *
     * Filters: `search` (name/sku), `type`, `status`, `page`, `per_page`.
     *
     * @param  array<string, mixed>  $filters
     */
    public function listForPartner(array $filters): LengthAwarePaginator
    {
        $query = VendorOffer::query()
            ->from('products as p')
            ->leftJoin('product_project as pp', 'pp.product_id', '=', 'p.id')
            ->select(
                'p.*',
                'pp.tenant_id as link_tenant_id',
                'pp.project_id as link_project_id',
                'pp.is_active as link_is_active',
            );

        if (! empty($filters['search'])) {
            $term = '%'.$filters['search'].'%';
            $query->where(function ($q) use ($term): void {
                $q->where('p.name', 'ilike', $term)
                    ->orWhere('p.sku', 'ilike', $term);
            });
        }

        if (! empty($filters['type'])) {
            $query->where('p.type', (string) $filters['type']);
        }

        if (! empty($filters['status'])) {
            $query->where('p.status', (string) $filters['status']);
        }

        $perPage = min((int) ($filters['per_page'] ?? 20), 50);

        return $query->orderByDesc('p.published_at')
            ->orderByDesc('p.id')
            ->orderBy('pp.project_id')
            ->paginate($perPage);
    }

    /**
     * Total number of offers (products) in the vendor's catalog — drives the
     * console list `offer_count`.
     */
    public function countForPartner(): int
    {
        return VendorOffer::query()->count();
    }

    /**
     * Number of active products of the vendor on a (PMC tenant, project) pair,
     * read from the `product_project` pivot in the vendor's resi_mart schema.
     */
    public function countActiveForProject(string $tenantId, int $projectId): int
    {
        return (int) DB::connection(ResiMartConnection::TENANT_CONNECTION)
            ->table('product_project')
            ->where('tenant_id', $tenantId)
            ->where('project_id', $projectId)
            ->where('is_active', true)
            ->count();
    }
}
