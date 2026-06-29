# Báo cáo Doanh thu platform — Đặc tả kỹ thuật Backend

> Module: `Platform/Report` | Báo cáo #1 | Ngày tạo: 2026-06-18 | Trạng thái: Draft
> Nguồn mockup: `BA-TNP-SERVICES/app/pages/platform/modules/bao-cao-tong-hop/doanh-thu-tong-hop.vue` + composable `usePlatformReportData.ts` (`revenueOverview`).
> **Nền tảng chung:** [`./README.md`](./README.md) — kiến trúc tổng hợp, route prefix, conventions presenter, pattern cross-tenant, ánh xạ nguồn dữ liệu. File này CHỈ mô tả phần riêng của báo cáo Doanh thu.

---

## 1. Tổng quan

Báo cáo **Doanh thu platform** trả lời câu hỏi: *nền tảng thực thu được bao nhiêu, từ đâu, theo công ty vận hành nào, xu hướng ra sao*. Đây là báo cáo **đọc-chỉ, tổng hợp xuyên toàn bộ tenant + partner**, không có entity/bảng mới.

Báo cáo này đọc **CẢ 3 miền dữ liệu** (xem README §3.2 — KHÔNG trộn lẫn miền khi tính từng số):

1. **B2B `TenantServiceOrder`** (central DB) — phí platform thu trực tiếp từ tenant (subscription/setup/addon), tính phần đã `paid`.
2. **Marketplace vendor resi_mart** (schema resi_mart) — GMV + hoa hồng; chỉ phần hoa hồng `revenue_recipient = platform` mới là doanh thu nền tảng.
3. **PMC nội bộ tenant** (schema tenant) — GMV/đơn PMC + `frozen_platform_fee` (phí nền tảng/đơn).

> ⚠️ **Quyết định #4 (README §2) — sai khác có chủ đích so với mockup:** Mockup chỉ cộng (1) B2B + (2) hoa hồng marketplace vào `total_platform_revenue`. **Spec này BỔ SUNG (3) phí nền tảng PMC `frozen_platform_fee`** vào tổng doanh thu nền tảng và thêm KPI riêng `pmc_platform_fee`. Lý do: phí nền tảng/đơn PMC là nguồn thu thực của nền tảng (đã đóng băng tại kỳ chốt phí — xem [`../tong-quan-kinh-doanh-tenant-be.md`](../tong-quan-kinh-doanh-tenant-be.md) §1.3), không thể bỏ ngoài "tổng thu platform".

`total_platform_revenue = b2b_revenue + marketplace_platform_fee + pmc_platform_fee`

---

## 2. Endpoint

| Action | Method | URL | Request Class |
|--------|--------|-----|---------------|
| Báo cáo doanh thu platform | GET | `/api/v1/platform/reports/revenue` | `ListRevenueReportRequest` |

- Route đặt trong nhóm route platform hiện hữu (README §3.1), guard `auth:requester`.
- Controller: `RevenueReportController@index` (submodule `Platform/Report`).
- Service điều phối: `RevenueReportService` implements `RevenueReportServiceInterface`.

---

## 3. Filter & Validation

### ListRevenueReportRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `months` | `nullable`, `integer`, `min:1`, `max:12` | Số tháng phải từ 1 đến 12 |

- Default `months = 6` (đồng bộ chuẩn chung README §5).
- Khoảng kỳ: từ **đầu tháng** `(now - months + 1)` đến **hết tháng hiện tại**.
- `months` ngoài range → **422**.
- KHÔNG validate inline — dùng Form Request riêng (README §5).

---

## 4. Nguồn dữ liệu & logic tổng hợp

> Tham chiếu ánh xạ nguồn README §4 và pattern cross-tenant README §3.3. **Mỗi số liệu nêu rõ đọc miền nào — KHÔNG trộn (README §3.2).**

### 4.1 KPI (`kpis`)

| KPI | Nguồn (miền) | Cách tính |
|-----|--------------|-----------|
| `total_platform_revenue` | Tổng 3 miền | `b2b_revenue + marketplace_platform_fee + pmc_platform_fee` (xem §1, deviation) |
| `b2b_revenue` | B2B (central) | `SUM(TenantServiceOrder.amount)` WHERE `status = paid`, `created_at`∈kỳ |
| `b2b_paid_count` | B2B (central) | `COUNT(TenantServiceOrder)` WHERE `status = paid` ∈ kỳ |
| `pmc_platform_fee` **(MỚI)** | PMC (schema tenant) | `SUM(frozen_platform_fee)` các đơn PMC `completed` ∈ kỳ, gom xuyên **tất cả tenant** |
| `marketplace_gmv` | Marketplace (resi_mart) | `SUM(amount)` đơn marketplace ∈ kỳ, gom xuyên **tất cả partner** |
| `order_count` | Marketplace (resi_mart) | `COUNT` đơn marketplace ∈ kỳ |
| `marketplace_platform_fee` | Marketplace (resi_mart) | `SUM(commissionAmount)` WHERE `recipient = platform` |
| `marketplace_vh_share` | Marketplace (resi_mart) | `SUM(commissionAmount)` WHERE `recipient = vh` (phần công ty VH nhận) |

- **B2B:** đọc trực tiếp qua repository `Platform/TenantServiceOrder` (cùng module Platform → import trực tiếp, KHÔNG ExternalService — README §6).
- **Marketplace:** đọc qua fact-set chung `collectPlatformVendorOrders(from, to)` (README §3.4) — 1 lần gom rồi lọc theo `recipient`. Hoa hồng chia platform vs VH theo enum `RevenueRecipient` (`VendorOrderCommissionCalculator`).
- **PMC:** loop toàn bộ tenant, mỗi tenant gọi `TenantBusinessSummaryExternalService::getMonthlyBusinessSummary($tenant, $months)` (đã có) rồi cộng `platform_revenue` (= `frozen_platform_fee`) của các tháng. Pattern loop `OrganizationRepository::findAll()` + `$tenant->run()` (README §3.3).

### 4.2 Doanh thu B2B theo loại đơn (`by_b2b_type`) — bảng

- **Miền:** B2B (central) thuần.
- Gom các đơn `TenantServiceOrder` đã `paid` ∈ kỳ theo enum `TenantServiceOrderType`.
- Mỗi dòng: `{ type, label, count, revenue }` — `revenue = SUM(amount)`, `count = COUNT`.
- Loại đơn không phát sinh → có thể bỏ (chỉ trả loại có đơn) hoặc trả 0 — ưu tiên trả các loại đã phát sinh để bảng gọn.

### 4.3 Thu platform theo công ty VH (`by_tenant`) — bảng

- **Miền hỗn hợp, gom theo từng tenant** (mỗi tenant 1 dòng), sort **giảm dần** theo `total_platform_revenue`.
- Mỗi dòng:

| Field | Nguồn (miền) | Cách tính |
|-------|--------------|-----------|
| `company_id` / `company_name` / `status` | Platform/Tenant (central) | Repository `Organization` trực tiếp; `status` trả `{value,label}` |
| `project_count` | PMC business-summary | từ summary tenant (số dự án) |
| `order_count` | PMC business-summary | tổng số đơn PMC trong kỳ |
| `tenant_revenue` | PMC business-summary | `SUM(tenant_revenue)` các tháng (GMV PMC tenant) |
| `platform_revenue` | PMC business-summary | `SUM(platform_revenue)` = `frozen_platform_fee` tenant |
| `b2b_revenue` | B2B (central) | `SUM(TenantServiceOrder.amount paid)` của riêng tenant đó (lọc theo `organization_id`) ∈ kỳ |
| `total_platform_revenue` | hỗn hợp | `platform_revenue + b2b_revenue` (phần nền tảng thực thu từ tenant này) |

- `tenant_revenue`/`platform_revenue`/`order_count`/`project_count` đến từ `TenantBusinessSummaryExternalService` (loop tenant).
- `b2b_revenue` đến từ repository `TenantServiceOrder` (group theo `organization_id`).
- **Cảnh báo trộn miền:** `tenant_revenue` (GMV PMC) KHÔNG cộng vào `total_platform_revenue` — nó là doanh thu của tenant, không phải của nền tảng. Cột này chỉ để tham khảo quy mô.

### 4.4 Chart xu hướng (`analytics_months`) — series theo tháng

- **Miền:** **PMC thuần** (gộp business-summary của **tất cả tenant** theo tháng). KHÔNG dùng đơn marketplace.
- Mỗi tháng: `{ month, month_label, order_count, tenant_revenue, platform_revenue }`.
- Cách dựng: loop tenant → mỗi tenant trả N tháng (skeleton đã lấp 0) → cộng dồn theo `month` (YYYY-MM) across tenant.
- 3 series chart: **bar = `tenant_revenue`** (GMV PMC), **line = `order_count`** (số đơn), **line = `platform_revenue`** (phí nền tảng PMC).
- **Cảnh báo (README §3.2):** mockup gọi chart này là "Xu hướng GMV marketplace" nhưng dữ liệu thật là **kinh doanh PMC across tenant** — KHÔNG phải GMV marketplace. FE đặt lại nhãn cho đúng (xem `doanh-thu-fe.md`).
- `monthly_b2b`, `monthly_marketplace`: chuỗi tháng phụ (tổng B2B paid và GMV marketplace theo tháng) — dựng skeleton N tháng, lấp 0. Dùng cho sparkline/tham khảo, KHÔNG trộn series với chart PMC chính.

### 4.5 Skeleton tháng & lấp 0

- Mọi chuỗi tháng (`analytics_months`, `monthly_b2b`, `monthly_marketplace`) dựng đủ N tháng theo thứ tự thời gian, tháng rỗng = 0 (README §5; tiền lệ `buildMonthSkeleton`).

---

## 5. Business Rules

- [ ] **3 nguồn doanh thu nền tảng** = B2B paid + hoa hồng marketplace (recipient=platform) + phí nền tảng PMC (`frozen_platform_fee`). Cả 3 cộng vào `total_platform_revenue` (deviation #4 — §1).
- [ ] **B2B chỉ tính `status = paid`**; mốc kỳ theo `created_at`. Đơn chưa paid/cancelled không tính.
- [ ] **Hoa hồng platform vs VH** chia theo `RevenueRecipient` của hợp đồng; `marketplace_platform_fee` = phần platform, `marketplace_vh_share` = phần VH. Chỉ `marketplace_platform_fee` vào tổng thu nền tảng.
- [ ] **Phí PMC** chỉ tính đơn PMC `completed` đã đóng băng phí; gom theo `completed_at` (đồng bộ tiền lệ business-summary). Đơn completed chưa vào kỳ chốt → phí 0 (độ trễ tự nhiên, không ước tính).
- [ ] **KHÔNG trộn miền** khi tính từng KPI (README §3.2): GMV marketplace ≠ GMV PMC ≠ doanh thu B2B.
- [ ] `by_tenant` sort giảm dần theo `total_platform_revenue`.
- [ ] **Lấp tháng đủ:** mọi series trả đủ N tháng, tháng rỗng = 0.
- [ ] **Tenant/partner rỗng:** trả mảng rỗng / KPI = 0, KHÔNG lỗi (README §5).
- [ ] **Read-only thuần** — không ghi gì vào schema tenant/resi_mart/central.
- [ ] **Hiệu năng (README §3.3):** loop tất cả tenant + partner mỗi request. Gom fact-set marketplace 1 lần (`collectPlatformVendorOrders`) và 1 lần loop tenant cho cả KPI + `by_tenant` + `analytics_months`, KHÔNG loop lại cho từng KPI. Ghi log nếu cắt bớt (top-N).

---

## 6. Presenter Output

`RevenueReportResource` (extends `BaseResource`). Tiền = **số nguyên đồng VND, không format ở BE**. Enum (`status`, `type`) trả `{value,label}`. Tỷ lệ % (nếu có) = số nguyên đã làm tròn (README §5). Key presenter = snake_case (README §5).

```json
{
  "success": true,
  "data": {
    "kpis": {
      "total_platform_revenue": 4820000000,
      "b2b_revenue": 1250000000,
      "b2b_paid_count": 38,
      "pmc_platform_fee": 2870000000,
      "marketplace_gmv": 9600000000,
      "order_count": 1420,
      "marketplace_platform_fee": 700000000,
      "marketplace_vh_share": 260000000
    },
    "by_b2b_type": [
      { "type": { "value": "subscription", "label": "Thuê bao" }, "count": 22, "revenue": 880000000 },
      { "type": { "value": "setup", "label": "Khởi tạo" }, "count": 10, "revenue": 250000000 },
      { "type": { "value": "addon", "label": "Tiện ích bổ sung" }, "count": 6, "revenue": 120000000 }
    ],
    "by_tenant": [
      {
        "company_id": "tnp-01",
        "company_name": "Công ty VH An Phú",
        "status": { "value": "active", "label": "Đang hoạt động" },
        "project_count": 5,
        "order_count": 317,
        "tenant_revenue": 6030000000,
        "platform_revenue": 302600000,
        "b2b_revenue": 480000000,
        "total_platform_revenue": 782600000
      }
    ],
    "analytics_months": [
      { "month": "2025-11", "month_label": "T11/2025", "order_count": 42, "tenant_revenue": 820000000, "platform_revenue": 41200000 },
      { "month": "2025-12", "month_label": "T12/2025", "order_count": 48, "tenant_revenue": 910000000, "platform_revenue": 45500000 }
    ],
    "monthly_b2b": [
      { "month": "2025-11", "month_label": "T11/2025", "revenue": 180000000, "count": 5 }
    ],
    "monthly_marketplace": [
      { "month": "2025-11", "month_label": "T11/2025", "gmv": 1400000000, "platform_fee": 110000000 }
    ]
  }
}
```

- Trả qua `response()->json(['success' => true, 'data' => ...])` (đồng nhất `OrganizationController::stats`).
- `pmc_platform_fee` là trường **mới so với mockup** (deviation #4).

---

## 7. Cross-Module Dependencies

> Quy tắc README §6: ExternalService chỉ giữa top-level module; trong cùng Platform → import trực tiếp.

| Dependency | Module nguồn | Cách dùng | Dùng cho |
|-----------|-------------|-----------|----------|
| Tổng hợp đơn marketplace platform-wide (GMV, commission, recipient) | Marketplace/VendorOrder | `PlatformVendorOrderAggregationExternalServiceInterface` (fact-set §3.4) | KPI marketplace, `monthly_marketplace` |
| Kinh doanh PMC theo tenant (GMV, order_count, frozen_platform_fee theo tháng) | PMC/Order (+ClosingPeriod) | `TenantBusinessSummaryExternalServiceInterface` (đã có) | `pmc_platform_fee`, `by_tenant`, `analytics_months` |
| Đơn B2B `TenantServiceOrder` (paid, by type, by tenant) | Platform/TenantServiceOrder (cùng module) | **Repository trực tiếp** | `b2b_revenue`, `by_b2b_type`, `by_tenant.b2b_revenue` |
| Danh sách tenant (Organization) + status | Platform/Tenant (cùng module) | **Repository trực tiếp** | loop tenant, `by_tenant` metadata |

- Loop tenant: `OrganizationRepository::findAll()` + `$tenant->run()` (tiền lệ `PlatformProjectService::mergeProjectsAcrossTenants`).
- Loop partner: ẩn trong `collectPlatformVendorOrders` (tiền lệ `VendorOrderService::*Platform`).

---

## 8. Entities / Migration

**Không bảng mới — read-only.** Báo cáo chỉ đọc lại dữ liệu đã có:
- `tenant_service_orders` (central, `Platform/TenantServiceOrder`).
- `orders` + `closing_period_orders` (schema tenant, qua ExternalService PMC).
- Đơn marketplace (schema resi_mart, qua ExternalService Marketplace).
- `organizations` (central, `Platform/Tenant`).

Không migration, không cột mới cho báo cáo này. (Wiring rating thuộc báo cáo CSAT — không liên quan.)

---

## 9. Checklist triển khai BE

> **Phần chung:** README §8 (submodule structure, fact-set chung, route+guard, tests SQLite `:memory:`, PSR-4 + `make format`/`make lint`).

- [ ] `Platform/Report/Controllers/RevenueReportController@index`.
- [ ] `RevenueReportService` + `RevenueReportServiceInterface` (bind ở `PlatformServiceProvider`); gom 1 lần fact-set marketplace + 1 lần loop tenant, KHÔNG loop lại từng KPI.
- [ ] `Platform/Report/Requests/ListRevenueReportRequest` (rule `months` 1–12, default 6).
- [ ] `Platform/Report/Resources/RevenueReportResource` (shape §6, thêm `pmc_platform_fee`, money integer, enum `{value,label}`).
- [ ] Mở rộng `PlatformVendorOrderAggregationExternalService` nếu thiếu field (recipient split) — KHÔNG bypass repository.
- [ ] Tái dùng `TenantBusinessSummaryExternalService` cho phần PMC.
- [ ] Route `GET /api/v1/platform/reports/revenue` + guard `auth:requester`.
- [ ] PSR-4, `make format` → `make lint`.
- [ ] Tests (Platform feature, SQLite `:memory:`): `total_platform_revenue` = 3 nguồn cộng đúng; `pmc_platform_fee` riêng đúng; `by_b2b_type` group đúng; `by_tenant` sort desc + `b2b_revenue` đúng tenant; `analytics_months` lấp tháng rỗng = 0 và là PMC (không phải marketplace); `months` ngoài 1–12 → 422; tenant/partner rỗng → KPI 0 + mảng rỗng. **Không** chạm Postgres.
