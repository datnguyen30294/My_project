# Tài khoản quản trị tenant - Đặc tả kỹ thuật Backend

> Module: `Platform/Tenant` (consumer) + `PMC/Account` (owner) | Ngày tạo: 2026-06-12 | Trạng thái: Draft
> Nguồn: mockup `BA-TNP-SERVICES/.../cong-ty-vh/[companyId].vue` — Tab "Quản lý tài khoản"
> Đây là Phase 2 đã được đánh dấu trong `cong-ty-van-hanh-be.md` (mục Gap #6).

## 1. Tổng quan

Cho phép admin platform xem và quản lý tài khoản vận hành **bên trong schema của tenant** (bảng `accounts` của PMC) từ trang chi tiết công ty vận hành. Bao gồm: liệt kê, tạo mới, cập nhật (sửa thông tin + bật/tắt).

**Điểm kiến trúc quan trọng:** dữ liệu account nằm ở tenant schema (Postgres schema-per-tenant), trong khi request đến từ cổng platform (central context). Mọi truy cập phải đi qua ExternalService của PMC và wrap trong `$tenant->run(fn () => ...)` — theo đúng pattern `OgTicketExternalService` hiện có.

## 2. Entities

**Không có bảng mới.** Dùng nguyên bảng `accounts` trong tenant schema (migration `2026_02_28_000000_create_accounts_table.php`):

| Field | Column | Type | Constraints | Ghi chú |
|-------|--------|------|-------------|---------|
| Họ tên | `name` | `string` | required | |
| Email | `email` | `string` | required, unique (trong tenant schema) | Email đăng nhập |
| Phòng ban | pivot `account_department` | many-to-many | required ≥ 1 | `belongsToMany(Department)` — migration `2026_04_16_120000_migrate_accounts_department_to_pivot` đã bỏ cột `department_id` |
| Chức danh | `job_title_id` | `foreignId` | required, restrictOnDelete | NOT NULL |
| Vai trò | `role_id` | `foreignId` | required, restrictOnDelete | NOT NULL — thay cho enum admin/operator của mockup |
| Trạng thái | `is_active` | `boolean` | default true | |
| Mật khẩu | `password` | `string` | required khi tạo | Hash bcrypt |

> Mockup chỉ có 4 field (họ tên, email, vai trò admin/operator, trạng thái). Model thật yêu cầu thêm phòng ban (nhiều, qua pivot — input `department_ids[]`) + chức danh + vai trò → form platform phải có đủ 3 dropdown lấy từ tenant schema. KHÔNG nới lỏng schema để khớp mockup. Tái sử dụng `AccountService::create/update` hiện có (đã xử lý sync `department_ids`).

## 3. Enums

Không có enum mới. Vai trò dùng bảng `roles` của tenant (model `Role`, enum `RoleType` hiện có), không hard-code admin/operator.

## 4. API Endpoints

Tất cả đặt trong `Platform/routes/external-api.php`, prefix `/platform/tenants/{id}`, guard `auth:requester` (nhóm route tenants hiện có).

| Action | Method | URL | Request Class |
|--------|--------|-----|---------------|
| List accounts | GET | `/platform/tenants/{id}/accounts` | `ListTenantAccountRequest` |
| Form options | GET | `/platform/tenants/{id}/accounts/options` | — |
| Create | POST | `/platform/tenants/{id}/accounts` | `CreateTenantAccountRequest` |
| Update | PUT | `/platform/tenants/{id}/accounts/{accountId}` | `UpdateTenantAccountRequest` |

> KHÔNG có endpoint Delete trong phạm vi này (mockup chỉ có Thêm/Sửa). Vô hiệu hoá tài khoản = update `is_active = false`. Nếu bổ sung delete sau này phải checkDelete quan hệ `account_project`, tickets được assign, v.v.

Controller mới: `Platform/src/Tenant/Controllers/TenantAccountController.php`.

## 5. Validation Rules

### CreateTenantAccountRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `name` | required, string, max:255 | Vui lòng nhập họ tên |
| `email` | required, email, max:255 | Email không hợp lệ |
| `password` | required, string, min:8 | Mật khẩu tối thiểu 8 ký tự |
| `department_ids` | required, array, min:1; mỗi phần tử integer | Vui lòng chọn phòng ban |
| `job_title_id` | required, integer | Vui lòng chọn chức danh |
| `role_id` | required, integer | Vui lòng chọn vai trò |
| `is_active` | nullable, boolean | |

### UpdateTenantAccountRequest

Như Create nhưng tất cả `sometimes`; `password` nullable (chỉ đổi khi truyền).

> **Lưu ý quan trọng:** KHÔNG dùng `Rule::unique('accounts', 'email')` hay `Rule::exists('departments', 'id')` trong Form Request — validator chạy ở central context nên query sai schema. Các check unique email / exists FK phải thực hiện **bên trong** `$tenant->run()` ở tầng Service, throw `BusinessException` với message tương đương.

## 6. Business Rules

- [ ] **Giới hạn tài khoản:** tạo account từ platform PHẢI đi qua `AccountLimitGuard` hiện có (code `ACCOUNT_LIMIT_REACHED`, đếm theo `max_accounts` của `TenantConfig`). Tái sử dụng, không viết lại.
- [ ] **Tenant không tồn tại / đã xoá:** 404. Tenant `is_active = false` vẫn cho platform quản lý account (để chuẩn bị trước khi kích hoạt lại).
- [ ] **Email unique trong tenant:** check trong tenant context, kể cả bản ghi soft-deleted (theo behavior unique index hiện có của bảng `accounts`).
- [ ] **Đổi password từ platform:** cho phép (đặt lại mật khẩu hộ tenant), không yêu cầu mật khẩu cũ.
- [ ] **Audit:** thao tác chạy trong tenant context không có user tenant đăng nhập → `created_by`/`updated_by` để null (bảng `accounts` hiện không có cột audit này, giữ nguyên).

## 7. Presenter Output

`TenantAccountResource` (Platform):

```json
{
  "id": 1,
  "name": "Nguyễn Văn A",
  "email": "admin@tenant.vn",
  "departments": [{ "id": 1, "name": "Ban quản lý" }],
  "job_title": { "id": 2, "name": "Trưởng ban" },
  "role": { "id": 1, "name": "Quản trị viên" },
  "is_active": true
}
```

`GET /accounts/options`:

```json
{
  "departments": [{ "id": 1, "name": "..." }],
  "job_titles": [{ "id": 1, "name": "..." }],
  "roles": [{ "id": 1, "name": "..." }]
}
```

## 8. Cross-Module Dependencies (ExternalService)

| Dependency | Module nguồn (owner) | Interface | Method |
|-----------|---------------------|-----------|--------|
| Account trong tenant schema | PMC/Account | `TenantAccountExternalServiceInterface` | `listAccounts(Organization $tenant, array $filters)` |
| | | | `getFormOptions(Organization $tenant)` |
| | | | `createAccount(Organization $tenant, array $data)` |
| | | | `updateAccount(Organization $tenant, int $accountId, array $data)` |

- Vị trí: `PMC/src/Account/ExternalServices/Platform/TenantAccountExternalService.php` (owner host, folder theo consumer — cùng convention `Platform/src/Tenant/ExternalServices/PMC/TenantConfigExternalService`).
- Binding đăng ký trong `PMCServiceProvider`.
- Bên trong: wrap `$tenant->run()`, gọi `AccountService`/`AccountRepository` + `AccountLimitGuard` hiện có của PMC. Trả về array thuần (không trả Model xuyên module).

## 9. Migration Preview

Không có migration mới.

## 10. Checklist triển khai BE

- [ ] `TenantAccountExternalServiceInterface` + impl trong PMC, binding ở `PMCServiceProvider`
- [ ] `TenantAccountController` + 3 Form Requests trong Platform
- [ ] Routes `/platform/tenants/{id}/accounts*` trong `external-api.php`
- [ ] `TenantAccountResource`
- [ ] Tests: list/create/update qua tenant context (SQLite in-memory theo pattern test tenant hiện có), limit guard, email trùng, tenant không tồn tại
- [ ] `make format` → `make lint` → tests; cập nhật `api.json` (scramble export)
