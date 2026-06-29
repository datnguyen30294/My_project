---
name: create-component
description: "Creates a new Vue component in the Nuxt.js frontend. Activates when the user wants to create, scaffold, or add a new component, page, layout, or UI element under frontend/. Handles Vue SFC files, types, and follows project conventions."
---

# Create Component

## When to Apply

- User wants to create a new Vue component, page, or layout
- User says "tạo component", "create component", "add page", "scaffold"
- User provides a UI mockup or description for a new frontend feature

## Before Creating — Detect Context

### Step 1: Check Generated API Types & API Composables

If the component needs data from a backend API, **MUST check types and existing API composables first:**

```bash
# Check if generated types exist for the target entity
find frontend/lib/api/generated -type f -name "*.ts" 2>/dev/null | head -20

# Check existing API composables
find frontend/app/composables/api -type f -name "*.ts" 2>/dev/null | sort
```

**Decision flow:**

1. **API composable exists** (e.g., `useDepartments.ts`) → Use its query/mutation functions directly (auto-imported)
2. **Types exist but no composable** → Create a new API composable in `composables/api/use{Module}.ts`
3. **Types do NOT exist** → Run `make api-generate` to generate from backend Swagger
4. **Still no types after generate** → Check if backend has implemented the API:
   - Scan `backend/app/Modules/*/routes/api.php` for the target endpoint
   - Scan `backend/app/Modules/*/src/*/Controllers/` for the target controller
   - If backend NOT implemented → **Stop and inform user** that backend API must be created first (suggest using `/create-module` skill)
   - If backend IS implemented but Scramble export failed → Check `docker exec residential_app php artisan scramble:export` for errors

### Step 2: Check Nuxt UI Components

**MUST check if Nuxt UI already provides the needed component** before creating a custom one.

Common Nuxt UI components:
- Layout: `UApp`, `UHeader`, `UMain`, `UFooter`, `UPage`, `UPageHero`, `UPageSection`
- Form: `UForm`, `UFormField`, `UInput`, `UTextarea`, `USelect`, `UCheckbox`, `URadio`, `USwitch`
- Data: `UTable`, `UPagination`, `UBadge`, `UAvatar`
- Feedback: `UModal`, `UDrawer`, `UToast`, `UAlert`
- Navigation: `UButton`, `ULink`, `UTabs`, `UBreadcrumb`, `UDropdownMenu`
- Display: `UCard`, `USeparator`, `USkeleton`, `UCollapsible`

If Nuxt UI has the component → **use it directly**, do not create a custom one.

### Step 3: Scan Existing Code

**MUST scan all three locations before writing any code:**

```bash
find frontend/app/components -type f -name "*.vue" | sort
find frontend/app/composables -type f -name "*.ts" | sort
find frontend/app/utils -type f -name "*.ts" 2>/dev/null | sort
```

Check for:
1. Existing components that can be reused (especially in `shared/crud/` and `shared/{domain}/`)
2. Composables with similar logic — extend instead of duplicating
3. Utility functions already in `utils/` — import instead of rewriting
4. Naming conventions (PascalCase files, prefix conventions)

### Step 4: Reusability Assessment

**Before writing any new code**, evaluate where it belongs:

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

**When to put in `shared/`:** component used (or will be used) in more than one page, or represents a common UI pattern (status badge, confirm modal, table skeleton, page header).

**When to put in `composables/`:** contains reactive state + side effects, or the same data-fetching/mutation pattern repeats across pages.

**When to put in `utils/`:** pure function — no reactive state — formatting, validation, transformation, calculation logic.

### Step 5: Context7 Best Practices Lookup

Use `context7` MCP when uncertain about placement or patterns:

```ts
mcp__context7__resolve-library-id({ libraryName: 'nuxt' })
mcp__context7__query-docs({ libraryId: '/nuxt/nuxt', query: 'composables shared state' })
```

Use for: Nuxt 4 composable patterns, Vue 3 Composition API best practices, Nuxt `useFetch`/`$fetch` patterns, Nuxt UI component API.

## Project Structure

```
frontend/
├── app/
│   ├── assets/css/main.css           # Tailwind CSS entry
│   ├── components/                    # Auto-imported Vue components
│   │   ├── ui/                        # Custom UI (khi Nuxt UI chưa có)
│   │   ├── layout/                    # Layout parts (AppSidebar, AppHeader)
│   │   └── shared/                    # Shared business components
│   │       ├── crud/                  # Generic CRUD: PageHeader, DeleteModal, TableSkeleton
│   │       └── {domain}/             # Domain-specific shared components
│   ├── composables/                   # Auto-imported composables
│   │   ├── api/                       # API composables — one per module
│   │   │   ├── useDepartments.ts
│   │   │   ├── useJobTitles.ts
│   │   │   ├── useProjects.ts
│   │   │   └── useAuthentication.ts
│   │   ├── useApi.ts                  # Base API layer: useApiFetch() + $api()
│   │   ├── useAuth.ts                 # Auth state management
│   │   ├── useCrudModals.ts           # Shared CRUD modal logic
│   │   └── useTableSearch.ts          # Debounced search for tables
│   ├── layouts/                       # Page layouts
│   │   ├── default.vue
│   │   └── auth.vue
│   ├── middleware/                     # Route middleware
│   │   └── auth.global.ts
│   ├── pages/                         # File-based routing
│   │   ├── index.vue                  # /
│   │   ├── login.vue                  # /login
│   │   └── employees/
│   │       ├── index.vue              # /employees
│   │       └── [id].vue               # /employees/:id
│   ├── utils/                         # Auto-imported utilities
│   ├── app.vue                        # Root component
│   └── app.config.ts                  # Nuxt UI theme config
├── lib/
│   └── api/
│       └── generated/
│           └── laravel.schemas.ts     # Orval output (TypeScript types only)
├── nuxt.config.ts
├── orval.config.ts
└── package.json
```

## Component Templates

### Basic Component

```vue
<!-- app/components/shared/EmployeeCard.vue -->
<script setup lang="ts">
interface Props {
  name: string
  status: { value: string; label: string }
}

const props = defineProps<Props>()
</script>

<template>
  <UCard>
    <div class="flex items-center gap-3">
      <UAvatar :text="name" size="md" />
      <div>
        <p class="font-medium">{{ name }}</p>
        <UBadge :label="status.label" size="sm" />
      </div>
    </div>
  </UCard>
</template>
```

### Component with Events

```vue
<!-- app/components/shared/ConfirmDialog.vue -->
<script setup lang="ts">
interface Props {
  title: string
  message: string
  open: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <UModal :open="open" @close="emit('cancel')">
    <template #header>{{ title }}</template>
    <p>{{ message }}</p>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton color="neutral" variant="outline" @click="emit('cancel')">Hủy</UButton>
        <UButton color="red" @click="emit('confirm')">Xác nhận</UButton>
      </div>
    </template>
  </UModal>
</template>
```

### Page Component — List

```vue
<!-- app/pages/employees/index.vue -->
<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { EmployeeResource, EmployeesIndexParams } from '#api/generated/laravel.schemas'

definePageMeta({
  layout: 'default'
})

const toast = useToast()

// --- List ---
const params = reactive<EmployeesIndexParams>({
  search: undefined,
  per_page: 10
})
const page = ref(1)

const { searchInput, onSearch } = useTableSearch((value) => {
  params.search = value
  page.value = 1
})

const { data, status, error, refresh } = useEmployeeList(
  computed(() => ({ ...params, page: page.value }))
)

const employees = computed<EmployeeResource[]>(() => {
  return (data.value?.data as unknown as EmployeeResource[]) ?? []
})

const columns: TableColumn<EmployeeResource>[] = [
  { accessorKey: 'name', header: 'Tên' },
  { accessorKey: 'email', header: 'Email' },
  { id: 'status', header: 'Trạng thái' },
  { id: 'actions', header: 'Thao tác' },
]

// --- CRUD Modals ---
const {
  showFormModal, formMode, editTarget, formApiErrors, handleFormError,
  openCreateModal, openEditModal,
  showDeleteModal, deleteTarget, openDeleteModal, closeDeleteModal
} = useCrudModals<EmployeeResource>()

const isSubmitting = ref(false)

async function handleFormSubmit(formData: { name: string, email: string }) {
  formApiErrors.value = {}
  isSubmitting.value = true
  try {
    if (formMode.value === 'create') {
      await apiCreateEmployee(formData)
      toast.add({ title: 'Thêm nhân viên thành công', color: 'success' })
    } else if (editTarget.value) {
      await apiUpdateEmployee(editTarget.value.id, formData)
      toast.add({ title: 'Cập nhật nhân viên thành công', color: 'success' })
    }
    await refresh()
    showFormModal.value = false
  } catch (err) {
    handleFormError(err)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div>
    <SharedCrudPageHeader title="Nhân viên" description="Quản lý danh sách nhân viên">
      <template #actions>
        <UButton icon="i-lucide-plus" label="Thêm nhân viên" @click="openCreateModal" />
      </template>
    </SharedCrudPageHeader>

    <!-- Search -->
    <div class="mb-4 flex items-center gap-3">
      <UInput
        v-model="searchInput"
        icon="i-lucide-search"
        placeholder="Tìm kiếm nhân viên..."
        class="max-w-sm"
        @update:model-value="onSearch"
      />
    </div>

    <SharedCrudTableSkeleton v-if="status === 'pending'" />

    <UAlert
      v-else-if="error"
      color="error"
      title="Lỗi"
      :description="(error as Error).message"
      icon="i-lucide-alert-circle"
    />

    <template v-else>
      <UTable :data="employees" :columns="columns" class="border border-[var(--ui-border)] rounded-lg">
        <!-- custom cell templates -->
      </UTable>

      <div v-if="data?.meta" class="flex justify-center mt-4">
        <UPagination v-model:page="page" :total="data.meta.total" :items-per-page="data.meta.per_page" show-edges :sibling-count="1" />
      </div>
    </template>

    <EmployeeFormModal v-model:open="showFormModal" :mode="formMode" :item="editTarget" :loading="isSubmitting" :api-errors="formApiErrors" @submit="handleFormSubmit" />
    <EmployeeDeleteModal v-model:open="showDeleteModal" :item="deleteTarget" :loading="isDeleting" @confirm="handleDelete" />
  </div>
</template>
```

### Page Component — Detail

```vue
<!-- app/pages/employees/[id].vue -->
<script setup lang="ts">
import type { EmployeeResource } from '#api/generated/laravel.schemas'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const id = computed(() => Number(route.params.id))
const toast = useToast()

const { data, status, error, refresh } = useEmployeeDetail(id)

const { useDynamicLabel } = useBreadcrumb()
useDynamicLabel(computed(() => data.value?.data?.name ?? null))

const employee = computed(() => data.value?.data ?? null)

// --- Edit ---
const {
  showFormModal, formMode, editTarget, formApiErrors, handleFormError,
  openEditModal,
  showDeleteModal, deleteTarget, openDeleteModal
} = useCrudModals<EmployeeResource>()

const isUpdating = ref(false)

async function handleFormSubmit(formData: { name: string, email: string }) {
  formApiErrors.value = {}
  if (!editTarget.value) return
  isUpdating.value = true
  try {
    await apiUpdateEmployee(editTarget.value.id, formData)
    toast.add({ title: 'Cập nhật nhân viên thành công', color: 'success' })
    await refresh()
    showFormModal.value = false
  } catch (err) {
    handleFormError(err)
  } finally {
    isUpdating.value = false
  }
}

// --- Delete ---
const isDeleting = ref(false)

async function handleDelete() {
  if (!deleteTarget.value) return
  isDeleting.value = true
  try {
    await apiDeleteEmployee(deleteTarget.value.id)
    toast.add({ title: 'Đã xoá nhân viên', color: 'success' })
    navigateTo('/employees')
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Xoá thất bại'), color: 'error' })
    showDeleteModal.value = false
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div>
    <!-- Loading -->
    <div v-if="status === 'pending'" class="space-y-4">
      <USkeleton class="h-8 w-48" />
      <USkeleton class="h-64 w-full" />
    </div>

    <!-- Error -->
    <UAlert v-else-if="error" color="error" title="Lỗi" :description="(error as Error).message" icon="i-lucide-alert-circle" />

    <!-- Content -->
    <div v-else-if="employee">
      <!-- Header with back, edit, delete buttons -->
      <!-- Detail info card -->
    </div>

    <EmployeeFormModal v-model:open="showFormModal" :mode="formMode" :item="editTarget" :loading="isUpdating" :api-errors="formApiErrors" @submit="handleFormSubmit" />
    <EmployeeDeleteModal v-model:open="showDeleteModal" :item="deleteTarget" :loading="isDeleting" @confirm="handleDelete" />
  </div>
</template>
```

### Layout Component

```vue
<!-- app/layouts/default.vue -->
<template>
  <div class="flex min-h-screen">
    <AppSidebar />
    <div class="flex flex-1 flex-col">
      <AppHeader />
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
```

### Composable

```ts
// app/composables/useAuth.ts
export const useAuth = () => {
  const token = useState<string | null>('auth-token', () => null)
  const isAuthenticated = computed(() => !!token.value)

  function login(newToken: string) {
    token.value = newToken
    if (import.meta.client) {
      localStorage.setItem('access_token', newToken)
    }
  }

  function logout() {
    token.value = null
    if (import.meta.client) {
      localStorage.removeItem('access_token')
    }
    navigateTo('/login')
  }

  return { token, isAuthenticated, login, logout }
}
```

## Page Structure Rules

### Every feature MUST have 2 pages

```
frontend/app/pages/{feature}/
├── index.vue              # List page (table, search, pagination, CRUD actions)
└── [id].vue               # Detail page (view + inline edit)
```

- **`index.vue`** — List page: table with search, pagination, create/edit/delete actions
- **`[id].vue`** — Detail page: view details with inline edit toggle

### Actions column MUST have header "Thao tác"

The actions column in every table **MUST** use `header: 'Thao tác'`:

```ts
const columns: TableColumn<EntityResource>[] = [
  { accessorKey: 'code', header: 'Mã' },
  { accessorKey: 'name', header: 'Tên' },
  { id: 'actions', header: 'Thao tác' },  // ← REQUIRED: always 'Thao tác'
]
```

**NEVER** use `header: ''` or omit the header for the actions column.

### Pages MUST extract logic into feature components

Pages should be **clean and readable**. Extract repeated or complex UI into feature-specific components under `components/{feature}/`:

```
frontend/app/components/{feature}/
├── {Feature}FormModal.vue        # Create/edit form modal
├── {Feature}DeleteModal.vue      # Delete confirmation modal (if custom logic needed)
└── {Feature}FilterBar.vue        # Search + filter bar (if complex filters)
```

**Rules:**
1. **Form modals** — Extract create/edit forms into `{Feature}FormModal.vue`. Props: `open`, `mode`, `item`, `loading`, `apiErrors`. Emits: `update:open`, `submit`.
2. **Delete modals** — Use `SharedCrudDeleteModal` for simple delete. Only create `{Feature}DeleteModal.vue` if custom logic needed (e.g., blocked message).
3. **Complex filters** — If filter bar has more than just search input, extract into a component.
4. **Table custom cells** — Keep simple cell templates inline in page. Extract to component only if cell content is complex (nested components, multiple states).
5. **Page script** — Should mainly contain: query setup, modal state management, mutation handlers. Keep it focused.

**Example — Clean list page structure:**
```vue
<template>
  <div>
    <SharedCrudPageHeader title="..." description="...">
      <template #actions><!-- create button --></template>
    </SharedCrudPageHeader>

    <!-- Search/Filter -->
    <!-- Table with SharedCrudTableSkeleton for loading -->
    <!-- Pagination -->

    <!-- Extracted modals -->
    <FeatureFormModal ... />
    <FeatureDeleteModal ... />  <!-- or SharedCrudDeleteModal -->
  </div>
</template>
```

## Conventions

- **Component files**: PascalCase (`EmployeeList.vue`, `AppSidebar.vue`)
- **Page files**: kebab-case or `[param]` (`index.vue`, `[id].vue`)
- **Composable files**: camelCase prefix `use` (`useAuth.ts`)
- **Component prefix**: `Ui` cho custom UI, `App` cho layout parts
- **Props**: Always `defineProps<Props>()` with typed interface, never `any`
- **Nuxt UI first**: Check if Nuxt UI has the component before creating custom
- **Auto-imports**: Do NOT import `ref`, `computed`, `watch`, `useRoute`, etc. — Nuxt auto-imports
- **API calls**: Use functions from `composables/api/` — NEVER call `$api()` with raw URLs in pages
- **Types**: Use TypeScript types from `#api/generated/laravel.schemas` (Orval generates types only)
- **Styling**: Tailwind CSS v4 utilities (activate `tailwindcss-development` skill)
- **Docker**: All pnpm commands via `docker exec residential_frontend <command>`
- **Ngôn ngữ**: Tất cả text hiển thị cho người dùng PHẢI viết tiếng Việt **có dấu**. Không dùng tiếng Việt không dấu.
  - Đúng: `Phòng ban`, `Thêm mới`, `Vui lòng nhập tên`, `Đăng nhập`, `Huỷ`, `Lưu`, `Chỉnh sửa`
  - Sai: `Phong ban`, `Them moi`, `Vui long nhap ten`, `Dang nhap`, `Huy`, `Luu`, `Chinh sua`
- **Auth middleware**: Dùng `auth.global.ts` (global middleware). KHÔNG khai báo `middleware: 'auth'` trong `definePageMeta` — nó tự động protect tất cả routes trừ `/login`.

## API Integration

### API Composables (Primary — `composables/api/`)

- **One file per module**: `useDepartments.ts`, `useJobTitles.ts`, `useProjects.ts`, `useAuthentication.ts`
- **Queries** (GET): use `useApiFetch<T>(url, opts)`. Naming: `use{Entity}List()`, `use{Entity}Detail()`
- **Mutations** (POST/PUT/DELETE): use `$api<T>(url, opts)`. Naming: `apiCreate{Entity}()`, `apiUpdate{Entity}()`, `apiDelete{Entity}()`
- **All API URLs for a module MUST be defined in its composable file**. Pages should NEVER call `$api()` directly with raw URLs — always use the named functions from the composable.

```ts
// composables/api/useEmployees.ts
import type { EmployeesIndex200, EmployeesIndexParams, EmployeesShow200, EmployeesStore201, EmployeesUpdate200, EmployeesDestroy200, CreateEmployeeRequest, UpdateEmployeeRequest } from '#api/generated/laravel.schemas'

export function useEmployeeList(params: MaybeRefOrGetter<EmployeesIndexParams & { page?: number }>) {
  return useApiFetch<EmployeesIndex200>('/pmc/employees', { query: params, watch: [params] })
}

export function useEmployeeDetail(id: MaybeRefOrGetter<number>) {
  return useApiFetch<EmployeesShow200>(computed(() => `/pmc/employees/${toValue(id)}`))
}

export function apiCreateEmployee(data: CreateEmployeeRequest) {
  return $api<EmployeesStore201>('/pmc/employees', { method: 'POST', body: data })
}

export function apiUpdateEmployee(id: number, data: UpdateEmployeeRequest) {
  return $api<EmployeesUpdate200>(`/pmc/employees/${id}`, { method: 'PUT', body: data })
}

export function apiDeleteEmployee(id: number) {
  return $api<EmployeesDestroy200>(`/pmc/employees/${id}`, { method: 'DELETE' })
}
```

### TypeScript Types (Orval — types only)

Orval generates TypeScript types from backend Swagger/OpenAPI. Import types from `#api/generated/laravel.schemas`:

```ts
import type { EmployeeResource, CreateEmployeeRequest } from '#api/generated/laravel.schemas'
```

### Regenerate types when backend changes

```bash
make api-generate
```

## Post-Write Code Review (REQUIRED)

After writing code, **MUST review before finishing the task**:

### 1. Duplication Check

Scan sibling pages and existing components for duplicated logic:

```bash
# So sánh code vừa viết với các page/component cùng cấp
grep -rn "pattern_from_new_code" frontend/app/pages/ frontend/app/components/
```

- Có block code nào **giống hoặc gần giống** với page/component khác không?
- Có type/interface nào đã được define ở file khác không?
- Có error handling pattern nào lặp lại không?

→ **Nếu có** → Tách ra `composables/` hoặc `utils/`.

### 2. Component Extraction Check

- Template có phần nào **dài hơn 30 dòng** mà có thể tách thành component riêng không?
- Có logic nào trong `<script>` **chỉ phục vụ 1 phần UI cụ thể** không? → Tách thành component + props/emits.
- Form modal, delete modal đã extract chưa? → `components/{feature}/{Feature}FormModal.vue`.

### 3. Reusability Assessment

- Code vừa viết **có khả năng dùng lại** ở page/feature khác trong tương lai không?
  - Reactive state + handlers lặp lại → `composables/use{Name}.ts`
  - Pure function (format, transform, validate) → `utils/{name}.ts`
  - UI pattern dùng chung → `components/shared/{domain}/{Name}.vue`
- Component chỉ dùng 1 nơi nhưng **pattern sẽ lặp lại**? → Tách ngay, đừng đợi duplicate.

### 4. Nuxt UI / Existing Code Check

- Có dùng component tự viết mà Nuxt UI đã cung cấp không? → Thay bằng Nuxt UI.
- Có import type/function mà `utils/` hoặc `composables/` đã có sẵn không? → Reuse.

→ **Nếu phát hiện vấn đề ở bất kỳ bước nào → refactor trước khi hoàn thành task.**

## Creation Checklist

- [ ] Scanned `components/shared/` — no duplicate component created
- [ ] Scanned `composables/` — no duplicate composable created
- [ ] Scanned `utils/` — no duplicate utility function written
- [ ] Checked Nuxt UI for existing component — use `UButton`, `UTable`, `UForm`, etc. first
- [ ] Reusability assessed — shared components in `shared/{domain}/`, logic in `composables/`, pure functions in `utils/`
- [ ] Checked generated types in `lib/api/generated/laravel.schemas.ts` — if missing, ran `make api-generate`
- [ ] If still no types, verified backend API exists (routes, controller, resource)
- [ ] API calls use functions from `composables/api/` — NEVER call `$api()` with raw URLs in pages
- [ ] Component file uses PascalCase (`.vue`)
- [ ] Page file uses kebab-case or `[param].vue`
- [ ] Props typed with `defineProps<Props>()` (no `any`)
- [ ] Used `<script setup lang="ts">` with Composition API
- [ ] No manual imports for `ref`, `computed`, `watch` — Nuxt auto-imports
- [ ] Tailwind CSS v4 for styling
- [ ] Loading (`v-if="status === 'pending'"`) and error (`v-else-if="error"`) states handled
- [ ] TypeScript strict — no `any`, no `@ts-ignore`
- [ ] Tất cả text hiển thị viết tiếng Việt **có dấu** (labels, placeholders, messages, toasts, errors)
- [ ] KHÔNG khai báo `middleware: 'auth'` trong `definePageMeta` — `auth.global.ts` đã tự động protect
