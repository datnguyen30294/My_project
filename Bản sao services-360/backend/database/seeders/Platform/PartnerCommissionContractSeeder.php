<?php

namespace Database\Seeders\Platform;

use App\Modules\Marketplace\Partner\Enums\PartnerStatus;
use App\Modules\Marketplace\Partner\Models\Partner;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\CommissionMode;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\ContractStatus;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\SubscriptionCycle;
use App\Modules\Marketplace\PartnerCommissionContract\Models\PartnerCommissionContract;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Dev seeder — creates a representative set of commission contracts covering
 * every lifecycle state across the 3 commission modes.
 *
 * Self-contained: ensures at least one Partner exists. Idempotent: skips if
 * any seeded contract code (prefix `HD-SEED-`) already exists.
 */
class PartnerCommissionContractSeeder extends Seeder
{
    /**
     * Seeded contracts use a distinct code prefix so dev seeds are easy to
     * spot and re-runs are safe.
     */
    private const CODE_PREFIX = 'HD-SEED-';

    public function run(): void
    {
        if (PartnerCommissionContract::query()->where('contract_code', 'like', self::CODE_PREFIX.'%')->exists()) {
            $this->command?->info('PartnerCommissionContractSeeder: already seeded, skipping.');

            return;
        }

        $tenantId = $this->resolveTenantId();

        if ($tenantId === null) {
            $this->command?->warn('PartnerCommissionContractSeeder: no tenant found, skipping.');

            return;
        }

        $projectId = $this->resolveProjectIdForTenant($tenantId);

        if ($projectId === null) {
            $this->command?->warn("PartnerCommissionContractSeeder: tenant '{$tenantId}' has no projects, skipping.");

            return;
        }

        $partners = $this->ensurePartners();

        $seq = 0;
        $now = Carbon::now();

        // --- Partner A (per_order) — full lifecycle ----------------------
        // 1) Replaced (previous active that got switched out)
        $this->seedContract(
            partner: $partners['a'],
            tenantId: $tenantId,
            projectId: $projectId,
            mode: CommissionMode::PerOrder,
            terms: $this->perOrderTerms(percent: 12.00, fixed: null),
            status: ContractStatus::Replaced,
            seq: ++$seq,
            attributes: [
                'starts_at' => $now->copy()->subDays(120),
                'ends_at' => null,
                'signed_at' => $now->copy()->subDays(121),
                'activated_at' => $now->copy()->subDays(120),
                'replaced_at' => $now->copy()->subDays(30),
            ],
        );

        // 2) Active (current contract, replaces #1)
        $activeForA = $this->seedContract(
            partner: $partners['a'],
            tenantId: $tenantId,
            projectId: $projectId,
            mode: CommissionMode::PerOrder,
            terms: $this->perOrderTerms(percent: 10.00, fixed: 50_000),
            status: ContractStatus::Active,
            seq: ++$seq,
            attributes: [
                'starts_at' => $now->copy()->subDays(30),
                'ends_at' => $now->copy()->addYear(),
                'signed_at' => $now->copy()->subDays(31),
                'activated_at' => $now->copy()->subDays(30),
            ],
        );

        // Link the replaced one to the active one.
        PartnerCommissionContract::query()
            ->where('contract_code', sprintf('%s%04d', self::CODE_PREFIX, 1))
            ->update(['replaced_by_contract_id' => $activeForA->id]);

        // 3) Pending (waiting to be switched into)
        $this->seedContract(
            partner: $partners['a'],
            tenantId: $tenantId,
            projectId: $projectId,
            mode: CommissionMode::PerOrder,
            terms: $this->perOrderTerms(percent: 9.00, fixed: 40_000),
            status: ContractStatus::Pending,
            seq: ++$seq,
            attributes: [
                'starts_at' => $now->copy()->addDays(15),
                'ends_at' => $now->copy()->addYears(1)->addDays(15),
                'signed_at' => $now->copy()->subDay(),
            ],
        );

        // 4) Draft (being prepared by admin)
        $this->seedContract(
            partner: $partners['a'],
            tenantId: $tenantId,
            projectId: $projectId,
            mode: CommissionMode::PerOrder,
            terms: $this->perOrderTerms(percent: 8.00, fixed: null),
            status: ContractStatus::Draft,
            seq: ++$seq,
            attributes: [
                'starts_at' => $now->copy()->addMonth(),
                'ends_at' => null,
                'notes' => 'Đang trao đổi với vendor về tỷ lệ chia.',
            ],
        );

        // 5) Cancelled active (admin cancelled an active contract)
        $this->seedContract(
            partner: $partners['a'],
            tenantId: $tenantId,
            projectId: $projectId,
            mode: CommissionMode::PerOrder,
            terms: $this->perOrderTerms(percent: 15.00, fixed: null),
            status: ContractStatus::Cancelled,
            seq: ++$seq,
            attributes: [
                'starts_at' => $now->copy()->subYear(),
                'ends_at' => null,
                'signed_at' => $now->copy()->subYear()->subDay(),
                'activated_at' => $now->copy()->subYear(),
                'cancelled_at' => $now->copy()->subMonths(4),
                'cancellation_reason' => 'Vendor vi phạm SLA, chấm dứt hợp đồng sớm.',
            ],
        );

        // --- Partner B (revenue_share) ----------------------------------
        // 6) Active revenue_share
        $this->seedContract(
            partner: $partners['b'],
            tenantId: $tenantId,
            projectId: $projectId,
            mode: CommissionMode::RevenueShare,
            terms: $this->revenueShareTerms(),
            status: ContractStatus::Active,
            seq: ++$seq,
            attributes: [
                'starts_at' => $now->copy()->subDays(60),
                'ends_at' => $now->copy()->addMonths(6),
                'signed_at' => $now->copy()->subDays(61),
                'activated_at' => $now->copy()->subDays(60),
            ],
        );

        // 7) Revoked pending (admin pulled back before tenant could switch)
        $this->seedContract(
            partner: $partners['b'],
            tenantId: $tenantId,
            projectId: $projectId,
            mode: CommissionMode::RevenueShare,
            terms: $this->revenueShareTerms(),
            status: ContractStatus::Revoked,
            seq: ++$seq,
            attributes: [
                'starts_at' => $now->copy()->subDays(15),
                'ends_at' => null,
                'signed_at' => $now->copy()->subDays(16),
                'cancelled_at' => $now->copy()->subDays(7),
                'cancellation_reason' => 'Sai thông tin pháp lý, soạn lại hợp đồng mới.',
            ],
        );

        // --- Partner C (subscription) -----------------------------------
        // 8) Active subscription (monthly)
        $this->seedContract(
            partner: $partners['c'],
            tenantId: $tenantId,
            projectId: $projectId,
            mode: CommissionMode::Subscription,
            terms: $this->subscriptionTerms(amount: 500_000, cycle: SubscriptionCycle::Monthly),
            status: ContractStatus::Active,
            seq: ++$seq,
            attributes: [
                'starts_at' => $now->copy()->subDays(10),
                'ends_at' => $now->copy()->addYear(),
                'signed_at' => $now->copy()->subDays(11),
                'activated_at' => $now->copy()->subDays(10),
            ],
        );

        // 9) Active subscription whose ends_at has already passed — surfaced
        // as `expired` via lazy expiry (no DB update needed).
        $this->seedContract(
            partner: $partners['c'],
            tenantId: $tenantId,
            // Different project so the partial unique active index isn't violated.
            projectId: $this->resolveSecondaryProjectIdForTenant($tenantId, $projectId) ?? $projectId,
            mode: CommissionMode::Subscription,
            terms: $this->subscriptionTerms(amount: 1_500_000, cycle: SubscriptionCycle::Quarterly),
            status: ContractStatus::Active,
            seq: ++$seq,
            attributes: [
                'starts_at' => $now->copy()->subMonths(8),
                'ends_at' => $now->copy()->subDay(),
                'signed_at' => $now->copy()->subMonths(8)->subDay(),
                'activated_at' => $now->copy()->subMonths(8),
                'notes' => 'Hợp đồng đã hết hạn — UI hiển thị "expired" qua lazy expiry.',
            ],
        );

        $this->command?->info("PartnerCommissionContractSeeder: seeded {$seq} contracts.");
    }

    /**
     * @param  array<string, mixed>  $terms
     * @param  array<string, mixed>  $attributes
     */
    private function seedContract(
        Partner $partner,
        string $tenantId,
        int $projectId,
        CommissionMode $mode,
        array $terms,
        ContractStatus $status,
        int $seq,
        array $attributes = [],
    ): PartnerCommissionContract {
        $payload = array_merge([
            'contract_code' => sprintf('%s%04d', self::CODE_PREFIX, $seq),
            'partner_id' => $partner->id,
            'tenant_id' => $tenantId,
            'project_id' => $projectId,
            'commission_mode' => $mode->value,
            'terms' => $terms,
            'status' => $status->value,
        ], $attributes);

        /** @var PartnerCommissionContract */
        return PartnerCommissionContract::query()->create($payload);
    }

    /**
     * Resolve a tenant id. Prefers an existing tenant slug from the central
     * `tenants` table.
     */
    private function resolveTenantId(): ?string
    {
        /** @var string|null */
        return DB::connection('central')->table('tenants')->value('id');
    }

    /**
     * Look up the first project id in the given tenant's schema.
     */
    private function resolveProjectIdForTenant(string $tenantId): ?int
    {
        try {
            tenancy()->initialize($tenantId);

            $id = DB::table('projects')->whereNull('deleted_at')->orderBy('id')->value('id');

            tenancy()->end();

            return $id !== null ? (int) $id : null;
        } catch (\Throwable) {
            return null;
        }
    }

    /**
     * Look up a second project id (different from $excludeId) so the
     * "expired" sample can live on a separate (partner × tenant × project)
     * scope without colliding with the active subscription.
     */
    private function resolveSecondaryProjectIdForTenant(string $tenantId, int $excludeId): ?int
    {
        try {
            tenancy()->initialize($tenantId);

            $id = DB::table('projects')
                ->whereNull('deleted_at')
                ->where('id', '!=', $excludeId)
                ->orderBy('id')
                ->value('id');

            tenancy()->end();

            return $id !== null ? (int) $id : null;
        } catch (\Throwable) {
            return null;
        }
    }

    /**
     * Ensure 3 demo partners exist. Returns them keyed `a`, `b`, `c`.
     *
     * @return array{a: Partner, b: Partner, c: Partner}
     */
    private function ensurePartners(): array
    {
        $defs = [
            'a' => [
                'slug' => 'vendor-demo-a',
                'name' => 'Vendor Demo A',
                'owner_email' => 'a@vendor-demo.test',
            ],
            'b' => [
                'slug' => 'vendor-demo-b',
                'name' => 'Vendor Demo B',
                'owner_email' => 'b@vendor-demo.test',
            ],
            'c' => [
                'slug' => 'vendor-demo-c',
                'name' => 'Vendor Demo C',
                'owner_email' => 'c@vendor-demo.test',
            ],
        ];

        $result = [];

        foreach ($defs as $key => $data) {
            /** @var Partner $partner */
            $partner = Partner::query()->firstOrCreate(
                ['slug' => $data['slug']],
                [
                    'name' => $data['name'],
                    'display_name' => $data['name'],
                    'owner_email' => $data['owner_email'],
                    'status' => PartnerStatus::Active->value,
                ],
            );

            $result[$key] = $partner;
        }

        /** @var array{a: Partner, b: Partner, c: Partner} */
        return $result;
    }

    /**
     * @return array<string, mixed>
     */
    private function perOrderTerms(?float $percent, ?float $fixed): array
    {
        return [
            'percent' => $percent,
            'fixed' => $fixed,
            'party_split' => [
                'platform' => 40.00,
                'operating_company' => 30.00,
                'board_of_directors' => 15.00,
                'management' => 15.00,
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function revenueShareTerms(): array
    {
        return [
            'billing_period' => 'monthly',
            'tiers' => [
                ['min_gmv' => 0, 'max_gmv' => 10_000_000, 'percent' => 15.00],
                ['min_gmv' => 10_000_000, 'max_gmv' => 50_000_000, 'percent' => 12.00],
                ['min_gmv' => 50_000_000, 'max_gmv' => null, 'percent' => 10.00],
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function subscriptionTerms(float $amount, SubscriptionCycle $cycle): array
    {
        return [
            'amount' => $amount,
            'cycle' => $cycle->value,
        ];
    }
}
