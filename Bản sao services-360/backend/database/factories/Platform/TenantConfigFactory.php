<?php

namespace Database\Factories\Platform;

use App\Modules\Platform\Tenant\Enums\SubscriptionCycle;
use App\Modules\Platform\Tenant\Enums\TenantFeeMode;
use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\Platform\Tenant\Models\TenantConfig;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TenantConfig>
 */
class TenantConfigFactory extends Factory
{
    protected $model = TenantConfig::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'tenant_id' => Organization::factory(),
            'max_projects' => 10,
            'max_accounts' => 50,
            'session_timeout_minutes' => 480,
            'resident_portal_enabled' => true,
            'partner_portal_enabled' => true,
            'fee_mode' => TenantFeeMode::None,
            'subscription_cycle' => SubscriptionCycle::Monthly,
            'subscription_amount' => 0,
            'fixed_fee_per_order' => 0,
            'percent_fee_per_order' => 0,
            'enabled_modules' => null,
        ];
    }

    public function subscription(): static
    {
        return $this->state(fn (array $attributes) => [
            'fee_mode' => TenantFeeMode::Subscription,
            'subscription_cycle' => SubscriptionCycle::Monthly,
            'subscription_amount' => 2000000,
        ]);
    }

    public function fixedPerOrder(): static
    {
        return $this->state(fn (array $attributes) => [
            'fee_mode' => TenantFeeMode::FixedPerOrder,
            'fixed_fee_per_order' => 1000,
        ]);
    }

    public function percentPerOrder(): static
    {
        return $this->state(fn (array $attributes) => [
            'fee_mode' => TenantFeeMode::PercentPerOrder,
            'percent_fee_per_order' => 5,
        ]);
    }

    public function both(): static
    {
        return $this->state(fn (array $attributes) => [
            'fee_mode' => TenantFeeMode::Both,
            'fixed_fee_per_order' => 1000,
            'percent_fee_per_order' => 5,
        ]);
    }
}
