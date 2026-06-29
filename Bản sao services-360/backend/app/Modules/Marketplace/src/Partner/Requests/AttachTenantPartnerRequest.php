<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\Partner\Requests;

use App\Common\Requests\BaseFormRequest;
use Illuminate\Validation\Rule;

class AttachTenantPartnerRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'project_ids' => ['required', 'array', 'min:1'],
            'project_ids.*' => ['integer', Rule::exists('projects', 'id')->whereNull('deleted_at')],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'project_ids.required' => 'Vui lòng chọn ít nhất một dự án.',
            'project_ids.min' => 'Vui lòng chọn ít nhất một dự án.',
            'project_ids.*.exists' => 'Dự án không tồn tại.',
        ];
    }
}
