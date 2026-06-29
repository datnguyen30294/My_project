<?php

declare(strict_types=1);

namespace App\Modules\Platform\Tenant\Middleware;

use App\Common\Exceptions\BusinessException;
use App\Modules\Platform\Tenant\ExternalServices\PMC\TenantConfigExternalServiceInterface;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Chặn portal đã bị platform tắt cho tenant. Dùng dạng tham số:
 * `tenant.portal:resident` (app cư dân) / `tenant.portal:partner` (đăng ký dịch vụ).
 */
class EnsureTenantPortalEnabled
{
    public function __construct(
        protected TenantConfigExternalServiceInterface $tenantConfigExternalService,
    ) {}

    public function handle(Request $request, Closure $next, string $portal): mixed
    {
        $limits = $this->tenantConfigExternalService->getLimitsForCurrentTenant();

        if ($limits === null) {
            return $next($request);
        }

        $enabled = match ($portal) {
            'resident' => $limits->residentPortalEnabled,
            'partner' => $limits->partnerPortalEnabled,
            default => true,
        };

        if (! $enabled) {
            throw new BusinessException(
                message: $portal === 'resident'
                    ? 'Công ty chưa mở dịch vụ trên ứng dụng cư dân.'
                    : 'Công ty chưa mở chức năng đăng ký cung cấp dịch vụ.',
                errorCode: 'PORTAL_DISABLED',
                httpStatusCode: Response::HTTP_FORBIDDEN,
            );
        }

        return $next($request);
    }
}
