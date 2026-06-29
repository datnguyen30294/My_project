<?php

namespace Tests\Modules\Platform;

use App\Modules\Platform\Auth\Models\RequesterAccount;
use App\Modules\Platform\Report\Contracts\PlatformVendorOrderAggregationExternalServiceInterface;
use App\Modules\Platform\Report\Contracts\RevenueReportServiceInterface;
use App\Modules\Platform\Report\Support\PlatformVendorOrderRow;
use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\PMC\Order\ExternalServices\Platform\TenantBusinessSummaryExternalServiceInterface;
use App\Modules\PMC\Project\ExternalServices\Platform\TenantProjectExternalServiceInterface;
use Carbon\CarbonInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RevenueReportTest extends TestCase
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
    // RevenueReportService::build — 2-source assembly (marketplace + PMC)
    // -------------------------------------------------------------------------

    public function test_total_revenue_sums_two_sources(): void
    {
        $this->makeTenant('vh-a');

        $this->fakeAggregation([
            $this->row([
                'recipient' => 'platform',
                'platformShare' => 700_000,
                'amount' => 9_600_000,
            ]),
        ]);

        $this->fakeBusinessSummary([
            'vh-a' => [
                'summary' => ['tenant_revenue' => 0.0, 'order_count' => 0, 'platform_revenue' => 2_870_000.0],
                'months' => [],
            ],
        ]);
        $this->fakeProjects();

        $report = app(RevenueReportServiceInterface::class)->build(['months' => 6]);

        $this->assertSame(700_000 + 2_870_000, $report['kpis']['total_platform_revenue']);
        $this->assertSame(700_000, $report['kpis']['marketplace_platform_fee']);
        $this->assertSame(2_870_000, $report['kpis']['pmc_platform_fee']);
    }

    public function test_pmc_fee_counts_active_tenant_even_when_not_flagged_organization(): void
    {
        // Real tenants are provisioned with is_organization=false; the PMC section
        // must still aggregate their frozen platform fee. Regression for the report
        // dropping PMC revenue because it iterated is_organization=true only.
        Organization::withoutEvents(
            fn () => Organization::factory()->create([
                'id' => 'vh-resi',
                'name' => 'Công ty Thần Nông',
                'is_active' => true,
                'is_organization' => false,
            ])
        );

        $this->fakeAggregation([]);
        $this->fakeBusinessSummary([
            'vh-resi' => [
                'summary' => ['tenant_revenue' => 1_186_000.0, 'order_count' => 4, 'platform_revenue' => 48_500.0],
                'months' => [],
            ],
        ]);
        $this->fakeProjects();

        $report = app(RevenueReportServiceInterface::class)->build(['months' => 6]);

        $this->assertSame(48_500, $report['kpis']['pmc_platform_fee']);
        $this->assertSame(48_500, $report['kpis']['total_platform_revenue']);
        $this->assertCount(1, $report['by_tenant']);
        $this->assertSame('vh-resi', $report['by_tenant'][0]['company_id']);
    }

    public function test_marketplace_kpis_exclude_cancelled(): void
    {
        $this->fakeAggregation([
            $this->row(['amount' => 100, 'status' => 'completed']),
            $this->row(['amount' => 999, 'status' => 'cancelled']),
        ]);
        $this->fakeBusinessSummary([]);
        $this->fakeProjects();

        $report = app(RevenueReportServiceInterface::class)->build(['months' => 6]);

        $this->assertSame(100, $report['kpis']['marketplace_gmv']);
        $this->assertSame(1, $report['kpis']['order_count']);
    }

    public function test_by_tenant_sorted_desc_by_platform_fee(): void
    {
        $this->makeTenant('vh-low');
        $this->makeTenant('vh-high');

        $this->fakeAggregation([]);
        $this->fakeBusinessSummary([
            'vh-low' => [
                'summary' => ['tenant_revenue' => 0.0, 'order_count' => 3, 'platform_revenue' => 50_000.0],
                'months' => [],
            ],
            'vh-high' => [
                'summary' => ['tenant_revenue' => 0.0, 'order_count' => 7, 'platform_revenue' => 300_000.0],
                'months' => [],
            ],
        ]);
        $this->fakeProjects();

        $report = app(RevenueReportServiceInterface::class)->build(['months' => 6]);

        $this->assertCount(2, $report['by_tenant']);
        $this->assertSame('vh-high', $report['by_tenant'][0]['company_id']);
        $this->assertSame(300_000, $report['by_tenant'][0]['platform_revenue']);
        $this->assertSame('vh-low', $report['by_tenant'][1]['company_id']);
        $this->assertSame(50_000, $report['by_tenant'][1]['platform_revenue']);
    }

    public function test_analytics_months_zero_filled_and_is_pmc(): void
    {
        $this->makeTenant('vh-months');

        $currentMonth = now()->format('Y-m');

        $this->fakeAggregation([]);
        $this->fakeBusinessSummary([
            'vh-months' => [
                'summary' => ['tenant_revenue' => 820_000.0, 'order_count' => 42, 'platform_revenue' => 41_200.0],
                'months' => [
                    [
                        'month' => $currentMonth,
                        'label' => 'T'.now()->format('n/Y'),
                        'order_count' => 42,
                        'tenant_revenue' => 820_000.0,
                        'platform_fee' => 41_200.0,
                    ],
                ],
            ],
        ]);
        $this->fakeProjects();

        $report = app(RevenueReportServiceInterface::class)->build(['months' => 6]);

        $this->assertCount(6, $report['analytics_months']);

        $byMonth = collect($report['analytics_months'])->keyBy('month');
        $this->assertSame(42, $byMonth[$currentMonth]['order_count']);
        $this->assertSame(820_000, $byMonth[$currentMonth]['tenant_revenue']);
        $this->assertSame(41_200, $byMonth[$currentMonth]['platform_revenue']);

        $emptyMonths = collect($report['analytics_months'])->reject(fn (array $row): bool => $row['month'] === $currentMonth);
        $this->assertCount(5, $emptyMonths);
        foreach ($emptyMonths as $row) {
            $this->assertSame(0, $row['order_count']);
            $this->assertSame(0, $row['tenant_revenue']);
            $this->assertSame(0, $row['platform_revenue']);
        }
    }

    public function test_empty_returns_zeros(): void
    {
        $this->fakeAggregation([]);
        $this->fakeBusinessSummary([]);
        $this->fakeProjects();

        $report = app(RevenueReportServiceInterface::class)->build(['months' => 6]);

        foreach ($report['kpis'] as $value) {
            $this->assertSame(0, $value);
        }

        $this->assertSame([], $report['by_tenant']);
        $this->assertCount(6, $report['monthly_marketplace']);
        $this->assertCount(6, $report['analytics_months']);

        foreach ($report['monthly_marketplace'] as $row) {
            $this->assertSame(0, $row['gmv']);
            $this->assertSame(0, $row['platform_fee']);
        }
    }

    // -------------------------------------------------------------------------
    // HTTP endpoint tests
    // -------------------------------------------------------------------------

    public function test_revenue_endpoint_returns_full_shape(): void
    {
        $this->makeTenant('vh-a');
        $this->fakeAggregation([]);
        $this->fakeBusinessSummary([
            'vh-a' => [
                'summary' => ['tenant_revenue' => 0, 'order_count' => 0, 'platform_revenue' => 0],
                'months' => [],
            ],
        ]);
        $this->fakeProjects();

        $this->actingAsRequester()->getJson('/api/v1/platform/reports/revenue?months=6')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.kpis.total_platform_revenue', 0)
            ->assertJsonCount(6, 'data.analytics_months')
            ->assertJsonCount(6, 'data.monthly_marketplace');
    }

    public function test_months_out_of_range_returns_422(): void
    {
        $this->actingAsRequester()->getJson('/api/v1/platform/reports/revenue?months=13')
            ->assertStatus(422)
            ->assertJsonValidationErrors(['months']);
    }

    public function test_marketplace_vh_share_populated(): void
    {
        $this->makeTenant('vh-a');
        $this->fakeAggregation([
            $this->row([
                'recipient' => 'operating_company',
                'vhShare' => 260_000,
                'commissionAmount' => 260_000,
                'amount' => 1_000_000,
                'status' => 'completed',
            ]),
        ]);
        $this->fakeBusinessSummary([]);
        $this->fakeProjects();

        $data = app(RevenueReportServiceInterface::class)->build(['months' => 6]);

        $this->assertSame(260_000, $data['kpis']['marketplace_vh_share']);
        $this->assertSame(0, $data['kpis']['marketplace_platform_fee']);
    }

    public function test_monthly_marketplace_has_current_month_values(): void
    {
        $this->makeTenant('vh-a');
        $this->fakeAggregation([
            $this->row([
                'amount' => 100,
                'platformShare' => 10,
                'recipient' => 'platform',
                'commissionAmount' => 10,
                'status' => 'completed',
                'createdAt' => now()->toDateString(),
            ]),
        ]);
        $this->fakeBusinessSummary([]);
        $this->fakeProjects();

        $data = app(RevenueReportServiceInterface::class)->build(['months' => 6]);

        $currentKey = now()->format('Y-m');
        $entry = collect($data['monthly_marketplace'])->firstWhere('month', $currentKey);

        $this->assertNotNull($entry);
        $this->assertSame(100, $entry['gmv']);
        $this->assertSame(10, $entry['platform_fee']);
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

    /**
     * @param  array<string, array{summary: array{tenant_revenue: float, order_count: int, platform_revenue: float}, months: list<array{month: string, label: string, order_count: int, tenant_revenue: float, platform_fee: float}>}>  $byTenantId
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

    /**
     * @param  array<string, int>  $countByTenantId
     */
    private function fakeProjects(array $countByTenantId = []): void
    {
        $fake = new class($countByTenantId) implements TenantProjectExternalServiceInterface
        {
            /** @param array<string, int> $countByTenantId */
            public function __construct(private array $countByTenantId) {}

            public function listProjects(Organization $tenant, array $filters): \Illuminate\Pagination\LengthAwarePaginator
            {
                return new \Illuminate\Pagination\LengthAwarePaginator([], 0, 15);
            }

            public function getProjectsForTenant(Organization $tenant): array
            {
                $count = $this->countByTenantId[$tenant->id] ?? 0;

                return array_fill(0, $count, [
                    'id' => 1,
                    'code' => 'P',
                    'name' => 'Project',
                    'address' => null,
                    'status' => ['value' => 'active', 'label' => 'Đang hoạt động'],
                ]);
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
}
