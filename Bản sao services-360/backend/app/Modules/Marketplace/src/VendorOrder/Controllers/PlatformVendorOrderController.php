<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOrder\Controllers;

use App\Common\Controllers\BaseController;
use App\Common\Exceptions\BusinessException;
use App\Modules\Marketplace\VendorOrder\Contracts\VendorOrderServiceInterface;
use App\Modules\Marketplace\VendorOrder\Requests\AssignVendorOrderCommissionRequest;
use App\Modules\Marketplace\VendorOrder\Requests\ListPlatformVendorOrderRequest;
use App\Modules\Marketplace\VendorOrder\Requests\ListPlatformVendorOrderSummaryRequest;
use App\Modules\Marketplace\VendorOrder\Requests\ListVendorOrderRequest;
use App\Modules\Marketplace\VendorOrder\Requests\ListVendorOrderSummaryRequest;
use App\Modules\Marketplace\VendorOrder\Requests\PartnerRevenueTrendRequest;
use App\Modules\Marketplace\VendorOrder\Requests\UpdateVendorOrderStatusRequest;
use App\Modules\Marketplace\VendorOrder\Resources\VendorOrderDetailResource;
use App\Modules\Marketplace\VendorOrder\Resources\VendorOrderListResource;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * Platform admin — đọc đơn + hoa hồng của 1 vendor across MỌI PMC tenant.
 *
 * @tags Marketplace Vendor Orders (Platform)
 */
class PlatformVendorOrderController extends BaseController
{
    public function __construct(
        protected VendorOrderServiceInterface $service,
    ) {}

    /**
     * Console gộp — list ĐỌC-CHỈ mọi đơn vendor cross-vendor + cross-tenant.
     */
    public function allIndex(ListPlatformVendorOrderRequest $request): JsonResponse
    {
        $result = $this->service->listAllOrdersPlatform($request->validated());

        $paginator = $result['data'];

        return response()->json([
            'success' => true,
            'data' => collect($result['decorated'])
                ->map(fn ($row) => (new VendorOrderListResource($row))->resolve())
                ->all(),
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
     * Console gộp — 4 thẻ tổng hợp (orders/GMV/hoa hồng split/vendors).
     */
    public function allSummary(ListPlatformVendorOrderSummaryRequest $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->service->getSummaryAllOrdersPlatform($request->validated()),
        ]);
    }

    /**
     * List orders hoàn thành của vendor (mọi tenant) + commission breakdown.
     */
    public function index(ListVendorOrderRequest $request, int $partnerId): JsonResponse
    {
        $result = $this->service->listForPartnerPlatform($partnerId, $request->validated());

        $paginator = $result['data'];

        return response()->json([
            'success' => true,
            'data' => collect($result['decorated'])
                ->map(fn ($row) => (new VendorOrderListResource($row))->resolve())
                ->all(),
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
     * Chi tiết 1 đơn của vendor — items + commission breakdown.
     */
    public function show(int $partnerId, int $orderId): VendorOrderDetailResource
    {
        $detail = $this->service->getDetailPlatform($partnerId, $orderId);

        if ($detail === null) {
            throw new BusinessException(
                message: 'Đơn hàng không tồn tại.',
                errorCode: 'VENDOR_ORDER_NOT_FOUND',
                httpStatusCode: Response::HTTP_NOT_FOUND,
            );
        }

        return new VendorOrderDetailResource($detail);
    }

    /**
     * Gán/cập nhật hoa hồng thủ công cho 1 đơn vendor mồ côi (đã hoàn thành,
     * chưa khớp hợp đồng per_order). Trả về chi tiết đơn đã cập nhật.
     */
    public function assignCommission(AssignVendorOrderCommissionRequest $request, int $partnerId, int $orderId): VendorOrderDetailResource
    {
        return new VendorOrderDetailResource(
            $this->service->assignCommissionOverride($partnerId, $orderId, $request->validated()),
        );
    }

    /**
     * Override trạng thái 1 đơn vendor (any→any) — ghi qua S2S resi_mart.
     * Trả về chi tiết đơn đã cập nhật.
     */
    public function updateStatus(UpdateVendorOrderStatusRequest $request, int $partnerId, int $orderId): VendorOrderDetailResource
    {
        $data = $request->validated();

        return new VendorOrderDetailResource(
            $this->service->updateOrderStatusPlatform(
                $partnerId,
                $orderId,
                (string) $data['status'],
                $data['reason'] ?? null,
            ),
        );
    }

    /**
     * Gỡ hoa hồng gán thủ công khỏi 1 đơn vendor.
     */
    public function removeCommission(int $partnerId, int $orderId): JsonResponse
    {
        $this->service->removeCommissionOverride($partnerId, $orderId);

        return response()->json([
            'success' => true,
            'message' => 'Đã gỡ hoa hồng gán thủ công.',
        ]);
    }

    /**
     * Tổng đơn / doanh thu / hoa hồng của vendor (mọi tenant) trong range.
     */
    public function summary(ListVendorOrderSummaryRequest $request, int $partnerId): JsonResponse
    {
        $from = $request->validated('from') ? Carbon::parse($request->validated('from')) : null;
        $to = $request->validated('to') ? Carbon::parse($request->validated('to')) : null;

        $data = $this->service->getSummaryPlatform($partnerId, $from, $to);

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    /**
     * Doanh thu / số đơn / hoa hồng theo tháng của vendor (mặc định 6 tháng).
     */
    public function revenueTrend(PartnerRevenueTrendRequest $request, int $partnerId): JsonResponse
    {
        $months = (int) ($request->validated('months') ?? 6);

        return response()->json([
            'success' => true,
            'data' => $this->service->getRevenueTrendPlatform($partnerId, $months),
        ]);
    }
}
