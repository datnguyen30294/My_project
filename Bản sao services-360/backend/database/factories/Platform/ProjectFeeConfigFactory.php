<?php

namespace Database\Factories\Platform;

use App\Modules\Platform\Tenant\Enums\SubscriptionCycle;
use App\Modules\Platform\Tenant\Enums\TenantFeeMode;
use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\Platform\Tenant\Models\ProjectFeeConfig;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProjectFeeConfig>
 */
class ProjectFeeConfigFactory extends Factory
{
    protected $model = ProjectFeeConfig::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'organization_id' => Organization::factory(),
            'project_id' => $this->faker->unique()->numberBetween(1, 100000),
            'inherit_default' => true,
            'fee_mode' => null,
            'fixed_fee_per_order' => 0,
            'percent_fee_per_order' => 0,
            'subscription_amount' => 0,
            'subscription_cycle' => null,
            'platform_service_enabled' => true,
            'notes' => null,
        ];
    }

    public function serviceDisabled(): static
    {
        return $this->state(fn (array $attributes): array => [
            'platform_service_enabled' => false,
        ]);
    }

    public function percentOverride(float $percent = 0.5): static
    {
        return $this->state(fn (array $attributes): array => [
            'inherit_default' => false,
            'fee_mode' => TenantFeeMode::PercentPerOrder,
            'percent_fee_per_order' => $percent,
        ]);
    }

    public function fixedOverride(float $fixed = 20000): static
    {
        return $this->state(fn (array $attributes): array => [
            'inherit_default' => false,
            'fee_mode' => TenantFeeMode::FixedPerOrder,
            'fixed_fee_per_order' => $fixed,
        ]);
    }

    public function subscriptionOverride(float $amount = 2000000): static
    {
        return $this->state(fn (array $attributes): array => [
            'inherit_default' => false,
            'fee_mode' => TenantFeeMode::Subscription,
            'subscription_amount' => $amount,
            'subscription_cycle' => SubscriptionCycle::Monthly,
        ]);
    }
}
