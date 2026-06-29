<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOrder\ExternalServices;

interface VendorOrderReportExternalServiceInterface
{
    /**
     * Flat feed các đơn vendor completed (đã match contract PerOrder) cho tenant
     * hiện tại, phục vụ tổng hợp báo cáo phía PMC mà không import Model trực tiếp.
     *
     * Resolve tenant hiện tại nội bộ — consumer không cần biết tenancy.
     *
     * @param  array<string, mixed>  $filters  from/to (Y-m-d|null), partner_id, project_id
     * @return array{
     *     from: string,
     *     to: string,
     *     currency: string,
     *     rows: list<array{
     *         vendor_id: int,
     *         vendor_name: string,
     *         project_id: int,
     *         project_name: string,
     *         completed_at: string,
     *         revenue: float,
     *         commission: float
     *     }>,
     *     warnings: array{orphan_orders_count:int, non_per_order_orders_count:int, schema_missing:bool}
     * }
     */
    public function getCompletedOrdersForReport(array $filters): array;
}
