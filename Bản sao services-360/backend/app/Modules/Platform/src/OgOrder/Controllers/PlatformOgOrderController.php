<?php

declare(strict_types=1);

namespace App\Modules\Platform\OgOrder\Controllers;

use App\Common\Controllers\BaseController;
use App\Modules\Platform\OgOrder\Contracts\OgOrderConsoleServiceInterface;
use App\Modules\Platform\OgOrder\Requests\ListOgOrderRequest;
use App\Modules\Platform\OgOrder\Requests\ListOgOrderSummaryRequest;
use Illuminate\Http\JsonResponse;

/**
 * Platform admin — đọc gộp mọi đơn OG (dịch vụ vận hành) cross-tenant.
 *
 * @tags Platform OG Orders
 */
class PlatformOgOrderController extends BaseController
{
    public function __construct(
        protected OgOrderConsoleServiceInterface $service,
    ) {}

    /**
     * Console gộp — list ĐỌC-CHỈ mọi đơn OG cross-tenant.
     */
    public function index(ListOgOrderRequest $request): JsonResponse
    {
        $result = $this->service->listAll($request->validated());

        $paginator = $result['data'];

        return response()->json([
            'success' => true,
            'data' => $result['rows'],
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
            ],
            'warnings' => $result['warnings'],
        ]);
    }

    /**
     * Console gộp — 4 thẻ tổng hợp (đơn / GMV / phí nền tảng / số công ty VH).
     */
    public function summary(ListOgOrderSummaryRequest $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->service->getSummary($request->validated()),
        ]);
    }
}
