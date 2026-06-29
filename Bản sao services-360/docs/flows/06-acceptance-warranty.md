# 06 — Nghiệm thu & Bảo hành

## AcceptanceReport — biên bản nghiệm thu

Một `Order` có **0..1** biên bản nghiệm thu. Biên bản được dựng từ template HTML (tenant setting `acceptance_report.template_html`) và đóng vai trò **bằng chứng** cho việc Order đã chuyển sang `Accepted`. Có 2 kênh xác nhận song song:

- **Ký qua link (remote)** — cư dân mở `share_token`, điền chữ ký số + ghi chú → lưu `confirmed_at`, `confirmed_signature_name`, `confirmed_note`.
- **Upload bản scan (onsite)** — KTV ký giấy với cư dân tại công trình, rồi upload file PDF/ảnh → lưu `signed_file_path`, `signed_file_mime`, `signed_file_size`, `signed_uploaded_at`, `signed_uploaded_by_account_id`.

Cả 2 kênh đều chỉ thao tác được khi **Order đã ở `Accepted` hoặc `Completed`** (xem `AcceptanceReportService::assertOrderAllowsAcceptance`).

```mermaid
flowchart TD
    Work["Order.status = InProgress<br/>thi công xong"] --> Transition["PUT /orders/{id}/transition<br/>→ Accepted"]
    Transition --> OAccepted["Order.status = Accepted<br/>OgTicket.status = Accepted"]

    OAccepted --> GetOrCreate["GET /orders/{id}/acceptance-report<br/>get-or-create biên bản + share_token"]
    GetOrCreate --> Choose{Kênh xác nhận}

    Choose -->|Remote| Share["Gửi link<br/>/public/acceptance-reports/{token}"]
    Share --> ResConfirm["POST /public/acceptance-reports/{token}/confirm<br/>signature_name + note"]
    ResConfirm --> StoreRemote["confirmed_at, confirmed_signature_name,<br/>confirmed_note"]

    Choose -->|Onsite| SignPaper["Ký giấy onsite cạnh KTV"]
    SignPaper --> Upload["POST /orders/{id}/acceptance-report/signed<br/>PDF/JPEG/PNG ≤ 20MB"]
    Upload --> StoreFile["signed_file_path, signed_uploaded_at,<br/>signed_uploaded_by_account_id"]

    StoreRemote --> Done["Biên bản hoàn tất<br/>đủ bằng chứng nghiệm thu"]
    StoreFile --> Done
```

> Lưu ý: transition `InProgress → Accepted` hiện **không tự động** kiểm tra đã có AcceptanceReport hay chưa — là thao tác thủ công của KTV/Admin.

## Public share link — remote confirm

```mermaid
sequenceDiagram
    participant KTV
    participant API as OrderService
    participant AR as AcceptanceReportService
    participant Cust as Cư dân
    participant Public as Public endpoint

    KTV->>API: PUT /orders/:id/transition (Accepted)
    API-->>KTV: Order.status = Accepted
    KTV->>AR: GET /orders/:id/acceptance-report
    AR-->>KTV: share_token = random(40)

    KTV->>Cust: Gửi URL /acceptance/:token (Zalo/SMS)
    Cust->>Public: GET /public/acceptance-reports/:token
    Public-->>Cust: render biên bản

    Cust->>Public: PATCH /public/acceptance-reports/:token<br/>customer_name, customer_phone, note
    Cust->>Public: POST /public/acceptance-reports/:token/confirm<br/>signature_name, note
    Public->>AR: confirmByToken
    AR->>AR: assertOrderAllowsAcceptance (Accepted/Completed)
    AR->>AR: guard chưa confirmed_at
    AR-->>Cust: confirmed_at = now()
```

## Upload signed file — onsite

```mermaid
sequenceDiagram
    participant KTV
    participant API as AcceptanceReportService
    participant Storage as StorageService
    participant DB

    KTV->>API: POST /orders/:id/acceptance-report/signed<br/>multipart file
    API->>API: validate mime ∈ [pdf, jpeg, png] và size ≤ 20MB
    API->>API: assertOrderAllowsAcceptance
    API->>Storage: nếu đã có delete old signed_file_path
    API->>Storage: upload → acceptance-reports/signed/:uuid
    Storage-->>API: path
    API->>DB: update signed_file_*, signed_uploaded_at, signed_uploaded_by_account_id
    API-->>KTV: AcceptanceReport resource

    Note over KTV,DB: Xoá bản ký DELETE /orders/:id/acceptance-report/signed
```

## Bảo hành (Warranty)

```mermaid
flowchart TD
    OrderComp[Order Completed] --> WarrStart[Kích hoạt thời gian bảo hành<br/>ví dụ 3-12 tháng]
    WarrStart --> Wait{Trong thời hạn?}
    Wait -->|Cư dân khiếu nại| CreateWR[Tạo WarrantyRequest<br/>gắn OgTicket gốc]

    CreateWR --> Review[KTV review]
    Review --> InScope{Thuộc phạm vi bảo hành?}
    InScope -->|Yes| FreeFix[Sửa miễn phí<br/>tạo OgTicket mới<br/>link warranty]
    InScope -->|No| NewTicket[Tạo OgTicket mới<br/>tính phí]

    FreeFix --> Track[Ghi vào báo cáo<br/>tỷ lệ bảo hành]
    NewTicket --> Normal[Flow bình thường]
```

## Báo cáo tỷ lệ bảo hành

Công thức:
```
Tỷ lệ bảo hành = (Số ticket có WarrantyRequest / Tổng ticket Completed trong kỳ) × 100%
```

```mermaid
flowchart LR
    Period[Kỳ thống kê<br/>tháng/quý/năm] --> Query
    Query[Query ticket Completed<br/>+ count warranty requests]
    Query --> Ratio[Tỷ lệ bảo hành %]
    Query --> ByProject[Theo dự án]
    Query --> ByKTV[Theo KTV]
    Query --> ByCategory[Theo loại ticket]

    Ratio --> Dashboard[Dashboard<br/>chất lượng dịch vụ]
```

## Business rules quan trọng

1. **Order phải ở `Accepted` hoặc `Completed`** mới thao tác được biên bản (`assertOrderAllowsAcceptance`).
2. **Không cho confirm 2 lần** — nếu `confirmed_at` đã có thì block (`ACCEPTANCE_REPORT_ALREADY_CONFIRMED`).
3. **Transition `InProgress → Accepted` hiện không tự động kiểm tra** đã có biên bản hay chưa — là thao tác thủ công.
4. **2 kênh xác nhận song song**: ký từ xa qua `share_token` HOẶC upload bản scan đã ký onsite. Không bắt buộc cả hai cùng có.
5. **CSAT rating** chỉ mở cho cư dân khi ticket đã `Accepted` (trước khi `Completed`).
