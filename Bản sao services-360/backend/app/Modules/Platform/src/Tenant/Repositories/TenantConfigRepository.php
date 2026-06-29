<?php

namespace App\Modules\Platform\Tenant\Repositories;

use App\Common\Repositories\BaseRepository;
use App\Modules\Platform\Tenant\Models\TenantConfig;

class TenantConfigRepository extends BaseRepository
{
    public function __construct()
    {
        parent::__construct(new TenantConfig);
    }

    public function findByTenantId(string $tenantId): ?TenantConfig
    {
        /** @var TenantConfig|null */
        return $this->newQuery()->where('tenant_id', $tenantId)->first();
    }

    /**
     * Get the config for a tenant, creating it with defaults when missing
     * (backward compatibility for tenants created before configs existed).
     */
    public function findOrCreateForTenant(string $tenantId): TenantConfig
    {
        /** @var TenantConfig */
        return $this->newQuery()->firstOrCreate(
            ['tenant_id' => $tenantId],
            TenantConfig::defaults(),
        );
    }

    public function deleteByTenantId(string $tenantId): void
    {
        $this->newQuery()->where('tenant_id', $tenantId)->get()->each->delete();
    }
}
