<?php

namespace App\Modules\Platform\Tenant\Enums;

enum TenantFeeMode: string
{
    case None = 'none';
    case Subscription = 'subscription';
    case FixedPerOrder = 'fixed_per_order';
    case PercentPerOrder = 'percent_per_order';
    case Both = 'both';

    public function label(): string
    {
        return match ($this) {
            self::None => 'Không thu',
            self::Subscription => 'Thu theo gói tháng/năm',
            self::FixedPerOrder => 'Thu tiền mặt theo đơn hàng',
            self::PercentPerOrder => 'Thu theo % đơn hàng',
            self::Both => 'Thu theo cả 2',
        };
    }

    /** @return array<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
