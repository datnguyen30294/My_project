# OG Ticket Lifecycle Segments - Spec Backend

> Module: `PMC/OgTicket` | Ngày tạo: 2026-04-01 | Trạng thái: Draft

## 1. Tổng quan

Ghi nhận lịch sử từng giai đoạn xử lý OG Ticket. Mỗi khi OgTicket chuyển status → đóng segment cũ + mở segment mới. Hỗ trợ **multi-cycle** (phát sinh giữa chừng, quay lại khảo sát/báo giá).

**Mục đích:**
- Stepper chi tiết OG Ticket hiển thị lịch sử từng bước (ai xử lý, bao lâu, ghi chú)
- Click vào bước trên stepper → xem tất cả các lần xử lý qua nhiều vòng
- Truy vết phát sinh: vòng 1, vòng 2, vòng 3...

**Nguyên tắc:**
- Mỗi segment = 1 khoảng thời gian OgTicket giữ 1 status
- `ended_at = null` → segment đang active (OgTicket đang ở status đó)
- Tại mọi thời điểm chỉ có đúng 1 segment `ended_at = null` per og_ticket
- Cycle tăng khi backtrack (ví dụ: in_progress → surveying = cycle+1)

## 2. Entity

### 2.1 OgTicketLifecycleSegment

**Bảng:** `og_ticket_lifecycle_segments`

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| OG Ticket | `og_ticket_id` | `foreignId` | required, FK → og_tickets.id, cascade delete | |
| Status | `status` | `string(50)` | required | OgTicketStatus value tại giai đoạn này |
| Vòng | `cycle` | `unsignedSmallInteger` | required, default: 1 | Vòng xử lý (tăng khi backtrack) |
| Bắt đầu | `started_at` | `timestamp` | required | Thời điểm bắt đầu giai đoạn |
| Kết thúc | `ended_at` | `timestamp` | nullable | null = đang ở giai đoạn này |
| Ghi chú | `note` | `text` | nullable | Ghi chú cho giai đoạn (vd: lý do phát sinh) |
| Người xử lý | `assignee_id` | `foreignId` | nullable, FK → accounts.id, set null on delete | Ai xử lý bước này |
| Timestamps | `created_at`, `updated_at` | `timestamp` | auto | |

**Đặc điểm:**
- **Không dùng BaseModel** — bảng phụ thuộc, sống chết theo OgTicket (cascade delete)
- Không cần soft delete
- Không cần Auditable (bản thân đã là history)

**Indexes:**
- `index('og_ticket_id')` (FK tự tạo)
- `index(['og_ticket_id', 'ended_at'])` — query segment đang active

**Relationships:**
- `ogTicket()` → `belongsTo(OgTicket::class)`
- `assignee()` → `belongsTo(Account::class, 'assignee_id')`

**Thêm vào OgTicket model:**
- `lifecycleSegments()` → `hasMany(OgTicketLifecycleSegment::class)->orderBy('started_at')`

## 3. Enum: thêm `workflowIndex()` vào OgTicketStatus

```php
// Thứ tự workflow (chỉ happy path, dùng để xác định backtrack)
public function workflowIndex(): int
{
    return match ($this) {
        self::Received => 0,
        self::Assigned => 1,
        self::Surveying => 2,
        self::Quoted => 3,
        self::Approved => 4,
        self::Ordered => 5,
        self::InProgress => 6,
        self::Completed => 7,
        self::Rejected => 4,   // cùng level approved (không phải backtrack)
        self::Cancelled => -1, // đặc biệt
    };
}
```

## 4. Service: OgTicketLifecycleService

**File:** `app/Modules/PMC/src/OgTicket/Services/OgTicketLifecycleService.php`

### 4.1 Methods

```php
class OgTicketLifecycleService
{
    public function __construct(
        private OgTicketLifecycleSegmentRepository $repository
    ) {}

    /**
     * Mở segment đầu tiên khi tạo OgTicket.
     * Gọi từ OgTicketService::claim().
     */
    public function openFirst(
        OgTicket $ogTicket,
        ?int $assigneeId = null
    ): void

    /**
     * Chuyển status OgTicket + ghi segment.
     * Đóng segment hiện tại (ended_at = now) + mở segment mới.
     * Tự xác định cycle (backtrack → cycle+1, forward → giữ cycle).
     *
     * QUAN TRỌNG: method này vừa update og_tickets.status vừa ghi segment.
     * Tất cả nơi muốn đổi status OgTicket PHẢI gọi qua method này.
     */
    public function transition(
        OgTicket $ogTicket,
        OgTicketStatus $newStatus,
        ?string $note = null,
        ?int $assigneeId = null
    ): void
}
```

### 4.2 Logic `transition()`

```
1. Lấy segment đang active (ended_at = null) của og_ticket
2. Đóng segment cũ: set ended_at = now()
3. Tính cycle:
   - Nếu newStatus.workflowIndex < oldStatus.workflowIndex → backtrack → cycle+1
   - Ngược lại → giữ cycle hiện tại
   - Ngoại lệ: cancelled, rejected → giữ cycle (không phải backtrack)
4. Mở segment mới: status, cycle, started_at = now(), assignee_id
5. Update og_tickets.status = newStatus
```

### 4.3 Xác định cycle

```
Forward (cycle giữ nguyên):
  received(0) → assigned(1) → surveying(2) → quoted(3) → approved(4) → ordered(5) → in_progress(6) → completed(7)

Backtrack (cycle+1):
  in_progress(6) → surveying(2)  ← index giảm → cycle+1
  in_progress(6) → quoted(3)     ← index giảm → cycle+1

Không phải backtrack (giữ cycle):
  quoted(3) → rejected(4)        ← rejected cùng level approved
  ordered(5) → approved(4)       ← rollback do order cancelled (đặc biệt, giữ cycle)
  bất kỳ → cancelled(-1)         ← cancel luôn giữ cycle
```

## 5. Refactor: tập trung update status qua LifecycleService

### 5.1 Các điểm cần refactor

| File | Hiện tại | Sau refactor |
|------|----------|-------------|
| `OgTicketService::claim()` | `'status' => OgTicketStatus::Received->value` | Giữ nguyên tạo record + gọi `lifecycleService->openFirst()` |
| `OgTicketService::update()` | `$ogTicket->update($data)` (có status) | Tách: update data bình thường + nếu status thay đổi → `lifecycleService->transition()` |
| `OgTicketService::release()` | `$ogTicket->update(['status' => Cancelled])` | `lifecycleService->transition($ogTicket, Cancelled, $note)` |
| `OgTicketService::delete()` | `$ogTicket->update(['status' => Cancelled])` | `lifecycleService->transition($ogTicket, Cancelled)` |
| `QuoteService::activateVersion()` | `updateOgTicketStatus($quote, Quoted)` | `lifecycleService->transition($ogTicket, Quoted)` |
| `QuoteService::transition()→approved` | `updateOgTicketStatus($quote, Approved)` | `lifecycleService->transition($ogTicket, Approved)` |
| `OrderService::store()` | `updateOgTicketStatus($ogTicket, Ordered)` | `lifecycleService->transition($ogTicket, Ordered)` |
| `OrderService::transition()→in_progress` | `updateOgTicketStatus($ogTicket, InProgress)` | `lifecycleService->transition($ogTicket, InProgress)` |
| `OrderService::transition()→completed` | `updateOgTicketStatus($ogTicket, Completed)` | `lifecycleService->transition($ogTicket, Completed)` |
| `OrderService::transition()→cancelled` | `updateOgTicketStatus($ogTicket, Approved)` | `lifecycleService->transition($ogTicket, Approved, 'Đơn hàng bị huỷ')` |
| `OrderService::delete()` | `updateOgTicketStatus($ogTicket, Approved)` | `lifecycleService->transition($ogTicket, Approved, 'Đơn hàng bị xoá')` |

### 5.2 Xoá method cũ

- Xoá `QuoteService::updateOgTicketStatus()` (private)
- Xoá `OrderService::updateOgTicketStatus()` (private)
- Thay bằng inject `OgTicketLifecycleService` vào QuoteService và OrderService

### 5.3 Giữ nguyên

- `OgTicketService::syncTicketStatus()` — sync status xuống ticket gốc (Platform/Ticket). Vẫn gọi sau khi lifecycle transition.

## 6. API

### 6.1 Trả lifecycle_segments trong OgTicketDetailResource

Thêm field vào response show chi tiết:

```json
{
  "id": 1,
  "status": { "value": "ordered", "label": "Đã lên đơn" },
  "...": "...",
  "lifecycle_segments": [
    {
      "id": 1,
      "status": { "value": "received", "label": "Đã tiếp nhận" },
      "cycle": 1,
      "started_at": "2026-01-08T08:30:00+07:00",
      "ended_at": "2026-01-08T09:00:00+07:00",
      "note": null,
      "assignee": { "id": 1, "name": "Nguyễn Văn A" }
    },
    {
      "id": 2,
      "status": { "value": "assigned", "label": "Đã phân công" },
      "cycle": 1,
      "started_at": "2026-01-08T09:00:00+07:00",
      "ended_at": "2026-01-08T13:00:00+07:00",
      "note": null,
      "assignee": { "id": 1, "name": "Nguyễn Văn A" }
    },
    {
      "id": 7,
      "status": { "value": "in_progress", "label": "Đang thực hiện" },
      "cycle": 1,
      "started_at": "2026-01-11T07:30:00+07:00",
      "ended_at": "2026-01-12T18:00:00+07:00",
      "note": "Phát sinh: xi phông không khớp — làm lại báo giá vật tư.",
      "assignee": { "id": 2, "name": "Trần Thị B" }
    },
    {
      "id": 8,
      "status": { "value": "surveying", "label": "Đang khảo sát" },
      "cycle": 2,
      "started_at": "2026-01-12T18:00:00+07:00",
      "ended_at": "2026-01-13T10:00:00+07:00",
      "note": null,
      "assignee": { "id": 3, "name": "Lê Văn C" }
    }
  ]
}
```

### 6.2 Resource mới: OgTicketLifecycleSegmentResource

```php
class OgTicketLifecycleSegmentResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => [
                'value' => $this->status,
                'label' => OgTicketStatus::from($this->status)->label(),
            ],
            'cycle' => $this->cycle,
            'started_at' => $this->started_at?->toIso8601String(),
            'ended_at' => $this->ended_at?->toIso8601String(),
            'note' => $this->note,
            'assignee' => $this->relationLoaded('assignee') && $this->assignee
                ? ['id' => $this->assignee->id, 'name' => $this->assignee->name]
                : null,
        ];
    }
}
```

### 6.3 Cập nhật OgTicketDetailResource

```php
// Thêm vào toArray():
'lifecycle_segments' => $this->relationLoaded('lifecycleSegments')
    ? OgTicketLifecycleSegmentResource::collection($this->lifecycleSegments)
    : [],
```

### 6.4 Cập nhật eager load trong findById

```php
// OgTicketService::findById()
return $this->repository->findById($id, ['*'], [
    'receivedBy', 'assignees', 'project', 'ticket.attachments', 'attachments',
    'lifecycleSegments.assignee',  // THÊM
]);
```

## 7. Migration

```php
Schema::create('og_ticket_lifecycle_segments', function (Blueprint $table) {
    $table->id();
    $table->foreignId('og_ticket_id')
        ->constrained('og_tickets')
        ->cascadeOnDelete();
    $table->string('status', 50);
    $table->unsignedSmallInteger('cycle')->default(1);
    $table->timestamp('started_at');
    $table->timestamp('ended_at')->nullable();
    $table->text('note')->nullable();
    $table->foreignId('assignee_id')
        ->nullable()
        ->constrained('accounts')
        ->nullOnDelete();
    $table->timestamps();

    $table->index(['og_ticket_id', 'ended_at']);
});
```

## 8. Files cần tạo/sửa

### Tạo mới

| File | Mô tả |
|------|-------|
| `Migration create_og_ticket_lifecycle_segments_table` | Bảng mới |
| `OgTicket/Models/OgTicketLifecycleSegment.php` | Model (extends Model, không BaseModel) |
| `OgTicket/Repositories/OgTicketLifecycleSegmentRepository.php` | Repository |
| `OgTicket/Services/OgTicketLifecycleService.php` | Service quản lý segments |
| `OgTicket/Resources/OgTicketLifecycleSegmentResource.php` | API resource |

### Sửa

| File | Thay đổi |
|------|---------|
| `OgTicket/Enums/OgTicketStatus.php` | Thêm `workflowIndex()` |
| `OgTicket/Models/OgTicket.php` | Thêm `lifecycleSegments()` hasMany |
| `OgTicket/Services/OgTicketService.php` | Inject LifecycleService, refactor claim/update/release/delete |
| `OgTicket/Resources/OgTicketDetailResource.php` | Thêm `lifecycle_segments` field |
| `Quote/Services/QuoteService.php` | Thay `updateOgTicketStatus()` → `lifecycleService->transition()` |
| `Order/Services/OrderService.php` | Thay `updateOgTicketStatus()` → `lifecycleService->transition()` |
| `OgTicket/Providers/OgTicketServiceProvider.php` | Bind LifecycleService |

## 9. Ví dụ flow t4 (3 vòng)

```
claim()          → openFirst(received, cycle=1)
update(assigned) → transition(assigned, cycle=1)
update(surveying)→ transition(surveying, cycle=1, assignee=u2)
quote.activate() → transition(quoted, cycle=1)
quote.approved   → transition(approved, cycle=1)
order.store()    → transition(ordered, cycle=1)
order.in_progress→ transition(in_progress, cycle=1, note="Phát sinh: xi phông không khớp")

  ← backtrack: in_progress(6) → surveying(2) → cycle = 2

update(surveying)→ transition(surveying, cycle=2, assignee=u3)
quote.activate() → transition(quoted, cycle=2)
quote.approved   → transition(approved, cycle=2)
order.store()    → transition(ordered, cycle=2)
order.in_progress→ transition(in_progress, cycle=2, note="Phát sinh lần 2")

  ← backtrack: in_progress(6) → surveying(2) → cycle = 3

update(surveying)→ transition(surveying, cycle=3, assignee=u3)
quote.activate() → transition(quoted, cycle=3)
quote.approved   → transition(approved, cycle=3)
order.store()    → transition(ordered, cycle=3)  ← ĐANG Ở ĐÂY
```

## 10. Tests

- [ ] `openFirst()` tạo segment đầu tiên (received, cycle=1, ended_at=null)
- [ ] `transition()` đóng segment cũ (ended_at set) + mở segment mới
- [ ] Forward transition giữ cycle (received→assigned, cycle=1→1)
- [ ] Backtrack transition tăng cycle (in_progress→surveying, cycle=1→2)
- [ ] Cancelled giữ cycle (không phải backtrack)
- [ ] Rollback giữ cycle (ordered→approved khi order cancelled)
- [ ] OgTicket.status được update khi transition()
- [ ] Cascade delete: xoá OgTicket → xoá tất cả segments
- [ ] API response trả lifecycle_segments đầy đủ
- [ ] Segments sorted theo started_at
- [ ] Chỉ 1 segment ended_at=null tại mọi thời điểm per og_ticket
