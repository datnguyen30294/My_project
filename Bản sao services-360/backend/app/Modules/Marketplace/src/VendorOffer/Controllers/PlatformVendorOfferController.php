<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOffer\Controllers;

use App\Common\Controllers\BaseController;
use App\Modules\Marketplace\VendorOffer\Contracts\VendorOfferServiceInterface;
use App\Modules\Marketplace\VendorOffer\Requests\ListVendorOfferRequest;
use App\Modules\Marketplace\VendorOffer\Resources\VendorOfferListResource;
use Illuminate\Http\JsonResponse;

/**
 * Platform admin — đọc danh mục gói (products) của 1 vendor cross-DB từ
 * resi_mart. Suy biến an toàn về empty + schema_missing khi không tới được.
 *
 * @tags Marketplace Vendor Offers (Platform)
 */
class PlatformVendorOfferController extends BaseController
{
    public function __construct(
        protected VendorOfferServiceInterface $service,
    ) {}

    /**
     * List a vendor's offers (resi_mart products).
     */
    public function index(ListVendorOfferRequest $request, int $partnerId): JsonResponse
    {
        $result = $this->service->listForPartner($partnerId, $request->validated());

        /** @var \Illuminate\Contracts\Pagination\LengthAwarePaginator $paginator */
        $paginator = $result['data'];

        return response()->json([
            'success' => true,
            'data' => VendorOfferListResource::collection($paginator->getCollection())->resolve(),
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
}
