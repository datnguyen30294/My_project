# Đơn hàng vendor (Console Platform) - Đặc tả nghiệp vụ Frontend

> Module: `Marketplace/VendorOrder` (phạm vi Platform) | Ngày tạo: 2026-06-18 | Trạng thái: Draft
>
> Mockup nguồn: `BA-TNP-SERVICES/app/pages/platform/modules/quan-ly-don-hang/don-hang-vendor/{index,[orderId]}.vue`

## 1. Tổng quan

Màn hình giúp **Platform admin giám sát toàn bộ đơn hàng vendor** (sản phẩm + dịch vụ) mà cư dân đặt từ các vendor trên sàn resi_mart — gộp **mọi vendor và mọi công ty vận hành (tenant)**. Người dùng xem được: tổng đơn, giá trị giao dịch (GMV), hoa hồng chia về Platform vs Công ty VH, và truy vết chi tiết từng đơn + hoa hồng.

**Đây là màn hình ĐỌC-CHỈ (xem & lọc).** Đơn hàng do cư dân tạo trên resi_mart, Platform KHÔNG tạo / sửa / đổi trạng thái / huỷ đơn ở đây. (Khác mockup — xem §8.)

## 2. Danh sách trang

| Trang | Route | Mô tả |
|-------|-------|-------|
| Danh sách | `/platform/modules/quan-ly-don-hang/don-hang-vendor` | Thẻ tổng quan + bảng đơn + tìm/lọc |
| Chi tiết | `/platform/modules/quan-ly-don-hang/don-hang-vendor/[orderKey]` | Xem chi tiết 1 đơn + hoa hồng (read-only) |

> **KHÔNG có** trang Tạo mới / Chỉnh sửa. `orderKey` = `{vendorId}-{orderId}` (mã đơn chỉ duy nhất trong từng vendor nên cần kèm vendor để mở chi tiết).

## 3. Trang danh sách

### 3.1 Thẻ tổng quan (4 thẻ — từ `GET /vendor-orders/summary`)

| Thẻ | Dữ liệu | Ghi chú |
|-----|---------|---------|
| Tổng đơn | `orders_count` | Phụ: `{product_count} SP · {service_count} DV` |
| Giá trị giao dịch (GMV) | `gmv` | Tổng tiền cư dân trả vendor (bỏ đơn huỷ) |
| Hoa hồng → Platform | `commission_platform` | Màu success |
| Hoa hồng → Công ty VH | `commission_operating_company` | Màu primary |

> Tiền hiển thị qua `formatCurrency` (chuẩn dự án), KHÔNG tự `Intl.NumberFormat` như mockup.

### 3.2 Thông tin hiển thị trong bảng

| Cột | Dữ liệu | Ghi chú |
|-----|---------|---------|
| Mã đơn | `code` | Link → trang chi tiết |
| Loại | `type.label` | Sản phẩm / Dịch vụ / Hỗn hợp |
| Vendor | `vendor.name` | Link → trang vendor (`quan-ly-vendor/{vendor.id}`) |
| Dự án | `project_name` | Link → dự án nền tảng (`du-an-tren-nen-tang/{project_id}`) |
| Công ty VH | `tenant.name` | Tên công ty vận hành (tenant) |
| Khách hàng | `customer.name` | |
| GMV | `total` | Định dạng tiền |
| Hoa hồng | `commission.amount` | "—" nếu chưa có hoa hồng |
| Thuộc về | `commission.revenue_recipient.label` | Badge: Platform (success) / Công ty VH (primary); "—" nếu chưa có |
| Trạng thái | `status.label` | Badge theo màu trạng thái |
| Đánh giá CD | `resident_rating` | **GĐ1: luôn "—"** (chưa wiring) |
| Ngày tạo | `created_at` | DD/MM/YYYY |

### 3.3 Tìm kiếm & Lọc

| Bộ lọc | Loại | Mô tả |
|--------|------|-------|
| Tìm kiếm | Ô text | Theo mã đơn (`search` → `code`) |
| Loại đơn | Dropdown | Tất cả / Sản phẩm / Dịch vụ / Hỗn hợp |
| Vendor | Dropdown | Tất cả vendor (lấy từ danh sách vendor đã provision) |
| Công ty VH | Dropdown | Tất cả công ty vận hành (tenant) |
| Dự án | Dropdown | Tất cả dự án |
| Trạng thái | Dropdown | Tất cả / theo `VendorOrderStatus` |
| Khoảng thời gian | Date range | Mặc định 30 ngày, tối đa 90 ngày |
| Xóa bộ lọc | Nút | Reset toàn bộ |

> Dải tóm tắt theo bộ lọc (GMV đã lọc / phí platform đã lọc) lấy từ `summary` gọi lại theo cùng tham số lọc, KHÔNG tính lại in-memory như mockup.

### 3.4 Hành động

| Hành động | Điều kiện | Kết quả |
|-----------|-----------|---------|
| Xem chi tiết | Click mã đơn / menu "Chi tiết" | Sang trang chi tiết |
| Mở trang vendor | Click tên vendor | Sang trang Quản lý vendor |
| Mở trang dự án | Click tên dự án | Sang trang Dự án nền tảng |

> KHÔNG có nút Tạo / Sửa / Xóa.

## 4. Trang chi tiết (read-only)

> Dữ liệu từ `GET /api/v1/platform/partners/{vendorId}/orders/{orderId}`.

### 4.1 Thông tin hiển thị

| Nhóm | Trường | Dữ liệu |
|------|--------|---------|
| Tiêu đề | Mã đơn + loại + trạng thái | `code`, `type.label`, `status.label` (badge) |
| Hoa hồng | GMV | `amounts.total` |
| Hoa hồng | Hoa hồng | `commission.amount` (hoặc "Không áp dụng" nếu null) |
| Hoa hồng | Thuộc về | `commission.revenue_recipient.label` |
| Hoa hồng | Chi tiết công thức | phần cố định / phần % trên GMV (từ `commission.formula`) |
| Vendor & dự án | Vendor / Dự án / Công ty VH | `vendor`/`project`/`tenant` + nút mở trang liên quan |
| Khách & giao hàng | Khách hàng / Liên hệ / Căn hộ / Địa chỉ giao | `customer`, `contact.*` |
| Dòng đơn | SP/DV, SL, đơn giá, thành tiền | `items[]` |
| Thanh toán | Trạng thái TT / phương thức / các khoản tiền | `payment_status`, `payment_method`, `amounts.*` |
| Mốc thời gian | Đặt / xác nhận / hoàn tất / huỷ | `timeline.*` |
| Đánh giá cư dân | Sao + nhận xét | **GĐ1: trạng thái rỗng "Chưa có đánh giá"** |

### 4.2 Hành động

| Hành động | Kết quả |
|-----------|---------|
| Quay lại danh sách | Về trang danh sách |
| Mở trang vendor / dự án | Điều hướng sang trang liên quan |

> KHÔNG có Đổi trạng thái / Huỷ đơn / Sửa ghi chú (khác mockup).

## 5. Luồng người dùng

### 5.1 Xem & lọc danh sách

```
Vào trang → thấy 4 thẻ tổng quan + bảng đơn (30 ngày gần nhất)
  → nhập tìm kiếm / chọn loại-vendor-công ty VH-dự án-trạng thái / đổi khoảng ngày
  → bảng + dải tóm tắt cập nhật theo bộ lọc
```

### 5.2 Xem chi tiết

```
Danh sách → click mã đơn → trang chi tiết (read-only)
  ✓ Có đơn: hiển thị hoa hồng + vendor/dự án + khách + dòng đơn + timeline
  ✗ Không tìm thấy: trạng thái rỗng + nút "Danh sách đơn"
```

### 5.3 Trạng thái tải / lỗi / rỗng

```
Đang tải: skeleton/loading
Lỗi API: thông báo lỗi + nút thử lại
Rỗng (không có đơn khớp lọc): UEmpty "Không có đơn hàng — thử đổi bộ lọc"
```

## 6. Component / API tái dùng (định hướng)

- Composable `usePlatformVendorOrders` (mới, trong `app/composables/api/`) — chứa mọi URL: `usePlatformVendorOrderList()`, `usePlatformVendorOrderSummary()` (GET qua `useApiFetch`), `usePlatformVendorOrderDetail(vendorId, orderId)`.
- Badge trạng thái / recipient → `UBadge`; thẻ tổng quan → `UCard` hoặc `SharedSectionCard`; cảnh báo (đơn orphan/schema thiếu) → `UAlert`.
- Tiền → util `formatCurrency`; đánh giá → util `rating.ts` (đã có, dùng chung với báo cáo) — hiển thị "—" khi null.

## 7. Phân quyền

| Hành động | Quyền |
|-----------|-------|
| Xem danh sách / chi tiết | Platform admin (`auth:requester`) |

> Không có quyền ghi vì không có hành động ghi.

## 8. Ghi chú nghiệp vụ

- **Read-only**: bỏ toàn bộ nút ghi của mockup (Tạo đơn vendor, Đổi trạng thái, Huỷ đơn, Sửa ghi chú) — đơn do cư dân tạo trên resi_mart.
- **Loại đơn** suy ra từ dòng đơn: toàn sản phẩm → "Sản phẩm", toàn dịch vụ → "Dịch vụ", lẫn lộn → "Hỗn hợp".
- **Hoa hồng** chỉ có với đơn đã hoàn thành + khớp hợp đồng hoa hồng theo đơn (`per_order`); đơn khác hiển thị "—". "Thuộc về" = Platform hoặc Công ty VH theo hợp đồng.
- **GMV** không tính đơn đã huỷ.
- **Đánh giá CD** hiển thị "—" ở Giai đoạn 1 (chưa wiring rating cross-repo resi_mart) — đồng bộ với Quản lý vendor và Báo cáo tổng hợp.
- **Cảnh báo** từ API (đơn không khớp hợp đồng / schema vendor thiếu) nên hiện banner nhẹ để admin biết số liệu hoa hồng có thể thiếu.
- Khoảng thời gian tối đa 90 ngày (BE kẹp); UI nên giới hạn date range tương ứng.
