<?php

namespace App\Modules\Platform\Tenant\Controllers;

use App\Common\Controllers\BaseController;
use App\Modules\Platform\Tenant\Contracts\PlatformProjectServiceInterface;
use App\Modules\Platform\Tenant\Requests\ListProjectBusinessSummaryRequest;
use Illuminate\Http\JsonResponse;

/**
 * Tổng quan kinh doanh theo tháng của một dự án (doanh thu, số đơn, phí nền tảng).
 * Read-only, gom theo `completed_at` của đơn, lọc theo dự án.
 *
 * @tags Platform Projects
 */
class PlatformProjectBusinessSummaryController extends BaseController
{
    public function __construct(
        protected PlatformProjectServiceInterface $service,
    ) {}

    /**
     * Monthly business summary (revenue, order count, platform fee) of a project.
     */
    public function index(ListProjectBusinessSummaryRequest $request, string $id, int $projectId): JsonResponse
    {
        $months = (int) ($request->validated()['months'] ?? 6);

        return response()->json([
            'success' => true,
            'data' => $this->service->businessSummary($id, $projectId, $months),
        ]);
    }
}
