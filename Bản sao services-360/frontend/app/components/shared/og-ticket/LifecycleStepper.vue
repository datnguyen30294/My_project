<script setup lang="ts">
import type { OgTicketLifecycleSegment } from '~/composables/api/useOgTickets'
import type { QuoteDetailResource } from '#api/generated/laravel'

interface Props {
  ogTicketId: number
  currentStatus: string
  segments: OgTicketLifecycleSegment[]
  quoteVersions: QuoteDetailResource[]
  activeQuoteId?: number | null
  activeQuoteStatus?: string | null
  activeOrderStatus?: string | null
  hasActiveOrder?: boolean
  accountOptions?: Array<{ label: string, value: number, capability_rating?: number | null }>
  currentAssigneeIds?: number[]
  currentAssignees?: Array<{ id: number, name: string, avatar_url?: string | null }>
  isTerminal?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'transition': [targetStatus: string]
  'assign': [assigneeIds: number[]]
  'create-order': [note: string]
}>()

const segmentsRef = computed(() => props.segments)
const versionsRef = computed(() => props.quoteVersions)

const { stepDataMap, backtracks } = useOgTicketLifecycle(segmentsRef, versionsRef)

// ─── SVG backtrack arrows ───
const STEPS = OG_TICKET_WORKFLOW_STEPS.length
const SVG_W = STEPS * 100
const LANE_H = 28
const LANE_PAD = 8

function stepCenterX(stepIdx: number): number {
  return (stepIdx + 0.5) / STEPS * SVG_W
}

const svgHeight = computed(() => LANE_PAD + backtracks.value.length * LANE_H + LANE_PAD)

function backtrackPath(bt: { from: number, to: number }, lane: number): string {
  const x1 = stepCenterX(bt.from)
  const x2 = stepCenterX(bt.to)
  const yTop = LANE_PAD
  const yBot = yTop + (lane + 1) * LANE_H
  return `M ${x1} ${yTop} L ${x1} ${yBot} L ${x2} ${yBot} L ${x2} ${yTop}`
}

const activePopover = ref<string | null>(null)

function formatStepTime(dateStr: string): string {
  const d = new Date(dateStr)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function togglePopover(stepValue: string) {
  activePopover.value = activePopover.value === stepValue ? null : stepValue
}

function getInitials(name: string): string {
  return name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

const assignees = computed(() => props.currentAssignees ?? [])

type StepColor = 'completed' | 'active' | 'error' | 'default'

function getStepColor(step: typeof OG_TICKET_WORKFLOW_STEPS[number], index: number): StepColor {
  const status = props.currentStatus
  const stepValue = step.value

  if (status === 'cancelled') return 'default'

  if (stepValue === 'quoted' && props.activeQuoteStatus && isQuoteRejected(props.activeQuoteStatus)) return 'error'
  if (stepValue === 'ordered' && props.activeOrderStatus === 'cancelled') return 'error'
  if (stepValue === 'approved' && status === 'rejected') return 'error'

  const currentIdx = ogTicketStatusToStepIndex(status)

  if (stepValue === status || (status === 'rejected' && stepValue === 'approved')) return 'active'
  if (index < currentIdx) return 'completed'

  return 'default'
}

function needsAssignment(stepValue: string): boolean {
  if (props.isTerminal || stepValue !== 'assigned') return false
  // Luôn cho phép cập nhật phân công ở bước "Phân công"
  return true
}

function canTransitionTo(stepValue: string): boolean {
  if (props.isTerminal) return false
  if (needsAssignment(stepValue)) return false

  const currentIdx = ogTicketStatusToStepIndex(props.currentStatus)
  const targetIdx = OG_TICKET_WORKFLOW_STEPS.findIndex(s => s.value === stepValue)
  if (targetIdx < 0 || targetIdx === currentIdx) return false

  // Forward: chỉ assigned → surveying
  if (targetIdx > currentIdx) {
    return props.currentStatus === 'assigned' && stepValue === 'surveying'
  }

  // Backward từ quoted trở xuống: chỉ về surveying (assigned dùng assignment UI)
  return stepValue === 'surveying' && targetIdx < currentIdx
}

function isBacktrack(stepValue: string): boolean {
  const currentIdx = ogTicketStatusToStepIndex(props.currentStatus)
  const targetIdx = OG_TICKET_WORKFLOW_STEPS.findIndex(s => s.value === stepValue)
  return targetIdx < currentIdx
}

function handleTransition(stepValue: string) {
  activePopover.value = null
  emit('transition', stepValue)
}

const colorClasses: Record<StepColor, { indicator: string, separator: string }> = {
  completed: {
    indicator: 'bg-green-500 text-white border-green-500',
    separator: 'bg-green-500'
  },
  active: {
    indicator: 'bg-green-500 text-white border-green-500 ring-2 ring-green-200 shadow-sm',
    separator: 'bg-green-500'
  },
  error: {
    indicator: 'bg-red-500 text-white border-red-500',
    separator: 'bg-red-300'
  },
  default: {
    indicator: 'bg-white text-slate-400 border-slate-300',
    separator: 'bg-slate-200'
  }
}
</script>

<template>
  <div class="overflow-x-auto overflow-y-visible -mx-1 px-1 py-2">
    <div class="flex items-start min-w-[600px]">
      <template
        v-for="(step, index) in OG_TICKET_WORKFLOW_STEPS"
        :key="step.value"
      >
        <div class="flex flex-col items-center flex-1 relative">
          <div class="flex items-center w-full">
            <div
              v-if="index > 0"
              class="h-0.5 flex-1 transition-colors"
              :class="colorClasses[getStepColor(step, index)].separator"
            />
            <div
              v-else
              class="flex-1"
            />

            <UPopover
              :open="activePopover === step.value"
              :content="{ side: 'bottom', align: 'center' }"
              @update:open="(v: boolean) => { if (!v) activePopover = null }"
            >
              <!-- Step icon (giữ icon cho mọi bước, kể cả Phân công) -->
              <button
                class="relative size-8 rounded-full border-2 flex items-center justify-center transition-all shrink-0 cursor-pointer hover:scale-110"
                :class="colorClasses[getStepColor(step, index)].indicator"
                @click="togglePopover(step.value)"
              >
                <UIcon
                  :name="step.icon"
                  class="size-4"
                />
                <span
                  v-if="(stepDataMap.get(step.value)?.totalVisits ?? 0) > 1"
                  class="absolute -top-1.5 -right-1.5 size-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center"
                >
                  {{ stepDataMap.get(step.value)!.totalVisits }}
                </span>
              </button>

              <template #content>
                <SharedOgTicketStepPopoverContent
                  :step="step"
                  :step-data="stepDataMap.get(step.value)"
                  :current-status="currentStatus"
                  :can-transition="canTransitionTo(step.value)"
                  :is-backtrack="isBacktrack(step.value)"
                  :og-ticket-id="ogTicketId"
                  :active-quote-id="activeQuoteId ?? null"
                  :needs-assignment="needsAssignment(step.value)"
                  :account-options="accountOptions ?? []"
                  :current-assignee-ids="currentAssigneeIds ?? []"
                  :has-active-order="hasActiveOrder ?? false"
                  :is-terminal="isTerminal ?? false"
                  @transition="handleTransition(step.value)"
                  @assign="(ids: number[]) => emit('assign', ids)"
                  @create-order="(note: string) => emit('create-order', note)"
                />
              </template>
            </UPopover>

            <div
              v-if="index < OG_TICKET_WORKFLOW_STEPS.length - 1"
              class="h-0.5 flex-1 transition-colors"
              :class="colorClasses[getStepColor(OG_TICKET_WORKFLOW_STEPS[index + 1]!, index + 1)].separator"
            />
            <div
              v-else
              class="flex-1"
            />
          </div>

          <span
            class="text-xs font-medium mt-1.5 text-center leading-tight"
            :class="getStepColor(step, index) === 'default' ? 'text-slate-400' : 'text-slate-700'"
          >
            {{ step.title }}
          </span>
          <span
            v-if="stepDataMap.get(step.value)?.latestVisit"
            class="text-[11px] text-center leading-tight mt-0.5"
            :class="getStepColor(step, index) === 'default' ? 'text-slate-300' : 'text-slate-400'"
          >
            {{ formatStepTime(stepDataMap.get(step.value)!.latestVisit!.segment.started_at) }}
          </span>

          <!-- Assignees: hiển thị như chú thích bên dưới bước Phân công -->
          <div
            v-if="step.value === 'assigned' && assignees.length > 0"
            class="mt-1.5 flex -space-x-2"
          >
            <template
              v-for="a in assignees.slice(0, 3)"
              :key="a.id"
            >
              <img
                v-if="a.avatar_url"
                :src="a.avatar_url"
                :alt="a.name"
                :title="a.name"
                class="size-7 rounded-full border border-white object-cover shadow-sm"
              >
              <span
                v-else
                class="size-7 rounded-full border border-white flex items-center justify-center text-[10px] font-bold bg-slate-200 text-slate-700 shadow-sm"
                :title="a.name"
              >
                {{ getInitials(a.name) }}
              </span>
            </template>
            <span
              v-if="assignees.length > 3"
              class="size-7 rounded-full border border-white flex items-center justify-center text-[10px] font-bold bg-slate-100 text-slate-600 shadow-sm"
            >
              +{{ assignees.length - 3 }}
            </span>
          </div>
        </div>
      </template>
    </div>

    <!-- SVG backtrack arrows -->
    <svg
      v-if="backtracks.length > 0"
      class="block w-full min-w-[600px] mt-1"
      :viewBox="`0 0 ${SVG_W} ${svgHeight}`"
    >
      <defs>
        <marker
          id="bt-arrow"
          markerWidth="10"
          markerHeight="10"
          refX="5"
          refY="5"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <polyline
            points="2,2 8,5 2,8"
            stroke="#d97706"
            fill="none"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </marker>
      </defs>

      <g
        v-for="(bt, i) in backtracks"
        :key="`bt-${i}`"
      >
        <path
          :d="backtrackPath(bt, i)"
          stroke="#d97706"
          fill="none"
          stroke-width="1.5"
          stroke-dasharray="5,4"
          stroke-linecap="round"
          marker-end="url(#bt-arrow)"
        />
        <text
          :x="(stepCenterX(bt.from) + stepCenterX(bt.to)) / 2"
          :y="LANE_PAD + (i + 1) * LANE_H - LANE_H / 2 + 4"
          text-anchor="middle"
          font-size="10"
          font-weight="600"
          fill="#d97706"
        >Phát sinh lần {{ bt.cycle }}</text>
      </g>
    </svg>
  </div>
</template>
