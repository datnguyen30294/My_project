<?php

namespace App\Modules\Platform\Tenant\Requests;

use App\Common\Requests\BaseFormRequest;
use App\Modules\PMC\Project\Enums\ProjectStatus;
use Illuminate\Validation\Rule;

class ListPlatformProjectRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'string', Rule::in(ProjectStatus::values())],
            'organization_id' => ['nullable', 'string', Rule::exists('tenants', 'id')],
            'platform_service_enabled' => ['nullable', 'boolean'],
            'sort_by' => ['nullable', 'string', 'in:name,code,status'],
            'sort_direction' => ['nullable', 'string', 'in:asc,desc'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'status.in' => 'Trạng thái dự án không hợp lệ.',
            'organization_id.exists' => 'Công ty vận hành không tồn tại.',
        ];
    }
}
