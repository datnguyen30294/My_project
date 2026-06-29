<?php

namespace App\Modules\Platform\Tenant\Resources;

use App\Common\Resources\BaseResource;
use Illuminate\Http\Request;

/**
 * Tài khoản vận hành trong tenant schema. Resource này wrap array thuần
 * do TenantAccountExternalService trả về (không nhận Model xuyên module).
 */
class TenantAccountResource extends BaseResource
{
    /**
     * @return array{
     *     id: int,
     *     name: string,
     *     email: string,
     *     departments: list<array{id: int, name: string}>,
     *     job_title: array{id: int, name: string}|null,
     *     role: array{id: int, name: string}|null,
     *     is_active: bool,
     * }
     */
    public function toArray(Request $request): array
    {
        return [
            /** @var int */
            'id' => $this['id'],
            'name' => $this['name'],
            'email' => $this['email'],
            /** @var list<array{id: int, name: string}> */
            'departments' => $this['departments'],
            /** @var array{id: int, name: string}|null */
            'job_title' => $this['job_title'],
            /** @var array{id: int, name: string}|null */
            'role' => $this['role'],
            /** @var bool */
            'is_active' => $this['is_active'],
        ];
    }
}
