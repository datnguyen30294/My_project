# Module Đơn hàng - Đặc tả kỹ thuật Backend

> Module: `PMC/Order` | Ngày tạo: 2026-03-22 | Trạng thái: Draft

## 1. Tổng quan

Sub-module **Đơn hàng (Order)** thuộc luồng Quản lý đơn hàng. Tạo đơn hàng từ báo giá đã chấp thuận (`Quote.status = approved`). Hệ thống tự động copy dòng từ báo giá sang đơn hàng. Pricing đơn giản: `unit_price × quantity` (không có khuyến mãi).

**Phạm vi:**
- **Đơn hàng (Order):** Tạo từ Quote approved, quản lý trạng thái công việc.
- **Dòng đơn hàng (OrderLine):** Copy từ QuoteLine, snapshot tên + giá.

> **Audit:** Order model implements `Auditable` (owen-it/laravel-auditing) — tự động track mọi thay đổi field.

> **Hoa hồng (Commission):** Sẽ triển khai ở phase sau.

**Luồng nghiệp vụ:**
```
Quote (approved) → Tạo đơn hàng (draft) → Xác nhận (confirmed) → Thực hiện (in_progress) → Hoàn thành (completed)
                                              ↘ Hủy (cancelled)     ↘ Hủy (cancelled)        ↘ Hủy (cancelled)
```

**Cấu trúc module:**

```
app/Modules/PMC/src/Order/
├── Controllers/
│   └── OrderController.php
├── Models/
│   ├── Order.php
│   └── OrderLine.php
├── Services/
│   ├── OrderService.php
│   └── Contracts/
│       └── OrderServiceInterface.php
├── Repositories/
│   └── OrderRepository.php
├── Resources/
│   ├── OrderListResource.php
│   ├── OrderDetailResource.php
│   └── OrderLineResource.php
├── Requests/
│   ├── ListOrderRequest.php
│   ├── CreateOrderRequest.php
│   ├── UpdateOrderRequest.php
│   ├── TransitionOrderRequest.php
│   └── DeleteOrderRequest.php
└── Enums/
    └── OrderStatus.php
```

## 2. Entities

### 2.1 Order (Đơn hàng)

**Bảng:** `orders`

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| Mã đơn hàng | `code` | `string(50)` | required, unique per tenant | Mã tự sinh: SO-YYYYMMDD-XXX |
| Báo giá | `quote_id` | `foreignId` | required, FK → quotes | Báo giá nguồn (approved) |
| Trạng thái | `status` | `string(30)` | required | OrderStatus enum |
| Tổng tiền | `total_amount` | `decimal(15,2)` | required, default: 0 | Sum(line_amount) các dòng |
| Ghi chú | `note` | `text` | nullable | Ghi chú nội bộ |
| created_at | `created_at` | `timestamp` | auto | |
| updated_at | `updated_at` | `timestamp` | auto | |
| deleted_at | `deleted_at` | `timestamp` | nullable, soft delete | |

**Indexes:**
- `orders_quote_id_index` on `quote_id`
- `orders_status_index` on `status`
- `orders_code_unique` — partial unique index (WHERE deleted_at IS NULL)
- `orders_quote_id_active_unique` — partial unique index on (`quote_id`) WHERE `status != 'cancelled' AND deleted_at IS NULL` → đảm bảo mỗi quote chỉ có 1 đơn hàng active

**Relationships:**
- `belongsTo` → `Quote` (quote_id)
- `hasMany` → `OrderLine` (order_id)
- `morphMany` → `Audit` (via Auditable trait — auto)

> **Truy cập OgTicket:** Qua quan hệ Quote → OgTicket (`$order->quote->ogTicket`). Không cần FK trực tiếp.

### 2.2 OrderLine (Dòng đơn hàng)

**Bảng:** `order_lines`

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| Đơn hàng | `order_id` | `foreignId` | required, FK → orders, cascade delete | |
| Loại dòng | `line_type` | `string(30)` | required | QuoteLineType enum (reuse) |
| Ref ID | `reference_id` | `unsignedBigInteger` | required | ID của CatalogItem hoặc CatalogAdhocItem |
| Tên snapshot | `name` | `string(255)` | required | Tên hạng mục tại thời điểm tạo |
| Số lượng | `quantity` | `integer` | required, min: 1 | |
| Đơn vị | `unit` | `string(50)` | required | |
| Đơn giá | `unit_price` | `decimal(15,2)` | required | Giá 1 đơn vị (snapshot từ quote) |
| Thành tiền | `line_amount` | `decimal(15,2)` | required | unit_price × quantity (server tính) |
| created_at | `created_at` | `timestamp` | auto | |
| updated_at | `updated_at` | `timestamp` | auto | |

**Indexes:**
- `order_lines_order_id_index` on `order_id`

**Relationships:**
- `belongsTo` → `Order` (order_id)

> **Ghi chú:** `reference_id` là polymorphic theo `line_type` (giống QuoteLine):
> - `material` / `service` → FK tới `catalog_items.id`
> - `adhoc` → FK tới `catalog_adhoc_items.id`
>
> Không dùng morphTo vì snapshot tên/giá — không join lại catalog.

## 3. Enums

### 3.1 OrderStatus

```php
enum OrderStatus: string
{
    case Draft = 'draft';               // Nháp — vừa tạo từ báo giá
    case Confirmed = 'confirmed';       // Đã xác nhận — sẵn sàng thực hiện
    case InProgress = 'in_progress';    // Đang thực hiện
    case Completed = 'completed';       // Hoàn thành
    case Cancelled = 'cancelled';       // Đã hủy
}
```

**State machine:**
```
draft → confirmed → in_progress → completed ✓ (final)
  ↘ cancelled   ↘ cancelled    ↘ cancelled
```

### 3.2 OrderLineType — Reuse `QuoteLineType`

Dùng lại `App\Modules\PMC\Quote\Enums\QuoteLineType` vì cùng giá trị (`material`, `service`, `adhoc`) và cùng top-level module PMC → import trực tiếp.

## 4. API Endpoints

Prefix: `/api/v1/pmc/orders`

### 4.1 Danh sách đơn hàng

```
GET /api/v1/pmc/orders
```

**Query params (ListOrderRequest):**

| Param | Type | Mô tả |
|-------|------|-------|
| `search` | string | Tìm theo code, tên ticket (qua quote → og_ticket) |
| `status` | string | Filter theo OrderStatus |
| `sort_by` | string | created_at (default), total_amount |
| `sort_direction` | string | desc (default), asc |
| `per_page` | integer | 15 (default), max 100 |

**Response:** Paginated `OrderListResource`

```json
{
  "success": true,
  "data": [{
    "id": 1,
    "code": "SO-20260322-001",
    "status": { "value": "draft", "label": "Nháp" },
    "quote": { "id": 5, "code": "QT-20260320-001" },
    "og_ticket": { "id": 1, "subject": "Sửa máy lạnh" },
    "total_amount": "920000.00",
    "lines_count": 3,
    "created_at": "2026-03-22T10:00:00.000000Z"
  }]
}
```

### 4.2 Chi tiết đơn hàng

```
GET /api/v1/pmc/orders/{order}
```

**Response:** `OrderDetailResource` (bao gồm lines)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "code": "SO-20260322-001",
    "status": { "value": "draft", "label": "Nháp" },
    "quote": {
      "id": 5,
      "code": "QT-20260320-001",
      "status": { "value": "approved", "label": "Đã chấp thuận" }
    },
    "og_ticket": {
      "id": 1,
      "subject": "Sửa máy lạnh",
      "requester_name": "Nguyễn Văn A"
    },
    "total_amount": "920000.00",
    "note": null,
    "lines": [{
      "id": 1,
      "line_type": { "value": "material", "label": "Vật tư" },
      "reference_id": 3,
      "name": "Gas R32 1kg",
      "quantity": 1,
      "unit": "bình",
      "unit_price": "320000.00",
      "line_amount": "320000.00"
    }],
    "created_at": "2026-03-22T10:00:00.000000Z",
    "updated_at": "2026-03-22T10:00:00.000000Z"
  }
}
```

### 4.3 Danh sách báo giá khả dụng (cho tạo đơn)

```
GET /api/v1/pmc/orders/available-quotes
```

Trả về danh sách báo giá `approved` + `is_active = true` mà chưa có đơn hàng non-cancelled.

**Response:**

```json
{
  "success": true,
  "data": [{
    "id": 5,
    "code": "QT-20260320-001",
    "og_ticket": { "id": 1, "subject": "Sửa máy lạnh" },
    "total_amount": "920000.00",
    "lines_count": 3
  }]
}
```

> **Logic:** Query quotes WHERE `status = 'approved'` AND `is_active = true` AND NOT EXISTS (order với `quote_id` = quote.id AND `status != 'cancelled'`).

### 4.4 Tạo đơn hàng

```
POST /api/v1/pmc/orders
```

**Body (CreateOrderRequest):**

```json
{
  "quote_id": 5,
  "note": null
}
```

**Validation:**

| Field | Rules |
|-------|-------|
| `quote_id` | required, exists:quotes,id |
| `note` | nullable, string, max:1000 |

**Business logic:**
1. Validate quote `status = approved` AND `is_active = true`.
2. Validate không có đơn hàng non-cancelled cho quote này.
3. Tự sinh `code`: `SO-{YYYYMMDD}-{XXX}` (sequence trong ngày).
4. Copy tất cả QuoteLines → OrderLines (snapshot: name, line_type, reference_id, quantity, unit, unit_price, line_amount).
5. Tính `total_amount` = sum(`line_amount`) tất cả dòng.
6. Set `status = 'draft'`.
7. Cập nhật OgTicket status → `ordered`.

**Response:** `OrderDetailResource` (201)

### 4.5 Cập nhật đơn hàng

```
PUT /api/v1/pmc/orders/{order}
```

**Điều kiện:** Chỉ khi `status = draft`.

**Body (UpdateOrderRequest):**

```json
{
  "note": "Ghi chú cập nhật",
  "lines": [
    {
      "line_type": "material",
      "reference_id": 3,
      "name": "Gas R32 1kg",
      "quantity": 2,
      "unit": "bình",
      "unit_price": 320000
    }
  ]
}
```

**Validation:**

| Field | Rules |
|-------|-------|
| `note` | nullable, string, max:1000 |
| `lines` | required, array, min:1 |
| `lines.*.line_type` | required, in:material,service,adhoc |
| `lines.*.reference_id` | required, integer — validate exists theo line_type |
| `lines.*.name` | required, string, max:255 |
| `lines.*.quantity` | required, integer, min:1 |
| `lines.*.unit` | required, string, max:50 |
| `lines.*.unit_price` | required, numeric, min:0 |

**Business logic:**
1. Check `status = draft`, nếu không → 422.
2. Xóa lines cũ, tạo lines mới.
3. Tính `line_amount` = `unit_price` × `quantity` (mỗi dòng).
4. Recalculate `total_amount`.

### 4.6 Chuyển trạng thái (Transition)

```
POST /api/v1/pmc/orders/{order}/transition
```

**Body (TransitionOrderRequest):**

```json
{
  "status": "confirmed"
}
```

**Validation:**

| Field | Rules |
|-------|-------|
| `status` | required, in: confirmed, in_progress, completed, cancelled |

**State machine** (định nghĩa trong `OrderStatus::allowedTransitions()`):

| From | Allowed targets |
|------|----------------|
| draft | confirmed, cancelled |
| confirmed | in_progress, cancelled |
| in_progress | completed, cancelled |
| completed | (final — không transition) |
| cancelled | (final — không transition) |

**Side effects theo target status:**

| Target | Side effects |
|--------|-------------|
| confirmed | — |
| in_progress | Cập nhật OgTicket status → `in_progress` |
| completed | Cập nhật OgTicket status → `completed` |
| cancelled | Cập nhật OgTicket status → `approved` (quay về trạng thái trước khi tạo đơn, cho phép tạo đơn mới) |

### 4.7 Xóa đơn hàng

```
DELETE /api/v1/pmc/orders/{order}
```

**Điều kiện:** Chỉ khi `status = draft`.
**Side effect:** Cập nhật OgTicket status → `approved` (quay về trạng thái trước khi tạo đơn).

## 5. Business Rules

1. **Tạo từ Quote:** Đơn hàng chỉ tạo từ báo giá đã chấp thuận (`Quote.status = approved`, `is_active = true`).
2. **1 đơn hàng active/quote:** Mỗi Quote chỉ có tối đa 1 đơn hàng non-cancelled tại 1 thời điểm. Enforce bằng partial unique index ở DB + check ở service layer.
3. **Tái tạo sau hủy:** Khi đơn hàng bị cancelled, Quote trở lại khả dụng để tạo đơn mới.
4. **Copy dòng:** Khi tạo đơn, system tự động copy toàn bộ QuoteLines → OrderLines. Không cho user chọn dòng.
5. **State machine:** Định nghĩa trong `OrderStatus::allowedTransitions()`. Chuyển trạng thái qua 1 endpoint duy nhất `POST /transition`.
6. **Edit restriction:** Chỉ sửa khi `status = draft`.
7. **Delete restriction:** Chỉ xóa khi `status = draft`.
8. **Pricing đơn giản:** Không có khuyến mãi. `total_amount` = sum(`unit_price` × `quantity`). Server luôn tính lại — không tin client.
9. **Snapshot giá:** `name`, `unit_price` trên OrderLine là snapshot — không thay đổi theo catalog sau khi tạo.
10. **Audit:** Order implements `Auditable` — Laravel Auditing tự động track mọi thay đổi field.
11. **Liên kết OgTicket:** Tạo đơn → `ordered`. In-progress → `in_progress`. Completed → `completed`. Cancelled/Deleted → `approved`.

## 6. Dependencies

### 6.1 Modules sử dụng (import trực tiếp — cùng PMC)

| Module | Entity | Mục đích |
|--------|--------|----------|
| PMC/Quote | Quote, QuoteLine, QuoteLineType | Báo giá nguồn + copy dòng + reuse enum |
| PMC/OgTicket | OgTicket | Cập nhật status khi transition |
| PMC/Catalog | CatalogItem, CatalogAdhocItem | Reference cho OrderLine (validate exists) |

> **Ghi chú:** Tất cả đều trong cùng top-level module PMC → import trực tiếp, không cần ExternalService.

## 7. Check Delete

| Entity | Cần check | Lý do |
|--------|-----------|-------|
| Order | Có | Chỉ xóa khi draft. Nếu đã confirmed+ → block |
| OrderLine | Không riêng | Cascade delete theo Order |

## 8. Migrations

### 8.1 create_orders_table

```php
Schema::create('orders', function (Blueprint $table) {
    $table->id();
    $table->string('code', 50);
    $table->foreignId('quote_id')->constrained('quotes');
    $table->string('status', 30);
    $table->decimal('total_amount', 15, 2)->default(0);
    $table->text('note')->nullable();
    $table->timestamps();
    $table->softDeletes();

    $table->index('quote_id');
    $table->index('status');
});

// Partial unique indexes (PostgreSQL)
DB::statement('CREATE UNIQUE INDEX orders_code_unique ON orders (code) WHERE deleted_at IS NULL');
DB::statement("CREATE UNIQUE INDEX orders_quote_id_active_unique ON orders (quote_id) WHERE status != 'cancelled' AND deleted_at IS NULL");
```

### 8.2 create_order_lines_table

```php
Schema::create('order_lines', function (Blueprint $table) {
    $table->id();
    $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
    $table->string('line_type', 30);
    $table->unsignedBigInteger('reference_id');
    $table->string('name', 255);
    $table->integer('quantity')->default(1);
    $table->string('unit', 50);
    $table->decimal('unit_price', 15, 2);
    $table->decimal('line_amount', 15, 2);
    $table->timestamps();

    $table->index('order_id');
});
```

> **Audit:** Không cần migration riêng cho history. Laravel Auditing sử dụng bảng `audits` (đã có sẵn từ package).

## 9. Thay đổi trên Quote module

Khi implement Order, cần bổ sung trên Quote model:

```php
// Quote.php — thêm relationship
public function order(): HasOne
{
    return $this->hasOne(Order::class, 'quote_id');
}
```
