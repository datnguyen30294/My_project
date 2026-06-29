<?php

namespace Tests\Modules\Platform;

use App\Modules\Platform\Auth\Models\RequesterAccount;
use App\Modules\Platform\Tenant\Enums\TenantFeeMode;
use App\Modules\Platform\Tenant\ExternalServices\PMC\TenantConfigExternalServiceInterface;
use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\Platform\Tenant\Models\ProjectFeeConfig;
use App\Modules\Platform\Tenant\Models\TenantConfig;
use App\Modules\PMC\ClosingPeriod\Models\ClosingPeriod;
use App\Modules\PMC\ClosingPeriod\Models\ClosingPeriodOrder;
use App\Modules\PMC\OgTicket\Models\OgTicket;
use App\Modules\PMC\Order\Models\Order;
use App\Modules\PMC\Project\ExternalServices\Platform\TenantProjectExternalServiceInterface;
use App\Modules\PMC\Project\Models\Project;
use App\Modules\PMC\Quote\Models\Quote;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery\MockInterface;
use Tests\TestCase;

class PlatformProjectConsoleTest extends TestCase
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

    private function makeTenant(string $id, bool $isActive = true): Organization
    {
        return Organization::withoutEvents(
            fn () => Organization::factory()->create(['id' => $id, 'is_active' => $isActive])
        );
    }

    /**
     * @param  array{value: string, label: string}  $status
     * @return array<string, mixed>
     */
    private function projectRow(int $id, string $code, string $name, array $status, ?string $address = null): array
    {
        return [
            'id' => $id,
            'code' => $code,
            'name' => $name,
            'address' => $address,
            'status' => $status,
        ];
    }

    private const MANAGING = ['value' => 'managing', 'label' => 'Đang quản lý'];

    private const STOPPED = ['value' => 'stopped', 'label' => 'Đã dừng'];

    // ----- LIST (cross-tenant merge) -----

    private function mockProjectsAcrossTenants(): void
    {
        $this->mock(
            TenantProjectExternalServiceInterface::class,
            function (MockInterface $mock): void {
                $mock->shouldReceive('getProjectsForTenant')->andReturnUsing(
                    fn (Organization $org): array => match ($org->id) {
                        'vh-a' => [
                            $this->projectRow(1, 'DA-A1', 'Alpha', self::MANAGING),
                            $this->projectRow(2, 'DA-A2', 'Beta', self::STOPPED),
                        ],
                        'vh-b' => [
                            $this->projectRow(1, 'DA-B1', 'Gamma', self::MANAGING),
                        ],
                        default => [],
                    }
                );
            }
        );
    }

    public function test_list_merges_projects_across_tenants_with_stats(): void
    {
        $this->makeTenant('vh-a');
        $this->makeTenant('vh-b', isActive: false);
        ProjectFeeConfig::factory()->serviceDisabled()->create(['organization_id' => 'vh-a', 'project_id' => 2]);

        $this->mockProjectsAcrossTenants();

        $response = $this->actingAsRequester()->getJson('/api/v1/platform/projects');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('meta.total', 3)
            ->assertJsonCount(3, 'data')
            ->assertJsonPath('stats.total', 3)
            ->assertJsonPath('stats.managing', 2)
            ->assertJsonPath('stats.tenant_count', 2)
            ->assertJsonPath('stats.service_disabled', 1)
            // default sort: name ASC
            ->assertJsonPath('data.0.name', 'Alpha')
            ->assertJsonPath('data.1.name', 'Beta')
            ->assertJsonPath('data.2.name', 'Gamma')
            ->assertJsonPath('data.0.tenant.id', 'vh-a')
            ->assertJsonPath('data.1.platform_service_enabled', false)
            ->assertJsonPath('data.2.tenant.is_active', false);
    }

    public function test_list_filters_by_status_and_organization_and_service_flag(): void
    {
        $this->makeTenant('vh-a');
        $this->makeTenant('vh-b');
        ProjectFeeConfig::factory()->serviceDisabled()->create(['organization_id' => 'vh-a', 'project_id' => 2]);

        $this->mockProjectsAcrossTenants();

        $this->actingAsRequester()->getJson('/api/v1/platform/projects?status=managing')
            ->assertOk()->assertJsonCount(2, 'data');

        $this->actingAsRequester()->getJson('/api/v1/platform/projects?organization_id=vh-a')
            ->assertOk()->assertJsonCount(2, 'data');

        $this->actingAsRequester()->getJson('/api/v1/platform/projects?search=Gamma')
            ->assertOk()->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Gamma');

        $this->actingAsRequester()->getJson('/api/v1/platform/projects?platform_service_enabled=0')
            ->assertOk()->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Beta');
    }

    public function test_list_sorts_by_code_desc_and_paginates(): void
    {
        $this->makeTenant('vh-a');
        $this->makeTenant('vh-b');
        $this->mockProjectsAcrossTenants();

        $this->actingAsRequester()->getJson('/api/v1/platform/projects?sort_by=code&sort_direction=desc')
            ->assertOk()
            ->assertJsonPath('data.0.code', 'DA-B1');

        $this->actingAsRequester()->getJson('/api/v1/platform/projects?per_page=2&page=2')
            ->assertOk()
            ->assertJsonPath('meta.total', 3)
            ->assertJsonPath('meta.per_page', 2)
            ->assertJsonCount(1, 'data');
    }

    public function test_list_rejects_unknown_organization_filter(): void
    {
        $this->makeTenant('vh-a');

        $this->actingAsRequester()->getJson('/api/v1/platform/projects?organization_id=nope')
            ->assertStatus(422)
            ->assertJsonValidationErrors(['organization_id']);
    }

    // ----- CREATE -----

    public function test_create_project_into_tenant_schema_and_seeds_fee_config(): void
    {
        $tenant = $this->makeTenant('vh-create');

        $response = $this->actingAsRequester()->postJson('/api/v1/platform/tenants/vh-create/projects', [
            'code' => 'DA-NEW',
            'name' => 'Dự án mới',
            'address' => 'Số 1',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.code', 'DA-NEW')
            ->assertJsonPath('data.status.value', 'managing')
            ->assertJsonPath('data.tenant.id', 'vh-create');

        $this->assertDatabaseHas('projects', ['code' => 'DA-NEW', 'name' => 'Dự án mới']);
        $this->assertDatabaseHas('project_fee_configs', [
            'organization_id' => 'vh-create',
            'inherit_default' => true,
            'platform_service_enabled' => true,
        ]);
    }

    public function test_create_project_rejects_duplicate_code(): void
    {
        $this->makeTenant('vh-dup');
        Project::factory()->create(['code' => 'DA-DUP']);

        $this->actingAsRequester()->postJson('/api/v1/platform/tenants/vh-dup/projects', [
            'code' => 'DA-DUP',
            'name' => 'Trùng mã',
        ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['code']);
    }

    public function test_create_project_blocked_for_inactive_tenant(): void
    {
        $this->makeTenant('vh-inactive', isActive: false);

        $this->actingAsRequester()->postJson('/api/v1/platform/tenants/vh-inactive/projects', [
            'code' => 'DA-X',
            'name' => 'Dự án X',
        ])
            ->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonPath('error_code', 'TENANT_INACTIVE');
    }

    public function test_create_validation_errors(): void
    {
        $this->makeTenant('vh-val');

        $this->actingAsRequester()->postJson('/api/v1/platform/tenants/vh-val/projects', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['code', 'name']);
    }

    public function test_create_returns_404_for_unknown_tenant(): void
    {
        $this->actingAsRequester()->postJson('/api/v1/platform/tenants/ghost/projects', [
            'code' => 'DA-Y',
            'name' => 'Dự án Y',
        ])->assertStatus(404);
    }

    // ----- DETAIL -----

    public function test_show_returns_project_detail_with_tenant(): void
    {
        $this->makeTenant('vh-detail');
        $project = Project::factory()->create(['code' => 'DA-DET', 'name' => 'Chi tiết']);

        $this->actingAsRequester()->getJson("/api/v1/platform/tenants/vh-detail/projects/{$project->id}")
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.code', 'DA-DET')
            ->assertJsonPath('data.tenant.id', 'vh-detail');
    }

    public function test_show_returns_404_for_unknown_project(): void
    {
        $this->makeTenant('vh-404');

        $this->actingAsRequester()->getJson('/api/v1/platform/tenants/vh-404/projects/999999')
            ->assertStatus(404);
    }

    // ----- BUSINESS SUMMARY (project scope) -----

    private function completedOrderForProject(Project $project, float $amount, ?float $platformFee = null): Order
    {
        $ogTicket = OgTicket::factory()->create(['project_id' => $project->id]);
        $quote = Quote::factory()->approved()->create(['og_ticket_id' => $ogTicket->id]);
        $order = Order::factory()->completed()->create([
            'quote_id' => $quote->id,
            'total_amount' => $amount,
            'completed_at' => now(),
        ]);

        if ($platformFee !== null) {
            $period = ClosingPeriod::factory()->create();
            ClosingPeriodOrder::create([
                'closing_period_id' => $period->id,
                'order_id' => $order->id,
                'frozen_receivable_amount' => $amount,
                'frozen_commission_total' => 0,
                'frozen_platform_fee' => $platformFee,
            ]);
        }

        return $order;
    }

    public function test_business_summary_is_scoped_to_project(): void
    {
        $this->makeTenant('vh-sum');
        $project = Project::factory()->create();
        $other = Project::factory()->create();

        $this->completedOrderForProject($project, 1_000_000, 50_000);
        $this->completedOrderForProject($other, 2_000_000, 100_000);

        $this->actingAsRequester()->getJson("/api/v1/platform/tenants/vh-sum/projects/{$project->id}/business-summary")
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.summary.order_count', 1)
            ->assertJsonPath('data.summary.tenant_revenue', 1_000_000)
            ->assertJsonPath('data.summary.platform_revenue', 50_000)
            ->assertJsonCount(6, 'data.months');
    }

    // ----- ORDERS (project scope, with frozen platform fee) -----

    public function test_orders_lists_project_orders_with_platform_fee(): void
    {
        $this->makeTenant('vh-ord');
        $project = Project::factory()->create();
        $other = Project::factory()->create();

        $this->completedOrderForProject($project, 1_000_000, 50_000);
        $this->completedOrderForProject($other, 2_000_000, 100_000);

        $this->actingAsRequester()->getJson("/api/v1/platform/tenants/vh-ord/projects/{$project->id}/orders")
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('meta.total', 1)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.platform_fee', '50000.00');
    }

    // ----- RESIDENT RATINGS (project scope) -----

    public function test_resident_ratings_scoped_to_project_with_summary(): void
    {
        $this->makeTenant('vh-rate');
        $project = Project::factory()->create();
        $other = Project::factory()->create();

        OgTicket::factory()->rated(4)->create(['project_id' => $project->id]);
        OgTicket::factory()->rated(5)->create(['project_id' => $project->id]);
        OgTicket::factory()->rated(2)->create(['project_id' => $other->id]);

        // Project-scoped average (4.5) differs from the global average (3.67),
        // proving the summary is computed on the project-filtered set.
        $this->actingAsRequester()->getJson("/api/v1/platform/tenants/vh-rate/projects/{$project->id}/resident-ratings")
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('summary.count', 2)
            ->assertJsonPath('summary.average', 4.5)
            ->assertJsonPath('meta.total', 2);
    }

    // ----- FEE CONFIG -----

    public function test_fee_config_returns_inherited_when_no_override(): void
    {
        $this->makeTenant('vh-fee');
        TenantConfig::factory()->fixedPerOrder()->create(['tenant_id' => 'vh-fee']);
        $project = Project::factory()->create();

        $this->actingAsRequester()->getJson("/api/v1/platform/tenants/vh-fee/projects/{$project->id}/fee-config")
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.inherit_default', true)
            ->assertJsonPath('data.platform_service_enabled', true)
            ->assertJsonPath('data.effective.fee_mode.value', 'fixed_per_order')
            ->assertJsonPath('data.effective.fixed_fee_per_order', '1000.00')
            ->assertJsonPath('data.tenant_default.fee_mode.value', 'fixed_per_order');

        $this->assertDatabaseHas('project_fee_configs', [
            'organization_id' => 'vh-fee',
            'project_id' => $project->id,
        ]);
    }

    public function test_update_fee_config_with_percent_override(): void
    {
        $this->makeTenant('vh-fee2');
        TenantConfig::factory()->fixedPerOrder()->create(['tenant_id' => 'vh-fee2']);
        $project = Project::factory()->create();

        $this->actingAsRequester()->putJson("/api/v1/platform/tenants/vh-fee2/projects/{$project->id}/fee-config", [
            'inherit_default' => false,
            'fee_mode' => 'percent_per_order',
            'percent_fee_per_order' => 0.5,
            'platform_service_enabled' => true,
            'notes' => 'Dự án flagship',
        ])
            ->assertOk()
            ->assertJsonPath('data.inherit_default', false)
            ->assertJsonPath('data.effective.fee_mode.value', 'percent_per_order')
            ->assertJsonPath('data.effective.percent_fee_per_order', '0.50')
            ->assertJsonPath('data.tenant_default.fee_mode.value', 'fixed_per_order');

        $this->assertDatabaseHas('project_fee_configs', [
            'organization_id' => 'vh-fee2',
            'project_id' => $project->id,
            'inherit_default' => false,
            'fee_mode' => 'percent_per_order',
        ]);
    }

    public function test_update_fee_config_requires_fee_mode_when_not_inheriting(): void
    {
        $this->makeTenant('vh-fee3');
        $project = Project::factory()->create();

        $this->actingAsRequester()->putJson("/api/v1/platform/tenants/vh-fee3/projects/{$project->id}/fee-config", [
            'inherit_default' => false,
            'platform_service_enabled' => true,
        ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['fee_mode']);
    }

    // ----- PER-PROJECT FEE POLICY RESOLUTION (closing-period consumer) -----

    public function test_fee_policy_for_project_uses_override_else_tenant_default(): void
    {
        $tenant = $this->makeTenant('vh-pol');
        TenantConfig::factory()->fixedPerOrder()->create(['tenant_id' => 'vh-pol']);
        ProjectFeeConfig::factory()->percentOverride(0.5)->create([
            'organization_id' => 'vh-pol',
            'project_id' => 777,
        ]);

        tenancy()->initialize($tenant);

        $service = app(TenantConfigExternalServiceInterface::class);

        $override = $service->getFeePolicyForProject(777);
        $this->assertNotNull($override);
        $this->assertSame(TenantFeeMode::PercentPerOrder, $override->mode);
        $this->assertSame(0.5, $override->appliedPercent());

        $fallback = $service->getFeePolicyForProject(999);
        $this->assertNotNull($fallback);
        $this->assertSame(TenantFeeMode::FixedPerOrder, $fallback->mode);
        $this->assertSame(1000.0, $fallback->appliedFixed());
    }

    public function test_requires_authentication(): void
    {
        $this->getJson('/api/v1/platform/projects')->assertStatus(401);
    }
}
