<script setup lang="ts">
import type { ProjectContractSummary } from '~/composables/api/usePartnerCommissionContracts'
import { PROJECT_HEALTH_META } from '~/composables/api/usePartnerCommissionContracts'

interface Props {
  items: ProjectContractSummary[]
  modelValue: number | undefined
  loading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

// ─── Coverage meter ────────────────────────────────────────────
const total = computed(() => props.items.length)
const activeCount = computed(() => props.items.filter(i => i.health === 'active').length)
const gapCount = computed(() => props.items.filter(i => i.health === 'none').length)
const fullyCovered = computed(() => total.value > 0 && activeCount.value === total.value)

// ─── Search (only surfaces when the rail gets long) ────────────
const SEARCH_THRESHOLD = 7
const search = ref('')
const showSearch = computed(() => props.items.length > SEARCH_THRESHOLD)
const visibleItems = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return props.items
  return props.items.filter(i => i.projectName.toLowerCase().includes(q))
})

function select(id: number): void {
  emit('update:modelValue', id)
}
</script>

<template>
  <div class="bg-white border border-border-gray rounded-xl shadow-sm overflow-hidden flex flex-col">
    <!-- Coverage header -->
    <div class="px-4 py-4 border-b border-border-gray">
      <div class="flex items-center justify-between gap-2">
        <h2 class="font-bold text-slate-900 text-sm flex items-center gap-2">
          <UIcon
            name="i-lucide-folder-kanban"
            class="text-primary size-4 shrink-0"
          />
          Dự án phục vụ
        </h2>
        <span class="text-sm font-semibold tabular-nums text-slate-900">
          {{ activeCount }}<span class="text-slate-400 font-normal">/{{ total }}</span>
        </span>
      </div>

      <UProgress
        :model-value="activeCount"
        :max="Math.max(total, 1)"
        :color="fullyCovered ? 'success' : 'warning'"
        size="sm"
        class="mt-3"
      />

      <p
        v-if="gapCount > 0"
        class="mt-2 text-xs text-red-600 flex items-center gap-1"
      >
        <UIcon
          name="i-lucide-circle-alert"
          class="size-3.5 shrink-0"
        />
        {{ gapCount }} dự án chưa có hợp đồng hiệu lực
      </p>
      <p
        v-else-if="fullyCovered"
        class="mt-2 text-xs text-emerald-600 flex items-center gap-1"
      >
        <UIcon
          name="i-lucide-circle-check"
          class="size-3.5 shrink-0"
        />
        Mọi dự án đều có hợp đồng hiệu lực
      </p>

      <UInput
        v-if="showSearch"
        v-model="search"
        icon="i-lucide-search"
        placeholder="Tìm dự án..."
        size="sm"
        class="mt-3 w-full"
      />
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="p-3 space-y-2"
    >
      <div
        v-for="n in 4"
        :key="n"
        class="h-14 bg-slate-100 rounded-lg animate-pulse"
      />
    </div>

    <!-- Project list -->
    <div
      v-else
      class="p-2 space-y-1 overflow-y-auto max-h-[28rem] lg:max-h-[calc(100vh-16rem)]"
    >
      <button
        v-for="item in visibleItems"
        :key="item.projectId"
        type="button"
        class="w-full text-left rounded-lg px-3 py-2.5 flex items-start gap-2.5 transition ring-1 ring-inset"
        :class="item.projectId === modelValue
          ? 'bg-primary-50 ring-primary-200'
          : 'ring-transparent hover:bg-slate-50'"
        @click="select(item.projectId)"
      >
        <UIcon
          :name="PROJECT_HEALTH_META[item.health].icon"
          class="size-4 mt-0.5 shrink-0"
          :class="PROJECT_HEALTH_META[item.health].tone"
        />
        <div class="min-w-0 flex-1">
          <p
            class="text-sm font-medium truncate"
            :class="item.projectId === modelValue ? 'text-primary-700' : 'text-slate-900'"
          >
            {{ item.projectName }}
          </p>
          <p
            class="text-xs truncate"
            :class="PROJECT_HEALTH_META[item.health].tone"
          >
            {{ PROJECT_HEALTH_META[item.health].label }}
            <span
              v-if="item.activeMode"
              class="text-slate-400"
            >· {{ item.activeMode.label }}</span>
          </p>
          <div
            v-if="item.pendingCount > 0 || item.draftCount > 0"
            class="mt-1.5 flex flex-wrap gap-1"
          >
            <UBadge
              v-if="item.pendingCount > 0"
              color="warning"
              variant="subtle"
              size="xs"
              :label="`${item.pendingCount} chờ`"
            />
            <UBadge
              v-if="item.draftCount > 0"
              color="neutral"
              variant="subtle"
              size="xs"
              :label="`${item.draftCount} nháp`"
            />
          </div>
        </div>
        <UIcon
          v-if="item.projectId === modelValue"
          name="i-lucide-chevron-right"
          class="size-4 text-primary-500 mt-0.5 shrink-0"
        />
      </button>

      <p
        v-if="visibleItems.length === 0"
        class="px-3 py-6 text-center text-sm text-slate-500"
      >
        Không tìm thấy dự án phù hợp.
      </p>
    </div>
  </div>
</template>
