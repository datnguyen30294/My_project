<?php

namespace App\Modules\Platform\Report\Controllers;

use App\Common\Controllers\BaseController;
use App\Modules\Platform\Report\Contracts\CsatReportServiceInterface;
use App\Modules\Platform\Report\Requests\ListCsatReportRequest;
use Illuminate\Http\JsonResponse;

/**
 * @tags Platform Reports
 */
class CsatReportController extends BaseController
{
    public function __construct(protected CsatReportServiceInterface $service) {}

    /**
     * Báo cáo chất lượng & CSAT (đánh giá cư dân trên đơn marketplace vendor).
     */
    public function index(ListCsatReportRequest $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->service->build($request->validated()),
        ]);
    }
}
