<?php

namespace Tests\Modules\Marketplace;

use App\Modules\Marketplace\Partner\Enums\PartnerStatus;
use App\Modules\Marketplace\Partner\Models\Partner;
use App\Modules\Marketplace\PartnerCommissionContract\Models\PartnerCommissionContract;
use App\Modules\Marketplace\PartnerProject\Models\PartnerProject;
use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\PMC\Project\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TenantPartnerAttachTest extends TestCase
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

    private function makePartner(string $slug, ?string $owner, PartnerStatus $status = PartnerStatus::Active): Partner
    {
        return Partner::create([
            'slug' => $slug,
            'tenant_id' => null,
            'owner_tenant_id' => $owner,
            'name' => ucfirst($slug),
            'owner_email' => $slug.'@example.com',
            'status' => $status->value,
        ]);
    }

    public function test_catalog_returns_all_active_vendors_with_link_flag(): void
    {
        $mine = $this->makePartner('mine', 'pmc-abc');
        $otherActive = $this->makePartner('other-active', 'pmc-other');
        $this->makePartner('suspended', 'pmc-other', PartnerStatus::Suspended);

        $project = Project::factory()->create();
        PartnerProject::create([
            'partner_id' => $mine->id,
            'tenant_id' => 'pmc-abc',
            'project_id' => $project->id,
            'registered_at' => now(),
        ]);

        $response = $this->getJson($this->baseUrl.'/catalog');

        $response->assertOk()->assertJsonPath('success', true);

        $rows = collect($response->json('data'))->keyBy('slug');
        $this->assertTrue($rows->has('mine'));
        $this->assertTrue($rows->has('other-active'));
        $this->assertFalse($rows->has('suspended'), 'Catalog chỉ hiện vendor active');
        $this->assertTrue($rows['mine']['is_linked']);
        $this->assertFalse($rows['other-active']['is_linked']);
    }

    public function test_attach_links_existing_vendor_of_another_tenant(): void
    {
        $vendor = $this->makePartner('shared-vendor', 'pmc-other');
        $p1 = Project::factory()->create();
        $p2 = Project::factory()->create();

        $response = $this->postJson($this->baseUrl.'/'.$vendor->id.'/attach', [
            'project_ids' => [$p1->id, $p2->id],
        ]);

        $response->assertOk()
            ->assertJsonPath('data.id', $vendor->id);

        $this->assertEqualsCanonicalizing([$p1->id, $p2->id], $response->json('data.project_ids'));

        $this->assertDatabaseHas('partner_project', [
            'partner_id' => $vendor->id,
            'tenant_id' => 'pmc-abc',
            'project_id' => $p1->id,
            'deleted_at' => null,
        ]);

        // Vendor giờ xuất hiện trong danh sách của PMC dù không sở hữu.
        $list = $this->getJson($this->baseUrl);
        $this->assertContains('shared-vendor', collect($list->json('data'))->pluck('slug')->all());
    }

    public function test_attach_is_idempotent_and_does_not_duplicate(): void
    {
        $vendor = $this->makePartner('vendor-x', 'pmc-other');
        $project = Project::factory()->create();

        $this->postJson($this->baseUrl.'/'.$vendor->id.'/attach', ['project_ids' => [$project->id]])->assertOk();
        $this->postJson($this->baseUrl.'/'.$vendor->id.'/attach', ['project_ids' => [$project->id]])->assertOk();

        $this->assertSame(1, PartnerProject::where('partner_id', $vendor->id)
            ->where('tenant_id', 'pmc-abc')
            ->where('project_id', $project->id)
            ->count());
    }

    public function test_attach_rejected_when_vendor_not_active(): void
    {
        $vendor = $this->makePartner('inactive-vendor', 'pmc-other', PartnerStatus::Suspended);
        $project = Project::factory()->create();

        $response = $this->postJson($this->baseUrl.'/'.$vendor->id.'/attach', [
            'project_ids' => [$project->id],
        ]);

        $response->assertStatus(409)
            ->assertJsonPath('error_code', 'PARTNER_NOT_ACTIVE');
    }

    public function test_attach_validation_rejects_unknown_project(): void
    {
        $vendor = $this->makePartner('vendor-y', 'pmc-other');

        $response = $this->postJson($this->baseUrl.'/'.$vendor->id.'/attach', [
            'project_ids' => [999999],
        ]);

        $response->assertStatus(422);
    }

    public function test_detach_removes_link(): void
    {
        $vendor = $this->makePartner('vendor-z', 'pmc-other');
        $project = Project::factory()->create();
        PartnerProject::create([
            'partner_id' => $vendor->id,
            'tenant_id' => 'pmc-abc',
            'project_id' => $project->id,
            'registered_at' => now(),
        ]);

        $response = $this->postJson($this->baseUrl.'/'.$vendor->id.'/detach', [
            'project_ids' => [$project->id],
        ]);

        $response->assertOk();
        $this->assertSame([], $response->json('data.project_ids'));
        $this->assertSoftDeleted('partner_project', [
            'partner_id' => $vendor->id,
            'tenant_id' => 'pmc-abc',
            'project_id' => $project->id,
        ]);
    }

    public function test_detach_blocked_when_active_contract_exists(): void
    {
        $vendor = $this->makePartner('vendor-contract', 'pmc-other');
        $project = Project::factory()->create();
        PartnerProject::create([
            'partner_id' => $vendor->id,
            'tenant_id' => 'pmc-abc',
            'project_id' => $project->id,
            'registered_at' => now(),
        ]);

        PartnerCommissionContract::factory()->active()->create([
            'partner_id' => $vendor->id,
            'tenant_id' => 'pmc-abc',
            'project_id' => $project->id,
        ]);

        $response = $this->postJson($this->baseUrl.'/'.$vendor->id.'/detach', [
            'project_ids' => [$project->id],
        ]);

        $response->assertStatus(409)
            ->assertJsonPath('error_code', 'PARTNER_HAS_ACTIVE_CONTRACT');

        $this->assertDatabaseHas('partner_project', [
            'partner_id' => $vendor->id,
            'tenant_id' => 'pmc-abc',
            'project_id' => $project->id,
            'deleted_at' => null,
        ]);
    }
}
