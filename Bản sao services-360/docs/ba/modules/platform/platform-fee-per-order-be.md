# Phí nền tảng theo đơn hàng - Đặc tả kỹ thuật Backend

> Module: `Platform/Tenant` (cấu hình) + `PMC/ClosingPeriod` (tính & đóng băng) | Ngày tạo: 2026-06-15 | Trạng thái: Draft | Phạm vi: **Giai đoạn 1**

## 1. Tổng quan

Platform (TNP) thu của mỗi tenant một khoản **phí nền tảng theo đơn hàng**. Cấu hình mức phí đã có sẵn (`tenant_configs`), nhưng **chưa được áp dụng** vào bất kỳ đơn nào. Spec này mô tả việc **tính và đóng băng** phí nền tảng cho từng đơn **tại kỳ chốt phí**, đồng bộ hoàn toàn với cơ chế hoa hồng đang có.

**Quyết định nền tảng (đã chốt với nghiệp vụ):**

- Phí tính & đóng băng **khi thêm đơn vào kỳ chốt phí** (cùng thời điểm hoa hồng).
- **Mở lại kỳ → tính lại** theo cấu hình mới nhất (đồng bộ hoa hồng — KHÔNG bất biến theo phiên bản).
- **KHÔNG** có bảng lịch sử/phiên bản cấu hình. `tenant_configs` giữ nguyên 1 dòng/tenant, sửa tại chỗ.
- Phạm vi GĐ1: **tính + đóng băng + hiển thị** (số liệu để platform tổng hợp). **Chưa** dựng sổ billing tự trừ tiền tenant (GĐ2).
- `none` / `subscription` → phí per-order = **0** (gói tháng/năm thoả thuận ngoài). `both` = `fixed + percent`.

## 2. Entities

### 2.1 TenantConfig (KHÔNG đổi)

Cấu hình phí đã tồn tại đầy đủ — chỉ tái sử dụng, không sửa schema.

**Bảng:** `tenant_configs` (central DB) — `Platform/Tenant/Models/TenantConfig.php`

| Field | Column | Type | Mô tả |
|-------|--------|------|-------|
| Hình thức thu | `fee_mode` | `string` (enum `TenantFeeMode`) | none/subscription/fixed_per_order/percent_per_order/both |
| Phí cố định mỗi đơn | `fixed_fee_per_order` | `decimal(?,2)` | Dùng cho `fixed_per_order` & `both` |
| Phí % mỗi đơn | `percent_fee_per_order` | `decimal(?,2)` | Dùng cho `percent_per_order` & `both` |
| Mức phí gói | `subscription_amount` | `decimal(?,2)` | Chỉ ghi nhận; **không** sinh phí per-order |
| Chu kỳ gói | `subscription_cycle` | `string` (enum `SubscriptionCycle`) | monthly/yearly |

### 2.2 ClosingPeriodOrder (MỞ RỘNG)

**Bảng:** `closing_period_orders` (tenant schema) — thêm cột đóng băng phí nền tảng cạnh `frozen_commission_total`.

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| Hình thức phí (snapshot) | `platform_fee_mode` | `string(50)` | nullable | Mode tại lúc tính, để đơn tự giải thích công thức |
| Phí cố định (snapshot) | `platform_fee_fixed` | `decimal(15,2)` | default 0 | Rate cố định đã dùng |
| Phí % (snapshot) | `platform_fee_percent` | `decimal(5,2)` | default 0 | Rate % đã dùng |
| **Phí nền tảng đã chốt** | `frozen_platform_fee` | `decimal(15,2)` | default 0 | Số tiền cuối: `fixed + base × percent/100` |

> `ClosingPeriodOrder` extend `Model` trực tiếp (detail/pivot của ClosingPeriod) — đúng convention hiện tại, không cần BaseModel.

**Base tính %:** dùng `frozen_receivable_amount` (= `order->receivable->amount`) — đúng giá trị đã đóng băng của đơn trong kỳ, đồng bộ với cách hoa hồng lấy base.

## 3. Enums

Tái sử dụng `TenantFeeMode` (`Platform/Tenant/Enums/TenantFeeMode.php`) — **không tạo enum mới**.

| Key | Value | Phí per-order |
|-----|-------|---------------|
| None | `none` | 0 |
| Subscription | `subscription` | 0 (thoả thuận ngoài) |
| FixedPerOrder | `fixed_per_order` | `fixed` |
| PercentPerOrder | `percent_per_order` | `base × percent/100` |
| Both | `both` | `fixed + base × percent/100` |

## 4. Cross-Module: lộ cấu hình phí cho PMC

`PMC/ClosingPeriod` nằm ở schema tenant; cấu hình phí ở central DB. Phải mở rộng ExternalService của Platform (hiện `TenantPlanLimits` **không** có trường phí).

### 4.1 Value Object mới: `TenantFeePolicy`

`Platform/Tenant/ExternalServices/PMC/TenantFeePolicy.php` (`final readonly`):

```php
final readonly class TenantFeePolicy
{
    public function __construct(
        public TenantFeeMode $mode,
        public float $fixedPerOrder,
        public float $percentPerOrder,
    ) {}

    /** Phí per-order; none/subscription → 0. */
    public function computeForOrder(float $orderAmount): float
    {
        $fixed = in_array($this->mode, [TenantFeeMode::FixedPerOrder, TenantFeeMode::Both], true)
            ? $this->fixedPerOrder : 0.0;
        $percent = in_array($this->mode, [TenantFeeMode::PercentPerOrder, TenantFeeMode::Both], true)
            ? $orderAmount * $this->percentPerOrder / 100 : 0.0;

        return round($fixed + $percent, 2);
    }
}
```

### 4.2 Mở rộng interface

`TenantConfigExternalServiceInterface` — thêm:

```php
/** Chính sách phí nền tảng của tenant hiện tại. Null khi không có tenant context. */
public function getFeePolicyForCurrentTenant(): ?TenantFeePolicy;
```

Triển khai trong `TenantConfigExternalService`: đọc `TenantConfig` của tenant hiện tại → map `fee_mode`, `fixed_fee_per_order`, `percent_fee_per_order` vào VO. Trả `null` khi không có tenant/config → coi như phí = 0.

## 5. Logic tính & đóng băng

### 5.1 Thêm đơn vào kỳ — `ClosingPeriodService::addOrders()`

Bổ sung vào vòng lặp hiện tại (sau khi đã có `frozen_receivable_amount`):

```php
$feePolicy = $this->tenantConfig->getFeePolicyForCurrentTenant();
$base = (float) $order->receivable->amount;
$platformFee = $feePolicy?->computeForOrder($base) ?? 0.0;

$this->repository->createPeriodOrder([
    'closing_period_id'      => $period->id,
    'order_id'               => $orderId,
    'frozen_receivable_amount' => $order->receivable->amount,
    'frozen_commission_total'  => round($commissionTotal, 2),
    'platform_fee_mode'      => $feePolicy?->mode->value,
    'platform_fee_fixed'     => $feePolicy && in_array($feePolicy->mode, [TenantFeeMode::FixedPerOrder, TenantFeeMode::Both], true) ? $feePolicy->fixedPerOrder : 0,
    'platform_fee_percent'   => $feePolicy && in_array($feePolicy->mode, [TenantFeeMode::PercentPerOrder, TenantFeeMode::Both], true) ? $feePolicy->percentPerOrder : 0,
    'frozen_platform_fee'    => $platformFee,
]);
```

> Inject `TenantConfigExternalServiceInterface $tenantConfig` qua constructor `ClosingPeriodService` (đã có tiền lệ inject `PlatformBankInfoExternalServiceInterface`).

### 5.2 Mở lại kỳ — `ClosingPeriodService::reopen()`

Trong vòng lặp recalc hiện tại, cập nhật thêm `frozen_platform_fee` (+ snapshot mode/fixed/percent) theo cấu hình mới nhất — **đồng bộ với việc tính lại `frozen_commission_total`**.

### 5.3 Bỏ đơn khỏi kỳ — `removeOrder()`

Không cần sửa: xoá pivot là xoá luôn phí đã đóng băng.

## 6. Business Rules

- [ ] Phí chỉ phát sinh khi đơn đủ điều kiện vào kỳ: **Hoàn thành** + công nợ **Thu đủ** (logic `assertOrderEligible` hiện có).
- [ ] Đơn **bị hủy** / chưa thu đủ → không vào kỳ → **không có phí**.
- [ ] `fee_mode = none | subscription` → `frozen_platform_fee = 0`.
- [ ] Đơn trong **kỳ đã đóng** → phí giữ nguyên (đã đóng băng).
- [ ] **Mở lại kỳ** → phí tính lại theo `tenant_configs` mới nhất.
- [ ] Đổi cấu hình phí (`PUT /platform/tenants/{id}/config`) chỉ ảnh hưởng đơn **chưa chốt** hoặc đơn trong kỳ được tính lại; không hồi tố kỳ đã đóng.
- [ ] Base tính %: `frozen_receivable_amount`. Làm tròn 2 chữ số.

## 7. Presenter Output

### 7.1 `ClosingPeriodDetailResource` — mỗi dòng đơn

```json
{
  "order_id": 123,
  "order_code": "DH-0001",
  "frozen_receivable_amount": "10000000.00",
  "frozen_commission_total": "1500000.00",
  "platform_fee": {
    "amount": "50000.00",
    "mode": { "value": "percent_per_order", "label": "Thu theo % đơn hàng" },
    "fixed": "0.00",
    "percent": "0.50"
  }
}
```

### 7.2 Tổng kỳ (stats)

```json
{ "total_platform_fee": "1250000.00", "order_count": 25 }
```

### 7.3 `EligibleOrderResource` — phí dự kiến (preview, tính từ cấu hình hiện tại)

```json
{ "id": 123, "code": "DH-0001", "total_amount": "10000000.00", "estimated_platform_fee": "50000.00" }
```

> Enum fields: `{ "value": "...", "label": "..." }`. Không thêm `created_at`.

## 8. Cross-Module Dependencies (ExternalService)

| Dependency | Module nguồn | Interface | Method |
|-----------|-------------|-----------|--------|
| Cấu hình phí tenant | Platform/Tenant | `TenantConfigExternalServiceInterface` | `getFeePolicyForCurrentTenant()` (mới) |

> PMC/ClosingPeriod đọc cấu hình qua ExternalService, KHÔNG import `TenantConfig` model trực tiếp, KHÔNG FK xuyên DB.

## 9. Migration Preview

```php
Schema::table('closing_period_orders', function (Blueprint $table) {
    $table->string('platform_fee_mode', 50)->nullable()->after('frozen_commission_total');
    $table->decimal('platform_fee_fixed', 15, 2)->default(0)->after('platform_fee_mode');
    $table->decimal('platform_fee_percent', 5, 2)->default(0)->after('platform_fee_fixed');
    $table->decimal('frozen_platform_fee', 15, 2)->default(0)->after('platform_fee_percent');
});
```

> Migration nằm trong tenant migrations (vì `closing_period_orders` thuộc schema tenant). Đơn cũ trong kỳ đã đóng giữ `frozen_platform_fee = 0` (backfill không bắt buộc cho GĐ1).

## 10. Checklist triển khai BE

- [ ] Migration thêm cột vào `closing_period_orders`
- [ ] `ClosingPeriodOrder` model: thêm fillable + casts (`frozen_platform_fee`, `platform_fee_fixed`, `platform_fee_percent` → `decimal:2`)
- [ ] VO `TenantFeePolicy` + method `computeForOrder()`
- [ ] Mở rộng `TenantConfigExternalServiceInterface` + impl `getFeePolicyForCurrentTenant()`
- [ ] Inject ExternalService vào `ClosingPeriodService`; hook `addOrders()` + `reopen()`
- [ ] Cập nhật `ClosingPeriodDetailResource`, `EligibleOrderResource`, stats tổng kỳ
- [ ] Tests: tính đúng theo từng mode (none/subscription/fixed/percent/both); đóng băng khi add; tính lại khi reopen; đơn hủy không có phí; đổi config không hồi tố kỳ đóng
- [ ] `make format` → `make lint` → chạy test liên quan
