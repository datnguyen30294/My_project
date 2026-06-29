<?php

namespace App\Modules\Platform\Tenant\Controllers;

use App\Common\Controllers\BaseController;
use App\Modules\Platform\Tenant\Contracts\PlatformProjectServiceInterface;
use App\Modules\Platform\Tenant\Requests\ListProjectResidentRatingRequest;
use App\Modules\Platform\Tenant\Resources\TenantResidentRatingResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Đánh giá của cư dân trên ticket của một dự án xem từ cổng platform.
 * Summary (điểm TB + số lượt) tính trên tập đã lọc theo dự án, không đổi theo filter `rating`.
 *
 * @tags Platform Projects
 */
class PlatformProjectResidentRatingController extends BaseController
{
    public function __construct(
        protected PlatformProjectServiceInterface $service,
    ) {}

    /**
     * List resident ratings on a project's tickets (paginated, with summary).
     */
    public function index(ListProjectResidentRatingRequest $request, string $id, int $projectId): AnonymousResourceCollection
    {
        $result = $this->service->residentRatings($id, $projectId, $request->validated());

        return TenantResidentRatingResource::collection($result['paginator'])
            ->additional(['success' => true, 'summary' => $result['summary']]);
    }
}
