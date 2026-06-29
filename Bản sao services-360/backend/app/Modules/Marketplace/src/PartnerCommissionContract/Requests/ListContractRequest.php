<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\PartnerCommissionContract\Requests;

use App\Common\Requests\BaseFormRequest;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\CommissionMode;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\ContractStatus;
use Illuminate\Validation\Rule;

class ListContractRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'partner_id' => ['nullable', 'integer'],
            'tenant_id' => ['nullable', 'string', 'max:100'],
            'project_id' => ['nullable', 'integer'],
            'status' => ['nullable', Rule::in(ContractStatus::values())],
            'commission_mode' => ['nullable', Rule::in(CommissionMode::values())],
            'search' => ['nullable', 'string', 'max:255'],
            'sort_by' => ['nullable', 'string', 'in:created_at,updated_at,starts_at,ends_at,contract_code,status'],
            'sort_direction' => ['nullable', 'string', 'in:asc,desc'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
