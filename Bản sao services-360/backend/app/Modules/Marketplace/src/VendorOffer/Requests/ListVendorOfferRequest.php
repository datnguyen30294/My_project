<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOffer\Requests;

use App\Common\Requests\BaseFormRequest;
use App\Modules\Marketplace\VendorOffer\Enums\VendorOfferStatus;
use App\Modules\Marketplace\VendorOffer\Enums\VendorOfferType;
use Illuminate\Validation\Rule;

class ListVendorOfferRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:255'],
            'type' => ['nullable', Rule::in(VendorOfferType::values())],
            'status' => ['nullable', Rule::in(VendorOfferStatus::values())],
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
            'type.in' => 'Loại gói không hợp lệ.',
            'status.in' => 'Trạng thái gói không hợp lệ.',
            'per_page.max' => 'Mỗi trang tối đa 50 gói.',
        ];
    }
}
