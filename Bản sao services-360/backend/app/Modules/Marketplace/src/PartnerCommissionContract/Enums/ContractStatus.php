<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\PartnerCommissionContract\Enums;

enum ContractStatus: string
{
    case Draft = 'draft';
    case Pending = 'pending';
    case Active = 'active';
    case Replaced = 'replaced';
    case Cancelled = 'cancelled';
    case Expired = 'expired';
    case Revoked = 'revoked';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Nháp',
            self::Pending => 'Chờ kích hoạt',
            self::Active => 'Đang hiệu lực',
            self::Replaced => 'Đã bị thay thế',
            self::Cancelled => 'Đã huỷ',
            self::Expired => 'Đã hết hạn',
            self::Revoked => 'Đã thu hồi',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Draft => 'neutral',
            self::Pending => 'amber',
            self::Active => 'green',
            self::Replaced => 'gray',
            self::Cancelled => 'red',
            self::Expired => 'gray',
            self::Revoked => 'red',
        };
    }

    public function isTerminal(): bool
    {
        return in_array($this, [
            self::Replaced,
            self::Cancelled,
            self::Expired,
            self::Revoked,
        ], true);
    }

    public function isEditable(): bool
    {
        return $this === self::Draft;
    }

    public function isNonFinancialEditable(): bool
    {
        return in_array($this, [self::Draft, self::Pending], true);
    }

    public function canTransitionTo(self $target): bool
    {
        if ($this->isTerminal()) {
            return false;
        }

        return match ($this) {
            self::Draft => in_array($target, [self::Pending], true),
            self::Pending => in_array($target, [self::Active, self::Revoked], true),
            self::Active => in_array($target, [self::Cancelled, self::Replaced, self::Expired], true),
            default => false,
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
