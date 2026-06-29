<script setup lang="ts">
import type { TicketResource, SubmitTicketRequestChannel } from '~/composables/api/useTickets'
import type { PublicServiceIndex200DataItem } from '#api/generated/laravel'

definePageMeta({ layout: false })

useSeoMeta({
  title: 'Gửi yêu cầu hỗ trợ - Thần Nông',
  description: 'Gửi yêu cầu sửa chữa và bảo trì căn hộ nhanh chóng. Phản hồi trong 24 giờ.'
})

const route = useRoute()

// --- Pre-filled from query params (locked fields) ---
const q = route.query
const { isTenantDomain, tenantSubdomain } = useAppContext()
const locked = {
  name: !!q.name,
  phone: !!q.phone,
  org_id: !!q.org_id || isTenantDomain.value,
  project_id: !!q.project_id,
  channel: !!q.channel,
  address: !!q.address
}

// --- Form state ---
const requesterName = ref(locked.name ? String(q.name) : '')
const requesterPhone = ref(locked.phone ? String(q.phone) : '')
const requesterEmail = ref('')
// Auto-fill org_id from tenant subdomain (subdomain = org id)
const selectedOrgId = ref<string | undefined>(
  q.org_id ? String(q.org_id) : (isTenantDomain.value ? tenantSubdomain.value ?? undefined : undefined)
)
const projectId = ref<number | null>(locked.project_id ? Number(q.project_id) : null)
const subject = ref('')
const description = ref('')
const address = ref(locked.address ? String(q.address) : '')
const latitude = ref<number | null>(null)
const longitude = ref<number | null>(null)
const channel = ref<SubmitTicketRequestChannel>(locked.channel ? String(q.channel) as SubmitTicketRequestChannel : 'website')
const attachments = ref<File[]>([])
const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)
const submittedTicket = ref<TicketResource | null>(null)

// --- Fetch service categories & items from API ---
type ServiceItem = PublicServiceIndex200DataItem

const serviceParams = ref({ per_page: SELECT_ALL_PER_PAGE })
const { data: servicesData, status: servicesStatus } = usePublicServices(serviceParams)

interface QuickCategory {
  name: string
  items: string[]
}

const quickCategories = computed<QuickCategory[]>(() => {
  const categories = servicesData.value?.categories ?? []
  const items = servicesData.value?.data ?? []

  return categories.map(cat => ({
    name: cat.name,
    items: items
      .filter((item: ServiceItem) => item.category?.id === cat.id)
      .map((item: ServiceItem) => item.name)
  })).filter(cat => cat.items.length > 0)
})

const prefilledService = q.service ? String(q.service) : null
const selectedQuickItems = ref<Set<string>>(prefilledService ? new Set([prefilledService]) : new Set())

function toggleQuickItem(item: string) {
  const newSet = new Set(selectedQuickItems.value)
  if (newSet.has(item)) {
    newSet.delete(item)
  } else {
    newSet.add(item)
  }
  selectedQuickItems.value = newSet
}

const activeCategory = ref(0)

// Auto-select the right category tab when a service is pre-filled via query param
if (prefilledService) {
  const stopWatch = watch(quickCategories, (cats) => {
    if (!cats.length) return
    const idx = cats.findIndex(cat => cat.items.includes(prefilledService))
    if (idx >= 0) activeCategory.value = idx
    nextTick(() => { stopWatch() })
  })
}

const activeCategoryItems = computed(() => quickCategories.value[activeCategory.value]?.items ?? [])

function categorySelectionCount(catIndex: number): number {
  return quickCategories.value[catIndex]?.items.filter(item => selectedQuickItems.value.has(item)).length ?? 0
}

const totalSelected = computed(() => selectedQuickItems.value.size)

// Map item → category for chip display
const selectedItemsWithCategory = computed(() => {
  const result: { item: string, category: string }[] = []
  for (const cat of quickCategories.value) {
    for (const item of cat.items) {
      if (selectedQuickItems.value.has(item)) {
        result.push({ item, category: cat.name })
      }
    }
  }
  return result
})

// --- Lookup resolved names for org/project ---
const orgName = ref<string | null>(null)
const projectName = ref<string | null>(null)
const isLookupLoading = ref(false)

const needsLookup = locked.org_id || locked.project_id

onMounted(async () => {
  if (!needsLookup) return
  isLookupLoading.value = true
  try {
    const result = await apiTicketLookup(selectedOrgId.value, projectId.value ?? undefined)
    orgName.value = result.org_name
    projectName.value = result.project_name
    // Clear invalid values
    if (locked.org_id && !result.org_name) selectedOrgId.value = undefined
    if (locked.project_id && !result.project_name) projectId.value = null
  } catch {
    // Lookup failed — clear locked IDs
    if (locked.org_id) selectedOrgId.value = undefined
    if (locked.project_id) projectId.value = null
  } finally {
    isLookupLoading.value = false
  }
})

const fileInputRef = ref<HTMLInputElement | null>(null)

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files) return

  const newFiles = Array.from(input.files)
  for (const file of newFiles) {
    if (attachments.value.length >= ATTACHMENT_MAX_FILES) {
      errors.value.attachments = `Tối đa ${ATTACHMENT_MAX_FILES} tệp đính kèm.`
      break
    }
    if (file.size > ATTACHMENT_MAX_FILE_SIZE) {
      errors.value.attachments = `Tệp "${file.name}" vượt quá 10MB.`
      continue
    }
    if (!ATTACHMENT_ALLOWED_TYPES.includes(file.type)) {
      errors.value.attachments = `Tệp "${file.name}" không được hỗ trợ.`
      continue
    }
    if (attachments.value.length < ATTACHMENT_MAX_FILES) {
      attachments.value.push(file)
    }
  }

  input.value = ''
}

function removeFile(index: number) {
  attachments.value.splice(index, 1)
  if (errors.value.attachments) delete errors.value.attachments
}

function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

async function handleSubmit() {
  errors.value = {}
  const localErrors: Record<string, string> = {}
  if (!requesterName.value.trim()) localErrors.requester_name = 'Vui lòng nhập họ tên.'
  if (!requesterPhone.value.trim()) localErrors.requester_phone = 'Vui lòng nhập số điện thoại.'
  if (selectedQuickItems.value.size === 0 && !subject.value.trim()) localErrors.subject = 'Vui lòng chọn hạng mục hoặc nhập tiêu đề.'
  if (Object.keys(localErrors).length > 0) {
    errors.value = localErrors
    return
  }

  // Compose subject from quick items + custom text
  const composedSubject = [
    ...Array.from(selectedQuickItems.value),
    ...(subject.value.trim() ? [subject.value.trim()] : [])
  ].join(', ')

  isSubmitting.value = true
  try {
    const res = await apiSubmitTicket({
      requester_name: requesterName.value.trim(),
      requester_phone: requesterPhone.value.trim(),
      requester_email: requesterEmail.value.trim() || undefined,
      project_id: projectId.value,
      claimed_by_org_id: selectedOrgId.value || (isTenantDomain.value ? tenantSubdomain.value ?? undefined : undefined),
      subject: composedSubject,
      description: description.value.trim() || undefined,
      address: address.value.trim() || undefined,
      latitude: latitude.value,
      longitude: longitude.value,
      channel: channel.value,
      attachments: attachments.value.length > 0 ? attachments.value : undefined
    })
    submittedTicket.value = res.data
  } catch (err: unknown) {
    const validationErrors = getApiValidationErrors(err)
    if (validationErrors) {
      const mapped: Record<string, string> = {}
      for (const [field, msgs] of Object.entries(validationErrors)) {
        mapped[field] = Array.isArray(msgs) ? (msgs[0] ?? String(msgs)) : String(msgs)
      }
      errors.value = mapped
    } else {
      errors.value = { general: getApiErrorMessage(err, 'Có lỗi xảy ra, vui lòng thử lại.') }
    }
  } finally {
    isSubmitting.value = false
  }
}

function resetForm() {
  requesterName.value = ''
  requesterPhone.value = ''
  requesterEmail.value = ''
  selectedOrgId.value = undefined
  projectId.value = null
  subject.value = ''
  description.value = ''
  selectedQuickItems.value = new Set()
  address.value = ''
  latitude.value = null
  longitude.value = null
  channel.value = 'website'
  attachments.value = []
  errors.value = {}
  submittedTicket.value = null
}

// --- FAQ ---
const faqs = [
  { question: 'Thời gian phản hồi yêu cầu là bao lâu?', answer: 'Đội ngũ kỹ thuật sẽ tiếp nhận yêu cầu trong vòng 24 giờ làm việc và liên hệ trực tiếp với bạn để xác nhận lịch xử lý.' },
  { question: 'Làm sao để theo dõi tiến độ xử lý?', answer: 'Sau khi gửi yêu cầu, bạn sẽ nhận được mã yêu cầu (ví dụ: #TNP-2026-0042). Sử dụng mã này để tra cứu trạng thái trên hệ thống.' },
  { question: 'Chi phí dịch vụ được tính như thế nào?', answer: 'Chi phí được báo giá cụ thể sau khi kỹ thuật viên khảo sát thực tế. Bạn sẽ được thông báo trước khi tiến hành sửa chữa.' },
  { question: 'Tôi cần cung cấp thông tin gì?', answer: 'Bạn chỉ cần điền họ tên, số điện thoại và mô tả vấn đề.' }
]
const openFaqIndex = ref<number | null>(null)
function toggleFaq(i: number) {
  openFaqIndex.value = openFaqIndex.value === i ? null : i
}
</script>

<template>
  <div class="min-h-screen w-full overflow-x-hidden bg-white">
    <!-- ═══════════════════════════════════════════
         HERO — gradient bg + form side-by-side
    ═══════════════════════════════════════════ -->
    <section class="relative overflow-hidden bg-slate-900">
      <!-- Subtle accent glow -->
      <div class="absolute top-0 left-1/4 size-[500px] rounded-full bg-indigo-500/10 blur-[150px]" />
      <div class="absolute bottom-0 right-1/4 size-[400px] rounded-full bg-violet-500/8 blur-[120px]" />

      <!-- Grid overlay -->
      <div
        class="absolute inset-0 opacity-[0.04]"
        style="background-image: linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px); background-size: 60px 60px;"
      />

      <!-- Content -->
      <div class="relative max-w-7xl mx-auto px-6 lg:px-16 py-6 lg:py-10">
        <!-- Top nav mini -->
        <div class="flex items-center justify-between mb-8">
          <NuxtLink
            to="/"
            class="flex items-center gap-3 group"
          >
            <div class="size-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
              <span
                class="material-symbols-outlined text-white"
                style="font-size: 20px"
              >domain</span>
            </div>
            <span class="text-white font-bold text-lg tracking-tight">Thần Nông</span>
          </NuxtLink>
          <div class="flex items-center gap-3">
            <NuxtLink
              to="/dich-vu"
              class="hidden sm:flex items-center gap-1.5 text-slate-400 text-sm font-medium hover:text-white transition-colors"
            >
              Dịch vụ
              <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </NuxtLink>
            <NuxtLink
              to="/"
              class="flex items-center gap-1.5 rounded-full px-5 py-2.5 bg-slate-800 border border-slate-700 text-slate-300 text-sm font-semibold hover:bg-slate-700 hover:text-white transition-all"
            >
              <span class="material-symbols-outlined text-sm">home</span>
              Trang chủ
            </NuxtLink>
          </div>
        </div>

        <!-- Hero grid: Text left + Form right -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <!-- Left: Hero text -->
          <div class="flex flex-col gap-6 lg:pt-8">
            <!-- Badge -->
            <div class="flex items-center gap-3">
              <span class="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold px-4 py-2 rounded-full">
                <span class="relative flex size-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span class="relative inline-flex size-2 rounded-full bg-emerald-400" />
                </span>
                Đang hoạt động 24/7
              </span>
            </div>

            <!-- Headline -->
            <h1 class="text-white text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight leading-[1.08]">
              Cần hỗ trợ?<br>
              <span class="text-indigo-400">
                Gửi ngay tại đây
              </span>
            </h1>

            <p class="text-slate-400 text-lg leading-relaxed max-w-md">
              Điền form bên cạnh để gửi yêu cầu sửa chữa, bảo trì. Đội ngũ kỹ thuật viên sẽ phản hồi trong thời gian nhanh nhất.
            </p>

            <!-- Stats row -->
            <div class="flex flex-wrap gap-6 mt-4">
              <div class="flex items-center gap-3">
                <div class="size-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <span
                    class="material-symbols-outlined text-amber-300"
                    style="font-size: 22px"
                  >schedule</span>
                </div>
                <div>
                  <p class="text-white text-xl font-black leading-none">
                    24h
                  </p>
                  <p class="text-slate-500 text-xs font-medium mt-0.5">
                    Phản hồi
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="size-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <span
                    class="material-symbols-outlined text-emerald-300"
                    style="font-size: 22px"
                  >verified</span>
                </div>
                <div>
                  <p class="text-white text-xl font-black leading-none">
                    98%
                  </p>
                  <p class="text-slate-500 text-xs font-medium mt-0.5">
                    Hài lòng
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="size-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <span
                    class="material-symbols-outlined text-sky-300"
                    style="font-size: 22px"
                  >engineering</span>
                </div>
                <div>
                  <p class="text-white text-xl font-black leading-none">
                    50+
                  </p>
                  <p class="text-slate-500 text-xs font-medium mt-0.5">
                    Kỹ thuật viên
                  </p>
                </div>
              </div>
            </div>

            <!-- Trust badges -->
            <div class="hidden lg:flex items-center gap-5 mt-8 pt-8 border-t border-slate-800">
              <div class="flex items-center gap-2 text-slate-500 text-xs font-medium">
                <span
                  class="material-symbols-outlined text-emerald-500"
                  style="font-size: 16px"
                >lock</span>
                Bảo mật thông tin
              </div>
              <div class="flex items-center gap-2 text-slate-500 text-xs font-medium">
                <span
                  class="material-symbols-outlined text-amber-500"
                  style="font-size: 16px"
                >bolt</span>
                Xử lý nhanh chóng
              </div>
              <div class="flex items-center gap-2 text-slate-500 text-xs font-medium">
                <span
                  class="material-symbols-outlined text-sky-500"
                  style="font-size: 16px"
                >support_agent</span>
                Hỗ trợ tận tình
              </div>
            </div>
          </div>

          <!-- Right: Form card -->
          <div class="relative">
            <!-- Glow behind card -->
            <div class="absolute -inset-4 bg-indigo-500/5 rounded-[2rem] blur-2xl" />

            <div class="relative bg-white rounded-3xl shadow-2xl shadow-black/20 overflow-hidden">
              <!-- Form top strip -->
              <div class="h-1.5 bg-indigo-500" />

              <!-- Form header -->
              <div class="px-6 pt-5 pb-4 border-b border-slate-100">
                <div class="flex items-center gap-2.5">
                  <div class="size-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                    <span
                      class="material-symbols-outlined"
                      style="font-size: 17px"
                    >edit_note</span>
                  </div>
                  <div>
                    <h2 class="text-slate-900 text-base font-black tracking-tight leading-none">
                      Gửi yêu cầu hỗ trợ
                    </h2>
                    <p class="text-slate-400 text-[10px] mt-1">
                      <span class="text-red-500">*</span> Bắt buộc
                    </p>
                  </div>
                </div>
              </div>

              <!-- Success state -->
              <div
                v-if="submittedTicket"
                class="flex items-center justify-center p-10"
              >
                <div class="text-center w-full max-w-xs">
                  <div class="relative inline-flex items-center justify-center mb-5">
                    <div class="size-20 rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center">
                      <span
                        class="material-symbols-outlined text-emerald-500"
                        style="font-size: 40px; font-variation-settings: 'FILL' 1"
                      >check_circle</span>
                    </div>
                    <div class="absolute inset-0 rounded-full border-2 border-emerald-300 animate-ping opacity-30" />
                  </div>
                  <h3 class="text-slate-900 text-2xl font-black mb-2">
                    Gửi thành công!
                  </h3>
                  <p class="text-slate-400 text-sm mb-6 leading-relaxed">
                    Lưu mã bên dưới để theo dõi tiến độ
                  </p>
                  <div class="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-dashed border-slate-200 rounded-2xl px-6 py-5 mb-6">
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">
                      Mã yêu cầu
                    </p>
                    <p class="text-3xl font-black text-slate-900 font-mono tracking-widest">
                      {{ submittedTicket.code }}
                    </p>
                  </div>
                  <button
                    class="w-full h-11 rounded-xl bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-600 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-indigo-500/25"
                    @click="resetForm"
                  >
                    Gửi yêu cầu khác
                  </button>
                </div>
              </div>

              <!-- Form -->
              <form
                v-else
                class="px-6 pt-5 pb-6 flex flex-col gap-3"
                @submit.prevent="handleSubmit"
              >
                <!-- General error -->
                <UAlert
                  v-if="errors.general"
                  icon="i-lucide-alert-circle"
                  color="error"
                  variant="subtle"
                  :description="errors.general"
                />

                <!-- Pre-filled context bar (org / project) -->
                <div
                  v-if="orgName || projectName"
                  class="rounded-xl bg-indigo-50 border border-indigo-200 px-4 py-3 flex flex-col gap-1"
                >
                  <div
                    v-if="orgName"
                    class="flex items-center gap-2 text-sm"
                  >
                    <span
                      class="material-symbols-outlined text-indigo-500"
                      style="font-size: 16px"
                    >business</span>
                    <span class="text-slate-500 text-xs">Đơn vị:</span>
                    <span class="font-semibold text-slate-800">{{ orgName }}</span>
                  </div>
                  <div
                    v-if="projectName"
                    class="flex items-center gap-2 text-sm"
                  >
                    <span
                      class="material-symbols-outlined text-indigo-500"
                      style="font-size: 16px"
                    >apartment</span>
                    <span class="text-slate-500 text-xs">Dự án:</span>
                    <span class="font-semibold text-slate-800">{{ projectName }}</span>
                  </div>
                </div>

                <!-- Lookup loading -->
                <div
                  v-else-if="isLookupLoading"
                  class="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 flex items-center gap-2 text-sm text-slate-400"
                >
                  <span class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                  Đang tải thông tin...
                </div>

                <!-- Name + Phone -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div class="flex flex-col gap-1.5">
                    <label
                      for="f-name"
                      class="text-xs font-bold text-slate-600"
                    >Họ và tên <span class="text-red-500">*</span></label>
                    <input
                      id="f-name"
                      v-model="requesterName"
                      type="text"
                      placeholder="Nguyễn Văn A"
                      :disabled="isSubmitting || locked.name"
                      class="h-10 rounded-xl border px-3.5 text-sm text-slate-900 placeholder:text-slate-300 outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                      :class="errors.requester_name ? 'border-red-400 bg-red-50' : locked.name ? 'border-slate-200 bg-slate-100' : 'border-slate-200 bg-slate-50/80 focus:bg-white focus:border-indigo-500'"
                    >
                    <p
                      v-if="errors.requester_name"
                      class="text-[11px] text-red-500"
                    >
                      {{ errors.requester_name }}
                    </p>
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label
                      for="f-phone"
                      class="text-xs font-bold text-slate-600"
                    >Số điện thoại <span class="text-red-500">*</span></label>
                    <input
                      id="f-phone"
                      v-model="requesterPhone"
                      type="tel"
                      placeholder="0901 234 567"
                      :disabled="isSubmitting || locked.phone"
                      class="h-10 rounded-xl border px-3.5 text-sm text-slate-900 placeholder:text-slate-300 outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                      :class="errors.requester_phone ? 'border-red-400 bg-red-50' : locked.phone ? 'border-slate-200 bg-slate-100' : 'border-slate-200 bg-slate-50/80 focus:bg-white focus:border-indigo-500'"
                    >
                    <p
                      v-if="errors.requester_phone"
                      class="text-[11px] text-red-500"
                    >
                      {{ errors.requester_phone }}
                    </p>
                  </div>
                </div>

                <!-- Email (optional) -->
                <div class="flex flex-col gap-1.5">
                  <label
                    for="f-email"
                    class="text-xs font-bold text-slate-600"
                  >Email <span class="text-[10px] font-semibold text-slate-400">(không bắt buộc — để nhận cập nhật qua mail)</span></label>
                  <input
                    id="f-email"
                    v-model="requesterEmail"
                    type="email"
                    autocomplete="email"
                    placeholder="ban@example.com"
                    :disabled="isSubmitting"
                    class="h-10 rounded-xl border px-3.5 text-sm text-slate-900 placeholder:text-slate-300 outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                    :class="errors.requester_email ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50/80 focus:bg-white focus:border-indigo-500'"
                  >
                  <p
                    v-if="errors.requester_email"
                    class="text-[11px] text-red-500"
                  >
                    {{ errors.requester_email }}
                  </p>
                </div>

                <!-- Divider -->
                <div class="border-t border-slate-100 my-0.5" />

                <!-- Issue picker -->
                <div class="flex flex-col gap-2">
                  <div class="flex flex-col gap-0.5">
                    <div class="flex items-center justify-between">
                      <label class="text-xs font-bold text-slate-600">
                        Danh mục <span class="text-red-500">*</span>
                      </label>
                      <span
                        v-if="totalSelected > 0"
                        class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 pl-1.5 pr-2 py-0.5 rounded-full"
                      >
                        <span
                          class="material-symbols-outlined"
                          style="font-size: 13px"
                        >check_circle</span>
                        {{ totalSelected }}
                      </span>
                    </div>
                    <p class="text-[10px] text-slate-400">
                      Có thể chọn nhiều danh mục cùng lúc
                    </p>
                  </div>

                  <!-- Loading state -->
                  <div
                    v-if="servicesStatus === 'pending'"
                    class="flex items-center justify-center py-4"
                  >
                    <span
                      class="material-symbols-outlined animate-spin text-slate-400"
                      style="font-size: 20px"
                    >progress_activity</span>
                    <span class="ml-2 text-xs text-slate-400">Đang tải danh mục...</span>
                  </div>

                  <!-- Category tabs -->
                  <template v-else-if="quickCategories.length > 0">
                    <div
                      class="flex gap-1 overflow-x-auto pb-0.5"
                      style="scrollbar-width: none; -ms-overflow-style: none;"
                    >
                      <button
                        v-for="(cat, idx) in quickCategories"
                        :key="cat.name"
                        type="button"
                        :disabled="isSubmitting"
                        class="relative flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer disabled:opacity-50"
                        :class="activeCategory === idx
                          ? 'bg-slate-800 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'"
                        @click="activeCategory = idx"
                      >
                        {{ cat.name }}
                        <span
                          v-if="categorySelectionCount(idx) > 0"
                          class="size-[15px] rounded-full text-[9px] font-bold flex items-center justify-center"
                          :class="activeCategory === idx
                            ? 'bg-indigo-400 text-white'
                            : 'bg-indigo-500 text-white'"
                        >
                          {{ categorySelectionCount(idx) }}
                        </span>
                      </button>
                    </div>

                    <!-- Items for active category -->
                    <div class="grid grid-cols-2 gap-1.5">
                      <button
                        v-for="item in activeCategoryItems"
                        :key="item"
                        type="button"
                        :disabled="isSubmitting"
                        class="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-left"
                        :class="selectedQuickItems.has(item)
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'"
                        @click="toggleQuickItem(item)"
                      >
                        <span
                          class="size-4 rounded shrink-0 flex items-center justify-center transition-colors"
                          :class="selectedQuickItems.has(item)
                            ? 'bg-indigo-500 text-white'
                            : 'border border-slate-300'"
                        >
                          <span
                            v-if="selectedQuickItems.has(item)"
                            class="material-symbols-outlined"
                            style="font-size: 12px"
                          >check</span>
                        </span>
                        <span class="leading-tight">{{ item }}</span>
                      </button>
                    </div>

                    <!-- Selected items chips (cross-category summary) -->
                    <div
                      v-if="selectedItemsWithCategory.length > 0"
                      class="flex flex-wrap gap-1.5"
                    >
                      <span
                        v-for="{ item, category } in selectedItemsWithCategory"
                        :key="item"
                        class="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full pl-2 pr-1 py-0.5 text-[10px] font-medium"
                      >
                        <span class="text-indigo-400 font-bold">{{ category }}</span>
                        <span class="mx-0.5 text-indigo-300">·</span>
                        {{ item }}
                        <button
                          type="button"
                          :disabled="isSubmitting"
                          class="size-4 rounded-full flex items-center justify-center hover:bg-indigo-200 transition-colors cursor-pointer ml-0.5 disabled:opacity-50"
                          @click="toggleQuickItem(item)"
                        >
                          <span
                            class="material-symbols-outlined text-indigo-400 hover:text-indigo-600"
                            style="font-size: 11px"
                          >close</span>
                        </button>
                      </span>
                    </div>
                  </template>

                  <!-- Inline custom subject -->
                  <input
                    id="f-subject"
                    v-model="subject"
                    type="text"
                    placeholder="Hoặc ghi vấn đề khác..."
                    :disabled="isSubmitting"
                    class="h-8 rounded-lg border border-dashed border-slate-200 bg-transparent px-3 text-xs text-slate-700 placeholder:text-slate-300 outline-none transition-all focus:bg-white focus:border-indigo-400 focus:border-solid focus:ring-2 focus:ring-indigo-500/15 disabled:opacity-50"
                  >

                  <p
                    v-if="errors.subject"
                    class="text-[11px] text-red-500 -mt-1"
                  >
                    {{ errors.subject }}
                  </p>
                </div>

                <!-- Description -->
                <div class="flex flex-col gap-1">
                  <label
                    for="f-desc"
                    class="text-xs font-bold text-slate-600"
                  >Mô tả chi tiết</label>
                  <textarea
                    id="f-desc"
                    v-model="description"
                    rows="2"
                    placeholder="Mô tả thêm về vấn đề..."
                    :disabled="isSubmitting"
                    class="rounded-lg border border-slate-200 bg-slate-50/80 focus:bg-white focus:border-indigo-500 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-300 outline-none resize-none transition-all focus:ring-2 focus:ring-indigo-500/15 disabled:opacity-50"
                  />
                </div>

                <!-- Address + Map (hidden if address pre-filled) -->
                <div
                  v-if="locked.address"
                  class="flex flex-col gap-1.5"
                >
                  <label class="text-xs font-bold text-slate-600">Địa chỉ</label>
                  <input
                    :value="address"
                    type="text"
                    disabled
                    class="h-10 rounded-xl border border-slate-200 bg-slate-100 px-3.5 text-sm text-slate-900 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                </div>
                <SharedAddressMapPicker
                  v-else
                  v-model="address"
                  v-model:latitude="latitude"
                  v-model:longitude="longitude"
                  :disabled="isSubmitting"
                  collapsible
                />

                <!-- Attachments (compact) -->
                <div class="flex flex-col gap-1.5">
                  <input
                    ref="fileInputRef"
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/gif,image/webp,application/pdf,.doc,.docx,.xls,.xlsx"
                    class="hidden"
                    :disabled="isSubmitting"
                    @change="handleFileSelect"
                  >

                  <button
                    v-if="attachments.length < ATTACHMENT_MAX_FILES"
                    type="button"
                    :disabled="isSubmitting"
                    class="flex items-center gap-2 self-start px-3 py-2 rounded-lg border border-dashed border-slate-300 text-xs font-medium text-slate-500 transition-all hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 disabled:opacity-50 cursor-pointer"
                    @click="fileInputRef?.click()"
                  >
                    <span
                      class="material-symbols-outlined"
                      style="font-size: 16px"
                    >attach_file</span>
                    Đính kèm tệp
                    <span class="text-[10px] text-slate-400 font-normal">(tối đa {{ ATTACHMENT_MAX_FILES }})</span>
                  </button>

                  <!-- Compact file list -->
                  <div
                    v-if="attachments.length > 0"
                    class="flex flex-wrap gap-1.5"
                  >
                    <div
                      v-for="(file, idx) in attachments"
                      :key="idx"
                      class="flex items-center gap-1.5 rounded-md bg-slate-50 border border-slate-200 pl-2 pr-1 py-1 max-w-[200px]"
                    >
                      <span
                        class="material-symbols-outlined shrink-0"
                        :class="isImageFile(file) ? 'text-violet-500' : 'text-amber-600'"
                        style="font-size: 13px"
                      >
                        {{ isImageFile(file) ? 'image' : 'description' }}
                      </span>
                      <span class="text-[10px] font-medium text-slate-600 truncate">{{ file.name }}</span>
                      <button
                        type="button"
                        class="size-5 rounded flex items-center justify-center hover:bg-red-100 transition-colors cursor-pointer shrink-0"
                        :disabled="isSubmitting"
                        @click="removeFile(idx)"
                      >
                        <span
                          class="material-symbols-outlined text-slate-400 hover:text-red-500"
                          style="font-size: 12px"
                        >close</span>
                      </button>
                    </div>
                  </div>

                  <p
                    v-if="errors.attachments"
                    class="text-[11px] text-red-500"
                  >
                    {{ errors.attachments }}
                  </p>
                </div>

                <!-- Submit -->
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span
                    v-if="isSubmitting"
                    class="material-symbols-outlined text-base animate-spin"
                  >progress_activity</span>
                  <span
                    v-else
                    class="material-symbols-outlined text-base"
                  >send</span>
                  {{ isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu' }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         HOW IT WORKS — 3 steps
    ═══════════════════════════════════════════ -->
    <section class="relative bg-slate-50 py-20 overflow-hidden">
      <!-- Subtle decorative -->
      <div class="absolute top-0 right-0 size-96 rounded-full bg-indigo-100/40 blur-[100px]" />
      <div class="absolute bottom-0 left-0 size-72 rounded-full bg-fuchsia-100/30 blur-[80px]" />

      <div class="relative max-w-7xl mx-auto px-6 lg:px-16">
        <div class="text-center mb-14">
          <span class="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
            <span
              class="material-symbols-outlined"
              style="font-size: 14px"
            >route</span>
            Quy trình
          </span>
          <h2 class="text-slate-900 text-3xl lg:text-4xl font-black tracking-tight mb-3">
            Đơn giản chỉ <span class="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">3 bước</span>
          </h2>
          <p class="text-slate-500 text-lg max-w-xl mx-auto">
            Nhanh gọn, tiện lợi — không cần đăng ký tài khoản
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <!-- Step 1 -->
          <div class="relative group">
            <div class="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div class="flex items-center gap-3 mb-5">
                <div class="size-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 font-black text-lg">
                  1
                </div>
                <div class="h-0.5 flex-1 bg-gradient-to-r from-indigo-200 to-transparent rounded" />
              </div>
              <div class="size-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
                <span
                  class="material-symbols-outlined text-indigo-600"
                  style="font-size: 26px"
                >edit_note</span>
              </div>
              <h3 class="text-slate-900 text-lg font-bold mb-2">
                Điền thông tin
              </h3>
              <p class="text-slate-500 text-sm leading-relaxed">
                Nhập họ tên, số điện thoại và mô tả sự cố cần hỗ trợ.
              </p>
            </div>
            <!-- Arrow -->
            <div class="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 size-6 rounded-full bg-white border border-slate-200 shadow items-center justify-center">
              <span
                class="material-symbols-outlined text-indigo-500"
                style="font-size: 14px"
              >arrow_forward</span>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="relative group">
            <div class="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div class="flex items-center gap-3 mb-5">
                <div class="size-12 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-violet-500/30 font-black text-lg">
                  2
                </div>
                <div class="h-0.5 flex-1 bg-gradient-to-r from-violet-200 to-transparent rounded" />
              </div>
              <div class="size-12 rounded-xl bg-violet-50 flex items-center justify-center mb-4">
                <span
                  class="material-symbols-outlined text-violet-600"
                  style="font-size: 26px"
                >task_alt</span>
              </div>
              <h3 class="text-slate-900 text-lg font-bold mb-2">
                Tiếp nhận & phân công
              </h3>
              <p class="text-slate-500 text-sm leading-relaxed">
                Đội ngũ đánh giá yêu cầu và phân công kỹ thuật viên phù hợp.
              </p>
            </div>
            <div class="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 size-6 rounded-full bg-white border border-slate-200 shadow items-center justify-center">
              <span
                class="material-symbols-outlined text-violet-500"
                style="font-size: 14px"
              >arrow_forward</span>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="group">
            <div class="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div class="flex items-center gap-3 mb-5">
                <div class="size-12 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 text-white flex items-center justify-center shadow-lg shadow-fuchsia-500/30 font-black text-lg">
                  3
                </div>
                <div class="h-0.5 flex-1 bg-gradient-to-r from-fuchsia-200 to-transparent rounded" />
              </div>
              <div class="size-12 rounded-xl bg-fuchsia-50 flex items-center justify-center mb-4">
                <span
                  class="material-symbols-outlined text-fuchsia-600"
                  style="font-size: 26px"
                >handyman</span>
              </div>
              <h3 class="text-slate-900 text-lg font-bold mb-2">
                Xử lý & hoàn thành
              </h3>
              <p class="text-slate-500 text-sm leading-relaxed">
                Kỹ thuật viên đến tận nơi xử lý. Theo dõi qua mã yêu cầu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         FEATURES — colorful grid
    ═══════════════════════════════════════════ -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-6 lg:px-16">
        <div class="text-center mb-14">
          <span class="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
            <span
              class="material-symbols-outlined"
              style="font-size: 14px"
            >star</span>
            Cam kết
          </span>
          <h2 class="text-slate-900 text-3xl lg:text-4xl font-black tracking-tight mb-3">
            Tại sao chọn <span class="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Thần Nông?</span>
          </h2>
          <p class="text-slate-500 text-lg max-w-xl mx-auto">
            Dịch vụ hỗ trợ cư dân hàng đầu
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="group p-6 rounded-2xl border border-slate-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div class="size-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4 shadow-lg shadow-amber-400/30 group-hover:scale-110 transition-transform">
              <span
                class="material-symbols-outlined text-white"
                style="font-size: 24px"
              >bolt</span>
            </div>
            <h3 class="text-slate-900 text-base font-bold mb-1.5">
              Phản hồi nhanh chóng
            </h3>
            <p class="text-slate-500 text-sm leading-relaxed">
              Tiếp nhận trong 24h. Sự cố khẩn cấp ưu tiên xử lý ngay.
            </p>
          </div>

          <div class="group p-6 rounded-2xl border border-slate-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div class="size-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-4 shadow-lg shadow-emerald-400/30 group-hover:scale-110 transition-transform">
              <span
                class="material-symbols-outlined text-white"
                style="font-size: 24px"
              >manage_search</span>
            </div>
            <h3 class="text-slate-900 text-base font-bold mb-1.5">
              Theo dõi minh bạch
            </h3>
            <p class="text-slate-500 text-sm leading-relaxed">
              Mã yêu cầu giúp tra cứu trạng thái mọi lúc, mọi nơi.
            </p>
          </div>

          <div class="group p-6 rounded-2xl border border-slate-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div class="size-12 rounded-xl bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center mb-4 shadow-lg shadow-indigo-400/30 group-hover:scale-110 transition-transform">
              <span
                class="material-symbols-outlined text-white"
                style="font-size: 24px"
              >verified_user</span>
            </div>
            <h3 class="text-slate-900 text-base font-bold mb-1.5">
              KTV chuyên nghiệp
            </h3>
            <p class="text-slate-500 text-sm leading-relaxed">
              Đội ngũ được đào tạo bài bản, chứng nhận chuyên môn.
            </p>
          </div>

          <div class="group p-6 rounded-2xl border border-slate-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div class="size-12 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center mb-4 shadow-lg shadow-violet-400/30 group-hover:scale-110 transition-transform">
              <span
                class="material-symbols-outlined text-white"
                style="font-size: 24px"
              >payments</span>
            </div>
            <h3 class="text-slate-900 text-base font-bold mb-1.5">
              Báo giá minh bạch
            </h3>
            <p class="text-slate-500 text-sm leading-relaxed">
              Chi phí thông báo rõ trước khi sửa. Không phí ẩn.
            </p>
          </div>

          <div class="group p-6 rounded-2xl border border-slate-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div class="size-12 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center mb-4 shadow-lg shadow-rose-400/30 group-hover:scale-110 transition-transform">
              <span
                class="material-symbols-outlined text-white"
                style="font-size: 24px"
              >support</span>
            </div>
            <h3 class="text-slate-900 text-base font-bold mb-1.5">
              Hỗ trợ đa kênh
            </h3>
            <p class="text-slate-500 text-sm leading-relaxed">
              Gửi qua website, hotline hoặc app. Luôn sẵn sàng.
            </p>
          </div>

          <div class="group p-6 rounded-2xl border border-slate-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div class="size-12 rounded-xl bg-gradient-to-br from-cyan-400 to-sky-500 flex items-center justify-center mb-4 shadow-lg shadow-cyan-400/30 group-hover:scale-110 transition-transform">
              <span
                class="material-symbols-outlined text-white"
                style="font-size: 24px"
              >workspace_premium</span>
            </div>
            <h3 class="text-slate-900 text-base font-bold mb-1.5">
              Bảo hành dịch vụ
            </h3>
            <p class="text-slate-500 text-sm leading-relaxed">
              Cam kết bảo hành sau sửa chữa. Hỗ trợ xử lý lại.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         FAQ — accordion
    ═══════════════════════════════════════════ -->
    <section class="bg-slate-50 py-20">
      <div class="max-w-3xl mx-auto px-6 lg:px-16">
        <div class="text-center mb-12">
          <span class="inline-flex items-center gap-2 bg-violet-100 text-violet-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
            <span
              class="material-symbols-outlined"
              style="font-size: 14px"
            >help</span>
            FAQ
          </span>
          <h2 class="text-slate-900 text-3xl lg:text-4xl font-black tracking-tight mb-3">
            Câu hỏi thường gặp
          </h2>
          <p class="text-slate-500 text-lg">
            Giải đáp thắc mắc phổ biến từ cư dân
          </p>
        </div>

        <div class="flex flex-col gap-3">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="rounded-2xl border overflow-hidden transition-all duration-200"
            :class="openFaqIndex === index
              ? 'bg-white border-indigo-200 shadow-md shadow-indigo-100/50'
              : 'bg-white border-slate-200 hover:border-slate-300'"
          >
            <button
              class="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer"
              @click="toggleFaq(index)"
            >
              <span class="text-slate-900 font-bold text-sm pr-4">{{ faq.question }}</span>
              <div
                class="size-7 rounded-full shrink-0 flex items-center justify-center transition-all duration-200"
                :class="openFaqIndex === index
                  ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white rotate-180'
                  : 'bg-slate-100 text-slate-400'"
              >
                <span
                  class="material-symbols-outlined"
                  style="font-size: 18px"
                >expand_more</span>
              </div>
            </button>
            <div
              v-if="openFaqIndex === index"
              class="px-6 pb-5"
            >
              <p class="text-slate-500 text-sm leading-relaxed">
                {{ faq.answer }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         MINI FOOTER
    ═══════════════════════════════════════════ -->
    <footer class="py-8 border-t border-slate-100">
      <div class="max-w-7xl mx-auto px-6 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2 text-slate-400 text-sm">
          <span
            class="material-symbols-outlined"
            style="font-size: 18px"
          >domain</span>
          <span class="font-semibold">Thần Nông</span>
          <span class="text-slate-300">&middot;</span>
          <span>&copy; {{ new Date().getFullYear() }}</span>
        </div>
        <div class="flex items-center gap-6">
          <NuxtLink
            to="/"
            class="text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >Trang chủ</NuxtLink>
          <NuxtLink
            to="/dich-vu"
            class="text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >Dịch vụ</NuxtLink>
          <NuxtLink
            to="/login"
            class="text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >Đăng nhập</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>
