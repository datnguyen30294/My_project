# Tenant Revenue Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** On the platform tenant (CTVH) detail page `/platform/tenants/{id}`, show the TOTAL money the platform earns from that operating company, split into 3 sources (OG ticket fee, Vendor commission, Tenant service orders), with full per-source order lists and a 3-source monthly stacked trend — while keeping existing info/config.

**Architecture:** Reuse the existing cross-vendor aggregation (`VendorOrderService::listAllForTenant/getSummaryAllForTenant`) and the monthly-bucketing pattern (`TenantBusinessSummaryExternalService::buildMonthSkeleton`). Add backend endpoints for the three gaps: (1) all-vendors-in-a-tenant orders/summary/trend, (2) tenant-wide OG order list, (3) TSO monthly trend. All tenant-scoped data is reached from the platform context via `$tenant->run()`. Frontend adds a "Doanh thu & Đơn hàng" tab (3 sub-tabs), a stacked monthly chart, and upgrades the summary card to combine all 3 sources.

**Tech Stack:** Laravel 12 modular monolith (PHP 8.4, PHPUnit), Nuxt 4 + Vue 3 + TS, Nuxt UI v4, Tailwind v4.

**Spec:** `docs/superpowers/specs/2026-06-17-tenant-revenue-dashboard-design.md` (Phương án A; full scope — no deferrals).

---

## File Structure

**Backend — new:**
- `Marketplace/src/VendorOrder/ExternalServices/Platform/TenantVendorOrderExternalServiceInterface.php` + `TenantVendorOrderExternalService.php` — platform-facing per-tenant vendor list/summary/trend.
- `Platform/src/Tenant/Requests/ListTenantVendorOrderRequest.php` — vendor filters (+ months for trend).
- `Platform/src/Tenant/Controllers/PlatformTenantVendorOrderController.php` — index/summary/trend.
- `Platform/src/Tenant/Requests/ListTenantOrderRequest.php` — OG order-list filters.
- `Platform/src/Tenant/Controllers/PlatformTenantOrderController.php` — tenant-wide OG order list.
- `Platform/src/TenantServiceOrder/Requests/TenantServiceOrderTrendRequest.php` — TSO trend filters.
- `backend/tests/Feature/Platform/PlatformTenantVendorOrderControllerTest.php`
- `backend/tests/Feature/Platform/PlatformTenantOrderControllerTest.php`
- `backend/tests/Feature/Platform/TenantServiceOrderTrendTest.php`

**Backend — modified:**
- `Marketplace/src/VendorOrder/Services/VendorOrderService.php` + `Contracts/VendorOrderServiceInterface.php` — add `getMonthlyTrendForTenant`.
- `Marketplace/Providers/MarketplaceServiceProvider.php` — bind new interface.
- `PMC/src/Order/ExternalServices/Platform/TenantProjectOrderExternalService.php` + its interface — add `listTenantOrders`.
- `Platform/src/TenantServiceOrder/Repositories/TenantServiceOrderRepository.php`, `Services/TenantServiceOrderService.php`, `Contracts/TenantServiceOrderServiceInterface.php`, `Controllers/TenantServiceOrderController.php` — add `monthlyTrend`/`trend`.
- `Platform/routes/external-api.php` — new routes + imports.

**Frontend — new:**
- `components/shared/StackedBarChart.vue` — 3-series monthly stacked bars.
- `components/tenant/TenantRevenueTab.vue`, `TenantRevenueOgPanel.vue`, `TenantRevenueVendorPanel.vue`, `TenantRevenueServiceOrderPanel.vue`.

**Frontend — modified:**
- `composables/api/useTenants.ts` — vendor list/summary/trend + OG order list.
- `composables/api/useTenantServiceOrders.ts` — TSO trend.
- `components/tenant/TenantBusinessSummaryCard.vue` — combine 3 sources + stacked chart.
- `pages/platform/tenants/[id]/index.vue` — register the tab.

---

## Task 1: Vendor monthly commission trend (service layer)

**Files:**
- Modify: `backend/app/Modules/Marketplace/src/VendorOrder/Services/VendorOrderService.php`
- Modify: `backend/app/Modules/Marketplace/src/VendorOrder/Contracts/VendorOrderServiceInterface.php`

- [ ] **Step 1: Add the interface method**

In `VendorOrderServiceInterface.php`, add (near `getSummaryAllForTenant`):

```php
    /**
     * Monthly platform commission totals across all vendors in a tenant.
     *
     * @return list<array{month: string, label: string, commission_total: float}>
     */
    public function getMonthlyTrendForTenant(string $scopeTenantId, int $months): array;
```

- [ ] **Step 2: Implement in VendorOrderService**

Add these two methods (the trend reuses the exact fan-out shape of `getSummaryAllForTenant`, bucketed by `completed_at` month; the skeleton mirrors `TenantBusinessSummaryExternalService::buildMonthSkeleton`):

```php
    public function getMonthlyTrendForTenant(string $scopeTenantId, int $months): array
    {
        $from = now()->startOfMonth()->subMonthsNoOverflow($months - 1);
        $to = now()->endOfMonth();

        $buckets = $this->buildMonthlyCommissionSkeleton($from, $months);

        $projectIds = $this->projectService->getCurrentTenantProjectIds();

        if ($projectIds === []) {
            return array_values($buckets);
        }

        $partners = $this->resolveVisiblePartners($scopeTenantId, null);

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
                $key = $order->completed_at?->format('Y-m');

                if ($key === null || ! isset($buckets[$key])) {
                    continue;
                }

                $contract = $this->matchContract($contracts, (int) $order->project_id, $order->completed_at);

                if ($contract === null || $contract->commission_mode !== CommissionMode::PerOrder) {
                    continue;
                }

                $formula = $this->calculator->compute($contract, (float) $order->total);
                $buckets[$key]['commission_total'] += (float) $formula['total'];
            }
        }

        foreach ($buckets as &$bucket) {
            $bucket['commission_total'] = round($bucket['commission_total'], 2);
        }

        return array_values($buckets);
    }

    /**
     * @return array<string, array{month: string, label: string, commission_total: float}>
     */
    private function buildMonthlyCommissionSkeleton(\Carbon\CarbonInterface $from, int $months): array
    {
        $buckets = [];
        $cursor = $from->copy();

        for ($i = 0; $i < $months; $i++) {
            $key = $cursor->format('Y-m');
            $buckets[$key] = [
                'month' => $key,
                'label' => 'T'.$cursor->format('n/Y'),
                'commission_total' => 0.0,
            ];
            $cursor = $cursor->addMonthNoOverflow();
        }

        return $buckets;
    }
```

- [ ] **Step 3: Format + lint**

Run: `docker exec residential_app make format && docker exec residential_app make lint`
Expected: passes.

- [ ] **Step 4: Commit**

```bash
git add backend/app/Modules/Marketplace/src/VendorOrder
git commit -m "feat(marketplace): add monthly vendor commission trend per tenant"
```

---

## Task 2: Marketplace platform-facing ExternalService (list + summary + trend)

**Files:**
- Create: `backend/app/Modules/Marketplace/src/VendorOrder/ExternalServices/Platform/TenantVendorOrderExternalServiceInterface.php`
- Create: `backend/app/Modules/Marketplace/src/VendorOrder/ExternalServices/Platform/TenantVendorOrderExternalService.php`
- Modify: `backend/app/Modules/Marketplace/Providers/MarketplaceServiceProvider.php`

- [ ] **Step 1: Create the interface**

```php
<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOrder\ExternalServices\Platform;

use App\Modules\Platform\Tenant\Models\Organization;

interface TenantVendorOrderExternalServiceInterface
{
    /**
     * @param  array<string, mixed>  $filters
     * @return array{data: array<int, array<string, mixed>>, meta: array<string, mixed>, warnings: array<string, mixed>}
     */
    public function listForTenant(Organization $tenant, array $filters): array;

    /**
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function summaryForTenant(Organization $tenant, array $filters): array;

    /**
     * @return list<array{month: string, label: string, commission_total: float}>
     */
    public function trendForTenant(Organization $tenant, int $months): array;
}
```

- [ ] **Step 2: Create the implementation**

```php
<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOrder\ExternalServices\Platform;

use App\Modules\Marketplace\VendorOrder\Contracts\VendorOrderServiceInterface;
use App\Modules\Marketplace\VendorOrder\Resources\VendorOrderListResource;
use App\Modules\Platform\Tenant\Models\Organization;

class TenantVendorOrderExternalService implements TenantVendorOrderExternalServiceInterface
{
    public function __construct(
        protected VendorOrderServiceInterface $service,
    ) {}

    public function listForTenant(Organization $tenant, array $filters): array
    {
        return $tenant->run(function () use ($tenant, $filters): array {
            $result = $this->service->listAllForTenant((string) $tenant->getKey(), $filters);
            $paginator = $result['data'];

            return [
                'data' => collect($result['decorated'])
                    ->map(fn ($row): array => (new VendorOrderListResource($row))->resolve())
                    ->all(),
                'meta' => [
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                    'from' => $paginator->firstItem(),
                    'to' => $paginator->lastItem(),
                ],
                'warnings' => $result['warnings'],
            ];
        });
    }

    public function summaryForTenant(Organization $tenant, array $filters): array
    {
        return $tenant->run(
            fn (): array => $this->service->getSummaryAllForTenant((string) $tenant->getKey(), $filters),
        );
    }

    public function trendForTenant(Organization $tenant, int $months): array
    {
        return $tenant->run(
            fn (): array => $this->service->getMonthlyTrendForTenant((string) $tenant->getKey(), $months),
        );
    }
}
```

- [ ] **Step 3: Bind in MarketplaceServiceProvider**

Add imports after line 22 (`use ...VendorOrderService;`):

```php
use App\Modules\Marketplace\VendorOrder\ExternalServices\Platform\TenantVendorOrderExternalService;
use App\Modules\Marketplace\VendorOrder\ExternalServices\Platform\TenantVendorOrderExternalServiceInterface;
```

Add the binding in `register()` after the `VendorOrderReportExternalServiceInterface` binding:

```php
        $this->app->bind(
            TenantVendorOrderExternalServiceInterface::class,
            TenantVendorOrderExternalService::class,
        );
```

- [ ] **Step 4: Verify binding resolves**

Run: `docker exec residential_app php artisan tinker --execute="dump(get_class(app(\App\Modules\Marketplace\VendorOrder\ExternalServices\Platform\TenantVendorOrderExternalServiceInterface::class)));"`
Expected: `"App\Modules\Marketplace\VendorOrder\ExternalServices\Platform\TenantVendorOrderExternalService"`

- [ ] **Step 5: Commit**

```bash
git add backend/app/Modules/Marketplace/src/VendorOrder/ExternalServices backend/app/Modules/Marketplace/Providers/MarketplaceServiceProvider.php
git commit -m "feat(marketplace): platform-facing per-tenant vendor order external service"
```

---

## Task 3: Platform vendor-orders controller + request + routes

**Files:**
- Create: `backend/app/Modules/Platform/src/Tenant/Requests/ListTenantVendorOrderRequest.php`
- Create: `backend/app/Modules/Platform/src/Tenant/Controllers/PlatformTenantVendorOrderController.php`
- Modify: `backend/app/Modules/Platform/routes/external-api.php`

- [ ] **Step 1: Create the Form Request** (filters + `months` for trend)

```php
<?php

namespace App\Modules\Platform\Tenant\Requests;

use App\Common\Requests\BaseFormRequest;

class ListTenantVendorOrderRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date', 'after_or_equal:from'],
            'partner_id' => ['nullable', 'integer'],
            'project_id' => ['nullable', 'integer'],
            'search' => ['nullable', 'string', 'max:100'],
            'months' => ['nullable', 'integer', 'min:1', 'max:12'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'to.after_or_equal' => 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.',
            'per_page.max' => 'Mỗi trang tối đa 50 dòng.',
        ];
    }
}
```

- [ ] **Step 2: Create the controller** (mirrors `TenantBusinessSummaryController` injection)

```php
<?php

declare(strict_types=1);

namespace App\Modules\Platform\Tenant\Controllers;

use App\Common\Controllers\BaseController;
use App\Modules\Marketplace\VendorOrder\ExternalServices\Platform\TenantVendorOrderExternalServiceInterface;
use App\Modules\Platform\Tenant\Contracts\OrganizationServiceInterface;
use App\Modules\Platform\Tenant\Requests\ListTenantVendorOrderRequest;
use Illuminate\Http\JsonResponse;

/**
 * Đơn hàng vendor (gom mọi vendor) trong một công ty vận hành, xem từ cổng platform,
 * kèm hoa hồng nền tảng mỗi đơn. Read-only.
 *
 * @tags Platform Tenant Vendor Orders
 */
class PlatformTenantVendorOrderController extends BaseController
{
    public function __construct(
        protected OrganizationServiceInterface $organizationService,
        protected TenantVendorOrderExternalServiceInterface $vendorOrders,
    ) {}

    public function index(ListTenantVendorOrderRequest $request, string $id): JsonResponse
    {
        $tenant = $this->organizationService->findById($id);
        $result = $this->vendorOrders->listForTenant($tenant, $request->validated());

        return response()->json(array_merge(['success' => true], $result));
    }

    public function summary(ListTenantVendorOrderRequest $request, string $id): JsonResponse
    {
        $tenant = $this->organizationService->findById($id);

        return response()->json([
            'success' => true,
            'data' => $this->vendorOrders->summaryForTenant($tenant, $request->validated()),
        ]);
    }

    public function trend(ListTenantVendorOrderRequest $request, string $id): JsonResponse
    {
        $tenant = $this->organizationService->findById($id);
        $months = (int) ($request->validated()['months'] ?? 6);

        return response()->json([
            'success' => true,
            'data' => $this->vendorOrders->trendForTenant($tenant, $months),
        ]);
    }
}
```

- [ ] **Step 3: Register routes**

Add import after line 14 in `external-api.php`:

```php
use App\Modules\Platform\Tenant\Controllers\PlatformTenantVendorOrderController;
```

Add after the `business-summary` route (line 53), static `/summary` and `/trend` before the bare list route:

```php
    Route::get('tenants/{id}/vendor-orders/summary', [PlatformTenantVendorOrderController::class, 'summary']);
    Route::get('tenants/{id}/vendor-orders/trend', [PlatformTenantVendorOrderController::class, 'trend']);
    Route::get('tenants/{id}/vendor-orders', [PlatformTenantVendorOrderController::class, 'index']);
```

- [ ] **Step 4: Verify routes**

Run: `docker exec residential_app php artisan route:list --path=vendor-orders`
Expected: 3 routes (summary, trend, index).

- [ ] **Step 5: Format, lint, commit**

```bash
docker exec residential_app make format && docker exec residential_app make lint
git add backend/app/Modules/Platform/src/Tenant/Requests/ListTenantVendorOrderRequest.php backend/app/Modules/Platform/src/Tenant/Controllers/PlatformTenantVendorOrderController.php backend/app/Modules/Platform/routes/external-api.php
git commit -m "feat(platform): add tenant vendor orders endpoints (list/summary/trend)"
```

---

## Task 4: Tenant-wide OG order list

**Files:**
- Modify: `backend/app/Modules/PMC/src/Order/ExternalServices/Platform/TenantProjectOrderExternalService.php` + its interface `TenantProjectOrderExternalServiceInterface.php`
- Create: `backend/app/Modules/Platform/src/Tenant/Requests/ListTenantOrderRequest.php`
- Create: `backend/app/Modules/Platform/src/Tenant/Controllers/PlatformTenantOrderController.php`
- Modify: `backend/app/Modules/Platform/routes/external-api.php`

- [ ] **Step 1: Add the interface method**

In `TenantProjectOrderExternalServiceInterface.php`, add:

```php
    /**
     * Tenant-wide list of completed PMC orders (all projects) with frozen platform fee + project name.
     *
     * @param  array<string, mixed>  $filters
     * @return \Illuminate\Pagination\LengthAwarePaginator<int, array<string, mixed>>
     */
    public function listTenantOrders(\App\Modules\Platform\Tenant\Models\Organization $tenant, array $filters): \Illuminate\Pagination\LengthAwarePaginator;
```

- [ ] **Step 2: Implement `listTenantOrders`**

In `TenantProjectOrderExternalService.php`, add the method (mirrors `listProjectOrders` minus the project filter; project name via `quote.ogTicket.project`). Add `use App\Modules\Platform\Tenant\Models\Organization;` and `use Illuminate\Pagination\LengthAwarePaginator;` (already imported per existing file):

```php
    public function listTenantOrders(Organization $tenant, array $filters): LengthAwarePaginator
    {
        return $tenant->run(function () use ($filters): LengthAwarePaginator {
            $query = Order::query()
                ->where('status', OrderStatus::Completed->value)
                ->with([
                    'quote.ogTicket.project:id,name',
                    'closingPeriodOrder:id,order_id,frozen_platform_fee',
                ]);

            if (! empty($filters['search'])) {
                $query->search((string) $filters['search']);
            }

            $paginator = $query
                ->orderByDesc('completed_at')
                ->orderByDesc('id')
                ->paginate((int) ($filters['per_page'] ?? 20));

            $paginator->through(fn (Order $order): array => [
                'id' => (int) $order->id,
                'code' => (string) $order->code,
                'project_name' => $order->quote?->ogTicket?->project?->name ?? '—',
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
                'completed_at' => $order->completed_at?->toIso8601String(),
            ]);

            return $paginator;
        });
    }
```

- [ ] **Step 3: Create the Form Request**

`ListTenantOrderRequest.php`:

```php
<?php

namespace App\Modules\Platform\Tenant\Requests;

use App\Common\Requests\BaseFormRequest;

class ListTenantOrderRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:100'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ];
    }
}
```

- [ ] **Step 4: Create the controller**

`PlatformTenantOrderController.php`:

```php
<?php

declare(strict_types=1);

namespace App\Modules\Platform\Tenant\Controllers;

use App\Common\Controllers\BaseController;
use App\Modules\Platform\Tenant\Contracts\OrganizationServiceInterface;
use App\Modules\Platform\Tenant\Requests\ListTenantOrderRequest;
use App\Modules\PMC\Order\ExternalServices\Platform\TenantProjectOrderExternalServiceInterface;
use Illuminate\Http\JsonResponse;

/**
 * Đơn hàng vận hành (PMC) toàn công ty vận hành, kèm phí nền tảng đóng băng. Read-only.
 *
 * @tags Platform Tenant Orders
 */
class PlatformTenantOrderController extends BaseController
{
    public function __construct(
        protected OrganizationServiceInterface $organizationService,
        protected TenantProjectOrderExternalServiceInterface $orderService,
    ) {}

    public function index(ListTenantOrderRequest $request, string $id): JsonResponse
    {
        $tenant = $this->organizationService->findById($id);
        $paginator = $this->orderService->listTenantOrders($tenant, $request->validated());

        return response()->json([
            'success' => true,
            'data' => $paginator->items(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
            ],
        ]);
    }
}
```

- [ ] **Step 5: Register route**

Import after line 14:

```php
use App\Modules\Platform\Tenant\Controllers\PlatformTenantOrderController;
```

Add after the `business-summary` route:

```php
    Route::get('tenants/{id}/orders', [PlatformTenantOrderController::class, 'index']);
```

- [ ] **Step 6: Verify route + format/lint/commit**

```bash
docker exec residential_app php artisan route:list --path=tenants
docker exec residential_app make format && docker exec residential_app make lint
git add backend/app/Modules/PMC/src/Order/ExternalServices/Platform backend/app/Modules/Platform/src/Tenant/Requests/ListTenantOrderRequest.php backend/app/Modules/Platform/src/Tenant/Controllers/PlatformTenantOrderController.php backend/app/Modules/Platform/routes/external-api.php
git commit -m "feat(platform): add tenant-wide OG order list endpoint"
```

---

## Task 5: TSO monthly trend

**Files:**
- Modify: `backend/app/Modules/Platform/src/TenantServiceOrder/Repositories/TenantServiceOrderRepository.php`
- Modify: `backend/app/Modules/Platform/src/TenantServiceOrder/Services/TenantServiceOrderService.php` + `Contracts/TenantServiceOrderServiceInterface.php`
- Modify: `backend/app/Modules/Platform/src/TenantServiceOrder/Controllers/TenantServiceOrderController.php`
- Create: `backend/app/Modules/Platform/src/TenantServiceOrder/Requests/TenantServiceOrderTrendRequest.php`
- Modify: `backend/app/Modules/Platform/routes/external-api.php`

- [ ] **Step 1: Repository `monthlyTrend`**

Add to `TenantServiceOrderRepository` (reuses `buildFilteredQuery`, buckets Paid orders by `paid_at` month):

```php
    /**
     * Monthly platform revenue (paid orders) over the last N months.
     *
     * @param  array<string, mixed>  $filters
     * @return list<array{month: string, label: string, platform_revenue: float}>
     */
    public function monthlyTrend(array $filters, int $months): array
    {
        $from = now()->startOfMonth()->subMonthsNoOverflow($months - 1);
        $to = now()->endOfMonth();

        $rows = $this->buildFilteredQuery($filters)
            ->where('status', TenantServiceOrderStatus::Paid->value)
            ->whereBetween('paid_at', [$from, $to])
            ->get(['paid_at', 'amount']);

        $buckets = [];
        $cursor = $from->copy();

        for ($i = 0; $i < $months; $i++) {
            $key = $cursor->format('Y-m');
            $buckets[$key] = [
                'month' => $key,
                'label' => 'T'.$cursor->format('n/Y'),
                'platform_revenue' => 0.0,
            ];
            $cursor = $cursor->addMonthNoOverflow();
        }

        foreach ($rows as $row) {
            $key = $row->paid_at?->format('Y-m');

            if ($key === null || ! isset($buckets[$key])) {
                continue;
            }

            $buckets[$key]['platform_revenue'] += (float) $row->amount;
        }

        return array_values($buckets);
    }
```

- [ ] **Step 2: Service + interface**

In `TenantServiceOrderServiceInterface.php`, add (next to `stats`):

```php
    /**
     * @param  array<string, mixed>  $filters
     * @return list<array{month: string, label: string, platform_revenue: float}>
     */
    public function monthlyTrend(array $filters, int $months): array;
```

In `TenantServiceOrderService.php`, add the delegating method (mirror the existing `stats()` delegation):

```php
    public function monthlyTrend(array $filters, int $months): array
    {
        return $this->repository->monthlyTrend($filters, $months);
    }
```

(Verify the service's repository property name by opening the file — match how `stats()` calls `$this->repository->stats(...)`.)

- [ ] **Step 3: Trend request**

`TenantServiceOrderTrendRequest.php`:

```php
<?php

namespace App\Modules\Platform\TenantServiceOrder\Requests;

use App\Common\Requests\BaseFormRequest;

class TenantServiceOrderTrendRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'organization_id' => ['nullable', 'string', 'exists:tenants,id'],
            'months' => ['nullable', 'integer', 'min:1', 'max:12'],
        ];
    }
}
```

- [ ] **Step 4: Controller `trend`**

Add to `TenantServiceOrderController` (import `TenantServiceOrderTrendRequest`):

```php
    public function trend(TenantServiceOrderTrendRequest $request, ): JsonResponse
    {
        $validated = $request->validated();
        $months = (int) ($validated['months'] ?? 6);

        return response()->json([
            'success' => true,
            'data' => $this->service->monthlyTrend($validated, $months),
        ]);
    }
```

(Remove the trailing comma in the signature if your Pint config rejects it; written as `public function trend(TenantServiceOrderTrendRequest $request): JsonResponse`.)

- [ ] **Step 5: Route**

Add to `external-api.php` next to the other `tenant-service-orders` routes (before the `{id}` route to avoid capture):

```php
    Route::get('tenant-service-orders/trend', [TenantServiceOrderController::class, 'trend']);
```

- [ ] **Step 6: Verify + format/lint/commit**

```bash
docker exec residential_app php artisan route:list --path=tenant-service-orders/trend
docker exec residential_app make format && docker exec residential_app make lint
git add backend/app/Modules/Platform/src/TenantServiceOrder backend/app/Modules/Platform/routes/external-api.php
git commit -m "feat(platform): add tenant service order monthly trend endpoint"
```

---

## Task 6: Backend feature tests

**Files:**
- Create: `backend/tests/Feature/Platform/PlatformTenantVendorOrderControllerTest.php`
- Create: `backend/tests/Feature/Platform/PlatformTenantOrderControllerTest.php`
- Create: `backend/tests/Feature/Platform/TenantServiceOrderTrendTest.php`

- [ ] **Step 1: Vendor controller test (fake ExternalService at the boundary)**

```php
<?php

declare(strict_types=1);

namespace Tests\Feature\Platform;

use App\Modules\Marketplace\VendorOrder\ExternalServices\Platform\TenantVendorOrderExternalServiceInterface;
use App\Modules\Platform\Tenant\Models\Organization;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlatformTenantVendorOrderControllerTest extends TestCase
{
    use RefreshDatabase;

    private function bindFake(array $list, array $summary, array $trend): void
    {
        $this->app->instance(
            TenantVendorOrderExternalServiceInterface::class,
            new class($list, $summary, $trend) implements TenantVendorOrderExternalServiceInterface
            {
                public function __construct(private array $list, private array $summary, private array $trend) {}

                public function listForTenant(Organization $tenant, array $filters): array
                {
                    return $this->list;
                }

                public function summaryForTenant(Organization $tenant, array $filters): array
                {
                    return $this->summary;
                }

                public function trendForTenant(Organization $tenant, int $months): array
                {
                    return $this->trend;
                }
            }
        );
    }

    public function test_index_returns_shaped_vendor_orders(): void
    {
        $tenant = Organization::factory()->create();
        $this->bindFake(
            list: [
                'data' => [['id' => 1, 'code' => 'VO-01', 'commission' => ['amount' => 250000]]],
                'meta' => ['current_page' => 1, 'last_page' => 1, 'per_page' => 20, 'total' => 1, 'from' => 1, 'to' => 1],
                'warnings' => ['orphan_orders_count' => 0, 'non_per_order_orders_count' => 0, 'schema_missing' => false],
            ],
            summary: [],
            trend: [],
        );

        $this->getJson("/api/v1/platform/tenants/{$tenant->getKey()}/vendor-orders")
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.0.code', 'VO-01')
            ->assertJsonPath('meta.total', 1);
    }

    public function test_summary_and_trend_return_data(): void
    {
        $tenant = Organization::factory()->create();
        $this->bindFake(
            list: [],
            summary: ['orders_count' => 87, 'commission_total' => 41000000],
            trend: [['month' => '2026-06', 'label' => 'T6/2026', 'commission_total' => 41000000]],
        );

        $this->getJson("/api/v1/platform/tenants/{$tenant->getKey()}/vendor-orders/summary")
            ->assertOk()->assertJsonPath('data.commission_total', 41000000);

        $this->getJson("/api/v1/platform/tenants/{$tenant->getKey()}/vendor-orders/trend?months=6")
            ->assertOk()->assertJsonPath('data.0.commission_total', 41000000);
    }

    public function test_unknown_tenant_404(): void
    {
        $this->getJson('/api/v1/platform/tenants/nope/vendor-orders')->assertNotFound();
    }
}
```

- [ ] **Step 2: OG order list test (fake PMC ExternalService)**

```php
<?php

declare(strict_types=1);

namespace Tests\Feature\Platform;

use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\PMC\Order\ExternalServices\Platform\TenantProjectOrderExternalServiceInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Pagination\LengthAwarePaginator;
use Tests\TestCase;

class PlatformTenantOrderControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_tenant_orders(): void
    {
        $tenant = Organization::factory()->create();

        $this->app->instance(
            TenantProjectOrderExternalServiceInterface::class,
            new class implements TenantProjectOrderExternalServiceInterface
            {
                public function listProjectOrders(Organization $tenant, int $projectId, array $filters): LengthAwarePaginator
                {
                    return new LengthAwarePaginator([], 0, 20, 1);
                }

                public function listTenantOrders(Organization $tenant, array $filters): LengthAwarePaginator
                {
                    return new LengthAwarePaginator(
                        [['id' => 5, 'code' => 'ORD-5', 'project_name' => 'CC A', 'total_amount' => '2500000.00', 'platform_fee' => '50000.00', 'status' => ['value' => 'completed', 'label' => 'Hoàn thành'], 'completed_at' => null]],
                        1, 20, 1,
                    );
                }
            }
        );

        $this->getJson("/api/v1/platform/tenants/{$tenant->getKey()}/orders")
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.0.code', 'ORD-5')
            ->assertJsonPath('data.0.project_name', 'CC A')
            ->assertJsonPath('meta.total', 1);
    }
}
```

(If `TenantProjectOrderExternalServiceInterface` declares only `listProjectOrders` + the new `listTenantOrders`, the anonymous class above must implement both — it does. Adjust if the interface has more methods.)

- [ ] **Step 3: TSO trend test (real DB)**

```php
<?php

declare(strict_types=1);

namespace Tests\Feature\Platform;

use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\Platform\TenantServiceOrder\Enums\TenantServiceOrderStatus;
use App\Modules\Platform\TenantServiceOrder\Models\TenantServiceOrder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TenantServiceOrderTrendTest extends TestCase
{
    use RefreshDatabase;

    public function test_trend_buckets_paid_revenue_by_month(): void
    {
        $tenant = Organization::factory()->create();

        TenantServiceOrder::factory()->create([
            'organization_id' => $tenant->getKey(),
            'status' => TenantServiceOrderStatus::Paid->value,
            'amount' => 1000000,
            'paid_at' => now(),
        ]);

        $response = $this->getJson("/api/v1/platform/tenant-service-orders/trend?organization_id={$tenant->getKey()}&months=6");

        $response->assertOk()->assertJsonPath('success', true);
        $this->assertSame(
            1000000.0,
            array_sum(array_column($response->json('data'), 'platform_revenue')),
        );
    }
}
```

(Use the TenantServiceOrder factory if present; otherwise mirror the setup in the existing TSO tests under `tests/`.)

- [ ] **Step 4: Match auth/bootstrapping to existing platform tests**

Open the closest sibling platform feature test (e.g. an existing TSO or TenantBusinessSummary test) and copy its `setUp()`/auth (`actingAs` requester, headers, factory states). Apply to all three test classes so they run under the same conditions.

- [ ] **Step 5: Run, format, lint, commit**

```bash
docker exec residential_app php artisan test --compact --filter="PlatformTenantVendorOrderControllerTest|PlatformTenantOrderControllerTest|TenantServiceOrderTrendTest"
docker exec residential_app make format && docker exec residential_app make lint
git add backend/tests/Feature/Platform
git commit -m "test(platform): cover tenant revenue endpoints"
```

Expected: all tests PASS.

---

## Task 7: Frontend API composables

**Files:**
- Modify: `frontend/app/composables/api/useTenants.ts`
- Modify: `frontend/app/composables/api/useTenantServiceOrders.ts`

- [ ] **Step 1: Vendor + OG composables in `useTenants.ts`**

Add the type import at the top:

```ts
import type { VendorOrderListItem, VendorOrderSummary } from '~/composables/api/useVendorOrders'
```

(If those aren't exported, add `export` to them in `useVendorOrders.ts` — verify with `grep -n "interface VendorOrderListItem" frontend/app/composables/api/useVendorOrders.ts`.)

Add in the Queries section:

```ts
// ─── Tenant vendor orders (platform view) ─────────────────────────

export interface TenantVendorOrdersParams {
  from?: string
  to?: string
  partner_id?: number
  search?: string
  page?: number
  per_page?: number
}

export interface TenantMonthPoint {
  month: string
  label: string
}

export interface TenantVendorOrdersListResponse {
  success: boolean
  data: VendorOrderListItem[]
  meta: { current_page: number, last_page: number, per_page: number, total: number, from: number | null, to: number | null }
  warnings: { orphan_orders_count: number, non_per_order_orders_count: number, schema_missing: boolean }
}

export interface TenantVendorOrderSummaryResponse {
  success: boolean
  data: VendorOrderSummary
}

export interface TenantVendorOrderTrendResponse {
  success: boolean
  data: (TenantMonthPoint & { commission_total: number })[]
}

export interface TenantOrderItem {
  id: number
  code: string
  project_name: string
  total_amount: string
  platform_fee: string
  status: { value: string, label: string }
  completed_at: string | null
}

export interface TenantOrdersListResponse {
  success: boolean
  data: TenantOrderItem[]
  meta: { current_page: number, last_page: number, per_page: number, total: number, from: number | null, to: number | null }
}

function buildTenantQuery(params: Record<string, unknown>): string {
  const q = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') q.set(k, String(v))
  }
  const s = q.toString()
  return s ? `?${s}` : ''
}

export function useTenantVendorOrders(
  tenantId: MaybeRefOrGetter<string>,
  params: MaybeRefOrGetter<TenantVendorOrdersParams> = () => ({})
) {
  const url = computed(() => `/platform/tenants/${toValue(tenantId)}/vendor-orders${buildTenantQuery(toValue(params) as Record<string, unknown>)}`)
  return usePlatformApiFetch<TenantVendorOrdersListResponse>(url, { watch: [() => toValue(tenantId), () => toValue(params)] })
}

export function useTenantVendorOrderSummary(
  tenantId: MaybeRefOrGetter<string>,
  params: MaybeRefOrGetter<{ from?: string, to?: string }> = () => ({})
) {
  const url = computed(() => `/platform/tenants/${toValue(tenantId)}/vendor-orders/summary${buildTenantQuery(toValue(params) as Record<string, unknown>)}`)
  return usePlatformApiFetch<TenantVendorOrderSummaryResponse>(url, { watch: [() => toValue(tenantId), () => toValue(params)] })
}

export function useTenantVendorOrderTrend(tenantId: MaybeRefOrGetter<string>, months = 6) {
  const url = computed(() => `/platform/tenants/${toValue(tenantId)}/vendor-orders/trend?months=${months}`)
  return usePlatformApiFetch<TenantVendorOrderTrendResponse>(url)
}

export function useTenantOrders(
  tenantId: MaybeRefOrGetter<string>,
  params: MaybeRefOrGetter<{ search?: string, page?: number, per_page?: number }> = () => ({})
) {
  const url = computed(() => `/platform/tenants/${toValue(tenantId)}/orders${buildTenantQuery(toValue(params) as Record<string, unknown>)}`)
  return usePlatformApiFetch<TenantOrdersListResponse>(url, { watch: [() => toValue(tenantId), () => toValue(params)] })
}
```

- [ ] **Step 2: TSO trend composable in `useTenantServiceOrders.ts`**

```ts
export interface TenantServiceOrderTrendResponse {
  success: boolean
  data: { month: string, label: string, platform_revenue: number }[]
}

export function useTenantServiceOrderTrend(tenantId: MaybeRefOrGetter<string>, months = 6) {
  const url = computed(() => `/platform/tenant-service-orders/trend?organization_id=${toValue(tenantId)}&months=${months}`)
  return usePlatformApiFetch<TenantServiceOrderTrendResponse>(url)
}
```

(Match the local helper names in that file — it uses `usePlatformApiFetch` per the existing exports.)

- [ ] **Step 3: Typecheck + commit**

```bash
docker exec residential_frontend pnpm run typecheck
git add frontend/app/composables/api/useTenants.ts frontend/app/composables/api/useTenantServiceOrders.ts frontend/app/composables/api/useVendorOrders.ts
git commit -m "feat(fe): tenant revenue api composables"
```

---

## Task 8: Stacked bar chart component

**Files:**
- Create: `frontend/app/components/shared/StackedBarChart.vue`

- [ ] **Step 1: Create the component**

```vue
<script setup lang="ts">
interface StackedPoint {
  label: string
  og: number
  vendor: number
  tso: number
}

interface Props {
  points: StackedPoint[]
}

const props = defineProps<Props>()

const W = 640
const H = 220
const padX = 32
const padTop = 12
const padBottom = 28
const chartH = H - padTop - padBottom

const maxTotal = computed(() => Math.max(1, ...props.points.map(p => p.og + p.vendor + p.tso)))
const slot = computed(() => (W - padX * 2) / Math.max(1, props.points.length))
const barW = computed(() => Math.min(36, slot.value * 0.6))

function segHeight(v: number): number {
  return (v / maxTotal.value) * chartH
}

const bars = computed(() =>
  props.points.map((p, i) => {
    const x = padX + slot.value * i + (slot.value - barW.value) / 2
    const base = padTop + chartH
    const ogH = segHeight(p.og)
    const vendorH = segHeight(p.vendor)
    const tsoH = segHeight(p.tso)
    const ogY = base - ogH
    const vendorY = ogY - vendorH
    const tsoY = vendorY - tsoH
    return { x, w: barW.value, label: p.label, ogY, ogH, vendorY, vendorH, tsoY, tsoH }
  })
)

const legend = [
  { label: 'Phí OG', dot: 'bg-emerald-500' },
  { label: 'Hoa hồng vendor', dot: 'bg-amber-500' },
  { label: 'Dịch vụ VH', dot: 'bg-sky-500' }
]
</script>

<template>
  <div>
    <div class="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
      <span v-for="l in legend" :key="l.label" class="inline-flex items-center gap-1.5">
        <span :class="['inline-block size-2.5 rounded-sm', l.dot]" />{{ l.label }}
      </span>
    </div>
    <svg :viewBox="`0 0 ${W} ${H}`" class="w-full" role="img" aria-label="Biểu đồ doanh thu theo tháng">
      <g v-for="(b, i) in bars" :key="i">
        <rect :x="b.x" :y="b.ogY" :width="b.w" :height="b.ogH" rx="1" class="fill-emerald-500" />
        <rect :x="b.x" :y="b.vendorY" :width="b.w" :height="b.vendorH" rx="1" class="fill-amber-500" />
        <rect :x="b.x" :y="b.tsoY" :width="b.w" :height="b.tsoH" rx="1" class="fill-sky-500" />
        <text :x="b.x + b.w / 2" :y="H - 10" text-anchor="middle" class="fill-slate-500 text-[10px]">{{ b.label }}</text>
      </g>
    </svg>
  </div>
</template>
```

- [ ] **Step 2: Typecheck + commit**

```bash
docker exec residential_frontend pnpm run typecheck
git add frontend/app/components/shared/StackedBarChart.vue
git commit -m "feat(fe): add 3-series stacked bar chart"
```

---

## Task 9: Upgrade the business summary card

**Files:**
- Modify: `frontend/app/components/tenant/TenantBusinessSummaryCard.vue`

- [ ] **Step 1: Fetch 3 sources + build tiles, composition, stacked points**

Replace the `<script setup>` data section (keep the project-scope branch using the existing OG-only chart):

```vue
<script setup lang="ts">
import { useTenantBusinessSummary, useTenantVendorOrderTrend } from '~/composables/api/useTenants'
import { useProjectBusinessSummary } from '~/composables/api/usePlatformProjects'
import { useTenantServiceOrderTrend } from '~/composables/api/useTenantServiceOrders'

interface Props {
  tenantId: string
  projectId?: number
}

const props = defineProps<Props>()
const isProjectScope = props.projectId != null

const { data, status, error, refresh } = isProjectScope
  ? useProjectBusinessSummary(() => props.tenantId, () => props.projectId!)
  : useTenantBusinessSummary(() => props.tenantId)

const ogSummary = computed(() => data.value?.data?.summary ?? { tenant_revenue: 0, order_count: 0, platform_revenue: 0 })
const months = computed(() => data.value?.data?.months ?? [])
const hasActivity = computed(() => ogSummary.value.order_count > 0)
const isLoading = computed(() => status.value === 'pending' && !data.value)

const { data: vendorTrendData } = isProjectScope
  ? { data: ref<{ data: { month: string, commission_total: number }[] } | null>(null) }
  : useTenantVendorOrderTrend(() => props.tenantId)
const { data: tsoTrendData } = isProjectScope
  ? { data: ref<{ data: { month: string, platform_revenue: number }[] } | null>(null) }
  : useTenantServiceOrderTrend(() => props.tenantId)

const vendorTrend = computed(() => vendorTrendData.value?.data ?? [])
const tsoTrend = computed(() => tsoTrendData.value?.data ?? [])

const ogRevenue = computed(() => ogSummary.value.platform_revenue)
const vendorRevenue = computed(() => vendorTrend.value.reduce((s, m) => s + m.commission_total, 0))
const tsoRevenue = computed(() => tsoTrend.value.reduce((s, m) => s + m.platform_revenue, 0))
const totalRevenue = computed(() => ogRevenue.value + vendorRevenue.value + tsoRevenue.value)

const tiles = computed(() => [
  { label: 'Tổng platform thu', value: formatCurrency(totalRevenue.value), accent: 'text-emerald-700 font-semibold' },
  { label: 'Phí OG ticket', value: formatCurrency(ogRevenue.value), accent: 'text-slate-900' },
  { label: 'Hoa hồng vendor', value: formatCurrency(vendorRevenue.value), accent: 'text-slate-900' },
  { label: 'Dịch vụ vận hành', value: formatCurrency(tsoRevenue.value), accent: 'text-slate-900' }
])

const stackedPoints = computed(() =>
  months.value.map((m) => {
    const v = vendorTrend.value.find(x => x.month === m.month)
    const t = tsoTrend.value.find(x => x.month === m.month)
    return { label: m.label, og: m.platform_fee, vendor: v?.commission_total ?? 0, tso: t?.platform_revenue ?? 0 }
  })
)
</script>
```

- [ ] **Step 2: Render the 4 tiles + stacked chart**

In the template: set the tiles grid to `grid-cols-2 md:grid-cols-4`. Replace the chart block so tenant scope uses the stacked chart and project scope keeps the existing OG dual-axis chart:

```vue
    <template v-if="hasActivity">
      <SharedStackedBarChart v-if="!isProjectScope" :points="stackedPoints" />
      <TenantBusinessChart v-else :months="months" />
    </template>
    <p v-else class="text-sm text-slate-500">Chưa có dữ liệu kinh doanh.</p>
```

- [ ] **Step 3: Typecheck + commit**

```bash
docker exec residential_frontend pnpm run typecheck
git add frontend/app/components/tenant/TenantBusinessSummaryCard.vue
git commit -m "feat(fe): combine 3 revenue sources + stacked chart in summary card"
```

---

## Task 10: Revenue tab + 3 sub-panels

**Files:**
- Create: `frontend/app/components/tenant/TenantRevenueOgPanel.vue`
- Create: `frontend/app/components/tenant/TenantRevenueVendorPanel.vue`
- Create: `frontend/app/components/tenant/TenantRevenueServiceOrderPanel.vue`
- Create: `frontend/app/components/tenant/TenantRevenueTab.vue`

- [ ] **Step 1: OG panel (KPI + real order list)**

```vue
<script setup lang="ts">
import { useTenantBusinessSummary, useTenantOrders } from '~/composables/api/useTenants'

interface Props { tenantId: string }
const props = defineProps<Props>()

const page = ref(1)
const { data: summaryData } = useTenantBusinessSummary(() => props.tenantId)
const { data, status, error, refresh } = useTenantOrders(() => props.tenantId, () => ({ page: page.value, per_page: 20 }))

const isLoading = computed(() => status.value === 'pending' && !data.value)
const summary = computed(() => summaryData.value?.data?.summary ?? { tenant_revenue: 0, order_count: 0, platform_revenue: 0 })
const orders = computed(() => data.value?.data ?? [])
const meta = computed(() => data.value?.meta)

const columns = [
  { accessorKey: 'code', header: 'Mã đơn' },
  { accessorKey: 'project_name', header: 'Dự án' },
  { accessorKey: 'completed_at', header: 'Hoàn thành' },
  { accessorKey: 'total_amount', header: 'Tổng đơn' },
  { accessorKey: 'platform_fee', header: 'Phí platform' },
  { accessorKey: 'status', header: 'Trạng thái' }
]
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <SharedSectionCard title="Doanh thu tenant" compact>{{ formatCurrency(summary.tenant_revenue) }}</SharedSectionCard>
      <SharedSectionCard title="Số đơn hoàn thành" compact>{{ formatNumber(summary.order_count) }}</SharedSectionCard>
      <SharedSectionCard title="Phí platform thu" compact>
        <span class="text-emerald-600">{{ formatCurrency(summary.platform_revenue) }}</span>
      </SharedSectionCard>
    </div>

    <div v-if="isLoading"><USkeleton class="h-40 w-full rounded-lg" /></div>
    <UAlert v-else-if="error" icon="i-lucide-alert-circle" color="error" variant="subtle" title="Lỗi" description="Không thể tải đơn hàng vận hành.">
      <template #actions><UButton label="Thử lại" size="xs" @click="refresh()" /></template>
    </UAlert>
    <template v-else>
      <UTable :data="orders" :columns="columns">
        <template #completed_at-cell="{ row }">{{ row.original.completed_at ? formatDate(row.original.completed_at) : '—' }}</template>
        <template #total_amount-cell="{ row }">{{ formatCurrency(row.original.total_amount) }}</template>
        <template #platform_fee-cell="{ row }"><span class="text-emerald-600">{{ formatCurrency(row.original.platform_fee) }}</span></template>
        <template #status-cell="{ row }"><UBadge :label="row.original.status.label" color="success" variant="subtle" /></template>
      </UTable>
      <div v-if="meta && meta.last_page > 1" class="flex justify-end">
        <UPagination v-model:page="page" :total="meta.total" :items-per-page="meta.per_page" />
      </div>
    </template>
  </div>
</template>
```

(Confirm a `formatDate` util exists in `frontend/app/utils/` — `grep -rn "export function formatDate" frontend/app/utils`. If named differently, use that name.)

- [ ] **Step 2: Vendor panel**

```vue
<script setup lang="ts">
import { useTenantVendorOrders, useTenantVendorOrderSummary } from '~/composables/api/useTenants'
import type { VendorOrderListItem } from '~/composables/api/useVendorOrders'

interface Props { tenantId: string }
const props = defineProps<Props>()

const page = ref(1)
const searchValue = ref('')
const { searchInput, onSearch } = useTableSearch((v) => { searchValue.value = v ?? ''; page.value = 1 })

const listParams = computed(() => ({ search: searchValue.value || undefined, page: page.value, per_page: 20 }))
const { data: summaryData } = useTenantVendorOrderSummary(() => props.tenantId)
const { data, status, error, refresh } = useTenantVendorOrders(() => props.tenantId, listParams)

const isLoading = computed(() => status.value === 'pending' && !data.value)
const orders = computed<VendorOrderListItem[]>(() => data.value?.data ?? [])
const meta = computed(() => data.value?.meta)
const ordersCount = computed(() => summaryData.value?.data?.orders_count ?? 0)
const commissionTotal = computed(() => summaryData.value?.data?.commission_total ?? 0)

const columns = [
  { accessorKey: 'code', header: 'Mã đơn' },
  { accessorKey: 'vendor', header: 'Vendor' },
  { accessorKey: 'project_name', header: 'Dự án' },
  { accessorKey: 'total', header: 'Tổng đơn' },
  { accessorKey: 'commission', header: 'Hoa hồng platform' },
  { accessorKey: 'status', header: 'Trạng thái' }
]
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <SharedSectionCard title="Số đơn vendor" compact>{{ formatNumber(ordersCount) }}</SharedSectionCard>
      <SharedSectionCard title="Hoa hồng platform" compact><span class="text-emerald-600">{{ formatCurrency(commissionTotal) }}</span></SharedSectionCard>
    </div>

    <UInput v-model="searchInput" icon="i-lucide-search" placeholder="Tìm mã đơn…" @update:model-value="onSearch" />

    <div v-if="isLoading"><USkeleton class="h-40 w-full rounded-lg" /></div>
    <UAlert v-else-if="error" icon="i-lucide-alert-circle" color="error" variant="subtle" title="Lỗi" description="Không thể tải đơn hàng vendor.">
      <template #actions><UButton label="Thử lại" size="xs" @click="refresh()" /></template>
    </UAlert>
    <template v-else>
      <UTable :data="orders" :columns="columns">
        <template #vendor-cell="{ row }">
          <NuxtLink v-if="row.original.vendor" :to="`/platform/quan-ly-van-hanh/quan-ly-vendor/${row.original.vendor.id}`" class="text-primary hover:underline">{{ row.original.vendor.name }}</NuxtLink>
          <span v-else>—</span>
        </template>
        <template #total-cell="{ row }">{{ formatCurrency(row.original.total) }}</template>
        <template #commission-cell="{ row }"><span class="text-emerald-600">{{ formatCurrency(row.original.commission.amount) }}</span></template>
        <template #status-cell="{ row }"><UBadge :label="row.original.status.label" color="neutral" variant="subtle" /></template>
      </UTable>
      <div v-if="meta && meta.last_page > 1" class="flex justify-end">
        <UPagination v-model:page="page" :total="meta.total" :items-per-page="meta.per_page" />
      </div>
    </template>
  </div>
</template>
```

(Verify the vendor console detail route by checking existing links: `grep -rn "quan-ly-vendor/" frontend/app`. Adjust `:to` if needed.)

- [ ] **Step 3: TSO panel (view-only)**

```vue
<script setup lang="ts">
import { useTenantServiceOrderList, useTenantServiceOrderStats } from '~/composables/api/useTenantServiceOrders'

interface Props { tenantId: string }
const props = defineProps<Props>()

const page = ref(1)
const { data: statsData } = useTenantServiceOrderStats(() => ({ organization_id: props.tenantId }))
const { data, status, error, refresh } = useTenantServiceOrderList(() => ({ organization_id: props.tenantId, page: page.value, per_page: 20 }))

const isLoading = computed(() => status.value === 'pending' && !data.value)
const rows = computed(() => data.value?.data ?? [])
const meta = computed(() => data.value?.meta)
const stats = computed(() => statsData.value?.data ?? { total: 0, platform_revenue: '0', pending_amount: '0', paid_count: 0 })

const columns = [
  { accessorKey: 'code', header: 'Mã đơn' },
  { accessorKey: 'order_type', header: 'Loại' },
  { accessorKey: 'title', header: 'Tiêu đề' },
  { accessorKey: 'amount', header: 'Số tiền' },
  { accessorKey: 'status', header: 'Trạng thái' }
]
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <SharedSectionCard title="Tổng đơn" compact>{{ formatNumber(stats.total) }}</SharedSectionCard>
      <SharedSectionCard title="Doanh thu (đã TT)" compact><span class="text-emerald-600">{{ formatCurrency(stats.platform_revenue) }}</span></SharedSectionCard>
      <SharedSectionCard title="Chờ thanh toán" compact>{{ formatCurrency(stats.pending_amount) }}</SharedSectionCard>
      <SharedSectionCard title="Số đơn đã TT" compact>{{ formatNumber(stats.paid_count) }}</SharedSectionCard>
    </div>

    <div v-if="isLoading"><USkeleton class="h-40 w-full rounded-lg" /></div>
    <UAlert v-else-if="error" icon="i-lucide-alert-circle" color="error" variant="subtle" title="Lỗi" description="Không thể tải đơn dịch vụ vận hành.">
      <template #actions><UButton label="Thử lại" size="xs" @click="refresh()" /></template>
    </UAlert>
    <template v-else>
      <UTable :data="rows" :columns="columns">
        <template #order_type-cell="{ row }">{{ row.original.order_type.label }}</template>
        <template #amount-cell="{ row }">{{ formatCurrency(row.original.amount) }}</template>
        <template #status-cell="{ row }"><UBadge :label="row.original.status.label" color="neutral" variant="subtle" /></template>
      </UTable>
      <div v-if="meta && meta.last_page > 1" class="flex justify-end">
        <UPagination v-model:page="page" :total="meta.total" :items-per-page="meta.per_page" />
      </div>
    </template>
  </div>
</template>
```

- [ ] **Step 4: Container tab**

```vue
<script setup lang="ts">
interface Props { tenantId: string }
const props = defineProps<Props>()

type SubTab = 'og' | 'vendor' | 'service'
const subTab = ref<SubTab>('og')
const subTabItems = [
  { value: 'og' as SubTab, label: 'OG ticket', icon: 'i-lucide-ticket' },
  { value: 'vendor' as SubTab, label: 'Vendor', icon: 'i-lucide-store' },
  { value: 'service' as SubTab, label: 'Dịch vụ vận hành', icon: 'i-lucide-file-text' }
]
</script>

<template>
  <div class="space-y-4">
    <UTabs v-model="subTab" :items="subTabItems" variant="pill" :content="false" class="w-full" />
    <TenantRevenueOgPanel v-if="subTab === 'og'" :tenant-id="props.tenantId" />
    <TenantRevenueVendorPanel v-else-if="subTab === 'vendor'" :tenant-id="props.tenantId" />
    <TenantRevenueServiceOrderPanel v-else :tenant-id="props.tenantId" />
  </div>
</template>
```

- [ ] **Step 5: Typecheck + commit**

```bash
docker exec residential_frontend pnpm run typecheck
git add frontend/app/components/tenant/TenantRevenue*.vue
git commit -m "feat(fe): tenant revenue tab with OG/vendor/service sub-panels"
```

---

## Task 11: Wire the tab into the detail page

**Files:**
- Modify: `frontend/app/pages/platform/tenants/[id]/index.vue`

- [ ] **Step 1: Add tab id, item, render**

```ts
type TabId = 'info' | 'revenue' | 'accounts' | 'services' | 'config'
const tabIds: TabId[] = ['info', 'revenue', 'accounts', 'services', 'config']
const tabItems = [
  { value: 'info' as TabId, label: 'Thông tin chung', icon: 'i-lucide-info' },
  { value: 'revenue' as TabId, label: 'Doanh thu & Đơn hàng', icon: 'i-lucide-chart-line' },
  { value: 'accounts' as TabId, label: 'Quản lý tài khoản', icon: 'i-lucide-users' },
  { value: 'services' as TabId, label: 'Quản lý dịch vụ', icon: 'i-lucide-layout-grid' },
  { value: 'config' as TabId, label: 'Cấu hình', icon: 'i-lucide-settings' }
]
```

In the template, after `TenantInfoTab`:

```vue
<TenantRevenueTab v-if="activeTab === 'revenue'" :tenant-id="tenant.id" />
```

- [ ] **Step 2: Typecheck + lint + commit**

```bash
docker exec residential_frontend pnpm run typecheck && docker exec residential_frontend pnpm run lint
git add frontend/app/pages/platform/tenants/[id]/index.vue
git commit -m "feat(fe): add revenue tab to tenant detail page"
```

---

## Task 12: Full verification

- [ ] **Step 1: Backend**

Run: `docker exec residential_app php artisan test --compact --filter="PlatformTenantVendorOrderControllerTest|PlatformTenantOrderControllerTest|TenantServiceOrderTrendTest"`
Expected: PASS. Then ask the user whether to run the full suite.

- [ ] **Step 2: Frontend**

Run: `docker exec residential_frontend pnpm run typecheck && docker exec residential_frontend pnpm run lint`
Expected: both pass.

- [ ] **Step 3: Browser**

Open `http://residential.test:3000/platform/tenants/tnp`:
- Summary card: TOTAL + 3 source tiles + 3-series stacked monthly chart.
- "Doanh thu & Đơn hàng" tab → OG (order list), Vendor (order list + commission, vendor links work), Dịch vụ VH (list, no create button) all load.
- Existing tabs still work; no console errors.

---

## Self-Review notes

- **Spec coverage:** TOTAL of 3 sources → Task 9. 3-source monthly chart → Tasks 1,5,8,9. Vendor list+revenue → Tasks 2,3,10. OG list+revenue → Task 4,10. DVVH view-only → Tasks 5,10. Tab layout (Phương án A) → Tasks 10,11.
- **Type consistency:** `getMonthlyTrendForTenant` (T1) ↔ `trendForTenant` (T2) ↔ controller `trend` (T3) ↔ `useTenantVendorOrderTrend` (T7) ↔ card `vendorTrend` (T9). `listTenantOrders` (T4) ↔ `useTenantOrders` (T7) ↔ OG panel (T10). `monthlyTrend` (T5 repo+service) ↔ `useTenantServiceOrderTrend` (T7) ↔ card `tsoTrend` (T9). Chart prop `{label, og, vendor, tso}` (T8) ↔ `stackedPoints` (T9).
- **No placeholders:** every code step shows full code; verification steps include `grep` checks for the few cross-file names to confirm (util `formatDate`, vendor route, exported vendor types, TSO service repository property).
