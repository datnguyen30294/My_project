<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOrder\Models;

use App\Modules\Marketplace\VendorOrder\Support\ResiMartConnection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $order_id
 * @property int $product_id
 * @property int|null $variant_id
 * @property string $item_type
 * @property string $product_name
 * @property string|null $variant_name
 * @property string $sku
 * @property string|null $cover_url
 * @property int $quantity
 * @property float $unit_price
 * @property float $discount_amount
 * @property float $subtotal
 * @property \Illuminate\Support\Carbon|null $service_scheduled_at
 * @property int|null $service_duration_minutes
 * @property bool|null $service_is_onsite
 * @property string|null $service_address
 */
class VendorOrderItem extends Model
{
    protected $connection = ResiMartConnection::TENANT_CONNECTION;

    protected $table = 'order_items';

    protected $guarded = [];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'order_id' => 'integer',
            'product_id' => 'integer',
            'variant_id' => 'integer',
            'quantity' => 'integer',
            'unit_price' => 'float',
            'discount_amount' => 'float',
            'subtotal' => 'float',
            'service_scheduled_at' => 'datetime',
            'service_duration_minutes' => 'integer',
            'service_is_onsite' => 'boolean',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(VendorOrder::class, 'order_id');
    }

    public function save(array $options = []): bool
    {
        throw new \RuntimeException('VendorOrderItem is read-only.');
    }

    public function delete(): ?bool
    {
        throw new \RuntimeException('VendorOrderItem is read-only.');
    }
}
