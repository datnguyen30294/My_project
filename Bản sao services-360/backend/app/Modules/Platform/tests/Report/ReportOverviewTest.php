<?php

namespace Tests\Modules\Platform;

use App\Modules\Platform\Auth\Models\RequesterAccount;
use App\Modules\Platform\Report\Contracts\CsatReportServiceInterface;
use App\Modules\Platform\Report\Contracts\PlatformVendorOrderAggregationExternalServiceInterface;
use App\Modules\Platform\Report\Contracts\ReportOverviewServiceInterface;
use App\Modules\Platform\Report\Contracts\ResidentSegmentReportServiceInterface;
use App\Modules\Platform\Report\Contracts\RevenueReportServiceInterface;
use App\Modules\Platform\Report\Support\PlatformVendorOrderRow;
use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\PMC\Customer\ExternalServices\Platform\TenantCustomerCountExternalServiceInterface;
use App\Modules\PMC\Order\ExternalServices\Platform\TenantBusinessSummaryExternalServiceInterface;
use App\Modules\PMC\Project\ExternalServices\Platform\TenantProjectExternalServiceInterface;
use Carbon\CarbonInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportOverviewTest extends TestCase
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
    // build — KPI composition
    // -------------------------------------------------------------------------

    public function test_total_platform_revenue_sums_two_sources(): void
    {
        $this->makeTenant('vh-a');

        // (a) marketplace platform commission
        $this->fakeAggregation([
            $this->row(['recipient' => 'platform', 'platformShare' => 700_000, 'amount' => 9_600_000]),
        ]);

        // (b) PMC frozen platform fee
        $this->fakeBusinessSummary([
            'vh-a' => [
                'summary' => ['tenant_revenue' => 0.0, 'order_count' => 0, 'platform_revenue' => 2_870_000.0],
                'months' => [],
            ],
        ]);
        $this->fakeProjects();
        $this->fakeCustomerCount(0);

        $data = app(ReportOverviewServiceInterface::class)->build(['months' => 6]);

        $this->assertSame(700_000 + 2_870_000, $data['kpis']['total_platform_revenue']);
        $this->assertSame(9_600_000, $data['kpis']['marketplace_gmv']);
    }

    public function test_kpis_match_underlying_report_services(): void
    {
        $this->makeTenant('vh-a');
        $this->makeTenant('vh-b');

        $this->fakeAggregation([
            $this->row(['partnerId' => 1, 'residentId' => 10, 'residentRating' => 4, 'amount' => 500, 'status' => 'completed']),
            $this->row(['partnerId' => 2, 'residentId' => 11, 'residentRating' => 2, 'amount' => 300, 'status' => 'completed']),
        ]);
        $this->fakeBusinessSummary([]);
        $this->fakeProjects();
        $this->fakeCustomerCount(50);

        $data = app(ReportOverviewServiceInterface::class)->build(['months' => 6]);

        $csat = app(CsatReportServiceInterface::class)->build(['months' => 6]);
        $residents = app(ResidentSegmentReportServiceInterface::class)->build(['months' => 6]);
        $revenue = app(RevenueReportServiceInterface::class)->build(['months' => 6]);

        $this->assertSame($csat['kpis']['avg_rating'], $data['kpis']['avg_rating']);
        $this->assertSame($csat['kpis']['rated_count'], $data['kpis']['rated_count']);
        $this->assertSame($residents['kpis']['active_residents'], $data['kpis']['active_residents']);
        $this->assertSame($residents['kpis']['total_residents'], $data['kpis']['total_residents']);
        $this->assertSame($revenue['kpis']['total_platform_revenue'], $data['kpis']['total_platform_revenue']);

        // 2 distinct vendors with orders.
        $this->assertSame(2, $data['kpis']['vendor_count']);
        // total_residents = 50 per tenant × 2 tenants.
        $this->assertSame(100, $data['kpis']['total_residents']);
    }

    public function test_tenant_count_counts_organizations(): void
    {
        $this->makeTenant('vh-a');
        $this->makeTenant('vh-b');
        $this->makeTenant('vh-c');

        $this->fakeAggregation([]);
        $this->fakeBusinessSummary([]);
        $this->fakeProjects();
        $this->fakeCustomerCount(0);

        $data = app(ReportOverviewServiceInterface::class)->build(['months' => 6]);

        $this->assertSame(3, $data['kpis']['tenant_count']);
    }

    public function test_active_residents_not_greater_than_total_residents(): void
    {
        $this->makeTenant('vh-a');

        $this->fakeAggregation([
            $this->row(['residentId' => 1, 'status' => 'completed']),
            $this->row(['residentId' => 2, 'status' => 'completed']),
        ]);
        $this->fakeBusinessSummary([]);
        $this->fakeProjects();
        $this->fakeCustomerCount(10);

        $data = app(ReportOverviewServiceInterface::class)->build(['months' => 6]);

        $this->assertLessThanOrEqual($data['kpis']['total_residents'], $data['kpis']['active_residents']);
    }

    public function test_empty_returns_all_zero_kpis(): void
    {
        $this->fakeAggregation([]);
        $this->fakeBusinessSummary([]);
        $this->fakeProjects();
        $this->fakeCustomerCount(0);

        $data = app(ReportOverviewServiceInterface::class)->build(['months' => 6]);

        $this->assertSame(0, $data['kpis']['total_platform_revenue']);
        $this->assertSame(0, $data['kpis']['marketplace_gmv']);
        $this->assertSame(0, $data['kpis']['rated_count']);
        $this->assertSame(0, $data['kpis']['active_residents']);
        $this->assertSame(0, $data['kpis']['total_residents']);
        $this->assertSame(0, $data['kpis']['vendor_count']);
        $this->assertSame(0, $data['kpis']['tenant_count']);
        // avg_rating coalesced to 0 when no ratings.
        $this->assertSame(0, $data['kpis']['avg_rating']);
    }

    public function test_report_cards_has_seven_in_order(): void
    {
        $this->fakeAggregation([]);
        $this->fakeBusinessSummary([]);
        $this->fakeProjects();
        $this->fakeCustomerCount(0);

        $data = app(ReportOverviewServiceInterface::class)->build(['months' => 6]);

        $this->assertCount(7, $data['report_cards']);
        $this->assertSame(
            ['revenue', 'csat', 'service-adoption', 'resident-segments', 'tenant-health', 'commission-allocation', 'vendor-scorecard'],
            array_column($data['report_cards'], 'key'),
        );

        foreach ($data['report_cards'] as $card) {
            $this->assertArrayHasKey('route', $card);
            $this->assertArrayHasKey('title', $card);
            $this->assertArrayHasKey('blurb', $card);
            $this->assertArrayHasKey('kpi', $card);
            $this->assertArrayHasKey('sub', $card);
        }
    }

    public function test_report_card_kpi_reuses_headline_kpis(): void
    {
        $this->makeTenant('vh-a');

        $this->fakeAggregation([]);
        $this->fakeBusinessSummary([]);
        $this->fakeProjects();
        $this->fakeCustomerCount(0);

        $data = app(ReportOverviewServiceInterface::class)->build(['months' => 6]);

        $revenueCard = collect($data['report_cards'])->firstWhere('key', 'revenue');
        $this->assertSame($data['kpis']['total_platform_revenue'], $revenueCard['kpi']);
        $this->assertSame('VND / 6 tháng', $revenueCard['sub']);
    }

    // -------------------------------------------------------------------------
    // HTTP endpoint
    // -------------------------------------------------------------------------

    public function test_overview_endpoint_returns_full_shape(): void
    {
        $this->makeTenant('vh-a');
        $this->fakeAggregation([]);
        $this->fakeBusinessSummary([]);
        $this->fakeProjects();
        $this->fakeCustomerCount(0);

        $this->actingAsRequester()->getJson('/api/v1/platform/reports/overview?months=6')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.kpis.tenant_count', 1)
            ->assertJsonCount(7, 'data.report_cards')
            ->assertJsonPath('data.report_cards.0.key', 'revenue');
    }

    public function test_months_out_of_range_returns_422(): void
    {
        $this->actingAsRequester()->getJson('/api/v1/platform/reports/overview?months=13')
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
            'partnerStatus' => 'active',
            'partnerStatusLabel' => 'Đang hoạt động',
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
            partnerStatus: $data['partnerStatus'],
            partnerStatusLabel: $data['partnerStatusLabel'],
        );
    }

    /**
     * @param  array<string, array<string, mixed>>  $byTenantId
     */
    private function fakeBusinessSummary(array $byTenantId): void
    {
        $fake = new class($byTenantId) implements TenantBusinessSummaryExternalServiceInterface
        {
            /** @param array<string, array<string, mixed>> $byTenantId */
            public function __construct(private array $byTenantId) {}

            public function getMonthlyBusinessSummary(Organization $tenant, int $months, ?int $projectId = null): array
            {
                return $this->byTenantId[$tenant->id] ?? [
                    'summary' => ['tenant_revenue' => 0.0, 'order_count' => 0, 'platform_revenue' => 0.0],
                    'months' => [],
                ];
            }

            public function getProjectBusinessBreakdown(Organization $tenant, int $months): array
            {
                return [];
            }
        };

        $this->app->instance(TenantBusinessSummaryExternalServiceInterface::class, $fake);
    }

    private function fakeProjects(): void
    {
        $fake = new class implements TenantProjectExternalServiceInterface
        {
            public function listProjects(Organization $tenant, array $filters): \Illuminate\Pagination\LengthAwarePaginator
            {
                return new \Illuminate\Pagination\LengthAwarePaginator([], 0, 15);
            }

            public function getProjectsForTenant(Organization $tenant): array
            {
                return [];
            }

            public function findProject(Organization $tenant, int $projectId): array
            {
                return [
                    'id' => $projectId,
                    'code' => 'P',
                    'name' => 'Project',
                    'address' => null,
                    'status' => ['value' => 'active', 'label' => 'Đang hoạt động'],
                ];
            }

            public function createProject(Organization $tenant, array $data): array
            {
                return [
                    'id' => 1,
                    'code' => $data['code'],
                    'name' => $data['name'],
                    'address' => $data['address'] ?? null,
                    'status' => ['value' => 'active', 'label' => 'Đang hoạt động'],
                ];
            }
        };

        $this->app->instance(TenantProjectExternalServiceInterface::class, $fake);
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
}
