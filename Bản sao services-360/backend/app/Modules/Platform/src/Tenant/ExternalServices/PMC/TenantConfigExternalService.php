<?php

declare(strict_types=1);

namespace App\Modules\Platform\Tenant\ExternalServices\PMC;

use App\Modules\Platform\Tenant\Enums\TenantFeeMode;
use App\Modules\Platform\Tenant\Models\TenantConfig;
use App\Modules\Platform\Tenant\Repositories\ProjectFeeConfigRepository;

class TenantConfigExternalService implements TenantConfigExternalServiceInterface
{
    public function __construct(
        protected ProjectFeeConfigRepository $projectFeeConfigRepository,
    ) {}

    public function getLimitsForCurrentTenant(): ?TenantPlanLimits
    {
        $config = $this->currentTenantConfig();

        if ($config === null) {
            return null;
        }

        return new TenantPlanLimits(
            maxProjects: (int) $config->max_projects,
            maxAccounts: (int) $config->max_accounts,
            sessionTimeoutMinutes: (int) $config->session_timeout_minutes,
            residentPortalEnabled: (bool) $config->resident_portal_enabled,
            partnerPortalEnabled: (bool) $config->partner_portal_enabled,
            enabledModules: $config->enabled_modules === null
                ? null
                : array_values(array_map('strval', $config->enabled_modules)),
        );
    }

    public function getFeePolicyForCurrentTenant(): ?TenantFeePolicy
    {
        $config = $this->currentTenantConfig();

        if ($config === null) {
            return null;
        }

        return new TenantFeePolicy(
            mode: $config->fee_mode instanceof TenantFeeMode
                ? $config->fee_mode
                : TenantFeeMode::from((string) $config->fee_mode),
            fixedPerOrder: (float) $config->fixed_fee_per_order,
            percentPerOrder: (float) $config->percent_fee_per_order,
        );
    }

    public function getFeePolicyForProject(int $projectId): ?TenantFeePolicy
    {
        $tenant = tenant();

        if ($tenant !== null) {
            $override = $this->projectFeeConfigRepository->findForProject(
                (string) $tenant->getTenantKey(),
                $projectId,
            );

            if ($override !== null && ! $override->inherit_default) {
                return new TenantFeePolicy(
                    mode: $override->fee_mode ?? TenantFeeMode::None,
                    fixedPerOrder: (float) $override->fixed_fee_per_order,
                    percentPerOrder: (float) $override->percent_fee_per_order,
                );
            }
        }

        return $this->getFeePolicyForCurrentTenant();
    }

    private function currentTenantConfig(): ?TenantConfig
    {
        $tenant = tenant();

        if ($tenant === null) {
            return null;
        }

        return TenantConfig::query()
            ->where('tenant_id', $tenant->getTenantKey())
            ->first();
    }
}
