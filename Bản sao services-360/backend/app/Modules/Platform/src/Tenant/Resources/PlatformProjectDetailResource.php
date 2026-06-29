<?php

namespace App\Modules\Platform\Tenant\Resources;

use App\Common\Resources\BaseResource;
use Illuminate\Http\Request;

/**
 * Chi tiết dự án xem từ cổng platform. Wrap array thuần do PlatformProjectService
 * trả về (không nhận Model xuyên module). KHÔNG lộ thông tin ngân hàng BQT.
 */
class PlatformProjectDetailResource extends BaseResource
{
    /**
     * @return array{
     *     id: int,
     *     code: string,
     *     name: string,
     *     address: string|null,
     *     status: array{value: string, label: string},
     *     tenant: array{id: string, code: string, name: string, is_active: bool, domain: string|null},
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
            /** @var array{id: string, code: string, name: string, is_active: bool, domain: string|null} */
            'tenant' => $this['tenant'],
        ];
    }
}
