<?php

declare(strict_types=1);

namespace App\Modules\PMC\Project\ExternalServices\Platform;

use App\Modules\Platform\Tenant\Models\Organization;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Bridge để Platform đọc/ghi danh sách dự án nằm trong tenant schema mà không
 * import trực tiếp Project model của PMC. Chỉ trả các field hiển thị — KHÔNG lộ
 * thông tin ngân hàng BQT (`bqt_bank_*`).
 *
 * Lưu ý lịch sử: bản đầu (spec `du-an-gan-tenant`) là read-only tuyệt đối.
 * Console "Dự án trên nền tảng" cho phép platform TẠO dự án vào schema tenant
 * đã chọn (`createProject`), nên không còn read-only tuyệt đối.
 */
interface TenantProjectExternalServiceInterface
{
    /**
     * Danh sách dự án của tenant, phân trang, mặc định sắp xếp theo tên ASC.
     *
     * @param  array<string, mixed>  $filters
     * @return LengthAwarePaginator<int, array{
     *     id: int,
     *     code: string,
     *     name: string,
     *     address: string|null,
     *     status: array{value: string, label: string},
     * }>
     */
    public function listProjects(Organization $tenant, array $filters): LengthAwarePaginator;

    /**
     * Toàn bộ dự án của tenant (không phân trang) để gộp danh sách toàn nền tảng.
     *
     * @return list<array{
     *     id: int,
     *     code: string,
     *     name: string,
     *     address: string|null,
     *     status: array{value: string, label: string},
     * }>
     */
    public function getProjectsForTenant(Organization $tenant): array;

    /**
     * Chi tiết một dự án trong schema tenant. Ném ModelNotFoundException (→ 404)
     * khi `projectId` không tồn tại trong schema tenant.
     *
     * @return array{
     *     id: int,
     *     code: string,
     *     name: string,
     *     address: string|null,
     *     status: array{value: string, label: string},
     * }
     */
    public function findProject(Organization $tenant, int $projectId): array;

    /**
     * Tạo dự án mới vào schema tenant. Chỉ set `code, name, address, status`;
     * các field BQT/khác để mặc định. Ném ValidationException (→ 422) khi trùng
     * `code` trong schema tenant.
     *
     * @param  array{code: string, name: string, address?: string|null, status?: string|null}  $data
     * @return array{
     *     id: int,
     *     code: string,
     *     name: string,
     *     address: string|null,
     *     status: array{value: string, label: string},
     * }
     */
    public function createProject(Organization $tenant, array $data): array;
}
