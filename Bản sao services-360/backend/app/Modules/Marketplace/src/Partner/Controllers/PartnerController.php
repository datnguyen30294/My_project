<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\Partner\Controllers;

use App\Common\Controllers\BaseController;
use App\Common\Exceptions\BusinessException;
use App\Modules\Marketplace\Partner\Contracts\PartnerServiceInterface;
use App\Modules\Marketplace\Partner\ExternalServices\ResiMartProvisioningException;
use App\Modules\Marketplace\Partner\Requests\CreatePartnerRequest;
use App\Modules\Marketplace\Partner\Requests\ListPartnerRequest;
use App\Modules\Marketplace\Partner\Requests\UpdatePartnerRequest;
use App\Modules\Marketplace\Partner\Resources\PartnerDetailResource;
use App\Modules\Marketplace\Partner\Resources\PartnerListResource;
use App\Modules\Marketplace\Partner\Services\PartnerConsoleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

/**
 * @tags Marketplace Partners
 */
class PartnerController extends BaseController
{
    public function __construct(
        protected PartnerServiceInterface $service,
        protected PartnerConsoleService $consoleService,
    ) {}

    /**
     * List marketplace partners (platform-level). Pass `?include=stats` to
     * decorate each row with aggregate counts for the vendor console.
     */
    public function index(ListPartnerRequest $request): AnonymousResourceCollection
    {
        $filters = $request->validated();
        $paginator = $this->service->list($filters);

        if ($this->wantsStats($filters['include'] ?? null)) {
            $this->consoleService->decorateList($paginator->getCollection());
        }

        return PartnerListResource::collection($paginator)
            ->additional(['success' => true]);
    }

    /**
     * Status breakdown for the console stats cards.
     */
    public function stats(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->consoleService->stats(),
        ]);
    }

    /**
     * Get partner detail (incl. per-project commission table for the console).
     */
    public function show(int $id): PartnerDetailResource
    {
        $partner = $this->service->findById($id);
        $partner->setAttribute('projects', $this->consoleService->buildProjects($partner));

        return new PartnerDetailResource($partner);
    }

    /**
     * Create a new marketplace partner.
     */
    public function store(CreatePartnerRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['actor_id'] = $request->user()?->id;

        return (new PartnerDetailResource($this->service->create($data)))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * Update a partner.
     */
    public function update(int $id, UpdatePartnerRequest $request): PartnerDetailResource
    {
        $data = $request->validated();
        $data['actor_id'] = $request->user()?->id;

        return new PartnerDetailResource($this->service->update($id, $data));
    }

    /**
     * Soft-delete a partner.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->service->delete($id);

        return response()->json(['success' => true], Response::HTTP_NO_CONTENT);
    }

    /**
     * Whether the `include` query param requests the `stats` aggregate.
     */
    private function wantsStats(?string $include): bool
    {
        if ($include === null || $include === '') {
            return false;
        }

        return in_array('stats', array_map('trim', explode(',', $include)), true);
    }

    /**
     * Approve a pending vendor (`pending → active`).
     */
    public function approve(Request $request, int $id): PartnerDetailResource
    {
        return new PartnerDetailResource($this->service->approve($id, $request->user()?->id));
    }

    /**
     * Deactivate an active vendor (`active → suspended`).
     */
    public function deactivate(Request $request, int $id): PartnerDetailResource
    {
        return new PartnerDetailResource($this->service->deactivate($id, $request->user()?->id));
    }

    /**
     * Reactivate a suspended vendor (`suspended → active`).
     */
    public function reactivate(Request $request, int $id): PartnerDetailResource
    {
        return new PartnerDetailResource($this->service->reactivate($id, $request->user()?->id));
    }

    /**
     * Retry resi_mart provisioning for a partner whose create-time call
     * failed (tenant_id is null).
     *
     * @throws BusinessException when resi_mart still cannot be reached
     */
    public function provision(int $id): PartnerDetailResource
    {
        try {
            return new PartnerDetailResource($this->service->provision($id));
        } catch (ResiMartProvisioningException $e) {
            throw new BusinessException(
                message: 'Không thể provision tenant ở resi_mart: '.$e->getMessage(),
                errorCode: 'RESI_MART_UNAVAILABLE',
                httpStatusCode: Response::HTTP_BAD_GATEWAY,
                context: $e->context,
                previous: $e,
            );
        }
    }
}
