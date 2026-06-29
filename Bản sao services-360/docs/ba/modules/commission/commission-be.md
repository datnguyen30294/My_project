# Module Cấu hình chia hoa hồng - Đặc tả kỹ thuật Backend

> Module: `PMC/Commission` | Ngày tạo: 2026-03-25 | Trạng thái: Draft

## 1. Tổng quan

Sub-module **Cấu hình chia hoa hồng (Commission)** thiết lập quy tắc chia tiền hoa hồng cho mỗi dự án. Cấu hình này là **input đầu vào** cho logic chia tiền khi đơn hàng hoàn thành.

**Phạm vi:**
- **Cấu hình 4 bên:** Phân bổ % hoa hồng cho Platform, Công ty vận hành, Ban quản trị, Ban quản lý (tổng = 100%).
- **Phân bổ phòng ban:** Chia phần Ban quản lý cho các phòng ban theo thứ tự ưu tiên (tiền cứng trước, % sau).
- **Phân bổ cá nhân:** Chia phần mỗi phòng ban cho nhân viên theo cùng logic.
- **Người điều chỉnh:** Danh sách người được phép override hoa hồng bậc 3 trên từng đơn.

**Cấu trúc module:**

```
app/Modules/PMC/src/Commission/
├── Controllers/
│   └── CommissionConfigController.php
├── Models/
│   ├── ProjectCommissionConfig.php
│   ├── CommissionDeptRule.php
│   ├── CommissionStaffRule.php
│   └── CommissionAdjuster.php
├── Services/
│   ├── CommissionConfigService.php
│   └── Contracts/
│       └── CommissionConfigServiceInterface.php
├── Repositories/
│   └── CommissionConfigRepository.php
├── Resources/
│   ├── CommissionProjectListResource.php
│   ├── CommissionConfigDetailResource.php
│   ├── CommissionDeptRuleResource.php
│   └── CommissionStaffRuleResource.php
├── Requests/
│   ├── SaveCommissionConfigRequest.php
│   └── SaveCommissionAdjusterRequest.php
└── Enums/
    └── CommissionValueType.php
```

## 2. Luồng chia tiền

### Tổng quan

```
Tổng hoa hồng (đơn hàng completed)
│
├─ Bước 1: Chia 4 bên (% cứng, tổng = 100%)
│   ├── Platform:          total × platform_percent           ← DỪNG
│   ├── Công ty vận hành:  total × operating_company_percent  ← DỪNG
│   ├── Ban quản trị:      total × board_of_directors_percent ← DỪNG
│   └── Ban quản lý:       total × management_percent         ← TIẾP Bước 2
│
├─ Bước 2: Chia Ban quản lý → phòng ban (có sort_order)
│   │  Vòng 1: Trừ tiền cứng theo sort_order (hết pool → dừng)
│   │  Vòng 2: Chia % trên phần còn lại (pool = 0 → bỏ qua)
│   ├── Phòng A: received_a                                   ← TIẾP Bước 3
│   ├── Phòng B: received_b                                   ← TIẾP Bước 3
│   └── ...
│
└─ Bước 3: Trong mỗi phòng ban → cá nhân (cùng logic Bước 2)
    │  Vòng 1: Trừ tiền cứng theo sort_order
    │  Vòng 2: Chia % trên phần còn lại
    ├── NV 1: final_amount_1
    ├── NV 2: final_amount_2
    └── ...
```

### Thuật toán `distribute(pool, recipients[])`

Dùng chung cho Bước 2 (phòng ban) và Bước 3 (cá nhân):

```
function distribute(pool, recipients[]):
    // recipients đã sort theo sort_order ASC

    // Vòng 1: Trừ tiền cứng theo sort_order
    for each r in recipients:
        if pool <= 0: break
        if r.value_fixed > 0:
            actual = min(r.value_fixed, pool)
            r.received = actual
            pool -= actual

    // Vòng 2: Chia % (chỉ khi pool > 0)
    if pool > 0:
        for each r in recipients:
            if r.percent > 0:
                r.received += pool × r.percent / 100

    return recipients
```

### Ví dụ 1: Pool đủ cho tiền cứng và %

```
Input: pool = 400.000đ
Phòng ban (sort_order):
  1. IT:      fixed 50.000đ  + percent 60%
  2. Kế toán: fixed 100.000đ + percent 40%

Vòng 1 (tiền cứng):
  #1 IT:      pool = 400.000 - 50.000  = 350.000đ ✓
  #2 Kế toán: pool = 350.000 - 100.000 = 250.000đ ✓

Vòng 2 (% trên 250.000đ):
  IT:      60% × 250.000 = 150.000đ
  Kế toán: 40% × 250.000 = 100.000đ

Kết quả:
  IT:      50.000 + 150.000 = 200.000đ
  Kế toán: 100.000 + 100.000 = 200.000đ
  Tổng: 400.000đ ✓
```

### Ví dụ 2: Pool hết giữa chừng (tiền cứng > pool)

```
Input: pool = 100.000đ
  1. IT:      fixed 80.000đ  + percent 60%
  2. Kế toán: fixed 50.000đ  + percent 40%

Vòng 1:
  #1 IT:      pool = 100.000 - 80.000 = 20.000đ ✓
  #2 Kế toán: min(50.000, 20.000) = 20.000đ → pool = 0đ

Vòng 2: pool = 0đ → DỪNG

Kết quả:
  IT:      80.000đ
  Kế toán: 20.000đ
```

### Ví dụ 3: Chia cá nhân trong phòng ban

```
Phòng IT nhận: 200.000đ, NV: A, B (C untick)
  1. A: fixed 80.000đ + percent 60%
  2. B: fixed 50.000đ + percent 40%

Vòng 1:
  #1 A: pool = 200.000 - 80.000 = 120.000đ ✓
  #2 B: pool = 120.000 - 50.000 = 70.000đ  ✓

Vòng 2 (% trên 70.000đ):
  A: 60% × 70.000 = 42.000đ
  B: 40% × 70.000 = 28.000đ

Kết quả:
  A: 80.000 + 42.000 = 122.000đ
  B: 50.000 + 28.000 = 78.000đ
  C: 0đ
  Tổng: 200.000đ ✓
```

## 3. Entities

### 3.1 ProjectCommissionConfig (Bước 1 — 4 bên)

**Bảng:** `project_commission_configs`

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| Dự án | `project_id` | `foreignId` | required, FK → projects, unique | 1 project = 1 config |
| Platform | `platform_percent` | `decimal(5,2)` | required, default: 0 | Platform % (mặc định 0%) |
| Công ty VH | `operating_company_percent` | `decimal(5,2)` | required | Công ty vận hành % |
| Ban quản trị | `board_of_directors_percent` | `decimal(5,2)` | required | Ban quản trị % |
| Ban quản lý | `management_percent` | `decimal(5,2)` | required | Ban quản lý % → chia tiếp Bước 2 |
| created_at | `created_at` | `timestamp` | auto | |
| updated_at | `updated_at` | `timestamp` | auto | |

**Validation:** `platform + operating + directors + management = 100`

**Indexes:**
- `project_commission_configs_project_id_unique` on `project_id` (unique)

**Relationships:**
- `belongsTo` → `Project` (project_id)
- `hasMany` → `CommissionDeptRule` (config_id)

> Extends `Model` trực tiếp — bảng phụ thuộc project, không cần soft delete.

### 3.2 CommissionDeptRule (Bước 2 — phòng ban)

**Bảng:** `commission_dept_rules`

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| Config | `config_id` | `foreignId` | required, FK → project_commission_configs, cascade delete | |
| Phòng ban | `department_id` | `foreignId` | required, FK → departments | |
| Thứ tự | `sort_order` | `integer` | required | Ưu tiên trừ tiền cứng |
| Loại giá trị | `value_type` | `string(20)` | required | CommissionValueType enum |
| Phần trăm | `percent` | `decimal(5,2)` | nullable | Bắt buộc khi percent/both |
| Tiền cứng | `value_fixed` | `decimal(15,2)` | nullable | đ/đơn, bắt buộc khi fixed/both |
| created_at | `created_at` | `timestamp` | auto | |
| updated_at | `updated_at` | `timestamp` | auto | |

**Indexes:**
- `commission_dept_rules_config_dept_unique` on `(config_id, department_id)` — unique
- `commission_dept_rules_config_id_index` on `config_id`

**Relationships:**
- `belongsTo` → `ProjectCommissionConfig` (config_id)
- `belongsTo` → `Department` (department_id)
- `hasMany` → `CommissionStaffRule` (dept_rule_id)

> Extends `Model` trực tiếp — cascade delete theo config.

### 3.3 CommissionStaffRule (Bước 3 — cá nhân)

**Bảng:** `commission_staff_rules`

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| Dept Rule | `dept_rule_id` | `foreignId` | required, FK → commission_dept_rules, cascade delete | |
| Nhân viên | `account_id` | `foreignId` | required, FK → accounts | |
| Thứ tự | `sort_order` | `integer` | required | Ưu tiên trừ tiền cứng |
| Loại giá trị | `value_type` | `string(20)` | required | CommissionValueType enum |
| Phần trăm | `percent` | `decimal(5,2)` | nullable | Bắt buộc khi percent/both |
| Tiền cứng | `value_fixed` | `decimal(15,2)` | nullable | đ/đơn, bắt buộc khi fixed/both |
| created_at | `created_at` | `timestamp` | auto | |
| updated_at | `updated_at` | `timestamp` | auto | |

**Indexes:**
- `commission_staff_rules_dept_account_unique` on `(dept_rule_id, account_id)` — unique
- `commission_staff_rules_dept_rule_id_index` on `dept_rule_id`

**Relationships:**
- `belongsTo` → `CommissionDeptRule` (dept_rule_id)
- `belongsTo` → `Account` (account_id)

> Extends `Model` trực tiếp — cascade delete theo dept_rule.

### 3.4 CommissionAdjuster (Người điều chỉnh)

**Bảng:** `commission_adjusters`

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| Dự án | `project_id` | `foreignId` | required, FK → projects | |
| Nhân viên | `account_id` | `foreignId` | required, FK → accounts | |
| created_at | `created_at` | `timestamp` | auto | |
| updated_at | `updated_at` | `timestamp` | auto | |

**Indexes:**
- `commission_adjusters_project_account_unique` on `(project_id, account_id)` — unique
- `commission_adjusters_project_id_index` on `project_id`

**Relationships:**
- `belongsTo` → `Project` (project_id)
- `belongsTo` → `Account` (account_id)

> Extends `Model` trực tiếp — bảng đơn giản, không cần soft delete.

## 4. Enums

### 4.1 CommissionValueType

```php
enum CommissionValueType: string
{
    case Percent = 'percent';   // Chỉ %
    case Fixed = 'fixed';       // Chỉ tiền cứng (đ/đơn)
    case Both = 'both';         // Vừa % vừa tiền cứng
}
```

## 5. API Endpoints

Prefix: `/api/v1/pmc/commission`

### 5.1 Danh sách dự án (với trạng thái config)

```
GET /api/v1/pmc/commission/projects
```

Trả về danh sách project đang quản lý (status = managing) kèm badge "Đã cấu hình" / "Chưa cấu hình".

**Response:** `CommissionProjectListResource[]`

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "code": "PJ-001",
      "name": "Chung cư ABC",
      "address": "123 Nguyễn Văn Linh",
      "is_configured": true,
      "dept_rules_count": 3
    }
  ]
}
```

**Logic:** Left join `project_commission_configs` → `is_configured = config exists`, count `commission_dept_rules`.

### 5.2 Chi tiết cấu hình theo dự án

```
GET /api/v1/pmc/commission/projects/{project}
```

Trả về config 4 bên + dept rules (kèm staff rules) + adjusters. Nếu chưa có config → trả default values (tất cả = 0).

**Response:** `CommissionConfigDetailResource`

```json
{
  "success": true,
  "data": {
    "project": {
      "id": 1,
      "code": "PJ-001",
      "name": "Chung cư ABC"
    },
    "config": {
      "platform_percent": "10.00",
      "operating_company_percent": "30.00",
      "board_of_directors_percent": "20.00",
      "management_percent": "40.00"
    },
    "dept_rules": [
      {
        "id": 1,
        "department": { "id": 5, "name": "Phòng IT" },
        "sort_order": 1,
        "value_type": { "value": "both", "label": "Cả hai" },
        "percent": "60.00",
        "value_fixed": "50000.00",
        "staff_rules": [
          {
            "id": 1,
            "account": { "id": 12, "name": "Nguyễn Văn A", "employee_code": "NV001" },
            "sort_order": 1,
            "value_type": { "value": "fixed", "label": "Tiền cứng" },
            "percent": null,
            "value_fixed": "80000.00"
          },
          {
            "id": 2,
            "account": { "id": 15, "name": "Trần Thị B", "employee_code": "NV002" },
            "sort_order": 2,
            "value_type": { "value": "percent", "label": "Phần trăm" },
            "percent": "100.00",
            "value_fixed": null
          }
        ]
      }
    ],
    "adjusters": [
      { "id": 1, "account": { "id": 12, "name": "Nguyễn Văn A", "employee_code": "NV001" } }
    ]
  }
}
```

### 5.3 Lưu cấu hình (Upsert toàn bộ)

```
PUT /api/v1/pmc/commission/projects/{project}
```

**Chiến lược:** Upsert config + sync dept_rules + sync staff_rules trong 1 transaction. Xóa cũ → tạo mới (full replace).

**Body (SaveCommissionConfigRequest):**

```json
{
  "platform_percent": 10,
  "operating_company_percent": 30,
  "board_of_directors_percent": 20,
  "management_percent": 40,
  "dept_rules": [
    {
      "department_id": 5,
      "sort_order": 1,
      "value_type": "both",
      "percent": 60,
      "value_fixed": 50000,
      "staff_rules": [
        {
          "account_id": 12,
          "sort_order": 1,
          "value_type": "fixed",
          "percent": null,
          "value_fixed": 80000
        },
        {
          "account_id": 15,
          "sort_order": 2,
          "value_type": "percent",
          "percent": 100,
          "value_fixed": null
        }
      ]
    },
    {
      "department_id": 8,
      "sort_order": 2,
      "value_type": "percent",
      "percent": 40,
      "value_fixed": null,
      "staff_rules": [
        {
          "account_id": 20,
          "sort_order": 1,
          "value_type": "percent",
          "percent": 100,
          "value_fixed": null
        }
      ]
    }
  ]
}
```

**Validation:**

| Field | Rules | Mô tả |
|-------|-------|-------|
| `platform_percent` | required, numeric, min:0, max:100 | |
| `operating_company_percent` | required, numeric, min:0, max:100 | |
| `board_of_directors_percent` | required, numeric, min:0, max:100 | |
| `management_percent` | required, numeric, min:0, max:100 | |
| **Tổng 4 bên** | custom rule: sum = 100 | |
| `dept_rules` | required, array, min:1 | Ít nhất 1 phòng ban |
| `dept_rules.*.department_id` | required, exists:departments,id | Phải thuộc project |
| `dept_rules.*.sort_order` | required, integer, min:1 | Unique trong dept_rules |
| `dept_rules.*.value_type` | required, Rule::in(CommissionValueType) | |
| `dept_rules.*.percent` | required_if:value_type,percent/both, numeric, min:0, max:100 | |
| `dept_rules.*.value_fixed` | required_if:value_type,fixed/both, numeric, min:0 | |
| **Tổng % dept** | custom rule: sum percent (các dept có percent/both) = 100 | |
| `dept_rules.*.staff_rules` | required, array, min:1 | Ít nhất 1 NV |
| `dept_rules.*.staff_rules.*.account_id` | required, exists:accounts,id | Phải thuộc project + thuộc department |
| `dept_rules.*.staff_rules.*.sort_order` | required, integer, min:1 | Unique trong staff_rules của dept |
| `dept_rules.*.staff_rules.*.value_type` | required, Rule::in(CommissionValueType) | |
| `dept_rules.*.staff_rules.*.percent` | required_if:value_type,percent/both, numeric, min:0, max:100 | |
| `dept_rules.*.staff_rules.*.value_fixed` | required_if:value_type,fixed/both, numeric, min:0 | |
| **Tổng % staff** | custom rule: trong mỗi dept, sum percent (staff có percent/both) = 100 | |

**Business logic:**
1. Validate project exists + status = managing.
2. Validate tổng 4 bên = 100%.
3. Validate mỗi department_id thuộc project (`departments.project_id = project.id`).
4. Validate mỗi account_id thuộc project (qua `account_project`) VÀ thuộc department (`accounts.department_id`).
5. Validate sort_order unique trong dept_rules.
6. Validate sort_order unique trong mỗi dept's staff_rules.
7. Validate tổng % dept = 100%.
8. Validate tổng % staff = 100% (trong mỗi dept).
9. Transaction: upsert config → delete old dept_rules (cascade xóa staff_rules) → create new dept_rules + staff_rules.

**Response:** `CommissionConfigDetailResource` (200)

### 5.4 Lấy danh sách người điều chỉnh

```
GET /api/v1/pmc/commission/projects/{project}/adjusters
```

**Response:**

```json
{
  "success": true,
  "data": [
    { "id": 1, "account": { "id": 12, "name": "Nguyễn Văn A", "employee_code": "NV001" } }
  ]
}
```

### 5.5 Lưu danh sách người điều chỉnh (Sync)

```
PUT /api/v1/pmc/commission/projects/{project}/adjusters
```

**Body (SaveCommissionAdjusterRequest):**

```json
{
  "account_ids": [12, 15, 20]
}
```

**Validation:**

| Field | Rules | Mô tả |
|-------|-------|-------|
| `account_ids` | required, array | |
| `account_ids.*` | required, exists:accounts,id | Phải thuộc project (qua account_project) |

**Business logic:** Sync: delete all adjusters for project → bulk create mới.

**Response:** 200 + danh sách adjusters mới.

### 5.6 Lấy phòng ban + nhân viên khả dụng (helper)

```
GET /api/v1/pmc/commission/projects/{project}/available-departments
```

Trả danh sách phòng ban thuộc project kèm nhân viên trong mỗi phòng ban (đã thuộc project qua account_project).

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "name": "Phòng IT",
      "accounts": [
        { "id": 12, "name": "Nguyễn Văn A", "employee_code": "NV001" },
        { "id": 15, "name": "Trần Thị B", "employee_code": "NV002" },
        { "id": 18, "name": "Lê Văn C", "employee_code": "NV003" }
      ]
    },
    {
      "id": 8,
      "name": "Phòng Kế toán",
      "accounts": [
        { "id": 20, "name": "Phạm Thị D", "employee_code": "NV004" }
      ]
    }
  ]
}
```

**Logic:** Departments WHERE `project_id = project.id` → eager load accounts WHERE `account_id IN (select account_id from account_project where project_id = ?)` AND `accounts.department_id = departments.id`.

## 6. Business Rules

1. **1 project = 1 config:** Mỗi dự án chỉ có 1 bộ cấu hình hoa hồng. Enforce bằng unique index trên `project_id`.
2. **Tổng 4 bên = 100%:** Platform + Công ty VH + Ban quản trị + Ban quản lý = 100%. Platform mặc định 0%.
3. **Tổng % phòng ban = 100%:** Chỉ tính phòng ban có `value_type` = percent hoặc both.
4. **Tổng % cá nhân = 100%:** Trong mỗi phòng ban, chỉ tính NV có `value_type` = percent hoặc both.
5. **Thứ tự ưu tiên (sort_order):** Quyết định thứ tự trừ tiền cứng. Bắt buộc cho mọi entry kể cả khi `value_type = percent` (dù không ảnh hưởng tính toán).
6. **Tiền cứng trước, % sau:** Vòng 1 trừ tiền cứng theo sort_order, hết pool thì dừng. Vòng 2 chia % trên phần còn lại.
7. **Pool hết → dừng:** Nếu tổng tiền cứng >= pool, phần % = 0. Các entry sort_order thấp hơn được ưu tiên.
8. **Default UI chia đều:** Khi chọn phòng ban → auto tick tất cả NV, chia đều `percent = 100/n`, `value_type = percent`. User có thể điều chỉnh tuỳ ý trước khi lưu.
9. **NV phải thuộc project + department:** Account phải nằm trong `account_project` VÀ `accounts.department_id` phải match.
10. **Phòng ban phải thuộc project:** `departments.project_id` phải match.
11. **Upsert strategy:** Save toàn bộ config 1 lần. Xóa cũ → tạo mới (full replace) trong transaction.
12. **CommissionAdjuster:** Chỉ người trong danh sách mới được override hoa hồng bậc 3 trên đơn thuộc dự án. Cấu hình riêng biệt với config chính.

## 7. Dependencies

### 7.1 Modules sử dụng (import trực tiếp — cùng PMC)

| Module | Entity | Mục đích |
|--------|--------|----------|
| PMC/Project | Project | Dự án cấu hình hoa hồng |
| PMC/Department | Department | Phòng ban tham gia chia |
| PMC/Account | Account | Nhân viên nhận hoa hồng + người điều chỉnh |

> Tất cả cùng top-level module PMC → import trực tiếp, không cần ExternalService.

### 7.2 Modules phụ thuộc ngược

| Module | Mục đích |
|--------|----------|
| PMC/Order | Khi đơn hàng completed → sử dụng config để tính hoa hồng (phase sau) |

## 8. Check Delete

### 8.1 Commission entities (nội bộ)

| Entity | Cần check | Lý do |
|--------|-----------|-------|
| ProjectCommissionConfig | Không riêng | Xóa bằng full replace khi save |
| CommissionDeptRule | Không riêng | Cascade delete theo config |
| CommissionStaffRule | Không riêng | Cascade delete theo dept_rule |
| CommissionAdjuster | Không | Sync replace khi save |

### 8.2 Ảnh hưởng ngược lên module HRM (QUAN TRỌNG)

Khi có commission config, cần **block** các thao tác HRM nếu entity đang được tham chiếu:

| Thao tác HRM | Check | Message khi block |
|---------------|-------|-------------------|
| **Xóa Account khỏi dự án** (sync members) | `commission_staff_rules` hoặc `commission_adjusters` có record với `account_id` trong project | "Không thể xóa nhân viên {name} khỏi dự án: đang có cấu hình hoa hồng. Hãy xóa khỏi cấu hình hoa hồng trước." |
| **Xóa Department** | `commission_dept_rules` có record với `department_id` | "Không thể xóa phòng ban {name}: đang có cấu hình hoa hồng. Hãy xóa khỏi cấu hình hoa hồng trước." |
| **Xóa Account** (soft delete) | `commission_staff_rules` hoặc `commission_adjusters` có record với `account_id` | "Không thể xóa tài khoản {name}: đang có cấu hình hoa hồng. Hãy xóa khỏi cấu hình hoa hồng trước." |

#### Cách implement

Commission module cung cấp **Repository methods** để các module HRM gọi check:

```php
// CommissionConfigRepository
public function hasStaffRule(int $accountId, ?int $projectId = null): bool;
public function hasDeptRule(int $departmentId): bool;
public function hasAdjuster(int $accountId, ?int $projectId = null): bool;
```

Các module HRM inject `CommissionConfigRepository` và check trước khi xóa:

**1. ProjectService::syncMembers()** — check trước khi sync:

```php
public function syncMembers(int $id, array $accountIds): Project
{
    return $this->executeInTransaction(function () use ($id, $accountIds): Project {
        $project = $this->repository->findById($id);
        $currentIds = $project->accounts()->pluck('accounts.id')->toArray();
        $removedIds = array_diff($currentIds, $accountIds);

        // Check commission config cho những account bị xóa khỏi dự án
        foreach ($removedIds as $accountId) {
            if ($this->commissionConfigRepository->hasStaffRule($accountId, $id)
                || $this->commissionConfigRepository->hasAdjuster($accountId, $id)) {
                $account = $this->accountRepository->findById($accountId);
                throw new BusinessException(
                    "Không thể xóa nhân viên {$account->name} khỏi dự án: đang có cấu hình hoa hồng. Hãy xóa khỏi cấu hình hoa hồng trước."
                );
            }
        }

        $project->accounts()->sync($accountIds);
        return $project->load(['accounts.department', 'accounts.jobTitle']);
    });
}
```

**2. DepartmentService::delete()** — check trước khi xóa:

```php
public function delete(int $id): void
{
    $this->executeInTransaction(function () use ($id): void {
        $department = $this->findById($id);

        if ($this->commissionConfigRepository->hasDeptRule($department->id)) {
            throw new BusinessException(
                "Không thể xóa phòng ban {$department->name}: đang có cấu hình hoa hồng. Hãy xóa khỏi cấu hình hoa hồng trước."
            );
        }

        // ... existing delete logic
    });
}
```

**3. AccountService::delete()** — check trước khi xóa:

```php
public function delete(int $id): void
{
    $account = $this->findById($id);

    if ($this->commissionConfigRepository->hasStaffRule($account->id)
        || $this->commissionConfigRepository->hasAdjuster($account->id)) {
        throw new BusinessException(
            "Không thể xóa tài khoản {$account->name}: đang có cấu hình hoa hồng. Hãy xóa khỏi cấu hình hoa hồng trước."
        );
    }

    $account->delete();
}
```

> **Import hợp lệ:** ProjectService, DepartmentService, AccountService đều thuộc PMC → import `CommissionConfigRepository` trực tiếp, không cần ExternalService.

## 9. Migrations

### 9.1 create_project_commission_configs_table

```php
Schema::create('project_commission_configs', function (Blueprint $table) {
    $table->id();
    $table->foreignId('project_id')->constrained('projects')->unique();
    $table->decimal('platform_percent', 5, 2)->default(0);
    $table->decimal('operating_company_percent', 5, 2);
    $table->decimal('board_of_directors_percent', 5, 2);
    $table->decimal('management_percent', 5, 2);
    $table->timestamps();
});
```

### 9.2 create_commission_dept_rules_table

```php
Schema::create('commission_dept_rules', function (Blueprint $table) {
    $table->id();
    $table->foreignId('config_id')->constrained('project_commission_configs')->cascadeOnDelete();
    $table->foreignId('department_id')->constrained('departments');
    $table->integer('sort_order');
    $table->string('value_type', 20);
    $table->decimal('percent', 5, 2)->nullable();
    $table->decimal('value_fixed', 15, 2)->nullable();
    $table->timestamps();

    $table->unique(['config_id', 'department_id']);
    $table->index('config_id');
});
```

### 9.3 create_commission_staff_rules_table

```php
Schema::create('commission_staff_rules', function (Blueprint $table) {
    $table->id();
    $table->foreignId('dept_rule_id')->constrained('commission_dept_rules')->cascadeOnDelete();
    $table->foreignId('account_id')->constrained('accounts');
    $table->integer('sort_order');
    $table->string('value_type', 20);
    $table->decimal('percent', 5, 2)->nullable();
    $table->decimal('value_fixed', 15, 2)->nullable();
    $table->timestamps();

    $table->unique(['dept_rule_id', 'account_id']);
    $table->index('dept_rule_id');
});
```

### 9.4 create_commission_adjusters_table

```php
Schema::create('commission_adjusters', function (Blueprint $table) {
    $table->id();
    $table->foreignId('project_id')->constrained('projects');
    $table->foreignId('account_id')->constrained('accounts');
    $table->timestamps();

    $table->unique(['project_id', 'account_id']);
    $table->index('project_id');
});
```
