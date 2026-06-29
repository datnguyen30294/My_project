<?php

namespace App\Modules\Platform\Tenant\Enums;

enum ServicePlan: string
{
    case Starter = 'starter';
    case Business = 'business';
    case Enterprise = 'enterprise';

    public function label(): string
    {
        return match ($this) {
            self::Starter => 'Starter',
            self::Business => 'Business',
            self::Enterprise => 'Enterprise',
        };
    }

    /** @return array<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
