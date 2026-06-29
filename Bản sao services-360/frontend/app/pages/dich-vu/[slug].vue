<script setup lang="ts">
definePageMeta({
  layout: 'landing'
})

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data, status, error } = usePublicServiceDetail(slug)
const service = computed(() => data.value?.data ?? null)

// Dynamic SEO
watchEffect(() => {
  if (!service.value) return
  useSeoMeta({
    title: `${service.value.name} - Thần Nông`,
    description: service.value.description || `Dịch vụ ${service.value.name}`,
    ogTitle: `${service.value.name} - Thần Nông`,
    ogDescription: service.value.description || `Dịch vụ ${service.value.name}`,
    ogImage: service.value.image_url || undefined
  })
})

function orderService() {
  if (!service.value) return
  navigateTo({ path: '/ticket', query: { service: service.value.name } })
}

// Gallery lightbox
const lightboxIndex = ref<number | null>(null)
const galleryImages = computed(() => {
  if (!service.value) return []
  const imgs: Array<{ url: string, alt: string }> = []
  if (service.value.image_url) {
    imgs.push({ url: service.value.image_url, alt: service.value.name })
  }
  if (Array.isArray(service.value.images)) {
    for (const img of service.value.images) {
      const url = typeof img === 'string'
        ? img
        : (typeof img === 'object' && img !== null && 'image_url' in img)
            ? String((img as Record<string, unknown>).image_url)
            : null
      if (url) imgs.push({ url, alt: `${service.value.name} gallery` })
    }
  }
  return imgs
})

function openLightbox(index: number) {
  lightboxIndex.value = index
}

function closeLightbox() {
  lightboxIndex.value = null
}

function nextImage() {
  if (lightboxIndex.value === null) return
  lightboxIndex.value = (lightboxIndex.value + 1) % galleryImages.value.length
}

function prevImage() {
  if (lightboxIndex.value === null) return
  lightboxIndex.value = (lightboxIndex.value - 1 + galleryImages.value.length) % galleryImages.value.length
}
</script>

<template>
  <div class="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f6f7f8]">
    <LandingHeader />

    <main class="flex-1">
      <!-- Loading -->
      <div
        v-if="status === 'pending'"
        class="max-w-4xl mx-auto px-6 lg:px-20 py-16"
      >
        <div class="animate-pulse space-y-6">
          <div class="h-5 w-40 bg-slate-200 rounded" />
          <div class="h-10 w-3/4 bg-slate-200 rounded" />
          <div class="h-80 w-full bg-slate-200 rounded-2xl" />
          <div class="space-y-3">
            <div class="h-4 w-full bg-slate-200 rounded" />
            <div class="h-4 w-5/6 bg-slate-200 rounded" />
            <div class="h-4 w-2/3 bg-slate-200 rounded" />
          </div>
        </div>
      </div>

      <!-- Error / Not Found -->
      <div
        v-else-if="error || !service"
        class="max-w-4xl mx-auto px-6 lg:px-20 py-20 text-center"
      >
        <span class="material-symbols-outlined text-7xl text-slate-300 mb-6 block">
          error_outline
        </span>
        <h2 class="text-2xl font-bold text-slate-900 mb-3">
          Không tìm thấy dịch vụ
        </h2>
        <p class="text-slate-500 mb-8">
          Dịch vụ bạn tìm kiếm không tồn tại hoặc đã bị gỡ.
        </p>
        <NuxtLink
          to="/dich-vu"
          class="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"
        >
          <span class="material-symbols-outlined text-xl">arrow_back</span>
          Quay lại danh sách dịch vụ
        </NuxtLink>
      </div>

      <!-- Service Detail -->
      <template v-else>
        <!-- Hero: WITH cover image -->
        <div
          v-if="service.image_url"
          class="relative w-full h-[340px] sm:h-[420px] lg:h-[480px] overflow-hidden bg-slate-900"
        >
          <img
            :src="service.image_url"
            :alt="service.name"
            class="absolute inset-0 w-full h-full object-cover opacity-70"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

          <div class="relative h-full max-w-4xl mx-auto px-6 lg:px-20 flex flex-col justify-end pb-10">
            <nav class="flex items-center gap-2 text-sm text-white/60 mb-5">
              <NuxtLink
                to="/dich-vu"
                class="hover:text-white transition-colors"
              >
                Dịch vụ
              </NuxtLink>
              <span class="material-symbols-outlined text-sm">chevron_right</span>
              <span
                v-if="service.category"
                class="hover:text-white transition-colors"
              >
                {{ service.category.name }}
              </span>
              <span
                v-if="service.category"
                class="material-symbols-outlined text-sm"
              >chevron_right</span>
              <span class="text-white/90 truncate max-w-xs">{{ service.name }}</span>
            </nav>

            <div class="flex items-center gap-3 mb-4">
              <span
                v-if="service.category"
                class="inline-flex items-center bg-white/15 border border-white/20 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full backdrop-blur-sm"
              >
                {{ service.category.name }}
              </span>
              <span
                v-if="service.is_featured"
                class="inline-flex items-center gap-1.5 bg-amber-500/90 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full"
              >
                <span class="material-symbols-outlined text-sm">star</span>
                Nổi bật
              </span>
            </div>

            <h1 class="text-white text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight max-w-3xl">
              {{ service.name }}
            </h1>
          </div>
        </div>

        <!-- Header: WITHOUT cover image — compact dark with pattern -->
        <div
          v-else
          class="relative overflow-hidden bg-slate-900"
        >
          <!-- Subtle decorative elements -->
          <div class="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-indigo-500/8 blur-[120px]" />
          <div class="absolute bottom-0 left-1/4 w-[300px] h-[300px] rounded-full bg-slate-600/10 blur-[80px]" />
          <div
            class="absolute inset-0 opacity-[0.03]"
            style="background-image: linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px); background-size: 48px 48px;"
          />

          <div class="relative max-w-4xl mx-auto px-6 lg:px-20 pt-8 pb-14">
            <nav class="flex items-center gap-2 text-sm text-white/50 mb-6">
              <NuxtLink
                to="/dich-vu"
                class="hover:text-white transition-colors"
              >
                Dịch vụ
              </NuxtLink>
              <span class="material-symbols-outlined text-sm">chevron_right</span>
              <span
                v-if="service.category"
                class="hover:text-white transition-colors"
              >
                {{ service.category.name }}
              </span>
              <span
                v-if="service.category"
                class="material-symbols-outlined text-sm"
              >chevron_right</span>
              <span class="text-white/80 truncate max-w-xs">{{ service.name }}</span>
            </nav>

            <div class="flex items-center gap-3 mb-4">
              <span
                v-if="service.category"
                class="inline-flex items-center bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full"
              >
                {{ service.category.name }}
              </span>
              <span
                v-if="service.is_featured"
                class="inline-flex items-center gap-1.5 bg-amber-500/90 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full"
              >
                <span class="material-symbols-outlined text-sm">star</span>
                Nổi bật
              </span>
            </div>

            <h1 class="text-white text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight max-w-3xl">
              {{ service.name }}
            </h1>
          </div>
        </div>

        <!-- Body Content -->
        <div class="max-w-4xl mx-auto px-6 lg:px-20 -mt-6 relative z-10 pb-28 sm:pb-0">
          <!-- Pricing Card (tablet / desktop only) -->
          <div class="hidden sm:block bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8 mb-10">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div class="flex flex-col gap-1">
                <span class="text-xs text-slate-400 font-semibold uppercase tracking-wider">Giá dịch vụ</span>
                <div class="flex items-baseline gap-2">
                  <span class="text-3xl sm:text-4xl font-black text-slate-900">
                    {{ formatCurrency(service.unit_price) }}
                  </span>
                  <span class="text-slate-500 font-medium">/{{ service.unit }}</span>
                </div>
                <span
                  v-if="service.price_note"
                  class="text-sm text-slate-400 italic mt-1"
                >{{ service.price_note }}</span>
              </div>
              <button
                class="flex items-center justify-center gap-2 bg-slate-900 text-white font-bold text-base px-8 py-4 rounded-xl hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-slate-900/20"
                @click="orderService"
              >
                <span class="material-symbols-outlined text-xl">send</span>
                Đặt dịch vụ ngay
              </button>
            </div>
          </div>

          <!-- Description -->
          <div
            v-if="service.description"
            class="mb-10"
          >
            <p class="text-lg text-slate-600 leading-relaxed">
              {{ service.description }}
            </p>
          </div>

          <!-- Rich Content (Blog body) -->
          <div
            v-if="service.content"
            class="mb-12"
          >
            <div
              class="prose prose-slate prose-lg max-w-none
                prose-headings:text-slate-900 prose-headings:font-bold prose-headings:tracking-tight
                prose-p:text-slate-600 prose-p:leading-relaxed
                prose-a:text-slate-900 prose-a:font-semibold prose-a:underline-offset-4
                prose-img:rounded-xl prose-img:shadow-md
                prose-blockquote:border-l-slate-900 prose-blockquote:text-slate-600
                prose-strong:text-slate-900
                prose-li:text-slate-600"
              v-html="service.content"
            />
          </div>

          <!-- Gallery -->
          <div
            v-if="galleryImages.length > 1"
            class="mb-12"
          >
            <h2 class="text-xl font-bold text-slate-900 mb-5">
              Hình ảnh dịch vụ
            </h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                v-for="(img, idx) in galleryImages"
                :key="idx"
                class="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                @click="openLightbox(idx)"
              >
                <img
                  :src="img.url"
                  :alt="img.alt"
                  class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                >
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <span class="material-symbols-outlined text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg">
                    zoom_in
                  </span>
                </div>
              </button>
            </div>
          </div>

          <!-- Back to listing -->
          <div class="py-10 border-t border-slate-200">
            <NuxtLink
              to="/dich-vu"
              class="inline-flex items-center gap-2 text-slate-600 font-semibold hover:text-slate-900 transition-colors"
            >
              <span class="material-symbols-outlined text-xl">arrow_back</span>
              Quay lại danh sách dịch vụ
            </NuxtLink>
          </div>
        </div>
      </template>
    </main>

    <LandingFooter />

    <!-- Mobile sticky booking bar -->
    <div
      v-if="service"
      class="sm:hidden fixed inset-x-0 bottom-0 z-40 bg-white border-t border-slate-200 shadow-[0_-8px_24px_-8px_rgba(15,23,42,0.15)] px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]"
    >
      <div class="flex items-center justify-between gap-3">
        <div class="flex flex-col min-w-0">
          <span class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Giá dịch vụ</span>
          <div class="flex items-baseline gap-1 truncate">
            <span class="text-xl font-black text-slate-900 truncate">
              {{ formatCurrency(service.unit_price) }}
            </span>
            <span class="text-slate-500 text-sm font-medium">/{{ service.unit }}</span>
          </div>
        </div>
        <button
          class="flex items-center justify-center gap-2 bg-slate-900 text-white font-bold text-sm px-5 py-3 rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all shadow-lg shadow-slate-900/20 shrink-0"
          @click="orderService"
        >
          <span class="material-symbols-outlined text-lg">send</span>
          Đặt ngay
        </button>
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        leave-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div
          v-if="lightboxIndex !== null"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          @click.self="closeLightbox"
          @keydown.escape="closeLightbox"
          @keydown.left="prevImage"
          @keydown.right="nextImage"
        >
          <!-- Close -->
          <button
            class="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            @click="closeLightbox"
          >
            <span class="material-symbols-outlined text-2xl">close</span>
          </button>

          <!-- Prev -->
          <button
            v-if="galleryImages.length > 1"
            class="absolute left-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            @click="prevImage"
          >
            <span class="material-symbols-outlined text-2xl">chevron_left</span>
          </button>

          <!-- Image -->
          <img
            :src="galleryImages[lightboxIndex]?.url"
            :alt="galleryImages[lightboxIndex]?.alt"
            class="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
          >

          <!-- Next -->
          <button
            v-if="galleryImages.length > 1"
            class="absolute right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            @click="nextImage"
          >
            <span class="material-symbols-outlined text-2xl">chevron_right</span>
          </button>

          <!-- Counter -->
          <div class="absolute bottom-6 text-white/60 text-sm font-medium">
            {{ (lightboxIndex ?? 0) + 1 }} / {{ galleryImages.length }}
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
