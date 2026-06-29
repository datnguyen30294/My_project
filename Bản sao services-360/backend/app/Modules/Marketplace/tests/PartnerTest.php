<?php

namespace Tests\Modules\Marketplace;

use App\Modules\Marketplace\Partner\Enums\PartnerStatus;
use App\Modules\Marketplace\Partner\Models\Partner;
use App\Modules\Marketplace\PartnerProject\Models\PartnerProject;
use App\Modules\Platform\Auth\Models\RequesterAccount;
use App\Modules\Platform\Tenant\Models\Organization;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PartnerTest extends TestCase
{
    use RefreshDatabase;

    private string $baseUrl = '/api/v1/platform/partners';

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

    public function test_creates_a_partner_with_required_fields(): void
    {
        // No RESI_MART_INTERNAL_URL configured in test env → provisioning is
        // skipped, partner row created with tenant_id=null (pending state).
        $response = $this->actingAs($this->requester, 'requester')
            ->postJson($this->baseUrl, [
                'slug' => 'hoa-qua-abc',
                'name' => 'Hoa Quả ABC',
                'owner_email' => 'admin@hoaquaabc.vn',
                'categories' => ['hoa_qua', 'thuc_pham'],
            ]);

        $response->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.slug', 'hoa-qua-abc')
            ->assertJsonPath('data.tenant_id', null)
            ->assertJsonPath('data.name', 'Hoa Quả ABC')
            ->assertJsonPath('data.status.value', PartnerStatus::Active->value)
            ->assertJsonPath('data.categories.0', 'hoa_qua')
            ->assertJsonPath('data.is_provisioned', false);

        $this->assertDatabaseHas('partners', [
            'slug' => 'hoa-qua-abc',
            'name' => 'Hoa Quả ABC',
            'owner_email' => 'admin@hoaquaabc.vn',
            'tenant_id' => null,
        ]);
    }

    public function test_rejects_duplicate_slug(): void
    {
        Partner::create([
            'slug' => 'existing-vendor',
            'tenant_id' => 'existing-vendor',
            'name' => 'Existing',
            'owner_email' => 'a@a.com',
            'status' => PartnerStatus::Active->value,
        ]);

        $response = $this->actingAs($this->requester, 'requester')
            ->postJson($this->baseUrl, [
                'slug' => 'existing-vendor',
                'name' => 'Duplicate',
                'owner_email' => 'b@b.com',
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonPath('errors.slug.0', 'Slug đã được sử dụng.');
    }

    public function test_lists_partners_with_filters(): void
    {
        Partner::create([
            'slug' => 'active-vendor',
            'tenant_id' => 'active-vendor',
            'name' => 'Active',
            'owner_email' => 'a@a.com',
            'status' => PartnerStatus::Active->value,
            'categories' => ['hoa_qua'],
        ]);

        Partner::create([
            'slug' => 'suspended-vendor',
            'tenant_id' => 'suspended-vendor',
            'name' => 'Suspended',
            'owner_email' => 'b@b.com',
            'status' => PartnerStatus::Suspended->value,
            'categories' => ['giat_la'],
        ]);

        $response = $this->actingAs($this->requester, 'requester')
            ->getJson($this->baseUrl.'?status=active');

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
        $this->assertSame('active-vendor', $response->json('data.0.slug'));
    }

    public function test_updates_a_partner_but_not_slug(): void
    {
        $partner = Partner::create([
            'slug' => 'original-slug',
            'tenant_id' => 'original-slug',
            'name' => 'Old Name',
            'owner_email' => 'a@a.com',
            'status' => PartnerStatus::Active->value,
        ]);

        $response = $this->actingAs($this->requester, 'requester')
            ->putJson($this->baseUrl.'/'.$partner->id, [
                'slug' => 'new-slug',
                'name' => 'New Name',
                'status' => PartnerStatus::Suspended->value,
            ]);

        $response->assertOk()
            ->assertJsonPath('data.name', 'New Name')
            ->assertJsonPath('data.status.value', 'suspended')
            // slug must NOT change (immutable post-creation)
            ->assertJsonPath('data.slug', 'original-slug');
    }

    public function test_soft_deletes_a_partner(): void
    {
        $partner = Partner::create([
            'slug' => 'to-delete',
            'tenant_id' => 'to-delete',
            'name' => 'Bye',
            'owner_email' => 'a@a.com',
            'status' => PartnerStatus::Active->value,
        ]);

        $response = $this->actingAs($this->requester, 'requester')
            ->deleteJson($this->baseUrl.'/'.$partner->id);

        $response->assertNoContent();
        $this->assertSoftDeleted('partners', ['id' => $partner->id]);
    }

    public function test_provision_returns_existing_tenant_id_when_already_provisioned(): void
    {
        $partner = Partner::create([
            'slug' => 'already-prov',
            'tenant_id' => 'already-prov',
            'name' => 'Already',
            'owner_email' => 'a@a.com',
            'status' => PartnerStatus::Active->value,
        ]);

        $response = $this->actingAs($this->requester, 'requester')
            ->postJson($this->baseUrl.'/'.$partner->id.'/provision');

        $response->assertOk()
            ->assertJsonPath('data.tenant_id', 'already-prov')
            ->assertJsonPath('data.is_provisioned', true);
    }

    public function test_provision_returns_502_when_resi_mart_not_configured(): void
    {
        $partner = Partner::create([
            'slug' => 'pending-prov',
            'tenant_id' => null,
            'name' => 'Pending',
            'owner_email' => 'a@a.com',
            'status' => PartnerStatus::Active->value,
        ]);

        $response = $this->actingAs($this->requester, 'requester')
            ->postJson($this->baseUrl.'/'.$partner->id.'/provision');

        $response->assertStatus(502)
            ->assertJsonPath('error_code', 'RESI_MART_UNAVAILABLE');
    }

    public function test_platform_can_assign_owner_tenant_and_projects_on_create(): void
    {
        Organization::withoutEvents(
            fn () => Organization::factory()->create([
                'id' => 'pmc-abc',
                'name' => 'PMC ABC',
                'is_active' => true,
                'is_vendor_enabled' => false,
            ]),
        );

        $response = $this->actingAs($this->requester, 'requester')
            ->postJson($this->baseUrl, [
                'slug' => 'assigned-vendor',
                'name' => 'Assigned Vendor',
                'owner_email' => 'admin@vendor.vn',
                'owner_tenant_id' => 'pmc-abc',
                'project_ids' => [101, 202],
            ]);

        $response->assertCreated()
            ->assertJsonPath('data.owner_tenant_id', 'pmc-abc')
            ->assertJsonPath('data.owner_source.value', 'tenant')
            ->assertJsonPath('data.project_ids', [101, 202]);

        $this->assertDatabaseHas('partners', [
            'slug' => 'assigned-vendor',
            'owner_tenant_id' => 'pmc-abc',
        ]);

        $this->assertSame(
            2,
            PartnerProject::query()
                ->where('tenant_id', 'pmc-abc')
                ->whereIn('project_id', [101, 202])
                ->count(),
        );
    }

    public function test_platform_rejects_unknown_owner_tenant_id(): void
    {
        $response = $this->actingAs($this->requester, 'requester')
            ->postJson($this->baseUrl, [
                'slug' => 'reject-vendor',
                'name' => 'Reject Vendor',
                'owner_email' => 'admin@vendor.vn',
                'owner_tenant_id' => 'does-not-exist',
                'project_ids' => [101],
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('errors.owner_tenant_id.0', 'Tenant không tồn tại.');
    }

    public function test_platform_requires_project_ids_when_owner_tenant_id_set(): void
    {
        Organization::withoutEvents(
            fn () => Organization::factory()->create([
                'id' => 'pmc-need-proj',
                'name' => 'PMC',
                'is_active' => true,
            ]),
        );

        $response = $this->actingAs($this->requester, 'requester')
            ->postJson($this->baseUrl, [
                'slug' => 'no-proj-vendor',
                'name' => 'No Project Vendor',
                'owner_email' => 'admin@vendor.vn',
                'owner_tenant_id' => 'pmc-need-proj',
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('errors.project_ids.0', 'Vui lòng chọn ít nhất 1 dự án khi đã gán cho tenant.');
    }

    public function test_platform_can_update_owner_tenant_and_sync_projects(): void
    {
        Organization::withoutEvents(
            fn () => Organization::factory()->create([
                'id' => 'pmc-update',
                'name' => 'PMC Update',
                'is_active' => true,
            ]),
        );

        $partner = Partner::create([
            'slug' => 'platform-vendor',
            'tenant_id' => null,
            'owner_tenant_id' => null,
            'name' => 'Platform Vendor',
            'owner_email' => 'a@a.com',
            'status' => PartnerStatus::Active->value,
        ]);

        // Seed an existing pivot under a different (tenant, project) to ensure
        // sync is scoped per-tenant.
        PartnerProject::query()->create([
            'partner_id' => $partner->id,
            'tenant_id' => 'pmc-update',
            'project_id' => 999,
            'registered_at' => now(),
        ]);

        $response = $this->actingAs($this->requester, 'requester')
            ->putJson($this->baseUrl.'/'.$partner->id, [
                'owner_tenant_id' => 'pmc-update',
                'project_ids' => [101, 102],
            ]);

        $response->assertOk()
            ->assertJsonPath('data.owner_tenant_id', 'pmc-update')
            ->assertJsonPath('data.project_ids', [101, 102]);

        // 999 should be soft-deleted, 101 and 102 should exist.
        $this->assertSame(
            2,
            PartnerProject::query()
                ->where('partner_id', $partner->id)
                ->where('tenant_id', 'pmc-update')
                ->whereIn('project_id', [101, 102])
                ->count(),
        );
        $this->assertSoftDeleted('partner_project', [
            'partner_id' => $partner->id,
            'project_id' => 999,
        ]);
    }

    public function test_platform_show_includes_project_ids_when_owner_tenant_set(): void
    {
        $partner = Partner::create([
            'slug' => 'show-vendor',
            'tenant_id' => null,
            'owner_tenant_id' => 'pmc-show',
            'name' => 'Show Vendor',
            'owner_email' => 'a@a.com',
            'status' => PartnerStatus::Active->value,
        ]);
        PartnerProject::query()->create([
            'partner_id' => $partner->id,
            'tenant_id' => 'pmc-show',
            'project_id' => 11,
            'registered_at' => now(),
        ]);
        PartnerProject::query()->create([
            'partner_id' => $partner->id,
            'tenant_id' => 'pmc-show',
            'project_id' => 22,
            'registered_at' => now(),
        ]);

        $response = $this->actingAs($this->requester, 'requester')
            ->getJson($this->baseUrl.'/'.$partner->id);

        $response->assertOk()
            ->assertJsonPath('data.owner_tenant_id', 'pmc-show')
            ->assertJsonPath('data.project_ids', [11, 22]);
    }

    public function test_can_create_with_same_slug_after_soft_delete(): void
    {
        $partner = Partner::create([
            'slug' => 'reusable-slug',
            'tenant_id' => 'reusable-slug',
            'name' => 'First',
            'owner_email' => 'a@a.com',
            'status' => PartnerStatus::Active->value,
        ]);
        $partner->delete();

        $response = $this->actingAs($this->requester, 'requester')
            ->postJson($this->baseUrl, [
                'slug' => 'reusable-slug',
                'name' => 'Second',
                'owner_email' => 'b@b.com',
            ]);

        $response->assertCreated();
    }
}
