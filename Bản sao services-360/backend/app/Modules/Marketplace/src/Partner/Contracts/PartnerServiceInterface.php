<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\Partner\Contracts;

use App\Modules\Marketplace\Partner\Models\Partner;
use Illuminate\Pagination\LengthAwarePaginator;

interface PartnerServiceInterface
{
    /**
     * @param  array<string, mixed>  $filters
     */
    public function list(array $filters): LengthAwarePaginator;

    public function findById(int $id): Partner;

    public function findBySlug(string $slug): Partner;

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Partner;

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data): Partner;

    public function delete(int $id): void;

    /**
     * Approve a pending vendor (`pending → active`).
     * Throws InvalidPartnerTransitionException when not pending.
     */
    public function approve(int $id, ?int $actorId = null): Partner;

    /**
     * Deactivate an active vendor (`active → suspended`).
     * Throws InvalidPartnerTransitionException when not active.
     */
    public function deactivate(int $id, ?int $actorId = null): Partner;

    /**
     * Reactivate a suspended vendor (`suspended → active`).
     * Throws InvalidPartnerTransitionException when not suspended.
     */
    public function reactivate(int $id, ?int $actorId = null): Partner;

    /**
     * Retry resi_mart provisioning for a partner whose create-time call
     * failed (tenant_id is null).
     */
    public function provision(int $id): Partner;

    /**
     * List partners the tenant works with: ones it owns plus ones it has
     * linked to its projects.
     *
     * @param  array<string, mixed>  $filters
     */
    public function listForTenant(string $ownerTenantId, array $filters): LengthAwarePaginator;

    /**
     * Catalog of active vendors the tenant can add to its projects. Each row
     * carries an `is_linked` flag.
     *
     * @param  array<string, mixed>  $filters
     */
    public function catalogForTenant(string $ownerTenantId, array $filters): LengthAwarePaginator;

    /**
     * Link an existing active vendor to the tenant's projects.
     *
     * @param  list<int>  $projectIds
     */
    public function attachForTenant(int $id, string $ownerTenantId, array $projectIds, ?int $actorId = null): Partner;

    /**
     * Unlink a vendor from the tenant's projects. Throws when a targeted
     * project still has an active commission contract.
     *
     * @param  list<int>  $projectIds
     */
    public function detachForTenant(int $id, string $ownerTenantId, array $projectIds, ?int $actorId = null): Partner;

    /**
     * Find a partner by id, scoped to a specific owner tenant.
     * Throws 404 BusinessException if the partner does not belong to that tenant.
     */
    public function findByIdForTenant(int $id, string $ownerTenantId): Partner;

    /**
     * Create a partner owned by the given tenant.
     *
     * @param  array<string, mixed>  $data
     */
    public function createForTenant(string $ownerTenantId, array $data): Partner;

    /**
     * Update a partner owned by the given tenant.
     *
     * @param  array<string, mixed>  $data
     */
    public function updateForTenant(int $id, string $ownerTenantId, array $data): Partner;

    /**
     * Delete a partner owned by the given tenant.
     * Throws 403 BusinessException if the vendor has already been provisioned.
     */
    public function deleteForTenant(int $id, string $ownerTenantId): void;

    /**
     * Retry resi_mart provisioning for a partner owned by the given tenant.
     * Throws 404 BusinessException if the partner does not belong to the tenant.
     */
    public function provisionForTenant(int $id, string $ownerTenantId): Partner;
}
