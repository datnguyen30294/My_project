# Báo cáo SLA - Đặc tả kỹ thuật Backend

> Module: `PMC/Report/Sla` | Ngày tạo: 2026-04-13 | Trạng thái: Draft

## 1. Tổng quan

Báo cáo SLA là tính năng **read-only**, tổng hợp dữ liệu từ `og_tickets` + `og_ticket_lifecycle_segments` để đánh giá chất lượng xử lý ticket theo cam kết SLA. Không tạo bảng/model mới — chỉ thêm Service + Controller + Resource để aggregate và trả về dữ liệu.

`Report` là **submodule của PMC** (tenant), chứa tất cả báo cáo. `Sla` là submodule con đầu tiên. Sau này thêm `Revenue`, `Csat`... cùng cấp. Vì cùng PMC → import trực tiếp Model/Repository, **không cần ExternalService**.

**Data source:**

| Bảng | Mục đích |
|------|----------|
| `og_tickets` | Dữ liệu chính: `sla_quote_due_at`, `sla_completion_due_at`, `status`, `project_id`, `received_at` |
| `og_ticket_lifecycle_segments` | Lịch sử status: `started_at`, `ended_at`, `cycle`, `assignee_id` → tính thời gian xử lý, backtrack (mở lại) |
| `og_ticket_assignees` | Pivot: ticket ↔ account (nhân viên xử lý) |
| `og_ticket_tags` | Tags của ticket (many-to-many) → dùng làm category trong báo cáo |
| `tickets` (Platform) | Lấy `code` (ticket code, format `TK-{year}-{seq}`) qua dynamic relationship |
| `projects` | Tên dự án (cùng PMC module) |
| `accounts` | Tên nhân viên (cùng PMC module) |

**Mô hình SLA 2 giai đoạn:**

```
Giai đoạn 1 (Báo giá):   received_at ──────► sla_quote_due_at
                          Thực tế: received_at → segment đầu tiên status=quoted.started_at

Giai đoạn 2 (Hoàn thành): approved ──────► sla_completion_due_at
                          Thực tế: segment status=approved.started_at → segment status=completed.started_at
```

## 2. Entities

**Không tạo entity/table mới cho báo cáo.** Feature này đọc từ các bảng đã có.

> **Lưu ý:** Feature tags cho `og_tickets` cần được implement trước (hoặc cùng lúc) với báo cáo SLA. Xem spec riêng: `docs/ba/modules/pmc/og-ticket-tags-be.md` (cần tạo).

## 3. API Endpoints

| Action | Method | URL | Request Class | Mô tả |
|--------|--------|-----|---------------|-------|
| Summary KPI | GET | `/api/v1/pmc/reports/sla/summary` | `SlaReportRequest` | 4 chỉ số KPI tổng hợp |
| Xu hướng theo tháng | GET | `/api/v1/pmc/reports/sla/trend` | `SlaReportRequest` | Tỷ lệ đúng hạn theo tháng |
| Theo dự án | GET | `/api/v1/pmc/reports/sla/by-project` | `SlaReportRequest` | Bảng tổng hợp theo dự án |
| Theo nhân viên | GET | `/api/v1/pmc/reports/sla/by-staff` | `SlaReportRequest` | Bảng tổng hợp theo nhân viên × dự án |
| Theo ticket | GET | `/api/v1/pmc/reports/sla/by-ticket` | `SlaReportRequest` | Chi tiết từng ticket, có phân trang |

> Tất cả endpoint dùng chung `SlaReportRequest` vì filter giống nhau.

## 4. Validation Rules

### SlaReportRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `project_id` | `nullable`, `integer`, `exists:projects,id` | Dự án không tồn tại |
| `date_from` | `nullable`, `date_format:Y-m-d` | Ngày bắt đầu không đúng định dạng |
| `date_to` | `nullable`, `date_format:Y-m-d`, `after_or_equal:date_from` | Ngày kết thúc phải >= ngày bắt đầu |
| `months` | `nullable`, `integer`, `min:1`, `max:24` | Số tháng xu hướng (chỉ dùng cho endpoint trend, default: 6) |
| `per_page` | `nullable`, `integer`, `min:1`, `max:100` | Số bản ghi/trang (chỉ dùng cho by-ticket, default: 15) |

> Nếu không truyền `date_from`/`date_to`, mặc định lấy 30 ngày gần nhất.

## 5. Business Rules

### 5.1 Định nghĩa SLA 2 giai đoạn

Mỗi ticket có hai SLA deadline độc lập (đã có trên `og_tickets`):

- **Giai đoạn 1 — Báo giá (`sla_quote_due_at`):** Set khi claim ticket. Deadline để OG gửi báo giá cho cư dân. Hoàn thành khi ticket chuyển sang status `quoted` (hoặc cao hơn).
- **Giai đoạn 2 — Hoàn thành (`sla_completion_due_at`):** Set khi cư dân chấp thuận báo giá (status → `approved`). Deadline để hoàn thành công việc. Hoàn thành khi ticket chuyển sang status `completed`.

**Vi phạm:** Ticket được tính **vi phạm** nếu:
- GĐ1: thời điểm đạt `quoted` > `sla_quote_due_at`, HOẶC
- GĐ2: thời điểm đạt `completed` > `sla_completion_due_at`

> Vi phạm bất kỳ giai đoạn nào → ticket bị đánh dấu vi phạm.

### 5.2 Cách xác định thời điểm hoàn thành từng giai đoạn

Dùng `og_ticket_lifecycle_segments` để tìm thời điểm chính xác:

```
GĐ1 completed_at = MIN(started_at) của segment có status IN ('quoted', 'approved', 'ordered', 'in_progress', 'completed')
                    WHERE cycle = 0 (lần đầu tiên)

GĐ2 completed_at = MIN(started_at) của segment có status = 'completed'
                    WHERE cycle_confirmed = true
```

> Fallback: nếu ticket cũ không có lifecycle segments, dùng `og_tickets.updated_at` khi `status = completed`.

### 5.3 Công thức tính KPI

**Tỷ lệ đúng hạn (`on_time_rate`, %):**
```
on_time_rate = COUNT(ticket không vi phạm GĐ1 AND không vi phạm GĐ2) / COUNT(ticket completed trong kỳ) × 100
```
- Chỉ tính ticket có `status = completed`.
- Ticket thiếu `sla_quote_due_at` hoặc `sla_completion_due_at` → bỏ qua giai đoạn tương ứng (coi là đúng hạn cho GĐ đó).

**Ticket vi phạm (`breached_count`):**
```
breached_count = COUNT(ticket completed trong kỳ có ít nhất 1 giai đoạn SLA vi phạm)
```

**Thời gian xử lý median (`median_resolution_hours`, giờ):**
```
Với mỗi ticket completed: resolution_hours = (completed_at_segment.started_at - og_ticket.received_at) / 3600
median_resolution_hours = MEDIAN(resolution_hours[])
```
> Nếu không có segment `completed`, fallback `og_tickets.updated_at`.

**Tỷ lệ mở lại (`reopened_rate`, %):**
```
reopened_rate = COUNT(ticket completed có MAX(cycle) > 0) / COUNT(ticket completed trong kỳ) × 100
```
> `cycle > 0` = ticket đã quay lại ít nhất 1 lần (backtrack trong lifecycle).

### 5.4 Tổng hợp theo dự án (by-project)

Nhóm theo `og_tickets.project_id`. Mỗi dòng:

| Output field | Tính từ |
|--------------|---------|
| `project_name` | `projects.name` |
| `tickets_closed` | `COUNT(status = completed trong kỳ)` |
| `on_time_rate` | Công thức 5.3, scope = project |
| `breached` | `COUNT(vi phạm trong project)` |
| `avg_hours` | `AVG(resolution_hours)` — trung bình, không phải median |

### 5.5 Tổng hợp theo nhân viên (by-staff)

Nhóm theo `(project_id, assignee_id)` từ `og_ticket_assignees`. Mỗi dòng:

| Output field | Tính từ |
|--------------|---------|
| `project_name` | `projects.name` |
| `staff_name` | `accounts.full_name` |
| `tickets_handled` | `COUNT(ticket thuộc assignee trong kỳ)` |
| `on_time_rate` | Công thức 5.3, scope = assignee × project |
| `breached` | `COUNT(vi phạm trong nhóm)` |
| `avg_resolution_hours` | `AVG(resolution_hours)` |

> Một ticket có nhiều assignee → đếm cho MỖI assignee (đồng trách nhiệm).

### 5.6 Chi tiết theo ticket (by-ticket)

Mỗi ticket có thể sinh **1–2 dòng** (GĐ1 và/hoặc GĐ2):

| Output field | Tính từ |
|--------------|---------|
| `ticket_code` | `ticket.code` — lấy qua dynamic relationship `og_ticket.ticket()` (format `TK-{year}-{seq}`, VD: `TK-2026-001`) |
| `project_name` | `projects.name` |
| `tags` | Mảng tên tags từ `og_ticket_tags` — dùng làm category hiển thị trên báo cáo (VD: `["PCCC", "Sự cố kỹ thuật"]`) |
| `phase` | `'Giai đoạn 1'` hoặc `'Giai đoạn 2'` |
| `sla_target_hours` | `(sla_due_at - start_point) / 3600` (tính ngược ra mục tiêu giờ) |
| `actual_hours` | Thời gian thực tế hoàn thành giai đoạn |
| `result` | `'on_time'` hoặc `'breached'` |

> `tags`: Lấy từ bảng `og_ticket_tags` (many-to-many). Tags được tự động gắn từ danh mục (category) khi cư dân tạo yêu cầu, và có thể thêm/sửa/xóa ở màn edit OgTicket. Trong báo cáo SLA, hiển thị dạng mảng chuỗi (VD: `["PCCC"]`).

### 5.7 Xu hướng theo tháng (trend)

Nhóm ticket completed theo tháng (`completed_segment.started_at`), tính `on_time_rate` mỗi tháng.

| Output field | Tính từ |
|--------------|---------|
| `month` | Format `'TYYYY-MM'` hoặc `'Tn'` (VD: `'T3'`, `'T10'`) |
| `on_time_rate` | Công thức 5.3, scope = tháng đó |

> Default: 6 tháng gần nhất. Có thể thay đổi qua param `months`.

### 5.8 Mục tiêu SLA

Hằng số hệ thống: `SLA_TARGET_PERCENT = 90`. Trả về trong response summary để FE vẽ đường mục tiêu trên biểu đồ.

> Sau này có thể cấu hình qua SystemSetting (`og_ticket.sla_target_percent`).

### 5.9 Period label

Trả về label mô tả khoảng thời gian đang xem, VD: `"30 ngày gần nhất"`, `"01/03/2026 - 31/03/2026"`.

## 6. Resource Output

### 6.1 Summary Response

```json
{
  "success": true,
  "data": {
    "period_label": "30 ngày gần nhất",
    "sla_target_percent": 90,
    "on_time_rate": 94.2,
    "breached_count": 23,
    "median_resolution_hours": 6.5,
    "reopened_rate": 2.1
  }
}
```

### 6.2 Trend Response

```json
{
  "success": true,
  "data": [
    { "month": "T10", "on_time_rate": 91.0 },
    { "month": "T11", "on_time_rate": 93.0 },
    { "month": "T12", "on_time_rate": 92.0 },
    { "month": "T1", "on_time_rate": 95.0 },
    { "month": "T2", "on_time_rate": 94.0 },
    { "month": "T3", "on_time_rate": 94.2 }
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
      "tickets_closed": 412,
      "on_time_rate": 96.1,
      "breached": 16,
      "avg_hours": 5.2
    }
  ]
}
```

### 6.4 By-Staff Response

```json
{
  "success": true,
  "data": [
    {
      "project_id": 1,
      "project_name": "Vinhomes Ocean Park",
      "staff_id": 5,
      "staff_name": "Nguyễn Văn An",
      "tickets_handled": 86,
      "on_time_rate": 96.5,
      "breached": 3,
      "avg_resolution_hours": 5.1
    }
  ]
}
```

### 6.5 By-Ticket Response (paginated)

```json
{
  "success": true,
  "data": [
    {
      "ticket_id": 891,
      "ticket_code": "TK-2026-001",
      "project_name": "Vinhomes Ocean Park",
      "tags": ["PCCC", "Sự cố kỹ thuật"],
      "phase": "Giai đoạn 1",
      "sla_target_hours": 24,
      "actual_hours": 18,
      "result": { "value": "on_time", "label": "Đúng hạn" }
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 156
  }
}
```

> `result` dùng format enum `{ value, label }` theo convention dự án.

## 7. Dependencies (cùng PMC — import trực tiếp)

**Không cần ExternalService** — `Report` là submodule trong PMC, import trực tiếp Model/Repository của các submodule anh em.

| Bảng | SubModule | Cách truy cập |
|------|-----------|--------------|
| `og_tickets` | `PMC/OgTicket` | Import trực tiếp Model |
| `og_ticket_lifecycle_segments` | `PMC/OgTicket` | Import trực tiếp Model |
| `og_ticket_assignees` | `PMC/OgTicket` | Pivot, qua `OgTicket::assignees()` |
| `og_ticket_tags` | `PMC/OgTicket` | Relationship trên OgTicket (cần implement) |
| `tickets` | `Platform/Ticket` | Dynamic relationship `OgTicket::ticket()` — đã có sẵn |
| `projects` | `PMC/Project` | Import trực tiếp Model |
| `accounts` | `PMC/Account` | Import trực tiếp Model |

## 8. Cấu trúc SubModule

```
app/Modules/PMC/src/Report/
└── Sla/
    ├── Controllers/
    │   └── SlaReportController.php
    ├── Contracts/
    │   └── SlaReportServiceInterface.php
    ├── Services/
    │   └── SlaReportService.php
    ├── Repositories/
    │   └── SlaReportRepository.php
    ├── Requests/
    │   └── SlaReportRequest.php
    └── Resources/
        ├── SlaSummaryResource.php
        ├── SlaTrendResource.php
        ├── SlaByProjectResource.php
        ├── SlaByStaffResource.php
        └── SlaByTicketResource.php
```

> Đặt trong `PMC/src/Report/Sla/` — submodule con của PMC.
> Không tạo Model, Migration, Factory, Seeder — feature read-only.
> Sau này thêm `PMC/src/Report/Revenue/`, `PMC/src/Report/Csat/`... cùng cấp với `Sla`.
> Service binding đăng ký trong `PMCServiceProvider`.

## 9. Routes

```php
// app/Modules/PMC/routes/api.php (thêm vào file routes hiện có)
Route::prefix('reports/sla')->group(function (): void {
    Route::get('/summary', [SlaReportController::class, 'summary']);
    Route::get('/trend', [SlaReportController::class, 'trend']);
    Route::get('/by-project', [SlaReportController::class, 'byProject']);
    Route::get('/by-staff', [SlaReportController::class, 'byStaff']);
    Route::get('/by-ticket', [SlaReportController::class, 'byTicket']);
});
```

> Dùng chung file routes của PMC (đã có middleware `tenant` + `auth:sanctum`).
> URL đầy đủ: `/api/v1/pmc/reports/sla/...`. Sau này: `reports/revenue/...`, `reports/csat/...`

## 10. Permission

Dùng permission hiện có: `og-tickets.view` — ai xem được ticket thì xem được báo cáo SLA.

> Sau này nếu cần tách quyền riêng, tạo `reports.sla.view`.

## 11. Ghi chú kỹ thuật

### 11.1 Performance

- Báo cáo aggregate nhiều ticket → nên dùng raw query (Query Builder) trong Repository, không dùng Eloquent collection.
- Median tính trong PHP (lấy tất cả resolution_hours rồi sort + lấy giữa), hoặc dùng `PERCENTILE_CONT(0.5)` của PostgreSQL.
- Cân nhắc cache nếu data lớn (Redis, TTL 5 phút).

### 11.2 Tags (thay cho category)

Category trong báo cáo SLA lấy từ **tags** của `og_tickets`. Tags hoạt động như hệ thống nhãn (label):

- **Nguồn gốc:** Khi cư dân tạo yêu cầu và chọn danh mục (VD: "PCCC"), hệ thống tự động gắn tag tương ứng vào og_ticket khi claim.
- **Chỉnh sửa:** OG có thể thêm/sửa/xóa tags ở màn edit og_ticket (gõ chữ + Enter để thêm tag mới).
- **Trong báo cáo:** Hiển thị mảng tags (VD: `["PCCC", "Sự cố kỹ thuật"]`), FE join thành chuỗi hiển thị.
- **Dependency:** Cần implement feature tags cho OgTicket trước (bảng pivot `og_ticket_tags`, Model, API update).

### 11.3 Ticket code

`og_tickets` không có field `code` riêng. Ticket code lấy từ **Platform/Ticket** qua dynamic relationship `og_ticket.ticket()`:
- Field: `tickets.code`
- Format: `TK-{year}-{sequence}` (VD: `TK-2026-001`)
- OgTicket Resource hiện đã trả `code` từ `$this->ticket->code` (xem `OgTicketListResource`, `OgTicketDetailResource`)
- Trong báo cáo: eager load `ticket` relationship khi query, trả `ticket.code` trong response.

## 12. Checklist triển khai BE

- [ ] SubModule structure: `app/Modules/PMC/src/Report/Sla/`
- [ ] `SlaReportRepository` — aggregate queries (Query Builder)
- [ ] `SlaReportService` implements `SlaReportServiceInterface`
- [ ] `SlaReportRequest` — validation rules
- [ ] Resources: `SlaSummaryResource`, `SlaTrendResource`, `SlaByProjectResource`, `SlaByStaffResource`, `SlaByTicketResource`
- [ ] `SlaReportController` — 5 endpoints
- [ ] Binding trong `PMCServiceProvider`
- [ ] Routes trong `PMC/routes/api.php`
- [ ] PSR-4 mapping trong `composer.json`
- [ ] Tests: feature tests cho mỗi endpoint
- [ ] `make format` + `make lint`
