<?php

namespace Tests\Modules\Marketplace;

use App\Modules\Marketplace\Partner\Enums\PartnerStatus;
use App\Modules\Marketplace\Partner\Models\Partner;
use App\Modules\Marketplace\PartnerCommissionContract\Contracts\PartnerCommissionContractServiceInterface;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\ContractStatus;
use App\Modules\Marketplace\PartnerCommissionContract\Models\PartnerCommissionContract;
use App\Modules\Platform\Auth\Models\RequesterAccount;
use App\Modules\Platform\Tenant\Models\Organization;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PartnerCommissionContractSwitchTest extends TestCase
{
    use RefreshDatabase;

    private RequesterAccount $requester;

    private Partner $partner;

    private Organization $tenant;

    private PartnerCommissionContractServiceInterface $service;

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
                'name' => 'TNP',
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

        $this->service = app(PartnerCommissionContractServiceInterface::class);
    }

    public function test_switches_pending_to_active_when_no_current_active_exists(): void
    {
        $pending = PartnerCommissionContract::factory()->pending()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => $this->tenant->id,
            'project_id' => 1,
        ]);

        $result = $this->service->switchTo($pending->id, $this->requester->id);

        $this->assertSame(ContractStatus::Active->value, $result->status->value);
        $this->assertNotNull($result->activated_at);
    }

    public function test_atomically_replaces_current_active_when_switching(): void
    {
        $active = PartnerCommissionContract::factory()->active()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => $this->tenant->id,
            'project_id' => 1,
        ]);

        $pending = PartnerCommissionContract::factory()->pending()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => $this->tenant->id,
            'project_id' => 1,
        ]);

        $this->service->switchTo($pending->id, $this->requester->id);

        $this->assertSame(ContractStatus::Replaced->value, $active->fresh()->status->value);
        $this->assertSame($pending->id, $active->fresh()->replaced_by_contract_id);
        $this->assertNotNull($active->fresh()->replaced_at);

        $this->assertSame(ContractStatus::Active->value, $pending->fresh()->status->value);
        $this->assertNotNull($pending->fresh()->activated_at);
    }

    public function test_other_pending_contracts_remain_pending_after_switch(): void
    {
        $pendingA = PartnerCommissionContract::factory()->pending()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => $this->tenant->id,
            'project_id' => 1,
        ]);

        $pendingB = PartnerCommissionContract::factory()->pending()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => $this->tenant->id,
            'project_id' => 1,
        ]);

        $this->service->switchTo($pendingA->id, $this->requester->id);

        $this->assertSame(ContractStatus::Active->value, $pendingA->fresh()->status->value);
        $this->assertSame(ContractStatus::Pending->value, $pendingB->fresh()->status->value);
    }

    public function test_cannot_switch_non_pending_contract(): void
    {
        $draft = PartnerCommissionContract::factory()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => $this->tenant->id,
            'project_id' => 1,
        ]);

        $this->expectException(\App\Modules\Marketplace\PartnerCommissionContract\Exceptions\InvalidContractTransitionException::class);
        $this->service->switchTo($draft->id, $this->requester->id);
    }

    public function test_cannot_switch_expired_pending(): void
    {
        $pending = PartnerCommissionContract::factory()->pending()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => $this->tenant->id,
            'project_id' => 1,
            'starts_at' => now()->subMonth(),
            'ends_at' => now()->subDay(),
        ]);

        $this->expectException(\App\Modules\Marketplace\PartnerCommissionContract\Exceptions\InvalidContractTransitionException::class);
        $this->service->switchTo($pending->id, $this->requester->id);
    }

    public function test_get_active_contract_for_returns_active(): void
    {
        $active = PartnerCommissionContract::factory()->active()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => $this->tenant->id,
            'project_id' => 7,
        ]);

        $result = $this->service->getActiveContractFor($this->partner->id, $this->tenant->id, 7);

        $this->assertNotNull($result);
        $this->assertSame($active->id, $result->id);
    }

    public function test_get_active_contract_for_returns_null_when_only_expired(): void
    {
        PartnerCommissionContract::factory()->expired()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => $this->tenant->id,
            'project_id' => 7,
        ]);

        $result = $this->service->getActiveContractFor($this->partner->id, $this->tenant->id, 7);

        $this->assertNull($result);
    }

    public function test_get_active_contract_for_returns_null_when_none_exists(): void
    {
        $result = $this->service->getActiveContractFor($this->partner->id, $this->tenant->id, 99);

        $this->assertNull($result);
    }
}
