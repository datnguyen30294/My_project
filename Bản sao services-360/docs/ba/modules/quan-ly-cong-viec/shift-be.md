# Quản lý ca làm việc (Shift) — Spec kỹ thuật BE (v2)

> Module: `PMC/Shift` | Ngày tạo: 2026-04-15 | Trạng thái: Draft
> Supersedes: `docs/ba/modules/hrm/shift-be.md` (v1 — read-only, seed-only)
> Liên quan: `shift-fe.md`, `work-slot-snapshot.md`

## 1. Tổng quan

Master danh mục ca làm việc. Chuyển từ **read-only + seed-only** (v1) sang **CRUD đầy đủ**, quản lý qua UI `/quan-ly-cong-viec/shifts`.

**Thay đổi so với v1:**
- Bỏ `counts_for_ticket` (tất cả ca đều tham gia ticket derivation).
- Thêm `type`, `work_group`, `break_hours`, `status`.
- Mở 3 endpoint CRUD: `POST`, `PUT`, `DELETE`.
- Thêm endpoint stats.
- Scope internal (admin có UI CRUD). External HR vẫn read-only.

**Business rules chính:**
- `code` unique, required.
- Xóa ca: chặn nếu có `WorkSchedule` trỏ tới. Admin chuyển sang `inactive` thay vì xóa.
- Ca `inactive` ẩn khỏi dropdown chọn ca khi tạo lịch việc.
- Không audit, không soft delete (hard delete khi cho phép).

## 2. Entity

### 2.1 Shift

**Bảng:** `shifts`

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| Mã ca | `code` | `string(50)` | required, unique | Admin nhập tay (vd `CS1`) |
| Tên hiển thị | `name` | `string(100)` | required | "Ca sáng" |
| Kiểu ca | `type` | `string(50)` | required | Free text (FE có dropdown suggest) |
| Nhóm xử lý | `work_group` | `string(50)` | required | Free text (FE có dropdown suggest) |
| Giờ bắt đầu | `start_time` | `time` | required | `06:00:00` |
| Giờ kết thúc | `end_time` | `time` | required | `14:00:00`. Nếu `<= start_time` ⇒ ca qua đêm |
| Giờ nghỉ | `break_hours` | `decimal(4,2)` | nullable, default 0 | Đơn vị giờ (decimal). Vd `1.5` = 1h30' |
| Trạng thái | `status` | `string(20)` | default `active` | `active` / `inactive` |
| Thứ tự | `sort_order` | `integer` | default 0 | Sắp xếp UI tăng dần |
| Timestamps | `created_at`, `updated_at` | | auto | |

**ĐÃ XÓA (v1 → v2):** `counts_for_ticket`.

**KHÔNG có:** `external_ref`, `is_system`, `description`, `deleted_at`, `created_by`, `updated_by` (không audit).

**Indexes:**
- `unique('code')`
- `index('status')`
- `index('type')`
- `index('sort_order')`

**Relationships:**
- `workSchedules()` → `hasMany(WorkSchedule::class)`

**Computed (accessor):**
- `getWorkHoursAttribute(): float` — Công thức:
  - Nếu `end_time > start_time`: `(end_time - start_time) / 3600 - break_hours`
  - Nếu ca qua đêm (`end_time <= start_time`): `(24 - start_time + end_time) / 3600 - break_hours`
  - Min = 0 (không âm)
- `getIsOvernightAttribute(): bool` — `end_time <= start_time`

**Không lưu DB:** `work_hours` compute runtime, đẩy trong Resource.

## 3. Enums

### 3.1 `ShiftStatusEnum` (PHP 8.1 backed enum)

```php
enum ShiftStatusEnum: string
{
    case Active = 'active';
    case Inactive = 'inactive';

    public function label(): string
    {
        return match ($this) {
            self::Active => 'Đang sử dụng',
            self::Inactive => 'Tạm ẩn',
        };
    }
}
```

Model cast: `'status' => ShiftStatusEnum::class`.

## 4. API Endpoints

### 4.1 Internal (`/api/v1/pmc/shifts`)

| Action | Method | URL | Request class | Mô tả |
|--------|--------|-----|---------------|-------|
| List | GET | `/shifts` | `ListShiftRequest` | Filter + paginate |
| Show | GET | `/shifts/{id}` | — | Chi tiết 1 ca |
| Create | POST | `/shifts` | `CreateShiftRequest` | Tạo ca mới |
| Update | PUT | `/shifts/{id}` | `UpdateShiftRequest` | Sửa ca |
| Delete | DELETE | `/shifts/{id}` | `DeleteShiftRequest` | Xóa (chặn nếu có WorkSchedule) |
| Stats | GET | `/shifts/stats` | — | `{total, active, inactive}` |

**Query params cho List (`ListShiftRequest`):**
- `search` (string, nullable) — search `code` hoặc `name`
- `status` (string, in `[active, inactive]`, nullable)
- `type` (string, nullable)
- `work_group` (string, nullable)
- `only_active` (bool, nullable) — shortcut `status=active`, dùng cho dropdown chọn ca
- `per_page` (int, 1-100, default 20)
- `page` (int, default 1)
- `sort` (string, nullable) — `sort_order|code|name|created_at`, prefix `-` desc

### 4.2 External

**CRUD đầy đủ** cho external — xem spec riêng: [`shift-external-api.md`](./shift-external-api.md).

Tóm tắt:
- Route param dùng `{code}` thay vì `{id}`
- Scope: `shifts:read` (GET) + `shifts:write` (POST/PUT/DELETE/bulk-upsert)
- Dùng chung `ShiftService` + `ShiftRepository` + `ShiftResource` với internal

## 5. Validation Rules

### 5.1 `CreateShiftRequest`

```php
return [
    'code' => ['required', 'string', 'max:50', Rule::unique('shifts', 'code')],
    'name' => ['required', 'string', 'max:100'],
    'type' => ['required', 'string', 'max:50'],
    'work_group' => ['required', 'string', 'max:50'],
    'start_time' => ['required', 'date_format:H:i'],
    'end_time' => ['required', 'date_format:H:i'],
    'break_hours' => ['nullable', 'numeric', 'min:0', 'max:24'],
    'status' => ['required', Rule::enum(ShiftStatusEnum::class)],
    'sort_order' => ['nullable', 'integer', 'min:0'],
];
```

### 5.2 `UpdateShiftRequest`

Giống Create, `code` unique ignore self:
```php
'code' => ['required', 'string', 'max:50', Rule::unique('shifts', 'code')->ignore($this->route('shift'))],
```

### 5.3 `DeleteShiftRequest`

Route model binding. `authorize()` luôn trả `true`. Business check `hasWorkSchedules` đặt trong Service (throw `BusinessException`).

### 5.4 `ListShiftRequest`

Đã liệt kê ở §4.1.

## 6. Business Rules

- [ ] `code` unique (DB + validation).
- [ ] Xóa ca: `ShiftService::delete()` gọi `ShiftRepository::hasWorkSchedules($id)` → nếu `true` throw `BusinessException('Ca đã có lịch việc, chuyển về "Tạm ẩn" thay vì xóa')`.
- [ ] Ca `inactive` **không** xuất hiện ở dropdown chọn ca trong UI lịch việc (FE truyền `only_active=true`).
- [ ] Ca `inactive` **vẫn** xuất hiện ở lịch việc cũ (WorkSchedule đã lưu `shift_id`) — không ẩn dữ liệu lịch sử.
- [ ] `break_hours <= (end - start)`, không validate cứng (để admin tự kiểm soát); `work_hours` clamp min 0.
- [ ] Seeder chỉ seed mẫu dev/test, idempotent `updateOrCreate(['code' => ...], [...])`.

## 7. Resource Output

**`ShiftResource`:**
```json
{
  "id": 1,
  "code": "CS1",
  "name": "Ca sáng",
  "type": "Cả tuần",
  "work_group": "Làm việc",
  "start_time": "06:00",
  "end_time": "14:00",
  "is_overnight": false,
  "break_hours": 1.0,
  "work_hours": 7.0,
  "status": { "value": "active", "label": "Đang sử dụng" },
  "sort_order": 1,
  "created_at": "2026-04-15T10:00:00Z",
  "updated_at": "2026-04-15T10:00:00Z"
}
```

**`ShiftStatsResource`:**
```json
{
  "total": 15,
  "active": 15,
  "inactive": 0
}
```

## 8. Cross-Module Dependencies

- `WorkSchedule` (cùng PMC, submodule): FK `work_schedules.shift_id → shifts.id` (restrictOnDelete). Shift bị xóa cứng khi không có WorkSchedule — ràng buộc DB là guard cuối. Service check trước là hint user-friendly.
- `TicketDerivationService`, `ScheduleSlotService`: bỏ check `counts_for_ticket` (xem §11).
- `WorkSlotSnapshot` (submodule mới — xem `work-slot-snapshot.md`): không phụ thuộc trực tiếp Shift, chỉ dùng `shift_id`.

## 9. Migration Preview

### 9.1 Update migration (new file)

```php
// database/migrations/tenant/2026_04_15_130000_update_shifts_add_crud_fields.php
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('shifts', function (Blueprint $table) {
            $table->string('type', 50)->after('name');
            $table->string('work_group', 50)->after('type');
            $table->decimal('break_hours', 4, 2)->default(0)->after('end_time');
            $table->string('status', 20)->default('active')->after('break_hours');

            $table->dropColumn('counts_for_ticket');

            $table->index('status');
            $table->index('type');
        });
    }

    public function down(): void
    {
        Schema::table('shifts', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['type']);
            $table->boolean('counts_for_ticket')->default(true)->after('end_time');
            $table->dropColumn(['type', 'work_group', 'break_hours', 'status']);
        });
    }
};
```

**Lưu ý data cũ:** 3 ca hiện có (`SANG`, `CHIEU`, `TOI`) — migration cần `DB::statement` hoặc data migration để set `type`, `work_group` mặc định (vd `type='Cả tuần'`, `work_group='Làm việc'`) cho row cũ, vì NOT NULL.

```php
// Sau khi add column (nullable ban đầu), backfill, rồi alter sang NOT NULL:
DB::table('shifts')->whereNull('type')->update(['type' => 'Cả tuần', 'work_group' => 'Làm việc']);
```

Hoặc set `nullable()` + default, rồi change sau. Safest: add column nullable → backfill → change NOT NULL.

### 9.2 Seeder cập nhật

```php
$shifts = [
    ['code' => 'SANG',  'name' => 'Ca sáng',  'start_time' => '06:00', 'end_time' => '14:00', 'type' => 'Cả tuần', 'work_group' => 'Làm việc', 'break_hours' => 1.0, 'status' => 'active', 'sort_order' => 1],
    ['code' => 'CHIEU', 'name' => 'Ca chiều', 'start_time' => '14:00', 'end_time' => '22:00', 'type' => 'Cả tuần', 'work_group' => 'Làm việc', 'break_hours' => 1.0, 'status' => 'active', 'sort_order' => 2],
    ['code' => 'TOI',   'name' => 'Ca tối',   'start_time' => '22:00', 'end_time' => '06:00', 'type' => 'Cả tuần', 'work_group' => 'Làm việc', 'break_hours' => 1.0, 'status' => 'active', 'sort_order' => 3],
];
```

## 10. Repository / Service Contract

### 10.1 `ShiftRepository` (extends `BaseRepository`)

Thêm methods:
```php
public function hasWorkSchedules(int $shiftId): bool;
public function getStatistics(): array; // ['total' => int, 'active' => int, 'inactive' => int]
public function listPaginated(array $filters, int $perPage): LengthAwarePaginator;
```

`hasWorkSchedules` query qua `WorkScheduleRepository::countByShiftId($shiftId) > 0` — inject `WorkScheduleRepository` vào `ShiftRepository` (cross-submodule cùng PMC — direct import, **không** qua ExternalService).

### 10.2 `ShiftService` (implements `ShiftServiceInterface`)

```php
public function list(array $filters, int $perPage): LengthAwarePaginator;
public function findById(int $id): Shift;
public function create(array $data): Shift;
public function update(int $id, array $data): Shift;
public function delete(int $id): void; // throws BusinessException nếu hasWorkSchedules
public function getStats(): array;
```

**`delete()` logic:**
```php
if ($this->shiftRepository->hasWorkSchedules($id)) {
    throw new BusinessException('Ca đã có lịch việc, chuyển về "Tạm ẩn" thay vì xóa.');
}
$this->shiftRepository->delete($id);
```

## 11. Refactor dependent code (BỎ `counts_for_ticket`)

**Files bị ảnh hưởng:**

1. `backend/app/Modules/PMC/src/WorkSchedule/Services/TicketDerivationService.php:28`
   - Xóa: `$countingShifts = $shifts->filter(fn ($s) => (bool) $s->counts_for_ticket)->values();`
   - Thay: `$countingShifts = $shifts;`

2. `backend/app/Modules/PMC/src/WorkSchedule/Services/ScheduleSlotService.php:130`
   - Xóa: `if ((bool) $shift->counts_for_ticket && $shiftStart->lessThanOrEqualTo(Carbon::now())) {`
   - Thay: `if ($shiftStart->lessThanOrEqualTo(Carbon::now())) {`

3. `backend/app/Modules/PMC/src/Shift/Models/Shift.php`
   - Xóa `counts_for_ticket` khỏi `$fillable`, `$casts`, `scopeForTicket()`.

4. `backend/app/Modules/PMC/src/Shift/Resources/ShiftResource.php`
   - Xóa key `counts_for_ticket`, thêm `type`, `work_group`, `break_hours`, `work_hours`, `status`.

5. `backend/database/factories/Tenant/ShiftFactory.php`
   - Xóa `counts_for_ticket`, thêm `type`, `work_group`, `break_hours`, `status`.

6. `backend/app/Modules/PMC/tests/ShiftTest.php`
   - Update assertions (không còn `counts_for_ticket` key).

## 12. Checklist triển khai

**Migration & Model:**
- [ ] Migration `update_shifts_add_crud_fields` (add fields, drop `counts_for_ticket`)
- [ ] Model `Shift`: cast `status` → `ShiftStatusEnum`, accessor `work_hours`, bỏ `scopeForTicket`
- [ ] Enum `ShiftStatusEnum`

**Requests:**
- [ ] `CreateShiftRequest`
- [ ] `UpdateShiftRequest`
- [ ] `ListShiftRequest`
- [ ] `DeleteShiftRequest`

**Repository / Service:**
- [ ] `ShiftRepository`: `hasWorkSchedules`, `getStatistics`, `listPaginated`
- [ ] `ShiftService`: `create`, `update`, `delete` (block if has WorkSchedule), `getStats`

**Controller & Routes:**
- [ ] `ShiftController`: `store`, `update`, `destroy`, `stats`
- [ ] `api.php`: full `apiResource('shifts')` + `GET /shifts/stats`
- [ ] `external.php`: giữ nguyên GET only

**Resource:**
- [ ] `ShiftResource` thêm fields
- [ ] `ShiftStatsResource` mới

**Refactor:**
- [ ] `TicketDerivationService` bỏ filter `counts_for_ticket`
- [ ] `ScheduleSlotService::getDetail` bỏ check `counts_for_ticket`
- [ ] `ShiftFactory` / `ShiftSeeder` cập nhật
- [ ] `ShiftTest` cập nhật

**Tests:**
- [ ] Create shift (happy)
- [ ] Create shift code duplicate → 422
- [ ] Update shift
- [ ] Delete shift (no WorkSchedule) → 204
- [ ] Delete shift có WorkSchedule → 422 với message
- [ ] Stats endpoint trả đúng
- [ ] List with `only_active=true` chỉ trả active
- [ ] Existing tests WorkSchedule/Ticket vẫn pass sau khi bỏ `counts_for_ticket`
