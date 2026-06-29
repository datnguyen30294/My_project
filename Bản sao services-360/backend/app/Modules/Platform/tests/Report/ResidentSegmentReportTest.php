<?php

namespace Tests\Modules\Platform;

use App\Modules\Platform\Auth\Models\RequesterAccount;
use App\Modules\Platform\Report\Contracts\PlatformVendorOrderAggregationExternalServiceInterface;
use App\Modules\Platform\Report\Contracts\ResidentSegmentReportServiceInterface;
use App\Modules\Platform\Report\Support\PlatformVendorOrderRow;
use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\PMC\Customer\ExternalServices\Platform\TenantCustomerCountExternalServiceInterface;
use Carbon\CarbonInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ResidentSegmentReportTest extends TestCase
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
    // segments
    // -------------------------------------------------------------------------

    public function test_segments_share_and_gmv_correct(): void
    {
        $this->fakeCustomerCount(0);
        $this->fakeAggregation([
            $this->row(['residentId' => 1, 'customerSource' => 'project', 'amount' => 1_000_000]),
            $this->row(['residentId' => 2, 'customerSource' => 'project', 'amount' => 240_000]),
            $this->row(['residentId' => 3, 'customerSource' => 'project', 'amount' => 0]),
            $this->row(['residentId' => 4, 'customerSource' => 'walk_in', 'amount' => 583_000]),
        ]);

        $data = app(ResidentSegmentReportServiceInterface::class)->build(['months' => 6]);

        $this->assertCount(2, $data['segments']);

        [$project, $walkIn] = $data['segments'];

        $this->assertSame('project', $project['source']['value']);
        $this->assertSame('Cư dân dự án', $project['source']['label']);
        $this->assertSame(3, $project['order_count']);
        $this->assertSame(1_240_000, $project['gmv']);

        $this->assertSame('walk_in', $walkIn['source']['value']);
        $this->assertSame('Khách vãng lai', $walkIn['source']['label']);
        $this->assertSame(1, $walkIn['order_count']);
        $this->assertSame(583_000, $walkIn['gmv']);

        // 3/4 = 75%, 1/4 = 25%
        $this->assertSame(75, $data['kpis']['project_order_share']);
        $this->assertSame(25, $data['kpis']['walk_in_order_share']);
        $this->assertSame(1_240_000, $data['kpis']['project_gmv']);
        $this->assertSame(583_000, $data['kpis']['walk_in_gmv']);
    }

    // -------------------------------------------------------------------------
    // active_residents — distinct
    // -------------------------------------------------------------------------

    public function test_active_residents_counts_distinct(): void
    {
        $this->fakeCustomerCount(0);
        $this->fakeAggregation([
            $this->row(['residentId' => 1, 'customerSource' => 'project', 'amount' => 100]),
            $this->row(['residentId' => 1, 'customerSource' => 'project', 'amount' => 200]),
            $this->row(['residentId' => 2, 'customerSource' => 'walk_in', 'amount' => 300]),
            $this->row(['residentId' => null, 'customerSource' => 'walk_in', 'amount' => 400]),
        ]);

        $data = app(ResidentSegmentReportServiceInterface::class)->build(['months' => 6]);

        $this->assertSame(2, $data['kpis']['active_residents']);
    }

    // -------------------------------------------------------------------------
    // top_residents
    // -------------------------------------------------------------------------

    public function test_top_residents_top_10_sorted_desc_order_count(): void
    {
        $this->fakeCustomerCount(0);

        $rows = [];
        // Residents 1..12, resident N gets N orders → desc by order_count.
        for ($residentId = 1; $residentId <= 12; $residentId++) {
            for ($order = 0; $order < $residentId; $order++) {
                $rows[] = $this->row([
                    'residentId' => $residentId,
                    'residentName' => 'Resident '.$residentId,
                    'customerSource' => 'project',
                    'amount' => 1_000,
                ]);
            }
        }

        $this->fakeAggregation($rows);

        $data = app(ResidentSegmentReportServiceInterface::class)->build(['months' => 6]);

        $this->assertCount(10, $data['top_residents']);
        $this->assertSame('Resident 12', $data['top_residents'][0]['resident_name']);
        $this->assertSame(12, $data['top_residents'][0]['order_count']);
        $this->assertSame('Resident 11', $data['top_residents'][1]['resident_name']);
        $this->assertSame(11, $data['top_residents'][1]['order_count']);

        // Top 10 stops at resident 3 (12,11,...,3).
        $this->assertSame('Resident 3', $data['top_residents'][9]['resident_name']);
        $this->assertSame(3, $data['top_residents'][9]['order_count']);

        // Descending order maintained throughout.
        $counts = array_column($data['top_residents'], 'order_count');
        $sorted = $counts;
        rsort($sorted);
        $this->assertSame($sorted, $counts);
    }

    public function test_top_residents_tie_breaks_by_gmv_desc(): void
    {
        $this->fakeCustomerCount(0);
        $this->fakeAggregation([
            $this->row(['residentId' => 1, 'residentName' => 'Low GMV', 'customerSource' => 'project', 'amount' => 100]),
            $this->row(['residentId' => 2, 'residentName' => 'High GMV', 'customerSource' => 'project', 'amount' => 999]),
        ]);

        $data = app(ResidentSegmentReportServiceInterface::class)->build(['months' => 6]);

        $this->assertSame('High GMV', $data['top_residents'][0]['resident_name']);
        $this->assertSame('Low GMV', $data['top_residents'][1]['resident_name']);
    }

    // -------------------------------------------------------------------------
    // shares / zero division
    // -------------------------------------------------------------------------

    public function test_zero_orders_no_division_by_zero(): void
    {
        $this->fakeCustomerCount(0);
        $this->fakeAggregation([]);

        $data = app(ResidentSegmentReportServiceInterface::class)->build(['months' => 6]);

        $this->assertSame(0, $data['kpis']['project_order_share']);
        $this->assertSame(0, $data['kpis']['walk_in_order_share']);
        $this->assertSame(0, $data['kpis']['active_residents']);
        $this->assertSame(0, $data['kpis']['project_gmv']);
        $this->assertSame(0, $data['kpis']['walk_in_gmv']);

        $this->assertCount(2, $data['segments']);
        foreach ($data['segments'] as $segment) {
            $this->assertSame(0, $segment['order_count']);
            $this->assertSame(0, $segment['gmv']);
            $this->assertNull($segment['avg_rating']);
            $this->assertSame(0, $segment['rated_count']);
        }

        $this->assertSame([], $data['top_residents']);
    }

    // -------------------------------------------------------------------------
    // avg_rating
    // -------------------------------------------------------------------------

    public function test_avg_rating_null_when_no_rated_orders(): void
    {
        $this->fakeCustomerCount(0);
        $this->fakeAggregation([
            $this->row(['residentId' => 1, 'customerSource' => 'project', 'amount' => 100, 'residentRating' => null]),
            $this->row(['residentId' => 2, 'customerSource' => 'walk_in', 'amount' => 200, 'residentRating' => null]),
        ]);

        $data = app(ResidentSegmentReportServiceInterface::class)->build(['months' => 6]);

        foreach ($data['segments'] as $segment) {
            $this->assertNull($segment['avg_rating']);
            $this->assertSame(0, $segment['rated_count']);
        }

        foreach ($data['top_residents'] as $resident) {
            $this->assertNull($resident['avg_rating']);
            $this->assertSame(0, $resident['rated_count']);
        }
    }

    public function test_avg_rating_computed_when_rated(): void
    {
        $this->fakeCustomerCount(0);
        $this->fakeAggregation([
            $this->row(['residentId' => 1, 'customerSource' => 'project', 'amount' => 100, 'residentRating' => 4]),
            $this->row(['residentId' => 2, 'customerSource' => 'project', 'amount' => 200, 'residentRating' => 5]),
        ]);

        $data = app(ResidentSegmentReportServiceInterface::class)->build(['months' => 6]);

        $project = $data['segments'][0];
        $this->assertSame(4.5, $project['avg_rating']);
        $this->assertSame(2, $project['rated_count']);
    }

    // -------------------------------------------------------------------------
    // total_residents — PMC count via mock
    // -------------------------------------------------------------------------

    public function test_total_residents_sums_across_organizations(): void
    {
        $this->makeTenant('vh-a');
        $this->makeTenant('vh-b');
        $this->makeTenant('vh-c');
        $this->fakeCustomerCount(50);
        $this->fakeAggregation([]);

        $data = app(ResidentSegmentReportServiceInterface::class)->build(['months' => 6]);

        // 50 residents × 3 organizations.
        $this->assertSame(150, $data['kpis']['total_residents']);
    }

    // -------------------------------------------------------------------------
    // cancelled excluded
    // -------------------------------------------------------------------------

    public function test_cancelled_orders_excluded(): void
    {
        $this->fakeCustomerCount(0);
        $this->fakeAggregation([
            $this->row(['residentId' => 1, 'customerSource' => 'project', 'amount' => 100, 'status' => 'completed']),
            $this->row(['residentId' => 2, 'customerSource' => 'project', 'amount' => 999, 'status' => 'cancelled']),
        ]);

        $data = app(ResidentSegmentReportServiceInterface::class)->build(['months' => 6]);

        $this->assertSame(100, $data['segments'][0]['gmv']);
        $this->assertSame(1, $data['segments'][0]['order_count']);
        $this->assertSame(1, $data['kpis']['active_residents']);
        $this->assertCount(1, $data['top_residents']);
    }

    public function test_empty_returns_zeros_with_both_segments(): void
    {
        $this->fakeCustomerCount(0);
        $this->fakeAggregation([]);

        $data = app(ResidentSegmentReportServiceInterface::class)->build(['months' => 6]);

        foreach ($data['kpis'] as $value) {
            $this->assertSame(0, $value);
        }

        $this->assertCount(2, $data['segments']);
        $this->assertSame('project', $data['segments'][0]['source']['value']);
        $this->assertSame('walk_in', $data['segments'][1]['source']['value']);
        $this->assertSame([], $data['top_residents']);
    }

    // -------------------------------------------------------------------------
    // HTTP endpoint tests
    // -------------------------------------------------------------------------

    public function test_resident_segments_endpoint_returns_full_shape(): void
    {
        $this->makeTenant('vh-a');
        $this->fakeCustomerCount(10);
        $this->fakeAggregation([
            $this->row(['residentId' => 1, 'residentName' => 'Nguyễn Văn A', 'customerSource' => 'project', 'amount' => 86_000_000, 'residentRating' => 5]),
        ]);

        $this->actingAsRequester()->getJson('/api/v1/platform/reports/resident-segments?months=6')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.kpis.total_residents', 10)
            ->assertJsonPath('data.kpis.active_residents', 1)
            ->assertJsonPath('data.kpis.project_gmv', 86_000_000)
            ->assertJsonPath('data.segments.0.source.value', 'project')
            ->assertJsonPath('data.segments.1.source.value', 'walk_in')
            ->assertJsonPath('data.top_residents.0.resident_name', 'Nguyễn Văn A')
            ->assertJsonCount(2, 'data.segments');
    }

    public function test_months_out_of_range_returns_422(): void
    {
        $this->actingAsRequester()->getJson('/api/v1/platform/reports/resident-segments?months=13')
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

    private function fakeCustomerCount(int $perTenant): void
    {
        $fake = new class($perTenant) implements TenantCustomerCountExternalServiceInterface
        {
            public function __construct(private int $perTenant) {}

            public function countResidentsForTenant(Organization $tenant): int
            {
                return $this->perTenant;
            }
        };

        $this->app->instance(TenantCustomerCountExternalServiceInterface::class, $fake);
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
