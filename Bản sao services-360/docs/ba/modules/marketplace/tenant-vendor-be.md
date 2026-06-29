# PMC Tenant CRUD Vendor - Đặc tả kỹ thuật Backend

> Module: `Marketplace/Partner` (mở rộng) + `Platform/Tenant` (toggle flag) | Ngày tạo: 2026-05-25 | Trạng thái: Draft

## 1. Tổng quan

Mở rộng module `Marketplace/Partner` để **PMC tenant** có thể tự CRUD vendor (marketplace partner) khi tenant đó được bật flag `is_vendor_enabled`.

- Bảng `partners` là **central** (`public.partners`). PMC tenant truy cập qua `CentralConnection`.
- Mỗi PMC tenant **chỉ thấy** vendor do chính họ tạo (`owner_tenant_id = current_tenant_id`). KHÔNG thấy vendor do Platform admin tạo hoặc do PMC khác tạo.
- Platform admin vẫn thấy toàn bộ master list (không đổi hành vi hiện tại).
- Provisioning sang `resi_mart`: tự động khi PMC tenant tạo vendor.
- Vendor đã provision (`tenant_id IS NOT NULL`) thì PMC **không được xóa** — phải liên hệ Platform admin.

## 2. Entities

### 2.1 Partner (ALTER — bảng đã tồn tại)

**Bảng:** `partners` (central, `public` schema)

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| Tenant sở hữu | `owner_tenant_id` | `string(100)` | nullable, index | **MỚI**. NULL = Platform admin tạo. Có giá trị = PMC tenant slug đã tạo vendor này. |

> Các cột hiện có (`id`, `slug`, `tenant_id`, `name`, `display_name`, `status`, `custom_domain`, `categories`, `owner_email`, `owner_phone`, `logo_url`, `description`, `created_by`, `updated_by`, `deleted_by`, timestamps, softDeletes) giữ nguyên.

**Unique indexes (giữ nguyên):**
- `partners_slug_unique` partial WHERE `deleted_at IS NULL`
- `partners_custom_domain_unique` partial WHERE `deleted_at IS NULL AND custom_domain IS NOT NULL`
- `partners_tenant_id_unique` partial WHERE `deleted_at IS NULL AND tenant_id IS NOT NULL`

**Index mới:** `partners_owner_tenant_id_index` trên `owner_tenant_id`.

**Lưu ý audit:** `created_by` vẫn là `unsignedBigInteger`. Phân nguồn qua `owner_tenant_id`:
- `owner_tenant_id IS NULL` → `created_by` trỏ về `requester_accounts.id` (Platform admin)
- `owner_tenant_id IS NOT NULL` → `created_by` trỏ về `accounts.id` ở tenant DB tương ứng

### 2.2 Tenant (ALTER — bảng đã tồn tại)

**Bảng:** `tenants` (central, `public` schema, do `stancl/tenancy` quản lý)

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| Bật gói vendor | `is_vendor_enabled` | `boolean` | default `false`, index | **MỚI**. Cho phép tenant CRUD vendor riêng của họ. Platform admin toggle. |

> Các cột hiện có (`id`, `name`, `is_organization`, `is_active`, `data`, timestamps, softDeletes) giữ nguyên.

## 3. Enums

Không có enum mới. Tái sử dụng `PartnerStatus` (Active, Suspended, Terminated) cho cả Platform và Tenant side.

## 4. API Endpoints

### 4.1 Tenant side (mới — mount tại `/api/v1/pmc/*` với `tenant` + `auth:sanctum` + `tenant.vendor_enabled`)

| Action | Method | URL | Request Class |
|--------|--------|-----|---------------|
| List | GET | `/api/v1/pmc/partners` | `ListTenantPartnerRequest` |
| Show | GET | `/api/v1/pmc/partners/{id}` | — |
| Create | POST | `/api/v1/pmc/partners` | `CreateTenantPartnerRequest` |
| Update | PUT | `/api/v1/pmc/partners/{id}` | `UpdateTenantPartnerRequest` |
| Delete | DELETE | `/api/v1/pmc/partners/{id}` | — |

> Controller mới: `TenantPartnerController` (cùng namespace `Marketplace/Partner/Controllers/`).
> Tất cả endpoint scope tự động theo `owner_tenant_id = tenant()->id`.

### 4.2 Platform side (mở rộng — mount tại `/api/v1/platform/*` với `auth:requester`)

| Action | Method | URL | Request Class |
|--------|--------|-----|---------------|
| Toggle vendor feature | PUT | `/api/v1/platform/tenants/{id}/vendor-feature` | `ToggleTenantVendorFeatureRequest` |

> Endpoint này nằm ở module `Platform/Tenant` (đã tồn tại). Body: `{ "is_vendor_enabled": true }`.

### 4.3 Platform side (KHÔNG đổi)

5 endpoint hiện có ở `/api/v1/platform/partners*` giữ nguyên. Platform admin thấy **toàn bộ** danh sách (cả vendor do PMC tenant tạo và do Platform tạo).

## 5. Validation Rules

### 5.1 `CreateTenantPartnerRequest`

Giống `CreatePartnerRequest` hiện tại (slug, name, display_name, status, custom_domain, categories, owner_email, owner_phone, logo_url, description) với khác biệt:

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `slug` | required, string, min:2, max:100, regex `^[a-z0-9][a-z0-9-]*[a-z0-9]$`, unique partners (toàn cục, partial deleted_at IS NULL) | Slug đã được sử dụng trên hệ thống. |
| `name` | required, string, max:255 | Tên partner là bắt buộc. |
| `display_name` | nullable, string, max:255 | — |
| `status` | nullable, in: PartnerStatus values | — |
| `custom_domain` | nullable, hostname regex, unique partners (toàn cục) | Custom domain đã được sử dụng. |
| `categories` | nullable, array | — |
| `categories.*` | string, max:100 | — |
| `owner_email` | required, email, max:255 | Email chủ sở hữu là bắt buộc. |
| `owner_phone` | nullable, string, max:30 | — |
| `logo_url` | nullable, url, max:500 | — |
| `description` | nullable, string, max:5000 | — |

**KHÔNG nhận từ client:** `owner_tenant_id` (set tự động = `tenant()->id` trong Service), `tenant_id` (do flow provision set), `created_by` (set từ auth user).

### 5.2 `UpdateTenantPartnerRequest`

Giống `UpdatePartnerRequest` hiện tại. **Không cho phép đổi `slug`** (immutable post-create, vì `resi_mart` schema id đã derive từ slug).

### 5.3 `ListTenantPartnerRequest`

| Field | Rules | Mô tả |
|-------|-------|-------|
| `search` | nullable, string, max:255 | Tìm theo name/display_name/slug/owner_email |
| `status` | nullable, in: PartnerStatus values | Lọc trạng thái |
| `category` | nullable, string, max:100 | Lọc theo category (JSON contains) |
| `provisioned` | nullable, boolean | Lọc đã/chưa provision resi_mart |
| `per_page` | nullable, integer, min:1, max:100 | Pagination |
| `sort_by` | nullable, in: name/created_at/status | — |
| `sort_dir` | nullable, in: asc/desc | — |

### 5.4 `ToggleTenantVendorFeatureRequest` (Platform/Tenant)

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `is_vendor_enabled` | required, boolean | Trạng thái gói vendor là bắt buộc. |

## 6. Business Rules

- [ ] **BR-01**: Route `/api/v1/pmc/partners*` chỉ truy cập được khi tenant có `is_vendor_enabled = true`. Middleware `EnsureTenantVendorEnabled` trả 403 với `errorCode = 'VENDOR_FEATURE_DISABLED'` nếu không bật.
- [ ] **BR-02**: List endpoint TỰ ĐỘNG scope `WHERE owner_tenant_id = tenant()->id`. KHÔNG nhận filter `owner_tenant_id` từ client.
- [ ] **BR-03**: Show/Update/Delete: nếu record không thuộc tenant hiện tại (`owner_tenant_id != tenant()->id`) → 404 (không 403, để không leak existence). Áp dụng cả khi `owner_tenant_id IS NULL` (vendor do Platform admin tạo).
- [ ] **BR-04**: Create: Service tự set `owner_tenant_id = tenant()->id`. Sau insert, gọi `tryProvisionRemote()` (best-effort, đã có sẵn). Provisioning fail → vendor vẫn tạo với `tenant_id = null`, PMC user thấy "Chờ provision" trong UI.
- [ ] **BR-05**: Update: KHÔNG cho đổi `slug`, `tenant_id`, `owner_tenant_id`. Các field khác cập nhật bình thường.
- [ ] **BR-06**: Delete:
  - Nếu `tenant_id IS NULL` (chưa provision) → soft delete OK.
  - Nếu `tenant_id IS NOT NULL` → 403 với `errorCode = 'VENDOR_ALREADY_PROVISIONED'`, message "Vendor đã được kích hoạt. Vui lòng liên hệ Platform admin để xóa."
- [ ] **BR-07**: Slug & custom_domain unique **toàn cục** (cross-tenant). Khi PMC nhập slug đã có (kể cả do PMC khác hoặc Platform tạo) → 422 với message "Slug đã được sử dụng trên hệ thống."
- [ ] **BR-08**: Provisioning resi_mart dùng nguyên `PartnerService::tryProvisionRemote()` hiện tại. Payload không cần thay đổi.
- [ ] **BR-09**: Toggle `is_vendor_enabled` (Platform endpoint): chỉ Platform admin. Tắt = false → vendor hiện có giữ nguyên (không xóa, không un-provision). PMC mất quyền truy cập route. Bật lại = true → PMC truy cập lại bình thường.
- [ ] **BR-10**: Platform admin endpoint `/api/v1/platform/partners*` thấy TẤT CẢ partner (cả do PMC tenant tạo). Resource trả thêm field `owner_tenant_id` để UI Platform phân biệt nguồn.
- [ ] **BR-11**: Khi PMC tenant bị soft-deleted (`tenants.deleted_at != NULL`) → middleware tenant của stancl sẽ tự reject request trước khi chạm BR-01. Không cần xử lý thêm.

## 7. Presenter Output

### 7.1 `PartnerDetailResource` (mở rộng — dùng chung cho Platform & Tenant)

```json
{
  "id": 12,
  "slug": "hoaqua",
  "tenant_id": "hoaqua",
  "name": "Hoa Qua Shop",
  "display_name": "Hoa Qua",
  "status": { "value": "active", "label": "Đang hoạt động" },
  "custom_domain": "shop.hoaqua.vn",
  "categories": ["fresh", "fruit"],
  "owner_email": "owner@hoaqua.vn",
  "owner_phone": "0901234567",
  "logo_url": "https://...",
  "description": "...",
  "is_provisioned": true,
  "owner_tenant_id": "pmc-abc",
  "owner_source": { "value": "tenant", "label": "PMC tenant" },
  "created_by": 5,
  "updated_by": 5,
  "created_at": "2026-05-25T10:00:00+07:00",
  "updated_at": "2026-05-25T10:00:00+07:00"
}
```

> **Field mới:**
> - `owner_tenant_id`: nullable string.
> - `owner_source`: enum-shape `{ value: "platform" | "tenant", label }`. Derived từ `owner_tenant_id IS NULL`.

### 7.2 `PartnerListResource` (mở rộng)

Bổ sung `owner_tenant_id` và `owner_source` giống detail. List ở tenant side luôn có `owner_source = "tenant"` (do đã scope).

## 8. Cross-Module Dependencies (ExternalService)

| Dependency | Module nguồn | Interface | Method |
|-----------|-------------|-----------|--------|
| Tenant info (`is_vendor_enabled`, `is_active`) | `Platform/Tenant` | `TenantExternalServiceInterface` (đã có hoặc tạo nếu chưa) | `findById(string $tenantId): ?TenantDto` |
| Resi_mart provisioning | (External — đã có) | `ResiMartProvisioningServiceInterface` | `provisionVendor(array $payload)` |

> **Marketplace/Partner** đọc `tenants.is_vendor_enabled` qua middleware → middleware có thể query trực tiếp `\App\Modules\Platform\Tenant\Models\Tenant` hoặc qua ExternalService.
> Quy ước project: middleware cross-module → dùng ExternalService.

## 9. Migration Preview

### 9.1 Alter `partners`

```php
return new class extends Migration {
    public function up(): void {
        Schema::table('partners', function (Blueprint $table): void {
            $table->string('owner_tenant_id', 100)->nullable()->after('tenant_id');
            $table->index('owner_tenant_id', 'partners_owner_tenant_id_index');
        });
    }

    public function down(): void {
        Schema::table('partners', function (Blueprint $table): void {
            $table->dropIndex('partners_owner_tenant_id_index');
            $table->dropColumn('owner_tenant_id');
        });
    }
};
```

### 9.2 Alter `tenants`

```php
return new class extends Migration {
    public function up(): void {
        Schema::table('tenants', function (Blueprint $table): void {
            $table->boolean('is_vendor_enabled')->default(false)->after('is_active')->index();
        });
    }

    public function down(): void {
        Schema::table('tenants', function (Blueprint $table): void {
            $table->dropIndex(['is_vendor_enabled']);
            $table->dropColumn('is_vendor_enabled');
        });
    }
};
```

## 10. Service & Repository

### 10.1 `PartnerService` (mở rộng) — methods MỚI

```php
public function listForTenant(string $ownerTenantId, array $filters): LengthAwarePaginator;
public function findByIdForTenant(int $id, string $ownerTenantId): Partner; // throw 404 nếu không match
public function createForTenant(string $ownerTenantId, array $data): Partner; // set owner_tenant_id, gọi tryProvisionRemote
public function updateForTenant(int $id, string $ownerTenantId, array $data): Partner;
public function deleteForTenant(int $id, string $ownerTenantId): void; // throw 403 nếu tenant_id != null
```

### 10.2 `PartnerRepository` (mở rộng) — methods MỚI

```php
public function listOwnedBy(string $ownerTenantId, array $filters): LengthAwarePaginator;
public function findByIdOwnedBy(int $id, string $ownerTenantId): ?Partner;
```

> Service KHÔNG `Model::query()` trực tiếp — gọi qua Repository. Tuân thủ rule `feedback_service_no_direct_model_query`.

### 10.3 Middleware `EnsureTenantVendorEnabled`

```php
namespace App\Modules\Marketplace\Partner\Http\Middleware;

class EnsureTenantVendorEnabled {
    public function handle(Request $request, Closure $next) {
        $tenant = tenant(); // stancl current tenant
        if (! $tenant || ! ($tenant->is_vendor_enabled ?? false)) {
            throw new BusinessException(
                message: 'Tenant chưa kích hoạt gói vendor.',
                errorCode: 'VENDOR_FEATURE_DISABLED',
                httpStatusCode: 403,
            );
        }
        return $next($request);
    }
}
```

Register alias trong `MarketplaceServiceProvider` hoặc `bootstrap/app.php`: `'tenant.vendor_enabled' => EnsureTenantVendorEnabled::class`.

## 11. Routes update

### `backend/app/Modules/Marketplace/routes/tenant.php` (thêm group `partners`)

```php
Route::prefix('partners')->middleware('tenant.vendor_enabled')->group(function (): void {
    Route::get('/', [TenantPartnerController::class, 'index']);
    Route::post('/', [TenantPartnerController::class, 'store']);
    Route::get('/{id}', [TenantPartnerController::class, 'show']);
    Route::put('/{id}', [TenantPartnerController::class, 'update']);
    Route::delete('/{id}', [TenantPartnerController::class, 'destroy']);
});
```

> Group `partner-projects` giữ nguyên.

### Platform side — thêm vào module `Platform/Tenant/routes/platform.php`

```php
Route::put('tenants/{id}/vendor-feature', [TenantController::class, 'toggleVendorFeature']);
```

## 12. Checklist triển khai BE

### Migrations
- [ ] `2026_05_26_000001_add_owner_tenant_id_to_partners_table.php`
- [ ] `2026_05_26_000002_add_is_vendor_enabled_to_tenants_table.php`

### Marketplace/Partner module
- [ ] `Partner` model: thêm `owner_tenant_id` vào `$fillable`
- [ ] `PartnerStatus` enum: không đổi
- [ ] `PartnerRepository`: thêm `listOwnedBy()`, `findByIdOwnedBy()`
- [ ] `PartnerService`: thêm 5 method `*ForTenant()`
- [ ] `PartnerServiceInterface`: cập nhật contract
- [ ] `TenantPartnerController` (mới): 5 action
- [ ] `CreateTenantPartnerRequest`, `UpdateTenantPartnerRequest`, `ListTenantPartnerRequest` (mới)
- [ ] `EnsureTenantVendorEnabled` middleware (mới)
- [ ] `PartnerDetailResource` & `PartnerListResource`: thêm `owner_tenant_id`, `owner_source`
- [ ] `routes/tenant.php`: thêm group `partners`
- [ ] `MarketplaceServiceProvider`: register middleware alias
- [ ] Factory: cập nhật `PartnerFactory` thêm state `ownedByTenant($id)`

### Platform/Tenant module
- [ ] `Tenant` model: thêm `is_vendor_enabled` vào `$fillable`, cast `boolean`
- [ ] `TenantController`: thêm action `toggleVendorFeature(int $id)`
- [ ] `ToggleTenantVendorFeatureRequest` (mới)
- [ ] `TenantService`: thêm `toggleVendorFeature(string $id, bool $enabled)`
- [ ] `TenantRepository`: thêm `setVendorEnabled(string $id, bool $enabled)` nếu cần
- [ ] `TenantDetailResource` / `TenantListResource`: thêm `is_vendor_enabled`
- [ ] `routes/platform.php`: thêm endpoint toggle
- [ ] `TenantExternalServiceInterface` (nếu chưa có): expose `findById()` trả DTO có `is_vendor_enabled`

### Tests (Feature)
- [ ] `tests/Feature/Modules/Marketplace/Partner/TenantPartnerListTest.php` — scope theo `owner_tenant_id`, không thấy của PMC khác / Platform
- [ ] `tests/Feature/Modules/Marketplace/Partner/TenantPartnerCreateTest.php` — happy path + provisioning fail vẫn create OK
- [ ] `tests/Feature/Modules/Marketplace/Partner/TenantPartnerUpdateTest.php` — không sửa được vendor của PMC khác (404), không đổi được slug
- [ ] `tests/Feature/Modules/Marketplace/Partner/TenantPartnerDeleteTest.php` — chặn delete khi đã provision, OK khi chưa
- [ ] `tests/Feature/Modules/Marketplace/Partner/TenantPartnerMiddlewareTest.php` — flag = false → 403, = true → cho qua
- [ ] `tests/Feature/Modules/Platform/Tenant/ToggleVendorFeatureTest.php` — Platform admin toggle, requester guard required
- [ ] `tests/Feature/Modules/Marketplace/Partner/PlatformPartnerOwnerScopeTest.php` — Platform admin thấy vendor do PMC tạo

### Post-change
- [ ] `make format` (Pint)
- [ ] `make lint`
- [ ] Run feature tests
- [ ] API docs: check `@tags Marketplace Partners (Tenant)` annotation cho `TenantPartnerController`
