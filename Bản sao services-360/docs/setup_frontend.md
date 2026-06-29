# Frontend Setup — Nuxt.js

> Framework: Nuxt 4 | Vue 3 | TypeScript | Tailwind CSS v4 | TanStack Vue Query | Orval | Axios

## 1. Tech Stack

| Package | Version | Mục đích |
|---|---|---|
| `nuxt` | ^4 | Framework (SSR, file-based routing, auto-imports) |
| `vue` | ^3.5 | Core UI library |
| `@tanstack/vue-query` | ^5 | Data fetching, caching, mutations |
| `axios` | ^1 | HTTP client |
| `@nuxtjs/tailwindcss` | ^6 | Tailwind CSS module cho Nuxt |
| `tailwindcss` | ^4 | CSS framework |
| `orval` | ^8 (devDep) | Generate TypeScript types + Vue Query composables từ backend Swagger |

## 2. Directory Structure

```
frontend/
├── app/
│   ├── assets/
│   │   └── css/
│   │       └── main.css               # Tailwind CSS entry
│   ├── components/                     # Auto-imported Vue components
│   │   ├── ui/                         # Base UI primitives
│   │   │   ├── UiButton.vue
│   │   │   ├── UiInput.vue
│   │   │   ├── UiCard.vue
│   │   │   ├── UiModal.vue
│   │   │   ├── UiTable.vue
│   │   │   └── UiPagination.vue
│   │   ├── layout/                     # Layout parts
│   │   │   ├── AppSidebar.vue
│   │   │   ├── AppHeader.vue
│   │   │   └── AppFooter.vue
│   │   └── shared/                     # Shared business components
│   │       └── StatusBadge.vue
│   ├── composables/                    # Auto-imported composables
│   │   ├── useAuth.ts                  # Authentication state
│   │   └── useNotification.ts          # Toast/notification
│   ├── layouts/                        # Page layouts
│   │   ├── default.vue                 # Main layout (sidebar + header + content)
│   │   └── auth.vue                    # Auth pages (login, register)
│   ├── middleware/                      # Route middleware
│   │   └── auth.ts                     # Redirect to /login if not authenticated
│   ├── pages/                          # File-based routing
│   │   ├── index.vue                   # / → Dashboard
│   │   ├── login.vue                   # /login
│   │   └── [module]/                   # Dynamic module pages
│   │       ├── index.vue               # /employees → List
│   │       └── [id].vue                # /employees/:id → Detail
│   ├── plugins/                        # Nuxt plugins
│   │   └── vue-query.ts                # TanStack Vue Query + SSR hydration
│   ├── utils/                          # Auto-imported utility functions
│   │   └── format.ts                   # Date, currency, enum formatters
│   ├── app.vue                         # Root component
│   └── app.config.ts                   # Runtime app config
├── lib/
│   └── api/
│       ├── custom-instance.ts          # Axios instance (Orval mutator)
│       └── generated/                  # Orval output (DO NOT edit manually)
│           ├── models/                 # TypeScript types
│           │   ├── index.ts
│           │   ├── employeeResource.ts
│           │   └── ...
│           └── {tag}/                  # Vue Query composables per API tag
│               └── {tag}.ts            # useListEmployees, useCreateEmployee, ...
├── nuxt.config.ts
├── orval.config.ts
├── tsconfig.json
├── Dockerfile
├── package.json
└── .gitignore
```

### Quy tắc đặt tên

| Loại | Convention | Ví dụ |
|---|---|---|
| Component file | PascalCase | `UiButton.vue`, `AppSidebar.vue` |
| Page file | kebab-case | `index.vue`, `[id].vue` |
| Composable | camelCase, prefix `use` | `useAuth.ts` |
| Utility | camelCase | `format.ts` |
| Generated types | camelCase (auto) | `employeeResource.ts` |

### Component prefix convention

| Folder | Prefix | Ví dụ | Lý do |
|---|---|---|---|
| `components/ui/` | `Ui` | `UiButton`, `UiInput` | Tránh conflict với HTML tags |
| `components/layout/` | `App` | `AppSidebar`, `AppHeader` | Phân biệt layout vs page |
| `components/shared/` | Không bắt buộc | `StatusBadge` | Business components dùng chung |

## 3. Config Files

### 3.1 `nuxt.config.ts`

```ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },

  modules: ['@nuxtjs/tailwindcss'],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:8000',
    },
  },

  typescript: {
    strict: true,
  },

  devtools: { enabled: true },
})
```

### 3.2 `orval.config.ts`

```ts
import { defineConfig } from 'orval'

export default defineConfig({
  residential: {
    input: {
      target: 'http://residential_nginx/docs/api.json',
    },
    output: {
      mode: 'tags-split',
      target: 'lib/api/generated',
      schemas: 'lib/api/generated/models',
      client: 'vue-query',
      override: {
        mutator: {
          path: './lib/api/custom-instance.ts',
          name: 'customInstance',
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
      },
    },
  },
})
```

### 3.3 `app/plugins/vue-query.ts`

TanStack Vue Query plugin với SSR hydration.

```ts
import type {
  DehydratedState,
  VueQueryPluginOptions,
} from '@tanstack/vue-query'
import {
  VueQueryPlugin,
  QueryClient,
  hydrate,
  dehydrate,
} from '@tanstack/vue-query'
import { defineNuxtPlugin, useState } from '#imports'

export default defineNuxtPlugin((nuxt) => {
  const vueQueryState = useState<DehydratedState | null>('vue-query')

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  })

  const options: VueQueryPluginOptions = { queryClient }
  nuxt.vueApp.use(VueQueryPlugin, options)

  if (import.meta.server) {
    nuxt.hooks.hook('app:rendered', () => {
      vueQueryState.value = dehydrate(queryClient)
    })
  }

  if (import.meta.client) {
    hydrate(queryClient, vueQueryState.value)
  }
})
```

### 3.4 `lib/api/custom-instance.ts`

Axios instance dùng làm mutator cho Orval.

```ts
import Axios, { AxiosError, AxiosRequestConfig } from 'axios'

export const AXIOS_INSTANCE = Axios.create({
  baseURL: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

AXIOS_INSTANCE.interceptors.request.use(
  (config) => {
    if (import.meta.client) {
      const token = localStorage.getItem('access_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error),
)

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && import.meta.client) {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  return AXIOS_INSTANCE({
    ...config,
    ...options,
  }).then(({ data }) => data)
}

export type ErrorType<Error> = AxiosError<Error>
export type BodyType<BodyData> = BodyData
```

### 3.5 `app/assets/css/main.css`

```css
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.55 0.2 250);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}
```

### 3.6 `app/app.vue`

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

### 3.7 `app/layouts/default.vue`

```vue
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

### 3.8 `app/layouts/auth.vue`

```vue
<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
    <slot />
  </div>
</template>
```

### 3.9 `app/middleware/auth.ts`

```ts
export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.client) {
    const token = localStorage.getItem('access_token')
    if (!token && to.path !== '/login') {
      return navigateTo('/login')
    }
  }
})
```

## 4. Sử dụng Orval Generated Composables

### Generate types + composables

```bash
make api-generate
```

### Sử dụng trong component

```vue
<script setup lang="ts">
import { useListEmployees } from '~/lib/api/generated/employees/employees'
import type { EmployeeResource } from '~/lib/api/generated/models'

const { data, isLoading, error } = useListEmployees()
</script>

<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <ul v-else>
      <li v-for="employee in data?.data" :key="employee.id">
        {{ employee.name }}
      </li>
    </ul>
  </div>
</template>
```

### Mutation

```vue
<script setup lang="ts">
import { useCreateEmployee } from '~/lib/api/generated/employees/employees'
import type { CreateEmployeeBody } from '~/lib/api/generated/models'
import { useQueryClient } from '@tanstack/vue-query'

const queryClient = useQueryClient()
const { mutate, isPending } = useCreateEmployee()

function handleSubmit(formData: CreateEmployeeBody) {
  mutate(
    { data: formData },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['employees'] })
        navigateTo('/employees')
      },
    },
  )
}
</script>
```

## 5. Docker

### `Dockerfile`

```dockerfile
FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

### `compose.yml` — frontend service

```yaml
frontend:
  build:
    context: ./frontend
    dockerfile: Dockerfile
  container_name: residential_frontend
  restart: unless-stopped
  ports:
    - "3000:3000"
  volumes:
    - ./frontend:/app
    - /app/node_modules
    - /app/.nuxt
  networks:
    - residential_network
  environment:
    NUXT_PUBLIC_API_URL: http://nginx:80
  depends_on:
    - nginx
```

Lưu ý thay đổi so với Next.js:
- Volume: `/app/.nuxt` thay `/app/.next`
- Env: `NUXT_PUBLIC_API_URL` thay `NEXT_PUBLIC_API_URL`

## 6. Makefile Targets

```makefile
# ============================================================================
# FRONTEND (Nuxt.js)
# ============================================================================

## --- Frontend ---

frontend-install: ## Install frontend dependencies
	docker exec $(FRONTEND_CONTAINER) npm install

frontend-dev: ## Start frontend dev server
	docker exec $(FRONTEND_CONTAINER) npm run dev

frontend-build: ## Build frontend for production
	docker exec $(FRONTEND_CONTAINER) npm run build

frontend-shell: ## Open shell in frontend container
	docker exec -it $(FRONTEND_CONTAINER) sh

frontend-lint: ## Lint frontend code
	docker exec $(FRONTEND_CONTAINER) npm run lint

# ============================================================================
# API CLIENT (Orval)
# ============================================================================

## --- API Client ---

api-generate: ## Generate TypeScript types & Vue Query composables from backend Swagger
	docker exec $(APP_CONTAINER) php artisan scramble:export
	docker exec $(FRONTEND_CONTAINER) npm run api:generate

api-clean: ## Remove all generated API client files
	docker exec $(FRONTEND_CONTAINER) npm run api:clean

api-export: ## Export backend OpenAPI spec only
	docker exec $(APP_CONTAINER) php artisan scramble:export
```

## 7. package.json Scripts

```json
{
  "scripts": {
    "dev": "nuxt dev --host 0.0.0.0",
    "build": "nuxt build",
    "preview": "nuxt preview",
    "generate": "nuxt generate",
    "lint": "eslint .",
    "api:generate": "orval",
    "api:clean": "rm -rf lib/api/generated && mkdir -p lib/api/generated"
  }
}
```

## 8. Env Variables

| Variable | Dev | Docker | Mô tả |
|---|---|---|---|
| `NUXT_PUBLIC_API_URL` | `http://localhost:8000` | `http://nginx:80` | Backend API base URL |

## 9. API Flow

```
Backend (Laravel)
  ↓ Scramble auto-generate
/docs/api.json (OpenAPI spec)
  ↓ Orval reads spec
lib/api/generated/
  ├── models/          → TypeScript interfaces (EmployeeResource, CreateEmployeeBody, ...)
  └── {tag}/           → Vue Query composables (useListEmployees, useCreateEmployee, ...)
  ↓ Import in components
app/pages/employees/index.vue
  → useListEmployees()  → auto caching, refetch, loading/error states
```

## 10. Bước triển khai

1. Xóa `frontend/` cũ (Next.js)
2. Tạo Nuxt project: `npx nuxi@latest init frontend`
3. Cài packages:
   ```bash
   cd frontend
   npm install @tanstack/vue-query axios
   npm install -D orval @nuxtjs/tailwindcss tailwindcss
   ```
4. Tạo config files theo section 3
5. Tạo directory structure theo section 2
6. Update `compose.yml` (volume `.nuxt`, env `NUXT_PUBLIC_API_URL`)
7. Update `Makefile` theo section 6
8. Update `CLAUDE.md` — frontend rules (Vue thay React)
9. Update skills (`create-component` → Vue SFC template)
10. Update agents (`frontend-component-scout`, `api-contract-checker`)
11. `make api-generate` — re-generate composables cho Vue Query
12. `make frontend-dev` — verify chạy được
