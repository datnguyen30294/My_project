<?php

declare(strict_types=1);

namespace App\Modules\Platform\OgOrder\Requests;

use App\Common\Requests\BaseFormRequest;
use App\Modules\PMC\Order\Enums\OrderStatus;
use Illuminate\Validation\Rule;

/**
 * Console Platform — list ĐỌC-CHỈ gộp đơn OG (dịch vụ vận hành) cross-tenant.
 */
class ListOgOrderRequest extends BaseFormRequest
{
    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date', 'after_or_equal:from'],
            'tenant_id' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', Rule::in(OrderStatus::values())],
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
            'status.in' => 'Trạng thái không hợp lệ.',
            'per_page.max' => 'Mỗi trang tối đa 50 đơn.',
        ];
    }
}
