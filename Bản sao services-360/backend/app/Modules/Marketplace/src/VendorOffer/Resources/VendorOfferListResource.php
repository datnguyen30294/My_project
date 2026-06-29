<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOffer\Resources;

use App\Common\Resources\BaseResource;
use App\Modules\Marketplace\VendorOffer\Models\VendorOffer;
use Illuminate\Http\Request;

/**
 * @mixin VendorOffer
 */
class VendorOfferListResource extends BaseResource
{
    /**
     * @return array{
     *     id: int,
     *     name: string,
     *     sku: string,
     *     type: array{value: string, label: string},
     *     price: float,
     *     unit: string|null,
     *     status: array{value: string, label: string, color: string},
     *     published_at: string|null,
     *     tenant_id: string|null,
     *     tenant_name: string|null,
     *     project_id: int|null,
     *     project_name: string|null,
     *     is_active: bool|null,
     * }
     */
    public function toArray(Request $request): array
    {
        $tenantId = $this->getAttribute('link_tenant_id');
        $projectId = $this->getAttribute('link_project_id');
        $isActive = $this->getAttribute('link_is_active');

        return [
            /** @var int */
            'id' => $this->id,
            'name' => $this->name,
            'sku' => $this->sku,
            'type' => [
                'value' => $this->type->value,
                'label' => $this->type->label(),
            ],
            /** @var float */
            'price' => (float) $this->price,
            'unit' => $this->unit,
            'status' => [
                'value' => $this->status->value,
                'label' => $this->status->label(),
                'color' => $this->status->color(),
            ],
            'published_at' => $this->published_at?->toIso8601String(),
            'tenant_id' => $tenantId === null || $tenantId === '' ? null : (string) $tenantId,
            'tenant_name' => $this->getAttribute('tenant_name'),
            'project_id' => $projectId === null ? null : (int) $projectId,
            'project_name' => $this->getAttribute('project_name'),
            'is_active' => $isActive === null ? null : (bool) $isActive,
        ];
    }
}
