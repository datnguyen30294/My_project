<laravel-boost-guidelines>
=== foundation rules ===

# Laravel Boost Guidelines

The Laravel Boost guidelines are specifically curated by Laravel maintainers for this application. These guidelines should be followed closely to ensure the best experience when building Laravel applications.

## Foundational Context

This application is a Laravel application and its main Laravel ecosystems package & versions are below. You are an expert with them all. Ensure you abide by these specific packages & versions.

- php - 8.4.17
- laravel/framework (LARAVEL) - v12
- laravel/prompts (PROMPTS) - v0
- laravel/telescope (TELESCOPE) - v5
- laravel/mcp (MCP) - v0
- laravel/pint (PINT) - v1
- laravel/sail (SAIL) - v1
- phpunit/phpunit (PHPUNIT) - v11
- tailwindcss (TAILWINDCSS) - v4

## Skills Activation

This project has domain-specific skills available. You MUST activate the relevant skill whenever you work in that domain—don't wait until you're stuck.

- `tailwindcss-development` — Styles applications using Tailwind CSS v4 utilities. Activates when adding styles, restyling components, working with gradients, spacing, layout, flex, grid, responsive design, dark mode, colors, typography, or borders; or when the user mentions CSS, styling, classes, Tailwind, restyle, hero section, cards, buttons, or any visual/UI changes.
- `frontend-development` — Enforces code reuse and structure best practices for ALL frontend tasks. **MUST activate for every frontend coding request**: building features, fixing bugs, creating components/pages/composables/utils under `frontend/`. Scans existing code before writing, evaluates reusability, and places shared logic in the correct directories (`shared/`, `composables/`, `utils/`).

## Conventions

- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling files for the correct structure, approach, and naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts

- Do not create verification scripts or tinker when tests cover that functionality and prove they work. Unit and feature tests are more important.

## Application Structure & Architecture

- Stick to existing directory structure; don't create new base folders without approval.
- Do not change the application's dependencies without approval.

## Backend Conventions (CRITICAL)

### Layered Architecture — Repository Pattern

- **Service MUST NOT call `Model::query()`, `Model::where()`, or any Eloquent query directly.** All database queries go through Repository.
- If the Repository doesn't have a suitable method, add one — do NOT bypass Repository from Service.
- When a Service needs data from another submodule's Model, inject that submodule's Repository via constructor.

### Naming Conventions

- **Form Requests**: `Create{Entity}Request`, `Update{Entity}Request`, `List{Entity}Request`, `Delete{Entity}Request`. NEVER use `Store{Entity}Request`.
- **Services**: `{Entity}Service` implements `{Entity}ServiceInterface`.
- **Repositories**: `{Entity}Repository` extends `BaseRepository`.
- **Resources**: `{Entity}ListResource`, `{Entity}DetailResource` extends `BaseResource`.
- **Models**: Extend `BaseModel` for independent entities. Detail/line-item tables that live and die with a parent (e.g. `QuoteLine` → `Quote`) may extend `Model` directly.

### Validation Rules

- Use enum values or `Rule::in()` in validation — NEVER hard-code string arrays that duplicate enum definitions.
- Foreign key fields (`*_id`, `reference_id`) MUST include `Rule::exists()` validation when the referenced table is known.
- Every controller action that accepts input MUST use a dedicated Form Request class — no inline validation, no raw `Request`.

### Convention Scanning (Before Writing Code)

- Before creating any new file, check sibling files in the same directory for naming, structure, and patterns.
- Use `convention-scout` agent when working on a new submodule or unfamiliar area of the codebase.
- This applies to ALL tasks: new modules, new features, bug fixes, refactoring.

## Frontend Bundling

- If the user doesn't see a frontend change reflected in the UI, it could mean they need to run `npm run build`, `npm run dev`, or `composer run dev`. Ask them.

## Documentation Files

- You must only create documentation files if explicitly requested by the user.

## Monorepo Structure

This project is a monorepo with two main directories:

- `backend/` — Laravel API (PHP). All Laravel files live here.
- `frontend/` — Nuxt.js app (TypeScript/Vue). All frontend files live here.

Root-level files (`compose.yml`, `Makefile`, `CLAUDE.md`, `docs/`, `.github/`) are shared.

## Docker

- All PHP/Artisan/Composer commands MUST be run inside the `residential_app` Docker container using `docker exec residential_app <command>`.
- Example: `docker exec residential_app php artisan migrate`, `docker exec residential_app composer require package/name`.
- NEVER run PHP, Artisan, or Composer commands directly on the host machine.
- All frontend (pnpm/node) commands MUST be run inside the `residential_frontend` Docker container using `docker exec residential_frontend <command>`.
- Example: `docker exec residential_frontend pnpm install`, `docker exec residential_frontend pnpm run lint`.
- NEVER run pnpm/node commands directly on the host machine for the frontend.
- The `residential_frontend` container already runs `pnpm run dev` (HMR) on startup. Do NOT run `pnpm run build` during development — changes are reflected automatically via HMR.

## Replies

- Be concise in your explanations - focus on what's important rather than explaining obvious details.

=== boost rules ===

# Laravel Boost

- Laravel Boost is an MCP server that comes with powerful tools designed specifically for this application. Use them.

## Artisan

- Use the `list-artisan-commands` tool when you need to call an Artisan command to double-check the available parameters.

## URLs

- Whenever you share a project URL with the user, you should use the `get-absolute-url` tool to ensure you're using the correct scheme, domain/IP, and port.

## Tinker / Debugging

- You should use the `tinker` tool when you need to execute PHP to debug code or query Eloquent models directly.
- Use the `database-query` tool when you only need to read from the database.

## Reading Browser Logs With the `browser-logs` Tool

- You can read browser logs, errors, and exceptions using the `browser-logs` tool from Boost.
- Only recent browser logs will be useful - ignore old logs.

## Searching Documentation (Critically Important)

- Boost comes with a powerful `search-docs` tool you should use before trying other approaches when working with Laravel or Laravel ecosystem packages. This tool automatically passes a list of installed packages and their versions to the remote Boost API, so it returns only version-specific documentation for the user's circumstance. You should pass an array of packages to filter on if you know you need docs for particular packages.
- Search the documentation before making code changes to ensure we are taking the correct approach.
- Use multiple, broad, simple, topic-based queries at once. For example: `['rate limiting', 'routing rate limiting', 'routing']`. The most relevant results will be returned first.
- Do not add package names to queries; package information is already shared. For example, use `test resource table`, not `filament 4 test resource table`.

### Available Search Syntax

1. Simple Word Searches with auto-stemming - query=authentication - finds 'authenticate' and 'auth'.
2. Multiple Words (AND Logic) - query=rate limit - finds knowledge containing both "rate" AND "limit".
3. Quoted Phrases (Exact Position) - query="infinite scroll" - words must be adjacent and in that order.
4. Mixed Queries - query=middleware "rate limit" - "middleware" AND exact phrase "rate limit".
5. Multiple Queries - queries=["authentication", "middleware"] - ANY of these terms.

=== php rules ===

# PHP

- Always use curly braces for control structures, even for single-line bodies.

## Constructors

- Use PHP 8 constructor property promotion in `__construct()`.
    - <code-snippet>public function __construct(public GitHub $github) { }</code-snippet>
- Do not allow empty `__construct()` methods with zero parameters unless the constructor is private.

## Type Declarations

- Always use explicit return type declarations for methods and functions.
- Use appropriate PHP type hints for method parameters.

<code-snippet name="Explicit Return Types and Method Params" lang="php">
protected function isAccessible(User $user, ?string $path = null): bool
{
    ...
}
</code-snippet>

## Enums

- Typically, keys in an Enum should be TitleCase. For example: `FavoritePerson`, `BestLake`, `Monthly`.

## Comments

- Prefer PHPDoc blocks over inline comments. Never use comments within the code itself unless the logic is exceptionally complex.

## PHPDoc Blocks

- Add useful array shape type definitions when appropriate.

=== tests rules ===

# Test Enforcement

- Every change must be programmatically tested. Write a new test or update an existing test, then run the affected tests to make sure they pass.
- Run the minimum number of tests needed to ensure code quality and speed. Use `php artisan test --compact` with a specific filename or filter.

=== laravel/core rules ===

# Do Things the Laravel Way

- Use `php artisan make:` commands to create new files (i.e. migrations, controllers, models, etc.). You can list available Artisan commands using the `list-artisan-commands` tool.
- If you're creating a generic PHP class, use `php artisan make:class`.
- Pass `--no-interaction` to all Artisan commands to ensure they work without user input. You should also pass the correct `--options` to ensure correct behavior.

## Database

- Always use proper Eloquent relationship methods with return type hints. Prefer relationship methods over raw queries or manual joins.
- Use Eloquent models and relationships before suggesting raw database queries.
- Avoid `DB::`; prefer `Model::query()`. Generate code that leverages Laravel's ORM capabilities rather than bypassing them.
- Generate code that prevents N+1 query problems by using eager loading.
- Use Laravel's query builder for very complex database operations.

### Model Creation

- When creating new models, create useful factories and seeders for them too. Ask the user if they need any other things, using `list-artisan-commands` to check the available options to `php artisan make:model`.

### APIs & Eloquent Resources

- For APIs, default to using Eloquent API Resources and API versioning unless existing API routes do not, then you should follow existing application convention.

## Controllers & Validation

- Always create Form Request classes for validation rather than inline validation in controllers. Include both validation rules and custom error messages.
- Check sibling Form Requests to see if the application uses array or string based validation rules.

## Authentication & Authorization

- Use Laravel's built-in authentication and authorization features (gates, policies, Sanctum, etc.).

## URL Generation

- When generating links to other pages, prefer named routes and the `route()` function.

## Queues

- Use queued jobs for time-consuming operations with the `ShouldQueue` interface.

## Configuration

- Use environment variables only in configuration files - never use the `env()` function directly outside of config files. Always use `config('app.name')`, not `env('APP_NAME')`.

## Testing

- When creating models for tests, use the factories for the models. Check if the factory has custom states that can be used before manually setting up the model.
- Faker: Use methods such as `$this->faker->word()` or `fake()->randomDigit()`. Follow existing conventions whether to use `$this->faker` or `fake()`.
- When creating tests, make use of `php artisan make:test [options] {name}` to create a feature test, and pass `--unit` to create a unit test. Most tests should be feature tests.

## Vite Error

- If you receive an "Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest" error, you can run `npm run build` or ask the user to run `npm run dev` or `composer run dev`.

=== laravel/v12 rules ===

# Laravel 12

- CRITICAL: ALWAYS use `search-docs` tool for version-specific Laravel documentation and updated code examples.
- Since Laravel 11, Laravel has a new streamlined file structure which this project uses.

## Laravel 12 Structure

- In Laravel 12, middleware are no longer registered in `app/Http/Kernel.php`.
- Middleware are configured declaratively in `bootstrap/app.php` using `Application::configure()->withMiddleware()`.
- `bootstrap/app.php` is the file to register middleware, exceptions, and routing files.
- `bootstrap/providers.php` contains application specific service providers.
- The `app\Console\Kernel.php` file no longer exists; use `bootstrap/app.php` or `routes/console.php` for console configuration.
- Console commands in `app/Console/Commands/` are automatically available and do not require manual registration.

## Database

- When modifying a column, the migration must include all of the attributes that were previously defined on the column. Otherwise, they will be dropped and lost.
- Laravel 12 allows limiting eagerly loaded records natively, without external packages: `$query->latest()->limit(10);`.

### Models

- Casts can and likely should be set in a `casts()` method on a model rather than the `$casts` property. Follow existing conventions from other models.

=== pint/core rules ===

# Laravel Pint Code Formatter

- You must run `vendor/bin/pint --dirty --format agent` before finalizing changes to ensure your code matches the project's expected style.
- Do not run `vendor/bin/pint --test --format agent`, simply run `vendor/bin/pint --format agent` to fix any formatting issues.

## Backend Post-Change Checklist (CRITICAL)

After ANY backend code change, you MUST run these commands before considering the task done:

1. `make format` — Auto-fix code style (Pint)
2. `make lint` — Verify code style passes (Pint --test)
3. Run relevant tests (`make test-filter F=TestName` or `make test-file FILE=...`)

=== phpunit/core rules ===

# PHPUnit

- This application uses PHPUnit for testing. All tests must be written as PHPUnit classes. Use `php artisan make:test --phpunit {name}` to create a new test.
- If you see a test using "Pest", convert it to PHPUnit.
- Every time a test has been updated, run that singular test.
- When the tests relating to your feature are passing, ask the user if they would like to also run the entire test suite to make sure everything is still passing.
- Tests should cover all happy paths, failure paths, and edge cases.
- You must not remove any tests or test files from the tests directory without approval. These are not temporary or helper files; these are core to the application.

## Running Tests

- Run the minimal number of tests, using an appropriate filter, before finalizing.
- To run all tests: `php artisan test --compact`.
- To run all tests in a file: `php artisan test --compact tests/Feature/ExampleTest.php`.
- To filter on a particular test name: `php artisan test --compact --filter=testName` (recommended after making a change to a related file).

=== frontend rules ===

# Frontend (Nuxt.js + Vue + TypeScript)

## Tech Stack

- Nuxt 4 (file-based routing, auto-imports, SSR)
- Vue 3 (Composition API, `<script setup>`)
- TypeScript 5 (strict mode)
- Tailwind CSS v4
- Nuxt UI v4 (`@nuxt/ui`) — component library
- pnpm — package manager
- Orval (types only) + Nuxt `useFetch`/`$fetch` — API client

## Architecture

- Nuxt 4 structure: `app/` directory chứa toàn bộ application code.
- Luôn dùng `<script setup lang="ts">` — Composition API.
- Tận dụng auto-imports — không import `ref`, `computed`, `watch`, `useRoute`, etc.
- Dùng Nuxt UI components (`UButton`, `UInput`, `UTable`, etc.) trước khi tự viết.

## Directory Structure

```
frontend/
├── app/
│   ├── assets/css/               # CSS (Tailwind entry)
│   ├── components/               # Auto-imported Vue components
│   │   ├── ui/                   # Custom UI components (nếu Nuxt UI chưa có)
│   │   ├── layout/               # Layout parts (AppSidebar, AppHeader)
│   │   └── shared/               # Shared business components
│   ├── composables/              # Auto-imported composables
│   │   ├── api/                  # API composables (one per module)
│   │   ├── useApi.ts             # Base API layer: useApiFetch + $api
│   │   ├── useAuth.ts            # Auth state management
│   │   ├── useCrudModals.ts      # Shared CRUD modal logic
│   │   └── useTableSearch.ts     # Debounced search for tables
│   ├── layouts/                  # Page layouts (default.vue, auth.vue)
│   ├── middleware/               # Route middleware (auth.global.ts)
│   ├── pages/                    # File-based routing
│   ├── utils/                    # Auto-imported utility functions
│   ├── app.vue                   # Root component
│   └── app.config.ts             # Runtime app config
├── lib/
│   └── api/
│       └── generated/
│           └── laravel.schemas.ts # Orval output (TypeScript types only)
├── nuxt.config.ts
├── orval.config.ts
└── package.json
```

## Conventions

- Component files: `PascalCase.vue` (`EmployeeList.vue`, `UiButton.vue`).
- Pages: `kebab-case.vue` hoặc `[param].vue` (`index.vue`, `[id].vue`).
- Composables: `camelCase.ts` prefix `use` (`useAuth.ts`).
- Component prefix: `Ui` cho UI primitives, `App` cho layout parts.
- Dùng Nuxt UI components trước khi tự viết (`UButton`, `UInput`, `UTable`, `UModal`, `UForm`).
- **KHÔNG viết custom `<div>` + Tailwind cho UI patterns mà Nuxt UI hoặc Shared component đã có:**
  - Alert/Warning/Error/Info boxes → dùng `<UAlert color="..." variant="subtle" />`. KHÔNG `<div class="bg-amber-50 border-amber-400...">`.
  - Status badges → dùng `<UBadge>`. KHÔNG `<span class="px-2 py-0.5 rounded text-xs...">`.
  - Card containers with header → dùng `<SharedSectionCard title="..." compact>`. KHÔNG `<div class="bg-white border rounded-xl shadow-sm...">`.
  - Nếu Nuxt UI component style chưa đủ đậm/phù hợp → customize theme trong `app.config.ts` (compoundVariants), KHÔNG viết inline Tailwind.
- Always type props with `defineProps<Props>()`. Never use `any`.
- Use `~/` path alias for imports (Nuxt convention).

## API Integration

- Backend API runs on Laravel. Frontend calls API via Nuxt built-in `useFetch` / `$fetch`.
- Use `NUXT_PUBLIC_API_URL` env var (via `runtimeConfig`).
- Orval generates TypeScript types only (`lib/api/generated/laravel.schemas.ts`). Do NOT generate Vue Query composables.
- **API composables** live in `app/composables/api/` (auto-imported via `imports.dirs` in nuxt.config.ts):
  - One file per module: `useDepartments.ts`, `useJobTitles.ts`, `useProjects.ts`, `useAuthentication.ts`.
  - **Queries** (GET): use `useApiFetch<T>(url, opts)` — wraps `useFetch` with auth headers + token refresh. Naming: `use{Entity}List()`, `use{Entity}Detail()`.
  - **Mutations** (POST/PUT/DELETE): use `$api<T>(url, opts)` — wraps `$fetch` with auth headers + token refresh. Naming: `apiCreate{Entity}()`, `apiUpdate{Entity}()`, `apiDelete{Entity}()`.
  - All API URLs for a module MUST be defined in its composable file. Pages should NOT call `$api()` directly with raw URLs — always use the named functions from the composable.
- Always handle loading (`v-if="status === 'pending'"`) and error (`v-else-if="error"`) states.
- After mutations, call `refresh()` (from `useFetch` return) to refetch data — do NOT use `queryClient.invalidateQueries()`.
- Backend returns `{ success: true, data: {...} }` format with enum fields as `{ value, label }`.

## Code Reuse (CRITICAL — DRY)

- **Before writing any API call in a page**, open the module's API composable file (`composables/api/use{Module}.ts`) and check if a function already exists. If it does, USE IT. Do NOT re-implement the same fetch logic.
- **When creating multiple pages for the same feature** (e.g. `tao-moi.vue`, `[id]/edit.vue`, `[id]/index.vue`): identify shared logic FIRST, extract into composables BEFORE writing pages. Common candidates:
  - Form logic shared between create/edit → `use{Entity}Form()`
  - Transition/status change logic → `use{Entity}Transition()`
  - Constants (labels, options) → export from API composable or `utils/`
- **NEVER copy-paste logic between pages.** If two pages share the same try/catch/toast pattern, form fields, or data fetching — extract it.
- **Shared constants** (labels, option arrays, field mappings) that are used in 2+ files MUST be defined at module-level in the composable or a dedicated `utils/` file, NOT inline in `setup()`.
- **Hardcoded values** like `per_page: 100` MUST use constants from `utils/constants.ts` (e.g. `SELECT_ALL_PER_PAGE`, `DEFAULT_PER_PAGE`).
- **Shared utility logic** used across modules (e.g. audit formatting, date helpers) MUST be extracted to `utils/` — do NOT copy between module pages.
- **Utility file naming**: use specific names (`number.ts`, `date.ts`, `audit.ts`), NOT generic names (`format.ts`, `helpers.ts`).

## TypeScript

- Strict mode enabled. No `any`, no `@ts-ignore`, no `as unknown as`.
- Define shared API response types that match backend Resource shapes.
- Enum fields from backend: `{ value: string; label: string }`.

## Linting

- ESLint with `@nuxt/eslint`.
- Run lint: `docker exec residential_frontend pnpm run lint`.
- Run typecheck: `docker exec residential_frontend pnpm run typecheck`.

## Docker

- Package manager: **pnpm** (NOT npm).
- All pnpm/node commands MUST run inside `residential_frontend` container.
- `docker exec residential_frontend pnpm install`
- `docker exec residential_frontend pnpm run lint`
- NEVER run pnpm/node commands directly on the host machine.
- The container already runs `pnpm run dev` (HMR) on startup. Do NOT run `pnpm run build` during development.

## Skills & Agents

- Activate `create-component` skill when creating new Vue components, pages, or layouts.
- Activate `tailwindcss-development` skill when working with styling.
- Use `frontend-component-scout` agent to scan existing components before creating new ones.
- Use `api-contract-checker` agent to validate frontend API calls match backend endpoints.

=== tailwindcss/core rules ===

# Tailwind CSS

- Always use existing Tailwind conventions; check project patterns before adding new ones.
- IMPORTANT: Always use `search-docs` tool for version-specific Tailwind CSS documentation and updated code examples. Never rely on training data.
- IMPORTANT: Activate `tailwindcss-development` every time you're working with a Tailwind CSS or styling-related task.
</laravel-boost-guidelines>
