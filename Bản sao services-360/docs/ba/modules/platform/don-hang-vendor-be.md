# Đơn hàng vendor (Console Platform) - Đặc tả kỹ thuật Backend

> Module: `Marketplace/VendorOrder` (phạm vi Platform) | Ngày tạo: 2026-06-18 | Trạng thái: Draft
>
> Mockup nguồn: `BA-TNP-SERVICES/app/pages/platform/modules/quan-ly-don-hang/don-hang-vendor/{index,[orderId]}.vue`
> Route ID mockup: `p-ordP1`

## 1. Tổng quan

Cụm "Đơn hàng vendor" trên cổng Platform là màn hình **giám sát đọc-chỉ (read-only)** toàn bộ đơn hàng mà cư dân đặt từ các vendor trên sàn **resi_mart** — gộp **cross-vendor (mọi vendor) + cross-tenant (mọi công ty vận hành)**. Mục tiêu: Platform admin nhìn được tổng đơn / GMV / hoa hồng chia về Platform vs Công ty VH trên toàn hệ thống, lọc theo loại đơn, vendor, dự án, công ty VH.

**Điểm cốt lõi về kiến trúc (KHÁC mockup):**

- Đơn vendor **do cư dân tạo trên resi_mart**, KHÔNG do Platform admin tạo. Model `VendorOrder` / `VendorOrderItem` là **read-only**, `save()`/`delete()` ném `RuntimeException`. → Console này **KHÔNG có tạo / sửa / đổi trạng thái / huỷ đơn**. Mọi nút ghi trong mockup (Tạo đơn vendor, Đổi trạng thái, Huỷ đơn, Sửa ghi chú) **bị loại bỏ**.
- Đây là **mở rộng module `Marketplace/VendorOrder` đã có**, KHÔNG tạo module/bảng mới. Endpoint platform per-vendor (`partners/{partnerId}/orders*`) đã tồn tại; spec này bổ sung 2 endpoint **gộp cross-vendor**.
- Hoa hồng tính theo **hợp đồng hoa hồng** (`PartnerCommissionContract`), KHÔNG theo cấu hình phí ad-hoc như mockup. Chỉ đơn `completed` + khớp hợp đồng `commission_mode = per_order` mới có hoa hồng; còn lại tính vào cảnh báo `orphan` / `non_per_order`.

## 2. Kiến trúc & nguồn dữ liệu

| Thành phần | Vai trò |
|-----------|---------|
| resi_mart DB (Postgres riêng) | Chứa bảng `orders` / `order_items` / `customers` theo schema `tenant_<vendor_slug>` (mỗi **vendor** một schema) |
| `ResiMartConnection` | Switch `search_path` sang schema vendor trước khi query (`runInTenantSchema()`), kiểm tra `schemaExists()` |
| `VendorOrder` (read-only model) | Trỏ `orders` trong schema vendor; cột `tenant_id` = slug công ty VH (ref cross-DB, KHÔNG FK) |
| `PartnerRepository::allPlatformPartners()` | Danh sách mọi vendor đã provision (platform scope) — **đã có** |
| `OrganizationLookupExternalService` | Resolve tên tenant + tên dự án cross-tenant (`getTenantNames`, `getProjectNamesForTenant`) |
| `PartnerCommissionContractRepository` | Hợp đồng hoa hồng để match theo (tenant_id, project_id, completed_at) |
| `VendorOrderCommissionCalculator` | Tính `formula['total']` hoa hồng từ contract + `order->total` |

**Luồng list cross-vendor:** loop `allPlatformPartners()` → mỗi vendor: `schemaExists?` → `runInTenantSchema` đọc đơn trong range → match contract per-order → decorate (vendor + tenant + project name + commission + loại đơn) → gộp tất cả → sort `created_at desc` → **phân trang in-memory**. Đây đúng pattern `listAllForTenant()` đã có, chỉ khác: KHÔNG giới hạn theo project của 1 tenant.

## 3. Entities (read-only — KHÔNG tạo bảng mới)

### 3.1 VendorOrder (`orders` @ resi_mart) — đã có

| Field | Column | Type | Mô tả |
|-------|--------|------|-------|
| ID | `id` | int | PK trong schema vendor (KHÔNG global) |
| Mã đơn | `code` | string | Mã hiển thị, dùng để search |
| Dự án | `project_id` | int\|null | Ref dự án trong tenant PMC (cross-DB, không FK) |
| Công ty VH | `tenant_id` | string\|null | Slug operator PMC (cross-DB) |
| Khách hàng | `customer_id` | int\|null | FK `customers` trong schema vendor |
| Trạng thái | `status` | enum | `VendorOrderStatus` |
| Trạng thái TT | `payment_status` | enum | `VendorOrderPaymentStatus` |
| Tổng tiền | `total` | float | GMV đơn (cư dân trả vendor) |
| Mốc thời gian | `ordered_at` / `confirmed_at` / `completed_at` / `cancelled_at` | datetime | Timeline |
| Liên hệ | `contact_name` / `contact_phone` / `contact_email` / `apartment_code` / `shipping_address` | string | Thông tin giao |

### 3.2 VendorOrderItem (`order_items`) — đã có

| Field | Column | Type | Mô tả |
|-------|--------|------|-------|
| Loại item | `item_type` | string | `product` \| `service` — **nguồn suy ra "loại đơn"** |
| Tên SP/DV | `product_name` | string | |
| SL / đơn giá / thành tiền | `quantity` / `unit_price` / `subtotal` | int/float | |
| Lịch dịch vụ | `service_scheduled_at` / `service_duration_minutes` / `service_is_onsite` / `service_address` | mixed | Chỉ item dịch vụ |

### 3.3 VendorCustomer (`customers`) — đã có

| Field | Column | Mô tả |
|-------|--------|-------|
| Tên / SĐT / email | `full_name` / `phone` / `email` | Khách hàng (cư dân) đặt đơn |

> **Loại đơn (Vendor order type)** là giá trị **suy ra (derived)**, KHÔNG lưu DB:
> - mọi item `item_type = service` → `service`
> - mọi item `item_type = product` → `product`
> - lẫn lộn → `mixed` ("Hỗn hợp")

## 4. Enums (đã có)

### 4.1 VendorOrderStatus (`status`)

| Value | Label (VI) | Color |
|-------|------------|-------|
| `pending` | Chờ xử lý | amber |
| `confirmed` | Đã xác nhận | info |
| `completed` | Hoàn thành | green |
| `cancelled` | Đã huỷ | red |

### 4.2 RevenueRecipient (`PartnerCommissionContract.revenue_recipient`)

| Value | Label (VI) | Mô tả |
|-------|------------|-------|
| `platform` | Platform | Hoa hồng về Platform |
| `operating_company` | Công ty VH | Hoa hồng về công ty vận hành (tenant) |

### 4.3 VendorOrderType (derived — chỉ dùng ở Resource/filter, không phải backed enum)

| Value | Label (VI) |
|-------|------------|
| `product` | Sản phẩm |
| `service` | Dịch vụ |
| `mixed` | Hỗn hợp |

## 5. API Endpoints

> Prefix `/api/v1/platform`, guard `auth:requester` (platform admin) — file `Marketplace/routes/platform.php`.

| Action | Method | URL | Request Class | Ghi chú |
|--------|--------|-----|---------------|---------|
| **List cross-vendor** | GET | `/api/v1/platform/vendor-orders` | `ListPlatformVendorOrderRequest` | **MỚI** — gộp mọi vendor + mọi tenant |
| **Summary (4 thẻ)** | GET | `/api/v1/platform/vendor-orders/summary` | `ListPlatformVendorOrderSummaryRequest` | **MỚI** |
| Chi tiết đơn | GET | `/api/v1/platform/partners/{partnerId}/orders/{orderId}` | — | **TÁI DÙNG** `PlatformVendorOrderController::show` (cần nới điều kiện status, xem §6) |

> **KHÔNG có** POST/PUT/DELETE/PATCH — console đọc-chỉ.
>
> **Thứ tự route:** khai báo `vendor-orders/summary` TRƯỚC mọi route động khác để tránh nuốt path. Chi tiết tái dùng route per-partner sẵn có nên không phát sinh xung đột wildcard.
>
> **Vì sao detail vẫn dùng `partners/{partnerId}/orders/{orderId}`?** ID đơn chỉ unique trong schema từng vendor, nên muốn lấy 1 đơn phải biết vendor. Row list đã trả `vendor.id` + `id` → FE dựng được link.

## 6. Validation Rules

### 6.1 `ListPlatformVendorOrderRequest` (list)

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `from` | `nullable`, `date` | |
| `to` | `nullable`, `date`, `after_or_equal:from` | Ngày kết thúc phải sau ngày bắt đầu. |
| `partner_id` | `nullable`, `integer`, `min:1`, `Rule::exists('partners','id')` | |
| `tenant_id` | `nullable`, `string`, `max:100` | |
| `project_id` | `nullable`, `integer`, `min:1` | |
| `type` | `nullable`, `Rule::in(['product','service','mixed'])` | Loại đơn không hợp lệ. |
| `status` | `nullable`, `Rule::in(VendorOrderStatus::values())` | Trạng thái không hợp lệ. |
| `search` | `nullable`, `string`, `max:100` | |
| `page` | `nullable`, `integer`, `min:1` | |
| `per_page` | `nullable`, `integer`, `min:1`, `max:50` | Mỗi trang tối đa 50 đơn. |

### 6.2 `ListPlatformVendorOrderSummaryRequest` (summary)

Như trên nhưng bỏ `page` / `per_page` (chỉ giữ `from`, `to`, `partner_id`, `tenant_id`, `project_id`, `type`, `status`, `search`).

## 7. Business Rules

- [ ] **Read-only tuyệt đối** — console KHÔNG tạo/sửa/đổi trạng thái/huỷ/xoá đơn. Không có endpoint ghi.
- [ ] **Cross-vendor + cross-tenant** — loop `PartnerRepository::allPlatformPartners()`; bỏ qua vendor `tenant_id = null` hoặc `! ResiMartConnection::schemaExists()`.
- [ ] **Cửa sổ thời gian** — mặc định 30 ngày gần nhất, **kẹp tối đa 90 ngày** (`resolveRange()` đã có). List/summary lọc theo `created_at` (để bao phủ mọi trạng thái, không chỉ completed).
- [ ] **Hoa hồng** — chỉ tính cho đơn `status = completed` **và** khớp hợp đồng `commission_mode = per_order` (match theo `tenant_id` + `project_id` + `completed_at` qua `matchContractPlatform()`). Đơn không khớp → `commission = null`, hiển thị "—", và cộng vào cảnh báo:
  - `orphan_orders_count`: completed nhưng không có hợp đồng hiệu lực.
  - `non_per_order_orders_count`: completed nhưng hợp đồng không phải per_order.
- [ ] **"Thuộc về" (recipient)** — lấy từ `contract.revenue_recipient` (`platform` | `operating_company`). Đơn chưa có hoa hồng → recipient = null.
- [ ] **Loại đơn (type)** — suy ra từ `item_type` của các dòng (xem §3). Filter `type` áp ở mức đơn theo loại đã suy ra.
- [ ] **GMV** — tổng `total` các đơn **không bị huỷ** (loại `cancelled`) trong cửa sổ. Đơn huỷ vẫn hiện trong list nhưng không tính GMV/hoa hồng.
- [ ] **Phân trang in-memory** — gộp toàn bộ rồi `forPage()`; `per_page` ≤ 50.
- [ ] **Resolve tên** — gom theo tenant để giảm số lần switch DB (pattern `resolvePlatformNames()` đã có): `getTenantNames`, `getProjectNamesForTenant`; dự án đã xoá → "Dự án #{id}".
- [ ] **Đánh giá cư dân (đánh giá CD)** — **DEFER (Giai đoạn 2)**. resi_mart chưa wiring rating per-order cross-repo. Resource trả `resident_rating = null`; FE hiển thị "—". Đồng bộ với defer ở `quan-ly-vendor` và `bao-cao-tong-hop`.
- [ ] **Nguồn khách (customer source)** — suy ra từ `apartment_code` có/không (có căn hộ trên dự án → `project`, ngược lại `external`). Nếu dữ liệu không đủ tin cậy → để Giai đoạn 2; mặc định trả `null` và FE ẩn cột.
- [ ] **Detail** — nới `VendorOrderRepository::findByIdForPartner()` bỏ ràng buộc `status = completed` để console xem được đơn mọi trạng thái (đơn pending/cancelled vẫn mở được). Thêm test cho đơn không-completed.

## 8. Presenter Output

### 8.1 List row (`GET /vendor-orders`) — mở rộng `VendorOrderListResource` (thêm `type`)

```json
{
  "id": 1024,
  "code": "VO-2026-001024",
  "type": { "value": "service", "label": "Dịch vụ" },
  "vendor": { "id": 7, "name": "CleanPro", "slug": "cleanpro" },
  "tenant": { "id": "vinhomes-ocean", "name": "Vinhomes Ocean Park" },
  "project_id": 42,
  "project_name": "Tòa S1",
  "customer": { "id": 88, "name": "Nguyễn Văn A", "phone": "0901xxxxxx" },
  "customer_source": { "value": "project", "label": "Cư dân dự án" },
  "items_count": 2,
  "first_item_name": "Vệ sinh định kỳ",
  "total": 1500000,
  "status": { "value": "completed", "label": "Hoàn thành" },
  "completed_at": "2026-06-12T09:00:00+07:00",
  "created_at": "2026-06-10T08:00:00+07:00",
  "commission": {
    "contract_id": 5,
    "contract_code": "CT-CLEANPRO-S1",
    "amount": 150000,
    "currency": "VND",
    "revenue_recipient": { "value": "platform", "label": "Platform" }
  },
  "resident_rating": null
}
```

> `commission = null` khi đơn chưa khớp hợp đồng per_order/chưa completed. `resident_rating` luôn `null` ở GĐ1.

### 8.2 Summary (`GET /vendor-orders/summary`)

```json
{
  "from": "2026-05-19",
  "to": "2026-06-18",
  "orders_count": 320,
  "product_count": 210,
  "service_count": 110,
  "gmv": 480000000,
  "commission_platform": 24000000,
  "commission_operating_company": 6000000,
  "commission_total": 30000000,
  "vendors_count": 12,
  "currency": "VND",
  "warnings": {
    "orphan_orders_count": 4,
    "non_per_order_orders_count": 2,
    "schema_missing": false
  }
}
```

> Enum fields dạng `{ "value": "...", "label": "..." }`. KHÔNG trả `created_at`/`updated_at` thừa ngoài các mốc cần cho nghiệp vụ.

## 9. Cross-Module Dependencies (ExternalService)

| Dependency | Module nguồn | Interface | Method |
|-----------|-------------|-----------|--------|
| Tên tenant / tên dự án cross-tenant | Platform | `OrganizationLookupExternalServiceInterface` | `getTenantNames()`, `getProjectNamesForTenant()` |
| Đơn vendor (resi_mart) | (cross-DB) | `ResiMartConnection` | `runInTenantSchema()`, `schemaExists()` |

> Hợp đồng hoa hồng (`PartnerCommissionContract`) và Partner ở **cùng module** `Marketplace` → import repository trực tiếp, KHÔNG dùng ExternalService (đúng quy ước submodule cùng module).

## 10. Kế hoạch triển khai BE (mở rộng module sẵn có)

- [ ] **Service** `VendorOrderService` — thêm 2 method vào `VendorOrderServiceInterface` + impl:
  - `listAllOrdersPlatform(array $filters): array` — loop `allPlatformPartners()`, đọc đơn mọi trạng thái trong range, decorate (vendor/tenant/project/commission/type), gộp + sort + paginate in-memory.
  - `getSummaryAllOrdersPlatform(array $filters): array` — cùng loop, gộp orders_count / product_count / service_count / gmv / commission split / vendors_count / warnings.
- [ ] **Repository** `VendorOrderRepository::listAllForConsole(array $filters)` — đọc đơn **mọi trạng thái** trong range (window `created_at`), kèm `code` + `items` + `customer`, áp filter `tenant_id`/`project_id`/`status`/`search` ở query; `type` lọc in-memory sau khi suy ra. (Có thể tái dùng/khái quát `allInRangeForAggregation()`.)
- [ ] **Repository** `findByIdForPartner()` — bỏ ràng buộc `status = completed` (cho detail mọi trạng thái).
- [ ] **Resource** `VendorOrderListResource` — thêm field `type` (derived) + `resident_rating` (null) + `customer_source` (null GĐ1).
- [ ] **Requests** `ListPlatformVendorOrderRequest`, `ListPlatformVendorOrderSummaryRequest`.
- [ ] **Controller** `PlatformVendorOrderController` — thêm `allIndex()` + `allSummary()` (gọi 2 method service mới).
- [ ] **Routes** `Marketplace/routes/platform.php` — thêm `vendor-orders/summary` (trước) + `vendor-orders`.
- [ ] **Tests** (feature, SQLite in-memory + fake resi_mart schema theo pattern test hiện có):
  - list gộp đúng nhiều vendor + nhiều tenant, sort desc, paginate.
  - filter `type` / `status` / `vendor` / `tenant` / `project` / `search`.
  - GMV bỏ đơn huỷ; commission chỉ completed + per_order; recipient split platform vs operating_company.
  - warnings orphan / non_per_order; schema_missing bỏ qua vendor.
  - date range clamp 90 ngày.
  - detail mở được đơn pending/cancelled (sau khi nới repo).
  - summary 4 thẻ khớp list.
- [ ] `make format` → `make lint` → chạy test filter liên quan.

## 11. Khác biệt so với mockup (bắt buộc ghi nhận)

| Mockup | Thực tế spec | Lý do |
|--------|--------------|-------|
| Tạo đơn vendor (modal) | **Bỏ** | Đơn do cư dân tạo trên resi_mart; model read-only |
| Đổi trạng thái / Huỷ đơn | **Bỏ** | read-only |
| Sửa ghi chú | **Bỏ** | read-only |
| Hoa hồng theo `vendor-fee-config` | Theo `PartnerCommissionContract` (per_order) | Khớp model tài chính đã có |
| ProductOrder vs ServiceBooking (2 entity) | 1 bảng `orders`, type suy ra từ `item_type` | resi_mart hợp nhất đơn |
| Đánh giá CD hiển thị sao | `null` ("—") GĐ1 | Chưa wiring rating cross-repo |

## 12. Checklist triển khai BE

- [ ] 2 method service + interface, 1-2 method repository, 2 Request, 2 action controller, 2 route
- [ ] Mở rộng `VendorOrderListResource` (type/rating/source)
- [ ] Nới detail repo bỏ điều kiện completed
- [ ] KHÔNG migration / KHÔNG bảng mới / KHÔNG model mới
- [ ] Feature tests phủ happy + filter + edge + warnings
- [ ] PSR-4 ok + `make format` + `make lint` pass
