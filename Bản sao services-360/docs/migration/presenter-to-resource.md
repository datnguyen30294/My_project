# Migration: Presenter to Laravel API Resource

## Overview

Chuyển toàn bộ project từ custom Presenter + JsonResponseHelper sang Laravel API Resource.

**Reference implementation:** Supplier module (done)
- Resource: `app/Modules/PMC/src/Supplier/Resources/SupplierResource.php`
- Controller: `app/Modules/PMC/src/Supplier/Controllers/SupplierController.php`

## Response format thay doi

```
// TRUOC (Presenter + JsonResponseHelper)
Single:    { "success": true, "message": "Success", "data": { ... } }
Paginated: { "success": true, "message": "Success", "data": [...], "meta": {...}, "links": {...} }

// SAU (Laravel API Resource)
Single:    { "data": { ... } }
Paginated: { "data": [...], "meta": {...}, "links": {...} }
```

---

## Quy tac chung cho moi module

### Step 1: Tao Resource

- Tao file `Resources/{Model}Resource.php` trong thu muc module
- Extends `Illuminate\Http\Resources\Json\JsonResource`
- Them `@mixin Model` PHPDoc de IDE autocomplete
- Them `@return array{...}` PHPDoc de Scramble generate docs
- Copy logic tu `present()` cua Presenter, doi `$model->` thanh `$this->`
- Voi relationship: dung `$this->whenLoaded('relation')` thay vi check `relationLoaded()` thu cong
- Voi nested resource: tao Resource rieng hoac dung inline array

### Step 2: Cap nhat Controller

- Bo `Presenter` khoi constructor injection
- Bo `use JsonResponseHelper`
- Thay doi return type va logic:

```php
// index() - KHONG them @return PHPDoc (de Scramble tu infer pagination)
public function index(ListRequest $request): AnonymousResourceCollection
{
    $paginator = $this->service->list($request->validated());
    return ModelResource::collection($paginator);
}

// show()
public function show(int $id): ModelResource
{
    return new ModelResource($this->service->findById($id));
}

// store()
public function store(CreateRequest $request): JsonResponse
{
    $model = $this->service->create($request->validated());
    return (new ModelResource($model))
        ->response()
        ->setStatusCode(Response::HTTP_CREATED);
}

// update()
public function update(UpdateRequest $request, int $id): ModelResource
{
    return new ModelResource($this->service->update($id, $request->validated()));
}

// destroy()
public function destroy(int $id): JsonResponse
{
    $this->service->delete($id);
    return response()->json(['message' => 'Deleted successfully']);
}
```

### Step 3: Xoa Presenter

- Xoa file `Presenters/{Model}Presenter.php`

### Step 4: Cap nhat test

- Bo tat ca assertion `->assertJson(['success' => true, ...])`
- Data nam trong `data` key (giong nhu truoc)
- Pagination: `meta.total`, `meta.per_page` (format Laravel default)
- Test structure voi `assertJsonStructure(['data' => [...]])`

### Step 5: Chay kiem tra

```bash
docker exec residential_app vendor/bin/pint --dirty --format agent
docker exec residential_app php artisan test --compact app/Modules/PMC/tests/{Module}Test.php
docker exec residential_app php artisan scramble:export
```

---

## Luu y quan trong voi Scramble

- **KHONG** them `@return` PHPDoc cho method `index()` — Scramble se khong infer duoc pagination
- Return type hint `AnonymousResourceCollection` tren method signature thi OK
- Scramble tu dong infer `data`, `links`, `meta` tu `LengthAwarePaginator`

---

## Luu y voi computed fields / query trong Presenter

GoodsReceiptPresenter va GoodsIssuePresenter co **database query trong presenter** (tinh `remaining_quantity`, `available_quantity`). Khi chuyen sang Resource:

- **KHONG** de query trong Resource
- Chuyen logic tinh toan vao Service hoac dung Eloquent accessor tren Model
- Hoac dung `append()` voi `$appends` tren Model

---

## Migration Checklist

### Group 1: Don gian (khong co nested relationship)

#### 1.1 AssetCategory
- [ ] Tao `app/Modules/PMC/src/Asset/Resources/AssetCategoryResource.php`
- [ ] Fields: `id`, `name`, `code`, `description`, `assets_count`
- [ ] Luu y: `assets_count` dung `$this->assets_count ?? $this->assets()->count()`
- [ ] Cap nhat `AssetCategoryController` — bo Presenter, dung Resource
- [ ] Xoa `AssetCategoryPresenter.php`
- [ ] Cap nhat `AssetCategoryTest` assertions
- [ ] Chay Pint + test

#### 1.2 Position
- [ ] Tao `app/Modules/PMC/src/Staff/Resources/PositionResource.php`
- [ ] Fields: `id`, `name`, `code`, `is_external_work_eligible`, `status{value,label}`, `description`
- [ ] Cap nhat `PositionController`
- [ ] Xoa `PositionPresenter.php`
- [ ] Cap nhat test (neu co)
- [ ] Chay Pint + test

#### 1.3 Warehouse
- [ ] Tao `app/Modules/PMC/src/Warehouse/Resources/WarehouseResource.php`
- [ ] Fields: `id`, `name`, `code`, `description`, `area`, `status{value,label}`
- [ ] Cap nhat `WarehouseController`
- [ ] Xoa `WarehousePresenter.php`
- [ ] Cap nhat `WarehouseTest` assertions
- [ ] Chay Pint + test

#### 1.4 ManagementBoard
- [ ] Tao `app/Modules/PMC/src/ManagementBoard/Resources/ManagementBoardResource.php`
- [ ] Fields: `id`, `name`, `code`, `phone`, `email`, `address`, `status{value,label}`, `description`, `employee_count`
- [ ] Cap nhat `ManagementBoardController`
- [ ] Xoa `ManagementBoardPresenter.php`
- [ ] Cap nhat test (neu co)
- [ ] Chay Pint + test

### Group 2: Co nested relationship don gian

#### 2.1 Shift
- [ ] Tao `app/Modules/PMC/src/Staff/Resources/ShiftResource.php`
- [ ] Fields: `id`, `name`, `code`, `start_time`, `end_time`, `working_days[]`, `status{value,label}`, `description`
- [ ] `working_days`: map collection voi `day_of_week{value,label}`
- [ ] Cap nhat `ShiftController`
- [ ] Xoa `ShiftPresenter.php`
- [ ] Cap nhat test (neu co)
- [ ] Chay Pint + test

#### 2.2 Asset
- [ ] Tao `app/Modules/PMC/src/Asset/Resources/AssetResource.php`
- [ ] Fields: `id`, `name`, `code`, `category{id,name,code}`, `price`, `status{value,label}`, `suppliers[{id,name,code}]`, `tags`, `notes`
- [ ] Dung `$this->whenLoaded('category')` va `$this->whenLoaded('suppliers')`
- [ ] Cap nhat `AssetController`
- [ ] Xoa `AssetPresenter.php`
- [ ] Cap nhat `AssetTest` assertions
- [ ] Chay Pint + test

### Group 3: Phuc tap — nhieu nested + helper methods

#### 3.1 Employee
- [ ] Tao `app/Modules/PMC/src/Staff/Resources/EmployeeResource.php`
- [ ] Fields: `id`, `employee_code`, `full_name`, `email`, `phone`, `date_of_birth`, `gender{value,label}`, `address`, `management_board{id,name,code}`, `position{id,name,code,is_external_work_eligible}`, `shift{id,name,code,start_time,end_time}`, `external_work_mode{value,label}`, `can_receive_external_work`, `joined_date`, `status{value,label}`, `notes`
- [ ] Dung `$this->whenLoaded()` cho managementBoard, position, shift
- [ ] Computed: `can_receive_external_work` = position.is_external_work_eligible && external_work_mode != None
- [ ] Format dates: `date_of_birth` va `joined_date` voi format `d/m/Y`
- [ ] Cap nhat `EmployeeController` — luu y: controller co `$employee->load([...])` sau create
- [ ] Xoa `EmployeePresenter.php`
- [ ] Cap nhat test (neu co)
- [ ] Chay Pint + test

#### 3.2 PurchaseOrder
- [ ] Tao `app/Modules/PMC/src/Procurement/Resources/PurchaseOrderResource.php`
- [ ] Tao `app/Modules/PMC/src/Procurement/Resources/PurchaseOrderItemResource.php` (optional, co the inline)
- [ ] Fields chinh: `id`, `title`, `order_number`, `description`, `requester{id,full_name,employee_code}`, `priority{value,label}`, `status{value,label}`, `request_date`, `expected_delivery_date`, `total_amount`, `notes`, `items[]`
- [ ] Fields item: `id`, `asset{id,name,code,category{...}}`, `supplier{id,name,code}`, `quantity`, `unit_price`, `total_amount`, `specifications`
- [ ] Computed: `total_amount` = sum(items.quantity * items.unit_price)
- [ ] Dung `$this->whenLoaded()` cho requester, items
- [ ] Cap nhat `PurchaseOrderController`
- [ ] Xoa `PurchaseOrderPresenter.php`
- [ ] Cap nhat `PurchaseOrderTest` assertions
- [ ] Chay Pint + test

### Group 4: Phuc tap nhat — co database query trong presenter

#### 4.1 GoodsReceipt
- [ ] **TRUOC TIEN**: Chuyen logic tinh `remaining_quantity` tu Presenter vao Service hoac Model accessor
- [ ] Tao `app/Modules/PMC/src/Procurement/Resources/GoodsReceiptResource.php`
- [ ] Tao `app/Modules/PMC/src/Procurement/Resources/GoodsReceiptItemResource.php` (optional)
- [ ] Fields chinh: `id`, `receipt_number`, `purchase_order{id,order_number}`, `warehouse{id,name,code}`, `receiver{id,full_name,employee_code}`, `receipt_date`, `status{value,label}`, `notes`, `total_items`, `total_received_quantity`, `items[]`
- [ ] Fields item: `id`, `asset{...}`, `supplier{...}`, `purchase_order_item{...}`, `received_quantity`, `remaining_quantity`, `note`
- [ ] Cap nhat `GoodsReceiptController`
- [ ] Xoa `GoodsReceiptPresenter.php`
- [ ] Cap nhat `GoodsReceiptTest` assertions
- [ ] Chay Pint + test

#### 4.2 GoodsIssue
- [ ] **TRUOC TIEN**: Chuyen logic tinh `available_quantity` tu Presenter vao Service hoac Model accessor
- [ ] Tao `app/Modules/PMC/src/Procurement/Resources/GoodsIssueResource.php`
- [ ] Tao `app/Modules/PMC/src/Procurement/Resources/GoodsIssueItemResource.php` (optional)
- [ ] Fields chinh: `id`, `issue_number`, `warehouse{...}`, `requester{...}`, `issuer{...}`, `receiver{...}`, `issue_date`, `reason{value,label}`, `status{value,label}`, `notes`, `total_items`, `total_issued_quantity`, `items[]`
- [ ] Fields item: `id`, `goods_receipt_item{id, receipt_number, asset{...}, supplier{...}, received_quantity, available_quantity}`, `issued_quantity`, `note`
- [ ] Cap nhat `GoodsIssueController`
- [ ] Xoa `GoodsIssuePresenter.php`
- [ ] Cap nhat `GoodsIssueTest` assertions
- [ ] Chay Pint + test

### Cleanup sau khi xong tat ca

- [ ] Xoa `app/Common/Presenters/BasePresenter.php`
- [ ] Xoa `app/Common/Contracts/PresenterInterface.php`
- [ ] Xoa `app/Common/OpenApi/JsonResponseHelperExtension.php`
- [ ] Xoa thu muc `Presenters/` rong trong moi module
- [ ] Cap nhat `bootstrap/app.php` — doi exception handler tu `JsonResponseHelper::error()` sang response JSON truc tiep (neu muon)
- [ ] Xoa `app/Common/Http/JsonResponseHelper.php` (chi khi exception handler da duoc doi)
- [ ] Chay full test suite: `docker exec residential_app php artisan test --compact`
- [ ] Chay Scramble export va kiem tra docs: `docker exec residential_app php artisan scramble:export`

---

## Thu tu thuc hien khuyen nghi

```
1. AssetCategory     (very low complexity)
2. Position          (very low)
3. Warehouse         (very low)
4. ManagementBoard   (very low)
5. Shift             (low — nested collection)
6. Asset             (low — nested relations)
7. Employee          (medium — 3 nested + computed + formatDate)
8. PurchaseOrder     (high — nested items + computed total)
9. GoodsReceipt      (very high — query in presenter)
10. GoodsIssue       (very high — query in presenter)
11. Cleanup (bo BasePresenter, JsonResponseHelper, Extension)
```
