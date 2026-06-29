<?php

namespace Tests\Modules\Marketplace;

use App\Modules\Marketplace\Partner\Enums\PartnerStatus;
use App\Modules\Marketplace\Partner\Models\Partner;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\CommissionMode;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\ContractCreatedScope;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\ContractStatus;
use App\Modules\Marketplace\PartnerCommissionContract\Models\PartnerCommissionContract;
use App\Modules\Platform\Tenant\Models\Organization;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TenantPartnerCommissionContractTest extends TestCase
{
    use RefreshDatabase;

    private string $baseUrl = '/api/v1/pmc/partner-commission-contracts';

    private Organization $tenant;

    private Organization $otherTenant;

    private Partner $partner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->tenant = Organization::withoutEvents(
            fn () => Organization::factory()->create([
                'id' => 'tnp',
                'name' => 'TNP',
                'is_active' => true,
                'is_vendor_enabled' => true,
            ]),
        );

        $this->otherTenant = Organization::withoutEvents(
            fn () => Organization::factory()->create([
                'id' => 'other',
                'name' => 'Other',
                'is_active' => true,
                'is_vendor_enabled' => true,
            ]),
        );

        $this->partner = Partner::create([
            'slug' => 'vendor-abc',
            'name' => 'Vendor ABC',
            'owner_email' => 'vendor@abc.vn',
            'status' => PartnerStatus::Active->value,
        ]);

        tenancy()->initialize($this->tenant);

        $this->actingAsAdmin();
    }

    protected function tearDown(): void
    {
        tenancy()->end();

        parent::tearDown();
    }

    /**
     * @return array<string, mixed>
     */
    private function perOrderTerms(): array
    {
        return [
            'percent' => 10.00,
            'fixed' => null,
            'party_split' => [
                'platform' => 40.00,
                'operating_company' => 30.00,
                'board_of_directors' => 15.00,
                'management' => 15.00,
            ],
        ];
    }

    public function test_tenant_creates_draft_with_auto_scope(): void
    {
        $response = $this->postJson($this->baseUrl, [
            'partner_id' => $this->partner->id,
            // tenant_id intentionally NOT sent — controller must inject current
            'tenant_id' => 'other',
            'project_id' => 1,
            'commission_mode' => CommissionMode::PerOrder->value,
            'starts_at' => now()->toDateString(),
            'terms' => $this->perOrderTerms(),
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.tenant_id', $this->tenant->id)
            ->assertJsonPath('data.created_scope.value', ContractCreatedScope::Tenant->value);

        $this->assertDatabaseHas('partner_commission_contracts', [
            'partner_id' => $this->partner->id,
            'tenant_id' => $this->tenant->id,
            'created_scope' => ContractCreatedScope::Tenant->value,
        ]);
    }

    public function test_tenant_list_filters_to_own_contracts(): void
    {
        PartnerCommissionContract::factory()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => $this->tenant->id,
            'project_id' => 1,
        ]);

        PartnerCommissionContract::factory()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => $this->otherTenant->id,
            'project_id' => 1,
        ]);

        $response = $this->getJson($this->baseUrl);

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
        $this->assertSame($this->tenant->id, $response->json('data.0.tenant_id'));
    }

    public function test_tenant_cannot_access_other_tenants_contract(): void
    {
        $foreign = PartnerCommissionContract::factory()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => $this->otherTenant->id,
            'project_id' => 1,
        ]);

        $this->getJson($this->baseUrl.'/'.$foreign->id)
            ->assertNotFound();
    }

    public function test_tenant_cannot_update_other_tenants_contract(): void
    {
        $foreign = PartnerCommissionContract::factory()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => $this->otherTenant->id,
            'project_id' => 1,
        ]);

        $this->putJson($this->baseUrl.'/'.$foreign->id, [
            'partner_id' => $this->partner->id,
            'tenant_id' => 'tnp',
            'project_id' => 1,
            'commission_mode' => CommissionMode::PerOrder->value,
            'starts_at' => now()->toDateString(),
            'terms' => $this->perOrderTerms(),
        ])->assertNotFound();
    }

    public function test_tenant_can_sign_their_own_draft(): void
    {
        $contract = PartnerCommissionContract::factory()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => $this->tenant->id,
            'project_id' => 1,
            'created_scope' => ContractCreatedScope::Tenant->value,
        ]);

        $this->postJson($this->baseUrl.'/'.$contract->id.'/sign')
            ->assertOk()
            ->assertJsonPath('data.status.value', ContractStatus::Pending->value);
    }

    public function test_tenant_can_revoke_pending_created_by_platform(): void
    {
        $contract = PartnerCommissionContract::factory()->pending()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => $this->tenant->id,
            'project_id' => 1,
            'created_scope' => ContractCreatedScope::Platform->value,
        ]);

        $this->postJson($this->baseUrl.'/'.$contract->id.'/revoke', [
            'cancellation_reason' => 'Tenant override',
        ])
            ->assertOk()
            ->assertJsonPath('data.status.value', ContractStatus::Revoked->value);
    }

    public function test_tenant_can_switch_pending_to_active(): void
    {
        $contract = PartnerCommissionContract::factory()->pending()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => $this->tenant->id,
            'project_id' => 1,
        ]);

        $this->postJson($this->baseUrl.'/'.$contract->id.'/switch')
            ->assertOk()
            ->assertJsonPath('data.status.value', ContractStatus::Active->value);
    }
}
