<?php

namespace App\Modules\Platform\Tenant\Resources;

use App\Common\Resources\BaseResource;
use Illuminate\Http\Request;

/**
 * Đơn hàng PMC của một dự án xem từ cổng platform. Wrap array thuần do
 * TenantProjectOrderExternalService trả về (không nhận Model xuyên module).
 * `platform_fee` = phí nền tảng đã đóng băng (0 nếu chưa vào kỳ chốt).
 */
class ProjectOrderResource extends BaseResource
{
    /**
     * @return array{
     *     id: int,
     *     code: string,
     *     total_amount: string,
     *     status: array{value: string, label: string},
     *     platform_fee: string,
     *     completed_at: string|null,
     * }
     */
    public function toArray(Request $request): array
    {
        return [
            /** @var int */
            'id' => $this['id'],
            'code' => $this['code'],
            'total_amount' => $this['total_amount'],
            /** @var array{value: string, label: string} */
            'status' => $this['status'],
            'platform_fee' => $this['platform_fee'],
            /** @var string|null */
            'completed_at' => $this['completed_at'],
        ];
    }
}
