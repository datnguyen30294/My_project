<?php

namespace App\Modules\Platform\Report\Requests;

use App\Common\Requests\BaseFormRequest;

class ListCsatReportRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'from' => ['nullable', 'date', 'required_with:to'],
            'to' => ['nullable', 'date', 'after_or_equal:from'],
            'months' => ['nullable', 'integer', 'min:1', 'max:12'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'from.date' => 'Ngày bắt đầu không hợp lệ',
            'from.required_with' => 'Ngày bắt đầu không hợp lệ',
            'to.date' => 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu',
            'to.after_or_equal' => 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu',
            'months.integer' => 'Số tháng phải từ 1 đến 12.',
            'months.min' => 'Số tháng phải từ 1 đến 12.',
            'months.max' => 'Số tháng phải từ 1 đến 12.',
        ];
    }
}
