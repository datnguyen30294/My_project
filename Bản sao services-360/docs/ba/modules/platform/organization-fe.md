# Quản lý Organization (OG) - Đặc tả nghiệp vụ Frontend

> Module: `Platform/Tenant` | Ngày tạo: 2026-03-15 | Trạng thái: Draft

## 1. Tổng quan

Giao diện cho platform admin quản lý danh sách Organization (tenant). Cho phép xem danh sách, thêm mới, sửa thông tin, và bật/tắt trạng thái hoạt động của Organization.

Trang thuộc nhóm **Platform** (dùng `usePlatformApiFetch` / `$platformApi`, auth bằng `platform_access_token`).

## 2. Danh sách trang

| Trang | Route | Mô tả |
|-------|-------|-------|
| Danh sách OG | `/platform/organizations` | Xem, tìm kiếm, lọc danh sách OG |

> Không cần trang chi tiết/edit riêng — thêm và sửa dùng modal trên trang danh sách.

## 3. Trang danh sách

### 3.1 Thông tin hiển thị trong bảng

| Cột | Dữ liệu | Ghi chú |
|-----|---------|---------|
| STT | Auto-increment | Số thứ tự theo pagination |
| Mã OG | `id` | Text, không thay đổi |
| Tên OG | `name` | Text |
| Trạng thái | `is_active` | Badge: xanh = "Hoạt động", đỏ = "Ngừng hoạt động" |
| Ngày tạo | `created_at` | Format: DD/MM/YYYY |
| Hành động | — | Nút Sửa, Nút Toggle trạng thái |

### 3.2 Tìm kiếm & Lọc

| Bộ lọc | Loại | Mô tả |
|--------|------|-------|
| Tìm kiếm | Text input | Tìm theo mã OG hoặc tên OG (debounced) |
| Trạng thái | Dropdown/Select | Tất cả / Hoạt động / Ngừng hoạt động |

### 3.3 Hành động

| Hành động | Vị trí | Điều kiện | Kết quả |
|-----------|--------|-----------|---------|
| Thêm OG | Nút trên header | Luôn hiển thị | Mở modal tạo mới |
| Sửa OG | Icon Edit trên row | Luôn hiển thị | Mở modal chỉnh sửa (điền sẵn dữ liệu) |
| Toggle trạng thái | Icon/Switch trên row | Luôn hiển thị | Mở dialog xác nhận → toggle is_active |

## 4. Modal tạo mới / chỉnh sửa

### 4.1 Các trường nhập liệu

| Trường | Bắt buộc | Loại input | Ghi chú |
|--------|----------|------------|---------|
| Mã OG | Có | Text input | Chỉ hiển thị khi tạo mới. Chỉ cho phép chữ thường, số, dấu gạch. Disabled khi sửa |
| Tên OG | Có | Text input | |

### 4.2 Hành động trên modal

| Hành động | Kết quả |
|-----------|---------|
| Lưu | Gọi API tạo/cập nhật → thông báo thành công → đóng modal → refresh danh sách |
| Hủy | Đóng modal, không lưu |

### 4.3 Validation hiển thị

- Hiển thị lỗi validation dưới mỗi trường (từ API response 422)
- Mã OG trùng → hiển thị lỗi "Mã OG đã tồn tại"

## 5. Dialog xác nhận Toggle trạng thái

| Trường hợp | Message |
|------------|---------|
| Active → Inactive | "Bạn có chắc muốn ngừng hoạt động OG **{name}**? Các user thuộc OG này sẽ không thể đăng nhập." |
| Inactive → Active | "Bạn có chắc muốn kích hoạt lại OG **{name}**?" |

| Hành động | Kết quả |
|-----------|---------|
| Xác nhận | Gọi API toggle → thông báo thành công → refresh danh sách |
| Hủy | Đóng dialog |

## 6. Luồng người dùng

### 6.1 Thêm OG mới

```
Danh sách → Nút "Thêm OG" → Modal tạo mới → Nhập mã + tên → Lưu
  ✓ Thành công: Toast "Tạo OG thành công" + đóng modal + refresh danh sách
  ✗ Lỗi validation: Hiển thị lỗi dưới trường tương ứng
  ✗ Mã trùng: Hiển thị "Mã OG đã tồn tại"
```

### 6.2 Sửa OG

```
Danh sách → Icon Edit → Modal chỉnh sửa (mã OG disabled, tên điền sẵn) → Sửa tên → Lưu
  ✓ Thành công: Toast "Cập nhật OG thành công" + đóng modal + refresh danh sách
  ✗ Lỗi validation: Hiển thị lỗi dưới trường tương ứng
```

### 6.3 Toggle trạng thái

```
Danh sách → Icon/Switch toggle → Dialog xác nhận → Xác nhận
  ✓ Thành công: Toast "Cập nhật trạng thái thành công" + refresh danh sách
  ✗ Lỗi: Toast thông báo lỗi
```

## 7. Phân quyền

Tất cả hành động yêu cầu đăng nhập platform (`platform_access_token`). Không có phân quyền chi tiết ở giai đoạn này — bất kỳ platform admin đã đăng nhập đều có toàn quyền.

## 8. Ghi chú nghiệp vụ

- Mã OG sau khi tạo không thể thay đổi (dùng làm tenant identifier trong multi-tenancy)
- Khi inactive OG, hệ thống sẽ ngăn user thuộc OG đó đăng nhập (xử lý ở backend middleware, không cần FE xử lý)
- Không có chức năng xóa cứng OG — chỉ inactive/active
- Trang này nằm trong layout Platform (sidebar Platform), không phải layout PMC
- API dùng `usePlatformApiFetch` / `$platformApi` (khác với PMC dùng `useApiFetch` / `$api`)
