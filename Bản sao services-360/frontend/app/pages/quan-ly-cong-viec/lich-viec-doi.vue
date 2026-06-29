<script setup lang="ts">
import type { SlotDetailParams, TeamScheduleParams } from '~/composables/api/useScheduleSlots'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()

// --- Filter state ---
const selectedMonth = ref(currentYearMonth())
const selectedProjectId = ref<number | null>(null)
const selectedAccountIds = ref<number[]>([])
const onlyConflicts = ref(false)

// --- URL sync (init) ---
if (typeof route.query.month === 'string' && /^\d{4}-\d{2}$/.test(route.query.month)) {
  selectedMonth.value = route.query.month
}
if (route.query.project_id) {
  const n = Number(route.query.project_id)
  if (!Number.isNaN(n)) selectedProjectId.value = n
}
if (route.query.account_ids) {
  const raw = Array.isArray(route.query.account_ids) ? route.query.account_ids : [route.query.account_ids]
  selectedAccountIds.value = raw
    .map(v => Number(v))
    .filter(n => !Number.isNaN(n))
}
if (route.query.only_conflicts === '1') {
  onlyConflicts.value = true
}

// --- URL sync (watch) ---
const isInit = ref(true)
nextTick(() => {
  isInit.value = false
})

watch(
  [selectedMonth, selectedProjectId, selectedAccountIds, onlyConflicts],
  () => {
    if (isInit.value) return
    const query: Record<string, string | string[]> = {}
    if (selectedMonth.value && selectedMonth.value !== currentYearMonth()) {
      query.month = selectedMonth.value
    }
    if (selectedProjectId.value != null) {
      query.project_id = String(selectedProjectId.value)
    }
    if (selectedAccountIds.value.length > 0) {
      query.account_ids = selectedAccountIds.value.map(String)
    }
    if (onlyConflicts.value) {
      query.only_conflicts = '1'
    }
    router.replace({ query })
  },
  { deep: true }
)

const scheduleParams = computed<TeamScheduleParams>(() => ({
  month: selectedMonth.value,
  project_id: selectedProjectId.value ?? undefined,
  account_ids: selectedAccountIds.value.length ? selectedAccountIds.value : undefined
}))

const { data, status, error } = useTeamSchedule(scheduleParams)

const payload = computed(() => data.value?.data ?? null)

const toast = useToast()

const tooManyAccounts = ref(false)

watch(error, (err) => {
  if (!err) {
    tooManyAccounts.value = false
    return
  }
  const status = (err as { statusCode?: number, status?: number }).statusCode
    ?? (err as { status?: number }).status
  if (status === 422) {
    tooManyAccounts.value = true
    const data = (err as { data?: { message?: string } }).data
    toast.add({
      color: 'warning',
      title: 'Quá nhiều nhân viên',
      description: data?.message ?? 'Vui lòng lọc theo dự án hoặc chọn nhân viên cụ thể.'
    })
  } else {
    tooManyAccounts.value = false
  }
})

// Slot drawer
const drawerOpen = ref(false)
const drawerParams = ref<SlotDetailParams | null>(null)

function openSlotDrawer(params: { account_id: number, date: string, shift_id: number }) {
  drawerParams.value = params
  drawerOpen.value = true
}

// Unscheduled drawer
const unscheduledDrawerOpen = ref(false)
const unscheduledCtx = ref<{ account_id: number, date: string } | null>(null)

const unscheduledTickets = computed(() => {
  const ctx = unscheduledCtx.value
  if (!ctx) return []
  return payload.value?.unscheduled_cards_by_account?.[ctx.account_id]?.[ctx.date] ?? []
})

const unscheduledAccountName = computed(() => {
  const ctx = unscheduledCtx.value
  if (!ctx) return null
  return payload.value?.accounts.find(a => a.id === ctx.account_id)?.name ?? null
})

function openUnscheduledDrawer(ctx: { account_id: number, date: string }) {
  unscheduledCtx.value = ctx
  unscheduledDrawerOpen.value = true
}
</script>

<template>
  <div class="space-y-4">
    <SharedCrudPageHeader
      title="Lịch việc đội"
      description="Ma trận lịch của tất cả nhân sự theo ngày × ca trong tháng"
    />

    <ScheduleFilterBar>
      <UFormField
        label="Dự án"
        class="min-w-[220px]"
      >
        <SharedProjectSelect
          :model-value="selectedProjectId"
          placeholder="Tất cả dự án"
          @update:model-value="selectedProjectId = $event"
        />
      </UFormField>
      <UFormField label="Tháng">
        <ScheduleMonthPicker v-model="selectedMonth" />
      </UFormField>
      <UFormField
        label="Nhân sự"
        class="min-w-[260px]"
      >
        <SharedAccountMultiSelect
          :model-value="selectedAccountIds"
          placeholder="Tất cả nhân sự"
          @update:model-value="selectedAccountIds = $event"
        />
      </UFormField>
      <UFormField label="Lọc chồng chéo">
        <UCheckbox
          v-model="onlyConflicts"
          label="Chỉ nhân sự có ca chồng chéo"
        />
      </UFormField>
      <div class="ml-auto mb-1 flex flex-wrap items-center gap-3 text-xs text-slate-600">
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
          <span class="inline-flex items-center gap-0.5 rounded bg-white/90 border border-slate-200 px-1 py-[1px] text-[9px] font-bold tracking-wide">
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
    </ScheduleFilterBar>

    <UAlert
      v-if="tooManyAccounts"
      color="warning"
      variant="subtle"
      icon="i-lucide-triangle-alert"
      title="Quá nhiều nhân viên"
      description="Vui lòng lọc theo dự án hoặc chọn nhân viên cụ thể để thu hẹp danh sách."
    />

    <UAlert
      v-else-if="error && !tooManyAccounts"
      color="error"
      variant="subtle"
      :title="'Không tải được lịch đội'"
      :description="error.message"
    />

    <div
      v-else-if="status === 'pending'"
      class="flex flex-col gap-1 rounded-xl border border-border-gray bg-white p-2"
    >
      <USkeleton
        v-for="n in 6"
        :key="n"
        class="h-[72px] w-full"
      />
    </div>

    <ScheduleTeamMatrixTable
      v-else
      :payload="payload"
      :only-conflicts="onlyConflicts"
      @click-slot="openSlotDrawer"
      @click-unscheduled="openUnscheduledDrawer"
    />

    <ScheduleSlotDetailDrawer
      v-model:open="drawerOpen"
      :params="drawerParams"
    />

    <ScheduleUnscheduledDetailDrawer
      v-model:open="unscheduledDrawerOpen"
      :date="unscheduledCtx?.date ?? null"
      :tickets="unscheduledTickets"
      :account-name="unscheduledAccountName"
    />
  </div>
</template>
