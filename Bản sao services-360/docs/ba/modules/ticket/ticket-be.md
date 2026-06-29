# Quản lý Ticket - Đặc tả kỹ thuật Backend

> Module: `Requester/Ticket` | Ngày tạo: 2026-03-07 | Cập nhật: 2026-03-10 | Trạng thái: Draft

## 1. Tổng quan

Module tiếp nhận yêu cầu sửa chữa / bảo trì từ **cư dân** qua landing page công khai (không cần đăng nhập). Ticket là nguồn dữ liệu gốc — **immutable** sau khi tạo (trừ `status` và cờ claim).

**Module `Requester`** là top-level module phục vụ cư dân. Sau này có thể mở rộng:
- `Requester/Ticket` — yêu cầu sửa chữa / bảo trì
- `Requester/FruitOrder` — mua trái cây (ví dụ)
- `Requester/Feedback` — góp ý

**Kiến trúc 2 module:**

```
┌──────────────────────────┐          ┌──────────────────────────┐
│  Requester/Ticket        │          │  PMC/OgTicket            │
│  (public, như micro-svc) │          │  (nội bộ OG)             │
│                          │          │                          │
│  tickets                 │──copy──► │  og_tickets              │
│  ├─ requester info       │          │  ├─ snapshot data        │
│  ├─ subject/description  │          │  ├─ priority, channel    │
│  ├─ channel, status      │          │  ├─ assigned_to, sla     │
│  └─ claimed_by_org_id    │◄─flag─── │  └─ organization_id (FK) │
│                          │          │                          │
│  TicketExternalSvc ──────┼────►     │  Auth: Sanctum (admin)   │
│  Public API (no auth)    │          │                          │
└──────────────────────────┘          └──────────────────────────┘
```

**Scope:** Đặc tả này chỉ bao gồm module **Requester/Ticket**. Module **PMC/OgTicket** có đặc tả riêng.

**Flow tổng quan:**

```
1. Cư dân truy cập landing page (từ link có params hoặc trực tiếp)
2. Nhập thông tin → submit → tạo ticket (public, no auth) → status = pending
3. OG xem pool ticket available → claim → status = received → tạo og_ticket (copy data)
4. OG xử lý og_ticket nội bộ → cập nhật status ticket (in_progress, completed)
5. Nếu không xử lý được → og_ticket status = cancelled → release ticket → status = pending
6. OG khác claim lại
```

## 2. Entities

### 2.1 Ticket

**Bảng:** `tickets`

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| Mã | `code` | `string(50)` | required, unique | Mã ticket tự sinh (VD: TK-2026-001) |
| Tên người gửi | `requester_name` | `string(255)` | required | Họ tên cư dân |
| SĐT người gửi | `requester_phone` | `string(20)` | required | Số điện thoại |
| Căn hộ | `apartment_name` | `string(255)` | nullable | Tên căn hộ (text, nhập tay hoặc từ param) |
| Dự án | `project_id` | `unsignedBigInteger` | required | Cross-module ref → projects.id (NO FK) |
| Tiêu đề | `subject` | `string(500)` | required | Tiêu đề yêu cầu |
| Mô tả | `description` | `text` | nullable | Mô tả chi tiết |
| Trạng thái | `status` | `string(20)` | required, default: 'pending' | Enum TicketStatus |
| Kênh tiếp nhận | `channel` | `string(20)` | required, default: 'website' | Enum TicketChannel. Từ URL param, không hiện trên form |
| OG đang giữ | `claimed_by_org_id` | `unsignedBigInteger` | nullable | Cross-module ref → organizations.id. `null` = available |
| Thời điểm nhận | `claimed_at` | `timestamp` | nullable | Thời điểm OG claim. `null` = chưa ai nhận |
| Timestamps | `created_at`, `updated_at` | `timestamp` | auto | |

**Đặc điểm:**
- Thông tin cư dân (requester_name, phone, apartment, subject, description) **immutable** sau khi tạo
- `status`, `claimed_by_org_id`, `claimed_at` thay đổi qua `TicketExternalServiceInterface`
- **Không soft delete** — ticket gốc luôn tồn tại
- **Không có** priority, assigned_to, sla — đó là concern của PMC/OgTicket

**Indexes:**
- `unique('code')`
- `index('status')`
- `index('project_id')`
- `index('claimed_by_org_id')`

**Scopes:**
- `scopeAvailable(Builder $query)` — `where('claimed_by_org_id', null)->where('status', 'pending')` (ticket chờ xử lý, chưa ai nhận)
- `scopeSearch(Builder $query, string $keyword)` — tìm theo `subject`, `description`, `requester_name`, hoặc `requester_phone` (LIKE case-insensitive)

## 3. Enums

### 3.1 TicketStatus

| Key | Value | Label (VI) | Mô tả |
|-----|-------|------------|-------|
| `Pending` | `pending` | Chờ xử lý | Mới tạo, hoặc OG release về pool |
| `Received` | `received` | Đã tiếp nhận | OG đã claim |
| `InProgress` | `in_progress` | Đang xử lý | OG đang xử lý |
| `Completed` | `completed` | Hoàn thành | Đã xong |
| `Cancelled` | `cancelled` | Đã hủy | Ticket bị hủy |

**Auto-transition (qua ExternalService):**
- Claim → `received`
- Release → `pending`

**OG cập nhật (qua ExternalService):**
- `received` → `in_progress`
- `in_progress` → `completed`
- `received` / `in_progress` → `cancelled`

### 3.2 TicketChannel

| Key | Value | Label (VI) | Mô tả |
|-----|-------|------------|-------|
| `Phone` | `phone` | Điện thoại | |
| `App` | `app` | Ứng dụng | |
| `Website` | `website` | Website | Mặc định |
| `Direct` | `direct` | Trực tiếp | |

## 4. API Endpoints

### 4.1 Public API (không cần auth)

| Action | Method | URL | Request Class | Mô tả |
|--------|--------|-----|---------------|-------|
| Submit | POST | `/api/v1/tickets` | `SubmitTicketRequest` | Cư dân tạo ticket mới |

> Đây là API duy nhất của module Requester/Ticket. Mọi thao tác quản lý đều qua module PMC/OgTicket sử dụng `TicketExternalServiceInterface`.

### 4.2 Landing Page URL Parameters

```
/ticket?name=Nguyễn Văn A&phone=0901111111&apartment=A-101&project_id=5&org_id=3&channel=phone
```

| Param | Ticket field | Hiện trên form | Mô tả |
|-------|-------------|----------------|-------|
| `name` | `requester_name` | Có (prefill, sửa được) | Tên cư dân |
| `phone` | `requester_phone` | Có (prefill, sửa được) | SĐT |
| `apartment` | `apartment_name` | Có (prefill, sửa được) | Tên căn hộ |
| `project_id` | `project_id` | Có (prefill, sửa được) | ID dự án |
| `org_id` | `claimed_by_org_id` | **Không** | Pre-assign cho OG |
| `channel` | `channel` | **Không** | Kênh tiếp nhận, default `website` |

## 5. Validation Rules

### 5.1 SubmitTicketRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `requester_name` | `['required', 'string', 'max:255']` | Tên người gửi là bắt buộc |
| `requester_phone` | `['required', 'string', 'max:20']` | Số điện thoại là bắt buộc |
| `apartment_name` | `['nullable', 'string', 'max:255']` | |
| `project_id` | `['required', 'integer']` | Dự án là bắt buộc |
| `subject` | `['required', 'string', 'max:500']` | Tiêu đề là bắt buộc |
| `description` | `['nullable', 'string']` | |
| `channel` | `['nullable', 'string', Rule::in(TicketChannel::values())]` | Kênh tiếp nhận không hợp lệ |
| `claimed_by_org_id` | `['nullable', 'integer']` | |

> `channel` default = `website` nếu không truyền. `claimed_by_org_id` từ URL param (pre-assign OG), không hiện trên form.

## 6. Business Rules

### Tạo Ticket
- [ ] **Không cần auth** — cư dân tạo ticket công khai qua landing page
- [ ] Mã ticket (`code`) tự sinh: `TK-{YYYY}-{sequence}` (VD: TK-2026-001)
- [ ] Sequence global per year, zero-padded 3 chữ số (001, 002, ..., 999)
- [ ] `status` mặc định = `pending`
- [ ] `channel` default = `website`, có thể override từ URL param
- [ ] `claimed_by_org_id` có thể pre-assign từ URL param (link từ hệ thống OG)
- [ ] Nếu có `claimed_by_org_id` hợp lệ → set `claimed_at` = now(), `status` = `received`
- [ ] `project_id` validate tồn tại qua `ProjectExternalServiceInterface::getProjectById()`
- [ ] `claimed_by_org_id` validate tồn tại qua `OrganizationExternalServiceInterface::getOrganizationById()` (nếu có giá trị)

### Immutability
- [ ] Sau khi tạo, thông tin cư dân (requester_name, phone, apartment_name, subject, description, channel) **không thể sửa**
- [ ] `status`, `claimed_by_org_id`, `claimed_at` chỉ thay đổi qua `TicketExternalServiceInterface`

### Ticket Code Format
- [ ] Format: `TK-{YYYY}-{sequence}` (VD: TK-2026-001)
- [ ] Tự sinh trong Service layer, không cho nhập thủ công

## 7. Presenter Output

### 7.1 TicketResource

```json
{
  "id": 1,
  "code": "TK-2026-001",
  "requester_name": "Nguyễn Văn A",
  "requester_phone": "0901111111",
  "apartment_name": "A-101",
  "project": {
    "id": 1,
    "name": "Chung cư Aurora"
  },
  "subject": "Hỏng máy lạnh",
  "description": "Máy lạnh phòng khách không lạnh.",
  "status": {
    "value": "pending",
    "label": "Chờ xử lý"
  },
  "channel": {
    "value": "website",
    "label": "Website"
  },
  "claimed_by_org_id": null,
  "claimed_at": null,
  "created_at": "2026-03-07 09:30:00"
}
```

## 8. Cross-Module Communication (ExternalService Pattern)

### 8.1 Pattern tổng quan

```
┌─ Consumer module ────────────────────────────────────────────┐
│                                                              │
│  Service/Controller                                          │
│       │ inject                                               │
│       ▼                                                      │
│  InterfaceService (contract)                                 │
│       ▲ implements                                           │
│       │                                                      │
│  ImplementService ──── truy cập Model của module khác ────►  │
│       │                 (cross-module model access            │
│       │                  CHỈ cho phép ở tầng này)            │
│       │                                                      │
│  ServiceProvider: bind Interface → Implement                 │
└──────────────────────────────────────────────────────────────┘
```

**Quy tắc:**
- **Interface + Implementation** nằm trong module **consumer** (module cần dữ liệu)
- Cross-module model access (`\App\Modules\...\Models\...`) **chỉ cho phép** trong Implementation
- Cross-module **Eloquent relationship** (`belongsTo`, `hasMany`, ...) cũng **cho phép** trong Implementation — dùng để eager load / mapping dữ liệu giữa các module
- Service/Controller chỉ depend vào Interface (DI), không biết model module khác
- Binding đăng ký trong ServiceProvider của consumer module

### 8.2 PMC/OgTicket → Requester/Ticket (PMC là consumer)

**Interface:** `app/Modules/PMC/src/OgTicket/ExternalServices/TicketExternalServiceInterface.php`

```php
interface TicketExternalServiceInterface
{
    /** Lấy danh sách ticket chưa ai nhận (available) */
    public function getAvailableTickets(array $filters = []): LengthAwarePaginator;

    /** Lấy chi tiết ticket */
    public function getTicketById(int $id): ?array;

    /** OG nhận ticket — set cờ claimed + status = received */
    public function claimTicket(int $ticketId, int $organizationId): bool;

    /** OG trả ticket — clear cờ claimed + status = pending */
    public function releaseTicket(int $ticketId): bool;

    /** OG cập nhật status ticket (in_progress, completed, cancelled) */
    public function updateTicketStatus(int $ticketId, TicketStatus $status): bool;

    /** Kiểm tra ticket có available không */
    public function isTicketAvailable(int $ticketId): bool;
}
```

**Implementation:** `app/Modules/PMC/src/OgTicket/ExternalServices/TicketExternalService.php`

```php
use App\Modules\Requester\src\Ticket\Models\Ticket; // Cross-module model — chỉ ở đây
use App\Modules\PMC\src\OgTicket\Models\OgTicket;

class TicketExternalService implements TicketExternalServiceInterface
{
    public function getAvailableTickets(array $filters = []): LengthAwarePaginator
    {
        return Ticket::query()
            ->available()
            ->when($filters['search'] ?? null, fn ($q, $search) => $q->search($search))
            ->latest()
            ->paginate($filters['per_page'] ?? 15);
    }

    public function getTicketById(int $id): ?array
    {
        $ticket = Ticket::find($id);

        return $ticket?->only([
            'id', 'code', 'requester_name', 'requester_phone',
            'apartment_name', 'project_id', 'subject', 'description',
            'status', 'channel', 'claimed_by_org_id', 'claimed_at', 'created_at',
        ]);
    }

    public function claimTicket(int $ticketId, int $organizationId): bool
    {
        return DB::transaction(function () use ($ticketId, $organizationId) {
            $ticket = Ticket::query()
                ->where('id', $ticketId)
                ->whereNull('claimed_by_org_id')
                ->lockForUpdate()
                ->first();

            if (! $ticket) {
                return false;
            }

            return $ticket->update([
                'claimed_by_org_id' => $organizationId,
                'claimed_at' => now(),
                'status' => TicketStatus::Received->value,
            ]);
        });
    }

    public function releaseTicket(int $ticketId): bool
    {
        return Ticket::where('id', $ticketId)
            ->whereNotNull('claimed_by_org_id')
            ->update([
                'claimed_by_org_id' => null,
                'claimed_at' => null,
                'status' => TicketStatus::Pending->value,
            ]) > 0;
    }

    public function updateTicketStatus(int $ticketId, TicketStatus $status): bool
    {
        return Ticket::where('id', $ticketId)
            ->whereNotNull('claimed_by_org_id')
            ->update(['status' => $status->value]) > 0;
    }

    public function isTicketAvailable(int $ticketId): bool
    {
        return Ticket::where('id', $ticketId)
            ->whereNull('claimed_by_org_id')
            ->where('status', TicketStatus::Pending->value)
            ->exists();
    }
}
```

**Binding:** trong `OgTicketServiceProvider`

```php
$this->app->bind(TicketExternalServiceInterface::class, TicketExternalService::class);
```

**Cross-module relationship trong ImplementService:**

ImplementService có thể định nghĩa Eloquent relationship (`belongsTo`, `hasOne`, ...) để eager load / mapping dữ liệu cross-module. Ví dụ `OgTicket` cần hiển thị thông tin ticket gốc:

```php
// Trong TicketExternalService — định nghĩa relationship giúp OgTicket
// KHÔNG đặt belongsTo trực tiếp trên OgTicket model (vì model không biết module khác)

class TicketExternalService implements TicketExternalServiceInterface
{
    // ...các method ở trên...

    /** Lấy danh sách og_tickets kèm ticket gốc (eager load cross-module) */
    public function getOgTicketsWithTicket(Builder $query): Builder
    {
        // Dùng Eloquent relationship qua closure — cross-module model access ở đây
        return $query->addSelect(['ticket_code' => Ticket::select('code')
            ->whereColumn('tickets.id', 'og_tickets.ticket_id')
            ->limit(1),
        ]);
    }

    /** Lấy ticket gốc từ og_ticket */
    public function getOriginalTicket(OgTicket $ogTicket): ?Ticket
    {
        return Ticket::find($ogTicket->ticket_id);
    }
}
```

Hoặc đơn giản hơn, ImplementService có thể đăng ký dynamic relationship trên OgTicket model:

```php
// Trong OgTicketServiceProvider::boot()
use Illuminate\Database\Eloquent\Relations\Relation;

OgTicket::resolveRelationUsing('ticket', function (OgTicket $model) {
    return $model->belongsTo(Ticket::class, 'ticket_id');
    // Cross-module belongsTo — cho phép vì đăng ký trong ServiceProvider/ImplementService
});

// Sử dụng: OgTicket::with('ticket')->get()
// → eager load ticket gốc, mapping requester_name, subject, ... từ ticket
```

> **Tóm lại:** `belongsTo` / relationship cross-module **cho phép** khi đăng ký/sử dụng trong tầng ImplementService hoặc ServiceProvider. Model chính (OgTicket) không import trực tiếp Ticket model.

**Sử dụng:** trong OgTicket Service/Controller

```php
class OgTicketService
{
    public function __construct(
        private TicketExternalServiceInterface $ticketExternalService,
    ) {}

    public function claim(int $ticketId, int $organizationId): OgTicket
    {
        // Gọi qua interface, không biết Ticket model
        $claimed = $this->ticketExternalService->claimTicket($ticketId, $organizationId);
        if (! $claimed) {
            throw new \DomainException('Ticket không available hoặc đã được nhận.');
        }

        $ticketData = $this->ticketExternalService->getTicketById($ticketId);

        return OgTicket::create([
            'ticket_id' => $ticketData['id'],
            'organization_id' => $organizationId,
            // copy snapshot...
        ]);
    }

    public function list(int $organizationId): LengthAwarePaginator
    {
        // Dùng dynamic relationship đã đăng ký — eager load ticket gốc
        return OgTicket::with('ticket')
            ->where('organization_id', $organizationId)
            ->latest()
            ->paginate();
    }
}
```

### 8.3 Requester/Ticket → PMC (Requester là consumer)

Requester/Ticket cần validate `project_id` và `claimed_by_org_id` khi tạo ticket.

**Interface:** `app/Modules/Requester/src/Ticket/ExternalServices/ProjectExternalServiceInterface.php`
**Interface:** `app/Modules/Requester/src/Ticket/ExternalServices/OrganizationExternalServiceInterface.php`

```php
interface ProjectExternalServiceInterface
{
    public function getProjectById(int $id): ?array;
    // → ['id' => int, 'name' => string] | null
}

interface OrganizationExternalServiceInterface
{
    public function getOrganizationById(int $id): ?array;
    // → ['id' => int, 'name' => string] | null
}
```

**Implementation:** truy cập PMC models

```php
use App\Modules\PMC\src\Project\Models\Project;       // Cross-module model
use App\Modules\PMC\src\Organization\Models\Organization; // Cross-module model

class ProjectExternalService implements ProjectExternalServiceInterface
{
    public function getProjectById(int $id): ?array
    {
        return Project::find($id)?->only(['id', 'name']);
    }
}

class OrganizationExternalService implements OrganizationExternalServiceInterface
{
    public function getOrganizationById(int $id): ?array
    {
        return Organization::find($id)?->only(['id', 'name']);
    }
}
```

**Binding:** trong `TicketServiceProvider`

```php
$this->app->bind(ProjectExternalServiceInterface::class, ProjectExternalService::class);
$this->app->bind(OrganizationExternalServiceInterface::class, OrganizationExternalService::class);
```

### 8.4 Tóm tắt cross-module

| Consumer | Provider | Interface | Implementation | Binding tại |
|----------|----------|-----------|---------------|-------------|
| PMC/OgTicket | Requester/Ticket | `TicketExternalServiceInterface` | `TicketExternalService` (dùng `Ticket` model) | `OgTicketServiceProvider` |
| Requester/Ticket | PMC/Project | `ProjectExternalServiceInterface` | `ProjectExternalService` (dùng `Project` model) | `TicketServiceProvider` |
| Requester/Ticket | PMC/Organization | `OrganizationExternalServiceInterface` | `OrganizationExternalService` (dùng `Organization` model) | `TicketServiceProvider` |

> **Quy tắc cốt lõi:**
> - Cross-module **model access** và **Eloquent relationship** (`belongsTo`, `hasMany`, ...) CHỈ xảy ra trong Implementation class hoặc ServiceProvider (dynamic relationship).
> - Service/Controller không bao giờ import model từ module khác — chỉ dùng Interface hoặc dynamic relationship đã đăng ký.

## 10. Migration Preview

```php
Schema::create('tickets', function (Blueprint $table) {
    $table->id();
    $table->string('code', 50)->unique();
    $table->string('requester_name', 255);
    $table->string('requester_phone', 20);
    $table->string('apartment_name', 255)->nullable();
    $table->unsignedBigInteger('project_id');                    // Cross-module ref (NO FK)
    $table->string('subject', 500);
    $table->text('description')->nullable();
    $table->string('status', 20)->default('pending');
    $table->string('channel', 20)->default('website');
    $table->unsignedBigInteger('claimed_by_org_id')->nullable(); // Cross-module ref (NO FK)
    $table->timestamp('claimed_at')->nullable();
    $table->timestamps();

    $table->index('status');
    $table->index('project_id');
    $table->index('claimed_by_org_id');
});
```

## 11. Checklist triển khai BE

### Phase 1: Ticket Entity
- [ ] Migration `create_tickets_table`
- [ ] Model `Ticket` (extends BaseModel, HasFactory)
- [ ] Enum `TicketStatus`, `TicketChannel`
- [ ] Repository `TicketRepository` + `TicketRepositoryInterface`
- [ ] Service `TicketService` + `TicketServiceInterface`
- [ ] Resource `TicketResource` (extends BaseResource)
- [ ] Request: `SubmitTicketRequest`
- [ ] Controller `TicketController` (chỉ submit)
- [ ] Factory `TicketFactory`
- [ ] Seeder `TicketSeeder`

### Phase 2: ExternalService (Requester/Ticket là consumer)
- [ ] `ProjectExternalServiceInterface` + `ProjectExternalService` (dùng PMC Project model)
- [ ] `OrganizationExternalServiceInterface` + `OrganizationExternalService` (dùng PMC Organization model)
- [ ] Binding trong `TicketServiceProvider`

> `TicketExternalServiceInterface` + `TicketExternalService` thuộc **PMC/OgTicket** (PMC là consumer) — xem spec PMC/OgTicket.

### Phase 3: Integration
- [ ] Route registration trong `TicketServiceProvider`
- [ ] PSR-4 mappings trong `composer.json`
- [ ] Pint format

### Phase 4: Tests
- [ ] Submit ticket (public, no auth)
- [ ] Submit ticket with URL params (channel, org_id pre-assign)
- [ ] Claim/release via ExternalService (status auto-transition)
- [ ] updateTicketStatus via ExternalService
- [ ] Concurrent claim protection
- [ ] Ticket code auto-generation
- [ ] Validation tests

> **TODO:** Tạo đặc tả PMC/OgTicket tại `docs/ba/modules/pmc/og-ticket-be.md`
