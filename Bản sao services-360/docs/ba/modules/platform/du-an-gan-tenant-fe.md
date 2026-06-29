# Dự án gắn tenant - Đặc tả nghiệp vụ Frontend

> Module: `Platform/Tenant` | Ngày tạo: 2026-06-12 | Trạng thái: Draft
> Thay thế placeholder "Dự án gắn tenant" trong tab Thông tin chung của trang chi tiết công ty vận hành.

## 1. Tổng quan

Admin platform xem nhanh các dự án (toà nhà / khu chung cư) mà một công ty vận hành đang quản lý, ngay trong tab Thông tin chung của trang chi tiết công ty. Chỉ xem — không thao tác.

## 2. Danh sách trang

Không có trang mới — là **section "Dự án gắn tenant"** trong tab Thông tin chung của `/platform/tenants/[id]` (component `TenantInfoTab`, hiện đang là alert placeholder).

## 3. Section Dự án gắn tenant

### 3.1 Header section

- Icon bản đồ (map-pin) + tiêu đề "Dự án gắn tenant"
- Badge đếm số dự án (vd: `2`)

### 3.2 Thông tin hiển thị trong bảng

| Cột | Dữ liệu | Ghi chú |
|-----|---------|---------|
| Mã | `code` | |
| Tên dự án | `name` | |
| Địa chỉ | `address` | "—" nếu trống |
| Trạng thái | `status.label` | Badge: "Đang quản lý" (success) / "Đã dừng" (neutral) |

API phân trang chuẩn (mặc định 10/trang, sort `name` ASC) — bảng dùng `UPagination` khi `meta.last_page > 1`. Badge số dự án lấy từ `meta.total`.

### 3.3 Hành động

Không có — bảng thuần hiển thị. Dự án do tenant tự quản lý trên cổng vận hành riêng.

## 4. Trạng thái đặc biệt

| Trạng thái | Hiển thị |
|-----------|----------|
| Đang tải | Skeleton rows |
| Lỗi tải | UAlert lỗi + nút thử lại |
| Chưa có dự án | UEmpty "Tenant chưa tạo dự án nào" |

## 5. Luồng người dùng

```
Danh sách tenants → click tenant → Tab "Thông tin chung" → cuộn xuống section "Dự án gắn tenant"
  → Xem mã / tên / địa chỉ / trạng thái từng dự án
```

## 6. Ghi chú nghiệp vụ

- Cột "Số dự án" trên **trang danh sách** tenants (có trong mockup) KHÔNG làm ở giai đoạn này — chi phí truy vấn chéo schema theo từng dòng quá lớn; số dự án chỉ xem ở trang chi tiết.
- Số dự án tối đa của tenant bị giới hạn bởi "Giới hạn dự án" ở tab Cấu hình — nếu badge count (`meta.total`) chạm giới hạn, có thể hiển thị kèm `2/10` (total / max_projects lấy từ config đã có sẵn trong detail response).
- API function đặt trong `composables/api/useTenants.ts`: `useTenantProjects(id)` (nhận params phân trang).
