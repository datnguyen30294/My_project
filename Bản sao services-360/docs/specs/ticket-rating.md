# Spec: Ticket Rating/Feedback

## Tổng quan

Cư dân nhận link `/tickets/{code}` (ví dụ `/tickets/TK-2026-042`) để xem thông tin ticket và đánh giá dịch vụ. Rating sync giữa platform `tickets` và tenant `og_tickets`.

## 1. Database

### Migration 1: Platform DB — `add_rating_fields_to_tickets_table`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `resident_rating` | `SMALLINT` | YES | Điểm 1-5 |
| `resident_rating_comment` | `TEXT` | YES | Nhận xét |
| `resident_rated_at` | `TIMESTAMP` | YES | Thời điểm đánh giá |

### Migration 2: Tenant DB — `add_rating_fields_to_og_tickets_table`

Cùng 3 columns như trên, thêm vào `og_tickets`.

## 2. Backend API

### 2.1 Public Endpoints (không auth)

Đăng ký trong `Platform/routes/api.php`.

#### GET `/api/v1/tickets/{code}`

Trả thông tin ticket cơ bản + trạng thái rating cho cư dân xem.

**Response 200:**

```json
{
  "success": true,
  "data": {
    "code": "TK-2026-042",
    "subject": "Sửa ống nước tầng 3",
    "requester_name": "Nguyễn Văn A",
    "requester_phone": "0901234567",
    "description": "Ống nước bị rò rỉ...",
    "address": "Tòa A, Tầng 3, Căn 301",
    "status": { "value": "completed", "label": "Hoàn thành" },
    "channel": { "value": "website", "label": "Website" },
    "created_at": "2026-03-20T10:00:00+07:00",
    "is_ratable": true,
    "rating": null
  }
}
```

- `is_ratable = true` khi: `status = completed` AND `resident_rating IS NULL`
- `rating`: `null` nếu chưa rate, hoặc `{ rating: 4, comment: "...", rated_at: "..." }` nếu đã rate

**Response 404:** Ticket không tồn tại.

#### POST `/api/v1/tickets/{code}/rating`

Submit đánh giá.

**Request:**

```json
{
  "resident_rating": 4,
  "resident_rating_comment": "Kỹ thuật phản hồi nhanh"
}
```

**Validation (`SubmitTicketRatingRequest`):**

| Field | Rules |
|-------|-------|
| `resident_rating` | required, integer, min:1, max:5 |
| `resident_rating_comment` | nullable, string, max:1000 |

**Business Rules:**

1. Lookup ticket by `code` → 404 nếu không tìm thấy
2. `status != completed` → 422 "Ticket chưa hoàn thành"
3. `resident_rating != null` → 422 "Ticket đã được đánh giá"
4. Lưu rating vào `tickets` (platform DB)
5. Sync rating xuống `og_tickets` (tenant DB) qua `claimed_by_org_id`

**Response 200:**

```json
{
  "success": true,
  "message": "Cảm ơn bạn đã đánh giá!"
}
```

### 2.2 Sync Logic

`OgTicketExternalService::syncRating(Ticket $ticket)`:
- Dùng `claimed_by_org_id` → `Organization::find()` → `$tenant->run()`
- Update `og_tickets` WHERE `ticket_id = $ticket->id` AND active
- Sync 3 fields: `resident_rating`, `resident_rating_comment`, `resident_rated_at`

### 2.3 Hiển thị Rating trên Admin Pages

Rating fields được include trong:
- `TicketResource` — platform admin xem ticket detail
- `OgTicketDetailResource` — tenant admin xem OG ticket detail

Cả 2 resources thêm:

```json
{
  "resident_rating": 4,
  "resident_rating_comment": "Kỹ thuật phản hồi nhanh",
  "resident_rated_at": "2026-03-31T10:30:00+07:00"
}
```

## 3. Backend Files

| Action | File |
|--------|------|
| New | `Platform/src/Ticket/Controllers/TicketRatingController.php` |
| New | `Platform/src/Ticket/Requests/SubmitTicketRatingRequest.php` |
| Edit | `Platform/src/Ticket/Services/TicketService.php` — thêm `getPublicTicketInfo()`, `submitRating()` |
| Edit | `Platform/src/Ticket/Contracts/TicketServiceInterface.php` — thêm 2 method signatures |
| Edit | `Platform/src/Ticket/Repositories/TicketRepository.php` — thêm `findByCode()` |
| Edit | `Platform/src/Ticket/Models/Ticket.php` — thêm fillable + casts |
| Edit | `Platform/src/Ticket/Resources/TicketResource.php` — include rating fields |
| Edit | `Platform/src/Ticket/ExternalServices/OgTicketExternalServiceInterface.php` — thêm `syncRating()` |
| Edit | `Platform/src/Ticket/ExternalServices/OgTicketExternalService.php` — implement `syncRating()` |
| Edit | `PMC/src/OgTicket/Models/OgTicket.php` — thêm fillable + casts |
| Edit | `PMC/src/OgTicket/Resources/OgTicketDetailResource.php` — include rating fields |
| Edit | `Platform/routes/api.php` — thêm 2 routes |
| New | Migration platform: `add_rating_fields_to_tickets_table` |
| New | Migration tenant: `add_rating_fields_to_og_tickets_table` |
| New | `Platform/tests/TicketRatingTest.php` |

## 4. Frontend

### 4.1 Public Page: `/tickets/{code}`

**File:** `frontend/app/pages/tickets/[code].vue`
**Layout:** `false` (no sidebar/header — giống `/ticket/index.vue`)
**Auth:** Không cần

**UI Structure:**

```
┌─────────────────────────────────────────┐
│            Logo + Header                │
├─────────────────────────────────────────┤
│                                         │
│  Thông tin yêu cầu                      │
│  ┌───────────────────────────────────┐  │
│  │ Mã ticket:    TK-2026-042        │  │
│  │ Tiêu đề:     Sửa ống nước tầng 3 │  │
│  │ Người gửi:   Nguyễn Văn A        │  │
│  │ SĐT:         0901234567          │  │
│  │ Mô tả:       Ống nước bị rò...   │  │
│  │ Địa chỉ:     Tòa A, Tầng 3      │  │
│  │ Trạng thái:  ● Hoàn thành        │  │
│  │ Ngày tạo:    20/03/2026          │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ─── Nếu is_ratable = true ───         │
│                                         │
│  Đánh giá dịch vụ                       │
│  ┌───────────────────────────────────┐  │
│  │ Điểm đánh giá: ☆ ☆ ☆ ☆ ☆        │  │
│  │                                   │  │
│  │ Nhận xét:                         │  │
│  │ ┌───────────────────────────────┐ │  │
│  │ │ (textarea)                    │ │  │
│  │ └───────────────────────────────┘ │  │
│  │                                   │  │
│  │ [Gửi đánh giá]                    │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ─── Nếu đã rate ───                   │
│                                         │
│  Đánh giá của bạn                       │
│  ┌───────────────────────────────────┐  │
│  │ ★★★★☆ (4/5)                      │  │
│  │ "Kỹ thuật phản hồi nhanh..."     │  │
│  │ Đánh giá lúc: 31/03/2026 10:30   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ─── Nếu chưa hoàn thành ───          │
│                                         │
│  UAlert: "Ticket chưa hoàn thành,      │
│   chưa thể đánh giá."                  │
│                                         │
└─────────────────────────────────────────┘
```

### 4.2 Rating Display — Admin Pages

**Shared Component:** `components/shared/ticket/TicketRatingDisplay.vue`

```ts
interface Props {
  rating: number | null
  comment: string | null
  ratedAt: string | null
}
```

Dùng trong:
- `pages/platform/tickets/[id].vue` — platform admin
- `pages/pmc/og-tickets/[id]/index.vue` — tenant admin

Hiển thị:
- Có rating: stars + score + comment + timestamp
- Chưa có: "Chưa có đánh giá"

### 4.3 API Composable

Thêm vào `composables/api/useTickets.ts`:

```ts
// Public ticket info (cho rating page)
export function usePublicTicketInfo(code: MaybeRefOrGetter<string>) { ... }

// Submit rating (public)
export async function apiSubmitTicketRating(code: string, data: {
  resident_rating: number
  resident_rating_comment?: string
}) { ... }
```

### 4.4 Frontend Files

| Action | File |
|--------|------|
| New | `pages/tickets/[code].vue` — public ticket info + rating form |
| New | `components/shared/ticket/TicketRatingDisplay.vue` — shared rating display |
| Edit | `composables/api/useTickets.ts` — thêm rating API functions |
| Edit | `pages/platform/tickets/[id].vue` — thêm rating section |
| Edit | `pages/pmc/og-tickets/[id]/index.vue` — thêm rating section |

## 5. Test Cases

| # | Test | Expected |
|---|------|----------|
| 1 | GET public ticket info — exists, completed, not rated | 200, `is_ratable: true` |
| 2 | GET public ticket info — not found | 404 |
| 3 | GET public ticket info — not completed | 200, `is_ratable: false` |
| 4 | GET public ticket info — already rated | 200, `is_ratable: false`, `rating` populated |
| 5 | POST rating — happy path (pool ticket, has org) | 200, saved to `tickets`, synced to `og_tickets` |
| 6 | POST rating — happy path (direct ticket) | 200, saved + synced |
| 7 | POST rating — ticket not completed | 422 |
| 8 | POST rating — already rated | 422 |
| 9 | POST rating — invalid rating (0, 6, string) | 422 validation |
| 10 | POST rating — comment too long (>1000) | 422 validation |
| 11 | POST rating — ticket not claimed (no org, pending in pool) | 200, saved to `tickets` only (no tenant to sync) |

## 6. Flow Tổng Kết

```
Cư dân → /tickets/TK-2026-042
    │
    GET /api/v1/tickets/TK-2026-042
    │
    ├─ 404 → "Không tìm thấy"
    ├─ Not completed → Hiện info + alert "Chưa hoàn thành"
    ├─ Already rated → Hiện info + rating read-only
    └─ Ratable → Hiện info + form
            │
            POST /api/v1/tickets/TK-2026-042/rating
            │
            ├─→ tickets (platform DB) ✓
            └─→ og_tickets (tenant DB) ✓ sync
            │
            ▼
    "Cảm ơn bạn đã đánh giá!" + show rating read-only
```
