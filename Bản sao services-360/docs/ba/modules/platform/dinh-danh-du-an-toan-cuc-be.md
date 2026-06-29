# Định danh dự án toàn cục bằng `code` (cross-tenant) + gắn CTVH cho đơn vendor — Đặc tả kỹ thuật Backend

> Module: `Platform/ProjectRegistry` (mới, central) + `PMC/Project` + `Marketplace/VendorOrder` | Repo: `residential-management` **và** `resi_mart` | Ngày tạo: 2026-06-20 | Trạng thái: Draft

## 1. Tổng quan

### 1.1 Vấn đề
Console Platform **"Đơn hàng vendor"** (`/platform/quan-ly-don-hang/don-hang-vendor`):
- Không hiển thị được **CTVH (công ty vận hành)** của mỗi đơn — cột "Công ty VH" trống.
- Click vào **dự án** ra trang "Không tìm thấy dự án".

**Gốc rễ (đã xác minh bằng dữ liệu thật):**
- `orders.tenant_id` trong resi_mart = `NULL` ở mọi đơn (seeder không ghi; cột tồn tại nhưng không được điền).
- Yêu cầu nghiệp vụ: **cư dân chỉ gửi `code` của dự án khi mua hàng, KHÔNG gửi tenant/operator**.
- `project_id` **KHÔNG unique toàn cục**: kiến trúc schema-per-tenant, mỗi CTVH có bảng `projects` riêng, id tự tăng từ 1 → trùng. Đã chứng minh: `tenant_tnp.projects` có id=1 và `tenant_abc.projects` cũng có id=1.

→ Nếu đơn chỉ gắn `project_id` (hoặc `code`) trần thì **không suy ra được CTVH một cách chắc chắn**.

### 1.2 Giải pháp đã chốt
Một **registry trung tâm** `public.platform_projects` đóng 2 vai trò:
1. **Van enforce `code` unique XUYÊN tenant** — thứ mà index per-schema (`projects_code_unique`) không làm được (Postgres không có unique constraint xuyên schema).
2. **Bảng tra cứu `code → (tenant_id, project_id)`** O(1) cho resi_mart resolve khi cư dân mua hàng.

Nhờ vậy: cư dân gửi `code` trần → resi_mart resolve ra `(tenant_id, project_id)` → lưu **cả hai** vào đơn → console đọc thẳng `tenant_id`, hết phải đoán.

### 1.3 Nguyên lý nền tảng (vì sao làm được atomic)
Stancl schema-per-tenant chạy **trong CÙNG 1 database** `residential_management` (chỉ đổi `search_path`). Vì cùng connection/cùng DB nên có thể ghi `tenant_<x>.projects` **và** `public.platform_projects` trong **CÙNG 1 transaction** → `UNIQUE` violation ở registry rollback luôn cả việc tạo dự án. Đây là điều kiện cốt lõi để registry trở thành van enforce thật, không race.

---

## 2. Entities

### 2.1 PlatformProject (registry trung tâm — bảng MỚI)

**Bảng:** `platform_projects` (schema `public`/central, KHÔNG nằm trong schema tenant)

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| Mã dự án | `code` | `string(50)` | **partial unique** `WHERE deleted_at IS NULL` | Van enforce cross-tenant. Giá trị = **mirror** của `tenant_<x>.projects.code` |
| CTVH | `tenant_id` | `string` | not null, index | Slug operator (vd `tnp`). Khoá phân biệt CTVH |
| Project (trong schema) | `project_id` | `unsignedBigInteger` | not null | Id dự án trong `tenant_<tenant_id>.projects` |
| Tên dự án | `name` | `string(255)` | not null | Cache denormalized (đồng bộ cùng gateway) |
| Trạng thái | `status` | `string(50)` | not null | Cache `ProjectStatus` (đồng bộ cùng gateway) |
| Ngày tạo | `created_at` | `timestamp` | nullable | |
| Ngày cập nhật | `updated_at` | `timestamp` | nullable | |
| Ngày xóa | `deleted_at` | `timestamp` | nullable | SoftDeletes |

**Indexes / Ràng buộc:**
- `UNIQUE (code) WHERE deleted_at IS NULL` — **partial unique** (khớp ngữ nghĩa index tenant để cho tái dùng code của dự án đã xoá mềm).
- `UNIQUE (tenant_id, project_id) WHERE deleted_at IS NULL` — mỗi dự án chỉ có đúng 1 dòng mirror.
- Index `(tenant_id)`.

> **Lưu ý thiết kế:** `code` là **nguồn enforce**, nhưng **nguồn sự thật của dữ liệu vẫn là `tenant_<x>.projects`**. Registry là bản mirror + van uniqueness. `name`/`status` là cache để console & resolver khỏi switch schema; phải đồng bộ trong cùng gateway.

> **KHÔNG dùng `created_by/updated_by/deleted_by`** ở bảng này: nó là bản ghi hệ thống sinh tự động từ gateway, không phải entity người dùng CRUD trực tiếp.

### 2.2 Bảng hiện có liên quan (KHÔNG đổi cấu trúc)
- `tenant_<x>.projects` — giữ nguyên, vẫn có index partial `projects_code_unique ON (code) WHERE deleted_at IS NULL` (uniqueness TRONG 1 tenant).
- resi_mart `orders` (schema vendor) — đã có cột `tenant_id varchar` + `project_id bigint`; chỉ cần **được điền đúng** (xem §10).

---

## 3. Enums

Không có enum mới. Tái dùng `App\Modules\PMC\Project\Enums\ProjectStatus` (cache vào `platform_projects.status`).

---

## 4. API Endpoints

**Không thêm endpoint console nào.** Tính năng này là hạ tầng/tích hợp:
- Việc ghi `platform_projects` diễn ra **ngầm** trong gateway tạo/sửa/xoá dự án (không có API riêng).
- resi_mart **đọc trực tiếp cross-DB** từ `pmc_central.platform_projects` (giống cách đang đọc `partner_project`) — **không cần endpoint mới** ở residential-management.

> Nếu sau này muốn debug, có thể thêm 1 endpoint nội bộ `GET /api/v1/platform/project-registry` (read-only) — **ngoài scope GĐ này**.

---

## 5. Validation Rules

### 5.1 Tạo / sửa dự án — quy tắc `code`
| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `code` (per-schema, đã có) | `required, string, max:50` + unique TRONG tenant (index hiện có) | "Mã dự án đã tồn tại trong hệ thống." |
| `code` (cross-tenant, MỚI) | enforce qua `UNIQUE` của `platform_projects.code` trong transaction | "Mã dự án đã tồn tại trên nền tảng. Vui lòng chọn mã khác." |

- **Bỏ** rule `unique:projects,code` cứng ở `CreateProjectRequest` **chỉ khi** đã chuyển sang enforce qua gateway? → **KHÔNG bỏ.** Giữ check per-schema (phản hồi sớm, thân thiện) + thêm enforce cross-tenant ở gateway. Hai tầng bổ sung cho nhau.
- `Platform\CreatePlatformProjectRequest` hiện **không** check unique → vẫn dựa vào gateway (cross-tenant) + check per-schema trong `TenantProjectExternalService::createProject` (đã có `existsByCode`).

### 5.2 Hành vi khi trùng cross-tenant
- Gateway insert `platform_projects` → `QueryException` (unique violation) → **bắt và ánh xạ** thành `BusinessException`/`ValidationException` với `errorCode = PROJECT_CODE_DUPLICATE_PLATFORM`, HTTP 422, message §5.1. Transaction rollback → **dự án KHÔNG được tạo** ở tenant schema.

---

## 6. Business Rules (TRỌNG TÂM)

### 6.1 Gateway ghi 2 bảng atomic
- [ ] Mọi thao tác **tạo / đổi `code` / soft-delete / restore** dự án phải đi qua **một chokepoint duy nhất** và ghi đồng thời `tenant_<x>.projects` + `public.platform_projects` trong **CÙNG 1 transaction, CÙNG 1 connection** (qualify `public.platform_projects` để ghi trên connection tenant đang active).
- [ ] **Chokepoint:** cả 2 đường tạo (`PMC\ProjectService::create` và `Platform\PlatformProjectService::create` → `TenantProjectExternalService::createProject`) đều hội tụ tại **`ProjectRepository::create/update/delete`** chạy trong context tenant. Anchor gateway tại đây.
- [ ] **Khuyến nghị triển khai:** dùng **Model Observer** trên `PMC\Project\Models\Project` (`created`/`updated`/`deleted`/`restored`) gọi `ProjectRegistrar` để dual-write — vì MỌI path (repository, service, seeder, factory) đều qua model `Project`, observer là cách chống bypass mạnh nhất. **Bắt buộc bọc transaction** ở các path tạo (xem §6.2).
- [ ] `ProjectRegistrar` (collaborator thuần) lấy `tenant_id` từ context tenant hiện tại (`tenant()->getTenantKey()` của Stancl — luôn có vì repository chạy trong `$tenant->run` hoặc middleware tenant).

### 6.2 Atomicity bắt buộc
- [ ] `PMC\ProjectService::create/update/delete` đã bọc `executeInTransaction` → OK.
- [ ] `TenantProjectExternalService::createProject` hiện **chỉ** `$tenant->run(...)` **không** transaction → **phải bọc transaction** quanh create để observer/registrar rollback được.
- [ ] Thứ tự không quan trọng cho atomicity (mọi constraint violation trong 1 transaction đều rollback toàn bộ); nhưng nên để registry insert **trước** để fail-fast.

### 6.3 Funnel mọi đường ghi
- [ ] Reroute / phủ observer cho TẤT CẢ path: `PMC ProjectController` (create/update/delete), `Platform PlatformProjectController` (create), **seeder** (`ProjectSeeder`, E2E setup artisan command), **factory** (nếu dùng trong test cần registry).
- [ ] Cấm ghi thẳng `projects.code` bằng raw SQL bỏ qua model.

### 6.4 Soft-delete / restore / rename
- [ ] Soft-delete dự án → soft-delete (hoặc xoá) dòng `platform_projects` tương ứng → giải phóng `code` cho tái dùng (khớp partial unique).
- [ ] Restore dự án → khôi phục dòng registry (re-check uniqueness cross-tenant tại thời điểm restore).
- [ ] Đổi `code`/`name`/`status` → update dòng registry tương ứng (re-check uniqueness nếu đổi `code`).

### 6.5 Backfill (1 lần, qua migration)
- [ ] Loop mọi tenant (`tenants` registry của Stancl) → `$tenant->run` → đọc toàn bộ `projects` (kể cả đã soft-delete? → chỉ lấy `whereNull(deleted_at)` để khớp partial unique) → upsert vào `platform_projects`.
- [ ] **Audit trùng cross-tenant TRƯỚC** khi bật unique: hiện đang **SẠCH** — `tnp = [DA-CC-A, DA-CC-B, 124124, DA-PW-01, #5]`, `abc = [DA-TM-A]`. Nếu phát hiện trùng ở dữ liệu thật khi deploy → migration phải fail rõ ràng + liệt kê cặp trùng để xử lý tay (không tự ý đổi code).

### 6.6 Quy mô
- 10-15 tenant: dual-write mỗi lần tạo (hiếm) là không đáng kể; resolve O(1) qua index `code`. Không cần cache thêm. Khi tenant lên hàng trăm vẫn không đổi (registry đã là O(1)).

---

## 7. Presenter Output

### 7.1 Hình dạng dòng registry resi_mart đọc (resolve)
```json
{
  "code": "DA-CC-A",
  "tenant_id": "tnp",
  "project_id": 1,
  "name": "Dự án Chung cư A",
  "status": "managing"
}
```
> resi_mart query `pmc_central.platform_projects` `WHERE code = ? AND deleted_at IS NULL` → 0 hoặc 1 dòng (đảm bảo bởi partial unique).

### 7.2 Console vendor-orders (đã có) — sau khi đơn được gắn `tenant_id`
`VendorOrderListResource.tenant` giữ nguyên hình dạng hiện tại `{ id, name }`; nay luôn có dữ liệu vì `order.tenant_id` đã được điền (xem §10). **Không đổi resource.**

---

## 8. Cross-Module / Cross-Repo Dependencies

| Phụ thuộc | Nguồn | Cơ chế | Ghi chú |
|-----------|-------|--------|---------|
| `platform_projects` | residential-management (public) | resi_mart đọc cross-DB qua connection `pmc_central` | Giống `partner_project` đang đọc — không hạ tầng mới |
| `partner_project` | residential-management (public) | resi_mart đã đọc | Dùng để validate vendor có được gán `(tenant_id, project_id)` + `is_vendor_enabled` |
| `orders.tenant_id` (resi_mart) | resi_mart (schema vendor) | console residential-management đọc cross-DB qua `ResiMartConnection` | Đã có; nay được điền đúng |

> **Trong residential-management**, gateway ghi registry là **nội bộ cùng repo** (PMC ghi public) → KHÔNG cần ExternalService (không phải cross top-level module ghi chéo; chỉ là PMC ghi 1 bảng central của Platform — cân nhắc đặt registry-write helper ở `Platform/ProjectRegistry` và để `PMC/Project` gọi qua interface nếu muốn giữ ranh giới module; xem §11).

---

## 9. Migration Preview

```php
// database/migrations/2026_06_20_000001_create_platform_projects_table.php  (CENTRAL/public)
Schema::create('platform_projects', function (Blueprint $table) {
    $table->id();
    $table->string('code', 50);
    $table->string('tenant_id');
    $table->unsignedBigInteger('project_id');
    $table->string('name');
    $table->string('status', 50);
    $table->timestamps();
    $table->softDeletes();

    $table->index('tenant_id');
});

// Partial unique (Postgres) — chạy raw vì Blueprint không hỗ trợ partial:
DB::statement('CREATE UNIQUE INDEX platform_projects_code_unique
    ON platform_projects (code) WHERE deleted_at IS NULL');
DB::statement('CREATE UNIQUE INDEX platform_projects_tenant_project_unique
    ON platform_projects (tenant_id, project_id) WHERE deleted_at IS NULL');
```

```php
// database/migrations/2026_06_20_000002_backfill_platform_projects.php  (data migration)
// up():
//   - duyệt Tenant::all() (Stancl) → $tenant->run(fn() =>
//       Project::query()->get(['id','code','name','status']) )
//   - gom (tenant_id, id, code, name, status); audit trùng `code` cross-tenant
//       → nếu trùng: throw \RuntimeException liệt kê cặp trùng (KHÔNG tự sửa)
//   - insert hàng loạt vào platform_projects
// down(): truncate platform_projects
```

> Migration central: đảm bảo chạy trên connection central (public), KHÔNG per-tenant. Tuân theo cách project đang phân tách migration tenant vs central.

---

## 10. Phần resi_mart (repo `resi_mart`)

### 10.1 Resolver `code → (tenant_id, project_id)`
- [ ] Thêm vào `Platform/Integration/Services/PartnerLookupService` (hoặc service resolver mới) method:
  `resolveProjectByCode(Partner $partner, string $code): ?array`
  - Query `DB::connection('pmc_central')->table('platform_projects')->where('code', $code)->whereNull('deleted_at')->first(['tenant_id','project_id'])`.
  - Nếu null → trả `null` (no scope).
  - Validate vendor được gán: `partner_project WHERE partner_id + tenant_id + project_id + is_vendor_enabled = true AND deleted_at IS NULL` (tái dùng `findAssignment`). Không khớp → `null`.
  - Trả `['tenant_id' => ..., 'project_id' => ...]`.

### 10.2 Storefront deep-link → chỉ `code`
- [ ] Cư dân vào storefront qua `?project=<code>` (BỎ `&operator=`).
- [ ] Catalog scoping: resolve `code → (tenant_id, project_id)` rồi dùng cặp này lọc `product_project` (keyed `tenant_id + project_id`) như cũ.

### 10.3 Checkout — tag đơn (TRỌNG TÂM)
- [ ] `CheckoutService::placeOrder` nhận `code` (qua header `X-Project-Code`) thay vì `X-Project-Id` + `X-Operator-Id`.
- [ ] `resolveProjectScope(?string $code)`:
  - `$code` rỗng → `[null, null]` (đơn không tag — như hành vi hiện tại).
  - resolve qua §10.1 → `[$projectId, $tenantId]` nếu hợp lệ, ngược lại `[null, null]`.
- [ ] `OrderService::checkout` ghi **CẢ** `orders.project_id` **LẪN** `orders.tenant_id` (đã fillable). Giữ bất biến: project_id và tenant_id **luôn đi đôi** (cùng có hoặc cùng null).

### 10.4 Sửa OrderSeeder
- [ ] `OrderSeeder::resolveProjectIds()` hiện chỉ `->pluck('project_id')` từ `partner_project` → đổi lấy **cặp** `['tenant_id','project_id']`.
- [ ] Khi tạo đơn seed: set `tenant_id` kèm `project_id`.

### 10.5 Backfill `orders.tenant_id` (đơn cũ)
- [ ] Migration/command resi_mart: với mỗi đơn có `project_id` nhưng `tenant_id IS NULL`, derive `tenant_id` từ `partner_project` của vendor (partner sở hữu schema) theo `project_id`. Dữ liệu hiện **single-tenant** (chỉ `tnp`) → không nhập nhằng. Nếu tương lai nhập nhằng → log + bỏ qua (để null), không đoán bừa.

### 10.6 Frontend storefront (resi_mart)
- [ ] `composables/useProjectContext.ts`: scope theo `code` (query `?project=<code>`), bỏ `operator`.
- [ ] `composables/useCheckout.ts`: gửi header `X-Project-Code` thay `X-Project-Id` + `X-Operator-Id`.

---

## 11. Checklist triển khai BE

### residential-management
- [ ] Migration `create_platform_projects_table` (central) + 2 partial unique index (raw SQL).
- [ ] Migration backfill (loop tenant, audit trùng, insert).
- [ ] Model `PlatformProject` (SoftDeletes, connection central).
- [ ] `ProjectRegistrar` service (dual-write atomic + map unique violation → BusinessException) + `Project` model Observer (created/updated/deleted/restored).
- [ ] Bọc transaction cho `TenantProjectExternalService::createProject`.
- [ ] Phủ observer/registrar cho seeder + E2E setup command.
- [ ] (Tuỳ chọn ranh giới module) interface `ProjectRegistryExternalServiceInterface` (Platform sở hữu) cho PMC gọi — hoặc giữ trong PMC nếu coi registry thuộc PMC. **Chốt khi code.**
- [ ] Test: tạo trùng code cross-tenant → 422 + rollback (không tạo dự án); tạo hợp lệ → có dòng registry; rename code → registry update; soft-delete → registry giải phóng code; backfill idempotent.
- [ ] `make format` → `make lint` → chạy test liên quan.

### resi_mart
- [ ] `resolveProjectByCode` ở `PartnerLookupService` + test (đọc `platform_projects`, validate `partner_project`).
- [ ] `CheckoutService` + `OrderService` ghi `tenant_id` + `project_id` từ resolve theo `code`.
- [ ] `OrderSeeder` ghi cặp (tenant_id, project_id).
- [ ] Migration backfill `orders.tenant_id`.
- [ ] FE storefront: `useProjectContext` + `useCheckout` chuyển sang `code` / `X-Project-Code`.
- [ ] Verify trên Postgres dev (cross-DB không test được trên sqlite harness).

> **Thứ tự deploy:** (1) residential-management migration `platform_projects` + backfill + gateway → (2) resi_mart resolver + checkout + backfill orders → (3) FE storefront resi_mart + FE console residential-management.
