<?php

namespace App\Modules\Platform\Tenant\Enums;

enum SubscriptionCycle: string
{
    case Monthly = 'monthly';
    case Yearly = 'yearly';

    public function label(): string
    {
        return match ($this) {
            self::Monthly => 'Theo tháng',
            self::Yearly => 'Theo năm',
        };
    }

    /** @return array<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
