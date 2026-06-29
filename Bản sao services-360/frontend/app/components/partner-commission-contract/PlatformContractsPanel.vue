<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type {
  ContractDetail,
  ContractListItem,
  ContractStatusValue
} from '~/composables/api/usePartnerCommissionContracts'
import {
  CONTRACT_STATUS_OPTIONS,
  usePlatformContractList
} from '~/composables/api/usePartnerCommissionContracts'

interface Props {
  partnerId: number | string
}

const props = defineProps<Props>()

const route = useRoute()
const router = useRouter()

// ─── Load all contracts of this vendor (across tenants) ────────

const {
  data: contractsData,
  status: contractsStatus,
  error: contractsError,
  refresh: refreshContracts
} = usePlatformContractList(
  computed(() => ({ partner_id: Number(props.partnerId), per_page: SELECT_ALL_PER_PAGE }))
)

const allContracts = computed<ContractListItem[]>(() => contractsData.value?.data ?? [])

// ─── Filter options derived from loaded contracts ──────────────

const tenantOptions = computed(() => {
  const map = new Map<string, string>()
  for (const c of allContracts.value) {
    if (!map.has(c.tenant_id)) {
      map.set(c.tenant_id, c.tenant_name ? `${c.tenant_name} (${c.tenant_id})` : c.tenant_id)
    }
  }
  return [
    { label: 'Tất cả tenant', value: undefined as string | undefined },
    ...[...map.entries()].map(([value, label]) => ({ label, value }))
  ]
})

const tenantFilter = ref<string | undefined>(undefined)

const projectOptions = computed(() => {
  const map = new Map<number, string>()
  for (const c of allContracts.value) {
    if (tenantFilter.value && c.tenant_id !== tenantFilter.value) continue
    if (!map.has(c.project_id)) {
      map.set(c.project_id, c.project_name ?? `Dự án #${c.project_id}`)
    }
  }
  return [
    { label: 'Tất cả dự án', value: undefined as number | undefined },
    ...[...map.entries()].map(([value, label]) => ({ label, value }))
  ]
})

const projectFilter = ref<number | undefined>(undefined)
const statusFilter = ref<ContractStatusValue | undefined>(undefined)

watch(tenantFilter, () => {
  projectFilter.value = undefined
})

const statusItems = [
  { label: 'Tất cả trạng thái', value: undefined as ContractStatusValue | undefined },
  ...CONTRACT_STATUS_OPTIONS.map(o => ({ label: o.label, value: o.value as ContractStatusValue | undefined }))
]

const filteredContracts = computed(() =>
  allContracts.value.filter((c) => {
    if (tenantFilter.value && c.tenant_id !== tenantFilter.value) return false
    if (projectFilter.value && c.project_id !== projectFilter.value) return false
    if (statusFilter.value && c.status.value !== statusFilter.value) return false
    return true
  })
)

const hasFilters = computed(() =>
  !!tenantFilter.value || !!projectFilter.value || !!statusFilter.value
)

function clearFilters(): void {
  tenantFilter.value = undefined
  projectFilter.value = undefined
  statusFilter.value = undefined
}

// ─── Drawers ───────────────────────────────────────────────────

const detailDrawerOpen = ref(false)
const selectedContractId = ref<number | null>(null)

function openDetail(id: number): void {
  selectedContractId.value = id
  detailDrawerOpen.value = true
}

// Deep-link: auto-open a contract drawer when navigated to with ?contract=.
const initialContractId = route.query.contract ? Number(route.query.contract) : null
if (initialContractId) {
  openDetail(initialContractId)
}

watch(detailDrawerOpen, (open) => {
  if (open || !route.query.contract) return
  const query = { ...route.query }
  delete query.contract
  router.replace({ query })
})

const formDrawerOpen = ref(false)
const editContract = ref<ContractDetail | null>(null)

function openCreate(): void {
  editContract.value = null
  formDrawerOpen.value = true
}

function openEdit(contract: ContractDetail): void {
  detailDrawerOpen.value = false
  editContract.value = contract
  formDrawerOpen.value = true
}

async function reloadAll(): Promise<void> {
  await refreshContracts()
}

// ─── Table ─────────────────────────────────────────────────────

const columns: TableColumn<ContractListItem>[] = [
  { accessorKey: 'contract_code', header: 'Mã hợp đồng' },
  { id: 'tenant', header: 'Tenant' },
  { id: 'project', header: 'Dự án' },
  { id: 'mode', header: 'Loại' },
  { id: 'status', header: 'Trạng thái' },
  { id: 'effective', header: 'Hiệu lực' }
]
</script>

<template>
  <div class="space-y-4">
    <!-- Filters + action -->
    <div class="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 flex-wrap shadow-sm">
      <USelectMenu
        v-model="tenantFilter"
        :items="tenantOptions"
        value-key="value"
        searchable
        class="min-w-[220px]"
      />
      <USelectMenu
        v-model="projectFilter"
        :items="projectOptions"
        value-key="value"
        searchable
        class="min-w-[200px]"
      />
      <USelect
        v-model="statusFilter"
        :items="statusItems"
        value-key="value"
        class="min-w-[180px]"
      />
      <UButton
        v-if="hasFilters"
        icon="i-lucide-x"
        label="Xoá bộ lọc"
        color="neutral"
        variant="ghost"
        size="sm"
        @click="clearFilters"
      />

      <div class="flex-1" />

      <UButton
        icon="i-lucide-plus"
        label="Tạo hợp đồng"
        color="primary"
        variant="soft"
        size="sm"
        @click="openCreate"
      />
    </div>

    <UAlert
      v-if="contractsError"
      icon="i-lucide-alert-circle"
      color="error"
      variant="subtle"
      description="Không thể tải danh sách hợp đồng."
    />

    <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <UTable
        :data="filteredContracts"
        :columns="columns"
        :loading="contractsStatus === 'pending'"
      >
        <template #contract_code-cell="{ row }">
          <button
            type="button"
            class="font-mono font-semibold text-primary-700 hover:underline"
            @click="openDetail(row.original.id)"
          >
            {{ row.original.contract_code }}
          </button>
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

        <template #project-cell="{ row }">
          <span class="text-sm">{{ row.original.project_name ?? `#${row.original.project_id}` }}</span>
        </template>

        <template #mode-cell="{ row }">
          <PartnerCommissionContractModeBadge :mode="row.original.commission_mode" />
        </template>

        <template #status-cell="{ row }">
          <PartnerCommissionContractStatusBadge :status="row.original.status" />
        </template>

        <template #effective-cell="{ row }">
          <span class="text-xs text-slate-600">
            {{ row.original.starts_at ? formatDate(row.original.starts_at) : '—' }}
            → {{ row.original.ends_at ? formatDate(row.original.ends_at) : 'Không thời hạn' }}
          </span>
        </template>

        <template #empty>
          <div class="py-8 text-center text-sm text-slate-500">
            Vendor chưa có hợp đồng hoa hồng nào.
          </div>
        </template>
      </UTable>
    </div>

    <!-- Detail drawer (full lifecycle) -->
    <PartnerCommissionContractDetailDrawer
      v-model:open="detailDrawerOpen"
      scope="platform"
      :contract-id="selectedContractId"
      @changed="reloadAll"
      @edit="openEdit"
    />

    <!-- Form drawer (create + edit draft) -->
    <PartnerCommissionContractFormDrawer
      v-model:open="formDrawerOpen"
      scope="platform"
      :partner-id="props.partnerId"
      :contract="editContract"
      @saved="reloadAll"
    />
  </div>
</template>
