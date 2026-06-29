<?php

namespace Tests\Modules\Platform;

use App\Modules\Platform\Auth\Models\RequesterAccount;
use App\Modules\Platform\Report\Contracts\PlatformVendorOrderAggregationExternalServiceInterface;
use App\Modules\Platform\Report\Contracts\VendorScorecardReportServiceInterface;
use App\Modules\Platform\Report\Support\PlatformVendorOrderRow;
use App\Modules\Platform\Tenant\Models\Organization;
use Carbon\CarbonInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VendorScorecardReportTest extends TestCase
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
    // build — grouping & metrics
    // -------------------------------------------------------------------------

    public function test_only_vendors_with_orders_appear(): void
    {
        $this->fakeAggregation([
            $this->row(['partnerId' => 1, 'amount' => 100]),
        ]);

        $data = app(VendorScorecardReportServiceInterface::class)->build([]);

        $this->assertCount(1, $data['vendors']);
        $this->assertSame(1, $data['vendors'][0]['partner_id']);
    }

    public function test_default_sort_desc_gmv(): void
    {
        $this->fakeAggregation([
            $this->row(['partnerId' => 1, 'amount' => 100, 'status' => 'completed']),
            $this->row(['partnerId' => 2, 'amount' => 900, 'status' => 'completed']),
            $this->row(['partnerId' => 3, 'amount' => 500, 'status' => 'completed']),
        ]);

        $data = app(VendorScorecardReportServiceInterface::class)->build([]);

        $this->assertSame([2, 3, 1], array_column($data['vendors'], 'partner_id'));
    }

    public function test_sort_by_order_count_desc(): void
    {
        $this->fakeAggregation([
            $this->row(['partnerId' => 1, 'amount' => 1000, 'status' => 'completed']),
            $this->row(['partnerId' => 2, 'amount' => 1, 'status' => 'completed']),
            $this->row(['partnerId' => 2, 'amount' => 1, 'status' => 'completed']),
            $this->row(['partnerId' => 2, 'amount' => 1, 'status' => 'completed']),
        ]);

        $data = app(VendorScorecardReportServiceInterface::class)->build(['sort' => 'order_count']);

        $this->assertSame([2, 1], array_column($data['vendors'], 'partner_id'));
        $this->assertSame(3, $data['vendors'][0]['order_count']);
    }

    public function test_sort_by_commission_desc(): void
    {
        $this->fakeAggregation([
            $this->row(['partnerId' => 1, 'commissionAmount' => 100, 'status' => 'completed']),
            $this->row(['partnerId' => 2, 'commissionAmount' => 500, 'status' => 'completed']),
        ]);

        $data = app(VendorScorecardReportServiceInterface::class)->build(['sort' => 'commission']);

        $this->assertSame([2, 1], array_column($data['vendors'], 'partner_id'));
    }

    public function test_sort_by_platform_fee_desc(): void
    {
        $this->fakeAggregation([
            $this->row(['partnerId' => 1, 'platformShare' => 100, 'status' => 'completed']),
            $this->row(['partnerId' => 2, 'platformShare' => 700, 'status' => 'completed']),
        ]);

        $data = app(VendorScorecardReportServiceInterface::class)->build(['sort' => 'platform_fee']);

        $this->assertSame([2, 1], array_column($data['vendors'], 'partner_id'));
    }

    public function test_sort_by_completion_rate_desc(): void
    {
        $this->fakeAggregation([
            // partner 1: 1/2 completed = 50%
            $this->row(['partnerId' => 1, 'status' => 'completed']),
            $this->row(['partnerId' => 1, 'status' => 'pending']),
            // partner 2: 2/2 completed = 100%
            $this->row(['partnerId' => 2, 'status' => 'completed']),
            $this->row(['partnerId' => 2, 'status' => 'completed']),
        ]);

        $data = app(VendorScorecardReportServiceInterface::class)->build(['sort' => 'completion_rate']);

        $this->assertSame([2, 1], array_column($data['vendors'], 'partner_id'));
        $this->assertSame(100, $data['vendors'][0]['completion_rate']);
        $this->assertSame(50, $data['vendors'][1]['completion_rate']);
    }

    public function test_sort_by_cancel_rate_desc(): void
    {
        $this->fakeAggregation([
            // partner 1: 0/1 cancelled = 0%
            $this->row(['partnerId' => 1, 'status' => 'completed']),
            // partner 2: 1/2 cancelled = 50%
            $this->row(['partnerId' => 2, 'status' => 'completed']),
            $this->row(['partnerId' => 2, 'status' => 'cancelled']),
        ]);

        $data = app(VendorScorecardReportServiceInterface::class)->build(['sort' => 'cancel_rate']);

        $this->assertSame([2, 1], array_column($data['vendors'], 'partner_id'));
        $this->assertSame(50, $data['vendors'][0]['cancel_rate']);
        $this->assertSame(0, $data['vendors'][1]['cancel_rate']);
    }

    public function test_sort_by_avg_rating_nulls_last(): void
    {
        $this->fakeAggregation([
            // partner 1: rating 5
            $this->row(['partnerId' => 1, 'residentRating' => 5, 'status' => 'completed']),
            // partner 2: rating 3
            $this->row(['partnerId' => 2, 'residentRating' => 3, 'status' => 'completed']),
            // partner 3: no rating
            $this->row(['partnerId' => 3, 'residentRating' => null, 'status' => 'completed']),
        ]);

        $data = app(VendorScorecardReportServiceInterface::class)->build(['sort' => 'avg_rating']);

        $this->assertSame([1, 2, 3], array_column($data['vendors'], 'partner_id'));
        $this->assertSame(5.0, $data['vendors'][0]['avg_rating']);
        $this->assertSame(3.0, $data['vendors'][1]['avg_rating']);
        $this->assertNull($data['vendors'][2]['avg_rating']);
    }

    public function test_gmv_commission_platform_fee_summed_on_active_rows_only(): void
    {
        $this->fakeAggregation([
            $this->row([
                'partnerId' => 1,
                'amount' => 1000,
                'commissionAmount' => 100,
                'platformShare' => 40,
                'status' => 'completed',
            ]),
            // cancelled — excluded from money, counted in order_count + cancel_count
            $this->row([
                'partnerId' => 1,
                'amount' => 9999,
                'commissionAmount' => 999,
                'platformShare' => 999,
                'status' => 'cancelled',
            ]),
        ]);

        $data = app(VendorScorecardReportServiceInterface::class)->build([]);

        $vendor = $data['vendors'][0];
        $this->assertSame(1000, $vendor['gmv']);
        $this->assertSame(100, $vendor['commission']);
        $this->assertSame(40, $vendor['platform_fee']);
        $this->assertSame(2, $vendor['order_count']);
        $this->assertSame(1, $vendor['active_count']);
        $this->assertSame(1, $vendor['cancel_count']);
    }

    public function test_completion_and_cancel_rate_rounded_int_over_order_count(): void
    {
        $this->fakeAggregation([
            // 3 orders: 1 completed, 1 cancelled, 1 pending
            $this->row(['partnerId' => 1, 'status' => 'completed']),
            $this->row(['partnerId' => 1, 'status' => 'cancelled']),
            $this->row(['partnerId' => 1, 'status' => 'pending']),
        ]);

        $data = app(VendorScorecardReportServiceInterface::class)->build([]);

        $vendor = $data['vendors'][0];
        $this->assertSame(3, $vendor['order_count']);
        $this->assertSame(1, $vendor['completed_count']);
        $this->assertSame(1, $vendor['cancel_count']);
        // 1/3 * 100 = 33.33 -> 33
        $this->assertSame(33, $vendor['completion_rate']);
        $this->assertSame(33, $vendor['cancel_rate']);
        $this->assertIsInt($vendor['completion_rate']);
        $this->assertIsInt($vendor['cancel_rate']);
    }

    public function test_avg_rating_null_when_no_rated_rows(): void
    {
        $this->fakeAggregation([
            $this->row(['partnerId' => 1, 'residentRating' => null, 'status' => 'completed']),
        ]);

        $data = app(VendorScorecardReportServiceInterface::class)->build([]);

        $this->assertNull($data['vendors'][0]['avg_rating']);
        $this->assertSame(0, $data['vendors'][0]['rated_count']);
    }

    public function test_avg_rating_set_and_rounded_when_rated(): void
    {
        $this->fakeAggregation([
            // ratings 5, 4, 4 -> avg 4.33 -> 4.3
            $this->row(['partnerId' => 1, 'residentRating' => 5, 'status' => 'completed']),
            $this->row(['partnerId' => 1, 'residentRating' => 4, 'status' => 'completed']),
            $this->row(['partnerId' => 1, 'residentRating' => 4, 'status' => 'completed']),
        ]);

        $data = app(VendorScorecardReportServiceInterface::class)->build([]);

        $this->assertSame(3, $data['vendors'][0]['rated_count']);
        $this->assertSame(4.3, $data['vendors'][0]['avg_rating']);
    }

    public function test_product_and_service_counts(): void
    {
        $this->fakeAggregation([
            $this->row(['partnerId' => 1, 'type' => 'product', 'status' => 'completed']),
            $this->row(['partnerId' => 1, 'type' => 'product', 'status' => 'completed']),
            $this->row(['partnerId' => 1, 'type' => 'service', 'status' => 'completed']),
        ]);

        $data = app(VendorScorecardReportServiceInterface::class)->build([]);

        $this->assertSame(2, $data['vendors'][0]['product_count']);
        $this->assertSame(1, $data['vendors'][0]['service_count']);
    }

    public function test_status_from_first_row(): void
    {
        $this->fakeAggregation([
            $this->row([
                'partnerId' => 1,
                'partnerName' => 'Đối tác Demo',
                'partnerStatus' => 'active',
                'partnerStatusLabel' => 'Đang hoạt động',
                'status' => 'completed',
            ]),
        ]);

        $data = app(VendorScorecardReportServiceInterface::class)->build([]);

        $vendor = $data['vendors'][0];
        $this->assertSame('Đối tác Demo', $vendor['partner_name']);
        $this->assertSame('active', $vendor['status']['value']);
        $this->assertSame('Đang hoạt động', $vendor['status']['label']);
    }

    public function test_empty_factset_returns_empty_vendors(): void
    {
        $this->fakeAggregation([]);

        $data = app(VendorScorecardReportServiceInterface::class)->build([]);

        $this->assertSame([], $data['vendors']);
        $this->assertSame(6, $data['months']);
    }

    // -------------------------------------------------------------------------
    // HTTP endpoint tests
    // -------------------------------------------------------------------------

    public function test_endpoint_happy_path_returns_success_and_months(): void
    {
        $this->fakeAggregation([
            $this->row(['partnerId' => 1, 'amount' => 100, 'status' => 'completed']),
        ]);

        $this->actingAsRequester()->getJson('/api/v1/platform/reports/vendor-scorecard?months=3')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.months', 3)
            ->assertJsonPath('data.vendors.0.partner_id', 1);
    }

    public function test_months_out_of_range_returns_422(): void
    {
        $this->actingAsRequester()->getJson('/api/v1/platform/reports/vendor-scorecard?months=13')
            ->assertStatus(422)
            ->assertJsonValidationErrors(['months']);
    }

    public function test_bogus_sort_returns_422(): void
    {
        $this->actingAsRequester()->getJson('/api/v1/platform/reports/vendor-scorecard?sort=bogus')
            ->assertStatus(422)
            ->assertJsonValidationErrors(['sort']);
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
}
