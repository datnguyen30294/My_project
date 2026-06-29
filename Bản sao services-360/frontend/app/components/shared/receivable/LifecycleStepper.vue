<script setup lang="ts">
import type { ReceivableDetailResource, PaymentReceiptResource } from '#api/generated/laravel'

interface Props {
  receivable: ReceivableDetailResource
  payments: PaymentReceiptResource[]
}

const props = defineProps<Props>()

type StepState = 'completed' | 'active' | 'error' | 'default'

interface ReceivableStep {
  key: string
  title: string
  subtitle?: string | null
  icon: string
  state: StepState
  time?: string | null
}

const steps = computed<ReceivableStep[]>(() => {
  const r = props.receivable
  const list: ReceivableStep[] = []

  // ─── 1. Phát sinh (always first, completed) ───
  list.push({
    key: 'issued',
    title: 'Phát sinh',
    subtitle: formatCurrency(r.amount),
    icon: 'i-lucide-file-plus-2',
    state: 'completed',
    time: r.issued_at
  })

  // ─── 2. Dynamic payment steps ───
  const sorted = [...props.payments].sort((a, b) => {
    const ta = a.paid_at ? new Date(a.paid_at).getTime() : 0
    const tb = b.paid_at ? new Date(b.paid_at).getTime() : 0
    if (ta !== tb) return ta - tb
    return a.id - b.id
  })

  let collectionIdx = 0
  let refundIdx = 0
  for (const p of sorted) {
    const isRefund = p.type.value === 'refund'
    if (isRefund) {
      refundIdx++
      list.push({
        key: `payment-${p.id}`,
        title: refundIdx > 1 ? `Hoàn trả ${refundIdx}` : 'Hoàn trả',
        subtitle: `− ${formatCurrency(p.amount)}`,
        icon: 'i-lucide-undo-2',
        state: 'completed',
        time: p.paid_at
      })
    } else {
      collectionIdx++
      list.push({
        key: `payment-${p.id}`,
        title: `Lần thanh toán ${collectionIdx}`,
        subtitle: formatCurrency(p.amount),
        icon: 'i-lucide-banknote',
        state: 'completed',
        time: p.paid_at
      })
    }
  }

  // ─── 3. Current state step ───
  const status = r.status.value

  switch (status) {
    case 'unpaid':
      list.push({
        key: 'pending',
        title: 'Chờ thu',
        subtitle: formatCurrency(r.outstanding),
        icon: 'i-lucide-hourglass',
        state: 'active'
      })
      break
    case 'partial':
      list.push({
        key: 'partial',
        title: 'Còn nợ',
        subtitle: formatCurrency(r.outstanding),
        icon: 'i-lucide-circle-dashed',
        state: 'active'
      })
      break
    case 'overdue':
      list.push({
        key: 'overdue',
        title: 'Quá hạn',
        subtitle: formatCurrency(r.outstanding),
        icon: 'i-lucide-alarm-clock',
        state: 'error'
      })
      break
    case 'paid':
      list.push({
        key: 'paid',
        title: 'Đã thu đủ',
        icon: 'i-lucide-circle-check',
        state: 'active'
      })
      break
    case 'overpaid':
      list.push({
        key: 'overpaid',
        title: 'Thu thừa',
        subtitle: formatCurrency(r.overpaid_amount),
        icon: 'i-lucide-circle-alert',
        state: 'active'
      })
      break
    case 'completed':
      list.push({
        key: 'paid',
        title: 'Đã thu đủ',
        icon: 'i-lucide-circle-check',
        state: 'completed'
      })
      break
    case 'written_off':
      list.push({
        key: 'written_off',
        title: 'Xóa nợ',
        subtitle: formatCurrency(r.outstanding),
        icon: 'i-lucide-x-circle',
        state: 'error',
        time: r.updated_at
      })
      break
  }

  // ─── 4. Terminal "Hoàn thành" step (except for written_off) ───
  if (status !== 'written_off') {
    list.push({
      key: 'completed',
      title: 'Hoàn thành',
      icon: 'i-lucide-circle-check-big',
      state: status === 'completed' ? 'active' : 'default',
      time: status === 'completed' ? r.updated_at : null
    })
  }

  return list
})

const colorClasses: Record<StepState, { indicator: string, separator: string }> = {
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

function textColorClass(state: StepState): string {
  return state === 'default' ? 'text-slate-400' : 'text-slate-700'
}

function subtitleColorClass(state: StepState): string {
  return state === 'default' ? 'text-slate-300' : 'text-slate-500'
}

function formatStepTime(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// Keep the rail visually comfortable when steps grow (many payments).
const minWidth = computed(() => `${Math.max(600, steps.value.length * 120)}px`)
</script>

<template>
  <div class="overflow-x-auto overflow-y-visible -mx-1 px-1 py-2">
    <div
      class="flex items-start"
      :style="{ minWidth }"
    >
      <template
        v-for="(step, index) in steps"
        :key="step.key"
      >
        <div class="flex flex-col items-center flex-1 relative">
          <div class="flex items-center w-full">
            <div
              v-if="index > 0"
              class="h-0.5 flex-1 transition-colors"
              :class="colorClasses[step.state].separator"
            />
            <div
              v-else
              class="flex-1"
            />

            <div
              class="relative size-8 rounded-full border-2 flex items-center justify-center transition-all shrink-0"
              :class="colorClasses[step.state].indicator"
            >
              <UIcon
                :name="step.icon"
                class="size-4"
              />
            </div>

            <div
              v-if="index < steps.length - 1"
              class="h-0.5 flex-1 transition-colors"
              :class="colorClasses[steps[index + 1]!.state].separator"
            />
            <div
              v-else
              class="flex-1"
            />
          </div>

          <span
            class="text-xs font-medium mt-1.5 text-center leading-tight"
            :class="textColorClass(step.state)"
          >
            {{ step.title }}
          </span>
          <span
            v-if="step.subtitle"
            class="text-[11px] font-semibold text-center leading-tight mt-0.5"
            :class="subtitleColorClass(step.state)"
          >
            {{ step.subtitle }}
          </span>
          <span
            v-if="step.time"
            class="text-[11px] text-center leading-tight mt-0.5"
            :class="subtitleColorClass(step.state)"
          >
            {{ formatStepTime(step.time) }}
          </span>
        </div>
      </template>
    </div>
  </div>
</template>
