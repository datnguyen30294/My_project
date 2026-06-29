# 10 — Kỳ chốt phí (ClosingPeriod)

## Khác biệt với "kỳ kế toán" truyền thống

| Kỳ kế toán truyền thống | ClosingPeriod TNP |
|------------------------|-------------------|
| Theo tháng dương lịch cố định | Linh hoạt, per project, per khoảng thời gian |
| Tất cả giao dịch trong tháng tự vào kỳ | Chủ động chọn Order nào đưa vào kỳ |
| 1 kỳ toàn công ty | Nhiều kỳ song song (mỗi project có kỳ riêng) |

## Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Open : tạo kỳ mới (per project)

    Open --> Open : add/remove orders
    Open --> Closed : POST close

    Closed --> Open : POST reopen (hiếm, cần approval)
    Closed --> [*] : archived sau thời gian
```

## Flow đóng kỳ

```mermaid
flowchart TD
    Create["POST /closing-periods<br/>{project_id, name, period_start, period_end}"] --> Open[ClosingPeriod.status = Open]

    Open --> List["GET /closing-periods/{id}/eligible-orders<br/>Orders trong khoảng thời gian + status Accepted+"]

    List --> AddMulti["POST /closing-periods/{id}/add-orders<br/>{order_ids[]}"]

    AddMulti --> CPO[Tạo ClosingPeriodOrder<br/>từng order]

    CPO --> Ready[Kỳ đã gom đủ orders]

    Ready --> Close["POST /closing-periods/{id}/close"]
    Close --> Freeze[Freeze tất cả Orders<br/>trong kỳ]
    Freeze --> Snapshot[Tạo OrderCommissionSnapshot<br/>cho từng order × người nhận]
    Snapshot --> SaveAmounts[Save frozen_receivable_amount<br/>+ frozen_commission_total trên CPO]
    SaveAmounts --> Closed[ClosingPeriod.status = Closed<br/>closed_at = NOW<br/>closed_by = user]
```

## Snapshot cho từng recipient

Khi close kỳ, resolve cấu hình hoa hồng (ProjectCommissionConfig) thành các snapshot cụ thể:

```mermaid
flowchart TD
    Order[Order total=10M] --> Resolve{Resolve CommissionConfig}
    Resolve --> P1[Platform 5% + 1k = 501k]
    Resolve --> P2[OperatingCompany 10% = 1M]
    Resolve --> P3[BoardOfDirectors 5% = 500k]
    Resolve --> P4[Management cascade...]

    P4 --> D1[Dept Kỹ thuật 60% = 1.2M]
    D1 --> S1[Staff A 50% = 600k]
    D1 --> S2[Staff B 50% = 600k]

    P4 --> D2[Dept CSKH 40% = 800k]
    D2 --> S3[Staff C 100% = 800k]

    P1 --> Snap[OrderCommissionSnapshot]
    P2 --> Snap
    P3 --> Snap
    S1 --> Snap
    S2 --> Snap
    S3 --> Snap

    style Snap fill:#dbeafe
```

Mỗi row snapshot ghi nhận:
- **recipient_type**: Platform / OperatingCompany / BoardOfDirectors / Management / Department / Staff
- **account_id**: nếu là Staff cụ thể
- **recipient_name**: tên để hiển thị báo cáo
- **amount**: số tiền cụ thể tại thời điểm chốt
- **resolved_from**: JSON trace cách tính (để audit)
- **payout_status**: Unpaid → Paid

## Payout (chi hoa hồng)

```mermaid
sequenceDiagram
    participant Mgr as Manager
    participant API
    participant DB

    Mgr->>API: List unpaid snapshots
    API-->>Mgr: danh sách

    Mgr->>API: POST payout /snapshots/{id}/pay
    API->>DB: Snapshot.payout_status = Paid
    API->>DB: Snapshot.paid_out_at = NOW
    API->>DB: CashTransaction<br/>(category=CommissionPayout, outflow)
```

## Reopen kỳ (hiếm)

```mermaid
flowchart LR
    Closed[Kỳ Closed] --> Req[Request reopen<br/>lý do + approval]
    Req --> CheckPaid{Có snapshot<br/>đã Paid?}
    CheckPaid -->|Yes| Block[Không cho reopen<br/>đã chi tiền rồi]
    CheckPaid -->|No| Reopen["POST /close/{id}/reopen"]
    Reopen --> Unfreeze[Unfreeze orders<br/>xóa snapshots<br/>status = Open]
```

## Business rules quan trọng

1. **1 Order chỉ thuộc 1 ClosingPeriod tại 1 thời điểm** — sau khi add vào kỳ Open, không thể add lại vào kỳ khác.
2. **Khi Close**: tự freeze tất cả Order trong kỳ (`isFinanciallyLocked = true`), tạo snapshot, lưu `frozen_receivable_amount` + `frozen_commission_total`.
3. **Order đã frozen** không cho PUT/DELETE/transition — kể cả admin (cần unlock kỳ trước).
4. **Reopen kỳ**: chỉ được khi **không có snapshot nào đã `Paid`** — lý do: chi tiền rồi không reverse được tự động.
5. **Delete kỳ Open**: chỉ được khi chưa có Order nào trong kỳ.
