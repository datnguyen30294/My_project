<script setup lang="ts">
import type {
  ClosingPeriodDetail,
  ClosingPeriodOrderItem,
  EligibleOrderItem
} from '~/composables/api/useClosingPeriods'

const route = useRoute()
const toast = useToast()
const periodId = computed(() => route.params.id as string)

// ─── Data ───
const { data, status, error, refresh } = useClosingPeriodDetail(periodId)
const period = computed<ClosingPeriodDetail | null>(() => data.value?.data ?? null)
const isOpen = computed(() => period.value?.status.value === 'open')

// ─── Breadcrumb ───
const { useDynamicLabel } = useBreadcrumb()
useDynamicLabel(computed(() => period.value?.name))

// ─── Computed summaries ───
const totalReceivable = computed(() => {
  if (!period.value) return 0
  return period.value.orders.reduce((sum, o) => sum + parseFloat(o.frozen_receivable_amount || '0'), 0)
})
const totalCommission = computed(() => {
  if (!period.value) return 0
  return period.value.orders.reduce((sum, o) => sum + getTopLevelCommission(o.snapshots), 0)
})

// ─── Expanded rows ───
const expandedRows = ref<Set<number>>(new Set())

function toggleRow(orderId: number) {
  const s = new Set(expandedRows.value)
  if (s.has(orderId)) s.delete(orderId)
  else s.add(orderId)
  expandedRows.value = s
}

// ─── Add Orders Modal ───
const showAddOrdersModal = ref(false)
const selectedOrderIds = ref<Set<number>>(new Set())
const addOrdersLoading = ref(false)

const eligibleQuery = useEligibleOrders(periodId)
const eligibleOrders = computed<EligibleOrderItem[]>(() =>
  showAddOrdersModal.value ? (eligibleQuery.data.value?.data ?? []) : []
)

function openAddOrdersModal() {
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
  if (selectedOrderIds.value.size === 0) return
  addOrdersLoading.value = true
  try {
    await apiAddOrders(Number(periodId.value), { order_ids: [...selectedOrderIds.value] })
    toast.add({ title: `Đã thêm ${selectedOrderIds.value.size} đơn vào kỳ`, color: 'success' })
    showAddOrdersModal.value = false
    clearClosingPeriodCache(periodId.value)
    await refresh()
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err), color: 'error' })
  } finally {
    addOrdersLoading.value = false
  }
}

// ─── Remove Order ───
const showRemoveConfirm = ref(false)
const removeTarget = ref<ClosingPeriodOrderItem | null>(null)
const removeLoading = ref(false)

function openRemoveConfirm(order: ClosingPeriodOrderItem) {
  removeTarget.value = order
  showRemoveConfirm.value = true
}

async function submitRemove() {
  if (!removeTarget.value) return
  removeLoading.value = true
  try {
    await apiRemoveOrder(Number(periodId.value), removeTarget.value.order.id)
    toast.add({ title: 'Đã xóa đơn khỏi kỳ', color: 'success' })
    showRemoveConfirm.value = false
    clearClosingPeriodCache(periodId.value)
    await refresh()
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err), color: 'error' })
  } finally {
    removeLoading.value = false
  }
}

// ─── Close / Reopen ───
const showCloseConfirm = ref(false)
const showReopenConfirm = ref(false)
const actionNote = ref('')
const actionLoading = ref(false)

async function submitClose() {
  actionLoading.value = true
  try {
    await apiClosePeriod(Number(periodId.value), { note: actionNote.value || null })
    toast.add({ title: 'Đã chốt kỳ', color: 'success' })
    showCloseConfirm.value = false
    clearClosingPeriodCache(periodId.value)
    await refresh()
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err), color: 'error' })
  } finally {
    actionLoading.value = false
  }
}

async function submitReopen() {
  actionLoading.value = true
  try {
    await apiReopenPeriod(Number(periodId.value), { note: actionNote.value || null })
    toast.add({ title: 'Đã mở lại kỳ và tính lại hoa hồng', color: 'success' })
    showReopenConfirm.value = false
    clearClosingPeriodCache(periodId.value)
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

// ─── Snapshot helpers ───
const TOP_LEVEL_RECIPIENT_TYPES = ['platform', 'operating_company', 'board_of_directors', 'management']
const INTERMEDIARY_TYPES = ['management', 'department']

function isIntermediary(snap: CommissionSnapshotItem): boolean {
  if (snap.resolved_from === 'override') return false
  return INTERMEDIARY_TYPES.includes(snap.recipient_type)
}

function getSnapshotLevel(snap: CommissionSnapshotItem): 0 | 1 | 2 {
  if (snap.resolved_from === 'override') return 0
  if (snap.recipient_type === 'department') return 1
  if (snap.recipient_type === 'staff') return 2
  return 0
}

function getTopLevelCommission(snapshots: CommissionSnapshotItem[]): number {
  return snapshots
    .filter(s => s.resolved_from === 'override' || TOP_LEVEL_RECIPIENT_TYPES.includes(s.recipient_type))
    .reduce((sum, s) => sum + parseFloat(s.amount || '0'), 0)
}

function buildSnapshotFormula(snap: CommissionSnapshotItem): string {
  if (snap.value_type === 'fixed') return `cứng ${formatCurrency(snap.value_fixed ?? 0)}/đơn`
  if (snap.value_type === 'percent') return formatPercent(snap.percent)
  return `${formatCurrency(snap.value_fixed ?? 0)} + ${formatPercent(snap.percent)}`
}
</script>

<template>
  <div>
    <SharedCrudPageHeader :title="period?.name ?? 'Chi tiết kỳ chốt'">
      <template #actions>
        <UButton
          variant="outline"
          icon="i-lucide-arrow-left"
          label="Quay lại"
          :to="'/pmc/finance/closing-periods'"
        />
      </template>
    </SharedCrudPageHeader>

    <SharedCrudTableWrapper
      :status="status"
      :error="error"
      :data="data"
      :refresh="refresh"
    >
      <div
        v-if="period"
        class="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <!-- Main Content (2/3) -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Status Alert -->
          <UAlert
            v-if="isOpen"
            color="info"
            variant="subtle"
            title="Kỳ đang mở"
            description="Có thể thêm/bớt đơn. Khi chốt, tất cả đơn sẽ bị khóa tài chính."
          />
          <UAlert
            v-else
            color="success"
            variant="subtle"
            title="Đã chốt"
            :description="`Kỳ đã chốt lúc ${formatDateTime(period.closed_at)} bởi ${period.closed_by?.name ?? '—'}. Tất cả đơn trong kỳ bị khóa tài chính.`"
          />

          <!-- Period Info -->
          <SharedSectionCard
            title="Thông tin kỳ chốt"
            compact
          >
            <div class="grid grid-cols-2 gap-4">
              <SharedFieldDisplay label="Tên kỳ">
                {{ period.name }}
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Dự án">
                {{ period.project?.name ?? 'Toàn hệ thống' }}
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Khoảng thời gian">
                {{ formatDate(period.period_start) }} — {{ formatDate(period.period_end) }}
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Trạng thái">
                <UBadge
                  :label="period.status.label"
                  :color="closingPeriodStatusColor(period.status.value)"
                  variant="subtle"
                />
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Chốt lúc">
                {{ period.closed_at ? formatDateTime(period.closed_at) : '—' }}
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Người chốt">
                {{ period.closed_by?.name ?? '—' }}
              </SharedFieldDisplay>
              <SharedFieldDisplay
                v-if="period.note"
                label="Ghi chú"
                class="col-span-2"
              >
                {{ period.note }}
              </SharedFieldDisplay>
            </div>
          </SharedSectionCard>

          <!-- Orders Table -->
          <SharedSectionCard
            :title="`Đơn trong kỳ (${period.orders.length})`"
            compact
          >
            <template
              v-if="isOpen"
              #header-actions
            >
              <UButton
                size="xs"
                icon="i-lucide-plus"
                label="Thêm đơn"
                @click="openAddOrdersModal"
              />
            </template>

            <div
              v-if="period.orders.length === 0"
              class="text-center py-8 text-slate-500"
            >
              Chưa có đơn nào trong kỳ này. Bấm "Thêm đơn" để thêm.
            </div>

            <div
              v-else
              class="border rounded-lg overflow-hidden"
            >
              <table class="w-full text-sm">
                <thead class="bg-slate-50 border-b">
                  <tr>
                    <th class="px-3 py-2 text-left w-8" />
                    <th class="px-3 py-2 text-left font-medium text-slate-600">
                      Mã đơn
                    </th>
                    <th class="px-3 py-2 text-right font-medium text-slate-600">
                      Phải thu (chốt)
                    </th>
                    <th class="px-3 py-2 text-right font-medium text-slate-600">
                      Hoa hồng (chốt)
                    </th>
                    <th
                      v-if="isOpen"
                      class="px-3 py-2 text-center font-medium text-slate-600 w-20"
                    >
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <template
                    v-for="cpo in period.orders"
                    :key="cpo.id"
                  >
                    <tr
                      class="border-b hover:bg-slate-50 cursor-pointer"
                      @click="toggleRow(cpo.order.id)"
                    >
                      <td class="px-3 py-2">
                        <UIcon
                          :name="expandedRows.has(cpo.order.id) ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
                          class="size-4 text-slate-400"
                        />
                      </td>
                      <td class="px-3 py-2">
                        <NuxtLink
                          :to="`/pmc/orders/${cpo.order.id}`"
                          class="font-mono text-xs text-primary underline"
                          @click.stop
                        >
                          {{ cpo.order.code }}
                        </NuxtLink>
                      </td>
                      <td class="px-3 py-2 text-right">
                        {{ formatCurrency(cpo.frozen_receivable_amount) }}
                      </td>
                      <td class="px-3 py-2 text-right">
                        {{ formatCurrency(getTopLevelCommission(cpo.snapshots)) }}
                      </td>
                      <td
                        v-if="isOpen"
                        class="px-3 py-2 text-center"
                      >
                        <UButton
                          size="xs"
                          variant="ghost"
                          color="error"
                          icon="i-lucide-trash-2"
                          @click.stop="openRemoveConfirm(cpo)"
                        />
                      </td>
                    </tr>
                    <!-- Expanded: Snapshot table -->
                    <tr v-if="expandedRows.has(cpo.order.id)">
                      <td
                        :colspan="isOpen ? 5 : 4"
                        class="px-0 py-0"
                      >
                        <div class="bg-slate-50 px-6 py-3">
                          <h4 class="text-xs font-semibold text-slate-500 mb-2">
                            Chi tiết hoa hồng
                          </h4>
                          <table class="w-full text-xs">
                            <thead>
                              <tr class="text-slate-500">
                                <th class="px-2 py-1 text-left">
                                  Bên nhận
                                </th>
                                <th class="px-2 py-1 text-left">
                                  Công thức
                                </th>
                                <th class="px-2 py-1 text-right">
                                  Số tiền HH
                                </th>
                                <th class="px-2 py-1 text-center">
                                  Nguồn
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="snap in cpo.snapshots"
                                :key="snap.id"
                                class="border-t border-slate-100"
                              >
                                <td
                                  class="px-2 py-1.5"
                                  :class="[
                                    getSnapshotLevel(snap) === 0 && !isIntermediary(snap) ? 'font-medium text-slate-900' : '',
                                    isIntermediary(snap) ? 'text-slate-600' : '',
                                    getSnapshotLevel(snap) === 2 ? 'text-slate-500' : ''
                                  ]"
                                >
                                  <div
                                    class="flex items-center gap-1.5"
                                    :style="{ paddingLeft: `${getSnapshotLevel(snap) * 20}px` }"
                                  >
                                    <span
                                      v-if="getSnapshotLevel(snap) === 1"
                                      class="text-slate-300"
                                    >├</span>
                                    <span
                                      v-if="getSnapshotLevel(snap) === 2"
                                      class="text-slate-300"
                                    >└</span>
                                    <span>{{ snap.recipient_name }}</span>
                                  </div>
                                </td>
                                <td class="px-2 py-1.5 font-mono text-slate-400">
                                  {{ buildSnapshotFormula(snap) }}
                                </td>
                                <td
                                  class="px-2 py-1.5 text-right font-mono tabular-nums"
                                  :class="[
                                    isIntermediary(snap) ? 'text-slate-400' : '',
                                    getSnapshotLevel(snap) === 0 && !isIntermediary(snap) ? 'font-semibold text-slate-900' : '',
                                    getSnapshotLevel(snap) === 2 ? 'text-slate-500' : ''
                                  ]"
                                >
                                  <template v-if="isIntermediary(snap)">
                                    —
                                  </template>
                                  <template v-else>
                                    {{ formatCurrency(snap.amount) }}
                                  </template>
                                </td>
                                <td class="px-2 py-1.5 text-center">
                                  <UBadge
                                    :label="snap.resolved_from"
                                    :color="snap.resolved_from === 'override' ? 'warning' : 'neutral'"
                                    variant="subtle"
                                    size="xs"
                                  />
                                </td>
                              </tr>
                            </tbody>
                            <tfoot>
                              <tr class="border-t-2 border-slate-300">
                                <td
                                  colspan="2"
                                  class="px-2 py-1.5 text-right font-semibold text-slate-600"
                                >
                                  Tổng hoa hồng
                                </td>
                                <td class="px-2 py-1.5 text-right font-bold font-mono tabular-nums">
                                  {{ formatCurrency(getTopLevelCommission(cpo.snapshots)) }}
                                </td>
                                <td />
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </SharedSectionCard>
        </div>

        <!-- Sidebar (1/3) -->
        <div class="space-y-6">
          <!-- Actions -->
          <SharedSectionCard
            title="Hành động"
            compact
          >
            <div
              v-if="isOpen"
              class="space-y-3"
            >
              <UTextarea
                v-model="actionNote"
                placeholder="Ghi chú khi chốt..."
                class="w-full"
                :rows="3"
              />
              <UButton
                color="success"
                icon="i-lucide-lock"
                label="Chốt kỳ"
                block
                @click="showCloseConfirm = true"
              />
            </div>
            <div
              v-else
              class="space-y-3"
            >
              <UTextarea
                v-model="actionNote"
                placeholder="Lý do mở lại..."
                class="w-full"
                :rows="3"
              />
              <UButton
                color="warning"
                variant="outline"
                icon="i-lucide-unlock"
                label="Mở lại"
                block
                @click="showReopenConfirm = true"
              />
            </div>
          </SharedSectionCard>

          <!-- Summary -->
          <SharedSectionCard
            title="Tổng hợp"
            compact
          >
            <div class="space-y-3">
              <SharedFieldDisplay label="Số đơn">
                {{ period.orders.length }}
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Tổng phải thu">
                {{ formatCurrency(totalReceivable) }}
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Tổng hoa hồng">
                {{ formatCurrency(totalCommission) }}
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Tạo lúc">
                {{ formatDateTime(period.created_at) }}
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Cập nhật">
                {{ formatDateTime(period.updated_at) }}
              </SharedFieldDisplay>
            </div>
          </SharedSectionCard>
        </div>
      </div>
    </SharedCrudTableWrapper>

    <!-- Add Orders Modal -->
    <UModal
      v-model:open="showAddOrdersModal"
      :title="`Thêm đơn vào kỳ '${period?.name ?? ''}'`"
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

    <!-- Remove Order Confirm -->
    <UModal
      v-model:open="showRemoveConfirm"
      title="Xóa đơn khỏi kỳ?"
    >
      <template #body>
        <p class="text-sm text-slate-600">
          Xóa đơn "<strong>{{ removeTarget?.order.code }}</strong>" khỏi kỳ "<strong>{{ period?.name }}</strong>"?
          Snapshot hoa hồng sẽ bị xóa theo.
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            variant="outline"
            color="neutral"
            label="Quay lại"
            @click="showRemoveConfirm = false"
          />
          <UButton
            color="error"
            label="Xóa"
            :loading="removeLoading"
            @click="submitRemove"
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
        <p class="text-sm text-slate-600">
          Sau khi chốt, tất cả <strong>{{ period?.orders.length ?? 0 }}</strong> đơn trong kỳ
          "<strong>{{ period?.name }}</strong>" sẽ bị khóa tài chính. Bạn có thể mở lại sau nếu cần.
        </p>
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
        <p class="text-sm text-slate-600">
          Mở lại sẽ mở khóa tài chính cho tất cả đơn trong kỳ "<strong>{{ period?.name }}</strong>"
          và tính lại toàn bộ hoa hồng theo cấu hình mới nhất. Bạn có chắc chắn?
        </p>
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
