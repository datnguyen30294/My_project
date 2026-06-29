<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOffer\Enums;

/**
 * Mirrors resi_mart `products.status` (draft | published | out_of_stock |
 * archived).
 */
enum VendorOfferStatus: string
{
    case Draft = 'draft';
    case Published = 'published';
    case OutOfStock = 'out_of_stock';
    case Archived = 'archived';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Nháp',
            self::Published => 'Công khai',
            self::OutOfStock => 'Hết hàng',
            self::Archived => 'Đã lưu trữ',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Draft => 'neutral',
            self::Published => 'success',
            self::OutOfStock => 'warning',
            self::Archived => 'neutral',
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
