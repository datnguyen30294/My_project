<script setup lang="ts">
import type { SlotDetailParams } from '~/composables/api/useScheduleSlots'

interface Props {
  open: boolean
  params: SlotDetailParams | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const openModel = computed({
  get: () => props.open,
  set: (v: boolean) => emit('update:open', v)
})

const paramsRef = computed(() => props.params)
const { data, status, error, execute } = useSlotDetail(paramsRef)

watch(paramsRef, async (next) => {
  if (next) await execute()
})

const detail = computed(() => data.value?.data ?? null)

const shiftTitle = computed(() => {
  const d = detail.value
  if (!d) return ''
  return d.shift.name
})

const formattedDate = computed(() => {
  const d = detail.value
  if (!d) return ''
  const [y, m, day] = d.date.split('-')
  return `${day}/${m}/${y}`
})

const shiftWindow = computed(() => {
  const d = detail.value
  if (!d) return ''
  return `${d.shift_window.start} – ${d.shift_window.end}`
})

function statusColor(value: string): 'success' | 'warning' | 'neutral' | 'info' | 'error' | 'primary' {
  const v = value.toUpperCase()
  if (v.includes('COMPLETED') || v === 'DONE' || v === 'RESOLVED') return 'success'
  if (v.includes('CANCEL')) return 'error'
  if (v.includes('PENDING') || v.includes('WAITING')) return 'warning'
  if (v.includes('PROGRESS') || v.includes('DOING')) return 'info'
  return 'neutral'
}

function priorityColor(value: string): 'error' | 'warning' | 'info' | 'neutral' {
  const v = value.toUpperCase()
  if (v.includes('URGENT') || v.includes('CRITICAL')) return 'error'
  if (v.includes('HIGH')) return 'warning'
  if (v.includes('LOW')) return 'neutral'
  return 'info'
}

function formatAssignedAt(iso: string): string {
  return formatShortDateTime(iso)
}
</script>

<template>
  <USlideover
    v-model:open="openModel"
    side="right"
    :ui="{ content: 'max-w-lg' }"
  >
    <template #header>
      <div class="flex items-start justify-between w-full gap-3">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <UIcon
              name="i-lucide-calendar-clock"
              class="size-4 text-primary"
            />
            <h3 class="font-bold text-slate-900 text-base truncate">
              {{ shiftTitle || 'Chi tiết ca' }}
              <span
                v-if="formattedDate"
                class="font-normal text-slate-500"
              >· {{ formattedDate }}</span>
            </h3>
          </div>
          <div
            v-if="detail"
            class="mt-1 text-xs text-slate-500"
          >
            {{ detail.account.name }} ({{ detail.account.employee_code }}) · {{ shiftWindow }}
          </div>
        </div>
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          size="sm"
          @click="openModel = false"
        />
      </div>
    </template>

    <template #body>
      <div
        v-if="status === 'pending'"
        class="space-y-3"
      >
        <USkeleton class="h-24 w-full" />
        <USkeleton class="h-24 w-full" />
      </div>
      <UAlert
        v-else-if="error"
        color="error"
        variant="subtle"
        :title="'Không tải được chi tiết ca'"
        :description="error.message"
      />
      <div
        v-else-if="detail"
        class="space-y-5"
      >
        <!-- External schedule section -->
        <SharedSectionCard
          title="Lịch làm việc (HR)"
          icon="i-lucide-building-2"
          compact
        >
          <UAlert
            v-if="detail.external.length === 0"
            color="neutral"
            variant="subtle"
            icon="i-lucide-info"
            description="Không có lịch từ HR cho ca này."
          />
          <div
            v-else
            class="flex flex-col gap-2"
          >
            <div
              v-for="item in detail.external"
              :key="item.id"
              class="rounded-lg border border-border-gray p-3"
            >
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-lucide-briefcase"
                  class="size-4 text-slate-500"
                />
                <span class="font-medium text-slate-900 text-sm">
                  {{ item.project.name }}
                  <span
                    v-if="item.project.code"
                    class="font-mono text-xs text-slate-500"
                  >· {{ item.project.code }}</span>
                </span>
              </div>
              <p
                v-if="item.note"
                class="mt-1.5 text-xs text-slate-600 whitespace-pre-line"
              >
                {{ item.note }}
              </p>
              <p
                v-if="item.external_ref"
                class="mt-1 font-mono text-[11px] text-slate-400"
              >
                Ref: {{ item.external_ref }}
              </p>
            </div>
          </div>
        </SharedSectionCard>

        <!-- Tickets section -->
        <SharedSectionCard
          :title="`Ticket đang xử lý (${detail.tickets.length})`"
          icon="i-lucide-ticket"
          compact
        >
          <UAlert
            v-if="detail.tickets.length === 0"
            color="neutral"
            variant="subtle"
            icon="i-lucide-info"
            description="Không có ticket nào trong ca này."
          />
          <div
            v-else
            class="flex flex-col gap-2"
          >
            <div
              v-for="ticket in detail.tickets"
              :key="ticket.id"
              class="rounded-lg border border-border-gray p-3"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="flex-1 min-w-0">
                  <NuxtLink
                    :to="`/pmc/og-tickets/${ticket.id}`"
                    class="font-medium text-sm text-primary hover:underline"
                  >
                    #{{ ticket.id }} · {{ ticket.subject }}
                  </NuxtLink>
                  <div class="mt-1 text-xs text-slate-500">
                    {{ ticket.project.name }}
                  </div>
                </div>
                <UBadge
                  :label="ticket.priority.label"
                  :color="priorityColor(ticket.priority.value)"
                  variant="subtle"
                  size="sm"
                />
              </div>
              <div class="mt-2 grid grid-cols-1 gap-1 text-[11px] text-slate-500">
                <div>Giao lúc: <span class="text-slate-700">{{ formatAssignedAt(ticket.assigned_at) }}</span></div>
                <div class="flex items-center gap-1.5">
                  <span>Trạng thái lúc đó:</span>
                  <UBadge
                    :label="ticket.status_at_slot.label"
                    :color="statusColor(ticket.status_at_slot.value)"
                    variant="subtle"
                    size="sm"
                  />
                </div>
                <div class="flex items-center gap-1.5">
                  <span>Hiện tại:</span>
                  <UBadge
                    :label="ticket.status_now.label"
                    :color="statusColor(ticket.status_now.value)"
                    variant="subtle"
                    size="sm"
                  />
                  <UIcon
                    v-if="ticket.is_status_changed"
                    name="i-lucide-triangle-alert"
                    class="size-3.5 text-amber-500"
                  />
                </div>
              </div>
              <UAlert
                v-if="ticket.is_status_changed"
                class="mt-2"
                color="warning"
                variant="subtle"
                size="sm"
                icon="i-lucide-triangle-alert"
                description="Trạng thái đã thay đổi sau ca."
              />
            </div>
          </div>
        </SharedSectionCard>
      </div>
    </template>
  </USlideover>
</template>
