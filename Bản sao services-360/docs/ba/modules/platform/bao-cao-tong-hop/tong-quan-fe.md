# Tổng quan báo cáo (Hub) — Đặc tả Frontend

> Module: `Platform/Report` | Ngày tạo: 2026-06-18 | Trạng thái: Draft
> Nguồn mockup: `BA-TNP-SERVICES/app/pages/platform/modules/bao-cao-tong-hop/tong-quan.vue` (composable `hubSummary`).
> Nền tảng chung: [`./README.md`](./README.md) — kiến trúc, route prefix, hai miền đơn hàng, conventions response `{success,data}` + tiền số nguyên VND + enum `{value,label}` (README §5).

## 1. Tổng quan

Trang **Tổng quan báo cáo** là **trang chủ điều hướng** của cụm "Báo cáo tổng hợp" platform: trên cùng là **4 thẻ KPI tổng**, bên dưới là **7 thẻ điều hướng** dẫn tới từng báo cáo chi tiết. Đây là trang **đọc-chỉ**, không có thao tác ghi/sửa. Toàn bộ dữ liệu lấy từ **một** endpoint hub (`GET /api/v1/platform/reports/overview`).

Lưu ý nghiệp vụ quan trọng (README §3.2): "Doanh thu platform" và "GMV marketplace" là **hai chỉ số khác miền** — KPI hiển thị riêng, không gộp. "Doanh thu platform" gồm **3 nguồn** (B2B + hoa hồng marketplace + phí PMC — README §2 Quyết định #4).

## 2. Trang & route

| Thuộc tính | Giá trị |
|-----------|---------|
| Route FE | `/platform/modules/bao-cao-tong-hop/tong-quan` |
| Layout | `platform` |
| File page | `app/pages/platform/modules/bao-cao-tong-hop/tong-quan.vue` |
| API | `useReportOverview()` trong `app/composables/api/usePlatformReports.ts` → `useApiFetch('/api/v1/platform/reports/overview')` |

- Tất cả URL của cụm báo cáo định nghĩa trong **một** composable `usePlatformReports.ts` (mỗi báo cáo 1 hàm `use{Report}()`). Page KHÔNG gọi `useApiFetch` với URL thô.
- GET → dùng `useApiFetch<T>` (query), không `$api` (không có mutation).

## 3. KPI cards (4 thẻ tổng)

| Nhãn | Dữ liệu | Ghi chú |
|------|---------|---------|
| Doanh thu platform | `kpis.total_platform_revenue` | `formatTenantMoney` (VND). Màu `success`. Gồm 3 nguồn (B2B + hoa hồng + phí PMC) |
| GMV marketplace | `kpis.marketplace_gmv` | `formatTenantMoney` (VND). Chỉ số tách biệt — KHÔNG cộng vào doanh thu platform |
| CSAT trung bình | `kpis.avg_rating` + `kpis.rated_count` | Hiển thị `avg_rating` (vd "4.6"), dòng phụ "{rated_count} đơn đánh giá" |
| Cư dân có đơn | `kpis.active_residents` + `kpis.total_residents` | Hiển thị "{active_residents} / {total_residents}" |

- Dùng thẻ KPI sẵn có của console platform (kiểm `SharedStatCard`/`SharedSectionCard` hoặc thẻ KPI dùng ở trang doanh thu tenant — README §5 conventions FE; ưu tiên tái dùng, KHÔNG tự viết `<div>` + Tailwind).
- Tiền format bằng `formatTenantMoney` (đã có); KHÔNG format ở BE.

## 4. Thẻ điều hướng 7 báo cáo

Render từ `data.report_cards` (BE trả mảng đúng thứ tự). Mỗi thẻ: icon + tiêu đề + blurb + một KPI headline (`formatTenantMoney` nếu là tiền, hoặc count) + dòng `sub`, click dẫn tới route đích (`navigateTo(card.route)`).

| # | Tiêu đề | KPI hiển thị (headline) | Route đích |
|---|---------|--------------------------|-----------|
| 1 | Doanh thu platform | `total_platform_revenue` (formatMoney) | `…/doanh-thu-tong-hop` |
| 2 | Chất lượng & CSAT | `avg_rating` + sub "{rated_count} đơn đánh giá" | `…/chat-luong-csat` |
| 3 | Xu hướng dịch vụ | `marketplace_gmv` (formatMoney) | `…/xu-huong-dich-vu` |
| 4 | Phân khúc cư dân | `active_residents` + sub "/ {total_residents} cư dân" | `…/phan-khuc-cu-dan` |
| 5 | Sức khỏe tenant & dự án | `tenant_count` (count) | `…/suc-khoe-tenant-du-an` |
| 6 | Hoa hồng & phân bổ | hoa hồng platform (formatMoney) | `…/hoa-hong-phan-bo` |
| 7 | Hiệu suất vendor | `vendor_count` (count) | `…/hieu-suat-vendor` |

> Prefix route: `/platform/modules/bao-cao-tong-hop/` (README §1 bảng 8 trang). Lấy `route` trực tiếp từ `card.route` để FE không hardcode lệch.

## 5. Hành động & liên kết

- **Click thẻ điều hướng** → `navigateTo(card.route)` sang báo cáo chi tiết.
- **Không** có nút tạo/sửa/xóa (read-only).
- Có thể có bộ chọn kỳ `months` (1–12, mặc định 6) ở đầu trang nếu thống nhất với các báo cáo con — `useReportOverview({ months })`; refetch qua `refresh()` của `useFetch` khi đổi kỳ (KHÔNG `invalidateQueries`).

## 6. Trạng thái

- **Loading:** `v-if="status === 'pending'"` → skeleton cho KPI cards + thẻ điều hướng.
- **Error:** `v-else-if="error"` → `<UAlert color="error" variant="subtle">` thông báo không tải được báo cáo.
- **Dữ liệu minh họa:** trong GĐ mockup/chưa wiring CSAT, hiển thị `<UAlert color="warning" variant="subtle">` báo "Số liệu hiển thị mang tính minh họa, sẽ thay bằng dữ liệu thật sau khi hoàn tất tích hợp" (đặc biệt KPI CSAT phụ thuộc wiring rating — README §9). Dùng `UAlert`, KHÔNG custom `<div>` + Tailwind (README §5).
- **Rỗng:** KPI = 0 / count = 0 vẫn render bình thường (BE trả 0 khi tenant/partner rỗng).

## 7. Ghi chú nghiệp vụ

- **Doanh thu platform ≠ GMV marketplace** (hai miền — README §3.2). Doanh thu platform = 3 nguồn (B2B + hoa hồng recipient=platform + phí PMC frozen); GMV là tổng giá trị đơn marketplace, là dòng tiền của vendor, KHÔNG phải doanh thu nền tảng.
- Hub chỉ là **điểm vào**; mọi phân tích sâu nằm ở 7 báo cáo chi tiết. KPI hub khớp với phần tổng của từng báo cáo (BE đảm bảo lấy lại từ cùng service — xem `tong-quan-be.md` §4).
- CSAT (`avg_rating`/`rated_count`) phụ thuộc wiring đánh giá cư dân trên đơn marketplace (README §9) — trước wiring có thể là minh họa.
- Tiền luôn `formatTenantMoney` ở FE; rating hiển thị 1 chữ số thập phân.
- Typecheck sau mọi sửa FE (`docker exec residential_frontend pnpm run typecheck`).
```
