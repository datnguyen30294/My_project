<?php

namespace Tests\Modules\Marketplace;

use App\Modules\Marketplace\Partner\Enums\PartnerStatus;
use App\Modules\Marketplace\Partner\Models\Partner;
use App\Modules\Marketplace\Partner\Repositories\PartnerRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PartnerRepositoryTest extends TestCase
{
    use RefreshDatabase;

    private PartnerRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = new PartnerRepository;
    }

    private function makePartner(string $slug, ?string $tenantId, ?string $ownerTenantId, string $name = 'Vendor'): Partner
    {
        return Partner::create([
            'slug' => $slug,
            'tenant_id' => $tenantId,
            'owner_tenant_id' => $ownerTenantId,
            'name' => $name,
            'owner_email' => $slug.'@test.com',
            'status' => PartnerStatus::Active->value,
        ]);
    }

    public function test_returns_only_provisioned_partners_visible_to_tenant(): void
    {
        $platform = $this->makePartner('platform-vendor', 'platform-vendor', null, 'Bravo');
        $own = $this->makePartner('own-vendor', 'own-vendor', 'pmc-me', 'Alpha');

        // Should be excluded:
        $this->makePartner('other-vendor', 'other-vendor', 'pmc-other'); // owned by another tenant
        $this->makePartner('not-provisioned', null, null); // no resi_mart schema

        $result = $this->repository->allProvisionedVisibleTo('pmc-me');

        $this->assertEqualsCanonicalizing(
            [$platform->id, $own->id],
            $result->pluck('id')->all(),
        );
    }

    public function test_orders_results_by_name(): void
    {
        $this->makePartner('zulu', 'zulu', null, 'Zulu');
        $this->makePartner('alpha', 'alpha', null, 'Alpha');
        $this->makePartner('mike', 'mike', null, 'Mike');

        $names = $this->repository->allProvisionedVisibleTo('pmc-me')->pluck('name')->all();

        $this->assertSame(['Alpha', 'Mike', 'Zulu'], $names);
    }
}
