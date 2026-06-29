# 12 — Ứng vật tư (Advance Payment)

## Kịch bản nghiệp vụ

KTV đi thi công cần mua vật tư ngay tại hiện trường hoặc ở cửa hàng gần đó → KTV tự bỏ tiền ra trước (ứng) → công ty hoàn lại thông qua flow Advance Payment.

## Flow ứng vật tư

```mermaid
flowchart TD
    KTV[KTV nhận Order] --> Review[Review OrderLine<br/>xác định vật tư cần ứng]
    Review --> Mark[Mark advance_payer_id<br/>trên OrderLine]

    Mark --> Request[Tạo AdvancePaymentRecord<br/>request_amount]
    Request --> Approve{Manager duyệt?}
    Approve -->|No| Reject[Từ chối]
    Approve -->|Yes| Pay[Chi tiền từ Treasury]

    Pay --> CT[CashTransaction<br/>category=AdvancePaymentPayout<br/>direction=Outflow]
    CT --> Record[AdvancePaymentRecord<br/>paid_at = NOW<br/>paid_by_id = accountant]

    Record --> Work[KTV mua vật tư + thi công]
    Work --> Done[Hoàn tất OrderLine]
```

## Tính toán trên OrderLine

```mermaid
flowchart LR
    OL[OrderLine<br/>line_amount = 500k] --> Methods

    Methods --> A1[advanceAmount = SUM AdvancePaymentRecord.amount<br/>WHERE order_line_id = OL.id]
    Methods --> A2[advanceStatus<br/>None/Partial/Full/Over]
```

- `advanceAmount()` = tổng đã ứng
- `advanceStatus()`:
  - `None`: chưa ứng
  - `Partial`: ứng < line_amount
  - `Full`: ứng == line_amount
  - `Over`: ứng > line_amount (cần flag)

## Batch payment

Khi 1 KTV có nhiều advances cho nhiều OrderLines → chi 1 cục qua `batch_id`:

```mermaid
sequenceDiagram
    participant Acc as Kế toán
    participant API
    participant DB

    Acc->>API: List KTV A's pending advances
    API-->>Acc: [Record1 Order X, Record2 Order Y, Record3 Order Z]

    Acc->>API: POST /advance-payments/batch<br/>{records: [...], total}
    API->>DB: batch_id = uuid()
    API->>DB: Update all records with batch_id + paid_at
    API->>DB: 1 CashTransaction duy nhất<br/>(amount = total batch)
```

## Đối soát với Order

```mermaid
flowchart TD
    Order[Order total = 10M]
    Order --> Lines[OrderLines<br/>vật tư 3M + công 7M]

    Lines --> AdvMat[Vật tư được ứng 3M<br/>advance_payer_id = KTV A]
    Lines --> NoAdv[Công 7M<br/>không ứng]

    AdvMat --> Record[AdvancePaymentRecord 3M]
    Record --> CT[CashTransaction outflow 3M]

    NoAdv --> Normal[Tính thẳng vào doanh thu]

    Order --> Receivable[Receivable 10M<br/>thu từ cư dân]

    Receivable --> Check{Thu xong?}
    Check -->|Yes| Balance[Công ty thu 10M - chi ứng 3M<br/>= 7M thực thu]

    style Balance fill:#d1fae5
```

## Business rules

1. **`advance_payer_id` phải là Account đang active** trong dự án Order
2. **Không được ứng vượt `line_amount`** (trừ khi có approval đặc biệt)
3. **Chỉ ứng được OrderLine của Order status ≥ Confirmed**
4. **Khi Order hủy** → các Advance Record phải được refund hoặc đối trừ với KTV
5. **Soft delete** Advance Record phải reverse CashTransaction

