<script setup lang="ts">
import type { PublicTicketInfo } from '~/composables/api/useTickets'

definePageMeta({ layout: false })

useSeoMeta({
  title: 'Thông tin yêu cầu - Thần Nông',
  description: 'Xem thông tin yêu cầu hỗ trợ và đánh giá dịch vụ.'
})

const route = useRoute()
const code = computed(() => String(route.params.code))
const toast = useToast()

// --- Fetch ticket info ---
const { data: responseData, status, error, refresh } = usePublicTicketInfo(code)
const ticket = computed<PublicTicketInfo | null>(() => responseData.value?.data ?? null)

// --- Quote decision state ---
const showApproveModal = ref(false)
const showRejectModal = ref(false)
const rejectReason = ref('')
const isQuoteSubmitting = ref(false)

// --- Warranty request state ---
const showWarrantyCreateModal = ref(false)
const showWarrantyViewModal = ref(false)
const selectedWarrantyRequest = ref<import('~/composables/api/useTickets').PublicWarrantyRequest | null>(null)

// --- Acceptance report confirm state ---
const showAcceptanceConfirmModal = ref(false)
const acceptanceSignatureName = ref('')
const acceptanceNote = ref('')
const isAcceptanceSubmitting = ref(false)

const acceptanceReport = computed(() => ticket.value?.acceptance_report ?? null)
const showAcceptanceSection = computed(() => {
  const order = ticket.value?.order
  if (!order || !acceptanceReport.value) return false
  return order.status.value === 'accepted' || order.status.value === 'completed'
})

function openAcceptanceConfirmModal() {
  acceptanceSignatureName.value = ticket.value?.requester_name ?? ''
  acceptanceNote.value = ''
  showAcceptanceConfirmModal.value = true
}

async function handleAcceptanceConfirm() {
  const name = acceptanceSignatureName.value.trim()
  if (name.length < 2) return
  const token = acceptanceReport.value?.share_token
  if (!token) return

  isAcceptanceSubmitting.value = true
  try {
    await apiConfirmPublicAcceptanceReport(token, {
      signature_name: name,
      note: acceptanceNote.value.trim() || undefined
    })
    toast.add({ title: 'Đã xác nhận nghiệm thu. Cảm ơn bạn!', color: 'success' })
    showAcceptanceConfirmModal.value = false
    await refresh()
  } catch (err: unknown) {
    const message
      = (typeof err === 'object' && err !== null && 'data' in err
        && typeof (err as { data?: { message?: string } }).data?.message === 'string')
        ? (err as { data: { message: string } }).data.message
        : 'Có lỗi xảy ra, vui lòng thử lại.'
    toast.add({ title: message, color: 'error' })
  } finally {
    isAcceptanceSubmitting.value = false
  }
}

function openWarrantyCreateModal() {
  selectedWarrantyRequest.value = null
  showWarrantyCreateModal.value = true
}

function openWarrantyViewModal(request: import('~/composables/api/useTickets').PublicWarrantyRequest) {
  selectedWarrantyRequest.value = request
  showWarrantyViewModal.value = true
}

async function handleWarrantySubmitted() {
  await refresh()
}

const quoteStatusVisible = ['manager_approved', 'approved', 'resident_rejected']
// Luồng báo giá lại (re-quote): order đã tồn tại nhưng báo giá mới đang chờ
// cư dân quyết định (manager_approved) hoặc vừa bị từ chối → vẫn phải hiện
// card báo giá. Chỉ ẩn khi báo giá đã chấp thuận và card Đơn hàng bên dưới
// đã thể hiện cùng nội dung (tránh trùng lặp).
const showQuoteSection = computed(() =>
  ticket.value?.quote != null
  && quoteStatusVisible.includes(ticket.value.quote.status.value)
  && (ticket.value.order == null || ticket.value.quote.status.value !== 'approved')
)

// Sticky mobile action bar: only when the resident still needs to decide.
// On desktop the inline buttons in the Quote card are enough.
const showStickyQuoteBar = computed(() =>
  ticket.value?.quote != null
  && ticket.value.quote.is_resident_actionable
  && !showApproveModal.value
  && !showRejectModal.value
)

async function handleApprove() {
  isQuoteSubmitting.value = true
  try {
    await apiSubmitQuoteDecision(code.value, { action: 'approve' })
    toast.add({ title: 'Bạn đã chấp thuận báo giá!', color: 'success' })
    showApproveModal.value = false
    await refresh()
  } catch {
    toast.add({ title: 'Có lỗi xảy ra, vui lòng thử lại.', color: 'error' })
  } finally {
    isQuoteSubmitting.value = false
  }
}

async function handleReject() {
  if (rejectReason.value.trim().length < 5) return
  isQuoteSubmitting.value = true
  try {
    await apiSubmitQuoteDecision(code.value, { action: 'reject', reason: rejectReason.value.trim() })
    toast.add({ title: 'Bạn đã từ chối báo giá.', color: 'info' })
    showRejectModal.value = false
    rejectReason.value = ''
    await refresh()
  } catch {
    toast.add({ title: 'Có lỗi xảy ra, vui lòng thử lại.', color: 'error' })
  } finally {
    isQuoteSubmitting.value = false
  }
}

// --- Rating form state ---
const selectedRating = ref(0)
const hoverRating = ref(0)
const ratingComment = ref('')
const isSubmitting = ref(false)
const submitSuccess = ref(false)

const displayRating = computed(() => hoverRating.value || selectedRating.value)

const ratingLabels = ['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Rất tốt']
const ratingLabel = computed(() => ratingLabels[displayRating.value] ?? '')

function selectStar(star: number) {
  selectedRating.value = star
}

async function handleSubmit() {
  if (selectedRating.value < 1) return

  isSubmitting.value = true
  try {
    await apiSubmitTicketRating(code.value, {
      resident_rating: selectedRating.value,
      resident_rating_comment: ratingComment.value.trim() || undefined
    })
    submitSuccess.value = true
    toast.add({ title: 'Cảm ơn bạn đã đánh giá!', color: 'success' })
  } catch {
    toast.add({ title: 'Có lỗi xảy ra, vui lòng thử lại.', color: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

const statusIconMap: Record<string, string> = {
  pending: 'schedule',
  received: 'inbox',
  in_progress: 'engineering',
  completed: 'check_circle',
  cancelled: 'cancel'
}
</script>

<template>
  <div class="min-h-screen w-full bg-slate-50">
    <!-- ══════════════ HEADER ══════════════ -->
    <header class="relative overflow-hidden bg-slate-900">
      <!-- Ambient glow -->
      <div class="absolute -top-20 left-1/3 size-[400px] rounded-full bg-indigo-500/10 blur-[120px]" />
      <div class="absolute -bottom-10 right-1/4 size-[300px] rounded-full bg-violet-500/8 blur-[100px]" />
      <!-- Grid overlay -->
      <div
        class="absolute inset-0 opacity-[0.03]"
        style="background-image: linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px); background-size: 48px 48px;"
      />

      <div class="relative max-w-2xl mx-auto px-6 py-5">
        <!-- Top nav -->
        <div class="flex items-center justify-between mb-6">
          <NuxtLink
            to="/"
            class="flex items-center gap-3 group"
          >
            <div class="size-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
              <span
                class="material-symbols-outlined text-white"
                style="font-size: 18px"
              >domain</span>
            </div>
            <span class="text-white font-bold text-base tracking-tight">Thần Nông</span>
          </NuxtLink>
          <NuxtLink
            to="/ticket"
            class="flex items-center gap-1.5 rounded-full px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-700 hover:text-white transition-all"
          >
            <span
              class="material-symbols-outlined"
              style="font-size: 14px"
            >add_circle</span>
            Gửi yêu cầu mới
          </NuxtLink>
        </div>

        <!-- Title area -->
        <div
          v-if="ticket"
          class="pb-2"
        >
          <div class="flex items-center gap-2.5 mb-2">
            <span class="inline-flex items-center gap-1.5 bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <span
                class="material-symbols-outlined"
                style="font-size: 13px"
              >confirmation_number</span>
              {{ ticket.code }}
            </span>
            <span
              class="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider"
              :class="{
                'bg-amber-500/15 text-amber-300 border border-amber-500/20': ticket.status.value === 'pending',
                'bg-blue-500/15 text-blue-300 border border-blue-500/20': ticket.status.value === 'received',
                'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20': ticket.status.value === 'in_progress',
                'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20': ticket.status.value === 'completed',
                'bg-slate-500/15 text-slate-400 border border-slate-500/20': ticket.status.value === 'cancelled'
              }"
            >
              <span
                class="material-symbols-outlined"
                style="font-size: 13px; font-variation-settings: 'FILL' 1"
              >{{ statusIconMap[ticket.status.value] ?? 'help' }}</span>
              {{ ticket.status.label }}
            </span>
          </div>
          <h1 class="text-white text-xl sm:text-2xl font-extrabold tracking-tight leading-snug">
            {{ ticket.subject }}
          </h1>
        </div>
        <div
          v-else
          class="pb-2"
        >
          <div class="h-6 w-36 bg-slate-800 rounded-full animate-pulse mb-3" />
          <div class="h-7 w-72 bg-slate-800 rounded-lg animate-pulse" />
        </div>
      </div>
    </header>

    <!-- ══════════════ CONTENT ══════════════ -->
    <main class="max-w-2xl mx-auto px-6 -mt-1">
      <!-- Loading skeleton -->
      <div
        v-if="status === 'pending'"
        class="py-8 space-y-5"
      >
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <USkeleton class="h-5 w-32 mb-4" />
          <div class="grid grid-cols-2 gap-4">
            <USkeleton
              v-for="i in 4"
              :key="i"
              class="h-12"
            />
          </div>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <USkeleton class="h-5 w-40 mb-4" />
          <USkeleton class="h-24" />
        </div>
      </div>

      <!-- Error / Not found -->
      <div
        v-else-if="error"
        class="py-12"
      >
        <div class="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
          <div class="size-16 mx-auto rounded-2xl bg-red-50 flex items-center justify-center mb-4">
            <span
              class="material-symbols-outlined text-red-400"
              style="font-size: 28px"
            >error</span>
          </div>
          <h2 class="text-lg font-bold text-slate-900 mb-1">
            Không tìm thấy yêu cầu
          </h2>
          <p class="text-sm text-slate-500">
            Mã yêu cầu không tồn tại hoặc đã bị xóa.
          </p>
          <NuxtLink
            to="/ticket"
            class="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
          >
            <span
              class="material-symbols-outlined"
              style="font-size: 16px"
            >arrow_back</span>
            Quay lại trang gửi yêu cầu
          </NuxtLink>
        </div>
      </div>

      <!-- Ticket loaded -->
      <div
        v-else-if="ticket"
        class="py-6 space-y-5"
        :class="{ 'pb-32 sm:pb-6': showStickyQuoteBar }"
      >
        <!-- ─── Ticket Info ─── -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div class="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
            <span
              class="material-symbols-outlined text-slate-400"
              style="font-size: 18px"
            >description</span>
            <h2 class="text-sm font-bold text-slate-800">
              Thông tin yêu cầu
            </h2>
          </div>
          <div class="px-5 py-4">
            <div class="grid grid-cols-2 gap-x-6 gap-y-3.5">
              <div>
                <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                  Mã yêu cầu
                </p>
                <p class="text-sm font-bold text-slate-900 font-mono">
                  {{ ticket.code }}
                </p>
              </div>
              <div>
                <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                  Ngày tạo
                </p>
                <p class="text-sm text-slate-700">
                  {{ formatDateTime(ticket.created_at) }}
                </p>
              </div>
              <div>
                <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                  Người gửi
                </p>
                <p class="text-sm font-semibold text-slate-900">
                  {{ ticket.requester_name }}
                </p>
              </div>
              <div>
                <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                  Số điện thoại
                </p>
                <p class="text-sm text-slate-700">
                  {{ ticket.requester_phone }}
                </p>
              </div>
            </div>

            <!-- Description -->
            <div
              v-if="ticket.description"
              class="mt-4 pt-3.5 border-t border-slate-50"
            >
              <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Mô tả
              </p>
              <p class="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {{ ticket.description }}
              </p>
            </div>

            <!-- Address -->
            <div
              v-if="ticket.address"
              class="mt-3 pt-3.5 border-t border-slate-50"
            >
              <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Địa chỉ
              </p>
              <p class="text-sm text-slate-700">
                {{ ticket.address }}
              </p>
            </div>
          </div>
        </div>

        <!-- ─── Survey Section ─── -->
        <OgTicketPublicSurveySection :ticket-code="code" />

        <!-- ─── Quote Info ─── -->
        <div
          v-if="showQuoteSection && ticket.quote"
          class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
        >
          <div class="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span
                class="material-symbols-outlined text-slate-400"
                style="font-size: 18px"
              >request_quote</span>
              <h2 class="text-sm font-bold text-slate-800">
                Báo giá
              </h2>
            </div>
            <UBadge
              :color="ticket.quote.status.value === 'approved' ? 'success' : ticket.quote.status.value === 'resident_rejected' ? 'error' : 'warning'"
              variant="subtle"
              size="xs"
            >
              {{ ticket.quote.status.value === 'manager_approved' ? 'Chờ bạn chấp thuận' : ticket.quote.status.label }}
            </UBadge>
          </div>
          <div class="px-5 py-4">
            <div class="flex items-center justify-between mb-4">
              <div>
                <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                  Mã báo giá
                </p>
                <p class="text-sm font-bold text-slate-900 font-mono">
                  {{ ticket.quote.code }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                  Tổng tiền
                </p>
                <p class="text-base font-extrabold text-slate-900">
                  {{ formatCurrency(ticket.quote.total_amount) }}
                </p>
              </div>
            </div>

            <!-- Quote Lines -->
            <div
              v-if="ticket.quote.lines.length > 0"
              class="border border-slate-100 rounded-xl overflow-hidden"
            >
              <table class="w-full text-sm">
                <thead>
                  <tr class="bg-slate-50/80">
                    <th class="text-left px-3.5 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Hạng mục
                    </th>
                    <th class="text-center px-3 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      SL
                    </th>
                    <th class="text-right px-3 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Đơn giá
                    </th>
                    <th class="text-right px-3.5 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-50">
                  <tr
                    v-for="(line, idx) in ticket.quote.lines"
                    :key="idx"
                  >
                    <td class="px-3.5 py-2.5">
                      <p class="font-semibold text-slate-800 text-[13px]">
                        {{ line.name }}
                      </p>
                      <span class="inline-block mt-0.5 text-[10px] font-semibold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                        {{ line.line_type.label }}
                      </span>
                    </td>
                    <td class="text-center px-3 py-2.5 text-slate-600 text-[13px]">
                      {{ line.quantity }} {{ line.unit }}
                    </td>
                    <td class="text-right px-3 py-2.5 text-slate-600 text-[13px]">
                      {{ formatCurrency(line.unit_price) }}
                    </td>
                    <td class="text-right px-3.5 py-2.5 font-semibold text-slate-800 text-[13px]">
                      {{ formatCurrency(line.line_amount) }}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="bg-slate-50/80">
                    <td
                      colspan="3"
                      class="text-right px-3.5 py-2.5 text-[13px] font-semibold text-slate-500"
                    >
                      Tổng cộng
                    </td>
                    <td class="text-right px-3.5 py-2.5 text-[13px] font-extrabold text-slate-900">
                      {{ formatCurrency(ticket.quote.total_amount) }}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <!-- Approved state -->
            <div
              v-if="ticket.quote.status.value === 'approved'"
              class="mt-4"
            >
              <UAlert
                color="success"
                variant="subtle"
                icon="i-lucide-check-circle"
                title="Bạn đã chấp thuận báo giá này"
                :description="ticket.quote.manager_approved_at ? `Ngày duyệt: ${formatDateTime(ticket.quote.manager_approved_at)}` : undefined"
              />
            </div>

            <!-- Rejected state -->
            <div
              v-else-if="ticket.quote.status.value === 'resident_rejected'"
              class="mt-4"
            >
              <UAlert
                color="error"
                variant="subtle"
                icon="i-lucide-x-circle"
                title="Bạn đã từ chối báo giá này"
                :description="ticket.quote.note ? `Lý do: ${ticket.quote.note}` : undefined"
              />
            </div>

            <!-- Actionable: waiting for resident -->
            <div
              v-else-if="ticket.quote.is_resident_actionable"
              class="mt-4"
            >
              <!-- Primary action stack: approve on top (larger, full-width), -->
              <!-- reject below — gives residents a big tap target. The sticky -->
              <!-- bottom bar on mobile already communicates "pending" state. -->
              <div class="flex flex-col gap-2.5">
                <UButton
                  color="success"
                  size="xl"
                  block
                  class="min-h-[52px] font-semibold text-base whitespace-nowrap"
                  icon="i-lucide-check"
                  @click="showApproveModal = true"
                >
                  Đồng ý báo giá
                </UButton>
                <UButton
                  color="error"
                  variant="outline"
                  size="lg"
                  block
                  class="min-h-[44px] font-semibold"
                  icon="i-lucide-x"
                  @click="showRejectModal = true"
                >
                  Từ chối
                </UButton>
              </div>
            </div>
          </div>
        </div>

        <!-- ─── Order Info ─── -->
        <div
          v-if="ticket.order"
          class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
        >
          <div class="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span
                class="material-symbols-outlined text-slate-400"
                style="font-size: 18px"
              >receipt_long</span>
              <h2 class="text-sm font-bold text-slate-800">
                Đơn hàng
              </h2>
            </div>
            <UBadge
              :color="ticket.order.status.value === 'completed' ? 'success' : 'info'"
              variant="subtle"
              size="xs"
            >
              {{ ticket.order.status.label }}
            </UBadge>
          </div>
          <div class="px-5 py-4">
            <div class="flex items-center justify-between mb-4">
              <div>
                <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                  Mã đơn hàng
                </p>
                <p class="text-sm font-bold text-slate-900 font-mono">
                  {{ ticket.order.code }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                  Tổng tiền
                </p>
                <p class="text-base font-extrabold text-slate-900">
                  {{ formatCurrency(ticket.order.total_amount) }}
                </p>
              </div>
            </div>

            <!-- Order Lines -->
            <div
              v-if="ticket.order.lines.length > 0"
              class="border border-slate-100 rounded-xl overflow-hidden"
            >
              <table class="w-full text-sm">
                <thead>
                  <tr class="bg-slate-50/80">
                    <th class="text-left px-3.5 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Hạng mục
                    </th>
                    <th class="text-center px-3 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      SL
                    </th>
                    <th class="text-right px-3 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Đơn giá
                    </th>
                    <th class="text-right px-3.5 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-50">
                  <tr
                    v-for="(line, idx) in ticket.order.lines"
                    :key="idx"
                  >
                    <td class="px-3.5 py-2.5">
                      <p class="font-semibold text-slate-800 text-[13px]">
                        {{ line.name }}
                      </p>
                      <span class="inline-block mt-0.5 text-[10px] font-semibold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                        {{ line.line_type.label }}
                      </span>
                    </td>
                    <td class="text-center px-3 py-2.5 text-slate-600 text-[13px]">
                      {{ line.quantity }} {{ line.unit }}
                    </td>
                    <td class="text-right px-3 py-2.5 text-slate-600 text-[13px]">
                      {{ formatCurrency(line.unit_price) }}
                    </td>
                    <td class="text-right px-3.5 py-2.5 font-semibold text-slate-800 text-[13px]">
                      {{ formatCurrency(line.line_amount) }}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="bg-slate-50/80">
                    <td
                      colspan="3"
                      class="text-right px-3.5 py-2.5 text-[13px] font-semibold text-slate-500"
                    >
                      Tổng cộng
                    </td>
                    <td class="text-right px-3.5 py-2.5 text-[13px] font-extrabold text-slate-900">
                      {{ formatCurrency(ticket.order.total_amount) }}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <!-- ─── Warranty section (only when order is completed) ─── -->
            <div
              v-if="ticket.order.status.value === 'completed'"
              class="mt-5 pt-5 border-t border-slate-100"
            >
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <span
                    class="material-symbols-outlined text-amber-500"
                    style="font-size: 18px; font-variation-settings: 'FILL' 1"
                  >verified</span>
                  <h3 class="text-sm font-bold text-slate-800">
                    Bảo hành 12 tháng
                  </h3>
                </div>
                <UButton
                  v-if="ticket.can_request_warranty"
                  color="warning"
                  variant="soft"
                  size="xs"
                  icon="i-lucide-plus"
                  @click="openWarrantyCreateModal"
                >
                  Yêu cầu bảo hành
                </UButton>
              </div>

              <UAlert
                v-if="!ticket.can_request_warranty && ticket.warranty_requests.length === 0"
                icon="i-lucide-info"
                color="neutral"
                variant="subtle"
                title="Đã hết thời hạn bảo hành"
                description="Bảo hành chỉ áp dụng trong 12 tháng kể từ khi đơn hàng hoàn thành."
              />

              <div
                v-if="ticket.warranty_requests.length > 0"
                class="space-y-2"
              >
                <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Đã gửi {{ ticket.warranty_requests.length }} yêu cầu
                </p>
                <button
                  v-for="(req, idx) in ticket.warranty_requests"
                  :key="req.id"
                  type="button"
                  class="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/30 transition-colors text-left"
                  @click="openWarrantyViewModal(req)"
                >
                  <div class="size-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 text-amber-600 text-xs font-bold">
                    {{ idx + 1 }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-slate-800 truncate">
                      {{ req.subject }}
                    </p>
                    <p class="text-[11px] text-slate-400 mt-0.5">
                      {{ req.created_at ? formatDateTime(req.created_at) : '' }}
                    </p>
                  </div>
                  <span
                    class="material-symbols-outlined text-slate-300"
                    style="font-size: 18px"
                  >chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ─── Acceptance Report ─── -->
        <div
          v-if="showAcceptanceSection && acceptanceReport"
          class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
        >
          <div class="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span
                class="material-symbols-outlined text-slate-400"
                style="font-size: 18px"
              >assignment_turned_in</span>
              <h2 class="text-sm font-bold text-slate-800">
                Biên bản nghiệm thu
              </h2>
            </div>
            <UBadge
              :color="acceptanceReport.is_confirmed || acceptanceReport.has_signed_file ? 'success' : 'warning'"
              variant="subtle"
              size="xs"
            >
              {{ acceptanceReport.is_confirmed || acceptanceReport.has_signed_file ? 'Đã xác nhận' : 'Chờ xác nhận' }}
            </UBadge>
          </div>
          <div class="px-5 py-4 space-y-3">
            <p class="text-sm text-slate-600 leading-relaxed">
              {{ acceptanceReport.has_signed_file
                ? 'Biên bản nghiệm thu đã được xác nhận bằng bản giấy có chữ ký. Bạn có thể xem hoặc tải về bản đã ký bên dưới.'
                : 'Vui lòng xem nội dung biên bản nghiệm thu và bấm nút xác nhận nếu công việc đã được hoàn tất đúng yêu cầu.' }}
            </p>

            <div class="flex flex-col sm:flex-row gap-2">
              <UButton
                :to="acceptanceReport.public_url"
                target="_blank"
                color="neutral"
                variant="outline"
                size="md"
                icon="i-lucide-external-link"
                class="flex-1"
              >
                Xem biên bản
              </UButton>
              <UButton
                v-if="acceptanceReport.is_confirmable && !acceptanceReport.is_confirmed && !acceptanceReport.has_signed_file"
                color="success"
                size="md"
                icon="i-lucide-check"
                class="flex-1"
                @click="openAcceptanceConfirmModal"
              >
                Xác nhận nghiệm thu
              </UButton>
            </div>

            <UAlert
              v-if="acceptanceReport.is_confirmed"
              color="success"
              variant="subtle"
              icon="i-lucide-check-circle"
              title="Bạn đã xác nhận biên bản nghiệm thu"
              :description="acceptanceReport.confirmed_at
                ? `Ngày xác nhận: ${formatDateTime(acceptanceReport.confirmed_at)}${acceptanceReport.confirmed_signature_name ? ` — ${acceptanceReport.confirmed_signature_name}` : ''}`
                : undefined"
            />
            <UAlert
              v-else-if="acceptanceReport.has_signed_file"
              color="success"
              variant="subtle"
              icon="i-lucide-check-circle"
              title="Đã nghiệm thu bằng biên bản ký tay"
              description="Khách hàng đã ký biên bản bản giấy, không cần xác nhận điện tử thêm."
            />

            <div
              v-if="acceptanceReport.has_signed_file && acceptanceReport.signed_file_url"
              class="pt-3 border-t border-slate-100"
            >
              <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Biên bản đã ký (bản giấy)
              </p>
              <a
                :href="acceptanceReport.signed_file_url"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 text-sm text-slate-700 transition-colors"
              >
                <span
                  class="material-symbols-outlined text-emerald-500"
                  style="font-size: 18px"
                >description</span>
                <span class="truncate max-w-[220px]">
                  {{ acceptanceReport.signed_file_original_name ?? 'Tải biên bản đã ký' }}
                </span>
                <span
                  class="material-symbols-outlined text-slate-400"
                  style="font-size: 16px"
                >download</span>
              </a>
              <p
                v-if="acceptanceReport.signed_uploaded_at"
                class="text-[11px] text-slate-400 mt-2"
              >
                Tải lên lúc {{ formatDateTime(acceptanceReport.signed_uploaded_at) }}
              </p>
            </div>
          </div>
        </div>

        <!-- ════════════════════════════════════════════
             RATING SECTION — only visible once ticket is completed.
        ════════════════════════════════════════════ -->
        <template v-if="ticket.status.value === 'completed'">
          <!-- Case 2: Just rated (success) -->
          <div
            v-if="submitSuccess"
            class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
          >
            <div class="text-center px-6 py-10">
              <div class="size-20 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-5 ring-4 ring-emerald-50/50">
                <span
                  class="material-symbols-outlined text-emerald-500"
                  style="font-size: 36px; font-variation-settings: 'FILL' 1"
                >check_circle</span>
              </div>
              <h3 class="text-xl font-extrabold text-slate-900 mb-1">
                Cảm ơn bạn!
              </h3>
              <p class="text-sm text-slate-500 mb-5">
                Đánh giá của bạn giúp chúng tôi cải thiện chất lượng dịch vụ.
              </p>
              <div class="flex items-center justify-center gap-1.5">
                <span
                  v-for="star in 5"
                  :key="star"
                  class="text-2xl"
                  :class="star <= selectedRating ? 'text-amber-400' : 'text-slate-200'"
                >&#9733;</span>
              </div>
              <p class="text-sm font-bold text-slate-700 mt-2">
                {{ ratingLabels[selectedRating] }}
              </p>
            </div>
          </div>

          <!-- Case 3: Already rated (from server) -->
          <div
            v-else-if="ticket.rating"
            class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
          >
            <div class="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
              <span
                class="material-symbols-outlined text-amber-400"
                style="font-size: 18px; font-variation-settings: 'FILL' 1"
              >star</span>
              <h2 class="text-sm font-bold text-slate-800">
                Đánh giá của bạn
              </h2>
            </div>
            <div class="px-5 py-5">
              <div class="flex items-center gap-3 mb-3">
                <div class="flex items-center gap-0.5">
                  <span
                    v-for="star in 5"
                    :key="star"
                    class="text-xl"
                    :class="star <= ticket.rating.rating ? 'text-amber-400' : 'text-slate-200'"
                  >&#9733;</span>
                </div>
                <span class="text-sm font-bold text-slate-700">{{ ticket.rating.rating }}/5</span>
                <span class="text-xs font-semibold text-slate-400">{{ ratingLabels[ticket.rating.rating] }}</span>
              </div>
              <p
                v-if="ticket.rating.comment"
                class="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-xl px-4 py-3 italic"
              >
                "{{ ticket.rating.comment }}"
              </p>
              <p
                v-else
                class="text-sm text-slate-400 italic"
              >
                Không có nhận xét
              </p>
              <p
                v-if="ticket.rating.rated_at"
                class="text-[11px] text-slate-400 mt-3"
              >
                Đánh giá lúc {{ formatDateTime(ticket.rating.rated_at) }}
              </p>
            </div>
          </div>

          <!-- Case 4: Ratable — show rating form -->
          <div
            v-else-if="ticket.is_ratable"
            class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
          >
            <div class="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
              <span
                class="material-symbols-outlined text-amber-400"
                style="font-size: 18px; font-variation-settings: 'FILL' 1"
              >star</span>
              <h2 class="text-sm font-bold text-slate-800">
                Đánh giá dịch vụ
              </h2>
            </div>
            <form
              class="px-5 py-5 space-y-5"
              @submit.prevent="handleSubmit"
            >
              <!-- Star picker -->
              <div class="text-center">
                <p class="text-sm font-semibold text-slate-600 mb-3">
                  Bạn đánh giá dịch vụ như thế nào?
                </p>
                <div class="flex items-center justify-center gap-2">
                  <button
                    v-for="star in 5"
                    :key="star"
                    type="button"
                    class="star-btn text-4xl transition-all duration-150 focus:outline-none"
                    :class="[
                      star <= displayRating
                        ? 'text-amber-400 scale-110'
                        : 'text-slate-200 hover:text-amber-300',
                      star === displayRating ? 'scale-125' : ''
                    ]"
                    @click="selectStar(star)"
                    @mouseenter="hoverRating = star"
                    @mouseleave="hoverRating = 0"
                  >
                    &#9733;
                  </button>
                </div>
                <Transition
                  name="fade"
                  mode="out-in"
                >
                  <p
                    v-if="ratingLabel"
                    :key="ratingLabel"
                    class="text-sm font-bold mt-2"
                    :class="{
                      'text-red-500': displayRating === 1,
                      'text-orange-500': displayRating === 2,
                      'text-amber-500': displayRating === 3,
                      'text-emerald-500': displayRating === 4,
                      'text-green-600': displayRating === 5
                    }"
                  >
                    {{ ratingLabel }}
                  </p>
                  <p
                    v-else
                    class="text-xs text-slate-400 mt-2"
                  >
                    Chọn số sao để đánh giá
                  </p>
                </Transition>
              </div>

              <!-- Comment -->
              <div>
                <label class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Nhận xét (không bắt buộc)
                </label>
                <UTextarea
                  v-model="ratingComment"
                  placeholder="Chia sẻ trải nghiệm của bạn..."
                  :rows="3"
                  :maxlength="1000"
                  class="w-full"
                />
                <p class="text-right text-[11px] text-slate-300 mt-1">
                  {{ ratingComment.length }}/1000
                </p>
              </div>

              <!-- Submit -->
              <UButton
                type="submit"
                color="primary"
                size="lg"
                block
                :loading="isSubmitting"
                :disabled="selectedRating < 1 || isSubmitting"
              >
                Gửi đánh giá
              </UButton>
            </form>
          </div>
        </template>

        <!-- Footer -->
        <div class="text-center py-6">
          <p class="text-xs text-slate-400">
            Thần Nông &mdash; Hệ thống quản lý dịch vụ cư dân
          </p>
        </div>
      </div>
    </main>

    <!-- ══════════════ STICKY MOBILE ACTION BAR ══════════════ -->
    <!-- Teleported to <body> to escape any parent stacking/transform context. -->
    <!-- `lg:hidden` keeps desktop unchanged; mobile + tablet always see the bar. -->
    <Teleport to="body">
      <div
        v-if="showStickyQuoteBar"
        class="sticky-action-bar lg:hidden"
        style="padding-bottom: env(safe-area-inset-bottom);"
      >
        <div class="px-4 pt-3 pb-3 max-w-2xl mx-auto">
          <div class="flex items-center justify-between mb-2.5">
            <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Báo giá chờ chấp thuận
            </p>
            <p class="text-base font-extrabold text-slate-900">
              {{ formatCurrency(ticket?.quote?.total_amount ?? '0') }}
            </p>
          </div>
          <div class="flex gap-2.5">
            <UButton
              color="error"
              variant="outline"
              size="xl"
              class="flex-1 justify-center min-h-[48px] font-semibold"
              icon="i-lucide-x"
              @click="showRejectModal = true"
            >
              Từ chối
            </UButton>
            <UButton
              color="success"
              size="xl"
              class="flex-[1.6] justify-center min-h-[48px] font-semibold"
              icon="i-lucide-check"
              @click="showApproveModal = true"
            >
              Đồng ý
            </UButton>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ══════════════ MODAL: Đồng ý báo giá ══════════════ -->
    <UModal v-model:open="showApproveModal">
      <template #content>
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="size-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
              <span
                class="material-symbols-outlined text-emerald-500"
                style="font-size: 20px; font-variation-settings: 'FILL' 1"
              >check_circle</span>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900">
                Xác nhận chấp thuận báo giá
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">
                Hành động này không thể hoàn tác.
              </p>
            </div>
          </div>

          <div
            v-if="ticket?.quote"
            class="bg-slate-50 rounded-xl px-4 py-3 mb-5"
          >
            <p class="text-xs text-slate-500 mb-1">
              Tổng giá trị báo giá
            </p>
            <p class="text-xl font-extrabold text-slate-900">
              {{ formatCurrency(ticket.quote.total_amount) }}
            </p>
          </div>

          <p class="text-sm text-slate-600 mb-5">
            Sau khi chấp thuận, đội ngũ kỹ thuật sẽ tiến hành thực hiện công việc theo báo giá đã thỏa thuận.
          </p>

          <div class="flex gap-3">
            <UButton
              color="neutral"
              variant="outline"
              size="md"
              class="flex-1"
              :disabled="isQuoteSubmitting"
              @click="showApproveModal = false"
            >
              Huỷ
            </UButton>
            <UButton
              color="success"
              size="md"
              class="flex-1"
              :loading="isQuoteSubmitting"
              @click="handleApprove"
            >
              Xác nhận đồng ý
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- ══════════════ MODAL: Từ chối báo giá ══════════════ -->
    <UModal v-model:open="showRejectModal">
      <template #content>
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="size-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
              <span
                class="material-symbols-outlined text-red-500"
                style="font-size: 20px; font-variation-settings: 'FILL' 1"
              >cancel</span>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900">
                Từ chối báo giá
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">
                Hành động này không thể hoàn tác.
              </p>
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Lý do từ chối <span class="text-red-400">*</span>
            </label>
            <UTextarea
              v-model="rejectReason"
              placeholder="Vui lòng cho chúng tôi biết lý do bạn từ chối báo giá này..."
              :rows="4"
              :maxlength="1000"
              class="w-full"
            />
            <div class="flex items-center justify-between mt-1">
              <p
                v-if="rejectReason.trim().length > 0 && rejectReason.trim().length < 5"
                class="text-[11px] text-red-400"
              >
                Tối thiểu 5 ký tự
              </p>
              <span v-else />
              <p class="text-[11px] text-slate-300">
                {{ rejectReason.length }}/1000
              </p>
            </div>
          </div>

          <div class="flex gap-3">
            <UButton
              color="neutral"
              variant="outline"
              size="md"
              class="flex-1"
              :disabled="isQuoteSubmitting"
              @click="showRejectModal = false; rejectReason = ''"
            >
              Huỷ
            </UButton>
            <UButton
              color="error"
              size="md"
              class="flex-1"
              :loading="isQuoteSubmitting"
              :disabled="rejectReason.trim().length < 5"
              @click="handleReject"
            >
              Xác nhận từ chối
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- ══════════════ MODAL: Xác nhận biên bản nghiệm thu ══════════════ -->
    <UModal v-model:open="showAcceptanceConfirmModal">
      <template #content>
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="size-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
              <span
                class="material-symbols-outlined text-emerald-500"
                style="font-size: 20px; font-variation-settings: 'FILL' 1"
              >assignment_turned_in</span>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900">
                Xác nhận biên bản nghiệm thu
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">
                Ký tên để xác nhận công việc đã được hoàn tất.
              </p>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Họ và tên <span class="text-red-400">*</span>
              </label>
              <UInput
                v-model="acceptanceSignatureName"
                placeholder="Nhập họ tên người xác nhận"
                :maxlength="255"
                class="w-full"
              />
              <p
                v-if="acceptanceSignatureName.trim().length > 0 && acceptanceSignatureName.trim().length < 2"
                class="text-[11px] text-red-400 mt-1"
              >
                Tối thiểu 2 ký tự
              </p>
            </div>

            <div>
              <label class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Ghi chú (không bắt buộc)
              </label>
              <UTextarea
                v-model="acceptanceNote"
                placeholder="Ghi chú thêm về quá trình nghiệm thu..."
                :rows="3"
                :maxlength="2000"
                class="w-full"
              />
            </div>
          </div>

          <div class="flex gap-3 mt-5">
            <UButton
              color="neutral"
              variant="outline"
              size="md"
              class="flex-1"
              :disabled="isAcceptanceSubmitting"
              @click="showAcceptanceConfirmModal = false"
            >
              Huỷ
            </UButton>
            <UButton
              color="success"
              size="md"
              class="flex-1"
              :loading="isAcceptanceSubmitting"
              :disabled="acceptanceSignatureName.trim().length < 2"
              @click="handleAcceptanceConfirm"
            >
              Xác nhận
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- ══════════════ MODAL: Yêu cầu bảo hành ══════════════ -->
    <SharedTicketWarrantyRequestModal
      v-model:open="showWarrantyCreateModal"
      mode="create"
      :ticket-code="code"
      @submitted="handleWarrantySubmitted"
    />

    <!-- ══════════════ MODAL: Xem chi tiết bảo hành ══════════════ -->
    <SharedTicketWarrantyRequestModal
      v-model:open="showWarrantyViewModal"
      mode="view"
      :ticket-code="code"
      :request="selectedWarrantyRequest"
    />
  </div>
</template>

<style scoped>
.star-btn {
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  line-height: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>

<!-- Non-scoped: the sticky bar is <Teleport to="body">, so scoped selectors don't reach it. -->
<style>
.sticky-action-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  background-color: #ffffff;
  border-top: 1px solid rgb(226 232 240);
  box-shadow: 0 -4px 16px rgba(15, 23, 42, 0.08);
  animation: slide-up 220ms ease-out;
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
