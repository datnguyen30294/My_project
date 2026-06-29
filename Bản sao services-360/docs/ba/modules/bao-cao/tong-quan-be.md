# Báo cáo Tổng quan - Đặc tả kỹ thuật Backend

> Module: `PMC/Report/Overview` | Ngày tạo: 2026-04-14 | Trạng thái: Draft

## 1. Tổng quan

Báo cáo Tổng quan là **dashboard quản trị** tập hợp **4 KPI trụ cột** cho BGĐ theo dõi nhanh tình hình vận hành và tài chính trong kỳ hiện tại. Tính năng **read-only**, aggregate dữ liệu từ các submodule báo cáo đã có — **không tạo bảng/model mới**, chỉ thêm 1 Service + 1 Controller + 1 Resource để đóng gói 1 response duy nhất cho FE.

**Thay đổi nghiệp vụ so với mockup gốc:**

- **Bỏ thẻ "Công nợ"** (hệ thống không triển khai báo cáo công nợ).
- **Thêm thẻ "Phân bổ hoa hồng"** (promote từ section phụ lên 4 KPI chính).
- **Bỏ link "Công nợ phải thu"** khỏi mục "Liên kết nghiệp vụ tham chiếu".

**4 KPI trụ cột mới:**

| Vị trí | KPI | Nguồn dữ liệu | Ý nghĩa |
|--------|-----|---------------|---------|
| 1 | SLA | `SlaReportService::summary()` | `on_time_rate` + `breached_count` |
| 2 | Doanh thu & LN | `RevenueProfitReportService::summary()` | `revenue` + `margin_percent` |
| 3 | Hài lòng KH | `CsatReportService::summary()` | `avg_score` + `response_rate` |
| 4 | Phân bổ hoa hồng | `CommissionReportService::summary()` | Tổng 4 bên + số lớn nhất để hiển thị |

`Report` là submodule của PMC. `Overview` là submodule con **cùng cấp** với `Sla`, `Csat`, `RevenueProfit`, `Commission`, `CashFlow`, `RevenueTicket`. Vì cùng PMC → import trực tiếp Service, **không cần ExternalService**.

## 2. Entities

**Không tạo entity/table mới.** Feature này composite data từ 4 submodule báo cáo đã có. Không cần Repository riêng.

## 3. API Endpoints

| Action | Method | URL | Request Class | Mô tả |
|--------|--------|-----|---------------|-------|
| Summary | GET | `/api/v1/pmc/reports/overview/summary` | `OverviewReportRequest` | Trả về 4 KPI + period_label dùng chung |

> Chỉ 1 endpoint. FE render 4 thẻ KPI từ response này.

## 4. Validation Rules

### OverviewReportRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `closing_period_id` | `nullable`, `integer`, `Rule::exists('closing_periods','id')->whereNull('deleted_at')` | Kỳ chốt không tồn tại |
| `project_id` | `nullable`, `integer`, `Rule::exists('projects','id')->whereNull('deleted_at')` | Dự án không tồn tại |
| `date_from` | `nullable`, `date_format:Y-m-d` | Ngày bắt đầu không đúng định dạng |
| `date_to` | `nullable`, `date_format:Y-m-d`, `after_or_equal:date_from` | Ngày kết thúc phải >= ngày bắt đầu |

> Validation giống hệt 4 submodule báo cáo con — OverviewReportService pass-through filter xuống từng service.

**Ưu tiên filter** (đồng bộ với toàn bộ Report module):

1. `closing_period_id` → ưu tiên cao nhất, các filter khác bỏ qua.
2. `date_from/date_to` (+ `project_id` nullable) → lấy các kỳ `closed` trong khoảng.
3. Không truyền gì → **30 ngày gần nhất** (default).

## 5. Business Rules

### 5.1 Aggregation logic

`OverviewReportService::summary(filter)` gọi song song 4 sub-services:

```
filter = { closing_period_id?, project_id?, date_from?, date_to? }

sla        = slaReportService->summary(filter)
revenue    = revenueProfitReportService->summary(filter)
csat       = csatReportService->summary(filter)
commission = commissionReportService->summary(filter)

return {
  period_label: revenue.period_label,   // dùng 1 label chung (mọi service tính giống nhau)
  sla:        { on_time_rate, breached_count },
  revenue:    { revenue, margin_percent },
  csat:       { avg_score, max_score, response_rate },
  commission: { party_totals: { ... }, total_all_parties }
}
```

> Các service con đều áp dụng cùng logic filter + default 30 ngày, nên `period_label` sẽ đồng nhất.
> Nếu 1 service nào lỗi/không có data → trả `null` cho khối đó, không fail toàn bộ response (soft-fail, log warning).

### 5.2 Scope dữ liệu

- Cùng scope với các submodule con: chỉ đọc từ **closing periods đã đóng** (`status = closed`), trừ khi chỉ định `closing_period_id` cụ thể.
- Nếu không có closing period nào match → các KPI trả giá trị mặc định (`on_time_rate = 0`, `revenue = "0.00"`, `avg_score = 0`, `party_totals = 0`), KHÔNG trả 404.

### 5.3 Công thức KPI

**SLA:**

```
on_time_rate  = SlaReportService::summary().on_time_rate     // float %
breached_count = SlaReportService::summary().breached_count  // int
```

**Doanh thu & LN:**

```
revenue        = RevenueProfitReportService::summary().revenue         // decimal string
margin_percent = RevenueProfitReportService::summary().margin_percent  // float %
```

**Hài lòng KH:**

```
avg_score     = CsatReportService::summary().avg_score      // float (0-5)
max_score     = 5                                             // fixed
response_rate = CsatReportService::summary().response_rate  // float %
```

**Phân bổ hoa hồng:**

```
party_totals = CommissionReportService::summary().party_totals
// { operating_company, board_of_directors, management, platform }

total_all_parties = SUM(party_totals)  // decimal string — dùng làm KPI chính trên thẻ
```

> Thẻ KPI hiển thị `total_all_parties` (tổng hoa hồng kỳ). Phụ đề hiển thị `platform` riêng để giữ thông tin nền tảng.

### 5.4 Period label

- Lấy `period_label` từ `RevenueProfitReportService::summary()` (vì 1 service đã tính đúng).
- Format: `"Kỳ: Tháng 3/2026"` hoặc `"01/03/2026 - 31/03/2026"` hoặc `"30 ngày gần nhất"`.

### 5.5 Soft-fail per KPI

Nếu 1 sub-service ném exception (VD: bảng snapshot chưa có data):

- Log warning qua `Log::warning('OverviewReport sub-service failed', ['service' => ..., 'error' => ...])`.
- Trả `null` cho khối KPI đó.
- FE hiển thị trạng thái "Không có dữ liệu" cho thẻ tương ứng, các thẻ khác vẫn render bình thường.

## 6. Resource Output

### 6.1 Summary Response

```json
{
  "success": true,
  "data": {
    "period_label": "01/03/2026 - 31/03/2026",
    "sla": {
      "on_time_rate": 94.2,
      "breached_count": 23
    },
    "revenue": {
      "revenue": "4820000000.00",
      "margin_percent": 33.4
    },
    "csat": {
      "avg_score": 4.6,
      "max_score": 5,
      "response_rate": 62.5
    },
    "commission": {
      "party_totals": {
        "operating_company": "428500000.00",
        "board_of_directors": "315200000.00",
        "management": "201800000.00",
        "platform": "64100000.00"
      },
      "total_all_parties": "1009600000.00"
    }
  }
}
```

### 6.2 Soft-fail response (VD: CSAT service lỗi)

```json
{
  "success": true,
  "data": {
    "period_label": "30 ngày gần nhất",
    "sla": { "on_time_rate": 94.2, "breached_count": 23 },
    "revenue": { "revenue": "4820000000.00", "margin_percent": 33.4 },
    "csat": null,
    "commission": { "party_totals": { ... }, "total_all_parties": "1009600000.00" }
  }
}
```

> Amount giữ format string decimal 2 chữ số consistent với Commission/RevenueProfit/CashFlow report.

## 7. Dependencies (cùng PMC — import trực tiếp Service)

**Không cần ExternalService** — `Overview` là submodule trong PMC, inject 4 Service qua constructor:

| Service | SubModule | Phương thức dùng |
|---------|-----------|------------------|
| `SlaReportServiceInterface` | `PMC/Report/Sla` | `summary(array $filter)` |
| `RevenueProfitReportServiceInterface` | `PMC/Report/RevenueProfit` | `summary(array $filter)` |
| `CsatReportServiceInterface` | `PMC/Report/Csat` | `summary(array $filter)` |
| `CommissionReportServiceInterface` | `PMC/Report/Commission` | `summary(array $filter)` |

```php
final readonly class OverviewReportService implements OverviewReportServiceInterface
{
    public function __construct(
        private SlaReportServiceInterface $slaReportService,
        private RevenueProfitReportServiceInterface $revenueProfitReportService,
        private CsatReportServiceInterface $csatReportService,
        private CommissionReportServiceInterface $commissionReportService,
    ) {}
}
```

## 8. Cấu trúc SubModule

```
app/Modules/PMC/src/Report/
└── Overview/
    ├── Controllers/
    │   └── OverviewReportController.php
    ├── Contracts/
    │   └── OverviewReportServiceInterface.php
    ├── Services/
    │   └── OverviewReportService.php
    ├── Requests/
    │   └── OverviewReportRequest.php
    └── Resources/
        └── OverviewSummaryResource.php
```

> - Đặt trong `PMC/src/Report/Overview/` — submodule con, cùng cấp với các report con khác.
> - **Không có Repository** — Service chỉ aggregate từ các Service khác, không query DB trực tiếp.
> - Không tạo Model, Migration, Factory, Seeder — feature read-only.
> - Service binding đăng ký trong `PMCServiceProvider`.

## 9. Routes

```php
// app/Modules/PMC/routes/api.php (thêm vào group reports hiện có)
Route::prefix('reports/overview')->group(function (): void {
    Route::get('/summary', [OverviewReportController::class, 'summary']);
});
```

> Dùng chung file routes của PMC (đã có middleware `tenant` + `auth:sanctum`).
> URL đầy đủ: `/api/v1/pmc/reports/overview/summary`.

## 10. Permission

Dùng permission mới: `reports.overview.view` — granted cho role BGĐ / Điều hành.

> **Lý do tách quyền riêng:** Tổng quan hiển thị KPI tổng hợp cấp quản trị — không nhất thiết ai xem được chi tiết 1 report con cũng xem được overview. Tách quyền để quản lý chặt hơn.

Alternative (nếu muốn đơn giản): dùng điều kiện OR `sla.view OR revenue_profit.view OR csat.view OR commission.view` — ai có 1 trong 4 quyền con thì xem được tổng quan (từng khối null khi không có quyền). **Hiện tại chọn permission riêng để tối giản logic FE**.

## 11. Ghi chú kỹ thuật

### 11.1 Performance

- 4 sub-service calls chạy **tuần tự** trong PHP (không chạy song song vì Laravel không có async native). Mỗi service đã cache riêng → chi phí overhead nhỏ.
- Toàn bộ endpoint cache Redis (TTL 5 phút, key gồm filter hash + tenant_id) — FE gọi nhiều lần không cần query lại.
- Nếu thấy chậm, xem xét dùng `Octane::concurrently()` để chạy 4 service song song (optional v2).

### 11.2 Amount format

Amount giữ format string decimal 2 chữ số (`"428500000.00"`) — consistent với Commission/RevenueProfit/CashFlow report. FE format hiển thị (VD: `428.500.000 đ`).

### 11.3 Default filter (khi FE không truyền gì)

- `date_from = today - 30 days`
- `date_to = today`
- `closing_period_id = null`
- `project_id = null`

→ `period_label = "30 ngày gần nhất"`.

### 11.4 Error handling

- Validation fail → 422 như chuẩn Laravel.
- 1 sub-service fail → soft-fail (null block) + log warning, response 200.
- Toàn bộ endpoint fail (VD: DB down) → 500 từ exception handler chung.

## 12. Checklist triển khai BE

- [ ] SubModule structure: `app/Modules/PMC/src/Report/Overview/`
- [ ] `OverviewReportService` implements `OverviewReportServiceInterface` (inject 4 Service con)
- [ ] `OverviewReportRequest` — validation rules (giống 4 submodule con)
- [ ] `OverviewSummaryResource` — format response
- [ ] `OverviewReportController` — 1 endpoint `summary`
- [ ] Binding trong `PMCServiceProvider`
- [ ] Routes trong `PMC/routes/api.php` (group `reports/overview`)
- [ ] Permission seeder: `reports.overview.view` vào `PermissionSeeder` (tenant) + `PermissionSubModule` enum
- [ ] PSR-4 mapping trong `composer.json`
- [ ] Feature test: happy path + soft-fail khi 1 service exception + validation errors
- [ ] `make format` + `make lint`
