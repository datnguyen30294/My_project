<?php

namespace App\Modules\Platform\Tenant\Services;

use App\Common\Exceptions\BusinessException;
use App\Common\Services\BaseService;
use App\Modules\Platform\Tenant\Contracts\OrganizationServiceInterface;
use App\Modules\Platform\Tenant\Contracts\PlatformProjectServiceInterface;
use App\Modules\Platform\Tenant\Enums\SubscriptionCycle;
use App\Modules\Platform\Tenant\Enums\TenantFeeMode;
use App\Modules\Platform\Tenant\ExternalServices\PMC\TenantFeePolicy;
use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\Platform\Tenant\Models\ProjectFeeConfig;
use App\Modules\Platform\Tenant\Models\TenantConfig;
use App\Modules\Platform\Tenant\Repositories\OrganizationRepository;
use App\Modules\Platform\Tenant\Repositories\ProjectFeeConfigRepository;
use App\Modules\PMC\Commission\ExternalServices\Platform\CommissionRebalanceExternalServiceInterface;
use App\Modules\PMC\OgTicket\ExternalServices\Platform\TenantResidentRatingExternalServiceInterface;
use App\Modules\PMC\Order\ExternalServices\Platform\TenantBusinessSummaryExternalServiceInterface;
use App\Modules\PMC\Order\ExternalServices\Platform\TenantProjectOrderExternalServiceInterface;
use App\Modules\PMC\Project\Enums\ProjectStatus;
use App\Modules\PMC\Project\ExternalServices\Platform\TenantProjectExternalServiceInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;

class PlatformProjectService extends BaseService implements PlatformProjectServiceInterface
{
    public function __construct(
        protected OrganizationServiceInterface $organizationService,
        protected OrganizationRepository $organizationRepository,
        protected ProjectFeeConfigRepository $projectFeeConfigRepository,
        protected TenantProjectExternalServiceInterface $tenantProjectService,
        protected TenantBusinessSummaryExternalServiceInterface $businessSummaryService,
        protected TenantProjectOrderExternalServiceInterface $projectOrderService,
        protected TenantResidentRatingExternalServiceInterface $residentRatingService,
        protected CommissionRebalanceExternalServiceInterface $commissionRebalanceService,
    ) {}

    public function list(array $filters): array
    {
        $rows = $this->mergeProjectsAcrossTenants();

        $stats = $this->buildStats($rows);

        $filtered = $this->applyFilters($rows, $filters);
        $this->applySort($filtered, $filters);

        return [
            'paginator' => $this->paginate($filtered, (int) ($filters['per_page'] ?? 10)),
            'stats' => $stats,
        ];
    }

    public function create(string $tenantId, array $data): array
    {
        $tenant = $this->organizationService->findById($tenantId);

        if (! $tenant->is_active) {
            throw new BusinessException(
                message: 'Không thể tạo dự án cho công ty vận hành đang bị vô hiệu hoá.',
                errorCode: 'TENANT_INACTIVE',
            );
        }

        $project = $this->tenantProjectService->createProject($tenant, $data);

        $this->projectFeeConfigRepository->firstOrCreateForProject(
            (string) $tenant->getTenantKey(),
            $project['id'],
        );

        return $this->presentDetail($tenant, $project);
    }

    public function detail(string $tenantId, int $projectId): array
    {
        $tenant = $this->organizationService->findById($tenantId);
        $project = $this->tenantProjectService->findProject($tenant, $projectId);

        return $this->presentDetail($tenant, $project);
    }

    public function businessSummary(string $tenantId, int $projectId, int $months): array
    {
        $tenant = $this->resolveTenantWithProject($tenantId, $projectId);

        return $this->businessSummaryService->getMonthlyBusinessSummary($tenant, $months, $projectId);
    }

    public function orders(string $tenantId, int $projectId, array $filters): LengthAwarePaginator
    {
        $tenant = $this->resolveTenantWithProject($tenantId, $projectId);

        return $this->projectOrderService->listProjectOrders($tenant, $projectId, $filters);
    }

    public function residentRatings(string $tenantId, int $projectId, array $filters): array
    {
        $tenant = $this->resolveTenantWithProject($tenantId, $projectId);

        return $this->residentRatingService->getRatingsForTenant(
            $tenant,
            array_merge($filters, ['project_id' => $projectId]),
        );
    }

    public function getFeeConfig(string $tenantId, int $projectId): array
    {
        $tenant = $this->resolveTenantWithProject($tenantId, $projectId);

        $config = $this->projectFeeConfigRepository->firstOrCreateForProject(
            (string) $tenant->getTenantKey(),
            $projectId,
        );

        return $this->presentFeeConfig($config, $tenant->config);
    }

    public function updateFeeConfig(string $tenantId, int $projectId, array $data): array
    {
        $tenant = $this->resolveTenantWithProject($tenantId, $projectId);

        $config = $this->projectFeeConfigRepository->firstOrCreateForProject(
            (string) $tenant->getTenantKey(),
            $projectId,
        );

        $previousPercent = $this->effectiveAppliedPercent($config, $tenant->config);

        $config->update([
            'inherit_default' => $data['inherit_default'],
            'platform_service_enabled' => $data['platform_service_enabled'],
            'notes' => $data['notes'] ?? null,
            'fee_mode' => $data['inherit_default'] ? null : ($data['fee_mode'] ?? null),
            'fixed_fee_per_order' => $data['fixed_fee_per_order'] ?? 0,
            'percent_fee_per_order' => $data['percent_fee_per_order'] ?? 0,
            'subscription_amount' => $data['subscription_amount'] ?? 0,
            'subscription_cycle' => $data['subscription_cycle'] ?? null,
        ]);

        $config->refresh();

        $newPercent = $this->effectiveAppliedPercent($config, $tenant->config);

        if (abs($newPercent - $previousPercent) > 0.001) {
            $this->commissionRebalanceService->rebalancePartyRulesForPlatformPercent($tenant, $projectId, $newPercent);
        }

        return $this->presentFeeConfig($config, $tenant->config);
    }

    /**
     * Phí % nền tảng thực sự áp dụng cho dự án (override nếu có, ngược lại mặc
     * định tenant) — chính là phần "Platform" trong phân bổ hoa hồng.
     */
    private function effectiveAppliedPercent(ProjectFeeConfig $config, TenantConfig $tenantConfig): float
    {
        if ($config->inherit_default) {
            $mode = $tenantConfig->fee_mode instanceof TenantFeeMode
                ? $tenantConfig->fee_mode
                : ($tenantConfig->fee_mode !== null ? TenantFeeMode::from((string) $tenantConfig->fee_mode) : TenantFeeMode::None);
            $fixed = (float) $tenantConfig->fixed_fee_per_order;
            $percent = (float) $tenantConfig->percent_fee_per_order;
        } else {
            $mode = $config->fee_mode ?? TenantFeeMode::None;
            $fixed = (float) $config->fixed_fee_per_order;
            $percent = (float) $config->percent_fee_per_order;
        }

        return (new TenantFeePolicy($mode, $fixed, $percent))->appliedPercent();
    }

    /**
     * Resolve the tenant and assert the project exists inside its schema (404).
     */
    private function resolveTenantWithProject(string $tenantId, int $projectId): Organization
    {
        $tenant = $this->organizationService->findById($tenantId);
        $this->tenantProjectService->findProject($tenant, $projectId);

        return $tenant;
    }

    /**
     * Iterate every tenant schema, read its projects, and attach tenant + fee
     * config info. O(số tenant) schema switches per request — acceptable at the
     * current scale; revisit with a central registry cache if it grows.
     *
     * @return list<array<string, mixed>>
     */
    private function mergeProjectsAcrossTenants(): array
    {
        $rows = [];

        foreach ($this->organizationRepository->findAll() as $tenant) {
            /** @var Organization $tenant */
            $configs = $this->projectFeeConfigRepository->mapByProjectId((string) $tenant->getTenantKey());

            foreach ($this->tenantProjectService->getProjectsForTenant($tenant) as $project) {
                $config = $configs[$project['id']] ?? null;

                $rows[] = [
                    'id' => $project['id'],
                    'code' => $project['code'],
                    'name' => $project['name'],
                    'address' => $project['address'],
                    'status' => $project['status'],
                    'tenant' => $this->presentTenant($tenant),
                    'platform_service_enabled' => $config?->platform_service_enabled ?? true,
                ];
            }
        }

        return $rows;
    }

    /**
     * @param  list<array<string, mixed>>  $rows
     * @return array{total: int, managing: int, tenant_count: int, service_disabled: int}
     */
    private function buildStats(array $rows): array
    {
        return [
            'total' => count($rows),
            'managing' => count(array_filter(
                $rows,
                fn (array $row): bool => $row['status']['value'] === ProjectStatus::Managing->value,
            )),
            'tenant_count' => count(array_unique(array_map(
                fn (array $row): string => (string) $row['tenant']['id'],
                $rows,
            ))),
            'service_disabled' => count(array_filter(
                $rows,
                fn (array $row): bool => $row['platform_service_enabled'] === false,
            )),
        ];
    }

    /**
     * @param  list<array<string, mixed>>  $rows
     * @param  array<string, mixed>  $filters
     * @return list<array<string, mixed>>
     */
    private function applyFilters(array $rows, array $filters): array
    {
        $search = isset($filters['search']) ? mb_strtolower((string) $filters['search']) : null;

        return array_values(array_filter($rows, function (array $row) use ($filters, $search): bool {
            if ($search !== null && $search !== ''
                && ! str_contains(mb_strtolower((string) $row['code']), $search)
                && ! str_contains(mb_strtolower((string) $row['name']), $search)) {
                return false;
            }

            if (! empty($filters['status']) && $row['status']['value'] !== $filters['status']) {
                return false;
            }

            if (! empty($filters['organization_id']) && (string) $row['tenant']['id'] !== (string) $filters['organization_id']) {
                return false;
            }

            if (array_key_exists('platform_service_enabled', $filters) && $filters['platform_service_enabled'] !== null
                && $row['platform_service_enabled'] !== (bool) $filters['platform_service_enabled']) {
                return false;
            }

            return true;
        }));
    }

    /**
     * @param  list<array<string, mixed>>  $rows
     * @param  array<string, mixed>  $filters
     */
    private function applySort(array &$rows, array $filters): void
    {
        $sortBy = $filters['sort_by'] ?? 'name';
        $direction = ($filters['sort_direction'] ?? 'asc') === 'desc' ? -1 : 1;

        usort($rows, function (array $a, array $b) use ($sortBy, $direction): int {
            $valueA = $sortBy === 'status' ? $a['status']['value'] : (string) $a[$sortBy];
            $valueB = $sortBy === 'status' ? $b['status']['value'] : (string) $b[$sortBy];

            return strcmp((string) $valueA, (string) $valueB) * $direction;
        });
    }

    /**
     * Build a LengthAwarePaginator from an in-memory list (cross-tenant merge
     * can't be paginated at the DB level).
     *
     * @param  list<array<string, mixed>>  $rows
     * @return LengthAwarePaginator<int, array<string, mixed>>
     */
    private function paginate(array $rows, int $perPage): LengthAwarePaginator
    {
        $page = Paginator::resolveCurrentPage();
        $items = array_slice($rows, ($page - 1) * $perPage, $perPage);

        return new LengthAwarePaginator($items, count($rows), $perPage, $page, [
            'path' => Paginator::resolveCurrentPath(),
            'pageName' => 'page',
        ]);
    }

    /**
     * @param  array<string, mixed>  $project
     * @return array<string, mixed>
     */
    private function presentDetail(Organization $tenant, array $project): array
    {
        return [
            'id' => $project['id'],
            'code' => $project['code'],
            'name' => $project['name'],
            'address' => $project['address'],
            'status' => $project['status'],
            'tenant' => array_merge($this->presentTenant($tenant), [
                'domain' => $tenant->domains->first()?->domain,
            ]),
        ];
    }

    /**
     * @return array{id: string, code: string, name: string, is_active: bool}
     */
    private function presentTenant(Organization $tenant): array
    {
        return [
            'id' => (string) $tenant->getTenantKey(),
            'code' => (string) $tenant->getTenantKey(),
            'name' => (string) $tenant->name,
            'is_active' => (bool) $tenant->is_active,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function presentFeeConfig(ProjectFeeConfig $config, TenantConfig $tenantConfig): array
    {
        $tenantDefault = [
            'fee_mode' => $this->feeModePair($tenantConfig->fee_mode),
            'fixed_fee_per_order' => $tenantConfig->fixed_fee_per_order,
            'percent_fee_per_order' => $tenantConfig->percent_fee_per_order,
        ];

        $effective = $config->inherit_default
            ? $tenantDefault
            : [
                'fee_mode' => $this->feeModePair($config->fee_mode ?? TenantFeeMode::None),
                'fixed_fee_per_order' => $config->fixed_fee_per_order,
                'percent_fee_per_order' => $config->percent_fee_per_order,
            ];

        return [
            'inherit_default' => (bool) $config->inherit_default,
            'platform_service_enabled' => (bool) $config->platform_service_enabled,
            'notes' => $config->notes,
            'override' => [
                'fee_mode' => $config->fee_mode !== null ? $this->feeModePair($config->fee_mode) : null,
                'fixed_fee_per_order' => $config->fixed_fee_per_order,
                'percent_fee_per_order' => $config->percent_fee_per_order,
                'subscription_amount' => $config->subscription_amount,
                'subscription_cycle' => $config->subscription_cycle !== null ? $this->cyclePair($config->subscription_cycle) : null,
            ],
            'effective' => $effective,
            'tenant_default' => $tenantDefault,
        ];
    }

    /**
     * @return array{value: string, label: string}
     */
    private function feeModePair(TenantFeeMode $mode): array
    {
        return ['value' => $mode->value, 'label' => $mode->label()];
    }

    /**
     * @return array{value: string, label: string}
     */
    private function cyclePair(SubscriptionCycle $cycle): array
    {
        return ['value' => $cycle->value, 'label' => $cycle->label()];
    }
}
