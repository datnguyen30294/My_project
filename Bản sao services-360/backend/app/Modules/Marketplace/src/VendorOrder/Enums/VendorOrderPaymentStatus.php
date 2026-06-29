<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOrder\Enums;

enum VendorOrderPaymentStatus: string
{
    case Unpaid = 'unpaid';
    case PartiallyPaid = 'partially_paid';
    case Paid = 'paid';
    case Refunded = 'refunded';

    public function label(): string
    {
        return match ($this) {
            self::Unpaid => 'Chưa thanh toán',
            self::PartiallyPaid => 'Thanh toán một phần',
            self::Paid => 'Đã thanh toán',
            self::Refunded => 'Đã hoàn',
        };
    }

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_map(fn (self $case) => $case->value, self::cases());
    }
}
