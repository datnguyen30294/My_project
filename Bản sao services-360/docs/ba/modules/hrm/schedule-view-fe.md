# Lịch ca kíp — Spec kỹ thuật FE

> Module: FE cho `PMC/Shift` + `PMC/WorkSchedule` + `PMC/WorkSchedule/ScheduleSlot` | Ngày tạo: 2026-04-15 | Trạng thái: Draft

## 1. Tổng quan

UI read-only để xem lịch ca kíp nhân sự. Dữ liệu từ 2 nguồn (gộp sẵn ở BE):
- External HR đẩy lịch qua API → `work_schedules`.
- Ticket derivation → từ `og_ticket_assignees` + `og_tickets.completed_at`.

**2 trang chính:**

| Trang | Route | Mục đích |
|-------|-------|---------|
| Lịch cá nhân | `/quan-ly-cong-viec/lich-viec-ca-nhan` | Calendar 1 tháng của 1 nhân sự |
| Lịch đội | `/quan-ly-cong-viec/lich-viec-doi` | Ma trận tất cả nhân sự × ngày × ca |

**1 drawer dùng chung**: click cell → `SlotDetailDrawer` hiển thị chi tiết external + tickets trong ca.

## 2. Cấu trúc thư mục

```
frontend/app/
├── pages/quan-ly-cong-viec/
│   ├── lich-viec-ca-nhan.vue
│   └── lich-viec-doi.vue
├── components/schedule/
│   ├── ScheduleFilterBar.vue         # filter chung (account / project / month)
│   ├── ScheduleMonthPicker.vue       # UInput type="month"
│   ├── PersonalCalendarGrid.vue      # grid 7 cols × weeks cho 1 account
│   ├── TeamMatrixTable.vue           # matrix account × day (sticky header + sticky col)
│   ├── SlotCell.vue                  # 1 ô lịch (3 dòng ca)
│   ├── ShiftRow.vue                  # 1 dòng ca trong cell (clickable)
│   └── SlotDetailDrawer.vue          # USlideover chi tiết
├── composables/
│   ├── api/
│   │   ├── useShifts.ts
│   │   └── useScheduleSlots.ts
│   ├── useCalendarMonth.ts           # build weeks grid từ month
│   └── useScheduleColors.ts          # map shift code → color
└── utils/
    └── date.ts                       # WEEKDAY_LABELS_VI, formatMonthTitle, ...
```

## 3. API Composables

### 3.1 `useShifts.ts`

```ts
interface Shift {
  id: number
  code: string           // SANG | CHIEU | TOI
  name: string
  start_time: string     // "06:00"
  end_time: string       // "14:00"
  is_overnight: boolean
  counts_for_ticket: boolean
  sort_order: number
}

export function useShiftList() {
  return useApiFetch<{ data: Shift[] }>('/api/v1/pmc/shifts')
}
```

### 3.2 `useScheduleSlots.ts`

```ts
interface SlotSummary {
  ext: boolean            // có external schedule
  proj: number[]          // distinct project_ids
  tkt: number | null      // ticket count, null nếu counts_for_ticket=false
}

interface DayMeta {
  date: string            // "2026-04-15"
  weekday: number         // 0=CN, 1=T2, ..., 6=T7
  is_weekend: boolean
  is_today: boolean
}

interface PersonalResponse {
  month: string
  account: { id: number; employee_code: string; name: string }
  days: DayMeta[]
  shifts: Shift[]
  slots: Record<string, Record<number, SlotSummary>>   // [date][shift_id]
}

interface TeamResponse {
  month: string
  project_id: number | null
  accounts: Array<{ id: number; employee_code: string; name: string }>
  days: DayMeta[]
  shifts: Shift[]
  slots: Record<number, Record<string, Record<number, SlotSummary>>>  // [account_id][date][shift_id]
}

interface SlotDetailResponse {
  account: { id: number; employee_code: string; name: string }
  date: string
  shift: Shift
  shift_window: { start: string; end: string }
  external: Array<{
    id: number
    project: { id: number; code: string; name: string }
    note: string | null
    external_ref: string | null
  }>
  tickets: Array<{
    id: number
    subject: string
    project: { id: number; name: string }
    priority: { value: string; label: string }
    assigned_at: string
    status_at_slot: { value: string; label: string }
    status_now: { value: string; label: string }
    is_status_changed: boolean
  }>
}

export function usePersonalSchedule(params: MaybeRef<{ account_id: number; month: string }>) {
  return useApiFetch<{ data: PersonalResponse }>('/api/v1/pmc/schedule-slots/personal', { query: params })
}

export function useTeamSchedule(params: MaybeRef<{ month: string; project_id?: number; account_search?: string }>) {
  return useApiFetch<{ data: TeamResponse }>('/api/v1/pmc/schedule-slots/team', { query: params })
}

export function useSlotDetail(params: MaybeRef<{ account_id: number; date: string; shift_id: number } | null>) {
  return useApiFetch<{ data: SlotDetailResponse }>('/api/v1/pmc/schedule-slots/detail', {
    query: params,
    immediate: false,      // chỉ fetch khi user click
  })
}
```

## 4. Trang 1: `lich-viec-ca-nhan.vue`

### 4.1 UI layout

```
┌────────────────────────────────────────────────────┐
│ Lịch việc cá nhân                                  │
│                                                    │
│ [Chọn nhân sự NVA ▾]  [Tháng 2026-04 ▾]            │
│                                                    │
│ 🟦 Dữ liệu từ HR · 🎫 Ticket đang xử lý            │
├────────────────────────────────────────────────────┤
│         T2     T3     T4     T5     T6     T7     CN│
│ ┌────┬────┬────┬────┬────┬────┬────┐                │
│ │    │    │  1 │  2 │  3 │  4 │  5 │  ← tháng 4     │
│ │    │    │ S· │ S• │ S  │    │    │                │
│ │    │    │ C  │ C• │ C• │    │    │                │
│ │    │    │ T  │ T• │    │    │    │                │
│ ├────┼────┼────┼────┼────┼────┼────┤                │
│ │  6 │  7 │  8 │  9 │ 10 │ 11 │ 12 │                │
│ │ S• │ S· │ S  │ S• │ S  │    │    │                │
│ │ C• │ C  │ C• │ C  │ C• │    │    │                │
│ │ T  │ T  │ T  │ T  │ T  │    │    │                │
│ └────┴────┴────┴────┴────┴────┴────┘                │
└────────────────────────────────────────────────────┘

Ký hiệu trong ô ngày:
  S •   = Ca sáng có external (🟦) hoặc có ticket (🎫)
  Hai biểu tượng nhỏ cạnh "S": 🟦 và 🎫 N
```

### 4.2 Data flow

```ts
const route = useRoute()
const selectedAccountId = ref<number | null>(null)
const selectedMonth = ref(format(new Date(), 'yyyy-MM'))

// Auto-select account từ query param ?accountId=
watch(() => route.query.accountId, (id) => {
  if (id) selectedAccountId.value = Number(id)
}, { immediate: true })

// Fetch — guard khi chưa chọn account (useApiFetch watch params; nếu null thì skip)
const { data, status, refresh } = usePersonalSchedule(computed(() => ({
  account_id: selectedAccountId.value!,
  month: selectedMonth.value,
})), {
  immediate: false,
})

// Chỉ execute khi đã chọn account
watchEffect(async () => {
  if (selectedAccountId.value) {
    await refresh()
  }
})

// Build weeks grid
const weeks = computed(() => useCalendarMonth(selectedMonth.value, data.value?.data.days ?? []))
```

### 4.3 Cell rendering (component `SlotCell.vue`)

Mỗi ô ngày render 3 dòng ca (SANG / CHIEU / TOI), sort theo `shift.sort_order`:

```vue
<template>
  <div class="cell" :class="{ today: day.is_today, weekend: day.is_weekend }">
    <div class="day-number">{{ dayNum }}</div>
    <ShiftRow
      v-for="shift in shifts"
      :key="shift.id"
      :shift="shift"
      :summary="slotsForDay[shift.id]"
      @click="$emit('click-slot', { date: day.date, shift_id: shift.id })"
    />
  </div>
</template>
```

### 4.4 Empty states

- Chưa chọn nhân sự: `UAlert color="neutral"` — "Chọn nhân sự để xem lịch."
- Có nhân sự nhưng `slots` rỗng: hiện calendar bình thường, mọi cell hiển thị dấu `—`.
- Đang load: `USkeleton` placeholder dạng grid.

## 5. Trang 2: `lich-viec-doi.vue`

### 5.1 UI layout

```
┌─────────────────────────────────────────────────────────┐
│ Lịch việc đội                                           │
│                                                         │
│ [Dự án: Tất cả ▾]  [Tháng: 2026-04 ▾]                  │
│ [Tìm nhân sự: __________]                               │
│                                                         │
│ 🟦 HR · 🎫 Ticket                                       │
├─────────────────────────────────────────────────────────┤
│ Nhân viên   │ 01 T4 │ 02 T5 │ 03 T6 │ ... │ 30 T5 │   │
│ (sticky)    │       │       │       │     │       │   │
├─────────────┼───────┼───────┼───────┼─────┼───────┤   │
│ NVA (NV001) │ S 🟦  │ S 🟦🎫│ S     │     │ S 🎫  │   │
│             │ C     │ C 🎫  │ C 🎫  │     │ C     │   │
│             │ T     │ T     │ T     │     │ T     │   │
├─────────────┼───────┼───────┼───────┤     ├───────┤   │
│ NVB (NV002) │ S 🟦  │ S     │ S 🟦  │ ... │ S 🟦  │   │
│             │ C     │ C 🎫🎫│ C     │     │ C     │   │
│             │ T 🟦  │ T     │ T     │     │ T     │   │
└─────────────┴───────┴───────┴───────┴─────┴───────┘
            ← scroll ngang để xem hết tháng →
```

### 5.2 Table structure

Dùng `<table>` thuần + CSS sticky (không dùng `UTable` vì đa chiều):

- Cột `Nhân viên` — `position: sticky; left: 0`
- Header `ngày + T2..CN` — `position: sticky; top: 0`
- Mỗi cell = `SlotCell` compact (3 dòng ca, co lại cho vừa column)

Column width: ~90px/day × 31 days = ~2,800px → user scroll ngang.

### 5.3 Data flow

```ts
const selectedProjectId = ref<number | null>(null)
const selectedMonth = ref(format(new Date(), 'yyyy-MM'))
const accountSearch = ref('')

// Debounce search 300ms để giảm request
const debouncedSearch = refDebounced(accountSearch, 300)

const { data, status, error } = useTeamSchedule(computed(() => ({
  month: selectedMonth.value,
  project_id: selectedProjectId.value ?? undefined,
  account_search: debouncedSearch.value || undefined,
})))

// Xử lý 422 "quá nhiều nhân viên"
watch(error, (err) => {
  if (err?.statusCode === 422) {
    useToast().add({
      color: 'warning',
      title: 'Quá nhiều nhân viên',
      description: err.data?.message || 'Vui lòng lọc theo dự án.',
    })
  }
})
```

### 5.4 Filter bar

- `USelect` **Dự án** — placeholder "Tất cả dự án" (value `null`). Nếu không chọn và response 422 → UI nhắc chọn project.
- `UInput type="month"` **Tháng** — required, default tháng hiện tại.
- `UInput` **Tìm nhân sự** — icon `i-lucide-search`, clear button.

### 5.5 Virtual scroll (optional optimization)

Nếu > 100 accounts hiển thị → cân nhắc dùng `@tanstack/vue-virtual` cho rows. Phase đầu bỏ qua, render thẳng (< 50 accounts thực tế).

## 6. `SlotDetailDrawer.vue` (shared)

### 6.1 Trigger

Click bất kỳ `ShiftRow` → emit `click-slot: { date, shift_id }`. Parent page setup state mở drawer:

```ts
const drawerOpen = ref(false)
const drawerParams = ref<{ account_id: number; date: string; shift_id: number } | null>(null)

function openDrawer(accountId: number, params: { date: string; shift_id: number }) {
  drawerParams.value = { account_id: accountId, ...params }
  drawerOpen.value = true
}

// useSlotDetail có immediate: false → không fetch khi mount. Watch params để execute.
const { data: detail, status, execute } = useSlotDetail(drawerParams)

watch(drawerParams, async (p) => {
  if (p) await execute()
})
```

`useApiFetch` wrap `useFetch` nên hỗ trợ option `immediate: false` + `execute()` để fetch manual.

### 6.2 Drawer content

`USlideover` side=right, width ~500px:

```
┌──────────────────────────────────────────┐
│ Ca sáng · 15/04/2026                    × │
│ Nguyễn Văn A (NV001)                      │
│ 06:00 – 14:00                             │
├──────────────────────────────────────────┤
│ Lịch làm việc (HR)                       │
│ ┌─────────────────────────────────────┐  │
│ │ 🏢 Dự án Aurora                      │  │
│ │ Ref: HR-WS-2026-04-15-NV001-SANG     │  │
│ └─────────────────────────────────────┘  │
│                                          │
│ Ticket đang xử lý (2)                    │
│ ┌─────────────────────────────────────┐  │
│ │ #123 Sửa ống nước căn 1204           │  │
│ │ 🏢 Aurora · Ưu tiên: Bình thường     │  │
│ │ Giao lúc: 13/04 09:00                │  │
│ │ Trạng thái lúc đó: Đang thực hiện    │  │
│ │ Trạng thái hiện tại: Hoàn thành  ⚠   │  │
│ │                  [Xem ticket →]      │  │
│ └─────────────────────────────────────┘  │
│ ┌─────────────────────────────────────┐  │
│ │ #124 Thay bóng đèn                   │  │
│ │ ...                                  │  │
│ └─────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

Dùng Nuxt UI components:
- Header: `USlideover` title
- Sections: `SharedSectionCard title="Lịch làm việc (HR)" compact`
- Ticket card: `UCard` với link → `/quan-ly-ticket/danh-sach-ticket/{id}`
- Status badges: `UBadge`
- Warning khi `is_status_changed`: `UAlert color="warning" variant="subtle"` nhỏ trong card

### 6.3 Empty states trong drawer

- External `[]` + tickets `[]`: "Không có lịch hay ticket nào trong ca này."
- Ca TOI với `tickets=[]`: ghi chú "(Ca tối không tính ticket)"

## 7. Colors & constants

### 7.1 `useScheduleColors.ts`

```ts
export function useScheduleColors() {
  return {
    shiftColor(code: string): 'primary' | 'warning' | 'neutral' {
      if (code === 'SANG')  return 'primary'
      if (code === 'CHIEU') return 'warning'
      return 'neutral'  // TOI
    },
    indicatorExternal: 'text-blue-600 dark:text-blue-400',
    indicatorTicket:   'text-orange-600 dark:text-orange-400',
  }
}
```

### 7.2 `utils/date.ts`

```ts
export const WEEKDAY_LABELS_VI = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'] as const

export function formatMonthTitle(yearMonth: string): string {
  const [y, m] = yearMonth.split('-').map(Number)
  return `Tháng ${m}/${y}`
}
```

## 8. Menu & routing

Thêm vào sidebar menu `AppSidebar`:
```ts
{
  label: 'Quản lý công việc',
  icon: 'i-lucide-briefcase',
  children: [
    { label: 'Lịch việc cá nhân', to: '/quan-ly-cong-viec/lich-viec-ca-nhan' },
    { label: 'Lịch việc đội',    to: '/quan-ly-cong-viec/lich-viec-doi' },
  ],
}
```

## 9. Permissions

| Permission | Gate |
|------------|------|
| `work_schedules.view_personal` | Truy cập trang cá nhân |
| `work_schedules.view_team`     | Truy cập trang đội |

Middleware route `auth` (đã có) + check permission trong `setup` hoặc `definePageMeta`.

## 10. Nuxt UI components checklist

- [ ] `UPageHeader` cho title
- [ ] `UCard` wrapper cho filter + calendar
- [ ] `USelect` cho account/project picker
- [ ] `UInput type="month"` cho month picker
- [ ] `UInput` cho search
- [ ] `UBadge` cho status
- [ ] `UAlert color="info" variant="subtle"` cho banner "Dữ liệu từ HR, read-only"
- [ ] `USlideover` cho drawer
- [ ] `USkeleton` cho loading
- [ ] `UButton` cho nav / close

**KHÔNG** custom div + Tailwind cho alert/badge/card — dùng Nuxt UI trước. Nếu theme Nuxt UI chưa đủ đậm → customize trong `app.config.ts`, không viết inline class.

## 11. Checklist triển khai

- [ ] Chạy Orval trên host: `cd frontend && pnpm run api:generate`
- [ ] `composables/api/useShifts.ts` + `useScheduleSlots.ts`
- [ ] `composables/useCalendarMonth.ts` (build weeks grid)
- [ ] `composables/useScheduleColors.ts`
- [ ] `utils/date.ts` (WEEKDAY_LABELS_VI, formatMonthTitle)
- [ ] Components:
  - [ ] `ScheduleFilterBar.vue`
  - [ ] `ScheduleMonthPicker.vue`
  - [ ] `PersonalCalendarGrid.vue`
  - [ ] `TeamMatrixTable.vue`
  - [ ] `SlotCell.vue`
  - [ ] `ShiftRow.vue`
  - [ ] `SlotDetailDrawer.vue`
- [ ] Pages:
  - [ ] `pages/quan-ly-cong-viec/lich-viec-ca-nhan.vue`
  - [ ] `pages/quan-ly-cong-viec/lich-viec-doi.vue`
- [ ] Menu items trong `AppSidebar`
- [ ] Typecheck: `docker exec residential_frontend pnpm run typecheck`
- [ ] Lint: `docker exec residential_frontend pnpm run lint`
- [ ] Test manually:
  - [ ] Personal: chọn account + month → grid đúng
  - [ ] Personal: click cell → drawer hiện external + tickets
  - [ ] Team: không filter → tất cả active accounts
  - [ ] Team: filter project → chỉ members
  - [ ] Team: search → debounce, case-insensitive
  - [ ] Team: 422 → toast warning
  - [ ] Drawer: TOI không hiển thị tickets section
  - [ ] Drawer: ticket có `is_status_changed` → warning badge

## 12. Scope guard — việc KHÔNG làm

- ❌ Không có form CRUD cho Shift / WorkSchedule (tất cả read-only)
- ❌ Không có nút "Đồng bộ lại" (HR tự push, UI passive)
- ❌ Không có drag-drop để thay đổi ca
- ❌ Không export Excel trong phase này (nếu cần thì spec riêng)
- ❌ Không edit ticket từ drawer (chỉ link sang trang ticket detail)
