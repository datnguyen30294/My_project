<script setup lang="ts">
import type { TableColumn, StepperItem } from '@nuxt/ui'
import type {
  OrderDetailResource,
  OrderLineResource,
  QuoteDetailResource,
  CommissionConfigShowConfig200
} from '#api/generated/laravel'
import type {
  CommissionConfigDetailResourcePartyRulesItem,
  CommissionConfigDetailResourceDeptRulesItem,
  CommissionConfigDetailResourceDeptRulesItemStaffRulesItem
} from '~/composables/api/useCommissionConfig'
import type { CommissionDistributeInput } from '~/composables/useCommissionMindmap'

definePageMeta({ layout: 'default' })

const route = useRoute()
const id = computed(() => Number(route.params.id))
const toast = useToast()

const { data, status, error, refresh } = useOrderDetail(id)
const order = computed<OrderDetailResource | undefined>(() => data.value?.data)

const { useDynamicLabel } = useBreadcrumb()
useDynamicLabel(computed(() => order.value?.code ?? null))

useSeoMeta({
  title: computed(() =>
    order.value ? `${order.value.code} - Đơn hàng` : 'Chi tiết đơn hàng'
  )
})

// ─── Computed flags ───
const isDraft = computed(() => order.value?.status.value === 'draft')
const isActionable = computed(() => {
  const s = order.value?.status.value
  return s === 'draft' || s === 'confirmed' || s === 'in_progress'
})
const statusAlert = computed(() =>
  order.value ? ORDER_STATUS_ALERT[order.value.status.value] : null
)

// ─── Workflow stepper ───
const isCancelled = computed(() => order.value?.status.value === 'cancelled')

const workflowSteps = computed<StepperItem[]>(() =>
  ORDER_WORKFLOW_STEPS.map(step => ({
    title: step.title,
    description: step.description,
    icon: isCancelled.value && step.value === currentStepBeforeCancel.value
      ? 'i-lucide-x-circle'
      : step.icon,
    value: step.value
  }))
)

const currentStepBeforeCancel = computed(() => {
  if (!isCancelled.value) return null
  return 'draft'
})

const currentStepValue = computed(() => {
  if (!order.value) return 'draft'
  if (isCancelled.value) return currentStepBeforeCancel.value ?? 'draft'
  return order.value.status.value
})

// ─── Quote versions ───
const ogTicketId = computed(() => order.value?.og_ticket?.id ?? null)
const { data: versionsData } = useQuoteVersions(ogTicketId)
const quoteVersions = computed<QuoteDetailResource[]>(() => versionsData.value?.data ?? [])

const isCompleted = computed(() => order.value?.status.value === 'completed')
const showNewQuoteConfirm = ref(false)

function confirmNewQuote() {
  showNewQuoteConfirm.value = false
  navigateTo(`/pmc/quotes/create?og_ticket_id=${ogTicketId.value}`)
}

// ─── Note editing (inline) ───
const isEditingNote = ref(false)
const editNote = ref('')
const isSavingNote = ref(false)

function startEditNote() {
  editNote.value = order.value?.note ?? ''
  isEditingNote.value = true
}

function cancelEditNote() {
  isEditingNote.value = false
}

async function saveNote() {
  isSavingNote.value = true
  try {
    await apiUpdateOrder(id.value, { note: editNote.value || null })
    toast.add({ title: 'Đã lưu ghi chú', color: 'success' })
    clearOrderCache(id.value)
    await refresh()
    isEditingNote.value = false
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Lưu thất bại'), color: 'error' })
  } finally {
    isSavingNote.value = false
  }
}

// ─── Lines table ───
const lineColumns: TableColumn<OrderLineResource>[] = [
  { accessorKey: 'name', header: 'Hạng mục' },
  { id: 'line_type', header: 'Loại' },
  { accessorKey: 'quantity', header: 'SL' },
  { accessorKey: 'unit', header: 'ĐVT' },
  { id: 'purchase_price', header: 'Giá nhập' },
  { id: 'unit_price', header: 'Giá bán' },
  { id: 'line_amount', header: 'Thành tiền' },
  {
    id: 'advance_payer',
    header: 'Người ứng',
    meta: {
      class: {
        th: 'sticky right-10 z-20 bg-[var(--ui-bg-elevated)] w-44 min-w-44 max-w-44 shadow-[-6px_0_6px_-6px_rgba(0,0,0,0.08)]',
        td: 'sticky right-10 z-10 bg-white w-44 min-w-44 max-w-44 shadow-[-6px_0_6px_-6px_rgba(0,0,0,0.08)]'
      }
    }
  },
  {
    id: 'actions',
    header: '',
    meta: {
      class: {
        th: 'sticky right-0 z-20 bg-[var(--ui-bg-elevated)] w-10 min-w-10',
        td: 'sticky right-0 z-10 bg-white w-10 min-w-10'
      }
    }
  }
]

// ─── Advance payer selection ───
const advancePayerPopoverLineId = ref<number | null>(null)
const isSettingAdvancePayer = ref(false)
const debouncedAdvancePayerSearch = ref('')
const { searchInput: advancePayerSearch, onSearch: debounceAdvancePayerSearch } = useTableSearch((val) => {
  debouncedAdvancePayerSearch.value = val ?? ''
})
const { data: activeAccountsData, status: activeAccountsStatus, execute: fetchActiveAccounts } = useOrderActiveAccounts(debouncedAdvancePayerSearch)

const activeAccountOptions = computed(() =>
  (activeAccountsData.value?.data ?? []).map(a => ({
    label: a.employee_code ? `${a.name} (${a.employee_code})` : a.name,
    value: a.id
  }))
)

async function openAdvancePayerPopover(lineId: number) {
  advancePayerPopoverLineId.value = lineId
  advancePayerSearch.value = ''
  debouncedAdvancePayerSearch.value = ''
  await fetchActiveAccounts()
}

async function handleSetAdvancePayer(line: OrderLineResource, advancePayerId: number | null) {
  isSettingAdvancePayer.value = true
  try {
    await apiSetOrderLineAdvancePayer(id.value, line.id, advancePayerId)
    toast.add({ title: 'Đã cập nhật người ứng tiền', color: 'success' })
    clearOrderCache(id.value)
    await refresh()
    advancePayerPopoverLineId.value = null
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Cập nhật thất bại'), color: 'error' })
  } finally {
    isSettingAdvancePayer.value = false
  }
}

// ─── Edit line prices (giá nhập + giá bán) ───
const showPricesModal = ref(false)
const pricesTargetLine = ref<OrderLineResource | null>(null)
const isSavingPrices = ref(false)
const pricesApiErrors = ref<Record<string, string[]>>({})

function openPricesModal(line: OrderLineResource) {
  pricesTargetLine.value = line
  pricesApiErrors.value = {}
  showPricesModal.value = true
}

async function handleSavePrices(data: { unit_price: number, purchase_price: number | null }) {
  if (!pricesTargetLine.value) return
  isSavingPrices.value = true
  pricesApiErrors.value = {}
  try {
    await apiUpdateOrderLinePrices(id.value, pricesTargetLine.value.id, data)
    toast.add({ title: 'Đã cập nhật giá', color: 'success' })
    clearOrderCache(id.value)
    await refresh()
    showPricesModal.value = false
  } catch (err) {
    const errors = getApiValidationErrors(err)
    if (errors) {
      pricesApiErrors.value = errors
    } else {
      toast.add({ title: getApiErrorMessage(err, 'Cập nhật giá thất bại'), color: 'error' })
    }
  } finally {
    isSavingPrices.value = false
  }
}

// ─── Transitions ───
const {
  isTransitioning,
  handleTransition
} = useOrderTransition(id, { onSuccess: () => refresh() })

// ─── Cancel confirm ───
const showCancelConfirm = ref(false)

// ─── Acceptance report modal ───
const showAcceptanceReport = ref(false)

function confirmCancel() {
  showCancelConfirm.value = false
  handleTransition('cancelled')
}

// ─── Delete (with check) ───
const crud = useCrudModals<OrderDetailResource>()
const { showDeleteModal: showDeleteConfirm } = crud
const { isDeleting, submitDelete } = useCrudSubmit(crud, async () => {
  await refresh()
})

const {
  isCheckingDelete, deleteBlockedMessage,
  openDeleteModal: _openDeleteModal, handleDelete: confirmDelete
} = useCheckDelete({
  crud,
  submitDelete,
  checkFn: apiCheckDeleteOrder,
  deleteFn: apiDeleteOrder,
  successMessage: 'Đã xoá đơn hàng',
  navigateAfter: '/pmc/orders'
})

function openDeleteConfirm() {
  if (order.value) _openDeleteModal(order.value)
}

// ─── Commission preview ───
const orderProjectId = computed(() => order.value?.og_ticket?.project_id ?? null)

const { data: commConfigData } = useApiFetch<CommissionConfigShowConfig200>(
  computed(() => orderProjectId.value
    ? `/pmc/commission/projects/${orderProjectId.value}`
    : (false as unknown as string)
  ),
  { watch: [orderProjectId] }
)

const commissionConfig = computed(() => commConfigData.value?.data)

const commissionInput = computed<CommissionDistributeInput | null>(() => {
  const config = commissionConfig.value
  if (!config || !orderProjectId.value) return null

  const total = commissionableTotal.value
  if (total <= 0) return null

  return {
    total,
    platform: {
      percent: config.platform?.percent ?? 5,
      valueFixed: config.platform?.value_fixed ?? 1000
    },
    partyRules: (config.party_rules ?? []).map((rule: CommissionConfigDetailResourcePartyRulesItem) => ({
      id: rule.party_type.value,
      name: rule.party_type.label,
      valueType: rule.value_type.value,
      percent: rule.percent ? parseFloat(rule.percent) : null,
      valueFixed: rule.value_fixed ? parseFloat(rule.value_fixed) : null
    })),
    deptRules: (config.dept_rules ?? []).map((rule: CommissionConfigDetailResourceDeptRulesItem) => ({
      id: rule.department.id,
      name: rule.department.name,
      sortOrder: rule.sort_order,
      valueType: rule.value_type.value,
      percent: rule.percent ? parseFloat(rule.percent) : null,
      valueFixed: rule.value_fixed ? parseFloat(rule.value_fixed) : null,
      staff: rule.staff_rules.map((s: CommissionConfigDetailResourceDeptRulesItemStaffRulesItem) => ({
        id: s.account.id,
        name: s.account.name,
        sortOrder: s.sort_order,
        valueType: s.value_type.value,
        percent: s.percent ? parseFloat(s.percent) : null,
        valueFixed: s.value_fixed ? parseFloat(s.value_fixed) : null
      }))
    }))
  }
})

const {
  mindmap: commissionMindmap,
  tableRows: commissionTableRows,
  diagramKey: commissionDiagramKey,
  errors: commissionErrors,
  isValid: isCommissionConfigValid
} = useCommissionMindmap(commissionInput)

// ─── Frozen snapshot (when order is in a closing period) ───
const isFinanciallyLocked = computed(() => order.value?.is_financially_locked === true)

const { data: snapshotData } = useOrderCommissionSnapshots(id)
const snapshots = computed(() => snapshotData.value?.data ?? [])

/**
 * Group snapshots by period and filter to terminal recipients only
 * (Management / Department are intermediary buckets, don't show as paid rows).
 */
const snapshotTerminalRows = computed(() =>
  snapshots.value.filter(s => !['management', 'department'].includes(s.recipient_type.value))
)

const snapshotTotal = computed(() =>
  snapshotTerminalRows.value.reduce((sum, s) => sum + parseFloat(s.amount ?? '0'), 0)
)

// ─── Commission override ───
const canOverride = computed(() => {
  const s = order.value?.status.value
  const isAdjuster = (order.value as any)?.is_adjuster === true
  const isLocked = (order.value as any)?.is_financially_locked === true
  return isAdjuster && !isLocked && (s === 'confirmed' || s === 'in_progress' || s === 'accepted' || s === 'completed')
})

const hasOverrides = computed(() => (order.value as any)?.has_commission_overrides === true)
const commissionableTotal = computed(() => parseFloat((order.value as any)?.commissionable_total ?? '0'))

const { data: overrideData, refresh: refreshOverrides } = useCommissionOverride(id)
const showOverrideModal = ref(false)

const overrideItems = computed(() => overrideData.value?.data?.overrides ?? [])
const platformAmountFromApi = computed(() => parseFloat(overrideData.value?.data?.platform_amount ?? '0'))

async function handleOverrideSaved() {
  showOverrideModal.value = false
  await Promise.all([refresh(), refreshOverrides()])
}

async function handleDeleteOverride() {
  try {
    await apiDeleteCommissionOverride(id.value)
    toast.add({ title: 'Đã xoá điều chỉnh hoa hồng', color: 'success' })
    await Promise.all([refresh(), refreshOverrides()])
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Xoá thất bại'), color: 'error' })
  }
}
</script>

<template>
  <div class="pb-20 lg:pb-0">
    <!-- ═══ HEADER ═══ -->
    <div class="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
      <div class="flex items-center gap-3 sm:gap-4 min-w-0">
        <UButton
          icon="i-lucide-arrow-left"
          color="neutral"
          variant="ghost"
          to="/pmc/orders"
          class="shrink-0"
        />
        <div class="min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <h1 class="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
              Chi tiết đơn hàng
            </h1>
            <UBadge
              v-if="order"
              :label="order.status.label"
              :color="orderStatusColor(order.status.value)"
              variant="subtle"
              size="sm"
            />
          </div>
          <p class="text-slate-500 text-sm mt-0.5">
            <span
              v-if="order"
              class="font-mono font-semibold"
            >{{ order.code }}</span>
            <span v-else>...</span>
          </p>
        </div>
      </div>

      <!-- Desktop actions -->
      <div
        v-if="order && isDraft"
        class="hidden sm:flex items-center gap-2 shrink-0"
      >
        <UButton
          icon="i-lucide-trash-2"
          label="Xoá"
          color="error"
          variant="outline"
          size="sm"
          @click="openDeleteConfirm()"
        />
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="status === 'pending'"
      class="flex flex-col gap-4"
    >
      <div
        v-for="i in 4"
        :key="i"
        class="h-24 bg-slate-100 rounded-xl animate-pulse"
      />
    </div>

    <!-- Error -->
    <SharedCrudPageError
      v-else-if="error"
      :error="error"
      :retry="refresh"
    />

    <!-- ═══ CONTENT ═══ -->
    <div
      v-else-if="order"
      class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6"
    >
      <!-- LEFT: Main content -->
      <div class="lg:col-span-2 flex flex-col gap-4 sm:gap-6">
        <!-- Status Alert -->
        <UAlert
          v-if="statusAlert"
          :icon="statusAlert.icon"
          :color="statusAlert.color"
          variant="subtle"
          :title="statusAlert.title"
        />

        <!-- Giai đoạn đơn hàng (Stepper) -->
        <SharedSectionCard title="Giai đoạn đơn hàng">
          <div class="overflow-x-auto -mx-1 px-1">
            <UStepper
              :items="workflowSteps"
              :model-value="currentStepValue"
              disabled
              :linear="false"
              size="sm"
              :color="isCancelled ? 'error' : 'primary'"
              :ui="isCancelled ? {
                trigger: 'group-data-[state=completed]:bg-primary group-data-[state=completed]:text-inverted',
                separator: 'group-data-[state=completed]:bg-primary'
              } : undefined"
              class="w-full min-w-[400px]"
            />
          </div>
        </SharedSectionCard>

        <!-- Thông tin tổng quan -->
        <SharedSectionCard title="Thông tin tổng quan">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <SharedFieldDisplay label="Mã đơn">
              <span class="font-mono font-semibold">{{ order.code }}</span>
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Trạng thái">
              <UBadge
                :label="order.status.label"
                :color="orderStatusColor(order.status.value)"
                variant="subtle"
                size="sm"
              />
            </SharedFieldDisplay>
            <SharedFieldDisplay
              v-if="order.quote"
              label="Báo giá"
            >
              <div class="flex items-center gap-2">
                <NuxtLink
                  :to="`/pmc/quotes/${order.quote.id}`"
                  class="text-primary hover:underline font-mono text-sm font-medium"
                >
                  {{ order.quote.code }}
                </NuxtLink>
                <UBadge
                  :label="order.quote.status.label"
                  :color="quoteStatusColor(order.quote.status.value)"
                  variant="subtle"
                  size="xs"
                />
              </div>
            </SharedFieldDisplay>
            <SharedFieldDisplay
              v-if="order.og_ticket"
              label="Ticket"
            >
              <NuxtLink
                :to="`/pmc/og-tickets/${order.og_ticket.id}`"
                class="text-primary hover:underline font-medium"
              >
                {{ order.og_ticket.subject }}
              </NuxtLink>
            </SharedFieldDisplay>
            <SharedFieldDisplay
              v-if="order.og_ticket"
              label="Người yêu cầu"
            >
              {{ order.og_ticket.requester_name }}
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Tổng tiền">
              <span class="font-bold text-slate-900">{{ formatCurrency(order.total_amount) }}</span>
            </SharedFieldDisplay>
          </div>
        </SharedSectionCard>

        <!-- Ghi chú -->
        <SharedSectionCard title="Ghi chú">
          <template #header-actions>
            <UButton
              v-if="!isEditingNote"
              icon="i-lucide-pencil"
              label="Sửa"
              size="sm"
              color="neutral"
              variant="ghost"
              @click="startEditNote"
            />
          </template>

          <!-- View mode -->
          <template v-if="!isEditingNote">
            <p
              v-if="order.note"
              class="whitespace-pre-line text-sm text-slate-700"
            >
              {{ order.note }}
            </p>
            <p
              v-else
              class="text-sm text-slate-400 italic"
            >
              Chưa có ghi chú.
            </p>
          </template>

          <!-- Edit mode -->
          <template v-else>
            <UTextarea
              v-model="editNote"
              placeholder="Nhập ghi chú..."
              :rows="3"
              class="w-full"
            />
            <div class="flex justify-end gap-2 mt-3">
              <UButton
                label="Hủy"
                color="neutral"
                variant="ghost"
                size="sm"
                :disabled="isSavingNote"
                @click="cancelEditNote"
              />
              <UButton
                label="Lưu"
                icon="i-lucide-save"
                color="primary"
                size="sm"
                :loading="isSavingNote"
                @click="saveNote"
              />
            </div>
          </template>
        </SharedSectionCard>

        <!-- Dòng đơn hàng -->
        <SharedSectionCard title="Dòng đơn hàng">
          <!-- Mobile: card list -->
          <div class="sm:hidden flex flex-col gap-3">
            <div
              v-for="line in order.lines"
              :key="line.id"
              class="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <div class="flex items-start justify-between gap-2 mb-1.5">
                <span class="text-sm font-medium text-slate-900">{{ line.name }}</span>
                <UBadge
                  :label="line.line_type.label"
                  color="neutral"
                  variant="subtle"
                  size="xs"
                  class="shrink-0"
                />
              </div>
              <div class="flex items-center justify-between text-xs text-slate-500">
                <span>{{ line.quantity }} {{ line.unit }} × {{ formatCurrency(line.unit_price) }}</span>
                <span class="font-semibold text-slate-900">{{ formatCurrency(line.line_amount) }}</span>
              </div>
            </div>
          </div>

          <!-- Desktop: table -->
          <div class="hidden sm:block">
            <UTable
              :data="order.lines"
              :columns="lineColumns"
            >
              <template #line_type-cell="{ row }">
                <UBadge
                  :label="row.original.line_type.label"
                  color="neutral"
                  variant="subtle"
                  size="sm"
                />
              </template>
              <template #unit_price-cell="{ row }">
                {{ formatCurrency(row.original.unit_price) }}
              </template>
              <template #purchase_price-cell="{ row }">
                <span
                  v-if="row.original.purchase_price"
                  class="text-slate-600"
                >
                  {{ formatCurrency(row.original.purchase_price) }}
                </span>
                <span
                  v-else
                  class="text-slate-300"
                >—</span>
              </template>
              <template #line_amount-cell="{ row }">
                <span class="font-medium">{{ formatCurrency(row.original.line_amount) }}</span>
              </template>
              <template #advance_payer-cell="{ row }">
                <div
                  v-if="row.original.line_type.value !== 'material'"
                  class="text-xs text-slate-300"
                >
                  —
                </div>
                <UPopover
                  v-else
                  :open="advancePayerPopoverLineId === row.original.id"
                  @update:open="(v: boolean) => { if (v) openAdvancePayerPopover(row.original.id); else advancePayerPopoverLineId = null }"
                >
                  <div class="flex items-center gap-2 cursor-pointer hover:bg-slate-50 rounded px-2 py-1 -mx-2 -my-1">
                    <template v-if="row.original.advance_payer">
                      <div class="flex flex-col min-w-0">
                        <span class="text-sm font-medium text-slate-700 truncate">
                          {{ row.original.advance_payer.name }}
                        </span>
                        <UBadge
                          :label="ADVANCE_STATUS_LABELS[row.original.advance_status as OrderAdvanceStatus]"
                          :color="advanceStatusColor(row.original.advance_status)"
                          variant="subtle"
                          size="xs"
                          class="self-start mt-0.5"
                        />
                      </div>
                    </template>
                    <span
                      v-else
                      class="text-xs text-slate-400 italic"
                    >
                      + Gán người ứng
                    </span>
                  </div>
                  <template #content>
                    <div class="p-3 w-72 flex flex-col gap-3">
                      <p class="text-xs font-semibold text-slate-700">
                        Chọn người ứng tiền
                      </p>
                      <USelectMenu
                        v-model:search-term="advancePayerSearch"
                        :model-value="row.original.advance_payer?.id ?? undefined"
                        :items="activeAccountOptions"
                        value-key="value"
                        placeholder="Tìm và chọn nhân sự..."
                        searchable
                        ignore-filter
                        :loading="activeAccountsStatus === 'pending'"
                        class="w-full"
                        @update:model-value="(v: number) => handleSetAdvancePayer(row.original, v)"
                        @update:search-term="debounceAdvancePayerSearch"
                      />
                      <UButton
                        v-if="row.original.advance_payer"
                        label="Xoá gán"
                        icon="i-lucide-trash-2"
                        color="error"
                        variant="ghost"
                        size="xs"
                        :loading="isSettingAdvancePayer"
                        @click="handleSetAdvancePayer(row.original, null)"
                      />
                      <p
                        v-if="!activeAccountOptions.length"
                        class="text-xs text-slate-400"
                      >
                        Chưa có nhân sự khả dụng.
                      </p>
                    </div>
                  </template>
                </UPopover>
              </template>

              <template #actions-cell="{ row }">
                <UButton
                  icon="i-lucide-pencil"
                  size="xs"
                  variant="ghost"
                  color="neutral"
                  title="Sửa giá nhập / giá bán"
                  @click="openPricesModal(row.original)"
                />
              </template>
            </UTable>
          </div>
        </SharedSectionCard>

        <!-- Tổng kết -->
        <SharedSectionCard title="Tổng kết">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-slate-600">Tổng tiền</span>
            <span class="text-lg font-bold text-slate-900">
              {{ formatCurrency(order.total_amount) }}
            </span>
          </div>
        </SharedSectionCard>

        <!-- Chia hoa hồng -->
        <SharedSectionCard
          v-if="isFinanciallyLocked || commissionMindmap.length > 0 || hasOverrides || !isCommissionConfigValid"
          title="Chia hoa hồng"
        >
          <template #header-actions>
            <div class="flex items-center gap-2">
              <UBadge
                v-if="isFinanciallyLocked"
                label="Đã chốt kỳ"
                color="neutral"
                variant="subtle"
                size="sm"
              />
              <UBadge
                v-if="!isFinanciallyLocked && hasOverrides"
                label="Đã điều chỉnh"
                color="warning"
                variant="subtle"
                size="sm"
              />
              <UButton
                v-if="canOverride"
                :icon="hasOverrides ? 'i-lucide-pencil' : 'i-lucide-sliders-horizontal'"
                :label="hasOverrides ? 'Sửa' : 'Điều chỉnh'"
                size="sm"
                color="primary"
                variant="soft"
                @click="showOverrideModal = true"
              />
              <UButton
                v-if="canOverride && hasOverrides"
                icon="i-lucide-undo-2"
                label="Xoá điều chỉnh"
                size="sm"
                color="error"
                variant="ghost"
                @click="handleDeleteOverride"
              />
            </div>
          </template>

          <!-- Frozen snapshot view (order is in a closing period) -->
          <template v-if="isFinanciallyLocked">
            <div class="flex flex-col gap-2">
              <div
                v-for="snap in snapshotTerminalRows"
                :key="snap.id"
                class="flex items-center justify-between p-2 rounded-lg border border-slate-100"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <UBadge
                    :label="snap.recipient_type.label"
                    :color="snap.recipient_type.value === 'platform' ? 'neutral' : (snap.recipient_type.value === 'staff' ? 'primary' : 'info')"
                    variant="subtle"
                    size="xs"
                  />
                  <span class="text-sm text-slate-700 truncate">{{ snap.recipient_name }}</span>
                </div>
                <span class="text-sm font-bold text-slate-900">{{ formatCurrency(parseFloat(snap.amount)) }}</span>
              </div>
              <div
                v-if="snapshotTerminalRows.length === 0"
                class="text-sm text-slate-500 italic p-2"
              >
                Đơn hàng đã chốt kỳ nhưng chưa có dòng hoa hồng nào được ghi nhận.
              </div>
              <div
                v-if="snapshotTerminalRows.length > 0"
                class="flex items-center justify-between p-2 bg-emerald-50 rounded-lg border border-emerald-200"
              >
                <span class="text-sm font-semibold text-emerald-700">Tổng cộng</span>
                <span class="text-sm font-bold text-emerald-700">{{ formatCurrency(snapshotTotal) }}</span>
              </div>
            </div>
          </template>

          <!-- Invalid config view (not locked, sum of % > 100) -->
          <template v-else-if="!isCommissionConfigValid">
            <UAlert
              color="error"
              variant="subtle"
              icon="i-lucide-triangle-alert"
              title="Công thức chia hoa hồng không hợp lệ"
              description="Tổng phần trăm vượt quá 100% ở một hoặc nhiều cấp phân phối. Vui lòng điều chỉnh cấu hình trước khi xem sơ đồ."
            />
            <ul class="mt-3 text-sm text-red-700 list-disc pl-5 space-y-1">
              <li
                v-for="(err, idx) in commissionErrors"
                :key="idx"
              >
                <span class="font-medium">{{ err.scope }}:</span> tổng {{ err.sumPercent.toFixed(2) }}% (>100%)
              </li>
            </ul>
          </template>

          <!-- Override view -->
          <template v-else-if="hasOverrides && overrideItems.length > 0">
            <div class="flex flex-col gap-2">
              <!-- Platform -->
              <div class="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <span class="text-sm font-medium text-slate-600">Platform</span>
                <span class="text-sm font-bold text-slate-900">{{ formatCurrency(platformAmountFromApi) }}</span>
              </div>
              <!-- Override items -->
              <div
                v-for="item in overrideItems"
                :key="item.id"
                class="flex items-center justify-between p-2 rounded-lg border border-slate-100"
              >
                <div class="flex items-center gap-2">
                  <UBadge
                    :label="item.recipient_type.label"
                    :color="item.recipient_type.value === 'staff' ? 'primary' : 'neutral'"
                    variant="subtle"
                    size="xs"
                  />
                  <span class="text-sm text-slate-700">
                    {{ item.account?.name ?? item.recipient_type.label }}
                  </span>
                </div>
                <span class="text-sm font-bold text-slate-900">{{ formatCurrency(parseFloat(item.amount)) }}</span>
              </div>
              <!-- Total -->
              <div class="flex items-center justify-between p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                <span class="text-sm font-semibold text-emerald-700">Tổng cộng</span>
                <span class="text-sm font-bold text-emerald-700">{{ formatCurrency(commissionableTotal) }}</span>
              </div>
            </div>
          </template>

          <!-- Config preview (default) -->
          <template v-else>
            <ClientOnly>
              <CommissionPreviewDiagram
                :key="commissionDiagramKey"
                :data="commissionMindmap"
              />
              <template #fallback>
                <div
                  class="flex min-h-[300px] items-center justify-center rounded-lg border border-slate-200 bg-slate-50/30 py-12 text-slate-400 text-sm"
                >
                  Đang tải sơ đồ...
                </div>
              </template>
            </ClientOnly>

            <div class="mt-4">
              <CommissionBreakdownTable :rows="commissionTableRows" />
            </div>
          </template>
        </SharedSectionCard>

        <!-- Override Modal -->
        <CommissionOverrideModal
          v-if="showOverrideModal"
          :order-id="id"
          :commissionable-total="commissionableTotal"
          :platform-amount="platformAmountFromApi"
          :existing-overrides="overrideItems"
          @saved="handleOverrideSaved"
          @close="showOverrideModal = false"
        />

        <!-- Phiên bản báo giá -->
        <SharedSectionCard title="Phiên bản báo giá">
          <template #header-actions>
            <UButton
              v-if="!isCompleted"
              icon="i-lucide-plus"
              label="Tạo báo giá mới"
              size="sm"
              color="primary"
              variant="soft"
              @click="showNewQuoteConfirm = true"
            />
          </template>

          <div
            v-if="quoteVersions.length === 0"
            class="text-sm text-slate-400 italic"
          >
            Chưa có phiên bản báo giá.
          </div>

          <div
            v-else
            class="flex flex-col gap-3"
          >
            <div
              v-for="(ver, idx) in quoteVersions"
              :key="ver.id"
              class="rounded-lg border p-3 sm:p-4"
              :class="ver.is_active
                ? 'border-emerald-300 bg-emerald-50/50'
                : 'border-slate-200 bg-slate-50/50'"
            >
              <!-- Header -->
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2 mb-2">
                <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span
                    class="text-sm font-bold"
                    :class="ver.is_active ? 'text-emerald-700' : 'text-slate-500'"
                  >
                    #{{ idx + 1 }}
                  </span>
                  <NuxtLink
                    :to="`/pmc/quotes/${ver.id}`"
                    class="font-mono text-xs font-semibold hover:underline"
                    :class="ver.id === order.quote?.id ? 'text-primary' : 'text-slate-700'"
                  >
                    {{ ver.code }}
                  </NuxtLink>
                  <UBadge
                    v-if="ver.is_active"
                    label="Active"
                    color="success"
                    variant="subtle"
                    size="xs"
                  />
                  <UBadge
                    v-else
                    label="Inactive"
                    color="neutral"
                    variant="subtle"
                    size="xs"
                  />
                  <UBadge
                    :label="ver.status.label"
                    :color="quoteStatusColor(ver.status.value)"
                    variant="subtle"
                    size="xs"
                  />
                </div>
                <span class="text-xs text-slate-400">
                  {{ formatDateTime(ver.created_at) }}
                </span>
              </div>

              <!-- Lines -->
              <div class="flex flex-col gap-1">
                <div
                  v-for="line in ver.lines"
                  :key="line.id"
                  class="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs gap-0.5 sm:gap-0"
                >
                  <span class="text-slate-700">{{ line.name }}</span>
                  <span class="text-slate-500">
                    {{ line.quantity }} {{ line.unit }} × {{ formatCurrency(line.unit_price) }}
                    = <span class="font-medium text-slate-700">{{ formatCurrency(line.line_amount) }}</span>
                  </span>
                </div>
              </div>

              <!-- Total -->
              <div
                class="flex items-center justify-between mt-2 pt-2 border-t"
                :class="ver.is_active ? 'border-emerald-200' : 'border-slate-200'"
              >
                <span class="text-xs font-medium text-slate-600">Tổng tiền</span>
                <span
                  class="text-sm font-bold"
                  :class="ver.is_active ? 'text-emerald-700' : 'text-slate-700'"
                >
                  {{ formatCurrency(ver.total_amount) }}
                </span>
              </div>
            </div>
          </div>
        </SharedSectionCard>
      </div>

      <!-- ═══ RIGHT SIDEBAR ═══ -->
      <div class="flex flex-col gap-4">
        <!-- Biên bản nghiệm thu -->
        <SharedSectionCard
          title="Biên bản nghiệm thu"
          compact
          class="hidden lg:block"
        >
          <UButton
            label="Lập biên bản nghiệm thu"
            icon="i-lucide-clipboard-check"
            color="primary"
            variant="soft"
            class="w-full"
            @click="showAcceptanceReport = true"
          />
        </SharedSectionCard>

        <!-- Hành động -->
        <SharedSectionCard
          title="Hành động"
          compact
          class="hidden lg:block"
        >
          <!-- draft → confirmed / cancelled -->
          <div
            v-if="order.status.value === 'draft'"
            class="flex flex-col gap-2"
          >
            <UButton
              label="Xác nhận đơn"
              icon="i-lucide-check-circle"
              color="primary"
              class="w-full"
              :loading="isTransitioning"
              @click="handleTransition('confirmed')"
            />
            <UButton
              label="Hủy đơn"
              icon="i-lucide-x-circle"
              color="error"
              variant="outline"
              class="w-full"
              :loading="isTransitioning"
              @click="showCancelConfirm = true"
            />
          </div>

          <!-- confirmed → in_progress / cancelled -->
          <div
            v-else-if="order.status.value === 'confirmed'"
            class="flex flex-col gap-2"
          >
            <UButton
              label="Bắt đầu thực hiện"
              icon="i-lucide-play"
              color="primary"
              class="w-full"
              :loading="isTransitioning"
              @click="handleTransition('in_progress')"
            />
            <UButton
              label="Hủy đơn"
              icon="i-lucide-x-circle"
              color="error"
              variant="outline"
              class="w-full"
              :loading="isTransitioning"
              @click="showCancelConfirm = true"
            />
          </div>

          <!-- in_progress → accepted / cancelled -->
          <div
            v-else-if="order.status.value === 'in_progress'"
            class="flex flex-col gap-2"
          >
            <UButton
              label="Nghiệm thu"
              icon="i-lucide-clipboard-check"
              color="primary"
              class="w-full"
              :loading="isTransitioning"
              @click="handleTransition('accepted')"
            />
            <UButton
              label="Hủy đơn"
              icon="i-lucide-x-circle"
              color="error"
              variant="outline"
              class="w-full"
              :loading="isTransitioning"
              @click="showCancelConfirm = true"
            />
          </div>

          <!-- accepted → completed / cancelled -->
          <div
            v-else-if="order.status.value === 'accepted'"
            class="flex flex-col gap-2"
          >
            <UButton
              label="Hoàn thành"
              icon="i-lucide-circle-check-big"
              color="primary"
              class="w-full"
              :loading="isTransitioning"
              @click="handleTransition('completed')"
            />
            <UButton
              label="Hủy đơn"
              icon="i-lucide-x-circle"
              color="error"
              variant="outline"
              class="w-full"
              :loading="isTransitioning"
              @click="showCancelConfirm = true"
            />
          </div>

          <!-- completed / cancelled → no actions -->
          <p
            v-else
            class="text-sm text-slate-400 italic"
          >
            Không có hành động khả dụng.
          </p>
        </SharedSectionCard>

        <!-- Metadata -->
        <SharedSectionCard
          title="Thông tin"
          compact
        >
          <div class="flex flex-col gap-3">
            <SharedFieldDisplay label="Trạng thái">
              <UBadge
                :label="order.status.label"
                :color="orderStatusColor(order.status.value)"
                variant="subtle"
                size="sm"
              />
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Số dòng">
              {{ order.lines.length }}
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Tạo lúc">
              {{ formatDateTime(order.created_at) }}
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Cập nhật lúc">
              {{ formatDateTime(order.updated_at) }}
            </SharedFieldDisplay>
          </div>
        </SharedSectionCard>
      </div>
    </div>

    <!-- ═══ MOBILE STICKY ACTION BAR ═══ -->
    <div
      v-if="order && isActionable"
      class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 px-4 py-3 lg:hidden z-50"
    >
      <!-- draft -->
      <div
        v-if="order.status.value === 'draft'"
        class="flex items-center gap-2"
      >
        <UButton
          label="Xác nhận đơn"
          icon="i-lucide-check-circle"
          color="primary"
          class="flex-1"
          :loading="isTransitioning"
          @click="handleTransition('confirmed')"
        />
        <UButton
          icon="i-lucide-x-circle"
          color="error"
          variant="outline"
          @click="showCancelConfirm = true"
        />
        <UButton
          icon="i-lucide-trash-2"
          color="error"
          variant="outline"
          @click="openDeleteConfirm()"
        />
      </div>

      <!-- confirmed -->
      <div
        v-else-if="order.status.value === 'confirmed'"
        class="flex items-center gap-2"
      >
        <UButton
          label="Bắt đầu thực hiện"
          icon="i-lucide-play"
          color="primary"
          class="flex-1"
          :loading="isTransitioning"
          @click="handleTransition('in_progress')"
        />
        <UButton
          icon="i-lucide-x-circle"
          color="error"
          variant="outline"
          @click="showCancelConfirm = true"
        />
      </div>

      <!-- in_progress -->
      <div
        v-else-if="order.status.value === 'in_progress'"
        class="flex items-center gap-2"
      >
        <UButton
          label="Nghiệm thu"
          icon="i-lucide-clipboard-check"
          color="primary"
          class="flex-1"
          :loading="isTransitioning"
          @click="handleTransition('accepted')"
        />
        <UButton
          icon="i-lucide-x-circle"
          color="error"
          variant="outline"
          @click="showCancelConfirm = true"
        />
      </div>

      <!-- accepted -->
      <div
        v-else-if="order.status.value === 'accepted'"
        class="flex items-center gap-2"
      >
        <UButton
          label="Hoàn thành"
          icon="i-lucide-circle-check-big"
          color="primary"
          class="flex-1"
          :loading="isTransitioning"
          @click="handleTransition('completed')"
        />
        <UButton
          icon="i-lucide-x-circle"
          color="error"
          variant="outline"
          @click="showCancelConfirm = true"
        />
      </div>
    </div>

    <!-- ═══ DIALOGS ═══ -->

    <!-- Acceptance report -->
    <SharedOrderAcceptanceReportModal
      v-if="order"
      v-model:open="showAcceptanceReport"
      :order-id="id"
    />

    <!-- Cancel confirm -->
    <UModal
      v-model:open="showCancelConfirm"
      title="Xác nhận hủy đơn hàng"
    >
      <template #body>
        <p class="text-slate-700">
          Hành động này không thể hoàn tác. Tiếp tục?
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton
            label="Quay lại"
            color="neutral"
            variant="ghost"
            @click="showCancelConfirm = false"
          />
          <UButton
            label="Xác nhận"
            color="error"
            :loading="isTransitioning"
            @click="confirmCancel"
          />
        </div>
      </template>
    </UModal>

    <!-- Delete confirm -->
    <SharedCrudDeleteModal
      v-model:open="showDeleteConfirm"
      title="Xoá đơn hàng"
      :item-name="order?.code"
      description="Đơn hàng sẽ bị xoá vĩnh viễn."
      :checking="isCheckingDelete"
      :blocked-message="deleteBlockedMessage"
      :loading="isDeleting"
      @confirm="confirmDelete"
    />
    <!-- New quote confirm -->
    <UModal
      v-model:open="showNewQuoteConfirm"
      title="Tạo báo giá mới"
    >
      <template #body>
        <p class="text-slate-700">
          Tạo báo giá mới sẽ thay thế báo giá hiện tại và đơn hàng sẽ được cập nhật theo báo giá mới.
          Đơn hàng sẽ quay về trạng thái <strong>Nháp</strong>. Tiếp tục?
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton
            label="Hủy"
            color="neutral"
            variant="ghost"
            @click="showNewQuoteConfirm = false"
          />
          <UButton
            label="Tiếp tục tạo"
            color="primary"
            icon="i-lucide-arrow-right"
            @click="confirmNewQuote"
          />
        </div>
      </template>
    </UModal>

    <!-- Edit line prices modal -->
    <OrderLinePricesModal
      v-model:open="showPricesModal"
      :line="pricesTargetLine"
      :loading="isSavingPrices"
      :api-errors="pricesApiErrors"
      @submit="handleSavePrices"
    />
  </div>
</template>
