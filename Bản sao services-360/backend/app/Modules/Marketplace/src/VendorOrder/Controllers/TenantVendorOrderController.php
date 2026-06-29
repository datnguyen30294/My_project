<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOrder\Controllers;

use App\Common\Controllers\BaseController;
use App\Common\Exceptions\BusinessException;
use App\Modules\Marketplace\VendorOrder\Contracts\VendorOrderServiceInterface;
use App\Modules\Marketplace\VendorOrder\Requests\ListVendorOrderRequest;
use App\Modules\Marketplace\VendorOrder\Requests\ListVendorOrderSummaryRequest;
use App\Modules\Marketplace\VendorOrder\Resources\VendorOrderDetailResource;
use App\Modules\Marketplace\VendorOrder\Resources\VendorOrderListResource;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * @tags Marketplace Vendor Orders (Tenant)
 */
class TenantVendorOrderController extends BaseController
{
    public function __construct(
        protected VendorOrderServiceInterface $service,
    ) {}

    /**
     * List orders completed của vendor cho current tenant + commission breakdown.
     */
    public function index(ListVendorOrderRequest $request, int $partnerId): JsonResponse
    {
        $result = $this->service->listForPartner(
            $partnerId,
            $this->currentTenantId(),
            $request->validated(),
        );

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
     * List orders + commission của TẤT CẢ vendor tenant quản lý (gom cross-schema).
     */
    public function all(ListVendorOrderRequest $request): JsonResponse
    {
        $result = $this->service->listAllForTenant(
            $this->currentTenantId(),
            $request->validated(),
        );

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
     * Aggregation tổng đơn / doanh thu / hoa hồng của TẤT CẢ vendor trong range.
     */
    public function allSummary(ListVendorOrderRequest $request): JsonResponse
    {
        $data = $this->service->getSummaryAllForTenant(
            $this->currentTenantId(),
            $request->validated(),
        );

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    /**
     * Chi tiết 1 order — items + commission breakdown.
     */
    public function show(int $partnerId, int $orderId): VendorOrderDetailResource
    {
        $detail = $this->service->getDetail($partnerId, $this->currentTenantId(), $orderId);

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
     * Aggregation tổng đơn / doanh thu / hoa hồng trong range.
     */
    public function summary(ListVendorOrderSummaryRequest $request, int $partnerId): JsonResponse
    {
        $from = $request->validated('from') ? Carbon::parse($request->validated('from')) : null;
        $to = $request->validated('to') ? Carbon::parse($request->validated('to')) : null;

        $data = $this->service->getSummary($partnerId, $this->currentTenantId(), $from, $to);

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    protected function currentTenantId(): string
    {
        $tenant = function_exists('tenant') ? tenant() : null;

        if (! $tenant) {
            throw new BusinessException(
                message: 'Không xác định được tenant hiện tại.',
                errorCode: 'TENANT_NOT_RESOLVED',
                httpStatusCode: Response::HTTP_FORBIDDEN,
            );
        }

        return (string) $tenant->getKey();
    }
}
