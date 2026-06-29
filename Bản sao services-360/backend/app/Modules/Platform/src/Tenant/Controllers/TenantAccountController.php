<?php

namespace App\Modules\Platform\Tenant\Controllers;

use App\Common\Controllers\BaseController;
use App\Modules\Platform\Tenant\Contracts\OrganizationServiceInterface;
use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\Platform\Tenant\Requests\CreateTenantAccountRequest;
use App\Modules\Platform\Tenant\Requests\ListTenantAccountRequest;
use App\Modules\Platform\Tenant\Requests\UpdateTenantAccountRequest;
use App\Modules\Platform\Tenant\Resources\TenantAccountResource;
use App\Modules\PMC\Account\ExternalServices\Platform\TenantAccountExternalServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

/**
 * Quản lý tài khoản vận hành bên trong tenant schema từ cổng platform.
 * Tenant inactive vẫn cho quản lý account (chuẩn bị trước khi kích hoạt lại).
 *
 * @tags Platform Tenant Accounts
 */
class TenantAccountController extends BaseController
{
    public function __construct(
        protected OrganizationServiceInterface $organizationService,
        protected TenantAccountExternalServiceInterface $tenantAccountService,
    ) {}

    /**
     * List accounts inside a tenant schema.
     */
    public function index(ListTenantAccountRequest $request, string $id): AnonymousResourceCollection
    {
        $tenant = $this->findTenant($id);

        return TenantAccountResource::collection(
            $this->tenantAccountService->listAccounts($tenant, $request->validated()),
        )->additional(['success' => true]);
    }

    /**
     * Form options (departments, job titles, roles) from the tenant schema.
     */
    public function options(string $id): JsonResponse
    {
        $tenant = $this->findTenant($id);

        return response()->json([
            'success' => true,
            'data' => $this->tenantAccountService->getFormOptions($tenant),
        ]);
    }

    /**
     * Create a new account inside a tenant schema.
     */
    public function store(CreateTenantAccountRequest $request, string $id): JsonResponse
    {
        $tenant = $this->findTenant($id);

        return (new TenantAccountResource(
            $this->tenantAccountService->createAccount($tenant, $request->validated()),
        ))->response()->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * Update an account inside a tenant schema (info, password reset, activate/deactivate).
     */
    public function update(UpdateTenantAccountRequest $request, string $id, int $accountId): TenantAccountResource
    {
        $tenant = $this->findTenant($id);

        return new TenantAccountResource(
            $this->tenantAccountService->updateAccount($tenant, $accountId, $request->validated()),
        );
    }

    private function findTenant(string $id): Organization
    {
        return $this->organizationService->findById($id);
    }
}
