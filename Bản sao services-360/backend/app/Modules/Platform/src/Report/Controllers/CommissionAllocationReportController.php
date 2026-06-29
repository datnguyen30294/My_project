<?php

namespace App\Modules\Platform\Report\Controllers;

use App\Common\Controllers\BaseController;
use App\Modules\Platform\Report\Contracts\CommissionAllocationReportServiceInterface;
use App\Modules\Platform\Report\Requests\ListCommissionAllocationReportRequest;
use Illuminate\Http\JsonResponse;

/**
 * @tags Platform Reports
 */
class CommissionAllocationReportController extends BaseController
{
    public function __construct(protected CommissionAllocationReportServiceInterface $service) {}

    /**
     * Báo cáo hoa hồng & phân bổ platform (chia Platform TNP vs công ty vận hành theo từng đối tượng nhận / vendor / dự án).
     */
    public function index(ListCommissionAllocationReportRequest $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->service->build($request->validated()),
        ]);
    }
}
