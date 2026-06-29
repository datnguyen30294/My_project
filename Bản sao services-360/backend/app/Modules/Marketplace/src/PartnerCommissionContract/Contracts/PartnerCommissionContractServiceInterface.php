<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\PartnerCommissionContract\Contracts;

use App\Modules\Marketplace\PartnerCommissionContract\Models\PartnerCommissionContract;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface PartnerCommissionContractServiceInterface
{
    /**
     * @param  array<string, mixed>  $filters
     */
    public function listForPlatform(array $filters): LengthAwarePaginator;

    /**
     * @param  array<string, mixed>  $filters
     */
    public function listForTenant(string $tenantId, int $partnerId, int $projectId, array $filters): LengthAwarePaginator;

    public function getDetail(int $id): PartnerCommissionContract;

    /**
     * Như {@see getDetail} nhưng gắn thêm tên tenant + tên project (resolve
     * cross-tenant) — phục vụ platform scope.
     */
    public function getDetailForPlatform(int $id): PartnerCommissionContract;

    /**
     * @param  array<string, mixed>  $data
     */
    public function createDraft(array $data, ?int $actorId = null): PartnerCommissionContract;

    /**
     * Fan-out a single "default" commission terms set into one draft contract
     * per project the vendor is linked to.
     *
     * @param  array<string, mixed>  $data
     * @return array{
     *     created: list<PartnerCommissionContract>,
     *     skipped: list<array{tenant_id: string, project_id: int}>,
     * }
     */
    public function bulkCreateDefaults(int $partnerId, array $data, ?int $actorId = null): array;

    /**
     * @param  array<string, mixed>  $data
     */
    public function updateDraft(int $id, array $data, ?int $actorId = null): PartnerCommissionContract;

    /**
     * @param  array<string, mixed>  $data
     */
    public function updatePendingNotes(int $id, array $data, ?int $actorId = null): PartnerCommissionContract;

    public function discardDraft(int $id, ?int $actorId = null): void;

    public function sign(int $id, ?int $actorId = null): PartnerCommissionContract;

    public function revokePending(int $id, string $reason, ?int $actorId = null): PartnerCommissionContract;

    public function switchTo(int $pendingContractId, ?int $actorId = null): PartnerCommissionContract;

    public function cancelActive(int $id, string $reason, ?int $actorId = null): PartnerCommissionContract;

    public function getActiveContractFor(int $partnerId, string $tenantId, int $projectId): ?PartnerCommissionContract;

    /**
     * @return Collection<int, PartnerCommissionContract>
     */
    public function getHistoryFor(int $partnerId, string $tenantId, int $projectId): Collection;
}
