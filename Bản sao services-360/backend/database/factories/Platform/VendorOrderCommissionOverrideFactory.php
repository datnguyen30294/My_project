<?php

namespace Database\Factories\Platform;

use App\Modules\Marketplace\PartnerCommissionContract\Enums\RevenueRecipient;
use App\Modules\Marketplace\VendorOrder\Models\VendorOrderCommissionOverride;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<VendorOrderCommissionOverride>
 */
class VendorOrderCommissionOverrideFactory extends Factory
{
    protected $model = VendorOrderCommissionOverride::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $seq = 0;
        $seq++;

        return [
            'partner_id' => 1,
            'vendor_order_id' => $seq,
            'tenant_id' => 'tnp',
            'project_id' => 1,
            'revenue_recipient' => RevenueRecipient::Platform->value,
            'terms' => ['fixed' => 0, 'percent' => 10],
            'source_contract_id' => null,
            'note' => null,
        ];
    }

    public function operatingCompany(): static
    {
        return $this->state(fn (): array => ['revenue_recipient' => RevenueRecipient::OperatingCompany->value]);
    }
}
