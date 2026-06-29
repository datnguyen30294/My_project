<?php

namespace App\Modules\Platform\Report\Requests;

use App\Common\Requests\BaseFormRequest;

class ListServiceAdoptionReportRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return ['months' => ['nullable', 'integer', 'min:1', 'max:12']];
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
        ];
    }
}
