# Treasury - Đặc tả nghiệp vụ Frontend

> Module: `PMC/Treasury` | Ngày tạo: 2026-04-10 | Trạng thái: Draft

## 1. Tổng quan

Màn hình **Quản lý quỹ** cho phép kế toán theo dõi dòng tiền của tenant:
- Xem số dư hiện tại của quỹ chính
- Xem KPI tổng thu/chi/ròng trong khoảng thời gian
- Xem lịch sử giao dịch với filter linh hoạt
- Nạp/rút tiền thủ công (với cảnh báo balance âm)
- Xoá mềm giao dịch thủ công (với yêu cầu ghi lý do)
- Xem lịch sử chỉnh sửa (audit log) của mỗi giao dịch
- Điều hướng sang đối soát / snapshot hoa hồng nguồn gốc

**Điểm khác biệt so với các màn tài chính hiện có**:
- Treasury là **view tổng hợp cuối cùng** — tiền đã qua đối soát và đã được chi trả.
- Các giao dịch auto (thu công nợ, hoàn tiền khách, chi hoa hồng) **không thể sửa/xóa** ở Treasury — muốn rollback phải thao tác ở source (đối soát / snapshot).

## 2. Danh sách trang

| Trang | Route | Mô tả |
|-------|-------|-------|
| Quản lý quỹ | `/pmc/finance/treasury` | Màn chính duy nhất — tất cả tính năng trên 1 trang với modals |

**Ghi chú**: Phase 1 không có trang chi tiết riêng, chi tiết giao dịch hiển thị qua modal. Phase 2 có thể tách route `/pmc/finance/treasury/transactions/[id]`.

## 3. Trang chính `/pmc/finance/treasury`

### 3.1 Layout tổng thể

```
┌──────────────────────────────────────────────────────────────────┐
│ Header: "Quản lý quỹ"                                             │
├──────────────────────────────────────────────────────────────────┤
│ [Card thông tin quỹ chính]                                        │
│   Tên: Quỹ chính                       Loại: Tiền mặt              │
│   Số dư đầu kỳ: 0 đ                                                │
│   ╔════════════════════════╗                                       │
│   ║ SỐ DƯ HIỆN TẠI         ║                                       │
│   ║ 15,000,000 đ           ║ ← highlight lớn, màu primary           │
│   ╚════════════════════════╝                                       │
├──────────────────────────────────────────────────────────────────┤
│ [Filter khoảng thời gian]  Từ: [____]  Đến: [____]                │
├──────────────────────────────────────────────────────────────────┤
│ [4 KPI cards]                                                     │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐      │
│ │ Tổng thu   │ │ Tổng chi   │ │ Ròng       │ │ Giao dịch │      │
│ │ +25,000k đ │ │ -10,000k đ │ │ +15,000k đ │ │    42     │      │
│ └────────────┘ └────────────┘ └────────────┘ └────────────┘      │
├──────────────────────────────────────────────────────────────────┤
│ [Biểu đồ cột Inflow vs Outflow theo ngày/tuần/tháng]              │
├──────────────────────────────────────────────────────────────────┤
│                       [+ Nạp tiền]  [- Rút tiền]                  │
├──────────────────────────────────────────────────────────────────┤
│ [Filter bảng giao dịch]                                            │
│  Hướng: [Tất cả ▾]  Danh mục: [Tất cả ▾]  Đơn hàng: [____]       │
│  Hiện đã xoá: ○Ẩn  ○Manual  ○Auto  ○Tất cả                        │
├──────────────────────────────────────────────────────────────────┤
│ [Bảng giao dịch]                                                  │
│ Mã | Ngày | Loại | Danh mục | Số tiền | Nguồn | Ghi chú | Actions │
│ ...                                                               │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 Card thông tin quỹ chính

| Trường | Dữ liệu | Ghi chú |
|---|---|---|
| Tên quỹ | `cashAccount.name` | |
| Loại | `cashAccount.type.label` | Badge |
| Số dư đầu kỳ | `cashAccount.opening_balance` | Format tiền VN |
| Số dư hiện tại | `cashAccount.current_balance` | Font lớn, highlight primary; nếu âm thì màu error |
| Thông tin ngân hàng | `bank.name, bank_account_number, bank_account_name` | Chỉ hiển thị nếu type=Bank |

### 3.3 Filter khoảng thời gian

- Default: 30 ngày gần nhất
- Có preset nhanh: "Hôm nay", "7 ngày", "30 ngày", "Tháng này", "Tháng trước", "Tuỳ chỉnh"
- Thay đổi date range → refetch KPI + chart + bảng

### 3.4 KPI cards (4 cards)

| KPI | Dữ liệu | Màu |
|---|---|---|
| Tổng thu | `summary.total_inflow` | Success (xanh lá) |
| Tổng chi | `summary.total_outflow` | Warning (cam) |
| Dòng tiền ròng | `summary.net_flow` | Primary nếu ≥ 0, Error nếu < 0 |
| Số giao dịch | `summary.transaction_count` | Neutral |

### 3.5 Biểu đồ cột Inflow vs Outflow

- Trục X: ngày / tuần / tháng (toggle theo khoảng thời gian)
- Trục Y: số tiền (VND)
- 2 màu: Inflow (xanh), Outflow (cam)
- Tooltip hiển thị chi tiết từng ngày
- Empty state: "Không có giao dịch trong khoảng thời gian này"

### 3.6 Bảng giao dịch

#### Cột hiển thị

| Cột | Dữ liệu | Ghi chú |
|---|---|---|
| Mã | `code` | Font mono, clickable mở modal chi tiết |
| Ngày | `transaction_date` | Format DD/MM/YYYY |
| Loại | `direction.label` | Badge màu (Inflow=xanh, Outflow=cam) |
| Danh mục | `category.label` | Badge màu nhạt |
| Số tiền | `amount` | Format tiền VN, màu theo direction, có dấu +/- |
| Nguồn | `source.type` + `source.order_code` | "Đối soát #X → DH-Y" (clickable link) / "Snapshot #Y → DH-Z" / "Thủ công" |
| Ghi chú | `note` | Truncate 50 ký tự |
| Thao tác | — | Nút "Xoá" (chỉ hiện với manual, disabled với auto + tooltip) |

#### Hiển thị giao dịch đã xoá

- Row bị gạch ngang (`line-through`), màu xám
- Hiển thị thêm badge "Đã xoá" + icon tooltip lý do

#### Hành vi bảng

| Hành vi | Kết quả |
|---|---|
| Click row | Mở modal chi tiết giao dịch |
| Click link "Đối soát #X" | Navigate `/pmc/finance/reconciliation/X` |
| Click link "Snapshot #Y" | Navigate `/pmc/finance/commission-summary?highlight=Y` |
| Click link "DH-Y" | Navigate `/pmc/orders/Y` |
| Click nút Xoá (manual) | Mở modal xác nhận xoá |
| Hover nút Xoá (auto) | Tooltip: "Giao dịch tự động. Thao tác ở đối soát / snapshot hoa hồng." |

### 3.7 Bộ lọc bảng

| Bộ lọc | Loại | Mô tả |
|---|---|---|
| Khoảng ngày | DateRange | Chia sẻ với KPI (filter toàn màn) |
| Hướng | Dropdown | Tất cả / Tiền vào / Tiền ra |
| Danh mục | Dropdown | 5 giá trị enum CashTransactionCategory |
| Mã đơn hàng | Text | Search theo `order.code` |
| Hiện đã xoá | Radio | Ẩn (default) / Chỉ xoá thủ công / Chỉ xoá tự động / Tất cả |

### 3.8 Action buttons (nút chính)

| Hành động | Điều kiện | Kết quả |
|---|---|---|
| Nạp tiền vào quỹ | Luôn hiển thị | Mở modal Manual Topup |
| Rút tiền khỏi quỹ | Luôn hiển thị | Mở modal Manual Withdraw |

## 4. Modals

### 4.1 Modal "Nạp tiền vào quỹ"

#### Các trường nhập liệu

| Trường | Bắt buộc | Loại input | Ghi chú |
|---|---|---|---|
| Tài khoản quỹ | — | Fixed | Phase 1 hiển thị "Quỹ chính" readonly |
| Số tiền | Có | Number (tiền) | Min 1 |
| Ngày giao dịch | Có | Date | Default hôm nay, không được tương lai |
| Ghi chú | Không | Textarea | Max 1000 ký tự |

#### Hành động

| Hành động | Kết quả |
|---|---|
| Xác nhận nạp | Gửi request, đóng modal, toast "Đã nạp X đ vào quỹ", refresh KPI + bảng |
| Huỷ | Đóng modal, không lưu |

### 4.2 Modal "Rút tiền khỏi quỹ"

Giống Modal Nạp tiền **cộng thêm**:

- Hiển thị **số dư hiện tại** trong modal (fetch từ KPI)
- Khi user nhập amount, compute live **"số dư sau khi rút"**
- Nếu `balance - amount < 0`: hiển thị cảnh báo đỏ:
  ```
  ⚠️ Số dư sẽ chuyển âm: -X,XXX,XXX đ
  ```
- Vẫn cho submit (không block), nhưng button đổi màu warning + label "Xác nhận rút (balance âm)"

### 4.3 Modal "Xoá giao dịch"

#### Hiển thị

- Thông tin giao dịch (mã, loại, số tiền, ngày, ghi chú)
- Số dư hiện tại
- **Số dư sau khi xoá** (computed):
  - Nếu tx là Inflow: `balance - amount`
  - Nếu tx là Outflow: `balance + amount`
- Nếu số dư sau xoá < 0: cảnh báo đỏ giống Modal Rút tiền

#### Form

| Trường | Bắt buộc | Loại input | Ghi chú |
|---|---|---|---|
| Lý do xoá | Có | Textarea | Min 5 ký tự, max 500 ký tự |

#### Hành động

| Hành động | Kết quả |
|---|---|
| Xác nhận xoá | Gửi request, đóng modal, toast "Đã xoá giao dịch", refresh KPI + bảng |
| Huỷ | Đóng modal |

#### Validation

- Client-side: reason min 5 ký tự trước khi cho submit
- Server-side: trả 422 nếu không hợp lệ

### 4.4 Modal "Chi tiết giao dịch"

#### Hiển thị

**Tab 1: Thông tin giao dịch**
- Mã, Ngày, Loại, Danh mục, Số tiền, Tài khoản quỹ
- Người tạo, Ngày tạo
- Ghi chú

**Nguồn gốc** (nếu có):
- **ReceivableCollection/CustomerRefund**: hiển thị box "Đối soát" với:
  - Đối soát #ID, trạng thái, ngày đối soát, người đối soát
  - Phiếu thu #ID, loại, số tiền, ngày trả
  - Đơn hàng liên quan (link)
- **CommissionPayout**: hiển thị box "Hoa hồng" với:
  - Snapshot #ID, người nhận, loại người nhận (VH/BQT/BQL/Department/Staff/Platform)
  - Đơn hàng liên quan (link)
  - Ngày thanh toán

**Nếu đã xoá**: hiển thị section "Thông tin xoá":
- Người xoá, ngày xoá
- Lý do xoá
- Loại xoá: thủ công / tự động (+ lý do tự động nếu có)

**Tab 2: Lịch sử thay đổi** (audit log từ `owen-it/auditing`)
- List timeline: mỗi entry là 1 event
  - Event: Tạo mới / Cập nhật / Xoá
  - Thời gian
  - Người thực hiện
  - Các trường thay đổi: old value → new value
- Rỗng nếu không có lịch sử (chỉ 1 event tạo)

#### Hành động

| Hành động | Kết quả |
|---|---|
| Đóng | Đóng modal |
| Đi tới nguồn (reconciliation / snapshot / order) | Navigate |
| Xoá (chỉ manual, chưa xoá) | Mở modal Xoá |

## 5. Luồng người dùng

### 5.1 Nạp tiền thủ công

```
/pmc/finance/treasury → [+ Nạp tiền]
  → Modal: nhập amount, date, note
  → [Xác nhận nạp]
  ✓ Toast thành công + refresh KPI + bảng → giao dịch mới xuất hiện trên cùng
  ✗ Toast lỗi + giữ nguyên modal
```

### 5.2 Rút tiền thủ công (balance âm)

```
/pmc/finance/treasury → [- Rút tiền]
  → Modal: nhập amount 20tr (balance hiện tại 15tr)
  → Live compute: "Số dư sau rút: -5,000,000 đ" (cảnh báo đỏ)
  → Button đổi "Xác nhận rút (balance âm)"
  → Confirm
  ✓ Toast thành công + refresh → KPI hiển thị balance -5tr (màu error)
```

### 5.3 Xem chi tiết + điều hướng đến đối soát

```
Bảng giao dịch → Click row "PT-2026-0023"
  → Modal chi tiết mở
  → Tab "Thông tin": hiển thị đầy đủ + box "Đối soát #142"
  → Click link "Đối soát #142"
  → Navigate /pmc/finance/reconciliation/142
```

### 5.4 Xoá giao dịch thủ công

```
Bảng giao dịch → Row ManualTopup "PT-2026-0020"
  → Click nút "Xoá"
  → Modal: hiển thị tx info + "Số dư sau xoá: 10,000,000 đ"
  → Nhập reason "Nhập nhầm từ tài khoản cá nhân"
  → [Xác nhận xoá]
  ✓ Toast "Đã xoá giao dịch"
  ✓ Bảng refresh: row biến mất (hoặc hiển thị gạch ngang nếu filter "Hiện đã xoá")
  ✓ KPI refresh
```

### 5.5 Cố gắng xoá giao dịch auto (bị chặn)

```
Bảng giao dịch → Row ReceivableCollection "PT-2026-0023"
  → Hover nút "Xoá" → Tooltip: "Giao dịch tự động. Thao tác ở đối soát / snapshot hoa hồng."
  → Nút disabled, không click được
```

### 5.6 Xem lịch sử thay đổi của 1 giao dịch (audit)

```
Bảng giao dịch → Click row
  → Modal chi tiết → Tab "Lịch sử thay đổi"
  → Timeline hiển thị:
    • 10/04/2026 14:30 - Tạo mới bởi Nguyễn Văn Kế (event=created)
    • 11/04/2026 09:15 - Xoá bởi Trần Thị Hoa (event=deleted, reason="Nhập sai")
```

### 5.7 Flow auto-delete khi kế toán sửa PaymentReceipt

```
Màn Receivable: Kế toán sửa PaymentReceipt 5tr → 3tr
  → BE: resetForPaymentReceipt() → Reconciliation về Pending
  → Event dispatched → Listener auto soft delete CashTransaction cũ
  
Màn Treasury (sau đó):
  → User refresh → giao dịch cũ biến mất khỏi bảng (đã soft deleted)
  → Balance tự động cân lại
  → Filter "Hiện đã xoá" → Auto: thấy giao dịch cũ với badge "Đã xoá tự động" + lý do "Đối soát bị reset..."
```

## 6. Phân quyền

Phase 1 không có phân quyền chi tiết. Mọi user có quyền access PMC đều có thể:
- Xem danh sách giao dịch
- Xem chi tiết + audit log
- Nạp tiền / rút tiền thủ công
- Xoá giao dịch thủ công

Phase 2 sẽ bổ sung permission key:
| Hành động | Quyền cần có |
|---|---|
| Xem danh sách | `treasury.view` |
| Nạp tiền thủ công | `treasury.topup` |
| Rút tiền thủ công | `treasury.withdraw` |
| Xoá giao dịch thủ công | `treasury.delete` |
| Xem audit history | `treasury.view_audit` |

## 7. Cập nhật các trang hiện có

### 7.1 `/pmc/finance/reconciliation/index.vue`

Thêm cột **"Giao dịch quỹ"** vào bảng reconciliation:
- Nếu reconciliation có cash transaction active → hiển thị badge link "PT-2026-0023" (click → mở modal chi tiết cash tx)
- Nếu không có → hiển thị dấu gạch "—"
- Nếu reconciliation là Rejected → N/A

### 7.2 `/pmc/finance/commission-summary/index.vue`

Thêm cột/badge **"Đã vào quỹ"** cho từng snapshot:
- Snapshot có cash tx active → icon ✓ xanh + tooltip "Đã chi ra quỹ: PC-2026-0042"
- Snapshot Paid mà không có active tx (trường hợp bị soft delete) → icon ⚠ vàng + tooltip "Giao dịch quỹ đã bị huỷ"
- Snapshot Unpaid → dấu gạch "—"

## 8. Ghi chú nghiệp vụ

### 8.1 Số dư quỹ có thể âm

- Phase 1 cho phép balance âm khi rút tiền. Không có chặn hard.
- Kế toán phải tự quản lý — có cảnh báo UI nhưng không block.
- Phase 2 có thể bổ sung notification nếu balance < threshold.

### 8.2 Giao dịch tự động không thể sửa/xóa trực tiếp

- `ReceivableCollection`, `CustomerRefund`: muốn huỷ phải vào đối soát → reset (hệ thống tự soft delete)
- `CommissionPayout`: muốn huỷ phải vào tổng hợp hoa hồng → chuyển về Unpaid (hệ thống tự soft delete)
- **Không có** chức năng "unrestore" / "rollback" từ Treasury UI

### 8.3 Audit log là nguồn sự thật

Mọi thay đổi trên CashTransaction (create, update, delete) đều được log vào bảng `audits` bởi lib `owen-it/laravel-auditing`. Modal chi tiết sẽ fetch lịch sử này để hiển thị.

### 8.4 Không có chức năng Restore

Giao dịch đã soft delete (manual hoặc auto) không thể phục hồi. Nếu cần "khôi phục":
- Giao dịch manual bị xoá nhầm → tạo mới bằng form Nạp/Rút
- Giao dịch auto bị xoá do reset → chỉ cần đối soát lại / mark paid lại ở source, hệ thống tự tạo tx mới

### 8.5 Idempotent từ góc nhìn user

User không cần lo về duplicate. Khi đối soát 1 reconciliation 2 lần (sau khi reset), hệ thống chỉ tạo 1 active tx tại 1 thời điểm. Các tx cũ bị soft delete và còn trong audit log.

### 8.6 Code format phiếu

- `PT-YYYY-NNNN`: Phiếu thu (Inflow)
- `PC-YYYY-NNNN`: Phiếu chi (Outflow)
- Counter tăng dần trong năm, reset mỗi năm (PT-2025-0999 → PT-2026-0001)
- Format này dễ trace và match với thói quen kế toán Việt Nam

## 9. Out of scope (Phase 2)

- **Hoàn ứng vật tư**: Sub-submodule riêng cho tiền ứng vật tư nhân viên đã bỏ ra → phải hoàn lại
- **Multi CashAccount UI**: Tạo/sửa/xoá tài khoản quỹ, transfer giữa các quỹ
- **Báo cáo chuyên sâu**: P&L, Cash flow statement chuẩn VAS, sổ quỹ theo ngày
- **Export**: PDF, Excel từng giao dịch hoặc theo kỳ
- **Phân quyền chi tiết**: Các permission key treasury.*
- **So sánh kỳ**: Dashboard so sánh tháng này vs tháng trước, YoY
- **Budget/Forecast**: Dự báo cash flow dựa trên công nợ sắp đến hạn
- **Notification**: Alert khi balance < threshold, khi có tx lớn bất thường
- **Restore**: Khôi phục giao dịch đã soft delete (với lý do)
- **Batch manual topup/withdraw**: Nạp/rút hàng loạt từ file

## 10. Checklist triển khai FE

- [ ] Page `/pmc/finance/treasury/index.vue`
- [ ] Composable `composables/api/useTreasury.ts`:
  - Queries: `useCashAccountDefault()`, `useTreasuryKpi(params)`, `useCashTransactionList(params)`, `useCashTransactionDetail(id)`
  - Mutations: `apiManualTopup()`, `apiManualWithdraw()`, `apiDeleteCashTransaction(id, reason)`
  - Tất cả URLs định nghĩa trong composable, pages KHÔNG call `$api` với raw URL
- [ ] Components:
  - `TreasuryAccountCard.vue` — card thông tin quỹ + số dư
  - `TreasuryKpiRow.vue` — 4 KPI cards
  - `TreasuryFlowChart.vue` — biểu đồ cột Inflow/Outflow
  - `CashTransactionTable.vue` — bảng giao dịch với filter
  - `ManualTopupModal.vue`
  - `ManualWithdrawModal.vue` (với warning balance)
  - `DeleteCashTransactionModal.vue` (với warning + reason input)
  - `CashTransactionDetailModal.vue` (2 tabs: info + audit)
- [ ] Type augmentation: chờ Orval regenerate từ `api.json` sau khi BE xong
- [ ] Chạy `cd frontend && pnpm run api:generate` sau khi BE deploy
- [ ] Dùng Nuxt UI v4 components: `UCard`, `UBadge`, `UTable`, `UModal`, `UForm`, `UInput`, `UTextarea`, `USelect`, `UDatePicker`, `UAlert` (cho warning balance), `SharedSectionCard`
- [ ] KHÔNG custom `<div>` + Tailwind cho alert/badge/card — dùng component có sẵn
- [ ] Cập nhật `reconciliation/index.vue` thêm cột "Giao dịch quỹ"
- [ ] Cập nhật `commission-summary/index.vue` thêm cột/badge "Đã vào quỹ"
- [ ] Typecheck: `docker exec residential_frontend pnpm run typecheck`
- [ ] Lint: `docker exec residential_frontend pnpm run lint`
