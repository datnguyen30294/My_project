<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOrder\Resources;

use App\Common\Resources\BaseResource;
use App\Modules\Marketplace\VendorOrder\Enums\VendorOrderType;
use Illuminate\Http\Request;

/**
 * Resource expects an array shape (decorated by service, not raw model):
 * ```
 * [
 *   'order' => VendorOrder (with customer + items loaded),
 *   'project_name' => string,
 *   'type' => string|null,            // suy ra; nếu thiếu sẽ derive từ items
 *   'customer_source' => array|null,  // GĐ1: null (FE ẩn cột)
 *   'commission' => array{contract:..., formula:..., applied_at:...} | null,
 * ]
 * ```
 *
 * `commission = null` cho đơn chưa khớp hợp đồng per_order / chưa completed.
 * `resident_rating` chỉ điền khi caller bơm sẵn vào row (`$data['resident_rating']`);
 * console đơn-hàng-vendor hiện CHƯA surface từng-đơn (CSAT cư dân xem ở báo cáo
 * tổng hợp + console Quản lý Vendor, đọc `order_reviews` resi_mart).
 */
class VendorOrderListResource extends BaseResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var array{order: object, project_name: string, commission?: array|null} $data */
        $data = $this->resource;
        $order = $data['order'];
        $commission = $data['commission'] ?? null;

        $items = $order->items;
        $firstItem = $items->first();

        $type = isset($data['type'])
            ? (string) $data['type']
            : VendorOrderType::deriveFromItems($items)->value;
        $typeEnum = VendorOrderType::from($type);

        return [
            'id' => $order->id,
            'code' => $order->code,
            'type' => [
                'value' => $typeEnum->value,
                'label' => $typeEnum->label(),
            ],
            'vendor' => isset($data['vendor']) ? [
                'id' => $data['vendor']['id'],
                'name' => $data['vendor']['name'],
                'slug' => $data['vendor']['slug'],
            ] : null,
            'tenant' => isset($data['tenant']) ? [
                'id' => $data['tenant']['id'],
                'name' => $data['tenant']['name'],
            ] : null,
            'project_id' => $order->project_id,
            'project_name' => $data['project_name'],
            'customer' => $order->customer ? [
                'id' => $order->customer->id,
                'name' => $order->customer->full_name,
                'phone' => $order->customer->phone,
            ] : null,
            'customer_source' => $data['customer_source'] ?? null,
            'items_count' => $items->count(),
            'first_item_name' => $firstItem?->product_name,
            'total' => (float) $order->total,
            'status' => [
                'value' => $order->status->value,
                'label' => $order->status->label(),
            ],
            'completed_at' => $order->completed_at?->toIso8601String(),
            'created_at' => $order->created_at?->toIso8601String(),
            'commission' => $this->commissionPayload($commission),
            'resident_rating' => $data['resident_rating'] ?? null,
        ];
    }

    /**
     * Chuẩn hoá hoa hồng cho cả 2 nguồn: hợp đồng (caller tenant/per-vendor) và
     * override gán thủ công (console). Caller cũ truyền `['contract'=>Contract,
     * 'formula'=>...]`; console truyền thêm `recipient`/`amount`/`manual`/
     * `override_id`. `null` khi đơn chưa có hoa hồng.
     *
     * @param  array<string, mixed>|null  $commission
     * @return array<string, mixed>|null
     */
    private function commissionPayload(?array $commission): ?array
    {
        if ($commission === null) {
            return null;
        }

        $contract = $commission['contract'] ?? null;
        $recipient = $commission['recipient'] ?? ($contract?->revenue_recipient);
        $amount = (float) ($commission['amount'] ?? ($commission['formula']['total'] ?? 0));
        $isManual = (bool) ($commission['manual'] ?? false);
        $source = $commission['source'] ?? ($isManual ? 'manual' : ($contract !== null ? 'contract' : 'default'));

        return [
            'contract_id' => $contract?->id,
            'contract_code' => $commission['contract_code'] ?? $contract?->contract_code,
            'override_id' => $commission['override_id'] ?? null,
            'is_manual' => $isManual,
            'source' => $source,
            'amount' => $amount,
            'currency' => 'VND',
            'revenue_recipient' => $recipient === null ? null : [
                'value' => $recipient->value,
                'label' => $recipient->label(),
            ],
        ];
    }
}
