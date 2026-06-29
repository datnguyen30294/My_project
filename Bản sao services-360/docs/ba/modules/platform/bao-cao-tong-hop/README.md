# Báo cáo tổng hợp (Platform) — Nền tảng kiến trúc & chỉ mục

> Module: `Platform/Report` (mới) | Ngày tạo: 2026-06-18 | Trạng thái: Draft
> Nguồn mockup: `BA-TNP-SERVICES/app/pages/platform/modules/bao-cao-tong-hop/*.vue` + composable `usePlatformReportData.ts`.
> **File này là nền tảng chung** cho 8 spec con (1 hub + 7 báo cáo). Mỗi spec con CHỈ mô tả phần riêng và tham chiếu về đây cho kiến trúc, route prefix, nguồn dữ liệu và conventions.

---

## 1. Tổng quan

Console **platform** (vận hành nền tảng) cần một cụm báo cáo **đọc-chỉ (read-only), tổng hợp xuyên toàn bộ tenant** để ra quyết định kinh doanh: doanh thu nền tảng, chất lượng dịch vụ (CSAT), xu hướng, phân khúc khách hàng, sức khỏe từng công ty vận hành, phân bổ hoa hồng và hiệu suất vendor.

Đây **KHÔNG phải module CRUD**. Không có entity/bảng nghiệp vụ mới (trừ phần wiring rating ở báo cáo CSAT — xem §9). Toàn bộ là **lớp tổng hợp (aggregation layer)** đọc lại dữ liệu từ các module đã có và gom theo nhiều chiều.

8 trang (1 hub + 7 báo cáo):

| # | Báo cáo | Route FE | Spec |
|---|---------|----------|------|
| 0 | Tổng quan báo cáo (hub) | `/platform/modules/bao-cao-tong-hop/tong-quan` | [`tong-quan-be.md`](./tong-quan-be.md) / [`tong-quan-fe.md`](./tong-quan-fe.md) |
| 1 | Doanh thu platform | `…/doanh-thu-tong-hop` | [`doanh-thu-be.md`](./doanh-thu-be.md) / [`doanh-thu-fe.md`](./doanh-thu-fe.md) |
| 2 | Chất lượng & CSAT | `…/chat-luong-csat` | [`csat-be.md`](./csat-be.md) / [`csat-fe.md`](./csat-fe.md) |
| 3 | Xu hướng dịch vụ | `…/xu-huong-dich-vu` | [`xu-huong-dich-vu-be.md`](./xu-huong-dich-vu-be.md) / [`…-fe.md`](./xu-huong-dich-vu-fe.md) |
| 4 | Phân khúc cư dân | `…/phan-khuc-cu-dan` | [`phan-khuc-cu-dan-be.md`](./phan-khuc-cu-dan-be.md) / [`…-fe.md`](./phan-khuc-cu-dan-fe.md) |
| 5 | Sức khỏe tenant & dự án | `…/suc-khoe-tenant-du-an` | [`suc-khoe-tenant-du-an-be.md`](./suc-khoe-tenant-du-an-be.md) / [`…-fe.md`](./suc-khoe-tenant-du-an-fe.md) |
| 6 | Hoa hồng & phân bổ | `…/hoa-hong-phan-bo` | [`hoa-hong-phan-bo-be.md`](./hoa-hong-phan-bo-be.md) / [`…-fe.md`](./hoa-hong-phan-bo-fe.md) |
| 7 | Hiệu suất vendor | `…/hieu-suat-vendor` | [`hieu-suat-vendor-be.md`](./hieu-suat-vendor-be.md) / [`…-fe.md`](./hieu-suat-vendor-fe.md) |

---

## 2. Quyết định thiết kế (chốt 2026-06-18)

1. **Cấu trúc spec:** 1 cặp BE+FE riêng cho mỗi báo cáo (+ hub) — đặt trong thư mục này.
2. **Cách tổng hợp:** **On-the-fly**, mỗi request loop toàn bộ tenant (`$tenant->run()`) và partner (`ResiMartConnection`), **tái dùng ExternalService đã có**. KHÔNG bảng snapshot / job ở GĐ1. Chấp nhận chi phí O(số tenant + số partner) schema-switch mỗi request ở quy mô hiện tại (xem §3.3 cảnh báo hiệu năng).
3. **CSAT làm đầy đủ ngay:** cần **wiring `resident_rating` + `partner_id`** lên đơn marketplace (resi_mart) trước, rồi expose qua ExternalService. Chi tiết ở [`csat-be.md`](./csat-be.md) §9 và §9 file này.
4. **"Doanh thu platform" gồm cả 3 nguồn:** B2B (`TenantServiceOrder` đã `paid`) **+** hoa hồng marketplace (`revenue_recipient = platform`) **+** phí nền tảng/đơn PMC (`frozen_platform_fee`). (Mockup chỉ cộng 2 nguồn đầu — spec thực **bổ sung** nguồn PMC vào tổng.)

---

## 3. Kiến trúc tổng hợp

### 3.1 Module & route prefix

- **Module mới:** `Platform/Report` (submodule trong module `Platform`). Chứa Controller + Service điều phối; **không có Model/Migration riêng** (trừ wiring CSAT, vốn nằm ở Marketplace/resi_mart).
- **Route prefix:** `/api/v1/platform/reports/...`, đặt trong `Platform/routes/*.php` cùng nhóm guard với các route platform hiện hữu (`auth:requester` — kiểm tra sibling `tenant-service-orders`, `tenants/{id}/business-summary` khi code).
- 8 endpoint (mỗi báo cáo 1 GET, đều nhận filter kỳ `from`/`to`/`months` tùy báo cáo):

| Báo cáo | Endpoint |
|---------|----------|
| Hub | `GET /api/v1/platform/reports/overview` |
| Doanh thu | `GET /api/v1/platform/reports/revenue` |
| CSAT | `GET /api/v1/platform/reports/csat` |
| Xu hướng dịch vụ | `GET /api/v1/platform/reports/service-adoption` |
| Phân khúc cư dân | `GET /api/v1/platform/reports/resident-segments` |
| Sức khỏe tenant & dự án | `GET /api/v1/platform/reports/tenant-health` |
| Hoa hồng & phân bổ | `GET /api/v1/platform/reports/commission-allocation` |
| Hiệu suất vendor | `GET /api/v1/platform/reports/vendor-scorecard` |

### 3.2 Hai miền đơn hàng — KHÔNG trộn lẫn

⚠️ **Cực kỳ quan trọng.** Mockup gộp chung "GMV" nhưng thực tế có **hai miền đơn hàng tách biệt**:

1. **Đơn PMC nội bộ tenant** (`og_ticket → quote → order`, schema tenant). Sinh ra **doanh thu tenant** + **`frozen_platform_fee`** (phí nền tảng/đơn). Đọc qua `PMC/Order` ExternalService trong `$tenant->run()`. → Đây là nguồn của *chart xu hướng GMV* và *phí nền tảng PMC*.
2. **Đơn marketplace vendor resi_mart** (product order + service booking, schema resi_mart riêng). Sinh ra **GMV marketplace** + **hoa hồng** (chia platform vs công ty VH theo `revenue_recipient`). Đọc qua `Marketplace/VendorOrder` ExternalService + `ResiMartConnection`. → Đây là nguồn của *CSAT, xu hướng dịch vụ, phân khúc cư dân, hoa hồng, hiệu suất vendor*.

Cộng thêm **B2B `TenantServiceOrder`** (central DB) — phí platform thu tenant (subscription/setup/addon).

> Tiền lệ bắt buộc tuân theo: [`../tong-quan-kinh-doanh-tenant-be.md`](../tong-quan-kinh-doanh-tenant-be.md) đã cảnh báo **KHÔNG** dùng đơn marketplace cho số liệu kinh doanh PMC của tenant, và ngược lại. Mỗi báo cáo phải nêu rõ nó đọc miền nào.

### 3.3 Pattern tổng hợp cross-tenant

- **Loop tenant (PMC + central):** `OrganizationRepository::findAll()` rồi `$tenant->run(fn () => ...)` cho từng tenant — tiền lệ `PlatformProjectService::mergeProjectsAcrossTenants()`.
- **Loop partner (marketplace):** `foreach ($partners)` + `ResiMartConnection::runInTenantSchema($partner->tenant_id, ...)` — tiền lệ `VendorOrderService::listForPartnerPlatform/getSummaryPlatform/getRevenueTrendPlatform`.
- **Skeleton tháng:** dựng đủ N tháng rồi lấp 0 — tiền lệ `VendorOrderService::buildMonthSkeleton()` và `TenantBusinessSummaryExternalService`.
- **⚠️ Hiệu năng:** mỗi báo cáo loop tất cả tenant/partner ⇒ nhiều lần switch schema/request. Chấp nhận ở GĐ1. **Phải** ghi log/cảnh báo nếu cắt bớt (top-N, bỏ retry). Nếu chậm → GĐ2 cân nhắc snapshot (đã hoãn). Service `Platform/Report` nên gom 1 lần đọc fact-set rồi tính nhiều chiều, tránh loop lặp lại cho từng KPI.

### 3.4 Fact-set dùng chung

Các báo cáo #2–#7 (trừ phần B2B/PMC) đọc **cùng một tập "đơn marketplace platform-wide"** — chính là dữ liệu mà `usePlatformVendorOrders` dựng ở mockup (`PlatformVendorOrderRow`). Service `Platform/Report` nên có một method `collectPlatformVendorOrders(from, to)` trả về tập row chuẩn hóa (gồm: type, partner, project, company, resident, customerSource, amount, commissionAmount, recipient (platform/VH), status, createdAt, **residentRating**), rồi từng báo cáo lọc/gom khác nhau. Tránh mỗi báo cáo tự loop resi_mart lại.

---

## 4. Ánh xạ nguồn dữ liệu (mock → backend thật)

| Khái niệm mock | Entity mock | Nguồn backend thật | Cách đọc |
|----------------|-------------|--------------------|----------|
| Đơn B2B platform | `TenantServiceOrder` | `Platform/TenantServiceOrder` (central DB) | Repository trực tiếp (cùng module Platform) |
| Đơn marketplace | `ProductOrder` + `ServiceBooking` | `Marketplace/VendorOrder` (resi_mart schema) | ExternalService + `ResiMartConnection` |
| Vendor | `PartnerProfile` | `Marketplace/Partner` (`Partner`, central) | `Marketplace` ExternalService / `PartnerConsoleService` |
| Hoa hồng & recipient | `vendor-fee-config` mock | `PartnerCommissionContract` + enum `RevenueRecipient` | `VendorOrderCommissionCalculator` |
| Phí nền tảng/đơn PMC | `tenant-analytics` (mock) | `closing_period_orders.frozen_platform_fee` (schema tenant) | `PMC/Order` ExternalService `$tenant->run()` |
| GMV/đơn theo tháng (PMC) | `tenant-analytics` (mock) | `orders.completed_at` + `total_amount` (schema tenant) | `TenantBusinessSummaryExternalService` |
| Tenant/Công ty VH | `OperatingCompany` | `Platform/Tenant` (`Organization`, central) | Repository trực tiếp (cùng module Platform) |
| Dự án | `HrmProject` | dự án trong schema tenant + `Platform/Tenant` projects | `PlatformProjectService` (cross-tenant) |
| Cư dân | `Resident` | `PMC/Customer` (danh bạ cư dân tenant) | `PMC` ExternalService |
| Customer source (dự án/vãng lai) | `customerSource` | `customer_source` trên đơn marketplace | Marketplace ExternalService |
| Đánh giá cư dân | `residentRating` trên đơn | **CẦN WIRING** (xem §9) | Marketplace ExternalService (sau wiring) |

---

## 5. Conventions chung (mọi spec con tuân theo)

- **Response:** `response()->json(['success' => true, 'data' => ...])` — đồng nhất `OrganizationController::stats`.
- **Tiền:** số nguyên đồng (VND), **không format ở BE**. FE tự format (`formatTenantMoney`).
- **Key presenter:** **snake_case** (`total_platform_revenue`, `by_vendor`, `avg_rating`…), khớp convention API backend & các endpoint platform hiện hữu. camelCase trong composable mockup chỉ là shape nội bộ FE — BE **luôn** trả snake_case.
- **Enum field:** trả `{ "value": "...", "label": "..." }`. Tỷ lệ (%) trả số nguyên đã làm tròn.
- **Không `created_at`** trong presenter trừ khi cần.
- **Read-only:** không ghi gì vào schema tenant/resi_mart (trừ migration wiring CSAT — không phải ghi runtime).
- **Lấp tháng đủ:** chuỗi thời gian luôn trả đủ N tháng, tháng rỗng = 0.
- **Filter kỳ:** mặc định `months = 6` (1–12) hoặc `from`/`to` tùy báo cáo; ngoài range → 422.
- **Tenant/partner rỗng:** trả mảng rỗng / 0, không lỗi.
- **Ngôn ngữ:** spec, label, message tiếng Việt.
- **Form Request:** mỗi endpoint có `List{Report}ReportRequest` validate filter (KHÔNG validate inline).

---

## 6. Cross-Module Dependencies (ExternalService)

> Quy tắc: ExternalService **chỉ giữa các top-level module** (Platform ↔ PMC, Platform ↔ Marketplace). Trong cùng Platform (Report ↔ TenantServiceOrder, Report ↔ Tenant) → **import trực tiếp**, KHÔNG ExternalService.

| Dependency | Module nguồn | Interface (gợi ý) | Dùng cho báo cáo |
|-----------|-------------|-------------------|------------------|
| Tổng hợp đơn marketplace platform-wide (GMV, commission, recipient, rating, customer_source) | Marketplace/VendorOrder | `PlatformVendorOrderAggregationExternalServiceInterface` (mở rộng cái đã có) | #1–#7 |
| Vendor (danh sách, displayName, status) | Marketplace/Partner | `PartnerExternalServiceInterface` | #2,#6,#7 |
| Kinh doanh PMC theo tenant (GMV, order_count, frozen_platform_fee theo tháng) | PMC/Order (+ClosingPeriod) | `TenantBusinessSummaryExternalServiceInterface` (đã có) | #1,#5 |
| Danh bạ cư dân (tổng số, tên) | PMC/Customer | `CustomerExternalServiceInterface` | #4 |
| Dự án cross-tenant | PMC + Platform/Tenant | `PlatformProjectService` (đã có) | #5,#6 |
| Đơn B2B `TenantServiceOrder` (paid revenue, by type, by tenant) | Platform/TenantServiceOrder (cùng module) | **Repository trực tiếp** | #1 |
| Danh sách tenant (Organization) | Platform/Tenant (cùng module) | **Repository trực tiếp** | #1,#5 |

---

## 7. Phân quyền

Toàn bộ là quyền **platform admin** (console vận hành nền tảng). Endpoint dùng guard platform hiện hữu (`auth:requester`). Quyền xem: `platform.reports.view` (hoặc theo cơ chế phân quyền platform hiện có — kiểm tra sibling). Không có hành động ghi/sửa/xóa.

---

## 8. Checklist triển khai chung

- [ ] Submodule `Platform/Report`: `Controllers/`, `Services/{Report}Service` + interface, `Requests/List{Report}ReportRequest`, `Resources/{Report}Resource`.
- [ ] `ReportAggregationService` gom fact-set marketplace 1 lần (§3.4), chia sẻ cho các báo cáo.
- [ ] Mở rộng ExternalService Marketplace/PMC nếu thiếu method (KHÔNG bypass repository).
- [ ] Routes `/api/v1/platform/reports/*` + guard.
- [ ] PSR-4, `make format` → `make lint`.
- [ ] Tests Platform feature (SQLite `:memory:`): mỗi báo cáo kiểm tổng & từng chiều, lấp tháng rỗng, filter range 422, tenant/partner rỗng → 0. **Không** chạm Postgres.
- [ ] Wiring CSAT (resi_mart + Marketplace) — xem [`csat-be.md`](./csat-be.md).

---

## 9. Ghi chú phụ thuộc — Wiring đánh giá cư dân (CSAT)

Quyết định "CSAT làm đầy đủ ngay" kéo theo việc bật **đánh giá cư dân trên đơn marketplace**, hiện đang DEFER (chưa có `partner_id`/rating gắn vào đơn ở schema):

- **resi_mart (repo sibling):** thêm/đảm bảo cột `resident_rating` (int 1–5, nullable), `resident_rating_comment` (string, nullable), `resident_rated_at` (timestamp, nullable) trên bảng đơn (product order + service booking) và đảm bảo `partner_id` có sẵn để gom theo vendor.
- **Marketplace/VendorOrder (repo này):** ExternalService aggregation phải đọc thêm 3 trường rating + đảm bảo mỗi row có `partner_id`, `project_id`, `customer_source`.
- Đây là **cross-repo** — cần đồng bộ với resi_mart và verify trên Postgres dev trước deploy (giống tiền lệ [`project_vendor_tab_platform_project`]). Chi tiết schema & migration ở [`csat-be.md`](./csat-be.md).

> Các báo cáo #3,#4,#6,#7 cũng đọc cùng fact-set nên hưởng lợi từ wiring này (rating dùng ở #7 hiệu suất vendor, #4 phân khúc).
