<?php

declare(strict_types=1);

namespace App\Modules\Platform\OgOrder\Services;

use App\Modules\Platform\OgOrder\Contracts\OgOrderConsoleServiceInterface;
use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\Platform\Tenant\Repositories\OrganizationRepository;
use App\Modules\PMC\Order\ExternalServices\Platform\TenantProjectOrderExternalServiceInterface;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Throwable;

/**
 * Console Platform "Đơn hàng OG" — gộp ĐỌC-CHỈ mọi đơn PMC (đơn dịch vụ vận hành
 * sinh từ ticket OG) xuyên mọi công ty vận hành.
 *
 * Lặp từng tenant qua {@see OrganizationRepository::allOrganizations()}, đọc đơn
 * trong schema tenant qua PMC ExternalService ($tenant->run), gắn thông tin tenant
 * rồi gom — sort mới-nhất-trước + phân trang trong bộ nhớ (giống console vendor).
 * Degrade mềm: tenant nào lỗi schema bị bỏ qua + đếm vào cảnh báo, không ném.
 */
class OgOrderConsoleService implements OgOrderConsoleServiceInterface
{
    /** Trần khoảng thời gian (ngày) để chặn quét quá rộng — khớp console vendor. */
    private const MAX_RANGE_DAYS = 90;

    /** Mặc định nhìn lại 30 ngày khi không truyền khoảng. */
    private const DEFAULT_RANGE_DAYS = 30;

    public function __construct(
        protected OrganizationRepository $organizationRepository,
        protected TenantProjectOrderExternalServiceInterface $tenantOrders,
    ) {}

    public function listAll(array $filters): array
    {
        $collected = $this->collect($filters);

        $perPage = min((int) ($filters['per_page'] ?? 20), 50);
        $page = max((int) ($filters['page'] ?? 1), 1);

        $sorted = collect($collected['rows'])
            ->sortByDesc(fn (array $row): string => (string) ($row['created_at'] ?? ''))
            ->values();

        $total = $sorted->count();
        $pageRows = $sorted->forPage($page, $perPage)->values()->all();

        $paginator = new LengthAwarePaginator(
            collect($pageRows),
            $total,
            $perPage,
            $page,
            ['path' => request()->url(), 'query' => request()->query()],
        );

        return [
            'data' => $paginator,
            'rows' => $pageRows,
            'warnings' => $collected['warnings'],
        ];
    }

    public function getSummary(array $filters): array
    {
        [$from, $to] = $this->resolveRange($filters['from'] ?? null, $filters['to'] ?? null);

        $collected = $this->collect($filters);
        $rows = $collected['rows'];

        $gmv = 0;
        $platformFee = 0;
        $tenantIds = [];

        foreach ($rows as $row) {
            $gmv += (int) round((float) $row['total_amount']);
            $platformFee += (int) round((float) $row['platform_fee']);
            $tenantIds[(string) ($row['tenant']['id'] ?? '')] = true;
        }

        return [
            'from' => $from->toDateString(),
            'to' => $to->toDateString(),
            'orders_count' => count($rows),
            'gmv' => $gmv,
            'platform_fee' => $platformFee,
            'tenants_count' => count(array_filter(array_keys($tenantIds), fn (string $id): bool => $id !== '')),
            'currency' => 'VND',
            'warnings' => $collected['warnings'],
        ];
    }

    /**
     * Gom toàn bộ row cross-tenant cho bộ lọc đã cho.
     *
     * @param  array<string, mixed>  $filters
     * @return array{rows: list<array<string, mixed>>, warnings: array{tenants_failed: int}}
     */
    private function collect(array $filters): array
    {
        [$from, $to] = $this->resolveRange($filters['from'] ?? null, $filters['to'] ?? null);

        $tenantFilter = ! empty($filters['tenant_id']) ? (string) $filters['tenant_id'] : null;

        $perTenantFilters = [
            'from' => $from->toDateString(),
            'to' => $to->toDateString(),
            'status' => $filters['status'] ?? null,
            'search' => $filters['search'] ?? null,
        ];

        /** @var list<array<string, mixed>> $rows */
        $rows = [];
        $tenantsFailed = 0;

        foreach ($this->organizationRepository->allActiveTenants() as $organization) {
            /** @var Organization $organization */
            if ($tenantFilter !== null && $organization->id !== $tenantFilter) {
                continue;
            }

            try {
                /** @var Collection<int, array<string, mixed>> $tenantRows */
                $tenantRows = $this->tenantOrders->listTenantOrders($organization, $perTenantFilters);
            } catch (Throwable) {
                $tenantsFailed++;

                continue;
            }

            foreach ($tenantRows as $row) {
                $row['tenant'] = [
                    'id' => $organization->id,
                    'name' => $organization->name,
                ];
                $rows[] = $row;
            }
        }

        return [
            'rows' => $rows,
            'warnings' => ['tenants_failed' => $tenantsFailed],
        ];
    }

    /**
     * Khoảng thời gian hiệu lực: mặc định 30 ngày gần nhất, kẹp trần 90 ngày.
     *
     * @return array{0: CarbonInterface, 1: CarbonInterface}
     */
    private function resolveRange(?string $from, ?string $to): array
    {
        $toDate = $to !== null ? CarbonImmutable::parse($to)->endOfDay() : CarbonImmutable::now()->endOfDay();
        $fromDate = $from !== null
            ? CarbonImmutable::parse($from)->startOfDay()
            : $toDate->copy()->subDays(self::DEFAULT_RANGE_DAYS)->startOfDay();

        if ($fromDate->diffInDays($toDate) > self::MAX_RANGE_DAYS) {
            $fromDate = $toDate->copy()->subDays(self::MAX_RANGE_DAYS)->startOfDay();
        }

        return [$fromDate, $toDate];
    }
}
