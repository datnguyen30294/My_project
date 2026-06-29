# Tài khoản (Account) - Đặc tả kỹ thuật Backend

> Module: `Account` | Ngày tạo: 2026-02-27 | Trạng thái: Draft

## 1. Tổng quan

Đổi tên `User` → `Account`, bảng `users` → `accounts`. Đổi module `Auth` → module `Account`. Model `Account` nằm trong module Account (`app/Modules/Account/src/Models/Account.php`), xóa `app/Models/User.php`.

Module Account xử lý cả authentication (login, register, logout, refresh) lẫn quản lý tài khoản CRUD.

Mỗi tài khoản:
- Thuộc **một** phòng ban (Department — PMC module)
- Có **một** chức danh (JobTitle — PMC module)
- Có **một** role (bảng `roles` — cần tạo)
- Có thể thuộc **0, 1 hoặc nhiều** dự án (Project — PMC module) — quan hệ nhiều–nhiều qua pivot `account_project`

### Quyết định thiết kế

- **Rename hoàn toàn:** `User` → `Account`, bảng `users` → `accounts`
- **Model trong module:** `App\Modules\Account\Models\Account` (không dùng `app/Models/`)
- **Merge Auth + Account CRUD:** module `Account` chứa cả hai, thay vì tách riêng
- **Dùng `name`:** không cần `full_name` — field `name` có sẵn đủ dùng
- **NOT NULL:** `department_id`, `job_title_id`, `role_id` đều NOT NULL

## 2. Cấu trúc module

```
app/Modules/Account/
├── database/
│   ├── migrations/
│   ├── factories/
│   └── seeders/
├── Providers/
│   └── AccountServiceProvider.php
├── routes/
│   └── api.php
├── tests/
│   ├── AuthTest.php
│   └── AccountTest.php
└── src/
    ├── Models/
    │   └── Account.php
    ├── Enums/
    │   └── Gender.php
    ├── Contracts/
    │   ├── AuthServiceInterface.php
    │   ├── AccountServiceInterface.php
    │   └── AccountRepositoryInterface.php
    ├── Services/
    │   ├── AuthService.php
    │   └── AccountService.php
    ├── Repositories/
    │   └── AccountRepository.php
    ├── Controllers/
    │   ├── AuthController.php
    │   └── AccountController.php
    ├── Requests/
    │   ├── LoginRequest.php
    │   ├── RegisterRequest.php
    │   ├── CreateAccountRequest.php
    │   ├── UpdateAccountRequest.php
    │   ├── ListAccountRequest.php
    │   └── ChangePasswordRequest.php
    └── Resources/
        └── AccountResource.php
```

## 3. Phạm vi thay đổi (Refactoring)

### Xóa / Rename

| Hành động | File cũ | File mới |
|-----------|---------|----------|
| **Xóa** | `app/Models/User.php` | — |
| **Xóa** | `database/factories/UserFactory.php` | — |
| **Xóa toàn bộ** | `app/Modules/Auth/` | — |
| **Tạo mới** | — | `app/Modules/Account/` (toàn bộ cấu trúc) |

### Cập nhật references

| File | Thay đổi |
|------|----------|
| `config/auth.php` | `model` → `App\Modules\Account\Models\Account::class` |
| `app/Common/Traits/Auditable.php` | `App\Models\User` → `App\Modules\Account\Models\Account` |
| `app/Providers/TelescopeServiceProvider.php` | `User` → `Account` |
| `database/seeders/DatabaseSeeder.php` | `User::` → `Account::` |
| `tests/TestCase.php` | `User::` → `Account::` |
| `bootstrap/providers.php` | `AuthServiceProvider` → `AccountServiceProvider` |
| `PMC/src/Project/Models/Project.php` | `User::class` → `Account::class` |
| `PMC/src/JobTitle/Services/JobTitleService.php` | `User::where` → `Account::where` |
| PMC migrations | Cập nhật FK constraints `users` → `accounts` |
| Tất cả PMC tests | `User::factory()` → `Account::factory()`, `'users'` → `'accounts'` |

## 4. Entities

### 4.1 Account

**Bảng:** `accounts` (rename từ `users`)

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| Tên | `name` | `string(255)` | required | Họ tên (dùng cho cả auth lẫn HRM) |
| Email | `email` | `string(255)` | required, unique | Đăng nhập |
| Password | `password` | `string` | required | Hashed |
| Mã nhân viên | `employee_code` | `string(50)` | nullable, unique | VD: NV001. nullable vì admin seed chưa có |
| Giới tính | `gender` | `string(10)` | nullable | Enum Gender |
| Phòng ban | `department_id` | `unsignedBigInteger` | **NOT NULL**, FK → departments.id | Thuộc 1 phòng ban |
| Chức danh | `job_title_id` | `unsignedBigInteger` | **NOT NULL**, FK → job_titles.id | Có 1 chức danh |
| Role | `role_id` | `unsignedBigInteger` | **NOT NULL**, FK → roles.id | Có 1 role |
| Trạng thái | `is_active` | `boolean` | default: true | Hoạt động / Tắt |
| Email verified | `email_verified_at` | `timestamp` | nullable | |
| Remember token | `remember_token` | `string` | nullable | |
| Người tạo | `created_by` | `unsignedBigInteger` | nullable | Auditable |
| Người cập nhật | `updated_by` | `unsignedBigInteger` | nullable | Auditable |
| Timestamps | `created_at`, `updated_at` | `timestamp` | auto | |

> `department_id`, `job_title_id`, `role_id` là NOT NULL. Khi migrate cần đảm bảo tất cả accounts hiện tại đã có giá trị (hoặc fresh migrate).

**Indexes:**
- `unique('email')`
- `unique('employee_code')` — where not null
- `index('department_id')`
- `index('job_title_id')`
- `index('role_id')`
- `index('is_active')`

**Relationships:**
- `department()` → `belongsTo(Department::class)`
- `jobTitle()` → `belongsTo(JobTitle::class)`
- `role()` → `belongsTo(Role::class)`
- `projects()` → `belongsToMany(Project::class, 'account_project', 'account_id', 'project_id')`

**Scopes:**
- `scopeSearch(Builder $query, string $keyword)` — tìm theo `name`, `email`, `employee_code`
- `scopeByDepartment(Builder $query, int $departmentId)` — lọc theo phòng ban
- `scopeByJobTitle(Builder $query, int $jobTitleId)` — lọc theo chức danh
- `scopeByProject(Builder $query, int $projectId)` — lọc theo dự án (whereHas)
- `scopeActive(Builder $query)` — chỉ lấy account active

### 4.2 AccountProject (Pivot — đã tồn tại)

**Bảng:** `account_project`

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| Account | `account_id` | `foreignId` | FK → accounts.id, onDelete cascade | |
| Project | `project_id` | `foreignId` | FK → projects.id, onDelete cascade | |

> Migration hiện tại: `constrained('users')` → cập nhật thành `constrained('accounts')`.

## 5. Enums

### 5.1 Gender

| Key | Value | Label (VI) |
|-----|-------|------------|
| Male | `male` | Nam |
| Female | `female` | Nữ |
| Other | `other` | Khác |

```php
// app/Modules/Account/src/Enums/Gender.php
enum Gender: string
{
    case Male = 'male';
    case Female = 'female';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::Male => 'Nam',
            self::Female => 'Nữ',
            self::Other => 'Khác',
        };
    }

    /** @return array<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
```

## 6. API Endpoints

### 6.1 Auth (giữ nguyên URL prefix `/api/v1/auth`)

| Action | Method | URL | Request Class |
|--------|--------|-----|---------------|
| Login | POST | `/api/v1/auth/login` | `LoginRequest` |
| Register | POST | `/api/v1/auth/register` | `RegisterRequest` |
| Me | GET | `/api/v1/auth/me` | — |
| Logout | POST | `/api/v1/auth/logout` | — |
| Refresh | POST | `/api/v1/auth/refresh` | — |

### 6.2 Account CRUD (mới — prefix `/api/v1/accounts`)

| Action | Method | URL | Request Class |
|--------|--------|-----|---------------|
| List | GET | `/api/v1/accounts` | `ListAccountRequest` |
| Show | GET | `/api/v1/accounts/{id}` | — |
| Create | POST | `/api/v1/accounts` | `CreateAccountRequest` |
| Update | PUT | `/api/v1/accounts/{id}` | `UpdateAccountRequest` |
| Delete | DELETE | `/api/v1/accounts/{id}` | — |
| Change Password | PUT | `/api/v1/accounts/{id}/password` | `ChangePasswordRequest` |

## 7. Validation Rules

### 7.1 CreateAccountRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `email` | `['required', 'string', 'email', 'max:255', 'unique:accounts,email']` | Email là bắt buộc / Email đã tồn tại |
| `name` | `['required', 'string', 'max:255']` | Họ tên là bắt buộc |
| `employee_code` | `['required', 'string', 'max:50', 'unique:accounts,employee_code']` | Mã NV là bắt buộc / Mã đã tồn tại |
| `gender` | `['nullable', 'string', Rule::in(Gender::values())]` | Giới tính không hợp lệ |
| `department_id` | `['required', 'integer', 'exists:departments,id']` | Phòng ban là bắt buộc / không tồn tại |
| `job_title_id` | `['required', 'integer', 'exists:job_titles,id']` | Chức danh là bắt buộc / không tồn tại |
| `role_id` | `['required', 'integer', 'exists:roles,id']` | Role là bắt buộc / không tồn tại |
| `project_ids` | `['nullable', 'array']` | |
| `project_ids.*` | `['integer', 'exists:projects,id']` | Dự án không tồn tại |
| `is_active` | `['nullable', 'boolean']` | |
| `password` | `['nullable', 'string', 'min:8']` | Mật khẩu tối thiểu 8 ký tự |

### 7.2 UpdateAccountRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `name` | `['required', 'string', 'max:255']` | Họ tên là bắt buộc |
| `gender` | `['nullable', 'string', Rule::in(Gender::values())]` | Giới tính không hợp lệ |
| `department_id` | `['required', 'integer', 'exists:departments,id']` | Phòng ban là bắt buộc / không tồn tại |
| `job_title_id` | `['required', 'integer', 'exists:job_titles,id']` | Chức danh là bắt buộc / không tồn tại |
| `role_id` | `['required', 'integer', 'exists:roles,id']` | Role là bắt buộc / không tồn tại |
| `project_ids` | `['nullable', 'array']` | |
| `project_ids.*` | `['integer', 'exists:projects,id']` | Dự án không tồn tại |
| `is_active` | `['nullable', 'boolean']` | |

> **Lưu ý:** `email` và `employee_code` không cho sửa.

### 7.3 ChangePasswordRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `password` | `['required', 'string', 'min:8', 'confirmed']` | Mật khẩu là bắt buộc / Tối thiểu 8 ký tự |
| `password_confirmation` | `['required', 'string']` | Xác nhận mật khẩu là bắt buộc |

### 7.4 ListAccountRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `search` | `['nullable', 'string', 'max:255']` | Tìm theo tên, email, mã NV |
| `department_id` | `['nullable', 'integer', 'exists:departments,id']` | Lọc theo phòng ban |
| `job_title_id` | `['nullable', 'integer', 'exists:job_titles,id']` | Lọc theo chức danh |
| `role_id` | `['nullable', 'integer', 'exists:roles,id']` | Lọc theo role |
| `project_id` | `['nullable', 'integer', 'exists:projects,id']` | Lọc theo dự án |
| `is_active` | `['nullable', 'boolean']` | Lọc theo trạng thái |
| `sort_by` | `['nullable', 'string', 'in:name,email,employee_code,created_at']` | |
| `sort_direction` | `['nullable', 'string', 'in:asc,desc']` | |
| `per_page` | `['nullable', 'integer', 'min:1', 'max:100']` | |

### 7.5 RegisterRequest (Auth)

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `name` | `['required', 'string', 'max:255']` | Tên là bắt buộc |
| `email` | `['required', 'string', 'email', 'max:255', 'unique:accounts,email']` | Email đã tồn tại |
| `password` | `['required', 'string', 'min:8', 'confirmed']` | Mật khẩu tối thiểu 8 ký tự |

## 8. Business Rules

- [ ] Email là unique trong bảng `accounts`, không cho sửa sau khi tạo
- [ ] Mã nhân viên (`employee_code`) là unique, không cho sửa sau khi tạo
- [ ] `department_id`, `job_title_id`, `role_id` bắt buộc (NOT NULL)
- [ ] Mật khẩu có thể để trống lúc tạo qua Account CRUD, đổi sau qua Change Password
- [ ] Khi tạo/sửa: sync danh sách `project_ids` vào pivot `account_project` (dùng `sync()`)
- [ ] Khi xóa tài khoản: cascade xóa pivot `account_project` (DB onDelete cascade)
- [ ] Password hash qua casts `'password' => 'hashed'`

## 9. Resource Output

### 9.1 AccountResource (CRUD — List/Show)

```json
{
  "id": 1,
  "name": "Nguyễn Văn A",
  "email": "nguyen.a@example.com",
  "employee_code": "NV001",
  "gender": {
    "value": "male",
    "label": "Nam"
  },
  "department": {
    "id": 1,
    "name": "Phòng Hành chính"
  },
  "job_title": {
    "id": 1,
    "name": "Trưởng phòng"
  },
  "role": {
    "id": 1,
    "name": "Admin"
  },
  "is_active": true,
  "projects": [
    { "id": 1, "name": "Dự án Chung cư A" }
  ]
}
```

### 9.2 AccountResource (Auth — Login/Me/Register)

```json
{
  "id": 1,
  "name": "Nguyễn Văn A",
  "email": "nguyen.a@example.com"
}
```

> Dùng chung `AccountResource` với parameter hoặc tạo riêng `AuthResource` đơn giản.

## 10. Cross-Module Dependencies

| Dependency | Module nguồn | Mô tả |
|-----------|-------------|-------|
| Department | PMC/Department | FK `department_id` → `departments.id` (NOT NULL) |
| JobTitle | PMC/JobTitle | FK `job_title_id` → `job_titles.id` (NOT NULL) |
| Role | **Cần tạo** | FK `role_id` → `roles.id` (NOT NULL). Bảng `roles` chưa tồn tại — cần tạo trước khi migrate Account. |
| Project | PMC/Project | Pivot `account_project` |

> PMC module reference ngược Account: `Project→accounts()`, `JobTitleService` check account count → cập nhật `User::class` → `Account::class`.

## 11. Migration Strategy

### Prerequisite

Bảng `roles` phải tồn tại trước khi chạy migration Account. Cần tạo migration `create_roles_table` (trong module tương ứng) trước.

### Migration: tạo mới bảng `accounts`

Xóa migration `create_users_table` cũ, thay bằng `create_accounts_table` (cùng timestamp `0001_01_01_000000`).

```php
// 0001_01_01_000000_create_accounts_table.php
Schema::create('accounts', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->string('employee_code', 50)->nullable()->unique();
    $table->string('gender', 10)->nullable();
    $table->foreignId('department_id')->constrained('departments');
    $table->foreignId('job_title_id')->constrained('job_titles');
    $table->foreignId('role_id')->constrained('roles');
    $table->boolean('is_active')->default(true);
    $table->timestamp('email_verified_at')->nullable();
    $table->string('password');
    $table->rememberToken();
    $table->unsignedBigInteger('created_by')->nullable();
    $table->unsignedBigInteger('updated_by')->nullable();
    $table->timestamps();

    $table->index('is_active');
});
```

> **Lưu ý:** Migration này có FK tới `departments`, `job_titles`, `roles` — các bảng đó phải được tạo trước. Cần đảm bảo thứ tự migration đúng (PMC migrations chạy trước `0001_01_01_000000`).

### Migration: cập nhật account_project FK

```php
// update_account_project_foreign_key_to_accounts
// Drop FK cũ (constrained to 'users'), tạo FK mới (constrained to 'accounts')
```

## 12. Checklist triển khai BE

### Phase 1: Chuẩn bị

- [ ] Tạo bảng `roles` (prerequisite — module/location TBD)
- [ ] Tạo migration: rename `users` → `accounts` + thêm cột mới
- [ ] Tạo migration: cập nhật `account_project` FK
- [ ] Xóa `app/Models/User.php`
- [ ] Xóa `database/factories/UserFactory.php`
- [ ] Xóa toàn bộ `app/Modules/Auth/`

### Phase 2: Tạo module Account

- [ ] `Account/src/Models/Account.php` (extends Authenticatable, HasApiTokens, fillable, casts, relationships, scopes)
- [ ] `Account/src/Enums/Gender.php`
- [ ] `Account/database/factories/AccountFactory.php`
- [ ] `Account/database/seeders/AccountSeeder.php`
- [ ] `Account/Providers/AccountServiceProvider.php`
- [ ] PSR-4 mappings trong `composer.json`
- [ ] Register provider trong `bootstrap/providers.php`

### Phase 3: Auth (migrate từ Auth module cũ)

- [ ] `Account/src/Contracts/AuthServiceInterface.php`
- [ ] `Account/src/Services/AuthService.php`
- [ ] `Account/src/Controllers/AuthController.php`
- [ ] `Account/src/Requests/LoginRequest.php`, `RegisterRequest.php`
- [ ] `Account/routes/api.php` (auth routes)
- [ ] `Account/tests/AuthTest.php`

### Phase 4: Account CRUD (mới)

- [ ] `Account/src/Contracts/AccountRepositoryInterface.php`, `AccountServiceInterface.php`
- [ ] `Account/src/Repositories/AccountRepository.php`
- [ ] `Account/src/Services/AccountService.php` (sync projects, change password)
- [ ] `Account/src/Resources/AccountResource.php`
- [ ] `Account/src/Requests/CreateAccountRequest.php`, `UpdateAccountRequest.php`, `ListAccountRequest.php`, `ChangePasswordRequest.php`
- [ ] `Account/src/Controllers/AccountController.php`
- [ ] `Account/routes/api.php` (account CRUD routes)
- [ ] `Account/tests/AccountTest.php`

### Phase 5: Cập nhật references

- [ ] `config/auth.php`: model → `Account::class`
- [ ] `app/Common/Traits/Auditable.php`: `User::class` → `Account::class`
- [ ] `app/Providers/TelescopeServiceProvider.php`
- [ ] `database/seeders/DatabaseSeeder.php`
- [ ] `tests/TestCase.php`
- [ ] PMC module: Project model, JobTitle service, migrations, tests
- [ ] Run pint + tests
