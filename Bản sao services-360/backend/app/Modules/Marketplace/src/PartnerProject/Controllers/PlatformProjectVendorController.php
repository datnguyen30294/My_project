<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\PartnerProject\Controllers;

use App\Common\Controllers\BaseController;
use App\Common\Exceptions\BusinessException;
use App\Modules\Marketplace\PartnerProject\Contracts\ProjectVendorServiceInterface;
use App\Modules\Marketplace\PartnerProject\Requests\UpdateProjectVendorRequest;
use App\Modules\Marketplace\PartnerProject\Resources\ProjectVendorListResource;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * Platform admin — vendor (đối tác resi_mart) hoạt động trên 1 dự án của 1 PMC
 * tenant: danh sách + số gói/số đơn + công tắc tạm dừng cung cấp dịch vụ.
 *
 * @tags Marketplace Project Vendors (Platform)
 */
class PlatformProjectVendorController extends BaseController
{
    public function __construct(
        protected ProjectVendorServiceInterface $service,
    ) {}

    /**
     * Danh sách vendor trên dự án + thống kê (tổng / đang bật).
     */
    public function index(string $tenantId, int $projectId): JsonResponse
    {
        $result = $this->service->listForProject($tenantId, $projectId);

        return response()->json([
            'success' => true,
            'data' => collect($result['vendors'])
                ->map(fn (array $row) => (new ProjectVendorListResource($row))->resolve())
                ->all(),
            'stats' => $result['stats'],
            'warnings' => $result['warnings'],
        ]);
    }

    /**
     * Bật/tắt cho phép vendor cung cấp dịch vụ trên dự án (tạm dừng — giữ liên kết).
     */
    public function toggle(
        UpdateProjectVendorRequest $request,
        string $tenantId,
        int $projectId,
        int $partnerId,
    ): JsonResponse {
        $enabled = (bool) $request->validated('enabled');

        $pivot = $this->service->toggle(
            $partnerId,
            $tenantId,
            $projectId,
            $enabled,
            $this->resolveActorId($request),
        );

        if ($pivot === null) {
            throw new BusinessException(
                message: 'Vendor chưa được gắn vào dự án này.',
                errorCode: 'VENDOR_NOT_ON_PROJECT',
                httpStatusCode: Response::HTTP_NOT_FOUND,
            );
        }

        return response()->json([
            'success' => true,
            'data' => [
                'partner_id' => $partnerId,
                'enabled' => $pivot->is_vendor_enabled,
            ],
        ]);
    }

    private function resolveActorId(UpdateProjectVendorRequest $request): ?int
    {
        $id = $request->user()?->getAuthIdentifier();

        return is_numeric($id) ? (int) $id : null;
    }
}
