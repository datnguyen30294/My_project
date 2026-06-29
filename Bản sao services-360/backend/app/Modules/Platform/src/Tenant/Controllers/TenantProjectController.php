<?php

namespace App\Modules\Platform\Tenant\Controllers;

use App\Common\Controllers\BaseController;
use App\Modules\Platform\Tenant\Contracts\OrganizationServiceInterface;
use App\Modules\Platform\Tenant\Requests\ListTenantProjectRequest;
use App\Modules\Platform\Tenant\Resources\TenantProjectResource;
use App\Modules\PMC\Project\ExternalServices\Platform\TenantProjectExternalServiceInterface;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Danh sách read-only dự án bên trong tenant schema từ cổng platform.
 * Không có thao tác ghi — dự án do tenant tự quản lý qua cổng vận hành.
 * Tenant inactive vẫn xem được (dữ liệu lịch sử giữ nguyên).
 *
 * @tags Platform Tenant Projects
 */
class TenantProjectController extends BaseController
{
    public function __construct(
        protected OrganizationServiceInterface $organizationService,
        protected TenantProjectExternalServiceInterface $tenantProjectService,
    ) {}

    /**
     * List projects inside a tenant schema (paginated).
     */
    public function index(ListTenantProjectRequest $request, string $id): AnonymousResourceCollection
    {
        $tenant = $this->organizationService->findById($id);

        return TenantProjectResource::collection(
            $this->tenantProjectService->listProjects($tenant, $request->validated()),
        )->additional(['success' => true]);
    }
}
