# Đồng bộ Category Ticket - Đặc tả kỹ thuật Backend

> Module: `Requester/Ticket` | Ngày tạo: 2026-04-14 | Trạng thái: Draft

## 1. Tổng quan

Feature này bổ sung khả năng lưu lại **danh mục cư dân chọn khi gửi ticket** ở landing page `/ticket`, sau đó copy nguyên snapshot đó sang `og_tickets` để phục vụ:

- phân loại ticket trong màn xử lý OG,
- báo cáo SLA / doanh thu ticket,
- truy vết lịch sử theo đúng dữ liệu cư dân đã gửi tại thời điểm tạo ticket.

## 2. Kết luận domain

### 2.1 Khuyến nghị chọn `category snapshot`, không làm `tags` generic trong v1

Lý do:

- Form `/ticket` hiện lấy dữ liệu từ `public/services`, tức source thực chất là **service category** chứ chưa phải hệ thống tag độc lập.
- `tags` generic sẽ kéo theo scope lớn hơn: entity/pivot riêng, CRUD tag, quyền sửa tag, logic merge tag cư dân với tag nội bộ.
- Nhu cầu hiện tại chỉ là giữ lại **phân loại cư dân đã chọn** và copy sang `og_ticket`.

### 2.2 Ràng buộc quan trọng từ UI hiện tại

Màn `/ticket` đang cho phép cư dân chọn **nhiều service item** và thực tế có thể rơi vào **nhiều category**.

Vì vậy:

- Không đủ nếu chỉ thêm một cột `category_name`.
- V1 nên lưu **mảng category snapshot**.
- Để phục vụ báo cáo 1 chiều và filter đơn giản, bổ sung thêm `primary_category_code` + `primary_category_name`.

### 2.3 Không dùng mapping table giữa `ticket` và `og_ticket`

`og_ticket` là snapshot copy từ `ticket`, nên không cần bảng mapping riêng giữa hai module. Cần copy cùng payload snapshot sang tenant DB.

## 3. Entities

### 3.1 Ticket (bổ sung field snapshot)

**Bảng:** `tickets` (central DB)

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| Danh mục chính | `primary_category_code` | `string(50)` | nullable, index | Code category đầu tiên sau khi normalize |
| Tên danh mục chính | `primary_category_name` | `string(255)` | nullable | Label tương ứng với `primary_category_code` |
| Snapshot danh mục | `category_snapshots` | `json` | nullable | Mảng object `{ code, name }` đã dedupe |
| Snapshot hạng mục cư dân chọn | `service_item_snapshots` | `json` | nullable | Mảng object `{ name, slug, category_code, category_name }` |

**Ghi chú:**

- Không lưu FK sang `service_categories` hay `catalog_items` vì đây là dữ liệu cross-module và cần snapshot lịch sử.
- `primary_category_*` là field derive từ `category_snapshots`, không nhận trực tiếp từ client.

### 3.2 OgTicket (bổ sung field snapshot)

**Bảng:** `og_tickets` (tenant DB)

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| Danh mục chính | `primary_category_code` | `string(50)` | nullable, index | Copy từ ticket gốc |
| Tên danh mục chính | `primary_category_name` | `string(255)` | nullable | Copy từ ticket gốc |
| Snapshot danh mục | `category_snapshots` | `json` | nullable | Copy từ ticket gốc |
| Snapshot hạng mục cư dân chọn | `service_item_snapshots` | `json` | nullable | Copy từ ticket gốc |

**Ghi chú:**

- Đây là snapshot immutable của dữ liệu cư dân chọn.
- Nếu sau này OG cần gắn nhãn nội bộ, tạo feature riêng `og_ticket_tags`; không dùng chung với `category_snapshots`.

## 4. API / Service impact

### 4.1 Public submit ticket

| Action | Method | URL | Request Class | Ghi chú |
|--------|--------|-----|---------------|---------|
| Submit | POST | `/api/v1/tickets` | `SubmitTicketRequest` | Nhận thêm snapshot category + service item |

**Request bổ sung:**

```json
{
  "subject": "Máy lạnh, Điện",
  "category_snapshots": [
    { "code": "DIEN", "name": "Điện" },
    { "code": "MAY-LANH", "name": "Máy lạnh" }
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

### 4.2 Ticket -> OgTicket copy

Ảnh hưởng 2 luồng:

1. `Platform/Ticket/OgTicketExternalService::createFromTicket()`
   Dùng khi ticket được submit với `claimed_by_org_id` và tạo thẳng `og_ticket`.
2. `PMC/OgTicket/TicketExternalService::claimTicket()` + `OgTicketService::claim()`
   Dùng khi OG claim từ pool.

Ở cả hai luồng, snapshot category phải được copy nguyên sang `og_tickets`.

## 5. Validation Rules

### 5.1 SubmitTicketRequest

| Field | Rules | Message (VI) |
|-------|-------|--------------|
| `category_snapshots` | `['nullable', 'array', 'max:20']` | Danh sách danh mục không hợp lệ |
| `category_snapshots.*.code` | `['required_with:category_snapshots', 'string', 'max:50']` | Mã danh mục không hợp lệ |
| `category_snapshots.*.name` | `['required_with:category_snapshots', 'string', 'max:255']` | Tên danh mục không hợp lệ |
| `service_item_snapshots` | `['nullable', 'array', 'max:50']` | Danh sách hạng mục không hợp lệ |
| `service_item_snapshots.*.name` | `['required_with:service_item_snapshots', 'string', 'max:255']` | Tên hạng mục không hợp lệ |
| `service_item_snapshots.*.slug` | `['nullable', 'string', 'max:255']` | Slug hạng mục không hợp lệ |
| `service_item_snapshots.*.category_code` | `['nullable', 'string', 'max:50']` | Mã danh mục hạng mục không hợp lệ |
| `service_item_snapshots.*.category_name` | `['nullable', 'string', 'max:255']` | Tên danh mục hạng mục không hợp lệ |

**Ghi chú validation:**

- V1 không bắt buộc gọi external service để verify category code còn tồn tại trong catalog hiện hành.
- Dữ liệu này là **snapshot cư dân gửi lên**, nên chỉ cần validate shape + normalize.

## 6. Business Rules

- [ ] `subject` vẫn giữ vai trò tiêu đề hiển thị cho người dùng, không thay bằng category.
- [ ] `category_snapshots` được dedupe theo `code`; nếu thiếu `code` thì fallback theo `name`.
- [ ] `primary_category_*` được derive từ phần tử đầu tiên của `category_snapshots` sau normalize.
- [ ] `service_item_snapshots` giữ nguyên chi tiết item cư dân đã chọn để phục vụ audit/debug.
- [ ] Nếu không có category nào được gửi lên thì toàn bộ field snapshot category = `null`.
- [ ] Snapshot category/service item trên `tickets` là immutable sau khi tạo.
- [ ] Khi tạo `og_ticket` từ `ticket`, copy nguyên 4 field snapshot.
- [ ] Snapshot trên `og_tickets` cũng immutable; API update og_ticket không cho sửa các field này trong v1.
- [ ] Báo cáo cần dùng `primary_category_name` cho case group 1 chiều; không giả định `tags` đã tồn tại.

## 7. Presenter Output

### 7.1 TicketResource

```json
{
  "id": 1,
  "code": "TK-2026-001",
  "subject": "Kiểm tra aptomat, Chập điện ban công",
  "primary_category_code": "DIEN",
  "primary_category_name": "Điện",
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

### 7.2 OgTicketResource

```json
{
  "id": 12,
  "ticket_id": 1,
  "subject": "Kiểm tra aptomat, Chập điện ban công",
  "primary_category_code": "DIEN",
  "primary_category_name": "Điện",
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

## 8. Cross-Module Dependencies

| Dependency | Module nguồn | Hình thức |
|-----------|-------------|-----------|
| Public service categories / items | `PMC/Catalog` | Chỉ là nguồn dữ liệu chọn trên FE; BE không tạo FK sang module này |
| Ticket -> OgTicket copy | `Requester/Ticket` -> `PMC/OgTicket` | Copy snapshot qua `ExternalService` hiện có |

**Nguyên tắc:**

- Không tạo FK `tickets -> service_categories`.
- Không tạo bảng mapping `ticket_category_map`.
- Không dùng tên category ở `og_ticket` để join ngược về catalog runtime.

## 9. Migration Preview

### 9.1 Central DB - tickets

```php
Schema::table('tickets', function (Blueprint $table) {
    $table->string('primary_category_code', 50)->nullable()->after('subject');
    $table->string('primary_category_name', 255)->nullable()->after('primary_category_code');
    $table->json('category_snapshots')->nullable()->after('primary_category_name');
    $table->json('service_item_snapshots')->nullable()->after('category_snapshots');

    $table->index('primary_category_code');
});
```

### 9.2 Tenant DB - og_tickets

```php
Schema::table('og_tickets', function (Blueprint $table) {
    $table->string('primary_category_code', 50)->nullable()->after('subject');
    $table->string('primary_category_name', 255)->nullable()->after('primary_category_code');
    $table->json('category_snapshots')->nullable()->after('primary_category_name');
    $table->json('service_item_snapshots')->nullable()->after('category_snapshots');

    $table->index('primary_category_code');
});
```

## 10. Ghi chú kỹ thuật

### 10.1 Vì sao không nên chỉ lưu `name`

Chỉ lưu `name` sẽ gặp 2 vấn đề:

- đổi tên category trong catalog làm mất tính ổn định khi group/report,
- khó dedupe nếu tên bị chỉnh sửa khác dấu / khác khoảng trắng.

Khuyến nghị lưu cả `code` + `name`. `code` dùng cho logic, `name` dùng cho hiển thị snapshot.

### 10.2 Nếu sau này bắt buộc chỉ có 1 category

Nếu nghiệp vụ đổi sang single-category thật sự, có thể thu gọn:

- bỏ `category_snapshots`,
- giữ `primary_category_code` + `primary_category_name`,
- bỏ logic multi-category trên FE.

Hiện tại chưa nên làm vậy vì trái với UI đang chạy.

## 11. Checklist triển khai BE

- [ ] Migration thêm snapshot fields cho `tickets`
- [ ] Migration thêm snapshot fields cho `og_tickets`
- [ ] Update `SubmitTicketRequest`
- [ ] Update `Ticket` model fillable + casts
- [ ] Update `TicketService::submit()` để normalize snapshot và derive `primary_category_*`
- [ ] Update `TicketResource`
- [ ] Update `Platform/OgTicketExternalService::createFromTicket()`
- [ ] Update `PMC/TicketExternalService::claimTicket()` và `OgTicketService::claim()`
- [ ] Update `OgTicket` model fillable + casts
- [ ] Update `OgTicketListResource`, `OgTicketDetailResource`
- [ ] Review lại các report spec đang dùng `tags` để đổi sang `category snapshot`
