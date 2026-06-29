<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\PartnerProject\Requests;

use App\Common\Requests\BaseFormRequest;

class UpdateProjectVendorRequest extends BaseFormRequest
{
    /**
     * @return array<string, array<int, string>|string>
     */
    public function rules(): array
    {
        return [
            'enabled' => ['required', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'enabled.required' => 'Trạng thái bật/tắt là bắt buộc.',
            'enabled.boolean' => 'Trạng thái bật/tắt không hợp lệ.',
        ];
    }
}
