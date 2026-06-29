<?php

declare(strict_types=1);

namespace App\Modules\PMC\Customer\ExternalServices\Platform;

use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\PMC\Customer\Repositories\CustomerRepository;

class TenantCustomerCountExternalService implements TenantCustomerCountExternalServiceInterface
{
    public function __construct(private readonly CustomerRepository $customerRepository) {}

    public function countResidentsForTenant(Organization $tenant): int
    {
        return (int) $tenant->run(fn (): int => $this->customerRepository->countAll());
    }
}
