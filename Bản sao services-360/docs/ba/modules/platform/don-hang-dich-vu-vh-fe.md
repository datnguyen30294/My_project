# Đơn hàng dịch vụ vận hành - Đặc tả nghiệp vụ Frontend

> Module: `Platform/TenantServiceOrder` | Ngày tạo: 2026-06-16 | Trạng thái: Draft
>
> Nguồn mockup: `BA-TNP-SERVICES/app/pages/platform/modules/quan-ly-don-hang/don-hang-dich-vu-vh/`

## 1. Tổng quan

Trang console Platform giúp vận hành viên nền tảng quản lý các **đơn dịch vụ mà công ty vận hành (tenant) trả cho Platform**: gói đăng ký, phí triển khai, mua thêm module, hóa đơn phí. Toàn bộ giá trị đơn là **doanh thu Platform** khi đã thanh toán.

Khác đơn hàng vendor (Platform thu hoa hồng %), đây là khoản thu **trực tiếp B2B** từ tenant.

## 2. Danh sách trang

| Trang | Route | Mô tả |
|-------|-------|-------|
| Danh sách | `/platform/quan-ly-don-hang/don-hang-dich-vu-vh` | Danh sách + KPI + tìm kiếm + lọc |
| Chi tiết | `/platform/quan-ly-don-hang/don-hang-dich-vu-vh/[id]` | Chi tiết đơn + doanh thu + dòng hàng |

> Tạo / sửa / chuyển trạng thái / thêm dòng đều dùng **modal** (theo pattern `useCrudModals`), KHÔNG có trang form riêng.
>
> **Điều hướng (nav):** thêm nhóm mới **"Quản lý đơn hàng"** trong `usePlatformNavigation` (chưa tồn tại) với mục con "Đơn dịch vụ vận hành" trỏ tới route trên. Nhóm này về sau chứa thêm trang "Đơn hàng vendor".

## 3. Trang danh sách

### 3.1 Thẻ KPI (4 thẻ trên cùng)

| Thẻ | Dữ liệu | Ghi chú |
|-----|---------|---------|
| Tổng đơn | `stats.total` | Tất cả đơn |
| Doanh thu platform (đã thu) | `stats.platform_revenue` | Màu xanh (success); tổng giá trị đơn đã thanh toán |
| Chờ thanh toán | `stats.pending_amount` | Màu vàng (warning); tổng giá trị đơn `pending_payment` |
| Đã thanh toán | `stats.paid_count` | Số lượng đơn `paid` |

### 3.2 Thông tin hiển thị trong bảng

| Cột | Dữ liệu | Ghi chú |
|-----|---------|---------|
| Mã đơn | `code` | Link → trang chi tiết |
| Công ty VH | `organization.name` | Link → `/platform/tenants/{organization.id}` |
| Loại | `order_type.label` | |
| Tiêu đề | `title` | |
| Giá trị đơn | `amount` | Định dạng tiền |
| DT platform | `platform_revenue` | Đậm/xanh nếu > 0, mờ nếu = 0 |
| Trạng thái | `status.label` | `UBadge` màu theo trạng thái |
| Kỳ | `billing_period` | "DD/MM/YYYY → DD/MM/YYYY" hoặc "—" |
| Nguồn khách (MP) | — | **HOÃN — Giai đoạn 2** (xem §8) |
| Đánh giá CD | — | **HOÃN — Giai đoạn 2** (xem §8) |
| (Hành động) | — | Menu 3 chấm |

**Màu badge trạng thái:** Nháp = neutral · Chờ thanh toán = warning · Đã thanh toán = success · Đã huỷ = error.

### 3.3 Tìm kiếm & Lọc

| Bộ lọc | Loại | Mô tả |
|--------|------|-------|
| Tìm kiếm | Ô nhập text | Theo mã đơn / tiêu đề / tên công ty VH |
| Công ty VH | Dropdown | Danh sách công ty vận hành; có "Tất cả công ty" |
| Loại đơn | Dropdown | Gói đăng ký / Phí triển khai / Mua thêm module / Hóa đơn phí; có "Tất cả" |
| Trạng thái | Dropdown | Nháp / Chờ thanh toán / Đã thanh toán / Đã huỷ; có "Tất cả" |

> Khi có bộ lọc active: hiển thị dải tóm tắt trên bảng (GMV đã lọc + DT platform đã lọc), tính từ dữ liệu trang hiện tại.

### 3.4 Hành động

| Hành động | Điều kiện | Kết quả |
|-----------|-----------|---------|
| Tạo đơn dịch vụ VH | Luôn hiển thị | Mở modal tạo |
| Xem chi tiết | Click mã đơn / menu | Sang trang chi tiết |
| Sửa | Menu 3 chấm | Mở modal sửa |
| Đánh dấu đã thanh toán | Chỉ khi trạng thái `pending_payment` | Xác nhận → chuyển `paid` |
| Huỷ đơn | Khi trạng thái ≠ `paid` và ≠ `cancelled` | Xác nhận → chuyển `cancelled` |

## 4. Modal tạo / sửa

### 4.1 Trường nhập liệu

| Trường | Bắt buộc | Loại input | Ghi chú |
|--------|----------|------------|---------|
| Công ty vận hành | Có | Dropdown | Danh sách công ty VH. **Chỉ khi tạo** (sửa: khoá, không đổi) |
| Loại đơn | Có | Dropdown | Enum loại đơn |
| Tiêu đề đơn | Có | Text | VD: "Gói Business — tháng 5/2026" |
| Kỳ từ | Không | Date | |
| Kỳ đến | Không | Date | Phải ≥ "Kỳ từ" |
| Giá trị đơn (đ) | Có | Number (≥ 1) | Gợi ý: "100% giá trị = doanh thu platform khi đã thanh toán." |
| Trạng thái | Không | Dropdown | Mặc định "Nháp". **Chỉ khi tạo** (sửa trạng thái đi qua hành động chuyển trạng thái) |
| Ghi chú | Không | Textarea | |

> Khi **sửa**: chỉ đổi được Loại đơn / Tiêu đề / Kỳ / Giá trị / Ghi chú. Công ty VH và Trạng thái không sửa trực tiếp ở modal này.

### 4.2 Hành động trên modal

| Hành động | Kết quả |
|-----------|---------|
| Lưu | Gửi dữ liệu → thông báo thành công → refresh danh sách / chi tiết |
| Hủy | Đóng modal, không lưu |

## 5. Trang chi tiết

### 5.1 Tiêu đề & hành động

- **Tiêu đề:** `title`; phụ đề: `code`. Badge: trạng thái + loại đơn.
- **Nút hành động:**

| Nút | Điều kiện hiển thị |
|-----|-------------------|
| Danh sách | Luôn |
| Xác nhận thanh toán | `status === pending_payment` |
| Huỷ đơn | `status ≠ paid` và `≠ cancelled` |
| Sửa đơn | Luôn |

### 5.2 Thẻ doanh thu (nền xanh, 3 ô)

| Ô | Dữ liệu | Ghi chú |
|---|---------|---------|
| Giá trị đơn hàng | `amount` | "Công ty VH thanh toán cho platform" |
| Doanh thu platform | `platform_revenue` | "100% giá trị đơn — đã ghi nhận" (nếu paid) / "Chưa ghi nhận (chưa thanh toán / đã huỷ)" |
| Kỳ thanh toán | `billing_period` | Kèm "Thanh toán lúc: `paid_at`" nếu có |

### 5.3 Thẻ thông tin

| Nhóm | Trường | Dữ liệu |
|------|--------|---------|
| Công ty vận hành | Tên + nút "Xem chi tiết tenant" | `organization.name` → `/platform/tenants/{id}` |
| Thông tin đơn | Mã đơn | `code` |
| Thông tin đơn | Loại đơn | `order_type.label` |
| Thông tin đơn | Trạng thái | `status.label` |
| Thông tin đơn | Cập nhật lúc | `updated_at` |
| Thông tin đơn | Ghi chú | `notes` (nếu có) |

### 5.4 Thẻ "Chi tiết dòng hàng"

- Bảng: Mô tả · SL · Đơn giá · Thành tiền · (nút xóa dòng).
- Nút "Thêm dòng" → mở modal thêm dòng (Mô tả bắt buộc, SL ≥ 1, Đơn giá ≥ 0; Thành tiền = SL × Đơn giá).
- Footer: "Tổng dòng: …" + **cảnh báo** (UAlert) nếu tổng dòng ≠ giá trị đơn. Cảnh báo không chặn lưu.

### 5.5 Hành động

| Hành động | Kết quả |
|-----------|---------|
| Sửa đơn | Mở modal sửa |
| Xác nhận thanh toán | Xác nhận → chuyển `paid` → refresh |
| Huỷ đơn | Xác nhận → chuyển `cancelled` → refresh |
| Thêm dòng | Mở modal thêm dòng → refresh |
| Xóa dòng | Xác nhận → xóa → refresh |

## 6. Luồng người dùng

### 6.1 Tạo đơn

```
Danh sách → "Tạo đơn dịch vụ VH" → Modal → Chọn công ty + loại + tiêu đề + giá trị → Lưu
  ✓ Thành công: Thông báo + danh sách cập nhật
  ✗ Lỗi: Thông báo lỗi, giữ nguyên modal
```

### 6.2 Vòng đời trạng thái

```
Nháp ──→ Chờ thanh toán ──→ Đã thanh toán (ghi nhận DT platform)
  │            │
  └────────────┴──→ Đã huỷ (không ghi nhận DT)
```

- "Đánh dấu đã thanh toán": chỉ từ "Chờ thanh toán".
- "Huỷ đơn": từ "Nháp" hoặc "Chờ thanh toán" (không huỷ đơn đã thanh toán).

### 6.3 Thêm / xóa dòng hàng

```
Chi tiết → "Thêm dòng" → Modal → Mô tả + SL + Đơn giá → Lưu → cập nhật bảng dòng
Chi tiết → Xóa dòng → Xác nhận → cập nhật bảng dòng
```

## 7. Phân quyền

- Toàn bộ trang nằm trong khu vực **admin Platform** (guard `auth:requester`). Không có phân quyền chi tiết theo hành động ở giai đoạn này — ai vào được console platform đều thao tác được.

## 8. PHẦN HOÃN — Giai đoạn 2

> Không triển khai ở Giai đoạn 1 (thiếu dữ liệu vendor order: nguồn khách + đánh giá cư dân).

- Cột danh sách **"Nguồn khách (MP)"** và **"Đánh giá CD"**.
- Thẻ chi tiết **"Nguồn khách marketplace"** (bóc tách cư dân dự án / khách vãng lai trong kỳ).
- Thẻ chi tiết **"Đánh giá của cư dân (marketplace)"** (bảng đơn vendor hoàn tất có đánh giá trong kỳ).

Cần resi_mart bổ sung `customer_source` + `resident_rating` cho đơn vendor trước khi làm (xem spec BE §11).

## 9. Ghi chú nghiệp vụ

- 100% giá trị đơn = doanh thu Platform, chỉ ghi nhận khi đơn đã thanh toán.
- Giá trị đơn (`amount`) là nguồn chân lý; các dòng hàng chỉ để bóc tách, có thể lệch và chỉ hiển thị cảnh báo.
- Đơn KHÔNG bị xóa — chỉ huỷ.
