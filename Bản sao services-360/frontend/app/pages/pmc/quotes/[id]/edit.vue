<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type {
  QuoteDetailResource,
  UpdateQuoteRequest
} from '#api/generated/laravel'
import type { QuoteLineData } from '~/components/quote/QuoteLineFormModal.vue'

interface QuoteLineItem extends QuoteLineData { key: number }

definePageMeta({ layout: 'default' })

const route = useRoute()
const toast = useToast()
const id = computed(() => Number(route.params.id))

const { data, status, error, refresh } = useQuoteDetail(id)
const quote = computed<QuoteDetailResource | undefined>(() => data.value?.data)

useSeoMeta({
  title: computed(() =>
    quote.value ? `Chỉnh sửa: ${quote.value.code} - Báo giá` : 'Chỉnh sửa báo giá'
  )
})

// ─── Redirect if not editable ───
watch(quote, (q) => {
  if (q && (q.status.value === 'approved' || !q.is_active)) {
    navigateTo(`/pmc/quotes/${id.value}`)
  }
}, { immediate: true })

// ─── Edit state ───
let editLineKeySeq = 0
const editLines = ref<QuoteLineItem[]>([])
const editNote = ref<string>('')

watch(quote, (q) => {
  if (q) {
    editLines.value = q.lines.map(l => ({
      key: ++editLineKeySeq,
      line_type: l.line_type.value as QuoteLineType,
      reference_id: l.reference_id,
      name: l.name,
      quantity: l.quantity,
      unit: l.unit,
      unit_price: parseFloat(l.unit_price),
      purchase_price: l.purchase_price != null ? parseFloat(l.purchase_price) : 0
    }))
    editNote.value = q.note ?? ''
  }
}, { immediate: true })

function removeEditLine(key: number) {
  editLines.value = editLines.value.filter(l => l.key !== key)
}

const editTotalAmount = computed(() =>
  editLines.value.reduce((sum, l) => sum + l.unit_price * l.quantity, 0)
)

// ─── Lines table ───
const lineColumns: TableColumn<QuoteLineItem>[] = [
  { accessorKey: 'name', header: 'Hạng mục' },
  { id: 'line_type', header: 'Loại' },
  { accessorKey: 'quantity', header: 'SL' },
  { accessorKey: 'unit', header: 'ĐVT' },
  { id: 'unit_price', header: 'Đơn giá' },
  { id: 'line_amount', header: 'Thành tiền' },
  { id: 'remove', header: '' }
]

// ─── Add line modal ───
const lineModal = ref<{ open: () => void }>()

function onLineAdded(line: QuoteLineData) {
  editLines.value.push({ key: ++editLineKeySeq, ...line })
}

// ─── Save changes ───
const isSaving = ref(false)

async function handleSave() {
  if (!quote.value || editLines.value.length === 0) return
  isSaving.value = true
  try {
    const payload: UpdateQuoteRequest = {
      note: editNote.value || null,
      lines: editLines.value.map(l => ({
        line_type: l.line_type,
        reference_id: l.reference_id,
        name: l.name,
        quantity: l.quantity,
        unit: l.unit,
        unit_price: l.unit_price,
        purchase_price: l.purchase_price
      }))
    }
    await apiUpdateQuote(id.value, payload)
    toast.add({ title: 'Đã lưu thay đổi', color: 'success' })
    clearQuoteCache(id.value)
    navigateTo(`/pmc/quotes/${id.value}`)
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Lưu thất bại'), color: 'error' })
  } finally {
    isSaving.value = false
  }
}

function handleCancel() {
  navigateTo(`/pmc/quotes/${id.value}`)
}

// ─── Transitions (shared composable) ───
const {
  isTransitioning, showRejectModal, rejectNote,
  handleTransition, openRejectModal, confirmReject
} = useQuoteTransition(id, {
  onSuccess: async () => { await navigateTo(`/pmc/quotes/${id.value}`) }
})
</script>

<template>
  <div>
    <!-- ═══ HEADER ═══ -->
    <div class="mb-6 flex items-start justify-between gap-4">
      <div class="flex items-center gap-4">
        <UButton
          icon="i-lucide-arrow-left"
          color="neutral"
          variant="ghost"
          :to="`/pmc/quotes/${id}`"
        />
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">
            Chỉnh sửa báo giá
          </h1>
          <p class="text-slate-500 text-sm mt-0.5">
            <span
              v-if="quote"
              class="font-mono font-semibold"
            >{{ quote.code }}</span>
            <span v-else>...</span>
          </p>
        </div>
      </div>

      <div
        v-if="quote"
        class="flex items-center gap-2 shrink-0"
      >
        <UButton
          label="Hủy"
          color="neutral"
          variant="ghost"
          @click="handleCancel"
        />
        <UButton
          label="Lưu thay đổi"
          icon="i-lucide-save"
          color="primary"
          :loading="isSaving"
          :disabled="editLines.length === 0"
          @click="handleSave"
        />
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="status === 'pending'"
      class="flex flex-col gap-4"
    >
      <div
        v-for="i in 3"
        :key="i"
        class="h-28 bg-slate-100 rounded-xl animate-pulse"
      />
    </div>

    <!-- Error -->
    <SharedCrudPageError
      v-else-if="error"
      :error="error"
      :retry="refresh"
    />

    <!-- ═══ FORM CONTENT ═══ -->
    <div
      v-else-if="quote"
      class="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      <!-- LEFT: Editable content -->
      <div class="lg:col-span-2 flex flex-col gap-6">
        <!-- Alert: Editing non-draft will reset status -->
        <UAlert
          v-if="quote.status.value !== 'draft'"
          icon="i-lucide-info"
          color="info"
          variant="subtle"
          title="Lưu thay đổi sẽ đưa trạng thái về Nháp."
        />

        <!-- Dòng báo giá (editable) -->
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

          <UTable
            :data="editLines"
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
            <template #remove-cell="{ row }">
              <UButton
                icon="i-lucide-trash-2"
                color="neutral"
                variant="ghost"
                size="xs"
                class="hover:text-red-500 hover:bg-red-50"
                @click="removeEditLine(row.original.key)"
              />
            </template>
          </UTable>

          <!-- Empty state -->
          <div
            v-if="editLines.length === 0"
            class="text-center py-8"
          >
            <UIcon
              name="i-lucide-package-open"
              class="size-10 text-slate-300 mx-auto mb-2"
            />
            <p class="text-sm text-slate-400">
              Chưa có dòng báo giá
            </p>
            <UButton
              label="Thêm dòng đầu tiên"
              icon="i-lucide-plus"
              color="primary"
              variant="soft"
              size="sm"
              class="mt-3"
              @click="lineModal?.open()"
            />
          </div>
        </SharedSectionCard>

        <!-- Tổng kết + Ghi chú -->
        <SharedSectionCard title="Tổng kết">
          <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-slate-600">Tổng tiền</span>
              <span class="text-lg font-bold text-slate-900">
                {{ formatCurrency(editTotalAmount) }}
              </span>
            </div>
            <UFormField label="Ghi chú">
              <UTextarea
                v-model="editNote"
                placeholder="Ghi chú nội bộ..."
                :rows="3"
                class="w-full"
              />
            </UFormField>
          </div>
        </SharedSectionCard>

        <!-- Bottom actions (mobile-friendly) -->
        <div class="flex items-center gap-3 lg:hidden">
          <UButton
            label="Lưu thay đổi"
            icon="i-lucide-save"
            color="primary"
            :loading="isSaving"
            :disabled="editLines.length === 0"
            class="flex-1"
            @click="handleSave"
          />
          <UButton
            label="Hủy"
            color="neutral"
            variant="ghost"
            @click="handleCancel"
          />
        </div>
      </div>

      <!-- ═══ RIGHT SIDEBAR ═══ -->
      <div class="flex flex-col gap-4">
        <!-- Hành động duyệt -->
        <SharedSectionCard
          v-if="quote.is_active"
          title="Hành động"
          compact
        >
          <!-- draft → sent -->
          <div
            v-if="quote.status.value === 'draft'"
            class="flex flex-col gap-2"
          >
            <UButton
              label="Gửi báo giá"
              icon="i-lucide-send"
              color="primary"
              class="w-full"
              :loading="isTransitioning"
              @click="handleTransition('sent')"
            />
          </div>

          <!-- sent → manager_approved / rejected -->
          <div
            v-else-if="quote.status.value === 'sent'"
            class="flex flex-col gap-2"
          >
            <UButton
              label="Quản lý duyệt"
              icon="i-lucide-user-check"
              color="primary"
              class="w-full"
              :loading="isTransitioning"
              @click="handleTransition('manager_approved')"
            />
            <UButton
              label="Quản lý từ chối"
              icon="i-lucide-x-circle"
              color="error"
              variant="outline"
              class="w-full"
              :loading="isTransitioning"
              @click="openRejectModal"
            />
          </div>

          <!-- manager_approved → approved / rejected -->
          <div
            v-else-if="quote.status.value === 'manager_approved'"
            class="flex flex-col gap-2"
          >
            <UButton
              label="Cư dân chấp thuận"
              icon="i-lucide-check-circle"
              color="success"
              class="w-full"
              :loading="isTransitioning"
              @click="handleTransition('approved')"
            />
            <UButton
              label="Cư dân từ chối"
              icon="i-lucide-x-circle"
              color="error"
              variant="outline"
              class="w-full"
              :loading="isTransitioning"
              @click="openRejectModal"
            />
          </div>

          <p
            v-else
            class="text-sm text-slate-400 italic"
          >
            Không có hành động khả dụng.
          </p>
        </SharedSectionCard>

        <!-- Read-only context -->
        <SharedSectionCard
          title="Thông tin"
          compact
        >
          <div class="flex flex-col gap-3">
            <SharedFieldDisplay label="Trạng thái">
              <UBadge
                :label="quote.status.label"
                :color="quoteStatusColor(quote.status.value)"
                variant="subtle"
                size="sm"
              />
            </SharedFieldDisplay>
            <SharedFieldDisplay
              v-if="quote.og_ticket"
              label="Ticket"
            >
              <NuxtLink
                :to="`/pmc/og-tickets/${quote.og_ticket.id}`"
                class="text-primary hover:underline text-sm"
              >
                {{ quote.og_ticket.subject }}
              </NuxtLink>
            </SharedFieldDisplay>
            <SharedFieldDisplay
              v-if="quote.og_ticket"
              label="Khách hàng"
            >
              <NuxtLink
                v-if="quote.og_ticket.customer"
                :to="`/pmc/customers/${quote.og_ticket.customer.id}`"
                class="font-medium text-primary-600 hover:underline"
              >
                {{ quote.og_ticket.customer.full_name }}
              </NuxtLink>
              <span v-else>{{ quote.og_ticket.requester_name }}</span>
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Tạo lúc">
              {{ formatDateTime(quote.created_at) }}
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Cập nhật lúc">
              {{ formatDateTime(quote.updated_at) }}
            </SharedFieldDisplay>
          </div>
        </SharedSectionCard>

        <UButton
          label="Xem chi tiết"
          icon="i-lucide-eye"
          color="primary"
          variant="soft"
          class="w-full"
          :to="`/pmc/quotes/${id}`"
        />
      </div>
    </div>

    <!-- ═══ DIALOGS ═══ -->

    <!-- Reject -->
    <UModal
      v-model:open="showRejectModal"
      title="Từ chối báo giá"
    >
      <template #body>
        <p class="text-slate-700 mb-4">
          Vui lòng nhập lý do từ chối (không bắt buộc).
        </p>
        <UTextarea
          v-model="rejectNote"
          placeholder="Lý do từ chối..."
          :rows="3"
          class="w-full"
        />
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton
            label="Hủy"
            color="neutral"
            variant="ghost"
            @click="showRejectModal = false"
          />
          <UButton
            label="Từ chối"
            color="error"
            :loading="isTransitioning"
            @click="confirmReject(quote!.status.value)"
          />
        </div>
      </template>
    </UModal>

    <!-- Add line modal -->
    <QuoteLineFormModal
      ref="lineModal"
      @add="onLineAdded"
    />
  </div>
</template>
