# Nâng cấp Công nợ — Dòng tiền & Trạng thái mới - Đặc tả kỹ thuật Frontend

> Module: Kế toán/Tài chính / Công nợ phải thu (upgrade) | Ngày tạo: 2026-04-07 | Trạng thái: Draft

## 1. Tổng quan

Nâng cấp frontend Công nợ phải thu để hỗ trợ:
- **Trạng thái mới:** Overpaid (thu thừa), Completed (hoàn thành).
- **Hoàn trả (Refund):** Modal ghi nhận trả tiền khi thu thừa.
- **Button logic:** Hiện/ẩn button tùy trạng thái.
- **Đổi tên:** "Lịch sử thu tiền" → "Lịch sử dòng tiền".
- **Tiến độ đối soát:** Hiển thị trên chi tiết.

## 2. Cập nhật API Composable

**File:** `app/composables/api/useReceivables.ts`

### 2.1 Types cập nhật

```typescript
export type ReceivableStatus = 'unpaid' | 'partial' | 'paid' | 'overpaid' | 'overdue' | 'completed' | 'written_off'
export type PaymentReceiptTypeValue = 'collection' | 'refund'

// Thêm vào PaymentReceiptItem
interface PaymentReceiptItem {
  id: number
  type: { value: PaymentReceiptTypeValue; label: string }  // ← thêm
  amount: string
  payment_method: { value: PaymentMethodValue; label: string }
  collected_by: { id: number; name: string } | null
  note: string | null
  paid_at: string
  reconciliation_status: { value: string; label: string } | null  // ← thêm
  created_at: string
}

// Thêm vào ReceivableDetail
interface ReceivableDetail {
  // ... existing fields ...
  overpaid_amount: string          // ← thêm
  can_collect: boolean             // ← thêm
  can_refund: boolean              // ← thêm
  can_complete: boolean            // ← thêm
  reconciliation_progress: {       // ← thêm
    total: number
    reconciled: number
    pending: number
  }
}
```

### 2.2 Constants cập nhật

```typescript
export function receivableStatusColor(value: string): BadgeColor {
  switch (value) {
    case 'unpaid': return 'neutral'
    case 'partial': return 'warning'
    case 'paid': return 'success'
    case 'overpaid': return 'info'        // ← thêm
    case 'overdue': return 'error'
    case 'completed': return 'success'    // ← thêm
    case 'written_off': return 'neutral'
    default: return 'neutral'
  }
}

export const RECEIVABLE_STATUS_OPTIONS = [
  { label: 'Chưa thu', value: 'unpaid' },
  { label: 'Thu một phần', value: 'partial' },
  { label: 'Đã thu đủ', value: 'paid' },
  { label: 'Thu thừa', value: 'overpaid' },       // ← thêm
  { label: 'Quá hạn', value: 'overdue' },
  { label: 'Hoàn thành', value: 'completed' },    // ← thêm
  { label: 'Xóa nợ', value: 'written_off' },
] as const

export function paymentReceiptTypeColor(value: string): BadgeColor {
  return value === 'refund' ? 'warning' : 'success'
}
```

### 2.3 Mutations thêm

```typescript
/** Ghi nhận hoàn trả (refund) */
export function apiCreateRefund(receivableId: number, data: CreateRefundPayload) {
  return $api<{ success: boolean; data: ReceivableDetail }>(
    `/api/v1/pmc/receivables/${receivableId}/refund`,
    { method: 'POST', body: data }
  )
}

/** Chuyển trạng thái hoàn thành */
export function apiMarkCompleted(receivableId: number) {
  return $api<{ success: boolean; data: ReceivableDetail }>(
    `/api/v1/pmc/receivables/${receivableId}/complete`,
    { method: 'POST' }
  )
}
```

### 2.4 Payload types thêm

```typescript
interface CreateRefundPayload {
  amount: number
  payment_method: PaymentMethodValue
  note?: string | null
  paid_at: string
}
```

## 3. Cập nhật trang danh sách (`/pmc/receivables`)

### 3.1 Filter status

Cập nhật dropdown filter với các status mới (`overpaid`, `completed`).

### 3.2 Table

Không thay đổi cấu trúc columns. Chỉ cần đảm bảo:
- UBadge color mapping đúng cho `overpaid` (info) và `completed` (success).
- Aging hiển thị `—` cho `completed` (giống `paid`, `written_off`).

## 4. Cập nhật trang chi tiết (`/pmc/receivables/[id]`)

### 4.1 Status Alert — thêm cases

| Status | Color | Title | Description |
|--------|-------|-------|-------------|
| overpaid | `info` | Thu thừa | "Thu thừa {overpaid_amount} đ. Vui lòng ghi nhận hoàn trả." |
| completed | `success` | Hoàn thành | "Đã thu đủ và đối soát hoàn tất." |

### 4.2 Summary Cards — thêm card overpaid

Khi status = `overpaid`, hiện thêm card:

| Card | Value | Style |
|------|-------|-------|
| Thu thừa | `overpaid_amount` | `text-[var(--ui-info)]` |

### 4.3 Đổi tên Section

```
"Lịch sử thu tiền ({n})" → "Lịch sử dòng tiền ({n})"
```

### 4.4 Table dòng tiền — thêm cột Type

| Column | Key | Format |
|--------|-----|--------|
| Loại | `type` | `UBadge` — "Thu tiền" (success) / "Hoàn trả" (warning) |
| Đối soát | `reconciliation_status` | `UBadge` — "Chờ đối soát" (warning) / "Đã đối soát" (success) |

> Thêm 2 cột này vào bảng lịch sử dòng tiền.

### 4.5 Button logic — Sidebar

```vue
<template>
  <!-- Thu tiền — chỉ khi can_collect -->
  <UButton
    v-if="receivable.can_collect"
    label="Ghi nhận thu tiền"
    color="primary"
    block
    @click="openCollectionModal"
  />

  <!-- Hoàn trả — chỉ khi can_refund -->
  <UButton
    v-if="receivable.can_refund"
    label="Ghi nhận trả tiền"
    color="warning"
    block
    @click="openRefundModal"
  />

  <!-- Hoàn thành — chỉ khi can_complete -->
  <UButton
    v-if="receivable.can_complete"
    label="Hoàn thành"
    color="success"
    block
    @click="confirmComplete"
  />

  <!-- Xóa nợ — chỉ khi payable statuses -->
  <UButton
    v-if="receivable.can_collect"
    label="Xóa nợ"
    color="error"
    variant="outline"
    block
    @click="confirmWriteOff"
  />

  <!-- Trạng thái terminal -->
  <p v-if="receivable.status.value === 'completed'" class="text-sm text-muted">
    Khoản công nợ đã hoàn thành.
  </p>
</template>
```

### 4.6 Tiến độ đối soát — MỚI

Hiển thị trong sidebar hoặc main content:

```vue
<SharedSectionCard title="Tiến độ đối soát" compact>
  <div class="flex items-center gap-2">
    <UProgress
      :value="reconciliationPercent"
      :color="reconciliationPercent === 100 ? 'success' : 'warning'"
    />
    <span class="text-sm whitespace-nowrap">
      {{ reconciliation_progress.reconciled }}/{{ reconciliation_progress.total }}
    </span>
  </div>
  <p v-if="reconciliation_progress.pending > 0" class="text-sm text-muted mt-1">
    Còn {{ reconciliation_progress.pending }} dòng tiền chưa đối soát
  </p>
</SharedSectionCard>
```

## 5. Modal: Ghi nhận trả tiền — MỚI

`UModal` — title "Ghi nhận trả tiền", description "Thu thừa: {overpaid_amount} đ".

### 5.1 Form fields

| Field | Component | Rules |
|-------|-----------|-------|
| Số tiền (đ) | `UInput` type="number" | required, min: 1, max: overpaid_amount |
| Phương thức | `USelect` items=PAYMENT_METHOD_OPTIONS | required, default: 'transfer' |
| Ngày trả | `UInput` type="date" | required, default: today |
| Ghi chú | `UInput` | optional, max: 500 |

### 5.2 Quick-fill button

Button "Tất cả" → fill amount = overpaid_amount (trả hết phần thừa).

### 5.3 Submit flow

1. `apiCreateRefund(receivableId, payload)`
2. Toast success: "Ghi nhận trả tiền thành công"
3. Close modal + `refresh()` detail data

## 6. Confirm Dialog: Hoàn thành — MỚI

- Title: "Xác nhận hoàn thành"
- Message: "Khoản công nợ sẽ được đánh dấu hoàn thành. Đã đối soát {reconciled}/{total} dòng tiền."
- Buttons: "Quay lại" + "Xác nhận hoàn thành" (color="success")

### Submit flow

1. `apiMarkCompleted(receivableId)`
2. Toast success: "Đã hoàn thành khoản công nợ"
3. `refresh()` detail data

## 7. Modal: Ghi nhận thu tiền — CẬP NHẬT

### 7.1 Bỏ giới hạn max

Thay đổi validation:
- **Cũ:** `max: parseFloat(outstanding)` → không cho nhập quá số nợ
- **Mới:** `min: 0.01` (không giới hạn max)

### 7.2 Cảnh báo thu thừa

Khi `amount > outstanding`, hiển thị warning:

```vue
<UAlert
  v-if="paymentAmount > parseFloat(receivable.outstanding)"
  color="warning"
  variant="subtle"
  title="Số tiền vượt quá công nợ"
  :description="`Sẽ thu thừa ${formatCurrency(paymentAmount - parseFloat(receivable.outstanding))} đ`"
/>
```

## 8. User Flows

### 8.1 Thu tiền → Thu thừa → Hoàn trả → Hoàn thành

1. Vào chi tiết công nợ (status = partial)
2. Bấm "Ghi nhận thu tiền" → nhập số tiền > outstanding
3. Hệ thống cảnh báo thu thừa → xác nhận
4. Status chuyển → `overpaid`
5. Button đổi thành "Ghi nhận trả tiền"
6. Bấm "Ghi nhận trả tiền" → nhập số tiền hoàn trả
7. Status chuyển → `paid`
8. Đối soát tất cả dòng tiền (trang đối soát hoặc inline)
9. Button "Hoàn thành" xuất hiện → bấm → status = `completed`

### 8.2 Thu đủ → Đối soát → Hoàn thành

1. Vào chi tiết công nợ (status = partial)
2. Thu đủ số nợ còn lại → status = `paid`
3. Kiểm tra tiến độ đối soát trong sidebar
4. Khi 100% đối soát → button "Hoàn thành" xuất hiện
5. Bấm → status = `completed`

## 9. Components

### 9.1 Reuse

- Tất cả component hiện có giữ nguyên.
- Modal thu tiền: sửa validation + thêm warning.
- Thêm modal refund (cấu trúc tương tự modal thu tiền).

### 9.2 Không tạo component mới

Logic đủ đơn giản để inline trong page. Nếu modal thu tiền và refund share quá nhiều logic → extract `useReceivablePaymentModal()` composable.
