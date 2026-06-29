# Work Slot Snapshot — Spec BE + FE

> Module: `PMC/WorkSnapshot` (submodule mới) | Cập nhật: 2026-04-16 | Trạng thái: Draft v2
> Liên quan: `shift-be.md`, `shift-fe.md`, `quan-ly-cong-viec/schedule-slot-be.md`, `quan-ly-cong-viec/schedule-view-fe.md`

## 1. Tổng quan

Snapshot (account, date, shift, entity) bảo toàn trạng thái tại các mốc bắt đầu/kết thúc của ca, để khi xem slot quá khứ luôn thấy đúng state tại thời điểm đó — không bị ảnh hưởng khi ticket/đơn hàng/nhân sự thay đổi sau này.

**Nguyên nhân cần snapshot**:
- `og_ticket_assignees` không có lịch sử → nếu admin unassign sau khi ca đã qua thì ticket biến mất khỏi slot cũ.
- `WorkSchedule` có soft delete nhưng không có audit cho `UPDATE` (trường hợp không enforce "no update").
- Đơn hàng hiện chưa xuất hiện trong slot detail.

**Phạm vi spec này** (đồng bộ với các quyết định trên thread ngày 2026-04-16):
1. Shift thuộc dự án (`shifts.project_id` bắt buộc). Khung giờ không chồng nhau trong cùng dự án.
2. Snapshot hai pha: **shift_start** + **shift_end** (merge-forward).
3. Chấp nhận một limitation: ticket được assign **rồi** unassign **đều trong cùng ca** sẽ không ghi vào snapshot.
4. Không tạo `og_ticket_assignee_history` / `work_schedule_history` trong giai đoạn đầu.

## 2. Shift project-scoped

### 2.1 Schema `shifts`

```sql
shifts:
  id
  project_id     FK projects.id  NOT NULL  cascadeOnDelete
  code           string(50)
  name           string(100)
  type, work_group, break_hours, status, sort_order, ...
  start_time, end_time TIME
  is_overnight   BOOLEAN  (derived: end_time <= start_time)

UNIQUE (project_id, code)                 -- code có thể trùng giữa các dự án
INDEX  (project_id, start_time)           -- boundary capture
INDEX  (project_id, end_time)
```

### 2.2 Ràng buộc nghiệp vụ (ShiftService)

- `start_time != end_time` → `SHIFT_ZERO_DURATION`.
- `(start_time, end_time)` không trùng với ca khác trong cùng project → `SHIFT_TIME_DUPLICATE`. (Cho phép overlap, chỉ chặn khi trùng cả start lẫn end.)
- Cấm đổi `project_id` khi update → `SHIFT_PROJECT_IMMUTABLE`.

### 2.3 WorkSchedule

- Unique `(account_id, project_id, shift_id, date)` (partial với `deleted_at IS NULL`) giữ nguyên.
- Enforce tại service: `shift.project_id === payload.project_id`.
- Chặn **inter-project overlap** cho cùng `(account_id, date)`: 1 NV không được có 2 WorkSchedule chồng thời gian dù ở 2 dự án khác nhau → `WORK_SCHEDULE_SHIFT_OVERLAP`.

## 3. Entity Snapshot

### 3.1 Bảng `work_slot_snapshots`

| Field | Column | Type | Ràng buộc |
|---|---|---|---|
| ID | `id` | bigIncrements | PK |
| Account | `account_id` | bigInt FK | restrictOnDelete |
| Ngày | `date` | date | |
| Ca | `shift_id` | bigInt FK | restrictOnDelete |
| Entity type | `entity_type` | string(20) | in `['work_schedule', 'ticket', 'order']` |
| Entity ID | `entity_id` | bigInt | |
| Payload | `snapshot_data` | jsonb | |
| Bắt đầu capture | `captured_start_at` | timestamp nullable | null nếu chưa có pha start |
| Chốt cuối ca | `finalized_at` | timestamp nullable | null = chưa merge-forward |
| Bị kick mid-shift | `removed_mid_shift` | boolean default false | |
| Timestamps | `created_at`, `updated_at` | | |

**Indexes**:
- `UNIQUE (account_id, date, shift_id, entity_type, entity_id)` — idempotent upsert.
- `INDEX (date, shift_id)`.
- `INDEX (account_id, date)`.
- `INDEX (finalized_at)` — phục vụ failsafe sweep.

**Không có** `deleted_at` / `deleted_by` — snapshot là bất biến (append-only, chỉ upsert field ở pha end).

### 3.2 Payload

**Ticket** (`entity_type = 'ticket'`):
```json
{
  "ticket_id": 123,
  "subject": "Sửa điện phòng 101",
  "project": { "id": 5, "code": "CC-A", "name": "Chung cư A" },
  "priority": { "value": "high", "label": "Cao" },
  "assigned_at": "2026-04-15T06:30:00Z",
  "status_at_start": { "value": "in_progress", "label": "Đang xử lý" },
  "status_at_end":   { "value": "completed",  "label": "Hoàn thành" }
}
```

**Order** (`entity_type = 'order'`):
```json
{
  "order_id": 45,
  "code": "ORD-2026-045",
  "status_at_end": { "value": "confirmed", "label": "Đã xác nhận" },
  "total_amount": "1500000.00",
  "parent_ticket_id": 123,
  "project": { "id": 5, "name": "Tòa A" }
}
```

**WorkSchedule** (`entity_type = 'work_schedule'`):
```json
{
  "work_schedule_id": 77,
  "project": { "id": 5, "code": "CC-A", "name": "Chung cư A" },
  "note": "Làm thêm ca đêm",
  "external_ref": "HR-2026-000123"
}
```

## 4. Enum

```php
enum SnapshotEntityTypeEnum: string
{
    case WorkSchedule = 'work_schedule';
    case Ticket = 'ticket';
    case Order = 'order';
}
```

## 5. Logic capture (2 pha)

### 5.1 Pha **shift_start**

Tại đúng thời điểm `start_time` của ca, trong ngày đó:

1. Query tất cả `WorkSchedule` cho (account_*, date=hôm_nay, shift_id=X) → insert row snapshot (`entity_type='work_schedule'`). `captured_start_at = now()`, `finalized_at = null`.
2. Query `og_ticket_assignees` active thuộc `ticket.project_id = shift.project_id` với account bất kỳ → insert row snapshot (`entity_type='ticket'`) với `status_at_start`.

### 5.2 Pha **shift_end** (merge-forward)

Tại đúng thời điểm `end_time` (với ca overnight thì là ngày hôm sau):

1. Với mỗi row chưa `finalized_at` của (date, shift_id) này:
   - Query lại entity:
     - **Entity còn tồn tại**: merge thêm data (vd `status_at_end`, `orders[]`), set `finalized_at = now()`.
     - **Entity đã bị kick / hard delete**: giữ nguyên row, set `finalized_at = now()`, `removed_mid_shift = true`.
2. Query entity **mới xuất hiện mid-shift** (không có row ở pha start):
   - Ví dụ: ticket assign lúc 09:00 (giữa ca 6–14h), vẫn active 14:00 → insert row với `finalized_at = now()` ngay (bỏ qua `captured_start_at`).
3. Nếu có orders liên kết với ticket trong ca → insert snapshot `entity_type='order'`.

### 5.3 Limitation (chấp nhận)

- Ticket **assign + unassign** đều trong cùng ca → không mốc nào nhìn thấy → không có evidence trong snapshot.
- Order tương tự.
- Sẽ giải quyết sau bằng `og_ticket_assignee_history` nếu cần.

## 6. Scheduler (boundary-based)

### 6.1 Cron everyMinute

```php
// routes/console.php
Schedule::command('snapshot:capture-shift-boundaries')->everyMinute();
```

### 6.2 `CaptureShiftBoundariesCommand`

```php
public function handle(): int {
    $now = Carbon::now();
    $hm = $now->format('H:i');

    foreach ($this->shiftRepository->findByStartTime($hm) as $shift) {
        CaptureSlotStartJob::dispatch($shift->id, $now->toDateString());
    }

    foreach ($this->shiftRepository->findByEndTime($hm) as $shift) {
        $slotDate = $shift->isOvernight()
            ? $now->copy()->subDay()->toDateString()
            : $now->toDateString();
        CaptureSlotEndJob::dispatch($shift->id, $slotDate);
    }
    return self::SUCCESS;
}
```

- `findByStartTime` / `findByEndTime` đã có trong `ShiftRepository` (phase 1 đã triển khai), scan `HH:MM` bằng `SUBSTR(CAST(... AS TEXT), 1, 5)` — tương thích PostgreSQL + SQLite.

### 6.3 Overnight

- Ca tối 22:00 → 06:00. Mốc `06:00` trùng **end ca tối ngày hôm qua** và **start ca sáng hôm nay** → 2 job riêng cho 2 slot khác nhau.

## 7. Retry

### 7.1 Queue job + exponential backoff

```php
class CaptureSlotEndJob implements ShouldQueue {
    public int $tries = 5;
    public array $backoff = [30, 120, 300, 900, 1800];
    public int $timeout = 60;

    public function handle(WorkSlotSnapshotService $service): void {
        $service->captureEnd($this->shiftId, $this->date);
    }

    public function failed(Throwable $e): void {
        Log::error('CaptureSlotEndJob exhausted', ['shift_id' => $this->shiftId, 'date' => $this->date, 'error' => $e->getMessage()]);
    }
}
```

### 7.2 Idempotent

- UNIQUE key trên snapshot table đảm bảo upsert không duplicate.
- Mỗi row commit trong transaction riêng (`DB::transaction(...)`) → partial success vẫn tiếp tục được ở retry sau.

### 7.3 Failsafe sweep

```php
Schedule::command('snapshot:sweep-unfinalized')->everyFifteenMinutes();
```

- Scan rows `finalized_at IS NULL AND shift_end_datetime < now() - 30 min`.
- Re-dispatch `CaptureSlotEndJob` cho từng (shift, date).
- Alert nếu backlog > 50 rows (Slack / notification channel cấu hình sẵn).

### 7.4 Manual rerun

- `php artisan snapshot:backfill --from=YYYY-MM-DD --to=YYYY-MM-DD` — dùng khi khôi phục data cũ; chỉ phục hồi được entities còn tồn tại.
- `POST /api/v1/pmc/work-snapshot/recapture` (admin) — force re-dispatch cho 1 slot cụ thể.

## 8. Read path

### 8.1 `ScheduleSlotService::getDetail`

```php
public function getDetail(int $accountId, string $date, int $shiftId): array
{
    $day = Carbon::parse($date);
    $isPast = $day->lessThan(Carbon::today());

    if ($isPast && $this->snapshotRepo->existsForSlot($accountId, $date, $shiftId)) {
        return $this->buildFromSnapshot($accountId, $date, $shiftId);
    }
    return $this->buildLive($accountId, $date, $shiftId);
}
```

- Past + có snapshot → `data_source = 'snapshot'`, payload ghép từ các row snapshot.
- Past chưa có snapshot → live (giống hiện tại).
- Present → live.

### 8.2 `getPersonal` / `getTeam`

- Card list / matrix **vẫn live derive** qua `TicketDerivationService`. Không đọc snapshot.
- Lý do: không muốn lệch giữa card count và drawer (và list view thường ít quan trọng phải freeze).
- Hệ quả: khi admin kick mid-shift, card count quá khứ có thể thay đổi nhưng drawer (đọc snapshot) vẫn cho thấy NV từng nhận ticket. Document hóa limitation này.

### 8.3 Response shape mới của `getDetail`

```json
{
  "account": {...},
  "shift": { "id": 1, "project_id": 5, ... },
  "project": { "id": 5, "name": "Chung cư A" },
  "date": "2026-04-10",
  "shift_window": { "start": "...", "end": "..." },
  "external": [ {...WorkSchedule} ],
  "tickets": [ {..., "status_at_slot": {...}, "status_now": {...}, "is_status_changed": true, "source": "snapshot"} ],
  "orders":  [ {..., "source": "snapshot"} ],
  "data_source": "snapshot",
  "captured_start_at": "2026-04-10T06:00:00Z",
  "finalized_at": "2026-04-10T14:05:00Z"
}
```

## 9. Tác động tới Schedule Views

### 9.1 Personal view (`getPersonal`)

Response đã đổi shape trong phase triển khai:

```json
{
  "month": "2026-04",
  "account": {...},
  "days": [...],
  "day_cards": {
    "2026-04-15": [
      {
        "shift": { "id": 1, "project_id": 5, ... },
        "project": { "id": 5, "name": "Chung cư A" },
        "has_workschedule": true,
        "ticket_count": 3
      }
    ]
  }
}
```

- Bỏ `shifts[]` global + `slots{}` matrix.
- Mỗi `(shift, project)` = 1 card. Sắp theo `start_time`, rồi `project.name`.

### 9.2 Team view (`getTeam`)

- **Bắt buộc** `project_id` query param (nếu thiếu → 422).
- Shift scope theo project. Matrix giữ nguyên (scoped trong dự án).
- FE: page `lich-viec-doi.vue` thêm guard "chọn dự án trước khi xem lịch".

## 10. Data Source & Repository

### 10.1 `WorkSlotSnapshotRepository`

```php
public function upsertBatch(int $accountId, string $date, int $shiftId, array $workSchedules, array $tickets, array $orders): void;
public function getBySlot(int $accountId, string $date, int $shiftId): Collection;
public function existsForSlot(int $accountId, string $date, int $shiftId): bool;
public function findOverdueUnfinalized(int $thresholdMinutes): Collection;
```

### 10.2 `WorkSlotSnapshotService`

```php
public function captureStart(int $shiftId, string $date): void;   // pha 1
public function captureEnd(int $shiftId, string $date): void;     // pha 2 (merge-forward)
public function getActivePairsForDate(string $date): Collection;  // (account_id, shift_id)
public function getSlotDetail(int $accountId, string $date, int $shiftId): array;
```

### 10.3 `OrderRepository` — mới thêm

```php
public function findActiveByTicketIds(array $ticketIds): Collection;
```

### 10.4 Không triển khai (phase 1)

- Không tạo `og_ticket_assignee_history`, `work_schedule_history`, `order_status_history` riêng.
- `status_at_end` cho ticket lấy từ `OgTicketStatusHistoryService::batchGetStatusAt` hiện có.
- `status_at_end` cho order: nếu `OrderStatusHistoryService` chưa tồn tại thì dùng state hiện tại (drift chấp nhận được cho MVP).

## 11. Frontend impact

### 11.1 Component changes (đã triển khai phase 1)

- `useScheduleSlots.ts`: `PersonalScheduleResponse.day_cards: Record<string, DayCard[]>`.
- `PersonalShiftCard.vue`: prop `card: DayCard`, hiển thị `project.name` và badge HR.
- `PersonalDayCell.vue` / `PersonalCalendarGrid.vue`: render theo `day_cards`.
- `TeamMatrixTable.vue`: build DayCard inline từ slot summary + project ref.
- `lich-viec-doi.vue`: guard chọn project trước khi xem.
- `ShiftFormDialog.vue`: thêm trường `project_id` (create mode; edit mode không cho đổi).

### 11.2 SlotDetailDrawer

Sẽ được mở rộng (phase 2) sau khi snapshot sẵn sàng:
- Section **Orders** mới.
- Pill `Snapshot` / `Live` hiển thị `data_source`.
- Timestamp `captured_start_at` / `finalized_at` (nếu có).

## 12. Testing

### 12.1 Unit tests

- `WorkSlotSnapshotService::captureStart()` — idempotent.
- `WorkSlotSnapshotService::captureEnd()` — merge-forward:
  - Entity còn → fill status_at_end.
  - Entity biến mất → `removed_mid_shift=true`.
  - Entity mới xuất hiện mid-shift → insert.
- Filter `Rejected` / `Cancelled`.

### 12.2 Feature tests

- Cron `snapshot:capture-shift-boundaries` chạy đúng mốc start/end (kể cả overnight).
- `GET slots/detail` với `date < today + có snapshot` → `data_source: snapshot`.
- Ticket reassign sau capture → drawer vẫn thấy nhân viên cũ.
- Ticket hard delete sau capture → drawer vẫn còn subject, status_at_end.
- Sweep cron re-dispatch rows `finalized_at IS NULL` quá hạn.

### 12.3 Edge cases

- Ca overnight: shift_end `06:00` ngày X+1 phải capture đúng slot date = X.
- Shift bị soft delete giữa pha start và end → capture end xử lý thế nào (đề xuất: vẫn merge-forward dùng shift state lấy tại capture, không fail).
- Account inactive sau capture: snapshot vẫn giữ (FK `restrictOnDelete`).

## 13. Checklist triển khai (còn lại)

**BE:**
- [ ] Migration `create_work_slot_snapshots_table`.
- [ ] Enum `SnapshotEntityTypeEnum`.
- [ ] Model `WorkSlotSnapshot` + Repository + Service + Interface.
- [ ] `WorkSnapshotServiceProvider` + register trong `config/app.php`.
- [ ] `CaptureSlotStartJob`, `CaptureSlotEndJob` (queued).
- [ ] `CaptureShiftBoundariesCommand` + schedule `everyMinute`.
- [ ] `SweepUnfinalizedSnapshotsCommand` + schedule `everyFifteenMinutes`.
- [ ] `OrderRepository::findActiveByTicketIds`.
- [ ] `OrderStatusHistoryService` (nếu có thời gian).
- [ ] Sửa `ScheduleSlotService::getDetail` branch past snapshot.
- [ ] API `POST /pmc/work-snapshot/recapture` (admin).

**FE:**
- [ ] `SlotDetailDrawer.vue` — section Orders, pill data_source, timestamps.
- [ ] `useScheduleSlots.ts` — thêm field `data_source`, `orders[]` vào `SlotDetailResponse`.
- [ ] Regenerate Orval sau khi BE xong.

**Tests:** xem §12.

**Docs:**
- [ ] Cập nhật `docs/ba/modules/quan-ly-cong-viec/schedule-slot-be.md` — note snapshot behavior, data_source.
- [ ] Cập nhật `docs/ba/modules/quan-ly-cong-viec/schedule-view-fe.md` — project-scoped team + day_cards shape.
