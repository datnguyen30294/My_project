<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOrder\Enums;

/**
 * Loại đơn vendor — giá trị SUY RA từ `item_type` của các dòng đơn, KHÔNG lưu DB
 * và KHÔNG cast trên model. Chỉ dùng ở Resource + filter (console Platform).
 *
 * - mọi item `service`  → service
 * - mọi item `product`  → product
 * - lẫn lộn             → mixed
 */
enum VendorOrderType: string
{
    case Product = 'product';

    case Service = 'service';

    case Mixed = 'mixed';

    public function label(): string
    {
        return match ($this) {
            self::Product => 'Sản phẩm',
            self::Service => 'Dịch vụ',
            self::Mixed => 'Hỗn hợp',
        };
    }

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_map(fn (self $case): string => $case->value, self::cases());
    }

    /**
     * Suy ra loại đơn từ tập dòng đơn (mỗi item có thuộc tính `item_type`).
     * Đơn rỗng coi như `product`.
     *
     * @param  iterable<object>  $items
     */
    public static function deriveFromItems(iterable $items): self
    {
        $hasProduct = false;
        $hasService = false;

        foreach ($items as $item) {
            if ($item->item_type === 'service') {
                $hasService = true;
            } else {
                $hasProduct = true;
            }
        }

        if ($hasProduct && $hasService) {
            return self::Mixed;
        }

        if ($hasService) {
            return self::Service;
        }

        return self::Product;
    }
}
