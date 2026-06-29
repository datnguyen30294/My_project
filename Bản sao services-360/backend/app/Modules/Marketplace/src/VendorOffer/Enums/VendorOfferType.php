<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOffer\Enums;

/**
 * Mirrors resi_mart `products.type` (sale | rental | service).
 */
enum VendorOfferType: string
{
    case Sale = 'sale';
    case Rental = 'rental';
    case Service = 'service';

    public function label(): string
    {
        return match ($this) {
            self::Sale => 'Bán sản phẩm',
            self::Rental => 'Cho thuê',
            self::Service => 'Dịch vụ',
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
