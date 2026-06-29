# Quản lý Chức danh (Job Title) - Đặc tả nghiệp vụ Frontend

> Module: `PMC/JobTitle` | Ngày tạo: 2026-02-27 | Trạng thái: Draft

## 1. Tổng quan

Trang quản lý danh mục chức danh. Người dùng có thể xem danh sách, tìm kiếm, thêm mới, sửa và xóa chức danh. Toàn bộ thao tác Create/Edit được thực hiện qua **modal** (không dùng trang riêng) vì form chỉ có 3 trường đơn giản.

## 2. Danh sách trang

| Trang | Route | Mô tả |
|-------|-------|-------|
| Danh sách | `/pmc/job-titles` | Xem + tìm kiếm + thao tác (modal create/edit, modal delete) |

> Không có trang Create/Edit/Show riêng — toàn bộ thao tác dùng modal inline.

## 3. Trang danh sách (`/pmc/job-titles`)

### 3.1 Thông tin hiển thị trong bảng

| Cột | Dữ liệu | Ghi chú |
|-----|---------|---------|
| Mã | `code` | |
| Tên | `name` | |
| Mô tả | `description` | Hiển thị trống nếu null |
| Thao tác | — | Dropdown: Sửa, Xóa |

### 3.2 Tìm kiếm & Lọc

| Bộ lọc | Loại | Mô tả |
|--------|------|-------|
| Tìm kiếm | Ô nhập text | Tìm theo tên hoặc mã (debounce) |

### 3.3 Hành động trên trang

| Hành động | Vị trí | Kết quả |
|-----------|--------|---------|
| Thêm chức danh | Nút header | Mở modal tạo mới |
| Sửa | Dropdown → Sửa | Mở modal chỉnh sửa với dữ liệu đã điền sẵn |
| Xóa | Dropdown → Xóa | Mở modal xác nhận xóa |
| Xóa bộ lọc | Nút phụ | Reset ô tìm kiếm |

## 4. Modal Tạo mới / Chỉnh sửa

**Tiêu đề modal:**
- Tạo mới: `Thêm chức danh`
- Chỉnh sửa: `Sửa chức danh`

### 4.1 Các trường nhập liệu

| Trường | Bắt buộc | Loại input | Ghi chú |
|--------|----------|------------|---------|
| Mã | Có | Text | Disabled khi chỉnh sửa (không cho sửa code) |
| Tên | Có | Text | |
| Mô tả | Không | Textarea (2 rows) | |

### 4.2 Hành động trên modal

| Hành động | Kết quả |
|-----------|---------|
| Lưu | Gọi API, hiển thị toast thành công, đóng modal, refresh danh sách |
| Hủy | Đóng modal, không lưu |

### 4.3 Xử lý lỗi

| Lỗi | Hiển thị |
|-----|---------|
| Validation (422) | Hiển thị lỗi inline từng trường |
| Mã đã tồn tại | Lỗi inline tại trường Mã |
| Lỗi server (500) | Toast thông báo lỗi chung |

## 5. Modal Xóa

**Tiêu đề:** `Xóa chức danh`

### 5.1 Kịch bản 1: Không có tài khoản nào dùng chức danh

- Nội dung: `Bạn có chắc muốn xóa chức danh này?`
- Nút **Xóa** (màu đỏ/error): enabled
- Nút **Không**: đóng modal

### 5.2 Kịch bản 2: Có tài khoản đang dùng chức danh

- Nội dung: `Không thể xóa: còn {n} tài khoản đang dùng chức danh này. Hãy đổi chức danh cho các tài khoản trước.`
- Nút **Xóa**: **disabled** (không thể click)
- Nút **Không**: đóng modal

> Backend trả về lỗi `422` kèm số lượng tài khoản khi cố gắng xóa. Frontend hiển thị thông báo từ response. Hoặc: gọi API check trước khi hiển thị modal.

### 5.3 Sau khi xóa thành công

- Toast thành công
- Đóng modal
- Refresh danh sách

## 6. Luồng người dùng

### 6.1 Tạo mới chức danh

```
Danh sách → "Thêm chức danh" → Modal Tạo mới → Điền Mã, Tên, Mô tả → "Lưu"
  ✓ Thành công: Toast + đóng modal + refresh danh sách
  ✗ Lỗi validation: Hiển thị lỗi inline, giữ nguyên modal
```

### 6.2 Chỉnh sửa chức danh

```
Danh sách → Dropdown → "Sửa" → Modal Sửa (Mã disabled, Tên/Mô tả đã điền sẵn) → "Lưu"
  ✓ Thành công: Toast + đóng modal + refresh danh sách
  ✗ Lỗi: Hiển thị lỗi inline, giữ nguyên modal
```

### 6.3 Xóa chức danh

```
Danh sách → Dropdown → "Xóa" → Modal Xóa
  → Không có TK dùng: Nút "Xóa" enabled → Xác nhận
      ✓ Thành công: Toast + đóng modal + refresh danh sách
      ✗ Lỗi: Toast thông báo lỗi
  → Có TK dùng: Nút "Xóa" disabled + hiển thị số lượng TK → Chỉ có thể đóng modal
```

## 7. Ghi chú nghiệp vụ

- Chức danh không có trạng thái (active/inactive) — là catalog thuần
- Mã chức danh phải ngắn gọn (VD: TP, NV, KS) — tối đa 50 ký tự
- Backend kiểm tra ràng buộc tài khoản khi xóa và trả về lỗi 422; frontend cần xử lý response để hiển thị thông báo phù hợp
- Tìm kiếm theo cả tên lẫn mã (LIKE case-insensitive)
