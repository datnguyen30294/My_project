# Xu hướng dịch vụ (Platform) — Đặc tả kỹ thuật Backend

> Module: `Platform/Report` (submodule trong `Platform`) | Báo cáo #3 | Ngày tạo: 2026-06-18 | Trạng thái: Draft
> Nguồn mockup: `BA-TNP-SERVICES/app/pages/platform/modules/bao-cao-tong-hop/xu-huong-dich-vu.vue` + composable `serviceAdoption` (trong `usePlatformReportData.ts`).
> **Nền tảng chung:** [`./README.md`](./README.md) — kiến trúc tổng hợp, route prefix, hai miền đơn hàng, fact-set dùng chung, conventions, dependencies, checklist. File này CHỈ mô tả phần riêng của báo cáo "Xu hướng dịch vụ" và tham chiếu về README cho phần chung.

---

## 1. Header

- Báo cáo: **Xu hướng dịch vụ** (#3 trong cụm Báo cáo tổng hợp Platform).
- Mục tiêu: cho người vận hành nền tảng thấy **sản phẩm/dịch vụ marketplace nào đang được cư dân đặt nhiều nhất**, tỷ trọng sản phẩm (SP) vs dịch vụ (DV), top offer/vendor theo số đơn, và xu hướng số đơn theo tháng.
- Đọc-chỉ (read-only). Không bảng mới.

---

## 2. Tổng quan (miền dữ liệu)

- Báo cáo này đọc **DUY NHẤT miền đơn hàng marketplace vendor resi_mart** (README §3.2 — miền #2: product order + service booking, schema resi_mart). KHÔNG đọc đơn PMC nội bộ tenant, KHÔNG đọc đơn B2B `TenantServiceOrder`.
  - ⚠️ Theo tiền lệ bắt buộc ([`../tong-quan-kinh-doanh-tenant-be.md`](../tong-quan-kinh-doanh-tenant-be.md) §1): **KHÔNG trộn** đơn marketplace với số liệu kinh doanh PMC. "GMV" ở báo cáo này là **GMV marketplace** (giá trị đơn vendor), không phải doanh thu tenant.
- Nguồn fact-set: tập "đơn marketplace platform-wide" dùng chung của cụm báo cáo (README §3.4) — gom qua loop partner + `ResiMartConnection::runInTenantSchema()`, tiền lệ `VendorOrderService::getRevenueTrendPlatform`.
- Báo cáo trả 4 KPI + mix SP/DV + top 15 offer + chuỗi đơn theo tháng. **Chỉ tính đơn active** (không huỷ).

---

## 3. Endpoint

| Action | Method | URL | Request Class |
|--------|--------|-----|---------------|
| Xu hướng dịch vụ | GET | `/api/v1/platform/reports/service-adoption` | `ListServiceAdoptionReportRequest` |

- Đặt trong `Platform/routes/*.php` cùng nhóm guard platform hiện hữu (`auth:requester`) — kiểm tra sibling `tenant-service-orders`, `tenants/{id}/business-summary` khi code (README §3.1).
- Controller: `ServiceAdoptionReportController@index` (submodule `Platform/Report`) → `ServiceAdoptionReportService` → `response()->json(['success' => true, 'data' => ...])`.

---

## 4. Filter & Validation

### `ListServiceAdoptionReportRequest`

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `months` | `nullable`, `integer`, `min:1`, `max:12` | Số tháng phải từ 1 đến 12 |

- Default `months = 6`. Khoảng thời gian: từ **đầu tháng** `(now - months + 1)` đến **hết tháng hiện tại** (đồng nhất `ListTenantBusinessSummaryRequest`).
- `months` ngoài range → **422**. Không có filter nào khác (báo cáo platform-wide, không lọc theo tenant/partner cụ thể ở GĐ1).

---

## 5. Nguồn dữ liệu & logic tổng hợp

### 5.1 Fact-set đầu vào

Gọi method aggregation marketplace dùng chung (README §3.4, §6 — `PlatformVendorOrderAggregationExternalServiceInterface`), trả về tập row chuẩn hóa cho kỳ `[from, to]`. Mỗi row cần tối thiểu cho báo cáo này:

| Trường row | Mô tả |
|-----------|-------|
| `type` | `product` \| `service` (phân loại đơn marketplace) |
| `offer_title` | tên dịch vụ (với đơn `service`) |
| `first_line_title` | tên line đầu (với đơn `product`) — dùng làm "tên offer" cho SP |
| `partner_id` | id vendor (gom theo vendor) |
| `partner_name` | tên hiển thị vendor |
| `amount` | giá trị đơn (GMV, số nguyên đồng) |
| `status` | trạng thái đơn — dùng để loại đơn huỷ |
| `created_at` | mốc gom tháng |

> Lấy fact-set **một lần** rồi tính cả 4 mảng output (README §3.3: gom 1 lần đọc, tránh loop lại resi_mart cho từng KPI).

### 5.2 Lọc "đơn active"

- Loại bỏ đơn ở trạng thái huỷ (cancelled/rejected — khớp enum trạng thái đơn marketplace, kiểm tra `VendorOrder` khi code). Mọi tính toán bên dưới chỉ trên tập đơn active.
- `totalActive` = số đơn active trong kỳ.

### 5.3 Khóa gom "offer"

Một "offer" gom theo bộ khóa **`partnerId : type : title`**, trong đó:

- `type = product` → `title = first_line_title` (tên line đầu của đơn product).
- `type = service` → `title = offer_title` (tên dịch vụ).

Với mỗi nhóm: `orderCount = COUNT(đơn)`, `gmv = SUM(amount)`. Sắp xếp giảm dần theo `orderCount`, lấy **top 15** → mảng `offers`.

### 5.4 Mix theo loại (`byType`)

Gom đơn active theo `type` (product/service):

- mỗi loại: `orderCount`, `gmv = SUM(amount)`, `label` ("Sản phẩm" / "Dịch vụ").

### 5.5 KPI

| KPI | Công thức |
|-----|-----------|
| `total_offers` | số nhóm offer khác nhau (distinct theo khóa §5.3) trong kỳ |
| `top_offer` | nhóm offer có `orderCount` cao nhất (tên + số đơn) |
| `product_share` | `round(productOrderCount / totalActive * 100)` — % theo **số đơn** |
| `service_share` | `round(serviceOrderCount / totalActive * 100)` — % theo **số đơn** |

- `totalActive = 0` → mọi share = 0, `top_offer = null` (xem §6).

### 5.6 Chuỗi theo tháng (`monthly`)

- Dựng **skeleton N tháng** đủ kỳ rồi lấp 0 (README §3.3, tiền lệ `VendorOrderService::buildMonthSkeleton()`).
- Gom đơn active theo `to_char(created_at, 'YYYY-MM')`; mỗi tháng đếm:
  - `order_count` = tổng đơn active trong tháng,
  - `product_count` = đơn `type=product`,
  - `service_count` = đơn `type=service`,
  - `gmv` = `SUM(amount)`.
- Tháng không phát sinh → tất cả `0`.

---

## 6. Business Rules

- [ ] **Chỉ tính đơn active**: loại đơn huỷ ở mọi chiều (KPI, offers, byType, monthly). Mốc thời gian theo `created_at`.
- [ ] **Khóa gom offer** = `partnerId : type : title`; product lấy tên line đầu, service lấy `offer_title` (§5.3). Hai vendor khác nhau bán cùng tên dịch vụ → 2 offer khác nhau.
- [ ] **Top 15**: `offers` sắp xếp `orderCount` giảm dần, cắt 15 dòng đầu. Nếu < 15 nhóm → trả hết.
- [ ] **`product_share`/`service_share`** tính theo **số đơn** (không theo GMV); làm tròn số nguyên. Tổng 2 share = 100 (sai số làm tròn ±1 chấp nhận; không ép tổng).
- [ ] **`top_offer`**: nhóm có `orderCount` lớn nhất (tie → lấy nhóm `gmv` cao hơn, rồi tên alphabet). Không có đơn active → `null`.
- [ ] **Skeleton tháng đủ N**: chuỗi `monthly` luôn trả đủ N tháng theo thứ tự thời gian, tháng rỗng = 0 (README §5).
- [ ] **Partner/đơn rỗng**: không có partner hoặc không có đơn → `kpis` về 0/null, `offers=[]`, `byType=[]` (hoặc 2 dòng count 0 — chốt lúc code, ưu tiên mảng rỗng khi không có đơn nào), `monthly` vẫn đủ N tháng giá trị 0. KHÔNG lỗi (README §5).
- [ ] **Read-only thuần**: không ghi gì vào resi_mart (README §5).
- [ ] **GMV = giá trị đơn marketplace** (số nguyên đồng), KHÔNG phải doanh thu PMC tenant (README §3.2).

---

## 7. Presenter Output

`ServiceAdoptionReportResource` (extends `BaseResource`). Tiền: số nguyên đồng, **không format ở BE**. Loại đơn trả `{ value, label }`. Tỷ lệ (%) là số nguyên đã làm tròn.

```json
{
  "success": true,
  "data": {
    "kpis": {
      "total_offers": 48,
      "top_offer": { "title": "Vệ sinh máy lạnh", "order_count": 132 },
      "product_share": 38,
      "service_share": 62
    },
    "by_type": [
      { "type": { "value": "product", "label": "Sản phẩm" }, "order_count": 410, "gmv": 512000000 },
      { "type": { "value": "service", "label": "Dịch vụ" },  "order_count": 668, "gmv": 884000000 }
    ],
    "offers": [
      {
        "title": "Vệ sinh máy lạnh",
        "type": { "value": "service", "label": "Dịch vụ" },
        "partner_name": "Cơ điện lạnh ABC",
        "order_count": 132,
        "gmv": 198000000
      }
    ],
    "monthly": [
      { "month": "2026-01", "label": "T1/2026", "order_count": 160, "product_count": 60, "service_count": 100, "gmv": 232000000 },
      { "month": "2026-02", "label": "T2/2026", "order_count": 0,   "product_count": 0,  "service_count": 0,   "gmv": 0 }
    ]
  }
}
```

- `kpis.top_offer = null` khi không có đơn active.
- `offers` tối đa 15 phần tử, sắp xếp `order_count` giảm dần.
- `monthly` đủ N tháng (`months` filter), thứ tự thời gian tăng dần, `label` dạng `T{m}/{yyyy}`.
- Trả qua `response()->json(['success' => true, 'data' => ...])` (đồng nhất `OrganizationController::stats`, README §5).

---

## 8. Cross-Module Dependencies (ExternalService)

> Quy tắc README §6: ExternalService **chỉ giữa các top-level module** (Platform ↔ Marketplace). Trong cùng Platform → import trực tiếp.

| Dependency | Module nguồn | Interface (gợi ý) | Dùng cho |
|-----------|-------------|-------------------|----------|
| Tổng hợp đơn marketplace platform-wide (type, partner_id, partner_name, offer_title, first_line_title, amount, status, created_at) cho kỳ `[from,to]` | Marketplace/VendorOrder | `PlatformVendorOrderAggregationExternalServiceInterface` (mở rộng cái đã có — README §6) | offers, byType, monthly, KPI |

- Nếu method aggregation chưa trả đủ trường (`first_line_title`, `offer_title`) → **mở rộng ExternalService + Repository ở Marketplace**, KHÔNG bypass repository từ Service Report (README §8).
- Báo cáo này **KHÔNG** cần `PartnerExternalService` riêng (đã có `partner_name` trong fact-set), **KHÔNG** đọc PMC/TenantServiceOrder.

---

## 9. Entities / Migration

**Không bảng mới — read-only.** Toàn bộ đọc lại tập đơn marketplace platform-wide qua ExternalService Marketplace + `ResiMartConnection`. Không cột mới, không migration. (Báo cáo này KHÔNG phụ thuộc wiring CSAT ở README §9 — không đọc `resident_rating`.)

---

## 10. Checklist BE

> **Phần chung:** README §8 (submodule `Platform/Report`, `ReportAggregationService` gom fact-set 1 lần, routes prefix, PSR-4, tests SQLite `:memory:` không chạm Postgres).

- [ ] `Platform/Report/Requests/ListServiceAdoptionReportRequest` (rule `months` 1–12, default 6)
- [ ] `Platform/Report/Services/ServiceAdoptionReportService` + `Interface` (lấy fact-set 1 lần → lọc active → dựng offers top15 / byType / monthly skeleton / KPI)
- [ ] Bind interface trong ServiceProvider của `Platform`
- [ ] `Platform/Report/Controllers/ServiceAdoptionReportController@index` → service → `ServiceAdoptionReportResource` → `response()->json`
- [ ] `Platform/Report/Resources/ServiceAdoptionReportResource` (shape §7: money int, type `{value,label}`, % int)
- [ ] Mở rộng `PlatformVendorOrderAggregationExternalService` (Marketplace) nếu thiếu trường (qua Repository, không bypass)
- [ ] Route `GET /api/v1/platform/reports/service-adoption` (guard `auth:requester`)
- [ ] PSR-4 + `make format` → `make lint`
- [ ] Tests (Platform feature, SQLite `:memory:`): tổng offers/byType/monthly đúng; loại đơn huỷ khỏi mọi chiều; gom offer theo khóa `partnerId:type:title`; top 15 cắt đúng & sort theo order_count; product_share/service_share theo số đơn & làm tròn; skeleton lấp tháng rỗng = 0; `months` ngoài 1–12 → 422; partner/đơn rỗng → KPI 0, top_offer null, monthly đủ N tháng = 0. **Không** chạm Postgres.
