# Phòng ban (Department) - Spec kỹ thuật

> Module: `HRM/Department` | Ngày tạo: 2026-02-26 | Trạng thái: Draft

## 1. Tổng quan

Quản lý cấu trúc phòng ban trong tổ chức. Hỗ trợ quan hệ cha–con (self-referential) để tạo cấu trúc phân cấp nhiều tầng: Phòng → Tổ → Nhóm.

Mỗi tài khoản (user) thuộc **một** phòng ban. Phòng ban là danh mục cơ bản được tham chiếu bởi module Account.

## 2. Entities

### 2.1 Department

**Bảng:** `departments`

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| Mã | `code` | `string(50)` | required, unique | Mã phòng ban (VD: HC, KT) |
| Tên | `name` | `string(255)` | required | Tên phòng ban |
| Phòng ban cha | `parent_id` | `unsignedBigInteger` | nullable, FK self | null = phòng gốc |
| Mô tả | `description` | `text` | nullable | |
| Người tạo | `created_by` | `unsignedBigInteger` | nullable | Auditable |
| Người cập nhật | `updated_by` | `unsignedBigInteger` | nullable | Auditable |
| Timestamps | `created_at`, `updated_at` | `timestamp` | auto | |

**Indexes:**
- `unique('code')`
- `index('parent_id')`

**Relationships:**
- `parent()` → `belongsTo(Department::class, 'parent_id')` — phòng ban cha
- `children()` → `hasMany(Department::class, 'parent_id')` — các phòng ban con

**Scopes:**
- `scopeSearch(Builder $query, string $keyword)` — tìm theo `name` hoặc `code`
- `scopeByParent(Builder $query, ?int $parentId)` — lọc theo phòng cha (null = phòng gốc)
- `scopeRoots(Builder $query)` — chỉ lấy phòng gốc (`parent_id IS NULL`)

## 3. Enums

Không có enum cho entity này.

## 4. API Endpoints

| Action | Method | URL | Request Class | Mô tả |
|--------|--------|-----|---------------|-------|
| List | GET | `/api/v1/hrm/departments` | `ListDepartmentRequest` | Danh sách + filter + pagination |
| Show | GET | `/api/v1/hrm/departments/{id}` | — | Chi tiết phòng ban |
| Create | POST | `/api/v1/hrm/departments` | `CreateDepartmentRequest` | Thêm phòng ban |
| Update | PUT | `/api/v1/hrm/departments/{id}` | `UpdateDepartmentRequest` | Sửa phòng ban |
| Delete | DELETE | `/api/v1/hrm/departments/{id}` | — | Xóa phòng ban |

## 5. Validation Rules

### 5.1 CreateDepartmentRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `code` | `['required', 'string', 'max:50', 'unique:departments,code']` | Mã phòng ban là bắt buộc / Mã đã tồn tại |
| `name` | `['required', 'string', 'max:255']` | Tên phòng ban là bắt buộc |
| `parent_id` | `['nullable', 'integer', 'exists:departments,id']` | Phòng ban cha không tồn tại |
| `description` | `['nullable', 'string', 'max:1000']` | |

### 5.2 UpdateDepartmentRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `name` | `['required', 'string', 'max:255']` | Tên phòng ban là bắt buộc |
| `parent_id` | `['nullable', 'integer', 'exists:departments,id']` | Phòng ban cha không tồn tại |
| `description` | `['nullable', 'string', 'max:1000']` | |

> **Lưu ý:** `code` không cho sửa. `parent_id` không được bằng chính ID của bản ghi hoặc ID con cháu (validate trong Service).

### 5.3 ListDepartmentRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `search` | `['nullable', 'string', 'max:255']` | Tìm theo tên hoặc mã |
| `parent_id` | `['nullable', 'integer']` | Lọc theo phòng cha (0 = phòng gốc) |
| `sort_by` | `['nullable', 'string', 'in:name,code,created_at']` | |
| `sort_direction` | `['nullable', 'string', 'in:asc,desc']` | |
| `per_page` | `['nullable', 'integer', 'min:1', 'max:100']` | |

## 6. Business Rules

- [ ] Mã phòng ban (`code`) là unique, không cho sửa sau khi tạo
- [ ] Phòng ban có thể có parent (tạo cấu trúc phân cấp nhiều tầng)
- [ ] Khi chọn phòng cha (update): không được chọn chính nó hoặc con cháu của nó (tránh vòng lặp) — validate trong Service layer
- [ ] Khi xóa phòng ban: các phòng con sẽ chuyển thành phòng gốc (`parent_id = null`)
- [ ] Không xóa phòng ban nếu còn tài khoản đang thuộc phòng ban đó (soft constraint — kiểm tra trong Service, throw BusinessException)

## 7. Resource Output

```json
{
  "id": 1,
  "code": "KT",
  "name": "Phòng Kỹ thuật",
  "parent_id": null,
  "parent": {
    "id": 1,
    "name": "Phòng gốc"
  },
  "description": "Kỹ thuật vận hành",
  "created_by": 1,
  "updated_by": 1
}
```

> `parent` chỉ include khi `parent_id` không null. Dùng `whenLoaded('parent')`.

## 8. Cross-Module Dependencies (ExternalService)

Không có cross-module dependency. Department thuộc module HRM nội bộ.

> Các module khác muốn tham chiếu Department cần tạo `DepartmentExternalServiceInterface` trong module của mình.

## 9. Migration Preview

```php
Schema::create('departments', function (Blueprint $table) {
    $table->id();
    $table->string('code', 50)->unique();
    $table->string('name', 255);
    $table->foreignId('parent_id')->nullable()->constrained('departments')->nullOnDelete();
    $table->text('description')->nullable();
    $table->unsignedBigInteger('created_by')->nullable();
    $table->unsignedBigInteger('updated_by')->nullable();
    $table->timestamps();
});
```

## 10. Checklist triển khai

- [ ] Migration `create_departments_table`
- [ ] Model `Department` (extends BaseModel, use Auditable, HasFactory)
- [ ] Repository `DepartmentRepository` + `DepartmentRepositoryInterface`
- [ ] Service `DepartmentService` + `DepartmentServiceInterface`
- [ ] Resource `DepartmentResource` (extends BaseResource)
- [ ] Requests: `CreateDepartmentRequest`, `UpdateDepartmentRequest`, `ListDepartmentRequest`
- [ ] Controller `DepartmentController`
- [ ] Factory `DepartmentFactory`
- [ ] Seeder `DepartmentSeeder`
- [ ] Route registration trong `HRMServiceProvider`
- [ ] PSR-4 mappings trong `composer.json`
- [ ] Tests: CRUD + hierarchy + delete protection
