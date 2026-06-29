# Tổng hợp hoa hồng - Dặc tả kỹ thuật Backend

> Module: `PMC/ClosingPeriod` | Ngay tao: 2026-04-09 | Trang thai: Draft

## 1. Tong quan

Tinh nang **Tong hop hoa hong** la bao cao tong hop read-only, truy van du lieu tu bang `order_commission_snapshots` (da duoc tao boi module ClosingPeriod). Khong tao bang/model moi — chi them endpoint API de aggregate va tra ve du lieu theo cac chieu loc.

**Muc dich:** Giup ke toan doi soat hoa hong theo ky chot, du an, nguoi/ben nhan — ho tro xem KPI tong quan va chi tiet tung dong snapshot.

**Data source:**
- `order_commission_snapshots` — ket qua tinh hoa hong da luu
- `closing_period_orders` — lien ket don hang voi ky chot
- `closing_periods` — thong tin ky chot (ten, trang thai)
- `orders` — ma don hang
- `accounts` (`PMC/Account`) — ten nguoi nhan (cho recipient_type = staff/department co account_id)

## 2. Entities

**Khong tao entity/table moi.** Feature nay doc tu cac bang da co:

| Bang | Muc dich |
|------|----------|
| `order_commission_snapshots` | Du lieu chinh: recipient, amount, percent, resolved_from |
| `closing_period_orders` | Lien ket snapshot voi ky chot, frozen amounts |
| `closing_periods` | Loc theo ky, lay ten ky |
| `orders` | Lay ma don hang (code) |
| `accounts` | Lay ten nguoi nhan |

## 3. API Endpoints

| Action | Method | URL | Request Class | Mo ta |
|--------|--------|-----|---------------|-------|
| Summary | GET | `/api/v1/pmc/commission-summary` | `CommissionSummaryRequest` | Tra ve stats + by_recipient + snapshots |

### 3.1 GET /api/v1/pmc/commission-summary

**Permission:** `closing-periods.view`

**Response format:**

```json
{
  "success": true,
  "data": {
    "stats": {
      "total_commission": "15000000.00",
      "order_count": 10,
      "snapshot_count": 45,
      "recipient_count": 12
    },
    "by_recipient": [
      {
        "recipient_type": { "value": "platform", "label": "Platform" },
        "recipient_name": "Platform",
        "account_id": null,
        "total_amount": "5000000.00",
        "order_count": 10
      },
      {
        "recipient_type": { "value": "staff", "label": "Nhan vien" },
        "recipient_name": "Nguyen Van A",
        "account_id": 42,
        "total_amount": "2000000.00",
        "order_count": 5
      }
    ],
    "snapshots": [
      {
        "id": 1,
        "order_id": 5,
        "order_code": "DH-001",
        "closing_period_id": 1,
        "closing_period_name": "Ky T3/2026",
        "recipient_type": { "value": "platform", "label": "Platform" },
        "recipient_name": "Platform",
        "account_id": null,
        "value_type": { "value": "both", "label": "Ca hai" },
        "percent": "5.00",
        "value_fixed": "1000.00",
        "amount": "1500000.00",
        "resolved_from": "config"
      }
    ]
  }
}
```

## 4. Validation Rules

### CommissionSummaryRequest

| Field | Rules | Mo ta |
|-------|-------|-------|
| `closing_period_id` | `required`, `string` | Gia tri: so nguyen (ID ky chot) \| `'all'` \| `'pending'` |
| `project_id` | `nullable`, `integer` | Loc theo du an |
| `recipient_type` | `nullable`, `string`, `Rule::in(SnapshotRecipientType::values())` | Loc theo loai nguoi nhan |
| `resolved_from` | `nullable`, `string`, `Rule::in(['override', 'config'])` | Loc theo nguon tinh: override hay config |

### Logic loc `closing_period_id`:

| Gia tri | Logic |
|---------|-------|
| So nguyen (vd: `1`) | `WHERE closing_period_id = 1` |
| `'all'` | Khong loc — lay tat ca snapshot |
| `'pending'` | Chi lay snapshot thuoc cac ky co `status = 'open'` |

### Logic loc `project_id`:

- Join: `order_commission_snapshots` → `orders` → `quotes` → `og_tickets` → filter by `og_tickets.project_id`
- Hoac: `order_commission_snapshots` → `closing_period_orders` → `orders` roi join tiep

## 5. Business Rules

- [ ] Day la feature **read-only** — khong tao/sua/xoa du lieu
- [ ] Chi tra ve snapshot cua cac ky chot ma user co quyen `closing-periods.view`
- [ ] Nhom `by_recipient`: GROUP BY (`recipient_type`, `account_id`, `recipient_name`), SUM(`amount`), COUNT(DISTINCT `order_id`)
- [ ] Sap xep `by_recipient` theo `total_amount` DESC
- [ ] `stats.recipient_count`: dem so luong recipient duy nhat (COUNT DISTINCT nhom)
- [ ] `stats.order_count`: COUNT DISTINCT `order_id` tu snapshots da loc
- [ ] `stats.total_commission`: SUM `amount` tu tat ca snapshot da loc (CHU Y: bao gom ca department/staff — day la tong tat ca dong, khong phai top-level sum)

> **Luu y ve total_commission:** Trang nay hien thi TONG tat ca dong snapshot (bao gom internal distribution). Day khac voi `frozen_commission_total` trong `closing_period_orders` (chi tinh top-level). Muc dich la de ke toan thay toan bo phan phoi.

## 6. Query Logic (pseudo-code)

```php
// Base query
$query = OrderCommissionSnapshot::query()
    ->join('closing_periods', ...)
    ->join('orders', ...);

// Filter: closing_period_id
if ($closingPeriodId === 'all') {
    // no filter
} elseif ($closingPeriodId === 'pending') {
    $query->whereHas('closingPeriod', fn($q) => $q->where('status', 'open'));
} else {
    $query->where('closing_period_id', (int) $closingPeriodId);
}

// Filter: project_id
if ($projectId) {
    $query->whereHas('order', function ($q) use ($projectId) {
        $q->whereHas('quote.ogTicket', fn($q2) => $q2->where('project_id', $projectId));
    });
}

// Filter: recipient_type
if ($recipientType) {
    $query->where('recipient_type', $recipientType);
}

// Filter: resolved_from
if ($resolvedFrom) {
    $query->where('resolved_from', $resolvedFrom);
}

// Stats
$stats = [
    'total_commission' => $query->sum('amount'),
    'order_count' => $query->distinct('order_id')->count(),
    'snapshot_count' => $query->count(),
    'recipient_count' => ..., // COUNT DISTINCT (recipient_type, account_id, recipient_name)
];

// By recipient
$byRecipient = $query->clone()
    ->selectRaw('recipient_type, account_id, recipient_name, SUM(amount) as total_amount, COUNT(DISTINCT order_id) as order_count')
    ->groupBy('recipient_type', 'account_id', 'recipient_name')
    ->orderByDesc('total_amount')
    ->get();

// Snapshots (full list)
$snapshots = $query->clone()
    ->with(['order:id,code', 'closingPeriod:id,name'])
    ->orderBy('order_id')
    ->orderBy('recipient_type')
    ->get();
```

## 7. Implementation Structure

### Files can tao / sua:

| File | Mo ta |
|------|-------|
| `ClosingPeriod/Controllers/CommissionSummaryController.php` | Controller moi — 1 method `index()` |
| `ClosingPeriod/Requests/CommissionSummaryRequest.php` | Validation cho query params |
| `ClosingPeriod/Repositories/ClosingPeriodRepository.php` | Them methods: `getCommissionSummaryQuery()`, `getByRecipientData()`, `getSnapshotStats()` |
| `PMC/routes/api.php` | Them route `GET commission-summary` |

### Khong can tao:
- Khong can Model moi
- Khong can Service moi (co the xu ly truc tiep trong Controller hoac them method vao `ClosingPeriodService`)
- Khong can Resource class (tra ve array truc tiep vi day la aggregation, khong phai model serialization)
- Khong can Migration

## 8. Cross-Module Dependencies

| Dependency | Module nguon | Cach truy cap |
|-----------|-------------|---------------|
| Order (code) | PMC/Order | Join truc tiep (cung module PMC) |
| Account (name) | PMC/Account | Join truc tiep (cung module PMC) |
| Project (filter) | PMC/OgTicket→Project | Join qua quote→og_ticket |

> Tat ca deu nam trong module PMC → **khong can ExternalService**.

## 9. Route Registration

```php
// routes/api.php (PMC module)
Route::middleware(['auth:sanctum', 'permission:closing-periods.view'])
    ->get('commission-summary', [CommissionSummaryController::class, 'index']);
```

## 10. Checklist trien khai BE

- [ ] `CommissionSummaryController` voi method `index()`
- [ ] `CommissionSummaryRequest` voi validation rules
- [ ] Them query methods vao `ClosingPeriodRepository`
- [ ] Dang ky route trong `PMC/routes/api.php`
- [ ] Update `api.json` (Scramble)
- [ ] Chay Pint format + lint
- [ ] Viet test cho endpoint (happy path: loc theo ky, loc theo du an, loc theo recipient_type)

## 11. Phan biet voi ClosingPeriod Detail

| Aspect | ClosingPeriod Detail | Commission Summary |
|--------|---------------------|-------------------|
| Scope | 1 ky chot cu the | Cross-period (all/pending/specific) |
| Data | Orders + snapshots nested | Flat snapshot list + aggregation |
| Grouping | Theo order → snapshot tree | Theo recipient (GROUP BY) |
| Purpose | Xem chi tiet 1 ky | Bao cao tong hop, doi soat |
| total_commission | Top-level only (frozen) | Tat ca dong (full distribution) |

## 12. Ghi chu

- **Khong co payout_status:** Mockup BA co truong `payoutStatus` (da thanh toan / chua thanh toan hoa hong). Tinh nang nay chua co trong backend hien tai. Neu can, se phai them field `payout_status` vao `order_commission_snapshots` va logic thanh toan hoa hong rieng. → **Pham vi tuong lai, khong nằm trong scope hiện tại.**
- **"Tinh lai tat ca" button:** Mockup co nut recalculate all snapshots. Trong backend thuc, viec nay tuong duong voi reopen tat ca ky dang mo va recalculate. Day la operation nang — can xem xet co nen implement khong. → **Optional, co the bo qua trong v1.**
