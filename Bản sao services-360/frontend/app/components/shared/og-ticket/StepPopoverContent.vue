<script setup lang="ts">
import type { StepData } from '~/composables/useOgTicketLifecycle'

interface Props {
  step: { value: string, title: string }
  stepData: StepData | undefined
  currentStatus: string
  canTransition: boolean
  isBacktrack: boolean
  ogTicketId: number
  activeQuoteId: number | null
  needsAssignment: boolean
  accountOptions: Array<{ label: string, value: number, capability_rating?: number | null }>
  currentAssigneeIds: number[]
  hasActiveOrder: boolean
  isTerminal: boolean
}

const props = defineProps<Props>()

const reversedVisits = computed(() =>
  [...(props.stepData?.visits ?? [])].reverse()
)
const emit = defineEmits<{
  'transition': []
  'assign': [ids: number[]]
  'create-order': [note: string]
}>()

function sameIds(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false
  const sortedA = [...a].sort((x, y) => x - y)
  const sortedB = [...b].sort((x, y) => x - y)
  return sortedA.every((v, i) => v === sortedB[i])
}

function onAssigneesChange(ids: number[]) {
  if (ids.length === 0) return
  if (sameIds(ids, props.currentAssigneeIds)) return
  emit('assign', ids)
}
</script>

<template>
  <div class="w-72 p-3">
    <!-- Header -->
    <div class="flex items-center justify-between mb-2">
      <span class="font-semibold text-sm text-slate-900">{{ step.title }}</span>
      <span
        v-if="stepData && stepData.totalVisits > 0"
        class="text-xs text-slate-500"
      >{{ stepData.totalVisits }} lần</span>
    </div>

    <!-- No visits -->
    <template v-if="!stepData || stepData.totalVisits === 0">
      <p class="text-xs text-slate-400 italic">
        Chưa tới giai đoạn này
      </p>
      <NuxtLink
        v-if="step.value === 'quoted' && !activeQuoteId && !isTerminal"
        :to="`/pmc/quotes/create?og_ticket_id=${ogTicketId}`"
      >
        <UButton
          label="Tạo báo giá"
          icon="i-lucide-file-plus"
          color="primary"
          size="sm"
          block
          class="mt-2"
        />
      </NuxtLink>
      <NuxtLink
        v-if="step.value === 'quoted' && activeQuoteId"
        :to="`/pmc/quotes/${activeQuoteId}`"
      >
        <UButton
          label="Xem báo giá hiện tại"
          icon="i-lucide-external-link"
          color="primary"
          variant="soft"
          size="sm"
          block
          class="mt-2"
        />
      </NuxtLink>
      <UButton
        v-if="step.value === 'ordered' && !hasActiveOrder"
        label="Tạo đơn hàng"
        icon="i-lucide-shopping-cart"
        color="primary"
        size="sm"
        block
        class="mt-2"
        @click="emit('create-order', '')"
      />
    </template>

    <!-- Visits -->
    <div
      v-else
      class="flex flex-col gap-3"
    >
      <!-- Lifecycle visits -->
      <div>
        <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
          Vòng đời
        </div>
        <div class="max-h-36 overflow-y-auto flex flex-col gap-1.5">
          <div
            v-for="(visit, vi) in reversedVisits"
            :key="visit.segment.id"
            class="rounded-lg border p-2 text-xs transition-opacity"
            :class="visit.isActive
              ? 'border-primary-200 bg-primary-50/50'
              : 'border-slate-200 bg-slate-50/50 opacity-50'"
          >
            <div class="flex items-center justify-between mb-1">
              <span class="font-medium text-slate-700">Lần {{ reversedVisits.length - vi }}</span>
              <UBadge
                :label="visit.isActive ? 'Đang diễn ra' : 'Đã qua'"
                :color="visit.isActive ? 'primary' : 'neutral'"
                variant="subtle"
                size="xs"
              />
            </div>
            <div class="flex flex-col gap-0.5 text-slate-600">
              <div class="flex items-center gap-1.5">
                <UIcon
                  name="i-lucide-clock"
                  class="size-3 text-slate-400 shrink-0"
                />
                <span>
                  {{ formatShortDateTime(visit.segment.started_at) }}
                  &rarr;
                  {{ visit.isActive ? 'đang mở' : formatShortDateTime(visit.segment.ended_at) }}
                </span>
              </div>
              <div class="flex items-center gap-1.5">
                <UIcon
                  name="i-lucide-timer"
                  class="size-3 text-slate-400 shrink-0"
                />
                <span>{{ visit.durationLabel }}</span>
              </div>
              <div
                v-if="visit.segment.assignee"
                class="flex items-center gap-1.5"
              >
                <UIcon
                  name="i-lucide-user"
                  class="size-3 text-slate-400 shrink-0"
                />
                <span>{{ visit.segment.assignee.name }}</span>
              </div>
              <div
                v-if="visit.segment.note"
                class="flex items-start gap-1.5 mt-0.5"
              >
                <UIcon
                  name="i-lucide-message-square"
                  class="size-3 text-slate-400 shrink-0 mt-0.5"
                />
                <span class="text-slate-500 italic">{{ visit.segment.note }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quote history -->
      <template v-if="stepData.quotes && stepData.quotes.length > 0 && (step.value === 'quoted' || step.value === 'approved')">
        <USeparator />
        <div>
          <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Lịch sử báo giá
          </div>
          <div class="max-h-36 overflow-y-auto flex flex-col gap-1.5">
            <div
              v-for="quote in stepData.quotes"
              :key="quote.id"
              class="rounded-lg border border-slate-200 p-2 text-xs transition-opacity"
              :class="quote.is_active ? '' : 'opacity-50'"
            >
              <div class="flex items-center justify-between">
                <NuxtLink
                  :to="`/pmc/quotes/${quote.id}`"
                  class="font-mono font-semibold text-primary-600 hover:underline"
                >{{ quote.code }}</NuxtLink>
                <UBadge
                  :label="quote.status.label"
                  :color="quoteStatusColor(quote.status.value)"
                  variant="subtle"
                  size="xs"
                />
              </div>
              <div class="flex items-center justify-between mt-1">
                <span class="text-slate-600">{{ formatCurrency(quote.total_amount) }}</span>
                <UBadge
                  :label="quote.is_active ? 'Còn hiệu lực' : 'Hết hiệu lực'"
                  :color="quote.is_active ? 'success' : 'neutral'"
                  variant="subtle"
                  size="xs"
                />
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Quote actions (independent of quote history) -->
      <div
        v-if="step.value === 'quoted'"
        class="flex flex-col gap-1.5 mt-2"
      >
        <NuxtLink
          v-if="activeQuoteId"
          :to="`/pmc/quotes/${activeQuoteId}`"
        >
          <UButton
            label="Xem báo giá hiện tại"
            icon="i-lucide-external-link"
            color="primary"
            variant="soft"
            size="xs"
            block
          />
        </NuxtLink>
        <NuxtLink
          v-if="!isTerminal"
          :to="`/pmc/quotes/create?og_ticket_id=${ogTicketId}`"
        >
          <UButton
            :label="activeQuoteId ? 'Tạo báo giá mới' : 'Tạo báo giá'"
            icon="i-lucide-file-plus"
            :color="activeQuoteId ? 'warning' : 'primary'"
            :variant="activeQuoteId ? 'soft' : 'solid'"
            size="xs"
            block
          />
        </NuxtLink>
      </div>

      <!-- Order history -->
      <template v-if="stepData.orders && stepData.orders.length > 0 && step.value === 'ordered'">
        <USeparator />
        <div>
          <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Lịch sử đơn hàng
          </div>
          <div class="max-h-36 overflow-y-auto flex flex-col gap-1.5">
            <div
              v-for="order in stepData.orders"
              :key="order.id"
              class="rounded-lg border border-slate-200 p-2 text-xs transition-opacity"
              :class="order.status.value === 'cancelled' ? 'opacity-50' : ''"
            >
              <div class="flex items-center justify-between">
                <span class="font-mono font-semibold text-slate-700">{{ order.code }}</span>
                <UBadge
                  :label="order.status.label"
                  :color="orderStatusColor(order.status.value)"
                  variant="subtle"
                  size="xs"
                />
              </div>
              <NuxtLink
                :to="`/pmc/orders/${order.id}`"
                class="text-primary-500 hover:text-primary-600 text-[11px] mt-1 inline-flex items-center gap-0.5"
              >
                Xem chi tiết
                <UIcon
                  name="i-lucide-external-link"
                  class="size-3"
                />
              </NuxtLink>
            </div>
          </div>
        </div>
      </template>

      <!-- Create order button (for "ordered" step, no active order) -->
      <UButton
        v-if="step.value === 'ordered' && !hasActiveOrder"
        label="Tạo đơn hàng"
        icon="i-lucide-shopping-cart"
        color="primary"
        size="xs"
        block
        class="mt-2"
        @click="emit('create-order', '')"
      />
    </div>

    <!-- Assignment UI (received → assigned) — change applies immediately -->
    <div
      v-if="needsAssignment"
      class="mt-3 pt-3 border-t border-slate-200"
    >
      <p class="text-xs font-medium text-slate-700 mb-1.5">
        Chọn người thi công
      </p>
      <USelectMenu
        :model-value="currentAssigneeIds"
        :items="accountOptions"
        value-key="value"
        multiple
        placeholder="Chọn người thi công..."
        class="w-full"
        size="sm"
        @update:model-value="onAssigneesChange"
      >
        <template #item-trailing="{ item }">
          <SharedCapabilityRatingBadge
            v-if="(item as { capability_rating?: number | null }).capability_rating != null"
            :rating="(item as { capability_rating?: number | null }).capability_rating"
            size="xs"
          />
        </template>
      </USelectMenu>
    </div>

    <!-- Transition button -->
    <div
      v-if="canTransition"
      class="mt-3 pt-3 border-t border-slate-200"
    >
      <UAlert
        v-if="isBacktrack && step.value !== 'quoted'"
        icon="i-lucide-alert-triangle"
        color="warning"
        variant="subtle"
        description="Báo giá và đơn hàng hiện tại sẽ bị huỷ."
        class="mb-2"
      />
      <UButton
        :label="isBacktrack ? `Quay lại ${step.title}` : `Chuyển sang ${step.title}`"
        :icon="isBacktrack ? 'i-lucide-undo-2' : 'i-lucide-arrow-right'"
        :color="isBacktrack ? 'warning' : 'primary'"
        size="sm"
        block
        @click="emit('transition')"
      />
    </div>
  </div>
</template>
