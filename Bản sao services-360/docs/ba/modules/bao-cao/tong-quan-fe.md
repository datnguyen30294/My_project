# Báo cáo Tổng quan - Đặc tả nghiệp vụ Frontend

> Module: `PMC/Report/Overview` | Ngày tạo: 2026-04-14 | Trạng thái: Draft

## 1. Tổng quan

Trang **Tổng quan** (`/reports/overview`) là **dashboard quản trị** tổng hợp **4 KPI trụ cột** (SLA, Doanh thu & LN, Hài lòng KH, Phân bổ hoa hồng) cho BGĐ/Điều hành xem nhanh tình hình vận hành và tài chính trong kỳ hiện tại. Trang **read-only**, mỗi thẻ KPI có link điều hướng sang báo cáo chi tiết tương ứng.

**Mockup tham khảo:**
- `BA-TNP-SERVICES/app/pages/modules/bao-cao/tong-quan.vue`
- `BA-TNP-SERVICES/content/docs/bao-cao/tong-quan.md`

**Thay đổi nghiệp vụ so với mockup gốc:**

- **Bỏ thẻ KPI "Công nợ"** (hệ thống không triển khai báo cáo công nợ).
- **Thêm thẻ KPI "Phân bổ hoa hồng"** (promote từ section phụ lên 4 KPI chính).
- **Section "Báo cáo bổ sung":** còn lại 2 mục (Doanh thu ticket, Dòng tiền) — bỏ "Phân bổ hoa hồng" khỏi danh sách phụ vì đã lên KPI chính.
- **Section "Liên kết nghiệp vụ":** bỏ link "Công nợ phải thu".

**Nguyên tắc hiển thị:**
- Số liệu **minh họa cấp quản trị** — không thay thế sổ kế toán hay chi tiết từng đơn.
- `period_label` dùng chung cho toàn bộ trang (đồng bộ filter giữa 4 khối).
- Nếu 1 khối KPI `null` (sub-service lỗi) → hiển thị trạng thái "Không có dữ liệu" trên thẻ đó, các thẻ khác vẫn render bình thường.

## 2. Danh sách trang

| Trang | Route | Mô tả |
|-------|-------|-------|
| Tổng quan báo cáo | `/reports/overview` | Dashboard 4 KPI + link báo cáo bổ sung + tham chiếu nghiệp vụ |

> Chỉ có 1 trang, không có form tạo/sửa.

## 3. Trang Tổng quan

### 3.1 Bộ lọc

| Bộ lọc | Loại | Mô tả |
|--------|------|-------|
| Kỳ chốt | Dropdown đơn chọn | Không bắt buộc. Khi chọn, disable date range + project. Cho phép kỳ `open` để preview |
| Khoảng thời gian | Date range picker | Dùng khi không chọn kỳ. Mặc định **30 ngày gần nhất** |
| Dự án | Dropdown đơn chọn | "Tất cả dự án" (mặc định) + danh sách dự án từ API |

- Khi đã chọn `kỳ chốt`, disable date range + project filter.
- Mọi khối KPI cập nhật theo filter (cùng API `GET /reports/overview/summary`).
- Hiển thị `period_label` ngay dưới filter (VD: "Kỳ: Tháng 3/2026" / "01/03/2026 - 31/03/2026" / "30 ngày gần nhất").

### 3.2 Banner thông báo

`UAlert` `color="neutral"` `variant="subtle"`:
- Title: "Dữ liệu minh họa quản trị"
- Description: "Các số liệu trên trang này là tổng hợp cấp quản trị, dùng cho BGĐ theo dõi nhanh — không thay thế sổ kế toán hay báo cáo chi tiết từng đơn."
- Icon: `i-lucide-info`

### 3.3 4 thẻ KPI chính

Layout: grid 1 cột (mobile) → 2 cột (sm) → 4 cột (xl).

Mỗi thẻ là `NuxtLink` bọc `UCard` — click toàn card điều hướng sang báo cáo chi tiết. Hover: ring `primary`.

| # | Thẻ | Icon | KPI chính | Phụ đề | Link |
|---|-----|------|-----------|--------|------|
| 1 | SLA | `i-lucide-gauge` | `{sla.on_time_rate}%` | `{sla.breached_count} ticket vi phạm · {period_label}` | `/reports/sla` |
| 2 | Doanh thu & LN | `i-lucide-trending-up` | `{revenue.revenue}` (format tiền VND) | `Margin gộp ~{revenue.margin_percent}% · {period_label}` | `/reports/revenue-profit` |
| 3 | Hài lòng KH | `i-lucide-smile-plus` | `{csat.avg_score} / {csat.max_score}` | `{csat.response_rate}% phản hồi · {period_label}` | `/reports/csat` |
| 4 | Phân bổ hoa hồng | `i-lucide-coins` | `{commission.total_all_parties}` (format tiền VND) | `Platform {commission.party_totals.platform} · {period_label}` | `/reports/commission` |

Mỗi thẻ layout nội bộ:
```
[icon 8x8 primary]  Tiêu đề (font-semibold)              [→ arrow icon]
                    Blurb ngắn 1 dòng (text-muted text-sm)
                    KPI chính (text-lg font-bold tabular-nums)
                    Phụ đề (text-xs text-muted)
```

**Blurb cho mỗi thẻ (cố định):**
- SLA: "Đúng hạn xử lý ticket, xu hướng theo tháng."
- Doanh thu & LN: "Doanh thu và LN gộp ước tính."
- Hài lòng KH: "Điểm khảo sát và tỷ lệ phản hồi."
- Phân bổ hoa hồng: "Tổng hoa hồng 4 bên trong kỳ."

**Trạng thái null cho 1 thẻ** (VD: `csat = null`):
- KPI chính: "—"
- Phụ đề: "Chưa có dữ liệu · {period_label}"
- Vẫn cho click link.

### 3.4 Section "Báo cáo bổ sung (lọc dự án / ngày)"

`UCard` với header "Báo cáo bổ sung (lọc dự án / ngày)". Body là danh sách 2 mục (sau khi bỏ Phân bổ hoa hồng vì đã lên KPI chính):

| Tiêu đề | Link | Mô tả |
|---------|------|-------|
| Doanh thu (ticket) | `/reports/revenue-ticket` | Category ticket, hệ thống & theo cá nhân |
| Dòng tiền | `/reports/cash-flow` | Tiền vào / ra |

Style:
- `<NuxtLink>` tiêu đề: `text-primary font-medium`.
- Mô tả: `text-muted`.

### 3.5 Section "Liên kết nghiệp vụ (tham chiếu)"

`UCard` với header "Liên kết nghiệp vụ (tham chiếu)". Body `<ul class="list-disc">` với 2 mục (sau khi bỏ Công nợ phải thu):

| Mô tả | Link | URL |
|-------|------|-----|
| Chi tiết vi phạm SLA theo ticket | SLA / Vi phạm | `/tickets/sla-violations` |
| Tổng hợp hoa hồng (kế toán) | Tổng hợp hoa hồng | `/finance/commission-summary` |

> Nếu các route thực trên production khác với mockup, dùng route thực của hệ thống (sẽ xác nhận khi triển khai).

### 3.6 Hành động

Chỉ có hành động điều hướng (click thẻ / link). Không có nút CRUD.

| Hành động | Điều kiện | Kết quả |
|-----------|-----------|---------|
| Click thẻ KPI | Luôn hiển thị | Điều hướng sang trang báo cáo chi tiết tương ứng |
| Click link "Báo cáo bổ sung" | Luôn hiển thị | Điều hướng sang báo cáo con |
| Click link "Liên kết nghiệp vụ" | Luôn hiển thị | Điều hướng sang màn nghiệp vụ liên quan |

## 4. Luồng người dùng

### 4.1 Xem Tổng quan mặc định

```
Sidebar → "Báo cáo" → "Tổng quan"
  ✓ Hiển thị 4 thẻ KPI với data 30 ngày gần nhất
  ✓ period_label: "30 ngày gần nhất"
```

### 4.2 Lọc theo kỳ chốt

```
Trang Tổng quan → Chọn "Kỳ chốt" từ dropdown
  ✓ Date range + Project bị disable
  ✓ 4 thẻ KPI cập nhật
  ✓ period_label: "Kỳ: {tên kỳ}"
```

### 4.3 Lọc theo khoảng ngày + dự án

```
Trang Tổng quan → Chọn date range + project
  ✓ 4 thẻ KPI cập nhật
  ✓ period_label: "{date_from} - {date_to}"
```

### 4.4 Đi sâu báo cáo chi tiết

```
Trang Tổng quan → Click thẻ KPI (VD: "Phân bổ hoa hồng")
  ✓ Điều hướng sang /reports/commission
  ✓ Filter không được truyền qua URL (trang đích giữ filter mặc định riêng)
```

### 4.5 Trạng thái empty / lỗi

```
Trang Tổng quan → 1 sub-service trả null (VD: CSAT)
  ✓ Thẻ CSAT hiển thị "—" + phụ đề "Chưa có dữ liệu"
  ✓ 3 thẻ còn lại vẫn render bình thường
```

## 5. Phân quyền

| Hành động | Quyền cần có |
|-----------|-------------|
| Xem trang Tổng quan | `reports.overview.view` |

> Nếu user không có quyền → sidebar ẩn menu "Tổng quan", direct URL trả 403.

## 6. Ghi chú nghiệp vụ

- 4 KPI đều lấy cùng 1 khoảng thời gian (filter đồng bộ) để so sánh có ý nghĩa.
- Default 30 ngày gần nhất thống nhất với toàn bộ Report module.
- Thẻ "Phân bổ hoa hồng" hiển thị **tổng 4 bên** để KPI có giá trị so sánh nhanh; phụ đề hiển thị riêng phần **Platform** vì đây là khoản cố định đáng chú ý.
- Click thẻ điều hướng trang chi tiết — **không pass filter qua URL** (trang chi tiết tự giữ state). Nếu sau này cần sync filter giữa các trang, xử lý ở v2 bằng query string.
- Trang không tự refresh — user phải đổi filter để refetch. Nếu cần auto-refresh (VD: dashboard TV), thêm nút "Làm mới" ở header (v2).
