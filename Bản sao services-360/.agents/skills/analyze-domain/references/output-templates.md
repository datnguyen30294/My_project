# Output Templates

Use these templates as the default structure. Trim sections that are not relevant, but do not drop core sections silently.

## Backend Spec Template

````markdown
# {Feature Name} - Đặc tả kỹ thuật Backend

> Module: `{Module}/{SubModule}` | Ngày tạo: {date} | Trạng thái: Draft

## 1. Tổng quan

Mô tả ngắn gọn về domain hoặc tính năng.

## 2. Entities

### 2.1 {EntityName}

**Bảng:** `{table_name}`

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ... | ... | ... | ... | ... |
| Người tạo | `created_by` | `unsignedBigInteger` | nullable | Auditable |
| Người cập nhật | `updated_by` | `unsignedBigInteger` | nullable | Auditable |
| Người xóa | `deleted_by` | `unsignedBigInteger` | nullable | Auditable |
| Ngày xóa | `deleted_at` | `timestamp` | nullable | SoftDeletes |

**Indexes / Relationships:** ...

## 3. Enums

### 3.1 {EnumName}

| Key | Value | Label (VI) | Mô tả |
|-----|-------|------------|-------|

## 4. API Endpoints

| Action | Method | URL | Request Class |
|--------|--------|-----|---------------|
| List | GET | `/api/v1/{module}/{plural}` | `List{Model}Request` |
| Show | GET | `/api/v1/{module}/{plural}/{id}` | — |
| Create | POST | `/api/v1/{module}/{plural}` | `Create{Model}Request` |
| Update | PUT | `/api/v1/{module}/{plural}/{id}` | `Update{Model}Request` |
| Delete | DELETE | `/api/v1/{module}/{plural}/{id}` | — |

## 5. Validation Rules

### Create / Update / List requests

| Field | Rules | Message (VI) |
|-------|-------|--------------|

## 6. Business Rules

- [ ] {Rule 1}

## 7. Presenter Output

```json
{
  "id": "integer",
  "status": { "value": "active", "label": "Hoạt động" }
}
```

> Enum fields: `{ "value": "...", "label": "..." }`. Không thêm `created_at` nếu nghiệp vụ không yêu cầu.

## 8. Cross-Module Dependencies (ExternalService)

| Dependency | Module nguồn | Interface | Method |
|-----------|-------------|-----------|--------|
| {Entity} | {SourceModule} | {Entity}ExternalServiceInterface | `get{Entity}By{Key}()` |

> Cross-module: dùng `ExternalService` interface, không dùng repository trực tiếp và không tạo foreign key.

## 9. Migration Preview

```php
Schema::create('{table}', function (Blueprint $table) {
    $table->id();
    // fields...
    // Cross-module refs: unsignedBigInteger nullable, no foreign key
    $table->unsignedBigInteger('created_by')->nullable();
    $table->unsignedBigInteger('updated_by')->nullable();
    $table->unsignedBigInteger('deleted_by')->nullable();
    $table->timestamps();
    $table->softDeletes();
});
```

## 10. Checklist triển khai BE

- [ ] Migration, Model, Enum, Repository, Service, Presenter, Requests, Controller
- [ ] Factory + Seeder
- [ ] ExternalService interfaces nếu có cross-module
- [ ] Test cases chính
````

## Frontend Spec Template

````markdown
# {Feature Name} - Đặc tả nghiệp vụ Frontend

> Module: `{Module}/{SubModule}` | Ngày tạo: {date} | Trạng thái: Draft

## 1. Tổng quan

Mô tả ngắn gọn về tính năng từ góc nhìn người dùng.

## 2. Danh sách trang

| Trang | Route | Mô tả |
|-------|-------|-------|
| Danh sách | `/{module}/{plural}` | Xem và lọc danh sách |
| Tạo mới | `/{module}/{plural}/create` | Form tạo mới |
| Chi tiết | `/{module}/{plural}/[id]` | Xem chi tiết |
| Chỉnh sửa | `/{module}/{plural}/[id]/edit` | Form chỉnh sửa |

## 3. Trang danh sách

### 3.1 Thông tin hiển thị trong bảng

| Cột | Dữ liệu | Ghi chú |
|-----|---------|---------|
| Tên | `name` | |
| Trạng thái | `status.label` | Badge màu theo trạng thái |
| Ngày tạo | `created_at` | Format DD/MM/YYYY nếu nghiệp vụ cần |

### 3.2 Tìm kiếm và Lọc

| Bộ lọc | Loại | Mô tả |
|--------|------|-------|
| Tìm kiếm | Ô nhập text | Tìm theo tên, mã, hoặc thông tin chính |
| Trạng thái | Dropdown | Lọc theo trạng thái |

### 3.3 Hành động

| Hành động | Điều kiện | Kết quả |
|-----------|-----------|---------|
| Tạo mới | Luôn hiển thị | Chuyển sang trang tạo mới |
| Xem chi tiết | Click row hoặc action | Chuyển sang trang chi tiết |
| Chỉnh sửa | Có quyền chỉnh sửa | Chuyển sang trang chỉnh sửa |
| Xóa | Có quyền xóa | Mở hộp thoại xác nhận |

## 4. Form tạo mới hoặc chỉnh sửa

### 4.1 Các trường nhập liệu

| Trường | Bắt buộc | Loại input | Ghi chú |
|--------|----------|------------|---------|
| Tên | Có | Text | |
| Mô tả | Không | Textarea | |
| Trạng thái | Có | Dropdown | Danh sách từ enum |

### 4.2 Hành động trên form

| Hành động | Kết quả |
|-----------|---------|
| Lưu | Gửi dữ liệu, thông báo thành công, quay về danh sách |
| Hủy | Quay về trang trước không lưu |

## 5. Trang chi tiết

### 5.1 Thông tin hiển thị

| Nhóm | Trường | Dữ liệu |
|------|--------|---------|
| Thông tin cơ bản | Tên | `name` |
| Thông tin cơ bản | Trạng thái | `status.label` |

### 5.2 Hành động

| Hành động | Kết quả |
|-----------|---------|
| Chỉnh sửa | Chuyển sang trang chỉnh sửa |
| Xóa | Mở hộp thoại xác nhận |

## 6. Luồng người dùng

### 6.1 Tạo mới

```text
Danh sách -> Tạo mới -> Điền form -> Lưu
  Thanh cong: thong bao + quay ve danh sach
  Loi: thong bao loi + giu nguyen form
```

### 6.2 Chỉnh sửa

```text
Danh sách -> Chỉnh sửa -> Cập nhật -> Lưu
  Thanh cong: thong bao + quay ve danh sach
  Loi: thong bao loi + giu nguyen form
```

### 6.3 Xóa

```text
Danh sách hoặc Chi tiết -> Xóa -> Xác nhận
  Thanh cong: thong bao + cap nhat danh sach
  Loi: thong bao loi
```

## 7. Phân quyền

| Hành động | Quyền cần có |
|-----------|--------------|
| Xem danh sách | `{feature}.view` |
| Tạo mới | `{feature}.create` |
| Chỉnh sửa | `{feature}.edit` |
| Xóa | `{feature}.delete` |

## 8. Ghi chú nghiệp vụ

- {Ghi chú đặc biệt nếu có}
````
