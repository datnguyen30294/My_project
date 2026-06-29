<?php

declare(strict_types=1);

namespace App\Modules\PMC\Order\ExternalServices\Platform;

use App\Modules\Platform\Tenant\Models\Organization;

interface TenantBusinessSummaryExternalServiceInterface
{
    /**
     * Số liệu kinh doanh N tháng gần nhất của một tenant, đọc trong schema tenant:
     * doanh thu + số đơn (đơn PMC `completed`) và phí nền tảng đã đóng băng
     * (`closing_period_orders.frozen_platform_fee`). Gom tháng theo `orders.completed_at`,
     * tháng không phát sinh điền 0. `summary` = tổng cộng N tháng.
     *
     * Khi truyền `$projectId`, chỉ tính đơn của dự án đó (lọc qua
     * `quote.og_ticket.project_id`); mặc định null = toàn tenant (tương thích ngược).
     *
     * @return array{
     *     summary: array{tenant_revenue: float, order_count: int, platform_revenue: float},
     *     months: list<array{month: string, label: string, order_count: int, tenant_revenue: float, platform_fee: float}>
     * }
     */
    public function getMonthlyBusinessSummary(Organization $tenant, int $months, ?int $projectId = null): array;

    /**
     * Gom số liệu OG theo từng dự án trong N tháng gần nhất (đơn `completed`,
     * mốc `completed_at`): số đơn, doanh thu (`total_amount`), phí nền tảng đã
     * đóng băng, và đánh giá cư dân (`og_tickets.resident_rating`). Mỗi dự án có
     * ≥1 đơn → một phần tử; đơn không gắn dự án bị bỏ qua. Đọc trong schema tenant.
     *
     * @return list<array{
     *     project_id: int,
     *     project_name: string,
     *     order_count: int,
     *     revenue: int,
     *     platform_fee: int,
     *     rating_sum: int,
     *     rated_count: int
     * }>
     */
    public function getProjectBusinessBreakdown(Organization $tenant, int $months): array;
}
