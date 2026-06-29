<script setup lang="ts">
import type { NavItem } from '~/composables/useNavigation'

const { navigationItems } = usePlatformNavigation()
const route = useRoute()

function isActive(to?: string): boolean {
  if (!to) return false
  if (to === '/platform') return route.path === '/platform'
  return route.path === to || route.path.startsWith(to + '/')
}

function isGroupActive(item: NavItem): boolean {
  return Boolean(item.children?.some(child => isActive(child.to)))
}
</script>

<template>
  <!-- Logo -->
  <div class="h-14 flex items-center px-6 border-b border-[#e5e7eb]">
    <NuxtLink
      to="/platform"
      class="flex items-center gap-2"
    >
      <div class="size-6 bg-[#0f0f29] rounded flex items-center justify-center">
        <span
          class="material-symbols-outlined !text-white"
          style="font-size:14px"
        >confirmation_number</span>
      </div>
      <span class="font-bold text-slate-900 tracking-tight">Thần Nông</span>
    </NuxtLink>
  </div>

  <!-- Navigation -->
  <nav class="flex-1 overflow-y-auto py-4 flex flex-col gap-1">
    <template
      v-for="item in navigationItems"
      :key="item.label"
    >
      <!-- Single link (no children) -->
      <NuxtLink
        v-if="!item.children && item.to"
        :to="item.to"
        class="flex items-center gap-3 px-6 py-2 border-l-2 transition-colors"
        :class="isActive(item.to)
          ? 'border-primary bg-primary/5 text-nav-text-primary'
          : 'border-transparent hover:bg-gray-100 text-nav-text-primary'"
      >
        <span class="material-symbols-outlined text-nav-text-secondary">{{ item.icon }}</span>
        <span class="text-[14px] font-medium">{{ item.label }}</span>
      </NuxtLink>

      <!-- Accordion group -->
      <details
        v-else-if="item.children"
        class="group"
        :open="item.defaultOpen || isGroupActive(item)"
      >
        <summary
          class="flex items-center justify-between px-6 py-2 cursor-pointer border-l-2 text-nav-text-primary list-none"
          :class="isGroupActive(item)
            ? 'border-primary bg-primary/5'
            : 'border-transparent hover:bg-gray-100'"
        >
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-nav-text-secondary">{{ item.icon }}</span>
            <span class="text-[14px] font-medium">{{ item.label }}</span>
          </div>
          <span class="material-symbols-outlined text-nav-text-secondary transition-transform group-open:rotate-180">expand_more</span>
        </summary>
        <div class="flex flex-col mt-1">
          <NuxtLink
            v-for="child in item.children"
            :key="child.to"
            :to="child.to"
            class="pl-[52px] pr-6 py-2 text-[13px] border-l-2 transition-colors"
            :class="isActive(child.to)
              ? 'text-primary font-semibold bg-primary/5 border-primary'
              : 'text-nav-text-secondary hover:text-primary hover:bg-gray-50 border-transparent'"
          >
            {{ child.label }}
          </NuxtLink>
        </div>
      </details>
    </template>
  </nav>

  <!-- Footer -->
  <div class="p-4 border-t border-[#e5e7eb]">
    <div class="flex items-center gap-3 text-[#6b7280]">
      <span class="material-symbols-outlined">help_outline</span>
      <span class="text-[13px]">Trợ giúp &amp; Hỗ trợ</span>
    </div>
  </div>
</template>
