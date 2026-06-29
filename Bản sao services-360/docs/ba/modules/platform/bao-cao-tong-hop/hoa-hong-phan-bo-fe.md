# Báo cáo Hoa hồng & phân bổ — Đặc tả kỹ thuật Frontend

> Module: `Platform/Report` | Báo cáo #6 | Ngày tạo: 2026-06-18 | Trạng thái: Draft
> Nguồn mockup: `BA-TNP-SERVICES/app/pages/platform/modules/bao-cao-tong-hop/hoa-hong-phan-bo.vue` + composable `usePlatformReportData.ts` (`commissionReport`).
> **Nền tảng chung:** [`./README.md`](./README.md) — route prefix, conventions response/tiền/enum, fact-set, ánh xạ nguồn dữ liệu. File này CHỈ mô tả phần FE riêng của báo cáo Hoa hồng & phân bổ.

---

## 1. Tổng quan

Trang **Hoa hồng & phân bổ** hiển thị tổng hoa hồng vendor toàn nền tảng và **cách chia về 2 đối tượng nhận**: Platform (TNP) và công ty vận hành (VH). Read-only — không có thao tác tạo/sửa/xóa. Gọi đúng 1 endpoint `GET /api/v1/platform/reports/commission-allocation`.

> Báo cáo chỉ tính trên **đơn marketplace** (vendor resi_mart). KHÔNG trộn với phí nền tảng PMC / phí B2B (README §3.2 — xem [`hoa-hong-phan-bo-be.md`](./hoa-hong-phan-bo-be.md) §1).

---

## 2. Trang & route

| Mục | Giá trị |
|-----|---------|
| Route | `/platform/modules/bao-cao-tong-hop/hoa-hong-phan-bo` |
| Layout | layout platform (console vận hành nền tảng) |
| Quyền | `platform.reports.view` (theo cơ chế phân quyền platform hiện có) |
| Điều hướng | nút **"Hub báo cáo"** → `…/bao-cao-tong-hop/tong-quan` |

---

## 3. API composable

- File: `app/composables/api/usePlatformReports.ts` (1 file cho cụm báo cáo platform; nếu chưa có → tạo).
- Query GET: `useCommissionAllocationReport(months)` dùng `useApiFetch<CommissionAllocationReport>('/api/v1/platform/reports/commission-allocation', { query: { months } })`.
- KHÔNG gọi `$api()`/raw URL trong page — luôn dùng hàm từ composable (CLAUDE.md FE rules).
- Type `CommissionAllocationReport` khớp shape BE §6 (`kpis`, `byRecipient`, `byVendor`, `byProject`); tiền = số nguyên đồng, `%` = số nguyên.

---

## 4. KPI cards

Grid 4 thẻ (dùng `SharedSectionCard`/Nuxt UI card — KHÔNG custom div+Tailwind):

| Nhãn | Dữ liệu (field) | Ghi chú |
|------|-----------------|---------|
| Tổng hoa hồng / phí | `kpis.commissionTotal` | tổng hoa hồng tất cả đơn active |
| Platform nhận | `kpis.platformTotal` | màu `success`; phụ đề: `{kpis.platformSharePct}% tổng hoa hồng` |
| VH nhận | `kpis.vhTotal` | phụ đề: `{kpis.vhSharePct}% tổng hoa hồng` |
| Tỷ lệ platform | `kpis.platformSharePct` | hiển thị `{...}%` |

- Tất cả số tiền format qua `formatTenantMoney` (VND, số nguyên đồng từ BE).
- `%` từ BE đã là số nguyên — chỉ nối hậu tố `%`, KHÔNG tự tính.

---

## 5. Biểu đồ & bảng

### 5.1 Card "Phân bổ theo đối tượng nhận"

`SharedSectionCard` (hoặc `UCard`) chứa 2 phần:

**a) Hai ô lớn split Platform vs Công ty VH** (đầu card):

| Ô | Tiêu đề | Giá trị | Phụ đề | Style |
|---|---------|---------|--------|-------|
| Platform | "Platform" | `formatTenantMoney(kpis.platformTotal)` | `{kpis.platformSharePct}% tổng hoa hồng` | nhấn màu `success` |
| Công ty VH | "Công ty VH" | `formatTenantMoney(kpis.vhTotal)` | `{kpis.vhSharePct}% tổng hoa hồng` | trung tính |

> Hai ô này là điểm nhấn trực quan (Platform nhận vs VH nhận). Ưu tiên `UCard`/`SharedSectionCard` hoặc `UBadge` cho phần nổi bật — KHÔNG custom `<div>`+Tailwind cho khối alert/badge nếu Nuxt UI/Shared đã có (CLAUDE.md FE rules).

**b) Bảng `byRecipient`** (`UTable`, sort desc `amount` từ BE):

| Cột | Field | Format |
|-----|-------|--------|
| Đối tượng nhận | `label` | text (Platform TNP / tên công ty VH) |
| Số đơn | `orderCount` | số nguyên |
| Số tiền | `amount` | `formatTenantMoney` (VND) |

### 5.2 Bảng "Theo vendor" — `byVendor` (`UTable`, sort desc `commission` từ BE)

| Cột | Field | Format |
|-----|-------|--------|
| Vendor | `partnerName` | text |
| Đơn | `orderCount` | số nguyên |
| Hoa hồng | `commission` | `formatTenantMoney` (VND) |
| Platform | `platformShare` | `formatTenantMoney` (VND) |
| VH | `vhShare` | `formatTenantMoney` (VND) |

### 5.3 Bảng "Theo dự án" — `byProject` (`UTable`, sort desc `platformShare` từ BE)

| Cột | Field | Format |
|-----|-------|--------|
| Dự án | `projectName` | text |
| Đơn | `orderCount` | số nguyên |
| Platform | `platformShare` | `formatTenantMoney` (VND) |
| VH | `vhShare` | `formatTenantMoney` (VND) |

> Bố cục: card "Phân bổ theo đối tượng nhận" trải đủ chiều ngang, rồi 2 bảng vendor/dự án xếp grid 2 cột (`lg:grid-cols-2`) như mockup.

---

## 6. Hành động & liên kết

- Bộ lọc kỳ: `USelect`/`UInput` cho `months` (1–12, mặc định 6) → cập nhật query → `refresh()` (KHÔNG `invalidateQueries`).
- Nút "Hub báo cáo" → `…/bao-cao-tong-hop/tong-quan`.
- (Tùy chọn) click dòng `byVendor` → trang chi tiết vendor console Quản lý Vendor; click dòng `byProject` → trang dự án trên nền tảng.
- Read-only — không nút tạo/sửa/xóa/xuất ghi.

---

## 7. Trạng thái

- Loading: `v-if="status === 'pending'"` → skeleton cho KPI + card phân bổ + 2 bảng.
- Error: `v-else-if="error"` → `UAlert` color `error`.
- Rỗng: partner chưa phát sinh đơn / `commissionTotal = 0` → KPI hiển thị 0, các % = 0, 2 ô split = 0, bảng rỗng có `empty state` (BE trả mảng rỗng).

---

## 8. Ghi chú nghiệp vụ

- **Hoa hồng vendor được chia về 2 đối tượng nhận** (giải thích cho người xem console):
  1. **Platform nhận** — phần hoa hồng đơn vendor mà **nền tảng TNP** giữ (hợp đồng có `revenue_recipient = platform`). Đây là `platformTotal` / `platformShare`.
  2. **Công ty VH nhận** — phần hoa hồng mà **công ty vận hành dự án** giữ (`revenue_recipient = operating_company`). Đây là `vhTotal` / `vhShare`.
  - Mỗi đơn về **đúng một** đối tượng → `platformTotal + vhTotal = commissionTotal`, `platformSharePct + vhSharePct = 100%`.
- **Phần Platform thường được nhấn màu `success`** vì đó là doanh thu hoa hồng nền tảng thực giữ; phần VH là tiền chuyển về công ty vận hành.
- **`byRecipient`** tách phần VH ra theo **từng công ty VH** (mỗi công ty 1 dòng), còn Platform gộp thành 1 dòng — giúp thấy ai nhận nhiều nhất.
- **Không trộn miền:** đây là hoa hồng marketplace, KHÔNG phải phí nền tảng PMC hay phí B2B (README §3.2). Đừng cộng nhầm với các báo cáo doanh thu.
- **Định dạng tiền:** mọi giá trị VND là số nguyên đồng từ BE, format hiển thị bằng `formatTenantMoney`. `%` từ BE đã làm tròn — chỉ nối `%`. KHÔNG tự chia/làm tròn ở FE.
- Chạy `typecheck` sau mọi thay đổi FE (CLAUDE.md FE rules).
