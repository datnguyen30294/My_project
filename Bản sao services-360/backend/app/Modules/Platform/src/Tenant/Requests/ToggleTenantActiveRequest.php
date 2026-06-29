<?php

namespace App\Modules\Platform\Tenant\Requests;

use App\Common\Requests\BaseFormRequest;

class ToggleTenantActiveRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'is_active' => ['required', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'is_active.required' => 'Trạng thái kích hoạt là bắt buộc.',
            'is_active.boolean' => 'Trạng thái kích hoạt không hợp lệ.',
        ];
    }
}
