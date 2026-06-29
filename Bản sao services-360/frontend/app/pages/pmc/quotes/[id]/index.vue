<script setup lang="ts">
import type { TableColumn, StepperItem } from '@nuxt/ui'
import type {
  QuoteDetailResource,
  QuoteLineResource
} from '#api/generated/laravel'
import type { QuoteAudit } from '~/composables/api/useQuotes'

definePageMeta({ layout: 'default' })

const route = useRoute()
const id = computed(() => Number(route.params.id))

const { data, status, error, refresh } = useQuoteDetail(id)
const quote = computed<QuoteDetailResource | undefined>(() => data.value?.data)

// ─── Quote versions ───
const ogTicketId = computed(() => quote.value?.og_ticket?.id ?? null)
const { data: versionsData } = useQuoteVersions(ogTicketId)
const versions = computed<QuoteDetailResource[]>(() => versionsData.value?.data ?? [])

// ─── Audit history ───
const { data: auditsData } = useQuoteAudits(id)
const audits = computed<QuoteAudit[]>(() => auditsData.value?.data ?? [])

const QUOTE_AUDIT_FIELD_LABELS: Record<string, string> = {
  status: 'Trạng thái',
  is_active: 'Active',
  total_amount: 'Tổng tiền',
  note: 'Ghi chú',
  manager_approved_at: 'QL duyệt lúc',
  manager_approved_by_id: 'QL duyệt bởi',
  resident_approved_at: 'Cư dân chấp thuận lúc',
  og_ticket_id: 'OG Ticket',
  code: 'Mã'
}

const QUOTE_AUDIT_DATETIME_FIELDS = new Set(['manager_approved_at', 'resident_approved_at'])

function getChangedFields(audit: QuoteAudit) {
  return getAuditChangedFields(audit, QUOTE_AUDIT_FIELD_LABELS, QUOTE_AUDIT_DATETIME_FIELDS)
}

useSeoMeta({
  title: computed(() =>
    quote.value ? `${quote.value.code} - Báo giá` : 'Chi tiết báo giá'
  )
})

// ─── Computed flags ───
const isDraft = computed(() => quote.value?.status.value === 'draft')
const isActive = computed(() => quote.value?.is_active === true)
const canEdit = computed(() => isActive.value && quote.value?.status.value !== 'approved')

// ─── Workflow stepper ───
const isRejected = computed(() => {
  const s = quote.value?.status.value
  return s ? isQuoteRejected(s) : false
})

// Khi rejected: xác định step bị từ chối
const rejectedStepValue = computed(() => {
  if (!isRejected.value) return null
  return quote.value?.status.value === 'resident_rejected' ? 'approved' : 'manager_approved'
})

const workflowSteps = computed<StepperItem[]>(() =>
  QUOTE_WORKFLOW_STEPS.map(step => ({
    title: step.title,
    description: step.description,
    icon: step.value === rejectedStepValue.value ? 'i-lucide-x-circle' : step.icon,
    value: step.value
  }))
)

const currentStepValue = computed(() => {
  if (!quote.value) return 'draft'
  if (isRejected.value) return rejectedStepValue.value ?? 'draft'
  return quote.value.status.value
})

// ─── Lines table ───
const lineColumns: TableColumn<QuoteLineResource>[] = [
  { accessorKey: 'name', header: 'Hạng mục' },
  { id: 'line_type', header: 'Loại' },
  { accessorKey: 'quantity', header: 'SL' },
  { accessorKey: 'unit', header: 'ĐVT' },
  { id: 'unit_price', header: 'Đơn giá' },
  { id: 'line_amount', header: 'Thành tiền' }
]

// ─── Transitions (shared composable) ───
const {
  isTransitioning, showRejectModal, rejectNote,
  handleTransition, openRejectModal, confirmReject
} = useQuoteTransition(id, { onSuccess: () => refresh() })

// ─── Delete (with check) ───
const crud = useCrudModals<QuoteDetailResource>()
const { showDeleteModal, deleteTarget } = crud
const { isDeleting, submitDelete } = useCrudSubmit(crud, refresh)

const { isCheckingDelete, deleteBlockedMessage, openDeleteModal, handleDelete } = useCheckDelete({
  crud,
  submitDelete,
  checkFn: apiCheckDeleteQuote,
  deleteFn: apiDeleteQuote,
  successMessage: 'Đã xoá báo giá',
  navigateAfter: '/pmc/quotes'
})

// ─── Create Order ───
const toast = useToast()
const canCreateOrder = computed(() =>
  isActive.value && quote.value?.status.value === 'approved' && !quote.value?.order
)
const showCreateOrderModal = ref(false)
const orderNote = ref('')
const isCreatingOrder = ref(false)

async function handleCreateOrder() {
  if (!quote.value) return
  isCreatingOrder.value = true
  try {
    const order = await apiCreateOrder({ quote_id: quote.value.id, note: orderNote.value || undefined })
    showCreateOrderModal.value = false
    orderNote.value = ''
    toast.add({ title: 'Đã tạo đơn hàng', color: 'success' })
    navigateTo(`/pmc/orders/${order.data.id}`)
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Tạo đơn hàng thất bại'), color: 'error' })
  } finally {
    isCreatingOrder.value = false
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
          to="/pmc/quotes"
          class="shrink-0"
        />
        <div class="min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <h1 class="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
              Chi tiết báo giá
            </h1>
            <template v-if="quote">
              <UBadge
                :label="quote.status.label"
                :color="quoteStatusColor(quote.status.value)"
                variant="subtle"
                size="sm"
              />
              <UBadge
                :label="quote.is_active ? 'Active' : 'Inactive'"
                :color="quote.is_active ? 'success' : 'neutral'"
                variant="subtle"
                size="sm"
              />
            </template>
          </div>
          <p class="text-slate-500 text-sm mt-0.5">
            <span
              v-if="quote"
              class="font-mono font-semibold"
            >{{ quote.code }}</span>
            <span v-else>...</span>
          </p>
        </div>
      </div>

      <!-- Desktop actions -->
      <div
        v-if="quote"
        class="hidden sm:flex items-center gap-2 shrink-0"
      >
        <UButton
          v-if="canEdit"
          label="Chỉnh sửa"
          icon="i-lucide-pencil"
          color="primary"
          variant="soft"
          size="sm"
          :to="`/pmc/quotes/${id}/edit`"
        />
        <UButton
          v-if="isActive"
          icon="i-lucide-trash-2"
          label="Xoá"
          color="error"
          variant="outline"
          size="sm"
          @click="openDeleteModal(quote!)"
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
      v-else-if="quote"
      class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6"
    >
      <!-- LEFT: Main content -->
      <div class="lg:col-span-2 flex flex-col gap-4 sm:gap-6">
        <!-- Alerts -->
        <UAlert
          v-if="!isActive"
          icon="i-lucide-alert-triangle"
          color="warning"
          variant="subtle"
          title="Báo giá này đã bị thay thế bởi báo giá mới."
        />
        <UAlert
          v-if="isRejected && quote.note"
          icon="i-lucide-x-circle"
          color="error"
          variant="subtle"
          title="Lý do từ chối"
          :description="quote.note"
        />

        <!-- Giai đoạn báo giá (Stepper) -->
        <SharedSectionCard title="Giai đoạn báo giá">
          <div class="overflow-x-auto -mx-1 px-1">
            <UStepper
              :items="workflowSteps"
              :model-value="currentStepValue"
              disabled
              :linear="false"
              size="sm"
              :color="isRejected ? 'error' : 'primary'"
              :ui="isRejected ? {
                trigger: 'group-data-[state=completed]:bg-primary group-data-[state=completed]:text-inverted',
                separator: 'group-data-[state=completed]:bg-primary'
              } : undefined"
              class="w-full min-w-[400px]"
            />
          </div>
        </SharedSectionCard>

        <!-- Thông tin nguồn -->
        <SharedSectionCard title="Thông tin nguồn">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <SharedFieldDisplay
              v-if="quote.og_ticket"
              label="Ticket"
            >
              <NuxtLink
                :to="`/pmc/og-tickets/${quote.og_ticket.id}`"
                class="text-primary hover:underline font-medium"
              >
                {{ quote.og_ticket.subject }}
              </NuxtLink>
            </SharedFieldDisplay>
            <SharedFieldDisplay
              v-if="quote.og_ticket"
              label="Khách hàng"
            >
              <NuxtLink
                v-if="quote.og_ticket.customer"
                :to="`/pmc/customers/${quote.og_ticket.customer.id}`"
                class="font-medium text-primary-600 hover:underline"
              >
                {{ quote.og_ticket.customer.full_name }}
              </NuxtLink>
              <span v-else>{{ quote.og_ticket.requester_name }}</span>
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Tạo lúc">
              {{ formatDateTime(quote.created_at) }}
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Cập nhật lúc">
              {{ formatDateTime(quote.updated_at) }}
            </SharedFieldDisplay>
            <SharedFieldDisplay
              v-if="quote.manager_approved_at"
              label="QL duyệt lúc"
            >
              {{ formatDateTime(quote.manager_approved_at) }}
              <span
                v-if="quote.manager_approved_by"
                class="text-slate-500"
              >
                — {{ quote.manager_approved_by.name }}
              </span>
            </SharedFieldDisplay>
            <SharedFieldDisplay
              v-if="quote.resident_approved_at"
              label="Cư dân chấp thuận lúc"
            >
              <div class="flex flex-wrap items-center gap-2">
                <span>{{ formatDateTime(quote.resident_approved_at) }}</span>
                <UBadge
                  v-if="quote.resident_approved_via"
                  :label="quote.resident_approved_via.label"
                  :color="quote.resident_approved_via.value === 'resident_self' ? 'success' : 'warning'"
                  variant="subtle"
                  size="xs"
                />
                <span
                  v-if="quote.resident_approved_by"
                  class="text-slate-500"
                >
                  — {{ quote.resident_approved_by.name }}
                </span>
              </div>
            </SharedFieldDisplay>
            <SharedFieldDisplay
              v-if="quote.order"
              label="Đơn hàng"
            >
              <div class="flex items-center gap-2">
                <NuxtLink
                  :to="`/pmc/orders/${quote.order.id}`"
                  class="text-primary hover:underline font-mono text-sm font-medium"
                >
                  {{ quote.order.code }}
                </NuxtLink>
                <UBadge
                  :label="quote.order.status.label"
                  :color="orderStatusColor(quote.order.status.value)"
                  variant="subtle"
                  size="xs"
                />
              </div>
            </SharedFieldDisplay>
            <SharedFieldDisplay
              v-else-if="canCreateOrder"
              label="Đơn hàng"
            >
              <UButton
                label="Tạo đơn hàng"
                icon="i-lucide-plus"
                size="xs"
                color="primary"
                variant="soft"
                @click="showCreateOrderModal = true"
              />
            </SharedFieldDisplay>
          </div>
        </SharedSectionCard>

        <!-- Dòng báo giá -->
        <SharedSectionCard title="Dòng báo giá">
          <!-- Mobile: card list -->
          <div class="sm:hidden flex flex-col gap-3">
            <div
              v-for="line in quote.lines"
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
              :data="quote.lines"
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
              <template #line_amount-cell="{ row }">
                <span class="font-medium">{{ formatCurrency(row.original.line_amount) }}</span>
              </template>
            </UTable>
          </div>
        </SharedSectionCard>

        <!-- Tổng kết -->
        <SharedSectionCard title="Tổng kết">
          <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-slate-600">Tổng tiền</span>
              <span class="text-lg font-bold text-slate-900">
                {{ formatCurrency(quote.total_amount) }}
              </span>
            </div>
            <SharedFieldDisplay
              v-if="quote.note"
              label="Ghi chú"
            >
              <span class="whitespace-pre-line">{{ quote.note }}</span>
            </SharedFieldDisplay>
          </div>
        </SharedSectionCard>

        <!-- Phiên bản báo giá -->
        <SharedSectionCard
          v-if="versions.length > 1"
          title="Phiên bản báo giá"
        >
          <div class="flex flex-col gap-4">
            <div
              v-for="(ver, idx) in versions"
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
                    :class="ver.id === id ? 'text-primary' : 'text-slate-700'"
                  >
                    {{ ver.code }}
                  </NuxtLink>
                  <UBadge
                    v-if="ver.is_active"
                    label="Còn hiệu lực"
                    color="success"
                    variant="subtle"
                    size="xs"
                  />
                  <UBadge
                    v-else
                    label="Đã thay thế"
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
        <!-- Hành động duyệt (desktop only — mobile uses sticky bar) -->
        <SharedSectionCard
          v-if="isActive"
          title="Hành động"
          compact
          class="hidden lg:block"
        >
          <!-- draft → sent -->
          <div
            v-if="quote.status.value === 'draft'"
            class="flex flex-col gap-2"
          >
            <UButton
              label="Gửi báo giá"
              icon="i-lucide-send"
              color="primary"
              class="w-full"
              :loading="isTransitioning"
              @click="handleTransition('sent')"
            />
          </div>

          <!-- sent → manager_approved / rejected -->
          <div
            v-else-if="quote.status.value === 'sent'"
            class="flex flex-col gap-2"
          >
            <UButton
              label="Quản lý duyệt"
              icon="i-lucide-user-check"
              color="primary"
              class="w-full"
              :loading="isTransitioning"
              @click="handleTransition('manager_approved')"
            />
            <UButton
              label="Quản lý từ chối"
              icon="i-lucide-x-circle"
              color="error"
              variant="outline"
              class="w-full"
              :loading="isTransitioning"
              @click="openRejectModal"
            />
          </div>

          <!-- manager_approved → approved / rejected -->
          <div
            v-else-if="quote.status.value === 'manager_approved'"
            class="flex flex-col gap-2"
          >
            <UButton
              label="Cư dân chấp thuận"
              icon="i-lucide-check-circle"
              color="success"
              class="w-full"
              :loading="isTransitioning"
              @click="handleTransition('approved')"
            />
            <UButton
              label="Cư dân từ chối"
              icon="i-lucide-x-circle"
              color="error"
              variant="outline"
              class="w-full"
              :loading="isTransitioning"
              @click="openRejectModal"
            />
          </div>

          <!-- approved / rejected → no actions -->
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
                :label="quote.status.label"
                :color="quoteStatusColor(quote.status.value)"
                variant="subtle"
                size="sm"
              />
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Active">
              <UBadge
                :label="quote.is_active ? 'Active' : 'Inactive'"
                :color="quote.is_active ? 'success' : 'neutral'"
                variant="subtle"
                size="sm"
              />
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Số dòng">
              {{ quote.lines.length }}
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Tạo lúc">
              {{ formatDateTime(quote.created_at) }}
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Cập nhật lúc">
              {{ formatDateTime(quote.updated_at) }}
            </SharedFieldDisplay>
          </div>
        </SharedSectionCard>

        <!-- Lịch sử thay đổi (Audit) -->
        <SharedSectionCard
          v-if="audits.length > 0"
          title="Lịch sử thay đổi"
          compact
        >
          <div class="max-h-[500px] overflow-y-auto">
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
        </SharedSectionCard>
      </div>
    </div>

    <!-- ═══ MOBILE STICKY ACTION BAR ═══ -->
    <div
      v-if="quote && isActive"
      class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 px-4 py-3 lg:hidden z-50"
    >
      <!-- draft → sent -->
      <div
        v-if="quote.status.value === 'draft'"
        class="flex items-center gap-2"
      >
        <UButton
          label="Gửi báo giá"
          icon="i-lucide-send"
          color="primary"
          class="flex-1"
          :loading="isTransitioning"
          @click="handleTransition('sent')"
        />
        <UButton
          v-if="canEdit"
          icon="i-lucide-pencil"
          color="neutral"
          variant="outline"
          :to="`/pmc/quotes/${id}/edit`"
        />
        <UButton
          icon="i-lucide-trash-2"
          color="error"
          variant="outline"
          @click="openDeleteModal(quote!)"
        />
      </div>

      <!-- sent → manager_approved / rejected -->
      <div
        v-else-if="quote.status.value === 'sent'"
        class="flex items-center gap-2"
      >
        <UButton
          label="Quản lý duyệt"
          icon="i-lucide-user-check"
          color="primary"
          class="flex-1"
          :loading="isTransitioning"
          @click="handleTransition('manager_approved')"
        />
        <UButton
          icon="i-lucide-x-circle"
          color="error"
          variant="outline"
          :loading="isTransitioning"
          @click="openRejectModal"
        />
        <UButton
          v-if="canEdit"
          icon="i-lucide-pencil"
          color="neutral"
          variant="outline"
          :to="`/pmc/quotes/${id}/edit`"
        />
      </div>

      <!-- manager_approved → approved / rejected -->
      <div
        v-else-if="quote.status.value === 'manager_approved'"
        class="flex items-center gap-2"
      >
        <UButton
          label="Cư dân chấp thuận"
          icon="i-lucide-check-circle"
          color="success"
          class="flex-1"
          :loading="isTransitioning"
          @click="handleTransition('approved')"
        />
        <UButton
          icon="i-lucide-x-circle"
          color="error"
          variant="outline"
          :loading="isTransitioning"
          @click="openRejectModal"
        />
      </div>

      <!-- approved / no actions: just edit/delete -->
      <div
        v-else-if="canEdit"
        class="flex items-center gap-2"
      >
        <UButton
          label="Chỉnh sửa"
          icon="i-lucide-pencil"
          color="primary"
          variant="soft"
          class="flex-1"
          :to="`/pmc/quotes/${id}/edit`"
        />
      </div>
    </div>

    <!-- ═══ DIALOGS ═══ -->

    <!-- Delete -->
    <SharedCrudDeleteModal
      v-model:open="showDeleteModal"
      title="Xoá báo giá"
      :item-name="deleteTarget?.code ?? quote?.code"
      description="Báo giá sẽ bị ngưng hiệu lực."
      :checking="isCheckingDelete"
      :blocked-message="deleteBlockedMessage"
      :loading="isDeleting"
      @confirm="handleDelete"
    />

    <!-- Create Order -->
    <UModal
      v-model:open="showCreateOrderModal"
      title="Tạo đơn hàng"
    >
      <template #body>
        <p class="text-sm text-slate-600 mb-4">
          Tạo đơn hàng từ báo giá <strong>{{ quote?.code }}</strong>
        </p>
        <UFormField label="Ghi chú (không bắt buộc)">
          <UTextarea
            v-model="orderNote"
            placeholder="Nhập ghi chú..."
            :rows="3"
            class="w-full"
          />
        </UFormField>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton
            label="Hủy"
            color="neutral"
            variant="ghost"
            @click="showCreateOrderModal = false"
          />
          <UButton
            label="Tạo đơn hàng"
            icon="i-lucide-plus"
            color="primary"
            :loading="isCreatingOrder"
            @click="handleCreateOrder"
          />
        </div>
      </template>
    </UModal>

    <!-- Reject -->
    <UModal
      v-model:open="showRejectModal"
      title="Từ chối báo giá"
    >
      <template #body>
        <p class="text-slate-700 mb-4">
          Vui lòng nhập lý do từ chối (không bắt buộc).
        </p>
        <UTextarea
          v-model="rejectNote"
          placeholder="Lý do từ chối..."
          :rows="3"
          class="w-full"
        />
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton
            label="Hủy"
            color="neutral"
            variant="ghost"
            @click="showRejectModal = false"
          />
          <UButton
            label="Từ chối"
            color="error"
            :loading="isTransitioning"
            @click="confirmReject(quote!.status.value)"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
