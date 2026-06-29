<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\Partner\Http\Middleware;

use App\Common\Exceptions\BusinessException;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTenantVendorEnabled
{
    public function handle(Request $request, Closure $next): mixed
    {
        $tenant = function_exists('tenant') ? tenant() : null;

        if (! $tenant || ! ($tenant->is_vendor_enabled ?? false)) {
            throw new BusinessException(
                message: 'Tenant chưa kích hoạt gói vendor.',
                errorCode: 'VENDOR_FEATURE_DISABLED',
                httpStatusCode: Response::HTTP_FORBIDDEN,
            );
        }

        return $next($request);
    }
}
