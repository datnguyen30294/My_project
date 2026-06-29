<script setup lang="ts">
const mobileOpen = ref(false)
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-background-light">
    <LayoutPlatformSidebar />

    <div class="flex flex-1 flex-col min-w-0 overflow-hidden">
      <LayoutPlatformHeader @toggle-mobile-sidebar="mobileOpen = !mobileOpen" />

      <main class="flex-1 overflow-y-auto bg-background-light p-6">
        <div class="max-w-7xl mx-auto">
          <slot />
        </div>
      </main>
    </div>

    <LayoutPlatformMobileSidebar v-model:open="mobileOpen" />
  </div>
</template>
