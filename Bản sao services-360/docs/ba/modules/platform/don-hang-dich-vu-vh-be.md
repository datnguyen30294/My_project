# Đơn hàng dịch vụ vận hành (TenantServiceOrder) - Đặc tả kỹ thuật Backend

> Module: `Platform/TenantServiceOrder` (submodule mới) | Ngày tạo: 2026-06-16 | Trạng thái: Draft
>
> Nguồn mockup: `BA-TNP-SERVICES/app/pages/platform/modules/quan-ly-don-hang/don-hang-dich-vu-vh/`

## 1. Tổng quan

Console cấp **Platform** để vận hành viên nền tảng tạo và quản lý các đơn dịch vụ mà **công ty vận hành (tenant)** phải trả cho **Platform**: gói đăng ký SaaS, phí triển khai, mua thêm module, hóa đơn phí phát sinh.

Đây là dòng tiền **B2B trực tiếp Platform ↔ tenant**, KHÁC hẳn đơn hàng vendor (Platform chỉ thu hoa hồng %). Với đơn dịch vụ vận hành, **100% giá trị đơn = doanh thu Platform** khi đơn đã `paid`.

Đặc điểm kỹ thuật quan trọng:

- Entity **mới hoàn toàn**, KHÔNG tồn tại trong codebase hiện tại.
- Bảng nằm ở **central DB** (không phải schema tenant), giống `project_fee_configs` — vì đây là dữ liệu Platform sở hữu, tham chiếu tới nhiều tenant.
- `organization_id` là **string(50) FK → `tenants.id`** (slug tenant), đúng pattern `ProjectFeeConfig`.
- Mọi route đặt dưới guard **`auth:requester`** (admin platform), prefix `api/v1/platform`, đăng ký trong `app/Modules/Platform/routes/external-api.php`.

### Phạm vi & quyết định (đọc kỹ)

| # | Quyết định | Lý do |
|---|-----------|-------|
| 1 | **Full CRUD** + line items + luồng trạng thái (như mockup) | Entity mới, mockup mô tả đầy đủ tạo/sửa/đánh dấu thanh toán/huỷ |
| 2 | **KHÔNG có thao tác Xóa (delete) trên UI** — chỉ Huỷ (cancel) | Mockup không có nút xóa; đơn được huỷ chứ không xóa. Model vẫn dùng SoftDeletes cho vệ sinh dữ liệu |
| 3 | 2 card **"Nguồn khách marketplace"** + **"Đánh giá cư dân (marketplace)"** → **HOÃN (Giai đoạn 2)** | Cần dữ liệu vendor order (resi_mart) có `customer_source` + `resident_rating` — hiện chưa có. Xem §11 |
| 4 | `Organization` (công ty VH) inject **trực tiếp repository** (cùng module Platform) | ExternalService chỉ dùng giữa top-level module; submodule trong cùng Platform import trực tiếp |

---

## 2. Entities

### 2.1 TenantServiceOrder

**Bảng:** `tenant_service_orders` (central DB)

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| Mã đơn | `code` | `string(50)` | unique (partial, where deleted_at null) | Tự sinh `TSO-YYYYMMDD-NNN` |
| Công ty VH | `organization_id` | `string(50)` | FK → `tenants.id`, index, required | Tenant phải trả tiền |
| Loại đơn | `order_type` | `string(30)` | index, enum `TenantServiceOrderType` | |
| Trạng thái | `status` | `string(30)` | index, enum `TenantServiceOrderStatus`, default `draft` | |
| Tiêu đề | `title` | `string(255)` | required | VD: "Gói Business — tháng 5/2026" |
| Gói dịch vụ | `service_plan` | `string(30)` | nullable, enum `ServicePlan` | Tham chiếu gói tenant (tuỳ chọn) |
| Kỳ từ | `billing_period_start` | `date` | nullable | |
| Kỳ đến | `billing_period_end` | `date` | nullable | `>= billing_period_start` |
| Giá trị đơn | `amount` | `decimal(15,2)` | default 0 | Số tiền tenant trả; 100% = DT Platform khi `paid` |
| Thời điểm thanh toán | `paid_at` | `timestamp` | nullable | Ghi nhận khi chuyển sang `paid` |
| Ghi chú | `notes` | `text` | nullable | |
| Người tạo | `created_by` | `unsignedBigInteger` | nullable | Auditable |
| Người cập nhật | `updated_by` | `unsignedBigInteger` | nullable | Auditable |
| Người xóa | `deleted_by` | `unsignedBigInteger` | nullable | Auditable |
| Ngày xóa | `deleted_at` | `timestamp` | nullable | SoftDeletes |

**Model:** extends `BaseModel`. Force central connection (như `ProjectFeeConfig`):

```php
public function getConnectionName(): ?string
{
    return config('tenancy.database.central_connection');
}
```

**Relationships:**
- `organization(): BelongsTo` → `Organization` (key `organization_id`).
- `lines(): HasMany` → `TenantServiceOrderLine`.

**Computed (accessor / presenter):**
- `platform_revenue` = `amount` nếu `status === paid`, ngược lại `0`.

### 2.2 TenantServiceOrderLine

**Bảng:** `tenant_service_order_lines` (central DB)

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| Đơn | `order_id` | `foreignId` | FK → `tenant_service_orders`, cascadeOnDelete, index | |
| Mô tả | `description` | `string(255)` | required | |
| Số lượng | `quantity` | `integer` | default 1, min 1 | |
| Đơn giá | `unit_price` | `decimal(15,2)` | default 0 | |
| Thành tiền | `line_total` | `decimal(15,2)` | default 0 | `quantity * unit_price` (tính ở service) |

**Model:** bảng line-item sống/chết theo cha → extends `Model` trực tiếp (KHÔNG cần BaseModel/SoftDeletes/auditable). Force central connection. Hard delete.

**Relationship:** `order(): BelongsTo` → `TenantServiceOrder`.

> **Lưu ý nghiệp vụ:** `amount` của đơn là nguồn chân lý (nhập tay). Các dòng (`lines`) chỉ mang tính diễn giải/bóc tách; UI cảnh báo khi `sum(line_total) !== amount` nhưng KHÔNG chặn lưu.

---

## 3. Enums

### 3.1 TenantServiceOrderType

| Key | Value | Label (VI) |
|-----|-------|------------|
| `Subscription` | `subscription` | Gói đăng ký |
| `Setup` | `setup` | Phí triển khai |
| `Addon` | `addon` | Mua thêm module |
| `Invoice` | `invoice` | Hóa đơn phí |

### 3.2 TenantServiceOrderStatus

| Key | Value | Label (VI) | color() |
|-----|-------|------------|---------|
| `Draft` | `draft` | Nháp | `neutral` |
| `PendingPayment` | `pending_payment` | Chờ thanh toán | `warning` |
| `Paid` | `paid` | Đã thanh toán | `success` |
| `Cancelled` | `cancelled` | Đã huỷ | `error` |

**Chuyển trạng thái hợp lệ** (`allowedTransitions()` — theo pattern `OrderStatus` của PMC):

| Từ | Tới |
|----|-----|
| `draft` | `pending_payment`, `cancelled` |
| `pending_payment` | `paid`, `cancelled` |
| `paid` | — (terminal) |
| `cancelled` | — (terminal) |

### 3.3 ServicePlan (tái dùng)

Dùng lại `App\Modules\Platform\Tenant\Enums\ServicePlan` (`starter` / `business` / `enterprise`). KHÔNG tạo mới.

---

## 4. API Endpoints

> Prefix: `api/v1/platform` · Guard: `auth:requester` · File: `app/Modules/Platform/routes/external-api.php`

| Action | Method | URL | Request Class |
|--------|--------|-----|---------------|
| Thống kê (KPI cards) | GET | `/tenant-service-orders/stats` | `ListTenantServiceOrderRequest` |
| Danh sách | GET | `/tenant-service-orders` | `ListTenantServiceOrderRequest` |
| Chi tiết | GET | `/tenant-service-orders/{id}` | — |
| Tạo mới | POST | `/tenant-service-orders` | `CreateTenantServiceOrderRequest` |
| Cập nhật | PUT | `/tenant-service-orders/{id}` | `UpdateTenantServiceOrderRequest` |
| Chuyển trạng thái | POST | `/tenant-service-orders/{id}/transition` | `TransitionTenantServiceOrderRequest` |
| Thêm dòng | POST | `/tenant-service-orders/{id}/lines` | `CreateTenantServiceOrderLineRequest` |
| Xóa dòng | DELETE | `/tenant-service-orders/{id}/lines/{lineId}` | — |

**Ghi chú endpoint:**
- **Không có** `DELETE /tenant-service-orders/{id}` (UI dùng huỷ qua `transition`, không xóa).
- "Đánh dấu đã thanh toán" và "Huỷ đơn" trên UI đều gọi `POST .../transition` với `status` đích (`paid` / `cancelled`) — theo đúng convention `OrderController@transition` của PMC. Khi chuyển sang `paid`, service set `paid_at = now()`.
- `update` **không** đổi `status` và **không** đổi `organization_id` (immutable sau khi tạo) — đổi trạng thái đi qua `transition`.

---

## 5. Validation Rules

### CreateTenantServiceOrderRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `organization_id` | `required`, `string`, `exists:tenants,id` | "Vui lòng chọn công ty vận hành." |
| `order_type` | `required`, `Rule::in(TenantServiceOrderType::values())` | "Loại đơn không hợp lệ." |
| `title` | `required`, `string`, `max:255` | "Vui lòng nhập tiêu đề đơn." |
| `amount` | `required`, `numeric`, `min:1` | "Giá trị đơn phải lớn hơn 0." |
| `status` | `nullable`, `Rule::in(TenantServiceOrderStatus::values())` | (mặc định `draft`) |
| `service_plan` | `nullable`, `Rule::in(ServicePlan::values())` | |
| `billing_period_start` | `nullable`, `date` | |
| `billing_period_end` | `nullable`, `date`, `after_or_equal:billing_period_start` | "Kỳ kết thúc phải sau kỳ bắt đầu." |
| `notes` | `nullable`, `string`, `max:1000` | |

### UpdateTenantServiceOrderRequest

Giống Create nhưng **bỏ** `organization_id` và `status` (immutable / qua transition). Các field còn lại dùng `sometimes`.

### TransitionTenantServiceOrderRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `status` | `required`, `Rule::in(TenantServiceOrderStatus::values())` | "Trạng thái không hợp lệ." |

> Service kiểm tra `allowedTransitions()`; nếu không hợp lệ → ném `InvalidOrderTransitionException` (theo pattern `InvalidPartnerTransitionException`), trả 422.

### CreateTenantServiceOrderLineRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `description` | `required`, `string`, `max:255` | "Vui lòng nhập mô tả dòng." |
| `quantity` | `required`, `integer`, `min:1` | "Số lượng tối thiểu là 1." |
| `unit_price` | `required`, `numeric`, `min:0` | "Đơn giá không hợp lệ." |

### ListTenantServiceOrderRequest (list + stats)

| Field | Rules |
|-------|-------|
| `search` | `nullable`, `string`, `max:100` |
| `organization_id` | `nullable`, `string`, `exists:tenants,id` |
| `order_type` | `nullable`, `Rule::in(TenantServiceOrderType::values())` |
| `status` | `nullable`, `Rule::in(TenantServiceOrderStatus::values())` |
| `page` | `nullable`, `integer`, `min:1` |
| `per_page` | `nullable`, `integer`, `min:1`, `max:50` |

---

## 6. Business Rules

- [ ] `code` tự sinh dạng `TSO-YYYYMMDD-NNN` (repository `generateCode()`, theo pattern `OrderRepository::generateCode()`).
- [ ] Khi tạo, `status` mặc định `draft` nếu không truyền.
- [ ] **Doanh thu Platform** (`platform_revenue`) = `amount` khi `status === paid`, ngược lại `0`.
- [ ] Chuyển trạng thái phải tuân theo `allowedTransitions()`; vi phạm → 422.
- [ ] Khi `transition` sang `paid`: set `paid_at = now()`. Khi rời khỏi `paid` (không xảy ra do `paid` là terminal) → không áp dụng.
- [ ] `update` không đổi `organization_id` và `status`.
- [ ] `line_total = quantity * unit_price` (tính ở service, không nhận từ client).
- [ ] `lines` là tuỳ chọn; `amount` là nguồn chân lý. Không bắt buộc `sum(line_total) === amount`.
- [ ] Tìm kiếm list theo `code`, `title`, và **tên công ty VH** (join/`whereHas` qua `organization`).
- [ ] `search_path` không cần đổi (bảng ở central DB) — KHÔNG dùng tenancy schema switching cho phần lõi.
- [ ] Stats trả về 4 metric tính trên TOÀN BỘ đơn (tôn trọng filter nếu có truyền): `total`, `platform_revenue` (tổng `amount` các đơn `paid`), `pending_amount` (tổng `amount` các đơn `pending_payment`), `paid_count`.

---

## 7. Presenter Output

### TenantServiceOrderListResource

```json
{
  "id": 12,
  "code": "TSO-20260516-003",
  "organization": { "id": "acme", "name": "Acme Vận hành" },
  "order_type": { "value": "subscription", "label": "Gói đăng ký" },
  "title": "Gói Business — tháng 5/2026",
  "amount": "5000000.00",
  "platform_revenue": "5000000.00",
  "status": { "value": "paid", "label": "Đã thanh toán" },
  "billing_period": { "start": "2026-05-01", "end": "2026-05-31" }
}
```

### TenantServiceOrderDetailResource

```json
{
  "id": 12,
  "code": "TSO-20260516-003",
  "organization": { "id": "acme", "name": "Acme Vận hành" },
  "order_type": { "value": "subscription", "label": "Gói đăng ký" },
  "service_plan": { "value": "business", "label": "Business" },
  "status": { "value": "paid", "label": "Đã thanh toán" },
  "title": "Gói Business — tháng 5/2026",
  "amount": "5000000.00",
  "platform_revenue": "5000000.00",
  "billing_period": { "start": "2026-05-01", "end": "2026-05-31" },
  "paid_at": "2026-05-03T09:00:00+07:00",
  "notes": null,
  "lines": [
    { "id": 1, "description": "Gói Business", "quantity": 1, "unit_price": "5000000.00", "line_total": "5000000.00" }
  ],
  "lines_total": "5000000.00",
  "updated_at": "2026-05-03T09:00:00+07:00"
}
```

> Enum fields: `{ "value": "...", "label": "..." }`. Tiền: chuỗi `decimal:2`. Không xuất `created_at` ở list trừ khi cần.

---

## 8. Cross-Module Dependencies

| Dependency | Module nguồn | Cách dùng |
|-----------|-------------|-----------|
| `Organization` (công ty VH / tenant) | **Platform/Tenant (CÙNG module)** | Inject `OrganizationRepository` trực tiếp — KHÔNG ExternalService (cùng top-level module Platform) |

> **Phần lõi không có cross top-level module dependency.** Phần HOÃN (§11) sẽ cần dữ liệu vendor order từ module **Marketplace** — khi đó dùng ExternalService theo pattern hiện có.

---

## 9. Migration Preview

```php
// tenant_service_orders (central DB)
Schema::create('tenant_service_orders', function (Blueprint $table): void {
    $table->id();
    $table->string('code', 50);
    $table->string('organization_id', 50);
    $table->string('order_type', 30);
    $table->string('status', 30)->default('draft');
    $table->string('title', 255);
    $table->string('service_plan', 30)->nullable();
    $table->date('billing_period_start')->nullable();
    $table->date('billing_period_end')->nullable();
    $table->decimal('amount', 15, 2)->default(0);
    $table->timestamp('paid_at')->nullable();
    $table->text('notes')->nullable();

    $table->unsignedBigInteger('created_by')->nullable();
    $table->unsignedBigInteger('updated_by')->nullable();
    $table->unsignedBigInteger('deleted_by')->nullable();
    $table->timestamps();
    $table->softDeletes();

    $table->foreign('organization_id')->references('id')->on('tenants')->cascadeOnDelete();
    $table->index('organization_id');
    $table->index('order_type');
    $table->index('status');
});

DB::statement('CREATE UNIQUE INDEX tenant_service_orders_code_unique ON tenant_service_orders (code) WHERE deleted_at IS NULL');

// tenant_service_order_lines (central DB)
Schema::create('tenant_service_order_lines', function (Blueprint $table): void {
    $table->id();
    $table->foreignId('order_id')->constrained('tenant_service_orders')->cascadeOnDelete();
    $table->string('description', 255);
    $table->integer('quantity')->default(1);
    $table->decimal('unit_price', 15, 2)->default(0);
    $table->decimal('line_total', 15, 2)->default(0);
    $table->timestamps();
});
```

> Đặt migration ở `backend/database/migrations/` (central, KHÔNG phải `migrations/tenant/`).

---

## 10. Checklist triển khai BE

- [ ] Migrations: `tenant_service_orders`, `tenant_service_order_lines` (central DB)
- [ ] Models: `TenantServiceOrder` (BaseModel, central connection), `TenantServiceOrderLine` (Model, central connection)
- [ ] Enums: `TenantServiceOrderType`, `TenantServiceOrderStatus` (kèm `label()`, `color()`, `values()`, `allowedTransitions()`)
- [ ] Exception: `InvalidOrderTransitionException` (hoặc tái dùng pattern hiện có)
- [ ] Repository: `TenantServiceOrderRepository extends BaseRepository` — `list()`, `generateCode()`, `stats()`
- [ ] Service + Interface: `TenantServiceOrderService implements TenantServiceOrderServiceInterface` — create/update/transition/addLine/deleteLine/stats; inject `OrganizationRepository`
- [ ] Resources: `TenantServiceOrderListResource`, `TenantServiceOrderDetailResource`, `TenantServiceOrderLineResource` (extends BaseResource)
- [ ] Requests: `Create/Update/List/TransitionTenantServiceOrderRequest`, `CreateTenantServiceOrderLineRequest`
- [ ] Controllers: `TenantServiceOrderController` (CRUD + transition), `TenantServiceOrderLineController` (store/destroy)
- [ ] Routes trong `external-api.php` (guard `auth:requester`)
- [ ] Factory + Seeder cho cả 2 model
- [ ] ServiceProvider binding interface → service; PSR-4
- [ ] Tests (Feature): list/filter/stats, create, update, transition hợp lệ + sai luồng (422), line add/delete
- [ ] `make format` → `make lint` → chạy test liên quan

---

## 11. PHẦN HOÃN — Giai đoạn 2 (Marketplace aggregates)

> Các thành phần dưới đây **KHÔNG triển khai ở Giai đoạn 1** vì phụ thuộc dữ liệu chưa có.

### 11.1 Cột/Card cần dữ liệu vendor order

| Vị trí | Nội dung | Phụ thuộc |
|--------|----------|-----------|
| Cột list "Nguồn khách (MP)" | Tổng hợp đơn vendor theo nguồn trong kỳ (VD "3 dự án · 1 vãng lai") | `customer_source` trên vendor order |
| Cột list "Đánh giá CD" | TB sao + số lượt đánh giá đơn vendor hoàn tất trong kỳ | `resident_rating` trên vendor order |
| Card detail "Nguồn khách marketplace" | Bóc tách project / walk_in / tổng | `customer_source` |
| Card detail "Đánh giá của cư dân (marketplace)" | Bảng từng đơn vendor có đánh giá trong kỳ | `resident_rating`, `resident_rating_comment`, `resident_rated_at`, `resident_name` |

### 11.2 Dependency cần bổ sung trước khi làm

- Module **Marketplace `VendorOrder`** (đọc từ resi_mart) hiện **KHÔNG có** các field `customer_source`, `resident_rating`, `resident_rating_comment`, `resident_rated_at`, thông tin cư dân.
- Cần phối hợp **resi_mart** bổ sung các field này vào schema `orders` + cập nhật model/resource `VendorOrder`.
- Phần tổng hợp theo kỳ sẽ phải loop qua các vendor của tenant + switch schema resi_mart (`ResiMartConnection::runInTenantSchema`) và đối chiếu `completed_at` với `billing_period_start/end` của đơn dịch vụ vận hành → khi đó mới dùng ExternalService giữa Platform ↔ Marketplace.
