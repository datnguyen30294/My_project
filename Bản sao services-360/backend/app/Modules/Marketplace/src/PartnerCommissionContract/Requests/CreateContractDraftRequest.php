<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\PartnerCommissionContract\Requests;

use App\Common\Requests\BaseFormRequest;
use App\Modules\Marketplace\Partner\Models\Partner;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\CommissionMode;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\RevenueRecipient;
use App\Modules\Marketplace\PartnerCommissionContract\Rules\ContractTermsRule;
use App\Modules\Platform\Tenant\Models\Organization;
use Illuminate\Validation\Rule;

class CreateContractDraftRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'partner_id' => [
                'required',
                'integer',
                Rule::exists(Partner::class, 'id')->whereNull('deleted_at'),
            ],
            'tenant_id' => [
                'required',
                'string',
                'max:100',
                Rule::exists(Organization::class, 'id')->whereNull('deleted_at'),
            ],
            'project_id' => ['required', 'integer', 'min:1'],
            'commission_mode' => ['required', Rule::in(CommissionMode::values())],
            'revenue_recipient' => ['nullable', Rule::in(RevenueRecipient::values())],
            'starts_at' => ['required', 'date', 'after_or_equal:today'],
            'ends_at' => ['nullable', 'date', 'after:starts_at'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'contract_code' => ['nullable', 'string', 'max:50'],
            'terms' => ['required', 'array', new ContractTermsRule],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'partner_id.required' => 'Vui lòng chọn vendor.',
            'partner_id.exists' => 'Vendor không tồn tại.',
            'tenant_id.required' => 'Vui lòng chọn tenant.',
            'tenant_id.exists' => 'Tenant không tồn tại.',
            'project_id.required' => 'Vui lòng chọn dự án.',
            'commission_mode.required' => 'Vui lòng chọn loại hợp đồng.',
            'commission_mode.in' => 'Loại hợp đồng không hợp lệ.',
            'revenue_recipient.in' => 'Người nhận doanh thu không hợp lệ.',
            'starts_at.required' => 'Vui lòng nhập ngày bắt đầu.',
            'starts_at.after_or_equal' => 'Ngày bắt đầu không được trong quá khứ.',
            'ends_at.after' => 'Ngày kết thúc phải sau ngày bắt đầu.',
            'terms.required' => 'Thiếu điều khoản hợp đồng.',
        ];
    }
}
