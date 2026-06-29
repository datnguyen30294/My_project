<?php

declare(strict_types=1);

namespace App\Modules\PMC\Customer\ExternalServices\Platform;

use App\Modules\Platform\Tenant\Models\Organization;

interface TenantCustomerCountExternalServiceInterface
{
    /**
     * Total residents (customers / danh bạ cư dân) in this tenant's schema.
     */
    public function countResidentsForTenant(Organization $tenant): int;
}
