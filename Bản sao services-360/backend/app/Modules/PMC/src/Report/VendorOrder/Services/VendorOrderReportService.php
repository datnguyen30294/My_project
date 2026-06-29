<?php

namespace App\Modules\PMC\Report\VendorOrder\Services;

use App\Common\Services\BaseService;
use App\Modules\Marketplace\VendorOrder\ExternalServices\VendorOrderReportExternalServiceInterface;
use App\Modules\PMC\Report\VendorOrder\Contracts\VendorOrderReportServiceInterface;

class VendorOrderReportService extends BaseService implements VendorOrderReportServiceInterface
{
    public function __construct(
        protected VendorOrderReportExternalServiceInterface $vendorOrders,
    ) {}

    /**
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function getSummary(array $filters): array
    {
        $feed = $this->fetch($filters);
        $rows = $feed['rows'];

        $count = count($rows);
        $revenueTotal = 0.0;
        $commissionTotal = 0.0;
        $vendorIds = [];
        $projectIds = [];

        foreach ($rows as $row) {
            $revenueTotal += (float) $row['revenue'];
            $commissionTotal += (float) $row['commission'];
            $vendorIds[$row['vendor_id']] = true;
            $projectIds[$row['project_id']] = true;
        }

        return [
            'period_label' => $this->periodLabel($feed['from'], $feed['to']),
            'from' => $feed['from'],
            'to' => $feed['to'],
            'currency' => $feed['currency'],
            'orders_count' => $count,
            'revenue_total' => $this->formatAmount($revenueTotal),
            'commission_total' => $this->formatAmount($commissionTotal),
            'average_commission_per_order' => $this->formatAmount($count > 0 ? $commissionTotal / $count : 0.0),
            'vendors_count' => count($vendorIds),
            'projects_count' => count($projectIds),
            'warnings' => $feed['warnings'],
        ];
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return list<array<string, mixed>>
     */
    public function getByVendor(array $filters): array
    {
        $rows = $this->fetch($filters)['rows'];

        $grouped = [];
        foreach ($rows as $row) {
            $key = $row['vendor_id'];

            if (! isset($grouped[$key])) {
                $grouped[$key] = [
                    'vendor_id' => $row['vendor_id'],
                    'vendor_name' => $row['vendor_name'],
                    'orders_count' => 0,
                    'revenue_total' => 0.0,
                    'commission_total' => 0.0,
                ];
            }

            $grouped[$key]['orders_count']++;
            $grouped[$key]['revenue_total'] += (float) $row['revenue'];
            $grouped[$key]['commission_total'] += (float) $row['commission'];
        }

        return $this->finalizeAggregates($grouped, 'vendor_id', 'vendor_name');
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return list<array<string, mixed>>
     */
    public function getByProject(array $filters): array
    {
        $rows = $this->fetch($filters)['rows'];

        $grouped = [];
        foreach ($rows as $row) {
            $key = $row['project_id'];

            if (! isset($grouped[$key])) {
                $grouped[$key] = [
                    'project_id' => $row['project_id'],
                    'project_name' => $row['project_name'],
                    'orders_count' => 0,
                    'revenue_total' => 0.0,
                    'commission_total' => 0.0,
                ];
            }

            $grouped[$key]['orders_count']++;
            $grouped[$key]['revenue_total'] += (float) $row['revenue'];
            $grouped[$key]['commission_total'] += (float) $row['commission'];
        }

        return $this->finalizeAggregates($grouped, 'project_id', 'project_name');
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return list<array<string, mixed>>
     */
    public function getTrend(array $filters): array
    {
        $rows = $this->fetch($filters)['rows'];

        $grouped = [];
        foreach ($rows as $row) {
            $date = (string) $row['completed_at'];

            if (! isset($grouped[$date])) {
                $grouped[$date] = [
                    'date' => $date,
                    'orders_count' => 0,
                    'revenue_total' => 0.0,
                    'commission_total' => 0.0,
                ];
            }

            $grouped[$date]['orders_count']++;
            $grouped[$date]['revenue_total'] += (float) $row['revenue'];
            $grouped[$date]['commission_total'] += (float) $row['commission'];
        }

        ksort($grouped);

        return array_map(fn (array $row): array => [
            'date' => $row['date'],
            'orders_count' => $row['orders_count'],
            'revenue_total' => $this->formatAmount($row['revenue_total']),
            'commission_total' => $this->formatAmount($row['commission_total']),
        ], array_values($grouped));
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return array{from:string, to:string, currency:string, rows: list<array<string, mixed>>, warnings: array<string, mixed>}
     */
    private function fetch(array $filters): array
    {
        return $this->vendorOrders->getCompletedOrdersForReport([
            'from' => $filters['date_from'] ?? null,
            'to' => $filters['date_to'] ?? null,
            'partner_id' => $filters['partner_id'] ?? null,
            'project_id' => $filters['project_id'] ?? null,
        ]);
    }

    /**
     * Format money to string + sort desc by revenue.
     *
     * @param  array<int|string, array<string, mixed>>  $grouped
     * @return list<array<string, mixed>>
     */
    private function finalizeAggregates(array $grouped, string $idKey, string $nameKey): array
    {
        $result = array_map(fn (array $row): array => [
            $idKey => $row[$idKey],
            $nameKey => $row[$nameKey],
            'orders_count' => $row['orders_count'],
            'revenue_total' => $this->formatAmount($row['revenue_total']),
            'commission_total' => $this->formatAmount($row['commission_total']),
        ], array_values($grouped));

        usort($result, fn (array $a, array $b): int => (float) $b['revenue_total'] <=> (float) $a['revenue_total']);

        return $result;
    }

    private function periodLabel(string $from, string $to): string
    {
        return sprintf('Từ %s đến %s', $from, $to);
    }

    private function formatAmount(float $amount): string
    {
        return number_format($amount, 2, '.', '');
    }
}
