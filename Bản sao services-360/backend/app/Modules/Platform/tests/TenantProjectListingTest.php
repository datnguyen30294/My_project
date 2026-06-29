<?php

namespace Tests\Modules\Platform;

use App\Modules\Platform\Auth\Models\RequesterAccount;
use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\PMC\Project\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TenantProjectListingTest extends TestCase
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
        return '/api/v1/platform/tenants/'.($tenantId ?? $this->tenant->id).'/projects';
    }

    // ========== LIST ==========

    public function test_list_returns_projects_sorted_by_name_with_meta_total(): void
    {
        Project::factory()->create(['name' => 'Chung cư Beta', 'code' => 'PJ002', 'address' => null]);
        Project::factory()->stopped()->create(['name' => 'Chung cư Alpha', 'code' => 'PJ001', 'address' => 'Số 1 Đại Cồ Việt, Hà Nội']);

        $response = $this->actingAsRequester()->getJson($this->baseUrl());

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('meta.total', 2)
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.code', 'PJ001')
            ->assertJsonPath('data.0.name', 'Chung cư Alpha')
            ->assertJsonPath('data.0.address', 'Số 1 Đại Cồ Việt, Hà Nội')
            ->assertJsonPath('data.0.status.value', 'stopped')
            ->assertJsonPath('data.0.status.label', 'Đã dừng')
            ->assertJsonPath('data.1.code', 'PJ002')
            ->assertJsonPath('data.1.address', null)
            ->assertJsonPath('data.1.status.value', 'managing')
            ->assertJsonPath('data.1.status.label', 'Đang quản lý');

        $this->assertIsInt($response->json('data.0.id'));
    }

    public function test_list_paginates_with_per_page(): void
    {
        Project::factory()->count(3)->create();

        $response = $this->actingAsRequester()->getJson($this->baseUrl().'?per_page=2');

        $response->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('meta.total', 3)
            ->assertJsonPath('meta.per_page', 2)
            ->assertJsonPath('meta.last_page', 2);

        $page2 = $this->actingAsRequester()->getJson($this->baseUrl().'?per_page=2&page=2');

        $page2->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('meta.current_page', 2);
    }

    public function test_list_searches_by_name_or_code(): void
    {
        Project::factory()->create(['name' => 'Chung cư Alpha', 'code' => 'PJ001']);
        Project::factory()->create(['name' => 'Toà nhà Beta', 'code' => 'PJ002']);

        $this->actingAsRequester()->getJson($this->baseUrl().'?search=Alpha')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.code', 'PJ001');

        $this->actingAsRequester()->getJson($this->baseUrl().'?search=PJ002')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Toà nhà Beta');
    }

    public function test_list_filters_by_status(): void
    {
        Project::factory()->create(['name' => 'Đang quản lý']);
        Project::factory()->stopped()->create(['name' => 'Đã dừng']);

        $response = $this->actingAsRequester()->getJson($this->baseUrl().'?status=stopped');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Đã dừng');
    }

    public function test_list_rejects_invalid_status(): void
    {
        $this->actingAsRequester()
            ->getJson($this->baseUrl().'?status=unknown')
            ->assertStatus(422)
            ->assertJsonValidationErrors(['status']);
    }

    public function test_list_does_not_expose_bqt_bank_fields(): void
    {
        Project::factory()->create([
            'bqt_bank_bin' => '970436',
            'bqt_bank_name' => 'Vietcombank',
            'bqt_account_number' => '0123456789',
            'bqt_account_holder' => 'BQT ALPHA',
        ]);

        $response = $this->actingAsRequester()->getJson($this->baseUrl());

        $response->assertOk();

        $this->assertSame(
            ['id', 'code', 'name', 'address', 'status'],
            array_keys($response->json('data.0')),
        );
    }

    public function test_list_excludes_soft_deleted_projects(): void
    {
        Project::factory()->create(['name' => 'Dự án còn hoạt động']);
        Project::factory()->create(['name' => 'Dự án đã xoá'])->delete();

        $response = $this->actingAsRequester()->getJson($this->baseUrl());

        $response->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.name', 'Dự án còn hoạt động');
    }

    public function test_list_works_for_inactive_tenant(): void
    {
        $this->tenant->update(['is_active' => false]);
        Project::factory()->create(['name' => 'Dự án lịch sử']);

        $response = $this->actingAsRequester()->getJson($this->baseUrl());

        $response->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.name', 'Dự án lịch sử');
    }

    public function test_list_returns_404_for_nonexistent_tenant(): void
    {
        $this->actingAsRequester()
            ->getJson($this->baseUrl('khong-ton-tai'))
            ->assertStatus(404);
    }

    public function test_list_requires_authentication(): void
    {
        $this->getJson($this->baseUrl())->assertStatus(401);
    }
}
