<script setup lang="ts">
const route = useRoute()

const navLinks = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Dịch vụ', to: '/dich-vu' },
  { label: 'Gửi yêu cầu', to: '/ticket' }
]

function isActive(to: string): boolean {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 md:px-10 lg:px-40 py-4">
    <div class="flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink
        to="/"
        class="flex items-center gap-3"
      >
        <div class="flex items-center justify-center size-10 rounded-lg bg-slate-900 text-white">
          <span class="material-symbols-outlined text-2xl">domain</span>
        </div>
        <h2 class="text-slate-900 text-xl font-extrabold leading-tight tracking-tight">Thần Nông</h2>
      </NuxtLink>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center gap-8">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.label"
          :to="link.to"
          :class="[
            'text-sm font-medium transition-colors',
            isActive(link.to)
              ? 'text-slate-900 font-semibold border-b-2 border-slate-900 pb-1'
              : 'text-slate-500 hover:text-slate-900'
          ]"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <!-- Right: CTA -->
      <NuxtLink
        to="/ticket"
        class="flex items-center justify-center rounded-lg h-10 px-5 bg-slate-900 text-white text-sm font-bold transition-all hover:bg-slate-800"
      >
        Gửi yêu cầu
      </NuxtLink>
    </div>
  </header>
</template>
