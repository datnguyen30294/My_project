<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type {
  CustomerDetailResource,
  CustomerTicketItemResource,
  CustomerOrderItemResource,
  CustomerPaymentItemResource
} from '~/composables/api/useCustomers'
import type { CustomerFormValues } from '~/components/customer/CustomerForm.vue'

definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()
const toast = useToast()
const id = computed(() => Number(route.params.id))

// ─── Detail ────────────────────────────────────────────────────
const { data, status, error, refresh } = useCustomerDetail(id)
const customer = computed(() => data.value?.data ?? null)

const { useDynamicLabel } = useBreadcrumb()
useDynamicLabel(computed(() => customer.value?.full_name ?? null))

useSeoMeta({
  title: computed(() => customer.value
    ? `${customer.value.full_name} - Khách hàng`
    : 'Chi tiết khách hàng')
})

const aggregates = computed(() => customer.value?.aggregates ?? null)

// ─── Tabs ──────────────────────────────────────────────────────
const tabItems = [
  { label: 'Thông tin', value: 'info', icon: 'i-lucide-user' },
  { label: 'Ticket', value: 'tickets', icon: 'i-lucide-ticket' },
  { label: 'Đơn hàng & Thanh toán', value: 'orders', icon: 'i-lucide-shopping-cart' },
  { label: 'Đánh giá', value: 'csat', icon: 'i-lucide-star' }
]
const allowedTabs = tabItems.map(t => t.value)
const activeTab = ref(
  typeof route.query.tab === 'string' && allowedTabs.includes(route.query.tab)
    ? route.query.tab
    : 'info'
)
watch(activeTab, (next) => {
  router.replace({ query: { ...route.query, tab: next } })
})

// ─── Tab: Ticket ───────────────────────────────────────────────
const ticketPage = ref(1)
const ticketParams = computed(() => ({ page: ticketPage.value, per_page: DEFAULT_PER_PAGE }))
const {
  data: ticketData,
  status: ticketStatus,
  error: ticketError
} = useCustomerTickets(id, ticketParams)
const tickets = computed<CustomerTicketItemResource[]>(() => ticketData.value?.data ?? [])

const ticketColumns: TableColumn<CustomerTicketItemResource>[] = [
  { id: 'code', header: 'Tiêu đề' },
  { id: 'project', header: 'Dự án' },
  { accessorKey: 'apartment_name', header: 'Căn hộ' },
  { id: 'status', header: 'Trạng thái' },
  { id: 'priority', header: 'Ưu tiên' },
  { id: 'received_at', header: 'Ngày nhận' },
  { id: 'rating', header: 'Đánh giá' }
]

// ─── Tab: Orders & Payments ────────────────────────────────────
const orderPage = ref(1)
const orderParams = computed(() => ({ page: orderPage.value, per_page: DEFAULT_PER_PAGE }))
const {
  data: orderData,
  status: orderStatus,
  error: orderError
} = useCustomerOrders(id, orderParams)
const orders = computed<CustomerOrderItemResource[]>(() => orderData.value?.data ?? [])

const orderColumns: TableColumn<CustomerOrderItemResource>[] = [
  { accessorKey: 'code', header: 'Mã đơn' },
  { id: 'ticket', header: 'Ticket' },
  { id: 'status', header: 'Trạng thái' },
  { id: 'total_amount', header: 'Tổng tiền' },
  { id: 'receivable_status', header: 'Tình trạng thu' },
  { id: 'paid_amount', header: 'Đã thu' },
  { id: 'outstanding', header: 'Còn nợ' }
]

const paymentPage = ref(1)
const paymentParams = computed(() => ({ page: paymentPage.value, per_page: DEFAULT_PER_PAGE }))
const {
  data: paymentData,
  status: paymentStatus,
  error: paymentError
} = useCustomerPayments(id, paymentParams)
const payments = computed<CustomerPaymentItemResource[]>(() => paymentData.value?.data ?? [])

const paymentColumns: TableColumn<CustomerPaymentItemResource>[] = [
  { accessorKey: 'id', header: 'ID' },
  { id: 'order', header: 'Đơn liên quan' },
  { id: 'amount', header: 'Số tiền' },
  { id: 'payment_method', header: 'Phương thức' },
  { id: 'paid_at', header: 'Ngày thu' }
]

// ─── Tab: CSAT (load nhiều ticket, lọc client-side) ───────────
const csatParams = computed(() => ({ page: 1, per_page: SELECT_ALL_PER_PAGE }))
const { data: csatData, status: csatStatus } = useCustomerTickets(id, csatParams)
const ratedTickets = computed(() =>
  (csatData.value?.data ?? []).filter(t => t.resident_rating != null)
)

const ratingHistogram = computed(() => {
  const buckets: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  for (const t of ratedTickets.value) {
    const r = t.resident_rating
    if (r != null && r >= 1 && r <= 5) buckets[r] = (buckets[r] ?? 0) + 1
  }
  const total = ratedTickets.value.length
  return [5, 4, 3, 2, 1].map((star) => {
    const count = buckets[star] ?? 0
    return {
      star,
      count,
      percent: total > 0 ? Math.round((count / total) * 100) : 0
    }
  })
})

// ─── CRUD (edit modal + delete với pre-check) ─────────────────
const crud = useCrudModals<CustomerDetailResource>()
const {
  showFormModal, formMode, editTarget, formApiErrors, formErrorMessage,
  openEditModal,
  showDeleteModal, deleteTarget
} = crud
const { isSubmitting, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, async () => {
  await refresh()
})

function onEditClick() {
  if (!customer.value) return
  openEditModal(customer.value)
}

function handleFormSubmit(values: CustomerFormValues) {
  submitForm(
    null,
    () => apiUpdateCustomer(editTarget.value!.id, {
      full_name: values.full_name,
      phone: values.phone,
      email: values.email || null,
      note: values.note || null
    }),
    { update: 'Đã cập nhật khách hàng' }
  )
}

const { isCheckingDelete, deleteBlockedMessage, openDeleteModal, handleDelete } = useCheckDelete({
  crud,
  submitDelete,
  checkFn: apiCheckDeleteCustomer,
  deleteFn: apiDeleteCustomer,
  successMessage: 'Đã xoá khách hàng',
  errorFallback: 'Không thể xoá khách hàng này',
  navigateAfter: '/pmc/customers'
})

function onDeleteClick() {
  if (!customer.value) return
  openDeleteModal(customer.value)
}

// Ticket status → BadgeColor (fallback khi chưa có helper dùng chung)
function ticketStatusColor(v: string): BadgeColor {
  return ogTicketStatusColor(v)
}
function ticketPriorityColor(v: string): BadgeColor {
  return ogTicketPriorityColor(v)
}
function orderStatusBadge(v: string): BadgeColor {
  return orderStatusColor(v)
}
function receivableStatusBadge(v: string): BadgeColor {
  return receivableStatusColor(v)
}

function refreshAll() {
  refresh()
  toast.add({ title: 'Đã làm mới dữ liệu', color: 'info' })
}
</script>

<template>
  <div>
    <!-- Loading -->
    <div
      v-if="status === 'pending' && !customer"
      class="flex flex-col gap-4"
    >
      <div class="h-24 bg-slate-100 rounded-xl animate-pulse" />
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          v-for="i in 4"
          :key="i"
          class="h-24 bg-slate-100 rounded-xl animate-pulse"
        />
      </div>
      <div class="h-48 bg-slate-100 rounded-xl animate-pulse" />
    </div>

    <!-- Error -->
    <UAlert
      v-else-if="error"
      color="error"
      variant="subtle"
      icon="i-lucide-alert-circle"
      description="Không tìm thấy khách hàng này."
    />

    <!-- Content -->
    <div
      v-else-if="customer"
      class="flex flex-col gap-6"
    >
      <!-- Header -->
      <div class="bg-white border border-border-gray rounded-xl shadow-sm p-5">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-3 flex-wrap">
              <h1 class="text-xl font-bold text-slate-900">
                {{ customer.full_name }}
              </h1>
              <UBadge
                :label="customer.code ?? '—'"
                color="neutral"
                variant="subtle"
                size="sm"
                class="font-mono"
              />
            </div>
            <div class="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-slate-600">
              <span class="inline-flex items-center gap-1.5">
                <UIcon
                  name="i-lucide-phone"
                  class="size-4 text-slate-400"
                />
                <span class="font-mono">{{ formatPhone(customer.phone) }}</span>
              </span>
              <span
                v-if="customer.email"
                class="inline-flex items-center gap-1.5"
              >
                <UIcon
                  name="i-lucide-mail"
                  class="size-4 text-slate-400"
                />
                {{ customer.email }}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <UButton
              icon="i-lucide-refresh-cw"
              color="neutral"
              variant="ghost"
              size="sm"
              @click="refreshAll"
            />
            <UButton
              icon="i-lucide-pencil"
              label="Chỉnh sửa"
              variant="soft"
              color="primary"
              @click="onEditClick"
            />
            <UButton
              icon="i-lucide-trash-2"
              variant="soft"
              color="error"
              aria-label="Xoá khách"
              @click="onDeleteClick"
            />
          </div>
        </div>
      </div>

      <!-- Stat cards -->
      <div
        v-if="aggregates"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <UCard>
          <div class="text-xs text-[var(--ui-text-muted)] uppercase tracking-wide">
            Tổng ticket
          </div>
          <div class="mt-2 text-2xl font-bold text-slate-900">
            {{ aggregates.ticket_count }}
          </div>
          <div
            v-if="Object.keys(aggregates.ticket_by_status).length"
            class="mt-2 flex flex-wrap gap-1.5"
          >
            <UBadge
              v-for="(count, key) in aggregates.ticket_by_status"
              :key="key"
              :label="`${key}: ${count}`"
              color="neutral"
              variant="subtle"
              size="xs"
            />
          </div>
        </UCard>

        <UCard>
          <div class="text-xs text-[var(--ui-text-muted)] uppercase tracking-wide">
            CSAT trung bình
          </div>
          <div class="mt-2 flex items-baseline gap-2">
            <span class="text-2xl font-bold text-slate-900">
              {{ aggregates.avg_rating !== null ? aggregates.avg_rating.toFixed(1) : '—' }}
            </span>
            <span
              v-if="aggregates.avg_rating !== null"
              class="text-sm text-[var(--ui-text-muted)]"
            >/ 5</span>
          </div>
          <div class="mt-1 text-xs text-[var(--ui-text-muted)]">
            Trên {{ aggregates.rating_count }} đánh giá
          </div>
        </UCard>

        <UCard>
          <div class="text-xs text-[var(--ui-text-muted)] uppercase tracking-wide">
            Tổng đã thu
          </div>
          <div class="mt-2 text-2xl font-bold text-emerald-700">
            {{ formatCurrency(aggregates.total_paid) }}
          </div>
          <div class="mt-1 text-xs text-[var(--ui-text-muted)]">
            {{ aggregates.order_count }} đơn hàng
          </div>
        </UCard>

        <UCard>
          <div class="text-xs text-[var(--ui-text-muted)] uppercase tracking-wide">
            Còn nợ
          </div>
          <div
            class="mt-2 text-2xl font-bold"
            :class="Number(aggregates.total_outstanding) > 0 ? 'text-red-600' : 'text-slate-900'"
          >
            {{ formatCurrency(aggregates.total_outstanding) }}
          </div>
        </UCard>
      </div>

      <!-- Tabs -->
      <UTabs
        v-model="activeTab"
        :items="tabItems"
        variant="link"
        :content="false"
        class="w-full"
      />

      <!-- Tab: Thông tin -->
      <SharedSectionCard
        v-if="activeTab === 'info'"
        title="Thông tin khách hàng"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <SharedFieldDisplay label="Họ tên">
            <span class="font-medium">{{ customer.full_name }}</span>
          </SharedFieldDisplay>
          <SharedFieldDisplay label="Số điện thoại">
            <span class="font-mono font-medium">{{ formatPhone(customer.phone) }}</span>
          </SharedFieldDisplay>
          <SharedFieldDisplay label="Email">
            {{ customer.email ?? '—' }}
          </SharedFieldDisplay>
          <SharedFieldDisplay label="Mã khách">
            <span class="font-mono">{{ customer.code ?? '—' }}</span>
          </SharedFieldDisplay>
          <SharedFieldDisplay label="Lần đầu liên hệ">
            {{ formatDateTime(customer.first_contacted_at) }}
          </SharedFieldDisplay>
          <SharedFieldDisplay label="Lần gần nhất liên hệ">
            {{ formatDateTime(customer.last_contacted_at) }}
          </SharedFieldDisplay>
          <SharedFieldDisplay label="Ngày tạo">
            {{ formatDateTime(customer.created_at) }}
          </SharedFieldDisplay>
          <SharedFieldDisplay label="Cập nhật lần cuối">
            {{ formatDateTime(customer.updated_at) }}
          </SharedFieldDisplay>
          <SharedFieldDisplay
            label="Ghi chú"
            class="sm:col-span-2"
          >
            <span class="whitespace-pre-line">{{ customer.note || '—' }}</span>
          </SharedFieldDisplay>
        </div>
      </SharedSectionCard>

      <!-- Tab: Ticket -->
      <SharedSectionCard
        v-else-if="activeTab === 'tickets'"
        title="Lịch sử ticket"
      >
        <div
          v-if="ticketStatus === 'pending' && tickets.length === 0"
          class="h-24 bg-slate-50 rounded-lg animate-pulse"
        />
        <UAlert
          v-else-if="ticketError"
          color="error"
          variant="subtle"
          icon="i-lucide-alert-circle"
          description="Không thể tải danh sách ticket."
        />
        <UAlert
          v-else-if="tickets.length === 0"
          color="info"
          variant="subtle"
          icon="i-lucide-inbox"
          description="Khách hàng chưa có ticket nào."
        />
        <div
          v-else
          class="-mx-6 -mb-5"
        >
          <UTable
            :data="tickets"
            :columns="ticketColumns"
          >
            <template #code-cell="{ row }">
              <NuxtLink
                :to="`/pmc/og-tickets/${row.original.id}`"
                class="font-medium text-primary-700 hover:underline"
              >
                {{ row.original.subject }}
              </NuxtLink>
            </template>

            <template #project-cell="{ row }">
              <NuxtLink
                v-if="row.original.project"
                :to="`/pmc/projects/${row.original.project.id}`"
                class="text-primary-600 hover:underline"
              >
                {{ row.original.project.name }}
              </NuxtLink>
              <span v-else>—</span>
            </template>

            <template #status-cell="{ row }">
              <UBadge
                :label="row.original.status.label"
                :color="ticketStatusColor(row.original.status.value)"
                variant="subtle"
                size="sm"
              />
            </template>

            <template #priority-cell="{ row }">
              <UBadge
                :label="row.original.priority.label"
                :color="ticketPriorityColor(row.original.priority.value)"
                variant="subtle"
                size="sm"
              />
            </template>

            <template #received_at-cell="{ row }">
              {{ formatDate(row.original.received_at) }}
            </template>

            <template #rating-cell="{ row }">
              <span
                v-if="row.original.resident_rating != null"
                class="text-amber-500 text-base tracking-tight"
              >
                <span
                  v-for="n in 5"
                  :key="n"
                >{{ n <= (row.original.resident_rating ?? 0) ? '★' : '☆' }}</span>
              </span>
              <span
                v-else
                class="text-[var(--ui-text-muted)]"
              >—</span>
            </template>
          </UTable>

          <SharedCrudTablePagination
            v-model:page="ticketPage"
            :meta="ticketData?.meta"
          />
        </div>
      </SharedSectionCard>

      <!-- Tab: Orders & Payments -->
      <template v-else-if="activeTab === 'orders'">
        <SharedSectionCard title="Đơn hàng">
          <div
            v-if="orderStatus === 'pending' && orders.length === 0"
            class="h-24 bg-slate-50 rounded-lg animate-pulse"
          />
          <UAlert
            v-else-if="orderError"
            color="error"
            variant="subtle"
            icon="i-lucide-alert-circle"
            description="Không thể tải danh sách đơn hàng."
          />
          <UAlert
            v-else-if="orders.length === 0"
            color="info"
            variant="subtle"
            icon="i-lucide-inbox"
            description="Khách hàng chưa có đơn hàng nào."
          />
          <div
            v-else
            class="-mx-6 -mb-5"
          >
            <UTable
              :data="orders"
              :columns="orderColumns"
            >
              <template #code-cell="{ row }">
                <NuxtLink
                  :to="`/pmc/orders/${row.original.id}`"
                  class="font-mono text-primary-600 hover:underline"
                >
                  {{ row.original.code ?? '—' }}
                </NuxtLink>
              </template>

              <template #ticket-cell="{ row }">
                <NuxtLink
                  v-if="row.original.ticket"
                  :to="`/pmc/og-tickets/${row.original.ticket.id}`"
                  class="text-primary-600 hover:underline"
                >
                  {{ row.original.ticket.subject }}
                </NuxtLink>
                <span v-else>—</span>
              </template>

              <template #status-cell="{ row }">
                <UBadge
                  :label="row.original.status.label"
                  :color="orderStatusBadge(row.original.status.value)"
                  variant="subtle"
                  size="sm"
                />
              </template>

              <template #total_amount-cell="{ row }">
                <span class="font-medium">{{ formatCurrency(row.original.total_amount) }}</span>
              </template>

              <template #receivable_status-cell="{ row }">
                <UBadge
                  v-if="row.original.receivable?.status"
                  :label="row.original.receivable.status.label"
                  :color="receivableStatusBadge(row.original.receivable.status.value)"
                  variant="subtle"
                  size="sm"
                />
                <span
                  v-else
                  class="text-[var(--ui-text-muted)]"
                >—</span>
              </template>

              <template #paid_amount-cell="{ row }">
                {{ row.original.receivable ? formatCurrency(row.original.receivable.paid_amount) : '—' }}
              </template>

              <template #outstanding-cell="{ row }">
                <span
                  v-if="row.original.receivable"
                  :class="Number(row.original.receivable.outstanding_amount) > 0 ? 'text-red-600 font-medium' : ''"
                >
                  {{ formatCurrency(row.original.receivable.outstanding_amount) }}
                </span>
                <span
                  v-else
                  class="text-[var(--ui-text-muted)]"
                >—</span>
              </template>
            </UTable>

            <SharedCrudTablePagination
              v-model:page="orderPage"
              :meta="orderData?.meta"
            />
          </div>
        </SharedSectionCard>

        <SharedSectionCard title="Phiếu thanh toán">
          <div
            v-if="paymentStatus === 'pending' && payments.length === 0"
            class="h-24 bg-slate-50 rounded-lg animate-pulse"
          />
          <UAlert
            v-else-if="paymentError"
            color="error"
            variant="subtle"
            icon="i-lucide-alert-circle"
            description="Không thể tải danh sách phiếu thanh toán."
          />
          <UAlert
            v-else-if="payments.length === 0"
            color="info"
            variant="subtle"
            icon="i-lucide-inbox"
            description="Khách hàng chưa có phiếu thanh toán nào."
          />
          <div
            v-else
            class="-mx-6 -mb-5"
          >
            <UTable
              :data="payments"
              :columns="paymentColumns"
            >
              <template #id-cell="{ row }">
                <span class="font-mono text-xs">#{{ row.original.id }}</span>
              </template>

              <template #order-cell="{ row }">
                <NuxtLink
                  v-if="row.original.order"
                  :to="`/pmc/orders/${row.original.order.id}`"
                  class="font-mono text-primary-600 hover:underline"
                >
                  {{ row.original.order.code ?? '—' }}
                </NuxtLink>
                <span v-else>—</span>
              </template>

              <template #amount-cell="{ row }">
                <span class="font-medium">{{ formatCurrency(row.original.amount) }}</span>
              </template>

              <template #payment_method-cell="{ row }">
                <UBadge
                  :label="row.original.payment_method.label"
                  color="neutral"
                  variant="subtle"
                  size="sm"
                />
              </template>

              <template #paid_at-cell="{ row }">
                {{ formatDate(row.original.paid_at) }}
              </template>
            </UTable>

            <SharedCrudTablePagination
              v-model:page="paymentPage"
              :meta="paymentData?.meta"
            />
          </div>
        </SharedSectionCard>
      </template>

      <!-- Tab: CSAT -->
      <template v-else-if="activeTab === 'csat'">
        <SharedSectionCard title="Tổng quan đánh giá">
          <div
            v-if="csatStatus === 'pending' && ratedTickets.length === 0"
            class="h-24 bg-slate-50 rounded-lg animate-pulse"
          />
          <UAlert
            v-else-if="ratedTickets.length === 0"
            color="info"
            variant="subtle"
            icon="i-lucide-inbox"
            description="Khách hàng chưa có đánh giá nào."
          />
          <div
            v-else
            class="grid grid-cols-1 md:grid-cols-5 gap-6"
          >
            <div class="md:col-span-2 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl">
              <div class="text-5xl font-bold text-slate-900">
                {{ aggregates?.avg_rating !== null && aggregates?.avg_rating !== undefined
                  ? aggregates.avg_rating.toFixed(1)
                  : '—' }}
              </div>
              <div class="mt-2 text-amber-500 text-xl tracking-tight">
                <span
                  v-for="n in 5"
                  :key="n"
                >{{ n <= Math.round(aggregates?.avg_rating ?? 0) ? '★' : '☆' }}</span>
              </div>
              <div class="mt-1 text-sm text-[var(--ui-text-muted)]">
                {{ aggregates?.rating_count ?? ratedTickets.length }} đánh giá
              </div>
            </div>

            <div class="md:col-span-3 flex flex-col gap-2">
              <div
                v-for="row in ratingHistogram"
                :key="row.star"
                class="flex items-center gap-3"
              >
                <span class="w-10 text-sm font-medium text-slate-700">{{ row.star }} ★</span>
                <div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-amber-400"
                    :style="{ width: `${row.percent}%` }"
                  />
                </div>
                <span class="w-16 text-right text-sm text-[var(--ui-text-muted)]">
                  {{ row.count }} ({{ row.percent }}%)
                </span>
              </div>
            </div>
          </div>
        </SharedSectionCard>

        <SharedSectionCard
          v-if="ratedTickets.length > 0"
          title="Nhận xét của khách"
        >
          <div class="flex flex-col gap-3">
            <div
              v-for="t in ratedTickets"
              :key="t.id"
              class="border border-border-gray rounded-lg p-4 bg-white"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                  <div class="text-amber-500 text-base tracking-tight">
                    <span
                      v-for="n in 5"
                      :key="n"
                    >{{ n <= (t.resident_rating ?? 0) ? '★' : '☆' }}</span>
                  </div>
                  <p
                    v-if="t.resident_rating_comment"
                    class="mt-2 text-sm text-slate-700 whitespace-pre-line"
                  >
                    {{ t.resident_rating_comment }}
                  </p>
                  <NuxtLink
                    :to="`/pmc/og-tickets/${t.id}`"
                    class="mt-2 inline-flex items-center gap-1 text-sm text-primary-600 hover:underline"
                  >
                    <UIcon
                      name="i-lucide-ticket"
                      class="size-3.5"
                    />
                    {{ t.subject }}
                  </NuxtLink>
                </div>
                <span class="text-xs text-[var(--ui-text-muted)] shrink-0">
                  {{ formatDate(t.completed_at ?? t.received_at) }}
                </span>
              </div>
            </div>
          </div>
        </SharedSectionCard>
      </template>
    </div>

    <CustomerFormModal
      v-model:open="showFormModal"
      :mode="formMode"
      :item="editTarget"
      :loading="isSubmitting"
      :api-errors="formApiErrors"
      :error-message="formErrorMessage"
      @submit="handleFormSubmit"
    />

    <SharedCrudDeleteModal
      v-model:open="showDeleteModal"
      title="Xoá khách hàng"
      :item-name="deleteTarget?.full_name"
      :blocked-message="deleteBlockedMessage"
      :loading="isDeleting"
      :checking="isCheckingDelete"
      @confirm="handleDelete"
    />
  </div>
</template>
