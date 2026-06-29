<?php

namespace App\Modules\Platform\Report\Controllers;

use App\Common\Controllers\BaseController;
use App\Modules\Platform\Report\Contracts\ServiceAdoptionReportServiceInterface;
use App\Modules\Platform\Report\Requests\ListServiceAdoptionReportRequest;
use Illuminate\Http\JsonResponse;

/**
 * @tags Platform Reports
 */
class ServiceAdoptionReportController extends BaseController
{
    public function __construct(protected ServiceAdoptionReportServiceInterface $service) {}

    /**
     * Báo cáo xu hướng dịch vụ marketplace (mix SP/DV, top offer theo số đơn, chuỗi đơn theo tháng).
     */
    public function index(ListServiceAdoptionReportRequest $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->service->build($request->validated()),
        ]);
    }
}
