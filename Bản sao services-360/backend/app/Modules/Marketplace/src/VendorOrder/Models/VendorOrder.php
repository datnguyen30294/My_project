<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOrder\Models;

use App\Modules\Marketplace\VendorOrder\Enums\VendorOrderPaymentStatus;
use App\Modules\Marketplace\VendorOrder\Enums\VendorOrderStatus;
use App\Modules\Marketplace\VendorOrder\Support\ResiMartConnection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * Read-only model trỏ vào schema `tenant_<vendor_slug>` ở resi_mart DB.
 * Trước khi truy vấn, gọi {@see ResiMartConnection::switchToTenant()}.
 *
 * @property int $id
 * @property string $code
 * @property int|null $project_id
 * @property string|null $tenant_id PMC operator slug (cross-DB ref)
 * @property int|null $customer_id
 * @property VendorOrderStatus $status
 * @property VendorOrderPaymentStatus $payment_status
 * @property string|null $payment_method
 * @property string|null $contact_name
 * @property string|null $contact_phone
 * @property string|null $contact_email
 * @property string|null $apartment_code
 * @property string|null $shipping_address
 * @property float $subtotal
 * @property float $deposit_total
 * @property float $discount_total
 * @property float $shipping_fee
 * @property float $total
 * @property bool $total_overridden
 * @property \Illuminate\Support\Carbon|null $ordered_at
 * @property \Illuminate\Support\Carbon|null $confirmed_at
 * @property \Illuminate\Support\Carbon|null $completed_at
 * @property \Illuminate\Support\Carbon|null $cancelled_at
 * @property string|null $cancel_reason
 */
class VendorOrder extends Model
{
    protected $connection = ResiMartConnection::TENANT_CONNECTION;

    protected $table = 'orders';

    /** Read-only — không cho mass-assign. */
    protected $guarded = [];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'project_id' => 'integer',
            'tenant_id' => 'string',
            'customer_id' => 'integer',
            'status' => VendorOrderStatus::class,
            'payment_status' => VendorOrderPaymentStatus::class,
            'subtotal' => 'float',
            'deposit_total' => 'float',
            'discount_total' => 'float',
            'shipping_fee' => 'float',
            'total' => 'float',
            'total_overridden' => 'boolean',
            'ordered_at' => 'datetime',
            'confirmed_at' => 'datetime',
            'completed_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    public function items(): HasMany
    {
        return $this->hasMany(VendorOrderItem::class, 'order_id');
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(VendorCustomer::class, 'customer_id');
    }

    /**
     * Đánh giá cư dân ĐÃ PUBLISH cho đơn này (1 review / đơn, ràng buộc unique
     * trên `order_reviews.order_id`). Review bị ẩn (`hidden`) hoặc soft-delete
     * không tính vào CSAT.
     */
    public function review(): HasOne
    {
        return $this->hasOne(VendorOrderReview::class, 'order_id')
            ->where('status', 'published');
    }

    public function save(array $options = []): bool
    {
        throw new \RuntimeException('VendorOrder is read-only.');
    }

    public function delete(): ?bool
    {
        throw new \RuntimeException('VendorOrder is read-only.');
    }
}
