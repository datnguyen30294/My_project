# Công ty vận hành (Tenant) - Đặc tả kỹ thuật Backend

> Module: `Platform/Tenant` | Ngày tạo: 2026-06-10 | Trạng thái: Draft
> Nguồn: mockup `BA-TNP-SERVICES/app/pages/platform/modules/quan-ly-van-hanh/cong-ty-vh/`
> Spec này là **bản nâng cấp** của tính năng Tenant hiện có — KHÔNG tạo submodule mới.

## 1. Tổng quan

Trang "Công ty vận hành" trên cổng platform quản lý vòng đời tenant: đăng ký, cập nhật hồ sơ doanh nghiệp, vô hiệu hoá / kích hoạt lại, cấu hình giới hạn + phí nền tảng, bật/tắt module dịch vụ.

**Hiện trạng đã có** (`Platform/src/Tenant`, routes `external-api.php`, guard `auth:requester`):

| Đã có | Chi tiết |
|-------|---------|
| Model `Organization` | extends Stancl `Tenant`, bảng `tenants`, PK string = mã tenant, SoftDeletes |
| Custom columns | `id`, `name`, `is_organization`, `is_active`, `is_vendor_enabled` (+ `data` JSON) |
| CRUD endpoints | `GET/POST /platform/tenants`, `GET/PUT/DELETE /platform/tenants/{id}` |
| Toggle vendor | `PUT /platform/tenants/{id}/vendor-feature` |
| Domains | quan hệ `HasDomains` (bảng `domains`), nhận `domains[]` khi create/update |
| Schema riêng | Stancl schema-per-tenant (Postgres), tên schema sinh từ tenant id |

**Gap so với mockup (việc cần làm):**

1. **Hồ sơ doanh nghiệp**: thêm MST, người đại diện, email, SĐT, địa chỉ, gói dịch vụ, ghi chú.
2. **Thống kê danh sách**: tổng / đang hoạt động / đã vô hiệu hoá.
3. **Cấu hình tenant** (mới hoàn toàn): giới hạn dự án/tài khoản, thời gian phiên, cờ hiển thị app cư dân, cờ cổng đối tác.
4. **Phí nền tảng theo đơn hàng** (mới hoàn toàn): 5 hình thức thu phí (none / subscription / fixed / percent / both).
5. **Bật/tắt module dịch vụ** cho tenant (tổng quát hoá `is_vendor_enabled` hiện tại).
6. **(Phase 2)** Quản lý tài khoản quản trị tenant từ cổng platform (cross-schema).
7. **(Phase 3)** Biểu đồ doanh thu/đơn hàng/phí platform 6 tháng + đánh giá cư dân (phụ thuộc dữ liệu đơn hàng marketplace).

## 2. Entities

### 2.1 Organization (mở rộng bảng `tenants` — migration ALTER)

Các cột mới, thêm vào `getCustomColumns()`:

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| Mã số thuế | `tax_code` | `string(20)` | nullable | 10–13 chữ số |
| Người đại diện | `representative_name` | `string(255)` | nullable | Người liên hệ chính |
| Email liên hệ | `contact_email` | `string(255)` | nullable | |
| Điện thoại | `contact_phone` | `string(20)` | nullable | |
| Địa chỉ | `address` | `string(500)` | nullable | Trụ sở / văn phòng |
| Gói dịch vụ | `service_plan` | `string(50)` | default `business` | Enum `ServicePlan` |
| Ghi chú | `notes` | `text` | nullable | Ghi chú nội bộ platform |

> - Ngày đăng ký = `created_at` (đã có, không thêm cột).
> - Tên miền: dùng quan hệ `domains` hiện có. Khi tạo tenant nếu không truyền `domains[]`, hệ thống tự sinh từ mã (slug + suffix config `tenancy.central_domains`). Tên schema: theo convention Stancl hiện tại — chỉ hiển thị (computed trong Resource), KHÔNG lưu cột mới.
> - Model extends Stancl `Tenant`, KHÔNG có Auditable (`created_by`...) — giữ nguyên hiện trạng.

### 2.2 TenantConfig (bảng mới `tenant_configs` — central DB)

1–1 với tenant. Tách bảng riêng để không phình `tenants` và dễ thêm cấu hình sau này.

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| Tenant | `tenant_id` | `string(50)` | unique, FK `tenants.id` (cùng module — FK được phép) | |
| Giới hạn dự án | `max_projects` | `integer` | default 10, min 1 | Số dự án tối đa |
| Giới hạn tài khoản | `max_accounts` | `integer` | default 50, min 1 | Số user VH tối đa |
| Thời gian phiên | `session_timeout_minutes` | `integer` | default 480, min 15 | Phút |
| Hiện trên app cư dân | `resident_portal_enabled` | `boolean` | default true | |
| Cho phép ĐK dịch vụ | `partner_portal_enabled` | `boolean` | default true | |
| Hình thức thu phí | `fee_mode` | `string(50)` | default `none` | Enum `TenantFeeMode` |
| Chu kỳ gói | `subscription_cycle` | `string(20)` | default `monthly` | Enum `SubscriptionCycle` |
| Mức phí gói | `subscription_amount` | `decimal(15,2)` | default 0 | đ / chu kỳ |
| Phí cố định/đơn | `fixed_fee_per_order` | `decimal(15,2)` | default 0 | đ / đơn |
| Phí %/đơn | `percent_fee_per_order` | `decimal(5,2)` | default 0 | 0–100 |
| Module được bật | `enabled_modules` | `json` | nullable | Mảng key module; `null` = bật tất cả |
| Auditable + SoftDeletes | `created_by`, `updated_by`, `deleted_by`, `deleted_at` | | nullable | Extends `BaseModel` |

**Quan hệ:** `Organization hasOne TenantConfig`, `TenantConfig belongsTo Organization`.
Service tự tạo config mặc định khi tạo tenant (và lazy-create khi đọc tenant cũ chưa có).

> **Lưu ý `is_vendor_enabled`:** giữ nguyên cột hiện có + endpoint toggle (resi_mart đang phụ thuộc). `enabled_modules` quản lý các module VH nội bộ; KHÔNG gộp vendor flag vào trong phạm vi này.

## 3. Enums

### 3.1 ServicePlan (`Platform/Tenant/Enums/ServicePlan.php`)

| Key | Value | Label (VI) |
|-----|-------|------------|
| Starter | `starter` | Starter |
| Business | `business` | Business |
| Enterprise | `enterprise` | Enterprise |

### 3.2 TenantFeeMode

| Key | Value | Label (VI) | Mô tả |
|-----|-------|------------|-------|
| None | `none` | Không thu | Không tính phí nền tảng theo đơn |
| Subscription | `subscription` | Thu theo gói tháng/năm | Phí cố định theo chu kỳ |
| FixedPerOrder | `fixed_per_order` | Thu tiền mặt theo đơn hàng | Khoản cố định mỗi đơn |
| PercentPerOrder | `percent_per_order` | Thu theo % đơn hàng | % giá trị đơn |
| Both | `both` | Thu theo cả 2 | Cố định + % mỗi đơn |

### 3.3 SubscriptionCycle

| Key | Value | Label (VI) |
|-----|-------|------------|
| Monthly | `monthly` | Theo tháng |
| Yearly | `yearly` | Theo năm |

## 4. API Endpoints

Giữ nguyên 6 endpoint hiện có (mở rộng request/resource). Endpoint mới:

| Action | Method | URL | Request Class | Ghi chú |
|--------|--------|-----|---------------|---------|
| Stats | GET | `/platform/tenants/stats` | — | `{ total, active, inactive }` (đếm theo `is_active`, loại trừ soft-deleted). Khai báo TRƯỚC route `tenants/{id}` |
| Update config | PUT | `/platform/tenants/{id}/config` | `UpdateTenantConfigRequest` | Cập nhật giới hạn + phí + `enabled_modules` |
| Toggle active | PUT | `/platform/tenants/{id}/toggle-active` | `ToggleTenantActiveRequest` | Vô hiệu hoá / kích hoạt lại (thay cho việc FE gửi `is_active` qua update) |

Phase 2 (cần chốt nghiệp vụ trước khi làm):

| Action | Method | URL | Ghi chú |
|--------|--------|-----|---------|
| List accounts | GET | `/platform/tenants/{id}/accounts` | Chạy trong tenant context (`tenancy()->initialize`) đọc bảng accounts của schema tenant |
| Create/Update account | POST/PUT | `/platform/tenants/{id}/accounts[/{accountId}]` | Cross-schema, đụng tới HRM Account của tenant |

## 5. Validation Rules

### 5.1 CreateOrganizationRequest (mở rộng)

Giữ rules hiện có (`id`, `name`, `is_organization`, `is_active`, `domains.*`), thêm:

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `tax_code` | `['nullable', 'string', 'regex:/^\d{10}(\d{3})?$/']` | MST gồm 10 hoặc 13 chữ số |
| `representative_name` | `['nullable', 'string', 'max:255']` | |
| `contact_email` | `['nullable', 'email', 'max:255']` | Email không hợp lệ |
| `contact_phone` | `['nullable', 'string', 'max:20']` | |
| `address` | `['nullable', 'string', 'max:500']` | |
| `service_plan` | `['nullable', Rule::enum(ServicePlan::class)]` | Gói dịch vụ không hợp lệ |
| `notes` | `['nullable', 'string', 'max:2000']` | |

`UpdateOrganizationRequest`: các field trên với `sometimes`. **`id` (mã) không cho sửa** — đã đúng hiện trạng.

### 5.2 UpdateTenantConfigRequest

| Field | Rules |
|-------|-------|
| `max_projects` | `['sometimes', 'integer', 'min:1', 'max:1000']` |
| `max_accounts` | `['sometimes', 'integer', 'min:1', 'max:10000']` |
| `session_timeout_minutes` | `['sometimes', 'integer', 'min:15', 'max:10080']` |
| `resident_portal_enabled` | `['sometimes', 'boolean']` |
| `partner_portal_enabled` | `['sometimes', 'boolean']` |
| `fee_mode` | `['sometimes', Rule::enum(TenantFeeMode::class)]` |
| `subscription_cycle` | `['sometimes', Rule::enum(SubscriptionCycle::class)]` |
| `subscription_amount` | `['sometimes', 'numeric', 'min:0']` |
| `fixed_fee_per_order` | `['sometimes', 'numeric', 'min:0']` |
| `percent_fee_per_order` | `['sometimes', 'numeric', 'min:0', 'max:100']` |
| `enabled_modules` | `['sometimes', 'nullable', 'array']` + `enabled_modules.*` in danh sách module key hợp lệ |

### 5.3 ListOrganizationRequest (mở rộng)

Thêm: `service_plan` (`nullable`, enum), search mở rộng sang `tax_code`, `contact_email`, `representative_name` (cập nhật scope `search`).

## 6. Business Rules

- [ ] Mã tenant (`id`) bất biến sau khi tạo; chuẩn hoá lowercase slug (đã có regex).
- [ ] Tạo tenant → tự sinh domain mặc định nếu không truyền `domains[]`; tự tạo `TenantConfig` mặc định.
- [ ] Vô hiệu hoá (`is_active = false`): tenant không đăng nhập / vận hành được; dữ liệu giữ nguyên. Kích hoạt lại được.
- [ ] Mockup KHÔNG có xoá tenant — chỉ deactivate. Endpoint DELETE hiện tại giữ (soft-delete) nhưng FE chính dùng toggle-active.
- [ ] `checkDelete`: trước khi xoá (soft) tenant phải chặn nếu tenant còn hoạt động (`is_active = true`) — bắt buộc vô hiệu hoá trước. `TenantConfig` xoá theo tenant (cascade soft-delete trong Service).
- [ ] Phí nền tảng: mỗi tenant chỉ áp dụng 1 `fee_mode`; các field tiền chỉ có nghĩa theo mode (subscription → amount+cycle; fixed → fixed_fee; percent → percent_fee; both → fixed + percent).
- [ ] `enabled_modules = null` nghĩa là bật tất cả (tương thích ngược tenant cũ).
- [ ] Giới hạn `max_projects` / `max_accounts`: spec này chỉ LƯU cấu hình; việc enforce ở luồng tạo dự án/tài khoản của tenant là task riêng (ghi nhận, ngoài phạm vi).

## 7. Presenter Output

`OrganizationDetailResource` (mở rộng):

```json
{
  "id": "vh-alpha",
  "name": "Công ty VH Alpha",
  "is_organization": true,
  "is_active": true,
  "is_vendor_enabled": false,
  "tax_code": "0312345678",
  "representative_name": "Nguyễn Văn A",
  "contact_email": "contact@alpha.vn",
  "contact_phone": "0901234567",
  "address": "Q.1, TP.HCM",
  "service_plan": { "value": "business", "label": "Business" },
  "notes": "...",
  "domains": ["vh-alpha.tnp.app.vn"],
  "schema_name": "vh-alpha",
  "config": {
    "max_projects": 10,
    "max_accounts": 50,
    "session_timeout_minutes": 480,
    "resident_portal_enabled": true,
    "partner_portal_enabled": true,
    "fee_mode": { "value": "both", "label": "Thu theo cả 2" },
    "subscription_cycle": { "value": "monthly", "label": "Theo tháng" },
    "subscription_amount": 0,
    "fixed_fee_per_order": 1000,
    "percent_fee_per_order": 5,
    "enabled_modules": null
  },
  "created_at": "2026-06-10T00:00:00+07:00"
}
```

`OrganizationListResource`: thêm `tax_code`, `service_plan`, `representative_name`, `contact_email` (cho cột Liên hệ).

## 8. Cross-Module Dependencies (ExternalService)

| Dependency | Module nguồn | Ghi chú |
|-----------|-------------|---------|
| Số dự án của tenant | Tenant schema (PMC/Project) | Phase 2 — cần cross-schema count (tham khảo `OrganizationLookupController::projects` đã có) |
| Doanh thu / đơn hàng / phí platform | Marketplace + resi_mart | Phase 3 — phụ thuộc dữ liệu đơn hàng, chưa có nguồn ổn định |
| Đánh giá cư dân | Marketplace (đơn vendor hoàn tất) | Phase 3 |
| Tài khoản quản trị tenant | Tenant schema (PMC/Account) | Phase 2 — cần chốt nghiệp vụ tạo user cross-schema từ platform |

## 9. Migration Preview

```php
// 1. ALTER tenants
Schema::table('tenants', function (Blueprint $table) {
    $table->string('tax_code', 20)->nullable();
    $table->string('representative_name', 255)->nullable();
    $table->string('contact_email', 255)->nullable();
    $table->string('contact_phone', 20)->nullable();
    $table->string('address', 500)->nullable();
    $table->string('service_plan', 50)->default('business');
    $table->text('notes')->nullable();
});

// 2. CREATE tenant_configs (central DB)
Schema::create('tenant_configs', function (Blueprint $table) {
    $table->id();
    $table->string('tenant_id', 50)->unique();
    $table->foreign('tenant_id')->references('id')->on('tenants');
    $table->integer('max_projects')->default(10);
    $table->integer('max_accounts')->default(50);
    $table->integer('session_timeout_minutes')->default(480);
    $table->boolean('resident_portal_enabled')->default(true);
    $table->boolean('partner_portal_enabled')->default(true);
    $table->string('fee_mode', 50)->default('none');
    $table->string('subscription_cycle', 20)->default('monthly');
    $table->decimal('subscription_amount', 15, 2)->default(0);
    $table->decimal('fixed_fee_per_order', 15, 2)->default(0);
    $table->decimal('percent_fee_per_order', 5, 2)->default(0);
    $table->json('enabled_modules')->nullable();
    $table->unsignedBigInteger('created_by')->nullable();
    $table->unsignedBigInteger('updated_by')->nullable();
    $table->unsignedBigInteger('deleted_by')->nullable();
    $table->timestamps();
    $table->softDeletes();
});
```

> Migration trên **central** connection (như `create_tenants_table`), KHÔNG nằm trong `migrations/tenant/`.

## 10. Checklist triển khai BE (Phase 1)

- [ ] Migration ALTER `tenants` + CREATE `tenant_configs`
- [ ] Enums: `ServicePlan`, `TenantFeeMode`, `SubscriptionCycle`
- [ ] Model `TenantConfig` (BaseModel) + quan hệ `hasOne` trên `Organization`; cập nhật `getCustomColumns()`
- [ ] `TenantConfigRepository`; mở rộng `OrganizationRepository` (search mới, stats, filter service_plan)
- [ ] Service: create tenant kèm default config + auto domain; `updateConfig()`; `toggleActive()`; `stats()`
- [ ] Requests: mở rộng Create/Update/List + `UpdateTenantConfigRequest`, `ToggleTenantActiveRequest`
- [ ] Resources: mở rộng List/Detail (enum `{value,label}`, nested `config`, `schema_name`)
- [ ] Routes mới trong `external-api.php` (stats đặt trước `{id}`)
- [ ] Factory + Seeder cho `TenantConfig`; cập nhật `OrganizationFactory`
- [ ] Tests: stats, config update theo từng fee_mode, toggle active, checkDelete khi còn active, validate MST
- [ ] `make format` → `make lint` → tests
