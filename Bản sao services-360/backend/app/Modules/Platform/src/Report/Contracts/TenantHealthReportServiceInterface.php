<?php

namespace App\Modules\Platform\Report\Contracts;

interface TenantHealthReportServiceInterface
{
    /**
     * Assemble the tenant-health report: per-company roll-up + per-project drill-down.
     *
     * GMV/platform_fee/order_count/avg_rating come from the marketplace fact-set;
     * order_trend comes from the PMC business summary. The two domains are NEVER summed.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function build(array $filters): array;
}
