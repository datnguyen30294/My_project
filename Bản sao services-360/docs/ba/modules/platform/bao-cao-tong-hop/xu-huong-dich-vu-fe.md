# Xu hướng dịch vụ (Platform) — Đặc tả kỹ thuật Frontend

> Báo cáo #3 | Ngày tạo: 2026-06-18 | Trạng thái: Draft
> Nguồn mockup: `BA-TNP-SERVICES/app/pages/platform/modules/bao-cao-tong-hop/xu-huong-dich-vu.vue` + composable `serviceAdoption` (trong `usePlatformReportData.ts`).
> **Nền tảng chung:** [`./README.md`](./README.md) — route prefix, conventions, fact-set, dependencies. BE: [`./xu-huong-dich-vu-be.md`](./xu-huong-dich-vu-be.md). File này CHỈ mô tả phần riêng của trang FE.

---

## 1. Header

- Trang **Xu hướng dịch vụ** trong cụm Báo cáo tổng hợp Platform (#3).
- Mục tiêu UI: hiển thị 4 KPI, card "Mix sản phẩm vs dịch vụ", bảng "Top offer/dịch vụ theo số đơn", bảng "Đơn theo tháng — SP vs DV". Tất cả đọc-chỉ.

---

## 2. Tổng quan

- Đọc dữ liệu từ endpoint `GET /api/v1/platform/reports/service-adoption` (BE §3) — miền **đơn marketplace vendor resi_mart** (README §3.2). "GMV" ở đây là GMV marketplace, không phải doanh thu tenant.
- Filter kỳ: `months` (1–12, mặc định 6). Toàn bộ trang là số liệu, không có hành động ghi/sửa/xóa.

---

## 3. Trang & route

- **Route:** `/platform/modules/bao-cao-tong-hop/xu-huong-dich-vu` (README bảng §1).
- **Layout:** layout platform hiện hữu (giống các trang console platform khác — kiểm tra sibling trong `pages/platform/modules/`).
- **Nút "Hub":** nút quay về trang Tổng quan báo cáo (`…/bao-cao-tong-hop/tong-quan`) ở đầu trang (đồng nhất các báo cáo khác trong cụm).
- **API composable:** một file module dùng chung cho cụm báo cáo platform (vd `composables/api/usePlatformReports.ts`); thêm hàm `usePlatformServiceAdoptionReport(months)` dùng `useApiFetch<T>` (GET). KHÔNG gọi `$api()`/raw URL trong page (CLAUDE.md FE conventions). Truyền `months` qua query để `refresh()` khi đổi kỳ.

---

## 4. KPI cards

`SharedSectionCard` + grid 4 ô (tái dùng pattern KPI của các báo cáo platform khác). Mỗi ô:

| # | Nhãn | Field | Format |
|---|------|-------|--------|
| 1 | Offer/DV đang active | `kpis.total_offers` | số nguyên (`formatNumber`) |
| 2 | Offer hot nhất | `kpis.top_offer.title` + phụ "{order_count} đơn" | text; `null` → "—" |
| 3 | Tỷ trọng sản phẩm | `kpis.product_share` | `{n}%` |
| 4 | Tỷ trọng dịch vụ | `kpis.service_share` | `{n}%` |

---

## 5. Biểu đồ & bảng

### 5.1 Card "Mix sản phẩm vs dịch vụ" (2 ô)

`SharedSectionCard` chứa 2 ô, mỗi ô tương ứng 1 phần tử `by_type` (product / service):

| Phần tử ô | Field | Format |
|-----------|-------|--------|
| Tiêu đề loại | `by_type[].type.label` | text |
| Badge số đơn | `by_type[].order_count` | `<UBadge>` — số nguyên |
| GMV | `by_type[].gmv` | `formatTenantMoney` |
| Thanh % | `order_count / Σ order_count * 100` | thanh tiến độ (`UProgress` hoặc bar), % theo **số đơn** |

> % của thanh tính ở FE từ `order_count` 2 ô (đồng bộ với `product_share`/`service_share`). Dùng `<UBadge>`/`<UAlert>` thay vì div+Tailwind (CLAUDE.md FE).

### 5.2 Bảng "Top offer / dịch vụ (theo số đơn)"

`UTable`, data = `offers` (đã sort sẵn từ BE, tối đa 15 dòng):

| Cột | Field | Format |
|-----|-------|--------|
| Tên offer | `offers[].title` | text |
| Loại | `offers[].type.label` | `<UBadge>` (màu phân biệt SP/DV) |
| Vendor | `offers[].partner_name` | text |
| Đơn | `offers[].order_count` | số nguyên (`formatNumber`) |
| GMV | `offers[].gmv` | `formatTenantMoney` |

### 5.3 Bảng "Đơn theo tháng — SP vs DV"

`UTable`, data = `monthly` (đủ N tháng, thứ tự thời gian):

| Cột | Field | Format |
|-----|-------|--------|
| Tháng | `monthly[].label` | text (`T{m}/{yyyy}`) |
| Tổng đơn | `monthly[].order_count` | số nguyên |
| SP | `monthly[].product_count` | số nguyên |
| DV | `monthly[].service_count` | số nguyên |
| GMV | `monthly[].gmv` | `formatTenantMoney` |

---

## 6. Hành động & liên kết

- Không có hành động ghi/sửa/xóa (read-only).
- Bộ chọn kỳ `months` (USelect 1/3/6/12 tháng hoặc tương tự sibling) → đổi → `refresh()` (KHÔNG `invalidateQueries`).
- Nút "Hub" về trang Tổng quan báo cáo (§3).

---

## 7. Trạng thái

- **Loading:** `v-if="status === 'pending'"` → skeleton KPI + bảng.
- **Error:** `v-else-if="error"` → `<UAlert color="error" variant="subtle">`.
- **Rỗng:** `total_offers = 0` / `offers = []` → empty state ("Chưa có đơn dịch vụ trong kỳ"); `top_offer = null` → KPI hiển thị "—". `monthly` luôn đủ N tháng (BE lấp 0) nên bảng tháng không bao giờ rỗng.

---

## 8. Ghi chú nghiệp vụ

- "GMV" = giá trị đơn marketplace (vendor resi_mart), **không** phải doanh thu PMC tenant (README §3.2) — tránh nhầm với card "Tổng quan kinh doanh tenant".
- `product_share`/`service_share` tính theo **số đơn**, không theo tiền — nhãn KPI nên ghi rõ "theo số đơn" để người xem không hiểu nhầm là theo doanh số.
- Một "offer" = bộ (vendor + loại + tên): product lấy tên line đầu, service lấy tên dịch vụ → cùng tên dịch vụ ở 2 vendor khác nhau là 2 dòng.
- Số tiền format ở FE (`formatTenantMoney`); BE trả số nguyên đồng (README §5).
- Chạy `typecheck` + `lint` sau mọi thay đổi FE (`docker exec residential_frontend pnpm run typecheck` / `pnpm run lint`).
