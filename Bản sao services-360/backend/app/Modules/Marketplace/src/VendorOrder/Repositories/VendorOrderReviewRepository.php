<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOrder\Repositories;

use App\Modules\Marketplace\VendorOrder\Models\VendorOrderReview;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * Read-only repository cho `order_reviews` ở schema tenant_<vendor_slug> của
 * resi_mart. Caller phải switch schema trước khi gọi (qua
 * {@see \App\Modules\Marketplace\VendorOrder\Support\ResiMartConnection}) và
 * đảm bảo bảng `order_reviews` tồn tại (xem ResiMartConnection::tableExists()).
 *
 * Chỉ tính review đã PUBLISH (review ẩn / soft-deleted không vào CSAT — model
 * dùng SoftDeletes nên deleted_at tự loại).
 */
class VendorOrderReviewRepository
{
    /**
     * Trung bình sao + số lượt đánh giá đã publish trong schema hiện tại.
     *
     * @return array{average: float|null, count: int}
     */
    public function summaryForCurrentSchema(): array
    {
        $row = VendorOrderReview::query()
            ->where('status', 'published')
            ->selectRaw('COUNT(*) as cnt, AVG(rating) as avg_rating')
            ->first();

        $count = (int) ($row->cnt ?? 0);

        return [
            'average' => $count > 0 ? round((float) $row->avg_rating, 1) : null,
            'count' => $count,
        ];
    }

    /**
     * Danh sách review đã publish (mới nhất trước), kèm đơn (items + customer)
     * để dựng từng dòng đánh giá. Filters: rating (đúng số sao), project_id,
     * search (mã đơn / tên người đánh giá).
     *
     * @param  array<string, mixed>  $filters
     */
    public function paginateForCurrentSchema(array $filters): LengthAwarePaginator
    {
        $query = VendorOrderReview::query()
            ->where('status', 'published')
            ->with(['order.items', 'order.customer']);

        if (isset($filters['rating']) && $filters['rating'] !== null) {
            $query->where('rating', (int) $filters['rating']);
        }

        if (isset($filters['project_id']) && $filters['project_id'] !== null) {
            $query->whereHas('order', fn ($q) => $q->where('project_id', (int) $filters['project_id']));
        }

        if (! empty($filters['search'])) {
            $search = (string) $filters['search'];
            $query->where(function ($q) use ($search): void {
                $q->where('reviewer_name', 'ilike', "%{$search}%")
                    ->orWhereHas('order', fn ($o) => $o->where('code', 'ilike', "%{$search}%"));
            });
        }

        $perPage = (int) ($filters['per_page'] ?? 20);
        $page = (int) ($filters['page'] ?? 1);

        return $query
            ->orderByDesc('created_at')
            ->paginate($perPage, ['*'], 'page', $page);
    }
}
