<?php

namespace App\Modules\Platform\Report\Controllers;

use App\Common\Controllers\BaseController;
use App\Modules\Platform\Report\Contracts\ReportOverviewServiceInterface;
use App\Modules\Platform\Report\Requests\ListReportOverviewRequest;
use Illuminate\Http\JsonResponse;

/**
 * @tags Platform Reports
 */
class ReportOverviewController extends BaseController
{
    public function __construct(protected ReportOverviewServiceInterface $service) {}

    /**
     * Hub tổng quan báo cáo: 4 KPI tổng (gom từ các báo cáo con) + số tenant + thẻ điều hướng 7 báo cáo.
     */
    public function index(ListReportOverviewRequest $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->service->build($request->validated()),
        ]);
    }
}
