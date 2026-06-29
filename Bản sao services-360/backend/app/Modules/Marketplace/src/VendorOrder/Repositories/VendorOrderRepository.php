<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOrder\Repositories;

use App\Modules\Marketplace\VendorOrder\Enums\VendorOrderStatus;
use App\Modules\Marketplace\VendorOrder\Models\VendorOrder;
use Carbon\CarbonInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * Read-only repository — đảm nhiệm mọi query đọc orders từ schema
 * tenant_<vendor_slug>. Caller phải switch schema trước khi gọi
 * (qua {@see \App\Modules\Marketplace\VendorOrder\Support\ResiMartConnection}).
 */
class VendorOrderRepository
{
    /**
     * @param  array<int, int>  $projectIds
     * @param  array<string, mixed>  $filters  from/to (Carbon), search, project_id, page, per_page
     */
    public function listForPartner(array $projectIds, array $filters): LengthAwarePaginator
    {
        $query = VendorOrder::query()
            ->with(['customer', 'items'])
            ->where('status', VendorOrderStatus::Completed->value)
            ->whereIn('project_id', $projectIds);

        if (isset($filters['project_id']) && $filters['project_id'] !== null) {
            $query->where('project_id', (int) $filters['project_id']);
        }

        if (! empty($filters['from'])) {
            $query->where('completed_at', '>=', $filters['from']);
        }

        if (! empty($filters['to'])) {
            $query->where('completed_at', '<=', $filters['to']);
        }

        if (! empty($filters['search'])) {
            $query->where('code', 'ilike', '%'.$filters['search'].'%');
        }

        $perPage = min((int) ($filters['per_page'] ?? 20), 50);

        return $query->orderByDesc('completed_at')->paginate($perPage);
    }

    /**
     * Lấy toàn bộ orders hoàn thành trong range kèm customer + items (không
     * phân trang) — phục vụ aggregate nhiều vendor rồi merge + paginate in-memory.
     *
     * @param  array<int, int>  $projectIds
     * @param  array<string, mixed>  $filters  from/to (Carbon), search, project_id
     * @return \Illuminate\Support\Collection<int, VendorOrder>
     */
    public function allInRangeWithDetails(array $projectIds, array $filters)
    {
        $query = VendorOrder::query()
            ->with(['customer', 'items'])
            ->where('status', VendorOrderStatus::Completed->value)
            ->whereIn('project_id', $projectIds);

        if (isset($filters['project_id']) && $filters['project_id'] !== null) {
            $query->where('project_id', (int) $filters['project_id']);
        }

        if (! empty($filters['from'])) {
            $query->where('completed_at', '>=', $filters['from']);
        }

        if (! empty($filters['to'])) {
            $query->where('completed_at', '<=', $filters['to']);
        }

        if (! empty($filters['search'])) {
            $query->where('code', 'ilike', '%'.$filters['search'].'%');
        }

        return $query->orderByDesc('completed_at')->get();
    }

    public function findById(int $orderId, array $projectIds): ?VendorOrder
    {
        return VendorOrder::query()
            ->with(['customer', 'items'])
            ->where('id', $orderId)
            ->whereIn('project_id', $projectIds)
            ->where('status', VendorOrderStatus::Completed->value)
            ->first();
    }

    /**
     * Platform variant — toàn bộ đơn hoàn thành của vendor (mọi PMC tenant),
     * lọc optional theo tenant_id + project_id. Caller đã switch sang schema
     * resi_mart của vendor.
     *
     * @param  array<string, mixed>  $filters  from/to (Carbon), search, tenant_id, project_id, page, per_page
     */
    public function listAllForPartner(array $filters): LengthAwarePaginator
    {
        $perPage = min((int) ($filters['per_page'] ?? 20), 50);

        return $this->buildAllForPartnerQuery($filters)
            ->with(['customer', 'items'])
            ->orderByDesc('completed_at')
            ->paginate($perPage);
    }

    /**
     * Platform detail — 1 đơn theo id, không giới hạn project, MỌI trạng thái.
     * Caller đã switch schema. Console đọc-chỉ cần xem được đơn pending/cancelled
     * nên KHÔNG ràng buộc `status = completed` (khác list completed-only cũ).
     */
    public function findByIdForPartner(int $orderId): ?VendorOrder
    {
        return VendorOrder::query()
            ->with(['customer', 'items'])
            ->where('id', $orderId)
            ->first();
    }

    /**
     * Console Platform — MỌI đơn (cross-tenant) của vendor trong cửa sổ
     * `created_at`, kèm code + items + customer để dựng từng row chuẩn hoá.
     * Caller đã switch sang schema resi_mart của vendor.
     *
     * Bao MỌI trạng thái nghiệp vụ (pending/confirmed/completed/cancelled) —
     * giới hạn `whereIn(status, VendorOrderStatus::values())` để loại các status
     * resi_mart-only (vd "shipping") vốn sẽ làm enum cast ném lỗi. Lọc tuỳ chọn
     * theo tenant_id / project_id / status / search ở mức query; `type` (suy ra)
     * lọc in-memory ở service.
     *
     * @param  array<string, mixed>  $filters  from/to (Carbon), tenant_id, project_id, status, search
     * @return \Illuminate\Support\Collection<int, VendorOrder>
     */
    public function listAllForConsole(array $filters)
    {
        $query = VendorOrder::query()
            ->with(['customer', 'items'])
            ->whereIn('status', VendorOrderStatus::values());

        if (! empty($filters['status'])) {
            $query->where('status', (string) $filters['status']);
        }

        if (! empty($filters['tenant_id'])) {
            $query->where('tenant_id', (string) $filters['tenant_id']);
        }

        if (isset($filters['project_id']) && $filters['project_id'] !== null && $filters['project_id'] !== '') {
            $query->where('project_id', (int) $filters['project_id']);
        }

        if (! empty($filters['from'])) {
            $query->where('created_at', '>=', $filters['from']);
        }

        if (! empty($filters['to'])) {
            $query->where('created_at', '<=', $filters['to']);
        }

        if (! empty($filters['search'])) {
            $query->where('code', 'ilike', '%'.$filters['search'].'%');
        }

        return $query->orderByDesc('created_at')->get();
    }

    /**
     * Platform summary — đọc id/tenant_id/project_id/total/completed_at của mọi
     * đơn hoàn thành trong range để match contract cross-tenant.
     *
     * @return \Illuminate\Support\Collection<int, VendorOrder>
     */
    public function allForPartnerCommission(CarbonInterface $from, CarbonInterface $to)
    {
        return VendorOrder::query()
            ->where('status', VendorOrderStatus::Completed->value)
            ->whereBetween('completed_at', [$from, $to])
            ->get(['id', 'project_id', 'tenant_id', 'total', 'completed_at']);
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return \Illuminate\Database\Eloquent\Builder<VendorOrder>
     */
    private function buildAllForPartnerQuery(array $filters): \Illuminate\Database\Eloquent\Builder
    {
        $query = VendorOrder::query()
            ->where('status', VendorOrderStatus::Completed->value);

        if (! empty($filters['tenant_id'])) {
            $query->where('tenant_id', (string) $filters['tenant_id']);
        }

        if (isset($filters['project_id']) && $filters['project_id'] !== null && $filters['project_id'] !== '') {
            $query->where('project_id', (int) $filters['project_id']);
        }

        if (! empty($filters['from'])) {
            $query->where('completed_at', '>=', $filters['from']);
        }

        if (! empty($filters['to'])) {
            $query->where('completed_at', '<=', $filters['to']);
        }

        if (! empty($filters['search'])) {
            $query->where('code', 'ilike', '%'.$filters['search'].'%');
        }

        return $query;
    }

    /**
     * Đếm tổng số đơn hoàn thành của vendor (mọi tenant/dự án). Caller đã switch
     * sang schema resi_mart của vendor. Phục vụ `order_count` ở console list.
     */
    public function countAllCompleted(): int
    {
        return VendorOrder::query()
            ->where('status', VendorOrderStatus::Completed->value)
            ->count();
    }

    /**
     * Đếm số đơn hoàn thành của vendor trên (PMC tenant, project). Caller đã
     * switch sang schema resi_mart của vendor.
     */
    public function countCompletedForProject(string $tenantId, int $projectId): int
    {
        return VendorOrder::query()
            ->where('tenant_id', $tenantId)
            ->where('project_id', $projectId)
            ->where('status', VendorOrderStatus::Completed->value)
            ->count();
    }

    /**
     * @param  array<int, int>  $projectIds
     * @return array{count:int, revenue_total:float}
     */
    public function summaryForPartner(
        array $projectIds,
        CarbonInterface $from,
        CarbonInterface $to,
    ): array {
        $row = VendorOrder::query()
            ->where('status', VendorOrderStatus::Completed->value)
            ->whereIn('project_id', $projectIds)
            ->whereBetween('completed_at', [$from, $to])
            ->selectRaw('COUNT(*) AS cnt, COALESCE(SUM(total), 0) AS revenue')
            ->first();

        return [
            'count' => (int) ($row->cnt ?? 0),
            'revenue_total' => (float) ($row->revenue ?? 0),
        ];
    }

    /**
     * Lấy tất cả orders trong khoảng thời gian — phục vụ aggregate commission
     * (cần đọc completed_at + project_id + total để match contract).
     *
     * @param  array<int, int>  $projectIds
     * @return \Illuminate\Support\Collection<int, VendorOrder>
     */
    public function allInRangeForCommission(
        array $projectIds,
        CarbonInterface $from,
        CarbonInterface $to,
    ) {
        return VendorOrder::query()
            ->where('status', VendorOrderStatus::Completed->value)
            ->whereIn('project_id', $projectIds)
            ->whereBetween('completed_at', [$from, $to])
            ->get(['id', 'project_id', 'total', 'completed_at']);
    }

    /**
     * Platform-wide aggregation fact-set: MỌI đơn của vendor (mọi PMC tenant,
     * MỌI trạng thái) tạo trong range, kèm items (item_type/product_name) +
     * customer (full_name) để dựng từng row chuẩn hoá. Caller đã switch sang
     * schema resi_mart của vendor. Read-only — chỉ chọn các cột ĐANG tồn tại.
     *
     * CỐ Ý lệch khỏi {@see VendorOrderService::getSummaryPlatform()} (vốn lọc
     * completed-only window theo completed_at): các báo cáo tổng hợp cần đếm
     * completion_rate / cancel_rate / scorecard nên fact-set phải mang đủ mọi
     * trạng thái, window theo created_at.
     *
     * `$withReviews` chỉ bật khi schema vendor có bảng `order_reviews` (caller
     * kiểm tra qua ResiMartConnection::tableExists) — eager-load review đã
     * publish để dựng CSAT, degrade null khi resi_mart chưa migrate.
     *
     * @return \Illuminate\Support\Collection<int, VendorOrder>
     */
    public function allInRangeForAggregation(CarbonInterface $from, CarbonInterface $to, bool $withReviews = false)
    {
        return VendorOrder::query()
            ->with($withReviews ? ['items', 'customer', 'review'] : ['items', 'customer'])
            ->whereBetween('created_at', [$from, $to])
            ->orderByDesc('created_at')
            ->get([
                'id',
                'project_id',
                'tenant_id',
                'customer_id',
                'status',
                'total',
                'ordered_at',
                'completed_at',
                'created_at',
            ]);
    }
}
