# 01 — Tiếp nhận ticket

## Nghiệp vụ

Cư dân phát sinh yêu cầu qua 1 trong 4 kênh → vào **Platform Ticket Pool** (hàng chờ chung) → CSKH/Điều phối **claim** → sinh **OgTicket** trong PMC (kèm tự động tạo/gắn Customer theo `phone`).

## Luồng tiếp nhận

```mermaid
flowchart TD
    Start([Cư dân phát sinh yêu cầu])

    Start --> Channel{Kênh nào?}
    Channel -->|App cư dân| App[Portal App]
    Channel -->|Website| Web[Form web]
    Channel -->|Gọi điện| Phone[CSKH nhập tay]
    Channel -->|Trực tiếp| Direct[Nhập tại quầy]

    App --> Pool[(Platform Ticket Pool)]
    Web --> Pool
    Phone --> Pool
    Direct --> Pool

    Pool --> Dispatch{Điều phối xem pool}
    Dispatch -->|Chọn claim| Claim[POST /og-tickets/claim]

    Claim --> CustCheck{Customer đã có<br/>theo phone?}
    CustCheck -->|Có| UseExisting[Dùng Customer hiện có<br/>cập nhật last_contacted_at]
    CustCheck -->|Chưa| CreateCust[Tạo Customer mới<br/>find-or-create]

    UseExisting --> CreateOT
    CreateCust --> CreateOT

    CreateOT[Tạo OgTicket<br/>status = Received]
    CreateOT --> Segment[Tạo LifecycleSegment đầu tiên]
    Segment --> Done([OgTicket sẵn sàng xử lý])

    Dispatch -->|Release| Release[PUT /og-tickets/.../release<br/>ticket về pool]
```

## Sequence: Claim ticket

```mermaid
sequenceDiagram
    participant User as CSKH/Điều phối
    participant FE as Frontend
    participant API as PMC API
    participant ExtSvc as TicketExternalService
    participant Platform as Platform Module
    participant DB as DB

    User->>FE: Mở màn Ticket Pool
    FE->>API: GET /og-tickets/pool
    API->>ExtSvc: getAvailableTickets()
    ExtSvc->>Platform: query Ticket WHERE status=open
    Platform-->>ExtSvc: danh sách ticket
    ExtSvc-->>API: tickets
    API-->>FE: render list

    User->>FE: Click "Claim" ticket X
    FE->>API: POST /og-tickets/claim {ticket_id, customer data}
    API->>ExtSvc: claimTicket(ticket_id)
    ExtSvc->>Platform: update Ticket.status=claimed
    API->>DB: Customer::firstOrCreate([phone])
    API->>DB: OgTicket::create + LifecycleSegment
    DB-->>API: OgTicket
    API-->>FE: 201 Created
```

## Business rules quan trọng

1. **1 ticket Platform = 1 OgTicket PMC** (không claim 2 lần)
2. **Customer.phone unique tenant-wide** — 2 ticket cùng số điện thoại sẽ gắn về cùng Customer
3. **Release ticket** → `OgTicket.status = Cancelled`, Ticket về pool với status `open`
4. Khi claim, SLA (`sla_quote_due_at`) tự động tính từ `received_at + setting.og_ticket.sla_quote_minutes`
