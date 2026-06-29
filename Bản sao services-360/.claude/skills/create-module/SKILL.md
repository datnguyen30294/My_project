---
name: create-module
description: >-
  Creates a new module or sub-module in the Modular Monolith architecture. Activates when the user
  wants to create, scaffold, or add a new module, feature module, business domain, or entity
  under app/Modules/. Handles both top-level modules and sub-modules (package by feature).
---

# Create Module

## Architecture

```
app/Modules/{Module}/
├── src/{SubModule}/                    # Feature code (Controllers, Models, Services, etc.)
├── database/{factories,migrations,seeders}/  # Shared DB (module-level)
├── ExternalServices/                   # Cross-module communication (interface + impl)
├── Providers/{Module}ServiceProvider.php
└── routes/api.php                      # Shared routes
```

| Level | Example | ServiceProvider? | Routes? | Database? |
|-------|---------|-----------------|---------|-----------|
| Module | `PMC/` | Yes | Yes | Yes |
| Sub-module | `PMC/src/Supplier/` | No | No | No |

### PSR-4 Autoloading

```json
"App\\Modules\\{Module}\\": "app/Modules/{Module}/src/",
"App\\Modules\\{Module}\\Database\\Factories\\": "app/Modules/{Module}/database/factories/",
"App\\Modules\\{Module}\\Database\\Seeders\\": "app/Modules/{Module}/database/seeders/"
```

After adding: `docker exec residential_app composer dump-autoload`

## Before Creating — Detect Context

**MUST scan existing modules first:**

```bash
find app/Modules -type d -maxdepth 4 2>/dev/null
```

Ask user about placement if related modules exist. Then ask about entities (models) for the module.

## Sub-module Grouping Rules

**Multiple entities that belong to the same business domain MUST be grouped into a single sub-module.**

### When to GROUP into one sub-module

- Entities serve the same domain/feature (e.g., Position + Shift + Employee → `Staff`)
- Entities have direct FK relationships within the same module
- One entity cannot function without the others
- They share the same business context

### When to SEPARATE into different sub-modules

- Entity serves a different business domain (e.g., `ManagementBoard` is organizational, not HR)
- Entity could be used by multiple unrelated features in the future
- Entity has independent CRUD lifecycle

### Example: Staff sub-module (multiple entities)

```
PMC/src/Staff/
├── Contracts/
│   ├── PositionServiceInterface.php
│   ├── ShiftServiceInterface.php
│   └── EmployeeServiceInterface.php
├── Controllers/
│   ├── PositionController.php
│   ├── ShiftController.php
│   └── EmployeeController.php
├── Enums/
│   ├── PositionStatus.php
│   ├── ShiftStatus.php
│   ├── DayOfWeek.php
│   ├── EmployeeStatus.php
│   ├── Gender.php
│   └── ExternalWorkMode.php
├── Models/
│   ├── Position.php
│   ├── Shift.php
│   ├── ShiftWorkingDay.php
│   └── Employee.php
├── Repositories/
│   ├── PositionRepository.php
│   ├── ShiftRepository.php
│   └── EmployeeRepository.php
├── Requests/
│   ├── {Create,List,Update}PositionRequest.php
│   ├── {Create,List,Update}ShiftRequest.php
│   └── {Create,List,Update}EmployeeRequest.php
├── Resources/
│   ├── PositionResource.php
│   ├── ShiftResource.php
│   └── EmployeeResource.php
└── Services/
    ├── PositionService.php
    ├── ShiftService.php
    └── EmployeeService.php
```

Each entity has its own Controller, Service, Repository, Resource, and Requests — but they share the same sub-module namespace (`App\Modules\PMC\Staff\`). Routes remain separate prefixes (`/positions`, `/shifts`, `/employees`).

## Cross-Module Communication: ExternalService

Modules NEVER import classes from other modules directly. Use **ExternalService** for cross-module data access.

### Rules

- ExternalService uses **Model directly** (NOT Repository)
- Models CAN define cross-module relationships (e.g., `Order hasOne Invoice`)
- ExternalService methods use eager loading: `Order::with('invoice')->find($id)`
- NO foreign keys between modules in migrations (use `string` columns for external refs)
- Interface lives in the **consuming** module, implementation in the **providing** module's `ExternalServices/`

### Structure

```
app/Modules/
├── PMC/
│   ├── src/Order/
│   │   ├── Models/Order.php              # hasOne → Payment Invoice (relationship)
│   │   └── Contracts/
│   │       └── InvoiceExternalServiceInterface.php  # Interface defined here (consumer)
│   └── ExternalServices/                 # Implementations from other modules
│       └── ...
├── Payment/
│   ├── src/Invoice/
│   │   └── Models/Invoice.php
│   └── ExternalServices/
│       └── PMC/
│           └── InvoiceExternalService.php  # Implements PMC's interface (provider)
```

### Example

**Interface (in consuming module — PMC):**

```php
namespace App\Modules\PMC\Order\Contracts;

use App\Modules\Payment\Invoice\Models\Invoice;

interface InvoiceExternalServiceInterface
{
    public function getInvoiceByOrder(int $orderId): ?Invoice;
}
```

**Implementation (in providing module — Payment):**

```php
namespace App\Modules\Payment\ExternalServices\PMC;

use App\Modules\PMC\Order\Contracts\InvoiceExternalServiceInterface;
use App\Modules\PMC\Order\Models\Order;
use App\Modules\Payment\Invoice\Models\Invoice;

class InvoiceExternalService implements InvoiceExternalServiceInterface
{
    public function getInvoiceByOrder(int $orderId): ?Invoice
    {
        $order = Order::with('invoice')->find($orderId);

        return $order?->invoice;
    }
}
```

**Model relationship (cross-module, in Order model):**

```php
// In PMC Order model — cross-module relationship is OK
public function invoice(): HasOne
{
    return $this->hasOne(Invoice::class, 'order_id');
}
```

**Register binding in ServiceProvider:**

```php
// In PaymentServiceProvider
$this->app->bind(
    InvoiceExternalServiceInterface::class,
    InvoiceExternalService::class,
);
```

**Usage in PMC Service:**

```php
public function __construct(
    protected OrderRepository $repository,
    protected InvoiceExternalServiceInterface $invoiceService,
) {}

public function getOrderWithInvoice(int $id): array
{
    $order = $this->findById($id);
    $invoice = $this->invoiceService->getInvoiceByOrder($order->id);
    // ...
}
```

## Templates

### ServiceProvider

```php
namespace App\Modules\{Module}\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class {Module}ServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Bind ServiceInterfaces
        // $this->app->bind({ModelName}ServiceInterface::class, {ModelName}Service::class);

        // Bind ExternalService interfaces here
    }

    public function boot(): void
    {
        $this->loadMigrationsFrom(__DIR__.'/../database/migrations');
        $this->loadRoutes();
    }

    protected function loadRoutes(): void
    {
        Route::prefix('api/v1/{module-prefix}')
            ->middleware('api')
            ->group(base_path('app/Modules/{Module}/routes/api.php'));
    }
}
```

### Model

```php
namespace App\Modules\{Module}\{SubModule}\Models;

use App\Common\Models\BaseModel;
use App\Common\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class {ModelName} extends BaseModel
{
    use Auditable, HasFactory;

    protected $fillable = [
        // fields...
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected function casts(): array
    {
        return [
            // 'status' => StatusEnum::class,
        ];
    }

    protected static function newFactory(): \App\Modules\{Module}\Database\Factories\{ModelName}Factory
    {
        return \App\Modules\{Module}\Database\Factories\{ModelName}Factory::new();
    }
}
```

BaseModel provides: `HasFactory`, `SoftDeletes`, scopes: `active()`, `recent()`, `latestFirst()`

### Enum

```php
namespace App\Modules\{Module}\{SubModule}\Enums;

enum {EnumName}: string
{
    case Active = 'active';
    case Inactive = 'inactive';

    public function label(): string
    {
        return match ($this) {
            self::Active => 'Hoạt động',
            self::Inactive => 'Không hoạt động',
        };
    }

    /** @return array<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
```

### Controller

Each entity in a sub-module gets its own Controller named `{EntityName}Controller` (NOT `{SubModule}Controller`).

Use API Resources for all responses. Return typed resource classes — never raw `JsonResponse` for data responses.

```php
namespace App\Modules\{Module}\{SubModule}\Controllers;

use App\Common\Controllers\BaseController;
use App\Modules\{Module}\{SubModule}\Contracts\{ModelName}ServiceInterface;
use App\Modules\{Module}\{SubModule}\Requests\{Create,List,Update}{ModelName}Request;
use App\Modules\{Module}\{SubModule}\Resources\{ModelName}Resource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

/**
 * @tags {TagName}
 */
class {ModelName}Controller extends BaseController
{
    public function __construct(
        protected {ModelName}ServiceInterface $service,
    ) {}

    /**
     * List all {entity-plural}.
     */
    public function index(List{ModelName}Request $request): AnonymousResourceCollection
    {
        $paginator = $this->service->list($request->validated());

        return {ModelName}Resource::collection($paginator);
    }

    /**
     * Get a {entity} by ID.
     */
    public function show(int $id): {ModelName}Resource
    {
        return new {ModelName}Resource($this->service->findById($id));
    }

    /**
     * Create a new {entity}.
     */
    public function store(Create{ModelName}Request $request): JsonResponse
    {
        return (new {ModelName}Resource($this->service->create($request->validated())))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * Update an existing {entity}.
     */
    public function update(Update{ModelName}Request $request, int $id): {ModelName}Resource
    {
        return new {ModelName}Resource($this->service->update($id, $request->validated()));
    }

    /**
     * Delete a {entity}.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->service->delete($id);

        return response()->json(['message' => 'Deleted successfully']);
    }
}
```

### ServiceInterface (Contract)

Each entity gets its own ServiceInterface in `Contracts/{ModelName}ServiceInterface.php`. Controllers inject the interface, not the concrete service.

```php
namespace App\Modules\{Module}\{SubModule}\Contracts;

use App\Modules\{Module}\{SubModule}\Models\{ModelName};
use Illuminate\Pagination\LengthAwarePaginator;

interface {ModelName}ServiceInterface
{
    /**
     * @param  array<string, mixed>  $filters
     */
    public function list(array $filters): LengthAwarePaginator;

    public function findById(int $id): {ModelName};

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): {ModelName};

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data): {ModelName};

    public function delete(int $id): void;
}
```

### Service

Each entity gets its own Service named `{ModelName}Service`.

`findById()` delegates directly to repository — NO null check needed. `ModelNotFoundException` is handled globally by `bootstrap/app.php`.

```php
namespace App\Modules\{Module}\{SubModule}\Services;

use App\Common\Services\BaseService;
use App\Modules\{Module}\{SubModule}\Contracts\{ModelName}ServiceInterface;
use App\Modules\{Module}\{SubModule}\Models\{ModelName};
use App\Modules\{Module}\{SubModule}\Repositories\{ModelName}Repository;
use Illuminate\Pagination\LengthAwarePaginator;

class {ModelName}Service extends BaseService implements {ModelName}ServiceInterface
{
    public function __construct(protected {ModelName}Repository $repository) {}

    public function list(array $filters): LengthAwarePaginator
    {
        return $this->repository->list($filters);
    }

    public function findById(int $id): {ModelName}
    {
        /** @var {ModelName} */
        return $this->repository->findById($id);
    }

    public function create(array $data): {ModelName}
    {
        return $this->executeInTransaction(function () use ($data): {ModelName} {
            /** @var {ModelName} */
            return $this->repository->create($data);
        });
    }

    public function update(int $id, array $data): {ModelName}
    {
        return $this->executeInTransaction(function () use ($id, $data): {ModelName} {
            ${modelVar} = $this->findById($id);
            ${modelVar}->update($data);

            return ${modelVar}->refresh();
        });
    }

    public function delete(int $id): void
    {
        $this->executeInTransaction(function () use ($id): void {
            ${modelVar} = $this->findById($id);
            ${modelVar}->delete();
        });
    }
}
```

BaseService provides: `executeInTransaction()` — re-throws `ModelNotFoundException` and `BusinessException`, wraps other exceptions.

### Repository

`findById()` uses `findOrFail()`. Use `applySorting()` and `getPerPage()` for list queries (no manual sort/pagination code).

Override `findById()` only when eager loading is needed.

```php
class {ModelName}Repository extends BaseRepository
{
    public function __construct() { parent::__construct(new {ModelName}); }

    public function list(array $filters): LengthAwarePaginator
    {
        $query = $this->newQuery();
        // ... search/filter logic ...
        $this->applySorting($query, $filters);
        return $query->paginate($this->getPerPage($filters));
    }
}
```

BaseRepository provides: `findById()` (findOrFail), `findAll()`, `create()`, `update()`, `delete()`, `paginate()`, `newQuery()`, `applySorting()`, `getPerPage()`

### Resource

Extends `BaseResource` (which injects `success: true` into all responses automatically).

```php
namespace App\Modules\{Module}\{SubModule}\Resources;

use App\Common\Resources\BaseResource;
use App\Modules\{Module}\{SubModule}\Models\{ModelName};
use Illuminate\Http\Request;

/**
 * @mixin {ModelName}
 */
class {ModelName}Resource extends BaseResource
{
    /**
     * @return array{
     *     id: int,
     *     name: string,
     *     is_active: bool,
     *     sort_order: int,
     *     status: array{value: string, label: string},
     *     created_at: string|null,
     * }
     */
    public function toArray(Request $request): array
    {
        return [
            /** @var int */
            'id' => $this->id,
            'name' => $this->name,
            /** @var bool */
            'is_active' => $this->is_active,
            /** @var int */
            'sort_order' => $this->sort_order,
            // Enum fields: 'status' => ['value' => $this->status->value, 'label' => $this->status->label()],
        ];
    }
}
```

Rules for `@return` array shape:
- List ALL fields returned by `toArray()`
- Enum fields use `array{value: string, label: string}`
- Nullable fields use `type|null`
- Relation fields use `array{...}|null` with nested shape
- Collection relations use `list<array{...}>`

#### CRITICAL — Inline `@var` on every non-string scalar field

**Problem**: Scramble's OpenAPI generation does NOT read the method-level `@return array{...}` shape for per-field types. It infers types from `$this->{property}` at runtime. With PostgreSQL, `bigIncrements`, `integer`, `boolean`, and `tinyint` columns are all returned as `string` by PDO, so Scramble renders `id`, `sort_order`, `counts_for_ticket`, etc. as `"type": "string"` in `/docs/api` even though the method-level shape says otherwise. Even with Eloquent `casts()` declared, the inline `@var` is what Scramble honours.

**Fix**: Add an inline `/** @var {type} */` comment **above every array value** that is NOT a PHP string at the model layer.

| Model column / cast | Inline comment required |
|---------------------|--------------------------|
| `id`, foreign keys (`*_id`) | `/** @var int */` (or `/** @var int|null */` if nullable) |
| `boolean` cast | `/** @var bool */` |
| `integer` cast | `/** @var int */` |
| `decimal:*` cast | `/** @var string */` (Eloquent returns decimal as string) — no comment needed |
| plain string column | no comment needed |
| Enum cast → rendered as `['value' => ..., 'label' => ...]` | the inline array literal already types itself |
| `whenLoaded('relation', fn () => [...])` | `/** @var array{id: int, name: string}|null */` |

**Verification step (MANDATORY after creating/editing a Resource):**

```bash
docker exec residential_app php artisan scramble:export --path=/tmp/api.json
docker exec residential_app bash -c "php -r \"\\\$d=json_decode(file_get_contents('/tmp/api.json'),true); echo json_encode(\\\$d['components']['schemas']['{ModelName}Resource'] ?? [], JSON_PRETTY_PRINT);\""
```

Every field must render with the correct JSON Schema type. If any field shows `"type": "string"` when it should be `integer`/`boolean`/etc., add the inline `@var` and re-export.

### FormRequests

- `List{ModelName}Request` — search, filter (use `Rule::in(Enum::values())`), sort, paginate
- `Create{ModelName}Request` — validation rules + Vietnamese `messages()`
- `Update{ModelName}Request` — `sometimes` for partial updates + Vietnamese `messages()`

All extend `BaseFormRequest`.

### Routes (module-level shared)

Use `Route::apiResource()` with `parameters()` to keep `{id}` as route parameter:

```php
Route::apiResource('{entity-plural}', {ModelName}Controller::class)->parameters(['{entity-plural}' => 'id']);
```

### Migration

```bash
docker exec residential_app php artisan make:migration create_{table}_table --no-interaction
mv database/migrations/*_create_{table}_table.php app/Modules/{Module}/database/migrations/
```

Rules: `created_by`/`updated_by`/`deleted_by`, `softDeletes()`, no cross-module foreign keys (use `string` columns).

### Factory

Factory in `database/factories/Tenant/` (for tenant models) or `database/factories/Platform/` (for central models).

- One factory per Model: `{ModelName}Factory.php`
- Add factory states for each enum status (e.g., `->confirmed()`, `->cancelled()`)
- Reference parent factory with `ParentModel::factory()` in FK fields

### Seeder (REQUIRED)

Seeder in `database/seeders/Tenant/` (for tenant models).

**Every sub-module MUST have its own Seeder** file with realistic sample data.

**Rules:**
1. One seeder per sub-module: `{SubModule}Seeder.php` (e.g., `OrderSeeder.php`)
2. Seeder MUST be **idempotent** — skip if data already exists (`if (Model::query()->exists()) return;`)
3. Seeder MUST be **self-contained** — create all prerequisite data within the seeder itself. Do NOT depend on other seeders having run first. Example: OrderSeeder creates Ticket → OgTicket → Quote → Order in one file.
4. Auto-detect next code sequence to avoid unique constraint violations:
   ```php
   $lastCode = Model::withTrashed()->where('code', 'like', "PREFIX-{$today}-%")->orderByDesc('code')->value('code');
   $seq = $lastCode ? (int) substr($lastCode, -3) + 1 : 1;
   ```
5. Use `/** @var ModelName */` type hints before `::query()->create()` for IDE support
6. Create multiple scenarios with different statuses to exercise the full lifecycle
7. Register in `database/seeders/Tenant/PMCDatabaseSeeder.php` — add to `$this->call([...])` after all dependency seeders

**Run seeder:**
```bash
docker exec residential_app php artisan tenants:seed --tenants=tnp --class="Database\\Seeders\\Tenant\\{SubModule}Seeder" --no-interaction
```

### API Documentation (Scramble)

This project uses **Scramble** (`dedoc/scramble`) for auto-generating OpenAPI docs from code. Every module MUST have proper annotations for API docs to be generated correctly.

#### Controller: `@tags` + method descriptions

Add `@tags` PHPDoc on the Controller class to group endpoints in the API docs. Add a short description on each method.

```php
/**
 * @tags {TagName}
 */
class {ModelName}Controller extends BaseController
{
    /**
     * List all {entity-plural}.
     */
    public function index(List{ModelName}Request $request): AnonymousResourceCollection { ... }

    /**
     * Get a {entity} by ID.
     */
    public function show(int $id): {ModelName}Resource { ... }

    /**
     * Create a new {entity}.
     */
    public function store(Create{ModelName}Request $request): JsonResponse { ... }

    /**
     * Update an existing {entity}.
     */
    public function update(Update{ModelName}Request $request, int $id): {ModelName}Resource { ... }

    /**
     * Delete a {entity}.
     */
    public function destroy(int $id): JsonResponse { ... }
}
```

#### Resource: `@return array{...}` shape

The Resource's `toArray()` method MUST have a `@return` PHPDoc with array shape so Scramble can infer the response schema.

#### Verification

After creating the module, verify API docs render correctly:
```bash
docker exec residential_app php artisan scramble:export
```

Docs are available at `/docs/api`.

### Permissions

When adding a new sub-module that has its own controller with permission middleware, MUST register its permissions:

1. Add a new case to `App\Modules\PMC\Account\Enums\PermissionSubModule`:
   ```php
   case Orders = 'orders';
   ```
2. Add its label in the `label()` method.
3. The `PermissionSeeder` auto-generates `{subModule}.view`, `{subModule}.store`, `{subModule}.update`, `{subModule}.destroy` from the enum.
4. After adding, run: `docker exec residential_app php artisan db:seed --class="Database\Seeders\Tenant\PermissionSeeder" --no-interaction`

### Feature Tests (REQUIRED)

Every module MUST have feature tests. Tests live in `app/Modules/{Module}/tests/{SubModule}Test.php`.

**Test file structure:**

```php
namespace Tests\Modules\{Module};

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class {SubModule}Test extends TestCase
{
    use RefreshDatabase;

    private string $baseUrl = '/api/v1/{module-prefix}/{entity-plural}';

    protected function setUp(): void
    {
        parent::setUp();
        $this->actingAsAdmin();
    }

    // Helper methods for building test data
    // Tests grouped by: LIST, SHOW, CREATE, UPDATE, TRANSITION, DELETE, CHECK DELETE, VALIDATION
}
```

**Auth helpers** (from `Tests\TestCase`):
- `$this->actingAsAdmin()` — all permissions
- `$this->actingAsUser()` — no permissions
- `$this->actingAsUserWithPermissions(['orders.view', 'orders.store'])` — specific permissions

**Required test coverage:**

| Section | What to test |
|---------|-------------|
| **LIST** | Basic list, filter by status, search by code/name, pagination |
| **SHOW** | Detail with relations, 404 for nonexistent |
| **CREATE** | Happy path, validation errors (missing fields, empty arrays), business rule violations |
| **UPDATE** | Happy path, recalculate totals, replace lines, status restrictions |
| **TRANSITION** | Each valid transition, OgTicket side effects, invalid transitions, final status blocking |
| **DELETE** | Draft delete, status restriction, side effects (OgTicket status rollback) |
| **CHECK DELETE** | Can delete (draft), cannot delete (non-draft) |

**Assertion patterns:**
```php
// HTTP status + JSON path
$response->assertStatus(200)->assertJsonPath('data.status.value', 'draft');
$response->assertStatus(201)->assertJsonCount(2, 'data.lines');
$response->assertStatus(422)->assertJsonValidationErrors(['quote_id']);

// Database
$this->assertDatabaseHas('orders', ['id' => $order->id, 'status' => 'confirmed']);
$this->assertSoftDeleted('orders', ['id' => $order->id]);
```

**Running tests:**
```bash
docker exec residential_app php artisan test --compact --filter={SubModule}Test
```

## Creation Order

1. ServiceProvider + routes
2. Enums
3. Model (with factory reference)
4. Repository
5. ServiceInterface (Contract)
6. Service (implements ServiceInterface)
7. Resource (extends BaseResource, with `@return array{...}` shape AND inline `/** @var {type} */` comments on every non-string scalar — see Resource section for why)
8. FormRequests (List, Create, Update)
9. Controller (with `@tags` + method descriptions for API docs)
10. Register ServiceInterface bindings in ServiceProvider
11. Permissions (add to `PermissionSubModule` enum if new sub-module has controller middleware)
12. Migration (artisan + move)
13. Factory (with states per enum status)
14. **Seeder** (`database/seeders/Tenant/{SubModule}Seeder.php`) — self-contained, idempotent, creates full prerequisite chain
15. Register Seeder in `PMCDatabaseSeeder`
16. ExternalService interfaces (if cross-module needs exist)
17. Run migration + pint
18. **Run seeder**: `docker exec residential_app php artisan tenants:seed --tenants=tnp --class="Database\\Seeders\\Tenant\\{SubModule}Seeder" --no-interaction`
19. Verify API docs: `docker exec residential_app php artisan scramble:export --path=/tmp/api.json`, then inspect `{ModelName}Resource` schema — every `int`/`bool` field MUST render as `"integer"`/`"boolean"`, not `"string"`. If any non-string field shows as `string`, the Resource is missing its inline `/** @var {type} */` comment.
20. **Write feature tests** (`app/Modules/{Module}/tests/{SubModule}Test.php`)
21. **Run tests**: `docker exec residential_app php artisan test --compact --filter={SubModule}Test`

## Checklist

- [ ] Scanned existing modules, asked user about placement
- [ ] PSR-4 mappings + `composer dump-autoload`
- [ ] ServiceProvider auto-discovered, migration path correct
- [ ] Routes with correct prefix
- [ ] Model extends BaseModel, Auditable, newFactory()
- [ ] Enums with `label()` + `values()`
- [ ] Controller extends BaseController, injects ServiceInterface only (no Presenter)
- [ ] Controller returns typed Resources (`AnonymousResourceCollection`, `{ModelName}Resource`, `JsonResponse`)
- [ ] ServiceInterface in `Contracts/` with `list`, `findById`, `create`, `update`, `delete`
- [ ] Service extends BaseService, implements ServiceInterface, `findById()` delegates to repository (no null check)
- [ ] Controller injects ServiceInterface, not concrete Service
- [ ] ServiceInterface bound to Service in ServiceProvider `register()`
- [ ] Repository extends BaseRepository, `list()` uses `applySorting()` + `getPerPage()`
- [ ] Resource extends BaseResource, enum `value` + `label` format, `@return array{...}` shape
- [ ] Resource has inline `/** @var int */`, `/** @var bool */`, `/** @var int|null */`, etc. on **every non-string scalar field** (otherwise Scramble renders them as `"string"` because Postgres PDO returns integers as strings and Scramble ignores `@return array{...}`)
- [ ] Scramble schema for `{ModelName}Resource` verified: `id`, FK ids, booleans, integers all render with correct JSON Schema type (not `"string"`)
- [ ] Controller has `@tags` PHPDoc + method-level descriptions
- [ ] FormRequests extend BaseFormRequest, Vietnamese messages
- [ ] Permissions registered in `PermissionSubModule` enum (if controller uses permission middleware)
- [ ] Migration has created_by, updated_by, deleted_by, softDeletes(), indexes
- [ ] Factory with states per enum status
- [ ] Seeder: self-contained (creates full prerequisite chain), idempotent, auto-detect code sequence
- [ ] Seeder registered in `PMCDatabaseSeeder`
- [ ] Seeder runs successfully on at least one tenant
- [ ] No cross-module foreign keys
- [ ] ExternalService interfaces for cross-module communication
- [ ] API docs verified: `docker exec residential_app php artisan scramble:export`
- [ ] `vendor/bin/pint --dirty --format agent` passes
- [ ] Feature tests written in `app/Modules/{Module}/tests/{SubModule}Test.php`
- [ ] Tests cover: LIST, SHOW, CREATE, UPDATE, TRANSITION (if applicable), DELETE, CHECK DELETE, VALIDATION
- [ ] All tests pass: `docker exec residential_app php artisan test --compact --filter={SubModule}Test`
