<?php

namespace Tests\Modules\Platform;

use App\Modules\Platform\Auth\Models\RequesterAccount;
use App\Modules\Platform\Report\Contracts\PlatformVendorOrderAggregationExternalServiceInterface;
use App\Modules\Platform\Report\Contracts\ServiceAdoptionReportServiceInterface;
use App\Modules\Platform\Report\Support\PlatformVendorOrderRow;
use Carbon\CarbonInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ServiceAdoptionReportTest extends TestCase
{
    use RefreshDatabase;

    private RequesterAccount $requester;

    protected function setUp(): void
    {
        parent::setUp();

        $this->requester = RequesterAccount::create([
            'name' => 'Platform Admin',
            'email' => 'admin@test.com',
            'password' => 'password',
            'is_active' => true,
        ]);
    }

    protected function tearDown(): void
    {
        if (function_exists('tenancy') && tenancy()->initialized) {
            tenancy()->end();
        }

        parent::tearDown();
    }

    private function actingAsRequester(): static
    {
        return $this->actingAs($this->requester, 'requester');
    }

    // -------------------------------------------------------------------------
    // KPIs
    // -------------------------------------------------------------------------

    public function test_kpis_top_offer_total_offers_and_shares(): void
    {
        $this->fakeAggregation([
            // partner 1 / service / "Vệ sinh máy lạnh" — 3 orders (top)
            $this->row(['partnerId' => 1, 'type' => 'service', 'offerTitle' => 'Vệ sinh máy lạnh', 'amount' => 100]),
            $this->row(['partnerId' => 1, 'type' => 'service', 'offerTitle' => 'Vệ sinh máy lạnh', 'amount' => 100]),
            $this->row(['partnerId' => 1, 'type' => 'service', 'offerTitle' => 'Vệ sinh máy lạnh', 'amount' => 100]),
            // partner 2 / product / "Bóng đèn" — 1 order
            $this->row(['partnerId' => 2, 'type' => 'product', 'offerTitle' => 'Bóng đèn', 'amount' => 50]),
        ]);

        $report = app(ServiceAdoptionReportServiceInterface::class)->build(['months' => 6]);

        $this->assertSame(2, $report['kpis']['total_offers']);
        $this->assertSame('Vệ sinh máy lạnh', $report['kpis']['top_offer']['title']);
        $this->assertSame(3, $report['kpis']['top_offer']['order_count']);
        // 4 active: 3 service + 1 product → 75 / 25
        $this->assertSame(25, $report['kpis']['product_share']);
        $this->assertSame(75, $report['kpis']['service_share']);
    }

    public function test_cancelled_orders_excluded_everywhere(): void
    {
        $this->fakeAggregation([
            $this->row(['partnerId' => 1, 'type' => 'service', 'offerTitle' => 'A', 'amount' => 100, 'status' => 'completed']),
            $this->row(['partnerId' => 9, 'type' => 'product', 'offerTitle' => 'Z', 'amount' => 999, 'status' => 'cancelled']),
        ]);

        $report = app(ServiceAdoptionReportServiceInterface::class)->build(['months' => 6]);

        $this->assertSame(1, $report['kpis']['total_offers']);
        $this->assertSame('A', $report['kpis']['top_offer']['title']);
        $this->assertSame(0, $report['kpis']['product_share']);
        $this->assertSame(100, $report['kpis']['service_share']);

        // by_type: only the active service row
        $this->assertCount(1, $report['by_type']);
        $this->assertSame('service', $report['by_type'][0]['type']['value']);
        $this->assertSame(1, $report['by_type'][0]['order_count']);

        // offers: cancelled product not present
        $this->assertCount(1, $report['offers']);
        $this->assertSame('A', $report['offers'][0]['title']);

        // monthly: cancelled excluded
        $currentKey = now()->format('Y-m');
        $entry = collect($report['monthly'])->firstWhere('month', $currentKey);
        $this->assertSame(1, $entry['order_count']);
        $this->assertSame(0, $entry['product_count']);
        $this->assertSame(1, $entry['service_count']);
        $this->assertSame(100, $entry['gmv']);
    }

    // -------------------------------------------------------------------------
    // Offer grouping
    // -------------------------------------------------------------------------

    public function test_offer_grouping_by_partner_type_title(): void
    {
        $this->fakeAggregation([
            // two different vendors, same title + type → 2 distinct offers
            $this->row(['partnerId' => 1, 'partnerName' => 'Vendor A', 'type' => 'service', 'offerTitle' => 'Giặt thảm', 'amount' => 100]),
            $this->row(['partnerId' => 2, 'partnerName' => 'Vendor B', 'type' => 'service', 'offerTitle' => 'Giặt thảm', 'amount' => 200]),
        ]);

        $report = app(ServiceAdoptionReportServiceInterface::class)->build(['months' => 6]);

        $this->assertSame(2, $report['kpis']['total_offers']);
        $this->assertCount(2, $report['offers']);

        $partnerNames = array_column($report['offers'], 'partner_name');
        $this->assertContains('Vendor A', $partnerNames);
        $this->assertContains('Vendor B', $partnerNames);
    }

    public function test_offer_group_accumulates_count_and_gmv(): void
    {
        $this->fakeAggregation([
            $this->row(['partnerId' => 1, 'type' => 'service', 'offerTitle' => 'Sửa điện', 'amount' => 100]),
            $this->row(['partnerId' => 1, 'type' => 'service', 'offerTitle' => 'Sửa điện', 'amount' => 250]),
        ]);

        $report = app(ServiceAdoptionReportServiceInterface::class)->build(['months' => 6]);

        $this->assertCount(1, $report['offers']);
        $this->assertSame(2, $report['offers'][0]['order_count']);
        $this->assertSame(350, $report['offers'][0]['gmv']);
        $this->assertSame('service', $report['offers'][0]['type']['value']);
        $this->assertSame('Dịch vụ', $report['offers'][0]['type']['label']);
    }

    // -------------------------------------------------------------------------
    // Top 15 cut & sort
    // -------------------------------------------------------------------------

    public function test_offers_cut_to_top_15_sorted_by_order_count(): void
    {
        $rows = [];

        // 20 distinct offers; offer with partnerId N gets N orders → higher N = more orders
        for ($partnerId = 1; $partnerId <= 20; $partnerId++) {
            for ($i = 0; $i < $partnerId; $i++) {
                $rows[] = $this->row([
                    'partnerId' => $partnerId,
                    'type' => 'service',
                    'offerTitle' => 'Offer '.$partnerId,
                    'amount' => 10,
                ]);
            }
        }

        $this->fakeAggregation($rows);

        $report = app(ServiceAdoptionReportServiceInterface::class)->build(['months' => 6]);

        $this->assertSame(20, $report['kpis']['total_offers']);
        $this->assertCount(15, $report['offers']);

        // sorted desc by order_count → first is partner 20 (20 orders), last in top is partner 6 (6 orders)
        $this->assertSame(20, $report['offers'][0]['order_count']);
        $this->assertSame('Offer 20', $report['offers'][0]['title']);
        $this->assertSame(6, $report['offers'][14]['order_count']);

        $counts = array_column($report['offers'], 'order_count');
        $sorted = $counts;
        rsort($sorted);
        $this->assertSame($sorted, $counts);
    }

    // -------------------------------------------------------------------------
    // by_type ordering
    // -------------------------------------------------------------------------

    public function test_by_type_product_first_then_service(): void
    {
        $this->fakeAggregation([
            $this->row(['partnerId' => 1, 'type' => 'service', 'offerTitle' => 'S', 'amount' => 200]),
            $this->row(['partnerId' => 2, 'type' => 'product', 'offerTitle' => 'P', 'amount' => 100]),
        ]);

        $report = app(ServiceAdoptionReportServiceInterface::class)->build(['months' => 6]);

        $this->assertCount(2, $report['by_type']);
        $this->assertSame('product', $report['by_type'][0]['type']['value']);
        $this->assertSame('Sản phẩm', $report['by_type'][0]['type']['label']);
        $this->assertSame(100, $report['by_type'][0]['gmv']);
        $this->assertSame('service', $report['by_type'][1]['type']['value']);
        $this->assertSame('Dịch vụ', $report['by_type'][1]['type']['label']);
        $this->assertSame(200, $report['by_type'][1]['gmv']);
    }

    // -------------------------------------------------------------------------
    // Shares rounding
    // -------------------------------------------------------------------------

    public function test_shares_rounded_by_order_count(): void
    {
        // 2 product + 1 service → product 66.67→67, service 33.33→33
        $this->fakeAggregation([
            $this->row(['partnerId' => 1, 'type' => 'product', 'offerTitle' => 'P1', 'amount' => 10]),
            $this->row(['partnerId' => 2, 'type' => 'product', 'offerTitle' => 'P2', 'amount' => 10]),
            $this->row(['partnerId' => 3, 'type' => 'service', 'offerTitle' => 'S1', 'amount' => 10]),
        ]);

        $report = app(ServiceAdoptionReportServiceInterface::class)->build(['months' => 6]);

        $this->assertSame(67, $report['kpis']['product_share']);
        $this->assertSame(33, $report['kpis']['service_share']);
    }

    // -------------------------------------------------------------------------
    // Monthly skeleton
    // -------------------------------------------------------------------------

    public function test_monthly_skeleton_fills_empty_months_with_zero(): void
    {
        $this->fakeAggregation([
            $this->row([
                'partnerId' => 1,
                'type' => 'product',
                'offerTitle' => 'P',
                'amount' => 500,
                'createdAt' => now()->toDateString(),
            ]),
            $this->row([
                'partnerId' => 1,
                'type' => 'service',
                'offerTitle' => 'S',
                'amount' => 300,
                'createdAt' => now()->toDateString(),
            ]),
        ]);

        $report = app(ServiceAdoptionReportServiceInterface::class)->build(['months' => 6]);

        $this->assertCount(6, $report['monthly']);

        $currentKey = now()->format('Y-m');
        $byMonth = collect($report['monthly'])->keyBy('month');

        $this->assertSame(2, $byMonth[$currentKey]['order_count']);
        $this->assertSame(1, $byMonth[$currentKey]['product_count']);
        $this->assertSame(1, $byMonth[$currentKey]['service_count']);
        $this->assertSame(800, $byMonth[$currentKey]['gmv']);

        $emptyMonths = collect($report['monthly'])->reject(fn (array $row): bool => $row['month'] === $currentKey);
        $this->assertCount(5, $emptyMonths);
        foreach ($emptyMonths as $row) {
            $this->assertSame(0, $row['order_count']);
            $this->assertSame(0, $row['product_count']);
            $this->assertSame(0, $row['service_count']);
            $this->assertSame(0, $row['gmv']);
        }
    }

    public function test_monthly_length_matches_months_filter(): void
    {
        $this->fakeAggregation([]);

        $report = app(ServiceAdoptionReportServiceInterface::class)->build(['months' => 3]);

        $this->assertCount(3, $report['monthly']);
    }

    // -------------------------------------------------------------------------
    // Empty fact-set
    // -------------------------------------------------------------------------

    public function test_empty_factset_returns_zeros_and_nulls(): void
    {
        $this->fakeAggregation([]);

        $report = app(ServiceAdoptionReportServiceInterface::class)->build(['months' => 6]);

        $this->assertSame(0, $report['kpis']['total_offers']);
        $this->assertNull($report['kpis']['top_offer']);
        $this->assertSame(0, $report['kpis']['product_share']);
        $this->assertSame(0, $report['kpis']['service_share']);

        $this->assertSame([], $report['offers']);
        $this->assertSame([], $report['by_type']);

        $this->assertCount(6, $report['monthly']);
        foreach ($report['monthly'] as $row) {
            $this->assertSame(0, $row['order_count']);
            $this->assertSame(0, $row['product_count']);
            $this->assertSame(0, $row['service_count']);
            $this->assertSame(0, $row['gmv']);
        }
    }

    // -------------------------------------------------------------------------
    // HTTP endpoint
    // -------------------------------------------------------------------------

    public function test_service_adoption_endpoint_returns_full_shape(): void
    {
        $this->fakeAggregation([
            $this->row(['partnerId' => 1, 'partnerName' => 'Cơ điện lạnh ABC', 'type' => 'service', 'offerTitle' => 'Vệ sinh máy lạnh', 'amount' => 198_000]),
        ]);

        $this->actingAsRequester()->getJson('/api/v1/platform/reports/service-adoption?months=6')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.kpis.total_offers', 1)
            ->assertJsonPath('data.kpis.top_offer.title', 'Vệ sinh máy lạnh')
            ->assertJsonPath('data.kpis.top_offer.order_count', 1)
            ->assertJsonPath('data.offers.0.type.value', 'service')
            ->assertJsonPath('data.offers.0.type.label', 'Dịch vụ')
            ->assertJsonPath('data.offers.0.partner_name', 'Cơ điện lạnh ABC')
            ->assertJsonCount(6, 'data.monthly');
    }

    public function test_months_out_of_range_returns_422(): void
    {
        $this->actingAsRequester()->getJson('/api/v1/platform/reports/service-adoption?months=13')
            ->assertStatus(422)
            ->assertJsonValidationErrors(['months']);
    }

    // -------------------------------------------------------------------------
    // Fakes / builders
    // -------------------------------------------------------------------------

    /**
     * @param  list<PlatformVendorOrderRow>  $rows
     */
    private function fakeAggregation(array $rows): void
    {
        $fake = new class($rows) implements PlatformVendorOrderAggregationExternalServiceInterface
        {
            /** @param list<PlatformVendorOrderRow> $rows */
            public function __construct(private array $rows) {}

            public function collectOrders(CarbonInterface $from, CarbonInterface $to): array
            {
                return [
                    'rows' => $this->rows,
                    'warnings' => ['schema_missing' => false, 'skipped_orders' => 0],
                ];
            }
        };

        $this->app->instance(PlatformVendorOrderAggregationExternalServiceInterface::class, $fake);
    }

    /**
     * @param  array<string, mixed>  $overrides
     */
    private function row(array $overrides): PlatformVendorOrderRow
    {
        $defaults = [
            'orderId' => 1,
            'partnerId' => 1,
            'partnerName' => 'Vendor',
            'projectId' => null,
            'projectName' => null,
            'organizationId' => null,
            'residentId' => null,
            'residentName' => null,
            'customerSource' => null,
            'type' => 'product',
            'offerTitle' => null,
            'amount' => 0,
            'commissionAmount' => 0,
            'recipient' => '',
            'platformShare' => 0,
            'vhShare' => 0,
            'status' => 'completed',
            'residentRating' => null,
            'residentRatingComment' => null,
            'createdAt' => now()->toDateString(),
        ];

        $data = array_merge($defaults, $overrides);

        return new PlatformVendorOrderRow(
            orderId: (int) $data['orderId'],
            partnerId: (int) $data['partnerId'],
            partnerName: (string) $data['partnerName'],
            projectId: $data['projectId'],
            projectName: $data['projectName'],
            organizationId: $data['organizationId'],
            residentId: $data['residentId'],
            residentName: $data['residentName'],
            customerSource: $data['customerSource'],
            type: (string) $data['type'],
            offerTitle: $data['offerTitle'],
            amount: (int) $data['amount'],
            commissionAmount: (int) $data['commissionAmount'],
            recipient: (string) $data['recipient'],
            platformShare: (int) $data['platformShare'],
            vhShare: (int) $data['vhShare'],
            status: (string) $data['status'],
            residentRating: $data['residentRating'],
            residentRatingComment: $data['residentRatingComment'],
            createdAt: (string) $data['createdAt'],
        );
    }
}
