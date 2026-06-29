<script setup lang="ts">
import type { PartnerDetail } from '~/composables/api/usePartners'

interface Props {
  vendor: PartnerDetail
}

const props = defineProps<Props>()

const emit = defineEmits<{ changed: [] }>()

const projects = computed(() => props.vendor.projects ?? [])
const projectCount = computed(() => projects.value.length)

function customDomainUrl(domain: string): string {
  return /^https?:\/\//i.test(domain) ? domain : `https://${domain}`
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <SharedSectionCard
      title="Thông tin vendor"
      icon="i-lucide-info"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <SharedFieldDisplay label="Mã vendor">
          <span class="font-mono">{{ vendor.slug }}</span>
        </SharedFieldDisplay>
        <SharedFieldDisplay label="Tên vendor">
          <span class="font-medium">{{ vendor.name }}</span>
        </SharedFieldDisplay>
        <SharedFieldDisplay label="Người tạo">
          <UBadge
            :color="vendor.owner_source.value === 'tenant' ? 'neutral' : 'primary'"
            variant="subtle"
            size="sm"
            :label="vendor.owner_source.label"
          />
        </SharedFieldDisplay>
        <SharedFieldDisplay
          v-if="vendor.owner_tenant_id"
          label="Công ty vận hành"
        >
          <NuxtLink
            :to="`/platform/tenants/${vendor.owner_tenant_id}`"
            class="text-primary-600 hover:underline font-mono"
          >
            {{ vendor.owner_tenant_id }}
          </NuxtLink>
        </SharedFieldDisplay>
        <SharedFieldDisplay label="Ngày tạo">
          {{ vendor.created_at ? formatDateTime(vendor.created_at) : '—' }}
        </SharedFieldDisplay>
        <SharedFieldDisplay
          v-if="vendor.description"
          label="Ghi chú"
          class="sm:col-span-2"
        >
          <p class="whitespace-pre-line text-slate-700">
            {{ vendor.description }}
          </p>
        </SharedFieldDisplay>
      </div>
    </SharedSectionCard>

    <SharedSectionCard
      title="Trang shop resi_mart"
      icon="i-lucide-store"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <SharedFieldDisplay
          label="Danh mục"
          class="sm:col-span-2"
        >
          <div
            v-if="vendor.categories.length"
            class="flex flex-wrap gap-1.5"
          >
            <UBadge
              v-for="cat in vendor.categories"
              :key="cat"
              color="info"
              variant="subtle"
              :label="cat"
              size="xs"
            />
          </div>
          <span
            v-else
            class="text-slate-400"
          >—</span>
        </SharedFieldDisplay>
        <SharedFieldDisplay label="Custom domain">
          <a
            v-if="vendor.custom_domain && vendor.is_provisioned"
            :href="customDomainUrl(vendor.custom_domain)"
            target="_blank"
            rel="noopener"
            class="text-primary-600 hover:underline inline-flex items-center gap-1"
          >
            {{ vendor.custom_domain }}
            <UIcon
              name="i-lucide-external-link"
              class="size-3.5"
            />
          </a>
          <span v-else>{{ vendor.custom_domain ?? '—' }}</span>
        </SharedFieldDisplay>
        <SharedFieldDisplay label="Trạng thái resi_mart">
          <UBadge
            :color="vendor.is_provisioned ? 'success' : 'warning'"
            variant="subtle"
            size="sm"
            :icon="vendor.is_provisioned ? 'i-lucide-check' : 'i-lucide-clock'"
            :label="vendor.is_provisioned ? 'Đã provision' : 'Chờ provision'"
          />
        </SharedFieldDisplay>
        <SharedFieldDisplay
          v-if="vendor.is_provisioned"
          label="Tenant ID resi_mart"
        >
          <span class="font-mono text-sm">{{ vendor.tenant_id ?? '—' }}</span>
        </SharedFieldDisplay>
      </div>
    </SharedSectionCard>

    <VendorConsoleDefaultCommissionCard
      :partner-id="vendor.id"
      :project-count="projectCount"
      @applied="emit('changed')"
    />

    <VendorConsoleProjectsCommissionCard :projects="projects" />

    <div>
      <h3 class="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
        <UIcon
          name="i-lucide-handshake"
          class="size-4 text-slate-400"
        />
        Hợp đồng hoa hồng (theo dự án)
      </h3>
      <PartnerCommissionContractPlatformContractsPanel :partner-id="vendor.id" />
    </div>
  </div>
</template>
