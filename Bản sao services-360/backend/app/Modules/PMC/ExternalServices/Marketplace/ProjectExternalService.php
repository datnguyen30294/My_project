<?php

declare(strict_types=1);

namespace App\Modules\PMC\ExternalServices\Marketplace;

use App\Modules\PMC\Project\Repositories\ProjectRepository;

/**
 * Bridge để Marketplace module đọc tên project trong PMC tenant DB
 * mà không phải import trực tiếp Project model.
 */
class ProjectExternalService implements ProjectExternalServiceInterface
{
    public function __construct(
        protected ProjectRepository $repository,
    ) {}

    /**
     * @param  array<int, int>  $ids
     * @return array<int, string> keyed by project_id → name
     */
    public function getNamesByIds(array $ids): array
    {
        if ($ids === []) {
            return [];
        }

        return $this->repository
            ->pluckNamesByIds(collect($ids))
            ->all();
    }

    /**
     * @return array<int, int> list of project IDs in current tenant
     */
    public function getCurrentTenantProjectIds(): array
    {
        return \App\Modules\PMC\Project\Models\Project::query()
            ->pluck('id')
            ->map(fn ($v) => (int) $v)
            ->all();
    }
}
