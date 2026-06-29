<?php

namespace App\Modules\PMC\Report\VendorOrder\Resources;

use App\Common\Resources\BaseResource;
use Illuminate\Http\Request;

class VendorOrderReportTrendResource extends BaseResource
{
    /**
     * @return array{
     *     date: string,
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
            'date' => (string) $row['date'],
            'orders_count' => (int) $row['orders_count'],
            'revenue_total' => (string) $row['revenue_total'],
            'commission_total' => (string) $row['commission_total'],
        ];
    }
}
