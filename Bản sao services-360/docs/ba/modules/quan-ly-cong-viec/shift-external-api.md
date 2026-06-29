# Quản lý ca làm việc — Spec External API (CRUD đầy đủ)

> Module: `PMC/ExternalApi/Shift` | Ngày tạo: 2026-04-15 | Trạng thái: Draft
> Liên quan: [`shift-be.md`](./shift-be.md), [`shift-fe.md`](./shift-fe.md), [`work-slot-snapshot.md`](./work-slot-snapshot.md)

## 1. Tổng quan

Mở External API cho HR bên ngoài **CRUD tự do** Shift, đồng bộ với luồng đã có của WorkSchedule. Từ v1 (read-only) → v2 (**full CRUD**).

**Thay đổi so với v1:**
- Thêm: `POST`, `PUT`, `DELETE`, `POST bulk-upsert`
- Thêm scope OAuth: `shifts:write`
- Route param dùng `{code}` (không `{id}`) — nhất quán với external pattern
- Validation đồng nhất với internal
- Business rule xóa giống internal (chặn nếu có WorkSchedule)

**Nguyên tắc thiết kế:**
- HR là "admin thứ 2" → trao quyền CRUD đầy đủ
- Identifier public dùng `code` (stable, readable) — HR không cần biết `id`
- Idempotent bulk qua `code`

## 2. Endpoints

**Base URL:** `/api/v1/ext/shifts`

| Action | Method | URL | Request | Scope | Mô tả |
|--------|--------|-----|---------|-------|-------|
| List | `GET` | `/ext/shifts` | — | `shifts:read` | Danh sách ca. Default filter `status=active`. Param `status=all` để lấy cả inactive |
| Show | `GET` | `/ext/shifts/{code}` | — | `shifts:read` | Chi tiết 1 ca theo code |
| Create | `POST` | `/ext/shifts` | `ExtCreateShiftRequest` | `shifts:write` | Tạo ca mới |
| Update | `PUT` | `/ext/shifts/{code}` | `ExtUpdateShiftRequest` | `shifts:write` | Sửa ca theo code |
| Delete | `DELETE` | `/ext/shifts/{code}` | — | `shifts:write` | Xóa ca (chặn nếu có WorkSchedule) |
| Bulk Upsert | `POST` | `/ext/shifts/bulk-upsert` | `ExtBulkUpsertShiftRequest` | `shifts:write` | Tạo/sửa hàng loạt theo code |

### 2.1 Query params cho List

| Param | Type | Mô tả |
|-------|------|-------|
| `search` | string | Search code hoặc name |
| `status` | `active`/`inactive`/`all` | Default `active`. `all` → không filter |
| `type` | string | Filter kiểu ca |
| `work_group` | string | Filter nhóm xử lý |
| `per_page` | int (1-100) | Default 50 (external thường fetch nhiều hơn internal) |
| `page` | int | |
| `sort` | string | `code`, `name`, `sort_order` (prefix `-` desc) |

## 3. Scope OAuth

**Thêm scope mới:** `shifts:write`

Cập nhật `config/oauth-scopes.php` (hoặc file tương đương):

```php
return [
    'shifts:read' => 'Đọc danh sách ca làm việc',
    'shifts:write' => 'Tạo/sửa/xóa ca làm việc',
    'work-schedules:read' => '...',
    'work-schedules:write' => '...',
];
```

Middleware `scope:shifts:write` áp cho `POST`, `PUT`, `DELETE`, `bulk-upsert`.

## 4. Controller

**File mới / mở rộng:** `backend/app/Modules/PMC/src/ExternalApi/Controllers/ExtShiftController.php`

```php
class ExtShiftController extends BaseController
{
    public function __construct(
        protected ShiftServiceInterface $shiftService,
    ) {}

    public function index(ExtListShiftRequest $request): AnonymousResourceCollection { /* ... */ }

    public function show(string $code): ShiftResource
    {
        $shift = $this->shiftService->findByCode($code);
        return new ShiftResource($shift);
    }

    public function store(ExtCreateShiftRequest $request): ShiftResource
    {
        $shift = $this->shiftService->create($request->validated());
        return new ShiftResource($shift);
    }

    public function update(string $code, ExtUpdateShiftRequest $request): ShiftResource
    {
        $shift = $this->shiftService->updateByCode($code, $request->validated());
        return new ShiftResource($shift);
    }

    public function destroy(string $code): JsonResponse
    {
        $this->shiftService->deleteByCode($code);
        return response()->json(null, 204);
    }

    public function bulkUpsert(ExtBulkUpsertShiftRequest $request): JsonResponse
    {
        $result = $this->shiftService->bulkUpsertByCode($request->validated('items'));
        return response()->json($result); // ['created' => n, 'updated' => n, 'skipped' => [...]]
    }
}
```

**Chia sẻ Service với internal** — `ShiftService` thêm methods `findByCode`, `updateByCode`, `deleteByCode`, `bulkUpsertByCode`. Internal + External dùng chung Service, không duplicate business logic.

## 5. Request Classes

### 5.1 `ExtCreateShiftRequest`

Giống `CreateShiftRequest` internal 100% — fields và validation đồng nhất:

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

### 5.2 `ExtUpdateShiftRequest`

```php
return [
    // KHÔNG cho sửa code qua PUT (code là identifier, muốn đổi → delete + create)
    'name' => ['sometimes', 'required', 'string', 'max:100'],
    'type' => ['sometimes', 'required', 'string', 'max:50'],
    'work_group' => ['sometimes', 'required', 'string', 'max:50'],
    'start_time' => ['sometimes', 'required', 'date_format:H:i'],
    'end_time' => ['sometimes', 'required', 'date_format:H:i'],
    'break_hours' => ['sometimes', 'nullable', 'numeric', 'min:0', 'max:24'],
    'status' => ['sometimes', 'required', Rule::enum(ShiftStatusEnum::class)],
    'sort_order' => ['sometimes', 'nullable', 'integer', 'min:0'],
];
```

**Lưu ý:** `sometimes` cho phép partial update — HR gửi gì update đó. Không update `code` (dùng làm identifier, đổi thì phải delete + create).

### 5.3 `ExtBulkUpsertShiftRequest`

```php
return [
    'items' => ['required', 'array', 'min:1', 'max:500'],
    'items.*.code' => ['required', 'string', 'max:50'],
    'items.*.name' => ['required', 'string', 'max:100'],
    'items.*.type' => ['required', 'string', 'max:50'],
    'items.*.work_group' => ['required', 'string', 'max:50'],
    'items.*.start_time' => ['required', 'date_format:H:i'],
    'items.*.end_time' => ['required', 'date_format:H:i'],
    'items.*.break_hours' => ['nullable', 'numeric', 'min:0', 'max:24'],
    'items.*.status' => ['required', Rule::enum(ShiftStatusEnum::class)],
    'items.*.sort_order' => ['nullable', 'integer', 'min:0'],
];
```

## 6. Service — Thêm methods

**File:** `backend/app/Modules/PMC/src/Shift/Services/ShiftService.php`

```php
public function findByCode(string $code): Shift
{
    $shift = $this->shiftRepository->findByCode($code);
    throw_if(! $shift, new ModelNotFoundException("Shift code '$code' not found"));
    return $shift;
}

public function updateByCode(string $code, array $data): Shift
{
    $shift = $this->findByCode($code);
    return $this->update($shift->id, $data);
}

public function deleteByCode(string $code): void
{
    $shift = $this->findByCode($code);
    $this->delete($shift->id); // business rule check ở trong delete()
}

public function bulkUpsertByCode(array $items): array
{
    $result = ['created' => 0, 'updated' => 0, 'skipped' => []];

    return $this->executeInTransaction(function () use ($items, $result) {
        foreach ($items as $item) {
            try {
                $existing = $this->shiftRepository->findByCode($item['code']);
                if ($existing) {
                    $this->update($existing->id, Arr::except($item, ['code']));
                    $result['updated']++;
                } else {
                    $this->create($item);
                    $result['created']++;
                }
            } catch (\Throwable $e) {
                $result['skipped'][] = ['code' => $item['code'], 'reason' => $e->getMessage()];
            }
        }
        return $result;
    });
}
```

**Repository — thêm method (nếu chưa có):**

```php
public function findByCode(string $code): ?Shift;
```

## 7. Business Rules

Đồng nhất với internal:

- [ ] `code` unique toàn hệ thống (DB constraint).
- [ ] Delete: chặn nếu có WorkSchedule → throw `BusinessException` → HTTP 422 với message rõ ràng.
- [ ] Update không cho sửa `code` (partial update qua `sometimes`).
- [ ] Bulk upsert: mỗi item thành công/fail độc lập, không rollback cả batch. Item fail đưa vào `skipped` với `reason`.
- [ ] Transaction wrap bulk: nếu có exception không catch được ở level cao → rollback toàn bộ (safety net).
- [ ] Cron `snapshot` và event `WorkScheduleSaved` **không** liên quan trực tiếp Shift CRUD — không fire event khi Shift thay đổi (giữ nguyên).

**External KHÔNG có quyền đặc biệt khác internal** — cùng rule, cùng Service, cùng validation.

## 8. Response

### 8.1 Single shift (GET show, POST create, PUT update)

Dùng `ShiftResource` chung:

```json
{
  "data": {
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
}
```

### 8.2 List (GET)

```json
{
  "data": [...],
  "meta": { "current_page": 1, "last_page": 1, "per_page": 50, "total": 15 }
}
```

### 8.3 Bulk upsert response

```json
{
  "created": 3,
  "updated": 10,
  "skipped": [
    { "code": "CS99", "reason": "Ca đã có lịch việc, không thể cập nhật status về inactive" }
  ]
}
```

**HTTP status:** `200` nếu bulk hoàn tất (kể cả có skipped items). `422` chỉ khi toàn bộ items đều fail validation level Request.

### 8.4 Error responses

- `401 Unauthorized` — thiếu token
- `403 Forbidden` — sai scope (cần `shifts:write`)
- `404 Not Found` — `{code}` không tồn tại (show/update/delete)
- `422 Unprocessable Entity` — validation fail hoặc business rule (delete khi có WorkSchedule)
- `409 Conflict` — code đã tồn tại khi POST create (optional — có thể dùng 422)

## 9. Chia sẻ code với Internal API

**Nguyên tắc:** Business logic **KHÔNG duplicate**.

| Layer | Internal | External | Ghi chú |
|-------|----------|----------|---------|
| Controller | `ShiftController` | `ExtShiftController` | Riêng, mỏng |
| Request | `CreateShiftRequest` | `ExtCreateShiftRequest` | Có thể extend internal hoặc copy rules (tùy convention project) |
| Service | `ShiftService` | `ShiftService` (shared) | **Dùng chung** |
| Repository | `ShiftRepository` | `ShiftRepository` (shared) | **Dùng chung** |
| Resource | `ShiftResource` | `ShiftResource` (shared) | **Dùng chung** |
| Routes | `api.php` | `external.php` | Riêng |

**Quyết định:** Request class tách riêng (External có thể mở rộng rule khác trong tương lai — vd tăng `max:500` bulk), nhưng giờ giống hệt internal.

## 10. Routes

**File:** `backend/app/Modules/PMC/routes/external.php`

```php
Route::middleware(['auth:api', 'scope:shifts:read'])->group(function () {
    Route::get('shifts', [ExtShiftController::class, 'index']);
    Route::get('shifts/{code}', [ExtShiftController::class, 'show']);
});

Route::middleware(['auth:api', 'scope:shifts:write'])->group(function () {
    Route::post('shifts', [ExtShiftController::class, 'store']);
    Route::put('shifts/{code}', [ExtShiftController::class, 'update']);
    Route::delete('shifts/{code}', [ExtShiftController::class, 'destroy']);
    Route::post('shifts/bulk-upsert', [ExtShiftController::class, 'bulkUpsert']);
});
```

**Thứ tự route quan trọng:** `/shifts/bulk-upsert` phải đứng **trước** `/shifts/{code}` (Laravel match theo thứ tự) — tránh `{code}` nuốt luôn `bulk-upsert`.

## 11. External Impact — nhắc lại

### 11.1 Tương tác với WorkSchedule external

External HR có 2 luồng:
1. **Quản lý Shift** — spec này
2. **Push WorkSchedule** — dùng `shift_code` (đã có, `work-schedule-be.md`)

**Flow điển hình:**
```
Bước 1: HR tạo ca mới → POST /ext/shifts { code: "CA1", ... }
Bước 2: HR gửi lịch → POST /ext/work-schedules/bulk-upsert [{ shift_code: "CA1", ... }]
```

### 11.2 Validation shift_code trong WorkSchedule

Giữ nguyên: `exists:shifts,code` (**không** filter status) — HR có quyền push lịch vào ca inactive nếu muốn (consistency với việc external tự CRUD toàn quyền).

**Rationale:** External là admin, tự chịu trách nhiệm. UI internal tự lọc `only_active=true` cho dropdown là đủ.

## 12. Checklist triển khai

**Controller & Routes:**
- [ ] `ExtShiftController`: thêm `show`, `store`, `update`, `destroy`, `bulkUpsert`
- [ ] Routes external: GET/POST/PUT/DELETE + bulk-upsert

**Request Classes:**
- [ ] `ExtListShiftRequest` (nếu chưa có)
- [ ] `ExtCreateShiftRequest`
- [ ] `ExtUpdateShiftRequest`
- [ ] `ExtBulkUpsertShiftRequest`

**Service:**
- [ ] `ShiftService::findByCode`
- [ ] `ShiftService::updateByCode`
- [ ] `ShiftService::deleteByCode`
- [ ] `ShiftService::bulkUpsertByCode`
- [ ] Transaction wrap cho bulk

**Repository:**
- [ ] `ShiftRepository::findByCode` (nếu chưa có)

**OAuth Scopes:**
- [ ] Thêm `shifts:write` vào config scopes
- [ ] Cấp scope cho client HR external (admin tool hoặc seed)

**API Documentation:**
- [ ] Scramble annotation `@tags`, `@response` cho 6 endpoint external
- [ ] Chạy `php artisan scramble:export`

**Tests:**
- [ ] GET `/ext/shifts` với scope đúng → 200
- [ ] GET `/ext/shifts` thiếu scope → 403
- [ ] POST `/ext/shifts` tạo mới → 201 + resource
- [ ] POST `/ext/shifts` trùng code → 422
- [ ] PUT `/ext/shifts/{code}` partial update → 200
- [ ] PUT `/ext/shifts/NONEXIST` → 404
- [ ] DELETE `/ext/shifts/{code}` (no WorkSchedule) → 204
- [ ] DELETE `/ext/shifts/{code}` có WorkSchedule → 422 + message
- [ ] Bulk upsert: mix create + update → đếm đúng
- [ ] Bulk upsert: 1 item fail (vd unique) → item đó vào skipped, còn lại OK
- [ ] Bulk upsert: vượt `max:500` → 422

## 13. Security Considerations

- [ ] **Rate limiting** cho endpoints external — default 60 req/min, bulk-upsert 10 req/min (payload lớn)
- [ ] **Audit log** external action (nếu hệ thống có audit middleware) — dù Shift không có audit field, log request/response ở middleware level
- [ ] **Scope separation**: `shifts:read` không được vô tình leak sang write; kiểm tra config gateway
- [ ] **Input sanitization**: text fields `type`, `work_group` dùng trực tiếp trong UI internal → escape khi render (Vue auto escape, nhưng vẫn strip HTML nếu paranoid)
- [ ] **Bulk DoS**: giới hạn `items.max:500`, timeout 30s

## 14. Migration / Rollout

Không cần migration mới. Chỉ cần:
1. Thêm scope `shifts:write` vào OAuth config
2. Deploy code
3. Thông báo HR team về endpoints mới

**Backward compat:** v1 GET endpoints vẫn hoạt động nguyên vẹn. Client cũ không break.
