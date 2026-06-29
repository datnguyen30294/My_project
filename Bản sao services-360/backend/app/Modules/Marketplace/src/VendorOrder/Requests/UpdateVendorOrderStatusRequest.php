<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOrder\Requests;

use App\Common\Requests\BaseFormRequest;
use App\Modules\Marketplace\VendorOrder\Enums\VendorOrderStatus;
use Illuminate\Validation\Rule;

/**
 * Console Platform — override trạng thái 1 đơn vendor (any→any).
 * Ghi qua S2S resi_mart; chỉ nhận 4 trạng thái mà residential biểu diễn.
 */
class UpdateVendorOrderStatusRequest extends BaseFormRequest
{
    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(VendorOrderStatus::values())],
            'reason' => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'status.required' => 'Vui lòng chọn trạng thái.',
            'status.in' => 'Trạng thái không hợp lệ.',
            'reason.max' => 'Lý do tối đa 500 ký tự.',
        ];
    }
}
