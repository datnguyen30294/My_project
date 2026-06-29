<?php

namespace Tests\Modules\Marketplace;

use App\Modules\Marketplace\VendorOffer\Models\VendorOffer;
use App\Modules\Marketplace\VendorOffer\Resources\VendorOfferListResource;
use Illuminate\Http\Request;
use Tests\TestCase;

/**
 * Serialization contract for a flattened offer row (one product × project),
 * including the listing scope (PMC operating company + project) resolved from
 * the `product_project` pivot. The cross-DB query itself is exercised in the
 * browser against dev Postgres — the SQLite test harness never provisions a
 * resi_mart schema.
 */
class VendorOfferListResourceTest extends TestCase
{
    private function makeOffer(array $attributes): VendorOffer
    {
        $offer = new VendorOffer;
        $offer->forceFill(array_merge([
            'id' => 7,
            'name' => 'Gói vệ sinh A',
            'sku' => 'VS-A',
            'type' => 'service',
            'price' => 500000,
            'unit' => 'lần',
            'status' => 'published',
            'published_at' => null,
        ], $attributes));

        return $offer;
    }

    public function test_includes_listing_scope_for_assigned_offer(): void
    {
        $offer = $this->makeOffer([
            'link_tenant_id' => 'pmc-saigon',
            'link_project_id' => 12,
            'link_is_active' => true,
            'tenant_name' => 'PMC Sài Gòn',
            'project_name' => 'Vinhomes',
        ]);

        $array = (new VendorOfferListResource($offer))->toArray(new Request);

        $this->assertSame('pmc-saigon', $array['tenant_id']);
        $this->assertSame('PMC Sài Gòn', $array['tenant_name']);
        $this->assertSame(12, $array['project_id']);
        $this->assertSame('Vinhomes', $array['project_name']);
        $this->assertTrue($array['is_active']);
        $this->assertSame('service', $array['type']['value']);
        $this->assertSame('published', $array['status']['value']);
    }

    public function test_listing_scope_is_null_when_offer_unassigned(): void
    {
        $offer = $this->makeOffer([
            'link_tenant_id' => null,
            'link_project_id' => null,
            'link_is_active' => null,
        ]);

        $array = (new VendorOfferListResource($offer))->toArray(new Request);

        $this->assertNull($array['tenant_id']);
        $this->assertNull($array['tenant_name']);
        $this->assertNull($array['project_id']);
        $this->assertNull($array['project_name']);
        $this->assertNull($array['is_active']);
    }

    public function test_paused_listing_keeps_is_active_false(): void
    {
        $offer = $this->makeOffer([
            'link_tenant_id' => 'pmc-hanoi',
            'link_project_id' => 5,
            'link_is_active' => false,
            'tenant_name' => 'PMC Hà Nội',
            'project_name' => 'Times City',
        ]);

        $array = (new VendorOfferListResource($offer))->toArray(new Request);

        $this->assertFalse($array['is_active']);
        $this->assertSame(5, $array['project_id']);
    }
}
