<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\PartnerProject\Resources;

use App\Common\Resources\BaseResource;
use App\Modules\Marketplace\Partner\Models\Partner;
use Illuminate\Http\Request;

/**
 * Resource expects a decorated array shape (built by the service):
 * ```
 * [
 *   'partner' => Partner,
 *   'enabled' => bool,
 *   'offer_count' => int,
 *   'order_count' => int,
 * ]
 * ```
 */
class ProjectVendorListResource extends BaseResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var array{partner: Partner, enabled: bool, offer_count: int, order_count: int} $data */
        $data = $this->resource;
        $partner = $data['partner'];

        return [
            'partner_id' => $partner->id,
            'code' => $partner->slug,
            'name' => $partner->display_name ?: $partner->name,
            'status' => [
                'value' => $partner->status->value,
                'label' => $partner->status->label(),
            ],
            'enabled' => $data['enabled'],
            'offer_count' => $data['offer_count'],
            'order_count' => $data['order_count'],
        ];
    }
}
