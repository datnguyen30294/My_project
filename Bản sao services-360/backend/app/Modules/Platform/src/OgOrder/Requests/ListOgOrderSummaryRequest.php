<?php

declare(strict_types=1);

namespace App\Modules\Platform\OgOrder\Requests;

use App\Common\Requests\BaseFormRequest;
use App\Modules\PMC\Order\Enums\OrderStatus;
use Illuminate\Validation\Rule;

/**
 * Console Platform — 4 thẻ tổng hợp đơn OG cross-tenant.
 */
class ListOgOrderSummaryRequest extends BaseFormRequest
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
        ];
    }
}
