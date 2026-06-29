<?php

namespace Tests\Modules\Marketplace;

use App\Modules\Marketplace\Partner\Enums\PartnerStatus;
use App\Modules\Marketplace\Partner\Models\Partner;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\CommissionMode;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\ContractCreatedScope;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\ContractStatus;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\SubscriptionCycle;
use App\Modules\Marketplace\PartnerCommissionContract\Models\PartnerCommissionContract;
use App\Modules\Platform\Auth\Models\RequesterAccount;
use App\Modules\Platform\Tenant\Models\Organization;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PartnerCommissionContractTest extends TestCase
{
    use RefreshDatabase;

    private string $baseUrl = '/api/v1/platform/partner-commission-contracts';

    private RequesterAccount $requester;

    private Partner $partner;

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
            fn () => Organization::factory()->create([
                'id' => 'tnp',
                'name' => 'TNP Tenant',
                'is_active' => true,
                'is_vendor_enabled' => true,
            ]),
        );

        $this->partner = Partner::create([
            'slug' => 'vendor-abc',
            'tenant_id' => null,
            'owner_tenant_id' => null,
            'name' => 'Vendor ABC',
            'owner_email' => 'vendor@abc.vn',
            'status' => PartnerStatus::Active->value,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function perOrderTerms(): array
    {
        return [
            'percent' => 10.00,
            'fixed' => null,
        ];
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function createDraftPayload(array $overrides = []): array
    {
        return array_merge([
            'partner_id' => $this->partner->id,
            'tenant_id' => $this->tenant->id,
            'project_id' => 1,
            'commission_mode' => CommissionMode::PerOrder->value,
            'starts_at' => now()->toDateString(),
            'terms' => $this->perOrderTerms(),
        ], $overrides);
    }

    // -------------------- CREATE DRAFT --------------------

    public function test_platform_creates_a_per_order_draft_contract(): void
    {
        $response = $this->actingAs($this->requester, 'requester')
            ->postJson($this->baseUrl, $this->createDraftPayload());

        $response->assertCreated()
            ->assertJsonPath('data.status.value', ContractStatus::Draft->value)
            ->assertJsonPath('data.commission_mode.value', CommissionMode::PerOrder->value)
            ->assertJsonPath('data.created_scope.value', ContractCreatedScope::Platform->value);

        $this->assertDatabaseHas('partner_commission_contracts', [
            'partner_id' => $this->partner->id,
            'tenant_id' => $this->tenant->id,
            'status' => ContractStatus::Draft->value,
            'created_scope' => ContractCreatedScope::Platform->value,
        ]);
    }

    public function test_platform_creates_a_revenue_share_draft_contract(): void
    {
        $payload = $this->createDraftPayload([
            'commission_mode' => CommissionMode::RevenueShare->value,
            'terms' => [
                'billing_period' => 'monthly',
                'tiers' => [
                    ['min_gmv' => 0, 'max_gmv' => 10_000_000, 'percent' => 15.00],
                    ['min_gmv' => 10_000_000, 'max_gmv' => 50_000_000, 'percent' => 12.00],
                    ['min_gmv' => 50_000_000, 'max_gmv' => null, 'percent' => 10.00],
                ],
            ],
        ]);

        $this->actingAs($this->requester, 'requester')
            ->postJson($this->baseUrl, $payload)
            ->assertCreated()
            ->assertJsonPath('data.commission_mode.value', CommissionMode::RevenueShare->value);
    }

    public function test_platform_creates_a_subscription_draft_contract(): void
    {
        $payload = $this->createDraftPayload([
            'commission_mode' => CommissionMode::Subscription->value,
            'terms' => [
                'amount' => 500_000.00,
                'cycle' => SubscriptionCycle::Monthly->value,
            ],
        ]);

        $this->actingAs($this->requester, 'requester')
            ->postJson($this->baseUrl, $payload)
            ->assertCreated()
            ->assertJsonPath('data.commission_mode.value', CommissionMode::Subscription->value);
    }

    public function test_per_order_creation_rejected_when_neither_percent_nor_fixed_provided(): void
    {
        $terms = $this->perOrderTerms();
        $terms['percent'] = null;
        $terms['fixed'] = null;

        $this->actingAs($this->requester, 'requester')
            ->postJson($this->baseUrl, $this->createDraftPayload(['terms' => $terms]))
            ->assertUnprocessable();
    }

    public function test_creation_rejected_when_partner_does_not_exist(): void
    {
        $this->actingAs($this->requester, 'requester')
            ->postJson($this->baseUrl, $this->createDraftPayload(['partner_id' => 9999]))
            ->assertUnprocessable();
    }

    // -------------------- UPDATE DRAFT --------------------

    public function test_updates_draft_with_full_field_changes(): void
    {
        $contract = PartnerCommissionContract::factory()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => $this->tenant->id,
            'project_id' => 1,
        ]);

        $this->actingAs($this->requester, 'requester')
            ->putJson($this->baseUrl.'/'.$contract->id, $this->createDraftPayload([
                'notes' => 'Cập nhật mới',
            ]))
            ->assertOk()
            ->assertJsonPath('data.notes', 'Cập nhật mới');
    }

    public function test_update_full_draft_fails_when_status_is_pending(): void
    {
        $contract = PartnerCommissionContract::factory()->pending()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => $this->tenant->id,
            'project_id' => 1,
        ]);

        $this->actingAs($this->requester, 'requester')
            ->putJson($this->baseUrl.'/'.$contract->id, $this->createDraftPayload())
            ->assertStatus(422);
    }

    public function test_pending_can_update_notes_only(): void
    {
        $contract = PartnerCommissionContract::factory()->pending()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => $this->tenant->id,
            'project_id' => 1,
            'notes' => 'Cũ',
        ]);

        $this->actingAs($this->requester, 'requester')
            ->patchJson($this->baseUrl.'/'.$contract->id.'/notes', [
                'notes' => 'Mới',
            ])
            ->assertOk()
            ->assertJsonPath('data.notes', 'Mới');
    }

    // -------------------- DISCARD DRAFT --------------------

    public function test_discards_draft_hard_delete(): void
    {
        $contract = PartnerCommissionContract::factory()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => $this->tenant->id,
            'project_id' => 1,
        ]);

        $this->actingAs($this->requester, 'requester')
            ->deleteJson($this->baseUrl.'/'.$contract->id)
            ->assertNoContent();

        $this->assertDatabaseMissing('partner_commission_contracts', [
            'id' => $contract->id,
        ]);
    }

    public function test_cannot_discard_non_draft(): void
    {
        $contract = PartnerCommissionContract::factory()->pending()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => $this->tenant->id,
            'project_id' => 1,
        ]);

        $this->actingAs($this->requester, 'requester')
            ->deleteJson($this->baseUrl.'/'.$contract->id)
            ->assertStatus(422);
    }

    // -------------------- SIGN (DRAFT → PENDING) --------------------

    public function test_signs_draft_to_pending(): void
    {
        $contract = PartnerCommissionContract::factory()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => $this->tenant->id,
            'project_id' => 1,
        ]);

        $this->actingAs($this->requester, 'requester')
            ->postJson($this->baseUrl.'/'.$contract->id.'/sign')
            ->assertOk()
            ->assertJsonPath('data.status.value', ContractStatus::Pending->value);

        $this->assertNotNull($contract->fresh()->signed_at);
    }

    public function test_sign_rejected_when_already_pending(): void
    {
        $contract = PartnerCommissionContract::factory()->pending()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => $this->tenant->id,
            'project_id' => 1,
        ]);

        $this->actingAs($this->requester, 'requester')
            ->postJson($this->baseUrl.'/'.$contract->id.'/sign')
            ->assertStatus(422);
    }

    // -------------------- REVOKE PENDING --------------------

    public function test_revokes_pending_contract(): void
    {
        $contract = PartnerCommissionContract::factory()->pending()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => $this->tenant->id,
            'project_id' => 1,
        ]);

        $this->actingAs($this->requester, 'requester')
            ->postJson($this->baseUrl.'/'.$contract->id.'/revoke', [
                'cancellation_reason' => 'Sai số liệu',
            ])
            ->assertOk()
            ->assertJsonPath('data.status.value', ContractStatus::Revoked->value);
    }

    // -------------------- CANCEL ACTIVE --------------------

    public function test_cancels_active_contract(): void
    {
        $contract = PartnerCommissionContract::factory()->active()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => $this->tenant->id,
            'project_id' => 1,
        ]);

        $this->actingAs($this->requester, 'requester')
            ->postJson($this->baseUrl.'/'.$contract->id.'/cancel', [
                'cancellation_reason' => 'Không phù hợp',
            ])
            ->assertOk()
            ->assertJsonPath('data.status.value', ContractStatus::Cancelled->value);
    }

    public function test_cannot_cancel_non_active(): void
    {
        $contract = PartnerCommissionContract::factory()->pending()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => $this->tenant->id,
            'project_id' => 1,
        ]);

        $this->actingAs($this->requester, 'requester')
            ->postJson($this->baseUrl.'/'.$contract->id.'/cancel', [
                'cancellation_reason' => 'X',
            ])
            ->assertStatus(422);
    }

    // -------------------- LIST --------------------

    public function test_lists_contracts_with_filter_by_status(): void
    {
        PartnerCommissionContract::factory()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => $this->tenant->id,
            'project_id' => 1,
        ]);

        PartnerCommissionContract::factory()->pending()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => $this->tenant->id,
            'project_id' => 1,
        ]);

        $response = $this->actingAs($this->requester, 'requester')
            ->getJson($this->baseUrl.'?status='.ContractStatus::Pending->value);

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
    }

    public function test_list_resolves_tenant_name_when_filtered_by_partner(): void
    {
        PartnerCommissionContract::factory()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => $this->tenant->id,
            'project_id' => 1,
        ]);

        $response = $this->actingAs($this->requester, 'requester')
            ->getJson($this->baseUrl.'?partner_id='.$this->partner->id);

        $response->assertOk()
            ->assertJsonPath('data.0.tenant_id', $this->tenant->id)
            ->assertJsonPath('data.0.tenant_name', $this->tenant->name);
    }

    // -------------------- LAZY EXPIRY --------------------

    public function test_returns_expired_status_when_ends_at_is_past(): void
    {
        $contract = PartnerCommissionContract::factory()->expired()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => $this->tenant->id,
            'project_id' => 1,
        ]);

        $response = $this->actingAs($this->requester, 'requester')
            ->getJson($this->baseUrl.'/'.$contract->id);

        $response->assertOk()
            ->assertJsonPath('data.status.value', ContractStatus::Expired->value);

        // DB still shows active — expiry is lazy.
        $this->assertSame(ContractStatus::Active->value, $contract->fresh()->status->value);
    }

    // -------------------- TERMINAL TRANSITIONS --------------------

    public function test_terminal_replaced_cannot_be_signed(): void
    {
        $contract = PartnerCommissionContract::factory()->replaced()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => $this->tenant->id,
            'project_id' => 1,
        ]);

        $this->actingAs($this->requester, 'requester')
            ->postJson($this->baseUrl.'/'.$contract->id.'/sign')
            ->assertStatus(422);
    }

    public function test_terminal_cancelled_cannot_transition(): void
    {
        $contract = PartnerCommissionContract::factory()->cancelled()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => $this->tenant->id,
            'project_id' => 1,
        ]);

        $this->actingAs($this->requester, 'requester')
            ->postJson($this->baseUrl.'/'.$contract->id.'/cancel', [
                'cancellation_reason' => 'X',
            ])
            ->assertStatus(422);
    }
}
