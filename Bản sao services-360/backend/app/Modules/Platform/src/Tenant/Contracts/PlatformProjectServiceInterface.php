<?php

namespace App\Modules\Platform\Tenant\Contracts;

use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Console phía platform để quản trị toàn bộ dự án trên nền tảng. Gộp dự án từ
 * mọi schema tenant, tạo dự án mới vào schema tenant đã chọn, và cấu hình phí
 * nền tảng riêng theo dự án.
 */
interface PlatformProjectServiceInterface
{
    /**
     * Danh sách dự án toàn nền tảng (gộp cross-tenant) + stats.
     *
     * @param  array<string, mixed>  $filters
     * @return array{
     *     paginator: LengthAwarePaginator,
     *     stats: array{total: int, managing: int, tenant_count: int, service_disabled: int}
     * }
     */
    public function list(array $filters): array;

    /**
     * Tạo dự án mới vào schema của tenant. 422 nếu tenant inactive hoặc trùng mã.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function create(string $tenantId, array $data): array;

    /**
     * Chi tiết một dự án (thông tin + tenant). 404 nếu tenant/project không tồn tại.
     *
     * @return array<string, mixed>
     */
    public function detail(string $tenantId, int $projectId): array;

    /**
     * Số liệu kinh doanh N tháng của một dự án.
     *
     * @return array<string, mixed>
     */
    public function businessSummary(string $tenantId, int $projectId, int $months): array;

    /**
     * Đơn hàng PMC của một dự án (kèm phí nền tảng đã đóng băng), phân trang.
     *
     * @param  array<string, mixed>  $filters
     */
    public function orders(string $tenantId, int $projectId, array $filters): LengthAwarePaginator;

    /**
     * Đánh giá cư dân theo dự án + summary.
     *
     * @param  array<string, mixed>  $filters
     * @return array{summary: array{average: float|null, count: int}, paginator: LengthAwarePaginator}
     */
    public function residentRatings(string $tenantId, int $projectId, array $filters): array;

    /**
     * Cấu hình phí dự án (override + effective + tenant_default).
     *
     * @return array<string, mixed>
     */
    public function getFeeConfig(string $tenantId, int $projectId): array;

    /**
     * Cập nhật cấu hình phí dự án và trả về cấu hình đã resolve.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function updateFeeConfig(string $tenantId, int $projectId, array $data): array;
}
