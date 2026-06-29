<?php

namespace Tests\Modules\Platform;

use App\Modules\Platform\Auth\Models\RequesterAccount;
use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\PMC\ClosingPeriod\Models\ClosingPeriod;
use App\Modules\PMC\ClosingPeriod\Models\ClosingPeriodOrder;
use App\Modules\PMC\Order\Models\Order;
use Carbon\CarbonInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TenantBusinessSummaryTest extends TestCase
{
    use RefreshDatabase;

    private RequesterAccount $requester;

    private Organization $tenant;

    protected function setUp(): void
    {
        parent::setUp();

        $this->requester = RequesterAccount::create([
            'name' => 'Platform Admin',
            'email' => 'admin@test.com',
            'password' => 'password',
            'is_active' => true,
        ]);

        $this->tenant = Organization::withoutEvents(
            fn () => Organization::factory()->create(['id' => 'vh-test'])
        );
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

    private function baseUrl(?string $tenantId = null): string
    {
        return '/api/v1/platform/tenants/'.($tenantId ?? $this->tenant->id).'/business-summary';
    }

    /** A safe mid-month date in the month `$offset` months before the current month. */
    private function dateInMonth(int $offset): CarbonInterface
    {
        return now()->startOfMonth()->subMonthsNoOverflow($offset)->addDays(10);
    }

    private function monthKey(int $offset): string
    {
        return now()->startOfMonth()->subMonthsNoOverflow($offset)->format('Y-m');
    }

    private function createCompletedOrder(float $amount, CarbonInterface $completedAt, ?float $platformFee = null): Order
    {
        $order = Order::factory()->completed()->create([
            'total_amount' => $amount,
            'completed_at' => $completedAt,
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

    // ========== HAPPY PATH ==========

    public function test_default_window_returns_six_months_with_summary_totals(): void
    {
        $this->createCompletedOrder(1_000_000, $this->dateInMonth(0), 50_000);
        $this->createCompletedOrder(2_000_000, $this->dateInMonth(1), 100_000);
        // Completed but not yet in a closing period → counts for revenue, fee = 0.
        $this->createCompletedOrder(500_000, $this->dateInMonth(2));

        $response = $this->actingAsRequester()->getJson($this->baseUrl());

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.summary.order_count', 3)
            ->assertJsonCount(6, 'data.months');

        $this->assertEqualsWithDelta(3_500_000, $response->json('data.summary.tenant_revenue'), 0.001);
        $this->assertEqualsWithDelta(150_000, $response->json('data.summary.platform_revenue'), 0.001);

        $months = collect($response->json('data.months'));

        $current = $months->firstWhere('month', $this->monthKey(0));
        $this->assertSame(1, $current['order_count']);
        $this->assertEqualsWithDelta(1_000_000, $current['tenant_revenue'], 0.001);
        $this->assertEqualsWithDelta(50_000, $current['platform_fee'], 0.001);
        $this->assertSame('T'.now()->startOfMonth()->format('n/Y'), $current['label']);
    }

    public function test_months_are_ordered_chronologically_and_gaps_filled_with_zero(): void
    {
        $this->createCompletedOrder(1_000_000, $this->dateInMonth(0), 10_000);
        $this->createCompletedOrder(3_000_000, $this->dateInMonth(2), 30_000);

        $response = $this->actingAsRequester()->getJson($this->baseUrl());

        $months = collect($response->json('data.months'));

        // Oldest first, current month last.
        $this->assertSame($this->monthKey(5), $months->first()['month']);
        $this->assertSame($this->monthKey(0), $months->last()['month']);

        // Month with no orders (offset 1) is zero-filled, not skipped.
        $gap = $months->firstWhere('month', $this->monthKey(1));
        $this->assertSame(0, $gap['order_count']);
        $this->assertEqualsWithDelta(0, $gap['tenant_revenue'], 0.001);
        $this->assertEqualsWithDelta(0, $gap['platform_fee'], 0.001);
    }

    public function test_platform_fee_aggregates_only_frozen_fee_from_closing_periods(): void
    {
        $this->createCompletedOrder(2_000_000, $this->dateInMonth(0), 80_000);
        // Same month, no closing period → adds to revenue/count but not to fee.
        $this->createCompletedOrder(3_000_000, $this->dateInMonth(0));

        $response = $this->actingAsRequester()->getJson($this->baseUrl());

        $response->assertOk()->assertJsonPath('data.summary.order_count', 2);
        $this->assertEqualsWithDelta(5_000_000, $response->json('data.summary.tenant_revenue'), 0.001);
        $this->assertEqualsWithDelta(80_000, $response->json('data.summary.platform_revenue'), 0.001);
    }

    public function test_respects_months_parameter_and_excludes_out_of_window_orders(): void
    {
        $this->createCompletedOrder(1_000_000, $this->dateInMonth(0), 10_000);
        // 3 months back is outside a 3-month window (offsets 0,1,2).
        $this->createCompletedOrder(7_000_000, $this->dateInMonth(3), 70_000);

        $response = $this->actingAsRequester()->getJson($this->baseUrl().'?months=3');

        $response->assertOk()
            ->assertJsonCount(3, 'data.months')
            ->assertJsonPath('data.summary.order_count', 1);

        $this->assertEqualsWithDelta(1_000_000, $response->json('data.summary.tenant_revenue'), 0.001);
        $this->assertEqualsWithDelta(10_000, $response->json('data.summary.platform_revenue'), 0.001);
    }

    // ========== EXCLUSIONS ==========

    public function test_excludes_non_completed_orders(): void
    {
        $this->createCompletedOrder(1_000_000, $this->dateInMonth(0), 50_000);
        Order::factory()->create(['total_amount' => 9_000_000]); // draft, no completed_at
        Order::factory()->cancelled()->create([
            'total_amount' => 5_000_000,
            'completed_at' => $this->dateInMonth(0),
        ]);

        $response = $this->actingAsRequester()->getJson($this->baseUrl());

        $response->assertOk()->assertJsonPath('data.summary.order_count', 1);
        $this->assertEqualsWithDelta(1_000_000, $response->json('data.summary.tenant_revenue'), 0.001);
    }

    public function test_excludes_soft_deleted_orders(): void
    {
        $this->createCompletedOrder(1_000_000, $this->dateInMonth(0), 50_000);
        $this->createCompletedOrder(2_000_000, $this->dateInMonth(0), 90_000)->delete();

        $response = $this->actingAsRequester()->getJson($this->baseUrl());

        $response->assertOk()->assertJsonPath('data.summary.order_count', 1);
        $this->assertEqualsWithDelta(1_000_000, $response->json('data.summary.tenant_revenue'), 0.001);
        $this->assertEqualsWithDelta(50_000, $response->json('data.summary.platform_revenue'), 0.001);
    }

    public function test_returns_zero_filled_window_for_tenant_without_orders(): void
    {
        $response = $this->actingAsRequester()->getJson($this->baseUrl());

        $response->assertOk()
            ->assertJsonPath('data.summary.order_count', 0)
            ->assertJsonCount(6, 'data.months');

        $this->assertEqualsWithDelta(0, $response->json('data.summary.tenant_revenue'), 0.001);
        $this->assertEqualsWithDelta(0, $response->json('data.summary.platform_revenue'), 0.001);
    }

    // ========== VALIDATION & AUTH ==========

    public function test_rejects_invalid_months(): void
    {
        $this->actingAsRequester()
            ->getJson($this->baseUrl().'?months=0')
            ->assertStatus(422)
            ->assertJsonValidationErrors(['months']);

        $this->actingAsRequester()
            ->getJson($this->baseUrl().'?months=13')
            ->assertStatus(422)
            ->assertJsonValidationErrors(['months']);
    }

    public function test_returns_404_for_nonexistent_tenant(): void
    {
        $this->actingAsRequester()
            ->getJson($this->baseUrl('khong-ton-tai'))
            ->assertStatus(404);
    }

    public function test_requires_authentication(): void
    {
        $this->getJson($this->baseUrl())->assertStatus(401);
    }
}
