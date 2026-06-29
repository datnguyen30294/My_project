# Sức khỏe tenant & dự án (Platform) — Đặc tả kỹ thuật Backend

> Module: `Platform/Report` (submodule trong `Platform`) | Báo cáo #5 | Ngày tạo: 2026-06-18 | Trạng thái: Draft
> Nguồn mockup: `BA-TNP-SERVICES/app/pages/platform/modules/bao-cao-tong-hop/suc-khoe-tenant-du-an.vue` + composable `tenantProjectHealth` (trong `usePlatformReportData.ts`).
> **Nền tảng chung:** [`./README.md`](./README.md) — kiến trúc tổng hợp, route prefix, hai miền đơn hàng, fact-set dùng chung, conventions, dependencies, checklist. File này CHỈ mô tả phần riêng của báo cáo "Sức khỏe tenant & dự án" và tham chiếu về README cho phần chung.

---

## 1. Header

- Báo cáo: **Sức khỏe tenant & dự án** (#5 trong cụm Báo cáo tổng hợp Platform).
- Mục tiêu: bảng tổng hợp **cross-tenant theo từng công ty vận hành** (roll-up platform-wide của card "Tổng quan kinh doanh tenant" cho từng tenant) — kèm GMV/phí marketplace, CSAT, xu hướng số đơn — và **drill-down chi tiết theo dự án** (phân khúc đơn cư dân dự án vs vãng lai).
- Đọc-chỉ (read-only). Không bảng mới.

---

## 2. Tổng quan (miền dữ liệu) — ⚠️ TRỘN HAI MIỀN CÓ KIỂM SOÁT

> Đây là **roll-up platform-wide của [`../tong-quan-kinh-doanh-tenant-be.md`](../tong-quan-kinh-doanh-tenant-be.md)** (vốn xem 1 tenant) — nhưng báo cáo này lấy chỉ số tiền/CSAT từ **miền marketplace**, chỉ riêng cột xu hướng đơn lấy từ **miền PMC**. Phải đọc kỹ §3.2 README để không trộn nhầm.

Báo cáo này **kết hợp HAI miền đơn hàng** (README §3.2), mỗi miền cho một nhóm chỉ số riêng — KHÔNG cộng gộp:

| Chỉ số | Miền nguồn (README §3.2) | Đọc qua |
|--------|--------------------------|---------|
| `gmv`, `platform_fee`, `order_count` (marketplace), `avg_rating`/CSAT, đơn cư dân dự án / vãng lai | **#2 — Đơn marketplace vendor resi_mart** | Fact-set dùng chung (README §3.4) qua `PlatformVendorOrderAggregationExternalService` + `ResiMartConnection` |
| `order_trend` (Δ số đơn tháng cuối so tháng trước) | **#1 — Đơn PMC nội bộ tenant** | `TenantBusinessSummaryExternalService` (`$tenant->run()`, README §6) |
| `status`, `project_count`, danh sách tenant | **Tenant/Organization** (central) | `OrganizationRepository` (cùng module — import trực tiếp) |

- ⚠️ **Cảnh báo miền (bắt buộc):** Cột **"GMV"** ở báo cáo này là **GMV đơn MARKETPLACE** (giá trị đơn vendor resi_mart), **KHÔNG** phải doanh thu PMC của tenant ([`../tong-quan-kinh-doanh-tenant-be.md`](../tong-quan-kinh-doanh-tenant-be.md) §1 cấm trộn). `platform_fee` cột này = **hoa hồng/phí platform trên đơn marketplace** (từ `commission`/`revenue_recipient=platform`), KHÔNG phải `frozen_platform_fee` của đơn PMC.
  - **Quyết định lúc code:** nếu nghiệp vụ muốn show thêm **doanh thu PMC tenant** (`SUM(orders.total_amount)` completed) và/hoặc `frozen_platform_fee` PMC, thì đó là **cột RIÊNG** (vd `pmc_revenue`, `pmc_platform_fee`) — đọc thêm từ `TenantBusinessSummaryExternalService` (đã trả `summary.tenant_revenue`/`platform_revenue`). **Tuyệt đối không** cộng vào cột GMV/phí marketplace. Mockup hiện chỉ show GMV marketplace; spec mặc định bám mockup, để ngỏ cột PMC như tùy chọn — ghi chú quyết định khi triển khai.
- `order_trend` chỉ là **Δ số đơn PMC** tháng cuối − tháng kề trước (không phải Δ đơn marketplace) — đúng như mockup lấy từ `getTenantAnalytics` (PMC business-summary). Cần ≥ 2 tháng dữ liệu, thiếu → `0`.

---

## 3. Endpoint

| Action | Method | URL | Request Class |
|--------|--------|-----|---------------|
| Sức khỏe tenant & dự án | GET | `/api/v1/platform/reports/tenant-health` | `ListTenantHealthReportRequest` |

- Đặt trong `Platform/routes/*.php` cùng nhóm guard platform hiện hữu (`auth:requester`) — kiểm tra sibling `tenant-service-orders`, `tenants/{id}/business-summary` khi code (README §3.1).
- Controller: `TenantHealthReportController@index` (submodule `Platform/Report`) → `TenantHealthReportService` → `response()->json(['success' => true, 'data' => ...])`.

---

## 4. Filter & Validation

### `ListTenantHealthReportRequest`

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `months` | `nullable`, `integer`, `min:1`, `max:12` | Số tháng phải từ 1 đến 12 |
| `company_id` | `nullable`, `integer`, `Rule::exists('organizations','id')` | Công ty vận hành không tồn tại |

- Default `months = 6`. Khoảng thời gian: từ **đầu tháng** `(now - months + 1)` đến **hết tháng hiện tại** (đồng nhất `ListTenantBusinessSummaryRequest`). `months` dùng cho **cả** kỳ gom GMV/CSAT marketplace **và** kỳ tính `order_trend` PMC (để Δ T-1 nằm trong cùng kỳ).
- `company_id` **tùy chọn** — khi có thì lọc cả `by_company` (chỉ tenant đó) và `by_project` (chỉ dự án thuộc tenant đó). Mockup lọc client-side; BE nhận filter để giảm tải loop nếu chỉ xem 1 tenant.
- `months` ngoài range → **422**. `company_id` không tồn tại trong `organizations` → **422** (qua `Rule::exists`).

---

## 5. Nguồn dữ liệu & logic tổng hợp

> Pattern cross-tenant: README §3.3 (loop tenant `$tenant->run()` cho PMC, loop partner `ResiMartConnection` cho marketplace, skeleton tháng đủ N). **Cảnh báo hiệu năng** áp dụng trực tiếp — xem §5.4.

### 5.1 Fact-set marketplace (dùng chung)

Gọi method aggregation marketplace dùng chung (README §3.4, §6 — `PlatformVendorOrderAggregationExternalServiceInterface`), trả tập "đơn marketplace platform-wide" cho kỳ `[from, to]`. Mỗi row cần tối thiểu cho báo cáo này:

| Trường row | Mô tả |
|-----------|-------|
| `organization_id` (company id) | tenant/công ty VH sở hữu đơn — gom theo công ty |
| `project_id` | dự án của đơn — gom theo dự án |
| `amount` | giá trị đơn (GMV marketplace, số nguyên đồng) |
| `commission_amount` / phần `recipient = platform` | phí platform marketplace (xem §2; **không** phải `frozen_platform_fee` PMC) |
| `customer_source` | `project` \| `walk_in` — phân khúc đơn dự án vs vãng lai |
| `resident_rating` | điểm 1–5 (nullable) — dùng tính CSAT (phụ thuộc wiring README §9) |
| `status` | trạng thái đơn — loại đơn huỷ (chỉ tính đơn **active**) |

- Lấy fact-set **một lần** cho toàn kỳ rồi gom theo company và theo project (README §3.3 — tránh loop resi_mart lặp lại).
- Chỉ tính **đơn active** (loại cancelled/rejected — khớp enum `VendorOrder`, kiểm tra khi code).

### 5.2 `by_company` (gom theo công ty vận hành)

Với **mỗi tenant** (Organization, central; nếu có `company_id` filter thì chỉ tenant đó):

1. **Marketplace (từ fact-set §5.1, lọc `organization_id = tenant.id`, đơn active):**
   - `order_count` = COUNT đơn.
   - `gmv` = SUM `amount`.
   - `platform_fee` = SUM phần phí platform (commission recipient=platform).
   - `avg_rating` = trung bình `resident_rating` của đơn **có rating** (làm tròn 1 chữ số thập phân hoặc trả `null` nếu `rated_count = 0`); `rated_count` = số đơn có rating.
2. **PMC (`order_trend`):** gọi `TenantBusinessSummaryExternalService::getMonthlyBusinessSummary($tenant, $months)` → mảng `months[]` (đơn PMC theo tháng). `order_trend = months[last].order_count − months[last-1].order_count`. Cần ≥ 2 phần tử (skeleton luôn đủ N nên với `months ≥ 2` luôn tính được); `months = 1` hoặc thiếu dữ liệu → `0`. `last_month_orders = months[last].order_count` (đính kèm để FE/diễn giải, optional).
3. **Tenant meta:** `status` = `OperatingCompany`/Organization status (`is_active`) → `{ value, label }` (`active`→"Hoạt động" / `inactive`→"Vô hiệu"). `project_count` = số dự án của tenant (đếm qua `PlatformProjectService`/PMC project list cross-tenant, README §6).
4. Một hàng `by_company` / tenant. **Sắp xếp giảm dần theo `gmv`** (đồng nhất mockup).

> Tenant không có đơn marketplace → vẫn xuất hiện 1 hàng với GMV/phí/CSAT = 0/null (giống mockup `companies.value.map`), `order_trend` vẫn tính từ PMC. (Quyết định lúc code: có thể ẩn tenant `is_active=false` & 0 đơn nếu nghiệp vụ yêu cầu — mặc định giữ tất cả như mockup.)

### 5.3 `by_project` (drill-down theo dự án)

Với **mỗi dự án có đơn marketplace** (gom fact-set theo `project_id`, đơn active; nếu có `company_id` filter thì chỉ dự án thuộc tenant đó):

- `order_count` = COUNT đơn.
- `gmv` = SUM `amount`.
- `avg_rating` / `rated_count` = như §5.2 nhưng trên đơn của dự án.
- `project_residents` = COUNT đơn `customer_source = project` (cư dân thuộc dự án).
- `walk_in_residents` = COUNT đơn `customer_source = walk_in` (khách vãng lai).
- `company_name` / `organization_id` = tenant sở hữu dự án.
- `project_name` = tên dự án (resolve qua `PlatformProjectService`, README §6).

**Chỉ trả dự án có `order_count > 0`** (mockup `.filter(r => r.orderCount > 0)`). **Sắp xếp giảm dần theo `gmv`**.

### 5.4 Cảnh báo hiệu năng

- `by_company` loop **mọi tenant** → mỗi tenant 1 lần `$tenant->run()` cho `getMonthlyBusinessSummary` (PMC, cross-schema). `by_project` + GMV/CSAT marketplace loop **mọi partner** qua `ResiMartConnection`. Chi phí O(số tenant + số partner) switch schema/request — **chấp nhận ở GĐ1** (README §2, §3.3).
- Khi có `company_id`: thu hẹp loop PMC về **1 tenant** (chỉ gọi business-summary cho tenant đó); fact-set marketplace vẫn gom platform-wide một lần rồi lọc theo `organization_id`/`project_id` trong bộ nhớ.
- **Phải** `log()`/ghi chú nếu sau này cắt bớt (top-N tenant, bỏ retry) hoặc chuyển sang snapshot (GĐ2 — đã hoãn, README §3.3).

---

## 6. Business Rules

- [ ] **Hai miền tách bạch (README §3.2):** GMV/`platform_fee`/`order_count`/CSAT/đơn-phân-khúc = **marketplace**; `order_trend` = **PMC**. KHÔNG cộng gộp. Cột doanh thu PMC (nếu thêm) phải là cột riêng (§2).
- [ ] **Chỉ tính đơn marketplace active** cho mọi chỉ số marketplace (loại đơn huỷ). Đơn PMC cho `order_trend` tính theo logic `tong-quan-kinh-doanh` (chỉ `completed`, mốc `completed_at`).
- [ ] **`avg_rating`/CSAT:** trung bình `resident_rating` trên đơn **có rating**; `rated_count = 0` → `avg_rating = null` (FE hiển thị "—"). Phụ thuộc **wiring CSAT** (README §9) — nếu chưa wiring thì `resident_rating` luôn null ⇒ CSAT = null toàn bộ (ghi chú khi code, không lỗi).
- [ ] **`order_trend` = Δ số đơn PMC** `months[last].order_count − months[last-1].order_count`. `months = 1` → trend `0` (không đủ 2 tháng). FE hiển thị `+/-`.
- [ ] **`status`** = trạng thái Organization (`is_active`) → `{ value, label }` (`active`/`inactive`).
- [ ] **`by_company` sort giảm dần `gmv`**; giữ cả tenant 0 đơn (mặc định theo mockup).
- [ ] **`by_project`** chỉ gồm dự án có `order_count > 0`; sort giảm dần `gmv`.
- [ ] **`company_id` filter** (nếu có): lọc cả `by_company` (1 tenant) và `by_project` (dự án thuộc tenant đó). Không có → toàn nền tảng.
- [ ] **Tenant/partner rỗng:** trả `by_company = []` / `by_project = []`, KHÔNG lỗi (README §5). Tenant không có đơn → GMV/phí/CSAT = 0/null.
- [ ] **Read-only thuần:** không ghi gì vào schema tenant/resi_mart (README §5).
- [ ] **Tiền:** số nguyên đồng, KHÔNG format ở BE (README §5).

---

## 7. Presenter Output

`TenantHealthReportResource` (extends `BaseResource`). Tiền: số nguyên đồng, không format BE. `status` trả `{ value, label }`. `avg_rating` là số (1 chữ số thập phân) hoặc `null`.

```json
{
  "success": true,
  "data": {
    "by_company": [
      {
        "company_id": 3,
        "company_name": "Vận hành Alpha",
        "status": { "value": "active", "label": "Hoạt động" },
        "project_count": 5,
        "order_count": 312,
        "gmv": 884000000,
        "platform_fee": 44200000,
        "avg_rating": 4.6,
        "rated_count": 210,
        "last_month_orders": 58,
        "order_trend": 6
      }
    ],
    "by_project": [
      {
        "project_id": 12,
        "project_name": "Chung cư Alpha Tower",
        "company_name": "Vận hành Alpha",
        "order_count": 132,
        "gmv": 198000000,
        "avg_rating": 4.7,
        "rated_count": 96,
        "project_residents": 110,
        "walk_in_residents": 22
      }
    ]
  }
}
```

- `by_company` sort `gmv` giảm dần; `by_project` chỉ dự án có đơn, sort `gmv` giảm dần.
- `avg_rating = null` khi `rated_count = 0` (FE → "—"). `order_trend` số nguyên (âm/dương/0) — FE hiển thị `+/-`.
- `gmv`/`platform_fee` = **marketplace** (số nguyên đồng); nếu thêm cột PMC thì đặt key riêng (`pmc_revenue`, `pmc_platform_fee`) — §2.
- Trả qua `response()->json(['success' => true, 'data' => ...])` (đồng nhất `OrganizationController::stats`, README §5).

---

## 8. Cross-Module Dependencies (ExternalService)

> Quy tắc README §6: ExternalService **chỉ giữa các top-level module** (Platform ↔ Marketplace, Platform ↔ PMC). Trong cùng Platform (Report ↔ Tenant) → **import trực tiếp Repository**.

| Dependency | Module nguồn | Interface (gợi ý) | Dùng cho |
|-----------|-------------|-------------------|----------|
| Tổng hợp đơn marketplace platform-wide (`organization_id`, `project_id`, `amount`, phí platform, `customer_source`, `resident_rating`, `status`) cho kỳ `[from,to]` | Marketplace/VendorOrder | `PlatformVendorOrderAggregationExternalServiceInterface` (mở rộng cái đã có — README §6) | GMV, phí, CSAT, đơn phân khúc (`by_company` + `by_project`) |
| Xu hướng số đơn PMC theo tháng (`months[].order_count`) | PMC/Order (+ ClosingPeriod) | `TenantBusinessSummaryExternalServiceInterface` (đã có) | `order_trend`, `last_month_orders` |
| Dự án cross-tenant (tên dự án, `project_count` theo tenant) | PMC + Platform/Tenant | `PlatformProjectService` (đã có) | `project_name`, `project_count`, ghép dự án ↔ tenant |
| Danh sách tenant + `status`/`is_active` | Platform/Tenant (cùng module) | **Repository trực tiếp** (`OrganizationRepository`) | loop `by_company`, `status`, lọc `company_id` |

- Nếu fact-set aggregation chưa trả đủ trường (`customer_source`, `resident_rating`, `project_id`) → **mở rộng ExternalService + Repository ở Marketplace** (KHÔNG bypass repository từ Service Report — README §8). `resident_rating` phụ thuộc **wiring CSAT** (README §9).
- `TenantBusinessSummaryExternalService` đã trả `months[].order_count` — chỉ cần lấy 2 phần tử cuối để tính Δ.

---

## 9. Entities / Migration

**Không bảng mới — read-only.** Toàn bộ đọc lại: đơn marketplace platform-wide (qua ExternalService Marketplace + `ResiMartConnection`), business-summary PMC (`$tenant->run()`), tenant/dự án (central + cross-tenant). Không cột mới, không migration ở submodule này.

> Riêng trường `resident_rating`/`customer_source` trên đơn marketplace là **phụ thuộc wiring CSAT** (README §9 — cross-repo resi_mart, đã mô tả ở [`./csat-be.md`](./csat-be.md)). Báo cáo này tiêu thụ kết quả wiring đó, KHÔNG tự tạo migration.

---

## 10. Checklist BE

> **Phần chung:** README §8 (submodule `Platform/Report`, `ReportAggregationService` gom fact-set 1 lần, routes prefix, PSR-4, tests SQLite `:memory:` không chạm Postgres).

- [ ] `Platform/Report/Requests/ListTenantHealthReportRequest` (rule `months` 1–12 default 6; `company_id` nullable + `Rule::exists('organizations','id')`)
- [ ] `Platform/Report/Services/TenantHealthReportService` + `Interface` (loop tenant `by_company` + `order_trend` từ business-summary; gom fact-set marketplace 1 lần → `by_company`/`by_project`; sort `gmv` desc; lọc `company_id`)
- [ ] Bind interface trong ServiceProvider của `Platform`
- [ ] `Platform/Report/Controllers/TenantHealthReportController@index` → service → `TenantHealthReportResource` → `response()->json`
- [ ] `Platform/Report/Resources/TenantHealthReportResource` (shape §7: money int, `status` `{value,label}`, `avg_rating` số/null, `order_trend` int)
- [ ] Mở rộng `PlatformVendorOrderAggregationExternalService` (Marketplace) nếu thiếu trường `customer_source`/`resident_rating`/`project_id` (qua Repository, không bypass) — phụ thuộc wiring CSAT README §9
- [ ] Tái dùng `TenantBusinessSummaryExternalService` (PMC) cho `order_trend` + `PlatformProjectService` cho dự án/`project_count`
- [ ] Route `GET /api/v1/platform/reports/tenant-health` (guard `auth:requester`)
- [ ] PSR-4 + `make format` → `make lint`
- [ ] Tests (Platform feature, SQLite `:memory:`):
  - [ ] `by_company` đúng GMV/phí/CSAT marketplace từng tenant; sort `gmv` desc; giữ tenant 0 đơn
  - [ ] `order_trend` = Δ đơn PMC tháng cuối − kề trước; `months=1` → trend 0
  - [ ] `status` trả `{value,label}` đúng `active`/`inactive`
  - [ ] `by_project` chỉ dự án có đơn; `project_residents`/`walk_in_residents` đếm đúng theo `customer_source`; sort `gmv` desc
  - [ ] filter `company_id`: lọc đúng cả 2 bảng; `company_id` không tồn tại → 422
  - [ ] `months` ngoài 1–12 → 422
  - [ ] tenant/partner rỗng → `by_company=[]`/`by_project=[]`, không lỗi; tenant không đơn → GMV/CSAT 0/null
  - [ ] **KHÔNG trộn** GMV marketplace với doanh thu PMC (nếu có cột PMC, kiểm tách bạch)
  - [ ] **Không** chạm Postgres
