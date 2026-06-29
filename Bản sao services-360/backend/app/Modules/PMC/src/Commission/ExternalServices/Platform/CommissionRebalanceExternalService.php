<?php

declare(strict_types=1);

namespace App\Modules\PMC\Commission\ExternalServices\Platform;

use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\PMC\Commission\Contracts\CommissionConfigServiceInterface;

class CommissionRebalanceExternalService implements CommissionRebalanceExternalServiceInterface
{
    public function __construct(
        protected CommissionConfigServiceInterface $configService,
    ) {}

    public function rebalancePartyRulesForPlatformPercent(Organization $tenant, int $projectId, float $newPlatformPercent): void
    {
        $tenant->run(function () use ($projectId, $newPlatformPercent): void {
            $this->configService->rebalancePartyRulesToPlatformPercent($projectId, $newPlatformPercent);
        });
    }
}
