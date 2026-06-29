# Backend Code Audit Report

**Ngày kiểm tra:** 2026-03-01
**Phạm vi:** `backend/app/` — toàn bộ Common layer và Modules (PMC)
**Mục tiêu:** Phát hiện duplicate code, đánh giá tính tái sử dụng, kiểm tra nhất quán kiến trúc

---

## Mục lục

1. [Tổng quan kiến trúc](#1-tổng-quan-kiến-trúc)
2. [Base Classes — Compliance](#2-base-classes--compliance)
3. [Duplicate Code](#3-duplicate-code)
4. [Vấn đề kiến trúc](#4-vấn-đề-kiến-trúc)
5. [Thiếu nhất quán](#5-thiếu-nhất-quán)
6. [Testing Gaps](#6-testing-gaps)
7. [Đề xuất Refactor](#7-đề-xuất-refactor)

---

## 1. Tổng quan kiến trúc

### Module Structure

```
backend/app/
├── Common/                          # Shared layer
│   ├── Contracts/                   # RepositoryInterface, PresenterInterface, StorageServiceInterface
│   ├── Controllers/BaseController
│   ├── Exceptions/BusinessException
│   ├── Http/
│   │   ├── JsonResponseHelper
│   │   └── Middleware/CheckPermission
│   ├── Models/BaseModel
│   ├── OpenApi/                     # Scramble extensions
│   ├── ~~Presenters/BasePresenter~~  # ✅ DELETED
│   ├── Providers/CommonServiceProvider
│   ├── Repositories/BaseRepository
│   ├── Requests/BaseFormRequest
│   ├── Resources/BaseResource
│   ├── Services/BaseService, StorageService
│   └── Traits/Auditable
│
├── Modules/
│   ├── PMC/                         # Property Management Company
│   │   ├── src/
│   │   │   ├── Account/            # Accounts, Roles, Permissions, Auth
│   │   │   ├── Department/         # Department management
│   │   │   ├── JobTitle/           # Job title management
│   │   │   └── Project/            # Project management
│   │   ├── database/migrations/
│   │   ├── routes/
│   │   ├── tests/
│   │   └── Providers/PMCServiceProvider
│   │
│   └── Skeleton/                    # Template module (empty)
```

### Base Classes

| Base Class | Chức năng |
|-----------|-----------|
| `BaseModel` | `HasFactory`, `SoftDeletes`, `scopeActive()`, `scopeRecent()`, `scopeLatestFirst()` |
| `BaseService` | `executeInTransaction()` — wrap DB::transaction với error handling |
| `BaseRepository` | `findById()`, `findAll()`, `create()`, `update()`, `delete()`, `paginate()`, `applySorting()`, `getPerPage()` |
| `BaseController` | Abstract class, extends Laravel Controller (no extra logic) |
| `BaseResource` | `with()` → inject `['success' => true]` vào mọi response |
| `BaseFormRequest` | Override `failedValidation()` → JSON error `success: false`, default `authorize() = true` |
| `BasePresenter` | Abstract `present()`, `presentCollection()`, `formatDate()`, `formatCurrency()` — **KHÔNG AI DÙNG** |

---

## 2. Base Classes — Compliance

### Tổng hợp

| Base Class | Tổng classes | Extend Base | Không extend | Compliance |
|-----------|:-----------:|:-----------:|:------------:|:----------:|
| BaseController | 7 | 7 | 0 | **100%** |
| BaseService | 7 | 7 | 0 | **100%** |
| BaseRepository | 5 | 5 | 0 | **100%** |
| BaseModel | 7 | 4 | 3 | **57%*** |
| BaseResource | 7 | 6 | 1 | **86%** |
| BaseFormRequest | 19 | 19 | 0 | **100%** |
| ~~BasePresenter~~ | — | — | — | ✅ Deleted |

*\*3 models không extend BaseModel có lý do kiến trúc hợp lệ (xem chi tiết bên dưới).*

### Chi tiết exceptions

**Models không extend BaseModel:**

| Model | Extends | Lý do |
|-------|---------|-------|
| `Account` | `Authenticatable` | Cần cho Sanctum auth — hợp lệ |
| `Permission` | `Model` | Không cần SoftDeletes/audit — hợp lệ |
| `AccountProject` | `Model` | Pivot table, không timestamps — hợp lệ |

**Services không extend BaseService:** ✅ ALL FIXED

| Service | Vấn đề | Status |
|---------|--------|:------:|
| ~~`AuthService`~~ | ~~`register()` tạo account + token không có transaction wrapping~~ | ✅ |
| ~~`DefaultRoleService`~~ | ~~Loop tạo/update roles không có transaction — risk partial data~~ | ✅ |

**Resource không extend BaseResource:**

| Resource | Vấn đề |
|---------|--------|
| `AuthResource` | Extends `JsonResource` trực tiếp, controller phải manually thêm `success: true` |

---

## 3. Duplicate Code

### 3.1 Controller CRUD Methods — 5 controllers, ~95% giống nhau

**Severity: HIGH**

**Files:**
- `Account/Controllers/AccountController.php`
- `Account/Controllers/RoleController.php`
- `Department/Controllers/DepartmentController.php`
- `JobTitle/Controllers/JobTitleController.php`
- `Project/Controllers/ProjectController.php`

5 methods (`index`, `show`, `store`, `update`, `destroy`) copy-paste qua 5 controllers, chỉ thay tên class:

```php
// Pattern lặp lại ở tất cả controllers:
public function index(ListXxxRequest $request): AnonymousResourceCollection
{
    $paginator = $this->service->list($request->validated());
    return XxxResource::collection($paginator)->additional(['success' => true]);
}

public function show(int $id): XxxResource
{
    return new XxxResource($this->service->findById($id));
}

public function store(CreateXxxRequest $request): JsonResponse
{
    return (new XxxResource($this->service->create($request->validated())))
        ->response()->setStatusCode(Response::HTTP_CREATED);
}

public function update(UpdateXxxRequest $request, int $id): XxxResource
{
    return new XxxResource($this->service->update($id, $request->validated()));
}

public function destroy(int $id): JsonResponse
{
    $this->service->delete($id);
    return response()->json(['message' => 'Xoá thành công.']);
}
```

**Đề xuất:** Tạo `HasCrudActions` trait hoặc đưa generic methods vào `BaseController`.

---

### 3.2 Service CRUD Methods — 5 services, 80-95% giống nhau

**Severity: HIGH**

**Files:**
- `Account/Services/AccountService.php`
- `Account/Services/RoleService.php`
- `Department/Services/DepartmentService.php`
- `JobTitle/Services/JobTitleService.php`
- `Project/Services/ProjectService.php`

```php
// list() — 5 copies, 100% giống nhau
public function list(array $filters): LengthAwarePaginator
{
    return $this->repository->list($filters);
}

// findById() — 5 copies, chỉ khác model type + relations
public function findById(int $id): Xxx
{
    return $this->repository->findById($id, ['*'], ['relation1', 'relation2']);
}

// delete() — 4 copies, cùng pattern
public function delete(int $id): void
{
    $this->executeInTransaction(function () use ($id): void {
        $entity = $this->repository->findById($id);
        $entity->delete();
    });
}

// update() — 3 copies, cùng find-update-refresh pattern
public function update(int $id, array $data): Xxx
{
    return $this->executeInTransaction(function () use ($id, $data): Xxx {
        $entity = $this->repository->findById($id);
        $entity->update($data);
        return $entity->refresh();
    });
}
```

**Đề xuất:** Đưa CRUD methods vào `BaseService`, cho phép override khi cần business logic riêng.

---

### 3.3 Service Interfaces — 5 files, ~90% giống nhau

**Severity: HIGH**

Tất cả 5 interfaces định nghĩa cùng 5 method signatures:

```php
public function list(array $filters): LengthAwarePaginator;
public function findById(int $id): ModelType;
public function create(array $data): ModelType;
public function update(int $id, array $data): ModelType;
public function delete(int $id): void;
```

**Files:**
- `AccountServiceInterface`, `RoleServiceInterface`, `DepartmentServiceInterface`, `JobTitleServiceInterface`, `ProjectServiceInterface`

**Đề xuất:** Tạo `CrudServiceInterface` base, sub-interfaces chỉ thêm entity-specific methods.

---

### 3.4 Repository `list()` Method — 5 files, ~85% giống nhau

**Severity: HIGH**

Cùng skeleton: `newQuery()` → search → entity filters → `applySorting()` → `paginate()`.

```php
// Pattern lặp lại ở tất cả repositories:
public function list(array $filters): LengthAwarePaginator
{
    $query = $this->newQuery()->with([...]);

    if (! empty($filters['search'])) {
        $query->search($filters['search']);
    }

    // entity-specific filters...

    $this->applySorting($query, $filters);

    return $query->paginate($this->getPerPage($filters));
}
```

**Đề xuất:** Đưa common structure vào `BaseRepository::list()`, cung cấp hook `applyFilters()` cho entity-specific logic.

---

### 3.5 Model `scopeSearch()` — 3 files copy 100%

**Severity: HIGH**

`Department`, `JobTitle`, `Project` có implementation **hoàn toàn giống nhau**:

```php
public function scopeSearch(Builder $query, string $keyword): Builder
{
    return $query->where(function (Builder $q) use ($keyword): void {
        $q->where('name', 'like', "%{$keyword}%")
            ->orWhere('code', 'like', "%{$keyword}%");
    });
}
```

`Role` search chỉ `name`, `Account` search `name` + `email` + `employee_code`.

**Đề xuất:** Tạo `Searchable` trait với `$searchableColumns` property:

```php
trait Searchable
{
    protected array $searchableColumns = ['name', 'code']; // override per model

    public function scopeSearch(Builder $query, string $keyword): Builder
    {
        return $query->where(function (Builder $q) use ($keyword): void {
            foreach ($this->searchableColumns as $column) {
                $q->orWhere($column, 'like', "%{$keyword}%");
            }
        });
    }
}
```

---

### 3.6 Enum `values()` Method — 5 files, 100% giống nhau

**Severity: MEDIUM**

```php
// Copy-paste qua 5 enums:
public static function values(): array
{
    return array_column(self::cases(), 'value');
}
```

**Files:** `Gender`, `PermissionAction`, `PermissionSubModule`, `RoleType`, `ProjectStatus`

**Đề xuất:** Tạo `HasEnumValues` trait.

---

### 3.7 List FormRequests — Common rules duplicate

**Severity: MEDIUM**

5 List requests chứa rules giống nhau cho `search`, `sort_direction`, `per_page`:

```php
// Duplicate qua 5 files:
'search' => ['nullable', 'string', 'max:255'],
'sort_direction' => ['nullable', 'string', 'in:asc,desc'],
'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
```

**Files:** `ListAccountRequest`, `ListRoleRequest`, `ListDepartmentRequest`, `ListJobTitleRequest`, `ListProjectRequest`

**Đề xuất:** Tạo `BaseListRequest` hoặc `ListableRules` trait.

---

### 3.8 `resolveAvatarUrl()` — 2 files, 100% giống nhau — ✅ DONE

**Severity: MEDIUM** → **RESOLVED**

Đã chuyển thành `avatarUrl` Eloquent accessor trên `Account` model. Cả `AccountResource` và `AuthResource` giờ dùng `$this->avatar_url`.

---

### 3.9 Controller Middleware — 5 files, ~90% giống nhau

**Severity: LOW**

```php
// Cùng structure, chỉ khác permission prefix:
public static function middleware(): array
{
    return [
        new Middleware('permission:entity.view', only: ['index', 'show']),
        new Middleware('permission:entity.store', only: ['store']),
        new Middleware('permission:entity.update', only: ['update']),
        new Middleware('permission:entity.destroy', only: ['destroy']),
    ];
}
```

---

### 3.10 "In Use" Check Pattern — RoleService + JobTitleService

**Severity: LOW**

```php
// Cùng pattern, khác column + error code:
$accountCount = Account::where('xxx_id', $entity->id)->count();
if ($accountCount > 0) {
    throw new BusinessException("Không thể xóa: còn {$accountCount} tài khoản...", 'XXX_IN_USE', ...);
}
```

**Đề xuất:** Extract thành `ensureNotReferencedBy()` helper.

---

### Tổng hợp Duplicate Code

| # | Pattern | Files | Similarity | Severity |
|---|---------|:-----:|:----------:|:--------:|
| 3.1 | Controller CRUD methods | 5 | 95% | HIGH |
| 3.2 | Service CRUD methods | 5 | 80-95% | HIGH |
| 3.3 | Service Interfaces | 5 | 90% | HIGH |
| 3.4 | Repository `list()` | 5 | 85% | HIGH |
| 3.5 | Model `scopeSearch()` | 3+2 | 100% / 80% | HIGH |
| 3.6 | Enum `values()` | 5 | 100% | MEDIUM |
| 3.7 | List FormRequest rules | 5 | 70% | MEDIUM |
| 3.8 | ~~`resolveAvatarUrl()`~~ | 2 | 100% | ✅ DONE |
| 3.9 | Controller middleware | 5 | 90% | LOW |
| 3.10 | "In use" check | 2 | 90% | LOW |

---

## 4. Vấn đề kiến trúc

### 4.1 CRITICAL — Auditable trait phụ thuộc PMC module — ✅ DONE

**File:** `app/Common/Traits/Auditable.php`

~~`use App\Modules\PMC\Account\Models\Account;` — Common → Module dependency~~

**Fixed:** Thay `Account::class` bằng `config('auth.providers.users.model')` trong `creator()`, `updater()`, `deleter()`.

---

### 4.2 HIGH — AuthService thiếu transaction — ✅ DONE

**File:** `Account/Services/AuthService.php`

**Fixed:** `AuthService extends BaseService`, `register()` wrapped trong `executeInTransaction()`.

---

### 4.3 HIGH — DefaultRoleService thiếu transaction — ✅ DONE

**File:** `Account/Services/DefaultRoleService.php`

**Fixed:** `DefaultRoleService extends BaseService`, 7 write methods wrapped trong `executeInTransaction()`: `createForPair()`, `createRolesForDepartment()`, `createRolesForJobTitle()`, `syncDepartmentName()`, `syncJobTitleName()`, `softDeleteByDepartment()`, `softDeleteByJobTitle()`.

---

### 4.4 HIGH — Không có ExternalService pattern

Các submodule import trực tiếp model/contract của nhau:

| From | Imports | What |
|------|---------|------|
| `DepartmentService` | `Account\Contracts` | `DefaultRoleServiceInterface` |
| `JobTitleService` | `Account\Models` | `Account::where('job_title_id', ...)` |
| `JobTitleService` | `Account\Contracts` | `DefaultRoleServiceInterface` |
| `DefaultRoleService` | `Department\Models` | `Department` |
| `DefaultRoleService` | `JobTitle\Models` | `JobTitle` |
| `RoleService` | `Account\Models` | `Account::where('role_id', ...)` |

Hiện tại chấp nhận được vì cùng module PMC, nhưng khi tách module sẽ cần ExternalService pattern.

---

### 4.5 MEDIUM — BaseModel.scopeActive() là dead code — ✅ DONE

**File:** `app/Common/Models/BaseModel.php`

**Fixed:** Xóa `scopeActive()` khỏi BaseModel. `Account` và `Role` vẫn giữ override riêng với `is_active` boolean.

---

### 4.6 MEDIUM — PermissionController bypass service/repository

**File:** `Account/Controllers/PermissionController.php`

```php
$permissions = Permission::query()->orderBy('sub_module')->orderBy('action')->get();
```

Query model trực tiếp, không qua service hay repository — khác pattern của mọi controller khác.

---

### 4.7 LOW — BasePresenter + PresenterInterface là dead code — ✅ DONE

**Fixed:** Xóa `BasePresenter.php`, `PresenterInterface.php`, và directory `Common/Presenters/`.

---

## 5. Thiếu nhất quán

### 5.1 Route prefix — ✅ DONE

- [x] Chuyển `api/v1/accounts` → `api/v1/pmc/accounts` (`PMCServiceProvider`)
- [x] Update `AccountTest.php` baseUrl → `/api/v1/pmc/accounts`
- [x] Update `ApiDocumentationTest.php` paths → `/pmc/accounts`
- [x] Update frontend `useAccounts.ts` API URLs → `/pmc/accounts/...`
- [x] Regenerate `api.json` + `laravel.ts` types

---

### 5.2 Response format — `destroy()` thiếu `success: true` — ✅ DONE

- [x] `AccountController::destroy()` — thêm `'success' => true`
- [x] `RoleController::destroy()` — thêm `'success' => true`
- [x] `DepartmentController::destroy()` — thêm `'success' => true`
- [x] `JobTitleController::destroy()` — thêm `'success' => true`
- [x] `ProjectController::destroy()` — thêm `'success' => true`
- [x] Update tests assert `success: true` trong delete response (5 test files)

---

### 5.3 Foreign key constraints không nhất quán — ✅ DONE

- [x] `accounts` migration: `unsignedBigInteger()->index()` → `foreignId()->constrained()->restrictOnDelete()` cho `department_id`, `job_title_id`, `role_id`
- [x] Gộp `avatar_path` column vào migration chính (xóa migration phụ `add_avatar_path_to_accounts_table`)

---

### 5.4 Pivot tables timestamps không nhất quán

| Pivot Table | Has `timestamps()`? |
|------------|:-------------------:|
| `permission_role` | ✅ Yes |
| `account_project` | ❌ No |

> Chưa fix — cần đánh giá impact trước khi thêm timestamps vào pivot table đang dùng.

---

### 5.5 Vietnamese strings hardcoded

Tất cả error messages hardcoded trực tiếp trong code:

```php
'Tài khoản đã bị vô hiệu hóa.'     // CheckPermission + AuthService
'Email hoặc mật khẩu không đúng.'    // AuthService
'Phòng ban cha không được là chính nó.' // DepartmentService
'Xoá thành công.'                     // Mọi controller
'Dữ liệu không hợp lệ.'              // BaseFormRequest
```

Không dùng Laravel translation `__()` → không thể hỗ trợ đa ngôn ngữ.

> Chưa fix — chấp nhận tạm vì chỉ phục vụ thị trường VN.

---

### 5.6 Hardcoded values — ✅ DONE (2/3)

- [x] `'auth-token'` → `AuthService::TOKEN_NAME` constant (2 chỗ)
- [x] `'avatars'` → `AccountService::AVATAR_DIRECTORY` constant (service + factory + tests)
- [ ] `7` (days) trong `BaseModel::scopeRecent()` → config parameter

---

### 5.7 HasFactory trait thừa — ✅ DONE

- [x] `Role` — xóa `use HasFactory` (đã có qua `BaseModel`)
- [x] `Department` — xóa `use HasFactory`
- [x] `JobTitle` — xóa `use HasFactory`
- [x] `Project` — xóa `use HasFactory`

---

### 5.8 Duplicate `resolveAvatarUrl()` — ✅ DONE

- [x] Tạo `avatarUrl` accessor trên `Account` model (Eloquent `Attribute`)
- [x] `AccountResource` — xóa `resolveAvatarUrl()`, dùng `$this->avatar_url`
- [x] `AuthResource` — xóa `resolveAvatarUrl()`, dùng `$this->avatar_url`

---

### 5.9 Duplicate auth checks

`CheckPermission` middleware và `AuthService::login()` kiểm tra cùng conditions với cùng error codes:

```php
// Cả 2 nơi đều check:
if (! $user->is_active)      → 'ACCOUNT_INACTIVE'
if (! $user->role->is_active) → 'ROLE_INACTIVE'
```

Khác ở mechanism (middleware return JSON vs service throw exception), nhưng messages/codes duplicate.

> Chưa fix — cả 2 nơi cần check riêng (login vs middleware) nên giữ nguyên.

---

## 6. Testing Gaps

### 6.1 Missing test coverage

| Module | Test File | Status |
|--------|-----------|:------:|
| Auth | `AuthTest.php` | ✅ |
| Account | `AccountTest.php` | ✅ |
| Role | `RoleTest.php` | ✅ |
| Permission | `PermissionTest.php` | ✅ |
| Project | `ProjectTest.php` | ✅ |
| JobTitle | `JobTitleTest.php` | ✅ |
| **Department** | — | ❌ **MISSING** |

Department CRUD, hierarchy, circular reference prevention **chưa được test**.

### 6.2 Test location phân tán

```
app/Modules/PMC/tests/       ← 6 test files
tests/Feature/PMC/           ← 1 test file (RoleTypeTest)
tests/Feature/Common/        ← 1 test file
tests/Unit/                  ← 2 test files
```

Module tests nên nằm ở một nơi thống nhất.

### 6.3 Test boilerplate duplicate

Mọi test file lặp lại:
```php
use RefreshDatabase;
private string $baseUrl = '/api/v1/...';

protected function setUp(): void
{
    parent::setUp();
    $this->actingAsAdmin();
}
```

**Đề xuất:** Tạo `CrudTestCase` base class hoặc shared trait.

---

## 7. Đề xuất Refactor

### Ưu tiên 1 — Giảm CRUD duplicate (Impact: HIGH)

| Action | Giảm duplicate |
|--------|:-------------:|
| Tạo `HasCrudActions` trait cho Controller | 25 methods → 5 |
| Đưa CRUD methods vào `BaseService` | 20+ methods → 5 |
| Tạo `CrudServiceInterface` base | 5 interfaces → 1 base + 5 slim |
| Đưa `list()` pattern vào `BaseRepository` | 5 copies → 1 |
| Tạo `Searchable` trait cho Model | 3-5 copies → 1 |
| Tạo `HasEnumValues` trait cho Enum | 5 copies → 1 |
| Tạo `BaseListRequest` cho common rules | 5 copies → 1 |

### Ưu tiên 2 — Fix kiến trúc (Impact: HIGH)

| Action | Severity | Status |
|--------|:--------:|:------:|
| Fix `Auditable` trait — remove PMC dependency | CRITICAL | ✅ |
| `AuthService` extend `BaseService` + transaction | HIGH | ✅ |
| `DefaultRoleService` extend `BaseService` + transaction | HIGH | ✅ |
| `AuthResource` extend `BaseResource` | MEDIUM | — |
| Xóa `BasePresenter` + `PresenterInterface` (dead code) | LOW | ✅ |
| Fix `BaseModel.scopeActive()` hoặc xóa | MEDIUM | ✅ |

### Ưu tiên 3 — Nhất quán (Impact: MEDIUM)

| Action | Status |
|--------|:------:|
| Thống nhất route prefix `pmc/accounts` | ✅ |
| Thêm `success: true` vào `destroy()` response | ✅ |
| Thêm FK constraints cho `accounts` table | ✅ |
| Extract `resolveAvatarUrl()` thành model accessor | ✅ |
| Chuyển hardcoded strings sang constants/config | ✅ (2/3) |
| Xóa `HasFactory` thừa ở 4 models | ✅ |
| Pivot table timestamps nhất quán | — |
| Vietnamese strings → translation | — |

### Ưu tiên 4 — Testing (Impact: MEDIUM)

| Action |
|--------|
| Viết `DepartmentTest` — CRUD + hierarchy + circular ref |
| Tạo `CrudTestCase` base class |
| Thống nhất test location |

---

## Appendix — Danh sách files cần thay đổi

### Cần tạo mới

| File | Mục đích |
|------|---------|
| `Common/Traits/Searchable.php` | Generic search scope |
| `Common/Traits/HasEnumValues.php` | Shared enum `values()` |
| `Common/Traits/HasCrudActions.php` | Generic CRUD controller actions |
| `Common/Requests/BaseListRequest.php` | Common list/pagination rules |
| `Common/Contracts/CrudServiceInterface.php` | Base CRUD interface |
| `PMC/tests/DepartmentTest.php` | Department test coverage |

### Cần sửa

| File | Thay đổi | Status |
|------|---------|:------:|
| `Common/Traits/Auditable.php` | Remove PMC Account import | ✅ |
| `Common/Models/BaseModel.php` | Fix/remove `scopeActive()` | ✅ |
| `Common/Services/BaseService.php` | Add generic CRUD methods | |
| `Common/Repositories/BaseRepository.php` | Add `list()` with hook | |
| `Account/Services/AuthService.php` | Extend BaseService + hardcoded → constant | ✅ constant |
| `Account/Services/AccountService.php` | Hardcoded `'avatars'` → constant | ✅ |
| `Account/Services/DefaultRoleService.php` | Extend BaseService | ✅ |
| `Account/Resources/AuthResource.php` | Xóa `resolveAvatarUrl()`, dùng model accessor | ✅ |
| `Account/Resources/AccountResource.php` | Xóa `resolveAvatarUrl()`, dùng model accessor | ✅ |
| `Account/Models/Account.php` | Thêm `avatarUrl` accessor | ✅ |
| `PMC/Providers/PMCServiceProvider.php` | Route prefix `pmc/accounts` | ✅ |
| `accounts` migration | FK constraints + gộp `avatar_path` | ✅ |
| 5 Controllers | `destroy()` thêm `success: true` | ✅ |
| 4 Models (`Role`, `Department`, `JobTitle`, `Project`) | Xóa `HasFactory` thừa | ✅ |
| 5 Controllers | Extract CRUD to trait | |
| 5 Service Interfaces | Extend base interface | |
| 5 List FormRequests | Extend BaseListRequest | |
| 3-5 Models | Use Searchable trait | |
| 5 Enums | Use HasEnumValues trait | |

### Cần xóa

| File | Lý do |
|------|-------|
| `Common/Presenters/BasePresenter.php` | Dead code — không ai implement |
| `Common/Contracts/PresenterInterface.php` | Dead code — không ai implement |
