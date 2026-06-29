# Báo cáo Phân bổ hoa hồng - Đặc tả nghiệp vụ Frontend

> Module: `PMC/Report/Commission` | Ngày tạo: 2026-04-14 | Trạng thái: Draft

## 1. Tổng quan

Màn hình báo cáo phân bổ hoa hồng hiển thị tổng hợp hoa hồng cho 4 bên (Công ty vận hành, Ban quản trị, Ban quản lý, Platform) và chi tiết phân bổ theo từng nhân viên. Tất cả dữ liệu là read-only, lấy từ API backend.

**Mockup tham khảo:**
- `BA-TNP-SERVICES/app/pages/modules/bao-cao/hoa-hong-phan-bo.vue`
- `BA-TNP-SERVICES/content/docs/bao-cao/hoa-hong-phan-bo.md`

## 2. Danh sách trang

| Trang | Route | Mô tả |
|-------|-------|-------|
| Phân bổ hoa hồng | `/reports/commission` | Dashboard phân bổ HH: 4 thẻ KPI, thông tin bổ sung, bảng chi tiết NV |

> Chỉ có 1 trang — không có form tạo/sửa (báo cáo read-only).

## 3. Trang báo cáo Phân bổ hoa hồng

### 3.1 Bộ lọc

| Bộ lọc | Loại | Mô tả |
|--------|------|-------|
| Khoảng thời gian | Date range picker | Mặc định 30 ngày gần nhất |
| Dự án | Dropdown đơn chọn | "Tất cả dự án" (mặc định) + danh sách dự án từ API |

- Khi thay đổi bộ lọc → tất cả section cập nhật (summary, thông tin bổ sung, bảng chi tiết).
- Hiển thị **period label** dưới bộ lọc (VD: "Kỳ: tháng 3/2026", "30 ngày gần nhất").

### 3.2 Alert box

Hiển thị `UAlert` ở đầu trang (dưới bộ lọc, trên summary cards):
- Variant: `subtle`, color: `info`
- Nội dung: Giải thích 4 thẻ bên dưới hiển thị tổng hoa hồng phân bổ cho mỗi bên từ các đơn hàng trong kỳ chốt. Phân biệt rõ: "Hoa hồng phân bổ cho Công ty VH" khác với "Lợi nhuận gộp công ty VH" (xem thẻ thông tin bên dưới).

### 3.3 Thẻ KPI — Hoa hồng 4 bên (Summary Cards)

Layout: grid 2 cột (mobile) → 4 cột (desktop).

| Thẻ | Dữ liệu | Mô tả |
|-----|---------|-------|
| Công ty vận hành | `party_totals.operating_company` | "Hoa hồng phân bổ — Công ty vận hành". Phần HH ghi nhận theo cấu hình chia trên mỗi đơn. |
| Ban quản trị | `party_totals.board_of_directors` | "Ban quản trị". HH phân bổ theo cấu hình dự án. |
| Ban quản lý (BQL) | `party_totals.management` | "Ban quản lý (BQL)". Phần HH được phân phối tiếp cho phòng ban → nhân viên. |
| Nền tảng (Platform) | `party_totals.platform` | "Hoa hồng — Nền tảng (Platform)". Tính theo quy tắc cố định hệ thống. |

- Format: tiền VND (VD: `428.500.000 đ`).
- Mỗi thẻ có dòng mô tả ngắn bên dưới giá trị giải thích ý nghĩa nghiệp vụ.
- Loading: skeleton placeholder cho mỗi thẻ.

### 3.4 Thẻ thông tin bổ sung (2 thẻ)

Layout: grid 1 cột (mobile) → 2 cột (desktop). Nằm dưới 4 thẻ KPI.

**Thẻ 1: Lợi nhuận công ty vận hành (góc kinh doanh)**

| Thuộc tính | Giá trị |
|-----------|---------|
| Tiêu đề | "Lợi nhuận công ty vận hành (góc kinh doanh)" |
| Phụ đề | "Lợi nhuận gộp ước tính" |
| Giá trị | `estimated_gross_profit` — format tiền VND |
| Mô tả | Doanh thu (sau chiết khấu) − Hoa hồng. Khác với hoa hồng phân bổ cho VH ở thẻ trên. |
| Link | Liên kết sang báo cáo "Doanh thu & lợi nhuận" |

**Thẻ 2: Hoa hồng nền tảng (Platform)**

| Thuộc tính | Giá trị |
|-----------|---------|
| Tiêu đề | "Hoa hồng nền tảng (Platform)" |
| Mô tả | Platform có quy tắc cố định, không cấu hình theo dự án |
| Quy tắc | `{percent}%` trên cơ sở hoa hồng + `{fixed_per_order}` đ/đơn hàng |
| Tổng kỳ | Hiển thị tổng Platform cho kỳ hiện tại (= thẻ Platform ở trên) |

### 3.5 Bảng chi tiết theo nhân viên

**Tiêu đề:** "Chi tiết theo nhân viên"
**Link phụ:** Liên kết sang "Tổng hợp hoa hồng" (kế toán)

**Bộ lọc bảng:**

| Bộ lọc | Loại | Mô tả |
|--------|------|-------|
| Lọc theo dự án | Dropdown | "Tất cả dự án" (mặc định) + danh sách dự án. Lọc client-side nếu data đã load. |

**Cột bảng:**

| Cột | Dữ liệu | Format | Ghi chú |
|-----|---------|--------|---------|
| Nhân viên | `staff_name` | Text | |
| Phòng ban | `department_name` | Text | |
| Dự án | `project_name` | Text | |
| HH VH | `operating_company` | Format number (VD: `24.800.000`) | Hoa hồng quy chiếu — phần VH từ đơn hàng NV xử lý |
| BQT | `board_of_directors` | Format number | Hoa hồng quy chiếu — phần BQT |
| BQL | `management` | Format number | **Thực nhận** — phần BQL phân bổ cho NV |
| HH Platform | `platform` | Format number | Hoa hồng quy chiếu — phần Platform |
| Tổng | `total` | Format number, **bold** | Tổng 4 cột |

- Sắp xếp mặc định: theo `total` giảm dần (NV có tổng HH cao nhất trước).
- Empty state: "Không có dữ liệu" khi không có snapshots trong kỳ.

### 3.6 Thẻ tham chiếu mã code

Bảng nhỏ hiển thị mapping mã code cho các bên (dành cho developer/admin):

| Hiển thị | Mã code |
|----------|---------|
| Công ty vận hành | `ACCOUNT_ID_OPERATING_COMPANY` |
| Ban quản trị | `ACCOUNT_ID_BOARD_OF_MANAGEMENT` |
| Ban quản lý (BQL) | `ACCOUNT_ID_MANAGEMENT_BOARD` |
| Nền tảng | `ACCOUNT_ID_PLATFORM` |

> Hiển thị dưới cùng trang, mang tính tham khảo kỹ thuật.

## 4. Luồng người dùng

### 4.1 Xem báo cáo tổng quan

```
Menu Báo cáo → Phân bổ hoa hồng → Trang load
  → Alert box giải thích hiển thị
  → 4 thẻ KPI hoa hồng 4 bên (loading skeleton → data)
  → 2 thẻ thông tin bổ sung (LN gộp VH + Platform rules)
  → Bảng chi tiết theo nhân viên
  → Thẻ tham chiếu mã code
```

### 4.2 Lọc theo dự án

```
Chọn dự án từ dropdown (bộ lọc chính hoặc bộ lọc bảng)
  → Tất cả section cập nhật (re-fetch API với project_id)
  → Summary cards: chỉ hiển thị HH từ kỳ chốt thuộc dự án đó
  → Bảng NV: chỉ hiển thị NV có đơn hàng thuộc dự án đó
```

### 4.3 Thay đổi khoảng ngày

```
Chọn khoảng ngày mới từ date picker
  → Tất cả section cập nhật (re-fetch API)
  → Period label cập nhật (VD: "01/03/2026 - 31/03/2026")
```

## 5. Trạng thái UI

### 5.1 Loading

- KPI cards: Skeleton placeholder cho mỗi thẻ
- Thẻ thông tin: Skeleton
- Bảng: UTable loading state

### 5.2 Error

- Toàn trang: `UAlert` color `error` với message lỗi

### 5.3 Empty

- Khi không có dữ liệu (chưa có kỳ chốt đóng nào trong khoảng ngày):
  - Thẻ KPI: hiển thị `0 đ`
  - Lợi nhuận gộp: hiển thị `0 đ`
  - Bảng NV: "Không có dữ liệu"

## 6. Phân quyền

| Hành động | Quyền cần có |
|-----------|-------------|
| Xem báo cáo Phân bổ hoa hồng | `commission.view` |

> Menu "Báo cáo → Phân bổ hoa hồng" chỉ hiển thị cho user có quyền `commission.view`.

## 7. Ghi chú nghiệp vụ

- **Read-only:** Trang này không có form tạo/sửa/xóa. Cấu hình hoa hồng quản lý tại module "Cấu hình chia hoa hồng".
- **HH VH ≠ Lợi nhuận VH:** Hoa hồng phân bổ cho Công ty vận hành (từ cấu hình chia HH trên đơn) khác với lợi nhuận gộp (Doanh thu − Chi phí). Alert box và thẻ thông tin bổ sung phải truyền đạt rõ sự khác biệt này.
- **Cột BQL = Thực nhận:** Trong bảng chi tiết NV, cột BQL (management) là số tiền nhân viên thực nhận từ phân bổ Ban quản lý. Các cột VH/BQT/Platform là "quy chiếu" — hiển thị để thấy tổng HH mà đơn hàng của NV đó tạo ra cho các bên, **không phải** tiền NV nhận.
- **Platform rules cố định:** Hoa hồng Platform = 5% cơ sở HH + 1.000đ/đơn. Không cấu hình theo dự án. Luôn hiển thị thông tin này trên thẻ Platform.
- **Dữ liệu từ kỳ chốt:** Chỉ hiển thị dữ liệu từ kỳ chốt đã đóng. Nếu chưa có kỳ chốt nào → hiển thị empty state.
- **Format số:** Dùng hàm format number hiện có (`formatReportNumber` hoặc tương đương). Số tiền hiển thị dạng `24.800.000` (không hiển thị phần thập phân trên UI).
- **Liên kết liên quan:**
  - "Cấu hình chia hoa hồng" → trang cấu hình commission
  - "Tổng hợp hoa hồng" → trang kỳ chốt (closing periods)
  - "Doanh thu & lợi nhuận" → báo cáo doanh thu (khi có)
