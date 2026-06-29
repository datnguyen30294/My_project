<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\Partner\Requests;

use App\Common\Requests\BaseFormRequest;
use App\Modules\Marketplace\Partner\Enums\PartnerStatus;
use Illuminate\Validation\Rule;

class CreatePartnerRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'slug' => [
                'required',
                'string',
                'min:2',
                'max:100',
                'regex:/^[a-z0-9][a-z0-9-]*[a-z0-9]$/',
                Rule::unique('partners', 'slug')->whereNull('deleted_at'),
            ],
            'name' => ['required', 'string', 'max:255'],
            'display_name' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', Rule::in(PartnerStatus::values())],
            'custom_domain' => [
                'nullable',
                'string',
                'max:255',
                // Hostname only — no scheme, no path, no port.
                'regex:/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$|^[a-z0-9-]+\.localhost$/',
                Rule::unique('partners', 'custom_domain')->whereNull('deleted_at'),
            ],
            'categories' => ['nullable', 'array'],
            'categories.*' => ['required', 'string', 'max:100'],
            'owner_email' => ['required', 'email', 'max:255'],
            'owner_phone' => ['nullable', 'string', 'max:30'],
            'logo_url' => ['nullable', 'url', 'max:500'],
            'description' => ['nullable', 'string', 'max:5000'],
            'owner_tenant_id' => [
                'nullable',
                'string',
                'max:50',
                Rule::exists('tenants', 'id')->whereNull('deleted_at'),
            ],
            'project_ids' => ['nullable', 'array', 'required_with:owner_tenant_id'],
            'project_ids.*' => ['integer'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'slug.required' => 'Slug là bắt buộc.',
            'slug.regex' => 'Slug chỉ chứa chữ thường, số và dấu gạch ngang.',
            'slug.unique' => 'Slug đã được sử dụng.',
            'name.required' => 'Tên partner là bắt buộc.',
            'owner_email.required' => 'Email chủ sở hữu là bắt buộc.',
            'owner_email.email' => 'Email không hợp lệ.',
            'custom_domain.unique' => 'Custom domain đã được sử dụng.',
            'custom_domain.regex' => 'Custom domain chỉ chứa hostname (vd: shop.hoaqua.vn). Không nhập http://, https://, hoặc đường dẫn.',
            'owner_tenant_id.exists' => 'Tenant không tồn tại.',
            'project_ids.required_with' => 'Vui lòng chọn ít nhất 1 dự án khi đã gán cho tenant.',
        ];
    }
}
