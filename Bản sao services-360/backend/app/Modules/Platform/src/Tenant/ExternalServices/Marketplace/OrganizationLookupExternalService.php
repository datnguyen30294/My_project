<?php

declare(strict_types=1);

namespace App\Modules\Platform\Tenant\ExternalServices\Marketplace;

use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\PMC\Project\Models\Project;

class OrganizationLookupExternalService implements OrganizationLookupExternalServiceInterface
{
    /**
     * @param  array<int, string>  $tenantIds
     * @return array<string, string>
     */
    public function getTenantNames(array $tenantIds): array
    {
        $ids = array_values(array_unique(array_filter($tenantIds, fn ($v) => $v !== null && $v !== '')));

        if ($ids === []) {
            return [];
        }

        return Organization::query()
            ->whereIn('id', $ids)
            ->pluck('name', 'id')
            ->map(fn ($name) => (string) $name)
            ->all();
    }

    /**
     * @param  array<int, int>  $projectIds
     * @return array<int, string>
     */
    public function getProjectNamesForTenant(string $tenantId, array $projectIds): array
    {
        $ids = array_values(array_unique(array_map('intval', $projectIds)));

        if ($ids === []) {
            return [];
        }

        $tenant = Organization::find($tenantId);

        if ($tenant === null) {
            return [];
        }

        // Best-effort: nếu DB tenant không truy cập được, resolve tên không phải
        // lý do để fail cả request — trả rỗng để caller fallback "Dự án #id".
        try {
            /** @var array<int, string> */
            return $tenant->run(function () use ($ids): array {
                return Project::query()
                    ->whereIn('id', $ids)
                    ->pluck('name', 'id')
                    ->mapWithKeys(fn ($name, $id) => [(int) $id => (string) $name])
                    ->all();
            });
        } catch (\Throwable) {
            return [];
        }
    }
}
