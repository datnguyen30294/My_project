<?php

namespace App\Modules\Platform\Report\Services;

use App\Modules\Platform\Report\Contracts\PlatformVendorOrderAggregationExternalServiceInterface;
use App\Modules\Platform\Report\Contracts\ReportAggregationServiceInterface;
use App\Modules\Platform\Report\Support\PlatformVendorOrderRow;
use App\Modules\PMC\Project\ExternalServices\Platform\PlatformProjectDirectoryExternalServiceInterface;
use Carbon\CarbonInterface;

class ReportAggregationService implements ReportAggregationServiceInterface
{
    /** @var array<string, array{rows: list<PlatformVendorOrderRow>, warnings: array{schema_missing: bool, skipped_orders: int}}> */
    private array $cache = [];

    public function __construct(
        protected PlatformVendorOrderAggregationExternalServiceInterface $aggregation,
        protected PlatformProjectDirectoryExternalServiceInterface $projectDirectory,
    ) {}

    public function collectPlatformVendorOrders(CarbonInterface $from, CarbonInterface $to): array
    {
        $key = $from->toDateString().'|'.$to->toDateString();

        return $this->cache[$key] ??= $this->resolveProjectNames(
            $this->aggregation->collectOrders($from, $to)
        );
    }

    /**
     * Đơn vendor resi_mart chỉ lưu `projectId` (không lưu tên), nên gắn tên dự án
     * thật từ registry trung tâm `platform_projects` theo khóa `(tenant_id,
     * project_id)`. Chỉ điền khi `projectName` đang null — giữ nguyên giá trị
     * nguồn đã có; báo cáo dưới hạ nguồn tự fallback "Dự án #<id>" khi không khớp.
     *
     * @param  array{rows: list<PlatformVendorOrderRow>, warnings: array{schema_missing: bool, skipped_orders: int}}  $factset
     * @return array{rows: list<PlatformVendorOrderRow>, warnings: array{schema_missing: bool, skipped_orders: int}}
     */
    private function resolveProjectNames(array $factset): array
    {
        $nameMap = $this->projectDirectory->getProjectNameMap();

        if ($nameMap === []) {
            return $factset;
        }

        $factset['rows'] = array_map(
            function (PlatformVendorOrderRow $row) use ($nameMap): PlatformVendorOrderRow {
                if ($row->projectName !== null || $row->projectId === null || $row->organizationId === null) {
                    return $row;
                }

                $name = $nameMap[$row->organizationId.'|'.$row->projectId] ?? null;

                return $name !== null ? $row->withProjectName($name) : $row;
            },
            $factset['rows'],
        );

        return $factset;
    }
}
