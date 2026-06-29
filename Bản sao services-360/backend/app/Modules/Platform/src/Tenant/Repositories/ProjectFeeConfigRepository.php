<?php

namespace App\Modules\Platform\Tenant\Repositories;

use App\Common\Repositories\BaseRepository;
use App\Modules\Platform\Tenant\Models\ProjectFeeConfig;

class ProjectFeeConfigRepository extends BaseRepository
{
    public function __construct()
    {
        parent::__construct(new ProjectFeeConfig);
    }

    /**
     * Override configs of a tenant keyed by `project_id` for cheap lookup when
     * merging cross-tenant project lists.
     *
     * @return array<int, ProjectFeeConfig>
     */
    public function mapByProjectId(string $organizationId): array
    {
        /** @var array<int, ProjectFeeConfig> */
        return $this->newQuery()
            ->where('organization_id', $organizationId)
            ->get()
            ->keyBy('project_id')
            ->all();
    }

    public function findForProject(string $organizationId, int $projectId): ?ProjectFeeConfig
    {
        /** @var ProjectFeeConfig|null */
        return $this->newQuery()
            ->where('organization_id', $organizationId)
            ->where('project_id', $projectId)
            ->first();
    }

    /**
     * Get the config for a project, creating a default (inherit tenant config,
     * service enabled) one when it does not exist yet.
     */
    public function firstOrCreateForProject(string $organizationId, int $projectId): ProjectFeeConfig
    {
        /** @var ProjectFeeConfig */
        return $this->newQuery()->firstOrCreate(
            ['organization_id' => $organizationId, 'project_id' => $projectId],
            ['inherit_default' => true, 'platform_service_enabled' => true],
        );
    }
}
