<script setup lang="ts">
defineEmits<{
  toggleMobileSidebar: []
}>()

const { user, clearAuth } = usePlatformAuth()
const router = useRouter()
const isLoggingOut = ref(false)
const showUserMenu = ref(false)

async function handleLogout() {
  isLoggingOut.value = true
  try {
    await apiPlatformLogout()
  } catch {
    // ignore
  } finally {
    clearAuth()
    isLoggingOut.value = false
    router.push('/login')
  }
}

function onClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('[data-user-menu]')) {
    showUserMenu.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

<template>
  <header class="h-14 flex-shrink-0 bg-white border-b border-[#e5e7eb] flex items-center justify-between px-6 z-10">
    <!-- Left: hamburger (mobile) + title -->
    <div class="flex items-center gap-3">
      <UButton
        class="lg:hidden"
        icon="i-lucide-menu"
        color="neutral"
        variant="ghost"
        @click="$emit('toggleMobileSidebar')"
      />

      <div class="flex flex-col justify-center">
        <h1 class="text-[16px] font-semibold text-[#111827] leading-tight">
          Thần Nông
        </h1>
        <p class="text-[12px] text-[#6b7280]">
          Quản lý yêu cầu dịch vụ
        </p>
      </div>
    </div>

    <!-- Right: user -->
    <div class="flex items-center gap-4">
      <!-- User dropdown -->
      <div
        class="relative"
        data-user-menu
      >
        <button
          class="flex items-center gap-3 hover:opacity-80 transition-opacity"
          @click.stop="showUserMenu = !showUserMenu"
        >
          <div class="hidden sm:block text-right">
            <p class="text-[13px] font-medium text-slate-900 leading-none">
              {{ user?.name ?? 'Platform' }}
            </p>
            <p class="text-[11px] text-[#6b7280] mt-[2px]">
              {{ user?.email ?? '' }}
            </p>
          </div>
          <div class="size-9 rounded-full bg-[#0f0f29] flex items-center justify-center text-white text-[14px] font-semibold flex-shrink-0">
            {{ user?.name?.charAt(0)?.toUpperCase() ?? 'R' }}
          </div>
        </button>

        <!-- Dropdown -->
        <div
          v-if="showUserMenu"
          class="absolute right-0 top-full mt-2 w-44 bg-white border border-[#e5e7eb] rounded shadow-md z-50"
        >
          <div class="px-4 py-3 border-b border-[#e5e7eb]">
            <p class="text-[13px] font-medium text-slate-900 truncate">
              {{ user?.name }}
            </p>
            <p class="text-[11px] text-[#6b7280] truncate">
              {{ user?.email }}
            </p>
          </div>
          <UButton
            icon="i-lucide-log-out"
            :label="isLoggingOut ? 'Đang thoát...' : 'Đăng xuất'"
            color="neutral"
            variant="ghost"
            size="sm"
            class="w-full justify-start"
            :disabled="isLoggingOut"
            @click="handleLogout"
          />
        </div>
      </div>
    </div>
  </header>
</template>
