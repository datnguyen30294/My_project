<?php

namespace Tests\Modules\Platform;

use App\Modules\Platform\Auth\Models\RequesterAccount;
use App\Modules\Platform\Report\Support\PlatformVendorOrderRow;
use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\Platform\Tenant\Repositories\OrganizationRepository;
use App\Modules\PMC\Customer\Models\Customer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportFoundationTest extends TestCase
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

    public function test_all_organizations_returns_only_orgs(): void
    {
        Organization::withoutEvents(fn () => Organization::factory()->create(['id' => 'vh-a', 'is_organization' => true]));
        Organization::withoutEvents(fn () => Organization::factory()->create(['id' => 'mart-x', 'is_organization' => false]));

        $repo = app(OrganizationRepository::class);
        $ids = $repo->allOrganizations()->pluck('id')->all();

        $this->assertContains('vh-a', $ids);
        $this->assertNotContains('mart-x', $ids);
    }

    public function test_aggregation_returns_empty_when_no_partners(): void
    {
        $service = app(\App\Modules\Platform\Report\Contracts\PlatformVendorOrderAggregationExternalServiceInterface::class);
        $result = $service->collectOrders(now()->startOfMonth()->subMonths(5), now()->endOfMonth());

        $this->assertSame([], $result['rows']);
        $this->assertFalse($result['warnings']['schema_missing']);
        $this->assertSame(0, $result['warnings']['skipped_orders']);
    }

    public function test_resident_count_zero_when_tenant_has_no_customers(): void
    {
        $tenant = Organization::withoutEvents(fn () => Organization::factory()->create(['id' => 'vh-empty', 'is_organization' => true]));

        $svc = app(\App\Modules\PMC\Customer\ExternalServices\Platform\TenantCustomerCountExternalServiceInterface::class);

        $this->assertSame(0, $svc->countResidentsForTenant($tenant));
    }

    public function test_resident_count_returns_correct_count(): void
    {
        $tenant = Organization::withoutEvents(fn () => Organization::factory()->create(['id' => 'vh-count', 'is_organization' => true]));

        Customer::factory()->count(2)->create();

        $svc = app(\App\Modules\PMC\Customer\ExternalServices\Platform\TenantCustomerCountExternalServiceInterface::class);

        $this->assertSame(2, $svc->countResidentsForTenant($tenant));
    }

    /**
     * resi_mart's order table carries statuses (e.g. "shipping") that this repo's
     * VendorOrderStatus enum does not define. The aggregation reads the RAW status
     * string (not the enum cast) and the row must tolerate any value: anything that
     * is not "cancelled" counts as active, only "completed" counts as completed.
     */
    public function test_row_classifies_unknown_resi_mart_status_as_active(): void
    {
        $row = new PlatformVendorOrderRow(
            orderId: 1,
            partnerId: 1,
            partnerName: 'Vendor A',
            projectId: null,
            projectName: null,
            organizationId: 'vh-a',
            residentId: null,
            residentName: null,
            customerSource: null,
            type: 'product',
            offerTitle: null,
            amount: 1000,
            commissionAmount: 0,
            recipient: '',
            platformShare: 0,
            vhShare: 0,
            status: 'shipping',
            residentRating: null,
            residentRatingComment: null,
            createdAt: '2026-06-01',
        );

        $this->assertTrue($row->isActive());
        $this->assertFalse($row->isCompleted());
    }

    public function test_aggregation_service_caches_factset_per_window(): void
    {
        $fake = new class implements \App\Modules\Platform\Report\Contracts\PlatformVendorOrderAggregationExternalServiceInterface
        {
            public int $calls = 0;

            public function collectOrders(\Carbon\CarbonInterface $from, \Carbon\CarbonInterface $to): array
            {
                $this->calls++;

                return ['rows' => [], 'warnings' => ['schema_missing' => false, 'skipped_orders' => 0]];
            }
        };
        $this->app->instance(\App\Modules\Platform\Report\Contracts\PlatformVendorOrderAggregationExternalServiceInterface::class, $fake);

        $svc = app(\App\Modules\Platform\Report\Contracts\ReportAggregationServiceInterface::class);
        $from = now()->startOfMonth()->subMonths(5);
        $to = now()->endOfMonth();
        $svc->collectPlatformVendorOrders($from, $to);
        $svc->collectPlatformVendorOrders($from, $to); // same window → cached, no second call

        $this->assertSame(1, $fake->calls);
    }
}
