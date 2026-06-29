# Đơn hàng Vendor & Hoa hồng PMC — Đặc tả nghiệp vụ Frontend

> Module: `Marketplace/VendorOrder` | Ngày tạo: 2026-05-27 | Trạng thái: Draft

## 1. Tổng quan

Trong trang chi tiết vendor (`/pmc/vendors/{partnerId}`), thêm tab **"Đơn hàng"** hiển thị:
- Danh sách đơn hàng đã hoàn thành của vendor (lấy từ DB resi_mart)
- Số tiền hoa hồng PMC được tính tự động cho từng đơn theo hợp đồng `per_order` đang áp dụng tại thời điểm đơn hoàn thành
- Tổng kết: số đơn / doanh thu / hoa hồng / TB hoa hồng
- Chi tiết từng đơn: sản phẩm, khách hàng, công thức tính hoa hồng

**Phạm vi phase 1**:
- Chỉ orders status `completed`
- Chỉ contract mode `per_order` (revenue_share / subscription sẽ có view tháng riêng ở phase 2)

## 2. Danh sách trang

Không có route riêng — tích hợp vào trang chi tiết vendor đã có:

| Trang | Route | Mô tả |
|-------|-------|-------|
| Chi tiết vendor (đã có) | `/pmc/vendors/[id]` | Thêm tab "Đơn hàng" |
| Tab Đơn hàng | `/pmc/vendors/[id]?tab=orders` | List orders + filter + summary |
| Drawer chi tiết đơn | (overlay trong tab) | Mở drawer khi click vào 1 đơn — không đổi route chính |

> Phương án Drawer được chọn (thay vì route riêng `/pmc/vendors/{id}/orders/{orderId}`) để giữ user trong context vendor + UX mượt khi xem nhiều đơn liên tiếp.

## 3. Tab "Đơn hàng" trong vendor detail

### 3.1 Cấu trúc

```
┌─ Tab: Đơn hàng ────────────────────────────────────────┐
│                                                        │
│  ┌─ Summary Card ──────────────────────────────────┐   │
│  │ Số đơn:    247    Doanh thu:    12.450.000 ₫   │   │
│  │ Hoa hồng: 1.245.000 ₫   TB/đơn:    5.040 ₫     │   │
│  │ [Warning banner nếu có đơn không có hợp đồng]   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                        │
│  ┌─ Filters ──────────────────────────────────────┐    │
│  │ [Date range: 27/04 - 27/05] [Project: ▼] [🔍] │    │
│  └────────────────────────────────────────────────┘    │
│                                                        │
│  ┌─ Order Table ──────────────────────────────────┐    │
│  │ Mã đơn │ Khách │ Dự án │ SP │ Tổng │ HH PMC │  │    │
│  │ ───────────────────────────────────────────── │    │
│  │ ORD-...│ NVA   │ Khu A │ 3  │ 830K │  128K  │    │
│  │ ...                                            │    │
│  └────────────────────────────────────────────────┘    │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### 3.2 Summary Card (KPI 4 ô)

| KPI | Hiển thị | Ghi chú |
|-----|---------|--------|
| Số đơn thành công | `orders_count` | Trong khoảng filter |
| Tổng doanh thu vendor | `revenue_total` | Format VND, dùng tổng `orders.total` |
| Tổng hoa hồng PMC | `commission_total` | Format VND |
| Trung bình hoa hồng/đơn | `average_commission_per_order` | Format VND |

### 3.3 Warning Banner (conditional)

Hiển thị **phía dưới Summary Card** khi có warning:

| Điều kiện | Banner |
|-----------|--------|
| `warnings.schema_missing = true` | (Đỏ) "Vendor chưa active trên hệ thống marketplace" |
| `warnings.orphan_orders_count > 0` | (Vàng) "Có X đơn hoàn thành không có hợp đồng hoa hồng áp dụng. Vui lòng kiểm tra hợp đồng." |
| `warnings.non_per_order_orders_count > 0` | (Xám) "X đơn thuộc dự án dùng hợp đồng chia doanh thu / thuê bao — xem ở mục thống kê theo tháng (sắp ra mắt)" |

### 3.4 Filters

| Bộ lọc | Loại | Mặc định | Ghi chú |
|--------|------|----------|---------|
| Khoảng thời gian | Date range picker | 30 ngày gần nhất | Filter theo `completed_at`. Max range 90 ngày |
| Dự án | Dropdown | Tất cả | Lấy danh sách projects của tenant |
| Tìm kiếm | Text input | — | Tìm theo mã đơn |

Status filter **ẨN** vì phase 1 chỉ hiển thị `completed`.

### 3.5 Bảng đơn hàng — cột

| Cột | Dữ liệu | Ghi chú |
|-----|---------|---------|
| Mã đơn | `code` | Link mở drawer chi tiết |
| Khách hàng | `customer.name` + `customer.phone` | Stacked text |
| Dự án | `project_name` | Hiển thị "Dự án #X (đã xoá)" nếu orphan |
| Sản phẩm | `first_item_name` + `(+N sp khác)` | Nếu `items_count > 1` |
| Tổng tiền | `total` | Format VND |
| Trạng thái | `status.label` | Badge xanh (completed) |
| Hoa hồng PMC | `commission.amount` | Format VND, tooltip mở khi hover hiển thị công thức tóm tắt |
| Hoàn thành lúc | `completed_at` | Format `DD/MM/YYYY HH:mm` |

Sort mặc định: `completed_at DESC`.

### 3.6 Hành động

| Hành động | Cách kích hoạt | Kết quả |
|-----------|----------------|---------|
| Mở chi tiết | Click vào row hoặc mã đơn | Mở drawer chi tiết |
| Đổi trang | Pagination control | Refetch list |
| Đổi filter | Date range / project / search | Refetch list + summary |
| Đóng drawer | ESC hoặc click overlay | Đóng drawer, giữ scroll position của list |

## 4. Drawer chi tiết đơn hàng

### 4.1 Header

```
┌────────────────────────────────────────────┐
│ ORD-2026-0123  [Hoàn thành] [Đã thanh toán]│
│ Tổng: 830.000 ₫           [X đóng]         │
└────────────────────────────────────────────┘
```

### 4.2 Sections

**Section 1: Khách hàng & Giao hàng**

| Trường | Hiển thị |
|--------|----------|
| Họ tên | `customer.name` |
| SĐT | `customer.phone` |
| Email | `customer.email` |
| Mã căn hộ | `contact.apartment_code` |
| Địa chỉ giao | `contact.shipping_address` |

**Section 2: Sản phẩm** (table)

| Cột | Dữ liệu |
|-----|---------|
| Ảnh | `cover_url` (40x40 thumbnail) |
| Tên SP | `product_name` + `variant_name` (subtext) + `sku` (subtext mono) |
| SL | `quantity` |
| Đơn giá | `unit_price` |
| Giảm | `discount_amount` (nếu > 0) |
| Thành tiền | `subtotal` |

**Section 3: Tổng kết tiền**

| Dòng | Giá trị |
|------|---------|
| Tạm tính | `amounts.subtotal` |
| Phí ship | `amounts.shipping_fee` |
| Đặt cọc | `amounts.deposit_total` (nếu > 0) |
| Giảm giá | `-amounts.discount_total` |
| **TỔNG** | `amounts.total` (bold lớn) |

Nếu `amounts.total_overridden = true` → hiển thị badge "Giá đã điều chỉnh tay" cạnh tổng.

**Section 4: Hoa hồng PMC**

```
┌─ Hoa hồng PMC ──────────────────────────────────┐
│ Hợp đồng: HD-2026-0001 (Chiết khấu mỗi đơn)     │
│   [→ Xem chi tiết hợp đồng]                     │
│ Áp dụng lúc: 21/05/2026 16:00                   │
│                                                 │
│ Công thức:                                      │
│   Tiền cứng: 50.000 ₫                           │
│   Còn lại: 830.000 - 50.000 = 780.000 ₫         │
│   Phần trăm: 780.000 × 10% = 78.000 ₫           │
│   ─────────────────────                         │
│   TỔNG HOA HỒNG: 128.000 ₫                      │
└─────────────────────────────────────────────────┘
```

Nếu `commission.formula.capped_at_total = true`:
```
│ Tiền cứng (50.000) >= Tổng đơn (30.000)         │
│ → Hoa hồng = TỔNG ĐƠN = 30.000 ₫                │
```

**Section 5: Lịch sử trạng thái** (compact timeline)

| Mốc | Thời gian | Hiển thị nếu |
|-----|-----------|--------------|
| Đặt đơn | `ordered_at` | luôn |
| Xác nhận | `confirmed_at` | có giá trị |
| Hoàn thành | `completed_at` | luôn (đã filter) |
| Huỷ | `cancelled_at` | có giá trị (không xảy ra ở phase 1 vì đã filter) |

### 4.3 Hành động trong drawer

| Hành động | Kết quả |
|-----------|---------|
| Click "Xem chi tiết hợp đồng" | Chuyển sang `/pmc/partner-commission-contracts/{contract_id}` (mở tab mới) |
| Đóng (ESC / X / click overlay) | Đóng drawer |

## 5. Luồng người dùng

### 5.1 Xem danh sách đơn

```
PMC sidebar → "Vendor của tôi" → chọn vendor
  → Tab "Đơn hàng" (URL: ?tab=orders)
  → Mặc định 30 ngày gần nhất
  → Hiển thị Summary + Bảng đơn
  → Warning banner nếu có
```

### 5.2 Lọc theo dự án

```
Tab Đơn hàng → Filter "Dự án" → chọn 1 project
  → List + Summary cùng refetch
  → URL update ?project_id=X (giữ state khi reload)
```

### 5.3 Xem chi tiết 1 đơn

```
Bảng → click row "ORD-2026-0123"
  → Drawer slide-in từ phải
  → Hiển thị đầy đủ 5 sections
  → ESC để đóng
  → Quay lại list không reload
```

### 5.4 Truy ngược về hợp đồng áp dụng

```
Drawer chi tiết → Section "Hoa hồng PMC"
  → click "Xem chi tiết hợp đồng"
  → Mở tab mới `/pmc/partner-commission-contracts/{id}`
  → Xem terms gốc + lịch sử
```

### 5.5 Xử lý orphan orders (đơn không có hợp đồng)

```
Tab Đơn hàng → Warning banner "Có 3 đơn không có hợp đồng áp dụng"
  → User cần kiểm tra:
    1. Vendor có hợp đồng `per_order` active đúng kỳ chưa?
    2. Hợp đồng có cover đúng project_id không?
  → Click "Đi tới Hợp đồng" → chuyển sang tab Hợp đồng hoa hồng để xử lý
```

## 6. Edge cases UI

| Tình huống | Cách hiển thị |
|------------|---------------|
| Loading list | Skeleton 5 rows + skeleton summary card |
| Empty (filter trả về 0 đơn) | Empty state: "Chưa có đơn hàng nào trong khoảng thời gian này" + nút "Mở rộng khoảng thời gian" |
| Schema missing (vendor chưa active) | Banner đỏ chiếm toàn bộ tab: "Vendor chưa được kích hoạt trên hệ thống marketplace. Liên hệ admin để provision" |
| Vendor chưa có `tenant_id` | Tương tự schema missing |
| Date range > 90 ngày | Backend clamp về 90 ngày + FE hiển thị toast info "Đã giới hạn về 90 ngày" |
| Network error | Banner error trên đỉnh tab + nút Retry |
| Drawer mở đúng lúc data đang load | Drawer hiện skeleton inside |
| Project_id orphan trong row | Cột "Dự án": "Dự án #5 (đã xoá)" màu xám, không clickable |
| Order có `total = 0` | Hiển thị bình thường, commission = 0 |
| Commission `capped_at_total = true` | Drawer section 4 hiển thị note "Tiền cứng vượt tổng đơn — lấy trọn đơn" |

## 7. Phân quyền

| Hành động | Quyền cần có |
|-----------|--------------|
| Xem tab Đơn hàng | `marketplace.vendor_order.view` |
| Mở drawer chi tiết | `marketplace.vendor_order.view` |
| Xem chi tiết hợp đồng | `marketplace.commission_contract.view` |

Tab "Đơn hàng" chỉ hiển thị khi:
- Tenant có `is_vendor_enabled = true`
- User có quyền `marketplace.vendor_order.view`

## 8. Component & composable tham khảo (kỹ thuật triển khai)

> Phần này định hướng đặt code — chi tiết kỹ thuật để skill `frontend-development` xử lý.

**API composable mới**: `app/composables/api/useVendorOrders.ts`
- `useVendorOrderList(partnerId, params)` — GET list (auto-watch params)
- `useVendorOrderDetail(partnerId, id)` — GET detail (immediate: false, trigger khi mở drawer)
- `useVendorOrderSummary(partnerId, range)` — GET summary
- Types: `VendorOrderListItem`, `VendorOrderDetail`, `VendorOrderCommission`, `VendorOrderCommissionFormula`, `VendorOrderItem`, `VendorOrderSummary`, `VendorOrderWarnings`
- Constants: `VENDOR_ORDER_STATUS_OPTIONS`, `VENDOR_ORDER_PAYMENT_STATUS_OPTIONS`

**Components mới** (`app/components/vendor-order/`):
- `VendorOrderSummaryCard.vue` — 4 KPI cards + warning banners
- `VendorOrderFilters.vue` — date range + project select + search
- `VendorOrderTable.vue` — table với 8 cột
- `VendorOrderDetailDrawer.vue` — slide-in drawer chứa 5 sections
- `VendorOrderItemsTable.vue` — bảng items trong drawer
- `VendorOrderCommissionBreakdown.vue` — section hoa hồng với công thức
- `VendorOrderTimeline.vue` — timeline trạng thái compact

**Components reuse**:
- `SharedSectionCard`, `SharedFieldDisplay`, `SharedCrudTablePagination`
- `UAlert`, `UBadge`, `UTable`, `UDrawer` (Nuxt UI v4)
- Date range picker hiện có

**Tích hợp vendor detail page**:
- File: `app/pages/pmc/vendors/[id]/index.vue`
- Thêm vào `tabItems`: `{ value: 'orders', label: 'Đơn hàng', icon: 'i-lucide-shopping-bag' }`
- Conditional render `<VendorOrderTab :partner-id="partner.id" />` khi `tab === 'orders'`

## 9. Ghi chú nghiệp vụ

- **Read-only**: Toàn bộ tab này chỉ đọc. Không có thao tác sửa/huỷ đơn từ PMC (đơn được quản lý phía resi_mart).
- **Bất biến commission**: Số hoa hồng tính ra dựa vào contract active **tại thời điểm `completed_at`**. Sau này đổi contract không ảnh hưởng đơn cũ (do contract immutable).
- **Phase 1 scope**: Chỉ đơn `completed` + contract `per_order`. Mode khác sẽ có "Báo cáo hoa hồng vendor theo tháng" riêng ở phase 2.
- **Warning là feedback**: Banner cảnh báo orphan orders KHÔNG block hành động — user vẫn thấy danh sách bình thường, nhưng được nhắc kiểm tra cấu hình.
- **Cross-tab navigation**: User có thể switch nhanh giữa tab "Hợp đồng hoa hồng" ↔ "Đơn hàng" để đối chiếu cấu hình ↔ kết quả thực tế.
- **Performance**: Date range default 30 ngày + max 90 ngày để đảm bảo response time hợp lý khi cross-DB. Pagination `per_page=20` mặc định, max 50.
- **Audit**: Mỗi commission breakdown trong drawer là bằng chứng tính toán — có thể copy/screenshot dùng cho đối soát với vendor.
