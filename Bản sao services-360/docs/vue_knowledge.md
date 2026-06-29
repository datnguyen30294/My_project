# Vue.js / Nuxt.js — Kiến thức cần nắm

> Tài liệu dành cho developer có kinh nghiệm React, chuyển sang Vue/Nuxt.

## Mục lục

1. [So sánh nhanh React vs Vue](#1-so-sánh-nhanh-react-vs-vue)
2. [Vue Basics — Composition API](#2-vue-basics--composition-api)
3. [Reactivity — State Management](#3-reactivity--state-management)
4. [Lifecycle Hooks](#4-lifecycle-hooks)
5. [Template Syntax](#5-template-syntax)
6. [Component Communication](#6-component-communication)
7. [Nuxt.js — Framework Layer](#7-nuxtjs--framework-layer)
8. [Data Fetching & API](#8-data-fetching--api)
9. [Best Practices](#9-best-practices)
10. [Những lỗi hay mắc khi chuyển từ React sang](#10-những-lỗi-hay-mắc-khi-chuyển-từ-react-sang)

---

## 1. So sánh nhanh React vs Vue

| Concept | React | Vue 3 (Composition API) |
|---|---|---|
| Component file | `.tsx` (JSX) | `.vue` (SFC: template + script + style) |
| State | `useState()` | `ref()`, `reactive()` |
| Derived state | `useMemo()` | `computed()` |
| Side effects | `useEffect()` | `watch()`, `watchEffect()` |
| Lifecycle mount | `useEffect(() => {}, [])` | `onMounted()` |
| Lifecycle unmount | `useEffect(() => { return cleanup }, [])` | `onUnmounted()` |
| Props | `function Comp(props: Props)` | `defineProps<Props>()` |
| Events (callback) | `props.onChange()` | `defineEmits(['change'])` |
| Two-way binding | Không có (controlled component) | `v-model` + `defineModel()` |
| Context/Provider | `createContext()` + `useContext()` | `provide()` + `inject()` |
| Ref to DOM | `useRef()` | `ref()` + `template ref` |
| Conditional render | `{condition && <Comp/>}` | `v-if`, `v-else`, `v-show` |
| List render | `{items.map(item => ...)}` | `v-for` |
| CSS class | `className={...}` | `:class={...}` |
| Event handler | `onClick={handler}` | `@click="handler"` |
| Framework (SSR) | Next.js | Nuxt.js |
| Routing | App Router (file-based) | `pages/` (file-based) |
| Data fetching | `fetch()` in Server Component | `useFetch()`, `useAsyncData()` |
| Middleware | `middleware.ts` | `middleware/` directory |
| Auto-import | Không có | Có (components, composables, utils) |

---

## 2. Vue Basics — Composition API

### Single File Component (SFC)

Vue dùng file `.vue` với 3 phần: `<script setup>`, `<template>`, `<style>`.

```vue
<script setup lang="ts">
// Logic ở đây — tương đương function body của React component
import { ref, computed, onMounted } from 'vue'

// State
const count = ref(0)

// Derived state
const doubled = computed(() => count.value * 2)

// Method
function increment() {
  count.value++
}

// Lifecycle
onMounted(() => {
  console.log('Component mounted')
})
</script>

<template>
  <!-- Template ở đây — tương đương JSX return -->
  <div>
    <p>Count: {{ count }}</p>
    <p>Doubled: {{ doubled }}</p>
    <button @click="increment">+1</button>
  </div>
</template>

<style scoped>
/* CSS scoped cho component này — không leak ra ngoài */
p {
  color: blue;
}
</style>
```

### `<script setup>` là gì?

- Syntax sugar của Composition API — code ngắn gọn hơn
- Tất cả biến, function khai báo ở đây **tự động available trong template**
- Không cần `return {}` như Options API
- **Luôn dùng `<script setup>`** — đây là cách viết recommended

### So sánh trực quan

```tsx
// React
function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
}
```

```vue
<!-- Vue -->
<script setup>
const count = ref(0)
</script>
<template>
  <button @click="count++">Count: {{ count }}</button>
</template>
```

---

## 3. Reactivity — State Management

### `ref()` — State đơn giản (thay `useState`)

```ts
import { ref } from 'vue'

const count = ref(0)          // number
const name = ref('Thai')      // string
const items = ref<string[]>([])  // typed array

// Đọc/ghi trong script: dùng .value
count.value++
name.value = 'New Name'
items.value.push('item')

// Trong template: KHÔNG cần .value (Vue tự unwrap)
// {{ count }}  ← đúng
// {{ count.value }}  ← SAI
```

**Quy tắc quan trọng:** Trong `<script>` luôn dùng `.value`, trong `<template>` không bao giờ dùng `.value`.

### `reactive()` — State dạng object

```ts
import { reactive } from 'vue'

const form = reactive({
  name: '',
  email: '',
  status: 'active',
})

// Đọc/ghi trực tiếp — KHÔNG cần .value
form.name = 'Thai'
form.email = 'thai@example.com'
```

**Khi nào dùng `ref` vs `reactive`?**

| Dùng `ref()` khi | Dùng `reactive()` khi |
|---|---|
| Giá trị primitive (string, number, boolean) | Object/form state phức tạp |
| Cần reassign toàn bộ giá trị | Không cần reassign toàn bộ |
| Default choice — an toàn hơn | Cẩn thận: không destructure được |

**Khuyến nghị:** Mới bắt đầu thì **dùng `ref()` cho mọi thứ** — đơn giản, ít bug.

### `computed()` — Derived state (thay `useMemo`)

```ts
import { ref, computed } from 'vue'

const items = ref([1, 2, 3, 4, 5])
const search = ref('')

// Tự động recalculate khi items hoặc search thay đổi
const filteredItems = computed(() => {
  return items.value.filter(i => String(i).includes(search.value))
})

// computed là read-only — không gán .value được
```

### `watch()` — Theo dõi thay đổi (thay `useEffect`)

```ts
import { ref, watch } from 'vue'

const searchQuery = ref('')

// Watch 1 giá trị
watch(searchQuery, (newValue, oldValue) => {
  console.log(`Search changed: ${oldValue} → ${newValue}`)
})

// Watch nhiều giá trị
const page = ref(1)
watch([searchQuery, page], ([newSearch, newPage]) => {
  // Fetch data khi search hoặc page thay đổi
  fetchData(newSearch, newPage)
})

// Watch với options
watch(searchQuery, (newValue) => {
  fetchData(newValue)
}, {
  immediate: true,  // Chạy ngay lần đầu (giống useEffect với deps)
  deep: true,        // Deep watch cho object/array
})
```

### `watchEffect()` — Auto-track dependencies

```ts
import { ref, watchEffect } from 'vue'

const url = ref('/api/employees')
const data = ref(null)

// Tự động track tất cả reactive deps bên trong
// Giống useEffect KHÔNG có dependency array — nhưng thông minh hơn
watchEffect(async () => {
  const response = await fetch(url.value)
  data.value = await response.json()
  // Vue tự biết: effect này phụ thuộc vào url.value
})
```

### So sánh `watch` vs `watchEffect`

| `watch()` | `watchEffect()` |
|---|---|
| Chỉ định rõ source để watch | Tự detect dependencies |
| Có `oldValue` | Không có `oldValue` |
| Lazy (không chạy lần đầu, trừ `immediate: true`) | Chạy ngay lần đầu |
| Dùng khi cần control chính xác | Dùng khi muốn đơn giản |

---

## 4. Lifecycle Hooks

### Mapping React → Vue

```
React                          Vue 3
─────────────────────────────────────────────
Component function body    →   <script setup> (chạy 1 lần khi create)
useEffect(() => {}, [])    →   onMounted()
useEffect cleanup return   →   onUnmounted()
useEffect(() => {}, [dep]) →   watch(dep, callback)
No equivalent              →   onBeforeMount()
No equivalent              →   onBeforeUpdate()
No equivalent              →   onUpdated()
```

### Ví dụ

```ts
import { onMounted, onUnmounted, onBeforeUnmount } from 'vue'

// Chạy sau khi DOM render xong
onMounted(() => {
  console.log('Mounted — DOM ready')
  window.addEventListener('resize', handleResize)
})

// Cleanup trước khi component bị destroy
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

// Sau khi component bị destroy
onUnmounted(() => {
  console.log('Unmounted — cleanup done')
})
```

### Thứ tự lifecycle

```
setup()            ← script setup chạy ở đây
  ↓
onBeforeMount()
  ↓
onMounted()        ← DOM ready, có thể truy cập DOM elements
  ↓
onBeforeUpdate()   ← trước khi re-render (khi reactive data thay đổi)
  ↓
onUpdated()        ← sau khi re-render
  ↓
onBeforeUnmount()  ← trước khi destroy (cleanup timers, listeners)
  ↓
onUnmounted()      ← đã destroy xong
```

**Hay dùng nhất:** `onMounted` (init) và `onBeforeUnmount` (cleanup). Các hook khác ít khi cần.

---

## 5. Template Syntax

### Interpolation — Hiển thị data

```vue
<template>
  <!-- Text -->
  <p>{{ message }}</p>

  <!-- Expression -->
  <p>{{ count + 1 }}</p>
  <p>{{ isActive ? 'Active' : 'Inactive' }}</p>
  <p>{{ items.length }}</p>
</template>
```

### Directive — Chỉ thị đặc biệt

#### `v-if` / `v-else-if` / `v-else` — Conditional rendering

```vue
<!-- React: {isLoading && <Spinner/>} -->
<!-- Vue: -->
<div v-if="isLoading">Loading...</div>
<div v-else-if="error">Error: {{ error.message }}</div>
<div v-else>
  {{ data }}
</div>
```

#### `v-show` — Toggle visibility (dùng CSS display)

```vue
<!-- v-if: mount/unmount DOM element -->
<!-- v-show: toggle display:none — element vẫn tồn tại trong DOM -->
<div v-show="isVisible">Nội dung</div>
```

**Khi nào dùng?** `v-if` cho điều kiện ít thay đổi. `v-show` cho toggle thường xuyên (modal, dropdown).

#### `v-for` — List rendering

```vue
<!-- React: {items.map(item => <li key={item.id}>{item.name}</li>)} -->
<!-- Vue: -->
<ul>
  <li v-for="item in items" :key="item.id">
    {{ item.name }}
  </li>
</ul>

<!-- Với index -->
<li v-for="(item, index) in items" :key="item.id">
  {{ index }}. {{ item.name }}
</li>
```

**Quan trọng:** Luôn có `:key` khi dùng `v-for`.

#### `v-bind` (`:`) — Bind attribute

```vue
<!-- React: <img src={imageUrl} className={classes} /> -->
<!-- Vue: -->
<img :src="imageUrl" :class="classes" />
<a :href="url">Link</a>

<!-- Dynamic class -->
<div :class="{ active: isActive, 'text-red-500': hasError }">...</div>
<div :class="[baseClass, isActive ? 'active' : '']">...</div>

<!-- Dynamic style -->
<div :style="{ color: textColor, fontSize: size + 'px' }">...</div>
```

#### `v-on` (`@`) — Event handler

```vue
<!-- React: <button onClick={handleClick}> -->
<!-- Vue: -->
<button @click="handleClick">Click</button>

<!-- Inline -->
<button @click="count++">+1</button>

<!-- Với argument -->
<button @click="deleteItem(item.id)">Delete</button>

<!-- Event modifiers (Vue đặc biệt — React không có) -->
<form @submit.prevent="handleSubmit">...</form>    <!-- preventDefault -->
<a @click.stop="handleClick">...</a>               <!-- stopPropagation -->
<input @keyup.enter="search" />                    <!-- chỉ khi Enter -->
<button @click.once="initOnce">Init</button>       <!-- chỉ trigger 1 lần -->
```

#### `v-model` — Two-way binding

```vue
<!-- React: <input value={name} onChange={e => setName(e.target.value)} /> -->
<!-- Vue: -->
<input v-model="name" />

<!-- Tương đương viết dài: -->
<input :value="name" @input="name = $event.target.value" />

<!-- Các loại input -->
<input v-model="text" type="text" />
<textarea v-model="message" />
<input v-model="checked" type="checkbox" />
<select v-model="selected">
  <option value="a">A</option>
  <option value="b">B</option>
</select>

<!-- Modifiers -->
<input v-model.trim="name" />         <!-- auto trim -->
<input v-model.number="age" />        <!-- convert to number -->
<input v-model.lazy="search" />       <!-- update on change thay vì input -->
```

---

## 6. Component Communication

### Props — Parent → Child

```vue
<!-- Parent -->
<EmployeeCard :name="employee.name" :status="employee.status" />

<!-- Child: EmployeeCard.vue -->
<script setup lang="ts">
interface Props {
  name: string
  status: 'active' | 'inactive'
}

const props = defineProps<Props>()
// Dùng: props.name, props.status
</script>

<template>
  <div>{{ name }} — {{ status }}</div>
  <!-- Trong template: truy cập trực tiếp, không cần props. -->
</template>
```

#### Props với default values

```ts
interface Props {
  name: string
  count?: number
  items?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  items: () => [],    // Object/array default phải là function
})
```

### Emits — Child → Parent (thay callback props)

```vue
<!-- Parent -->
<EmployeeForm @submit="handleCreate" @cancel="showForm = false" />

<!-- Child: EmployeeForm.vue -->
<script setup lang="ts">
const emit = defineEmits<{
  submit: [data: { name: string; email: string }]
  cancel: []
}>()

function handleSubmit() {
  emit('submit', { name: 'Thai', email: 'thai@example.com' })
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <!-- form fields -->
    <button type="submit">Save</button>
    <button type="button" @click="emit('cancel')">Cancel</button>
  </form>
</template>
```

### `defineModel()` — Two-way binding cho custom component (Vue 3.4+)

```vue
<!-- Parent -->
<SearchInput v-model="searchQuery" />

<!-- Child: SearchInput.vue -->
<script setup lang="ts">
const model = defineModel<string>()
</script>

<template>
  <input :value="model" @input="model = ($event.target as HTMLInputElement).value" />
</template>
```

### `provide()` / `inject()` — Thay Context API

```vue
<!-- Ancestor component -->
<script setup>
import { provide, ref } from 'vue'

const currentUser = ref({ id: 1, name: 'Thai' })
provide('currentUser', currentUser)
</script>

<!-- Deep child component (bất kỳ cấp nào) -->
<script setup>
import { inject } from 'vue'

const currentUser = inject('currentUser')
// currentUser.value.name → 'Thai'
</script>
```

### Slots — Thay `children` và `render props`

```vue
<!-- React: <Card>{children}</Card> -->
<!-- Vue: -->
<Card>
  <p>Nội dung bên trong</p>
</Card>

<!-- Card.vue -->
<template>
  <div class="card">
    <slot />  <!-- children render ở đây -->
  </div>
</template>
```

#### Named slots

```vue
<!-- Parent -->
<Card>
  <template #header>
    <h2>Title</h2>
  </template>

  <template #default>
    <p>Main content</p>
  </template>

  <template #footer>
    <button>Action</button>
  </template>
</Card>

<!-- Card.vue -->
<template>
  <div class="card">
    <header><slot name="header" /></header>
    <main><slot /></main>  <!-- default slot -->
    <footer><slot name="footer" /></footer>
  </div>
</template>
```

### Template Refs — Truy cập DOM element

```vue
<script setup>
import { ref, onMounted } from 'vue'

const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<template>
  <input ref="inputRef" />
</template>
```

---

## 7. Nuxt.js — Framework Layer

### Nuxt là gì so với Vue?

```
Vue  = React
Nuxt = Next.js

Vue cung cấp: component, reactivity, template
Nuxt thêm:    SSR, file-based routing, auto-imports, layouts, middleware, server API
```

### Auto-imports — Không cần import

Nuxt tự import mọi thứ. **Đây là điểm khác lớn nhất với React/Next.js.**

```vue
<script setup>
// KHÔNG CẦN IMPORT — Nuxt tự làm:
// ❌ import { ref, computed } from 'vue'
// ❌ import { useRoute, navigateTo } from '#imports'

// Dùng thẳng
const count = ref(0)
const route = useRoute()
const doubled = computed(() => count.value * 2)
</script>
```

Những gì được auto-import:
- **Vue APIs**: `ref`, `reactive`, `computed`, `watch`, `onMounted`, ...
- **Nuxt composables**: `useFetch`, `useAsyncData`, `useState`, `useRoute`, `useRouter`, `navigateTo`, ...
- **Components** trong `components/` directory
- **Composables** trong `composables/` directory
- **Utils** trong `utils/` directory

### File-based Routing

```
pages/
├── index.vue              →  /
├── login.vue              →  /login
├── about.vue              →  /about
├── employees/
│   ├── index.vue          →  /employees
│   ├── create.vue         →  /employees/create
│   └── [id].vue           →  /employees/:id  (dynamic route)
└── [...slug].vue          →  catch-all route
```

#### Page component

```vue
<!-- pages/employees/[id].vue -->
<script setup lang="ts">
// definePageMeta — cấu hình page (layout, middleware)
definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

// Lấy route params
const route = useRoute()
const id = route.params.id  // string

// Navigation
const router = useRouter()
function goBack() {
  router.push('/employees')
  // hoặc: navigateTo('/employees')
}
</script>
```

### Layouts

```vue
<!-- layouts/default.vue -->
<template>
  <div class="flex min-h-screen">
    <AppSidebar />
    <div class="flex flex-1 flex-col">
      <AppHeader />
      <main class="flex-1 p-6">
        <slot />  <!-- Page content render ở đây -->
      </main>
    </div>
  </div>
</template>
```

### Middleware — Route guard

```ts
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.client) {
    const token = localStorage.getItem('access_token')
    if (!token) {
      return navigateTo('/login')
    }
  }
})
```

### `useState()` — Shared state across components (SSR-safe)

```ts
// composables/useCounter.ts
export const useCounter = () => {
  // useState giữ state giữa các components VÀ SSR-safe
  // Key 'counter' đảm bảo chỉ có 1 instance
  const count = useState('counter', () => 0)

  function increment() {
    count.value++
  }

  return { count, increment }
}
```

```vue
<!-- Bất kỳ component nào cũng dùng được, state chia sẻ -->
<script setup>
const { count, increment } = useCounter()
</script>
```

---

## 8. Data Fetching & API

### Cách 1: Nuxt built-in `useFetch` (cho request đơn giản)

```vue
<script setup>
// SSR-safe — fetch trên server, hydrate trên client
const { data, status, error, refresh } = await useFetch('/api/employees', {
  baseURL: 'http://localhost:8000',
})
// status: 'idle' | 'pending' | 'success' | 'error'
</script>

<template>
  <div v-if="status === 'pending'">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <ul v-else>
    <li v-for="emp in data?.data" :key="emp.id">{{ emp.name }}</li>
  </ul>
</template>
```

### Cách 2: TanStack Vue Query + Orval (recommended cho project này)

Orval generate Vue Query composables từ backend Swagger. Dùng giống React Query nhưng với Vue.

```vue
<script setup lang="ts">
import { useListEmployees } from '~/lib/api/generated/employees/employees'

const { data, isLoading, error } = useListEmployees()
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <ul v-else>
    <li v-for="emp in data?.data" :key="emp.id">{{ emp.name }}</li>
  </ul>
</template>
```

#### Mutation

```vue
<script setup lang="ts">
import { useCreateEmployee } from '~/lib/api/generated/employees/employees'
import { useQueryClient } from '@tanstack/vue-query'

const queryClient = useQueryClient()
const { mutate, isPending } = useCreateEmployee()

function handleSubmit(formData: CreateEmployeeBody) {
  mutate(
    { data: formData },
    {
      onSuccess: () => {
        // Invalidate cache → tự refetch list
        queryClient.invalidateQueries({ queryKey: ['employees'] })
        navigateTo('/employees')
      },
    },
  )
}
</script>
```

### So sánh

| | `useFetch` (Nuxt) | Vue Query + Orval |
|---|---|---|
| Setup | Zero config | Cần plugin + orval config |
| Type safety | Manual typing | Auto-generated từ Swagger |
| Caching | Basic (key-based) | Advanced (stale-while-revalidate) |
| Mutations | Không hỗ trợ | `useMutation` built-in |
| Cache invalidation | Manual `refresh()` | `queryClient.invalidateQueries()` |
| Optimistic updates | Không | Có |
| Devtools | Không | Vue Query Devtools |
| Dùng khi | One-off fetch, SSR pages | CRUD apps, complex data flows |

**Trong project này:** Dùng **Vue Query + Orval** cho mọi API calls vì backend đã có Swagger.

---

## 9. Best Practices

### Component

1. **Luôn dùng `<script setup lang="ts">`** — ngắn gọn, type-safe
2. **1 component = 1 file** — không khai báo nhiều component trong 1 file
3. **Đặt tên PascalCase** — `EmployeeList.vue`, `UiButton.vue`
4. **Props interface riêng** — type rõ ràng, không dùng `any`
5. **Composable cho logic phức tạp** — tách logic ra `composables/`, giữ component clean

### Reactivity

6. **Mới bắt đầu: dùng `ref()` cho mọi thứ** — predictable, ít bug
7. **Không destructure `reactive()` object** — mất reactivity
8. **Dùng `computed()` thay vì tính toán trong template** — cached, performance
9. **`watch` với `immediate: true`** nếu cần chạy lần đầu

```ts
// ❌ SAI — mất reactivity
const state = reactive({ count: 0 })
const { count } = state  // count không reactive nữa!

// ✅ ĐÚNG
const state = reactive({ count: 0 })
// Dùng state.count trực tiếp

// ✅ ĐÚNG — hoặc dùng ref
const count = ref(0)
```

### Template

10. **`v-if` vs `v-show`** — `v-if` cho ít toggle, `v-show` cho toggle thường xuyên
11. **Luôn có `:key` trong `v-for`** — không dùng index làm key nếu list thay đổi
12. **Event modifiers** — dùng `.prevent`, `.stop` thay vì `e.preventDefault()` trong handler
13. **Không viết logic phức tạp trong template** — tách ra computed hoặc method

```vue
<!-- ❌ SAI — logic phức tạp trong template -->
<div>{{ items.filter(i => i.active).sort((a,b) => a.name.localeCompare(b.name)).length }}</div>

<!-- ✅ ĐÚNG — dùng computed -->
<div>{{ activeItemCount }}</div>
```

### Nuxt

14. **Tận dụng auto-import** — không import `ref`, `computed`, `watch` thủ công
15. **Composables trong `composables/`** — tự động available everywhere
16. **`definePageMeta` cho layout/middleware** — không set ở ngoài component
17. **`useState()` cho shared state** — SSR-safe, không dùng global variable
18. **Tên component prefix** — `Ui` cho UI primitives, `App` cho layout parts

### Performance

19. **`v-once`** cho content tĩnh không bao giờ thay đổi
20. **`<Suspense>` + `<NuxtLoadingIndicator>`** cho loading states
21. **Lazy load components** — `const Modal = defineAsyncComponent(() => import('./Modal.vue'))`

---

## 10. Những lỗi hay mắc khi chuyển từ React sang

### Lỗi 1: Quên `.value` trong script

```ts
// ❌ SAI
const count = ref(0)
count = 1  // Gán lại biến, không phải cập nhật ref
console.log(count)  // Ref object, không phải giá trị

// ✅ ĐÚNG
count.value = 1
console.log(count.value)  // 1
```

### Lỗi 2: Dùng `.value` trong template

```vue
<!-- ❌ SAI -->
<p>{{ count.value }}</p>

<!-- ✅ ĐÚNG — template tự unwrap -->
<p>{{ count }}</p>
```

### Lỗi 3: Return JSX thay vì dùng template

```vue
<!-- ❌ SAI — nghĩ kiểu React -->
<script setup>
// Không có return JSX ở đây
</script>

<!-- ✅ ĐÚNG — UI viết trong template -->
<template>
  <div>...</div>
</template>
```

### Lỗi 4: Dùng `onChange` thay `v-model`

```vue
<!-- ❌ React pattern -->
<input :value="name" @input="name = $event.target.value" />

<!-- ✅ Vue pattern — ngắn gọn hơn -->
<input v-model="name" />
```

### Lỗi 5: Import mọi thứ (Nuxt auto-import)

```ts
// ❌ Không cần trong Nuxt
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { navigateTo } from '#imports'

// ✅ Dùng thẳng — Nuxt tự import
const count = ref(0)
const route = useRoute()
```

### Lỗi 6: Dùng `useEffect` pattern cho Vue

```ts
// ❌ React pattern
// useEffect(() => { fetchData() }, [searchQuery])

// ✅ Vue pattern
watch(searchQuery, () => {
  fetchData()
})

// Hoặc
watchEffect(() => {
  fetchData(searchQuery.value)
})
```

### Lỗi 7: Destructure reactive object

```ts
// ❌ Mất reactivity
const { count } = reactive({ count: 0 })

// ✅ Dùng toRefs nếu cần destructure
const state = reactive({ count: 0 })
const { count } = toRefs(state)  // count là Ref<number>
```

---

## Tài liệu tham khảo

- Vue 3 docs: https://vuejs.org/guide/introduction
- Nuxt docs: https://nuxt.com/docs
- TanStack Vue Query: https://tanstack.com/query/latest/docs/framework/vue/overview
- Orval Vue Query: https://orval.dev/docs/guides/vue-query
- Vue Composition API cheat sheet: https://vuejs.org/api/composition-api-setup
