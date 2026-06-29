<?php

namespace Tests\Modules\Marketplace;

use App\Modules\Marketplace\Partner\Enums\PartnerStatus;
use App\Modules\Marketplace\Partner\Models\Partner;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\RevenueRecipient;
use App\Modules\Marketplace\PartnerCommissionContract\Models\PartnerCommissionContract;
use App\Modules\Marketplace\PartnerProject\Models\PartnerProject;
use App\Modules\Platform\Auth\Models\RequesterAccount;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Console "Quản lý Vendor" — approval flow, stats, list aggregate, offers,
 * ratings (deferred), revenue trend, bulk default contracts, revenue_recipient.
 */
class PlatformVendorConsoleTest extends TestCase
{
    use RefreshDatabase;

    private RequesterAccount $requester;

    private string $base = '/api/v1/platform/partners';

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

    private function acting(): static
    {
        $this->actingAs($this->requester, 'requester');

        return $this;
    }

    private function makePartner(string $slug, PartnerStatus $status, ?string $tenantId = null, ?string $ownerTenantId = null): Partner
    {
        return Partner::create([
            'slug' => $slug,
            'tenant_id' => $tenantId,
            'owner_tenant_id' => $ownerTenantId,
            'name' => ucfirst($slug),
            'owner_email' => $slug.'@example.com',
            'status' => $status->value,
        ]);
    }

    private function link(Partner $partner, string $tenantId, int $projectId): PartnerProject
    {
        return PartnerProject::create([
            'partner_id' => $partner->id,
            'tenant_id' => $tenantId,
            'project_id' => $projectId,
            'is_vendor_enabled' => true,
            'registered_at' => now(),
        ]);
    }

    // ───────────────────────── APPROVAL FLOW ─────────────────────────

    public function test_approve_moves_pending_to_active(): void
    {
        $partner = $this->makePartner('vendor-pending', PartnerStatus::Pending);

        $this->acting()->postJson("{$this->base}/{$partner->id}/approve")
            ->assertOk()
            ->assertJsonPath('data.status.value', 'active');

        $this->assertDatabaseHas('partners', ['id' => $partner->id, 'status' => 'active']);
    }

    public function test_approve_rejects_non_pending(): void
    {
        $partner = $this->makePartner('vendor-active', PartnerStatus::Active);

        $this->acting()->postJson("{$this->base}/{$partner->id}/approve")
            ->assertStatus(422)
            ->assertJsonPath('error_code', 'INVALID_PARTNER_TRANSITION');
    }

    public function test_deactivate_moves_active_to_suspended(): void
    {
        $partner = $this->makePartner('vendor-on', PartnerStatus::Active);

        $this->acting()->postJson("{$this->base}/{$partner->id}/deactivate")
            ->assertOk()
            ->assertJsonPath('data.status.value', 'suspended');
    }

    public function test_deactivate_rejects_non_active(): void
    {
        $partner = $this->makePartner('vendor-pending2', PartnerStatus::Pending);

        $this->acting()->postJson("{$this->base}/{$partner->id}/deactivate")
            ->assertStatus(422)
            ->assertJsonPath('error_code', 'INVALID_PARTNER_TRANSITION');
    }

    public function test_reactivate_moves_suspended_to_active(): void
    {
        $partner = $this->makePartner('vendor-off', PartnerStatus::Suspended);

        $this->acting()->postJson("{$this->base}/{$partner->id}/reactivate")
            ->assertOk()
            ->assertJsonPath('data.status.value', 'active');
    }

    public function test_reactivate_rejects_non_suspended(): void
    {
        $partner = $this->makePartner('vendor-active2', PartnerStatus::Active);

        $this->acting()->postJson("{$this->base}/{$partner->id}/reactivate")
            ->assertStatus(422)
            ->assertJsonPath('error_code', 'INVALID_PARTNER_TRANSITION');
    }

    public function test_approve_requires_platform_auth(): void
    {
        $partner = $this->makePartner('vendor-guard', PartnerStatus::Pending);

        $this->postJson("{$this->base}/{$partner->id}/approve")->assertUnauthorized();
    }

    // ───────────────────────── STATS ─────────────────────────

    public function test_stats_returns_status_breakdown(): void
    {
        $this->makePartner('a1', PartnerStatus::Active);
        $this->makePartner('a2', PartnerStatus::Active);
        $this->makePartner('p1', PartnerStatus::Pending);
        $this->makePartner('s1', PartnerStatus::Suspended);
        $this->makePartner('t1', PartnerStatus::Terminated);

        $this->acting()->getJson("{$this->base}/stats")
            ->assertOk()
            ->assertJsonPath('data.total', 5)
            ->assertJsonPath('data.active', 2)
            ->assertJsonPath('data.pending', 1)
            ->assertJsonPath('data.inactive', 1);
    }

    public function test_stats_requires_platform_auth(): void
    {
        $this->getJson("{$this->base}/stats")->assertUnauthorized();
    }

    // ───────────────────────── LIST ?include=stats ─────────────────────────

    public function test_list_include_stats_decorates_rows(): void
    {
        $partner = $this->makePartner('vendor-stats', PartnerStatus::Active);
        $this->link($partner, 'pmc-a', 1);
        $this->link($partner, 'pmc-a', 2);

        $response = $this->acting()->getJson("{$this->base}?include=stats")
            ->assertOk()
            ->assertJsonPath('data.0.project_count', 2)
            ->assertJsonPath('data.0.offer_count', 0)
            ->assertJsonPath('data.0.order_count', 0)
            ->assertJsonPath('data.0.rating', null);

        $this->assertNull($response->json('data.0.owner_tenant'));
    }

    public function test_list_without_include_omits_stats(): void
    {
        $this->makePartner('vendor-plain', PartnerStatus::Active);

        $this->acting()->getJson($this->base)
            ->assertOk()
            ->assertJsonMissingPath('data.0.project_count');
    }

    // ───────────────────────── OFFERS (cross-DB, degrade) ─────────────────────────

    public function test_offers_empty_when_not_provisioned(): void
    {
        $partner = $this->makePartner('vendor-noshop', PartnerStatus::Active);

        $this->acting()->getJson("{$this->base}/{$partner->id}/offers")
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(0, 'data')
            ->assertJsonPath('meta.total', 0)
            ->assertJsonPath('warnings.schema_missing', false);
    }

    public function test_offers_returns_404_for_unknown_partner(): void
    {
        $this->acting()->getJson("{$this->base}/999999/offers")
            ->assertNotFound()
            ->assertJsonPath('error_code', 'VENDOR_NOT_FOUND');
    }

    public function test_offers_requires_platform_auth(): void
    {
        $partner = $this->makePartner('vendor-offers-guard', PartnerStatus::Active);

        $this->getJson("{$this->base}/{$partner->id}/offers")->assertUnauthorized();
    }

    public function test_offers_rejects_invalid_type_filter(): void
    {
        $partner = $this->makePartner('vendor-offers-validate', PartnerStatus::Active);

        $this->acting()->getJson("{$this->base}/{$partner->id}/offers?type=bogus")
            ->assertStatus(422);
    }

    // ───────────────────────── RATINGS (cross-DB, degrade) ─────────────────────────

    public function test_ratings_empty_when_not_provisioned(): void
    {
        $partner = $this->makePartner('vendor-rate', PartnerStatus::Active);

        $this->acting()->getJson("{$this->base}/{$partner->id}/ratings")
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(0, 'data')
            ->assertJsonPath('summary.count', 0)
            ->assertJsonPath('summary.average', null)
            ->assertJsonPath('warnings.schema_missing', false);
    }

    public function test_ratings_returns_404_for_unknown_partner(): void
    {
        $this->acting()->getJson("{$this->base}/999999/ratings")
            ->assertNotFound()
            ->assertJsonPath('error_code', 'VENDOR_NOT_FOUND');
    }

    public function test_ratings_requires_platform_auth(): void
    {
        $partner = $this->makePartner('vendor-rate-guard', PartnerStatus::Active);

        $this->getJson("{$this->base}/{$partner->id}/ratings")->assertUnauthorized();
    }

    // ───────────────────────── REVENUE TREND ─────────────────────────

    public function test_revenue_trend_returns_month_skeleton_when_not_provisioned(): void
    {
        $partner = $this->makePartner('vendor-trend', PartnerStatus::Active);

        $this->acting()->getJson("{$this->base}/{$partner->id}/revenue-trend?months=6")
            ->assertOk()
            ->assertJsonCount(6, 'data.months')
            ->assertJsonPath('data.months.0.revenue', 0)
            ->assertJsonPath('data.months.0.order_count', 0)
            ->assertJsonPath('data.warnings.schema_missing', false);
    }

    public function test_revenue_trend_rejects_too_many_months(): void
    {
        $partner = $this->makePartner('vendor-trend2', PartnerStatus::Active);

        $this->acting()->getJson("{$this->base}/{$partner->id}/revenue-trend?months=24")
            ->assertStatus(422);
    }

    // ───────────────────────── BULK DEFAULT CONTRACTS ─────────────────────────

    public function test_bulk_fans_out_one_draft_per_linked_scope(): void
    {
        $partner = $this->makePartner('vendor-bulk', PartnerStatus::Active);
        $this->link($partner, 'pmc-a', 1);
        $this->link($partner, 'pmc-a', 2);

        $this->acting()->postJson("{$this->base}/{$partner->id}/commission-contracts/bulk", [
            'commission_mode' => 'per_order',
            'revenue_recipient' => 'operating_company',
            'terms' => ['percent' => 5],
            'starts_at' => now()->toDateString(),
        ])
            ->assertCreated()
            ->assertJsonPath('data.created_count', 2)
            ->assertJsonPath('data.skipped_count', 0);

        $this->assertSame(2, PartnerCommissionContract::query()
            ->where('partner_id', $partner->id)
            ->where('status', 'draft')
            ->where('revenue_recipient', RevenueRecipient::OperatingCompany->value)
            ->count());
    }

    public function test_bulk_skips_scopes_with_existing_active_contract(): void
    {
        $partner = $this->makePartner('vendor-bulk2', PartnerStatus::Active);
        $this->link($partner, 'pmc-a', 1);
        $this->link($partner, 'pmc-a', 2);

        PartnerCommissionContract::factory()->active()->create([
            'partner_id' => $partner->id,
            'tenant_id' => 'pmc-a',
            'project_id' => 1,
        ]);

        $this->acting()->postJson("{$this->base}/{$partner->id}/commission-contracts/bulk", [
            'commission_mode' => 'per_order',
            'terms' => ['percent' => 5],
            'starts_at' => now()->toDateString(),
        ])
            ->assertCreated()
            ->assertJsonPath('data.created_count', 1)
            ->assertJsonPath('data.skipped_count', 1);
    }

    public function test_bulk_overrides_when_skip_existing_false(): void
    {
        $partner = $this->makePartner('vendor-bulk3', PartnerStatus::Active);
        $this->link($partner, 'pmc-a', 1);
        $this->link($partner, 'pmc-a', 2);

        PartnerCommissionContract::factory()->active()->create([
            'partner_id' => $partner->id,
            'tenant_id' => 'pmc-a',
            'project_id' => 1,
        ]);

        $this->acting()->postJson("{$this->base}/{$partner->id}/commission-contracts/bulk", [
            'commission_mode' => 'per_order',
            'terms' => ['percent' => 5],
            'starts_at' => now()->toDateString(),
            'skip_existing' => false,
        ])
            ->assertCreated()
            ->assertJsonPath('data.created_count', 2);
    }

    public function test_bulk_validates_terms(): void
    {
        $partner = $this->makePartner('vendor-bulk4', PartnerStatus::Active);
        $this->link($partner, 'pmc-a', 1);

        $this->acting()->postJson("{$this->base}/{$partner->id}/commission-contracts/bulk", [
            'commission_mode' => 'per_order',
            'terms' => [],
            'starts_at' => now()->toDateString(),
        ])->assertStatus(422);
    }

    // ───────────────────────── REVENUE RECIPIENT ─────────────────────────

    public function test_contract_detail_exposes_revenue_recipient(): void
    {
        $partner = $this->makePartner('vendor-recip', PartnerStatus::Active);

        $contract = PartnerCommissionContract::factory()->active()->toOperatingCompany()->create([
            'partner_id' => $partner->id,
            'tenant_id' => 'pmc-a',
            'project_id' => 1,
        ]);

        $this->acting()->getJson("/api/v1/platform/partner-commission-contracts/{$contract->id}")
            ->assertOk()
            ->assertJsonPath('data.revenue_recipient.value', 'operating_company')
            ->assertJsonPath('data.revenue_recipient.label', 'Công ty vận hành');
    }

    // ───────────────────────── DETAIL projects[] ─────────────────────────

    public function test_detail_lists_projects_with_commission(): void
    {
        $partner = $this->makePartner('vendor-detail', PartnerStatus::Active);
        $this->link($partner, 'pmc-a', 1);

        PartnerCommissionContract::factory()->active()->toOperatingCompany()->create([
            'partner_id' => $partner->id,
            'tenant_id' => 'pmc-a',
            'project_id' => 1,
            'terms' => ['percent' => 7],
        ]);

        $this->acting()->getJson("{$this->base}/{$partner->id}")
            ->assertOk()
            ->assertJsonCount(1, 'data.projects')
            ->assertJsonPath('data.projects.0.project_id', 1)
            ->assertJsonPath('data.projects.0.is_vendor_enabled', true)
            ->assertJsonPath('data.projects.0.commission.revenue_recipient.value', 'operating_company')
            ->assertJsonPath('data.projects.0.commission.is_override', true);
    }
}
