<?php

namespace App\Modules\Platform\Report\Contracts;

interface RevenueReportServiceInterface
{
    /**
     * Assemble the platform revenue report from marketplace + PMC sources.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function build(array $filters): array;
}
