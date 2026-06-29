<?php

declare(strict_types=1);

namespace App\Modules\Platform\Tenant\Requests;

use App\Common\Requests\BaseFormRequest;

class ToggleTenantVendorFeatureRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'is_vendor_enabled' => ['required', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'is_vendor_enabled.required' => 'Trạng thái gói vendor là bắt buộc.',
            'is_vendor_enabled.boolean' => 'Trạng thái gói vendor phải là true/false.',
        ];
    }
}
