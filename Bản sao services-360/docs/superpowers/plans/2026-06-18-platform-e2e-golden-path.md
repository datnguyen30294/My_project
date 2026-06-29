# Platform E2E Golden-Path Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Một test Playwright "golden-path" chứng minh luồng platform console: tạo tenant (UI) → tạo vendor (UI, auto-provision resi_mart) → tạo offer + đơn (API resi_mart) → báo cáo phản ánh đúng (UI), kèm hạ tầng E2E platform tái dùng.

**Architecture:** Playwright chạy trên host, drive **UI platform console residential** (target validate) tại domain central `residential.test:3000`; drive **resi_mart qua HTTP API** tại subdomain `{slug}.localhost:8004` (nguồn dữ liệu thật, cross-DB). Các bước "arrange" phía residential khó làm qua API (seed project trong schema tenant mới, tạo commission contract active) được thực hiện bằng artisan command gọi qua `docker exec` từ test. Teardown cross-DB drop schema cả 2 phía.

**Tech Stack:** Playwright (`@playwright/test`), `hyvor/laravel-playwright` (đã cài), Laravel 12 artisan commands, Stancl/Tenancy (Postgres schema-per-tenant), Sanctum (guard `requester`).

---

## Định danh & hằng số dùng xuyên suốt

| Tên | Giá trị | Ghi chú |
|---|---|---|
| Platform admin | `e2e-platform@test.com` / `password` | `RequesterAccount`, guard `requester` |
| Throwaway tenant (org code) | `e2eplat` | schema residential `tenant_e2eplat` |
| Throwaway vendor (slug) | `e2evendor` | schema resi_mart `tenant_e2evendor`, host `http://e2evendor.localhost:8004` |
| Vendor owner email | `owner@e2evendor.test` | = partner admin login resi_mart, pass `password` |
| Platform base URL (FE) | `http://residential.test:3000` | env `E2E_PLATFORM_BASE_URL` |
| Platform API URL | `http://residential.test:8000/api/v1` | env `E2E_PLATFORM_API_URL` |
| resi_mart host template | `http://{slug}.localhost:8004` | env `E2E_RESIMART_HOST_TPL` |

---

## Task 0: Môi trường & tiền đề (verify, không code)

**Files:** chỉ đọc/sửa env, không code.

- [ ] **Step 1: Xác nhận 2 app chạy & mạng liên thông**

Chạy (host):
```bash
docker ps --format '{{.Names}}' | grep -E 'residential_app|residential_nginx|residential_frontend|resi_mart_nginx|resi_mart_db'
```
Expected: thấy `residential_app`, `residential_nginx`, `residential_frontend`, `resi_mart_nginx`, `resi_mart_db`.

- [ ] **Step 2: Xác nhận residential_app gọi được resi_mart (S2S + DB)**

Chạy:
```bash
docker exec residential_app php artisan tinker --execute="echo config('services.resi_mart.url'); echo PHP_EOL; echo \DB::connection('resi_mart_central')->getPdo() ? 'DB_OK' : 'DB_FAIL';"
```
Expected: in ra URL resi_mart S2S (vd `http://resi_mart_nginx/api/v1` hoặc `http://host.docker.internal:8004/api/v1`) và `DB_OK`. Nếu `DB_FAIL` hoặc URL rỗng → bổ sung env ở Step 3 trước khi tiếp tục.

- [ ] **Step 3: Đảm bảo env E2E của residential**

Trong `.env` của residential (file môi trường mà `residential_app` dùng), đảm bảo có:
```env
# resi_mart S2S (raw token; resi_mart giữ sha256 trong INTERNAL_TOKEN_RESIDENTIAL_HASH)
RESI_MART_INTERNAL_URL=http://resi_mart_nginx/api/v1
RESI_MART_INTERNAL_TOKEN=e2e-internal-token
# resi_mart cross-DB read/teardown
RESIMART_DB_HOST=resi_mart_db
RESIMART_DB_PORT=5432
RESIMART_DB_DATABASE=resi_mart
RESIMART_DB_USERNAME=postgres
RESIMART_DB_PASSWORD=postgres
```
Và phía resi_mart `.env`: `INTERNAL_TOKEN_RESIDENTIAL_HASH=$(echo -n 'e2e-internal-token' | shasum -a 256 | cut -d' ' -f1)`.

Lưu ý: nếu 2 compose khác network, thay host bằng `host.docker.internal` + cổng host tương ứng (`:8004` cho nginx resi_mart, `:5434` cho DB resi_mart). Sau khi sửa env: `docker exec residential_app php artisan config:clear`.

- [ ] **Step 4: Xác nhận domain central của platform console**

Chạy:
```bash
curl -s -o /dev/null -w "%{http_code}" http://residential.test:3000/login
```
Expected: `200`. Mở `http://residential.test:3000/platform/tenants` trên trình duyệt và xác nhận nó hỏi đăng nhập **platform** (không phải tenant). Nếu `residential.test` không resolve, thêm `127.0.0.1 residential.test` vào `/etc/hosts` và set `E2E_PLATFORM_BASE_URL`/`E2E_PLATFORM_API_URL` cho đúng host central thực tế.

- [ ] **Step 5: Xác nhận vendor subdomain resi_mart reachable từ host**

Chạy:
```bash
curl -s -o /dev/null -w "%{http_code}" http://e2evendor.localhost:8004/api/v1/auth/login
```
Expected: `405` hoặc `422` hoặc `404` (server phản hồi — chứng tỏ host route tới app). KHÔNG được `000`/connection refused. `*.localhost` tự resolve về 127.0.0.1, không cần /etc/hosts.

---

## Task 1: Artisan command setup + teardown (residential backend)

**Files:**
- Create: `backend/app/Console/Commands/E2ePlatformSetupCommand.php`
- Create: `backend/app/Console/Commands/E2ePlatformTeardownCommand.php`
- Test: `backend/tests/Feature/E2ePlatformSetupCommandTest.php`

- [ ] **Step 1: Viết failing test cho setup command (seed platform admin)**

Create `backend/tests/Feature/E2ePlatformSetupCommandTest.php`:
```php
<?php

namespace Tests\Feature;

use App\Modules\Platform\Auth\Models\RequesterAccount;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class E2ePlatformSetupCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_setup_seeds_platform_admin_idempotently(): void
    {
        $this->artisan('e2e:platform-setup')->assertSuccessful();
        $this->artisan('e2e:platform-setup')->assertSuccessful();

        $admins = RequesterAccount::where('email', 'e2e-platform@test.com')->get();
        $this->assertCount(1, $admins);
        $this->assertTrue($admins->first()->is_active);
    }
}
```

- [ ] **Step 2: Chạy test để xác nhận fail**

Run: `docker exec residential_app php artisan test --compact --filter=E2ePlatformSetupCommandTest`
Expected: FAIL — `Command "e2e:platform-setup" is not defined.`

- [ ] **Step 3: Viết teardown command (dùng lại bởi setup --fresh)**

Create `backend/app/Console/Commands/E2ePlatformTeardownCommand.php`:
```php
<?php

namespace App\Console\Commands;

use App\Modules\Platform\Tenant\Models\Organization;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Throwable;

class E2ePlatformTeardownCommand extends Command
{
    protected $signature = 'e2e:platform-teardown {orgCode=e2eplat} {vendorSlug=e2evendor}';

    protected $description = 'Remove the throwaway E2E platform tenant + vendor (both residential & resi_mart)';

    public function handle(): int
    {
        if (! in_array(app()->environment(), ['local', 'testing'], true)) {
            $this->error('Only runnable in local/testing.');

            return self::FAILURE;
        }

        $orgCode = (string) $this->argument('orgCode');
        $vendorSlug = (string) $this->argument('vendorSlug');
        $central = config('tenancy.database.central_connection');

        // 1. Residential central cleanup (best-effort each).
        $this->safe(fn () => DB::connection($central)->table('partner_commission_contracts')
            ->whereIn('partner_id', DB::connection($central)->table('partners')->where('slug', $vendorSlug)->pluck('id'))
            ->delete());
        $this->safe(fn () => DB::connection($central)->table('partner_project')
            ->where('tenant_id', $orgCode)->delete());
        $this->safe(fn () => DB::connection($central)->table('partners')->where('slug', $vendorSlug)->delete());
        $this->safe(fn () => DB::connection($central)->table('tenant_service_orders')->where('organization_id', $orgCode)->delete());

        // 2. Residential tenant + schema drop (bypass Stancl events).
        $this->safe(function () use ($orgCode, $central) {
            $tenant = Organization::find($orgCode);
            if ($tenant) {
                $tenant->domains()->delete();
            }
            $schema = config('tenancy.database.prefix').$orgCode.config('tenancy.database.suffix');
            DB::connection($central)->table('tenants')->where('id', $orgCode)->delete();
            DB::connection($central)->statement("DROP SCHEMA IF EXISTS \"{$schema}\" CASCADE");
        });

        // 3. resi_mart cleanup via cross-DB connection.
        $this->safe(function () use ($vendorSlug) {
            DB::connection('resi_mart_central')->statement("DROP SCHEMA IF EXISTS \"tenant_{$vendorSlug}\" CASCADE");
            DB::connection('resi_mart_central')->table('domains')->where('tenant_id', $vendorSlug)->delete();
            DB::connection('resi_mart_central')->table('tenants')->where('id', $vendorSlug)->delete();
        });

        $this->info("E2E platform teardown done: tenant={$orgCode}, vendor={$vendorSlug}");

        return self::SUCCESS;
    }

    private function safe(callable $fn): void
    {
        try {
            $fn();
        } catch (Throwable $e) {
            $this->warn('  skip: '.$e->getMessage());
        }
    }
}
```

- [ ] **Step 4: Viết setup command**

Create `backend/app/Console/Commands/E2ePlatformSetupCommand.php`:
```php
<?php

namespace App\Console\Commands;

use App\Modules\Platform\Auth\Models\RequesterAccount;
use Illuminate\Console\Command;

class E2ePlatformSetupCommand extends Command
{
    protected $signature = 'e2e:platform-setup {--fresh : Pre-clean throwaway tenant+vendor first}';

    protected $description = 'Seed platform admin + (optionally) pre-clean throwaway E2E tenant/vendor';

    public function handle(): int
    {
        if (! in_array(app()->environment(), ['local', 'testing'], true)) {
            $this->error('Only runnable in local/testing.');

            return self::FAILURE;
        }

        if ($this->option('fresh')) {
            $this->call('e2e:platform-teardown');
        }

        RequesterAccount::firstOrCreate(
            ['email' => 'e2e-platform@test.com'],
            ['name' => 'E2E Platform Admin', 'password' => 'password', 'is_active' => true],
        );

        $this->info('E2E platform admin ready: e2e-platform@test.com / password');

        return self::SUCCESS;
    }
}
```

- [ ] **Step 5: Chạy test để xác nhận pass**

Run: `docker exec residential_app php artisan test --compact --filter=E2ePlatformSetupCommandTest`
Expected: PASS (2 assertions).

- [ ] **Step 6: Format + lint**

Run: `cd /Users/thaibz/Desktop/projects/residential-management && make format && make lint`
Expected: Pint pass, không lỗi.

- [ ] **Step 7: Commit**

```bash
git add backend/app/Console/Commands/E2ePlatformSetupCommand.php backend/app/Console/Commands/E2ePlatformTeardownCommand.php backend/tests/Feature/E2ePlatformSetupCommandTest.php
git commit -m "feat(e2e): platform setup + teardown artisan commands"
```

---

## Task 2: Fixture auth platform + smoke test

**Files:**
- Create: `frontend/e2e/fixtures/platform.ts`
- Create: `frontend/e2e/platform/platform-smoke.spec.ts`
- Modify: `frontend/playwright.config.ts` (thêm project `platform`)

- [ ] **Step 1: Thêm project `platform` vào playwright.config.ts**

Trong `frontend/playwright.config.ts`, thêm vào mảng `projects` (sau project `chromium`):
```ts
    {
      name: 'platform',
      testDir: './e2e/platform',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.E2E_PLATFORM_BASE_URL ?? 'http://residential.test:3000'
      }
    }
```
Và thêm `testMatch`/`testIgnore` để project `chromium` không nuốt `e2e/platform`: đổi project `chromium` thành `{ name: 'chromium', testIgnore: /platform\//, use: { ...devices['Desktop Chrome'] } }`.

- [ ] **Step 2: Viết fixture platform admin**

Create `frontend/e2e/fixtures/platform.ts`:
```ts
import { test as base, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

/**
 * Platform console admin fixture.
 * Logs in via the platform auth endpoint (guard `requester`) and injects
 * the token into localStorage under the key the FE `$platformApi` reads.
 */
const PLATFORM_API_URL = process.env.E2E_PLATFORM_API_URL ?? 'http://residential.test:8000/api/v1'
const EMAIL = process.env.E2E_PLATFORM_EMAIL ?? 'e2e-platform@test.com'
const PASSWORD = process.env.E2E_PLATFORM_PASSWORD ?? 'password'

export const test = base.extend<{ platformAdminPage: Page }>({
  platformAdminPage: async ({ page }, use) => {
    const res = await page.request.post(`${PLATFORM_API_URL}/platform/auth/login`, {
      data: { email: EMAIL, password: PASSWORD }
    })
    if (!res.ok()) {
      throw new Error(`Platform login failed (${res.status()}): ${await res.text()}`)
    }
    const body = await res.json()
    const token = body.data?.token
    if (!token) {
      throw new Error(`No platform token in response: ${JSON.stringify(body)}`)
    }

    await page.goto('/')
    await page.evaluate((t) => {
      localStorage.setItem('platform_access_token', t)
    }, token)

    await use(page)
  }
})

export { expect }
```

- [ ] **Step 3: Viết smoke spec (login + console load)**

Create `frontend/e2e/platform/platform-smoke.spec.ts`:
```ts
import { test, expect } from '../fixtures/platform'

test.describe('Platform console smoke', () => {
  test('platform admin can open the tenants console', async ({ platformAdminPage: page }) => {
    await page.goto('/platform/tenants')
    await page.waitForLoadState('networkidle')

    await expect(page.getByRole('button', { name: 'Đăng ký công ty VH' })).toBeVisible()
  })
})
```

- [ ] **Step 4: Seed admin rồi chạy smoke**

Run:
```bash
cd /Users/thaibz/Desktop/projects/residential-management
docker exec residential_app php artisan e2e:platform-setup
cd frontend && npx playwright test --project=platform platform-smoke
```
Expected: 1 passed. Nếu fail vì redirect `/login` → kiểm tra lại Task 0 Step 4 (domain central) và key token (`platform_access_token`).

- [ ] **Step 5: Typecheck + lint FE**

Run: `docker exec residential_frontend pnpm run lint && docker exec residential_frontend pnpm run typecheck`
Expected: pass.

- [ ] **Step 6: Commit**

```bash
git add frontend/e2e/fixtures/platform.ts frontend/e2e/platform/platform-smoke.spec.ts frontend/playwright.config.ts
git commit -m "feat(e2e): platform admin fixture + console smoke spec"
```

---

## Task 3: Artisan command arrange (project + commission contract)

**Files:**
- Create: `backend/app/Console/Commands/E2ePlatformProjectCommand.php`
- Create: `backend/app/Console/Commands/E2ePlatformContractCommand.php`
- Test: `backend/tests/Feature/E2ePlatformContractCommandTest.php`

- [ ] **Step 1: Viết failing test cho contract command**

Create `backend/tests/Feature/E2ePlatformContractCommandTest.php`:
```php
<?php

namespace Tests\Feature;

use App\Modules\Marketplace\PartnerCommissionContract\Models\PartnerCommissionContract;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class E2ePlatformContractCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_creates_active_per_order_contract(): void
    {
        $this->artisan('e2e:platform-contract', [
            'partnerId' => 1,
            'orgCode' => 'e2eplat',
            'projectId' => 1,
        ])->assertSuccessful();

        $contract = PartnerCommissionContract::where('partner_id', 1)
            ->where('tenant_id', 'e2eplat')
            ->where('project_id', 1)
            ->first();

        $this->assertNotNull($contract);
        $this->assertSame('per_order', $contract->commission_mode->value);
        $this->assertSame('active', $contract->status->value);
        $this->assertNotNull($contract->activated_at);
        $this->assertTrue($contract->activated_at->isPast());
    }
}
```

- [ ] **Step 2: Chạy test để xác nhận fail**

Run: `docker exec residential_app php artisan test --compact --filter=E2ePlatformContractCommandTest`
Expected: FAIL — command not defined.

- [ ] **Step 3: Viết contract command**

Create `backend/app/Console/Commands/E2ePlatformContractCommand.php`:
```php
<?php

namespace App\Console\Commands;

use App\Modules\Marketplace\PartnerCommissionContract\Enums\CommissionMode;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\ContractCreatedScope;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\ContractStatus;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\RevenueRecipient;
use App\Modules\Marketplace\PartnerCommissionContract\Models\PartnerCommissionContract;
use Illuminate\Console\Command;

class E2ePlatformContractCommand extends Command
{
    protected $signature = 'e2e:platform-contract {partnerId} {orgCode} {projectId}';

    protected $description = 'Create an ACTIVE per_order commission contract for the E2E vendor';

    public function handle(): int
    {
        if (! in_array(app()->environment(), ['local', 'testing'], true)) {
            $this->error('Only runnable in local/testing.');

            return self::FAILURE;
        }

        $partnerId = (int) $this->argument('partnerId');
        $orgCode = (string) $this->argument('orgCode');
        $projectId = (int) $this->argument('projectId');

        PartnerCommissionContract::updateOrCreate(
            ['partner_id' => $partnerId, 'tenant_id' => $orgCode, 'project_id' => $projectId, 'status' => ContractStatus::Active->value],
            [
                'contract_code' => sprintf('E2E-HD-%d-%d', $partnerId, $projectId),
                'commission_mode' => CommissionMode::PerOrder->value,
                'terms' => ['percent' => 10.00, 'fixed' => null],
                'revenue_recipient' => RevenueRecipient::Platform->value,
                'starts_at' => now()->subYear(),
                'signed_at' => now()->subYear(),
                'activated_at' => now()->subYear(),
                'replaced_at' => null,
                'created_scope' => ContractCreatedScope::Platform->value,
            ],
        );

        $this->line(json_encode(['ok' => true, 'partner_id' => $partnerId, 'project_id' => $projectId]));

        return self::SUCCESS;
    }
}
```
Lưu ý: `activated_at = now()->subYear()` để khớp point-in-time với mọi đơn tạo "hôm nay" (aggregation match `activated_at ≤ order_date ≤ replaced_at`).

- [ ] **Step 4: Chạy test để xác nhận pass**

Run: `docker exec residential_app php artisan test --compact --filter=E2ePlatformContractCommandTest`
Expected: PASS.

- [ ] **Step 5: Viết project command (seed 1 project vào tenant mới, in JSON project_id)**

Create `backend/app/Console/Commands/E2ePlatformProjectCommand.php`:
```php
<?php

namespace App\Console\Commands;

use App\Modules\PMC\Project\Models\Project;
use App\Modules\Platform\Tenant\Models\Organization;
use Database\Seeders\Tenant\Data\OrganizationSeedData;
use Illuminate\Console\Command;

class E2ePlatformProjectCommand extends Command
{
    protected $signature = 'e2e:platform-project {orgCode=e2eplat}';

    protected $description = 'Seed one project into the E2E tenant schema and print its id as JSON';

    public function handle(): int
    {
        if (! in_array(app()->environment(), ['local', 'testing'], true)) {
            $this->error('Only runnable in local/testing.');

            return self::FAILURE;
        }

        $orgCode = (string) $this->argument('orgCode');
        $tenant = Organization::find($orgCode);
        if (! $tenant) {
            $this->error("Tenant {$orgCode} not found — create it via the platform console first.");

            return self::FAILURE;
        }

        // Reuse the known-valid 'e2e' project definitions (status enum already correct).
        $defs = OrganizationSeedData::projects(OrganizationSeedData::E2E_TESTING);

        $projectId = $tenant->run(function () use ($defs): int {
            foreach ($defs as $data) {
                Project::firstOrCreate(['code' => $data['code']], $data);
            }

            return (int) Project::orderBy('id')->value('id');
        });

        $this->line(json_encode(['project_id' => $projectId]));

        return self::SUCCESS;
    }
}
```
Lưu ý FQN: nếu `App\Modules\PMC\Project\Models\Project` không resolve, kiểm tra namespace thực tế (`app/Modules/PMC/src/Project/Models/Project.php`) và sửa `use` cho khớp PSR-4 của module. Verify bằng Step 6.

- [ ] **Step 6: Verify project command resolve class (smoke, không cần tenant thật)**

Run: `docker exec residential_app php artisan e2e:platform-project nonexistent`
Expected: in `Tenant nonexistent not found ...` và exit code 1 — chứng tỏ command load được (class/imports OK), chỉ thiếu tenant. Nếu lỗi "Class not found" → sửa `use Project` FQN.

- [ ] **Step 7: Format + lint + commit**

```bash
cd /Users/thaibz/Desktop/projects/residential-management && make format && make lint
git add backend/app/Console/Commands/E2ePlatformProjectCommand.php backend/app/Console/Commands/E2ePlatformContractCommand.php backend/tests/Feature/E2ePlatformContractCommandTest.php
git commit -m "feat(e2e): platform arrange commands (project + active commission contract)"
```

---

## Task 4: Helper resi_mart API + helper artisan (frontend)

**Files:**
- Create: `frontend/e2e/helpers/artisan.ts`
- Create: `frontend/e2e/helpers/resiMart.ts`

- [ ] **Step 1: Viết helper artisan (shell-out qua docker exec)**

Create `frontend/e2e/helpers/artisan.ts`:
```ts
import { execSync } from 'node:child_process'

const CONTAINER = process.env.E2E_APP_CONTAINER ?? 'residential_app'

/** Run an artisan command in the backend container, return stdout. */
export function artisan(cmd: string): string {
  return execSync(`docker exec ${CONTAINER} php artisan ${cmd}`, { encoding: 'utf-8' })
}

/** Run an artisan command whose last stdout line is a JSON object; parse it. */
export function artisanJson<T>(cmd: string): T {
  const out = artisan(cmd)
  const last = out.trim().split('\n').filter(Boolean).pop()
  if (!last) {
    throw new Error(`No JSON output from: artisan ${cmd}\n${out}`)
  }
  return JSON.parse(last) as T
}
```

- [ ] **Step 2: Viết helper resi_mart API**

Create `frontend/e2e/helpers/resiMart.ts`:
```ts
import { request } from '@playwright/test'

/**
 * resi_mart is resolved by host (subdomain). All calls go to http://{slug}.localhost:8004.
 * Storefront is public; partner endpoints need a Sanctum token from partnerLogin().
 */
const HOST_TPL = process.env.E2E_RESIMART_HOST_TPL ?? 'http://{slug}.localhost:8004'

function baseFor(slug: string): string {
  return HOST_TPL.replace('{slug}', slug)
}

export async function partnerLogin(slug: string, email: string, password = 'password'): Promise<string> {
  const ctx = await request.newContext({ baseURL: baseFor(slug) })
  const res = await ctx.post('/api/v1/auth/login', { data: { email, password } })
  if (!res.ok()) {
    throw new Error(`resi_mart partner login failed (${res.status()}): ${await res.text()}`)
  }
  const body = await res.json()
  await ctx.dispose()
  const token = body.data?.token
  if (!token) {
    throw new Error(`No resi_mart token: ${JSON.stringify(body)}`)
  }
  return token
}

export async function createPublishedProduct(
  slug: string,
  token: string,
  opts: { tenantId: string; projectId: number }
): Promise<number> {
  const ctx = await request.newContext({
    baseURL: baseFor(slug),
    extraHTTPHeaders: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
  })
  const res = await ctx.post('/api/v1/partner/catalog/products', {
    data: {
      type: 'sale',
      name: 'E2E Sản phẩm test',
      sku: `E2E-SKU-${Date.now()}`,
      price: 250000,
      quantity_step: 1,
      status: 'published',
      project_assignments: [{ tenant_id: opts.tenantId, project_id: opts.projectId }]
    }
  })
  if (!res.ok()) {
    throw new Error(`createProduct failed (${res.status()}): ${await res.text()}`)
  }
  const body = await res.json()
  await ctx.dispose()
  return body.data.id as number
}

export async function storefrontCheckout(
  slug: string,
  opts: { tenantId: string; projectId: number; productId: number }
): Promise<string> {
  const ctx = await request.newContext({ baseURL: baseFor(slug) })
  const res = await ctx.post(
    `/api/v1/storefront/orders/checkout?operator=${encodeURIComponent(opts.tenantId)}&project_id=${opts.projectId}`,
    {
      data: {
        items: [{ product_id: opts.productId, quantity: 2 }],
        contact_name: 'Cư dân E2E',
        contact_phone: '0912345678',
        apartment_code: 'A101',
        payment_method: 'cod'
      }
    }
  )
  if (!res.ok()) {
    throw new Error(`checkout failed (${res.status()}): ${await res.text()}`)
  }
  const body = await res.json()
  await ctx.dispose()
  return body.data.code as string
}

export async function completeOrder(slug: string, token: string, code: string): Promise<void> {
  const ctx = await request.newContext({
    baseURL: baseFor(slug),
    extraHTTPHeaders: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
  })
  const list = await ctx.get(`/api/v1/partner/orders?q=${encodeURIComponent(code)}`)
  const listBody = await list.json()
  const order = (listBody.data ?? []).find((o: { code: string; id: number }) => o.code === code)
  if (!order) {
    throw new Error(`Order ${code} not found in partner list`)
  }
  const id = order.id
  await ctx.post(`/api/v1/partner/orders/${id}/confirm`, { data: {} })
  await ctx.post(`/api/v1/partner/orders/${id}/mark-processing`, { data: {} })
  await ctx.post(`/api/v1/partner/orders/${id}/mark-completed`, { data: {} })
  await ctx.dispose()
}
```

- [ ] **Step 3: Typecheck + lint FE**

Run: `docker exec residential_frontend pnpm run lint && docker exec residential_frontend pnpm run typecheck`
Expected: pass (helpers chưa dùng — sẽ dùng ở Task 5; nếu lint báo unused, để nguyên vì Task 5 import ngay).

- [ ] **Step 4: Commit**

```bash
git add frontend/e2e/helpers/artisan.ts frontend/e2e/helpers/resiMart.ts
git commit -m "feat(e2e): resi_mart API + artisan shell-out helpers"
```

---

## Task 5: Golden-path spec

**Files:**
- Create: `frontend/e2e/platform/platform-golden-path.spec.ts`

- [ ] **Step 1: Viết golden-path spec (đầy đủ)**

Create `frontend/e2e/platform/platform-golden-path.spec.ts`:
```ts
import { test, expect } from '../fixtures/platform'
import { artisan, artisanJson } from '../helpers/artisan'
import { partnerLogin, createPublishedProduct, storefrontCheckout, completeOrder } from '../helpers/resiMart'

const ORG = 'e2eplat'
const VENDOR_SLUG = 'e2evendor'
const VENDOR_EMAIL = 'owner@e2evendor.test'

test.describe.configure({ mode: 'serial' })

test.beforeAll(() => {
  // Idempotent clean state: drop any leftover throwaway tenant/vendor, seed admin.
  artisan('e2e:platform-setup --fresh')
})

test.afterAll(() => {
  artisan(`e2e:platform-teardown ${ORG} ${VENDOR_SLUG}`)
})

test('golden path: tenant → vendor → order → reports reflect it', async ({ platformAdminPage: page }) => {
  // 1. Create tenant via UI.
  await page.goto('/platform/tenants')
  await page.getByRole('button', { name: 'Đăng ký công ty VH' }).click()
  await page.getByLabel('Mã công ty').fill(ORG)
  await page.getByLabel('Tên công ty').fill('E2E Công ty VH')
  await page.getByLabel('Email').fill('contact@e2eplat.test')
  await page.getByRole('button', { name: /^Tạo$|^Lưu$/ }).click()
  await expect(page.getByText('Đăng ký công ty vận hành thành công')).toBeVisible()

  // 2. Seed a project into the freshly-created tenant schema (arrange).
  const { project_id: projectId } = artisanJson<{ project_id: number }>(`e2e:platform-project ${ORG}`)
  expect(projectId).toBeGreaterThan(0)

  // 3. Create vendor via UI (auto-provisions resi_mart + links partner_project).
  await page.goto('/platform/quan-ly-van-hanh/quan-ly-vendor')
  await page.getByRole('button', { name: 'Tạo vendor' }).click()
  await page.getByLabel('Slug').fill(VENDOR_SLUG)
  await page.getByLabel('Tên vendor').fill('E2E Vendor')
  await page.getByLabel(/Email chủ/).fill(VENDOR_EMAIL)
  await page.getByLabel('Công ty vận hành').click()
  await page.getByRole('option', { name: /E2E Công ty VH/ }).click()
  await page.waitForTimeout(500) // projects load after tenant select
  await page.getByLabel('Dự án').click()
  await page.getByRole('option').first().click()
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: /^Tạo$|^Lưu$/ }).click()
  await page.waitForURL(/\/quan-ly-vendor\/\d+/)

  // Resolve partner id + confirm provisioned (tenant_id set) via platform API.
  const partner = await page.request
    .get(`${process.env.E2E_PLATFORM_API_URL ?? 'http://residential.test:8000/api/v1'}/platform/partners`, {
      headers: { Accept: 'application/json' }
    })
    .then((r) => r.json())
    .then((b) => (b.data ?? []).find((p: { slug: string }) => p.slug === VENDOR_SLUG))
  expect(partner, 'vendor must exist').toBeTruthy()
  expect(partner.tenant_id, 'vendor must be provisioned to resi_mart').toBeTruthy()

  // 4. Create ACTIVE per_order commission contract (arrange).
  artisan(`e2e:platform-contract ${partner.id} ${ORG} ${projectId}`)

  // 5. resi_mart: product (offer) → resident order → vendor completes it (real code path via API).
  const vendorToken = await partnerLogin(VENDOR_SLUG, VENDOR_EMAIL)
  const productId = await createPublishedProduct(VENDOR_SLUG, vendorToken, { tenantId: ORG, projectId })
  const orderCode = await storefrontCheckout(VENDOR_SLUG, { tenantId: ORG, projectId, productId })
  await completeOrder(VENDOR_SLUG, vendorToken, orderCode)

  // 6. (Optional B2B source) create a paid TenantServiceOrder via UI.
  await page.goto('/platform/quan-ly-don-hang/don-hang-dich-vu-vh')
  await page.getByRole('button', { name: 'Tạo đơn dịch vụ VH' }).click()
  await page.getByLabel('Công ty vận hành').click()
  await page.getByRole('option', { name: /E2E Công ty VH/ }).click()
  await page.getByLabel('Loại đơn').click()
  await page.getByRole('option', { name: 'Gói đăng ký' }).click()
  await page.getByLabel('Tiêu đề đơn').fill('E2E Gói Business')
  await page.getByLabel('Giá trị đơn').fill('5000000')
  await page.getByRole('button', { name: /^Tạo$|^Lưu$/ }).click()
  await expect(page.getByText('Tạo đơn dịch vụ vận hành thành công')).toBeVisible()

  // 7. Reports reflect the marketplace order (cross-DB aggregation worked).
  await page.goto('/platform/modules/bao-cao-tong-hop/hieu-suat-vendor')
  await page.waitForLoadState('networkidle')
  await expect(page.getByText('Chưa có vendor có đơn')).toHaveCount(0)
  await expect(page.getByText('E2E Vendor')).toBeVisible()

  await page.goto('/platform/modules/bao-cao-tong-hop/doanh-thu-tong-hop')
  await page.waitForLoadState('networkidle')
  // GMV marketplace card must show a non-zero number (order total 250000*2 = 500.000đ).
  const gmvCard = page.locator('text=GMV marketplace').locator('..')
  await expect(gmvCard).toContainText(/[1-9]/)
})
```

- [ ] **Step 2: Chạy golden-path (cần 2 app + resi_mart đang chạy)**

Run:
```bash
cd /Users/thaibz/Desktop/projects/residential-management/frontend
npx playwright test --project=platform platform-golden-path
```
Expected: 1 passed. Khi fail, mở trace: `npx playwright show-trace` (config đã bật `trace: 'on-first-retry'`). Chẩn đoán theo bước fail:
- Fail bước 3 (vendor provision, `tenant_id` null) → kiểm tra S2S env (Task 0 Step 2/3).
- Fail bước 5 (checkout/login resi_mart) → kiểm tra subdomain reachable (Task 0 Step 5) + product `project_assignments`.
- Fail bước 7 (vendor không hiện trong report) → đơn không attribute: kiểm tra `order.tenant_id == e2eplat` và contract active (Task 3).

- [ ] **Step 3: Chạy lại để xác nhận idempotent (teardown + re-run sạch)**

Run: `npx playwright test --project=platform platform-golden-path`
Expected: lại 1 passed (chứng tỏ `--fresh` preclean + teardown hoạt động, re-runnable).

- [ ] **Step 4: Lint + commit**

```bash
docker exec residential_frontend pnpm run lint
git add frontend/e2e/platform/platform-golden-path.spec.ts
git commit -m "feat(e2e): platform golden-path spec (tenant→vendor→order→reports)"
```

---

## Task 6: Makefile + tài liệu env

**Files:**
- Modify: `Makefile`
- Create: `docs/e2e-platform.md`

- [ ] **Step 1: Thêm Makefile target**

Trong `Makefile`, mục E2E TESTING, thêm:
```makefile
e2e-platform-setup: ## Seed platform admin + pre-clean throwaway E2E tenant/vendor
	docker exec $(APP_CONTAINER) php artisan e2e:platform-setup --fresh --no-interaction

e2e-platform: ## Run the platform golden-path E2E (needs residential + resi_mart up)
	cd frontend && npx playwright test --project=platform
```

- [ ] **Step 2: Viết tài liệu chạy**

Create `docs/e2e-platform.md`:
```markdown
# E2E Platform — golden path

Validate luồng platform console: tạo tenant → vendor → đơn marketplace (resi_mart thật) → báo cáo.

## Tiền đề
- residential (app/nginx/frontend) + resi_mart (nginx/db) đang chạy.
- residential_app gọi được resi_mart S2S (`RESI_MART_INTERNAL_URL/TOKEN`) và DB (`RESIMART_DB_*`).
- resi_mart `INTERNAL_TOKEN_RESIDENTIAL_HASH` = sha256 của `RESI_MART_INTERNAL_TOKEN`.
- Domain central platform: `residential.test:3000` (override bằng `E2E_PLATFORM_BASE_URL` / `E2E_PLATFORM_API_URL`).
- Vendor subdomain reachable: `http://e2evendor.localhost:8004` (override `E2E_RESIMART_HOST_TPL`).

## Chạy
```bash
make e2e-platform-setup
make e2e-platform
```

## Định danh throwaway
- tenant `e2eplat`, vendor `e2evendor`, platform admin `e2e-platform@test.com / password`.
- Re-runnable: `--fresh` pre-clean + teardown ở afterAll dọn schema cả 2 phía.

## Ngoài phạm vi (đợt này)
CSAT/rating thật, negative/edge, đa-tenant/đa-vendor, assert exhaustive từng report.
```

- [ ] **Step 3: Commit**

```bash
git add Makefile docs/e2e-platform.md
git commit -m "docs(e2e): platform E2E make targets + runbook"
```

---

## Self-Review (đã thực hiện khi viết plan)

**1. Spec coverage:**
- Golden-path 7 bước (spec §3.1) → Task 5 spec. ✓
- Hạ tầng: fixture platform (Task 2), helper resi_mart (Task 4), command setup/teardown (Task 1) + arrange (Task 3), Makefile/env (Task 6). ✓
- Tạo tenant qua UI + teardown dọn schema (quyết định #3) → Task 5 Step 1 + Task 1 teardown. ✓
- Drive resi_mart qua API (#4) → Task 4 helper + Task 5 Step 5. ✓
- CSAT scope out (#5) → không có bước CSAT; report assert chỉ revenue + vendor-scorecard. ✓
- A1 (auto-provision khi tạo vendor) → Task 5 Step 3 + assert `partner.tenant_id`. ✓
- A2 (order.tenant_id=orgCode qua operator/project + product_project) → Task 5 Step 5 (checkout `?operator&project_id`, product `project_assignments`). ✓
- A4 (contract active) → Task 3. ✓
- A5 (deprovision) → Task 1 teardown cross-DB. ✓
- A6 (token key) → Task 2 fixture `platform_access_token`. ✓

**2. Placeholder scan:** Không có TBD/TODO. Các điểm "verify FQN/host" đều có bước verify cụ thể (Task 0, Task 3 Step 6) + default value, không phải placeholder.

**3. Type/định danh nhất quán:** `e2e:platform-setup|teardown|project|contract` dùng đồng nhất; `ORG=e2eplat`, `VENDOR_SLUG=e2evendor`, key `platform_access_token`, helper `artisan/artisanJson`, `partnerLogin/createPublishedProduct/storefrontCheckout/completeOrder` khớp giữa Task 4 và Task 5. ✓

**Rủi ro còn lại (không chặn plan, xử lý khi execute):**
- Selector UI tiếng Việt (label/placeholder) có thể lệch nhẹ → điều chỉnh theo snapshot khi chạy thật (Task 2/5).
- Mạng cross-container (residential_app ↔ resi_mart) là điều kiện tiên quyết — Task 0 verify trước.
