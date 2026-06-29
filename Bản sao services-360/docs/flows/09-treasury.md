# 09 — Quản lý quỹ (Treasury)

## Tổng quan

```mermaid
flowchart LR
    subgraph Accounts[CashAccount - Tài khoản quỹ]
        CA1[Tiền mặt văn phòng]
        CA2[Ngân hàng TCB]
        CA3[Ví MoMo]
    end

    subgraph Tx[CashTransaction - 6 categories]
        direction TB
        In1[Inflow: ManualTopup]
        In2[Inflow: ReceivableCollection]
        Out1[Outflow: ManualWithdraw]
        Out2[Outflow: CustomerRefund]
        Out3[Outflow: CommissionPayout]
        Out4[Outflow: AdvancePaymentPayout]
    end

    Tx --> Accounts
    Accounts --> Balance[(Balance =<br/>opening + inflows - outflows)]
```

## Matrix direction × category

```mermaid
graph TD
    subgraph Inflow[Tiền vào]
        MT[ManualTopup<br/>Nạp thủ công]
        RC[ReceivableCollection<br/>Thu công nợ - auto từ reconcile]
    end

    subgraph Outflow[Tiền ra]
        MW[ManualWithdraw<br/>Rút thủ công]
        CR[CustomerRefund<br/>Hoàn tiền khách]
        CP[CommissionPayout<br/>Chi hoa hồng]
        AP[AdvancePaymentPayout<br/>Chi ứng vật tư]
    end

    MT --> |auto| FR1[FinancialReconciliation]
    MW --> |auto| FR2[FinancialReconciliation]
    RC --> |từ| PR[PaymentReceipt]
    CR --> |từ| PR
    CP --> |từ| Snap[OrderCommissionSnapshot]
    AP --> |từ| Adv[AdvancePaymentRecord]
```

## Phân loại chi tiết category

| Category | Direction | Nguồn dữ liệu | Manual/Auto | Required fields |
|----------|-----------|--------------|-------------|-----------------|
| `ManualTopup` | Inflow | User nhập | Manual | `cash_account_id`, `amount`, `note` |
| `ManualWithdraw` | Outflow | User nhập | Manual | `cash_account_id`, `amount`, `note` |
| `ReceivableCollection` | Inflow | PaymentReceipt (Collection) | Auto | `financial_reconciliation_id` |
| `CustomerRefund` | Outflow | PaymentReceipt (Refund) | Auto | `financial_reconciliation_id` |
| `CommissionPayout` | Outflow | OrderCommissionSnapshot | Auto | `commission_snapshot_id` |
| `AdvancePaymentPayout` | Outflow | AdvancePaymentRecord | Auto | `advance_payment_record_id` |

## Flow nạp/rút thủ công

```mermaid
sequenceDiagram
    participant User as Kế toán
    participant API
    participant DB

    User->>API: POST /treasury/transactions/manual-topup<br/>{cash_account_id, amount, note}
    API->>API: Validate amount > 0
    API->>DB: CashTransaction<br/>(category=ManualTopup, direction=Inflow)
    API->>DB: FinancialReconciliation (Pending)
    API-->>User: 201 Created

    Note over User,DB: Manager approve reconcile<br/>→ reflect vào CashAccount balance
```

## Flow chi hoa hồng (auto từ snapshot)

```mermaid
sequenceDiagram
    participant Mgr as Manager
    participant API as ClosingPeriodService
    participant DB

    Mgr->>API: POST /closing-periods/{id}/snapshots/{sid}/pay
    API->>DB: OrderCommissionSnapshot<br/>payout_status = Paid<br/>paid_out_at = NOW
    API->>DB: CashTransaction<br/>(category=CommissionPayout,<br/>commission_snapshot_id=sid,<br/>direction=Outflow)
    API->>DB: CashAccount.balance -= amount
```

## Balance calculation

```mermaid
flowchart LR
    Opening[opening_balance] --> Sum
    In[SUM inflows WHERE NOT deleted] --> Sum
    Out[SUM outflows WHERE NOT deleted] --> Sum
    Sum[Balance = opening + inflows - outflows]
```

## Business rules quan trọng

1. **Chỉ Manual (`ManualTopup`/`ManualWithdraw`) được user soft delete** — auto-sourced phải xóa thông qua nguồn gốc (unwind reconciliation / snapshot).
2. **Auto-sourced** (`ReceivableCollection`, `CustomerRefund`, `CommissionPayout`, `AdvancePaymentPayout`) bắt buộc có FK liên kết nguồn (`financial_reconciliation_id` / `commission_snapshot_id` / `advance_payment_record_id`).
3. **Balance** = `opening_balance + SUM(inflows WHERE NOT deleted) − SUM(outflows WHERE NOT deleted)`.
4. **Manual topup/withdraw** vẫn cần Manager approve qua FinancialReconciliation trước khi reflect vào balance.
