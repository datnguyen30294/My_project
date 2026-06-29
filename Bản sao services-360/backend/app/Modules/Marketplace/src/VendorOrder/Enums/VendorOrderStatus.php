<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOrder\Enums;

enum VendorOrderStatus: string
{
    case Pending = 'pending';
    case Confirmed = 'confirmed';
    case Completed = 'completed';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Chờ xử lý',
            self::Confirmed => 'Đã xác nhận',
            self::Completed => 'Hoàn thành',
            self::Cancelled => 'Đã huỷ',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Pending => 'amber',
            self::Confirmed => 'info',
            self::Completed => 'green',
            self::Cancelled => 'red',
        };
    }

    /**
     * Trạng thái cuối — đơn đã chốt (hoàn thành/huỷ), platform không đổi nữa.
     */
    public function isTerminal(): bool
    {
        return in_array($this, [self::Completed, self::Cancelled], true);
    }

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_map(fn (self $case) => $case->value, self::cases());
    }
}
