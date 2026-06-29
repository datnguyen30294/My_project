<script setup lang="ts">
import type { VendorOrderDetail } from '~/composables/api/useVendorOrders'
import {
  apiRemoveVendorOrderCommission,
  revenueRecipientColor,
  usePlatformVendorOrderDetail,
  vendorOrderStatusColor,
  vendorOrderTypeOption
} from '~/composables/api/useVendorOrders'

definePageMeta({ layout: 'platform' })

const route = useRoute()
const LIST_PATH = '/platform/quan-ly-don-hang/don-hang-vendor'
const VENDOR_BASE = '/platform/quan-ly-van-hanh/quan-ly-vendor'
const PROJECT_BASE = '/platform/quan-ly-van-hanh/du-an-tren-nen-tang'

// orderKey = "{vendorId}-{orderId}"
const orderKey = computed(() => String(route.params.orderKey ?? ''))
const vendorId = computed(() => Number(orderKey.value.split('-')[0] ?? 0))
const orderId = computed(() => Number(orderKey.value.split('-')[1] ?? 0))

const { data, status, error, execute } = usePlatformVendorOrderDetail(vendorId, orderId)

onMounted(() => {
  if (vendorId.value && orderId.value) {
    void execute()
  }
})

const order = computed<VendorOrderDetail | null>(() => data.value?.data ?? null)
const orderType = computed(() => (order.value ? vendorOrderTypeOption(order.value.items) : null))
const commission = computed(() => order.value?.commission ?? null)
const isDefault = computed(() => commission.value?.source === 'default')
const recipient = computed(() => (commission.value && !isDefault.value ? commission.value.revenue_recipient : null))
const isManual = computed(() => commission.value?.is_manual === true)
const canAssign = computed(() => order.value?.status.value === 'completed' && isDefault.value)
/** Đơn đã chốt (hoàn thành/huỷ) là trạng thái cuối — không cho đổi nữa. */
const canChangeStatus = computed(
  () => order.value != null && !['completed', 'cancelled'].includes(order.value.status.value)
)

useSeoMeta({ title: () => `${order.value?.code ?? 'Đơn hàng vendor'} - Thần Nông` })

const toast = useToast()
const assignOpen = ref(false)
const removeOpen = ref(false)
const removing = ref(false)
const statusOpen = ref(false)

async function onAssigned(): Promise<void> {
  await execute()
}

async function onStatusUpdated(): Promise<void> {
  await execute()
}

async function confirmRemove(): Promise<void> {
  removing.value = true
  try {
    await apiRemoveVendorOrderCommission(vendorId.value, orderId.value)
    toast.add({ title: 'Đã gỡ hoa hồng gán thủ công', color: 'success', icon: 'i-lucide-check-circle' })
    removeOpen.value = false
    await execute()
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Gỡ hoa hồng thất bại'), color: 'error', icon: 'i-lucide-alert-circle' })
  } finally {
    removing.value = false
  }
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex items-start justify-between gap-4 flex-wrap">
      <div class="flex items-center gap-3 flex-wrap">
        <UButton
          icon="i-lucide-arrow-left"
          color="neutral"
          variant="ghost"
          :to="LIST_PATH"
          label="Danh sách"
        />
        <h1
          v-if="order"
          class="text-2xl font-black text-slate-900 tracking-tight font-mono"
        >
          {{ order.code }}
        </h1>
        <template v-if="order && orderType">
          <UBadge
            color="neutral"
            variant="subtle"
            :label="orderType.label"
          />
          <UBadge
            :color="vendorOrderStatusColor(order.status.value)"
            variant="subtle"
            :label="order.status.label"
          />
        </template>
      </div>

      <UButton
        v-if="canChangeStatus"
        icon="i-lucide-refresh-cw"
        label="Đổi trạng thái"
        color="neutral"
        variant="outline"
        @click="statusOpen = true"
      />
    </div>

    <!-- Loading -->
    <div
      v-if="status === 'pending' && !order"
      class="space-y-4"
    >
      <USkeleton class="h-32 w-full" />
      <USkeleton class="h-48 w-full" />
    </div>

    <!-- Not found / error -->
    <div
      v-else-if="error || !order"
      class="bg-white border border-slate-200 rounded-xl p-10 text-center shadow-sm"
    >
      <UIcon
        name="i-lucide-package-x"
        class="size-10 text-slate-300 mx-auto mb-3"
      />
      <p class="text-slate-600 mb-4">
        Không tìm thấy đơn hàng.
      </p>
      <UButton
        icon="i-lucide-list"
        label="Danh sách đơn"
        :to="LIST_PATH"
      />
    </div>

    <!-- Content -->
    <div
      v-else
      class="space-y-5"
    >
      <!-- Hoa hồng -->
      <SharedSectionCard
        title="Hoa hồng"
        compact
      >
        <template #header-actions>
          <UBadge
            v-if="isManual"
            color="warning"
            variant="subtle"
            size="sm"
            icon="i-lucide-hand-coins"
            label="Gán thủ công"
          />
          <UButton
            v-if="canAssign"
            icon="i-lucide-hand-coins"
            label="Gán hoa hồng"
            size="xs"
            @click="assignOpen = true"
          />
          <template v-if="isManual">
            <UButton
              icon="i-lucide-pencil"
              label="Sửa"
              color="neutral"
              variant="ghost"
              size="xs"
              @click="assignOpen = true"
            />
            <UButton
              icon="i-lucide-trash-2"
              color="error"
              variant="ghost"
              size="xs"
              aria-label="Gỡ hoa hồng"
              @click="removeOpen = true"
            />
          </template>
        </template>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <SharedFieldDisplay label="GMV (tổng đơn)">
            <span class="tabular-nums font-semibold">{{ formatCurrency(order.amounts.total) }}</span>
          </SharedFieldDisplay>
          <SharedFieldDisplay label="Hoa hồng">
            <span
              v-if="order.commission"
              class="tabular-nums font-semibold text-primary-700"
            >{{ formatCurrency(order.commission.amount) }}</span>
            <span
              v-else
              class="text-slate-500"
            >Không áp dụng</span>
          </SharedFieldDisplay>
          <SharedFieldDisplay label="Thuộc về">
            <UBadge
              v-if="recipient"
              :color="revenueRecipientColor(recipient.value)"
              variant="subtle"
              size="sm"
              :label="recipient.label"
            />
            <span
              v-else
              class="text-slate-400"
            >—</span>
          </SharedFieldDisplay>
        </div>

        <VendorOrderCommissionBreakdown
          :commission="order.commission"
          :vendor-id="vendorId"
          :project-id="order.project.id"
          scope="platform"
        />
      </SharedSectionCard>

      <!-- Vendor & dự án -->
      <SharedSectionCard
        title="Vendor & Dự án"
        compact
      >
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SharedFieldDisplay label="Vendor">
            <NuxtLink
              :to="`${VENDOR_BASE}/${vendorId}`"
              class="text-primary-700 hover:underline font-medium"
            >
              Mở trang vendor
            </NuxtLink>
          </SharedFieldDisplay>
          <SharedFieldDisplay label="Dự án">
            <NuxtLink
              v-if="order.project.id"
              :to="`${PROJECT_BASE}/${order.project.id}`"
              class="text-primary-700 hover:underline"
            >
              {{ order.project.name }}
            </NuxtLink>
            <span v-else>{{ order.project.name }}</span>
          </SharedFieldDisplay>
          <SharedFieldDisplay label="Công ty VH">
            <span v-if="order.tenant?.name">{{ order.tenant.name }}</span>
            <span class="text-xs text-slate-500 font-mono block">{{ order.tenant?.id ?? '—' }}</span>
          </SharedFieldDisplay>
        </div>
      </SharedSectionCard>

      <!-- Khách hàng & giao hàng -->
      <SharedSectionCard
        title="Khách hàng & Giao hàng"
        compact
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SharedFieldDisplay label="Họ tên">
            {{ order.customer?.name ?? order.contact.name ?? '—' }}
          </SharedFieldDisplay>
          <SharedFieldDisplay label="SĐT">
            {{ order.customer?.phone ?? order.contact.phone ?? '—' }}
          </SharedFieldDisplay>
          <SharedFieldDisplay label="Email">
            {{ order.customer?.email ?? order.contact.email ?? '—' }}
          </SharedFieldDisplay>
          <SharedFieldDisplay label="Mã căn hộ">
            {{ order.contact.apartment_code ?? '—' }}
          </SharedFieldDisplay>
          <SharedFieldDisplay
            label="Địa chỉ giao"
            class="sm:col-span-2"
          >
            {{ order.contact.shipping_address ?? '—' }}
          </SharedFieldDisplay>
        </div>
      </SharedSectionCard>

      <!-- Dòng đơn -->
      <SharedSectionCard
        title="Dòng đơn"
        compact
      >
        <VendorOrderItemsTable :items="order.items" />
      </SharedSectionCard>

      <!-- Thanh toán -->
      <SharedSectionCard
        title="Thanh toán"
        compact
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <SharedFieldDisplay label="Trạng thái thanh toán">
            <UBadge
              :color="order.payment_status.value === 'paid' ? 'success' : 'neutral'"
              variant="subtle"
              size="sm"
              :label="order.payment_status.label"
            />
          </SharedFieldDisplay>
          <SharedFieldDisplay label="Phương thức">
            {{ order.payment_method ?? '—' }}
          </SharedFieldDisplay>
        </div>
        <dl class="text-sm space-y-1">
          <div class="flex justify-between">
            <dt class="text-slate-600">
              Tạm tính
            </dt>
            <dd class="tabular-nums">
              {{ formatCurrency(order.amounts.subtotal) }}
            </dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-slate-600">
              Phí giao
            </dt>
            <dd class="tabular-nums">
              {{ formatCurrency(order.amounts.shipping_fee) }}
            </dd>
          </div>
          <div
            v-if="order.amounts.deposit_total > 0"
            class="flex justify-between"
          >
            <dt class="text-slate-600">
              Đặt cọc
            </dt>
            <dd class="tabular-nums">
              {{ formatCurrency(order.amounts.deposit_total) }}
            </dd>
          </div>
          <div
            v-if="order.amounts.discount_total > 0"
            class="flex justify-between text-error-600"
          >
            <dt>Giảm giá</dt>
            <dd class="tabular-nums">
              -{{ formatCurrency(order.amounts.discount_total) }}
            </dd>
          </div>
          <div class="border-t border-slate-200 pt-2 mt-2 flex justify-between text-base">
            <dt class="font-semibold">
              TỔNG
            </dt>
            <dd class="font-bold text-slate-900 tabular-nums">
              {{ formatCurrency(order.amounts.total) }}
            </dd>
          </div>
        </dl>
      </SharedSectionCard>

      <!-- Mốc thời gian -->
      <SharedSectionCard
        title="Mốc thời gian"
        compact
      >
        <ul class="text-sm space-y-1">
          <li
            v-if="order.timeline.ordered_at"
            class="flex justify-between"
          >
            <span class="text-slate-600">Đặt đơn</span>
            <span>{{ formatDateTime(order.timeline.ordered_at) }}</span>
          </li>
          <li
            v-if="order.timeline.confirmed_at"
            class="flex justify-between"
          >
            <span class="text-slate-600">Xác nhận</span>
            <span>{{ formatDateTime(order.timeline.confirmed_at) }}</span>
          </li>
          <li
            v-if="order.timeline.completed_at"
            class="flex justify-between font-medium text-success-700"
          >
            <span>Hoàn thành</span>
            <span>{{ formatDateTime(order.timeline.completed_at) }}</span>
          </li>
          <li
            v-if="order.timeline.cancelled_at"
            class="flex justify-between font-medium text-error-700"
          >
            <span>Huỷ</span>
            <span>{{ formatDateTime(order.timeline.cancelled_at) }}</span>
          </li>
        </ul>
      </SharedSectionCard>

      <!-- Đánh giá cư dân -->
      <SharedSectionCard
        title="Đánh giá cư dân"
        compact
      >
        <p class="text-sm text-slate-400 italic">
          Chưa có đánh giá.
        </p>
      </SharedSectionCard>

      <VendorOrderStatusChangeModal
        v-model:open="statusOpen"
        :partner-id="vendorId"
        :order-id="orderId"
        :current-status="order.status.value"
        @updated="onStatusUpdated"
      />

      <VendorOrderCommissionAssignModal
        v-model:open="assignOpen"
        :partner-id="vendorId"
        :order-id="orderId"
        :commission="order.commission"
        @assigned="onAssigned"
      />

      <UModal
        v-model:open="removeOpen"
        title="Gỡ hoa hồng gán thủ công"
        description="Đơn sẽ trở lại trạng thái chưa có hoa hồng. Bạn có thể gán lại sau."
      >
        <template #footer>
          <div class="flex justify-end gap-2 w-full">
            <UButton
              color="neutral"
              variant="ghost"
              label="Huỷ"
              @click="removeOpen = false"
            />
            <UButton
              color="error"
              label="Gỡ hoa hồng"
              icon="i-lucide-trash-2"
              :loading="removing"
              @click="confirmRemove"
            />
          </div>
        </template>
      </UModal>
    </div>
  </div>
</template>
