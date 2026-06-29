<?php

namespace App\Modules\Platform\Tenant\Requests;

use App\Common\Requests\BaseFormRequest;
use App\Modules\PMC\Project\Enums\ProjectStatus;
use Illuminate\Validation\Rule;

class CreatePlatformProjectRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:50'],
            'name' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'string', Rule::in(ProjectStatus::values())],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'code.required' => 'Mã dự án không được để trống.',
            'name.required' => 'Tên dự án không được để trống.',
            'status.in' => 'Trạng thái dự án không hợp lệ.',
        ];
    }
}
