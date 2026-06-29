<?php

namespace Tests\Modules\Platform;

use App\Modules\Platform\Auth\Models\RequesterAccount;
use App\Modules\Platform\Report\Contracts\CsatReportServiceInterface;
use App\Modules\Platform\Report\Contracts\PlatformVendorOrderAggregationExternalServiceInterface;
use App\Modules\Platform\Report\Support\PlatformVendorOrderRow;
use App\Modules\Platform\Tenant\Models\Organization;
use Carbon\CarbonInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CsatReportTest extends TestCase
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

    private function makeTenant(string $id, string $name = 'Công ty VH'): Organization
    {
        return Organization::withoutEvents(
            fn () => Organization::factory()->create([
                'id' => $id,
                'name' => $name,
                'is_active' => true,
                'is_organization' => true,
            ])
        );
    }

    // -------------------------------------------------------------------------
    // KPIs
    // -------------------------------------------------------------------------

    public function test_kpis_avg_rating_and_rates(): void
    {
        $this->fakeAggregation([
            $this->row(['residentRating' => 4, 'status' => 'completed']),
            $this->row(['residentRating' => 5, 'status' => 'completed']),
            $this->row(['residentRating' => 3, 'status' => 'completed']),
            $this->row(['residentRating' => null, 'status' => 'completed']),
            $this->row(['residentRating' => null, 'status' => 'cancelled']),
        ]);

        $report = app(CsatReportServiceInterface::class)->build(['months' => 6]);

        // avg of rated (4,5,3) = 4.0
        $this->assertSame(4.0, $report['kpis']['avg_rating']);
        $this->assertSame(3, $report['kpis']['rated_count']);
        $this->assertSame(5, $report['kpis']['total_orders']);
        // completed = 4 / 5 = 80
        $this->assertSame(80, $report['kpis']['completion_rate']);
        // cancelled = 1 / 5 = 20
        $this->assertSame(20, $report['kpis']['cancel_rate']);
        // rated_count = 3 / 5 = 60
        $this->assertSame(60, $report['kpis']['response_rate']);
    }

    public function test_null_rating_excluded_from_avg_but_counted_in_total(): void
    {
        $this->fakeAggregation([
            $this->row(['residentRating' => 2, 'status' => 'completed']),
            $this->row(['residentRating' => null, 'status' => 'completed']),
            $this->row(['residentRating' => null, 'status' => 'completed']),
        ]);

        $report = app(CsatReportServiceInterface::class)->build(['months' => 6]);

        $this->assertSame(2.0, $report['kpis']['avg_rating']);
        $this->assertSame(1, $report['kpis']['rated_count']);
        $this->assertSame(3, $report['kpis']['total_orders']);
    }

    public function test_avg_rating_rounds_to_one_decimal(): void
    {
        $this->fakeAggregation([
            $this->row(['residentRating' => 5, 'status' => 'completed']),
            $this->row(['residentRating' => 4, 'status' => 'completed']),
            $this->row(['residentRating' => 4, 'status' => 'completed']),
        ]);

        $report = app(CsatReportServiceInterface::class)->build(['months' => 6]);

        // (5+4+4)/3 = 4.333 -> 4.3
        $this->assertSame(4.3, $report['kpis']['avg_rating']);
    }

    // -------------------------------------------------------------------------
    // star_buckets
    // -------------------------------------------------------------------------

    public function test_star_buckets_have_five_elements_counted_by_star(): void
    {
        $this->fakeAggregation([
            $this->row(['residentRating' => 5]),
            $this->row(['residentRating' => 5]),
            $this->row(['residentRating' => 4]),
            $this->row(['residentRating' => 1]),
            $this->row(['residentRating' => null]),
        ]);

        $report = app(CsatReportServiceInterface::class)->build(['months' => 6]);

        $this->assertCount(5, $report['star_buckets']);

        $byStar = collect($report['star_buckets'])->keyBy('star');
        $this->assertSame(2, $byStar[5]['count']);
        $this->assertSame(1, $byStar[4]['count']);
        $this->assertSame(0, $byStar[3]['count']);
        $this->assertSame(0, $byStar[2]['count']);
        $this->assertSame(1, $byStar[1]['count']);

        // Ordered 5 -> 1
        $this->assertSame([5, 4, 3, 2, 1], array_column($report['star_buckets'], 'star'));
    }

    // -------------------------------------------------------------------------
    // by_vendor
    // -------------------------------------------------------------------------

    public function test_by_vendor_groups_counts_and_sorts_avg_desc_null_last(): void
    {
        $this->fakeAggregation([
            // Vendor 1 — avg 5
            $this->row(['partnerId' => 1, 'partnerName' => 'Vendor One', 'residentRating' => 5, 'status' => 'completed']),
            $this->row(['partnerId' => 1, 'partnerName' => 'Vendor One', 'residentRating' => null, 'status' => 'cancelled']),
            // Vendor 2 — avg 3
            $this->row(['partnerId' => 2, 'partnerName' => 'Vendor Two', 'residentRating' => 3, 'status' => 'completed']),
            // Vendor 3 — no rating -> null avg -> last
            $this->row(['partnerId' => 3, 'partnerName' => 'Vendor Three', 'residentRating' => null, 'status' => 'completed']),
        ]);

        $report = app(CsatReportServiceInterface::class)->build(['months' => 6]);

        $this->assertCount(3, $report['by_vendor']);

        // Sorted: vendor1 (5) -> vendor2 (3) -> vendor3 (null)
        $this->assertSame(1, $report['by_vendor'][0]['partner_id']);
        $this->assertSame(5.0, $report['by_vendor'][0]['avg_rating']);
        $this->assertSame(2, $report['by_vendor'][0]['order_count']);
        $this->assertSame(1, $report['by_vendor'][0]['completed_count']);
        $this->assertSame(1, $report['by_vendor'][0]['cancel_count']);
        $this->assertSame(1, $report['by_vendor'][0]['rated_count']);

        $this->assertSame(2, $report['by_vendor'][1]['partner_id']);
        $this->assertSame(3.0, $report['by_vendor'][1]['avg_rating']);

        $this->assertSame(3, $report['by_vendor'][2]['partner_id']);
        $this->assertNull($report['by_vendor'][2]['avg_rating']);
    }

    // -------------------------------------------------------------------------
    // by_project
    // -------------------------------------------------------------------------

    public function test_by_project_excludes_null_project_and_sorts_avg_desc_null_last(): void
    {
        $this->fakeAggregation([
            // Project 10 — avg 4.5
            $this->row(['projectId' => 10, 'projectName' => 'Dự án A', 'residentRating' => 4]),
            $this->row(['projectId' => 10, 'projectName' => 'Dự án A', 'residentRating' => 5]),
            // Project 20 — null avg -> last
            $this->row(['projectId' => 20, 'projectName' => 'Dự án B', 'residentRating' => null]),
            // No project -> excluded
            $this->row(['projectId' => null, 'residentRating' => 5]),
        ]);

        $report = app(CsatReportServiceInterface::class)->build(['months' => 6]);

        $this->assertCount(2, $report['by_project']);
        $this->assertSame(10, $report['by_project'][0]['project_id']);
        $this->assertSame(4.5, $report['by_project'][0]['avg_rating']);
        $this->assertSame(2, $report['by_project'][0]['order_count']);
        $this->assertSame(2, $report['by_project'][0]['rated_count']);

        $this->assertSame(20, $report['by_project'][1]['project_id']);
        $this->assertNull($report['by_project'][1]['avg_rating']);
    }

    public function test_by_project_fallback_name_when_null(): void
    {
        $this->fakeAggregation([
            $this->row(['projectId' => 77, 'projectName' => null, 'residentRating' => 3]),
        ]);

        $report = app(CsatReportServiceInterface::class)->build(['months' => 6]);

        $this->assertSame('Dự án #77', $report['by_project'][0]['project_name']);
    }

    // -------------------------------------------------------------------------
    // low_ratings
    // -------------------------------------------------------------------------

    public function test_low_ratings_filters_le_three_and_sorts_rating_asc(): void
    {
        $this->fakeAggregation([
            $this->row(['partnerName' => 'V3', 'residentRating' => 3, 'residentName' => 'Người 3']),
            $this->row(['partnerName' => 'V1', 'residentRating' => 1, 'residentName' => 'Người 1', 'residentRatingComment' => 'Tệ']),
            $this->row(['partnerName' => 'V2', 'residentRating' => 2, 'residentName' => 'Người 2']),
            // Excluded: rating > 3
            $this->row(['partnerName' => 'V4', 'residentRating' => 4]),
            // Excluded: null rating
            $this->row(['partnerName' => 'V5', 'residentRating' => null]),
        ]);

        $report = app(CsatReportServiceInterface::class)->build(['months' => 6]);

        $this->assertCount(3, $report['low_ratings']);
        $this->assertSame([1, 2, 3], array_column($report['low_ratings'], 'resident_rating'));
        $this->assertSame('V1', $report['low_ratings'][0]['partner_name']);
        $this->assertSame('Người 1', $report['low_ratings'][0]['resident_name']);
        $this->assertSame('Tệ', $report['low_ratings'][0]['resident_rating_comment']);
    }

    public function test_low_ratings_takes_top_ten(): void
    {
        $rows = [];
        for ($i = 0; $i < 15; $i++) {
            $rows[] = $this->row(['residentRating' => 1]);
        }

        $this->fakeAggregation($rows);

        $report = app(CsatReportServiceInterface::class)->build(['months' => 6]);

        $this->assertCount(10, $report['low_ratings']);
    }

    // -------------------------------------------------------------------------
    // Empty window
    // -------------------------------------------------------------------------

    public function test_empty_window_returns_null_avg_zeros_and_empty_arrays(): void
    {
        $this->fakeAggregation([]);

        $report = app(CsatReportServiceInterface::class)->build(['months' => 6]);

        $this->assertNull($report['kpis']['avg_rating']);
        $this->assertSame(0, $report['kpis']['rated_count']);
        $this->assertSame(0, $report['kpis']['total_orders']);
        $this->assertSame(0, $report['kpis']['completion_rate']);
        $this->assertSame(0, $report['kpis']['cancel_rate']);
        $this->assertSame(0, $report['kpis']['response_rate']);

        $this->assertCount(5, $report['star_buckets']);
        foreach ($report['star_buckets'] as $bucket) {
            $this->assertSame(0, $bucket['count']);
        }

        $this->assertSame([], $report['by_vendor']);
        $this->assertSame([], $report['by_project']);
        $this->assertSame([], $report['low_ratings']);
    }

    // -------------------------------------------------------------------------
    // HTTP endpoint
    // -------------------------------------------------------------------------

    public function test_csat_endpoint_returns_full_shape(): void
    {
        $this->fakeAggregation([
            $this->row(['partnerId' => 9, 'partnerName' => 'Vendor Nine', 'residentRating' => 5, 'status' => 'completed']),
        ]);

        $this->actingAsRequester()->getJson('/api/v1/platform/reports/csat?months=6')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.kpis.avg_rating', 5)
            ->assertJsonPath('data.kpis.total_orders', 1)
            ->assertJsonCount(5, 'data.star_buckets')
            ->assertJsonPath('data.by_vendor.0.partner_id', 9);
    }

    public function test_months_out_of_range_returns_422(): void
    {
        $this->actingAsRequester()->getJson('/api/v1/platform/reports/csat?months=13')
            ->assertStatus(422)
            ->assertJsonValidationErrors(['months']);
    }

    public function test_from_to_filter_window_is_parsed(): void
    {
        $captured = null;

        $fake = new class($captured) implements PlatformVendorOrderAggregationExternalServiceInterface
        {
            public ?string $fromCaptured = null;

            public ?string $toCaptured = null;

            public function __construct(private mixed $unused) {}

            public function collectOrders(CarbonInterface $from, CarbonInterface $to): array
            {
                $this->fromCaptured = $from->toDateTimeString();
                $this->toCaptured = $to->toDateTimeString();

                return [
                    'rows' => [],
                    'warnings' => ['schema_missing' => false, 'skipped_orders' => 0],
                ];
            }
        };

        $this->app->instance(PlatformVendorOrderAggregationExternalServiceInterface::class, $fake);

        app(CsatReportServiceInterface::class)->build(['from' => '2026-01-10', 'to' => '2026-02-20']);

        $this->assertSame('2026-01-10 00:00:00', $fake->fromCaptured);
        $this->assertSame('2026-02-20 23:59:59', $fake->toCaptured);
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
