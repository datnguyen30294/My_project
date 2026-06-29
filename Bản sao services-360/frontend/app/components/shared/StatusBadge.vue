<script setup lang="ts">
interface Props {
  active: boolean
  activeLabel?: string
  inactiveLabel?: string
}

withDefaults(defineProps<Props>(), {
  activeLabel: 'Hoạt động',
  inactiveLabel: 'Không hoạt động'
})
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium border"
    :class="active
      ? 'bg-green-50 text-green-700 border-green-100'
      : 'bg-slate-50 text-slate-500 border-slate-200'
    "
  >
    <span
      class="w-1.5 h-1.5 rounded-full"
      :class="active ? 'bg-green-500' : 'bg-slate-400'"
    />
    {{ active ? activeLabel : inactiveLabel }}
  </span>
</template>
