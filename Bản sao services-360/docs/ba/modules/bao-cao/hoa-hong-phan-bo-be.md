# Báo cáo Phân bổ hoa hồng - Đặc tả kỹ thuật Backend

> Module: `PMC/Report/Commission` | Ngày tạo: 2026-04-14 | Trạng thái: Draft

## 1. Tổng quan

Báo cáo Phân bổ hoa hồng là tính năng **read-only**, tổng hợp dữ liệu từ `order_commission_snapshots` (module ClosingPeriod) để hiển thị phân bổ hoa hồng cho 4 bên (Công ty vận hành, Ban quản trị, Ban quản lý, Platform) và chi tiết theo từng nhân viên. Không tạo bảng/model mới — chỉ thêm Service + Controller + Resource.

`Report` là **submodule của PMC** (tenant), chứa tất cả báo cáo. `Commission` là submodule con, cùng cấp với `Sla`, `CashFlow`. Vì cùng PMC → import trực tiếp Model/Repository, **không cần ExternalService**.

**Data source:**

| Bảng | Mục đích |
|------|----------|
| `order_commission_snapshots` | Dữ liệu chính: `recipient_type`, `amount`, `account_id`, `order_id`, `closing_period_id` |
| `closing_periods` | Kỳ chốt: `period_start`, `period_end`, `project_id`, `status` |
| `closing_period_orders` | Liên kết order ↔ closing period: `frozen_receivable_amount`, `frozen_commission_total` |
| `orders` | Join qua snapshot → lấy `project_id` |
| `projects` | Tên dự án |
| `accounts` | Thông tin nhân viên (tên, mã NV) |
| `departments` | Phòng ban nhân viên |

**Mối quan hệ chính:**

```
order_commission_snapshots
  → closing_periods (kỳ chốt)
  → orders → projects (dự án)
  → accounts → departments (nhân viên)
```

**SnapshotRecipientType (đã có — `ClosingPeriod/Enums`):**

| Type | Label | Vai trò |
|------|-------|---------|
| `platform` | Platform | Terminal — nhận tiền |
| `operating_company` | Công ty vận hành | Terminal — nhận tiền |
| `board_of_directors` | Ban quản trị | Terminal — nhận tiền |
| `management` | Ban quản lý | Intermediary — phân phối tiếp xuống dept/staff |
| `department` | Phòng ban | Intermediary — phân phối tiếp xuống staff |
| `staff` | Nhân viên | Terminal — nhận tiền (từ phần BQL) |

## 2. Entities

**Không tạo entity/table mới cho báo cáo.** Feature này đọc từ các bảng đã có trong module ClosingPeriod.

## 3. API Endpoints

| Action | Method | URL | Request Class | Mô tả |
|--------|--------|-----|---------------|-------|
| Summary | GET | `/api/v1/pmc/reports/commission/summary` | `CommissionReportRequest` | KPI 4 bên + lợi nhuận gộp VH + rules Platform |
| Chi tiết theo NV | GET | `/api/v1/pmc/reports/commission/by-staff` | `CommissionReportRequest` | Bảng phân bổ theo nhân viên × dự án |

> Tất cả endpoint dùng chung `CommissionReportRequest` vì filter giống nhau.

## 4. Validation Rules

### CommissionReportRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `closing_period_id` | `nullable`, `integer`, `exists:closing_periods,id` | Kỳ chốt không tồn tại |
| `project_id` | `nullable`, `integer`, `exists:projects,id` | Dự án không tồn tại |
| `date_from` | `nullable`, `date_format:Y-m-d` | Ngày bắt đầu không đúng định dạng |
| `date_to` | `nullable`, `date_format:Y-m-d`, `after_or_equal:date_from` | Ngày kết thúc phải >= ngày bắt đầu |

> **Ưu tiên filter:** `closing_period_id` > `date_from/date_to` > default (30 ngày gần nhất).
> Khi truyền `closing_period_id`, các filter khác bị bỏ qua (project_id implicit từ closing period).

## 5. Business Rules

### 5.1 Scope dữ liệu

- Chỉ đọc snapshots từ **closing periods đã đóng** (`status = closed`) — kỳ mở chưa chốt, số liệu chưa chính thức.
- Exception: khi truyền `closing_period_id` cụ thể → hiển thị dù status nào (để preview trước khi đóng kỳ).

### 5.2 Lọc theo kỳ chốt (closing_period_id)

Khi truyền `closing_period_id`:
- Chỉ lấy snapshots thuộc closing period đó.
- `project_id` implicit từ `closing_periods.project_id`.
- Bỏ qua `date_from/date_to` và `project_id`.

### 5.3 Lọc theo khoảng ngày + dự án

Khi truyền `date_from/date_to` (không có `closing_period_id`):
- Lấy tất cả closing periods có `period_end >= date_from AND period_start <= date_to AND status = closed`.
- Nếu thêm `project_id` → chỉ closing periods thuộc project đó.

Khi không truyền gì:
- Default: 30 ngày gần nhất (consistent với SLA, CashFlow reports).
- `date_from = today - 30 days`, `date_to = today`.

### 5.4 Công thức tính KPI Summary

**Hoa hồng 4 bên (`party_totals`):**

```sql
SELECT recipient_type, SUM(amount) as total
FROM order_commission_snapshots
WHERE closing_period_id IN (:filtered_period_ids)
  AND recipient_type IN ('platform', 'operating_company', 'board_of_directors', 'management')
GROUP BY recipient_type
```

> Lấy 4 top-level types. `management` = tổng BQL trước khi chia xuống phòng ban/NV.

**Lợi nhuận gộp ước tính (`estimated_gross_profit`):**

```sql
SELECT SUM(frozen_receivable_amount) - SUM(frozen_commission_total) as gross_profit
FROM closing_period_orders
WHERE closing_period_id IN (:filtered_period_ids)
```

> `frozen_receivable_amount` = doanh thu đơn hàng tại thời điểm chốt.
> `frozen_commission_total` = tổng hoa hồng đã phân bổ.
> Lợi nhuận gộp ước tính = Doanh thu − Hoa hồng (đơn giản hóa).
> Đây KHÔNG phải lợi nhuận thực tế (chưa trừ chi phí vật tư). Hiển thị để so sánh với phần HH phân bổ cho VH.

**Platform rules (constants):**

```php
// Hằng số hệ thống — hiện hardcode trong CommissionSnapshotService
PLATFORM_COMMISSION_PERCENT = 5;             // 5% trên cơ sở hoa hồng
PLATFORM_COMMISSION_FIXED_PER_ORDER = 1000;  // 1.000 đ/đơn
```

> Trả về trong response để FE hiển thị thông tin tham khảo.

### 5.5 Chi tiết theo nhân viên (by-staff)

**Logic tính phân bổ theo tỷ lệ (proportional attribution):**

Mỗi nhân viên (có snapshot `recipient_type = 'staff'`) được tính phần đóng góp/quy chiếu vào 4 bên dựa trên tỷ lệ phần BQL họ nhận:

```
Với mỗi order O mà NV S có 'staff' snapshot:

  1. staff_amount_S = snapshot.amount (NV S nhận từ BQL cho order O)
  2. total_staff_amount_O = SUM(amount) WHERE order_id = O AND recipient_type = 'staff'
  3. share_ratio = staff_amount_S / total_staff_amount_O
     (nếu total_staff = 0 → ratio = 0)

  4. VH_attributed  = (amount WHERE order_id = O AND recipient_type = 'operating_company') × share_ratio
  5. BQT_attributed = (amount WHERE order_id = O AND recipient_type = 'board_of_directors') × share_ratio
  6. BQL = staff_amount_S                       ← thực nhận
  7. Platform_attributed = (amount WHERE order_id = O AND recipient_type = 'platform') × share_ratio

Tổng hợp qua tất cả orders (trong filtered periods):
  NV S tại Project P:
    - operating_company = SUM(VH_attributed)
    - board_of_directors = SUM(BQT_attributed)
    - management = SUM(BQL)
    - platform = SUM(Platform_attributed)
    - total = operating_company + board_of_directors + management + platform
```

Nhóm theo: `(account_id, project_id)` — mỗi dòng = 1 NV × 1 dự án.
Sắp xếp: `total DESC` (NV có tổng HH cao nhất trước).

> **Lưu ý:** VH/BQT/Platform là "phần đóng góp quy chiếu" — cho thấy tổng hoa hồng mà đơn hàng của NV tạo ra phân bổ cho các bên. Cột BQL (management) là phần NV **thực nhận**.

### 5.6 Period label

Trả về label mô tả khoảng thời gian:
- `"Kỳ: {closing_period.name}"` — khi lọc theo closing period cụ thể
- `"01/03/2026 - 31/03/2026"` — khi lọc theo date range
- `"30 ngày gần nhất"` — khi dùng default

## 6. Resource Output

### 6.1 Summary Response

```json
{
  "success": true,
  "data": {
    "period_label": "01/03/2026 - 31/03/2026",
    "party_totals": {
      "operating_company": "428500000.00",
      "board_of_directors": "315200000.00",
      "management": "201800000.00",
      "platform": "64100000.00"
    },
    "estimated_gross_profit": "892000000.00",
    "platform_rules": {
      "percent": 5,
      "fixed_per_order": 1000
    }
  }
}
```

### 6.2 By-Staff Response

```json
{
  "success": true,
  "data": [
    {
      "account_id": 12,
      "staff_name": "Nguyễn Văn An",
      "department_name": "Kỹ thuật",
      "project_id": 1,
      "project_name": "Vinhomes Ocean Park",
      "operating_company": "24800000.00",
      "board_of_directors": "11200000.00",
      "management": "7600000.00",
      "platform": "2100000.00",
      "total": "45700000.00"
    },
    {
      "account_id": 15,
      "staff_name": "Trần Thị Bình",
      "department_name": "Kỹ thuật",
      "project_id": 1,
      "project_name": "Vinhomes Ocean Park",
      "operating_company": "19200000.00",
      "board_of_directors": "9400000.00",
      "management": "6100000.00",
      "platform": "1800000.00",
      "total": "36500000.00"
    }
  ]
}
```

> Amount trả về dạng string decimal 2 chữ số — consistent với CashFlow report.

## 7. Dependencies (cùng PMC — import trực tiếp)

**Không cần ExternalService** — `Report` là submodule trong PMC, import trực tiếp Model/Repository của các submodule anh em.

| Bảng | SubModule | Cách truy cập |
|------|-----------|--------------|
| `order_commission_snapshots` | `PMC/ClosingPeriod` | Import trực tiếp Model |
| `closing_periods` | `PMC/ClosingPeriod` | Import trực tiếp Model |
| `closing_period_orders` | `PMC/ClosingPeriod` | Import trực tiếp Model |
| `orders` | `PMC/Order` | Qua relationship `OrderCommissionSnapshot::order()` |
| `projects` | `PMC/Project` | Qua relationship `ClosingPeriod::project()` hoặc `Order::project()` |
| `accounts` | `PMC/Account` | Qua relationship `OrderCommissionSnapshot::account()` |
| `departments` | `PMC/Department` | Qua relationship `Account::department()` |

## 8. Cấu trúc SubModule

```
app/Modules/PMC/src/Report/
└── Commission/
    ├── Controllers/
    │   └── CommissionReportController.php
    ├── Contracts/
    │   └── CommissionReportServiceInterface.php
    ├── Services/
    │   └── CommissionReportService.php
    ├── Repositories/
    │   └── CommissionReportRepository.php
    ├── Requests/
    │   └── CommissionReportRequest.php
    └── Resources/
        ├── CommissionSummaryResource.php
        └── CommissionByStaffResource.php
```

> Đặt trong `PMC/src/Report/Commission/` — submodule con, cùng cấp với `Sla`, `CashFlow`.
> Không tạo Model, Migration, Factory, Seeder — feature read-only.
> Service binding đăng ký trong `PMCServiceProvider`.

## 9. Routes

```php
// app/Modules/PMC/routes/api.php (thêm vào group reports hiện có)
Route::prefix('reports/commission')->group(function (): void {
    Route::get('/summary', [CommissionReportController::class, 'summary']);
    Route::get('/by-staff', [CommissionReportController::class, 'byStaff']);
});
```

> Dùng chung file routes của PMC (đã có middleware `tenant` + `auth:sanctum`).
> URL đầy đủ: `/api/v1/pmc/reports/commission/...`.

## 10. Permission

Dùng permission: `commission.view` — ai xem được cấu hình hoa hồng thì xem được báo cáo phân bổ.

> Sau này nếu cần tách quyền riêng, tạo `reports.commission.view`.

## 11. Ghi chú kỹ thuật

### 11.1 Performance

- **Summary:** Simple aggregate query (GROUP BY recipient_type), dùng Query Builder.
- **By-Staff:** Phức tạp hơn do proportional attribution → xử lý trong PHP.
  - Query 1: Tất cả `staff` snapshots (filtered periods) → get unique order_ids
  - Query 2: Tất cả top-level snapshots cho cùng order_ids
  - PHP: Tính ratio + attribution per order per staff, aggregate theo `(account_id, project_id)`
- Cache Redis (TTL 5 phút) nếu data lớn.

### 11.2 Proportional attribution — batch approach

```php
// Pseudo-code cho Repository
public function getByStaffData(array $periodIds): Collection
{
    // 1. Lấy tất cả 'staff' snapshots
    $staffSnapshots = OrderCommissionSnapshot::query()
        ->whereIn('closing_period_id', $periodIds)
        ->where('recipient_type', 'staff')
        ->get(['order_id', 'account_id', 'amount']);

    // 2. Lấy top-level snapshots cho cùng orders
    $orderIds = $staffSnapshots->pluck('order_id')->unique();
    $topLevelSnapshots = OrderCommissionSnapshot::query()
        ->whereIn('order_id', $orderIds)
        ->whereIn('recipient_type', ['platform', 'operating_company', 'board_of_directors'])
        ->get(['order_id', 'recipient_type', 'amount']);

    // 3. Tính total staff per order (cho ratio)
    $totalStaffPerOrder = $staffSnapshots
        ->groupBy('order_id')
        ->map(fn ($group) => $group->sum('amount'));

    // 4. PHP loop: attribution
    // ... (xem mục 5.5)
}
```

> **2 queries chính** + PHP xử lý — tránh complex JOIN/subquery.

### 11.3 Closing period = closed only

Snapshot data chỉ có ý nghĩa khi closing period đã đóng. Kỳ mở có thể có snapshots chưa hoàn chỉnh. Default filter chỉ lấy `status = closed`, trừ khi truyền `closing_period_id` cụ thể (cho phép preview).

### 11.4 Amount format

Amount trả về dạng string decimal 2 chữ số (`"428500000.00"`) — consistent với CashFlow report. FE sẽ format hiển thị (VD: `428.500.000 đ`).

### 11.5 Platform rules constants

Platform commission rules (5% + 1.000đ/đơn) hiện hardcode trong `CommissionSnapshotService`. Trả về trong summary response để FE hiển thị. Sau này có thể cấu hình qua SystemSetting.

### 11.6 Estimated gross profit

`estimated_gross_profit = SUM(frozen_receivable_amount) - SUM(frozen_commission_total)` từ `closing_period_orders`. Đây là ước tính đơn giản (Doanh thu − Hoa hồng), chưa trừ chi phí vật tư/nhân công. Hiển thị bên cạnh thẻ VH để người dùng thấy sự khác biệt giữa "HH phân bổ cho VH" vs "Lợi nhuận gộp".

## 12. Checklist triển khai BE

- [ ] SubModule structure: `app/Modules/PMC/src/Report/Commission/`
- [ ] `CommissionReportRepository` — aggregate queries (Query Builder + PHP attribution)
- [ ] `CommissionReportService` implements `CommissionReportServiceInterface`
- [ ] `CommissionReportRequest` — validation rules
- [ ] Resources: `CommissionSummaryResource`, `CommissionByStaffResource`
- [ ] `CommissionReportController` — 2 endpoints
- [ ] Binding trong `PMCServiceProvider`
- [ ] Routes trong `PMC/routes/api.php` (group `reports/commission`)
- [ ] PSR-4 mapping trong `composer.json`
- [ ] Tests: feature tests cho mỗi endpoint
- [ ] `make format` + `make lint`
