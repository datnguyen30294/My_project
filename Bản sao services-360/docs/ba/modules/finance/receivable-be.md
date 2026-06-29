# Module Công nợ phải thu - Đặc tả kỹ thuật Backend

> Module: `PMC/Receivable` | Ngày tạo: 2026-04-06 | Trạng thái: Draft

## 1. Tổng quan

Sub-module **Công nợ phải thu (Receivable)** quản lý sổ công nợ phát sinh từ đơn hàng đã xác nhận. Theo dõi khoản phải thu, ghi nhận thu tiền nhiều đợt, báo cáo aging (tuổi nợ).

**Phạm vi:**
- **Khoản phải thu (Receivable):** Phát sinh khi Order chuyển sang `confirmed`. Theo dõi số tiền phải thu, đã thu, trạng thái.
- **Phiếu thu (PaymentReceipt):** Ghi nhận mỗi lần thu tiền cho một khoản công nợ. Hỗ trợ thu nhiều đợt.

> **Trạng thái tài chính tách biệt với trạng thái vận hành đơn.** Đơn `completed` nhưng chưa thu đủ vẫn là "còn công nợ". Đơn `in_progress` có thể đã thu trước một phần.

**Luồng nghiệp vụ:**
```
Order (confirmed) → Phát sinh khoản phải thu (unpaid)
                    → Thu tiền đợt 1 (partial)
                    → Thu tiền đợt 2... (partial)
                    → Thu đủ (paid)
                    hoặc → Quá hạn (overdue)
                    hoặc → Xóa nợ (written_off)
```

**Cấu trúc module:**

```
app/Modules/PMC/src/Receivable/
├── Controllers/
│   └── ReceivableController.php
├── Models/
│   ├── Receivable.php
│   └── PaymentReceipt.php
├── Services/
│   ├── ReceivableService.php
│   └── Contracts/
│       └── ReceivableServiceInterface.php
├── Repositories/
│   └── ReceivableRepository.php
├── Resources/
│   ├── ReceivableListResource.php
│   ├── ReceivableDetailResource.php
│   └── PaymentReceiptResource.php
├── Requests/
│   ├── ListReceivableRequest.php
│   ├── CreatePaymentReceiptRequest.php
│   └── WriteOffReceivableRequest.php
└── Enums/
    ├── ReceivableStatus.php
    └── PaymentMethod.php
```

## 2. Entities

### 2.1 Receivable (Khoản phải thu)

**Bảng:** `receivables`

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| Đơn hàng | `order_id` | `foreignId` | required, FK → orders, unique | 1 order = 1 receivable |
| Dự án | `project_id` | `foreignId` | required, FK → projects | Denormalize từ OgTicket để filter nhanh |
| Số tiền phải thu | `amount` | `decimal(15,2)` | required | = Order.total_amount tại thời điểm phát sinh |
| Tổng đã thu | `paid_amount` | `decimal(15,2)` | required, default: 0 | Cập nhật khi có phiếu thu |
| Trạng thái | `status` | `string(30)` | required | ReceivableStatus enum |
| Hạn thanh toán | `due_date` | `date` | required | |
| Ngày phát sinh | `issued_at` | `datetime` | required | = ngày Order confirmed |
| created_at | `created_at` | `timestamp` | auto | |
| updated_at | `updated_at` | `timestamp` | auto | |
| deleted_at | `deleted_at` | `timestamp` | nullable, soft delete | |

**Indexes:**
- `receivables_order_id_unique` — partial unique index on `order_id` WHERE `deleted_at IS NULL`
- `receivables_project_id_index` on `project_id`
- `receivables_status_index` on `status`
- `receivables_due_date_index` on `due_date`

**Relationships:**
- `belongsTo` → `Order` (order_id)
- `belongsTo` → `Project` (project_id)
- `hasMany` → `PaymentReceipt` (receivable_id)

> **Truy cập thông tin khách hàng:** Qua chain Order → Quote → OgTicket (`$receivable->order->quote->ogTicket->requester_name`). Không lưu `customer_id` hay `apartment_id` trên Receivable.

> Extends `BaseModel` — entity độc lập, có soft delete.

### 2.2 PaymentReceipt (Phiếu thu)

**Bảng:** `payment_receipts`

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| Khoản phải thu | `receivable_id` | `foreignId` | required, FK → receivables, cascade delete | |
| Số tiền | `amount` | `decimal(15,2)` | required, min: 0.01 | Số tiền thu lần này |
| Phương thức | `payment_method` | `string(30)` | required | PaymentMethod enum |
| Người thu | `collected_by_id` | `unsignedBigInteger` | nullable | FK tới accounts (cùng tenant DB) |
| Ghi chú | `note` | `text` | nullable | |
| Ngày thu | `paid_at` | `datetime` | required | Ngày thu tiền thực tế |
| created_at | `created_at` | `timestamp` | auto | |
| updated_at | `updated_at` | `timestamp` | auto | |

**Indexes:**
- `payment_receipts_receivable_id_index` on `receivable_id`

**Relationships:**
- `belongsTo` → `Receivable` (receivable_id)
- `belongsTo` → `Account` (collected_by_id)

> Extends `Model` trực tiếp — bảng phụ thuộc (detail/line-item), cascade delete theo Receivable.

## 3. Enums

### 3.1 ReceivableStatus

```php
enum ReceivableStatus: string
{
    case Unpaid = 'unpaid';           // Chưa thu — chưa có lần thu nào
    case Partial = 'partial';         // Thu một phần — đã thu nhưng chưa đủ
    case Paid = 'paid';               // Đã thu đủ — thu đủ 100%
    case Overdue = 'overdue';         // Quá hạn — quá due_date và chưa thu đủ
    case WrittenOff = 'written_off';  // Xóa nợ — đã hủy/xóa nợ

    public function label(): string
    {
        return match ($this) {
            self::Unpaid => 'Chưa thu',
            self::Partial => 'Thu một phần',
            self::Paid => 'Đã thu đủ',
            self::Overdue => 'Quá hạn',
            self::WrittenOff => 'Xóa nợ',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Unpaid => 'neutral',
            self::Partial => 'warning',
            self::Paid => 'success',
            self::Overdue => 'error',
            self::WrittenOff => 'neutral',
        };
    }
}
```

### 3.2 PaymentMethod

```php
enum PaymentMethod: string
{
    case Cash = 'cash';           // Tiền mặt
    case Transfer = 'transfer';   // Chuyển khoản
    case Card = 'card';           // Thẻ

    public function label(): string
    {
        return match ($this) {
            self::Cash => 'Tiền mặt',
            self::Transfer => 'Chuyển khoản',
            self::Card => 'Thẻ',
        };
    }
}
```

## 4. API Endpoints

Prefix: `/api/v1/pmc/receivables`

### 4.1 Danh sách công nợ

```
GET /api/v1/pmc/receivables
```

**Query params (ListReceivableRequest):**

| Param | Type | Mô tả |
|-------|------|-------|
| `search` | string | Tìm theo mã đơn hàng, tên khách hàng (qua order → quote → og_ticket) |
| `status` | string | Filter theo ReceivableStatus |
| `project_id` | integer | Filter theo dự án |
| `sort_by` | string | created_at (default), amount, paid_amount, due_date |
| `sort_direction` | string | desc (default), asc |
| `per_page` | integer | 15 (default), max 100 |

**Response:** Paginated `ReceivableListResource`

```json
{
  "success": true,
  "data": [{
    "id": 1,
    "order": { "id": 5, "code": "SO-20260322-001" },
    "og_ticket": {
      "id": 1,
      "subject": "Sửa máy lạnh",
      "requester_name": "Nguyễn Văn A",
      "apartment_name": "A-1201"
    },
    "project": { "id": 1, "name": "Chung cư ABC" },
    "amount": "920000.00",
    "paid_amount": "200000.00",
    "outstanding": "720000.00",
    "status": { "value": "partial", "label": "Thu một phần" },
    "due_date": "2026-04-15",
    "aging_days": 5,
    "issued_at": "2026-03-22T10:00:00.000000Z",
    "created_at": "2026-03-22T10:00:00.000000Z"
  }]
}
```

> **Computed fields trong Resource:**
> - `outstanding` = `amount - paid_amount`
> - `aging_days` = max(0, now - due_date) tính bằng ngày. Chỉ tính khi status != paid, written_off.
> - `og_ticket` lấy qua eager load: `order.quote.ogTicket`

### 4.2 Thống kê tổng quan (Aging summary + KPI)

```
GET /api/v1/pmc/receivables/summary
```

**Query params:** `project_id` (optional — filter theo dự án)

**Response:**

```json
{
  "success": true,
  "data": {
    "kpi": {
      "total_amount": "5000000.00",
      "total_paid": "2000000.00",
      "total_outstanding": "3000000.00",
      "count": 15
    },
    "aging": [
      { "bucket": "0-7", "label": "0–7 ngày", "total": "500000.00", "count": 3 },
      { "bucket": "8-30", "label": "8–30 ngày", "total": "1200000.00", "count": 5 },
      { "bucket": "31-60", "label": "31–60 ngày", "total": "800000.00", "count": 4 },
      { "bucket": "61+", "label": ">60 ngày", "total": "500000.00", "count": 3 }
    ]
  }
}
```

> **Logic:**
> - KPI: Tính trên các khoản active (status != written_off).
> - Aging: Tính trên các khoản outstanding (status = unpaid, partial, overdue). Bucket dựa trên `max(0, now - due_date)`.

### 4.3 Chi tiết công nợ

```
GET /api/v1/pmc/receivables/{receivable}
```

**Response:** `ReceivableDetailResource` (bao gồm payment history)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "order": {
      "id": 5,
      "code": "SO-20260322-001",
      "status": { "value": "completed", "label": "Hoàn thành" }
    },
    "og_ticket": {
      "id": 1,
      "subject": "Sửa máy lạnh",
      "requester_name": "Nguyễn Văn A",
      "requester_phone": "0901234567",
      "apartment_name": "A-1201"
    },
    "project": { "id": 1, "name": "Chung cư ABC" },
    "amount": "920000.00",
    "paid_amount": "200000.00",
    "outstanding": "720000.00",
    "status": { "value": "partial", "label": "Thu một phần" },
    "due_date": "2026-04-15",
    "aging_days": 5,
    "issued_at": "2026-03-22T10:00:00.000000Z",
    "payments": [
      {
        "id": 1,
        "amount": "200000.00",
        "payment_method": { "value": "transfer", "label": "Chuyển khoản" },
        "collected_by": { "id": 12, "name": "Trần Thị B" },
        "note": "Cư dân chuyển khoản đợt 1",
        "paid_at": "2026-03-25T09:00:00.000000Z",
        "created_at": "2026-03-25T09:00:00.000000Z"
      }
    ],
    "created_at": "2026-03-22T10:00:00.000000Z",
    "updated_at": "2026-03-25T09:00:00.000000Z"
  }
}
```

### 4.4 Ghi nhận thu tiền

```
POST /api/v1/pmc/receivables/{receivable}/payments
```

**Body (CreatePaymentReceiptRequest):**

```json
{
  "amount": 200000,
  "payment_method": "transfer",
  "note": "Cư dân chuyển khoản đợt 1",
  "paid_at": "2026-03-25 09:00:00"
}
```

**Validation:**

| Field | Rules | Mô tả |
|-------|-------|-------|
| `amount` | required, numeric, min:0.01 | Không được > outstanding |
| `payment_method` | required, Rule::in(PaymentMethod) | |
| `note` | nullable, string, max:500 | |
| `paid_at` | required, date | Ngày thu thực tế |

**Business logic:**
1. Validate receivable status cho phép thu tiền (unpaid, partial, overdue).
2. Validate `amount <= outstanding` (không thu quá số còn nợ).
3. Tạo PaymentReceipt.
4. Cập nhật `receivable.paid_amount += amount`.
5. Cập nhật status:
   - Nếu `paid_amount >= amount` → `paid`
   - Nếu `paid_amount > 0 && < amount` → `partial`
6. Tất cả trong 1 transaction.

**Response:** `ReceivableDetailResource` (200)

### 4.5 Xóa nợ (Write-off)

```
POST /api/v1/pmc/receivables/{receivable}/write-off
```

**Body (WriteOffReceivableRequest):**

```json
{
  "note": "Đơn hàng đã hủy, xóa công nợ"
}
```

**Validation:**

| Field | Rules |
|-------|-------|
| `note` | nullable, string, max:500 |

**Business logic:**
1. Validate status != paid, written_off.
2. Set status = `written_off`.

**Response:** `ReceivableDetailResource` (200)

## 5. Phát sinh công nợ (Side effect từ Order)

Khi Order chuyển sang `confirmed` (qua endpoint `POST /orders/{order}/transition`), cần **tự động phát sinh khoản phải thu**.

### Cách implement

Thêm logic vào `OrderService::transition()` — khi target status = `confirmed`:

```php
// OrderService::transition()
if ($targetStatus === OrderStatus::Confirmed) {
    $this->receivableService->createFromOrder($order);
}
```

**ReceivableService::createFromOrder(Order $order):**
1. Lấy `project_id` từ `$order->quote->ogTicket->project_id`.
2. Tạo Receivable:
   - `order_id` = $order->id
   - `project_id` = project_id
   - `amount` = $order->total_amount
   - `paid_amount` = 0
   - `status` = unpaid
   - `due_date` = now + 30 ngày (configurable)
   - `issued_at` = now
3. Return Receivable.

### Xử lý khi Order cancelled

Khi Order bị cancelled mà đã có Receivable:
- Nếu `paid_amount = 0` → tự động write-off receivable.
- Nếu `paid_amount > 0` → **không tự động xử lý** — kế toán cần quyết định thủ công (hoàn tiền hay xóa nợ).

## 6. Aging (Tuổi nợ)

### Buckets

| Bucket | Key | Khoảng (ngày) |
|--------|-----|---------------|
| 0–7 ngày | `0-7` | 0 ≤ days ≤ 7 |
| 8–30 ngày | `8-30` | 8 ≤ days ≤ 30 |
| 31–60 ngày | `31-60` | 31 ≤ days ≤ 60 |
| >60 ngày | `61+` | days > 60 |

### Tính tuổi nợ

```
aging_days = max(0, floor((now - due_date) / 1 day))
```

- Nếu chưa đến hạn → 0 (bucket 0–7).
- Chỉ tính cho status: unpaid, partial, overdue.
- Status paid, written_off → không tính aging.

### Cập nhật status overdue

Có thể implement bằng **scheduled command** chạy hàng ngày:

```
php artisan receivables:check-overdue
```

Logic: Tìm tất cả receivables WHERE `status IN (unpaid, partial)` AND `due_date < today` → set status = `overdue`.

## 7. Business Rules

1. **1 order = 1 receivable:** Mỗi đơn hàng chỉ phát sinh 1 khoản công nợ. Enforce bằng partial unique index.
2. **Phát sinh tự động:** Receivable tạo khi Order transition sang `confirmed`. Không có tạo thủ công.
3. **Thu nhiều đợt:** Một Receivable có nhiều PaymentReceipt. `paid_amount` = sum(payment amounts).
4. **Auto status:** Status tự cập nhật khi thu tiền: unpaid → partial → paid.
5. **Overdue check:** Scheduled command cập nhật overdue hàng ngày.
6. **Thu tiền hợp lệ:** Chỉ thu khi status = unpaid | partial | overdue. Không thu quá `outstanding`.
7. **Xóa nợ:** Chỉ write-off khi status != paid, written_off.
8. **Cancel order:** Nếu paid_amount = 0 → auto write-off. Nếu paid_amount > 0 → giữ nguyên, xử lý thủ công.
9. **Tách biệt trạng thái:** Trạng thái tài chính (ReceivableStatus) độc lập với trạng thái vận hành (OrderStatus).
10. **Due date mặc định:** 30 ngày kể từ ngày phát sinh (configurable).
11. **KPI loại bỏ written_off:** Thống kê tổng phải thu/đã thu/còn nợ không tính khoản written_off.

## 8. Dependencies

### 8.1 Modules sử dụng (import trực tiếp — cùng PMC)

| Module | Entity | Mục đích |
|--------|--------|----------|
| PMC/Order | Order | Đơn hàng phát sinh công nợ |
| PMC/Quote | Quote | Traverse lấy OgTicket |
| PMC/OgTicket | OgTicket | Lấy requester_name, requester_phone, apartment_name |
| PMC/Project | Project | Dự án |
| PMC/Account | Account | Người thu tiền (collected_by_id) |

> Tất cả cùng top-level module PMC → import trực tiếp, không cần ExternalService.

### 8.2 Modules phụ thuộc ngược

| Module | Mục đích |
|--------|----------|
| PMC/Order | Gọi ReceivableService khi transition → confirmed / cancelled |

## 9. Check Delete

| Entity | Cần check | Lý do |
|--------|-----------|-------|
| Receivable | Không cho xóa trực tiếp | Chỉ write-off. Không expose DELETE endpoint |
| PaymentReceipt | Không cho xóa | Phiếu thu đã ghi nhận không được xóa — đảm bảo audit trail |
| Order (ảnh hưởng ngược) | Check receivable | Khi cancel Order: nếu paid_amount > 0 → cảnh báo kế toán |

## 10. Migrations

### 10.1 create_receivables_table

```php
Schema::create('receivables', function (Blueprint $table) {
    $table->id();
    $table->foreignId('order_id')->constrained('orders');
    $table->foreignId('project_id')->constrained('projects');
    $table->decimal('amount', 15, 2);
    $table->decimal('paid_amount', 15, 2)->default(0);
    $table->string('status', 30);
    $table->date('due_date');
    $table->timestamp('issued_at');
    $table->timestamps();
    $table->softDeletes();

    $table->index('project_id');
    $table->index('status');
    $table->index('due_date');
});

// Partial unique index (PostgreSQL)
DB::statement('CREATE UNIQUE INDEX receivables_order_id_unique ON receivables (order_id) WHERE deleted_at IS NULL');
```

### 10.2 create_payment_receipts_table

```php
Schema::create('payment_receipts', function (Blueprint $table) {
    $table->id();
    $table->foreignId('receivable_id')->constrained('receivables')->cascadeOnDelete();
    $table->decimal('amount', 15, 2);
    $table->string('payment_method', 30);
    $table->unsignedBigInteger('collected_by_id')->nullable();
    $table->text('note')->nullable();
    $table->timestamp('paid_at');
    $table->timestamps();

    $table->index('receivable_id');

    $table->foreign('collected_by_id')->references('id')->on('accounts')->nullOnDelete();
});
```

## 11. Thay đổi trên Order module

Khi implement Receivable, cần bổ sung trên Order:

### 11.1 Order model — thêm relationship

```php
// Order.php
public function receivable(): HasOne
{
    return $this->hasOne(Receivable::class, 'order_id');
}
```

### 11.2 OrderService::transition() — thêm side effects

```php
// Khi target = confirmed
if ($targetStatus === OrderStatus::Confirmed) {
    $this->receivableService->createFromOrder($order);
}

// Khi target = cancelled
if ($targetStatus === OrderStatus::Cancelled) {
    $this->receivableService->handleOrderCancelled($order);
}
```
