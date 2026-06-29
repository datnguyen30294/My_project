<?php

namespace Tests\Modules\Platform;

use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\Platform\Tenant\Models\TenantConfig;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TenantModuleEnforcementTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        if (function_exists('tenancy') && tenancy()->initialized) {
            tenancy()->end();
        }

        parent::tearDown();
    }

    private function initializeTenantWithConfig(array $configOverrides = []): Organization
    {
        $tenant = Organization::withoutEvents(
            fn () => Organization::factory()->create()
        );

        TenantConfig::factory()->create(array_merge(
            ['tenant_id' => $tenant->id],
            $configOverrides,
        ));

        tenancy()->initialize($tenant);

        return $tenant;
    }

    // ========== MODULE GATING ==========

    public function test_disabled_module_routes_are_blocked(): void
    {
        $this->initializeTenantWithConfig(['enabled_modules' => ['hrm']]);
        $this->actingAsAdmin();

        $this->getJson('/api/v1/pmc/og-tickets')
            ->assertStatus(403)
            ->assertJsonPath('error_code', 'MODULE_DISABLED');

        $this->getJson('/api/v1/pmc/quotes')
            ->assertStatus(403)
            ->assertJsonPath('error_code', 'MODULE_DISABLED');
    }

    public function test_enabled_module_routes_pass(): void
    {
        $this->initializeTenantWithConfig(['enabled_modules' => ['hrm']]);
        $this->actingAsAdmin();

        $this->getJson('/api/v1/pmc/departments')->assertOk();
        $this->getJson('/api/v1/pmc/accounts')->assertOk();
    }

    public function test_unmapped_routes_always_pass(): void
    {
        $this->initializeTenantWithConfig(['enabled_modules' => ['hrm']]);
        $this->actingAsAdmin();

        $this->getJson('/api/v1/pmc/customers')->assertOk();
    }

    public function test_null_enabled_modules_means_all_enabled(): void
    {
        $this->initializeTenantWithConfig(['enabled_modules' => null]);
        $this->actingAsAdmin();

        $this->getJson('/api/v1/pmc/og-tickets')->assertOk();
        $this->getJson('/api/v1/pmc/quotes')->assertOk();
    }

    public function test_me_returns_enabled_modules(): void
    {
        $this->initializeTenantWithConfig(['enabled_modules' => ['hrm', 'bao-cao']]);
        $this->actingAsAdmin();

        $this->getJson('/api/v1/auth/me')
            ->assertOk()
            ->assertJsonPath('data.tenant.enabled_modules', ['hrm', 'bao-cao']);
    }

    public function test_me_returns_all_modules_when_unconfigured(): void
    {
        $tenant = Organization::withoutEvents(
            fn () => Organization::factory()->create()
        );
        tenancy()->initialize($tenant);

        $this->actingAsAdmin();

        $response = $this->getJson('/api/v1/auth/me')->assertOk();

        $this->assertContains('hrm', $response->json('data.tenant.enabled_modules'));
        $this->assertCount(8, $response->json('data.tenant.enabled_modules'));
    }

    // ========== PORTAL FLAGS ==========

    public function test_resident_portal_disabled_blocks_public_services(): void
    {
        $this->initializeTenantWithConfig(['resident_portal_enabled' => false]);

        $this->getJson('/api/v1/public/services')
            ->assertStatus(403)
            ->assertJsonPath('error_code', 'PORTAL_DISABLED');
    }

    public function test_resident_portal_enabled_allows_public_services(): void
    {
        $this->initializeTenantWithConfig(['resident_portal_enabled' => true]);

        $this->getJson('/api/v1/public/services')->assertOk();
    }

    public function test_resident_portal_disabled_keeps_acceptance_report_open(): void
    {
        $this->initializeTenantWithConfig(['resident_portal_enabled' => false]);

        // Token không tồn tại → 404 (đã qua middleware portal, không bị 403)
        $this->getJson('/api/v1/public/acceptance-reports/khong-ton-tai')
            ->assertStatus(404);
    }
}
