# Multi-Tenant Migration Plan

> Chuyển từ Row-Level Tenancy (MySQL + organization_id) sang Schema-Based Tenancy (PostgreSQL + stancl/tenancy + subdomain)

## Quyết định kiến trúc

| Hạng mục | Hiện tại | Mới |
|----------|----------|-----|
| Database | MySQL 8.4, single DB | PostgreSQL 16, schema per tenant |
| Tenancy | `organization_id` + global scope | `stancl/tenancy` + PostgreSQL schema |
| Tenant ID | `organizations.id` (int) | `tenants.id` = org `code` (string) |
| Routing | Path-based (`/pmc/`) | Subdomain (`{code}.app.example.com`) |
| Requester module | Central (no org_id) | Rename → **Platform** module (superadmin) |
| Platform tenant | N/A | Platform cũng là 1 tenant (`is_platform=true`), dùng PMC features + admin |
| Permissions | Global shared | Copy per tenant schema |

## Kiến trúc Module mới

```
backend/app/Modules/
├── Platform/              ← Rename từ Requester. Central/admin features (public schema)
│   ├── Tenant/            # Organization/Tenant model, CRUD tenants, domain management
│   ├── Ticket/            # Tickets công khai (central tables)
│   ├── Auth/              # Requester/public accounts (central tables)
│   └── Providers/
│       └── PlatformServiceProvider.php
│
└── PMC/                   ← Business features (tenant schema, TẤT CẢ tenants dùng kể cả Platform)
    ├── Department/
    ├── JobTitle/
    ├── Project/
    ├── Account/ + Auth
    ├── OgTicket/
    └── Role/
```

**Phân biệt tenant:**
- `is_platform = true` → Access Platform routes (admin) + PMC routes (business)
- `is_platform = false` → Chỉ access PMC routes (business)

## Phân loại Tables

### Central (public schema) — Platform module sở hữu

- `tenants` — thay thế `organizations` (stancl/tenancy + `is_platform` flag)
- `domains` — subdomain mapping (stancl/tenancy)
- `tickets` — Platform module (Ticket sub-module)
- `requester_accounts` — Platform module (Auth sub-module)
- `personal_access_tokens` — Sanctum (thêm `tenant_id`)
- `password_reset_tokens`, `sessions`, `cache`, `jobs`, `failed_jobs`, `telescope_entries`

### Tenant (per-schema, ví dụ `tenant_acme`) — PMC module sở hữu

- `departments` — bỏ `organization_id`
- `job_titles` — bỏ `organization_id`
- `projects` — bỏ `organization_id`
- `roles` — bỏ `organization_id`
- `accounts` — bỏ `organization_id`
- `account_project` — pivot, giữ nguyên
- `permissions` — copy per tenant
- `permission_role` — pivot, giữ nguyên
- `og_tickets` — bỏ `organization_id`, giữ `ticket_id` (cross-schema ref)

---

## Checklist

### Phase 0: Rename Requester → Platform module

- [ ] **0.1** Rename directory: `backend/app/Modules/Requester/` → `backend/app/Modules/Platform/`
- [ ] **0.2** Update namespace: `App\Modules\Requester\*` → `App\Modules\Platform\*` (all files)
- [ ] **0.3** Rename provider: `RequesterServiceProvider` → `PlatformServiceProvider`
- [ ] **0.4** Update `backend/bootstrap/providers.php` — reference new provider class
- [ ] **0.5** Move Organization từ PMC → Platform module:
  - [ ] `PMC/src/Organization/` → `Platform/src/Tenant/` (rename sub-module)
  - [ ] `PMC/Database/Factories/OrganizationFactory.php` → `Platform/Database/Factories/`
  - [ ] Bỏ `PMC/database/migrations/create_organizations_table.php` (sẽ thay bằng `create_tenants_table`)
- [ ] **0.6** Update all imports/references across codebase:
  - [ ] ExternalServices (OrganizationExternalService, etc.)
  - [ ] Config: `config/auth.php` requester guard model namespace
  - [ ] Tests referencing Requester namespace
- [ ] **0.7** Rename frontend routes/composables:
  - [ ] `frontend/app/pages/requester/` → `frontend/app/pages/platform/`
  - [ ] `frontend/app/composables/api/useTickets.ts` → update API paths
  - [ ] `frontend/app/composables/useRequesterAuth.ts` → `usePlatformAuth.ts`
  - [ ] `frontend/app/middleware/auth.global.ts` — update requester route detection
  - [ ] `frontend/app/layouts/requester.vue` → `platform.vue`
- [ ] **0.8** Verify: `php artisan test --compact` all pass sau rename

---

### Phase 1: Infrastructure — MySQL → PostgreSQL + Docker

- [ ] **1.1** Update `compose.yml`: thay MySQL service → PostgreSQL 16 service
  - Port: `54322:5432`
  - Volume: `postgres_data`
  - Env: `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`
- [ ] **1.2** Update `backend/Dockerfile`: thay `pdo_mysql` → `pdo_pgsql` + `pgsql`, install `libpq-dev`
- [ ] **1.3** Update `backend/.env` + `.env.example`:
  - `DB_CONNECTION=pgsql`, `DB_PORT=5432`
- [ ] **1.4** Update `backend/config/database.php`:
  - Thêm connection `central` (luôn trỏ `search_path = 'public'`)
  - Connection `pgsql` giữ nguyên (stancl/tenancy sẽ switch `search_path` dynamically)
- [ ] **1.5** Fix MySQL-specific code — đổi `LIKE` → `ILIKE` trong tất cả `scopeSearch()`:
  - [ ] `Organization` model
  - [ ] `Department` model
  - [ ] `Project` model
  - [ ] `JobTitle` model
  - [ ] `Account` model
  - [ ] `OgTicket` model
  - [ ] `Ticket` model
  - [ ] `Role` model
- [ ] **1.6** Update Nginx config: wildcard subdomain `server_name ~^(.+\.)?localhost$`
- [ ] **1.7** Verify: `docker compose up -d` thành công, PostgreSQL accessible

---

### Phase 2: Install & Configure stancl/tenancy

- [ ] **2.1** `composer require stancl/tenancy`
- [ ] **2.2** `php artisan tenancy:install` — publish config + migrations
- [ ] **2.3** Configure `config/tenancy.php`:
  - [ ] `tenant_model` → `App\Modules\Platform\Tenant\Models\Organization::class`
  - [ ] `database.managers.pgsql` → `PostgreSQLSchemaManager::class`
  - [ ] `database.central_connection` → `'central'`
  - [ ] `database.prefix` → `'tenant_'`
- [ ] **2.4** Transform `Organization` model (giờ ở `Platform/src/Tenant/Models/`):
  - [ ] Extend `Stancl\Tenancy\Database\Models\Tenant`
  - [ ] Implement `TenantWithDatabase`
  - [ ] Use `HasDatabase`, `HasDomains`, `SoftDeletes` traits
  - [ ] `$table = 'tenants'`
  - [ ] Define `getCustomColumns()`: `['id', 'name', 'is_platform', 'is_active', ...]`
  - [ ] Giữ existing scopes (`active()`, `search()`)
  - [ ] Thêm scope `platform()` — filter `is_platform = true`
- [ ] **2.5** Create `backend/app/Providers/TenancyServiceProvider.php`:
  - [ ] Configure tenant events (create schema, migrate, seed permissions)
  - [ ] Define central domains
  - [ ] Register `InitializeTenancyBySubdomain` middleware
- [ ] **2.6** Register provider trong `backend/bootstrap/providers.php`
- [ ] **2.7** Register middleware alias `tenant` trong `backend/bootstrap/app.php`
- [ ] **2.8** Create `PlatformMiddleware` — check `tenant()->is_platform === true`
- [ ] **2.9** Verify: `php artisan tenancy:install` không lỗi

---

### Phase 3: Split Migrations (Central vs Tenant)

- [ ] **3.1** Central migrations (`backend/database/migrations/`):
  - [ ] `create_tenants_table` — customize: `name`, `is_platform`, `is_active`, `soft_deletes`, `data` (json)
  - [ ] `create_domains_table` — stancl default
  - [ ] `create_personal_access_tokens_table` — thêm `tenant_id` (string, nullable, indexed)
  - [ ] `create_tickets_table` — `claimed_by_org_id` đổi từ `unsignedBigInteger` → `string`
  - [ ] `create_requester_accounts_table`
  - [ ] Giữ nguyên: `create_cache_table`, `create_jobs_table`, `create_telescope_entries_table`
  - [ ] Extract `create_password_reset_tokens_table` + `create_sessions_table`
- [ ] **3.2** Tenant migrations (`backend/database/migrations/tenant/`):
  - [ ] `create_departments_table` — bỏ `organization_id` FK, `unique('code')`
  - [ ] `create_job_titles_table` — bỏ `organization_id` FK, simplify unique
  - [ ] `create_projects_table` — bỏ `organization_id` FK, simplify unique
  - [ ] `create_roles_table` — bỏ `organization_id` FK, simplify unique constraints
  - [ ] `create_accounts_table` — bỏ `organization_id` FK, `unique('email')`
  - [ ] `create_account_project_table` — giữ nguyên structure
  - [ ] `create_permissions_table` — giữ nguyên (per-tenant copy)
  - [ ] `create_permission_role_table` — giữ nguyên
  - [ ] `create_og_tickets_table` — bỏ `organization_id` FK, giữ `ticket_id`
- [ ] **3.3** Update `PMCServiceProvider` — bỏ `$this->loadMigrationsFrom()`
- [ ] **3.4** Update `PlatformServiceProvider` — bỏ `$this->loadMigrationsFrom()`
- [ ] **3.5** Verify: `php artisan migrate` chạy central migrations thành công

---

### Phase 4: Update Models & Traits

- [ ] **4.1** Remove `BelongsToOrganization` trait (`backend/app/Common/Traits/BelongsToOrganization.php`)
- [ ] **4.2** Update tenant models — bỏ `use BelongsToOrganization`, bỏ `organization_id` khỏi `$fillable`:
  - [ ] `Department` model
  - [ ] `JobTitle` model
  - [ ] `Project` model
  - [ ] `Role` model
  - [ ] `Account` model
  - [ ] `OgTicket` model
- [ ] **4.3** Update central models — thêm `protected $connection = 'central'`:
  - [ ] `Ticket` model
  - [ ] `RequesterAccount` model (giờ ở Platform module)
- [ ] **4.4** Create `CustomPersonalAccessToken` model:
  - [ ] `$connection = 'central'`
  - [ ] Auto-set `tenant_id` on creating event
  - [ ] Register via `Sanctum::usePersonalAccessTokenModel()` trong `AppServiceProvider`
- [ ] **4.5** Update `Account` model — thêm helper `getTenant()` dùng `tenant()` helper
- [ ] **4.6** Verify: Models compile không lỗi, relationships intact

---

### Phase 5: Update Auth Flow (Subdomain-Based)

- [ ] **5.1** Update `AuthService::login()`:
  - [ ] Bỏ organization_code lookup
  - [ ] Query `Account::where('email', $email)` trực tiếp (schema-scoped)
  - [ ] Bỏ `withoutGlobalScopes()` calls
- [ ] **5.2** Update `LoginRequest` — bỏ `organization_code` validation
- [ ] **5.3** Update PMC routes — thêm `tenant` middleware:
  - [ ] `PMCServiceProvider::loadRoutes()` — `'tenant'` middleware cho auth + api routes
- [ ] **5.4** Update Platform routes:
  - [ ] Admin routes: `tenant` + `platform` middleware (check `is_platform`)
  - [ ] Public/requester routes: KHÔNG cần tenant middleware
- [ ] **5.5** Test: Login vào tenant subdomain → nhận token → access PMC endpoints
- [ ] **5.6** Test: Login vào platform subdomain → access admin + PMC endpoints

---

### Phase 6: Update ExternalServices (Cross-Schema)

- [ ] **6.1** `OgTicketExternalService` (Platform → PMC, central → tenant):
  - [ ] `createFromTicket()`: dùng `tenancy()->initialize($tenant)` + `tenancy()->end()`
  - [ ] `getProcessingInfoByTicketId()`: lookup `claimed_by_org_id` → initialize tenant → query OgTicket
- [ ] **6.2** `TicketExternalService` (PMC → Platform, tenant → central):
  - [ ] Ticket model đã có `$connection = 'central'` — hoạt động tự nhiên
  - [ ] `claimTicket()`: dùng `tenant()->getTenantKey()` thay `Auth::user()->organization_id`
  - [ ] `releaseTicket()`, `updateTicketStatus()`: verify dùng central connection
- [ ] **6.3** `ProjectExternalService` (Platform → PMC):
  - [ ] `listProjects()`: loop qua tất cả active tenants, query projects per schema
  - [ ] Consider central `project_registry` table nếu optimize sau
- [ ] **6.4** `OrganizationExternalService`:
  - [ ] Có thể loại bỏ nếu Platform module access Organization trực tiếp
  - [ ] Hoặc giữ lại, query central `tenants` table
  - [ ] Update interface: `int $id` → `string $id`
- [ ] **6.5** Update `OgTicketService::claim()`:
  - [ ] `tenant()->getTenantKey()` thay `Auth::user()->organization_id`
- [ ] **6.6** Verify: Claim ticket → OgTicket created trong tenant schema

---

### Phase 7: Update Frontend (Subdomain Routing)

- [ ] **7.1** Update `nuxt.config.ts`:
  - [ ] Thêm `baseDomain` vào `runtimeConfig.public`
  - [ ] Thêm `apiPort` vào `runtimeConfig.public`
- [ ] **7.2** Update `useApi.ts`:
  - [ ] Dynamic `baseURL` dựa trên `window.location.hostname` (giữ subdomain khi gọi API)
- [ ] **7.3** Update `login.vue`:
  - [ ] Tenant subdomain → ẩn org_code field, login trực tiếp
  - [ ] Central domain → giữ org_code field → sau login redirect sang `{code}.{baseDomain}`
- [ ] **7.4** Update `auth.global.ts`:
  - [ ] Detect tenant subdomain
  - [ ] Enforce PMC auth trên tenant domains
  - [ ] Platform subdomain: cho phép admin + PMC routes
- [ ] **7.5** Update `useAuth.ts` (giờ là `usePlatformAuth.ts` cho platform):
  - [ ] Derive organization từ subdomain thay vì localStorage
- [ ] **7.6** Update `useAuthentication.ts`:
  - [ ] Bỏ `organization_code` khỏi login payload khi ở tenant subdomain
- [ ] **7.7** Platform admin pages:
  - [ ] Trang quản lý tenants (CRUD organizations)
  - [ ] Chỉ hiển thị trên platform subdomain
- [ ] **7.8** Verify: Login trên `acme.localhost:3000` → PMC dashboard, `platform.localhost:3000` → admin + PMC

---

### Phase 8: Data Migration Script

- [ ] **8.1** Create Artisan command `MigrateFromMysqlToPostgres`:
  - [ ] Configure dual connections (MySQL source + PostgreSQL target)
  - [ ] Migrate central tables (preserve original IDs):
    - [ ] `requester_accounts`
    - [ ] `tickets` (`claimed_by_org_id` → string)
    - [ ] `personal_access_tokens` (thêm `tenant_id`)
    - [ ] Framework tables
  - [ ] For each organization:
    - [ ] Create tenant record (`id` = org `code`, `name` = org `name`, `is_platform` = false)
    - [ ] Create domain record (`{code}.{baseDomain}`)
    - [ ] Run `tenants:migrate` (tạo schema + tables)
    - [ ] Maintain old→new ID mapping per table
    - [ ] Migrate data theo thứ tự FK:
      - [ ] `departments` (handle self-referencing `parent_id`)
      - [ ] `job_titles`
      - [ ] `projects`
      - [ ] `roles`
      - [ ] `permissions` (seed fresh)
      - [ ] `permission_role` (remap IDs)
      - [ ] `accounts` (remap department_id, job_title_id, role_id)
      - [ ] `account_project` (remap account_id, project_id)
      - [ ] `og_tickets` (remap project_id, received_by_id, assigned_to_id; keep ticket_id)
    - [ ] Reset PostgreSQL sequences (`setval`)
    - [ ] `tenancy()->end()`
  - [ ] Create platform tenant (`is_platform = true`) với domain `platform.{baseDomain}`
- [ ] **8.2** Verify: so sánh row counts MySQL vs PostgreSQL per organization
- [ ] **8.3** Verify: cross-schema references (og_tickets.ticket_id → tickets.id) valid

---

### Phase 9: Update Tests

- [ ] **9.1** Update `phpunit.xml`:
  - [ ] `DB_CONNECTION=pgsql`
  - [ ] `DB_DATABASE=residential_test`
- [ ] **9.2** Update `TestCase.php`:
  - [ ] Thêm `setUpTenant()`: tạo tenant → create domain → run tenant migrations → initialize tenancy
  - [ ] Update `actingAsAdmin()`: setup tenant context trước khi tạo Account
  - [ ] Thêm `tearDown()`: `tenancy()->end()` + cleanup
- [ ] **9.3** Update all factories — bỏ `organization_id`:
  - [ ] `OrganizationFactory` → adapt cho tenant model (string ID, `is_platform`)
  - [ ] `DepartmentFactory`
  - [ ] `JobTitleFactory`
  - [ ] `ProjectFactory`
  - [ ] `RoleFactory`
  - [ ] `AccountFactory`
  - [ ] `OgTicketFactory`
- [ ] **9.4** Update test files:
  - [ ] `AuthTest` — bỏ `organization_code`, test subdomain-based auth
  - [ ] `DepartmentTest`
  - [ ] `JobTitleTest`
  - [ ] `ProjectTest`
  - [ ] `AccountTest`
  - [ ] `RoleTest`
  - [ ] `PermissionTest`
  - [ ] `OgTicketTest` — test cross-schema ticket claiming
  - [ ] `TicketTest` — test central table operations
- [ ] **9.5** Rename test namespaces: Requester → Platform
- [ ] **9.6** Verify: `php artisan test --compact` all pass

---

### Phase 10: Deployment & Go-Live

- [ ] **10.1** Local dev setup:
  - [ ] `/etc/hosts` entries cho test subdomains (`acme.localhost`, `platform.localhost`)
  - [ ] Hoặc setup `dnsmasq` cho wildcard `*.localhost`
- [ ] **10.2** Production DNS: wildcard `*.app.example.com` → server IP
- [ ] **10.3** Deployment steps:
  - [ ] Full MySQL backup
  - [ ] Deploy PostgreSQL container (chạy song song MySQL)
  - [ ] Deploy new code
  - [ ] Run `php artisan tenancy:migrate-from-mysql`
  - [ ] Verify data integrity (row counts, checksums)
  - [ ] Switch `.env` → PostgreSQL
  - [ ] Smoke test all endpoints
  - [ ] Invalidate old Sanctum tokens (users re-login)
  - [ ] Decommission MySQL sau verification period
- [ ] **10.4** Rollback plan:
  - [ ] Giữ MySQL running trong transition period
  - [ ] Nếu lỗi: revert `.env` về MySQL + deploy old code branch
