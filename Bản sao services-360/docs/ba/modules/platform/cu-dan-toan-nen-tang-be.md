# Cư dân toàn nền tảng (Console Platform) — Đặc tả kỹ thuật Backend

> Module: `Platform/Resident` (submodule MỚI trong module Platform)
> Ngày: 2026-06-20
> Trạng thái: Spec — chờ triển khai
> Liên quan: PMC/Customer, PMC/OgTicket, Marketplace/VendorOrder, Platform/Tenant
> Pattern nền: read model central + đồng bộ theo lịch ngày + nút "Đồng bộ ngay"

---

## 1. Tổng quan

Hiện cư dân bị phân mảnh ở 3 nơi không nối với nhau, và đơn hàng của cư dân nằm ở 2 hệ:

- **Cư dân**: `pmc_customers` (mỗi schema tenant PMC), `customers` (mỗi schema vendor của DB resi_mart riêng), `customers` (central — pool ticket web).
- **Đơn**: `og_tickets` (schema tenant PMC) và `orders` (schema vendor resi_mart).

Khóa chung duy nhất giữa các nơi là **số điện thoại** (đã có `PhoneNormalizer`). Tính năng này dựng một **read model ở central DB** để Platform:

1. **Hợp nhất cư dân theo SĐT chuẩn hóa** → một danh tính cư dân toàn nền tảng.
2. **Gom toàn bộ đơn của cư dân** (OG ticket + vendor order) xuyên mọi tenant & vendor.

**Nguyên tắc kiến trúc (chốt qua phân tích):**

- Read model **chỉ-đọc** ở central; nguồn-sự-thật vẫn ở module gốc.
- **2 bảng đơn riêng** (ticket / vendor order) vì là 2 aggregate khác bounded context, shape khác nhau (ticket không có tiền, vendor order có). Một **SQL VIEW** hợp nhất phục vụ timeline + danh sách toàn nền tảng.
- **Đồng bộ full theo lịch hằng ngày** (tự đối soát) + **nút bấm thủ công** dispatch cùng job. Có **cờ đang-đồng-bộ** để FE chặn hiển thị dữ liệu cho tới khi xong.
- Việc hợp nhất theo SĐT nằm ở `platform_residents` — **độc lập** với cách lưu đơn.

---

## 2. Kiến trúc & nguồn dữ liệu

| Thành phần | Vai trò | Vị trí |
|---|---|---|
| `platform_residents` | Danh tính cư dân toàn cục (khóa = SĐT chuẩn hóa) | central |
| `platform_resident_links` | Cư dân xuất hiện ở nguồn nào (pmc/resi_mart) | central |
| `platform_resident_tickets` | Mirror header OG ticket | central |
| `platform_resident_vendor_orders` | Mirror header đơn vendor (resi_mart) | central |
| `platform_resident_orders` (VIEW) | Hợp nhất 2 bảng đơn cho timeline/list | central (SQL VIEW) |
| `platform_sync_runs` | Nhật ký mỗi lần đồng bộ + cờ đang chạy | central |

**Luồng đồng bộ (full):**

```
Schedule daily 02:00 ─┐
                      ├─▶ SyncResidentDirectoryJob (ShouldQueue)
Nút "Đồng bộ ngay" ───┘        │
                               │ 1) PMC: loop Organization → ExternalService → pmc_customers + og_tickets
                               │ 2) resi_mart: loop Partner → ExternalService → orders + customers (cross-DB)
                               │ 3) Resolve SĐT chuẩn hóa → upsert residents + links
                               │ 4) Upsert tickets + vendor_orders (idempotent theo source key)
                               │ 5) Soft-delete dòng không chạm trong run (đối soát) + tính lại stats
                               ▼
                     platform_sync_runs: running → success/failed (+stats)
```

**Khóa lock:** `Cache::lock('platform:resident-sync')` đảm bảo chỉ 1 run chạy tại một thời điểm (scheduler + nhiều người bấm nút → gộp về run đang chạy).

---

## 3. Entities

### 3.1 PlatformResident (MỚI — central, extends `BaseModel`)

Bảng `platform_residents`.

| Field | Column | Type | Mô tả |
|---|---|---|---|
| id | `id` | bigint PK | |
| phone_normalized | `phone_normalized` | varchar(20) | **Khóa danh tính** — `PhoneNormalizer::normalize()`. Unique (partial WHERE deleted_at IS NULL) |
| display_name | `display_name` | varchar(255) | Tên hiển thị (lấy bản ghi mới nhất) |
| email | `email` | varchar(255) null | |
| tenant_count | `tenant_count` | int | Số tenant PMC cư dân xuất hiện (denormalized) |
| vendor_count | `vendor_count` | int | Số vendor cư dân từng mua (denormalized) |
| ticket_count | `ticket_count` | int | Tổng OG ticket (denormalized) |
| vendor_order_count | `vendor_order_count` | int | Tổng đơn vendor (denormalized) |
| vendor_total_spent | `vendor_total_spent` | decimal(15,2) | Tổng chi tiêu ở vendor (chỉ đơn không hủy) |
| first_seen_at | `first_seen_at` | timestamp null | Mốc sớm nhất xuất hiện |
| last_seen_at | `last_seen_at` | timestamp null | Mốc gần nhất (đơn/ticket mới nhất) |
| timestamps, softDeletes | | | |

> **Lưu ý:** bản ghi có SĐT chuẩn hóa rỗng (không match được) **không tạo resident** — đếm vào `stats.skipped_no_phone`.

### 3.2 PlatformResidentLink (MỚI — central, extends `BaseModel`)

Bảng `platform_resident_links` — cư dân này tồn tại ở những nguồn nào.

| Field | Column | Type | Mô tả |
|---|---|---|---|
| id | `id` | bigint PK | |
| resident_id | `resident_id` | bigint FK→`platform_residents` | |
| source_system | `source_system` | varchar(20) | `pmc` \| `resi_mart` (enum `ResidentSourceSystem`) |
| source_instance | `source_instance` | varchar(50) | Định danh deployment resi_mart (mặc định `default`); PMC = `default`. Chừa chỗ cho **nhiều resi_mart** |
| source_ref_id | `source_ref_id` | varchar(100) | tenant_id PMC HOẶC vendor tenant_id/slug |
| source_ref_name | `source_ref_name` | varchar(255) | Tên tenant/vendor (snapshot) |
| local_customer_id | `local_customer_id` | bigint | id cư dân ở schema nguồn |
| local_name | `local_name` | varchar(255) | Tên ở nguồn (snapshot) |
| local_phone | `local_phone` | varchar(20) | SĐT thô ở nguồn |
| synced_at | `synced_at` | timestamp | Lần đồng bộ gần nhất chạm dòng này |
| timestamps, softDeletes | | | |

> **Unique:** `(source_system, source_instance, source_ref_id, local_customer_id)` (partial WHERE deleted_at IS NULL).

### 3.3 PlatformResidentTicket (MỚI — central, extends `BaseModel`) — mirror `og_tickets`

Bảng `platform_resident_tickets`. **Không có cột tiền** (đúng nguồn).

| Field | Column | Type | Mô tả |
|---|---|---|---|
| id | `id` | bigint PK | |
| resident_id | `resident_id` | bigint FK→`platform_residents` | |
| tenant_id | `tenant_id` | varchar(100) | tenant PMC |
| tenant_name | `tenant_name` | varchar(255) | snapshot |
| project_id | `project_id` | bigint null | |
| project_name | `project_name` | varchar(255) null | snapshot |
| source_ticket_id | `source_ticket_id` | bigint | `og_tickets.id` |
| subject | `subject` | varchar(500) | |
| status | `status` | varchar(20) | giữ nguyên `OgTicketStatus` value |
| status_group | `status_group` | varchar(20) | nhóm chuẩn hóa (`ResidentOrderStatusGroup`) |
| priority | `priority` | varchar(20) | `OgTicketPriority` value |
| channel | `channel` | varchar(20) | `TicketChannel` value |
| requester_name | `requester_name` | varchar(255) | |
| requester_phone | `requester_phone` | varchar(20) | |
| apartment_name | `apartment_name` | varchar(255) null | |
| resident_rating | `resident_rating` | smallint null | 1–5 |
| received_at | `received_at` | timestamp null | |
| completed_at | `completed_at` | timestamp null | |
| source_created_at | `source_created_at` | timestamp | `og_tickets.created_at` |
| source_updated_at | `source_updated_at` | timestamp | để đối soát |
| synced_at | `synced_at` | timestamp | |
| timestamps | | | (không softDeletes — full-sync soft-delete bằng cách so `synced_at`; xem 7.5. Có softDeletes) |

> **Unique:** `(tenant_id, source_ticket_id)` (partial WHERE deleted_at IS NULL). Có `softDeletes`.

### 3.4 PlatformResidentVendorOrder (MỚI — central, extends `BaseModel`) — mirror `orders` resi_mart

Bảng `platform_resident_vendor_orders`.

| Field | Column | Type | Mô tả |
|---|---|---|---|
| id | `id` | bigint PK | |
| resident_id | `resident_id` | bigint FK→`platform_residents` | |
| source_instance | `source_instance` | varchar(50) | deployment resi_mart |
| vendor_id | `vendor_id` | varchar(100) | partner.tenant_id (slug vendor) |
| vendor_name | `vendor_name` | varchar(255) | snapshot |
| tenant_id | `tenant_id` | varchar(100) null | CTVH vận hành (orders.tenant_id) |
| tenant_name | `tenant_name` | varchar(255) null | snapshot |
| project_id | `project_id` | bigint null | |
| project_name | `project_name` | varchar(255) null | snapshot |
| source_order_id | `source_order_id` | bigint | `orders.id` |
| order_code | `order_code` | varchar(50) | `orders.code` |
| order_kind | `order_kind` | varchar(20) | `product`\|`service`\|`mixed` (`VendorOrderType::deriveFromItems`) |
| status | `status` | varchar(20) | `VendorOrderStatus` value |
| status_group | `status_group` | varchar(20) | `ResidentOrderStatusGroup` |
| payment_status | `payment_status` | varchar(20) | |
| contact_name | `contact_name` | varchar(255) | |
| contact_phone | `contact_phone` | varchar(20) | |
| apartment_code | `apartment_code` | varchar(50) null | |
| subtotal | `subtotal` | decimal(15,2) | |
| discount_total | `discount_total` | decimal(15,2) | |
| shipping_fee | `shipping_fee` | decimal(15,2) | |
| total | `total` | decimal(15,2) | |
| currency | `currency` | varchar(3) | mặc định `VND` |
| ordered_at | `ordered_at` | timestamp null | |
| confirmed_at | `confirmed_at` | timestamp null | |
| completed_at | `completed_at` | timestamp null | |
| cancelled_at | `cancelled_at` | timestamp null | |
| source_created_at | `source_created_at` | timestamp | |
| source_updated_at | `source_updated_at` | timestamp | |
| synced_at | `synced_at` | timestamp | |
| timestamps, softDeletes | | | |

> **Unique:** `(source_instance, vendor_id, source_order_id)` (partial WHERE deleted_at IS NULL).

### 3.5 platform_resident_orders (VIEW — hợp nhất, chỉ-đọc)

SQL VIEW `UNION ALL` tập cột chung của 3.3 + 3.4 để phục vụ timeline 1 cư dân và danh sách đơn toàn nền tảng:

```
resident_id, source ('og_ticket'|'vendor_order'), source_instance,
ref_id (source_ticket_id|source_order_id), code (NULL|order_code),
title (subject|order_code), kind ('og_ticket'|order_kind),
status, status_group, total (0 cho ticket|total), currency,
tenant_id, tenant_name, vendor_id, vendor_name, project_name,
occurred_at (received_at|ordered_at)
```

> Tạo bằng `DB::statement('CREATE VIEW ...')` trong migration. Model `PlatformResidentOrderView` (read-only) map vào view, `$table = 'platform_resident_orders'`.

### 3.6 PlatformSyncRun (MỚI — central, extends `BaseModel`)

Bảng `platform_sync_runs`.

| Field | Column | Type | Mô tả |
|---|---|---|---|
| id | `id` | bigint PK | |
| status | `status` | varchar(20) | `SyncRunStatus`: running\|success\|failed |
| trigger | `trigger` | varchar(20) | `SyncTrigger`: schedule\|manual |
| triggered_by | `triggered_by` | varchar(255) null | tên/id requester bấm nút |
| started_at | `started_at` | timestamp | |
| finished_at | `finished_at` | timestamp null | |
| duration_seconds | `duration_seconds` | int null | |
| stats | `stats` | json null | `{residents, links, tickets, vendor_orders, tenants_ok, tenants_failed, vendors_ok, vendors_failed, skipped_no_phone, removed}` |
| error_message | `error_message` | text null | |
| timestamps | | | |

> Index `status`, `started_at`. **Cờ đang-đồng-bộ** = tồn tại run `status='running'`.

---

## 4. Enums

### 4.1 ResidentSourceSystem (MỚI, backed string)
| Value | Label (VI) |
|---|---|
| `pmc` | PMC (CTVH) |
| `resi_mart` | Resi Mart (Vendor) |

### 4.2 SyncRunStatus (MỚI, backed string)
| Value | Label (VI) | Color |
|---|---|---|
| `running` | Đang đồng bộ | warning |
| `success` | Thành công | success |
| `failed` | Thất bại | error |

### 4.3 SyncTrigger (MỚI, backed string)
| Value | Label (VI) |
|---|---|
| `schedule` | Theo lịch |
| `manual` | Thủ công |

### 4.4 ResidentOrderStatusGroup (MỚI, backed string — chuẩn hóa cho VIEW hợp nhất)
| Value | Label (VI) | Color | Map từ |
|---|---|---|---|
| `open` | Đang xử lý | info | ticket: received→accepted; vendor: pending/confirmed |
| `done` | Hoàn tất | success | ticket: completed; vendor: completed |
| `cancelled` | Đã hủy/từ chối | neutral | ticket: cancelled/rejected; vendor: cancelled |

### 4.5 ResidentOrderType (derived — chỉ dùng ở Resource VIEW)
| Value | Label (VI) | Nguồn |
|---|---|---|
| `og_ticket` | Phiếu dịch vụ | platform_resident_tickets |
| `product` | Đơn sản phẩm | vendor order (item_type product) |
| `service` | Đơn dịch vụ | vendor order (item_type service) |
| `mixed` | Đơn hỗn hợp | vendor order (mixed) |

> Tái dùng `VendorOrderStatus`, `VendorOrderType`, `OgTicketStatus`, `OgTicketPriority`, `TicketChannel` đã có.

---

## 5. API Endpoints

> Prefix `/api/v1/platform`, guard `auth:requester`. File route: `app/Modules/Platform/routes/external-api.php`.

| Action | Method | URL | Request Class | Ghi chú |
|---|---|---|---|---|
| Tổng quan (cards) | GET | `/residents/summary` | — | tổng cư dân, ticket, đơn vendor, chi tiêu |
| Danh sách cư dân | GET | `/residents` | `ListPlatformResidentRequest` | search SĐT/tên, lọc nguồn, paginate |
| Chi tiết cư dân | GET | `/residents/{id}` | — | danh tính + links (xuất hiện ở đâu) |
| Đơn của cư dân (hợp nhất) | GET | `/residents/{id}/orders` | `ListResidentOrderRequest` | đọc VIEW; lọc type/status_group |
| Trạng thái đồng bộ (cờ) | GET | `/residents/sync/status` | — | `is_syncing` + run gần nhất + `last_synced_at` |
| Đồng bộ ngay (nút) | POST | `/residents/sync` | `TriggerResidentSyncRequest` | dispatch job, trả run (202) |
| Lịch sử đồng bộ | GET | `/residents/sync/history` | — | (tùy chọn) N run gần nhất |

> **Không có endpoint ghi** vào cư dân/đơn — toàn bộ read model do sync sinh ra. Nút sync là hành động duy nhất.

---

## 6. Validation Rules

### 6.1 ListPlatformResidentRequest
| Field | Rules | Message (VI) |
|---|---|---|
| `search` | `nullable\|string\|max:255` | |
| `source_system` | `nullable\|Rule::in(ResidentSourceSystem::values())` | Nguồn không hợp lệ |
| `has_vendor_orders` | `nullable\|boolean` | |
| `sort` | `nullable\|in:last_seen_at,vendor_total_spent,ticket_count,display_name` | |
| `direction` | `nullable\|in:asc,desc` | |
| `per_page` | `nullable\|integer\|min:1\|max:100` | |

### 6.2 ListResidentOrderRequest
| Field | Rules | Message (VI) |
|---|---|---|
| `type` | `nullable\|Rule::in(ResidentOrderType::values())` | |
| `status_group` | `nullable\|Rule::in(ResidentOrderStatusGroup::values())` | |
| `per_page` | `nullable\|integer\|min:1\|max:100` | |

### 6.3 TriggerResidentSyncRequest
| Field | Rules | Ghi chú |
|---|---|---|
| — | (không body) | `authorize()` kiểm tra quyền platform admin |

---

## 7. Business Rules

- [ ] **Khóa danh tính = SĐT chuẩn hóa** qua `PhoneNormalizer::normalize()`. SĐT rỗng → bỏ qua, đếm `skipped_no_phone`.
- [ ] **Upsert idempotent** theo unique key của từng bảng → chạy lại / chồng lấn không sinh trùng.
- [ ] **Resolve resident trước, ghi đơn sau**: cả 2 pipeline đều đi qua bước upsert `platform_residents` theo `phone_normalized` → lấy `resident_id`.
- [ ] **Full re-sync = tự đối soát**: mỗi run cập nhật `synced_at`. Cuối run, dòng `synced_at < run.started_at` (không còn ở nguồn) → **soft delete** (đếm `removed`).
- [ ] **Đổi SĐT ở nguồn** → bản ghi gắn vào resident mới theo SĐT mới; resident cũ mất link đó (link cũ bị soft-delete khi không còn match). Không cố gắng "merge thủ công" ở GĐ1.
- [ ] **Stats denormalized** (`ticket_count`, `vendor_order_count`, `vendor_total_spent`, `tenant_count`, `vendor_count`, `first/last_seen_at`) tính lại cuối run từ các bảng mirror. `vendor_total_spent` **loại đơn `status_group=cancelled`**.
- [ ] **Lock 1 run**: `Cache::lock('platform:resident-sync', ttl)`. Không lấy được lock → trả về run đang chạy (không tạo run mới).
- [ ] **Fail-soft theo schema**: lỗi 1 tenant/vendor → log + tăng `*_failed`, tiếp tục; run vẫn `success` nếu không lỗi toàn cục, kèm danh sách lỗi trong `stats`.
- [ ] **Cờ đang-đồng-bộ**: `GET /residents/sync/status` trả `is_syncing=true` khi có run `running`. FE dựa vào đây để chặn hiển thị (xem FE spec).
- [ ] **resi_mart nhiều instance**: GĐ1 dùng 1 instance (`source_instance='default'`); `source_instance` đã có sẵn trong khóa để mở rộng không phải đổi schema.
- [ ] **Chỉ-đọc**: read model không bao giờ được ghi từ luồng người dùng, chỉ từ sync job.

---

## 8. Presenter Output

### 8.1 Summary (`GET /residents/summary`)
```json
{
  "success": true,
  "data": {
    "total_residents": 1280,
    "total_tickets": 4210,
    "total_vendor_orders": 980,
    "total_vendor_spent": 845200000,
    "last_synced_at": "2026-06-20T02:00:31+07:00"
  }
}
```

### 8.2 List row (`GET /residents`)
```json
{
  "id": 12,
  "phone_normalized": "0912345678",
  "display_name": "Nguyễn Văn A",
  "email": "a@example.com",
  "tenant_count": 2,
  "vendor_count": 1,
  "ticket_count": 5,
  "vendor_order_count": 3,
  "vendor_total_spent": 2150000,
  "last_seen_at": "2026-06-18T10:22:00+07:00"
}
```

### 8.3 Detail (`GET /residents/{id}`)
```json
{
  "success": true,
  "data": {
    "id": 12,
    "phone_normalized": "0912345678",
    "display_name": "Nguyễn Văn A",
    "email": "a@example.com",
    "ticket_count": 5,
    "vendor_order_count": 3,
    "vendor_total_spent": 2150000,
    "first_seen_at": "2026-01-04T09:00:00+07:00",
    "last_seen_at": "2026-06-18T10:22:00+07:00",
    "links": [
      { "source_system": {"value":"pmc","label":"PMC (CTVH)"}, "source_ref_id":"tnp","source_ref_name":"TNP Services","local_customer_id":1009,"local_name":"Nguyễn Văn A" },
      { "source_system": {"value":"resi_mart","label":"Resi Mart (Vendor)"}, "source_ref_id":"hoaqua","source_ref_name":"Hoa Quả Sạch","local_customer_id":55,"local_name":"A Nguyen" }
    ]
  }
}
```

### 8.4 Order row (`GET /residents/{id}/orders`)
```json
{
  "source": {"value":"vendor_order","label":"Đơn sản phẩm"},
  "type": {"value":"product","label":"Đơn sản phẩm"},
  "ref_id": 55,
  "code": "DH-000123",
  "title": "DH-000123",
  "status_group": {"value":"done","label":"Hoàn tất"},
  "total": 350000,
  "currency": "VND",
  "tenant_name": "TNP Services",
  "vendor_name": "Hoa Quả Sạch",
  "project_name": "Vinhomes Grand Park",
  "occurred_at": "2026-06-18T10:22:00+07:00"
}
```
> Ticket row: `source.value="og_ticket"`, `total=0`, `vendor_name=null`, `code=null`.

### 8.5 Sync status (`GET /residents/sync/status`)
```json
{
  "success": true,
  "data": {
    "is_syncing": false,
    "last_synced_at": "2026-06-20T02:00:31+07:00",
    "latest_run": {
      "id": 87,
      "status": {"value":"success","label":"Thành công"},
      "trigger": {"value":"schedule","label":"Theo lịch"},
      "started_at": "2026-06-20T02:00:00+07:00",
      "finished_at": "2026-06-20T02:00:31+07:00",
      "duration_seconds": 31,
      "stats": {"residents":1280,"tickets":4210,"vendor_orders":980,"tenants_ok":12,"tenants_failed":0,"vendors_ok":5,"vendors_failed":0,"skipped_no_phone":7,"removed":3}
    }
  }
}
```

### 8.6 Trigger sync (`POST /residents/sync`) — HTTP 202
```json
{ "success": true, "data": { "is_syncing": true, "run_id": 88, "started_at": "2026-06-20T14:05:00+07:00" } }
```

---

## 9. Cross-Module Dependencies (ExternalService)

> ExternalService chỉ giữa **top-level modules**. Platform là chủ read model; nó gọi PMC và Marketplace để lấy dữ liệu nguồn.

| Dependency | Module nguồn | Interface (MỚI) | Method |
|---|---|---|---|
| Cư dân + ticket theo tenant | PMC | `PlatformResidentSyncExternalServiceInterface` | `fetchForTenant(Organization $tenant): array` — chạy `$tenant->run()` nội bộ, dùng `CustomerRepository` + `OgTicketRepository`, trả DTO `{customers[], tickets[]}` |
| Đơn vendor + khách theo vendor | Marketplace | `PlatformResidentVendorSyncExternalServiceInterface` | `fetchAllVendorOrders(): array` — loop `PartnerRepository::allPlatformPartners()` + `ResiMartConnection::runInTenantSchema`, trả DTO `{vendor_id, vendor_name, orders[], customers[]}[]` |
| Tên tenant/dự án | Platform/Tenant (đã có) | `OrganizationLookupExternalServiceInterface` | tái dùng để resolve tên (nếu cần) |

> PMC & Marketplace **chỉ trả dữ liệu thô (DTO/array)** — Platform tự upsert vào read model qua repository của Platform. Không module nào ghi vào bảng `platform_*` ngoài Platform.

---

## 10. Kế hoạch triển khai BE

- [ ] **Migrations (central, `database/migrations/`)**:
  - `create_platform_residents_table` (+ partial unique `phone_normalized`)
  - `create_platform_resident_links_table` (+ partial unique 4 cột)
  - `create_platform_resident_tickets_table` (+ partial unique `tenant_id,source_ticket_id`)
  - `create_platform_resident_vendor_orders_table` (+ partial unique)
  - `create_platform_sync_runs_table`
  - `create_platform_resident_orders_view` (`DB::statement` CREATE VIEW; down = DROP VIEW)
- [ ] **Models** (extends `BaseModel`, `casts()` cho datetime/enum/decimal/json): 5 model + `PlatformResidentOrderView` (read-only, không timestamps).
- [ ] **Enums**: `ResidentSourceSystem`, `SyncRunStatus`, `SyncTrigger`, `ResidentOrderStatusGroup` (+ helper `values()`, `label()`, `color()`); `ResidentOrderType` (derived).
- [ ] **Repositories** (extends `BaseRepository`):
  - `PlatformResidentRepository`: `list($filters)`, `findWithLinks($id)`, `summary()`, `upsertByPhone($data)`, `recomputeStats()`
  - `PlatformResidentLinkRepository`: `upsert($data)`, `markUnsynced($residentIds, $before)`
  - `PlatformResidentTicketRepository`: `upsert($data)`, `softDeleteStale($before)`
  - `PlatformResidentVendorOrderRepository`: `upsert($data)`, `softDeleteStale($before)`
  - `PlatformResidentOrderRepository`: `listForResident($residentId, $filters)` (đọc VIEW)
  - `PlatformSyncRunRepository`: `createRunning($trigger,$by)`, `markSuccess($id,$stats)`, `markFailed($id,$msg)`, `latest()`, `isSyncing()`
- [ ] **Services**:
  - `ResidentDirectoryService` (read): summary/list/detail/orders
  - `ResidentSyncService`: orchestrate (lock → run row → PMC pass → resi_mart pass → soft-delete stale → recompute stats → mark success/failed); `executeInTransaction` cho cụm upsert mỗi tenant/vendor
- [ ] **ExternalServices**: 2 interface + impl ở PMC & Marketplace (mục 9); bind trong ServiceProvider tương ứng.
- [ ] **Job**: `SyncResidentDirectoryJob implements ShouldQueue` (tries, backoff, timeout, `failed()` → mark run failed). Gọi `ResidentSyncService`.
- [ ] **Command**: `php artisan platform:sync-residents {--trigger=schedule}` → dispatch job (hoặc chạy sync trực tiếp nếu cần đồng bộ).
- [ ] **Scheduler** (`routes/console.php`): `Schedule::command('platform:sync-residents')->dailyAt('02:00')->withoutOverlapping()->onOneServer()`.
- [ ] **Requests**: `ListPlatformResidentRequest`, `ListResidentOrderRequest`, `TriggerResidentSyncRequest`.
- [ ] **Resources**: `PlatformResidentListResource`, `PlatformResidentDetailResource`, `ResidentLinkResource`, `ResidentOrderResource`, `SyncRunResource`.
- [ ] **Controller**: `PlatformResidentController` (summary/index/show/orders) + `ResidentSyncController` (status/trigger/history).
- [ ] **Routes**: thêm vào `external-api.php` (GET trước, POST sync sau).
- [ ] **Provider**: đăng ký binding interface→impl trong `PlatformServiceProvider` (+ PMC/Marketplace cho ExternalService).
- [ ] **Tests** (feature, SQLite in-memory; resi_mart fake bằng bảng tạm/seed schema):
  - sync gộp 2 cư dân khác tenant cùng SĐT → 1 resident, 2 links
  - SĐT chuẩn hóa (`+84` → `0`) gộp đúng
  - SĐT rỗng → skip, đếm `skipped_no_phone`
  - ticket & vendor order upsert đúng, chạy 2 lần không nhân đôi (idempotent)
  - dòng nguồn biến mất → soft delete khi full-sync (`removed`)
  - stats `vendor_total_spent` loại đơn cancelled
  - lock: trigger khi đang running → trả run hiện tại, không tạo run mới
  - `GET /residents/{id}/orders` trả timeline hợp nhất sort theo `occurred_at`
  - summary đếm đúng
- [ ] `make format` → `make lint` → `make test-filter F=Resident...`

---

## 11. Khác biệt so với phân tích trước
| Phân tích | Spec chốt | Lý do |
|---|---|---|
| event-driven (PMC) + poll (resi_mart) + reconciliation | **full-sync hằng ngày + nút manual** | User chọn đơn giản; full-sync tự đối soát |
| 1 bảng đơn hợp nhất | **2 bảng + VIEW** | 2 aggregate khác bounded context; ticket không có tiền |
| on-demand live detail | đọc snapshot (GĐ1) | giữ đơn giản; live-detail để GĐ2 |

---

## 12. Checklist triển khai BE
- [ ] 6 migration (5 bảng + 1 view) chạy được up/down
- [ ] 5 model + 1 view-model + casts
- [ ] 4 enum mới + helper
- [ ] 6 repository
- [ ] 2 service + 2 ExternalService (PMC, Marketplace) + binding provider
- [ ] Job + Command + Scheduler daily
- [ ] 3 request + 5 resource + 2 controller + routes
- [ ] Test feature xanh
- [ ] `make format` → `make lint` → test pass
