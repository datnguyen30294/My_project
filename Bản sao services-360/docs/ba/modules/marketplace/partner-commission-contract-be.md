# Hợp đồng hoa hồng Vendor (Partner Commission Contract) — Đặc tả kỹ thuật Backend

> Module: `Marketplace/PartnerCommissionContract` | Ngày tạo: 2026-05-26 | Trạng thái: Draft

## 1. Tổng quan

Tính năng quản lý **hợp đồng hoa hồng** (commission contract) cho vendor (Partner) trong marketplace. Mỗi (Partner × Tenant × Project) cần có 1 hợp đồng `active` để vendor được phép nhận đơn. Hợp đồng có 3 mode:

- **per_order** — Chiết khấu mỗi đơn (% và/hoặc tiền cứng)
- **revenue_share** — Theo tổng doanh thu kỳ, hỗ trợ chia tier theo GMV
- **subscription** — Phí thuê bao cố định theo chu kỳ (tháng/quý/năm)

### Nguyên tắc cốt lõi

1. **Bất biến tài chính** — Khi hợp đồng đã `pending`/`active`, KHÔNG được sửa các field liên quan tới tiền (mode, percent, fixed, tiers, subscription amount). Chỉ field non-financial (`contract_code`, `notes`) sửa được khi `pending`.
2. **Snapshot per order** — Mỗi order tham chiếu `commission_contract_id` cố định lúc tạo. Sửa rule không ảnh hưởng đơn cũ.
3. **One active per scope** — Mỗi (partner × tenant × project) chỉ có tối đa 1 hợp đồng `active` tại 1 thời điểm.
4. **Multiple pending** — Cho phép tạo nhiều `pending` song song; quản lý chọn 1 khi switch.
5. **Lazy expiry** — Không cron job; trạng thái `expired` tính tại thời điểm đọc dựa vào `ends_at`.
6. **Không tái sử dụng terminal** — `replaced/cancelled/expired/revoked` là terminal vĩnh viễn.
7. **Quyền đối xứng giữa Platform & Tenant** — Cả 2 bên đều có **toàn quyền CRUD + sign + switch + revoke + cancel**. Khác biệt duy nhất là **phạm vi xem**: Platform thấy tất cả tenant, Tenant chỉ thấy contract có `tenant_id = current_tenant_id`. Trong cùng 1 contract, 2 bên có thể override quyết định của nhau (vd Platform revoke pending do Tenant tạo, hoặc ngược lại).

### Module placement

Đặt submodule mới `Marketplace/PartnerCommissionContract/` (song song với `Partner` và `PartnerProject`), KHÔNG nhét vào `Partner/` để giữ tách bạch và dễ scale.

```
backend/app/Modules/Marketplace/src/PartnerCommissionContract/
├── Contracts/
│   └── PartnerCommissionContractServiceInterface.php
├── Controllers/
│   ├── PartnerCommissionContractController.php          # Platform
│   └── TenantPartnerCommissionContractController.php    # Tenant
├── Enums/
│   ├── CommissionMode.php
│   ├── ContractStatus.php
│   └── SubscriptionCycle.php
├── Exceptions/
│   ├── ContractImmutableException.php
│   └── InvalidContractTransitionException.php
├── Http/
│   └── Middleware/
│       └── EnsureVendorHasActiveContract.php            # Optional
├── Models/
│   └── PartnerCommissionContract.php
├── Repositories/
│   └── PartnerCommissionContractRepository.php
├── Requests/
│   ├── CreateContractDraftRequest.php
│   ├── UpdateContractDraftRequest.php
│   ├── UpdateContractPendingRequest.php
│   ├── ListContractRequest.php
│   ├── SignContractRequest.php
│   ├── SwitchContractRequest.php
│   └── CancelContractRequest.php
├── Resources/
│   ├── ContractListResource.php
│   └── ContractDetailResource.php
└── Services/
    └── PartnerCommissionContractService.php
```

## 2. Entities

### 2.1 PartnerCommissionContract

**Bảng:** `partner_commission_contracts` (CENTRAL DB — schema `public`, connection `central`)

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| Mã hợp đồng | `contract_code` | `string(50)` | unique (partial, where deleted_at IS NULL) | Auto-gen: `HD-YYYY-NNNN` |
| Partner | `partner_id` | `unsignedBigInteger` | FK `partners.id`, cascade delete | Vendor |
| Tenant slug | `tenant_id` | `string(100)` | Index | Khớp `tenants.id` (string slug) |
| Project | `project_id` | `unsignedBigInteger` | Index | PK project trong tenant DB, KHÔNG cross-DB FK |
| Mode | `commission_mode` | `string(30)` | enum `CommissionMode` | per_order/revenue_share/subscription |
| Điều khoản | `terms` | `jsonb` | NOT NULL | Snapshot rule, schema theo mode |
| Trạng thái | `status` | `string(20)` | enum `ContractStatus`, default `draft` | 7 trạng thái |
| Bắt đầu | `starts_at` | `timestamp` | nullable | Hiệu lực từ |
| Kết thúc | `ends_at` | `timestamp` | nullable | Hết hạn (lazy expiry) |
| Kích hoạt lúc | `activated_at` | `timestamp` | nullable | Khi switch về active |
| Bị thay thế lúc | `replaced_at` | `timestamp` | nullable | Khi bị contract khác switch vào |
| Bị thay bằng | `replaced_by_contract_id` | `unsignedBigInteger` | nullable, self FK | Contract đã thay thế nó |
| Huỷ lúc | `cancelled_at` | `timestamp` | nullable | |
| Người huỷ | `cancelled_by` | `unsignedBigInteger` | nullable | |
| Lý do huỷ | `cancellation_reason` | `text` | nullable | |
| Ký lúc | `signed_at` | `timestamp` | nullable | draft → pending |
| Người ký | `signed_by` | `unsignedBigInteger` | nullable | |
| Ghi chú | `notes` | `text` | nullable | Sửa được ở pending |
| Nguồn tạo | `created_scope` | `string(20)` | enum `ContractCreatedScope`, default `platform` | platform/tenant — chỉ audit & hiển thị, KHÔNG ảnh hưởng quyền |
| Người tạo | `created_by` | `unsignedBigInteger` | nullable | Auditable |
| Người cập nhật | `updated_by` | `unsignedBigInteger` | nullable | Auditable |
| Người xóa | `deleted_by` | `unsignedBigInteger` | nullable | Auditable |
| Ngày xóa | `deleted_at` | `timestamp` | nullable | SoftDeletes |
| timestamps | `created_at`, `updated_at` | `timestamp` | | |

**Schema `terms` (jsonb) theo mode:**

```jsonc
// per_order
{
  "percent": 10.00,                  // decimal 0..100, nullable nếu chỉ dùng fixed
  "fixed": 50000.00                  // tiền cứng/đơn, nullable nếu chỉ dùng percent
}

// revenue_share
{
  "billing_period": "monthly",       // monthly | quarterly
  "tiers": [
    { "min_gmv": 0,         "max_gmv": 10000000,  "percent": 15.00 },
    { "min_gmv": 10000000,  "max_gmv": 50000000,  "percent": 12.00 },
    { "min_gmv": 50000000,  "max_gmv": null,      "percent": 10.00 }
  ]
}

// subscription
{
  "amount": 500000.00,
  "cycle": "monthly"                 // monthly | quarterly | yearly
}
```

### 2.2 Indexes & Constraints

```sql
-- Partial unique: tối đa 1 active per (partner, tenant, project)
CREATE UNIQUE INDEX partner_commission_contracts_active_unique
  ON partner_commission_contracts (partner_id, tenant_id, project_id)
  WHERE status = 'active' AND deleted_at IS NULL;

-- Unique contract_code
CREATE UNIQUE INDEX partner_commission_contracts_code_unique
  ON partner_commission_contracts (contract_code)
  WHERE deleted_at IS NULL;

-- Composite index cho list filter
CREATE INDEX partner_commission_contracts_partner_status_idx
  ON partner_commission_contracts (partner_id, status);

CREATE INDEX partner_commission_contracts_scope_idx
  ON partner_commission_contracts (partner_id, tenant_id, project_id);
```

### 2.3 Order snapshot (PMC tenant DB)

**Bảng `orders`** — thêm cột:

| Field | Column | Type | Mô tả |
|-------|--------|------|-------|
| Contract hoa hồng | `partner_commission_contract_id` | `unsignedBigInteger` nullable | Snapshot lúc tạo đơn. **KHÔNG FK** (cross-DB) |
| Partner | `partner_id` | `unsignedBigInteger` nullable | Snapshot. **KHÔNG FK** |

Lý do snapshot mà không lưu lại terms:
- Contract ở central là **bất biến** → tham chiếu `id` là đủ
- Khi cần báo cáo, query central qua ExternalService

### 2.4 Relationships

```php
// PartnerCommissionContract
public function partner(): BelongsTo                         // → Partner
public function replacedBy(): BelongsTo                      // → self
public function replaces(): HasMany                          // ← self (các contract trước đó nó đã replace)

// Partner (thêm)
public function commissionContracts(): HasMany               // → PartnerCommissionContract
public function activeCommissionContracts(): HasMany         // scope active
```

## 3. Enums

### 3.1 CommissionMode

| Key | Value | Label (VI) | Mô tả |
|-----|-------|------------|-------|
| PerOrder | `per_order` | Chiết khấu mỗi đơn | % hoặc tiền cứng/đơn |
| RevenueShare | `revenue_share` | Chia doanh thu | Theo GMV kỳ, có tier |
| Subscription | `subscription` | Thuê bao | Phí cố định/chu kỳ |

### 3.2 ContractStatus

| Key | Value | Label (VI) | Terminal | Mô tả |
|-----|-------|------------|----------|-------|
| Draft | `draft` | Nháp | Không | Đang soạn, sửa toàn bộ |
| Pending | `pending` | Chờ kích hoạt | Không | Đã ký, sửa được non-financial |
| Active | `active` | Đang hiệu lực | Không | Đang gắn vào vendor |
| Replaced | `replaced` | Đã bị thay thế | **Có** | Bị contract khác switch vào |
| Cancelled | `cancelled` | Đã huỷ | **Có** | Huỷ chủ động |
| Expired | `expired` | Đã hết hạn | **Có** | Quá `ends_at` |
| Revoked | `revoked` | Đã thu hồi | **Có** | Pending bị revoke trước switch |

Method bổ sung:
- `isTerminal(): bool` — true nếu thuộc 4 terminal
- `isEditable(): bool` — true chỉ với `draft`
- `isNonFinancialEditable(): bool` — true với `draft` và `pending`
- `canTransitionTo(self $target): bool` — kiểm transition hợp lệ
- `label()`, `color()` (cho UI badge)

### 3.3 SubscriptionCycle

| Key | Value | Label (VI) |
|-----|-------|------------|
| Monthly | `monthly` | Hàng tháng |
| Quarterly | `quarterly` | Hàng quý |
| Yearly | `yearly` | Hàng năm |

### 3.4 BillingPeriod (cho revenue_share)

| Key | Value | Label (VI) |
|-----|-------|------------|
| Monthly | `monthly` | Hàng tháng |
| Quarterly | `quarterly` | Hàng quý |

### 3.5 ContractCreatedScope

| Key | Value | Label (VI) | Mô tả |
|-----|-------|------------|-------|
| Platform | `platform` | Platform | Tạo từ platform admin |
| Tenant | `tenant` | Đơn vị quản lý | Tạo từ tenant manager (PMC) |

> Field này chỉ để **audit + hiển thị badge trong UI**, KHÔNG ảnh hưởng quyền chỉnh sửa. Cả 2 bên đều có thể sửa/ký/revoke/cancel bất kể `created_scope`.

## 4. API Endpoints

### 4.1 Platform side (admin central)

Prefix: `/api/v1/platform/partner-commission-contracts`
Guard: `auth:requester`

| Action | Method | URL | Request Class |
|--------|--------|-----|---------------|
| List | GET | `/` | `ListContractRequest` |
| Show | GET | `/{id}` | — |
| Create draft | POST | `/` | `CreateContractDraftRequest` |
| Update draft | PUT | `/{id}` | `UpdateContractDraftRequest` |
| Update pending (non-fin) | PATCH | `/{id}/notes` | `UpdateContractPendingRequest` |
| Discard draft | DELETE | `/{id}` | — |
| Sign (draft → pending) | POST | `/{id}/sign` | `SignContractRequest` |
| Revoke pending | POST | `/{id}/revoke` | — |
| Cancel active | POST | `/{id}/cancel` | `CancelContractRequest` |

### 4.2 Tenant side

Prefix: `/api/v1/pmc/partner-commission-contracts`
Guard: `auth:sanctum` + `tenant` + `tenant.vendor_enabled`

| Action | Method | URL | Request Class |
|--------|--------|-----|---------------|
| List (auto-filter `tenant_id = current`) | GET | `/` | `ListContractRequest` |
| Show | GET | `/{id}` | — |
| Create draft | POST | `/` | `CreateContractDraftRequest` |
| Update draft | PUT | `/{id}` | `UpdateContractDraftRequest` |
| Update pending (non-fin) | PATCH | `/{id}/notes` | `UpdateContractPendingRequest` |
| Discard draft | DELETE | `/{id}` | — |
| Sign (draft → pending) | POST | `/{id}/sign` | `SignContractRequest` |
| Revoke pending | POST | `/{id}/revoke` | — |
| Switch (activate pending) | POST | `/{id}/switch` | `SwitchContractRequest` |
| Cancel active | POST | `/{id}/cancel` | `CancelContractRequest` |
| Lịch sử cho (partner × project) | GET | `/history?partner_id=&project_id=` | — |

> Tenant side có **toàn bộ action** giống platform side. Khác biệt duy nhất:
> - **Auto-filter** `tenant_id = current_tenant_id` ở mọi query đọc
> - **Auto-set** `tenant_id = current_tenant_id` + `created_scope = 'tenant'` khi tạo nháp
> - **Forbid** thao tác lên contract có `tenant_id` khác (404 — không reveal sự tồn tại)
>
> Trong cùng 1 contract (cùng `tenant_id`), tenant manager có thể override quyết định của platform admin và ngược lại (vd revoke pending do bên kia tạo).

## 5. Validation Rules

### 5.1 CreateContractDraftRequest

| Field | Rules | Message (VI) |
|-------|-------|--------------|
| `partner_id` | required, integer, exists:partners,id | Vui lòng chọn vendor |
| `tenant_id` | required, string, max:100, exists:tenants,id | Vui lòng chọn tenant |
| `project_id` | required, integer, min:1 | Vui lòng chọn dự án |
| `commission_mode` | required, Rule::in(CommissionMode::values()) | Loại hợp đồng không hợp lệ |
| `starts_at` | required, date, after_or_equal:today | Ngày bắt đầu không hợp lệ |
| `ends_at` | nullable, date, after:starts_at | Ngày kết thúc phải sau ngày bắt đầu |
| `notes` | nullable, string, max:2000 | |
| `terms` | required, array | Thiếu điều khoản |

**Validate `terms` theo `commission_mode`** (custom rule `ContractTermsRule`):

```php
// per_order
terms.percent: nullable, decimal:0,2, min:0, max:100
terms.fixed:   nullable, decimal:0,2, min:0
// Phải có ít nhất 1 trong (percent, fixed)

// revenue_share
terms.billing_period: required, Rule::in(['monthly','quarterly'])
terms.tiers: required, array, min:1
terms.tiers.*.min_gmv: required, decimal, min:0
terms.tiers.*.max_gmv: nullable, decimal, gt:min_gmv
terms.tiers.*.percent: required, decimal, min:0, max:100
// Tiers không overlap, sorted by min_gmv

// subscription
terms.amount: required, decimal, min:0
terms.cycle:  required, Rule::in(SubscriptionCycle::values())
```

### 5.2 UpdateContractDraftRequest
Tất cả field giống Create (chỉ áp dụng khi `status = draft`).

### 5.3 UpdateContractPendingRequest

| Field | Rules |
|-------|-------|
| `contract_code` | nullable, string, max:50, unique partial |
| `notes` | nullable, string, max:2000 |

**Bị từ chối nếu user gửi bất kỳ field financial nào** (return 422).

### 5.4 SignContractRequest
Không có field — chỉ action. Service check `status === draft`.

### 5.5 SwitchContractRequest (tenant side)
Không có field bắt buộc. Service tự xử atomic.

### 5.6 CancelContractRequest

| Field | Rules |
|-------|-------|
| `cancellation_reason` | required, string, max:1000 |

### 5.7 ListContractRequest

| Field | Rules |
|-------|-------|
| `partner_id` | nullable, integer |
| `tenant_id` | nullable, string, max:100 |
| `project_id` | nullable, integer |
| `status` | nullable, Rule::in(ContractStatus::values()) |
| `commission_mode` | nullable, Rule::in(CommissionMode::values()) |
| `search` | nullable, string, max:255 | (search theo contract_code) |
| `page`, `per_page` | nullable, integer | Pagination chuẩn |

## 6. Business Rules

### 6.1 Tạo & sửa

- [ ] Tạo contract luôn ở trạng thái `draft`
- [ ] Draft sửa được toàn bộ field (kể cả `commission_mode`, `terms`)
- [ ] Pending chỉ sửa được `contract_code`, `notes` — gửi field tài chính → throw `ContractImmutableException` (422)
- [ ] `contract_code` auto-gen format `HD-YYYY-NNNN` (NNNN reset theo năm), user override được khi vẫn ở draft/pending
- [ ] Khi tạo, validate `ends_at > starts_at` nếu cùng có

### 6.2 State machine

- [ ] Mọi transition đi qua `PartnerCommissionContractService` (không cho update raw status)
- [ ] `draft → pending` (sign): set `signed_at`, `signed_by`
- [ ] `draft → discarded`: hard delete (chưa pending nên không có ràng buộc audit)
- [ ] `pending → active` (switch — tenant side): atomic + auto-replace active cũ (nếu có)
- [ ] `pending → revoked`: set `cancelled_at` (dùng chung cột), `cancellation_reason`
- [ ] `active → cancelled`: set `cancelled_at`, `cancelled_by`, `cancellation_reason`
- [ ] `active → replaced`: set `replaced_at`, `replaced_by_contract_id` (auto khi switch contract khác)
- [ ] Terminal states không transition tiếp được → throw `InvalidContractTransitionException`

### 6.3 Switch contract (atomic)

```php
DB::connection('central')->transaction(function () use ($pending, $partner, $project) {
    $currentActive = $this->repository->findActiveFor($pending->partner_id, $pending->tenant_id, $pending->project_id);

    if ($currentActive) {
        $currentActive->update([
            'status'                   => ContractStatus::Replaced,
            'replaced_at'              => now(),
            'replaced_by_contract_id'  => $pending->id,
        ]);
    }

    $pending->update([
        'status'        => ContractStatus::Active,
        'activated_at'  => now(),
    ]);
});
```

- [ ] Pre-check: pending phải có status = `pending` (lazy check expired trước)
- [ ] Pre-check: `starts_at <= now()` (không activate sớm) — hoặc cho phép nếu user xác nhận
- [ ] Khi switch, các pending khác **giữ nguyên** trạng thái `pending`

### 6.4 Lazy expiry

```php
// Model
public function getCurrentStatus(): ContractStatus
{
    if ($this->status->isTerminal()) {
        return $this->status;
    }

    if ($this->ends_at && now()->gt($this->ends_at)) {
        return ContractStatus::Expired;
    }

    return $this->status;
}
```

- [ ] Resource layer (`ContractListResource`, `ContractDetailResource`) gọi `getCurrentStatus()` thay vì raw `status`
- [ ] Service layer dùng `getCurrentStatus()` ở mọi guard check
- [ ] **Optional**: thêm method `Repository::persistExpiredStatuses()` để có thể chạy thủ công lúc cần dọn dẹp DB — KHÔNG schedule

### 6.5 Khoảng trống không có active

- [ ] Service `getActiveContractFor(partner_id, tenant_id, project_id): ?Contract` — duy nhất nguồn truth
- [ ] Order create flow (PMC) gọi qua ExternalService → nếu null → reject đơn với message "Vendor chưa có hợp đồng hoa hồng đang hiệu lực"
- [ ] Optional middleware `EnsureVendorHasActiveContract` cho các route nhận đơn vendor

### 6.6 Subscription cancellation

- [ ] Huỷ giữa kỳ → `immediate`, không hoàn tiền
- [ ] Không có logic pro-rate — đã đóng kỳ này thì mất, kỳ tiếp theo không sinh invoice nữa
- [ ] Quyết định ở mức quản lý (UI confirm dialog rõ ràng)

### 6.7 Delete behavior (checkDelete)

| Entity | Khi nào KHÔNG cho xoá | Lý do |
|--------|----------------------|-------|
| Partner | Có contract `active` hoặc `pending` | Sẽ mồ côi contract đang phát sinh đơn |
| Partner | Có contract terminal + đơn đã snapshot `partner_commission_contract_id` | Cần audit history |
| Contract (draft) | — | Được discard tự do |
| Contract (pending) | — | Được revoke (terminal) — không hard delete |
| Contract (active/terminal) | Luôn cấm hard delete | Soft delete + audit |
| PartnerProject | Có contract active/pending trên cặp đó | Sẽ mất link |

→ Bổ sung method `Partner::checkDelete()` query cross-DB count contracts.
→ Bổ sung method `PartnerProject::checkDelete()` tương tự.

### 6.8 Permission (sketch — chi tiết tuỳ permission module hiện có)

Cả 2 bên (Platform & Tenant) có **bộ permission đối xứng**. Khác biệt nằm ở scope (Platform = all tenants, Tenant = own tenant) — enforce ở controller/service, không phải permission name.

| Hành động | Quyền (dùng chung 2 side) |
|-----------|---------------------------|
| Xem | `marketplace.commission_contract.view` |
| Tạo / sửa nháp / xoá nháp | `marketplace.commission_contract.manage` |
| Ký (sign) | `marketplace.commission_contract.sign` |
| Thu hồi pending | `marketplace.commission_contract.revoke` |
| Switch (kích hoạt pending) | `marketplace.commission_contract.switch` |
| Huỷ active | `marketplace.commission_contract.cancel` |

**Scope enforcement** (service-level, KHÔNG dùng permission để giới hạn):
- Tenant controller inject `current_tenant_id` từ context → mọi query/write tự động filter theo
- Platform controller không filter theo tenant
- 1 user nếu có quyền ở cả 2 side (platform admin kiêm tenant user) → vẫn dùng controller tương ứng để có scope đúng

## 7. Presenter Output

### 7.1 ContractListResource

```json
{
  "id": 1,
  "contract_code": "HD-2026-0001",
  "partner": {
    "id": 12,
    "name": "Vendor ABC",
    "slug": "vendor-abc"
  },
  "tenant_id": "hoaqua",
  "project_id": 3,
  "commission_mode": { "value": "per_order", "label": "Chiết khấu mỗi đơn" },
  "status":          { "value": "active",    "label": "Đang hiệu lực", "color": "green" },
  "starts_at": "2026-05-26T00:00:00+07:00",
  "ends_at":   "2027-05-26T00:00:00+07:00",
  "activated_at": "2026-05-26T10:00:00+07:00",
  "signed_at":    "2026-05-25T15:00:00+07:00"
}
```

### 7.2 ContractDetailResource

```json
{
  "id": 1,
  "contract_code": "HD-2026-0001",
  "partner":  { "id": 12, "name": "Vendor ABC", "slug": "vendor-abc" },
  "tenant_id": "hoaqua",
  "project_id": 3,
  "commission_mode": { "value": "per_order", "label": "Chiết khấu mỗi đơn" },
  "status":          { "value": "active",    "label": "Đang hiệu lực", "color": "green" },
  "terms": {
    "percent": 10.00,
    "fixed":   50000.00
  },
  "starts_at": "2026-05-26T00:00:00+07:00",
  "ends_at":   "2027-05-26T00:00:00+07:00",
  "activated_at": "2026-05-26T10:00:00+07:00",
  "replaced_at": null,
  "replaced_by_contract_id": null,
  "cancelled_at": null,
  "cancelled_by": null,
  "cancellation_reason": null,
  "signed_at":  "2026-05-25T15:00:00+07:00",
  "signed_by":  { "id": 5, "name": "Admin A" },
  "notes": "Hợp đồng pilot Q3",
  "created_by": { "id": 5, "name": "Admin A" },
  "created_at": "2026-05-25T14:00:00+07:00"
}
```

> Enum fields trả `{ value, label, color? }`. Field `created_at` cho detail (cần cho timeline UI); list không cần.

## 8. Cross-Module Dependencies (ExternalService)

| Dependency | Module nguồn | Interface | Method |
|-----------|-------------|-----------|--------|
| Partner | `Marketplace/Partner` | `PartnerExternalServiceInterface` | `getPartnerById($id)`, `partnerExists($id)` |
| Tenant | `Platform/Tenant` | (đã có) | `tenantExists($tenantId)` |
| Active contract lookup (cho PMC Order) | `Marketplace/PartnerCommissionContract` | `PartnerCommissionContractExternalServiceInterface` | `getActiveContractFor($partnerId, $tenantId, $projectId)` |

Tạo mới `PartnerCommissionContractExternalServiceInterface` để PMC module gọi vào lúc tạo đơn:

```php
namespace App\Modules\Marketplace\PartnerCommissionContract\ExternalServices;

interface PartnerCommissionContractExternalServiceInterface
{
    /** @return array{id:int, contract_code:string, commission_mode:string, terms:array}|null */
    public function getActiveContractFor(int $partnerId, string $tenantId, int $projectId): ?array;

    public function snapshotForOrder(int $contractId): array;
}
```

> Cross-module: PMC/Order gọi interface này (KHÔNG import Model trực tiếp). Submodules trong cùng `Marketplace` module thì import trực tiếp.

## 9. Migration Preview

### 9.1 Tạo bảng `partner_commission_contracts`

```php
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('partner_commission_contracts', function (Blueprint $table): void {
            $table->id();

            $table->string('contract_code', 50);
            $table->unsignedBigInteger('partner_id');
            $table->string('tenant_id', 100);
            $table->unsignedBigInteger('project_id');

            $table->string('commission_mode', 30);
            $table->jsonb('terms');

            $table->string('status', 20)->default('draft');

            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamp('activated_at')->nullable();

            $table->timestamp('replaced_at')->nullable();
            $table->unsignedBigInteger('replaced_by_contract_id')->nullable();

            $table->timestamp('cancelled_at')->nullable();
            $table->unsignedBigInteger('cancelled_by')->nullable();
            $table->text('cancellation_reason')->nullable();

            $table->timestamp('signed_at')->nullable();
            $table->unsignedBigInteger('signed_by')->nullable();

            $table->text('notes')->nullable();

            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('partner_id')
                ->references('id')->on('partners')
                ->cascadeOnDelete();

            $table->foreign('replaced_by_contract_id')
                ->references('id')->on('partner_commission_contracts')
                ->nullOnDelete();

            $table->index(['partner_id', 'status']);
            $table->index(['partner_id', 'tenant_id', 'project_id']);
            $table->index('status');
        });

        // Partial unique: 1 active per (partner, tenant, project)
        DB::statement("CREATE UNIQUE INDEX partner_commission_contracts_active_unique
            ON partner_commission_contracts (partner_id, tenant_id, project_id)
            WHERE status = 'active' AND deleted_at IS NULL");

        // Unique contract_code
        DB::statement("CREATE UNIQUE INDEX partner_commission_contracts_code_unique
            ON partner_commission_contracts (contract_code)
            WHERE deleted_at IS NULL");
    }

    public function down(): void
    {
        Schema::dropIfExists('partner_commission_contracts');
    }
};
```

### 9.2 Thêm cột vào `orders` (PMC tenant DB)

```php
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table): void {
            $table->unsignedBigInteger('partner_id')->nullable()->after('customer_id');
            $table->unsignedBigInteger('partner_commission_contract_id')->nullable()->after('partner_id');

            $table->index('partner_id');
            $table->index('partner_commission_contract_id');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table): void {
            $table->dropIndex(['partner_id']);
            $table->dropIndex(['partner_commission_contract_id']);
            $table->dropColumn(['partner_id', 'partner_commission_contract_id']);
        });
    }
};
```

> `partner_id` + `partner_commission_contract_id` ở orders là **snapshot** — KHÔNG FK (cross-DB).

## 10. Service contract (chính)

```php
interface PartnerCommissionContractServiceInterface
{
    // Listing — `$scopeTenantId = null` ở platform, = current tenant ở tenant side
    public function list(array $filters, ?string $scopeTenantId = null): LengthAwarePaginator;
    public function getDetail(int $id, ?string $scopeTenantId = null): PartnerCommissionContract;

    // Lifecycle — `$scopeTenantId` để enforce tenant chỉ thao tác trong tenant của mình
    public function createDraft(array $data, ContractCreatedScope $scope, int $actorId, ?string $scopeTenantId = null): PartnerCommissionContract;
    public function updateDraft(int $id, array $data, int $actorId, ?string $scopeTenantId = null): PartnerCommissionContract;
    public function updatePendingNotes(int $id, array $data, int $actorId, ?string $scopeTenantId = null): PartnerCommissionContract;
    public function discardDraft(int $id, int $actorId, ?string $scopeTenantId = null): void;
    public function sign(int $id, int $actorId, ?string $scopeTenantId = null): PartnerCommissionContract;
    public function revokePending(int $id, string $reason, int $actorId, ?string $scopeTenantId = null): PartnerCommissionContract;
    public function switchTo(int $pendingContractId, int $actorId, ?string $scopeTenantId = null): PartnerCommissionContract;
    public function cancelActive(int $id, string $reason, int $actorId, ?string $scopeTenantId = null): PartnerCommissionContract;

    // Lookups
    public function getActiveContractFor(int $partnerId, string $tenantId, int $projectId): ?PartnerCommissionContract;
    public function getHistoryFor(int $partnerId, string $tenantId, int $projectId): Collection;
}
```

**Implementation note:**
- Khi `$scopeTenantId !== null`, mọi method:
  - Đọc: thêm `where tenant_id = $scopeTenantId`
  - Ghi (update/sign/revoke/switch/cancel): pre-check `$contract->tenant_id === $scopeTenantId`, nếu sai → throw `ModelNotFoundException` (return 404, KHÔNG 403 để không leak existence)
  - Tạo: ép `$data['tenant_id'] = $scopeTenantId`, ignore giá trị FE gửi lên

**Quy ước:**
- Service KHÔNG gọi `Model::query()` trực tiếp → mọi query qua `PartnerCommissionContractRepository`
- Transition state CHỈ qua service method tương ứng (không cho update `status` raw)
- Switch dùng `DB::connection('central')->transaction(...)` đảm bảo atomic

## 11. Test scenarios (PHPUnit)

### 11.1 `PartnerCommissionContractTest`

**Create / Update / Discard draft:**
- `it creates a draft per_order contract with valid terms`
- `it creates a draft revenue_share contract with valid tiers`
- `it creates a draft subscription contract with valid cycle`
- `it rejects draft creation when terms.percent and terms.fixed both missing for per_order`
- `it rejects draft creation when tiers overlap in revenue_share`
- `it rejects draft creation when party_split does not sum to 100`
- `it updates draft fully when status is draft`
- `it discards draft (hard delete) when status is draft`
- `it forbids hard delete when status != draft`

**Pending lifecycle:**
- `it transitions draft to pending on sign`
- `it sets signed_at and signed_by on sign`
- `it allows updating notes and contract_code on pending`
- `it rejects updating commission_mode on pending`
- `it rejects updating terms on pending`
- `it transitions pending to revoked with reason`

**Active lifecycle:**
- `it switches a pending contract to active when no current active exists`
- `it atomically replaces current active when switching to a new pending`
- `it sets replaced_at and replaced_by_contract_id on the old active`
- `it sets activated_at on the new active`
- `it cancels active contract with reason`
- `it forbids switching from a non-pending contract`
- `it forbids switching to an already-active contract`

**Multi-pending:**
- `it allows multiple pending contracts for the same (partner, tenant, project)`
- `it preserves other pending contracts when one is switched to active`

**One active constraint:**
- `it enforces unique active constraint via partial index`

**Lazy expiry:**
- `it returns expired status when ends_at is past`
- `it does not auto-expire active in DB (lazy only)`
- `it treats expired-by-time pending as not switchable`

**Terminal:**
- `it forbids transitioning from replaced status`
- `it forbids transitioning from cancelled status`
- `it forbids transitioning from expired status`
- `it forbids transitioning from revoked status`

**Active lookup (for Order):**
- `it returns active contract for (partner, tenant, project)`
- `it returns null when no active contract exists`
- `it ignores expired active when looking up`

**Delete protection:**
- `it forbids deleting Partner with active commission contract`
- `it forbids deleting PartnerProject with active commission contract`

**Tenant scope isolation:**
- `it lists only contracts of current tenant when scoped`
- `it returns 404 when tenant fetches contract of other tenant`
- `it forbids updating contract of other tenant from tenant context`
- `it auto-sets tenant_id and created_scope=tenant when tenant creates draft`
- `it ignores tenant_id from FE payload in tenant context`
- `it allows platform to override (revoke) pending created by tenant`
- `it allows tenant to override (revoke) pending created by platform`

## 12. Checklist triển khai BE

- [ ] Migration `partner_commission_contracts` (central)
- [ ] Migration thêm `partner_id`, `partner_commission_contract_id` vào `orders` (tenant)
- [ ] Model `PartnerCommissionContract` (central connection)
- [ ] Enums: `CommissionMode`, `ContractStatus`, `SubscriptionCycle`, `BillingPeriod`, `ContractCreatedScope`
- [ ] Custom validation rule `ContractTermsRule` (validate `terms` theo mode)
- [ ] Repository `PartnerCommissionContractRepository extends BaseRepository`
- [ ] Service `PartnerCommissionContractService implements PartnerCommissionContractServiceInterface`
- [ ] Form Requests (7 cái) — danh sách ở Section 4
- [ ] Resources: `ContractListResource`, `ContractDetailResource`
- [ ] Controllers: `PartnerCommissionContractController` (platform), `TenantPartnerCommissionContractController`
- [ ] Routes: bổ sung `platform.php` và `tenant.php`
- [ ] ExternalService `PartnerCommissionContractExternalService` + Interface
- [ ] Đăng ký binding trong `MarketplaceServiceProvider`
- [ ] Factory `PartnerCommissionContractFactory` + Seeder dev (10 contract mỗi state)
- [ ] Test file `PartnerCommissionContractTest.php` (PHPUnit)
- [ ] PSR-4 mapping verify, `make format`, `make lint`
- [ ] API docs annotations (`@tags`, return shapes) cho scramble
