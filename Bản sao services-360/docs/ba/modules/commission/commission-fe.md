# Module Cấu hình chia hoa hồng - Đặc tả kỹ thuật Frontend

> Module: Kế toán/Tài chính / Cấu hình chia hoa hồng | Ngày tạo: 2026-03-25 | Trạng thái: Draft

## 1. Tổng quan

Frontend cho cấu hình chia hoa hồng theo dự án: danh sách dự án (card grid), trang cấu hình chi tiết (form phức tạp 3 cấp). Cấu hình gồm 4 bên chia % (Bước 1), phân bổ phòng ban (Bước 2), phân bổ cá nhân (Bước 3), và danh sách người điều chỉnh.

**Scope:**
- Trang danh sách dự án (card grid, trạng thái cấu hình)
- Trang cấu hình dự án (form nested 3 cấp: 4 bên → phòng ban → cá nhân)
- Section người điều chỉnh hoa hồng (multi-select + bảng)

## 2. Routes (Pages)

| Route | File | Mô tả |
|-------|------|-------|
| `/pmc/commission` | `app/pages/pmc/commission/index.vue` | Danh sách dự án (card grid) |
| `/pmc/commission/[projectId]` | `app/pages/pmc/commission/[projectId].vue` | Cấu hình hoa hồng cho dự án |

## 3. Navigation & Breadcrumb

### 3.1 Sidebar

Thêm group mới trong `useNavigation.ts`:

```typescript
{
  label: 'Kế toán/Tài chính',
  icon: 'account_balance',
  children: [
    { label: 'Cấu hình hoa hồng', to: '/pmc/commission' }
  ]
}
```

### 3.2 Breadcrumb

Thêm vào `useBreadcrumb.ts`:

```typescript
// ROUTE_LABELS
'commission': 'Cấu hình hoa hồng'

// PARENT_GROUP
'commission': 'Kế toán/Tài chính'
```

Breadcrumb trail: `Trang chủ > Kế toán/Tài chính > Cấu hình hoa hồng > {Tên dự án}`

## 4. API Composable

**File:** `app/composables/api/useCommissionConfig.ts`

### 4.1 Queries (GET — useApiFetch)

| Function | Endpoint | Mô tả |
|----------|----------|-------|
| `useCommissionProjects()` | `GET /api/v1/pmc/commission/projects` | Danh sách dự án + trạng thái config |
| `useCommissionConfig(projectId)` | `GET /api/v1/pmc/commission/projects/{projectId}` | Chi tiết config (4 bên + dept rules + staff rules + adjusters) |
| `useAvailableDepartments(projectId)` | `GET /api/v1/pmc/commission/projects/{projectId}/available-departments` | Phòng ban + NV khả dụng cho config |

### 4.2 Mutations (POST/PUT — $api)

| Function | Endpoint | Mô tả |
|----------|----------|-------|
| `apiSaveCommissionConfig(projectId, data)` | `PUT /api/v1/pmc/commission/projects/{projectId}` | Lưu toàn bộ config (upsert) |
| `apiSaveCommissionAdjusters(projectId, data)` | `PUT /api/v1/pmc/commission/projects/{projectId}/adjusters` | Lưu danh sách người điều chỉnh |

### 4.3 Constants & Helpers

```typescript
// Value type options
export const COMMISSION_VALUE_TYPE_OPTIONS = [
  { label: 'Phần trăm', value: 'percent' },
  { label: 'Tiền cứng', value: 'fixed' },
  { label: 'Cả hai', value: 'both' }
] as const

export type CommissionValueType = 'percent' | 'fixed' | 'both'

// Value type label helper
export function commissionValueTypeLabel(value: string): string {
  return COMMISSION_VALUE_TYPE_OPTIONS.find(o => o.value === value)?.label ?? value
}
```

## 5. TypeScript Types

```typescript
// ─── API Response Types ───

interface CommissionProjectItem {
  id: number
  code: string
  name: string
  address: string | null
  is_configured: boolean
  dept_rules_count: number
}

interface CommissionConfigResponse {
  project: {
    id: number
    code: string
    name: string
  }
  config: {
    platform_percent: string
    operating_company_percent: string
    board_of_directors_percent: string
    management_percent: string
  }
  dept_rules: CommissionDeptRuleResponse[]
  adjusters: CommissionAdjusterResponse[]
}

interface CommissionDeptRuleResponse {
  id: number
  department: { id: number; name: string }
  sort_order: number
  value_type: { value: CommissionValueType; label: string }
  percent: string | null
  value_fixed: string | null
  staff_rules: CommissionStaffRuleResponse[]
}

interface CommissionStaffRuleResponse {
  id: number
  account: { id: number; name: string; employee_code: string }
  sort_order: number
  value_type: { value: CommissionValueType; label: string }
  percent: string | null
  value_fixed: string | null
}

interface CommissionAdjusterResponse {
  id: number
  account: { id: number; name: string; employee_code: string }
}

interface AvailableDepartment {
  id: number
  name: string
  accounts: { id: number; name: string; employee_code: string }[]
}

// ─── Form State Types (local) ───

interface CommissionConfigForm {
  platform_percent: number
  operating_company_percent: number
  board_of_directors_percent: number
  management_percent: number
}

interface DeptRuleForm {
  department_id: number
  department_name: string          // display only
  sort_order: number
  value_type: CommissionValueType
  percent: number | null
  value_fixed: number | null
  expanded: boolean                // UI state — expand/collapse staff section
  staff_rules: StaffRuleForm[]
}

interface StaffRuleForm {
  account_id: number
  account_name: string             // display only
  employee_code: string            // display only
  selected: boolean                // checkbox — tham gia chia hay không
  sort_order: number
  value_type: CommissionValueType
  percent: number | null
  value_fixed: number | null
}

// ─── Payloads ───

interface SaveCommissionConfigPayload {
  platform_percent: number
  operating_company_percent: number
  board_of_directors_percent: number
  management_percent: number
  dept_rules: {
    department_id: number
    sort_order: number
    value_type: CommissionValueType
    percent: number | null
    value_fixed: number | null
    staff_rules: {
      account_id: number
      sort_order: number
      value_type: CommissionValueType
      percent: number | null
      value_fixed: number | null
    }[]
  }[]
}

interface SaveCommissionAdjustersPayload {
  account_ids: number[]
}
```

## 6. Pages

### 6.1 Danh sách dự án (`/pmc/commission`)

**Layout:** Card grid (giống mockup BA).

**Header:**
- Title: "Cấu hình chia hoa hồng"
- Description: "Thiết lập quy tắc chia tiền hoa hồng theo dự án"

**Content:** Grid cards — mỗi card = 1 dự án.

**Card layout:**

```
┌─────────────────────────────────┐
│ [Tên dự án]          [Badge]    │
│ Mã: PJ-001                     │
│ Địa chỉ: 123 Nguyễn Văn Linh   │
│                                 │
│ Phòng ban: 3                    │
└─────────────────────────────────┘
```

| Element | Mô tả |
|---------|-------|
| Tên dự án | `name` — font bold |
| Badge | `UBadge` — "Đã cấu hình" (success) / "Chưa cấu hình" (neutral) |
| Mã | `code` — mono text |
| Địa chỉ | `address` — text-sm text-slate-500 |
| Phòng ban | `dept_rules_count` — số phòng ban đã cấu hình |

**Click card** → navigate `/pmc/commission/{project.id}`

**Grid:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`

**Empty state:** `UEmpty` — "Chưa có dự án nào." (hiển thị khi không có project managing)

**Loading:** Skeleton cards (pulse)

### 6.2 Cấu hình dự án (`/pmc/commission/[projectId]`)

**Layout:** Single-column form, stacked sections. Không dùng grid 2 cột vì form phức tạp cần full-width.

**Header:**
- Back button → `/pmc/commission`
- Title: "Cấu hình hoa hồng"
- Subtitle: `{project.code} — {project.name}`
- Dynamic breadcrumb: `useDynamicLabel(computed(() => project.name))`

**Data loading:**
- `useCommissionConfig(projectId)` — load config hiện tại (hoặc default 0)
- `useAvailableDepartments(projectId)` — load phòng ban + NV khả dụng
- Khi cả 2 load xong → init form state

---

#### Section 1: Phân bổ 4 bên

**Component:** `SharedSectionCard` title="Phân bổ hoa hồng (tổng 100%)"

**Form fields:**

| Field | Component | Mô tả |
|-------|-----------|-------|
| Platform (%) | `UInput` type="number", min=0, max=100, step=0.01 | Default 0 |
| Công ty vận hành (%) | `UInput` type="number", min=0, max=100, step=0.01 | |
| Ban quản trị (%) | `UInput` type="number", min=0, max=100, step=0.01 | |
| Ban quản lý (%) | `UInput` type="number", min=0, max=100, step=0.01 | |

**Layout:** `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`

**Tổng %:** Hiển thị computed sum bên dưới 4 inputs:
- `= 100%` → text-success: "Tổng: 100% ✓"
- `≠ 100%` → text-error: "Tổng: {sum}% (phải bằng 100%)"

---

#### Section 2: Phân bổ Ban quản lý theo phòng ban

**Component:** `SharedSectionCard` title="Phân bổ theo phòng ban"

**Mô tả:** Chỉ hiển thị khi `management_percent > 0`. Danh sách phòng ban thuộc dự án, mỗi phòng ban có checkbox + config.

**Layout tổng quan:**

```
┌─ SharedSectionCard: "Phân bổ theo phòng ban" ──────────────────┐
│                                                                 │
│  Tổng %: 100% ✓   |   Tổng tiền cứng: 60.000 đ/đơn            │
│                                                                 │
│  ┌─ Phòng ban row ──────────────────────────────────────────┐   │
│  │ ☑ [1] Phòng IT                                           │   │
│  │   Loại: [Cả hai ▼]   %: [60]   Tiền cứng: [50.000]      │   │
│  │   [▼ Chỉ định cá nhân (3 NV)]                            │   │
│  │                                                           │   │
│  │   ┌─ Staff rules (expanded) ──────────────────────────┐   │   │
│  │   │ ☑ [1] Nguyễn Văn A (NV001)                        │   │   │
│  │   │   Loại: [Tiền cứng ▼]   Tiền cứng: [80.000]       │   │   │
│  │   │ ☑ [2] Trần Thị B (NV002)                          │   │   │
│  │   │   Loại: [Phần trăm ▼]   %: [100]                  │   │   │
│  │   │ ☐ Lê Văn C (NV003)                                │   │   │
│  │   │   Tổng %: 100% ✓                                  │   │   │
│  │   └────────────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─ Phòng ban row ──────────────────────────────────────────┐   │
│  │ ☑ [2] Phòng Kế toán                                      │   │
│  │   Loại: [Phần trăm ▼]   %: [40]                          │   │
│  │   [▶ Chỉ định cá nhân (1 NV)]                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─ Phòng ban row (unchecked) ──────────────────────────────┐   │
│  │ ☐ Phòng Hành chính                                       │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

**Mỗi phòng ban row:**

| Element | Component | Mô tả |
|---------|-----------|-------|
| Checkbox | `UCheckbox` | Tick = tham gia chia, untick = không |
| Sort order | `UInput` type="number", min=1 | Thứ tự ưu tiên trừ tiền cứng |
| Tên phòng ban | Text | Hiển thị `department.name` |
| Loại giá trị | `USelect` | Options: Phần trăm / Tiền cứng / Cả hai |
| Phần trăm (%) | `UInput` type="number" | Hiện khi value_type = percent hoặc both |
| Tiền cứng (đ) | `UInput` type="number" | Hiện khi value_type = fixed hoặc both. Format VND |
| Toggle cá nhân | `UButton` variant="ghost" | Expand/collapse staff rules section |

**Khi checkbox = unchecked:** Ẩn toàn bộ inputs (sort_order, value_type, percent, value_fixed, staff section). Chỉ hiển thị tên phòng ban mờ.

**Summary bar (đầu section):**
- Tổng % (các dept checked có percent/both): hiển thị `{sum}%` + trạng thái ✓/✗
- Tổng tiền cứng (các dept checked có fixed/both): hiển thị `{sum} đ/đơn` (chỉ informational, không validate)

---

#### Section 2b: Chỉ định cá nhân trong phòng ban (nested)

Hiển thị khi expand phòng ban. Danh sách NV thuộc phòng ban + thuộc dự án.

**Hành vi mặc định khi mở expand lần đầu:**
- Auto tick tất cả NV
- Chia đều `percent = Math.round(100 / n * 100) / 100` cho mỗi NV
- `value_type = 'percent'`
- `sort_order` = index + 1
- User có thể điều chỉnh tuỳ ý

**Mỗi NV row:**

| Element | Component | Mô tả |
|---------|-----------|-------|
| Checkbox | `UCheckbox` | Tick = nhận hoa hồng, untick = không nhận |
| Sort order | `UInput` type="number", min=1 | Thứ tự ưu tiên |
| Tên NV | Text | `{account.name} ({account.employee_code})` |
| Loại giá trị | `USelect` | Phần trăm / Tiền cứng / Cả hai |
| Phần trăm (%) | `UInput` type="number" | Hiện khi value_type = percent hoặc both |
| Tiền cứng (đ) | `UInput` type="number" | Hiện khi value_type = fixed hoặc both |

**Khi checkbox = unchecked:** Ẩn inputs, hiển thị tên NV mờ.

**Summary bar (cuối staff list):**
- Tổng % (staff checked có percent/both): `{sum}%` + trạng thái ✓/✗

---

#### Section 3: Người điều chỉnh hoa hồng theo đơn

**Component:** `SharedSectionCard` title="Người được phép điều chỉnh hoa hồng theo đơn"

**Mô tả:** Chỉ những người trong danh sách mới được override hoa hồng bậc 3 trên đơn thuộc dự án.

**Layout:**

```
┌─ SharedSectionCard ─────────────────────────────────────────┐
│                                                              │
│  [USelectMenu multiple ─────────────────] [Thêm]             │
│                                                              │
│  ┌─ Bảng danh sách ────────────────────────────────────┐     │
│  │ Tên            | Mã NV   | Thao tác                 │     │
│  │ Nguyễn Văn A   | NV001   | [Xóa]                    │     │
│  │ Trần Thị B     | NV002   | [Xóa]                    │     │
│  └─────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────┘
```

| Element | Component | Mô tả |
|---------|-----------|-------|
| Select nhân viên | `USelectMenu` multiple | Chỉ hiển thị NV thuộc dự án, chưa có trong danh sách |
| Nút Thêm | `UButton` | Thêm tất cả NV đã chọn vào bảng |
| Bảng | `UTable` | Danh sách adjusters hiện tại |
| Nút Xóa | `UButton` icon="i-lucide-trash-2" variant="ghost" color="error" | Xóa từng dòng |

**Lưu riêng:** Nút "Lưu danh sách" gọi `apiSaveCommissionAdjusters()` — tách biệt với config chính.

---

#### Section 4: Actions (sticky bottom)

| Element | Component | Mô tả |
|---------|-----------|-------|
| Nút Lưu cấu hình | `UButton` color="primary" | Validate + gọi `apiSaveCommissionConfig()` |
| Nút Hủy | `UButton` color="neutral" variant="ghost" | Navigate back `/pmc/commission` |

**Desktop:** Actions nằm cuối form, cố định khi scroll (`sticky bottom-0`).

**Mobile:** Sticky bottom bar (giống pattern order detail).

---

### Form Validation (client-side)

Validate trước khi submit, hiển thị lỗi inline:

| Rule | Kiểm tra | Message |
|------|----------|---------|
| Tổng 4 bên | `platform + operating + directors + management === 100` | "Tổng phân bổ 4 bên phải bằng 100%" |
| Ít nhất 1 dept | Phải có ít nhất 1 phòng ban checked | "Phải chọn ít nhất 1 phòng ban" |
| Tổng % dept | Sum percent (dept checked, value_type percent/both) === 100 | "Tổng % phòng ban phải bằng 100%" |
| Sort order dept unique | sort_order không trùng nhau giữa các dept checked | "Thứ tự ưu tiên phòng ban không được trùng" |
| Ít nhất 1 NV/dept | Mỗi dept checked phải có ít nhất 1 NV checked | "Phòng ban {name} phải có ít nhất 1 nhân viên" |
| Tổng % staff | Trong mỗi dept, sum percent (staff checked, percent/both) === 100 | "Tổng % nhân viên trong {dept_name} phải bằng 100%" |
| Sort order staff unique | Trong mỗi dept, sort_order không trùng nhau giữa staff checked | "Thứ tự ưu tiên nhân viên trong {dept_name} không được trùng" |
| Percent required | Bắt buộc khi value_type = percent/both | "Phần trăm là bắt buộc" |
| Value fixed required | Bắt buộc khi value_type = fixed/both | "Tiền cứng là bắt buộc" |

---

### Form Init Logic

Khi load trang, cần merge 2 nguồn data:

1. **Config hiện tại** (từ `useCommissionConfig`) — nếu đã cấu hình
2. **Available departments** (từ `useAvailableDepartments`) — danh sách đầy đủ

**Logic init `deptRules` form state:**

```
for each dept in availableDepartments:
    existingRule = config.dept_rules.find(r => r.department.id === dept.id)
    if existingRule:
        // Có config → map vào form (checked = true)
        // Map staff_rules từ existing + merge NV mới (nếu có NV thêm vào dept sau khi config)
    else:
        // Chưa config → checkbox unchecked, default values
```

**Merge NV mới:** Khi dept đã có config nhưng có NV mới được thêm vào dự án sau đó → hiển thị NV mới ở cuối list, unchecked.

## 7. Components

### 7.1 Reuse từ project

- `SharedSectionCard` — card container cho mỗi section
- `UInput`, `USelect`, `USelectMenu`, `UCheckbox`, `UButton`, `UTable`, `UBadge`, `UAlert`, `UEmpty` — Nuxt UI
- `useBreadcrumb` + `useDynamicLabel` — breadcrumb tự động

### 7.2 Components mới

| Component | File | Mô tả |
|-----------|------|-------|
| `CommissionDeptRuleRow` | `app/components/commission/DeptRuleRow.vue` | 1 phòng ban row (checkbox + inputs + expandable staff) |
| `CommissionStaffRuleRow` | `app/components/commission/StaffRuleRow.vue` | 1 NV row (checkbox + inputs) |
| `CommissionAdjusterSection` | `app/components/commission/AdjusterSection.vue` | Section người điều chỉnh (select + bảng) |

**Lý do tách component:** Form nested 3 cấp quá phức tạp để viết trong 1 page file. Tách giúp:
- Mỗi component quản lý state cục bộ (expand/collapse, validation)
- Page chỉ quản lý top-level state + submit
- Dễ test, dễ maintain

**Props / Events pattern:**

```vue
<!-- Page -->
<CommissionDeptRuleRow
  v-for="dept in deptRules"
  :key="dept.department_id"
  v-model="dept"
  :available-accounts="getAccountsForDept(dept.department_id)"
/>

<!-- DeptRuleRow emits -->
<CommissionStaffRuleRow
  v-for="staff in modelValue.staff_rules"
  :key="staff.account_id"
  v-model="staff"
/>
```

## 8. User Flows

### 8.1 Cấu hình lần đầu

1. Vào `/pmc/commission` → thấy danh sách dự án, badge "Chưa cấu hình"
2. Click vào dự án → `/pmc/commission/{projectId}`
3. Section 1: Nhập % cho 4 bên (Platform, Công ty VH, Ban quản trị, Ban quản lý) → tổng = 100%
4. Section 2: Tick phòng ban tham gia, set sort_order + value_type + percent/value_fixed
5. Expand phòng ban → NV auto tick + chia đều %. Điều chỉnh nếu cần.
6. Bấm "Lưu cấu hình" → API call → toast success
7. (Optional) Section 3: Thêm người điều chỉnh → "Lưu danh sách"

### 8.2 Chỉnh sửa cấu hình

1. Vào dự án đã cấu hình → form load data hiện tại
2. Sửa % / thêm-bỏ phòng ban / thêm-bỏ NV / đổi sort_order
3. Bấm "Lưu cấu hình" → full replace config → toast success

### 8.3 Thêm phòng ban mới

1. Phòng ban mới thuộc dự án xuất hiện ở list (unchecked)
2. Tick checkbox → set config → expand → NV auto tick chia đều
3. Lưu

### 8.4 NV mới vào dự án (sau khi đã config)

1. Mở config dự án → phòng ban đã config
2. NV mới xuất hiện ở cuối staff list (unchecked)
3. Tick nếu muốn → điều chỉnh % → lưu

### 8.5 Error handling

| Error | Xử lý |
|-------|--------|
| Validation fail (client) | Highlight fields lỗi, hiển thị message inline, block submit |
| Validation fail (server 422) | Parse `errors` → map về fields tương ứng, toast error message |
| Network error | Toast error: "Lưu thất bại. Vui lòng thử lại." |
| Project not found (404) | `SharedCrudPageError` + nút quay lại |

## 9. Format Helpers

```typescript
// Reuse từ utils/number.ts
formatCurrency(value)  // → "1.000.000 đ"

// Mới — trong composable
commissionValueTypeLabel(value)  // → "Phần trăm" | "Tiền cứng" | "Cả hai"

// Computed helpers trong page
const totalTopPercent = computed(() =>
  form.platform_percent + form.operating_company_percent
  + form.board_of_directors_percent + form.management_percent
)

const totalDeptPercent = computed(() =>
  checkedDepts.value
    .filter(d => d.value_type === 'percent' || d.value_type === 'both')
    .reduce((sum, d) => sum + (d.percent ?? 0), 0)
)

const totalDeptFixed = computed(() =>
  checkedDepts.value
    .filter(d => d.value_type === 'fixed' || d.value_type === 'both')
    .reduce((sum, d) => sum + (d.value_fixed ?? 0), 0)
)
```

## 10. Responsive Design

| Breakpoint | Layout |
|------------|--------|
| Mobile (`< sm`) | Card grid 1 col. Form inputs stacked. Staff rules full-width. Sticky action bar bottom. |
| Tablet (`sm`) | Card grid 2 cols. Form inputs 2 cols. |
| Desktop (`lg`) | Card grid 3 cols. Section 1 inputs 4 cols. Actions sticky bottom. |

## 11. Lưu ý khi implement

1. **Form state complexity:** Dùng `ref<DeptRuleForm[]>` cho dept rules. Mỗi dept chứa `staff_rules: StaffRuleForm[]`. Tránh deep reactivity issues — sử dụng `v-model` + component emit pattern.
2. **Build payload khi submit:** Chỉ gửi dept checked + staff checked. Filter out unchecked trước khi gọi API.
3. **Chia đều %:** `Math.round(100 / n * 100) / 100` cho n-1 NV đầu, NV cuối = `100 - sum(n-1)` để tránh lệch do làm tròn.
4. **Sort order auto-assign:** Khi tick thêm dept/NV mới, auto gán `sort_order = max(existing) + 1`.
5. **Adjusters section tách biệt:** Lưu adjusters bằng API riêng, không đi chung payload config chính. Có thể lưu bất cứ lúc nào mà không cần lưu config.
6. **Typecheck:** Chạy `docker exec residential_frontend pnpm run typecheck` sau mọi thay đổi FE.
