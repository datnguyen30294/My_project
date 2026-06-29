<script setup lang="ts">
import type { OgTicketDetail, OgTicketAudit, OgTicketLifecycleSegment, OgTicketWarrantyRequest } from '~/composables/api/useOgTickets'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import 'leaflet/dist/leaflet.css'

definePageMeta({ layout: 'default' })

const route = useRoute()
const id = computed(() => Number(route.params.id))

const { data, status, error, refresh } = useOgTicketDetail(id)
const ogTicket = computed<OgTicketDetail | undefined>(() => data.value?.data)

// ─── Resident share URL (tenant-aware, derived from current request origin) ───
const requestURL = useRequestURL()
const ticketCode = computed(() => ogTicket.value?.ticket?.code ?? '')
const residentTicketPath = computed(() =>
  ticketCode.value ? `/tickets/${ticketCode.value}` : ''
)
const absoluteResidentUrl = computed(() =>
  ticketCode.value ? `${requestURL.origin}${residentTicketPath.value}` : ''
)

const qrCodeRef = ref<{ downloadPng: () => void } | null>(null)

async function copyResidentUrl() {
  if (!absoluteResidentUrl.value) return
  try {
    await navigator.clipboard.writeText(absoluteResidentUrl.value)
    toast.add({ title: 'Đã sao chép link', color: 'success' })
  } catch {
    toast.add({ title: 'Không thể sao chép link', color: 'error' })
  }
}

function downloadResidentQr() {
  qrCodeRef.value?.downloadPng()
}

// ─── Quote versions ───
const { data: versionsData } = useQuoteVersions(id)
const EFFECTIVE_STATUSES = ['manager_approved', 'approved']
const activeQuote = computed(() => {
  const quotes = versionsData.value?.data ?? []
  // Prefer the effective (manager_approved/approved) active quote over a draft replacement
  return quotes.find(q => q.is_active && EFFECTIVE_STATUSES.includes(q.status.value))
    ?? quotes.find(q => q.is_active)
    ?? null
})
const draftReplacement = computed(() => {
  if (!activeQuote.value) return null
  const quotes = versionsData.value?.data ?? []
  return quotes.find(q => q.is_active && q.id !== activeQuote.value!.id) ?? null
})

// ─── Audit history ───
const { data: auditsData } = useOgTicketAudits(id)
const audits = computed<OgTicketAudit[]>(() => auditsData.value?.data ?? [])

// ─── Refresh helpers ───
const stepperKey = ref(0)

async function refreshAll() {
  const [, freshVersions] = await Promise.all([
    refresh(),
    apiGetQuoteVersions(id.value)
  ])
  versionsData.value = freshVersions
  stepperKey.value++
}

const OG_TICKET_AUDIT_FIELD_LABELS: Record<string, string> = {
  subject: 'Tiêu đề',
  description: 'Mô tả',
  requester_name: 'Người gửi',
  requester_phone: 'Số điện thoại',
  apartment_name: 'Căn hộ',
  address: 'Địa chỉ',
  status: 'Trạng thái',
  priority: 'Ưu tiên',
  channel: 'Kênh tiếp nhận',
  internal_note: 'Ghi chú nội bộ',
  received_at: 'Thời gian nhận',
  received_by_id: 'Người tiếp nhận',
  project_id: 'Dự án',
  sla_quote_due_at: 'SLA Báo giá',
  sla_completion_due_at: 'SLA Hoàn thành',
  latitude: 'Vĩ độ',
  longitude: 'Kinh độ',
  ticket_id: 'Ticket ID',
  attachments: 'Tệp đính kèm'
}

const OG_TICKET_AUDIT_DATETIME_FIELDS = new Set(['received_at', 'sla_quote_due_at', 'sla_completion_due_at'])

function getChangedFields(audit: OgTicketAudit) {
  return getAuditChangedFields(audit, OG_TICKET_AUDIT_FIELD_LABELS, OG_TICKET_AUDIT_DATETIME_FIELDS)
}

useSeoMeta({
  title: computed(() =>
    ogTicket.value ? `${ogTicket.value.subject} - Thần Nông` : 'Chi tiết OG Ticket'
  )
})

// ─── Tab state ───
const infoTab = ref('og')
const mainTab = ref<'overview' | 'survey' | 'commerce' | 'acceptance' | 'warranty'>('overview')
const showAuditHistory = ref(false)

interface MainTabItem {
  key: 'overview' | 'survey' | 'commerce' | 'acceptance' | 'warranty'
  label: string
  icon: string
  badge?: { label: string, color: 'success' | 'warning' | 'primary' | 'neutral' | 'error' }
}

// ─── Lifecycle segments ───
const lifecycleSegments = computed<OgTicketLifecycleSegment[]>(() => {
  const raw = data.value?.data as (OgTicketDetail & { lifecycle_segments?: OgTicketLifecycleSegment[] }) | undefined
  return raw?.lifecycle_segments ?? []
})
const quoteVersionsList = computed(() => versionsData.value?.data ?? [])

const activeOrderStatus = computed(() => {
  const aq = activeQuote.value
  return aq?.order?.status?.value ?? null
})

// ─── Transition ───
const toast = useToast()

async function handleTransition(targetStatus: string) {
  try {
    await apiTransitionOgTicket(id.value, { target_status: targetStatus })
    toast.add({ title: 'Đã chuyển trạng thái', color: 'success' })
    await refreshAll()
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Không thể chuyển trạng thái'), color: 'error' })
  }
}

// ─── Assign workers (from stepper popover) ───
const { data: accountsData } = useAccountList(computed(() => ({ per_page: SELECT_ALL_PER_PAGE })))
const accountOptions = computed(() =>
  (accountsData.value?.data ?? []).map(acc => ({
    label: acc.name,
    value: acc.id,
    capability_rating: acc.capability_rating ?? null
  }))
)

async function handleAssign(assigneeIds: number[]) {
  try {
    await apiUpdateOgTicket(id.value, {
      priority: ogTicket.value!.priority.value as 'low' | 'normal' | 'high' | 'urgent',
      assigned_to_ids: assigneeIds
    })
    toast.add({ title: 'Đã phân công', color: 'success' })
    await refresh()
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Không thể phân công'), color: 'error' })
  }
}

// ─── Create order modal (from stepper popover) ───
const showCreateOrderModal = ref(false)

function handleOpenCreateOrder() {
  showCreateOrderModal.value = true
}

function handleOrderCreated() {
  refreshAll()
}

// ─── SLA computed ───
const slaQuoteFulfilledStatuses = ['quoted', 'approved', 'rejected', 'ordered', 'in_progress', 'completed']

const isSlaQuoteViolated = computed(() => {
  if (!ogTicket.value?.sla_quote_due_at) return false
  if (slaQuoteFulfilledStatuses.includes(ogTicket.value.status.value)) return false
  return new Date(ogTicket.value.sla_quote_due_at) < new Date()
})

const isSlaCompletionViolated = computed(() => {
  if (!ogTicket.value?.sla_completion_due_at) return false
  if (ogTicket.value.status.value === 'completed') return false
  return new Date(ogTicket.value.sla_completion_due_at) < new Date()
})

// ─── Status helpers ───
const isCancelled = computed(() => ogTicket.value?.status.value === 'cancelled')
const isRejected = computed(() => ogTicket.value?.status.value === 'rejected')
const isCompleted = computed(() => ogTicket.value?.status.value === 'completed')
const canEdit = computed(() => !isCancelled.value)

const categoriesModalOpen = ref(false)
const selectedCategoryIds = computed(() => (ogTicket.value?.categories ?? []).map(c => c.id))
function openCategoriesModal() {
  categoriesModalOpen.value = true
}
async function handleCategoriesSaved() {
  await refresh()
}

// ─── SLA update modal ───
const showSlaModal = ref(false)
const isSlaUpdating = ref(false)
const slaForm = reactive({
  sla_quote_due_at: null as string | null,
  sla_completion_due_at: null as string | null
})

function openSlaModal() {
  slaForm.sla_quote_due_at = utcToLocal(ogTicket.value?.sla_quote_due_at ?? null)
  slaForm.sla_completion_due_at = utcToLocal(ogTicket.value?.sla_completion_due_at ?? null)
  showSlaModal.value = true
}

async function handleSlaUpdate() {
  isSlaUpdating.value = true
  try {
    await apiUpdateOgTicket(id.value, {
      priority: ogTicket.value!.priority.value as 'low' | 'normal' | 'high' | 'urgent',
      sla_quote_due_at: localToUtc(slaForm.sla_quote_due_at),
      sla_completion_due_at: localToUtc(slaForm.sla_completion_due_at)
    })
    toast.add({ title: 'Đã cập nhật SLA', color: 'success' })
    showSlaModal.value = false
    await refresh()
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Không thể cập nhật SLA'), color: 'error' })
  } finally {
    isSlaUpdating.value = false
  }
}

// ─── Leaflet (lazy) ───
const LMap = shallowRef<ReturnType<typeof defineComponent> | null>(null)
const LTileLayer = shallowRef<ReturnType<typeof defineComponent> | null>(null)
const LMarker = shallowRef<ReturnType<typeof defineComponent> | null>(null)

onMounted(async () => {
  // Re-fetch data on back navigation to ensure fresh state
  // (Nuxt useFetch may return stale cached data from previous visit)
  refreshAll()

  const leaflet = await import('@vue-leaflet/vue-leaflet')
  LMap.value = leaflet.LMap
  LTileLayer.value = leaflet.LTileLayer
  LMarker.value = leaflet.LMarker
})

const hasLocation = computed(() => ogTicket.value?.latitude != null && ogTicket.value?.longitude != null)
const mapCenter = computed<[number, number]>(() =>
  hasLocation.value
    ? [Number(ogTicket.value!.latitude), Number(ogTicket.value!.longitude)]
    : [10.7769, 106.7009]
)
const showMap = ref(false)

// ─── Ticket gốc attachments ───
const ticketAttachments = computed(() => ogTicket.value?.ticket?.attachments ?? [])

// ─── Warranty requests ───
const warrantyRequests = computed<OgTicketWarrantyRequest[]>(() => ogTicket.value?.warranty_requests ?? [])

const mainTabItems = computed<MainTabItem[]>(() => {
  const acceptanceBadge: MainTabItem['badge'] | undefined = hasAcceptanceReportOrder.value
    ? (acceptanceReport.value?.is_confirmed
        ? { label: 'Đã xong', color: 'success' }
        : { label: 'Chờ ký', color: 'warning' })
    : undefined

  return [
    { key: 'overview', label: 'Tổng quan', icon: 'i-lucide-file-text' },
    { key: 'survey', label: 'Khảo sát', icon: 'i-lucide-search' },
    { key: 'commerce', label: 'Thương mại', icon: 'i-lucide-receipt' },
    {
      key: 'acceptance',
      label: 'Nghiệm thu',
      icon: 'i-lucide-clipboard-check',
      badge: acceptanceBadge
    },
    {
      key: 'warranty',
      label: 'Bảo hành',
      icon: 'i-lucide-shield',
      badge: warrantyRequests.value.length > 0
        ? { label: String(warrantyRequests.value.length), color: 'warning' }
        : undefined
    }
  ]
})
const imageAttachments = computed(() => ticketAttachments.value.filter(a => a.mime_type.startsWith('image/')))
const docAttachments = computed(() => ticketAttachments.value.filter(a => !a.mime_type.startsWith('image/')))

// ─── CRUD (Delete + Release) ───
const crud = useCrudModals<OgTicketDetail>()
const { showDeleteModal: showDeleteDialog, deleteTarget } = crud
const { isDeleting, submitDelete } = useCrudSubmit(crud, refresh)

const { isCheckingDelete, deleteBlockedMessage, openDeleteModal, handleDelete } = useCheckDelete({
  crud,
  submitDelete,
  checkFn: apiCheckDeleteOgTicket,
  deleteFn: apiDeleteOgTicket,
  successMessage: 'Đã huỷ OG Ticket',
  navigateAfter: '/pmc/og-tickets'
})

const deleteWarning = computed(() => {
  const warnings = [ogTicket.value?.is_from_pool
    ? 'OG Ticket sẽ bị huỷ. Ticket gốc sẽ được trả về pool.'
    : 'OG Ticket s�� bị huỷ.']
  if (activeQuote.value) {
    warnings.push(`Báo giá ${activeQuote.value.code} (${activeQuote.value.status.label}) sẽ bị huỷ.`)
    if (activeQuote.value.order) {
      warnings.push(`Đơn hàng ${activeQuote.value.order.code} (${activeQuote.value.order.status.label}) sẽ bị huỷ.`)
    }
  }
  if (draftReplacement.value) {
    warnings.push(`Báo giá nháp ${draftReplacement.value.code} sẽ bị huỷ.`)
  }
  return warnings.join(' ')
})

const showReleaseDialog = ref(false)

// ─── Acceptance report modal ───
const showAcceptanceReport = ref(false)
const acceptanceReportOrderId = computed(() => activeQuote.value?.order?.id ?? null)
const hasAcceptanceReportOrder = computed(() => acceptanceReportOrderId.value != null)

const {
  data: acceptanceReportData,
  refresh: refreshAcceptanceReport
} = useAcceptanceReport(
  computed(() => acceptanceReportOrderId.value ?? 0),
  { immediate: false }
)
const acceptanceReport = computed(() => acceptanceReportData.value?.data ?? null)

watch(acceptanceReportOrderId, async (orderId) => {
  if (orderId != null) {
    await refreshAcceptanceReport()
  }
}, { immediate: true })

watch(showAcceptanceReport, async (val, prev) => {
  if (prev && !val && hasAcceptanceReportOrder.value) {
    await refreshAcceptanceReport()
  }
})
const releaseNote = ref('')
const isReleasing = ref(false)
const isCheckingRelease = ref(false)
const releaseBlockedMessage = ref('')

async function openReleaseDialog() {
  isCheckingRelease.value = true
  releaseBlockedMessage.value = ''
  showReleaseDialog.value = true
  try {
    const result = await apiCheckDeleteOgTicket(id.value)
    if (!result.can_delete) {
      releaseBlockedMessage.value = result.message
    }
  } catch {
    releaseBlockedMessage.value = 'Không thể kiểm tra. Vui lòng thử lại.'
  } finally {
    isCheckingRelease.value = false
  }
}

async function handleRelease() {
  isReleasing.value = true
  try {
    await apiReleaseOgTicket(id.value, releaseNote.value ? { note: releaseNote.value } : undefined)
    showReleaseDialog.value = false
    toast.add({ title: 'Đã trả ticket về pool', color: 'success' })
    navigateTo('/pmc/og-tickets')
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Không thể trả ticket. Vui lòng thử lại.'), color: 'error' })
  } finally {
    isReleasing.value = false
  }
}

// ─── Payment / Reconciliation helpers ───
type StatusColor = 'error' | 'success' | 'warning' | 'info' | 'primary' | 'neutral' | 'secondary'

function toBadgeColor(color: string | null | undefined): StatusColor {
  const allowed: StatusColor[] = ['error', 'success', 'warning', 'info', 'primary', 'neutral', 'secondary']
  return (allowed as string[]).includes(color ?? '') ? (color as StatusColor) : 'neutral'
}

function paymentAccentBar(color: string | null | undefined): string {
  switch (color) {
    case 'success': return 'bg-gradient-to-r from-emerald-400 to-green-500'
    case 'warning': return 'bg-gradient-to-r from-amber-400 to-orange-500'
    case 'error': return 'bg-gradient-to-r from-rose-500 to-red-600'
    case 'info': return 'bg-gradient-to-r from-sky-400 to-blue-500'
    default: return 'bg-gradient-to-r from-slate-300 to-slate-400'
  }
}

function paymentIconBg(color: string | null | undefined): string {
  switch (color) {
    case 'success': return 'bg-emerald-50'
    case 'warning': return 'bg-amber-50'
    case 'error': return 'bg-rose-50'
    case 'info': return 'bg-sky-50'
    default: return 'bg-slate-100'
  }
}

function paymentIconFg(color: string | null | undefined): string {
  switch (color) {
    case 'success': return 'text-emerald-600'
    case 'warning': return 'text-amber-600'
    case 'error': return 'text-rose-600'
    case 'info': return 'text-sky-600'
    default: return 'text-slate-500'
  }
}

function paymentBarFill(color: string | null | undefined): string {
  switch (color) {
    case 'success': return 'bg-emerald-500'
    case 'warning': return 'bg-amber-500'
    case 'error': return 'bg-rose-500'
    case 'info': return 'bg-sky-500'
    default: return 'bg-slate-400'
  }
}

function paymentProgress(paid: string | null | undefined, total: string | null | undefined): number {
  const p = Number(paid ?? 0)
  const t = Number(total ?? 0)
  if (!t || t <= 0) return 0
  return Math.min(100, Math.max(0, (p / t) * 100))
}

function reconciliationAccentBar(value: string): string {
  if (value === 'full') return 'bg-gradient-to-r from-emerald-400 to-teal-500'
  if (value === 'partial') return 'bg-gradient-to-r from-amber-400 to-orange-500'
  return 'bg-gradient-to-r from-slate-300 to-slate-400'
}

function reconciliationIconBg(value: string): string {
  if (value === 'full') return 'bg-emerald-50'
  if (value === 'partial') return 'bg-amber-50'
  return 'bg-slate-100'
}

function reconciliationIconFg(value: string): string {
  if (value === 'full') return 'text-emerald-600'
  if (value === 'partial') return 'text-amber-600'
  return 'text-slate-400'
}

function reconciliationBarFill(value: string): string {
  if (value === 'full') return 'bg-emerald-500'
  if (value === 'partial') return 'bg-amber-500'
  return 'bg-slate-300'
}

function reconciliationIcon(value: string): string {
  if (value === 'full') return 'i-lucide-check-check'
  if (value === 'partial') return 'i-lucide-scale'
  return 'i-lucide-clock'
}
</script>

<template>
  <div>
    <!-- ═══ HEADER (compact, single row) ═══ -->
    <div class="mb-6">
      <div class="flex items-center gap-3 min-w-0">
        <UButton
          icon="i-lucide-arrow-left"
          color="neutral"
          variant="ghost"
          to="/pmc/og-tickets"
          size="sm"
          class="shrink-0"
        />

        <div class="flex items-center gap-2 min-w-0 flex-1">
          <span class="font-mono text-xs font-semibold text-slate-500 shrink-0 tracking-wide">
            {{ ogTicket?.ticket?.code ?? `OG#${id}` }}
          </span>
          <span class="text-slate-300 shrink-0">/</span>
          <h1 class="font-bold text-slate-900 text-sm sm:text-base truncate">
            {{ ogTicket?.subject ?? '...' }}
          </h1>
          <template v-if="ogTicket">
            <UBadge
              :label="ogTicket.status.label"
              :color="ogTicketStatusColor(ogTicket.status.value)"
              variant="subtle"
              size="xs"
              class="shrink-0"
            />
            <UBadge
              :label="ogTicket.priority.label"
              :color="ogTicketPriorityColor(ogTicket.priority.value)"
              variant="soft"
              size="xs"
              class="shrink-0"
            />
          </template>
        </div>

        <div
          v-if="ogTicket"
          class="flex items-center gap-1.5 shrink-0"
        >
          <UButton
            v-if="canEdit"
            label="Chỉnh sửa"
            icon="i-lucide-pencil"
            color="neutral"
            variant="soft"
            size="sm"
            :to="`/pmc/og-tickets/${id}/edit`"
          />
          <UButton
            v-if="canEdit"
            label="Báo giá"
            icon="i-lucide-file-plus"
            color="success"
            variant="soft"
            size="sm"
            :to="`/pmc/quotes/create?og_ticket_id=${id}`"
          />
          <UButton
            v-if="isCompleted"
            label="Cập nhật SLA"
            icon="i-lucide-clock-arrow-up"
            color="neutral"
            variant="soft"
            size="sm"
            @click="openSlaModal"
          />
          <UButton
            v-if="acceptanceReportOrderId"
            label="Biên bản"
            icon="i-lucide-clipboard-check"
            color="primary"
            variant="solid"
            size="sm"
            @click="showAcceptanceReport = true"
          />
          <UDropdownMenu
            :items="[[
              ...(canEdit && !isCompleted && ogTicket?.is_from_pool ? [{ label: 'Trả lại pool', icon: 'i-lucide-undo-2', onSelect: openReleaseDialog }] : []),
              { label: 'Xoá ticket', icon: 'i-lucide-trash-2', color: 'error' as const, onSelect: () => openDeleteModal(ogTicket!) }
            ]]"
          >
            <UButton
              icon="i-lucide-more-horizontal"
              color="neutral"
              variant="outline"
              size="sm"
            />
          </UDropdownMenu>
        </div>
      </div>
    </div>

    <!-- Loading (initial only — keep content visible during refresh) -->
    <div
      v-if="status === 'pending' && !ogTicket"
      class="flex flex-col gap-4"
    >
      <div
        v-for="i in 4"
        :key="i"
        class="h-24 bg-slate-100 rounded-xl animate-pulse"
      />
    </div>

    <!-- Error (only if no data yet) -->
    <SharedCrudPageError
      v-else-if="error && !ogTicket"
      :error="error"
      :retry="refresh"
    />

    <!-- ═══ CONTENT ═══ -->
    <div
      v-else-if="ogTicket"
      class="flex flex-col gap-6"
    >
      <!-- ─── Giai đoạn xử lý (full width) ─── -->
      <SharedSectionCard title="Giai đoạn xử lý">
        <SharedOgTicketLifecycleStepper
          :key="stepperKey"
          :og-ticket-id="ogTicket.id"
          :current-status="ogTicket.status.value"
          :segments="lifecycleSegments"
          :quote-versions="quoteVersionsList"
          :active-quote-id="activeQuote?.id ?? null"
          :active-quote-status="activeQuote?.status?.value ?? null"
          :active-order-status="activeOrderStatus"
          :has-active-order="!!activeQuote?.order"
          :account-options="accountOptions"
          :current-assignee-ids="(ogTicket.assignees ?? []).map(a => a.id)"
          :current-assignees="ogTicket.assignees ?? []"
          :is-terminal="isCancelled || isCompleted"
          @transition="handleTransition"
          @assign="handleAssign"
          @create-order="handleOpenCreateOrder"
        />

        <div class="mt-4 flex flex-wrap gap-4">
          <div class="flex items-center gap-2 text-sm">
            <UIcon
              name="i-lucide-clock"
              class="size-4 text-slate-400"
            />
            <span class="text-slate-600">SLA Báo giá:</span>
            <span
              v-if="ogTicket.sla_quote_due_at"
              :class="isSlaQuoteViolated ? 'text-red-600 font-semibold' : 'text-slate-900'"
            >
              {{ formatDateTime(ogTicket.sla_quote_due_at) }}
              <span
                v-if="isSlaQuoteViolated"
                class="text-red-500 text-xs ml-1"
              >(Quá hạn)</span>
            </span>
            <span
              v-else
              class="text-slate-400"
            >—</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <UIcon
              name="i-lucide-calendar-check"
              class="size-4 text-slate-400"
            />
            <span class="text-slate-600">SLA Hoàn thành:</span>
            <span
              v-if="ogTicket.sla_completion_due_at"
              :class="isSlaCompletionViolated ? 'text-red-600 font-semibold' : 'text-slate-900'"
            >
              {{ formatDateTime(ogTicket.sla_completion_due_at) }}
              <span
                v-if="isSlaCompletionViolated"
                class="text-red-500 text-xs ml-1"
              >(Quá hạn)</span>
            </span>
            <span
              v-else
              class="text-slate-400"
            >—</span>
          </div>
        </div>

        <UAlert
          v-if="isRejected"
          icon="i-lucide-x-circle"
          color="error"
          title="Báo giá bị từ chối"
          description="Cư dân đã từ chối báo giá. Vui lòng liên hệ lại hoặc cập nhật báo giá mới."
          variant="subtle"
          class="mt-4"
        />
        <UAlert
          v-if="isCancelled"
          icon="i-lucide-ban"
          color="neutral"
          title="Ticket đã hủy"
          :description="ogTicket?.is_from_pool ? 'Ticket này đã được trả về pool và không thể chỉnh sửa.' : 'Ticket này đã bị huỷ và không thể chỉnh sửa.'"
          variant="subtle"
          class="mt-4"
        />
      </SharedSectionCard>

      <!-- ─── Grid layout for remaining content ─── -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- LEFT: Main content -->
        <div class="lg:col-span-2 flex flex-col gap-4">
          <!-- ═══ MAIN TABS NAV ═══ -->
          <div class="bg-white border border-border-gray rounded-xl shadow-sm p-1.5 flex items-center gap-1 overflow-x-auto">
            <button
              v-for="tab in mainTabItems"
              :key="tab.key"
              type="button"
              class="group relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap cursor-pointer"
              :class="mainTab === tab.key
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'"
              @click="mainTab = tab.key"
            >
              <UIcon
                :name="tab.icon"
                class="size-4"
              />
              <span>{{ tab.label }}</span>
              <UBadge
                v-if="tab.badge"
                :label="tab.badge.label"
                :color="tab.badge.color"
                :variant="mainTab === tab.key ? 'solid' : 'subtle'"
                size="xs"
              />
            </button>
          </div>

          <!-- ═══ TAB: TỔNG QUAN ═══ -->
          <div
            v-show="mainTab === 'overview'"
            class="bg-white border border-border-gray rounded-xl shadow-sm overflow-hidden"
          >
            <div class="px-4 sm:px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div class="flex items-center gap-3">
                <h2 class="font-bold text-slate-900">
                  Thông tin ticket
                </h2>
                <span class="font-mono text-xs font-semibold text-slate-500">
                  {{ ogTicket.ticket?.code ?? `#${ogTicket.ticket_id}` }}
                </span>
              </div>
              <div class="flex rounded-lg bg-slate-100 p-0.5 self-start sm:self-auto">
                <button
                  class="px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer"
                  :class="infoTab === 'og' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
                  @click="infoTab = 'og'"
                >
                  OG Ticket
                </button>
                <button
                  class="px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer"
                  :class="infoTab === 'original' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
                  @click="infoTab = 'original'"
                >
                  Ticket gốc
                </button>
              </div>
            </div>

            <!-- Tab: OG Ticket (read-only) -->
            <div
              v-if="infoTab === 'og'"
              class="px-4 sm:px-6 py-5 flex flex-col gap-5"
            >
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <SharedFieldDisplay label="Tiêu đề">
                  <span class="font-medium">{{ ogTicket.subject }}</span>
                </SharedFieldDisplay>
                <SharedFieldDisplay label="Kênh tiếp nhận">
                  <UBadge
                    :label="ogTicket.channel?.label"
                    color="neutral"
                    variant="subtle"
                    size="sm"
                  />
                </SharedFieldDisplay>
                <div class="sm:col-span-2">
                  <SharedFieldDisplay label="Mô tả">
                    <span class="whitespace-pre-line">{{ ogTicket.description || '—' }}</span>
                  </SharedFieldDisplay>
                </div>
                <SharedFieldDisplay label="Khách hàng">
                  <NuxtLink
                    v-if="ogTicket.customer"
                    :to="`/pmc/customers/${ogTicket.customer.id}`"
                    class="inline-flex items-center gap-1 font-medium text-primary-600 hover:underline"
                  >
                    {{ ogTicket.customer.full_name }}
                    <UIcon
                      name="i-lucide-external-link"
                      class="size-3.5"
                    />
                  </NuxtLink>
                  <span v-else>{{ ogTicket.requester_name }}</span>
                </SharedFieldDisplay>
                <SharedFieldDisplay label="Số điện thoại">
                  <span class="font-mono">{{ formatPhone(ogTicket.customer?.phone ?? ogTicket.requester_phone) }}</span>
                </SharedFieldDisplay>
                <SharedFieldDisplay label="Căn hộ">
                  {{ ogTicket.apartment_name || '—' }}
                </SharedFieldDisplay>
                <SharedFieldDisplay label="Dự án">
                  {{ ogTicket.project?.name ?? '—' }}
                </SharedFieldDisplay>
                <div class="sm:col-span-2">
                  <SharedFieldDisplay label="Danh mục">
                    <div class="flex items-center flex-wrap gap-1.5">
                      <UBadge
                        v-for="cat in ogTicket.categories"
                        :key="cat.id"
                        :label="cat.name"
                        color="primary"
                        variant="subtle"
                        size="sm"
                      />
                      <span
                        v-if="!ogTicket.categories || ogTicket.categories.length === 0"
                        class="text-slate-400 text-sm"
                      >—</span>
                      <UButton
                        icon="i-lucide-pencil"
                        size="xs"
                        color="neutral"
                        variant="ghost"
                        class="ml-1"
                        @click="openCategoriesModal"
                      />
                    </div>
                  </SharedFieldDisplay>
                </div>
              </div>

              <!-- Địa chỉ -->
              <div
                v-if="ogTicket.address || hasLocation"
                class="border-t border-slate-100 pt-5"
              >
                <SharedFieldDisplay label="Địa chỉ">
                  {{ ogTicket.address || '—' }}
                </SharedFieldDisplay>

                <!-- Bản đồ (collapse) -->
                <div
                  v-if="hasLocation"
                  class="mt-3"
                >
                  <button
                    class="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-700 cursor-pointer group"
                    @click="showMap = !showMap"
                  >
                    <UIcon
                      name="i-lucide-map"
                      class="size-3.5"
                    />
                    <span>{{ showMap ? 'Ẩn bản đồ' : 'Xem bản đồ' }}</span>
                    <UIcon
                      :name="showMap ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                      class="size-3.5"
                    />
                  </button>
                  <ClientOnly v-if="showMap">
                    <div
                      v-if="LMap && LTileLayer && LMarker"
                      class="mt-2 rounded-xl border border-slate-200 overflow-hidden h-[250px]"
                    >
                      <component
                        :is="LMap"
                        :center="mapCenter"
                        :zoom="15"
                        :use-global-leaflet="false"
                        style="width: 100%; height: 100%"
                      >
                        <component
                          :is="LTileLayer"
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          :attribution="'&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a>'"
                        />
                        <component
                          :is="LMarker"
                          :lat-lng="mapCenter"
                        />
                      </component>
                    </div>
                    <template #fallback>
                      <div class="mt-2 rounded-xl border border-slate-200 bg-slate-50 h-[250px] flex items-center justify-center">
                        <span
                          class="material-symbols-outlined text-slate-300 animate-spin"
                          style="font-size: 24px"
                        >progress_activity</span>
                      </div>
                    </template>
                  </ClientOnly>
                </div>
              </div>

              <!-- OG Attachments (read-only) -->
              <div
                v-if="ogTicket.attachments.length > 0"
                class="border-t border-slate-100 pt-5"
              >
                <div class="flex items-center gap-2 mb-3">
                  <UIcon
                    name="i-lucide-paperclip"
                    class="size-4 text-slate-400"
                  />
                  <span class="text-sm font-semibold text-slate-700">Tệp đính kèm OG</span>
                  <span class="text-xs text-slate-400">({{ ogTicket.attachments.length }})</span>
                </div>
                <div class="flex flex-col gap-2">
                  <a
                    v-for="att in ogTicket.attachments"
                    :key="att.id"
                    :href="att.url"
                    target="_blank"
                    class="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50 transition-colors"
                  >
                    <div
                      class="size-8 rounded-lg flex items-center justify-center shrink-0"
                      :class="isImageMime(att.mime_type) ? 'bg-violet-100' : 'bg-amber-100'"
                    >
                      <UIcon
                        :name="isImageMime(att.mime_type) ? 'i-lucide-image' : 'i-lucide-file-text'"
                        class="size-4"
                        :class="isImageMime(att.mime_type) ? 'text-violet-500' : 'text-amber-600'"
                      />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-medium text-slate-700 truncate">{{ att.original_name }}</p>
                      <p class="text-[10px] text-slate-400">{{ formatFileSize(att.size_bytes) }}</p>
                    </div>
                    <UIcon
                      name="i-lucide-download"
                      class="size-4 text-slate-400"
                    />
                  </a>
                </div>
              </div>
            </div>

            <!-- Tab: Ticket gốc (read-only) -->
            <div
              v-if="infoTab === 'original'"
              class="px-4 sm:px-6 py-5 flex flex-col gap-5"
            >
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <SharedFieldDisplay label="Mã ticket">
                  <ULink
                    v-if="ogTicket.ticket?.code"
                    :to="residentTicketPath"
                    target="_blank"
                    rel="noopener"
                    class="font-mono font-semibold inline-flex items-center gap-1 text-slate-900 hover:text-primary-600 hover:underline"
                  >
                    {{ ogTicket.ticket.code }}
                    <UIcon
                      name="i-lucide-external-link"
                      class="size-3.5"
                    />
                  </ULink>
                  <span
                    v-else
                    class="font-mono text-slate-400"
                  >—</span>
                </SharedFieldDisplay>
                <SharedFieldDisplay label="Trạng thái">
                  <UBadge
                    v-if="ogTicket.ticket"
                    :color="ogTicketStatusColor(ogTicket.ticket.status.value)"
                    :label="ogTicket.ticket.status.label"
                    variant="subtle"
                    size="sm"
                  />
                </SharedFieldDisplay>
                <SharedFieldDisplay label="Tiêu đề">
                  <span class="font-medium">{{ ogTicket.ticket?.subject ?? '—' }}</span>
                </SharedFieldDisplay>
                <SharedFieldDisplay label="Kênh tiếp nhận">
                  <UBadge
                    v-if="ogTicket.ticket?.channel"
                    :label="ogTicket.ticket.channel.label"
                    color="neutral"
                    variant="subtle"
                    size="sm"
                  />
                  <span
                    v-else
                    class="text-slate-400"
                  >—</span>
                </SharedFieldDisplay>
                <SharedFieldDisplay label="Người gửi">
                  {{ ogTicket.ticket?.requester_name ?? '—' }}
                </SharedFieldDisplay>
                <SharedFieldDisplay label="Số điện thoại">
                  {{ ogTicket.ticket?.requester_phone ?? '—' }}
                </SharedFieldDisplay>
                <SharedFieldDisplay label="Ngày gửi">
                  {{ formatDateTime(ogTicket.ticket?.created_at ?? null) }}
                </SharedFieldDisplay>
              </div>

              <!-- Mô tả gốc -->
              <div
                v-if="ogTicket.ticket?.description"
                class="border-t border-slate-100 pt-5"
              >
                <SharedFieldDisplay label="Mô tả">
                  <span class="whitespace-pre-line">{{ ogTicket.ticket.description }}</span>
                </SharedFieldDisplay>
              </div>

              <!-- Địa chỉ gốc -->
              <div
                v-if="ogTicket.ticket?.address"
                class="border-t border-slate-100 pt-5"
              >
                <SharedFieldDisplay label="Địa chỉ">
                  {{ ogTicket.ticket.address }}
                </SharedFieldDisplay>
              </div>

              <!-- Ticket gốc attachments -->
              <div
                v-if="ticketAttachments.length > 0"
                class="border-t border-slate-100 pt-5"
              >
                <div class="flex items-center gap-2 mb-3">
                  <UIcon
                    name="i-lucide-paperclip"
                    class="size-4 text-slate-400"
                  />
                  <span class="text-sm font-semibold text-slate-700">Tệp từ cư dân</span>
                  <span class="text-xs text-slate-400">({{ ticketAttachments.length }})</span>
                </div>
                <div
                  v-if="imageAttachments.length > 0"
                  class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 mb-3"
                >
                  <a
                    v-for="img in imageAttachments"
                    :key="img.id"
                    :href="img.url"
                    target="_blank"
                    class="group relative rounded-lg border border-slate-200 overflow-hidden aspect-square bg-slate-50 hover:shadow-md transition-shadow"
                  >
                    <img
                      :src="img.url"
                      :alt="img.original_name"
                      class="w-full h-full object-cover"
                    >
                    <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p class="text-white text-[10px] truncate">{{ img.original_name }}</p>
                    </div>
                  </a>
                </div>
                <div
                  v-if="docAttachments.length > 0"
                  class="flex flex-col gap-2"
                >
                  <a
                    v-for="doc in docAttachments"
                    :key="doc.id"
                    :href="doc.url"
                    target="_blank"
                    class="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 hover:bg-slate-50 transition-colors"
                  >
                    <div class="size-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                      <UIcon
                        name="i-lucide-file-text"
                        class="size-4 text-amber-600"
                      />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-slate-700 truncate">{{ doc.original_name }}</p>
                      <p class="text-xs text-slate-400">{{ formatFileSize(doc.size_bytes) }}</p>
                    </div>
                    <UIcon
                      name="i-lucide-download"
                      class="size-4 text-slate-400"
                    />
                  </a>
                </div>
              </div>
              <div
                v-else
                class="border-t border-slate-100 pt-5"
              >
                <p class="text-sm text-slate-400 italic">
                  Không có tệp đính kèm từ cư dân.
                </p>
              </div>
            </div>
          </div>

          <!-- ═══ TAB: KHẢO SÁT ═══ -->
          <div
            v-show="mainTab === 'survey'"
            class="flex flex-col gap-6"
          >
            <OgTicketSurveyTab :og-ticket-id="ogTicket.id" />
          </div>

          <!-- ═══ TAB: THƯƠNG MẠI ═══ -->
          <div
            v-show="mainTab === 'commerce'"
            class="flex flex-col gap-6"
          >
            <div
              v-if="!activeQuote && !ogTicket.payment_status && !ogTicket.reconciliation_status"
              class="bg-white border border-dashed border-slate-200 rounded-xl p-10 text-center"
            >
              <div class="size-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
                <UIcon
                  name="i-lucide-receipt"
                  class="size-6 text-slate-300"
                />
              </div>
              <p class="text-sm font-semibold text-slate-600 mb-1">
                Chưa có thông tin thương mại
              </p>
              <p class="text-xs text-slate-400 mb-4">
                Tạo báo giá để bắt đầu quy trình báo giá → duyệt → thanh toán.
              </p>
              <UButton
                v-if="canEdit"
                label="Tạo báo giá"
                icon="i-lucide-file-plus"
                color="success"
                variant="soft"
                size="sm"
                :to="`/pmc/quotes/create?og_ticket_id=${id}`"
              />
            </div>

            <!-- ─── Báo giá active ─── -->
            <SharedSectionCard
              v-if="activeQuote"
              title="Báo giá"
            >
              <template #header-actions>
                <NuxtLink :to="`/pmc/quotes/${activeQuote.id}`">
                  <UButton
                    label="Xem chi tiết"
                    icon="i-lucide-external-link"
                    size="xs"
                    color="primary"
                    variant="ghost"
                  />
                </NuxtLink>
              </template>

              <div class="flex items-center gap-2 mb-3">
                <span class="font-mono text-xs font-semibold text-slate-700">{{ activeQuote.code }}</span>
                <UBadge
                  :label="activeQuote.status.label"
                  :color="quoteStatusColor(activeQuote.status.value)"
                  variant="subtle"
                  size="xs"
                />
                <UBadge
                  label="Còn hiệu lực"
                  color="success"
                  variant="subtle"
                  size="xs"
                />
              </div>

              <!-- Lines -->
              <div class="flex flex-col gap-1.5">
                <div
                  v-for="line in activeQuote.lines"
                  :key="line.id"
                  class="flex items-center justify-between text-xs"
                >
                  <span class="text-slate-700">{{ line.name }}</span>
                  <span class="text-slate-500">
                    {{ line.quantity }} {{ line.unit }} × {{ formatCurrency(line.unit_price) }}
                    = <span class="font-medium text-slate-700">{{ formatCurrency(line.line_amount) }}</span>
                  </span>
                </div>
              </div>

              <!-- Total -->
              <div class="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <span class="text-sm font-medium text-slate-600">Tổng tiền</span>
                <span class="text-sm font-bold text-slate-900">{{ formatCurrency(activeQuote.total_amount) }}</span>
              </div>

              <!-- Draft replacement notice -->
              <UAlert
                v-if="draftReplacement"
                color="warning"
                variant="subtle"
                icon="i-lucide-file-edit"
                class="mt-3"
              >
                <template #title>
                  Có báo giá mới đang chờ duyệt
                </template>
                <template #description>
                  <NuxtLink
                    :to="`/pmc/quotes/${draftReplacement.id}`"
                    class="font-mono text-xs font-semibold underline"
                  >
                    {{ draftReplacement.code }}
                  </NuxtLink>
                  <span class="ml-1">({{ draftReplacement.status.label }})</span>
                  — Báo giá này sẽ thay thế báo giá hiện tại khi được quản lý duyệt.
                </template>
              </UAlert>

              <!-- Đơn hàng -->
              <div
                v-if="activeQuote.order"
                class="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between"
              >
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-slate-600">Đơn hàng</span>
                  <span class="font-mono text-xs font-semibold text-slate-700">{{ activeQuote.order.code }}</span>
                  <UBadge
                    :label="activeQuote.order.status.label"
                    :color="orderStatusColor(activeQuote.order.status.value)"
                    variant="subtle"
                    size="xs"
                  />
                </div>
                <NuxtLink :to="`/pmc/orders/${activeQuote.order.id}`">
                  <UButton
                    icon="i-lucide-external-link"
                    size="xs"
                    color="primary"
                    variant="ghost"
                  />
                </NuxtLink>
              </div>
            </SharedSectionCard>

            <!-- ─── Tài chính: Thanh toán & Đối soát ─── -->
            <div
              v-if="ogTicket.payment_status || ogTicket.reconciliation_status"
              class="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <!-- Thanh toán -->
              <NuxtLink
                v-if="ogTicket.payment_status && ogTicket.payment_status.receivable_id"
                :to="`/pmc/receivables/${ogTicket.payment_status.receivable_id}`"
                class="group relative overflow-hidden rounded-xl border border-border-gray bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
              >
                <div
                  class="absolute inset-x-0 top-0 h-1"
                  :class="paymentAccentBar(ogTicket.payment_status.color)"
                />
                <div class="p-4 sm:p-5">
                  <div class="flex items-start justify-between gap-3 mb-3">
                    <div class="flex items-center gap-2.5 min-w-0">
                      <div
                        class="size-9 rounded-lg flex items-center justify-center shrink-0"
                        :class="paymentIconBg(ogTicket.payment_status.color)"
                      >
                        <UIcon
                          name="i-lucide-wallet"
                          class="size-5"
                          :class="paymentIconFg(ogTicket.payment_status.color)"
                        />
                      </div>
                      <div class="min-w-0">
                        <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider leading-none">
                          Thanh toán
                        </p>
                        <h3 class="font-bold text-slate-900 text-sm mt-1 truncate">
                          {{ ogTicket.payment_status.label }}
                        </h3>
                      </div>
                    </div>
                    <UBadge
                      :label="ogTicket.payment_status.label"
                      :color="toBadgeColor(ogTicket.payment_status.color)"
                      variant="subtle"
                      size="xs"
                    />
                  </div>

                  <div
                    v-if="ogTicket.payment_status.amount"
                    class="mt-3"
                  >
                    <div class="flex items-baseline justify-between mb-1.5">
                      <span class="text-xs text-slate-500">Đã thu</span>
                      <span class="font-bold text-slate-900 text-sm">
                        {{ formatCurrency(ogTicket.payment_status.paid_amount ?? '0') }}
                        <span class="text-slate-300 font-normal mx-0.5">/</span>
                        <span class="text-slate-600 font-semibold">{{ formatCurrency(ogTicket.payment_status.amount) }}</span>
                      </span>
                    </div>
                    <div class="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        class="h-full rounded-full transition-all duration-500"
                        :class="paymentBarFill(ogTicket.payment_status.color)"
                        :style="{ width: paymentProgress(ogTicket.payment_status.paid_amount, ogTicket.payment_status.amount) + '%' }"
                      />
                    </div>
                  </div>

                  <div class="mt-3 flex items-center gap-1 text-xs font-medium text-slate-500 group-hover:text-primary-600 transition-colors">
                    <span>Xem công nợ</span>
                    <UIcon
                      name="i-lucide-arrow-right"
                      class="size-3.5 group-hover:translate-x-0.5 transition-transform"
                    />
                  </div>
                </div>
              </NuxtLink>

              <!-- Thanh toán placeholder (chưa có receivable) -->
              <div
                v-else-if="ogTicket.reconciliation_status"
                class="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-5 flex items-center gap-3"
              >
                <UIcon
                  name="i-lucide-wallet"
                  class="size-5 text-slate-300"
                />
                <div>
                  <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Thanh toán
                  </p>
                  <p class="text-sm text-slate-400 mt-0.5">
                    Chưa phát sinh công nợ
                  </p>
                </div>
              </div>

              <!-- Đối soát -->
              <div
                v-if="ogTicket.reconciliation_status"
                class="relative overflow-hidden rounded-xl border border-border-gray bg-white shadow-sm"
              >
                <div
                  class="absolute inset-x-0 top-0 h-1"
                  :class="reconciliationAccentBar(ogTicket.reconciliation_status.value)"
                />
                <div class="p-4 sm:p-5">
                  <div class="flex items-start justify-between gap-3 mb-3">
                    <div class="flex items-center gap-2.5 min-w-0">
                      <div
                        class="size-9 rounded-lg flex items-center justify-center shrink-0"
                        :class="reconciliationIconBg(ogTicket.reconciliation_status.value)"
                      >
                        <UIcon
                          :name="reconciliationIcon(ogTicket.reconciliation_status.value)"
                          class="size-5"
                          :class="reconciliationIconFg(ogTicket.reconciliation_status.value)"
                        />
                      </div>
                      <div class="min-w-0">
                        <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider leading-none">
                          Đối soát
                        </p>
                        <h3 class="font-bold text-slate-900 text-sm mt-1 truncate">
                          {{ ogTicket.reconciliation_status.label }}
                        </h3>
                      </div>
                    </div>
                    <UBadge
                      :label="ogTicket.reconciliation_status.label"
                      :color="toBadgeColor(ogTicket.reconciliation_status.color)"
                      variant="subtle"
                      size="xs"
                    />
                  </div>

                  <!-- Progress: Đã đối soát / Tổng -->
                  <div class="mt-3">
                    <div class="flex items-baseline justify-between mb-1.5">
                      <span class="text-xs text-slate-500">Đã đối soát</span>
                      <span class="font-bold text-slate-900 text-sm">
                        {{ formatCurrency(ogTicket.reconciliation_status.reconciled_amount) }}
                        <span class="text-slate-300 font-normal mx-0.5">/</span>
                        <span class="text-slate-600 font-semibold">{{ formatCurrency(ogTicket.reconciliation_status.amount) }}</span>
                      </span>
                    </div>
                    <div class="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        class="h-full rounded-full transition-all duration-500"
                        :class="reconciliationBarFill(ogTicket.reconciliation_status.value)"
                        :style="{ width: paymentProgress(ogTicket.reconciliation_status.reconciled_amount, ogTicket.reconciliation_status.amount) + '%' }"
                      />
                    </div>
                  </div>

                  <div
                    v-if="ogTicket.reconciliation_status.count_total > 0"
                    class="mt-3 flex items-center gap-2 text-xs text-slate-500"
                  >
                    <UIcon
                      name="i-lucide-file-check-2"
                      class="size-3.5 shrink-0"
                    />
                    <span class="font-medium">
                      {{ ogTicket.reconciliation_status.count_reconciled }}/{{ ogTicket.reconciliation_status.count_total }} chứng từ
                      <span
                        v-if="Number(ogTicket.reconciliation_status.pending_amount) > 0"
                        class="text-amber-600 ml-1"
                      >
                        (còn {{ formatCurrency(ogTicket.reconciliation_status.pending_amount) }} chờ duyệt)
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- ═══ END TAB: THƯƠNG MẠI ═══ -->

          <!-- ═══ TAB: NGHIỆM THU ═══ -->
          <div
            v-show="mainTab === 'acceptance'"
            class="flex flex-col gap-6"
          >
            <!-- ─── Rating cư dân ─── -->
            <SharedSectionCard title="Rating cư dân">
              <SharedTicketRatingDisplay
                :rating="ogTicket.resident_rating ?? null"
                :comment="ogTicket.resident_rating_comment ?? null"
                :rated-at="ogTicket.resident_rated_at ?? null"
              />
            </SharedSectionCard>

            <!-- ─── Biên bản nghiệm thu ─── -->
            <SharedSectionCard
              v-if="hasAcceptanceReportOrder"
              title="Biên bản nghiệm thu"
            >
              <template #header-actions>
                <div class="flex items-center gap-2">
                  <UBadge
                    v-if="acceptanceReport?.is_confirmed"
                    color="success"
                    variant="subtle"
                    size="xs"
                    icon="i-lucide-check-circle"
                    label="Cư dân đã xác nhận"
                  />
                  <UBadge
                    v-else
                    color="warning"
                    variant="subtle"
                    size="xs"
                    icon="i-lucide-clock"
                    label="Chờ xác nhận"
                  />
                  <UBadge
                    v-if="acceptanceReport?.has_signed_file"
                    color="primary"
                    variant="subtle"
                    size="xs"
                    icon="i-lucide-file-signature"
                    label="Đã có bản ký"
                  />
                </div>
              </template>

              <div class="flex flex-col gap-3">
                <UAlert
                  v-if="acceptanceReport?.is_confirmed && acceptanceReport?.confirmed_signature_name"
                  color="success"
                  variant="subtle"
                  icon="i-lucide-user-check"
                  :title="`${acceptanceReport.confirmed_signature_name} đã xác nhận online`"
                  :description="acceptanceReport.confirmed_at
                    ? `Thời điểm: ${formatDateTime(acceptanceReport.confirmed_at)}${acceptanceReport.confirmed_note ? ` — ${acceptanceReport.confirmed_note}` : ''}`
                    : undefined"
                />

                <div
                  v-if="acceptanceReport?.has_signed_file && acceptanceReport?.signed_file_url"
                  class="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/50"
                >
                  <div class="size-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                    <UIcon
                      name="i-lucide-file-check"
                      class="text-emerald-500 size-5"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-slate-800 truncate">
                      {{ acceptanceReport.signed_file_original_name ?? 'Biên bản đã ký' }}
                    </p>
                    <p class="text-xs text-slate-500 mt-0.5">
                      {{ formatFileSize(Number(acceptanceReport.signed_file_size) || 0) }}
                      <template v-if="acceptanceReport.signed_uploaded_at">
                        &middot; Tải lên {{ formatDateTime(acceptanceReport.signed_uploaded_at) }}
                      </template>
                    </p>
                  </div>
                  <UButton
                    :to="acceptanceReport.signed_file_url"
                    target="_blank"
                    icon="i-lucide-external-link"
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    label="Xem"
                  />
                </div>

                <UAlert
                  v-else
                  color="neutral"
                  variant="subtle"
                  icon="i-lucide-file-warning"
                  title="Chưa có bản ký giấy"
                  description="Sau khi cư dân ký trên giấy, hãy tải lên bản scan/ảnh qua nút bên dưới."
                />

                <div class="flex justify-end">
                  <UButton
                    icon="i-lucide-clipboard-check"
                    color="primary"
                    variant="soft"
                    size="sm"
                    label="Mở biên bản"
                    @click="showAcceptanceReport = true"
                  />
                </div>
              </div>
            </SharedSectionCard>

            <!-- Empty placeholder for Nghiệm thu tab when no order yet -->
            <div
              v-if="!hasAcceptanceReportOrder"
              class="bg-white border border-dashed border-slate-200 rounded-xl p-8 text-center"
            >
              <UIcon
                name="i-lucide-clipboard-check"
                class="size-6 text-slate-300 mx-auto mb-3"
              />
              <p class="text-sm text-slate-500 font-medium mb-1">
                Chưa có biên bản nghiệm thu
              </p>
              <p class="text-xs text-slate-400">
                Biên bản sẽ xuất hiện sau khi có đơn hàng được nghiệm thu.
              </p>
            </div>
          </div>
          <!-- ═══ END TAB: NGHIỆM THU ═══ -->

          <!-- ═══ TAB: BẢO HÀNH ═══ -->
          <div
            v-show="mainTab === 'warranty'"
            class="flex flex-col gap-6"
          >
            <div
              v-if="warrantyRequests.length === 0"
              class="bg-white border border-dashed border-slate-200 rounded-xl p-10 text-center"
            >
              <div class="size-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
                <UIcon
                  name="i-lucide-shield-check"
                  class="size-6 text-slate-300"
                />
              </div>
              <p class="text-sm font-semibold text-slate-600 mb-1">
                Không có yêu cầu bảo hành
              </p>
              <p class="text-xs text-slate-400">
                Cư dân có thể gửi yêu cầu bảo hành trong 12 tháng sau khi đơn hàng hoàn tất.
              </p>
            </div>

            <!-- ─── Yêu cầu bảo hành từ cư dân ─── -->
            <SharedSectionCard
              v-if="warrantyRequests.length > 0"
              title="Yêu cầu bảo hành"
            >
              <template #header-actions>
                <UBadge
                  :label="`${warrantyRequests.length}`"
                  color="warning"
                  variant="subtle"
                  size="xs"
                />
              </template>

              <div class="flex flex-col gap-4">
                <div
                  v-for="wr in warrantyRequests"
                  :key="wr.id"
                  class="border border-slate-200 rounded-lg p-4"
                >
                  <div class="flex items-start justify-between gap-3 mb-2">
                    <div class="flex items-center gap-2 min-w-0">
                      <UIcon
                        name="i-lucide-shield-alert"
                        class="size-4 text-amber-500 shrink-0"
                      />
                      <span class="font-semibold text-sm text-slate-900 truncate">{{ wr.subject }}</span>
                    </div>
                    <span class="text-[11px] text-slate-400 whitespace-nowrap shrink-0">
                      {{ formatDateTime(wr.created_at) }}
                    </span>
                  </div>

                  <p class="text-xs text-slate-500 mb-1">
                    Người yêu cầu: <span class="font-medium text-slate-700">{{ wr.requester_name }}</span>
                  </p>

                  <p class="text-sm text-slate-700 whitespace-pre-line mt-2">
                    {{ wr.description }}
                  </p>

                  <!-- Warranty attachments -->
                  <div
                    v-if="wr.attachments.length > 0"
                    class="mt-3 pt-3 border-t border-slate-100"
                  >
                    <div class="flex items-center gap-1.5 mb-2">
                      <UIcon
                        name="i-lucide-paperclip"
                        class="size-3.5 text-slate-400"
                      />
                      <span class="text-xs text-slate-500">Tệp đính kèm ({{ wr.attachments.length }})</span>
                    </div>
                    <div class="flex flex-col gap-1.5">
                      <a
                        v-for="att in wr.attachments"
                        :key="att.id"
                        :href="att.url ?? undefined"
                        target="_blank"
                        class="flex items-center gap-2.5 rounded-md border border-slate-200 px-2.5 py-1.5 hover:bg-slate-50 transition-colors"
                      >
                        <div
                          class="size-6 rounded flex items-center justify-center shrink-0"
                          :class="isImageMime(att.mime_type) ? 'bg-violet-100' : 'bg-amber-100'"
                        >
                          <UIcon
                            :name="isImageMime(att.mime_type) ? 'i-lucide-image' : 'i-lucide-file-text'"
                            class="size-3.5"
                            :class="isImageMime(att.mime_type) ? 'text-violet-500' : 'text-amber-600'"
                          />
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-xs font-medium text-slate-700 truncate">{{ att.original_name }}</p>
                          <p class="text-[10px] text-slate-400">{{ formatFileSize(att.size_bytes) }}</p>
                        </div>
                        <UIcon
                          name="i-lucide-download"
                          class="size-3.5 text-slate-400"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </SharedSectionCard>
          </div>
          <!-- ═══ END TAB: BẢO HÀNH ═══ -->
        </div>

        <!-- ═══ RIGHT SIDEBAR ═══ -->
        <div class="flex flex-col gap-4 lg:sticky lg:top-4 lg:self-start">
          <!-- Thông tin xử lý -->
          <SharedSectionCard
            title="Thông tin xử lý"
            compact
          >
            <div class="flex flex-col gap-3">
              <SharedFieldDisplay label="Trạng thái">
                <UBadge
                  :label="ogTicket.status.label"
                  :color="ogTicketStatusColor(ogTicket.status.value)"
                  variant="subtle"
                  size="sm"
                />
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Ưu tiên">
                <UBadge
                  :label="ogTicket.priority.label"
                  :color="ogTicketPriorityColor(ogTicket.priority.value)"
                  variant="soft"
                  size="sm"
                />
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Người tiếp nhận">
                {{ ogTicket.received_by?.name ?? '—' }}
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Người thi công">
                <template v-if="ogTicket.assignees?.length">
                  <div class="flex flex-col gap-1">
                    <div
                      v-for="a in ogTicket.assignees"
                      :key="a.id"
                      class="flex items-center gap-2"
                    >
                      <span>{{ a.name }}</span>
                      <SharedCapabilityRatingBadge
                        :rating="a.capability_rating"
                        size="xs"
                      />
                    </div>
                  </div>
                </template>
                <span v-else>—</span>
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Nhận lúc">
                {{ formatDateTime(ogTicket.received_at) }}
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Hạn SLA Hoàn thành">
                <span
                  v-if="ogTicket.sla_completion_due_at"
                  :class="isSlaCompletionViolated ? 'text-red-600 font-semibold' : ''"
                >
                  {{ formatDateTime(ogTicket.sla_completion_due_at) }}
                  <span
                    v-if="isSlaCompletionViolated"
                    class="text-red-500 text-xs"
                  >(Quá hạn)</span>
                </span>
                <span
                  v-else
                  class="text-slate-400"
                >—</span>
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Cập nhật lúc">
                {{ formatDateTime(ogTicket.updated_at) }}
              </SharedFieldDisplay>
            </div>

            <div
              v-if="ogTicket.internal_note"
              class="border-t border-slate-100 pt-3 mt-3"
            >
              <SharedFieldDisplay label="Ghi chú nội bộ">
                <span class="whitespace-pre-line text-xs">{{ ogTicket.internal_note }}</span>
              </SharedFieldDisplay>
            </div>
          </SharedSectionCard>

          <!-- ─── Mã QR cho cư dân ─── -->
          <SharedSectionCard
            v-if="ticketCode"
            title="Mã QR cho cư dân"
            compact
          >
            <div class="flex flex-col gap-3">
              <SharedQrCode
                ref="qrCodeRef"
                :value="absoluteResidentUrl"
                :size="180"
                :file-name="`ticket-${ticketCode}.png`"
              />
              <p class="font-mono text-xs text-slate-500 break-all text-center">
                {{ absoluteResidentUrl }}
              </p>
              <div class="grid grid-cols-3 gap-2">
                <UButton
                  icon="i-lucide-copy"
                  label="Sao chép"
                  color="neutral"
                  variant="soft"
                  size="xs"
                  block
                  @click="copyResidentUrl"
                />
                <UButton
                  icon="i-lucide-download"
                  label="Tải QR"
                  color="neutral"
                  variant="soft"
                  size="xs"
                  block
                  @click="downloadResidentQr"
                />
                <UButton
                  icon="i-lucide-external-link"
                  label="Mở tab"
                  color="neutral"
                  variant="soft"
                  size="xs"
                  block
                  :to="residentTicketPath"
                  target="_blank"
                  rel="noopener"
                />
              </div>
              <p class="text-xs text-slate-400 leading-relaxed">
                Cư dân quét mã để xem thông tin yêu cầu, duyệt báo giá và đánh giá dịch vụ.
              </p>
            </div>
          </SharedSectionCard>

          <!-- Lịch sử thay đổi (Audit) — collapsible to keep sidebar compact -->
          <div
            v-if="audits.length > 0"
            class="bg-white border border-border-gray rounded-xl shadow-sm overflow-hidden"
          >
            <button
              type="button"
              class="w-full px-5 py-3.5 border-b border-border-gray flex items-center justify-between gap-2 cursor-pointer hover:bg-slate-50/50 transition-colors"
              :class="{ 'border-b-0': !showAuditHistory }"
              @click="showAuditHistory = !showAuditHistory"
            >
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-lucide-history"
                  class="size-4 text-slate-400"
                />
                <h2 class="font-bold text-slate-900 text-sm">
                  Lịch sử thay đổi
                </h2>
                <UBadge
                  :label="String(audits.length)"
                  color="neutral"
                  variant="subtle"
                  size="xs"
                />
              </div>
              <UIcon
                :name="showAuditHistory ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                class="size-4 text-slate-400"
              />
            </button>
            <div
              v-show="showAuditHistory"
              class="px-5 py-4 max-h-[500px] overflow-y-auto"
            >
              <div class="relative">
                <div class="absolute top-0 bottom-0 left-2.5 w-px bg-slate-200" />
                <div
                  v-for="audit in audits"
                  :key="audit.id"
                  class="relative flex gap-3 pb-4 last:pb-0"
                >
                  <div class="relative z-10 flex items-center justify-center size-5 rounded-full bg-white border-2 border-slate-300 shrink-0">
                    <div class="size-1.5 rounded-full bg-slate-400" />
                  </div>
                  <div class="flex-1 min-w-0 -mt-0.5">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <UBadge
                        :label="AUDIT_EVENT_LABELS[audit.event] ?? audit.event"
                        :color="AUDIT_EVENT_COLORS[audit.event] ?? 'neutral'"
                        variant="subtle"
                        size="xs"
                      />
                    </div>
                    <p class="text-[11px] text-slate-500 mt-0.5">
                      <span v-if="audit.user">{{ audit.user.name }} · </span>
                      {{ formatDateTime(audit.created_at) }}
                    </p>
                    <!-- Changed fields -->
                    <div
                      v-if="audit.event !== 'created'"
                      class="mt-1.5 flex flex-col gap-1"
                    >
                      <div
                        v-for="change in getChangedFields(audit)"
                        :key="change.field"
                        class="text-[11px] leading-relaxed"
                      >
                        <span class="font-medium text-slate-600">{{ change.field }}:</span>
                        <span class="text-red-500 line-through ml-1">{{ change.old }}</span>
                        <UIcon
                          name="i-lucide-arrow-right"
                          class="size-3 text-slate-400 mx-0.5 inline-block align-middle"
                        />
                        <span class="text-emerald-600">{{ change.new }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ DIALOGS ═══ -->
    <SharedOrderAcceptanceReportModal
      v-if="acceptanceReportOrderId"
      v-model:open="showAcceptanceReport"
      :order-id="acceptanceReportOrderId"
    />

    <SharedOgTicketCreateOrderModal
      v-model:open="showCreateOrderModal"
      :og-ticket-subject="ogTicket?.subject ?? ''"
      :og-ticket-code="ogTicket?.code ?? null"
      :quote="activeQuote"
      @created="handleOrderCreated"
    />

    <SharedCrudDeleteModal
      v-model:open="showDeleteDialog"
      title="Huỷ OG Ticket"
      :item-name="deleteTarget?.subject ?? ogTicket?.subject"
      :description="deleteWarning"
      :checking="isCheckingDelete"
      :blocked-message="deleteBlockedMessage"
      :loading="isDeleting"
      @confirm="handleDelete"
    />

    <UModal
      v-model:open="showReleaseDialog"
      title="Trả ticket về pool?"
    >
      <template #body>
        <div
          v-if="isCheckingRelease"
          class="flex items-center justify-center py-4"
        >
          <UIcon
            name="i-lucide-loader-2"
            class="animate-spin text-slate-400"
          />
          <span class="ml-2 text-sm text-slate-500">Đang kiểm tra...</span>
        </div>

        <template v-else-if="releaseBlockedMessage">
          <UAlert
            icon="i-lucide-ban"
            color="error"
            variant="subtle"
            :description="releaseBlockedMessage"
          />
        </template>

        <template v-else>
          <p class="text-slate-700 mb-4">
            {{ deleteWarning }}
          </p>
          <div>
            <p class="text-sm font-medium text-slate-700 mb-1.5">
              Lý do (không bắt buộc)
            </p>
            <UTextarea
              v-model="releaseNote"
              placeholder="Nhập lý do trả lại..."
              :rows="3"
              class="w-full"
            />
          </div>
        </template>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton
            :label="releaseBlockedMessage ? 'Đóng' : 'Hủy'"
            color="neutral"
            variant="ghost"
            @click="showReleaseDialog = false"
          />
          <UButton
            v-if="!releaseBlockedMessage && !isCheckingRelease"
            label="Xác nhận trả lại"
            color="error"
            :loading="isReleasing"
            @click="handleRelease"
          />
        </div>
      </template>
    </UModal>

    <!-- ═══ SLA UPDATE MODAL ═══ -->
    <UModal
      :open="showSlaModal"
      title="Cập nhật SLA"
      :ui="{ body: 'overflow-y-visible', content: 'overflow-visible' }"
      @update:open="(v) => showSlaModal = v"
    >
      <template #body>
        <div class="space-y-4">
          <div>
            <p class="text-sm font-medium text-slate-700 mb-1.5">
              Hạn SLA Báo giá
            </p>
            <VueDatePicker
              v-model="slaForm.sla_quote_due_at"
              model-type="yyyy-MM-dd HH:mm:ss"
              :enable-time-picker="true"
              :is24="true"
              placeholder="Chọn ngày giờ"
              :clearable="true"
            />
          </div>
          <div>
            <p class="text-sm font-medium text-slate-700 mb-1.5">
              Hạn SLA Hoàn thành
            </p>
            <VueDatePicker
              v-model="slaForm.sla_completion_due_at"
              model-type="yyyy-MM-dd HH:mm:ss"
              :enable-time-picker="true"
              :is24="true"
              placeholder="Chọn ngày giờ"
              :clearable="true"
            />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton
            label="Huỷ"
            color="neutral"
            variant="ghost"
            @click="showSlaModal = false"
          />
          <UButton
            label="Lưu"
            icon="i-lucide-check"
            color="primary"
            :loading="isSlaUpdating"
            @click="handleSlaUpdate"
          />
        </div>
      </template>
    </UModal>

    <SharedOgTicketCategoryModal
      v-if="ogTicket"
      v-model:open="categoriesModalOpen"
      :og-ticket-id="ogTicket.id"
      :selected-ids="selectedCategoryIds"
      @saved="handleCategoriesSaved"
    />
  </div>
</template>
