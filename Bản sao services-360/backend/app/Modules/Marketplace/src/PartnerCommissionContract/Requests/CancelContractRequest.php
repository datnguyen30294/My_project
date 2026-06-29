<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\PartnerCommissionContract\Requests;

use App\Common\Requests\BaseFormRequest;

class CancelContractRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'cancellation_reason' => ['required', 'string', 'max:1000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'cancellation_reason.required' => 'Vui lòng nhập lý do huỷ hợp đồng.',
            'cancellation_reason.max' => 'Lý do huỷ không vượt quá 1000 ký tự.',
        ];
    }
}
