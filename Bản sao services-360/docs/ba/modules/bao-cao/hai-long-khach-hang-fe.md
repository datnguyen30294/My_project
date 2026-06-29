# Báo cáo Hài lòng Khách hàng - Đặc tả nghiệp vụ Frontend

> Module: `PMC/Report/Csat` | Ngày tạo: 2026-04-14 | Trạng thái: Draft

## 1. Tổng quan

Màn hình Báo cáo Hài lòng Khách hàng hiển thị chất lượng cảm nhận của cư dân sau khi ticket hoàn thành. Trang là **read-only**, gồm:

- 4 thẻ KPI tổng hợp
- 1 khối xu hướng điểm trung bình theo tháng
- 1 bảng so sánh theo dự án

**Mockup tham khảo:**

- `BA-TNP-SERVICES/app/pages/modules/bao-cao/hai-long-khach-hang.vue`
- `BA-TNP-SERVICES/content/docs/bao-cao/hai-long-khach-hang.md`
- Card "Hài lòng KH" trong `BA-TNP-SERVICES/app/pages/modules/bao-cao/tong-quan.vue`

**Quy ước route triển khai thực tế trong repo hiện tại:**

- Trang: `/reports/csat`
- Menu hiển thị nhãn: `Hài lòng KH` hoặc `CSAT`

> Mockup nguồn dùng route `/modules/bao-cao/hai-long-khach-hang`, nhưng app hiện tại đang chuẩn hóa report pages dưới `/reports/*`.

## 2. Danh sách trang

| Trang | Route | Mô tả |
|-------|-------|-------|
| Báo cáo Hài lòng khách hàng | `/reports/csat` | Dashboard CSAT với KPI, xu hướng theo tháng, và bảng theo dự án |

> Chỉ có 1 trang. Không có form tạo/sửa/xóa.

## 3. Trang báo cáo Hài lòng khách hàng

### 3.1 KPI tổng hợp (4 thẻ)

| Thẻ | Dữ liệu | Format | Ghi chú |
|-----|---------|--------|---------|
| Điểm TB | `avg_score` + `/ max_score` | Ví dụ `4.35 / 5` | Nếu chưa có phản hồi -> hiển thị `— / 5` |
| Tỷ lệ phản hồi | `response_rate` | Ví dụ `68%` hoặc `68.5%` | Mẫu số là số ticket hoàn thành trong kỳ |
| Chỉ số gợi ý (NPS-style) | `nps_style` | Ví dụ `+42`, `-8` | Chỉ số suy diễn từ rating 1-5, không phải NPS chuẩn |
| Kỳ | `period_label` | Text | Ví dụ `90 ngày gần nhất` |

- Layout: `grid` 2 cột trên mobile, 4 cột trên desktop
- Mỗi card chỉ hiển thị 1 chỉ số chính, không có drill-down
- Card `NPS-style` dùng màu nhấn để phân biệt với 2 KPI còn lại

### 3.2 Khối xu hướng điểm trung bình

| Thành phần | Dữ liệu | Mô tả |
|-----------|---------|-------|
| Tiêu đề | Tĩnh | `Xu hướng điểm TB` |
| Danh sách tháng | `trend[].month` | Ví dụ `T10`, `T11`, `T12`, `T1` |
| Thanh ngang theo tháng | `trend[].avg_score` | Độ dài thanh tỷ lệ với `max_score = 5` |
| Giá trị cuối dòng | `trend[].avg_score` | Hiển thị 2 chữ số thập phân hoặc `—` nếu tháng đó chưa có phản hồi |

**Cách hiển thị mỗi dòng trend:**

- Bên trái: nhãn tháng
- Ở giữa: thanh ngang thể hiện mức điểm
- Bên phải: số điểm trung bình

**Quy tắc empty per month:**

- Nếu tháng không có phản hồi:
  - thanh ngang rỗng
  - giá trị hiển thị `—`

> V1 hiển thị giống mockup dạng danh sách thanh ngang, không bắt buộc dùng chart library.

### 3.3 Bảng theo dự án

| Cột | Dữ liệu | Format | Ghi chú |
|-----|---------|--------|---------|
| Dự án | `project_name` | Text | |
| Số phản hồi | `responses` | Số nguyên | Là số ticket đã có rating trong kỳ |
| Điểm TB | `avg_score` | 2 chữ số thập phân | Nếu chưa có phản hồi -> hiển thị `—` |

**Dữ liệu bổ sung có thể có từ API nhưng chưa hiển thị ở V1:**

- `completed_count`
- `response_rate`

> FE chỉ render 3 cột theo đúng mockup hiện tại. Không thêm cột nếu chưa có quyết định UI mới.

### 3.4 Hành động

| Hành động | Điều kiện | Kết quả |
|-----------|-----------|---------|
| Mở trang từ menu Báo cáo | Có quyền xem | Điều hướng tới `/reports/csat` |
| Mở trang từ card "Hài lòng KH" ở trang Tổng quan báo cáo | Có card điều hướng | Điều hướng tới `/reports/csat` |

> Trang không có action chỉnh sửa, export, approve hay thao tác hàng loạt trong phiên bản này.

## 4. Dữ liệu hiển thị và quy tắc format

| Dữ liệu | Quy tắc |
|--------|---------|
| `avg_score` | Hiển thị tối đa 2 chữ số thập phân |
| `response_rate` | Hiển thị `%`; nếu là số nguyên thì không cần `.0` |
| `nps_style` | Luôn hiển thị kèm dấu `+` hoặc `-` |
| `period_label` | Hiển thị nguyên văn từ API |

## 5. Luồng người dùng

### 5.1 Xem báo cáo

```text
Menu Báo cáo hoặc card Tổng quan -> Mở /reports/csat
  -> Trang fetch 3 API: summary, trend, by-project
  -> Hiển thị KPI
  -> Hiển thị xu hướng
  -> Hiển thị bảng theo dự án
```

### 5.2 Trường hợp không có phản hồi

```text
Mở trang trong kỳ không có rating
  -> Điểm TB hiển thị —
  -> Tỷ lệ phản hồi = 0%
  -> NPS-style hiển thị —
  -> Trend hiển thị các dòng tháng nhưng thanh rỗng hoặc trạng thái empty
  -> Bảng theo dự án vẫn có thể hiển thị dự án có completed_count > 0 với responses = 0
```

## 6. Trạng thái UI

### 6.1 Loading

- KPI cards: dùng skeleton cho giá trị chính
- Trend: hiển thị skeleton list hoặc placeholder card
- Table: dùng loading state của bảng

### 6.2 Error

- Nếu `summary` lỗi: hiển thị lỗi mức trang
- Nếu `trend` hoặc `by-project` lỗi riêng: cho phép từng section hiển thị lỗi độc lập, không chặn toàn bộ trang nếu summary đã có

### 6.3 Empty

- Toàn trang chưa có dữ liệu: hiển thị message kiểu `Chưa có phản hồi trong kỳ`
- Empty theo tháng: giữ layout, nhưng điểm tháng hiển thị `—`
- Empty theo dự án: bảng hiển thị message `Không có dữ liệu`

## 7. Phân quyền

| Hành động | Quyền cần có |
|-----------|--------------|
| Xem báo cáo Hài lòng khách hàng | `og-tickets.view` |

> Đồng nhất với SLA report vì cùng xuất phát từ dữ liệu OG Ticket.

## 8. Ghi chú nghiệp vụ

- **Read-only:** Trang chỉ xem số liệu, không thao tác trên ticket hay feedback.
- **Nguồn dữ liệu thật:** Dùng `resident_rating` đã sync về `og_tickets`; không có entity khảo sát riêng trong repo hiện tại.
- **NPS-style là chỉ số suy diễn:** UI cần đặt đúng nhãn `Chỉ số gợi ý (NPS-style)` như mockup, tránh hiểu nhầm là NPS survey chuẩn.
- **Mặc định kỳ báo cáo:** Đề xuất 90 ngày gần nhất theo mockup hiện tại. Đây là khác biệt so với một số report đang mặc định 30 ngày.
- **Không hiển thị comment ở V1:** `resident_rating_comment` chưa đưa vào page này để giữ dashboard gọn.
- **Khả năng mở rộng:** API có thể trả thêm `response_rate` theo dự án hoặc filter theo `project_id`, nhưng V1 FE chưa cần render bộ lọc nếu chưa có quyết định UI.

