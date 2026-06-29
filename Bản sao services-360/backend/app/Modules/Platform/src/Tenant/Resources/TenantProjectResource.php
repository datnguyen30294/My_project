<?php

namespace App\Modules\Platform\Tenant\Resources;

use App\Common\Resources\BaseResource;
use Illuminate\Http\Request;

/**
 * Dự án trong tenant schema. Resource này wrap array thuần do
 * TenantProjectExternalService trả về (không nhận Model xuyên module).
 */
class TenantProjectResource extends BaseResource
{
    /**
     * @return array{
     *     id: int,
     *     code: string,
     *     name: string,
     *     address: string|null,
     *     status: array{value: string, label: string},
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
        ];
    }
}
