<script setup lang="ts">
import 'leaflet/dist/leaflet.css'

definePageMeta({ layout: 'platform' })

const route = useRoute()
const id = computed(() => Number(route.params.id))

const { data, status, error } = usePlatformTicketDetail(id)
const ticket = computed(() => data.value?.data)
const pmc = computed(() => ticket.value?.pmc_processing)

// Leaflet (lazy load client-side)
const LMap = shallowRef<ReturnType<typeof defineComponent> | null>(null)
const LTileLayer = shallowRef<ReturnType<typeof defineComponent> | null>(null)
const LMarker = shallowRef<ReturnType<typeof defineComponent> | null>(null)

onMounted(async () => {
  const leaflet = await import('@vue-leaflet/vue-leaflet')
  LMap.value = leaflet.LMap
  LTileLayer.value = leaflet.LTileLayer
  LMarker.value = leaflet.LMarker
})

const hasLocation = computed(() => ticket.value?.latitude != null && ticket.value?.longitude != null)
const mapCenter = computed<[number, number]>(() =>
  hasLocation.value
    ? [Number(ticket.value!.latitude), Number(ticket.value!.longitude)]
    : [10.7769, 106.7009]
)

const imageAttachments = computed(() =>
  ticket.value?.attachments?.filter(a => a.mime_type.startsWith('image/')) ?? []
)
const docAttachments = computed(() =>
  ticket.value?.attachments?.filter(a => !a.mime_type.startsWith('image/')) ?? []
)

useSeoMeta({
  title: computed(() => ticket.value ? `${ticket.value.code} - Thần Nông` : 'Chi tiết yêu cầu')
})

function statusColor(value: string) {
  switch (value) {
    case 'pending': return 'warning'
    case 'received': return 'info'
    case 'in_progress': return 'primary'
    case 'completed': return 'success'
    case 'cancelled': return 'neutral'
    default: return 'neutral'
  }
}

function pmcStatusColor(value: string) {
  switch (value) {
    case 'received': return 'info'
    case 'assigned': return 'primary'
    case 'surveying': return 'primary'
    case 'quoted': return 'warning'
    case 'approved': return 'success'
    case 'rejected': return 'error'
    case 'ordered': return 'info'
    case 'in_progress': return 'primary'
    case 'completed': return 'success'
    case 'cancelled': return 'neutral'
    default: return 'neutral'
  }
}

function priorityColor(value: string) {
  switch (value) {
    case 'low': return 'neutral'
    case 'normal': return 'info'
    case 'high': return 'warning'
    case 'urgent': return 'error'
    default: return 'neutral'
  }
}

const isSlaOverdue = computed(() => {
  if (!pmc.value?.sla_due_at) return false
  return new Date(pmc.value.sla_due_at) < new Date()
})

const pmcWorkflowSteps = ['received', 'assigned', 'surveying', 'quoted', 'approved', 'ordered', 'in_progress', 'completed']

const currentStepIndex = computed(() => {
  if (!pmc.value) return -1
  return pmcWorkflowSteps.indexOf(pmc.value.status.value)
})
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex items-center gap-4">
      <UButton
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
        to="/platform/tickets"
      />
      <div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight">
          Chi tiết yêu cầu
        </h1>
        <p class="text-slate-500 text-sm mt-0.5">
          {{ ticket?.code ?? '...' }}
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="status === 'pending'"
      class="flex flex-col gap-4"
    >
      <div
        v-for="i in 4"
        :key="i"
        class="h-20 bg-slate-100 rounded-xl animate-pulse"
      />
    </div>

    <!-- Error -->
    <UAlert
      v-else-if="error"
      icon="i-lucide-alert-circle"
      color="error"
      variant="subtle"
      description="Không tìm thấy yêu cầu này."
    />

    <!-- Content -->
    <div
      v-else-if="ticket"
      class="flex flex-col gap-6"
    >
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main info -->
        <div class="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 class="font-bold text-slate-900">
              Thông tin yêu cầu
            </h2>
            <UBadge
              :color="statusColor(ticket.status.value)"
              variant="subtle"
              :label="ticket.status.label"
              size="md"
            />
          </div>
          <div class="px-6 py-5 flex flex-col gap-5">
            <SharedFieldDisplay label="Tiêu đề">
              <span class="font-medium">{{ ticket.subject }}</span>
            </SharedFieldDisplay>
            <SharedFieldDisplay
              v-if="ticket.description"
              label="Mô tả"
            >
              <p class="leading-relaxed whitespace-pre-wrap">
                {{ ticket.description }}
              </p>
            </SharedFieldDisplay>
            <div class="grid grid-cols-2 gap-4">
              <SharedFieldDisplay label="Kênh tiếp nhận">
                {{ ticket.channel.label }}
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Ngày gửi">
                {{ formatDateTime(ticket.created_at) }}
              </SharedFieldDisplay>
            </div>
            <div
              v-if="ticket.claimed_at"
              class="grid grid-cols-2 gap-4"
            >
              <SharedFieldDisplay label="Ngày tiếp nhận">
                {{ formatDateTime(ticket.claimed_at) }}
              </SharedFieldDisplay>
            </div>
          </div>
        </div>

        <!-- Sidebar info -->
        <div class="flex flex-col gap-4">
          <!-- Requester -->
          <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div class="px-5 py-4 border-b border-slate-100">
              <h3 class="font-bold text-slate-900 text-sm">
                Người gửi
              </h3>
            </div>
            <div class="px-5 py-4 flex flex-col gap-3">
              <SharedFieldDisplay label="Họ tên">
                <span class="font-medium">{{ ticket.requester_name }}</span>
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Số điện thoại">
                {{ ticket.requester_phone }}
              </SharedFieldDisplay>
              <SharedFieldDisplay
                v-if="ticket.apartment_name"
                label="Căn hộ"
              >
                {{ ticket.apartment_name }}
              </SharedFieldDisplay>
            </div>
          </div>

          <!-- Ticket meta -->
          <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div class="px-5 py-4 border-b border-slate-100">
              <h3 class="font-bold text-slate-900 text-sm">
                Thông tin mã
              </h3>
            </div>
            <div class="px-5 py-4 flex flex-col gap-3">
              <SharedFieldDisplay label="Mã yêu cầu">
                <span class="font-mono font-bold">{{ ticket.code }}</span>
              </SharedFieldDisplay>
              <SharedFieldDisplay
                v-if="ticket.project_id"
                label="Dự án"
              >
                #{{ ticket.project_id }}
              </SharedFieldDisplay>
            </div>
          </div>
        </div>
      </div>

      <!-- Address & Map -->
      <div
        v-if="ticket.address || hasLocation"
        class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
      >
        <div class="px-6 py-4 border-b border-slate-100">
          <h2 class="font-bold text-slate-900">
            Vị trí
          </h2>
        </div>
        <div class="px-6 py-5 flex flex-col gap-4">
          <SharedFieldDisplay
            v-if="ticket.address"
            label="Địa chỉ"
          >
            {{ ticket.address }}
          </SharedFieldDisplay>
          <ClientOnly v-if="hasLocation">
            <div
              v-if="LMap && LTileLayer && LMarker"
              class="rounded-xl border border-slate-200 overflow-hidden h-[300px]"
            >
              <component
                :is="LMap"
                :center="mapCenter"
                :zoom="15"
                :use-global-leaflet="false"
                style="width: 100%; height: 100%"
              >
                <component
                  :is="LTileLayer"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  :attribution="'&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a>'"
                />
                <component
                  :is="LMarker"
                  :lat-lng="mapCenter"
                />
              </component>
            </div>
            <template #fallback>
              <div class="rounded-xl border border-slate-200 bg-slate-50 h-[300px] flex items-center justify-center">
                <span
                  class="material-symbols-outlined text-slate-300 animate-spin"
                  style="font-size: 24px"
                >progress_activity</span>
              </div>
            </template>
          </ClientOnly>
        </div>
      </div>

      <!-- Attachments -->
      <div
        v-if="ticket.attachments && ticket.attachments.length > 0"
        class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
      >
        <div class="px-6 py-4 border-b border-slate-100">
          <h2 class="font-bold text-slate-900">
            Tệp đính kèm
            <span class="text-slate-400 font-normal text-sm ml-1">({{ ticket.attachments.length }})</span>
          </h2>
        </div>
        <div class="px-6 py-5 flex flex-col gap-5">
          <!-- Images grid -->
          <div v-if="imageAttachments.length > 0">
            <p class="text-xs font-medium text-slate-500 mb-3">
              Hình ảnh
            </p>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              <a
                v-for="img in imageAttachments"
                :key="img.id"
                :href="img.url ?? '#'"
                target="_blank"
                class="group relative rounded-xl border border-slate-200 overflow-hidden aspect-square bg-slate-50 hover:shadow-md transition-shadow"
              >
                <img
                  :src="img.url ?? ''"
                  :alt="img.original_name"
                  class="w-full h-full object-cover"
                >
                <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p class="text-white text-[10px] truncate">{{ img.original_name }}</p>
                </div>
              </a>
            </div>
          </div>

          <!-- Documents list -->
          <div v-if="docAttachments.length > 0">
            <p class="text-xs font-medium text-slate-500 mb-3">
              Tài liệu
            </p>
            <div class="flex flex-col gap-2">
              <a
                v-for="doc in docAttachments"
                :key="doc.id"
                :href="doc.url ?? '#'"
                target="_blank"
                class="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 hover:bg-slate-50 transition-colors"
              >
                <div class="size-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <span
                    class="material-symbols-outlined text-amber-600"
                    style="font-size: 18px"
                  >description</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-slate-700 truncate">{{ doc.original_name }}</p>
                  <p class="text-xs text-slate-400">{{ formatFileSize(doc.size_bytes) }}</p>
                </div>
                <span
                  class="material-symbols-outlined text-slate-400"
                  style="font-size: 18px"
                >download</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- PMC Processing Sections -->
      <template v-if="pmc">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Section 1: Trạng thái PMC -->
          <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div class="px-5 py-4 border-b border-slate-100">
              <h3 class="font-bold text-slate-900 text-sm">
                Trạng thái xử lý PMC
              </h3>
            </div>
            <div class="px-5 py-4 flex flex-col gap-3">
              <SharedFieldDisplay label="Trạng thái xử lý">
                <UBadge
                  :color="pmcStatusColor(pmc.status.value)"
                  variant="subtle"
                  :label="pmc.status.label"
                  size="sm"
                />
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Mức ưu tiên">
                <UBadge
                  :color="priorityColor(pmc.priority.value)"
                  variant="subtle"
                  :label="pmc.priority.label"
                  size="sm"
                />
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Người tiếp nhận">
                <span
                  v-if="pmc.received_by"
                  class="font-medium"
                >{{ pmc.received_by.name }}</span>
                <span
                  v-else
                  class="text-slate-400"
                >Chưa có</span>
              </SharedFieldDisplay>
              <SharedFieldDisplay
                v-if="pmc.received_at"
                label="Thời điểm tiếp nhận"
              >
                {{ formatDateTime(pmc.received_at) }}
              </SharedFieldDisplay>
            </div>
          </div>

          <!-- Section 2: Phân công & SLA -->
          <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div class="px-5 py-4 border-b border-slate-100">
              <h3 class="font-bold text-slate-900 text-sm">
                Phân công & SLA
              </h3>
            </div>
            <div class="px-5 py-4 flex flex-col gap-3">
              <SharedFieldDisplay label="Nhân viên phụ trách">
                <template v-if="pmc.assignees?.length">
                  <div class="flex flex-col gap-1">
                    <span
                      v-for="a in pmc.assignees"
                      :key="a.id"
                      class="font-medium"
                    >{{ a.name }}</span>
                  </div>
                </template>
                <span
                  v-else
                  class="text-slate-400"
                >Chưa phân công</span>
              </SharedFieldDisplay>
              <SharedFieldDisplay label="Hạn SLA">
                <template v-if="pmc.sla_due_at">
                  <span :class="isSlaOverdue ? 'text-red-600 font-semibold' : ''">
                    {{ formatDateTime(pmc.sla_due_at) }}
                  </span>
                  <UBadge
                    v-if="isSlaOverdue"
                    color="error"
                    variant="subtle"
                    label="Quá hạn"
                    size="xs"
                    class="ml-2"
                  />
                </template>
                <span
                  v-else
                  class="text-slate-400"
                >Chưa thiết lập</span>
              </SharedFieldDisplay>
            </div>
          </div>

          <!-- Section 3: Tiến trình xử lý -->
          <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div class="px-5 py-4 border-b border-slate-100">
              <h3 class="font-bold text-slate-900 text-sm">
                Tiến trình xử lý
              </h3>
            </div>
            <div class="px-5 py-4">
              <div class="flex flex-col gap-1.5">
                <div
                  v-for="(step, index) in pmcWorkflowSteps"
                  :key="step"
                  class="flex items-center gap-3"
                >
                  <div
                    class="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                    :class="index <= currentStepIndex
                      ? 'bg-primary-500 text-white'
                      : 'bg-slate-100 text-slate-400'"
                  >
                    <UIcon
                      v-if="index < currentStepIndex"
                      name="i-lucide-check"
                      class="w-3 h-3"
                    />
                    <span v-else>{{ index + 1 }}</span>
                  </div>
                  <span
                    class="text-sm"
                    :class="index <= currentStepIndex
                      ? 'text-slate-900 font-medium'
                      : 'text-slate-400'"
                  >
                    {{ {
                      received: 'Đã tiếp nhận',
                      assigned: 'Đã phân công',
                      surveying: 'Đang khảo sát',
                      quoted: 'Đã báo giá',
                      approved: 'Đã chấp thuận',
                      ordered: 'Đã lên đơn',
                      in_progress: 'Đang thực hiện',
                      completed: 'Hoàn thành'
                    }[step] }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- No PMC processing -->
      <UAlert
        v-else-if="ticket.status.value === 'pending'"
        icon="i-lucide-clock"
        color="warning"
        variant="subtle"
        description="Yêu cầu đang chờ được tiếp nhận bởi đơn vị quản lý."
      />

      <!-- Rating cư dân -->
      <SharedSectionCard title="Rating cư dân">
        <SharedTicketRatingDisplay
          :rating="ticket.resident_rating ?? null"
          :comment="ticket.resident_rating_comment ?? null"
          :rated-at="ticket.resident_rated_at ?? null"
        />
      </SharedSectionCard>
    </div>
  </div>
</template>
