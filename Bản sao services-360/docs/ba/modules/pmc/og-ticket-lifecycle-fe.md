# OG Ticket Lifecycle Segments - Spec Frontend

> Module: `PMC/OgTicket` | Ngày tạo: 2026-04-01 | Trạng thái: Draft

## 1. Tổng quan

Hiển thị lịch sử giai đoạn xử lý trên stepper chi tiết OG Ticket. Mỗi bước stepper là **điểm xem lịch sử** — click vào xem tất cả các lần xử lý qua nhiều vòng, bao gồm cả dữ liệu từ Quote versions và Order.

**Tham chiếu mockup:** `BA-TNP-SERVICES/app/pages/modules/quan-ly-ticket/danh-sach-ticket/[id].vue`

## 2. Dữ liệu nguồn cho mỗi bước stepper

| Bước | Nguồn dữ liệu | Hiển thị khi click |
|------|---------------|-------------------|
| Tiếp nhận | `lifecycle_segments` (status=received) | Thời gian, assignee |
| Phân công | `lifecycle_segments` (status=assigned) | Thời gian, assignee |
| Đang khảo sát | `lifecycle_segments` (status=surveying) | Thời gian, assignee, ghi chú, vòng |
| Đã báo giá | `lifecycle_segments` (status=quoted) + **Quote versions** | Segments + danh sách quotes (code, status, total_amount, is_active) |
| Chấp thuận | `lifecycle_segments` (status=approved) + **Quote versions (approved)** | Segments + quote nào được chấp thuận |
| Đã lên đơn | `lifecycle_segments` (status=ordered) + **Orders** (qua quote versions) | Segments + danh sách đơn hàng (code, status) |
| Đang thực hiện | `lifecycle_segments` (status=in_progress) | Thời gian, assignee, ghi chú phát sinh |
| Hoàn thành | `lifecycle_segments` (status=completed) | Thời gian, ghi chú nghiệm thu |

## 3. Type definitions

### 3.1 API response type

```ts
// Thêm vào OgTicketDetail type (composables/api/useOgTickets.ts)
export interface OgTicketLifecycleSegment {
  id: number
  status: { value: string; label: string }
  cycle: number
  started_at: string
  ended_at: string | null
  note: string | null
  assignee: { id: number; name: string } | null
}

// Thêm vào OgTicketDetail
export interface OgTicketDetail {
  // ... fields hiện có ...
  lifecycle_segments: OgTicketLifecycleSegment[]
}
```

### 3.2 Computed types cho stepper

```ts
// Một lần visit tại bước stepper
interface StepVisit {
  segment: OgTicketLifecycleSegment
  cycle: number
  isActive: boolean          // ended_at === null
  durationMs: number
  durationLabel: string      // "2 giờ 30 phút"
}

// Dữ liệu tổng hợp cho 1 bước stepper
interface StepData {
  visits: StepVisit[]
  totalVisits: number
  latestVisit: StepVisit | null
  // Bổ sung cho bước có entity liên quan:
  quotes?: QuoteVersion[]    // cho bước "Đã báo giá" / "Chấp thuận"
  orders?: OrderInfo[]       // cho bước "Đã lên đơn"
}
```

## 4. Composable: useOgTicketLifecycle

**File:** `app/composables/useOgTicketLifecycle.ts`

**Input:** `lifecycle_segments[]` từ API, quote versions, orders

**Output:**

```ts
function useOgTicketLifecycle(
  segments: Ref<OgTicketLifecycleSegment[]>,
  quoteVersions: Ref<QuoteVersion[]>,
) {
  // Group segments theo workflow step
  const stepDataMap: ComputedRef<Map<string, StepData>>

  // Helpers
  function getStepVisits(status: string): StepVisit[]
  function getStepColor(stepIndex: number): 'default' | 'active' | 'completed' | 'error'
  function isBacktrack(fromIndex: number, toIndex: number): boolean

  // Backtrack arrows data
  const backtracks: ComputedRef<{ from: number; to: number; cycle: number }[]>

  return { stepDataMap, getStepVisits, getStepColor, backtracks }
}
```

## 5. UI Components

### 5.1 Cập nhật stepper trên trang chi tiết OG Ticket

**File:** `app/pages/pmc/og-tickets/[id]/index.vue`

Stepper hiện tại dùng `UStepper` read-only. Cần thêm:

1. **Badge số lần visit** trên mỗi bước (nếu > 1 lần)
2. **Click vào bước** → mở popover/panel hiển thị lịch sử
3. **Màu bước:**
   - Xám: chưa tới
   - Xanh primary: đang ở đây (active segment)
   - Xanh success: đã qua
   - Đỏ: entity tại bước đó đang fail (quote rejected, order cancelled)
4. **Backtrack indicators**: mũi tên nét đứt khi có phát sinh

### 5.2 Popover nội dung mỗi bước

Khi click vào 1 bước stepper, hiện popover với:

**Cho mọi bước (từ lifecycle_segments):**
```
┌─────────────────────────────────────┐
│ ● Khảo sát                   3 lần │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Vòng 1              Đã qua     │ │
│ │ 🕐 08/01 13:00 → 09/01 10:00  │ │
│ │ ⏱ 21 giờ                       │ │
│ │ 👤 Trần Thị B                  │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Vòng 2              Đã qua     │ │
│ │ 🕐 12/01 18:00 → 13/01 10:00  │ │
│ │ ⏱ 16 giờ                       │ │
│ │ 👤 Lê Văn C                    │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Vòng 3           Đang diễn ra  │ │
│ │ 🕐 17/01 15:00 → đang mở      │ │
│ │ ⏱ 18 giờ 30 phút              │ │
│ │ 👤 Lê Văn C                    │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Bổ sung cho bước "Đã báo giá":**
```
┌─────────────────────────────────────┐
│ ● Báo giá                    2 lần │
├─────────────────────────────────────┤
│ [Lifecycle segments như trên]       │
│                                     │
│ ── Lịch sử báo giá ──              │
│ ┌─────────────────────────────────┐ │
│ │ BG-001  ✓ Đã chấp thuận        │ │
│ │ 5.500.000 đ      Còn hiệu lực  │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ BG-002  ✗ Cư dân từ chối       │ │
│ │ 8.200.000 đ      Hết hiệu lực  │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Bổ sung cho bước "Đã lên đơn":**
```
┌─────────────────────────────────────┐
│ ● Đã lên đơn                 2 lần │
├─────────────────────────────────────┤
│ [Lifecycle segments như trên]       │
│                                     │
│ ── Lịch sử đơn hàng ──             │
│ ┌─────────────────────────────────┐ │
│ │ DH-001  Đang thực hiện         │ │
│ │ → Xem chi tiết                  │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ DH-002  Đã huỷ                 │ │
│ │ → Xem chi tiết                  │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### 5.3 Màu bước khi entity fail

| Tình huống | Bước | Màu | Logic |
|-----------|------|-----|-------|
| Active quote bị rejected | Đã báo giá | Đỏ | `activeQuote?.status === 'manager_rejected' \|\| 'resident_rejected'` |
| Active order bị cancelled | Đã lên đơn | Đỏ | `activeOrder?.status === 'cancelled'` |
| Ticket bị rejected | Stepper dừng + alert | Đỏ | `ogTicket.status === 'rejected'` |
| Ticket bị cancelled | Stepper dừng + alert | Xám | `ogTicket.status === 'cancelled'` |

## 6. Dữ liệu đã có sẵn

Trang `[id]/index.vue` hiện tại đã fetch:

```ts
// OG Ticket detail (có lifecycle_segments sau khi BE thêm)
const { data, status, error, refresh } = useOgTicketDetail(id)

// Quote versions (đã có)
const { data: versionsData } = useQuoteVersions(id)
```

Không cần thêm API call mới. `lifecycle_segments` trả kèm trong detail response, quote versions đã có.

Order info lấy qua `activeQuote.order` (đã có trong quote version response).

## 7. Duration formatting

Dùng utility function (tạo hoặc dùng sẵn trong `utils/`):

```ts
function formatDuration(ms: number): string {
  if (ms < 60_000) return '< 1 phút'
  const minutes = Math.floor(ms / 60_000)
  if (minutes < 60) return `${minutes} phút`
  const hours = Math.floor(minutes / 60)
  const restMin = minutes % 60
  if (hours < 48) return restMin ? `${hours} giờ ${restMin} phút` : `${hours} giờ`
  const days = Math.floor(hours / 24)
  return `${days} ngày`
}
```

## 8. Checklist FE

### Phase 1: Types + Composable
- [ ] Thêm `OgTicketLifecycleSegment` type
- [ ] Cập nhật `OgTicketDetail` type thêm `lifecycle_segments`
- [ ] Tạo `useOgTicketLifecycle` composable
- [ ] Tạo `formatDuration()` utility

### Phase 2: Stepper UI
- [ ] Thay `UStepper` read-only hiện tại bằng stepper custom có popover
- [ ] Badge số lần visit trên mỗi bước
- [ ] Popover hiện lifecycle history khi click
- [ ] Màu bước theo trạng thái (active/completed/error)

### Phase 3: Tích hợp Quote + Order history
- [ ] Popover bước "Đã báo giá" hiện quote versions
- [ ] Popover bước "Đã lên đơn" hiện order history
- [ ] Màu đỏ khi quote rejected / order cancelled

### Phase 4: Backtrack visualization
- [ ] Hiện chỉ báo phát sinh (mũi tên hoặc text)
- [ ] Phân biệt vòng 1, 2, 3 trên stepper
