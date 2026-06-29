# 05 — Đơn hàng (Order)

## State machine

```mermaid
stateDiagram-v2
    [*] --> Draft : tạo từ Quote Approved

    Draft --> Confirmed : xác nhận
    Draft --> Cancelled : hủy

    Confirmed --> InProgress : KTV bắt đầu thi công
    Confirmed --> Cancelled : hủy

    InProgress --> Accepted : có AcceptanceReport đã ký
    InProgress --> Cancelled : hủy (cần approval)

    Accepted --> Completed : khi đã thu tiền đủ (Receivable Paid)
    Accepted --> Cancelled : cực hiếm, cần unlock ClosingPeriod

    Completed --> [*]
    Cancelled --> [*]
```

## Flow Quote → Order → Nghiệm thu → Thanh toán

```mermaid
flowchart TD
    QApproved[Quote.status = Approved<br/>is_active = true] --> CreateOrder[POST /orders]
    CreateOrder --> ODraft[Order.status = Draft<br/>copy OrderLines từ Quote]

    ODraft --> Confirm[Confirm Order]
    Confirm --> OConfirmed[Order.status = Confirmed]
    OConfirmed --> GenReceivable[(Auto tạo Receivable<br/>amount = total_amount)]

    OConfirmed --> StartWork[PUT transition InProgress]
    StartWork --> OInProgress[Order.status = InProgress]

    OInProgress --> Advance{Cần ứng vật tư?}
    Advance -->|Yes| AdvancePay[AdvancePaymentRecord<br/>→ CashTransaction outflow]
    Advance -->|No| Work[Thi công onsite]
    AdvancePay --> Work

    Work --> Transition["PUT /orders/{id}/transition → Accepted"]
    Transition --> OAccepted[Order.status = Accepted<br/>OgTicket.status = Accepted]
    OAccepted --> GetAR["GET /orders/{id}/acceptance-report<br/>get-or-create biên bản + share_token"]
    GetAR --> Evidence{Bằng chứng ký}
    Evidence -->|Remote| ResConfirm["Cư dân confirm qua link<br/>POST /public/acceptance-reports/{token}/confirm"]
    Evidence -->|Onsite| UploadSigned["KTV upload bản scan đã ký<br/>POST /orders/{id}/acceptance-report/signed"]

    ResConfirm --> Collect[Thu tiền PaymentReceipt]
    UploadSigned --> Collect
    Collect --> Reconcile[FinancialReconciliation]
    Reconcile --> OCompleted[Order.status = Completed]

    style OCompleted fill:#d1fae5
```

## Ứng vật tư per OrderLine

```mermaid
sequenceDiagram
    participant KTV as KTV (advance_payer)
    participant API as OrderService
    participant Treasury as TreasuryService
    participant DB as DB

    KTV->>API: Chọn OrderLine → mark "cần ứng"
    API->>DB: OrderLine.advance_payer_id = KTV.id

    KTV->>Treasury: Request ứng
    Treasury->>DB: AdvancePaymentRecord<br/>(account_id, order_line_id, amount)
    Treasury->>DB: CashTransaction<br/>(category=AdvancePaymentPayout, outflow)
    Treasury-->>KTV: OK, chi tiền

    Note over KTV,DB: Sau khi thi công xong, hoàn ứng hoặc<br/>đối soát vào doanh thu
```

## So sánh OrderLine vs QuoteLine gốc

Khi Order phát sinh (thêm/xóa/sửa line so với Quote approved), hệ thống cần:

```mermaid
flowchart LR
    subgraph Compare[So sánh]
        QL[QuoteLines v1] --> Diff{Diff}
        OL[OrderLines] --> Diff
    end

    Diff --> Added[Line mới trong Order<br/>không có trong Quote]
    Diff --> Removed[Line trong Quote<br/>bị xóa trong Order]
    Diff --> Modified[Line thay đổi qty/price]

    Added --> Suggest[Đề xuất tạo<br/>Quote revision v2]
    Removed --> Suggest
    Modified --> Suggest

    style Suggest fill:#fef3c7
```

**⚠ Gap hiện tại**: logic diff + đề xuất revision chưa rõ đã có trong codebase chưa.

## Financial locking

```mermaid
flowchart TD
    Edit[Sửa Order] --> Check{Order có trong<br/>ClosingPeriod Closed?}
    Check -->|Yes| Block[Order.isFinanciallyLocked = true<br/>THROW OrderLocked]
    Check -->|No| Allow[Cho phép sửa]
```

