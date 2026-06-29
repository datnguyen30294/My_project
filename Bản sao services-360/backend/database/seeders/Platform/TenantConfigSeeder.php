<?php

namespace Database\Seeders\Platform;

use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\Platform\Tenant\Models\TenantConfig;
use Illuminate\Database\Seeder;

class TenantConfigSeeder extends Seeder
{
    /**
     * Backfill a default config for every tenant that does not have one yet.
     * Idempotent: tenants that already have a config are skipped.
     */
    public function run(): void
    {
        Organization::query()
            ->whereDoesntHave('config')
            ->each(function (Organization $organization): void {
                TenantConfig::query()->create(array_merge(
                    ['tenant_id' => $organization->getTenantKey()],
                    TenantConfig::defaults(),
                ));
            });
    }
}
