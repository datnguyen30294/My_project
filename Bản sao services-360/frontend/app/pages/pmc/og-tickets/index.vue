<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { OgTicketItem, OgTicketFilters } from '~/composables/api/useOgTickets'
import type { UpdateOgTicketRequestPriority } from '#api/generated/laravel'
import type { BadgeColor } from '~/utils/badge'

definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'OG Ticket - Thần Nông' })

const params = reactive<OgTicketFilters>({ per_page: DEFAULT_PER_PAGE })
const page = ref(1)

const { searchInput, onSearch } = useTableSearch((value) => {
  params.search = value || undefined
  page.value = 1
})

const selectedStatus = ref<string | undefined>(undefined)
const selectedPriority = ref<string | undefined>(undefined)
const selectedWarranty = ref<string | undefined>(undefined)

const { isInitFromUrl } = useUrlFilters({
  search: { ref: toRef(params, 'search'), type: 'string', onInit: (v) => { searchInput.value = String(v) } },
  page: { ref: page, type: 'number', defaultValue: 1 },
  status: { ref: selectedStatus, type: 'string', onInit: (v) => { params.status = String(v) as OgTicketFilters['status'] } },
  priority: { ref: selectedPriority, type: 'string', onInit: (v) => { params.priority = String(v) as OgTicketFilters['priority'] } },
  warranty: { ref: selectedWarranty, type: 'string', onInit: (v) => { params.has_warranty_request = String(v) === '1' } }
})

watch(selectedStatus, (val) => {
  params.status = (val || undefined) as OgTicketFilters['status']
  if (!isInitFromUrl.value) page.value = 1
})

watch(selectedPriority, (val) => {
  params.priority = (val || undefined) as OgTicketFilters['priority']
  if (!isInitFromUrl.value) page.value = 1
})

watch(selectedWarranty, (val) => {
  params.has_warranty_request = val === '1' ? true : val === '0' ? false : undefined
  if (!isInitFromUrl.value) page.value = 1
})

const statusOptions = OG_TICKET_STATUS_OPTIONS
const priorityOptions = OG_TICKET_PRIORITY_OPTIONS
const warrantyOptions = [
  { label: 'Có YC bảo hành', value: '1' },
  { label: 'Không có', value: '0' }
]

const hasFilters = computed(() => !!searchInput.value || !!selectedStatus.value || !!selectedPriority.value || !!selectedWarranty.value)

function clearFilters() {
  searchInput.value = ''
  params.search = undefined
  selectedStatus.value = undefined
  selectedPriority.value = undefined
  selectedWarranty.value = undefined
  page.value = 1
}

function toBadgeColor(color: string | undefined | null): BadgeColor {
  const allowed: BadgeColor[] = ['error', 'success', 'warning', 'info', 'primary', 'neutral', 'secondary']
  return (allowed as string[]).includes(color ?? '') ? (color as BadgeColor) : 'neutral'
}

const { data, status, error, refresh } = useOgTicketList(
  computed(() => ({ ...params, page: page.value }))
)

const ogTickets = computed<OgTicketItem[]>(() => data.value?.data ?? [])

const columns: TableColumn<OgTicketItem>[] = [
  { id: 'receive', header: 'Tiếp nhận' },
  { id: 'ticket', header: 'Ticket' },
  { id: 'customer', header: 'Khách hàng' },
  { id: 'project', header: 'Dự án' },
  { id: 'status', header: 'Trạng thái' },
  { id: 'payment', header: 'Thanh toán' },
  { id: 'reconciliation', header: 'Đối soát' },
  { id: 'feedback', header: 'Đánh giá' },
  stickyRight<OgTicketItem>({ id: 'actions', header: '' })
]

// --- CRUD ---
const crud = useCrudModals<OgTicketItem>()
const { showDeleteModal, deleteTarget } = crud
const { isDeleting, submitDelete } = useCrudSubmit(crud, refresh)

const { isCheckingDelete, deleteBlockedMessage, openDeleteModal, handleDelete } = useCheckDelete({
  crud,
  submitDelete,
  checkFn: apiCheckDeleteOgTicket,
  deleteFn: apiDeleteOgTicket,
  successMessage: 'Đã huỷ OG Ticket'
})

// --- Tiếp nhận nhanh ---
const { user: authUser } = useAuth()
const toast = useToast()
const receivingId = ref<number | null>(null)

async function handleReceive(ticket: OgTicketItem) {
  if (!authUser.value) return
  receivingId.value = ticket.id
  try {
    await apiUpdateOgTicket(ticket.id, {
      priority: ticket.priority.value as UpdateOgTicketRequestPriority,
      received_by_id: authUser.value.id
    })
    toast.add({ title: 'Đã tiếp nhận', color: 'success' })
    refresh()
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Tiếp nhận thất bại'), color: 'error' })
  } finally {
    receivingId.value = null
  }
}
</script>

<template>
  <div>
    <SharedCrudPageHeader
      title="OG Ticket"
      description="Danh sách ticket đang được xử lý bởi tổ chức của bạn"
    >
      <template #actions>
        <UButton
          icon="i-lucide-inbox"
          label="Ticket Pool"
          color="neutral"
          variant="ghost"
          to="/pmc/og-tickets/pool"
        />
        <UButton
          icon="i-lucide-plus"
          label="Tạo ticket"
          color="primary"
          to="/pmc/og-tickets/create"
        />
      </template>
    </SharedCrudPageHeader>

    <!-- Tìm kiếm & Lọc -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <UInput
        v-model="searchInput"
        icon="i-lucide-search"
        placeholder="Tìm theo tiêu đề, tên, SĐT..."
        class="max-w-sm"
        @update:model-value="onSearch"
      />
      <USelect
        v-model="selectedStatus"
        :items="statusOptions"
        placeholder="Trạng thái"
        class="w-44"
      />
      <USelect
        v-model="selectedPriority"
        :items="priorityOptions"
        placeholder="Ưu tiên"
        class="w-36"
      />
      <USelect
        v-model="selectedWarranty"
        :items="warrantyOptions"
        placeholder="Bảo hành"
        class="w-44"
      />
      <UButton
        v-if="hasFilters"
        icon="i-lucide-x"
        label="Xóa bộ lọc"
        color="neutral"
        variant="ghost"
        size="sm"
        @click="clearFilters"
      />
    </div>

    <SharedCrudTableWrapper
      :status="status"
      :error="error"
      :data="data"
      :refresh="refresh"
    >
      <div class="bg-white border border-border-gray rounded-xl overflow-hidden shadow-sm">
        <UTable
          :data="ogTickets"
          :columns="columns"
        >
          <template #receive-cell="{ row }">
            <div class="flex flex-col gap-0.5 text-xs min-w-[150px]">
              <template v-if="row.original.received_by">
                <span class="font-medium text-gray-900 text-sm">{{ row.original.received_by.name }}</span>
                <span class="text-gray-500">{{ formatShortDateTime(row.original.received_at) }}</span>
              </template>
              <UButton
                v-else-if="row.original.status.value !== 'cancelled'"
                label="Tiếp nhận"
                icon="i-lucide-hand"
                size="xs"
                color="primary"
                variant="solid"
                class="self-start"
                :loading="receivingId === row.original.id"
                @click="handleReceive(row.original)"
              />
              <span
                v-else
                class="text-gray-400"
              >—</span>
            </div>
          </template>

          <template #ticket-cell="{ row }">
            <div class="flex flex-col gap-1 min-w-[220px] max-w-[320px]">
              <div class="flex items-center gap-2">
                <span class="font-mono text-xs text-gray-500">{{ row.original.code ?? '—' }}</span>
                <UBadge
                  :label="row.original.priority.label"
                  :color="ogTicketPriorityColor(row.original.priority.value)"
                  variant="subtle"
                  size="xs"
                />
              </div>
              <NuxtLink
                :to="`/pmc/og-tickets/${row.original.id}`"
                class="font-medium text-sm text-gray-900 line-clamp-2 hover:text-primary-600"
              >
                {{ row.original.subject }}
              </NuxtLink>
            </div>
          </template>

          <template #customer-cell="{ row }">
            <div class="flex flex-col gap-0.5 min-w-[150px]">
              <NuxtLink
                v-if="row.original.customer"
                :to="`/pmc/customers/${row.original.customer.id}`"
                class="text-sm text-gray-900 truncate hover:text-primary-600 hover:underline"
              >
                {{ row.original.customer.full_name }}
              </NuxtLink>
              <span
                v-else
                class="text-sm text-gray-900 truncate"
              >{{ row.original.requester_name }}</span>
              <span
                v-if="row.original.customer?.phone ?? row.original.requester_phone"
                class="text-xs text-gray-500 font-mono"
              >{{ formatPhone(row.original.customer?.phone ?? row.original.requester_phone) }}</span>
            </div>
          </template>

          <template #project-cell="{ row }">
            <span class="text-sm">{{ row.original.project?.name ?? '—' }}</span>
          </template>

          <template #status-cell="{ row }">
            <UBadge
              :label="row.original.status.label"
              :color="ogTicketStatusColor(row.original.status.value)"
              variant="subtle"
              size="sm"
            />
          </template>

          <template #payment-cell="{ row }">
            <UBadge
              v-if="row.original.payment_status"
              :label="row.original.payment_status.label"
              :color="toBadgeColor(row.original.payment_status.color)"
              variant="subtle"
              size="sm"
            />
            <span
              v-else
              class="text-xs text-gray-400"
            >—</span>
          </template>

          <template #reconciliation-cell="{ row }">
            <UBadge
              v-if="row.original.reconciliation_status"
              :label="row.original.reconciliation_status.label"
              :color="toBadgeColor(row.original.reconciliation_status.color)"
              variant="subtle"
              size="sm"
            />
            <span
              v-else
              class="text-xs text-gray-400"
            >—</span>
          </template>

          <template #feedback-cell="{ row }">
            <div class="flex flex-col items-start gap-1 min-w-[130px]">
              <div
                v-if="row.original.resident_rating != null"
                class="flex items-center gap-1"
              >
                <span class="text-amber-500 leading-none text-base tracking-tight">
                  <span
                    v-for="n in 5"
                    :key="n"
                  >{{ n <= (row.original.resident_rating ?? 0) ? '★' : '☆' }}</span>
                </span>
              </div>
              <span
                v-else
                class="text-xs text-gray-400"
              >Chưa đánh giá</span>

              <UBadge
                v-if="row.original.warranty_request_count > 0"
                :label="`YC bảo hành (${row.original.warranty_request_count})`"
                color="error"
                variant="solid"
                size="xs"
                icon="i-lucide-shield-alert"
              />
            </div>
          </template>

          <template #actions-cell="{ row }">
            <div class="flex items-center justify-end gap-1">
              <UButton
                icon="i-lucide-eye"
                color="neutral"
                variant="ghost"
                size="sm"
                title="Xem chi tiết"
                :to="`/pmc/og-tickets/${row.original.id}`"
              />
              <UButton
                v-if="row.original.status.value !== 'cancelled'"
                icon="i-lucide-pencil"
                color="neutral"
                variant="ghost"
                size="sm"
                title="Chỉnh sửa"
                :to="`/pmc/og-tickets/${row.original.id}/edit`"
              />
              <UButton
                v-if="row.original.status.value !== 'cancelled'"
                icon="i-lucide-trash-2"
                color="neutral"
                variant="ghost"
                size="sm"
                class="hover:!text-red-500 hover:!bg-red-50"
                title="Xoá"
                @click="openDeleteModal(row.original)"
              />
            </div>
          </template>
        </UTable>

        <SharedCrudTablePagination
          v-model:page="page"
          :meta="data?.meta"
        />
      </div>
    </SharedCrudTableWrapper>

    <SharedCrudDeleteModal
      v-model:open="showDeleteModal"
      title="Huỷ OG Ticket"
      :item-name="deleteTarget?.subject"
      description="OG Ticket sẽ bị huỷ. Ticket gốc sẽ được trả về pool. Báo giá và đơn hàng liên quan sẽ bị huỷ."
      :checking="isCheckingDelete"
      :blocked-message="deleteBlockedMessage"
      :loading="isDeleting"
      @confirm="handleDelete"
    />
  </div>
</template>
