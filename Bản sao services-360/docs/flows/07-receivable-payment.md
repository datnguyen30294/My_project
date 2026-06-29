# 07 — Công nợ & Thanh toán

## State machine Receivable

```mermaid
stateDiagram-v2
    [*] --> Unpaid : auto tạo khi Order Confirmed

    Unpaid --> Partial : thu 1 phần
    Unpaid --> Paid : thu đủ 1 lần
    Unpaid --> Overdue : quá due_date chưa thu

    Partial --> Paid : thu thêm đủ
    Partial --> Overpaid : thu dư
    Partial --> Overdue : quá hạn

    Overdue --> Partial : thu 1 phần sau quá hạn
    Overdue --> Paid : thu đủ sau quá hạn
    Overdue --> WrittenOff : xóa nợ

    Paid --> Overpaid : thu dư thêm
    Paid --> Completed : đóng hoàn toàn (sau reconcile)

    Overpaid --> Paid : refund phần dư

    Completed --> [*]
    WrittenOff --> [*]
```

## Luồng thu tiền

```mermaid
sequenceDiagram
    participant Acc as Kế toán
    participant API as ReceivableService
    participant DB as DB
    participant Listener as AutoCompleteListener

    Acc->>API: POST /receivables/{id}/payments<br/>{amount, payment_method, note}
    API->>DB: PaymentReceipt<br/>(type=Collection, collected_by=Acc)
    API->>DB: Receivable.paid_amount += amount

    API->>API: Tính status mới
    alt paid_amount == amount
        API->>DB: status = Paid
    else paid_amount > amount
        API->>DB: status = Overpaid
    else paid_amount < amount
        API->>DB: status = Partial
    end

    Note over API,Listener: Sau khi reconcile<br/>(FinancialReconciliation)
    Listener->>DB: Receivable.status = Completed<br/>Order.status = Completed
```

## Aging (tuổi nợ)

```mermaid
flowchart LR
    Today[NOW] --> Calc[agingDays = NOW - due_date]
    Calc --> Bucket{Phân loại}
    Bucket -->|≤ 0| NotDue[Chưa đến hạn]
    Bucket -->|1-7| B1[1-7 ngày]
    Bucket -->|8-30| B2[8-30 ngày]
    Bucket -->|31-60| B3[31-60 ngày]
    Bucket -->|>60| B4[>60 ngày]

    style B3 fill:#fed7aa
    style B4 fill:#fecaca
```

## Refund (hoàn tiền)

```mermaid
sequenceDiagram
    participant Acc as Kế toán
    participant API
    participant DB

    Note over Acc,DB: Scenario: Customer thu dư hoặc hủy dịch vụ

    Acc->>API: POST /receivables/{id}/refund<br/>{amount, payment_method}
    API->>DB: PaymentReceipt<br/>(type=Refund, amount=-X hoặc positive)
    API->>DB: Receivable.paid_amount -= amount

    API->>DB: CashTransaction<br/>(category=CustomerRefund, outflow)

    alt paid_amount == amount phải thu
        API->>DB: status = Paid
    else paid_amount < amount
        API->>DB: status = Partial
    end
```

## Write-off (xóa nợ)

```mermaid
flowchart TD
    Overdue[Receivable Overdue > 60 ngày] --> Decide{Có khả năng thu?}
    Decide -->|Không| RequestWO["POST /receivables/{id}/write-off"]
    RequestWO --> Approval[Cần approval manager]
    Approval --> WO[status = WrittenOff]
    WO --> Report[Đưa vào báo cáo<br/>chi phí thua lỗ]
```

## Business rules

1. **Receivable auto tạo** khi `Order.status → Confirmed`
2. **Receivable.amount** = `Order.total_amount` (không thay đổi sau khi tạo)
3. **Overpaid** phải được refund trước khi Order có thể Complete
4. **Write-off** cần quyền `Receivable.WriteOff` + lý do + approval
5. **Completed** Receivable chỉ đạt được sau khi có đầy đủ reconciliation

