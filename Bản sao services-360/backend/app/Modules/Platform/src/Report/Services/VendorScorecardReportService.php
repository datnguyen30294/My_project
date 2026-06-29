<?php

namespace App\Modules\Platform\Report\Services;

use App\Modules\Platform\Report\Contracts\ReportAggregationServiceInterface;
use App\Modules\Platform\Report\Contracts\VendorScorecardReportServiceInterface;
use App\Modules\Platform\Report\Support\PlatformVendorOrderRow;
use Carbon\CarbonImmutable;

class VendorScorecardReportService implements VendorScorecardReportServiceInterface
{
    public const DEFAULT_MONTHS = 6;

    public const DEFAULT_SORT = 'gmv';

    public function __construct(
        protected ReportAggregationServiceInterface $aggregation,
    ) {}

    /**
     * @param  array<string, mixed>  $filters
     * @return array{
     *     months: int,
     *     vendors: list<array<string, mixed>>,
     * }
     */
    public function build(array $filters): array
    {
        $months = (int) ($filters['months'] ?? self::DEFAULT_MONTHS);
        $sort = (string) ($filters['sort'] ?? self::DEFAULT_SORT);

        $from = CarbonImmutable::now()->startOfMonth()->subMonthsNoOverflow($months - 1);
        $to = CarbonImmutable::now()->endOfMonth();

        $factset = $this->aggregation->collectPlatformVendorOrders($from, $to);
        $rows = $factset['rows'];

        $vendors = $this->buildVendors($rows);
        $vendors = $this->sortVendors($vendors, $sort);

        return [
            'months' => $months,
            'vendors' => array_values($vendors),
        ];
    }

    /**
     * Group fact-set rows per partner and compute scorecard metrics.
     *
     * @param  list<PlatformVendorOrderRow>  $rows
     * @return list<array<string, mixed>>
     */
    private function buildVendors(array $rows): array
    {
        /** @var array<int, list<PlatformVendorOrderRow>> $byPartner */
        $byPartner = [];

        foreach ($rows as $row) {
            $byPartner[$row->partnerId][] = $row;
        }

        $vendors = [];

        foreach ($byPartner as $partnerId => $partnerRows) {
            $orderCount = count($partnerRows);

            if ($orderCount === 0) {
                continue;
            }

            $first = $partnerRows[0];

            $activeRows = array_filter($partnerRows, fn (PlatformVendorOrderRow $r): bool => $r->isActive());
            $completedCount = count(array_filter($partnerRows, fn (PlatformVendorOrderRow $r): bool => $r->isCompleted()));
            $cancelCount = count(array_filter($partnerRows, fn (PlatformVendorOrderRow $r): bool => $r->status === 'cancelled'));

            $gmv = 0;
            $commission = 0;
            $platformFee = 0;

            foreach ($activeRows as $row) {
                $gmv += $row->amount;
                $commission += $row->commissionAmount;
                $platformFee += $row->platformShare;
            }

            $ratedRows = array_filter($partnerRows, fn (PlatformVendorOrderRow $r): bool => $r->residentRating !== null);
            $ratedCount = count($ratedRows);
            $avgRating = $ratedCount > 0
                ? round(array_sum(array_map(fn (PlatformVendorOrderRow $r): int => (int) $r->residentRating, $ratedRows)) / $ratedCount, 1)
                : null;

            $productCount = count(array_filter($partnerRows, fn (PlatformVendorOrderRow $r): bool => $r->type === 'product'));
            $serviceCount = count(array_filter($partnerRows, fn (PlatformVendorOrderRow $r): bool => $r->type === 'service'));

            $vendors[] = [
                'partner_id' => $partnerId,
                'partner_name' => $first->partnerName,
                'status' => [
                    'value' => $first->partnerStatus ?? '',
                    'label' => $first->partnerStatusLabel ?? '',
                ],
                'order_count' => $orderCount,
                'active_count' => count($activeRows),
                'completed_count' => $completedCount,
                'cancel_count' => $cancelCount,
                'completion_rate' => $orderCount > 0 ? (int) round($completedCount / $orderCount * 100) : 0,
                'cancel_rate' => $orderCount > 0 ? (int) round($cancelCount / $orderCount * 100) : 0,
                'gmv' => $gmv,
                'commission' => $commission,
                'platform_fee' => $platformFee,
                'avg_rating' => $avgRating,
                'rated_count' => $ratedCount,
                'product_count' => $productCount,
                'service_count' => $serviceCount,
            ];
        }

        return $vendors;
    }

    /**
     * Sort vendors descending by the requested key. Null ratings sort last.
     *
     * @param  list<array<string, mixed>>  $vendors
     * @return list<array<string, mixed>>
     */
    private function sortVendors(array $vendors, string $sort): array
    {
        usort($vendors, function (array $a, array $b) use ($sort): int {
            $left = $a[$sort] ?? -1;
            $right = $b[$sort] ?? -1;

            return $right <=> $left;
        });

        return $vendors;
    }
}
