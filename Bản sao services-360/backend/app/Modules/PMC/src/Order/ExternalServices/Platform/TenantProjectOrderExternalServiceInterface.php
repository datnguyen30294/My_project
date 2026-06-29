<?php

declare(strict_types=1);

namespace App\Modules\PMC\Order\ExternalServices\Platform;

use App\Modules\Platform\Tenant\Models\Organization;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface TenantProjectOrderExternalServiceInterface
{
    /**
     * MỌI đơn PMC của một tenant (đọc trong schema tenant), không khoá theo dự án —
     * phục vụ console gộp cross-tenant "Đơn hàng OG". Kèm khách hàng + dự án (qua
     * `order → quote → og_ticket`) và phí nền tảng đã đóng băng
     * (`closing_period_orders.frozen_platform_fee`, 0 nếu chưa vào kỳ chốt).
     *
     * Trả về list row thuần (KHÔNG kèm tenant — phía Platform tự gắn) để tầng gọi
     * gom cross-tenant rồi tự phân trang. Mặc định mới nhất trước.
     *
     * @param  array{from?: string, to?: string, status?: string, search?: string}  $filters
     * @return Collection<int, array{
     *     id: int,
     *     code: string,
     *     subject: string|null,
     *     project_id: int|null,
     *     project_name: string|null,
     *     customer_name: string|null,
     *     customer_phone: string|null,
     *     total_amount: string,
     *     platform_fee: string,
     *     status: array{value: string, label: string},
     *     created_at: string|null,
     *     completed_at: string|null,
     * }>
     */
    public function listTenantOrders(Organization $tenant, array $filters): Collection;

    /**
     * Đơn PMC của một dự án (đọc trong schema tenant), kèm phí nền tảng đã đóng
     * băng (`closing_period_orders.frozen_platform_fee`, 0 nếu chưa vào kỳ chốt).
     * Liên kết đơn ↔ dự án qua `order → quote → og_ticket.project_id`.
     * Mặc định mới nhất trước.
     *
     * @param  array<string, mixed>  $filters
     * @return LengthAwarePaginator<int, array{
     *     id: int,
     *     code: string,
     *     total_amount: string,
     *     status: array{value: string, label: string},
     *     platform_fee: string,
     *     completed_at: string|null,
     * }>
     */
    public function listProjectOrders(Organization $tenant, int $projectId, array $filters): LengthAwarePaginator;
}
