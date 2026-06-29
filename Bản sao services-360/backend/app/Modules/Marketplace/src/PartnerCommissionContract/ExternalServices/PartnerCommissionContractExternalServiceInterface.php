<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\PartnerCommissionContract\ExternalServices;

interface PartnerCommissionContractExternalServiceInterface
{
    /**
     * Look up the active commission contract for a (partner × tenant ×
     * project) scope. Returns null if no `active` contract exists, or if the
     * active one is past its `ends_at` (lazy expiry).
     *
     * @return array{
     *     id: int,
     *     contract_code: string,
     *     commission_mode: string,
     *     terms: array<string, mixed>,
     *     partner_id: int,
     *     tenant_id: string,
     *     project_id: int,
     *     activated_at: string|null
     * }|null
     */
    public function getActiveContractFor(int $partnerId, string $tenantId, int $projectId): ?array;

    /**
     * Build a contract snapshot suitable for embedding in an order
     * (`partner_id`, `partner_commission_contract_id`, plus a frozen copy of
     * the terms for reporting).
     *
     * @return array{
     *     id: int,
     *     contract_code: string,
     *     commission_mode: string,
     *     terms: array<string, mixed>,
     *     partner_id: int,
     *     tenant_id: string,
     *     project_id: int
     * }
     */
    public function snapshotForOrder(int $contractId): array;
}
