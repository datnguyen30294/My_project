<?php

namespace Tests\Modules\Platform;

use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\Platform\Tenant\Models\TenantConfig;
use App\Modules\PMC\Account\Models\Account;
use App\Modules\PMC\Account\Models\Role;
use App\Modules\PMC\Department\Models\Department;
use App\Modules\PMC\JobTitle\Models\JobTitle;
use App\Modules\PMC\Project\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TenantLimitsTest extends TestCase
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

    /** @return array<string, mixed> */
    private function validAccountPayload(): array
    {
        return [
            'name' => 'Nguyễn Văn Mới',
            'email' => 'moi@example.com',
            'employee_code' => 'NV-LIMIT',
            'gender' => 'male',
            'department_ids' => [Department::factory()->create()->id],
            'job_title_id' => JobTitle::factory()->create()->id,
            'role_id' => Role::factory()->create()->id,
            'password' => 'password123',
        ];
    }

    // ========== MAX PROJECTS ==========

    public function test_project_creation_blocked_when_limit_reached(): void
    {
        $this->initializeTenantWithConfig(['max_projects' => 2]);
        $this->actingAsAdmin();

        Project::factory()->count(2)->create();

        $response = $this->postJson('/api/v1/pmc/projects', [
            'code' => 'DA-OVER',
            'name' => 'Dự án vượt giới hạn',
            'status' => 'managing',
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonPath('error_code', 'PROJECT_LIMIT_REACHED');

        $this->assertDatabaseMissing('projects', ['code' => 'DA-OVER']);
    }

    public function test_project_creation_allowed_below_limit(): void
    {
        $this->initializeTenantWithConfig(['max_projects' => 2]);
        $this->actingAsAdmin();

        Project::factory()->create();

        $this->postJson('/api/v1/pmc/projects', [
            'code' => 'DA-OK',
            'name' => 'Dự án trong giới hạn',
            'status' => 'managing',
        ])->assertStatus(201);
    }

    public function test_soft_deleted_projects_do_not_count_toward_limit(): void
    {
        $this->initializeTenantWithConfig(['max_projects' => 2]);
        $this->actingAsAdmin();

        Project::factory()->create();
        Project::factory()->create()->delete();

        $this->postJson('/api/v1/pmc/projects', [
            'code' => 'DA-SD',
            'name' => 'Dự án sau soft-delete',
            'status' => 'managing',
        ])->assertStatus(201);
    }

    public function test_project_creation_unlimited_without_tenant_config(): void
    {
        $this->actingAsAdmin();

        Project::factory()->count(3)->create();

        $this->postJson('/api/v1/pmc/projects', [
            'code' => 'DA-FREE',
            'name' => 'Không giới hạn',
            'status' => 'managing',
        ])->assertStatus(201);
    }

    // ========== MAX ACCOUNTS ==========

    public function test_account_creation_blocked_when_limit_reached(): void
    {
        $this->initializeTenantWithConfig(['max_accounts' => 1]);
        $this->actingAsAdmin(); // tạo sẵn 1 account admin → chạm trần

        $response = $this->postJson('/api/v1/pmc/accounts', $this->validAccountPayload());

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonPath('error_code', 'ACCOUNT_LIMIT_REACHED');
    }

    public function test_account_creation_allowed_below_limit(): void
    {
        $this->initializeTenantWithConfig(['max_accounts' => 10]);
        $this->actingAsAdmin();

        $this->postJson('/api/v1/pmc/accounts', $this->validAccountPayload())
            ->assertStatus(201);
    }

    // ========== SESSION TIMEOUT ==========

    public function test_login_token_expires_per_tenant_config(): void
    {
        $this->initializeTenantWithConfig(['session_timeout_minutes' => 30]);

        $account = Account::factory()->create([
            'email' => 'user@test.com',
            'password' => 'password123',
        ]);

        $this->postJson('/api/v1/auth/login', [
            'email' => 'user@test.com',
            'password' => 'password123',
        ])->assertStatus(200);

        $token = $account->tokens()->latest('id')->first();

        $this->assertNotNull($token->expires_at);
        $this->assertEqualsWithDelta(
            now()->addMinutes(30)->timestamp,
            $token->expires_at->timestamp,
            5,
        );
    }

    public function test_login_token_never_expires_without_tenant_config(): void
    {
        $account = Account::factory()->create([
            'email' => 'user@test.com',
            'password' => 'password123',
        ]);

        $this->postJson('/api/v1/auth/login', [
            'email' => 'user@test.com',
            'password' => 'password123',
        ])->assertStatus(200);

        $this->assertNull($account->tokens()->latest('id')->first()->expires_at);
    }

    public function test_expired_token_is_rejected(): void
    {
        $this->initializeTenantWithConfig(['session_timeout_minutes' => 30]);

        $account = Account::factory()->create([
            'email' => 'user@test.com',
            'password' => 'password123',
        ]);

        $login = $this->postJson('/api/v1/auth/login', [
            'email' => 'user@test.com',
            'password' => 'password123',
        ]);

        $plainToken = $login->json('data.token');

        $this->travel(31)->minutes();

        $this->withHeader('Authorization', "Bearer {$plainToken}")
            ->getJson('/api/v1/pmc/departments')
            ->assertStatus(401);
    }
}
