<?php

declare(strict_types=1);

namespace App\Modules\PMC\Order\ExternalServices\Platform;

use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\PMC\Order\Enums\OrderStatus;
use App\Modules\PMC\Order\Models\Order;
use App\Modules\PMC\Order\Repositories\OrderRepository;
use Illuminate\Database\Eloquent\Builder;

class TenantBusinessSummaryExternalService implements TenantBusinessSummaryExternalServiceInterface
{
    /**
     * @return array{
     *     summary: array{tenant_revenue: float, order_count: int, platform_revenue: float},
     *     months: list<array{month: string, label: string, order_count: int, tenant_revenue: float, platform_fee: float}>
     * }
     */
    public function getMonthlyBusinessSummary(Organization $tenant, int $months, ?int $projectId = null): array
    {
        return $tenant->run(function () use ($months, $projectId): array {
            $from = now()->startOfMonth()->subMonthsNoOverflow($months - 1);
            $to = now()->endOfMonth();

            $orders = Order::query()
                ->where('status', OrderStatus::Completed->value)
                ->whereBetween('completed_at', [$from, $to])
                ->when(
                    $projectId !== null,
                    fn (Builder $q) => $q->whereHas('quote.ogTicket', fn (Builder $sub) => $sub->where('project_id', $projectId)),
                )
                ->with('closingPeriodOrder:id,order_id,frozen_platform_fee')
                ->get(['id', 'total_amount', 'completed_at']);

            $buckets = $this->buildMonthSkeleton($from, $months);

            foreach ($orders as $order) {
                $key = $order->completed_at?->format('Y-m');

                if ($key === null || ! isset($buckets[$key])) {
                    continue;
                }

                $buckets[$key]['order_count']++;
                $buckets[$key]['tenant_revenue'] += (float) $order->total_amount;
                $buckets[$key]['platform_fee'] += (float) ($order->closingPeriodOrder?->frozen_platform_fee ?? 0);
            }

            $monthsOut = array_values($buckets);

            return [
                'summary' => [
                    'tenant_revenue' => array_sum(array_column($monthsOut, 'tenant_revenue')),
                    'order_count' => (int) array_sum(array_column($monthsOut, 'order_count')),
                    'platform_revenue' => array_sum(array_column($monthsOut, 'platform_fee')),
                ],
                'months' => $monthsOut,
            ];
        });
    }

    public function getProjectBusinessBreakdown(Organization $tenant, int $months): array
    {
        return $tenant->run(function () use ($months): array {
            $from = now()->startOfMonth()->subMonthsNoOverflow($months - 1);
            $to = now()->endOfMonth();

            $orders = app(OrderRepository::class)->completedInRangeWithProject($from, $to);

            $groups = [];

            foreach ($orders as $order) {
                $ticket = $order->quote?->ogTicket;
                $projectId = $ticket?->project_id;

                if ($projectId === null) {
                    continue;
                }

                if (! isset($groups[$projectId])) {
                    $groups[$projectId] = [
                        'project_id' => (int) $projectId,
                        'project_name' => (string) ($ticket->project?->name ?? ('Dự án #'.$projectId)),
                        'order_count' => 0,
                        'revenue' => 0,
                        'platform_fee' => 0,
                        'rating_sum' => 0,
                        'rated_count' => 0,
                    ];
                }

                $groups[$projectId]['order_count']++;
                $groups[$projectId]['revenue'] += (int) round((float) $order->total_amount);
                $groups[$projectId]['platform_fee'] += (int) round((float) ($order->closingPeriodOrder?->frozen_platform_fee ?? 0));

                $rating = $ticket->resident_rating;

                if ($rating !== null) {
                    $groups[$projectId]['rating_sum'] += (int) $rating;
                    $groups[$projectId]['rated_count']++;
                }
            }

            return array_values($groups);
        });
    }

    /**
     * Khung N tháng tăng dần từ `$from`, mỗi tháng khởi tạo giá trị 0.
     *
     * @return array<string, array{month: string, label: string, order_count: int, tenant_revenue: float, platform_fee: float}>
     */
    private function buildMonthSkeleton(\Carbon\CarbonInterface $from, int $months): array
    {
        $buckets = [];
        $cursor = $from->copy();

        for ($i = 0; $i < $months; $i++) {
            $key = $cursor->format('Y-m');
            $buckets[$key] = [
                'month' => $key,
                'label' => 'T'.$cursor->format('n/Y'),
                'order_count' => 0,
                'tenant_revenue' => 0.0,
                'platform_fee' => 0.0,
            ];
            $cursor = $cursor->addMonthNoOverflow();
        }

        return $buckets;
    }
}
