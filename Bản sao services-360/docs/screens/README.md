# Screens — Điều kiện xuất hiện record

Folder này mô tả **nguồn sinh record** cho từng màn trong hệ thống: để 1 bản ghi xuất hiện ở màn A, cần đi qua những entry point nào (HTTP route admin, public form, event listener, transition, seeder…).

Khác với `docs/flows/` (mô tả workflow nghiệp vụ end-to-end), folder này trả lời câu hỏi:

> *"Trên màn X, dữ liệu từ đâu ra?"*

## Quy ước

Mỗi file document có cấu trúc:

1. **Màn** — đường dẫn FE (`/pmc/...`) + entity hiển thị.
2. **Entry points** — từng cách sinh record kèm:
   - Actor (Admin / KTV / Cư dân / Hệ thống)
   - Kênh (HTTP route / Event listener / Seeder / Transition)
   - Điều kiện tiên quyết (nếu có)
   - Side effect (record phụ được tạo kèm)
3. **Không phải entry point** — những thao tác *chỉ* update/xoá, không sinh mới.

## Index

### Màn giao dịch (records sinh từ workflow)

| # | Màn | File | Entry points chính |
|---|-----|------|---------------------|
| 1 | `/pmc/og-tickets` | [og-tickets.md](og-tickets.md) | Claim pool • Cư dân submit form • Admin tạo tay |
| 2 | `/pmc/quotes` | [quotes.md](quotes.md) | KTV tạo báo giá từ ticket • Tạo revision |
| 3 | `/pmc/orders` | [orders.md](orders.md) | Tạo từ Quote `Approved` |
| 4 | `/pmc/receivables` | [receivables.md](receivables.md) | Auto khi Order `Confirmed` (listener) |
| 5 | `/pmc/finance/reconciliation` | [reconciliations.md](reconciliations.md) | Auto từ PaymentReceipt • Auto từ manual treasury tx |
| 6 | `/pmc/finance/treasury` | [treasury.md](treasury.md) | Manual topup/withdraw • 4 listeners auto-post |
| 7 | `/pmc/finance/advance-payments` | [advance-payments.md](advance-payments.md) | Store single • Store batch |
| 8 | `/pmc/finance/closing-periods` | [closing-periods.md](closing-periods.md) | Kế toán tạo kỳ chốt • Close → sinh snapshot |
| 9 | `/pmc/finance/commission-summary` | [commission-summary.md](commission-summary.md) | Sinh kèm khi close ClosingPeriod |
| 10 | `/pmc/orders/[id]` (tab nghiệm thu) | [acceptance-reports.md](acceptance-reports.md) | Get-or-create khi Order ≥ Accepted |

### Màn danh bạ / master data

| # | Màn | File | Entry points chính |
|---|-----|------|---------------------|
| 11 | `/pmc/customers` | [customers.md](customers.md) | Admin tạo • Auto find-or-create từ OgTicket |
| 12 | `/pmc/og-tickets/[id]` (tab bảo hành) | [warranty-requests.md](warranty-requests.md) | Cư dân submit form bảo hành public |
| 13 | `/pmc/projects`, `/pmc/departments`, `/pmc/job-titles`, `/pmc/accounts`, `/pmc/roles`, `/pmc/og-ticket-categories`, `/pmc/catalog/*`, `/pmc/shifts` | [master-data.md](master-data.md) | Admin tạo tay + Seeder khi khởi tạo tenant |
| 14 | `/pmc/policies`, `/pmc/settings`, `/pmc/commission` (config) | [fixed-records.md](fixed-records.md) | Không tạo mới — chỉ update record cố định |
| 15 | `/pmc/quan-ly-cong-viec` (work schedule / capacity) | [work-schedule.md](work-schedule.md) | Read-only/derived từ Shift |

### Màn báo cáo

Các màn trong `/pmc/reports/*` (**CSAT, SLA, Cashflow, Revenue/Profit, Operating Profit, Commission, Revenue per Ticket, Overview**) **không sinh record mới** — chỉ aggregate/query trên dữ liệu đã có. Không có file riêng.

## Nguyên tắc khi thêm màn mới

- Mỗi khi thêm 1 entity có UI list, bắt buộc tạo file tương ứng trong folder này.
- Nếu entity có auto-create qua listener/transition, **phải** document rõ event trigger + điều kiện.
- Nếu entity có cả tenant-side và platform-side (ví dụ `Ticket` ↔ `OgTicket`), cả 2 đều phải có mục.
