# Kỳ chốt phí & Snapshot hoa hồng - Đặc tả kỹ thuật Backend

> Module: `PMC/ClosingPeriod` | Ngày tạo: 2026-04-06 | Trạng thái: Draft

## 1. Tổng quan

Sub-module **Kỳ chốt phí (ClosingPeriod)** quản lý quyết toán theo kỳ: tạo kỳ → thêm đơn đủ điều kiện → hệ thống tính toán + snapshot kết quả chia hoa hồng → chốt kỳ → khóa sửa đơn.

**Phạm vi:**
- **Kỳ chốt (ClosingPeriod):** Quản lý kỳ quyết toán — tạo, thêm đơn, chốt, mở lại.
- **Đơn trong kỳ (ClosingPeriodOrder):** Pivot liên kết đơn ↔ kỳ, lưu frozen values tại thời điểm thêm.
- **Snapshot hoa hồng (OrderCommissionSnapshot):** Lưu kết quả tính toán chia HH per person per order tại thời điểm thêm vào kỳ.

> **Guard tài chính độc lập với trạng thái vận hành.** Đơn `completed` nếu nằm trong kỳ đã chốt thì vẫn readonly.

**Luồng nghiệp vụ:**
```
Order completed + Receivable paid (đủ điều kiện)
    ↓
Kế toán tạo kỳ chốt (open)
    ↓
Thêm đơn vào kỳ → ENGINE tính HH từ config/override hiện tại
    ↓
Lưu OrderCommissionSnapshot (per person per order)
Lưu ClosingPeriodOrder (frozen totals)
    ↓
Chốt kỳ (closed) → Đơn bị khóa tài chính
    ↓
(Optional) Mở lại → Thêm/bớt đơn, tính lại snapshot
```

**Cấu trúc module:**

```
app/Modules/PMC/src/ClosingPeriod/
├── Controllers/
│   └── ClosingPeriodController.php
├── Models/
│   ├── ClosingPeriod.php
│   ├── ClosingPeriodOrder.php
│   └── OrderCommissionSnapshot.php
├── Services/
│   ├── ClosingPeriodService.php
│   ├── CommissionSnapshotService.php
│   └── Contracts/
│       ├── ClosingPeriodServiceInterface.php
│       └── CommissionSnapshotServiceInterface.php
├── Repositories/
│   └── ClosingPeriodRepository.php
├── Resources/
│   ├── ClosingPeriodListResource.php
│   ├── ClosingPeriodDetailResource.php
│   └── OrderCommissionSnapshotResource.php
├── Requests/
│   ├── CreateClosingPeriodRequest.php
│   ├── ListClosingPeriodRequest.php
│   └── CloseClosingPeriodRequest.php
└── Enums/
    └── ClosingPeriodStatus.php
```

## 2. Entities

### 2.1 ClosingPeriod (Kỳ chốt)

**Bảng:** `closing_periods`

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| Dự án | `project_id` | `foreignId` | nullable, FK → projects | `null` = toàn hệ thống |
| Tên kỳ | `name` | `string(255)` | required | VD: "Tháng 3/2026" |
| Từ ngày | `period_start` | `date` | required | |
| Đến ngày | `period_end` | `date` | required | |
| Trạng thái | `status` | `string(30)` | required, default: 'open' | ClosingPeriodStatus |
| Chốt lúc | `closed_at` | `datetime` | nullable | Thời điểm chốt |
| Người chốt | `closed_by_id` | `unsignedBigInteger` | nullable | FK → accounts |
| Ghi chú | `note` | `text` | nullable | Ghi chú khi chốt/mở lại |
| created_at | `created_at` | `timestamp` | auto | |
| updated_at | `updated_at` | `timestamp` | auto | |
| deleted_at | `deleted_at` | `timestamp` | nullable, soft delete | |

**Indexes:**
- `closing_periods_status_index` on `status`
- `closing_periods_project_id_index` on `project_id`

**Relationships:**
- `belongsTo` → `Project` (project_id, nullable)
- `belongsTo` → `Account` (closed_by_id, nullable)
- `hasMany` → `ClosingPeriodOrder` (closing_period_id)

> Extends `BaseModel` — entity độc lập, có soft delete, có Auditable.

### 2.2 ClosingPeriodOrder (Đơn trong kỳ — Pivot)

**Bảng:** `closing_period_orders`

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| Kỳ chốt | `closing_period_id` | `foreignId` | required, FK → closing_periods, cascade | |
| Đơn hàng | `order_id` | `foreignId` | required, FK → orders | |
| Phải thu (chốt) | `frozen_receivable_amount` | `decimal(15,2)` | required | Snapshot receivable.amount |
| Tổng HH (chốt) | `frozen_commission_total` | `decimal(15,2)` | required | SUM(snapshots.amount) |
| created_at | `created_at` | `timestamp` | auto | |
| updated_at | `updated_at` | `timestamp` | auto | |

**Indexes:**
- `closing_period_orders_unique` — unique on `(closing_period_id, order_id)`
- `closing_period_orders_order_id_unique` — unique on `order_id` (1 đơn = 1 kỳ)

**Relationships:**
- `belongsTo` → `ClosingPeriod` (closing_period_id)
- `belongsTo` → `Order` (order_id)

> Extends `Model` — bảng phụ thuộc, cascade delete theo ClosingPeriod.

### 2.3 OrderCommissionSnapshot (Snapshot kết quả chia HH)

**Bảng:** `order_commission_snapshots`

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| Kỳ chốt | `closing_period_id` | `foreignId` | required, FK → closing_periods, cascade | |
| Đơn hàng | `order_id` | `foreignId` | required, FK → orders | |
| Loại người nhận | `recipient_type` | `string(30)` | required | platform, operating_company, board_of_directors, management, department, staff |
| Tài khoản | `account_id` | `unsignedBigInteger` | nullable | FK → accounts (chỉ cho department/staff) |
| Tên người nhận | `recipient_name` | `string(255)` | required | Snapshot tên tại thời điểm chốt |
| Loại giá trị | `value_type` | `string(20)` | required | percent, fixed, both |
| Phần trăm | `percent` | `decimal(5,2)` | nullable | % rule tại thời điểm snapshot |
| Tiền cứng | `value_fixed` | `decimal(15,2)` | nullable | Tiền cứng rule tại thời điểm snapshot |
| Số tiền HH | `amount` | `decimal(15,2)` | required | Kết quả tính toán cuối cùng |
| Nguồn | `resolved_from` | `string(30)` | required | 'config' hoặc 'override' |
| created_at | `created_at` | `timestamp` | auto | |

**Indexes:**
- `order_commission_snapshots_closing_period_id_index` on `closing_period_id`
- `order_commission_snapshots_order_id_index` on `order_id`

**Relationships:**
- `belongsTo` → `ClosingPeriod` (closing_period_id)
- `belongsTo` → `Order` (order_id)
- `belongsTo` → `Account` (account_id, nullable)

> Extends `Model` — bảng phụ thuộc, cascade delete theo ClosingPeriod. Không cần updated_at (chỉ tạo/xóa, không sửa).

## 3. Enums

### 3.1 ClosingPeriodStatus

```php
enum ClosingPeriodStatus: string
{
    case Open = 'open';       // Đang mở — có thể thêm/bớt đơn
    case Closed = 'closed';   // Đã chốt — đơn bị khóa tài chính

    public function label(): string
    {
        return match ($this) {
            self::Open => 'Đang mở',
            self::Closed => 'Đã chốt',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Open => 'primary',
            self::Closed => 'success',
        };
    }
}
```

## 4. Commission Calculation Engine

### 4.1 Tổng quan

Engine tính toán chia HH **trên backend**, port từ logic FE hiện tại (`useCommissionMindmap.ts`). Được gọi khi thêm đơn vào kỳ chốt.

### 4.2 Thuật toán phân bổ (2-round distribution)

**Input:** Pool (số tiền cần chia), danh sách recipients (sorted by sort_order).

**Round 1 — Fixed Amount Deduction (theo thứ tự ưu tiên):**
```
remaining = pool
for each recipient with valueFixed:
    deduct = min(valueFixed, remaining)
    recipient.fixedAmount = deduct
    remaining -= deduct
    if remaining <= 0: break
```

**Round 2 — Percentage Distribution (trên remaining):**
```
for each recipient with percent:
    recipient.percentAmount = round(remaining × percent / 100)
```

**Tổng mỗi recipient:** `fixedAmount + percentAmount`

### 4.3 3 cấp phân bổ

**Cấp 1 — Party (trên order.total_amount):**
1. Platform: percent + valueFixed từ `project_commission_configs` (hoặc default 5% + 1.000đ)
2. Operating Company: từ `commission_party_rules`
3. Board of Directors: từ `commission_party_rules`
4. Management: từ `commission_party_rules`

**Cấp 2 — Department (trên phần Management nhận được):**
- Từ `commission_dept_rules`, sorted by `sort_order`
- Mỗi dept rule: `value_type`, `percent`, `value_fixed`

**Cấp 3 — Staff (trên phần mỗi Department nhận được):**
- Từ `commission_staff_rules`, sorted by `sort_order`
- Mỗi staff rule: `account_id`, `value_type`, `percent`, `value_fixed`

### 4.4 Override

Nếu đơn có `order_commission_overrides`:
- **Bỏ qua toàn bộ cấp 1/2/3**
- Lấy trực tiếp từ override: `recipient_type`, `account_id`, `amount`
- Platform amount tính riêng: `min(fixed, total) + max(0, total - fixed) × percent / 100`
- `resolved_from = 'override'`

### 4.5 CommissionSnapshotService

```php
interface CommissionSnapshotServiceInterface
{
    /**
     * Tính toán và lưu snapshot HH cho 1 đơn trong kỳ chốt.
     * @return list<OrderCommissionSnapshot>
     */
    public function createSnapshotsForOrder(ClosingPeriod $period, Order $order): array;

    /**
     * Xóa snapshot cũ và tính lại cho 1 đơn.
     */
    public function recalculateForOrder(ClosingPeriod $period, Order $order): array;
}
```

## 5. API Endpoints

Prefix: `/api/v1/pmc/closing-periods`

### 5.1 Danh sách kỳ chốt

```
GET /api/v1/pmc/closing-periods
```

**Query params (ListClosingPeriodRequest):**

| Param | Type | Mô tả |
|-------|------|-------|
| `status` | string | Filter theo ClosingPeriodStatus |
| `project_id` | integer | Filter theo dự án |
| `sort_by` | string | created_at (default), period_start, period_end |
| `sort_direction` | string | desc (default), asc |
| `per_page` | integer | 15 (default), max 100 |

**Response:** Paginated `ClosingPeriodListResource`

```json
{
  "success": true,
  "data": [{
    "id": 1,
    "project": { "id": 1, "name": "Chung cư ABC" },
    "name": "Tháng 3/2026",
    "period_start": "2026-03-01",
    "period_end": "2026-03-31",
    "status": { "value": "open", "label": "Đang mở" },
    "orders_count": 5,
    "total_receivable": "5000000.00",
    "total_commission": "750000.00",
    "closed_at": null,
    "closed_by": null,
    "created_at": "2026-03-01T08:00:00Z"
  }]
}
```

> **Computed fields:** `orders_count`, `total_receivable`, `total_commission` tính từ ClosingPeriodOrder aggregate.

### 5.2 Chi tiết kỳ chốt

```
GET /api/v1/pmc/closing-periods/{id}
```

**Response:** `ClosingPeriodDetailResource` (bao gồm danh sách đơn + snapshot)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "project": { "id": 1, "name": "Chung cư ABC" },
    "name": "Tháng 3/2026",
    "period_start": "2026-03-01",
    "period_end": "2026-03-31",
    "status": { "value": "open", "label": "Đang mở" },
    "closed_at": null,
    "closed_by": null,
    "note": null,
    "orders": [
      {
        "id": 1,
        "order": { "id": 5, "code": "SO-20260322-001" },
        "frozen_receivable_amount": "920000.00",
        "frozen_commission_total": "138000.00",
        "snapshots": [
          {
            "id": 1,
            "recipient_type": "platform",
            "recipient_name": "Platform",
            "account_id": null,
            "value_type": "both",
            "percent": "5.00",
            "value_fixed": "1000.00",
            "amount": "46950.00",
            "resolved_from": "config"
          },
          {
            "id": 2,
            "recipient_type": "staff",
            "recipient_name": "Nguyễn Văn A",
            "account_id": 12,
            "value_type": "percent",
            "percent": "10.00",
            "value_fixed": null,
            "amount": "30000.00",
            "resolved_from": "config"
          }
        ]
      }
    ],
    "created_at": "2026-03-01T08:00:00Z",
    "updated_at": "2026-03-01T08:00:00Z"
  }
}
```

### 5.3 Tạo kỳ chốt

```
POST /api/v1/pmc/closing-periods
```

**Body (CreateClosingPeriodRequest):**

```json
{
  "name": "Tháng 4/2026",
  "period_start": "2026-04-01",
  "period_end": "2026-04-30",
  "project_id": null
}
```

**Validation:**

| Field | Rules |
|-------|-------|
| `name` | required, string, max:255 |
| `period_start` | required, date |
| `period_end` | required, date, after:period_start |
| `project_id` | nullable, integer, exists:projects,id |

**Business rules:**
1. Chỉ cho phép tạo nếu không có kỳ `open` khác (cùng project_id scope).
2. Status mặc định: `open`.

### 5.4 Lấy danh sách đơn đủ điều kiện

```
GET /api/v1/pmc/closing-periods/{id}/eligible-orders
```

**Logic:**
1. Order `status = completed`
2. Receivable `status = paid` (đã thu đủ)
3. Chưa thuộc kỳ chốt nào (`order_id NOT IN closing_period_orders`)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "code": "SO-20260322-001",
      "total_amount": "920000.00",
      "receivable_amount": "920000.00",
      "project": { "id": 1, "name": "Chung cư ABC" }
    }
  ]
}
```

### 5.5 Thêm đơn vào kỳ

```
POST /api/v1/pmc/closing-periods/{id}/add-orders
```

**Body:**

```json
{
  "order_ids": [5, 8, 12]
}
```

**Validation:**

| Field | Rules |
|-------|-------|
| `order_ids` | required, array, min:1 |
| `order_ids.*` | required, integer, exists:orders,id |

**Business logic:**
1. Validate kỳ `status = open`.
2. Validate mỗi order: `status = completed`, receivable `status = paid`, chưa thuộc kỳ nào.
3. Với mỗi order:
   a. Gọi `CommissionSnapshotService::createSnapshotsForOrder()` → tính HH từ config/override hiện tại → lưu `OrderCommissionSnapshot`.
   b. Tạo `ClosingPeriodOrder` với:
      - `frozen_receivable_amount` = `receivable.amount`
      - `frozen_commission_total` = SUM(`snapshots.amount`)
4. Tất cả trong 1 transaction.

**Response:** `ClosingPeriodDetailResource` (200)

### 5.6 Xóa đơn khỏi kỳ

```
DELETE /api/v1/pmc/closing-periods/{id}/orders/{orderId}
```

**Business logic:**
1. Validate kỳ `status = open`.
2. Xóa `ClosingPeriodOrder` + cascade xóa `OrderCommissionSnapshot` liên quan.

**Response:** `ClosingPeriodDetailResource` (200)

### 5.7 Chốt kỳ

```
POST /api/v1/pmc/closing-periods/{id}/close
```

**Body (CloseClosingPeriodRequest):**

```json
{
  "note": "Đã đối soát xong tháng 3"
}
```

**Validation:**

| Field | Rules |
|-------|-------|
| `note` | nullable, string, max:500 |

**Business logic:**
1. Validate `status = open`.
2. Update: `status = closed`, `closed_at = now()`, `closed_by_id = auth()->id()`, `note`.
3. Ghi audit log (Auditable trait).

**Response:** `ClosingPeriodDetailResource` (200)

### 5.8 Mở lại kỳ

```
POST /api/v1/pmc/closing-periods/{id}/reopen
```

**Body:**

```json
{
  "note": "Mở lại để thêm đơn sót"
}
```

**Business logic:**
1. Validate `status = closed`.
2. Validate không có kỳ `open` khác (cùng project_id scope).
3. Update: `status = open`, `closed_at = null`, `closed_by_id = null`, `note`.
4. Ghi audit log (Auditable trait).

**Response:** `ClosingPeriodDetailResource` (200)

### 5.9 Tính lại snapshot cho 1 đơn

```
POST /api/v1/pmc/closing-periods/{id}/orders/{orderId}/recalculate
```

**Business logic:**
1. Validate kỳ `status = open`.
2. Xóa snapshot cũ của đơn trong kỳ này.
3. Tính lại từ config/override hiện tại.
4. Cập nhật `frozen_commission_total` trên `ClosingPeriodOrder`.

**Response:** `ClosingPeriodDetailResource` (200)

## 6. Business Rules

| # | Rule |
|---|------|
| 1 | **Chỉ 1 kỳ mở:** Tại 1 thời điểm chỉ có 1 kỳ `open` (cùng project_id scope). |
| 2 | **Điều kiện thêm đơn:** Order `completed` + Receivable `paid` + chưa thuộc kỳ nào. |
| 3 | **1 đơn = 1 kỳ:** Unique constraint trên `order_id` trong `closing_period_orders`. |
| 4 | **Snapshot tại thời điểm thêm:** HH tính từ config/override hiện tại, lưu cố định. |
| 5 | **Chốt = khóa:** Đơn trong kỳ `closed` bị khóa tài chính (readonly). |
| 6 | **Mở lại = mở khóa:** Đơn tự động mở khóa. Phải ghi audit log. |
| 7 | **Không sửa snapshot:** Sau chốt, snapshot không tự cập nhật. Muốn cập nhật phải mở lại + "Tính lại". |
| 8 | **Xóa đơn khỏi kỳ:** Chỉ khi kỳ `open`. Cascade xóa snapshot. |
| 9 | **Snapshot = kết quả:** Lưu số tiền cuối cùng + rule gốc (%, fixed) để đối soát. Không duplicate toàn bộ cấu hình. |
| 10 | **Financial lock:** Guard `isFinanciallyLocked(orderId)` — check đơn có thuộc kỳ `closed` không. Độc lập với order status. |

## 7. Financial Lock (Guard trên Order)

### 7.1 Logic

```php
// Trên Order model hoặc Service
public function isFinanciallyLocked(): bool
{
    return ClosingPeriodOrder::where('order_id', $this->id)
        ->whereHas('closingPeriod', fn ($q) => $q->where('status', 'closed'))
        ->exists();
}
```

### 7.2 Ảnh hưởng

Khi `isFinanciallyLocked = true`:
- Không cho sửa `commission_overrides` (API trả 422)
- Hiển thị alert trên Order detail: "Đơn đã nằm trong kỳ chốt — không thể điều chỉnh hoa hồng"
- Không ảnh hưởng: thu tiền receivable (vì rule yêu cầu `paid` mới vào kỳ, nên receivable đã xong)

## 8. Dependencies

### 8.1 Modules sử dụng (import trực tiếp — cùng PMC)

| Module | Entity | Mục đích |
|--------|--------|----------|
| PMC/Order | Order | Đơn hàng cần chốt |
| PMC/Receivable | Receivable | Check `status = paid` |
| PMC/Commission | CommissionConfig, PartyRule, DeptRule, StaffRule | Tính toán HH |
| PMC/Order | OrderCommissionOverride | Check override |
| PMC/Project | Project | Dự án |
| PMC/Account | Account | Người nhận HH, người chốt |

### 8.2 Ảnh hưởng ngược

| Module | Mục đích |
|--------|----------|
| PMC/Order | Check `isFinanciallyLocked()` trước khi cho sửa override |

## 9. Check Delete

| Entity | Cần check | Lý do |
|--------|-----------|-------|
| ClosingPeriod | Chỉ xóa khi `open` + chưa có đơn | Kỳ đã chốt không được xóa |
| ClosingPeriodOrder | Xóa khi kỳ `open` | Cascade xóa snapshot |
| OrderCommissionSnapshot | Không expose DELETE | Cascade theo ClosingPeriodOrder hoặc ClosingPeriod |

## 10. Migrations

### 10.1 create_closing_periods_table

```php
Schema::create('closing_periods', function (Blueprint $table) {
    $table->id();
    $table->foreignId('project_id')->nullable()->constrained('projects');
    $table->string('name', 255);
    $table->date('period_start');
    $table->date('period_end');
    $table->string('status', 30)->default('open');
    $table->timestamp('closed_at')->nullable();
    $table->unsignedBigInteger('closed_by_id')->nullable();
    $table->text('note')->nullable();
    $table->timestamps();
    $table->softDeletes();

    $table->index('status');
    $table->index('project_id');
    $table->foreign('closed_by_id')->references('id')->on('accounts')->nullOnDelete();
});
```

### 10.2 create_closing_period_orders_table

```php
Schema::create('closing_period_orders', function (Blueprint $table) {
    $table->id();
    $table->foreignId('closing_period_id')->constrained('closing_periods')->cascadeOnDelete();
    $table->foreignId('order_id')->constrained('orders');
    $table->decimal('frozen_receivable_amount', 15, 2);
    $table->decimal('frozen_commission_total', 15, 2);
    $table->timestamps();

    $table->unique(['closing_period_id', 'order_id']);
    $table->unique('order_id'); // 1 đơn = 1 kỳ
});
```

### 10.3 create_order_commission_snapshots_table

```php
Schema::create('order_commission_snapshots', function (Blueprint $table) {
    $table->id();
    $table->foreignId('closing_period_id')->constrained('closing_periods')->cascadeOnDelete();
    $table->foreignId('order_id')->constrained('orders');
    $table->string('recipient_type', 30);
    $table->unsignedBigInteger('account_id')->nullable();
    $table->string('recipient_name', 255);
    $table->string('value_type', 20);
    $table->decimal('percent', 5, 2)->nullable();
    $table->decimal('value_fixed', 15, 2)->nullable();
    $table->decimal('amount', 15, 2);
    $table->string('resolved_from', 30);
    $table->timestamp('created_at')->useCurrent();

    $table->index('closing_period_id');
    $table->index('order_id');
    $table->foreign('account_id')->references('id')->on('accounts')->nullOnDelete();
});
```

## 11. Thay đổi trên Order module

### 11.1 Order model — thêm method

```php
public function isFinanciallyLocked(): bool
{
    return $this->closingPeriodOrder()
        ->whereHas('closingPeriod', fn ($q) => $q->where('status', 'closed'))
        ->exists();
}

public function closingPeriodOrder(): HasOne
{
    return $this->hasOne(ClosingPeriodOrder::class, 'order_id');
}
```

### 11.2 OrderCommissionOverrideService — thêm guard

```php
// Trước khi save/delete override
if ($order->isFinanciallyLocked()) {
    throw new BusinessException(
        message: 'Đơn hàng đã nằm trong kỳ chốt. Không thể điều chỉnh hoa hồng.',
        errorCode: 'ORDER_FINANCIALLY_LOCKED',
    );
}
```
