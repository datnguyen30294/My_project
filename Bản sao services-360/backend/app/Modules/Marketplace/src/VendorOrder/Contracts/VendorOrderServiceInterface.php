<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOrder\Contracts;

use Carbon\CarbonInterface;

interface VendorOrderServiceInterface
{
    /**
     * List orders + commission breakdown cho 1 vendor trong context tenant
     * hiện tại. Filter: from/to (Carbon), project_id, search, page, per_page.
     *
     * @param  array<string, mixed>  $filters
     * @return array{
     *     data: \Illuminate\Pagination\LengthAwarePaginator,
     *     warnings: array{orphan_orders_count:int, non_per_order_orders_count:int, schema_missing:bool},
     *     project_id_map: array<int, string>,
     *     decorated: array<int, array{order: object, project_name: string, commission: array}>
     * }
     */
    public function listForPartner(
        int $partnerId,
        string $scopeTenantId,
        array $filters,
    ): array;

    /**
     * List orders + commission breakdown của TẤT CẢ vendor mà tenant hiện tại
     * nhìn thấy (gom cross-schema, merge + paginate in-memory). Filter:
     * from/to (Carbon), partner_id, project_id, search, page, per_page.
     *
     * @param  array<string, mixed>  $filters
     * @return array{
     *     data: \Illuminate\Pagination\LengthAwarePaginator,
     *     warnings: array{orphan_orders_count:int, non_per_order_orders_count:int, schema_missing:bool},
     *     decorated: array<int, array{order: object, vendor: array, project_name: string, commission: array}>
     * }
     */
    public function listAllForTenant(
        string $scopeTenantId,
        array $filters,
    ): array;

    /**
     * @return array{
     *     from:string, to:string,
     *     orders_count:int, revenue_total:float, commission_total:float,
     *     average_commission_per_order:float, currency:string, vendors_count:int,
     *     warnings: array{orphan_orders_count:int, non_per_order_orders_count:int, schema_missing:bool}
     * }
     */
    public function getSummaryAllForTenant(
        string $scopeTenantId,
        array $filters,
    ): array;

    /**
     * @return array{
     *     order: object,
     *     project: array{id:int, name:string},
     *     commission: array|null
     * }|null
     */
    public function getDetail(
        int $partnerId,
        string $scopeTenantId,
        int $orderId,
    ): ?array;

    /**
     * @return array{
     *     from:string, to:string,
     *     orders_count:int, revenue_total:float, commission_total:float,
     *     average_commission_per_order:float, currency:string,
     *     warnings: array{orphan_orders_count:int, non_per_order_orders_count:int, schema_missing:bool}
     * }
     */
    public function getSummary(
        int $partnerId,
        string $scopeTenantId,
        ?CarbonInterface $from = null,
        ?CarbonInterface $to = null,
    ): array;

    /**
     * Platform scope — list orders + commission của 1 vendor across MỌI PMC
     * tenant (đọc trong 1 schema resi_mart của vendor, match contract theo
     * (tenant_id, project_id, completed_at)). Filter: from/to (Carbon),
     * tenant_id, project_id, search, page, per_page.
     *
     * @param  array<string, mixed>  $filters
     * @return array{
     *     data: \Illuminate\Pagination\LengthAwarePaginator,
     *     warnings: array{orphan_orders_count:int, non_per_order_orders_count:int, schema_missing:bool},
     *     decorated: array<int, array{order: object, tenant: array, project_name: string, commission: array}>
     * }
     */
    public function listForPartnerPlatform(int $partnerId, array $filters): array;

    /**
     * Platform scope — chi tiết 1 đơn của vendor (không giới hạn tenant).
     *
     * @return array{
     *     order: object,
     *     tenant: array{id:string, name:string|null},
     *     project: array{id:int, name:string},
     *     commission: array|null
     * }|null
     */
    public function getDetailPlatform(int $partnerId, int $orderId): ?array;

    /**
     * Platform scope — tổng đơn / doanh thu / hoa hồng của vendor across mọi
     * tenant trong range.
     *
     * @return array{
     *     from:string, to:string,
     *     orders_count:int, revenue_total:float, commission_total:float,
     *     average_commission_per_order:float, currency:string,
     *     warnings: array{orphan_orders_count:int, non_per_order_orders_count:int, schema_missing:bool}
     * }
     */
    public function getSummaryPlatform(
        int $partnerId,
        ?CarbonInterface $from = null,
        ?CarbonInterface $to = null,
    ): array;

    /**
     * Platform scope — doanh thu / số đơn / hoa hồng theo tháng của vendor
     * trong `$months` tháng gần nhất.
     *
     * @return array{
     *     months: list<array{month:string, revenue:float, order_count:int, commission:float}>,
     *     currency:string,
     *     warnings: array{schema_missing:bool}
     * }
     */
    public function getRevenueTrendPlatform(int $partnerId, int $months = 6): array;

    /**
     * Console Platform — list ĐỌC-CHỈ gộp đơn vendor cross-vendor + cross-tenant
     * (mọi vendor đã provision, mọi PMC tenant, MỌI trạng thái) trong cửa sổ
     * `created_at`. Hoa hồng chỉ cho đơn completed khớp hợp đồng per_order
     * (`commission = null` cho phần còn lại). Phân trang in-memory.
     *
     * Filter: from/to, partner_id, tenant_id, project_id, type, status, search,
     * page, per_page.
     *
     * @param  array<string, mixed>  $filters
     * @return array{
     *     data: \Illuminate\Pagination\LengthAwarePaginator,
     *     warnings: array{orphan_orders_count:int, non_per_order_orders_count:int, schema_missing:bool},
     *     decorated: array<int, array{order: object, vendor: array, tenant: array, project_name: string, type: string, commission: array|null}>
     * }
     */
    public function listAllOrdersPlatform(array $filters): array;

    /**
     * Console Platform — 4 thẻ tổng hợp khớp với {@see listAllOrdersPlatform}:
     * orders_count / product_count / service_count / gmv / commission split /
     * vendors_count + warnings.
     *
     * Filter: from/to, partner_id, tenant_id, project_id, type, status, search.
     *
     * @param  array<string, mixed>  $filters
     * @return array{
     *     from:string, to:string,
     *     orders_count:int, product_count:int, service_count:int,
     *     gmv:float, commission_platform:float, commission_operating_company:float,
     *     commission_total:float, vendors_count:int, currency:string,
     *     warnings: array{orphan_orders_count:int, non_per_order_orders_count:int, schema_missing:bool}
     * }
     */
    public function getSummaryAllOrdersPlatform(array $filters): array;

    /**
     * Console Platform — gán/cập nhật hoa hồng THỦ CÔNG cho 1 đơn vendor đã
     * hoàn thành nhưng không khớp hợp đồng per_order (đơn "mồ côi"). Trả về
     * chi tiết đơn đã cập nhật (như {@see getDetailPlatform}).
     *
     * @param  array<string, mixed>  $data  source(contract|manual), contract_id|fixed/percent/revenue_recipient, note
     * @return array<string, mixed>
     */
    public function assignCommissionOverride(int $partnerId, int $orderId, array $data): array;

    /**
     * Console Platform — gỡ hoa hồng gán thủ công khỏi 1 đơn vendor.
     */
    public function removeCommissionOverride(int $partnerId, int $orderId): void;

    /**
     * Console Platform — override trạng thái 1 đơn vendor (ghi qua S2S resi_mart,
     * KHÔNG cross-DB). Trả về chi tiết đơn đã cập nhật (như {@see getDetailPlatform}).
     *
     * @return array<string, mixed>
     */
    public function updateOrderStatusPlatform(int $partnerId, int $orderId, string $status, ?string $reason = null): array;

    /**
     * Flat feed các đơn completed (đã match contract PerOrder) của TẤT CẢ vendor
     * tenant quản lý, phục vụ tổng hợp báo cáo (summary / theo vendor / theo dự án
     * / theo thời gian). Không phân trang. Filter: from/to, partner_id, project_id.
     *
     * @param  array<string, mixed>  $filters
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
    public function getCompletedOrdersForReport(
        string $scopeTenantId,
        array $filters,
    ): array;
}
