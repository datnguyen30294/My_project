<script setup lang="ts">
import type { ProjectOrderResource } from '~/composables/api/usePlatformProjects'

interface Props {
  open: boolean
  order: ProjectOrderResource | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [boolean]
}>()

const order = computed(() => props.order)
</script>

<template>
  <UModal
    :open="open"
    :title="order ? `Đơn hàng ${order.code}` : 'Chi tiết đơn hàng'"
    description="Số liệu đơn hàng PMC của dự án xem từ cổng platform."
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <div
        v-if="order"
        class="grid grid-cols-1 sm:grid-cols-2 gap-5"
      >
        <SharedFieldDisplay label="Mã đơn">
          <span class="font-mono">{{ order.code }}</span>
        </SharedFieldDisplay>
        <SharedFieldDisplay label="Trạng thái">
          <UBadge
            color="neutral"
            variant="subtle"
            :label="order.status.label"
          />
        </SharedFieldDisplay>
        <SharedFieldDisplay label="Giá trị đơn">
          <span class="font-semibold tabular-nums text-slate-900">{{ formatCurrency(Number(order.total_amount)) }}</span>
        </SharedFieldDisplay>
        <SharedFieldDisplay label="Phí platform">
          <span class="font-semibold tabular-nums text-emerald-600">{{ formatCurrency(Number(order.platform_fee)) }}</span>
        </SharedFieldDisplay>
        <SharedFieldDisplay
          label="Thời gian hoàn thành"
          class="sm:col-span-2"
        >
          <span v-if="order.completed_at">{{ formatDateTime(order.completed_at) }}</span>
          <span
            v-else
            class="text-slate-400"
          >Chưa hoàn thành</span>
        </SharedFieldDisplay>
      </div>

      <UAlert
        color="info"
        variant="subtle"
        icon="i-lucide-info"
        class="mt-4"
        description="Phí platform là số đã đóng băng tại kỳ chốt phí. Đơn chưa vào kỳ chốt hiển thị 0."
      />
    </template>

    <template #footer>
      <div class="flex justify-end w-full">
        <UButton
          label="Đóng"
          color="neutral"
          variant="outline"
          @click="emit('update:open', false)"
        />
      </div>
    </template>
  </UModal>
</template>
