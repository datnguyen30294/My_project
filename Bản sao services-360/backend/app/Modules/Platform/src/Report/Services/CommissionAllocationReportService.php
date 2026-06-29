<?php

namespace App\Modules\Platform\Report\Services;

use App\Modules\Platform\Report\Contracts\CommissionAllocationReportServiceInterface;
use App\Modules\Platform\Report\Contracts\ReportAggregationServiceInterface;
use App\Modules\Platform\Report\Support\PlatformVendorOrderRow;
use App\Modules\Platform\Tenant\Repositories\OrganizationRepository;
use Carbon\CarbonImmutable;

class CommissionAllocationReportService implements CommissionAllocationReportServiceInterface
{
    public const DEFAULT_MONTHS = 6;

    public function __construct(
        protected ReportAggregationServiceInterface $aggregation,
        protected OrganizationRepository $organizationRepository,
    ) {}

    /**
     * @param  array<string, mixed>  $filters
     * @return array{
     *     kpis: array{commission_total: int, platform_total: int, vh_total: int, platform_share_pct: int, vh_share_pct: int},
     *     by_recipient: list<array{recipient_id: string, label: string, order_count: int, amount: int}>,
     *     by_vendor: list<array{partner_id: int, partner_name: string, order_count: int, gmv: int, commission: int, platform_share: int, vh_share: int}>,
     *     by_project: list<array{project_id: int, project_name: string, order_count: int, platform_share: int, vh_share: int}>,
     *     warnings: array<string, mixed>,
     * }
     */
    public function build(array $filters): array
    {
        $months = (int) ($filters['months'] ?? self::DEFAULT_MONTHS);
        $from = CarbonImmutable::now()->startOfMonth()->subMonthsNoOverflow($months - 1);
        $to = CarbonImmutable::now()->endOfMonth();

        $factset = $this->aggregation->collectPlatformVendorOrders($from, $to);

        /** @var list<PlatformVendorOrderRow> $rows */
        $rows = array_values(array_filter(
            $factset['rows'],
            fn (PlatformVendorOrderRow $row): bool => $row->isActive(),
        ));

        return [
            'kpis' => $this->buildKpis($rows),
            'by_recipient' => $this->buildByRecipient($rows),
            'by_vendor' => $this->buildByVendor($rows),
            'by_project' => $this->buildByProject($rows),
            'warnings' => $factset['warnings'],
        ];
    }

    /**
     * @param  list<PlatformVendorOrderRow>  $rows
     * @return array{commission_total: int, platform_total: int, vh_total: int, platform_share_pct: int, vh_share_pct: int}
     */
    private function buildKpis(array $rows): array
    {
        $commissionTotal = 0;
        $platformTotal = 0;
        $vhTotal = 0;

        foreach ($rows as $row) {
            $commissionTotal += $row->commissionAmount;
            $platformTotal += $row->platformShare;
            $vhTotal += $row->vhShare;
        }

        $platformSharePct = $commissionTotal > 0
            ? (int) round($platformTotal / $commissionTotal * 100)
            : 0;
        $vhSharePct = $commissionTotal > 0
            ? 100 - $platformSharePct
            : 0;

        return [
            'commission_total' => $commissionTotal,
            'platform_total' => $platformTotal,
            'vh_total' => $vhTotal,
            'platform_share_pct' => $platformSharePct,
            'vh_share_pct' => $vhSharePct,
        ];
    }

    /**
     * @param  list<PlatformVendorOrderRow>  $rows
     * @return list<array{recipient_id: string, label: string, order_count: int, amount: int}>
     */
    private function buildByRecipient(array $rows): array
    {
        $orgNameMap = $this->organizationRepository->allTenants()->keyBy('id');

        $platformCount = 0;
        $platformAmount = 0;
        $byCompany = [];

        foreach ($rows as $row) {
            if ($row->recipient === 'platform') {
                $platformCount++;
                $platformAmount += $row->commissionAmount;

                continue;
            }

            if ($row->recipient === 'operating_company') {
                $companyId = (string) $row->organizationId;

                if (! isset($byCompany[$companyId])) {
                    $byCompany[$companyId] = ['order_count' => 0, 'amount' => 0];
                }

                $byCompany[$companyId]['order_count']++;
                $byCompany[$companyId]['amount'] += $row->commissionAmount;
            }
        }

        $allocation = [];

        if ($platformCount > 0) {
            $allocation[] = [
                'recipient_id' => 'platform',
                'label' => 'Platform TNP',
                'order_count' => $platformCount,
                'amount' => $platformAmount,
            ];
        }

        foreach ($byCompany as $companyId => $bucket) {
            $organization = $orgNameMap->get($companyId);

            $allocation[] = [
                'recipient_id' => $companyId,
                'label' => $organization->name ?? $companyId,
                'order_count' => $bucket['order_count'],
                'amount' => $bucket['amount'],
            ];
        }

        usort(
            $allocation,
            fn (array $a, array $b): int => $b['amount'] <=> $a['amount'],
        );

        return $allocation;
    }

    /**
     * @param  list<PlatformVendorOrderRow>  $rows
     * @return list<array{partner_id: int, partner_name: string, order_count: int, gmv: int, commission: int, platform_share: int, vh_share: int}>
     */
    private function buildByVendor(array $rows): array
    {
        $byVendor = [];

        foreach ($rows as $row) {
            if (! isset($byVendor[$row->partnerId])) {
                $byVendor[$row->partnerId] = [
                    'partner_id' => $row->partnerId,
                    'partner_name' => $row->partnerName,
                    'order_count' => 0,
                    'gmv' => 0,
                    'commission' => 0,
                    'platform_share' => 0,
                    'vh_share' => 0,
                ];
            }

            $byVendor[$row->partnerId]['order_count']++;
            $byVendor[$row->partnerId]['gmv'] += $row->amount;
            $byVendor[$row->partnerId]['commission'] += $row->commissionAmount;
            $byVendor[$row->partnerId]['platform_share'] += $row->platformShare;
            $byVendor[$row->partnerId]['vh_share'] += $row->vhShare;
        }

        $byVendor = array_values($byVendor);

        usort(
            $byVendor,
            fn (array $a, array $b): int => $b['commission'] <=> $a['commission'],
        );

        return $byVendor;
    }

    /**
     * @param  list<PlatformVendorOrderRow>  $rows
     * @return list<array{project_id: int, project_name: string, order_count: int, platform_share: int, vh_share: int}>
     */
    private function buildByProject(array $rows): array
    {
        $byProject = [];

        foreach ($rows as $row) {
            if ($row->projectId === null) {
                continue;
            }

            if (! isset($byProject[$row->projectId])) {
                $byProject[$row->projectId] = [
                    'project_id' => $row->projectId,
                    'project_name' => $row->projectName ?? ('Dự án #'.$row->projectId),
                    'order_count' => 0,
                    'platform_share' => 0,
                    'vh_share' => 0,
                ];
            }

            $byProject[$row->projectId]['order_count']++;
            $byProject[$row->projectId]['platform_share'] += $row->platformShare;
            $byProject[$row->projectId]['vh_share'] += $row->vhShare;
        }

        $byProject = array_values($byProject);

        usort(
            $byProject,
            fn (array $a, array $b): int => $b['platform_share'] <=> $a['platform_share'],
        );

        return $byProject;
    }
}
