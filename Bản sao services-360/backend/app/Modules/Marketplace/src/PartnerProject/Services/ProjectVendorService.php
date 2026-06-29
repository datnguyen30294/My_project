<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\PartnerProject\Services;

use App\Modules\Marketplace\Partner\Models\Partner;
use App\Modules\Marketplace\Partner\Repositories\PartnerRepository;
use App\Modules\Marketplace\PartnerProject\Contracts\ProjectVendorServiceInterface;
use App\Modules\Marketplace\PartnerProject\Models\PartnerProject;
use App\Modules\Marketplace\PartnerProject\Repositories\PartnerProjectRepository;
use App\Modules\Marketplace\VendorOffer\Repositories\VendorOfferRepository;
use App\Modules\Marketplace\VendorOrder\Repositories\VendorOrderRepository;
use App\Modules\Marketplace\VendorOrder\Support\ResiMartConnection;
use Throwable;

class ProjectVendorService implements ProjectVendorServiceInterface
{
    public function __construct(
        protected PartnerProjectRepository $partnerProjectRepository,
        protected PartnerRepository $partnerRepository,
        protected VendorOrderRepository $orderRepository,
        protected VendorOfferRepository $offerRepository,
    ) {}

    /**
     * @return array{
     *     vendors: list<array{partner: Partner, enabled: bool, offer_count: int, order_count: int}>,
     *     stats: array{total: int, enabled_count: int},
     *     warnings: array{schema_missing: bool}
     * }
     */
    public function listForProject(string $tenantId, int $projectId): array
    {
        $pivots = $this->partnerProjectRepository->listForProject($tenantId, $projectId);

        if ($pivots->isEmpty()) {
            return $this->emptyResult();
        }

        $partners = $this->partnerRepository
            ->findByIds($pivots->pluck('partner_id')->map(fn ($v) => (int) $v)->all())
            ->keyBy('id');

        $vendors = [];
        $enabledCount = 0;
        $schemaMissing = false;

        foreach ($pivots as $pivot) {
            $partner = $partners->get((int) $pivot->partner_id);

            if (! $partner instanceof Partner) {
                continue;
            }

            [$offerCount, $orderCount, $missing] = $this->countsFor($partner, $tenantId, $projectId);
            $schemaMissing = $schemaMissing || $missing;

            $enabled = (bool) $pivot->is_vendor_enabled;
            if ($enabled) {
                $enabledCount++;
            }

            $vendors[] = [
                'partner' => $partner,
                'enabled' => $enabled,
                'offer_count' => $offerCount,
                'order_count' => $orderCount,
            ];
        }

        return [
            'vendors' => $vendors,
            'stats' => [
                'total' => count($vendors),
                'enabled_count' => $enabledCount,
            ],
            'warnings' => [
                'schema_missing' => $schemaMissing,
            ],
        ];
    }

    public function toggle(
        int $partnerId,
        string $tenantId,
        int $projectId,
        bool $enabled,
        ?int $actorId = null,
    ): ?PartnerProject {
        return $this->partnerProjectRepository->toggleEnabled(
            $partnerId,
            $tenantId,
            $projectId,
            $enabled,
            $actorId,
        );
    }

    /**
     * Đếm số gói (product_project) + số đơn hoàn thành của vendor trên dự án,
     * đọc cross-DB từ schema resi_mart của vendor. Suy biến an toàn về 0 khi
     * vendor chưa provision hoặc resi_mart không tới được.
     *
     * @return array{0: int, 1: int, 2: bool} [offer_count, order_count, schema_missing]
     */
    private function countsFor(Partner $partner, string $tenantId, int $projectId): array
    {
        if ($partner->tenant_id === null) {
            return [0, 0, false];
        }

        try {
            if (! ResiMartConnection::schemaExists($partner->tenant_id)) {
                return [0, 0, true];
            }

            return ResiMartConnection::runInTenantSchema(
                $partner->tenant_id,
                fn (): array => [
                    $this->offerRepository->countActiveForProject($tenantId, $projectId),
                    $this->orderRepository->countCompletedForProject($tenantId, $projectId),
                    false,
                ],
            );
        } catch (Throwable $e) {
            report($e);

            return [0, 0, true];
        }
    }

    /**
     * @return array{vendors: list<never>, stats: array{total: int, enabled_count: int}, warnings: array{schema_missing: bool}}
     */
    private function emptyResult(): array
    {
        return [
            'vendors' => [],
            'stats' => ['total' => 0, 'enabled_count' => 0],
            'warnings' => ['schema_missing' => false],
        ];
    }
}
