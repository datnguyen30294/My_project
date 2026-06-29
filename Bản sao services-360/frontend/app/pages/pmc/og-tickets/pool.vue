<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { PoolTicket, PoolFilters } from '~/composables/api/useOgTickets'
import type { BadgeColor } from '~/utils/badge'
import 'leaflet/dist/leaflet.css'

definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'Ticket Pool - Thần Nông' })

const params = reactive<PoolFilters>({ per_page: DEFAULT_PER_PAGE })
const page = ref(1)

const { searchInput, onSearch } = useTableSearch((value) => {
  params.search = value || undefined
  page.value = 1
})

const hasFilters = computed(() => !!searchInput.value)

function clearFilters() {
  searchInput.value = ''
  params.search = undefined
  page.value = 1
}

const { data, status, error, refresh } = usePoolTicketList(
  computed(() => ({ ...params, page: page.value }))
)

const tickets = computed<PoolTicket[]>(() => data.value?.data ?? [])

const columns: TableColumn<PoolTicket>[] = [
  { id: 'actions', header: 'Tiếp nhận' },
  { id: 'code', header: 'Mã' },
  { id: 'content', header: 'Nội dung' },
  { id: 'requester', header: 'Cư dân' },
  { id: 'meta', header: 'Phân loại' },
  { id: 'time', header: 'Thời gian' }
]

// Track expanded descriptions per ticket id
const expandedDescs = ref<Set<number>>(new Set())

const STATUS_COLOR: Record<string, BadgeColor> = {
  pending: 'warning',
  received: 'info',
  in_progress: 'primary',
  completed: 'success',
  cancelled: 'neutral'
}

function getStatusColor(value: string): BadgeColor {
  return STATUS_COLOR[value] ?? 'neutral'
}

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

// Detail slideover
const detailTarget = ref<PoolTicket | null>(null)
const showDetail = ref(false)

const detailHasLocation = computed(() =>
  detailTarget.value?.latitude != null && detailTarget.value?.longitude != null
)
const detailMapCenter = computed<[number, number]>(() =>
  detailHasLocation.value
    ? [Number(detailTarget.value!.latitude), Number(detailTarget.value!.longitude)]
    : [10.7769, 106.7009]
)
const detailImages = computed(() =>
  detailTarget.value?.attachments?.filter(a => a.mime_type.startsWith('image/')) ?? []
)
const detailDocs = computed(() =>
  detailTarget.value?.attachments?.filter(a => !a.mime_type.startsWith('image/')) ?? []
)

function openDetail(ticket: PoolTicket) {
  detailTarget.value = ticket
  showDetail.value = true
}

// Claim
const claimTarget = ref<PoolTicket | null>(null)
const showClaimDialog = ref(false)
const isClaiming = ref(false)
const toast = useToast()
const router = useRouter()

function openClaimDialog(ticket: PoolTicket) {
  claimTarget.value = ticket
  showClaimDialog.value = true
}

function claimFromDetail() {
  if (!detailTarget.value) return
  showDetail.value = false
  openClaimDialog(detailTarget.value)
}

async function handleClaim() {
  if (!claimTarget.value) return
  isClaiming.value = true
  try {
    const result = await apiClaimTicket({ ticket_id: claimTarget.value.id })
    showClaimDialog.value = false
    toast.add({ title: 'Nhận ticket thành công', color: 'success' })
    router.push(`/pmc/og-tickets/${result.data.id}`)
  } catch (err) {
    const msg = getApiErrorMessage(err, 'Không thể nhận ticket. Vui lòng thử lại.')
    toast.add({ title: 'Lỗi', description: msg, color: 'error' })
  } finally {
    isClaiming.value = false
  }
}
</script>

<template>
  <div>
    <SharedCrudPageHeader
      title="Ticket Pool"
      description="Danh sách ticket chờ tiếp nhận từ cư dân"
    >
      <template #actions>
        <UButton
          icon="i-lucide-list"
          label="Danh sách OG Ticket"
          color="neutral"
          variant="ghost"
          to="/pmc/og-tickets"
        />
      </template>
    </SharedCrudPageHeader>

    <!-- Toolbar -->
    <div class="mb-5 flex items-center gap-3">
      <UInput
        v-model="searchInput"
        icon="i-lucide-search"
        placeholder="Tìm theo tiêu đề, tên, SĐT..."
        class="max-w-xs"
        @update:model-value="onSearch"
      />
      <UButton
        v-if="hasFilters"
        icon="i-lucide-x"
        label="Xóa bộ lọc"
        color="neutral"
        variant="ghost"
        size="sm"
        @click="clearFilters"
      />
      <div class="flex-1" />
      <span
        v-if="data?.meta"
        class="text-xs text-slate-400 tabular-nums"
      >
        {{ data.meta.total }} ticket
      </span>
      <UButton
        icon="i-lucide-refresh-cw"
        color="neutral"
        variant="ghost"
        size="sm"
        :loading="status === 'pending'"
        @click="refresh()"
      />
    </div>

    <SharedCrudTableWrapper
      :status="status"
      :error="error"
      :data="data"
      :refresh="refresh"
    >
      <div class="bg-white border border-border-gray rounded-xl overflow-hidden shadow-sm">
        <UTable
          :data="tickets"
          :columns="columns"
        >
          <!-- Code -->
          <template #code-cell="{ row }">
            <button
              class="inline-flex items-center gap-1.5 w-fit group cursor-pointer"
              @click="openDetail(row.original)"
            >
              <span class="font-mono text-xs font-bold tracking-wide bg-slate-100 text-slate-600 px-2 py-0.5 rounded group-hover:bg-slate-800 group-hover:text-white transition-colors">
                {{ row.original.code }}
              </span>
              <UIcon
                name="i-lucide-arrow-up-right"
                class="size-3 text-slate-300 group-hover:text-slate-600 transition-colors"
              />
            </button>
          </template>

          <!-- Content: subject + description -->
          <template #content-cell="{ row }">
            <div class="flex flex-col gap-1 min-w-0 max-w-sm">
              <p class="text-sm text-slate-800 font-semibold leading-snug line-clamp-1">
                {{ row.original.subject }}
              </p>
              <template v-if="row.original.description">
                <p
                  class="text-xs text-slate-500 leading-relaxed whitespace-pre-line"
                  :class="expandedDescs.has(row.original.id) ? '' : 'line-clamp-2'"
                >
                  {{ row.original.description }}
                </p>
                <button
                  v-if="row.original.description.length > 80"
                  class="text-xs text-slate-400 hover:text-slate-700 cursor-pointer w-fit transition-colors"
                  @click="expandedDescs.has(row.original.id) ? expandedDescs.delete(row.original.id) : expandedDescs.add(row.original.id)"
                >
                  {{ expandedDescs.has(row.original.id) ? 'Thu gọn' : 'Xem thêm' }}
                </button>
              </template>
              <span
                v-else
                class="text-xs text-slate-300 italic"
              >Không có mô tả</span>
            </div>
          </template>

          <!-- Requester: name + phone + apartment + address -->
          <template #requester-cell="{ row }">
            <div class="flex flex-col gap-0.5 min-w-0">
              <span class="text-sm font-medium text-slate-800 truncate">
                {{ row.original.requester_name }}
              </span>
              <div class="flex items-center gap-1.5 text-xs text-slate-400">
                <UIcon
                  name="i-lucide-phone"
                  class="size-3 shrink-0"
                />
                <span>{{ row.original.requester_phone }}</span>
                <template v-if="row.original.apartment_name">
                  <span class="text-slate-200">|</span>
                  <UIcon
                    name="i-lucide-building-2"
                    class="size-3 shrink-0"
                  />
                  <span class="truncate">{{ row.original.apartment_name }}</span>
                </template>
              </div>
              <div
                v-if="row.original.address"
                class="flex items-center gap-1.5 text-xs text-slate-400"
              >
                <UIcon
                  name="i-lucide-map-pin"
                  class="size-3 shrink-0"
                />
                <span
                  class="truncate max-w-[200px]"
                  :title="row.original.address"
                >{{ row.original.address }}</span>
              </div>
            </div>
          </template>

          <!-- Meta: status + channel -->
          <template #meta-cell="{ row }">
            <div class="flex flex-col gap-1.5">
              <UBadge
                :label="row.original.status.label"
                :color="getStatusColor(row.original.status.value)"
                variant="subtle"
                size="sm"
              />
              <span class="text-xs text-slate-400">
                {{ row.original.channel.label }}
              </span>
            </div>
          </template>

          <!-- Time -->
          <template #time-cell="{ row }">
            <div class="flex flex-col gap-0.5">
              <span class="text-sm text-slate-700 tabular-nums">
                {{ formatDate(row.original.created_at) }}
              </span>
              <span class="text-xs text-slate-400 tabular-nums">
                {{ formatTime(row.original.created_at) }}
              </span>
            </div>
          </template>

          <!-- Actions -->
          <template #actions-cell="{ row }">
            <UButton
              label="Nhận"
              icon="i-lucide-hand"
              size="sm"
              :color="row.original.status.value === 'pending' ? 'primary' : 'neutral'"
              :variant="row.original.status.value === 'pending' ? 'solid' : 'soft'"
              :disabled="row.original.status.value !== 'pending'"
              @click="openClaimDialog(row.original)"
            />
          </template>
        </UTable>

        <SharedCrudTablePagination
          v-model:page="page"
          :meta="data?.meta"
        />
      </div>
    </SharedCrudTableWrapper>

    <!-- Detail Slideover -->
    <USlideover
      v-model:open="showDetail"
      side="right"
      :ui="{ content: 'max-w-md' }"
    >
      <template #header>
        <div
          v-if="detailTarget"
          class="flex items-center justify-between w-full"
        >
          <div class="flex items-center gap-3">
            <span class="font-mono text-sm font-bold tracking-wide bg-slate-100 text-slate-600 px-2.5 py-1 rounded">
              {{ detailTarget.code }}
            </span>
            <UBadge
              :label="detailTarget.status.label"
              :color="getStatusColor(detailTarget.status.value)"
              variant="subtle"
              size="sm"
            />
          </div>
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            size="sm"
            @click="showDetail = false"
          />
        </div>
      </template>

      <template #body>
        <div
          v-if="detailTarget"
          class="space-y-6"
        >
          <!-- Subject -->
          <div>
            <h3 class="text-lg font-bold text-slate-900 leading-snug">
              {{ detailTarget.subject }}
            </h3>
            <p class="text-xs text-slate-400 mt-1">
              {{ timeAgo(detailTarget.created_at) }}
            </p>
          </div>

          <!-- Description -->
          <div class="bg-slate-50 rounded-lg p-4 border border-slate-100">
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Mô tả từ cư dân
            </p>
            <p
              v-if="detailTarget.description"
              class="text-sm text-slate-700 leading-relaxed whitespace-pre-line"
            >
              {{ detailTarget.description }}
            </p>
            <p
              v-else
              class="text-sm text-slate-400 italic"
            >
              Không có mô tả
            </p>
          </div>

          <!-- Info grid -->
          <div class="grid grid-cols-2 gap-x-6 gap-y-4">
            <SharedFieldDisplay label="Người gửi">
              <span class="font-medium">{{ detailTarget.requester_name }}</span>
            </SharedFieldDisplay>

            <SharedFieldDisplay label="Số điện thoại">
              {{ detailTarget.requester_phone }}
            </SharedFieldDisplay>

            <SharedFieldDisplay label="Căn hộ">
              {{ detailTarget.apartment_name ?? '—' }}
            </SharedFieldDisplay>

            <SharedFieldDisplay label="Kênh tiếp nhận">
              <UBadge
                :label="detailTarget.channel.label"
                color="neutral"
                variant="subtle"
                size="sm"
              />
            </SharedFieldDisplay>

            <SharedFieldDisplay label="Ngày gửi">
              <span class="tabular-nums">{{ formatDate(detailTarget.created_at) }}</span>
              <span class="text-slate-400 ml-1 tabular-nums">{{ formatTime(detailTarget.created_at) }}</span>
            </SharedFieldDisplay>
          </div>

          <!-- Address & Map -->
          <div v-if="detailTarget.address || detailHasLocation">
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Vị trí
            </p>
            <div class="bg-slate-50 rounded-lg p-4 border border-slate-100 space-y-3">
              <p
                v-if="detailTarget.address"
                class="text-sm text-slate-700"
              >
                {{ detailTarget.address }}
              </p>
              <ClientOnly v-if="detailHasLocation">
                <div
                  v-if="LMap && LTileLayer && LMarker"
                  class="rounded-lg border border-slate-200 overflow-hidden h-[200px]"
                >
                  <component
                    :is="LMap"
                    :center="detailMapCenter"
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
                      :lat-lng="detailMapCenter"
                    />
                  </component>
                </div>
              </ClientOnly>
            </div>
          </div>

          <!-- Attachments -->
          <div v-if="detailTarget.attachments && detailTarget.attachments.length > 0">
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Tệp đính kèm ({{ detailTarget.attachments.length }})
            </p>

            <!-- Images -->
            <div
              v-if="detailImages.length > 0"
              class="grid grid-cols-3 gap-2 mb-3"
            >
              <a
                v-for="img in detailImages"
                :key="img.id"
                :href="img.url ?? '#'"
                target="_blank"
                class="group relative rounded-lg border border-slate-200 overflow-hidden aspect-square bg-slate-50 hover:shadow-md transition-shadow"
              >
                <img
                  :src="img.url ?? ''"
                  :alt="img.original_name"
                  class="w-full h-full object-cover"
                >
                <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p class="text-white text-[9px] truncate">{{ img.original_name }}</p>
                </div>
              </a>
            </div>

            <!-- Documents -->
            <div
              v-if="detailDocs.length > 0"
              class="flex flex-col gap-2"
            >
              <a
                v-for="doc in detailDocs"
                :key="doc.id"
                :href="doc.url ?? '#'"
                target="_blank"
                class="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 hover:bg-slate-50 transition-colors"
              >
                <div class="size-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <span
                    class="material-symbols-outlined text-amber-600"
                    style="font-size: 16px"
                  >description</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-medium text-slate-700 truncate">{{ doc.original_name }}</p>
                  <p class="text-[10px] text-slate-400">{{ formatFileSize(doc.size_bytes) }}</p>
                </div>
                <span
                  class="material-symbols-outlined text-slate-400"
                  style="font-size: 16px"
                >download</span>
              </a>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton
            label="Đóng"
            color="neutral"
            variant="ghost"
            @click="showDetail = false"
          />
          <UButton
            v-if="detailTarget?.status.value === 'pending'"
            label="Nhận ticket này"
            icon="i-lucide-hand"
            color="primary"
            @click="claimFromDetail"
          />
        </div>
      </template>
    </USlideover>

    <!-- Claim Confirm Dialog -->
    <UModal
      v-model:open="showClaimDialog"
      title="Xác nhận nhận ticket"
    >
      <template #body>
        <div
          v-if="claimTarget"
          class="space-y-3"
        >
          <p class="text-slate-700">
            Bạn muốn nhận ticket này?
          </p>
          <div class="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-mono text-xs font-bold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                {{ claimTarget.code }}
              </span>
            </div>
            <p class="text-sm font-medium text-slate-800">
              {{ claimTarget.subject }}
            </p>
          </div>
          <p class="text-xs text-slate-400">
            Ticket sẽ được gán cho tổ chức của bạn và chuyển sang trạng thái tiếp nhận.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton
            label="Hủy"
            color="neutral"
            variant="ghost"
            @click="showClaimDialog = false"
          />
          <UButton
            label="Xác nhận"
            icon="i-lucide-check"
            color="primary"
            :loading="isClaiming"
            @click="handleClaim"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
