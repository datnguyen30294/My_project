<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOrder\Repositories;

use App\Common\Repositories\BaseRepository;
use App\Modules\Marketplace\VendorOrder\Models\VendorOrderCommissionOverride;
use Illuminate\Support\Collection;

class VendorOrderCommissionOverrideRepository extends BaseRepository
{
    public function __construct()
    {
        parent::__construct(new VendorOrderCommissionOverride);
    }

    public function findForOrder(int $partnerId, int $orderId): ?VendorOrderCommissionOverride
    {
        /** @var VendorOrderCommissionOverride|null */
        return $this->newQuery()
            ->where('partner_id', $partnerId)
            ->where('vendor_order_id', $orderId)
            ->first();
    }

    /**
     * Mọi override của 1 vendor, keyed theo `vendor_order_id` — để decorate
     * danh sách đơn không bị N+1.
     *
     * @return Collection<int, VendorOrderCommissionOverride>
     */
    public function mapByPartner(int $partnerId): Collection
    {
        /** @var Collection<int, VendorOrderCommissionOverride> */
        return $this->newQuery()
            ->where('partner_id', $partnerId)
            ->get()
            ->keyBy('vendor_order_id');
    }

    /**
     * Upsert override cho 1 đơn (1 đơn ↔ tối đa 1 override). Cập nhật bản ghi
     * hiện có nếu có, ngược lại tạo mới.
     *
     * @param  array<string, mixed>  $data
     */
    public function upsertForOrder(int $partnerId, int $orderId, array $data): VendorOrderCommissionOverride
    {
        $existing = $this->findForOrder($partnerId, $orderId);

        if ($existing !== null) {
            $existing->update($data);

            return $existing->refresh();
        }

        /** @var VendorOrderCommissionOverride */
        return $this->newQuery()->create(array_merge($data, [
            'partner_id' => $partnerId,
            'vendor_order_id' => $orderId,
        ]));
    }

    public function deleteForOrder(int $partnerId, int $orderId): bool
    {
        $existing = $this->findForOrder($partnerId, $orderId);

        if ($existing === null) {
            return false;
        }

        return (bool) $existing->delete();
    }
}
