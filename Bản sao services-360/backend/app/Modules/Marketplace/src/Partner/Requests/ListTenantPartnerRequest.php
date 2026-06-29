<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\Partner\Requests;

use App\Common\Requests\BaseFormRequest;
use App\Modules\Marketplace\Partner\Enums\PartnerStatus;
use Illuminate\Validation\Rule;

class ListTenantPartnerRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', Rule::in(PartnerStatus::values())],
            'category' => ['nullable', 'string', 'max:100'],
            'provisioned' => ['nullable', 'boolean'],
            'sort_by' => ['nullable', 'string', 'in:created_at,updated_at,name,slug,status'],
            'sort_direction' => ['nullable', 'string', 'in:asc,desc'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
