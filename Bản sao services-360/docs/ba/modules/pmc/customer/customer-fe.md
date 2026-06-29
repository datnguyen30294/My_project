# Customer - Đặc tả nghiệp vụ Frontend

> Module: `PMC/Customer` | Ngày tạo: 2026-04-22 | Trạng thái: Draft

## 1. Tổng quan

Tính năng **Quản lý khách hàng** cho tenant PMC. Người dùng là nhân viên PMC (operator, admin). Mục đích: tra cứu danh bạ cư dân, xem toàn bộ lịch sử ticket/đơn hàng/thanh toán/đánh giá của từng khách; cập nhật thông tin liên hệ.

> Operator tenant **KHÔNG tạo ticket từ UI** — ticket vào tenant tự động qua Platform submit (cư dân điền landing `/ticket`) hoặc qua claim từ pool. FE Customer không tích hợp vào flow tạo ticket; BE tự find-or-create customer theo phone.

**Khách hàng = cư dân** — 1 SĐT = 1 người, không gắn với project hay apartment (xem BE spec).

## 2. Danh sách trang

| Trang | Route | Mô tả |
|-------|-------|-------|
| Danh sách | `/pmc/customers` | Bảng khách + search + phân trang |
| Tạo mới | `/pmc/customers/tao-moi` | Form tạo |
| Chi tiết | `/pmc/customers/[id]` | 4 tab: Thông tin / Ticket / Đơn hàng & Thanh toán / Đánh giá |
| Chỉnh sửa | `/pmc/customers/[id]/edit` | Form sửa |

**Menu item:** thêm vào `useNavigation.ts` — nằm giữa "HRM" và "Quản lý ticket":

```ts
{
  label: 'Khách hàng',
  icon: 'people',
  to: '/pmc/customers'
}
```

## 3. Trang danh sách (`/pmc/customers`)

### 3.1 Bảng hiển thị

| Cột | Dữ liệu | Ghi chú |
|-----|---------|---------|
| Mã | `code` | `KH-00001` |
| Họ tên | `full_name` | Link sang chi tiết |
| SĐT | `phone` | Format hiển thị: `0912 345 678` |
| Email | `email` | `—` nếu null |
| Số ticket | `ticket_count` | Badge số |
| CSAT trung bình | `avg_rating` | Stars ★ hoặc số "4.2/5"; `—` nếu chưa có |
| Liên hệ gần nhất | `last_contacted_at` | Relative time: "3 ngày trước" |
| Thao tác | — | Icon Edit + Xóa |

### 3.2 Search / Filter

| Bộ lọc | Loại | Mô tả |
|--------|------|-------|
| Tìm kiếm | Ô text (debounce) | Match `full_name`, `phone`, `email`, `code` |
| Sort | Dropdown | Options: "Liên hệ gần nhất" (default), "Tên A-Z", "Ngày tạo mới nhất" |

Dùng `useTableSearch` composable có sẵn để debounce.

### 3.3 Hành động

| Hành động | Trigger | Kết quả |
|-----------|---------|---------|
| Tạo mới | Nút "+ Thêm khách" góc phải trên | Route `/pmc/customers/tao-moi` |
| Xem chi tiết | Click row / click tên | Route `/pmc/customers/{id}` |
| Chỉnh sửa | Icon Edit | Route `/pmc/customers/{id}/edit` |
| Xóa | Icon Xóa | Gọi check-delete → nếu OK mở modal xác nhận → DELETE → refresh; nếu block → hiển thị `UAlert` lý do |

## 4. Form tạo mới / chỉnh sửa

### 4.1 Các trường nhập liệu

| Trường | Bắt buộc | Loại input | Validation / Ghi chú |
|--------|----------|------------|---------------------|
| Họ tên | Có | `UInput` text | Max 255 |
| SĐT | Có | `UInput` text | Max 20, gửi BE digits raw |
| Email | Không | `UInput` email | Email format, max 255 |
| Ghi chú | Không | `UTextarea` | Max 2000 |

> `code` **không** nằm trên form — BE auto-sinh.
> Form edit load sẵn dữ liệu; `code` hiển thị readonly ở góc.

### 4.2 Hành động

| Hành động | Kết quả |
|-----------|---------|
| Lưu (tạo) | POST `/customers`. Thành công: toast "Đã tạo khách hàng" + redirect `/pmc/customers/{newId}`. Lỗi validation: inline. Lỗi unique phone: highlight field + message "SĐT đã tồn tại". |
| Lưu (sửa) | PUT `/customers/{id}`. Thành công: toast + redirect chi tiết. |
| Hủy | Route back (hoặc về danh sách) |

## 5. Trang chi tiết (`/pmc/customers/[id]`)

### 5.1 Header

- Mã + Họ tên + SĐT + Email (readonly display)
- Nút "Chỉnh sửa" + nút "Xóa" (disabled nếu `check-delete` fail, tooltip lý do)

### 5.2 Thẻ thống kê (stat cards ở top)

| Card | Dữ liệu | Ghi chú |
|------|---------|---------|
| Tổng ticket | `aggregates.ticket_count` | Kèm breakdown: N đang xử lý, M hoàn thành |
| CSAT trung bình | `aggregates.avg_rating` | Stars + "trên X đánh giá" |
| Tổng đã thu | `aggregates.total_paid` | Format VND |
| Còn nợ | `aggregates.total_outstanding` | Format VND, đỏ nếu > 0 |

Dùng `UCard` hoặc `SharedStatCard` nếu có. KHÔNG custom div + Tailwind.

### 5.3 Tab "Thông tin" (default)

Readonly display dùng `SharedSectionCard`:
- Họ tên, SĐT, Email, Ghi chú, Lần đầu liên hệ, Lần gần nhất liên hệ, Ngày tạo

### 5.4 Tab "Ticket"

Bảng paginated từ `GET /customers/{id}/tickets`:

| Cột | Dữ liệu |
|-----|---------|
| Mã ticket | `code` — link `/pmc/og-tickets/{id}` |
| Tiêu đề | `subject` |
| Dự án | `project.name` |
| Căn hộ | `apartment_name` |
| Trạng thái | `status.label` — `UBadge` |
| Ưu tiên | `priority.label` — `UBadge` |
| Ngày nhận | `received_at` |
| Đánh giá | `resident_rating` (stars, `—` nếu null) |

### 5.5 Tab "Đơn hàng & Thanh toán"

**Section 1 — Đơn hàng** (từ `GET /customers/{id}/orders`):

| Cột | Dữ liệu |
|-----|---------|
| Mã đơn | `code` — link `/pmc/orders/{id}` |
| Ticket | `ticket.subject` (link `/pmc/og-tickets/{ticket.id}`) |
| Trạng thái | `status.label` — `UBadge` |
| Tổng tiền | `total_amount` VND |
| Tình trạng thu | `receivable.status.label` — `UBadge` |
| Đã thu | `receivable.paid_amount` |
| Còn nợ | `receivable.outstanding_amount` đỏ nếu > 0 |

**Section 2 — Phiếu thanh toán** (từ `GET /customers/{id}/payments`):

| Cột | Dữ liệu |
|-----|---------|
| Mã phiếu | `code` |
| Đơn liên quan | `order.code` |
| Số tiền | `amount` VND |
| Phương thức | `payment_method.label` |
| Ngày thu | `received_at` |

### 5.6 Tab "Đánh giá (CSAT)"

- Block AVG rating lớn + histogram phân bố sao (1-5)
- List card các comment có rating:
  - Sao + comment + ticket subject + ngày rate
  - Click ticket → `/pmc/og-tickets/{id}`

Dữ liệu: load all tickets có rating qua filter riêng, hoặc dùng lại tab Ticket client-side.

### 5.7 Hành động

| Hành động | Điều kiện | Kết quả |
|-----------|-----------|---------|
| Chỉnh sửa | Luôn | Route `/pmc/customers/{id}/edit` |
| Xóa | `check-delete` OK | Modal xác nhận → DELETE → toast + redirect list |
| Xóa (bị block) | Còn ticket/order | Nút disabled, tooltip: "Không thể xóa: khách còn N ticket, M đơn hàng" |

## 6. Luồng người dùng

### 6.1 Tạo khách mới

```
Danh sách → "+ Thêm khách" → Form → Điền họ tên + SĐT → Lưu
  ✓ Thành công: toast "Đã tạo khách hàng KH-00015" + redirect chi tiết
  ✗ Trùng SĐT: highlight field, message inline
  ✗ Validation: inline error
```

### 6.2 Xem lịch sử khách

```
Danh sách → Click row → Chi tiết (tab Thông tin)
  → Tab "Ticket" xem danh sách ticket
  → Tab "Đơn hàng & Thanh toán" xem tổng thu/nợ
  → Tab "Đánh giá" xem CSAT + comments
```

### 6.3 Về luồng tạo ticket (KHÔNG cần FE update)

Tenant operator **KHÔNG tạo ticket** từ UI. OgTicket vào tenant DB qua 2 path, cả 2 đều BE tự xử lý `customer_id` (find-or-create theo phone) — FE **không cần combobox/form chọn customer**:

1. **Cư dân submit qua tenant subdomain** (`tnp.residential.test/ticket`) → Platform `TicketService::submit` → `OgTicketExternalService::createFromTicket` tự tạo OgTicket trong tenant kèm `customer_id`.
2. **Operator claim từ pool** (`/pmc/og-tickets/pool`) → `OgTicketService::claim` tự gán `customer_id`.

→ FE module Customer chỉ phục vụ **tra cứu và quản lý danh bạ**, KHÔNG tích hợp vào flow tạo ticket.

### 6.4 Xóa khách

```
Danh sách / Chi tiết → Icon Xóa → [check-delete]
  ✓ OK: Modal "Xóa khách 'Nguyễn Văn A'?" → Xác nhận → toast + refresh
  ✗ Block: UAlert info "Không thể xóa: còn 3 ticket, 1 đơn hàng đang xử lý"
```

## 7. Phân quyền

Theo pattern `permission:{feature}.{action}`:

| Hành động | Permission |
|-----------|-----------|
| Xem danh sách / chi tiết | `customers.view` |
| Tạo mới | `customers.store` |
| Chỉnh sửa | `customers.update` |
| Xóa | `customers.destroy` |

Đăng ký permissions mới trong seeder permissions.

## 8. Composable API

**File:** `frontend/app/composables/api/useCustomers.ts` — **thêm functions tenant vào file đã có** (file hiện có function `usePlatformCustomer*` — giữ nguyên, bổ sung).

Functions cần có:

```ts
// --- Tenant PMC customers (thêm mới) ---

export function useCustomerList(params: MaybeRefOrGetter<CustomerListParams>)
export function useCustomerDetail(id: MaybeRefOrGetter<number | string>)
export function useCustomerTickets(id, params)
export function useCustomerOrders(id, params)
export function useCustomerPayments(id, params)
export function useCustomerCheckDelete(id)

export async function apiCreateCustomer(body)
export async function apiUpdateCustomer(id, body)
export async function apiDeleteCustomer(id)
```

URL hardcode trong composable, page KHÔNG gọi `$api('/customers')` trực tiếp (theo `feedback_orval_before_fe` + `frontend-development`).

**Types:** chạy `cd frontend && pnpm run api:generate` sau khi BE xong — Orval sinh types `CustomerListResource`, `CustomerDetailResource`... vào `lib/api/generated/laravel.ts`.

## 9. Components tái sử dụng

| Component | Mục đích |
|-----------|----------|
| `UTable` | Bảng list |
| `UInput`, `UTextarea`, `UForm` | Form |
| `UBadge` | Status ticket, status receivable |
| `UButton` | Actions |
| `UModal` | Confirm delete |
| `UAlert` | Block delete message |
| `UCard` / `SharedStatCard` | Thẻ thống kê |
| `SharedSectionCard` | Nhóm thông tin trên detail |
| `UTabs` | 4 tab trong detail |

KHÔNG viết custom div + Tailwind cho alert/badge/stat — theo `feedback_use_nuxt_ui_components`.

## 10. File cần tạo / sửa (FE)

**Tạo mới:**
- `frontend/app/pages/pmc/customers/index.vue`
- `frontend/app/pages/pmc/customers/tao-moi.vue`
- `frontend/app/pages/pmc/customers/[id]/index.vue`
- `frontend/app/pages/pmc/customers/[id]/edit.vue`
- `frontend/app/components/customer/CustomerForm.vue` (nếu tách)
- `frontend/app/components/customer/CustomerStatCards.vue` (nếu phức tạp)

**Sửa:**
- `frontend/app/composables/api/useCustomers.ts` — thêm functions tenant
- `frontend/app/composables/useNavigation.ts` — thêm menu item

## 11. Checklist triển khai FE

**Phase 1 - Foundation:**
- [ ] Chạy `cd frontend && pnpm run api:generate` sau BE xong
- [ ] Thêm functions tenant vào `useCustomers.ts`
- [ ] Thêm menu item vào `useNavigation.ts`

**Phase 2 - List + Form:**
- [ ] `pages/pmc/customers/index.vue` — table + search + paging
- [ ] `pages/pmc/customers/tao-moi.vue` — form tạo
- [ ] `pages/pmc/customers/[id]/edit.vue` — form sửa
- [ ] Component `CustomerForm` nếu tách

**Phase 3 - Detail:**
- [ ] `pages/pmc/customers/[id]/index.vue` — layout 4 tab
- [ ] Tab Thông tin
- [ ] Tab Ticket
- [ ] Tab Đơn hàng & Thanh toán
- [ ] Tab CSAT
- [ ] Stat cards

**Phase 4 - Delete:**
- [ ] Integrate `useCustomerCheckDelete` trước khi xóa
- [ ] Modal xác nhận dùng `useCrudModals`
- [ ] UAlert khi block

**Phase 5 - QA:**
- [ ] `docker exec residential_frontend pnpm run lint`
- [ ] `docker exec residential_frontend pnpm run typecheck`
- [ ] Manual test: CRUD, search, tab navigation, delete block

## 12. Ghi chú nghiệp vụ

- **SĐT**: BE lưu `0912345678`, FE format đẹp `0912 345 678` khi render; gửi BE digits raw (BE tự normalize).
- **Tiền**: VND, dấu phẩy ngăn cách, hậu tố "₫" hoặc "đ".
- **Thời gian**: relative time cho list, `DD/MM/YYYY HH:mm` cho detail.
- **Empty states**: mỗi tab không có dữ liệu → `UAlert` hoặc component empty, message tiếng Việt.
- **Loading**: `status === 'pending'` từ `useApiFetch`, skeleton hoặc spinner per-section; KHÔNG block full page.
- **Error**: toast + retry button per-section.
- **KHÔNG filter theo project** trên customer list — customer là danh bạ thuần (xem BE spec section 1).

## 13. Câu hỏi cần confirm trước khi code FE

1. Có cần **avatar khách** không? Mặc định bỏ qua.
2. Stat cards: **`UCard` mặc định** hay có `SharedStatCard`? (scan trước khi code)
3. Histogram CSAT: text đơn giản `N sao: XX%` hay bar chart? Khuyến nghị text cho phase đầu.
