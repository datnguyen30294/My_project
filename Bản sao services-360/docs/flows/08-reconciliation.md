# 08 — Đối soát tài chính

## Dual-source reconciliation

Hệ thống cho phép đối soát từ **2 nguồn**:
1. **Từ PaymentReceipt** (auto-sourced) — thu từ cư dân qua đơn hàng
2. **Từ Manual CashTransaction** — nạp/rút thủ công không gắn receivable

```mermaid
flowchart TD
    subgraph Source1[Nguồn 1: Receivable flow]
        R[Receivable] --> PR[PaymentReceipt]
        PR --> FR1[FinancialReconciliation<br/>receivable_id + payment_receipt_id]
    end

    subgraph Source2[Nguồn 2: Manual flow]
        Manual[Nạp/rút thủ công] --> CTm[CashTransaction<br/>ManualTopup/ManualWithdraw]
        CTm --> FR2[FinancialReconciliation<br/>cash_transaction_id only]
    end

    FR1 --> Approve1{Manager duyệt}
    FR2 --> Approve2{Manager duyệt}

    Approve1 -->|Reconciled| CT1[CashTransaction<br/>ReceivableCollection]
    Approve2 -->|Reconciled| CashUpdate[Update CashAccount balance]
    Approve1 -->|Rejected| Reject1[Quay lại xem xét]
    Approve2 -->|Rejected| Reject2[Quay lại xem xét]
```

## State machine

```mermaid
stateDiagram-v2
    [*] --> Pending : tạo FinancialReconciliation

    Pending --> Reconciled : manager duyệt + match chứng từ
    Pending --> Rejected : từ chối, cần làm lại

    Rejected --> Pending : sửa xong, resubmit

    Reconciled --> [*]
```

## Flow đối soát từ PaymentReceipt

```mermaid
sequenceDiagram
    participant Acc as Kế toán
    participant Mgr as Manager
    participant API as ReconcileService
    participant DB
    participant Listener as AutoCompleteListener

    Acc->>API: Ghi nhận PaymentReceipt (thu tiền)
    API->>DB: PaymentReceipt created
    API->>DB: FinancialReconciliation<br/>(status=Pending, receivable+payment refs)

    Mgr->>API: POST /reconciliations/{id}/approve
    API->>DB: status = Reconciled
    API->>DB: CashTransaction<br/>(category=ReceivableCollection, inflow)
    API->>DB: CashAccount.balance += amount

    Listener->>DB: Check Receivable đã đủ chưa
    alt Đã đủ
        Listener->>DB: Receivable.status = Completed
        Listener->>DB: Order.status = Completed
    end
```

## Flow đối soát nạp/rút thủ công

```mermaid
sequenceDiagram
    participant Acc as Kế toán
    participant API as TreasuryService
    participant DB

    Acc->>API: POST /treasury/transactions/manual-topup<br/>{cash_account_id, amount, note}
    API->>DB: CashTransaction<br/>(category=ManualTopup, inflow)
    API->>DB: FinancialReconciliation<br/>(cash_transaction_id only, Pending)

    Note over Acc,DB: Hoặc ManualWithdraw<br/>(category=ManualWithdraw, outflow)
```

## Các loại CashTransaction gắn với Reconciliation

| Category | Direction | Nguồn | Reconcile? |
|----------|-----------|-------|-----------|
| `ManualTopup` | Inflow | Thủ công | ✅ (manual source) |
| `ManualWithdraw` | Outflow | Thủ công | ✅ (manual source) |
| `ReceivableCollection` | Inflow | PaymentReceipt | ✅ (receivable source) |
| `CustomerRefund` | Outflow | PaymentReceipt Refund | ✅ (receivable source) |
| `CommissionPayout` | Outflow | Commission snapshot | ❌ (không reconcile) |
| `AdvancePaymentPayout` | Outflow | AdvancePaymentRecord | ❌ (không reconcile) |

## Business rules quan trọng

1. **2 source song song**: receivable source (có `receivable_id` + `payment_receipt_id`) vs manual source (chỉ có `cash_transaction_id`).
2. **CashTransaction chỉ được sinh khi reconcile = Reconciled** — Pending không update CashAccount balance.
3. **Khi Reconciled**, listener tự kiểm tra Receivable đã thu đủ → tự đóng `Receivable.status = Completed` và `Order.status = Completed`.
4. **CommissionPayout / AdvancePaymentPayout không cần reconcile** — chi thẳng từ snapshot/record.
