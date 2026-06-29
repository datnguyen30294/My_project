# Quản lý Chức danh (Job Title) - Đặc tả kỹ thuật Backend

> Module: `PMC/JobTitle` | Ngày tạo: 2026-02-27 | Trạng thái: Draft

## 1. Tổng quan

Quản lý danh mục chức danh (job title). Chức danh là catalog độc lập gồm mã, tên, mô tả. Mỗi tài khoản nhân viên chỉ có một chức danh. Khi xóa chức danh phải kiểm tra ràng buộc: không cho xóa nếu còn tài khoản đang dùng.

## 2. Entities

### 2.1 JobTitle

**Bảng:** `job_titles`

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| Mã | `code` | `string(50)` | required, unique | Mã chức danh (VD: TP, NV, KS) |
| Tên | `name` | `string(255)` | required | Tên chức danh |
| Mô tả | `description` | `text` | nullable | Mô tả chức danh |
| Người tạo | `created_by` | `unsignedBigInteger` | nullable | Auditable |
| Người cập nhật | `updated_by` | `unsignedBigInteger` | nullable | Auditable |
| Người xóa | `deleted_by` | `unsignedBigInteger` | nullable | Auditable |
| Ngày xóa | `deleted_at` | `timestamp` | nullable | SoftDeletes |

**Indexes:**
- `unique('code')`
- `index('name')`

**Relationships:**
- Không có quan hệ trực tiếp trong module. Tài khoản tham chiếu chức danh qua `users.job_title_id` (FK một chiều từ HRM Account).

## 3. Enums

Không có enum. Chức danh là catalog đơn giản, không có trạng thái.

## 4. API Endpoints

| Action | Method | URL | Request Class | Mô tả |
|--------|--------|-----|---------------|-------|
| List | GET | `/api/v1/pmc/job-titles` | `ListJobTitleRequest` | Danh sách + tìm kiếm + phân trang |
| Show | GET | `/api/v1/pmc/job-titles/{id}` | — | Chi tiết chức danh |
| Create | POST | `/api/v1/pmc/job-titles` | `CreateJobTitleRequest` | Thêm chức danh mới |
| Update | PUT | `/api/v1/pmc/job-titles/{id}` | `UpdateJobTitleRequest` | Sửa chức danh (không cho sửa code) |
| Delete | DELETE | `/api/v1/pmc/job-titles/{id}` | — | Xóa chức danh (kiểm tra ràng buộc tài khoản) |

## 5. Validation Rules

### 5.1 CreateJobTitleRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `code` | `['required', 'string', 'max:50', 'unique:job_titles,code']` | Mã chức danh là bắt buộc / Mã đã tồn tại |
| `name` | `['required', 'string', 'max:255']` | Tên chức danh là bắt buộc |
| `description` | `['nullable', 'string', 'max:1000']` | |

### 5.2 UpdateJobTitleRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `name` | `['sometimes', 'required', 'string', 'max:255']` | Tên chức danh là bắt buộc |
| `description` | `['nullable', 'string', 'max:1000']` | |

> **Lưu ý:** `code` không được phép sửa. Request chỉ nhận `name` và `description`.

### 5.3 ListJobTitleRequest

| Field | Rules | Mô tả |
|-------|-------|-------|
| `search` | `['nullable', 'string', 'max:255']` | Tìm theo `name` hoặc `code` |
| `sort_by` | `['nullable', 'string', 'in:name,code,created_at']` | Trường sắp xếp |
| `sort_direction` | `['nullable', 'string', 'in:asc,desc']` | Hướng sắp xếp |
| `per_page` | `['nullable', 'integer', 'min:1', 'max:100']` | Số bản ghi mỗi trang |

## 6. Business Rules

- [ ] Mã chức danh (`code`) phải unique, không được sửa sau khi tạo
- [ ] Khi xóa: kiểm tra xem có tài khoản nào đang dùng chức danh này không (query `users.job_title_id = id`)
- [ ] Nếu còn tài khoản đang dùng → trả về lỗi `422` với message và số lượng tài khoản
- [ ] Nếu không tồn tại → 404

## 7. Presenter Output

### 7.1 JobTitleResource

```json
{
  "id": 1,
  "code": "TP",
  "name": "Trưởng phòng",
  "description": "Trưởng phòng ban",
  "created_by": null,
  "updated_by": null
}
```

> Không có enum field nên không có `{ value, label }`. Không trả về `created_at` / `updated_at` trừ khi FE yêu cầu.

## 8. Cross-Module Dependencies (ExternalService)

| Dependency | Module nguồn | Ghi chú |
|-----------|-------------|---------|
| `User` (Account) | Auth / HRM | Tài khoản có `job_title_id` trỏ vào `job_titles.id`. Khi xóa job title, service gọi trực tiếp `User::where('job_title_id', $id)->count()` để kiểm tra ràng buộc — không cần ExternalService riêng vì chỉ đọc count. |

> Không có cross-module FK từ bảng `job_titles`. Chiều ngược lại: `users.job_title_id` (unsignedBigInteger, nullable, no FK) — khai báo trong migration của HRM Account.

## 9. Migration Preview

```php
// Migration: Tạo bảng job_titles
Schema::create('job_titles', function (Blueprint $table) {
    $table->id();
    $table->string('code', 50)->unique();
    $table->string('name', 255);
    $table->text('description')->nullable();
    $table->unsignedBigInteger('created_by')->nullable();
    $table->unsignedBigInteger('updated_by')->nullable();
    $table->unsignedBigInteger('deleted_by')->nullable();
    $table->timestamps();
    $table->softDeletes();
    $table->index('name');
});
```

## 10. Checklist triển khai BE

- [ ] Migration `create_job_titles_table`
- [ ] Model `JobTitle` (extends BaseModel, use Auditable, HasFactory)
- [ ] Repository `JobTitleRepository` (search theo name, code)
- [ ] ServiceInterface `JobTitleServiceInterface`
- [ ] Service `JobTitleService` (delete phải kiểm tra ràng buộc tài khoản)
- [ ] Resource `JobTitleResource` (extends BaseResource)
- [ ] Requests: `CreateJobTitleRequest`, `UpdateJobTitleRequest`, `ListJobTitleRequest`
- [ ] Controller `JobTitleController` với `@tags Job Titles`
- [ ] Bind `JobTitleServiceInterface` trong `PMCServiceProvider`
- [ ] Route `job-titles` trong `PMC/routes/api.php`
- [ ] Factory `JobTitleFactory`
- [ ] Seeder `JobTitleSeeder` (TP, PP, NV, KS) + đăng ký trong `PMCDatabaseSeeder`
- [ ] PSR-4 + `composer dump-autoload`
- [ ] Tests: CRUD + delete bị chặn khi còn tài khoản dùng + 404
- [ ] `vendor/bin/pint --dirty` passes
- [ ] `php artisan scramble:export` passes
