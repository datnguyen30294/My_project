<script setup lang="ts">
import type { OgTicketDetail, UpdateOgTicketPayload } from '~/composables/api/useOgTickets'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

definePageMeta({ layout: 'default' })

const route = useRoute()
const id = computed(() => Number(route.params.id))

const { data, status, error, refresh } = useOgTicketDetail(id)
const ogTicket = computed<OgTicketDetail | undefined>(() => data.value?.data)

useSeoMeta({
  title: computed(() =>
    ogTicket.value ? `Chỉnh sửa: ${ogTicket.value.subject} - Thần Nông` : 'Chỉnh sửa OG Ticket'
  )
})

// ─── Redirect if cancelled ───
watch(ogTicket, (ticket) => {
  if (ticket?.status.value === 'cancelled') {
    navigateTo(`/pmc/og-tickets/${id.value}`)
  }
}, { immediate: true })

// ─── Form state ───
const form = reactive<Omit<UpdateOgTicketPayload, 'status'>>({
  priority: 'normal' as UpdateOgTicketPayload['priority'],
  received_by_id: null,
  assigned_to_ids: [] as number[],
  sla_quote_due_at: null,
  sla_completion_due_at: null,
  internal_note: null,
  subject: '',
  description: null,
  address: null,
  latitude: null,
  longitude: null,
  apartment_name: null,
  project_id: null
})

function syncFormFromTicket() {
  const ticket = ogTicket.value
  if (!ticket) return
  form.priority = ticket.priority.value as UpdateOgTicketPayload['priority']
  form.received_by_id = ticket.received_by?.id ?? null
  form.assigned_to_ids = (ticket.assignees ?? []).map(a => a.id)
  form.sla_quote_due_at = utcToLocal(ticket.sla_quote_due_at)
  form.sla_completion_due_at = utcToLocal(ticket.sla_completion_due_at)
  form.internal_note = ticket.internal_note
  form.subject = ticket.subject
  form.description = ticket.description ?? null
  form.address = ticket.address ?? null
  form.latitude = ticket.latitude != null ? Number(ticket.latitude) : null
  form.longitude = ticket.longitude != null ? Number(ticket.longitude) : null
  form.apartment_name = ticket.apartment_name ?? null
  form.project_id = ticket.project?.id ?? null
  newFiles.value = []
  deleteFileIds.value = []
}

// ─── File management ───
const newFiles = ref<File[]>([])
const deleteFileIds = ref<number[]>([])
const fileInputRef = ref<HTMLInputElement | null>(null)

watch(ogTicket, () => syncFormFromTicket(), { immediate: true })

const existingOgAttachments = computed(() =>
  (ogTicket.value?.attachments ?? []).filter(a => !deleteFileIds.value.includes(a.id))
)

// ─── Categories modal ───
const categoriesModalOpen = ref(false)
const selectedCategoryIds = computed(() => (ogTicket.value?.categories ?? []).map(c => c.id))
function openCategoriesModal() {
  categoriesModalOpen.value = true
}
async function handleCategoriesSaved() {
  await refresh()
}
const totalFileCount = computed(() => existingOgAttachments.value.length + newFiles.value.length)

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files) return
  for (const file of Array.from(input.files)) {
    if (totalFileCount.value >= ATTACHMENT_MAX_FILES) break
    if (file.size > ATTACHMENT_MAX_FILE_SIZE || !ATTACHMENT_ALLOWED_TYPES.includes(file.type)) continue
    newFiles.value.push(file)
  }
  input.value = ''
}

function removeNewFile(index: number) {
  newFiles.value.splice(index, 1)
}

function markDeleteExisting(fileId: number) {
  deleteFileIds.value.push(fileId)
}

function undoDeleteExisting(fileId: number) {
  deleteFileIds.value = deleteFileIds.value.filter(i => i !== fileId)
}

// ─── Options ───
const priorityOptions = OG_TICKET_PRIORITY_OPTIONS

const isCompleted = computed(() => ogTicket.value?.status.value === 'completed')

// ─── SLA computed ───
const isSlaQuoteViolated = computed(() => {
  if (!ogTicket.value?.sla_quote_due_at) return false
  if (isCompleted.value) return false
  return new Date(ogTicket.value.sla_quote_due_at) < new Date()
})

const isSlaCompletionViolated = computed(() => {
  if (!ogTicket.value?.sla_completion_due_at) return false
  if (isCompleted.value) return false
  return new Date(ogTicket.value.sla_completion_due_at) < new Date()
})

// ─── Account options (project members first) ───
const { data: accountsData } = useAccountList(computed(() => ({ per_page: SELECT_ALL_PER_PAGE })))

const projectId = computed(() => form.project_id)
const projectMemberIds = ref<Set<number>>(new Set())

watch(projectId, async (id) => {
  if (!id) {
    projectMemberIds.value = new Set()
    return
  }
  try {
    const res = await apiGetProject(id)
    projectMemberIds.value = new Set((res.data.accounts ?? []).map((a: { id: number }) => a.id))
  } catch {
    projectMemberIds.value = new Set()
  }
}, { immediate: true })

const accountOptions = computed(() => {
  const all = (accountsData.value?.data ?? []).map(acc => ({
    label: acc.name,
    value: acc.id
  }))
  if (!projectMemberIds.value.size) return all

  const members = all.filter(a => projectMemberIds.value.has(a.value))
  const others = all.filter(a => !projectMemberIds.value.has(a.value))

  if (!members.length) return all
  return [
    ...members.map(m => ({ ...m, label: `${m.label} (Thuộc dự án)` })),
    ...others
  ]
})

// ─── Save ───
const crud = useCrudModals<OgTicketDetail>()
const { isSubmitting: isSaving, submitForm } = useCrudSubmit(crud, refresh)

async function handleSave() {
  crud.formMode.value = 'edit'
  crud.editTarget.value = ogTicket.value ?? null
  const payload: UpdateOgTicketPayload = {
    ...form,
    assigned_to_ids: form.assigned_to_ids,
    sla_quote_due_at: localToUtc(form.sla_quote_due_at ?? null),
    sla_completion_due_at: localToUtc(form.sla_completion_due_at ?? null),
    attachments: newFiles.value.length > 0 ? newFiles.value : undefined,
    delete_attachment_ids: deleteFileIds.value.length > 0 ? deleteFileIds.value : undefined
  }
  await submitForm(
    null,
    () => apiUpdateOgTicket(id.value, payload),
    { update: 'Cập nhật thành công' }
  )
  navigateTo(`/pmc/og-tickets/${id.value}`)
}

function handleCancel() {
  navigateTo(`/pmc/og-tickets/${id.value}`)
}
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
          :to="`/pmc/og-tickets/${id}`"
        />
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">
            Chỉnh sửa OG Ticket
          </h1>
          <p class="text-slate-500 text-sm mt-0.5">
            {{ ogTicket?.subject ?? '...' }}
          </p>
        </div>
      </div>

      <div
        v-if="ogTicket"
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
      v-else-if="ogTicket"
      class="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      <!-- LEFT: Forms -->
      <div class="lg:col-span-2 flex flex-col gap-6">
        <!-- ─── Thông tin ticket ─── -->
        <SharedSectionCard title="Thông tin ticket">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p class="text-xs font-medium text-slate-500 mb-1.5">
                Tiêu đề
              </p>
              <UInput
                v-model="form.subject"
                class="w-full"
              />
            </div>
            <div>
              <p class="text-xs font-medium text-slate-500 mb-1.5">
                Kênh tiếp nhận
              </p>
              <div class="flex items-center h-9">
                <UBadge
                  :label="ogTicket.channel?.label"
                  color="neutral"
                  variant="subtle"
                  size="sm"
                />
              </div>
            </div>
            <div class="sm:col-span-2">
              <p class="text-xs font-medium text-slate-500 mb-1.5">
                Mô tả
              </p>
              <UTextarea
                v-model="form.description"
                :rows="3"
                class="w-full"
                placeholder="Mô tả chi tiết..."
              />
            </div>
            <div>
              <p class="text-xs font-medium text-slate-500 mb-1.5 flex items-center gap-1.5">
                <span>Khách hàng</span>
                <UIcon
                  name="i-lucide-lock"
                  class="size-3 text-slate-400"
                  title="Sửa ở trang khách hàng"
                />
              </p>
              <UInput
                :model-value="ogTicket?.customer?.full_name ?? ogTicket?.requester_name ?? ''"
                class="w-full"
                readonly
                disabled
              />
            </div>
            <div>
              <p class="text-xs font-medium text-slate-500 mb-1.5 flex items-center gap-1.5">
                <span>Số điện thoại</span>
                <UIcon
                  name="i-lucide-lock"
                  class="size-3 text-slate-400"
                  title="Sửa ở trang khách hàng"
                />
              </p>
              <UInput
                :model-value="formatPhone(ogTicket?.customer?.phone ?? ogTicket?.requester_phone)"
                class="w-full"
                readonly
                disabled
              />
            </div>
            <div
              v-if="ogTicket?.customer"
              class="sm:col-span-2 -mt-2"
            >
              <UAlert
                color="info"
                variant="subtle"
                icon="i-lucide-info"
              >
                <template #description>
                  <span>Thông tin khách hiển thị theo hồ sơ hiện tại (live). Snapshot lúc tạo ticket: </span>
                  <span class="font-medium">{{ ogTicket.requester_name }}</span>
                  <span> — </span>
                  <span class="font-mono">{{ formatPhone(ogTicket.requester_phone) }}</span>
                  <span>. Muốn cập nhật khách, sửa ở </span>
                  <NuxtLink
                    :to="`/pmc/customers/${ogTicket.customer.id}`"
                    class="font-medium text-primary-700 hover:underline inline-flex items-center gap-1"
                  >
                    trang khách hàng {{ ogTicket.customer.code ?? ogTicket.customer.full_name }}
                    <UIcon
                      name="i-lucide-external-link"
                      class="size-3.5"
                    />
                  </NuxtLink>
                  <span>.</span>
                </template>
              </UAlert>
            </div>
            <div>
              <p class="text-xs font-medium text-slate-500 mb-1.5">
                Căn hộ
              </p>
              <UInput
                v-model="form.apartment_name"
                class="w-full"
                placeholder="—"
              />
            </div>
            <div>
              <p class="text-xs font-medium text-slate-500 mb-1.5">
                Dự án
              </p>
              <SharedProjectSelect v-model="form.project_id" />
            </div>
            <div class="sm:col-span-2">
              <p class="text-xs font-medium text-slate-500 mb-1.5">
                Danh mục
              </p>
              <div class="flex items-center flex-wrap gap-1.5 min-h-[36px]">
                <UBadge
                  v-for="cat in ogTicket?.categories ?? []"
                  :key="cat.id"
                  :label="cat.name"
                  color="primary"
                  variant="subtle"
                  size="sm"
                />
                <span
                  v-if="!ogTicket?.categories || ogTicket.categories.length === 0"
                  class="text-slate-400 text-sm"
                >—</span>
                <UButton
                  icon="i-lucide-pencil"
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  class="ml-1"
                  @click="openCategoriesModal"
                >
                  Chỉnh sửa
                </UButton>
              </div>
            </div>
          </div>

          <!-- Địa chỉ -->
          <div class="border-t border-slate-100 pt-5 mt-5">
            <SharedAddressMapPicker
              :model-value="form.address ?? ''"
              :latitude="form.latitude ?? null"
              :longitude="form.longitude ?? null"
              @update:model-value="form.address = $event"
              @update:latitude="form.latitude = $event"
              @update:longitude="form.longitude = $event"
            />
          </div>

          <!-- Tệp đính kèm OG -->
          <div class="border-t border-slate-100 pt-5 mt-5">
            <div class="flex items-center gap-2 mb-3">
              <UIcon
                name="i-lucide-paperclip"
                class="size-4 text-slate-400"
              />
              <span class="text-sm font-semibold text-slate-700">Tệp đính kèm OG</span>
              <span class="text-xs text-slate-400">({{ totalFileCount }})</span>
            </div>

            <!-- Existing OG attachments -->
            <div
              v-if="existingOgAttachments.length > 0"
              class="flex flex-col gap-2 mb-3"
            >
              <div
                v-for="att in existingOgAttachments"
                :key="att.id"
                class="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2"
              >
                <div
                  class="size-8 rounded-lg flex items-center justify-center shrink-0"
                  :class="isImageMime(att.mime_type) ? 'bg-violet-100' : 'bg-amber-100'"
                >
                  <UIcon
                    :name="isImageMime(att.mime_type) ? 'i-lucide-image' : 'i-lucide-file-text'"
                    class="size-4"
                    :class="isImageMime(att.mime_type) ? 'text-violet-500' : 'text-amber-600'"
                  />
                </div>
                <a
                  :href="att.url"
                  target="_blank"
                  class="flex-1 min-w-0 hover:underline"
                >
                  <p class="text-xs font-medium text-slate-700 truncate">{{ att.original_name }}</p>
                  <p class="text-[10px] text-slate-400">{{ formatFileSize(att.size_bytes) }}</p>
                </a>
                <button
                  type="button"
                  class="size-6 rounded-md hover:bg-red-50 flex items-center justify-center cursor-pointer"
                  @click="markDeleteExisting(att.id)"
                >
                  <UIcon
                    name="i-lucide-x"
                    class="size-3.5 text-slate-400 hover:text-red-500"
                  />
                </button>
              </div>
            </div>

            <!-- Marked for deletion -->
            <div
              v-if="deleteFileIds.length > 0"
              class="flex flex-col gap-1 mb-3"
            >
              <div
                v-for="delId in deleteFileIds"
                :key="delId"
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200"
              >
                <UIcon
                  name="i-lucide-trash-2"
                  class="size-3.5 text-red-400"
                />
                <span class="text-xs text-red-600 flex-1">Sẽ xoá khi lưu</span>
                <button
                  class="text-xs text-red-500 hover:text-red-700 underline cursor-pointer"
                  @click="undoDeleteExisting(delId)"
                >
                  Hoàn tác
                </button>
              </div>
            </div>

            <!-- New files -->
            <div
              v-if="newFiles.length > 0"
              class="flex flex-col gap-2 mb-3"
            >
              <div
                v-for="(file, idx) in newFiles"
                :key="idx"
                class="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2"
              >
                <div
                  class="size-8 rounded-lg flex items-center justify-center shrink-0"
                  :class="isImageMime(file.type) ? 'bg-violet-100' : 'bg-amber-100'"
                >
                  <UIcon
                    :name="isImageMime(file.type) ? 'i-lucide-image' : 'i-lucide-file-text'"
                    class="size-4"
                    :class="isImageMime(file.type) ? 'text-violet-500' : 'text-amber-600'"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-medium text-slate-700 truncate">
                    {{ file.name }}
                  </p>
                  <p class="text-[10px] text-emerald-600">
                    Mới — sẽ upload khi lưu
                  </p>
                </div>
                <button
                  type="button"
                  class="size-6 rounded-md hover:bg-red-50 flex items-center justify-center cursor-pointer"
                  @click="removeNewFile(idx)"
                >
                  <UIcon
                    name="i-lucide-x"
                    class="size-3.5 text-slate-400 hover:text-red-500"
                  />
                </button>
              </div>
            </div>

            <!-- Upload button -->
            <input
              ref="fileInputRef"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/gif,image/webp,application/pdf,.doc,.docx,.xls,.xlsx"
              class="hidden"
              @change="handleFileSelect"
            >
            <button
              v-if="totalFileCount < ATTACHMENT_MAX_FILES"
              type="button"
              class="flex items-center gap-2 rounded-lg border-2 border-dashed border-slate-200 px-4 py-3 text-xs text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer w-full justify-center"
              @click="fileInputRef?.click()"
            >
              <UIcon
                name="i-lucide-upload"
                class="size-4"
              />
              Thêm tệp đính kèm
            </button>
          </div>
        </SharedSectionCard>

        <!-- ─── Thông tin xử lý ─── -->
        <SharedSectionCard title="Thông tin xử lý">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <p class="text-sm font-medium text-slate-700 mb-1.5">
                Ưu tiên <span class="text-red-500">*</span>
              </p>
              <USelect
                v-model="form.priority"
                :items="priorityOptions"
                placeholder="Chọn ưu tiên"
                class="w-full"
              />
            </div>
            <div>
              <p class="text-sm font-medium text-slate-700 mb-1.5">
                Người tiếp nhận
              </p>
              <USelect
                :model-value="form.received_by_id ?? undefined"
                :items="accountOptions"
                placeholder="Chọn người tiếp nhận"
                class="w-full"
                @update:model-value="form.received_by_id = $event ?? null"
              />
            </div>
            <div>
              <p class="text-sm font-medium text-slate-700 mb-1.5">
                Người thi công
              </p>
              <USelectMenu
                :model-value="form.assigned_to_ids ?? []"
                :items="accountOptions"
                value-key="value"
                multiple
                placeholder="Chọn người thi công"
                class="w-full"
                @update:model-value="form.assigned_to_ids = $event"
              >
                <template #item-label="{ item }">
                  <div class="flex items-center justify-between gap-2 w-full">
                    <span class="truncate">{{ (item as { label: string }).label }}</span>
                    <SharedCapabilityRatingBadge
                      v-if="(item as { capability_rating?: number | null }).capability_rating != null"
                      :rating="(item as { capability_rating?: number | null }).capability_rating"
                      size="xs"
                    />
                  </div>
                </template>
              </USelectMenu>
            </div>
            <div>
              <p class="text-sm font-medium text-slate-700 mb-1.5">
                Hạn SLA Báo giá
              </p>
              <VueDatePicker
                v-model="form.sla_quote_due_at"
                model-type="yyyy-MM-dd HH:mm:ss"
                placeholder="Chọn ngày giờ"
                :clearable="true"
                teleport="body"
              />
              <p
                v-if="isSlaQuoteViolated"
                class="text-xs text-red-500 mt-1"
              >
                Đã quá hạn SLA báo giá
              </p>
            </div>
            <div>
              <p class="text-sm font-medium text-slate-700 mb-1.5">
                Hạn SLA Hoàn thành
              </p>
              <VueDatePicker
                v-model="form.sla_completion_due_at"
                model-type="yyyy-MM-dd HH:mm:ss"
                placeholder="Chọn ngày giờ"
                :clearable="true"
                teleport="body"
              />
              <p
                v-if="isSlaCompletionViolated"
                class="text-xs text-red-500 mt-1"
              >
                Đã quá hạn SLA hoàn thành
              </p>
            </div>
          </div>

          <div class="mt-5">
            <p class="text-sm font-medium text-slate-700 mb-1.5">
              Ghi chú nội bộ
            </p>
            <UTextarea
              v-model="form.internal_note"
              placeholder="Nhập ghi chú nội bộ..."
              :rows="3"
              class="w-full"
            />
          </div>
        </SharedSectionCard>

        <!-- ─── Bottom actions (mobile-friendly) ─── -->
        <div class="flex items-center gap-3 lg:hidden">
          <UButton
            label="Lưu thay đổi"
            icon="i-lucide-save"
            color="primary"
            :loading="isSaving"
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

      <!-- ═══ RIGHT SIDEBAR (read-only context) ═══ -->
      <div class="flex flex-col gap-4">
        <SharedSectionCard
          title="Thông tin tiếp nhận"
          compact
        >
          <div class="flex flex-col gap-4">
            <SharedFieldDisplay label="Người nhận">
              {{ ogTicket.received_by?.name ?? '—' }}
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Nhận lúc">
              {{ formatDateTime(ogTicket.received_at) }}
            </SharedFieldDisplay>
            <SharedFieldDisplay
              v-if="ogTicket.assignees?.length"
              label="Người thi công"
            >
              <div class="flex flex-col gap-1">
                <span
                  v-for="a in ogTicket.assignees"
                  :key="a.id"
                >{{ a.name }}</span>
              </div>
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Trạng thái hiện tại">
              <UBadge
                :label="ogTicket.status.label"
                :color="ogTicketStatusColor(ogTicket.status.value)"
                variant="subtle"
                size="sm"
              />
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Ưu tiên hiện tại">
              <UBadge
                :label="ogTicket.priority.label"
                :color="ogTicketPriorityColor(ogTicket.priority.value)"
                variant="soft"
                size="sm"
              />
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Cập nhật lúc">
              {{ formatDateTime(ogTicket.updated_at) }}
            </SharedFieldDisplay>
          </div>
        </SharedSectionCard>

        <UButton
          label="Xem chi tiết"
          icon="i-lucide-eye"
          color="primary"
          variant="soft"
          class="w-full"
          :to="`/pmc/og-tickets/${id}`"
        />
      </div>
    </div>

    <SharedOgTicketCategoryModal
      v-if="ogTicket"
      v-model:open="categoriesModalOpen"
      :og-ticket-id="ogTicket.id"
      :selected-ids="selectedCategoryIds"
      @saved="handleCategoriesSaved"
    />
  </div>
</template>
