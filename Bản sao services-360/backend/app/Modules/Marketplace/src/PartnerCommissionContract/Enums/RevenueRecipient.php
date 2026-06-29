<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\PartnerCommissionContract\Enums;

enum RevenueRecipient: string
{
    case Platform = 'platform';
    case OperatingCompany = 'operating_company';

    public function label(): string
    {
        return match ($this) {
            self::Platform => 'Platform TNP',
            self::OperatingCompany => 'Công ty vận hành',
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
