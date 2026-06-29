<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\PartnerCommissionContract\Resources;

use App\Common\Resources\BaseResource;
use App\Modules\Marketplace\PartnerCommissionContract\Models\PartnerCommissionContract;
use Illuminate\Http\Request;

/**
 * @mixin PartnerCommissionContract
 */
class ContractDetailResource extends BaseResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $effectiveStatus = $this->getCurrentStatus();

        return [
            /** @var int */
            'id' => $this->id,
            /** @var string */
            'contract_code' => $this->contract_code,
            /** @var array{id: int, name: string, slug: string}|null */
            'partner' => $this->whenLoaded('partner', fn () => [
                /** @var int */
                'id' => $this->partner->id,
                /** @var string */
                'name' => $this->partner->name,
                /** @var string */
                'slug' => $this->partner->slug,
            ]),
            /** @var int */
            'partner_id' => $this->partner_id,
            /** @var string */
            'tenant_id' => $this->tenant_id,
            /** @var int */
            'project_id' => $this->project_id,
            /** @var string|null Resolved cross-tenant (chỉ có ở platform scope). */
            'tenant_name' => $this->tenant_name,
            /** @var string|null Resolved cross-tenant (chỉ có ở platform scope). */
            'project_name' => $this->project_name,
            /** @var array{value: string, label: string} */
            'commission_mode' => [
                'value' => $this->commission_mode->value,
                'label' => $this->commission_mode->label(),
            ],
            /** @var array{value: string, label: string} */
            'revenue_recipient' => [
                'value' => $this->revenue_recipient->value,
                'label' => $this->revenue_recipient->label(),
            ],
            /** @var array{value: string, label: string, color: string} */
            'status' => [
                'value' => $effectiveStatus->value,
                'label' => $effectiveStatus->label(),
                'color' => $effectiveStatus->color(),
            ],
            /** @var array{value: string, label: string} */
            'created_scope' => [
                'value' => $this->created_scope->value,
                'label' => $this->created_scope->label(),
            ],
            /** @var array<string, mixed> */
            'terms' => $this->terms ?? [],
            /** @var string|null */
            'starts_at' => $this->starts_at?->toIso8601String(),
            /** @var string|null */
            'ends_at' => $this->ends_at?->toIso8601String(),
            /** @var string|null */
            'activated_at' => $this->activated_at?->toIso8601String(),
            /** @var string|null */
            'replaced_at' => $this->replaced_at?->toIso8601String(),
            /** @var int|null */
            'replaced_by_contract_id' => $this->replaced_by_contract_id,
            /** @var string|null */
            'cancelled_at' => $this->cancelled_at?->toIso8601String(),
            /** @var int|null */
            'cancelled_by' => $this->cancelled_by,
            /** @var string|null */
            'cancellation_reason' => $this->cancellation_reason,
            /** @var string|null */
            'signed_at' => $this->signed_at?->toIso8601String(),
            /** @var int|null */
            'signed_by' => $this->signed_by,
            /** @var string|null */
            'notes' => $this->notes,
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
}
