<?php

namespace App\Modules\Platform\Tenant\Resources;

use App\Common\Resources\BaseResource;
use App\Modules\Platform\Tenant\Models\Organization;
use Illuminate\Http\Request;

/**
 * @mixin Organization
 */
class OrganizationDetailResource extends BaseResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            /** @var string */
            'id' => $this->id,
            /** @var string */
            'name' => $this->name,
            /** @var bool */
            'is_organization' => (bool) $this->is_organization,
            /** @var bool */
            'is_active' => (bool) $this->is_active,
            /** @var bool */
            'is_vendor_enabled' => (bool) ($this->is_vendor_enabled ?? false),
            /** @var string|null */
            'tax_code' => $this->tax_code,
            /** @var string|null */
            'representative_name' => $this->representative_name,
            /** @var string|null */
            'contact_email' => $this->contact_email,
            /** @var string|null */
            'contact_phone' => $this->contact_phone,
            /** @var string|null */
            'address' => $this->address,
            /** @var array{value: string, label: string}|null */
            'service_plan' => $this->service_plan !== null
                ? ['value' => $this->service_plan->value, 'label' => $this->service_plan->label()]
                : null,
            /** @var string|null */
            'notes' => $this->notes,
            /** @var list<string> */
            'domains' => $this->whenLoaded('domains', fn () => $this->domains->pluck('domain')->all(), []),
            /** @var string */
            'schema_name' => $this->schemaName(),
            'config' => new TenantConfigResource($this->whenLoaded('config')),
            /** @var string|null */
            'created_at' => $this->created_at?->toIso8601String(),
            /** @var string|null */
            'updated_at' => $this->updated_at?->toIso8601String(),
            /** @var string|null */
            'deleted_at' => $this->deleted_at?->toIso8601String(),
        ];
    }
}
