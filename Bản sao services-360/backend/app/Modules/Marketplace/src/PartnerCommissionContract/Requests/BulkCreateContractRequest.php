<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\PartnerCommissionContract\Requests;

use App\Common\Requests\BaseFormRequest;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\CommissionMode;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\RevenueRecipient;
use App\Modules\Marketplace\PartnerCommissionContract\Rules\ContractTermsRule;
use Illuminate\Validation\Rule;

/**
 * Apply a single "default" commission terms set across every project the vendor
 * is linked to (fan-out → one draft contract per scope). The `{id}` partner is
 * taken from the route, not the body.
 */
class BulkCreateContractRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'commission_mode' => ['required', Rule::in(CommissionMode::values())],
            'revenue_recipient' => ['nullable', Rule::in(RevenueRecipient::values())],
            'starts_at' => ['required', 'date', 'after_or_equal:today'],
            'ends_at' => ['nullable', 'date', 'after:starts_at'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'terms' => ['required', 'array', new ContractTermsRule],
            // When true (default) scopes that already have a live contract are
            // skipped — the bulk apply never overrides an existing config.
            'skip_existing' => ['nullable', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'commission_mode.required' => 'Vui lòng chọn loại hợp đồng.',
            'commission_mode.in' => 'Loại hợp đồng không hợp lệ.',
            'revenue_recipient.in' => 'Người nhận doanh thu không hợp lệ.',
            'starts_at.required' => 'Vui lòng nhập ngày bắt đầu.',
            'starts_at.after_or_equal' => 'Ngày bắt đầu không được trong quá khứ.',
            'ends_at.after' => 'Ngày kết thúc phải sau ngày bắt đầu.',
            'terms.required' => 'Thiếu điều khoản hợp đồng.',
        ];
    }
}
