# OG Ticket - Đặc tả kỹ thuật Backend

> Module: `PMC/OgTicket` | Ngày tạo: 2026-03-10 | Trạng thái: Draft

## 1. Tổng quan

Module quản lý ticket đã được **OG (Organization)** tiếp nhận. Khi OG claim 1 ticket từ pool (`Requester/Ticket`), hệ thống tạo `og_ticket` — bản snapshot dữ liệu gốc + các field xử lý nội bộ.

**Quan hệ với Requester/Ticket:**

```
Requester/Ticket (pool)          PMC/OgTicket (xử lý)
┌────────────┐                   ┌────────────────────┐
│  ticket    │     claim         │  og_ticket         │
│  (gốc)    │ ──────────────►   │  (snapshot + xử lý)│
│            │     release       │                    │
│            │ ◄──────────────   │  status=cancelled  │
└────────────┘                   └────────────────────┘
```

**Flow:**
1. Account xem pool → GET `/pool` (gọi `TicketExternalService::getAvailableTickets()`)
2. Account claim ticket → POST `/claim` → tạo `og_ticket` (copy data) + set cờ trên ticket gốc
3. Account trong OG xử lý → UPDATE `og_ticket` (status, priority, assigned_to, sla, ...)
4. Hoàn thành → status = `completed` + cập nhật ticket gốc status = `completed`
5. Không xử lý được → status = `cancelled` + release ticket gốc → về pool

## 2. Entities

### 2.1 OgTicket

**Bảng:** `og_tickets`

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| Ticket gốc | `ticket_id` | `unsignedBigInteger` | required | Cross-module ref → tickets.id (NO FK, dùng dynamic relationship) |
| Tổ chức | `organization_id` | `unsignedBigInteger` | required, FK → organizations.id | OG xử lý (cùng PMC module) |
| **Snapshot từ ticket** | | | | |
| Tên người gửi | `requester_name` | `string(255)` | required | Copy from ticket |
| SĐT | `requester_phone` | `string(20)` | required | Copy from ticket |
| Căn hộ | `apartment_name` | `string(255)` | nullable | Copy from ticket |
| Dự án | `project_id` | `unsignedBigInteger` | required | Copy from ticket (cross-module ref → projects.id) |
| Tiêu đề | `subject` | `string(500)` | required | Copy from ticket |
| Mô tả | `description` | `text` | nullable | Copy from ticket |
| Kênh tiếp nhận | `channel` | `string(20)` | required | Copy from ticket (Enum TicketChannel) |
| **Fields xử lý** | | | | |
| Trạng thái | `status` | `string(20)` | required, default: 'received' | Enum OgTicketStatus |
| Ưu tiên | `priority` | `string(20)` | required, default: 'normal' | Enum OgTicketPriority |
| Ghi chú nội bộ | `internal_note` | `text` | nullable | Ghi chú riêng OG |
| Thời điểm nhận | `received_at` | `timestamp` | required | Khi OG claim |
| Người nhận | `received_by_id` | `unsignedBigInteger` | required, FK → accounts.id | Account claim (cùng PMC module) |
| Người thi công | `assigned_to_id` | `unsignedBigInteger` | nullable, FK → accounts.id | Account được phân công (cùng PMC module) |
| Hạn SLA | `sla_due_at` | `timestamp` | nullable | Thời hạn xử lý |
| Người tạo | `created_by` | `unsignedBigInteger` | nullable | Auditable |
| Người cập nhật | `updated_by` | `unsignedBigInteger` | nullable | Auditable |
| Timestamps | `created_at`, `updated_at` | `timestamp` | auto | |

**Đặc điểm:**
- **Không soft delete** — `cancelled` là status, không phải xóa
- Snapshot fields (requester_name, phone, apartment, subject, description, channel) **immutable** sau khi tạo
- `ticket_id` không dùng FK constraint (cross-module), dùng `resolveRelationUsing` để eager load
- `organization_id`, `received_by_id`, `assigned_to_id` dùng FK (cùng PMC module)

**Indexes:**
- `index('ticket_id')`
- `index('organization_id')`
- `index('status')`
- `index('received_by_id')`
- `index('assigned_to_id')`

**Relationships (cùng PMC module — FK trực tiếp):**
- `organization()` → `belongsTo(Organization::class)`
- `receivedBy()` → `belongsTo(Account::class, 'received_by_id')`
- `assignedTo()` → `belongsTo(Account::class, 'assigned_to_id')`

**Dynamic Relationship (cross-module — đăng ký trong ServiceProvider):**
- `ticket()` → `belongsTo(Ticket::class, 'ticket_id')` — via `resolveRelationUsing`

**Scopes:**
- `scopeActive(Builder $query)` — `where('status', '!=', 'cancelled')` (đang xử lý)
- `scopeByOrganization(Builder $query, int $orgId)` — lọc theo OG
- `scopeSearch(Builder $query, string $keyword)` — tìm theo `subject`, `requester_name`, hoặc `requester_phone`
- `scopeByStatus(Builder $query, OgTicketStatus $status)` — lọc theo trạng thái

## 3. Enums

### 3.1 OgTicketStatus

| Key | Value | Label (VI) | Mô tả |
|-----|-------|------------|-------|
| `Received` | `received` | Đã tiếp nhận | OG vừa claim, chưa xử lý |
| `Assigned` | `assigned` | Đã phân công | Đã assign nhân sự khảo sát |
| `Surveying` | `surveying` | Đang khảo sát | Nhân sự đang khảo sát |
| `Quoted` | `quoted` | Đã báo giá | Đã có báo giá gửi cư dân |
| `Approved` | `approved` | Đã chấp thuận | Cư dân đồng ý báo giá |
| `Rejected` | `rejected` | Từ chối | Cư dân từ chối báo giá |
| `Ordered` | `ordered` | Đã lên đơn | Đã tạo đơn hàng |
| `InProgress` | `in_progress` | Đang thực hiện | Đang sửa chữa |
| `Completed` | `completed` | Hoàn thành | Đã nghiệm thu |
| `Cancelled` | `cancelled` | Đã hủy | OG release / hủy |

**Luồng chuẩn:** `received` → `assigned` → `surveying` → `quoted` → `approved` → `ordered` → `in_progress` → `completed`

**Nhánh đặc biệt:**
- `rejected`: từ `quoted`/`approved`, quay lại chỉnh báo giá
- `cancelled`: từ bất kỳ trạng thái nào (release ticket về pool)

**Sync với ticket gốc (qua TicketExternalService):**

| OgTicket status | Ticket gốc status |
|----------------|-------------------|
| `received` | `received` (auto khi claim) |
| `assigned` → `in_progress` | `in_progress` |
| `completed` | `completed` |
| `cancelled` | `pending` (release về pool) |

### 3.2 OgTicketPriority

| Key | Value | Label (VI) | Mô tả |
|-----|-------|------------|-------|
| `Low` | `low` | Thấp | |
| `Normal` | `normal` | Bình thường | Mặc định |
| `High` | `high` | Cao | |
| `Urgent` | `urgent` | Khẩn cấp | |

## 4. API Endpoints

> Tất cả yêu cầu auth admin (Sanctum). Prefix: `/api/v1/pmc/og-tickets`

| Action | Method | URL | Request Class | Mô tả |
|--------|--------|-----|---------------|-------|
| Pool | GET | `/api/v1/pmc/og-tickets/pool` | `ListPoolRequest` | Ticket available từ pool (Requester/Ticket) |
| Claim | POST | `/api/v1/pmc/og-tickets/claim` | `ClaimTicketRequest` | Claim ticket → tạo og_ticket |
| List | GET | `/api/v1/pmc/og-tickets` | `ListOgTicketRequest` | Danh sách og_ticket của OG mình |
| Show | GET | `/api/v1/pmc/og-tickets/{ogTicket}` | — | Chi tiết og_ticket (eager load ticket gốc, organization, receivedBy, assignedTo) |
| Update | PUT | `/api/v1/pmc/og-tickets/{ogTicket}` | `UpdateOgTicketRequest` | Cập nhật fields xử lý |
| Release | PUT | `/api/v1/pmc/og-tickets/{ogTicket}/release` | `ReleaseOgTicketRequest` | Cancel og_ticket + release ticket về pool |
| History | GET | `/api/v1/pmc/og-tickets/history/{ticketId}` | — | Lịch sử các OG đã xử lý 1 ticket |

## 5. Validation Rules

### 5.1 ClaimTicketRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `ticket_id` | `['required', 'integer']` | Ticket là bắt buộc |

> `organization_id` lấy từ account đang đăng nhập (thuộc OG nào). `received_by_id` = auth user. `received_at` = now().

### 5.2 UpdateOgTicketRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `status` | `['required', 'string', Rule::in(OgTicketStatus::values())]` | Trạng thái không hợp lệ |
| `priority` | `['required', 'string', Rule::in(OgTicketPriority::values())]` | Mức ưu tiên không hợp lệ |
| `internal_note` | `['nullable', 'string']` | |
| `assigned_to_id` | `['nullable', 'integer', 'exists:accounts,id']` | Người thi công không tồn tại |
| `sla_due_at` | `['nullable', 'date']` | Hạn SLA không hợp lệ |

> Snapshot fields (requester_name, phone, apartment, subject, description, channel) **không cho sửa**.

### 5.3 ReleaseOgTicketRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `note` | `['nullable', 'string']` | |

> `note` ghi lý do release → lưu vào `internal_note` trước khi cancel.

### 5.4 ListOgTicketRequest

| Field | Rules | Mô tả |
|-------|-------|-------|
| `search` | `['nullable', 'string', 'max:255']` | Tìm theo `subject`, `requester_name`, `requester_phone` |
| `status` | `['nullable', 'string', Rule::in(OgTicketStatus::values())]` | Lọc theo trạng thái |
| `priority` | `['nullable', 'string', Rule::in(OgTicketPriority::values())]` | Lọc theo ưu tiên |
| `sort_by` | `['nullable', 'string', 'in:subject,status,priority,received_at,created_at']` | Trường sắp xếp |
| `sort_direction` | `['nullable', 'string', 'in:asc,desc']` | Hướng sắp xếp |
| `per_page` | `['nullable', 'integer', 'min:1', 'max:100']` | Số bản ghi mỗi trang |

> Tự lọc theo `organization_id` của account đang đăng nhập. Mặc định chỉ hiện `active` (status != cancelled).

### 5.5 ListPoolRequest

| Field | Rules | Mô tả |
|-------|-------|-------|
| `search` | `['nullable', 'string', 'max:255']` | Tìm theo `subject`, `requester_name`, `requester_phone` |
| `sort_by` | `['nullable', 'string', 'in:subject,created_at']` | Trường sắp xếp |
| `sort_direction` | `['nullable', 'string', 'in:asc,desc']` | Hướng sắp xếp |
| `per_page` | `['nullable', 'integer', 'min:1', 'max:100']` | Số bản ghi mỗi trang |

> Gọi `TicketExternalService::getAvailableTickets($filters)` — trả về ticket gốc chưa ai nhận.

## 6. Business Rules

### Claim
- [ ] Account phải thuộc 1 OG (có `organization_id`)
- [ ] Gọi `TicketExternalService::claimTicket(ticketId, orgId)` — fail nếu ticket đã bị claim (concurrent protection)
- [ ] Tạo `og_ticket` với snapshot data copy từ ticket gốc
- [ ] `received_at` = now(), `received_by_id` = auth account, `status` = `received`
- [ ] Ticket gốc: `status` = `received`, `claimed_by_org_id` = orgId, `claimed_at` = now()

### Update
- [ ] **Chỉ account thuộc OG đang giữ** mới được update
- [ ] Snapshot fields immutable — chỉ sửa được status, priority, internal_note, assigned_to_id, sla_due_at
- [ ] `assigned_to_id` phải là account thuộc cùng OG
- [ ] Validate status transition hợp lệ (xem luồng section 3.1)
- [ ] Khi status thay đổi sang `in_progress` hoặc `completed` → đồng bộ ticket gốc qua `TicketExternalService::updateTicketStatus()`

### Release (Cancel)
- [ ] **Chỉ account thuộc OG đang giữ** mới được release
- [ ] Set `og_ticket.status` = `cancelled`
- [ ] Ghi `note` vào `internal_note` (nếu có)
- [ ] Gọi `TicketExternalService::releaseTicket(ticketId)` → ticket gốc: `status` = `pending`, clear claimed
- [ ] `og_ticket` record giữ nguyên (không xóa) → phục vụ history

### History
- [ ] Query tất cả `og_tickets` theo `ticket_id` (bao gồm cancelled) → xem OG nào đã xử lý
- [ ] Bất kỳ account đã auth đều có thể xem history

### Authorization
- [ ] Pool: tất cả account đã auth
- [ ] Claim: account thuộc bất kỳ OG
- [ ] Update / Release: **chỉ** account thuộc OG đang giữ og_ticket
- [ ] Show: account thuộc OG đang giữ, hoặc admin
- [ ] History: tất cả account đã auth

## 7. Presenter Output

### 7.1 OgTicketResource (List)

```json
{
  "id": 1,
  "ticket_id": 5,
  "subject": "Hỏng máy lạnh",
  "requester_name": "Nguyễn Văn A",
  "requester_phone": "0901111111",
  "organization": {
    "id": 3,
    "name": "OG Bảo trì A"
  },
  "status": {
    "value": "assigned",
    "label": "Đã phân công"
  },
  "priority": {
    "value": "high",
    "label": "Cao"
  },
  "received_at": "2026-03-07 10:00:00",
  "received_by": {
    "id": 1,
    "name": "Trần Thị B"
  },
  "assigned_to": {
    "id": 2,
    "name": "Lê Văn C"
  },
  "sla_due_at": "2026-03-10 17:00:00",
  "created_at": "2026-03-07 10:00:00"
}
```

### 7.2 OgTicketResource (Show — Chi tiết)

```json
{
  "id": 1,
  "ticket_id": 5,
  "ticket": {
    "code": "TK-2026-005",
    "status": {
      "value": "in_progress",
      "label": "Đang xử lý"
    },
    "created_at": "2026-03-07 09:30:00"
  },
  "subject": "Hỏng máy lạnh",
  "description": "Máy lạnh phòng khách không lạnh.",
  "requester_name": "Nguyễn Văn A",
  "requester_phone": "0901111111",
  "apartment_name": "A-101",
  "project": {
    "id": 1,
    "name": "Chung cư Aurora"
  },
  "channel": {
    "value": "website",
    "label": "Website"
  },
  "organization": {
    "id": 3,
    "name": "OG Bảo trì A"
  },
  "status": {
    "value": "assigned",
    "label": "Đã phân công"
  },
  "priority": {
    "value": "high",
    "label": "Cao"
  },
  "internal_note": "Cần kiểm tra thêm gas máy lạnh",
  "received_at": "2026-03-07 10:00:00",
  "received_by": {
    "id": 1,
    "name": "Trần Thị B"
  },
  "assigned_to": {
    "id": 2,
    "name": "Lê Văn C"
  },
  "sla_due_at": "2026-03-10 17:00:00",
  "created_at": "2026-03-07 10:00:00",
  "updated_at": "2026-03-08 14:00:00"
}
```

> `ticket` field lấy từ dynamic relationship (`resolveRelationUsing`) — eager load ticket gốc để hiển thị `code` và `status` hiện tại.

### 7.3 PoolTicketResource (ticket available từ pool)

```json
{
  "id": 5,
  "code": "TK-2026-005",
  "requester_name": "Nguyễn Văn A",
  "requester_phone": "0901111111",
  "apartment_name": "A-101",
  "subject": "Hỏng máy lạnh",
  "description": "Máy lạnh phòng khách không lạnh.",
  "channel": {
    "value": "website",
    "label": "Website"
  },
  "created_at": "2026-03-07 09:30:00"
}
```

> Dữ liệu từ `TicketExternalService::getAvailableTickets()`. Format theo TicketResource của Requester/Ticket.

## 8. Cross-Module Communication

### 8.1 TicketExternalServiceInterface (PMC/OgTicket là consumer)

Đã đặc tả chi tiết trong `docs/ba/modules/ticket/ticket-be.md` section 8.2.

**Tóm tắt:**
- Interface: `app/Modules/PMC/src/OgTicket/ExternalServices/TicketExternalServiceInterface.php`
- Implementation: `app/Modules/PMC/src/OgTicket/ExternalServices/TicketExternalService.php`
- Implementation truy cập `\App\Modules\Requester\src\Ticket\Models\Ticket` trực tiếp
- Dynamic relationship `ticket()` đăng ký trong `OgTicketServiceProvider` via `resolveRelationUsing`
- Binding trong `OgTicketServiceProvider`

### 8.2 Tóm tắt dependencies

| Dependency | Loại | Mô tả |
|-----------|------|-------|
| `ticket_id` → Ticket | Cross-module (ExternalService + dynamic relationship) | Requester/Ticket module |
| `organization_id` → Organization | FK trực tiếp (cùng PMC) | |
| `received_by_id` → Account | FK trực tiếp (cùng PMC) | |
| `assigned_to_id` → Account | FK trực tiếp (cùng PMC) | |
| `project_id` → Project | Cross-module ref (NO FK) | Snapshot từ ticket, resolve qua ProjectExternalService khi cần hiển thị |

## 9. Migration Preview

```php
Schema::create('og_tickets', function (Blueprint $table) {
    $table->id();
    $table->unsignedBigInteger('ticket_id');                     // Cross-module ref (NO FK)
    $table->foreignId('organization_id')->constrained('organizations');

    // Snapshot từ ticket
    $table->string('requester_name', 255);
    $table->string('requester_phone', 20);
    $table->string('apartment_name', 255)->nullable();
    $table->unsignedBigInteger('project_id');                    // Cross-module ref (NO FK)
    $table->string('subject', 500);
    $table->text('description')->nullable();
    $table->string('channel', 20);

    // Fields xử lý
    $table->string('status', 20)->default('received');
    $table->string('priority', 20)->default('normal');
    $table->text('internal_note')->nullable();
    $table->timestamp('received_at');
    $table->foreignId('received_by_id')->constrained('accounts');
    $table->foreignId('assigned_to_id')->nullable()->constrained('accounts');
    $table->timestamp('sla_due_at')->nullable();

    $table->unsignedBigInteger('created_by')->nullable();
    $table->unsignedBigInteger('updated_by')->nullable();
    $table->timestamps();

    $table->index('ticket_id');
    $table->index('organization_id');
    $table->index('status');
    $table->index('received_by_id');
    $table->index('assigned_to_id');
});
```

## 10. Checklist triển khai BE

### Phase 1: OgTicket Entity
- [ ] Migration `create_og_tickets_table`
- [ ] Model `OgTicket` (extends BaseModel, use Auditable, HasFactory)
- [ ] Enum `OgTicketStatus`, `OgTicketPriority`
- [ ] Repository `OgTicketRepository` + `OgTicketRepositoryInterface`
- [ ] Service `OgTicketService` + `OgTicketServiceInterface`
- [ ] Resource `OgTicketResource` (extends BaseResource, 2 variants: list + show)
- [ ] Resource `PoolTicketResource` (format ticket gốc từ pool)
- [ ] Requests: `ClaimTicketRequest`, `UpdateOgTicketRequest`, `ReleaseOgTicketRequest`, `ListOgTicketRequest`, `ListPoolRequest`
- [ ] Controller `OgTicketController`
- [ ] Factory `OgTicketFactory`
- [ ] Seeder `OgTicketSeeder`

### Phase 2: ExternalService + Dynamic Relationship
- [ ] `TicketExternalServiceInterface` + `TicketExternalService` (dùng Requester/Ticket model)
- [ ] `resolveRelationUsing('ticket', ...)` trong `OgTicketServiceProvider`
- [ ] Binding trong `OgTicketServiceProvider`

### Phase 3: Integration
- [ ] Route registration trong `OgTicketServiceProvider`
- [ ] PSR-4 mappings trong `composer.json`
- [ ] Authorization middleware/policy (chỉ OG members update)
- [ ] Pint format

### Phase 4: Tests
- [ ] Claim ticket (tạo og_ticket + sync ticket gốc)
- [ ] Update og_ticket (status, priority, assigned_to, sla)
- [ ] Release og_ticket (cancel + release ticket gốc)
- [ ] Authorization: chỉ OG members update
- [ ] Status transition validation
- [ ] Concurrent claim protection
- [ ] History query
- [ ] Pool list (available tickets)
- [ ] Scope/filter tests
