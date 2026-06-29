<?php

namespace Tests\Modules\Platform;

use App\Modules\Platform\Auth\Models\RequesterAccount;
use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\Platform\Tenant\Models\TenantConfig;
use App\Modules\PMC\Account\Models\Account;
use App\Modules\PMC\Account\Models\Role;
use App\Modules\PMC\Department\Models\Department;
use App\Modules\PMC\JobTitle\Models\JobTitle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class TenantAccountManagementTest extends TestCase
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
        return '/api/v1/platform/tenants/'.($tenantId ?? $this->tenant->id).'/accounts';
    }

    /** @return array<string, mixed> */
    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Nguyễn Văn A',
            'email' => 'a@tenant.vn',
            'password' => 'password123',
            'department_ids' => [Department::factory()->create()->id],
            'job_title_id' => JobTitle::factory()->create()->id,
            'role_id' => Role::factory()->create()->id,
        ], $overrides);
    }

    // ========== LIST ==========

    public function test_list_returns_accounts_with_relations(): void
    {
        $department = Department::factory()->create(['name' => 'Ban quản lý']);
        $account = Account::factory()->create(['name' => 'Trần Thị B']);
        $account->departments()->sync([$department->id]);

        $response = $this->actingAsRequester()->getJson($this->baseUrl());

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Trần Thị B')
            ->assertJsonPath('data.0.departments.0.name', 'Ban quản lý')
            ->assertJsonPath('data.0.is_active', true);

        $this->assertIsInt($response->json('data.0.id'));
        $this->assertIsInt($response->json('data.0.job_title.id'));
        $this->assertIsInt($response->json('data.0.role.id'));
    }

    public function test_list_filters_by_is_active(): void
    {
        Account::factory()->create(['name' => 'Đang hoạt động', 'is_active' => true]);
        Account::factory()->create(['name' => 'Đã khoá', 'is_active' => false]);

        $response = $this->actingAsRequester()->getJson($this->baseUrl().'?is_active=0');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Đã khoá');
    }

    public function test_list_searches_by_name(): void
    {
        Account::factory()->create(['name' => 'Nguyễn Văn Tìm']);
        Account::factory()->create(['name' => 'Trần Thị Khác']);

        $response = $this->actingAsRequester()->getJson($this->baseUrl().'?search=Tìm');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Nguyễn Văn Tìm');
    }

    public function test_list_requires_authentication(): void
    {
        $this->getJson($this->baseUrl())->assertStatus(401);
    }

    public function test_list_returns_404_for_unknown_tenant(): void
    {
        $this->actingAsRequester()
            ->getJson($this->baseUrl('vh-missing'))
            ->assertStatus(404);
    }

    public function test_inactive_tenant_accounts_are_still_manageable(): void
    {
        $inactive = Organization::withoutEvents(
            fn () => Organization::factory()->create(['id' => 'vh-inactive', 'is_active' => false])
        );

        Account::factory()->create();

        $this->actingAsRequester()
            ->getJson($this->baseUrl($inactive->id))
            ->assertOk();
    }

    // ========== OPTIONS ==========

    public function test_options_returns_departments_job_titles_and_roles(): void
    {
        Department::factory()->create(['name' => 'Kỹ thuật']);
        JobTitle::factory()->create(['name' => 'Trưởng ban']);
        Role::factory()->create(['name' => 'Quản trị viên', 'is_active' => true]);
        Role::factory()->create(['name' => 'Vai trò khoá', 'is_active' => false]);

        $response = $this->actingAsRequester()->getJson($this->baseUrl().'/options');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.departments.0.name', 'Kỹ thuật')
            ->assertJsonPath('data.job_titles.0.name', 'Trưởng ban')
            ->assertJsonPath('data.roles.0.name', 'Quản trị viên')
            ->assertJsonCount(1, 'data.roles');
    }

    // ========== CREATE ==========

    public function test_create_account_happy_path(): void
    {
        $payload = $this->validPayload();

        $response = $this->actingAsRequester()->postJson($this->baseUrl(), $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Nguyễn Văn A')
            ->assertJsonPath('data.email', 'a@tenant.vn')
            ->assertJsonPath('data.is_active', true)
            ->assertJsonCount(1, 'data.departments');

        $this->assertDatabaseHas('accounts', ['email' => 'a@tenant.vn', 'name' => 'Nguyễn Văn A']);
        $this->assertDatabaseHas('account_department', [
            'account_id' => $response->json('data.id'),
            'department_id' => $payload['department_ids'][0],
        ]);
    }

    public function test_create_validates_required_fields(): void
    {
        $this->actingAsRequester()
            ->postJson($this->baseUrl(), [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'password', 'department_ids', 'job_title_id', 'role_id']);
    }

    public function test_create_rejects_short_password(): void
    {
        $this->actingAsRequester()
            ->postJson($this->baseUrl(), $this->validPayload(['password' => 'short']))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    public function test_create_rejects_duplicate_email(): void
    {
        Account::factory()->create(['email' => 'a@tenant.vn']);

        $this->actingAsRequester()
            ->postJson($this->baseUrl(), $this->validPayload(['email' => 'a@tenant.vn']))
            ->assertStatus(422)
            ->assertJsonPath('error_code', 'EMAIL_ALREADY_EXISTS');
    }

    public function test_create_rejects_email_of_soft_deleted_account(): void
    {
        Account::factory()->create(['email' => 'a@tenant.vn'])->delete();

        $this->actingAsRequester()
            ->postJson($this->baseUrl(), $this->validPayload(['email' => 'a@tenant.vn']))
            ->assertStatus(422)
            ->assertJsonPath('error_code', 'EMAIL_ALREADY_EXISTS');
    }

    public function test_create_rejects_unknown_department(): void
    {
        $this->actingAsRequester()
            ->postJson($this->baseUrl(), $this->validPayload(['department_ids' => [99999]]))
            ->assertStatus(422)
            ->assertJsonPath('error_code', 'DEPARTMENT_NOT_FOUND');
    }

    public function test_create_rejects_unknown_job_title(): void
    {
        $this->actingAsRequester()
            ->postJson($this->baseUrl(), $this->validPayload(['job_title_id' => 99999]))
            ->assertStatus(422)
            ->assertJsonPath('error_code', 'JOB_TITLE_NOT_FOUND');
    }

    public function test_create_rejects_unknown_role(): void
    {
        $this->actingAsRequester()
            ->postJson($this->baseUrl(), $this->validPayload(['role_id' => 99999]))
            ->assertStatus(422)
            ->assertJsonPath('error_code', 'ROLE_NOT_FOUND');
    }

    public function test_create_blocked_when_account_limit_reached(): void
    {
        TenantConfig::factory()->create([
            'tenant_id' => $this->tenant->id,
            'max_accounts' => 1,
        ]);

        Account::factory()->create();

        $this->actingAsRequester()
            ->postJson($this->baseUrl(), $this->validPayload())
            ->assertStatus(422)
            ->assertJsonPath('error_code', 'ACCOUNT_LIMIT_REACHED');
    }

    public function test_create_returns_404_for_unknown_tenant(): void
    {
        $this->actingAsRequester()
            ->postJson($this->baseUrl('vh-missing'), $this->validPayload())
            ->assertStatus(404);
    }

    // ========== UPDATE ==========

    public function test_update_account_info_and_deactivate(): void
    {
        $account = Account::factory()->create(['name' => 'Tên cũ', 'is_active' => true]);

        $response = $this->actingAsRequester()->putJson($this->baseUrl()."/{$account->id}", [
            'name' => 'Tên mới',
            'is_active' => false,
        ]);

        $response->assertOk()
            ->assertJsonPath('data.name', 'Tên mới')
            ->assertJsonPath('data.is_active', false);

        $this->assertDatabaseHas('accounts', [
            'id' => $account->id,
            'name' => 'Tên mới',
            'is_active' => false,
        ]);
    }

    public function test_update_resets_password_without_old_password(): void
    {
        $account = Account::factory()->create();

        $this->actingAsRequester()
            ->putJson($this->baseUrl()."/{$account->id}", ['password' => 'matkhaumoi123'])
            ->assertOk();

        $this->assertTrue(Hash::check('matkhaumoi123', $account->fresh()->password));
    }

    public function test_update_keeps_password_when_blank(): void
    {
        $account = Account::factory()->create(['password' => 'password123']);
        $originalHash = $account->fresh()->password;

        $this->actingAsRequester()
            ->putJson($this->baseUrl()."/{$account->id}", [
                'name' => 'Đổi tên',
                'password' => null,
            ])
            ->assertOk();

        $this->assertSame($originalHash, $account->fresh()->password);
    }

    public function test_update_rejects_duplicate_email(): void
    {
        Account::factory()->create(['email' => 'taken@tenant.vn']);
        $account = Account::factory()->create(['email' => 'mine@tenant.vn']);

        $this->actingAsRequester()
            ->putJson($this->baseUrl()."/{$account->id}", ['email' => 'taken@tenant.vn'])
            ->assertStatus(422)
            ->assertJsonPath('error_code', 'EMAIL_ALREADY_EXISTS');
    }

    public function test_update_allows_keeping_own_email(): void
    {
        $account = Account::factory()->create(['email' => 'mine@tenant.vn']);

        $this->actingAsRequester()
            ->putJson($this->baseUrl()."/{$account->id}", ['email' => 'mine@tenant.vn'])
            ->assertOk();
    }

    public function test_update_syncs_departments(): void
    {
        $account = Account::factory()->create();
        $newDepartment = Department::factory()->create();

        $this->actingAsRequester()
            ->putJson($this->baseUrl()."/{$account->id}", ['department_ids' => [$newDepartment->id]])
            ->assertOk()
            ->assertJsonPath('data.departments.0.id', $newDepartment->id);

        $this->assertDatabaseHas('account_department', [
            'account_id' => $account->id,
            'department_id' => $newDepartment->id,
        ]);
    }

    public function test_update_returns_404_for_unknown_account(): void
    {
        $this->actingAsRequester()
            ->putJson($this->baseUrl().'/99999', ['name' => 'Không tồn tại'])
            ->assertStatus(404);
    }
}
