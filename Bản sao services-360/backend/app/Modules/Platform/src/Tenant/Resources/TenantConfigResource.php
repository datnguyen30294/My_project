<?php

namespace App\Modules\Platform\Tenant\Resources;

use App\Common\Resources\BaseResource;
use App\Modules\Platform\Tenant\Models\TenantConfig;
use Illuminate\Http\Request;

/**
 * @mixin TenantConfig
 */
class TenantConfigResource extends BaseResource
{
    /**
     * @return array{
     *     max_projects: int,
     *     max_accounts: int,
     *     session_timeout_minutes: int,
     *     resident_portal_enabled: bool,
     *     partner_portal_enabled: bool,
     *     fee_mode: array{value: string, label: string},
     *     subscription_cycle: array{value: string, label: string},
     *     subscription_amount: string,
     *     fixed_fee_per_order: string,
     *     percent_fee_per_order: string,
     *     enabled_modules: list<string>|null,
     * }
     */
    public function toArray(Request $request): array
    {
        return [
            /** @var int */
            'max_projects' => $this->max_projects,
            /** @var int */
            'max_accounts' => $this->max_accounts,
            /** @var int */
            'session_timeout_minutes' => $this->session_timeout_minutes,
            /** @var bool */
            'resident_portal_enabled' => $this->resident_portal_enabled,
            /** @var bool */
            'partner_portal_enabled' => $this->partner_portal_enabled,
            'fee_mode' => ['value' => $this->fee_mode->value, 'label' => $this->fee_mode->label()],
            'subscription_cycle' => ['value' => $this->subscription_cycle->value, 'label' => $this->subscription_cycle->label()],
            'subscription_amount' => $this->subscription_amount,
            'fixed_fee_per_order' => $this->fixed_fee_per_order,
            'percent_fee_per_order' => $this->percent_fee_per_order,
            /** @var list<string>|null */
            'enabled_modules' => $this->enabled_modules,
        ];
    }
}
