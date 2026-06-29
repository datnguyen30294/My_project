<?php

declare(strict_types=1);

namespace App\Modules\PMC\Project\Services;

use App\Common\Exceptions\BusinessException;
use App\Modules\PMC\Project\Enums\ProjectStatus;
use App\Modules\PMC\Project\Models\Project;
use Illuminate\Database\Connection;
use Illuminate\Database\QueryException;
use Symfony\Component\HttpFoundation\Response;

/**
 * Keeps the central `platform_projects` registry in sync with each tenant
 * project, and enforces cross-tenant `code` uniqueness.
 *
 * Writes go through the PROJECT's own connection (schema-qualified) so they
 * share the same transaction as the project insert/update — a duplicate `code`
 * raises the partial-unique violation which rolls the whole thing back. Driven
 * by {@see \App\Modules\PMC\Project\Observers\ProjectObserver}.
 *
 * If there is no active tenant context (e.g. a non-tenant test/console flow),
 * sync is skipped — registry only matters for real tenant-scoped writes.
 */
class ProjectRegistrar
{
    public function sync(Project $project): void
    {
        $tenantId = $this->currentTenantId();

        if ($tenantId === null) {
            return;
        }

        $conn = $project->getConnection();
        $table = $this->tableFor($conn);
        $now = now();

        $payload = [
            'code' => (string) $project->code,
            'name' => (string) $project->name,
            'status' => $this->statusValue($project),
            'deleted_at' => null,
            'updated_at' => $now,
        ];

        try {
            $matched = $conn->table($table)
                ->where('tenant_id', $tenantId)
                ->where('project_id', $project->id);

            if ((clone $matched)->exists()) {
                $matched->update($payload);

                return;
            }

            $conn->table($table)->insert($payload + [
                'tenant_id' => $tenantId,
                'project_id' => $project->id,
                'created_at' => $now,
            ]);
        } catch (QueryException $e) {
            $this->rethrowIfDuplicate($e);

            throw $e;
        }
    }

    public function softDelete(Project $project): void
    {
        $tenantId = $this->currentTenantId();

        if ($tenantId === null) {
            return;
        }

        $conn = $project->getConnection();

        $conn->table($this->tableFor($conn))
            ->where('tenant_id', $tenantId)
            ->where('project_id', $project->id)
            ->whereNull('deleted_at')
            ->update(['deleted_at' => now(), 'updated_at' => now()]);
    }

    public function forceDelete(Project $project): void
    {
        $tenantId = $this->currentTenantId();

        if ($tenantId === null) {
            return;
        }

        $conn = $project->getConnection();

        $conn->table($this->tableFor($conn))
            ->where('tenant_id', $tenantId)
            ->where('project_id', $project->id)
            ->delete();
    }

    private function statusValue(Project $project): string
    {
        return $project->status instanceof ProjectStatus
            ? $project->status->value
            : (string) $project->status;
    }

    /**
     * The registry lives in the `public` schema; while a tenant connection's
     * search_path points at the tenant schema we must qualify it. SQLite (tests)
     * has no schemas, so use the bare table name.
     */
    private function tableFor(Connection $conn): string
    {
        return $conn->getDriverName() === 'pgsql'
            ? 'public.platform_projects'
            : 'platform_projects';
    }

    private function currentTenantId(): ?string
    {
        if (! function_exists('tenant')) {
            return null;
        }

        $tenant = tenant();

        return $tenant !== null ? (string) $tenant->getTenantKey() : null;
    }

    private function rethrowIfDuplicate(QueryException $e): void
    {
        $isDuplicate = ($e->errorInfo[0] ?? null) === '23505'
            || str_contains(strtolower($e->getMessage()), 'unique');

        if ($isDuplicate) {
            throw new BusinessException(
                message: 'Mã dự án đã tồn tại trên nền tảng. Vui lòng chọn mã khác.',
                errorCode: 'PROJECT_CODE_DUPLICATE_PLATFORM',
                httpStatusCode: Response::HTTP_UNPROCESSABLE_ENTITY,
            );
        }
    }
}
