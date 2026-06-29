# Báo cáo "Phân khúc cư dân" (Platform) — Đặc tả kỹ thuật Frontend

> Module: `Platform/Report` (báo cáo #4) | Ngày tạo: 2026-06-18 | Trạng thái: Draft
> Nguồn mockup: `BA-TNP-SERVICES/app/pages/platform/modules/bao-cao-tong-hop/phan-khuc-cu-dan.vue` + composable `residentInsights` (trong `usePlatformReportData.ts`).
> **Nền tảng chung:** [`./README.md`](./README.md) — kiến trúc, route prefix, conventions, deps. Bản này CHỈ mô tả phần FE riêng của báo cáo "Phân khúc cư dân".

---

## 1. Header & phạm vi

Trang **đọc-chỉ** trong console platform, hiển thị phân khúc cư dân theo `customer_source` (cư dân dự án vs khách vãng lai) trên miền đơn marketplace. Gọi 1 endpoint GET (BE: [`./phan-khuc-cu-dan-be.md`](./phan-khuc-cu-dan-be.md)).

---

## 2. Tổng quan

- Tiêu thụ duy nhất `GET /api/v1/platform/reports/resident-segments?months={n}`.
- Hiển thị: **4 KPI cards** + **2 segment cards** + **bảng Top khách hàng theo số đơn**.
- `customer_source`: `project` = "Cư dân dự án", `walk_in` = "Khách vãng lai".
- CSAT (`avg_rating`) có thể `null` (chưa wiring rating) → hiển thị "—".

---

## 3. Trang & route

- **Route:** `/platform/modules/bao-cao-tong-hop/phan-khuc-cu-dan` (README §1 bảng).
- **Layout:** layout platform hiện hữu (giống các trang `/platform/modules/*`).
- **Nút quay lại Hub:** liên kết về trang Tổng quan báo cáo `…/tong-quan` (README #0).
- **API composable:** thêm hàm vào composable platform reports (vd `usePlatformReports.ts`) — `usePlatformResidentSegmentReport(months)` dùng `useApiFetch<T>` cho GET; KHÔNG gọi `$fetch` raw trong page (CLAUDE.md FE conventions).
- **Filter kỳ:** select `months` (mặc định 6), đổi giá trị → `refresh()`.

---

## 4. KPI cards

`UPageGrid` / grid 4 cột (responsive về 2/1 cột mobile). Dùng `SharedSectionCard compact` hoặc card KPI dùng chung hiện có — KHÔNG custom `<div>` + Tailwind (CLAUDE.md).

| # | Tiêu đề | Giá trị chính | Phụ chú | Field nguồn |
|---|---------|---------------|---------|-------------|
| 1 | Cư dân có đơn | `active_residents` | `/ {total_residents}` (vd "184 / 512") | `kpis.active_residents`, `kpis.total_residents` |
| 2 | Đơn cư dân dự án | `project_order_share`% | — | `kpis.project_order_share` |
| 3 | Đơn khách vãng lai | `walk_in_order_share`% | — | `kpis.walk_in_order_share` |
| 4 | GMV cư dân dự án | `project_gmv` (format tiền) | "Vãng lai {walk_in_gmv}" | `kpis.project_gmv`, `kpis.walk_in_gmv` |

- Tiền: dùng `formatTenantMoney` (utils dùng chung) — KHÔNG tự format inline.
- %: render số nguyên + ký tự "%".

---

## 5. Biểu đồ & bảng

### 5.1 Hai segment cards

Lặp `segments[]` (2 phần tử: project, walk_in). Mỗi card 1 `SharedSectionCard` (hoặc card dùng chung):

| Vùng | Field | Format |
|------|-------|--------|
| Tiêu đề | `source.label` | "Cư dân dự án" / "Khách vãng lai" |
| Badge số đơn | `order_count` | `UBadge` (KHÔNG span custom) |
| GMV (số lớn) | `gmv` | `formatTenantMoney` |
| CSAT | `avg_rating` + `rated_count` | "{avg_rating} ({rated_count} đánh giá)"; nếu `avg_rating` null → "—" |

### 5.2 Bảng "Top khách hàng theo số đơn"

`UTable`, dữ liệu `top_residents[]` (đã sort desc orderCount từ BE, tối đa 10 dòng).

| Cột | Field | Format |
|-----|-------|--------|
| Khách hàng | `resident_name` | text |
| Số đơn | `order_count` | số nguyên |
| GMV | `gmv` | `formatTenantMoney` |
| CSAT | `avg_rating` / `rated_count` | "{avg_rating}" + phụ "{rated_count}"; null → "—" |

---

## 6. Hành động & liên kết

- **Read-only:** không có nút tạo/sửa/xóa.
- Nút quay về **Hub báo cáo** (`…/tong-quan`).
- Select **kỳ (months)** thay đổi → refetch.
- (Tùy chọn) tên cư dân ở bảng top **không** cần link (danh bạ cư dân thuộc tenant — không có trang chi tiết cross-tenant ở GĐ1).

---

## 7. Trạng thái

- **Loading:** `status === 'pending'` → skeleton/spinner cho KPI + cards + bảng.
- **Error:** `error` → `UAlert color="error" variant="subtle"` với thông báo tiếng Việt + nút thử lại (`refresh()`).
- **Rỗng:** `total` đơn = 0 / `top_residents=[]` → KPI hiện 0, bảng hiện empty state ("Chưa có dữ liệu cư dân trong kỳ"). KHÔNG lỗi.
- **CSAT null:** mọi chỗ CSAT hiển thị "—".

---

## 8. Ghi chú nghiệp vụ

- Dữ liệu đến từ **miền đơn marketplace** (resi_mart), KHÔNG phải đơn PMC nội bộ tenant (README §3.2) — không trộn lẫn với các báo cáo doanh thu PMC.
- `total_residents` là tổng danh bạ cư dân PMC/Customer (mẫu số), khác `active_residents` (cư dân có phát sinh đơn marketplace).
- `project_order_share + walk_in_order_share` có thể không bằng đúng 100% do làm tròn (BE §6) — không cảnh báo, hiển thị nguyên giá trị.
- CSAT phụ thuộc wiring rating (README §9 / `csat-fe.md`) — khi chưa bật, toàn bộ CSAT là "—"; không che/ẩn cột.
- Chạy `typecheck` + `lint` sau mọi thay đổi FE (CLAUDE.md).
