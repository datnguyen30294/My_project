# Báo cáo Doanh thu & Lợi nhuận - Đặc tả nghiệp vụ Frontend

> Module: `PMC/Report/RevenueProfit` | Ngày tạo: 2026-04-14 | Trạng thái: Draft (v2 — đồng bộ công thức với Commission Report)

## 1. Tổng quan

Màn hình báo cáo Doanh thu & Lợi nhuận hiển thị doanh thu, chi phí ước (HH ngoài VH + vật tư), lợi nhuận gộp và margin ở góc nhìn **công ty vận hành**. Trang **read-only**, dùng để BGĐ theo dõi xu hướng theo kỳ, cơ cấu theo loại dịch vụ và mức đóng góp theo dự án.

**Mockup tham khảo:**
- `BA-TNP-SERVICES/app/pages/modules/bao-cao/doanh-thu-loi-nhuan.vue`
- `BA-TNP-SERVICES/content/docs/bao-cao/doanh-thu-loi-nhuan.md`

**Nguyên tắc hiển thị:**
- `LN gộp` dùng công thức **đồng bộ với báo cáo Phân bổ hoa hồng**: `Doanh thu − HH trả BQT/BQL/Platform − Chi phí vật tư`. Không trừ phần HH của công ty VH.
- Số liệu khớp với báo cáo Phân bổ hoa hồng — `gross_profit` ở trang này = `estimated_gross_profit` ở trang Phân bổ hoa hồng khi cùng filter.
- Chỉ hiển thị dữ liệu từ **kỳ chốt đã đóng** (trừ khi chọn kỳ cụ thể để preview).
- Hệ thống hiện KHÔNG có khuyến mãi/KM → không tách doanh thu trước/sau KM.

## 2. Danh sách trang

| Trang | Route | Mô tả |
|-------|-------|-------|
| Doanh thu & lợi nhuận | `/reports/revenue-profit` | Dashboard doanh thu/chi phí/LN gộp, xu hướng, cơ cấu dịch vụ/dự án |

> Chỉ có 1 trang, không có form tạo/sửa.

## 3. Trang báo cáo Doanh thu & Lợi nhuận

### 3.1 Bộ lọc

| Bộ lọc | Loại | Mô tả |
|--------|------|-------|
| Kỳ chốt | Dropdown đơn chọn | Không bắt buộc. Khi chọn, bỏ qua date range + project. Cho phép kỳ `open` để preview |
| Khoảng thời gian | Date range picker | Dùng khi không chọn kỳ. Mặc định **30 ngày gần nhất** |
| Dự án | Dropdown đơn chọn | "Tất cả dự án" (mặc định) + danh sách từ API |

- Khi đã chọn `kỳ chốt`, disable date range và project filter.
- Mọi section cập nhật theo filter.
- Hiển thị `period_label` dưới filter (VD: "Kỳ: Tháng 3/2026" hoặc "01/03/2026 - 31/03/2026").

### 3.2 Thẻ KPI chính (3 thẻ — layout chính)

Layout: grid 1 cột (mobile) → 3 cột (desktop).

| Thẻ | Dữ liệu chính | Dữ liệu phụ | Ghi chú |
|-----|---------------|-------------|---------|
| Doanh thu | `revenue` | — | Format tiền VND |
| LN gộp (ước) | `gross_profit` | "CP ước: {estimated_cost}" | Xanh khi >= 0, đỏ khi < 0 |
| Margin gộp | `margin_percent` | "TB 6 tháng: ~{avg_margin_6_months}%" | Format `xx.x%` |

### 3.3 Thẻ so sánh kỳ (3 thẻ — layout phụ)

Layout: grid 1 cột (mobile) → 3 cột (desktop).

| Thẻ | Dữ liệu | Format |
|-----|---------|--------|
| MoM — Doanh thu | `mom_revenue_percent` | `+/-x.x%`, xanh nếu >= 0, đỏ nếu < 0. Phụ đề: "{last_month_label} vs {prev_month_label}" |
| MoM — LN gộp | `mom_profit_percent` | Tương tự |
| QoQ — DT / LN | `qoq_revenue_percent` + `qoq_profit_percent` | Cùng 1 thẻ: "DT {sign}{qoq_revenue}% · LN {sign}{qoq_profit}%" |

### 3.4 Biểu đồ xu hướng 6 tháng (cột + đường)

**Loại biểu đồ:** Column + line chart (SVG tự vẽ, giống mockup BA)

| Thành phần | Dữ liệu |
|------------|---------|
| Cột | `monthly[].revenue` |
| Đường | `monthly[].margin_percent` |
| Trục X | `monthly[].month` (VD: "T10", "T11") |
| Trục Y trái | Doanh thu (tỷ đồng) |
| Trục Y phải | Margin % |

- Tooltip mỗi cột/điểm: `month`, `revenue`, `estimated_cost`, `gross_profit`, `margin_percent`.
- Legend: "Doanh thu" (màu primary), "Margin %" (màu warning).
- Nếu `monthly` rỗng → empty state trong card.

### 3.5 Luồng tạo LN gộp (P&L Bridge)

Card "Luồng tạo LN gộp (ước — cùng kỳ báo cáo)" — dạng 3 khối ngang:

```
[ Doanh thu ]  →  [ − CP ước ]  →  [ LN gộp ]
  revenue         estimated_       gross_
                  cost             profit
```

- Khối `− CP ước` là khối chuyển tiếp (màu đỏ nhạt). Hiển thị breakdown `external_commission` + `material_cost` ngay trên khối.
- Khối `Doanh thu` (primary) và `LN gộp` (success) là khối kết quả.
- Chú thích dưới: "Đơn vị: đồng. Mục đích: cho BGĐ thấy nhanh DT → chi phí → LN gộp. LN gộp KHÔNG trừ phần HH công ty VH (VH giữ lại)."

### 3.6 Cơ cấu LN gộp theo loại dịch vụ

**Dạng hiển thị:** Donut chart + legend

**Nguồn dữ liệu:** `by-service-category`

| Thành phần | Dữ liệu |
|------------|---------|
| Slice label | `category_label` |
| Giá trị | `profit` |
| Tỷ trọng | `share_percent` |

- Sắp xếp legend theo `profit DESC`.
- Slice "Điều chỉnh nội bộ / tập trung" có thể âm → hiển thị màu xám, **không vẽ trong donut ring**, chỉ list trong legend với dấu âm.
- Chú thích card: "Hai biểu đồ (dịch vụ + dự án) cùng tổng = LN gộp kỳ. Dòng 'Điều chỉnh nội bộ' là phần HH chưa phân bổ được xuống line."
- Nếu rỗng → empty state.

### 3.7 Cơ cấu LN gộp theo dự án

**Dạng hiển thị:** 2 phần song song

**Phần 1 — Donut chart theo dự án:** tương tự 3.6 nhưng slices theo `by-project[].project_name` + `profit`.

**Phần 2 — Bảng chi tiết dự án & cảnh báo margin:**

| Cột | Dữ liệu | Format |
|-----|---------|--------|
| Dự án | `project_name` | Text |
| % đóng góp DT | `share_of_revenue_percent` | `%`, 1 chữ số thập phân |
| Doanh thu | `revenue` | Format tiền VND |
| Chi phí ước | `estimated_cost` | Format tiền VND |
| LN gộp | `gross_profit` | Format tiền VND |
| Margin % | `margin_percent` | `%`, 1 chữ số thập phân |
| Cảnh báo | `margin_alert` | Badge: `Ổn định` (success) hoặc `Dưới ngưỡng` (warning) |

- Badge `Dưới ngưỡng` khi `margin_alert = true`.
- Ngưỡng cảnh báo lấy từ `summary.margin_alert_threshold` (hardcode 31%).
- Sắp xếp: `revenue DESC`.
- Sub-header card: "% đóng góp DT tính trên tổng tất cả dự án. Cảnh báo khi margin < {threshold}%."

### 3.8 Alert nhận định nhanh

Hiển thị `UAlert` color `neutral`, variant `subtle`, icon `i-lucide-lightbulb` phía trên hoặc dưới bảng dự án.

**Nguồn dữ liệu:** `summary.insights[]`

- Tối đa 3 bullet dạng danh sách.
- Mỗi bullet không cần thao tác người dùng.
- Hidden nếu `insights` rỗng.

### 3.9 Hành động

| Hành động | Kết quả |
|-----------|---------|
| Chọn kỳ chốt | Disable date range + project; cập nhật toàn trang theo snapshot kỳ |
| Chọn khoảng thời gian | Cập nhật toàn trang theo date range |
| Chọn dự án | Cập nhật toàn trang theo project |
| Xóa bộ lọc | Reset về mặc định (30 ngày gần nhất, tất cả dự án) |

## 4. Luồng người dùng

### 4.1 Xem báo cáo mặc định

```
Menu Báo cáo → Doanh thu & lợi nhuận → Trang load
  → Filter mặc định: 30 ngày gần nhất
  → 3 thẻ KPI chính (DT, LN, Margin) hiển thị
  → 3 thẻ so sánh kỳ (MoM, MoM, QoQ) hiển thị
  → Chart xu hướng 6 tháng hiển thị
  → Khối P&L bridge hiển thị
  → Donut theo dịch vụ + donut theo dự án
  → Bảng dự án + cảnh báo margin
  → Alert nhận định nhanh
```

### 4.2 Xem theo kỳ chốt

```
Chọn 1 kỳ chốt
  → Date range + project filter bị disable
  → Tất cả section cập nhật theo snapshot kỳ
  → period_label đổi thành "Kỳ: ..."
  → Cho phép xem kỳ `open` để preview
```

### 4.3 Lọc theo dự án

```
Chọn dự án
  → Toàn bộ KPI và breakdown cập nhật theo project
  → Chart xu hướng chỉ hiển thị data project đó
  → Bảng dự án còn 1 dòng (project đã lọc)
```

## 5. Trạng thái UI

### 5.1 Loading

- KPI cards: Skeleton placeholder
- Chart / donut: block loading state trong card
- Bảng dự án: `UTable` loading state
- P&L bridge: skeleton thay các số

### 5.2 Error

- Toàn trang: `UAlert` color `error` với message từ API
- Từng section nhỏ: giữ card skeleton + toast notification

### 5.3 Empty

- Khi không có kỳ chốt đóng nào trong filter:
  - KPI: `0 đ`, `0%`
  - Chart: "Chưa có dữ liệu trong kỳ đã chọn"
  - Donut: "Chưa có dữ liệu"
  - Bảng: "Không có dự án trong kỳ"
  - Insights hidden

## 6. Phân quyền

| Hành động | Quyền cần có |
|-----------|--------------|
| Xem báo cáo Doanh thu & Lợi nhuận | `commission.view` |

> Menu "Báo cáo → Doanh thu & lợi nhuận" chỉ hiển thị cho user có quyền `commission.view` (đồng bộ với Phân bổ hoa hồng — cả 2 báo cáo cùng kỳ chốt, cùng công thức LN).

## 7. Ghi chú nghiệp vụ

### 7.1 Định nghĩa "Chi phí ước"

- **KHÔNG PHẢI** toàn bộ chi phí vận hành — chỉ gồm 2 thành phần:
  - **Hoa hồng trả ra ngoài VH**: BQT + BQL + Platform (không tính phần HH VH giữ lại).
  - **Chi phí vật tư**: giá nhập × số lượng trên các line `material`.
- Chưa bao gồm: lương nhân viên, chi phí chung, khấu hao, thuế → KHÔNG thay thế P&L kế toán.

### 7.2 Snapshot semantic

- `revenue` = `frozen_receivable_amount` tại thời điểm đơn vào kỳ → đã đóng băng.
- `material_cost` = đọc live từ `order_lines.purchase_price × quantity`, nhưng đơn đã lock tài chính sau khi vào kỳ → live value = snapshot de facto.
- `external_commission` = từ `order_commission_snapshots`, đóng băng khi kỳ đóng.

### 7.3 Đồng bộ với báo cáo Phân bổ hoa hồng

- `gross_profit` ở trang này **phải khớp** với `estimated_gross_profit` ở trang Phân bổ hoa hồng khi cùng filter.
- Nếu user thấy lệch số → báo lỗi với team BE.
- FE có thể hiển thị link sang trang Phân bổ hoa hồng từ thẻ "LN gộp" để cross-reference.

### 7.4 Cơ cấu theo dịch vụ — slice điều chỉnh âm

- Slice "Điều chỉnh nội bộ / tập trung" thường âm (vì commission không phân bổ xuống line).
- Hiển thị như một row trong legend với dấu âm, màu xám, **không vẽ lát trong ring donut** (để donut vẫn đẹp).
- Text chú thích: "Điều chỉnh = LN gộp kỳ − tổng contribution mức line. Thường âm do commission phân bổ tập trung."

### 7.5 Margin alert threshold

- Hardcode 31% (BE trả về trong `summary.margin_alert_threshold`).
- FE dùng để:
  - Hiển thị badge "Dưới ngưỡng" trong bảng dự án.
  - Hiển thị text ở sub-header bảng ("Cảnh báo khi margin < 31%").
  - Insight bullet 2.

### 7.6 Read-only

- Mọi cập nhật giá bán, giá nhập, công nợ, HH đều ở module nghiệp vụ nguồn (Quote, Order, Receivable, ClosingPeriod). Trang này chỉ đọc.

### 7.7 Liên kết liên quan

- Link trên thẻ "LN gộp" → sang `/reports/commission` để xem breakdown HH.
- Link trên bảng dự án → sang trang Project detail (nếu có).
- Link ở thẻ "CP ước" → sang trang Commission để xem chi tiết HH theo nhân viên.
