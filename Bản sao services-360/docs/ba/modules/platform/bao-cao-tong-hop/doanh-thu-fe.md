# Báo cáo Doanh thu platform — Đặc tả kỹ thuật Frontend

> Module: `Platform/Report` | Báo cáo #1 | Ngày tạo: 2026-06-18 | Trạng thái: Draft
> Nguồn mockup: `BA-TNP-SERVICES/app/pages/platform/modules/bao-cao-tong-hop/doanh-thu-tong-hop.vue` + composable `usePlatformReportData.ts` (`revenueOverview`).
> **Nền tảng chung:** [`./README.md`](./README.md) — route prefix, conventions response/tiền/enum, fact-set, ánh xạ nguồn dữ liệu. File này CHỈ mô tả phần FE riêng của báo cáo Doanh thu.

---

## 1. Tổng quan

Trang **Doanh thu platform** hiển thị bức tranh thu nền tảng theo 3 nguồn, theo loại đơn B2B, theo công ty VH, và xu hướng theo tháng. Read-only — không có thao tác tạo/sửa/xóa. Gọi đúng 1 endpoint `GET /api/v1/platform/reports/revenue`.

> ⚠️ FE phải thể hiện **3 nguồn doanh thu** (B2B + hoa hồng marketplace platform + phí nền tảng PMC), trong đó **phí nền tảng PMC (`pmcPlatformFee`) là KPI mới** so với mockup (deviation #4 — xem [`doanh-thu-be.md`](./doanh-thu-be.md) §1). Mockup chỉ có 2 nguồn — FE bổ sung.

---

## 2. Trang & route

| Mục | Giá trị |
|-----|---------|
| Route | `/platform/modules/bao-cao-tong-hop/doanh-thu-tong-hop` |
| Layout | layout platform (console vận hành nền tảng) |
| Quyền | `platform.reports.view` (theo cơ chế phân quyền platform hiện có) |
| Điều hướng | nút/breadcrumb **"Hub báo cáo"** → `…/bao-cao-tong-hop/tong-quan` |

---

## 3. API composable

- File: `app/composables/api/usePlatformReports.ts` (1 file cho cụm báo cáo platform; nếu chưa có → tạo).
- Query GET: `useRevenueReport(months)` dùng `useApiFetch<RevenueReport>('/api/v1/platform/reports/revenue', { query: { months } })`.
- KHÔNG gọi `$api()`/raw URL trong page — luôn dùng hàm từ composable (CLAUDE.md FE rules).
- Type `RevenueReport` khớp shape BE §6 (`kpis`, `byB2bType`, `byTenant`, `analyticsMonths`, `monthlyB2b`, `monthlyMarketplace`); enum field = `{ value, label }`.

---

## 4. KPI cards

Grid 4 thẻ (dùng `SharedSectionCard`/Nuxt UI card — KHÔNG custom div+Tailwind):

| Nhãn | Dữ liệu (field) | Ghi chú |
|------|-----------------|---------|
| Tổng thu platform | `kpis.totalPlatformRevenue` | màu `success`; = B2B + hoa hồng platform + phí PMC (tooltip nêu 3 nguồn) |
| Doanh thu B2B đã thu | `kpis.b2bRevenue` | phụ đề: `{kpis.b2bPaidCount}` đơn đã thu |
| GMV marketplace | `kpis.marketplaceGmv` | phụ đề: `{kpis.orderCount}` đơn |
| Phí platform marketplace | `kpis.marketplacePlatformFee` | phụ đề: "VH nhận {formatTenantMoney(kpis.marketplaceVhShare)}" |
| Phí nền tảng PMC **(MỚI)** | `kpis.pmcPlatformFee` | thẻ thứ 5 (deviation #4) — phí `frozen_platform_fee` đơn PMC across tenant |

- Tất cả số tiền format qua `formatTenantMoney` (VND, số nguyên đồng từ BE).
- Có thể bố trí grid 5 thẻ (hoặc 4 + 1 hàng dưới) để chứa thẻ `pmcPlatformFee` mới.

---

## 5. Biểu đồ & bảng

### 5.1 Chart xu hướng (3 series) — `analyticsMonths`

- Component: `SharedDualAxisChart` (đã có; tiền lệ console Quản lý Vendor).
- **Nhãn ĐÚNG:** "Xu hướng kinh doanh PMC across tenant (N tháng)" — **KHÔNG** dùng nhãn mockup "Xu hướng GMV marketplace" (dữ liệu thật là PMC, không phải marketplace — BE §4.4, README §3.2).
- Trục X: `monthLabel`. 3 series:

| Series | Loại | Field | Format |
|--------|------|-------|--------|
| GMV PMC tenant | bar | `tenantRevenue` | VND |
| Số đơn | line | `orderCount` | số nguyên |
| Phí nền tảng PMC | line | `platformRevenue` | VND |

### 5.2 Bảng "Doanh thu B2B theo loại đơn" — `byB2bType`

| Cột | Field | Format |
|-----|-------|--------|
| Loại đơn | `type.label` | text (enum `{value,label}`) |
| Số đơn | `count` | số nguyên |
| Giá trị | `revenue` | `formatTenantMoney` (VND) |

### 5.3 Bảng "Thu platform theo công ty VH" — `byTenant` (sort desc `totalPlatformRevenue`)

| Cột | Field | Format |
|-----|-------|--------|
| Công ty VH | `companyName` | text |
| Trạng thái | `status.label` | `UBadge` (enum `{value,label}`) |
| Dự án | `projectCount` | số nguyên |
| Số đơn PMC | `orderCount` | số nguyên |
| GMV PMC (tham khảo) | `tenantRevenue` | VND — doanh thu tenant, KHÔNG phải thu nền tảng |
| B2B đã thu | `b2bRevenue` | VND |
| Phí nền tảng PMC | `platformRevenue` | VND |
| **Tổng thu platform** | `totalPlatformRevenue` | VND — in đậm; = `platformRevenue + b2bRevenue` |

- Dùng `UTable`. Cột "GMV PMC" gắn nhãn/tooltip làm rõ không cộng vào tổng thu nền tảng (tránh hiểu nhầm trộn miền).

---

## 6. Hành động & liên kết

- Bộ lọc kỳ: `USelect`/`UInput` cho `months` (1–12, mặc định 6) → cập nhật query → `refresh()` (KHÔNG `invalidateQueries`).
- Nút "Hub báo cáo" → `…/bao-cao-tong-hop/tong-quan`.
- (Tùy chọn) click dòng `byTenant` → trang chi tiết công ty VH platform.
- Read-only — không nút tạo/sửa/xóa/xuất ghi.

---

## 7. Trạng thái

- Loading: `v-if="status === 'pending'"` → skeleton cho KPI + chart + 2 bảng.
- Error: `v-else-if="error"` → `UAlert` color `error`.
- Rỗng: tenant/partner chưa phát sinh → KPI hiển thị 0, bảng rỗng có `empty state`, chart đủ N tháng giá trị 0 (BE đã lấp).

---

## 8. Ghi chú nghiệp vụ

- **3 nguồn doanh thu nền tảng** (giải thích cho người xem console):
  1. **B2B** — phí nền tảng thu trực tiếp từ công ty VH (thuê bao/khởi tạo/tiện ích), tính phần **đã thu (paid)**.
  2. **Hoa hồng marketplace** — phần hoa hồng đơn vendor resi_mart mà **nền tảng nhận** (`recipient = platform`); phần công ty VH nhận hiển thị riêng ("VH nhận …").
  3. **Phí nền tảng PMC** — phí `frozen_platform_fee` trên mỗi đơn PMC nội bộ tenant (đã đóng băng tại kỳ chốt). **Mới bổ sung** so với mockup.
  - `totalPlatformRevenue` = tổng cả 3.
- **Không trộn miền:** GMV marketplace, GMV PMC (`tenantRevenue`), doanh thu B2B là 3 con số khác miền — hiển thị tách bạch, không cộng nhầm (README §3.2).
- **Định dạng tiền:** mọi giá trị VND là số nguyên đồng từ BE, format hiển thị bằng `formatTenantMoney`. KHÔNG tự chia/làm tròn ở FE.
- Chạy `typecheck` sau mọi thay đổi FE (CLAUDE.md FE rules).
