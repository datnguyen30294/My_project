<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOrder\Requests;

use App\Common\Requests\BaseFormRequest;
use App\Modules\Marketplace\VendorOrder\Enums\VendorOrderStatus;
use App\Modules\Marketplace\VendorOrder\Enums\VendorOrderType;
use Illuminate\Validation\Rule;

/**
 * Console Platform — list ĐỌC-CHỈ gộp đơn vendor cross-vendor + cross-tenant.
 */
class ListPlatformVendorOrderRequest extends BaseFormRequest
{
    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date', 'after_or_equal:from'],
            'partner_id' => ['nullable', 'integer', 'min:1', Rule::exists('partners', 'id')],
            'tenant_id' => ['nullable', 'string', 'max:100'],
            'project_id' => ['nullable', 'integer', 'min:1'],
            'type' => ['nullable', Rule::in(VendorOrderType::values())],
            'status' => ['nullable', Rule::in(VendorOrderStatus::values())],
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
            'type.in' => 'Loại đơn không hợp lệ.',
            'status.in' => 'Trạng thái không hợp lệ.',
            'per_page.max' => 'Mỗi trang tối đa 50 đơn.',
        ];
    }
}
