<?php

namespace App\Modules\Platform\Report\Controllers;

use App\Common\Controllers\BaseController;
use App\Modules\Platform\Report\Contracts\TenantHealthReportServiceInterface;
use App\Modules\Platform\Report\Requests\ListTenantHealthReportRequest;
use Illuminate\Http\JsonResponse;

/**
 * @tags Platform Reports
 */
class TenantHealthReportController extends BaseController
{
    public function __construct(protected TenantHealthReportServiceInterface $service) {}

    /**
     * Báo cáo sức khỏe tenant & dự án (roll-up theo công ty vận hành + drill-down theo dự án).
     */
    public function index(ListTenantHealthReportRequest $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->service->build($request->validated()),
        ]);
    }
}
