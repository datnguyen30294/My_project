<script setup lang="ts">
import { VueDatePicker } from '@vuepic/vue-datepicker'
import type {
  ClosingPeriodListItem,
  ClosingPeriodListFilters,
  EligibleOrderItem
} from '~/composables/api/useClosingPeriods'

// ─── State ───
const toast = useToast()
const params = reactive<ClosingPeriodListFilters>({ per_page: SELECT_ALL_PER_PAGE })
const page = ref(1)
const selectedStatus = ref<string | undefined>(undefined)

const { isInitFromUrl } = useUrlFilters({
  page: { ref: page, type: 'number', defaultValue: 1 },
  status: { ref: selectedStatus, type: 'string', onInit: (v) => { params.status = String(v) } }
})

watch(selectedStatus, (val) => {
  params.status = val || undefined
  if (!isInitFromUrl.value) page.value = 1
})

// ─── Data ───
const { data, status, error, refresh } = useClosingPeriodList(
  computed(() => ({ ...params, page: page.value }))
)
const periods = computed<ClosingPeriodListItem[]>(() => data.value?.data ?? [])

// ─── Create Modal ───
const showCreateModal = ref(false)
const createLoading = ref(false)
const createForm = reactive({
  name: '',
  period_start: '',
  period_end: '',
  project_id: null as number | null
})

function resetCreateForm() {
  createForm.name = ''
  createForm.period_start = ''
  createForm.period_end = ''
  createForm.project_id = null
}

const periodEndMinDate = computed<Date | undefined>(() => {
  if (!createForm.period_start) return undefined
  const [y, m, d] = createForm.period_start.split('-').map(Number)
  if (!y || !m || !d) return undefined
  return new Date(y, m - 1, d)
})

async function submitCreate() {
  createLoading.value = true
  try {
    await apiCreateClosingPeriod(createForm)
    toast.add({ title: 'Đã tạo kỳ chốt', color: 'success' })
    showCreateModal.value = false
    resetCreateForm()
    await refresh()
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err), color: 'error' })
  } finally {
    createLoading.value = false
  }
}

// ─── Add Orders Modal ───
const showAddOrdersModal = ref(false)
const addOrdersPeriod = ref<ClosingPeriodListItem | null>(null)
const selectedOrderIds = ref<Set<number>>(new Set())
const addOrdersLoading = ref(false)

const eligibleQuery = useEligibleOrders(
  computed(() => addOrdersPeriod.value?.id ?? 0)
)
const eligibleOrders = computed<EligibleOrderItem[]>(() =>
  addOrdersPeriod.value ? (eligibleQuery.data.value?.data ?? []) : []
)

function openAddOrdersModal(period: ClosingPeriodListItem) {
  addOrdersPeriod.value = period
  selectedOrderIds.value = new Set()
  showAddOrdersModal.value = true
  eligibleQuery.refresh()
}

function toggleOrderSelection(id: number) {
  const s = new Set(selectedOrderIds.value)
  if (s.has(id)) s.delete(id)
  else s.add(id)
  selectedOrderIds.value = s
}

function toggleAllOrders() {
  if (selectedOrderIds.value.size === eligibleOrders.value.length) {
    selectedOrderIds.value = new Set()
  } else {
    selectedOrderIds.value = new Set(eligibleOrders.value.map(o => o.id))
  }
}

async function submitAddOrders() {
  if (!addOrdersPeriod.value || selectedOrderIds.value.size === 0) return
  addOrdersLoading.value = true
  try {
    await apiAddOrders(addOrdersPeriod.value.id, { order_ids: [...selectedOrderIds.value] })
    toast.add({ title: `Đã thêm ${selectedOrderIds.value.size} đơn vào kỳ`, color: 'success' })
    showAddOrdersModal.value = false
    await refresh()
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err), color: 'error' })
  } finally {
    addOrdersLoading.value = false
  }
}

// ─── Close / Reopen ───
const showCloseConfirm = ref(false)
const showReopenConfirm = ref(false)
const actionPeriod = ref<ClosingPeriodListItem | null>(null)
const actionNote = ref('')
const actionLoading = ref(false)

function openCloseConfirm(period: ClosingPeriodListItem) {
  actionPeriod.value = period
  actionNote.value = ''
  showCloseConfirm.value = true
}

function openReopenConfirm(period: ClosingPeriodListItem) {
  actionPeriod.value = period
  actionNote.value = ''
  showReopenConfirm.value = true
}

async function submitClose() {
  if (!actionPeriod.value) return
  actionLoading.value = true
  try {
    await apiClosePeriod(actionPeriod.value.id, { note: actionNote.value || null })
    toast.add({ title: 'Đã chốt kỳ', color: 'success' })
    showCloseConfirm.value = false
    await refresh()
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err), color: 'error' })
  } finally {
    actionLoading.value = false
  }
}

async function submitReopen() {
  if (!actionPeriod.value) return
  actionLoading.value = true
  try {
    await apiReopenPeriod(actionPeriod.value.id, { note: actionNote.value || null })
    toast.add({ title: 'Đã mở lại kỳ', color: 'success' })
    showReopenConfirm.value = false
    await refresh()
  } catch (err) {
    const apiErr = err as { data?: { error_code?: string, message?: string } }
    if (apiErr?.data?.error_code === 'CLOSING_PERIOD_HAS_PAID_COMMISSION') {
      toast.add({
        title: 'Không thể mở lại kỳ',
        description: apiErr.data?.message
          ?? 'Còn hoa hồng đã thanh toán trong kỳ. Vui lòng chuyển các dòng "Đã thanh toán" về "Chưa thanh toán" trong trang Tổng hợp hoa hồng, sau đó thử mở lại.',
        color: 'warning',
        duration: 10000
      })
    } else {
      toast.add({ title: getApiErrorMessage(err), color: 'error' })
    }
  } finally {
    actionLoading.value = false
  }
}
</script>

<template>
  <div>
    <SharedCrudPageHeader
      title="Kỳ kế toán"
      description="Quản lý kỳ quyết toán — chốt kỳ khóa sửa đơn, đóng băng snapshot hoa hồng."
    >
      <template #actions>
        <UButton
          icon="i-lucide-plus"
          label="Tạo kỳ mới"
          color="primary"
          @click="showCreateModal = true"
        />
      </template>
    </SharedCrudPageHeader>

    <!-- Filters -->
    <div class="mb-4 flex items-center gap-3">
      <USelect
        v-model="selectedStatus"
        :items="CLOSING_PERIOD_STATUS_OPTIONS"
        class="w-48"
        placeholder="Tất cả trạng thái"
      />
    </div>

    <SharedCrudTableWrapper
      :status="status"
      :error="error"
      :data="data"
      :refresh="refresh"
    >
      <!-- Grid Cards -->
      <div
        v-if="periods.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
      >
        <UCard
          v-for="period in periods"
          :key="period.id"
          class="cursor-pointer hover:shadow-md transition-shadow"
        >
          <template #header>
            <NuxtLink
              :to="`/pmc/finance/closing-periods/${period.id}`"
              class="flex items-center justify-between"
            >
              <span class="font-semibold text-slate-900">{{ period.name }}</span>
              <UBadge
                :label="period.status.label"
                :color="closingPeriodStatusColor(period.status.value)"
                variant="subtle"
              />
            </NuxtLink>
          </template>

          <NuxtLink
            :to="`/pmc/finance/closing-periods/${period.id}`"
            class="block space-y-2 text-sm"
          >
            <div class="flex justify-between text-slate-500">
              <span>Thời gian</span>
              <span class="text-slate-700">{{ formatDate(period.period_start) }} — {{ formatDate(period.period_end) }}</span>
            </div>
            <div class="flex justify-between text-slate-500">
              <span>Số đơn</span>
              <span class="font-medium text-slate-700">{{ period.orders_count }}</span>
            </div>
            <div class="flex justify-between text-slate-500">
              <span>Tổng phải thu</span>
              <span class="text-slate-700">{{ formatCurrency(period.total_receivable) }}</span>
            </div>
            <div class="flex justify-between text-slate-500">
              <span>Tổng hoa hồng</span>
              <span class="text-slate-700">{{ formatCurrency(period.total_commission) }}</span>
            </div>
            <div
              v-if="period.closed_at"
              class="flex justify-between text-slate-500"
            >
              <span>Chốt lúc</span>
              <span class="text-slate-700">{{ formatDateTime(period.closed_at) }}</span>
            </div>
          </NuxtLink>

          <template #footer>
            <div class="flex items-center gap-2">
              <template v-if="period.status.value === 'open'">
                <UButton
                  size="xs"
                  variant="outline"
                  icon="i-lucide-plus"
                  label="Thêm đơn"
                  @click.stop="openAddOrdersModal(period)"
                />
                <UButton
                  size="xs"
                  color="success"
                  icon="i-lucide-lock"
                  label="Chốt kỳ"
                  @click.stop="openCloseConfirm(period)"
                />
              </template>
              <template v-else>
                <UButton
                  size="xs"
                  variant="outline"
                  color="warning"
                  icon="i-lucide-unlock"
                  label="Mở lại"
                  @click.stop="openReopenConfirm(period)"
                />
              </template>
            </div>
          </template>
        </UCard>
      </div>

      <div
        v-else
        class="text-center py-12 text-slate-500"
      >
        Chưa có kỳ chốt nào. Bấm "Tạo kỳ mới" để bắt đầu.
      </div>
    </SharedCrudTableWrapper>

    <!-- Create Modal -->
    <UModal
      v-model:open="showCreateModal"
      title="Tạo kỳ chốt mới"
      :ui="{ body: 'overflow-y-visible', content: 'overflow-visible' }"
    >
      <template #body>
        <div class="space-y-4">
          <UFormField
            label="Tên kỳ"
            required
          >
            <UInput
              v-model="createForm.name"
              placeholder="VD: Tháng 4/2026"
              class="w-full"
            />
          </UFormField>
          <div class="grid grid-cols-2 gap-4">
            <UFormField
              label="Từ ngày"
              required
            >
              <VueDatePicker
                v-model="createForm.period_start"
                :time-config="{ enableTimePicker: false }"
                model-type="yyyy-MM-dd"
                format="dd/MM/yyyy"
                placeholder="Chọn ngày"
                auto-apply
              />
            </UFormField>
            <UFormField
              label="Đến ngày"
              required
            >
              <VueDatePicker
                v-model="createForm.period_end"
                :time-config="{ enableTimePicker: false }"
                :min-date="periodEndMinDate"
                model-type="yyyy-MM-dd"
                format="dd/MM/yyyy"
                placeholder="Chọn ngày"
                auto-apply
              />
            </UFormField>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            variant="outline"
            color="neutral"
            label="Hủy"
            @click="showCreateModal = false"
          />
          <UButton
            color="primary"
            label="Tạo"
            :loading="createLoading"
            :disabled="!createForm.name || !createForm.period_start || !createForm.period_end"
            @click="submitCreate"
          />
        </div>
      </template>
    </UModal>

    <!-- Add Orders Modal -->
    <UModal
      v-model:open="showAddOrdersModal"
      :title="`Thêm đơn vào kỳ '${addOrdersPeriod?.name ?? ''}'`"
    >
      <template #body>
        <UAlert
          color="info"
          variant="subtle"
          title="Chỉ hiển thị đơn đã hoàn thành và thu hết công nợ, chưa thuộc kỳ chốt nào."
          class="mb-4"
        />

        <div
          v-if="eligibleQuery.status.value === 'pending'"
          class="flex justify-center py-8"
        >
          <UIcon
            name="i-lucide-loader-circle"
            class="size-6 animate-spin text-[var(--ui-primary)]"
          />
        </div>
        <div
          v-else-if="eligibleOrders.length === 0"
          class="text-center py-8 text-slate-500"
        >
          Không có đơn nào đủ điều kiện.
        </div>
        <div
          v-else
          class="border rounded-lg overflow-hidden"
        >
          <table class="w-full text-sm">
            <thead class="bg-slate-50 border-b">
              <tr>
                <th class="px-3 py-2 text-left w-10">
                  <UCheckbox
                    :model-value="selectedOrderIds.size === eligibleOrders.length && eligibleOrders.length > 0"
                    @update:model-value="toggleAllOrders"
                  />
                </th>
                <th class="px-3 py-2 text-left font-medium text-slate-600">
                  Mã đơn
                </th>
                <th class="px-3 py-2 text-right font-medium text-slate-600">
                  Tổng đơn
                </th>
                <th class="px-3 py-2 text-right font-medium text-slate-600">
                  Phải thu
                </th>
                <th class="px-3 py-2 text-left font-medium text-slate-600">
                  Dự án
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="order in eligibleOrders"
                :key="order.id"
                class="border-b last:border-0 hover:bg-slate-50 cursor-pointer"
                @click="toggleOrderSelection(order.id)"
              >
                <td class="px-3 py-2">
                  <UCheckbox
                    :model-value="selectedOrderIds.has(order.id)"
                    @update:model-value="toggleOrderSelection(order.id)"
                  />
                </td>
                <td class="px-3 py-2 font-mono text-xs">
                  {{ order.code }}
                </td>
                <td class="px-3 py-2 text-right">
                  {{ formatCurrency(order.total_amount) }}
                </td>
                <td class="px-3 py-2 text-right">
                  {{ order.receivable_amount ? formatCurrency(order.receivable_amount) : '—' }}
                </td>
                <td class="px-3 py-2">
                  {{ order.project?.name ?? '—' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            variant="outline"
            color="neutral"
            label="Hủy"
            @click="showAddOrdersModal = false"
          />
          <UButton
            color="primary"
            :label="`Thêm (${selectedOrderIds.size} đơn)`"
            :loading="addOrdersLoading"
            :disabled="selectedOrderIds.size === 0"
            @click="submitAddOrders"
          />
        </div>
      </template>
    </UModal>

    <!-- Close Confirm -->
    <UModal
      v-model:open="showCloseConfirm"
      title="Chốt kỳ?"
    >
      <template #body>
        <p class="text-sm text-slate-600 mb-4">
          Sau khi chốt, tất cả <strong>{{ actionPeriod?.orders_count ?? 0 }}</strong> đơn trong kỳ
          "<strong>{{ actionPeriod?.name }}</strong>" sẽ bị khóa tài chính. Bạn có thể mở lại sau nếu cần.
        </p>
        <UFormField label="Ghi chú (tùy chọn)">
          <UTextarea
            v-model="actionNote"
            placeholder="Ghi chú khi chốt..."
            class="w-full"
          />
        </UFormField>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            variant="outline"
            color="neutral"
            label="Quay lại"
            @click="showCloseConfirm = false"
          />
          <UButton
            color="success"
            label="Chốt kỳ"
            :loading="actionLoading"
            @click="submitClose"
          />
        </div>
      </template>
    </UModal>

    <!-- Reopen Confirm -->
    <UModal
      v-model:open="showReopenConfirm"
      title="Mở lại kỳ?"
    >
      <template #body>
        <p class="text-sm text-slate-600 mb-4">
          Mở lại sẽ mở khóa tài chính cho tất cả đơn trong kỳ "<strong>{{ actionPeriod?.name }}</strong>"
          và tính lại toàn bộ hoa hồng theo cấu hình mới nhất. Bạn có chắc chắn?
        </p>
        <UFormField label="Lý do mở lại (tùy chọn)">
          <UTextarea
            v-model="actionNote"
            placeholder="Lý do mở lại..."
            class="w-full"
          />
        </UFormField>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            variant="outline"
            color="neutral"
            label="Quay lại"
            @click="showReopenConfirm = false"
          />
          <UButton
            color="warning"
            label="Mở lại"
            :loading="actionLoading"
            @click="submitReopen"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
