<?php

namespace Tests\Modules\Platform;

use App\Modules\Platform\Auth\Models\RequesterAccount;
use App\Modules\Platform\Tenant\Models\Organization;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ToggleVendorFeatureTest extends TestCase
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

    public function test_platform_admin_can_enable_vendor_feature(): void
    {
        $tenant = Organization::withoutEvents(fn () => Organization::factory()->create([
            'id' => 'pmc-xyz',
            'is_vendor_enabled' => false,
        ]));

        $response = $this->actingAs($this->requester, 'requester')
            ->putJson("/api/v1/platform/tenants/{$tenant->id}/vendor-feature", [
                'is_vendor_enabled' => true,
            ]);

        $response->assertOk()
            ->assertJsonPath('data.id', 'pmc-xyz')
            ->assertJsonPath('data.is_vendor_enabled', true);

        $this->assertDatabaseHas('tenants', [
            'id' => 'pmc-xyz',
            'is_vendor_enabled' => true,
        ]);
    }

    public function test_platform_admin_can_disable_vendor_feature(): void
    {
        $tenant = Organization::withoutEvents(fn () => Organization::factory()->create([
            'id' => 'pmc-xyz',
            'is_vendor_enabled' => true,
        ]));

        $response = $this->actingAs($this->requester, 'requester')
            ->putJson("/api/v1/platform/tenants/{$tenant->id}/vendor-feature", [
                'is_vendor_enabled' => false,
            ]);

        $response->assertOk()
            ->assertJsonPath('data.is_vendor_enabled', false);
    }

    public function test_requires_requester_authentication(): void
    {
        $tenant = Organization::withoutEvents(fn () => Organization::factory()->create([
            'id' => 'pmc-xyz',
        ]));

        $response = $this->putJson("/api/v1/platform/tenants/{$tenant->id}/vendor-feature", [
            'is_vendor_enabled' => true,
        ]);

        $response->assertStatus(401);
    }

    public function test_validates_required_flag(): void
    {
        $tenant = Organization::withoutEvents(fn () => Organization::factory()->create([
            'id' => 'pmc-xyz',
        ]));

        $response = $this->actingAs($this->requester, 'requester')
            ->putJson("/api/v1/platform/tenants/{$tenant->id}/vendor-feature", []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['is_vendor_enabled']);
    }
}
