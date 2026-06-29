# Tổng quan kinh doanh tenant - Đặc tả nghiệp vụ Frontend

> Module: `Platform/Tenant` | Ngày tạo: 2026-06-15 | Trạng thái: Draft
> Card **"Tổng quan kinh doanh (6 tháng)"** đặt TRƯỚC khu tabs trong trang chi tiết công ty vận hành.
> Bản này thay thế bản 2026-06-12 (đã xoá): nguồn số liệu là **đơn hàng PMC của tenant** (từ ticket), không phải đơn vendor.

## 1. Tổng quan

Admin platform nhìn nhanh sức khoẻ kinh doanh của một công ty vận hành trong N tháng gần nhất (mặc định 6): **doanh thu** từ các đơn hàng PMC hoàn thành, **số đơn hàng**, và **phí nền tảng thực thu** — kèm biểu đồ theo tháng.

## 2. Danh sách trang

Không có trang mới — là **card** đặt giữa phần header và khu tabs của trang chi tiết tenant (`/platform/tenants/[id]`).

## 3. Nội dung card

### 3.1 Ba thẻ số liệu

| Thẻ | Dữ liệu | Format |
|-----|---------|--------|
| Doanh thu tenant | `summary.tenant_revenue` | Tiền VNĐ (vd `6.030.000.000 đ`) |
| Số đơn hàng | `summary.order_count` | Số có phân cách nghìn |
| Phí platform thu về | `summary.platform_revenue` | Tiền VNĐ, màu success |

### 3.2 Biểu đồ theo tháng

- Trục X: nhãn tháng (`T11/2025`, `T12/2025`, ...) lấy từ `months[].label`.
- Cột (bar): **doanh thu** từng tháng (`months[].tenant_revenue`).
- Đường liền (line): **số đơn hàng** từng tháng (`months[].order_count`) — trục phải.
- Đường đứt nét: **phí platform** từng tháng (`months[].platform_fee`).
- Hover từng tháng hiển thị đủ 3 giá trị.

> Triển khai chart: ưu tiên thư viện đã có trong dự án; nếu chưa có dùng SVG thuần như mockup — quyết định lúc code, không ràng buộc trong spec.

### 3.3 Trạng thái đặc biệt

| Trạng thái | Hiển thị |
|-----------|----------|
| Đang tải | Skeleton 3 thẻ + khối chart |
| Lỗi tải | `UAlert` color `error`: "Không tải được dữ liệu kinh doanh" |
| Không có đơn nào trong kỳ | Vẫn hiện 3 thẻ (giá trị 0) + `UEmpty` thay chart |

## 4. Luồng người dùng

```
Danh sách công ty VH → click 1 công ty → trang chi tiết
  → Card tổng quan kinh doanh tự tải (6 tháng mặc định)
  → Hover từng tháng trên biểu đồ để xem chi tiết 3 chỉ số
```

GĐ này FE cố định 6 tháng (API hỗ trợ `months` 1–12 — có thể thêm dropdown chọn kỳ sau).

## 5. Ghi chú nghiệp vụ

- **Doanh thu** = tổng giá trị các **đơn hàng PMC đã hoàn thành** của tenant (đơn phát sinh từ ticket xử lý: `og_ticket → báo giá → đơn hàng`). Đơn huỷ / chưa hoàn thành không tính.
- **Phí platform** = **phí nền tảng thực đã đóng băng** tại kỳ chốt phí của các đơn đó (số thực, không phải ước tính). Xem [`platform-fee-per-order-fe.md`](./platform-fee-per-order-fe.md).
- **Lệch nhẹ giữa doanh thu và phí là bình thường:** đơn vừa hoàn thành nhưng chưa được đưa vào kỳ chốt phí thì đã có doanh thu nhưng phí chưa phát sinh — phí sẽ hiện đúng tháng khi đơn được chốt. Không cần chú thích "ước tính".
- Tenant chưa phát sinh đơn → card vẫn hiển thị với cả 3 chỉ số = 0.
- API: thêm `useTenantBusinessSummary(id)` (GET) trong `composables/api/useTenants.ts`, gọi `tenants/{id}/business-summary`. Trang KHÔNG gọi `$fetch` URL thô.

## 6. Phân quyền

Theo nhóm route platform hiện hành (`auth:requester`) — không thêm quyền riêng ở GĐ này.
