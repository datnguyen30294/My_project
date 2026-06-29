<?php

namespace App\Modules\PMC\Report\VendorOrder\Resources;

use App\Common\Resources\BaseResource;
use Illuminate\Http\Request;

class VendorOrderReportByVendorResource extends BaseResource
{
    /**
     * @return array{
     *     vendor_id: int,
     *     vendor_name: string,
     *     orders_count: int,
     *     revenue_total: string,
     *     commission_total: string,
     * }
     */
    public function toArray(Request $request): array
    {
        /** @var array<string, mixed> $row */
        $row = $this->resource;

        return [
            'vendor_id' => (int) $row['vendor_id'],
            'vendor_name' => (string) $row['vendor_name'],
            'orders_count' => (int) $row['orders_count'],
            'revenue_total' => (string) $row['revenue_total'],
            'commission_total' => (string) $row['commission_total'],
        ];
    }
}
