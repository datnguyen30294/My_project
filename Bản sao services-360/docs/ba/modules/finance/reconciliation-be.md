# Module Đối soát tài chính - Đặc tả kỹ thuật Backend

> Module: `PMC/Reconciliation` | Ngày tạo: 2026-04-07 | Trạng thái: Draft

## 1. Tổng quan

Sub-module **Đối soát tài chính (Financial Reconciliation)** quản lý việc xác nhận, đối chiếu các dòng tiền (thu tiền / hoàn trả) đã ghi nhận trên hệ thống với thực tế tài chính.

**Phạm vi:**
- Mỗi dòng tiền (PaymentReceipt) tự động sinh 1 bản ghi đối soát (FinancialReconciliation).
- Kế toán xác nhận đối soát từng dòng tiền.
- Receivable chỉ được chuyển `completed` khi tất cả dòng tiền đã đối soát xong.

**Luồng nghiệp vụ:**
```
PaymentReceipt created (collection/refund)
    → Tự sinh FinancialReconciliation (pending)
    → Kế toán review → Xác nhận đối soát (reconciled)
    → Khi tất cả reconciliations của 1 Receivable = reconciled
       + paid_amount == amount
       → Cho phép chuyển Receivable → completed
```

**Cấu trúc module:**

```
app/Modules/PMC/src/Reconciliation/
├── Controllers/
│   └── ReconciliationController.php
├── Models/
│   └── FinancialReconciliation.php
├── Services/
│   ├── ReconciliationService.php
│   └── Contracts/
│       └── ReconciliationServiceInterface.php
├── Repositories/
│   └── ReconciliationRepository.php
├── Resources/
│   ├── ReconciliationListResource.php
│   └── ReconciliationDetailResource.php
├── Requests/
│   ├── ListReconciliationRequest.php
│   └── ReconcileRequest.php
└── Enums/
    └── ReconciliationStatus.php
```

## 2. Entities

### 2.1 FinancialReconciliation (Bản ghi đối soát)

**Bảng:** `financial_reconciliations`

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| Công nợ | `receivable_id` | `foreignId` | required, FK → receivables | Công nợ liên quan |
| Dòng tiền | `payment_receipt_id` | `foreignId` | required, FK → payment_receipts, UNIQUE | 1:1 với PaymentReceipt |
| Trạng thái | `status` | `string(20)` | required, default: 'pending' | ReconciliationStatus |
| Ngày giờ đối soát | `reconciled_at` | `datetime` | nullable | Set khi xác nhận đối soát |
| Người đối soát | `reconciled_by_id` | `unsignedBigInteger` | nullable | FK → accounts |
| Ghi chú | `note` | `text` | nullable | Ghi chú kế toán |
| created_at | `created_at` | `timestamp` | auto | |
| updated_at | `updated_at` | `timestamp` | auto | |

**Indexes:**
- `financial_reconciliations_receivable_id_index` on `receivable_id`
- `financial_reconciliations_payment_receipt_id_unique` — UNIQUE on `payment_receipt_id`
- `financial_reconciliations_status_index` on `status`

**Relationships:**
- `belongsTo` → `Receivable` (receivable_id)
- `belongsTo` → `PaymentReceipt` (payment_receipt_id)
- `belongsTo` → `Account` as `reconciledBy` (reconciled_by_id)

> Extends `Model` trực tiếp — bảng phụ thuộc, liên kết với Receivable và PaymentReceipt. Không cần soft delete.

## 3. Enums

### 3.1 ReconciliationStatus

```php
enum ReconciliationStatus: string
{
    case Pending = 'pending';         // Chờ đối soát
    case Reconciled = 'reconciled';   // Đã đối soát

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Chờ đối soát',
            self::Reconciled => 'Đã đối soát',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Pending => 'warning',
            self::Reconciled => 'success',
        };
    }
}
```

## 4. API Endpoints

Prefix: `/api/v1/pmc/reconciliations`

### 4.1 Danh sách đối soát

```
GET /api/v1/pmc/reconciliations
```

**Query params (ListReconciliationRequest):**

| Param | Type | Mô tả |
|-------|------|-------|
| `search` | string | Tìm theo mã đơn hàng, tên khách hàng (qua receivable → order → quote → og_ticket) |
| `status` | string | Filter theo ReconciliationStatus (pending / reconciled) |
| `receivable_id` | integer | Filter theo công nợ cụ thể |
| `project_id` | integer | Filter theo dự án (qua receivable.project_id) |
| `type` | string | Filter theo loại dòng tiền (collection / refund) |
| `date_from` | date | Dòng tiền từ ngày (payment_receipt.paid_at) |
| `date_to` | date | Dòng tiền đến ngày |
| `sort_by` | string | created_at (default), paid_at, amount |
| `sort_direction` | string | desc (default), asc |
| `per_page` | integer | 15 (default), max 100 |

**Response:** Paginated `ReconciliationListResource`

```json
{
  "success": true,
  "data": [{
    "id": 1,
    "receivable": {
      "id": 5,
      "order_code": "SO-20260322-001",
      "requester_name": "Nguyễn Văn A",
      "apartment_name": "A-1201",
      "amount": "920000.00",
      "paid_amount": "970000.00",
      "status": { "value": "overpaid", "label": "Thu thừa" }
    },
    "project": { "id": 1, "name": "Chung cư ABC" },
    "payment_receipt": {
      "id": 10,
      "type": { "value": "collection", "label": "Thu tiền" },
      "amount": "500000.00",
      "payment_method": { "value": "transfer", "label": "Chuyển khoản" },
      "collected_by": { "id": 12, "name": "Trần Thị B" },
      "paid_at": "2026-03-25T09:00:00Z"
    },
    "status": { "value": "pending", "label": "Chờ đối soát" },
    "reconciled_at": null,
    "reconciled_by": null,
    "note": null,
    "created_at": "2026-03-25T09:00:05Z"
  }]
}
```

### 4.2 Chi tiết đối soát

```
GET /api/v1/pmc/reconciliations/{reconciliation}
```

**Response:** `ReconciliationDetailResource`

```json
{
  "success": true,
  "data": {
    "id": 1,
    "receivable": {
      "id": 5,
      "order": { "id": 10, "code": "SO-20260322-001" },
      "og_ticket": {
        "id": 1,
        "subject": "Sửa máy lạnh",
        "requester_name": "Nguyễn Văn A",
        "requester_phone": "0901234567",
        "apartment_name": "A-1201"
      },
      "project": { "id": 1, "name": "Chung cư ABC" },
      "amount": "920000.00",
      "paid_amount": "920000.00",
      "status": { "value": "paid", "label": "Đã thu đủ" }
    },
    "payment_receipt": {
      "id": 10,
      "type": { "value": "collection", "label": "Thu tiền" },
      "amount": "500000.00",
      "payment_method": { "value": "transfer", "label": "Chuyển khoản" },
      "collected_by": { "id": 12, "name": "Trần Thị B" },
      "note": "Chuyển khoản đợt 1",
      "paid_at": "2026-03-25T09:00:00Z"
    },
    "status": { "value": "pending", "label": "Chờ đối soát" },
    "reconciled_at": null,
    "reconciled_by": null,
    "note": null,
    "created_at": "2026-03-25T09:00:05Z",
    "updated_at": "2026-03-25T09:00:05Z"
  }
}
```

### 4.3 Thống kê đối soát

```
GET /api/v1/pmc/reconciliations/summary
```

**Query params:** `project_id` (optional)

**Response:**

```json
{
  "success": true,
  "data": {
    "total_count": 25,
    "pending_count": 8,
    "reconciled_count": 17,
    "pending_amount": "2500000.00",
    "reconciled_amount": "8500000.00"
  }
}
```

### 4.4 Xác nhận đối soát

```
POST /api/v1/pmc/reconciliations/{reconciliation}/reconcile
```

**Body (ReconcileRequest):**

```json
{
  "note": "Đã xác nhận với sao kê ngân hàng"
}
```

**Validation:**

| Field | Rules |
|-------|-------|
| `note` | nullable, string, max:500 |

**Business logic:**

```php
public function reconcile(int $reconciliationId, array $data): FinancialReconciliation
{
    $reconciliation = $this->findById($reconciliationId);

    // 1. Validate status = pending
    if ($reconciliation->status !== ReconciliationStatus::Pending) {
        throw BusinessException('Bản ghi đã được đối soát.');
    }

    // 2. Update status
    $reconciliation->update([
        'status' => ReconciliationStatus::Reconciled->value,
        'reconciled_at' => now(),
        'reconciled_by_id' => auth()->id(),
        'note' => $data['note'] ?? null,
    ]);

    return $this->findById($reconciliationId);
}
```

**Response:** `ReconciliationDetailResource` (200)

### 4.5 Đối soát hàng loạt

```
POST /api/v1/pmc/reconciliations/batch-reconcile
```

**Body:**

```json
{
  "ids": [1, 2, 3],
  "note": "Đối soát hàng loạt theo sao kê tháng 3"
}
```

**Validation:**

| Field | Rules |
|-------|-------|
| `ids` | required, array, min:1 |
| `ids.*` | required, integer, exists:financial_reconciliations,id |
| `note` | nullable, string, max:500 |

**Business logic:**
1. Lọc chỉ các bản ghi `pending`.
2. Batch update: `status = reconciled`, `reconciled_at = now()`, `reconciled_by_id = auth()->id()`.
3. Return số lượng đã đối soát.

**Response:**

```json
{
  "success": true,
  "data": {
    "reconciled_count": 3,
    "skipped_count": 0
  }
}
```

## 5. Tự động sinh Reconciliation

### 5.1 Khi tạo PaymentReceipt

Trong `ReceivableService::recordPayment()` và `ReceivableService::recordRefund()`, sau khi tạo PaymentReceipt:

```php
// Tự động tạo FinancialReconciliation
$this->reconciliationService->createFromPaymentReceipt($receivable, $paymentReceipt);
```

### 5.2 ReconciliationService::createFromPaymentReceipt()

```php
public function createFromPaymentReceipt(Receivable $receivable, PaymentReceipt $paymentReceipt): FinancialReconciliation
{
    return $this->repository->create([
        'receivable_id' => $receivable->id,
        'payment_receipt_id' => $paymentReceipt->id,
        'status' => ReconciliationStatus::Pending->value,
    ]);
}
```

> **Không cần transaction riêng** — nằm trong transaction của `recordPayment()` / `recordRefund()`.

## 6. Business Rules

| # | Rule |
|---|------|
| 1 | **1:1 với PaymentReceipt:** Mỗi dòng tiền có đúng 1 bản ghi đối soát. Enforce bằng UNIQUE index. |
| 2 | **Tự động sinh:** Reconciliation tạo tự động khi PaymentReceipt được tạo. Không có tạo thủ công. |
| 3 | **Chỉ pending → reconciled:** Không cho phép revert (hủy đối soát). Nếu cần sửa → cần mở rộng thêm. |
| 4 | **Đối soát xong = mở khóa completed:** Receivable chỉ chuyển `completed` khi ALL reconciliations = reconciled + paid_amount == amount. |
| 5 | **Cả collection và refund đều cần đối soát:** Không phân biệt — mọi dòng tiền cần xác nhận. |
| 6 | **Ngày giờ đối soát:** `reconciled_at` ghi nhận thời điểm kế toán xác nhận, không phải ngày giao dịch. |
| 7 | **Batch reconcile:** Cho phép đối soát hàng loạt để tăng hiệu suất. |
| 8 | **Xóa PaymentReceipt:** Nếu PaymentReceipt bị sửa (updatePayment), reconciliation liên quan reset về pending. |

## 7. Dependencies

### 7.1 Modules sử dụng (import trực tiếp — cùng PMC)

| Module | Entity | Mục đích |
|--------|--------|----------|
| PMC/Receivable | Receivable, PaymentReceipt | Liên kết công nợ + dòng tiền |
| PMC/Account | Account | Người đối soát (reconciled_by_id) |
| PMC/Order | Order | Hiển thị mã đơn (qua Receivable) |
| PMC/Project | Project | Filter theo dự án (qua Receivable) |
| PMC/OgTicket | OgTicket | Hiển thị thông tin khách (qua chain) |

### 7.2 Modules phụ thuộc ngược

| Module | Mục đích |
|--------|----------|
| PMC/Receivable | Check reconciliation progress trước khi markCompleted(). Gọi createFromPaymentReceipt() khi tạo payment. |

## 8. Check Delete

| Entity | Cần check | Lý do |
|--------|-----------|-------|
| FinancialReconciliation | Không cho xóa | Bản ghi tài chính — không được xóa để đảm bảo audit trail |

## 9. Khi PaymentReceipt bị cập nhật

Khi `ReceivableService::updatePayment()` sửa số tiền / phương thức:

```php
// Reset reconciliation status về pending
$reconciliation = $paymentReceipt->reconciliation;
if ($reconciliation && $reconciliation->status === ReconciliationStatus::Reconciled) {
    $reconciliation->update([
        'status' => ReconciliationStatus::Pending->value,
        'reconciled_at' => null,
        'reconciled_by_id' => null,
        'note' => 'Đối soát bị reset do chỉnh sửa dòng tiền.',
    ]);
}
```

> Nếu Receivable đang `completed` và payment bị sửa → revert status về `paid` (vì mất điều kiện đối soát 100%).

## 10. Migration

### 10.1 create_financial_reconciliations_table

```php
public function up(): void
{
    Schema::create('financial_reconciliations', function (Blueprint $table) {
        $table->id();
        $table->foreignId('receivable_id')->constrained('receivables');
        $table->foreignId('payment_receipt_id')->constrained('payment_receipts');
        $table->string('status', 20)->default('pending');
        $table->timestamp('reconciled_at')->nullable();
        $table->unsignedBigInteger('reconciled_by_id')->nullable();
        $table->text('note')->nullable();
        $table->timestamps();

        $table->index('receivable_id');
        $table->unique('payment_receipt_id');
        $table->index('status');

        $table->foreign('reconciled_by_id')->references('id')->on('accounts')->nullOnDelete();
    });
}

public function down(): void
{
    Schema::dropIfExists('financial_reconciliations');
}
```

## 11. ServiceProvider

Đăng ký trong PMC module ServiceProvider:

```php
$this->app->bind(
    ReconciliationServiceInterface::class,
    ReconciliationService::class
);
```

## 12. Permissions

| Permission | Mô tả |
|------------|-------|
| `reconciliations.view` | Xem danh sách / chi tiết đối soát |
| `reconciliations.update` | Xác nhận đối soát (reconcile) |

## 13. Frontend Routes (tham khảo)

| Route | Mô tả |
|-------|-------|
| `/pmc/ke-toan-tai-chinh/doi-soat-tai-chinh` | Danh sách đối soát |
| `/pmc/ke-toan-tai-chinh/doi-soat-tai-chinh/[id]` | Chi tiết đối soát |

> Chi tiết FE spec sẽ viết riêng.
