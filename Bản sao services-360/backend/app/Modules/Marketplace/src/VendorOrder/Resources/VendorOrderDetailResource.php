<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOrder\Resources;

use App\Common\Resources\BaseResource;
use Illuminate\Http\Request;

/**
 * Resource expects an array shape:
 * ```
 * [
 *   'order' => VendorOrder (with customer + items loaded),
 *   'project' => ['id' => int, 'name' => string],
 *   'commission' => array{contract:..., formula:..., applied_at:...} | null,
 * ]
 * ```
 */
class VendorOrderDetailResource extends BaseResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var array{order: object, project: array{id:int,name:string}, commission: array|null} $data */
        $data = $this->resource;
        $order = $data['order'];

        return [
            'id' => $order->id,
            'code' => $order->code,
            'tenant' => isset($data['tenant']) ? [
                'id' => $data['tenant']['id'],
                'name' => $data['tenant']['name'],
            ] : null,
            'project' => $data['project'],
            'customer' => $order->customer ? [
                'id' => $order->customer->id,
                'name' => $order->customer->full_name,
                'phone' => $order->customer->phone,
                'email' => $order->customer->email,
            ] : null,
            'contact' => [
                'name' => $order->contact_name,
                'phone' => $order->contact_phone,
                'email' => $order->contact_email,
                'apartment_code' => $order->apartment_code,
                'shipping_address' => $order->shipping_address,
            ],
            'status' => [
                'value' => $order->status->value,
                'label' => $order->status->label(),
            ],
            'payment_status' => [
                'value' => $order->payment_status->value,
                'label' => $order->payment_status->label(),
            ],
            'payment_method' => $order->payment_method,
            'amounts' => [
                'subtotal' => (float) $order->subtotal,
                'deposit_total' => (float) $order->deposit_total,
                'shipping_fee' => (float) $order->shipping_fee,
                'discount_total' => (float) $order->discount_total,
                'total' => (float) $order->total,
                'total_overridden' => (bool) $order->total_overridden,
            ],
            'timeline' => [
                'ordered_at' => $order->ordered_at?->toIso8601String(),
                'confirmed_at' => $order->confirmed_at?->toIso8601String(),
                'completed_at' => $order->completed_at?->toIso8601String(),
                'cancelled_at' => $order->cancelled_at?->toIso8601String(),
            ],
            'items' => VendorOrderItemResource::collection($order->items)->resolve(),
            'commission' => $data['commission'] === null
                ? null
                : (new VendorOrderCommissionResource($data['commission']))->resolve(),
        ];
    }
}
