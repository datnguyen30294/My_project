# Dự án trên nền tảng - Đặc tả kỹ thuật Backend

> Module: `Platform/Tenant` (console + cấu hình phí) + `PMC/Project` · `PMC/Order` · `PMC/OgTicket` · `PMC/ClosingPeriod` (owner dữ liệu, schema tenant) | Ngày tạo: 2026-06-15 | Trạng thái: Draft
> Nguồn: mockup `BA-TNP-SERVICES/.../platform/modules/quan-ly-van-hanh/du-an-tren-nen-tang/{index,[projectId]}.vue`.
> Liên quan: [`du-an-gan-tenant-be.md`](./du-an-gan-tenant-be.md) (list dự án read-only theo 1 tenant — bản này MỞ RỘNG thành console toàn nền tảng + cho phép tạo), [`tong-quan-kinh-doanh-tenant-be.md`](./tong-quan-kinh-doanh-tenant-be.md) (chart kinh doanh — tái dùng cho phạm vi dự án), [`platform-fee-per-order-be.md`](./platform-fee-per-order-be.md) (phí nền tảng/đơn — bản này THÊM lớp override theo dự án), [`danh-gia-cu-dan-tenant-be.md`](./danh-gia-cu-dan-tenant-be.md) (đánh giá cư dân — tái dùng, lọc theo dự án).

## 1. Tổng quan

Console phía **platform (TNP)** để quản trị **toàn bộ dự án trên nền tảng** — mỗi dự án gắn với một công ty vận hành (tenant). Gồm: bảng tổng hợp toàn nền tảng (cross-tenant), tạo dự án mới (gán vào tenant), trang chi tiết dự án (thông tin, biểu đồ kinh doanh, đơn hàng, đánh giá cư dân) và **cấu hình phí nền tảng riêng theo dự án**.

**Quyết định nền tảng (đã chốt với nghiệp vụ — 2026-06-15):**

| # | Vấn đề | Quyết định |
|---|--------|------------|
| 1 | Liệt kê dự án toàn nền tảng (dự án nằm trong schema riêng từng tenant — Stancl) | **Lặp qua từng tenant schema** (`$tenant->run()` cho mỗi Organization) rồi gộp + phân trang ở tầng Platform. KHÔNG dựng bảng registry central. |
| 2 | Tạo dự án từ platform | **Cho phép** — platform ghi project vào schema tenant đã chọn (đảo ngược ràng buộc read-only của spec `du-an-gan-tenant`). |
| 3 | Nguồn Đơn hàng / Phí ở trang chi tiết | **Đơn PMC nội bộ tenant** (`og_ticket → quote → order`); phí = `frozen_platform_fee`. KHÔNG dùng đơn marketplace resi_mart. |
| 4 | Tab Cấu hình | **Cấu hình phí nền tảng (hoa hồng platform) RIÊNG theo dự án** — kế thừa cấu hình mặc định của tenant (`tenant_configs`, tức trang `/platform/tenants/{id}?tab=config`) trừ khi override. |

**Phân biệt quan trọng — "hoa hồng/phí" nào:**

- **Phí nền tảng (platform fee)** = khoản TNP thu của tenant trên mỗi đơn PMC. Mặc định ở `tenant_configs` (central). Spec này thêm **lớp override theo dự án** (`project_fee_configs`). → là đối tượng của tab Cấu hình.
- ⚠️ KHÔNG nhầm với `PMC/Commission/ProjectCommissionConfig` (schema tenant) — đó là **hoa hồng nội bộ tenant** chia cho nhân sự/đối tác (party/dept rules), không liên quan phí platform.

**Khác biệt mô hình dữ liệu so với mockup:** mockup coi dự án là entity toàn cục + `OperatingCompany.projectIds[]`, nên có khái niệm "Chưa gán tenant". Trong thực tế **mỗi dự án sống trong đúng một schema tenant** → luôn thuộc đúng một tenant, **không có dự án "chưa gán"**. Stat "Chưa gán tenant" của mockup KHÔNG áp dụng (thay bằng "Ngừng cung cấp dịch vụ").

## 2. Entities

### 2.1 ProjectFeeConfig (MỚI — bảng duy nhất phải tạo)

**Bảng:** `project_fee_configs` (central DB) — `Platform/Tenant/Models/ProjectFeeConfig.php`. Lưu override phí nền tảng + cờ vận hành theo từng dự án của từng tenant. Vì `project_id` chỉ unique trong phạm vi một schema tenant, khoá nghiệp vụ là **cặp `(organization_id, project_id)`**.

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| Tenant (công ty VH) | `organization_id` | `unsignedBigInteger` | FK → `organizations` (central) | Tenant sở hữu dự án |
| Dự án | `project_id` | `unsignedBigInteger` | not null, **KHÔNG FK** (xuyên schema) | ID project trong schema tenant |
| Kế thừa cấu hình tenant | `inherit_default` | `boolean` | default `true` | `true` → dùng `tenant_configs`; `false` → dùng các trường dưới |
| Hình thức thu | `fee_mode` | `string(50)` | nullable, enum `TenantFeeMode` | Chỉ dùng khi `inherit_default = false` |
| Phí cố định / đơn | `fixed_fee_per_order` | `decimal(15,2)` | default 0 | Dùng cho `fixed_per_order`/`both` |
| Phí % / đơn | `percent_fee_per_order` | `decimal(5,2)` | default 0 | Dùng cho `percent_per_order`/`both` |
| Mức phí gói | `subscription_amount` | `decimal(15,2)` | default 0 | Chỉ ghi nhận; không sinh phí per-order |
| Chu kỳ gói | `subscription_cycle` | `string(50)` | nullable, enum `SubscriptionCycle` | monthly/yearly |
| Cung cấp dịch vụ | `platform_service_enabled` | `boolean` | default `true` | Platform có cung cấp dịch vụ cho dự án này |
| Ghi chú nội bộ | `notes` | `text` | nullable | Ghi chú đội vận hành platform |
| Người tạo | `created_by` | `unsignedBigInteger` | nullable | Auditable |
| Người cập nhật | `updated_by` | `unsignedBigInteger` | nullable | Auditable |
| Người xóa | `deleted_by` | `unsignedBigInteger` | nullable | Auditable |
| Ngày xóa | `deleted_at` | `timestamp` | nullable | SoftDeletes |

**Indexes:** unique **partial** `(organization_id, project_id) WHERE deleted_at IS NULL` (chuẩn soft-delete Postgres của dự án). Index `organization_id`.

> `ProjectFeeConfig` extend `BaseModel` (entity độc lập, central DB). Cast `fee_mode → TenantFeeMode`, `subscription_cycle → SubscriptionCycle`, các `decimal:2`, các cờ `boolean`.

### 2.2 Models đọc read-only (KHÔNG tạo/sửa — nằm trong schema tenant)

| Model | Bảng (schema tenant) | Field dùng | Vai trò |
|-------|----------------------|------------|---------|
| `PMC/Project` | `projects` | `id, code, name, address, status` (+ `demepro_id` nếu có) | List + chi tiết + tạo. **KHÔNG** lộ `bqt_bank_*`. |
| `PMC/Order` | `orders` | `code, total_amount, status, completed_at`, `quote_id` | Chart kinh doanh + tab đơn hàng. Lọc `completed`. |
| `PMC/Quote` | `quotes` | `og_ticket_id` | Cầu nối order → ticket. |
| `PMC/OgTicket` | `og_tickets` | `project_id`, `resident_rating*` | Liên kết đơn↔dự án + đánh giá cư dân. |
| `PMC/ClosingPeriodOrder` | `closing_period_orders` | `order_id`, `frozen_platform_fee` | Phí nền tảng đã đóng băng / đơn. |

**Đường liên kết đơn ↔ dự án:** `orders` KHÔNG có `project_id`. Truy theo `order → quote (quote_id) → og_ticket (og_ticket_id) → project_id`. Lọc đơn theo dự án: `Order::whereHas('quote.ogTicket', fn ($q) => $q->where('project_id', $projectId))`.

## 3. Enums

Không tạo enum mới. Tái dùng:

| Enum | Nguồn | Dùng cho |
|------|-------|----------|
| `ProjectStatus` (`managing`/`stopped`) | `PMC/Project/Enums/ProjectStatus` | Trạng thái dự án |
| `OrderStatus` (lọc `completed`) | `PMC/Order/Enums/OrderStatus` | Chart + đơn hàng |
| `TenantFeeMode` (`none`/`subscription`/`fixed_per_order`/`percent_per_order`/`both`) | `Platform/Tenant/Enums/TenantFeeMode` | Cấu hình phí override |
| `SubscriptionCycle` (`monthly`/`yearly`) | `Platform/Tenant/Enums/SubscriptionCycle` | Chu kỳ gói |

## 4. API Endpoints

Tất cả đặt trong `Platform/routes/external-api.php`, guard `auth:requester` (cạnh nhóm `tenants/{id}/...` hiện có).

| # | Action | Method | URL | Request Class |
|---|--------|--------|-----|---------------|
| 1 | List dự án toàn nền tảng | GET | `platform/projects` | `ListPlatformProjectRequest` |
| 2 | Tạo dự án (gán vào tenant) | POST | `tenants/{tenantId}/projects` | `CreatePlatformProjectRequest` |
| 3 | Chi tiết dự án | GET | `tenants/{tenantId}/projects/{projectId}` | — |
| 4 | Chart kinh doanh dự án | GET | `tenants/{tenantId}/projects/{projectId}/business-summary` | `ListProjectBusinessSummaryRequest` |
| 5 | Đơn hàng trên dự án | GET | `tenants/{tenantId}/projects/{projectId}/orders` | `ListProjectOrderRequest` |
| 6 | Đánh giá cư dân theo dự án | GET | `tenants/{tenantId}/projects/{projectId}/resident-ratings` | `ListProjectResidentRatingRequest` |
| 7 | Lấy cấu hình phí dự án | GET | `tenants/{tenantId}/projects/{projectId}/fee-config` | — |
| 8 | Cập nhật cấu hình phí dự án | PUT | `tenants/{tenantId}/projects/{projectId}/fee-config` | `UpdateProjectFeeConfigRequest` |

**Lý do tách route:** chỉ endpoint #1 gộp cross-tenant; mọi endpoint còn lại scope theo `{tenantId}` (vì `projectId` chỉ unique trong schema tenant — không định danh toàn cục). `{tenantId}` → `OrganizationService::findById` (404 nếu không có). `{projectId}` không tồn tại trong schema tenant → **404**.

> Cân nhắc khi code: có thể gom #3–#8 vào một `PlatformProjectController` (theo `projectId`) + một `ListPlatformProjectController` riêng cho #1, hoặc dồn vào `PlatformProjectController` với action tách bạch. Ưu tiên khớp sibling `TenantResidentRatingController`/`TenantBusinessSummaryController` (controller mảnh, một mục đích).

## 5. Validation Rules

### 5.1 `ListPlatformProjectRequest` (#1)

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `search` | `nullable`, `string`, `max:255` | |
| `status` | `nullable`, `Rule::in(ProjectStatus::values())` | Trạng thái dự án không hợp lệ |
| `organization_id` | `nullable`, `integer`, `Rule::exists('organizations','id')` | Công ty vận hành không tồn tại |
| `platform_service_enabled` | `nullable`, `boolean` | |
| `sort_by` | `nullable`, `Rule::in(['name','code','status'])` | |
| `sort_direction` | `nullable`, `Rule::in(['asc','desc'])` | |
| `per_page` | `nullable`, `integer`, `min:1`, `max:100` | |

### 5.2 `CreatePlatformProjectRequest` (#2)

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `code` | `required`, `string`, `max:50` | Mã dự án không được để trống |
| `name` | `required`, `string`, `max:255` | Tên dự án không được để trống |
| `address` | `nullable`, `string`, `max:255` | |
| `status` | `nullable`, `Rule::in(ProjectStatus::values())` | (mặc định `managing`) |

> `code` unique **trong schema tenant** → KHÔNG dùng `Rule::exists`/`unique` central; kiểm tra trùng mã thực hiện trong `$tenant->run()` ở Service (xem Business Rules), trả 422 nếu trùng.

### 5.3 `ListProjectBusinessSummaryRequest` (#4)

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `months` | `nullable`, `integer`, `min:1`, `max:12` | Số tháng phải từ 1 đến 12 |

Default `months = 6`.

### 5.4 `ListProjectOrderRequest` (#5)

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `search` | `nullable`, `string`, `max:255` | Tìm theo mã đơn |
| `status` | `nullable`, `Rule::in(OrderStatus::values())` | |
| `per_page` | `nullable`, `integer`, `min:1`, `max:100` | |

### 5.5 `ListProjectResidentRatingRequest` (#6)

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `rating` | `nullable`, `integer`, `min:1`, `max:5` | Điểm đánh giá từ 1 đến 5 |
| `per_page` | `nullable`, `integer`, `min:1`, `max:100` | |

### 5.6 `UpdateProjectFeeConfigRequest` (#8)

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `inherit_default` | `required`, `boolean` | |
| `fee_mode` | `required_if:inherit_default,false`, `Rule::in(TenantFeeMode::values())` | Hình thức thu phí không hợp lệ |
| `fixed_fee_per_order` | `nullable`, `numeric`, `min:0` | Phí cố định không hợp lệ |
| `percent_fee_per_order` | `nullable`, `numeric`, `min:0`, `max:100` | Phí % phải từ 0 đến 100 |
| `subscription_amount` | `nullable`, `numeric`, `min:0` | |
| `subscription_cycle` | `nullable`, `Rule::in(SubscriptionCycle::values())` | |
| `platform_service_enabled` | `required`, `boolean` | |
| `notes` | `nullable`, `string`, `max:1000` | |

## 6. Business Rules

**Listing (cross-tenant):**

- [ ] Gộp dự án bằng cách lặp **mọi Organization** (central) → mỗi tenant `$tenant->run()` đọc `projects` → gắn thông tin tenant (`organization_id`, code, name, `is_active`) + ghép `ProjectFeeConfig` (central) theo `(org_id, project_id)`.
- [ ] Lọc/sort/phân trang thực hiện **trong bộ nhớ** sau khi gộp (`LengthAwarePaginator` thủ công), vì dữ liệu đến từ nhiều schema. Mặc định sort `name` ASC.
- [ ] **Cảnh báo hiệu năng:** chi phí O(số tenant) lần switch schema/request. Chấp nhận ở quy mô hiện tại; `log()`/ghi chú nếu sau này cần chuyển sang bảng registry cache.
- [ ] KHÔNG lộ `bqt_bank_*` của project ở bất kỳ endpoint nào.
- [ ] Stats trang list: `total` (tổng dự án), `managing` (status=managing), `tenant_count` (số tenant có ≥1 dự án), `service_disabled` (số dự án `platform_service_enabled=false`). KHÔNG có "unassigned" (mọi dự án luôn thuộc 1 tenant).

**Tạo dự án:**

- [ ] Tạo trong `$tenant->run()` qua `ProjectRepository::create()`; chỉ set `code, name, address, status`. Các field BQT/khác để mặc định null.
- [ ] Trùng `code` trong schema tenant → **422** (kiểm tra trong `$tenant->run()` trước khi tạo).
- [ ] Tenant `is_active = false`: **không cho tạo** dự án mới (422/403) — nghiệp vụ platform; tenant đang vô hiệu thì không phát sinh dự án.
- [ ] Sau tạo: tạo sẵn `ProjectFeeConfig` mặc định (`inherit_default = true`, `platform_service_enabled = true`) cho `(org_id, project_id)`.

**Chi tiết / chart / đơn / đánh giá:**

- [ ] Chart kinh doanh dự án: tái dùng logic `tong-quan-kinh-doanh` nhưng **lọc thêm theo `project_id`** (qua `quote.ogTicket`). 3 chỉ số (doanh thu / số đơn / phí platform) đến từ cùng tập đơn `completed`, gom theo `completed_at`, lấp đủ N tháng = 0.
- [ ] Tab đơn hàng: liệt kê đơn PMC của dự án; mỗi đơn kèm `platform_fee = frozen_platform_fee` (0 nếu chưa vào kỳ chốt). Mặc định mới nhất trước.
- [ ] Đánh giá cư dân: tái dùng `TenantResidentRatingExternalService` + filter `project_id` (lọc `og_tickets.project_id`).
- [ ] Tất cả nhánh đọc đều **read-only** trong schema tenant.

**Cấu hình phí dự án:**

- [ ] `inherit_default = true` → bỏ qua các trường phí; phí dự án = `tenant_configs` của tenant.
- [ ] `inherit_default = false` → lưu `fee_mode` + rate tương ứng vào `project_fee_configs`.
- [ ] `platform_service_enabled` lưu độc lập với `inherit_default` (luôn áp dụng).
- [ ] Endpoint GET trả về **cả cấu hình hiệu lực** (đã resolve kế thừa) lẫn override thô để FE render đúng switch.
- [ ] **Áp dụng phí (mở rộng `platform-fee-per-order`):** khi tính & đóng băng `frozen_platform_fee` lúc thêm đơn vào kỳ / mở lại kỳ, policy hiệu lực resolve theo **dự án của đơn**: có override (`inherit_default=false`) → dùng override; ngược lại → `tenant_configs`. Xem §7.4.
- [ ] checkDelete: `ProjectFeeConfig` không có quan hệ con → không cần checkDelete. (Xoá dự án từ platform: ngoài phạm vi — spec này chỉ tạo, không xoá.)

## 7. Logic & Cross-Module (gợi ý triển khai)

### 7.1 List toàn nền tảng — `Platform/Tenant/Services/PlatformProjectService::list(array $filters)`

```php
$rows = [];
foreach ($this->organizationRepository->all() as $tenant) {           // Organization (central)
    $projects = $this->tenantProject->getProjectsForTenant($tenant);  // PMC ExternalService, mảng thuần
    $configs = $this->projectFeeConfigRepository->mapByProjectId($tenant->id); // central
    foreach ($projects as $p) {
        $cfg = $configs[$p['id']] ?? null;
        $rows[] = [...$p, 'organization_id' => $tenant->id, 'company_code' => $tenant->code,
                   'company_name' => $tenant->name, 'tenant_active' => $tenant->is_active,
                   'platform_service_enabled' => $cfg?->platform_service_enabled ?? true];
    }
}
// filter (search/status/organization_id/platform_service_enabled) → sort → paginate thủ công
```

> `getProjectsForTenant(Organization): array` là method MỚI (non-paginated) thêm vào `TenantProjectExternalServiceInterface` — phục vụ gộp. Method `listProjects()` (paginated) hiện có giữ nguyên cho trang chi tiết tenant.

### 7.2 Tạo dự án — PMC write ExternalService

`TenantProjectExternalServiceInterface::createProject(Organization $tenant, array $data): array`:

```php
return $tenant->run(function () use ($data): array {
    if (app(ProjectRepository::class)->existsByCode($data['code'])) {
        throw ValidationException::withMessages(['code' => 'Mã dự án đã tồn tại trong hệ thống.']);
    }
    $project = app(ProjectRepository::class)->create([
        'code' => $data['code'], 'name' => $data['name'],
        'address' => $data['address'] ?? null, 'status' => $data['status'] ?? ProjectStatus::Managing->value,
    ]);
    return ['id' => (int) $project->id, 'code' => $project->code, /* ... */];
});
```

> Cập nhật docblock interface (`du-an-gan-tenant` ghi "read-only tuyệt đối") — nay platform được tạo dự án. Giữ KHÔNG lộ field BQT ở output.

### 7.3 Chart / đơn / đánh giá theo dự án (PMC ExternalServices)

- `TenantBusinessSummaryExternalService::getMonthlyBusinessSummary(Organization $tenant, int $months, ?int $projectId = null)` — thêm tham số `$projectId`; khi có thì `->whereHas('quote.ogTicket', fn ($q) => $q->where('project_id', $projectId))` trên query `Order` (và query phí). Tương thích ngược (mặc định null = toàn tenant).
- `TenantProjectOrderExternalServiceInterface::listProjectOrders(Organization, int $projectId, array $filters): LengthAwarePaginator` — đơn PMC của dự án + `frozen_platform_fee` (eager `closingPeriodOrder`).
- `TenantResidentRatingExternalService::getRatingsForTenant(Organization, array $filters)` — thêm xử lý `$filters['project_id']` (lọc `og_tickets.project_id`); summary tính trên tập đã lọc theo dự án.

### 7.4 Resolve phí theo dự án (mở rộng `platform-fee-per-order`)

`TenantConfigExternalServiceInterface` (Platform/Tenant, đã có `getFeePolicyForCurrentTenant()`) — thêm:

```php
/** Chính sách phí hiệu lực cho 1 dự án của tenant hiện tại: override dự án nếu có, ngược lại = mặc định tenant. */
public function getFeePolicyForProject(int $projectId): ?TenantFeePolicy;
```

Triển khai: lấy tenant hiện tại (central) → `ProjectFeeConfig` theo `(org_id, $projectId)`; nếu có và `inherit_default = false` → build `TenantFeePolicy` từ override; ngược lại → `getFeePolicyForCurrentTenant()`.

`PMC/ClosingPeriodService::addOrders()` & `reopen()`: thay `getFeePolicyForCurrentTenant()` bằng `getFeePolicyForProject($order->quote->ogTicket->project_id)` (eager load để tránh N+1). Đơn không truy ra `project_id` → fallback policy tenant mặc định.

## 8. Presenter Output

### 8.1 List `platform/projects` — `PlatformProjectListResource` (paginated)

```json
{
  "success": true,
  "data": [
    {
      "id": 12,
      "code": "DA-CC-A",
      "name": "Chung cư Alpha Tower",
      "address": "Số 1 Đại Cồ Việt, Hà Nội",
      "status": { "value": "managing", "label": "Đang quản lý" },
      "tenant": { "id": 3, "code": "VH-ALPHA", "name": "Vận hành Alpha", "is_active": true },
      "platform_service_enabled": true
    }
  ],
  "meta": { "current_page": 1, "per_page": 10, "total": 37 },
  "stats": { "total": 37, "managing": 30, "tenant_count": 8, "service_disabled": 2 }
}
```

> `stats` gắn vào `additional()` của resource collection (tính trên toàn tập trước phân trang).

### 8.2 Chi tiết `tenants/{t}/projects/{p}` — `PlatformProjectDetailResource`

```json
{
  "success": true,
  "data": {
    "id": 12, "code": "DA-CC-A", "name": "Chung cư Alpha Tower",
    "address": "Số 1 Đại Cồ Việt, Hà Nội",
    "status": { "value": "managing", "label": "Đang quản lý" },
    "tenant": { "id": 3, "code": "VH-ALPHA", "name": "Vận hành Alpha", "is_active": true, "domain": "alpha.tnp.app.vn" }
  }
}
```

### 8.3 Chart `.../business-summary` (như `tong-quan-kinh-doanh`, scope dự án)

```json
{ "success": true, "data": {
  "summary": { "tenant_revenue": 4200000000, "order_count": 215, "platform_revenue": 210000000 },
  "months": [ { "month": "2026-01", "label": "T1/2026", "order_count": 38, "tenant_revenue": 720000000, "platform_fee": 36200000 } ]
}}
```

### 8.4 Đơn hàng `.../orders` — `ProjectOrderResource` (paginated)

```json
{ "id": 501, "code": "DH-0501", "total_amount": "10000000.00",
  "status": { "value": "completed", "label": "Hoàn thành" },
  "platform_fee": "50000.00", "completed_at": "2026-04-12T09:00:00+07:00" }
```

### 8.5 Cấu hình `.../fee-config` — `ProjectFeeConfigResource`

```json
{ "success": true, "data": {
  "inherit_default": false,
  "platform_service_enabled": true,
  "notes": "Dự án flagship",
  "override": { "fee_mode": { "value": "percent_per_order", "label": "Thu theo % đơn hàng" },
                "fixed_fee_per_order": "0.00", "percent_fee_per_order": "0.50",
                "subscription_amount": "0.00", "subscription_cycle": null },
  "effective": { "fee_mode": { "value": "percent_per_order", "label": "Thu theo % đơn hàng" },
                 "fixed_fee_per_order": "0.00", "percent_fee_per_order": "0.50" },
  "tenant_default": { "fee_mode": { "value": "fixed_per_order", "label": "Thu cố định mỗi đơn" },
                      "fixed_fee_per_order": "20000.00", "percent_fee_per_order": "0.00" }
}}
```

> Enum fields: `{ "value": "...", "label": "..." }`. Số tiền giữ chuỗi decimal (không format BE) ở resource; chart trả số nguyên đồng (giống `tong-quan-kinh-doanh`). Không thêm `created_at` trừ khi cần.

## 9. Cross-Module Dependencies (ExternalService)

| Dependency | Module nguồn (owner) | Interface | Method |
|-----------|---------------------|-----------|--------|
| List/Find/Create project (schema tenant) | PMC/Project | `TenantProjectExternalServiceInterface` | `getProjectsForTenant()` (mới), `findProject()` (mới), `createProject()` (mới — GHI), `listProjects()` (đã có) |
| Chart kinh doanh theo dự án | PMC/Order | `TenantBusinessSummaryExternalServiceInterface` | `getMonthlyBusinessSummary(..., ?int $projectId)` (mở rộng) |
| Đơn hàng theo dự án | PMC/Order | `TenantProjectOrderExternalServiceInterface` (mới) | `listProjectOrders(Organization, int $projectId, array)` |
| Đánh giá cư dân theo dự án | PMC/OgTicket | `TenantResidentRatingExternalServiceInterface` | `getRatingsForTenant(..., ['project_id' => $p])` (mở rộng) |
| Phí hiệu lực theo dự án (cho closing period) | Platform/Tenant | `TenantConfigExternalServiceInterface` | `getFeePolicyForProject(int $projectId)` (mới) — PMC/ClosingPeriod tiêu thụ |
| Tìm tenant | Platform/Tenant | `OrganizationServiceInterface::findById($id)` | (đã có) |

> Quan hệ top-level ↔ top-level (Platform ↔ PMC) — đúng scope ExternalService. PMC tự `$tenant->run()` vào schema tenant. KHÔNG FK xuyên schema; `project_fee_configs.project_id` không có FK.

## 10. Migration Preview

```php
Schema::create('project_fee_configs', function (Blueprint $table) {
    $table->id();
    $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
    $table->unsignedBigInteger('project_id'); // ID project trong schema tenant — KHÔNG FK
    $table->boolean('inherit_default')->default(true);
    $table->string('fee_mode', 50)->nullable();
    $table->decimal('fixed_fee_per_order', 15, 2)->default(0);
    $table->decimal('percent_fee_per_order', 5, 2)->default(0);
    $table->decimal('subscription_amount', 15, 2)->default(0);
    $table->string('subscription_cycle', 50)->nullable();
    $table->boolean('platform_service_enabled')->default(true);
    $table->text('notes')->nullable();
    $table->unsignedBigInteger('created_by')->nullable();
    $table->unsignedBigInteger('updated_by')->nullable();
    $table->unsignedBigInteger('deleted_by')->nullable();
    $table->timestamps();
    $table->softDeletes();
    $table->index('organization_id');
});

// Partial unique cho soft-delete (Postgres) — migration riêng/raw:
// CREATE UNIQUE INDEX project_fee_configs_org_project_unique
//   ON project_fee_configs (organization_id, project_id) WHERE deleted_at IS NULL;
```

> Đây là migration **central DB** (không phải tenant). Không có bảng/cột mới trong schema tenant — mọi dữ liệu tenant đọc read-only từ bảng đã tồn tại. (Việc mở rộng `closing_period_orders` đã thuộc spec `platform-fee-per-order`.)

## 11. Checklist triển khai BE

- [ ] Migration `project_fee_configs` (central) + partial unique index
- [ ] `ProjectFeeConfig` model (BaseModel) + casts + Repository (`mapByProjectId`, `firstOrCreateForProject`) + Factory/Seeder
- [ ] `Platform/Tenant/Services/PlatformProjectService` (list cross-tenant gộp + stats + paginate thủ công; create; detail; fee-config get/update)
- [ ] Mở rộng `TenantProjectExternalServiceInterface` (PMC): `getProjectsForTenant`, `findProject`, `createProject` + cập nhật docblock read-only
- [ ] `TenantProjectOrderExternalService(Interface)` (PMC/Order) — đơn theo dự án + `frozen_platform_fee`
- [ ] Mở rộng `TenantBusinessSummaryExternalService` (tham số `?int $projectId`) + `TenantResidentRatingExternalService` (filter `project_id`)
- [ ] Mở rộng `TenantConfigExternalServiceInterface::getFeePolicyForProject()` + hook vào `ClosingPeriodService::addOrders()`/`reopen()` (cross-ref `platform-fee-per-order`)
- [ ] Binding tất cả interface mới trong `PMCServiceProvider` / `PlatformServiceProvider`
- [ ] Requests (§5), Resources (§8), Controllers, Routes (`external-api.php`, guard `auth:requester`)
- [ ] Tests (Platform feature, SQLite `:memory:`): list gộp đúng nhiều tenant + stats + filter/sort/paginate; tạo dự án (trùng mã 422, tenant inactive chặn); chart scope đúng dự án; đơn kèm phí; đánh giá lọc theo dự án; fee-config inherit vs override + effective; phí đóng băng dùng override dự án khi reopen; 404 tenant/project; không lộ field BQT
- [ ] `make format` → `make lint` → chạy test liên quan; cập nhật `api.json`
