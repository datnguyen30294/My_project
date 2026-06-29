<?php

namespace App\Modules\Platform\Report\Contracts;

interface ServiceAdoptionReportServiceInterface
{
    /**
     * Assemble the platform service-adoption report from the marketplace vendor-order fact-set.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function build(array $filters): array;
}
