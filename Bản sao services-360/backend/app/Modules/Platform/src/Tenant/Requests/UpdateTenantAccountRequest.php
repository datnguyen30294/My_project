<?php

namespace App\Modules\Platform\Tenant\Requests;

use App\Common\Requests\BaseFormRequest;

/**
 * KHÔNG dùng Rule::unique/Rule::exists ở đây — validator chạy ở central
 * context nên query sai tenant schema. Các check unique email / exists FK
 * được thực hiện trong TenantAccountExternalService (bên trong $tenant->run()).
 */
class UpdateTenantAccountRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255'],
            'password' => ['sometimes', 'nullable', 'string', 'min:8'],
            'department_ids' => ['sometimes', 'required', 'array', 'min:1'],
            'department_ids.*' => ['integer'],
            'job_title_id' => ['sometimes', 'required', 'integer'],
            'role_id' => ['sometimes', 'required', 'integer'],
            'is_active' => ['sometimes', 'nullable', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Vui lòng nhập họ tên.',
            'name.max' => 'Họ tên không được vượt quá 255 ký tự.',
            'email.required' => 'Email là bắt buộc.',
            'email.email' => 'Email không hợp lệ.',
            'email.max' => 'Email không được vượt quá 255 ký tự.',
            'password.min' => 'Mật khẩu tối thiểu 8 ký tự.',
            'department_ids.required' => 'Vui lòng chọn phòng ban.',
            'department_ids.array' => 'Phòng ban không hợp lệ.',
            'department_ids.min' => 'Vui lòng chọn ít nhất một phòng ban.',
            'department_ids.*.integer' => 'Phòng ban không hợp lệ.',
            'job_title_id.required' => 'Vui lòng chọn chức danh.',
            'job_title_id.integer' => 'Chức danh không hợp lệ.',
            'role_id.required' => 'Vui lòng chọn vai trò.',
            'role_id.integer' => 'Vai trò không hợp lệ.',
        ];
    }
}
