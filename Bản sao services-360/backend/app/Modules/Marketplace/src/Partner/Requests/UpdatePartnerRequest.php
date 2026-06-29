<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\Partner\Requests;

use App\Common\Requests\BaseFormRequest;
use App\Modules\Marketplace\Partner\Enums\PartnerStatus;
use Illuminate\Validation\Rule;

class UpdatePartnerRequest extends BaseFormRequest
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
                // Hostname only — no scheme, no path, no port.
                'regex:/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$|^[a-z0-9-]+\.localhost$/',
                Rule::unique('partners', 'custom_domain')->ignore($id)->whereNull('deleted_at'),
            ],
            'categories' => ['nullable', 'array'],
            'categories.*' => ['required', 'string', 'max:100'],
            'owner_email' => ['sometimes', 'required', 'email', 'max:255'],
            'owner_phone' => ['nullable', 'string', 'max:30'],
            'logo_url' => ['nullable', 'url', 'max:500'],
            'description' => ['nullable', 'string', 'max:5000'],
            'owner_tenant_id' => [
                'nullable',
                'string',
                'max:50',
                Rule::exists('tenants', 'id')->whereNull('deleted_at'),
            ],
            'project_ids' => ['nullable', 'array'],
            'project_ids.*' => ['integer'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'owner_tenant_id.exists' => 'Tenant không tồn tại.',
        ];
    }
}
