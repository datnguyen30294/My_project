<?php

namespace App\Modules\Platform\Tenant\Controllers;

use App\Common\Controllers\BaseController;
use App\Modules\Platform\Tenant\Contracts\PlatformProjectServiceInterface;
use App\Modules\Platform\Tenant\Requests\ListProjectOrderRequest;
use App\Modules\Platform\Tenant\Resources\ProjectOrderResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Đơn hàng PMC trên một dự án (kèm phí nền tảng đã đóng băng) xem từ cổng platform.
 *
 * @tags Platform Projects
 */
class PlatformProjectOrderController extends BaseController
{
    public function __construct(
        protected PlatformProjectServiceInterface $service,
    ) {}

    /**
     * List PMC orders of a project (paginated, with frozen platform fee).
     */
    public function index(ListProjectOrderRequest $request, string $id, int $projectId): AnonymousResourceCollection
    {
        return ProjectOrderResource::collection(
            $this->service->orders($id, $projectId, $request->validated()),
        )->additional(['success' => true]);
    }
}
