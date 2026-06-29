<?php

declare(strict_types=1);

namespace App\Modules\Platform\Tenant\ExternalServices\PMC;

use App\Modules\Platform\Tenant\Enums\TenantFeeMode;

/**
 * Chính sách phí nền tảng của tenant hiện tại (đọc từ tenant_configs central).
 *
 * Toàn bộ logic theo mode nằm trong VO này để module tiêu thụ (PMC) không phải
 * import TenantFeeMode — chỉ gọi các method dưới đây.
 */
final readonly class TenantFeePolicy
{
    public function __construct(
        public TenantFeeMode $mode,
        public float $fixedPerOrder,
        public float $percentPerOrder,
    ) {}

    /**
     * Phí nền tảng cho một đơn — thống nhất với mô hình phân phối hoa hồng:
     * trừ phí cố định "lên đầu" trước, rồi tính % trên phần CÒN LẠI.
     * none/subscription → 0.
     */
    public function computeForOrder(float $orderAmount): float
    {
        $fixed = min($this->appliedFixed(), $orderAmount);
        $remaining = $orderAmount - $fixed;

        return round($fixed + $remaining * $this->appliedPercent() / 100, 2);
    }

    /**
     * Phần phí cố định thực sự áp dụng (0 nếu mode không dùng phí cố định).
     */
    public function appliedFixed(): float
    {
        return \in_array($this->mode, [TenantFeeMode::FixedPerOrder, TenantFeeMode::Both], true)
            ? $this->fixedPerOrder
            : 0.0;
    }

    /**
     * Phần phí % thực sự áp dụng (0 nếu mode không dùng phí %).
     */
    public function appliedPercent(): float
    {
        return \in_array($this->mode, [TenantFeeMode::PercentPerOrder, TenantFeeMode::Both], true)
            ? $this->percentPerOrder
            : 0.0;
    }

    /**
     * Giá trị string của mode để lưu snapshot (không lộ enum ra ngoài module).
     */
    public function modeValue(): string
    {
        return $this->mode->value;
    }
}
