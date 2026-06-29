<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOrder\Resources;

use App\Common\Resources\BaseResource;
use Illuminate\Http\Request;

/**
 * Wraps the commission breakdown array produced by
 * {@see \App\Modules\Marketplace\VendorOrder\Services\VendorOrderCommissionCalculator}.
 *
 * Resource expects `resource` to be an array:
 * ```
 * [
 *   'contract' => PartnerCommissionContract,
 *   'applied_at' => Carbon,
 *   'formula' => array{...},
 * ]
 * ```
 */
class VendorOrderCommissionResource extends BaseResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var array{contract?: object|null, recipient?: object|null, applied_at?: \Carbon\CarbonInterface|null, manual?: bool, override_id?: int|null, source?: string, formula: array<string,float|bool>} $data */
        $data = $this->resource;
        $contract = $data['contract'] ?? null;
        $recipient = $data['recipient'] ?? ($contract?->revenue_recipient);
        $formula = $data['formula'];
        $isManual = (bool) ($data['manual'] ?? false);
        $source = $data['source'] ?? ($isManual ? 'manual' : ($contract !== null ? 'contract' : 'default'));

        return [
            'contract' => $contract === null ? null : [
                'id' => $contract->id,
                'code' => $contract->contract_code,
                'mode' => [
                    'value' => $contract->commission_mode->value,
                    'label' => $contract->commission_mode->label(),
                ],
                'revenue_recipient' => [
                    'value' => $contract->revenue_recipient->value,
                    'label' => $contract->revenue_recipient->label(),
                ],
            ],
            'is_manual' => $isManual,
            'source' => $source,
            'override_id' => $data['override_id'] ?? null,
            'revenue_recipient' => $recipient === null ? null : [
                'value' => $recipient->value,
                'label' => $recipient->label(),
            ],
            'applied_at' => isset($data['applied_at']) ? $data['applied_at']?->toIso8601String() : null,
            'formula' => [
                'fixed' => (float) $formula['fixed'],
                'percent' => (float) $formula['percent'],
                'remainder_after_fixed' => (float) $formula['remainder_after_fixed'],
                'percent_amount' => (float) $formula['percent_amount'],
                'total' => (float) $formula['total'],
                'capped_at_total' => (bool) $formula['capped_at_total'],
            ],
            'amount' => (float) $formula['total'],
            'currency' => 'VND',
        ];
    }
}
