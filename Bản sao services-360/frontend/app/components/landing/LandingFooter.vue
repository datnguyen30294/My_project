<script setup lang="ts">
const route = useRoute()

const footerLinks = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Dịch vụ', to: '/dich-vu' },
  { label: 'Gửi yêu cầu', to: '/ticket' },
  { label: 'Điều khoản sử dụng', to: '/chinh-sach' },
  { label: 'Chính sách bảo mật', to: '/chinh-sach-bao-mat' }
]

function isActive(to: string): boolean {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}
</script>

<template>
  <footer class="bg-white border-t border-slate-200 lg:px-40 px-6 py-12">
    <div class="max-w-7xl mx-auto flex flex-col items-center gap-8">
      <div class="flex flex-col md:flex-row justify-between items-center w-full gap-8">
        <NuxtLink
          to="/"
          class="flex items-center gap-3"
        >
          <span class="material-symbols-outlined text-slate-900 text-3xl">domain</span>
          <span class="text-lg font-bold text-slate-900">Thần Nông</span>
        </NuxtLink>
        <div class="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <NuxtLink
            v-for="link in footerLinks"
            :key="link.label"
            :to="link.to"
            :class="[
              'text-sm font-medium transition-colors',
              isActive(link.to)
                ? 'text-slate-900 font-semibold'
                : 'text-slate-500 hover:text-slate-900'
            ]"
          >
            {{ link.label }}
          </NuxtLink>
        </div>
      </div>
      <div class="w-full border-t border-slate-100 pt-6">
        <p class="text-slate-400 text-sm text-center">
          &copy; {{ new Date().getFullYear() }} Thần Nông. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>
