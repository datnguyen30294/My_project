# Quản lý dự án (Project) - Đặc tả nghiệp vụ Frontend

> Module: `HRM/Project` | Ngày tạo: 2026-02-27 | Trạng thái: Draft

## 1. Tổng quan

Tính năng quản lý danh mục dự án (khu đô thị). Người dùng có thể xem danh sách dự án, tạo mới, chỉnh sửa thông tin và xóa dự án. Trang chi tiết dự án hiển thị danh sách nhân viên đã được gán vào dự án đó (read-only, việc gán thực hiện từ màn Tài khoản).

## 2. Danh sách trang

| Trang | Route | Mô tả |
|-------|-------|-------|
| Danh sách | `/projects` | Xem + tìm kiếm + lọc danh sách dự án |
| Tạo mới | `/projects/create` | Form tạo dự án mới |
| Chi tiết | `/projects/[id]` | Xem chi tiết dự án + danh sách nhân viên |
| Chỉnh sửa | `/projects/[id]/edit` | Form chỉnh sửa thông tin dự án |

## 3. Trang danh sách (`/projects`)

### 3.1 Thông tin hiển thị trong bảng

| Cột | Dữ liệu | Ghi chú |
|-----|---------|---------|
| Mã | `code` | |
| Tên | `name` | |
| Địa chỉ | `address` | Hiển thị "—" nếu rỗng |
| Trạng thái | `status.label` | Badge: xanh lá = Đang quản lý, đỏ = Đã dừng |
| Thao tác | — | Menu: Chi tiết / Chỉnh sửa / Xóa |

### 3.2 Tìm kiếm & Lọc

| Bộ lọc | Loại | Mô tả |
|--------|------|-------|
| Tìm kiếm | Ô nhập text | Tìm theo tên hoặc mã dự án (real-time hoặc debounce) |
| Trạng thái | Dropdown | Tất cả / Đang quản lý / Đã dừng |
| Xóa bộ lọc | Nút | Reset về mặc định |

### 3.3 Hành động

| Hành động | Điều kiện | Kết quả |
|-----------|-----------|---------|
| Tạo mới | Luôn hiển thị (nút ở header) | Chuyển sang `/projects/create` |
| Chi tiết | Từ menu thao tác | Chuyển sang `/projects/[id]` |
| Chỉnh sửa | Từ menu thao tác | Chuyển sang `/projects/[id]/edit` |
| Xóa | Từ menu thao tác | Mở hộp thoại xác nhận xóa |

### 3.4 Hộp thoại xác nhận xóa

- Tiêu đề: "Xóa dự án"
- Nội dung: "Bạn có chắc muốn xóa dự án **{tên dự án}**? Tất cả nhân viên đã gán vào dự án này cũng sẽ bị gỡ khỏi dự án."
- Nút: "Hủy" (đóng modal) | "Xóa" (màu đỏ, xác nhận xóa)

## 4. Form tạo mới (`/projects/create`)

### 4.1 Các trường nhập liệu

| Trường | Bắt buộc | Loại input | Ghi chú |
|--------|----------|------------|---------|
| Mã dự án | Có | Text | Chỉ nhập khi tạo mới, không cho sửa |
| Tên dự án | Có | Text | |
| Địa chỉ | Không | Text | |
| Trạng thái | Có | Dropdown | Đang quản lý / Đã dừng. Mặc định: Đang quản lý |

### 4.2 Hành động trên form

| Hành động | Kết quả |
|-----------|---------|
| Lưu | Gửi dữ liệu, thông báo thành công, quay về `/projects` |
| Hủy | Quay về `/projects` không lưu |

## 5. Form chỉnh sửa (`/projects/[id]/edit`)

### 5.1 Các trường nhập liệu

| Trường | Bắt buộc | Loại input | Ghi chú |
|--------|----------|------------|---------|
| Mã dự án | — | Text (disabled) | Chỉ đọc, không cho sửa |
| Tên dự án | Có | Text | |
| Địa chỉ | Không | Text | |
| Trạng thái | Có | Dropdown | Đang quản lý / Đã dừng |

> Trường `Mã dự án` hiển thị readonly để người dùng biết mã nhưng không thể thay đổi.

### 5.2 Hành động trên form

| Hành động | Kết quả |
|-----------|---------|
| Lưu | Gửi dữ liệu (không gửi `code`), thông báo thành công, quay về `/projects/[id]` |
| Hủy | Quay về `/projects/[id]` không lưu |

## 6. Trang chi tiết (`/projects/[id]`)

### 6.1 Thông tin dự án

| Nhóm | Trường | Dữ liệu | Ghi chú |
|------|--------|---------|---------|
| Thông tin cơ bản | Mã | `code` | |
| Thông tin cơ bản | Tên | `name` | |
| Thông tin cơ bản | Địa chỉ | `address` | Hiển thị "—" nếu rỗng |
| Thông tin cơ bản | Trạng thái | `status.label` | Badge màu |

### 6.2 Danh sách nhân viên thuộc dự án

Bảng hiển thị các nhân viên đã được gán vào dự án này:

| Cột | Dữ liệu |
|-----|---------|
| Mã NV | `employee_code` |
| Họ tên | `full_name` |
| Email | `email` |
| Phòng ban | `department.name` |
| Chức danh | `job_title.name` |

- Nếu chưa có nhân viên → hiển thị thông báo: *"Chưa có nhân viên. Gán dự án cho nhân viên tại màn Tài khoản."*
- Danh sách nhân viên là **read-only** — không có nút thêm/xóa nhân viên từ màn này.

### 6.3 Hành động trên trang chi tiết

| Hành động | Kết quả |
|-----------|---------|
| Chỉnh sửa | Chuyển sang `/projects/[id]/edit` |
| Xóa | Mở hộp thoại xác nhận xóa |
| Quay lại | Chuyển về `/projects` |

## 7. Luồng người dùng

### 7.1 Tạo mới dự án

```
/projects → "Tạo mới" → /projects/create → Điền thông tin → Lưu
  ✓ Thành công: Toast thông báo + quay về /projects
  ✗ Lỗi validation: Hiển thị lỗi bên dưới từng trường, giữ nguyên form
  ✗ Lỗi server: Toast lỗi, giữ nguyên form
```

### 7.2 Chỉnh sửa dự án

```
/projects → menu "Chỉnh sửa" → /projects/[id]/edit → Chỉnh thông tin → Lưu
  ✓ Thành công: Toast thông báo + quay về /projects/[id]
  ✗ Lỗi: Toast lỗi, giữ nguyên form
```

### 7.3 Xóa dự án

```
/projects (hoặc /projects/[id]) → menu/nút "Xóa" → Hộp thoại xác nhận → "Xóa"
  ✓ Thành công: Toast thông báo + quay về /projects (nếu đang ở detail)
  ✗ Lỗi: Toast lỗi, đóng modal
```

### 7.4 Xem chi tiết

```
/projects → menu "Chi tiết" → /projects/[id]
  → Hiển thị thông tin dự án + danh sách nhân viên (nếu có)
  → Nếu dự án không tồn tại: Trang lỗi 404 hoặc thông báo "Không tìm thấy dự án"
```

## 8. Trạng thái badge

| Trạng thái | Label | Màu badge |
|-----------|-------|-----------|
| `managing` | Đang quản lý | Xanh lá (`success` / `green`) |
| `stopped` | Đã dừng | Đỏ (`error` / `red`) |

## 9. Ghi chú nghiệp vụ

- **Mã dự án không thể thay đổi** sau khi tạo — field readonly ở form edit.
- **Việc gán nhân viên vào dự án** thực hiện tại màn **Tài khoản** (chọn nhiều dự án cho 1 nhân viên), không thực hiện tại màn Dự án.
- Trang chi tiết dự án chỉ **hiển thị** danh sách nhân viên đã gán (không cho thêm/xóa từ đây).
- Khi xóa dự án, hệ thống tự động gỡ liên kết tất cả nhân viên ra khỏi dự án đó (cascade ở backend).
- Địa chỉ là trường tùy chọn — có thể để trống.
