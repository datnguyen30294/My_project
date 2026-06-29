<?php

namespace Tests\Modules\Marketplace;

use App\Modules\Marketplace\Partner\Enums\PartnerStatus;
use App\Modules\Marketplace\Partner\Models\Partner;
use App\Modules\Marketplace\PartnerProject\Models\PartnerProject;
use App\Modules\Platform\Auth\Models\RequesterAccount;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlatformProjectVendorTest extends TestCase
{
    use RefreshDatabase;

    private RequesterAccount $requester;

    private string $tenantId = 'pmc-abc';

    private int $projectId = 501;

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

    private function url(): string
    {
        return "/api/v1/platform/tenants/{$this->tenantId}/projects/{$this->projectId}/vendors";
    }

    private function makePartner(string $slug, ?string $tenantId = null, PartnerStatus $status = PartnerStatus::Active): Partner
    {
        return Partner::create([
            'slug' => $slug,
            'tenant_id' => $tenantId,
            'owner_tenant_id' => null,
            'name' => ucfirst($slug),
            'owner_email' => $slug.'@example.com',
            'status' => $status->value,
        ]);
    }

    private function link(Partner $partner, bool $enabled = true): PartnerProject
    {
        return PartnerProject::create([
            'partner_id' => $partner->id,
            'tenant_id' => $this->tenantId,
            'project_id' => $this->projectId,
            'is_vendor_enabled' => $enabled,
            'registered_at' => now(),
        ]);
    }

    public function test_requires_platform_auth(): void
    {
        $this->getJson($this->url())->assertUnauthorized();
    }

    public function test_lists_vendors_on_project_with_enabled_flag_and_stats(): void
    {
        $a = $this->makePartner('vendor-a');
        $b = $this->makePartner('vendor-b');
        $this->link($a, enabled: true);
        $this->link($b, enabled: false);

        // Vendor gắn dự án KHÁC — không được lọt vào danh sách.
        $other = $this->makePartner('vendor-other');
        PartnerProject::create([
            'partner_id' => $other->id,
            'tenant_id' => $this->tenantId,
            'project_id' => 999,
            'registered_at' => now(),
        ]);

        $response = $this->actingAs($this->requester, 'requester')->getJson($this->url());

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('stats.total', 2)
            ->assertJsonPath('stats.enabled_count', 1)
            ->assertJsonPath('warnings.schema_missing', false);

        $rows = collect($response->json('data'))->keyBy('code');
        $this->assertTrue($rows->has('vendor-a'));
        $this->assertTrue($rows->has('vendor-b'));
        $this->assertFalse($rows->has('vendor-other'));
        $this->assertTrue($rows['vendor-a']['enabled']);
        $this->assertFalse($rows['vendor-b']['enabled']);
        $this->assertSame(0, $rows['vendor-a']['offer_count']);
        $this->assertSame(0, $rows['vendor-a']['order_count']);
        $this->assertSame('active', $rows['vendor-a']['status']['value']);
    }

    public function test_lists_empty_when_no_vendor_on_project(): void
    {
        $this->actingAs($this->requester, 'requester')->getJson($this->url())
            ->assertOk()
            ->assertJsonCount(0, 'data')
            ->assertJsonPath('stats.total', 0)
            ->assertJsonPath('stats.enabled_count', 0);
    }

    public function test_provisioned_vendor_unreachable_degrades_to_zero_counts(): void
    {
        // tenant_id set → service cố đọc cross-DB; resi_mart không tới được trong
        // harness → phải suy biến: 200, count 0, schema_missing = true (không 500).
        $vendor = $this->makePartner('vendor-provisioned', tenantId: 'vendor-slug');
        $this->link($vendor, enabled: true);

        $this->actingAs($this->requester, 'requester')->getJson($this->url())
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.offer_count', 0)
            ->assertJsonPath('data.0.order_count', 0)
            ->assertJsonPath('warnings.schema_missing', true);
    }

    public function test_toggle_flips_enabled_flag(): void
    {
        $vendor = $this->makePartner('vendor-toggle');
        $this->link($vendor, enabled: true);

        $this->actingAs($this->requester, 'requester')
            ->putJson($this->url()."/{$vendor->id}/toggle", ['enabled' => false])
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.enabled', false);

        $this->assertDatabaseHas('partner_project', [
            'partner_id' => $vendor->id,
            'tenant_id' => $this->tenantId,
            'project_id' => $this->projectId,
            'is_vendor_enabled' => false,
        ]);
    }

    public function test_toggle_returns_404_when_vendor_not_on_project(): void
    {
        $vendor = $this->makePartner('vendor-unlinked');

        $this->actingAs($this->requester, 'requester')
            ->putJson($this->url()."/{$vendor->id}/toggle", ['enabled' => false])
            ->assertNotFound()
            ->assertJsonPath('error_code', 'VENDOR_NOT_ON_PROJECT');
    }

    public function test_toggle_validation_requires_enabled(): void
    {
        $vendor = $this->makePartner('vendor-validate');
        $this->link($vendor);

        $this->actingAs($this->requester, 'requester')
            ->putJson($this->url()."/{$vendor->id}/toggle", [])
            ->assertStatus(422);
    }

    public function test_toggle_requires_platform_auth(): void
    {
        $vendor = $this->makePartner('vendor-guard');
        $this->link($vendor);

        $this->putJson($this->url()."/{$vendor->id}/toggle", ['enabled' => false])
            ->assertUnauthorized();
    }
}
