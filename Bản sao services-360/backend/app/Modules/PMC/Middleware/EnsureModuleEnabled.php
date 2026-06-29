<?php

declare(strict_types=1);

namespace App\Modules\PMC\Middleware;

use App\Common\Exceptions\BusinessException;
use App\Modules\Platform\Tenant\Enums\TenantModule;
use App\Modules\Platform\Tenant\ExternalServices\PMC\TenantConfigExternalServiceInterface;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Chặn API của module nghiệp vụ đã bị platform tắt cho tenant
 * (tenant_configs.enabled_modules). Map theo segment đầu tiên sau /api/v1/pmc/.
 * Segment không có trong map (vd: customers, dashboard) → luôn cho qua.
 */
class EnsureModuleEnabled
{
    /** @var array<string, TenantModule> */
    private const SEGMENT_MODULE_MAP = [
        'accounts' => TenantModule::Hrm,
        'departments' => TenantModule::Hrm,
        'job-titles' => TenantModule::Hrm,
        'roles' => TenantModule::Hrm,
        'permissions' => TenantModule::Hrm,
        'projects' => TenantModule::Hrm,

        'og-tickets' => TenantModule::TicketManagement,
        'og-ticket-categories' => TenantModule::TicketManagement,

        'shifts' => TenantModule::WorkManagement,
        'work-schedules' => TenantModule::WorkManagement,
        'schedule-slots' => TenantModule::WorkManagement,
        'workforce' => TenantModule::WorkManagement,

        'quotes' => TenantModule::OrderManagement,
        'orders' => TenantModule::OrderManagement,

        'catalog' => TenantModule::WarehouseAndService,

        'advance-payments' => TenantModule::AccountingFinance,
        'receivables' => TenantModule::AccountingFinance,
        'reconciliations' => TenantModule::AccountingFinance,
        'closing-periods' => TenantModule::AccountingFinance,
        'commission-summary' => TenantModule::AccountingFinance,
        'commission' => TenantModule::AccountingFinance,
        'treasury' => TenantModule::AccountingFinance,

        'reports' => TenantModule::Report,

        'settings' => TenantModule::Setting,
        'policies' => TenantModule::Setting,
    ];

    public function __construct(
        protected TenantConfigExternalServiceInterface $tenantConfigExternalService,
    ) {}

    public function handle(Request $request, Closure $next): mixed
    {
        $module = $this->resolveModule($request);

        if ($module === null) {
            return $next($request);
        }

        $limits = $this->tenantConfigExternalService->getLimitsForCurrentTenant();

        if ($limits !== null && ! $limits->isModuleEnabled($module->value)) {
            throw new BusinessException(
                message: "Module \"{$module->label()}\" chưa được kích hoạt cho công ty của bạn. Vui lòng liên hệ quản trị nền tảng.",
                errorCode: 'MODULE_DISABLED',
                httpStatusCode: Response::HTTP_FORBIDDEN,
            );
        }

        return $next($request);
    }

    private function resolveModule(Request $request): ?TenantModule
    {
        $segments = $request->segments();
        $pmcIndex = array_search('pmc', $segments, true);

        if ($pmcIndex === false || ! isset($segments[$pmcIndex + 1])) {
            return null;
        }

        return self::SEGMENT_MODULE_MAP[$segments[$pmcIndex + 1]] ?? null;
    }
}
