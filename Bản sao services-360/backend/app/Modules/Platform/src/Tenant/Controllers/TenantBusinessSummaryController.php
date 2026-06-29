<?php

namespace App\Modules\Platform\Tenant\Controllers;

use App\Common\Controllers\BaseController;
use App\Modules\Platform\Tenant\Contracts\OrganizationServiceInterface;
use App\Modules\Platform\Tenant\Requests\ListTenantBusinessSummaryRequest;
use App\Modules\PMC\Order\ExternalServices\Platform\TenantBusinessSummaryExternalServiceInterface;
use Illuminate\Http\JsonResponse;

/**
 * Tổng quan kinh doanh của một tenant (công ty vận hành) xem từ cổng platform:
 * doanh thu + số đơn (đơn PMC hoàn thành) và phí nền tảng thực thu theo tháng.
 * Read-only, gom theo `completed_at` của đơn.
 *
 * @tags Platform Tenant Business Summary
 */
class TenantBusinessSummaryController extends BaseController
{
    public function __construct(
        protected OrganizationServiceInterface $organizationService,
        protected TenantBusinessSummaryExternalServiceInterface $businessSummaryService,
    ) {}

    /**
     * Monthly business summary (revenue, order count, platform fee) of a tenant.
     */
    public function index(ListTenantBusinessSummaryRequest $request, string $id): JsonResponse
    {
        $tenant = $this->organizationService->findById($id);

        $months = (int) ($request->validated()['months'] ?? 6);

        return response()->json([
            'success' => true,
            'data' => $this->businessSummaryService->getMonthlyBusinessSummary($tenant, $months),
        ]);
    }
}
