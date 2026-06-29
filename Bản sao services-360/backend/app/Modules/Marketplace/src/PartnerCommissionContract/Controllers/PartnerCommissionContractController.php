<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\PartnerCommissionContract\Controllers;

use App\Common\Controllers\BaseController;
use App\Modules\Marketplace\PartnerCommissionContract\Contracts\PartnerCommissionContractServiceInterface;
use App\Modules\Marketplace\PartnerCommissionContract\Requests\BulkCreateContractRequest;
use App\Modules\Marketplace\PartnerCommissionContract\Requests\CancelContractRequest;
use App\Modules\Marketplace\PartnerCommissionContract\Requests\CreateContractDraftRequest;
use App\Modules\Marketplace\PartnerCommissionContract\Requests\ListContractRequest;
use App\Modules\Marketplace\PartnerCommissionContract\Requests\SignContractRequest;
use App\Modules\Marketplace\PartnerCommissionContract\Requests\UpdateContractDraftRequest;
use App\Modules\Marketplace\PartnerCommissionContract\Requests\UpdateContractPendingRequest;
use App\Modules\Marketplace\PartnerCommissionContract\Resources\ContractDetailResource;
use App\Modules\Marketplace\PartnerCommissionContract\Resources\ContractListResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

/**
 * @tags Marketplace Commission Contracts (Platform)
 */
class PartnerCommissionContractController extends BaseController
{
    public function __construct(
        protected PartnerCommissionContractServiceInterface $service,
    ) {}

    /**
     * List vendor commission contracts (platform-level).
     */
    public function index(ListContractRequest $request): AnonymousResourceCollection
    {
        return ContractListResource::collection($this->service->listForPlatform($request->validated()))
            ->additional(['success' => true]);
    }

    /**
     * Get a contract detail.
     */
    public function show(int $id): ContractDetailResource
    {
        return new ContractDetailResource($this->service->getDetailForPlatform($id));
    }

    /**
     * Create a new draft commission contract.
     */
    public function store(CreateContractDraftRequest $request): JsonResponse
    {
        $contract = $this->service->createDraft($request->validated(), $request->user()?->id);

        return (new ContractDetailResource($contract))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * Apply a default commission terms set across every project the vendor is
     * linked to (fan-out one draft contract per scope).
     */
    public function bulkDefaults(BulkCreateContractRequest $request, int $id): JsonResponse
    {
        $result = $this->service->bulkCreateDefaults($id, $request->validated(), $request->user()?->id);

        return response()->json([
            'success' => true,
            'data' => [
                'created' => ContractListResource::collection(collect($result['created']))->resolve(),
                'skipped' => $result['skipped'],
                'created_count' => count($result['created']),
                'skipped_count' => count($result['skipped']),
            ],
        ], Response::HTTP_CREATED);
    }

    /**
     * Update a draft contract (full edit allowed).
     */
    public function update(UpdateContractDraftRequest $request, int $id): ContractDetailResource
    {
        return new ContractDetailResource(
            $this->service->updateDraft($id, $request->validated(), $request->user()?->id),
        );
    }

    /**
     * Update non-financial fields on a pending contract.
     */
    public function updateNotes(UpdateContractPendingRequest $request, int $id): ContractDetailResource
    {
        return new ContractDetailResource(
            $this->service->updatePendingNotes($id, $request->validated(), $request->user()?->id),
        );
    }

    /**
     * Discard (hard-delete) a draft contract.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->service->discardDraft($id, $request->user()?->id);

        return response()->json(['success' => true], Response::HTTP_NO_CONTENT);
    }

    /**
     * Sign a draft → transition to pending.
     */
    public function sign(SignContractRequest $request, int $id): ContractDetailResource
    {
        return new ContractDetailResource(
            $this->service->sign($id, $request->user()?->id),
        );
    }

    /**
     * Revoke a pending contract (terminal).
     */
    public function revoke(CancelContractRequest $request, int $id): ContractDetailResource
    {
        return new ContractDetailResource(
            $this->service->revokePending(
                $id,
                (string) $request->validated('cancellation_reason'),
                $request->user()?->id,
            ),
        );
    }

    /**
     * Cancel an active contract (terminal).
     */
    public function cancel(CancelContractRequest $request, int $id): ContractDetailResource
    {
        return new ContractDetailResource(
            $this->service->cancelActive(
                $id,
                (string) $request->validated('cancellation_reason'),
                $request->user()?->id,
            ),
        );
    }
}
