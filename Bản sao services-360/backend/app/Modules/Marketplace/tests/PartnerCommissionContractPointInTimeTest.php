<?php

namespace Tests\Modules\Marketplace;

use App\Modules\Marketplace\Partner\Enums\PartnerStatus;
use App\Modules\Marketplace\Partner\Models\Partner;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\ContractStatus;
use App\Modules\Marketplace\PartnerCommissionContract\Models\PartnerCommissionContract;
use App\Modules\Marketplace\PartnerCommissionContract\Repositories\PartnerCommissionContractRepository;
use App\Modules\Platform\Tenant\Models\Organization;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PartnerCommissionContractPointInTimeTest extends TestCase
{
    use RefreshDatabase;

    private Partner $partner;

    private PartnerCommissionContractRepository $repo;

    protected function setUp(): void
    {
        parent::setUp();

        Organization::withoutEvents(fn () => Organization::factory()->create([
            'id' => 'tnp',
            'name' => 'TNP',
            'is_active' => true,
            'is_vendor_enabled' => true,
        ]));

        $this->partner = Partner::create([
            'slug' => 'vendor-abc',
            'name' => 'Vendor ABC',
            'owner_email' => 'a@a.com',
            'status' => PartnerStatus::Active->value,
        ]);

        $this->repo = app(PartnerCommissionContractRepository::class);
    }

    public function test_returns_contract_that_was_active_at_given_time(): void
    {
        $c = PartnerCommissionContract::factory()->active()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => 'tnp',
            'project_id' => 1,
            'activated_at' => Carbon::parse('2026-05-01'),
        ]);

        $result = $this->repo->findActiveAt($this->partner->id, 'tnp', 1, Carbon::parse('2026-05-15'));

        $this->assertNotNull($result);
        $this->assertSame($c->id, $result->id);
    }

    public function test_returns_null_when_no_contract_existed_at_given_time(): void
    {
        PartnerCommissionContract::factory()->active()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => 'tnp',
            'project_id' => 1,
            'activated_at' => Carbon::parse('2026-05-01'),
        ]);

        // Query trước khi contract activated
        $result = $this->repo->findActiveAt($this->partner->id, 'tnp', 1, Carbon::parse('2026-04-01'));

        $this->assertNull($result);
    }

    public function test_returns_replaced_contract_when_query_before_replacement(): void
    {
        // Contract A active 2026-01-01 → bị replace lúc 2026-04-01
        $a = PartnerCommissionContract::factory()->replaced()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => 'tnp',
            'project_id' => 1,
            'activated_at' => Carbon::parse('2026-01-01'),
            'replaced_at' => Carbon::parse('2026-04-01'),
        ]);

        // Contract B active 2026-04-01
        $b = PartnerCommissionContract::factory()->active()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => 'tnp',
            'project_id' => 1,
            'activated_at' => Carbon::parse('2026-04-01'),
        ]);

        // Query lúc 2026-03-15 → phải trả về A (đang active tại thời điểm đó)
        $r1 = $this->repo->findActiveAt($this->partner->id, 'tnp', 1, Carbon::parse('2026-03-15'));
        $this->assertSame($a->id, $r1?->id);

        // Query lúc 2026-05-15 → phải trả về B
        $r2 = $this->repo->findActiveAt($this->partner->id, 'tnp', 1, Carbon::parse('2026-05-15'));
        $this->assertSame($b->id, $r2?->id);
    }

    public function test_ignores_draft_and_pending_contracts(): void
    {
        PartnerCommissionContract::factory()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => 'tnp',
            'project_id' => 1,
            'status' => ContractStatus::Draft->value,
            'activated_at' => null,
        ]);

        PartnerCommissionContract::factory()->pending()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => 'tnp',
            'project_id' => 1,
            'activated_at' => null,
        ]);

        $result = $this->repo->findActiveAt($this->partner->id, 'tnp', 1, Carbon::now());

        $this->assertNull($result);
    }

    public function test_filters_by_partner_tenant_project_scope(): void
    {
        PartnerCommissionContract::factory()->active()->create([
            'partner_id' => $this->partner->id,
            'tenant_id' => 'tnp',
            'project_id' => 1,
            'activated_at' => Carbon::parse('2026-01-01'),
        ]);

        // Khác project → không match
        $r = $this->repo->findActiveAt($this->partner->id, 'tnp', 99, Carbon::parse('2026-05-15'));
        $this->assertNull($r);

        // Khác tenant → không match
        $r2 = $this->repo->findActiveAt($this->partner->id, 'other', 1, Carbon::parse('2026-05-15'));
        $this->assertNull($r2);
    }
}
