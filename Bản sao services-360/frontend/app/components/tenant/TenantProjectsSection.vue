<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { TenantProjectResource } from '~/composables/api/useTenants'
import { useTenantProjects } from '~/composables/api/useTenants'

interface Props {
  tenantId: string
  maxProjects?: number
}

const props = defineProps<Props>()

const page = ref(1)

const { data, status, error, refresh } = useTenantProjects(
  () => props.tenantId,
  computed(() => ({ page: page.value, per_page: DEFAULT_PER_PAGE }))
)

const projects = computed<TenantProjectResource[]>(() => data.value?.data ?? [])
const totalProjects = computed(() => data.value?.meta.total ?? 0)

const countLabel = computed(() =>
  props.maxProjects ? `${totalProjects.value}/${props.maxProjects}` : String(totalProjects.value)
)

const columns: TableColumn<TenantProjectResource>[] = [
  { accessorKey: 'code', header: 'Mã' },
  { accessorKey: 'name', header: 'Tên dự án' },
  { id: 'address', header: 'Địa chỉ' },
  { id: 'status', header: 'Trạng thái' }
]
</script>

<template>
  <SharedSectionCard
    title="Dự án gắn tenant"
    icon="i-lucide-map-pin"
  >
    <template #header-actions>
      <UBadge
        v-if="status !== 'pending'"
        color="neutral"
        variant="subtle"
        :label="countLabel"
      />
    </template>

    <UAlert
      v-if="error"
      icon="i-lucide-alert-circle"
      color="error"
      variant="subtle"
      description="Không thể tải danh sách dự án. Vui lòng thử lại."
      class="mb-4"
    >
      <template #actions>
        <UButton
          label="Thử lại"
          color="error"
          variant="soft"
          size="xs"
          icon="i-lucide-refresh-cw"
          @click="refresh()"
        />
      </template>
    </UAlert>

    <div class="border border-slate-200 rounded-xl overflow-hidden">
      <UTable
        :data="projects"
        :columns="columns"
        :loading="status === 'pending'"
      >
        <template #address-cell="{ row }">
          <span
            v-if="row.original.address"
            class="text-sm text-slate-700"
          >{{ row.original.address }}</span>
          <span
            v-else
            class="text-xs text-gray-400"
          >—</span>
        </template>

        <template #status-cell="{ row }">
          <UBadge
            :color="row.original.status.value === 'managing' ? 'success' : 'neutral'"
            variant="subtle"
            :label="row.original.status.label"
          />
        </template>

        <template #empty>
          <UEmpty
            title="Tenant chưa tạo dự án nào"
            description="Dự án do tenant tự quản lý trên cổng vận hành riêng."
            icon="i-lucide-map-pin"
          />
        </template>
      </UTable>

      <SharedCrudTablePagination
        v-model:page="page"
        :meta="data?.meta"
      />
    </div>
  </SharedSectionCard>
</template>
