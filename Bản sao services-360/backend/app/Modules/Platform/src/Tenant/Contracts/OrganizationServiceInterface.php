<?php

namespace App\Modules\Platform\Tenant\Contracts;

use App\Modules\Platform\Tenant\Models\Organization;
use Illuminate\Pagination\LengthAwarePaginator;

interface OrganizationServiceInterface
{
    /**
     * @param  array<string, mixed>  $filters
     */
    public function list(array $filters): LengthAwarePaginator;

    public function findById(string $id): Organization;

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Organization;

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(string $id, array $data): Organization;

    public function delete(string $id): void;

    /**
     * Toggle the `is_vendor_enabled` flag on a tenant.
     */
    public function toggleVendorFeature(string $id, bool $enabled): Organization;

    /**
     * Activate / deactivate a tenant.
     */
    public function toggleActive(string $id, bool $isActive): Organization;

    /**
     * Update tenant limits, platform fees and enabled modules.
     *
     * @param  array<string, mixed>  $data
     */
    public function updateConfig(string $id, array $data): Organization;

    /**
     * @return array{total: int, active: int, inactive: int}
     */
    public function stats(): array;
}
