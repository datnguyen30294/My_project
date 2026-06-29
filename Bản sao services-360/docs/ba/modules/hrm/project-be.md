# Quản lý dự án (Project) - Đặc tả kỹ thuật Backend

> Module: `PMC/Project` | Ngày tạo: 2026-02-27 | Trạng thái: Draft

## 1. Tổng quan

Quản lý dự án (khu đô thị). Mỗi dự án có mã, tên, địa chỉ, trạng thái. Quan hệ **nhiều–nhiều** với tài khoản nhân viên (bảng `users`): một nhân viên có thể thuộc nhiều dự án, một dự án có thể có nhiều nhân viên. Quan hệ lưu qua bảng pivot `account_project`.

Gán nhân viên vào dự án thực hiện tại màn **Tài khoản** (chọn nhiều dự án). Màn **Chi tiết dự án** chỉ đọc danh sách nhân viên đã gán.

## 2. Entities

### 2.1 Project

**Bảng:** `projects`

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| Mã | `code` | `string(50)` | required, unique | Mã dự án (VD: DA-CC-A) |
| Tên | `name` | `string(255)` | required | Tên dự án |
| Địa chỉ | `address` | `string(500)` | nullable | Địa chỉ dự án |
| Trạng thái | `status` | `string(20)` | required, default: 'managing' | Enum ProjectStatus |
| Người tạo | `created_by` | `unsignedBigInteger` | nullable | Auditable |
| Người cập nhật | `updated_by` | `unsignedBigInteger` | nullable | Auditable |
| Timestamps | `created_at`, `updated_at` | `timestamp` | auto | |

**Indexes:**
- `unique('code')`
- `index('status')`

**Relationships:**
- `accounts()` → `belongsToMany(User::class, 'account_project', 'project_id', 'account_id')` — nhân viên thuộc dự án

**Scopes:**
- `scopeSearch(Builder $query, string $keyword)` — tìm theo `name` hoặc `code` (LIKE case-insensitive)
- `scopeByStatus(Builder $query, ProjectStatus $status)` — lọc theo trạng thái

---

### 2.2 AccountProject (Pivot)

**Bảng:** `account_project`

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| Tài khoản | `account_id` | `unsignedBigInteger` | required, FK → users.id, cascade delete | |
| Dự án | `project_id` | `unsignedBigInteger` | required, FK → projects.id, cascade delete | |

**Indexes:**
- `unique(['account_id', 'project_id'])` — mỗi cặp chỉ xuất hiện 1 lần
- `index('account_id')`
- `index('project_id')`

> Pivot model đơn giản: extends `Model`, `$timestamps = false`, không cần `Auditable`.
> Cascade delete trên cả hai FK đảm bảo: xóa dự án → xóa pivot, xóa user → xóa pivot.

## 3. Enums

### 3.1 ProjectStatus

| Key | Value | Label (VI) | Mô tả |
|-----|-------|------------|-------|
| `Managing` | `managing` | Đang quản lý | Dự án đang hoạt động (default) |
| `Stopped` | `stopped` | Đã dừng | Dự án đã ngưng quản lý |

```php
enum ProjectStatus: string
{
    case Managing = 'managing';
    case Stopped = 'stopped';

    public function label(): string
    {
        return match ($this) {
            self::Managing => 'Đang quản lý',
            self::Stopped => 'Đã dừng',
        };
    }

    /** @return array<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
```

## 4. API Endpoints

| Action | Method | URL | Request Class | Mô tả |
|--------|--------|-----|---------------|-------|
| List | GET | `/api/v1/hrm/projects` | `ListProjectRequest` | Danh sách + filter + pagination |
| Show | GET | `/api/v1/hrm/projects/{project}` | — | Chi tiết dự án (kèm danh sách nhân viên) |
| Create | POST | `/api/v1/hrm/projects` | `CreateProjectRequest` | Thêm dự án mới |
| Update | PUT | `/api/v1/hrm/projects/{project}` | `UpdateProjectRequest` | Sửa dự án (không cho sửa code) |
| Delete | DELETE | `/api/v1/hrm/projects/{project}` | — | Xóa dự án (cascade xóa pivot) |

## 5. Validation Rules

### 5.1 CreateProjectRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `code` | `['required', 'string', 'max:50', 'unique:projects,code']` | Mã dự án là bắt buộc / Mã đã tồn tại |
| `name` | `['required', 'string', 'max:255']` | Tên dự án là bắt buộc |
| `address` | `['nullable', 'string', 'max:500']` | |
| `status` | `['required', 'string', Rule::in(ProjectStatus::values())]` | Trạng thái không hợp lệ |

### 5.2 UpdateProjectRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `name` | `['required', 'string', 'max:255']` | Tên dự án là bắt buộc |
| `address` | `['nullable', 'string', 'max:500']` | |
| `status` | `['required', 'string', Rule::in(ProjectStatus::values())]` | Trạng thái không hợp lệ |

> **Lưu ý:** `code` không được phép sửa. Request chỉ nhận `name`, `address`, `status`.

### 5.3 ListProjectRequest

| Field | Rules | Mô tả |
|-------|-------|-------|
| `search` | `['nullable', 'string', 'max:255']` | Tìm theo `name` hoặc `code` |
| `status` | `['nullable', 'string', Rule::in(ProjectStatus::values())]` | Lọc theo trạng thái |
| `sort_by` | `['nullable', 'string', 'in:name,code,status,created_at']` | Trường sắp xếp |
| `sort_direction` | `['nullable', 'string', 'in:asc,desc']` | Hướng sắp xếp |
| `per_page` | `['nullable', 'integer', 'min:1', 'max:100']` | Số bản ghi mỗi trang |

## 6. Business Rules

- [ ] Mã dự án (`code`) phải unique, không được sửa sau khi tạo
- [ ] Trạng thái mặc định khi tạo: `managing`
- [ ] Khi xóa dự án: cascade xóa toàn bộ bản ghi pivot `account_project` liên quan (DB onDelete cascade)
- [ ] API Show trả về chi tiết dự án kèm danh sách nhân viên (eager load `accounts` với department và job_title)
- [ ] Nếu dự án không tồn tại → 404
- [ ] Gán nhân viên vào dự án được thực hiện từ module Account, không phải từ module Project

## 7. Presenter Output

### 7.1 ProjectResource (List)

```json
{
  "id": 1,
  "code": "DA-CC-A",
  "name": "Dự án Chung cư A",
  "address": "123 Đường X, Quận 1",
  "status": {
    "value": "managing",
    "label": "Đang quản lý"
  }
}
```

### 7.2 ProjectResource (Show — Chi tiết)

```json
{
  "id": 1,
  "code": "DA-CC-A",
  "name": "Dự án Chung cư A",
  "address": "123 Đường X, Quận 1",
  "status": {
    "value": "managing",
    "label": "Đang quản lý"
  },
  "accounts": [
    {
      "id": 1,
      "employee_code": "NV001",
      "full_name": "Nguyễn Văn A",
      "email": "nguyen.a@example.com",
      "department": {
        "id": 1,
        "name": "Phòng Hành chính"
      },
      "job_title": {
        "id": 1,
        "name": "Trưởng phòng"
      }
    }
  ]
}
```

> `accounts` chỉ xuất hiện trong API Show. Enum fields: `{ "value": "...", "label": "..." }`.

## 8. Cross-Module Dependencies (ExternalService)

| Dependency | Module nguồn | Ghi chú |
|-----------|-------------|---------|
| `User` (Account) | Auth | Pivot `account_project` tham chiếu `users.id`. Account = bảng `users` mở rộng bởi HRM migration |
| `Department` | PMC/Department | Eager load qua `User.department_id` → `departments.id` (dùng trong Project Show response) |
| `JobTitle` | PMC/JobTitle | Eager load qua `User.job_title_id` → `job_titles.id` (dùng trong Project Show response) |

> Department và JobTitle cùng module PMC nên có thể eager load trực tiếp. Account = `users` nên FK trực tiếp là hợp lệ.

## 9. Migration Preview

```php
// Migration 1: Tạo bảng projects
Schema::create('projects', function (Blueprint $table) {
    $table->id();
    $table->string('code', 50)->unique();
    $table->string('name', 255);
    $table->string('address', 500)->nullable();
    $table->string('status', 20)->default('managing');
    $table->unsignedBigInteger('created_by')->nullable();
    $table->unsignedBigInteger('updated_by')->nullable();
    $table->timestamps();
});

// Migration 2: Tạo bảng pivot account_project
Schema::create('account_project', function (Blueprint $table) {
    $table->id();
    $table->foreignId('account_id')->constrained('users')->cascadeOnDelete();
    $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
    $table->unique(['account_id', 'project_id']);
});
```

## 10. Checklist triển khai BE

- [ ] Migration `create_projects_table`
- [ ] Migration `create_account_project_table`
- [ ] Model `Project` (extends BaseModel, use Auditable, HasFactory)
- [ ] Pivot model `AccountProject` (extends Model, `$timestamps = false`)
- [ ] Enum `ProjectStatus`
- [ ] Repository `ProjectRepository` + `ProjectRepositoryInterface`
- [ ] Service `ProjectService` + `ProjectServiceInterface`
- [ ] Resource `ProjectResource` (extends BaseResource, 2 variants: list + show)
- [ ] Requests: `CreateProjectRequest`, `UpdateProjectRequest`, `ListProjectRequest`
- [ ] Controller `ProjectController` (index, show, store, update, destroy)
- [ ] Factory `ProjectFactory`
- [ ] Seeder `ProjectSeeder` (3-5 dự án mẫu)
- [ ] Route registration trong `PMCServiceProvider`
- [ ] PSR-4 mappings trong `composer.json`
- [ ] Tests: CRUD + cascade delete pivot + show with accounts eager load
