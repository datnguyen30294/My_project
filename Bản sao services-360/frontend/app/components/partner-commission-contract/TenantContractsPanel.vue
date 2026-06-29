<script setup lang="ts">
import type {
  ContractListItem,
  ContractDetail
} from '~/composables/api/usePartnerCommissionContracts'
import {
  useTenantContractList,
  summarizeProjectContracts,
  PROJECT_HEALTH_META
} from '~/composables/api/usePartnerCommissionContracts'

interface Props {
  partnerId: number | string
  /** Projects this vendor is linked to (served), for the picker universe. */
  projectIds?: number[]
}

const props = withDefaults(defineProps<Props>(), {
  projectIds: () => []
})

const route = useRoute()
const router = useRouter()

const TERMINAL_STATUSES = ['replaced', 'cancelled', 'expired', 'revoked']

// ─── Single source of truth: every contract of this vendor ─────
// The list endpoint returns ALL projects and ALL statuses for a partner, so we
// derive both the project rail and the per-project detail from one fetch — no
// per-project refetch, instant switching.

const {
  data: contractsData,
  status: contractsStatus,
  refresh: refreshContracts
} = useTenantContractList(
  computed(() => ({ partner_id: Number(props.partnerId), per_page: SELECT_ALL_PER_PAGE }))
)

const allContracts = computed<ContractListItem[]>(() => contractsData.value?.data ?? [])

// Project names (served-but-uncontracted projects have no contract row to name them).
const { data: projectsData } = useProjectList(
  computed(() => ({ per_page: SELECT_ALL_PER_PAGE }))
)
const projects = computed(() =>
  (projectsData.value?.data ?? []).map(p => ({ id: p.id, name: p.name }))
)

const summaries = computed(() =>
  summarizeProjectContracts(allContracts.value, projects.value, props.projectIds)
)

const isInitialLoading = computed(() =>
  contractsStatus.value === 'pending' && allContracts.value.length === 0
)

// ─── Selected project ──────────────────────────────────────────

const selectedProjectId = ref<number | undefined>(
  route.query.project ? Number(route.query.project) : undefined
)

// Default to the first project (problems sort first) once summaries load, and
// clamp a stale/foreign selection back into the visible set.
watch(summaries, (rows) => {
  if (rows.length === 0) return
  const exists = rows.some(r => r.projectId === selectedProjectId.value)
  if (!selectedProjectId.value || !exists) {
    selectedProjectId.value = rows[0]!.projectId
  }
}, { immediate: true })

watch(selectedProjectId, (v) => {
  router.replace({ query: { ...route.query, project: v ? String(v) : undefined } })
})

const selectedSummary = computed(() =>
  summaries.value.find(s => s.projectId === selectedProjectId.value) ?? null
)

// ─── Per-project breakdown (client-side) ───────────────────────

const projectContracts = computed(() =>
  allContracts.value.filter(c => c.project_id === selectedProjectId.value)
)
const activeContract = computed(() =>
  projectContracts.value.find(c => c.status.value === 'active') ?? null
)
const pendingContracts = computed(() =>
  projectContracts.value.filter(c => c.status.value === 'pending')
)
const draftContracts = computed(() =>
  projectContracts.value.filter(c => c.status.value === 'draft')
)
const historyContracts = computed(() =>
  projectContracts.value.filter(c => TERMINAL_STATUSES.includes(c.status.value))
)

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

const showHistory = ref(false)
</script>

<template>
  <div>
    <!-- Initial loading -->
    <div
      v-if="isInitialLoading"
      class="grid lg:grid-cols-[19rem_minmax(0,1fr)] gap-5"
    >
      <div class="h-72 bg-slate-100 rounded-xl animate-pulse" />
      <div class="h-72 bg-slate-100 rounded-xl animate-pulse" />
    </div>

    <!-- No projects to contract -->
    <UAlert
      v-else-if="summaries.length === 0"
      color="info"
      variant="subtle"
      icon="i-lucide-info"
      title="Vendor chưa được gán cho dự án nào"
      description="Sang tab Thông tin để thêm dự án cho vendor, sau đó tạo hợp đồng hoa hồng cho từng dự án."
    />

    <!-- Master–detail -->
    <div
      v-else
      class="grid lg:grid-cols-[19rem_minmax(0,1fr)] gap-5 items-start"
    >
      <!-- Rail -->
      <PartnerCommissionContractProjectRail
        v-model="selectedProjectId"
        :items="summaries"
        :loading="contractsStatus === 'pending' && allContracts.length === 0"
        class="lg:sticky lg:top-4"
      />

      <!-- Detail pane -->
      <div class="space-y-5 min-w-0">
        <!-- Pane header -->
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="min-w-0">
            <h3 class="text-lg font-bold text-slate-900 truncate">
              {{ selectedSummary?.projectName ?? '—' }}
            </h3>
            <p
              v-if="selectedSummary"
              class="text-sm flex items-center gap-1.5 mt-0.5"
              :class="PROJECT_HEALTH_META[selectedSummary.health].tone"
            >
              <UIcon
                :name="PROJECT_HEALTH_META[selectedSummary.health].icon"
                class="size-4 shrink-0"
              />
              {{ PROJECT_HEALTH_META[selectedSummary.health].label }}
            </p>
          </div>
          <UButton
            icon="i-lucide-plus"
            label="Tạo hợp đồng mới"
            color="primary"
            variant="soft"
            size="sm"
            class="shrink-0"
            @click="openCreate"
          />
        </div>

        <!-- No active warning -->
        <UAlert
          v-if="!activeContract"
          color="error"
          variant="subtle"
          icon="i-lucide-alert-triangle"
          title="Không có hợp đồng đang hiệu lực"
          description="Vendor không thể nhận đơn mới ở dự án này. Vui lòng kích hoạt một hợp đồng chờ hoặc tạo hợp đồng mới."
        />

        <!-- Active contract -->
        <SharedSectionCard
          v-if="activeContract"
          title="Hợp đồng đang hiệu lực"
        >
          <button
            type="button"
            class="w-full text-left flex flex-wrap items-start justify-between gap-4 group"
            @click="openDetail(activeContract.id)"
          >
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 flex-wrap mb-2">
                <span class="font-mono font-semibold text-slate-900 group-hover:text-primary-700 group-hover:underline">{{ activeContract.contract_code }}</span>
                <PartnerCommissionContractStatusBadge :status="activeContract.status" />
                <PartnerCommissionContractModeBadge :mode="activeContract.commission_mode" />
              </div>
              <p class="text-sm text-slate-500">
                Hiệu lực: {{ activeContract.starts_at ? formatDate(activeContract.starts_at) : '—' }}
                → {{ activeContract.ends_at ? formatDate(activeContract.ends_at) : 'Không thời hạn' }}
              </p>
              <p
                v-if="activeContract.activated_at"
                class="text-xs text-slate-400 mt-1"
              >
                Kích hoạt lúc {{ formatDateTime(activeContract.activated_at) }}
              </p>
            </div>
            <UIcon
              name="i-lucide-chevron-right"
              class="text-slate-400 mt-1 shrink-0"
            />
          </button>
        </SharedSectionCard>

        <!-- Draft contracts -->
        <SharedSectionCard
          v-if="draftContracts.length > 0"
          :title="`Bản nháp (${draftContracts.length})`"
        >
          <div class="space-y-3">
            <button
              v-for="item in draftContracts"
              :key="item.id"
              type="button"
              class="w-full text-left border border-slate-200 rounded-lg p-4 flex flex-wrap items-start justify-between gap-3 hover:border-primary-300 hover:bg-primary-50/30 transition"
              @click="openDetail(item.id)"
            >
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2 flex-wrap mb-1">
                  <span class="font-mono font-semibold text-slate-900">{{ item.contract_code ?? 'Chưa có mã' }}</span>
                  <PartnerCommissionContractStatusBadge :status="item.status" />
                  <PartnerCommissionContractModeBadge :mode="item.commission_mode" />
                </div>
                <p class="text-xs text-slate-500">
                  Hiệu lực: {{ item.starts_at ? formatDate(item.starts_at) : '—' }}
                  → {{ item.ends_at ? formatDate(item.ends_at) : 'Không thời hạn' }}
                </p>
              </div>
              <UIcon
                name="i-lucide-chevron-right"
                class="text-slate-400 mt-1 shrink-0"
              />
            </button>
          </div>
        </SharedSectionCard>

        <!-- Pending contracts -->
        <SharedSectionCard
          v-if="pendingContracts.length > 0"
          :title="`Hợp đồng chờ kích hoạt (${pendingContracts.length})`"
        >
          <div class="space-y-3">
            <button
              v-for="item in pendingContracts"
              :key="item.id"
              type="button"
              class="w-full text-left border border-amber-200 bg-amber-50/50 rounded-lg p-4 flex flex-wrap items-start justify-between gap-3 hover:border-amber-300 transition"
              @click="openDetail(item.id)"
            >
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2 flex-wrap mb-1">
                  <span class="font-mono font-semibold text-slate-900">{{ item.contract_code }}</span>
                  <PartnerCommissionContractStatusBadge :status="item.status" />
                  <PartnerCommissionContractModeBadge :mode="item.commission_mode" />
                </div>
                <p class="text-xs text-slate-500">
                  Hiệu lực: {{ item.starts_at ? formatDate(item.starts_at) : '—' }}
                  → {{ item.ends_at ? formatDate(item.ends_at) : 'Không thời hạn' }}
                </p>
              </div>
              <UIcon
                name="i-lucide-chevron-right"
                class="text-slate-400 mt-1 shrink-0"
              />
            </button>
          </div>
        </SharedSectionCard>

        <!-- History -->
        <SharedSectionCard
          v-if="historyContracts.length > 0"
          title="Lịch sử hợp đồng"
          compact
        >
          <template #header-actions>
            <UButton
              :icon="showHistory ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
              :label="showHistory ? 'Thu gọn' : `Xem ${historyContracts.length} mục`"
              color="neutral"
              variant="ghost"
              size="xs"
              @click="showHistory = !showHistory"
            />
          </template>

          <div
            v-if="showHistory"
            class="space-y-1"
          >
            <button
              v-for="item in historyContracts"
              :key="item.id"
              type="button"
              class="w-full flex items-center justify-between gap-3 py-2 px-1 border-b border-slate-100 last:border-0 text-sm hover:bg-slate-50 rounded transition text-left"
              @click="openDetail(item.id)"
            >
              <div class="flex items-center gap-2 min-w-0 flex-1">
                <span class="font-mono font-medium text-slate-700">{{ item.contract_code }}</span>
                <PartnerCommissionContractStatusBadge :status="item.status" />
                <PartnerCommissionContractModeBadge :mode="item.commission_mode" />
              </div>
              <span class="text-xs text-slate-500 shrink-0">
                {{ item.activated_at ? formatDate(item.activated_at) : (item.signed_at ? formatDate(item.signed_at) : '—') }}
              </span>
            </button>
          </div>
        </SharedSectionCard>
      </div>
    </div>

    <!-- Detail drawer (full lifecycle) -->
    <PartnerCommissionContractDetailDrawer
      v-model:open="detailDrawerOpen"
      :contract-id="selectedContractId"
      @changed="reloadAll"
      @edit="openEdit"
    />

    <!-- Form drawer (create + edit draft) -->
    <PartnerCommissionContractFormDrawer
      v-if="selectedProjectId"
      v-model:open="formDrawerOpen"
      :partner-id="props.partnerId"
      :project-id="selectedProjectId"
      :contract="editContract"
      @saved="reloadAll"
    />
  </div>
</template>
