<?php

declare(strict_types=1);

namespace Tests\Modules\Platform\OgOrder;

use App\Modules\Platform\Auth\Models\RequesterAccount;
use App\Modules\Platform\OgOrder\Contracts\OgOrderConsoleServiceInterface;
use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\PMC\Order\ExternalServices\Platform\TenantProjectOrderExternalServiceInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Collection;
use Tests\TestCase;

class PlatformOgOrderTest extends TestCase
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

    private function makeTenant(string $id, string $name = 'Công ty VH', bool $isActive = true, bool $isOrganization = true): Organization
    {
        return Organization::withoutEvents(
            fn () => Organization::factory()->create([
                'id' => $id,
                'name' => $name,
                'is_active' => $isActive,
                'is_organization' => $isOrganization,
            ])
        );
    }

    /**
     * @param  array<string, list<array<string, mixed>>>  $rowsByTenantId
     * @param  array<string, mixed>  $capturedFilters  passed by reference to assert pass-through
     */
    private function fakeTenantOrders(array $rowsByTenantId, ?array &$capturedFilters = null): void
    {
        $captureRef = &$capturedFilters;

        $fake = new class($rowsByTenantId, $captureRef) implements TenantProjectOrderExternalServiceInterface
        {
            /**
             * @param  array<string, list<array<string, mixed>>>  $rowsByTenantId
             */
            public function __construct(private array $rowsByTenantId, private mixed &$capture) {}

            public function listProjectOrders(Organization $tenant, int $projectId, array $filters): \Illuminate\Pagination\LengthAwarePaginator
            {
                return new \Illuminate\Pagination\LengthAwarePaginator([], 0, 10);
            }

            public function listTenantOrders(Organization $tenant, array $filters): Collection
            {
                $this->capture = $filters;

                return collect($this->rowsByTenantId[$tenant->id] ?? []);
            }
        };

        $this->app->instance(TenantProjectOrderExternalServiceInterface::class, $fake);
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function row(array $overrides = []): array
    {
        return array_merge([
            'id' => 1,
            'code' => 'OG-001',
            'subject' => 'Sửa điện',
            'project_id' => 10,
            'project_name' => 'Dự án A',
            'customer_name' => 'Nguyễn Văn A',
            'customer_phone' => '0900000000',
            'total_amount' => '1000000.00',
            'platform_fee' => '50000.00',
            'status' => ['value' => 'completed', 'label' => 'Hoàn thành'],
            'created_at' => now()->toIso8601String(),
            'completed_at' => now()->toIso8601String(),
        ], $overrides);
    }

    // -------------------------------------------------------------------------
    // Auth
    // -------------------------------------------------------------------------

    public function test_list_requires_authentication(): void
    {
        $this->getJson('/api/v1/platform/og-orders')->assertUnauthorized();
    }

    public function test_summary_requires_authentication(): void
    {
        $this->getJson('/api/v1/platform/og-orders/summary')->assertUnauthorized();
    }

    // -------------------------------------------------------------------------
    // List — cross-tenant aggregation
    // -------------------------------------------------------------------------

    public function test_list_aggregates_orders_across_tenants(): void
    {
        $this->makeTenant('vh-a', 'Công ty A');
        $this->makeTenant('vh-b', 'Công ty B');

        $this->fakeTenantOrders([
            'vh-a' => [$this->row(['id' => 1, 'code' => 'OG-A1'])],
            'vh-b' => [
                $this->row(['id' => 2, 'code' => 'OG-B1']),
                $this->row(['id' => 3, 'code' => 'OG-B2']),
            ],
        ]);

        $this->actingAsRequester()
            ->getJson('/api/v1/platform/og-orders')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(3, 'data')
            ->assertJsonPath('meta.total', 3);
    }

    public function test_list_stamps_tenant_onto_each_row(): void
    {
        $this->makeTenant('vh-a', 'Công ty A');

        $this->fakeTenantOrders([
            'vh-a' => [$this->row(['code' => 'OG-A1'])],
        ]);

        $this->actingAsRequester()
            ->getJson('/api/v1/platform/og-orders')
            ->assertOk()
            ->assertJsonPath('data.0.tenant.id', 'vh-a')
            ->assertJsonPath('data.0.tenant.name', 'Công ty A')
            ->assertJsonPath('data.0.code', 'OG-A1');
    }

    public function test_includes_active_tenant_even_when_not_flagged_organization(): void
    {
        // Tenant đang hoạt động nhưng is_organization=false (mặc định khi tạo) vẫn
        // phải xuất hiện — console phủ MỌI công ty VH có dữ liệu, không lọc cờ này.
        $this->makeTenant('vh-plain', 'Công ty thường', isActive: true, isOrganization: false);

        $this->fakeTenantOrders([
            'vh-plain' => [$this->row(['code' => 'OG-P1'])],
        ]);

        $this->actingAsRequester()
            ->getJson('/api/v1/platform/og-orders')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.code', 'OG-P1');
    }

    public function test_excludes_inactive_tenant(): void
    {
        $this->makeTenant('vh-off', 'Công ty tắt', isActive: false);

        $this->fakeTenantOrders([
            'vh-off' => [$this->row(['code' => 'OG-OFF1'])],
        ]);

        $this->actingAsRequester()
            ->getJson('/api/v1/platform/og-orders')
            ->assertOk()
            ->assertJsonCount(0, 'data');
    }

    public function test_list_filters_by_tenant_id(): void
    {
        $this->makeTenant('vh-a', 'Công ty A');
        $this->makeTenant('vh-b', 'Công ty B');

        $this->fakeTenantOrders([
            'vh-a' => [$this->row(['id' => 1, 'code' => 'OG-A1'])],
            'vh-b' => [$this->row(['id' => 2, 'code' => 'OG-B1'])],
        ]);

        $this->actingAsRequester()
            ->getJson('/api/v1/platform/og-orders?tenant_id=vh-b')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.code', 'OG-B1')
            ->assertJsonPath('data.0.tenant.id', 'vh-b');
    }

    public function test_list_passes_status_and_search_through_to_tenant_query(): void
    {
        $this->makeTenant('vh-a');

        $captured = null;
        $this->fakeTenantOrders(['vh-a' => [$this->row()]], $captured);

        $this->actingAsRequester()
            ->getJson('/api/v1/platform/og-orders?status=completed&search=OG-001')
            ->assertOk();

        $this->assertSame('completed', $captured['status']);
        $this->assertSame('OG-001', $captured['search']);
    }

    // -------------------------------------------------------------------------
    // Summary
    // -------------------------------------------------------------------------

    public function test_summary_aggregates_gmv_fee_and_tenant_count(): void
    {
        $this->makeTenant('vh-a');
        $this->makeTenant('vh-b');

        $this->fakeTenantOrders([
            'vh-a' => [
                $this->row(['id' => 1, 'total_amount' => '1000000.00', 'platform_fee' => '50000.00']),
            ],
            'vh-b' => [
                $this->row(['id' => 2, 'total_amount' => '2000000.00', 'platform_fee' => '100000.00']),
            ],
        ]);

        $this->actingAsRequester()
            ->getJson('/api/v1/platform/og-orders/summary')
            ->assertOk()
            ->assertJsonPath('data.orders_count', 2)
            ->assertJsonPath('data.gmv', 3_000_000)
            ->assertJsonPath('data.platform_fee', 150_000)
            ->assertJsonPath('data.tenants_count', 2)
            ->assertJsonPath('data.currency', 'VND');
    }

    public function test_summary_tenant_count_only_includes_tenants_with_orders(): void
    {
        $this->makeTenant('vh-a');
        $this->makeTenant('vh-empty');

        $this->fakeTenantOrders([
            'vh-a' => [$this->row()],
            'vh-empty' => [],
        ]);

        $this->actingAsRequester()
            ->getJson('/api/v1/platform/og-orders/summary')
            ->assertOk()
            ->assertJsonPath('data.tenants_count', 1);
    }

    // -------------------------------------------------------------------------
    // Validation
    // -------------------------------------------------------------------------

    public function test_invalid_status_returns_422(): void
    {
        $this->actingAsRequester()
            ->getJson('/api/v1/platform/og-orders?status=bogus')
            ->assertStatus(422)
            ->assertJsonValidationErrors(['status']);
    }

    public function test_per_page_over_max_returns_422(): void
    {
        $this->actingAsRequester()
            ->getJson('/api/v1/platform/og-orders?per_page=100')
            ->assertStatus(422)
            ->assertJsonValidationErrors(['per_page']);
    }

    public function test_to_before_from_returns_422(): void
    {
        $this->actingAsRequester()
            ->getJson('/api/v1/platform/og-orders?from=2026-06-10&to=2026-06-01')
            ->assertStatus(422)
            ->assertJsonValidationErrors(['to']);
    }

    // -------------------------------------------------------------------------
    // Degrade — failing tenant schema is skipped, not fatal
    // -------------------------------------------------------------------------

    public function test_failing_tenant_is_counted_as_warning_not_fatal(): void
    {
        $this->makeTenant('vh-a');

        $fake = new class implements TenantProjectOrderExternalServiceInterface
        {
            public function listProjectOrders(Organization $tenant, int $projectId, array $filters): \Illuminate\Pagination\LengthAwarePaginator
            {
                return new \Illuminate\Pagination\LengthAwarePaginator([], 0, 10);
            }

            public function listTenantOrders(Organization $tenant, array $filters): Collection
            {
                throw new \RuntimeException('schema missing');
            }
        };
        $this->app->instance(TenantProjectOrderExternalServiceInterface::class, $fake);

        $this->actingAsRequester()
            ->getJson('/api/v1/platform/og-orders')
            ->assertOk()
            ->assertJsonCount(0, 'data')
            ->assertJsonPath('warnings.tenants_failed', 1);
    }

    public function test_service_bound(): void
    {
        $this->assertInstanceOf(
            OgOrderConsoleServiceInterface::class,
            app(OgOrderConsoleServiceInterface::class),
        );
    }
}
