# Treasury - Đặc tả kỹ thuật Backend

> Module: `PMC/Treasury` | Ngày tạo: 2026-04-10 | Trạng thái: Draft

## 1. Tổng quan

**Treasury** là submodule quản lý dòng tiền của tenant. Ở phase 1, mỗi tenant có **1 quỹ chính duy nhất** nhưng schema được thiết kế hỗ trợ đa quỹ (phase sau: tài khoản ngân hàng, ví điện tử, chuyển quỹ nội bộ…).

**Nguyên tắc cốt lõi**:

- Treasury chỉ thấy tiền sau khi đã **đối soát OK** (FinancialReconciliation → Reconciled). Mọi PaymentReceipt chưa đối soát = không tồn tại với Treasury.
- Mọi dòng tiền auto (từ reconciliation / commission snapshot) được tạo qua **event listener**, không qua API trực tiếp.
- Mọi dòng tiền manual (nạp/rút thủ công) được tạo qua API.
- Rollback (reconciliation reset / commission un-pay) dùng **soft delete** để giữ audit trail (qua `owen-it/laravel-auditing`).

**Phạm vi phase 1**:
- Thu: nạp tiền thủ công, thu công nợ (đã đối soát)
- Chi: rút tiền thủ công, hoàn tiền thừa cho khách (đã đối soát), chi trả hoa hồng
- Báo cáo: KPI tổng thu/chi/ròng, biểu đồ theo ngày/tuần/tháng, breakdown theo category

**Out of scope phase 1**: hoàn ứng vật tư, multi CashAccount UI, transfer giữa các quỹ, báo cáo P&L chuẩn VAS, export PDF/Excel, phân quyền chi tiết.

## 2. Entities

### 2.1 CashAccount (Tài khoản quỹ)

**Bảng:** `cash_accounts`

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigint` | PK, AI | |
| Mã | `code` | `string(50)` | unique, required | Mã nội bộ (vd: "QUY_CHINH") |
| Tên | `name` | `string(200)` | required | Tên hiển thị (vd: "Quỹ chính") |
| Loại quỹ | `type` | `string(20)` | enum CashAccountType, required | Cash / Bank / EWallet |
| Ngân hàng | `bank_id` | `unsignedBigInteger` | nullable, FK banks | Dùng cho type Bank |
| Số tài khoản | `bank_account_number` | `string(50)` | nullable | |
| Chủ tài khoản | `bank_account_name` | `string(200)` | nullable | |
| Số dư đầu kỳ | `opening_balance` | `decimal(15,2)` | default 0 | Số dư khi mở quỹ |
| Mặc định | `is_default` | `boolean` | default false | Chỉ 1 record có is_default=true (enforced by partial unique index) |
| Hoạt động | `is_active` | `boolean` | default true | |
| Người tạo | `created_by` | `unsignedBigInteger` | nullable | Auditable |
| Người cập nhật | `updated_by` | `unsignedBigInteger` | nullable | Auditable |
| Người xóa | `deleted_by` | `unsignedBigInteger` | nullable | Auditable |
| Ngày tạo | `created_at` | `timestamp` | | |
| Ngày cập nhật | `updated_at` | `timestamp` | | |
| Ngày xóa | `deleted_at` | `timestamp` | nullable | SoftDeletes |

**Indexes**:
- `UNIQUE (code) WHERE deleted_at IS NULL` — partial unique cho soft delete
- `UNIQUE (is_default) WHERE is_default = true AND deleted_at IS NULL` — chỉ 1 quỹ mặc định
- `INDEX (is_active, is_default)` — filter nhanh

**Relationships**:
- `hasMany` CashTransaction
- `belongsTo` Bank (optional)

**Model**: `extends BaseModel implements Auditable`, `use SoftDeletes`, `use \OwenIt\Auditing\Auditable`

**Seeder**: tạo 1 record mặc định khi tenant khởi tạo:
```php
CashAccount::create([
    'code' => 'QUY_CHINH',
    'name' => 'Quỹ chính',
    'type' => CashAccountType::Cash->value,
    'opening_balance' => 0,
    'is_default' => true,
    'is_active' => true,
]);
```

### 2.2 CashTransaction (Giao dịch quỹ)

**Bảng:** `cash_transactions`

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigint` | PK, AI | |
| Mã phiếu | `code` | `string(20)` | unique, required | PT-YYYY-NNNN (Inflow) hoặc PC-YYYY-NNNN (Outflow), counter reset mỗi năm |
| Tài khoản quỹ | `cash_account_id` | `unsignedBigInteger` | FK cash_accounts, required | ON DELETE RESTRICT |
| Hướng | `direction` | `string(10)` | enum CashTransactionDirection, required | Inflow / Outflow |
| Số tiền | `amount` | `decimal(15,2)` | required, > 0 | Luôn dương (chiều thể hiện qua direction) |
| Danh mục | `category` | `string(30)` | enum CashTransactionCategory, required | 5 giá trị |
| Ngày giao dịch | `transaction_date` | `date` | required | Ngày tiền thực tế ra/vào (paid_at hoặc paid_out_at) |
| FK đối soát | `financial_reconciliation_id` | `unsignedBigInteger` | nullable, FK financial_reconciliations | Chỉ có khi category = ReceivableCollection / CustomerRefund. ON DELETE RESTRICT |
| FK snapshot hoa hồng | `commission_snapshot_id` | `unsignedBigInteger` | nullable, FK order_commission_snapshots | Chỉ có khi category = CommissionPayout. ON DELETE RESTRICT |
| FK đơn hàng | `order_id` | `unsignedBigInteger` | nullable, FK orders | Denormalize để filter/report nhanh |
| Ghi chú | `note` | `text` | nullable | Không bắt buộc |
| Người tạo | `created_by_id` | `unsignedBigInteger` | nullable, FK accounts | Người ghi nhận giao dịch |
| Ngày tạo | `created_at` | `timestamp` | | |
| Ngày cập nhật | `updated_at` | `timestamp` | | |
| Ngày xóa | `deleted_at` | `timestamp` | nullable | SoftDeletes |
| Người xóa | `deleted_by_id` | `unsignedBigInteger` | nullable, FK accounts | |
| Lý do xóa | `delete_reason` | `text` | nullable | Required khi manual delete (min 5 ký tự), auto delete dùng message hệ thống |
| Xóa tự động | `auto_deleted` | `boolean` | default false | Phân biệt manual delete (false) vs auto delete (true, do reconciliation reset hoặc commission unpaid) |

**Indexes**:
- `UNIQUE (financial_reconciliation_id) WHERE deleted_at IS NULL AND financial_reconciliation_id IS NOT NULL` — partial unique, 1 reconciliation → tối đa 1 active tx
- `UNIQUE (commission_snapshot_id) WHERE deleted_at IS NULL AND commission_snapshot_id IS NOT NULL` — partial unique, 1 snapshot → tối đa 1 active tx
- `UNIQUE (code)` — mã phiếu duy nhất
- `INDEX (cash_account_id, transaction_date)` — list + filter theo kỳ
- `INDEX (direction, transaction_date)` — KPI tổng thu/chi theo kỳ
- `INDEX (category, transaction_date)` — breakdown theo category
- `INDEX (order_id)` — lookup theo đơn hàng
- `INDEX (auto_deleted, deleted_at)` — filter giao dịch đã xóa

**Relationships**:
- `belongsTo` CashAccount
- `belongsTo` FinancialReconciliation (nullable)
- `belongsTo` OrderCommissionSnapshot (nullable)
- `belongsTo` Order (nullable)
- `belongsTo` Account (createdBy)
- `belongsTo` Account (deletedBy)

**Model**: `extends BaseModel implements Auditable`, `use SoftDeletes`, `use \OwenIt\Auditing\Auditable`

**Helper methods**:
- `isManual(): bool` — category ∈ {ManualTopup, ManualWithdraw}
- `canBeSoftDeletedByUser(): bool` — `$this->isManual() && !$this->trashed()`
- `sourceLabel(): string` — "Đối soát #X" / "Snapshot hoa hồng #Y" / "Thủ công"

## 3. Enums

### 3.1 CashAccountType

| Key | Value | Label (VI) | Mô tả |
|-----|-------|------------|-------|
| Cash | `cash` | Tiền mặt | Két tiền mặt vật lý |
| Bank | `bank` | Ngân hàng | Tài khoản ngân hàng |
| EWallet | `e_wallet` | Ví điện tử | Momo, ZaloPay, VNPay... |

### 3.2 CashTransactionDirection

| Key | Value | Label (VI) | Mô tả |
|-----|-------|------------|-------|
| Inflow | `inflow` | Tiền vào | Làm tăng số dư quỹ |
| Outflow | `outflow` | Tiền ra | Làm giảm số dư quỹ |

### 3.3 CashTransactionCategory

| Key | Value | Label (VI) | Direction | Nguồn | Mô tả |
|-----|-------|------------|-----------|-------|-------|
| ManualTopup | `manual_topup` | Nạp tiền thủ công | Inflow | Manual | Kế toán ghi nhận nạp tiền vào quỹ |
| ManualWithdraw | `manual_withdraw` | Rút tiền thủ công | Outflow | Manual | Kế toán ghi nhận rút tiền khỏi quỹ (chi phí vận hành, rút cá nhân, sửa lệch sổ…) |
| ReceivableCollection | `receivable_collection` | Thu công nợ | Inflow | Reconciliation | Tự động sinh khi reconciliation của PaymentReceipt type=Collection được approve |
| CustomerRefund | `customer_refund` | Hoàn tiền khách | Outflow | Reconciliation | Tự động sinh khi reconciliation của PaymentReceipt type=Refund được approve |
| CommissionPayout | `commission_payout` | Chi hoa hồng | Outflow | CommissionSnapshot | Tự động sinh khi OrderCommissionSnapshot.payout_status chuyển Unpaid → Paid |

**Enum methods**:
- `direction(): CashTransactionDirection` — suy ra direction từ category (constraint: category ↔ direction cố định)
- `isManual(): bool` — true với ManualTopup/ManualWithdraw
- `isAutoSourced(): bool` — true với ReceivableCollection/CustomerRefund/CommissionPayout
- `requiresReconciliation(): bool` — true với ReceivableCollection/CustomerRefund
- `requiresCommissionSnapshot(): bool` — true với CommissionPayout

### 3.4 PermissionSubModule (mở rộng enum hiện có)

Thêm case mới:
| Key | Value | Label (VI) |
|-----|-------|------------|
| Treasury | `treasury` | Quản lý quỹ |

## 4. API Endpoints

### CashAccount

| Action | Method | URL | Request Class |
|--------|--------|-----|---------------|
| List | GET | `/api/pmc/treasury/cash-accounts` | `ListCashAccountRequest` |
| Get default | GET | `/api/pmc/treasury/cash-accounts/default` | — |
| Show | GET | `/api/pmc/treasury/cash-accounts/{id}` | — |

**Ghi chú**: Phase 1 không expose create/update/delete CashAccount qua API (seed cố định). Phase 2 sẽ bổ sung.

### CashTransaction

| Action | Method | URL | Request Class |
|--------|--------|-----|---------------|
| List | GET | `/api/pmc/treasury/transactions` | `ListCashTransactionRequest` |
| Show | GET | `/api/pmc/treasury/transactions/{id}` | — |
| Manual topup | POST | `/api/pmc/treasury/transactions/manual-topup` | `ManualTopupRequest` |
| Manual withdraw | POST | `/api/pmc/treasury/transactions/manual-withdraw` | `ManualWithdrawRequest` |
| Soft delete | DELETE | `/api/pmc/treasury/transactions/{id}` | `DeleteCashTransactionRequest` |

### Báo cáo

| Action | Method | URL | Request Class |
|--------|--------|-----|---------------|
| KPI summary | GET | `/api/pmc/treasury/summary` | `TreasurySummaryRequest` |

**Route registration**: Thêm vào `backend/app/Modules/PMC/routes/api.php` trong group `pmc/treasury`.

## 5. Validation Rules

### 5.1 ManualTopupRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `cash_account_id` | required, integer, exists:cash_accounts,id | Vui lòng chọn tài khoản quỹ. / Tài khoản quỹ không tồn tại. |
| `amount` | required, numeric, min:0.01 | Vui lòng nhập số tiền. / Số tiền phải lớn hơn 0. |
| `transaction_date` | required, date, before_or_equal:today | Vui lòng chọn ngày giao dịch. / Ngày giao dịch không được ở tương lai. |
| `note` | nullable, string, max:1000 | Ghi chú tối đa 1000 ký tự. |

**Business rule bổ sung trong service**: Kiểm tra `cashAccount->is_active === true`, throw BusinessException nếu không.

### 5.2 ManualWithdrawRequest

Giống `ManualTopupRequest`. **KHÔNG** validate `amount <= current_balance` — cho phép âm, UI hiển thị warning trước khi submit.

### 5.3 DeleteCashTransactionRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `reason` | required, string, min:5, max:500 | Vui lòng nhập lý do xóa. / Lý do xóa tối thiểu 5 ký tự. / Lý do xóa tối đa 500 ký tự. |

**Business rule bổ sung trong service**:
- Throw BusinessException nếu `$transaction->category` không phải manual (ManualTopup/ManualWithdraw).
- Throw BusinessException nếu `$transaction->trashed() === true`.

### 5.4 ListCashTransactionRequest

| Field | Rules |
|-------|-------|
| `cash_account_id` | nullable, integer, exists:cash_accounts,id |
| `date_from` | nullable, date |
| `date_to` | nullable, date, after_or_equal:date_from |
| `direction` | nullable, string, in:inflow,outflow |
| `category` | nullable, string, Rule::in(CashTransactionCategory::values()) |
| `order_id` | nullable, integer, exists:orders,id |
| `search` | nullable, string, max:255 |
| `include_deleted` | nullable, string, in:none,manual,auto,all |
| `page`, `per_page` | pagination chuẩn |

### 5.5 TreasurySummaryRequest

| Field | Rules |
|-------|-------|
| `cash_account_id` | nullable, integer, exists:cash_accounts,id (default: default account) |
| `date_from` | nullable, date |
| `date_to` | nullable, date, after_or_equal:date_from |

## 6. Business Rules

### 6.1 Mapping category ↔ direction (bắt buộc)

| Category | Direction |
|---|---|
| ManualTopup | Inflow |
| ManualWithdraw | Outflow |
| ReceivableCollection | Inflow |
| CustomerRefund | Outflow |
| CommissionPayout | Outflow |

**Service layer** phải enforce: khi tạo CashTransaction, direction được derive tự động từ category, không nhận từ client.

### 6.2 Balance calculation

```
current_balance = opening_balance
  + SUM(amount) WHERE direction = Inflow AND deleted_at IS NULL
  - SUM(amount) WHERE direction = Outflow AND deleted_at IS NULL
```

Eloquent SoftDeletes scope tự động exclude `deleted_at IS NOT NULL`, không cần viết WHERE clause.

### 6.3 Rút tiền thủ công — cho phép balance âm

- **KHÔNG** validate balance ở BE.
- FE hiển thị warning trong modal confirm (đọc current_balance từ summary API).
- Rationale: kế toán đôi khi cần rút trước khi thu.

### 6.4 Idempotent

- 1 `FinancialReconciliation.id` → tối đa 1 active CashTransaction (partial UNIQUE index).
- 1 `OrderCommissionSnapshot.id` → tối đa 1 active CashTransaction (partial UNIQUE index).
- Listener phải kiểm tra `exists active tx` trước khi insert (double-check ở application layer, DB index là fallback).
- Nếu UNIQUE constraint bị vi phạm (race condition) → catch `QueryException` với code `23505` (PostgreSQL unique violation) và silently skip.

### 6.5 Delete rules

| Rule | Hành vi |
|---|---|
| Chỉ manual category được soft delete qua API | Guard trong service, throw BusinessException với code `CASH_TRANSACTION_NOT_DELETABLE` |
| Delete reason bắt buộc min 5 ký tự | Validation trong request |
| Auto delete (reconciliation reset / commission unpaid) | Set `auto_deleted = true`, delete_reason = system message, deleted_by_id = current user (kế toán đang thao tác) |
| Không cho phép edit transaction | Không expose PUT endpoint; muốn sửa phải delete + tạo lại |
| Không có restore ở phase 1 | Không expose restore endpoint |

### 6.6 Code generation (PT-YYYY-NNNN / PC-YYYY-NNNN)

- Prefix: `PT` (phiếu thu) cho Inflow, `PC` (phiếu chi) cho Outflow.
- Year: năm của `transaction_date`.
- Counter: tăng dần trong năm + prefix, reset mỗi năm.
- Format: `{prefix}-{year}-{counter:04d}` (vd: `PT-2026-0001`, `PC-2026-0042`).

**Implementation**: dùng `SELECT COUNT(*) + 1` với WHERE theo prefix + year trong transaction, hoặc dedicated `cash_transaction_counters` table (phase 2 nếu cần performance).

### 6.7 Transaction date mapping

| Category | transaction_date source |
|---|---|
| ManualTopup, ManualWithdraw | User nhập (validate before_or_equal:today) |
| ReceivableCollection, CustomerRefund | `payment_receipt.paid_at` (ngày khách trả/tenant refund thực tế) |
| CommissionPayout | `snapshot.paid_out_at` (set khi markPaid) |

### 6.8 Event dispatch (afterCommit)

Tất cả events phải implement `Illuminate\Contracts\Events\ShouldDispatchAfterCommit`:

```php
class FinancialReconciliationApproved implements ShouldDispatchAfterCommit
{
    public function __construct(public FinancialReconciliation $reconciliation) {}
}
```

Lý do: nếu transaction rollback, không được sinh CashTransaction "ma".

### 6.9 Default CashAccount resolution

Mọi listener auto lấy default CashAccount qua `CashAccountRepository::findDefault()`. Nếu không tìm thấy → throw BusinessException (migration/seeder phải đảm bảo có).

## 7. Events & Listeners

### 7.1 Events (namespace: `App\Modules\PMC\Treasury\Events`)

| Event | Payload | Dispatch từ | Interface |
|---|---|---|---|
| `FinancialReconciliationApproved` | `FinancialReconciliation $reconciliation` | `ReconciliationService::reconcile()`, `batchReconcile()` | `ShouldDispatchAfterCommit` |
| `FinancialReconciliationReset` | `FinancialReconciliation $reconciliation` | `ReconciliationService::resetForPaymentReceipt()` (chỉ khi trước đó là Reconciled) | `ShouldDispatchAfterCommit` |
| `CommissionSnapshotPaid` | `OrderCommissionSnapshot $snapshot` | `ClosingPeriodService::updatePayoutStatus()` (Unpaid → Paid) | `ShouldDispatchAfterCommit` |
| `CommissionSnapshotUnpaid` | `OrderCommissionSnapshot $snapshot` | `ClosingPeriodService::updatePayoutStatus()` (Paid → Unpaid) | `ShouldDispatchAfterCommit` |

### 7.2 Listeners (sync, namespace: `App\Modules\PMC\Treasury\Listeners`)

#### CreateCashTransactionFromReconciliation
- **Event**: `FinancialReconciliationApproved`
- **Logic**:
  1. Eager load `reconciliation.paymentReceipt`, `reconciliation.receivable.order`
  2. Check idempotent: query active tx theo `financial_reconciliation_id` → nếu đã có, return
  3. Get default CashAccount
  4. Direction = `payment_receipt.type === Collection ? Inflow : Outflow`
  5. Category = `payment_receipt.type === Collection ? ReceivableCollection : CustomerRefund`
  6. Amount = `payment_receipt.amount`
  7. transaction_date = `payment_receipt.paid_at`
  8. order_id = `reconciliation.receivable.order_id`
  9. Tạo tx qua `TreasuryService::recordFromReconciliation()`
- **Error handling**: catch `QueryException` (unique violation) → silently skip

#### SoftDeleteCashTransactionOnReconciliationReset
- **Event**: `FinancialReconciliationReset`
- **Logic**:
  1. Tìm active tx theo `financial_reconciliation_id`
  2. Nếu không có → return (không panic, có thể chưa được tạo vì approve rồi rollback ngay)
  3. Set: `auto_deleted = true`, `delete_reason = 'Đối soát bị reset do chỉnh sửa dòng tiền'`, `deleted_by_id = auth()->id() ?? $this->getSystemUserId()`
  4. `$tx->save()` → `$tx->delete()`
  5. Owen-it auditing tự động log event `deleted`

#### CreateCashTransactionFromCommission
- **Event**: `CommissionSnapshotPaid`
- **Logic**:
  1. Check idempotent: query active tx theo `commission_snapshot_id`
  2. Get default CashAccount
  3. Direction = Outflow, Category = CommissionPayout
  4. Amount = `snapshot.amount`
  5. transaction_date = `snapshot.paid_out_at`
  6. order_id = `snapshot.order_id` (nếu có)
  7. Tạo tx qua `TreasuryService::recordFromCommissionSnapshot()`

#### SoftDeleteCashTransactionOnCommissionUnpaid
- **Event**: `CommissionSnapshotUnpaid`
- **Logic**:
  1. Tìm active tx theo `commission_snapshot_id`
  2. Nếu không có → return
  3. Set: `auto_deleted = true`, `delete_reason = 'Snapshot hoa hồng chuyển về chưa thanh toán'`, `deleted_by_id = auth()->id()`
  4. `$tx->delete()`

### 7.3 Listener registration

Đăng ký trong `PMCServiceProvider::boot()`:
```php
Event::listen(FinancialReconciliationApproved::class, CreateCashTransactionFromReconciliation::class);
Event::listen(FinancialReconciliationReset::class, SoftDeleteCashTransactionOnReconciliationReset::class);
Event::listen(CommissionSnapshotPaid::class, CreateCashTransactionFromCommission::class);
Event::listen(CommissionSnapshotUnpaid::class, SoftDeleteCashTransactionOnCommissionUnpaid::class);
```

## 8. Refactor code hiện có (BẮT BUỘC trước khi build Treasury)

### 8.1 `ReconciliationService` (file: `backend/app/Modules/PMC/src/Reconciliation/Services/ReconciliationService.php`)

#### `reconcile()` (line 55-75)
Sau khi update status, dispatch event:
```php
$reconciliation->update([
    'status' => ReconciliationStatus::Reconciled->value,
    // ...
]);

event(new FinancialReconciliationApproved($reconciliation->fresh(['paymentReceipt', 'receivable.order'])));

return $this->findById($reconciliationId);
```

#### `batchReconcile()` (line 107-134)
Dispatch event cho từng item được approve thành công:
```php
foreach ($reconciliations as $reconciliation) {
    if ($reconciliation->status === ReconciliationStatus::Pending) {
        $reconciliation->update([...]);
        event(new FinancialReconciliationApproved($reconciliation->fresh(['paymentReceipt', 'receivable.order'])));
        $reconciledCount++;
    } else {
        $skippedCount++;
    }
}
```

#### `resetForPaymentReceipt()` (line 146-158)
Chỉ dispatch khi trước đó là Reconciled (không dispatch nếu từ Rejected vì chưa có tx):
```php
public function resetForPaymentReceipt(PaymentReceipt $paymentReceipt): void
{
    $reconciliation = $paymentReceipt->reconciliation;

    if ($reconciliation && in_array($reconciliation->status, [Reconciled, Rejected])) {
        $wasReconciled = $reconciliation->status === ReconciliationStatus::Reconciled;
        
        $reconciliation->update([
            'status' => ReconciliationStatus::Pending->value,
            // ...
        ]);
        
        if ($wasReconciled) {
            event(new FinancialReconciliationReset($reconciliation->fresh()));
        }
    }
}
```

### 8.2 `ClosingPeriodService::updatePayoutStatus()` (file: `backend/app/Modules/PMC/src/ClosingPeriod/Services/ClosingPeriodService.php`, line ~296)

**Hiện tại**: delegate xuống `ClosingPeriodRepository::updatePayoutStatus()` dùng `$query->update($data)` → bypass Eloquent events.

**Refactor**: chuyển logic lên Service, loop qua từng snapshot:
```php
public function updatePayoutStatus(array $snapshotIds, PayoutStatus $newStatus): int
{
    return $this->executeInTransaction(function () use ($snapshotIds, $newStatus) {
        $snapshots = $this->repository->findByIds($snapshotIds);
        $count = 0;

        foreach ($snapshots as $snapshot) {
            $oldStatus = $snapshot->payout_status;
            
            if ($oldStatus === $newStatus) continue;
            if ($newStatus === PayoutStatus::Unpaid && $snapshot->amount <= 0) continue;

            $snapshot->update([
                'payout_status' => $newStatus->value,
                'paid_out_at' => $newStatus === PayoutStatus::Paid ? now() : null,
            ]);

            if ($oldStatus === PayoutStatus::Unpaid && $newStatus === PayoutStatus::Paid) {
                event(new CommissionSnapshotPaid($snapshot->fresh()));
            } elseif ($oldStatus === PayoutStatus::Paid && $newStatus === PayoutStatus::Unpaid) {
                event(new CommissionSnapshotUnpaid($snapshot->fresh()));
            }
            
            $count++;
        }
        return $count;
    });
}
```

Method cũ ở `ClosingPeriodRepository::updatePayoutStatus()` có thể giữ lại cho internal use hoặc xóa tuỳ tình hình test regression.

## 9. TreasuryService — Methods chính

```php
interface TreasuryServiceInterface
{
    // Manual
    public function recordManualTopup(array $data): CashTransaction;
    public function recordManualWithdraw(array $data): CashTransaction;
    
    // Auto (gọi từ listener)
    public function recordFromReconciliation(FinancialReconciliation $reconciliation): ?CashTransaction;
    public function recordFromCommissionSnapshot(OrderCommissionSnapshot $snapshot): ?CashTransaction;
    public function softDeleteFromReconciliationReset(FinancialReconciliation $reconciliation): void;
    public function softDeleteFromCommissionUnpaid(OrderCommissionSnapshot $snapshot): void;
    
    // Delete (gọi từ controller)
    public function softDeleteManual(int $transactionId, string $reason): void;
    
    // Query
    public function getCurrentBalance(CashAccount $account): float;
    public function getSummary(array $filters): array;
    public function list(array $filters): LengthAwarePaginator;
    public function findById(int $id): CashTransaction;
}
```

### Private helpers
- `generateCode(CashTransactionDirection $direction, Carbon $date): string` — sinh mã PT/PC
- `getDefaultCashAccount(): CashAccount` — gọi repository
- `ensureCategoryMatchesDirection(CashTransactionCategory $cat, CashTransactionDirection $dir): void` — throw nếu không match

## 10. Presenter Output

### CashAccountResource (detail)

```json
{
  "id": 1,
  "code": "QUY_CHINH",
  "name": "Quỹ chính",
  "type": { "value": "cash", "label": "Tiền mặt" },
  "bank_id": null,
  "bank_account_number": null,
  "bank_account_name": null,
  "opening_balance": "0.00",
  "current_balance": "15000000.00",
  "is_default": true,
  "is_active": true
}
```

### CashTransactionListResource

```json
{
  "id": 101,
  "code": "PT-2026-0023",
  "direction": { "value": "inflow", "label": "Tiền vào" },
  "amount": "5000000.00",
  "category": { "value": "receivable_collection", "label": "Thu công nợ" },
  "transaction_date": "2026-04-10",
  "source": {
    "type": "reconciliation",
    "id": 142,
    "order_id": 87,
    "order_code": "DH-2026-0087"
  },
  "note": null,
  "created_by": { "id": 5, "name": "Nguyễn Văn Kế" },
  "is_deleted": false,
  "auto_deleted": false,
  "delete_reason": null,
  "deleted_by": null
}
```

### CashTransactionDetailResource

Extend list resource, thêm:
```json
{
  "reconciliation": {
    "id": 142,
    "status": { "value": "reconciled", "label": "Đã đối soát" },
    "reconciled_at": "2026-04-10T14:30:00Z",
    "payment_receipt": { "id": 78, "amount": "5000000.00", "paid_at": "2026-04-10", "type": { "value": "collection", "label": "Thu tiền" } }
  },
  "commission_snapshot": null,
  "audit_history": [
    {
      "event": "created",
      "old_values": null,
      "new_values": { "amount": "5000000.00", "direction": "inflow", "...": "..." },
      "user": { "id": 5, "name": "Nguyễn Văn Kế" },
      "created_at": "2026-04-10T14:30:00Z"
    }
  ]
}
```

**Audit history** query từ `owen-it/audits` table filter theo `auditable_type = CashTransaction::class AND auditable_id = $id`.

### TreasuryKpiResource

```json
{
  "cash_account_id": 1,
  "date_from": "2026-04-01",
  "date_to": "2026-04-30",
  "current_balance": "15000000.00",
  "total_inflow": "25000000.00",
  "total_outflow": "10000000.00",
  "net_flow": "15000000.00",
  "transaction_count": 42,
  "inflow_by_category": [
    { "category": { "value": "manual_topup", "label": "Nạp tiền thủ công" }, "amount": "5000000.00", "count": 1 },
    { "category": { "value": "receivable_collection", "label": "Thu công nợ" }, "amount": "20000000.00", "count": 15 }
  ],
  "outflow_by_category": [
    { "category": { "value": "manual_withdraw", "label": "Rút tiền thủ công" }, "amount": "2000000.00", "count": 1 },
    { "category": { "value": "customer_refund", "label": "Hoàn tiền khách" }, "amount": "1000000.00", "count": 2 },
    { "category": { "value": "commission_payout", "label": "Chi hoa hồng" }, "amount": "7000000.00", "count": 23 }
  ]
}
```

> Enum fields: `{ "value": "...", "label": "..." }`. Money fields: string decimal. No `created_at`/`updated_at` unless explicitly required.

## 11. Cross-Module Dependencies

| Dependency | Module nguồn | Sử dụng |
|---|---|---|
| `FinancialReconciliation` (Model) | `PMC/Reconciliation` | Listener query trực tiếp (submodule cùng module PMC → không cần ExternalService) |
| `OrderCommissionSnapshot` (Model) | `PMC/ClosingPeriod` | Listener query trực tiếp |
| `PaymentReceipt` (Model) | `PMC/Receivable` | Eager load từ reconciliation |
| `Order` (Model) | `PMC/Order` | Denormalize order_id, eager load cho list resource |
| `Account` (Model) | `PMC/Account` | createdBy, deletedBy |
| `Bank` (Model) | Platform/Catalog | belongsTo cho CashAccount type=Bank |

**Ghi chú quan trọng**: Theo convention của dự án (xem `feedback_external_service_scope.md`), **submodules cùng 1 top-level module (PMC) import model trực tiếp** — KHÔNG dùng ExternalService. ExternalService chỉ dùng giữa các top-level modules (vd: PMC ↔ Platform).

## 12. Migration Preview

### 12.1 `create_cash_accounts_table`

```php
Schema::create('cash_accounts', function (Blueprint $table) {
    $table->id();
    $table->string('code', 50);
    $table->string('name', 200);
    $table->string('type', 20);
    $table->unsignedBigInteger('bank_id')->nullable();
    $table->string('bank_account_number', 50)->nullable();
    $table->string('bank_account_name', 200)->nullable();
    $table->decimal('opening_balance', 15, 2)->default(0);
    $table->boolean('is_default')->default(false);
    $table->boolean('is_active')->default(true);
    $table->unsignedBigInteger('created_by')->nullable();
    $table->unsignedBigInteger('updated_by')->nullable();
    $table->unsignedBigInteger('deleted_by')->nullable();
    $table->timestamps();
    $table->softDeletes();
    
    $table->index(['is_active', 'is_default']);
});

// Partial unique indexes (PostgreSQL raw SQL)
DB::statement('CREATE UNIQUE INDEX cash_accounts_code_unique ON cash_accounts (code) WHERE deleted_at IS NULL');
DB::statement('CREATE UNIQUE INDEX cash_accounts_default_unique ON cash_accounts (is_default) WHERE is_default = true AND deleted_at IS NULL');
```

### 12.2 `create_cash_transactions_table`

```php
Schema::create('cash_transactions', function (Blueprint $table) {
    $table->id();
    $table->string('code', 20)->unique();
    $table->unsignedBigInteger('cash_account_id');
    $table->string('direction', 10);
    $table->decimal('amount', 15, 2);
    $table->string('category', 30);
    $table->date('transaction_date');
    
    $table->unsignedBigInteger('financial_reconciliation_id')->nullable();
    $table->unsignedBigInteger('commission_snapshot_id')->nullable();
    $table->unsignedBigInteger('order_id')->nullable();
    
    $table->text('note')->nullable();
    $table->unsignedBigInteger('created_by_id')->nullable();
    $table->timestamps();
    
    $table->softDeletes();
    $table->unsignedBigInteger('deleted_by_id')->nullable();
    $table->text('delete_reason')->nullable();
    $table->boolean('auto_deleted')->default(false);
    
    // FK constraints với ON DELETE RESTRICT
    $table->foreign('cash_account_id')->references('id')->on('cash_accounts')->restrictOnDelete();
    $table->foreign('financial_reconciliation_id')->references('id')->on('financial_reconciliations')->restrictOnDelete();
    $table->foreign('commission_snapshot_id')->references('id')->on('order_commission_snapshots')->restrictOnDelete();
    $table->foreign('order_id')->references('id')->on('orders')->nullOnDelete();
    
    // Regular indexes
    $table->index(['cash_account_id', 'transaction_date']);
    $table->index(['direction', 'transaction_date']);
    $table->index(['category', 'transaction_date']);
    $table->index('order_id');
    $table->index(['auto_deleted', 'deleted_at']);
});

// Partial unique indexes
DB::statement('CREATE UNIQUE INDEX cash_tx_reconciliation_unique ON cash_transactions (financial_reconciliation_id) WHERE deleted_at IS NULL AND financial_reconciliation_id IS NOT NULL');
DB::statement('CREATE UNIQUE INDEX cash_tx_commission_unique ON cash_transactions (commission_snapshot_id) WHERE deleted_at IS NULL AND commission_snapshot_id IS NOT NULL');
```

### 12.3 Seeder

```php
class CashAccountSeeder extends Seeder
{
    public function run(): void
    {
        if (CashAccount::where('is_default', true)->exists()) return;
        
        CashAccount::create([
            'code' => 'QUY_CHINH',
            'name' => 'Quỹ chính',
            'type' => CashAccountType::Cash->value,
            'opening_balance' => 0,
            'is_default' => true,
            'is_active' => true,
        ]);
    }
}
```

Register trong tenant migration flow.

## 13. Tests cần viết

### 13.1 Feature tests (`tests/Feature/PMC/Treasury/`)

1. `test_manual_topup_creates_inflow_transaction` — POST manual-topup, verify tx có direction=Inflow, category=ManualTopup
2. `test_manual_withdraw_creates_outflow_transaction`
3. `test_manual_withdraw_allows_negative_balance` — opening 0, withdraw 1tr, verify response success, balance = -1tr
4. `test_reconciliation_approved_creates_inflow_for_collection` — setup recon + collection receipt, gọi reconcile, assert tx created
5. `test_reconciliation_approved_creates_outflow_for_refund`
6. `test_reconciliation_reset_soft_deletes_cash_transaction` — reconcile rồi update payment, assert tx.trashed() = true, auto_deleted=true
7. `test_reconciliation_reapproved_creates_new_cash_transaction` — reset rồi reconcile lại, assert có tx mới, tx cũ vẫn trashed
8. `test_commission_snapshot_paid_creates_outflow`
9. `test_commission_snapshot_unpaid_soft_deletes_cash_transaction`
10. `test_manual_transaction_can_be_soft_deleted_with_reason`
11. `test_auto_transaction_cannot_be_manually_deleted` — DELETE trên auto tx, assert 422 + error code
12. `test_delete_requires_reason_min_length` — reason "abc" (3 ký tự), assert 422
13. `test_balance_calculation_excludes_deleted_transactions`
14. `test_idempotent_double_reconcile_does_not_duplicate` — gọi reconcile 2 lần (reset → approve → reset → approve), assert UNIQUE index bảo vệ
15. `test_batch_reconcile_dispatches_event_per_item` — mock listener, batch reconcile N items, assert listener được gọi N lần
16. `test_kpi_summary_filters_by_date_range`
17. `test_code_generation_format_PT_and_PC_yearly_reset` — tạo tx năm 2025, năm 2026, verify counter reset
18. `test_reconciliation_rejected_does_not_create_transaction` — trigger Pending → Rejected, assert không có tx

### 13.2 Unit tests

- `CashTransactionCategoryTest`: enum methods `direction()`, `isManual()`, `isAutoSourced()`
- `TreasuryServiceTest`: `ensureCategoryMatchesDirection()` throw đúng trường hợp
- `CodeGeneratorTest`: format + year reset logic

## 14. Checklist triển khai BE

### Phase 0: Refactor (bắt buộc trước Phase 1)
- [ ] Refactor `ClosingPeriodService::updatePayoutStatus()` từ mass update → loop + event dispatch
- [ ] Regression test cho Commission Summary UI (không bị lỗi)

### Phase 1: Treasury submodule
- [ ] Directory `backend/app/Modules/PMC/src/Treasury/` với cấu trúc chuẩn (Models, Enums, Services, Repositories, Controllers, Requests, Resources, Events, Listeners, Contracts)
- [ ] Migrations: `create_cash_accounts_table`, `create_cash_transactions_table` (với partial unique indexes)
- [ ] Seeder: `CashAccountSeeder` tạo quỹ chính mặc định
- [ ] Enums: `CashAccountType`, `CashTransactionDirection`, `CashTransactionCategory`
- [ ] Models: `CashAccount`, `CashTransaction` (implements Auditable + SoftDeletes)
- [ ] Repositories: `CashAccountRepository`, `CashTransactionRepository`
- [ ] Service: `TreasuryService` + `TreasuryServiceInterface`
- [ ] Code generator helper: `CashTransactionCodeGenerator`
- [ ] Form Requests: `ManualTopupRequest`, `ManualWithdrawRequest`, `DeleteCashTransactionRequest`, `ListCashTransactionRequest`, `TreasurySummaryRequest`
- [ ] Resources: `CashAccountResource`, `CashTransactionListResource`, `CashTransactionDetailResource`, `TreasuryKpiResource`
- [ ] Controllers: `CashAccountController`, `CashTransactionController`, `TreasurySummaryController`
- [ ] Routes trong `PMC/routes/api.php` group `pmc/treasury`
- [ ] Events: 4 event class (implements ShouldDispatchAfterCommit)
- [ ] Listeners: 4 listener class
- [ ] Event registration trong `PMCServiceProvider::boot()`
- [ ] Dispatch events trong: `ReconciliationService::reconcile()`, `batchReconcile()`, `resetForPaymentReceipt()`, `ClosingPeriodService::updatePayoutStatus()`
- [ ] Permission sub-module: thêm `Treasury` vào enum `PermissionSubModule`
- [ ] PSR-4 mappings (composer.json đã có `PMC\` namespace, không cần thêm)
- [ ] `vendor/bin/pint --dirty` format
- [ ] `make format && make lint`

### Phase 1: Tests
- [ ] 18 feature tests như mục 13.1
- [ ] Unit tests như mục 13.2
- [ ] Chạy `make test-filter F=Treasury`

### Phase 1: Documentation
- [ ] Scramble annotations trên Controllers (`@tags`, method descriptions, `@return` array shapes)
- [ ] Chạy `make scramble-export` để generate `backend/api.json`
