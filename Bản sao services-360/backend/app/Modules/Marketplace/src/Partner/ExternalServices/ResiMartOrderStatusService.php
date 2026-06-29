<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\Partner\ExternalServices;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * HTTP client cho endpoint internal `PATCH /api/v1/internal/orders/{id}/status`
 * của resi_mart — platform console đổi trạng thái 1 đơn vendor.
 *
 * Auth: bearer token + X-Client header (giống {@see ResiMartProvisioningService}).
 * Đơn thuộc sở hữu resi_mart; resi_mart chạy domain logic của nó (ghi history,
 * timestamps) — residential KHÔNG ghi cross-DB trực tiếp.
 */
class ResiMartOrderStatusService implements ResiMartOrderStatusServiceInterface
{
    public function isEnabled(): bool
    {
        return (string) config('services.resi_mart.url') !== ''
            && (string) config('services.resi_mart.token') !== '';
    }

    public function overrideStatus(string $tenantId, int $orderId, string $status, ?string $reason = null): void
    {
        if (! $this->isEnabled()) {
            throw new ResiMartProvisioningException(
                'Resi_mart integration is not configured. Set RESI_MART_INTERNAL_URL and RESI_MART_INTERNAL_TOKEN.',
                context: ['config' => 'services.resi_mart'],
            );
        }

        $requestId = (string) Str::uuid();

        try {
            Http::baseUrl((string) config('services.resi_mart.url'))
                ->withHeaders([
                    'Authorization' => 'Bearer '.config('services.resi_mart.token'),
                    'X-Client' => 'residential-management',
                    'X-Request-Id' => $requestId,
                    'Accept' => 'application/json',
                ])
                ->timeout((int) config('services.resi_mart.timeout', 15))
                ->acceptJson()
                ->asJson()
                ->patch('/api/v1/internal/orders/'.$orderId.'/status', [
                    'tenant_id' => $tenantId,
                    'status' => $status,
                    'reason' => $reason,
                ])
                ->throw();
        } catch (ConnectionException $e) {
            Log::warning('resi_mart.order_status.connection_failed', [
                'request_id' => $requestId,
                'tenant_id' => $tenantId,
                'order_id' => $orderId,
                'message' => $e->getMessage(),
            ]);

            throw new ResiMartProvisioningException(
                'Không kết nối được resi_mart. Sẽ cần thử lại.',
                context: ['request_id' => $requestId, 'reason' => 'connection'],
                previous: $e,
            );
        } catch (RequestException $e) {
            $body = $e->response->json() ?? $e->response->body();

            Log::warning('resi_mart.order_status.http_error', [
                'request_id' => $requestId,
                'tenant_id' => $tenantId,
                'order_id' => $orderId,
                'status' => $e->response->status(),
                'body' => $body,
            ]);

            $message = is_array($body) && isset($body['message'])
                ? (string) $body['message']
                : 'Resi_mart từ chối đổi trạng thái đơn.';

            throw new ResiMartProvisioningException(
                $message,
                context: [
                    'request_id' => $requestId,
                    'status' => $e->response->status(),
                    'body' => $body,
                ],
                previous: $e,
            );
        }

        Log::info('resi_mart.order_status.success', [
            'request_id' => $requestId,
            'tenant_id' => $tenantId,
            'order_id' => $orderId,
            'status' => $status,
        ]);
    }
}
