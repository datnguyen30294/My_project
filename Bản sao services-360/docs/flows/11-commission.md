# 11 — Hoa hồng (Commission)

## Kiến trúc 3-tầng

```mermaid
graph TD
    subgraph Tier1[Tầng 1: Party Rules - chia 4 bên]
        Platform[Platform 5% + 1000đ<br/>CỐ ĐỊNH]
        VH[OperatingCompany VH<br/>% hoặc tiền cứng]
        BQT[BoardOfDirectors BQT<br/>% hoặc tiền cứng]
        Mgmt[Management BQL<br/>% hoặc tiền cứng]
    end

    subgraph Tier2[Tầng 2: Dept Rules - chia BQL xuống phòng ban]
        D1[Dept Kỹ thuật]
        D2[Dept CSKH]
        D3[Dept Kinh doanh]
    end

    subgraph Tier3[Tầng 3: Staff Rules - chia Dept xuống nhân viên]
        S1[Staff A]
        S2[Staff B]
        S3[Staff C]
    end

    Mgmt --> D1
    Mgmt --> D2
    Mgmt --> D3
    D1 --> S1
    D1 --> S2
    D2 --> S3

    style Platform fill:#fde68a
    style Mgmt fill:#bfdbfe
```

## `value_type` = Percent / Fixed / Both

```mermaid
flowchart TD
    Order[Order total = 10M] --> Rule{Rule value_type?}

    Rule -->|Percent| P[amount = total × percent<br/>ví dụ 5% = 500k]
    Rule -->|Fixed| F[amount = value_fixed<br/>ví dụ 1000đ cứng]
    Rule -->|Both| B[amount = total × percent + value_fixed<br/>ví dụ 5% + 1000đ = 501k]

    style B fill:#fde68a
```

**Case đặc biệt Platform**: luôn là `Both` với `percent=5%, value_fixed=1000đ`.

## Flow resolve commission khi đóng kỳ

```mermaid
sequenceDiagram
    participant API as ClosingPeriodService
    participant Config as ProjectCommissionConfig
    participant DB

    API->>Config: Load party rules<br/>(Platform, VH, BQT, Management)
    loop Mỗi PartyRule
        API->>API: amount = calc(order.total, rule)
        API->>DB: Snapshot<br/>(recipient_type=Platform/VH/BQT/Management)
    end

    Note over API,DB: Management snapshot là "intermediary"<br/>cần phân tiếp xuống Dept + Staff

    API->>Config: Load dept rules (theo config_id)
    loop Mỗi DeptRule
        API->>API: dept_amount = calc(management_total, dept_rule)
        API->>DB: Snapshot<br/>(recipient_type=Department)

        API->>Config: Load staff rules của dept
        loop Mỗi StaffRule
            API->>API: staff_amount = calc(dept_amount, staff_rule)
            API->>DB: Snapshot<br/>(recipient_type=Staff, account_id=X)
        end
    end
```

## Recipient type hierarchy

```mermaid
graph TB
    Platform[Platform<br/>Terminal]
    VH[OperatingCompany<br/>Terminal]
    BQT[BoardOfDirectors<br/>Terminal]
    Mgmt[Management<br/>Intermediary]
    Dept[Department<br/>Intermediary]
    Staff[Staff<br/>Terminal]

    Mgmt --> Dept --> Staff

    classDef terminal fill:#d1fae5
    classDef intermediary fill:#fef3c7
    class Platform,VH,BQT,Staff terminal
    class Mgmt,Dept intermediary
```

- **Terminal**: được chi trả trực tiếp (có payout)
- **Intermediary**: chỉ để phân cấp nội bộ, không chi trả trực tiếp

## Override per order

```mermaid
flowchart LR
    subgraph Default[Dùng config mặc định]
        Cfg[ProjectCommissionConfig] --> Snap1[Snapshot tự resolve]
    end

    subgraph Override[Order có override]
        OCO[OrderCommissionOverride<br/>cho recipient cụ thể] --> Snap2[Snapshot dùng override]
    end

    OCO -.->|recipient_type + account_id| Match[Match snapshot nào<br/>thay thế]

    style Snap2 fill:#fecaca
```

**Use case**: dự án đặc biệt, muốn trả hoa hồng hơn bình thường cho 1 KTV xuất sắc.

## Ví dụ tính hoa hồng (Order 10.000.000đ)

```mermaid
flowchart TD
    O[Order total = 10.000.000đ]

    O --> P[Platform<br/>5% + 1.000đ<br/>= 501.000đ]
    O --> V[VH<br/>10%<br/>= 1.000.000đ]
    O --> B[BQT<br/>5%<br/>= 500.000đ]
    O --> M[Management<br/>20%<br/>= 2.000.000đ]

    M --> D1[Dept Kỹ thuật<br/>60% của BQL<br/>= 1.200.000đ]
    M --> D2[Dept CSKH<br/>40% của BQL<br/>= 800.000đ]

    D1 --> S1[Staff A<br/>50% của Dept KT<br/>= 600.000đ]
    D1 --> S2[Staff B<br/>50% của Dept KT<br/>= 600.000đ]
    D2 --> S3[Staff C<br/>100% của Dept CSKH<br/>= 800.000đ]

    P --> Sum[Tổng HH chi = 4.001.000đ]
    V --> Sum
    B --> Sum
    S1 --> Sum
    S2 --> Sum
    S3 --> Sum

    Profit[Lãi = 10M - 4M - giá vốn = ...]
    Sum --> Profit
```

## Payout status

```mermaid
stateDiagram-v2
    [*] --> Unpaid : snapshot tạo khi đóng kỳ
    Unpaid --> Paid : manager approve payout<br/>+ CashTransaction
    Paid --> [*]
```

## Business rules quan trọng

1. **Platform luôn cố định 5% + 1.000đ** (`Both` value_type) — không cho cấu hình lại trong UI.
2. **Resolve hoa hồng chỉ chạy 1 lần khi Close kỳ** — sinh snapshot bất biến; sau đó sửa config dự án không ảnh hưởng kỳ đã đóng.
3. **Chỉ recipient `terminal`** (Platform / OperatingCompany / BoardOfDirectors / Staff) mới có payout. `Management`/`Department` là intermediary, không chi trực tiếp.
4. **Override per order** thay thế recipient cụ thể — match theo `recipient_type + account_id`.
5. **Snapshot Paid** thì không cho reopen kỳ tương ứng.
