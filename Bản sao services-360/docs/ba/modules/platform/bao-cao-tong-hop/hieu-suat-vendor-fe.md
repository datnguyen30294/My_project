# Báo cáo "Hiệu suất vendor" (Platform) — Đặc tả kỹ thuật Frontend

> Module: `Platform/Report` | Báo cáo #7 | Ngày tạo: 2026-06-18 | Trạng thái: Draft
> Nguồn mockup: `BA-TNP-SERVICES/app/pages/platform/modules/bao-cao-tong-hop/hieu-suat-vendor.vue` + composable `usePlatformReportData.ts` (`vendorScorecard`).
> **Nền tảng chung (BẮT BUỘC đọc trước):** [`./README.md`](./README.md) — route prefix, conventions FE, fact-set, ánh xạ nguồn dữ liệu. BE tương ứng: [`./hieu-suat-vendor-be.md`](./hieu-suat-vendor-be.md).
>
> File này CHỈ mô tả phần riêng FE của báo cáo "Hiệu suất vendor".

## 1. Tổng quan

Trang báo cáo **đọc-chỉ** hiển thị **một bảng scorecard so sánh chéo toàn bộ vendor (đối tác B3)** có phát sinh đơn marketplace, xếp giảm dần theo GMV. Mỗi dòng = một vendor với chỉ số: số đơn, GMV, phí platform, tỷ lệ hoàn tất/huỷ, CSAT, số sản phẩm/dịch vụ. Click tên vendor để mở chi tiết vendor trong console "Quản lý Vendor".

Không có form, không hành động ghi. Đây là **layer báo cáo** đặt trên dữ liệu marketplace đã có.

## 2. Trang & Route

| Thuộc tính | Giá trị |
|-----------|---------|
| Route | `/platform/modules/bao-cao-tong-hop/hieu-suat-vendor` |
| Layout | `platform` (`definePageMeta({ layout: 'platform' })`) |
| File page | `app/pages/platform/modules/bao-cao-tong-hop/hieu-suat-vendor.vue` |
| Header | `UPageHeader` title "Hiệu suất vendor" |

**Nút trên header (`#links`):**

- **Hub báo cáo** → `/platform/modules/bao-cao-tong-hop/tong-quan` (`UButton variant="outline"`, icon `i-lucide-layout-dashboard`).
- **Quản lý vendor** → `/platform/modules/quan-ly-van-hanh/quan-ly-vendor` (`UButton variant="subtle"`, icon `i-lucide-store`).

## 3. API & Composable

- Endpoint: `GET /api/v1/platform/reports/vendor-scorecard?months=6` (BE §3).
- API composable: thêm hàm `useVendorScorecardReport()` vào composable báo cáo platform (ví dụ `composables/api/usePlatformReports.ts`) dùng `useApiFetch<T>(url, opts)` — KHÔNG gọi `$fetch` raw trong page (CLAUDE.md). Trả `{ months, vendors: [...] }`.
- Loading: `v-if="status === 'pending'"`; error: `v-else-if="error"`.

## 4. Bảng scorecard

Một `SharedSectionCard` (hoặc `UCard`) tiêu đề **"Scorecard đối tác B3"**, phụ đề "Xếp theo GMV — click vendor để xem chi tiết vận hành.", chứa `UTable :data="vendors" :columns="columns"`.

| Cột (header) | Field BE | Format hiển thị |
|--------------|----------|-----------------|
| Vendor | `partner_name` (+ `partner_id`) | `NuxtLink` → chi tiết vendor (xem §5), in đậm `text-primary hover:underline` |
| Đơn | `order_count` | số nguyên |
| GMV | `gmv` | `formatTenantMoney(gmv)` |
| Phí platform | `platform_fee` | `formatTenantMoney(platform_fee)` |
| Hoàn tất | `completion_rate` | `${completion_rate}%` |
| Huỷ | `cancel_rate` | `${cancel_rate}%` |
| CSAT | `avg_rating` / `rated_count` | `residentRatingAvgLabel(avg_rating, rated_count)` → "—" nếu `avg_rating` null |
| SP / DV | `product_count` / `service_count` | `${product_count} / ${service_count}` |

- Tái dùng helper format có sẵn: `formatTenantMoney` (tiền) và `residentRatingAvgLabel` (CSAT) — KHÔNG viết lại logic format.
- Trạng thái vendor (`status`) có sẵn trong payload nhưng mockup không render cột riêng; có thể bổ sung `UBadge` cạnh tên nếu cần (không bắt buộc — bám mockup).

## 5. Hành động & liên kết

- **Cross-link chi tiết vendor:** cột Vendor là `NuxtLink` tới `/platform/modules/quan-ly-van-hanh/quan-ly-vendor/{partner_id}` — trang chi tiết của console "Quản lý Vendor" ([`../quan-ly-vendor-fe.md`](../quan-ly-vendor-fe.md)). Đây là đường dẫn duy nhất từ báo cáo sang quản lý vendor.
- **Nút "Quản lý vendor"** (header) → trang danh sách console "Quản lý Vendor".
- Không có hành động ghi/sửa/xoá trên trang này.

## 6. Trạng thái

- **Loading:** `v-if="status === 'pending'"` — placeholder "Đang tải dữ liệu…".
- **Empty:** khi `vendors.length === 0` → `UEmpty` title "Chưa có vendor có đơn", description "Chưa có đối tác nào phát sinh đơn marketplace trong kỳ." (chỉ vendor có đơn mới hiển thị — BE §6).
- **Error:** `v-else-if="error"` — `UAlert color="error" variant="subtle"` thông báo lỗi tải báo cáo.

## 7. Ghi chú nghiệp vụ

- **CSAT phụ thuộc wiring rating:** `avg_rating`/`rated_count` chỉ có dữ liệu sau khi wiring `resident_rating` + `partner_id` lên đơn marketplace (README §9, [`./csat-be.md`](./csat-be.md)). Trước wiring, BE trả `avg_rating = null` ⇒ cột CSAT hiển thị "—" (qua `residentRatingAvgLabel`). FE không cần xử lý đặc biệt — helper đã handle null.
- **GMV vs tỷ lệ:** GMV/Phí platform tính trên đơn active (đã loại huỷ), còn Hoàn tất/Huỷ tính trên tổng đơn — đây là chủ đích (BE §5.3), không phải bất nhất số liệu.
- **Chỉ miền marketplace:** mọi số liệu là đơn vendor resi_mart, KHÔNG gồm đơn PMC nội bộ tenant (README §3.2).
- Chạy `pnpm run typecheck` + `pnpm run lint` sau khi sửa FE (CLAUDE.md).
