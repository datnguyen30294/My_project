# Báo cáo "Phân khúc cư dân" (Platform) — Đặc tả kỹ thuật Backend

> Module: `Platform/Report` (báo cáo #4) | Ngày tạo: 2026-06-18 | Trạng thái: Draft
> Nguồn mockup: `BA-TNP-SERVICES/app/pages/platform/modules/bao-cao-tong-hop/phan-khuc-cu-dan.vue` + composable `residentInsights` (trong `usePlatformReportData.ts`).
> **Nền tảng chung:** [`./README.md`](./README.md) — kiến trúc tổng hợp, route prefix, conventions, cross-module deps, checklist. Bản này CHỈ mô tả phần riêng của báo cáo "Phân khúc cư dân", tham chiếu README cho phần chung.

---

## 1. Header & phạm vi

Báo cáo **đọc-chỉ (read-only)**, tổng hợp **xuyên toàn bộ tenant/partner**. Phân tích hành vi mua hàng của cư dân trên **miền đơn marketplace vendor (resi_mart)**, chia theo `customer_source` (cư dân thuộc dự án vs khách vãng lai). Bổ sung tỷ lệ cư dân có đơn trên tổng danh bạ cư dân (lấy từ PMC/Customer).

- **KHÔNG bảng/entity mới** — xem §9.
- Tuân theo conventions chung README §5 (response, tiền số nguyên, enum `{value,label}`, lấp tháng đủ, filter kỳ).

---

## 2. Tổng quan (miền dữ liệu & định nghĩa)

### 2.1 Miền đơn hàng

Báo cáo này đọc **DUY NHẤT miền đơn marketplace vendor resi_mart** (README §3.2 mục 2) — product order + service booking, có gắn `customer_source` và `resident` mỗi đơn. **KHÔNG** đọc đơn PMC nội bộ tenant, **KHÔNG** đọc đơn B2B `TenantServiceOrder`.

> Ngoại lệ duy nhất: **tổng số cư dân danh bạ** (`totalResidents`) đến từ **PMC/Customer** (README §6 — `CustomerExternalService`), không phải từ đơn marketplace. Đây là mẫu số để tính tỷ lệ "cư dân có đơn".

### 2.2 Định nghĩa `customer_source`

`customer_source` là thuộc tính trên **đơn marketplace**, phân biệt người đặt đơn:

| Giá trị | Nhãn | Ý nghĩa |
|---------|------|---------|
| `project` | Cư dân dự án | Người đặt là cư dân thuộc một dự án do công ty VH quản lý |
| `walk_in` | Khách vãng lai | Người đặt không gắn dự án (khách lẻ) |

### 2.3 Các khái niệm chỉ số

- **activeResidents** = số **cư dân riêng biệt (distinct)** có ≥ 1 đơn marketplace active trong kỳ.
- **totalResidents** = tổng danh bạ cư dân PMC/Customer (toàn bộ tenant). Là **mẫu số** cho tỷ lệ "cư dân có đơn".
- **projectOrderShare** = (số đơn `project`) / (tổng đơn active) × 100, làm tròn số nguyên %.
- **walkInOrderShare** = (số đơn `walk_in`) / (tổng đơn active) × 100, làm tròn số nguyên %.
- **projectGmv / walkInGmv** = tổng GMV (số tiền đơn) theo từng `customer_source`.
- **avgRating / ratedCount** = CSAT trung bình & số đơn được đánh giá — phụ thuộc wiring rating (xem §5.4 & README §9). Nếu chưa wiring → `avg_rating = null` (FE hiển thị "—"), `rated_count = 0`.

---

## 3. Endpoint

| Action | Method | URL | Request Class |
|--------|--------|-----|---------------|
| Phân khúc cư dân | GET | `/api/v1/platform/reports/resident-segments` | `ListResidentSegmentReportRequest` |

- Đặt trong `Platform/routes/*.php`, cùng nhóm guard platform hiện hữu (`auth:requester`) — kiểm tra sibling `tenant-service-orders`, `tenants/{id}/business-summary` khi code (README §3.1).
- Controller: `ResidentSegmentReportController@index` (submodule `Platform/Report`).
- Quyền: `platform.reports.view` (README §7).

---

## 4. Filter & Validation

### ListResidentSegmentReportRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `months` | `nullable`, `integer`, `min:1`, `max:12` | Số tháng phải từ 1 đến 12 |

- Default `months = 6`. Kỳ: từ **đầu tháng** `(now - months + 1)` đến **hết tháng hiện tại** (README §5).
- Ngoài range 1–12 → **422**.
- Form Request bắt buộc, KHÔNG validate inline (README §5).

---

## 5. Nguồn dữ liệu & logic tổng hợp

### 5.1 Fact-set dùng chung

Tái dùng method gom fact-set marketplace platform-wide của `ReportAggregationService` (README §3.4) — `collectPlatformVendorOrders(from, to)` trả tập row chuẩn hóa, mỗi row gồm tối thiểu: `residentId`, `residentName`, `customerSource`, `amount` (GMV), `status`, `residentRating`. Báo cáo này **lọc đơn active** rồi gom theo `customer_source` và theo `resident`.

> KHÔNG tự loop resi_mart lại cho từng KPI (README §3.3 cảnh báo hiệu năng). Đọc fact-set 1 lần, tính nhiều chiều.

### 5.2 Pattern cross-tenant/partner

- Loop partner marketplace: `foreach ($partners)` + `ResiMartConnection::runInTenantSchema(...)` — tiền lệ `VendorOrderService::getRevenueTrendPlatform` (README §3.3).
- `totalResidents`: gọi `CustomerExternalServiceInterface` đếm tổng danh bạ cư dân (loop tenant `$tenant->run()` nếu cần — theo tiền lệ `CustomerExternalService`).

### 5.3 Các bước tính

1. Lấy fact-set đơn marketplace trong kỳ; **lọc chỉ đơn active** (§6).
2. **segments:** group theo `customer_source` (`project`, `walk_in`); mỗi nhóm tính `orderCount`, `gmv`, `avgRating`, `ratedCount`.
3. **kpis:**
   - `activeResidents` = đếm distinct `residentId` trong fact-set active.
   - `totalResidents` = tổng danh bạ PMC/Customer.
   - `projectOrderShare` / `walkInOrderShare` = share đơn theo source (% nguyên).
   - `projectGmv` / `walkInGmv` = GMV theo source.
4. **topResidents:** group fact-set theo `residentId`, tính `orderCount`/`gmv`/`avgRating`/`ratedCount`, **sort desc theo orderCount**, lấy **top 10**.

### 5.4 Đánh giá (CSAT)

`avgRating`/`ratedCount` phụ thuộc wiring `resident_rating` trên đơn marketplace (README §9, chi tiết ở `csat-be.md`). Nếu fact-set chưa có rating → trả `avg_rating = null`, `rated_count = 0` cho mọi segment & resident. Không chặn báo cáo.

---

## 6. Business Rules

- [ ] **Chỉ tính đơn active** trên miền marketplace (đơn đã xác nhận/hoàn tất theo định nghĩa active của fact-set; loại đơn hủy/nháp). Mốc kỳ theo `createdAt` của đơn trong fact-set.
- [ ] **`customer_source` chỉ nhận `project` hoặc `walk_in`.** Đơn không xác định source → bỏ qua khỏi segment (hoặc gom theo quy ước fact-set; ghi rõ khi code, ưu tiên khớp sibling).
- [ ] **`activeResidents` đếm distinct cư dân** (theo `residentId`), KHÔNG đếm số đơn.
- [ ] **`topResidents` = top 10**, sort desc theo `orderCount` (tie-break có thể theo `gmv` desc — quyết định lúc code).
- [ ] **Tỷ lệ (%) làm tròn số nguyên.** `projectOrderShare + walkInOrderShare` có thể không bằng đúng 100 do làm tròn — chấp nhận.
- [ ] **Tổng đơn = 0** → mọi share = 0, segments có `orderCount=0/gmv=0`, `topResidents=[]`. Không lỗi chia 0.
- [ ] **Tenant/partner rỗng** → trả 0 / mảng rỗng, không lỗi (README §5).
- [ ] **CSAT chưa wiring** → `avg_rating=null`, `rated_count=0` (§5.4).
- [ ] **Read-only thuần** — không ghi gì vào schema tenant/resi_mart.

---

## 7. Presenter Output

`ResidentSegmentReportResource` (extends `BaseResource`). Trả qua `response()->json(['success' => true, 'data' => ...])` (README §5). Tiền là số nguyên đồng (không format ở BE); % là số nguyên đã làm tròn; `source` trả `{value,label}`.

```json
{
  "success": true,
  "data": {
    "kpis": {
      "active_residents": 184,
      "total_residents": 512,
      "project_order_share": 68,
      "walk_in_order_share": 32,
      "project_gmv": 1240000000,
      "walk_in_gmv": 583000000
    },
    "segments": [
      {
        "source": { "value": "project", "label": "Cư dân dự án" },
        "order_count": 612,
        "gmv": 1240000000,
        "avg_rating": 4.6,
        "rated_count": 410
      },
      {
        "source": { "value": "walk_in", "label": "Khách vãng lai" },
        "order_count": 288,
        "gmv": 583000000,
        "avg_rating": 4.3,
        "rated_count": 175
      }
    ],
    "top_residents": [
      {
        "resident_name": "Nguyễn Văn A",
        "order_count": 24,
        "gmv": 86000000,
        "avg_rating": 4.8,
        "rated_count": 20
      }
    ]
  }
}
```

- `avg_rating`: `null` khi chưa wiring rating hoặc `rated_count = 0` (FE hiển thị "—").
- `top_residents` tối đa 10 phần tử, đã sort desc theo `order_count`.

---

## 8. Cross-Module Dependencies (ExternalService)

Theo README §6:

| Dependency | Module nguồn | Interface | Dùng cho |
|-----------|-------------|-----------|----------|
| Tổng hợp đơn marketplace platform-wide (GMV, customer_source, resident, rating) | Marketplace/VendorOrder | `PlatformVendorOrderAggregationExternalServiceInterface` | segments, kpis (share/gmv), topResidents |
| Tổng danh bạ cư dân (count toàn tenant) | PMC/Customer | `CustomerExternalServiceInterface` | `total_residents` |

> ExternalService chỉ giữa top-level module (Platform ↔ Marketplace, Platform ↔ PMC). Trong cùng Platform → import trực tiếp (README §6). KHÔNG bypass repository; nếu thiếu method count cư dân → mở rộng `CustomerExternalService`.

---

## 9. Entities / Migration

**Không bảng mới — read-only.** Báo cáo chỉ đọc lại fact-set đơn marketplace (resi_mart) + count danh bạ cư dân (PMC/Customer). Không cột mới ở phía báo cáo này.

> Lưu ý: `avg_rating` phụ thuộc wiring `resident_rating` trên đơn marketplace — phần migration đó thuộc resi_mart + Marketplace, mô tả ở `csat-be.md` / README §9, KHÔNG thuộc báo cáo này.

---

## 10. Checklist BE

> **Phần chung:** README §8 (submodule structure, ReportAggregationService fact-set, routes/guard, PSR-4, format/lint, tests SQLite `:memory:` không chạm Postgres).

Riêng báo cáo này:

- [ ] `ResidentSegmentReportController@index` → `ResidentSegmentReportService` → `response()->json`.
- [ ] `ResidentSegmentReportService` (+ interface): đọc fact-set marketplace + count cư dân, gom segments/kpis/topResidents.
- [ ] `ListResidentSegmentReportRequest` (rule `months`).
- [ ] `ResidentSegmentReportResource` đúng shape §7 (`source` {value,label}, tiền int, % int, `avg_rating` nullable).
- [ ] Mở rộng `CustomerExternalServiceInterface` (count cư dân) nếu thiếu method.
- [ ] Route `GET /api/v1/platform/reports/resident-segments` (guard `auth:requester`).
- [ ] Tests (Platform feature, SQLite `:memory:`): tổng share/gmv đúng; distinct activeResidents; topResidents top 10 sort desc orderCount; share không chia 0 khi 0 đơn; CSAT chưa wiring → `avg_rating=null`; `months` ngoài 1–12 → 422; tenant/partner rỗng → 0.
