# Dự án gắn tenant - Đặc tả kỹ thuật Backend

> Module: `Platform/Tenant` (consumer) + `PMC/Project` (owner) | Ngày tạo: 2026-06-12 | Trạng thái: Draft
> Nguồn: mockup `BA-TNP-SERVICES/.../cong-ty-vh/[companyId].vue` — Section "Dự án gắn tenant" (tab Thông tin chung) + cột "Số dự án" trang danh sách.

## 1. Tổng quan

Hiển thị **read-only** danh sách dự án mà tenant đang quản lý (bảng `projects` trong tenant schema của PMC) trên trang chi tiết công ty vận hành phía platform. Không có thao tác tạo/sửa/xoá từ platform — dự án do tenant tự quản lý qua cổng vận hành.

Giống tính năng Tài khoản quản trị tenant: dữ liệu nằm trong tenant schema, truy cập qua ExternalService của PMC wrap `$tenant->run()`.

## 2. Entities

**Không có bảng mới.** Đọc từ bảng `projects` tenant schema (model `PMC/Project`):

| Field | Column | Ghi chú |
|-------|--------|---------|
| Mã | `code` | unique trong tenant |
| Tên dự án | `name` | |
| Địa chỉ | `address` | nullable |
| Trạng thái | `status` | Enum `ProjectStatus`: `managing` (Đang quản lý) / `stopped` (Đã dừng) |

## 3. Enums

Không có enum mới — dùng `ProjectStatus` hiện có của PMC.

## 4. API Endpoints

| Action | Method | URL | Request Class |
|--------|--------|-----|---------------|
| List projects của tenant | GET | `/platform/tenants/{id}/projects` | `ListTenantProjectRequest` |

- Đặt trong nhóm route `/platform/tenants` hiện có (`external-api.php`, guard `auth:requester`).
- **Phân trang chuẩn** (paginated resource collection, mặc định 10/trang) + filter `search` (tên/mã), `status`, sort `name|code|created_at`. Mặc định sort `name` ASC.
- FE hiển thị badge số dự án từ `meta.total`.

> **Cột "Số dự án" trên trang danh sách tenants:** KHÔNG đưa vào `GET /platform/tenants` trong phạm vi này — mỗi row sẽ tốn một lần switch schema (`$tenant->run()`), N+1 cross-schema trên trang list. Số dự án chỉ hiển thị ở trang chi tiết. Nếu sau này cần cột list: thêm cột đếm cache (vd `projects_count` trong `tenant_configs`, sync khi PMC tạo/xoá project) — ngoài phạm vi spec này.

## 5. Validation Rules

`ListTenantProjectRequest`: `search` (string, max 255), `status` (`Rule::in(ProjectStatus::values())`), `sort_by` (`name|code|created_at`), `sort_direction` (`asc|desc`), `per_page` (1–100). Tenant không tồn tại → 404.

## 6. Business Rules

- [ ] Read-only tuyệt đối: không endpoint ghi nào cho project từ phía platform.
- [ ] Tenant `is_active = false` vẫn xem được danh sách dự án (dữ liệu lịch sử giữ nguyên).
- [ ] Không trả các field nhạy cảm của project (thông tin ngân hàng BQT: `bqt_bank_bin`, `bqt_account_number`...) — chỉ 4 field hiển thị.
- [ ] Sắp xếp mặc định theo `name` ASC (client có thể đổi qua `sort_by`/`sort_direction`).
- [ ] checkDelete: không áp dụng (không có thao tác xoá).

## 7. Presenter Output

`TenantProjectResource` (Platform) — paginated resource collection chuẩn (giống Tài khoản quản trị tenant), badge số dự án lấy từ `meta.total`:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "code": "PJ001",
      "name": "Chung cư Alpha Tower",
      "address": "Số 1 Đại Cồ Việt, Hà Nội",
      "status": { "value": "managing", "label": "Đang quản lý" }
    }
  ],
  "links": { "...": "..." },
  "meta": { "current_page": 1, "per_page": 10, "total": 2 }
}
```

## 8. Cross-Module Dependencies (ExternalService)

| Dependency | Module nguồn (owner) | Interface | Method |
|-----------|---------------------|-----------|--------|
| Project trong tenant schema | PMC/Project | `TenantProjectExternalServiceInterface` | `listProjects(Organization $tenant, array $filters): LengthAwarePaginator` |

- Vị trí: `PMC/src/Project/ExternalServices/Platform/TenantProjectExternalService.php`, binding trong `PMCServiceProvider`.
- Bên trong: `$tenant->run()` + `ProjectRepository` hiện có; trả array thuần `{id, code, name, address, status}`.

## 9. Migration Preview

Không có migration mới.

## 10. Checklist triển khai BE

- [ ] `TenantProjectExternalServiceInterface` + impl trong PMC, binding `PMCServiceProvider`
- [ ] Controller riêng `TenantProjectController` trong `Platform/src/Tenant/Controllers/` (không nhét vào `OrganizationController`)
- [ ] Route `GET /platform/tenants/{id}/projects`
- [ ] `TenantProjectResource`
- [ ] Tests: tenant có dự án / không có dự án / tenant không tồn tại / không lộ field ngân hàng BQT
- [ ] `make format` → `make lint` → tests; cập nhật `api.json`
