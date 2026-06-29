# Báo cáo Doanh thu (ticket) - Đặc tả kỹ thuật Backend

> Module: `PMC/Report/RevenueTicket` | Ngày tạo: 2026-04-14 | Trạng thái: Draft

## 1. Tổng quan

Báo cáo Doanh thu (ticket) là tính năng **read-only**, tổng hợp doanh thu phát sinh từ luồng `ticket -> báo giá -> đơn hàng -> công nợ` để theo dõi:

- Tổng doanh thu gắn ticket trong kỳ lọc
- Số ticket tạo ra doanh thu
- Cơ cấu theo `category ticket` và theo nhân viên xử lý
- Diễn biến số ticket theo ngày và theo dự án

Feature này **không** thay thế báo cáo Doanh thu & Lợi nhuận:

- `RevenueTicket`: nhìn theo góc độ ticket, category, nhân viên, volume ticket
- `RevenueProfit`: nhìn theo doanh thu, chi phí ước, LN gộp, margin

Không tạo bảng/model mới. Chỉ thêm submodule báo cáo, service, repository, request, resource.

**Data source chính:**

| Bảng | Mục đích |
|------|----------|
| `og_tickets` | Ticket nguồn: `project_id`, `subject`, `received_by_id`, `status` |
| `og_ticket_assignees` | Xác định nhân viên xử lý của ticket |
| `quotes` | Nối từ ticket sang báo giá |
| `orders` | Scope đơn hàng: `status`, `completed_at`, `quote_id` |
| `receivables` | Doanh thu quản trị: `amount`, `status`, `project_id` |
| `order_lines` | Suy ra bucket/category chính của ticket theo dòng doanh thu |
| `catalog_items` | Resolve `service_category_id` cho dòng loại service |
| `service_categories` | Nhãn category dịch vụ |
| `projects` | Tên dự án |
| `accounts` | Tên nhân viên xử lý |

**Luồng dữ liệu chính:**

```text
og_tickets
  -> quotes
  -> orders
  -> receivables

og_tickets
  -> og_ticket_assignees / received_by_id

orders
  -> order_lines
  -> catalog_items
  -> service_categories
```

## 2. Entities

**Không tạo entity/table mới cho báo cáo.** Feature này chỉ đọc và aggregate dữ liệu từ các bảng có sẵn của `OgTicket`, `Order`, `Receivable`, `Catalog`.

## 3. API Endpoints

| Action | Method | URL | Request Class | Mô tả |
|--------|--------|-----|---------------|-------|
| Summary KPI | GET | `/api/v1/pmc/reports/revenue-ticket/summary` | `RevenueTicketReportRequest` | KPI tổng quan |
| Theo category | GET | `/api/v1/pmc/reports/revenue-ticket/by-category` | `RevenueTicketReportRequest` | Bảng + donut theo category ticket |
| Theo nhân viên | GET | `/api/v1/pmc/reports/revenue-ticket/by-staff` | `RevenueTicketReportRequest` | Bảng + donut theo nhân viên xử lý |
| Theo ngày và dự án | GET | `/api/v1/pmc/reports/revenue-ticket/daily` | `RevenueTicketReportRequest` | Series line chart theo ngày x dự án |
| Chi tiết dòng | GET | `/api/v1/pmc/reports/revenue-ticket/details` | `RevenueTicketReportRequest` | Bảng aggregate theo ngày x dự án x category x nhân viên |

> Tất cả endpoint dùng chung `RevenueTicketReportRequest` vì dùng cùng bộ lọc `project_id`, `date_from`, `date_to`.

## 4. Validation Rules

### RevenueTicketReportRequest

| Field | Rules | Message (VI) |
|-------|-------|--------------|
| `project_id` | `nullable`, `integer`, `Rule::exists('projects', 'id')->whereNull('deleted_at')` | Dự án không tồn tại |
| `date_from` | `nullable`, `date_format:Y-m-d` | Ngày bắt đầu không đúng định dạng |
| `date_to` | `nullable`, `date_format:Y-m-d`, `after_or_equal:date_from` | Ngày kết thúc phải >= ngày bắt đầu |

**Nguyên tắc filter ngày:**

- Nếu chỉ có `date_from` -> lọc từ ngày đó trở đi
- Nếu chỉ có `date_to` -> lọc đến hết ngày đó
- Nếu cả hai đều rỗng -> **không giới hạn theo ngày**

## 5. Business Rules

### 5.1 Scope dữ liệu

Một ticket được tính vào báo cáo khi thỏa tất cả điều kiện:

- Có `quote` hợp lệ nối từ `og_tickets`
- Có `order` tương ứng và `orders.status = completed`
- `orders.completed_at` khác `null`
- Có `receivable` nối với order
- `receivables.status` thuộc một trong các trạng thái:
  - `paid`
  - `overpaid`
  - `completed`

> Rule này được giữ **đồng bộ với báo cáo Doanh thu & Lợi nhuận** để tránh lệch tổng doanh thu giữa các màn tài chính.

**Project resolve:**

- Ưu tiên `og_tickets.project_id`
- Fallback `receivables.project_id`
- Nếu cả hai cùng `null` -> vẫn giữ bản ghi, trả `project_id = null`, `project_name = "Chưa gán dự án"`

### 5.2 Filter theo dự án và ngày

**Filter dự án (`project_id`)**

- Áp trên `resolved_project_id`
- Khi truyền `project_id`, tất cả endpoint chỉ trả dữ liệu thuộc dự án đó

**Filter ngày**

- Áp trên `DATE(orders.completed_at)`
- `date_from` / `date_to` là filter mở, không bắt buộc đi theo cặp

**Period label**

- Không truyền ngày -> `"Toàn thời gian"`
- Chỉ có `date_from` -> `"Từ {date_from}"`
- Chỉ có `date_to` -> `"Đến {date_to}"`
- Có cả hai -> `"{date_from} - {date_to}"`

### 5.3 Quy tắc gán nhân viên xử lý cho báo cáo

Mỗi ticket chỉ được gán cho **1 nhân viên báo cáo** để tránh double-count doanh thu giữa nhiều assignee.

**`report_owner_account_id` được xác định theo thứ tự ưu tiên:**

1. `assignee` đầu tiên của ticket theo `og_ticket_assignees.created_at ASC`, fallback `account_id ASC`
2. Nếu ticket không có assignee -> dùng `og_tickets.received_by_id`
3. Nếu vẫn không có -> `null`

**`report_owner_name`:**

- Có account -> `accounts.name`
- Không có -> `"Chưa gán"`

> Đây là **quy ước v1** cho báo cáo hiệu suất doanh thu theo cá nhân. Nếu sau này cần mô hình đồng trách nhiệm hoặc chia tỷ trọng cho nhiều nhân viên, sẽ bổ sung rule khác.

### 5.4 Quy tắc xác định `category ticket`

Repo hiện tại **chưa có field category riêng trên `og_tickets`**. Vì vậy v1 dùng **bucket doanh thu chính của order** để suy ra `category ticket`.

**Bước 1 - Resolve bucket cho từng order line:**

| Điều kiện | Bucket |
|----------|--------|
| `line_type = service` và `catalog_items.service_category_id` có giá trị | `service_categories.name` |
| `line_type = service` nhưng thiếu `service_category_id` | `"Dịch vụ chưa phân loại"` |
| `line_type = material` | `"Vật tư"` |
| `line_type = adhoc` | `"Khác"` |

**Bước 2 - Chọn bucket chính của ticket/order:**

- Nhóm `order_lines` theo bucket
- Tính `SUM(line_amount)` cho mỗi bucket
- Lấy bucket có `line_amount` lớn nhất làm `ticket_category`
- Nếu order không có line phù hợp -> `"Không xác định"`

> Đây là **giả định triển khai** để bám mock hiện tại. Khi module ticket có category/tags chính thức, report có thể chuyển sang nguồn đó mà không đổi layout FE.

### 5.5 Định nghĩa doanh thu

**Doanh thu của 1 ticket:**

```text
ticket_revenue = receivables.amount
```

**Tổng doanh thu (`total_revenue`):**

```text
SUM(receivables.amount)
WHERE ticket thuộc scope filter
```

> `receivables.amount` được coi là doanh thu quản trị đã ghi nhận cho order gắn với ticket.

### 5.6 KPI Summary

Endpoint `summary` trả 4 KPI:

| Field | Công thức |
|------|-----------|
| `total_revenue` | `SUM(receivables.amount)` |
| `ticket_count` | `COUNT(DISTINCT og_tickets.id)` |
| `record_count` | Số dòng của aggregate detail sau khi group theo `date x project x category x staff` |
| `category_count` | `COUNT(DISTINCT ticket_category)` |

### 5.7 Aggregate theo category (`by-category`)

Nhóm theo `ticket_category`.

Mỗi dòng:

| Field | Công thức |
|------|-----------|
| `category_key` | slug ổn định từ `ticket_category` |
| `category_label` | Nhãn category |
| `revenue` | `SUM(ticket_revenue)` |
| `ticket_count` | `COUNT(DISTINCT ticket_id)` |
| `ticket_share_percent` | `ticket_count / total_ticket_count x 100` |

Sắp xếp: `revenue DESC`.

> Donut chart phía FE dùng `ticket_count` làm tỷ trọng, không dùng `revenue`.

### 5.8 Aggregate theo nhân viên (`by-staff`)

Nhóm theo `report_owner_account_id`.

Mỗi dòng:

| Field | Công thức |
|------|-----------|
| `staff_id` | `report_owner_account_id`, có thể `null` |
| `staff_name` | `report_owner_name` |
| `revenue` | `SUM(ticket_revenue)` |
| `ticket_count` | `COUNT(DISTINCT ticket_id)` |
| `ticket_share_percent` | `ticket_count / total_ticket_count x 100` |

Sắp xếp: `revenue DESC`.

### 5.9 Aggregate theo ngày và dự án (`daily`)

Nhóm theo:

- `date = DATE(orders.completed_at)`
- `resolved_project_id`

Mỗi dòng:

| Field | Công thức |
|------|-----------|
| `date` | `DATE(orders.completed_at)` format `Y-m-d` |
| `project_id` | `resolved_project_id` |
| `project_name` | `resolved_project_name` |
| `ticket_count` | `COUNT(DISTINCT ticket_id)` |
| `revenue` | `SUM(ticket_revenue)` |

Sắp xếp: `date ASC`, `project_name ASC`.

### 5.10 Chi tiết dòng (`details`)

Mục đích là bám đúng bảng mock, nên endpoint `details` trả **dữ liệu aggregate**, không phải từng ticket raw.

**Granularity:**

```text
DATE(orders.completed_at)
x resolved_project_id
x ticket_category
x report_owner_account_id
```

Mỗi dòng:

| Field | Công thức |
|------|-----------|
| `date` | `DATE(orders.completed_at)` |
| `project_id` | `resolved_project_id`, nullable |
| `project_name` | `resolved_project_name` |
| `category_label` | `ticket_category` |
| `staff_id` | `report_owner_account_id`, nullable |
| `staff_name` | `report_owner_name` |
| `ticket_count` | `COUNT(DISTINCT ticket_id)` |
| `revenue` | `SUM(ticket_revenue)` |

Sắp xếp: `date DESC`, `revenue DESC`.

### 5.11 Ghi chú tính nhất quán dữ liệu

- Tổng `revenue` của `by-category`, `by-staff`, `daily`, `details` phải khớp `summary.total_revenue`
- Tổng `ticket_count` của `by-category` phải khớp `summary.ticket_count`
- Tổng `ticket_count` của `by-staff` phải khớp `summary.ticket_count`
- Điều này đúng vì mỗi ticket chỉ được gán **1 category** và **1 owner báo cáo**

## 6. Resource Output

### 6.1 Summary Response

```json
{
  "success": true,
  "data": {
    "period_label": "01/03/2026 - 31/03/2026",
    "total_revenue": "328900000.00",
    "ticket_count": 83,
    "record_count": 11,
    "category_count": 5
  }
}
```

### 6.2 By-Category Response

```json
{
  "success": true,
  "data": [
    {
      "category_key": "su-co-ky-thuat",
      "category_label": "Sự cố kỹ thuật",
      "revenue": "186600000.00",
      "ticket_count": 46,
      "ticket_share_percent": 55.4
    },
    {
      "category_key": "dien-nuoc",
      "category_label": "Điện - nước",
      "revenue": "46100000.00",
      "ticket_count": 15,
      "ticket_share_percent": 18.1
    }
  ]
}
```

### 6.3 By-Staff Response

```json
{
  "success": true,
  "data": [
    {
      "staff_id": 12,
      "staff_name": "Nguyễn Văn An",
      "revenue": "112700000.00",
      "ticket_count": 32,
      "ticket_share_percent": 38.6
    },
    {
      "staff_id": 15,
      "staff_name": "Trần Thị Bình",
      "revenue": "88000000.00",
      "ticket_count": 26,
      "ticket_share_percent": 31.3
    }
  ]
}
```

### 6.4 Daily Response

```json
{
  "success": true,
  "data": [
    {
      "date": "2026-03-01",
      "project_id": 2,
      "project_name": "Masteri Thảo Điền",
      "ticket_count": 10,
      "revenue": "38400000.00"
    },
    {
      "date": "2026-03-02",
      "project_id": 1,
      "project_name": "Vinhomes Ocean Park",
      "ticket_count": 12,
      "revenue": "45200000.00"
    }
  ]
}
```

### 6.5 Details Response

```json
{
  "success": true,
  "data": [
    {
      "date": "2026-03-12",
      "project_id": 1,
      "project_name": "Vinhomes Ocean Park",
      "category_label": "Sự cố kỹ thuật",
      "staff_id": 18,
      "staff_name": "Lê Hoàng Nam",
      "ticket_count": 7,
      "revenue": "62000000.00"
    },
    {
      "date": "2026-03-09",
      "project_id": 2,
      "project_name": "Masteri Thảo Điền",
      "category_label": "Dịch vụ chung",
      "staff_id": 12,
      "staff_name": "Nguyễn Văn An",
      "ticket_count": 11,
      "revenue": "22100000.00"
    }
  ]
}
```

> Amount trả về dạng string decimal 2 chữ số. Phần trăm trả về dạng number 1 chữ số thập phân.

## 7. Dependencies (cùng PMC - import trực tiếp)

**Không cần ExternalService** - `Report` là submodule trong PMC, import trực tiếp Model/Repository của các submodule anh em theo pattern đang dùng ở `Sla`, `CashFlow`, `RevenueProfit`.

| Bảng | SubModule | Cách truy cập |
|------|-----------|--------------|
| `og_tickets` | `PMC/OgTicket` | Import trực tiếp Model |
| `og_ticket_assignees` | `PMC/OgTicket` | Query trực tiếp pivot |
| `quotes` | `PMC/Quote` | Qua relationship `Order::quote()` hoặc join |
| `orders` | `PMC/Order` | Import trực tiếp Model |
| `receivables` | `PMC/Receivable` | Qua relationship `order.receivable()` hoặc join |
| `order_lines` | `PMC/Order` | Qua relationship `Order::lines()` |
| `catalog_items` | `PMC/Catalog` | Join theo `order_lines.reference_id` |
| `service_categories` | `PMC/Catalog` | Join từ `catalog_items.service_category_id` |
| `projects` | `PMC/Project` | Resolve tên dự án |
| `accounts` | `PMC/Account` | Resolve tên nhân viên |

## 8. Cấu trúc SubModule

```text
app/Modules/PMC/src/Report/
└── RevenueTicket/
    ├── Controllers/
    │   └── RevenueTicketReportController.php
    ├── Contracts/
    │   └── RevenueTicketReportServiceInterface.php
    ├── Services/
    │   └── RevenueTicketReportService.php
    ├── Repositories/
    │   └── RevenueTicketReportRepository.php
    ├── Requests/
    │   └── RevenueTicketReportRequest.php
    └── Resources/
        ├── RevenueTicketSummaryResource.php
        ├── RevenueTicketByCategoryResource.php
        ├── RevenueTicketByStaffResource.php
        ├── RevenueTicketDailyResource.php
        └── RevenueTicketDetailResource.php
```

> Không tạo Model, Migration, Factory, Seeder.

## 9. Routes

```php
// app/Modules/PMC/routes/api.php
Route::prefix('reports/revenue-ticket')->group(function (): void {
    Route::get('/summary', [RevenueTicketReportController::class, 'summary']);
    Route::get('/by-category', [RevenueTicketReportController::class, 'byCategory']);
    Route::get('/by-staff', [RevenueTicketReportController::class, 'byStaff']);
    Route::get('/daily', [RevenueTicketReportController::class, 'daily']);
    Route::get('/details', [RevenueTicketReportController::class, 'details']);
});
```

> URL đầy đủ: `/api/v1/pmc/reports/revenue-ticket/...`.

## 10. Permission

Dùng permission: `receivables.view`.

Lý do:

- Đây là report doanh thu/tài chính
- Cần đồng bộ với logic doanh thu đang dùng ở báo cáo tài chính khác
- Không mở rộng quyền xem ticket chi tiết beyond scope aggregate

> Sau này nếu cần tách quyền riêng, tạo `reports.revenue-ticket.view`.

## 11. Ghi chú kỹ thuật

### 11.1 Base query đề xuất

Base query nên đi từ `og_tickets`, join sang `quotes`, `orders`, `receivables`, sau đó resolve thêm:

- owner báo cáo
- category ticket
- project resolved

Pseudo fields:

```text
ticket_id
project_id
project_name
completed_date
owner_account_id
owner_name
ticket_category
revenue
```

Sau đó reuse base dataset cho tất cả endpoint aggregate để đảm bảo số liệu khớp nhau.

### 11.2 Owner báo cáo và category đều là rule dẫn xuất

Hai field sau **không tồn tại trực tiếp** trong schema hiện tại:

- `report_owner_*`
- `ticket_category`

Vì vậy repository nên gom chúng thành 1 lớp mapping chung hoặc 1 subquery materialized trong PHP/Collection trước khi aggregate.

### 11.3 Khác biệt với mock

- Mock gọi là `category ticket`, nhưng repo hiện chưa có field category trên ticket
- Spec này chọn hướng **suy ra category từ order lines**
- Nếu sau này `OgTicket` có tags/category chính thức, cần update rule 5.4 để dùng nguồn chuẩn

## 12. Checklist triển khai BE

- [ ] Tạo submodule `PMC/Report/RevenueTicket`
- [ ] `RevenueTicketReportRequest` với rules cho `project_id`, `date_from`, `date_to`
- [ ] `RevenueTicketReportRepository` với base query và 5 methods aggregate
- [ ] `RevenueTicketReportService` + interface
- [ ] `RevenueTicketReportController` với 5 endpoints
- [ ] Resources cho summary, by-category, by-staff, daily, details
- [ ] Đăng ký binding trong `PMCServiceProvider`
- [ ] Routes `/api/v1/pmc/reports/revenue-ticket/*`
- [ ] Feature tests cho summary, filter ngày, filter dự án, owner fallback, category fallback
