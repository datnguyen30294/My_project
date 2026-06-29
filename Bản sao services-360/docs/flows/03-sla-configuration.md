# 03 — SLA & cấu hình OgTicket

## Hai loại SLA

```mermaid
flowchart LR
    Received((Received)) --> |sla_quote_minutes| QuoteDue[sla_quote_due_at]
    QuoteDue --> Quoted((Quoted))
    Quoted --> |sla_completion_minutes| CompDue[sla_completion_due_at]
    CompDue --> Completed((Completed))

    style QuoteDue fill:#fef3c7
    style CompDue fill:#fef3c7
```

| SLA | Mốc bắt đầu | Mốc hoàn thành | Setting |
|-----|------------|----------------|---------|
| **SLA báo giá** | `received_at` | chuyển sang `Quoted` | `og_ticket.sla_quote_minutes` |
| **SLA hoàn thành** | `received_at` hoặc `ordered_at` | chuyển sang `Completed` | `og_ticket.sla_completion_minutes` |

## Tính SLA khi tạo ticket

```mermaid
sequenceDiagram
    participant API as OgTicketService
    participant Setting as SystemSetting
    participant DB as DB

    API->>Setting: get('og_ticket.sla_quote_minutes')
    Setting-->>API: 60 (ví dụ)
    API->>Setting: get('og_ticket.sla_completion_minutes')
    Setting-->>API: 2880 (48h)

    Note over API: adjust theo priority:<br/>Urgent: *0.5<br/>High: *0.75<br/>Normal: *1.0<br/>Low: *1.5

    API->>API: sla_quote_due_at = received_at + minutes
    API->>API: sla_completion_due_at = received_at + minutes
    API->>DB: INSERT OgTicket
```

## Cảnh báo & escalation

```mermaid
flowchart TD
    Job[Job định kỳ<br/>CheckSlaViolationJob]
    Job --> Q1{Ticket chưa Quoted<br/>& quote_due_at < NOW}
    Q1 -->|Yes| AlertQuote[Tạo SLA Alert<br/>loại: quote_overdue]
    Q1 -->|No| Q2{Ticket chưa Completed<br/>& completion_due_at < NOW}
    Q2 -->|Yes| AlertComp[Tạo SLA Alert<br/>loại: completion_overdue]

    AlertQuote --> Notify[Notify assignee +<br/>department manager]
    AlertComp --> Notify
    Notify --> Dashboard[Hiển thị trên<br/>màn SLA vi phạm]
```

## Ma trận SLA theo priority (đề xuất)

| Priority | Hệ số | Quote SLA (phút) | Completion SLA (giờ) |
|----------|-------|------------------|---------------------|
| Urgent   | 0.5   | 30               | 24                  |
| High     | 0.75  | 45               | 36                  |
| Normal   | 1.0   | 60               | 48                  |
| Low      | 1.5   | 90               | 72                  |

## Category & phân loại

Ticket có thể gắn nhiều category (sửa chữa điện, nước, vệ sinh, bảo trì...) → dùng để phân tích báo cáo theo loại yêu cầu.

## Business rules

1. **SLA không reset khi reject báo giá** — vẫn tính từ `received_at` gốc để tránh KTV cố tình làm chậm.
2. **SLA tạm dừng khi `Cancelled`** — không vi phạm.
3. **Priority `Urgent`** cần được duyệt bởi manager trước khi gán (tránh lạm dụng).
4. **CSAT rating** chỉ mở cho cư dân khi ticket đã `Accepted` (trước khi `Completed`).
