<?php

namespace App\Modules\Platform\Report\Controllers;

use App\Common\Controllers\BaseController;
use App\Modules\Platform\Report\Contracts\ResidentSegmentReportServiceInterface;
use App\Modules\Platform\Report\Requests\ListResidentSegmentReportRequest;
use Illuminate\Http\JsonResponse;

/**
 * @tags Platform Reports
 */
class ResidentSegmentReportController extends BaseController
{
    public function __construct(protected ResidentSegmentReportServiceInterface $service) {}

    /**
     * Báo cáo phân khúc cư dân platform (đơn marketplace theo customer_source + tổng danh bạ cư dân PMC).
     */
    public function index(ListResidentSegmentReportRequest $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->service->build($request->validated()),
        ]);
    }
}
