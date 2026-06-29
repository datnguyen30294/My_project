# 13 — Báo cáo tổng hợp

## Cấu trúc báo cáo

```mermaid
graph TB
    subgraph Reports[Module Báo cáo]
        Overview[Tổng quan<br/>4 trụ chính]
        SLA[SLA & Vi phạm]
        CSAT[Hài lòng KH]
        Revenue[Doanh thu ticket]
        CashFlow[Dòng tiền]
        Commission[Phân bổ hoa hồng]
        Profit[Doanh thu & LN]
        AR[Công nợ phải thu]
        Warranty[Tỷ lệ bảo hành]
    end

    subgraph Sources[Nguồn dữ liệu]
        OgT[OgTicket]
        Ord[Order]
        Rec[Receivable]
        CT[CashTransaction]
        Snap[CommissionSnapshot]
        WR[WarrantyRequest]
    end

    OgT --> SLA
    OgT --> CSAT
    OgT --> Revenue
    OgT --> Warranty
    Ord --> Revenue
    Ord --> Profit
    Rec --> AR
    CT --> CashFlow
    Snap --> Commission
    WR --> Warranty
```

## Báo cáo tổng quan (4 trụ)

```mermaid
flowchart LR
    subgraph Pillar1[SLA]
        S1[Tỷ lệ đúng hạn báo giá]
        S2[Tỷ lệ đúng hạn hoàn thành]
    end

    subgraph Pillar2[Doanh thu]
        R1[Tổng doanh thu kỳ]
        R2[Doanh thu theo project]
    end

    subgraph Pillar3[Hoa hồng]
        C1[Tổng HH phân bổ]
        C2[HH đã chi / chưa chi]
    end

    subgraph Pillar4[Công nợ]
        D1[Tổng outstanding]
        D2[DSO - Days Sales Outstanding]
    end
```

## Báo cáo SLA

```mermaid
flowchart TD
    Query[Query OgTicket theo kỳ] --> Calc{Tính}
    Calc --> M1[Tổng ticket]
    Calc --> M2[Ticket đúng hạn báo giá<br/>quoted_at <= sla_quote_due_at]
    Calc --> M3[Ticket đúng hạn hoàn thành<br/>completed_at <= sla_completion_due_at]
    Calc --> M4[Ticket vi phạm đang active<br/>NOW > due_at & chưa xong]

    M2 --> R1[% đúng hạn báo giá]
    M3 --> R2[% đúng hạn hoàn thành]
    M4 --> R3[Danh sách vi phạm]

    R1 --> GroupBy{Group by}
    GroupBy --> Project[Theo dự án]
    GroupBy --> Dept[Theo phòng ban]
    GroupBy --> Staff[Theo KTV]
    GroupBy --> Category[Theo loại ticket]
```

## Báo cáo CSAT (hài lòng khách hàng)

```mermaid
flowchart TD
    Query[OgTicket<br/>WHERE resident_rating IS NOT NULL] --> Avg[Average rating]
    Avg --> Distribution[Distribution 1-5 sao]
    Avg --> Trend[Xu hướng theo thời gian]

    Query --> Comments[Danh sách comments<br/>resident_rating_comment]
    Comments --> Neg[Lọc comments tiêu cực<br/>rating <= 3]

    Distribution --> ByKTV[Theo KTV]
    Distribution --> ByProject[Theo dự án]

    style Neg fill:#fecaca
```

**Test file liên quan**: `backend/app/Modules/PMC/tests/CsatReportTest.php` (đã có).

## Báo cáo doanh thu

```mermaid
flowchart LR
    Orders[Orders Completed trong kỳ] --> Rev[Doanh thu gốc<br/>SUM total_amount]
    Orders --> Cost[Giá vốn<br/>SUM OrderLine.purchase_price × qty]

    Rev --> Profit[Lợi nhuận gộp<br/>= doanh thu - giá vốn - hoa hồng]
    Cost --> Profit

    Snap[CommissionSnapshot] --> TotalComm[Tổng hoa hồng]
    TotalComm --> Profit

    Profit --> Margin[Margin % = LN / doanh thu]
    Profit --> ByProject[Theo dự án]
```

## Báo cáo hoa hồng

```mermaid
flowchart TD
    Snapshots[OrderCommissionSnapshots<br/>trong kỳ] --> Group{Group by}

    Group --> GP[Theo Platform<br/>5% + 1k × số đơn]
    Group --> GV[Theo VH]
    Group --> GB[Theo BQT]
    Group --> GM[Theo Management<br/>cascade xuống Dept + Staff]

    GM --> GDept[Theo Department]
    GDept --> GStaff[Theo Staff]

    GStaff --> Status{Payout?}
    Status --> Unpaid[Chưa chi<br/>payout_status=Unpaid]
    Status --> Paid[Đã chi<br/>payout_status=Paid + paid_out_at]
```

## Báo cáo công nợ (Aging)

```mermaid
flowchart LR
    Receivables[Receivables WHERE status ≠ Completed/WrittenOff] --> Aging{Phân loại aging}

    Aging --> B0[Chưa đến hạn]
    Aging --> B1[1-7 ngày]
    Aging --> B2[8-30 ngày]
    Aging --> B3[31-60 ngày]
    Aging --> B4[>60 ngày]

    B3 --> Alert[Cảnh báo]
    B4 --> Escalate[Escalation]

    Receivables --> DSO[DSO = outstanding / avg_daily_revenue]

    style B4 fill:#fecaca
    style B3 fill:#fed7aa
```

## Báo cáo dòng tiền (Cash Flow)

```mermaid
flowchart TD
    Period[Kỳ báo cáo] --> Query[CashTransaction trong kỳ]

    Query --> In[Inflows]
    Query --> Out[Outflows]

    In --> I1[Manual Topup]
    In --> I2[Receivable Collection]

    Out --> O1[Manual Withdraw]
    Out --> O2[Customer Refund]
    Out --> O3[Commission Payout]
    Out --> O4[Advance Payment]

    In --> NetCF[Net Cash Flow<br/>= Inflows - Outflows]
    Out --> NetCF

    NetCF --> Balance[Số dư cuối kỳ<br/>= opening + NetCF]
```

## Báo cáo tỷ lệ bảo hành

```mermaid
flowchart LR
    Period[Kỳ thống kê] --> Total[Tổng ticket Completed]
    Period --> Warranty[Ticket có WarrantyRequest]

    Warranty --> Ratio[Tỷ lệ bảo hành %<br/>= warranty / total × 100]

    Ratio --> ByKTV[Theo KTV]
    Ratio --> ByCategory[Theo loại]
    Ratio --> ByProject[Theo project]

    style Ratio fill:#fef3c7
```

Kết hợp với CSAT:

```mermaid
quadrantChart
    title Chất lượng dịch vụ (CSAT × Warranty)
    x-axis Low CSAT --> High CSAT
    y-axis High Warranty --> Low Warranty
    quadrant-1 "Xuất sắc"
    quadrant-2 "Cần CSAT"
    quadrant-3 "Cần cải thiện toàn diện"
    quadrant-4 "Cần giảm bảo hành"
    KTV A: [0.85, 0.9]
    KTV B: [0.7, 0.4]
    KTV C: [0.45, 0.65]
    KTV D: [0.3, 0.2]
```

## Báo cáo năng lực nhân sự

```mermaid
flowchart TD
    Account[Account] --> Metrics{Metrics}
    Metrics --> M1[Số ticket xử lý trong kỳ]
    Metrics --> M2[CSAT trung bình]
    Metrics --> M3[Tỷ lệ đúng SLA]
    Metrics --> M4[Tỷ lệ bảo hành]
    Metrics --> M5[Doanh thu mang lại]
    Metrics --> M6[Hoa hồng nhận]

    M1 --> Score[capability_rating<br/>trên Account]
    M2 --> Score
    M3 --> Score
    M4 --> Score
```

