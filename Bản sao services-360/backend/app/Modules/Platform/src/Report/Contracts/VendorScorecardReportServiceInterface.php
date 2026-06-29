<?php

namespace App\Modules\Platform\Report\Contracts;

interface VendorScorecardReportServiceInterface
{
    /**
     * Assemble the platform-wide vendor scorecard from the marketplace fact-set.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function build(array $filters): array;
}
