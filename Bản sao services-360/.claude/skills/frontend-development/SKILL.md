---
name: frontend-development
description: "Enforces frontend code reuse and structure best practices for ALL Nuxt.js frontend tasks. MUST activate for any frontend feature development, bug fix, component update, page creation, composable or utility work under frontend/. Before writing any code: scans existing components in shared/, checks composables/ and utils/ for reusable logic, evaluates reusability, and places shared logic in the correct directories. Activates when user says làm tính năng, fix lỗi, thêm, sửa, tạo component, tạo page, build feature, update UI, or any frontend coding request."
---

# Frontend Development — Scan Before You Write

## When to Apply

This skill activates for **every** frontend coding request:

- Building new features or pages in `frontend/`
- Fixing bugs in frontend code
- Adding functionality to existing components or pages
- Creating new composables or utility functions
- Any task that requires writing or modifying `.vue` or `.ts` files under `frontend/`

---

## Phase 0: Kiểm tra Type Generation từ Backend

**PHẢI thực hiện trước mọi task FE liên quan đến module mới hoặc API mới.**

### Bước 1: Kiểm tra types đã generate chưa

Mở file `frontend/lib/api/generated/laravel.schemas.ts` và tìm xem types cho module/entity bạn sắp làm đã tồn tại chưa.

Nếu module mới hoặc có thay đổi API từ BE → cần generate lại.

### Bước 2: Generate types từ BE (chạy trên host, không phải Docker)

```bash
cd frontend && pnpm run api:generate
```

> **Lưu ý:** Lệnh này chạy **trực tiếp trên host** (không phải trong Docker container). Đây là ngoại lệ duy nhất so với các lệnh pnpm khác.

### Bước 3: Nếu types bị sai hoặc thiếu sau khi generate

Kiểm tra lại phía Backend:

1. **API endpoint có trả đúng resource không?** — Đọc Resource class tương ứng (`{Entity}ListResource`, `{Entity}DetailResource`).
2. **`api.json` đã được export chưa?** — Backend cần export OpenAPI spec (`php artisan scribe:generate` hoặc tương đương).
3. **Types trong Resource có khớp với Orval output không?** — Nếu BE Resource trả sai shape → sửa BE trước, export lại `api.json`, rồi generate lại.

**Quy tắc:** Không được workaround type sai bằng `as any` hay `@ts-ignore`. Nếu type sai → tìm và sửa gốc ở BE.

---

## Phase 1: Mandatory Pre-Code Scan

**ALWAYS complete this scan before writing any new code.**

### 1. Scan Existing Components

```bash
find frontend/app/components -type f -name "*.vue" | sort
```

Key directories to check:

| Directory | Purpose |
|-----------|---------|
| `components/shared/crud/` | Generic CRUD UI: `PageHeader`, `DeleteModal`, `TableSkeleton` |
| `components/shared/{domain}/` | Domain-specific shared components |
| `components/layout/` | `AppSidebar`, `AppHeader` |
| `components/ui/` | Custom UI primitives |

**Rule:** If a matching or similar component exists → **reuse or extend it, never duplicate**.

### 2. Scan Existing Composables

```bash
find frontend/app/composables -type f -name "*.ts" | sort
```

**Rule:** If a composable with similar logic exists → reuse it or add the new behavior to the existing file.

### 3. Scan Existing Utils

```bash
find frontend/app/utils -type f -name "*.ts" 2>/dev/null | sort
```

**Rule:** If a utility function covering the same logic already exists → import and reuse it.

### 4. Check Nuxt UI First

Before creating any custom component, verify Nuxt UI doesn't already provide it.

Common components: `UButton`, `UInput`, `UTable`, `UForm`, `UFormField`, `UModal`, `UDrawer`,
`UCard`, `UBadge`, `UAvatar`, `USkeleton`, `UAlert`, `UToast`, `UDropdownMenu`, `UPagination`,
`UBreadcrumb`, `UTabs`, `USelect`, `UCheckbox`, `USwitch`, `USeparator`.

---

## Phase 2: Reusability Assessment

After scanning, evaluate **every piece of new code** for reuse potential before writing it.

### Decision Tree

```
New code to write
├── Already exists in shared/, composables/, or utils/? → REUSE IT
├── Nuxt UI provides it? → USE Nuxt UI directly
├── UI component used in 2+ pages/features?
│   └── Yes → components/shared/{domain}/ComponentName.vue
├── Reactive state + logic reused across pages?
│   └── Yes → composables/use{FeatureName}.ts
├── Pure function (format, transform, calculate)?
│   └── Yes → utils/{name}.ts
└── 100% page-specific, single-use? → Inline in page/component
```

### When to Extract to `components/shared/`

- Used (or will be used) in more than one page or feature
- Represents a common UI pattern: status badge, confirm modal, table skeleton, page header
- Has clear, typed props and well-defined responsibilities
- Organize by domain: `shared/crud/`, `shared/department/`, `shared/employee/`, etc.

### When to Extract to `composables/`

- Contains reactive state (`ref`, `computed`, `watch`) + side effects
- Same data-fetching or mutation pattern repeats across pages
- Business logic that should be separated from template concerns
- Examples: `useTableSearch`, `useAuth`, `useCrudModals`

### API Composables (`composables/api/`)

- **One file per module**: `useDepartments.ts`, `useJobTitles.ts`, `useProjects.ts`, `useAuthentication.ts`
- **Queries** (GET): use `useApiFetch<T>(url, opts)`. Naming: `use{Entity}List()`, `use{Entity}Detail()`
- **Mutations** (POST/PUT/DELETE): use `$api<T>(url, opts)`. Naming: `apiCreate{Entity}()`, `apiUpdate{Entity}()`, `apiDelete{Entity}()`
- **All API URLs for a module MUST be defined in its composable file**. Pages should NEVER call `$api()` directly with raw URLs — always use the named functions from the composable.
- When adding a new API endpoint, add the function to the existing module composable (or create a new file if it's a new module)

### When to Extract to `utils/`

- Pure function — no reactive state, no side effects
- Formatting, validation, transformation, or calculation logic
- Used or likely to be used in 2+ places
- Examples: `formatDate`, `formatCurrency`, `truncateText`, `getStatusLabel`

---

## Phase 3: Context7 Best Practices Lookup

Use `context7` MCP when uncertain about placement or patterns:

```ts
// Look up Nuxt 4 composable patterns
mcp__context7__resolve-library-id({ libraryName: 'nuxt' })
mcp__context7__query-docs({ libraryId: '/nuxt/nuxt', query: 'composables shared state' })

// Look up Vue 3 Composition API patterns
mcp__context7__resolve-library-id({ libraryName: 'vue' })
mcp__context7__query-docs({ libraryId: '/vuejs/core', query: 'composable reuse logic' })
```

Use context7 for:
- Where to place a specific type of logic in Nuxt 4
- Vue 3 Composition API best practices
- Nuxt `useFetch` / `$fetch` patterns
- Nuxt UI component API and configuration

---

## Phase 4: Write Code

Apply these rules when writing:

- `<script setup lang="ts">` — always
- No manual imports for `ref`, `computed`, `watch`, `useRoute`, etc. — Nuxt auto-imports
- Props: always `defineProps<Props>()` with typed interface — never `any`
- TypeScript strict — no `any`, no `@ts-ignore`, no `as unknown as`
- All user-facing text in **tiếng Việt có dấu** (labels, placeholders, toasts, errors)
- Use TypeScript types from `#api/generated/laravel.schemas` (Orval generates types only)
- API calls: use functions from `composables/api/` — NEVER call `$api()` with raw URLs in pages
- Handle loading (`v-if="status === 'pending'"`) and error (`v-else-if="error"`) states
- After mutations, call `refresh()` from `useFetch` return to refetch data
- Do NOT declare `middleware: 'auth'` in `definePageMeta` — `auth.global.ts` auto-protects all routes

---

## Phase 5: Post-Write Reusability Review

After writing code, review what you just created:

1. Did I write a new component that could benefit other pages? → Move to `shared/`
2. Did I write reactive logic that repeats elsewhere? → Extract to `composables/`
3. Did I write a utility function inline? → Move to `utils/`
4. Did I write a component that Nuxt UI already has? → Replace with Nuxt UI component

If yes to any → **refactor before finishing the task**.

---

## Shared Directory Structure

```
frontend/app/
├── components/
│   ├── shared/
│   │   ├── crud/              # Generic CRUD: PageHeader.vue, DeleteModal.vue, TableSkeleton.vue
│   │   ├── {domain}/          # Domain-specific: department/, employee/, project/
│   │   └── ui/                # Custom UI primitives not covered by Nuxt UI
│   ├── layout/                # AppSidebar.vue, AppHeader.vue
├── composables/
│   ├── api/                   # API composables — one per module (useDepartments.ts, useProjects.ts, ...)
│   ├── useApi.ts              # Base layer: useApiFetch() + $api() with auth + token refresh
│   ├── useAuth.ts             # Auth state management
│   ├── useCrudModals.ts       # Shared CRUD modal logic
│   └── useTableSearch.ts      # Debounced search for tables
└── utils/                     # {name}.ts — pure helper functions
```

---

## Checklist

- [ ] Kiểm tra `lib/api/generated/laravel.schemas.ts` — types cho module đã có chưa
- [ ] Nếu chưa hoặc có thay đổi API → chạy `cd frontend && pnpm run api:generate` (trên host)
- [ ] Nếu types sai sau generate → kiểm tra và sửa BE Resource trước, không dùng `as any`
- [ ] Scanned `components/shared/` — no duplicate component created
- [ ] Scanned `composables/` — no duplicate composable created
- [ ] Scanned `utils/` — no duplicate utility function written
- [ ] Checked Nuxt UI for built-in components first
- [ ] Reusability assessed for every piece of new code
- [ ] Shared components placed in `components/shared/{domain}/`
- [ ] Reusable reactive logic placed in `composables/use{Name}.ts`
- [ ] Pure utility functions placed in `utils/{name}.ts`
- [ ] All user-facing text in tiếng Việt có dấu
- [ ] TypeScript strict — no `any`, no `@ts-ignore`
- [ ] No manual imports for auto-imported Nuxt APIs
- [ ] Loading and error states handled in templates
