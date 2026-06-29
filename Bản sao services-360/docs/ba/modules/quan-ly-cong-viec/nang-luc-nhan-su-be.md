# Năng lực nhân sự — Đặc tả kỹ thuật Backend

> Module: `PMC/Workforce/Capacity` (read-only aggregation) | Ngày tạo: 2026-04-15 | Trạng thái: Draft

## 1. Tổng quan

Màn hình "Năng lực nhân sự" cho **điều phối** xem nhanh tải việc và chất lượng phục vụ của từng nhân sự:

- Mỗi nhân sự active tham gia **dự án** nào.
- **Khối lượng phân công** theo loại (khảo sát / sửa chữa) và theo trạng thái (chờ / đang làm / xong).
- **% tải ước lượng** so với ngưỡng việc song song cấu hình.
- **Điểm đánh giá trung bình (ĐTB)** thang 1–5 gom từ duy nhất nguồn `og_tickets.resident_rating` (cư dân chấm ticket — đã có sẵn).

### 1.1 Scope của spec này

Đây là **feature read-only, computed** — không tạo bảng/entity mới, **không thêm trường nào**. Tầng aggregation đọc từ các bảng sẵn có:

- `accounts`, `account_projects` (đã có trong PMC/Account + PMC/Project).
- `og_tickets`, `og_ticket_assignees` (PMC/OgTicket). Đã có sẵn `resident_rating`, `completed_at`, `status`.
- `projects`, `job_titles` (PMC/Project, PMC/JobTitle).

### 1.2 Ánh xạ khái niệm mockup → BE

Mockup dùng entity `WorkAssignment` gắn nhân sự với **ticket** (survey) hoặc **order** (repair). BE hiện tại **không có** bảng phân công riêng — chỉ có pivot `og_ticket_assignees`. Để tránh tạo bảng thừa, tầng aggregation suy ra:

| Khái niệm mockup | Nguồn BE | Quy tắc suy ra |
|------------------|----------|----------------|
| 1 `WorkAssignment` | 1 dòng `og_ticket_assignees` | Mỗi cặp `(og_ticket_id, account_id)` = 1 phân công |
| `type = survey` | Ticket ở giai đoạn khảo sát / báo giá | `og_ticket.status` ∈ `{received, assigned, surveying, quoted, approved, rejected}` |
| `type = repair` | Ticket đã lên đơn, đang thi công / hoàn tất | `og_ticket.status` ∈ `{ordered, in_progress, completed}` |
| `status = pending` | Phân công chưa bắt đầu | `og_ticket.status` ∈ `{received, assigned}` |
| `status = in_progress` | Đang xử lý (lifecycle còn mở) | `og_ticket.status` ∈ `{surveying, quoted, approved, ordered, in_progress}` |
| `status = completed` | Đã xong | `og_ticket.status = completed` |

> Tương lai có thể tách bảng `order_assignees` nếu BA xác định nhân sự khảo sát khác nhân sự thi công. Khi đó bổ sung source thứ 2 vào aggregation (không phá shape API).

## 2. Entities

### 2.1 Không có bảng mới

Feature không tạo bảng. Các trường dùng cho aggregation **đã tồn tại**:

| Nguồn | Trường | Module đã có |
|-------|--------|-------------|
| `og_tickets` | `status`, `resident_rating`, `completed_at` | PMC/OgTicket |
| `og_ticket_assignees` | `(og_ticket_id, account_id)` | PMC/OgTicket |
| `accounts` | `id`, `full_name`, `employee_code`, `job_title_id`, `active` | PMC/Account |
| `account_projects` | `(account_id, project_id)` | PMC/Project |
| `projects` | `id`, `name` | PMC/Project |
| `job_titles` | `id`, `name` | PMC/JobTitle |

### 2.2 Index bổ sung (tối ưu aggregation)

```php
Schema::table('og_ticket_assignees', function (Blueprint $table): void {
    $table->index(['account_id', 'og_ticket_id']);
});
Schema::table('og_tickets', function (Blueprint $table): void {
    $table->index(['status', 'resident_rating']);
});
```

> Index `account_id` trên `og_ticket_assignees` đã có (migration `2026_04_15_122100`). Bổ sung composite `(account_id, og_ticket_id)` nếu query plan cần.

## 3. Enums

### 3.1 WorkforceAssignmentType (derived, không lưu DB)

| Key | Value | Label (VI) | Quy tắc suy ra |
|-----|-------|------------|----------------|
| Survey | `survey` | Khảo sát | `og_ticket.status` ∈ `{received, assigned, surveying, quoted, approved, rejected}` |
| Repair | `repair` | Sửa chữa | `og_ticket.status` ∈ `{ordered, in_progress, completed}` |

### 3.2 WorkforceAssignmentState (derived)

| Key | Value | Label (VI) | Quy tắc |
|-----|-------|------------|---------|
| Pending | `pending` | Chờ | Ticket vừa tiếp nhận, chưa đi vào quy trình (received/assigned) |
| InProgress | `in_progress` | Đang làm | Ticket đang trong lifecycle còn mở (surveying/quoted/approved/ordered/in_progress) |
| Completed | `completed` | Xong | `og_ticket.status = completed` |

> **Ghi chú**: `ordered` gộp vào `in_progress` — chọn định nghĩa "active = lifecycle còn mở" (Phương án B). Mọi ticket chưa đóng đều tính vào tải của nhân sự, bất kể phase. Ticket `rejected` / `cancelled` bị loại khỏi aggregation (không vào bucket nào).

> Hai enum này **chỉ dùng trong service layer** — không viết file PHP Enum nếu chỉ suy ra nội bộ. Nếu cần expose để filter, tạo enum `WorkforceAssignmentType` thuần PHP.

## 4. API Endpoints

| Action | Method | URL | Request Class |
|--------|--------|-----|---------------|
| Danh sách năng lực | GET | `/api/v1/pmc/workforce/capacity` | `ListWorkforceCapacityRequest` |

> Single endpoint — feature thuần read-only. Không có create/update/delete.

### 4.1 Query params

| Field | Rules | Mô tả |
|-------|-------|-------|
| `project_id` | `nullable`, `integer`, `Rule::exists('projects','id')` | `null`/omit = tất cả dự án. Có = chỉ account thuộc pivot `account_projects` |
| `search` | `nullable`, `string`, `max:100` | Tìm theo `accounts.full_name`, `accounts.employee_code`, `job_titles.name`. Case-insensitive, Unicode |

### 4.2 Response shape

```json
{
  "success": true,
  "data": {
    "summary": {
      "staff_count": 12,
      "total_pending": 7,
      "total_in_progress": 9,
      "total_completed": 34,
      "avg_load_percent": 42,
      "pooled_avg_rating": 4.3,
      "total_rating_events": 18,
      "staff_with_ratings": 8,
      "parallel_capacity": 4
    },
    "rows": [
      {
        "account_id": 101,
        "full_name": "Nguyễn Văn A",
        "employee_code": "NV001",
        "job_title_name": "Kỹ thuật viên",
        "project_names": ["Vinhomes Ocean Park", "Masteri Thảo Điền"],
        "survey_count": 3,
        "repair_count": 5,
        "pending": 2,
        "in_progress": 4,
        "completed": 2,
        "load_percent": 100,
        "avg_rating": 4.5,
        "rating_count": 3
      }
    ]
  }
}
```

- **Không** paginate — số nhân sự active thường < 200. Nếu > 500 → response 422 với message `"Quá nhiều nhân sự. Vui lòng lọc theo dự án."` (đồng bộ với `schedule-slot-be.md`).
- Sort mặc định: `full_name` ASC (Unicode, dùng `Str::lower` + so sánh theo locale vi khi cần).

## 5. Validation Rules

### 5.1 `ListWorkforceCapacityRequest`

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `project_id` | `['nullable','integer', Rule::exists('projects','id')]` | `project_id.exists` = "Dự án không tồn tại." |
| `search` | `['nullable','string','max:100']` | `search.max` = "Từ khóa tìm tối đa 100 ký tự." |

## 6. Business Rules

- [ ] **Chỉ nhân sự active** (`accounts.active = true`) được liệt kê. Nhân sự bị vô hiệu không xuất hiện kể cả khi vẫn còn ticket gán.
- [ ] **Lọc dự án** dựa trên pivot `account_projects` (account thuộc dự án) — KHÔNG dựa trên ticket. Nhân sự ở trong dự án nhưng chưa có phân công vẫn hiển thị (tải = 0).
- [ ] **`load_percent`** = `min(100, round((pending + in_progress) / PARALLEL_CAPACITY * 100))`. `PARALLEL_CAPACITY` đọc từ config `config('workforce.parallel_capacity', 4)`.
- [ ] **`avg_rating`** tính từ mọi `og_tickets.resident_rating` ≠ null mà nhân sự là assignee (pivot `og_ticket_assignees`). Đây là nguồn điểm **duy nhất**.
- [ ] **Trùng điểm cho phép**: 1 ticket có 2 assignee → cả 2 đều nhận điểm `resident_rating`. Không chia đôi.
- [ ] **`pooled_avg_rating` (KPI nhóm)** = trung bình có trọng số theo số lượt:
  `sum(row.avg_rating * row.rating_count) / sum(row.rating_count)`. Làm tròn 1 chữ số thập phân. `null` nếu tổng lượt = 0.
- [ ] **Hiệu suất**: query chính dưới 500 ms cho 200 nhân sự × 1000 ticket (index composite `(account_id, og_ticket_id)` + eager load).
- [ ] **Sắp xếp**: `full_name` ASC. Ổn định (deterministic).

## 7. Presenter Output

- Resource: `WorkforceCapacityRowResource extends BaseResource`, `WorkforceCapacitySummaryResource extends BaseResource`.
- Response top-level dùng envelope `{ success, data: { summary, rows } }` (đồng bộ convention hiện tại).
- **Không** có `id`, `created_at`, `updated_at` (đây là aggregation, không phải entity).
- Trường enum-like KHÔNG lồng `{ value, label }` vì các cột số liệu là integer/float thuần — label hiển thị do FE đảm nhận.

## 8. Cross-Module Dependencies

Feature nằm trong `PMC/Workforce/Capacity` (submodule mới trong PMC). Vì PMC là **top-level module**, và các nguồn dữ liệu `Account`, `Project`, `JobTitle`, `OgTicket`, `Order`, `Quote` **đều là submodules trong PMC**, theo convention của dự án:

- **KHÔNG cần** ExternalService — import Repository trực tiếp qua constructor DI.
- Các Repository cần inject vào `WorkforceCapacityService`:

| Repository | Dùng để |
|-----------|---------|
| `AccountRepository` | Lấy account active, kèm `jobTitle`, `projects` |
| `OgTicketRepository` | Eager load assignees + status + rating |
| `ProjectRepository` (optional) | Validate `project_id` filter |

> Không module ngoài PMC (Platform, Requester, v.v.) được tham chiếu. Không cần ExternalService interface.

## 9. Migration Preview

Feature **không tạo bảng**. Chỉ có:

1. **Index bổ sung** (optional, chỉ add nếu EXPLAIN cho thấy bottleneck):

```php
// database/migrations/tenant/2026_04_XX_add_workforce_indexes.php
Schema::table('og_ticket_assignees', function (Blueprint $table): void {
    $table->index(['account_id', 'og_ticket_id'], 'og_ticket_assignees_account_ticket_idx');
});
```

2. **Config file mới** `backend/config/workforce.php`:

```php
<?php

return [
    'parallel_capacity' => env('WORKFORCE_PARALLEL_CAPACITY', 4),
];
```

## 10. Checklist triển khai BE

- [ ] `backend/config/workforce.php` + register trong `bootstrap/providers.php` nếu cần publish.
- [ ] Submodule `PMC/Workforce/Capacity` (cấu trúc: `Controllers`, `Services`, `Contracts`, `Resources`, `Requests`).
- [ ] `ListWorkforceCapacityRequest` — validate `project_id`, `search`.
- [ ] `WorkforceCapacityServiceInterface` + `WorkforceCapacityService`:
  - Method `getCapacity(?int $projectId, ?string $search): array` trả `['summary' => ..., 'rows' => ...]`.
  - Logic aggregation gọi qua `AccountRepository`, `OgTicketRepository` (không gọi `Model::query()` trực tiếp).
- [ ] `WorkforceCapacityRowResource`, `WorkforceCapacitySummaryResource` kế thừa `BaseResource`.
- [ ] `WorkforceCapacityController@index` (single action) → `GET /api/v1/pmc/workforce/capacity`.
- [ ] Route đăng ký trong `routes/api.php` hoặc route file của submodule (đồng bộ convention PMC).
- [ ] PSR-4 mappings trong `composer.json` nếu là submodule mới.
- [ ] Feature test `ListWorkforceCapacityTest`:
  - Unauthenticated → 401.
  - Happy path (tất cả dự án, không search) → 200 + shape đúng.
  - Filter `project_id` → chỉ account pivot thuộc dự án.
  - Filter `search` → match `full_name`, `employee_code`, `job_title_name`.
  - `project_id` không tồn tại → 422.
  - `search` > 100 ký tự → 422.
  - Nhân sự `active = false` không xuất hiện.
  - Ticket bị gán 2 assignee → cả 2 đều tăng count tương ứng.
  - Rating tính đúng từ `og_tickets.resident_rating` (bỏ qua ticket chưa chấm).
  - `pooled_avg_rating` trung bình có trọng số đúng.
  - Hiệu suất: seed 200 account × 1000 ticket → dưới 1s (smoke).
- [ ] Pint + typecheck (`make format`, `make lint`).
- [ ] Scramble API doc (`@tags Workforce`, description, return shape).

## 11. Ghi chú kỹ thuật

- Toàn bộ logic aggregation **đặt trong Service** (`WorkforceCapacityService`). Controller chỉ validate + gọi service + wrap Resource.
- Không dùng `DB::raw` / subquery thô — ưu tiên eager load + aggregate trong PHP (dữ liệu đã về memory do không paginate).
- Pattern tham khảo: `schedule-slot-be.md` (cùng kiểu compute-in-PHP cho aggregation read-only).
- `PARALLEL_CAPACITY` hiện mock hằng số. Tương lai thay bằng cấu hình theo `job_title` hoặc `project`, tầng API vẫn giữ nguyên shape.

## Tài liệu liên quan

- [Năng lực nhân sự — FE spec](./nang-luc-nhan-su-fe.md)
- [Schedule Slot — BE spec](../hrm/schedule-slot-be.md) (pattern aggregation tương tự)
- [OgTicket — BE spec](../pmc/og-ticket-be.md) (`resident_rating`, `og_ticket_assignees`)
