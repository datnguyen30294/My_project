<?php

declare(strict_types=1);

namespace App\Modules\Platform\Tenant\ExternalServices\Marketplace;

/**
 * Bridge để Marketplace module resolve tên tenant + tên project (cross-tenant)
 * mà không import trực tiếp Organization / Project model.
 */
interface OrganizationLookupExternalServiceInterface
{
    /**
     * Tên hiển thị của các tenant theo id (slug).
     *
     * @param  array<int, string>  $tenantIds
     * @return array<string, string> keyed by tenant id → name
     */
    public function getTenantNames(array $tenantIds): array;

    /**
     * Tên các project trong DB của một tenant cụ thể. Trả rỗng nếu tenant
     * không tồn tại.
     *
     * @param  array<int, int>  $projectIds
     * @return array<int, string> keyed by project_id → name
     */
    public function getProjectNamesForTenant(string $tenantId, array $projectIds): array;
}
