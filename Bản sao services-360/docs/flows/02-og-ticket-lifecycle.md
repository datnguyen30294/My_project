# 02 — OgTicket Lifecycle

## 11 trạng thái & workflow

```mermaid
stateDiagram-v2
    [*] --> Received : claim từ pool

    Received --> Assigned : gán assignee
    Received --> Cancelled : hủy

    Assigned --> Surveying : KTV bắt đầu khảo sát
    Assigned --> Cancelled : hủy

    Surveying --> Quoted : tạo Quote active
    Surveying --> Cancelled : hủy

    Quoted --> Approved : cư dân duyệt Quote
    Quoted --> Rejected : cư dân từ chối
    Quoted --> Cancelled : hủy

    Rejected --> Quoted : tạo revision Quote (v2, v3...)
    Rejected --> Cancelled : khách bỏ cuộc

    Approved --> Ordered : tạo Order từ Quote
    Approved --> Cancelled : hủy

    Ordered --> InProgress : KTV bắt đầu thi công
    Ordered --> Cancelled : hủy

    InProgress --> Accepted : có AcceptanceReport
    InProgress --> Cancelled : hủy

    Accepted --> Completed : đóng ticket (thu tiền xong)

    Completed --> [*]
    Cancelled --> [*]
```

## Bảng điều kiện chuyển trạng thái

| Từ → Đến | Điều kiện | Ai được phép |
|----------|-----------|--------------|
| Received → Assigned | có ít nhất 1 assignee | Admin, Điều phối |
| Assigned → Surveying | có lịch khảo sát (hoặc KTV check-in) | Admin, KTV |
| Surveying → Quoted | tồn tại `Quote.is_active=true` với status `Sent`+ | Admin, KTV |
| Quoted → Approved | `Quote.status = Approved` (resident đã duyệt) | Admin, Cư dân (portal) |
| Quoted → Rejected | `Quote.status = ResidentRejected` | Admin, Cư dân |
| Rejected → Quoted | tạo Quote mới (revision) | Admin, KTV |
| Approved → Ordered | có `Order` liên kết Quote | Admin |
| Ordered → InProgress | Order chuyển `Confirmed → InProgress` | Admin, KTV |
| InProgress → Accepted | Order liên kết chuyển `Accepted`; `AcceptanceReport` cần có bằng chứng (confirm qua share token hoặc file scan đã ký — không bắt buộc đồng thời với transition) | Admin, KTV |
| Accepted → Completed | `Receivable.status ∈ {Paid, Completed}` | Admin, Kế toán |
| `*` → Cancelled | bất kỳ trạng thái chưa Completed | Admin |

## Quyền theo role

```mermaid
flowchart LR
    subgraph Admin
        AdmAll[Tất cả transitions]
    end
    subgraph Dispatch[Điều phối]
        DispAssign[Received → Assigned]
        DispReassign[Đổi assignee]
    end
    subgraph Tech[Kỹ thuật viên]
        TechSurvey[Assigned → Surveying]
        TechQuote[Surveying → Quoted]
        TechWork[Ordered → InProgress → Accepted]
    end
    subgraph Resident[Cư dân portal]
        ResApprove[Quoted → Approved]
        ResReject[Quoted → Rejected]
        ResRate[Accepted: cho sao CSAT]
    end
    subgraph Account[Kế toán]
        AccComplete[Accepted → Completed]
    end
```

## Lifecycle segment — audit chi tiết

Mỗi lần chuyển trạng thái sẽ đóng segment cũ (`ended_at`) và mở segment mới.

```mermaid
gantt
    title OgTicket lifecycle (ví dụ)
    dateFormat YYYY-MM-DD HH:mm
    axisFormat %d/%m %H:%M

    section Timeline
    Received      :a1, 2026-04-01 09:00, 30m
    Assigned      :a2, after a1, 2h
    Surveying     :a3, after a2, 4h
    Quoted        :a4, after a3, 1d
    Approved      :a5, after a4, 1h
    Ordered       :a6, after a5, 30m
    InProgress    :a7, after a6, 2d
    Accepted      :a8, after a7, 2h
    Completed     :a9, after a8, 1d
```

