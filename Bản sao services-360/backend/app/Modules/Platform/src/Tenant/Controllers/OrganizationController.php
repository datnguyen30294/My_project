<?php

namespace App\Modules\Platform\Tenant\Controllers;

use App\Common\Controllers\BaseController;
use App\Modules\Platform\Tenant\Contracts\OrganizationServiceInterface;
use App\Modules\Platform\Tenant\Requests\CreateOrganizationRequest;
use App\Modules\Platform\Tenant\Requests\ListOrganizationRequest;
use App\Modules\Platform\Tenant\Requests\ToggleTenantActiveRequest;
use App\Modules\Platform\Tenant\Requests\ToggleTenantVendorFeatureRequest;
use App\Modules\Platform\Tenant\Requests\UpdateOrganizationRequest;
use App\Modules\Platform\Tenant\Requests\UpdateTenantConfigRequest;
use App\Modules\Platform\Tenant\Resources\OrganizationDetailResource;
use App\Modules\Platform\Tenant\Resources\OrganizationListResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

/**
 * @tags Platform Tenants
 */
class OrganizationController extends BaseController
{
    public function __construct(
        protected OrganizationServiceInterface $service,
    ) {}

    /**
     * List tenants.
     */
    public function index(ListOrganizationRequest $request): AnonymousResourceCollection
    {
        return OrganizationListResource::collection($this->service->list($request->validated()))
            ->additional(['success' => true]);
    }

    /**
     * Get tenant detail.
     */
    public function show(string $id): OrganizationDetailResource
    {
        return new OrganizationDetailResource($this->service->findById($id));
    }

    /**
     * Create a new tenant.
     */
    public function store(CreateOrganizationRequest $request): JsonResponse
    {
        return (new OrganizationDetailResource($this->service->create($request->validated())))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * Update a tenant.
     */
    public function update(UpdateOrganizationRequest $request, string $id): OrganizationDetailResource
    {
        return new OrganizationDetailResource($this->service->update($id, $request->validated()));
    }

    /**
     * Delete a tenant (soft delete, database is preserved).
     */
    public function destroy(string $id): JsonResponse
    {
        $this->service->delete($id);

        return response()->json(['success' => true, 'message' => 'Đã xoá tenant.']);
    }

    /**
     * Toggle the marketplace vendor feature flag on a tenant.
     */
    public function toggleVendorFeature(ToggleTenantVendorFeatureRequest $request, string $id): OrganizationDetailResource
    {
        return new OrganizationDetailResource(
            $this->service->toggleVendorFeature($id, (bool) $request->validated('is_vendor_enabled')),
        );
    }

    /**
     * Get tenant statistics (total / active / inactive).
     */
    public function stats(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->service->stats(),
        ]);
    }

    /**
     * Activate or deactivate a tenant.
     */
    public function toggleActive(ToggleTenantActiveRequest $request, string $id): OrganizationDetailResource
    {
        return new OrganizationDetailResource(
            $this->service->toggleActive($id, (bool) $request->validated('is_active')),
        );
    }

    /**
     * Update tenant configuration (limits, platform fees, enabled modules).
     */
    public function updateConfig(UpdateTenantConfigRequest $request, string $id): OrganizationDetailResource
    {
        return new OrganizationDetailResource(
            $this->service->updateConfig($id, $request->validated()),
        );
    }
}
