<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\PartnerCommissionContract\Enums;

enum CommissionMode: string
{
    case PerOrder = 'per_order';
    case RevenueShare = 'revenue_share';
    case Subscription = 'subscription';

    public function label(): string
    {
        return match ($this) {
            self::PerOrder => 'Chiết khấu mỗi đơn',
            self::RevenueShare => 'Chia doanh thu',
            self::Subscription => 'Thuê bao',
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
