<script setup lang="ts">
const open = defineModel<boolean>('open', { default: false })
const route = useRoute()

watch(() => route.fullPath, () => {
  open.value = false
})
</script>

<template>
  <!-- Backdrop -->
  <Transition name="fade">
    <div
      v-if="open"
      class="fixed inset-0 bg-black/40 z-30 lg:hidden"
      @click="open = false"
    />
  </Transition>

  <!-- Drawer -->
  <Transition name="slide">
    <aside
      v-if="open"
      class="fixed top-0 left-0 h-full w-[240px] flex flex-col bg-[#fafafa] border-r border-[#e5e7eb] z-40 lg:hidden overflow-y-auto"
    >
      <LayoutPlatformSidebarContent />
    </aside>
  </Transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: transform 0.2s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(-100%); }
</style>
