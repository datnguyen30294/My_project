<?php

namespace App\Modules\Platform\Tenant\Requests;

use App\Common\Requests\BaseFormRequest;
use App\Modules\Platform\Tenant\Enums\ServicePlan;
use Illuminate\Validation\Rule;

class UpdateOrganizationRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $tenantId = $this->route('id');

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'is_organization' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
            'domains' => ['sometimes', 'array'],
            'domains.*' => [
                'required',
                'string',
                'max:255',
                'distinct',
                Rule::unique('domains', 'domain')->where(fn ($q) => $q->where('tenant_id', '!=', $tenantId)),
            ],
            'tax_code' => ['sometimes', 'nullable', 'string', 'regex:/^\d{10}(\d{3})?$/'],
            'representative_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'contact_email' => ['sometimes', 'nullable', 'email', 'max:255'],
            'contact_phone' => ['sometimes', 'nullable', 'string', 'max:20'],
            'address' => ['sometimes', 'nullable', 'string', 'max:500'],
            'service_plan' => ['sometimes', 'nullable', Rule::enum(ServicePlan::class)],
            'notes' => ['sometimes', 'nullable', 'string', 'max:2000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Tên tenant là bắt buộc.',
            'name.max' => 'Tên tenant không được vượt quá 255 ký tự.',
            'domains.*.unique' => 'Domain :input đã được sử dụng bởi tenant khác.',
            'domains.*.distinct' => 'Danh sách domain không được trùng lặp.',
            'domains.*.max' => 'Domain không được vượt quá 255 ký tự.',
            'tax_code.regex' => 'Mã số thuế phải gồm 10 hoặc 13 chữ số.',
            'representative_name.max' => 'Tên người đại diện không được vượt quá 255 ký tự.',
            'contact_email.email' => 'Email liên hệ không hợp lệ.',
            'contact_email.max' => 'Email liên hệ không được vượt quá 255 ký tự.',
            'contact_phone.max' => 'Số điện thoại không được vượt quá 20 ký tự.',
            'address.max' => 'Địa chỉ không được vượt quá 500 ký tự.',
            'service_plan.enum' => 'Gói dịch vụ không hợp lệ.',
            'notes.max' => 'Ghi chú không được vượt quá 2000 ký tự.',
        ];
    }
}
