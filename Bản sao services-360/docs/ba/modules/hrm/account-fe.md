# Tài khoản (Account) - Đặc tả nghiệp vụ Frontend

> Module: `Account` | Ngày tạo: 2026-02-27 | Trạng thái: Draft

## 1. Tổng quan

Quản lý tài khoản nhân viên trong hệ thống. Người dùng có thể xem danh sách, tạo mới, sửa, xóa tài khoản và đổi mật khẩu. Mỗi tài khoản thuộc một phòng ban, có một chức danh, có một role, và có thể tham gia nhiều dự án.

## 2. Danh sách trang

| Trang | Route | Mô tả |
|-------|-------|-------|
| Danh sách | `/accounts` | Xem + tìm kiếm + lọc danh sách tài khoản |

> Tạo mới, chỉnh sửa, đổi mật khẩu, xóa đều thực hiện qua **modal** trên trang danh sách (không có trang riêng).

## 3. Trang danh sách

### 3.1 Thông tin hiển thị trong bảng

| Cột | Dữ liệu | Ghi chú |
|-----|---------|---------|
| Avatar | `name` (chữ cái đầu) | UAvatar: chữ cái đầu họ tên |
| Mã NV | `employee_code` | |
| Họ tên | `name` | |
| Email | `email` | |
| Giới tính | `gender.label` | Hiển thị text: Nam / Nữ / Khác |
| Phòng ban | `department.name` | |
| Chức danh | `job_title.name` | |
| Role | `role.name` | |
| Trạng thái | `is_active` | Badge: Hoạt động (xanh) / Không hoạt động (xám) |
| Dự án | `projects[].name` | Danh sách tên dự án, phân tách bằng dấu phẩy |
| Thao tác | — | Dropdown menu: Sửa, Đổi mật khẩu, Xóa |

### 3.2 Tìm kiếm & Lọc

| Bộ lọc | Loại | Mô tả |
|--------|------|-------|
| Tìm kiếm | Ô nhập text | Tìm theo tên, email, mã NV (debounce) |
| Phòng ban | Dropdown (select) | Lọc theo phòng ban. Mặc định: "Tất cả phòng ban" |
| Chức danh | Dropdown (select) | Lọc theo chức danh. Mặc định: "Tất cả chức danh" |
| Dự án | Dropdown (select) | Lọc theo dự án. Mặc định: "Tất cả dự án" |
| Xóa bộ lọc | Nút | Reset tất cả bộ lọc về mặc định |

> Tất cả bộ lọc áp dụng đồng thời (AND logic). Tìm kiếm gửi về backend (server-side).

### 3.3 Hành động

| Hành động | Vị trí | Điều kiện | Kết quả |
|-----------|--------|-----------|---------|
| Thêm tài khoản | Nút trên header bảng | Luôn hiển thị | Mở modal tạo mới |
| Sửa | Dropdown menu "Thao tác" | Luôn hiển thị | Mở modal chỉnh sửa |
| Đổi mật khẩu | Dropdown menu "Thao tác" | Luôn hiển thị | Mở modal đổi mật khẩu |
| Xóa | Dropdown menu "Thao tác" | Luôn hiển thị | Mở modal xác nhận xóa |

### 3.4 Phân trang

- Server-side pagination
- Hiển thị số trang, nút prev/next
- Mặc định 15 items/trang

## 4. Modal tạo mới / chỉnh sửa

### 4.1 Các trường nhập liệu

| Trường | Bắt buộc | Loại input | Ghi chú |
|--------|----------|------------|---------|
| Email | Có | Text (email) | **Không cho sửa** khi edit. Unique. |
| Họ tên | Có | Text | Field `name` |
| Mã nhân viên | Có | Text | **Không cho sửa** khi edit. Unique. |
| Giới tính | Không | Dropdown | Danh sách: Nam, Nữ, Khác |
| Phòng ban | Có | Dropdown | Chọn 1 từ danh sách phòng ban (API) |
| Chức danh | Có | Dropdown | Chọn 1 từ danh sách chức danh (API) |
| Role | Có | Dropdown | Chọn 1 từ danh sách role (API) |
| Dự án | Không | Checkboxes (multi-select) | Chọn 0 hoặc nhiều dự án từ danh sách (API) |
| Trạng thái | Không | Checkbox | "Hoạt động" — mặc định: checked |
| Mật khẩu | Không | Password | Chỉ hiện khi **tạo mới**. Có thể bỏ trống, đổi sau. |

### 4.2 Hành động trên form

| Hành động | Kết quả |
|-----------|---------|
| Lưu | Gửi dữ liệu lên API, thông báo thành công (toast), đóng modal, refresh danh sách |
| Hủy | Đóng modal, không lưu thay đổi |

### 4.3 Validation frontend

| Trường | Rule | Message |
|--------|------|---------|
| Email | Bắt buộc, format email | "Email là bắt buộc" / "Email không hợp lệ" |
| Họ tên | Bắt buộc | "Họ tên là bắt buộc" |
| Mã nhân viên | Bắt buộc | "Mã nhân viên là bắt buộc" |
| Phòng ban | Bắt buộc | "Vui lòng chọn phòng ban" |
| Chức danh | Bắt buộc | "Vui lòng chọn chức danh" |
| Role | Bắt buộc | "Vui lòng chọn role" |
| Mật khẩu | Tối thiểu 8 ký tự (nếu nhập) | "Mật khẩu tối thiểu 8 ký tự" |

> Lỗi validation từ backend (unique email, unique mã NV) hiển thị inline dưới field tương ứng.

## 5. Modal đổi mật khẩu

### 5.1 Các trường nhập liệu

| Trường | Bắt buộc | Loại input | Ghi chú |
|--------|----------|------------|---------|
| Mật khẩu mới | Có | Password | Tối thiểu 8 ký tự |
| Xác nhận mật khẩu | Có | Password | Phải trùng với mật khẩu mới |

### 5.2 Hành động

| Hành động | Kết quả |
|-----------|---------|
| Đổi mật khẩu | Gửi API, thông báo thành công, đóng modal |
| Hủy | Đóng modal |

### 5.3 Validation

- Mật khẩu mới: bắt buộc, tối thiểu 8 ký tự
- Xác nhận: bắt buộc, phải trùng khớp
- Lỗi nếu không khớp: "Mật khẩu xác nhận không khớp"

## 6. Modal xóa

- Tiêu đề: "Xóa tài khoản"
- Nội dung: "Bạn có chắc muốn xóa tài khoản này?"
- Nút: "Không" (đóng) + "Xóa" (xác nhận, màu đỏ)
- Thành công: toast thông báo + refresh danh sách

## 7. Luồng người dùng

### 7.1 Tạo mới

```
Danh sách → "Thêm tài khoản" → Modal form (trống) → Điền thông tin → Lưu
  ✓ Thành công: Toast "Tạo tài khoản thành công" + đóng modal + refresh danh sách
  ✗ Lỗi: Hiển thị lỗi validation inline (email trùng, mã NV trùng, v.v.)
```

### 7.2 Chỉnh sửa

```
Danh sách → Dropdown "Thao tác" → "Sửa" → Modal form (dữ liệu đã điền sẵn, email/mã NV disabled) → Lưu
  ✓ Thành công: Toast "Cập nhật tài khoản thành công" + đóng modal + refresh danh sách
  ✗ Lỗi: Hiển thị lỗi validation inline
```

### 7.3 Đổi mật khẩu

```
Danh sách → Dropdown "Thao tác" → "Đổi mật khẩu" → Modal → Nhập mật khẩu mới + xác nhận → Đổi mật khẩu
  ✓ Thành công: Toast "Đổi mật khẩu thành công" + đóng modal
  ✗ Lỗi: Hiển thị lỗi (không khớp, quá ngắn)
```

### 7.4 Xóa

```
Danh sách → Dropdown "Thao tác" → "Xóa" → Modal xác nhận → "Xóa"
  ✓ Thành công: Toast "Xóa tài khoản thành công" + refresh danh sách
  ✗ Lỗi: Toast lỗi
```

### 7.5 Tìm kiếm & Lọc

```
Danh sách → Nhập text tìm kiếm / Chọn bộ lọc → Debounce 300ms → Gọi API → Cập nhật bảng
Xóa bộ lọc → Reset tất cả → Gọi API → Cập nhật bảng
```

## 8. Dữ liệu dropdown (fetch từ API)

| Dropdown | API Source | Format |
|----------|-----------|--------|
| Phòng ban | GET `/api/v1/pmc/departments` | `{ id, name }` |
| Chức danh | GET `/api/v1/pmc/job-titles` | `{ id, name }` |
| Role | GET (TBD — API roles) | `{ id, name }` |
| Dự án | GET `/api/v1/pmc/projects` | `{ id, name }` |
| Giới tính | Static enum | `{ value: 'male', label: 'Nam' }` |

## 9. Ghi chú nghiệp vụ

- Avatar chưa triển khai ở giai đoạn đầu. Cột Avatar trong bảng chỉ hiển thị chữ cái đầu họ tên (`name`).
- Bảng `roles` chưa tồn tại — cần tạo trước khi triển khai Account CRUD.
- Khi đổi phòng ban hoặc chức danh, logic auto-assign role có thể triển khai sau.
