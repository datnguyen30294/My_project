<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\PartnerProject\Repositories;

use App\Common\Repositories\BaseRepository;
use App\Modules\Marketplace\PartnerProject\Models\PartnerProject;
use Illuminate\Database\Eloquent\Collection;

class PartnerProjectRepository extends BaseRepository
{
    public function __construct()
    {
        parent::__construct(new PartnerProject);
    }

    /**
     * Return the active pivots (partner + pause flag) for a single project
     * within a PMC tenant, ordered by partner id.
     *
     * @return Collection<int, PartnerProject>
     */
    public function listForProject(string $tenantId, int $projectId): Collection
    {
        return $this->newQuery()
            ->where('tenant_id', $tenantId)
            ->where('project_id', $projectId)
            ->orderBy('partner_id')
            ->get();
    }

    /**
     * Number of project links per partner (project_count for the console list).
     *
     * @param  list<int>  $partnerIds
     * @return array<int, int>
     */
    public function countsByPartnerIds(array $partnerIds): array
    {
        if ($partnerIds === []) {
            return [];
        }

        /** @var array<int, int> */
        return $this->newQuery()
            ->whereIn('partner_id', $partnerIds)
            ->selectRaw('partner_id, COUNT(*) as aggregate')
            ->groupBy('partner_id')
            ->pluck('aggregate', 'partner_id')
            ->mapWithKeys(fn ($count, $partnerId) => [(int) $partnerId => (int) $count])
            ->all();
    }

    /**
     * Distinct (tenant_id, project_id) scopes a partner is currently linked to,
     * across every tenant. Drives the "default commission" bulk fan-out.
     *
     * @return Collection<int, PartnerProject>
     */
    public function listScopesForPartner(int $partnerId): Collection
    {
        return $this->newQuery()
            ->where('partner_id', $partnerId)
            ->orderBy('tenant_id')
            ->orderBy('project_id')
            ->distinct()
            ->get(['tenant_id', 'project_id']);
    }

    /**
     * All pivots (full rows, incl. is_vendor_enabled) a partner has across
     * every tenant. Drives the console detail per-project table.
     *
     * @return Collection<int, PartnerProject>
     */
    public function allForPartner(int $partnerId): Collection
    {
        return $this->newQuery()
            ->where('partner_id', $partnerId)
            ->orderBy('tenant_id')
            ->orderBy('project_id')
            ->get();
    }

    /**
     * Flip the per-project pause flag for one partner. Returns the updated
     * pivot, or null when the partner is not linked to the project.
     */
    public function toggleEnabled(
        int $partnerId,
        string $tenantId,
        int $projectId,
        bool $enabled,
        ?int $actorId = null,
    ): ?PartnerProject {
        $pivot = $this->newQuery()
            ->where('partner_id', $partnerId)
            ->where('tenant_id', $tenantId)
            ->where('project_id', $projectId)
            ->first();

        if ($pivot === null) {
            return null;
        }

        $pivot->is_vendor_enabled = $enabled;
        $pivot->updated_by = $actorId;
        $pivot->save();

        return $pivot;
    }

    /**
     * Return the set of `project_id`s currently linked to a partner within a
     * given PMC tenant.
     *
     * @return list<int>
     */
    public function listProjectIdsForTenant(int $partnerId, string $tenantId): array
    {
        /** @var list<int> */
        return $this->newQuery()
            ->where('partner_id', $partnerId)
            ->where('tenant_id', $tenantId)
            ->pluck('project_id')
            ->map(fn ($v) => (int) $v)
            ->values()
            ->all();
    }

    /**
     * Return the distinct partner ids that have at least one active pivot row
     * within a given PMC tenant.
     *
     * @return list<int>
     */
    public function listPartnerIdsForTenant(string $tenantId): array
    {
        /** @var list<int> */
        return $this->newQuery()
            ->where('tenant_id', $tenantId)
            ->distinct()
            ->pluck('partner_id')
            ->map(fn ($v) => (int) $v)
            ->values()
            ->all();
    }

    /**
     * Link a partner to additional projects within a PMC tenant. Only inserts
     * pivots that are not already active — never removes existing links.
     *
     * @param  list<int>  $projectIds
     */
    public function attachProjects(
        int $partnerId,
        string $tenantId,
        array $projectIds,
        ?int $actorId = null,
    ): void {
        $existing = $this->newQuery()
            ->where('partner_id', $partnerId)
            ->where('tenant_id', $tenantId)
            ->pluck('project_id')
            ->map(fn ($v) => (int) $v)
            ->all();

        $desired = array_values(array_unique(array_map('intval', $projectIds)));

        foreach ($desired as $projectId) {
            if (in_array($projectId, $existing, true)) {
                continue;
            }

            PartnerProject::query()->create([
                'partner_id' => $partnerId,
                'tenant_id' => $tenantId,
                'project_id' => $projectId,
                'registered_at' => now(),
                'created_by' => $actorId,
                'updated_by' => $actorId,
            ]);
        }
    }

    /**
     * Soft-delete the pivots linking a partner to the given projects within a
     * PMC tenant. Scoped to `(partner_id, tenant_id)` — never touches another
     * tenant's links.
     *
     * @param  list<int>  $projectIds
     */
    public function detachProjects(
        int $partnerId,
        string $tenantId,
        array $projectIds,
        ?int $actorId = null,
    ): void {
        $targets = array_values(array_unique(array_map('intval', $projectIds)));

        if ($targets === []) {
            return;
        }

        $pivots = $this->newQuery()
            ->where('partner_id', $partnerId)
            ->where('tenant_id', $tenantId)
            ->whereIn('project_id', $targets)
            ->get();

        foreach ($pivots as $pivot) {
            $pivot->deleted_by = $actorId;
            $pivot->save();
            $pivot->delete();
        }
    }

    /**
     * Sync the projects a partner is allowed to serve in a given PMC tenant.
     *
     * Inserts missing pivots and soft-deletes pivots whose project_id is no
     * longer in the set. Scoped to `(partner_id, tenant_id)` — never touches
     * pivots that belong to another tenant.
     *
     * @param  list<int>  $projectIds
     */
    public function syncForPartnerInTenant(
        int $partnerId,
        string $tenantId,
        array $projectIds,
        ?int $actorId = null,
    ): void {
        $existing = $this->newQuery()
            ->where('partner_id', $partnerId)
            ->where('tenant_id', $tenantId)
            ->get()
            ->keyBy(fn (PartnerProject $p) => (int) $p->project_id);

        $desired = array_values(array_unique(array_map('intval', $projectIds)));

        foreach ($desired as $projectId) {
            if ($existing->has($projectId)) {
                continue;
            }

            PartnerProject::query()->create([
                'partner_id' => $partnerId,
                'tenant_id' => $tenantId,
                'project_id' => $projectId,
                'registered_at' => now(),
                'created_by' => $actorId,
                'updated_by' => $actorId,
            ]);
        }

        foreach ($existing as $projectId => $pivot) {
            if (! in_array((int) $projectId, $desired, true)) {
                $pivot->deleted_by = $actorId;
                $pivot->save();
                $pivot->delete();
            }
        }
    }
}
