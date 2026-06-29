<script setup lang="ts">
import type { VendorOrderDetail } from '~/composables/api/useVendorOrders'
import {
  usePlatformVendorOrderDetail,
  useVendorOrderDetail
} from '~/composables/api/useVendorOrders'

interface Props {
  open: boolean
  partnerId: number | string
  orderId: number | string | null
  scope?: 'tenant' | 'platform'
}

const props = withDefaults(defineProps<Props>(), { scope: 'tenant' })

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const orderIdRef = computed(() => props.orderId)
const { data, status, error, execute } = props.scope === 'platform'
  ? usePlatformVendorOrderDetail(() => props.partnerId, orderIdRef)
  : useVendorOrderDetail(() => props.partnerId, orderIdRef)

watch(() => [props.open, props.orderId], async ([open, id]) => {
  if (open && id) {
    await execute()
  }
}, { immediate: true })

const order = computed<VendorOrderDetail | null>(() => data.value?.data ?? null)

function close() {
  emit('update:open', false)
}
</script>

<template>
  <UDrawer
    :open="open"
    direction="right"
    @update:open="(v: boolean) => emit('update:open', v)"
  >
    <template #content>
      <div class="w-screen max-w-2xl h-full flex flex-col bg-white">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-slate-200">
          <div class="flex items-center gap-3 flex-wrap">
            <h2 class="text-lg font-bold text-slate-900 font-mono">
              {{ order?.code ?? 'Đang tải...' }}
            </h2>
            <UBadge
              v-if="order"
              color="success"
              variant="subtle"
            >
              {{ order.status.label }}
            </UBadge>
            <UBadge
              v-if="order"
              :color="order.payment_status.value === 'paid' ? 'success' : 'neutral'"
              variant="outline"
            >
              {{ order.payment_status.label }}
            </UBadge>
          </div>
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            aria-label="Đóng"
            @click="close"
          />
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto p-4 space-y-5">
          <div
            v-if="status === 'pending' && !order"
            class="space-y-3"
          >
            <div class="h-20 bg-slate-100 rounded-xl animate-pulse" />
            <div class="h-40 bg-slate-100 rounded-xl animate-pulse" />
            <div class="h-32 bg-slate-100 rounded-xl animate-pulse" />
          </div>

          <UAlert
            v-else-if="error && !order"
            color="error"
            variant="subtle"
            icon="i-lucide-alert-circle"
            description="Không thể tải chi tiết đơn hàng."
          />

          <template v-else-if="order">
            <!-- Scope: tenant + project (platform) -->
            <SharedSectionCard
              v-if="scope === 'platform'"
              title="Phạm vi"
              compact
            >
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SharedFieldDisplay label="Tenant (PMC)">
                  <span v-if="order.tenant?.name">{{ order.tenant.name }}</span>
                  <span class="text-xs text-slate-500 font-mono block">{{ order.tenant?.id ?? '—' }}</span>
                </SharedFieldDisplay>
                <SharedFieldDisplay label="Dự án">
                  {{ order.project.name }}
                </SharedFieldDisplay>
              </div>
            </SharedSectionCard>

            <!-- Section 1: Khách hàng & giao hàng -->
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

            <!-- Section 2: Sản phẩm -->
            <SharedSectionCard
              title="Sản phẩm"
              compact
            >
              <VendorOrderItemsTable :items="order.items" />
            </SharedSectionCard>

            <!-- Section 3: Tổng kết tiền -->
            <SharedSectionCard
              title="Tổng kết"
              compact
            >
              <dl class="text-sm space-y-1">
                <div class="flex justify-between">
                  <dt class="text-slate-600">
                    Tạm tính
                  </dt>
                  <dd>{{ formatCurrency(order.amounts.subtotal) }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-slate-600">
                    Phí ship
                  </dt>
                  <dd>{{ formatCurrency(order.amounts.shipping_fee) }}</dd>
                </div>
                <div
                  v-if="order.amounts.deposit_total > 0"
                  class="flex justify-between"
                >
                  <dt class="text-slate-600">
                    Đặt cọc
                  </dt>
                  <dd>{{ formatCurrency(order.amounts.deposit_total) }}</dd>
                </div>
                <div
                  v-if="order.amounts.discount_total > 0"
                  class="flex justify-between text-error-600"
                >
                  <dt>Giảm giá</dt>
                  <dd>-{{ formatCurrency(order.amounts.discount_total) }}</dd>
                </div>
                <div class="border-t border-slate-200 pt-2 mt-2 flex justify-between text-base">
                  <dt class="font-semibold">
                    TỔNG
                  </dt>
                  <dd class="font-bold text-slate-900">
                    {{ formatCurrency(order.amounts.total) }}
                    <UBadge
                      v-if="order.amounts.total_overridden"
                      color="warning"
                      variant="subtle"
                      size="sm"
                      class="ml-2"
                    >
                      Đã điều chỉnh tay
                    </UBadge>
                  </dd>
                </div>
              </dl>
            </SharedSectionCard>

            <!-- Section 4: Commission breakdown -->
            <SharedSectionCard
              title="Hoa hồng PMC"
              compact
            >
              <VendorOrderCommissionBreakdown
                :commission="order.commission"
                :vendor-id="props.partnerId"
                :project-id="order.project.id"
                :scope="scope"
              />
            </SharedSectionCard>

            <!-- Section 5: Timeline -->
            <SharedSectionCard
              title="Lịch sử trạng thái"
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
              </ul>
            </SharedSectionCard>
          </template>
        </div>
      </div>
    </template>
  </UDrawer>
</template>
