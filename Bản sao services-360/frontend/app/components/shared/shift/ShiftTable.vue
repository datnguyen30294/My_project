<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { ShiftResource } from '#api/generated/laravel'

interface Props {
  shifts: ShiftResource[]
}

defineProps<Props>()

defineEmits<{
  edit: [shift: ShiftResource]
  delete: [shift: ShiftResource]
}>()

const columns: TableColumn<ShiftResource>[] = [
  { accessorKey: 'code', header: 'Mã ca' },
  { accessorKey: 'name', header: 'Tên' },
  { id: 'project', header: 'Dự án' },
  { accessorKey: 'type', header: 'Kiểu ca' },
  { accessorKey: 'work_group', header: 'Nhóm xử lý' },
  { id: 'time_range', header: 'Khung giờ' },
  { accessorKey: 'break_hours', header: 'Giờ nghỉ' },
  { accessorKey: 'work_hours', header: 'Giờ công' },
  { accessorKey: 'status', header: 'Trạng thái' },
  stickyRight<ShiftResource>({ id: 'actions', header: 'Tác vụ' })
]

const formatHours = (value: number): string => {
  const rounded = Math.round(value * 10) / 10
  return `${rounded.toFixed(1)} giờ`
}
</script>

<template>
  <UTable
    :data="shifts"
    :columns="columns"
  >
    <template #code-cell="{ row }">
      <span class="font-semibold text-slate-900">{{ row.original.code }}</span>
    </template>

    <template #project-cell="{ row }">
      <span
        v-if="row.original.project"
        class="text-slate-700"
      >
        {{ row.original.project.name }}
      </span>
      <span
        v-else
        class="text-slate-400"
      >—</span>
    </template>

    <template #type-cell="{ row }">
      <UBadge
        color="primary"
        variant="subtle"
      >
        {{ row.original.type }}
      </UBadge>
    </template>

    <template #work_group-cell="{ row }">
      <UBadge
        color="success"
        variant="subtle"
      >
        {{ row.original.work_group }}
      </UBadge>
    </template>

    <template #time_range-cell="{ row }">
      <div class="inline-flex items-center gap-1.5 text-slate-700">
        <span>{{ row.original.start_time }} - {{ row.original.end_time }}</span>
        <UIcon
          v-if="row.original.is_overnight"
          name="i-lucide-moon"
          class="size-4 text-indigo-500"
          title="Ca qua đêm"
        />
      </div>
    </template>

    <template #break_hours-cell="{ row }">
      {{ formatHours(row.original.break_hours) }}
    </template>

    <template #work_hours-cell="{ row }">
      <span class="font-medium">{{ formatHours(row.original.work_hours) }}</span>
    </template>

    <template #status-cell="{ row }">
      <UBadge
        :color="SHIFT_STATUS_BADGE_COLOR[row.original.status.value] ?? 'neutral'"
        variant="subtle"
      >
        {{ row.original.status.label }}
      </UBadge>
    </template>

    <template #actions-cell="{ row }">
      <SharedCrudTableActions
        @edit="$emit('edit', row.original)"
        @delete="$emit('delete', row.original)"
      />
    </template>
  </UTable>
</template>
