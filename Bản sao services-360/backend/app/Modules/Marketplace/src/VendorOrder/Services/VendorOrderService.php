<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOrder\Services;

use App\Common\Exceptions\BusinessException;
use App\Modules\Marketplace\Partner\ExternalServices\ResiMartOrderStatusServiceInterface;
use App\Modules\Marketplace\Partner\ExternalServices\ResiMartProvisioningException;
use App\Modules\Marketplace\Partner\Repositories\PartnerRepository;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\CommissionMode;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\RevenueRecipient;
use App\Modules\Marketplace\PartnerCommissionContract\Models\PartnerCommissionContract;
use App\Modules\Marketplace\PartnerCommissionContract\Repositories\PartnerCommissionContractRepository;
use App\Modules\Marketplace\VendorOrder\Contracts\VendorOrderServiceInterface;
use App\Modules\Marketplace\VendorOrder\Enums\VendorOrderStatus;
use App\Modules\Marketplace\VendorOrder\Enums\VendorOrderType;
use App\Modules\Marketplace\VendorOrder\Models\VendorOrder;
use App\Modules\Marketplace\VendorOrder\Models\VendorOrderCommissionOverride;
use App\Modules\Marketplace\VendorOrder\Repositories\VendorOrderCommissionOverrideRepository;
use App\Modules\Marketplace\VendorOrder\Repositories\VendorOrderRepository;
use App\Modules\Marketplace\VendorOrder\Support\ResiMartConnection;
use App\Modules\Platform\Tenant\ExternalServices\Marketplace\OrganizationLookupExternalServiceInterface;
use App\Modules\PMC\ExternalServices\Marketplace\ProjectExternalServiceInterface;
use Carbon\Carbon;
use Carbon\CarbonInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Symfony\Component\HttpFoundation\Response;

class VendorOrderService implements VendorOrderServiceInterface
{
    private const DATE_RANGE_MAX_DAYS = 90;

    private const DATE_RANGE_DEFAULT_DAYS = 30;

    public function __construct(
        protected PartnerRepository $partnerRepository,
        protected PartnerCommissionContractRepository $contractRepository,
        protected VendorOrderRepository $orderRepository,
        protected VendorOrderCommissionCalculator $calculator,
        protected ProjectExternalServiceInterface $projectService,
        protected OrganizationLookupExternalServiceInterface $orgLookup,
        protected VendorOrderConsoleAssembler $assembler,
        protected VendorOrderCommissionOverrideRepository $overrideRepository,
        protected ResiMartOrderStatusServiceInterface $orderStatusClient,
    ) {}

    public function listForPartner(int $partnerId, string $scopeTenantId, array $filters): array
    {
        $partner = $this->resolvePartner($partnerId, $scopeTenantId);

        [$from, $to] = $this->resolveRange($filters['from'] ?? null, $filters['to'] ?? null);

        $projectIds = $this->projectService->getCurrentTenantProjectIds();

        if ($projectIds === [] || $partner->tenant_id === null) {
            return $this->emptyListResult($filters);
        }

        if (! ResiMartConnection::schemaExists($partner->tenant_id)) {
            return $this->emptyListResult($filters, schemaMissing: true);
        }

        // Pre-load contracts để match in-memory
        $contracts = $this->contractRepository->getCandidateContractsForLookup(
            $partner->id,
            $scopeTenantId,
            $projectIds,
        );

        $filters['from'] = $from;
        $filters['to'] = $to;

        $orphan = 0;
        $nonPerOrder = 0;

        $paginator = ResiMartConnection::runInTenantSchema($partner->tenant_id, function () use ($projectIds, $filters) {
            return $this->orderRepository->listForPartner($projectIds, $filters);
        });

        $projectNames = $this->projectService->getNamesByIds(
            $paginator->getCollection()->pluck('project_id')->unique()->all(),
        );

        $decorated = [];

        foreach ($paginator->items() as $order) {
            $contract = $this->matchContract($contracts, (int) $order->project_id, $order->completed_at);

            if ($contract !== null && $contract->commission_mode === CommissionMode::PerOrder) {
                $commission = $this->buildContractCommission($contract, $order);
            } else {
                if ($contract === null) {
                    $orphan++;
                } else {
                    $nonPerOrder++;
                }

                $commission = $this->buildDefaultCommission($order);
            }

            $decorated[] = [
                'order' => $order,
                'project_name' => $projectNames[$order->project_id] ?? sprintf('Dự án #%d (đã xoá)', $order->project_id),
                'commission' => $commission,
            ];
        }

        $newPaginator = new LengthAwarePaginator(
            collect($decorated),
            $paginator->total(),
            $paginator->perPage(),
            $paginator->currentPage(),
            ['path' => request()->url(), 'query' => request()->query()],
        );

        return [
            'data' => $newPaginator,
            'warnings' => [
                'orphan_orders_count' => $orphan,
                'non_per_order_orders_count' => $nonPerOrder,
                'schema_missing' => false,
            ],
            'project_id_map' => $projectNames,
            'decorated' => $decorated,
        ];
    }

    public function listAllForTenant(string $scopeTenantId, array $filters): array
    {
        [$from, $to] = $this->resolveRange($filters['from'] ?? null, $filters['to'] ?? null);
        $filters['from'] = $from;
        $filters['to'] = $to;

        $perPage = min((int) ($filters['per_page'] ?? 20), 50);
        $page = max((int) ($filters['page'] ?? 1), 1);

        $projectIds = $this->projectService->getCurrentTenantProjectIds();
        $partners = $this->resolveVisiblePartners($scopeTenantId, $filters['partner_id'] ?? null);

        $orphan = 0;
        $nonPerOrder = 0;
        $decorated = [];

        if ($projectIds !== []) {
            foreach ($partners as $partner) {
                if ($partner->tenant_id === null || ! ResiMartConnection::schemaExists($partner->tenant_id)) {
                    continue;
                }

                $contracts = $this->contractRepository->getCandidateContractsForLookup(
                    $partner->id,
                    $scopeTenantId,
                    $projectIds,
                );

                $orders = ResiMartConnection::runInTenantSchema(
                    $partner->tenant_id,
                    fn () => $this->orderRepository->allInRangeWithDetails($projectIds, $filters),
                );

                foreach ($orders as $order) {
                    $contract = $this->matchContract($contracts, (int) $order->project_id, $order->completed_at);

                    if ($contract !== null && $contract->commission_mode === CommissionMode::PerOrder) {
                        $commission = $this->buildContractCommission($contract, $order);
                    } else {
                        if ($contract === null) {
                            $orphan++;
                        } else {
                            $nonPerOrder++;
                        }

                        $commission = $this->buildDefaultCommission($order);
                    }

                    $decorated[] = [
                        'order' => $order,
                        'vendor' => [
                            'id' => $partner->id,
                            'name' => $partner->name,
                            'slug' => $partner->slug,
                        ],
                        'project_name' => '',
                        'commission' => $commission,
                    ];
                }
            }
        }

        $projectNames = $this->projectService->getNamesByIds(
            collect($decorated)->map(fn ($row) => (int) $row['order']->project_id)->unique()->all(),
        );

        $decorated = collect($decorated)
            ->map(function (array $row) use ($projectNames) {
                $row['project_name'] = $projectNames[$row['order']->project_id]
                    ?? sprintf('Dự án #%d (đã xoá)', $row['order']->project_id);

                return $row;
            })
            ->sortByDesc(fn (array $row) => optional($row['order']->completed_at)->getTimestamp() ?? 0)
            ->values();

        $total = $decorated->count();
        $pageRows = $decorated->forPage($page, $perPage)->values();

        $paginator = new LengthAwarePaginator(
            $pageRows,
            $total,
            $perPage,
            $page,
            ['path' => request()->url(), 'query' => request()->query()],
        );

        return [
            'data' => $paginator,
            'warnings' => [
                'orphan_orders_count' => $orphan,
                'non_per_order_orders_count' => $nonPerOrder,
                'schema_missing' => false,
            ],
            'decorated' => $pageRows->all(),
        ];
    }

    public function getSummaryAllForTenant(string $scopeTenantId, array $filters): array
    {
        [$from, $to] = $this->resolveRange($filters['from'] ?? null, $filters['to'] ?? null);

        $base = [
            'from' => $from->toDateString(),
            'to' => $to->toDateString(),
            'orders_count' => 0,
            'revenue_total' => 0.0,
            'commission_total' => 0.0,
            'average_commission_per_order' => 0.0,
            'currency' => 'VND',
            'vendors_count' => 0,
            'warnings' => [
                'orphan_orders_count' => 0,
                'non_per_order_orders_count' => 0,
                'schema_missing' => false,
            ],
        ];

        $projectIds = $this->projectService->getCurrentTenantProjectIds();

        if ($projectIds === []) {
            return $base;
        }

        $partners = $this->resolveVisiblePartners($scopeTenantId, $filters['partner_id'] ?? null);

        $orphan = 0;
        $nonPerOrder = 0;
        $revenueTotal = 0.0;
        $commissionTotal = 0.0;
        $count = 0;
        $vendorIds = [];

        foreach ($partners as $partner) {
            if ($partner->tenant_id === null || ! ResiMartConnection::schemaExists($partner->tenant_id)) {
                continue;
            }

            $contracts = $this->contractRepository->getCandidateContractsForLookup(
                $partner->id,
                $scopeTenantId,
                $projectIds,
            );

            $orders = ResiMartConnection::runInTenantSchema(
                $partner->tenant_id,
                fn () => $this->orderRepository->allInRangeForCommission($projectIds, $from, $to),
            );

            foreach ($orders as $order) {
                $contract = $this->matchContract($contracts, (int) $order->project_id, $order->completed_at);

                if ($contract !== null && $contract->commission_mode === CommissionMode::PerOrder) {
                    $commissionTotal += (float) $this->calculator->compute($contract, (float) $order->total)['total'];
                } elseif ($contract === null) {
                    $orphan++;
                } else {
                    $nonPerOrder++;
                }

                $count++;
                $revenueTotal += (float) $order->total;
                $vendorIds[$partner->id] = true;
            }
        }

        return [
            'from' => $from->toDateString(),
            'to' => $to->toDateString(),
            'orders_count' => $count,
            'revenue_total' => round($revenueTotal, 2),
            'commission_total' => round($commissionTotal, 2),
            'average_commission_per_order' => $count > 0 ? round($commissionTotal / $count, 2) : 0.0,
            'currency' => 'VND',
            'vendors_count' => count($vendorIds),
            'warnings' => [
                'orphan_orders_count' => $orphan,
                'non_per_order_orders_count' => $nonPerOrder,
                'schema_missing' => false,
            ],
        ];
    }

    public function getDetail(int $partnerId, string $scopeTenantId, int $orderId): ?array
    {
        $partner = $this->resolvePartner($partnerId, $scopeTenantId);
        $projectIds = $this->projectService->getCurrentTenantProjectIds();

        if ($projectIds === [] || $partner->tenant_id === null) {
            return null;
        }

        if (! ResiMartConnection::schemaExists($partner->tenant_id)) {
            return null;
        }

        /** @var VendorOrder|null */
        $order = ResiMartConnection::runInTenantSchema(
            $partner->tenant_id,
            fn () => $this->orderRepository->findById($orderId, $projectIds),
        );

        if ($order === null) {
            return null;
        }

        $contract = $this->contractRepository->findActiveAt(
            $partner->id,
            $scopeTenantId,
            (int) $order->project_id,
            $order->completed_at ?? Carbon::now(),
        );

        $projectName = $this->projectService->getNamesByIds([(int) $order->project_id])[$order->project_id]
            ?? sprintf('Dự án #%d (đã xoá)', $order->project_id);

        $commission = $contract !== null && $contract->commission_mode === CommissionMode::PerOrder
            ? $this->buildContractCommission($contract, $order)
            : $this->buildDefaultCommission($order);

        return [
            'order' => $order,
            'project' => [
                'id' => (int) $order->project_id,
                'name' => $projectName,
            ],
            'commission' => $commission,
        ];
    }

    public function getSummary(
        int $partnerId,
        string $scopeTenantId,
        ?CarbonInterface $from = null,
        ?CarbonInterface $to = null,
    ): array {
        $partner = $this->resolvePartner($partnerId, $scopeTenantId);
        [$from, $to] = $this->resolveRange($from, $to);

        $base = [
            'from' => $from->toDateString(),
            'to' => $to->toDateString(),
            'orders_count' => 0,
            'revenue_total' => 0.0,
            'commission_total' => 0.0,
            'average_commission_per_order' => 0.0,
            'currency' => 'VND',
            'warnings' => [
                'orphan_orders_count' => 0,
                'non_per_order_orders_count' => 0,
                'schema_missing' => false,
            ],
        ];

        $projectIds = $this->projectService->getCurrentTenantProjectIds();

        if ($projectIds === [] || $partner->tenant_id === null) {
            return $base;
        }

        if (! ResiMartConnection::schemaExists($partner->tenant_id)) {
            $base['warnings']['schema_missing'] = true;

            return $base;
        }

        $contracts = $this->contractRepository->getCandidateContractsForLookup(
            $partner->id,
            $scopeTenantId,
            $projectIds,
        );

        $orders = ResiMartConnection::runInTenantSchema(
            $partner->tenant_id,
            fn () => $this->orderRepository->allInRangeForCommission($projectIds, $from, $to),
        );

        $orphan = 0;
        $nonPerOrder = 0;
        $revenueTotal = 0.0;
        $commissionTotal = 0.0;
        $count = 0;

        foreach ($orders as $order) {
            $contract = $this->matchContract($contracts, (int) $order->project_id, $order->completed_at);

            if ($contract !== null && $contract->commission_mode === CommissionMode::PerOrder) {
                $commissionTotal += (float) $this->calculator->compute($contract, (float) $order->total)['total'];
            } elseif ($contract === null) {
                $orphan++;
            } else {
                $nonPerOrder++;
            }

            $count++;
            $revenueTotal += (float) $order->total;
        }

        return [
            'from' => $from->toDateString(),
            'to' => $to->toDateString(),
            'orders_count' => $count,
            'revenue_total' => round($revenueTotal, 2),
            'commission_total' => round($commissionTotal, 2),
            'average_commission_per_order' => $count > 0 ? round($commissionTotal / $count, 2) : 0.0,
            'currency' => 'VND',
            'warnings' => [
                'orphan_orders_count' => $orphan,
                'non_per_order_orders_count' => $nonPerOrder,
                'schema_missing' => false,
            ],
        ];
    }

    public function getCompletedOrdersForReport(string $scopeTenantId, array $filters): array
    {
        [$from, $to] = $this->resolveRange($filters['from'] ?? null, $filters['to'] ?? null);

        $base = [
            'from' => $from->toDateString(),
            'to' => $to->toDateString(),
            'currency' => 'VND',
            'rows' => [],
            'warnings' => [
                'orphan_orders_count' => 0,
                'non_per_order_orders_count' => 0,
                'schema_missing' => false,
            ],
        ];

        $projectIds = $this->projectService->getCurrentTenantProjectIds();

        if ($projectIds === []) {
            return $base;
        }

        $partners = $this->resolveVisiblePartners($scopeTenantId, $filters['partner_id'] ?? null);

        $projectIdFilter = isset($filters['project_id']) && $filters['project_id'] !== null && $filters['project_id'] !== ''
            ? (int) $filters['project_id']
            : null;

        $orphan = 0;
        $nonPerOrder = 0;

        /** @var list<array{vendor_id:int, vendor_name:string, project_id:int, completed_at:\Carbon\CarbonInterface, revenue:float, commission:float}> $rows */
        $rows = [];

        foreach ($partners as $partner) {
            if ($partner->tenant_id === null || ! ResiMartConnection::schemaExists($partner->tenant_id)) {
                continue;
            }

            $contracts = $this->contractRepository->getCandidateContractsForLookup(
                $partner->id,
                $scopeTenantId,
                $projectIds,
            );

            $orders = ResiMartConnection::runInTenantSchema(
                $partner->tenant_id,
                fn () => $this->orderRepository->allInRangeForCommission($projectIds, $from, $to),
            );

            foreach ($orders as $order) {
                if ($projectIdFilter !== null && (int) $order->project_id !== $projectIdFilter) {
                    continue;
                }

                $contract = $this->matchContract($contracts, (int) $order->project_id, $order->completed_at);

                if ($contract !== null && $contract->commission_mode === CommissionMode::PerOrder) {
                    $commissionAmount = (float) $this->calculator->compute($contract, (float) $order->total)['total'];
                } else {
                    if ($contract === null) {
                        $orphan++;
                    } else {
                        $nonPerOrder++;
                    }

                    $commissionAmount = 0.0;
                }

                $rows[] = [
                    'vendor_id' => $partner->id,
                    'vendor_name' => (string) $partner->name,
                    'project_id' => (int) $order->project_id,
                    'completed_at' => $order->completed_at ?? Carbon::now(),
                    'revenue' => (float) $order->total,
                    'commission' => $commissionAmount,
                ];
            }
        }

        $projectNames = $this->projectService->getNamesByIds(
            collect($rows)->pluck('project_id')->unique()->all(),
        );

        $base['rows'] = collect($rows)
            ->map(fn (array $row): array => [
                'vendor_id' => $row['vendor_id'],
                'vendor_name' => $row['vendor_name'],
                'project_id' => $row['project_id'],
                'project_name' => $projectNames[$row['project_id']] ?? sprintf('Dự án #%d (đã xoá)', $row['project_id']),
                'completed_at' => $row['completed_at']->toDateString(),
                'revenue' => $row['revenue'],
                'commission' => $row['commission'],
            ])
            ->all();

        $base['warnings']['orphan_orders_count'] = $orphan;
        $base['warnings']['non_per_order_orders_count'] = $nonPerOrder;

        return $base;
    }

    public function listForPartnerPlatform(int $partnerId, array $filters): array
    {
        $partner = $this->resolvePartnerPlatform($partnerId);

        [$from, $to] = $this->resolveRange($filters['from'] ?? null, $filters['to'] ?? null);
        $filters['from'] = $from;
        $filters['to'] = $to;

        if ($partner->tenant_id === null) {
            return $this->emptyPlatformListResult($filters);
        }

        if (! ResiMartConnection::schemaExists($partner->tenant_id)) {
            return $this->emptyPlatformListResult($filters, schemaMissing: true);
        }

        $contracts = $this->contractRepository->getCandidateContractsForPartner($partner->id);

        $paginator = ResiMartConnection::runInTenantSchema(
            $partner->tenant_id,
            fn () => $this->orderRepository->listAllForPartner($filters),
        );

        $orphan = 0;
        $nonPerOrder = 0;
        $decorated = [];

        foreach ($paginator->items() as $order) {
            $contract = $this->matchContractPlatform(
                $contracts,
                $order->tenant_id,
                (int) $order->project_id,
                $order->completed_at,
            );

            if ($contract !== null && $contract->commission_mode === CommissionMode::PerOrder) {
                $commission = $this->buildContractCommission($contract, $order);
            } else {
                if ($contract === null) {
                    $orphan++;
                } else {
                    $nonPerOrder++;
                }

                $commission = $this->buildDefaultCommission($order);
            }

            $decorated[] = [
                'order' => $order,
                'tenant_id' => $order->tenant_id,
                'project_name' => '',
                'commission' => $commission,
            ];
        }

        $decorated = $this->resolvePlatformNames($decorated);

        $newPaginator = new LengthAwarePaginator(
            collect($decorated),
            $paginator->total(),
            $paginator->perPage(),
            $paginator->currentPage(),
            ['path' => request()->url(), 'query' => request()->query()],
        );

        return [
            'data' => $newPaginator,
            'warnings' => [
                'orphan_orders_count' => $orphan,
                'non_per_order_orders_count' => $nonPerOrder,
                'schema_missing' => false,
            ],
            'decorated' => $decorated,
        ];
    }

    public function getDetailPlatform(int $partnerId, int $orderId): ?array
    {
        $partner = $this->resolvePartnerPlatform($partnerId);

        if ($partner->tenant_id === null || ! ResiMartConnection::schemaExists($partner->tenant_id)) {
            return null;
        }

        /** @var VendorOrder|null $order */
        $order = ResiMartConnection::runInTenantSchema(
            $partner->tenant_id,
            fn () => $this->orderRepository->findByIdForPartner($orderId),
        );

        if ($order === null) {
            return null;
        }

        $tenantName = $order->tenant_id !== null
            ? ($this->orgLookup->getTenantNames([$order->tenant_id])[$order->tenant_id] ?? null)
            : null;

        $projectName = $order->tenant_id !== null
            ? ($this->orgLookup->getProjectNamesForTenant($order->tenant_id, [(int) $order->project_id])[(int) $order->project_id] ?? null)
            : null;

        $commission = null;

        if ($order->completed_at !== null) {
            $override = $this->overrideRepository->findForOrder($partner->id, (int) $order->id);

            if ($override !== null) {
                $commission = $this->buildOverrideCommission($override, (float) $order->total);
            } else {
                $contract = $order->tenant_id !== null
                    ? $this->contractRepository->findActiveAt(
                        $partner->id,
                        $order->tenant_id,
                        (int) $order->project_id,
                        $order->completed_at,
                    )
                    : null;

                $commission = $contract !== null && $contract->commission_mode === CommissionMode::PerOrder
                    ? $this->buildContractCommission($contract, $order)
                    : $this->buildDefaultCommission($order);
            }
        }

        return [
            'order' => $order,
            'tenant' => [
                'id' => (string) $order->tenant_id,
                'name' => $tenantName,
            ],
            'project' => [
                'id' => (int) $order->project_id,
                'name' => $projectName ?? sprintf('Dự án #%d', $order->project_id),
            ],
            'commission' => $commission,
        ];
    }

    public function getSummaryPlatform(
        int $partnerId,
        ?CarbonInterface $from = null,
        ?CarbonInterface $to = null,
    ): array {
        $partner = $this->resolvePartnerPlatform($partnerId);
        [$from, $to] = $this->resolveRange($from, $to);

        $base = [
            'from' => $from->toDateString(),
            'to' => $to->toDateString(),
            'orders_count' => 0,
            'revenue_total' => 0.0,
            'commission_total' => 0.0,
            'commission_platform' => 0.0,
            'commission_operating_company' => 0.0,
            'average_commission_per_order' => 0.0,
            'currency' => 'VND',
            'warnings' => [
                'orphan_orders_count' => 0,
                'non_per_order_orders_count' => 0,
                'schema_missing' => false,
            ],
        ];

        if ($partner->tenant_id === null) {
            return $base;
        }

        if (! ResiMartConnection::schemaExists($partner->tenant_id)) {
            $base['warnings']['schema_missing'] = true;

            return $base;
        }

        $contracts = $this->contractRepository->getCandidateContractsForPartner($partner->id);

        $orders = ResiMartConnection::runInTenantSchema(
            $partner->tenant_id,
            fn () => $this->orderRepository->allForPartnerCommission($from, $to),
        );

        $orphan = 0;
        $nonPerOrder = 0;
        $revenueTotal = 0.0;
        $commissionTotal = 0.0;
        $commissionPlatform = 0.0;
        $commissionOperatingCompany = 0.0;
        $count = 0;

        foreach ($orders as $order) {
            $contract = $this->matchContractPlatform(
                $contracts,
                $order->tenant_id,
                (int) $order->project_id,
                $order->completed_at,
            );

            if ($contract !== null && $contract->commission_mode === CommissionMode::PerOrder) {
                $amount = (float) $this->calculator->compute($contract, (float) $order->total)['total'];

                if ($contract->revenue_recipient === RevenueRecipient::OperatingCompany) {
                    $commissionOperatingCompany += $amount;
                } else {
                    $commissionPlatform += $amount;
                }

                $commissionTotal += $amount;
            } elseif ($contract === null) {
                $orphan++;
            } else {
                $nonPerOrder++;
            }

            $count++;
            $revenueTotal += (float) $order->total;
        }

        return [
            'from' => $from->toDateString(),
            'to' => $to->toDateString(),
            'orders_count' => $count,
            'revenue_total' => round($revenueTotal, 2),
            'commission_total' => round($commissionTotal, 2),
            'commission_platform' => round($commissionPlatform, 2),
            'commission_operating_company' => round($commissionOperatingCompany, 2),
            'average_commission_per_order' => $count > 0 ? round($commissionTotal / $count, 2) : 0.0,
            'currency' => 'VND',
            'warnings' => [
                'orphan_orders_count' => $orphan,
                'non_per_order_orders_count' => $nonPerOrder,
                'schema_missing' => false,
            ],
        ];
    }

    /**
     * Platform scope — doanh thu / số đơn / hoa hồng theo tháng của vendor (mọi
     * tenant) trong `$months` tháng gần nhất. Doanh thu & số đơn tính trên mọi
     * đơn hoàn thành (gộp); hoa hồng chỉ tính đơn khớp hợp đồng per_order.
     *
     * @return array{
     *     months: list<array{month:string, revenue:float, order_count:int, commission:float}>,
     *     currency:string,
     *     warnings: array{schema_missing:bool}
     * }
     */
    public function getRevenueTrendPlatform(int $partnerId, int $months = 6): array
    {
        $months = max(1, min($months, 12));
        $partner = $this->resolvePartnerPlatform($partnerId);

        $from = Carbon::now()->startOfMonth()->subMonths($months - 1);
        $to = Carbon::now()->endOfMonth();

        $skeleton = $this->buildMonthSkeleton($from, $months);

        if ($partner->tenant_id === null) {
            return ['months' => array_values($skeleton), 'currency' => 'VND', 'warnings' => ['schema_missing' => false]];
        }

        if (! ResiMartConnection::schemaExists($partner->tenant_id)) {
            return ['months' => array_values($skeleton), 'currency' => 'VND', 'warnings' => ['schema_missing' => true]];
        }

        $contracts = $this->contractRepository->getCandidateContractsForPartner($partner->id);

        $orders = ResiMartConnection::runInTenantSchema(
            $partner->tenant_id,
            fn () => $this->orderRepository->allForPartnerCommission($from, $to),
        );

        foreach ($orders as $order) {
            if ($order->completed_at === null) {
                continue;
            }

            $key = $order->completed_at->format('Y-m');

            if (! isset($skeleton[$key])) {
                continue;
            }

            $skeleton[$key]['revenue'] += (float) $order->total;
            $skeleton[$key]['order_count']++;

            $contract = $this->matchContractPlatform(
                $contracts,
                $order->tenant_id,
                (int) $order->project_id,
                $order->completed_at,
            );

            if ($contract !== null && $contract->commission_mode === CommissionMode::PerOrder) {
                $skeleton[$key]['commission'] += (float) $this->calculator->compute($contract, (float) $order->total)['total'];
            }
        }

        $skeleton = array_map(function (array $row): array {
            $row['revenue'] = round($row['revenue'], 2);
            $row['commission'] = round($row['commission'], 2);

            return $row;
        }, $skeleton);

        return [
            'months' => array_values($skeleton),
            'currency' => 'VND',
            'warnings' => ['schema_missing' => false],
        ];
    }

    public function listAllOrdersPlatform(array $filters): array
    {
        $collected = $this->collectConsoleOrders($filters);

        $perPage = min((int) ($filters['per_page'] ?? 20), 50);
        $page = max((int) ($filters['page'] ?? 1), 1);

        $sorted = collect($collected['rows'])
            ->sortByDesc(fn (array $row) => optional($row['order']->created_at)->getTimestamp() ?? 0)
            ->values();

        $total = $sorted->count();
        $pageRows = $this->resolvePlatformNames($sorted->forPage($page, $perPage)->values()->all());

        $paginator = new LengthAwarePaginator(
            collect($pageRows),
            $total,
            $perPage,
            $page,
            ['path' => request()->url(), 'query' => request()->query()],
        );

        return [
            'data' => $paginator,
            'warnings' => $collected['warnings'],
            'decorated' => $pageRows,
        ];
    }

    public function getSummaryAllOrdersPlatform(array $filters): array
    {
        [$from, $to] = $this->resolveRange($filters['from'] ?? null, $filters['to'] ?? null);

        $collected = $this->collectConsoleOrders($filters);
        $summary = $this->assembler->summarize($collected['rows']);

        return [
            'from' => $from->toDateString(),
            'to' => $to->toDateString(),
            'orders_count' => $summary['orders_count'],
            'product_count' => $summary['product_count'],
            'service_count' => $summary['service_count'],
            'gmv' => $summary['gmv'],
            'commission_platform' => $summary['commission_platform'],
            'commission_operating_company' => $summary['commission_operating_company'],
            'commission_total' => $summary['commission_total'],
            'vendors_count' => $summary['vendors_count'],
            'currency' => 'VND',
            'warnings' => $collected['warnings'],
        ];
    }

    public function assignCommissionOverride(int $partnerId, int $orderId, array $data): array
    {
        $partner = $this->resolvePartnerPlatform($partnerId);

        if ($partner->tenant_id === null || ! ResiMartConnection::schemaExists($partner->tenant_id)) {
            throw new BusinessException(
                message: 'Không đọc được đơn hàng của vendor này.',
                errorCode: 'VENDOR_SCHEMA_MISSING',
                httpStatusCode: Response::HTTP_UNPROCESSABLE_ENTITY,
            );
        }

        /** @var VendorOrder|null $order */
        $order = ResiMartConnection::runInTenantSchema(
            $partner->tenant_id,
            fn () => $this->orderRepository->findByIdForPartner($orderId),
        );

        if ($order === null) {
            throw new BusinessException(
                message: 'Đơn hàng không tồn tại.',
                errorCode: 'VENDOR_ORDER_NOT_FOUND',
                httpStatusCode: Response::HTTP_NOT_FOUND,
            );
        }

        if ($order->status !== VendorOrderStatus::Completed) {
            throw new BusinessException(
                message: 'Chỉ gán hoa hồng cho đơn đã hoàn thành.',
                errorCode: 'ORDER_NOT_COMPLETED',
                httpStatusCode: Response::HTTP_UNPROCESSABLE_ENTITY,
            );
        }

        if ($order->tenant_id !== null && $order->completed_at !== null) {
            $existing = $this->contractRepository->findActiveAt(
                $partner->id,
                $order->tenant_id,
                (int) $order->project_id,
                $order->completed_at,
            );

            if ($existing !== null && $existing->commission_mode === CommissionMode::PerOrder) {
                throw new BusinessException(
                    message: 'Đơn đã có hoa hồng theo hợp đồng — không cần gán thủ công.',
                    errorCode: 'ORDER_HAS_CONTRACT_COMMISSION',
                    httpStatusCode: Response::HTTP_UNPROCESSABLE_ENTITY,
                );
            }
        }

        [$terms, $recipient, $sourceContractId] = $this->resolveOverrideTerms($partner->id, $data);

        $actorId = auth('requester')->id();

        $this->overrideRepository->upsertForOrder($partner->id, $orderId, [
            'tenant_id' => $order->tenant_id,
            'project_id' => $order->project_id !== null ? (int) $order->project_id : null,
            'revenue_recipient' => $recipient,
            'terms' => $terms,
            'source_contract_id' => $sourceContractId,
            'note' => $data['note'] ?? null,
            'created_by' => $actorId,
            'updated_by' => $actorId,
        ]);

        /** @var array<string, mixed> */
        return $this->getDetailPlatform($partnerId, $orderId);
    }

    public function removeCommissionOverride(int $partnerId, int $orderId): void
    {
        $this->resolvePartnerPlatform($partnerId);

        $removed = $this->overrideRepository->deleteForOrder($partnerId, $orderId);

        if (! $removed) {
            throw new BusinessException(
                message: 'Đơn chưa có hoa hồng gán thủ công.',
                errorCode: 'COMMISSION_OVERRIDE_NOT_FOUND',
                httpStatusCode: Response::HTTP_NOT_FOUND,
            );
        }
    }

    public function updateOrderStatusPlatform(int $partnerId, int $orderId, string $status, ?string $reason = null): array
    {
        $partner = $this->resolvePartnerPlatform($partnerId);

        if ($partner->tenant_id === null || ! ResiMartConnection::schemaExists($partner->tenant_id)) {
            throw new BusinessException(
                message: 'Không đọc được đơn hàng của vendor này.',
                errorCode: 'VENDOR_SCHEMA_MISSING',
                httpStatusCode: Response::HTTP_UNPROCESSABLE_ENTITY,
            );
        }

        /** @var VendorOrder|null $order */
        $order = ResiMartConnection::runInTenantSchema(
            $partner->tenant_id,
            fn () => $this->orderRepository->findByIdForPartner($orderId),
        );

        if ($order === null) {
            throw new BusinessException(
                message: 'Đơn hàng không tồn tại.',
                errorCode: 'VENDOR_ORDER_NOT_FOUND',
                httpStatusCode: Response::HTTP_NOT_FOUND,
            );
        }

        // Đơn đã chốt (hoàn thành/huỷ) là trạng thái cuối — platform không đổi nữa.
        if ($order->status->isTerminal()) {
            throw new BusinessException(
                message: sprintf("Đơn ở trạng thái '%s' — không thể đổi trạng thái.", $order->status->label()),
                errorCode: 'ORDER_STATUS_TERMINAL',
                httpStatusCode: Response::HTTP_UNPROCESSABLE_ENTITY,
            );
        }

        if ($order->status->value === $status) {
            throw new BusinessException(
                message: 'Đơn hàng đã ở trạng thái này.',
                errorCode: 'ORDER_STATUS_UNCHANGED',
                httpStatusCode: Response::HTTP_UNPROCESSABLE_ENTITY,
            );
        }

        try {
            $this->orderStatusClient->overrideStatus($partner->tenant_id, $orderId, $status, $reason);
        } catch (ResiMartProvisioningException $e) {
            throw new BusinessException(
                message: $e->getMessage(),
                errorCode: 'VENDOR_ORDER_STATUS_UPDATE_FAILED',
                httpStatusCode: Response::HTTP_UNPROCESSABLE_ENTITY,
                previous: $e,
            );
        }

        /** @var array<string, mixed> */
        return $this->getDetailPlatform($partnerId, $orderId);
    }

    /**
     * Suy ra điều khoản hoa hồng + người nhận từ payload assign:
     * - source = contract: copy terms + revenue_recipient từ 1 hợp đồng per_order của vendor.
     * - source = manual: nhập tay fixed/percent + revenue_recipient.
     *
     * @param  array<string, mixed>  $data
     * @return array{0: array<string, float>, 1: string, 2: int|null}
     */
    private function resolveOverrideTerms(int $partnerId, array $data): array
    {
        if (($data['source'] ?? null) === 'contract') {
            /** @var PartnerCommissionContract $contract */
            $contract = $this->contractRepository->findById((int) $data['contract_id']);

            if ($contract->partner_id !== $partnerId
                || $contract->commission_mode !== CommissionMode::PerOrder) {
                throw new BusinessException(
                    message: 'Hợp đồng không hợp lệ cho vendor này.',
                    errorCode: 'INVALID_SOURCE_CONTRACT',
                    httpStatusCode: Response::HTTP_UNPROCESSABLE_ENTITY,
                );
            }

            $terms = $contract->terms ?? [];

            return [
                ['fixed' => (float) ($terms['fixed'] ?? 0), 'percent' => (float) ($terms['percent'] ?? 0)],
                $contract->revenue_recipient->value,
                $contract->id,
            ];
        }

        return [
            ['fixed' => (float) ($data['fixed'] ?? 0), 'percent' => (float) ($data['percent'] ?? 0)],
            (string) $data['revenue_recipient'],
            null,
        ];
    }

    /**
     * Commission decorated từ hợp đồng (per_order).
     *
     * @return array{contract: PartnerCommissionContract, recipient: RevenueRecipient, formula: array<string, float|bool>, amount: float, applied_at: CarbonInterface, manual: bool, override_id: null, contract_code: string, source: string}
     */
    private function buildContractCommission(PartnerCommissionContract $contract, VendorOrder $order): array
    {
        $formula = $this->calculator->compute($contract, (float) $order->total);

        return [
            'contract' => $contract,
            'recipient' => $contract->revenue_recipient,
            'formula' => $formula,
            'amount' => (float) $formula['total'],
            'applied_at' => $order->completed_at ?? Carbon::now(),
            'manual' => false,
            'override_id' => null,
            'contract_code' => $contract->contract_code,
            'source' => 'contract',
        ];
    }

    /**
     * Commission decorated từ override gán thủ công.
     *
     * @return array{contract: null, recipient: RevenueRecipient, formula: array<string, float|bool>, amount: float, applied_at: null, manual: bool, override_id: int, contract_code: null, source: string}
     */
    private function buildOverrideCommission(VendorOrderCommissionOverride $override, float $orderTotal): array
    {
        $formula = $this->calculator->computeFromTerms($override->terms, $orderTotal);

        return [
            'contract' => null,
            'recipient' => $override->revenue_recipient,
            'formula' => $formula,
            'amount' => (float) $formula['total'],
            'applied_at' => null,
            'manual' => true,
            'override_id' => $override->id,
            'contract_code' => null,
            'source' => 'manual',
        ];
    }

    /**
     * Hoa hồng MẶC ĐỊNH 0đ — fallback ngầm cho đơn completed chưa khớp override
     * hay hợp đồng per_order. KHÔNG sinh bản ghi hợp đồng; mặc định Platform giữ.
     * Đảm bảo MỌI đơn completed luôn có một dòng hoa hồng (tối thiểu 0đ).
     *
     * @return array{contract: null, recipient: RevenueRecipient, formula: array<string, float|bool>, amount: float, applied_at: CarbonInterface, manual: bool, override_id: null, contract_code: null, source: string}
     */
    private function buildDefaultCommission(VendorOrder $order): array
    {
        $formula = $this->calculator->computeFromTerms([], (float) $order->total);

        return [
            'contract' => null,
            'recipient' => RevenueRecipient::Platform,
            'formula' => $formula,
            'amount' => 0.0,
            'applied_at' => $order->completed_at ?? Carbon::now(),
            'manual' => false,
            'override_id' => null,
            'contract_code' => null,
            'source' => 'default',
        ];
    }

    /**
     * Loop cross-vendor + cross-tenant: mỗi vendor đã provision → switch schema
     * resi_mart → đọc MỌI đơn (mọi trạng thái) trong cửa sổ `created_at` → suy ra
     * loại đơn, match hợp đồng per_order (chỉ đơn completed) để gán hoa hồng,
     * đếm cảnh báo orphan / non_per_order. Filter `type` (suy ra) áp in-memory.
     *
     * @param  array<string, mixed>  $filters
     * @return array{
     *     rows: list<array{order: object, vendor: array{id:int,name:string,slug:string}, tenant_id: string|null, project_name: string, type: string, commission: array|null}>,
     *     warnings: array{orphan_orders_count:int, non_per_order_orders_count:int, schema_missing:bool}
     * }
     */
    private function collectConsoleOrders(array $filters): array
    {
        [$from, $to] = $this->resolveRange($filters['from'] ?? null, $filters['to'] ?? null);
        $filters['from'] = $from;
        $filters['to'] = $to;

        $typeFilter = isset($filters['type']) && $filters['type'] !== '' ? (string) $filters['type'] : null;

        $partners = $this->resolveConsolePartners($filters['partner_id'] ?? null);

        $orphan = 0;
        $nonPerOrder = 0;
        $schemaMissing = false;
        $rows = [];

        foreach ($partners as $partner) {
            if ($partner->tenant_id === null) {
                continue;
            }

            if (! ResiMartConnection::schemaExists($partner->tenant_id)) {
                $schemaMissing = true;

                continue;
            }

            $contracts = $this->contractRepository->getCandidateContractsForPartner($partner->id);
            $overrides = $this->overrideRepository->mapByPartner($partner->id);

            $orders = ResiMartConnection::runInTenantSchema(
                $partner->tenant_id,
                fn () => $this->orderRepository->listAllForConsole($filters),
            );

            foreach ($orders as $order) {
                $type = VendorOrderType::deriveFromItems($order->items)->value;

                if ($typeFilter !== null && $type !== $typeFilter) {
                    continue;
                }

                $commission = null;

                if ($order->status === VendorOrderStatus::Completed) {
                    /** @var VendorOrderCommissionOverride|null $override */
                    $override = $overrides->get((int) $order->id);

                    if ($override !== null) {
                        $commission = $this->buildOverrideCommission($override, (float) $order->total);
                    } else {
                        $contract = $this->matchContractPlatform(
                            $contracts,
                            $order->tenant_id,
                            (int) $order->project_id,
                            $order->completed_at,
                        );

                        if ($contract !== null && $contract->commission_mode === CommissionMode::PerOrder) {
                            $commission = $this->buildContractCommission($contract, $order);
                        } else {
                            if ($contract === null) {
                                $orphan++;
                            } else {
                                $nonPerOrder++;
                            }

                            $commission = $this->buildDefaultCommission($order);
                        }
                    }
                }

                $rows[] = [
                    'order' => $order,
                    'vendor' => [
                        'id' => $partner->id,
                        'name' => $partner->name,
                        'slug' => $partner->slug,
                    ],
                    'tenant_id' => $order->tenant_id,
                    'project_name' => '',
                    'type' => $type,
                    'commission' => $commission,
                ];
            }
        }

        return [
            'rows' => $rows,
            'warnings' => [
                'orphan_orders_count' => $orphan,
                'non_per_order_orders_count' => $nonPerOrder,
                'schema_missing' => $schemaMissing,
            ],
        ];
    }

    /**
     * Mọi vendor đã provision (platform-wide). Nếu có `partner_id` → chỉ giữ
     * vendor đó (nếu thuộc tập), ngược lại trả rỗng.
     *
     * @return Collection<int, \App\Modules\Marketplace\Partner\Models\Partner>
     */
    private function resolveConsolePartners(mixed $partnerId): Collection
    {
        $partners = $this->partnerRepository->allPlatformPartners();

        if ($partnerId !== null && $partnerId !== '') {
            return $partners->where('id', (int) $partnerId)->values();
        }

        return $partners;
    }

    /**
     * Build a zero-filled `Y-m` => row map for the trend window.
     *
     * @return array<string, array{month:string, revenue:float, order_count:int, commission:float}>
     */
    private function buildMonthSkeleton(Carbon $from, int $months): array
    {
        $skeleton = [];
        $cursor = $from->copy();

        for ($i = 0; $i < $months; $i++) {
            $key = $cursor->format('Y-m');
            $skeleton[$key] = ['month' => $key, 'revenue' => 0.0, 'order_count' => 0, 'commission' => 0.0];
            $cursor->addMonth();
        }

        return $skeleton;
    }

    /**
     * Resolve tên tenant + tên project (cross-tenant) cho các decorated row của
     * platform list, gom theo tenant để giảm số lần switch DB.
     *
     * @param  array<int, array<string, mixed>>  $decorated
     * @return array<int, array<string, mixed>>
     */
    private function resolvePlatformNames(array $decorated): array
    {
        if ($decorated === []) {
            return [];
        }

        $tenantIds = collect($decorated)
            ->pluck('tenant_id')
            ->filter(fn ($v) => $v !== null && $v !== '')
            ->unique()
            ->values()
            ->all();

        $tenantNames = $this->orgLookup->getTenantNames($tenantIds);

        $projectNames = [];

        foreach (collect($decorated)->groupBy('tenant_id') as $tenantId => $group) {
            if ($tenantId === null || $tenantId === '') {
                continue;
            }

            $projectIds = $group
                ->map(fn (array $row) => (int) $row['order']->project_id)
                ->unique()
                ->values()
                ->all();

            $projectNames[$tenantId] = $this->orgLookup->getProjectNamesForTenant((string) $tenantId, $projectIds);
        }

        return collect($decorated)->map(function (array $row) use ($tenantNames, $projectNames): array {
            $tenantId = $row['tenant_id'];
            $projectId = (int) $row['order']->project_id;

            $row['tenant'] = [
                'id' => (string) $tenantId,
                'name' => $tenantNames[$tenantId] ?? null,
            ];
            $row['project_name'] = $projectNames[$tenantId][$projectId]
                ?? sprintf('Dự án #%d', $projectId);

            return $row;
        })->all();
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return array{data: LengthAwarePaginator, warnings: array, decorated: array}
     */
    private function emptyPlatformListResult(array $filters, bool $schemaMissing = false): array
    {
        $perPage = min((int) ($filters['per_page'] ?? 20), 50);

        return [
            'data' => new LengthAwarePaginator([], 0, $perPage, (int) ($filters['page'] ?? 1)),
            'warnings' => [
                'orphan_orders_count' => 0,
                'non_per_order_orders_count' => 0,
                'schema_missing' => $schemaMissing,
            ],
            'decorated' => [],
        ];
    }

    /**
     * Match contract platform — như {@see matchContract} nhưng thêm ràng buộc
     * tenant_id (vì candidate contracts gom across mọi tenant).
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
            ->filter(function (PartnerCommissionContract $c) use ($at) {
                if ($c->activated_at === null || $c->activated_at->gt($at)) {
                    return false;
                }

                return $c->replaced_at === null || $c->replaced_at->gt($at);
            })
            ->sortByDesc(fn (PartnerCommissionContract $c) => $c->activated_at)
            ->first();
    }

    /**
     * Platform scope — partner tồn tại là đủ (không ràng buộc tenant). 404 nếu không.
     */
    private function resolvePartnerPlatform(int $partnerId): \App\Modules\Marketplace\Partner\Models\Partner
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
     * Verify partner thuộc current tenant — 404 nếu không.
     */
    private function resolvePartner(int $partnerId, string $scopeTenantId): \App\Modules\Marketplace\Partner\Models\Partner
    {
        try {
            /** @var \App\Modules\Marketplace\Partner\Models\Partner $partner */
            $partner = $this->partnerRepository->findById($partnerId);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            throw new BusinessException(
                message: 'Vendor không tồn tại.',
                errorCode: 'VENDOR_NOT_FOUND',
                httpStatusCode: Response::HTTP_NOT_FOUND,
            );
        }

        // Allow platform-owned (owner_tenant_id = null) hoặc owned by current tenant
        if ($partner->owner_tenant_id !== null && $partner->owner_tenant_id !== $scopeTenantId) {
            throw new BusinessException(
                message: 'Vendor không tồn tại.',
                errorCode: 'VENDOR_NOT_FOUND',
                httpStatusCode: Response::HTTP_NOT_FOUND,
            );
        }

        return $partner;
    }

    /**
     * Partners provision đã visible cho tenant. Nếu có partner_id filter → chỉ
     * giữ partner đó (nếu thuộc tập visible), ngược lại trả rỗng.
     *
     * @return Collection<int, \App\Modules\Marketplace\Partner\Models\Partner>
     */
    private function resolveVisiblePartners(string $scopeTenantId, mixed $partnerId): Collection
    {
        $partners = $this->partnerRepository->allProvisionedVisibleTo($scopeTenantId);

        if ($partnerId !== null && $partnerId !== '') {
            return $partners->where('id', (int) $partnerId)->values();
        }

        return $partners;
    }

    /**
     * @return array{0: Carbon, 1: Carbon}
     */
    private function resolveRange(mixed $from, mixed $to): array
    {
        $toDate = $to ? Carbon::parse($to)->endOfDay() : Carbon::now()->endOfDay();
        $fromDate = $from
            ? Carbon::parse($from)->startOfDay()
            : (clone $toDate)->subDays(self::DATE_RANGE_DEFAULT_DAYS)->startOfDay();

        // Clamp max range
        if ($fromDate->diffInDays($toDate) > self::DATE_RANGE_MAX_DAYS) {
            $fromDate = (clone $toDate)->subDays(self::DATE_RANGE_MAX_DAYS)->startOfDay();
        }

        return [$fromDate, $toDate];
    }

    /**
     * Match contract trong list candidates dựa trên (project_id, completed_at).
     *
     * @param  Collection<int, PartnerCommissionContract>  $contracts
     */
    private function matchContract(
        Collection $contracts,
        int $projectId,
        ?CarbonInterface $at,
    ): ?PartnerCommissionContract {
        if ($at === null) {
            return null;
        }

        return $contracts
            ->where('project_id', $projectId)
            ->filter(function (PartnerCommissionContract $c) use ($at) {
                if ($c->activated_at === null || $c->activated_at->gt($at)) {
                    return false;
                }

                return $c->replaced_at === null || $c->replaced_at->gt($at);
            })
            ->sortByDesc(fn (PartnerCommissionContract $c) => $c->activated_at)
            ->first();
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return array{data: LengthAwarePaginator, warnings: array, project_id_map: array, decorated: array}
     */
    private function emptyListResult(array $filters, bool $schemaMissing = false): array
    {
        $perPage = min((int) ($filters['per_page'] ?? 20), 50);

        return [
            'data' => new LengthAwarePaginator([], 0, $perPage, (int) ($filters['page'] ?? 1)),
            'warnings' => [
                'orphan_orders_count' => 0,
                'non_per_order_orders_count' => 0,
                'schema_missing' => $schemaMissing,
            ],
            'project_id_map' => [],
            'decorated' => [],
        ];
    }
}
