<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\ExternalServices\PMC;

use App\Common\Exceptions\BusinessException;
use App\Modules\Marketplace\VendorOrder\Contracts\VendorOrderServiceInterface;
use App\Modules\Marketplace\VendorOrder\ExternalServices\VendorOrderReportExternalServiceInterface;
use Symfony\Component\HttpFoundation\Response;

/**
 * Bridge for the PMC Report module to read completed vendor-order data (stored
 * cross-DB in resi_mart) without importing the Marketplace internals directly.
 */
class VendorOrderReportExternalService implements VendorOrderReportExternalServiceInterface
{
    public function __construct(
        protected VendorOrderServiceInterface $service,
    ) {}

    public function getCompletedOrdersForReport(array $filters): array
    {
        return $this->service->getCompletedOrdersForReport($this->currentTenantId(), $filters);
    }

    private function currentTenantId(): string
    {
        $tenant = function_exists('tenant') ? tenant() : null;

        if (! $tenant) {
            throw new BusinessException(
                message: 'Không xác định được tenant hiện tại.',
                errorCode: 'TENANT_NOT_RESOLVED',
                httpStatusCode: Response::HTTP_FORBIDDEN,
            );
        }

        return (string) $tenant->getKey();
    }
}
