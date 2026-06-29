<script setup lang="ts">
import Mindmap from 'vue3-mindmap'
import 'vue3-mindmap/dist/style.css'
import type { MindmapNode } from '~/composables/useCommissionMindmap'

const props = withDefaults(
  defineProps<{
    data?: MindmapNode[]
  }>(),
  { data: () => [] }
)

const mindmapData = computed(() => {
  const d = props.data
  if (!d?.length) {
    return [{ name: 'Chưa có cấu hình', children: [{ name: 'Thiết lập phân bổ ở form bên dưới' }] }]
  }
  return JSON.parse(JSON.stringify(d))
})
</script>

<template>
  <div class="commission-preview-diagram h-[420px] w-full rounded-lg border border-slate-200 bg-slate-50/30 p-4 overflow-hidden">
    <Mindmap
      :model-value="mindmapData"
      :zoom="true"
      :edit="false"
      :drag="false"
      :center-btn="true"
      :fit-btn="true"
      :timetravel="false"
      :add-node-btn="false"
      :download-btn="true"
      :sharp-corner="false"
      :ctm="false"
      locale="en"
      :x-gap="72"
      :y-gap="20"
      :branch="3"
      :scale-extent="[0.15, 1.8]"
    />
  </div>
</template>
