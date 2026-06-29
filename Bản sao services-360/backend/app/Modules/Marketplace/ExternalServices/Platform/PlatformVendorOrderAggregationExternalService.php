<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\ExternalServices\Platform;

use App\Modules\Marketplace\Partner\Repositories\PartnerRepository;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\CommissionMode;
use App\Modules\Marketplace\PartnerCommissionContract\Models\PartnerCommissionContract;
use App\Modules\Marketplace\PartnerCommissionContract\Repositories\PartnerCommissionContractRepository;
use App\Modules\Marketplace\VendorOrder\Enums\VendorOrderStatus;
use App\Modules\Marketplace\VendorOrder\Models\VendorOrder;
use App\Modules\Marketplace\VendorOrder\Repositories\VendorOrderCommissionOverrideRepository;
use App\Modules\Marketplace\VendorOrder\Repositories\VendorOrderRepository;
use App\Modules\Marketplace\VendorOrder\Services\VendorOrderCommissionCalculator;
use App\Modules\Marketplace\VendorOrder\Support\ResiMartConnection;
use App\Modules\Platform\Report\Contracts\PlatformVendorOrderAggregationExternalServiceInterface;
use App\Modules\Platform\Report\Support\PlatformVendorOrderRow;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;

/**
 * Platform-wide marketplace order fact-set provider.
 *
 * Loops every provisioned partner, switches into each vendor's resi_mart schema,
 * and emits ONE normalized {@see PlatformVendorOrderRow} per order — EVERY order
 * regardless of status (pending/confirmed/completed/cancelled), so downstream
 * reports that need the full status spectrum (CSAT completion/cancel rate, vendor
 * scorecard, GMV over active orders) get every row.
 *
 * Commission is REALIZED revenue: attributed ONLY for completed orders, taking the
 * manual override first then a point-in-time per-order contract — mirroring
 * {@see \App\Modules\Marketplace\VendorOrder\Services\VendorOrderService::collectConsoleOrders()}
 * so report figures reconcile with the "Đơn hàng vendor" console. Non-completed
 * orders carry zero commission/platformShare/vhShare. `skipped_orders` counts
 * completed orders with neither an override nor a matching per-order contract.
 *
 * Degrades to empty rows + warnings when no vendor schema is present — never
 * throws to the caller.
 */
class PlatformVendorOrderAggregationExternalService implements PlatformVendorOrderAggregationExternalServiceInterface
{
    public function __construct(
        protected PartnerRepository $partnerRepository,
        protected PartnerCommissionContractRepository $contractRepository,
        protected VendorOrderRepository $orderRepository,
        protected VendorOrderCommissionCalculator $calculator,
        protected VendorOrderCommissionOverrideRepository $overrideRepository,
    ) {}

    public function collectOrders(CarbonInterface $from, CarbonInterface $to): array
    {
        /** @var list<PlatformVendorOrderRow> $rows */
        $rows = [];
        $schemaMissing = false;
        $skipped = 0;

        foreach ($this->partnerRepository->allPlatformPartners() as $partner) {
            if ($partner->tenant_id === null) {
                continue;
            }

            if (! ResiMartConnection::schemaExists($partner->tenant_id)) {
                $schemaMissing = true;

                continue;
            }

            $contracts = $this->contractRepository->getCandidateContractsForPartner($partner->id);
            $overrides = $this->overrideRepository->mapByPartner($partner->id);

            // resi_mart triển khai `order_reviews` (đánh giá cư dân) muộn hơn —
            // chỉ eager-load review khi schema vendor đã có bảng, để báo cáo
            // không 500 ở những schema chưa migrate (rating degrade về null).
            $withReviews = ResiMartConnection::tableExists($partner->tenant_id, 'order_reviews');

            /** @var Collection<int, VendorOrder> $orders */
            $orders = ResiMartConnection::runInTenantSchema(
                $partner->tenant_id,
                fn () => $this->orderRepository->allInRangeForAggregation($from, $to, $withReviews),
            );

            $partnerName = $partner->display_name ?? $partner->name;

            foreach ($orders as $order) {
                $commissionAmount = 0;
                $recipient = '';
                $platformShare = 0;
                $vhShare = 0;

                // Read the raw stored status: resi_mart's order table carries
                // statuses (e.g. "shipping") that this repo's VendorOrderStatus
                // enum does not define, so the Eloquent enum cast would throw.
                // Downstream PlatformVendorOrderRow only does string comparisons.
                $rawStatus = (string) $order->getRawOriginal('status');

                // Hoa hồng chỉ THỰC HIỆN khi đơn hoàn thành — mirror
                // VendorOrderService::collectConsoleOrders. Ưu tiên override gán
                // tay, sau đó hợp đồng per_order; đơn chưa completed → hoa hồng 0
                // (vẫn emit row cho GMV/tỉ lệ huỷ ở các báo cáo khác).
                if ($rawStatus === VendorOrderStatus::Completed->value) {
                    $override = $overrides->get((int) $order->id);

                    if ($override !== null) {
                        $commissionAmount = (int) round((float) $this->calculator->computeFromTerms($override->terms, (float) $order->total)['total']);
                        $recipient = $override->revenue_recipient->value;
                    } else {
                        $contract = $this->matchContractPlatform(
                            $contracts,
                            $order->tenant_id,
                            (int) $order->project_id,
                            $order->completed_at,
                        );

                        if ($contract !== null && $contract->commission_mode === CommissionMode::PerOrder) {
                            $commissionAmount = (int) round($this->calculator->compute($contract, (float) $order->total)['total']);
                            $recipient = $contract->revenue_recipient->value;
                        } else {
                            $skipped++;
                        }
                    }

                    $platformShare = $recipient === 'platform' ? $commissionAmount : 0;
                    $vhShare = $recipient === 'operating_company' ? $commissionAmount : 0;
                }

                $rows[] = new PlatformVendorOrderRow(
                    orderId: (int) $order->id,
                    partnerId: $partner->id,
                    partnerName: (string) $partnerName,
                    projectId: $order->project_id !== null ? (int) $order->project_id : null,
                    projectName: null,
                    organizationId: $order->tenant_id,
                    residentId: $order->customer_id !== null ? (int) $order->customer_id : null,
                    residentName: $order->customer?->full_name,
                    // TODO(resi_mart wiring): map customer_source once column lands
                    customerSource: null,
                    type: $this->resolveType($order),
                    offerTitle: $this->resolveOfferTitle($order),
                    amount: (int) round((float) $order->total),
                    commissionAmount: $commissionAmount,
                    recipient: $recipient,
                    platformShare: $platformShare,
                    vhShare: $vhShare,
                    status: $rawStatus,
                    residentRating: $withReviews ? $order->review?->rating : null,
                    residentRatingComment: $withReviews ? $order->review?->content : null,
                    createdAt: $order->created_at->toDateString(),
                    partnerStatus: $partner->status->value,
                    partnerStatusLabel: $partner->status->label(),
                );
            }
        }

        return [
            'rows' => $rows,
            'warnings' => [
                'schema_missing' => $schemaMissing,
                'skipped_orders' => $skipped,
            ],
        ];
    }

    /**
     * Cross-tenant point-in-time contract match — mirrors
     * {@see \App\Modules\Marketplace\VendorOrder\Services\VendorOrderService::matchContractPlatform()}.
     *
     * @param  Collection<int, PartnerCommissionContract>  $contracts
     */
    private function matchContractPlatform(
        Collection $contracts,
        ?string $tenantId,
        int $projectId,
        ?CarbonInterface $at,
    ): ?PartnerCommissionContract {
        if ($at === null || $tenantId === null || $tenantId === '') {
            return null;
        }

        return $contracts
            ->where('tenant_id', $tenantId)
            ->where('project_id', $projectId)
            ->filter(function (PartnerCommissionContract $c) use ($at): bool {
                if ($c->activated_at === null || $c->activated_at->gt($at)) {
                    return false;
                }

                return $c->replaced_at === null || $c->replaced_at->gt($at);
            })
            ->sortByDesc(fn (PartnerCommissionContract $c) => $c->activated_at)
            ->first();
    }

    /**
     * 'service' if any line item is a resi_mart service, otherwise 'product'.
     */
    private function resolveType(VendorOrder $order): string
    {
        foreach ($order->items as $item) {
            if ($item->item_type === 'service') {
                return 'service';
            }
        }

        return 'product';
    }

    private function resolveOfferTitle(VendorOrder $order): ?string
    {
        $first = $order->items->first();

        return $first?->product_name;
    }
}
