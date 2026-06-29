<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOrder\Services;

use App\Modules\Marketplace\PartnerCommissionContract\Enums\RevenueRecipient;
use App\Modules\Marketplace\VendorOrder\Enums\VendorOrderStatus;
use App\Modules\Marketplace\VendorOrder\Enums\VendorOrderType;

/**
 * Pure aggregator cho console "Đơn hàng vendor" (Platform).
 *
 * Nhận tập decorated rows đã gom cross-vendor + cross-tenant (mỗi row gồm
 * `order` + `vendor` + `type` + `commission|null`) và tổng hợp 4 thẻ summary.
 * KHÔNG chạm DB — tách riêng để unit-test logic số liệu mà không cần resi_mart.
 *
 * Quy ước tài chính:
 * - GMV = tổng `total` các đơn KHÔNG bị huỷ (cancelled vẫn hiện ở list nhưng
 *   không tính GMV/hoa hồng).
 * - Hoa hồng chỉ tính cho row đã khớp hợp đồng per_order (`commission != null`),
 *   chia về `platform` vs `operating_company` theo `revenue_recipient`.
 */
final class VendorOrderConsoleAssembler
{
    /**
     * @param  list<array{order: object, vendor: array{id:int,...}, type: string, commission: array|null}>  $rows
     * @return array{
     *     orders_count:int,
     *     product_count:int,
     *     service_count:int,
     *     gmv:float,
     *     commission_platform:float,
     *     commission_operating_company:float,
     *     commission_total:float,
     *     vendors_count:int
     * }
     */
    public function summarize(array $rows): array
    {
        $ordersCount = count($rows);
        $productCount = 0;
        $serviceCount = 0;
        $gmv = 0.0;
        $commissionPlatform = 0.0;
        $commissionOperatingCompany = 0.0;
        $vendorIds = [];

        foreach ($rows as $row) {
            $order = $row['order'];
            $vendorIds[(int) $row['vendor']['id']] = true;

            if ($row['type'] === VendorOrderType::Product->value) {
                $productCount++;
            } elseif ($row['type'] === VendorOrderType::Service->value) {
                $serviceCount++;
            }

            if ($order->status !== VendorOrderStatus::Cancelled) {
                $gmv += (float) $order->total;
            }

            if ($row['commission'] !== null) {
                $amount = (float) ($row['commission']['amount'] ?? $row['commission']['formula']['total'] ?? 0);
                $recipient = $row['commission']['recipient'] ?? ($row['commission']['contract']->revenue_recipient ?? null);

                if ($recipient === RevenueRecipient::OperatingCompany) {
                    $commissionOperatingCompany += $amount;
                } else {
                    $commissionPlatform += $amount;
                }
            }
        }

        $commissionPlatform = round($commissionPlatform, 2);
        $commissionOperatingCompany = round($commissionOperatingCompany, 2);

        return [
            'orders_count' => $ordersCount,
            'product_count' => $productCount,
            'service_count' => $serviceCount,
            'gmv' => round($gmv, 2),
            'commission_platform' => $commissionPlatform,
            'commission_operating_company' => $commissionOperatingCompany,
            'commission_total' => round($commissionPlatform + $commissionOperatingCompany, 2),
            'vendors_count' => count($vendorIds),
        ];
    }
}
