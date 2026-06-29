# Schedule Slot (ca × ngày) — Spec kỹ thuật BE

> Module: `PMC/WorkSchedule/ScheduleSlot` | Ngày tạo: 2026-04-15 | Trạng thái: Draft

## 1. Tổng quan

Tầng **read-only, computed** phục vụ UI calendar. Gộp 2 nguồn:

1. **External schedules** (`work_schedules` do HR đẩy) — đã có FK `shift_id`.
2. **Ticket-derived schedules** — suy ra từ `og_tickets` + `og_ticket_assignees`: nhân viên có ticket active → tự động có "ca đang xử lý ticket" cho SANG + CHIEU từ thời điểm assign đến completed.

Đưa ra 3 endpoint cho UI:

| Endpoint | Dùng cho |
|----------|---------|
| `GET /api/v1/pmc/schedule-slots/personal` | Lịch 1 nhân viên cả tháng |
| `GET /api/v1/pmc/schedule-slots/team` | Lịch tất cả nhân viên (optional project) cả tháng |
| `GET /api/v1/pmc/schedule-slots/detail` | Drawer chi tiết 1 ca × 1 ngày × 1 nhân viên |

## 2. Dependencies & pre-requisites

### 2.1 Schema thay đổi bên ngoài spec này

#### `og_tickets.completed_at TIMESTAMP NULL`
Migration mới. Set khi `transition` → `Completed`. Clear khi transition ngược ra (nếu có). Dùng để filter ticket active nhanh.

```php
Schema::table('og_tickets', function (Blueprint $table) {
    $table->timestamp('completed_at')->nullable()->after('status');
    $table->index('completed_at');
});
```

Cập nhật `OgTicketService::transition()`:
```php
if ($newStatus === OgTicketStatus::Completed) {
    $data['completed_at'] = now();
} elseif ($oldStatus === OgTicketStatus::Completed) {
    $data['completed_at'] = null;
}
```

#### Index bổ sung trên pivot
```php
Schema::table('og_ticket_assignees', function (Blueprint $table) {
    $table->index('account_id');
});
```
Hiện chỉ có `unique(og_ticket_id, account_id)` — lookup ngược theo `account_id` cần index riêng.

### 2.2 Audit log có sẵn

`OgTicket` đã implement `OwenIt\Auditing\Contracts\Auditable` — bảng `audits` có sẵn. Không cần migration mới.

## 3. Logic cốt lõi

### 3.1 Shift window (khung giờ ca của ngày D)

```php
function shiftWindow(Carbon $date, Shift $shift): array
{
    $start = $date->copy()->setTimeFromTimeString($shift->start_time);
    $end   = $date->copy()->setTimeFromTimeString($shift->end_time);
    if ($shift->isOvernight()) {
        $end->addDay();  // TOI: 22:00 ngày D → 06:00 ngày D+1
    }
    return [$start, $end];
}
```

### 3.2 Ticket active "trong shift window"

Ticket T có assignee A active trong ca (D, S) nếu:

```
assigned_at        ≤ shift_end
completed_at_or_now ≥ shift_start
status_at_shift_end ∉ {rejected, cancelled}
S.counts_for_ticket = true
```

Với `status_at_shift_end` reconstruct từ audit log (hoặc fallback status hiện tại nếu `shift_end >= now()`).

### 3.3 Ticket derivation — 2 query pattern (KHÔNG N+1)

```sql
-- Query 1: external schedules
SELECT account_id, project_id, shift_id, date
FROM work_schedules
WHERE account_id IN (:account_ids)
  AND date BETWEEN :from AND :to
  AND deleted_at IS NULL;

-- Query 2: tickets overlap range
SELECT t.id, t.project_id, t.status, t.completed_at,
       a.account_id, a.created_at AS assigned_at
FROM og_tickets t
JOIN og_ticket_assignees a ON a.og_ticket_id = t.id
WHERE a.account_id IN (:account_ids)
  AND t.status NOT IN ('rejected', 'cancelled')
  AND a.created_at <= :end_of_range
  AND (t.completed_at IS NULL OR t.completed_at >= :start_of_range);
```

Rồi aggregate trong PHP:
- Với mỗi external row → increment `slots[account_id][date][shift_id].has_external = true, projects[] += project_id`
- Với mỗi ticket → loop qua [max(assigned_at_date, from), min(completed_at_date ?? today, to)] × {SANG, CHIEU} → increment `slots[account_id][date][shift_id].ticket_count++`

## 4. Endpoint 1: Personal Calendar

### 4.1 `GET /api/v1/pmc/schedule-slots/personal`

**Params (validated qua `PersonalScheduleSlotRequest`):**

| Field | Rules |
|-------|-------|
| `account_id` | `['required', 'integer', 'exists:accounts,id']` |
| `month` | `['required', 'string', 'regex:/^\d{4}-\d{2}$/']` — `YYYY-MM` |

Range được tính từ `month`: `from = startOfMonth`, `to = endOfMonth`. Không cho free-form range (đơn giản hóa UI).

**Response (compact):**
```json
{
  "data": {
    "month": "2026-04",
    "account": { "id": 1, "employee_code": "NV001", "name": "Nguyễn Văn A" },
    "days": [
      { "date": "2026-04-01", "weekday": 3, "is_weekend": false, "is_today": false }
    ],
    "shifts": [
      { "id": 1, "code": "SANG", "name": "Ca sáng", "start_time": "06:00", "end_time": "14:00", "counts_for_ticket": true, "sort_order": 1 }
    ],
    "slots": {
      "2026-04-15": {
        "1": { "ext": true,  "proj": [10], "tkt": 2 },
        "2": { "ext": false, "proj": [],   "tkt": 3 },
        "3": { "ext": true,  "proj": [10], "tkt": null }
      }
    }
  }
}
```

- `slots[date][shift_id]` — sparse map. Ngày/ca không có gì → omit.
- `ext` = `true` nếu có external schedule cho (account, date, shift).
- `proj` = distinct `project_id[]` từ external schedules trong ca đó.
- `tkt` = số ticket active trong shift window. `null` nếu `counts_for_ticket = false` (ca TOI).

## 5. Endpoint 2: Team Matrix

### 5.1 `GET /api/v1/pmc/schedule-slots/team`

**Params (validated qua `TeamScheduleSlotRequest`):**

| Field | Rules | Mô tả |
|-------|-------|-------|
| `month` | `['required', 'string', 'regex:/^\d{4}-\d{2}$/']` | Bắt buộc |
| `project_id` | `['nullable', 'integer', 'exists:projects,id']` | Optional — nếu có, chỉ accounts thuộc project |
| `account_search` | `['nullable', 'string', 'max:100']` | Optional — search `name` hoặc `employee_code`, case-insensitive |

**Logic lọc accounts:**

```php
$query = $accountRepo->queryActive();

if ($projectId) {
    $query->whereHas('projects', fn ($q) => $q->where('projects.id', $projectId));
}
if ($accountSearch) {
    $query->search($accountSearch);
}

$accounts = $query->orderBy('name')->get();  // KHÔNG pagination
```

**Hard limit:** nếu `count(accounts) > 500` → 422 `"Quá nhiều nhân viên. Vui lòng lọc theo dự án."` (ngăn response > 2 MB).

**Response (compact, sparse):**
```json
{
  "data": {
    "month": "2026-04",
    "project_id": 10,
    "accounts": [
      { "id": 1, "employee_code": "NV001", "name": "Nguyễn Văn A" },
      { "id": 2, "employee_code": "NV002", "name": "Trần Thị B" }
    ],
    "days": [
      { "date": "2026-04-01", "weekday": 3, "is_weekend": false, "is_today": false }
    ],
    "shifts": [
      { "id": 1, "code": "SANG", "start_time": "06:00", "end_time": "14:00", "counts_for_ticket": true }
    ],
    "slots": {
      "1": {
        "2026-04-15": {
          "1": { "ext": true, "proj": [10], "tkt": 2 }
        }
      },
      "2": {
        "2026-04-15": {
          "2": { "ext": false, "proj": [], "tkt": 1 }
        }
      }
    }
  }
}
```

- `slots[account_id][date][shift_id]` — nested sparse. Account/day/shift không có gì → omit.
- Shape giống personal, thêm tầng `account_id`.

### 5.2 Performance

Ước lượng:
- 30 accounts × 31 ngày: 2 query + aggregation → ~200 ms
- 200 accounts × 31 ngày: ~800 ms
- 500 accounts × 31 ngày (worst case không filter): ~2 s → acceptable nhưng nhắc user nên filter project

Xem `docs/ba/modules/hrm/schedule-slot-be.md` §2.1 cho index cần thêm.

## 6. Endpoint 3: Slot Detail

### 6.1 `GET /api/v1/pmc/schedule-slots/detail`

**Params (validated qua `ScheduleSlotDetailRequest`):**

| Field | Rules |
|-------|-------|
| `account_id` | `['required', 'integer', 'exists:accounts,id']` |
| `date` | `['required', 'date_format:Y-m-d']` |
| `shift_id` | `['required', 'integer', 'exists:shifts,id']` |

**Logic:**

1. Tính `[$shiftStart, $shiftEnd] = shiftWindow($date, $shift)`.
2. Query external schedules cho slot: `WHERE account_id = X AND date = D AND shift_id = S`.
3. Query tickets active trong shift window cho account X:
   ```sql
   SELECT t.*, a.created_at AS assigned_at
   FROM og_tickets t
   JOIN og_ticket_assignees a ON a.og_ticket_id = t.id
   WHERE a.account_id = :X
     AND a.created_at <= :shift_end
     AND (t.completed_at IS NULL OR t.completed_at >= :shift_start)
     AND t.status NOT IN ('rejected', 'cancelled');
   ```
4. Với mỗi ticket → reconstruct `status_at_slot` qua 1 query batch:
   ```sql
   SELECT DISTINCT ON (auditable_id)
          auditable_id, new_values->>'status' AS status_at_slot
   FROM audits
   WHERE auditable_type = 'App\\Modules\\PMC\\OgTicket\\Models\\OgTicket'
     AND auditable_id IN (:ticket_ids)
     AND created_at <= :shift_end
   ORDER BY auditable_id, created_at DESC;
   ```
   Fallback: nếu không có audit row trước `shift_end` → dùng `t.status` (current). Nếu `shift_end >= now()` → luôn dùng `t.status` (khỏi query audit).

5. Chỉ trả ticket có `status_at_slot ∉ {rejected, cancelled}` (double-check trường hợp audit reveal status đã reject/cancel trước slot).

**Response:**
```json
{
  "data": {
    "account": { "id": 1, "employee_code": "NV001", "name": "Nguyễn Văn A" },
    "date": "2026-04-15",
    "shift": { "id": 1, "code": "SANG", "name": "Ca sáng", "start_time": "06:00", "end_time": "14:00" },
    "shift_window": { "start": "2026-04-15T06:00:00+07:00", "end": "2026-04-15T14:00:00+07:00" },
    "external": [
      {
        "id": 101,
        "project": { "id": 10, "code": "PRJ-01", "name": "Dự án Aurora" },
        "note": null,
        "external_ref": "HR-WS-..."
      }
    ],
    "tickets": [
      {
        "id": 123,
        "subject": "Sửa ống nước căn 1204",
        "project": { "id": 10, "name": "Dự án Aurora" },
        "priority": { "value": "normal", "label": "Bình thường" },
        "assigned_at": "2026-04-13T09:00:00+07:00",
        "status_at_slot": { "value": "in_progress", "label": "Đang thực hiện" },
        "status_now": { "value": "completed", "label": "Hoàn thành" },
        "is_status_changed": true
      }
    ]
  }
}
```

- `status_at_slot` = status tại `shift_end` (reconstructed).
- `status_now` = status hiện tại.
- `is_status_changed` = `status_at_slot !== status_now`.

Nếu `shift.counts_for_ticket = false` (TOI) → `tickets` luôn `[]`.

## 7. Cấu trúc code

```
PMC/src/WorkSchedule/
├── Services/
│   ├── ScheduleSlotService.php          — orchestrator 3 endpoints
│   ├── TicketDerivationService.php      — query + aggregate ticket counts
│   └── TicketStatusHistoryService.php   — reconstruct từ audit log
├── Controllers/ScheduleSlotController.php  — 3 methods: personal, team, detail
├── Requests/
│   ├── PersonalScheduleSlotRequest.php
│   ├── TeamScheduleSlotRequest.php
│   └── ScheduleSlotDetailRequest.php
└── Resources/
    ├── PersonalScheduleSlotResource.php
    ├── TeamScheduleSlotResource.php
    └── SlotDetailResource.php
```

## 8. Edge cases & business rules

- [ ] **Ticket reassignment**: nếu A bị remove khỏi `og_ticket_assignees` (pivot delete thật), derivation tự ngừng từ thời điểm remove. Hiện pivot KHÔNG có soft delete → nếu cần tracking remove time, phải thêm `deleted_at` (ngoài scope spec này).
- [ ] **Multi-assignee ticket**: 1 ticket có nhiều assignees → mỗi assignee đều có derived schedule riêng cho khoảng thời gian họ là assignee.
- [ ] **Ticket status revert từ Completed**: `completed_at` phải bị clear khi transition ra khỏi `Completed` (xem §2.1).
- [ ] **Timezone**: app dùng `Asia/Ho_Chi_Minh` (UTC+7). `og_ticket_assignees.created_at` lưu UTC → chuyển sang local trước khi so sánh với `shift_window`.
- [ ] **Weekend / holiday**: không có logic đặc biệt — ca vẫn tồn tại. UI có thể đánh dấu weekend bằng style.
- [ ] **Past month query**: cho phép query tháng quá khứ bất kỳ. Reconstruct audit ok. Performance vẫn tốt (indexed).
- [ ] **Future month query**: cho phép query tháng tương lai. `tkt` = 0 cho mọi slot (chưa có ticket). `ext` phụ thuộc HR đã đẩy chưa.

## 9. Checklist triển khai

- [ ] Migration `add_completed_at_to_og_tickets_table` (thêm cột + index)
- [ ] Migration `add_account_id_index_to_og_ticket_assignees_table`
- [ ] Cập nhật `OgTicketService::transition()` — set/clear `completed_at`
- [ ] Repository method mới:
  - [ ] `WorkScheduleRepository::inRangeForAccounts(array $accountIds, string $from, string $to): Collection`
  - [ ] `OgTicketRepository::activeForAccountsInRange(array $accountIds, Carbon $from, Carbon $to): Collection`
- [ ] Service mới:
  - [ ] `TicketDerivationService::deriveSlots(array $accounts, Carbon $from, Carbon $to, array $shiftsWithCounts): array`
  - [ ] `TicketStatusHistoryService::getStatusAt(int $ticketId, Carbon $at): ?string`
  - [ ] `TicketStatusHistoryService::batchGetStatusAt(array $ticketIds, Carbon $at): array<int,string>`
  - [ ] `ScheduleSlotService::getPersonal(int $accountId, string $month): array`
  - [ ] `ScheduleSlotService::getTeam(string $month, ?int $projectId, ?string $search): array`
  - [ ] `ScheduleSlotService::getDetail(int $accountId, string $date, int $shiftId): array`
- [ ] Controllers + Requests + Resources (xem §7)
- [ ] Routes trong `api.php`:
  ```php
  Route::get('schedule-slots/personal', [ScheduleSlotController::class, 'personal']);
  Route::get('schedule-slots/team',     [ScheduleSlotController::class, 'team']);
  Route::get('schedule-slots/detail',   [ScheduleSlotController::class, 'detail']);
  ```
- [ ] Tests:
  - [ ] Personal: external only → `ext=true, tkt=0`
  - [ ] Personal: ticket derivation từ assigned_at đến today
  - [ ] Personal: ticket completed ở giữa tháng → stop derivation
  - [ ] Personal: ca TOI → `tkt = null`
  - [ ] Team: không filter project → tất cả active accounts
  - [ ] Team: filter project → chỉ accounts thuộc project
  - [ ] Team: account_search → case-insensitive match name/code
  - [ ] Team: > 500 accounts → 422
  - [ ] Detail: reconstruct status_at_slot qua audit
  - [ ] Detail: fallback khi không có audit history → dùng current status
  - [ ] Detail: shift_end >= now() → skip audit query
  - [ ] Detail: ca TOI → `tickets=[]`
  - [ ] Performance: 30 accounts × 1 tháng < 500ms

## 10. Permissions

Đăng ký 2 permission trong `PermissionSeeder`:

| Key | Mô tả | Dùng ở |
|-----|-------|--------|
| `work_schedules.view_personal` | Xem lịch cá nhân | `ScheduleSlotController@personal` + `@detail` |
| `work_schedules.view_team` | Xem lịch đội | `ScheduleSlotController@team` |

Middleware check qua policy hoặc gate ngay trong controller:
```php
public function team(TeamScheduleSlotRequest $request): JsonResponse
{
    $this->authorize('work_schedules.view_team');
    // ...
}
```

## 11. Các optimization CHƯA làm ngay (ghi chú tương lai)

- [ ] Redis cache cho team view tháng cũ (immutable)
- [ ] Materialized view `daily_shift_metrics` nếu > 500 accounts thường xuyên
- [ ] HTTP cache `Cache-Control: private, max-age=60` cho team view đang diễn ra
