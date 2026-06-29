<?php

namespace App\Modules\PMC\Report\VendorOrder\Resources;

use App\Common\Resources\BaseResource;
use Illuminate\Http\Request;

class VendorOrderReportByProjectResource extends BaseResource
{
    /**
     * @return array{
     *     project_id: int,
     *     project_name: string,
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
            'project_id' => (int) $row['project_id'],
            'project_name' => (string) $row['project_name'],
            'orders_count' => (int) $row['orders_count'],
            'revenue_total' => (string) $row['revenue_total'],
            'commission_total' => (string) $row['commission_total'],
        ];
    }
}
