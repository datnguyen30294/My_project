# Báo cáo "Hiệu suất vendor" (Platform) — Đặc tả kỹ thuật Backend

> Module: `Platform/Report` | Báo cáo #7 | Ngày tạo: 2026-06-18 | Trạng thái: Draft
> Nguồn mockup: `BA-TNP-SERVICES/app/pages/platform/modules/bao-cao-tong-hop/hieu-suat-vendor.vue` + composable `usePlatformReportData.ts` (`vendorScorecard`).
> **Nền tảng chung (BẮT BUỘC đọc trước):** [`./README.md`](./README.md) — kiến trúc tổng hợp, route prefix, fact-set dùng chung (§3.4), conventions (§5), cross-module deps (§6), checklist chung (§8), wiring CSAT (§9).
>
> File này CHỈ mô tả phần riêng của báo cáo "Hiệu suất vendor". Mọi quy ước không nhắc lại đều theo README.

## 1. Tổng quan

Báo cáo **đọc-chỉ (read-only)** trả về **bảng điểm (scorecard) toàn bộ vendor (đối tác B3)** có phát sinh đơn marketplace, xếp giảm dần theo GMV. Mỗi dòng là một vendor với các chỉ số hiệu suất: số đơn, GMV, hoa hồng, phí nền tảng, tỷ lệ hoàn tất / huỷ, CSAT, số sản phẩm / dịch vụ.

Đây là một **VIEW báo cáo** (góc nhìn so sánh chéo vendor), KHÔNG phải console quản lý. So với console **"Quản lý Vendor"** ([`../quan-ly-vendor-be.md`](../quan-ly-vendor-be.md)) — vốn quản lý vòng đời từng vendor (duyệt, vô hiệu, hợp đồng hoa hồng, chi tiết tab) — báo cáo này chỉ tổng hợp số liệu nhiều vendor cạnh nhau để ra quyết định danh mục. Báo cáo **không** ghi/sửa/xoá gì.

**Miền dữ liệu:** chỉ **đơn marketplace vendor resi_mart** (README §3.2 miền 2). KHÔNG trộn đơn PMC nội bộ tenant. GMV/hoa hồng/phí platform/CSAT/SP-DV đều thuộc miền marketplace.

## 2. Quan hệ với console "Quản lý Vendor" — tránh tính trùng

- Báo cáo này tái dùng **cùng fact-set marketplace platform-wide** mà README §3.4 mô tả (`collectPlatformVendorOrders(from, to)` trong `ReportAggregationService`). Đây cũng là tập dữ liệu mà `VendorOrderRepository::summaryForPartner` / trend của console "Quản lý Vendor" gom theo từng partner.
- **Khác biệt:** console gom **một** vendor mỗi lần (theo `partnerId`); báo cáo gom **tất cả** vendor một lượt rồi map per-partner. → Để tránh O(số vendor) lần switch schema resi_mart, báo cáo **PHẢI** đọc fact-set một lần (toàn bộ partner) rồi `groupBy(partner_id)` tính các chỉ số, KHÔNG gọi lại `summaryForPartner` từng vendor trong vòng lặp.
- Danh sách vendor + `displayName` + `status` lấy từ `Marketplace/Partner` (xem §8).

## 3. Endpoint

| Action | Method | URL | Request Class |
|--------|--------|-----|---------------|
| Scorecard hiệu suất vendor | GET | `/api/v1/platform/reports/vendor-scorecard` | `ListVendorScorecardReportRequest` |

- Đặt trong `Platform/routes/*.php`, prefix `/api/v1/platform/reports`, guard `auth:requester` (README §3.1).
- Controller: `VendorScorecardReportController@index` → `VendorScorecardReportService` → `response()->json(['success' => true, 'data' => ...])`.

## 4. Filter & Validation

### ListVendorScorecardReportRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `months` | `nullable`, `integer`, `min:1`, `max:12` | Số tháng phải từ 1 đến 12 |
| `sort` | `nullable`, `string`, `Rule::in(['gmv','order_count','commission','platform_fee','completion_rate','cancel_rate','avg_rating'])` | Trường sắp xếp không hợp lệ |

- Default `months = 6`. Kỳ tổng hợp = từ **đầu tháng** `(now - months + 1)` đến **hết tháng hiện tại** (đồng bộ `tong-quan-kinh-doanh-tenant-be.md` §5).
- `sort` tuỳ chọn; mặc định (không truyền) = `gmv` giảm dần (README mockup `vendorScorecard` sort desc gmv). Mọi trường sort đều áp **chiều giảm dần** (báo cáo xếp hạng).
- KHÔNG validate inline — dùng Form Request (README §5).

## 5. Nguồn dữ liệu & logic tổng hợp

### 5.1 Fact-set

Đọc tập đơn marketplace platform-wide trong kỳ (README §3.4): mỗi row có `partner_id`, `type` (product/service), `amount`, `commission_amount`, `platform_fee`, `status`, `resident_rating`, `created_at`. Vendor list (`id`, `displayName`, `status`) từ `Marketplace/Partner`.

### 5.2 Phân loại trạng thái đơn (per vendor)

| Nhóm | Định nghĩa | Dùng cho |
|------|-----------|----------|
| `orderCount` | tổng số đơn của vendor trong kỳ (mọi trạng thái) | mẫu số tỷ lệ; điều kiện "có đơn" |
| `activeCount` | đơn ở trạng thái active (chưa huỷ, đang/đã xử lý) | mẫu của GMV / commission / platformFee |
| `completedCount` | đơn `completed` | tử số completionRate |
| `cancelCount` | đơn `cancelled` | tử số cancelRate |

> Tập trạng thái active/completed/cancelled theo định nghĩa enum đơn marketplace (resi_mart) — khớp `isActiveMarketplaceOrder` / `isCompletedMarketplaceOrder` / `CANCELLED_STATUSES` của mockup. Xác nhận map enum thực tế khi triển khai (đồng bộ `VendorOrder`).

### 5.3 Chỉ số per vendor

| Chỉ số | Công thức | Ghi chú |
|--------|-----------|---------|
| `gmv` | `SUM(amount)` trên **đơn active** | tiền VND nguyên |
| `commission` | `SUM(commission_amount)` trên đơn active | |
| `platformFee` | `SUM(platform_fee)` trên đơn active | |
| `completionRate` | `round(completedCount / orderCount * 100)` | %, số nguyên; `orderCount = 0` → 0 |
| `cancelRate` | `round(cancelCount / orderCount * 100)` | %, số nguyên |
| `avgRating` | trung bình `resident_rating` các đơn có rating | nullable — xem 5.4 |
| `ratedCount` | số đơn có `resident_rating` | |
| `productCount` | số đơn `type = product` | |
| `serviceCount` | số đơn `type = service` | |

> GMV/commission/platformFee tính **trên đơn active** (loại đơn huỷ), trong khi completionRate/cancelRate tính trên **toàn bộ** đơn (`orderCount`). Đây là chủ đích — khớp mockup `vendorScorecard`.

### 5.4 Rating (CSAT) — phụ thuộc wiring

`avgRating` / `ratedCount` chỉ có giá trị **sau khi wiring `resident_rating` + `partner_id`** lên đơn marketplace (README §9, chi tiết ở [`./csat-be.md`](./csat-be.md)). Trước wiring: `avgRating = null`, `ratedCount = 0` (FE hiển thị "—"). Không lỗi, không chặn báo cáo.

## 6. Business Rules

- [ ] **Chỉ vendor có ≥ 1 đơn** trong kỳ mới xuất hiện (`orderCount > 0`); vendor không đơn bị lọc khỏi bảng (khớp mockup `.filter(r => r.orderCount > 0)`).
- [ ] **Mặc định sort giảm dần GMV.** Nếu `sort` được truyền → xếp giảm dần theo trường đó.
- [ ] **GMV/commission/platformFee** chỉ cộng trên **đơn active** (đã loại huỷ).
- [ ] **completionRate/cancelRate** = tỷ lệ trên tổng đơn (`orderCount`), **làm tròn số nguyên** (README §5).
- [ ] **avgRating nullable** khi chưa wiring rating; `ratedCount = 0` tương ứng.
- [ ] **Không partner/đơn nào** trong kỳ → trả `vendors: []` (không lỗi — README §5).
- [ ] **Read-only thuần** — không ghi resi_mart/tenant.
- [ ] Filter `months` ngoài 1–12 hoặc `sort` ngoài danh sách → **422**.
- [ ] Đọc fact-set **một lần** rồi group per-partner (§2) — tránh loop `summaryForPartner` từng vendor.

## 7. Presenter Output

`VendorScorecardReportResource` (extends `BaseResource`):

```json
{
  "success": true,
  "data": {
    "months": 6,
    "vendors": [
      {
        "partner_id": 12,
        "partner_name": "Công ty Đối tác Demo",
        "status": { "value": "active", "label": "Đang hoạt động" },
        "order_count": 48,
        "active_count": 44,
        "completed_count": 40,
        "cancel_count": 4,
        "completion_rate": 83,
        "cancel_rate": 8,
        "gmv": 612000000,
        "commission": 30600000,
        "platform_fee": 12240000,
        "avg_rating": 4.5,
        "rated_count": 20,
        "product_count": 30,
        "service_count": 18
      }
    ]
  }
}
```

- `status` enum → `{ value, label }` (README §5).
- Tiền (`gmv`, `commission`, `platform_fee`) là **số nguyên đồng**, không format ở BE (FE dùng `formatTenantMoney`).
- Tỷ lệ (`completion_rate`, `cancel_rate`) là **số nguyên** đã làm tròn.
- `avg_rating` **nullable** (null khi chưa wiring rating); `rated_count` = 0 tương ứng.
- Không `created_at` (README §5).

## 8. Cross-Module Dependencies (ExternalService)

> Theo README §6. ExternalService chỉ giữa các top-level module; trong cùng `Platform` import trực tiếp.

| Dependency | Module nguồn | Interface | Dùng cho |
|-----------|-------------|-----------|----------|
| Tổng hợp đơn marketplace platform-wide (GMV, commission, platform_fee, status, type, rating) | Marketplace/VendorOrder | `PlatformVendorOrderAggregationExternalServiceInterface` (mở rộng cái đã có — README §6) | fact-set per vendor |
| Vendor (danh sách, `displayName`, `status`) | Marketplace/Partner | `PartnerExternalServiceInterface` | tên + trạng thái mỗi dòng |

- `ReportAggregationService.collectPlatformVendorOrders(from, to)` (README §3.4, §8) cung cấp fact-set; service báo cáo group theo `partner_id`.
- Rating đọc qua cùng fact-set sau wiring (README §9) — KHÔNG gọi rating ExternalService riêng theo vendor.

## 9. Entities / Migration

**Không bảng mới — read-only.** Báo cáo chỉ tổng hợp dữ liệu marketplace đã có. (Wiring rating `resident_rating`/`partner_id` thuộc resi_mart + Marketplace — xem README §9 và [`./csat-be.md`](./csat-be.md), không phải migration của báo cáo này.)

## 10. Checklist triển khai BE

> Phần chung: README §8 (submodule layout, ReportAggregationService, routes + guard, PSR-4, `make format`/`make lint`, test SQLite `:memory:`).

- [ ] `VendorScorecardReportController@index` + route `GET /api/v1/platform/reports/vendor-scorecard` (guard `auth:requester`).
- [ ] `ListVendorScorecardReportRequest` (`months` 1–12, `sort` whitelist).
- [ ] `VendorScorecardReportService` + interface: lấy fact-set 1 lần (`collectPlatformVendorOrders`) → group per `partner_id` → tính chỉ số §5.3 → lọc `order_count > 0` → sort desc.
- [ ] Mở rộng `PlatformVendorOrderAggregationExternalService` nếu thiếu trường (type/status/rating) — KHÔNG bypass repository.
- [ ] `VendorScorecardReportResource` (§7), enum `{value,label}`, tiền int, `avg_rating` nullable.
- [ ] Tests (Platform feature, SQLite `:memory:`): sort desc gmv; chỉ vendor có đơn; GMV/fee chỉ trên đơn active; completionRate/cancelRate đúng & làm tròn int; rating chưa wiring → `avg_rating null`; không vendor/đơn → `vendors: []`; `months`/`sort` ngoài range → 422. **Không** chạm Postgres.
