<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { ProjectVendorResource } from '~/composables/api/usePlatformProjects'
import { useProjectVendors, apiToggleProjectVendor } from '~/composables/api/usePlatformProjects'

interface Props {
  tenantId: string
  projectId: number
}

const props = defineProps<Props>()
const toast = useToast()

const { data, status, error, refresh } = useProjectVendors(
  () => props.tenantId,
  () => props.projectId
)

const vendors = computed<ProjectVendorResource[]>(() => data.value?.data ?? [])
const stats = computed(() => data.value?.stats ?? { total: 0, enabled_count: 0 })
const schemaMissing = computed(() => data.value?.warnings?.schema_missing ?? false)

const togglingIds = ref<Set<number>>(new Set())

function statusColor(value: string) {
  if (value === 'active') return 'success'
  if (value === 'suspended') return 'warning'
  return 'neutral'
}

async function onToggle(vendor: ProjectVendorResource, enabled: boolean) {
  togglingIds.value.add(vendor.partner_id)
  try {
    await apiToggleProjectVendor(props.tenantId, props.projectId, vendor.partner_id, enabled)
    await refresh()
    toast.add({
      title: enabled ? 'Đã bật vendor trên dự án' : 'Đã tạm tắt vendor trên dự án',
      color: 'success'
    })
  } catch {
    toast.add({ title: 'Không thể cập nhật trạng thái vendor. Vui lòng thử lại.', color: 'error' })
    await refresh()
  } finally {
    togglingIds.value.delete(vendor.partner_id)
  }
}

const columns: TableColumn<ProjectVendorResource>[] = [
  { accessorKey: 'code', header: 'Mã vendor' },
  { accessorKey: 'name', header: 'Tên' },
  { id: 'status', header: 'Trạng thái' },
  { id: 'offer_count', header: 'Gói dịch vụ' },
  { id: 'order_count', header: 'Số đơn' },
  { id: 'enabled', header: 'Cho phép cung cấp' }
]
</script>

<template>
  <SharedSectionCard
    title="Vendor / đối tác trên dự án"
    icon="i-lucide-store"
  >
    <template #header-actions>
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <UBadge
          color="neutral"
          variant="subtle"
          :label="`Tổng vendor: ${stats.total}`"
        />
        <UBadge
          color="success"
          variant="subtle"
          :label="`Đang bật: ${stats.enabled_count}`"
        />
      </div>
    </template>

    <p class="text-sm text-slate-500 mb-4">
      Bật/tắt để cho phép hoặc tạm chặn vendor cung cấp dịch vụ trên dự án này. Tắt vendor giữ nguyên liên kết, có thể bật lại bất cứ lúc nào.
    </p>

    <UAlert
      v-if="schemaMissing"
      icon="i-lucide-triangle-alert"
      color="warning"
      variant="subtle"
      title="Một số vendor chưa kết nối được dữ liệu marketplace"
      description="Số gói dịch vụ / số đơn của các vendor đó tạm hiển thị 0."
      class="mb-4"
    />

    <UAlert
      v-if="error"
      icon="i-lucide-alert-circle"
      color="error"
      variant="subtle"
      description="Không thể tải danh sách vendor. Vui lòng thử lại."
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
        :data="vendors"
        :columns="columns"
        :loading="status === 'pending'"
      >
        <template #code-cell="{ row }">
          <span class="font-mono text-slate-900">{{ row.original.code }}</span>
        </template>

        <template #status-cell="{ row }">
          <UBadge
            :color="statusColor(row.original.status.value)"
            variant="subtle"
            :label="row.original.status.label"
          />
        </template>

        <template #offer_count-cell="{ row }">
          <span class="tabular-nums text-slate-700">{{ row.original.offer_count }}</span>
        </template>

        <template #order_count-cell="{ row }">
          <span class="tabular-nums text-slate-700">{{ row.original.order_count }}</span>
        </template>

        <template #enabled-cell="{ row }">
          <div class="flex items-center gap-2">
            <USwitch
              :model-value="row.original.enabled"
              :loading="togglingIds.has(row.original.partner_id)"
              @update:model-value="(val: boolean) => onToggle(row.original, val)"
            />
            <span class="text-xs text-slate-500">{{ row.original.enabled ? 'Đang bật' : 'Đã tắt' }}</span>
          </div>
        </template>

        <template #empty>
          <UEmpty
            icon="i-lucide-store"
            title="Chưa có vendor"
            description="Vendor cung cấp dịch vụ trên dự án sẽ hiển thị tại đây."
          />
        </template>
      </UTable>
    </div>
  </SharedSectionCard>
</template>
