# Báo cáo SLA - Đặc tả nghiệp vụ Frontend

> Module: `PMC/Report/Sla` | Ngày tạo: 2026-04-13 | Trạng thái: Draft

## 1. Tổng quan

Màn hình dashboard báo cáo SLA hiển thị hiệu suất xử lý ticket theo cam kết SLA. Gồm: 4 thẻ KPI tổng hợp, biểu đồ xu hướng theo tháng, và 3 tab bảng chi tiết (theo dự án / nhân viên / ticket). Tất cả dữ liệu là read-only, lấy từ API backend.

**Mockup tham khảo:** `BA-TNP-SERVICES/app/pages/modules/bao-cao/sla.vue`

## 2. Danh sách trang

| Trang | Route | Mô tả |
|-------|-------|-------|
| Báo cáo SLA | `/reports/sla` | Dashboard SLA với KPI, chart, bảng chi tiết |

> Chỉ có 1 trang — không có form tạo/sửa (báo cáo read-only).

## 3. Trang báo cáo SLA

### 3.1 KPI tổng hợp (4 thẻ)

| Thẻ | Dữ liệu | Màu sắc | Ghi chú |
|-----|---------|---------|---------|
| Tỷ lệ đúng hạn | `on_time_rate` + `%` | `text-success` (xanh lá) | Số lớn, bold |
| Ticket vi phạm | `breached_count` | `text-error` (đỏ) | Số nguyên |
| Thời gian xử lý (median) | `median_resolution_hours` + ` h` | Mặc định | Đơn vị giờ |
| Tỷ lệ mở lại | `reopened_rate` + `%` | Mặc định | |

- Mỗi thẻ hiển thị: nhãn nhỏ phía trên, giá trị lớn ở giữa, `period_label` phía dưới (VD: "30 ngày gần nhất").
- Layout: grid 2 cột (mobile) → 4 cột (desktop).

### 3.2 Bộ lọc dự án

| Bộ lọc | Loại | Mô tả |
|--------|------|-------|
| Dự án | Dropdown đơn chọn | Lọc theo dự án, áp dụng cho cả 3 tab bảng chi tiết |

- Options: "Tất cả dự án" (mặc định, value = `'all'`) + danh sách dự án từ API.
- **Không dùng value rỗng `''`** — Radix/Nuxt UI không cho phép.
- Ghi chú bên dưới: "Áp dụng cho các tab Theo dự án, Theo nhân viên, Theo ticket bên dưới."

### 3.3 Biểu đồ xu hướng SLA theo tháng

| Thành phần | Mô tả |
|-----------|-------|
| Loại | Line chart (SVG thủ công, không dùng thư viện chart) |
| Trục X | Tháng (VD: T10, T11, T12, T1, T2, T3) |
| Trục Y | Tỷ lệ đúng hạn (%) — scale động theo min/max dữ liệu |
| Đường xanh lá (solid) | Tỷ lệ đúng hạn thực tế mỗi tháng |
| Đường vàng (dashed) | Mục tiêu SLA (lấy `sla_target_percent` từ API, mặc định 90%) |
| Điểm dữ liệu | Circle + label % phía trên, label tháng phía dưới |
| Responsive | Scroll ngang trên mobile (min-width 520px) |

**Legend:** Bên phải header card:
- Đường xanh: "Đúng hạn %"
- Đường nét đứt vàng: "Mục tiêu 90%"

### 3.4 Tab bảng chi tiết (3 tab)

#### Tab 1: Theo dự án

| Cột | Dữ liệu | Format |
|-----|---------|--------|
| Dự án | `project_name` | Text |
| Đã đóng | `tickets_closed` | Số nguyên |
| Đúng hạn % | `on_time_rate` | `{value}%` |
| Vi phạm | `breached` | Số nguyên |
| TB (giờ) | `avg_hours` | `{value} h` |

**Header action:** Link "Mở SLA / Vi phạm (chi tiết ticket)" → route `/quan-ly-ticket/sla-vi-pham` (trang SLA vi phạm trong module Quản lý ticket).

#### Tab 2: Theo nhân viên

| Cột | Dữ liệu | Format |
|-----|---------|--------|
| Dự án | `project_name` | Text |
| Nhân viên | `staff_name` | Text |
| Ticket xử lý | `tickets_handled` | Số nguyên |
| Đúng hạn % | `on_time_rate` | `{value}%` |
| Vi phạm | `breached` | Số nguyên |
| TB (giờ) | `avg_resolution_hours` | `{value} h` |

#### Tab 3: Theo ticket

| Cột | Dữ liệu | Format |
|-----|---------|--------|
| Mã ticket | `ticket_code` | Monospace font (format `TK-{year}-{seq}`, VD: `TK-2026-001`) |
| Dự án | `project_name` | Text |
| Tags | `tags` | Danh sách UBadge (VD: `PCCC`, `Sự cố kỹ thuật`). Nếu rỗng hiển thị `—` |
| Giai đoạn SLA | `phase` | "Giai đoạn 1" / "Giai đoạn 2" |
| Mục tiêu (h) | `sla_target_hours` | `{value} h` |
| Thực tế (h) | `actual_hours` | `{value} h` |
| Kết quả | `result.label` | Badge: `success` nếu "Đúng hạn", `error` nếu "Vi phạm" |

- Tab này có **phân trang** (mặc định 15 rows/page).

### 3.5 Hành động

| Hành động | Vị trí | Kết quả |
|-----------|--------|---------|
| Lọc dự án | Dropdown ở card filter | Cập nhật 3 tab bảng chi tiết |
| Mở SLA / Vi phạm | Link trên tab "Theo dự án" | Navigate đến `/quan-ly-ticket/sla-vi-pham` |

## 4. Luồng người dùng

### 4.1 Xem báo cáo tổng quan

```
Menu Báo cáo → SLA → Trang load
  → 4 thẻ KPI hiển thị (loading skeleton khi đang fetch)
  → Biểu đồ xu hướng hiển thị
  → Tab "Theo dự án" hiển thị mặc định
```

### 4.2 Lọc theo dự án

```
Chọn dự án từ dropdown
  → 3 tab bảng chi tiết tự động cập nhật (re-fetch API với project_id)
  → KPI cards và chart KHÔNG thay đổi (hiển thị toàn bộ)
```

### 4.3 Chuyển tab

```
Click tab "Theo nhân viên" / "Theo ticket"
  → Hiển thị bảng tương ứng
  → Dữ liệu đã được filter theo dự án đang chọn
```

### 4.4 Xem chi tiết vi phạm

```
Tab "Theo dự án" → Click link "Mở SLA / Vi phạm (chi tiết ticket)"
  → Navigate đến module Quản lý ticket, màn SLA vi phạm
```

## 5. Trạng thái UI

### 5.1 Loading

- KPI cards: Skeleton placeholder cho mỗi thẻ
- Chart: Skeleton hoặc empty SVG
- Tables: UTable loading state

### 5.2 Error

- Toàn trang: `UAlert` color `error` với message lỗi
- Từng section: có thể hiển thị lỗi riêng nếu một API fail

### 5.3 Empty

- Tables: "Không có dữ liệu" message trong UTable
- Chart: Ẩn hoặc hiển thị message "Chưa có dữ liệu xu hướng"

## 6. Phân quyền

| Hành động | Quyền cần có |
|-----------|-------------|
| Xem báo cáo SLA | `og-tickets.view` |

> Menu "Báo cáo → SLA" chỉ hiển thị cho user có quyền `og-tickets.view`.

## 7. Ghi chú nghiệp vụ

- **Read-only:** Trang này không có form tạo/sửa/xóa. Mọi thay đổi dữ liệu SLA diễn ra trong module Quản lý ticket.
- **SVG chart thủ công:** Không dùng thư viện chart bên ngoài (Chart.js, ApexCharts...). Dùng SVG inline để nhẹ và kiểm soát hoàn toàn styling.
- **Filter chỉ áp dụng cho bảng chi tiết:** KPI cards và biểu đồ xu hướng luôn hiển thị dữ liệu toàn bộ (tất cả dự án), không bị ảnh hưởng bởi filter dự án. Nếu sau này cần filter KPI theo dự án, cần thêm API param riêng.
- **Mục tiêu SLA:** Lấy từ API response (`sla_target_percent`), không hardcode trong frontend. Hiện tại là 90%.
- **Tags (thay cho category):** OgTicket dùng hệ thống tags (many-to-many) thay vì category đơn. Tags được auto-gắn từ danh mục cư dân chọn khi tạo yêu cầu. API trả mảng chuỗi `tags: ["PCCC", "Sự cố kỹ thuật"]`. FE hiển thị mỗi tag là 1 UBadge nhỏ. Nếu mảng rỗng, hiển thị `—`.
- **Ticket code:** Lấy từ `ticket_code` trong API response (đồng bộ từ Platform/Ticket, format `TK-{year}-{seq}`). Không generate ở FE.
- **Trend mặc định 6 tháng:** Có thể mở rộng thêm selector khoảng thời gian sau.
