# Module Đơn hàng - Đặc tả kỹ thuật Frontend

> Module: Quản lý đơn hàng / Đơn hàng | Ngày tạo: 2026-03-22 | Trạng thái: Draft

## 1. Tổng quan

Frontend cho quản lý Đơn hàng: danh sách, tạo mới (modal chọn báo giá), chi tiết (xem/sửa), flow chuyển trạng thái. Đơn hàng tạo từ báo giá đã chấp thuận — hệ thống tự copy dòng. Pricing đơn giản (không có khuyến mãi).

**Scope:**
- Trang danh sách đơn hàng (filter status, search)
- Modal tạo đơn hàng mới (chọn báo giá approved)
- Trang chi tiết đơn hàng (xem thông tin + workflow chuyển trạng thái)
- Trang chỉnh sửa đơn hàng (sửa dòng + ghi chú, chỉ khi draft)

## 2. Routes (Pages)

| Route | File | Mô tả |
|-------|------|-------|
| `/pmc/orders` | `app/pages/pmc/orders/index.vue` | Danh sách + modal tạo |
| `/pmc/orders/[id]` | `app/pages/pmc/orders/[id]/index.vue` | Chi tiết đơn hàng |
| `/pmc/orders/[id]/edit` | `app/pages/pmc/orders/[id]/edit.vue` | Chỉnh sửa (draft only) |

## 3. API Composable

**File:** `app/composables/api/useOrders.ts`

### 3.1 Queries (GET — useApiFetch)

| Function | Endpoint | Mô tả |
|----------|----------|-------|
| `useOrderList(params)` | `GET /api/v1/pmc/orders` | Danh sách phân trang |
| `useOrderDetail(id)` | `GET /api/v1/pmc/orders/{id}` | Chi tiết + lines |
| `useAvailableQuotes()` | `GET /api/v1/pmc/orders/available-quotes` | Báo giá khả dụng cho tạo đơn |

### 3.2 Mutations (POST/PUT/DELETE — $api)

| Function | Endpoint | Mô tả |
|----------|----------|-------|
| `apiCreateOrder(data)` | `POST /api/v1/pmc/orders` | Tạo đơn hàng từ báo giá |
| `apiUpdateOrder(id, data)` | `PUT /api/v1/pmc/orders/{id}` | Cập nhật (draft only) |
| `apiDeleteOrder(id)` | `DELETE /api/v1/pmc/orders/{id}` | Xóa (draft only) |
| `apiTransitionOrder(id, data)` | `POST /api/v1/pmc/orders/{id}/transition` | Chuyển trạng thái |

## 4. TypeScript Types

```typescript
type OrderStatus = 'draft' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
type QuoteLineType = 'material' | 'service' | 'adhoc'

interface OrderListItem {
  id: number
  code: string
  status: { value: OrderStatus; label: string }
  quote: { id: number; code: string }
  og_ticket: { id: number; subject: string }
  total_amount: string
  lines_count: number
  created_at: string
}

interface OrderLine {
  id: number
  line_type: { value: QuoteLineType; label: string }
  reference_id: number
  name: string
  quantity: number
  unit: string
  unit_price: string
  line_amount: string
}

interface OrderDetail {
  id: number
  code: string
  status: { value: OrderStatus; label: string }
  quote: {
    id: number
    code: string
    status: { value: string; label: string }
  }
  og_ticket: {
    id: number
    subject: string
    requester_name: string
  }
  total_amount: string
  note: string | null
  lines: OrderLine[]
  created_at: string
  updated_at: string
}

interface AvailableQuoteItem {
  id: number
  code: string
  og_ticket: { id: number; subject: string }
  total_amount: string
  lines_count: number
}

// Form payloads
interface CreateOrderPayload {
  quote_id: number
  note?: string | null
}

interface UpdateOrderPayload {
  note?: string | null
  lines: {
    line_type: QuoteLineType
    reference_id: number
    name: string
    quantity: number
    unit: string
    unit_price: number
  }[]
}

interface TransitionOrderPayload {
  status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
}
```

## 5. Pages

### 5.1 Danh sách đơn hàng (`/pmc/orders`)

**Layout:** Giống pattern danh sách hiện có (xem OgTicket list, Quote list).

**Header:**
- Title: "Đơn hàng"
- Button: "Tạo đơn hàng" → mở modal (disabled nếu không có báo giá khả dụng)

**Filters:**
- `UInput` search (debounced) — tìm theo code, tên ticket
- `USelect` status — Tất cả / Nháp / Đã xác nhận / Đang thực hiện / Hoàn thành / Đã hủy

**Table columns:**

| Column | Key | Format |
|--------|-----|--------|
| Mã đơn | `code` | mono text |
| Báo giá | `quote.code` | mono text, link → `/pmc/quotes/{quote.id}` |
| Ticket | `og_ticket.subject` | text |
| Trạng thái | `status` | UBadge (color theo status) |
| Tổng tiền | `total_amount` | currency VND |
| Số dòng | `lines_count` | number |
| Tạo lúc | `created_at` | datetime |
| Thao tác | — | Button "Xem" → `/pmc/orders/{id}` |

**Modal tạo đơn hàng:**
- Title: "Tạo đơn hàng từ báo giá"
- `USelect` chọn báo giá khả dụng — load từ `useAvailableQuotes()`
  - Format option: `{code} — {og_ticket.subject} — {total_amount} đ ({lines_count} dòng)`
- `UTextarea` ghi chú (optional)
- Hiển thị thông tin báo giá đã chọn: ticket, tổng tiền, số dòng
- Buttons: "Hủy" + "Tạo đơn hàng"
- Submit: `apiCreateOrder({ quote_id, note })` → redirect `/pmc/orders/{newId}`

**Empty state (modal):** Nếu `useAvailableQuotes()` trả về rỗng → hiển thị `UAlert` info: "Không có báo giá đã chấp thuận nào khả dụng. Vui lòng tạo và duyệt báo giá trước."

### 5.2 Chi tiết đơn hàng (`/pmc/orders/[id]`)

**Sections:**

#### Section 1: Alert — Trạng thái & quyền chỉnh sửa

| Status | Alert | Color |
|--------|-------|-------|
| draft | "Đơn hàng đang ở trạng thái nháp. Có thể chỉnh sửa." + Button "Chỉnh sửa" → edit page | success |
| confirmed | "Đơn hàng đã xác nhận. Không thể chỉnh sửa." | info |
| in_progress | "Đơn hàng đang thực hiện." | warning |
| completed | "Đơn hàng đã hoàn thành." | success |
| cancelled | "Đơn hàng đã bị hủy." | error |

#### Section 2: Thông tin tổng quan

| Field | Mô tả |
|-------|-------|
| Mã đơn | `code` |
| Trạng thái | `status` — UBadge |
| Báo giá | `quote.code` — link → `/pmc/quotes/{quote.id}` |
| Ticket | `og_ticket.subject` — link → `/pmc/og-tickets/{og_ticket.id}` |
| Tổng tiền | `total_amount` — format VND |
| Ghi chú | `note` |
| Tạo lúc | `created_at` |
| Cập nhật | `updated_at` |

#### Section 3: Dòng đơn hàng

Table readonly:

| Column | Key | Format |
|--------|-----|--------|
| Hạng mục | `name` | text |
| Loại | `line_type` | UBadge |
| Số lượng | `quantity` | number |
| Đơn vị | `unit` | text |
| Đơn giá | `unit_price` | currency VND |
| Thành tiền | `line_amount` | currency VND |

Footer row: **Tổng tiền** = sum(line_amount) — bold

#### Section 4: Hành động

Chỉ hiển thị transitions hợp lệ theo status hiện tại. Tất cả gọi `apiTransitionOrder(id, { status })`.

| Current Status | Buttons |
|----------------|---------|
| draft | "Xác nhận đơn" (→ confirmed), "Hủy đơn" (→ cancelled), "Xóa" (→ delete) |
| confirmed | "Bắt đầu thực hiện" (→ in_progress), "Hủy đơn" (→ cancelled) |
| in_progress | "Hoàn thành" (→ completed), "Hủy đơn" (→ cancelled) |
| completed | (không có actions) |
| cancelled | (không có actions) |

**Button styles:**
- Positive transitions (confirm, start, complete): `color="primary"`
- Cancel: `color="error"` `variant="outline"` — hiện confirm dialog trước khi thực hiện
- Delete: `color="error"` `variant="ghost"` — hiện confirm dialog

**Confirm dialog (cancel/delete):**
- Title: "Xác nhận hủy đơn hàng" / "Xác nhận xóa đơn hàng"
- Message: "Hành động này không thể hoàn tác. Tiếp tục?"
- Buttons: "Quay lại" + "Xác nhận"

### 5.3 Chỉnh sửa đơn hàng (`/pmc/orders/[id]/edit`)

**Guard:** Redirect về detail nếu `status != 'draft'`.

**Sections:**

#### Section 1: Ghi chú
- `UTextarea` — editable

#### Section 2: Dòng đơn hàng
- Table hiển thị danh sách dòng hiện tại (editable)
- Button "Thêm dòng" → mở Modal

**Modal thêm/sửa dòng:** (giống pattern trang tạo báo giá)

| Field | Component | Required |
|-------|-----------|----------|
| Loại | USelect (Vật tư / Dịch vụ / Dịch vụ tùy chọn) | required |
| Hạng mục | USelect (load từ CatalogItem / CatalogAdhocItem theo loại) | required |
| Số lượng | UInput number, min=1 | required |
| Đơn vị | UInput (auto-fill từ catalog) | required |
| Đơn giá (đ) | UInput number (auto-fill từ catalog) | required |

- Khi chọn loại → load dropdown hạng mục tương ứng
- Khi chọn hạng mục → auto-fill tên, đơn vị, đơn giá từ catalog
- Thành tiền = đơn giá × số lượng (hiển thị computed)

**Line table columns:** Hạng mục | Loại | SL | ĐVT | Đơn giá | Thành tiền | Xóa

#### Section 3: Tổng kết (computed)
- **Tổng tiền:** sum(đơn giá × số lượng)

#### Section 4: Actions
- Button "Lưu thay đổi" — `apiUpdateOrder(id, { note, lines })` → toast success + redirect detail
- Button "Hủy" → navigate back to detail

## 6. Components

### 6.1 Reuse từ project

- `UTable`, `UButton`, `USelect`, `UInput`, `UModal`, `UCard`, `UBadge`, `UAlert`, `UTextarea`, `UFormField`, `UEmpty` — Nuxt UI
- Pattern table + filter: tham khảo trang Quote list, OgTicket list
- Pattern thêm dòng modal: tham khảo trang tạo báo giá (`pmc/quotes/create.vue`)
- `SharedSectionCard` — card container with header
- `useCrudModals` — nếu phù hợp cho modal tạo đơn

### 6.2 Components mới

Không cần component mới — dùng Nuxt UI components + shared components hiện có.

## 7. User Flows

### 7.1 Tạo đơn hàng
1. Vào `/pmc/orders` → bấm "Tạo đơn hàng"
2. Modal hiện → chọn báo giá từ dropdown (chỉ báo giá approved chưa có đơn)
3. (Optional) nhập ghi chú
4. Bấm "Tạo đơn hàng" → POST API → redirect chi tiết đơn mới
5. OgTicket tự chuyển status → `ordered`

### 7.2 Xem & chuyển trạng thái
1. Vào chi tiết đơn hàng → xem thông tin + dòng
2. Bấm button chuyển trạng thái phù hợp:
   - Draft → "Xác nhận đơn" → `apiTransitionOrder(id, { status: 'confirmed' })`
   - Confirmed → "Bắt đầu thực hiện" → `apiTransitionOrder(id, { status: 'in_progress' })`
   - InProgress → "Hoàn thành" → `apiTransitionOrder(id, { status: 'completed' })`
3. Refresh data sau mỗi transition

### 7.3 Chỉnh sửa (draft)
1. Vào chi tiết đơn (draft) → bấm "Chỉnh sửa"
2. Redirect → edit page
3. Sửa ghi chú, thêm/xóa/sửa dòng
4. Bấm "Lưu thay đổi" → PUT API → redirect detail

### 7.4 Hủy / Xóa đơn
1. Vào chi tiết đơn → bấm "Hủy đơn" hoặc "Xóa"
2. Confirm dialog hiện
3. Xác nhận → API call → redirect danh sách
4. Báo giá trở lại khả dụng để tạo đơn mới

## 8. Format Helpers

```typescript
// Reuse formatCurrency từ utils/number.ts (đã có)

// Status labels & colors
const ORDER_STATUS_CONFIG = {
  draft: { label: 'Nháp', color: 'neutral' },
  confirmed: { label: 'Đã xác nhận', color: 'primary' },
  in_progress: { label: 'Đang thực hiện', color: 'warning' },
  completed: { label: 'Hoàn thành', color: 'success' },
  cancelled: { label: 'Đã hủy', color: 'error' },
} as const
```

> **Line type labels:** Reuse `QUOTE_LINE_TYPE_LABELS` từ Quote module hoặc extract ra shared constant nếu chưa có.
