<script setup lang="ts">
const mobileOpen = ref(false)
const { items: breadcrumbItems } = useBreadcrumb()
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-background-light">
    <LayoutAppSidebar />

    <div class="flex flex-1 flex-col min-w-0 overflow-hidden">
      <LayoutAppHeader @toggle-mobile-sidebar="mobileOpen = !mobileOpen" />

      <main class="flex-1 overflow-y-auto bg-background-light p-3 sm:p-6">
        <div class="max-w-7xl mx-auto">
          <!-- Breadcrumb -->
          <nav
            v-if="breadcrumbItems.length > 1"
            class="flex mb-4 text-[12px] text-nav-text-secondary gap-2 items-center"
          >
            <template
              v-for="(item, index) in breadcrumbItems"
              :key="index"
            >
              <span
                v-if="index > 0"
                class="material-symbols-outlined !text-[14px]"
              >chevron_right</span>
              <NuxtLink
                v-if="item.to"
                :to="item.to"
                class="hover:text-primary"
              >{{ item.label }}</NuxtLink>
              <span
                v-else
                :class="index === breadcrumbItems.length - 1
                  ? 'text-slate-900 font-medium'
                  : 'text-nav-text-secondary'"
              >{{ item.label }}</span>
            </template>
          </nav>

          <slot />
        </div>
      </main>
    </div>

    <LayoutAppMobileSidebar v-model:open="mobileOpen" />
  </div>
</template>
