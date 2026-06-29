<?php

namespace App\Modules\Platform\Tenant\Controllers;

use App\Common\Controllers\BaseController;
use App\Modules\Platform\Tenant\Contracts\PlatformProjectServiceInterface;
use App\Modules\Platform\Tenant\Requests\ListPlatformProjectRequest;
use App\Modules\Platform\Tenant\Resources\PlatformProjectListResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Danh sách dự án trên toàn nền tảng (gộp cross-tenant) xem từ cổng platform.
 * Mỗi dự án sống trong đúng một schema tenant — không có dự án "chưa gán".
 *
 * @tags Platform Projects
 */
class ListPlatformProjectController extends BaseController
{
    public function __construct(
        protected PlatformProjectServiceInterface $service,
    ) {}

    /**
     * List all projects across every tenant (paginated, with platform stats).
     */
    public function index(ListPlatformProjectRequest $request): AnonymousResourceCollection
    {
        $result = $this->service->list($request->validated());

        return PlatformProjectListResource::collection($result['paginator'])
            ->additional(['success' => true, 'stats' => $result['stats']]);
    }
}
