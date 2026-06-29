<?php

namespace Tests\Modules\Marketplace;

use App\Modules\Marketplace\Partner\Enums\PartnerStatus;
use App\Modules\Marketplace\Partner\Models\Partner;
use App\Modules\Platform\Auth\Models\RequesterAccount;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlatformVendorOrderTest extends TestCase
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

    public function test_returns_404_for_unknown_partner(): void
    {
        $this->actingAs($this->requester, 'requester')
            ->getJson('/api/v1/platform/partners/999999/orders')
            ->assertNotFound()
            ->assertJsonPath('error_code', 'VENDOR_NOT_FOUND');
    }

    public function test_list_is_empty_when_partner_not_provisioned(): void
    {
        $partner = Partner::create([
            'slug' => 'vendor-abc',
            'tenant_id' => null,
            'owner_tenant_id' => null,
            'name' => 'Vendor ABC',
            'owner_email' => 'vendor@abc.vn',
            'status' => PartnerStatus::Active->value,
        ]);

        $this->actingAs($this->requester, 'requester')
            ->getJson("/api/v1/platform/partners/{$partner->id}/orders")
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('meta.total', 0)
            ->assertJsonCount(0, 'data');
    }

    public function test_summary_is_zeroed_when_partner_not_provisioned(): void
    {
        $partner = Partner::create([
            'slug' => 'vendor-xyz',
            'tenant_id' => null,
            'owner_tenant_id' => null,
            'name' => 'Vendor XYZ',
            'owner_email' => 'vendor@xyz.vn',
            'status' => PartnerStatus::Active->value,
        ]);

        $this->actingAs($this->requester, 'requester')
            ->getJson("/api/v1/platform/partners/{$partner->id}/orders/summary")
            ->assertOk()
            ->assertJsonPath('data.orders_count', 0)
            ->assertJsonPath('data.revenue_total', 0)
            ->assertJsonPath('data.commission_total', 0);
    }

    public function test_requires_platform_auth(): void
    {
        $partner = Partner::create([
            'slug' => 'vendor-guest',
            'tenant_id' => null,
            'owner_tenant_id' => null,
            'name' => 'Vendor Guest',
            'owner_email' => 'vendor@guest.vn',
            'status' => PartnerStatus::Active->value,
        ]);

        $this->getJson("/api/v1/platform/partners/{$partner->id}/orders")
            ->assertUnauthorized();
    }

    // -------------------------------------------------------------------------
    // Console gộp "Đơn hàng vendor" — cross-vendor + cross-tenant (read-only)
    // -------------------------------------------------------------------------

    public function test_console_list_requires_platform_auth(): void
    {
        $this->getJson('/api/v1/platform/vendor-orders')->assertUnauthorized();
    }

    public function test_console_summary_requires_platform_auth(): void
    {
        $this->getJson('/api/v1/platform/vendor-orders/summary')->assertUnauthorized();
    }

    public function test_console_list_is_empty_when_no_provisioned_vendors(): void
    {
        // Partner not provisioned (tenant_id = null) → excluded from the loop,
        // so no resi_mart schema lookup is attempted.
        Partner::create([
            'slug' => 'vendor-unprov',
            'tenant_id' => null,
            'owner_tenant_id' => null,
            'name' => 'Vendor Unprovisioned',
            'owner_email' => 'vendor@unprov.vn',
            'status' => PartnerStatus::Active->value,
        ]);

        $this->actingAs($this->requester, 'requester')
            ->getJson('/api/v1/platform/vendor-orders')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('meta.total', 0)
            ->assertJsonPath('warnings.schema_missing', false)
            ->assertJsonCount(0, 'data');
    }

    public function test_console_summary_is_zeroed_when_no_provisioned_vendors(): void
    {
        $this->actingAs($this->requester, 'requester')
            ->getJson('/api/v1/platform/vendor-orders/summary')
            ->assertOk()
            ->assertJsonPath('data.orders_count', 0)
            ->assertJsonPath('data.product_count', 0)
            ->assertJsonPath('data.service_count', 0)
            ->assertJsonPath('data.gmv', 0)
            ->assertJsonPath('data.commission_total', 0)
            ->assertJsonPath('data.vendors_count', 0)
            ->assertJsonPath('data.currency', 'VND');
    }

    public function test_console_list_rejects_invalid_type(): void
    {
        $this->actingAs($this->requester, 'requester')
            ->getJson('/api/v1/platform/vendor-orders?type=bogus')
            ->assertStatus(422)
            ->assertJsonValidationErrors(['type']);
    }

    public function test_console_list_rejects_invalid_status(): void
    {
        $this->actingAs($this->requester, 'requester')
            ->getJson('/api/v1/platform/vendor-orders?status=shipping')
            ->assertStatus(422)
            ->assertJsonValidationErrors(['status']);
    }

    public function test_console_list_rejects_per_page_over_max(): void
    {
        $this->actingAs($this->requester, 'requester')
            ->getJson('/api/v1/platform/vendor-orders?per_page=100')
            ->assertStatus(422)
            ->assertJsonValidationErrors(['per_page']);
    }

    public function test_console_list_rejects_end_date_before_start(): void
    {
        $this->actingAs($this->requester, 'requester')
            ->getJson('/api/v1/platform/vendor-orders?from=2026-06-10&to=2026-06-01')
            ->assertStatus(422)
            ->assertJsonValidationErrors(['to']);
    }

    public function test_console_list_rejects_unknown_partner(): void
    {
        $this->actingAs($this->requester, 'requester')
            ->getJson('/api/v1/platform/vendor-orders?partner_id=999999')
            ->assertStatus(422)
            ->assertJsonValidationErrors(['partner_id']);
    }
}
