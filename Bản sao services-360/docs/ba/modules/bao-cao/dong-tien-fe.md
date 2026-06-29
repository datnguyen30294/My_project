# Báo cáo Dòng tiền - Đặc tả nghiệp vụ Frontend

> Module: `PMC/Report/CashFlow` | Ngày tạo: 2026-04-13 | Trạng thái: Draft

## 1. Tổng quan

Màn hình báo cáo dòng tiền hiển thị tình hình tiền vào/ra ở mức quản trị. Gồm: 4 thẻ KPI, bảng breakdown theo danh mục, bảng dòng tiền theo ngày, và bảng chi tiết giao dịch. Tất cả dữ liệu là read-only, lấy từ API backend.

**Mockup tham khảo:**
- `BA-TNP-SERVICES/app/pages/modules/bao-cao/dong-tien.vue`
- Tab "Dòng tiền" trong `frontend/app/pages/reports/index.vue` (mock data hiện tại)

## 2. Danh sách trang

| Trang | Route | Mô tả |
|-------|-------|-------|
| Báo cáo Dòng tiền | `/reports/cashflow` | Dashboard dòng tiền với KPI, bảng category, bảng ngày, bảng giao dịch |

> Chỉ có 1 trang — không có form tạo/sửa (báo cáo read-only).
> Thay thế tab "Dòng tiền" trong trang `/reports` hiện tại (mock data).

## 3. Trang báo cáo Dòng tiền

### 3.1 Bộ lọc

| Bộ lọc | Loại | Mô tả |
|--------|------|-------|
| Khoảng thời gian | Date range picker | Mặc định 30 ngày gần nhất |
| Dự án | Dropdown đơn chọn | "Tất cả dự án" (mặc định) + danh sách dự án từ API |

- Date range dùng `VueDatePicker` (đã có trong trang reports).
- Khi chọn dự án, **tất cả** section đều cập nhật (KPI, bảng category, bảng ngày, bảng giao dịch).
- Ghi chú dưới filter: khi lọc theo dự án, giao dịch thủ công (nạp/rút thủ công) không thuộc dự án cụ thể sẽ không hiển thị.

### 3.2 KPI tổng hợp (4 thẻ)

| Thẻ | Dữ liệu | Màu sắc | Ghi chú |
|-----|---------|---------|---------|
| Số dư hiện tại | `current_balance` | Mặc định | Format tiền VND. **Không bị ảnh hưởng bởi filter** — luôn hiển thị số dư thực tế |
| Tổng tiền vào | `total_inflow` | `text-success` (xanh lá) | Prefix `+`, format tiền VND |
| Tổng tiền ra | `total_outflow` | `text-error` (đỏ) | Prefix `-`, format tiền VND |
| Dòng tiền ròng | `net_flow` | Xanh nếu >= 0, đỏ nếu < 0 | Prefix `+`/`-`, format tiền VND |

- Layout: grid 2 cột (mobile) → 4 cột (desktop).
- Mỗi thẻ hiển thị: nhãn nhỏ phía trên, giá trị lớn ở giữa, `period_label` phía dưới (VD: "30 ngày gần nhất").
- `current_balance` luôn hiển thị số dư thực tế tài khoản quỹ, không filter theo dự án/ngày.

### 3.3 Bảng tiền vào/ra theo danh mục

| Cột | Dữ liệu | Format |
|-----|---------|--------|
| Danh mục | `category.label` | Text (VD: "Thu công nợ", "Chi hoa hồng") |
| Chiều | Inflow → "Tiền vào", Outflow → "Tiền ra" | Badge: success (xanh) cho tiền vào, error (đỏ) cho tiền ra |
| Số tiền | `amount` | Format tiền VND |
| Số giao dịch | `count` | Số nguyên |

- Chia thành 2 nhóm: **Tiền vào** (inflow_by_category) trước, **Tiền ra** (outflow_by_category) sau.
- Sắp xếp: theo amount giảm dần trong mỗi nhóm.

### 3.4 Bảng dòng tiền theo ngày

| Cột | Dữ liệu | Format |
|-----|---------|--------|
| Ngày | `date` | DD/MM/YYYY |
| Tiền vào | `total_inflow` | Format tiền VND, `text-success` |
| Tiền ra | `total_outflow` | Format tiền VND, `text-error` |
| Ròng | `net` | Format tiền VND, xanh nếu >= 0, đỏ nếu < 0 |

- Sắp xếp: ngày mới nhất trước.
- Hàng nào `net < 0` → highlight nhẹ (background đỏ nhạt hoặc text đỏ).

### 3.5 Bảng chi tiết giao dịch

| Cột | Dữ liệu | Format |
|-----|---------|--------|
| Ngày | `transaction_date` | DD/MM/YYYY |
| Mã GD | `code` | Monospace font (VD: `IN-2026-0038`) |
| Dự án | `project_name` | Text, nếu null → `—` |
| Chiều | `direction.label` | Badge: success "Tiền vào", error "Tiền ra" |
| Danh mục | `category.label` | Text |
| Số tiền | `amount` | Format tiền VND |
| Ghi chú | `note` | Text, nếu null → `—` |

- Có **phân trang** (mặc định 15 rows/page).
- Sắp xếp: ngày mới nhất trước.

### 3.6 Hành động

| Hành động | Vị trí | Kết quả |
|-----------|--------|---------|
| Lọc khoảng ngày | Date range picker | Cập nhật tất cả section |
| Lọc dự án | Dropdown filter | Cập nhật tất cả section (trừ current_balance) |
| Phân trang giao dịch | Pagination controls | Tải trang tiếp theo |

## 4. Luồng người dùng

### 4.1 Xem báo cáo tổng quan

```
Menu Báo cáo → Dòng tiền → Trang load
  → 4 thẻ KPI hiển thị (loading skeleton khi đang fetch)
  → Bảng theo danh mục hiển thị
  → Bảng theo ngày hiển thị
  → Bảng chi tiết giao dịch hiển thị (trang 1)
```

### 4.2 Lọc theo dự án

```
Chọn dự án từ dropdown
  → Tất cả section cập nhật (re-fetch API với project_id)
  → current_balance KHÔNG thay đổi (luôn toàn bộ)
  → Giao dịch thủ công bị ẩn khi lọc dự án
```

### 4.3 Thay đổi khoảng ngày

```
Chọn khoảng ngày mới từ date picker
  → Tất cả section cập nhật (trừ current_balance)
  → Bảng giao dịch quay về trang 1
```

## 5. Trạng thái UI

### 5.1 Loading

- KPI cards: Skeleton placeholder cho mỗi thẻ
- Bảng: UTable loading state

### 5.2 Error

- Toàn trang: `UAlert` color `error` với message lỗi
- Từng section: có thể hiển thị lỗi riêng nếu một API fail

### 5.3 Empty

- Bảng: "Không có dữ liệu" message trong UTable
- KPI: Hiển thị `0 đ` cho các giá trị tiền

## 6. Phân quyền

| Hành động | Quyền cần có |
|-----------|-------------|
| Xem báo cáo Dòng tiền | `treasury.view` |

> Menu "Báo cáo → Dòng tiền" chỉ hiển thị cho user có quyền `treasury.view`.

## 7. Ghi chú nghiệp vụ

- **Read-only:** Trang này không có form tạo/sửa/xóa. Mọi thay đổi dữ liệu dòng tiền diễn ra trong module Quản lý quỹ.
- **Số dư luôn toàn cục:** `current_balance` không bị filter theo dự án hay khoảng ngày. Phản ánh số dư thực tế của tài khoản quỹ mặc định.
- **Giao dịch thủ công khi lọc dự án:** Nạp/rút tiền thủ công không gắn với đơn hàng nào → không thuộc dự án. Khi lọc dự án, các giao dịch này bị loại khỏi kết quả. Cần ghi chú rõ trên UI để người dùng hiểu.
- **Format tiền VND:** Dùng hàm format number hiện có (VD: `1.234.567 đ`). Không hiển thị phần thập phân.
- **Mối liên hệ với trang Quản lý quỹ:** Trang này là view tổng hợp. Chi tiết giao dịch (xem/xóa/thêm) vẫn thực hiện tại `/pmc/finance/treasury`.
- **Default date range:** 30 ngày gần nhất, consistent với SLA report.
