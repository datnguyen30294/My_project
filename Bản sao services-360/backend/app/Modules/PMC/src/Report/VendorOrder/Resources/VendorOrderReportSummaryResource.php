<?php

namespace App\Modules\PMC\Report\VendorOrder\Resources;

use App\Common\Resources\BaseResource;
use Illuminate\Http\Request;

class VendorOrderReportSummaryResource extends BaseResource
{
    /**
     * @return array{
     *     period_label: string,
     *     from: string,
     *     to: string,
     *     currency: string,
     *     orders_count: int,
     *     revenue_total: string,
     *     commission_total: string,
     *     average_commission_per_order: string,
     *     vendors_count: int,
     *     projects_count: int,
     *     warnings: array{orphan_orders_count: int, non_per_order_orders_count: int, schema_missing: bool},
     * }
     */
    public function toArray(Request $request): array
    {
        /** @var array<string, mixed> $data */
        $data = $this->resource;

        /** @var array<string, mixed> $warnings */
        $warnings = $data['warnings'];

        return [
            'period_label' => (string) $data['period_label'],
            'from' => (string) $data['from'],
            'to' => (string) $data['to'],
            'currency' => (string) $data['currency'],
            'orders_count' => (int) $data['orders_count'],
            'revenue_total' => (string) $data['revenue_total'],
            'commission_total' => (string) $data['commission_total'],
            'average_commission_per_order' => (string) $data['average_commission_per_order'],
            'vendors_count' => (int) $data['vendors_count'],
            'projects_count' => (int) $data['projects_count'],
            'warnings' => [
                'orphan_orders_count' => (int) $warnings['orphan_orders_count'],
                'non_per_order_orders_count' => (int) $warnings['non_per_order_orders_count'],
                'schema_missing' => (bool) $warnings['schema_missing'],
            ],
        ];
    }
}
