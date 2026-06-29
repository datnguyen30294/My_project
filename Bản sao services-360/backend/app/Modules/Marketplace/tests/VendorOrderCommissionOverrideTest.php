<?php

namespace Tests\Modules\Marketplace;

use App\Modules\Marketplace\Partner\Enums\PartnerStatus;
use App\Modules\Marketplace\Partner\Models\Partner;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\RevenueRecipient;
use App\Modules\Marketplace\VendorOrder\Models\VendorOrderCommissionOverride;
use App\Modules\Marketplace\VendorOrder\Repositories\VendorOrderCommissionOverrideRepository;
use App\Modules\Platform\Auth\Models\RequesterAccount;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VendorOrderCommissionOverrideTest extends TestCase
{
    use RefreshDatabase;

    private RequesterAccount $requester;

    private VendorOrderCommissionOverrideRepository $repo;

    protected function setUp(): void
    {
        parent::setUp();

        $this->requester = RequesterAccount::create([
            'name' => 'Platform Admin',
            'email' => 'admin@test.com',
            'password' => 'password',
            'is_active' => true,
        ]);

        $this->repo = app(VendorOrderCommissionOverrideRepository::class);
    }

    private function makePartner(?string $tenantId = null): Partner
    {
        return Partner::create([
            'slug' => 'vendor-'.uniqid(),
            'tenant_id' => $tenantId,
            'owner_tenant_id' => null,
            'name' => 'Vendor',
            'owner_email' => 'v@example.com',
            'status' => PartnerStatus::Active->value,
        ]);
    }

    // ── Repository ─────────────────────────────────────────────────

    public function test_upsert_creates_then_updates_without_duplicate(): void
    {
        $partner = $this->makePartner();

        $this->repo->upsertForOrder($partner->id, 1024, [
            'tenant_id' => 'tnp',
            'project_id' => 7,
            'revenue_recipient' => RevenueRecipient::Platform->value,
            'terms' => ['fixed' => 0, 'percent' => 10],
            'source_contract_id' => null,
        ]);

        $this->repo->upsertForOrder($partner->id, 1024, [
            'tenant_id' => 'tnp',
            'project_id' => 7,
            'revenue_recipient' => RevenueRecipient::OperatingCompany->value,
            'terms' => ['fixed' => 50_000, 'percent' => 5],
            'source_contract_id' => null,
        ]);

        $this->assertSame(1, VendorOrderCommissionOverride::query()
            ->where('partner_id', $partner->id)->where('vendor_order_id', 1024)->count());

        $found = $this->repo->findForOrder($partner->id, 1024);
        $this->assertSame(RevenueRecipient::OperatingCompany, $found->revenue_recipient);
        $this->assertSame(50_000, (int) $found->terms['fixed']);
    }

    public function test_map_by_partner_keyed_by_vendor_order_id(): void
    {
        $partner = $this->makePartner();
        VendorOrderCommissionOverride::factory()->create(['partner_id' => $partner->id, 'vendor_order_id' => 11]);
        VendorOrderCommissionOverride::factory()->create(['partner_id' => $partner->id, 'vendor_order_id' => 22]);

        $map = $this->repo->mapByPartner($partner->id);

        $this->assertCount(2, $map);
        $this->assertNotNull($map->get(11));
        $this->assertNotNull($map->get(22));
        $this->assertNull($map->get(99));
    }

    public function test_delete_for_order_soft_deletes(): void
    {
        $partner = $this->makePartner();
        $override = VendorOrderCommissionOverride::factory()->create(['partner_id' => $partner->id, 'vendor_order_id' => 5]);

        $this->assertTrue($this->repo->deleteForOrder($partner->id, 5));
        $this->assertSoftDeleted('vendor_order_commission_overrides', ['id' => $override->id]);
        $this->assertFalse($this->repo->deleteForOrder($partner->id, 5));
    }

    // ── Assign endpoint ────────────────────────────────────────────

    private function assignUrl(int|string $partnerId, int|string $orderId): string
    {
        return "/api/v1/platform/partners/{$partnerId}/orders/{$orderId}/commission-override";
    }

    public function test_assign_requires_platform_auth(): void
    {
        $this->putJson($this->assignUrl(1, 1), ['source' => 'manual', 'fixed' => 0, 'percent' => 10, 'revenue_recipient' => 'platform'])
            ->assertUnauthorized();
    }

    public function test_assign_validates_source(): void
    {
        $this->actingAs($this->requester, 'requester')
            ->putJson($this->assignUrl(1, 1), [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['source']);
    }

    public function test_assign_validates_manual_fields(): void
    {
        $this->actingAs($this->requester, 'requester')
            ->putJson($this->assignUrl(1, 1), ['source' => 'manual'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['fixed', 'percent', 'revenue_recipient']);
    }

    public function test_assign_rejects_percent_over_100(): void
    {
        $this->actingAs($this->requester, 'requester')
            ->putJson($this->assignUrl(1, 1), ['source' => 'manual', 'fixed' => 0, 'percent' => 150, 'revenue_recipient' => 'platform'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['percent']);
    }

    public function test_assign_fails_when_vendor_schema_missing(): void
    {
        // Partner not provisioned (tenant_id null) → service can't read the order.
        $partner = $this->makePartner(tenantId: null);

        $this->actingAs($this->requester, 'requester')
            ->putJson($this->assignUrl($partner->id, 1), ['source' => 'manual', 'fixed' => 0, 'percent' => 10, 'revenue_recipient' => 'platform'])
            ->assertStatus(422)
            ->assertJsonPath('error_code', 'VENDOR_SCHEMA_MISSING');
    }

    // ── Remove endpoint ────────────────────────────────────────────

    public function test_remove_requires_platform_auth(): void
    {
        $this->deleteJson($this->assignUrl(1, 1))->assertUnauthorized();
    }

    public function test_remove_returns_404_when_no_override(): void
    {
        $partner = $this->makePartner();

        $this->actingAs($this->requester, 'requester')
            ->deleteJson($this->assignUrl($partner->id, 999))
            ->assertNotFound()
            ->assertJsonPath('error_code', 'COMMISSION_OVERRIDE_NOT_FOUND');
    }

    public function test_remove_soft_deletes_existing_override(): void
    {
        $partner = $this->makePartner();
        $override = VendorOrderCommissionOverride::factory()->create([
            'partner_id' => $partner->id,
            'vendor_order_id' => 42,
        ]);

        $this->actingAs($this->requester, 'requester')
            ->deleteJson($this->assignUrl($partner->id, 42))
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertSoftDeleted('vendor_order_commission_overrides', ['id' => $override->id]);
    }
}
