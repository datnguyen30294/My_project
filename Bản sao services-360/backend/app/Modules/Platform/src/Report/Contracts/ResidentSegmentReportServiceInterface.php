<?php

namespace App\Modules\Platform\Report\Contracts;

interface ResidentSegmentReportServiceInterface
{
    /**
     * Assemble the resident-segment report from the marketplace fact-set + PMC resident count.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function build(array $filters): array;
}
