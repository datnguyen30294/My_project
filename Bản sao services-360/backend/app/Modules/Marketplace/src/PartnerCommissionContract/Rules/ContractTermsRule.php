<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\PartnerCommissionContract\Rules;

use App\Modules\Marketplace\PartnerCommissionContract\Enums\BillingPeriod;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\CommissionMode;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\SubscriptionCycle;
use Closure;
use Illuminate\Contracts\Validation\DataAwareRule;
use Illuminate\Contracts\Validation\ValidationRule;

class ContractTermsRule implements DataAwareRule, ValidationRule
{
    /**
     * @var array<string, mixed>
     */
    protected array $data = [];

    /**
     * @param  array<string, mixed>  $data
     */
    public function setData(array $data): static
    {
        $this->data = $data;

        return $this;
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $mode = $this->data['commission_mode'] ?? null;

        if (! is_array($value)) {
            $fail('Điều khoản hợp đồng phải là object.');

            return;
        }

        if ($mode === null) {
            $fail('Thiếu loại hợp đồng để xác thực điều khoản.');

            return;
        }

        match ($mode) {
            CommissionMode::PerOrder->value => $this->validatePerOrder($value, $fail),
            CommissionMode::RevenueShare->value => $this->validateRevenueShare($value, $fail),
            CommissionMode::Subscription->value => $this->validateSubscription($value, $fail),
            default => $fail('Loại hợp đồng không hợp lệ.'),
        };
    }

    /**
     * @param  array<string, mixed>  $terms
     */
    protected function validatePerOrder(array $terms, Closure $fail): void
    {
        $percent = $terms['percent'] ?? null;
        $fixed = $terms['fixed'] ?? null;

        if ($percent === null && $fixed === null) {
            $fail('Hợp đồng theo đơn cần ít nhất một trong hai giá trị: phần trăm hoặc tiền cứng.');

            return;
        }

        if ($percent !== null) {
            if (! is_numeric($percent) || $percent < 0 || $percent > 100) {
                $fail('Phần trăm hoa hồng phải nằm trong khoảng 0-100.');

                return;
            }
        }

        if ($fixed !== null) {
            if (! is_numeric($fixed) || $fixed < 0) {
                $fail('Tiền cứng/đơn không hợp lệ.');
            }
        }
    }

    /**
     * @param  array<string, mixed>  $terms
     */
    protected function validateRevenueShare(array $terms, Closure $fail): void
    {
        $billingPeriod = $terms['billing_period'] ?? null;

        if (! in_array($billingPeriod, BillingPeriod::values(), true)) {
            $fail('Chu kỳ tính (billing_period) không hợp lệ.');

            return;
        }

        $tiers = $terms['tiers'] ?? null;

        if (! is_array($tiers) || $tiers === []) {
            $fail('Cần ít nhất 1 bậc doanh thu (tier).');

            return;
        }

        $previousMax = -1.0;

        foreach ($tiers as $index => $tier) {
            if (! is_array($tier)) {
                $fail("Bậc thứ {$index} không hợp lệ.");

                return;
            }

            $minGmv = $tier['min_gmv'] ?? null;
            $maxGmv = array_key_exists('max_gmv', $tier) ? $tier['max_gmv'] : null;
            $percent = $tier['percent'] ?? null;

            if (! is_numeric($minGmv) || $minGmv < 0) {
                $fail("Bậc {$index}: min_gmv không hợp lệ.");

                return;
            }

            if ($maxGmv !== null) {
                if (! is_numeric($maxGmv) || $maxGmv <= $minGmv) {
                    $fail("Bậc {$index}: max_gmv phải lớn hơn min_gmv.");

                    return;
                }
            }

            if (! is_numeric($percent) || $percent < 0 || $percent > 100) {
                $fail("Bậc {$index}: percent phải trong khoảng 0-100.");

                return;
            }

            if ((float) $minGmv < $previousMax) {
                $fail("Các bậc bị chồng lấn ở bậc {$index}.");

                return;
            }

            $previousMax = $maxGmv === null ? PHP_FLOAT_MAX : (float) $maxGmv;
        }
    }

    /**
     * @param  array<string, mixed>  $terms
     */
    protected function validateSubscription(array $terms, Closure $fail): void
    {
        $amount = $terms['amount'] ?? null;
        $cycle = $terms['cycle'] ?? null;

        if (! is_numeric($amount) || $amount < 0) {
            $fail('Phí thuê bao không hợp lệ.');

            return;
        }

        if (! in_array($cycle, SubscriptionCycle::values(), true)) {
            $fail('Chu kỳ thuê bao không hợp lệ.');
        }
    }
}
