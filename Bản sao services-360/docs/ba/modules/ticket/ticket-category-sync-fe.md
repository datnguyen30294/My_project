# Đồng bộ Category Ticket - Đặc tả nghiệp vụ Frontend

> Module: `Requester/Ticket` | Ngày tạo: 2026-04-14 | Trạng thái: Draft

## 1. Tổng quan

Khi cư dân tạo ticket ở trang `/ticket`, hệ thống cần lưu lại **danh mục đã chọn** và chuyển tiếp dữ liệu đó sang `og_ticket`. Mục tiêu của FE là:

- gửi đúng snapshot category/service item lên API submit ticket,
- hiển thị lại category trong màn xử lý OG,
- giữ nguyên hành vi chọn nhiều hạng mục như UI hiện tại.

## 2. Quyết định nghiệp vụ FE

- Không coi `tags` là feature chính của v1.
- V1 dùng **category snapshot** sinh ra từ các service item cư dân chọn.
- Nếu sau này OG cần gắn nhãn nội bộ, đó là feature khác.

## 3. Danh sách màn bị ảnh hưởng

| Trang | Route | Mô tả |
|-------|-------|-------|
| Gửi ticket công khai | `/ticket` | Chọn hạng mục, submit kèm snapshot category |
| Chi tiết OG Ticket | `/pmc/og-tickets/[id]` | Hiển thị category snapshot read-only |
| Danh sách OG Ticket | `/pmc/og-tickets` | Có thể hiển thị danh mục chính |
| Pool Ticket | `/pmc/og-tickets/pool` | Có thể hiển thị danh mục chính nếu API trả |

## 4. Trang `/ticket`

### 4.1 Dữ liệu nguồn

Nguồn dữ liệu chọn danh mục/hạng mục lấy từ API public services hiện có:

- category: `id`, `name`, `code`
- service item: `name`, `slug`, `category`

FE không tự hardcode danh mục.

### 4.2 Hành vi chọn

Giữ nguyên hành vi hiện tại:

- cư dân có thể chọn nhiều service item,
- service item có thể thuộc nhiều category khác nhau,
- tiêu đề (`subject`) vẫn được compose từ item đã chọn + text cư dân nhập thêm.

### 4.3 Payload FE phải gửi

Khi submit, FE gửi thêm 2 field:

```json
{
  "category_snapshots": [
    { "code": "DIEN", "name": "Điện" },
    { "code": "PCCC", "name": "PCCC" }
  ],
  "service_item_snapshots": [
    {
      "name": "Kiểm tra aptomat",
      "slug": "kiem-tra-aptomat",
      "category_code": "DIEN",
      "category_name": "Điện"
    }
  ]
}
```

### 4.4 Rule build payload ở FE

- `service_item_snapshots` lấy trực tiếp từ các item cư dân đang chọn.
- `category_snapshots` được dedupe từ `service_item_snapshots`.
- Thứ tự `category_snapshots` theo thứ tự category đang render từ API, để backend derive `primary_category_*` ổn định.
- Nếu cư dân không chọn item nào mà chỉ nhập subject tay, hai field snapshot để `undefined`.

### 4.5 UI hiển thị

Form hiện tại không cần thêm input mới. Chỉ cần:

- giữ chips item đã chọn như hiện tại,
- có thể bổ sung dòng phụ "Danh mục đã chọn" nếu muốn tăng độ rõ,
- không bắt cư dân hiểu khái niệm `tag`.

## 5. Màn OG Ticket

### 5.1 Danh sách `/pmc/og-tickets`

Khuyến nghị hiển thị thêm:

| Cột | Dữ liệu | Ghi chú |
|-----|---------|---------|
| Danh mục chính | `primary_category_name` | Hiện `—` nếu null |

Nếu sau này cần nén UI:

- chỉ hiển thị `primary_category_name` ở list,
- không hiển thị toàn bộ `category_snapshots` ở table.

### 5.2 Chi tiết `/pmc/og-tickets/[id]`

Trong card thông tin ticket gốc, hiển thị thêm:

| Trường | Dữ liệu | Ghi chú |
|--------|---------|---------|
| Danh mục chính | `primary_category_name` | Read-only |
| Danh mục đã chọn | `category_snapshots[]` | Hiển thị dạng badge/chip |
| Hạng mục cư dân chọn | `service_item_snapshots[]` | Hiển thị dạng danh sách nhỏ hoặc chip |

**Rule:**

- Đây là snapshot từ cư dân, không cho OG sửa ở v1.
- Không dùng input tag editor trong màn này.

### 5.3 Pool `/pmc/og-tickets/pool`

Nếu API pool trả được `primary_category_name`, nên hiển thị thêm cột này để nhân viên nhìn ticket theo đúng nhóm sự cố trước khi claim.

## 6. Luồng người dùng

### 6.1 Cư dân tạo ticket

```text
/ticket
  -> Chọn 1 hoặc nhiều hạng mục
  -> Nhập thêm tiêu đề/mô tả nếu cần
  -> Submit
  -> FE gửi subject + category_snapshots + service_item_snapshots
  -> Thành công: hiện mã ticket như hiện tại
```

### 6.2 OG xem ticket

```text
Pool hoặc danh sách og_ticket
  -> Mở chi tiết
  -> Thấy danh mục chính + toàn bộ danh mục/hạng mục cư dân đã chọn
  -> Dùng thông tin này để phân công/xử lý
```

## 7. Phân quyền

| Hành động | Quyền |
|-----------|-------|
| Cư dân gửi ticket | Public, không cần auth |
| OG xem category snapshot ở ticket | Theo quyền xem `og-tickets.view` hiện có |
| OG sửa category snapshot | Không hỗ trợ trong v1 |

## 8. Ghi chú nghiệp vụ

### 8.1 Vì sao không nên đổi thẳng thành `tags`

Ở góc nhìn FE, `tags` kéo theo UI khác:

- tag picker,
- thêm/xóa tag tự do,
- chuẩn hóa tag label,
- xung đột giữa tag cư dân chọn và tag nội bộ.

Trong khi nhu cầu hiện tại chỉ là giữ lại **danh mục cư dân chọn**.

### 8.2 Phân biệt `subject` và `category`

- `subject`: tiêu đề người dùng nhìn thấy, vẫn có thể chứa text tự nhập.
- `category`: dữ liệu phân loại có cấu trúc, phục vụ filter/report.

Hai phần này không thay thế nhau.

### 8.3 Ảnh hưởng đến báo cáo

Các báo cáo trước đây đang giả định `tags` trên `og_ticket` cần đổi sang:

- `primary_category_name` nếu chỉ cần 1 cột phân loại,
- `category_snapshots` nếu cần danh sách nhiều danh mục.

## 9. Checklist triển khai FE

- [ ] Update types `SubmitTicketData` / generated `SubmitTicketRequest`
- [ ] Update `apiSubmitTicket()` để append `category_snapshots` và `service_item_snapshots`
- [ ] Update page `frontend/app/pages/ticket/index.vue` để build snapshot payload từ selected items
- [ ] Review success/error flow để không làm thay đổi UX hiện tại
- [ ] Update types/resource cho `useOgTickets`
- [ ] Hiển thị `primary_category_name` ở list/pool nếu API trả
- [ ] Hiển thị `category_snapshots` + `service_item_snapshots` ở trang chi tiết `og_ticket`
- [ ] Rà lại các màn báo cáo đang đọc `tags`
