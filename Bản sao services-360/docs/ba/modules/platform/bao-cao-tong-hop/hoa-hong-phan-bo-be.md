# Báo cáo Hoa hồng & phân bổ — Đặc tả kỹ thuật Backend

> Module: `Platform/Report` | Báo cáo #6 | Ngày tạo: 2026-06-18 | Trạng thái: Draft
> Nguồn mockup: `BA-TNP-SERVICES/app/pages/platform/modules/bao-cao-tong-hop/hoa-hong-phan-bo.vue` + composable `usePlatformReportData.ts` (`commissionReport`).
> **Nền tảng chung:** [`./README.md`](./README.md) — kiến trúc tổng hợp, route prefix, conventions presenter, pattern cross-tenant, ánh xạ nguồn dữ liệu. File này CHỈ mô tả phần riêng của báo cáo Hoa hồng & phân bổ.

---

## 1. Tổng quan

Báo cáo **Hoa hồng & phân bổ** trả lời câu hỏi: *toàn nền tảng thu được bao nhiêu hoa hồng vendor, phần nào về Platform (TNP) và phần nào về công ty vận hành, gom theo từng đối tượng nhận / từng vendor / từng dự án*. Đây là báo cáo **đọc-chỉ, tổng hợp xuyên toàn bộ partner**, không có entity/bảng mới.

Báo cáo này đọc **duy nhất miền đơn marketplace vendor resi_mart** (README §3.2 — đơn product order + service booking). Mỗi đơn active sinh ra một khoản **hoa hồng** tính qua `VendorOrderCommissionCalculator` theo `PartnerCommissionContract` (mode, terms, `revenue_recipient`). Khoản hoa hồng đó được **chia về 1 trong 2 đối tượng nhận** theo enum `RevenueRecipient`:

- `platform` → phần **Platform TNP** giữ (`platform_share`).
- `operating_company` → phần **công ty vận hành** (tenant đang quản lý dự án — `tenant_id` của hợp đồng) giữ (`vh_share`).

> ⚠️ **KHÔNG trộn miền** (README §3.2): hoa hồng ở đây chỉ tính trên **đơn marketplace**, KHÔNG liên quan tới phí nền tảng/đơn PMC (`frozen_platform_fee`) hay phí B2B `TenantServiceOrder`. Phí nền tảng PMC là dòng tiền khác (xem [`doanh-thu-be.md`](./doanh-thu-be.md)) — không xuất hiện trong báo cáo này.

Mỗi đơn thuộc về **một** đối tượng nhận (không chia đôi một đơn): `platform_share + vh_share` của một đơn = đúng `commission` của đơn đó, trong đó một vế bằng 0 tuỳ `revenue_recipient`.

---

## 2. Endpoint

| Action | Method | URL | Request Class |
|--------|--------|-----|---------------|
| Báo cáo hoa hồng & phân bổ | GET | `/api/v1/platform/reports/commission-allocation` | `ListCommissionAllocationReportRequest` |

- Route đặt trong nhóm route platform hiện hữu (README §3.1), guard `auth:requester`.
- Controller: `CommissionAllocationReportController@index` (submodule `Platform/Report`).
- Service điều phối: `CommissionAllocationReportService` implements `CommissionAllocationReportServiceInterface`.

---

## 3. Filter & Validation

### ListCommissionAllocationReportRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `months` | `nullable`, `integer`, `min:1`, `max:12` | Số tháng phải từ 1 đến 12 |

- Default `months = 6` (đồng bộ chuẩn chung README §5).
- Khoảng kỳ: từ **đầu tháng** `(now - months + 1)` đến **hết tháng hiện tại**.
- `months` ngoài range → **422**.
- KHÔNG validate inline — dùng Form Request riêng (README §5).

---

## 4. Nguồn dữ liệu & logic tổng hợp

> Tham chiếu ánh xạ nguồn README §4 và fact-set chung README §3.4. Toàn bộ báo cáo đọc **một miền duy nhất** — đơn marketplace platform-wide.

### 4.1 Fact-set & commission per order

- Gom đơn marketplace **active** xuyên tất cả partner qua fact-set chung `collectPlatformVendorOrders(from, to)` (README §3.4) — gom **một lần**, không loop lại cho từng chiều.
- Mỗi row đơn chuẩn hóa có (README §3.4): `partner` (`partner_id`, `partner_name`), `project` (`project_id`, `project_name`), `company` (công ty VH = `tenant_id` của hợp đồng), `amount` (= GMV đơn), `commissionAmount`, `recipient` (`platform` | `operating_company`), `status`, `createdAt`.
- **Commission per order:** `commissionAmount` đã do `VendorOrderCommissionCalculator` tính theo `PartnerCommissionContract` snapshot của đơn (mode + terms). Báo cáo **đọc lại** giá trị này, KHÔNG tự tính lại công thức.
- **Split platform vs VH theo `recipient`:**
  - `platform_share(row) = recipient == platform ? commissionAmount : 0`
  - `vh_share(row)       = recipient == operating_company ? commissionAmount : 0`

### 4.2 KPI (`kpis`)

| KPI | Cách tính |
|-----|-----------|
| `commission_total` | `SUM(commissionAmount)` của **tất cả** đơn active ∈ kỳ |
| `platform_total` | `SUM(commissionAmount)` WHERE `recipient = platform` |
| `vh_total` | `SUM(commissionAmount)` WHERE `recipient = operating_company` |
| `platform_share_pct` | `round(platform_total / commission_total * 100)`; `commission_total = 0` → `0` |
| `vh_share_pct` | `round(vh_total / commission_total * 100)`; `commission_total = 0` → `0` |

- Bất biến: `platform_total + vh_total = commission_total` (mỗi đơn về đúng 1 đối tượng nhận).
- `%` trả **số nguyên đã làm tròn** (README §5). Để tránh lệch tổng ≠ 100 do làm tròn, có thể tính `vh_share_pct = 100 - platform_share_pct` khi `commission_total > 0` (ghi nhận lựa chọn lúc code).

### 4.3 Phân bổ theo đối tượng nhận (`by_recipient`) — bảng

- Gom theo **`recipient_company_id`** = định danh đối tượng nhận: `platform` (TNP) **hoặc** từng **công ty VH** (tenant đang vận hành dự án). Tức tách `vh_total` ra theo từng công ty VH, còn `platform` là một dòng gộp.
- Mỗi dòng: `{ recipient_id, label, amount, order_count }`.
  - `recipient_id`: `"platform"` hoặc `tenant_id` của công ty VH.
  - `label`: `"Platform TNP"` (đối tượng platform) hoặc tên công ty VH.
  - `amount`: `SUM(commissionAmount)` các đơn về đối tượng đó.
  - `order_count`: số đơn về đối tượng đó.
- Sort **giảm dần** theo `amount`.

### 4.4 Theo vendor (`by_vendor`) — bảng

- Gom theo `partner_id`, mỗi vendor 1 dòng. Sort **giảm dần** theo `commission`.
- Mỗi dòng:

| Field | Cách tính |
|-------|-----------|
| `partner_id` / `partner_name` | từ row đơn (partner) |
| `order_count` | `COUNT` đơn active của vendor ∈ kỳ |
| `gmv` | `SUM(amount)` (GMV đơn của vendor) |
| `commission` | `SUM(commissionAmount)` |
| `platform_share` | `SUM(commissionAmount)` WHERE `recipient = platform` |
| `vh_share` | `SUM(commissionAmount)` WHERE `recipient = operating_company` |

- `platform_share + vh_share = commission` cho mỗi dòng vendor.

### 4.5 Theo dự án (`by_project`) — bảng

- Gom theo `project_id`, mỗi dự án 1 dòng. Sort **giảm dần** theo `platform_share`.
- Mỗi dòng:

| Field | Cách tính |
|-------|-----------|
| `project_id` / `project_name` | từ row đơn (project) |
| `order_count` | `COUNT` đơn active thuộc dự án ∈ kỳ |
| `platform_share` | `SUM(commissionAmount)` WHERE `recipient = platform` |
| `vh_share` | `SUM(commissionAmount)` WHERE `recipient = operating_company` |

- Tên/định danh dự án giải qua `PlatformProjectService` (cross-tenant) hoặc trực tiếp từ row đơn nếu fact-set đã kèm `project_name` (README §4 — `customer_source`/`project` đính kèm row).

---

## 5. Business Rules

- [ ] **Chỉ tính đơn `active`** (đơn hợp lệ phát sinh hoa hồng); đơn huỷ/hoàn không tính (đồng bộ định nghĩa "active orders" README §3.2).
- [ ] **Chia platform vs VH theo `RevenueRecipient`** trên hợp đồng hoa hồng snapshot của đơn (README §4, §6): `platform` → `platform_share`; `operating_company` → `vh_share`. Mỗi đơn về **đúng 1** vế.
- [ ] **`commission_total = platform_total + vh_total`**; `platform_share_pct + vh_share_pct = 100%` (khi `commission_total > 0`).
- [ ] **`by_recipient`** gom theo `recipient_company_id` (platform là 1 dòng gộp, mỗi công ty VH 1 dòng), sort desc `amount`.
- [ ] **`by_vendor`** sort desc `commission`; **`by_project`** sort desc `platform_share`.
- [ ] **Đơn / hợp đồng "mồ côi" hoặc không phải per-order** → ghi **warning** giống `VendorOrderService` (README §3.3, §3.4): đơn không tìm thấy hợp đồng hoa hồng hợp lệ, hoặc hợp đồng dùng mode không phải `per_order` mà calculator không suy ra được khoản hoa hồng cho đơn → đếm vào `warnings.skipped_orders` (kèm lý do) và **không** cộng vào tổng. Không 500.
- [ ] **`commission_total = 0`** (kỳ rỗng / không có đơn) → mọi KPI = 0, mọi % = 0, các bảng = mảng rỗng. Không lỗi (README §5).
- [ ] **KHÔNG trộn miền** (README §3.2): chỉ đọc đơn marketplace; KHÔNG cộng phí nền tảng PMC hay phí B2B vào báo cáo này.
- [ ] **Read-only thuần** — không ghi gì vào schema resi_mart/tenant/central.
- [ ] **Hiệu năng (README §3.3):** gom fact-set marketplace **một lần** (`collectPlatformVendorOrders`) rồi tính cả KPI + `by_recipient` + `by_vendor` + `by_project` từ tập đó, KHÔNG loop resi_mart lại cho từng chiều. Ghi log nếu cắt bớt (top-N).

---

## 6. Presenter Output

`CommissionAllocationReportResource` (extends `BaseResource`). Tiền = **số nguyên đồng VND, không format ở BE**. `%` = **số nguyên đã làm tròn**. Enum đối tượng nhận thể hiện qua `by_recipient.label` (đã giải nhãn) — README §5. Key presenter = snake_case (README §5).

```json
{
  "success": true,
  "data": {
    "kpis": {
      "commission_total": 960000000,
      "platform_total": 700000000,
      "vh_total": 260000000,
      "platform_share_pct": 73,
      "vh_share_pct": 27
    },
    "by_recipient": [
      { "recipient_id": "platform", "label": "Platform TNP", "order_count": 980, "amount": 700000000 },
      { "recipient_id": "tnp-01", "label": "Công ty VH An Phú", "order_count": 320, "amount": 180000000 },
      { "recipient_id": "tnp-02", "label": "Công ty VH Bình Minh", "order_count": 120, "amount": 80000000 }
    ],
    "by_vendor": [
      {
        "partner_id": 12,
        "partner_name": "Công ty Đối tác Demo",
        "order_count": 480,
        "gmv": 5200000000,
        "commission": 360000000,
        "platform_share": 280000000,
        "vh_share": 80000000
      }
    ],
    "by_project": [
      {
        "project_id": 5,
        "project_name": "Dự án X",
        "order_count": 210,
        "platform_share": 150000000,
        "vh_share": 30000000
      }
    ]
  }
}
```

- Trả qua `response()->json(['success' => true, 'data' => ...])` (đồng nhất `OrganizationController::stats`).
- (Tuỳ chọn) kèm `warnings` (số đơn/hợp đồng bị bỏ qua) nếu phát sinh — đồng bộ pattern `VendorOrderService`.

---

## 7. Cross-Module Dependencies

> Quy tắc README §6: ExternalService chỉ giữa top-level module; trong cùng Platform → import trực tiếp.

| Dependency | Module nguồn | Cách dùng | Dùng cho |
|-----------|-------------|-----------|----------|
| Tổng hợp đơn marketplace platform-wide (amount, commissionAmount, recipient, partner, project, company) | Marketplace/VendorOrder | `PlatformVendorOrderAggregationExternalServiceInterface` (fact-set §3.4) | toàn bộ KPI + 3 bảng |
| Tính hoa hồng theo hợp đồng (mode, terms, `revenue_recipient`) | Marketplace/PartnerCommissionContract | `VendorOrderCommissionCalculator` + enum `RevenueRecipient` (README §4) | `commissionAmount` + split platform/VH (ẩn trong fact-set) |
| Vendor (displayName, status) | Marketplace/Partner | `PartnerExternalServiceInterface` | nhãn `partner_name` cho `by_vendor` |
| Dự án cross-tenant (tên dự án) | PMC + Platform/Tenant | `PlatformProjectService` (đã có) | nhãn `project_name` cho `by_project` |
| Công ty VH (tên cho `by_recipient`) | Platform/Tenant (cùng module) | **Repository trực tiếp** (`Organization`) | nhãn công ty VH trong `by_recipient` |

- Loop partner: ẩn trong `collectPlatformVendorOrders` (tiền lệ `VendorOrderService::*Platform` + `ResiMartConnection::runInTenantSchema`).
- Split `revenue_recipient` đã đính trên từng row đơn của fact-set (README §3.4) — báo cáo chỉ gom, không tự tra hợp đồng lại.

---

## 8. Entities / Migration

**Không bảng mới — read-only.** Báo cáo chỉ đọc lại dữ liệu đã có:
- Đơn marketplace (schema resi_mart, qua ExternalService Marketplace/VendorOrder).
- `partner_commission_contracts` + enum `RevenueRecipient` (central, đã có từ console Quản lý Vendor — [`../quan-ly-vendor-be.md`](../quan-ly-vendor-be.md) §4).
- `organizations` (central, `Platform/Tenant`) cho nhãn công ty VH.

Không migration, không cột mới cho báo cáo này. (Wiring rating thuộc báo cáo CSAT — không liên quan tới báo cáo hoa hồng.)

---

## 9. Checklist triển khai BE

> **Phần chung:** README §8 (submodule structure, fact-set chung, route+guard, tests SQLite `:memory:`, PSR-4 + `make format`/`make lint`).

- [ ] `Platform/Report/Controllers/CommissionAllocationReportController@index`.
- [ ] `CommissionAllocationReportService` + `CommissionAllocationReportServiceInterface` (bind ở `PlatformServiceProvider`); gom fact-set marketplace **một lần**, tính cả KPI + 3 bảng, KHÔNG loop resi_mart lại từng chiều.
- [ ] `Platform/Report/Requests/ListCommissionAllocationReportRequest` (rule `months` 1–12, default 6).
- [ ] `Platform/Report/Resources/CommissionAllocationReportResource` (shape §6: money integer, `%` integer, `by_recipient`/`by_vendor`/`by_project`).
- [ ] Mở rộng `PlatformVendorOrderAggregationExternalService` nếu thiếu field (`recipient`, `commissionAmount`, `project`, `company`) — KHÔNG bypass repository.
- [ ] Tái dùng `VendorOrderCommissionCalculator` + enum `RevenueRecipient` cho split (qua fact-set).
- [ ] Route `GET /api/v1/platform/reports/commission-allocation` + guard `auth:requester`.
- [ ] PSR-4, `make format` → `make lint`.
- [ ] Tests (Platform feature, SQLite `:memory:`):
  - `commission_total = platform_total + vh_total`; `platform_share_pct + vh_share_pct = 100`;
  - split đúng theo `RevenueRecipient` (đơn `platform` chỉ vào `platform_share`, đơn `operating_company` chỉ vào `vh_share`);
  - `by_recipient` gom đúng (platform 1 dòng, mỗi công ty VH 1 dòng) + sort desc `amount`;
  - `by_vendor` sort desc `commission` + `platform_share + vh_share = commission`;
  - `by_project` sort desc `platform_share`;
  - đơn/hợp đồng mồ côi/không-per-order → vào `warnings`, không cộng tổng, không 500;
  - `commission_total = 0` → KPI 0 + % 0 + bảng rỗng; `months` ngoài 1–12 → 422; partner rỗng → 0. **Không** chạm Postgres.
