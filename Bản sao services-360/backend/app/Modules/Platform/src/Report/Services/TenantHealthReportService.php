<?php

namespace App\Modules\Platform\Report\Services;

use App\Modules\Platform\Report\Contracts\TenantHealthReportServiceInterface;
use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\Platform\Tenant\Repositories\OrganizationRepository;
use App\Modules\PMC\Order\ExternalServices\Platform\TenantBusinessSummaryExternalServiceInterface;
use App\Modules\PMC\Project\ExternalServices\Platform\TenantProjectExternalServiceInterface;

class TenantHealthReportService implements TenantHealthReportServiceInterface
{
    public const DEFAULT_MONTHS = 6;

    public function __construct(
        protected OrganizationRepository $organizationRepository,
        protected TenantBusinessSummaryExternalServiceInterface $businessSummary,
        protected TenantProjectExternalServiceInterface $projects,
    ) {}

    /**
     * Báo cáo dựa HOÀN TOÀN trên đơn OG (đơn dịch vụ vận hành PMC) — KHÔNG dùng
     * đơn marketplace vendor. `by_company` roll-up theo công ty vận hành,
     * `by_project` drill-down theo dự án; mọi số liệu (số đơn, doanh thu, phí nền
     * tảng, CSAT) lấy từ đơn OG `completed`, CSAT từ `og_tickets.resident_rating`.
     *
     * @param  array<string, mixed>  $filters
     * @return array{
     *     by_company: list<array<string, mixed>>,
     *     by_project: list<array<string, mixed>>,
     * }
     */
    public function build(array $filters): array
    {
        $months = (int) ($filters['months'] ?? self::DEFAULT_MONTHS);
        $companyId = $filters['company_id'] ?? null;

        $byCompany = [];
        $byProject = [];

        foreach ($this->resolveOrganizations($companyId) as $org) {
            /** @var Organization $org */
            $breakdown = $this->businessSummary->getProjectBusinessBreakdown($org, $months);

            $orderCount = 0;
            $revenue = 0;
            $platformFee = 0;
            $ratingSum = 0;
            $ratedCount = 0;

            foreach ($breakdown as $project) {
                $orderCount += $project['order_count'];
                $revenue += $project['revenue'];
                $platformFee += $project['platform_fee'];
                $ratingSum += $project['rating_sum'];
                $ratedCount += $project['rated_count'];

                $byProject[] = [
                    'project_id' => $project['project_id'],
                    'project_name' => $project['project_name'],
                    'company_name' => $org->name,
                    'order_count' => $project['order_count'],
                    'revenue' => $project['revenue'],
                    'platform_fee' => $project['platform_fee'],
                    'avg_rating' => $project['rated_count'] > 0
                        ? round($project['rating_sum'] / $project['rated_count'], 1)
                        : null,
                    'rated_count' => $project['rated_count'],
                ];
            }

            [$lastMonthOrders, $orderTrend] = $this->resolveOrderTrend($org, $months);

            $byCompany[] = [
                'company_id' => $org->id,
                'company_name' => $org->name,
                'status' => [
                    'value' => $org->is_active ? 'active' : 'inactive',
                    'label' => $org->is_active ? 'Hoạt động' : 'Vô hiệu',
                ],
                'project_count' => count($this->projects->getProjectsForTenant($org)),
                'order_count' => $orderCount,
                'revenue' => $revenue,
                'platform_fee' => $platformFee,
                'avg_rating' => $ratedCount > 0 ? round($ratingSum / $ratedCount, 1) : null,
                'rated_count' => $ratedCount,
                'last_month_orders' => $lastMonthOrders,
                'order_trend' => $orderTrend,
            ];
        }

        usort($byCompany, fn (array $a, array $b): int => $b['revenue'] <=> $a['revenue']);
        usort($byProject, fn (array $a, array $b): int => $b['revenue'] <=> $a['revenue']);

        return [
            'by_company' => $byCompany,
            'by_project' => $byProject,
        ];
    }

    /**
     * Δ số đơn OG tháng cuối so tháng kề trước (cần ≥ 2 tháng) + số đơn tháng cuối.
     *
     * @return array{0: int, 1: int} [last_month_orders, order_trend]
     */
    private function resolveOrderTrend(Organization $org, int $months): array
    {
        $summaryMonths = $this->businessSummary->getMonthlyBusinessSummary($org, $months)['months'];
        $monthCount = count($summaryMonths);

        $lastMonthOrders = $monthCount > 0
            ? (int) $summaryMonths[$monthCount - 1]['order_count']
            : 0;

        $orderTrend = $monthCount >= 2
            ? (int) $summaryMonths[$monthCount - 1]['order_count'] - (int) $summaryMonths[$monthCount - 2]['order_count']
            : 0;

        return [$lastMonthOrders, $orderTrend];
    }

    /**
     * @return iterable<int, Organization>
     */
    private function resolveOrganizations(?string $companyId): iterable
    {
        if ($companyId === null) {
            return $this->organizationRepository->allTenants();
        }

        $org = $this->organizationRepository->allTenants()->firstWhere('id', $companyId);

        return $org !== null ? [$org] : [];
    }
}
