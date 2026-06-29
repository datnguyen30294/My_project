# Ticket Landing Page - Đặc tả kỹ thuật Frontend

> Module: `Requester/Ticket` | Ngày tạo: 2026-03-10 | Trạng thái: Draft

## 1. Tổng quan

Landing page công khai để cư dân gửi yêu cầu sửa chữa / bảo trì. Không cần đăng nhập. Form đơn giản, hỗ trợ prefill từ URL params.

**Đặc điểm:**
- Public (không auth, không dùng layout admin)
- 1 page duy nhất: form nhập + submit
- Hỗ trợ URL params → prefill form
- Responsive (mobile-first — cư dân thường dùng điện thoại)

## 2. Pages

### 2.1 Ticket Submit Page

**Route:** `/ticket`

**Layout:** `public` (không sidebar, không header admin)

**URL Params:**

```
/ticket?name=Nguyễn Văn A&phone=0901111111&apartment=A-101&project_id=5&org_id=3&channel=phone
```

| Param | Form field | Hiện trên form | Ghi chú |
|-------|-----------|----------------|---------|
| `name` | `requester_name` | Có (prefill, sửa được) | |
| `phone` | `requester_phone` | Có (prefill, sửa được) | |
| `apartment` | `apartment_name` | Có (prefill, sửa được) | |
| `project_id` | `project_id` | Có (prefill, sửa được) | Dropdown chọn dự án |
| `org_id` | `claimed_by_org_id` | **Không** | Hidden |
| `channel` | `channel` | **Không** | Hidden, default `website` |

## 3. Components

### 3.1 Form gửi yêu cầu

**File:** `app/pages/ticket/index.vue`

**Form fields:**

| Field | Component | Required | Mô tả |
|-------|-----------|----------|-------|
| Họ tên | `UInput` | Có | `requester_name` |
| Số điện thoại | `UInput` (type=tel) | Có | `requester_phone` |
| Căn hộ | `UInput` | Không | `apartment_name` (text tự nhập) |
| Dự án | `USelect` | Có | `project_id` — lấy danh sách từ API |
| Tiêu đề yêu cầu | `UInput` | Có | `subject` |
| Mô tả chi tiết | `UTextarea` | Không | `description` |

**Hidden fields (từ URL params, không hiện form):**
- `channel` — default `website`
- `claimed_by_org_id` — pre-assign OG (nếu có)

**Actions:**
- Nút **Gửi yêu cầu** (`UButton`) → `POST /api/v1/tickets`

### 3.2 States

| State | Hiển thị |
|-------|---------|
| Default | Form trống hoặc prefill từ params |
| Submitting | Button loading, form disabled |
| Success | Ẩn form, hiện thông báo thành công + mã ticket (`TK-2026-XXX`) |
| Error | Validation errors inline dưới từng field |

### 3.3 Success State

Sau khi submit thành công:
- Ẩn form
- Hiện card thông báo:
  - Icon check xanh
  - "Yêu cầu đã được gửi thành công!"
  - Mã ticket: **TK-2026-XXX** (font mono, nổi bật)
  - "Vui lòng ghi lại mã này để theo dõi."
- Nút "Gửi yêu cầu khác" → reset form

## 4. API Integration

### 4.1 Composable

**File:** `app/composables/api/useTickets.ts`

```typescript
// Submit ticket (public, no auth — dùng $fetch thay vì $api)
function apiSubmitTicket(data: SubmitTicketPayload): Promise<TicketResponse>
// → POST /api/v1/tickets
```

> Không dùng `$api` (cần auth) mà dùng `$fetch` trực tiếp vì đây là public API.

### 4.2 Types

```typescript
interface SubmitTicketPayload {
  requester_name: string
  requester_phone: string
  apartment_name?: string
  project_id: number
  subject: string
  description?: string
  channel?: string           // hidden, default 'website'
  claimed_by_org_id?: number // hidden, from URL param
}

interface TicketResponse {
  id: number
  code: string
  requester_name: string
  requester_phone: string
  apartment_name: string | null
  project: { id: number; name: string }
  subject: string
  description: string | null
  status: { value: string; label: string }
  channel: { value: string; label: string }
  claimed_by_org_id: number | null
  claimed_at: string | null
  created_at: string
}
```

## 5. Luồng người dùng

```
Cư dân nhận link (có params) hoặc truy cập trực tiếp
  → Landing page /ticket
    → Form prefill từ params (nếu có)
    → Cư dân nhập / sửa thông tin
    → Bấm "Gửi yêu cầu"
      ✓ Thành công: Hiện mã ticket, cư dân chụp lại
      ✗ Lỗi: Hiện validation errors, cư dân sửa và gửi lại
```

## 6. UX Notes

- **Mobile-first**: stack layout, input lớn, dễ bấm trên điện thoại
- Sau submit thành công: không redirect, cư dân có thể chụp màn hình mã ticket
- Form validation **client-side** trước khi gọi API (required fields, phone format)
- Dự án dropdown: nếu có `project_id` param → auto-select, vẫn cho đổi

## 7. Checklist triển khai FE

- [ ] Layout `public` cho landing page (nếu chưa có)
- [ ] Page `app/pages/ticket/index.vue`
- [ ] Composable `app/composables/api/useTickets.ts`
- [ ] Types `SubmitTicketPayload`, `TicketResponse`
- [ ] URL params parsing + prefill logic (`useRoute().query`)
- [ ] Form validation (UForm + zod/yup schema)
- [ ] Success state (hiện mã ticket)
- [ ] Error handling (validation errors, network errors)
- [ ] Responsive design (mobile-first)
