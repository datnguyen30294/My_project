# Ca làm việc (Shift) — Spec kỹ thuật BE (v1 — DEPRECATED)

> ⚠️ **DEPRECATED.** Spec v1 này mô tả chế độ **read-only + seed-only** của Shift.
> Version mới (CRUD đầy đủ + fields mở rộng) ở: [`../quan-ly-cong-viec/shift-be.md`](../quan-ly-cong-viec/shift-be.md)
> Giữ file này làm lịch sử, không dùng cho triển khai mới.

> Module: `PMC/Shift` | Ngày tạo: 2026-04-15 | Trạng thái: Draft
> Nguồn mockup: `BA-TNP-SERVICES/app/stores/entities/HrmShift.ts`

## 1. Tổng quan

Master danh mục ca làm việc. Là nội bộ, seed-only. External HR chỉ được `GET` để biết `code` → sau đó dùng `code` đó gửi kèm payload `WorkSchedule`.

**Chế độ sở hữu:**
- Internal app: **read-only** (GET). Không có UI CRUD.
- External HR: **read-only** (GET). KHÔNG có POST/PUT/DELETE.
- Dữ liệu: seed từ `ShiftSeeder` (idempotent `updateOrCreate` theo `code`). Thêm ca mới → sửa seeder + re-seed.

## 2. Entity

### 2.1 Shift

**Bảng:** `shifts`

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| Mã | `code` | `string(50)` | required, unique | SANG / CHIEU / TOI |
| Tên | `name` | `string(100)` | required | "Ca sáng" |
| Giờ bắt đầu | `start_time` | `time` | required | `06:00:00` |
| Giờ kết thúc | `end_time` | `time` | required | `14:00:00`. Nếu `<= start_time` ⇒ ca qua đêm |
| Tính vào ticket | `counts_for_ticket` | `boolean` | default `true` | `false` cho ca TOI — ticket derivation bỏ qua ca này |
| Thứ tự | `sort_order` | `integer` | default 0 | Hiển thị UI theo thứ tự tăng dần |
| Timestamps | `created_at`, `updated_at` | | auto | |

**KHÔNG có:** `external_ref`, `is_active`, `is_system`, `description`, `deleted_at`. Giữ schema tối giản.

**Indexes:**
- `unique('code')`
- `index('sort_order')`

**Relationships:**
- `workSchedules()` → `hasMany(WorkSchedule::class)`

**Scopes:**
- `scopeForTicket(Builder $q)` — `WHERE counts_for_ticket = true` (dùng trong derivation)

**Computed:**
- `isOvernight(): bool` — trả `end_time <= start_time`

## 3. Enums

Không có.

## 4. API Endpoints

### 4.1 Internal

| Action | Method | URL | Request | Mô tả |
|--------|--------|-----|---------|-------|
| List | GET | `/api/v1/pmc/shifts` | — | Danh sách (sắp theo `sort_order`). Không filter, không pagination. |
| Show | GET | `/api/v1/pmc/shifts/{id}` | — | Chi tiết 1 ca |

### 4.2 External (scope `shifts:read`)

| Action | Method | URL | Request | Mô tả |
|--------|--------|-----|---------|-------|
| List | GET | `/api/v1/ext/shifts` | — | HR gọi để lấy tập `code` + giờ ca |

**KHÔNG có** `POST` / `PUT` / `DELETE` ở cả 2 scope.

## 5. Validation Rules

Không có request class. `GET` không nhận body.

## 6. Business Rules

- [ ] 3 ca mặc định luôn tồn tại: `SANG`, `CHIEU`, `TOI` (seed).
- [ ] `TOI` có `counts_for_ticket = false` — ticket derivation skip.
- [ ] `ShiftSeeder` idempotent qua `updateOrCreate(['code' => ...], [...])` — có thể chạy lại khi cần cập nhật giờ ca.
- [ ] Không xoá row → không cần soft delete. Ca ngừng dùng chỉ có cách là `DELETE FROM shifts WHERE ...` thủ công (và phải xử lý work_schedules phụ thuộc trước).

## 7. Resource Output

**ShiftResource:**
```json
{
  "id": 1,
  "code": "SANG",
  "name": "Ca sáng",
  "start_time": "06:00",
  "end_time": "14:00",
  "is_overnight": false,
  "counts_for_ticket": true,
  "sort_order": 1
}
```

## 8. Cross-Module Dependencies

Không có. `Shift` là submodule độc lập trong `PMC`, được `WorkSchedule` (cùng module) import trực tiếp.

## 9. Migration Preview

```php
Schema::create('shifts', function (Blueprint $table) {
    $table->id();
    $table->string('code', 50)->unique();
    $table->string('name', 100);
    $table->time('start_time');
    $table->time('end_time');
    $table->boolean('counts_for_ticket')->default(true);
    $table->integer('sort_order')->default(0);
    $table->timestamps();

    $table->index('sort_order');
});
```

## 10. Seeder (idempotent)

```php
class ShiftSeeder extends Seeder
{
    public function run(): void
    {
        $shifts = [
            ['code' => 'SANG',  'name' => 'Ca sáng',  'start_time' => '06:00', 'end_time' => '14:00', 'counts_for_ticket' => true,  'sort_order' => 1],
            ['code' => 'CHIEU', 'name' => 'Ca chiều', 'start_time' => '14:00', 'end_time' => '22:00', 'counts_for_ticket' => true,  'sort_order' => 2],
            ['code' => 'TOI',   'name' => 'Ca tối',   'start_time' => '22:00', 'end_time' => '06:00', 'counts_for_ticket' => false, 'sort_order' => 3],
        ];

        foreach ($shifts as $data) {
            Shift::updateOrCreate(['code' => $data['code']], $data);
        }
    }
}
```

Thêm ca mới trong tương lai: append vào `$shifts` → re-run `db:seed --class=ShiftSeeder`.

## 11. Checklist triển khai

- [ ] Migration `create_shifts_table`
- [ ] Model `Shift` (extends `BaseModel` — không `SoftDeletes`)
- [ ] Repository `ShiftRepository` + Interface:
  - [ ] `all(): Collection` (sort by `sort_order`)
  - [ ] `findById(int $id): ?Shift`
  - [ ] `findByCode(string $code): ?Shift`
  - [ ] `mapByCode(array $codes): array<string,int>` — cho bulk upsert WorkSchedule
- [ ] Service `ShiftService` + Interface:
  - [ ] `list(): Collection`
  - [ ] `findById(int $id): Shift`
- [ ] Resource `ShiftResource`
- [ ] Controllers:
  - [ ] `ShiftController` (internal — `index`, `show`)
  - [ ] `ExtShiftController` (external — `index` only)
- [ ] Factory `ShiftFactory` (cho tests)
- [ ] Seeder `ShiftSeeder` (idempotent, run trong `DatabaseSeeder`)
- [ ] Routes:
  - [ ] `api.php`: `apiResource('shifts')->only(['index','show'])`
  - [ ] `external.php`: `Route::get('shifts', [ExtShiftController::class, 'index'])`
- [ ] Scope `shifts:read` trong config OAuth scopes
- [ ] Tests:
  - [ ] Seeder chạy lại idempotent (không duplicate)
  - [ ] Internal GET trả 3 ca đúng thứ tự
  - [ ] External GET trả 3 ca (với scope đúng)
  - [ ] External POST/PUT/DELETE → 404/405
  - [ ] `isOvernight()` returns true cho TOI
