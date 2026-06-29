<?php

namespace App\Modules\Platform\Tenant\Repositories;

use App\Common\Repositories\BaseRepository;
use App\Modules\Platform\Tenant\Models\Organization;
use Illuminate\Pagination\LengthAwarePaginator;

class OrganizationRepository extends BaseRepository
{
    public function __construct()
    {
        parent::__construct(new Organization);
    }

    /**
     * @param  array<string, mixed>  $filters
     */
    public function list(array $filters): LengthAwarePaginator
    {
        $query = $this->newQuery()->with('domains');

        if (! empty($filters['search'])) {
            $query->search((string) $filters['search']);
        }

        if (array_key_exists('is_active', $filters) && $filters['is_active'] !== null) {
            $query->where('is_active', (bool) $filters['is_active']);
        }

        if (array_key_exists('is_organization', $filters) && $filters['is_organization'] !== null) {
            $query->where('is_organization', (bool) $filters['is_organization']);
        }

        if (! empty($filters['service_plan'])) {
            $query->where('service_plan', (string) $filters['service_plan']);
        }

        $this->applySorting($query, $filters);

        return $query->paginate($this->getPerPage($filters));
    }

    /** @return \Illuminate\Support\Collection<int, \App\Modules\Platform\Tenant\Models\Organization> */
    public function allOrganizations(): \Illuminate\Support\Collection
    {
        return $this->newQuery()->where('is_organization', true)->get();
    }

    /**
     * MỌI tenant trong bảng, không lọc `is_organization` lẫn `is_active` — dùng cho
     * báo cáo tổng hợp cross-tenant: phủ cả công ty đã vô hiệu (giữ doanh thu lịch sử
     * + hiển thị trạng thái) và tenant chưa gắn cờ `is_organization`.
     *
     * @return \Illuminate\Support\Collection<int, \App\Modules\Platform\Tenant\Models\Organization>
     */
    public function allTenants(): \Illuminate\Support\Collection
    {
        return $this->newQuery()->get();
    }

    /**
     * Mọi tenant đang hoạt động (is_active=true), không lọc theo `is_organization` —
     * dùng cho các console gộp cross-tenant cần phủ MỌI công ty vận hành có dữ liệu.
     *
     * @return \Illuminate\Support\Collection<int, \App\Modules\Platform\Tenant\Models\Organization>
     */
    public function allActiveTenants(): \Illuminate\Support\Collection
    {
        return $this->newQuery()->active()->get();
    }

    /**
     * @return array{total: int, active: int, inactive: int}
     */
    public function stats(): array
    {
        $total = $this->newQuery()->count();
        $active = $this->newQuery()->where('is_active', true)->count();

        return [
            'total' => $total,
            'active' => $active,
            'inactive' => $total - $active,
        ];
    }
}
