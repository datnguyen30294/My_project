# Tổng Quan Hệ Thống Frontend - Residential Management

## 1. Công Nghệ & Framework

### 1.1. Tech Stack
- **Framework**: Nuxt.js 3 (Vue.js 3 Composition API)
- **State Management**: Pinia
- **UI Components**: Tailwind CSS + HeadlessUI
- **API Client**: Axios với interceptors
- **Form Validation**: VeeValidate + Yup
- **Charts & Analytics**: Chart.js / ApexCharts
- **Date Handling**: Day.js
- **Icons**: Heroicons
- **Real-time**: Socket.IO (cho notifications)

### 1.2. Architectural Pattern
**Feature-Sliced Design (FSD)** - Tổ chức code theo features/modules tương ứng với backend modules, đảm bảo scalability và maintainability.

## 2. Kiến Trúc Frontend

### 2.1. Sơ Đồ Tổng Thể

```
┌────────────────────────────────────────────────────────────────┐
│                    NUXT.JS APPLICATION                          │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              PRESENTATION LAYER                           │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │ │
│  │  │   Pages     │  │  Layouts    │  │ Components  │      │ │
│  │  │             │  │             │  │             │      │ │
│  │  │ - Home      │  │ - Default   │  │ - Shared    │      │ │
│  │  │ - Product   │  │ - Admin     │  │ - Module    │      │ │
│  │  │ - Cart      │  │ - Auth      │  │ - UI        │      │ │
│  │  │ - Order     │  │ - Dashboard │  │             │      │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘      │ │
│  └───────────────────────────────────────────────────────────┘ │
│                              │                                  │
│                              ▼                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              STATE MANAGEMENT (PINIA)                     │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │ │
│  │  │Commerce  │  │ Payment  │  │ Rating   │  │Analytics │ │ │
│  │  │  Store   │  │  Store   │  │  Store   │  │  Store   │ │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │ │
│  │  ┌──────────┐  ┌──────────┐                              │ │
│  │  │   Auth   │  │   Cart   │                              │ │
│  │  │  Store   │  │  Store   │                              │ │
│  │  └──────────┘  └──────────┘                              │ │
│  └───────────────────────────────────────────────────────────┘ │
│                              │                                  │
│                              ▼                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │           API LAYER (Composables & Services)              │ │
│  │  ┌──────────────────────────────────────────────────────┐│ │
│  │  │          API Client Configuration                    ││ │
│  │  │  - Axios Instance                                    ││ │
│  │  │  - Request Interceptor (Auth Token)                 ││ │
│  │  │  - Response Interceptor (Error Handling)            ││ │
│  │  │  - Retry Logic                                       ││ │
│  │  └──────────────────────────────────────────────────────┘│ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│ │
│  │  │ useAPI   │  │useCommerce│ │usePayment│  │useRating ││ │
│  │  │ Service  │  │ Service  │  │ Service  │  │ Service  ││ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘│ │
│  └───────────────────────────────────────────────────────────┘ │
│                              │                                  │
│                              ▼                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │             MIDDLEWARE & PLUGINS                          │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │ │
│  │  │   Auth   │  │  Toast   │  │  Error   │  │  Loading │ │ │
│  │  │Middleware│  │ Plugin   │  │ Handler  │  │  Plugin  │ │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │ │
│  └───────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│                   LARAVEL API BACKEND                           │
│                   (API Gateway + Modules)                       │
└────────────────────────────────────────────────────────────────┘
```

## 3. Cấu Trúc Thư Mục Nuxt.js

### 3.1. Feature-Sliced Design Structure

```
/
├── .nuxt/                           # Nuxt build output
├── .output/                         # Production build
│
├── app/
│   ├── app.vue                      # Root component
│   └── error.vue                    # Error page
│
├── assets/                          # Static assets
│   ├── css/
│   │   ├── main.css                # Tailwind directives
│   │   └── animations.css          # Custom animations
│   ├── images/
│   └── fonts/
│
├── components/                      # Shared components
│   ├── ui/                         # Base UI components
│   │   ├── Button/
│   │   │   ├── UiButton.vue
│   │   │   └── UiButtonGroup.vue
│   │   ├── Card/
│   │   │   ├── UiCard.vue
│   │   │   ├── UiCardHeader.vue
│   │   │   └── UiCardBody.vue
│   │   ├── Form/
│   │   │   ├── UiInput.vue
│   │   │   ├── UiSelect.vue
│   │   │   ├── UiTextarea.vue
│   │   │   ├── UiCheckbox.vue
│   │   │   └── UiRadio.vue
│   │   ├── Modal/
│   │   │   ├── UiModal.vue
│   │   │   └── UiModalConfirm.vue
│   │   ├── Table/
│   │   │   ├── UiTable.vue
│   │   │   ├── UiTableHeader.vue
│   │   │   └── UiTableRow.vue
│   │   ├── Badge/
│   │   │   └── UiBadge.vue
│   │   ├── Loading/
│   │   │   ├── UiSpinner.vue
│   │   │   └── UiSkeleton.vue
│   │   └── Pagination/
│   │       └── UiPagination.vue
│   │
│   ├── common/                     # Shared business components
│   │   ├── Header/
│   │   │   ├── AppHeader.vue
│   │   │   ├── AppNavigation.vue
│   │   │   └── UserMenu.vue
│   │   ├── Footer/
│   │   │   └── AppFooter.vue
│   │   ├── Sidebar/
│   │   │   └── AppSidebar.vue
│   │   └── Notification/
│   │       ├── NotificationBell.vue
│   │       └── NotificationList.vue
│   │
│   └── features/                   # Feature-specific components
│       ├── commerce/               # Commerce Module Components
│       │   ├── product/
│       │   │   ├── ProductCard.vue
│       │   │   ├── ProductList.vue
│       │   │   ├── ProductDetail.vue
│       │   │   ├── ProductFilter.vue
│       │   │   └── ProductSearch.vue
│       │   ├── cart/
│       │   │   ├── CartDrawer.vue
│       │   │   ├── CartItem.vue
│       │   │   ├── CartSummary.vue
│       │   │   └── CartEmpty.vue
│       │   ├── order/
│       │   │   ├── OrderList.vue
│       │   │   ├── OrderCard.vue
│       │   │   ├── OrderDetail.vue
│       │   │   ├── OrderTimeline.vue
│       │   │   └── OrderStatus.vue
│       │   └── vendor/
│       │       ├── VendorCard.vue
│       │       ├── VendorProfile.vue
│       │       └── VendorProducts.vue
│       │
│       ├── payment/                # Payment Module Components
│       │   ├── PaymentMethod.vue
│       │   ├── PaymentForm.vue
│       │   ├── PaymentStatus.vue
│       │   ├── InvoiceDetail.vue
│       │   └── TransactionHistory.vue
│       │
│       ├── rating/                 # Rating Module Components
│       │   ├── RatingStars.vue
│       │   ├── RatingForm.vue
│       │   ├── ReviewList.vue
│       │   ├── ReviewCard.vue
│       │   ├── ComplaintForm.vue
│       │   └── ComplaintStatus.vue
│       │
│       └── analytics/              # Analytics Module Components
│           ├── dashboard/
│           │   ├── DashboardWidget.vue
│           │   ├── SalesChart.vue
│           │   ├── OrdersChart.vue
│           │   └── RevenueChart.vue
│           └── reports/
│               ├── ReportTable.vue
│               ├── ReportFilter.vue
│               └── ReportExport.vue
│
├── composables/                    # Reusable composition functions
│   ├── api/                       # API composables
│   │   ├── useApi.ts              # Base API client
│   │   ├── useCommerce.ts         # Commerce API
│   │   ├── usePayment.ts          # Payment API
│   │   ├── useRating.ts           # Rating API
│   │   └── useAnalytics.ts        # Analytics API
│   │
│   ├── auth/
│   │   ├── useAuth.ts             # Authentication
│   │   └── usePermission.ts       # Authorization
│   │
│   ├── ui/                        # UI-related composables
│   │   ├── useToast.ts            # Toast notifications
│   │   ├── useModal.ts            # Modal management
│   │   ├── useLoading.ts          # Loading states
│   │   └── usePagination.ts       # Pagination logic
│   │
│   └── utils/
│       ├── useDebounce.ts         # Debounce
│       ├── useFormatters.ts       # Date/Currency formatters
│       └── useValidation.ts       # Form validation
│
├── layouts/                        # Application layouts
│   ├── default.vue                # Default layout (with header/footer)
│   ├── admin.vue                  # Admin dashboard layout
│   ├── auth.vue                   # Auth pages layout (login/register)
│   └── dashboard.vue              # Dashboard layout with sidebar
│
├── middleware/                     # Route middleware
│   ├── auth.ts                    # Authentication guard
│   ├── guest.ts                   # Guest only (login/register)
│   ├── admin.ts                   # Admin authorization
│   └── module-access.ts           # Module-level access control
│
├── pages/                          # File-based routing
│   ├── index.vue                  # Home page
│   │
│   ├── auth/                      # Authentication pages
│   │   ├── login.vue
│   │   ├── register.vue
│   │   └── forgot-password.vue
│   │
│   ├── shop/                      # Commerce module pages
│   │   ├── index.vue              # Product listing
│   │   ├── [slug].vue             # Product detail
│   │   ├── cart.vue               # Shopping cart
│   │   ├── checkout.vue           # Checkout
│   │   └── vendors/
│   │       ├── index.vue          # Vendor listing
│   │       └── [id].vue           # Vendor profile
│   │
│   ├── orders/                    # Order management
│   │   ├── index.vue              # Order list
│   │   └── [id].vue               # Order detail
│   │
│   ├── payment/                   # Payment pages
│   │   ├── methods.vue            # Payment methods
│   │   ├── success.vue            # Payment success
│   │   ├── failed.vue             # Payment failed
│   │   └── invoices/
│   │       ├── index.vue          # Invoice list
│   │       └── [id].vue           # Invoice detail
│   │
│   ├── reviews/                   # Rating & Review pages
│   │   ├── index.vue              # My reviews
│   │   └── create.vue             # Create review
│   │
│   ├── complaints/                # Complaint management
│   │   ├── index.vue              # Complaint list
│   │   ├── create.vue             # Submit complaint
│   │   └── [id].vue               # Complaint detail
│   │
│   ├── dashboard/                 # Dashboard pages
│   │   ├── index.vue              # Dashboard overview
│   │   ├── analytics.vue          # Analytics view
│   │   └── reports/
│   │       ├── index.vue          # Reports list
│   │       └── [id].vue           # Report detail
│   │
│   └── profile/                   # User profile
│       ├── index.vue              # Profile view
│       ├── edit.vue               # Edit profile
│       └── settings.vue           # User settings
│
├── plugins/                        # Nuxt plugins
│   ├── api.client.ts              # API client plugin
│   ├── toast.client.ts            # Toast notifications
│   ├── chart.client.ts            # Chart.js
│   ├── socket.client.ts           # Socket.IO
│   └── dayjs.ts                   # Day.js configuration
│
├── public/                         # Static public files
│   ├── favicon.ico
│   └── robots.txt
│
├── server/                         # Server API routes (optional)
│   └── api/
│       └── health.ts              # Health check endpoint
│
├── stores/                         # Pinia stores
│   ├── auth.ts                    # Auth store
│   ├── cart.ts                    # Shopping cart store
│   ├── commerce.ts                # Commerce module store
│   ├── payment.ts                 # Payment store
│   ├── rating.ts                  # Rating & Review store
│   ├── analytics.ts               # Analytics store
│   ├── notification.ts            # Notification store
│   └── ui.ts                      # UI state (sidebar, modals, etc.)
│
├── types/                          # TypeScript types
│   ├── api/                       # API response types
│   │   ├── commerce.ts
│   │   ├── payment.ts
│   │   ├── rating.ts
│   │   └── analytics.ts
│   ├── models/                    # Domain models
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   ├── Order.ts
│   │   ├── Payment.ts
│   │   └── Review.ts
│   └── index.ts
│
├── utils/                          # Utility functions
│   ├── api.ts                     # API helpers
│   ├── formatters.ts              # Date/Currency formatters
│   ├── validators.ts              # Validation rules
│   ├── constants.ts               # App constants
│   └── helpers.ts                 # General helpers
│
├── .env                           # Environment variables
├── .gitignore
├── nuxt.config.ts                 # Nuxt configuration
├── package.json
├── tailwind.config.ts             # Tailwind configuration
├── tsconfig.json                  # TypeScript configuration
└── README.md
```

## 4. State Management (Pinia)

### 4.1. Store Structure

Mỗi module backend tương ứng với một Pinia store:

```typescript
// stores/commerce.ts - Commerce Store
export const useCommerceStore = defineStore('commerce', () => {
  // State
  const products = ref<Product[]>([])
  const categories = ref<Category[]>([])
  const currentProduct = ref<Product | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const featuredProducts = computed(() =>
    products.value.filter(p => p.is_featured)
  )

  // Actions
  async function fetchProducts(filters?: ProductFilters) {
    loading.value = true
    try {
      const response = await useCommerce().getProducts(filters)
      products.value = response.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function fetchProductById(id: string) {
    loading.value = true
    try {
      const response = await useCommerce().getProduct(id)
      currentProduct.value = response.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    products,
    categories,
    currentProduct,
    loading,
    error,

    // Getters
    featuredProducts,

    // Actions
    fetchProducts,
    fetchProductById
  }
})
```

### 4.2. Cart Store (Special)

```typescript
// stores/cart.ts - Shopping Cart Store
export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref<CartItem[]>([])
  const loading = ref(false)

  // Getters
  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const subtotal = computed(() =>
    items.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  )

  const total = computed(() => subtotal.value) // Add tax, shipping later

  // Actions
  async function addItem(product: Product, quantity: number = 1) {
    const existingItem = items.value.find(i => i.product_id === product.id)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({
        product_id: product.id,
        product,
        quantity,
        price: product.price
      })
    }

    // Sync with backend
    await useCommerce().updateCart(items.value)
  }

  async function removeItem(productId: string) {
    items.value = items.value.filter(i => i.product_id !== productId)
    await useCommerce().updateCart(items.value)
  }

  async function updateQuantity(productId: string, quantity: number) {
    const item = items.value.find(i => i.product_id === productId)
    if (item) {
      item.quantity = quantity
      await useCommerce().updateCart(items.value)
    }
  }

  async function clearCart() {
    items.value = []
    await useCommerce().clearCart()
  }

  // Persist cart to localStorage
  watch(items, (newItems) => {
    if (process.client) {
      localStorage.setItem('cart', JSON.stringify(newItems))
    }
  }, { deep: true })

  return {
    items,
    loading,
    itemCount,
    subtotal,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  }
})
```

## 5. API Integration

### 5.1. Base API Client

```typescript
// composables/api/useApi.ts
export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const api = axios.create({
    baseURL: config.public.apiBase,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })

  // Request interceptor - Add auth token
  api.interceptors.request.use(
    (config) => {
      const token = authStore.token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  // Response interceptor - Handle errors
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const { response } = error

      // Handle 401 Unauthorized
      if (response?.status === 401) {
        authStore.logout()
        navigateTo('/auth/login')
      }

      // Handle 429 Too Many Requests
      if (response?.status === 429) {
        const toast = useToast()
        toast.error('Quá nhiều yêu cầu. Vui lòng thử lại sau.')
      }

      // Handle 500 Server Error
      if (response?.status >= 500) {
        const toast = useToast()
        toast.error('Lỗi hệ thống. Vui lòng thử lại sau.')
      }

      return Promise.reject(error)
    }
  )

  return { api }
}
```

### 5.2. Commerce API Composable

```typescript
// composables/api/useCommerce.ts
export const useCommerce = () => {
  const { api } = useApi()

  return {
    // Products
    getProducts: (filters?: ProductFilters) =>
      api.get('/v1/commerce/products', { params: filters }),

    getProduct: (id: string) =>
      api.get(`/v1/commerce/products/${id}`),

    searchProducts: (query: string) =>
      api.get('/v1/commerce/products/search', { params: { q: query } }),

    // Categories
    getCategories: () =>
      api.get('/v1/commerce/categories'),

    // Cart
    getCart: () =>
      api.get('/v1/commerce/cart'),

    updateCart: (items: CartItem[]) =>
      api.post('/v1/commerce/cart', { items }),

    clearCart: () =>
      api.delete('/v1/commerce/cart'),

    // Orders
    getOrders: (filters?: OrderFilters) =>
      api.get('/v1/commerce/orders', { params: filters }),

    getOrder: (id: string) =>
      api.get(`/v1/commerce/orders/${id}`),

    placeOrder: (orderData: CreateOrderDto) =>
      api.post('/v1/commerce/orders', orderData),

    // Vendors
    getVendors: () =>
      api.get('/v1/commerce/vendors'),

    getVendor: (id: string) =>
      api.get(`/v1/commerce/vendors/${id}`),

    getVendorProducts: (vendorId: string) =>
      api.get(`/v1/commerce/vendors/${vendorId}/products`)
  }
}
```

### 5.3. Payment API Composable

```typescript
// composables/api/usePayment.ts
export const usePayment = () => {
  const { api } = useApi()

  return {
    // Payment Methods
    getPaymentMethods: () =>
      api.get('/v1/payment/methods'),

    // Process Payment
    processPayment: (paymentData: ProcessPaymentDto) =>
      api.post('/v1/payment/process', paymentData),

    // Payment Status
    getPaymentStatus: (paymentId: string) =>
      api.get(`/v1/payment/${paymentId}/status`),

    // Invoices
    getInvoices: () =>
      api.get('/v1/payment/invoices'),

    getInvoice: (id: string) =>
      api.get(`/v1/payment/invoices/${id}`),

    downloadInvoice: (id: string) =>
      api.get(`/v1/payment/invoices/${id}/download`, {
        responseType: 'blob'
      }),

    // Transactions
    getTransactions: (filters?: TransactionFilters) =>
      api.get('/v1/payment/transactions', { params: filters })
  }
}
```

### 5.4. Rating API Composable

```typescript
// composables/api/useRating.ts
export const useRating = () => {
  const { api } = useApi()

  return {
    // Ratings
    getRatings: (productId: string) =>
      api.get(`/v1/rating/products/${productId}/ratings`),

    createRating: (ratingData: CreateRatingDto) =>
      api.post('/v1/rating/ratings', ratingData),

    // Reviews
    getReviews: (filters?: ReviewFilters) =>
      api.get('/v1/rating/reviews', { params: filters }),

    createReview: (reviewData: CreateReviewDto) =>
      api.post('/v1/rating/reviews', reviewData),

    updateReview: (id: string, reviewData: UpdateReviewDto) =>
      api.put(`/v1/rating/reviews/${id}`, reviewData),

    deleteReview: (id: string) =>
      api.delete(`/v1/rating/reviews/${id}`),

    // Complaints
    getComplaints: () =>
      api.get('/v1/rating/complaints'),

    createComplaint: (complaintData: CreateComplaintDto) =>
      api.post('/v1/rating/complaints', complaintData),

    getComplaint: (id: string) =>
      api.get(`/v1/rating/complaints/${id}`)
  }
}
```

## 6. Component Design Patterns

### 6.1. Composition API Pattern

```vue
<!-- components/features/commerce/product/ProductCard.vue -->
<script setup lang="ts">
import type { Product } from '~/types/models/Product'

interface Props {
  product: Product
  showActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true
})

const emit = defineEmits<{
  addToCart: [product: Product]
  viewDetail: [product: Product]
}>()

const cartStore = useCartStore()
const { formatCurrency } = useFormatters()

const isInCart = computed(() =>
  cartStore.items.some(item => item.product_id === props.product.id)
)

const handleAddToCart = () => {
  cartStore.addItem(props.product)
  emit('addToCart', props.product)
}

const handleViewDetail = () => {
  emit('viewDetail', props.product)
}
</script>

<template>
  <UiCard class="product-card">
    <div class="relative">
      <img
        :src="product.image"
        :alt="product.name"
        class="w-full h-48 object-cover"
      />
      <UiBadge
        v-if="product.is_featured"
        class="absolute top-2 right-2"
        variant="success"
      >
        Nổi bật
      </UiBadge>
    </div>

    <UiCardBody>
      <h3 class="text-lg font-semibold truncate">
        {{ product.name }}
      </h3>

      <p class="text-sm text-gray-600 mt-1 line-clamp-2">
        {{ product.description }}
      </p>

      <div class="mt-4 flex items-center justify-between">
        <span class="text-xl font-bold text-primary-600">
          {{ formatCurrency(product.price) }}
        </span>

        <RatingStars
          :rating="product.average_rating"
          :count="product.ratings_count"
          size="sm"
        />
      </div>

      <div v-if="showActions" class="mt-4 flex gap-2">
        <UiButton
          variant="primary"
          size="sm"
          :disabled="isInCart"
          @click="handleAddToCart"
        >
          <template #icon>
            <IconShoppingCart class="w-4 h-4" />
          </template>
          {{ isInCart ? 'Đã thêm' : 'Thêm vào giỏ' }}
        </UiButton>

        <UiButton
          variant="outline"
          size="sm"
          @click="handleViewDetail"
        >
          Xem chi tiết
        </UiButton>
      </div>
    </UiCardBody>
  </UiCard>
</template>
```

### 6.2. Smart vs Presentational Components

**Smart Component (Container)** - Xử lý logic, state, API calls:

```vue
<!-- pages/shop/index.vue -->
<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const commerceStore = useCommerceStore()
const route = useRoute()

// Filters from URL query
const filters = computed(() => ({
  category: route.query.category as string,
  minPrice: Number(route.query.minPrice) || undefined,
  maxPrice: Number(route.query.maxPrice) || undefined,
  search: route.query.search as string
}))

// Fetch products on mount and when filters change
onMounted(() => {
  commerceStore.fetchProducts(filters.value)
})

watch(filters, (newFilters) => {
  commerceStore.fetchProducts(newFilters)
})

const handleAddToCart = (product: Product) => {
  const toast = useToast()
  toast.success(`Đã thêm ${product.name} vào giỏ hàng`)
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Cửa hàng</h1>

    <div class="grid grid-cols-12 gap-6">
      <!-- Filters Sidebar -->
      <aside class="col-span-3">
        <ProductFilter />
      </aside>

      <!-- Products Grid -->
      <main class="col-span-9">
        <UiLoading v-if="commerceStore.loading" />

        <ProductList
          v-else
          :products="commerceStore.products"
          @add-to-cart="handleAddToCart"
        />
      </main>
    </div>
  </div>
</template>
```

**Presentational Component** - Chỉ hiển thị UI dựa trên props:

```vue
<!-- components/features/commerce/product/ProductList.vue -->
<script setup lang="ts">
import type { Product } from '~/types/models/Product'

interface Props {
  products: Product[]
}

defineProps<Props>()

const emit = defineEmits<{
  addToCart: [product: Product]
  viewDetail: [product: Product]
}>()
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :product="product"
      @add-to-cart="emit('addToCart', $event)"
      @view-detail="emit('viewDetail', $event)"
    />
  </div>

  <div v-if="products.length === 0" class="text-center py-12">
    <p class="text-gray-500">Không tìm thấy sản phẩm nào</p>
  </div>
</template>
```

## 7. Routing & Navigation

### 7.1. Route Structure

```typescript
// Routes tương ứng với các modules backend

/                              → Home page
/auth/login                    → Login
/auth/register                 → Register

/shop                          → Product listing (Commerce)
/shop/:slug                    → Product detail
/shop/cart                     → Shopping cart
/shop/checkout                 → Checkout

/orders                        → Order list
/orders/:id                    → Order detail

/payment/methods               → Payment methods
/payment/success               → Payment success
/payment/failed                → Payment failed
/payment/invoices              → Invoice list
/payment/invoices/:id          → Invoice detail

/reviews                       → My reviews (Rating)
/reviews/create                → Create review

/complaints                    → Complaint list
/complaints/create             → Submit complaint
/complaints/:id                → Complaint detail

/dashboard                     → Dashboard overview (Analytics)
/dashboard/analytics           → Analytics view
/dashboard/reports             → Reports list
/dashboard/reports/:id         → Report detail

/profile                       → User profile
/profile/edit                  → Edit profile
/profile/settings              → User settings
```

### 7.2. Navigation Guards (Middleware)

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    return navigateTo({
      path: '/auth/login',
      query: { redirect: to.fullPath }
    })
  }
})
```

```typescript
// middleware/module-access.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  const moduleAccess = {
    '/dashboard': ['admin', 'manager'],
    '/analytics': ['admin', 'analyst']
  }

  const requiredRoles = moduleAccess[to.path]
  if (requiredRoles && !authStore.hasAnyRole(requiredRoles)) {
    return navigateTo('/403')
  }
})
```

## 8. TypeScript Types

### 8.1. API Response Types

```typescript
// types/api/commerce.ts
export interface ProductResponse {
  id: string
  name: string
  slug: string
  description: string
  price: number
  image: string
  category_id: string
  vendor_id: string
  is_featured: boolean
  average_rating: number
  ratings_count: number
  stock: number
  created_at: string
  updated_at: string
}

export interface CartItemResponse {
  product_id: string
  product: ProductResponse
  quantity: number
  price: number
}

export interface OrderResponse {
  id: string
  order_number: string
  user_id: string
  status: OrderStatus
  total: number
  items: OrderItemResponse[]
  payment: PaymentResponse
  created_at: string
  updated_at: string
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
```

### 8.2. Domain Models

```typescript
// types/models/Product.ts
export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  image: string
  category: Category
  vendor: Vendor
  is_featured: boolean
  average_rating: number
  ratings_count: number
  stock: number
  created_at: Date
  updated_at: Date
}

export interface CartItem {
  product_id: string
  product: Product
  quantity: number
  price: number
}

export interface Order {
  id: string
  order_number: string
  user_id: string
  status: OrderStatus
  total: number
  items: OrderItem[]
  payment?: Payment
  created_at: Date
  updated_at: Date
}
```

## 9. Configuration

### 9.1. Nuxt Config

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'nuxt-icon'
  ],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api',
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000'
    }
  },

  app: {
    head: {
      title: 'Residential Management',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Residential Management System' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  typescript: {
    strict: true,
    typeCheck: true
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/variables.scss" as *;'
        }
      }
    }
  }
})
```

### 9.2. Tailwind Config

```typescript
// tailwind.config.ts
export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          // ... more shades
          900: '#1e3a8a'
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
}
```

## 10. Best Practices

### 10.1. Component Guidelines
- Sử dụng Composition API với `<script setup>`
- Props validation với TypeScript interfaces
- Emit events với typed emits
- Tách logic phức tạp ra composables
- Component nhỏ, single responsibility

### 10.2. State Management
- Mỗi module backend = 1 Pinia store
- Actions cho async operations
- Getters cho derived state
- Mutations không cần thiết trong Composition API

### 10.3. API Integration
- Tất cả API calls qua composables
- Centralized error handling trong interceptors
- Loading states cho mọi async operations
- Optimistic updates cho UX tốt hơn

### 10.4. Performance
- Lazy load components với `defineAsyncComponent`
- Image optimization với Nuxt Image
- Code splitting theo routes
- Cache API responses khi phù hợp

### 10.5. Security
- Validate input trước khi gửi API
- Sanitize user input
- Secure token storage
- CSRF protection
- XSS prevention

## 11. Development Workflow

### 11.1. Setup Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check

# Lint
npm run lint

# Format code
npm run format
```

### 11.2. Environment Variables

```env
# .env
NUXT_PUBLIC_API_BASE=http://localhost:8000/api
NUXT_PUBLIC_APP_URL=http://localhost:3000
NUXT_PUBLIC_WS_URL=ws://localhost:6001
```

## 12. Testing Strategy

### 12.1. Unit Tests (Vitest)
- Test composables
- Test utility functions
- Test Pinia stores

### 12.2. Component Tests (Vue Test Utils)
- Test component logic
- Test user interactions
- Test props/emits

### 12.3. E2E Tests (Playwright)
- Critical user flows
- Payment flows
- Order placement flows

---

**Document Version**: 1.0
**Last Updated**: February 5, 2026
**Author**: Development Team
