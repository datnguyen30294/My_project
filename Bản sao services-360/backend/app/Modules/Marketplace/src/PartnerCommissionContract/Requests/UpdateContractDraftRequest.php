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

class UpdateContractDraftRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'partner_id' => [
                'sometimes',
                'required',
                'integer',
                Rule::exists(Partner::class, 'id')->whereNull('deleted_at'),
            ],
            'tenant_id' => [
                'sometimes',
                'required',
                'string',
                'max:100',
                Rule::exists(Organization::class, 'id')->whereNull('deleted_at'),
            ],
            'project_id' => ['sometimes', 'required', 'integer', 'min:1'],
            'commission_mode' => ['sometimes', 'required', Rule::in(CommissionMode::values())],
            'revenue_recipient' => ['sometimes', 'required', Rule::in(RevenueRecipient::values())],
            'starts_at' => ['sometimes', 'required', 'date'],
            'ends_at' => ['nullable', 'date', 'after:starts_at'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'contract_code' => ['nullable', 'string', 'max:50'],
            'terms' => ['sometimes', 'required', 'array', new ContractTermsRule],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'partner_id.exists' => 'Vendor không tồn tại.',
            'tenant_id.exists' => 'Tenant không tồn tại.',
            'commission_mode.in' => 'Loại hợp đồng không hợp lệ.',
            'revenue_recipient.in' => 'Người nhận doanh thu không hợp lệ.',
            'ends_at.after' => 'Ngày kết thúc phải sau ngày bắt đầu.',
        ];
    }
}
