<?php

namespace App\Modules\Platform\Tenant\Controllers;

use App\Common\Controllers\BaseController;
use App\Modules\Platform\Tenant\Contracts\PlatformProjectServiceInterface;
use App\Modules\Platform\Tenant\Requests\CreatePlatformProjectRequest;
use App\Modules\Platform\Tenant\Resources\PlatformProjectDetailResource;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * Tạo & xem chi tiết một dự án của một tenant từ cổng platform.
 * Platform được phép tạo dự án vào schema tenant đã chọn.
 *
 * @tags Platform Projects
 */
class PlatformProjectController extends BaseController
{
    public function __construct(
        protected PlatformProjectServiceInterface $service,
    ) {}

    /**
     * Create a new project inside the given tenant's schema.
     */
    public function store(CreatePlatformProjectRequest $request, string $id): JsonResponse
    {
        return (new PlatformProjectDetailResource($this->service->create($id, $request->validated())))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * Get a project by ID inside the given tenant's schema.
     */
    public function show(string $id, int $projectId): PlatformProjectDetailResource
    {
        return new PlatformProjectDetailResource($this->service->detail($id, $projectId));
    }
}
