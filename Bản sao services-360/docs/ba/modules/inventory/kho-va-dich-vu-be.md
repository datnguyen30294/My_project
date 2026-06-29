# Module Kho & Dịch vụ - Đặc tả kỹ thuật Backend

> Module: `PMC/Catalog` | Ngày tạo: 2026-03-18 | Trạng thái: Draft

## 1. Tổng quan

Module quản lý **danh mục sản phẩm** (vật tư, dịch vụ) — là master data cho module Quản lý đơn hàng (báo giá, đơn hàng). Thuộc từng tenant (database-per-tenant via Stancl/Tenancy — không cần `organization_id` trên bảng).

**Phạm vi:**
- **Vật tư (CatalogMaterial):** SKU, tên, đơn vị, đơn giá, tồn kho; gắn nhà cung cấp. Tồn kho sửa trực tiếp, audit qua activity log lib.
- **Dịch vụ cố định (CatalogService):** Mã, tên, mô tả, đơn giá cố định.
- **Dịch vụ tùy chọn (CatalogAdhocItem):** Mẫu tái sử dụng — tên + giá mặc định (giá override khi dùng trong báo giá/đơn hàng).
- **Nhà cung cấp (CatalogSupplier):** Thông tin liên hệ, gắn với vật tư.

**Hai loại sản phẩm trong đơn hàng:**

1. **Vật tư + Dịch vụ cố định** — Chọn từ danh mục (catalog); vật tư trừ tồn khi xuất.
2. **Dịch vụ tùy chọn** — Thêm dạng tùy chọn, tự nhập giá.

**Cấu trúc module:**

```
app/Modules/PMC/src/Catalog/
├── Controllers/
│   ├── CatalogMaterialController.php
│   ├── CatalogServiceController.php
│   ├── CatalogAdhocItemController.php
│   └── CatalogSupplierController.php
├── Models/
│   ├── CatalogMaterial.php
│   ├── CatalogService.php
│   ├── CatalogAdhocItem.php
│   └── CatalogSupplier.php
├── Services/
│   ├── CatalogMaterialService.php
│   ├── CatalogServiceService.php
│   ├── CatalogAdhocItemService.php
│   └── CatalogSupplierService.php
├── Repositories/
│   ├── CatalogMaterialRepository.php
│   ├── CatalogServiceRepository.php
│   ├── CatalogAdhocItemRepository.php
│   └── CatalogSupplierRepository.php
├── Resources/
│   ├── CatalogMaterialResource.php
│   ├── CatalogServiceResource.php
│   ├── CatalogAdhocItemResource.php
│   └── CatalogSupplierResource.php
├── Requests/
│   ├── ListCatalogMaterialRequest.php
│   ├── StoreCatalogMaterialRequest.php
│   ├── UpdateCatalogMaterialRequest.php
│   ├── ListCatalogServiceRequest.php
│   ├── StoreCatalogServiceRequest.php
│   ├── UpdateCatalogServiceRequest.php
│   ├── ListCatalogAdhocItemRequest.php
│   ├── StoreCatalogAdhocItemRequest.php
│   ├── UpdateCatalogAdhocItemRequest.php
│   ├── ListCatalogSupplierRequest.php
│   ├── StoreCatalogSupplierRequest.php
│   └── UpdateCatalogSupplierRequest.php
├── Enums/
│   └── CatalogStatus.php
└── routes.php
```

> **Ghi chú:** Vì 4 entity đều dùng chung status Active/Inactive → dùng 1 enum `CatalogStatus` cho cả 4.

## 2. Entities

### 2.1 CatalogMaterial (Vật tư)

**Bảng:** `catalog_materials`

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| SKU | `sku` | `string(50)` | required, unique per tenant | Mã vật tư (VD: VT-001) |
| Tên | `name` | `string(255)` | required | Tên vật tư |
| Đơn vị | `unit` | `string(50)` | required | Đơn vị tính (m, cái, tuýp, bình, ...) |
| Đơn giá | `unit_price` | `decimal(15,2)` | required, >= 0 | Đơn giá mặc định |
| Tồn kho | `stock` | `integer` | required, default: 0, >= 0 | Số lượng tồn hiện tại |
| Nhà cung cấp | `supplier_id` | `unsignedBigInteger` | nullable, FK → catalog_suppliers.id | |
| Mô tả | `description` | `text` | nullable | Mô tả chi tiết |
| Trạng thái | `status` | `string(20)` | required, default: 'active' | Enum CatalogStatus |
| Timestamps | `created_at`, `updated_at` | `timestamp` | auto | |
| Soft Delete | `deleted_at` | `timestamp` | nullable | |

**Indexes:**
- `unique('sku')` — SKU unique (partial index WHERE deleted_at IS NULL)
- `index('supplier_id')`
- `index('status')`

**Relationships:**
- `belongsTo(CatalogSupplier, 'supplier_id')` — nhà cung cấp

**Scopes:**
- `scopeActive(Builder $query)` — `where('status', 'active')`
- `scopeSearch(Builder $query, string $keyword)` — tìm theo `name`, `sku` (LIKE)
- `scopeLowStock(Builder $query, int $threshold = 5)` — `where('stock', '<=', $threshold)`

---

### 2.2 CatalogService (Dịch vụ cố định)

**Bảng:** `catalog_services`

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| Mã | `code` | `string(50)` | required, unique per tenant | Mã dịch vụ (VD: DV-SUA) |
| Tên | `name` | `string(255)` | required | Tên dịch vụ |
| Mô tả | `description` | `text` | nullable | Mô tả chi tiết |
| Đơn giá | `unit_price` | `decimal(15,2)` | required, >= 0 | Đơn giá cố định |
| Đơn vị | `unit` | `string(50)` | required, default: 'lần' | Đơn vị tính |
| Trạng thái | `status` | `string(20)` | required, default: 'active' | Enum CatalogStatus |
| Timestamps | `created_at`, `updated_at` | `timestamp` | auto | |
| Soft Delete | `deleted_at` | `timestamp` | nullable | |

**Indexes:**
- `unique('code')` — code unique (partial index WHERE deleted_at IS NULL)
- `index('status')`

**Scopes:**
- `scopeActive(Builder $query)` — `where('status', 'active')`
- `scopeSearch(Builder $query, string $keyword)` — tìm theo `name`, `code` (LIKE)

---

### 2.3 CatalogAdhocItem (Dịch vụ tùy chọn)

**Bảng:** `catalog_adhoc_items`

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| Tên | `name` | `string(255)` | required | Tên dịch vụ mẫu |
| Giá mặc định | `default_price` | `decimal(15,2)` | required, >= 0 | Giá mặc định (có thể override khi dùng) |
| Đơn vị | `unit` | `string(50)` | required, default: 'lần' | Đơn vị tính |
| Trạng thái | `status` | `string(20)` | required, default: 'active' | Enum CatalogStatus |
| Timestamps | `created_at`, `updated_at` | `timestamp` | auto | |
| Soft Delete | `deleted_at` | `timestamp` | nullable | |

**Indexes:**
- `index('status')`

**Scopes:**
- `scopeActive(Builder $query)` — `where('status', 'active')`
- `scopeSearch(Builder $query, string $keyword)` — tìm theo `name` (LIKE)

**Đặc điểm:**
- Là **mẫu** để tái sử dụng. Khi dùng trong QuoteLine/OrderLine → snapshot `name` + `default_price` vào dòng, giá có thể override.

---

### 2.4 CatalogSupplier (Nhà cung cấp)

**Bảng:** `catalog_suppliers`

| Field | Column | Type | Constraints | Mô tả |
|-------|--------|------|-------------|-------|
| ID | `id` | `bigIncrements` | PK | |
| Tên | `name` | `string(255)` | required | Tên nhà cung cấp |
| Mã | `code` | `string(50)` | required, unique per tenant | Mã nhà cung cấp (VD: VTX) |
| Liên hệ | `contact` | `string(255)` | nullable | Tên người liên hệ / phòng ban |
| SĐT | `phone` | `string(20)` | nullable | Số điện thoại |
| Địa chỉ | `address` | `text` | nullable | Địa chỉ |
| Email | `email` | `string(255)` | nullable | Email liên hệ |
| Trạng thái | `status` | `string(20)` | required, default: 'active' | Enum CatalogStatus |
| Timestamps | `created_at`, `updated_at` | `timestamp` | auto | |
| Soft Delete | `deleted_at` | `timestamp` | nullable | |

**Indexes:**
- `unique('code')` — code unique (partial index WHERE deleted_at IS NULL)
- `index('status')`

**Relationships:**
- `hasMany(CatalogMaterial, 'supplier_id')` — vật tư

**Scopes:**
- `scopeActive(Builder $query)` — `where('status', 'active')`
- `scopeSearch(Builder $query, string $keyword)` — tìm theo `name`, `code` (LIKE)

---

## 3. Enums

### 3.1 CatalogStatus

Dùng chung cho cả 4 entity (CatalogMaterial, CatalogService, CatalogAdhocItem, CatalogSupplier).

| Key | Value | Label (VI) |
|-----|-------|------------|
| `Active` | `active` | Đang sử dụng |
| `Inactive` | `inactive` | Ngưng sử dụng |

---

## 4. API Endpoints

Tất cả endpoint cần **auth (Sanctum)** + middleware **tenant** (Stancl — tự switch DB theo subdomain). Route prefix: `/api/v1/pmc/catalog/`.

### 4.1 Vật tư (CatalogMaterial)

| Action | Method | URL | Request Class | Mô tả |
|--------|--------|-----|---------------|-------|
| List | GET | `/api/v1/pmc/catalog/materials` | `ListCatalogMaterialRequest` | Danh sách vật tư (paginated, search, filter) |
| Detail | GET | `/api/v1/pmc/catalog/materials/{id}` | — | Chi tiết vật tư |
| Create | POST | `/api/v1/pmc/catalog/materials` | `StoreCatalogMaterialRequest` | Tạo vật tư mới |
| Update | PUT | `/api/v1/pmc/catalog/materials/{id}` | `UpdateCatalogMaterialRequest` | Cập nhật vật tư |
| Delete | DELETE | `/api/v1/pmc/catalog/materials/{id}` | — | Soft delete |

### 4.2 Dịch vụ cố định (CatalogService)

| Action | Method | URL | Request Class | Mô tả |
|--------|--------|-----|---------------|-------|
| List | GET | `/api/v1/pmc/catalog/services` | `ListCatalogServiceRequest` | Danh sách dịch vụ (paginated, search) |
| Detail | GET | `/api/v1/pmc/catalog/services/{id}` | — | Chi tiết dịch vụ |
| Create | POST | `/api/v1/pmc/catalog/services` | `StoreCatalogServiceRequest` | Tạo dịch vụ mới |
| Update | PUT | `/api/v1/pmc/catalog/services/{id}` | `UpdateCatalogServiceRequest` | Cập nhật dịch vụ |
| Delete | DELETE | `/api/v1/pmc/catalog/services/{id}` | — | Soft delete |

### 4.3 Dịch vụ tùy chọn (CatalogAdhocItem)

| Action | Method | URL | Request Class | Mô tả |
|--------|--------|-----|---------------|-------|
| List | GET | `/api/v1/pmc/catalog/adhoc-items` | `ListCatalogAdhocItemRequest` | Danh sách mẫu tùy chọn (paginated, search) |
| Detail | GET | `/api/v1/pmc/catalog/adhoc-items/{id}` | — | Chi tiết mẫu |
| Create | POST | `/api/v1/pmc/catalog/adhoc-items` | `StoreCatalogAdhocItemRequest` | Tạo mẫu mới |
| Update | PUT | `/api/v1/pmc/catalog/adhoc-items/{id}` | `UpdateCatalogAdhocItemRequest` | Cập nhật mẫu |
| Delete | DELETE | `/api/v1/pmc/catalog/adhoc-items/{id}` | — | Soft delete |

### 4.4 Nhà cung cấp (CatalogSupplier)

| Action | Method | URL | Request Class | Mô tả |
|--------|--------|-----|---------------|-------|
| List | GET | `/api/v1/pmc/catalog/suppliers` | `ListCatalogSupplierRequest` | Danh sách nhà cung cấp (paginated, search) |
| Detail | GET | `/api/v1/pmc/catalog/suppliers/{id}` | — | Chi tiết nhà cung cấp |
| Create | POST | `/api/v1/pmc/catalog/suppliers` | `StoreCatalogSupplierRequest` | Tạo mới |
| Update | PUT | `/api/v1/pmc/catalog/suppliers/{id}` | `UpdateCatalogSupplierRequest` | Cập nhật |
| Delete | DELETE | `/api/v1/pmc/catalog/suppliers/{id}` | — | Soft delete |

---

## 5. Validation Rules

### 5.1 ListCatalogMaterialRequest

| Field | Rules | Mô tả |
|-------|-------|-------|
| `search` | `['nullable', 'string', 'max:255']` | Tìm theo name, sku |
| `supplier_id` | `['nullable', 'integer', 'exists:catalog_suppliers,id']` | Lọc theo nhà cung cấp |
| `status` | `['nullable', 'string', Rule::in(CatalogStatus::values())]` | Lọc theo trạng thái |
| `low_stock` | `['nullable', 'boolean']` | Chỉ hiện tồn thấp |
| `sort_by` | `['nullable', 'string', Rule::in(['name', 'sku', 'unit_price', 'stock', 'created_at'])]` | |
| `sort_direction` | `['nullable', 'string', Rule::in(['asc', 'desc'])]` | |
| `per_page` | `['nullable', 'integer', 'min:1', 'max:100']` | |

### 5.2 StoreCatalogMaterialRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `sku` | `['required', 'string', 'max:50', Rule::unique('catalog_materials', 'sku')->whereNull('deleted_at')]` | SKU là bắt buộc / SKU đã tồn tại |
| `name` | `['required', 'string', 'max:255']` | Tên vật tư là bắt buộc |
| `unit` | `['required', 'string', 'max:50']` | Đơn vị là bắt buộc |
| `unit_price` | `['required', 'numeric', 'min:0']` | Đơn giá là bắt buộc / Đơn giá không hợp lệ |
| `stock` | `['nullable', 'integer', 'min:0']` | Tồn kho không hợp lệ |
| `supplier_id` | `['nullable', 'integer', 'exists:catalog_suppliers,id']` | Nhà cung cấp không tồn tại |
| `description` | `['nullable', 'string']` | |

### 5.3 UpdateCatalogMaterialRequest

Giống `StoreCatalogMaterialRequest` nhưng:
- `sku` unique ignore current ID
- `stock` cho sửa trực tiếp (audit qua activity log lib)

### 5.4 ListCatalogServiceRequest

| Field | Rules | Mô tả |
|-------|-------|-------|
| `search` | `['nullable', 'string', 'max:255']` | Tìm theo name, code |
| `status` | `['nullable', 'string', Rule::in(CatalogStatus::values())]` | Lọc theo trạng thái |
| `sort_by` | `['nullable', 'string', Rule::in(['name', 'code', 'unit_price', 'created_at'])]` | |
| `sort_direction` | `['nullable', 'string', Rule::in(['asc', 'desc'])]` | |
| `per_page` | `['nullable', 'integer', 'min:1', 'max:100']` | |

### 5.5 StoreCatalogServiceRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `code` | `['required', 'string', 'max:50', Rule::unique('catalog_services', 'code')->whereNull('deleted_at')]` | Mã dịch vụ là bắt buộc / Mã đã tồn tại |
| `name` | `['required', 'string', 'max:255']` | Tên dịch vụ là bắt buộc |
| `description` | `['nullable', 'string']` | |
| `unit_price` | `['required', 'numeric', 'min:0']` | Đơn giá là bắt buộc |
| `unit` | `['nullable', 'string', 'max:50']` | |

### 5.6 ListCatalogAdhocItemRequest

| Field | Rules | Mô tả |
|-------|-------|-------|
| `search` | `['nullable', 'string', 'max:255']` | Tìm theo name |
| `status` | `['nullable', 'string', Rule::in(CatalogStatus::values())]` | Lọc theo trạng thái |
| `sort_by` | `['nullable', 'string', Rule::in(['name', 'default_price', 'created_at'])]` | |
| `sort_direction` | `['nullable', 'string', Rule::in(['asc', 'desc'])]` | |
| `per_page` | `['nullable', 'integer', 'min:1', 'max:100']` | |

### 5.7 StoreCatalogAdhocItemRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `name` | `['required', 'string', 'max:255']` | Tên dịch vụ là bắt buộc |
| `default_price` | `['required', 'numeric', 'min:0']` | Giá mặc định là bắt buộc |
| `unit` | `['nullable', 'string', 'max:50']` | |

### 5.8 ListCatalogSupplierRequest

| Field | Rules | Mô tả |
|-------|-------|-------|
| `search` | `['nullable', 'string', 'max:255']` | Tìm theo name, code |
| `status` | `['nullable', 'string', Rule::in(CatalogStatus::values())]` | Lọc theo trạng thái |
| `sort_by` | `['nullable', 'string', Rule::in(['name', 'code', 'created_at'])]` | |
| `sort_direction` | `['nullable', 'string', Rule::in(['asc', 'desc'])]` | |
| `per_page` | `['nullable', 'integer', 'min:1', 'max:100']` | |

### 5.9 StoreCatalogSupplierRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `name` | `['required', 'string', 'max:255']` | Tên nhà cung cấp là bắt buộc |
| `code` | `['required', 'string', 'max:50', Rule::unique('catalog_suppliers', 'code')->whereNull('deleted_at')]` | Mã là bắt buộc / Mã đã tồn tại |
| `contact` | `['nullable', 'string', 'max:255']` | |
| `phone` | `['nullable', 'string', 'max:20']` | |
| `address` | `['nullable', 'string']` | |
| `email` | `['nullable', 'email', 'max:255']` | Email không hợp lệ |

---

## 6. Business Rules

### Vật tư (CatalogMaterial)
- [ ] SKU unique per tenant (DB tự isolate) (tenant)
- [ ] `stock` cho sửa trực tiếp qua Update API — audit thay đổi qua activity log lib (như ticket)
- [ ] Khi xóa vật tư (soft delete): kiểm tra không có dòng đơn hàng đang active reference
- [ ] Xóa CatalogSupplier bị block nếu còn CatalogMaterial reference

### Dịch vụ
- [ ] CatalogService: `code` unique per tenant (DB tự isolate)
- [ ] CatalogAdhocItem: `default_price` có thể = 0 (nghĩa là giá sẽ nhập khi dùng)
- [ ] Khi dùng trong báo giá/đơn hàng → snapshot name + price vào QuoteLine/OrderLine (giá có thể override)

### Nhà cung cấp (CatalogSupplier)
- [ ] `code` unique per tenant (DB tự isolate)
- [ ] Không cho phép xóa nếu đang có CatalogMaterial reference (`materials_count > 0` → throw exception)

---

## 7. Resource Output

### 7.1 CatalogMaterialResource

```json
{
  "id": 1,
  "sku": "VT-001",
  "name": "Ống nước PVC D21",
  "unit": "m",
  "unit_price": 25000,
  "stock": 100,
  "description": null,
  "status": {
    "value": "active",
    "label": "Đang sử dụng"
  },
  "supplier": {
    "id": 1,
    "name": "Công ty Vật tư X",
    "code": "VTX"
  },
  "created_at": "2026-03-18 09:00:00",
  "updated_at": "2026-03-18 09:00:00"
}
```

### 7.2 CatalogServiceResource

```json
{
  "id": 1,
  "code": "DV-SUA",
  "name": "Sửa chữa máy lạnh",
  "description": "Khảo sát và sửa chữa cơ bản",
  "unit_price": 350000,
  "unit": "lần",
  "status": {
    "value": "active",
    "label": "Đang sử dụng"
  },
  "created_at": "2026-03-18 09:00:00",
  "updated_at": "2026-03-18 09:00:00"
}
```

### 7.3 CatalogAdhocItemResource

```json
{
  "id": 1,
  "name": "Thay linh kiện theo báo giá",
  "default_price": 0,
  "unit": "lần",
  "status": {
    "value": "active",
    "label": "Đang sử dụng"
  },
  "created_at": "2026-03-18 09:00:00",
  "updated_at": "2026-03-18 09:00:00"
}
```

### 7.4 CatalogSupplierResource

```json
{
  "id": 1,
  "name": "Công ty Vật tư X",
  "code": "VTX",
  "contact": "Phòng kinh doanh",
  "phone": "0281111111",
  "address": "Q.1, TP.HCM",
  "email": null,
  "status": {
    "value": "active",
    "label": "Đang sử dụng"
  },
  "materials_count": 2,
  "created_at": "2026-03-18 09:00:00",
  "updated_at": "2026-03-18 09:00:00"
}
```

---

## 8. Cross-Module Communication (ExternalService Pattern)

### 8.1 Catalog cung cấp cho Order module (Order là consumer)

Khi module Quản lý đơn hàng cần truy vấn vật tư/dịch vụ:

**Interface (nằm trong Order module):**

```php
// app/Modules/PMC/src/Order/ExternalServices/CatalogExternalServiceInterface.php

interface CatalogExternalServiceInterface
{
    /** Lấy vật tư theo ID */
    public function getMaterialById(int $id): ?array;

    /** Tìm vật tư (dropdown chọn) */
    public function searchMaterials(string $keyword): Collection;

    /** Trừ tồn kho khi tạo đơn (update trực tiếp CatalogMaterial.stock) */
    public function decreaseStock(int $materialId, int $quantity): bool;

    /** Hoàn tồn khi hủy đơn */
    public function increaseStock(int $materialId, int $quantity): bool;

    /** Lấy dịch vụ cố định theo ID */
    public function getServiceById(int $id): ?array;

    /** Tìm dịch vụ cố định (dropdown) */
    public function searchServices(string $keyword): Collection;

    /** Lấy mẫu tùy chọn theo ID */
    public function getAdhocItemById(int $id): ?array;

    /** Tìm mẫu tùy chọn (dropdown) */
    public function searchAdhocItems(string $keyword): Collection;
}
```

**Implementation (nằm trong Order module, cross-module model access):**

```php
// app/Modules/PMC/src/Order/ExternalServices/CatalogExternalService.php

use App\Modules\PMC\src\Catalog\Models\CatalogMaterial;
use App\Modules\PMC\src\Catalog\Models\CatalogService;
use App\Modules\PMC\src\Catalog\Models\CatalogAdhocItem;

class CatalogExternalService implements CatalogExternalServiceInterface
{
    public function getMaterialById(int $id): ?array
    {
        return CatalogMaterial::with('supplier')->find($id)?->only([
            'id', 'sku', 'name', 'unit', 'unit_price', 'stock',
        ]);
    }

    public function decreaseStock(int $materialId, int $quantity): bool
    {
        return DB::transaction(function () use ($materialId, $quantity) {
            $item = CatalogMaterial::lockForUpdate()->find($materialId);
            if (!$item || $item->stock < $quantity) {
                return false;
            }

            $item->decrement('stock', $quantity);

            return true;
        });
    }

    // ... các method khác tương tự
}
```

**Binding (trong Order ServiceProvider):**

```php
$this->app->bind(CatalogExternalServiceInterface::class, CatalogExternalService::class);
```

### 8.2 Tóm tắt cross-module

| Consumer | Provider | Interface | Binding tại |
|----------|----------|-----------|-------------|
| PMC/Order | PMC/Catalog | `CatalogExternalServiceInterface` | Order ServiceProvider |

> **Ghi chú:** Catalog và Order cùng nằm trong PMC module. Cross-module access vẫn qua ExternalService pattern để giữ loose coupling giữa sub-modules.

---

## 9. Migration Preview

### 9.1 create_catalog_suppliers_table

```php
Schema::create('catalog_suppliers', function (Blueprint $table) {
    $table->id();
    $table->string('name', 255);
    $table->string('code', 50);
    $table->string('contact', 255)->nullable();
    $table->string('phone', 20)->nullable();
    $table->text('address')->nullable();
    $table->string('email', 255)->nullable();
    $table->string('status', 20)->default('active');
    $table->timestamps();
    $table->softDeletes();

    $table->index('status');
});

// Partial unique index — chỉ check unique trên non-deleted records (PostgreSQL)
DB::statement('CREATE UNIQUE INDEX catalog_suppliers_code_unique ON catalog_suppliers (code) WHERE deleted_at IS NULL');
```

> **Ghi chú:** Migrations nằm trong `database/migrations/tenant/` — Stancl/Tenancy tự chạy trên từng tenant DB. Dùng partial unique index (PostgreSQL) để soft-deleted records không block tạo mới cùng code.

### 9.2 create_catalog_materials_table

```php
Schema::create('catalog_materials', function (Blueprint $table) {
    $table->id();
    $table->string('sku', 50);
    $table->string('name', 255);
    $table->string('unit', 50);
    $table->decimal('unit_price', 15, 2);
    $table->integer('stock')->default(0);
    $table->foreignId('supplier_id')->nullable()->constrained('catalog_suppliers')->restrictOnDelete();
    $table->text('description')->nullable();
    $table->string('status', 20)->default('active');
    $table->timestamps();
    $table->softDeletes();

    $table->index('supplier_id');
    $table->index('status');
});

DB::statement('CREATE UNIQUE INDEX catalog_materials_sku_unique ON catalog_materials (sku) WHERE deleted_at IS NULL');
```

### 9.3 create_catalog_services_table

```php
Schema::create('catalog_services', function (Blueprint $table) {
    $table->id();
    $table->string('code', 50);
    $table->string('name', 255);
    $table->text('description')->nullable();
    $table->decimal('unit_price', 15, 2);
    $table->string('unit', 50)->default('lần');
    $table->string('status', 20)->default('active');
    $table->timestamps();
    $table->softDeletes();

    $table->index('status');
});

DB::statement('CREATE UNIQUE INDEX catalog_services_code_unique ON catalog_services (code) WHERE deleted_at IS NULL');
```

### 9.4 create_catalog_adhoc_items_table

```php
Schema::create('catalog_adhoc_items', function (Blueprint $table) {
    $table->id();
    $table->string('name', 255);
    $table->decimal('default_price', 15, 2);
    $table->string('unit', 50)->default('lần');
    $table->string('status', 20)->default('active');
    $table->timestamps();
    $table->softDeletes();

    $table->index('status');
});
```

---

## 10. Checklist triển khai BE

### Phase 1: CatalogSupplier (tạo trước vì CatalogMaterial FK vào)
- [ ] Migration `create_catalog_suppliers_table`
- [ ] Model `CatalogSupplier` (extends BaseModel, HasFactory, SoftDeletes)
- [ ] Enum `CatalogStatus` (dùng chung)
- [ ] Repository `CatalogSupplierRepository` + Interface
- [ ] Service `CatalogSupplierService` + Interface
- [ ] Resource `CatalogSupplierResource` (extends BaseResource)
- [ ] Requests: `StoreCatalogSupplierRequest`, `UpdateCatalogSupplierRequest`
- [ ] Controller `CatalogSupplierController` (CRUD)
- [ ] Factory `CatalogSupplierFactory`
- [ ] Seeder `CatalogSupplierSeeder`

### Phase 2: CatalogMaterial
- [ ] Migration `create_catalog_materials_table`
- [ ] Model `CatalogMaterial` (extends BaseModel, HasFactory, SoftDeletes) — dùng activity log lib cho audit
- [ ] Repository `CatalogMaterialRepository` + Interface
- [ ] Service `CatalogMaterialService` + Interface
- [ ] Resource `CatalogMaterialResource`
- [ ] Requests: `StoreCatalogMaterialRequest`, `UpdateCatalogMaterialRequest`
- [ ] Controller `CatalogMaterialController` (CRUD)
- [ ] Factory `CatalogMaterialFactory`
- [ ] Seeder `CatalogMaterialSeeder`

### Phase 3: CatalogService + CatalogAdhocItem
- [ ] Migration `create_catalog_services_table`
- [ ] Migration `create_catalog_adhoc_items_table`
- [ ] Model `CatalogService`, `CatalogAdhocItem`
- [ ] Repository + Service (standard pattern)
- [ ] Resource `CatalogServiceResource`, `CatalogAdhocItemResource`
- [ ] Requests: Store/Update cho mỗi entity
- [ ] Controller `CatalogServiceController`, `CatalogAdhocItemController` (CRUD)
- [ ] Factory + Seeder

### Phase 4: Routes + Registration
- [ ] Route file `routes.php` trong `PMC/Catalog/`
- [ ] Register routes trong `PmcServiceProvider` (hoặc tạo `CatalogServiceProvider` riêng)
- [ ] PSR-4 mappings trong `composer.json`
- [ ] Pint format

### Phase 5: Tests
- [ ] CRUD CatalogSupplier (tạo, sửa, xóa, list, search)
- [ ] CRUD CatalogMaterial (tạo, sửa stock trực tiếp, soft delete, list, filter by supplier/status)
- [ ] CRUD CatalogService
- [ ] CRUD CatalogAdhocItem
- [ ] Validation tests cho từng Request
- [ ] Tenant isolation tests (mỗi tenant DB riêng, data không leak)
- [ ] SKU/code uniqueness per tenant DB

### Phase 6: ExternalService (khi tích hợp Order module)
- [ ] `CatalogExternalServiceInterface` + Implementation (trong Order sub-module)
- [ ] decreaseStock / increaseStock (update trực tiếp CatalogMaterial.stock)
- [ ] Tests cho cross-module operations
