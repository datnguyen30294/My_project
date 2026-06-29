# Đánh giá của cư dân (tenant) - Đặc tả nghiệp vụ Frontend

> Module: `Platform/Tenant` | Ngày tạo: 2026-06-12 | Trạng thái: **Sẵn sàng triển khai — BE đã xong**
> Card mới trong trang chi tiết công ty vận hành `/platform/tenants/[id]`, đặt sau card Tổng quan kinh doanh, trước khu tabs.

## 1. Tổng quan

Admin platform xem chất lượng dịch vụ của một công ty vận hành qua đánh giá của cư dân trên các **ticket** đã xử lý (nguồn: `og_tickets.resident_rating` trong tenant schema — không phải đơn vendor resi_mart như bản nháp đầu): điểm trung bình, số lượt đánh giá, và bảng chi tiết từng đánh giá.

## 2. Danh sách trang

Không có trang mới — là **card "Đánh giá của cư dân"** trong trang `/platform/tenants/[id]`.

## 3. Nội dung card

### 3.1 Header

- Icon ngôi sao (warning/vàng) + tiêu đề "Đánh giá của cư dân"
- Tóm tắt bên phải: `TB 4.6/5 · 23 lượt` (ẩn nếu chưa có đánh giá — `summary.average = null`)
- Mô tả phụ: "Tổng hợp đánh giá của cư dân trên các ticket đã xử lý của tenant."

### 3.2 Bảng đánh giá

| Cột | Dữ liệu | Ghi chú |
|-----|---------|---------|
| Ticket | `ticket_code` + `subject` | Text thuần (platform chưa có trang chi tiết ticket vận hành) |
| Dự án | `project_name` | "—" nếu trống |
| Cư dân | `resident_name` | Chỉ tên hiển thị |
| Điểm | `rating` | Hiển thị sao ★ (1–5) |
| Nhận xét | `comment` | "—" nếu trống |
| Thời điểm | `rated_at` | DD/MM/YYYY HH:mm |

Phân trang phía dưới bảng (mặc định 20 dòng/trang).

### 3.3 Bộ lọc

| Bộ lọc | Loại | Mô tả |
|--------|------|-------|
| Số sao | Dropdown (Tất cả / 1★ … 5★) | Lọc danh sách; phần tóm tắt TB/lượt không đổi theo filter |

### 3.4 Trạng thái đặc biệt

| Trạng thái | Hiển thị |
|-----------|----------|
| Đang tải | Skeleton rows |
| Chưa có đánh giá | UEmpty "Chưa có đánh giá nào từ cư dân" |

## 4. Luồng người dùng

```
Trang chi tiết tenant → card "Đánh giá của cư dân" tự tải
  → Xem điểm TB + số lượt → lọc theo số sao nếu cần → chuyển trang
```

## 5. Ghi chú nghiệp vụ

- Chỉ tổng hợp các ticket **đã được cư dân đánh giá** — ticket hoàn tất chưa đánh giá không xuất hiện.
- Cột "Đánh giá CD" trên **trang danh sách** tenants (mockup có) KHÔNG làm ở giai đoạn này — lý do hiệu năng, xem spec BE.
- Cột "Vendor" và "Loại" trong mockup thuộc bản nháp nguồn resi_mart — KHÔNG áp dụng.
- API: `GET /platform/tenants/{id}/resident-ratings` — response `{ success, summary: {average, count}, data: [...], meta }`.
- API function trong `composables/api/useTenants.ts`: `useTenantResidentRatings(id, params)`.
