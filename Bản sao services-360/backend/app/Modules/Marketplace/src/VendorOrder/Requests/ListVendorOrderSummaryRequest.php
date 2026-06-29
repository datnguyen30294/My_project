<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOrder\Requests;

use App\Common\Requests\BaseFormRequest;

class ListVendorOrderSummaryRequest extends BaseFormRequest
{
    /**
     * @return array<string, array<int, string>|string>
     */
    public function rules(): array
    {
        return [
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date', 'after_or_equal:from'],
        ];
    }
}
