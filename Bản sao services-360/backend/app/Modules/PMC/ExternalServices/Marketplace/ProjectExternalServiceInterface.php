<?php

declare(strict_types=1);

namespace App\Modules\PMC\ExternalServices\Marketplace;

interface ProjectExternalServiceInterface
{
    /**
     * @param  array<int, int>  $ids
     * @return array<int, string> keyed by id → name
     */
    public function getNamesByIds(array $ids): array;

    /**
     * @return array<int, int>
     */
    public function getCurrentTenantProjectIds(): array;
}
