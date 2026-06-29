# PMC Tenant CRUD Vendor - Đặc tả nghiệp vụ Frontend

> Module: `Marketplace/Partner` (tenant view) + `Platform/Tenant` (toggle flag) | Ngày tạo: 2026-05-25 | Trạng thái: Draft

## 1. Tổng quan

PMC tenant — sau khi được Platform admin **bật gói vendor** — có thể tự đăng ký và quản lý các vendor (đối tác marketplace) **của riêng mình**.

- Mỗi PMC tenant chỉ thấy và quản lý vendor do chính họ đăng ký. KHÔNG thấy vendor của PMC khác, KHÔNG thấy vendor do Platform admin tạo.
- Menu "Vendor của tôi" chỉ hiển thị khi tenant có `is_vendor_enabled = true`.
- Sau khi tạo vendor, hệ thống tự động provision shop trên `resi_mart`. Nếu provision fail tạm thời thì vendor vẫn được lưu với trạng thái "Chờ provision" — admin Platform xử lý sau.
- Platform admin có thêm toggle "Kích hoạt gói vendor" trên trang quản lý Tenant.

## 2. Danh sách trang

### 2.1 PMC tenant side

| Trang | Route | Mô tả |
|-------|-------|-------|
| Danh sách vendor | `/pmc/vendors` | Xem + tìm kiếm + lọc danh sách vendor của tenant |
| Tạo vendor | `/pmc/vendors/tao-moi` | Form đăng ký vendor mới |
| Chi tiết vendor | `/pmc/vendors/[id]` | Xem chi tiết + trạng thái provision |
| Chỉnh sửa vendor | `/pmc/vendors/[id]/edit` | Form chỉnh sửa thông tin (không sửa được slug) |

### 2.2 Platform side (mở rộng trang quản lý Tenant đã có)

| Trang | Route | Mô tả |
|-------|-------|-------|
| Chi tiết tenant | `/platform/tenants/[id]` | Bổ sung khu vực "Gói vendor" với toggle bật/tắt |
| Danh sách partner | `/platform/partners` | Bổ sung cột "Nguồn tạo" (Platform / PMC tenant) |

## 3. Trang danh sách vendor (PMC tenant)

### 3.1 Thông tin hiển thị trong bảng

| Cột | Dữ liệu | Ghi chú |
|-----|---------|---------|
| Logo | `logo_url` | Avatar tròn, fallback chữ cái đầu |
| Tên hiển thị | `display_name` hoặc `name` | Click chuyển sang chi tiết |
| Slug | `slug` | Mã định danh, monospace |
| Danh mục | `categories` | Hiển thị các badge, max 3, "+N" nếu nhiều hơn |
| Trạng thái | `status.label` | Badge: Active (xanh) / Suspended (vàng) / Terminated (xám) |
| Provision | `is_provisioned` | Badge: "Đã kích hoạt" (xanh) / "Chờ provision" (vàng) |
| Ngày tạo | `created_at` | Format: DD/MM/YYYY |
| Hành động | — | Icon Edit, Delete (Delete chỉ hiển thị khi chưa provision) |

### 3.2 Tìm kiếm & Lọc

| Bộ lọc | Loại | Mô tả |
|--------|------|-------|
| Tìm kiếm | Ô nhập text | Tìm theo tên / slug / email chủ sở hữu |
| Trạng thái | Dropdown | Lọc theo `PartnerStatus` |
| Danh mục | Dropdown | Lọc theo category đã chọn |
| Provision | Dropdown | "Tất cả / Đã kích hoạt / Chờ provision" |

### 3.3 Hành động

| Hành động | Điều kiện | Kết quả |
|-----------|-----------|---------|
| Đăng ký vendor | Luôn hiển thị | Chuyển sang form tạo mới |
| Xem chi tiết | Click vào row hoặc tên | Chuyển sang trang chi tiết |
| Chỉnh sửa | Icon Edit | Chuyển sang trang chỉnh sửa |
| Xóa | `is_provisioned = false` | Mở hộp thoại xác nhận. Vendor đã provision: ẩn icon, hover-tooltip "Liên hệ Platform admin để xóa" |

### 3.4 Empty state

- Khi chưa có vendor: hiển thị illustration + tiêu đề "Chưa có vendor nào" + mô tả ngắn + nút "Đăng ký vendor đầu tiên".

## 4. Form tạo mới / chỉnh sửa vendor

### 4.1 Các trường nhập liệu

| Trường | Bắt buộc | Loại input | Ghi chú |
|--------|----------|------------|---------|
| Slug | Có (chỉ khi tạo) | Text | Chữ thường, số, gạch ngang. Unique toàn hệ thống. **Không sửa được khi edit.** |
| Tên đầy đủ | Có | Text | Max 255 ký tự |
| Tên hiển thị | Không | Text | Tên ngắn dùng trên storefront. Mặc định = Tên đầy đủ nếu để trống |
| Trạng thái | Không | Dropdown | Mặc định: Đang hoạt động. Enum `PartnerStatus` |
| Custom domain | Không | Text | Hostname (vd: `shop.hoaqua.vn`). Unique toàn hệ thống |
| Danh mục | Không | Multi-select / tags | Tag input, mỗi tag max 100 ký tự |
| Email chủ sở hữu | Có | Email | Người nhận thông báo từ marketplace |
| SĐT chủ sở hữu | Không | Text | Max 30 ký tự |
| Logo URL | Không | URL | Hiển thị preview ảnh nếu valid |
| Mô tả | Không | Textarea | Max 5000 ký tự |

### 4.2 Hành động trên form

| Hành động | Kết quả |
|-----------|---------|
| Lưu | Gửi dữ liệu. Thành công → thông báo "Đăng ký vendor thành công" (kèm note nếu chưa provision) + quay về danh sách |
| Hủy | Quay về trang trước, không lưu |

### 4.3 Validation hiển thị

- **Slug trùng**: "Slug đã được sử dụng trên hệ thống. Vui lòng chọn slug khác."
- **Custom domain trùng**: "Custom domain đã được sử dụng."
- **Email không hợp lệ**: "Email không hợp lệ."

### 4.4 Edge case khi tạo

- Sau khi backend tạo xong, nếu `is_provisioned = false`:
  - Thông báo: "Đăng ký vendor thành công. Hệ thống đang kích hoạt shop, có thể mất vài phút. Bạn sẽ thấy trạng thái 'Đã kích hoạt' trên danh sách khi hoàn tất."
  - Nếu `is_provisioned = true`: "Đăng ký vendor thành công. Shop đã sẵn sàng."

## 5. Trang chi tiết vendor

### 5.1 Thông tin hiển thị

| Nhóm | Trường | Dữ liệu |
|------|--------|---------|
| Thông tin cơ bản | Tên đầy đủ | `name` |
| Thông tin cơ bản | Tên hiển thị | `display_name` |
| Thông tin cơ bản | Slug | `slug` |
| Thông tin cơ bản | Trạng thái | `status.label` (badge) |
| Thông tin cơ bản | Danh mục | `categories` (các badge) |
| Liên hệ | Email chủ sở hữu | `owner_email` |
| Liên hệ | SĐT chủ sở hữu | `owner_phone` |
| Trang shop | Custom domain | `custom_domain` (link mở tab mới nếu provisioned) |
| Trang shop | Trạng thái provision | "Đã kích hoạt" / "Chờ provision" (badge) |
| Trang shop | Tenant ID resi_mart | `tenant_id` (chỉ hiển thị khi đã provision) |
| Mô tả | Mô tả | `description` |
| Audit | Ngày tạo | `created_at` |
| Audit | Ngày cập nhật | `updated_at` |

### 5.2 Hành động

| Hành động | Điều kiện | Kết quả |
|-----------|-----------|---------|
| Chỉnh sửa | Luôn | Chuyển sang form chỉnh sửa |
| Xóa | `is_provisioned = false` | Mở hộp thoại xác nhận. Đã provision: ẩn nút, hiển thị alert info "Vendor đã được kích hoạt — Liên hệ Platform admin để xóa." |

## 6. Luồng người dùng

### 6.1 Đăng ký vendor mới

```
Danh sách → "Đăng ký vendor" → Form → Điền slug + name + email + ... → Lưu
  ✓ Thành công + provision OK:
       Toast: "Đăng ký vendor thành công. Shop đã sẵn sàng."
       → quay về danh sách (vendor mới có badge "Đã kích hoạt")
  ✓ Thành công + provision pending:
       Toast: "Đăng ký vendor thành công. Hệ thống đang kích hoạt shop..."
       → quay về danh sách (vendor mới có badge "Chờ provision")
  ✗ Slug trùng / validate fail:
       Hiển thị lỗi inline trên field, giữ nguyên form
  ✗ Tenant chưa bật gói vendor (403):
       Redirect về /pmc + toast "Tenant chưa kích hoạt gói vendor"
```

### 6.2 Chỉnh sửa vendor

```
Danh sách → Icon Edit → Form (slug disabled, các field khác load sẵn) → Sửa → Lưu
  ✓ Thành công: Toast + quay về danh sách
  ✗ Vendor không tồn tại / không thuộc tenant (404):
       Toast "Không tìm thấy vendor" + redirect về danh sách
```

### 6.3 Xóa vendor

```
Danh sách / Chi tiết → Icon Xóa → Modal xác nhận với cảnh báo
  → "Xác nhận xóa"
  ✓ Thành công: Toast + reload danh sách
  ✗ Vendor đã provision (403 VENDOR_ALREADY_PROVISIONED):
       Toast "Vendor đã được kích hoạt. Vui lòng liên hệ Platform admin để xóa."
       → đóng modal, không xóa
```

### 6.4 Vào route khi tenant chưa bật gói vendor

```
User vào /pmc/vendors → API trả 403 VENDOR_FEATURE_DISABLED
  → Redirect về trang chủ /pmc + toast warning "Tenant chưa kích hoạt gói vendor"
  → Menu "Vendor của tôi" tự ẩn (đã bị filter trong navigation)
```

## 7. Sidebar / Navigation

### 7.1 PMC tenant menu

Thêm mục "Vendor của tôi" trong sidebar PMC, **chỉ hiển thị khi** `tenant.is_vendor_enabled = true` (lấy từ `/me` hoặc auth payload).

```
- Tổng quan
- Dự án
- ...
- (Vendor của tôi)   ← chỉ khi is_vendor_enabled = true
  - Danh sách vendor (/pmc/vendors)
- Cài đặt
```

> Hành vi: composable `useNavigation()` filter mục này dựa trên `useAuth().tenant.is_vendor_enabled`.

## 8. Platform side (mở rộng trang quản lý Tenant)

### 8.1 Trang chi tiết tenant — section "Gói vendor"

| Trường | Dữ liệu | Tương tác |
|--------|---------|-----------|
| Trạng thái gói vendor | `is_vendor_enabled` | Toggle switch (bật/tắt) |
| Mô tả | Static text | "Cho phép tenant tự đăng ký và quản lý vendor (đối tác marketplace) của mình." |
| Số vendor đang quản lý | (Tùy chọn) count vendor `owner_tenant_id = tenant.id` | Hiển thị nếu API trả về |

**Luồng toggle:**
```
Platform admin click toggle → Modal xác nhận
  Bật: "Bật gói vendor cho tenant {name}? Tenant sẽ thấy menu 'Vendor của tôi' sau khi đăng nhập lại."
  Tắt: "Tắt gói vendor cho tenant {name}? Các vendor đã đăng ký vẫn giữ nguyên, tenant sẽ mất quyền chỉnh sửa."
→ Xác nhận → API PUT /platform/tenants/{id}/vendor-feature
  ✓ Toast thành công, cập nhật UI
  ✗ Toast lỗi
```

### 8.2 Trang danh sách Partner (Platform)

Bổ sung cột "Nguồn tạo" giữa cột "Tên" và "Trạng thái":

| Giá trị | Hiển thị |
|---------|----------|
| `owner_source.value = "platform"` | Badge xám "Platform" |
| `owner_source.value = "tenant"` | Badge xanh "PMC: {owner_tenant_id}" |

Filter mới: "Nguồn tạo" (dropdown: Tất cả / Platform / PMC tenant) — query param `owner_source`.

## 9. Phân quyền

### 9.1 PMC tenant side

| Hành động | Điều kiện |
|-----------|-----------|
| Xem menu "Vendor của tôi" | `tenant.is_vendor_enabled = true` |
| Truy cập route `/pmc/vendors/*` | Đã đăng nhập (`auth:sanctum`) + middleware backend `tenant.vendor_enabled` |
| Tạo / Sửa / Xóa | Mọi user trong tenant có quyền truy cập module Vendor (chưa định role granular ở phase này — tất cả Account trong tenant đều được) |

> **Ghi chú**: phase này chưa có permission-level granularity cho module Vendor. Mọi Account trong tenant đã bật `is_vendor_enabled` đều CRUD được. Nếu cần phân quyền chi tiết hơn (vd: chỉ Manager mới được xóa) → mở phase mới.

### 9.2 Platform side

| Hành động | Quyền cần có |
|-----------|-------------|
| Toggle `is_vendor_enabled` | RequesterAccount (Platform admin) — guard `auth:requester` |
| Xem nguồn tạo trong danh sách Partner | RequesterAccount |

## 10. Ghi chú nghiệp vụ

- **Slug & custom_domain unique toàn hệ thống**: PMC tenant có thể gặp lỗi khi slug bị PMC khác đăng ký trước → UI cần message rõ ràng và gợi ý thử slug khác.
- **Provision pending**: vendor vẫn dùng được trong PMC (tenant tự quản lý info), nhưng storefront `resi_mart` chưa truy cập được. Sau khi provision OK → tự cập nhật `is_provisioned = true` ở lần load tiếp.
- **Vendor đã provision = "có shop thật"**: rules nghiêm ngặt hơn (không xóa được, slug không sửa được).
- **Tắt gói vendor không phá data**: data vendor giữ nguyên ở central, chỉ chặn quyền truy cập từ tenant. Khi bật lại → tenant truy cập lại được toàn bộ vendor cũ.
- **Không có khái niệm "duyệt vendor"**: PMC tự tạo là dùng được luôn (không cần Platform admin approve). Nếu BA muốn duyệt thủ công → mở phase mới.
- **Audit `created_by`** ở Platform side: khi nhìn vendor do PMC tạo, `created_by` là `accounts.id` của tenant đó — Platform UI hiện tại không resolve được tên user vì khác DB. Tạm thời hiển thị "ID #{n} (PMC: {owner_tenant_id})". Phase sau có thể thêm ExternalService resolve tên.
