<?php

declare(strict_types=1);

namespace App\Modules\PMC\Order\ExternalServices\Platform;

use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\PMC\Order\Enums\OrderStatus;
use App\Modules\PMC\Order\Models\Order;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class TenantProjectOrderExternalService implements TenantProjectOrderExternalServiceInterface
{
    public function listTenantOrders(Organization $tenant, array $filters): Collection
    {
        return $tenant->run(function () use ($filters): Collection {
            $query = Order::query()
                ->with([
                    'quote:id,code,og_ticket_id',
                    'quote.ogTicket:id,subject,project_id,customer_id',
                    'quote.ogTicket.project:id,name',
                    'quote.ogTicket.customer:id,full_name,phone',
                    'closingPeriodOrder:id,order_id,frozen_platform_fee',
                ]);

            if (! empty($filters['search'])) {
                $query->search((string) $filters['search']);
            }

            if (! empty($filters['status'])) {
                $query->byStatus(OrderStatus::from((string) $filters['status']));
            }

            if (! empty($filters['from'])) {
                $query->whereDate('created_at', '>=', (string) $filters['from']);
            }

            if (! empty($filters['to'])) {
                $query->whereDate('created_at', '<=', (string) $filters['to']);
            }

            return $query
                ->orderByDesc('created_at')
                ->orderByDesc('id')
                ->get()
                ->map(function (Order $order): array {
                    $ticket = $order->quote?->ogTicket;

                    return [
                        'id' => (int) $order->id,
                        'code' => (string) $order->code,
                        'subject' => $ticket?->subject,
                        'project_id' => $ticket?->project_id !== null ? (int) $ticket->project_id : null,
                        'project_name' => $ticket?->project?->name,
                        'customer_name' => $ticket?->customer?->full_name,
                        'customer_phone' => $ticket?->customer?->phone,
                        'total_amount' => (string) $order->total_amount,
                        'platform_fee' => number_format(
                            (float) ($order->closingPeriodOrder?->frozen_platform_fee ?? 0),
                            2,
                            '.',
                            '',
                        ),
                        'status' => [
                            'value' => $order->status->value,
                            'label' => $order->status->label(),
                        ],
                        'created_at' => $order->created_at?->toIso8601String(),
                        'completed_at' => $order->completed_at?->toIso8601String(),
                    ];
                })
                ->values();
        });
    }

    public function listProjectOrders(Organization $tenant, int $projectId, array $filters): LengthAwarePaginator
    {
        return $tenant->run(function () use ($projectId, $filters): LengthAwarePaginator {
            $query = Order::query()
                ->whereHas('quote.ogTicket', fn (Builder $q) => $q->where('project_id', $projectId))
                ->with('closingPeriodOrder:id,order_id,frozen_platform_fee');

            if (! empty($filters['search'])) {
                $query->search((string) $filters['search']);
            }

            if (! empty($filters['status'])) {
                $query->byStatus(OrderStatus::from((string) $filters['status']));
            }

            $paginator = $query
                ->orderByDesc('completed_at')
                ->orderByDesc('id')
                ->paginate((int) ($filters['per_page'] ?? 10));

            $paginator->through(fn (Order $order): array => [
                'id' => (int) $order->id,
                'code' => (string) $order->code,
                'total_amount' => (string) $order->total_amount,
                'status' => [
                    'value' => $order->status->value,
                    'label' => $order->status->label(),
                ],
                'platform_fee' => number_format(
                    (float) ($order->closingPeriodOrder?->frozen_platform_fee ?? 0),
                    2,
                    '.',
                    '',
                ),
                'completed_at' => $order->completed_at?->toIso8601String(),
            ]);

            return $paginator;
        });
    }
}
