# Tổng quan báo cáo (Hub) — Đặc tả kỹ thuật Backend

> Module: `Platform/Report` | Ngày tạo: 2026-06-18 | Trạng thái: Draft
> Nguồn mockup: `BA-TNP-SERVICES/app/pages/platform/modules/bao-cao-tong-hop/tong-quan.vue` (composable `hubSummary`).
> Nền tảng chung: [`./README.md`](./README.md) — kiến trúc, route prefix, hai miền đơn hàng (README §3.2), ánh xạ nguồn dữ liệu (§4), conventions presenter (§5), cross-module deps (§6).

## 1. Tổng quan

Trang **Tổng quan báo cáo** là **hub điều hướng** của cụm "Báo cáo tổng hợp" platform. Nó hiển thị một nhúm **KPI tổng (4 chỉ số chính)** rồi dẫn người dùng tới **7 báo cáo chi tiết** (xem README §1 bảng 8 trang). Đây là **trang đọc-chỉ (read-only)**, **không có entity/bảng mới**.

Hub **không tự tính lại từ đầu**: nó **gom kết quả từ các report service khác** (doanh thu, CSAT, phân khúc cư dân, hiệu suất vendor) cộng thêm số đếm tenant/vendor. Nhờ vậy hub không lặp lại logic tổng hợp mà tái dùng các service đã viết cho từng báo cáo con.

Một KPI cần nhấn mạnh theo **Quyết định #4** (README §2): **"Doanh thu platform" gồm 3 nguồn** — B2B + hoa hồng marketplace + phí PMC (mockup chỉ cộng 2 nguồn đầu, spec này **bổ sung** nguồn PMC).

## 2. Endpoint

| Action | Method | URL | Request Class |
|--------|--------|-----|---------------|
| Tổng quan báo cáo (hub) | GET | `/api/v1/platform/reports/overview` | `ListReportOverviewRequest` |

- Đặt trong `Platform/routes/*.php`, guard platform hiện hữu (`auth:requester` — kiểm sibling `tenant-service-orders`, `tenants/{id}/business-summary` khi code). Xem README §3.1, §7.
- Controller: `ReportOverviewController@index` (submodule `Platform/Report`).

## 3. Filter & Validation

### ListReportOverviewRequest

| Field | Rules | Message (VI) |
|-------|-------|--------------|
| `months` | `nullable`, `integer`, `min:1`, `max:12` | Số tháng phải từ 1 đến 12 |

- Default `months = 6`. Kỳ: từ **đầu tháng** `(now - months + 1)` đến **hết tháng hiện tại** (đồng bộ với các report con — README §5 "Filter kỳ").
- `months` ngoài 1–12 → **422**.
- Form Request riêng, KHÔNG validate inline (README §5).

## 4. Nguồn dữ liệu & logic tổng hợp

Hub **điều phối** (compose) bằng cách gọi lại các report service con và lấy phần `summary`/tổng của chúng, KHÔNG tự loop tenant/partner cho từng KPI. Mỗi KPI ánh xạ như sau (chi tiết nguồn xem README §4 bảng ánh xạ):

| KPI (key) | Ý nghĩa | Tái dùng service | Nguồn dữ liệu |
|-----------|---------|------------------|---------------|
| `total_platform_revenue` | **Tổng doanh thu platform = 3 nguồn** (Quyết định #4) | `RevenueReportService` (báo cáo #1) | (a) B2B `TenantServiceOrder` đã `paid` (central, repo trực tiếp) + (b) hoa hồng marketplace `revenue_recipient = platform` (Marketplace/VendorOrder ExternalService) + (c) phí PMC `frozen_platform_fee` (PMC/Order ExternalService `$tenant->run()`) |
| `marketplace_gmv` | Tổng `amount` đơn marketplace active trong kỳ | `RevenueReportService` hoặc fact-set `collectPlatformVendorOrders` (README §3.4) | Đơn marketplace resi_mart (Marketplace/VendorOrder) |
| `avg_rating` + `rated_count` | CSAT trung bình toàn nền tảng + số đơn được đánh giá | `CsatReportService` (báo cáo #2) | `resident_rating` trên đơn marketplace (sau wiring — README §9) |
| `active_residents` + `total_residents` | Số cư dân có ≥1 đơn / tổng danh bạ cư dân | `ResidentSegmentReportService` (báo cáo #4) | Đơn marketplace (resident có đơn) + PMC/Customer (tổng danh bạ) |
| `vendor_count` | Số vendor có đơn trong kỳ | `VendorScorecardReportService` (báo cáo #7) | Marketplace/Partner + đơn marketplace |
| `tenant_count` | Số công ty vận hành (tenant) | Repo trực tiếp | `Platform/Tenant` (`Organization`, central) |

> **Quyết định #4 — `total_platform_revenue` = 3 luồng.** Mockup `hubSummary.totalPlatformRevenue` chỉ cộng (a)+(b). Spec thực **phải cộng đủ (a)+(b)+(c)**. Lấy nguyên giá trị `summary` đã tính trong `RevenueReportService` (báo cáo #1) để đảm bảo hub và trang doanh thu **khớp số tuyệt đối**, không tính song song hai chỗ.

### Ghi chú hiệu năng (README §3.3)

Hub tổng hợp **từ các report service con**, mỗi service đó vốn đã loop tenant (`$tenant->run()`) + partner (`ResiMartConnection`) một lần. Do đó hub **trả chi phí cross-tenant một lần cho mỗi nhánh** chứ không nhân lên cho từng KPI. Khi triển khai:

- Gọi mỗi report service **đúng một lần**, chia sẻ cùng tham số `months`.
- Nếu nhiều service cùng cần fact-set marketplace, ưu tiên dùng chung `ReportAggregationService::collectPlatformVendorOrders(from, to)` (README §3.4) để **không loop resi_mart lại nhiều lần** trong cùng request hub.
- Chấp nhận chi phí O(số tenant + số partner) ở GĐ1; nếu chậm → cân nhắc snapshot ở GĐ2 (đã hoãn).

## 5. Business Rules

- [ ] Tất cả KPI tính trên **cùng một kỳ** (`months`, default 6) để nhất quán giữa hub và các báo cáo con.
- [ ] `total_platform_revenue` = **B2B paid + hoa hồng recipient=platform + phí PMC frozen** (3 nguồn — Quyết định #4). KHÔNG cộng GMV marketplace vào doanh thu platform (GMV là dòng tiền của vendor, không phải doanh thu nền tảng — README §3.2 hai miền không trộn).
- [ ] `marketplace_gmv` chỉ tính đơn marketplace **active** (đơn đã hủy không tính); là chỉ số **tách biệt**, KHÔNG cộng vào `total_platform_revenue`.
- [ ] `avg_rating` = trung bình rating các đơn **đã được đánh giá** (`rated_count`), làm tròn (README §5 "%/tỷ lệ trả số nguyên đã làm tròn"; rating trả 1 chữ số thập phân theo mockup — chốt lúc code, ưu tiên khớp FE). `rated_count = 0` → `avg_rating = 0`.
- [ ] `active_residents` = cư dân có ≥1 đơn marketplace trong kỳ; `total_residents` = tổng danh bạ cư dân (PMC/Customer). `active_residents ≤ total_residents`.
- [ ] `vendor_count` = số vendor **có đơn** trong kỳ (không phải tổng vendor đã đăng ký).
- [ ] `tenant_count` = số tenant (Organization) hiện hữu.
- [ ] **Tenant/partner rỗng → 0**, không lỗi (README §5).
- [ ] **Read-only**: không ghi gì vào schema tenant/resi_mart.
- [ ] Tiền là **số nguyên đồng (VND)**, không format ở BE (README §5).

## 6. Presenter Output

Trả qua `response()->json(['success' => true, 'data' => ...])`. Tiền = số nguyên đồng. Khối `data` gồm `kpis` (4 KPI hiển thị + phụ trợ) và `report_cards` (metadata 7 thẻ điều hướng — BE trả để FE render nhất quán; FE cũng có thể hardcode, chốt lúc code).

```json
{
  "success": true,
  "data": {
    "kpis": {
      "total_platform_revenue": 1842000000,
      "marketplace_gmv": 3920000000,
      "avg_rating": 4.6,
      "rated_count": 184,
      "active_residents": 312,
      "total_residents": 540,
      "vendor_count": 27,
      "tenant_count": 8
    },
    "report_cards": [
      { "key": "revenue", "route": "/platform/modules/bao-cao-tong-hop/doanh-thu-tong-hop", "title": "Doanh thu platform", "blurb": "Tổng hợp doanh thu nền tảng từ 3 nguồn", "kpi": 1842000000, "sub": "VND / 6 tháng" },
      { "key": "csat", "route": "/platform/modules/bao-cao-tong-hop/chat-luong-csat", "title": "Chất lượng & CSAT", "blurb": "Điểm hài lòng cư dân toàn nền tảng", "kpi": 4.6, "sub": "184 đơn đánh giá" },
      { "key": "service-adoption", "route": "/platform/modules/bao-cao-tong-hop/xu-huong-dich-vu", "title": "Xu hướng dịch vụ", "blurb": "GMV & số đơn theo tháng", "kpi": 3920000000, "sub": "GMV marketplace" },
      { "key": "resident-segments", "route": "/platform/modules/bao-cao-tong-hop/phan-khuc-cu-dan", "title": "Phân khúc cư dân", "blurb": "Cư dân có đơn vs tổng danh bạ", "kpi": 312, "sub": "/ 540 cư dân" },
      { "key": "tenant-health", "route": "/platform/modules/bao-cao-tong-hop/suc-khoe-tenant-du-an", "title": "Sức khỏe tenant & dự án", "blurb": "Hiệu suất từng công ty VH", "kpi": 8, "sub": "công ty vận hành" },
      { "key": "commission-allocation", "route": "/platform/modules/bao-cao-tong-hop/hoa-hong-phan-bo", "title": "Hoa hồng & phân bổ", "blurb": "Phân bổ hoa hồng platform vs VH", "kpi": 0, "sub": "VND" },
      { "key": "vendor-scorecard", "route": "/platform/modules/bao-cao-tong-hop/hieu-suat-vendor", "title": "Hiệu suất vendor", "blurb": "Xếp hạng vendor theo đơn & rating", "kpi": 27, "sub": "vendor có đơn" }
    ]
  }
}
```

- `kpis`: phẳng, khớp shape `hubSummary` mockup (đã đổi camelCase → snake_case theo convention BE). `total_platform_revenue` đã cộng đủ 3 nguồn.
- `report_cards`: mảng đúng thứ tự #1→#7; mỗi phần tử có `key`, `route` (route FE đích — README §1), `title`, `blurb`, `kpi` (number — tiền hoặc count), `sub` (chuỗi mô tả). `kpi` của thẻ lấy lại từ `kpis` tương ứng để không tính hai lần.
- Enum (nếu phát sinh) trả `{ value, label }` (README §5) — hub hiện không có field enum.

## 7. Cross-Module Dependencies

Hub là báo cáo **dùng tất cả** nguồn (README §6 — hàng "#1–#7"). Cụ thể, thông qua việc gọi các report service con:

| Dependency | Module nguồn | Cách dùng |
|-----------|-------------|-----------|
| Doanh thu 3 nguồn | Platform/TenantServiceOrder (repo trực tiếp) + Marketplace/VendorOrder (ExternalService) + PMC/Order (ExternalService) | qua `RevenueReportService` |
| CSAT | Marketplace/VendorOrder (rating, sau wiring README §9) | qua `CsatReportService` |
| Cư dân | PMC/Customer (`CustomerExternalServiceInterface`) + đơn marketplace | qua `ResidentSegmentReportService` |
| Vendor có đơn | Marketplace/Partner (`PartnerExternalServiceInterface`) | qua `VendorScorecardReportService` |
| Tổng tenant | Platform/Tenant (`Organization`) | **Repo trực tiếp** (cùng module Platform — README §6 không qua ExternalService) |

> Quy tắc README §6: trong cùng module Platform (Report ↔ TenantServiceOrder, Report ↔ Tenant) → import trực tiếp. Liên module (Platform ↔ PMC, Platform ↔ Marketplace) → ExternalService.

## 8. Entities / Migration

**Không bảng mới — read-only.** Hub chỉ tổng hợp lại kết quả các report service con + đếm tenant. Wiring CSAT (rating) là phụ thuộc của báo cáo #2, không phát sinh ở hub (xem [`csat-be.md`](./csat-be.md) §9 và README §9).

## 9. Checklist triển khai BE

- [ ] `Platform/Report/Controllers/ReportOverviewController@index`
- [ ] `Platform/Report/Requests/ListReportOverviewRequest` (rule `months` 1–12, default 6)
- [ ] `Platform/Report/Services/ReportOverviewService` (+ interface) — compose 4 report service con + đếm tenant; gọi mỗi service đúng 1 lần, chia sẻ `months`
- [ ] `Platform/Report/Resources/ReportOverviewResource` — output `{ kpis, report_cards }` (§6)
- [ ] Bind interfaces trong ServiceProvider Platform
- [ ] Route `GET /api/v1/platform/reports/overview` (guard `auth:requester`)
- [ ] `total_platform_revenue` lấy lại từ `RevenueReportService` (3 nguồn — Quyết định #4), KHÔNG tính song song
- [ ] Tránh loop resi_mart lặp: tái dùng `ReportAggregationService::collectPlatformVendorOrders` (README §3.4) nếu nhiều service cùng cần
- [ ] PSR-4 + `make format` → `make lint`
- [ ] Tests (Platform feature, SQLite `:memory:`): KPI khớp tổng từ service con; `total_platform_revenue` = đủ 3 nguồn; `months` ngoài 1–12 → 422; tenant/partner rỗng → tất cả KPI = 0; `active_residents ≤ total_residents`. **Không** chạm Postgres.
- [ ] Phần chung: README §8.
```
