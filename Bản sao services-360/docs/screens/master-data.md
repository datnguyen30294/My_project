# Các màn master data

Các màn quản lý dữ liệu tham chiếu — có chung đặc điểm:

- **Chỉ admin/quản trị** mới được tạo/sửa.
- Có 2 nguồn sinh record: **CRUD route** + **Seeder khi khởi tạo tenant**.
- Không có event/auto-create từ workflow khác.

## Tổng hợp

| Màn | Route tạo | Service | Seeder (nếu có) |
|-----|-----------|---------|-----------------|
| `/pmc/projects` | `POST /projects` | `ProjectService::create` | `ProjectSeeder` |
| `/pmc/departments` | `POST /departments` | `DepartmentService::create` | `DepartmentSeeder` |
| `/pmc/job-titles` | `POST /job-titles` | `JobTitleService::create` | `JobTitleSeeder` |
| `/pmc/accounts` | `POST /accounts` (xem service provider) | `AccountService::create` | `AccountSeeder` |
| `/pmc/roles` | `POST /roles` | `RoleService::create` | `RoleSeeder` + permissions fixture |
| `/pmc/og-ticket-categories` | `POST /og-ticket-categories` | `OgTicketCategoryService::create` | `OgTicketCategorySeeder` |
| `/pmc/catalog/suppliers` | `POST /catalog/suppliers` | `CatalogSupplierService::create` | `CatalogSupplierSeeder` |
| `/pmc/catalog/items` | `POST /catalog/items` | `CatalogItemService::create` | `CatalogItemSeeder` |
| `/pmc/catalog/categories` (ServiceCategory) | `POST /catalog/service-categories` | `ServiceCategoryService::create` | `ServiceCategorySeeder` |
| `/pmc/shifts` | `POST /shifts` | `ShiftService::create` | `ShiftSeeder` |

## Quy tắc chung

### 1. CRUD đầy đủ qua admin

- Mỗi màn mở `apiResource` với 5 action: index/store/show/update/destroy.
- Route pattern: `/{resource}` + `/{resource}/{id}/check-delete` (cho đa số, không phải tất cả).
- Validation trong `Create{Entity}Request` / `Update{Entity}Request` — luôn có check unique khi cần.

### 2. Seeder chỉ chạy khi setup tenant

- Chạy qua `php artisan tenants:migrate --seed` hoặc `php artisan tenants:seed` (xem `database/seeders/Tenant/*`).
- Tạo **master data mặc định** — ví dụ: 3 phòng ban cơ bản, danh mục tickets chuẩn, 1 kho catalog mẫu.
- Sau khi seed xong, admin dùng CRUD để chỉnh theo tổ chức.

### 3. Không có auto-create từ workflow khác

Khác với các entity transactional (Receivable, CashTransaction, CommissionSnapshot…), master data **không** tự sinh khi nghiệp vụ khác trigger. Ví dụ:

- Tạo `OgTicket` không sinh `Project` mới — `project_id` phải đã có.
- Tạo `Quote` không sinh `CatalogItem` mới — chọn từ danh sách có sẵn hoặc nhập `reference_id = null` (custom line).

### 4. Upload ảnh / file đính kèm

Một số master data có endpoint upload riêng (không tạo record chính nhưng update field):

| Route | Tác dụng |
|-------|---------|
| `POST /catalog/items/{id}/image` | Upload ảnh đại diện CatalogItem |
| `DELETE /catalog/items/{id}/image` | Xoá ảnh đại diện |
| `POST /catalog/items/{id}/gallery` | Upload thêm ảnh gallery |
| `DELETE /catalog/items/{id}/gallery/{imageId}` | Xoá ảnh trong gallery |
| `POST /catalog/service-categories/{id}/image` | Upload ảnh service category |
| `DELETE /catalog/service-categories/{id}/image` | Xoá ảnh service category |

Gallery image có thể xem là "sub-record" — sinh qua route gallery POST.

## Project members — pivot

`/pmc/projects/[id]` có tab members. Thành viên (account ↔ project) là **pivot** `project_members`, không phải entity độc lập:

- Route: `PUT /projects/{id}/sync-members` — `app/Modules/PMC/routes/api.php:54`.
- Không có create/delete riêng — chỉ sync batch (replace toàn bộ danh sách).
- Không sinh `Account` hay `Project` — chỉ update quan hệ.
