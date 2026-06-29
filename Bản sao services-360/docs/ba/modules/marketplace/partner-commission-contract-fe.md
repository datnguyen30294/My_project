# Hợp đồng hoa hồng Vendor — Đặc tả nghiệp vụ Frontend

> Module: `Marketplace/PartnerCommissionContract` | Ngày tạo: 2026-05-26 | Trạng thái: Draft

## 1. Tổng quan

Tính năng quản lý hợp đồng hoa hồng giữa platform và vendor (Partner). Mỗi hợp đồng quy định cách platform thu hoa hồng từ vendor theo 1 trong 3 mode: chiết khấu mỗi đơn, chia doanh thu, hoặc thuê bao.

**Hai bên sử dụng — quyền đối xứng:**
- **Platform admin** (central): Full CRUD + sign + switch + revoke + cancel cho **tất cả tenant**.
- **Tenant manager** (PMC): Full CRUD + sign + switch + revoke + cancel cho **tenant của mình**.
- 2 bên có thể **override** quyết định của nhau trong cùng 1 contract (vd Platform revoke pending do Tenant tạo). UI hiển thị badge `Tạo bởi Platform` / `Tạo bởi Tenant` để dễ trace.

**Quy tắc bất biến:** Một khi hợp đồng đã ký (status pending trở lên), KHÔNG được sửa các thông số hoa hồng. Nếu cần đổi → huỷ hợp đồng cũ + tạo hợp đồng mới.

## 2. Danh sách trang

### 2.1 Platform side

| Trang | Route | Mô tả |
|-------|-------|-------|
| Danh sách hợp đồng | `/platform/partner-commission-contracts` | Xem tất cả hợp đồng (mọi vendor, mọi tenant), lọc theo trạng thái/mode/vendor |
| Tạo nháp | `/platform/partner-commission-contracts/create` | Form tạo draft (chọn vendor, project, mode, terms) |
| Chi tiết | `/platform/partner-commission-contracts/[id]` | Xem chi tiết, timeline transition, các action theo trạng thái |
| Sửa nháp | `/platform/partner-commission-contracts/[id]/edit` | Chỉ áp dụng khi status = draft |

### 2.2 Tenant side (PMC)

Mirror đầy đủ platform side, chỉ giới hạn scope `tenant_id = current`.

| Trang | Route | Mô tả |
|-------|-------|-------|
| Danh sách hợp đồng | `/pmc/partner-commission-contracts` | Xem hợp đồng của tenant hiện tại, lọc theo vendor/project/status/mode |
| Tạo nháp | `/pmc/partner-commission-contracts/create` | Form tạo draft (auto-set tenant_id = current) |
| Chi tiết | `/pmc/partner-commission-contracts/[id]` | Chi tiết + timeline + actions theo state |
| Sửa nháp | `/pmc/partner-commission-contracts/[id]/edit` | Chỉ khi status = draft |
| Danh sách vendor (đã có) | `/pmc/vendors` | Thêm cột "Hợp đồng hiện tại" |
| Chi tiết vendor (đã có) | `/pmc/vendors/[id]` | Thêm tab "Hợp đồng hoa hồng" (quick view, link sang trang chính) |

### 2.3 Sidebar — Marketplace group (tenant)

Update `app/composables/useNavigation.ts`:

```ts
{
  label: 'Marketplace',
  icon: 'storefront',
  children: [
    { label: 'Vendor của tôi', to: '/pmc/vendors' },
    { label: 'Hợp đồng hoa hồng', to: '/pmc/partner-commission-contracts' },  // ← THÊM
  ]
}
```

Chỉ hiển thị khi `is_vendor_enabled = true` (giữ logic conditional cũ).

### 2.4 Sidebar — Platform (đã có sẵn)

`PlatformSidebarContent.vue` đã có entry `/platform/partner-commission-contracts` với icon `handshake`. Không cần thay đổi.

## 3. Trang danh sách hợp đồng (Platform & Tenant — UI giống nhau)

> Trang list ở 2 side dùng **chung component**, khác biệt chỉ ở:
> - Tenant side: ẩn cột "Tenant" (vì luôn là tenant hiện tại), API tự filter
> - Tenant side: dropdown chọn vendor chỉ hiện vendor mà tenant đó được phép quản (`owner_tenant_id` hoặc partner_project)
> - Cả 2 side: hiển thị thêm cột/badge "Nguồn tạo" (`created_scope.label`)

### 3.1 Thông tin hiển thị trong bảng

| Cột | Dữ liệu | Ghi chú |
|-----|---------|---------|
| Mã hợp đồng | `contract_code` | Link sang trang chi tiết |
| Vendor | `partner.name` | + sub-label `partner.slug` |
| Tenant | `tenant_id` | Slug tenant |
| Project | `project_id` | Hiển thị tên project (fetch từ tenant DB qua service) |
| Loại | `commission_mode.label` | Badge xanh dương: "Chiết khấu mỗi đơn" / "Chia doanh thu" / "Thuê bao" |
| Nguồn tạo | `created_scope.label` | Badge nhỏ: "Platform" (tím) / "Tenant" (xanh) |
| Trạng thái | `status.label` | Badge có màu: draft=gray, pending=yellow, active=green, replaced/cancelled/expired/revoked=red/slate |
| Hiệu lực | `starts_at` → `ends_at` | Format `DD/MM/YYYY → DD/MM/YYYY`, "Không thời hạn" nếu null |
| Kích hoạt | `activated_at` | Format `DD/MM/YYYY HH:mm` |
| Hành động | — | Dropdown: Xem / Sửa (draft) / Ký (draft) / Thu hồi (pending) / Huỷ (active) |

### 3.2 Tìm kiếm & Lọc

| Bộ lọc | Loại | Mô tả |
|--------|------|-------|
| Tìm kiếm | Ô nhập text | Tìm theo `contract_code` |
| Vendor | Dropdown async | Lọc theo Partner (autocomplete) |
| Tenant | Dropdown | Lọc theo tenant |
| Project | Dropdown phụ thuộc Tenant | Hiển thị khi đã chọn tenant |
| Trạng thái | Multi-select | 7 trạng thái |
| Loại hợp đồng | Multi-select | 3 mode |
| Khoảng thời gian | Date range | Lọc theo `starts_at` |

### 3.3 Hành động

| Hành động | Điều kiện | Kết quả |
|-----------|-----------|---------|
| **Tạo nháp** | Luôn hiển thị | Chuyển sang form tạo nháp |
| **Xem chi tiết** | Click row hoặc mã hợp đồng | Chuyển sang trang chi tiết |
| **Sửa nháp** | `status = draft` | Chuyển sang form sửa |
| **Ký** | `status = draft` | Mở modal confirm (review terms) → POST `/sign` |
| **Thu hồi (revoke)** | `status = pending` | Mở modal yêu cầu lý do → POST `/revoke` |
| **Huỷ (cancel)** | `status = active` | Mở modal yêu cầu lý do + cảnh báo "Sẽ ngắt nhận đơn của vendor" → POST `/cancel` |
| **Xoá nháp** | `status = draft` | Confirm dialog → DELETE |

## 4. Form tạo nháp / chỉnh sửa nháp

### 4.1 Bước 1 — Thông tin cơ bản

| Trường | Bắt buộc | Loại input | Ghi chú |
|--------|----------|------------|---------|
| Vendor | Có | Dropdown async | Tìm theo tên/slug, lấy từ `/api/v1/platform/partners` |
| Tenant | Có | Dropdown | Danh sách tenants có `is_vendor_enabled = true` |
| Project | Có | Dropdown phụ thuộc Tenant | Lấy danh sách project trong tenant đã chọn (qua ExternalService) |
| Mã hợp đồng | Không | Text | Để trống → auto-gen `HD-2026-NNNN`. User override được. |
| Loại hợp đồng | Có | Radio card (3 lựa chọn) | per_order / revenue_share / subscription. Chọn → render form bước 2 |
| Ngày bắt đầu | Có | Date picker | >= hôm nay |
| Ngày kết thúc | Không | Date picker | > ngày bắt đầu. Trống = không thời hạn |
| Ghi chú | Không | Textarea | Tối đa 2000 ký tự |

### 4.2 Bước 2 — Điều khoản theo mode

#### 4.2.1 Mode `per_order` — Chiết khấu mỗi đơn

| Trường | Bắt buộc | Loại input | Ghi chú |
|--------|----------|------------|---------|
| % chiết khấu | Có (nếu không có tiền cứng) | Number (0–100) | Decimal 2 chữ số |
| Tiền cứng/đơn | Có (nếu không có %) | Currency (VND) | Decimal 2 chữ số |

Validation FE realtime:
- Ít nhất 1 trong 2 (%, tiền cứng) phải có giá trị

#### 4.2.2 Mode `revenue_share` — Chia doanh thu

| Trường | Bắt buộc | Loại input | Ghi chú |
|--------|----------|------------|---------|
| Chu kỳ chốt | Có | Radio | Hàng tháng / Hàng quý |
| Bậc thang doanh thu | Có | Table editable | Mỗi dòng: `min_gmv`, `max_gmv`, `percent` |

Table editor:
- Nút "Thêm bậc" (default 1 bậc 0 → ∞)
- Validation: tiers không overlap, sorted by `min_gmv` (FE tự sort khi lưu)
- Cột `max_gmv` để trống = không giới hạn trên (chỉ 1 bậc cuối được phép null)

#### 4.2.3 Mode `subscription` — Thuê bao

| Trường | Bắt buộc | Loại input | Ghi chú |
|--------|----------|------------|---------|
| Phí thuê bao | Có | Currency (VND) | |
| Chu kỳ | Có | Radio | Hàng tháng / Hàng quý / Hàng năm |

### 4.3 Hành động trên form

| Hành động | Điều kiện | Kết quả |
|-----------|-----------|---------|
| **Lưu nháp** | Validation pass | POST/PUT → giữ status `draft`, quay lại list hoặc trang chi tiết |
| **Lưu & Ký** | Validation pass | POST/PUT → sau đó POST `/sign` (modal confirm trước) |
| **Huỷ** | Luôn | Quay về danh sách, không lưu |

## 5. Form sửa hợp đồng pending (chỉ field non-financial)

Khi user vào trang chi tiết một hợp đồng `pending` và bấm "Sửa thông tin":

| Trường | Có thể sửa | Ghi chú |
|--------|------------|---------|
| Mã hợp đồng | ✅ | |
| Ghi chú | ✅ | |
| Vendor / Tenant / Project | ❌ | Disabled, hiển thị read-only |
| Loại hợp đồng | ❌ | Disabled |
| Điều khoản (terms) | ❌ | Disabled, hiển thị read-only |
| Ngày bắt đầu / kết thúc | ❌ | Disabled |

**Cảnh báo trên đầu form:** "Hợp đồng đã ký — chỉ sửa được mã hợp đồng và ghi chú. Để thay đổi điều khoản, vui lòng thu hồi hợp đồng này và tạo nháp mới."

## 6. Trang chi tiết hợp đồng

### 6.1 Header

| Thông tin | Hiển thị |
|-----------|----------|
| Mã hợp đồng | `HD-2026-0001` (heading lớn) |
| Trạng thái | Badge màu lớn |
| Hành động | Các nút theo state (xem bảng 3.3) |

### 6.2 Nhóm thông tin

**Vendor & Phạm vi**
- Vendor (tên + slug + logo)
- Tenant (slug + tên)
- Project (tên + ID)

**Loại & Điều khoản**
- Mode badge
- Bảng/card hiển thị `terms` formatted đẹp:
  - per_order: hiển thị `Chiết khấu: 10%` + `Tiền cứng: 50,000 ₫/đơn` + bảng chia tỉ lệ
  - revenue_share: bảng tiers
  - subscription: card `500,000 ₫ / tháng`

**Hiệu lực**
- Ngày bắt đầu, ngày kết thúc
- Ngày kích hoạt (nếu có)

**Timeline trạng thái** (vertical timeline)
- Tạo nháp lúc X bởi Y
- Ký lúc X bởi Y
- Kích hoạt lúc X (do switch từ tenant Z)
- Thay thế bởi `HD-2026-0002` lúc X *(nếu replaced)*
- Huỷ lúc X bởi Y — lý do: "..." *(nếu cancelled)*

**Ghi chú**
- Text content

### 6.3 Hành động theo trạng thái

| Trạng thái | Nút | Ai bấm |
|------------|-----|--------|
| draft | Sửa / Ký / Xoá nháp | Platform admin |
| pending | Sửa ghi chú / Thu hồi | Platform admin |
| pending | Switch (kích hoạt) | Tenant manager (chỉ ở tenant side) |
| active | Huỷ | Platform admin + Tenant manager |
| replaced/cancelled/expired/revoked | — (chỉ xem) | — |

## 7. Tích hợp Tenant side — Trang quản lý Vendor (quick view)

> Đây là **shortcut UI** cho từng vendor. Trang chính để CRUD vẫn là `/pmc/partner-commission-contracts`.

### 7.1 Bổ sung vào trang danh sách Vendor (`/pmc/vendors`)

Thêm cột:

| Cột | Dữ liệu |
|-----|---------|
| Hợp đồng hiện tại | Hiển thị `contract_code` của active contract đầu tiên (theo project mặc định) + badge mode |
| Hợp đồng pending | Badge số lượng `pending` chờ switch (vd: "2 hợp đồng chờ") |

Click vào → mở chi tiết vendor + auto-focus tab "Hợp đồng hoa hồng".

### 7.2 Tab "Hợp đồng hoa hồng" trong trang chi tiết Vendor

Layout: chọn project trước (dropdown), bên dưới hiển thị các hợp đồng cho cặp (vendor × project).

| Section | Nội dung |
|---------|----------|
| **Hợp đồng đang hiệu lực** | Card hiển thị hợp đồng active + nút "Huỷ" + link "Xem chi tiết" |
| **Hợp đồng chờ kích hoạt** | List các pending + nút "Switch" + nút "Sửa nháp" (nếu draft đính kèm) |
| **Lịch sử** | Danh sách terminal contracts (replaced/cancelled/expired/revoked), thu gọn |
| **Tạo nhanh** | Nút "Tạo hợp đồng mới" — link tới `/pmc/partner-commission-contracts/create?partner_id=X&project_id=Y` (pre-fill) |

**Trạng thái khi không có active:** Banner cảnh báo đỏ "Vendor không có hợp đồng đang hiệu lực — vendor không thể nhận đơn mới ở dự án này. Vui lòng kích hoạt một hợp đồng chờ hoặc tạo mới."

### 7.3 Hành động Switch (Tenant manager)

Flow:

```
Tab "Hợp đồng hoa hồng" → Card pending cụ thể → Nút "Kích hoạt"
  → Modal so sánh:
       Bên trái: Hợp đồng hiện tại (active) — terms tóm tắt
       Bên phải: Hợp đồng sẽ kích hoạt (pending) — terms tóm tắt
     + Cảnh báo: "Hợp đồng hiện tại sẽ chuyển sang 'Đã bị thay thế' và không thể tái sử dụng."
     + Input "Nhập 'XÁC NHẬN' để tiếp tục" (anti-misclick)
  → POST `/switch`
  ✓ Thành công: toast + refresh list
  ✗ Lỗi: toast error
```

Nếu không có active hiện tại → modal đơn giản hơn, chỉ confirm "Kích hoạt hợp đồng X?".

### 7.4 Hành động Cancel active (Tenant manager)

```
Card active → Nút "Huỷ hợp đồng"
  → Modal:
     + Cảnh báo đỏ: "Sau khi huỷ, vendor SẼ NGAY LẬP TỨC không nhận được đơn mới ở dự án này."
     + Textarea bắt buộc: Lý do huỷ
     + Subscription case: hiển thị thêm "Hợp đồng thuê bao — kỳ thanh toán hiện tại sẽ không được hoàn lại."
  → POST `/cancel`
```

## 8. Luồng người dùng

### 8.1 Tạo + ký + kích hoạt mới (happy path)

```
[Platform admin]
List → "Tạo nháp" → Form (chọn vendor, project, mode, terms) → Lưu nháp
  → status: draft
List → Chi tiết draft → "Ký" → Modal review → Xác nhận
  → status: pending

[Tenant manager]
Vendor detail → tab Hợp đồng → Chọn project → Card pending → "Kích hoạt"
  → Modal so sánh → Xác nhận
  → status: active
  → Đơn mới gắn vào contract này
```

### 8.2 Đổi mode (vendor đang active per_order, muốn chuyển sang subscription)

```
[Platform admin]
Tạo nháp subscription cho cùng (vendor × project) → Ký → status: pending
(Lúc này vendor có: 1 active per_order, 1 pending subscription)

[Tenant manager]
Tab Hợp đồng → Card pending subscription → "Kích hoạt" → Modal so sánh
  → Xác nhận
  → Active per_order: replaced
  → Pending subscription: active
  → Đơn cũ giữ per_order, đơn mới tính subscription
```

### 8.3 Sai sót — phát hiện sau khi ký

```
[Platform admin]
Chi tiết pending → "Thu hồi" → Nhập lý do → Xác nhận
  → status: revoked (terminal)
Tạo nháp mới → Ký lại → status: pending
```

### 8.4 Hết hạn

```
(Hợp đồng có ends_at = 2026-12-31)
Sau 2027-01-01, mọi lần đọc contract → status hiển thị "Đã hết hạn" (lazy)
Tenant side → Banner đỏ "Không có hợp đồng đang hiệu lực"
Vendor không nhận được đơn mới cho đến khi switch contract pending mới
```

### 8.5 Huỷ active

```
[Tenant manager / Platform admin]
Card active → "Huỷ" → Nhập lý do → Xác nhận
  → status: cancelled
  → Vendor ngừng nhận đơn ngay
  → Nếu là subscription: kỳ hiện tại mất tiền, không hoàn
```

## 9. Phân quyền

Permission name **đối xứng** giữa 2 side. Scope (all tenants vs own tenant) enforce ở BE service, không phải permission.

| Hành động | Quyền |
|-----------|-------|
| Xem | `marketplace.commission_contract.view` |
| Tạo / sửa nháp / xoá nháp | `marketplace.commission_contract.manage` |
| Ký (sign) | `marketplace.commission_contract.sign` |
| Thu hồi pending | `marketplace.commission_contract.revoke` |
| Switch (kích hoạt) | `marketplace.commission_contract.switch` |
| Huỷ active | `marketplace.commission_contract.cancel` |

## 10. Ghi chú nghiệp vụ

- **Quyền đối xứng**: Platform & Tenant có cùng quyền CRUD/sign/switch/revoke/cancel. Khác biệt duy nhất là scope view. UI 2 side gần như identical, dùng chung component.
- **Override lẫn nhau**: Trong cùng 1 contract, 2 bên có thể override nhau. Vd Platform tạo pending, Tenant không ưng → Tenant revoke được. Hiển thị badge nguồn tạo + log đầy đủ trong timeline.
- **Bất biến tài chính**: Đã ký rồi → không sửa terms. Sai → thu hồi + tạo lại. Đây là **feature**, không phải bug.
- **Multiple pending**: Platform có thể chuẩn bị nhiều phương án (vd 1 per_order, 1 subscription) để tenant chọn lúc switch. Pending KHÔNG ràng buộc lẫn nhau.
- **One active per scope**: Mỗi (vendor × tenant × project) chỉ có 1 hợp đồng `active` tại 1 thời điểm. DB enforce bằng partial unique index.
- **Lazy expiry**: Trạng thái `expired` không lưu sẵn — tính khi đọc. UI hiển thị consistent vì BE đã resolve qua `getCurrentStatus()`.
- **Khoảng trống**: Khi không có active, vendor mất quyền nhận đơn mới. Đơn cũ (đã có `partner_commission_contract_id`) vẫn xử lý bình thường theo contract của chính nó.
- **Snapshot per order**: Đơn lưu `partner_commission_contract_id` cố định lúc tạo. Đổi contract sau đó không ảnh hưởng đơn cũ → đảm bảo audit & đối soát chính xác lịch sử.
- **Subscription huỷ**: Mất tiền kỳ hiện tại (immediate cancellation), không pro-rate.
- **Replaced chain**: Mỗi terminal `replaced` lưu `replaced_by_contract_id` → UI hiển thị được lịch sử dây chuyền các hợp đồng đã thay thế nhau.

## 11. Component & composable tham khảo (kỹ thuật triển khai)

> Phần này định hướng đặt code, chi tiết để skill `frontend-development` xử lý.

**API composable mới**: `app/composables/api/usePartnerCommissionContracts.ts`
- `usePartnerCommissionContractList(params)` — GET list
- `usePartnerCommissionContractDetail(id)` — GET detail
- `apiCreatePartnerCommissionContract(data)`
- `apiUpdatePartnerCommissionContractDraft(id, data)`
- `apiUpdatePartnerCommissionContractNotes(id, data)`
- `apiSignPartnerCommissionContract(id)`
- `apiRevokePartnerCommissionContract(id, reason)`
- `apiSwitchPartnerCommissionContract(id)` (tenant side)
- `apiCancelPartnerCommissionContract(id, reason)`
- `apiDeletePartnerCommissionContractDraft(id)`
- Constants: `CONTRACT_STATUS_OPTIONS`, `COMMISSION_MODE_OPTIONS`, `SUBSCRIPTION_CYCLE_OPTIONS`, `BILLING_PERIOD_OPTIONS`

**Components mới** (đặt trong `app/components/partner-commission-contract/`):
- `ContractStatusBadge.vue` — badge tô màu theo status
- `ContractModeBadge.vue` — badge mode
- `ContractTermsViewer.vue` — render `terms` formatted theo mode
- `ContractTermsEditor.vue` — form nhập `terms` theo mode (dynamic)
- `ContractTimeline.vue` — vertical timeline transitions
- `ContractSwitchModal.vue` — modal so sánh contract cũ/mới khi switch
- `ContractSignModal.vue` — modal review trước khi ký
- `ContractCancelModal.vue` — modal nhập lý do huỷ
- `ContractRevokeModal.vue` — modal nhập lý do thu hồi

**Components reuse / cần check trước khi viết** (`shared/`):
- `SharedSectionCard` — đã có, dùng cho các nhóm thông tin chi tiết
- `UAlert` (Nuxt UI) — banner cảnh báo
- `UBadge` — status/mode badges
- `UModal` — các confirm modal
- `UForm` + `UFormField` — form layout
