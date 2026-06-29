# Báo cáo "Chất lượng & CSAT" (Platform) — Đặc tả kỹ thuật Frontend

> Báo cáo #2 trong cụm | Ngày tạo: 2026-06-18 | Trạng thái: Draft
> Nguồn mockup: `BA-TNP-SERVICES/app/pages/platform/modules/bao-cao-tong-hop/chat-luong-csat.vue` + composable `csatReport`.
> **Nền tảng chung:** [`./README.md`](./README.md) — route prefix, miền dữ liệu, conventions. File này CHỈ mô tả phần riêng của trang CSAT.

---

## 1. Header

- **Báo cáo:** Chất lượng & CSAT.
- **Mockup:** `chat-luong-csat.vue`, composable `csatReport`.
- **Đọc miền:** đơn marketplace vendor (README §3.2 miền 2) — qua endpoint BE `GET /api/v1/platform/reports/csat` (xem [`csat-be.md`](./csat-be.md)).

---

## 2. Tổng quan

Trang console platform hiển thị **chất lượng phục vụ cư dân** trên toàn bộ đơn marketplace vendor: điểm CSAT trung bình, tỷ lệ phản hồi/hoàn tất/huỷ, phân bố đánh giá theo sao, CSAT theo vendor & theo dự án, và danh sách đánh giá thấp cần theo dõi. Trang **read-only**, không có hành động ghi.

Dữ liệu lấy 1 lần từ endpoint CSAT; FE chỉ render. Format tiền không áp dụng (báo cáo này không có tiền); rating hiển thị 1 chữ số thập phân, `%` là số nguyên.

---

## 3. Trang & Route

- **Route:** `/platform/modules/bao-cao-tong-hop/chat-luong-csat` (README §1).
- **Layout:** layout platform (console vận hành nền tảng) — đồng bộ các trang `/platform/modules/...` hiện hữu.
- **Nút "Về Hub":** liên kết về trang hub `…/tong-quan` (như các báo cáo khác trong cụm).
- **API composable:** dùng/định nghĩa trong composable chung của cụm (vd `usePlatformReports.ts`), hàm `useCsatReport(params)` gọi `useApiFetch('/platform/reports/csat', { query })`. KHÔNG gọi `$fetch` URL thô trong page (theo quy ước FE: mọi URL nằm trong composable).
- **Filter kỳ:** select `months` (mặc định 6) hoặc khoảng `from`/`to` — đồng bộ component filter dùng chung của cụm báo cáo. Đổi filter → `refresh()`.

---

## 4. KPI Cards (grid 4 thẻ)

Dùng component thẻ KPI dùng chung của cụm (Nuxt UI / `SharedStatCard` nếu có — KHÔNG custom div+Tailwind cho card, theo quy ước FE).

| # | Nhãn | Dữ liệu | Ghi chú / màu |
|---|------|---------|---------------|
| 1 | Điểm trung bình | `kpis.avgRating` dạng `X.X / 5` + nhãn chất lượng | Nếu `avgRating == null` → hiển thị **"—"** (chưa có đánh giá). Nhãn: ≥4.5 "Rất tốt", ≥4 "Tốt", ≥3 "Khá", <3 "Cần cải thiện" |
| 2 | Tỷ lệ phản hồi | `kpis.responseRate%` + dòng phụ `ratedCount / totalOrders` đơn | Trung tính (neutral) |
| 3 | Hoàn tất | `kpis.completionRate%` | Màu **success** |
| 4 | Huỷ đơn | `kpis.cancelRate%` | Màu **error nếu > 10**, ngược lại neutral/warning |

---

## 5. Biểu đồ & Bảng

### 5.1 Card "Phân bố đánh giá theo sao"

- Dùng `SharedSectionCard` (title="Phân bố đánh giá theo sao", `compact`).
- Render `starBuckets` (5→1): mỗi sao một **thanh ngang (horizontal bar)** với nhãn số sao + `count`. Bề rộng bar tỉ lệ theo `count / max(count)` (hoặc theo `ratedCount`). Có thể dùng `UProgress` cho thanh.
- Nếu tất cả `count = 0` (chưa có đánh giá) → bar rỗng + dòng "Chưa có dữ liệu đánh giá".

### 5.2 Bảng "CSAT theo vendor" (`byVendor`)

`UTable`, cột:

| Cột | Nguồn | Hiển thị |
|-----|-------|----------|
| Vendor | `partnerName` | text |
| Đơn | `orderCount` | số |
| CSAT | `avgRating` | `X.X` + `(ratedCount)`; **"—"** nếu `avgRating == null` |
| Huỷ | `cancelCount` (hoặc tỷ lệ huỷ tính từ `cancelCount/orderCount`) | số / % |

Đã sort `avgRating` giảm dần từ BE.

### 5.3 Bảng "CSAT theo dự án" (`byProject`)

`UTable`, cột: **Dự án** (`projectName`), **Đơn** (`orderCount`), **CSAT** (`avgRating` + `(ratedCount)`, "—" nếu null). Đã sort giảm dần từ BE.

### 5.4 Bảng "Đánh giá thấp cần theo dõi (≤3 sao)" (`lowRatings`)

`UTable`, cột:

| Cột | Nguồn |
|-----|-------|
| Vendor | `partnerName` |
| Dự án | `projectName` |
| Cư dân | `residentName` |
| Sao | `residentRating` — dùng `UBadge` màu theo điểm (1–2 error, 3 warning) |
| Nhận xét | `residentRatingComment` (rỗng → "—") |

**Empty state:** khi `lowRatings = []` → hiển thị thông điệp tích cực (vd `UAlert` color success/neutral: "Không có đánh giá thấp trong kỳ"). KHÔNG để bảng trống không chú thích.

---

## 6. Hành động & Liên kết

- **Read-only:** không có nút tạo/sửa/xoá.
- Nút "Về Hub" (→ `…/tong-quan`).
- Filter kỳ (`months` / `from`-`to`) → refetch.
- (Tuỳ chọn) tên vendor ở bảng `byVendor` có thể link sang console "Quản lý Vendor" chi tiết vendor nếu cụm cho phép — không bắt buộc GĐ1.

---

## 7. Trạng thái

- **Loading:** `status === 'pending'` → skeleton cho KPI + bảng (đồng bộ component loading dùng chung của cụm).
- **Error:** `error` → `UAlert` color error "Không tải được báo cáo CSAT".
- **Empty (kỳ rỗng):** tất cả KPI `0`/"—", `starBuckets` count=0, bảng rỗng + empty state riêng từng bảng.
- **Rating chưa wiring:** xem §8.

---

## 8. Ghi chú nghiệp vụ

- Báo cáo **phụ thuộc wiring đánh giá cư dân** (xem [`csat-be.md`](./csat-be.md) §9 / README §9). Đây là việc cross-repo (resi_mart + Marketplace) — Phase-1.
- **Nếu chưa có dữ liệu rating** (resi_mart chưa migrate hoặc cư dân chưa chấm điểm): BE trả `avgRating = null`, `ratedCount = 0`, `responseRate = 0`, `starBuckets` count=0, `lowRatings = []`. Khi đó:
  - Thẻ "Điểm trung bình" và cột **CSAT** ở 2 bảng hiển thị **"—"** (KHÔNG hiển thị `0.0`).
  - Card phân bố sao + bảng đánh giá thấp hiển thị empty state.
  - Các KPI từ status (Hoàn tất, Huỷ đơn) vẫn có số thật vì không phụ thuộc rating.
- `%` luôn là số nguyên (BE đã làm tròn); `avgRating` hiển thị 1 chữ số thập phân. Không format/làm tròn lại lệch ở FE.
- Trang đọc cùng fact-set marketplace với các báo cáo #3/#4/#6/#7 (README §3.4) — giữ nhãn/thuật ngữ nhất quán với chúng.
```