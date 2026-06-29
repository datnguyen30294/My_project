<?php

namespace Tests\Modules\PMC;

use App\Modules\Marketplace\VendorOrder\ExternalServices\VendorOrderReportExternalServiceInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VendorOrderReportTest extends TestCase
{
    use RefreshDatabase;

    private string $baseUrl = '/api/v1/pmc/reports/vendor-order';

    protected function setUp(): void
    {
        parent::setUp();
        $this->bindFakeFeed();
    }

    /**
     * Bind a fake Marketplace bridge so we test the PMC report aggregation
     * layer without hitting the cross-DB resi_mart connection.
     */
    private function bindFakeFeed(): void
    {
        $this->instance(VendorOrderReportExternalServiceInterface::class, new class implements VendorOrderReportExternalServiceInterface
        {
            public function getCompletedOrdersForReport(array $filters): array
            {
                return [
                    'from' => '2026-05-01',
                    'to' => '2026-05-31',
                    'currency' => 'VND',
                    'rows' => [
                        ['vendor_id' => 1, 'vendor_name' => 'Vendor A', 'project_id' => 10, 'project_name' => 'Dự án X', 'completed_at' => '2026-05-01', 'revenue' => 100.0, 'commission' => 10.0],
                        ['vendor_id' => 1, 'vendor_name' => 'Vendor A', 'project_id' => 10, 'project_name' => 'Dự án X', 'completed_at' => '2026-05-02', 'revenue' => 200.0, 'commission' => 20.0],
                        ['vendor_id' => 2, 'vendor_name' => 'Vendor B', 'project_id' => 20, 'project_name' => 'Dự án Y', 'completed_at' => '2026-05-02', 'revenue' => 250.0, 'commission' => 25.0],
                    ],
                    'warnings' => ['orphan_orders_count' => 1, 'non_per_order_orders_count' => 0, 'schema_missing' => false],
                ];
            }
        });
    }

    public function test_summary_aggregates_completed_orders(): void
    {
        $this->actingAsUserWithPermissions(['report-vendor-order.view']);

        $response = $this->getJson("{$this->baseUrl}/summary");

        $response->assertOk()
            ->assertJsonPath('data.orders_count', 3)
            ->assertJsonPath('data.revenue_total', '550.00')
            ->assertJsonPath('data.commission_total', '55.00')
            ->assertJsonPath('data.average_commission_per_order', '18.33')
            ->assertJsonPath('data.vendors_count', 2)
            ->assertJsonPath('data.projects_count', 2)
            ->assertJsonPath('data.warnings.orphan_orders_count', 1);
    }

    public function test_by_vendor_groups_and_sorts_by_revenue(): void
    {
        $this->actingAsUserWithPermissions(['report-vendor-order.view']);

        $response = $this->getJson("{$this->baseUrl}/by-vendor");

        $response->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.vendor_id', 1)
            ->assertJsonPath('data.0.vendor_name', 'Vendor A')
            ->assertJsonPath('data.0.orders_count', 2)
            ->assertJsonPath('data.0.revenue_total', '300.00')
            ->assertJsonPath('data.0.commission_total', '30.00')
            ->assertJsonPath('data.1.vendor_id', 2)
            ->assertJsonPath('data.1.revenue_total', '250.00');
    }

    public function test_by_project_groups_and_sorts_by_revenue(): void
    {
        $this->actingAsUserWithPermissions(['report-vendor-order.view']);

        $response = $this->getJson("{$this->baseUrl}/by-project");

        $response->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.project_id', 10)
            ->assertJsonPath('data.0.orders_count', 2)
            ->assertJsonPath('data.0.revenue_total', '300.00')
            ->assertJsonPath('data.1.project_id', 20)
            ->assertJsonPath('data.1.revenue_total', '250.00');
    }

    public function test_trend_groups_by_date_ascending(): void
    {
        $this->actingAsUserWithPermissions(['report-vendor-order.view']);

        $response = $this->getJson("{$this->baseUrl}/trend");

        $response->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.date', '2026-05-01')
            ->assertJsonPath('data.0.orders_count', 1)
            ->assertJsonPath('data.0.revenue_total', '100.00')
            ->assertJsonPath('data.1.date', '2026-05-02')
            ->assertJsonPath('data.1.orders_count', 2)
            ->assertJsonPath('data.1.revenue_total', '450.00')
            ->assertJsonPath('data.1.commission_total', '45.00');
    }

    public function test_requires_permission(): void
    {
        $this->actingAsUser();

        $this->getJson("{$this->baseUrl}/summary")->assertForbidden();
    }

    public function test_validates_date_range(): void
    {
        $this->actingAsUserWithPermissions(['report-vendor-order.view']);

        $this->getJson("{$this->baseUrl}/summary?date_from=2026-05-10&date_to=2026-05-01")
            ->assertStatus(422);
    }
}
