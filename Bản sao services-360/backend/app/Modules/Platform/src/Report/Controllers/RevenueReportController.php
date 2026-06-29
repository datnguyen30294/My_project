<?php

namespace App\Modules\Platform\Report\Controllers;

use App\Common\Controllers\BaseController;
use App\Modules\Platform\Report\Contracts\RevenueReportServiceInterface;
use App\Modules\Platform\Report\Requests\ListRevenueReportRequest;
use Illuminate\Http\JsonResponse;

/**
 * @tags Platform Reports
 */
class RevenueReportController extends BaseController
{
    public function __construct(protected RevenueReportServiceInterface $service) {}

    /**
     * Báo cáo doanh thu platform (2 nguồn: hoa hồng marketplace + phí nền tảng PMC).
     */
    public function index(ListRevenueReportRequest $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->service->build($request->validated()),
        ]);
    }
}
