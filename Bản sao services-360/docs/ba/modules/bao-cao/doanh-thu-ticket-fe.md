# Báo cáo Doanh thu (ticket) - Đặc tả nghiệp vụ Frontend

> Module: `PMC/Report/RevenueTicket` | Ngày tạo: 2026-04-14 | Trạng thái: Draft

## 1. Tổng quan

Màn hình báo cáo Doanh thu (ticket) hiển thị doanh thu phát sinh từ luồng `ticket -> đơn hàng`, nhìn theo:

- Tổng doanh thu
- Số ticket tạo ra doanh thu
- Cơ cấu theo category ticket
- Cơ cấu theo nhân viên xử lý
- Diễn biến ticket theo ngày và theo dự án

Đây là trang **read-only**, phục vụ góc nhìn vận hành + quản trị doanh thu, khác với báo cáo Doanh thu & Lợi nhuận ở chỗ:

- Không hiển thị chi phí, LN gộp, margin
- Tập trung vào ticket, category và nhân viên

**Mockup tham khảo:**

- `BA-TNP-SERVICES/app/pages/modules/bao-cao/doanh-thu-ticket.vue`
- `BA-TNP-SERVICES/content/docs/bao-cao/doanh-thu-ticket.md`

## 2. Danh sách trang

| Trang | Route | Mô tả |
|-------|-------|-------|
| Doanh thu (ticket) | `/reports/revenue-ticket` | Dashboard doanh thu gắn ticket với KPI, donut, line chart, bảng category/staff/detail |

> Chỉ có 1 trang - không có form tạo/sửa.

## 3. Trang báo cáo Doanh thu (ticket)

### 3.1 Bộ lọc

| Bộ lọc | Loại | Mô tả |
|--------|------|-------|
| Dự án | Dropdown đơn chọn | "Tất cả dự án" (mặc định) + danh sách dự án từ API |
| Từ ngày | Date input | Không bắt buộc |
| Đến ngày | Date input | Không bắt buộc |

- Khi thay đổi bộ lọc -> toàn bộ section trên trang cập nhật
- Nếu để trống cả `Từ ngày` và `Đến ngày` -> hiểu là **toàn thời gian**
- Hiển thị `period_label` dưới card filter để người dùng biết scope hiện tại

**Ghi chú dưới filter:**

- Doanh thu lấy từ luồng `ticket -> đơn -> công nợ`
- Category ticket hiện là **category quy ước** suy ra từ dữ liệu order lines, không phải field category riêng trên ticket

### 3.2 KPI tổng hợp (4 thẻ)

Layout: grid 2 cột (mobile) -> 4 cột (desktop).

| Thẻ | Dữ liệu | Ghi chú |
|-----|---------|---------|
| Tổng doanh thu | `total_revenue` | Format tiền VND |
| Số ticket | `ticket_count` | Số nguyên |
| Số dòng ghi nhận | `record_count` | Số dòng aggregate trong bảng chi tiết |
| Category khác nhau | `category_count` | Số nguyên |

- Các thẻ không có action
- `total_revenue` hiển thị dạng `1.234.567 đ`
- Các card count hiển thị số nguyên lớn, tabular nums

### 3.3 Donut chart theo category ticket

**Card title:** `Tỷ suất theo category ticket`

**Mô tả phụ:** `Số ticket đã lọc - tỷ lệ % theo từng category`

**Nguồn dữ liệu:** `by-category`

| Thành phần | Dữ liệu |
|------------|---------|
| Slice label | `category_label` |
| Giá trị donut | `ticket_count` |
| Tỷ trọng | `ticket_share_percent` |

- Legend sắp xếp theo `revenue DESC` như API trả về
- Trong legend có thể hiển thị thêm `ticket_count`
- Nếu không có dữ liệu -> hiển thị empty state trong card

### 3.4 Donut chart theo nhân viên xử lý

**Card title:** `Tỷ suất theo nhân viên xử lý`

**Mô tả phụ:** `Số ticket đã lọc - tỷ lệ % theo cá nhân`

**Nguồn dữ liệu:** `by-staff`

| Thành phần | Dữ liệu |
|------------|---------|
| Slice label | `staff_name` |
| Giá trị donut | `ticket_count` |
| Tỷ trọng | `ticket_share_percent` |

- Nếu `staff_name = "Chưa gán"` vẫn hiển thị như một bucket hợp lệ
- Nếu không có dữ liệu -> hiển thị empty state trong card

### 3.5 Line chart số ticket theo ngày và theo dự án

**Card title:** `Số ticket theo ngày và theo dự án`

**Mô tả phụ:** `Mỗi đường = một dự án; trục hoành = ngày có phát sinh`

**Nguồn dữ liệu:** `daily`

| Thành phần | Dữ liệu |
|------------|---------|
| Trục X | `date` |
| Trục Y | `ticket_count` |
| Series | `project_name` |

- Dùng line chart responsive
- Khi đang lọc 1 dự án -> chart chỉ còn 1 series
- Legend hiển thị theo `project_name`
- Tooltip mỗi điểm nên có:
  - `project_name`
  - `date`
  - `ticket_count`
  - `revenue`

### 3.6 Tabs aggregate

Có 2 tab:

| Tab | Mục đích |
|-----|----------|
| `Hệ thống (theo category)` | Xem doanh thu theo category ticket |
| `Theo cá nhân` | Xem doanh thu theo nhân viên xử lý |

#### Tab 1 - Hệ thống (theo category)

**Nguồn dữ liệu:** `by-category`

| Cột | Dữ liệu | Format |
|-----|---------|--------|
| Category ticket | `category_label` | Text |
| Doanh thu | `revenue` | Format tiền VND |
| Số ticket | `ticket_count` | Số nguyên |

- Sắp xếp mặc định theo doanh thu giảm dần

#### Tab 2 - Theo cá nhân

**Nguồn dữ liệu:** `by-staff`

| Cột | Dữ liệu | Format |
|-----|---------|--------|
| Nhân viên | `staff_name` | Text |
| Doanh thu | `revenue` | Format tiền VND |
| Số ticket | `ticket_count` | Số nguyên |

- Sắp xếp mặc định theo doanh thu giảm dần

### 3.7 Bảng chi tiết dòng

**Card title:** `Chi tiết dòng (đã lọc)`

**Nguồn dữ liệu:** `details`

| Cột | Dữ liệu | Format |
|-----|---------|--------|
| Ngày | `date` | DD/MM/YYYY |
| Dự án | `project_name` | Text |
| Category | `category_label` | Text |
| NV | `staff_name` | Text |
| Ticket | `ticket_count` | Số nguyên |
| Doanh thu | `revenue` | Format tiền VND |

**Lưu ý hiển thị:**

- Đây là **bảng aggregate**, không phải danh sách ticket raw
- Mỗi dòng là tổng hợp theo `ngày x dự án x category x nhân viên`
- Không có thao tác click row trong phase hiện tại

### 3.8 Hành động

| Hành động | Kết quả |
|-----------|---------|
| Chọn dự án | Cập nhật KPI, 2 donut, chart, tabs và bảng chi tiết |
| Chọn từ ngày | Cập nhật toàn bộ trang |
| Chọn đến ngày | Cập nhật toàn bộ trang |

## 4. Luồng người dùng

### 4.1 Xem báo cáo mặc định

```text
Menu Báo cáo -> Doanh thu (ticket) -> Trang load
  -> Bộ lọc mặc định: tất cả dự án, không giới hạn ngày
  -> KPI tổng hợp hiển thị
  -> 2 donut chart hiển thị
  -> Line chart theo ngày x dự án hiển thị
  -> Tab category mở mặc định
  -> Bảng chi tiết dòng hiển thị
```

### 4.2 Lọc theo dự án

```text
Chọn dự án
  -> Toàn bộ section cập nhật theo project
  -> Chart chỉ còn series thuộc dự án đó
  -> Tab category / staff và bảng chi tiết đều thu hẹp theo project
```

### 4.3 Lọc theo khoảng ngày

```text
Nhập từ ngày / đến ngày
  -> Toàn bộ section cập nhật
  -> period_label đổi theo khoảng ngày
  -> Nếu không còn dữ liệu trong khoảng chọn -> hiện empty state
```

## 5. Trạng thái UI

### 5.1 Loading

- KPI cards: Skeleton placeholder
- Donut / line chart: card loading state
- Tabs / bảng: UTable loading state

### 5.2 Error

- Toàn trang: `UAlert` color `error`
- Message ưu tiên lấy từ API

### 5.3 Empty

- KPI: hiển thị `0 đ`, `0`
- Donut: empty state "Chưa có dữ liệu"
- Line chart: empty state "Chưa có điểm dữ liệu theo ngày"
- Bảng: "Không có dữ liệu"

## 6. Phân quyền

| Hành động | Quyền cần có |
|-----------|--------------|
| Xem báo cáo Doanh thu (ticket) | `receivables.view` |

> Menu "Báo cáo -> Doanh thu (ticket)" chỉ hiển thị cho user có quyền `receivables.view`.

## 7. Ghi chú nghiệp vụ

- **Nguồn doanh thu:** đồng bộ với report tài chính, chỉ tính ticket có order hoàn thành và receivable ở trạng thái `paid`, `overpaid`, `completed`.
- **Category ticket trong v1 là category quy ước:** hệ thống suy ra từ bucket doanh thu chính của order lines. Hiện chưa có field category riêng trên `og_tickets`.
- **Nhân viên xử lý trong v1 là owner báo cáo duy nhất:** dùng assignee đầu tiên của ticket, fallback `received_by`. Rule này nhằm tránh double-count doanh thu khi ticket có nhiều assignee.
- **Bảng chi tiết là dữ liệu nhóm:** không phải từng ticket raw.
- **Blank date = toàn thời gian:** nếu người dùng không nhập ngày, report không tự áp mặc định 30 ngày.
- **Không phải báo cáo lợi nhuận:** nếu cần xem chi phí/LN gộp/margin, dùng báo cáo `Doanh thu & lợi nhuận`.
