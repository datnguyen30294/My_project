<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\Partner\ExternalServices;

interface ResiMartOrderStatusServiceInterface
{
    public function isEnabled(): bool;

    /**
     * Override trạng thái 1 đơn vendor trong schema của tenant tại resi_mart.
     *
     * @param  string  $tenantId  resi_mart tenant id (= partner.tenant_id)
     * @param  int  $orderId  id đơn trong schema vendor
     * @param  string  $status  trạng thái đích (giá trị enum order resi_mart)
     * @param  string|null  $reason  lý do (bắt buộc cho một số transition cancel)
     */
    public function overrideStatus(string $tenantId, int $orderId, string $status, ?string $reason = null): void;
}
