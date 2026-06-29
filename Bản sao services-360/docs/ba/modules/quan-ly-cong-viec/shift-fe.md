# Quản lý ca làm việc — Spec FE

> Ngày tạo: 2026-04-15 | Trạng thái: Draft
> Liên quan: `shift-be.md`, `work-slot-snapshot.md`

## 1. Tổng quan

Trang admin quản lý ca làm việc (CRUD đầy đủ). Thay thế luồng fix cứng bằng seeder ở v1.

**Đường dẫn:** `/quan-ly-cong-viec/shifts`
**File:** `frontend/app/pages/quan-ly-cong-viec/shifts/index.vue`

## 2. Bố cục trang

```
┌──────────────────────────────────────────────────────────────┐
│ Breadcrumb: Trang chủ / Quản lý công việc / Quản lý ca       │
│ Heading: Quản lý ca làm việc    [+ Thêm ca mới]              │
│ Subtitle: "Tạo và quản lý các ca làm việc template áp dụng.."│
├──────────────────────────────────────────────────────────────┤
│ [Stats Bar — 3 cards]                                        │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐          │
│  │ Tổng số ca   │ │ Đang dùng    │ │ Tạm ẩn       │          │
│  │    15        │ │    15        │ │    0         │          │
│  └──────────────┘ └──────────────┘ └──────────────┘          │
├──────────────────────────────────────────────────────────────┤
│ [UAlert info] Giải thích mục đích quản lý ca                 │
├──────────────────────────────────────────────────────────────┤
│ [Search input] [Filter status ▾] [Filter type ▾]             │
├──────────────────────────────────────────────────────────────┤
│ [UTable — Shift list]                                        │
│  Mã ca | Tên | Kiểu ca | Nhóm xử lý | Khung giờ | Giờ nghỉ  │
│  | Giờ công | Trạng thái | Tác vụ                           │
├──────────────────────────────────────────────────────────────┤
│ [Pagination]                                                 │
└──────────────────────────────────────────────────────────────┘
```

## 3. Components mới

### 3.1 `components/shared/shift/ShiftStatsBar.vue`

```vue
<script setup lang="ts">
interface Props {
  stats: { total: number; active: number; inactive: number } | null
  pending?: boolean
}
defineProps<Props>()
</script>
```

UI: 3 `UCard` ngang hàng hiển thị số + label. Dùng `<SharedStatCard>` nếu đã có; nếu chưa có thì tạo ad-hoc `UCard`.

### 3.2 `components/shared/shift/ShiftTable.vue`

Bọc `UTable`. Columns:

| Column | Key | Render |
|--------|-----|--------|
| Mã ca | `code` | Plain text bold |
| Tên | `name` | Plain text |
| Kiểu ca | `type` | `<UBadge variant="subtle" color="primary">{{ type }}</UBadge>` |
| Nhóm xử lý | `work_group` | `<UBadge variant="subtle" color="success">{{ work_group }}</UBadge>` |
| Khung giờ | `start_time`/`end_time` | `"06:00 - 14:00"` (thêm icon moon nếu `is_overnight`) |
| Giờ nghỉ | `break_hours` | `"1.0 giờ"` |
| Giờ công | `work_hours` | `"7.0 giờ"` |
| Trạng thái | `status` | `<UBadge color="success">Đang sử dụng</UBadge>` / `<UBadge color="neutral">Tạm ẩn</UBadge>` |
| Tác vụ | — | Dropdown: Sửa / Xóa (disabled nếu Service throw — handle error toast) |

Emit: `@edit(shift)`, `@delete(shift)`.

### 3.3 `components/shared/shift/ShiftFormDialog.vue`

Dùng `<UModal>` + `<UForm>` với `zod` schema (đã có pattern trong project).

**Form fields:**

| Label | Field | Type | Validation |
|-------|-------|------|------------|
| Mã ca * | `code` | `UInput` | required, max 50 |
| Tên hiển thị * | `name` | `UInput` | required, max 100 |
| Kiểu ca * | `type` | `UInputMenu` (combobox) | required, suggestions từ `SHIFT_TYPE_SUGGESTIONS` |
| Nhóm xử lý * | `work_group` | `UInputMenu` (combobox) | required, suggestions từ `WORK_GROUP_SUGGESTIONS` |
| Giờ bắt đầu * | `start_time` | `UInput type="time"` | required, HH:MM |
| Giờ kết thúc * | `end_time` | `UInput type="time"` | required, HH:MM |
| Giờ nghỉ | `break_hours` | `UInput type="number" step="0.5"` | ≥ 0 |
| Trạng thái * | `status` | `USelectMenu` | `active`/`inactive` |
| Thứ tự | `sort_order` | `UInput type="number"` | ≥ 0 |

**Computed preview:** hiển thị `work_hours = (end - start) - break_hours` ngay dưới field `break_hours` để admin thấy.

**Props:**
```ts
interface Props {
  open: boolean
  mode: 'create' | 'edit'
  shift?: Shift | null
}
```

**Emits:**
```ts
@close
@saved(shift)
```

**Submit logic:** gọi `apiCreateShift()` hoặc `apiUpdateShift()` → toast success → emit `saved` → parent refresh().

### 3.4 Delete confirmation

Dùng pattern `useCrudModals` đã có. Error từ BE (`BusinessException`) hiển thị trong toast + không đóng modal confirm nếu cần.

## 4. Composable `useShifts.ts` — mở rộng

File: `frontend/app/composables/api/useShifts.ts`

```ts
import type { Shift, ShiftStats } from '~/lib/api/generated/laravel.schemas'

interface ListParams {
  search?: string
  status?: 'active' | 'inactive'
  type?: string
  work_group?: string
  only_active?: boolean
  per_page?: number
  page?: number
  sort?: string
}

// GET list (paginated)
export function useShiftList(params: MaybeRefOrGetter<ListParams>) {
  return useApiFetch<{ data: Shift[]; meta: PaginationMeta }>('/pmc/shifts', {
    query: params,
  })
}

// GET detail
export function useShiftDetail(id: MaybeRefOrGetter<number>) {
  return useApiFetch<{ data: Shift }>(() => `/pmc/shifts/${toValue(id)}`)
}

// GET stats
export function useShiftStats() {
  return useApiFetch<{ data: ShiftStats }>('/pmc/shifts/stats')
}

// Mutations
export async function apiCreateShift(payload: ShiftPayload) {
  return await $api<{ data: Shift }>('/pmc/shifts', {
    method: 'POST',
    body: payload,
  })
}

export async function apiUpdateShift(id: number, payload: ShiftPayload) {
  return await $api<{ data: Shift }>(`/pmc/shifts/${id}`, {
    method: 'PUT',
    body: payload,
  })
}

export async function apiDeleteShift(id: number) {
  return await $api<void>(`/pmc/shifts/${id}`, { method: 'DELETE' })
}
```

## 5. Constants `utils/shift.ts`

```ts
export const SHIFT_TYPE_SUGGESTIONS = [
  'Ngày thường',
  'Cuối tuần',
  'Ngày lễ',
  'Cả tuần',
] as const

export const WORK_GROUP_SUGGESTIONS = [
  'Làm việc',
  'Nghỉ phép',
  'Tăng ca',
  'Đào tạo',
  'Chờ việc',
] as const

export const SHIFT_STATUS_OPTIONS = [
  { value: 'active', label: 'Đang sử dụng' },
  { value: 'inactive', label: 'Tạm ẩn' },
] as const

export const SHIFT_STATUS_BADGE_COLOR: Record<string, string> = {
  active: 'success',
  inactive: 'neutral',
}
```

Note: Suggestions là **gợi ý** dropdown (combobox), user có thể gõ tự do → BE nhận text tùy ý.

## 6. Regression — trang phụ thuộc Shift

### 6.1 Dropdown chọn ca ở lịch việc

**Files bị ảnh hưởng:**
- `frontend/app/pages/quan-ly-cong-viec/lich-viec-doi.vue`
- `frontend/app/pages/quan-ly-cong-viec/lich-viec-ca-nhan.vue`
- Component dropdown chọn ca (nếu tách riêng)

**Thay đổi:** Tất cả call `useShiftList()` để populate dropdown → thêm param `only_active: true`.

```ts
const { data: shifts } = useShiftList(() => ({ only_active: true, per_page: 100 }))
```

Ca `inactive` sẽ không xuất hiện khi tạo lịch việc mới. Lịch cũ dùng shift đã `inactive` vẫn hiển thị (do ID FK, đã lưu).

## 7. i18n

Page title + nội dung bằng tiếng Việt (giữ convention). Code internal (variable, function) bằng tiếng Anh.

## 8. Accessibility

- Form fields có `label` rõ ràng, `aria-required` cho required fields.
- Delete confirmation dùng `UModal` với focus trap.
- Stats cards role="group" aria-label="Thống kê ca".

## 9. Checklist triển khai FE

**Pages & Components:**
- [ ] `pages/quan-ly-cong-viec/shifts/index.vue`
- [ ] `components/shared/shift/ShiftStatsBar.vue`
- [ ] `components/shared/shift/ShiftTable.vue`
- [ ] `components/shared/shift/ShiftFormDialog.vue`

**Composables & Utils:**
- [ ] Mở rộng `composables/api/useShifts.ts` (thêm mutations + stats)
- [ ] `utils/shift.ts` (constants + suggestions)

**Regression:**
- [ ] `lich-viec-doi.vue` — thêm `only_active: true` vào shift dropdown
- [ ] `lich-viec-ca-nhan.vue` — thêm `only_active: true` vào shift dropdown
- [ ] Chạy `pnpm run typecheck` sau mọi thay đổi

**Types:**
- [ ] Chạy Orval `cd frontend && pnpm run api:generate` để regenerate `laravel.schemas.ts` sau khi BE xong
- [ ] Verify `Shift`, `ShiftPayload`, `ShiftStats` types khớp backend
