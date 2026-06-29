# Tổng quan kinh doanh tenant - Đặc tả kỹ thuật Backend

> Module: `Platform/Tenant` (consumer) + `PMC/Order` & `PMC/ClosingPeriod` (owner) | Ngày tạo: 2026-06-15 | Trạng thái: Draft
> Nguồn: mockup `BA-TNP-SERVICES/.../quan-ly-van-hanh/cong-ty-vh/[companyId].vue` — card **"Tổng quan kinh doanh (6 tháng)"**.
> Bản này **thay thế** bản 2026-06-12 (đã xoá): nguồn đơn KHÔNG phải đơn vendor resi_mart, mà là **đơn hàng PMC của tenant** (phát sinh từ `og_tickets`).

## 1. Tổng quan

Cung cấp số liệu kinh doanh N tháng gần nhất của **một tenant (công ty vận hành)** cho trang chi tiết công ty vận hành phía platform. Ba chỉ số:

1. **Doanh thu tenant** — tổng `total_amount` của các **đơn hàng PMC `completed`** trong kỳ.
2. **Số đơn hàng** — số đơn PMC `completed` trong kỳ.
3. **Phí platform thu về** — tổng **`frozen_platform_fee`** (phí nền tảng đã đóng băng tại kỳ chốt phí) của các đơn đó. Đây là **số thực**, không còn ước tính (xem [`platform-fee-per-order-be.md`](./platform-fee-per-order-be.md)).

Cả 3 chỉ số đến từ **cùng một tập đơn PMC** → nhất quán. Đơn hàng PMC bắt nguồn từ ticket: `og_ticket → quote → order`.

**Vị trí dữ liệu & cách đọc:** đơn PMC và kỳ chốt phí nằm trong **schema tenant** (Stancl schema-per-tenant). Platform đọc qua `$tenant->run(fn () => ...)` trong một **ExternalService của PMC**, đúng pattern đã dùng cho card "Đánh giá cư dân" (`TenantResidentRatingExternalService`).

> ⚠️ **Không dùng** `Marketplace/VendorOrder::getMonthlyStatsForTenant()` / `VendorOrderAnalyticsExternalServiceInterface` cho card này — đó là đơn marketplace resi_mart (domain khác). Card này chỉ dựa trên đơn PMC nội bộ tenant.

## 2. Entities

**Không có bảng mới.** Chỉ đọc read-only từ schema tenant.

### 2.1 Order (PMC) — `orders` (schema tenant)

| Field | Column | Type | Mô tả |
|-------|--------|------|-------|
| Mã đơn | `code` | `string` | |
| Báo giá nguồn | `quote_id` | FK → `quotes` | `quote → og_ticket` |
| Trạng thái | `status` | enum `OrderStatus` | Chỉ tính `completed` |
| Giá trị đơn | `total_amount` | `decimal(15,2)` | = **Doanh thu** |
| Ngày hoàn thành | `completed_at` | `datetime` | **Mốc gom tháng** |

### 2.2 ClosingPeriodOrder (PMC) — `closing_period_orders` (schema tenant)

| Field | Column | Type | Mô tả |
|-------|--------|------|-------|
| Đơn | `order_id` | FK → `orders` | hasOne `order.closingPeriodOrder` |
| Kỳ chốt | `closing_period_id` | FK → `closing_periods` | |
| **Phí nền tảng đã chốt** | `frozen_platform_fee` | `decimal(15,2)` | = **Phí platform thu về** |

**Quan hệ:** `Order hasOne ClosingPeriodOrder`. Phí phí lấy qua join `orders ⨝ closing_period_orders` theo `order_id`, gom tháng theo `orders.completed_at`.

## 3. Enums

Không có enum mới. Lọc đơn bằng `OrderStatus::Completed` (`PMC/Order/Enums/OrderStatus.php`). Phí đã được sinh sẵn bởi cơ chế per-order (`TenantFeeMode`) — đây chỉ đọc lại.

## 4. API Endpoints

| Action | Method | URL | Request Class |
|--------|--------|-----|---------------|
| Business summary | GET | `tenants/{id}/business-summary` | `ListTenantBusinessSummaryRequest` |

- Đặt trong nhóm route hiện có `Platform/routes/external-api.php`, guard `auth:requester` (cạnh `tenants/{id}/resident-ratings`).
- Controller: `TenantBusinessSummaryController` (mới) hoặc thêm action `businessSummary` vào `OrganizationController`. Đề xuất controller riêng cho gọn (giống `TenantResidentRatingController`).

## 5. Validation Rules

### ListTenantBusinessSummaryRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `months` | `nullable`, `integer`, `min:1`, `max:12` | Số tháng phải từ 1 đến 12 |

Default `months = 6`. Khoảng thời gian: từ **đầu tháng** `(now - months + 1)` đến **hết tháng hiện tại**.

## 6. Business Rules

- [ ] **Chỉ tính đơn `status = completed`**; mốc thời gian theo `completed_at` (không phải ngày tạo). Đơn `cancelled`/chưa hoàn thành không tính.
- [ ] **Doanh thu** mỗi tháng = `SUM(orders.total_amount)` của đơn `completed` trong tháng đó.
- [ ] **Số đơn** mỗi tháng = `COUNT(orders)` đơn `completed` trong tháng đó.
- [ ] **Phí platform** mỗi tháng = `SUM(closing_period_orders.frozen_platform_fee)` của các đơn `completed` có `completed_at` trong tháng đó. Gom theo `orders.completed_at` (đồng bộ với doanh thu), KHÔNG theo `period_end` của kỳ chốt.
- [ ] **Lệch mẫu số là bình thường:** đơn đã `completed` nhưng **chưa được đưa vào kỳ chốt phí** thì có doanh thu nhưng `phí = 0` ở thời điểm xem. Khi đơn vào kỳ → phí xuất hiện đúng tháng `completed_at`. Đây là độ trễ tự nhiên, KHÔNG phải ước tính.
- [ ] **Lấp đủ tháng:** trả về đủ N tháng theo thứ tự thời gian, tháng không phát sinh điền `0` cho cả 3 chỉ số (để FE vẽ chart liền mạch).
- [ ] **`summary`** = tổng cộng N tháng (revenue, order_count, platform_revenue).
- [ ] Đọc cross-schema bằng `$tenant->run()`. Tenant không tồn tại → **404** (qua `OrganizationService::findById`). Tenant chưa phát sinh đơn → trả N tháng giá trị `0`.
- [ ] Read-only thuần — không ghi gì vào schema tenant.

## 7. Logic tổng hợp (gợi ý triển khai)

`PMC/Order/ExternalServices/Platform/TenantBusinessSummaryExternalService::getMonthlyBusinessSummary(Organization $tenant, int $months): array`

```php
return $tenant->run(function () use ($months): array {
    $from = now()->startOfMonth()->subMonths($months - 1);
    $to = now()->endOfMonth();

    // 1) Doanh thu + số đơn theo tháng (đơn completed)
    $orderRows = Order::query()
        ->where('status', OrderStatus::Completed->value)
        ->whereBetween('completed_at', [$from, $to])
        ->selectRaw("to_char(completed_at, 'YYYY-MM') as ym, count(*) as cnt, sum(total_amount) as revenue")
        ->groupBy('ym')
        ->get()->keyBy('ym');

    // 2) Phí nền tảng theo tháng (frozen, gom theo completed_at của đơn)
    $feeRows = ClosingPeriodOrder::query()
        ->join('orders', 'orders.id', '=', 'closing_period_orders.order_id')
        ->where('orders.status', OrderStatus::Completed->value)
        ->whereBetween('orders.completed_at', [$from, $to])
        ->selectRaw("to_char(orders.completed_at, 'YYYY-MM') as ym, sum(closing_period_orders.frozen_platform_fee) as fee")
        ->groupBy('ym')
        ->get()->keyBy('ym');

    // 3) Dựng skeleton N tháng, lấp 0, cộng summary...
});
```

> ExternalService truy vấn model trực tiếp **trong `$tenant->run()`** — đúng tiền lệ `TenantResidentRatingExternalService` (boundary read-only cross-schema). Nếu muốn tuân thủ Repository pattern chặt hơn, thêm method aggregate vào `OrderRepository`/`ClosingPeriodRepository` rồi gọi từ ExternalService — quyết định lúc code, ưu tiên khớp sibling.

## 8. Presenter Output

```json
{
  "success": true,
  "data": {
    "summary": {
      "tenant_revenue": 6030000000,
      "order_count": 317,
      "platform_revenue": 302600000
    },
    "months": [
      { "month": "2025-11", "label": "T11/2025", "order_count": 42, "tenant_revenue": 820000000, "platform_fee": 41200000 },
      { "month": "2025-12", "label": "T12/2025", "order_count": 48, "tenant_revenue": 910000000, "platform_fee": 45500000 }
    ]
  }
}
```

- Trả qua `response()->json(['success' => true, 'data' => ...])` (giống `OrganizationController::stats`). Số tiền là số nguyên đồng (không format ở BE).
- **KHÔNG** còn cờ `is_estimated` — phí là số thực đã đóng băng.

## 9. Cross-Module Dependencies (ExternalService)

| Dependency | Module nguồn | Interface | Method |
|-----------|-------------|-----------|--------|
| Số liệu kinh doanh tenant | PMC/Order (+ ClosingPeriod) | `TenantBusinessSummaryExternalServiceInterface` (mới) | `getMonthlyBusinessSummary(Organization $tenant, int $months)` |
| Tìm tenant | Platform/Tenant | `OrganizationServiceInterface::findById($id)` | (đã có) |

> Platform/Tenant gọi ExternalService của PMC (top-level module ↔ top-level module — đúng scope). PMC tự `$tenant->run()` để vào schema tenant. KHÔNG FK xuyên schema, KHÔNG import model PMC ở phía Platform.

## 10. Migration Preview

**Không có migration** — không bảng mới, không cột mới. Read-only trên `orders` + `closing_period_orders` (đã tồn tại).

## 11. Checklist triển khai BE

- [ ] `PMC/Order/ExternalServices/Platform/TenantBusinessSummaryExternalServiceInterface` + impl (`$tenant->run()`, 2 query gom tháng + lấp skeleton + summary)
- [ ] Bind interface trong `PMCServiceProvider`
- [ ] `Platform/Tenant/Requests/ListTenantBusinessSummaryRequest` (rule `months`)
- [ ] `Platform/Tenant/Controllers/TenantBusinessSummaryController@index` → `OrganizationService::findById` → ExternalService → `response()->json`
- [ ] Route `GET tenants/{id}/business-summary` (guard `auth:requester`)
- [ ] PSR-4 + `make format` → `make lint`
- [ ] Tests (Platform feature, SQLite `:memory:`): tổng & từng tháng đúng; chỉ đơn `completed`; lấp tháng rỗng = 0; đơn completed chưa vào kỳ → phí 0; tenant không tồn tại → 404; `months` ngoài 1–12 → 422
