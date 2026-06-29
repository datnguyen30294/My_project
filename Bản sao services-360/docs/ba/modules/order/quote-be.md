# Module Báo giá - Đặc tả kỹ thuật Backend

> Module: `PMC/Quote` | Ngày tạo: 2026-03-20 | Trạng thái: Draft

## 1. Tổng quan

Sub-module **Báo giá (Quote)** thuộc luồng Quản lý đơn hàng. Tạo và quản lý báo giá từ OgTicket (ticket nội bộ). Mỗi dòng có **đơn giá × số lượng**; đơn có **tổng tiền**. Flow duyệt 2 bước: quản lý → cư dân.

**Quy tắc quan trọng:** Mỗi OgTicket chỉ có **1 báo giá active** tại 1 thời điểm. Khi tạo báo giá mới cho ticket đã có báo giá active → confirm → inactive báo giá cũ.

**Phạm vi:**
- **Báo giá (Quote):** Tạo từ OgTicket, chứa danh sách dòng (vật tư/dịch vụ), flow duyệt 2 bước.
- **Dòng báo giá (QuoteLine):** Gắn với CatalogItem hoặc CatalogAdhocItem, snapshot tên + giá.

> **Audit:** Quote model implements `Auditable` (owen-it/laravel-auditing) — tự động track mọi thay đổi field (bao gồm status transitions, is_active). Không cần bảng QuoteHistory riêng.

> **Lưu ý:** QuoteRevision (phiên bản báo giá phát sinh) sẽ triển khai ở phase sau, khi có module Đơn hàng (SalesOrder).

**Luồng nghiệp vụ:**
```
OgTicket → Tạo báo giá (draft | sent) → [nếu draft] Gửi (sent) → Quản lý duyệt (manager_approved) → Cư dân chấp thuận (approved)
                                                                      ↘ Từ chối (rejected)                ↘ Từ chối (rejected)
```

**Cấu trúc module:**

```
app/Modules/PMC/src/Quote/
├── Controllers/
│   └── QuoteController.php
├── Models/
│   ├── Quote.php
│   └── QuoteLine.php
├── Services/
│   └── QuoteService.php
├── Repositories/
│   └── QuoteRepository.php
├── Resources/
│   ├── QuoteListResource.php
│   ├── QuoteDetailResource.php
│   └── QuoteLineResource.php
├── Requests/
│   ├── ListQuoteRequest.php
│   ├── StoreQuoteRequest.php
│   ├── UpdateQuoteRequest.php
│   └── TransitionQuoteRequest.php
├── Contracts/
│   └── QuoteServiceInterface.php
└── Enums/
    ├── QuoteStatus.php
    └── QuoteLineType.php
```

## 2. Entities

### 2.1 Quote (Báo giá)

**Bảng:** `quotes`

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| Mã báo giá | `code` | `string(50)` | required, unique per tenant | Mã tự sinh: QT-YYYYMMDD-XXX |
| OgTicket | `og_ticket_id` | `foreignId` | required, FK → og_tickets | Ticket nội bộ nguồn |
| Trạng thái | `status` | `string(30)` | required | QuoteStatus enum |
| Active | `is_active` | `boolean` | required, default: true | Chỉ 1 báo giá active/ticket |
| Tổng tiền | `total_amount` | `decimal(15,2)` | required, default: 0 | Sum(unit_price × quantity) các dòng |
| Quản lý duyệt lúc | `manager_approved_at` | `timestamp` | nullable | |
| Quản lý duyệt bởi | `manager_approved_by_id` | `foreignId` | nullable, FK → accounts | |
| Cư dân chấp thuận lúc | `resident_approved_at` | `timestamp` | nullable | |
| Ghi chú | `note` | `text` | nullable | Ghi chú nội bộ |
| created_at | `created_at` | `timestamp` | auto | |
| updated_at | `updated_at` | `timestamp` | auto | |
| deleted_at | `deleted_at` | `timestamp` | nullable, soft delete | |

**Indexes:**
- `quotes_og_ticket_id_index` on `og_ticket_id`
- `quotes_status_index` on `status`
- `quotes_is_active_index` on `is_active`
- `quotes_code_unique` — partial unique index (WHERE deleted_at IS NULL)
- `quotes_og_ticket_active_unique` — partial unique index on (`og_ticket_id`) WHERE `is_active = true AND deleted_at IS NULL` → đảm bảo DB-level chỉ 1 active/ticket

**Relationships:**
- `belongsTo` → `OgTicket` (og_ticket_id)
- `belongsTo` → `Account` as `managerApprovedBy` (manager_approved_by_id)
- `hasMany` → `QuoteLine` (quote_id)
- `morphMany` → `Audit` (via Auditable trait — auto)

### 2.2 QuoteLine (Dòng báo giá)

**Bảng:** `quote_lines`

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| Quote | `quote_id` | `foreignId` | required, FK → quotes, cascade delete | |
| Loại dòng | `line_type` | `string(30)` | required | QuoteLineType: material / service / adhoc |
| Ref ID | `reference_id` | `unsignedBigInteger` | required | ID của CatalogItem hoặc CatalogAdhocItem |
| Tên snapshot | `name` | `string(255)` | required | Tên hạng mục tại thời điểm tạo |
| Số lượng | `quantity` | `integer` | required, min: 1 | |
| Đơn vị | `unit` | `string(50)` | required | |
| Đơn giá | `unit_price` | `decimal(15,2)` | required | Giá 1 đơn vị |
| Thành tiền | `line_amount` | `decimal(15,2)` | required | unit_price × quantity (server tính) |
| created_at | `created_at` | `timestamp` | auto | |
| updated_at | `updated_at` | `timestamp` | auto | |

**Indexes:**
- `quote_lines_quote_id_index` on `quote_id`

**Relationships:**
- `belongsTo` → `Quote` (quote_id)

> **Ghi chú:** `reference_id` là polymorphic theo `line_type`:
> - `material` / `service` → FK tới `catalog_items.id`
> - `adhoc` → FK tới `catalog_adhoc_items.id`
>
> Không dùng morphTo vì cần snapshot tên/giá tại thời điểm tạo (không join lại).

## 3. Enums

### 3.1 QuoteStatus

```php
enum QuoteStatus: string
{
    case Draft = 'draft';                      // Nháp — đang soạn
    case Sent = 'sent';                        // Đã gửi — chờ quản lý duyệt
    case ManagerApproved = 'manager_approved'; // Quản lý đã duyệt — chờ cư dân
    case Approved = 'approved';                // Cư dân đã chấp thuận (trạng thái cuối)
    case Rejected = 'rejected';                // Từ chối (quản lý hoặc cư dân)
}
```

**State machine:**
```
draft → sent → manager_approved → approved ✓ (final)
                    ↘ rejected         ↘ rejected
```

> **`is_active`** là cờ riêng, không phải status. Một báo giá `approved` + `is_active=true` là báo giá có hiệu lực. Một báo giá `approved` + `is_active=false` là báo giá đã bị thay thế bởi báo giá mới.

### 3.2 QuoteLineType

```php
enum QuoteLineType: string
{
    case Material = 'material';   // Vật tư (CatalogItem type=material)
    case Service = 'service';     // Dịch vụ cố định (CatalogItem type=service)
    case Adhoc = 'adhoc';         // Dịch vụ tùy chọn (CatalogAdhocItem)
}
```

## 4. API Endpoints

Prefix: `/api/v1/pmc/quotes`

### 4.1 Danh sách báo giá

```
GET /api/v1/pmc/quotes
```

**Query params (ListQuoteRequest):**

| Param | Type | Mô tả |
|-------|------|-------|
| `search` | string | Tìm theo code, tên ticket |
| `status` | string | Filter theo QuoteStatus |
| `is_active` | boolean | Filter active/inactive (default: không filter) |
| `og_ticket_id` | integer | Filter theo OgTicket |
| `sort_by` | string | created_at (default), total_amount |
| `sort_direction` | string | desc (default), asc |
| `per_page` | integer | 15 (default), max 100 |

**Response:** Paginated `QuoteListResource`

```json
{
  "success": true,
  "data": [{
    "id": 1,
    "code": "QT-20260320-001",
    "status": { "value": "draft", "label": "Nháp" },
    "is_active": true,
    "og_ticket": { "id": 1, "subject": "Sửa máy lạnh" },
    "total_amount": "920000.00",
    "lines_count": 3,
    "created_at": "2026-03-20T10:00:00.000000Z"
  }]
}
```

### 4.2 Chi tiết báo giá

```
GET /api/v1/pmc/quotes/{quote}
```

**Response:** `QuoteDetailResource` (bao gồm lines)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "code": "QT-20260320-001",
    "status": { "value": "draft", "label": "Nháp" },
    "is_active": true,
    "og_ticket": { "id": 1, "subject": "Sửa máy lạnh", "requester_name": "Nguyễn Văn A" },
    "total_amount": "920000.00",
    "manager_approved_at": null,
    "manager_approved_by": null,
    "resident_approved_at": null,
    "note": null,
    "lines": [{
      "id": 1,
      "line_type": { "value": "material", "label": "Vật tư" },
      "reference_id": 3,
      "name": "Gas R32 1kg",
      "quantity": 1,
      "unit": "bình",
      "unit_price": "320000.00",
      "line_amount": "320000.00"
    }],
    "created_at": "2026-03-20T10:00:00.000000Z",
    "updated_at": "2026-03-20T10:00:00.000000Z"
  }
}
```

### 4.3 Kiểm tra báo giá active của ticket

```
GET /api/v1/pmc/quotes/check-active?og_ticket_id={id}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "has_active_quote": true,
    "active_quote": {
      "id": 5,
      "code": "QT-20260320-001",
      "status": { "value": "sent", "label": "Đã gửi" }
    }
  }
}
```

> Frontend gọi endpoint này trước khi tạo báo giá mới. Nếu `has_active_quote = true` → hiện confirm dialog.

### 4.4 Tạo báo giá

```
POST /api/v1/pmc/quotes
```

**Body (StoreQuoteRequest):**

```json
{
  "og_ticket_id": 1,
  "status": "draft",
  "note": null,
  "replace_active": true,
  "lines": [
    {
      "line_type": "material",
      "reference_id": 3,
      "name": "Gas R32 1kg",
      "quantity": 1,
      "unit": "bình",
      "unit_price": 320000
    }
  ]
}
```

**Validation:**

| Field | Rules |
|-------|-------|
| `og_ticket_id` | required, exists:og_tickets,id |
| `status` | required, in:draft,sent |
| `note` | nullable, string, max:1000 |
| `replace_active` | required_if: ticket có active quote. boolean |
| `lines` | required, array, min:1 |
| `lines.*.line_type` | required, in:material,service,adhoc |
| `lines.*.reference_id` | required, integer — validate exists theo line_type |
| `lines.*.name` | required, string, max:255 |
| `lines.*.quantity` | required, integer, min:1 |
| `lines.*.unit` | required, string, max:50 |
| `lines.*.unit_price` | required, numeric, min:0 |

**Business logic:**
1. Check ticket có active quote không.
   - Nếu có và `replace_active = false` → 422 "Ticket đã có báo giá active".
   - Nếu có và `replace_active = true` → inactive tất cả active quotes của ticket (set `is_active = false`). Laravel Auditing tự track thay đổi.
2. Tự sinh `code`: `QT-{YYYYMMDD}-{XXX}` (sequence trong ngày).
3. Tính `line_amount` = `unit_price` × `quantity` (mỗi dòng).
4. Tính `total_amount` = sum(`line_amount`) tất cả dòng.
5. Set `is_active = true`.
6. Status = giá trị từ request (`draft` hoặc `sent`).
7. Cập nhật OgTicket status → `quoted` (nếu đang ở `surveying` hoặc `assigned` hoặc `received`).

**Response:** `QuoteDetailResource` (201)

### 4.5 Cập nhật báo giá

```
PUT /api/v1/pmc/quotes/{id}
```

**Điều kiện:** Chỉ khi status = `draft` VÀ `is_active = true`.

**Body (UpdateQuoteRequest):** Tương tự StoreQuoteRequest (trừ `og_ticket_id`, `status`, `replace_active`). Lines gửi đầy đủ (replace toàn bộ).

**Business logic:**
1. Xóa lines cũ, tạo lines mới.
2. Recalculate `total_amount`.
3. Laravel Auditing tự track thay đổi.

### 4.6 Chuyển trạng thái (Transition)

```
POST /api/v1/pmc/quotes/{id}/transition
```

**Body (TransitionQuoteRequest):**

```json
{
  "status": "sent",
  "note": "Lý do từ chối (optional, chỉ dùng khi reject)"
}
```

**Validation:**

| Field | Rules |
|-------|-------|
| `status` | required, in: sent, manager_approved, approved, rejected |
| `note` | nullable, string, max:1000 |

**State machine** (định nghĩa trong `QuoteStatus::allowedTransitions()`):

| From | Allowed targets |
|------|----------------|
| draft | sent |
| sent | manager_approved, rejected |
| manager_approved | approved, rejected |
| approved | (final — không transition) |
| rejected | (final — không transition) |

**Side effects theo target status:**

| Target | Side effects |
|--------|-------------|
| sent | — |
| manager_approved | Set `manager_approved_at`, `manager_approved_by_id` (current user) |
| approved | Set `resident_approved_at`. Cập nhật OgTicket status → `approved` |
| rejected | Cập nhật `note` (nếu có) |

**Điều kiện chung:** `is_active = true`. Nếu transition không hợp lệ → 422 kèm message và context (current_status, target_status, allowed).

### 4.7 Xóa báo giá

```
DELETE /api/v1/pmc/quotes/{id}
```

**Điều kiện:** Chỉ khi status = `draft`.
**Check delete:** Quote đã gửi/duyệt → không cho xóa.

## 5. Business Rules

1. **1 active/ticket:** Mỗi OgTicket chỉ có tối đa 1 báo giá active (`is_active = true`) tại 1 thời điểm. Enforce bằng partial unique index ở DB + check ở service layer.
2. **Thay thế báo giá:** Khi tạo báo giá mới cho ticket đã có active quote → inactive quote cũ (set `is_active = false`). Laravel Auditing tự track thay đổi.
3. **Tạo chọn status:** Người dùng chọn tạo ở trạng thái `draft` (nháp) hoặc `sent` (gửi luôn cho QL duyệt).
4. **State machine:** Định nghĩa trong `QuoteStatus::allowedTransitions()`. draft → sent → manager_approved → approved. Hoặc sent/manager_approved → rejected. Chuyển trạng thái qua 1 endpoint duy nhất `POST /transition`.
5. **Edit restriction:** Chỉ sửa khi status = `draft` VÀ `is_active = true`.
6. **Delete restriction:** Chỉ xóa khi status = `draft`.
7. **Transition restriction:** Tất cả transitions yêu cầu `is_active = true`. State machine validate chuyển hợp lệ.
8. **Pricing đơn giản:** Không có khuyến mãi. `total_amount` = sum(`unit_price` × `quantity`). Server luôn tính lại — không tin client.
9. **Snapshot giá:** `name`, `unit_price` trên QuoteLine là snapshot — không thay đổi theo catalog sau khi tạo.
10. **Audit:** Quote implements `Auditable` — Laravel Auditing tự động track mọi thay đổi field (status, is_active, totals, etc.). Không cần bảng history riêng.
11. **Liên kết OgTicket:** Khi tạo báo giá → OgTicket chuyển `quoted`. Khi cư dân chấp thuận → OgTicket chuyển `approved`.

## 6. Dependencies

### 6.1 Modules sử dụng (import trực tiếp — cùng PMC)

| Module | Entity | Mục đích |
|--------|--------|----------|
| PMC/OgTicket | OgTicket | Ticket nguồn |
| PMC/Account | Account | Người tạo, người duyệt |
| PMC/Catalog | CatalogItem, CatalogAdhocItem | Reference cho QuoteLine |

> **Ghi chú:** Tất cả đều trong cùng top-level module PMC → import trực tiếp, không cần ExternalService.

## 7. Check Delete

| Entity | Cần check | Lý do |
|--------|-----------|-------|
| Quote | Có | Chỉ xóa khi draft. Nếu đã sent/approved → block |
| QuoteLine | Không riêng | Cascade delete theo Quote |

## 8. Migrations

### 8.1 create_quotes_table

```php
Schema::create('quotes', function (Blueprint $table) {
    $table->id();
    $table->string('code', 50);
    $table->foreignId('og_ticket_id')->constrained('og_tickets');
    $table->string('status', 30);
    $table->boolean('is_active')->default(true);
    $table->decimal('total_amount', 15, 2)->default(0);
    $table->timestamp('manager_approved_at')->nullable();
    $table->foreignId('manager_approved_by_id')->nullable()->constrained('accounts');
    $table->timestamp('resident_approved_at')->nullable();
    $table->text('note')->nullable();
    $table->timestamps();
    $table->softDeletes();

    $table->index('og_ticket_id');
    $table->index('status');
    $table->index('is_active');
});

// Partial unique indexes (PostgreSQL)
DB::statement('CREATE UNIQUE INDEX quotes_code_unique ON quotes (code) WHERE deleted_at IS NULL');
DB::statement('CREATE UNIQUE INDEX quotes_og_ticket_active_unique ON quotes (og_ticket_id) WHERE is_active = true AND deleted_at IS NULL');
```

### 8.2 create_quote_lines_table

```php
Schema::create('quote_lines', function (Blueprint $table) {
    $table->id();
    $table->foreignId('quote_id')->constrained('quotes')->cascadeOnDelete();
    $table->string('line_type', 30);
    $table->unsignedBigInteger('reference_id');
    $table->string('name', 255);
    $table->integer('quantity')->default(1);
    $table->string('unit', 50);
    $table->decimal('unit_price', 15, 2);
    $table->decimal('line_amount', 15, 2);
    $table->timestamps();

    $table->index('quote_id');
});
```

> **Audit:** Không cần migration riêng cho history. Laravel Auditing sử dụng bảng `audits` (đã có sẵn từ package).
