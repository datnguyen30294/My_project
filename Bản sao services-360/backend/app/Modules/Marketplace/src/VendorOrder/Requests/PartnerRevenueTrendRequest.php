<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOrder\Requests;

use App\Common\Requests\BaseFormRequest;

class PartnerRevenueTrendRequest extends BaseFormRequest
{
    /**
     * @return array<string, array<int, string>|string>
     */
    public function rules(): array
    {
        return [
            'months' => ['nullable', 'integer', 'min:1', 'max:12'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'months.max' => 'Chỉ thống kê tối đa 12 tháng gần nhất.',
        ];
    }
}
