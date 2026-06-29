# Nâng cấp Công nợ — Dòng tiền & Trạng thái mới - Đặc tả kỹ thuật Backend

> Module: `PMC/Receivable` (upgrade) | Ngày tạo: 2026-04-07 | Trạng thái: Draft

## 1. Tổng quan

Nâng cấp module Công nợ phải thu để hỗ trợ:
- **Trạng thái Overpaid** — khi khách hàng trả thừa tiền.
- **Trạng thái Completed** — khi đã thu đủ VÀ đối soát xong 100%.
- **Hoàn trả (Refund)** — ghi nhận trả lại tiền thừa cho khách.
- **Đổi tên concept** — "Lịch sử thu tiền" → "Lịch sử dòng tiền" (bao gồm cả thu và trả).

**Luồng nghiệp vụ mới:**
```
Order (confirmed) → Phát sinh công nợ (unpaid)
                    → Thu tiền (partial)
                    → Thu đủ (paid) → Đối soát xong 100% → Hoàn thành (completed)
                    → Thu thừa (overpaid) → Trả lại phần thừa → paid → completed
                    hoặc → Quá hạn (overdue)
                    hoặc → Xóa nợ (written_off)
```

## 2. Thay đổi trên ReceivableStatus Enum

### 2.1 Enum mới (đầy đủ)

```php
enum ReceivableStatus: string
{
    case Unpaid = 'unpaid';           // Chưa thu — chưa có lần thu nào
    case Partial = 'partial';         // Thu một phần — đã thu nhưng chưa đủ
    case Paid = 'paid';               // Đã thu đủ — paid_amount == amount
    case Overpaid = 'overpaid';       // Thu thừa — paid_amount > amount
    case Overdue = 'overdue';         // Quá hạn — quá due_date và chưa thu đủ
    case Completed = 'completed';     // Hoàn thành — thu đủ + đối soát xong 100%
    case WrittenOff = 'written_off';  // Xóa nợ — đã hủy/xóa nợ
}
```

### 2.2 Labels & Colors

| Enum | Value | Label | Color |
|------|-------|-------|-------|
| Unpaid | `unpaid` | Chưa thu | `neutral` |
| Partial | `partial` | Thu một phần | `warning` |
| Paid | `paid` | Đã thu đủ | `success` |
| Overpaid | `overpaid` | Thu thừa | `info` |
| Overdue | `overdue` | Quá hạn | `error` |
| Completed | `completed` | Hoàn thành | `success` |
| WrittenOff | `written_off` | Xóa nợ | `neutral` |

### 2.3 Helper methods cập nhật

```php
/** Statuses cho phép thu tiền (collection). */
public static function payable(): array
{
    return [self::Unpaid, self::Partial, self::Overdue];
}

/** Statuses cho phép hoàn trả (refund). */
public static function refundable(): array
{
    return [self::Overpaid];
}

/** Statuses cho phép xóa nợ. */
public static function writableOff(): array
{
    return [self::Unpaid, self::Partial, self::Overdue];
}

/** Statuses cho phép chuyển completed. */
public static function completable(): array
{
    return [self::Paid];
}
```

### 2.4 State transition matrix

```
unpaid    → partial | paid | overpaid | overdue | written_off
partial   → paid | overpaid | overdue | written_off
paid      → completed
overpaid  → paid (sau khi refund đủ phần thừa) | overpaid (refund một phần)
overdue   → partial | paid | overpaid | written_off
completed → (terminal — không chuyển tiếp)
written_off → (terminal — không chuyển tiếp)
```

## 3. Thay đổi trên PaymentReceipt

### 3.1 Enum mới: PaymentReceiptType

```php
enum PaymentReceiptType: string
{
    case Collection = 'collection';   // Thu tiền — dòng tiền vào
    case Refund = 'refund';           // Hoàn trả — dòng tiền ra

    public function label(): string
    {
        return match ($this) {
            self::Collection => 'Thu tiền',
            self::Refund => 'Hoàn trả',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Collection => 'success',
            self::Refund => 'warning',
        };
    }
}
```

### 3.2 Migration — thêm cột `type`

```php
Schema::table('payment_receipts', function (Blueprint $table) {
    $table->string('type', 20)->default('collection')->after('receivable_id');
});
```

### 3.3 PaymentReceipt model — cập nhật

```php
protected $fillable = [
    'receivable_id',
    'type',        // ← thêm
    'amount',
    'payment_method',
    'collected_by_id',
    'note',
    'paid_at',
];

protected function casts(): array
{
    return [
        'type' => PaymentReceiptType::class,  // ← thêm
        'payment_method' => PaymentMethod::class,
        'amount' => 'decimal:2',
        'paid_at' => 'datetime',
    ];
}
```

### 3.4 PaymentReceiptResource — cập nhật

Thêm `type` field:

```json
{
  "id": 1,
  "type": { "value": "collection", "label": "Thu tiền" },
  "amount": "200000.00",
  "payment_method": { "value": "transfer", "label": "Chuyển khoản" },
  "collected_by": { "id": 12, "name": "Trần Thị B" },
  "note": "Thu tiền đợt 1",
  "paid_at": "2026-03-25T09:00:00Z",
  "created_at": "2026-03-25T09:00:00Z"
}
```

## 4. Logic thu tiền — Cập nhật

### 4.1 recordPayment() — bỏ giới hạn max

**Thay đổi chính:** Cho phép `amount` vượt `outstanding` → status chuyển sang `overpaid`.

```php
public function recordPayment(int $receivableId, array $data): Receivable
{
    // 1. Validate status payable (unpaid, partial, overdue)
    // 2. Tạo PaymentReceipt với type = 'collection'
    // 3. Cập nhật paid_amount += amount
    // 4. Cập nhật status:
    //    - paid_amount > receivable.amount → Overpaid
    //    - paid_amount == receivable.amount → Paid
    //    - paid_amount > 0 → Partial
}
```

**Validation (CreatePaymentReceiptRequest) — thay đổi:**

| Field | Rules cũ | Rules mới |
|-------|----------|-----------|
| `amount` | required, numeric, min:0.01, max:outstanding | required, numeric, min:0.01 (bỏ max) |

> Bỏ validate max vì cho phép thu thừa.

### 4.2 Status calculation logic

```php
private function calculateStatus(float $paidAmount, float $amount, ReceivableStatus $currentStatus): ReceivableStatus
{
    return match (true) {
        $paidAmount > $amount => ReceivableStatus::Overpaid,
        $paidAmount == $amount => ReceivableStatus::Paid,
        $paidAmount > 0 && $currentStatus === ReceivableStatus::Overdue => ReceivableStatus::Overdue,
        $paidAmount > 0 => ReceivableStatus::Partial,
        default => ReceivableStatus::Unpaid,
    };
}
```

> Dùng chung cho cả `recordPayment()`, `updatePayment()`, và `recordRefund()`.

## 5. Logic hoàn trả (Refund) — MỚI

### 5.1 API Endpoint

```
POST /api/v1/pmc/receivables/{receivable}/refund
```

### 5.2 Request (CreateRefundRequest)

| Field | Rules | Mô tả |
|-------|-------|-------|
| `amount` | required, numeric, min:0.01 | Không được > overpaid_amount |
| `payment_method` | required, Rule::in(PaymentMethod) | Phương thức hoàn trả |
| `note` | nullable, string, max:500 | |
| `paid_at` | required, date | Ngày hoàn trả thực tế |

### 5.3 Business logic

```php
public function recordRefund(int $receivableId, array $data): Receivable
{
    // 1. Validate status = overpaid
    // 2. Tính overpaid_amount = paid_amount - amount
    // 3. Validate refund_amount <= overpaid_amount
    // 4. Tạo PaymentReceipt với type = 'refund'
    // 5. Cập nhật paid_amount -= refund_amount
    // 6. Cập nhật status:
    //    - paid_amount == amount → Paid
    //    - paid_amount > amount → Overpaid (hoàn trả một phần)
}
```

### 5.4 Response

`ReceivableDetailResource` (200) — cùng format chi tiết.

## 6. Logic chuyển Completed — MỚI

### 6.1 API Endpoint

```
POST /api/v1/pmc/receivables/{receivable}/complete
```

### 6.2 Request

Không cần body (validation tự động).

### 6.3 Business logic

```php
public function markCompleted(int $receivableId): Receivable
{
    $receivable = $this->findById($receivableId);

    // 1. Validate status = paid
    if ($receivable->status !== ReceivableStatus::Paid) {
        throw BusinessException('Chỉ có thể hoàn thành khi đã thu đủ.');
    }

    // 2. Validate tất cả payment_receipts đều đã đối soát
    $totalPayments = $receivable->payments()->count();
    $reconciledCount = $receivable->reconciliations()
        ->where('status', ReconciliationStatus::Reconciled->value)
        ->count();

    if ($reconciledCount < $totalPayments) {
        $pending = $totalPayments - $reconciledCount;
        throw BusinessException("Còn {$pending} dòng tiền chưa đối soát.");
    }

    // 3. Chuyển status → completed
    $receivable->update(['status' => ReceivableStatus::Completed->value]);

    return $this->findById($receivableId);
}
```

### 6.4 Response

`ReceivableDetailResource` (200)

## 7. Cập nhật trên Receivable Model

### 7.1 Thêm relationships

```php
/**
 * Các bản ghi đối soát tài chính.
 */
public function reconciliations(): HasMany
{
    return $this->hasMany(FinancialReconciliation::class, 'receivable_id');
}
```

### 7.2 Cập nhật computed attributes

```php
/**
 * Số tiền thu thừa (chỉ khi overpaid).
 */
public function getOverpaidAmountAttribute(): string
{
    $diff = (float) $this->paid_amount - (float) $this->amount;
    return number_format(max(0, $diff), 2, '.', '');
}
```

### 7.3 Cập nhật scopes

```php
public function scopeActive(Builder $query): Builder
{
    return $query->whereNotIn('status', [
        ReceivableStatus::WrittenOff->value,
        ReceivableStatus::Completed->value,
    ]);
}
```

## 8. Cập nhật trên ReceivableDetailResource

Thêm fields mới:

```json
{
  "id": 1,
  "overpaid_amount": "50000.00",
  "can_collect": true,
  "can_refund": false,
  "can_complete": false,
  "reconciliation_progress": {
    "total": 3,
    "reconciled": 2,
    "pending": 1
  },
  "payments": [
    {
      "id": 1,
      "type": { "value": "collection", "label": "Thu tiền" },
      "amount": "200000.00",
      "reconciliation_status": { "value": "reconciled", "label": "Đã đối soát" }
    }
  ]
}
```

| Field mới | Type | Mô tả |
|-----------|------|-------|
| `overpaid_amount` | string | Số tiền thừa = max(0, paid_amount - amount) |
| `can_collect` | boolean | Status in payable() |
| `can_refund` | boolean | Status in refundable() |
| `can_complete` | boolean | Status = paid AND all reconciled |
| `reconciliation_progress` | object | Tiến độ đối soát |
| `payments[].type` | enum object | collection / refund |
| `payments[].reconciliation_status` | enum object | pending / reconciled (từ hasOne reconciliation) |

## 9. Cập nhật trên ReceivableController

Thêm routes:

```php
// routes — thêm
Route::post('receivables/{receivable}/refund', [ReceivableController::class, 'recordRefund']);
Route::post('receivables/{receivable}/complete', [ReceivableController::class, 'markCompleted']);
```

Middleware: `permission:receivables.update`

## 10. Cập nhật Summary & KPI

### 10.1 KPI

- `total_outstanding` — không tính `completed` (giống `written_off`).
- Thêm `total_overpaid` — tổng số tiền thừa chưa hoàn trả.

### 10.2 Aging

- Aging chỉ tính cho status: `unpaid`, `partial`, `overdue`.
- `overpaid`, `paid`, `completed`, `written_off` → không tính aging.

## 11. Ảnh hưởng lên ClosingPeriod

### 11.1 Điều kiện thêm đơn vào kỳ chốt (CẬP NHẬT)

**Cũ:** Order `completed` + Receivable `paid`
**Mới:** Order `completed` + Receivable `completed`

> Receivable phải đã thu đủ VÀ đã đối soát xong 100% mới đủ điều kiện vào kỳ chốt.

### 11.2 Cập nhật ClosingPeriodService

```php
// eligible-orders query — thay đổi
->whereHas('receivable', fn ($q) => $q->where('status', ReceivableStatus::Completed->value))
```

## 12. Migration mới

### 12.1 add_type_to_payment_receipts

```php
public function up(): void
{
    Schema::table('payment_receipts', function (Blueprint $table) {
        $table->string('type', 20)->default('collection')->after('receivable_id');
    });
}

public function down(): void
{
    Schema::table('payment_receipts', function (Blueprint $table) {
        $table->dropColumn('type');
    });
}
```

## 13. Business Rules (cập nhật & bổ sung)

| # | Rule |
|---|------|
| 1 | **Thu tiền không giới hạn max:** Cho phép `amount > outstanding`. Status tự chuyển `overpaid`. |
| 2 | **Refund chỉ khi overpaid:** Chỉ cho phép hoàn trả khi status = `overpaid`. Refund amount <= overpaid amount. |
| 3 | **Completed = thu đủ + đối soát 100%:** Cả hai điều kiện phải thỏa mãn. |
| 4 | **Mỗi payment receipt tự sinh reconciliation:** Khi tạo PaymentReceipt, tự động tạo FinancialReconciliation (pending). |
| 5 | **Đối soát xong mới vào kỳ chốt:** ClosingPeriod yêu cầu Receivable `completed` (thay vì `paid`). |
| 6 | **Refund cũng sinh reconciliation:** Cả collection và refund đều cần đối soát. |
| 7 | **Completed là terminal:** Không cho phép thao tác gì thêm trên receivable `completed`. |
| 8 | **Lịch sử dòng tiền:** Đổi tên concept — bao gồm cả thu (collection) và trả (refund). |

## 14. Tổng hợp files cần sửa

| File | Thay đổi |
|------|----------|
| `Enums/ReceivableStatus.php` | Thêm `Overpaid`, `Completed`. Cập nhật helpers. |
| `Enums/PaymentReceiptType.php` | **Tạo mới** |
| `Models/PaymentReceipt.php` | Thêm `type` fillable + cast |
| `Models/Receivable.php` | Thêm `reconciliations()` relationship, `overpaid_amount` attribute |
| `Services/ReceivableService.php` | Thêm `recordRefund()`, `markCompleted()`. Sửa `recordPayment()` bỏ max. Refactor status calc. |
| `Contracts/ReceivableServiceInterface.php` | Thêm method signatures |
| `Controllers/ReceivableController.php` | Thêm `recordRefund()`, `markCompleted()` actions |
| `Requests/CreatePaymentReceiptRequest.php` | Bỏ max validation |
| `Requests/CreateRefundRequest.php` | **Tạo mới** |
| `Resources/ReceivableDetailResource.php` | Thêm computed fields |
| `Resources/ReceivableListResource.php` | Thêm overpaid_amount |
| `Resources/PaymentReceiptResource.php` | Thêm type, reconciliation_status |
| `Repositories/ReceivableRepository.php` | Cập nhật summary queries |
| Migration | **Tạo mới** — add_type_to_payment_receipts |
| `ReceivableTest.php` | Thêm tests cho overpaid, refund, complete |
| `ClosingPeriodService.php` | Cập nhật eligible-orders: `paid` → `completed` |
