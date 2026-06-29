<?php

namespace Tests\Modules\Platform;

use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\PMC\Account\Models\Account;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TenantActiveEnforcementTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        if (function_exists('tenancy') && tenancy()->initialized) {
            tenancy()->end();
        }

        parent::tearDown();
    }

    private function initializeTenant(bool $isActive): Organization
    {
        $tenant = Organization::withoutEvents(
            fn () => Organization::factory()->create(['is_active' => $isActive])
        );

        tenancy()->initialize($tenant);

        return $tenant;
    }

    public function test_disabled_tenant_cannot_login(): void
    {
        $this->initializeTenant(isActive: false);

        Account::factory()->create([
            'email' => 'user@test.com',
            'password' => 'password123',
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'user@test.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(403)
            ->assertJsonPath('success', false)
            ->assertJsonPath('error_code', 'TENANT_DISABLED');
    }

    public function test_disabled_tenant_blocks_authenticated_api(): void
    {
        $this->initializeTenant(isActive: false);

        Sanctum::actingAs(Account::factory()->create());

        $this->getJson('/api/v1/pmc/departments')
            ->assertStatus(403)
            ->assertJsonPath('error_code', 'TENANT_DISABLED');
    }

    public function test_active_tenant_can_login(): void
    {
        $this->initializeTenant(isActive: true);

        Account::factory()->create([
            'email' => 'user@test.com',
            'password' => 'password123',
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'user@test.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }
}
