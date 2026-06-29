<?php

namespace App\Modules\Platform\Tenant\Requests;

use App\Common\Requests\BaseFormRequest;
use App\Modules\Platform\Tenant\Enums\ServicePlan;
use Illuminate\Validation\Rule;

class CreateOrganizationRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'id' => ['required', 'string', 'min:2', 'max:50', 'regex:/^[a-z0-9][a-z0-9_-]*$/', 'unique:tenants,id'],
            'name' => ['required', 'string', 'max:255'],
            'is_organization' => ['nullable', 'boolean'],
            'is_active' => ['nullable', 'boolean'],
            'domains' => ['nullable', 'array'],
            'domains.*' => ['required', 'string', 'max:255', 'distinct', 'unique:domains,domain'],
            'tax_code' => ['nullable', 'string', 'regex:/^\d{10}(\d{3})?$/'],
            'representative_name' => ['nullable', 'string', 'max:255'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
            'service_plan' => ['nullable', Rule::enum(ServicePlan::class)],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'id.required' => 'Mã tenant là bắt buộc.',
            'id.regex' => 'Mã tenant chỉ chứa chữ thường, số, dấu gạch ngang/gạch dưới và phải bắt đầu bằng chữ hoặc số.',
            'id.unique' => 'Mã tenant đã tồn tại.',
            'id.max' => 'Mã tenant không được vượt quá 50 ký tự.',
            'name.required' => 'Tên tenant là bắt buộc.',
            'name.max' => 'Tên tenant không được vượt quá 255 ký tự.',
            'domains.*.unique' => 'Domain :input đã được sử dụng.',
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
