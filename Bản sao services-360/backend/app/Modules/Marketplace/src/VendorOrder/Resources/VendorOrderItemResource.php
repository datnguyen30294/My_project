<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOrder\Resources;

use App\Common\Resources\BaseResource;
use App\Modules\Marketplace\VendorOrder\Models\VendorOrderItem;
use Illuminate\Http\Request;

/**
 * @mixin VendorOrderItem
 */
class VendorOrderItemResource extends BaseResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'item_type' => $this->item_type,
            'product_name' => $this->product_name,
            'variant_name' => $this->variant_name,
            'sku' => $this->sku,
            'cover_url' => $this->cover_url,
            'quantity' => $this->quantity,
            'unit_price' => (float) $this->unit_price,
            'discount_amount' => (float) $this->discount_amount,
            'subtotal' => (float) $this->subtotal,
        ];
    }
}
