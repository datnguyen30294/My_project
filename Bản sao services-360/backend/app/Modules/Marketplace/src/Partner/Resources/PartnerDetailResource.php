<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\Partner\Resources;

use App\Common\Resources\BaseResource;
use App\Modules\Marketplace\Partner\Models\Partner;
use Illuminate\Http\Request;

/**
 * @mixin Partner
 */
class PartnerDetailResource extends BaseResource
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
            /** @var string */
            'owner_email' => $this->owner_email,
            /** @var string|null */
            'owner_phone' => $this->owner_phone,
            /** @var string|null */
            'logo_url' => $this->logo_url,
            /** @var string|null */
            'description' => $this->description,
            /** @var bool */
            'is_provisioned' => $this->tenant_id !== null,
            /** @var string|null */
            'owner_tenant_id' => $this->owner_tenant_id,
            /** @var array{value: string, label: string} */
            'owner_source' => $this->owner_tenant_id === null
                ? ['value' => 'platform', 'label' => 'Platform admin']
                : ['value' => 'tenant', 'label' => 'PMC tenant'],
            /** @var bool */
            'is_owned' => $this->isOwnedByCurrentTenant(),
            /** @var list<int> */
            'project_ids' => is_array($this->project_ids ?? null) ? array_values($this->project_ids) : [],
            ...(array_key_exists('projects', $this->resource->getAttributes())
                /** @var list<array<string, mixed>> */
                ? ['projects' => $this->resource->getAttribute('projects')]
                : []),
            /** @var int|null */
            'created_by' => $this->created_by,
            /** @var int|null */
            'updated_by' => $this->updated_by,
            /** @var string|null */
            'created_at' => $this->created_at?->toIso8601String(),
            /** @var string|null */
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }

    /**
     * Whether the vendor belongs to the tenant making this request. Used by the
     * tenant UI to gate edit/delete actions — shared (platform/other-tenant)
     * vendors are read-only for a tenant even though they may be linked to
     * projects. Always false outside tenant context (e.g. platform admin).
     */
    protected function isOwnedByCurrentTenant(): bool
    {
        if ($this->owner_tenant_id === null) {
            return false;
        }

        $currentTenantId = function_exists('tenant') ? tenant()?->getTenantKey() : null;

        return $currentTenantId !== null && $this->owner_tenant_id === $currentTenantId;
    }
}
