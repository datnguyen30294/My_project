# Quản lý Organization (OG) - Đặc tả kỹ thuật Backend

> Module: `Platform/Tenant` | Ngày tạo: 2026-03-15 | Trạng thái: Draft

## 1. Tổng quan

Quản lý danh sách Organization (tenant) trên platform. Cho phép platform admin xem danh sách, thêm mới, cập nhật thông tin, và toggle trạng thái active/inactive cho Organization. Không hỗ trợ xóa cứng — chỉ inactive.

## 2. Entity

### 2.1 Organization (đã tồn tại)

**Bảng:** `tenants` (central database, đã có sẵn — KHÔNG tạo migration mới)

**Model:** `App\Modules\Platform\Tenant\Models\Organization` (extends `Stancl\Tenancy\Database\Models\Tenant`)

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| Mã OG | `id` | `string` | PK, unique, required | Mã định danh organization (VD: `tnp`). Không thay đổi sau khi tạo |
| Tên OG | `name` | `string` | required | Tên hiển thị organization |
| Là tổ chức | `is_organization` | `boolean` | default: true | Luôn = `true` khi tạo qua API này |
| Trạng thái | `is_active` | `boolean` | default: true | `true` = đang hoạt động, `false` = ngừng hoạt động |
| Dữ liệu mở rộng | `data` | `json` | nullable | Stancl Tenancy JSON column (không dùng trực tiếp trong CRUD này) |
| Ngày tạo | `created_at` | `timestamp` | auto | |
| Ngày cập nhật | `updated_at` | `timestamp` | auto | |
| Ngày xóa | `deleted_at` | `timestamp` | nullable | SoftDeletes |

**Lưu ý đặc biệt:**
- Model extends `Stancl\Tenancy\Database\Models\Tenant`, KHÔNG phải `BaseModel`
- Primary key là `string` (không auto-increment)
- Không có Auditable trait (không có `created_by`, `updated_by`, `deleted_by`)
- Bảng `tenants` đã tồn tại — **không cần migration mới**
- `getCustomColumns()` đã khai báo: `id`, `name`, `is_organization`, `is_active`

**Scopes đã có:**
- `active()` — lọc `is_active = true`
- `organization()` — lọc `is_organization = true`
- `search($keyword)` — tìm theo `name` hoặc `id` (LIKE)

## 3. Enums

Không có enum mới. Trạng thái dùng boolean `is_active`.

## 4. API Endpoints

| Action | Method | URL | Request Class | Mô tả |
|--------|--------|-----|---------------|-------|
| List | GET | `/api/v1/platform/organizations` | `ListOrganizationRequest` | Danh sách OG có phân trang, search, filter |
| Show | GET | `/api/v1/platform/organizations/{id}` | — | Chi tiết 1 OG |
| Create | POST | `/api/v1/platform/organizations` | `CreateOrganizationRequest` | Tạo OG mới |
| Update | PUT | `/api/v1/platform/organizations/{id}` | `UpdateOrganizationRequest` | Cập nhật tên OG |
| Toggle Active | PUT | `/api/v1/platform/organizations/{id}/toggle-active` | — | Bật/tắt trạng thái hoạt động |

**Auth:** `auth:requester` guard (platform authentication)

**Route prefix:** `/api/v1/platform` (đăng ký trong `authenticated.php`)

## 5. Validation Rules

### 5.1 ListOrganizationRequest

| Field | Rules | Mô tả |
|-------|-------|-------|
| `search` | `['nullable', 'string', 'max:255']` | Từ khóa tìm kiếm |
| `is_active` | `['nullable', 'boolean']` | Filter theo trạng thái |
| `sort_by` | `['nullable', 'string', 'in:id,name,is_active,created_at']` | Sắp xếp |
| `sort_direction` | `['nullable', 'string', 'in:asc,desc']` | Hướng sắp xếp |
| `per_page` | `['nullable', 'integer', 'min:1', 'max:100']` | Số bản ghi / trang |

### 5.2 CreateOrganizationRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `id` | `['required', 'string', 'max:50', 'regex:/^[a-z0-9_-]+$/', 'unique:tenants,id']` | Mã OG bắt buộc, chỉ chứa chữ thường, số, dấu gạch ngang/gạch dưới, không trùng |
| `name` | `['required', 'string', 'max:255']` | Tên OG bắt buộc |

### 5.3 UpdateOrganizationRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `name` | `['required', 'string', 'max:255']` | Tên OG bắt buộc |

> **Lưu ý:** `id` không cho phép thay đổi sau khi tạo. `is_active` thay đổi qua endpoint toggle-active riêng.

## 6. Business Rules

- [ ] Khi tạo OG mới, tự động set `is_organization = true`
- [ ] Mã OG (`id`) chỉ chấp nhận lowercase, số, dấu gạch ngang, gạch dưới (regex: `^[a-z0-9_-]+$`)
- [ ] Mã OG không thể thay đổi sau khi tạo
- [ ] Toggle active: đổi `is_active` từ `true` ↔ `false`
- [ ] Khi inactive một OG, các tenant user thuộc OG đó sẽ không thể đăng nhập (kiểm tra ở tầng auth middleware)
- [ ] Không hỗ trợ xóa cứng (delete) — chỉ inactive
- [ ] Danh sách chỉ hiển thị records có `is_organization = true` (scope `organization()`)
- [ ] Khi tạo OG, Stancl Tenancy sẽ tự động tạo database schema riêng cho tenant

## 7. Presenter Output (OrganizationResource)

```json
{
  "id": "tnp",
  "name": "Thần Nông",
  "is_active": true,
  "created_at": "2026-03-15T10:00:00.000000Z"
}
```

> Không cần enum format `{ value, label }` vì `is_active` là boolean đơn giản.
> Include `created_at` vì hữu ích cho admin quản lý.

## 8. Cross-Module Dependencies

| Dependency | Module nguồn | Interface | Method | Ghi chú |
|-----------|-------------|-----------|--------|---------|
| OrganizationExternalService | Platform/Ticket | `OrganizationExternalServiceInterface` | `getOrganizationById()`, `listActiveOrganizations()` | Đã có sẵn — module Ticket dùng để lấy danh sách OG |

> Không có dependency mới. Module Ticket đã dùng ExternalService để truy cập Organization.

## 9. Migration

**KHÔNG cần migration mới.** Bảng `tenants` đã tồn tại với đầy đủ columns cần thiết.

Migration gốc: `database/migrations/2019_09_15_000010_create_tenants_table.php`

## 10. Cấu trúc files cần tạo

```
backend/app/Modules/Platform/src/Tenant/
├── Contracts/
│   └── OrganizationServiceInterface.php
├── Controllers/
│   └── OrganizationController.php
├── Models/
│   └── Organization.php                    ← đã có
├── Repositories/
│   └── OrganizationRepository.php
├── Requests/
│   ├── ListOrganizationRequest.php
│   ├── CreateOrganizationRequest.php
│   └── UpdateOrganizationRequest.php
├── Resources/
│   └── OrganizationResource.php
└── Services/
    └── OrganizationService.php
```

**Cập nhật files có sẵn:**
- `PlatformServiceProvider.php` — bind `OrganizationServiceInterface` → `OrganizationService`
- `routes/authenticated.php` — thêm route group cho organizations

## 11. Checklist triển khai BE

- [ ] Repository: `OrganizationRepository` (list với scope `organization()`, search, filter is_active)
- [ ] Service Interface: `OrganizationServiceInterface`
- [ ] Service: `OrganizationService` (list, show, create, update, toggleActive)
- [ ] Resource: `OrganizationResource`
- [ ] Form Requests: `ListOrganizationRequest`, `CreateOrganizationRequest`, `UpdateOrganizationRequest`
- [ ] Controller: `OrganizationController` (index, show, store, update, toggleActive)
- [ ] Routes: `authenticated.php` thêm apiResource + toggle-active route
- [ ] ServiceProvider: bind interface → concrete
- [ ] Tests: `OrganizationTest.php` (list, create, show, update, toggle-active, validation)
- [ ] Pint: format code
