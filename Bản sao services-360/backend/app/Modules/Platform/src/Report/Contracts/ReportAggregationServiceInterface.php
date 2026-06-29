<?php

namespace App\Modules\Platform\Report\Contracts;

use Carbon\CarbonInterface;

interface ReportAggregationServiceInterface
{
    /**
     * Marketplace fact-set for [from, to], fetched once and cached per window.
     *
     * @return array{
     *     rows: list<\App\Modules\Platform\Report\Support\PlatformVendorOrderRow>,
     *     warnings: array{schema_missing: bool, skipped_orders: int}
     * }
     */
    public function collectPlatformVendorOrders(CarbonInterface $from, CarbonInterface $to): array;
}
