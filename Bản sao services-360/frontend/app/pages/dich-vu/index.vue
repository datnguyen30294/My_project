<script setup lang="ts">
import type { PublicServiceIndex200DataItem } from '#api/generated/laravel'

definePageMeta({
  layout: 'landing'
})

useSeoMeta({
  title: 'Danh mục dịch vụ - Thần Nông',
  description: 'Chào mừng cư dân, hãy chọn các dịch vụ tiện ích chuyên nghiệp cho ngôi nhà của bạn.',
  ogTitle: 'Danh mục dịch vụ - Thần Nông',
  ogDescription: 'Chào mừng cư dân, hãy chọn các dịch vụ tiện ích chuyên nghiệp cho ngôi nhà của bạn.'
})

const { isTenantDomain } = useAppContext()

const searchInput = ref('')
const searchQuery = ref('')
const activeCategory = ref('all')
const currentPage = ref(1)
const perPage = PUBLIC_SERVICES_PER_PAGE

// --- URL sync ---
const { isInitFromUrl } = useUrlFilters({
  category: { ref: activeCategory, type: 'string', defaultValue: 'all' },
  search: { ref: searchQuery, type: 'string' }
})

// Sync URL → input on init
watch(searchQuery, (val) => {
  searchInput.value = val
}, { immediate: true })

function handleSearch() {
  searchQuery.value = searchInput.value
}

// --- Tenant: fetch from API ---
const apiParams = computed(() => ({
  search: searchQuery.value.trim() || undefined,
  category: activeCategory.value !== 'all' ? activeCategory.value : undefined,
  page: currentPage.value,
  per_page: perPage
}))

// Always call composable (SSR-safe), but only fetch when tenant
const tenantParams = computed(() => isTenantDomain.value ? apiParams.value : undefined)
const { data: apiData, status: apiStatus } = usePublicServices(tenantParams)

const apiCategories = computed(() => apiData.value?.categories ?? [])
const apiMeta = computed(() => apiData.value?.meta ?? { current_page: 1, last_page: 1, per_page: perPage, total: 0 })

// Accumulate services for "load more" pattern
type ServiceItem = PublicServiceIndex200DataItem
const loadedExtraPages = ref<ServiceItem[]>([])

watch(apiData, (newData) => {
  if (!newData?.data) return
  if (currentPage.value === 1) {
    loadedExtraPages.value = []
  } else {
    loadedExtraPages.value = [...loadedExtraPages.value, ...newData.data]
  }
})

// SSR-safe: apiData comes from useFetch payload, extra pages accumulate on client
const displayedServices = computed<ServiceItem[]>(() => {
  const firstPage = apiData.value?.data ?? []
  return [...firstPage, ...loadedExtraPages.value]
})

// --- Platform: static data ---
interface StaticService {
  id: number
  title: string
  description: string
  price: string
  category: string
  image: string
}

const staticCategories = [
  { key: 'all', label: 'Tất cả' },
  { key: 'cleaning', label: 'Vệ sinh' },
  { key: 'repair', label: 'Sửa chữa' },
  { key: 'moving', label: 'Vận chuyển' },
  { key: 'care', label: 'Chăm sóc' }
]

const staticServices: StaticService[] = [
  { id: 1, title: 'Vệ sinh nhà cửa', description: 'Dịch vụ dọn dẹp chuyên nghiệp, bao gồm hút bụi, lau sàn và khử khuẩn không gian sống.', price: '200.000đ', category: 'cleaning', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwrgXvX2GebRALBcp_RZwhTKYmeY5zMOW6xs1SIjT_H2LZIcFYbfNS-foCFuKCdkYUcZaYgAHWqo9tNx_qQb0P0fW17OmL-wjZ9L96HlaxXmPbExiZTrwxuxsgdGjxVsB09X2Eas4lh8jLNsyLgbjrXSLjdn9Act1G5p9LdxUFk-ng6lDDU5LTXSutMWVqj5vGVlH9VcirYTwvG6KN5ObyRhV7ZwJ7ObDsrF8VAyH0qgYbCvN8muGeguw5pqHF5ZalCu23Crn_2UZB' },
  { id: 2, title: 'Sửa chữa điện nước', description: 'Khắc phục sự cố điện, rò rỉ nước nhanh chóng bởi đội ngũ kỹ thuật tay nghề cao.', price: '150.000đ', category: 'repair', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaXMUonRSasnsMMsR_AXt-d6Gd3_RN1T3RB2RoUZzpVQJzLZ7uT64F2ZiGDod9AayjI6Cd6tSXg12U2-T8xc4ls-sTDIfbJmQJDHcWdA6ak1pAjLwcOe11I3NQmmFIeCn6oyFD2tMzdrtgEW1f-rWbtHlPmdOZVbWK-Jp6EmZuraGPiFyn62LW6dpb_DR6qhBFNYQ4L_z6hRCvu_rkMUmCrfP7s5vkdX5eRlcTy1jQ_wK49bsvfh9sG0SNK3vbfNo_MYpIAEeXhdC3' },
  { id: 3, title: 'Vận chuyển nhà', description: 'Dịch vụ đóng gói và chuyển đồ đạc trọn gói, an toàn và chuyên nghiệp nhất.', price: '500.000đ', category: 'moving', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1H8zY3ZmX0dSmfZOgfiRPNzowWDGihu7CJ9a2hZVTIJnTlWqKMho6PFvVfDfGRdDRujwpnh74HCtpzdzS15EsEfBMXirGDgYEqKMdi5OkLDVS8zCjAi71olgQi8cHbrKCtW_bGLs_euxO0LjsRf0Y_7phg_3RPhml4byrw5GujZpvZ4vMl3CMRlOhBFuNJJYs8rT2uAoTkEl982ZpMxyOJwwmE3VyFib3W8od6Q5CGgqHKkLk6ZAXSwY9Sx21AbqX80Hsaqcn7Mi9' },
  { id: 4, title: 'Chăm sóc cây cảnh', description: 'Cắt tỉa, bón phân và chăm sóc định kỳ cho ban công và vườn cây của bạn.', price: '100.000đ', category: 'care', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQIX0ozrCgXLny6mrHoFU25U3k7s2iS6UndHGgboVUGapwhjQhnmscGvgD2eSiHHskv2iUjtpdDcMJ7mc_lNF0ew1oESyYbxrFPlTxDhtdtEwn7GSn-D6cBnWewYj8YpTJc_wRMnDDFT8LYNHuy7gvuoCEGkWs031XZGyFdIQXoP4z47f6faKWxXWNHaB2BFjQMTT3w70KaR9tSCTdefVpTzSZoPxNiqqfynDOdElUX-eACkuNn64mNZI1YuSE_uu85Rt-GBgjhsWR' },
  { id: 5, title: 'Vệ sinh máy lạnh', description: 'Bảo dưỡng và vệ sinh máy lạnh giúp tiết kiệm điện và làm sạch không khí trong phòng.', price: '250.000đ', category: 'repair', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAd-tge9KRiUmoavYlw_daQnnsKjsYlUKet5vaW7O1OOzWwvtJCz75d_sSlCi2vwMfRz7I7q-u4cp9nAuqEh7ZcKp0U0EqbzlxQj3RhB1PiqGlTNy_RmoMk7dxLfJDdA2sgaUwsy9VPlIIDoTKabMUmkQdu589iI11nJZbWtcHH98kUCmkPaHhlledtapLDG2rsWtV2edLmVP6amR4fXrm8aJr9LS5gKEjAOzidI2Olys4t05aViO_YXlCsp94mwE9ptNWnX_R1y-uN' },
  { id: 6, title: 'Diệt côn trùng', description: 'Kiểm soát và tiêu diệt các loại côn trùng gây hại như mối, gián, muỗi định kỳ.', price: '400.000đ', category: 'cleaning', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKpKg6A-ul7L1xzKkF3ozkFJCQlR3Lfs9kgaImLiD1KuAiWGlyexGYu_ykgmWz8jW99TIbPgBxkjM1TrIGFBWMwq5W50UBptk7zIbW3kW_y8frP3J5bT0byo7f3mBcBDbFF3OvDT87Qvcrm06sVz9wpaXWnOXONsD75wsAxBOQxgpIJ8IAEinsbxnnVazymps4pF0R9PjPeGrkpSnIuFlggly04a7D0nIlPqaHIlPZZoSYyfW6qfk97cZLz6LiBHO9ryR2-pmam8xv' }
]

const filteredStaticServices = computed(() => {
  let services = staticServices
  if (activeCategory.value !== 'all') {
    services = services.filter(s => s.category === activeCategory.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    services = services.filter(s => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q))
  }
  return services
})

function getStaticCategoryLabel(key: string): string {
  return staticCategories.find(c => c.key === key)?.label ?? key
}

// Reset page and accumulated data when category or search changes
watch([activeCategory, searchQuery], () => {
  if (isInitFromUrl.value) return
  currentPage.value = 1
  loadedExtraPages.value = []
})

function loadMore() {
  if (apiMeta.value.current_page < apiMeta.value.last_page) {
    currentPage.value++
  }
}

function orderService(serviceName: string) {
  navigateTo({ path: '/ticket', query: { service: serviceName } })
}
</script>

<template>
  <div class="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f6f7f8]">
    <LandingHeader />

    <main class="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-20 py-10">
      <!-- Hero Section & Search -->
      <div class="flex flex-col gap-6 mb-12">
        <div class="max-w-2xl">
          <h1 class="text-slate-900 text-4xl font-extrabold leading-tight tracking-tight mb-3">
            Danh mục dịch vụ
          </h1>
          <p class="text-slate-600 text-lg">
            Chào mừng cư dân, hãy chọn các dịch vụ tiện ích chuyên nghiệp cho ngôi nhà của bạn.
          </p>
        </div>
        <div class="w-full max-w-3xl mt-4">
          <div class="flex items-center rounded-xl bg-white shadow-sm border border-slate-200 p-1">
            <div class="flex-1 flex items-center px-4">
              <UIcon
                name="i-lucide-search"
                class="text-slate-400 text-xl shrink-0 mr-3"
              />
              <input
                v-model="searchInput"
                class="w-full border-none bg-transparent focus:ring-0 text-slate-900 placeholder:text-slate-400 py-3"
                placeholder="Bạn cần tìm dịch vụ gì hôm nay?"
                type="text"
                @keydown.enter="handleSearch"
              >
            </div>
            <button
              class="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition-all"
              @click="handleSearch"
            >
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      <!-- Categories Filter -->
      <div class="flex flex-wrap gap-3 mb-10">
        <!-- "Tất cả" with icon -->
        <button
          :class="[
            'flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all',
            activeCategory === 'all'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-900'
          ]"
          @click="activeCategory = 'all'"
        >
          <span class="material-symbols-outlined text-xl">apps</span>
          Tất cả
        </button>

        <!-- Tenant: dynamic categories (no icon) -->
        <template v-if="isTenantDomain">
          <button
            v-for="cat in apiCategories"
            :key="cat.code"
            :class="[
              'flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all',
              activeCategory === cat.code
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-900'
            ]"
            @click="activeCategory = cat.code"
          >
            {{ cat.name }}
          </button>
        </template>

        <!-- Platform: static categories (no icon) -->
        <template v-else>
          <button
            v-for="cat in staticCategories.slice(1)"
            :key="cat.key"
            :class="[
              'flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all',
              activeCategory === cat.key
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-900'
            ]"
            @click="activeCategory = cat.key"
          >
            {{ cat.label }}
          </button>
        </template>
      </div>

      <!-- Loading -->
      <div
        v-if="isTenantDomain && apiStatus === 'pending'"
        class="flex justify-center py-20"
      >
        <UIcon
          name="i-lucide-loader-circle"
          class="animate-spin text-4xl text-slate-400"
        />
      </div>

      <!-- Service Grid: Tenant -->
      <template v-else-if="isTenantDomain">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <NuxtLink
            v-for="service in displayedServices"
            :key="service.id"
            :to="service.slug ? `/dich-vu/${service.slug}` : undefined"
            class="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300"
          >
            <div class="relative h-48 w-full overflow-hidden">
              <div
                v-if="service.image_url"
                class="absolute inset-0 bg-center bg-no-repeat bg-cover transition-transform duration-500 group-hover:scale-110"
                :style="{ backgroundImage: `url('${service.image_url}')` }"
              />
              <div
                v-else
                class="absolute inset-0 bg-slate-100 flex items-center justify-center"
              >
                <span class="material-symbols-outlined text-5xl text-slate-300">image</span>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div
                v-if="service.category"
                class="absolute top-3 left-3 bg-slate-900/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded"
              >
                {{ service.category.name }}
              </div>
              <div
                v-if="service.is_featured"
                class="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded"
              >
                Nổi bật
              </div>
            </div>
            <div class="p-5 flex flex-col flex-1">
              <h3 class="text-slate-900 text-lg font-bold mb-2 group-hover:text-slate-700 transition-colors">
                {{ service.name }}
              </h3>
              <p class="text-slate-500 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                {{ service.description }}
              </p>
              <div class="flex items-end justify-between gap-2 mt-auto">
                <div class="flex flex-col min-w-0">
                  <span class="text-xs text-slate-400 font-medium">Từ</span>
                  <span class="text-slate-900 font-extrabold text-base truncate">{{ formatCurrency(service.unit_price) }}/{{ service.unit }}</span>
                  <span
                    v-if="service.price_note"
                    class="text-xs text-slate-400 italic mt-0.5"
                  >{{ service.price_note }}</span>
                </div>
                <button
                  class="shrink-0 bg-slate-900 text-white text-sm font-bold px-4 py-2.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  @click.prevent="orderService(service.name)"
                >
                  Đặt ngay
                </button>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Empty state -->
        <div
          v-if="displayedServices.length === 0 && apiStatus !== 'pending'"
          class="flex flex-col items-center justify-center py-20"
        >
          <span class="material-symbols-outlined text-6xl text-slate-300 mb-4">search_off</span>
          <p class="text-slate-500 text-lg">
            Không tìm thấy dịch vụ phù hợp
          </p>
          <button
            class="mt-4 text-slate-900 font-semibold underline underline-offset-4"
            @click="searchInput = ''; searchQuery = ''; activeCategory = 'all'"
          >
            Xem tất cả dịch vụ
          </button>
        </div>

        <!-- Load more -->
        <div
          v-if="displayedServices.length > 0"
          class="mt-16 flex flex-col items-center gap-4"
        >
          <p class="text-sm text-slate-500">
            Đang hiển thị {{ displayedServices.length }} trên {{ apiMeta.total }} dịch vụ
          </p>
          <button
            v-if="apiMeta.current_page < apiMeta.last_page"
            class="bg-white text-slate-900 border-2 border-slate-900 px-10 py-3 rounded-xl font-bold hover:bg-slate-900 hover:text-white transition-all"
            @click="loadMore"
          >
            Xem thêm dịch vụ
          </button>
        </div>
      </template>

      <!-- Service Grid: Platform (static) -->
      <template v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <div
            v-for="service in filteredStaticServices"
            :key="service.id"
            class="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300"
          >
            <div class="relative h-48 w-full overflow-hidden">
              <div
                class="absolute inset-0 bg-center bg-no-repeat bg-cover transition-transform duration-500 group-hover:scale-110"
                :style="{ backgroundImage: `url('${service.image}')` }"
              />
              <div class="absolute top-3 left-3 bg-slate-900/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                {{ getStaticCategoryLabel(service.category) }}
              </div>
            </div>
            <div class="p-5 flex flex-col flex-1">
              <h3 class="text-slate-900 text-lg font-bold mb-2">
                {{ service.title }}
              </h3>
              <p class="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
                {{ service.description }}
              </p>
              <div class="flex items-end justify-between gap-2 mt-auto">
                <div class="flex flex-col min-w-0">
                  <span class="text-xs text-slate-400 font-medium">Từ</span>
                  <span class="text-slate-900 font-extrabold text-base truncate">{{ service.price }}</span>
                </div>
                <button
                  class="shrink-0 bg-slate-900 text-white text-sm font-bold px-4 py-2.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  @click="orderService(service.title)"
                >
                  Đặt ngay
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div
          v-if="filteredStaticServices.length === 0"
          class="flex flex-col items-center justify-center py-20"
        >
          <span class="material-symbols-outlined text-6xl text-slate-300 mb-4">search_off</span>
          <p class="text-slate-500 text-lg">
            Không tìm thấy dịch vụ phù hợp
          </p>
          <button
            class="mt-4 text-slate-900 font-semibold underline underline-offset-4"
            @click="searchInput = ''; searchQuery = ''; activeCategory = 'all'"
          >
            Xem tất cả dịch vụ
          </button>
        </div>

        <!-- Pagination -->
        <div
          v-if="filteredStaticServices.length > 0"
          class="mt-16 flex flex-col items-center gap-4"
        >
          <p class="text-sm text-slate-500">
            Đang hiển thị {{ filteredStaticServices.length }} trên {{ staticServices.length }} dịch vụ
          </p>
        </div>
      </template>
    </main>

    <LandingFooter />
  </div>
</template>
