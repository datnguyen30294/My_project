<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\ExternalServices\PMC;

use App\Modules\Marketplace\PartnerCommissionContract\Contracts\PartnerCommissionContractServiceInterface;
use App\Modules\Marketplace\PartnerCommissionContract\ExternalServices\PartnerCommissionContractExternalServiceInterface;

/**
 * Bridge for the PMC module (running in a tenant DB) to look up the central
 * `partner_commission_contracts` table without importing the Model directly.
 */
class PartnerCommissionContractExternalService implements PartnerCommissionContractExternalServiceInterface
{
    public function __construct(
        protected PartnerCommissionContractServiceInterface $service,
    ) {}

    /**
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
    public function getActiveContractFor(int $partnerId, string $tenantId, int $projectId): ?array
    {
        $contract = $this->service->getActiveContractFor($partnerId, $tenantId, $projectId);

        if ($contract === null) {
            return null;
        }

        return [
            'id' => $contract->id,
            'contract_code' => $contract->contract_code,
            'commission_mode' => $contract->commission_mode->value,
            'terms' => $contract->terms ?? [],
            'partner_id' => $contract->partner_id,
            'tenant_id' => $contract->tenant_id,
            'project_id' => $contract->project_id,
            'activated_at' => $contract->activated_at?->toIso8601String(),
        ];
    }

    /**
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
    public function snapshotForOrder(int $contractId): array
    {
        $contract = $this->service->getDetail($contractId);

        return [
            'id' => $contract->id,
            'contract_code' => $contract->contract_code,
            'commission_mode' => $contract->commission_mode->value,
            'terms' => $contract->terms ?? [],
            'partner_id' => $contract->partner_id,
            'tenant_id' => $contract->tenant_id,
            'project_id' => $contract->project_id,
        ];
    }
}
