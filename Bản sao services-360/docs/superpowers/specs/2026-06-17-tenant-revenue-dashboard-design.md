# Thiết kế: Bảng dòng tiền platform trên trang detail Công ty vận hành (CTVH)

- **Ngày**: 2026-06-17
- **Trang**: `/platform/tenants/[id]` (vd: `/platform/tenants/tnp`)
- **Mục tiêu**: Biến trang detail CTVH thành nơi DUY NHẤT để platform thấy **tổng số tiền thu được từ một CTVH**, tách theo 3 nguồn, đồng thời giữ nguyên thông tin chung + cấu hình và liên kết dễ dàng sang nơi cấu hình phí.

## Bối cảnh hiện trạng

Trang đang có:
- **Header**: tên CTVH, badge trạng thái, nút bật/tắt (`TenantToggleActiveModal`).
- **Card "Tổng quan kinh doanh"** (`TenantBusinessSummaryCard` + `TenantBusinessChart`): 3 ô (doanh thu tenant / số đơn / phí platform) + chart 6 tháng. **Chỉ phản ánh 1 nguồn**: phí platform OG ticket (`frozen_platform_fee` ở kỳ chốt PMC), qua `GET /platform/tenants/{id}/business-summary`.
- **4 tab**: Thông tin chung (`TenantInfoTab`) · Tài khoản (`TenantAccountsTab`) · Dịch vụ/module (`TenantModulesTab`) · Cấu hình (`TenantConfigTab`).

3 nguồn tiền platform thu từ 1 CTVH:
| Nguồn | Đã có | Khoảng trống |
|---|---|---|
| OG ticket (phí SaaS trên đơn vận hành) | `business-summary` + card/chart | đang là nguồn duy nhất hiển thị; có thể thiếu list đơn theo tenant |
| Vendor (hoa hồng platform từ đơn vendor) | model + commission calc + endpoint theo từng vendor | **chưa có endpoint gộp đơn vendor theo 1 CTVH** |
| Dịch vụ VH (`TenantServiceOrder`, B2B) | list + `stats?organization_id=` | chưa gắn vào trang tenant |

## Quyết định đã chốt

- **Bố cục**: Phương án A — giữ 4 tab cũ, thêm 1 tab **"Doanh thu & Đơn hàng"** có 3 sub-tab. Nâng cấp card overview (không tạo card mới).
- **Vendor**: gộp tất cả vendor trong CTVH vào 1 bảng (cần BE mới).
- **(a)** Card overview tính **TỔNG = OG fee + Vendor commission + DVVH revenue** theo cùng một khoảng thời gian.
- **(b)** Hướng nhẹ: FE gọi 3 endpoint rồi cộng KPI ở client; chart xếp chồng từ dữ liệu 3 nguồn. (Chưa làm 1 endpoint tổng hợp BE.)
- **(c)** Sub-tab Dịch vụ VH **chỉ xem** — KHÔNG có nút tạo đơn.

## Khung trang tổng thể

```
Header (giữ nguyên): tên CTVH · badge trạng thái · nút bật/tắt
─────────────────────────────────────────────────────────────
Card "DÒNG TIỀN PLATFORM THU TỪ CTVH NÀY"  [selector 6/12 tháng]
  ┌ TỔNG (cả 3 nguồn) ┬ OG fee ┬ Vendor ┬ Dịch vụ VH ┐
  Chart: 3 nguồn xếp chồng theo tháng + đường tổng
─────────────────────────────────────────────────────────────
Tabs: [Thông tin] [Doanh thu & Đơn hàng] [Tài khoản] [Dịch vụ] [Cấu hình]
```

### Card overview (nâng cấp `TenantBusinessSummaryCard`)
- Ô **TỔNG** là điểm nhấn (cả 3 nguồn cộng lại) + 3 ô con OG / Vendor / DVVH.
- Selector khoảng thời gian 6/12 tháng (mặc định 6).
- Chart đổi từ single-source → **3 nguồn xếp chồng + đường tổng** (tái dùng `SharedDualAxisChart`).
- Tooltip ở ô TỔNG ghi rõ cách cộng (không phải số liệu kế toán) vì 3 nguồn ghi nhận theo mốc khác nhau.

## Tab "Doanh thu & Đơn hàng"

Đầu tab: 1 hàng KPI gọn (tổng + 3 nguồn) để giữ ngữ cảnh khi cuộn. Bên dưới 3 sub-tab (`UTabs`):

### ① OG ticket
- **KPI**: số đơn hoàn thành · doanh thu tenant · phí platform thu (frozen ở kỳ chốt).
- **Bảng đơn**: mã đơn · dự án *(link)* · ngày hoàn thành · tổng đơn · phí platform · kỳ chốt.
- **Shortcut**: "Cấu hình phí theo dự án" → tab Cấu hình / fee-config dự án.
- Dữ liệu: tái dùng `business-summary`; **cần xác minh/bổ sung endpoint list đơn OG theo tenant**.

### ② Vendor
- **KPI**: số đơn vendor · hoa hồng platform thu được.
- **Bảng**: mã đơn · vendor *(link → vendor console)* · dự án *(link)* · tổng đơn · hoa hồng platform · trạng thái.
- **Filter**: vendor · dự án · trạng thái · khoảng thời gian.
- Chỉ tính đơn `Completed` và contract `revenue_recipient = Platform/Mixed`.
- **Shortcut**: "Hợp đồng hoa hồng vendor".
- ⚠️ **Cần BE mới** (xem Khoảng trống Backend).

### ③ Dịch vụ VH (`TenantServiceOrder`) — chỉ xem
- **KPI**: từ `stats?organization_id=` đã có — tổng đơn · doanh thu (Paid) · chờ thanh toán · số đơn Paid.
- **Bảng**: mã TSO · loại (Subscription/Setup/Addon/Invoice) · kỳ · số tiền · trạng thái · ngày thanh toán.
- KHÔNG có nút tạo đơn. Có thể link mở chi tiết đơn (nếu trang chi tiết TSO đã có).
- Dữ liệu: tái dùng list + stats endpoints đã có.

## Quy ước "TỔNG" & mốc thời gian

3 nguồn ghi nhận khác nhau — card overview dùng chung 1 khoảng thời gian:

| Nguồn | Mốc ghi nhận | Điều kiện |
|---|---|---|
| OG fee | tháng của kỳ chốt | đơn `Completed`, phí đã frozen |
| Vendor | `completed_at` của đơn | `Completed` + contract Platform/Mixed |
| DVVH | `paid_at` | `status = Paid` |

## Khoảng trống Backend (đưa vào plan triển khai)

1. **Endpoint Vendor gộp theo CTVH** — `GET /platform/tenants/{id}/vendor-orders` + `.../vendor-orders/summary`: fan-out qua mọi vendor có đơn trong CTVH, tính commission mỗi đơn (đảo chiều `VendorOrderService::listForPartner` → lọc theo tenant/organization thay vì theo partner). Lưu ý cross-DB resi_mart (schema per vendor).
2. **Tổng hợp card overview** — theo quyết định (b): FE gọi 3 endpoint, cộng KPI client-side; chart xếp chồng từ 3 nguồn. (Chưa làm endpoint gộp BE; nâng cấp sau nếu cần.)
3. **List đơn OG theo tenant** — xác minh có sẵn chưa; nếu chưa, bổ sung endpoint list đơn vận hành theo tenant.

## Tái sử dụng (DRY)

- **Frontend**: nâng cấp `TenantBusinessSummaryCard` + `TenantBusinessChart` (không tạo card mới). Dùng lại `SharedDualAxisChart`, `SharedSectionCard`, `UTable`, `UBadge`, `UTabs`. Bảng vendor tham chiếu `VendorOrderPlatformOrdersPanel`; bảng DVVH tái dùng component list `TenantServiceOrder`. API: thêm hàm vào composable tenant (`useTenants.ts`) + tái dùng composable vendor/TSO sẵn có; KHÔNG gọi `$api` URL thô trong page.
- **Backend**: theo quy ước Service → Repository; submodule cùng module import trực tiếp, cross-module (Marketplace ↔ Platform) qua ExternalService.

## Phạm vi KHÔNG làm (YAGNI)

- Không tạo đơn dịch vụ VH từ trang này (chỉ view).
- Không làm endpoint tổng hợp dòng tiền BE ở giai đoạn này (FE tự cộng).
- Không đụng vào logic tính phí/commission hiện có — chỉ đọc và hiển thị.
