# Đơn hàng Vendor & Tính hoa hồng PMC — Đặc tả kỹ thuật Backend

> Module: `Marketplace/VendorOrder` | Ngày tạo: 2026-05-27 | Trạng thái: Draft

## 1. Tổng quan

Submodule cho phép PMC tenant manager xem danh sách + chi tiết các đơn hàng đã hoàn thành của 1 vendor, kèm số tiền hoa hồng PMC được tính theo hợp đồng `per_order` đang áp dụng tại thời điểm hoàn thành đơn.

### Đặc điểm cốt lõi

1. **Read-only cross-DB** — Đọc từ `resi_mart` database (cả central + tenant schemas). PMC **KHÔNG ghi** vào resi_mart.
2. **Chỉ đơn `completed`** — Bỏ qua mọi order khác status.
3. **Chỉ contract mode `per_order`** ở phase 1 — Orders thuộc project có contract `revenue_share` / `subscription` sẽ có view tháng riêng ở phase 2.
4. **Point-in-time contract lookup** — Tận dụng tính bất biến của contract: với `completed_at`, lookup contract đã `active` tại thời điểm đó. Không cần snapshot vào resi_mart orders.
5. **Auto-scope tenant** — PMC tenant chỉ thấy orders thuộc projects của tenant đó.

### Module placement

```
backend/app/Modules/Marketplace/src/VendorOrder/
├── Contracts/
│   └── VendorOrderServiceInterface.php
├── Controllers/
│   └── TenantVendorOrderController.php
├── Models/
│   ├── VendorOrder.php
│   ├── VendorOrderItem.php
│   └── VendorCustomer.php
├── Repositories/
│   └── VendorOrderRepository.php
├── Requests/
│   ├── ListVendorOrderRequest.php
│   └── ListVendorOrderSummaryRequest.php
├── Resources/
│   ├── VendorOrderListResource.php
│   ├── VendorOrderDetailResource.php
│   ├── VendorOrderItemResource.php
│   └── VendorOrderCommissionResource.php
├── Services/
│   ├── VendorOrderService.php
│   └── VendorOrderCommissionCalculator.php
├── Support/
│   └── ResiMartConnection.php
└── Exceptions/
    └── VendorTenantSchemaMissingException.php
```

## 2. Entities (Read-only — đọc từ resi_mart)

### 2.1 VendorOrder

**Bảng:** `orders` (trong schema `tenant_<vendor_slug>` ở resi_mart DB)
**Connection:** `resi_mart_tenant` (runtime SET search_path)

| Field | Column | Type | Mô tả |
|-------|--------|------|-------|
| ID | `id` | `bigInt` | PK |
| Mã đơn | `code` | `string(30)` | Unique |
| Project | `project_id` | `unsignedBigInt` | Cross-DB ref PMC tenant.projects.id |
| Khách hàng | `customer_id` | `bigInt` nullable | FK customers (trong cùng schema) |
| Trạng thái | `status` | `string(20)` | pending/confirmed/completed/cancelled |
| TT thanh toán | `payment_status` | `string(20)` | unpaid/paid/refunded |
| Phương thức TT | `payment_method` | `string(20)` nullable | |
| Người liên hệ | `contact_name` | `string(150)` nullable | Snapshot |
| SĐT | `contact_phone` | `string(30)` nullable | |
| Email | `contact_email` | `string(150)` nullable | |
| Mã căn hộ | `apartment_code` | `string(50)` nullable | |
| Địa chỉ ship | `shipping_address` | `string(500)` nullable | |
| Tạm tính | `subtotal` | `decimal(15,2)` | |
| Đặt cọc | `deposit_total` | `decimal(15,2)` | |
| Giảm giá | `discount_total` | `decimal(15,2)` | |
| Phí ship | `shipping_fee` | `decimal(15,2)` | |
| **Tổng** | `total` | `decimal(15,2)` | Dùng cho tính commission |
| Override | `total_overridden` | `bool` | Cờ giá điều chỉnh tay |
| Đặt lúc | `ordered_at` | `timestamp` nullable | |
| Xác nhận | `confirmed_at` | `timestamp` nullable | |
| **Hoàn thành** | `completed_at` | `timestamp` nullable | Dùng cho lookup contract point-in-time |
| Huỷ | `cancelled_at` | `timestamp` nullable | |
| Lý do huỷ | `cancel_reason` | `string(500)` nullable | |
| timestamps | `created_at`, `updated_at` | | |

### 2.2 VendorOrderItem

**Bảng:** `order_items`
**Connection:** `resi_mart_tenant`

| Field | Column | Type | Mô tả |
|---|---|---|---|
| ID | `id` | `bigInt` | PK |
| Order | `order_id` | `bigInt` | FK orders |
| Product | `product_id` | `unsignedBigInt` | Snapshot ref |
| Variant | `variant_id` | `unsignedBigInt` nullable | |
| Loại | `item_type` | `string(20)` | product/service |
| Tên SP | `product_name` | `string(255)` | Snapshot |
| Tên variant | `variant_name` | `string(255)` nullable | |
| SKU | `sku` | `string(100)` | |
| Ảnh | `cover_url` | `string(500)` nullable | |
| SL | `quantity` | `int` | |
| Đơn giá | `unit_price` | `decimal(15,2)` | |
| Giảm | `discount_amount` | `decimal(15,2)` | |
| Thành tiền | `subtotal` | `decimal(15,2)` | |
| Lịch service | `service_scheduled_at` | `timestamp` nullable | |
| Thời lượng | `service_duration_minutes` | `int` nullable | |
| Onsite | `service_is_onsite` | `bool` nullable | |
| Địa chỉ service | `service_address` | `string(500)` nullable | |

### 2.3 VendorCustomer

**Bảng:** `customers`
**Connection:** `resi_mart_tenant`

| Field | Column | Type | Mô tả |
|---|---|---|---|
| ID | `id` | `bigInt` | PK |
| Mã | `code` | `string(30)` | Unique |
| Họ tên | `full_name` | `string(255)` | |
| Email | `email` | `string(255)` nullable | |
| Phone | `phone` | `string(30)` nullable | |
| Avatar | `avatar_url` | `string(500)` nullable | |
| Resident ref | `resident_ref` | `string(100)` nullable | Sync `{tenant_code}:{resident_id}` từ PMC |

### 2.4 Relationships (Eloquent)

```php
// VendorOrder
public function items(): HasMany           // → VendorOrderItem
public function customer(): BelongsTo      // → VendorCustomer

// VendorOrderItem
public function order(): BelongsTo         // → VendorOrder

// VendorCustomer
public function orders(): HasMany          // → VendorOrder
```

> **Read-only models** — tất cả 3 model override `save()`, `delete()` để throw exception. Hoặc dùng trait `IsReadOnlyModel`.

## 3. Enums

### 3.1 VendorOrderStatus

| Key | Value | Label (VI) |
|-----|-------|-----------|
| Pending | `pending` | Chờ xử lý |
| Confirmed | `confirmed` | Đã xác nhận |
| Completed | `completed` | Hoàn thành |
| Cancelled | `cancelled` | Đã huỷ |

> Phase 1 chỉ filter `completed`, nhưng vẫn cần enum để map label/color.

### 3.2 VendorOrderPaymentStatus

| Key | Value | Label (VI) |
|-----|-------|-----------|
| Unpaid | `unpaid` | Chưa thanh toán |
| Paid | `paid` | Đã thanh toán |
| Refunded | `refunded` | Đã hoàn |

## 4. Cấu hình Database (CRITICAL — bước đầu tiên triển khai)

### 4.1 `backend/config/database.php`

Thêm 2 connection:

```php
'resi_mart_central' => [
    'driver' => 'pgsql',
    'host' => env('RESIMART_DB_HOST'),
    'port' => env('RESIMART_DB_PORT', '5432'),
    'database' => env('RESIMART_DB_DATABASE'),
    'username' => env('RESIMART_DB_USERNAME'),
    'password' => env('RESIMART_DB_PASSWORD'),
    'charset' => 'utf8',
    'prefix' => '',
    'prefix_indexes' => true,
    'search_path' => 'public',
    'sslmode' => env('RESIMART_DB_SSLMODE', 'prefer'),
],

'resi_mart_tenant' => [
    'driver' => 'pgsql',
    'host' => env('RESIMART_DB_HOST'),
    'port' => env('RESIMART_DB_PORT', '5432'),
    'database' => env('RESIMART_DB_DATABASE'),
    'username' => env('RESIMART_DB_USERNAME'),
    'password' => env('RESIMART_DB_PASSWORD'),
    'charset' => 'utf8',
    'prefix' => '',
    'prefix_indexes' => true,
    'search_path' => 'public', // Override runtime via SET search_path
    'sslmode' => env('RESIMART_DB_SSLMODE', 'prefer'),
],
```

### 4.2 `.env.example`

```env
RESIMART_DB_HOST=resi_mart_db
RESIMART_DB_PORT=5432
RESIMART_DB_DATABASE=resi_mart
RESIMART_DB_USERNAME=postgres
RESIMART_DB_PASSWORD=secret
RESIMART_DB_SSLMODE=prefer
```

### 4.3 `Marketplace/VendorOrder/Support/ResiMartConnection.php`

Helper switch schema:

```php
class ResiMartConnection
{
    public static function switchToTenant(string $tenantId): void
    {
        $schema = 'tenant_' . preg_replace('/[^a-z0-9_]/', '', $tenantId);
        DB::connection('resi_mart_tenant')->statement("SET search_path TO {$schema}");
    }

    public static function resetToPublic(): void
    {
        DB::connection('resi_mart_tenant')->statement('SET search_path TO public');
    }

    /**
     * Check schema exists trong resi_mart DB.
     */
    public static function schemaExists(string $tenantId): bool
    {
        $schema = 'tenant_' . preg_replace('/[^a-z0-9_]/', '', $tenantId);

        return DB::connection('resi_mart_central')
            ->table('information_schema.schemata')
            ->where('schema_name', $schema)
            ->exists();
    }
}
```

> Sanitize `tenant_id` để chống SQL injection (chỉ a-z0-9_).

## 5. API Endpoints

Prefix: `/api/v1/pmc/partners/{partnerId}/orders`
Guard: `auth:sanctum` + `tenant` + `tenant.vendor_enabled`

| Action | Method | URL | Request Class |
|--------|--------|-----|---------------|
| List | GET | `/` | `ListVendorOrderRequest` |
| Detail | GET | `/{orderId}` | — |
| Summary | GET | `/summary` | `ListVendorOrderSummaryRequest` |

## 6. Validation Rules

### 6.1 ListVendorOrderRequest

| Field | Rules | Message |
|-------|-------|---------|
| `from` | nullable, date | Khoảng thời gian không hợp lệ |
| `to` | nullable, date, after_or_equal:from | |
| `project_id` | nullable, integer | |
| `search` | nullable, string, max:100 | Tìm theo mã đơn |
| `page` | nullable, integer, min:1 | |
| `per_page` | nullable, integer, min:1, max:50 | Tối đa 50/trang |

### 6.2 ListVendorOrderSummaryRequest

| Field | Rules |
|---|---|
| `from` | nullable, date |
| `to` | nullable, date, after_or_equal:from |

## 7. Business Rules

- [ ] Verify `Partner.owner_tenant_id == current_tenant_id` (hoặc null cho platform-owned) trước mọi query — sai → 404
- [ ] Verify `tenant.is_vendor_enabled == true` — sai → 403 (middleware đã có)
- [ ] Chỉ query orders `status = 'completed'`
- [ ] Mặc định date range = 30 ngày gần nhất khi `from`/`to` trống
- [ ] Filter `orders.project_id IN (current_tenant.projects)` — auto-scope, **bắt buộc**
- [ ] Tính commission qua `VendorOrderCommissionCalculator`
- [ ] Lookup contract dùng `findActiveAt(partner_id, tenant_id, project_id, completed_at)`
- [ ] Chỉ include orders có contract mode `per_order`. Orders mode khác hoặc không có contract → exclude + đếm vào warnings
- [ ] Schema resi_mart không tồn tại → catch + return empty list + warning
- [ ] Pagination max 50/trang
- [ ] List sort mặc định: `completed_at DESC`

## 8. Công thức tính Commission

### 8.1 `VendorOrderCommissionCalculator`

```php
namespace App\Modules\Marketplace\VendorOrder\Services;

use App\Modules\Marketplace\PartnerCommissionContract\Models\PartnerCommissionContract;

final class VendorOrderCommissionCalculator
{
    /**
     * @return array{
     *     fixed: float,
     *     percent: float,
     *     remainder_after_fixed: float,
     *     percent_amount: float,
     *     total: float,
     *     capped_at_total: bool
     * }
     */
    public function compute(PartnerCommissionContract $contract, float $orderTotal): array
    {
        $terms = $contract->terms ?? [];
        $fixed = (float) ($terms['fixed'] ?? 0);
        $percent = (float) ($terms['percent'] ?? 0);

        if ($fixed >= $orderTotal) {
            return [
                'fixed' => $fixed,
                'percent' => $percent,
                'remainder_after_fixed' => 0.0,
                'percent_amount' => 0.0,
                'total' => $orderTotal,
                'capped_at_total' => true,
            ];
        }

        $remainder = $orderTotal - $fixed;
        $percentAmount = round($remainder * $percent / 100, 2);
        $total = round($fixed + $percentAmount, 2);

        return [
            'fixed' => $fixed,
            'percent' => $percent,
            'remainder_after_fixed' => $remainder,
            'percent_amount' => $percentAmount,
            'total' => $total,
            'capped_at_total' => false,
        ];
    }
}
```

### 8.2 Test cases (verify ngay)

| total | fixed | percent | Expected commission | capped |
|---|---|---|---|---|
| 830.000 | 50.000 | 10 | 128.000 | false |
| 30.000 | 50.000 | 10 | 30.000 | true |
| 1.000.000 | 0 | 15 | 150.000 | false |
| 500.000 | 20.000 | 0 | 20.000 | false |
| 0 | 0 | 10 | 0 | false (or true?) → cap=true vì 0>=0 |
| 100.000 | 100.000 | 5 | 100.000 | true |

## 9. Contract lookup (Point-in-time)

### 9.1 Thêm method vào `PartnerCommissionContractRepository`

```php
public function findActiveAt(
    int $partnerId,
    string $tenantId,
    int $projectId,
    Carbon $at,
): ?PartnerCommissionContract {
    return $this->model->newQuery()
        ->where('partner_id', $partnerId)
        ->where('tenant_id', $tenantId)
        ->where('project_id', $projectId)
        ->where('activated_at', '<=', $at)
        ->where(function ($q) use ($at) {
            $q->whereNull('replaced_at')
              ->orWhere('replaced_at', '>', $at);
        })
        ->whereIn('status', [
            ContractStatus::Active->value,
            ContractStatus::Replaced->value,
            ContractStatus::Expired->value,
            ContractStatus::Cancelled->value,
        ])
        ->orderByDesc('activated_at')
        ->first();
}

/**
 * Bulk: lookup nhiều order cùng lúc, tránh N+1.
 *
 * @param  array<int, array{project_id:int, at:Carbon}>  $orderKeys keyed by order_id
 * @return array<int, ?PartnerCommissionContract>
 */
public function findActiveAtBulk(
    int $partnerId,
    string $tenantId,
    array $orderKeys,
): array {
    // 1. Load tất cả contract của (partner, tenant) có activated_at <= max(at)
    // 2. Group theo project_id
    // 3. In-memory match từng order
    ...
}
```

### 9.2 Bulk lookup strategy

Mỗi request list orders → 1 query duy nhất lấy hết contracts liên quan (`partner_id + tenant_id + project_id IN(...) + activated_at <= max(completed_at)`), rồi match in-memory. Tránh N+1.

## 10. Repository

```php
interface VendorOrderRepositoryInterface
{
    public function listForPartner(
        string $vendorTenantId,
        array $projectIds,
        array $filters,
    ): LengthAwarePaginator;

    public function findById(
        string $vendorTenantId,
        int $orderId,
    ): ?VendorOrder;

    /**
     * @return array{count:int, revenue_total:float}
     */
    public function summaryForPartner(
        string $vendorTenantId,
        array $projectIds,
        Carbon $from,
        Carbon $to,
    ): array;
}
```

Implementation gồm:
1. Switch schema: `ResiMartConnection::switchToTenant($vendorTenantId)`
2. Build query `VendorOrder::query()->where('status', 'completed')->whereIn('project_id', $projectIds)`
3. Apply filters (date range, search by code, project_id)
4. Eager load `items`, `customer`
5. Return paginator

**Lưu ý**: `try/finally` đảm bảo `resetToPublic()` sau mỗi request (tránh leak schema cho request kế).

## 11. Service contract

```php
interface VendorOrderServiceInterface
{
    /**
     * @return array{
     *     data: array<int, array>,
     *     meta: array,
     *     warnings: array{orphan_orders_count:int, non_per_order_orders_count:int, schema_missing:bool}
     * }
     */
    public function listForPartner(
        int $partnerId,
        string $scopeTenantId,
        array $filters,
    ): array;

    public function getDetail(
        int $partnerId,
        string $scopeTenantId,
        int $orderId,
    ): array;

    /**
     * @return array{
     *     from:string, to:string,
     *     orders_count:int, revenue_total:float, commission_total:float,
     *     average_commission_per_order:float,
     *     warnings:array
     * }
     */
    public function getSummary(
        int $partnerId,
        string $scopeTenantId,
        ?Carbon $from = null,
        ?Carbon $to = null,
    ): array;
}
```

## 12. Presenter Output

### 12.1 VendorOrderListResource

```json
{
  "id": 123,
  "code": "ORD-2026-0123",
  "project_id": 5,
  "project_name": "Khu A",
  "customer": {
    "id": 17,
    "name": "Nguyễn Văn A",
    "phone": "0903xxxxxx"
  },
  "items_count": 3,
  "first_item_name": "Táo Mỹ size 100",
  "total": 830000.00,
  "status": { "value": "completed", "label": "Hoàn thành" },
  "completed_at": "2026-05-21T16:00:00+07:00",
  "commission": {
    "contract_id": 1,
    "contract_code": "HD-2026-0001",
    "amount": 128000.00,
    "currency": "VND"
  }
}
```

### 12.2 VendorOrderDetailResource

```json
{
  "id": 123,
  "code": "ORD-2026-0123",
  "project": { "id": 5, "name": "Khu A" },
  "customer": {
    "id": 17,
    "name": "Nguyễn Văn A",
    "phone": "0903xxxxxx",
    "email": "a@example.com"
  },
  "contact": {
    "name": "Nguyễn Văn A",
    "phone": "0903xxxxxx",
    "apartment_code": "B-12",
    "shipping_address": "Toà B căn 12, Khu A"
  },
  "status": { "value": "completed", "label": "Hoàn thành" },
  "payment_status": { "value": "paid", "label": "Đã thanh toán" },
  "payment_method": "cod",
  "amounts": {
    "subtotal": 850000.00,
    "deposit_total": 0.00,
    "shipping_fee": 30000.00,
    "discount_total": 50000.00,
    "total": 830000.00,
    "total_overridden": false
  },
  "timeline": {
    "ordered_at": "2026-05-20T14:30:00+07:00",
    "confirmed_at": "2026-05-20T15:00:00+07:00",
    "completed_at": "2026-05-21T16:00:00+07:00",
    "cancelled_at": null
  },
  "items": [
    {
      "id": 501,
      "item_type": "product",
      "product_name": "Táo Mỹ size 100",
      "variant_name": "1kg",
      "sku": "TM-100-1KG",
      "cover_url": "https://...",
      "quantity": 5,
      "unit_price": 50000.00,
      "discount_amount": 0.00,
      "subtotal": 250000.00
    }
  ],
  "commission": {
    "contract": {
      "id": 1,
      "code": "HD-2026-0001",
      "mode": { "value": "per_order", "label": "Chiết khấu mỗi đơn" }
    },
    "applied_at": "2026-05-21T16:00:00+07:00",
    "formula": {
      "fixed": 50000.00,
      "percent": 10.00,
      "remainder_after_fixed": 780000.00,
      "percent_amount": 78000.00,
      "total": 128000.00,
      "capped_at_total": false
    },
    "amount": 128000.00,
    "currency": "VND"
  }
}
```

### 12.3 Summary response

```json
{
  "success": true,
  "data": {
    "from": "2026-04-27",
    "to": "2026-05-27",
    "orders_count": 247,
    "revenue_total": 12450000.00,
    "commission_total": 1245000.00,
    "average_commission_per_order": 5040.49,
    "currency": "VND",
    "warnings": {
      "orphan_orders_count": 3,
      "non_per_order_orders_count": 12,
      "schema_missing": false
    }
  }
}
```

## 13. Cross-Module Dependencies

| Dependency | Module nguồn | Cách dùng |
|-----------|-------------|-----------|
| `Partner` (lookup tenant_id, verify owner) | `Marketplace/Partner` | Inject `PartnerRepository` (cùng module → direct) |
| `PartnerCommissionContract` (point-in-time lookup) | `Marketplace/PartnerCommissionContract` | Inject `PartnerCommissionContractRepository` (cùng module → direct) |
| `Project` (resolve project name) | `PMC/Project` | Inject `ProjectExternalServiceInterface` (cross-module) |

Method cần thêm vào ProjectExternalService:

```php
interface ProjectExternalServiceInterface
{
    // ...existing methods...

    /**
     * @return array<int, array{id:int, name:string}> keyed by project_id
     */
    public function getProjectsByIds(array $ids): array;

    /**
     * @return array<int> project IDs của tenant hiện tại
     */
    public function getCurrentTenantProjectIds(): array;
}
```

## 14. Edge cases

| Trường hợp | Xử lý |
|---|---|
| `Partner.owner_tenant_id != current_tenant_id` và không phải platform-owned | 404 "Vendor không tồn tại" |
| `tenant.is_vendor_enabled = false` | 403 (middleware `tenant.vendor_enabled` chặn sẵn) |
| Schema `tenant_<slug>` chưa exist | Catch `QueryException` SQLSTATE 3F000 → return empty + `warnings.schema_missing=true` |
| `Partner.tenant_id` null (chưa provision) | Return empty + warning "Vendor chưa active" |
| Order completed nhưng không có contract active tại `completed_at` | Loại khỏi list, `warnings.orphan_orders_count++` |
| Order completed nhưng contract mode != per_order | Loại khỏi list, `warnings.non_per_order_orders_count++` |
| `project_id` orphan (đã xoá trong PMC) | List vẫn show với `project_name = "Dự án #X (đã xoá)"` |
| Date range > 90 ngày | Clamp về 90 ngày (tránh tải nặng) |
| `total = 0` | Commission = 0 (logic vẫn chạy đúng) |
| `terms.percent = null && terms.fixed = null` (defensive) | Commission = 0 |
| Pagination quá `per_page=50` | Validation reject |

## 15. Tests (PHPUnit)

### 15.1 `VendorOrderCommissionCalculatorTest`

- `it computes commission with fixed + percent`
- `it caps commission at total when fixed greater than total`
- `it returns total when fixed equals total`
- `it computes when only percent provided`
- `it computes when only fixed provided`
- `it returns zero when terms are empty`

### 15.2 `TenantVendorOrderTest` (Feature)

- `it lists completed orders for the partner scoped to current tenant`
- `it filters orders by project_id`
- `it filters orders by completed_at range`
- `it limits per_page to 50 max`
- `it sorts by completed_at desc by default`
- `it returns 404 when partner does not belong to current tenant`
- `it returns 403 when vendor feature disabled on tenant`
- `it excludes orders without active contract and counts them in warnings`
- `it excludes orders with non per_order contract and counts them in warnings`
- `it includes orphan project_id with deleted label`
- `it gracefully handles missing resi_mart tenant schema`
- `it returns empty when partner has no tenant_id`
- `it shows detail with full breakdown including items and commission formula`
- `it returns summary aggregations correctly`
- `it clamps date range over 90 days`

### 15.3 Repository test (integration, optional)

Thiết lập schema test `tenant_test` trong resi_mart test DB → seed orders + assert query.

## 16. Migration

Không có migration mới ở PMC side. resi_mart đã có sẵn các bảng.

**Lưu ý**: nếu user/role Postgres chưa có quyền SELECT lên schemas `tenant_*` của resi_mart → cần grant thủ công 1 lần (ngoài scope code):

```sql
-- Chạy trên resi_mart DB
GRANT USAGE ON SCHEMA tenant_hoaqua TO pmc_user;
GRANT SELECT ON ALL TABLES IN SCHEMA tenant_hoaqua TO pmc_user;
-- Hoặc loop tất cả schema tenant_*
```

## 17. Permission

| Hành động | Quyền |
|---|---|
| Xem list + detail + summary | `marketplace.vendor_order.view` |

## 18. Checklist triển khai BE

- [ ] `.env.example` + `config/database.php`: 2 connection `resi_mart_central`, `resi_mart_tenant`
- [ ] `Support/ResiMartConnection.php` — helper switch search_path
- [ ] Enums: `VendorOrderStatus`, `VendorOrderPaymentStatus`
- [ ] Models: `VendorOrder`, `VendorOrderItem`, `VendorCustomer` (read-only, connection `resi_mart_tenant`)
- [ ] `VendorOrderRepository` + Interface
- [ ] Bổ sung `PartnerCommissionContractRepository::findActiveAt` + `findActiveAtBulk`
- [ ] `VendorOrderCommissionCalculator`
- [ ] `VendorOrderService` + Interface
- [ ] `ResiMartCentralExternalService` hoặc inline trong service — verify partner ownership
- [ ] `ProjectExternalServiceInterface::getProjectsByIds`, `getCurrentTenantProjectIds`
- [ ] Form Requests: `ListVendorOrderRequest`, `ListVendorOrderSummaryRequest`
- [ ] Resources: `VendorOrderListResource`, `VendorOrderDetailResource`, `VendorOrderItemResource`, `VendorOrderCommissionResource`
- [ ] Controller: `TenantVendorOrderController` (3 actions: index, show, summary)
- [ ] Routes: bổ sung `Marketplace/routes/tenant.php`
- [ ] Bind interfaces trong `MarketplaceServiceProvider`
- [ ] Exception: `VendorTenantSchemaMissingException`
- [ ] Permission seeder: `marketplace.vendor_order.view`
- [ ] Tests đầy đủ scenarios mục 15
- [ ] `make format` + `make lint`
- [ ] API docs annotations (`@tags Marketplace Vendor Orders (Tenant)`)
