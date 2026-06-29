<?php

namespace Tests\Modules\Marketplace;

use App\Modules\Marketplace\PartnerCommissionContract\Enums\RevenueRecipient;
use App\Modules\Marketplace\VendorOrder\Enums\VendorOrderStatus;
use App\Modules\Marketplace\VendorOrder\Enums\VendorOrderType;
use App\Modules\Marketplace\VendorOrder\Services\VendorOrderConsoleAssembler;
use Tests\TestCase;

class VendorOrderConsoleAssemblerTest extends TestCase
{
    private VendorOrderConsoleAssembler $assembler;

    protected function setUp(): void
    {
        parent::setUp();
        $this->assembler = new VendorOrderConsoleAssembler;
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array{order: object, vendor: array{id:int}, type: string, commission: array|null}
     */
    private function row(array $overrides = []): array
    {
        $defaults = [
            'vendor_id' => 1,
            'type' => VendorOrderType::Product->value,
            'status' => VendorOrderStatus::Completed,
            'total' => 1_000_000.0,
            'recipient' => null,        // null => no commission
            'commission_total' => 0.0,
        ];
        $data = array_merge($defaults, $overrides);

        $commission = null;

        if ($data['recipient'] !== null) {
            $commission = [
                'recipient' => $data['recipient'],
                'amount' => (float) $data['commission_total'],
                'formula' => ['total' => (float) $data['commission_total']],
                'manual' => $data['manual'] ?? false,
            ];
        }

        return [
            'order' => (object) [
                'status' => $data['status'],
                'total' => (float) $data['total'],
            ],
            'vendor' => ['id' => (int) $data['vendor_id']],
            'type' => (string) $data['type'],
            'commission' => $commission,
        ];
    }

    public function test_empty_rows_zero_everything(): void
    {
        $summary = $this->assembler->summarize([]);

        $this->assertSame(0, $summary['orders_count']);
        $this->assertSame(0, $summary['product_count']);
        $this->assertSame(0, $summary['service_count']);
        $this->assertSame(0.0, $summary['gmv']);
        $this->assertSame(0.0, $summary['commission_total']);
        $this->assertSame(0, $summary['vendors_count']);
    }

    public function test_counts_orders_and_type_breakdown(): void
    {
        $summary = $this->assembler->summarize([
            $this->row(['type' => 'product']),
            $this->row(['type' => 'product']),
            $this->row(['type' => 'service']),
            $this->row(['type' => 'mixed']),
        ]);

        $this->assertSame(4, $summary['orders_count']);
        $this->assertSame(2, $summary['product_count']);
        $this->assertSame(1, $summary['service_count']);
    }

    public function test_gmv_excludes_cancelled_orders(): void
    {
        $summary = $this->assembler->summarize([
            $this->row(['total' => 1_500_000, 'status' => VendorOrderStatus::Completed]),
            $this->row(['total' => 500_000, 'status' => VendorOrderStatus::Pending]),
            $this->row(['total' => 9_999_999, 'status' => VendorOrderStatus::Cancelled]),
        ]);

        $this->assertSame(2_000_000.0, $summary['gmv']);
    }

    public function test_commission_splits_by_recipient(): void
    {
        $summary = $this->assembler->summarize([
            $this->row(['recipient' => RevenueRecipient::Platform, 'commission_total' => 700_000]),
            $this->row(['recipient' => RevenueRecipient::OperatingCompany, 'commission_total' => 260_000]),
            $this->row(['recipient' => null]), // no contract → no commission
        ]);

        $this->assertSame(700_000.0, $summary['commission_platform']);
        $this->assertSame(260_000.0, $summary['commission_operating_company']);
        $this->assertSame(960_000.0, $summary['commission_total']);
    }

    public function test_manual_override_commission_counts_in_split(): void
    {
        $summary = $this->assembler->summarize([
            $this->row(['recipient' => RevenueRecipient::Platform, 'commission_total' => 120_000, 'manual' => true]),
            $this->row(['recipient' => RevenueRecipient::OperatingCompany, 'commission_total' => 80_000, 'manual' => true]),
        ]);

        $this->assertSame(120_000.0, $summary['commission_platform']);
        $this->assertSame(80_000.0, $summary['commission_operating_company']);
        $this->assertSame(200_000.0, $summary['commission_total']);
    }

    public function test_vendors_count_is_distinct(): void
    {
        $summary = $this->assembler->summarize([
            $this->row(['vendor_id' => 7]),
            $this->row(['vendor_id' => 7]),
            $this->row(['vendor_id' => 12]),
        ]);

        $this->assertSame(2, $summary['vendors_count']);
    }
}
