<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\Partner\Resources;

use App\Common\Resources\BaseResource;
use App\Modules\Marketplace\Partner\Models\Partner;
use Illuminate\Http\Request;

/**
 * @mixin Partner
 */
class PartnerListResource extends BaseResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            /** @var int */
            'id' => $this->id,
            /** @var string */
            'slug' => $this->slug,
            /** @var string|null */
            'tenant_id' => $this->tenant_id,
            /** @var string */
            'name' => $this->name,
            /** @var string|null */
            'display_name' => $this->display_name,
            /** @var array{value: string, label: string} */
            'status' => [
                'value' => $this->status->value,
                'label' => $this->status->label(),
            ],
            /** @var string|null */
            'custom_domain' => $this->custom_domain,
            /** @var list<string> */
            'categories' => $this->categories ?? [],
            /** @var string|null */
            'logo_url' => $this->logo_url,
            /** @var bool */
            'is_provisioned' => $this->tenant_id !== null,
            /** @var string|null */
            'owner_tenant_id' => $this->owner_tenant_id,
            /** @var array{value: string, label: string} */
            'owner_source' => $this->owner_tenant_id === null
                ? ['value' => 'platform', 'label' => 'Platform admin']
                : ['value' => 'tenant', 'label' => 'PMC tenant'],
            /** @var string|null */
            'created_at' => $this->created_at?->toIso8601String(),
            /** @var string|null */
            'updated_at' => $this->updated_at?->toIso8601String(),
            ...(array_key_exists('is_linked', $this->resource->getAttributes())
                /** @var bool */
                ? ['is_linked' => (bool) $this->resource->getAttribute('is_linked')]
                : []),
            ...$this->statsFields(),
        ];
    }

    /**
     * Aggregate fields emitted only when the row was decorated for the console
     * list (`?include=stats`). `rating` is the resident-review aggregate from
     * resi_mart (`{avg, count}`), null when the vendor has no published reviews.
     *
     * @return array<string, mixed>
     */
    private function statsFields(): array
    {
        if (! array_key_exists('project_count', $this->resource->getAttributes())) {
            return [];
        }

        return [
            /** @var int */
            'project_count' => (int) $this->resource->getAttribute('project_count'),
            /** @var int */
            'offer_count' => (int) $this->resource->getAttribute('offer_count'),
            /** @var int */
            'order_count' => (int) $this->resource->getAttribute('order_count'),
            /** @var array{avg: float, count: int}|null */
            'rating' => $this->resource->getAttribute('rating'),
            /** @var array{id: string, name: string|null}|null */
            'owner_tenant' => $this->resource->getAttribute('owner_tenant'),
        ];
    }
}
