<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\Partner\Services;

use App\Modules\Marketplace\Partner\Enums\PartnerStatus;
use App\Modules\Marketplace\Partner\Models\Partner;
use App\Modules\Marketplace\Partner\Repositories\PartnerRepository;
use App\Modules\Marketplace\PartnerCommissionContract\Models\PartnerCommissionContract;
use App\Modules\Marketplace\PartnerCommissionContract\Repositories\PartnerCommissionContractRepository;
use App\Modules\Marketplace\PartnerProject\Models\PartnerProject;
use App\Modules\Marketplace\PartnerProject\Repositories\PartnerProjectRepository;
use App\Modules\Marketplace\VendorOffer\Repositories\VendorOfferRepository;
use App\Modules\Marketplace\VendorOrder\Repositories\VendorOrderRepository;
use App\Modules\Marketplace\VendorOrder\Repositories\VendorOrderReviewRepository;
use App\Modules\Marketplace\VendorOrder\Support\ResiMartConnection;
use App\Modules\Platform\Tenant\ExternalServices\Marketplace\OrganizationLookupExternalServiceInterface;
use Illuminate\Support\Collection;
use Throwable;

/**
 * Cross-cutting aggregate read-helper for the platform "Quản lý Vendor"
 * console: status stats cards, list aggregate counts (project / offer / order),
 * and the per-project commission table on the vendor detail page.
 *
 * Keeps these console-only concerns out of the lean PartnerService used by both
 * the platform and tenant CRUD endpoints.
 */
class PartnerConsoleService
{
    public function __construct(
        protected PartnerRepository $partnerRepository,
        protected PartnerProjectRepository $partnerProjectRepository,
        protected VendorOfferRepository $offerRepository,
        protected VendorOrderRepository $orderRepository,
        protected VendorOrderReviewRepository $reviewRepository,
        protected PartnerCommissionContractRepository $contractRepository,
        protected OrganizationLookupExternalServiceInterface $orgLookup,
    ) {}

    /**
     * Status breakdown for the 4 stats cards. `inactive` == suspended (spec §7.3).
     *
     * @return array{total: int, active: int, pending: int, inactive: int}
     */
    public function stats(): array
    {
        $counts = $this->partnerRepository->statusCounts();

        return [
            'total' => array_sum($counts),
            'active' => $counts[PartnerStatus::Active->value] ?? 0,
            'pending' => $counts[PartnerStatus::Pending->value] ?? 0,
            'inactive' => $counts[PartnerStatus::Suspended->value] ?? 0,
        ];
    }

    /**
     * Decorate a page of partners with aggregate fields for the console list:
     * project_count (cheap), owner_tenant name, offer_count / order_count +
     * resident rating aggregate (cross-DB from resi_mart, degrades to 0 / null).
     *
     * @param  Collection<int, Partner>  $partners
     */
    public function decorateList(Collection $partners): void
    {
        if ($partners->isEmpty()) {
            return;
        }

        $partnerIds = $partners->pluck('id')->map(fn ($v) => (int) $v)->all();
        $projectCounts = $this->partnerProjectRepository->countsByPartnerIds($partnerIds);

        $ownerTenantIds = $partners
            ->pluck('owner_tenant_id')
            ->filter(fn ($v) => $v !== null && $v !== '')
            ->unique()
            ->values()
            ->all();

        $tenantNames = $ownerTenantIds === [] ? [] : $this->orgLookup->getTenantNames($ownerTenantIds);

        foreach ($partners as $partner) {
            $stats = $this->crossDbStats($partner);

            $partner->setAttribute('project_count', $projectCounts[(int) $partner->id] ?? 0);
            $partner->setAttribute('offer_count', $stats['offers']);
            $partner->setAttribute('order_count', $stats['orders']);
            $partner->setAttribute('rating', $stats['rating']);
            $partner->setAttribute(
                'owner_tenant',
                $partner->owner_tenant_id === null
                    ? null
                    : ['id' => $partner->owner_tenant_id, 'name' => $tenantNames[$partner->owner_tenant_id] ?? null],
            );
        }
    }

    /**
     * Per-project rows for the vendor detail page: each (tenant, project) the
     * vendor is linked to, its pause flag, and its active commission contract
     * (mode / terms / revenue_recipient) when one exists.
     *
     * @return list<array{
     *     project_id: int,
     *     project_name: string,
     *     tenant_id: string,
     *     tenant_name: string|null,
     *     is_vendor_enabled: bool,
     *     commission: array{
     *         contract_id: int,
     *         mode: array{value: string, label: string},
     *         terms: array<string, mixed>,
     *         revenue_recipient: array{value: string, label: string},
     *         is_override: bool
     *     }|null
     * }>
     */
    public function buildProjects(Partner $partner): array
    {
        $pivots = $this->partnerProjectRepository->allForPartner((int) $partner->id);

        if ($pivots->isEmpty()) {
            return [];
        }

        $tenantIds = $pivots->pluck('tenant_id')->filter()->unique()->values()->all();
        $tenantNames = $this->orgLookup->getTenantNames($tenantIds);

        $projectNames = [];

        foreach ($pivots->groupBy('tenant_id') as $tenantId => $group) {
            if ($tenantId === null || $tenantId === '') {
                continue;
            }

            $projectIds = $group->pluck('project_id')->map(fn ($v) => (int) $v)->unique()->values()->all();
            $projectNames[$tenantId] = $this->orgLookup->getProjectNamesForTenant((string) $tenantId, $projectIds);
        }

        return $pivots->map(function (PartnerProject $pivot) use ($partner, $tenantNames, $projectNames): array {
            $tenantId = (string) $pivot->tenant_id;
            $projectId = (int) $pivot->project_id;

            $contract = $this->contractRepository->findActiveFor((int) $partner->id, $tenantId, $projectId);

            return [
                'project_id' => $projectId,
                'project_name' => $projectNames[$tenantId][$projectId] ?? sprintf('Dự án #%d', $projectId),
                'tenant_id' => $tenantId,
                'tenant_name' => $tenantNames[$tenantId] ?? null,
                'is_vendor_enabled' => (bool) $pivot->is_vendor_enabled,
                'commission' => $contract === null ? null : $this->commissionRow($contract),
            ];
        })->all();
    }

    /**
     * @return array{
     *     contract_id: int,
     *     mode: array{value: string, label: string},
     *     terms: array<string, mixed>,
     *     revenue_recipient: array{value: string, label: string},
     *     is_override: bool
     * }
     */
    private function commissionRow(PartnerCommissionContract $contract): array
    {
        return [
            'contract_id' => (int) $contract->id,
            'mode' => [
                'value' => $contract->commission_mode->value,
                'label' => $contract->commission_mode->label(),
            ],
            'terms' => $contract->terms ?? [],
            'revenue_recipient' => [
                'value' => $contract->revenue_recipient->value,
                'label' => $contract->revenue_recipient->label(),
            ],
            'is_override' => true,
        ];
    }

    /**
     * Offer count, order count + resident rating aggregate read from the
     * vendor's resi_mart schema in a single switch. Degrades to zeros / null
     * rating when the vendor isn't provisioned or resi_mart is unreachable.
     * Rating also degrades to null when the schema predates `order_reviews`.
     *
     * @return array{offers: int, orders: int, rating: array{avg: float, count: int}|null}
     */
    private function crossDbStats(Partner $partner): array
    {
        $empty = ['offers' => 0, 'orders' => 0, 'rating' => null];

        if ($partner->tenant_id === null) {
            return $empty;
        }

        try {
            if (! ResiMartConnection::schemaExists($partner->tenant_id)) {
                return $empty;
            }

            $hasReviews = ResiMartConnection::tableExists($partner->tenant_id, 'order_reviews');

            return ResiMartConnection::runInTenantSchema(
                $partner->tenant_id,
                function () use ($hasReviews): array {
                    $rating = null;

                    if ($hasReviews) {
                        $summary = $this->reviewRepository->summaryForCurrentSchema();
                        $rating = $summary['count'] > 0
                            ? ['avg' => (float) $summary['average'], 'count' => $summary['count']]
                            : null;
                    }

                    return [
                        'offers' => $this->offerRepository->countForPartner(),
                        'orders' => $this->orderRepository->countAllCompleted(),
                        'rating' => $rating,
                    ];
                },
            );
        } catch (Throwable $e) {
            report($e);

            return $empty;
        }
    }
}
