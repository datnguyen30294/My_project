<?php

declare(strict_types=1);

namespace App\Modules\PMC\Account\ExternalServices\Platform;

use App\Modules\Platform\Tenant\Models\Organization;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Bridge để Platform quản lý tài khoản vận hành nằm trong tenant schema
 * mà không import trực tiếp Account model của PMC. Mọi method tự wrap
 * trong $tenant->run() và trả về array thuần.
 */
interface TenantAccountExternalServiceInterface
{
    /**
     * @param  array<string, mixed>  $filters
     * @return LengthAwarePaginator<int, array<string, mixed>>
     */
    public function listAccounts(Organization $tenant, array $filters): LengthAwarePaginator;

    /**
     * Dropdown options cho form tạo/sửa tài khoản từ platform.
     *
     * @return array{
     *     departments: list<array{id: int, name: string}>,
     *     job_titles: list<array{id: int, name: string}>,
     *     roles: list<array{id: int, name: string}>,
     * }
     */
    public function getFormOptions(Organization $tenant): array;

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function createAccount(Organization $tenant, array $data): array;

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function updateAccount(Organization $tenant, int $accountId, array $data): array;
}
