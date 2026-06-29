# Báo cáo Doanh thu & Lợi nhuận - Đặc tả kỹ thuật Backend

> Module: `PMC/Report/RevenueProfit` | Ngày tạo: 2026-04-14 | Trạng thái: Draft (v2 — đồng bộ công thức với Commission Report)

## 1. Tổng quan

Báo cáo Doanh thu & Lợi nhuận là tính năng **read-only**, tổng hợp doanh thu và lợi nhuận gộp ước tính từ góc nhìn **công ty vận hành**. Báo cáo phục vụ BGĐ theo dõi xu hướng kinh doanh theo kỳ, loại dịch vụ và dự án. Không thay thế báo cáo kế toán chuẩn.

`Report` là submodule của PMC. `RevenueProfit` là submodule con, cùng cấp với `Sla`, `CashFlow`, `Commission`, `RevenueTicket`. Vì cùng PMC → import trực tiếp Model/Repository, **không cần ExternalService**.

**Định nghĩa LN gộp (đồng bộ với Commission Report):**

```
gross_profit = revenue
             − external_commission   // HH trả cho BQT + BQL + Platform, KHÔNG tính VH
             − material_cost         // purchase_price × quantity trên line_type='material'
```

> Số liệu `gross_profit` ở báo cáo này **phải khớp** với `estimated_gross_profit` của Commission Report khi cùng filter.
>
> Hệ thống hiện KHÔNG có khuyến mãi/KM. Doanh thu = `frozen_receivable_amount` của các đơn trong kỳ chốt.

**Khác biệt với các report liên quan:**

| Report | Trọng tâm | Gross profit |
|--------|-----------|--------------|
| `RevenueTicket` | Ticket, category, nhân viên | Không tính |
| `Commission` | Phân bổ HH 4 bên | Có (field `estimated_gross_profit`) |
| `RevenueProfit` | Doanh thu, chi phí ước, margin | Có — trọng tâm báo cáo |

**Data source chính:**

| Bảng | Mục đích |
|------|----------|
| `closing_periods` | Scope kỳ chốt: `status`, `period_start`, `period_end`, `project_id` |
| `closing_period_orders` | Liên kết đơn ↔ kỳ, `frozen_receivable_amount` (doanh thu đã snapshot) |
| `orders` | Đơn: `id`, `completed_at`, `quote_id` |
| `order_lines` | Chi tiết line: `unit_price`, `purchase_price`, `quantity`, `line_type`, `reference_id` |
| `order_commission_snapshots` | HH phân bổ: `recipient_type`, `amount` |
| `catalog_items` | Liên kết `service_category_id` cho line dịch vụ |
| `service_categories` | Nhãn nhóm dịch vụ cho donut chart |
| `projects` | Tên dự án (từ `closing_periods.project_id`) |

## 2. Entities

**Không tạo entity/table mới.** Feature này đọc và aggregate từ các bảng đã có.

## 3. API Endpoints

| Action | Method | URL | Request Class | Mô tả |
|--------|--------|-----|---------------|-------|
| Summary | GET | `/api/v1/pmc/reports/revenue-profit/summary` | `RevenueProfitReportRequest` | KPI + P&L bridge + MoM/QoQ + insights |
| Monthly trend | GET | `/api/v1/pmc/reports/revenue-profit/monthly` | `RevenueProfitReportRequest` | 6 tháng gần nhất (hoặc theo date range) |
| By project | GET | `/api/v1/pmc/reports/revenue-profit/by-project` | `RevenueProfitReportRequest` | Bảng đóng góp & cảnh báo margin |
| By service category | GET | `/api/v1/pmc/reports/revenue-profit/by-service-category` | `RevenueProfitReportRequest` | Cơ cấu LN theo nhóm dịch vụ (donut) |

> Tất cả endpoint dùng chung `RevenueProfitReportRequest`.

## 4. Validation Rules

### RevenueProfitReportRequest

| Field | Rules | Message (VI) |
|-------|-------|--------------|
| `closing_period_id` | `nullable`, `integer`, `Rule::exists('closing_periods','id')->whereNull('deleted_at')` | Kỳ chốt không tồn tại |
| `project_id` | `nullable`, `integer`, `Rule::exists('projects','id')->whereNull('deleted_at')` | Dự án không tồn tại |
| `date_from` | `nullable`, `date_format:Y-m-d` | Ngày bắt đầu không đúng định dạng |
| `date_to` | `nullable`, `date_format:Y-m-d`, `after_or_equal:date_from` | Ngày kết thúc phải >= ngày bắt đầu |

**Ưu tiên filter** (đồng bộ Commission Report):

1. `closing_period_id` → 1 kỳ cụ thể, các filter khác bỏ qua. Cho phép kỳ mở để preview.
2. `date_from/date_to` (+ `project_id` nullable) → lấy các kỳ `closed` có `period_end >= date_from AND period_start <= date_to`.
3. Không truyền gì → **30 ngày gần nhất** (đồng bộ với Commission Report).

## 5. Business Rules

### 5.1 Scope dữ liệu

- **Chỉ đọc từ kỳ chốt đã đóng** (`closing_periods.status = 'closed'`). Kỳ mở chưa chốt → loại. Exception: truyền `closing_period_id` cụ thể cho phép preview kỳ mở.
- Orders trong scope = các đơn có trong `closing_period_orders.closing_period_id IN (filtered_period_ids)`.
- `project_id` filter → áp trên `closing_periods.project_id`.

> **Không còn "live mode"** như v1. Báo cáo luôn dựa trên kỳ chốt để đảm bảo số liệu khớp với Commission Report.

### 5.2 Định nghĩa doanh thu

| Khái niệm | Công thức |
|-----------|-----------|
| **Doanh thu** (`revenue`) | `SUM(closing_period_orders.frozen_receivable_amount)` — số tiền thực tế thu theo kỳ |

> `frozen_receivable_amount` = số thu thực tế đã snapshot khi thêm đơn vào kỳ → đồng bộ với nguồn revenue của Commission Report.
> Hệ thống hiện không có khuyến mãi/KM → không tách doanh thu trước/sau KM.

### 5.3 Định nghĩa chi phí ước (Estimated Cost)

**External commission (`external_commission`):**

```sql
SELECT COALESCE(SUM(amount), 0)
FROM order_commission_snapshots
WHERE closing_period_id IN (:filtered_period_ids)
  AND recipient_type IN ('board_of_directors', 'management', 'platform')
```

> **KHÔNG** tính HH `operating_company` — phần đó công ty VH giữ lại, không phải dòng chi ra ngoài.

**Material cost (`material_cost`):**

```sql
SELECT COALESCE(SUM(purchase_price * quantity), 0)
FROM order_lines
WHERE order_id IN (
  SELECT order_id FROM closing_period_orders WHERE closing_period_id IN (:filtered_period_ids)
)
AND line_type = 'material'
AND purchase_price IS NOT NULL
```

> Đọc live từ `order_lines.purchase_price × quantity`. An toàn vì đơn đã khoá tài chính (`Order::isFinanciallyLocked()`) sau khi vào kỳ chốt → live value = snapshot de facto. Không cần column frozen.

**Estimated cost:**

```
estimated_cost = external_commission + material_cost
```

### 5.4 Định nghĩa lợi nhuận gộp

**Công thức (khớp Commission Report):**

```
gross_profit   = revenue − estimated_cost
               = SUM(frozen_receivable_amount) − external_commission − material_cost
margin_percent = gross_profit / revenue × 100   (1 decimal, 0 nếu revenue=0)
```

> Công thức này **bắt buộc** giống `CommissionReportRepository::getEstimatedGrossProfit()`. Nên reuse helper hoặc viết test cross-check giữa 2 report.

**Margin alert threshold (`margin_alert_threshold`):**
- Hardcode phase 1: `31.0`
- Dùng cho badge cảnh báo ở bảng by-project
- Có thể đưa vào `config('report.margin_alert_threshold')` sau này

### 5.5 KPI Summary

Endpoint `summary` trả:

| Field | Nguồn / Công thức |
|-------|-------------------|
| `period_label` | Theo filter (giống Commission Report) |
| `revenue` | Section 5.2 |
| `external_commission` | Section 5.3 |
| `material_cost` | Section 5.3 |
| `estimated_cost` | `external_commission + material_cost` |
| `gross_profit` | Section 5.4 |
| `margin_percent` | Section 5.4 |
| `margin_alert_threshold` | Section 5.4 (hardcode 31.0) |
| `mom_revenue_percent` | `(last_month.revenue − prev_month.revenue) / prev_month.revenue × 100` (1 decimal). 0 nếu prev = 0 |
| `mom_profit_percent` | Tương tự cho profit |
| `qoq_revenue_percent` | `(this_quarter − prev_quarter) / prev_quarter × 100` |
| `qoq_profit_percent` | Tương tự |
| `avg_margin_6_months` | Trung bình `margin_percent` của 6 tháng gần nhất trong dataset |
| `last_month_label` | VD: `"T3"` — tháng cuối trong series |
| `prev_month_label` | VD: `"T2"` — tháng liền trước |
| `insights[]` | Tối đa 3 bullet gợi ý (Section 5.8) |

**MoM / QoQ tính theo `closing_periods.period_end`:**
- Group kỳ theo `YEAR(period_end), MONTH(period_end)`.
- MoM = so 2 tháng gần nhất có dữ liệu.
- QoQ = gộp theo quý (1-3, 4-6, 7-9, 10-12) → so 2 quý gần nhất.

### 5.6 Monthly trend

Endpoint `monthly` trả 6 tháng gần nhất (hoặc range filter).

| Field | Nguồn |
|-------|-------|
| `month` | `"T{n}"` (VD: "T10") — tháng của `period_end` |
| `year_month` | `"YYYY-MM"` — để sort đúng |
| `revenue` | `SUM(frozen_receivable_amount)` các kỳ trong tháng |
| `external_commission` | SUM commission BQT+BQL+Platform các kỳ trong tháng |
| `material_cost` | SUM material cost cho các đơn trong các kỳ tháng đó |
| `estimated_cost` | `external_commission + material_cost` |
| `gross_profit` | `revenue − estimated_cost` |
| `margin_percent` | `gross_profit / revenue × 100` (1 decimal) |

- Sắp xếp: `year_month ASC`.
- Tháng không có kỳ chốt → row với `revenue = "0.00"`, `margin_percent = 0`.

### 5.7 By Project

Endpoint `by-project` trả bảng theo dự án.

**Scope:** các dự án có ≥ 1 kỳ chốt trong filter.

| Field | Công thức |
|-------|-----------|
| `project_id` | `closing_periods.project_id` |
| `project_name` | `projects.name` |
| `revenue` | `SUM(frozen_receivable_amount)` các đơn của project trong filter |
| `external_commission` | Section 5.3 giới hạn orders thuộc project |
| `material_cost` | Section 5.3 giới hạn orders thuộc project |
| `estimated_cost` | `external_commission + material_cost` |
| `gross_profit` | `revenue − estimated_cost` |
| `margin_percent` | `gross_profit / revenue × 100` (1 decimal) |
| `share_of_revenue_percent` | `revenue / summary.revenue × 100` (1 decimal) |
| `margin_alert` | `margin_percent < margin_alert_threshold` |

**Sắp xếp:** `revenue DESC`.

**Tổng hợp khớp:**
- `SUM(by-project.revenue) = summary.revenue`
- `SUM(by-project.gross_profit) = summary.gross_profit`

### 5.8 By Service Category

Endpoint `by-service-category` trả cơ cấu LN gộp theo nhóm dịch vụ (cho donut chart).

**Bước 1 — Tính "contribution margin" mức line (chưa trừ commission):**

Với mỗi `order_line` của orders trong filter:

```
line_revenue      = unit_price × quantity
line_material     = (line_type = 'material' AND purchase_price IS NOT NULL)
                    ? purchase_price × quantity : 0
line_contribution = line_revenue − line_material
```

**Bước 2 — Nhóm theo category:**

| `line_type` | Nhóm (category_label) |
|-------------|------------------------|
| `service` có `catalog_items.service_category_id` | Tên `service_categories.name` |
| `service` không có category | `"Dịch vụ chưa phân loại"` |
| `material` | `"Vật tư"` |
| `adhoc` | `"Dịch vụ tùy chọn"` |

**Bước 3 — Điều chỉnh khớp tổng:**

Vì commission không gắn với từng line, cần add 1 slice "Điều chỉnh nội bộ" để tổng slices = `summary.gross_profit`:

```
sum_line_contribution = SUM(line_contribution) tất cả nhóm
adjustment            = summary.gross_profit − sum_line_contribution
                      ≈ −external_commission (vì material đã trừ ở mức line)
```

→ Thêm slice `"Điều chỉnh nội bộ / tập trung"` với `profit = adjustment`. Giá trị này thường âm.

**Mỗi dòng response:**

| Field | Nguồn |
|-------|-------|
| `category_key` | slug ổn định (service_category.id khi có, slug(label) ngược lại; adjustment = `"internal-adjustment"`) |
| `category_label` | Tên nhóm |
| `profit` | `SUM(line_contribution)` hoặc `adjustment` |
| `share_percent` | `profit / summary.gross_profit × 100` (1 decimal, có thể âm) |

**Sắp xếp:** `profit DESC`, slice adjustment luôn ở cuối (không sort).

**Tổng hợp khớp:** `SUM(by-service-category.profit) = summary.gross_profit`.

### 5.9 Insights (tối đa 3 bullet)

`summary.insights[]` gợi ý text cho FE hiển thị alert:

- **Insight 1 (xu hướng MoM):** `"Doanh thu tháng {last} {tăng|giảm} {x.x}% so với tháng {prev}."`
- **Insight 2 (margin alert):** Đếm số project có `margin_alert = true` → `"{N} dự án đang dưới ngưỡng margin {threshold}%."` (chỉ xuất hiện khi N > 0)
- **Insight 3 (top project):** `"Dự án đóng góp doanh thu cao nhất: {top_project} ({share}%)."`

### 5.10 Period label (đồng bộ Commission Report)

- `"Kỳ: {closing_period.name}"` — khi lọc theo `closing_period_id`.
- `"{from} - {to}"` format `d/m/Y` — khi có date range.
- `"30 ngày gần nhất"` — default.

## 6. Resource Output

### 6.1 Summary Response

```json
{
  "success": true,
  "data": {
    "period_label": "01/03/2026 - 31/03/2026",
    "revenue": "4820000000.00",
    "external_commission": "1100000000.00",
    "material_cost": "2110000000.00",
    "estimated_cost": "3210000000.00",
    "gross_profit": "1610000000.00",
    "margin_percent": 33.4,
    "margin_alert_threshold": 31.0,
    "mom_revenue_percent": 5.6,
    "mom_profit_percent": 6.2,
    "qoq_revenue_percent": 4.2,
    "qoq_profit_percent": 3.8,
    "avg_margin_6_months": 33.2,
    "last_month_label": "T3",
    "prev_month_label": "T2",
    "insights": [
      "Doanh thu tháng T3 tăng 5.6% so với tháng T2.",
      "1 dự án đang dưới ngưỡng margin 31%.",
      "Dự án đóng góp doanh thu cao nhất: Vinhomes Ocean Park (39.8%)."
    ]
  }
}
```

### 6.2 Monthly Response

```json
{
  "success": true,
  "data": [
    {
      "month": "T10",
      "year_month": "2025-10",
      "revenue": "1420000000.00",
      "external_commission": "320000000.00",
      "material_cost": "615000000.00",
      "estimated_cost": "935000000.00",
      "gross_profit": "485000000.00",
      "margin_percent": 34.2
    }
  ]
}
```

### 6.3 By-Project Response

```json
{
  "success": true,
  "data": [
    {
      "project_id": 1,
      "project_name": "Vinhomes Ocean Park",
      "revenue": "1920000000.00",
      "external_commission": "430000000.00",
      "material_cost": "842000000.00",
      "estimated_cost": "1272000000.00",
      "gross_profit": "648000000.00",
      "margin_percent": 33.8,
      "share_of_revenue_percent": 39.8,
      "margin_alert": false
    },
    {
      "project_id": 3,
      "project_name": "The Sun Avenue",
      "revenue": "890000000.00",
      "external_commission": "210000000.00",
      "material_cost": "404000000.00",
      "estimated_cost": "614000000.00",
      "gross_profit": "276000000.00",
      "margin_percent": 31.0,
      "share_of_revenue_percent": 18.5,
      "margin_alert": true
    }
  ]
}
```

### 6.4 By-Service-Category Response

```json
{
  "success": true,
  "data": [
    { "category_key": "bao-tri", "category_label": "Bảo trì — bảo dưỡng", "profit": "1512000000.00", "share_percent": 93.9 },
    { "category_key": "vat-tu", "category_label": "Vật tư", "profit": "198000000.00", "share_percent": 12.3 },
    { "category_key": "internal-adjustment", "category_label": "Điều chỉnh nội bộ / tập trung", "profit": "-100000000.00", "share_percent": -6.2 }
  ]
}
```

> Amount trả về dạng string decimal 2 chữ số. Percent number 1 chữ số thập phân. Âm cho phép (MoM giảm, adjustment âm).

## 7. Dependencies (cùng PMC — import trực tiếp)

**Không cần ExternalService** vì tất cả nguồn dữ liệu cùng top-level module `PMC`.

| Bảng / Model | SubModule | Cách truy cập |
|--------------|-----------|--------------|
| `ClosingPeriod`, `ClosingPeriodOrder` | `PMC/ClosingPeriod` | Import Model |
| `OrderCommissionSnapshot` | `PMC/ClosingPeriod` | Import Model |
| `Order`, `OrderLine` | `PMC/Order` | Import Model |
| `CatalogItem`, `ServiceCategory` | `PMC/Catalog` | Join theo `order_lines.reference_id` |
| `Project` | `PMC/Project` | Qua `closing_periods.project_id` |

**Reuse shared logic với Commission Report:**
- `gross_profit` phải khớp → nên gọi `CommissionReportRepository::getEstimatedGrossProfit()` hoặc extract helper thành trait/service chung.

## 8. Cấu trúc SubModule

```text
app/Modules/PMC/src/Report/
└── RevenueProfit/
    ├── Controllers/
    │   └── RevenueProfitReportController.php
    ├── Contracts/
    │   └── RevenueProfitReportServiceInterface.php
    ├── Services/
    │   └── RevenueProfitReportService.php
    ├── Repositories/
    │   └── RevenueProfitReportRepository.php
    ├── Requests/
    │   └── RevenueProfitReportRequest.php
    └── Resources/
        ├── RevenueProfitSummaryResource.php
        ├── RevenueProfitMonthlyResource.php
        ├── RevenueProfitByProjectResource.php
        └── RevenueProfitByServiceCategoryResource.php
```

> Không tạo Model, Migration, Factory, Seeder.

## 9. Routes

```php
// app/Modules/PMC/routes/api.php (thêm vào group reports hiện có)
Route::prefix('reports/revenue-profit')->group(function (): void {
    Route::get('/summary', [RevenueProfitReportController::class, 'summary']);
    Route::get('/monthly', [RevenueProfitReportController::class, 'monthly']);
    Route::get('/by-project', [RevenueProfitReportController::class, 'byProject']);
    Route::get('/by-service-category', [RevenueProfitReportController::class, 'byServiceCategory']);
});
```

URL đầy đủ: `/api/v1/pmc/reports/revenue-profit/...`

## 10. Permission

Dùng permission: **`commission.view`** (đồng bộ Commission Report — cùng là báo cáo tài chính kỳ chốt, cùng công thức LN).

> Sau này nếu cần tách quyền cho BGĐ riêng, tạo `reports.revenue-profit.view`.

## 11. Ghi chú kỹ thuật

### 11.1 Đồng bộ với Commission Report

- `gross_profit` phải = Commission Report's `estimated_gross_profit` khi cùng filter.
- Viết test cross-check: cùng `closing_period_id`, 2 endpoint phải trả cùng giá trị.
- Reuse công thức: hoặc gọi chung Repository method, hoặc extract vào shared trait `ComputesGrossProfit`.

### 11.2 Performance

- Summary: 3 aggregate SQL (revenue, commission, material). Có thể dùng Query Builder.
- Monthly: 6 tháng × aggregates — 1 query group by `YEAR(period_end), MONTH(period_end)`.
- By-project: 1 query group by `project_id`.
- By-service-category: join `order_lines + catalog_items + service_categories`, group by category key. PHP tính adjustment cuối.
- Cache Redis (TTL 5 phút) cho summary nếu data lớn.

### 11.3 Adjustment slice âm (by-service-category)

- Slice `"Điều chỉnh nội bộ"` thường âm vì external_commission không phân bổ được xuống line.
- FE donut chart cần xử lý: slice âm hiển thị màu xám trong legend, không vẽ lát trong donut ring (hoặc vẽ nhỏ với overlay text chú thích).

### 11.4 Margin alert threshold

- Hardcode `MARGIN_ALERT_THRESHOLD = 31.0` trong `RevenueProfitReportService`.
- Dùng cho cả `by-project.margin_alert` và text insight.
- Trả về trong `summary.margin_alert_threshold` để FE hiển thị đồng nhất.

### 11.5 Không còn "live mode"

- v1 spec có live mode (dùng receivables trực tiếp, không qua kỳ chốt). v2 loại bỏ để đảm bảo:
  - Số liệu khớp Commission Report (cùng scope = kỳ đã đóng).
  - Tránh double-counting khi đơn vừa trong live data vừa trong kỳ chốt.
- Đơn đã completed nhưng chưa vào kỳ chốt nào → không xuất hiện trong báo cáo này (logic như Commission Report).

## 12. Checklist triển khai BE

- [ ] Tạo submodule `PMC/Report/RevenueProfit`
- [ ] `RevenueProfitReportRequest` — rules `closing_period_id`, `project_id`, `date_from/to`
- [ ] `RevenueProfitReportRepository` — 4 aggregate method + resolve filter periods (reuse helper với Commission Report)
- [ ] `RevenueProfitReportService` implements `RevenueProfitReportServiceInterface`
- [ ] 4 Resources với `@return array{...}` shape
- [ ] `RevenueProfitReportController` — 4 endpoints, `@tags`, middleware `permission:commission.view`
- [ ] Routes `/api/v1/pmc/reports/revenue-profit/*`
- [ ] Binding trong `PMCServiceProvider`
- [ ] Feature test:
  - Summary KPI (revenue, external commission, material, gross profit khớp công thức)
  - Cross-check: `gross_profit = CommissionReport.estimated_gross_profit`
  - Monthly trend (6 tháng)
  - By-project: margin_alert trigger khi < 31%, share_of_revenue khớp 100%
  - By-service-category: adjustment slice khớp tổng = gross_profit
  - Validation, permission
- [ ] `make format` + `make lint` + `scramble:export`
