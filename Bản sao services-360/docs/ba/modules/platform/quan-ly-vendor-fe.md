# Quản lý Vendor (Console Platform) — Đặc tả nghiệp vụ Frontend

> Module: `Marketplace` (console Platform) | Ngày tạo: 2026-06-16 | Trạng thái: Draft
>
> **Spec HỢP NHẤT.** Tái dùng tối đa composable/component vendor đã có. Phần lớn việc FE là **2 trang console mới** + tái dùng `usePartners`, `useVendorOrders`, `usePartnerCommissionContracts`, `VendorForm`, `VendorProjectsCard`.

## 1. Tổng quan

Console cho admin Platform quản lý toàn bộ vendor cross-tenant: xem danh sách (kèm thống kê), chi tiết vendor với 4 tab, tạo/duyệt/vô hiệu vendor, cấu hình hoa hồng theo dự án.

Phân biệt rõ với tab Vendor trong trang chi tiết dự án (chỉ liệt kê vendor của 1 dự án). Console này lấy vendor làm trung tâm.

## 2. Danh sách trang

| Trang | Route | Mô tả |
|-------|-------|-------|
| Danh sách vendor | `/platform/quan-ly-van-hanh/quan-ly-vendor` | List + stats + tìm kiếm + lọc + tạo mới (modal) |
| Chi tiết vendor | `/platform/quan-ly-van-hanh/quan-ly-vendor/[id]` | Profile + biểu đồ + đánh giá + 4 tab |

> Tái dùng composable `usePartners.ts` (`usePlatformPartnerList`, `usePlatformPartnerDetail`, `apiCreatePartner`, `apiUpdatePartner`) + bổ sung hàm mới cho approve/deactivate/reactivate/stats/trend/offers/ratings.

## 3. Trang danh sách

### 3.1 Thẻ thống kê (4 card đầu trang)

| Thẻ | Dữ liệu |
|-----|---------|
| Tổng vendor | `stats.total` |
| Đang hoạt động | `stats.active` |
| Chờ duyệt | `stats.pending` |
| Đã vô hiệu | `stats.inactive` |

### 3.2 Bảng danh sách (`UTable`)

| Cột | Dữ liệu | Ghi chú |
|-----|---------|---------|
| Mã vendor | `code` | Click → chi tiết |
| Tên vendor | `name` | |
| Trạng thái | `status.label` | `UBadge` màu theo `status.value` (pending=warning, active=success, suspended=neutral) |
| Người tạo | `owner_source.label` + `owner_tenant.name` | `UBadge` (platform=primary, tenant=neutral) |
| Dự án | `project_count` | |
| Đánh giá CD | `rating.avg` + `rating.count` | ★ + số lượt; "—" nếu chưa có |
| Gói DV | `offer_count` | |
| Ngày tạo | `created_at` | DD/MM/YYYY |
| Thao tác | dropdown | Xem chi tiết / Duyệt / Vô hiệu / Kích hoạt |

### 3.3 Tìm kiếm & Lọc

| Bộ lọc | Loại | Mô tả |
|--------|------|-------|
| Tìm kiếm | Ô text (debounce) | Mã/tên vendor, người tạo, dự án |
| Trạng thái | Dropdown | Tất cả / Chờ duyệt / Đang hoạt động / Đã vô hiệu |
| Người tạo | Dropdown | Tất cả / Platform TNP / Công ty vận hành |

### 3.4 Hành động

| Hành động | Điều kiện | Kết quả |
|-----------|-----------|---------|
| Tạo vendor | Luôn hiển thị | Mở modal tạo (reuse `VendorForm`); tạo từ platform → active ngay |
| Xem chi tiết | Click row | Sang trang chi tiết |
| Duyệt | `status = pending` | Modal xác nhận → `apiApprovePartner` → refresh |
| Vô hiệu hoá | `status = active` | Modal xác nhận → `apiDeactivatePartner` → refresh |
| Kích hoạt lại | `status = suspended` | Modal xác nhận → `apiReactivatePartner` → refresh |

## 4. Form tạo / sửa vendor (modal — reuse `VendorForm`)

| Trường | Bắt buộc | Loại | Ghi chú |
|--------|----------|------|---------|
| Mã vendor | Có | Text | Duy nhất (case-insensitive) |
| Tên vendor | Có | Text | |
| Dự án | Có | Multi-select | ≥1 dự án (reuse `VendorProjectsCard`/catalog picker) |
| Ghi chú | Không | Textarea | |

| Hành động | Kết quả |
|-----------|---------|
| Lưu | Tạo/cập nhật → toast thành công → đóng modal → refresh / sang chi tiết |
| Hủy | Đóng modal, không lưu |

## 5. Trang chi tiết vendor

### 5.1 Header

- Tên vendor (H1) + mã vendor.
- `UBadge` trạng thái + `UBadge` nguồn tạo.
- Nút theo trạng thái: Duyệt / Vô hiệu hoá / Kích hoạt lại; nút "Danh sách".

### 5.2 Biểu đồ doanh thu (6 tháng)

- 3 KPI: Doanh thu gộp vendor · Số đơn · Hoa hồng thu về.
- Biểu đồ 2 trục: cột doanh thu + đường số đơn + đường hoa hồng. Nguồn: `revenue-trend`.

### 5.3 Tab 1 — Thông tin chung + Phí

**Card "Thông tin vendor"**: Mã, Tên, Người tạo, Ngày tạo, Công ty VH (nếu có, link), Ghi chú.

**Card "Hoa hồng mặc định"** (`SharedSectionCard`):
- Hình thức (select): Không thu / Thu theo gói / Cố định mỗi đơn / % mỗi đơn / Cả hai.
- Theo hình thức: Chu kỳ + Giá gói (subscription) · Cố định/đơn · % đơn.
- **Doanh thu thuộc về** (select): Platform TNP / Công ty vận hành.
- Nút "Lưu mặc định" → gọi bulk apply cho mọi dự án vendor.

> FE hiển thị vocabulary mockup (cố định/%/cả hai). Khi gửi BE map sang `per_order` + `terms` + `revenue_recipient` (xem BE spec §4.2).

**Card "Dự án & hoa hồng theo dự án"**: bảng các dự án vendor đang gắn:

| Cột | Dữ liệu |
|-----|---------|
| Mã/Tên dự án | link |
| VH quản lý | tenant name (link) |
| Trạng thái | Đang quản lý / Đã dừng (theo `is_vendor_enabled`) |
| Cách tính | `UBadge` Mặc định / Ghi đè + tóm tắt terms |
| Người nhận DT | `UBadge` Platform / Công ty VH |
| Thao tác | Nút "Cấu hình" → modal ghi đè hoa hồng dự án |

**Modal "Cấu hình hoa hồng — {dự án}"** (reuse logic `usePartnerCommissionContracts`):
- Toggle "Dùng mặc định" (cách tính) — off thì hiện form terms.
- Toggle "Dùng mặc định" (người nhận) — off thì chọn Platform / Công ty VH.
- Lưu → tạo/cập nhật contract draft cho (vendor × tenant × dự án); cả 2 toggle on → không ghi đè (dùng mặc định).

### 5.4 Tab 2 — Đơn hàng (reuse `useVendorOrders`)

Bảng đơn vendor: Mã đơn · Loại · Dự án · Công ty VH · Cư dân · Giá trị · Hoa hồng · **Thuộc về** (Platform/Công ty VH) · Trạng thái · Đánh giá · Ngày tạo. Có ô tìm kiếm + summary (Tổng giá trị · Hoa hồng→Platform · Hoa hồng→Công ty VH). Empty state khi chưa có đơn / schema resi_mart thiếu.

### 5.5 Tab 3 — Sản phẩm (`offers` endpoint mới)

Bảng: Tên gói · Loại (Bán/Cho thuê/Dịch vụ) · Đơn giá · Đơn vị · Dự án · Trạng thái (Công khai/Ẩn). Ô tìm theo tên gói. Empty state khi chưa có / schema thiếu.

### 5.6 Tab 4 — Đánh giá cư dân (`ratings` endpoint mới)

Bảng: Mã đơn · Loại · Dự án · Tên cư dân · Điểm (★) · Nhận xét · Thời điểm. Empty state "Chưa có đánh giá".

## 6. Luồng người dùng

### 6.1 Tạo vendor (platform)
```
Danh sách → "Tạo vendor" → Form (mã/tên/dự án) → Lưu
  ✓ Vendor active ngay + sang chi tiết
  ✗ Lỗi: giữ form, toast lỗi
```

### 6.2 Duyệt vendor (pending)
```
Danh sách/Chi tiết → "Duyệt" → Xác nhận
  ✓ status → active, refresh
```

### 6.3 Cấu hình hoa hồng theo dự án
```
Chi tiết → Tab Thông tin → bảng dự án → "Cấu hình" → modal
  - Dùng mặc định (cả 2 toggle on) → bỏ ghi đè
  - Ghi đè → nhập terms/người nhận → Lưu → refresh bảng
```

## 7. Phân quyền

| Hành động | Quyền |
|-----------|-------|
| Xem console vendor | Platform admin (`auth:requester`) |
| Tạo/Duyệt/Vô hiệu/Kích hoạt | Platform admin |
| Cấu hình hoa hồng | Platform admin |

## 8. Ghi chú nghiệp vụ

- Console này **không** cấu hình phí nền tảng (TNP↔tenant) — việc đó ở tab cấu hình của trang "Dự án trên nền tảng".
- "Mặc định" hoa hồng = áp hàng loạt cho mọi dự án vendor; mỗi dự án vẫn ghi đè được.
- Vendor `pending`/`suspended` không nhận đơn mới.
- Đơn/sản phẩm/đánh giá đọc từ resi_mart (cross-DB) → hiển thị cảnh báo bằng `UAlert` khi schema chưa sẵn sàng, không lỗi đỏ.
- Tab Đánh giá có thể **defer sang part2** nếu rating chưa liên kết được `partner_id` (xem BE spec §6).

## 9. Bắt buộc kỹ thuật FE

- Chạy Orval (`cd frontend && pnpm run api:generate`) trước khi code, sau khi BE có resource mới.
- Dùng `UBadge`/`UAlert`/`SharedSectionCard`, KHÔNG custom div+Tailwind.
- API qua `usePartners.ts` mở rộng (thêm `apiApprovePartner`, `apiDeactivatePartner`, `apiReactivatePartner`, `usePartnerStats`, `usePartnerRevenueTrend`, `usePartnerOffers`, `usePartnerRatings`) — KHÔNG gọi `$api()` raw trong page.
- Chạy `pnpm run typecheck` sau mỗi lần sửa FE.
```