<?php

namespace Tests\Modules\Platform;

use App\Modules\Platform\Tenant\Enums\TenantFeeMode;
use App\Modules\Platform\Tenant\ExternalServices\PMC\TenantFeePolicy;
use Tests\TestCase;

class TenantFeePolicyTest extends TestCase
{
    public function test_none_mode_charges_nothing(): void
    {
        $policy = new TenantFeePolicy(TenantFeeMode::None, 5000, 0.5);

        $this->assertSame(0.0, $policy->computeForOrder(1000000));
        $this->assertSame(0.0, $policy->appliedFixed());
        $this->assertSame(0.0, $policy->appliedPercent());
    }

    public function test_subscription_mode_charges_no_per_order_fee(): void
    {
        $policy = new TenantFeePolicy(TenantFeeMode::Subscription, 5000, 0.5);

        $this->assertSame(0.0, $policy->computeForOrder(1000000));
    }

    public function test_fixed_mode_ignores_percent(): void
    {
        $policy = new TenantFeePolicy(TenantFeeMode::FixedPerOrder, 5000, 0.5);

        $this->assertSame(5000.0, $policy->computeForOrder(1000000));
        $this->assertSame(5000.0, $policy->appliedFixed());
        $this->assertSame(0.0, $policy->appliedPercent());
    }

    public function test_percent_mode_ignores_fixed(): void
    {
        $policy = new TenantFeePolicy(TenantFeeMode::PercentPerOrder, 5000, 0.5);

        // 0.5% of 1,000,000 = 5,000
        $this->assertSame(5000.0, $policy->computeForOrder(1000000));
        $this->assertSame(0.0, $policy->appliedFixed());
        $this->assertSame(0.5, $policy->appliedPercent());
    }

    public function test_both_mode_sums_fixed_and_percent(): void
    {
        $policy = new TenantFeePolicy(TenantFeeMode::Both, 5000, 0.5);

        // Trừ cứng trước, % trên phần còn lại:
        // 5,000 + 0.5% × (1,000,000 − 5,000 = 995,000 → 4,975) = 9,975
        $this->assertSame(9975.0, $policy->computeForOrder(1000000));
    }

    public function test_mode_value_returns_string(): void
    {
        $policy = new TenantFeePolicy(TenantFeeMode::Both, 0, 0);

        $this->assertSame('both', $policy->modeValue());
    }

    public function test_compute_rounds_to_two_decimals(): void
    {
        // 0.333% of 1,000 = 3.33 (rounded from 3.33)
        $policy = new TenantFeePolicy(TenantFeeMode::PercentPerOrder, 0, 0.333);

        $this->assertSame(3.33, $policy->computeForOrder(1000));
    }
}
