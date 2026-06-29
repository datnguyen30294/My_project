# Service Request Workflow - Residential Management System

Tài liệu mô tả luồng xử lý yêu cầu dịch vụ từ cư dân trong hệ thống quản lý chung cư.

---

## Happy Path - Luồng Thành Công (Full PMC Workflow)


```mermaid
sequenceDiagram
  autonumber
  actor Resident as Cư dân
  participant SR as Request Service
  participant PMC as PMC Service
  participant INV as Inventory Service
  participant PAY as Payment Service
  participant BUS as Event Bus

  Note over PAY: CASH Payment - Tạo hóa đơn thủ công, xác nhận tiền mặt (Online payment ở phase sau)

  %% === PHASE 1: TẠO YÊU CẦU & KHẢO SÁT ===

  Resident->>SR: POST /requests (type, description, apartmentId)
  SR->>SR: validate & create request
  SR->>PMC: Command CreateCase(requestId, snapshot)
  PMC->>PMC: create case (status=ASSIGNED_FOR_SURVEY)
  PMC-->>SR: 202 Accepted (caseId, surveyScheduledAt)
  SR->>SR: save caseId & status=PENDING_SURVEY
  SR-->>Resident: 201 Created (requestId, status, surveyTime)

  %% === KHẢO SÁT HIỆN TRẠNG ===
  Note over PMC: Nhân viên PMC đến địa điểm khảo sát

  %% Nhân viên mượ vật tư cho khảo sát (nếu cần)
  opt Cần vật tư khảo sát
    PMC->>INV: Command BorrowMaterial(caseId, items[], purpose=SURVEY)
    INV->>INV: check availability & reserve
    INV-->>PMC: 202 Accepted (borrowId, items[])
    PMC->>PMC: record borrowed materials
  end

  %% Hoàn thành khảo sát
  PMC->>PMC: complete survey (photos, notes, requiredMaterials[])
  PMC-->>SR: 200 OK (surveyCompletedAt)

  %% Trả lại vật tư khảo sát
  opt Đã mượn vật tư khảo sát
    PMC->>INV: Command ReturnMaterial(borrowId, items[], condition)
    INV->>INV: update stock & record condition
    INV-->>PMC: 200 OK (returnedAt)
  end

  %% === PHASE 2: BÁO GIÁ ===
  PMC->>PMC: generate estimate(labor + materials)
  PMC->>BUS: Event EstimateCreated(requestId, caseId, amount, description, breakdown)
  BUS-->>SR: EstimateCreated
  SR->>SR: update RequestStatus=QUOTED
  SR->>SR: notify Resident (email/push)

  %% === PHASE 3: CHẤP NHẬN BÁO GIÁ ===
  Resident->>SR: POST /requests/{id}/approve-estimate
  SR->>SR: validate(status=QUOTED)
  SR->>SR: update RequestStatus=APPROVED
  SR-->>Resident: 200 OK (estimate approved, will pay after completion)

  %% === PHASE 4: CHUẨN BỊ THI CÔNG ===
  SR->>PMC: Command StartWork(caseId, requestId)
  PMC->>PMC: assign worker & schedule

  %% Xuất kho tài sản, vật tư chính thức cho thi công
  PMC->>INV: Command CreateStockOutOrder(caseId, items[], purpose=INSTALLATION)
  INV->>INV: process stock out (deduct inventory)
  INV-->>PMC: 202 Accepted (stockOutId, items[])
  PMC->>PMC: record issued materials

  PMC-->>SR: 202 Accepted (workStartedAt, estimatedCompletionTime)
  SR->>SR: update status=IN_PROGRESS

  PMC->>BUS: Event WorkStarted(requestId, caseId, workerId, startedAt)
  BUS-->>SR: WorkStarted
  SR->>SR: notify Resident (work has started)

  %% === THI CÔNG - MƯỢN THÊM VẬT TƯ (NẾU CẦN) ===
  opt Nhân viên cần thêm vật tư thi công
    PMC->>INV: Command BorrowMaterial(caseId, items[], purpose=INSTALLATION)
    INV->>INV: check availability & reserve
    INV-->>PMC: 202 Accepted (borrowId, items[])
    PMC->>PMC: record additional borrowed materials
  end

  %% === PHASE 5: HOÀN THÀNH ===
  Note over PMC: Worker completes the job (hours/days later)
  PMC->>BUS: Event WorkCompleted(requestId, caseId, completedAt, notes, photos)
  BUS-->>SR: WorkCompleted
  SR->>SR: update RequestStatus=COMPLETED
  SR->>SR: notify Resident (work completed, please settle payment)

  %% Trả lại vật tư đã mượn (thi công)
  opt Có vật tư mượn chưa trả
    PMC->>INV: Command ReturnMaterial(borrowId, items[], usedQty, remainingQty)
    INV->>INV: update stock (remaining returned), consume (used)
    INV-->>PMC: 200 OK (returnedAt, consumedSummary)
    PMC->>PMC: record material consumption
  end

  %% === PHASE 6: THANH TOÁN (SAU KHI HOÀN THÀNH) ===
  Note over SR,PAY: Tạo hóa đơn sau khi công việc hoàn thành
  SR->>PAY: Command CreateInvoice(requestId, amount, residentId, method=CASH)
  PAY->>PAY: create invoice (manual/by staff)
  PAY-->>SR: 202 Accepted (invoiceId, invoiceNumber)
  SR->>SR: save invoiceId & status=PENDING_PAYMENT
  SR-->>Resident: 200 OK (invoiceId, invoiceNumber, amount, paymentMethod=CASH)

  Note over SR,Resident: Nhân viên PMC thu tiền mặt từ cư dân
  Resident->>PMC: Trả tiền mặt cho nhân viên
  PMC->>PAY: Command ConfirmCashPayment(invoiceId, cashAmount, paymentProof, collectedBy)
  PAY->>PAY: validate & record payment
  PAY->>BUS: Event PaymentConfirmed(requestId, invoiceId, paidAmount, paidAt, method=CASH)
  PAY-->>SR: 200 OK (paymentId, paidAt)
  SR->>SR: update RequestStatus=PAID
  SR->>SR: enableFeedback(requestId)
  SR->>SR: notify Resident & PMC
  BUS-->>PMC: PaymentConfirmed

  %% === PHASE 7: FEEDBACK ===
  Resident->>SR: POST /requests/{id}/feedback (rating, comment)
  SR->>SR: validate(status=COMPLETED, one-time, belongsToResident)
  SR->>SR: saveFeedback(requestId, rating, comment, submittedAt)
  SR->>SR: update request.hasFeedback=true
  SR-->>Resident: 200 OK (thank you message)

  SR->>BUS: Event FeedbackSubmitted(requestId, caseId, rating)
  BUS-->>PMC: FeedbackSubmitted
  PMC->>PMC: update case quality metrics
  PMC->>PMC: update worker performance rating
```

---

## Error Scenarios - Ví Dụ Các Tình Huống Lỗi

### Ví Dụ 1: PMC Không Thể Xử Lý (Lý do nghiệp vụ)

```mermaid
sequenceDiagram
  autonumber
  actor Resident
  participant SR as Request Service
  participant PMC as PMC Service

  Resident->>SR: Create Request
  SR->>PMC: Command CreateCase
  PMC-->>SR: 422 Unprocessable<br/>(code: NO_WORKERS_AVAILABLE)
  SR->>SR: update status=FAILED
  SR-->>Resident: 422 Error<br/>"Hiện tại không có thợ điện.<br/>Vui lòng thử lại sau."
```

**Các error codes khác**: `SERVICE_NOT_SUPPORTED`, `INSUFFICIENT_MATERIALS`, `AREA_NOT_COVERED`...

---

### Ví Dụ 2: PMC Service Unavailable (Lỗi kỹ thuật)

```mermaid
sequenceDiagram
  autonumber
  actor Resident
  participant SR as Request Service
  participant PMC as PMC Service

  Resident->>SR: Create Request
  SR->>PMC: Command CreateCase (timeout)
  Note over PMC: Service không phản hồi
  PMC--xSR: Timeout
  SR->>SR: update status=PENDING_RETRY
  SR-->>Resident: 503 Service Unavailable<br/>"Hệ thống đang bận, yêu cầu sẽ được<br/>xử lý tự động sau 5 phút."

  Note over SR: Auto retry (background job)
```

---

### Ví Dụ 3: Cư Dân Từ Chối Báo Giá

```mermaid
sequenceDiagram
  autonumber
  actor Resident
  participant SR as Request Service
  participant PMC as PMC Service
  participant BUS as Event Bus

  Note over SR: Request status = QUOTED
  Resident->>SR: POST /requests/{id}/reject-estimate (reason)
  SR->>SR: update status=REJECTED
  SR->>BUS: Event RequestRejected(requestId, reason)
  BUS-->>PMC: RequestRejected
  PMC->>PMC: cancel case
  SR-->>Resident: 200 OK (request cancelled)
```
---

### Ví Dụ 4: Công Việc Gặp Vấn Đề

```mermaid
sequenceDiagram
  autonumber
  participant SR as Request Service
  participant PMC as PMC Service
  participant BUS as Event Bus
  actor Resident

  Note over PMC: Worker gặp vấn đề trong quá trình làm
  PMC->>BUS: Event WorkBlocked(requestId, reason, requiresApproval)
  BUS-->>SR: WorkBlocked
  SR->>SR: update status=BLOCKED
  SR-->>Resident: Thông báo yêu cầu phê duyệt bổ sung

  alt Resident chấp nhận
    Resident->>SR: Approve Additional Work
    SR->>PMC: Command ResumeWork(caseId)
  else Resident từ chối
    Resident->>SR: Cancel Request
    SR->>PMC: Command CancelWork(caseId)
  end
```

---

## Tóm Tắt Trạng Thái Request

```mermaid
stateDiagram-v2
    [*] --> PENDING_SURVEY: Tạo request

    PENDING_SURVEY --> PENDING_RETRY: Service unavailable (503)
    PENDING_RETRY --> PENDING_SURVEY: Retry OK
    PENDING_RETRY --> FAILED: Retry fail 3 lần

    PENDING_SURVEY --> SURVEY_IN_PROGRESS: Nhân viên bắt đầu khảo sát
    SURVEY_IN_PROGRESS --> MATERIALS_BORROWED: Mượn vật tư khảo sát
    MATERIALS_BORROWED --> SURVEY_COMPLETED: Trả vật tư & hoàn tất
    SURVEY_IN_PROGRESS --> SURVEY_COMPLETED: Khảo sát xong (không mượn)

    SURVEY_COMPLETED --> QUOTED: Tạo báo giá
    SURVEY_COMPLETED --> FAILED: Không thể xử lý (422)

    QUOTED --> APPROVED: Chấp nhận báo giá
    QUOTED --> REJECTED: Từ chối

    APPROVED --> PREPARING_MATERIALS: Chuẩn bị xuất kho
    PREPARING_MATERIALS --> MATERIALS_ISSUED: Xuất kho thành công

    MATERIALS_ISSUED --> IN_PROGRESS: Bắt đầu thi công
    IN_PROGRESS --> ADDITIONAL_MATERIALS: Mượn thêm vật tư
    ADDITIONAL_MATERIALS --> IN_PROGRESS: Nhận được vật tư

    IN_PROGRESS --> BLOCKED: Gặp vấn đề
    BLOCKED --> IN_PROGRESS: Chấp nhận bổ sung
    BLOCKED --> CANCELLED: Từ chối & hủy

    IN_PROGRESS --> MATERIALS_RETURNING: Công xong, trả vật tư
    MATERIALS_RETURNING --> COMPLETED: Đã trả tất cả

    COMPLETED --> PENDING_PAYMENT: Chờ thanh toán
    PENDING_PAYMENT --> PAID: Thanh toán OK
    PENDING_PAYMENT --> PENDING_PAYMENT: Thanh toán fail (retry)

    PAID --> [*]: Có feedback (optional)

    FAILED --> [*]
    REJECTED --> [*]
    CANCELLED --> [*]
```

---

## PMC Service - Internal States & Material Flow

```mermaid
stateDiagram-v2
    [*] --> ASSIGNED_FOR_SURVEY: Case được tạo

    ASSIGNED_FOR_SURVEY --> SURVEY_MATERIAL_BORROWED: Mượn vật tư khảo sát
    SURVEY_MATERIAL_BORROWED --> SURVEY_COMPLETED: Trả vật tư khảo sát
    ASSIGNED_FOR_SURVEY --> SURVEY_COMPLETED: Khảo sát không cần vật tư

    SURVEY_COMPLETED --> ESTIMATE_SENT: Gửi báo giá

    ESTIMATE_SENT --> APPROVED: Resident approve
    ESTIMATE_SENT --> CANCELLED: Resident reject

    APPROVED --> MATERIAL_ISSUED: Xuất kho thi công
    MATERIAL_ISSUED --> WORK_IN_PROGRESS: Bắt đầu làm

    WORK_IN_PROGRESS --> ADDITIONAL_MATERIAL_BORROWED: Mượn thêm
    ADDITIONAL_MATERIAL_BORROWED --> WORK_IN_PROGRESS: Nhận vật tư

    WORK_IN_PROGRESS --> WORK_COMPLETED: Hoàn thành
    WORK_COMPLETED --> MATERIAL_RETURNED: Trả vật tư mượn
    MATERIAL_RETURNED --> AWAITING_PAYMENT: Chờ thanh toán
    AWAITING_PAYMENT --> PAID: Đã thu tiền
    PAID --> CLOSED: Đóng case

    CLOSED --> [*]
```

---

## Error Codes Reference

### PMC Errors
| Error Code | Message Example |
|------------|-----------------|
| `NO_WORKERS_AVAILABLE` | "Hiện tại không có thợ điện. Vui lòng thử lại sau." |
| `SERVICE_NOT_SUPPORTED` | "Chúng tôi không hỗ trợ dịch vụ này." |
| `INSUFFICIENT_MATERIALS` | "Đang thiếu linh kiện. Dự kiến có hàng sau 3-5 ngày." |
| `AREA_NOT_COVERED` | "Khu vực này chưa được phục vụ." |

### Payment Errors (Cash - Phase hiện tại)
| Error Code | Message Example |
|------------|-----------------|
| `AMOUNT_MISMATCH` | "Số tiền thu được không khớp với hóa đơn. Cần: 800,000đ" |
| `INVOICE_EXPIRED` | "Hóa đơn đã hết hạn. Vui lòng liên hệ bộ phận hỗ trợ." |
| `DUPLICATE_PAYMENT` | "Hóa đơn này đã được thanh toán rồi." |
| `INVALID_PAYMENT_PROOF` | "Minh chứng thanh toán không hợp lệ." |

### Payment Errors (Online - Phase sau)
| Error Code | Message Example |
|------------|-----------------|
| `INSUFFICIENT_BALANCE` | "Tài khoản không đủ số dư." |
| `GATEWAY_ERROR` | "Cổng thanh toán tạm thời gián đoạn." |
| `PAYMENT_CANCELLED` | "Bạn đã hủy giao dịch." |
| `TIMEOUT` | "Giao dịch hết thời gian chờ." |

### Inventory Errors
| Error Code | Message Example |
|------------|-----------------|
| `MATERIAL_NOT_AVAILABLE` | "Vật tư trong kho không đủ. Vui lòng đặt PO trước." |
| `MATERIAL_BORROW_LIMIT_EXCEEDED` | "Đạt giới hạn mượn. Vui lòng trả vật tư trước." |
| `MATERIAL_RETURN_MISMATCH` | "Số lượng trả không khớp với đã mượn." |

---

## Ghi Chú

**Commands** (sync, cần response):

### Request Service → PMC
- `CreateCase(requestId, snapshot)` - Tạo case mới cho request

### Request Service → Payment
- `CreateInvoice(requestId, amount, residentId, method)` - Tạo hóa đơn (method: CASH/ONLINE)
- Phase hiện tại: `method=CASH`, tạo hóa đơn thủ công

### PMC → Payment
- `ConfirmCashPayment(invoiceId, cashAmount, paymentProof, collectedBy)` - Xác nhận thanh toán tiền mặt

### Request Service → PMC (Work)
- `StartWork(caseId, requestId)` - Bắt đầu thi công
- `ResumeWork(caseId)` - Tiếp tục công việc bị block
- `CancelWork(caseId)` - Hủy công việc

### PMC ↔ Inventory
- `BorrowMaterial(caseId, items[], purpose)` - Mượn vật tư (SURVEY/INSTALLATION)
- `ReturnMaterial(borrowId, items[], condition, usedQty)` - Trả vật tư
- `CreateStockOutOrder(caseId, items[], purpose)` - Xuất kho chính thức

**Events** (async, thông báo):
- `EstimateCreated` - Đã tạo báo giá
- `PaymentConfirmed` - Thanh toán thành công (CASH/ONLINE)
- `PaymentFailed` - Thanh toán thất bại
- `WorkStarted` - Bắt đầu làm
- `WorkCompleted` - Hoàn thành công việc
- `WorkBlocked` - Công việc bị block
- `RequestRejected` - Resident từ chối báo giá
- `FeedbackSubmitted` - Resident đã đánh giá

---

## Material Purposes

| Purpose | Mô tả | Trạng thái sau khi mượn |
|---------|-------|------------------------|
| `SURVEY` | Vật tư dùng cho khảo sát hiện trạng | Phải trả lại sau khi khảo sát xong |
| `INSTALLATION` | Vật tư dùng cho thi công | Trả lại phần dư, ghi nhận phần đã dùng |

---

## PMC Service - Material Flow Summary

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        PMC SERVICE FULL WORKFLOW                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  PHASE 1: KHẢO SÁT                                                      │
│  ┌──────────────────┐      ┌──────────────────┐      ┌──────────────┐  │
│  │ Cần vật tư?      │──YES─→│ BorrowMaterial   │─────→│ Mượn & Dùng  │  │
│  └──────────────────┘      │ (purpose=SURVEY) │      └──────────────┘  │
│       │ NO                     └──────────────────┘            │       │
│       ▼                                                         ▼       │
│       └─────────────────────────────────────────────────→ ReturnMaterial│
│                                                                   │       │
│  PHASE 2: BÁO GIÁ ────────────────────────────────────────────┘       │
│       │                                                                 │
│       ▼                                                                 │
│  PHASE 3: CHẤP NHẬN BÁO GIÁ                                            │
│  ┌──────────────────┐                                                    │
│  │ Approve Estimate  │───→ APPROVED (không thanh toán ngay)             │
│  └──────────────────┘                                                    │
│       │                                                                 │
│       ▼                                                                 │
│  PHASE 4: CHUẨN BỊ THI CÔNG                                              │
│  ┌──────────────────┐                                                    │
│  │ CreateStockOut   │─────────────────────────────────────────┐         │
│  │ (Xuất kho chính) │                                           │         │
│  └──────────────────┘                                           │         │
│       │                                                        │         │
│       ▼                                                        ▼         │
│  PHASE 5: THI CÔNG                                               ┌──────────────┐
│  ┌──────────────────┐      ┌──────────────────┐              │ Cần thêm?    │
│  │ Worker thực hiện │──NEED─→│ BorrowMaterial   │──YES────────→│ (purpose=    │
│  └──────────────────┘      │ (purpose=INSTALL)│              │  INSTALL)    │
│                            └──────────────────┘              └──────────────┘
│       │                                                        │ NO         │
│       ▼                                                        │            │
│  PHASE 6: HOÀN THÀNH                                            │            │
│  ┌──────────────────┐      ┌──────────────────┐                │            │
│  │ WorkCompleted    │──MUST─→│ ReturnMaterial   │◀───────────────┘            │
│  └──────────────────┘      │ (return + used)  │                              │
│                             └──────────────────┘                              │
│       │                                                                 │
│       ▼                                                                 │
│  PHASE 7: THANH TOÁN (SAU KHI HOÀN THÀNH)                               │
│  ┌──────────────────┐      ┌──────────────────┐      ┌──────────────┐  │
│  │ CreateInvoice    │─────→│ Resident trả     │─────→│ ConfirmCash  │──→ PAID
│  │ (CASH, manual)   │      │ tiền mặt         │      │ Payment      │        │
│  └──────────────────┘      └──────────────────┘      └──────────────┘  │
│                                                                         │
│  PHASE 8: FEEDBACK ─────────────────────────────────────────────────────→ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```
