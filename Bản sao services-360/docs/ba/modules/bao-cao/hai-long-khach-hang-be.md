# Báo cáo Hài lòng Khách hàng - Đặc tả kỹ thuật Backend

> Module: `PMC/Report/Csat` | Ngày tạo: 2026-04-14 | Trạng thái: Draft

## 1. Tổng quan

Báo cáo Hài lòng Khách hàng (CSAT) là tính năng **read-only**, tổng hợp mức độ hài lòng cư dân sau khi ticket hoàn thành. Feature này **không tạo bảng/model mới**; chỉ bổ sung lớp Report trong tenant module PMC để aggregate dữ liệu và trả về cho frontend.

`Report` là **submodule của PMC** (tenant), cùng cấp với `Sla`, `CashFlow`. Để đồng nhất naming với codebase hiện tại:

- FE route triển khai thực tế: `/reports/csat`
- API route triển khai thực tế: `/api/v1/pmc/reports/csat/*`
- File BA vẫn giữ tên theo mockup nguồn: `hai-long-khach-hang`

**Data source:**

| Bảng | Mục đích |
|------|----------|
| `og_tickets` | Nguồn chính của rating trong tenant: `resident_rating`, `resident_rating_comment`, `resident_rated_at`, `project_id`, `status` |
| `og_ticket_lifecycle_segments` | Xác định thời điểm ticket hoàn thành để tạo cohort báo cáo theo kỳ/tháng |
| `projects` | Tên dự án phục vụ tổng hợp theo dự án |

**Ghi chú quan trọng về nguồn dữ liệu:**

- Rating được cư dân gửi từ Platform qua public endpoint `/api/v1/tickets/{code}/rating`.
- Sau khi gửi thành công, dữ liệu được **đồng bộ sang tenant `og_tickets`** qua `OgTicketExternalService::syncRating()`.
- Report CSAT **chỉ đọc `og_tickets` trong tenant**, không query ngược Platform khi render báo cáo.

**Khác biệt giữa mockup và hệ thống hiện tại:**

- Mockup yêu cầu `NPS-style`, nhưng hệ thống hiện chỉ có **1 câu hỏi rating 1-5 sao**, chưa có câu hỏi "sẵn sàng giới thiệu".
- Vì vậy `nps_style` trong báo cáo này là **chỉ số suy diễn** từ `resident_rating`, không phải NPS chuẩn.

## 2. Entities

**Không tạo entity/table mới cho báo cáo.** Feature này đọc từ các bảng đã có.

### 2.1 Ticket feedback trong tenant

**Bảng:** `og_tickets`

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID ticket tenant | `id` | `bigIncrements` | PK | Bản ghi ticket phía tenant |
| ID ticket platform | `ticket_id` | `unsignedBigInteger` | nullable | Tham chiếu ticket gốc từ Platform |
| Dự án | `project_id` | `unsignedBigInteger` | nullable | Join cùng module tới `projects.id` |
| Trạng thái | `status` | `string(50)` | required | Chỉ ticket `completed` được tính vào cohort CSAT |
| Điểm hài lòng | `resident_rating` | `smallInteger` | nullable, 1..5 | Điểm cư dân gửi sau khi ticket hoàn thành |
| Nhận xét | `resident_rating_comment` | `text` | nullable | Nội dung nhận xét, tối đa 1000 ký tự từ public API |
| Thời điểm đánh giá | `resident_rated_at` | `timestamp` | nullable | Thời điểm cư dân gửi rating |
| Cập nhật cuối | `updated_at` | `timestamp` | required | Fallback khi thiếu lifecycle segment hoàn thành |
| Ngày xóa | `deleted_at` | `timestamp` | nullable | SoftDeletes |

**Indexes / Relationships:**

- `og_tickets.project_id` -> `projects.id` (cùng tenant module PMC)
- `og_ticket_lifecycle_segments.og_ticket_id` -> `og_tickets.id`
- Chỉ đọc bản ghi chưa bị soft delete

### 2.2 Thời điểm hoàn thành ticket (derived field)

Report không lưu cột mới. Khi aggregate, cần sinh `completed_at` theo quy tắc:

1. Ưu tiên `MIN(started_at)` của `og_ticket_lifecycle_segments` có `status = completed`
2. Nếu ticket cũ thiếu lifecycle segment, fallback `og_tickets.updated_at`

`completed_at` được dùng để:

- xác định ticket có thuộc kỳ báo cáo hay không
- nhóm trend theo tháng
- làm mẫu số cho `response_rate`

## 3. Enums

### 3.1 CsatFeedbackBucket

> Enum nội bộ phục vụ tính `nps_style`, không bắt buộc expose trực tiếp qua API.

| Key | Value | Label (VI) | Mô tả |
|-----|-------|------------|-------|
| Promoter | `promoter` | Khuyến nghị | Rating = `5` |
| Passive | `passive` | Trung lập | Rating = `4` |
| Detractor | `detractor` | Chưa hài lòng | Rating = `1`, `2`, `3` |

## 4. API Endpoints

| Action | Method | URL | Request Class | Mô tả |
|--------|--------|-----|---------------|-------|
| Summary KPI | GET | `/api/v1/pmc/reports/csat/summary` | `CsatReportRequest` | 4 KPI tổng hợp của báo cáo CSAT |
| Xu hướng theo tháng | GET | `/api/v1/pmc/reports/csat/trend` | `CsatReportRequest` | Điểm trung bình theo tháng |
| Theo dự án | GET | `/api/v1/pmc/reports/csat/by-project` | `CsatReportRequest` | Bảng so sánh phản hồi và điểm trung bình theo dự án |

> V1 chỉ cần 3 endpoint như mockup hiện tại. Chưa mở endpoint chi tiết comment hoặc theo nhân viên.

## 5. Validation Rules

### CsatReportRequest

| Field | Rules | Message (VI) |
|-------|-------|--------------|
| `project_id` | `nullable`, `integer`, `exists:projects,id` | Dự án không tồn tại |
| `date_from` | `nullable`, `date_format:Y-m-d` | Ngày bắt đầu không đúng định dạng |
| `date_to` | `nullable`, `date_format:Y-m-d`, `after_or_equal:date_from` | Ngày kết thúc phải >= ngày bắt đầu |
| `months` | `nullable`, `integer`, `min:1`, `max:12` | Số tháng xu hướng phải từ 1 đến 12 |

**Quy ước dùng param:**

- `summary`, `by-project`: dùng `date_from`, `date_to`, `project_id`
- `trend`: ưu tiên `date_from`, `date_to` nếu có; nếu không có thì dùng `months` (default: `6`)

**Default đề xuất:**

- Nếu không truyền `date_from`/`date_to`: lấy **90 ngày gần nhất**
- `months` mặc định cho trend: `6`

> Khác với SLA/CashFlow đang dùng mặc định 30 ngày, CSAT nên dùng 90 ngày để số phản hồi đủ ổn định. Cần giữ BE/FE đồng bộ nếu team muốn đổi preset này.

## 6. Business Rules

### 6.1 Scope dữ liệu

- Chỉ lấy ticket tenant `og_tickets` có `status = completed`
- Loại bỏ record đã soft delete
- Nếu truyền `project_id`, chỉ lấy ticket của dự án đó
- Không tạo cohort theo `resident_rated_at`; cohort được neo theo **thời điểm ticket hoàn thành (`completed_at`)**

### 6.2 Vì sao cohort neo theo `completed_at`

Report này đo chất lượng cảm nhận của **dịch vụ đã hoàn tất**, nên mẫu số `response_rate` phải là:

```text
số ticket hoàn thành trong kỳ
```

không phải:

```text
số rating phát sinh trong kỳ
```

Cách neo này giúp:

- `response_rate` có mẫu số rõ ràng
- `avg_score` và `response_rate` cùng nói về một cohort ticket
- so sánh theo tháng/dự án ổn định hơn cho bài toán vận hành

### 6.3 Công thức Summary KPI

**Số ticket hoàn thành (`completed_count`):**

```text
COUNT(ticket completed_at nằm trong kỳ)
```

**Số phản hồi (`rated_count`):**

```text
COUNT(ticket trong cohort có resident_rating IS NOT NULL)
```

**Điểm trung bình (`avg_score`):**

```text
AVG(resident_rating) của các ticket đã phản hồi
```

- Thang điểm cố định: `max_score = 5`
- Làm tròn 2 chữ số thập phân ở presenter/resource
- Nếu `rated_count = 0` -> trả `avg_score = null`

**Tỷ lệ phản hồi (`response_rate`, %):**

```text
response_rate = rated_count / completed_count × 100
```

- Nếu `completed_count = 0` -> trả `response_rate = 0`
- Làm tròn tối đa 1 chữ số thập phân

**Chỉ số gợi ý (`nps_style`):**

```text
promoter_rate = COUNT(rating = 5) / rated_count × 100
detractor_rate = COUNT(rating IN (1,2,3)) / rated_count × 100
nps_style = promoter_rate - detractor_rate
```

- `rating = 4` được xem là `passive`
- Giá trị nằm trong khoảng `-100` đến `100`
- Nếu `rated_count = 0` -> trả `nps_style = null`

> Đây là **pseudo NPS** từ 1 câu hỏi rating 1-5, không phải NPS survey chuẩn.

### 6.4 Trend theo tháng

Nhóm dữ liệu theo tháng của `completed_at`.

Mỗi điểm dữ liệu gồm:

| Output field | Tính từ |
|--------------|---------|
| `month` | Label tháng, ví dụ `T10`, `T11`, `T12`, `T1` |
| `avg_score` | `AVG(resident_rating)` của cohort tháng đó |
| `responses` | `COUNT(resident_rating IS NOT NULL)` |
| `response_rate` | `responses / completed_count_month × 100` |

**Quy tắc trả dữ liệu trend:**

- Default: 6 tháng gần nhất
- Nếu tháng không có ticket hoàn thành:
  - `avg_score = null`
  - `responses = 0`
  - `response_rate = 0`
- Nên trả đủ bucket tháng trong khoảng yêu cầu để FE render ổn định

### 6.5 Tổng hợp theo dự án (by-project)

Nhóm theo `project_id`.

Mỗi dòng:

| Output field | Tính từ |
|--------------|---------|
| `project_id` | `og_tickets.project_id` |
| `project_name` | `projects.name` |
| `completed_count` | `COUNT(ticket completed trong kỳ thuộc dự án)` |
| `responses` | `COUNT(ticket có resident_rating)` |
| `response_rate` | `responses / completed_count × 100` |
| `avg_score` | `AVG(resident_rating)` |

**Quy tắc hiển thị dữ liệu theo dự án:**

- Dự án có `completed_count > 0` vẫn phải xuất hiện, kể cả `responses = 0`
- Nếu `responses = 0` -> `avg_score = null`
- Sắp xếp mặc định: `responses DESC`, sau đó `avg_score DESC`, sau đó `project_name ASC`

### 6.6 Dữ liệu comment

`resident_rating_comment` **không nằm trong scope v1** của mockup báo cáo này.

- Không trả comment trong `summary`
- Không trả comment trong `trend`
- Không trả comment trong `by-project`

Nếu sau này cần phân tích sentiment/comment, tách endpoint/report riêng để tránh làm page CSAT quá nặng.

### 6.7 Permission

- Dùng middleware `permission:og-tickets.view`
- Không phát sinh permission submodule mới ở giai đoạn này

Lý do:

- Dữ liệu phát sinh trực tiếp từ luồng OG Ticket
- Repo hiện chưa có permission riêng cho nhóm `reports`
- Cách này đồng nhất với `SLA Report`

### 6.8 Period label

API `summary` trả `period_label` để FE hiển thị ở card KPI thứ 4.

Ví dụ:

- `"90 ngày gần nhất"`
- `"01/01/2026 - 31/03/2026"`

## 7. Presenter Output

### 7.1 Summary Response

```json
{
  "success": true,
  "data": {
    "period_label": "90 ngày gần nhất",
    "avg_score": 4.35,
    "max_score": 5,
    "completed_count": 560,
    "rated_count": 381,
    "response_rate": 68.0,
    "nps_style": 42
  }
}
```

### 7.2 Trend Response

```json
{
  "success": true,
  "data": [
    { "month": "T10", "avg_score": 4.22, "responses": 61, "response_rate": 63.5 },
    { "month": "T11", "avg_score": 4.28, "responses": 58, "response_rate": 66.7 },
    { "month": "T12", "avg_score": 4.31, "responses": 64, "response_rate": 69.6 },
    { "month": "T1", "avg_score": 4.33, "responses": 72, "response_rate": 71.3 },
    { "month": "T2", "avg_score": 4.36, "responses": 63, "response_rate": 67.7 },
    { "month": "T3", "avg_score": 4.35, "responses": 63, "response_rate": 69.2 }
  ]
}
```

### 7.3 By-Project Response

```json
{
  "success": true,
  "data": [
    {
      "project_id": 1,
      "project_name": "Vinhomes Ocean Park",
      "completed_count": 262,
      "responses": 186,
      "response_rate": 71.0,
      "avg_score": 4.42
    },
    {
      "project_id": 2,
      "project_name": "Masteri Thảo Điền",
      "completed_count": 176,
      "responses": 124,
      "response_rate": 70.5,
      "avg_score": 4.31
    }
  ]
}
```

> Không dùng enum presenter `{ value, label }` trong report này vì response chủ yếu là số và text thuần.

## 8. Cross-Module Dependencies (ExternalService)

Không có dependency cross-module ở runtime.

| Dependency | Module nguồn | Interface | Method |
|-----------|-------------|-----------|--------|
| — | — | — | — |

> Rating đã được sync sẵn về `og_tickets`, nên Report/Csat không cần gọi `ExternalService` sang Platform.

## 9. Migration Preview

Feature báo cáo **không tạo migration mới**. Chỉ phụ thuộc các field rating đã được thêm trước đó:

```php
Schema::table('og_tickets', function (Blueprint $table) {
    $table->smallInteger('resident_rating')->nullable();
    $table->text('resident_rating_comment')->nullable();
    $table->timestamp('resident_rated_at')->nullable();
});
```

> Migration tham chiếu hiện có: `backend/database/migrations/tenant/2026_03_31_170118_add_rating_fields_to_og_tickets_table.php`

## 10. Checklist triển khai BE

- [ ] Tạo `PMC/src/Report/Csat/` theo cấu trúc cùng cấp với `Sla` và `CashFlow`
- [ ] `CsatReportRequest` cho filter kỳ báo cáo / dự án / số tháng trend
- [ ] Repository aggregate từ `og_tickets` + `og_ticket_lifecycle_segments` + `projects`
- [ ] Service chuẩn hóa công thức `avg_score`, `response_rate`, `nps_style`
- [ ] Controller + Resource cho 3 endpoint `summary`, `trend`, `by-project`
- [ ] Middleware `permission:og-tickets.view`
- [ ] Test case chính: không có dữ liệu, không có phản hồi, fallback `updated_at`, project filter, month buckets rỗng
- [ ] Không tạo migration/model mới cho report

