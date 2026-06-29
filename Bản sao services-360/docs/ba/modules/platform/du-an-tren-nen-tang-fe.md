# Dự án trên nền tảng - Đặc tả nghiệp vụ Frontend

> Module: `Platform/Tenant` (cổng platform) | Ngày tạo: 2026-06-15 | Trạng thái: Draft
> Nguồn: mockup `BA-TNP-SERVICES/.../platform/modules/quan-ly-van-hanh/du-an-tren-nen-tang/{index,[projectId]}.vue`.
> Liên quan: BE [`du-an-tren-nen-tang-be.md`](./du-an-tren-nen-tang-be.md). Tái dùng UI/luồng từ "Chi tiết công ty vận hành" (chart kinh doanh, đánh giá cư dân).

## 1. Tổng quan

Màn quản trị **toàn bộ dự án trên nền tảng** dành cho đội platform (TNP). Mỗi dự án thuộc một công ty vận hành (tenant). Người dùng platform có thể: xem bảng tổng hợp tất cả dự án, thêm dự án mới (gán vào một công ty vận hành), xem chi tiết một dự án (thông tin, biểu đồ kinh doanh, đơn hàng, đánh giá cư dân) và **cấu hình mức phí nền tảng riêng cho từng dự án**.

**Lưu ý mô hình:** mỗi dự án luôn thuộc đúng một công ty vận hành — không có dự án "chưa gán tenant" (khác mockup). Trang chi tiết và mọi thao tác đều gắn với cặp *công ty vận hành → dự án*.

## 2. Danh sách trang

| Trang | Route | Mô tả |
|-------|-------|-------|
| Danh sách dự án | `/platform/quan-ly-van-hanh/du-an-tren-nen-tang` | Bảng tổng hợp toàn nền tảng + thống kê + tìm/lọc + thêm dự án |
| Chi tiết dự án | `/platform/quan-ly-van-hanh/du-an-tren-nen-tang/[id]` | Thông tin, biểu đồ, đơn hàng, đánh giá, cấu hình phí |

> Route hiển thị theo cấu trúc menu "Quản lý vận hành". `[id]` của dự án đi kèm tham số tenant để truy đúng schema (FE giữ `tenantId` từ row danh sách khi điều hướng).

## 3. Trang danh sách

### 3.1 Thẻ thống kê (đầu trang)

| Thẻ | Dữ liệu | Ghi chú |
|-----|---------|---------|
| Tổng dự án | `stats.total` | |
| Đang quản lý | `stats.managing` | Màu nhấn tích cực |
| Công ty VH có dự án | `stats.tenant_count` | Số tenant có ≥1 dự án |
| Ngừng cung cấp dịch vụ | `stats.service_disabled` | Màu cảnh báo (thay cho "Chưa gán tenant" của mockup) |

### 3.2 Thông tin hiển thị trong bảng

| Cột | Dữ liệu | Ghi chú |
|-----|---------|---------|
| Mã dự án | `code` | Link sang chi tiết |
| Tên dự án | `name` | Link sang chi tiết |
| Địa chỉ | `address` | |
| Trạng thái | `status.label` | Badge: Đang quản lý (success) / Đã dừng (neutral) |
| Công ty vận hành | `tenant.code` — `tenant.name` | Link sang chi tiết công ty VH |
| Tenant | `tenant.is_active` | Badge Hoạt động / Vô hiệu |
| Dịch vụ platform | `platform_service_enabled` | Badge Đang cung cấp / Ngừng cung cấp |
| Đánh giá CD | (sao trung bình) | Hiển thị nếu có; "—" nếu chưa có đánh giá |
| Thao tác | menu | Chi tiết / Xem công ty VH / Bật-tắt cung cấp dịch vụ |

> Cột "Đánh giá CD" trên danh sách là tuỳ chọn (tốn thêm dữ liệu cross-schema). Nếu ảnh hưởng hiệu năng → bỏ khỏi danh sách, chỉ giữ ở trang chi tiết.

### 3.3 Tìm kiếm & Lọc

| Bộ lọc | Loại | Mô tả |
|--------|------|-------|
| Tìm kiếm | Ô nhập text | Theo mã / tên / địa chỉ / công ty VH |
| Trạng thái dự án | Dropdown | Tất cả / Đang quản lý / Đã dừng |
| Công ty vận hành | Dropdown | Lọc theo một công ty VH |
| Xóa bộ lọc | Nút | Đặt lại toàn bộ bộ lọc |

### 3.4 Hành động

| Hành động | Điều kiện | Kết quả |
|-----------|-----------|---------|
| Thêm dự án | Luôn hiển thị | Mở hộp thoại tạo dự án |
| Xem chi tiết | Click mã/tên dự án | Sang trang chi tiết |
| Xem công ty VH | Có tenant | Sang chi tiết công ty vận hành |
| Bật / Ngừng cung cấp dịch vụ | Theo trạng thái hiện tại | Mở hộp thoại xác nhận → cập nhật |

## 4. Form thêm dự án (hộp thoại)

### 4.1 Các trường nhập liệu

| Trường | Bắt buộc | Loại input | Ghi chú |
|--------|----------|------------|---------|
| Công ty vận hành | Có | Dropdown | Chỉ liệt kê công ty VH đang hoạt động; dự án sẽ được tạo trong tenant đã chọn |
| Mã dự án | Có | Text | Duy nhất trong phạm vi công ty VH đó |
| Tên dự án | Có | Text | |
| Địa chỉ | Không | Text | |
| Trạng thái | Không | Dropdown | Đang quản lý (mặc định) / Đã dừng |

### 4.2 Hành động

| Hành động | Kết quả |
|-----------|---------|
| Tạo dự án | Gửi dữ liệu → thành công: thông báo + đóng hộp thoại + điều hướng sang chi tiết dự án vừa tạo |
| Hủy | Đóng hộp thoại, không lưu |

> Lỗi trùng mã / công ty VH vô hiệu: hiển thị thông báo lỗi ngay trên form, giữ nguyên dữ liệu đã nhập.

## 5. Trang chi tiết dự án

### 5.1 Phần đầu (header)

| Thông tin | Dữ liệu |
|-----------|---------|
| Tên + mã dự án | `name`, `code` |
| Trạng thái | Badge `status.label` |
| Công ty vận hành | Link `tenant.code — tenant.name` |
| Nút quay lại danh sách | điều hướng về danh sách |

### 5.2 Card "Biểu đồ kinh doanh dự án (N tháng)"

Tái dùng nguyên dạng card kinh doanh ở trang chi tiết công ty vận hành, nhưng dữ liệu lọc theo dự án:

- 3 chỉ số tổng: **Doanh thu dự án**, **Số đơn hàng**, **Phí platform thu về**.
- Biểu đồ N tháng: cột doanh thu + đường số đơn + đường phí platform.
- Mặc định 6 tháng gần nhất; tháng không phát sinh hiển thị 0 (chart liền mạch).
- Chưa có dữ liệu → trạng thái rỗng "Chưa có dữ liệu kinh doanh".

### 5.3 Card "Đánh giá của cư dân"

- Điểm trung bình + số lượt đánh giá (lọc theo dự án).
- Bảng các đánh giá: đơn/ticket, loại, người liên quan, điểm (sao), nhận xét, thời điểm.
- Chưa có → trạng thái rỗng "Chưa có đánh giá".

### 5.4 Các tab

| Tab | Nội dung |
|-----|----------|
| Thông tin chung | Thông tin dự án (mã, tên, địa chỉ, trạng thái) + thông tin công ty vận hành (mã, tên, trạng thái tenant, tên miền) + nút sang chi tiết công ty VH. Tất cả chỉ đọc. |
| Đơn hàng | Bảng đơn hàng PMC trên dự án: mã đơn, giá trị, **phí platform/đơn**, trạng thái, đánh giá CD, thời gian. Có tóm tắt tổng giá trị + tổng phí platform; tìm theo mã đơn. Click mở chi tiết đơn (hộp thoại). |
| Cấu hình | Cấu hình **phí nền tảng riêng theo dự án** (xem §6). |

> **Tab "Vendor" của mockup**: là dữ liệu marketplace (đối tác resi_mart) — **ngoài phạm vi** spec này (đã chốt nguồn dữ liệu = đơn PMC nội bộ). Để lại cho spec marketplace riêng nếu cần.

## 6. Tab Cấu hình — Phí nền tảng theo dự án

Cho phép đội platform thiết lập **mức phí nền tảng (phần TNP thu) riêng cho dự án này**, kế thừa cấu hình mặc định của công ty vận hành (cấu hình tại trang `Công ty vận hành → tab Cấu hình`) trừ khi chọn ghi đè.

### 6.1 Các trường

| Trường | Loại | Ghi chú |
|--------|------|---------|
| Kế thừa phí từ công ty VH | Công tắc (switch) | Bật: dùng cấu hình mặc định của tenant. Tắt: hiện các trường ghi đè bên dưới |
| Hình thức thu phí | Dropdown | Không thu / Theo gói / Cố định mỗi đơn / Theo % đơn / Cố định + % (chỉ khi tắt kế thừa) |
| Chu kỳ gói | Dropdown | Theo tháng / Theo năm (chỉ khi hình thức = theo gói) |
| Giá gói | Số | (chỉ khi hình thức = theo gói) |
| Phí cố định / đơn | Số | (chỉ khi hình thức = cố định hoặc cố định+%) |
| % trên giá trị đơn | Số (0–100) | (chỉ khi hình thức = % hoặc cố định+%) |
| Cung cấp dịch vụ | Công tắc | Bật/tắt platform cung cấp dịch vụ cho dự án |
| Ghi chú nội bộ | Textarea | Ghi chú cho đội vận hành platform |

### 6.2 Hiển thị cấu hình hiệu lực

- Khi bật "kế thừa": hiển thị rõ mức phí đang áp dụng = cấu hình mặc định của tenant (read-only) để người dùng biết đang dùng gì.
- Khi tắt "kế thừa": hiển thị mức phí ghi đè đang nhập.

### 6.3 Hành động

| Hành động | Kết quả |
|-----------|---------|
| Lưu cấu hình | Gửi dữ liệu → thông báo thành công |

## 7. Luồng người dùng

### 7.1 Thêm dự án

```
Danh sách → "Thêm dự án" → Chọn công ty VH + nhập mã/tên/địa chỉ → Tạo
  ✓ Thành công: thông báo + điều hướng sang chi tiết dự án vừa tạo
  ✗ Trùng mã / tenant vô hiệu: thông báo lỗi trên form, giữ nguyên dữ liệu
```

### 7.2 Xem & cấu hình dự án

```
Danh sách → click dự án → Chi tiết
  → Xem biểu đồ kinh doanh + đánh giá cư dân
  → Tab Đơn hàng: xem đơn + phí platform
  → Tab Cấu hình: bật/tắt kế thừa phí → (ghi đè) → Lưu
    ✓ Thành công: thông báo
```

### 7.3 Bật / ngừng cung cấp dịch vụ

```
Danh sách (menu thao tác) hoặc Chi tiết → Bật/Ngừng cung cấp dịch vụ → Xác nhận
  ✓ Thành công: thông báo + cập nhật badge trạng thái
```

## 8. Trạng thái & xử lý lỗi

- Mỗi bảng/card xử lý 3 trạng thái: đang tải / lỗi / rỗng (dùng trạng thái rỗng có mô tả).
- Dự án không tồn tại (truy cập trực tiếp URL sai) → trạng thái rỗng "Không tìm thấy dự án" + nút về danh sách.
- Danh sách toàn nền tảng có thể tải chậm hơn các trang khác (gộp dữ liệu nhiều tenant) → hiển thị trạng thái đang tải rõ ràng.

## 9. Phân quyền

| Hành động | Quyền |
|-----------|-------|
| Xem danh sách / chi tiết | Người dùng platform (guard `auth:requester`) |
| Thêm dự án | Người dùng platform |
| Cấu hình phí / bật-tắt dịch vụ | Người dùng platform |

## 10. Ghi chú nghiệp vụ

- "Phí nền tảng theo dự án" là phần **TNP thu của tenant** — KHÔNG phải hoa hồng nội bộ tenant chia cho nhân sự/đối tác. Đừng nhầm với cấu hình hoa hồng trong cổng vận hành của tenant.
- Cấu hình mặc định (toàn tenant) đặt ở trang **Công ty vận hành → tab Cấu hình**; cấu hình theo dự án ở đây chỉ **ghi đè** cho riêng dự án.
- Phí platform hiển thị trên đơn là **số đã đóng băng tại kỳ chốt phí** (đơn chưa vào kỳ → 0), không phải ước tính.
- Tái dùng tối đa: card biểu đồ kinh doanh và card đánh giá cư dân đã có ở trang chi tiết công ty vận hành — chỉ truyền thêm phạm vi dự án.
