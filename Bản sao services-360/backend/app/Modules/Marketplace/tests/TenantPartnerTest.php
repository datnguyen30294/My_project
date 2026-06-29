<?php

namespace Tests\Modules\Marketplace;

use App\Modules\Marketplace\Partner\Enums\PartnerStatus;
use App\Modules\Marketplace\Partner\Models\Partner;
use App\Modules\Platform\Tenant\Models\Organization;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TenantPartnerTest extends TestCase
{
    use RefreshDatabase;

    private string $baseUrl = '/api/v1/pmc/partners';

    private Organization $tenant;

    protected function setUp(): void
    {
        parent::setUp();

        $this->tenant = Organization::withoutEvents(
            fn () => Organization::factory()->create([
                'id' => 'pmc-abc',
                'name' => 'PMC ABC',
                'is_active' => true,
                'is_vendor_enabled' => true,
            ]),
        );

        tenancy()->initialize($this->tenant);

        $this->actingAsAdmin();
    }

    protected function tearDown(): void
    {
        tenancy()->end();

        parent::tearDown();
    }

    public function test_creates_a_partner_owned_by_current_tenant(): void
    {
        $response = $this->postJson($this->baseUrl, [
            'slug' => 'hoa-qua-abc',
            'name' => 'Hoa Quả ABC',
            'owner_email' => 'admin@hoaquaabc.vn',
            'categories' => ['hoa_qua'],
        ]);

        $response->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.slug', 'hoa-qua-abc')
            ->assertJsonPath('data.owner_tenant_id', 'pmc-abc')
            ->assertJsonPath('data.owner_source.value', 'tenant')
            ->assertJsonPath('data.status.value', 'pending')
            ->assertJsonPath('data.is_provisioned', false);

        $this->assertDatabaseHas('partners', [
            'slug' => 'hoa-qua-abc',
            'owner_tenant_id' => 'pmc-abc',
        ]);
    }

    public function test_list_only_returns_partners_owned_by_current_tenant(): void
    {
        Partner::create([
            'slug' => 'mine',
            'tenant_id' => null,
            'owner_tenant_id' => 'pmc-abc',
            'name' => 'Mine',
            'owner_email' => 'a@a.com',
            'status' => PartnerStatus::Active->value,
        ]);
        Partner::create([
            'slug' => 'other-pmc',
            'tenant_id' => null,
            'owner_tenant_id' => 'pmc-other',
            'name' => 'Other',
            'owner_email' => 'b@b.com',
            'status' => PartnerStatus::Active->value,
        ]);
        Partner::create([
            'slug' => 'platform-owned',
            'tenant_id' => null,
            'owner_tenant_id' => null,
            'name' => 'Platform',
            'owner_email' => 'c@c.com',
            'status' => PartnerStatus::Active->value,
        ]);

        $response = $this->getJson($this->baseUrl);

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
        $this->assertSame('mine', $response->json('data.0.slug'));
    }

    public function test_show_returns_active_shared_vendor_not_owned_by_tenant(): void
    {
        $shared = Partner::create([
            'slug' => 'shared-active',
            'tenant_id' => 'shared-active',
            'owner_tenant_id' => null,
            'name' => 'Shared Active',
            'owner_email' => 'x@x.com',
            'status' => PartnerStatus::Active->value,
        ]);

        $response = $this->getJson($this->baseUrl.'/'.$shared->id);

        $response->assertOk()
            ->assertJsonPath('data.id', $shared->id)
            ->assertJsonPath('data.is_owned', false);
    }

    public function test_show_marks_own_vendor_as_owned(): void
    {
        $mine = Partner::create([
            'slug' => 'mine-detail',
            'tenant_id' => null,
            'owner_tenant_id' => 'pmc-abc',
            'name' => 'Mine',
            'owner_email' => 'a@a.com',
            'status' => PartnerStatus::Active->value,
        ]);

        $response = $this->getJson($this->baseUrl.'/'.$mine->id);

        $response->assertOk()
            ->assertJsonPath('data.is_owned', true);
    }

    public function test_show_returns_404_for_inactive_vendor_of_other_owner(): void
    {
        $other = Partner::create([
            'slug' => 'not-mine',
            'tenant_id' => null,
            'owner_tenant_id' => 'pmc-other',
            'name' => 'Other',
            'owner_email' => 'x@x.com',
            'status' => PartnerStatus::Suspended->value,
        ]);

        $response = $this->getJson($this->baseUrl.'/'.$other->id);

        $response->assertNotFound()
            ->assertJsonPath('error_code', 'PARTNER_NOT_FOUND');
    }

    public function test_update_rejects_partner_of_other_tenant(): void
    {
        $other = Partner::create([
            'slug' => 'not-mine',
            'tenant_id' => null,
            'owner_tenant_id' => 'pmc-other',
            'name' => 'Other',
            'owner_email' => 'x@x.com',
            'status' => PartnerStatus::Active->value,
        ]);

        $response = $this->putJson($this->baseUrl.'/'.$other->id, [
            'name' => 'Hacked',
        ]);

        $response->assertStatus(403)
            ->assertJsonPath('error_code', 'PARTNER_NOT_OWNED');
    }

    public function test_delete_rejects_shared_vendor_not_owned_by_tenant(): void
    {
        $shared = Partner::create([
            'slug' => 'shared-unprovisioned',
            'tenant_id' => null,
            'owner_tenant_id' => null,
            'name' => 'Shared',
            'owner_email' => 'x@x.com',
            'status' => PartnerStatus::Active->value,
        ]);

        $response = $this->deleteJson($this->baseUrl.'/'.$shared->id);

        $response->assertStatus(403)
            ->assertJsonPath('error_code', 'PARTNER_NOT_OWNED');

        $this->assertDatabaseHas('partners', [
            'id' => $shared->id,
            'deleted_at' => null,
        ]);
    }

    public function test_update_cannot_change_slug(): void
    {
        $mine = Partner::create([
            'slug' => 'keep-slug',
            'tenant_id' => null,
            'owner_tenant_id' => 'pmc-abc',
            'name' => 'Original',
            'owner_email' => 'a@a.com',
            'status' => PartnerStatus::Active->value,
        ]);

        $response = $this->putJson($this->baseUrl.'/'.$mine->id, [
            'slug' => 'new-slug',
            'name' => 'Renamed',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.slug', 'keep-slug')
            ->assertJsonPath('data.name', 'Renamed');
    }

    public function test_delete_succeeds_when_not_provisioned(): void
    {
        $mine = Partner::create([
            'slug' => 'unprovisioned',
            'tenant_id' => null,
            'owner_tenant_id' => 'pmc-abc',
            'name' => 'Unprovisioned',
            'owner_email' => 'a@a.com',
            'status' => PartnerStatus::Active->value,
        ]);

        $response = $this->deleteJson($this->baseUrl.'/'.$mine->id);

        $response->assertNoContent();
        $this->assertSoftDeleted('partners', ['id' => $mine->id]);
    }

    public function test_delete_blocked_when_already_provisioned(): void
    {
        $mine = Partner::create([
            'slug' => 'provisioned',
            'tenant_id' => 'provisioned',
            'owner_tenant_id' => 'pmc-abc',
            'name' => 'Provisioned',
            'owner_email' => 'a@a.com',
            'status' => PartnerStatus::Active->value,
        ]);

        $response = $this->deleteJson($this->baseUrl.'/'.$mine->id);

        $response->assertStatus(403)
            ->assertJsonPath('error_code', 'VENDOR_ALREADY_PROVISIONED');

        $this->assertDatabaseHas('partners', [
            'id' => $mine->id,
            'deleted_at' => null,
        ]);
    }

    public function test_rejects_duplicate_slug_globally(): void
    {
        Partner::create([
            'slug' => 'taken-slug',
            'tenant_id' => null,
            'owner_tenant_id' => 'pmc-other',
            'name' => 'Other',
            'owner_email' => 'b@b.com',
            'status' => PartnerStatus::Active->value,
        ]);

        $response = $this->postJson($this->baseUrl, [
            'slug' => 'taken-slug',
            'name' => 'Duplicate Attempt',
            'owner_email' => 'a@a.com',
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('errors.slug.0', 'Slug đã được sử dụng trên hệ thống.');
    }

    public function test_provision_rejects_partner_not_owned_by_tenant(): void
    {
        $other = Partner::create([
            'slug' => 'platform-owned',
            'tenant_id' => null,
            'owner_tenant_id' => null,
            'name' => 'Platform Owned',
            'owner_email' => 'x@x.com',
            'status' => PartnerStatus::Active->value,
        ]);

        $response = $this->postJson($this->baseUrl.'/'.$other->id.'/provision');

        $response->assertStatus(403)
            ->assertJsonPath('error_code', 'PARTNER_NOT_OWNED');
    }

    public function test_provision_returns_404_when_partner_does_not_exist(): void
    {
        $response = $this->postJson($this->baseUrl.'/999999/provision');

        $response->assertNotFound()
            ->assertJsonPath('error_code', 'PARTNER_NOT_FOUND');
    }

    public function test_middleware_blocks_when_vendor_feature_disabled(): void
    {
        tenancy()->end();

        $this->tenant->update(['is_vendor_enabled' => false]);
        tenancy()->initialize($this->tenant);

        $response = $this->getJson($this->baseUrl);

        $response->assertStatus(403)
            ->assertJsonPath('error_code', 'VENDOR_FEATURE_DISABLED');
    }
}
