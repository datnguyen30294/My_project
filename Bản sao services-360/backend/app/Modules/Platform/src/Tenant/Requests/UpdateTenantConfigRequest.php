<?php

namespace App\Modules\Platform\Tenant\Requests;

use App\Common\Requests\BaseFormRequest;
use App\Modules\Platform\Tenant\Enums\SubscriptionCycle;
use App\Modules\Platform\Tenant\Enums\TenantFeeMode;
use App\Modules\Platform\Tenant\Enums\TenantModule;
use Illuminate\Validation\Rule;

class UpdateTenantConfigRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'max_projects' => ['sometimes', 'integer', 'min:1', 'max:1000'],
            'max_accounts' => ['sometimes', 'integer', 'min:1', 'max:10000'],
            'session_timeout_minutes' => ['sometimes', 'integer', 'min:15', 'max:10080'],
            'resident_portal_enabled' => ['sometimes', 'boolean'],
            'partner_portal_enabled' => ['sometimes', 'boolean'],
            'fee_mode' => ['sometimes', Rule::enum(TenantFeeMode::class)],
            'subscription_cycle' => ['sometimes', Rule::enum(SubscriptionCycle::class)],
            'subscription_amount' => ['sometimes', 'numeric', 'min:0'],
            'fixed_fee_per_order' => ['sometimes', 'numeric', 'min:0'],
            'percent_fee_per_order' => ['sometimes', 'numeric', 'min:0', 'max:100'],
            'enabled_modules' => ['sometimes', 'nullable', 'array'],
            'enabled_modules.*' => ['string', Rule::in(TenantModule::values())],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'max_projects.integer' => 'Giới hạn dự án phải là số nguyên.',
            'max_projects.min' => 'Giới hạn dự án tối thiểu là 1.',
            'max_projects.max' => 'Giới hạn dự án tối đa là 1000.',
            'max_accounts.integer' => 'Giới hạn tài khoản phải là số nguyên.',
            'max_accounts.min' => 'Giới hạn tài khoản tối thiểu là 1.',
            'max_accounts.max' => 'Giới hạn tài khoản tối đa là 10000.',
            'session_timeout_minutes.integer' => 'Thời gian phiên phải là số nguyên (phút).',
            'session_timeout_minutes.min' => 'Thời gian phiên tối thiểu là 15 phút.',
            'session_timeout_minutes.max' => 'Thời gian phiên tối đa là 10080 phút.',
            'fee_mode.enum' => 'Hình thức thu phí không hợp lệ.',
            'subscription_cycle.enum' => 'Chu kỳ gói không hợp lệ.',
            'subscription_amount.numeric' => 'Mức phí gói phải là số.',
            'subscription_amount.min' => 'Mức phí gói không được âm.',
            'fixed_fee_per_order.numeric' => 'Phí cố định mỗi đơn phải là số.',
            'fixed_fee_per_order.min' => 'Phí cố định mỗi đơn không được âm.',
            'percent_fee_per_order.numeric' => 'Phí phần trăm mỗi đơn phải là số.',
            'percent_fee_per_order.min' => 'Phí phần trăm mỗi đơn không được âm.',
            'percent_fee_per_order.max' => 'Phí phần trăm mỗi đơn tối đa là 100.',
            'enabled_modules.array' => 'Danh sách module không hợp lệ.',
            'enabled_modules.*.in' => 'Module :input không hợp lệ.',
        ];
    }
}
