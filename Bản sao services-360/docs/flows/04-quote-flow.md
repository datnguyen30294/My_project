# 04 — Báo giá (Quote)

## State machine

```mermaid
stateDiagram-v2
    [*] --> Draft : KTV tạo báo giá

    Draft --> Sent : gửi cho Manager duyệt
    Draft --> Cancelled : hủy draft

    Sent --> ManagerApproved : Manager duyệt OK
    Sent --> ManagerRejected : Manager từ chối

    ManagerRejected --> Draft : KTV chỉnh sửa
    ManagerRejected --> Cancelled : bỏ

    ManagerApproved --> Approved : Cư dân duyệt (self / admin on behalf)
    ManagerApproved --> ResidentRejected : Cư dân từ chối

    ResidentRejected --> Draft : tạo revision v2, v3...
    ResidentRejected --> Cancelled : khách bỏ cuộc

    Approved --> Cancelled : hủy khi chưa có Order
    Approved --> [*] : khi có Order active

    Cancelled --> [*]
```

## 2 cấp duyệt

```mermaid
sequenceDiagram
    participant KTV as Kỹ thuật viên
    participant Mgr as Manager
    participant Res as Cư dân
    participant API as QuoteService
    participant DB as DB

    KTV->>API: POST /quotes (Draft)
    API->>DB: create Quote + QuoteLines
    DB-->>API: quote.id

    KTV->>API: POST /quotes/{id}/transition (Sent)
    API->>DB: status = Sent

    Mgr->>API: POST /quotes/{id}/transition (ManagerApproved)
    API->>DB: status = ManagerApproved<br/>manager_approved_at = NOW<br/>manager_approved_by_id = Mgr

    alt Cư dân tự duyệt qua portal
        Res->>API: POST /quotes/{id}/transition (Approved)
        API->>DB: resident_approved_via = ResidentSelf
    else Admin duyệt hộ
        Mgr->>API: POST /quotes/{id}/transition (Approved)
        API->>DB: resident_approved_via = AdminOnBehalf
    end

    API->>DB: status = Approved<br/>is_active = true<br/>resident_approved_at = NOW
    API->>DB: OgTicket.status = Approved
```

## Versioning (revision)

```mermaid
flowchart LR
    V1[Quote v1<br/>is_active=true] -->|Resident reject| V1R[Quote v1<br/>status=ResidentRejected<br/>is_active=false]
    V1R --> V2[Quote v2<br/>is_active=true<br/>Draft]
    V2 -->|Resident reject| V2R[Quote v2<br/>ResidentRejected]
    V2R --> V3[Quote v3<br/>is_active=true]
    V3 -->|Approved| V3A[Quote v3<br/>Approved → Order]

    style V3A fill:#d1fae5
```

**Rule**: trên 1 OgTicket tại 1 thời điểm **chỉ có 1 Quote `is_active=true`**. Khi tạo revision mới, quote cũ tự set `is_active=false`.

## QuoteLine types

| Line type | Ý nghĩa | `reference_id` trỏ tới |
|-----------|---------|----------------------|
| `Material` | Vật tư | `CatalogItem` |
| `Service` | Dịch vụ có trong danh mục | `ServiceItem` |
| `Adhoc` | Dịch vụ tự thêm (không trong danh mục) | null |

## Tính toán giá

```mermaid
flowchart TD
    Line1[QuoteLine 1<br/>qty * unit_price] --> Sum
    Line2[QuoteLine 2] --> Sum
    Line3[QuoteLine N] --> Sum

    Sum[SUM line_amount] --> Total[Quote.total_amount]

    Line1 -.purchase_price.-> Cost[Tính giá vốn<br/>dùng cho báo cáo LN]
    Line2 -.purchase_price.-> Cost
```

- `unit_price`: giá bán cho cư dân
- `purchase_price`: giá vốn (giá nhập) — chỉ nội bộ, không hiện cho cư dân
- `line_amount` = `quantity * unit_price` (sau khi áp KM nếu có)

