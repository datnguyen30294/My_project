<?php

namespace App\Modules\Platform\Tenant\Resources;

use App\Common\Resources\BaseResource;
use Illuminate\Http\Request;

/**
 * Cấu hình phí nền tảng theo dự án. Wrap array thuần do PlatformProjectService
 * trả về: cờ kế thừa + override thô + cấu hình hiệu lực (đã resolve) +
 * mặc định tenant để FE render switch.
 */
class ProjectFeeConfigResource extends BaseResource
{
    /**
     * @return array{
     *     inherit_default: bool,
     *     platform_service_enabled: bool,
     *     notes: string|null,
     *     override: array{
     *         fee_mode: array{value: string, label: string}|null,
     *         fixed_fee_per_order: string,
     *         percent_fee_per_order: string,
     *         subscription_amount: string,
     *         subscription_cycle: array{value: string, label: string}|null,
     *     },
     *     effective: array{
     *         fee_mode: array{value: string, label: string},
     *         fixed_fee_per_order: string,
     *         percent_fee_per_order: string,
     *     },
     *     tenant_default: array{
     *         fee_mode: array{value: string, label: string},
     *         fixed_fee_per_order: string,
     *         percent_fee_per_order: string,
     *     },
     * }
     */
    public function toArray(Request $request): array
    {
        return [
            /** @var bool */
            'inherit_default' => $this['inherit_default'],
            /** @var bool */
            'platform_service_enabled' => $this['platform_service_enabled'],
            /** @var string|null */
            'notes' => $this['notes'],
            /** @var array{fee_mode: array{value: string, label: string}|null, fixed_fee_per_order: string, percent_fee_per_order: string, subscription_amount: string, subscription_cycle: array{value: string, label: string}|null} */
            'override' => $this['override'],
            /** @var array{fee_mode: array{value: string, label: string}, fixed_fee_per_order: string, percent_fee_per_order: string} */
            'effective' => $this['effective'],
            /** @var array{fee_mode: array{value: string, label: string}, fixed_fee_per_order: string, percent_fee_per_order: string} */
            'tenant_default' => $this['tenant_default'],
        ];
    }
}
