<script setup lang="ts">
import type { PlatformProjectDetailResource } from '~/composables/api/usePlatformProjects'

interface Props {
  project: PlatformProjectDetailResource
}

defineProps<Props>()
</script>

<template>
  <div class="flex flex-col gap-6">
    <SharedSectionCard title="Thông tin dự án">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <SharedFieldDisplay label="Mã dự án">
          <span class="font-mono">{{ project.code }}</span>
        </SharedFieldDisplay>
        <SharedFieldDisplay label="Tên dự án">
          {{ project.name }}
        </SharedFieldDisplay>
        <SharedFieldDisplay label="Địa chỉ">
          <span v-if="project.address">{{ project.address }}</span>
          <span
            v-else
            class="text-slate-400"
          >—</span>
        </SharedFieldDisplay>
        <SharedFieldDisplay label="Trạng thái">
          <UBadge
            :color="project.status.value === 'managing' ? 'success' : 'neutral'"
            variant="subtle"
            :label="project.status.label"
          />
        </SharedFieldDisplay>
      </div>
    </SharedSectionCard>

    <SharedSectionCard title="Công ty vận hành">
      <template #header-actions>
        <UButton
          icon="i-lucide-building-2"
          label="Xem chi tiết công ty VH"
          color="neutral"
          variant="outline"
          size="xs"
          :to="`/platform/tenants/${project.tenant.id}`"
        />
      </template>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <SharedFieldDisplay label="Mã công ty">
          <span class="font-mono">{{ project.tenant.code }}</span>
        </SharedFieldDisplay>
        <SharedFieldDisplay label="Tên công ty">
          {{ project.tenant.name }}
        </SharedFieldDisplay>
        <SharedFieldDisplay label="Trạng thái tenant">
          <UBadge
            :color="project.tenant.is_active ? 'success' : 'warning'"
            variant="subtle"
            :label="project.tenant.is_active ? 'Hoạt động' : 'Vô hiệu'"
          />
        </SharedFieldDisplay>
        <SharedFieldDisplay label="Tên miền">
          <span
            v-if="project.tenant.domain"
            class="font-mono"
          >{{ project.tenant.domain }}</span>
          <span
            v-else
            class="text-slate-400"
          >—</span>
        </SharedFieldDisplay>
      </div>
    </SharedSectionCard>
  </div>
</template>
