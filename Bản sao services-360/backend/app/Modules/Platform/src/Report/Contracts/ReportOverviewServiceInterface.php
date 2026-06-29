<?php

namespace App\Modules\Platform\Report\Contracts;

interface ReportOverviewServiceInterface
{
    /**
     * Compose the hub overview: 4 headline KPIs (drawn verbatim from the
     * underlying report services) + tenant count + 7 navigation cards.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function build(array $filters): array;
}
