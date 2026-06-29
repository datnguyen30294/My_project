<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { PartnerProjectRow } from '~/composables/api/usePartners'

interface Props {
  projects: PartnerProjectRow[]
}

defineProps<Props>()

const columns: TableColumn<PartnerProjectRow>[] = [
  { id: 'project', header: 'Dự án' },
  { id: 'tenant', header: 'Công ty vận hành' },
  { id: 'enabled', header: 'Trạng thái' },
  { id: 'commission', header: 'Cách tính' },
  { id: 'recipient', header: 'Người nhận DT' }
]
</script>

<template>
  <SharedSectionCard
    title="Dự án & hoa hồng theo dự án"
    icon="i-lucide-folder-tree"
    compact
  >
    <template #header-actions>
      <span class="text-xs text-slate-500">
        Cấu hình chi tiết tại "Hợp đồng hoa hồng" bên dưới
      </span>
    </template>

    <div class="border border-slate-200 rounded-lg overflow-hidden">
      <UTable
        :data="projects"
        :columns="columns"
      >
        <template #project-cell="{ row }">
          <div>
            <p class="text-sm font-medium text-slate-900">
              {{ row.original.project_name }}
            </p>
            <p class="text-xs text-slate-500 font-mono">
              #{{ row.original.project_id }}
            </p>
          </div>
        </template>

        <template #tenant-cell="{ row }">
          <div>
            <p class="text-sm text-slate-900">
              {{ row.original.tenant_name ?? '—' }}
            </p>
            <p class="text-xs text-slate-500 font-mono">
              {{ row.original.tenant_id }}
            </p>
          </div>
        </template>

        <template #enabled-cell="{ row }">
          <UBadge
            :color="row.original.is_vendor_enabled ? 'success' : 'neutral'"
            variant="subtle"
            :label="row.original.is_vendor_enabled ? 'Đang quản lý' : 'Đã dừng'"
          />
        </template>

        <template #commission-cell="{ row }">
          <div
            v-if="row.original.commission"
            class="flex items-center gap-2"
          >
            <UBadge
              color="primary"
              variant="subtle"
              :label="row.original.commission.mode.label"
            />
            <UBadge
              v-if="row.original.commission.is_override"
              color="info"
              variant="subtle"
              size="xs"
              label="Ghi đè"
            />
          </div>
          <UBadge
            v-else
            color="neutral"
            variant="subtle"
            label="Chưa cấu hình"
          />
        </template>

        <template #recipient-cell="{ row }">
          <UBadge
            v-if="row.original.commission"
            :color="row.original.commission.revenue_recipient.value === 'platform' ? 'primary' : 'neutral'"
            variant="subtle"
            :label="row.original.commission.revenue_recipient.label"
          />
          <span
            v-else
            class="text-slate-400"
          >—</span>
        </template>

        <template #empty>
          <div class="py-8 text-center text-sm text-slate-500">
            Vendor chưa được gắn vào dự án nào.
          </div>
        </template>
      </UTable>
    </div>
  </SharedSectionCard>
</template>
