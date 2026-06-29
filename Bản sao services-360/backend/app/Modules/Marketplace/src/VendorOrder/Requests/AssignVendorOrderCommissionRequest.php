<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOrder\Requests;

use App\Common\Requests\BaseFormRequest;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\RevenueRecipient;
use App\Modules\Marketplace\PartnerCommissionContract\Models\PartnerCommissionContract;
use Illuminate\Validation\Rule;

/**
 * Console Platform — gán hoa hồng thủ công cho 1 đơn vendor mồ côi.
 * `source=contract`: copy điều khoản từ 1 hợp đồng per_order có sẵn.
 * `source=manual`: nhập tay tiền cứng / phần trăm + người nhận.
 */
class AssignVendorOrderCommissionRequest extends BaseFormRequest
{
    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'source' => ['required', Rule::in(['contract', 'manual'])],
            'contract_id' => [
                'required_if:source,contract',
                'integer',
                Rule::exists(PartnerCommissionContract::class, 'id')->whereNull('deleted_at'),
            ],
            'fixed' => ['required_if:source,manual', 'numeric', 'min:0'],
            'percent' => ['required_if:source,manual', 'numeric', 'min:0', 'max:100'],
            'revenue_recipient' => ['required_if:source,manual', Rule::in(RevenueRecipient::values())],
            'note' => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'source.in' => 'Nguồn hoa hồng không hợp lệ.',
            'contract_id.required_if' => 'Vui lòng chọn hợp đồng.',
            'contract_id.exists' => 'Hợp đồng không tồn tại.',
            'fixed.required_if' => 'Vui lòng nhập tiền cứng.',
            'percent.required_if' => 'Vui lòng nhập phần trăm.',
            'percent.max' => 'Phần trăm tối đa 100.',
            'revenue_recipient.required_if' => 'Vui lòng chọn bên nhận hoa hồng.',
            'revenue_recipient.in' => 'Bên nhận hoa hồng không hợp lệ.',
        ];
    }
}
