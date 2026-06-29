<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\Partner\Controllers;

use App\Common\Controllers\BaseController;
use App\Modules\Marketplace\Partner\Requests\ListPartnerRatingRequest;
use App\Modules\Marketplace\Partner\Services\PlatformPartnerRatingService;
use Illuminate\Http\JsonResponse;

/**
 * Đánh giá cư dân theo vendor — đọc cross-DB bảng `order_reviews` ở schema
 * resi_mart của vendor (1 review / đơn đã hoàn tất, chỉ tính review publish).
 * Suy biến an toàn về empty khi vendor chưa provision / chưa có dữ liệu.
 *
 * @tags Marketplace Vendor Ratings (Platform)
 */
class PlatformPartnerRatingController extends BaseController
{
    public function __construct(
        protected PlatformPartnerRatingService $service,
    ) {}

    /**
     * List resident ratings for a vendor.
     */
    public function index(ListPartnerRatingRequest $request, int $partnerId): JsonResponse
    {
        $result = $this->service->list($partnerId, $request->validated());

        return response()->json([
            'success' => true,
            'data' => $result['data'],
            'summary' => $result['summary'],
            'meta' => $result['meta'],
            'warnings' => $result['warnings'],
        ]);
    }
}
