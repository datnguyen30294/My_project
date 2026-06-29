<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOrder\Models;

use App\Modules\Marketplace\VendorOrder\Support\ResiMartConnection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Read-only model trỏ vào bảng `order_reviews` ở schema `tenant_<vendor_slug>`
 * của resi_mart DB (đánh giá cư dân cho một đơn marketplace, 1 review / đơn).
 * Trước khi truy vấn, caller phải switch search_path qua
 * {@see ResiMartConnection::runInTenantSchema()}.
 *
 * @property int $id
 * @property int $order_id
 * @property int|null $customer_id
 * @property string|null $reviewer_name
 * @property int $rating 1-5
 * @property string|null $title
 * @property string|null $content
 * @property string $status 'published' | 'hidden'
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class VendorOrderReview extends Model
{
    use SoftDeletes;

    protected $connection = ResiMartConnection::TENANT_CONNECTION;

    protected $table = 'order_reviews';

    /** Read-only — không cho mass-assign. */
    protected $guarded = [];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'order_id' => 'integer',
            'customer_id' => 'integer',
            'rating' => 'integer',
            'status' => 'string',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(VendorOrder::class, 'order_id');
    }

    public function save(array $options = []): bool
    {
        throw new \RuntimeException('VendorOrderReview is read-only.');
    }

    public function delete(): ?bool
    {
        throw new \RuntimeException('VendorOrderReview is read-only.');
    }
}
