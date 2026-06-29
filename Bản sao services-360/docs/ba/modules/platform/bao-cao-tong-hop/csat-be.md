# Báo cáo "Chất lượng & CSAT" (Platform) — Đặc tả kỹ thuật Backend

> Module: `Platform/Report` (submodule) | Báo cáo #2 trong cụm | Ngày tạo: 2026-06-18 | Trạng thái: Draft
> Nguồn mockup: `BA-TNP-SERVICES/app/pages/platform/modules/bao-cao-tong-hop/chat-luong-csat.vue` + composable `csatReport` (trong `usePlatformReportData.ts`).
> **Nền tảng chung:** [`./README.md`](./README.md) — kiến trúc tổng hợp, route prefix, conventions, deps. File này CHỈ mô tả phần riêng của báo cáo CSAT, không lặp lại nền tảng.

---

## 1. Header

- **Báo cáo:** Chất lượng & CSAT (Customer Satisfaction).
- **Mockup:** `chat-luong-csat.vue`, composable `csatReport`.
- **Miền dữ liệu:** **đơn marketplace vendor resi_mart** (README §3.2 miền 2). KHÔNG đọc đơn PMC nội bộ tenant, KHÔNG đọc B2B `TenantServiceOrder`.
- **Điểm đặc thù:** đây là báo cáo **kéo theo wiring đánh giá cư dân** (README §9, Decision #3). Phần BE NẶNG nhất của cả cụm nằm ở đây — xem §9.

---

## 2. Tổng quan (đọc miền marketplace)

Báo cáo đo **chất lượng phục vụ cư dân** trên toàn bộ đơn marketplace vendor (product order + service booking ở schema resi_mart), tổng hợp xuyên tất cả vendor/partner và dự án:

- **Điểm hài lòng (CSAT)** từ đánh giá cư dân (`resident_rating`, thang 1–5) trên đơn đã có đánh giá.
- **Tỷ lệ phản hồi** (bao nhiêu % đơn được cư dân đánh giá).
- **Tỷ lệ hoàn tất / huỷ đơn** từ trạng thái đơn.
- Phân rã CSAT **theo sao**, **theo vendor**, **theo dự án**, và danh sách **đánh giá thấp cần theo dõi** (≤3 sao).

Toàn bộ là **lớp tổng hợp read-only** (README §1) đọc lại fact-set marketplace platform-wide (README §3.4) — KHÔNG ghi gì runtime. Phần ghi duy nhất là **migration wiring** ở resi_mart/Marketplace (§9), chạy 1 lần lúc triển khai.

> ⚠️ Theo tiền lệ [`../tong-quan-kinh-doanh-tenant-be.md`](../tong-quan-kinh-doanh-tenant-be.md): KHÔNG trộn đơn marketplace với đơn PMC. Báo cáo CSAT chỉ tính đơn marketplace.

---

## 3. Endpoint

| Action | Method | URL | Request Class |
|--------|--------|-----|---------------|
| Báo cáo CSAT | GET | `/api/v1/platform/reports/csat` | `ListCsatReportRequest` |

- Đặt trong `Platform/routes/*.php`, guard `auth:requester` (theo README §3.1, cùng nhóm với `tenant-service-orders`).
- Controller: `Platform/Report/Controllers/CsatReportController@index` → `CsatReportService::build($filters)` → `response()->json(['success' => true, 'data' => ...])`.

---

## 4. Filter & Validation

### `ListCsatReportRequest`

Hai cách chọn kỳ (theo README §5): hoặc `from`/`to`, hoặc `months`. Nếu có cả hai → ưu tiên `from`/`to`.

| Field | Rules | Message (VI) |
|-------|-------|--------------|
| `from` | `nullable`, `date`, `required_with:to` | Ngày bắt đầu không hợp lệ |
| `to` | `nullable`, `date`, `after_or_equal:from` | Ngày kết thúc phải sau hoặc bằng ngày bắt đầu |
| `months` | `nullable`, `integer`, `min:1`, `max:12` | Số tháng phải từ 1 đến 12 |

- Mặc định khi không truyền gì: `months = 6` → kỳ = từ **đầu tháng** `(now - 5)` đến **hết tháng hiện tại** (README §5).
- `months` ngoài 1–12 → **422**.
- Không có entity rỗng nào gây lỗi: tenant/partner rỗng → trả `0`/mảng rỗng (README §5).

---

## 5. Nguồn dữ liệu & logic tổng hợp

Service gom **1 lần** fact-set marketplace platform-wide qua `collectPlatformVendorOrders(from, to)` (README §3.4) — trả các row gồm tối thiểu: `partner_id`, `partner_name`, `project_id`, `project_name`, `resident_name`, `status`, `resident_rating` (nullable 1–5), `resident_rating_comment` (nullable), `created_at`. Sau đó tính tất cả KPI/bảng từ tập row đó (KHÔNG loop resi_mart lại cho từng KPI).

Ký hiệu: `total` = tổng số đơn marketplace trong kỳ; `rated` = các đơn có `resident_rating` không null; `completed`/`cancelled` = đơn theo status (§6).

### 5.1 KPI (`kpis`)

| KPI | Công thức | Ghi chú |
|-----|-----------|---------|
| `avg_rating` | trung bình `resident_rating` của các đơn `rated` | `null` nếu `rated_count = 0` (chưa có đánh giá / chưa wiring) |
| `rated_count` | số đơn `rated` | |
| `total_orders` | `count(total)` | |
| `completion_rate` | `round(completed / total * 100)` | 0 nếu `total = 0` |
| `cancel_rate` | `round(cancelled / total * 100)` | 0 nếu `total = 0` |
| `response_rate` | `round(rated_count / total * 100)` | 0 nếu `total = 0`; = tỷ lệ phản hồi đánh giá |

> `completion`/`cancel` lấy từ **status** đơn (§6), KHÔNG từ rating. `avg_rating`/`response` lấy từ **rating** (wiring §9).

### 5.2 Phân bố theo sao (`star_buckets`)

Mảng cố định 5 phần tử, `star` từ **5 → 1**:

```
star_buckets = [5,4,3,2,1].map(s => ({ star: s, count: số đơn có resident_rating == s }))
```

Chỉ đếm đơn `rated`. Tổng `count` = `rated_count`.

### 5.3 CSAT theo vendor (`by_vendor`)

Gom theo `partner_id`. Mỗi phần tử:

| Field | Công thức |
|-------|-----------|
| `partner_id` | khoá nhóm |
| `partner_name` | tên vendor (từ fact-set / Partner ExternalService, README §6) |
| `order_count` | tổng đơn của vendor trong kỳ |
| `completed_count` | đơn `completed` của vendor |
| `cancel_count` | đơn `cancelled` của vendor |
| `avg_rating` | trung bình rating của đơn `rated` của vendor (`null` nếu vendor chưa có đơn đánh giá) |
| `rated_count` | số đơn `rated` của vendor |

**Sắp xếp:** `avg_rating` giảm dần (vendor chưa có rating → `null` xếp cuối).

### 5.4 CSAT theo dự án (`by_project`)

Gom theo `project_id`. Mỗi phần tử: `project_id`, `project_name`, `order_count`, `avg_rating` (`null` nếu chưa có đánh giá), `rated_count`. **Sắp xếp:** `avg_rating` giảm dần (null cuối).

### 5.5 Đánh giá thấp cần theo dõi (`low_ratings`)

- Lọc các đơn `rated` có `resident_rating <= 3`.
- **Sắp xếp:** `resident_rating` tăng dần (1 sao lên đầu — ưu tiên xử lý).
- **Lấy tối đa 10** đơn (top 10).
- Mỗi phần tử: `partner_name`, `project_name`, `resident_name`, `resident_rating`, `resident_rating_comment` (có thể null/rỗng).

---

## 6. Business Rules

- [ ] **Rating thang 1–5** (int). Đơn không có rating (`null`) KHÔNG vào `avg_rating`, `star_buckets`, `low_ratings`, nhưng VẪN vào `total_orders` (mẫu số của `response_rate`).
- [ ] **Tập status hoàn tất** (`completed`): theo enum trạng thái đơn marketplace resi_mart đã hoàn thành/giao xong (xác nhận map khi triển khai — xem §9.2). **Tập status huỷ** (`cancelled`): các trạng thái huỷ/từ chối. Trạng thái khác (đang xử lý) tính vào `total` nhưng không vào completed/cancel.
- [ ] `completion_rate = round(completed/total*100)`, `cancel_rate = round(cancelled/total*100)`, `response_rate = round(rated_count/total*100)` — tất cả là **số nguyên %**.
- [ ] `avg_rating` = trung bình cộng các đơn `rated`; trả số thực (FE hiển thị 1 chữ số thập phân). `null` khi không có đơn đánh giá nào trong phạm vi.
- [ ] `low_ratings` = **top 10** đơn rating ≤3, sắp xếp rating tăng dần.
- [ ] `by_vendor`/`by_project` sắp xếp `avg_rating` giảm dần; nhóm chưa có rating (`avg_rating = null`) xếp **cuối**.
- [ ] **Lấp kỳ rỗng:** kỳ không có đơn nào → `kpis` về `0`/`null`, `star_buckets` 5 phần tử count=0, `by_vendor`/`by_project`/`low_ratings` = `[]`. KHÔNG lỗi.
- [ ] **Read-only runtime** — không ghi schema tenant/resi_mart khi chạy báo cáo.
- [ ] **Cross-DB resi_mart không khả dụng** (thiếu schema/env) → trả số `0`/mảng rỗng + cờ cảnh báo, KHÔNG 500 (đồng bộ pattern `ProjectVendorService` / `schema_missing`).

---

## 7. Presenter Output

`CsatReportResource` (extends `BaseResource`) trả đúng shape mockup. Rating có thể `null`; mọi `%` là **số nguyên**. Key presenter = snake_case (README §5).

```json
{
  "success": true,
  "data": {
    "kpis": {
      "avg_rating": 4.3,
      "rated_count": 128,
      "total_orders": 540,
      "completion_rate": 86,
      "cancel_rate": 7,
      "response_rate": 24
    },
    "star_buckets": [
      { "star": 5, "count": 70 },
      { "star": 4, "count": 38 },
      { "star": 3, "count": 12 },
      { "star": 2, "count": 5 },
      { "star": 1, "count": 3 }
    ],
    "by_vendor": [
      {
        "partner_id": 12,
        "partner_name": "Công ty Đối tác Demo",
        "order_count": 120,
        "completed_count": 104,
        "cancel_count": 8,
        "avg_rating": 4.6,
        "rated_count": 40
      }
    ],
    "by_project": [
      {
        "project_id": 5,
        "project_name": "Dự án X",
        "order_count": 88,
        "avg_rating": 4.4,
        "rated_count": 25
      }
    ],
    "low_ratings": [
      {
        "partner_name": "Vendor B",
        "project_name": "Dự án Y",
        "resident_name": "Nguyễn Văn A",
        "resident_rating": 1,
        "resident_rating_comment": "Giao trễ, thái độ chưa tốt"
      }
    ]
  }
}
```

- Trả qua `response()->json(['success' => true, 'data' => ...])` (README §5).
- `avg_rating` ở `kpis`/`by_vendor`/`by_project` có thể `null` khi `rated_count = 0`.
- Khi cross-DB không khả dụng, có thể kèm `"warnings": { "schema_missing": true }` ở cấp `data` (xem §6).

---

## 8. Cross-Module Dependencies (ExternalService)

Theo README §6 (ExternalService chỉ giữa top-level module; trong cùng Platform → import trực tiếp):

| Dependency | Module nguồn | Interface (gợi ý) | Dùng cho |
|-----------|-------------|-------------------|----------|
| Tổng hợp đơn marketplace platform-wide (status, partner_id, project_id, **resident_rating + comment**, customer_source) | Marketplace/VendorOrder | `PlatformVendorOrderAggregationExternalServiceInterface` (**mở rộng** cái đã có để kèm 3 trường rating + partner_id/project_id) | toàn bộ KPI/bảng |
| Vendor (`partner_name`, status) | Marketplace/Partner | `PartnerExternalServiceInterface` (đã có) | `by_vendor`, hiển thị tên |

- `Platform/Report` gọi 2 ExternalService Marketplace; Marketplace tự loop partner + `ResiMartConnection::runInTenantSchema(...)` (README §3.3).
- KHÔNG import model resi_mart ở phía Platform. KHÔNG FK xuyên schema.

---

## 9. Entities / Migration & WIRING đánh giá cư dân (Phase-1 — phần BE NẶNG nhất)

> Quyết định #3 (README §2): **"CSAT làm đầy đủ ngay"**. Resident rating trên đơn marketplace hiện đang **DEFERRED** (tiền lệ [`../quan-ly-vendor-be.md`](../quan-ly-vendor-be.md) §6: rating chưa gắn `partner_id` rõ ràng nên hiển thị empty state). Spec này coi **wiring là việc Phase-1 bắt buộc** cho báo cáo CSAT — KHÔNG defer.

Đây là công việc **cross-repo** (README §9). Gồm 2 nhánh: migration ở **resi_mart** + mở rộng đọc ở **Marketplace (repo này)**.

### 9.1 resi_mart (repo sibling `/Users/thaibz/Desktop/projects/resi_mart`)

resi_mart dùng Stancl schema-per-tenant Postgres (tiền lệ `reference_resi_mart_project`). Thêm/đảm bảo các cột trên **cả 2 bảng đơn**: product order **và** service booking.

**Cột đánh giá cư dân cần thêm (nullable, không phá dữ liệu cũ):**

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| Điểm đánh giá | `resident_rating` | `smallint` (hoặc `integer`) | `nullable`, giá trị 1–5 (validate ở app khi cư dân chấm) | CSAT score |
| Nhận xét | `resident_rating_comment` | `string`/`text` | `nullable` | Bình luận cư dân |
| Thời điểm đánh giá | `resident_rated_at` | `timestamp` | `nullable` | Mốc cư dân chấm điểm |

**Cột phục vụ gom nhóm — đảm bảo CÓ SẴN (nếu thiếu thì thêm/định danh):**

| Field | Column | Mục đích |
|-------|--------|----------|
| Vendor | `partner_id` | Gom `by_vendor`; bắt buộc có để aggregation gắn đơn ↔ vendor (đây chính là mắt xích đang thiếu khiến rating bị DEFER) |
| Dự án | `project_id` | Gom `by_project` |
| Nguồn khách | `customer_source` | Dùng cho báo cáo #4 (cùng fact-set), không bắt buộc cho CSAT nhưng wiring chung |

- **Migration resi_mart** chạy trên **mọi schema tenant** của resi_mart (theo cơ chế migration tenant của Stancl ở resi_mart). Các cột nullable → an toàn với đơn đã tồn tại (rating cũ = null → tính như "chưa đánh giá").
- Nơi ghi rating (app resi_mart, storefront cư dân) nằm ngoài phạm vi spec này; spec chỉ đảm bảo **schema sẵn sàng** để platform ĐỌC. Việc bật UI chấm điểm cho cư dân có thể làm sau, nhưng cột phải có để aggregation không vỡ.

### 9.2 Marketplace/VendorOrder (repo này)

- Mở rộng aggregation ExternalService (`PlatformVendorOrderAggregationExternalServiceInterface`) + `VendorOrderRepository` để **đọc thêm** 3 trường `resident_rating`, `resident_rating_comment`, `resident_rated_at`, và **đảm bảo mỗi row có `partner_id`, `project_id`, `customer_source`** (README §3.4 fact-set chuẩn hoá).
- Model read-only đơn marketplace (`VendorOrder`, đọc cross-DB resi_mart như tiền lệ) bổ sung mapping 3 cột rating. **Xác nhận tên cột/bảng thật** của product order + service booking resi_mart khi triển khai (giống cảnh báo `quan-ly-vendor-be.md` §5.2 với bảng `products`).
- **Map trạng thái** completed/cancelled (§6) phải dựa trên enum trạng thái đơn marketplace thật của resi_mart — xác nhận tập giá trị khi code, KHÔNG hard-code rời rạc (dùng enum/`Rule::in` theo convention).
- Nếu schema resi_mart thiếu cột rating (chưa migrate) → đọc về `null`, báo cáo vẫn chạy (rating = "chưa đánh giá"), KHÔNG 500.

### 9.3 Ghi chú cross-repo (bắt buộc)

- Đây là thay đổi **2 repo** (resi_mart + residential-management). Cần **đồng bộ với resi_mart** và **verify trên Postgres dev trước deploy** — tiền lệ [`project_vendor_tab_platform_project`] (README §9).
- Thứ tự an toàn: (1) migrate cột resi_mart trên Postgres dev → (2) mở rộng aggregation đọc rating → (3) verify báo cáo CSAT trả số thật trên dev → (4) deploy.
- Trước khi resi_mart migrate xong, báo cáo vẫn hoạt động: tất cả `avg_rating = null`, `rated_count = 0`, `response_rate = 0`, `star_buckets` count=0, `low_ratings = []`. FE hiển thị "—" ở cột CSAT (xem `csat-fe.md`).
- Các báo cáo #3/#4/#6/#7 cùng đọc fact-set này nên hưởng lợi từ wiring (README §9 lưu ý).

---

## 10. Checklist triển khai BE

- [ ] Submodule `Platform/Report`: `Controllers/CsatReportController`, `Services/CsatReportService` + interface, `Requests/ListCsatReportRequest`, `Resources/CsatReportResource` (theo README §8 — phần chung).
- [ ] `CsatReportService::build()` đọc fact-set qua `collectPlatformVendorOrders(from, to)` (README §3.4) rồi tính `kpis`/`star_buckets`/`by_vendor`/`by_project`/`low_ratings`.
- [ ] `ListCsatReportRequest` validate `from`/`to`/`months` (§4); default `months = 6`.
- [ ] Route `GET /api/v1/platform/reports/csat` + guard `auth:requester`.
- [ ] **WIRING resi_mart (cross-repo):** migration thêm `resident_rating` / `resident_rating_comment` / `resident_rated_at` + đảm bảo `partner_id`/`project_id`/`customer_source` trên product order & service booking (§9.1). Chạy trên Postgres dev.
- [ ] **WIRING Marketplace:** mở rộng `PlatformVendorOrderAggregationExternalService` + `VendorOrderRepository` đọc 3 trường rating + partner_id/project_id (§9.2); map status completed/cancelled bằng enum thật.
- [ ] **Verify Postgres dev** rằng aggregation trả rating thật trước deploy (§9.3); xử lý `schema_missing` → trả rỗng, không 500.
- [ ] PSR-4 + `make format` → `make lint`.
- [ ] Tests (Platform feature, SQLite `:memory:`, KHÔNG chạm Postgres): `avg_rating`/`response_rate`/`completion_rate`/`cancel_rate` đúng; `star_buckets` 5 phần tử đếm đúng theo sao; `by_vendor`/`by_project` sort `avg_rating` giảm (null cuối); `low_ratings` ≤3 sao top10 sort tăng; rating null → không vào avg nhưng vào total; kỳ rỗng → 0/`[]`; `months` ngoài 1–12 → 422; cross-DB thiếu schema → rỗng + warning.
- [ ] **Phần chung:** xem [`README.md`](./README.md) §8 (checklist triển khai chung của cụm).
```