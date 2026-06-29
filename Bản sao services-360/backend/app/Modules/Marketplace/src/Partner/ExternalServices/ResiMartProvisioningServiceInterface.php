<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\Partner\ExternalServices;

interface ResiMartProvisioningServiceInterface
{
    /**
     * Ask resi_mart to provision a Tenant + schema for a marketplace partner.
     * Idempotent on resi_mart side — safe to retry.
     *
     * @param  array{partner_id: int, slug: string, name: string, subdomain: string, custom_domain?: string|null, owner_email?: string|null, categories?: list<string>}  $payload
     * @return ProvisionedVendor info returned by resi_mart on success
     *
     * @throws ResiMartProvisioningException when the remote call fails (network, auth, 5xx)
     */
    public function provisionVendor(array $payload): ProvisionedVendor;

    /**
     * Check if the integration is configured — used to short-circuit when
     * RESI_MART_INTERNAL_URL is empty (dev / partial deployments).
     */
    public function isEnabled(): bool;
}
