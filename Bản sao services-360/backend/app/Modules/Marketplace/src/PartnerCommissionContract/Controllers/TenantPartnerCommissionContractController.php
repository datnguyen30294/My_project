<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\PartnerCommissionContract\Controllers;

use App\Common\Controllers\BaseController;
use App\Common\Exceptions\BusinessException;
use App\Modules\Marketplace\PartnerCommissionContract\Contracts\PartnerCommissionContractServiceInterface;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\ContractCreatedScope;
use App\Modules\Marketplace\PartnerCommissionContract\Models\PartnerCommissionContract;
use App\Modules\Marketplace\PartnerCommissionContract\Requests\CancelContractRequest;
use App\Modules\Marketplace\PartnerCommissionContract\Requests\CreateContractDraftRequest;
use App\Modules\Marketplace\PartnerCommissionContract\Requests\ListContractRequest;
use App\Modules\Marketplace\PartnerCommissionContract\Requests\SignContractRequest;
use App\Modules\Marketplace\PartnerCommissionContract\Requests\SwitchContractRequest;
use App\Modules\Marketplace\PartnerCommissionContract\Requests\UpdateContractDraftRequest;
use App\Modules\Marketplace\PartnerCommissionContract\Requests\UpdateContractPendingRequest;
use App\Modules\Marketplace\PartnerCommissionContract\Resources\ContractDetailResource;
use App\Modules\Marketplace\PartnerCommissionContract\Resources\ContractListResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

/**
 * @tags Marketplace Commission Contracts (Tenant)
 *
 * Mirrors {@see PartnerCommissionContractController} (platform side) with the
 * single difference that every read/write is auto-scoped to the current
 * tenant. Permissions are symmetric across the two sides.
 */
class TenantPartnerCommissionContractController extends BaseController
{
    public function __construct(
        protected PartnerCommissionContractServiceInterface $service,
    ) {}

    /**
     * List commission contracts for the current tenant.
     */
    public function index(ListContractRequest $request): AnonymousResourceCollection
    {
        $filters = $request->validated();
        $filters['tenant_id'] = $this->currentTenantId();

        return ContractListResource::collection($this->service->listForPlatform($filters))
            ->additional(['success' => true]);
    }

    /**
     * Get a contract detail (scoped to current tenant).
     */
    public function show(int $id): ContractDetailResource
    {
        $contract = $this->loadInScope($id);

        return new ContractDetailResource($contract);
    }

    /**
     * Create a new draft commission contract for the current tenant.
     */
    public function store(CreateContractDraftRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['tenant_id'] = $this->currentTenantId();
        $data['created_scope'] = ContractCreatedScope::Tenant->value;

        $contract = $this->service->createDraft($data, $request->user()?->id);

        return (new ContractDetailResource($contract))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * Update a draft contract (full edit allowed).
     */
    public function update(UpdateContractDraftRequest $request, int $id): ContractDetailResource
    {
        $this->loadInScope($id);

        $data = $request->validated();
        // Tenant cannot rewrite tenant_id; force scope.
        $data['tenant_id'] = $this->currentTenantId();

        return new ContractDetailResource(
            $this->service->updateDraft($id, $data, $request->user()?->id),
        );
    }

    /**
     * Update non-financial fields on a pending contract.
     */
    public function updateNotes(UpdateContractPendingRequest $request, int $id): ContractDetailResource
    {
        $this->loadInScope($id);

        return new ContractDetailResource(
            $this->service->updatePendingNotes($id, $request->validated(), $request->user()?->id),
        );
    }

    /**
     * Discard (hard-delete) a draft contract.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->loadInScope($id);

        $this->service->discardDraft($id, $request->user()?->id);

        return response()->json(['success' => true], Response::HTTP_NO_CONTENT);
    }

    /**
     * Sign a draft → transition to pending.
     */
    public function sign(SignContractRequest $request, int $id): ContractDetailResource
    {
        $this->loadInScope($id);

        return new ContractDetailResource(
            $this->service->sign($id, $request->user()?->id),
        );
    }

    /**
     * Revoke a pending contract (terminal).
     */
    public function revoke(CancelContractRequest $request, int $id): ContractDetailResource
    {
        $this->loadInScope($id);

        return new ContractDetailResource(
            $this->service->revokePending(
                $id,
                (string) $request->validated('cancellation_reason'),
                $request->user()?->id,
            ),
        );
    }

    /**
     * Switch — activate a pending contract atomically (auto-replaces any
     * current active contract on the same scope).
     */
    public function switch(SwitchContractRequest $request, int $id): ContractDetailResource
    {
        $this->loadInScope($id);

        return new ContractDetailResource(
            $this->service->switchTo($id, $request->user()?->id),
        );
    }

    /**
     * Cancel an active contract (terminal).
     */
    public function cancel(CancelContractRequest $request, int $id): ContractDetailResource
    {
        $this->loadInScope($id);

        return new ContractDetailResource(
            $this->service->cancelActive(
                $id,
                (string) $request->validated('cancellation_reason'),
                $request->user()?->id,
            ),
        );
    }

    /**
     * Return the full contract history (active + terminal) for a (partner ×
     * project) pair under the current tenant.
     */
    public function history(Request $request): AnonymousResourceCollection
    {
        $partnerId = (int) $request->query('partner_id');
        $projectId = (int) $request->query('project_id');

        if ($partnerId <= 0 || $projectId <= 0) {
            throw new BusinessException(
                message: 'Vui lòng cung cấp partner_id và project_id.',
                errorCode: 'CONTRACT_HISTORY_PARAMS_REQUIRED',
                httpStatusCode: Response::HTTP_UNPROCESSABLE_ENTITY,
            );
        }

        $contracts = $this->service->getHistoryFor($partnerId, $this->currentTenantId(), $projectId);

        return ContractListResource::collection($contracts)
            ->additional(['success' => true]);
    }

    /**
     * Load a contract and ensure it belongs to the current tenant. If not,
     * raise a 404 (do not reveal existence of out-of-scope contracts).
     */
    protected function loadInScope(int $id): PartnerCommissionContract
    {
        $contract = $this->service->getDetail($id);

        if ($contract->tenant_id !== $this->currentTenantId()) {
            throw new BusinessException(
                message: 'Hợp đồng không tồn tại.',
                errorCode: 'CONTRACT_NOT_FOUND',
                httpStatusCode: Response::HTTP_NOT_FOUND,
            );
        }

        return $contract;
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
