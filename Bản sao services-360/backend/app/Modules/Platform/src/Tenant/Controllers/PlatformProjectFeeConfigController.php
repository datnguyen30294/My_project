<?php

namespace App\Modules\Platform\Tenant\Controllers;

use App\Common\Controllers\BaseController;
use App\Modules\Platform\Tenant\Contracts\PlatformProjectServiceInterface;
use App\Modules\Platform\Tenant\Requests\UpdateProjectFeeConfigRequest;
use App\Modules\Platform\Tenant\Resources\ProjectFeeConfigResource;

/**
 * Cấu hình phí nền tảng riêng theo dự án (override mặc định tenant).
 * GET trả cả cấu hình hiệu lực (đã resolve kế thừa) lẫn override thô + mặc định tenant.
 *
 * @tags Platform Projects
 */
class PlatformProjectFeeConfigController extends BaseController
{
    public function __construct(
        protected PlatformProjectServiceInterface $service,
    ) {}

    /**
     * Get the platform fee config of a project (override + effective + tenant default).
     */
    public function show(string $id, int $projectId): ProjectFeeConfigResource
    {
        return new ProjectFeeConfigResource($this->service->getFeeConfig($id, $projectId));
    }

    /**
     * Update the platform fee config of a project.
     */
    public function update(UpdateProjectFeeConfigRequest $request, string $id, int $projectId): ProjectFeeConfigResource
    {
        return new ProjectFeeConfigResource($this->service->updateFeeConfig($id, $projectId, $request->validated()));
    }
}
