<?php

namespace Tests\Modules\Platform;

use App\Modules\Platform\Auth\Models\RequesterAccount;
use App\Modules\Platform\Report\Contracts\CommissionAllocationReportServiceInterface;
use App\Modules\Platform\Report\Contracts\PlatformVendorOrderAggregationExternalServiceInterface;
use App\Modules\Platform\Report\Support\PlatformVendorOrderRow;
use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\PMC\Project\Models\PlatformProjectRegistry;
use Carbon\CarbonInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommissionAllocationReportTest extends TestCase
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

    public function test_commission_total_equals_platform_plus_vh(): void
    {
        $this->fakeAggregation([
            $this->row(['recipient' => 'platform', 'commissionAmount' => 700_000, 'platformShare' => 700_000, 'amount' => 9_000_000]),
            $this->row(['recipient' => 'operating_company', 'organizationId' => 'vh-a', 'commissionAmount' => 260_000, 'vhShare' => 260_000, 'amount' => 1_000_000]),
        ]);

        $report = app(CommissionAllocationReportServiceInterface::class)->build(['months' => 6]);

        $this->assertSame(960_000, $report['kpis']['commission_total']);
        $this->assertSame(700_000, $report['kpis']['platform_total']);
        $this->assertSame(260_000, $report['kpis']['vh_total']);
        $this->assertSame(
            $report['kpis']['platform_total'] + $report['kpis']['vh_total'],
            $report['kpis']['commission_total'],
        );
    }

    public function test_share_pct_sums_to_100(): void
    {
        $this->fakeAggregation([
            $this->row(['recipient' => 'platform', 'commissionAmount' => 700_000, 'platformShare' => 700_000]),
            $this->row(['recipient' => 'operating_company', 'organizationId' => 'vh-a', 'commissionAmount' => 260_000, 'vhShare' => 260_000]),
        ]);

        $report = app(CommissionAllocationReportServiceInterface::class)->build(['months' => 6]);

        $this->assertSame(
            100,
            $report['kpis']['platform_share_pct'] + $report['kpis']['vh_share_pct'],
        );
        $this->assertSame(73, $report['kpis']['platform_share_pct']);
        $this->assertSame(27, $report['kpis']['vh_share_pct']);
    }

    public function test_platform_order_only_into_platform_share_and_oc_only_into_vh_share(): void
    {
        $this->fakeAggregation([
            $this->row(['recipient' => 'platform', 'commissionAmount' => 500_000, 'platformShare' => 500_000]),
            $this->row(['recipient' => 'operating_company', 'organizationId' => 'vh-a', 'commissionAmount' => 300_000, 'vhShare' => 300_000]),
        ]);

        $report = app(CommissionAllocationReportServiceInterface::class)->build(['months' => 6]);

        $this->assertSame(500_000, $report['kpis']['platform_total']);
        $this->assertSame(300_000, $report['kpis']['vh_total']);
    }

    public function test_commission_total_zero_returns_zero_kpis_and_empty_tables(): void
    {
        $this->fakeAggregation([]);

        $report = app(CommissionAllocationReportServiceInterface::class)->build(['months' => 6]);

        $this->assertSame(0, $report['kpis']['commission_total']);
        $this->assertSame(0, $report['kpis']['platform_total']);
        $this->assertSame(0, $report['kpis']['vh_total']);
        $this->assertSame(0, $report['kpis']['platform_share_pct']);
        $this->assertSame(0, $report['kpis']['vh_share_pct']);
        $this->assertSame([], $report['by_recipient']);
        $this->assertSame([], $report['by_vendor']);
        $this->assertSame([], $report['by_project']);
    }

    // -------------------------------------------------------------------------
    // by_recipient
    // -------------------------------------------------------------------------

    public function test_by_recipient_platform_single_row_plus_one_per_company_sorted_desc(): void
    {
        $this->makeTenant('vh-a', 'Công ty VH An Phú');
        $this->makeTenant('vh-b', 'Công ty VH Bình Minh');

        $this->fakeAggregation([
            // platform: 700_000 across 2 orders
            $this->row(['recipient' => 'platform', 'commissionAmount' => 400_000, 'platformShare' => 400_000]),
            $this->row(['recipient' => 'platform', 'commissionAmount' => 300_000, 'platformShare' => 300_000]),
            // vh-a: 180_000
            $this->row(['recipient' => 'operating_company', 'organizationId' => 'vh-a', 'commissionAmount' => 180_000, 'vhShare' => 180_000]),
            // vh-b: 80_000
            $this->row(['recipient' => 'operating_company', 'organizationId' => 'vh-b', 'commissionAmount' => 80_000, 'vhShare' => 80_000]),
        ]);

        $report = app(CommissionAllocationReportServiceInterface::class)->build(['months' => 6]);

        $this->assertCount(3, $report['by_recipient']);

        // sorted desc by amount: platform (700k), vh-a (180k), vh-b (80k)
        $this->assertSame('platform', $report['by_recipient'][0]['recipient_id']);
        $this->assertSame('Platform TNP', $report['by_recipient'][0]['label']);
        $this->assertSame(2, $report['by_recipient'][0]['order_count']);
        $this->assertSame(700_000, $report['by_recipient'][0]['amount']);

        $this->assertSame('vh-a', $report['by_recipient'][1]['recipient_id']);
        $this->assertSame('Công ty VH An Phú', $report['by_recipient'][1]['label']);
        $this->assertSame(180_000, $report['by_recipient'][1]['amount']);

        $this->assertSame('vh-b', $report['by_recipient'][2]['recipient_id']);
        $this->assertSame('Công ty VH Bình Minh', $report['by_recipient'][2]['label']);
        $this->assertSame(80_000, $report['by_recipient'][2]['amount']);
    }

    public function test_by_recipient_omits_platform_row_when_no_platform_orders(): void
    {
        $this->makeTenant('vh-a', 'Công ty VH An Phú');

        $this->fakeAggregation([
            $this->row(['recipient' => 'operating_company', 'organizationId' => 'vh-a', 'commissionAmount' => 180_000, 'vhShare' => 180_000]),
        ]);

        $report = app(CommissionAllocationReportServiceInterface::class)->build(['months' => 6]);

        $this->assertCount(1, $report['by_recipient']);
        $this->assertSame('vh-a', $report['by_recipient'][0]['recipient_id']);
    }

    // -------------------------------------------------------------------------
    // by_vendor
    // -------------------------------------------------------------------------

    public function test_by_vendor_sorted_desc_commission_and_shares_sum_to_commission(): void
    {
        $this->fakeAggregation([
            // vendor 12: commission 360_000 (platform 280k + vh 80k), gmv 5_200_000
            $this->row(['partnerId' => 12, 'partnerName' => 'Vendor Big', 'recipient' => 'platform', 'amount' => 4_200_000, 'commissionAmount' => 280_000, 'platformShare' => 280_000]),
            $this->row(['partnerId' => 12, 'partnerName' => 'Vendor Big', 'recipient' => 'operating_company', 'organizationId' => 'vh-a', 'amount' => 1_000_000, 'commissionAmount' => 80_000, 'vhShare' => 80_000]),
            // vendor 7: commission 50_000
            $this->row(['partnerId' => 7, 'partnerName' => 'Vendor Small', 'recipient' => 'platform', 'amount' => 600_000, 'commissionAmount' => 50_000, 'platformShare' => 50_000]),
        ]);

        $report = app(CommissionAllocationReportServiceInterface::class)->build(['months' => 6]);

        $this->assertCount(2, $report['by_vendor']);

        $this->assertSame(12, $report['by_vendor'][0]['partner_id']);
        $this->assertSame('Vendor Big', $report['by_vendor'][0]['partner_name']);
        $this->assertSame(2, $report['by_vendor'][0]['order_count']);
        $this->assertSame(5_200_000, $report['by_vendor'][0]['gmv']);
        $this->assertSame(360_000, $report['by_vendor'][0]['commission']);
        $this->assertSame(280_000, $report['by_vendor'][0]['platform_share']);
        $this->assertSame(80_000, $report['by_vendor'][0]['vh_share']);

        $this->assertSame(7, $report['by_vendor'][1]['partner_id']);

        foreach ($report['by_vendor'] as $vendor) {
            $this->assertSame(
                $vendor['commission'],
                $vendor['platform_share'] + $vendor['vh_share'],
            );
        }
    }

    // -------------------------------------------------------------------------
    // by_project
    // -------------------------------------------------------------------------

    public function test_by_project_sorted_desc_platform_share_and_name_from_row(): void
    {
        $this->fakeAggregation([
            // project 5: platform_share 150_000
            $this->row(['projectId' => 5, 'projectName' => 'Dự án X', 'recipient' => 'platform', 'commissionAmount' => 150_000, 'platformShare' => 150_000]),
            // project 9: platform_share 30_000
            $this->row(['projectId' => 9, 'projectName' => 'Dự án Y', 'recipient' => 'platform', 'commissionAmount' => 30_000, 'platformShare' => 30_000]),
            $this->row(['projectId' => 9, 'projectName' => 'Dự án Y', 'recipient' => 'operating_company', 'organizationId' => 'vh-a', 'commissionAmount' => 40_000, 'vhShare' => 40_000]),
            // null project — excluded
            $this->row(['projectId' => null, 'recipient' => 'platform', 'commissionAmount' => 999, 'platformShare' => 999]),
        ]);

        $report = app(CommissionAllocationReportServiceInterface::class)->build(['months' => 6]);

        $this->assertCount(2, $report['by_project']);

        $this->assertSame(5, $report['by_project'][0]['project_id']);
        $this->assertSame('Dự án X', $report['by_project'][0]['project_name']);
        $this->assertSame(150_000, $report['by_project'][0]['platform_share']);

        $this->assertSame(9, $report['by_project'][1]['project_id']);
        $this->assertSame('Dự án Y', $report['by_project'][1]['project_name']);
        $this->assertSame(2, $report['by_project'][1]['order_count']);
        $this->assertSame(30_000, $report['by_project'][1]['platform_share']);
        $this->assertSame(40_000, $report['by_project'][1]['vh_share']);
    }

    public function test_by_project_resolves_real_name_from_central_registry_when_row_name_null(): void
    {
        // Đơn vendor thật mang projectName = null; tên dự án thật lấy từ registry
        // trung tâm qua ReportAggregationService (khóa tenant_id|project_id).
        PlatformProjectRegistry::create([
            'tenant_id' => 'vh-a',
            'project_id' => 7,
            'code' => 'DA-REG',
            'name' => 'Tên thật từ registry',
            'status' => 'managing',
        ]);

        $this->fakeAggregation([
            $this->row(['organizationId' => 'vh-a', 'projectId' => 7, 'projectName' => null, 'recipient' => 'platform', 'commissionAmount' => 50_000, 'platformShare' => 50_000]),
            // Không có trong registry → giữ nhãn dự phòng "Dự án #<id>".
            $this->row(['organizationId' => 'vh-a', 'projectId' => 8, 'projectName' => null, 'recipient' => 'platform', 'commissionAmount' => 10_000, 'platformShare' => 10_000]),
        ]);

        $report = app(CommissionAllocationReportServiceInterface::class)->build(['months' => 6]);

        $byId = [];
        foreach ($report['by_project'] as $project) {
            $byId[$project['project_id']] = $project['project_name'];
        }

        $this->assertSame('Tên thật từ registry', $byId[7]);
        $this->assertSame('Dự án #8', $byId[8]);
    }

    // -------------------------------------------------------------------------
    // active-only / warnings
    // -------------------------------------------------------------------------

    public function test_cancelled_orders_excluded(): void
    {
        $this->fakeAggregation([
            $this->row(['recipient' => 'platform', 'commissionAmount' => 100, 'platformShare' => 100, 'status' => 'completed']),
            $this->row(['recipient' => 'platform', 'commissionAmount' => 999, 'platformShare' => 999, 'status' => 'cancelled']),
        ]);

        $report = app(CommissionAllocationReportServiceInterface::class)->build(['months' => 6]);

        $this->assertSame(100, $report['kpis']['commission_total']);
        $this->assertSame(100, $report['kpis']['platform_total']);
    }

    public function test_warnings_passed_through(): void
    {
        $this->fakeAggregation([]);

        $report = app(CommissionAllocationReportServiceInterface::class)->build(['months' => 6]);

        $this->assertArrayHasKey('warnings', $report);
        $this->assertFalse($report['warnings']['schema_missing']);
        $this->assertSame(0, $report['warnings']['skipped_orders']);
    }

    // -------------------------------------------------------------------------
    // HTTP endpoint tests
    // -------------------------------------------------------------------------

    public function test_endpoint_returns_full_shape(): void
    {
        $this->makeTenant('vh-a', 'Công ty VH An Phú');

        $this->fakeAggregation([
            $this->row(['recipient' => 'platform', 'commissionAmount' => 700_000, 'platformShare' => 700_000]),
            $this->row(['recipient' => 'operating_company', 'organizationId' => 'vh-a', 'commissionAmount' => 260_000, 'vhShare' => 260_000]),
        ]);

        $this->actingAsRequester()->getJson('/api/v1/platform/reports/commission-allocation?months=6')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.kpis.commission_total', 960_000)
            ->assertJsonPath('data.kpis.platform_total', 700_000)
            ->assertJsonPath('data.kpis.vh_total', 260_000)
            ->assertJsonPath('data.by_recipient.0.recipient_id', 'platform')
            ->assertJsonPath('data.by_recipient.0.label', 'Platform TNP');
    }

    public function test_months_out_of_range_returns_422(): void
    {
        $this->actingAsRequester()->getJson('/api/v1/platform/reports/commission-allocation?months=13')
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
