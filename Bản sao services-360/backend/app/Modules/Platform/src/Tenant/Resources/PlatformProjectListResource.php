<?php

namespace App\Modules\Platform\Tenant\Resources;

use App\Common\Resources\BaseResource;
use Illuminate\Http\Request;

/**
 * Một dòng dự án trong danh sách toàn nền tảng. Wrap array thuần do
 * PlatformProjectService gộp từ nhiều schema tenant (không nhận Model xuyên module).
 */
class PlatformProjectListResource extends BaseResource
{
    /**
     * @return array{
     *     id: int,
     *     code: string,
     *     name: string,
     *     address: string|null,
     *     status: array{value: string, label: string},
     *     tenant: array{id: string, code: string, name: string, is_active: bool},
     *     platform_service_enabled: bool,
     * }
     */
    public function toArray(Request $request): array
    {
        return [
            /** @var int */
            'id' => $this['id'],
            'code' => $this['code'],
            'name' => $this['name'],
            /** @var string|null */
            'address' => $this['address'],
            /** @var array{value: string, label: string} */
            'status' => $this['status'],
            /** @var array{id: string, code: string, name: string, is_active: bool} */
            'tenant' => $this['tenant'],
            /** @var bool */
            'platform_service_enabled' => $this['platform_service_enabled'],
        ];
    }
}
