# Phí nền tảng theo đơn hàng - Đặc tả nghiệp vụ Frontend

> Module: `PMC/ClosingPeriod` (hiển thị) + `Platform/Tenant` (cấu hình, đã có) | Ngày tạo: 2026-06-15 | Trạng thái: Draft | Phạm vi: **Giai đoạn 1**

## 1. Tổng quan

GĐ1 **không có trang mới**. Chỉ **bổ sung hiển thị** phí nền tảng (đã được BE tính & đóng băng tại kỳ chốt phí) vào màn hình **Chi tiết kỳ chốt phí** và bước **chọn đơn đưa vào kỳ**. Màn hình cấu hình phí (`TenantConfigTab`) đã có sẵn — **giữ nguyên**.

Mục tiêu người dùng:

- **Kế toán tenant**: thấy được mỗi đơn / mỗi kỳ phải trả platform bao nhiêu phí nền tảng → đối chiếu, biết chi phí.
- **Platform admin**: cấu hình mức phí (đã có); số liệu tổng hợp để thu là GĐ2.

## 2. Danh sách trang

| Trang | Route | Thay đổi |
|-------|-------|----------|
| Cấu hình tenant | `/platform/tenants/[id]` (tab Cấu hình) | **Không đổi** — `TenantConfigTab.vue` đã có |
| Danh sách kỳ chốt phí | `/pmc/finance/closing-periods` | (Tùy chọn) thêm cột "Phí nền tảng" tổng kỳ |
| **Chi tiết kỳ chốt phí** | `/pmc/finance/closing-periods/[id]` | **Trọng tâm** — thêm cột phí + tổng phí |

## 3. Trang Chi tiết kỳ chốt phí (trọng tâm)

`frontend/app/pages/pmc/finance/closing-periods/[id]/index.vue`

### 3.1 Bảng đơn hàng trong kỳ — thêm cột

| Cột | Dữ liệu | Ghi chú |
|-----|---------|---------|
| Giá trị đơn (đã có) | `frozen_receivable_amount` | Format tiền |
| Hoa hồng (đã có) | `frozen_commission_total` | Format tiền |
| **Phí nền tảng** (mới) | `platform_fee.amount` | Format tiền. = 0 → hiển thị "—" hoặc 0đ |

- Nếu `platform_fee.amount > 0`: hover/tooltip hiển thị công thức từ snapshot (`platform_fee.mode.label`, `fixed`, `percent`) — ví dụ "0,5% × giá trị đơn".
- `mode = none/subscription` → phí 0.

### 3.2 Khối tổng hợp kỳ

Bổ sung 1 chỉ số vào phần thống kê đầu trang:

| Chỉ số | Dữ liệu |
|--------|---------|
| Tổng phí nền tảng | `stats.total_platform_fee` |

### 3.3 Hành động (không đổi luồng, chỉ refetch)

| Hành động | Kết quả liên quan phí |
|-----------|----------------------|
| Thêm đơn vào kỳ | BE đóng băng phí ngay → refetch hiển thị cột phí |
| Bỏ đơn khỏi kỳ | Phí của đơn biến mất khỏi tổng |
| Đóng kỳ | Phí khoá cùng kỳ |
| Mở lại kỳ | BE **tính lại** phí theo cấu hình mới nhất → refetch hiển thị giá trị mới |

> Cảnh báo UX cho "Mở lại kỳ": giữ cảnh báo hiện có; có thể bổ sung ghi chú "Phí nền tảng & hoa hồng sẽ được tính lại theo cấu hình mới nhất."

## 4. Bước chọn đơn đưa vào kỳ (eligible orders)

Nguồn: `GET /pmc/closing-periods/[id]/eligible-orders`.

| Cột | Dữ liệu | Ghi chú |
|-----|---------|---------|
| Mã đơn | `code` | |
| Giá trị đơn | `total_amount` | |
| **Phí nền tảng dự kiến** (mới) | `estimated_platform_fee` | Tính từ cấu hình **hiện tại**; là số dự kiến, sẽ được chốt khi thêm vào kỳ |

> Nhãn rõ "dự kiến" để tránh hiểu nhầm là số đã chốt — số chốt chỉ có sau khi thêm vào kỳ.

## 5. Cập nhật type (composable)

`frontend/app/composables/api/useClosingPeriods.ts` — bổ sung field vào type dòng đơn & stats (khớp Resource BE). Orval regenerate types trước khi code (chạy trên host: `cd frontend && pnpm run api:generate`).

```ts
// dòng đơn trong kỳ
platform_fee: {
  amount: string
  mode: { value: string; label: string }
  fixed: string
  percent: string
}
// stats kỳ
total_platform_fee: string
// eligible order
estimated_platform_fee: string
```

## 6. Luồng người dùng

### 6.1 Xem phí trong kỳ

```
Chi tiết kỳ chốt phí → bảng đơn hiển thị cột "Phí nền tảng" + tổng phí kỳ
  → hover dòng phí > 0: xem công thức (mode / fixed / percent)
```

### 6.2 Thêm đơn & chốt phí

```
Chi tiết kỳ (đang mở) → "Thêm đơn" → danh sách đơn đủ điều kiện (kèm phí dự kiến)
  → chọn đơn → Xác nhận
  ✓ BE đóng băng phí → refetch → cột phí + tổng phí cập nhật
```

### 6.3 Mở lại kỳ → tính lại

```
Kỳ đã đóng → "Mở lại" (qua các bước cảnh báo hiện có)
  ✓ BE tính lại phí theo cấu hình mới nhất → refetch → giá trị phí có thể thay đổi
```

## 7. Phân quyền

Theo quyền hiện có của module Kỳ chốt phí (`PMC/ClosingPeriod`). Phí nền tảng chỉ là dữ liệu hiển thị kèm — **không thêm quyền mới** ở GĐ1.

## 8. Ghi chú nghiệp vụ

- Phí chỉ xuất hiện với đơn đã vào kỳ (Hoàn thành + Thu đủ). Đơn hủy/chưa thu đủ không có phí.
- `none` / `subscription` (gói tháng/năm) → phí per-order = 0; gói thoả thuận ngoài hệ thống.
- `both` = phí cố định + phí %.
- GĐ1 **chỉ hiển thị số liệu**; chưa có màn hình platform tự tổng hợp/thu tiền (GĐ2).
- Sau mọi thay đổi FE: chạy `pnpm run typecheck` + `pnpm run lint` (trong `residential_frontend`).
