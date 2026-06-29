<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\Partner\Enums;

enum PartnerStatus: string
{
    case Pending = 'pending';
    case Active = 'active';
    case Suspended = 'suspended';
    case Terminated = 'terminated';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Chờ duyệt',
            self::Active => 'Đang hoạt động',
            self::Suspended => 'Đã vô hiệu',
            self::Terminated => 'Đã chấm dứt',
        };
    }

    /**
     * Nuxt UI color token for status badges (see FE spec §3.2).
     */
    public function color(): string
    {
        return match ($this) {
            self::Pending => 'warning',
            self::Active => 'success',
            self::Suspended => 'neutral',
            self::Terminated => 'error',
        };
    }

    /**
     * Whether the vendor is awaiting platform approval (`pending → active`).
     */
    public function isApprovable(): bool
    {
        return $this === self::Pending;
    }

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_map(fn (self $case) => $case->value, self::cases());
    }
}
