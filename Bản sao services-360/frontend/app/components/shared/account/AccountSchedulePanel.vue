<script setup lang="ts">
import type { SlotDetailParams } from '~/composables/api/useScheduleSlots'

interface Props {
  accountId: number | null
  showAccountSummary?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showAccountSummary: false
})

const selectedMonth = ref(currentYearMonth())

const scheduleParams = computed(() => {
  if (!props.accountId) return null
  return {
    account_id: props.accountId,
    month: selectedMonth.value
  }
})

const { data, status, error, execute } = usePersonalSchedule(scheduleParams)

watch(scheduleParams, async (next) => {
  if (next) await execute()
}, { immediate: true })

const payload = computed(() => data.value?.data ?? null)
const monthTitle = computed(() => formatMonthTitle(selectedMonth.value))
const scheduleAccount = computed(() => payload.value?.account ?? null)

const drawerOpen = ref(false)
const drawerParams = ref<SlotDetailParams | null>(null)

function openSlotDrawer(params: { date: string, shift_id: number }) {
  if (!props.accountId) return
  drawerParams.value = {
    account_id: props.accountId,
    date: params.date,
    shift_id: params.shift_id
  }
  drawerOpen.value = true
}

const unscheduledDrawerOpen = ref(false)
const unscheduledDate = ref<string | null>(null)
const unscheduledTickets = computed(() =>
  unscheduledDate.value ? (payload.value?.unscheduled_cards?.[unscheduledDate.value] ?? []) : []
)

function openUnscheduledDrawer(date: string) {
  unscheduledDate.value = date
  unscheduledDrawerOpen.value = true
}
</script>

<template>
  <div class="space-y-4">
    <div
      v-if="showAccountSummary && scheduleAccount"
      class="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4"
    >
      <div class="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
        {{ scheduleAccount.name.charAt(0).toUpperCase() }}
      </div>
      <div class="flex-1 min-w-0">
        <div class="font-medium text-default">
          {{ scheduleAccount.name }}
        </div>
        <div class="text-sm text-muted">
          Mã NV: <span class="font-mono">{{ scheduleAccount.employee_code || '—' }}</span>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-4">
      <UFormField label="Tháng">
        <ScheduleMonthPicker v-model="selectedMonth" />
      </UFormField>
      <div class="sm:ml-auto sm:mb-1 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-600">
        <span class="inline-flex items-center gap-1.5">
          <span class="inline-block size-3 rounded-sm border border-sky-300 bg-sky-50" />
          Ca sáng
        </span>
        <span class="inline-flex items-center gap-1.5">
          <span class="inline-block size-3 rounded-sm border border-amber-300 bg-amber-50" />
          Ca chiều
        </span>
        <span class="inline-flex items-center gap-1.5">
          <span class="inline-block size-3 rounded-sm border border-violet-300 bg-violet-50" />
          Ca tối
        </span>
        <span class="inline-flex items-center gap-1">
          <span class="inline-flex items-center gap-0.5 rounded bg-white border border-slate-200 px-1 py-[1px] text-[9px] font-bold tracking-wide">
            <UIcon
              name="i-lucide-building-2"
              class="size-2.5"
            />
            HR
          </span>
          đã đăng ký
        </span>
        <span class="inline-flex items-center gap-1.5">
          <span class="inline-block size-3 rounded-sm border border-rose-400 bg-rose-50 ring-1 ring-rose-300" />
          <span class="text-rose-600 font-medium">Chồng chéo thời gian</span>
        </span>
      </div>
    </div>

    <UAlert
      v-if="error"
      color="error"
      variant="subtle"
      title="Không tải được lịch"
      :description="error.message"
    />

    <div
      v-if="status === 'pending'"
      class="rounded-xl border border-neutral-200 bg-white p-4"
    >
      <div class="grid grid-cols-7 gap-1 min-w-[840px]">
        <USkeleton
          v-for="n in 35"
          :key="n"
          class="h-[110px] w-full"
        />
      </div>
    </div>
    <SchedulePersonalCalendarGrid
      v-else
      :payload="payload"
      :month="selectedMonth"
      :month-title="monthTitle"
      @click-slot="openSlotDrawer"
      @click-unscheduled="openUnscheduledDrawer"
    />

    <ScheduleSlotDetailDrawer
      v-model:open="drawerOpen"
      :params="drawerParams"
    />

    <ScheduleUnscheduledDetailDrawer
      v-model:open="unscheduledDrawerOpen"
      :date="unscheduledDate"
      :tickets="unscheduledTickets"
      :account-name="scheduleAccount?.name ?? null"
    />
  </div>
</template>
