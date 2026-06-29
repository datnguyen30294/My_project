<?php

namespace App\Modules\Platform\Tenant\Resources;

use App\Common\Resources\BaseResource;
use Illuminate\Http\Request;

/**
 * Đánh giá của cư dân trên ticket trong tenant schema. Resource này wrap
 * array thuần do TenantResidentRatingExternalService trả về (không nhận
 * Model xuyên module). Chỉ lộ tên hiển thị cư dân — không SĐT/địa chỉ.
 */
class TenantResidentRatingResource extends BaseResource
{
    /**
     * @return array{
     *     ticket_id: int,
     *     ticket_code: string|null,
     *     subject: string,
     *     project_name: string|null,
     *     resident_name: string|null,
     *     rating: int,
     *     comment: string|null,
     *     rated_at: string|null,
     * }
     */
    public function toArray(Request $request): array
    {
        return [
            /** @var int */
            'ticket_id' => $this['ticket_id'],
            /** @var string|null */
            'ticket_code' => $this['ticket_code'],
            'subject' => $this['subject'],
            /** @var string|null */
            'project_name' => $this['project_name'],
            /** @var string|null */
            'resident_name' => $this['resident_name'],
            /** @var int */
            'rating' => $this['rating'],
            /** @var string|null */
            'comment' => $this['comment'],
            /** @var string|null */
            'rated_at' => $this['rated_at'],
        ];
    }
}
