<?php

namespace App\Modules\Platform\Report\Services;

use App\Modules\Platform\Report\Contracts\CsatReportServiceInterface;
use App\Modules\Platform\Report\Contracts\ReportOverviewServiceInterface;
use App\Modules\Platform\Report\Contracts\ResidentSegmentReportServiceInterface;
use App\Modules\Platform\Report\Contracts\RevenueReportServiceInterface;
use App\Modules\Platform\Report\Contracts\VendorScorecardReportServiceInterface;
use App\Modules\Platform\Tenant\Repositories\OrganizationRepository;

class ReportOverviewService implements ReportOverviewServiceInterface
{
    public const DEFAULT_MONTHS = 6;

    public function __construct(
        protected RevenueReportServiceInterface $revenue,
        protected CsatReportServiceInterface $csat,
        protected ResidentSegmentReportServiceInterface $residentSegments,
        protected VendorScorecardReportServiceInterface $vendorScorecard,
        protected OrganizationRepository $organizationRepository,
    ) {}

    /**
     * @param  array<string, mixed>  $filters
     * @return array{
     *     kpis: array{
     *         total_platform_revenue: int,
     *         marketplace_gmv: int,
     *         avg_rating: float|int,
     *         rated_count: int,
     *         active_residents: int,
     *         total_residents: int,
     *         vendor_count: int,
     *         tenant_count: int,
     *     },
     *     report_cards: list<array{key: string, route: string, title: string, blurb: string, kpi: int|float, sub: string}>,
     * }
     */
    public function build(array $filters): array
    {
        $months = (int) ($filters['months'] ?? self::DEFAULT_MONTHS);
        $scoped = ['months' => $months];

        // Each sub-service is called exactly once with the shared window; they all
        // share the per-request ReportAggregationService cache, so the marketplace
        // fact-set is collected only once across the whole hub request.
        $revenue = $this->revenue->build($scoped);
        $csat = $this->csat->build($scoped);
        $residents = $this->residentSegments->build($scoped);
        $vendors = $this->vendorScorecard->build($scoped);

        $totalPlatformRevenue = (int) $revenue['kpis']['total_platform_revenue'];
        $marketplaceGmv = (int) $revenue['kpis']['marketplace_gmv'];
        $avgRating = $csat['kpis']['avg_rating'] ?? 0;
        $ratedCount = (int) $csat['kpis']['rated_count'];
        $activeResidents = (int) $residents['kpis']['active_residents'];
        $totalResidents = (int) $residents['kpis']['total_residents'];
        $vendorCount = count($vendors['vendors']);
        $tenantCount = $this->organizationRepository->allTenants()->count();

        return [
            'kpis' => [
                'total_platform_revenue' => $totalPlatformRevenue,
                'marketplace_gmv' => $marketplaceGmv,
                'avg_rating' => $avgRating,
                'rated_count' => $ratedCount,
                'active_residents' => $activeResidents,
                'total_residents' => $totalResidents,
                'vendor_count' => $vendorCount,
                'tenant_count' => $tenantCount,
            ],
            'report_cards' => $this->buildReportCards(
                $months,
                $totalPlatformRevenue,
                $marketplaceGmv,
                $avgRating,
                $ratedCount,
                $activeResidents,
                $totalResidents,
                $tenantCount,
                $vendorCount,
            ),
        ];
    }

    /**
     * 7 navigation cards in report order (#1 → #7), KPI values pulled verbatim
     * from the headline kpis so the hub never recomputes a number twice.
     *
     * @return list<array{key: string, route: string, title: string, blurb: string, kpi: int|float, sub: string}>
     */
    private function buildReportCards(
        int $months,
        int $totalPlatformRevenue,
        int $marketplaceGmv,
        float|int $avgRating,
        int $ratedCount,
        int $activeResidents,
        int $totalResidents,
        int $tenantCount,
        int $vendorCount,
    ): array {
        $base = '/platform/modules/bao-cao-tong-hop';

        return [
            [
                'key' => 'revenue',
                'route' => $base.'/doanh-thu-tong-hop',
                'title' => 'Doanh thu nền tảng',
                'blurb' => 'Tổng phí nền tảng thu được',
                'kpi' => $totalPlatformRevenue,
                'sub' => 'VND / '.$months.' tháng',
            ],
            [
                'key' => 'csat',
                'route' => $base.'/chat-luong-csat',
                'title' => 'Chất lượng & CSAT',
                'blurb' => 'Điểm hài lòng cư dân toàn nền tảng',
                'kpi' => $avgRating,
                'sub' => $ratedCount.' đơn đánh giá',
            ],
            [
                'key' => 'service-adoption',
                'route' => $base.'/xu-huong-dich-vu',
                'title' => 'Xu hướng dịch vụ',
                'blurb' => 'GMV & số đơn theo tháng',
                'kpi' => $marketplaceGmv,
                'sub' => 'GMV marketplace',
            ],
            [
                'key' => 'resident-segments',
                'route' => $base.'/phan-khuc-cu-dan',
                'title' => 'Phân khúc cư dân',
                'blurb' => 'Cư dân có đơn vs tổng danh bạ',
                'kpi' => $activeResidents,
                'sub' => '/ '.$totalResidents.' cư dân',
            ],
            [
                'key' => 'tenant-health',
                'route' => $base.'/suc-khoe-tenant-du-an',
                'title' => 'Sức khỏe công ty vận hành & dự án',
                'blurb' => 'Hiệu suất từng công ty vận hành',
                'kpi' => $tenantCount,
                'sub' => 'công ty vận hành',
            ],
            [
                'key' => 'commission-allocation',
                'route' => $base.'/hoa-hong-phan-bo',
                'title' => 'Hoa hồng & phân bổ',
                'blurb' => 'Phân bổ hoa hồng nền tảng & công ty vận hành',
                'kpi' => 0,
                'sub' => 'VND',
            ],
            [
                'key' => 'vendor-scorecard',
                'route' => $base.'/hieu-suat-vendor',
                'title' => 'Hiệu suất vendor',
                'blurb' => 'Xếp hạng vendor theo đơn & rating',
                'kpi' => $vendorCount,
                'sub' => 'vendor có đơn',
            ],
        ];
    }
}
