<?php

namespace App\Modules\Platform\Report\Contracts;

use Carbon\CarbonInterface;

interface PlatformVendorOrderAggregationExternalServiceInterface
{
    /**
     * Platform-wide marketplace orders for [from, to], one normalized row per order,
     * across ALL partners. Loops partners + ResiMartConnection internally.
     * Degrades to empty rows + warnings (schema_missing) — never throws to caller.
     *
     * @return array{
     *     rows: list<\App\Modules\Platform\Report\Support\PlatformVendorOrderRow>,
     *     warnings: array{schema_missing: bool, skipped_orders: int}
     * }
     */
    public function collectOrders(CarbonInterface $from, CarbonInterface $to): array;
}
