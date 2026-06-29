<?php

namespace App\Modules\Platform\Report\Services;

use App\Modules\Platform\Report\Contracts\CsatReportServiceInterface;
use App\Modules\Platform\Report\Contracts\ReportAggregationServiceInterface;
use App\Modules\Platform\Report\Support\PlatformVendorOrderRow;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;

class CsatReportService implements CsatReportServiceInterface
{
    public const DEFAULT_MONTHS = 6;

    public function __construct(
        protected ReportAggregationServiceInterface $aggregation,
    ) {}

    /**
     * @param  array<string, mixed>  $filters
     * @return array{
     *     kpis: array{avg_rating: float|null, rated_count: int, total_orders: int, completion_rate: int, cancel_rate: int, response_rate: int},
     *     star_buckets: list<array{star: int, count: int}>,
     *     by_vendor: list<array<string, mixed>>,
     *     by_project: list<array<string, mixed>>,
     *     low_ratings: list<array<string, mixed>>,
     *     warnings: array{schema_missing: bool, skipped_orders: int},
     * }
     */
    public function build(array $filters): array
    {
        [$from, $to] = $this->resolveWindow($filters);

        $factset = $this->aggregation->collectPlatformVendorOrders($from, $to);
        /** @var list<PlatformVendorOrderRow> $rows */
        $rows = $factset['rows'];

        $rated = array_values(array_filter(
            $rows,
            fn (PlatformVendorOrderRow $row): bool => $row->residentRating !== null,
        ));

        $total = count($rows);
        $ratedCount = count($rated);
        $completed = count(array_filter($rows, fn (PlatformVendorOrderRow $row): bool => $row->isCompleted()));
        $cancelled = count(array_filter($rows, fn (PlatformVendorOrderRow $row): bool => $row->status === 'cancelled'));

        return [
            'kpis' => [
                'avg_rating' => $this->averageRating($rated),
                'rated_count' => $ratedCount,
                'total_orders' => $total,
                'completion_rate' => $total > 0 ? (int) round($completed / $total * 100) : 0,
                'cancel_rate' => $total > 0 ? (int) round($cancelled / $total * 100) : 0,
                'response_rate' => $total > 0 ? (int) round($ratedCount / $total * 100) : 0,
            ],
            'star_buckets' => $this->buildStarBuckets($rated),
            'by_vendor' => $this->buildByVendor($rows),
            'by_project' => $this->buildByProject($rows),
            'low_ratings' => $this->buildLowRatings($rated),
            'warnings' => $factset['warnings'],
        ];
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return array{0: CarbonInterface, 1: CarbonInterface}
     */
    private function resolveWindow(array $filters): array
    {
        if (! empty($filters['from']) && ! empty($filters['to'])) {
            return [
                CarbonImmutable::parse((string) $filters['from'])->startOfDay(),
                CarbonImmutable::parse((string) $filters['to'])->endOfDay(),
            ];
        }

        $months = (int) ($filters['months'] ?? self::DEFAULT_MONTHS);

        return [
            CarbonImmutable::now()->startOfMonth()->subMonthsNoOverflow($months - 1),
            CarbonImmutable::now()->endOfMonth(),
        ];
    }

    /**
     * @param  list<PlatformVendorOrderRow>  $rated
     */
    private function averageRating(array $rated): ?float
    {
        if ($rated === []) {
            return null;
        }

        $sum = array_sum(array_map(fn (PlatformVendorOrderRow $row): int => (int) $row->residentRating, $rated));

        return round($sum / count($rated), 1);
    }

    /**
     * @param  list<PlatformVendorOrderRow>  $rated
     * @return list<array{star: int, count: int}>
     */
    private function buildStarBuckets(array $rated): array
    {
        $buckets = [];

        foreach ([5, 4, 3, 2, 1] as $star) {
            $buckets[] = [
                'star' => $star,
                'count' => count(array_filter(
                    $rated,
                    fn (PlatformVendorOrderRow $row): bool => $row->residentRating === $star,
                )),
            ];
        }

        return $buckets;
    }

    /**
     * @param  list<PlatformVendorOrderRow>  $rows
     * @return list<array<string, mixed>>
     */
    private function buildByVendor(array $rows): array
    {
        $groups = [];

        foreach ($rows as $row) {
            $groups[$row->partnerId] ??= [
                'partner_id' => $row->partnerId,
                'partner_name' => $row->partnerName,
                'order_count' => 0,
                'completed_count' => 0,
                'cancel_count' => 0,
                'rated_count' => 0,
                'rating_sum' => 0,
            ];

            $groups[$row->partnerId]['order_count']++;

            if ($row->isCompleted()) {
                $groups[$row->partnerId]['completed_count']++;
            }

            if ($row->status === 'cancelled') {
                $groups[$row->partnerId]['cancel_count']++;
            }

            if ($row->residentRating !== null) {
                $groups[$row->partnerId]['rated_count']++;
                $groups[$row->partnerId]['rating_sum'] += $row->residentRating;
            }
        }

        $vendors = array_map(function (array $group): array {
            $avgRating = $group['rated_count'] > 0
                ? round($group['rating_sum'] / $group['rated_count'], 1)
                : null;

            return [
                'partner_id' => $group['partner_id'],
                'partner_name' => $group['partner_name'],
                'order_count' => $group['order_count'],
                'completed_count' => $group['completed_count'],
                'cancel_count' => $group['cancel_count'],
                'avg_rating' => $avgRating,
                'rated_count' => $group['rated_count'],
            ];
        }, array_values($groups));

        $this->sortByAvgRatingDescNullLast($vendors);

        return $vendors;
    }

    /**
     * @param  list<PlatformVendorOrderRow>  $rows
     * @return list<array<string, mixed>>
     */
    private function buildByProject(array $rows): array
    {
        $groups = [];

        foreach ($rows as $row) {
            if ($row->projectId === null) {
                continue;
            }

            $groups[$row->projectId] ??= [
                'project_id' => $row->projectId,
                'project_name' => $row->projectName ?? ('Dự án #'.$row->projectId),
                'order_count' => 0,
                'rated_count' => 0,
                'rating_sum' => 0,
            ];

            $groups[$row->projectId]['order_count']++;

            if ($row->residentRating !== null) {
                $groups[$row->projectId]['rated_count']++;
                $groups[$row->projectId]['rating_sum'] += $row->residentRating;
            }
        }

        $projects = array_map(function (array $group): array {
            $avgRating = $group['rated_count'] > 0
                ? round($group['rating_sum'] / $group['rated_count'], 1)
                : null;

            return [
                'project_id' => $group['project_id'],
                'project_name' => $group['project_name'],
                'order_count' => $group['order_count'],
                'avg_rating' => $avgRating,
                'rated_count' => $group['rated_count'],
            ];
        }, array_values($groups));

        $this->sortByAvgRatingDescNullLast($projects);

        return $projects;
    }

    /**
     * @param  list<PlatformVendorOrderRow>  $rated
     * @return list<array<string, mixed>>
     */
    private function buildLowRatings(array $rated): array
    {
        $low = array_values(array_filter(
            $rated,
            fn (PlatformVendorOrderRow $row): bool => (int) $row->residentRating <= 3,
        ));

        usort(
            $low,
            fn (PlatformVendorOrderRow $a, PlatformVendorOrderRow $b): int => (int) $a->residentRating <=> (int) $b->residentRating,
        );

        return array_map(
            fn (PlatformVendorOrderRow $row): array => [
                'partner_name' => $row->partnerName,
                'project_name' => $row->projectName ?? ('Dự án #'.$row->projectId),
                'resident_name' => $row->residentName,
                'resident_rating' => $row->residentRating,
                'resident_rating_comment' => $row->residentRatingComment,
            ],
            array_slice($low, 0, 10),
        );
    }

    /**
     * Sort rows by `avg_rating` descending, pushing null ratings to the end.
     *
     * @param  list<array<string, mixed>>  $rows
     */
    private function sortByAvgRatingDescNullLast(array &$rows): void
    {
        usort($rows, function (array $a, array $b): int {
            if ($a['avg_rating'] === null && $b['avg_rating'] === null) {
                return 0;
            }

            if ($a['avg_rating'] === null) {
                return 1;
            }

            if ($b['avg_rating'] === null) {
                return -1;
            }

            return $b['avg_rating'] <=> $a['avg_rating'];
        });
    }
}
