<?php

namespace App\Modules\Platform\Report\Services;

use App\Modules\Platform\Report\Contracts\ReportAggregationServiceInterface;
use App\Modules\Platform\Report\Contracts\ResidentSegmentReportServiceInterface;
use App\Modules\Platform\Report\Support\PlatformVendorOrderRow;
use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\Platform\Tenant\Repositories\OrganizationRepository;
use App\Modules\PMC\Customer\ExternalServices\Platform\TenantCustomerCountExternalServiceInterface;
use Carbon\CarbonImmutable;

class ResidentSegmentReportService implements ResidentSegmentReportServiceInterface
{
    public const DEFAULT_MONTHS = 6;

    /**
     * @var list<string>
     */
    private const SOURCES = ['project', 'walk_in'];

    public function __construct(
        protected ReportAggregationServiceInterface $aggregation,
        protected OrganizationRepository $organizationRepository,
        protected TenantCustomerCountExternalServiceInterface $customerCount,
    ) {}

    /**
     * @param  array<string, mixed>  $filters
     * @return array{
     *     kpis: array<string, int>,
     *     segments: list<array{source: array{value: string, label: string}, order_count: int, gmv: int, avg_rating: float|null, rated_count: int}>,
     *     top_residents: list<array{resident_name: string|null, order_count: int, gmv: int, avg_rating: float|null, rated_count: int}>,
     * }
     */
    public function build(array $filters): array
    {
        $months = (int) ($filters['months'] ?? self::DEFAULT_MONTHS);
        $from = CarbonImmutable::now()->startOfMonth()->subMonthsNoOverflow($months - 1);
        $to = CarbonImmutable::now()->endOfMonth();

        $factset = $this->aggregation->collectPlatformVendorOrders($from, $to);

        /** @var list<PlatformVendorOrderRow> $active */
        $active = array_values(array_filter(
            $factset['rows'],
            fn (PlatformVendorOrderRow $row): bool => $row->isActive(),
        ));

        $totalActive = count($active);

        return [
            'kpis' => $this->buildKpis($active, $totalActive),
            'segments' => $this->buildSegments($active),
            'top_residents' => $this->buildTopResidents($active),
        ];
    }

    /**
     * @param  list<PlatformVendorOrderRow>  $active
     * @return array<string, int>
     */
    private function buildKpis(array $active, int $totalActive): array
    {
        $residentIds = [];
        $projectCount = 0;
        $walkInCount = 0;
        $projectGmv = 0;
        $walkInGmv = 0;

        foreach ($active as $row) {
            if ($row->residentId !== null) {
                $residentIds[$row->residentId] = true;
            }

            if ($row->customerSource === 'project') {
                $projectCount++;
                $projectGmv += $row->amount;
            } elseif ($row->customerSource === 'walk_in') {
                $walkInCount++;
                $walkInGmv += $row->amount;
            }
        }

        $totalResidents = 0;

        foreach ($this->organizationRepository->allTenants() as $org) {
            /** @var Organization $org */
            $totalResidents += $this->customerCount->countResidentsForTenant($org);
        }

        return [
            'active_residents' => count($residentIds),
            'total_residents' => $totalResidents,
            'project_order_share' => $totalActive > 0 ? (int) round($projectCount / $totalActive * 100) : 0,
            'walk_in_order_share' => $totalActive > 0 ? (int) round($walkInCount / $totalActive * 100) : 0,
            'project_gmv' => $projectGmv,
            'walk_in_gmv' => $walkInGmv,
        ];
    }

    /**
     * @param  list<PlatformVendorOrderRow>  $active
     * @return list<array{source: array{value: string, label: string}, order_count: int, gmv: int, avg_rating: float|null, rated_count: int}>
     */
    private function buildSegments(array $active): array
    {
        $segments = [];

        foreach (self::SOURCES as $source) {
            $rows = array_values(array_filter(
                $active,
                fn (PlatformVendorOrderRow $row): bool => $row->customerSource === $source,
            ));

            $segments[] = array_merge(
                [
                    'source' => [
                        'value' => $source,
                        'label' => $source === 'project' ? 'Cư dân dự án' : 'Khách vãng lai',
                    ],
                ],
                $this->aggregateRows($rows),
            );
        }

        return $segments;
    }

    /**
     * @param  list<PlatformVendorOrderRow>  $active
     * @return list<array{resident_name: string|null, order_count: int, gmv: int, avg_rating: float|null, rated_count: int}>
     */
    private function buildTopResidents(array $active): array
    {
        /** @var array<int, list<PlatformVendorOrderRow>> $byResident */
        $byResident = [];

        foreach ($active as $row) {
            if ($row->residentId === null) {
                continue;
            }

            $byResident[$row->residentId][] = $row;
        }

        $residents = [];

        foreach ($byResident as $rows) {
            $residents[] = array_merge(
                ['resident_name' => $rows[0]->residentName],
                $this->aggregateRows($rows),
            );
        }

        usort(
            $residents,
            fn (array $a, array $b): int => $b['order_count'] <=> $a['order_count']
                ?: $b['gmv'] <=> $a['gmv'],
        );

        return array_slice($residents, 0, 10);
    }

    /**
     * @param  list<PlatformVendorOrderRow>  $rows
     * @return array{order_count: int, gmv: int, avg_rating: float|null, rated_count: int}
     */
    private function aggregateRows(array $rows): array
    {
        $gmv = 0;
        $ratingSum = 0;
        $ratedCount = 0;

        foreach ($rows as $row) {
            $gmv += $row->amount;

            if ($row->residentRating !== null) {
                $ratingSum += $row->residentRating;
                $ratedCount++;
            }
        }

        return [
            'order_count' => count($rows),
            'gmv' => $gmv,
            'avg_rating' => $ratedCount > 0 ? round($ratingSum / $ratedCount, 1) : null,
            'rated_count' => $ratedCount,
        ];
    }
}
