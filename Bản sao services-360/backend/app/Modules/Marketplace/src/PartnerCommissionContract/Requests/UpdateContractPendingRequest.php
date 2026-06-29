<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\PartnerCommissionContract\Requests;

use App\Common\Requests\BaseFormRequest;
use App\Modules\Marketplace\PartnerCommissionContract\Exceptions\ContractImmutableException;

class UpdateContractPendingRequest extends BaseFormRequest
{
    /**
     * Non-financial editable fields on a pending contract.
     */
    private const ALLOWED_FIELDS = ['contract_code', 'notes'];

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $disallowed = array_diff(array_keys($this->all()), self::ALLOWED_FIELDS);

        if ($disallowed !== []) {
            throw new ContractImmutableException(
                message: 'Hợp đồng đã ký không thể sửa các điều khoản tài chính.',
                context: ['disallowed_fields' => array_values($disallowed)],
            );
        }

        return [
            'contract_code' => ['nullable', 'string', 'max:50'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
