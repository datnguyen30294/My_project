# Module Báo giá - Đặc tả kỹ thuật Frontend

> Module: Quản lý đơn hàng / Báo giá | Ngày tạo: 2026-03-20 | Trạng thái: Draft

## 1. Tổng quan

Frontend cho quản lý Báo giá: danh sách, tạo mới, chi tiết (xem/sửa), flow duyệt 2 bước, lịch sử. Mỗi ticket chỉ có 1 báo giá active — khi tạo mới sẽ confirm thay thế báo giá cũ.

**Scope:**
- Trang danh sách báo giá (filter status, is_active, search)
- Trang tạo báo giá mới (chọn OgTicket, chọn status draft/sent, thêm dòng vật tư/dịch vụ, confirm thay thế)
- Trang chi tiết báo giá (xem/sửa khi draft, workflow duyệt, lịch sử)

## 2. Routes (Pages)

| Route | File | Mô tả |
|-------|------|-------|
| `/bao-gia` | `app/pages/bao-gia/index.vue` | Danh sách báo giá |
| `/bao-gia/tao-moi` | `app/pages/bao-gia/tao-moi.vue` | Tạo báo giá mới |
| `/bao-gia/[id]` | `app/pages/bao-gia/[id].vue` | Chi tiết/chỉnh sửa báo giá |

## 3. API Composable

**File:** `app/composables/api/useQuotes.ts`

### 3.1 Queries (GET — useApiFetch)

| Function | Endpoint | Mô tả |
|----------|----------|-------|
| `useQuoteList(params)` | `GET /api/v1/pmc/quotes` | Danh sách phân trang |
| `useQuoteDetail(id)` | `GET /api/v1/pmc/quotes/{id}` | Chi tiết + lines |
| `useQuoteCheckActive(ogTicketId)` | `GET /api/v1/pmc/quotes/check-active?og_ticket_id={id}` | Kiểm tra ticket có active quote |

### 3.2 Mutations (POST/PUT/DELETE — $api)

| Function | Endpoint | Mô tả |
|----------|----------|-------|
| `apiCreateQuote(data)` | `POST /api/v1/pmc/quotes` | Tạo báo giá mới |
| `apiUpdateQuote(id, data)` | `PUT /api/v1/pmc/quotes/{id}` | Cập nhật báo giá (draft + active only) |
| `apiDeleteQuote(id)` | `DELETE /api/v1/pmc/quotes/{id}` | Xóa báo giá (draft only) |
| `apiTransitionQuote(id, data)` | `POST /api/v1/pmc/quotes/{id}/transition` | Chuyển trạng thái (state machine) |

> **`apiTransitionQuote`** thay thế 4 API riêng (send, manager-approve, resident-approve, reject).
> Body: `{ status: QuoteStatus, note?: string }`. State machine trong backend validate transition hợp lệ.
>
> Ví dụ:
> - Gửi báo giá: `apiTransitionQuote(id, { status: 'sent' })`
> - QL duyệt: `apiTransitionQuote(id, { status: 'manager_approved' })`
> - Cư dân chấp thuận: `apiTransitionQuote(id, { status: 'approved' })`
> - Từ chối: `apiTransitionQuote(id, { status: 'rejected', note: 'Lý do...' })`

## 4. TypeScript Types

```typescript
type QuoteStatus = 'draft' | 'sent' | 'manager_approved' | 'approved' | 'rejected'
type QuoteLineType = 'material' | 'service' | 'adhoc'

interface QuoteListItem {
  id: number
  code: string
  status: { value: QuoteStatus; label: string }
  is_active: boolean
  og_ticket: { id: number; subject: string }
  total_amount: string
  lines_count: number
  created_at: string
}

interface QuoteLine {
  id: number
  line_type: { value: QuoteLineType; label: string }
  reference_id: number
  name: string
  quantity: number
  unit: string
  unit_price: string
  line_amount: string
}

interface QuoteDetail {
  id: number
  code: string
  status: { value: QuoteStatus; label: string }
  is_active: boolean
  og_ticket: { id: number; subject: string; requester_name: string }
  total_amount: string
  manager_approved_at: string | null
  manager_approved_by: { id: number; name: string } | null
  resident_approved_at: string | null
  note: string | null
  lines: QuoteLine[]
  created_at: string
  updated_at: string
}

interface CheckActiveQuoteResponse {
  has_active_quote: boolean
  active_quote: {
    id: number
    code: string
    status: { value: QuoteStatus; label: string }
  } | null
}

// Form payloads
interface StoreQuotePayload {
  og_ticket_id: number
  status: 'draft' | 'sent'
  note?: string | null
  replace_active?: boolean
  lines: {
    line_type: QuoteLineType
    reference_id: number
    name: string
    quantity: number
    unit: string
    unit_price: number
  }[]
}

interface UpdateQuotePayload {
  note?: string | null
  lines: StoreQuotePayload['lines']
}

interface TransitionQuotePayload {
  status: 'sent' | 'manager_approved' | 'approved' | 'rejected'
  note?: string | null
}
```

## 5. Pages

### 5.1 Danh sách báo giá (`/bao-gia`)

**Layout:** Giống pattern danh sách hiện có (xem OgTicket list).

**Header:**
- Title: "Báo giá"
- Button: "Tạo báo giá" → navigate `/bao-gia/tao-moi`

**Filters:**
- `UInput` search (debounced) — tìm theo code, tên ticket
- `USelect` status — Tất cả / Nháp / Đã gửi / QL đã duyệt / Đã chấp thuận / Từ chối
- `USelect` active — Tất cả / Active / Inactive

**Table columns:**

| Column | Key | Format |
|--------|-----|--------|
| Mã | `code` | mono text |
| Ticket | `og_ticket.subject` | text |
| Trạng thái | `status` | UBadge (color theo status) |
| Active | `is_active` | UBadge: active=success / inactive=neutral |
| Tổng tiền | `total_amount` | currency VND |
| Số dòng | `lines_count` | number |
| Tạo lúc | `created_at` | datetime |
| Thao tác | — | Button "Xem" → `/bao-gia/{id}` |

**Status badge colors:**

| Status | Color | Label |
|--------|-------|-------|
| draft | neutral | Nháp |
| sent | primary | Đã gửi |
| manager_approved | warning | QL đã duyệt |
| approved | success | Đã chấp thuận |
| rejected | error | Từ chối |

### 5.2 Tạo báo giá (`/bao-gia/tao-moi`)

**Sections:**

#### Section 1: Thông tin nguồn
- `USelect` chọn OgTicket (query OgTicket list)
- Hiển thị thông tin ticket đã chọn
- **Khi chọn ticket → gọi `useQuoteCheckActive(ticketId)`.** Nếu `has_active_quote = true` → hiển thị `UAlert` warning:
  > "Ticket này đã có báo giá active: **{code}** ({status}). Tạo mới sẽ thay thế báo giá hiện tại."

#### Section 2: Dòng báo giá
- Table hiển thị danh sách dòng đã thêm
- Button "Thêm dòng" → mở Modal

**Modal thêm dòng:**

| Field | Component | Required |
|-------|-----------|----------|
| Loại | USelect (Vật tư / Dịch vụ / Dịch vụ tùy chọn) | required |
| Hạng mục | USelect (load từ CatalogItem hoặc CatalogAdhocItem theo loại) | required |
| Số lượng | UInput number, min=1 | required |
| Đơn vị | UInput (auto-fill từ catalog) | required |
| Đơn giá (đ) | UInput number (auto-fill từ catalog) | required |

- Khi chọn "Loại" → load dropdown hạng mục tương ứng
- Khi chọn hạng mục → auto-fill tên, đơn vị, đơn giá từ catalog
- Thành tiền = đơn giá × số lượng (hiển thị computed)

**Line table columns:** Hạng mục | Loại | SL | ĐVT | Đơn giá | Thành tiền | Xóa

#### Section 3: Tổng kết (computed)
- **Tổng tiền:** sum(đơn giá × số lượng)

#### Section 4: Actions
- `USelect` chọn trạng thái: **Nháp** / **Gửi luôn (Chờ QL duyệt)** — default: Nháp
- Button "Tạo báo giá" — disabled khi chưa chọn ticket hoặc chưa có dòng
- Button "Hủy" → navigate back
- **Nếu ticket có active quote → khi bấm "Tạo báo giá" → hiện confirm dialog:**
  > "Báo giá hiện tại **{code}** sẽ bị thay thế. Tiếp tục?"
  > [Hủy] [Xác nhận tạo]

### 5.3 Chi tiết báo giá (`/bao-gia/[id]`)

**Sections:**

#### Section 1: Alert — Trạng thái
- Nếu `is_active = false` → `UAlert` color=warning: "Báo giá này đã bị thay thế bởi báo giá mới."
- Nếu `is_active = true` và `status = draft` → `UAlert` color=success: "Có thể chỉnh sửa."
- Nếu `is_active = true` và `status != draft` → `UAlert` color=neutral: "Chỉ xem, không thể chỉnh sửa."

#### Section 2: Giai đoạn báo giá
- `UStepper` — hiển thị workflow (Nháp → Đã gửi → QL duyệt → Chấp thuận)
- `UBadge` — trạng thái hiện tại + active/inactive badge

#### Section 3: Thông tin nguồn
- Ticket ID (link), tiêu đề, trạng thái ticket, thời gian tạo/cập nhật
- Thời gian QL duyệt, cư dân chấp thuận (nếu có)

#### Section 4: Dòng báo giá
- Table: Hạng mục | Loại | SL | ĐVT | Đơn giá | Thành tiền

#### Section 5: Tổng tiền
- **Tổng tiền:** sum(thành tiền) — readonly
- Ghi chú (editable khi draft + active)
- Button "Lưu thay đổi" (khi draft + active)

#### Section 6: Hành động duyệt
Chỉ hiển thị khi `is_active = true`. Tất cả buttons gọi cùng 1 API: `apiTransitionQuote(id, { status, note? })`.

| Status | Buttons | Transition target |
|--------|---------|-------------------|
| draft | "Gửi báo giá" | `sent` |
| sent | "Quản lý duyệt" + "Quản lý từ chối" | `manager_approved` / `rejected` |
| manager_approved | "Cư dân chấp thuận" + "Cư dân từ chối" | `approved` / `rejected` |
| approved | (không có actions) | — |
| rejected | (không có actions) | — |

#### Modal từ chối
- Khi bấm "Từ chối" → mở modal
- `UTextarea` — lý do từ chối (optional)
- Buttons: Hủy + Từ chối
- Submit: `apiTransitionQuote(id, { status: 'rejected', note })`

## 6. Components

### 6.1 Reuse từ project

- `UTable`, `UButton`, `USelect`, `UInput`, `UModal`, `UCard`, `UBadge`, `UStepper`, `UAlert`, `UTextarea`, `UFormField`, `UEmpty` — Nuxt UI
- Pattern table + filter: tham khảo trang OgTicket list hiện có
- Pattern CRUD modal: dùng `useCrudModals` composable nếu phù hợp

### 6.2 Components mới (nếu cần)

| Component | Mô tả |
|-----------|-------|
| `QuoteStatusBadge.vue` | Badge hiển thị status + active/inactive (có thể inline nếu đơn giản) |

## 7. User Flows

### 7.1 Tạo báo giá (ticket chưa có báo giá)
1. Vào `/bao-gia` → bấm "Tạo báo giá"
2. Chọn OgTicket → không có cảnh báo
3. Thêm dòng vật tư/dịch vụ
4. Chọn trạng thái: Nháp hoặc Gửi luôn
5. Bấm "Tạo báo giá" → POST API → redirect chi tiết

### 7.2 Tạo báo giá (ticket đã có báo giá active)
1. Vào `/bao-gia` → bấm "Tạo báo giá"
2. Chọn OgTicket → hiện `UAlert` warning: "Ticket đã có báo giá active QT-xxx"
3. Thêm dòng vật tư/dịch vụ, chọn trạng thái
4. Bấm "Tạo báo giá" → hiện confirm dialog: "Báo giá QT-xxx sẽ bị thay thế"
5. Xác nhận → POST API với `replace_active: true` → redirect chi tiết
6. Báo giá cũ tự động chuyển `is_active = false`

### 7.3 Gửi & duyệt (tất cả qua `apiTransitionQuote`)
1. Vào chi tiết báo giá (draft + active)
2. Review dòng → "Gửi báo giá" → `apiTransitionQuote(id, { status: 'sent' })`
3. Quản lý → "Quản lý duyệt" → `apiTransitionQuote(id, { status: 'manager_approved' })`
4. Cư dân → "Cư dân chấp thuận" → `apiTransitionQuote(id, { status: 'approved' })`
5. Từ chối (bất kỳ bước nào) → `apiTransitionQuote(id, { status: 'rejected', note: '...' })`

> **State machine backend tự validate:** FE chỉ cần gửi target status, không cần biết current status. Nếu transition không hợp lệ → BE trả 422 với message rõ ràng.

## 8. Format Helpers

```typescript
// Currency formatting (VND)
function formatCurrency(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return `${new Intl.NumberFormat('vi-VN').format(num || 0)} đ`
}

// Status labels & colors
const QUOTE_STATUS_CONFIG = {
  draft: { label: 'Nháp', color: 'neutral' },
  sent: { label: 'Đã gửi', color: 'primary' },
  manager_approved: { label: 'QL đã duyệt', color: 'warning' },
  approved: { label: 'Đã chấp thuận', color: 'success' },
  rejected: { label: 'Từ chối', color: 'error' },
} as const

const QUOTE_LINE_TYPE_LABELS = {
  material: 'Vật tư',
  service: 'Dịch vụ',
  adhoc: 'Dịch vụ tùy chọn',
} as const
```
