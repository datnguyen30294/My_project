# Customer - Đặc tả kỹ thuật Backend

> Module: `PMC/Customer` | Ngày tạo: 2026-04-22 | Trạng thái: Draft

## 1. Tổng quan

Submodule quản lý **danh bạ khách hàng (cư dân)** của tenant PMC. Mỗi khách = 1 cư dân, định danh bằng số điện thoại duy nhất toàn tenant. Customer là "danh bạ người" — không gắn với project hay apartment. Thông tin project/apartment chỉ gắn ở **ticket level** (snapshot tại thời điểm request).

**Mục tiêu:**
- Quản lý hồ sơ khách độc lập với ticket/order
- Tra cứu lịch sử ticket, đơn hàng, thanh toán, đánh giá của từng khách
- Ép FK cứng trên `og_tickets.customer_id` để không có ticket mồ côi

**Sibling tham khảo:** `PMC/Department`, `PMC/JobTitle` (CRUD cơ bản); `PMC/OgTicket` (snapshot pattern).

## 2. Entities

### 2.1 Customer

**Bảng:** `customers` (tenant DB)

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| Mã khách | `code` | `string(20)` | required, unique | Auto-gen `KH-00001` khi create |
| Họ tên | `full_name` | `string(255)` | required | |
| SĐT | `phone` | `string(20)` | required, unique | **Chuẩn hóa qua `PhoneNormalizer`** trước khi save |
| Email | `email` | `string(255)` | nullable | |
| Ghi chú | `note` | `text` | nullable | |
| Lần đầu liên hệ | `first_contacted_at` | `timestamp` | nullable | Set khi tạo ticket đầu tiên của khách |
| Lần gần nhất liên hệ | `last_contacted_at` | `timestamp` | nullable | Update mỗi lần có ticket mới |
| Người tạo | `created_by` | `unsignedBigInteger` | nullable | Auditable |
| Người cập nhật | `updated_by` | `unsignedBigInteger` | nullable | Auditable |
| Người xóa | `deleted_by` | `unsignedBigInteger` | nullable | Auditable |
| Ngày tạo/cập nhật | `created_at`, `updated_at` | `timestamp` | auto | |
| Ngày xóa | `deleted_at` | `timestamp` | nullable | SoftDeletes |

**Indexes:**
- `UNIQUE(phone)` — partial unique cho soft delete: `WHERE deleted_at IS NULL`
- `UNIQUE(code)` — partial unique cho soft delete
- `INDEX(full_name)` — search

**Model traits/contracts:**
- Extends `App\Common\Models\BaseModel`
- Implements `OwenIt\Auditing\Contracts\Auditable` + uses `\OwenIt\Auditing\Auditable` trait
- Uses `SoftDeletes`

**Mutators:**
- `setPhoneAttribute($value)` → gọi `PhoneNormalizer::normalize($value)` trước khi assign

**Relationships:**
- `ogTickets()` → `hasMany(OgTicket::class, 'customer_id')`

**Scopes:**
- `scopeSearch(string $keyword)` — match `full_name` OR `phone` OR `email` hoặc `code`

### 2.2 Alter `og_tickets` (thêm snapshot link)

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| Khách hàng | `customer_id` | `unsignedBigInteger` | **required**, FK → `customers.id` ON DELETE RESTRICT | Liên kết cứng đến khách |

**Giữ nguyên** các cột `requester_name`, `requester_phone`, `apartment_name` làm **snapshot** (giá trị tại thời điểm tạo ticket).

**Index:** `INDEX(customer_id)`.

**Model update:** `OgTicket` thêm relation:
```php
public function customer(): BelongsTo
{
    return $this->belongsTo(Customer::class, 'customer_id');
}
```

Bổ sung `customer_id` vào `$fillable`.

## 3. Support Class: PhoneNormalizer

**Path:** `backend/app/Common/Support/PhoneNormalizer.php`

```php
namespace App\Common\Support;

class PhoneNormalizer
{
    /**
     * Chuẩn hóa SĐT Việt Nam:
     * - Strip space, dấu chấm, dấu gạch
     * - +84xxx → 0xxx
     * - 84xxx (không có +) → 0xxx
     * - Giữ nguyên digits
     * Trả về chuỗi đã normalize. Nếu input rỗng/null → trả về chuỗi rỗng.
     */
    public static function normalize(?string $raw): string;
}
```

**Rule normalize:**
1. Nếu null/rỗng → `''`
2. Strip tất cả ký tự không phải digit + dấu `+`: `preg_replace('/[^0-9+]/', '', $raw)`
3. Nếu bắt đầu bằng `+84` → thay bằng `0`
4. Nếu bắt đầu bằng `84` và độ dài ≥ 10 → thay prefix `84` bằng `0`
5. Trả về kết quả

**Áp dụng:** `Customer::setPhoneAttribute` (duy nhất 1 chỗ — bảng og_tickets dùng snapshot từ Customer đã normalize).

## 4. API Endpoints

Prefix: `/api/v1/pmc`

| Action | Method | URL | Request Class | Mô tả |
|--------|--------|-----|---------------|-------|
| List | GET | `/customers` | `ListCustomerRequest` | Paginated + search |
| Show | GET | `/customers/{id}` | — | Detail + aggregates |
| Create | POST | `/customers` | `CreateCustomerRequest` | |
| Update | PUT | `/customers/{id}` | `UpdateCustomerRequest` | |
| Check Delete | GET | `/customers/{id}/check-delete` | — | Kiểm tra xóa được không (ticket/order) |
| Delete | DELETE | `/customers/{id}` | — | Soft delete (sau khi check pass) |
| Tickets của khách | GET | `/customers/{id}/tickets` | `ListCustomerTicketsRequest` | Paginated list OgTicket |
| Đơn hàng của khách | GET | `/customers/{id}/orders` | `ListCustomerOrdersRequest` | Paginated list Order + receivable status |
| Thanh toán của khách | GET | `/customers/{id}/payments` | `ListCustomerPaymentsRequest` | Paginated list PaymentReceipt |

**Registration trong `backend/app/Modules/PMC/routes/api.php`:**
```php
Route::get('customers/{id}/check-delete', [CustomerController::class, 'checkDelete']);
Route::get('customers/{id}/tickets', [CustomerController::class, 'tickets']);
Route::get('customers/{id}/orders', [CustomerController::class, 'orders']);
Route::get('customers/{id}/payments', [CustomerController::class, 'payments']);
Route::apiResource('customers', CustomerController::class)->parameters(['customers' => 'id']);
```

## 5. Validation Rules

### 5.1 `CreateCustomerRequest`

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `full_name` | `required, string, max:255` | "Họ tên là bắt buộc", "Họ tên không được vượt quá 255 ký tự" |
| `phone` | `required, string, max:20, unique:customers,phone` | "Số điện thoại là bắt buộc", "Số điện thoại đã tồn tại" |
| `email` | `nullable, email, max:255` | "Email không hợp lệ" |
| `note` | `nullable, string, max:2000` | "Ghi chú không được vượt quá 2000 ký tự" |

> `code` **không** nhận từ request — auto-gen trong Observer.
> `phone` normalize trong `prepareForValidation()` trước khi check unique (để tránh tạo duplicate do format khác nhau).

### 5.2 `UpdateCustomerRequest`

Tương tự Create, nhưng:
- `phone` rule: `unique:customers,phone,{id}` để loại trừ chính nó.
- Tất cả field đều `sometimes` (optional khi update 1 phần).

### 5.3 `ListCustomerRequest`

| Field | Rules | Mô tả |
|-------|-------|------|
| `search` | `nullable, string, max:255` | Search theo tên/SĐT/email/code |
| `per_page` | `nullable, integer, min:1, max:100` | Default 10 |
| `page` | `nullable, integer, min:1` | |
| `sort_by` | `nullable, in:created_at,last_contacted_at,full_name` | Default `last_contacted_at` |
| `sort_direction` | `nullable, in:asc,desc` | Default `desc` |

### 5.4 `ListCustomerTicketsRequest` / `ListCustomerOrdersRequest` / `ListCustomerPaymentsRequest`

Chỉ `per_page`, `page`, `sort_direction`. Nhẹ.

## 6. Business Rules

- [ ] `code` tự sinh theo pattern `KH-{padded 5 digits}` (`KH-00001`). Trong `CustomerObserver::created`: `$customer->code = 'KH-' . str_pad($customer->id, 5, '0', STR_PAD_LEFT); $customer->saveQuietly();`.
- [ ] Phone luôn được normalize trước khi save (qua mutator).
- [ ] Khi check unique phone (validation layer), phải normalize input trước khi query DB — vì trong DB lưu normalized.
- [ ] **Không cho xóa** customer khi còn liên kết:
  - `OgTicketRepository::existsByCustomer($id)` → `true` → block
  - Có order qua chain `quote.og_ticket.customer_id = $id` → block
- [ ] `first_contacted_at` set 1 lần duy nhất khi ticket đầu tiên được gán cho khách.
- [ ] `last_contacted_at` update mỗi lần tạo ticket mới gán cho khách (trong `OgTicketService::create` hoặc listener).
- [ ] Khi tạo ticket từ tenant UI, `customer_id` required. Service snapshot `requester_name` = `customer.full_name`, `requester_phone` = `customer.phone` vào og_ticket.
- [ ] Khi claim ticket từ Platform pool (`OgTicketService::claim`), find-or-create customer theo `requester_phone` đã normalize, rồi gán `customer_id` + snapshot fields.

## 7. Presenter Output

### 7.1 `CustomerListResource`

```json
{
  "id": 1,
  "code": "KH-00001",
  "full_name": "Nguyễn Văn A",
  "phone": "0912345678",
  "email": "a@example.com",
  "first_contacted_at": "2026-04-01T10:00:00+07:00",
  "last_contacted_at": "2026-04-22T08:30:00+07:00",
  "ticket_count": 5,
  "avg_rating": 4.2
}
```

### 7.2 `CustomerDetailResource`

```json
{
  "id": 1,
  "code": "KH-00001",
  "full_name": "Nguyễn Văn A",
  "phone": "0912345678",
  "email": "a@example.com",
  "note": "Khách VIP",
  "first_contacted_at": "2026-04-01T10:00:00+07:00",
  "last_contacted_at": "2026-04-22T08:30:00+07:00",
  "aggregates": {
    "ticket_count": 5,
    "ticket_by_status": {
      "received": 1,
      "in_progress": 2,
      "completed": 2
    },
    "avg_rating": 4.2,
    "rating_count": 3,
    "order_count": 3,
    "total_paid": "12500000.00",
    "total_outstanding": "3000000.00"
  }
}
```

### 7.3 `CustomerTicketItemResource` (endpoint `/customers/{id}/tickets`)

```json
{
  "id": 101,
  "code": "TK-001",
  "subject": "Hỏng điều hòa",
  "status": { "value": "completed", "label": "Hoàn thành" },
  "priority": { "value": "normal", "label": "Bình thường" },
  "project": { "id": 3, "name": "Vinhomes S1" },
  "apartment_name": "S1-1205",
  "received_at": "2026-04-01T10:00:00+07:00",
  "completed_at": "2026-04-03T16:00:00+07:00",
  "resident_rating": 5,
  "resident_rating_comment": "Rất hài lòng"
}
```

### 7.4 `CustomerOrderItemResource`

```json
{
  "id": 55,
  "code": "ORD-001",
  "status": { "value": "completed", "label": "Hoàn thành" },
  "total_amount": "5000000.00",
  "completed_at": "2026-04-03T16:00:00+07:00",
  "ticket": { "id": 101, "subject": "Hỏng điều hòa" },
  "receivable": {
    "id": 40,
    "status": { "value": "partial", "label": "Thu một phần" },
    "paid_amount": "2000000.00",
    "outstanding_amount": "3000000.00"
  }
}
```

### 7.5 `CustomerPaymentItemResource`

```json
{
  "id": 120,
  "code": "PR-001",
  "amount": "2000000.00",
  "received_at": "2026-04-05T09:00:00+07:00",
  "payment_method": { "value": "bank_transfer", "label": "Chuyển khoản" },
  "order": { "id": 55, "code": "ORD-001" },
  "ticket": { "id": 101, "subject": "Hỏng điều hòa" }
}
```

## 8. Cross-Module Dependencies

**Module hiện tại: PMC. Các submodule tham chiếu NẰM TRONG cùng PMC module → import trực tiếp, KHÔNG dùng ExternalService** (theo feedback memory `feedback_external_service_scope`).

| Dependency | Submodule nguồn | Cách dùng |
|-----------|-----------------|-----------|
| `OgTicket` | `PMC/OgTicket` | Inject `OgTicketRepository` vào `CustomerRepository` / `CustomerService` để query tickets & aggregate |
| `Order` | `PMC/Order` | Inject `OrderRepository` để query orders qua chain ticket.customer_id |
| `Receivable` + `PaymentReceipt` | `PMC/Receivable` | Inject `ReceivableRepository` hoặc dùng query join trong `CustomerRepository` |

**ExternalService KHÔNG áp dụng** — chỉ dùng giữa Platform ↔ PMC.

## 9. Migration Preview

**File duy nhất:** `backend/database/migrations/tenant/2026_04_23_000001_create_customers_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('code', 20);
            $table->string('full_name', 255);
            $table->string('phone', 20);
            $table->string('email', 255)->nullable();
            $table->text('note')->nullable();
            $table->timestamp('first_contacted_at')->nullable();
            $table->timestamp('last_contacted_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('full_name');
        });

        // Partial unique indexes (PostgreSQL) — pattern project cho soft delete
        DB::statement('CREATE UNIQUE INDEX customers_phone_unique ON customers (phone) WHERE deleted_at IS NULL');
        DB::statement('CREATE UNIQUE INDEX customers_code_unique ON customers (code) WHERE deleted_at IS NULL');

        Schema::table('og_tickets', function (Blueprint $table) {
            $table->unsignedBigInteger('customer_id')->after('id'); // NOT NULL
            $table->foreign('customer_id')
                ->references('id')->on('customers')
                ->restrictOnDelete();
            $table->index('customer_id');
        });
    }

    public function down(): void
    {
        Schema::table('og_tickets', function (Blueprint $table) {
            $table->dropForeign(['customer_id']);
            $table->dropIndex(['customer_id']);
            $table->dropColumn('customer_id');
        });

        DB::statement('DROP INDEX IF EXISTS customers_phone_unique');
        DB::statement('DROP INDEX IF EXISTS customers_code_unique');
        Schema::dropIfExists('customers');
    }
};
```

> **Lưu ý:** `og_tickets.customer_id` NOT NULL → nếu đã có seed data trong `og_tickets`, cần seed customers trước khi migrate; hoặc chia migration: tạo customer_id nullable → backfill seed → alter set NOT NULL. Vì user đã confirm chưa có data prod, giữ 1 migration và truncate/re-seed test data.

## 10. CustomerRepository Methods (aggregate)

```php
class CustomerRepository extends BaseRepository
{
    public function __construct(
        Customer $model,
        protected OgTicketRepository $ogTicketRepository,
    ) {
        parent::__construct($model);
    }

    public function list(array $filters): LengthAwarePaginator;
    public function findByPhone(string $normalizedPhone): ?Customer;
    public function findOrCreateByPhone(string $phone, string $fullName): Customer;

    /** @return array{ticket_count: int, ticket_by_status: array<string, int>, avg_rating: float|null, rating_count: int, order_count: int, total_paid: string, total_outstanding: string} */
    public function getAggregates(int $customerId): array;

    public function listTickets(int $customerId, array $filters): LengthAwarePaginator;
    public function listOrders(int $customerId, array $filters): LengthAwarePaginator;
    public function listPayments(int $customerId, array $filters): LengthAwarePaginator;
}
```

## 11. CustomerService Methods

```php
class CustomerService extends BaseService implements CustomerServiceInterface
{
    public function __construct(
        protected CustomerRepository $repository,
        protected OgTicketRepository $ogTicketRepository, // check delete
    ) {}

    public function list(array $filters): LengthAwarePaginator;
    public function findById(int $id): Customer;
    public function getDetailWithAggregates(int $id): array; // {customer, aggregates}
    public function create(array $data): Customer;
    public function update(int $id, array $data): Customer;
    public function delete(int $id): void; // check + soft delete
    public function checkDelete(int $id): array; // {can_delete: bool, reasons: string[]}

    public function findOrCreateByPhone(string $phone, string $fullName): Customer;
    public function markContacted(Customer $customer): void; // set first/last contacted
}
```

## 12. Tích hợp với luồng tạo OgTicket

Tenant **KHÔNG có form tạo ticket từ operator UI**. OgTicket vào tenant DB qua 2 path:

### 12.1 Path A — Cư dân submit qua tenant subdomain (`tnp.residential.test/ticket`)

**File bị ảnh hưởng:** `backend/app/Modules/Platform/src/Ticket/ExternalServices/OgTicketExternalService.php` (method `createFromTicket`, dòng ~30)

Flow hiện tại:
- `Platform\TicketService::submit()` nhận data từ form landing → `resolveCustomer()` tạo/cập nhật `Platform\Customer` (central) → tạo `Ticket` (central) → nếu có `claimed_by_org_id` thì gọi `OgTicketExternalService::createFromTicket($ticket)` → chạy trong `$tenant->run(fn() => OgTicket::create(...))`.

Cập nhật `createFromTicket`:
```php
$tenant->run(function () use ($ticket): void {
    $customerService = app(\App\Modules\PMC\Customer\Contracts\CustomerServiceInterface::class);
    $customer = $customerService->findOrCreateByPhone(
        $ticket->requester_phone,
        $ticket->requester_name,
    );

    $ogTicket = OgTicket::create([
        'ticket_id' => $ticket->id,
        'customer_id' => $customer->id,           // ← NEW required
        'requester_name' => $ticket->requester_name,
        'requester_phone' => $ticket->requester_phone,
        'subject' => $ticket->subject,
        // ... các field snapshot khác giữ nguyên
    ]);

    $customerService->markContacted($customer);
    // ... attachCategoriesFromSubject giữ nguyên
});
```

### 12.2 Path B — Operator tenant claim ticket từ Pool

**File bị ảnh hưởng:** `backend/app/Modules/PMC/src/OgTicket/Services/OgTicketService.php` (method `claim`)

Hiện tại:
```php
$this->repository->create([
    'ticket_id' => $ticketId,
    'requester_name' => $ticketData['requester_name'],
    'requester_phone' => $ticketData['requester_phone'],
    ...
]);
```

Cập nhật:
```php
$customer = $this->customerService->findOrCreateByPhone(
    $ticketData['requester_phone'],
    $ticketData['requester_name'],
);

$this->repository->create([
    'ticket_id' => $ticketId,
    'customer_id' => $customer->id,           // ← NEW required
    'requester_name' => $ticketData['requester_name'],
    'requester_phone' => $ticketData['requester_phone'],
    ...
]);

$this->customerService->markContacted($customer);
```

Inject `CustomerServiceInterface` vào `OgTicketService::__construct`.

### 12.3 Lưu ý phân biệt với `Platform\Customer`

| | `Platform\Customer` | `PMC\Customer` (module này) |
|---|---|---|
| DB | Central | Tenant |
| Scope | Global (cross-tenant) | Per-tenant |
| Dùng để | Email notification, lịch sử cross-tenant | Danh bạ khách, aggregate ticket/order/payment của tenant |
| Tạo khi | `TicketService::submit` (central) | `findOrCreateByPhone` trong tenant context (cả Path A lẫn B) |

Cùng 1 cư dân (SĐT `0912xxx`) có thể có 1 record Platform + 1 record PMC mỗi tenant. Không conflict.

## 13. File cần tạo

**Path base:** `backend/app/Modules/PMC/src/Customer/`

```
Customer/
├── Contracts/
│   └── CustomerServiceInterface.php
├── Controllers/
│   └── CustomerController.php
├── Models/
│   └── Customer.php
├── Observers/
│   └── CustomerObserver.php          # Set code sau khi created
├── Repositories/
│   └── CustomerRepository.php
├── Requests/
│   ├── CreateCustomerRequest.php
│   ├── UpdateCustomerRequest.php
│   ├── ListCustomerRequest.php
│   ├── ListCustomerTicketsRequest.php
│   ├── ListCustomerOrdersRequest.php
│   └── ListCustomerPaymentsRequest.php
├── Resources/
│   ├── CustomerListResource.php
│   ├── CustomerDetailResource.php
│   ├── CustomerTicketItemResource.php
│   ├── CustomerOrderItemResource.php
│   └── CustomerPaymentItemResource.php
└── Services/
    └── CustomerService.php
```

**Files khác:**
- `backend/app/Common/Support/PhoneNormalizer.php`
- `backend/database/migrations/tenant/2026_04_23_000001_create_customers_table.php`
- `backend/database/factories/Tenant/CustomerFactory.php`
- `backend/database/seeders/Tenant/CustomerSeeder.php` (optional, dev data)

**Files cần sửa:**
- `backend/app/Modules/PMC/Providers/PMCServiceProvider.php` — bind `CustomerServiceInterface` → `CustomerService`, register observer
- `backend/app/Modules/PMC/routes/api.php` — thêm routes
- `backend/app/Modules/PMC/src/OgTicket/Models/OgTicket.php` — thêm `customer_id` vào `$fillable`, relation `customer()`
- `backend/app/Modules/PMC/src/OgTicket/Services/OgTicketService.php` — inject `CustomerServiceInterface`, update `claim`
- `backend/app/Modules/PMC/src/OgTicket/Resources/OgTicketDetailResource.php` — expose `customer` object (id, code, full_name, phone)
- `backend/composer.json` PSR-4 autoload — thêm mapping nếu pattern chưa auto-cover submodule mới

## 14. Checklist triển khai BE

**Phase 1 - Foundation:**
- [ ] Tạo `PhoneNormalizer` + unit test (6 input formats)
- [ ] Tạo migration `create_customers_table` (gồm cả alter og_tickets)
- [ ] Tạo `Customer` model + factory + observer (auto-gen code)
- [ ] Tạo `CustomerRepository` (list, findByPhone, findOrCreateByPhone)
- [ ] Tạo `CustomerService` + `CustomerServiceInterface`
- [ ] Bind interface trong `PMCServiceProvider`
- [ ] PSR-4 mapping (nếu cần)

**Phase 2 - API CRUD:**
- [ ] Tạo 3 Requests (Create/Update/List)
- [ ] Tạo 2 Resources (List/Detail)
- [ ] Tạo `CustomerController` (index, show, store, update, destroy, checkDelete)
- [ ] Register routes
- [ ] Feature test CRUD (happy + validation + unique phone)

**Phase 3 - Aggregate endpoints:**
- [ ] `CustomerRepository::getAggregates` (count tickets by status, avg rating, order/payment sum)
- [ ] `listTickets`, `listOrders`, `listPayments` trong Repository
- [ ] 3 Resources: Ticket/Order/Payment item
- [ ] Controller methods: `tickets`, `orders`, `payments`
- [ ] Feature test từng endpoint

**Phase 4 - Delete guard:**
- [ ] `OgTicketRepository::existsByCustomer($id)` method
- [ ] `OrderRepository::existsByCustomer($id)` (qua chain) method
- [ ] `CustomerService::checkDelete` + `delete` với BusinessException
- [ ] Feature test: block delete khi có ticket; block khi có order; OK khi empty

**Phase 5 - Tích hợp OgTicket:**
- [ ] Alter `OgTicket` model: fillable + relation `customer()`
- [ ] Cập nhật `OgTicketService::claim` dùng `findOrCreateByPhone`
- [ ] Cập nhật `OgTicketDetailResource` expose customer
- [ ] (Nếu có) `CreateOgTicketRequest` + `OgTicketService::createFromUi`
- [ ] Update `OgTicketFactory` để tạo kèm customer
- [ ] Feature test claim → customer tự tạo / match đúng

**Phase 6 - Finalize:**
- [ ] `make format` + `make lint`
- [ ] Chạy toàn bộ test module PMC
- [ ] `scramble:export` nếu dùng (API docs)

## 15. Test cases cần cover

**Unit/Feature BE:**
- [ ] PhoneNormalizer: `0912345678`, `+84912345678`, `84912345678`, `0912 345 678`, `0912-345-678`, `(+84) 912.345.678` → tất cả ra `0912345678`
- [ ] Create customer → auto-gen code `KH-00001`, `KH-00002`...
- [ ] Create customer với phone format khác nhau → đều normalize về 1 format, unique block duplicate
- [ ] Update customer phone → normalize
- [ ] List customer: search by name / phone / code
- [ ] Detail customer: aggregates đúng (seed sẵn tickets + orders + payments)
- [ ] Delete blocked khi có ticket
- [ ] Delete blocked khi có order (qua quote→ticket)
- [ ] Delete OK khi không có gì
- [ ] Claim ticket với phone mới → tự tạo customer
- [ ] Claim ticket với phone đã có → reuse customer, update last_contacted_at

## 16. Rủi ro & lưu ý

- **Duplicate code race**: dùng observer `created` + `str_pad($model->id, 5, '0', STR_PAD_LEFT)` (đã sau save, id unique → không race).
- **Unique phone race**: 2 request cùng phone cùng lúc → 1 fail ở DB level (partial unique index). Service catch `QueryException` re-throw `BusinessException`.
- **OgTicket seed/factory**: phải luôn tạo customer trước, KHÔNG để customer_id null.
- **Cascade rule**: `og_tickets.customer_id` ON DELETE RESTRICT — hard delete customer sẽ bị DB block (đúng ý đồ).
- **Platform Customer conflict**: trên tenant cũng có ref `App\Modules\Platform\Customer\Models\Customer` (central). Không cùng concept — tenant Customer thuộc tenant DB: `App\Modules\PMC\Customer\Models\Customer`.
