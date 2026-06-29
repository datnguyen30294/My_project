<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\PartnerCommissionContract\Enums;

enum ContractCreatedScope: string
{
    case Platform = 'platform';
    case Tenant = 'tenant';

    public function label(): string
    {
        return match ($this) {
            self::Platform => 'Platform',
            self::Tenant => 'Đơn vị quản lý',
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
