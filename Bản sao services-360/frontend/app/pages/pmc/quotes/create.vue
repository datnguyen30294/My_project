<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { CreateQuoteRequest } from '#api/generated/laravel'
import type { QuoteLineData, QuoteLineEditData } from '~/components/quote/QuoteLineFormModal.vue'

type LineSource = 'existing' | 'new' | 'modified'

interface QuoteLineItem extends QuoteLineData {
  key: number
  source: LineSource
}

definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'Tạo báo giá - Thần Nông' })

const toast = useToast()
const router = useRouter()

// ─── OgTicket selection ───
const route = useRoute()
const ogTicketSearch = ref('')
const selectedOgTicketId = ref<number | undefined>(
  route.query.og_ticket_id ? Number(route.query.og_ticket_id) : undefined
)

const { data: ogTicketsData, status: ogTicketsStatus } = useOgTicketList(
  computed(() => ({
    search: ogTicketSearch.value || undefined,
    per_page: SELECT_ALL_PER_PAGE
  }))
)

const ogTicketOptions = computed(() =>
  (ogTicketsData.value?.data ?? []).map(t => ({
    label: `${t.code} — ${t.subject}`,
    value: t.id
  }))
)

// ─── Check active quote ───
const { data: checkActiveData, execute: fetchCheckActive } = useQuoteCheckActive(selectedOgTicketId)

watch(selectedOgTicketId, (ticketId) => {
  if (ticketId) fetchCheckActive()
}, { immediate: true })

const activeQuoteInfo = computed(() => checkActiveData.value?.data ?? null)
const hasActiveQuote = computed(() => activeQuoteInfo.value?.has_active_quote === true)
const commissionFixedTotal = computed(() => activeQuoteInfo.value?.commission_fixed_total ?? 0)

// ─── Quote lines ───
const lines = ref<QuoteLineItem[]>([])
let lineKeySeq = 0

// Auto-fill lines from active quote
watch(activeQuoteInfo, (info) => {
  if (info?.has_active_quote && info.active_quote?.lines?.length) {
    lines.value = info.active_quote.lines.map(l => ({
      key: ++lineKeySeq,
      source: 'existing' as LineSource,
      line_type: l.line_type.value as QuoteLineType,
      reference_id: l.reference_id,
      name: l.name,
      quantity: l.quantity,
      unit: l.unit,
      unit_price: parseFloat(l.unit_price),
      purchase_price: l.purchase_price != null ? parseFloat(l.purchase_price) : 0
    }))
  } else {
    lines.value = []
  }
})

const totalAmount = computed(() =>
  lines.value.reduce((sum, l) => sum + l.unit_price * l.quantity, 0)
)

const serviceAdhocTotal = computed(() =>
  lines.value
    .filter(l => l.line_type === 'service' || l.line_type === 'adhoc')
    .reduce((sum, l) => sum + l.unit_price * l.quantity, 0)
)

const isBelowCommissionFixed = computed(() =>
  commissionFixedTotal.value > 0 && serviceAdhocTotal.value < commissionFixedTotal.value
)

function removeLine(key: number) {
  lines.value = lines.value.filter(l => l.key !== key)
}

const lineColumns = computed<TableColumn<QuoteLineItem>[]>(() => {
  const cols: TableColumn<QuoteLineItem>[] = [
    { accessorKey: 'name', header: 'Hạng mục' },
    { id: 'line_type', header: 'Loại' },
    { accessorKey: 'quantity', header: 'SL' },
    { accessorKey: 'unit', header: 'ĐVT' },
    { id: 'unit_price', header: 'Đơn giá' },
    { id: 'line_amount', header: 'Thành tiền' }
  ]
  if (hasActiveQuote.value) {
    cols.push({ id: 'source', header: 'Nguồn' })
  }
  cols.push(stickyRight<QuoteLineItem>({ id: 'actions', header: '' }, { width: 'w-[80px] min-w-[80px]' }))
  return cols
})

// ─── Add / Edit line modal ───
const lineModal = ref<{ open: () => void, openEdit: (line: QuoteLineEditData) => void }>()

function onLineAdded(line: QuoteLineData) {
  lines.value.push({ key: ++lineKeySeq, source: 'new', ...line })
}

function onLineUpdated(updated: QuoteLineEditData) {
  const idx = lines.value.findIndex(l => l.key === updated.key)
  if (idx === -1) return
  const prevSource = lines.value[idx]!.source
  lines.value[idx] = {
    ...updated,
    source: prevSource === 'new' ? 'new' : 'modified'
  }
}

function editLine(item: QuoteLineItem) {
  lineModal.value?.openEdit(item)
}

// ─── Submit ───
const selectedCreateStatus = ref<'draft' | 'sent'>('draft')
const isSubmitting = ref(false)
const showReplaceConfirm = ref(false)

const canSubmit = computed(() =>
  selectedOgTicketId.value && lines.value.length > 0 && !isBelowCommissionFixed.value
)

function handleSubmitClick() {
  if (!canSubmit.value) return
  if (hasActiveQuote.value) {
    showReplaceConfirm.value = true
  } else {
    doSubmit(false)
  }
}

function confirmReplace() {
  showReplaceConfirm.value = false
  doSubmit(true)
}

async function doSubmit(replaceActive: boolean) {
  isSubmitting.value = true
  try {
    const payload: CreateQuoteRequest = {
      og_ticket_id: selectedOgTicketId.value!,
      status: selectedCreateStatus.value,
      replace_active: replaceActive || undefined,
      lines: lines.value.map(l => ({
        line_type: l.line_type,
        reference_id: l.reference_id,
        name: l.name,
        quantity: l.quantity,
        unit_price: l.unit_price,
        purchase_price: l.purchase_price
      }))
    }
    const res = await apiCreateQuote(payload)
    toast.add({ title: 'Tạo báo giá thành công', color: 'success' })
    router.push(`/pmc/quotes/${res.data.id}`)
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Tạo báo giá thất bại'), color: 'error' })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex items-center gap-4">
      <UButton
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
        to="/pmc/quotes"
        class="shrink-0"
      />
      <div>
        <h1 class="text-xl font-bold text-slate-900">
          Tạo báo giá
        </h1>
        <p class="text-sm text-slate-500 mt-0.5">
          Chọn ticket và thêm dòng vật tư / dịch vụ
        </p>
      </div>
    </div>

    <div class="flex flex-col gap-6 max-w-4xl">
      <!-- Section 1: Chọn OgTicket -->
      <SharedSectionCard title="Thông tin nguồn">
        <div class="flex flex-col gap-4">
          <UFormField
            label="Chọn ticket"
            required
          >
            <USelectMenu
              v-model="selectedOgTicketId"
              v-model:search-term="ogTicketSearch"
              :items="ogTicketOptions"
              value-key="value"
              placeholder="Tìm và chọn ticket..."
              searchable
              :loading="ogTicketsStatus === 'pending'"
              class="w-full"
            />
          </UFormField>

          <UAlert
            v-if="hasActiveQuote"
            icon="i-lucide-alert-triangle"
            color="warning"
            variant="subtle"
            description="Các dòng từ báo giá cũ đã được điền sẵn. Bạn có thể thêm, xoá hoặc giữ nguyên. Tạo mới sẽ thay thế báo giá hiện tại."
          >
            <template #title>
              Ticket này đã có báo giá active: {{ activeQuoteInfo?.active_quote?.code }} ({{ activeQuoteInfo?.active_quote?.status.label }})
            </template>
          </UAlert>
        </div>
      </SharedSectionCard>

      <!-- Section 2: Dòng báo giá -->
      <SharedSectionCard title="Dòng báo giá">
        <template #header-actions>
          <UButton
            icon="i-lucide-plus"
            label="Thêm dòng"
            size="sm"
            color="primary"
            variant="soft"
            @click="lineModal?.open()"
          />
        </template>

        <!-- Commission fixed note -->
        <UAlert
          v-if="commissionFixedTotal > 0"
          icon="i-lucide-info"
          :color="isBelowCommissionFixed ? 'error' : 'info'"
          variant="subtle"
          class="mb-4"
        >
          <template #title>
            Lưu ý chiết khấu dự án
          </template>
          <template #description>
            <p>
              Tổng tiền dịch vụ + tùy chọn phải <strong>&ge; {{ formatCurrency(commissionFixedTotal) }}</strong>
              (tổng tiền cố định chiết khấu phòng ban của dự án).
            </p>
            <p
              v-if="lines.length > 0"
              class="mt-1"
            >
              Hiện tại: <strong :class="isBelowCommissionFixed ? 'text-red-600' : 'text-green-600'">{{ formatCurrency(serviceAdhocTotal) }}</strong>
              <span v-if="isBelowCommissionFixed"> — chưa đạt mức tối thiểu</span>
              <span v-else> — đã đạt</span>
            </p>
          </template>
        </UAlert>

        <div
          v-if="lines.length === 0"
          class="text-center py-8 text-slate-400"
        >
          <UIcon
            name="i-lucide-package"
            class="size-8 mb-2"
          />
          <p class="text-sm">
            Chưa có dòng nào. Bấm "Thêm dòng" để bắt đầu.
          </p>
        </div>

        <div v-else>
          <UTable
            :data="lines"
            :columns="lineColumns"
          >
            <template #line_type-cell="{ row }">
              <UBadge
                :label="QUOTE_LINE_TYPE_LABELS[row.original.line_type] ?? row.original.line_type"
                color="neutral"
                variant="subtle"
                size="sm"
              />
            </template>

            <template #unit_price-cell="{ row }">
              {{ formatCurrency(row.original.unit_price) }}
            </template>

            <template #line_amount-cell="{ row }">
              <span class="font-medium">{{ formatCurrency(row.original.unit_price * row.original.quantity) }}</span>
            </template>

            <template #source-cell="{ row }">
              <UBadge
                v-if="row.original.source === 'existing'"
                label="Từ BG cũ"
                color="warning"
                variant="subtle"
                size="sm"
              />
              <UBadge
                v-else-if="row.original.source === 'modified'"
                label="Đã sửa"
                color="info"
                variant="subtle"
                size="sm"
              />
              <UBadge
                v-else
                label="Mới"
                color="success"
                variant="subtle"
                size="sm"
              />
            </template>

            <template #actions-cell="{ row }">
              <div class="flex items-center gap-1">
                <UButton
                  icon="i-lucide-pencil"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  @click="editLine(row.original)"
                />
                <UButton
                  icon="i-lucide-trash-2"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  class="hover:text-red-500 hover:bg-red-50"
                  @click="removeLine(row.original.key)"
                />
              </div>
            </template>
          </UTable>
        </div>
      </SharedSectionCard>

      <!-- Section 3: Tổng kết -->
      <SharedSectionCard
        v-if="lines.length > 0"
        title="Tổng kết"
        compact
      >
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-slate-600">Tổng tiền</span>
          <span class="text-lg font-bold text-slate-900">{{ formatCurrency(totalAmount) }}</span>
        </div>
      </SharedSectionCard>

      <!-- Section 4: Actions -->
      <SharedSectionCard
        title="Thao tác"
        compact
      >
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <UFormField label="Trạng thái khi tạo">
              <USelect
                v-model="selectedCreateStatus"
                :items="QUOTE_CREATE_STATUS_OPTIONS"
                class="w-56"
              />
            </UFormField>
          </div>

          <div class="flex items-center gap-2">
            <UButton
              label="Hủy"
              color="neutral"
              variant="ghost"
              to="/pmc/quotes"
            />
            <UButton
              label="Tạo báo giá"
              icon="i-lucide-check"
              color="primary"
              :loading="isSubmitting"
              :disabled="!canSubmit"
              @click="handleSubmitClick"
            />
          </div>
        </div>
      </SharedSectionCard>
    </div>

    <!-- ═══ Modal: Thêm dòng ═══ -->
    <QuoteLineFormModal
      ref="lineModal"
      @add="onLineAdded"
      @update="onLineUpdated"
    />

    <!-- ═══ Modal: Confirm thay thế ═══ -->
    <UModal
      v-model:open="showReplaceConfirm"
      title="Xác nhận thay thế báo giá"
    >
      <template #body>
        <p class="text-slate-700">
          Báo giá hiện tại
          <strong>{{ activeQuoteInfo?.active_quote?.code }}</strong>
          sẽ bị thay thế. Tiếp tục?
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton
            label="Hủy"
            color="neutral"
            variant="ghost"
            @click="showReplaceConfirm = false"
          />
          <UButton
            label="Xác nhận tạo"
            color="primary"
            :loading="isSubmitting"
            @click="confirmReplace"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
