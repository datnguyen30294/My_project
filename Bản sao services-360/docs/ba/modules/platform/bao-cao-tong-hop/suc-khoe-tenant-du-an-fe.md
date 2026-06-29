# Sức khỏe tenant & dự án (Platform) — Đặc tả kỹ thuật Frontend

> Báo cáo #5 | Ngày tạo: 2026-06-18 | Trạng thái: Draft
> Nguồn mockup: `BA-TNP-SERVICES/app/pages/platform/modules/bao-cao-tong-hop/suc-khoe-tenant-du-an.vue` + composable `tenantProjectHealth` (trong `usePlatformReportData.ts`).
> **Nền tảng chung:** [`./README.md`](./README.md) — route prefix, conventions, fact-set, dependencies. BE: [`./suc-khoe-tenant-du-an-be.md`](./suc-khoe-tenant-du-an-be.md). File này CHỈ mô tả phần riêng của trang FE.

---

## 1. Header

- Trang **Sức khỏe tenant & dự án** trong cụm Báo cáo tổng hợp Platform (#5).
- Mục tiêu UI: bộ lọc theo công ty VH + 2 bảng — "Sức khỏe theo công ty vận hành" (cross-tenant) và "Chi tiết theo dự án" (drill-down). Tất cả đọc-chỉ.

---

## 2. Tổng quan

- Đọc dữ liệu từ endpoint `GET /api/v1/platform/reports/tenant-health` (BE §3).
- Báo cáo **trộn hai miền có kiểm soát** (README §3.2): GMV/phí/CSAT/đơn phân khúc = **đơn marketplace vendor resi_mart**; cột "Δ đơn T-1" = **xu hướng số đơn PMC**. Toàn trang là số liệu, không có hành động ghi/sửa/xóa.
- Filter: `months` (1–12, mặc định 6) + `company_id` (tùy chọn — "Tất cả công ty").

---

## 3. Trang & route

- **Route:** `/platform/modules/bao-cao-tong-hop/suc-khoe-tenant-du-an` (README bảng §1).
- **Layout:** layout platform hiện hữu (`definePageMeta({ layout: 'platform' })` — giống các trang console platform khác).
- **Nút "Hub":** nút quay về trang Tổng quan báo cáo (`…/bao-cao-tong-hop/tong-quan`) ở đầu trang qua `UPageHeader #links` (đồng nhất các báo cáo khác trong cụm; mockup dùng `UButton` icon `i-lucide-layout-dashboard`).
- **API composable:** file module dùng chung cho cụm báo cáo platform (vd `composables/api/usePlatformReports.ts`); thêm hàm `usePlatformTenantHealthReport(params)` dùng `useApiFetch<T>` (GET). KHÔNG gọi `$api()`/raw URL trong page (CLAUDE.md FE). Truyền `months` + `company_id` qua query để `refresh()` khi đổi bộ lọc.

---

## 4. Bộ lọc

`UCard` (hoặc `SharedSectionCard`) "Lọc theo công ty VH":

| Bộ lọc | Component | Hành vi |
|--------|-----------|---------|
| Công ty VH | `USelect` | items = `[{ value: null, label: 'Tất cả công ty VH' }, ...by_company.map(c => ({ value: company_id, label: company_name }))]`; `placeholder="Tất cả công ty"`; chọn → lọc **cả 2 bảng** |
| Kỳ (tháng) | `USelect` (1/3/6/12) | optional — sibling các báo cáo khác; đổi → `refresh()` |

- **Lọc công ty áp cả 2 bảng** (đồng nhất mockup): `by_company` → chỉ tenant đã chọn; `by_project` → chỉ dự án thuộc tenant đó.
- **Quyết định lúc code:** mockup lọc client-side; nhưng BE đã nhận `company_id` (BE §4) → ưu tiên truyền `company_id` qua query và để BE lọc (giảm tải loop), `refresh()` khi đổi. (Nếu giữ client-side: options công ty vẫn lấy từ `by_company` đầy đủ — cần fetch không filter lần đầu.)

---

## 5. Bảng

### 5.1 Bảng "Sức khỏe theo công ty vận hành"

`UCard` + `UTable`, data = `by_company` (đã sort `gmv` desc từ BE):

| Cột | Field | Format |
|-----|-------|--------|
| Công ty VH | `company_name` | text |
| Trạng thái | `status` | `<UBadge>` — `status.label` ("Hoạt động"/"Vô hiệu"), màu phân biệt active/inactive (KHÔNG span+Tailwind — CLAUDE.md FE) |
| Dự án | `project_count` | số nguyên (`formatNumber`) |
| Đơn MKP | `order_count` | số nguyên — **đơn marketplace** |
| GMV | `gmv` | `formatTenantMoney` — **GMV marketplace** |
| Phí platform | `platform_fee` | `formatTenantMoney` — phí platform marketplace |
| CSAT | `avg_rating` + `rated_count` | `residentRatingAvgLabel(avg_rating, rated_count)` (tái dùng util); `rated_count=0` / `avg_rating=null` → "—" |
| Δ đơn T-1 | `order_trend` | số nguyên có dấu: `t > 0 ? '+'+t : ''+t` (mockup); màu xanh/đỏ tùy dấu — **Δ đơn PMC** |

### 5.2 Bảng "Chi tiết theo dự án"

`UCard` + `UTable`, data = `by_project` (chỉ dự án có đơn, sort `gmv` desc từ BE):

| Cột | Field | Format |
|-----|-------|--------|
| Dự án | `project_name` | text |
| Công ty VH | `company_name` | text |
| Đơn | `order_count` | số nguyên |
| GMV | `gmv` | `formatTenantMoney` — GMV marketplace |
| CSAT | `avg_rating` + `rated_count` | `residentRatingAvgLabel(...)`; null → "—" |
| Đơn CD dự án | `project_residents` | số nguyên (đơn `customer_source = project`) |
| Đơn vãng lai | `walk_in_residents` | số nguyên (đơn `customer_source = walk_in`) |

> Tái dùng `residentRatingAvgLabel` (util đã có, mockup import từ `~/utils/residentRating`) cho cột CSAT ở cả 2 bảng. Số tiền format ở FE; BE trả số nguyên đồng (README §5).

---

## 6. Hành động & liên kết

- Không có hành động ghi/sửa/xóa (read-only).
- **Drill-down dự án:** bộ lọc công ty VH là cơ chế drill-down chính — chọn 1 công ty → bảng "Chi tiết theo dự án" thu về các dự án của công ty đó. (Tùy chọn nâng cao lúc code: click hàng dự án → điều hướng tới trang chi tiết dự án nền tảng `…/du-an-tren-nen-tang/{projectId}` nếu cần — không bắt buộc theo mockup.)
- Bộ chọn kỳ `months` → đổi → `refresh()` (KHÔNG `invalidateQueries`).
- Nút "Hub" về trang Tổng quan báo cáo (§3).

---

## 7. Trạng thái

- **Loading:** `v-if="status === 'pending'"` → skeleton 2 bảng (mockup dùng `v-if="!ready"` → "Đang tải dữ liệu…").
- **Error:** `v-else-if="error"` → `<UAlert color="error" variant="subtle">`.
- **Rỗng:** `by_company = []` → empty state ("Chưa có công ty vận hành / đơn trong kỳ"); `by_project = []` → empty state bảng dự án ("Chưa có dự án phát sinh đơn"). `avg_rating = null` → CSAT hiển thị "—".

---

## 8. Ghi chú nghiệp vụ

- ⚠️ Cột **"GMV"** = giá trị **đơn marketplace** (vendor resi_mart), **KHÔNG** phải doanh thu PMC tenant (README §3.2). "Phí platform" cột này = phí trên đơn marketplace, không phải `frozen_platform_fee` PMC. Tránh nhầm với card "Tổng quan kinh doanh tenant".
- Cột **"Δ đơn T-1"** = chênh lệch **số đơn PMC** tháng cuối so tháng kề trước (miền PMC, KHÔNG phải Δ đơn marketplace) — hiển thị dấu `+/-`.
- **Lọc công ty VH áp cả 2 bảng** — đây là hành vi bắt buộc (đồng nhất mockup).
- CSAT phụ thuộc **wiring đánh giá cư dân** (README §9) — nếu chưa wiring thì `avg_rating` null toàn bộ ⇒ cột CSAT hiển thị "—" (không lỗi).
- Dùng `<UBadge>`/`<UAlert>`/`SharedSectionCard` thay vì div+Tailwind cho badge/alert/card (CLAUDE.md FE).
- Chạy `typecheck` + `lint` sau mọi thay đổi FE (`docker exec residential_frontend pnpm run typecheck` / `pnpm run lint`).
