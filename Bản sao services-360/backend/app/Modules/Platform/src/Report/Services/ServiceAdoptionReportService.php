<?php

namespace App\Modules\Platform\Report\Services;

use App\Modules\Platform\Report\Contracts\ReportAggregationServiceInterface;
use App\Modules\Platform\Report\Contracts\ServiceAdoptionReportServiceInterface;
use App\Modules\Platform\Report\Support\PlatformVendorOrderRow;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;

class ServiceAdoptionReportService implements ServiceAdoptionReportServiceInterface
{
    public const DEFAULT_MONTHS = 6;

    public const MAX_OFFERS = 15;

    public function __construct(
        protected ReportAggregationServiceInterface $aggregation,
    ) {}

    /**
     * @param  array<string, mixed>  $filters
     * @return array{
     *     kpis: array{total_offers: int, top_offer: array{title: string, order_count: int}|null, product_share: int, service_share: int},
     *     by_type: list<array{type: array{value: string, label: string}, order_count: int, gmv: int}>,
     *     offers: list<array{title: string, type: array{value: string, label: string}, partner_name: string, order_count: int, gmv: int}>,
     *     monthly: list<array{month: string, month_label: string, order_count: int, product_count: int, service_count: int, gmv: int}>,
     * }
     */
    public function build(array $filters): array
    {
        $months = (int) ($filters['months'] ?? self::DEFAULT_MONTHS);
        $from = CarbonImmutable::now()->startOfMonth()->subMonthsNoOverflow($months - 1);
        $to = CarbonImmutable::now()->endOfMonth();

        $factset = $this->aggregation->collectPlatformVendorOrders($from, $to);

        /** @var list<PlatformVendorOrderRow> $activeRows */
        $activeRows = array_values(array_filter(
            $factset['rows'],
            static fn (PlatformVendorOrderRow $row): bool => $row->isActive(),
        ));

        $totalActive = count($activeRows);
        $productCount = count(array_filter($activeRows, static fn (PlatformVendorOrderRow $row): bool => $row->type === 'product'));
        $serviceCount = count(array_filter($activeRows, static fn (PlatformVendorOrderRow $row): bool => $row->type === 'service'));

        $offers = $this->buildOffers($activeRows);

        return [
            'kpis' => [
                'total_offers' => count($offers['all']),
                'top_offer' => $offers['all'] === []
                    ? null
                    : [
                        'title' => $offers['all'][0]['title'],
                        'order_count' => $offers['all'][0]['order_count'],
                    ],
                'product_share' => $totalActive === 0 ? 0 : (int) round($productCount / $totalActive * 100),
                'service_share' => $totalActive === 0 ? 0 : (int) round($serviceCount / $totalActive * 100),
            ],
            'by_type' => $this->buildByType($activeRows),
            'offers' => $offers['top'],
            'monthly' => $this->buildMonthly($activeRows, $from, $months),
        ];
    }

    /**
     * Group active rows by `partnerId:type:title`, sorted desc by order_count
     * (tie-break: gmv desc, then title asc). Returns all groups + the top-15 cut.
     *
     * @param  list<PlatformVendorOrderRow>  $rows
     * @return array{
     *     all: list<array{title: string, type: array{value: string, label: string}, partner_name: string, order_count: int, gmv: int}>,
     *     top: list<array{title: string, type: array{value: string, label: string}, partner_name: string, order_count: int, gmv: int}>,
     * }
     */
    private function buildOffers(array $rows): array
    {
        $groups = [];

        foreach ($rows as $row) {
            $title = $row->offerTitle ?? '';
            $key = $row->partnerId.':'.$row->type.':'.$title;

            if (! isset($groups[$key])) {
                $groups[$key] = [
                    'title' => $title,
                    'type' => [
                        'value' => $row->type,
                        'label' => $this->typeLabel($row->type),
                    ],
                    'partner_name' => $row->partnerName,
                    'order_count' => 0,
                    'gmv' => 0,
                ];
            }

            $groups[$key]['order_count']++;
            $groups[$key]['gmv'] += $row->amount;
        }

        $all = array_values($groups);

        usort($all, static function (array $a, array $b): int {
            return $b['order_count'] <=> $a['order_count']
                ?: $b['gmv'] <=> $a['gmv']
                ?: $a['title'] <=> $b['title'];
        });

        return [
            'all' => $all,
            'top' => array_slice($all, 0, self::MAX_OFFERS),
        ];
    }

    /**
     * One row per type present, ordered product first then service.
     *
     * @param  list<PlatformVendorOrderRow>  $rows
     * @return list<array{type: array{value: string, label: string}, order_count: int, gmv: int}>
     */
    private function buildByType(array $rows): array
    {
        $buckets = [];

        foreach ($rows as $row) {
            if (! isset($buckets[$row->type])) {
                $buckets[$row->type] = ['order_count' => 0, 'gmv' => 0];
            }

            $buckets[$row->type]['order_count']++;
            $buckets[$row->type]['gmv'] += $row->amount;
        }

        $byType = [];

        foreach (['product', 'service'] as $type) {
            if (! isset($buckets[$type])) {
                continue;
            }

            $byType[] = [
                'type' => [
                    'value' => $type,
                    'label' => $this->typeLabel($type),
                ],
                'order_count' => $buckets[$type]['order_count'],
                'gmv' => $buckets[$type]['gmv'],
            ];
        }

        return $byType;
    }

    /**
     * N-month skeleton filled with order/product/service counts and gmv.
     *
     * @param  list<PlatformVendorOrderRow>  $rows
     * @return list<array{month: string, month_label: string, order_count: int, product_count: int, service_count: int, gmv: int}>
     */
    private function buildMonthly(array $rows, CarbonInterface $from, int $months): array
    {
        $skeleton = $this->buildMonthSkeleton($from, $months, [
            'order_count' => 0,
            'product_count' => 0,
            'service_count' => 0,
            'gmv' => 0,
        ]);

        foreach ($rows as $row) {
            $monthKey = substr($row->createdAt, 0, 7);

            if (! isset($skeleton[$monthKey])) {
                continue;
            }

            $skeleton[$monthKey]['order_count']++;
            $skeleton[$monthKey]['gmv'] += $row->amount;

            if ($row->type === 'product') {
                $skeleton[$monthKey]['product_count']++;
            } elseif ($row->type === 'service') {
                $skeleton[$monthKey]['service_count']++;
            }
        }

        return array_values($skeleton);
    }

    private function typeLabel(string $type): string
    {
        return match ($type) {
            'product' => 'Sản phẩm',
            'service' => 'Dịch vụ',
            default => $type,
        };
    }

    /**
     * Ordered N-month skeleton keyed by Y-m, each pre-filled with the given zero fields.
     *
     * @param  array<string, int>  $zeroFields
     * @return array<string, array<string, mixed>>
     */
    private function buildMonthSkeleton(CarbonInterface $from, int $months, array $zeroFields): array
    {
        $skeleton = [];
        $cursor = $from->copy();

        for ($i = 0; $i < $months; $i++) {
            $key = $cursor->format('Y-m');
            $skeleton[$key] = array_merge([
                'month' => $key,
                'month_label' => 'T'.$cursor->month.'/'.$cursor->year,
            ], $zeroFields);
            $cursor = $cursor->addMonthNoOverflow();
        }

        return $skeleton;
    }
}
