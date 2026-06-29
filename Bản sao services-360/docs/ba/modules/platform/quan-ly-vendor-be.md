# Quản lý Vendor (Console Platform) — Đặc tả kỹ thuật Backend

> Module: `Marketplace/{Partner, PartnerProject, PartnerCommissionContract, VendorOrder, VendorOffer}` | Ngày tạo: 2026-06-16 | Trạng thái: Draft
>
> **Đây là spec HỢP NHẤT (consolidation), KHÔNG phải module mới.** Console "Quản lý Vendor" tái dùng ~80% backend vendor đã có. Spec này chỉ mô tả phần **DELTA** cần bổ sung và cách lắp ráp.

## 1. Tổng quan

"Quản lý Vendor" là **console Platform cross-tenant** dưới `quan-ly-van-hanh/quan-ly-vendor`, cho admin Platform (TNP) quản lý toàn bộ vendor (đối tác B3) trên nền tảng: danh sách, chi tiết, tạo mới, duyệt, vô hiệu hoá, cấu hình hoa hồng, xem đơn/sản phẩm/đánh giá.

Hiện vendor mới chỉ xuất hiện dưới dạng **tab trong trang chi tiết dự án** (`du-an-tren-nen-tang/[id].vue`). Console này là **lớp tổng hợp mới** đặt trên các submodule Marketplace đã có.

### Nguyên tắc cốt lõi (đã chốt với nghiệp vụ)

1. **Không tạo entity vendor mới** — `Partner` là vendor. `PartnerProject` là liên kết vendor↔dự án.
2. **Không tạo lớp phí thứ 2** — hoa hồng vendor = `PartnerCommissionContract` (đã có, bất biến, có vòng đời). Chỉ thêm 1 chiều: **người nhận doanh thu**.
3. **Phân biệt rõ 3 dòng tiền** — KHÔNG trộn trong UI/logic:
   - **Phí nền tảng** (`TenantConfig`/`ProjectFeeConfig`): TNP thu của PMC tenant. Console này **không** đụng tới.
   - **Hoa hồng vendor** (`PartnerCommissionContract`): Platform/PMC thu của vendor. **Console này quản lý cái này.**
4. **Trạng thái vendor có luồng duyệt** — vendor do tenant tạo = `pending` → Platform duyệt → `active`.

## 2. Đối chiếu Tái dùng vs DELTA

| Phần | Backend hiện có | Hành động |
|------|-----------------|-----------|
| Vendor list/detail/create | `Partner` + `PartnerController` + `PartnerService` | ✅ Tái dùng, mở rộng resource |
| Gán/bật-tắt vendor theo dự án | `PartnerProject` + `is_vendor_enabled` | ✅ Tái dùng nguyên |
| Hoa hồng vendor | `PartnerCommissionContract` | ⚠️ DELTA: thêm `revenue_recipient` + bulk apply |
| Đơn hàng vendor | `VendorOrder` (read-only) + `PlatformVendorOrderController` | ✅ Tái dùng nguyên |
| Biểu đồ doanh thu 6 tháng | `VendorOrderRepository::summaryForPartner` + trend reports | ✅ Tái dùng |
| Trạng thái vendor | `PartnerStatus` (active/suspended/terminated) | ⚠️ DELTA: thêm `pending` + luồng duyệt |
| Sản phẩm vendor (list) | `VendorOfferRepository::countActiveForProject` (chỉ đếm) | ❌ DELTA: thêm model + list endpoint |
| Đánh giá cư dân theo vendor | rating ExternalService (lọc theo dự án) | ❌ DELTA: thêm lọc theo `partner_id` |
| Console list tổng hợp (stats, rating, counts) | — | ❌ DELTA: endpoint aggregate |

---

## 3. DELTA 1 — Trạng thái vendor + luồng duyệt

### 3.1 Mở rộng enum `PartnerStatus`

`Marketplace/Partner/Enums/PartnerStatus.php` — thêm case `Pending`:

| Key | Value | Label (VI) | color() | Mô tả |
|-----|-------|------------|---------|-------|
| Pending | `pending` | Chờ duyệt | `warning` | Vendor do tenant tạo, chờ Platform duyệt |
| Active | `active` | Đang hoạt động | `success` | Hoạt động bình thường |
| Suspended | `suspended` | Đã vô hiệu | `neutral` | Bị tạm dừng (= mockup `inactive`) |
| Terminated | `terminated` | Đã chấm dứt | `error` | Chấm dứt vĩnh viễn (giữ nguyên) |

> Cột `status` là `string` → **không cần migration** (trừ khi có CHECK constraint; kiểm tra migration gốc `partners`). Bổ sung method `label()`, `color()`, `isApprovable()`.

### 3.2 Quy tắc gán trạng thái khi tạo

- Tạo từ Platform (`PartnerController@store`): `status = active` ngay.
- Tạo từ Tenant (`TenantPartnerController@store`, `owner_source = tenant`): `status = pending`.

### 3.3 Action duyệt / vô hiệu / kích hoạt

`PartnerService` — bổ sung (đi qua Service, không sửa Model trực tiếp):

| Method | Transition hợp lệ | Mô tả |
|--------|-------------------|-------|
| `approve(int $id, int $actorId)` | `pending → active` | Platform duyệt vendor |
| `deactivate(int $id, int $actorId)` | `active → suspended` | Vô hiệu hoá |
| `reactivate(int $id, int $actorId)` | `suspended → active` | Kích hoạt lại |

Ném `InvalidPartnerTransitionException` nếu transition không hợp lệ.

### 3.4 Endpoints mới (platform)

`Marketplace/routes/platform.php`, guard `auth:requester`, prefix `partners`:

| Action | Method | URL | Request Class |
|--------|--------|-----|---------------|
| Duyệt | POST | `partners/{id}/approve` | — |
| Vô hiệu | POST | `partners/{id}/deactivate` | — |
| Kích hoạt | POST | `partners/{id}/reactivate` | — |

---

## 4. DELTA 2 — Người nhận doanh thu trên hợp đồng hoa hồng

### 4.1 Vấn đề

Mockup cho cấu hình **người nhận** hoa hồng vendor: `platform` (TNP giữ) hoặc **công ty vận hành** (PMC quản lý dự án giữ). `PartnerCommissionContract` hiện **không** model chiều này.

### 4.2 Quyết định mô hình (sau phân tích sâu)

- **Tái dùng `PartnerCommissionContract` làm nguồn sự thật duy nhất** cho hoa hồng vendor. KHÔNG tạo bảng `vendor_fee_config` song song.
- Mockup gọi là "phí platform thu vendor" với modes `none/subscription/fixed_per_order/percent_per_order/both`. **Map sang `CommissionMode` hiện có**:

  | Mockup feeMode | → CommissionMode | terms |
  |----------------|------------------|-------|
  | `none` | (không có hợp đồng active) | — |
  | `fixed_per_order` | `per_order` | `{ fixed }` |
  | `percent_per_order` | `per_order` | `{ percent }` |
  | `both` | `per_order` | `{ fixed, percent }` |
  | `subscription` | `subscription` | `{ amount, cycle }` |

  > `per_order` đã hỗ trợ đồng thời `percent` + `fixed` → bao trọn 3 mode mockup. `revenue_share` là superset (mockup không dùng nhưng giữ nguyên).

- **"Mặc định toàn vendor"** của mockup **KHÔNG** là entity mới. Đây là **thao tác tạo hàng loạt** ở console: áp 1 bộ terms cho **tất cả dự án vendor đang gắn** (fan-out tạo nhiều draft contract). Mỗi dự án vẫn có thể "ghi đè" bằng hợp đồng riêng. Per-project vẫn là đơn vị lưu trữ → giữ nguyên tính bất biến + snapshot per order.

### 4.3 Field mới: `revenue_recipient`

Thêm cột vào `partner_commission_contracts` (central DB):

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| Người nhận DT | `revenue_recipient` | `string(30)` | enum `RevenueRecipient`, default `platform` | Ai nhận hoa hồng đơn |

> Là field **financial** → bất biến sau khi rời `draft` (cùng nhóm với `terms`). Snapshot theo order qua `commission_contract_id` đã có.

### 4.4 Enum mới: `RevenueRecipient`

`Marketplace/PartnerCommissionContract/Enums/RevenueRecipient.php`:

| Key | Value | Label (VI) | Mô tả |
|-----|-------|------------|-------|
| Platform | `platform` | Platform TNP | TNP giữ hoa hồng |
| OperatingCompany | `operating_company` | Công ty vận hành | Tenant quản lý dự án (`tenant_id` của contract) giữ |

> Đơn giản hoá so với mockup: mockup cho chọn **bất kỳ** công ty VH. Thực tế người nhận chỉ có thể là Platform hoặc công ty đang vận hành dự án đó (= `tenant_id` của contract) → không cần lưu `recipient_company_id` rời. Ghi nhận lệch spec này.

### 4.5 Ảnh hưởng

- `CreateContractDraftRequest` / `UpdateContractDraftRequest`: thêm `revenue_recipient` (required, `Rule::in(RevenueRecipient::values())`).
- `ContractDetailResource` / `ContractListResource`: thêm `revenue_recipient: { value, label }`.
- Tổng hợp đơn hàng (`VendorOrder` summary): tách "Hoa hồng → Platform" vs "Hoa hồng → Công ty VH" dựa trên `revenue_recipient` của contract snapshot.

### 4.6 Endpoint bulk (console)

| Action | Method | URL | Request Class |
|--------|--------|-----|---------------|
| Áp hoa hồng mặc định cho mọi dự án vendor | POST | `partners/{id}/commission-contracts/bulk` | `BulkCreateContractRequest` |

`BulkCreateContractRequest`: `commission_mode`, `terms`, `revenue_recipient`, `starts_at`, `ends_at?`. Service fan-out tạo draft cho từng `project_id` trong `PartnerProject` của vendor (skip dự án đã có contract active nếu chọn "không ghi đè").

---

## 5. DELTA 3 — Sản phẩm vendor (Tab Sản phẩm)

### 5.1 Model read-only `VendorOffer`

Đọc cross-DB từ schema resi_mart (như `VendorOrder`). `Marketplace/VendorOffer/Models/VendorOffer.php`, bảng `products` (resi_mart), read-only.

| Field | Column | Type | Mô tả |
|-------|--------|------|-------|
| ID | `id` | int | |
| Tên gói | `name` | string | |
| Loại | `type` | string (enum `VendorOfferType`) | product/rental/service |
| Đơn giá | `price` | decimal(15,2) | |
| Đơn vị | `unit` | string | |
| Trạng thái | `status` | string (enum `VendorOfferStatus`) | published/hidden |

### 5.2 Enums

**VendorOfferType**: `product` (Bán sản phẩm), `rental` (Cho thuê), `service` (Dịch vụ).
**VendorOfferStatus**: `published` (Công khai), `hidden` (Ẩn).

> Map từ giá trị thực tế của bảng `products`/`product_project` resi_mart — xác nhận tên cột khi triển khai.

### 5.3 Repository (mở rộng `VendorOfferRepository`)

```php
/** Danh sách sản phẩm vendor (read-only, caller switch schema resi_mart). */
public function listForPartner(string $partnerSlug, array $filters): LengthAwarePaginator;
```

### 5.4 Endpoint

| Action | Method | URL | Request Class |
|--------|--------|-----|---------------|
| List sản phẩm vendor | GET | `partners/{partnerId}/offers` | `ListVendorOfferRequest` |

`ListVendorOfferRequest`: `search?` (tên gói), `type?`, `status?`, `page?`, `per_page?`.

> Cross-DB resi_mart không khả dụng (thiếu schema) → trả `data: []` + `warnings.schema_missing: true` (đồng bộ pattern `ProjectVendorService`).

---

## 6. DELTA 4 — Đánh giá cư dân theo vendor

### 6.1 Mở rộng ExternalService rating

Rating ExternalService hiện lọc theo dự án. Thêm lọc theo vendor:

```php
// PMC/OgTicket/ExternalServices/Platform/TenantResidentRatingExternalServiceInterface
/** Đánh giá cư dân cho các đơn của 1 vendor (gom cross-tenant qua $tenant->run). */
public function listRatingsForPartner(int $partnerId, array $filters): array;
```

| Field trả về | Mô tả |
|--------------|-------|
| `order_code` | Mã đơn |
| `order_type` | Sản phẩm / Dịch vụ |
| `project` | `{ id, name }` |
| `resident_name` | Tên cư dân |
| `score` | điểm (1–5) |
| `comment` | nhận xét |
| `rated_at` | thời điểm |

### 6.2 Endpoint

| Action | Method | URL | Request Class |
|--------|--------|-----|---------------|
| Đánh giá theo vendor | GET | `partners/{partnerId}/ratings` | `ListPartnerRatingRequest` |

> Nếu rating gắn `customer_id`/`order` trong tenant DB mà chưa có liên kết `partner_id` rõ ràng → đánh dấu **có thể defer** sang part2; console hiển thị empty state.

---

## 7. DELTA 5 — Console list/detail tổng hợp

### 7.1 Mở rộng `PartnerListResource` (cho list console)

Thêm các field aggregate (lazy, chỉ khi `?include=stats`):

```json
{
  "id": 12,
  "code": "PART-01",
  "name": "Công ty Đối tác Demo",
  "status": { "value": "pending", "label": "Chờ duyệt" },
  "owner_source": { "value": "tenant", "label": "Công ty vận hành" },
  "owner_tenant": { "id": "cova", "name": "Công ty VH A" },
  "project_count": 3,
  "offer_count": 12,
  "order_count": 48,
  "rating": { "avg": 4.5, "count": 20 },
  "created_at": "2026-06-16T..."
}
```

### 7.2 Endpoint list (tái dùng, thêm filter)

`GET /api/v1/platform/partners` — `ListPartnerRequest` bổ sung:

| Field | Rules |
|-------|-------|
| `search` | nullable, string, max:255 (mã/tên vendor/người tạo/dự án) |
| `status` | nullable, `Rule::in(PartnerStatus::values())` |
| `owner_source` | nullable, `Rule::in(['platform','tenant'])` |
| `include` | nullable, string (`stats` để kèm aggregate) |

### 7.3 Stats cards (4 thẻ)

`GET /api/v1/platform/partners/stats` → `{ total, active, pending, inactive }` (inactive = suspended).

### 7.4 Doanh thu 6 tháng (chi tiết vendor)

Tái dùng `VendorOrderRepository::summaryForPartner` + trend. `GET /api/v1/platform/partners/{partnerId}/revenue-trend?months=6` → mảng `{ month, revenue, order_count, platform_fee }`.

---

## 8. API Endpoints — Tổng hợp Console

| Action | Method | URL | Trạng thái |
|--------|--------|-----|-----------|
| List vendor (+stats, filter) | GET | `/platform/partners?include=stats` | Tái dùng + mở rộng |
| Stats cards | GET | `/platform/partners/stats` | DELTA |
| Detail vendor | GET | `/platform/partners/{id}` | Tái dùng |
| Tạo vendor | POST | `/platform/partners` | Tái dùng |
| Sửa vendor | PUT | `/platform/partners/{id}` | Tái dùng |
| Duyệt | POST | `/platform/partners/{id}/approve` | DELTA |
| Vô hiệu | POST | `/platform/partners/{id}/deactivate` | DELTA |
| Kích hoạt | POST | `/platform/partners/{id}/reactivate` | DELTA |
| Trend doanh thu | GET | `/platform/partners/{id}/revenue-trend` | DELTA |
| Tab Đơn hàng | GET | `/platform/partners/{partnerId}/orders` | Tái dùng |
| Tab Sản phẩm | GET | `/platform/partners/{partnerId}/offers` | DELTA |
| Tab Đánh giá | GET | `/platform/partners/{partnerId}/ratings` | DELTA |
| Hợp đồng hoa hồng (per dự án) | GET/POST/... | `/platform/partner-commission-contracts` | Tái dùng + recipient |
| Bulk hoa hồng mặc định | POST | `/platform/partners/{id}/commission-contracts/bulk` | DELTA |

---

## 9. Business Rules

- [ ] Vendor do Platform tạo → `active`; do Tenant tạo → `pending`.
- [ ] Chỉ `pending → active` (approve), `active → suspended` (deactivate), `suspended → active` (reactivate). Transition khác → 422.
- [ ] Vendor `suspended`/`pending` → không nhận đơn mới (kết hợp `is_vendor_enabled` theo dự án).
- [ ] Hoa hồng vendor là `PartnerCommissionContract`, **bất biến** sau khi rời `draft`; `revenue_recipient` thuộc nhóm financial.
- [ ] "Mặc định" = bulk fan-out draft cho mọi dự án vendor; per-project có thể ghi đè bằng contract riêng (one active per scope giữ nguyên).
- [ ] Phân tách tổng hoa hồng theo `revenue_recipient` (Platform vs Công ty VH) trong summary đơn hàng.
- [ ] Console KHÔNG đụng tới phí nền tảng (`TenantConfig`/`ProjectFeeConfig`) — dòng tiền khác.
- [ ] Sản phẩm/đơn hàng/đánh giá đọc cross-DB resi_mart → schema thiếu thì trả empty + `schema_missing` warning, không 500.

## 10. Presenter Output (mẫu)

```json
// Detail vendor — tab Thông tin chung
{
  "id": 12,
  "code": "PART-01",
  "name": "Công ty Đối tác Demo",
  "status": { "value": "active", "label": "Đang hoạt động" },
  "owner_source": { "value": "platform", "label": "Platform TNP" },
  "owner_tenant": null,
  "notes": "Ghi chú nội bộ",
  "projects": [
    {
      "project_id": 5, "project_name": "Dự án X", "tenant_id": "cova",
      "is_vendor_enabled": true,
      "commission": {
        "mode": { "value": "per_order", "label": "Chiết khấu mỗi đơn" },
        "terms": { "percent": "5.00", "fixed": "1000.00" },
        "revenue_recipient": { "value": "platform", "label": "Platform TNP" },
        "is_override": true
      }
    }
  ]
}
```

> Enum fields: `{ value, label }`. Không thêm `created_at` trừ khi cần.

## 11. Cross-Module Dependencies (ExternalService)

| Dependency | Module nguồn | Interface | Method |
|-----------|-------------|-----------|--------|
| Đánh giá cư dân theo vendor | PMC/OgTicket | `TenantResidentRatingExternalServiceInterface` | `listRatingsForPartner()` (mới) |
| Đơn/sản phẩm vendor | resi_mart (cross-DB) | `VendorOrderRepository`, `VendorOfferRepository` | đọc read-only, switch schema |

## 12. Checklist triển khai BE (chỉ DELTA)

- [ ] `PartnerStatus`: thêm `Pending` + `label()`/`color()`/`isApprovable()`
- [ ] `PartnerService`: `approve()`, `deactivate()`, `reactivate()` + `InvalidPartnerTransitionException`
- [ ] `TenantPartnerController@store`: set `pending` khi tenant tạo
- [ ] Routes: `approve`/`deactivate`/`reactivate`/`stats`/`revenue-trend`/`offers`/`ratings`/`commission bulk`
- [ ] Migration: thêm `revenue_recipient` vào `partner_commission_contracts` + enum `RevenueRecipient`
- [ ] Contract Requests/Resources: thêm `revenue_recipient`; `BulkCreateContractRequest` + service fan-out
- [ ] `VendorOffer` model + enums + `VendorOfferRepository::listForPartner()` + `ListVendorOfferRequest`
- [ ] `TenantResidentRatingExternalService::listRatingsForPartner()` (hoặc defer part2)
- [ ] `PartnerListResource` aggregate (`include=stats`) + `PartnerService` stats
- [ ] Cập nhật `PlatformProjectVendorTest` + thêm test: approval flow, recipient, bulk, offers list, stats
- [ ] `make format` → `make lint` → chạy test liên quan
```