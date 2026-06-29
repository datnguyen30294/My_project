# Module Công nợ phải thu - Đặc tả kỹ thuật Frontend

> Module: Kế toán/Tài chính / Công nợ phải thu | Ngày tạo: 2026-04-06 | Trạng thái: Draft

## 1. Tổng quan

Frontend cho quản lý Công nợ phải thu: danh sách (KPI cards + aging summary + bảng filter), chi tiết khoản công nợ (thông tin + lịch sử thu tiền + modal ghi nhận thu tiền).

**Scope:**
- Trang danh sách công nợ (KPI, aging, filter status/project, search)
- Trang chi tiết công nợ (thông tin, lịch sử thu tiền, ghi nhận thu tiền, xóa nợ)

> **Không có tạo/sửa/xóa thủ công.** Receivable phát sinh tự động khi Order → confirmed. Thao tác chính: ghi nhận thu tiền, xóa nợ.

## 2. Routes (Pages)

| Route | File | Mô tả |
|-------|------|-------|
| `/pmc/receivables` | `app/pages/pmc/receivables/index.vue` | Danh sách + KPI + aging |
| `/pmc/receivables/[id]` | `app/pages/pmc/receivables/[id]/index.vue` | Chi tiết + thu tiền |

## 3. Navigation & Breadcrumb

### 3.1 Sidebar

Thêm item vào group "Kế toán/Tài chính" trong `useNavigation.ts`:

```typescript
{
  label: 'Kế toán/Tài chính',
  icon: 'account_balance',
  children: [
    { label: 'Cấu hình hoa hồng', to: '/pmc/commission' },
    { label: 'Công nợ phải thu', to: '/pmc/receivables' }  // ← thêm
  ]
}
```

### 3.2 Breadcrumb

Thêm vào `useBreadcrumb.ts`:

```typescript
// ROUTE_LABELS
'receivables': 'Công nợ phải thu'

// PARENT_GROUP
'receivables': 'Kế toán/Tài chính'
```

Breadcrumb trail: `Trang chủ > Kế toán/Tài chính > Công nợ phải thu > Công nợ đơn {order.code}`

## 4. API Composable

**File:** `app/composables/api/useReceivables.ts`

### 4.1 Queries (GET — useApiFetch)

| Function | Endpoint | Mô tả |
|----------|----------|-------|
| `useReceivableList(params)` | `GET /api/v1/pmc/receivables` | Danh sách phân trang |
| `useReceivableSummary(params)` | `GET /api/v1/pmc/receivables/summary` | KPI + aging buckets |
| `useReceivableDetail(id)` | `GET /api/v1/pmc/receivables/{id}` | Chi tiết + payment history |

### 4.2 Mutations (POST — $api)

| Function | Endpoint | Mô tả |
|----------|----------|-------|
| `apiCreatePayment(receivableId, data)` | `POST /api/v1/pmc/receivables/{id}/payments` | Ghi nhận thu tiền |
| `apiWriteOffReceivable(receivableId, data)` | `POST /api/v1/pmc/receivables/{id}/write-off` | Xóa nợ |

### 4.3 Constants & Helpers

```typescript
export type ReceivableStatus = 'unpaid' | 'partial' | 'paid' | 'overdue' | 'written_off'
export type PaymentMethodValue = 'cash' | 'transfer' | 'card'

export function receivableStatusColor(value: string): BadgeColor {
  switch (value) {
    case 'unpaid': return 'neutral'
    case 'partial': return 'warning'
    case 'paid': return 'success'
    case 'overdue': return 'error'
    case 'written_off': return 'neutral'
    default: return 'neutral'
  }
}

export const RECEIVABLE_STATUS_OPTIONS = [
  { label: 'Chưa thu', value: 'unpaid' },
  { label: 'Thu một phần', value: 'partial' },
  { label: 'Đã thu đủ', value: 'paid' },
  { label: 'Quá hạn', value: 'overdue' },
  { label: 'Xóa nợ', value: 'written_off' },
] as const

export const PAYMENT_METHOD_OPTIONS = [
  { label: 'Tiền mặt', value: 'cash' },
  { label: 'Chuyển khoản', value: 'transfer' },
  { label: 'Thẻ', value: 'card' },
] as const
```

### 4.4 Cache

```typescript
export const RECEIVABLE_DETAIL_KEY = (id: number | string) => `receivable-detail-${id}`

export function clearReceivableCache(id: number | string) {
  clearNuxtData(RECEIVABLE_DETAIL_KEY(id))
}
```

## 5. TypeScript Types

```typescript
// --- List ---
interface ReceivableListItem {
  id: number
  order: { id: number; code: string }
  og_ticket: {
    id: number
    subject: string
    requester_name: string
    apartment_name: string | null
  }
  project: { id: number; name: string }
  amount: string
  paid_amount: string
  outstanding: string
  status: { value: ReceivableStatus; label: string }
  due_date: string
  aging_days: number | null
  issued_at: string
  created_at: string
}

// --- Summary ---
interface ReceivableSummary {
  kpi: {
    total_amount: string
    total_paid: string
    total_outstanding: string
    count: number
  }
  aging: {
    bucket: string
    label: string
    total: string
    count: number
  }[]
}

// --- Detail ---
interface PaymentReceiptItem {
  id: number
  amount: string
  payment_method: { value: PaymentMethodValue; label: string }
  collected_by: { id: number; name: string } | null
  note: string | null
  paid_at: string
  created_at: string
}

interface ReceivableDetail {
  id: number
  order: {
    id: number
    code: string
    status: { value: string; label: string }
  }
  og_ticket: {
    id: number
    subject: string
    requester_name: string
    requester_phone: string | null
    apartment_name: string | null
  }
  project: { id: number; name: string }
  amount: string
  paid_amount: string
  outstanding: string
  status: { value: ReceivableStatus; label: string }
  due_date: string
  aging_days: number | null
  issued_at: string
  payments: PaymentReceiptItem[]
  created_at: string
  updated_at: string
}

// --- Payloads ---
interface CreatePaymentPayload {
  amount: number
  payment_method: PaymentMethodValue
  note?: string | null
  paid_at: string
}

interface WriteOffPayload {
  note?: string | null
}
```

## 6. Pages

### 6.1 Danh sách công nợ (`/pmc/receivables`)

**Layout:** KPI summary → Aging cards → Filter + Table.

#### Section 1: KPI Cards

4 cards ngang — dùng `UCard`, grid `grid-cols-2 sm:grid-cols-4`.

| Card | Value | Style |
|------|-------|-------|
| Tổng phải thu | `kpi.total_amount` | `formatCurrency()` |
| Đã thu | `kpi.total_paid` | `text-[var(--ui-success)]` |
| Còn nợ | `kpi.total_outstanding` | `text-[var(--ui-warning)]` |
| Số khoản | `kpi.count` | number |

> Data từ `useReceivableSummary()`. Separate API call — không phụ thuộc filter bảng.
> KPI chỉ filter theo `project_id` (nếu có), không theo search/status.

#### Section 2: Aging Summary Cards

4 cards ngang — grid `grid-cols-2 sm:grid-cols-4`.

| Card | Bucket | Hiển thị |
|------|--------|----------|
| 0–7 ngày | `0-7` | Tổng tiền + số khoản |
| 8–30 ngày | `8-30` | Tổng tiền + số khoản |
| 31–60 ngày | `31-60` | Tổng tiền + số khoản |
| >60 ngày | `61+` | Tổng tiền + số khoản |

> Data từ `useReceivableSummary()` → `aging[]`.

#### Section 3: Filter + Table

**Header:** `SharedCrudPageHeader` — title "Công nợ phải thu", không có button tạo mới.

**Filters:**

| Filter | Component | Mô tả |
|--------|-----------|-------|
| Search | `UInput` (debounced) | Tìm theo mã đơn, tên khách hàng |
| Status | `USelect` | RECEIVABLE_STATUS_OPTIONS + "Tất cả" |
| Dự án | `USelect` | Load từ `useProjectList()` (reuse từ project composable) + "Tất cả" |

> Dùng `useTableSearch` + `useUrlFilters` để sync URL params.

**Table columns:**

| Column | Key | Format |
|--------|-----|--------|
| Mã đơn | `order.code` | mono text, link → `/pmc/orders/{order.id}` |
| Khách hàng | `og_ticket.requester_name` | text |
| Dự án | `project.name` | text |
| Phải thu | `amount` | `formatCurrency()` |
| Đã thu | `paid_amount` | `formatCurrency()` |
| Còn nợ | `outstanding` | `formatCurrency()`, bold nếu > 0 |
| Trạng thái | `status` | `UBadge` (color theo `receivableStatusColor`) |
| Hạn TT | `due_date` | date format |
| Tuổi nợ | `aging_days` | `{n} ngày` hoặc "Chưa đến hạn" (nếu 0), `—` nếu paid/written_off |
| Thao tác | — | UButton "Chi tiết" → `/pmc/receivables/{id}` |

**Row click:** Navigate → `/pmc/receivables/{id}`

**Pagination:** `SharedCrudTablePagination`

### 6.2 Chi tiết công nợ (`/pmc/receivables/[id]`)

**Layout:** 2 columns (2/3 main + 1/3 sidebar) giống order detail.

#### Main Content (left 2/3)

**Section 1: Status Alert**

`UAlert` — màu + icon theo trạng thái:

| Status | Color | Title | Description |
|--------|-------|-------|-------------|
| unpaid | `neutral` | Chưa thu | "Chưa thu. Hạn thanh toán: {due_date}." |
| partial | `warning` | Thu một phần | "Còn nợ {outstanding} đ." |
| paid | `success` | Đã thu đủ | "Đã thu đủ toàn bộ số tiền phải thu." |
| overdue | `error` | Quá hạn | "Quá hạn thanh toán. Còn nợ {outstanding} đ." |
| written_off | `neutral` | Xóa nợ | "Khoản nợ đã được xóa." |

**Section 2: 3 Summary Cards**

Grid `grid-cols-1 sm:grid-cols-3`:

| Card | Value | Style |
|------|-------|-------|
| Phải thu | `amount` | `formatCurrency()`, font-bold |
| Đã thu | `paid_amount` | `text-[var(--ui-success)]` |
| Còn nợ | `outstanding` | `text-[var(--ui-warning)]` nếu > 0, `text-[var(--ui-success)]` nếu = 0 |

**Section 3: Thông tin công nợ**

`SharedSectionCard` title "Thông tin công nợ", header badge = status.

| Field | Value | Format |
|-------|-------|--------|
| Đơn hàng | `order.code` | Link → `/pmc/orders/{order.id}` |
| Trạng thái đơn | `order.status` | UBadge |
| Khách hàng | `og_ticket.requester_name` | text |
| Số điện thoại | `og_ticket.requester_phone` | text |
| Căn hộ | `og_ticket.apartment_name` | text hoặc "—" |
| Dự án | `project.name` | text |
| Ngày phát sinh | `issued_at` | datetime |
| Hạn thanh toán | `due_date` | date |

> Dùng `SharedFieldDisplay` cho mỗi field. Grid 2 columns.

**Section 4: Lịch sử thu tiền**

`SharedSectionCard` title "Lịch sử thu tiền ({payments.length})", header action = Button "Ghi nhận thu tiền" (chỉ hiện khi `canCollect`).

**Table columns:**

| Column | Key | Format |
|--------|-----|--------|
| Ngày thu | `paid_at` | datetime |
| Số tiền | `amount` | `formatCurrency()` |
| Phương thức | `payment_method` | `UBadge` variant subtle |
| Người thu | `collected_by.name` | text hoặc "—" |
| Ghi chú | `note` | text hoặc "—" |

**Empty state:** `UEmpty` — "Chưa có lần thu tiền nào. Bấm 'Ghi nhận thu tiền' để thêm phiếu thu."

#### Sidebar (right 1/3)

**Card 1: Hành động**

Chỉ hiện khi `canCollect` (status = unpaid | partial | overdue):

- Button "Ghi nhận thu tiền" → mở modal. `color="primary"`, full width.
- Button "Xóa nợ" → confirm dialog → `apiWriteOffReceivable()`. `color="error"`, `variant="outline"`, full width.

Khi status = paid hoặc written_off → hiển thị text mô tả, không có button.

**Card 2: Thông tin**

| Field | Value |
|-------|-------|
| Trạng thái | UBadge |
| Tuổi nợ | `{aging_days} ngày` hoặc "Chưa đến hạn" |
| Tạo lúc | `created_at` |
| Cập nhật | `updated_at` |

#### Modal: Ghi nhận thu tiền

`UModal` — title "Ghi nhận thu tiền", description "Còn nợ: {outstanding} đ".

**Form fields:**

| Field | Component | Rules |
|-------|-----------|-------|
| Số tiền (đ) | `UInput` type="number" | required, min: 1, max: outstanding |
| Phương thức | `USelect` items=PAYMENT_METHOD_OPTIONS | required, default: 'transfer' |
| Ngày thu | `UInput` type="date" | required, default: today |
| Ghi chú | `UInput` | optional, max: 500 |

**Footer:** "Hủy" (neutral outline) + "Ghi nhận" (primary, disabled khi amount invalid).

**Submit flow:**
1. `apiCreatePayment(receivableId, payload)`
2. Toast success: "Ghi nhận thu tiền thành công"
3. Close modal + `refresh()` detail data
4. Clear cache: `clearReceivableCache(id)`

#### Confirm Dialog: Xóa nợ

- Title: "Xác nhận xóa nợ"
- Message: "Khoản nợ còn {outstanding} đ sẽ được xóa. Hành động này không thể hoàn tác."
- Optional: `UInput` ghi chú lý do
- Buttons: "Quay lại" + "Xác nhận xóa nợ" (color="error")

**Submit flow:**
1. `apiWriteOffReceivable(receivableId, { note })`
2. Toast success: "Đã xóa nợ"
3. `refresh()` detail data

## 7. Components

### 7.1 Reuse từ project

- **Nuxt UI:** `UTable`, `UButton`, `USelect`, `UInput`, `UModal`, `UCard`, `UBadge`, `UAlert`, `UFormField`, `UEmpty`
- **Shared:** `SharedCrudPageHeader`, `SharedCrudTableWrapper`, `SharedCrudTablePagination`, `SharedSectionCard`, `SharedFieldDisplay`
- **Composables:** `useTableSearch`, `useUrlFilters`, `useBreadcrumb`
- **Utils:** `formatCurrency` từ `utils/number.ts`

### 7.2 Components mới

Không cần component riêng — dùng Nuxt UI + shared components hiện có. Logic ghi nhận thu tiền đủ đơn giản để inline trong page.

## 8. User Flows

### 8.1 Xem danh sách công nợ
1. Vào `/pmc/receivables`
2. Xem KPI cards (tổng phải thu, đã thu, còn nợ, số khoản)
3. Xem aging summary (4 bucket tuổi nợ)
4. Filter theo status / dự án / search
5. Click dòng → chi tiết

### 8.2 Xem chi tiết & ghi nhận thu tiền
1. Vào `/pmc/receivables/{id}`
2. Xem alert trạng thái + 3 summary cards
3. Xem thông tin công nợ (đơn hàng, khách hàng, dự án, hạn TT)
4. Xem lịch sử thu tiền
5. Bấm "Ghi nhận thu tiền" → modal
6. Nhập số tiền, phương thức, ngày thu, ghi chú
7. Submit → API → refresh data → status tự cập nhật

### 8.3 Xóa nợ
1. Vào chi tiết khoản công nợ (status = unpaid / partial / overdue)
2. Bấm "Xóa nợ" (sidebar)
3. Confirm dialog hiện → nhập ghi chú (optional)
4. Xác nhận → API → refresh → status = written_off

### 8.4 Từ trang Order
1. Khi Order transition → `confirmed` → backend tự tạo Receivable
2. User có thể navigate từ Order detail → link sang Receivable (nếu cần, bổ sung link trên Order detail page)

## 9. Format Helpers

```typescript
// Reuse formatCurrency từ utils/number.ts

// Aging display
function formatAgingDays(agingDays: number | null, status: string): string {
  if (status === 'paid' || status === 'written_off') return '—'
  if (agingDays === null || agingDays === 0) return 'Chưa đến hạn'
  return `${agingDays} ngày`
}
```

## 10. Thay đổi trên Order module (optional)

Bổ sung link sang Receivable trên trang Order detail (khi Order đã confirmed+):

```vue
<!-- Order detail — section thông tin, thêm field -->
<SharedFieldDisplay v-if="order.receivable" label="Công nợ">
  <NuxtLink :to="`/pmc/receivables/${order.receivable.id}`" class="text-primary underline">
    Xem công nợ
  </NuxtLink>
</SharedFieldDisplay>
```

> Cần bổ sung `receivable` relationship trong OrderDetailResource (BE) để trả `{ id, status, outstanding }`.
