<?php

namespace App\Modules\Platform\Tenant\Controllers;

use App\Common\Controllers\BaseController;
use App\Modules\Platform\Tenant\Contracts\OrganizationServiceInterface;
use App\Modules\Platform\Tenant\Requests\ListTenantResidentRatingRequest;
use App\Modules\Platform\Tenant\Resources\TenantResidentRatingResource;
use App\Modules\PMC\OgTicket\ExternalServices\Platform\TenantResidentRatingExternalServiceInterface;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Đánh giá của cư dân trên các ticket trong tenant schema, xem từ cổng platform.
 * Read-only — cư dân đánh giá qua cổng resident, tenant không sửa được.
 * Summary (điểm TB + số lượt) tính trên toàn bộ đánh giá, không đổi theo filter.
 *
 * @tags Platform Tenant Resident Ratings
 */
class TenantResidentRatingController extends BaseController
{
    public function __construct(
        protected OrganizationServiceInterface $organizationService,
        protected TenantResidentRatingExternalServiceInterface $residentRatingService,
    ) {}

    /**
     * List resident ratings on tickets inside a tenant schema (paginated, with summary).
     */
    public function index(ListTenantResidentRatingRequest $request, string $id): AnonymousResourceCollection
    {
        $tenant = $this->organizationService->findById($id);

        $result = $this->residentRatingService->getRatingsForTenant($tenant, $request->validated());

        return TenantResidentRatingResource::collection($result['paginator'])
            ->additional(['success' => true, 'summary' => $result['summary']]);
    }
}
