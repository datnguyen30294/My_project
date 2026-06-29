<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOrder\Services;

use App\Modules\Marketplace\PartnerCommissionContract\Models\PartnerCommissionContract;

/**
 * Pure-function calculator.
 *
 * Công thức (per_order mode):
 *   if fixed >= total → commission = total (cap)
 *   else              → commission = fixed + (total - fixed) × percent / 100
 */
final class VendorOrderCommissionCalculator
{
    /**
     * @return array{
     *     fixed: float,
     *     percent: float,
     *     remainder_after_fixed: float,
     *     percent_amount: float,
     *     total: float,
     *     capped_at_total: bool
     * }
     */
    public function compute(PartnerCommissionContract $contract, float $orderTotal): array
    {
        return $this->computeFromTerms($contract->terms ?? [], $orderTotal);
    }

    /**
     * Tính hoa hồng per_order trực tiếp từ điều khoản {fixed, percent} —
     * dùng cho cả hợp đồng lẫn override gán thủ công theo từng đơn.
     *
     * @param  array<string, mixed>  $terms
     * @return array{
     *     fixed: float,
     *     percent: float,
     *     remainder_after_fixed: float,
     *     percent_amount: float,
     *     total: float,
     *     capped_at_total: bool
     * }
     */
    public function computeFromTerms(array $terms, float $orderTotal): array
    {
        $fixed = (float) ($terms['fixed'] ?? 0);
        $percent = (float) ($terms['percent'] ?? 0);

        if ($orderTotal <= 0) {
            return $this->zero($fixed, $percent);
        }

        if ($fixed >= $orderTotal) {
            return [
                'fixed' => $fixed,
                'percent' => $percent,
                'remainder_after_fixed' => 0.0,
                'percent_amount' => 0.0,
                'total' => round($orderTotal, 2),
                'capped_at_total' => true,
            ];
        }

        $remainder = $orderTotal - $fixed;
        $percentAmount = round($remainder * $percent / 100, 2);
        $total = round($fixed + $percentAmount, 2);

        return [
            'fixed' => $fixed,
            'percent' => $percent,
            'remainder_after_fixed' => round($remainder, 2),
            'percent_amount' => $percentAmount,
            'total' => $total,
            'capped_at_total' => false,
        ];
    }

    /**
     * @return array{
     *     fixed: float,
     *     percent: float,
     *     remainder_after_fixed: float,
     *     percent_amount: float,
     *     total: float,
     *     capped_at_total: bool
     * }
     */
    private function zero(float $fixed, float $percent): array
    {
        return [
            'fixed' => $fixed,
            'percent' => $percent,
            'remainder_after_fixed' => 0.0,
            'percent_amount' => 0.0,
            'total' => 0.0,
            'capped_at_total' => false,
        ];
    }
}
