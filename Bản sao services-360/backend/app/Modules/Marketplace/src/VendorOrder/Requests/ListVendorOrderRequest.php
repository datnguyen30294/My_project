<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOrder\Requests;

use App\Common\Requests\BaseFormRequest;

class ListVendorOrderRequest extends BaseFormRequest
{
    /**
     * @return array<string, array<int, string>|string>
     */
    public function rules(): array
    {
        return [
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date', 'after_or_equal:from'],
            'partner_id' => ['nullable', 'integer', 'min:1'],
            'tenant_id' => ['nullable', 'string', 'max:100'],
            'project_id' => ['nullable', 'integer', 'min:1'],
            'search' => ['nullable', 'string', 'max:100'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'to.after_or_equal' => 'Ngày kết thúc phải sau ngày bắt đầu.',
            'per_page.max' => 'Mỗi trang tối đa 50 đơn.',
        ];
    }
}
