---
name: analyze-domain
description: Analyzes business requirements for a domain/feature and generates separate BE spec (migration, model, enums, API endpoints, validation) and FE spec (pages, display fields, features, user flows). Activates when the user wants to analyze, spec out, or document a new domain, feature, or entity before implementation. Handles UI mockups, screenshots, and business descriptions.
---

# Analyze Domain

## When to Apply

- User provides UI mockups, wireframes, or screenshots
- User asks to analyze business requirements for a domain/feature
- User wants a technical specification before writing code
- User says "phân tích", "analyze", "spec", "tài liệu nghiệp vụ"

## Workflow

### Phase 1: Gather Information

1. **Analyze input** (screenshots, descriptions): identify entities, fields, types, constraints, enums, relationships, search/filter/sort/pagination, export/import
2. **Identify pages & UI flows**: list management, detail/show, create form, edit form, any modals or drawers
3. **Check existing modules:** `find app/Modules -type d -maxdepth 4 2>/dev/null`
4. **Check existing docs:** `ls docs/ba/modules/ 2>/dev/null`
5. **Identify cross-module dependencies:** detect if entities reference data from other modules → document ExternalService needs
6. **Ask clarifying questions** if needed

### Phase 2: Generate Specs

Create **two separate files** — **both in Vietnamese**:
- `docs/ba/modules/{module-name}/{feature-name}-be.md` — Backend spec
- `docs/ba/modules/{module-name}/{feature-name}-fe.md` — Frontend spec (nghiệp vụ, không phải kỹ thuật)

---

## BE Output Template

````markdown
# {Feature Name} - Đặc tả kỹ thuật Backend

> Module: `{Module}/{SubModule}` | Ngày tạo: {date} | Trạng thái: Draft

## 1. Tổng quan

Mô tả ngắn gọn về domain/feature.

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
|-------|-------|-------------|

## 6. Business Rules

- [ ] {Rule 1}

## 7. Presenter Output

```json
{
  "id": "integer",
  "status": { "value": "active", "label": "Hoạt động" }
}
```

> Enum fields: `{ "value": "...", "label": "..." }`. No `created_at` unless explicitly required.

## 8. Cross-Module Dependencies (ExternalService)

| Dependency | Module nguồn | Interface | Method |
|-----------|-------------|-----------|--------|
| {Entity} | {SourceModule} | {Entity}ExternalServiceInterface | `get{Entity}By{Key}()` |

> Cross-module: dùng ExternalService interface (model + eager loading), KHÔNG dùng repository, KHÔNG dùng foreign key.

## 9. Migration Preview

```php
Schema::create('{table}', function (Blueprint $table) {
    $table->id();
    // fields...
    // Cross-module refs: $table->unsignedBigInteger('external_ref_id')->nullable(); (NO FK)
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
- [ ] ExternalService interfaces (nếu có cross-module)
- [ ] PSR-4 mappings + pint
````

---

## FE Output Template

> FE spec chỉ mô tả **nghiệp vụ**: hiển thị gì, tính năng gì, luồng người dùng như thế nào.
> Kỹ thuật (component, composable, API call) xử lý trong skill `frontend-development`.

````markdown
# {Feature Name} - Đặc tả nghiệp vụ Frontend

> Module: `{Module}/{SubModule}` | Ngày tạo: {date} | Trạng thái: Draft

## 1. Tổng quan

Mô tả ngắn gọn về tính năng từ góc nhìn người dùng.

## 2. Danh sách trang

| Trang | Route | Mô tả |
|-------|-------|-------|
| Danh sách | `/{module}/{plural}` | Xem + tìm kiếm + lọc danh sách |
| Tạo mới | `/{module}/{plural}/create` | Form tạo mới |
| Chi tiết | `/{module}/{plural}/[id]` | Xem chi tiết |
| Chỉnh sửa | `/{module}/{plural}/[id]/edit` | Form chỉnh sửa |

## 3. Trang danh sách

### 3.1 Thông tin hiển thị trong bảng

| Cột | Dữ liệu | Ghi chú |
|-----|---------|---------|
| Tên | `name` | |
| Trạng thái | `status.label` | Badge màu theo trạng thái |
| Ngày tạo | `created_at` | Format: DD/MM/YYYY |

### 3.2 Tìm kiếm & Lọc

| Bộ lọc | Loại | Mô tả |
|--------|------|-------|
| Tìm kiếm | Ô nhập text | Tìm theo tên / mã |
| Trạng thái | Dropdown | Lọc theo trạng thái |

### 3.3 Hành động

| Hành động | Điều kiện | Kết quả |
|-----------|-----------|---------|
| Tạo mới | Luôn hiển thị | Chuyển sang trang tạo mới |
| Xem chi tiết | Click vào row | Chuyển sang trang chi tiết |
| Chỉnh sửa | Icon Edit | Chuyển sang trang chỉnh sửa |
| Xóa | Icon Xóa | Mở hộp thoại xác nhận |

## 4. Form tạo mới / chỉnh sửa

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

```
Danh sách → "Tạo mới" → Form tạo → Điền thông tin → Lưu
  ✓ Thành công: Thông báo + quay về danh sách
  ✗ Lỗi: Thông báo lỗi, giữ nguyên form
```

### 6.2 Chỉnh sửa

```
Danh sách → Icon Edit → Form chỉnh sửa (dữ liệu đã điền sẵn) → Lưu
  ✓ Thành công: Thông báo + quay về danh sách
  ✗ Lỗi: Thông báo lỗi, giữ nguyên form
```

### 6.3 Xóa

```
Danh sách / Chi tiết → Icon Xóa → Hộp thoại xác nhận → Xác nhận
  ✓ Thành công: Thông báo + cập nhật danh sách
  ✗ Lỗi: Thông báo lỗi
```

## 7. Phân quyền (nếu có)

| Hành động | Quyền cần có |
|-----------|-------------|
| Xem danh sách | `{feature}.view` |
| Tạo mới | `{feature}.create` |
| Chỉnh sửa | `{feature}.edit` |
| Xóa | `{feature}.delete` |

## 8. Ghi chú nghiệp vụ

- {Ghi chú đặc biệt về nghiệp vụ nếu có}
````

---

## Analysis Guidelines

### Field Type Mapping

| UI Element | DB Type | Migration |
|------------|---------|-----------|
| Text input | `string` | `$table->string('name', 255)` |
| Short code | `string` | `$table->string('code', 50)` |
| Email/Phone | `string` | `$table->string('email', 255)` |
| Textarea | `text` | `$table->text('description')` |
| Dropdown (enum) | `string` | `$table->string('status', 50)` |
| Number | `integer` | `$table->integer('quantity')` |
| Money | `decimal` | `$table->decimal('amount', 15, 2)` |
| Boolean | `boolean` | `$table->boolean('is_active')` |
| Date/DateTime | `date`/`timestamp` | `$table->date()` / `$table->timestamp()` |

### Constraint Detection

| UI Indicator | Constraint |
|-------------|------------|
| `*` asterisk | `required` |
| No asterisk | `nullable` |
| Fixed dropdown | `in:values` (Enum) |
| Unique field | `unique:table,column` |

### Relationship Detection

| Pattern | Type |
|---------|------|
| Dropdown from another entity | `belongsTo` |
| List within form | `hasMany` |
| Multi-select / tags | `belongsToMany` |
| Parent/child | self-referential `belongsTo` |

### Cross-Module Reference Detection

If a field references an entity from another module:
- **BE:** Use `$table->unsignedBigInteger('external_ref_id')->nullable()` (NO foreign key), document in Section 8 of BE spec
- **FE:** Note in Section 4 of FE spec that the field is a dropdown fetched from another module
