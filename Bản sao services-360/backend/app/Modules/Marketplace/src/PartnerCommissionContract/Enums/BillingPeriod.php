<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\PartnerCommissionContract\Enums;

enum BillingPeriod: string
{
    case Monthly = 'monthly';
    case Quarterly = 'quarterly';

    public function label(): string
    {
        return match ($this) {
            self::Monthly => 'Hàng tháng',
            self::Quarterly => 'Hàng quý',
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
