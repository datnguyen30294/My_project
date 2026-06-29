<?php

namespace Database\Factories\Platform;

use App\Modules\Marketplace\PartnerCommissionContract\Enums\CommissionMode;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\ContractCreatedScope;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\ContractStatus;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\RevenueRecipient;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\SubscriptionCycle;
use App\Modules\Marketplace\PartnerCommissionContract\Models\PartnerCommissionContract;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PartnerCommissionContract>
 */
class PartnerCommissionContractFactory extends Factory
{
    protected $model = PartnerCommissionContract::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $seq = 0;
        $seq++;

        return [
            'contract_code' => sprintf('HD-%04d-%04d', (int) now()->format('Y'), $seq),
            'partner_id' => 1,
            'tenant_id' => 'tnp',
            'project_id' => 1,
            'commission_mode' => CommissionMode::PerOrder->value,
            'terms' => $this->perOrderTerms(),
            'revenue_recipient' => RevenueRecipient::Platform->value,
            'status' => ContractStatus::Draft->value,
            'starts_at' => now(),
            'ends_at' => null,
            'created_scope' => ContractCreatedScope::Platform->value,
        ];
    }

    public function createdByTenant(): self
    {
        return $this->state(fn () => [
            'created_scope' => ContractCreatedScope::Tenant->value,
        ]);
    }

    public function pending(): self
    {
        return $this->state(fn () => [
            'status' => ContractStatus::Pending->value,
            'signed_at' => now()->subDay(),
        ]);
    }

    public function active(): self
    {
        return $this->state(fn () => [
            'status' => ContractStatus::Active->value,
            'signed_at' => now()->subDays(2),
            'activated_at' => now()->subDay(),
        ]);
    }

    public function replaced(): self
    {
        return $this->state(fn () => [
            'status' => ContractStatus::Replaced->value,
            'signed_at' => now()->subDays(10),
            'activated_at' => now()->subDays(9),
            'replaced_at' => now()->subDay(),
        ]);
    }

    public function cancelled(): self
    {
        return $this->state(fn () => [
            'status' => ContractStatus::Cancelled->value,
            'cancelled_at' => now()->subHour(),
            'cancellation_reason' => 'Huỷ thử nghiệm.',
        ]);
    }

    public function revoked(): self
    {
        return $this->state(fn () => [
            'status' => ContractStatus::Revoked->value,
            'cancelled_at' => now()->subHour(),
            'cancellation_reason' => 'Thu hồi pending.',
        ]);
    }

    public function expired(): self
    {
        return $this->state(fn () => [
            'status' => ContractStatus::Active->value,
            'starts_at' => now()->subMonths(2),
            'ends_at' => now()->subDay(),
        ]);
    }

    public function toOperatingCompany(): self
    {
        return $this->state(fn () => [
            'revenue_recipient' => RevenueRecipient::OperatingCompany->value,
        ]);
    }

    public function revenueShare(): self
    {
        return $this->state(fn () => [
            'commission_mode' => CommissionMode::RevenueShare->value,
            'terms' => [
                'billing_period' => 'monthly',
                'tiers' => [
                    ['min_gmv' => 0, 'max_gmv' => 10_000_000, 'percent' => 15.00],
                    ['min_gmv' => 10_000_000, 'max_gmv' => 50_000_000, 'percent' => 12.00],
                    ['min_gmv' => 50_000_000, 'max_gmv' => null, 'percent' => 10.00],
                ],
            ],
        ]);
    }

    public function subscription(): self
    {
        return $this->state(fn () => [
            'commission_mode' => CommissionMode::Subscription->value,
            'terms' => [
                'amount' => 500_000.00,
                'cycle' => SubscriptionCycle::Monthly->value,
            ],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function perOrderTerms(): array
    {
        return [
            'percent' => 10.00,
            'fixed' => null,
        ];
    }
}
