<?php

declare(strict_types=1);

namespace App\Modules\Platform\Tenant\Middleware;

use App\Common\Exceptions\BusinessException;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTenantActive
{
    public function handle(Request $request, Closure $next): mixed
    {
        $tenant = function_exists('tenant') ? tenant() : null;

        if ($tenant !== null && ! ($tenant->is_active ?? true)) {
            throw new BusinessException(
                message: 'Công ty vận hành đã bị vô hiệu hoá. Vui lòng liên hệ quản trị nền tảng.',
                errorCode: 'TENANT_DISABLED',
                httpStatusCode: Response::HTTP_FORBIDDEN,
            );
        }

        return $next($request);
    }
}
