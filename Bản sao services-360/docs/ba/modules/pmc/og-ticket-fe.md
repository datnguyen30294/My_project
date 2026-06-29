# OG Ticket Admin - Đặc tả kỹ thuật Frontend

> Module: `PMC/OgTicket` | Ngày tạo: 2026-03-10 | Trạng thái: Draft

## 1. Tổng quan

Giao diện admin để OG (Organization) quản lý ticket đã tiếp nhận. Gồm: xem pool ticket available, claim, xử lý, release.

**Đặc điểm:**
- Auth required (Sanctum, layout admin có sidebar)
- Phân quyền theo OG: chỉ xem/sửa ticket của OG mình
- Route prefix: `/pmc/og-tickets`

## 2. Danh sách trang

| Trang | Route | Mô tả |
|-------|-------|-------|
| Pool | `/pmc/og-tickets/pool` | Ticket available chờ nhận |
| Danh sách OG Ticket | `/pmc/og-tickets` | Ticket OG đang xử lý |
| Chi tiết OG Ticket | `/pmc/og-tickets/[id]` | Xem + sửa thông tin xử lý |
| Lịch sử | `/pmc/og-tickets/history/[ticketId]` | Các OG đã xử lý 1 ticket |

## 3. Giao diện

### 3.1 Trang Pool (`/pmc/og-tickets/pool`)

Danh sách ticket gốc (từ Requester/Ticket) chưa ai nhận.

#### Bảng

| Cột | Dữ liệu | Ghi chú |
|-----|---------|---------|
| Mã | `code` | Font mono |
| Tiêu đề | `subject` | |
| Người gửi | `requester_name` | |
| SĐT | `requester_phone` | |
| Căn hộ | `apartment_name` | Hiện "—" nếu null |
| Kênh | `channel.label` | Badge |
| Ngày gửi | `created_at` | Format: DD/MM/YYYY HH:mm |
| Thao tác | — | Nút **Nhận** |

> Sắp xếp mặc định theo `created_at` giảm dần (mới nhất trước).

#### Tìm kiếm

| Bộ lọc | Loại | Mô tả |
|--------|------|-------|
| Tìm kiếm | `UInput` | Tìm theo tiêu đề, tên, SĐT (debounce) |

#### Hành động

| Hành động | Kết quả |
|-----------|---------|
| Nhận (Claim) | Confirm dialog → `POST /claim` → chuyển sang chi tiết og_ticket mới |
| Click row | Mở dialog xem nhanh thông tin ticket (không claim) |

#### Claim Confirm Dialog

```
Bạn muốn nhận ticket "TK-2026-005 — Hỏng máy lạnh"?
Ticket sẽ được gán cho tổ chức của bạn.
[Hủy] [Nhận ticket]
```

---

### 3.2 Trang danh sách OG Ticket (`/pmc/og-tickets`)

Ticket mà OG đang xử lý (status != cancelled).

#### Bảng

| Cột | Dữ liệu | Ghi chú |
|-----|---------|---------|
| Tiêu đề | `subject` | |
| Người gửi | `requester_name` | |
| Trạng thái | `status.label` | Badge màu |
| Ưu tiên | `priority.label` | Badge màu |
| Người nhận | `received_by.name` | |
| Người thi công | `assigned_to.name` | Hiện "—" nếu chưa phân công |
| Hạn SLA | `sla_due_at` | Đỏ nếu quá hạn |
| Nhận lúc | `received_at` | Format: DD/MM/YYYY HH:mm |
| Thao tác | — | Nút Xem |

> Tự lọc theo OG của account đang đăng nhập. Mặc định hiện active (status != cancelled).

#### Tìm kiếm & Lọc

| Bộ lọc | Loại | Mô tả |
|--------|------|-------|
| Tìm kiếm | `UInput` | Tìm theo tiêu đề, tên, SĐT (debounce) |
| Trạng thái | `USelect` | Tất cả / Đã tiếp nhận / Đã phân công / ... / Đã hủy |
| Ưu tiên | `USelect` | Tất cả / Thấp / Bình thường / Cao / Khẩn cấp |
| Xóa bộ lọc | `UButton` | Reset về mặc định |

#### Hành động

| Hành động | Kết quả |
|-----------|---------|
| Xem chi tiết | Click row hoặc nút "Xem" → `/pmc/og-tickets/[id]` |

---

### 3.3 Trang chi tiết OG Ticket (`/pmc/og-tickets/[id]`)

#### Thông tin ticket gốc (read-only card)

| Trường | Dữ liệu | Ghi chú |
|--------|---------|---------|
| Mã ticket | `ticket.code` | Font mono, từ dynamic relationship |
| Người gửi | `requester_name` — `requester_phone` | |
| Căn hộ | `apartment_name` | |
| Dự án | `project.name` | |
| Tiêu đề | `subject` | |
| Mô tả | `description` | |
| Kênh | `channel.label` | Badge |
| Ngày gửi | ticket `created_at` | |

> Card này **chỉ đọc** — snapshot từ ticket gốc, không sửa được.

#### Form xử lý (editable)

| Trường | Component | Required | Ghi chú |
|--------|-----------|----------|---------|
| Trạng thái | `USelect` | Có | Enum OgTicketStatus |
| Ưu tiên | `USelect` | Có | Enum OgTicketPriority |
| Người thi công | `USelect` | Không | Danh sách account trong cùng OG |
| Hạn SLA | `UInput` (datetime-local) | Không | |
| Ghi chú nội bộ | `UTextarea` | Không | `internal_note` |

#### Thông tin nhận (read-only)

| Trường | Dữ liệu |
|--------|---------|
| Tổ chức | `organization.name` |
| Người nhận | `received_by.name` |
| Nhận lúc | `received_at` |

#### Hành động

| Hành động | Component | Kết quả |
|-----------|-----------|---------|
| Lưu thay đổi | `UButton` primary | `PUT /og-tickets/{id}` → toast thành công |
| Trả lại (Release) | `UButton` destructive | Mở Release Dialog |
| Quay lại | `UButton` ghost | → `/pmc/og-tickets` |

#### Release Dialog

```
Trả ticket về pool?
Ticket sẽ được mở cho các tổ chức khác nhận.

Lý do (không bắt buộc):
[________________________]

[Hủy] [Xác nhận trả lại]
```

→ `PUT /og-tickets/{id}/release` → chuyển về danh sách

---

### 3.4 Trang lịch sử (`/pmc/og-tickets/history/[ticketId]`)

Xem tất cả OG đã xử lý 1 ticket (bao gồm cancelled).

#### Bảng

| Cột | Dữ liệu | Ghi chú |
|-----|---------|---------|
| Tổ chức | `organization.name` | |
| Người nhận | `received_by.name` | |
| Nhận lúc | `received_at` | |
| Trạng thái cuối | `status.label` | Badge |
| Ghi chú | `internal_note` | Truncate, hover xem đầy đủ |
| Cập nhật lúc | `updated_at` | |

> Sắp xếp theo `created_at` giảm dần. Bao gồm og_ticket hiện tại (nếu có).

---

## 4. Màu badge

### 4.1 Trạng thái OG Ticket

| Trạng thái | Label | Màu |
|-----------|-------|-----|
| `received` | Đã tiếp nhận | Xanh dương (`info`) |
| `assigned` | Đã phân công | Tím (`primary`) |
| `surveying` | Đang khảo sát | Vàng (`warning`) |
| `quoted` | Đã báo giá | Cam (`warning`) |
| `approved` | Đã chấp thuận | Xanh lá (`success`) |
| `rejected` | Từ chối | Đỏ (`error`) |
| `ordered` | Đã lên đơn | Xanh lá (`success`) |
| `in_progress` | Đang thực hiện | Xanh dương (`info`) |
| `completed` | Hoàn thành | Xanh lá (`success`) |
| `cancelled` | Đã hủy | Xám (`neutral`) |

### 4.2 Ưu tiên

| Ưu tiên | Label | Màu |
|---------|-------|-----|
| `low` | Thấp | Xám (`neutral`) |
| `normal` | Bình thường | Xanh dương (`info`) |
| `high` | Cao | Cam (`warning`) |
| `urgent` | Khẩn cấp | Đỏ (`error`) |

## 5. API Integration

### 5.1 Composable

**File:** `app/composables/api/useOgTickets.ts`

```typescript
// Pool (available tickets)
function usePoolTickets(params?: PoolFilters)
// → GET /api/v1/pmc/og-tickets/pool

// Claim
function apiClaimTicket(data: { ticket_id: number }): Promise<OgTicketResponse>
// → POST /api/v1/pmc/og-tickets/claim

// List OG tickets
function useOgTicketList(params?: OgTicketFilters)
// → GET /api/v1/pmc/og-tickets

// Detail
function useOgTicketDetail(id: number)
// → GET /api/v1/pmc/og-tickets/{id}

// Update
function apiUpdateOgTicket(id: number, data: UpdateOgTicketPayload): Promise<OgTicketResponse>
// → PUT /api/v1/pmc/og-tickets/{id}

// Release
function apiReleaseOgTicket(id: number, data?: { note?: string }): Promise<void>
// → PUT /api/v1/pmc/og-tickets/{id}/release

// History
function useOgTicketHistory(ticketId: number)
// → GET /api/v1/pmc/og-tickets/history/{ticketId}
```

### 5.2 Types

```typescript
// Pool ticket (từ Requester/Ticket)
interface PoolTicket {
  id: number
  code: string
  requester_name: string
  requester_phone: string
  apartment_name: string | null
  subject: string
  description: string | null
  channel: { value: string; label: string }
  created_at: string
}

// OG Ticket
interface OgTicketResponse {
  id: number
  ticket_id: number
  ticket?: {
    code: string
    status: { value: string; label: string }
    created_at: string
  }
  subject: string
  description: string | null
  requester_name: string
  requester_phone: string
  apartment_name: string | null
  project: { id: number; name: string }
  channel: { value: string; label: string }
  organization: { id: number; name: string }
  status: { value: string; label: string }
  priority: { value: string; label: string }
  internal_note: string | null
  received_at: string
  received_by: { id: number; name: string }
  assigned_to: { id: number; name: string } | null
  sla_due_at: string | null
  created_at: string
  updated_at: string
}

// Update payload
interface UpdateOgTicketPayload {
  status: string
  priority: string
  assigned_to_id?: number
  sla_due_at?: string
  internal_note?: string
}

// Filters
interface PoolFilters {
  search?: string
  per_page?: number
}

interface OgTicketFilters {
  search?: string
  status?: string
  priority?: string
  sort_by?: string
  sort_direction?: 'asc' | 'desc'
  per_page?: number
}
```

## 6. Luồng người dùng

### 6.1 Claim ticket từ pool

```
Pool (/pmc/og-tickets/pool)
  → Xem danh sách ticket available
  → Bấm "Nhận" trên ticket
    → Confirm dialog
    → Bấm "Nhận ticket"
      ✓ Thành công: Chuyển sang chi tiết og_ticket mới tạo
      ✗ Lỗi (đã bị claim): Toast "Ticket đã được nhận bởi tổ chức khác"
```

### 6.2 Xử lý ticket

```
Danh sách (/pmc/og-tickets)
  → Click ticket → Chi tiết (/pmc/og-tickets/[id])
    → Sửa trạng thái, ưu tiên, phân công, SLA, ghi chú
    → Bấm "Lưu thay đổi"
      ✓ Toast thành công
```

### 6.3 Release ticket

```
Chi tiết (/pmc/og-tickets/[id])
  → Bấm "Trả lại"
    → Release Dialog (nhập lý do)
    → Bấm "Xác nhận trả lại"
      ✓ og_ticket cancelled, ticket về pool
      → Chuyển về danh sách
```

## 7. Phân quyền

| Hành động | Điều kiện |
|-----------|-----------|
| Xem pool | Account đã auth |
| Claim | Account thuộc 1 OG |
| Xem danh sách OG ticket | Account thuộc OG đó |
| Xem chi tiết | Account thuộc OG đang giữ |
| Update | Account thuộc OG đang giữ |
| Release | Account thuộc OG đang giữ |
| Xem history | Account đã auth |

## 8. Checklist triển khai FE

### Pages
- [ ] Page `app/pages/pmc/og-tickets/pool.vue` — Pool
- [ ] Page `app/pages/pmc/og-tickets/index.vue` — Danh sách
- [ ] Page `app/pages/pmc/og-tickets/[id].vue` — Chi tiết
- [ ] Page `app/pages/pmc/og-tickets/history/[ticketId].vue` — Lịch sử

### Components
- [ ] Claim confirm dialog (UModal)
- [ ] Release dialog (UModal + textarea)
- [ ] OG Ticket status badge
- [ ] Priority badge
- [ ] SLA indicator (đỏ nếu quá hạn)

### API
- [ ] Composable `app/composables/api/useOgTickets.ts`
- [ ] Types cho OgTicket, PoolTicket, payloads, filters

### Logic
- [ ] Pool: search + claim flow
- [ ] List: search + filter + sort + pagination
- [ ] Detail: form xử lý + save + release
- [ ] History: query by ticketId
- [ ] Error handling (concurrent claim, auth errors)
