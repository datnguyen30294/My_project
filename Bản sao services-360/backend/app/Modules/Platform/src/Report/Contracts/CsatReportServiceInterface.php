<?php

namespace App\Modules\Platform\Report\Contracts;

interface CsatReportServiceInterface
{
    /**
     * Assemble the platform CSAT / quality report from the marketplace fact-set.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function build(array $filters): array;
}
