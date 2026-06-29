<?php

declare(strict_types=1);

namespace App\Modules\PMC\Project\ExternalServices\Platform;

use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\PMC\Project\Enums\ProjectStatus;
use App\Modules\PMC\Project\Models\Project;
use App\Modules\PMC\Project\Repositories\ProjectRepository;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class TenantProjectExternalService implements TenantProjectExternalServiceInterface
{
    public function listProjects(Organization $tenant, array $filters): LengthAwarePaginator
    {
        $filters['sort_by'] ??= 'name';
        $filters['sort_direction'] ??= 'asc';

        return $tenant->run(function () use ($filters): LengthAwarePaginator {
            $paginator = app(ProjectRepository::class)->list($filters);

            $paginator->through(fn (Project $project): array => $this->present($project));

            return $paginator;
        });
    }

    public function getProjectsForTenant(Organization $tenant): array
    {
        return $tenant->run(function (): array {
            return app(ProjectRepository::class)
                ->allSortedByName()
                ->map(fn (Project $project): array => $this->present($project))
                ->all();
        });
    }

    public function findProject(Organization $tenant, int $projectId): array
    {
        return $tenant->run(function () use ($projectId): array {
            /** @var Project $project */
            $project = app(ProjectRepository::class)->findById($projectId);

            return $this->present($project);
        });
    }

    public function createProject(Organization $tenant, array $data): array
    {
        return $tenant->run(function () use ($data): array {
            $repository = app(ProjectRepository::class);

            if ($repository->existsByCode($data['code'])) {
                throw ValidationException::withMessages([
                    'code' => 'Mã dự án đã tồn tại trong hệ thống.',
                ]);
            }

            // Transaction so the central-registry sync in ProjectObserver is
            // atomic with the project insert — a cross-tenant code clash rolls
            // both back.
            return DB::transaction(function () use ($repository, $data): array {
                /** @var Project $project */
                $project = $repository->create([
                    'code' => $data['code'],
                    'name' => $data['name'],
                    'address' => $data['address'] ?? null,
                    'status' => $data['status'] ?? ProjectStatus::Managing->value,
                ]);

                return $this->present($project);
            });
        });
    }

    /**
     * Display shape for a project — never exposes BQT bank info.
     *
     * @return array{
     *     id: int,
     *     code: string,
     *     name: string,
     *     address: string|null,
     *     status: array{value: string, label: string},
     * }
     */
    private function present(Project $project): array
    {
        return [
            'id' => (int) $project->id,
            'code' => (string) $project->code,
            'name' => (string) $project->name,
            'address' => $project->address !== null ? (string) $project->address : null,
            'status' => [
                'value' => $project->status->value,
                'label' => $project->status->label(),
            ],
        ];
    }
}
