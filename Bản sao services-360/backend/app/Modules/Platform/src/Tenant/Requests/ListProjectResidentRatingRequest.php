<?php

namespace App\Modules\Platform\Tenant\Requests;

use App\Common\Requests\BaseFormRequest;

class ListProjectResidentRatingRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'rating.min' => 'Điểm đánh giá từ 1 đến 5.',
            'rating.max' => 'Điểm đánh giá từ 1 đến 5.',
        ];
    }
}
