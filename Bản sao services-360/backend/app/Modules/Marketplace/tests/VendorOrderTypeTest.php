<?php

namespace Tests\Modules\Marketplace;

use App\Modules\Marketplace\VendorOrder\Enums\VendorOrderType;
use Tests\TestCase;

class VendorOrderTypeTest extends TestCase
{
    /**
     * @param  list<string>  $itemTypes
     */
    private function items(array $itemTypes): array
    {
        return array_map(fn (string $t): object => (object) ['item_type' => $t], $itemTypes);
    }

    public function test_all_product_items_derive_product(): void
    {
        $this->assertSame(
            VendorOrderType::Product,
            VendorOrderType::deriveFromItems($this->items(['product', 'product'])),
        );
    }

    public function test_all_service_items_derive_service(): void
    {
        $this->assertSame(
            VendorOrderType::Service,
            VendorOrderType::deriveFromItems($this->items(['service'])),
        );
    }

    public function test_mixed_items_derive_mixed(): void
    {
        $this->assertSame(
            VendorOrderType::Mixed,
            VendorOrderType::deriveFromItems($this->items(['product', 'service'])),
        );
    }

    public function test_empty_items_default_to_product(): void
    {
        $this->assertSame(VendorOrderType::Product, VendorOrderType::deriveFromItems([]));
    }

    public function test_values_lists_all_cases(): void
    {
        $this->assertSame(['product', 'service', 'mixed'], VendorOrderType::values());
    }

    public function test_labels_are_vietnamese(): void
    {
        $this->assertSame('Sản phẩm', VendorOrderType::Product->label());
        $this->assertSame('Dịch vụ', VendorOrderType::Service->label());
        $this->assertSame('Hỗn hợp', VendorOrderType::Mixed->label());
    }
}
