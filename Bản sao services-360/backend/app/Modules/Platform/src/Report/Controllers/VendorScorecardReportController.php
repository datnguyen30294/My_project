<?php

namespace App\Modules\Platform\Report\Controllers;

use App\Common\Controllers\BaseController;
use App\Modules\Platform\Report\Contracts\VendorScorecardReportServiceInterface;
use App\Modules\Platform\Report\Requests\ListVendorScorecardReportRequest;
use Illuminate\Http\JsonResponse;

/**
 * @tags Platform Reports
 */
class VendorScorecardReportController extends BaseController
{
    public function __construct(protected VendorScorecardReportServiceInterface $service) {}

    /**
     * Bảng điểm hiệu suất vendor (toàn bộ vendor marketplace, xếp giảm dần theo chỉ số).
     */
    public function index(ListVendorScorecardReportRequest $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->service->build($request->validated()),
        ]);
    }
}
