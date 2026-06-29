<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\PartnerCommissionContract\Enums;

enum SubscriptionCycle: string
{
    case Monthly = 'monthly';
    case Quarterly = 'quarterly';
    case Yearly = 'yearly';

    public function label(): string
    {
        return match ($this) {
            self::Monthly => 'Hàng tháng',
            self::Quarterly => 'Hàng quý',
            self::Yearly => 'Hàng năm',
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
