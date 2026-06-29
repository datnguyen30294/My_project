<?php

namespace Tests\Modules\Marketplace;

use App\Modules\Marketplace\PartnerCommissionContract\Models\PartnerCommissionContract;
use App\Modules\Marketplace\VendorOrder\Services\VendorOrderCommissionCalculator;
use Tests\TestCase;

class VendorOrderCommissionCalculatorTest extends TestCase
{
    private VendorOrderCommissionCalculator $calc;

    protected function setUp(): void
    {
        parent::setUp();
        $this->calc = new VendorOrderCommissionCalculator;
    }

    private function makeContract(?float $fixed, ?float $percent): PartnerCommissionContract
    {
        $c = new PartnerCommissionContract;
        $c->terms = ['fixed' => $fixed, 'percent' => $percent];

        return $c;
    }

    public function test_compute_from_terms_matches_contract_compute(): void
    {
        $terms = $this->calc->computeFromTerms(['fixed' => 50_000, 'percent' => 10], 830_000);
        $contract = $this->calc->compute($this->makeContract(50_000, 10), 830_000);

        $this->assertSame($contract, $terms);
        $this->assertSame(128_000.0, $terms['total']);
    }

    public function test_compute_from_terms_defaults_missing_to_zero(): void
    {
        $r = $this->calc->computeFromTerms([], 500_000);

        $this->assertSame(0.0, $r['fixed']);
        $this->assertSame(0.0, $r['percent']);
        $this->assertSame(0.0, $r['total']);
    }

    public function test_computes_with_fixed_plus_percent(): void
    {
        $r = $this->calc->compute($this->makeContract(50_000, 10), 830_000);

        $this->assertSame(50_000.0, $r['fixed']);
        $this->assertSame(10.0, $r['percent']);
        $this->assertSame(780_000.0, $r['remainder_after_fixed']);
        $this->assertSame(78_000.0, $r['percent_amount']);
        $this->assertSame(128_000.0, $r['total']);
        $this->assertFalse($r['capped_at_total']);
    }

    public function test_caps_at_total_when_fixed_greater_than_total(): void
    {
        $r = $this->calc->compute($this->makeContract(50_000, 10), 30_000);

        $this->assertSame(30_000.0, $r['total']);
        $this->assertTrue($r['capped_at_total']);
        $this->assertSame(0.0, $r['percent_amount']);
    }

    public function test_returns_total_when_fixed_equals_total(): void
    {
        $r = $this->calc->compute($this->makeContract(100_000, 5), 100_000);

        $this->assertSame(100_000.0, $r['total']);
        $this->assertTrue($r['capped_at_total']);
    }

    public function test_computes_with_only_percent(): void
    {
        $r = $this->calc->compute($this->makeContract(0, 15), 1_000_000);

        $this->assertSame(150_000.0, $r['total']);
        $this->assertFalse($r['capped_at_total']);
    }

    public function test_computes_with_only_fixed(): void
    {
        $r = $this->calc->compute($this->makeContract(20_000, 0), 500_000);

        $this->assertSame(20_000.0, $r['total']);
        $this->assertFalse($r['capped_at_total']);
    }

    public function test_returns_zero_when_order_total_is_zero(): void
    {
        $r = $this->calc->compute($this->makeContract(10_000, 5), 0);

        $this->assertSame(0.0, $r['total']);
    }

    public function test_returns_zero_when_terms_are_empty(): void
    {
        $c = new PartnerCommissionContract;
        $c->terms = [];

        $r = $this->calc->compute($c, 100_000);

        $this->assertSame(0.0, $r['total']);
    }
}
