<?php

namespace Tests\Modules\Platform;

use App\Modules\Platform\Auth\Models\RequesterAccount;
use App\Modules\Platform\Report\Contracts\TenantHealthReportServiceInterface;
use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\PMC\Order\ExternalServices\Platform\TenantBusinessSummaryExternalServiceInterface;
use App\Modules\PMC\Project\ExternalServices\Platform\TenantProjectExternalServiceInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Báo cáo "Sức khỏe tenant & dự án" dựa HOÀN TOÀN trên đơn OG (PMC) — số đơn,
 * doanh thu, phí nền tảng, CSAT đều từ đơn OG; KHÔNG dùng đơn marketplace.
 */
class TenantHealthReportTest extends TestCase
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

    private function makeTenant(string $id, string $name = 'Công ty VH', bool $isActive = true): Organization
    {
        return Organization::withoutEvents(
            fn () => Organization::factory()->create([
                'id' => $id,
                'name' => $name,
                'is_active' => $isActive,
                'is_organization' => true,
            ])
        );
    }

    // -------------------------------------------------------------------------
    // by_company — OG metrics rolled up from project breakdown
    // -------------------------------------------------------------------------

    public function test_by_company_aggregates_og_metrics_per_tenant(): void
    {
        $this->makeTenant('vh-a', 'Vận hành Alpha');

        $this->fakeBusinessSummary(breakdown: [
            'vh-a' => [
                $this->project(['project_id' => 1, 'order_count' => 2, 'revenue' => 400_000, 'platform_fee' => 20_000, 'rating_sum' => 9, 'rated_count' => 2]),
                $this->project(['project_id' => 2, 'order_count' => 1, 'revenue' => 300_000, 'platform_fee' => 15_000, 'rating_sum' => 4, 'rated_count' => 1]),
            ],
        ]);
        $this->fakeProjects(['vh-a' => 2]);

        $report = app(TenantHealthReportServiceInterface::class)->build(['months' => 6]);

        $this->assertCount(1, $report['by_company']);
        $company = $report['by_company'][0];
        $this->assertSame('vh-a', $company['company_id']);
        $this->assertSame(3, $company['order_count']);
        $this->assertSame(700_000, $company['revenue']);
        $this->assertSame(35_000, $company['platform_fee']);
        // (9 + 4) / 3 = 4.333 → làm tròn 1 chữ số
        $this->assertSame(4.3, $company['avg_rating']);
        $this->assertSame(3, $company['rated_count']);
    }

    public function test_by_company_sorted_by_revenue_desc(): void
    {
        $this->makeTenant('vh-low');
        $this->makeTenant('vh-high');

        $this->fakeBusinessSummary(breakdown: [
            'vh-low' => [$this->project(['order_count' => 1, 'revenue' => 100_000])],
            'vh-high' => [$this->project(['order_count' => 1, 'revenue' => 900_000])],
        ]);
        $this->fakeProjects();

        $report = app(TenantHealthReportServiceInterface::class)->build(['months' => 6]);

        $this->assertSame('vh-high', $report['by_company'][0]['company_id']);
        $this->assertSame('vh-low', $report['by_company'][1]['company_id']);
    }

    public function test_by_company_keeps_tenant_with_zero_orders(): void
    {
        $this->makeTenant('vh-empty');

        $this->fakeBusinessSummary();
        $this->fakeProjects();

        $report = app(TenantHealthReportServiceInterface::class)->build(['months' => 6]);

        $this->assertCount(1, $report['by_company']);
        $company = $report['by_company'][0];
        $this->assertSame('vh-empty', $company['company_id']);
        $this->assertSame(0, $company['order_count']);
        $this->assertSame(0, $company['revenue']);
        $this->assertSame(0, $company['platform_fee']);
        $this->assertNull($company['avg_rating']);
        $this->assertSame(0, $company['rated_count']);
    }

    public function test_avg_rating_is_null_when_no_ratings(): void
    {
        $this->makeTenant('vh-a');

        $this->fakeBusinessSummary(breakdown: [
            'vh-a' => [$this->project(['order_count' => 1, 'revenue' => 100_000, 'rating_sum' => 0, 'rated_count' => 0])],
        ]);
        $this->fakeProjects();

        $report = app(TenantHealthReportServiceInterface::class)->build(['months' => 6]);

        $this->assertNull($report['by_company'][0]['avg_rating']);
        $this->assertSame(0, $report['by_company'][0]['rated_count']);
    }

    // -------------------------------------------------------------------------
    // order_trend — from PMC monthly business summary
    // -------------------------------------------------------------------------

    public function test_order_trend_is_delta_of_last_two_pmc_months(): void
    {
        $this->makeTenant('vh-a');

        $this->fakeBusinessSummary(monthly: [
            'vh-a' => [
                'summary' => ['tenant_revenue' => 0.0, 'order_count' => 0, 'platform_revenue' => 0.0],
                'months' => [
                    ['month' => '2026-05', 'label' => 'T5/2026', 'order_count' => 40, 'tenant_revenue' => 0.0, 'platform_fee' => 0.0],
                    ['month' => '2026-06', 'label' => 'T6/2026', 'order_count' => 58, 'tenant_revenue' => 0.0, 'platform_fee' => 0.0],
                ],
            ],
        ]);
        $this->fakeProjects();

        $report = app(TenantHealthReportServiceInterface::class)->build(['months' => 2]);

        $this->assertSame(58 - 40, $report['by_company'][0]['order_trend']);
        $this->assertSame(58, $report['by_company'][0]['last_month_orders']);
    }

    public function test_order_trend_is_zero_with_single_month(): void
    {
        $this->makeTenant('vh-a');

        $this->fakeBusinessSummary(monthly: [
            'vh-a' => [
                'summary' => ['tenant_revenue' => 0.0, 'order_count' => 0, 'platform_revenue' => 0.0],
                'months' => [
                    ['month' => '2026-06', 'label' => 'T6/2026', 'order_count' => 12, 'tenant_revenue' => 0.0, 'platform_fee' => 0.0],
                ],
            ],
        ]);
        $this->fakeProjects();

        $report = app(TenantHealthReportServiceInterface::class)->build(['months' => 1]);

        $this->assertSame(0, $report['by_company'][0]['order_trend']);
        $this->assertSame(12, $report['by_company'][0]['last_month_orders']);
    }

    // -------------------------------------------------------------------------
    // status {value,label}
    // -------------------------------------------------------------------------

    public function test_status_active_label(): void
    {
        $this->makeTenant('vh-active', 'Active VH', true);

        $this->fakeBusinessSummary();
        $this->fakeProjects();

        $report = app(TenantHealthReportServiceInterface::class)->build(['months' => 6]);

        $this->assertSame(['value' => 'active', 'label' => 'Hoạt động'], $report['by_company'][0]['status']);
    }

    public function test_status_inactive_label(): void
    {
        $this->makeTenant('vh-inactive', 'Inactive VH', false);

        $this->fakeBusinessSummary();
        $this->fakeProjects();

        $report = app(TenantHealthReportServiceInterface::class)->build(['months' => 6]);

        $this->assertSame(['value' => 'inactive', 'label' => 'Vô hiệu'], $report['by_company'][0]['status']);
    }

    public function test_project_count_from_external_service(): void
    {
        $this->makeTenant('vh-a');

        $this->fakeBusinessSummary();
        $this->fakeProjects(['vh-a' => 2]);

        $report = app(TenantHealthReportServiceInterface::class)->build(['months' => 6]);

        $this->assertSame(2, $report['by_company'][0]['project_count']);
    }

    // -------------------------------------------------------------------------
    // by_project — drill-down (OG)
    // -------------------------------------------------------------------------

    public function test_by_project_aggregates_og_metrics_and_resolves_name(): void
    {
        $this->makeTenant('vh-a', 'Vận hành Alpha');

        $this->fakeBusinessSummary(breakdown: [
            'vh-a' => [
                $this->project(['project_id' => 5, 'project_name' => 'Alpha Tower', 'order_count' => 3, 'revenue' => 300_000, 'platform_fee' => 18_000, 'rating_sum' => 14, 'rated_count' => 3]),
            ],
        ]);
        $this->fakeProjects();

        $report = app(TenantHealthReportServiceInterface::class)->build(['months' => 6]);

        $this->assertCount(1, $report['by_project']);
        $project = $report['by_project'][0];
        $this->assertSame(5, $project['project_id']);
        $this->assertSame('Alpha Tower', $project['project_name']);
        $this->assertSame('Vận hành Alpha', $project['company_name']);
        $this->assertSame(3, $project['order_count']);
        $this->assertSame(300_000, $project['revenue']);
        $this->assertSame(18_000, $project['platform_fee']);
        $this->assertSame(round(14 / 3, 1), $project['avg_rating']);
        $this->assertSame(3, $project['rated_count']);
        // Các cột marketplace cũ đã bỏ.
        $this->assertArrayNotHasKey('project_residents', $project);
        $this->assertArrayNotHasKey('walk_in_residents', $project);
    }

    public function test_by_project_sorted_by_revenue_desc(): void
    {
        $this->makeTenant('vh-a');

        $this->fakeBusinessSummary(breakdown: [
            'vh-a' => [
                $this->project(['project_id' => 1, 'order_count' => 1, 'revenue' => 100_000]),
                $this->project(['project_id' => 2, 'order_count' => 1, 'revenue' => 800_000]),
            ],
        ]);
        $this->fakeProjects();

        $report = app(TenantHealthReportServiceInterface::class)->build(['months' => 6]);

        $this->assertCount(2, $report['by_project']);
        $this->assertSame(2, $report['by_project'][0]['project_id']);
        $this->assertSame(1, $report['by_project'][1]['project_id']);
    }

    // -------------------------------------------------------------------------
    // company_id filter
    // -------------------------------------------------------------------------

    public function test_company_id_filter_narrows_by_company_and_by_project(): void
    {
        $this->makeTenant('vh-a', 'Alpha');
        $this->makeTenant('vh-b', 'Beta');

        $this->fakeBusinessSummary(breakdown: [
            'vh-a' => [$this->project(['project_id' => 1, 'order_count' => 1, 'revenue' => 100_000])],
            'vh-b' => [$this->project(['project_id' => 2, 'order_count' => 1, 'revenue' => 200_000])],
        ]);
        $this->fakeProjects();

        $report = app(TenantHealthReportServiceInterface::class)->build(['months' => 6, 'company_id' => 'vh-a']);

        $this->assertCount(1, $report['by_company']);
        $this->assertSame('vh-a', $report['by_company'][0]['company_id']);
        $this->assertSame(100_000, $report['by_company'][0]['revenue']);

        $this->assertCount(1, $report['by_project']);
        $this->assertSame(1, $report['by_project'][0]['project_id']);
    }

    // -------------------------------------------------------------------------
    // empty
    // -------------------------------------------------------------------------

    public function test_empty_returns_empty_arrays(): void
    {
        $this->fakeBusinessSummary();
        $this->fakeProjects();

        $report = app(TenantHealthReportServiceInterface::class)->build(['months' => 6]);

        $this->assertSame([], $report['by_company']);
        $this->assertSame([], $report['by_project']);
    }

    // -------------------------------------------------------------------------
    // HTTP endpoint
    // -------------------------------------------------------------------------

    public function test_endpoint_returns_shape(): void
    {
        $this->makeTenant('vh-a', 'Vận hành Alpha');

        $this->fakeBusinessSummary(breakdown: [
            'vh-a' => [$this->project(['project_id' => 1, 'project_name' => 'Tower', 'order_count' => 4, 'revenue' => 500_000, 'platform_fee' => 25_000, 'rating_sum' => 18, 'rated_count' => 4])],
        ]);
        $this->fakeProjects(['vh-a' => 3]);

        $this->actingAsRequester()->getJson('/api/v1/platform/reports/tenant-health?months=6')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.by_company.0.company_id', 'vh-a')
            ->assertJsonPath('data.by_company.0.revenue', 500_000)
            ->assertJsonPath('data.by_company.0.platform_fee', 25_000)
            ->assertJsonPath('data.by_company.0.status.value', 'active')
            ->assertJsonPath('data.by_company.0.project_count', 3)
            ->assertJsonPath('data.by_project.0.project_id', 1)
            ->assertJsonPath('data.by_project.0.project_name', 'Tower')
            ->assertJsonPath('data.by_project.0.revenue', 500_000);
    }

    public function test_months_out_of_range_returns_422(): void
    {
        $this->actingAsRequester()->getJson('/api/v1/platform/reports/tenant-health?months=13')
            ->assertStatus(422)
            ->assertJsonValidationErrors(['months']);
    }

    public function test_unknown_company_id_returns_422(): void
    {
        $this->actingAsRequester()->getJson('/api/v1/platform/reports/tenant-health?company_id=does-not-exist')
            ->assertStatus(422)
            ->assertJsonValidationErrors(['company_id']);
    }

    // -------------------------------------------------------------------------
    // Fakes / builders
    // -------------------------------------------------------------------------

    /**
     * @param  array<string, list<array<string, mixed>>>  $breakdown  per-project OG aggregates keyed by tenant id
     * @param  array<string, array<string, mixed>>  $monthly  monthly summary keyed by tenant id (cho order_trend)
     */
    private function fakeBusinessSummary(array $breakdown = [], array $monthly = []): void
    {
        $fake = new class($breakdown, $monthly) implements TenantBusinessSummaryExternalServiceInterface
        {
            /**
             * @param  array<string, list<array<string, mixed>>>  $breakdown
             * @param  array<string, array<string, mixed>>  $monthly
             */
            public function __construct(private array $breakdown, private array $monthly) {}

            public function getMonthlyBusinessSummary(Organization $tenant, int $months, ?int $projectId = null): array
            {
                return $this->monthly[$tenant->id] ?? [
                    'summary' => ['tenant_revenue' => 0.0, 'order_count' => 0, 'platform_revenue' => 0.0],
                    'months' => [],
                ];
            }

            public function getProjectBusinessBreakdown(Organization $tenant, int $months): array
            {
                return $this->breakdown[$tenant->id] ?? [];
            }
        };

        $this->app->instance(TenantBusinessSummaryExternalServiceInterface::class, $fake);
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array{project_id: int, project_name: string, order_count: int, revenue: int, platform_fee: int, rating_sum: int, rated_count: int}
     */
    private function project(array $overrides): array
    {
        return array_merge([
            'project_id' => 1,
            'project_name' => 'Dự án',
            'order_count' => 0,
            'revenue' => 0,
            'platform_fee' => 0,
            'rating_sum' => 0,
            'rated_count' => 0,
        ], $overrides);
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
