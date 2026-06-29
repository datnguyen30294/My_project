<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\Partner\ExternalServices;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * HTTP client for resi_mart's internal `/api/v1/internal/vendors` endpoint.
 *
 * Auth: bearer token + X-Client header. Token is the raw value; resi_mart
 * hashes (sha256) and compares with `hash_equals()`.
 *
 * Idempotent — resi_mart returns the existing Tenant if slug already taken,
 * so PMC can retry safely on timeout or for re-provisioning a partner whose
 * earlier attempt failed.
 */
class ResiMartProvisioningService implements ResiMartProvisioningServiceInterface
{
    public function isEnabled(): bool
    {
        return (string) config('services.resi_mart.url') !== ''
            && (string) config('services.resi_mart.token') !== '';
    }

    /**
     * @param  array{partner_id: int, slug: string, name: string, subdomain: string, custom_domain?: string|null, owner_email?: string|null, categories?: list<string>}  $payload
     */
    public function provisionVendor(array $payload): ProvisionedVendor
    {
        if (! $this->isEnabled()) {
            throw new ResiMartProvisioningException(
                'Resi_mart integration is not configured. Set RESI_MART_INTERNAL_URL and RESI_MART_INTERNAL_TOKEN.',
                context: ['config' => 'services.resi_mart'],
            );
        }

        $requestId = (string) Str::uuid();

        try {
            $response = Http::baseUrl((string) config('services.resi_mart.url'))
                ->withHeaders([
                    'Authorization' => 'Bearer '.config('services.resi_mart.token'),
                    'X-Client' => 'residential-management',
                    'X-Request-Id' => $requestId,
                    'Accept' => 'application/json',
                ])
                ->timeout((int) config('services.resi_mart.timeout', 15))
                ->acceptJson()
                ->asJson()
                ->post('/api/v1/internal/vendors', [
                    'partner_id' => $payload['partner_id'],
                    'slug' => $payload['slug'],
                    'name' => $payload['name'],
                    'subdomain' => $payload['subdomain'],
                    'custom_domain' => $payload['custom_domain'] ?? null,
                    'owner_email' => $payload['owner_email'] ?? null,
                    'categories' => $payload['categories'] ?? [],
                ])
                ->throw();
        } catch (ConnectionException $e) {
            Log::warning('resi_mart.provision.connection_failed', [
                'request_id' => $requestId,
                'slug' => $payload['slug'],
                'message' => $e->getMessage(),
            ]);

            throw new ResiMartProvisioningException(
                'Không kết nối được resi_mart. Sẽ cần thử lại.',
                context: ['request_id' => $requestId, 'reason' => 'connection'],
                previous: $e,
            );
        } catch (RequestException $e) {
            Log::warning('resi_mart.provision.http_error', [
                'request_id' => $requestId,
                'slug' => $payload['slug'],
                'status' => $e->response->status(),
                'body' => $e->response->json() ?? $e->response->body(),
            ]);

            throw new ResiMartProvisioningException(
                'Resi_mart trả về lỗi khi provision tenant.',
                context: [
                    'request_id' => $requestId,
                    'status' => $e->response->status(),
                    'body' => $e->response->json() ?? $e->response->body(),
                ],
                previous: $e,
            );
        }

        $body = (array) $response->json('data', []);

        Log::info('resi_mart.provision.success', [
            'request_id' => $requestId,
            'slug' => $payload['slug'],
            'tenant_id' => $body['tenant_id'] ?? null,
            'domains' => $body['domains'] ?? [],
        ]);

        return ProvisionedVendor::fromArray($body);
    }
}
