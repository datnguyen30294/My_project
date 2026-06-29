# Module Đối soát tài chính - Đặc tả kỹ thuật Frontend

> Module: Kế toán/Tài chính / Đối soát tài chính | Ngày tạo: 2026-04-07 | Trạng thái: Draft

## 1. Tổng quan

Frontend cho quản lý Đối soát tài chính: danh sách (summary cards + filter + bảng), chi tiết bản ghi đối soát, xác nhận đối soát đơn lẻ và hàng loạt.

**Scope:**
- Trang danh sách đối soát (summary, filter, table, batch reconcile)
- Trang chi tiết bản ghi đối soát (thông tin dòng tiền + công nợ + xác nhận)

## 2. Routes (Pages)

| Route | File | Mô tả |
|-------|------|-------|
| `/pmc/ke-toan-tai-chinh/doi-soat-tai-chinh` | `app/pages/pmc/ke-toan-tai-chinh/doi-soat-tai-chinh/index.vue` | Danh sách + summary |
| `/pmc/ke-toan-tai-chinh/doi-soat-tai-chinh/[id]` | `app/pages/pmc/ke-toan-tai-chinh/doi-soat-tai-chinh/[id]/index.vue` | Chi tiết + xác nhận |

## 3. Navigation & Breadcrumb

### 3.1 Sidebar

Thêm item vào group "Kế toán/Tài chính" trong `useNavigation.ts`:

```typescript
{
  label: 'Kế toán/Tài chính',
  icon: 'account_balance',
  children: [
    { label: 'Cấu hình hoa hồng', to: '/pmc/commission' },
    { label: 'Công nợ phải thu', to: '/pmc/receivables' },
    { label: 'Đối soát tài chính', to: '/pmc/ke-toan-tai-chinh/doi-soat-tai-chinh' }  // ← thêm
  ]
}
```

### 3.2 Breadcrumb

```typescript
// ROUTE_LABELS
'doi-soat-tai-chinh': 'Đối soát tài chính'

// PARENT_GROUP
'doi-soat-tai-chinh': 'Kế toán/Tài chính'
```

Breadcrumb trail: `Trang chủ > Kế toán/Tài chính > Đối soát tài chính > Chi tiết đối soát #ID`

## 4. API Composable

**File:** `app/composables/api/useReconciliations.ts`

### 4.1 Queries (GET — useApiFetch)

| Function | Endpoint | Mô tả |
|----------|----------|-------|
| `useReconciliationList(params)` | `GET /api/v1/pmc/reconciliations` | Danh sách phân trang |
| `useReconciliationSummary(params)` | `GET /api/v1/pmc/reconciliations/summary` | Summary KPI |
| `useReconciliationDetail(id)` | `GET /api/v1/pmc/reconciliations/{id}` | Chi tiết |

### 4.2 Mutations (POST — $api)

| Function | Endpoint | Mô tả |
|----------|----------|-------|
| `apiReconcile(id, data)` | `POST /api/v1/pmc/reconciliations/{id}/reconcile` | Xác nhận đối soát |
| `apiBatchReconcile(data)` | `POST /api/v1/pmc/reconciliations/batch-reconcile` | Đối soát hàng loạt |

### 4.3 Types

```typescript
export type ReconciliationStatusValue = 'pending' | 'reconciled'

export interface ReconciliationListItem {
  id: number
  receivable: {
    id: number
    order_code: string
    requester_name: string
    apartment_name: string | null
    amount: string
    paid_amount: string
    status: { value: string; label: string }
  }
  project: { id: number; name: string }
  payment_receipt: {
    id: number
    type: { value: string; label: string }
    amount: string
    payment_method: { value: string; label: string }
    collected_by: { id: number; name: string } | null
    paid_at: string
  }
  status: { value: ReconciliationStatusValue; label: string }
  reconciled_at: string | null
  reconciled_by: { id: number; name: string } | null
  note: string | null
  created_at: string
}

export interface ReconciliationSummary {
  total_count: number
  pending_count: number
  reconciled_count: number
  pending_amount: string
  reconciled_amount: string
}

export interface ReconciliationDetail {
  id: number
  receivable: {
    id: number
    order: { id: number; code: string }
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
    status: { value: string; label: string }
  }
  payment_receipt: {
    id: number
    type: { value: string; label: string }
    amount: string
    payment_method: { value: string; label: string }
    collected_by: { id: number; name: string } | null
    note: string | null
    paid_at: string
  }
  status: { value: ReconciliationStatusValue; label: string }
  reconciled_at: string | null
  reconciled_by: { id: number; name: string } | null
  note: string | null
  created_at: string
  updated_at: string
}
```

### 4.4 Constants & Helpers

```typescript
export function reconciliationStatusColor(value: string): BadgeColor {
  return value === 'reconciled' ? 'success' : 'warning'
}

export const RECONCILIATION_STATUS_OPTIONS = [
  { label: 'Chờ đối soát', value: 'pending' },
  { label: 'Đã đối soát', value: 'reconciled' },
] as const
```

## 5. Pages

### 5.1 Danh sách đối soát (`/pmc/ke-toan-tai-chinh/doi-soat-tai-chinh`)

**Layout:** Summary cards → Filter + Table.

#### Section 1: Summary Cards

3 cards ngang — grid `grid-cols-1 sm:grid-cols-3`.

| Card | Value | Style |
|------|-------|-------|
| Tổng dòng tiền | `total_count` | number |
| Chờ đối soát | `pending_count` + `pending_amount` | `text-[var(--ui-warning)]` |
| Đã đối soát | `reconciled_count` + `reconciled_amount` | `text-[var(--ui-success)]` |

#### Section 2: Filter + Table

**Header:** `SharedCrudPageHeader` — title "Đối soát tài chính".

**Header action:** Button "Đối soát đã chọn" — disabled khi chưa chọn rows. Color `primary`.

**Filters:**

| Filter | Component | Mô tả |
|--------|-----------|-------|
| Search | `UInput` (debounced) | Tìm theo mã đơn, tên khách hàng |
| Trạng thái | `USelect` | RECONCILIATION_STATUS_OPTIONS + "Tất cả" |
| Loại | `USelect` | Collection / Refund + "Tất cả" |
| Dự án | `USelect` | Load từ `useProjectList()` + "Tất cả" |
| Từ ngày | `UInput` type="date" | Filter paid_at from |
| Đến ngày | `UInput` type="date" | Filter paid_at to |

**Table columns:**

| Column | Key | Format |
|--------|-----|--------|
| ☐ | checkbox | Selection cho batch reconcile |
| Mã đơn | `receivable.order_code` | mono text, link → `/pmc/receivables/{receivable.id}` |
| Khách hàng | `receivable.requester_name` | text |
| Dự án | `project.name` | text |
| Loại | `payment_receipt.type` | `UBadge` — Thu tiền (success) / Hoàn trả (warning) |
| Số tiền | `payment_receipt.amount` | `formatCurrency()` |
| Phương thức | `payment_receipt.payment_method` | `UBadge` variant subtle |
| Ngày giao dịch | `payment_receipt.paid_at` | datetime |
| TT đối soát | `status` | `UBadge` (warning/success) |
| Ngày đối soát | `reconciled_at` | datetime hoặc "—" |
| Người đối soát | `reconciled_by.name` | text hoặc "—" |
| Thao tác | — | Button "Đối soát" (chỉ khi pending) / "Chi tiết" |

**Row click:** Navigate → `/pmc/ke-toan-tai-chinh/doi-soat-tai-chinh/{id}`

**Selection + Batch Reconcile:**
- Checkbox chỉ enable cho rows `pending`.
- Button "Đối soát đã chọn ({n})" → confirm dialog → `apiBatchReconcile({ ids, note })`.
- Sau batch: toast success + refresh list + clear selection.

**Pagination:** `SharedCrudTablePagination`

### 5.2 Chi tiết đối soát (`/pmc/ke-toan-tai-chinh/doi-soat-tai-chinh/[id]`)

**Layout:** 2 columns (2/3 main + 1/3 sidebar).

#### Main Content (left 2/3)

**Section 1: Status Alert**

| Status | Color | Title | Description |
|--------|-------|-------|-------------|
| pending | `warning` | Chờ đối soát | "Dòng tiền chưa được đối soát." |
| reconciled | `success` | Đã đối soát | "Đã đối soát lúc {reconciled_at} bởi {reconciled_by.name}." |

**Section 2: Thông tin dòng tiền**

`SharedSectionCard` title "Thông tin dòng tiền".

| Field | Value | Format |
|-------|-------|--------|
| Loại | `payment_receipt.type` | UBadge |
| Số tiền | `payment_receipt.amount` | `formatCurrency()`, font-bold |
| Phương thức | `payment_receipt.payment_method` | UBadge |
| Ngày giao dịch | `payment_receipt.paid_at` | datetime |
| Người thu/trả | `payment_receipt.collected_by.name` | text hoặc "—" |
| Ghi chú | `payment_receipt.note` | text hoặc "—" |

**Section 3: Thông tin công nợ liên quan**

`SharedSectionCard` title "Công nợ liên quan".

| Field | Value | Format |
|-------|-------|--------|
| Đơn hàng | `receivable.order.code` | Link → `/pmc/orders/{id}` |
| Khách hàng | `receivable.og_ticket.requester_name` | text |
| SĐT | `receivable.og_ticket.requester_phone` | text |
| Căn hộ | `receivable.og_ticket.apartment_name` | text hoặc "—" |
| Dự án | `receivable.project.name` | text |
| Phải thu | `receivable.amount` | `formatCurrency()` |
| Đã thu | `receivable.paid_amount` | `formatCurrency()` |
| TT công nợ | `receivable.status` | UBadge |
| Xem công nợ | link | Link → `/pmc/receivables/{receivable.id}` |

#### Sidebar (right 1/3)

**Card 1: Hành động**

Chỉ hiện khi `status = pending`:

- Button "Xác nhận đối soát" → confirm dialog. `color="primary"`, full width.
- `UInput` ghi chú (optional, dưới button).

Khi `status = reconciled`:

```vue
<div class="text-sm text-muted space-y-1">
  <p>Đã đối soát</p>
  <p>{{ formatDateTime(reconciled_at) }}</p>
  <p>Bởi: {{ reconciled_by.name }}</p>
  <p v-if="note">Ghi chú: {{ note }}</p>
</div>
```

**Card 2: Thông tin**

| Field | Value |
|-------|-------|
| Trạng thái | UBadge |
| Tạo lúc | `created_at` |
| Cập nhật | `updated_at` |

## 6. Confirm Dialog: Xác nhận đối soát

- Title: "Xác nhận đối soát"
- Message: "Xác nhận dòng tiền {amount} đ ({type}) cho đơn {order_code}?"
- Optional: `UInput` ghi chú
- Buttons: "Quay lại" + "Xác nhận" (color="primary")

### Submit flow

1. `apiReconcile(reconciliationId, { note })`
2. Toast success: "Đã xác nhận đối soát"
3. `refresh()` detail data

## 7. Confirm Dialog: Đối soát hàng loạt

- Title: "Đối soát hàng loạt"
- Message: "Xác nhận đối soát {n} dòng tiền?"
- Optional: `UInput` ghi chú chung
- Buttons: "Quay lại" + "Xác nhận ({n})" (color="primary")

### Submit flow

1. `apiBatchReconcile({ ids: selectedIds, note })`
2. Toast success: "Đã đối soát {reconciled_count} dòng tiền"
3. `refresh()` list data + clear selection

## 8. User Flows

### 8.1 Đối soát từng dòng tiền

1. Vào `/pmc/ke-toan-tai-chinh/doi-soat-tai-chinh`
2. Filter status = "Chờ đối soát"
3. Click dòng → chi tiết
4. Xem thông tin dòng tiền + công nợ liên quan
5. Kiểm tra khớp với sao kê ngân hàng / biên lai
6. Bấm "Xác nhận đối soát" → nhập ghi chú → xác nhận
7. Status chuyển → `reconciled`

### 8.2 Đối soát hàng loạt

1. Vào danh sách đối soát
2. Filter theo dự án / khoảng thời gian
3. Tick checkbox các dòng pending
4. Bấm "Đối soát đã chọn ({n})"
5. Confirm dialog → nhập ghi chú chung → xác nhận
6. Tất cả chuyển → `reconciled`

### 8.3 Từ trang Công nợ chi tiết

1. Xem chi tiết công nợ → section "Tiến độ đối soát"
2. Thấy tiến độ chưa 100%
3. Click link đối soát → navigate đến danh sách đối soát (filter by receivable_id)

## 9. Components

### 9.1 Reuse từ project

- **Nuxt UI:** `UTable`, `UButton`, `USelect`, `UInput`, `UCard`, `UBadge`, `UAlert`, `UFormField`, `UCheckbox`, `UProgress`
- **Shared:** `SharedCrudPageHeader`, `SharedCrudTableWrapper`, `SharedCrudTablePagination`, `SharedSectionCard`, `SharedFieldDisplay`
- **Composables:** `useTableSearch`, `useUrlFilters`, `useBreadcrumb`
- **Utils:** `formatCurrency`, `formatDateTime`

### 9.2 Components mới

Không cần component riêng — dùng Nuxt UI + shared components hiện có.

## 10. Liên kết giữa Receivable và Reconciliation

### 10.1 Từ trang Công nợ chi tiết

Link đến danh sách đối soát filter theo receivable:

```vue
<NuxtLink :to="`/pmc/ke-toan-tai-chinh/doi-soat-tai-chinh?receivable_id=${receivable.id}`">
  Xem đối soát ({{ reconciliation_progress.pending }} chờ)
</NuxtLink>
```

### 10.2 Từ trang Đối soát chi tiết

Link về trang công nợ:

```vue
<NuxtLink :to="`/pmc/receivables/${receivable.id}`">
  Xem công nợ
</NuxtLink>
```
