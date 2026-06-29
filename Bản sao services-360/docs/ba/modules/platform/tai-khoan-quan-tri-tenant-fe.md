# Tài khoản quản trị tenant - Đặc tả nghiệp vụ Frontend

> Module: `Platform/Tenant` | Ngày tạo: 2026-06-12 | Trạng thái: Draft
> Thay thế placeholder hiện tại ở tab "Quản lý tài khoản" trang chi tiết công ty vận hành.

## 1. Tổng quan

Admin platform xem và quản lý danh sách tài khoản vận hành của một công ty (tenant) ngay trong trang chi tiết công ty vận hành: thêm tài khoản mới, sửa thông tin, bật/tắt trạng thái hoạt động, đặt lại mật khẩu.

## 2. Danh sách trang

Không có trang mới — tính năng nằm trong **tab "Quản lý tài khoản"** của trang `/platform/tenants/[id]` (hiện đang là placeholder).

## 3. Tab Quản lý tài khoản

### 3.1 Thông tin hiển thị trong bảng

| Cột | Dữ liệu | Ghi chú |
|-----|---------|---------|
| Họ tên | `name` | |
| Email | `email` | |
| Phòng ban | `departments[].name` | Nối bằng dấu phẩy nếu nhiều |
| Chức danh | `job_title.name` | |
| Vai trò | `role.name` | |
| Trạng thái | `is_active` | Badge: "Hoạt động" (success) / "Tắt" (neutral) |
| Thao tác | — | Nút "Sửa" mở modal chỉnh sửa |

### 3.2 Hành động

| Hành động | Điều kiện | Kết quả |
|-----------|-----------|---------|
| Thêm tài khoản | Luôn hiển thị (header tab) | Mở modal tạo mới |
| Sửa | Icon/nút trên từng dòng | Mở modal chỉnh sửa, dữ liệu điền sẵn |

> Không có xoá tài khoản trong phạm vi này — muốn ngừng sử dụng thì tắt trạng thái.

## 4. Modal Thêm / Sửa tài khoản

### 4.1 Các trường nhập liệu

| Trường | Bắt buộc | Loại input | Ghi chú |
|--------|----------|------------|---------|
| Họ tên | Có | Text | |
| Email đăng nhập | Có | Email | Không trùng trong cùng công ty |
| Mật khẩu | Có (khi tạo) | Password | Tối thiểu 8 ký tự. Khi sửa: để trống = giữ nguyên, nhập = đặt lại mật khẩu |
| Phòng ban | Có (≥ 1) | Multi-select | Chọn được nhiều phòng ban; danh sách lấy từ dữ liệu của chính tenant đó (endpoint options) |
| Chức danh | Có | Dropdown | Như trên |
| Vai trò | Có | Dropdown | Như trên — khác mockup (mockup chỉ có admin/operator) |
| Trạng thái | — | Switch | Mặc định: Hoạt động |

### 4.2 Hành động trên form

| Hành động | Kết quả |
|-----------|---------|
| Lưu | Gửi dữ liệu, toast thành công, đóng modal, refresh bảng |
| Hủy | Đóng modal, không lưu |

Lỗi validate từ API hiển thị inline dưới từng trường (theo pattern `TenantFormModal` hiện có).

## 5. Luồng người dùng

### 5.1 Thêm tài khoản

```
Chi tiết tenant → Tab "Quản lý tài khoản" → "Thêm tài khoản" → Điền form → Lưu
  ✓ Thành công: Toast + đóng modal + refresh danh sách
  ✗ Vượt giới hạn tài khoản (max_accounts): Toast lỗi "Đã đạt giới hạn tài khoản của gói" — giữ modal
  ✗ Email trùng: lỗi inline ở trường email
```

### 5.2 Tắt tài khoản

```
Bảng → "Sửa" → gạt Switch trạng thái về Tắt → Lưu
  ✓ Tài khoản không đăng nhập được vào cổng vận hành nữa, dữ liệu giữ nguyên
```

## 6. Trạng thái đặc biệt

| Trạng thái | Hiển thị |
|-----------|----------|
| Đang tải | Skeleton rows trong bảng |
| Lỗi tải | UAlert lỗi + nút thử lại |
| Chưa có tài khoản | UEmpty "Tenant chưa có tài khoản nào" + nút Thêm tài khoản |

## 7. Ghi chú nghiệp vụ

- Giới hạn số tài khoản theo cấu hình `Giới hạn tài khoản` ở tab Cấu hình — backend chặn, FE chỉ hiển thị thông báo lỗi.
- Tenant đã vô hiệu hoá vẫn quản lý được tài khoản (chuẩn bị trước khi kích hoạt lại).
- Form options (phòng ban / chức danh / vai trò) là dữ liệu **riêng của từng tenant**, phải fetch theo tenant id, không dùng chung.
- API functions đặt trong `composables/api/useTenants.ts` (hoặc tách `useTenantAccounts.ts` nếu file quá dài): `useTenantAccountList`, `apiCreateTenantAccount`, `apiUpdateTenantAccount`, `useTenantAccountOptions`.
