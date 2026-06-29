# Đăng ký ca làm việc (WorkSchedule) — Spec kỹ thuật BE

> Module: `PMC/WorkSchedule` | Ngày tạo: 2026-04-15 | Trạng thái: Draft
> Nguồn mockup: `BA-TNP-SERVICES/app/stores/entities/HrmWorkSchedule.ts`

## 1. Tổng quan

Ghi nhận "nhân sự X làm ca Y ở dự án Z vào ngày D". 1 nhân viên có thể có nhiều ca/ngày ở nhiều dự án.

**Chế độ sở hữu:**
- Internal UI: **read-only** (GET). Không có form CRUD.
- External HR: **write** (POST/PUT/DELETE + bulk-upsert) qua scope `work-schedules:write`.
- Match natural keys từ HR: `accounts.employee_code`, `projects.code`, `shifts.code`.

## 2. Entity

### 2.1 WorkSchedule

**Bảng:** `work_schedules`

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| Nhân viên | `account_id` | `foreignId` → `accounts` | required, `cascadeOnDelete` | |
| Dự án | `project_id` | `foreignId` → `projects` | required, `cascadeOnDelete` | |
| Ca | `shift_id` | `foreignId` → `shifts` | required, `restrictOnDelete` | |
| Ngày | `date` | `date` | required | `YYYY-MM-DD` |
| Ghi chú | `note` | `string(255)` | nullable | |
| External ref | `external_ref` | `string(255)` | nullable, unique (partial) | Khoá idempotent từ HR |
| Timestamps | `created_at`, `updated_at`, `deleted_at` | | soft delete | |

**Indexes:**
- `index(['account_id', 'date'])` — query personal calendar
- `index(['project_id', 'date'])` — query team view
- `index('date')` — query trong khoảng
- `CREATE UNIQUE INDEX work_schedules_natural_unique ON work_schedules (account_id, project_id, shift_id, date) WHERE deleted_at IS NULL`
- `CREATE UNIQUE INDEX work_schedules_external_ref_unique ON work_schedules (external_ref) WHERE deleted_at IS NULL AND external_ref IS NOT NULL`

**Relationships:**
- `account()` → `belongsTo(Account::class)`
- `project()` → `belongsTo(Project::class)`
- `shift()` → `belongsTo(Shift::class)`

**Scopes:**
- `scopeForAccount(Builder $q, int $accountId)`
- `scopeForAccounts(Builder $q, array $accountIds)`
- `scopeForProject(Builder $q, int $projectId)`
- `scopeInMonth(Builder $q, string $yearMonth)` — helper `YYYY-MM` → date range
- `scopeBetweenDates(Builder $q, string $from, string $to)`

## 3. Enums

Không có.

## 4. API Endpoints

### 4.1 Internal (read-only)

| Action | Method | URL | Request | Mô tả |
|--------|--------|-----|---------|-------|
| List | GET | `/api/v1/pmc/work-schedules` | `ListWorkScheduleRequest` | Danh sách raw (ít dùng — UI chủ yếu gọi `/schedule-slots`) |
| Show | GET | `/api/v1/pmc/work-schedules/{id}` | — | Chi tiết 1 record |

> UI calendar chính dùng `/api/v1/schedule-slots` (xem `schedule-slot-be.md`). Endpoint này chỉ dùng khi cần raw list.

### 4.2 External (scope `work-schedules:write`)

| Action | Method | URL | Request | Mô tả |
|--------|--------|-----|---------|-------|
| Create | POST | `/api/v1/ext/work-schedules` | `UpsertWorkScheduleRequest` | Tạo 1 record |
| Update | PUT | `/api/v1/ext/work-schedules/{id}` | `UpsertWorkScheduleRequest` | |
| Delete | DELETE | `/api/v1/ext/work-schedules/{id}` | — | Soft delete |
| Bulk upsert | POST | `/api/v1/ext/work-schedules/bulk-upsert` | `BulkUpsertWorkScheduleRequest` | Tối đa 500 items/req |

## 5. Validation Rules

### 5.1 ListWorkScheduleRequest

| Field | Rules | Message (VI) |
|-------|-------|--------------|
| `account_id` | `['nullable', 'integer', 'exists:accounts,id']` | Nhân viên không tồn tại |
| `project_id` | `['nullable', 'integer', 'exists:projects,id']` | Dự án không tồn tại |
| `shift_id` | `['nullable', 'integer', 'exists:shifts,id']` | Ca không tồn tại |
| `month` | `['nullable', 'string', 'regex:/^\d{4}-\d{2}$/']` | Tháng phải đúng định dạng YYYY-MM |
| `date_from` | `['nullable', 'date_format:Y-m-d']` | Ngày bắt đầu sai định dạng |
| `date_to` | `['nullable', 'date_format:Y-m-d', 'after_or_equal:date_from']` | Ngày kết thúc phải >= ngày bắt đầu |
| `per_page` | `['nullable', 'integer', 'min:1', 'max:500']` | Số dòng/trang từ 1–500 |

### 5.2 UpsertWorkScheduleRequest (external)

| Field | Rules | Message (VI) |
|-------|-------|--------------|
| `account_code` | `['required', 'string', Rule::exists('accounts','employee_code')->whereNull('deleted_at')]` | Mã nhân viên là bắt buộc / Mã nhân viên không tồn tại |
| `project_code` | `['required', 'string', Rule::exists('projects','code')->whereNull('deleted_at')]` | Mã dự án là bắt buộc / Mã dự án không tồn tại |
| `shift_code` | `['required', 'string', 'exists:shifts,code']` | Mã ca là bắt buộc / Mã ca không tồn tại (HR phải GET `/external/v1/shifts` để lấy) |
| `date` | `['required', 'date_format:Y-m-d']` | Ngày không đúng định dạng YYYY-MM-DD |
| `note` | `['nullable', 'string', 'max:255']` | |
| `external_ref` | `['nullable', 'string', 'max:255', Rule::unique('work_schedules','external_ref')->whereNull('deleted_at')->ignore($id)]` | External ref đã tồn tại |

### 5.3 BulkUpsertWorkScheduleRequest

| Field | Rules |
|-------|-------|
| `items` | `['required', 'array', 'min:1', 'max:500']` |
| `items.*.external_ref` | `['required', 'string', 'max:255']` — bắt buộc cho bulk (làm khoá match) |
| `items.*.account_code` | `['required', 'string']` |
| `items.*.project_code` | `['required', 'string']` |
| `items.*.shift_code` | `['required', 'string']` |
| `items.*.date` | `['required', 'date_format:Y-m-d']` |
| `items.*.note` | `['nullable', 'string', 'max:255']` |

Bulk không validate `exists` per-item (N+1). Service fetch map `{code → id}` 1 query mỗi bảng rồi xử lý per-item, item fail thêm vào `errors[]`.

## 6. Business Rules

- [ ] `(account_id, project_id, shift_id, date)` unique (partial). Duplicate → 409 Conflict.
- [ ] `external_ref` unique (partial). Upsert theo `external_ref` nếu có.
- [ ] Matching order:
  1. Nếu `external_ref` có và record tồn tại → update record đó.
  2. Nếu không có / không tìm thấy → tạo mới (INSERT). Vi phạm unique natural key → 409.
- [ ] `shift_code` phải match `shifts.code` (không có softDeletes nên không cần `whereNull`). HR phải gọi `GET /api/v1/ext/shifts` trước để biết codes.
- [ ] Scope theo `api_project_id`: API key chỉ thao tác WorkSchedule cho project được cấp quyền.
  - Middleware `AuthenticateApiClient` inject `api_project_id` vào `$request->attributes`.
  - Controller check: nếu `project_code` resolve ra `project_id != api_project_id` → 403 `"Project không thuộc API key hiện tại"`.
  - Bulk-upsert: check từng item, item sai project thêm vào `errors[]`.
- [ ] `DELETE` là soft delete.
- [ ] Không validate "date >= today" — HR có thể backfill.
- [ ] Bulk: xử lý từng item độc lập trong try/catch. Item fail không làm hỏng batch. Response trả stats:
  ```json
  { "success": true, "data": { "created": 10, "updated": 5, "skipped": 0, "errors": [{"index": 3, "external_ref": "HR-WS-X", "message": "..."}] } }
  ```

## 7. Resource Output

**WorkScheduleResource:**
```json
{
  "id": 101,
  "date": "2026-04-15",
  "account": { "id": 1, "employee_code": "NV001", "name": "Nguyễn Văn A" },
  "project": { "id": 10, "code": "PRJ-01", "name": "Dự án Aurora" },
  "shift": { "id": 1, "code": "SANG", "name": "Ca sáng", "start_time": "06:00", "end_time": "14:00" },
  "note": null,
  "external_ref": "HR-WS-2026-04-15-NV001-SANG"
}
```

**BulkUpsertResultResource:**
```json
{
  "success": true,
  "message": "Bulk upsert hoàn tất",
  "data": {
    "created": 10,
    "updated": 5,
    "skipped": 0,
    "errors": [
      { "index": 3, "external_ref": "HR-WS-X", "message": "account_code NV999 không tồn tại" }
    ]
  }
}
```

## 8. Cross-Module Dependencies

- `Shift`, `Account`, `Project` đều cùng module `PMC` → import `*Repository` trực tiếp. Không dùng `ExternalService`.

## 9. Migration Preview

```php
Schema::create('work_schedules', function (Blueprint $table) {
    $table->id();
    $table->foreignId('account_id')->constrained('accounts')->cascadeOnDelete();
    $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
    $table->foreignId('shift_id')->constrained('shifts')->restrictOnDelete();
    $table->date('date');
    $table->string('note', 255)->nullable();
    $table->string('external_ref', 255)->nullable();
    $table->timestamps();
    $table->softDeletes();

    $table->index(['account_id', 'date']);
    $table->index(['project_id', 'date']);
    $table->index('date');
});

DB::statement('CREATE UNIQUE INDEX work_schedules_natural_unique ON work_schedules (account_id, project_id, shift_id, date) WHERE deleted_at IS NULL');
DB::statement('CREATE UNIQUE INDEX work_schedules_external_ref_unique ON work_schedules (external_ref) WHERE deleted_at IS NULL AND external_ref IS NOT NULL');
```

## 10. Service logic — bulkUpsert

```php
public function bulkUpsert(array $items, int $apiProjectId): array
{
    $accountCodes = collect($items)->pluck('account_code')->unique()->toArray();
    $projectCodes = collect($items)->pluck('project_code')->unique()->toArray();
    $shiftCodes   = collect($items)->pluck('shift_code')->unique()->toArray();

    $accountMap = $this->accountRepo->mapByEmployeeCode($accountCodes);
    $projectMap = $this->projectRepo->mapByCode($projectCodes);
    $shiftMap   = $this->shiftRepo->mapByCode($shiftCodes);

    $stats = ['created' => 0, 'updated' => 0, 'skipped' => 0, 'errors' => []];

    foreach ($items as $i => $item) {
        try {
            $accountId = $accountMap[$item['account_code']] ?? null;
            $projectId = $projectMap[$item['project_code']] ?? null;
            $shiftId   = $shiftMap[$item['shift_code']]     ?? null;

            if (!$accountId) throw new BusinessException("account_code {$item['account_code']} không tồn tại");
            if (!$projectId) throw new BusinessException("project_code {$item['project_code']} không tồn tại");
            if (!$shiftId)   throw new BusinessException("shift_code {$item['shift_code']} không tồn tại");
            if ($projectId !== $apiProjectId) throw new BusinessException("Project không thuộc API key hiện tại");

            $existing = $this->repo->findByExternalRef($item['external_ref']);
            if ($existing) {
                $this->repo->update($existing->id, [
                    'account_id' => $accountId,
                    'project_id' => $projectId,
                    'shift_id'   => $shiftId,
                    'date'       => $item['date'],
                    'note'       => $item['note'] ?? null,
                ]);
                $stats['updated']++;
            } else {
                $this->repo->create([
                    'account_id' => $accountId,
                    'project_id' => $projectId,
                    'shift_id'   => $shiftId,
                    'date'       => $item['date'],
                    'note'       => $item['note'] ?? null,
                    'external_ref' => $item['external_ref'],
                ]);
                $stats['created']++;
            }
        } catch (\Throwable $e) {
            $stats['errors'][] = [
                'index' => $i,
                'external_ref' => $item['external_ref'] ?? null,
                'message' => $e->getMessage(),
            ];
        }
    }

    return $stats;
}
```

> Service KHÔNG gọi `Model::query()` trực tiếp — mọi DB call qua Repository.

## 11. Checklist triển khai

- [ ] Migration `create_work_schedules_table`
- [ ] Model `WorkSchedule` (extends `BaseModel`, `SoftDeletes`)
- [ ] Repository `WorkScheduleRepository` + Interface:
  - [ ] `list(array $filters)`, `findById`, `create`, `update`, `delete`
  - [ ] `findByExternalRef(string $ref): ?WorkSchedule`
  - [ ] `findByNaturalKey(int $accountId, int $projectId, int $shiftId, string $date): ?WorkSchedule`
  - [ ] `inRangeForAccounts(array $accountIds, string $from, string $to): Collection` — dùng cho schedule-slot team view
- [ ] Service `WorkScheduleService` + Interface: `list`, `findById`, `create`, `update`, `delete`, `bulkUpsert`
- [ ] Repository methods bổ sung trên module khác (cùng PMC):
  - [ ] `AccountRepository::mapByEmployeeCode(array $codes): array<string,int>`
  - [ ] `ProjectRepository::mapByCode(array $codes): array<string,int>`
- [ ] Requests: `ListWorkScheduleRequest`, `UpsertWorkScheduleRequest`, `BulkUpsertWorkScheduleRequest`
- [ ] Resources: `WorkScheduleResource`, `BulkUpsertResultResource`
- [ ] Controllers:
  - [ ] `WorkScheduleController` (internal — `index`, `show`)
  - [ ] `ExtWorkScheduleController` (external — `store`, `update`, `destroy`, `bulkUpsert`)
- [ ] Factory + Seeder (cho tests)
- [ ] Routes:
  - [ ] `api.php`: `apiResource('work-schedules')->only(['index','show'])`
  - [ ] `external.php`: `apiResource('work-schedules')->only(['store','update','destroy'])` + `POST bulk-upsert`
- [ ] Scope `work-schedules:write` trong config OAuth scopes
- [ ] Tests:
  - [ ] Internal GET filter theo `account_id`/`project_id`/`month`
  - [ ] Internal POST/PUT/DELETE → 404/405
  - [ ] External POST với natural keys tạo record đúng
  - [ ] External POST duplicate `external_ref` → update (idempotent)
  - [ ] External POST với `project_code` khác API key → 403
  - [ ] External POST duplicate natural key → 409
  - [ ] External bulk-upsert mixed ok/error → trả stats đúng
  - [ ] Bulk > 500 items → 422
