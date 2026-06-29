<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\Partner\Requests;

use App\Common\Requests\BaseFormRequest;
use App\Modules\Marketplace\Partner\Enums\PartnerStatus;
use App\Modules\Marketplace\Partner\Models\Partner;
use Illuminate\Validation\Rule;

class UpdateTenantPartnerRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'display_name' => ['nullable', 'string', 'max:255'],
            'status' => ['sometimes', 'required', Rule::in(PartnerStatus::values())],
            'custom_domain' => [
                'nullable',
                'string',
                'max:255',
                'regex:/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$|^[a-z0-9-]+\.localhost$/',
                Rule::unique(Partner::class, 'custom_domain')->ignore($id)->whereNull('deleted_at'),
            ],
            'categories' => ['nullable', 'array'],
            'categories.*' => ['required', 'string', 'max:100'],
            'owner_email' => ['sometimes', 'required', 'email', 'max:255'],
            'owner_phone' => ['nullable', 'string', 'max:30'],
            'logo_url' => ['nullable', 'url', 'max:500'],
            'description' => ['nullable', 'string', 'max:5000'],
            'project_ids' => ['nullable', 'array'],
            'project_ids.*' => ['integer', Rule::exists('projects', 'id')->whereNull('deleted_at')],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Tên partner là bắt buộc.',
            'owner_email.email' => 'Email không hợp lệ.',
            'custom_domain.unique' => 'Custom domain đã được sử dụng.',
            'custom_domain.regex' => 'Custom domain chỉ chứa hostname (vd: shop.hoaqua.vn). Không nhập http://, https://, hoặc đường dẫn.',
        ];
    }
}
