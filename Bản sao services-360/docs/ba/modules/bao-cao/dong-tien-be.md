# Báo cáo Dòng tiền - Đặc tả kỹ thuật Backend

> Module: `PMC/Report/CashFlow` | Ngày tạo: 2026-04-13 | Trạng thái: Draft

## 1. Tổng quan

Báo cáo Dòng tiền là tính năng **read-only**, tổng hợp dữ liệu từ `cash_transactions` (module Treasury) để hiển thị tình hình tiền vào/ra ở mức quản trị. Không tạo bảng/model mới — chỉ thêm Service + Controller + Resource để aggregate và trả về dữ liệu.

`Report` là **submodule của PMC** (tenant), chứa tất cả báo cáo. `CashFlow` là submodule con, cùng cấp với `Sla`. Vì cùng PMC → import trực tiếp Model/Repository, **không cần ExternalService**.

**Data source:**

| Bảng | Mục đích |
|------|----------|
| `cash_transactions` | Dữ liệu chính: `direction`, `amount`, `category`, `transaction_date`, `order_id`, `note` |
| `cash_accounts` | Tài khoản quỹ: `opening_balance`, `is_active` |
| `orders` | Join để lấy `project_id` từ `cash_transactions.order_id` |
| `projects` | Tên dự án |

**Mối quan hệ CashTransaction → Project:**

```
cash_transactions.order_id → orders.id → orders.project_id → projects.id
```

> Giao dịch thủ công (manual_topup, manual_withdraw) không có `order_id` → không thuộc dự án cụ thể.

**So sánh với Treasury Summary (đã có):**

| | Treasury Summary | Cash Flow Report |
|---|---|---|
| Endpoint | `/api/v1/pmc/treasury/summary` | `/api/v1/pmc/reports/cashflow/*` |
| Mục đích | KPI vận hành cho quỹ | Báo cáo quản trị dòng tiền |
| Lọc project | Không | Có |
| Aggregation ngày | Không | Có (daily) |
| Danh sách giao dịch | Có (riêng endpoint) | Có (paginated, gọn hơn) |
| Sử dụng bởi | Trang Quản lý quỹ | Trang Báo cáo |

## 2. Entities

**Không tạo entity/table mới cho báo cáo.** Feature này đọc từ các bảng đã có trong module Treasury.

## 3. API Endpoints

| Action | Method | URL | Request Class | Mô tả |
|--------|--------|-----|---------------|-------|
| Summary KPI | GET | `/api/v1/pmc/reports/cashflow/summary` | `CashFlowReportRequest` | KPI tổng hợp + breakdown theo category |
| Theo ngày | GET | `/api/v1/pmc/reports/cashflow/daily` | `CashFlowReportRequest` | Aggregation tiền vào/ra theo từng ngày |
| Danh sách giao dịch | GET | `/api/v1/pmc/reports/cashflow/transactions` | `CashFlowReportRequest` | Danh sách chi tiết giao dịch, có phân trang |

> Tất cả endpoint dùng chung `CashFlowReportRequest` vì filter giống nhau.

## 4. Validation Rules

### CashFlowReportRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `project_id` | `nullable`, `integer`, `exists:projects,id` | Dự án không tồn tại |
| `date_from` | `nullable`, `date_format:Y-m-d` | Ngày bắt đầu không đúng định dạng |
| `date_to` | `nullable`, `date_format:Y-m-d`, `after_or_equal:date_from` | Ngày kết thúc phải >= ngày bắt đầu |
| `per_page` | `nullable`, `integer`, `min:1`, `max:100` | Số bản ghi/trang (chỉ dùng cho transactions, default: 15) |

> Nếu không truyền `date_from`/`date_to`, mặc định lấy 30 ngày gần nhất.

## 5. Business Rules

### 5.1 Scope dữ liệu

- Chỉ đọc **giao dịch chưa bị xóa** (excludes soft-deleted) — dùng default scope.
- Luôn sử dụng **tài khoản quỹ mặc định** (default cash account). Report này không cần filter theo cash_account.

### 5.2 Lọc theo dự án (project_id)

Khi `project_id` được truyền:
- Chỉ lấy giao dịch có `order_id` → join `orders` → `orders.project_id = {project_id}`.
- **Giao dịch thủ công** (manual_topup, manual_withdraw) **không có order_id** → **bị loại ra** khi lọc theo dự án.

Khi không truyền `project_id`:
- Lấy tất cả giao dịch (bao gồm cả giao dịch thủ công không thuộc dự án).

### 5.3 Lọc theo khoảng ngày

- Lọc trên `cash_transactions.transaction_date`.
- Nếu không truyền → default 30 ngày gần nhất:
  - `date_from` = today - 30 days
  - `date_to` = today

### 5.4 Công thức tính KPI (Summary)

**Tổng tiền vào (`total_inflow`):**
```
SUM(amount) WHERE direction = 'inflow' AND trong khoảng ngày AND (project filter nếu có)
```

**Tổng tiền ra (`total_outflow`):**
```
SUM(amount) WHERE direction = 'outflow' AND trong khoảng ngày AND (project filter nếu có)
```

**Dòng tiền ròng (`net_flow`):**
```
total_inflow - total_outflow
```

**Số dư hiện tại (`current_balance`):**
```
opening_balance + SUM(all inflow) - SUM(all outflow)
```
> Số dư tính trên TOÀN BỘ giao dịch (không filter project, không filter date). Luôn phản ánh số dư thực tế của tài khoản quỹ.

**Số giao dịch (`transaction_count`):**
```
COUNT(*) trong scope filter
```

### 5.5 Breakdown theo category

Nhóm theo `category`, chia thành 2 mảng:

- `inflow_by_category[]`: Các category có direction = inflow
- `outflow_by_category[]`: Các category có direction = outflow

Mỗi phần tử: `{ category: { value, label }, amount, count }`.

### 5.6 Aggregation theo ngày (Daily)

Nhóm theo `transaction_date`, mỗi ngày:

| Output field | Tính từ |
|--------------|---------|
| `date` | `transaction_date` (format: `Y-m-d`) |
| `total_inflow` | `SUM(amount WHERE direction = inflow)` |
| `total_outflow` | `SUM(amount WHERE direction = outflow)` |
| `net` | `total_inflow - total_outflow` |

Sắp xếp: `date DESC` (ngày mới nhất trước).

### 5.7 Danh sách giao dịch (Transactions)

Danh sách chi tiết, phân trang (default 15/page), sắp xếp `transaction_date DESC, id DESC`.

Mỗi giao dịch:

| Output field | Tính từ |
|--------------|---------|
| `id` | `cash_transactions.id` |
| `code` | `cash_transactions.code` |
| `transaction_date` | `cash_transactions.transaction_date` (format: `Y-m-d`) |
| `direction` | `{ value, label }` — enum CashTransactionDirection |
| `category` | `{ value, label }` — enum CashTransactionCategory |
| `amount` | `cash_transactions.amount` (decimal, 2 chữ số) |
| `project_name` | `order.project.name` — nullable, nếu không có order → `null` |
| `order_code` | `order.code` — nullable |
| `note` | `cash_transactions.note` — nullable |

### 5.8 Period label

Trả về label mô tả khoảng thời gian đang xem. VD:
- `"30 ngày gần nhất"` (khi dùng default)
- `"01/03/2026 - 31/03/2026"` (khi truyền date_from/date_to)

## 6. Resource Output

### 6.1 Summary Response

```json
{
  "success": true,
  "data": {
    "period_label": "30 ngày gần nhất",
    "current_balance": "285750000.00",
    "total_inflow": "198500000.00",
    "total_outflow": "72300000.00",
    "net_flow": "126200000.00",
    "transaction_count": 53,
    "inflow_by_category": [
      {
        "category": { "value": "receivable_collection", "label": "Thu công nợ" },
        "amount": "152000000.00",
        "count": 38
      },
      {
        "category": { "value": "manual_topup", "label": "Nạp tiền thủ công" },
        "amount": "35500000.00",
        "count": 5
      }
    ],
    "outflow_by_category": [
      {
        "category": { "value": "commission_payout", "label": "Chi hoa hồng" },
        "amount": "38500000.00",
        "count": 12
      },
      {
        "category": { "value": "advance_payment_payout", "label": "Chi tiền ứng vật tư" },
        "amount": "22800000.00",
        "count": 8
      },
      {
        "category": { "value": "customer_refund", "label": "Hoàn tiền khách" },
        "amount": "7200000.00",
        "count": 3
      },
      {
        "category": { "value": "manual_withdraw", "label": "Rút tiền thủ công" },
        "amount": "3800000.00",
        "count": 2
      }
    ]
  }
}
```

### 6.2 Daily Response

```json
{
  "success": true,
  "data": [
    {
      "date": "2026-04-10",
      "total_inflow": "5200000.00",
      "total_outflow": "1800000.00",
      "net": "3400000.00"
    },
    {
      "date": "2026-04-09",
      "total_inflow": "8500000.00",
      "total_outflow": "3200000.00",
      "net": "5300000.00"
    }
  ]
}
```

### 6.3 Transactions Response (paginated)

```json
{
  "success": true,
  "data": [
    {
      "id": 142,
      "code": "IN-2026-0038",
      "transaction_date": "2026-04-10",
      "direction": { "value": "inflow", "label": "Tiền vào" },
      "category": { "value": "receivable_collection", "label": "Thu công nợ" },
      "amount": "5200000.00",
      "project_name": "TNP Riverside",
      "order_code": "DH-2026-0045",
      "note": null
    },
    {
      "id": 141,
      "code": "OUT-2026-0012",
      "transaction_date": "2026-04-10",
      "direction": { "value": "outflow", "label": "Tiền ra" },
      "category": { "value": "manual_withdraw", "label": "Rút tiền thủ công" },
      "amount": "1800000.00",
      "project_name": null,
      "order_code": null,
      "note": "Rút tiền chi phí văn phòng"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 53
  }
}
```

> Enum fields dùng format `{ value, label }` theo convention dự án.

## 7. Dependencies (cùng PMC — import trực tiếp)

**Không cần ExternalService** — `Report` là submodule trong PMC, import trực tiếp Model/Repository của các submodule anh em.

| Bảng | SubModule | Cách truy cập |
|------|-----------|--------------|
| `cash_transactions` | `PMC/Treasury` | Import trực tiếp Model |
| `cash_accounts` | `PMC/Treasury` | Import trực tiếp Model + Repository (cho `computeBalance`) |
| `orders` | `PMC/Order` | Qua relationship `CashTransaction::order()` |
| `projects` | `PMC/Project` | Qua relationship `Order::project()` (chain: `cash_transaction → order → project`) |

## 8. Cấu trúc SubModule

```
app/Modules/PMC/src/Report/
└── CashFlow/
    ├── Controllers/
    │   └── CashFlowReportController.php
    ├── Contracts/
    │   └── CashFlowReportServiceInterface.php
    ├── Services/
    │   └── CashFlowReportService.php
    ├── Repositories/
    │   └── CashFlowReportRepository.php
    ├── Requests/
    │   └── CashFlowReportRequest.php
    └── Resources/
        ├── CashFlowSummaryResource.php
        ├── CashFlowDailyResource.php
        └── CashFlowTransactionResource.php
```

> Đặt trong `PMC/src/Report/CashFlow/` — submodule con, cùng cấp với `Sla`.
> Không tạo Model, Migration, Factory, Seeder — feature read-only.
> Service binding đăng ký trong `PMCServiceProvider`.

## 9. Routes

```php
// app/Modules/PMC/routes/api.php (thêm vào group reports hiện có)
Route::prefix('reports/cashflow')->group(function (): void {
    Route::get('/summary', [CashFlowReportController::class, 'summary']);
    Route::get('/daily', [CashFlowReportController::class, 'daily']);
    Route::get('/transactions', [CashFlowReportController::class, 'transactions']);
});
```

> Dùng chung file routes của PMC (đã có middleware `tenant` + `auth:sanctum`).
> URL đầy đủ: `/api/v1/pmc/reports/cashflow/...`.

## 10. Permission

Dùng permission: `treasury.view` — ai xem được quỹ thì xem được báo cáo dòng tiền.

> Sau này nếu cần tách quyền riêng, tạo `reports.cashflow.view`.

## 11. Ghi chú kỹ thuật

### 11.1 Performance

- Query aggregate dùng **Query Builder** trong Repository, không dùng Eloquent collection.
- Cho daily aggregation: `GROUP BY transaction_date` trực tiếp trong SQL.
- Project filter: `JOIN orders ON cash_transactions.order_id = orders.id WHERE orders.project_id = ?`.
- Nếu data lớn, cân nhắc cache Redis (TTL 5 phút).

### 11.2 Tận dụng logic Treasury

- `CashFlowReportRepository` sẽ query trực tiếp trên `CashTransaction` model (import từ Treasury).
- Để lấy `current_balance`, inject `CashTransactionRepository` từ Treasury hoặc tự tính lại.
- **Không gọi TreasuryService** từ Report Service — tránh coupling chặt. Query trực tiếp model.

### 11.3 Số dư (current_balance)

`current_balance` tính trên toàn bộ giao dịch (không filter) vì phản ánh số dư thực tế tài khoản quỹ:
```
current_balance = cash_accounts.opening_balance + SUM(inflow) - SUM(outflow)
```

### 11.4 Amount format

Amount trả về dạng string decimal 2 chữ số (`"198500000.00"`) — consistent với Treasury KPI hiện có. FE sẽ format hiển thị (VD: `198.500.000 đ`).

## 12. Checklist triển khai BE

- [ ] SubModule structure: `app/Modules/PMC/src/Report/CashFlow/`
- [ ] `CashFlowReportRepository` — aggregate queries (Query Builder)
- [ ] `CashFlowReportService` implements `CashFlowReportServiceInterface`
- [ ] `CashFlowReportRequest` — validation rules
- [ ] Resources: `CashFlowSummaryResource`, `CashFlowDailyResource`, `CashFlowTransactionResource`
- [ ] `CashFlowReportController` — 3 endpoints
- [ ] Binding trong `PMCServiceProvider`
- [ ] Routes trong `PMC/routes/api.php`
- [ ] PSR-4 mapping trong `composer.json`
- [ ] Tests: feature tests cho mỗi endpoint
- [ ] `make format` + `make lint`
