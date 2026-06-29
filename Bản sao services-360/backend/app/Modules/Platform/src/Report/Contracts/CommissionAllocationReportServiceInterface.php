<?php

namespace App\Modules\Platform\Report\Contracts;

interface CommissionAllocationReportServiceInterface
{
    /**
     * Assemble the commission allocation report (platform vs operating-company split).
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function build(array $filters): array;
}
