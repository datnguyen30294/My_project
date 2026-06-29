<?php

namespace Tests\Modules\Platform;

use App\Modules\Platform\Auth\Models\RequesterAccount;
use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\Platform\Tenant\Models\TenantConfig;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Stancl\Tenancy\Events\TenantCreated;
use Stancl\Tenancy\Events\TenantDeleted;
use Tests\TestCase;

class TenantManagementTest extends TestCase
{
    use RefreshDatabase;

    private RequesterAccount $requester;

    private string $baseUrl = '/api/v1/platform/tenants';

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

    private function actingAsRequester(): static
    {
        return $this->actingAs($this->requester, 'requester');
    }

    private function createTenant(array $attributes = []): Organization
    {
        return Organization::withoutEvents(fn () => Organization::factory()->create($attributes));
    }

    // ========== STATS ==========

    public function test_stats_returns_total_active_inactive(): void
    {
        $this->createTenant(['id' => 'vh-a']);
        $this->createTenant(['id' => 'vh-b']);
        $this->createTenant(['id' => 'vh-c', 'is_active' => false]);

        $deleted = $this->createTenant(['id' => 'vh-d', 'is_active' => false]);
        Organization::withoutEvents(fn () => $deleted->delete());

        $response = $this->actingAsRequester()->getJson("{$this->baseUrl}/stats");

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.total', 3)
            ->assertJsonPath('data.active', 2)
            ->assertJsonPath('data.inactive', 1);
    }

    public function test_stats_requires_authentication(): void
    {
        $this->getJson("{$this->baseUrl}/stats")->assertStatus(401);
    }

    // ========== LIST ==========

    public function test_list_filters_by_service_plan(): void
    {
        $this->createTenant(['id' => 'vh-starter', 'service_plan' => 'starter']);
        $this->createTenant(['id' => 'vh-business', 'service_plan' => 'business']);

        $response = $this->actingAsRequester()->getJson("{$this->baseUrl}?service_plan=starter");

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', 'vh-starter')
            ->assertJsonPath('data.0.service_plan.value', 'starter');
    }

    public function test_list_searches_by_tax_code(): void
    {
        $this->createTenant(['id' => 'vh-alpha', 'tax_code' => '0312345678']);
        $this->createTenant(['id' => 'vh-beta', 'tax_code' => '0399999999']);

        $response = $this->actingAsRequester()->getJson("{$this->baseUrl}?search=0312345678");

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', 'vh-alpha');
    }

    public function test_list_rejects_invalid_service_plan(): void
    {
        $this->actingAsRequester()
            ->getJson("{$this->baseUrl}?service_plan=premium")
            ->assertStatus(422)
            ->assertJsonValidationErrors(['service_plan']);
    }

    // ========== SHOW ==========

    public function test_show_returns_profile_schema_name_and_lazy_creates_config(): void
    {
        $this->createTenant([
            'id' => 'vh-alpha',
            'tax_code' => '0312345678',
            'representative_name' => 'Nguyễn Văn A',
            'contact_email' => 'contact@alpha.vn',
        ]);

        $this->assertDatabaseMissing('tenant_configs', ['tenant_id' => 'vh-alpha']);

        $response = $this->actingAsRequester()->getJson("{$this->baseUrl}/vh-alpha");

        $response->assertOk()
            ->assertJsonPath('data.tax_code', '0312345678')
            ->assertJsonPath('data.representative_name', 'Nguyễn Văn A')
            ->assertJsonPath('data.schema_name', 'tenant_vh-alpha')
            ->assertJsonPath('data.config.max_projects', 10)
            ->assertJsonPath('data.config.max_accounts', 50)
            ->assertJsonPath('data.config.fee_mode.value', 'none')
            ->assertJsonPath('data.config.enabled_modules', null);

        $this->assertDatabaseHas('tenant_configs', ['tenant_id' => 'vh-alpha']);
    }

    public function test_show_returns_404_for_nonexistent_tenant(): void
    {
        $this->actingAsRequester()->getJson("{$this->baseUrl}/nonexistent")->assertStatus(404);
    }

    // ========== CREATE ==========

    public function test_create_tenant_with_profile_creates_default_config_and_domain(): void
    {
        Event::fake([TenantCreated::class]);

        $response = $this->actingAsRequester()->postJson($this->baseUrl, [
            'id' => 'vh-alpha',
            'name' => 'Công ty VH Alpha',
            'is_organization' => true,
            'tax_code' => '0312345678',
            'representative_name' => 'Nguyễn Văn A',
            'contact_email' => 'contact@alpha.vn',
            'contact_phone' => '0901234567',
            'address' => 'Q.1, TP.HCM',
            'service_plan' => 'enterprise',
            'notes' => 'Khách hàng lớn',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.id', 'vh-alpha')
            ->assertJsonPath('data.tax_code', '0312345678')
            ->assertJsonPath('data.service_plan.value', 'enterprise')
            ->assertJsonPath('data.config.max_projects', 10)
            ->assertJsonPath('data.config.fee_mode.value', 'none');

        $expectedDomain = 'vh-alpha.'.(config('tenancy.central_domains')[0] ?? 'localhost');
        $this->assertContains($expectedDomain, $response->json('data.domains'));

        $this->assertDatabaseHas('tenants', ['id' => 'vh-alpha', 'tax_code' => '0312345678']);
        $this->assertDatabaseHas('tenant_configs', ['tenant_id' => 'vh-alpha']);
        $this->assertDatabaseHas('domains', ['tenant_id' => 'vh-alpha', 'domain' => $expectedDomain]);
    }

    public function test_create_tenant_keeps_explicit_domains(): void
    {
        Event::fake([TenantCreated::class]);

        $response = $this->actingAsRequester()->postJson($this->baseUrl, [
            'id' => 'vh-beta',
            'name' => 'Công ty VH Beta',
            'domains' => ['beta.tnp.app.vn'],
        ]);

        $response->assertStatus(201);
        $this->assertSame(['beta.tnp.app.vn'], $response->json('data.domains'));
    }

    public function test_create_validates_tax_code_format(): void
    {
        foreach (['123', '12345678901', 'abcdefghij'] as $invalidTaxCode) {
            $this->actingAsRequester()->postJson($this->baseUrl, [
                'id' => 'vh-tax',
                'name' => 'Công ty kiểm tra MST',
                'tax_code' => $invalidTaxCode,
            ])->assertStatus(422)->assertJsonValidationErrors(['tax_code']);
        }
    }

    public function test_create_accepts_10_and_13_digit_tax_code(): void
    {
        Event::fake([TenantCreated::class]);

        $this->actingAsRequester()->postJson($this->baseUrl, [
            'id' => 'vh-mst10',
            'name' => 'Công ty MST 10',
            'tax_code' => '0312345678',
        ])->assertStatus(201);

        $this->actingAsRequester()->postJson($this->baseUrl, [
            'id' => 'vh-mst13',
            'name' => 'Công ty MST 13',
            'tax_code' => '0312345678001',
        ])->assertStatus(201);
    }

    public function test_create_validates_contact_email(): void
    {
        $this->actingAsRequester()->postJson($this->baseUrl, [
            'id' => 'vh-email',
            'name' => 'Công ty kiểm tra email',
            'contact_email' => 'not-an-email',
        ])->assertStatus(422)->assertJsonValidationErrors(['contact_email']);
    }

    // ========== UPDATE ==========

    public function test_update_tenant_profile_fields(): void
    {
        $this->createTenant(['id' => 'vh-alpha']);

        $response = $this->actingAsRequester()->putJson("{$this->baseUrl}/vh-alpha", [
            'tax_code' => '0312345678',
            'representative_name' => 'Trần Thị B',
            'service_plan' => 'starter',
            'notes' => 'Đã đổi gói',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.tax_code', '0312345678')
            ->assertJsonPath('data.representative_name', 'Trần Thị B')
            ->assertJsonPath('data.service_plan.value', 'starter');

        $this->assertDatabaseHas('tenants', ['id' => 'vh-alpha', 'service_plan' => 'starter']);
    }

    // ========== UPDATE CONFIG ==========

    public function test_update_config_subscription_mode(): void
    {
        $this->createTenant(['id' => 'vh-alpha']);

        $response = $this->actingAsRequester()->putJson("{$this->baseUrl}/vh-alpha/config", [
            'fee_mode' => 'subscription',
            'subscription_cycle' => 'yearly',
            'subscription_amount' => 24000000,
        ]);

        $response->assertOk()
            ->assertJsonPath('data.config.fee_mode.value', 'subscription')
            ->assertJsonPath('data.config.subscription_cycle.value', 'yearly');

        $this->assertDatabaseHas('tenant_configs', [
            'tenant_id' => 'vh-alpha',
            'fee_mode' => 'subscription',
            'subscription_cycle' => 'yearly',
        ]);
    }

    public function test_update_config_fixed_per_order_mode(): void
    {
        $this->createTenant(['id' => 'vh-alpha']);

        $response = $this->actingAsRequester()->putJson("{$this->baseUrl}/vh-alpha/config", [
            'fee_mode' => 'fixed_per_order',
            'fixed_fee_per_order' => 1000,
        ]);

        $response->assertOk()
            ->assertJsonPath('data.config.fee_mode.value', 'fixed_per_order')
            ->assertJsonPath('data.config.fixed_fee_per_order', '1000.00');
    }

    public function test_update_config_percent_per_order_mode(): void
    {
        $this->createTenant(['id' => 'vh-alpha']);

        $response = $this->actingAsRequester()->putJson("{$this->baseUrl}/vh-alpha/config", [
            'fee_mode' => 'percent_per_order',
            'percent_fee_per_order' => 5,
        ]);

        $response->assertOk()
            ->assertJsonPath('data.config.fee_mode.value', 'percent_per_order')
            ->assertJsonPath('data.config.percent_fee_per_order', '5.00');
    }

    public function test_update_config_both_mode_and_limits(): void
    {
        $this->createTenant(['id' => 'vh-alpha']);

        $response = $this->actingAsRequester()->putJson("{$this->baseUrl}/vh-alpha/config", [
            'fee_mode' => 'both',
            'fixed_fee_per_order' => 1000,
            'percent_fee_per_order' => 5,
            'max_projects' => 20,
            'max_accounts' => 100,
            'session_timeout_minutes' => 120,
            'resident_portal_enabled' => false,
        ]);

        $response->assertOk()
            ->assertJsonPath('data.config.fee_mode.value', 'both')
            ->assertJsonPath('data.config.max_projects', 20)
            ->assertJsonPath('data.config.max_accounts', 100)
            ->assertJsonPath('data.config.session_timeout_minutes', 120)
            ->assertJsonPath('data.config.resident_portal_enabled', false);
    }

    public function test_update_config_enabled_modules(): void
    {
        $this->createTenant(['id' => 'vh-alpha']);

        $response = $this->actingAsRequester()->putJson("{$this->baseUrl}/vh-alpha/config", [
            'enabled_modules' => ['hrm', 'quan-ly-ticket'],
        ]);

        $response->assertOk()
            ->assertJsonPath('data.config.enabled_modules', ['hrm', 'quan-ly-ticket']);
    }

    public function test_update_config_rejects_invalid_module_key(): void
    {
        $this->createTenant(['id' => 'vh-alpha']);

        $this->actingAsRequester()->putJson("{$this->baseUrl}/vh-alpha/config", [
            'enabled_modules' => ['hrm', 'unknown-module'],
        ])->assertStatus(422)->assertJsonValidationErrors(['enabled_modules.1']);
    }

    public function test_update_config_rejects_percent_over_100(): void
    {
        $this->createTenant(['id' => 'vh-alpha']);

        $this->actingAsRequester()->putJson("{$this->baseUrl}/vh-alpha/config", [
            'percent_fee_per_order' => 101,
        ])->assertStatus(422)->assertJsonValidationErrors(['percent_fee_per_order']);
    }

    public function test_update_config_rejects_invalid_limits(): void
    {
        $this->createTenant(['id' => 'vh-alpha']);

        $this->actingAsRequester()->putJson("{$this->baseUrl}/vh-alpha/config", [
            'max_projects' => 0,
            'session_timeout_minutes' => 5,
        ])->assertStatus(422)->assertJsonValidationErrors(['max_projects', 'session_timeout_minutes']);
    }

    // ========== TOGGLE ACTIVE ==========

    public function test_toggle_active_deactivates_and_reactivates_tenant(): void
    {
        $this->createTenant(['id' => 'vh-alpha', 'is_active' => true]);

        $this->actingAsRequester()->putJson("{$this->baseUrl}/vh-alpha/toggle-active", [
            'is_active' => false,
        ])->assertOk()->assertJsonPath('data.is_active', false);

        $this->assertDatabaseHas('tenants', ['id' => 'vh-alpha', 'is_active' => false]);

        $this->actingAsRequester()->putJson("{$this->baseUrl}/vh-alpha/toggle-active", [
            'is_active' => true,
        ])->assertOk()->assertJsonPath('data.is_active', true);
    }

    public function test_toggle_active_requires_flag(): void
    {
        $this->createTenant(['id' => 'vh-alpha']);

        $this->actingAsRequester()->putJson("{$this->baseUrl}/vh-alpha/toggle-active", [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['is_active']);
    }

    // ========== DELETE ==========

    public function test_cannot_delete_active_tenant(): void
    {
        $this->createTenant(['id' => 'vh-alpha', 'is_active' => true]);

        $this->actingAsRequester()->deleteJson("{$this->baseUrl}/vh-alpha")->assertStatus(422);

        $this->assertDatabaseHas('tenants', ['id' => 'vh-alpha', 'deleted_at' => null]);
    }

    public function test_delete_inactive_tenant_soft_deletes_with_config(): void
    {
        Event::fake([TenantDeleted::class]);

        $tenant = $this->createTenant(['id' => 'vh-alpha', 'is_active' => false]);
        TenantConfig::query()->create(array_merge(
            ['tenant_id' => $tenant->getTenantKey()],
            TenantConfig::defaults(),
        ));

        $this->actingAsRequester()->deleteJson("{$this->baseUrl}/vh-alpha")->assertOk();

        $this->assertSoftDeleted('tenants', ['id' => 'vh-alpha']);
        $this->assertSoftDeleted('tenant_configs', ['tenant_id' => 'vh-alpha']);
    }
}
