# Công ty vận hành (Tenant) - Đặc tả nghiệp vụ Frontend

> Module: `Platform/Tenant` | Ngày tạo: 2026-06-10 | Trạng thái: Draft
> Nguồn: mockup `BA-TNP-SERVICES/app/pages/platform/modules/quan-ly-van-hanh/cong-ty-vh/`
> Trang thật hiện có: `frontend/app/pages/platform/tenants/index.vue` — spec này NÂNG CẤP trang đó + thêm trang chi tiết.

## 1. Tổng quan

Platform admin quản lý các công ty vận hành (tenant): đăng ký mới, cập nhật hồ sơ doanh nghiệp, vô hiệu hoá / kích hoạt lại, cấu hình giới hạn + phí nền tảng, bật/tắt module dịch vụ cho từng tenant.

**Hiện trạng FE đã có:** danh sách tenant (search, lọc active, phân trang), modal tạo/sửa (tên, trạng thái, domains), xoá soft-delete, toggle gói vendor. **Chưa có:** thống kê, hồ sơ doanh nghiệp, gói dịch vụ, trang chi tiết, cấu hình tenant, phí nền tảng.

## 2. Danh sách trang

| Trang | Route | Mô tả |
|-------|-------|-------|
| Danh sách | `/platform/tenants` | Nâng cấp trang hiện có |
| Chi tiết | `/platform/tenants/[id]` | **Trang mới** — tabs: Thông tin chung / Tài khoản / Dịch vụ / Cấu hình |

> Tạo mới / chỉnh sửa nhanh dùng modal trên trang danh sách (giữ pattern hiện tại). Chỉnh sửa đầy đủ thực hiện inline trong trang chi tiết.

## 3. Trang danh sách (nâng cấp)

### 3.1 Thống kê đầu trang (mới)

3 card: **Tổng công ty** / **Đang hoạt động** (xanh) / **Đã vô hiệu hoá** (vàng) — từ API stats.

### 3.2 Thông tin hiển thị trong bảng

| Cột | Dữ liệu | Ghi chú |
|-----|---------|---------|
| Mã | `id` | Link sang trang chi tiết |
| Tên công ty | `name` | Link sang trang chi tiết |
| MST | `tax_code` | mới |
| Gói DV | `service_plan.label` | mới |
| Liên hệ | `representative_name` · `contact_email` | mới, "—" nếu trống |
| Domains | `domains[]` | badge (giữ hiện tại) |
| Gói vendor | `is_vendor_enabled` | switch (giữ hiện tại) |
| Trạng thái | `is_active` | Badge: Hoạt động (success) / Vô hiệu (warning) |
| Thao tác | dropdown | Chi tiết / Cập nhật / Vô hiệu hoá hoặc Kích hoạt lại |

> Cột "Số dự án" và "Đánh giá cư dân" trong mockup thuộc Phase 2/3 — chưa làm.

### 3.3 Tìm kiếm & Lọc

| Bộ lọc | Loại | Mô tả |
|--------|------|-------|
| Tìm kiếm | Text | Theo mã, tên, MST, email, người đại diện |
| Trạng thái | Button group (giữ hiện tại) | Tất cả / Hoạt động / Đã tắt |
| Gói dịch vụ | Dropdown (mới) | Tất cả / Starter / Business / Enterprise |
| Xoá bộ lọc | Button | Reset toàn bộ |

### 3.4 Hành động

| Hành động | Điều kiện | Kết quả |
|-----------|-----------|---------|
| Đăng ký công ty VH | Luôn hiển thị | Mở modal tạo mới |
| Xem chi tiết | Click mã/tên hoặc menu | Sang `/platform/tenants/[id]` |
| Cập nhật | Menu thao tác | Mở modal sửa |
| Vô hiệu hoá | Tenant đang hoạt động | Modal xác nhận: "không thể đăng nhập và vận hành, dữ liệu lịch sử giữ nguyên" |
| Kích hoạt lại | Tenant đã vô hiệu | Modal xác nhận |
| Bật/tắt gói vendor | Luôn | Giữ luồng hiện tại |

## 4. Form tạo mới / chỉnh sửa (modal — mở rộng)

### 4.1 Các trường nhập liệu

| Trường | Bắt buộc | Loại input | Ghi chú |
|--------|----------|------------|---------|
| Mã công ty | Có | Text | Hint "Mã định danh tenant, không đổi sau khi tạo"; **disabled khi sửa** |
| Tên công ty | Có | Text | |
| Mã số thuế | Không | Text | Placeholder "10–13 chữ số" |
| Người đại diện | Không | Text | |
| Email | Không | Email | Cùng hàng với Điện thoại (2 cột) |
| Điện thoại | Không | Text | |
| Địa chỉ | Không | Text | |
| Gói dịch vụ | Không | Dropdown | Mặc định Business |
| Domains | Không | (giữ hiện tại) | Không truyền → hệ thống tự sinh |
| Ghi chú | Không | Textarea 2 dòng | Ghi chú nội bộ platform |

### 4.2 Hành động trên form

| Hành động | Kết quả |
|-----------|---------|
| Đăng ký / Lưu thay đổi | Gửi dữ liệu, toast thành công, refresh danh sách + stats |
| Hủy | Đóng modal không lưu |

Lỗi validate (mã trùng, MST sai định dạng...) hiển thị trong modal, giữ dữ liệu đã nhập.

## 5. Trang chi tiết (mới) — `/platform/tenants/[id]`

### 5.1 Header

- Icon + tên công ty, mã, badge trạng thái.
- Nút: "Danh sách" (quay lại), "Vô hiệu hoá" (warning, khi active) / "Kích hoạt lại" (khi inactive) — mở modal xác nhận.
- Không tìm thấy tenant → empty state + nút quay về danh sách.

### 5.2 Tab "Thông tin chung"

| Nhóm | Trường | Ghi chú |
|------|--------|---------|
| Hạ tầng tenant | Tên miền, Tên schema | **Readonly/disabled**, hint "hệ thống cấp khi đăng ký — không thể chỉnh sửa" |
| Thông tin công ty | Mã (disabled), Tên*, MST, Gói DV, Người đại diện, Ngày đăng ký (disabled), Email, SĐT, Địa chỉ, Ghi chú | Form sửa inline, nút "Lưu thay đổi" |
| Dự án gắn tenant | Bảng mã / tên / địa chỉ / trạng thái dự án | **Phase 2** — tạm ẩn hoặc empty state |

### 5.3 Tab "Quản lý tài khoản" — **Phase 2**

Bảng tài khoản quản trị tenant (họ tên, email, vai trò Quản trị viên/Vận hành, trạng thái) + thêm/sửa. Phụ thuộc API cross-schema — cần chốt nghiệp vụ trước khi làm.

### 5.4 Tab "Quản lý dịch vụ"

- Danh sách module nghiệp vụ (icon + tên + mô tả) với switch bật/tắt từng module cho tenant.
- Lưu ngay khi gạt switch (gọi API update config với `enabled_modules`).
- Tenant cũ chưa cấu hình → tất cả module hiển thị "bật".

### 5.5 Tab "Cấu hình"

**Cấu hình tenant** (nút "Lưu cấu hình"):

| Trường | Loại | Ghi chú |
|--------|------|---------|
| Giới hạn dự án | Number, min 1 | Hint: số dự án tối đa tenant được tạo |
| Giới hạn tài khoản | Number, min 1 | Hint: số user VH tối đa |
| Thời gian phiên (phút) | Number, min 15 | |
| Cho phép hiển thị trên app cư dân | Switch | |
| Cho phép đăng ký dịch vụ | Switch | Đối tác có thể đăng ký cung cấp dịch vụ |

**Phí nền tảng theo đơn hàng** (radio — chỉ chọn 1 hình thức):

| Hình thức | Field hiện thêm khi chọn |
|-----------|--------------------------|
| Không thu | — |
| Thu theo gói tháng/năm | Chu kỳ gói (tháng/năm) + Mức phí gói (đ) |
| Thu tiền mặt theo đơn hàng | Phí cố định mỗi đơn (đ) |
| Thu theo % đơn hàng | Phí theo % giá trị đơn (0–100, step 0.1) |
| Thu theo cả 2 | Phí cố định + Phí % |

Khi chọn "cả 2" hiển thị ví dụ minh hoạ: "đơn 10.000.000đ → phí **{số tiền}**" (fixed + 10tr × %).

### 5.6 Tổng quan kinh doanh + Đánh giá cư dân — **Phase 3**

Biểu đồ 6 tháng (doanh thu tenant / số đơn / phí platform) và bảng đánh giá cư dân từ đơn vendor hoàn tất. Phụ thuộc dữ liệu đơn hàng marketplace — chưa làm trong phạm vi này.

## 6. Luồng người dùng

### 6.1 Đăng ký công ty VH

```
Danh sách → "Đăng ký công ty VH" → Modal → điền mã + tên (+ hồ sơ) → Đăng ký
  ✓ Tạo tenant + domain tự sinh + config mặc định → toast + refresh
  ✗ Mã trùng / MST sai → báo lỗi trong modal
```

### 6.2 Vô hiệu hoá / Kích hoạt lại

```
Danh sách hoặc Chi tiết → "Vô hiệu hoá" → Modal cảnh báo → Xác nhận
  ✓ Badge chuyển "Vô hiệu", stats cập nhật; menu đổi thành "Kích hoạt lại"
```

### 6.3 Cập nhật cấu hình / phí

```
Chi tiết → tab Cấu hình → sửa giới hạn / chọn hình thức thu phí → "Lưu cấu hình"
  ✓ Toast thành công, giá trị giữ nguyên sau reload
```

## 7. Phân quyền

Trang thuộc cổng platform (layout `platform`, đăng nhập platform admin qua guard requester). Chưa có phân quyền chi tiết theo action — toàn bộ platform admin đều thao tác được (theo hiện trạng).

## 8. Ghi chú nghiệp vụ

- Mã tenant bất biến — disabled trên mọi form sửa.
- Tên miền & schema do hệ thống cấp, chỉ hiển thị readonly.
- Mockup không có chức năng xoá tenant — chỉ vô hiệu hoá. FE giữ nút xoá hiện có hay bỏ: khuyến nghị **thay bằng Vô hiệu hoá** theo mockup (xoá chỉ dành cho admin kỹ thuật, nếu giữ thì yêu cầu tenant đã vô hiệu).
- API composable: mở rộng `useTenants.ts` hiện có (`usePlatformTenantStats`, `apiUpdateTenantConfig`, `apiToggleTenantActive`) — KHÔNG tạo file mới.
- Chạy Orval (`cd frontend && pnpm run api:generate`) sau khi BE xong, trước khi code FE.
