<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\Partner\Services;

use App\Common\Exceptions\BusinessException;
use App\Modules\Marketplace\Partner\Models\Partner;
use App\Modules\Marketplace\Partner\Repositories\PartnerRepository;
use App\Modules\Marketplace\VendorOrder\Enums\VendorOrderType;
use App\Modules\Marketplace\VendorOrder\Models\VendorOrderReview;
use App\Modules\Marketplace\VendorOrder\Repositories\VendorOrderReviewRepository;
use App\Modules\Marketplace\VendorOrder\Support\ResiMartConnection;
use App\Modules\Platform\Tenant\ExternalServices\Marketplace\OrganizationLookupExternalServiceInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\LengthAwarePaginator as Paginator;
use Illuminate\Support\Collection;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

/**
 * Đánh giá cư dân theo vendor cho console Platform "Quản lý Vendor" — đọc bảng
 * `order_reviews` cross-DB từ schema resi_mart của vendor (1 review / đơn,
 * chỉ tính review đã publish). Suy biến an toàn về empty khi vendor chưa
 * provision / resi_mart chưa migrate `order_reviews` / không tới được.
 */
class PlatformPartnerRatingService
{
    public function __construct(
        protected PartnerRepository $partnerRepository,
        protected VendorOrderReviewRepository $reviewRepository,
        protected OrganizationLookupExternalServiceInterface $orgLookup,
    ) {}

    /**
     * @param  array<string, mixed>  $filters  search / rating / project_id / page / per_page
     * @return array{
     *     data: list<array<string, mixed>>,
     *     summary: array{average: float|null, count: int},
     *     meta: array{current_page: int, last_page: int, per_page: int, total: int, from: int|null, to: int|null},
     *     warnings: array{schema_missing: bool}
     * }
     */
    public function list(int $partnerId, array $filters): array
    {
        $partner = $this->resolvePartner($partnerId);

        if ($partner->tenant_id === null) {
            return $this->emptyResult($filters);
        }

        try {
            if (! ResiMartConnection::schemaExists($partner->tenant_id)) {
                return $this->emptyResult($filters, schemaMissing: true);
            }

            if (! ResiMartConnection::tableExists($partner->tenant_id, 'order_reviews')) {
                return $this->emptyResult($filters);
            }

            /** @var array{0: LengthAwarePaginator, 1: array{average: float|null, count: int}} $result */
            $result = ResiMartConnection::runInTenantSchema(
                $partner->tenant_id,
                fn (): array => [
                    $this->reviewRepository->paginateForCurrentSchema($filters),
                    $this->reviewRepository->summaryForCurrentSchema(),
                ],
            );

            [$paginator, $summary] = $result;

            return [
                'data' => $this->mapRows($paginator->getCollection()),
                'summary' => $summary,
                'meta' => $this->meta($paginator),
                'warnings' => ['schema_missing' => false],
            ];
        } catch (Throwable $e) {
            report($e);

            return $this->emptyResult($filters, schemaMissing: true);
        }
    }

    private function resolvePartner(int $partnerId): Partner
    {
        $partner = $this->partnerRepository->findByIdOrNull($partnerId);

        if ($partner === null) {
            throw new BusinessException(
                message: 'Vendor không tồn tại.',
                errorCode: 'VENDOR_NOT_FOUND',
                httpStatusCode: Response::HTTP_NOT_FOUND,
            );
        }

        return $partner;
    }

    /**
     * Map mỗi review → dòng đánh giá cho FE. Tên dự án resolve qua PMC central
     * SAU khi thoát search_path resi_mart (orgLookup dùng connection khác).
     *
     * @param  Collection<int, VendorOrderReview>  $reviews
     * @return list<array<string, mixed>>
     */
    private function mapRows(Collection $reviews): array
    {
        if ($reviews->isEmpty()) {
            return [];
        }

        $projectNames = $this->resolveProjectNames($reviews);

        return $reviews->map(function (VendorOrderReview $review) use ($projectNames): array {
            $order = $review->order;
            $tenantId = $order?->tenant_id;
            $projectId = $order?->project_id !== null ? (int) $order->project_id : null;

            $type = VendorOrderType::deriveFromItems($order?->items ?? []);

            return [
                'order_code' => $order?->code ?? '—',
                'order_type' => ['value' => $type->value, 'label' => $type->label()],
                'project' => $projectId === null ? null : [
                    'id' => $projectId,
                    'name' => $projectNames[(string) $tenantId][$projectId] ?? ('Dự án #'.$projectId),
                ],
                'resident_name' => $review->reviewer_name ?? $order?->customer?->full_name ?? '—',
                'score' => (int) $review->rating,
                'comment' => $review->content,
                'rated_at' => $review->created_at?->toIso8601String(),
            ];
        })->all();
    }

    /**
     * Batch-resolve project names per PMC tenant for the page of reviews.
     *
     * @param  Collection<int, VendorOrderReview>  $reviews
     * @return array<string, array<int, string>>
     */
    private function resolveProjectNames(Collection $reviews): array
    {
        $names = [];

        $byTenant = $reviews
            ->map(fn (VendorOrderReview $r) => $r->order)
            ->filter(fn ($order) => $order !== null && $order->tenant_id !== null && $order->project_id !== null)
            ->groupBy(fn ($order) => (string) $order->tenant_id);

        foreach ($byTenant as $tenantId => $orders) {
            $projectIds = $orders
                ->pluck('project_id')
                ->map(fn ($v): int => (int) $v)
                ->unique()
                ->values()
                ->all();

            $names[(string) $tenantId] = $projectIds === []
                ? []
                : $this->orgLookup->getProjectNamesForTenant((string) $tenantId, $projectIds);
        }

        return $names;
    }

    /**
     * @return array{current_page: int, last_page: int, per_page: int, total: int, from: int|null, to: int|null}
     */
    private function meta(LengthAwarePaginator $paginator): array
    {
        return [
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
            'total' => $paginator->total(),
            'from' => $paginator->firstItem(),
            'to' => $paginator->lastItem(),
        ];
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return array{
     *     data: list<array<string, mixed>>,
     *     summary: array{average: float|null, count: int},
     *     meta: array{current_page: int, last_page: int, per_page: int, total: int, from: int|null, to: int|null},
     *     warnings: array{schema_missing: bool}
     * }
     */
    private function emptyResult(array $filters, bool $schemaMissing = false): array
    {
        $perPage = min((int) ($filters['per_page'] ?? 20), 50);
        $paginator = new Paginator([], 0, $perPage, (int) ($filters['page'] ?? 1));

        return [
            'data' => [],
            'summary' => ['average' => null, 'count' => 0],
            'meta' => $this->meta($paginator),
            'warnings' => ['schema_missing' => $schemaMissing],
        ];
    }
}
