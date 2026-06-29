<?php

namespace App\Modules\Platform\Report\Services;

use App\Modules\Platform\Report\Contracts\ReportAggregationServiceInterface;
use App\Modules\Platform\Report\Contracts\RevenueReportServiceInterface;
use App\Modules\Platform\Report\Support\PlatformVendorOrderRow;
use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\Platform\Tenant\Repositories\OrganizationRepository;
use App\Modules\PMC\Order\ExternalServices\Platform\TenantBusinessSummaryExternalServiceInterface;
use App\Modules\PMC\Project\ExternalServices\Platform\TenantProjectExternalServiceInterface;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;

class RevenueReportService implements RevenueReportServiceInterface
{
    public const DEFAULT_MONTHS = 6;

    public function __construct(
        protected ReportAggregationServiceInterface $aggregation,
        protected OrganizationRepository $organizationRepository,
        protected TenantBusinessSummaryExternalServiceInterface $businessSummary,
        protected TenantProjectExternalServiceInterface $projects,
    ) {}

    /**
     * @param  array<string, mixed>  $filters
     * @return array{
     *     kpis: array<string, int>,
     *     by_tenant: list<array<string, mixed>>,
     *     analytics_months: list<array{month: string, month_label: string, order_count: int, tenant_revenue: int, platform_revenue: int}>,
     *     monthly_marketplace: list<array{month: string, month_label: string, gmv: int, platform_fee: int}>,
     * }
     */
    public function build(array $filters): array
    {
        $months = (int) ($filters['months'] ?? self::DEFAULT_MONTHS);
        $from = CarbonImmutable::now()->startOfMonth()->subMonthsNoOverflow($months - 1);
        $to = CarbonImmutable::now()->endOfMonth();

        $marketplace = $this->buildMarketplaceSection($from, $to, $months);
        $pmc = $this->buildPmcSection($from, $to, $months);

        $totalPlatformRevenue = $marketplace['marketplace_platform_fee']
            + $pmc['pmc_platform_fee'];

        return [
            'kpis' => [
                'total_platform_revenue' => $totalPlatformRevenue,
                'pmc_platform_fee' => $pmc['pmc_platform_fee'],
                'marketplace_gmv' => $marketplace['marketplace_gmv'],
                'order_count' => $marketplace['order_count'],
                'marketplace_platform_fee' => $marketplace['marketplace_platform_fee'],
                'marketplace_vh_share' => $marketplace['marketplace_vh_share'],
            ],
            'by_tenant' => $pmc['by_tenant'],
            'analytics_months' => $pmc['analytics_months'],
            'monthly_marketplace' => $marketplace['monthly_marketplace'],
        ];
    }

    /**
     * @return array{
     *     marketplace_gmv: int,
     *     order_count: int,
     *     marketplace_platform_fee: int,
     *     marketplace_vh_share: int,
     *     monthly_marketplace: list<array{month: string, month_label: string, gmv: int, platform_fee: int}>,
     * }
     */
    private function buildMarketplaceSection(CarbonInterface $from, CarbonInterface $to, int $months): array
    {
        $factset = $this->aggregation->collectPlatformVendorOrders($from, $to);

        $gmv = 0;
        $orderCount = 0;
        $platformFee = 0;
        $vhShare = 0;

        $skeleton = $this->buildMonthSkeleton($from, $months, ['gmv' => 0, 'platform_fee' => 0]);

        /** @var PlatformVendorOrderRow $row */
        foreach ($factset['rows'] as $row) {
            if (! $row->isActive()) {
                continue;
            }

            $gmv += $row->amount;
            $orderCount++;
            $platformFee += $row->platformShare;
            $vhShare += $row->vhShare;

            $monthKey = substr($row->createdAt, 0, 7);

            if (isset($skeleton[$monthKey])) {
                $skeleton[$monthKey]['gmv'] += $row->amount;
                $skeleton[$monthKey]['platform_fee'] += $row->platformShare;
            }
        }

        return [
            'marketplace_gmv' => $gmv,
            'order_count' => $orderCount,
            'marketplace_platform_fee' => $platformFee,
            'marketplace_vh_share' => $vhShare,
            'monthly_marketplace' => array_values($skeleton),
        ];
    }

    /**
     * @return array{
     *     pmc_platform_fee: int,
     *     by_tenant: list<array<string, mixed>>,
     *     analytics_months: list<array{month: string, month_label: string, order_count: int, tenant_revenue: int, platform_revenue: int}>,
     * }
     */
    private function buildPmcSection(CarbonInterface $from, CarbonInterface $to, int $months): array
    {
        $pmcPlatformFee = 0;
        $byTenant = [];
        $analyticsMonths = $this->buildMonthSkeleton($from, $months, [
            'order_count' => 0,
            'tenant_revenue' => 0,
            'platform_revenue' => 0,
        ]);

        foreach ($this->organizationRepository->allTenants() as $org) {
            /** @var Organization $org */
            $summary = $this->businessSummary->getMonthlyBusinessSummary($org, $months);

            $tenantPlatformFee = (int) round((float) $summary['summary']['platform_revenue']);
            $pmcPlatformFee += $tenantPlatformFee;

            foreach ($summary['months'] as $monthEntry) {
                $monthKey = (string) $monthEntry['month'];

                if (! isset($analyticsMonths[$monthKey])) {
                    continue;
                }

                $analyticsMonths[$monthKey]['month_label'] = (string) $monthEntry['label'];
                $analyticsMonths[$monthKey]['order_count'] += (int) $monthEntry['order_count'];
                $analyticsMonths[$monthKey]['tenant_revenue'] += (int) round((float) $monthEntry['tenant_revenue']);
                $analyticsMonths[$monthKey]['platform_revenue'] += (int) round((float) $monthEntry['platform_fee']);
            }

            $byTenant[] = [
                'company_id' => $org->id,
                'company_name' => $org->name,
                'status' => [
                    'value' => $org->is_active ? 'active' : 'inactive',
                    'label' => $org->is_active ? 'Đang hoạt động' : 'Vô hiệu',
                ],
                'project_count' => count($this->projects->getProjectsForTenant($org)),
                'order_count' => (int) $summary['summary']['order_count'],
                'tenant_revenue' => (int) round((float) $summary['summary']['tenant_revenue']),
                'platform_revenue' => $tenantPlatformFee,
            ];
        }

        usort(
            $byTenant,
            fn (array $a, array $b): int => $b['platform_revenue'] <=> $a['platform_revenue'],
        );

        return [
            'pmc_platform_fee' => $pmcPlatformFee,
            'by_tenant' => $byTenant,
            'analytics_months' => array_values($analyticsMonths),
        ];
    }

    /**
     * Ordered N-month skeleton keyed by Y-m, each pre-filled with the given zero fields.
     *
     * @param  array<string, int>  $zeroFields
     * @return array<string, array<string, mixed>>
     */
    private function buildMonthSkeleton(CarbonInterface $from, int $months, array $zeroFields): array
    {
        $skeleton = [];
        $cursor = $from->copy();

        for ($i = 0; $i < $months; $i++) {
            $key = $cursor->format('Y-m');
            $skeleton[$key] = array_merge([
                'month' => $key,
                'month_label' => 'T'.$cursor->month.'/'.$cursor->year,
            ], $zeroFields);
            $cursor = $cursor->addMonthNoOverflow();
        }

        return $skeleton;
    }
}
