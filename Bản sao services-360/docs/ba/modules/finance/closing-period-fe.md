# Kỳ chốt phí - Đặc tả nghiệp vụ Frontend

> Module: Kế toán/Tài chính / Kỳ chốt phí | Ngày tạo: 2026-04-08 | Trạng thái: Draft

## 1. Tổng quan

Frontend cho quản lý **Kỳ chốt phí**: tạo kỳ, thêm đơn đủ điều kiện, chốt kỳ (khóa tài chính), mở lại, xem chi tiết snapshot hoa hồng.

**Scope:**
- Trang danh sách kỳ chốt (grid cards + bảng đơn trong kỳ đang mở)
- Trang chi tiết kỳ chốt (thông tin kỳ + danh sách đơn + snapshot hoa hồng)
- Modal tạo kỳ mới
- Modal thêm đơn vào kỳ (chọn từ eligible orders)
- Guard khóa tài chính trên trang chi tiết đơn hàng

**Điều kiện nghiệp vụ quan trọng:**
- Đơn hàng **hoàn thành** (`completed`) + **thu hết công nợ** (`receivable.status = paid`) mới được đưa vào kỳ chốt phí
- 1 đơn chỉ thuộc 1 kỳ duy nhất
- Chỉ có 1 kỳ `open` tại 1 thời điểm

## 2. Routes (Pages)

| Route | File | Mô tả |
|-------|------|-------|
| `/pmc/ke-toan-tai-chinh/ky-chot-phi` | `app/pages/pmc/ke-toan-tai-chinh/ky-chot-phi/index.vue` | Danh sách kỳ (grid cards) + đơn trong kỳ mở |
| `/pmc/ke-toan-tai-chinh/ky-chot-phi/[id]` | `app/pages/pmc/ke-toan-tai-chinh/ky-chot-phi/[id]/index.vue` | Chi tiết kỳ + danh sách đơn + snapshot HH |

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
    { label: 'Đối soát tài chính', to: '/pmc/ke-toan-tai-chinh/doi-soat-tai-chinh' },
    { label: 'Kỳ chốt phí', to: '/pmc/ke-toan-tai-chinh/ky-chot-phi' }  // ← thêm
  ]
}
```

### 3.2 Breadcrumb

```typescript
// ROUTE_LABELS
'ky-chot-phi': 'Kỳ chốt phí'

// PARENT_GROUP
'ky-chot-phi': 'Kế toán/Tài chính'
```

Breadcrumb trail: `Trang chủ > Kế toán/Tài chính > Kỳ chốt phí > Chi tiết kỳ "{name}"`

## 4. API Composable

**File:** `app/composables/api/useClosingPeriods.ts`

### 4.1 Queries (GET — useApiFetch)

| Function | Endpoint | Mô tả |
|----------|----------|-------|
| `useClosingPeriodList(params)` | `GET /api/v1/pmc/closing-periods` | Danh sách kỳ phân trang |
| `useClosingPeriodDetail(id)` | `GET /api/v1/pmc/closing-periods/{id}` | Chi tiết kỳ + đơn + snapshot |
| `useEligibleOrders(periodId)` | `GET /api/v1/pmc/closing-periods/{id}/eligible-orders` | Đơn đủ điều kiện thêm vào kỳ |

### 4.2 Mutations (POST/DELETE — $api)

| Function | Endpoint | Mô tả |
|----------|----------|-------|
| `apiCreateClosingPeriod(data)` | `POST /api/v1/pmc/closing-periods` | Tạo kỳ mới |
| `apiAddOrders(periodId, data)` | `POST /api/v1/pmc/closing-periods/{id}/add-orders` | Thêm đơn vào kỳ |
| `apiRemoveOrder(periodId, orderId)` | `DELETE /api/v1/pmc/closing-periods/{id}/orders/{orderId}` | Xóa đơn khỏi kỳ |
| `apiClosePeriod(periodId, data)` | `POST /api/v1/pmc/closing-periods/{id}/close` | Chốt kỳ |
| `apiReopenPeriod(periodId, data)` | `POST /api/v1/pmc/closing-periods/{id}/reopen` | Mở lại kỳ |
| `apiRecalculateOrder(periodId, orderId)` | `POST /api/v1/pmc/closing-periods/{id}/orders/{orderId}/recalculate` | Tính lại HH |

### 4.3 Types

```typescript
export type ClosingPeriodStatusValue = 'open' | 'closed'

export interface ClosingPeriodListItem {
  id: number
  project: { id: number; name: string } | null
  name: string
  period_start: string
  period_end: string
  status: { value: ClosingPeriodStatusValue; label: string }
  orders_count: number
  total_receivable: string
  total_commission: string
  closed_at: string | null
  closed_by: { id: number; name: string } | null
  created_at: string
}

export interface ClosingPeriodDetail {
  id: number
  project: { id: number; name: string } | null
  name: string
  period_start: string
  period_end: string
  status: { value: ClosingPeriodStatusValue; label: string }
  closed_at: string | null
  closed_by: { id: number; name: string } | null
  note: string | null
  orders: ClosingPeriodOrderItem[]
  created_at: string
  updated_at: string
}

export interface ClosingPeriodOrderItem {
  id: number
  order: { id: number; code: string }
  frozen_receivable_amount: string
  frozen_commission_total: string
  snapshots: CommissionSnapshotItem[]
}

export interface CommissionSnapshotItem {
  id: number
  recipient_type: string
  recipient_name: string
  account_id: number | null
  value_type: string
  percent: string | null
  value_fixed: string | null
  amount: string
  resolved_from: string
}

export interface EligibleOrderItem {
  id: number
  code: string
  total_amount: string
  receivable_amount: string
  project: { id: number; name: string }
}
```

### 4.4 Constants & Helpers

```typescript
export function closingPeriodStatusColor(value: string): BadgeColor {
  return value === 'closed' ? 'success' : 'primary'
}

export const CLOSING_PERIOD_STATUS_OPTIONS = [
  { label: 'Đang mở', value: 'open' },
  { label: 'Đã chốt', value: 'closed' },
] as const
```

## 5. Pages

### 5.1 Danh sách kỳ chốt phí (`/pmc/ke-toan-tai-chinh/ky-chot-phi`)

**Layout:** Header → Grid cards (danh sách kỳ) → Table (đơn trong kỳ đang mở)

#### Section 1: Page Header

- Title: "Kỳ chốt phí"
- Action: Button "Tạo kỳ mới" (icon: `i-lucide-plus`, color: `primary`) → mở modal tạo kỳ

#### Section 2: Filters (optional)

| Filter | Component | Mô tả |
|--------|-----------|-------|
| Trạng thái | `USelect` | CLOSING_PERIOD_STATUS_OPTIONS + "Tất cả" |
| Dự án | `USelect` | Load từ `useProjectList()` + "Tất cả" |

#### Section 3: Grid Cards — Danh sách kỳ

**Layout:** `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`

Mỗi `UCard` đại diện 1 kỳ chốt:

**Card header:**
- Tên kỳ (font-semibold) + `UBadge` trạng thái (variant="soft")

**Card body (text-sm, space-y-2):**

| Field | Label | Format |
|-------|-------|--------|
| Khoảng thời gian | `text-muted` | `period_start` — `period_end` |
| Số đơn trong kỳ | `text-muted` | `orders_count` (font-medium) |
| Tổng phải thu | `text-muted` | `total_receivable` (formatCurrency) |
| Tổng hoa hồng | `text-muted` | `total_commission` (formatCurrency) |
| Chốt lúc | `text-muted` | `closed_at` (formatDateTime) — chỉ hiện khi đã chốt |
| Ghi chú | `text-xs text-muted` | `note` — chỉ hiện khi có |

**Card footer — actions theo status:**

| Status | Button 1 | Button 2 |
|--------|----------|----------|
| `open` | "Thêm đơn" (variant=outline, icon=`i-lucide-plus`, size=xs) | "Chốt kỳ" (color=success, icon=`i-lucide-lock`, size=xs) |
| `closed` | "Mở lại" (variant=outline, color=warning, icon=`i-lucide-unlock`, size=xs) | — |

**Click card:** Navigate → `/pmc/ke-toan-tai-chinh/ky-chot-phi/{id}`

#### Section 4: Bảng đơn trong kỳ đang mở

Chỉ hiển thị khi có kỳ `open`.

**Card header:** "Đơn trong kỳ '{currentOpenPeriod.name}'"

**Table columns:**

| Column | Key | Format |
|--------|-----|--------|
| Mã đơn | `order.code` | Link → `/pmc/orders/{order.id}`, mono text, underline |
| Phải thu (chốt) | `frozen_receivable_amount` | `formatCurrency()` |
| Hoa hồng (chốt) | `frozen_commission_total` | `formatCurrency()` |
| Thao tác | — | Button "Xóa" (icon=`i-lucide-trash-2`, size=xs, variant=ghost, color=error) |

**Xóa đơn:** Chỉ cho phép khi kỳ `open`. Confirm dialog trước khi xóa.

**Empty state:** `UEmpty` — title "Chưa có đơn nào trong kỳ này", description "Bấm 'Thêm đơn' để thêm đơn đã hoàn thành và thu hết công nợ vào kỳ."

### 5.2 Chi tiết kỳ chốt phí (`/pmc/ke-toan-tai-chinh/ky-chot-phi/[id]`)

**Layout:** 2 columns (2/3 main + 1/3 sidebar)

#### Main Content (left 2/3)

**Section 1: Status Alert**

| Status | Color | Title | Description |
|--------|-------|-------|-------------|
| `open` | `info` | Kỳ đang mở | "Có thể thêm/bớt đơn và tính lại hoa hồng." |
| `closed` | `success` | Đã chốt | "Kỳ đã chốt lúc {closed_at} bởi {closed_by.name}. Tất cả đơn trong kỳ bị khóa tài chính." |

**Section 2: Thông tin kỳ**

`SharedSectionCard` title "Thông tin kỳ chốt".

| Field | Value | Format |
|-------|-------|--------|
| Tên kỳ | `name` | text |
| Dự án | `project.name` | text, hoặc "Toàn hệ thống" nếu null |
| Khoảng thời gian | `period_start` — `period_end` | date range |
| Trạng thái | `status` | UBadge |
| Chốt lúc | `closed_at` | datetime hoặc "—" |
| Người chốt | `closed_by.name` | text hoặc "—" |
| Ghi chú | `note` | text hoặc "—" |

**Section 3: Danh sách đơn trong kỳ**

`SharedSectionCard` title "Đơn trong kỳ ({orders.length})".

Header action (khi kỳ `open`): Button "Thêm đơn" (icon=`i-lucide-plus`, size=xs) → mở modal chọn đơn.

**Table columns:**

| Column | Key | Format |
|--------|-----|--------|
| Mã đơn | `order.code` | Link → `/pmc/orders/{order.id}` |
| Phải thu (chốt) | `frozen_receivable_amount` | `formatCurrency()` |
| Hoa hồng (chốt) | `frozen_commission_total` | `formatCurrency()` |
| Thao tác | — | Kỳ open: "Tính lại" + "Xóa". Kỳ closed: không có |

**Row expandable:** Click mở → hiển thị bảng snapshot hoa hồng:

| Column | Key | Format |
|--------|-----|--------|
| Loại | `recipient_type` | Text (Platform, Staff, Department...) |
| Người nhận | `recipient_name` | text |
| Loại giá trị | `value_type` | Text (percent, fixed, both) |
| % | `percent` | number + "%" hoặc "—" |
| Tiền cứng | `value_fixed` | formatCurrency hoặc "—" |
| Số tiền HH | `amount` | formatCurrency, font-bold |
| Nguồn | `resolved_from` | UBadge — "config" (neutral) / "override" (warning) |

**Footer row:** Tổng hoa hồng = `frozen_commission_total` (bold)

#### Sidebar (right 1/3)

**Card 1: Hành động**

Khi `status = open`:
- Button "Chốt kỳ" (color=success, icon=`i-lucide-lock`, block)
- `UTextarea` ghi chú (optional, placeholder "Ghi chú khi chốt...")

Khi `status = closed`:
- Button "Mở lại" (color=warning, variant=outline, icon=`i-lucide-unlock`, block)
- `UTextarea` ghi chú (optional, placeholder "Lý do mở lại...")

**Card 2: Tổng hợp**

| Field | Value |
|-------|-------|
| Số đơn | `orders.length` |
| Tổng phải thu | SUM `frozen_receivable_amount` (formatCurrency) |
| Tổng hoa hồng | SUM `frozen_commission_total` (formatCurrency) |
| Tạo lúc | `created_at` (datetime) |
| Cập nhật | `updated_at` (datetime) |

## 6. Modal: Tạo kỳ mới

**Trigger:** Button "Tạo kỳ mới" trên page header.

**Title:** "Tạo kỳ chốt mới"

**Form fields:**

| Field | Label | Component | Required | Placeholder |
|-------|-------|-----------|----------|-------------|
| `name` | Tên kỳ | `UInput` | Yes | "VD: Tháng 4/2026" |
| `period_start` | Từ ngày | `UInput` type=date | Yes | — |
| `period_end` | Đến ngày | `UInput` type=date | Yes | — |
| `project_id` | Dự án | `USelect` | No | "Toàn hệ thống" |

**Footer:**
- "Hủy" (neutral, variant=outline) → đóng modal
- "Tạo" (primary) → disabled khi `!name || !period_start || !period_end`

**Submit flow:**
1. `apiCreateClosingPeriod({ name, period_start, period_end, project_id })`
2. Toast success: "Đã tạo kỳ chốt"
3. `refresh()` danh sách + đóng modal + reset form

## 7. Modal: Thêm đơn vào kỳ

**Trigger:** Button "Thêm đơn" trên card kỳ open hoặc trang chi tiết.

**Title:** "Thêm đơn vào kỳ '{periodName}'"

**Content:**
- Gọi `useEligibleOrders(periodId)` để load danh sách đơn đủ điều kiện
- Hiển thị `UAlert` (color=info, variant=subtle): "Chỉ hiển thị đơn đã hoàn thành và thu hết công nợ, chưa thuộc kỳ chốt nào."

**Table (selectable với checkbox):**

| Column | Key | Format |
|--------|-----|--------|
| ☐ | checkbox | Select all / individual |
| Mã đơn | `code` | text |
| Tổng đơn | `total_amount` | formatCurrency |
| Phải thu | `receivable_amount` | formatCurrency |
| Dự án | `project.name` | text |

**Empty state:** "Không có đơn nào đủ điều kiện. Đơn cần hoàn thành và thu hết công nợ."

**Footer:**
- "Hủy" (neutral, variant=outline)
- "Thêm ({n} đơn)" (primary) → disabled khi chưa chọn đơn nào

**Submit flow:**
1. `apiAddOrders(periodId, { order_ids: selectedIds })`
2. Toast success: "Đã thêm {n} đơn vào kỳ"
3. `refresh()` chi tiết/danh sách + đóng modal + clear selection

## 8. Confirm Dialogs

### 8.1 Chốt kỳ

- Title: "Chốt kỳ '{name}'?"
- Message: "Sau khi chốt, tất cả {n} đơn trong kỳ sẽ bị khóa tài chính. Bạn có thể mở lại sau nếu cần."
- Buttons: "Quay lại" + "Chốt kỳ" (color=success)

### 8.2 Mở lại kỳ

- Title: "Mở lại kỳ '{name}'?"
- Message: "Mở lại sẽ mở khóa tài chính cho tất cả đơn trong kỳ. Bạn có chắc chắn?"
- Color: warning
- Buttons: "Quay lại" + "Mở lại" (color=warning)

### 8.3 Xóa đơn khỏi kỳ

- Title: "Xóa đơn khỏi kỳ?"
- Message: "Xóa đơn '{orderCode}' khỏi kỳ '{periodName}'? Snapshot hoa hồng sẽ bị xóa theo."
- Buttons: "Quay lại" + "Xóa" (color=error)

### 8.4 Tính lại hoa hồng

- Title: "Tính lại hoa hồng?"
- Message: "Tính lại snapshot hoa hồng cho đơn '{orderCode}' từ cấu hình/override hiện tại?"
- Buttons: "Quay lại" + "Tính lại" (color=primary)

## 9. Guard khóa tài chính trên Order Detail

### 9.1 Tích hợp trên trang chi tiết đơn hàng

Khi đơn thuộc kỳ đã chốt (`isFinanciallyLocked = true`):

- Hiển thị `UAlert` (color=error, variant=subtle) ở đầu trang:
  - Title: "Khóa tài chính"
  - Description: "Đơn đã nằm trong kỳ chốt '{periodName}'. Không thể điều chỉnh hoa hồng."
- Disable button sửa commission override
- Link "Xem kỳ chốt" → navigate đến `/pmc/ke-toan-tai-chinh/ky-chot-phi/{periodId}`

### 9.2 API bổ sung

Trang chi tiết đơn cần gọi thêm:

```typescript
// Trong useOrders.ts hoặc useClosingPeriods.ts
export function useOrderFinancialLock(orderId: MaybeRef<number>) {
  return useApiFetch<{
    is_locked: boolean
    period: { id: number; name: string; status: { value: string; label: string } } | null
  }>(() => `/api/v1/pmc/closing-periods/order-lock/${toValue(orderId)}`)
}
```

Hoặc: thông tin lock đã bao gồm trong `OrderDetailResource` (backend trả thêm field `financial_lock`).

## 10. User Flows

### 10.1 Tạo kỳ mới

```
Danh sách kỳ → "Tạo kỳ mới" → Modal form → Điền tên + khoảng thời gian → "Tạo"
  ✓ Thành công: Toast + kỳ mới xuất hiện trong grid (status = open)
  ✗ Lỗi (đã có kỳ open): Toast error "Chỉ được có 1 kỳ mở tại 1 thời điểm"
```

### 10.2 Thêm đơn vào kỳ

```
Card kỳ open → "Thêm đơn" → Modal danh sách eligible orders
  → Tick chọn đơn → "Thêm ({n} đơn)"
  → Hệ thống tính HH + lưu snapshot → Toast success
  ✗ Không có đơn eligible: Empty state "Không có đơn nào đủ điều kiện"
```

### 10.3 Chốt kỳ

```
Card kỳ open → "Chốt kỳ" → Confirm dialog (nhập ghi chú optional) → "Chốt kỳ"
  → Status = closed, đơn bị khóa tài chính → Toast success
  ✗ Kỳ không có đơn: Toast warning "Kỳ chưa có đơn nào"
```

### 10.4 Mở lại kỳ

```
Card kỳ closed → "Mở lại" → Confirm dialog (warning, nhập lý do) → "Mở lại"
  → Status = open, đơn mở khóa → Toast success
  ✗ Đã có kỳ open khác: Toast error "Chỉ được có 1 kỳ mở tại 1 thời điểm"
```

### 10.5 Xem chi tiết + tính lại HH

```
Click card kỳ → Trang chi tiết → Xem danh sách đơn + snapshot HH
  → Click expand row → Xem chi tiết chia HH per recipient
  → (Kỳ open) Click "Tính lại" → Confirm → Snapshot cập nhật → Toast success
```

### 10.6 Xóa đơn khỏi kỳ

```
Trang chi tiết / danh sách (kỳ open) → Icon "Xóa" → Confirm dialog → "Xóa"
  → Đơn + snapshot bị xóa → Toast success + refresh
```

## 11. Components

### 11.1 Reuse từ project

- **Nuxt UI:** `UCard`, `UButton`, `UBadge`, `UTable`, `UModal`, `UInput`, `USelect`, `UTextarea`, `UFormField`, `UAlert`, `UEmpty`, `UCheckbox`
- **Shared:** `SharedSectionCard`, `SharedCrudPageHeader`, `SharedFieldDisplay`
- **Composables:** `useBreadcrumb`, `useUrlFilters`
- **Utils:** `formatCurrency`, `formatDateTime`, `formatDate`

### 11.2 Components mới

Không cần component riêng — dùng Nuxt UI + shared components hiện có.

## 12. Ghi chú nghiệp vụ

- **Điều kiện thêm đơn:** Order `status = completed` + Receivable `status = paid` + chưa thuộc kỳ chốt nào. Backend validate, FE chỉ hiển thị eligible orders.
- **1 đơn = 1 kỳ:** Unique constraint global trên `order_id`. Đơn đã thuộc kỳ (dù open hay closed) sẽ không xuất hiện trong eligible orders.
- **Snapshot = kết quả tính toán:** FE chỉ hiển thị, không tính toán. Tất cả tính toán HH diễn ra trên backend.
- **Financial lock độc lập:** Guard tài chính không liên quan đến order status. Đơn `completed` nhưng thuộc kỳ `closed` → readonly cho commission.
- **Không có page edit kỳ:** Thông tin kỳ (tên, ngày) không cho sửa sau khi tạo. Chỉ có thao tác: thêm/bớt đơn, chốt, mở lại.
