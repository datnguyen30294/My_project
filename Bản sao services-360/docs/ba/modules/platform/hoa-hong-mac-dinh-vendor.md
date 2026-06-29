# Hoa hồng mặc định 0đ cho vendor — Đặc tả kỹ thuật (BE + FE)

> Module: `Marketplace/VendorOrder` (DELTA) | Ngày tạo: 2026-06-20 | **Trạng thái: BE + FE XONG (2026-06-20)**
>
> Liên quan: `don-hang-vendor-{be,fe}.md`, `quan-ly-vendor-{be,fe}.md`, `bao-cao-tong-hop/`
>
> **Đã triển khai:** §5.4 chọn phương án gộp đơn 0đ vào báo cáo PMC (chủ sản phẩm xác nhận "giờ không còn đơn orphan"). 170 test Marketplace + report pass, 361 test Platform pass, pint + typecheck + eslint pass. Cross-DB happy-path verify ở browser/Postgres dev (sqlite không provision schema resi_mart).

## 1. Bối cảnh & vấn đề

Hoa hồng vendor hiện tính theo hợp đồng `PartnerCommissionContract`, gắn theo **bộ ba `(partner_id, tenant_id, project_id)`** (cả `tenant_id` lẫn `project_id` đều **NOT NULL** — không có "wildcard"). Một đơn `completed` chỉ có hoa hồng khi khớp được 1 hợp đồng `commission_mode = per_order` đang active tại thời điểm hoàn thành (`matchContract`/`matchContractPlatform`: `activated_at ≤ completed_at` và chưa bị `replaced` trước đó).

**Hệ quả không mong muốn:** đơn không khớp hợp đồng nào bị xếp **"mồ côi" (orphan)**:

- Ở console "Đơn hàng vendor" và detail → `commission = null` (hiển thị trống "—").
- Ở các list/summary per-vendor & per-tenant (`listForPartner`, `listAllForTenant`, `getSummary*`, `getCompletedOrdersForReport`) → **đơn bị `continue` loại hẳn khỏi danh sách**.

Vì hợp đồng **không cho backdate** (`activated_at = now`), tạo hợp đồng bây giờ cũng **không cứu được đơn quá khứ**. Đây là gốc của hiện tượng "có đơn vendor không có hoa hồng" và "2 trang hiển thị số đơn lệch nhau".

## 2. Mục tiêu

**Mọi đơn `completed` của vendor LUÔN có một dòng hoa hồng — tối thiểu là 0đ.** Không còn khái niệm đơn "mồ côi không hoa hồng". Hoa hồng 0đ là **giá trị mặc định ngầm** khi chưa cấu hình, không phải bản ghi hợp đồng vật lý.

## 3. Quyết định đã chốt (với chủ sản phẩm)

| # | Quyết định | Chọn |
|---|-----------|------|
| Q1 | Cơ chế "mặc định 0đ" | **Fallback ngầm trong logic tính** — KHÔNG sinh bản ghi `PartnerCommissionContract`, KHÔNG migration, KHÔNG bảng mới. Phủ 100% mọi đơn (kể cả quá khứ & dự án mới). |
| Q2 | Đơn ở mức 0đ mặc định có cho gán hoa hồng thủ công không | **Vẫn cho override** (cơ chế `vendor_order_commission_overrides` đã có). |

**Thứ tự ưu tiên giải quyết hoa hồng cho 1 đơn `completed`:**

```
1. Override thủ công  (vendor_order_commission_overrides)   → nguồn "manual"
2. Hợp đồng active per_order khớp (partner,tenant,project,completed_at) → nguồn "contract"
3. MẶC ĐỊNH 0đ        (fallback ngầm, không bản ghi)         → nguồn "default"   ← MỚI
```

Đơn **chưa completed** giữ `commission = null` ("chưa phát sinh") — hoa hồng chỉ tính khi đơn hoàn thành. Không đổi.

## 4. Định nghĩa "hoa hồng mặc định 0đ"

Một collaborator thuần trong `VendorOrderService` dựng payload commission đồng nhất với 2 nguồn hiện có (`buildContractCommission`, `buildOverrideCommission`):

```php
private function buildDefaultCommission(VendorOrder $order): array
{
    return [
        'contract'      => null,
        'recipient'     => RevenueRecipient::Platform,                     // mặc định Platform giữ
        'formula'       => $this->calculator->computeFromTerms([], (float) $order->total), // → total = 0
        'amount'        => 0.0,
        'applied_at'    => $order->completed_at ?? Carbon::now(),
        'manual'        => false,
        'override_id'   => null,
        'contract_code' => null,
        'source'        => 'default',                                      // marker nguồn MỚI
    ];
}
```

`computeFromTerms([], total)` đã trả `total = 0` cho cả `total > 0` (fixed=0, percent=0) lẫn `total ≤ 0` (nhánh `zero()`) — không cần thêm logic tính.

**Thêm khoá `source`** (`'contract' | 'manual' | 'default'`) vào cả 3 builder để FE phân biệt rõ, thay vì suy đoán từ `contract_id`/`is_manual`:

- `buildContractCommission` → `'source' => 'contract'`
- `buildOverrideCommission` → `'source' => 'manual'`
- `buildDefaultCommission` → `'source' => 'default'`

## 5. Backend — các điểm sửa

File: `backend/app/Modules/Marketplace/src/VendorOrder/Services/VendorOrderService.php`

> **An toàn về phạm vi:** mọi repository method dưới đây (trừ `listAllForConsole`) đã lọc sẵn `status = Completed` ở tầng query (`VendorOrderRepository`). Nên thay nhánh orphan `continue` bằng "dựng 0đ + giữ đơn" KHÔNG kéo đơn chưa hoàn thành vào danh sách. Riêng console (`collectConsoleOrders`) dùng `listAllForConsole` (mọi trạng thái) nên **phải gate `status === Completed`** trước khi áp 0đ.

### 5.1 Console (màn hình chính user đang xem)

**`collectConsoleOrders` (≈ L1162-1207).** Trong block `if ($order->status === VendorOrderStatus::Completed)`, nhánh không-override hiện:

```php
if ($contract === null)            { $orphan++; }                 // commission vẫn null
elseif (!per_order)                { $nonPerOrder++; }            // commission vẫn null
else                               { $commission = buildContractCommission(...); }
```

Đổi 2 nhánh đầu thành **vẫn dựng `buildDefaultCommission($order)`**, giữ nguyên việc tăng `$orphan` / `$nonPerOrder` cho mục đích thống kê (xem §5.5):

```php
if ($contract !== null && $contract->commission_mode === CommissionMode::PerOrder) {
    $commission = $this->buildContractCommission($contract, $order);
} else {
    if ($contract === null)        { $orphan++; }
    else                           { $nonPerOrder++; }
    $commission = $this->buildDefaultCommission($order);          // MỚI
}
```

→ Mọi đơn completed trong console có `commission != null`. Đơn chưa completed vẫn `null`.

**`getDetailPlatform` (≈ L683-704).** Khi `completed_at !== null`, không override, không hợp đồng per_order → hiện `commission = null`. Đổi: gán `$commission = $this->buildDefaultCommission($order)` ở nhánh else cuối.

### 5.2 List/summary per-vendor (platform scope — hiện là dead code nhưng vẫn sửa để nhất quán)

`listForPartnerPlatform` (≈ L604-634) và `getSummaryPlatform` (≈ L770-802): thay nhánh `orphan++/continue` & `nonPerOrder++/continue` bằng dựng `buildDefaultCommission` + giữ đơn (list) / cộng vào tổng với `amount = 0` (summary). Ghi chú: per memory `project_don_hang_vendor_console`, 2 method này không còn caller — sửa để tránh lệch hành vi nếu được tái dùng, hoặc đánh dấu xoá ở task dọn dead-code riêng.

### 5.3 List/summary per-tenant (PMC nội bộ + dashboard doanh thu tenant)

Các method này hỗ trợ trang đơn vendor trong PMC và "Doanh thu & Đơn hàng" trên trang chi tiết CTVH (`listAllForTenant` / `getSummaryAllForTenant`). Hiện **loại hẳn** đơn orphan.

| Method | Sửa |
|--------|-----|
| `listForPartner` (≈ L86-113) | Nhánh `contract===null`/non-per-order: dựng `buildDefaultCommission`, **giữ đơn** trong `$decorated` thay vì `continue`. `total` paginator = `$paginator->total()` (KHÔNG trừ orphan/nonPerOrder nữa). |
| `listAllForTenant` (≈ L168-197) | Tương tự — giữ đơn với 0đ. |
| `getSummary` (tenant, ≈ L435-455) | Đơn orphan/non-per-order: `$count++`, `$revenueTotal += total`, `$commissionTotal += 0`. |
| `getSummaryAllForTenant` (≈ L288-309) | Tương tự. |
| `getDetail` (tenant, ≈ L362-370) | `findById` đã completed-only → nếu không contract: gán `buildDefaultCommission`. |

> ⚠️ **Tác động số liệu (cố ý):** `orders_count`, `revenue_total`, `vendors_count` ở các summary nay **bao gồm** đơn trước đây bị loại; `commission_total` **không đổi** (cộng 0đ). Dashboard doanh thu tenant sẽ thấy số đơn / GMV vendor tăng lên đúng thực tế, hoa hồng giữ nguyên. Đây là hành vi mong muốn ("không đơn nào bị giấu").

### 5.4 Report nội bộ PMC (`getCompletedOrdersForReport`, ≈ L523-552)

Feeds `PMC/Report/VendorOrder` (báo cáo đơn vendor tenant-scoped). Hiện loại orphan → báo cáo bỏ sót GMV của đơn không hợp đồng.

**Khuyến nghị (mặc định trong spec):** thêm row với `commission => 0.0` cho đơn orphan/non-per-order (thay `continue`). Hệ quả: `orders_count`/`revenue_total` của báo cáo tăng (phản ánh đủ GMV), `commission_total` giữ nguyên.

Nếu muốn **giữ báo cáo bất biến** (chỉ đơn có hoa hồng > 0), để nguyên `getCompletedOrdersForReport` và chỉ áp §5.1–5.3. Cần chủ sản phẩm xác nhận điểm này khi duyệt spec.

### 5.5 Ngữ nghĩa `warnings`

Giữ nguyên khoá `orphan_orders_count` / `non_per_order_orders_count` trong response (không phá vỡ contract API), nhưng **đổi ý nghĩa**: nay là **thông tin** ("số đơn đang áp hoa hồng mặc định 0đ vì chưa có hợp đồng" / "số đơn vendor có hợp đồng khác per_order"), KHÔNG còn là "đơn bị loại/trống". FE đổi câu chữ tương ứng (§6.3) — không hiển thị như lỗi.

### 5.6 KHÔNG đổi

- `matchContract` / `matchContractPlatform`: giữ nguyên (vẫn trả `null` khi không khớp — quyết định 0đ nằm ở caller, không ở matcher).
- `assignCommissionOverride` (≈ L984-998): guard "đã có hợp đồng per_order active → chặn" **vẫn đúng**. Đơn ở mức 0đ mặc định = KHÔNG có hợp đồng → vẫn cho override (Q2). `removeCommissionOverride` → đơn rơi về 0đ mặc định (thay vì trống). Không sửa.
- **Platform/Report (`PlatformVendorOrderAggregationExternalService`)**: đã default `commissionAmount = 0` khi không khớp hợp đồng (L78) → "Báo cáo tổng hợp" **đã đúng từ trước, KHÔNG sửa**.
- KHÔNG migration, KHÔNG bảng/model/enum mới, KHÔNG đổi dependency.

## 6. Frontend — các điểm sửa

> Composable `useVendorOrders.ts`: thêm `'default'` vào union kiểu `source` của commission (nếu type khai báo source); `amount`, `contract_id`, `revenue_recipient` đã nullable sẵn.

### 6.1 Bảng console — `components/vendor-order/ConsoleTable.vue`

Cột "Hoa hồng" hiện xử lý `null` ("—") / `is_manual` ("Gán thủ công") / số tiền. Bổ sung nhánh `source === 'default'`:

- Hiển thị `0 ₫` kèm `<UBadge color="neutral" variant="subtle">Mặc định</UBadge>` để phân biệt với hoa hồng 0đ theo hợp đồng thật.
- Đơn chưa completed: vẫn "—" (commission null).

### 6.2 Trang chi tiết đơn — `vendor-order/[orderKey].vue` + `VendorOrderCommissionBreakdown`

- `source === 'default'` → khối hoa hồng hiện "Hoa hồng mặc định: **0 ₫**" + dòng phụ "Chưa có hợp đồng hoa hồng cho dự án này".
- Nút **"Gán hoa hồng"**: điều kiện hiển thị đổi từ "completed && commission == null" → **"completed && `source === 'default'`"** (đơn 0đ mặc định, chưa có hợp đồng/override). Đơn `source === 'manual'` giữ nút Sửa/Gỡ; `source === 'contract'` không có nút ghi.

### 6.3 Banner cảnh báo

Đổi câu chữ `orphan_orders_count` / `non_per_order_orders_count` từ giọng lỗi ("X đơn mồ côi") sang **thông tin trung tính**: "X đơn đang áp hoa hồng mặc định 0đ (chưa có hợp đồng)". Dùng `<UAlert color="info" variant="subtle">`. Có thể ẩn hẳn nếu sản phẩm thấy không cần.

### 6.4 Dashboard doanh thu tenant / đơn vendor PMC

Không cần sửa logic — chỉ đảm bảo cell hoa hồng render `amount = 0` thành "0 ₫" (đã đúng với `formatCurrency`). Số đơn/GMV tự tăng theo §5.3.

## 7. Edge cases

| Tình huống | Kết quả |
|-----------|---------|
| Đơn completed, vendor chưa có hợp đồng nào | Hoa hồng 0đ (source=default), Platform giữ |
| Đơn completed, có hợp đồng `revenue_share`/`subscription` (non per_order) | Hoa hồng 0đ (GĐ1 không tính 2 mode này per-order); đếm `non_per_order_orders_count` |
| Đơn completed, có hợp đồng per_order 0% + 0đ thật | Hoa hồng 0đ qua nhánh **contract** (source=contract) — phân biệt với default qua badge |
| Đơn quá khứ hoàn thành trước mọi hợp đồng | 0đ mặc định (fallback ngầm phủ được, khác hẳn cách tạo hợp đồng vật lý) |
| Đơn chưa completed (pending/confirmed/cancelled) | `commission = null` ("chưa phát sinh") — không đổi |
| Đơn cancelled | Không tính GMV (assembler đã loại), commission null |
| Admin gán override cho đơn 0đ mặc định rồi gỡ | Gán → manual; gỡ → quay về 0đ mặc định |

## 8. Kế hoạch test (PHPUnit, sqlite)

Logic thuần là chính (cross-DB resi_mart không test được trên sqlite — như các spec vendor trước).

- **Unit `VendorOrderCommissionCalculator`**: `computeFromTerms([], 500000)['total'] === 0.0`; `computeFromTerms([], 0)['total'] === 0.0` (đã có thể có sẵn — bổ sung nếu thiếu).
- **Unit builder/assembler**: row có `commission.source = 'default'`, `amount = 0` → `summarize()` cộng 0 vào `commission_platform`, vẫn đếm `orders_count`/`vendors_count`. Khẳng định KHÔNG còn row commission null cho đơn completed.
- **Resource `VendorOrderListResource` + `VendorOrderCommissionResource`**: payload có `source = 'default'`, `amount = 0`, `contract_id = null`, `is_manual = false`, `revenue_recipient.value = 'platform'`.
- **Override không hồi quy**: đơn có hợp đồng per_order active vẫn chặn assign (guard `ORDER_HAS_CONTRACT_COMMISSION`); remove override → detail trả về source=default.
- Chạy: `make test-file FILE=app/Modules/Marketplace/tests/...`. Sau sửa BE: `make format` → `make lint` → tests. FE: `pnpm run typecheck` + `pnpm run lint`.

## 9. Ngoài phạm vi

- Không tạo hợp đồng 0đ vật lý khi kích hoạt vendor (đã bác ở Q1).
- Không tính `revenue_share`/`subscription` (vẫn GĐ1).
- Không đổi Platform/Report (đã default 0đ sẵn).
- Không wiring rating cư dân.
