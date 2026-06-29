# Báo cáo tổng hợp (Platform/Report) — Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the read-only platform "Báo cáo tổng hợp" cluster — 1 hub + 7 cross-tenant aggregation report endpoints under `Platform/Report` — plus the cross-repo resident-rating wiring that feeds CSAT.

**Architecture:** A new read-only submodule `Platform/Report` exposes 8 GET endpoints under `/api/v1/platform/reports/*` (`auth:requester`). It owns NO tables. All data is aggregated on-the-fly by looping tenants (`$tenant->run()` via PMC ExternalServices) and partners (`ResiMartConnection` via a NEW Marketplace aggregation ExternalService). One shared `ReportAggregationService::collectPlatformVendorOrders(from,to)` builds a normalized marketplace fact-set ONCE per request; each report filters/groups it differently. B2B + tenant counts read central tables directly (same module). The hub composes the other report services.

**Tech Stack:** Laravel 12, PHP 8.4, PHPUnit (SQLite `:memory:` for report-service tests), Stancl/Tenancy (schema-per-tenant), cross-DB resi_mart connection. Backend conventions: BaseController/BaseService/BaseRepository/BaseResource/BaseFormRequest, ExternalService only between top-level modules.

---

## Source specs

`docs/ba/modules/platform/bao-cao-tong-hop/` — `README.md` (foundation), `tong-quan-be.md` (#0 hub), `doanh-thu-be.md` (#1), `csat-be.md` (#2 + wiring §9), `xu-huong-dich-vu-be.md` (#3), `phan-khuc-cu-dan-be.md` (#4), `suc-khoe-tenant-du-an-be.md` (#5), `hoa-hong-phan-bo-be.md` (#6), `hieu-suat-vendor-be.md` (#7).

---

## ⚠️ Reality-check: spec assumptions vs codebase (READ FIRST)

The specs were written assuming infrastructure that does NOT fully exist. Confirmed by codebase exploration:

| Spec says | Reality | Consequence for plan |
|-----------|---------|----------------------|
| "Mở rộng `PlatformVendorOrderAggregationExternalServiceInterface` đã có" | **No such interface exists.** Platform-wide vendor logic lives inside `VendorOrderService::getSummaryPlatform/getRevenueTrendPlatform/listForPartnerPlatform` and returns **summaries only**, not per-order rows. Only `VendorOrderReportExternalServiceInterface::getCompletedOrdersForReport` exists and is **tenant-scoped**. | Phase 1 **creates** the interface (consumer side in `Platform/Report`) + **builds** the per-order fact-set impl (provider side in `Marketplace`). Heaviest task. |
| Fact-set row has `resident_rating`, `resident_rating_comment`, `resident_rated_at`, `customer_source` | **Missing on `VendorOrder`** (deferred). resi_mart order tables likely lack them too. | Phase 0 (cross-repo wiring) adds them. Until then reports degrade: `avg_rating=null`, `rated_count=0`, source-split skipped. |
| Fact-set row has `type` (product/service), `offer_title`, `first_line_title` | `VendorOrderItem.item_type` + `product_name` exist; **order-level `type` must be derived** from items. | Derive in the aggregation impl. |
| Fact-set row has `platform_fee` (marketplace) | **Not a stored column.** = the platform's commission share. | Compute = `commissionAmount` where `revenue_recipient=platform` (per `tenant-health-be §2`). |
| `CustomerExternalService` to count residents | **Does not exist.** PMC has `CustomerRepository` only (tenant-scoped). | Phase 1 creates a PMC `TenantCustomerExternalService` count method. |
| `platform.reports.view` permission | Sibling platform endpoints (`tenant-service-orders`, `business-summary`) use **`auth:requester` only**, no granular permission middleware. | Reports use `auth:requester` only. No new permission. |
| `OrganizationRepository::findAll()` to loop tenants | Exists (via BaseRepository). Add a focused `allOrganizations()` (is_organization=true) so Services never touch `Model::query()`. | Add repo method in Phase 1. |

**Confirmed-available, reuse as-is:**
- `TenantBusinessSummaryExternalServiceInterface::getMonthlyBusinessSummary(Organization $tenant, int $months, ?int $projectId=null): array` → `{summary:{tenant_revenue,order_count,platform_revenue}, months:[{month,label,order_count,tenant_revenue,platform_fee}]}`. **NOTE the key skew:** `summary.platform_revenue` vs `months[].platform_fee` — both = frozen_platform_fee. (`PMC/src/Order/ExternalServices/Platform/`)
- `VendorOrderCommissionCalculator::compute(PartnerCommissionContract $contract, float $orderTotal): array{total: float, ...}` + `RevenueRecipient` enum (`Platform`/`OperatingCompany`). (`Marketplace/src/VendorOrder/Services/` + `PartnerCommissionContract/Enums/`)
- `ResiMartConnection::runInTenantSchema(string $tenantId, callable): mixed`, `::schemaExists(string $tenantId): bool` — degrade to empty + `schema_missing` warning, never 500. (`Marketplace/src/VendorOrder/Support/`)
- `PartnerCommissionContractRepository::getCandidateContractsForPartner(int $partnerId)` (platform-scoped, all tenants) + `getCandidateContractsForLookup(...)`. Reports filter to `CommissionMode::PerOrder`.
- `PartnerRepository::allProvisionedVisibleTo(string $tenantId)` / partner list; `PartnerStatus` enum.
- `VendorOrderStatus`: `Pending|Confirmed|Completed|Cancelled` (active = not Cancelled; completed = Completed).
- `TenantServiceOrderRepository::stats()/monthlyTrend()` + `TenantServiceOrderType`/`TenantServiceOrderStatus` (Paid). (`Platform/src/TenantServiceOrder/`)
- `PlatformProjectService` (cross-tenant projects) + `TenantProjectExternalServiceInterface::getProjectsForTenant($tenant)`.
- `OrganizationRepository`, `Organization` (table `tenants`, `is_active`, `is_organization`).
- Test harness: `RequesterAccount` + `$this->actingAs($requester,'requester')`; SQLite `:memory:`; mock ExternalServices via `$this->app->instance(Interface, fake)`; tenancy bootstrappers disabled, `tenancy()->end()` in tearDown.

---

## Two test tiers (CRITICAL distinction)

1. **SQLite `:memory:` TDD (report Services + Resources + Requests):** Report services consume ExternalService **interfaces**. Tests bind FAKE implementations (`$this->app->instance(...)`) returning canned fact-sets, plus create real central rows (`Organization`, `TenantServiceOrder`). This exercises grouping/sorting/skeleton/KPI math — the bulk of report logic. **All report endpoint tests are this tier.**
2. **Postgres-dev manual verification (cross-DB plumbing):** The Marketplace aggregation **impl** (loops partners, reads resi_mart cross-DB, matches contracts) and the resi_mart migration CANNOT be SQLite-tested. They are verified on Postgres dev (`docker exec`), following the `project_vendor_tab_platform_project` precedent. Their only SQLite-testable behavior is the degrade path (no partners / schema_missing → empty + warning).

---

## Phase sequencing (làm lần lượt)

| Phase | Delivers | Test tier | Depends on |
|------|----------|-----------|-----------|
| **0. CSAT wiring (cross-repo)** | resi_mart order tables gain `resident_rating`/comment/`rated_at` + ensure `partner_id`/`project_id`/`customer_source`; Marketplace `VendorOrder` reads them. Postgres-dev verified. | Postgres-dev | resi_mart sibling repo |
| **1. Foundation** | `Platform/Report` skeleton; `PlatformVendorOrderAggregationExternalServiceInterface` (+ Marketplace impl) returning per-order rows; `ReportAggregationService` (per-request cache); PMC `TenantCustomerExternalService` count; `OrganizationRepository::allOrganizations()`; bindings; route group; degrade tests. | SQLite (degrade) + Postgres-dev (impl) | Phase 0 |
| **2. Revenue (#1)** ⟵ *fully expanded template* | `/reports/revenue`: 3-source revenue, by_b2b_type, by_tenant, analytics_months, monthly_b2b/marketplace. Adds TSO repo aggregation methods. | SQLite | Phase 1 |
| **3. Service Adoption (#3)** | `/reports/service-adoption`: offers top15, by_type, monthly, KPI. Marketplace-only. | SQLite | Phase 1 |
| **4. Commission Allocation (#6)** | `/reports/commission-allocation`: KPI split, by_recipient, by_vendor, by_project, warnings. | SQLite | Phase 1 |
| **5. Vendor Scorecard (#7)** | `/reports/vendor-scorecard`: per-partner scorecard, sortable. | SQLite | Phase 1 |
| **6. CSAT (#2)** | `/reports/csat`: KPI, star_buckets, by_vendor, by_project, low_ratings. Real ratings (Phase 0 done). | SQLite | Phase 1 (+0) |
| **7. Resident Segments (#4)** | `/reports/resident-segments`: segments, kpis, top_residents + resident count. | SQLite | Phase 1 |
| **8. Tenant Health (#5)** | `/reports/tenant-health`: by_company (mixed marketplace+PMC `order_trend`), by_project, `company_id` filter. | SQLite | Phase 1 |
| **9. Hub Overview (#0)** | `/reports/overview`: composes #1/#2/#4/#7 + tenant_count; report_cards. | SQLite | Phases 2,4,6,7 |

**Ordering rationale:** Wiring first (user decision) so the fact-set carries real ratings. Foundation next (everything depends on it). Then marketplace-only reports (cheapest, share the fact-set). CSAT after wiring is confirmed. Mixed/PMC reports later. Hub last (composes others).

**This document fully expands Phase 0 (concrete cross-repo steps), Phase 1, and Phase 2.** Phases 3–9 are specified at roadmap level (files + key logic + test focus + spec ref) and MUST be expanded to bite-sized TDD steps when each is started (re-invoke writing-plans or follow Phase 2 as the template).

---

## File Structure

```
backend/app/Modules/Platform/src/Report/                 # NEW submodule (no Model/Migration)
├── Contracts/
│   ├── PlatformVendorOrderAggregationExternalServiceInterface.php   # consumer-side interface (fact-set)
│   ├── ReportAggregationServiceInterface.php
│   ├── RevenueReportServiceInterface.php
│   ├── ServiceAdoptionReportServiceInterface.php
│   ├── CommissionAllocationReportServiceInterface.php
│   ├── VendorScorecardReportServiceInterface.php
│   ├── CsatReportServiceInterface.php
│   ├── ResidentSegmentReportServiceInterface.php
│   ├── TenantHealthReportServiceInterface.php
│   └── ReportOverviewServiceInterface.php
├── Support/
│   └── PlatformVendorOrderRow.php        # normalized fact-set row DTO (readonly)
├── Services/
│   ├── ReportAggregationService.php      # collectPlatformVendorOrders() + per-request cache
│   ├── RevenueReportService.php
│   ├── ... (one per report) ...
│   └── ReportOverviewService.php
├── Requests/
│   ├── ListRevenueReportRequest.php
│   ├── ... (one per report) ...
│   └── ListReportOverviewRequest.php
└── Controllers/                          # NO Resources/ — computed reports return response()->json directly
    ├── RevenueReportController.php
    └── ... (one per report) ...

backend/app/Modules/Marketplace/
├── src/VendorOrder/Models/VendorOrder.php                # MODIFY: map resident_rating/customer_source (Phase 0)
├── src/VendorOrder/Repositories/VendorOrderRepository.php# MODIFY: select new cols for aggregation
└── ExternalServices/Platform/
    └── PlatformVendorOrderAggregationExternalService.php # NEW: implements Platform/Report's interface (provider)

backend/app/Modules/PMC/src/Customer/ExternalServices/Platform/
├── TenantCustomerCountExternalServiceInterface.php       # NEW (consumer side could also live in Platform; see Phase 1)
└── TenantCustomerCountExternalService.php                # NEW

backend/app/Modules/Platform/src/Tenant/Repositories/OrganizationRepository.php  # MODIFY: allOrganizations()
backend/app/Modules/Platform/src/TenantServiceOrder/Repositories/TenantServiceOrderRepository.php # MODIFY (Phase 2)
backend/app/Modules/Platform/Providers/PlatformServiceProvider.php # MODIFY: bind report services + aggregation
backend/app/Modules/Platform/routes/external-api.php      # MODIFY: add reports/* routes
backend/app/Modules/Marketplace/Providers/MarketplaceServiceProvider.php # MODIFY: bind aggregation impl

backend/app/Modules/Platform/tests/Report/                # NEW test dir
├── ReportFoundationTest.php
├── RevenueReportTest.php
└── ... (one per report) ...
```

**Interface ownership (README §6):** The aggregation interface is consumed by `Platform/Report` and implemented by `Marketplace` → interface lives in the **consumer** (`Platform/Report/Contracts/`), impl in the **provider** (`Marketplace/ExternalServices/Platform/`). Same for the PMC customer-count interface (consumer = Platform/Report, but per existing PMC precedent the interface may live under `PMC/.../ExternalServices/Platform/`; follow the existing `TenantBusinessSummaryExternalServiceInterface` location convention — it lives in PMC. **Decision: put the customer-count interface in PMC alongside `TenantBusinessSummaryExternalServiceInterface` to match precedent.**)

---

# Phase 0 — CSAT resident-rating wiring (CROSS-REPO)

> **Not SQLite-testable.** This touches the sibling repo `/Users/thaibz/Desktop/projects/resi_mart` (Stancl schema-per-tenant Postgres) and is verified on Postgres dev. Follows precedent `project_vendor_tab_platform_project`. Reports work degraded (rating null) without it — but user chose to do it first so the fact-set carries real values.

**Goal:** resi_mart order tables (product order + service booking) carry `resident_rating`, `resident_rating_comment`, `resident_rated_at` (nullable) and reliably carry `partner_id`, `project_id`, `customer_source`; the Marketplace `VendorOrder` read-model maps them.

- [ ] **Step 0.1: Map the resi_mart order schema.** In `/Users/thaibz/Desktop/projects/resi_mart`, find the actual product-order and service-booking tables and their migration mechanism (Stancl tenant migrations). Record exact table + column names. Confirm whether `partner_id`, `project_id`, `customer_source` already exist (csat-be §9.1 expects they may be partial). Do NOT assume names from the spec — verify.

- [ ] **Step 0.2: Write the resi_mart tenant migration.** Add nullable columns on BOTH order tables: `resident_rating SMALLINT NULL`, `resident_rating_comment TEXT NULL`, `resident_rated_at TIMESTAMP NULL`. Add `partner_id`/`project_id`/`customer_source` only if missing. Nullable → safe for existing rows (old orders = "chưa đánh giá"). App-side rating capture (storefront UI) is OUT OF SCOPE — only the schema must be ready to READ.

- [ ] **Step 0.3: Run + verify on Postgres dev.** Run resi_mart's tenant migration across tenant schemas on Postgres dev. Verify columns exist on a sample tenant schema. Confirm no data loss on existing orders.

- [ ] **Step 0.4: Map new columns in Marketplace `VendorOrder` read-model.** In `backend/app/Modules/Marketplace/src/VendorOrder/Models/VendorOrder.php` add the rating columns to the property docblock / casts (`resident_rating` int, `resident_rated_at` datetime). In `VendorOrderRepository::allInRangeForCommission()` (and any method the aggregation will use) SELECT the new columns + `customer_source`. Read-model stays read-only (save/delete already throw). Handle the pre-migration case: if a column is absent the query must not 500 — rely on `ResiMartConnection` schema_missing guard and, if needed, a try/catch that returns nulls.

- [ ] **Step 0.5: Postgres-dev smoke check.** With Phase 1's aggregation impl in place (this step is revisited after Phase 1), confirm `collectPlatformVendorOrders` returns real `resident_rating`/`customer_source` for a tenant that has rated orders. Until then, document that values are null. **No SQLite test for this phase** — note it in the Phase 0 commit message.

- [ ] **Step 0.6: Commit (both repos).** Commit resi_mart migration in the resi_mart repo; commit Marketplace read-model changes here. Cross-reference the two commits in their messages.

```bash
# in residential-management
git add backend/app/Modules/Marketplace/src/VendorOrder/Models/VendorOrder.php \
        backend/app/Modules/Marketplace/src/VendorOrder/Repositories/VendorOrderRepository.php
git commit -m "feat(marketplace): read resident_rating + customer_source from resi_mart vendor orders"
```

---

# Phase 1 — Foundation (submodule + shared fact-set + ReportAggregationService)

**Goal:** Stand up the `Platform/Report` submodule, the marketplace per-order fact-set (interface in Report, impl in Marketplace), the per-request-cached `ReportAggregationService`, the PMC resident-count ExternalService, the tenant-loop repo method, all bindings, and the route group — with degrade-path tests on SQLite.

### Task 1.1: Fact-set row DTO

**Files:**
- Create: `backend/app/Modules/Platform/src/Report/Support/PlatformVendorOrderRow.php`

- [ ] **Step 1: Create the readonly DTO** (normalized row, README §3.4). Every report reads from this shape.

```php
<?php

namespace App\Modules\Platform\Report\Support;

/**
 * Normalized platform-wide marketplace order row (fact-set).
 * Built once per request by ReportAggregationService::collectPlatformVendorOrders().
 * Rating/customer_source are null until Phase 0 wiring lands.
 */
final readonly class PlatformVendorOrderRow
{
    public function __construct(
        public int $orderId,
        public int $partnerId,
        public string $partnerName,
        public ?int $projectId,
        public ?string $projectName,
        public ?string $organizationId,     // PMC operator slug (company)
        public ?int $residentId,
        public ?string $residentName,
        public ?string $customerSource,     // 'project' | 'walk_in' | null (pre-wiring)
        public string $type,                // 'product' | 'service'
        public ?string $offerTitle,
        public int $amount,                 // GMV, integer VND
        public int $commissionAmount,       // integer VND
        public string $recipient,           // RevenueRecipient value
        public int $platformShare,          // commissionAmount if recipient=platform else 0
        public int $vhShare,                // commissionAmount if recipient=operating_company else 0
        public string $status,              // VendorOrderStatus value
        public ?int $residentRating,        // 1-5 or null
        public ?string $residentRatingComment,
        public string $createdAt,           // ISO date
    ) {}

    public function isActive(): bool
    {
        return $this->status !== 'cancelled';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add backend/app/Modules/Platform/src/Report/Support/PlatformVendorOrderRow.php
git commit -m "feat(platform-report): add PlatformVendorOrderRow fact-set DTO"
```

### Task 1.2: Aggregation ExternalService interface (consumer side)

**Files:**
- Create: `backend/app/Modules/Platform/src/Report/Contracts/PlatformVendorOrderAggregationExternalServiceInterface.php`

- [ ] **Step 1: Create the interface.** Returns rows + warnings; degrade contract documented.

```php
<?php

namespace App\Modules\Platform\Report\Contracts;

use Carbon\CarbonInterface;

interface PlatformVendorOrderAggregationExternalServiceInterface
{
    /**
     * Platform-wide marketplace orders for [from, to], one normalized row per order,
     * across ALL partners. Loops partners + ResiMartConnection internally.
     * Degrades to empty rows + warnings (schema_missing) — never throws to caller.
     *
     * @return array{
     *     rows: list<\App\Modules\Platform\Report\Support\PlatformVendorOrderRow>,
     *     warnings: array{schema_missing: bool, skipped_orders: int}
     * }
     */
    public function collectOrders(CarbonInterface $from, CarbonInterface $to): array;
}
```

- [ ] **Step 2: Commit**

```bash
git add backend/app/Modules/Platform/src/Report/Contracts/PlatformVendorOrderAggregationExternalServiceInterface.php
git commit -m "feat(platform-report): declare marketplace aggregation ExternalService interface"
```

### Task 1.3: Aggregation impl (provider side, Marketplace) — Postgres-dev verified

**Files:**
- Create: `backend/app/Modules/Marketplace/ExternalServices/Platform/PlatformVendorOrderAggregationExternalService.php`
- Modify: `backend/app/Modules/Marketplace/Providers/MarketplaceServiceProvider.php` (bind)
- Test: `backend/app/Modules/Platform/tests/Report/ReportFoundationTest.php` (degrade path only)

- [ ] **Step 1: Write the degrade-path test** (the only SQLite-testable behavior of the impl: no partners → empty + no schema_missing). Bind the real impl, ensure no resi_mart access.

```php
public function test_aggregation_returns_empty_when_no_partners(): void
{
    // No Partner rows created → loop body never runs → empty rows, no schema errors.
    $service = app(PlatformVendorOrderAggregationExternalServiceInterface::class);
    $result = $service->collectOrders(now()->startOfMonth()->subMonths(5), now()->endOfMonth());

    $this->assertSame([], $result['rows']);
    $this->assertFalse($result['warnings']['schema_missing']);
    $this->assertSame(0, $result['warnings']['skipped_orders']);
}
```

- [ ] **Step 2: Run test, expect fail** (`Target [PlatformVendorOrderAggregationExternalServiceInterface] is not instantiable` / binding missing).

Run: `docker exec residential_app php artisan test --compact --filter=test_aggregation_returns_empty_when_no_partners`

- [ ] **Step 3: Implement the impl.** Mirror `VendorOrderService::getSummaryPlatform` looping pattern but emit per-order rows. Reuse `PartnerRepository`, `PartnerCommissionContractRepository::getCandidateContractsForPartner`, `VendorOrderCommissionCalculator`, `ResiMartConnection`, `VendorOrderRepository::allInRangeForCommission`. Inject these via constructor (Marketplace-internal — direct, no ExternalService). Derive: `type` from items' `item_type`; `offerTitle`/resident name from items/customer; `platformShare`/`vhShare` from contract `revenue_recipient`; `commissionAmount` from calculator (`CommissionMode::PerOrder` only — others → `warnings.skipped_orders++`, not summed). Map `resident_rating`/`customer_source` (null pre-Phase-0). Skip partners with null `tenant_id` or `!schemaExists` (set `schema_missing=true` only if a partner had a tenant_id but schema absent — match existing convention).

```php
<?php

namespace App\Modules\Marketplace\ExternalServices\Platform;

use App\Modules\Platform\Report\Contracts\PlatformVendorOrderAggregationExternalServiceInterface;
use App\Modules\Platform\Report\Support\PlatformVendorOrderRow;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\CommissionMode;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\RevenueRecipient;
use App\Modules\Marketplace\PartnerCommissionContract\Repositories\PartnerCommissionContractRepository;
use App\Modules\Marketplace\Partner\Repositories\PartnerRepository;
use App\Modules\Marketplace\VendorOrder\Repositories\VendorOrderRepository;
use App\Modules\Marketplace\VendorOrder\Services\VendorOrderCommissionCalculator;
use App\Modules\Marketplace\VendorOrder\Support\ResiMartConnection;
use Carbon\CarbonInterface;

class PlatformVendorOrderAggregationExternalService implements PlatformVendorOrderAggregationExternalServiceInterface
{
    public function __construct(
        protected PartnerRepository $partnerRepository,
        protected PartnerCommissionContractRepository $contractRepository,
        protected VendorOrderRepository $orderRepository,
        protected VendorOrderCommissionCalculator $calculator,
    ) {}

    public function collectOrders(CarbonInterface $from, CarbonInterface $to): array
    {
        $rows = [];
        $schemaMissing = false;
        $skipped = 0;

        // NOTE: confirm the correct "all partners" repo method when coding
        // (PartnerRepository — list all provisioned partners platform-wide).
        foreach ($this->partnerRepository->allPlatformPartners() as $partner) {
            if ($partner->tenant_id === null) {
                continue;
            }
            if (! ResiMartConnection::schemaExists($partner->tenant_id)) {
                $schemaMissing = true;
                continue;
            }

            $contracts = $this->contractRepository->getCandidateContractsForPartner($partner->id);

            $orders = ResiMartConnection::runInTenantSchema(
                $partner->tenant_id,
                fn () => $this->orderRepository->allInRangeForAggregation($from, $to), // NEW repo method, see 1.3a
            );

            foreach ($orders as $order) {
                // match active per-order contract for ($partner, project, completed/ordered date)
                // compute commission via $this->calculator->compute($contract, (float) $order->total)['total']
                // if no per-order contract → $skipped++ ; continue (don't sum)
                // recipient = $contract->revenue_recipient->value
                // build PlatformVendorOrderRow(...) and append to $rows
            }
        }

        return [
            'rows' => $rows,
            'warnings' => ['schema_missing' => $schemaMissing, 'skipped_orders' => $skipped],
        ];
    }
}
```

> The inner matching loop mirrors `VendorOrderService::getSummaryPlatform` (lines ~768–868). Copy that contract-matching logic exactly; emit a row per order instead of accumulating a summary. **Confirm** the partner-listing repo method name and add `allInRangeForAggregation` (Task 1.3a) returning orders with items + customer + new cols.

- [ ] **Step 1.3a: Add `VendorOrderRepository::allInRangeForAggregation`** selecting `id, project_id, tenant_id, customer_id, status, total, completed_at, ordered_at, created_at, resident_rating, resident_rating_comment, customer_source` + eager-load `items` (for `item_type`/`product_name`) + `customer` (for resident name/id). Read-only.

- [ ] **Step 4: Bind in MarketplaceServiceProvider**

```php
$this->app->bind(
    \App\Modules\Platform\Report\Contracts\PlatformVendorOrderAggregationExternalServiceInterface::class,
    \App\Modules\Marketplace\ExternalServices\Platform\PlatformVendorOrderAggregationExternalService::class,
);
```

- [ ] **Step 5: Run degrade test, expect pass.**

Run: `docker exec residential_app php artisan test --compact --filter=test_aggregation_returns_empty_when_no_partners`
Expected: PASS

- [ ] **Step 6: Postgres-dev verification (manual, not committed as test).** On Postgres dev, hit a scenario with a real partner + resi_mart orders and confirm `collectOrders` returns populated rows with correct commission split. Document the result.

- [ ] **Step 7: `make format` → `make lint`, then commit**

```bash
docker exec residential_app bash -lc "cd backend && make format && make lint"
git add backend/app/Modules/Marketplace/ ...
git commit -m "feat(marketplace): platform-wide per-order aggregation ExternalService for reports"
```

### Task 1.4: ReportAggregationService (per-request fact-set cache)

**Files:**
- Create: `backend/app/Modules/Platform/src/Report/Contracts/ReportAggregationServiceInterface.php`
- Create: `backend/app/Modules/Platform/src/Report/Services/ReportAggregationService.php`
- Test: `backend/app/Modules/Platform/tests/Report/ReportFoundationTest.php`

- [ ] **Step 1: Write test** — `collectPlatformVendorOrders` calls the aggregation ExternalService once and caches by `[from,to]` key (README §3.4 "tránh loop resi_mart lại"). Use a fake aggregation that increments a call counter.

```php
public function test_aggregation_service_caches_factset_per_window(): void
{
    $calls = 0;
    $this->app->instance(
        PlatformVendorOrderAggregationExternalServiceInterface::class,
        new class($calls) implements PlatformVendorOrderAggregationExternalServiceInterface {
            public function __construct(public int &$calls) {}
            public function collectOrders($from, $to): array
            {
                $this->calls++;
                return ['rows' => [], 'warnings' => ['schema_missing' => false, 'skipped_orders' => 0]];
            }
        }
    );

    $svc = app(ReportAggregationServiceInterface::class);
    $from = now()->startOfMonth()->subMonths(5);
    $to = now()->endOfMonth();
    $svc->collectPlatformVendorOrders($from, $to);
    $svc->collectPlatformVendorOrders($from, $to); // same window → cached

    $this->assertSame(1, $calls);
}
```

- [ ] **Step 2: Run, expect fail** (binding missing).

- [ ] **Step 3: Implement** — interface + service caching by `from->toDateString().'|'.to->toDateString()`.

```php
<?php
namespace App\Modules\Platform\Report\Services;

use App\Modules\Platform\Report\Contracts\PlatformVendorOrderAggregationExternalServiceInterface;
use App\Modules\Platform\Report\Contracts\ReportAggregationServiceInterface;
use Carbon\CarbonInterface;

class ReportAggregationService implements ReportAggregationServiceInterface
{
    /** @var array<string, array{rows: array, warnings: array}> */
    private array $cache = [];

    public function __construct(
        protected PlatformVendorOrderAggregationExternalServiceInterface $aggregation,
    ) {}

    public function collectPlatformVendorOrders(CarbonInterface $from, CarbonInterface $to): array
    {
        $key = $from->toDateString().'|'.$to->toDateString();

        return $this->cache[$key] ??= $this->aggregation->collectOrders($from, $to);
    }
}
```

Interface declares `collectPlatformVendorOrders(CarbonInterface $from, CarbonInterface $to): array` with the same `{rows, warnings}` PHPDoc shape as Task 1.2.

- [ ] **Step 4: Bind in PlatformServiceProvider** (`ReportAggregationServiceInterface` → `ReportAggregationService`). Register as a singleton-per-request is unnecessary (Laravel rebuilds per request); plain bind is fine since cache is instance-scoped and the Report controllers resolve it once.

> **Caveat to document:** Because `bind` returns a fresh instance per `app()` call, the per-request cache only helps if the SAME instance is reused. Inject `ReportAggregationServiceInterface` into each report service via constructor so the container shares one instance within a single resolution tree — OR register it `scoped()`. **Use `$this->app->scoped(...)`** so all report services in one request share the cached fact-set.

- [ ] **Step 5: Run test, expect pass. Commit.**

### Task 1.5: PMC resident-count ExternalService

**Files:**
- Create: `backend/app/Modules/PMC/src/Customer/ExternalServices/Platform/TenantCustomerCountExternalServiceInterface.php`
- Create: `backend/app/Modules/PMC/src/Customer/ExternalServices/Platform/TenantCustomerCountExternalService.php`
- Modify: PMC ServiceProvider (bind) + `CustomerRepository` (add `countAll()` if absent)
- Test: foundation test (degrade: no tenants → 0)

- [ ] **Step 1: Write test** — `countAllResidents()` across tenants returns 0 when no organizations exist (loop body never runs).

```php
public function test_resident_count_zero_when_no_tenants(): void
{
    $svc = app(TenantCustomerCountExternalServiceInterface::class);
    $this->assertSame(0, $svc->countAllResidents());
}
```

- [ ] **Step 2: Run, expect fail.**

- [ ] **Step 3: Implement.** Interface: `countAllResidents(): int` and `countResidentsForTenant(Organization $tenant): int`. Impl loops `OrganizationRepository::allOrganizations()` (Task 1.6) + `$tenant->run(fn () => $this->customerRepository->countAll())`. Add `CustomerRepository::countAll(): int` (`$this->newQuery()->count()`) — never `Model::query()` in the ExternalService.

- [ ] **Step 4: Bind in PMC ServiceProvider. Run test, expect pass. Commit.**

> **Test caveat:** Under SQLite with bootstrappers disabled, `$tenant->run()` does NOT switch schema — it runs against the shared `:memory:` DB. For the degrade test (no tenants) this is fine. For reports that need real per-tenant counts, tests **mock this ExternalService** (Task pattern in every report). Document this.

### Task 1.6: OrganizationRepository::allOrganizations()

**Files:**
- Modify: `backend/app/Modules/Platform/src/Tenant/Repositories/OrganizationRepository.php`

- [ ] **Step 1: Write test** — returns only `is_organization=true` rows.

```php
public function test_all_organizations_returns_only_orgs(): void
{
    Organization::withoutEvents(fn () => Organization::factory()->create(['id' => 'vh-a', 'is_organization' => true]));
    Organization::withoutEvents(fn () => Organization::factory()->create(['id' => 'mart-x', 'is_organization' => false]));

    $repo = app(OrganizationRepository::class);
    $ids = $repo->allOrganizations()->pluck('id')->all();

    $this->assertcontains('vh-a', $ids);
    $this->assertNotContains('mart-x', $ids);
}
```

- [ ] **Step 2: Run, expect fail. Step 3: Implement.**

```php
/** @return \Illuminate\Support\Collection<int, \App\Modules\Platform\Tenant\Models\Organization> */
public function allOrganizations(): \Illuminate\Support\Collection
{
    return $this->newQuery()->where('is_organization', true)->get();
}
```

- [ ] **Step 4: Run, expect pass. Commit.**

### Task 1.7: Route group + submodule wiring smoke

**Files:**
- Modify: `backend/app/Modules/Platform/routes/external-api.php` (add a placeholder route after line 82, before the closing `});`)

- [ ] **Step 1:** Add the reports route block inside the existing `auth:requester` group (will be filled per report):

```php
// Báo cáo tổng hợp (read-only)
Route::get('reports/revenue', [\App\Modules\Platform\Report\Controllers\RevenueReportController::class, 'index']);
// reports/service-adoption, /commission-allocation, /vendor-scorecard, /csat,
// /resident-segments, /tenant-health, /overview added in their phases
```

> Add each route in its own phase to keep commits scoped. Phase 1 adds none until Phase 2's controller exists — OR add `reports/revenue` here and implement in Phase 2. **Decision: routes are added in the report's own phase.** Phase 1 only confirms the group compiles.

- [ ] **Step 2: Foundation phase done — run the whole foundation test file.**

Run: `docker exec residential_app php artisan test --compact --filter=ReportFoundationTest`
Expected: all PASS

- [ ] **Step 3: `make format` → `make lint`. Commit.**

```bash
git commit -m "feat(platform-report): foundation — fact-set aggregation, ReportAggregationService, resident count, tenant loop"
```

---

# Phase 2 — Báo cáo Doanh thu (#1)  ⟵ fully-expanded template

> Spec: `doanh-thu-be.md`. **3-source revenue** = B2B paid + marketplace commission(recipient=platform) + PMC frozen_platform_fee. Reads all 3 domains, NEVER mixing per-KPI (README §3.2).

### Task 2.1: TenantServiceOrder repository aggregation methods

**Files:**
- Modify: `backend/app/Modules/Platform/src/TenantServiceOrder/Repositories/TenantServiceOrderRepository.php`
- Test: `backend/app/Modules/Platform/tests/Report/RevenueReportTest.php`

- [ ] **Step 1: Write tests** for three new repo methods (paid sum in window; by type; by organization).

```php
public function test_paid_revenue_in_window_sums_only_paid(): void
{
    $this->makeTenant('vh-a');
    TenantServiceOrder::factory()->paid()->create(['organization_id' => 'vh-a', 'amount' => 1_000_000, 'created_at' => now()]);
    TenantServiceOrder::factory()->create(['organization_id' => 'vh-a', 'amount' => 9_000_000, 'status' => 'draft', 'created_at' => now()]);

    $repo = app(TenantServiceOrderRepository::class);
    $sum = $repo->sumPaidInWindow(now()->startOfMonth()->subMonths(5), now()->endOfMonth());

    $this->assertSame(1_000_000, $sum); // integer VND
}

public function test_paid_revenue_grouped_by_type(): void
{
    $this->makeTenant('vh-a');
    TenantServiceOrder::factory()->paid()->create(['organization_id' => 'vh-a', 'order_type' => 'subscription', 'amount' => 800_000, 'created_at' => now()]);
    TenantServiceOrder::factory()->paid()->create(['organization_id' => 'vh-a', 'order_type' => 'setup', 'amount' => 250_000, 'created_at' => now()]);

    $repo = app(TenantServiceOrderRepository::class);
    $byType = $repo->paidByTypeInWindow(now()->startOfMonth()->subMonths(5), now()->endOfMonth());

    $this->assertSame(800_000, $byType['subscription']['revenue']);
    $this->assertSame(1, $byType['subscription']['count']);
}

public function test_paid_revenue_grouped_by_organization(): void
{
    $this->makeTenant('vh-a'); $this->makeTenant('vh-b');
    TenantServiceOrder::factory()->paid()->create(['organization_id' => 'vh-a', 'amount' => 480_000, 'created_at' => now()]);
    TenantServiceOrder::factory()->paid()->create(['organization_id' => 'vh-b', 'amount' => 120_000, 'created_at' => now()]);

    $repo = app(TenantServiceOrderRepository::class);
    $byOrg = $repo->paidByOrganizationInWindow(now()->startOfMonth()->subMonths(5), now()->endOfMonth());

    $this->assertSame(480_000, $byOrg['vh-a']);
}
```

- [ ] **Step 2: Run, expect fail.** Run: `docker exec residential_app php artisan test --compact --filter=RevenueReportTest`

- [ ] **Step 3: Implement the three methods** (return integer VND via `(int) round(...)`; filter `status=Paid`, `created_at` in window).

```php
public function sumPaidInWindow(CarbonInterface $from, CarbonInterface $to, ?string $organizationId = null): int
{
    $q = $this->newQuery()
        ->where('status', TenantServiceOrderStatus::Paid->value)
        ->whereBetween('created_at', [$from, $to]);
    if ($organizationId !== null) { $q->where('organization_id', $organizationId); }

    return (int) round((float) $q->sum('amount'));
}

/** @return array<string, array{count:int, revenue:int}> keyed by order_type value */
public function paidByTypeInWindow(CarbonInterface $from, CarbonInterface $to): array
{
    $rows = $this->newQuery()
        ->selectRaw('order_type, COUNT(*) as c, SUM(amount) as r')
        ->where('status', TenantServiceOrderStatus::Paid->value)
        ->whereBetween('created_at', [$from, $to])
        ->groupBy('order_type')->get();

    $out = [];
    foreach ($rows as $row) {
        $out[$row->order_type] = ['count' => (int) $row->c, 'revenue' => (int) round((float) $row->r)];
    }
    return $out;
}

/** @return array<string, int> keyed by organization_id → paid revenue */
public function paidByOrganizationInWindow(CarbonInterface $from, CarbonInterface $to): array
{
    $rows = $this->newQuery()
        ->selectRaw('organization_id, SUM(amount) as r')
        ->where('status', TenantServiceOrderStatus::Paid->value)
        ->whereBetween('created_at', [$from, $to])
        ->groupBy('organization_id')->get();

    $out = [];
    foreach ($rows as $row) { $out[$row->organization_id] = (int) round((float) $row->r); }
    return $out;
}
```

> Also add `paidCountInWindow()` and `monthlyPaidInWindow()` (for `b2b_paid_count` and `monthly_b2b`) following the same shape — write a test for each first.

- [ ] **Step 4: Run, expect pass. Commit.**

### Task 2.2: ListRevenueReportRequest

**Files:**
- Create: `backend/app/Modules/Platform/src/Report/Requests/ListRevenueReportRequest.php`
- Test: in `RevenueReportTest.php`

- [ ] **Step 1: Write test** — `months` out of 1–12 → 422; default applied when omitted.

```php
public function test_months_out_of_range_returns_422(): void
{
    $this->actingAsRequester()->getJson('/api/v1/platform/reports/revenue?months=13')
        ->assertStatus(422)->assertJsonValidationErrors(['months']);
}
```

- [ ] **Step 2: Run, expect fail** (route/controller missing → 404 first; that's fine, it proves the endpoint isn't wired yet — proceed to build it; the 422 assertion passes once 2.4 wires it).

- [ ] **Step 3: Implement the request** (extends `BaseFormRequest`, Vietnamese message).

```php
<?php
namespace App\Modules\Platform\Report\Requests;

use App\Common\Requests\BaseFormRequest;

class ListRevenueReportRequest extends BaseFormRequest
{
    /** @return array<string, mixed> */
    public function rules(): array
    {
        return ['months' => ['nullable', 'integer', 'min:1', 'max:12']];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return ['months.min' => 'Số tháng phải từ 1 đến 12.', 'months.max' => 'Số tháng phải từ 1 đến 12.'];
    }

    public function months(): int
    {
        return (int) ($this->validated()['months'] ?? 6);
    }
}
```

- [ ] **Step 4: (defer pass until controller wired in 2.4).**

### Task 2.3: RevenueReportService (+ interface)

**Files:**
- Create: `backend/app/Modules/Platform/src/Report/Contracts/RevenueReportServiceInterface.php`
- Create: `backend/app/Modules/Platform/src/Report/Services/RevenueReportService.php`
- Test: `RevenueReportTest.php`

- [ ] **Step 1: Write the service test** with FAKED ExternalServices (aggregation + business-summary). Assert `total_platform_revenue = b2b + marketplace_platform_fee + pmc_platform_fee`, the 3 sources are correct, `by_b2b_type`/`by_tenant`/`analytics_months` shapes, months skeleton zero-filled, empty → zeros.

```php
public function test_total_revenue_sums_three_sources(): void
{
    $this->makeTenant('vh-a');
    // B2B: 1,000,000 paid
    TenantServiceOrder::factory()->paid()->create(['organization_id' => 'vh-a', 'amount' => 1_000_000, 'created_at' => now()]);

    // Marketplace fact-set: one platform-recipient commission of 700,000
    $this->fakeAggregation([
        $this->row(['recipient' => 'platform', 'platformShare' => 700_000, 'vhShare' => 0, 'commissionAmount' => 700_000, 'amount' => 9_600_000]),
    ]);

    // PMC business-summary: frozen_platform_fee total 2,870,000 across months
    $this->fakeBusinessSummary('vh-a', summaryPlatformRevenue: 2_870_000, months: [
        ['month' => now()->format('Y-m'), 'label' => 'T'.now()->format('n').'/'.now()->format('Y'),
         'order_count' => 5, 'tenant_revenue' => 6_030_000, 'platform_fee' => 2_870_000],
    ]);

    $data = app(RevenueReportServiceInterface::class)->build(['months' => 6]);

    $this->assertSame(1_000_000 + 700_000 + 2_870_000, $data['kpis']['total_platform_revenue']);
    $this->assertSame(1_000_000, $data['kpis']['b2b_revenue']);
    $this->assertSame(700_000, $data['kpis']['marketplace_platform_fee']);
    $this->assertSame(2_870_000, $data['kpis']['pmc_platform_fee']);
}
```

(Helpers `fakeAggregation(array $rows)`, `fakeBusinessSummary(...)`, `row(array $overrides): PlatformVendorOrderRow`, `makeTenant`, `actingAsRequester` live in a `RevenueReportTest` base or trait — define them in this file. `fakeAggregation` binds `PlatformVendorOrderAggregationExternalServiceInterface` to an anon class returning `{rows, warnings}`. `fakeBusinessSummary` binds `TenantBusinessSummaryExternalServiceInterface` to an anon class returning the `{summary, months}` shape per tenant id.)

- [ ] **Step 2: Run, expect fail.**

- [ ] **Step 3: Implement the service.** Compute window from `months` (start of `now-months+1` to end of current month). Read B2B via `TenantServiceOrderRepository`; marketplace via `ReportAggregationService::collectPlatformVendorOrders` (filter active; sum `platformShare`/`vhShare`/`amount`/count); PMC by looping `OrganizationRepository::allOrganizations()` + `TenantBusinessSummaryExternalService::getMonthlyBusinessSummary` ONCE per tenant, summing `summary.platform_revenue` for `pmc_platform_fee` and accumulating `months[]` (map `platform_fee`→`platform_revenue`) into `analytics_months` keyed by `month`. Build `by_tenant` from the same per-tenant pass + `paidByOrganizationInWindow`. Build `by_b2b_type` from `paidByTypeInWindow` (label via `TenantServiceOrderType::from($key)->label()`). Build `monthly_b2b` from `monthlyPaidInWindow`; `monthly_marketplace` from fact-set grouped by month. All money integer. Sort `by_tenant` desc by `total_platform_revenue`. Skeleton: build N-month array first, fill 0.

> Interface: `build(array $filters): array`. The service does NOT extend BaseService transaction logic (read-only, no writes) — but DO implement the interface and bind it.

- [ ] **Step 4: Run service tests, expect pass.** Add tests: empty tenants/partners → all KPI 0 + arrays []/skeleton-zeros; `analytics_months` length == months and is PMC (not marketplace); `by_tenant` sort desc + `b2b_revenue` per tenant; `by_b2b_type` grouping. Run each red→green.

- [ ] **Step 5: Commit.**

### Task 2.4: RevenueReportResource + Controller + route

**Files:**
- Create: `backend/app/Modules/Platform/src/Report/Resources/RevenueReportResource.php`
- Create: `backend/app/Modules/Platform/src/Report/Controllers/RevenueReportController.php`
- Modify: `backend/app/Modules/Platform/routes/external-api.php` (add `reports/revenue`)
- Modify: `PlatformServiceProvider` (bind `RevenueReportServiceInterface`)
- Test: `RevenueReportTest.php` (HTTP-level)

- [ ] **Step 1: Write HTTP test** — full endpoint shape matches `doanh-thu-be.md §6` (snake_case keys, enum `{value,label}`, integer money). Reuse fakes from 2.3.

```php
public function test_revenue_endpoint_returns_full_shape(): void
{
    $this->makeTenant('vh-a');
    TenantServiceOrder::factory()->paid()->create(['organization_id' => 'vh-a', 'order_type' => 'subscription', 'amount' => 880_000, 'created_at' => now()]);
    $this->fakeAggregation([]);
    $this->fakeBusinessSummary('vh-a', summaryPlatformRevenue: 0, months: []);

    $this->actingAsRequester()->getJson('/api/v1/platform/reports/revenue?months=6')
        ->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.kpis.b2b_revenue', 880_000)
        ->assertJsonPath('data.by_b2b_type.0.type.value', 'subscription')
        ->assertJsonPath('data.by_b2b_type.0.type.label', 'Gói đăng ký')
        ->assertJsonCount(6, 'data.analytics_months');
}
```

- [ ] **Step 2: Run, expect fail** (404 route).

- [ ] **Step 3: Implement Resource** — since the report returns a plain assembled array (not an Eloquent model), the Controller can return `response()->json(['success' => true, 'data' => $data])` directly (matches `OrganizationController::stats` precedent) OR wrap in a `BaseResource`. **Decision: return `response()->json(['success'=>true,'data'=>$service->build(...)])`** to match the sibling `stats`/`trend` precedent — no Resource class needed for these computed reports. (Skip the Resource file; the service builds the exact snake_case shape.)

```php
<?php
namespace App\Modules\Platform\Report\Controllers;

use App\Common\Controllers\BaseController;
use App\Modules\Platform\Report\Contracts\RevenueReportServiceInterface;
use App\Modules\Platform\Report\Requests\ListRevenueReportRequest;
use Illuminate\Http\JsonResponse;

/** @tags Platform Reports */
class RevenueReportController extends BaseController
{
    public function __construct(protected RevenueReportServiceInterface $service) {}

    /** Báo cáo doanh thu platform (3 nguồn). */
    public function index(ListRevenueReportRequest $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->service->build($request->validated()),
        ]);
    }
}
```

> **Update File Structure note:** Resource classes are NOT used for these computed reports — the service returns the final snake_case array and the controller wraps it in `response()->json`. This matches `OrganizationController::stats` / `TenantServiceOrderController::trend`. Remove `Resources/` from the plan for all report phases.

- [ ] **Step 4: Add route + bind service + run all RevenueReportTest, expect pass.**

- [ ] **Step 5: `make format` → `make lint`. Commit.**

```bash
git commit -m "feat(platform-report): revenue report endpoint (3-source revenue, by_b2b_type, by_tenant, trends)"
```

### Task 2.5: Self-review Phase 2 against `doanh-thu-be.md`

- [ ] Verify every §4/§5/§6 item maps to a test: 3-source sum, B2B paid-only, recipient split, PMC frozen-fee, no-mix, by_tenant sort desc, skeleton zero-fill, empty→0, months are PMC not marketplace. Add any missing test.

---

# Phases 3–9 — Roadmap-level specs (expand to bite-sized when started)

> Each phase = a `{Report}Service` (+ interface) consuming `ReportAggregationService` and/or the PMC/Platform deps, a `List{Report}ReportRequest`, a thin Controller returning `response()->json(['success'=>true,'data'=>...])`, a route line, a ServiceProvider bind, and a `{Report}ReportTest` (SQLite, fakes ExternalServices). NO Resource class, NO Model, NO migration. Follow Phase 2's task shape exactly. **Confirm marketplace status/enum maps and `customer_source`/`type` derivation against `VendorOrder` when coding.**

### Phase 3 — Service Adoption (#3) · `xu-huong-dich-vu-be.md`
- **Endpoint:** `GET /reports/service-adoption` · `ListServiceAdoptionReportRequest` (`months` 1–12).
- **Service logic:** fact-set → filter active → offer key `partnerId:type:title` (product→first item name, service→offerTitle) → `offers` top15 by order_count; `by_type` (product/service: order_count+gmv); `kpis`(total_offers, top_offer, product_share/service_share by ORDER COUNT, rounded int); `monthly` N-month skeleton (order_count/product_count/service_count/gmv).
- **Test focus:** active-only; offer grouping & top15 cut & sort; shares by order count rounded; skeleton zero-fill; empty→0/top_offer null; 422.
- **Deps:** aggregation only. No rating, no PMC.

### Phase 4 — Commission Allocation (#6) · `hoa-hong-phan-bo-be.md`
- **Endpoint:** `GET /reports/commission-allocation` · `ListCommissionAllocationReportRequest`.
- **Service logic:** fact-set active → `kpis`(commission_total, platform_total, vh_total, platform_share_pct, vh_share_pct=100−platform when total>0); `by_recipient` (platform = 1 row + each VH `organizationId` a row; label via `OrganizationRepository`; sort desc amount); `by_vendor` (sort desc commission; platform_share+vh_share=commission); `by_project` (sort desc platform_share; project_name via `PlatformProjectService`). `warnings.skipped_orders` from fact-set (orphan/non-per-order).
- **Test focus:** `commission_total = platform_total + vh_total`; pct sums 100; recipient split correctness; by_recipient platform-single-row; warnings passthrough; empty→0; 422.
- **Deps:** aggregation + `OrganizationRepository` (VH names) + `PlatformProjectService` (project names).

### Phase 5 — Vendor Scorecard (#7) · `hieu-suat-vendor-be.md`
- **Endpoint:** `GET /reports/vendor-scorecard` · `ListVendorScorecardReportRequest` (`months` + `sort` whitelist `Rule::in(['gmv','order_count','commission','platform_fee','completion_rate','cancel_rate','avg_rating'])`).
- **Service logic:** fact-set → group by partner_id → per-vendor: order_count(all), active_count, completed_count, cancel_count, completion_rate/cancel_rate (round int over orderCount), gmv/commission/platform_fee (active only), avg_rating/rated_count (nullable), product_count/service_count. Filter `order_count>0`. Sort desc by `sort` (default gmv). Vendor name/status from `PartnerRepository`/`PartnerStatus`.
- **Test focus:** sort desc gmv default + each sort field; only vendors with orders; gmv/fee on active only; rates rounded; rating null pre-data; empty→`vendors:[]`; `months`/`sort` out → 422.
- **Deps:** aggregation + Partner list (name/status). Output `months` echoed.

### Phase 6 — CSAT (#2) · `csat-be.md`
- **Endpoint:** `GET /reports/csat` · `ListCsatReportRequest` (`from`/`to`/`months`; from/to wins; `to>=from`).
- **Service logic:** fact-set → `kpis`(avg_rating null if rated=0, rated_count, total_orders, completion_rate, cancel_rate, response_rate — rounded int); `star_buckets` fixed 5→1 counts; `by_vendor` (order/completed/cancel/avg_rating/rated; sort avg desc, null last); `by_project` (avg desc null last); `low_ratings` rating≤3 top10 sort rating asc. `warnings.schema_missing` passthrough.
- **Test focus:** avg/response/completion/cancel correctness; star buckets; null-last sorting; low_ratings top10 asc; rating null counts in total but not avg; empty→0/`[]`; schema_missing→warning not 500; 422.
- **Deps:** aggregation (rating from Phase 0) + Partner names.

### Phase 7 — Resident Segments (#4) · `phan-khuc-cu-dan-be.md`
- **Endpoint:** `GET /reports/resident-segments` · `ListResidentSegmentReportRequest` (`months`).
- **Service logic:** fact-set active → `segments` by customer_source (project/walk_in: order_count, gmv, avg_rating, rated_count); `kpis`(active_residents=distinct residentId, total_residents=`TenantCustomerCountExternalService::countAllResidents()`, project/walk_in order_share %, project/walk_in gmv); `top_residents` group by residentId, sort desc order_count, top10. Source `{value,label}`.
- **Test focus:** distinct active residents; share rounding & no /0; total from customer count; CSAT null pre-wiring; top10 sort; empty→0; 422; active_residents ≤ total_residents.
- **Deps:** aggregation + PMC customer count (Task 1.5). **Test caveat:** mock `TenantCustomerCountExternalServiceInterface`.

### Phase 8 — Tenant Health (#5) · `suc-khoe-tenant-du-an-be.md`
- **Endpoint:** `GET /reports/tenant-health` · `ListTenantHealthReportRequest` (`months` + `company_id` nullable `Rule::exists('tenants','id')` — NOTE table is `tenants` not `organizations`; confirm and use the real table name; org id is a **string** slug).
- **Service logic — TWO domains, kept separate:** `by_company` per tenant: marketplace gmv/platform_fee/order_count/avg_rating/rated_count (fact-set filtered by organizationId, active) + PMC `order_trend` = months[last].order_count − months[last-1].order_count via `TenantBusinessSummaryExternalService` + `last_month_orders` + `status {value,label}` + `project_count` (PlatformProjectService). Keep tenants with 0 orders. Sort desc gmv. `by_project` per project with orders: gmv/avg_rating/project_residents(customer_source=project count)/walk_in_residents; sort desc gmv; project_name via PlatformProjectService. `company_id` filter narrows both + the PMC loop to 1 tenant.
- **Test focus:** GMV/fee/CSAT per tenant marketplace; order_trend Δ PMC (months=1→0); status mapping; by_project residents split; company_id filter both tables + invalid→422; empty→`[]`; **no domain mixing** (GMV marketplace ≠ PMC revenue); 422.
- **Deps:** aggregation + `TenantBusinessSummaryExternalService` + `PlatformProjectService` + `OrganizationRepository`. ⚠ Heaviest cross-cutting report.

### Phase 9 — Hub Overview (#0) · `tong-quan-be.md`
- **Endpoint:** `GET /reports/overview` · `ListReportOverviewRequest` (`months`).
- **Service logic:** COMPOSE — call `RevenueReportService` (for `total_platform_revenue` 3-source + `marketplace_gmv`), `CsatReportService` (`avg_rating`,`rated_count`), `ResidentSegmentReportService` (`active_residents`,`total_residents`), `VendorScorecardReportService` (`vendor_count`=count vendors with orders), + `tenant_count`=`OrganizationRepository::allOrganizations()->count()`. Each sub-service called ONCE with shared `months`. `report_cards` = 7-element nav metadata (key/route/title/blurb/kpi/sub) pulling kpi from the computed kpis. **`total_platform_revenue` taken verbatim from RevenueReportService** (no parallel calc).
- **Test focus:** KPIs equal the sub-services' values (call sub-service directly in test and compare); 3-source revenue matches revenue report; empty tenants/partners→all KPI 0; active_residents ≤ total_residents; report_cards length 7 + order #1→#7; 422.
- **Deps:** Phases 2,6,7,5 services + OrganizationRepository. **Do last.**

---

## Cross-cutting conventions (every phase)

- **Window:** `months` (default 6) → `$from = now()->startOfMonth()->subMonthsNoOverflow($months-1)`, `$to = now()->endOfMonth()`. Match `TenantBusinessSummaryExternalService`.
- **Money:** integer VND, never formatted in BE.
- **Percent/rate:** rounded integer.
- **Enums:** `{value, label}`.
- **Response:** `response()->json(['success'=>true,'data'=>...])` (no Resource class for computed reports).
- **Keys:** snake_case.
- **Form Request:** mandatory per endpoint, extends `BaseFormRequest`, Vietnamese messages, NO inline validation.
- **Service → Repository only** for DB; ExternalService only across top-level modules; within Platform import directly.
- **Tests:** SQLite `:memory:`, `RequesterAccount` + `actingAs(...,'requester')`, mock ExternalServices via `$this->app->instance(...)`, `tenancy()->end()` in tearDown, NEVER touch Postgres.
- **Post-change:** `make format` → `make lint` → `php artisan test --compact --filter={Report}Test`.
- **Scramble:** add `@tags Platform Reports` + method descriptions on each controller. Since responses are plain `JsonResponse` (not Resources), document the shape in the controller method PHPDoc.

## Self-Review (run after each phase)
1. Spec coverage: every §4/§5/§6 bullet → a test.
2. Placeholder scan: no TBD/"handle edge cases" — real code + real assertions.
3. Type consistency: method names match across tasks (`collectPlatformVendorOrders`, `build`, `collectOrders`, `allOrganizations`, `countAllResidents`).
4. Degrade path: every report returns zeros/empty (not 500) when tenants/partners empty or schema_missing.

---

## Open items to confirm while coding (specs flagged these)
- resi_mart real table/column names for product order + service booking (Phase 0.1).
- `PartnerRepository` method to list ALL platform partners (used in aggregation 1.3) — confirm/add.
- Marketplace order `type` derivation (product vs service) from `VendorOrderItem.item_type`.
- `company_id` filter table name in tenant-health (`tenants` vs `organizations`).
- Whether tenant-health adds optional PMC `pmc_revenue`/`pmc_platform_fee` columns (default: bám mockup, marketplace-only; decide with stakeholder).
