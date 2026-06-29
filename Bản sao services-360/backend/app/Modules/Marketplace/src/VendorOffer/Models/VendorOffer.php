<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOffer\Models;

use App\Modules\Marketplace\VendorOffer\Enums\VendorOfferStatus;
use App\Modules\Marketplace\VendorOffer\Enums\VendorOfferType;
use App\Modules\Marketplace\VendorOrder\Support\ResiMartConnection;
use Illuminate\Database\Eloquent\Model;

/**
 * Read-only model pointing at the `products` table inside schema
 * `tenant_<vendor_slug>` of the resi_mart DB. The caller MUST switch the
 * connection's search_path first (see {@see ResiMartConnection}).
 *
 * A vendor "offer" (gói) is one product/rental/service row in the vendor's
 * resi_mart catalog.
 *
 * @property int $id
 * @property VendorOfferType $type
 * @property string $name
 * @property string $sku
 * @property string|null $unit
 * @property float $price
 * @property VendorOfferStatus $status
 * @property \Illuminate\Support\Carbon|null $published_at
 */
class VendorOffer extends Model
{
    protected $connection = ResiMartConnection::TENANT_CONNECTION;

    protected $table = 'products';

    /** Read-only — never mass-assign. */
    protected $guarded = [];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => VendorOfferType::class,
            'status' => VendorOfferStatus::class,
            'price' => 'float',
            'compare_price' => 'float',
            'has_variants' => 'boolean',
            'is_featured' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    public function save(array $options = []): bool
    {
        throw new \RuntimeException('VendorOffer is read-only.');
    }

    public function delete(): ?bool
    {
        throw new \RuntimeException('VendorOffer is read-only.');
    }
}
