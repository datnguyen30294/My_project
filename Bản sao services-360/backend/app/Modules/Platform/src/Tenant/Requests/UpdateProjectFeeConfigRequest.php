<?php

namespace App\Modules\Platform\Tenant\Requests;

use App\Common\Requests\BaseFormRequest;
use App\Modules\Platform\Tenant\Enums\SubscriptionCycle;
use App\Modules\Platform\Tenant\Enums\TenantFeeMode;
use Illuminate\Validation\Rule;

class UpdateProjectFeeConfigRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'inherit_default' => ['required', 'boolean'],
            'fee_mode' => ['required_if:inherit_default,false', 'nullable', Rule::in(TenantFeeMode::values())],
            'fixed_fee_per_order' => ['nullable', 'numeric', 'min:0'],
            'percent_fee_per_order' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'subscription_amount' => ['nullable', 'numeric', 'min:0'],
            'subscription_cycle' => ['nullable', Rule::in(SubscriptionCycle::values())],
            'platform_service_enabled' => ['required', 'boolean'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'inherit_default.required' => 'Vui lòng chọn có kế thừa cấu hình mặc định hay không.',
            'fee_mode.required_if' => 'Vui lòng chọn hình thức thu phí khi không kế thừa cấu hình mặc định.',
            'fee_mode.in' => 'Hình thức thu phí không hợp lệ.',
            'fixed_fee_per_order.numeric' => 'Phí cố định không hợp lệ.',
            'fixed_fee_per_order.min' => 'Phí cố định không hợp lệ.',
            'percent_fee_per_order.min' => 'Phí % phải từ 0 đến 100.',
            'percent_fee_per_order.max' => 'Phí % phải từ 0 đến 100.',
            'subscription_cycle.in' => 'Chu kỳ gói không hợp lệ.',
            'platform_service_enabled.required' => 'Vui lòng chọn trạng thái cung cấp dịch vụ.',
        ];
    }
}
