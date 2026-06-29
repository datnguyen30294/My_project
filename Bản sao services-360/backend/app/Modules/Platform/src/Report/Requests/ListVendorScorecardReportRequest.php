<?php

namespace App\Modules\Platform\Report\Requests;

use App\Common\Requests\BaseFormRequest;
use Illuminate\Validation\Rule;

class ListVendorScorecardReportRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'months' => ['nullable', 'integer', 'min:1', 'max:12'],
            'sort' => ['nullable', 'string', Rule::in([
                'gmv',
                'order_count',
                'commission',
                'platform_fee',
                'completion_rate',
                'cancel_rate',
                'avg_rating',
            ])],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'months.integer' => 'Số tháng phải từ 1 đến 12.',
            'months.min' => 'Số tháng phải từ 1 đến 12.',
            'months.max' => 'Số tháng phải từ 1 đến 12.',
            'sort.in' => 'Trường sắp xếp không hợp lệ.',
        ];
    }
}
