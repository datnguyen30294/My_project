<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const { isAuthenticated, init } = useAuth()
const ready = ref(false)
const mobileOpen = ref(false)
const is404 = computed(() => props.error.status === 404)

onMounted(() => {
  init()
  ready.value = true
})
</script>

<template>
  <!-- Wait for client-side auth check to avoid hydration mismatch -->
  <div
    v-if="!ready"
    class="min-h-screen bg-background-light"
  />

  <!-- Authenticated: admin layout shell -->
  <div
    v-else-if="isAuthenticated"
    class="flex h-screen overflow-hidden bg-background-light"
  >
    <LayoutAppSidebar />

    <div class="flex flex-1 flex-col min-w-0 overflow-hidden">
      <LayoutAppHeader @toggle-mobile-sidebar="mobileOpen = !mobileOpen" />

      <main class="flex-1 overflow-y-auto bg-background-light p-6">
        <div class="max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
          <!-- 404: Under construction -->
          <template v-if="is404">
            <div class="flex flex-col items-center text-center max-w-md">
              <div class="size-20 rounded-2xl bg-orange-50 flex items-center justify-center mb-6">
                <span class="material-symbols-outlined text-5xl text-orange-500">construction</span>
              </div>
              <h1 class="text-2xl font-bold text-slate-900 mb-2">
                Trang đang được xây dựng
              </h1>
              <p class="text-slate-500 mb-8">
                Tính năng này đang trong quá trình phát triển và sẽ sớm được hoàn thiện. Vui lòng quay lại sau.
              </p>
              <div class="flex items-center gap-3">
                <UButton
                  to="/dashboard"
                  icon="i-lucide-home"
                  label="Dashboard"
                />
                <UButton
                  to="/"
                  color="neutral"
                  variant="outline"
                  icon="i-lucide-globe"
                  label="Trang chủ"
                />
                <UButton
                  color="neutral"
                  variant="outline"
                  icon="i-lucide-arrow-left"
                  label="Quay lại"
                  @click="$router.back()"
                />
              </div>
            </div>
          </template>

          <!-- Other errors -->
          <template v-else>
            <div class="flex flex-col items-center text-center max-w-md">
              <div class="size-20 rounded-2xl bg-red-50 flex items-center justify-center mb-6">
                <span class="material-symbols-outlined text-5xl text-red-500">error</span>
              </div>
              <h1 class="text-2xl font-bold text-slate-900 mb-2">
                Lỗi {{ error.status }}
              </h1>
              <p class="text-slate-500 mb-8">
                {{ error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.' }}
              </p>
              <div class="flex items-center gap-3">
                <UButton
                  to="/dashboard"
                  icon="i-lucide-home"
                  label="Dashboard"
                />
                <UButton
                  to="/"
                  color="neutral"
                  variant="outline"
                  icon="i-lucide-globe"
                  label="Trang chủ"
                />
                <UButton
                  color="neutral"
                  variant="outline"
                  icon="i-lucide-arrow-left"
                  label="Quay lại"
                  @click="$router.back()"
                />
              </div>
            </div>
          </template>
        </div>
      </main>
    </div>

    <LayoutAppMobileSidebar v-model:open="mobileOpen" />
  </div>

  <!-- Not authenticated: simple centered page -->
  <div
    v-else
    class="min-h-screen bg-[#f6f7f8] flex flex-col items-center justify-center px-6"
  >
    <div class="flex flex-col items-center text-center max-w-md">
      <div class="size-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-6">
        <span class="material-symbols-outlined text-5xl text-slate-400">{{ is404 ? 'construction' : 'error' }}</span>
      </div>
      <h1 class="text-2xl font-bold text-slate-900 mb-2">
        {{ is404 ? 'Trang không tồn tại' : `Lỗi ${error.status}` }}
      </h1>
      <p class="text-slate-500 mb-8">
        {{ is404 ? 'Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.' : (error.message || 'Đã có lỗi xảy ra.') }}
      </p>
      <div class="flex items-center gap-3">
        <UButton
          to="/"
          icon="i-lucide-home"
          label="Về trang chủ"
        />
        <UButton
          color="neutral"
          variant="outline"
          icon="i-lucide-arrow-left"
          label="Quay lại"
          @click="$router.back()"
        />
      </div>
    </div>
  </div>
</template>
