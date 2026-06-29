<script setup lang="ts">
interface Props {
  ticketCode: string
}

const props = defineProps<Props>()

const toast = useToast()

const { data, status, error, refresh } = usePublicOgTicketSurvey(() => props.ticketCode)

const survey = computed(() => data.value?.data ?? null)

const noteInput = ref<string | null>(null)
const pendingFiles = ref<File[]>([])
const pendingPreviews = ref<Map<File, string>>(new Map())
const fileInputRef = ref<HTMLInputElement | null>(null)
const isSaving = ref(false)
const deletingAttachmentId = ref<number | null>(null)
const isExpanded = ref(false)

function previewUrl(file: File): string | null {
  return pendingPreviews.value.get(file) ?? null
}

function trackPreview(file: File) {
  if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
    pendingPreviews.value.set(file, URL.createObjectURL(file))
  }
}

function untrackPreview(file: File) {
  const url = pendingPreviews.value.get(file)
  if (url) {
    URL.revokeObjectURL(url)
    pendingPreviews.value.delete(file)
  }
}

function clearAllPreviews() {
  for (const url of pendingPreviews.value.values()) {
    URL.revokeObjectURL(url)
  }
  pendingPreviews.value.clear()
}

onBeforeUnmount(() => {
  clearAllPreviews()
})

watch(
  survey,
  (val) => {
    noteInput.value = val?.note ?? null
  },
  { immediate: true }
)

const isDirty = computed(() => {
  if ((noteInput.value ?? '') !== (survey.value?.note ?? '')) return true
  if (pendingFiles.value.length > 0) return true
  return false
})

const totalFiles = computed(
  () => (survey.value?.attachments.length ?? 0) + pendingFiles.value.length
)

const hasContent = computed(
  () => (survey.value?.note ?? '').length > 0 || (survey.value?.attachments.length ?? 0) > 0
)

function isVideoMime(mime: string): boolean {
  return mime.startsWith('video/')
}

function fileIcon(mime: string): string {
  if (isImageMime(mime)) return 'i-lucide-image'
  if (isVideoMime(mime)) return 'i-lucide-video'
  if (mime === 'application/pdf') return 'i-lucide-file-text'
  return 'i-lucide-file'
}

function onPickFiles() {
  fileInputRef.value?.click()
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files ?? [])

  const accepted: File[] = []
  for (const f of files) {
    if (totalFiles.value + accepted.length >= SURVEY_MAX_FILES) {
      toast.add({ title: `Tối đa ${SURVEY_MAX_FILES} tệp`, color: 'warning' })
      break
    }
    if (f.size > SURVEY_MAX_FILE_BYTES) {
      toast.add({ title: `Tệp ${f.name} vượt 100MB`, color: 'warning' })
      continue
    }
    if (!SURVEY_ALLOWED_MIMES.includes(f.type)) {
      toast.add({ title: `Định dạng ${f.name} không hợp lệ`, color: 'warning' })
      continue
    }
    accepted.push(f)
  }

  for (const f of accepted) trackPreview(f)
  pendingFiles.value = [...pendingFiles.value, ...accepted]
  input.value = ''
}

function removePendingFile(index: number) {
  const file = pendingFiles.value[index]
  if (file) untrackPreview(file)
  pendingFiles.value = pendingFiles.value.filter((_, i) => i !== index)
}

async function onSave() {
  if (!isDirty.value) return
  isSaving.value = true
  try {
    await apiUpsertPublicOgTicketSurvey(props.ticketCode, {
      note: noteInput.value,
      attachments: pendingFiles.value
    })
    clearAllPreviews()
    pendingFiles.value = []
    await refresh()
    toast.add({ title: 'Đã lưu khảo sát. Cảm ơn bạn!', color: 'success' })
    isExpanded.value = false
  } catch (err) {
    toast.add({
      title: getApiErrorMessage(err, 'Không thể lưu khảo sát'),
      color: 'error'
    })
  } finally {
    isSaving.value = false
  }
}

async function onDeleteAttachment(attachmentId: number) {
  if (!confirm('Xoá tệp này?')) return
  deletingAttachmentId.value = attachmentId
  try {
    await apiDeletePublicOgTicketSurveyAttachment(props.ticketCode, attachmentId)
    await refresh()
    toast.add({ title: 'Đã xoá tệp', color: 'success' })
  } catch (err) {
    toast.add({
      title: getApiErrorMessage(err, 'Không thể xoá tệp'),
      color: 'error'
    })
  } finally {
    deletingAttachmentId.value = null
  }
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
    <button
      type="button"
      class="w-full px-5 py-3.5 border-b border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors"
      @click="isExpanded = !isExpanded"
    >
      <div class="flex items-center gap-2">
        <span
          class="material-symbols-outlined text-emerald-500"
          style="font-size: 18px; font-variation-settings: 'FILL' 1"
        >search</span>
        <h2 class="text-sm font-bold text-slate-800">
          Khảo sát hiện trạng
        </h2>
        <UBadge
          v-if="hasContent"
          color="success"
          variant="subtle"
          size="xs"
        >
          Đã điền
        </UBadge>
      </div>
      <div class="flex items-center gap-2">
        <span
          v-if="(survey?.attachments.length ?? 0) > 0"
          class="text-xs text-slate-400"
        >
          {{ survey?.attachments.length }} tệp
        </span>
        <span
          class="material-symbols-outlined text-slate-400 transition-transform"
          :class="{ 'rotate-180': isExpanded }"
          style="font-size: 18px"
        >expand_more</span>
      </div>
    </button>

    <div
      v-if="isExpanded"
      class="px-5 py-4"
    >
      <div
        v-if="status === 'pending'"
        class="text-sm text-slate-500 py-4 text-center"
      >
        Đang tải...
      </div>

      <UAlert
        v-else-if="error"
        color="error"
        variant="subtle"
        title="Không tải được khảo sát"
        :description="getApiErrorMessage(error)"
      />

      <div
        v-else
        class="flex flex-col gap-4"
      >
        <div class="flex flex-col gap-2">
          <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Mô tả hiện trạng
          </label>
          <SharedRichTextEditor
            v-model="noteInput"
            placeholder="Ví dụ: Tường nứt ở vị trí X, vòi nước rỉ, máy lạnh không lạnh..."
            min-height="160px"
          />
        </div>

        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Ảnh / Video / Tệp ({{ totalFiles }} / {{ SURVEY_MAX_FILES }})
            </label>
            <UButton
              icon="i-lucide-upload"
              label="Chọn tệp"
              size="xs"
              variant="soft"
              color="primary"
              @click="onPickFiles"
            />
            <input
              ref="fileInputRef"
              type="file"
              multiple
              class="hidden"
              :accept="SURVEY_ALLOWED_MIMES.join(',')"
              @change="onFileChange"
            >
          </div>

          <div class="text-xs text-slate-400">
            Tối đa 100MB mỗi tệp. Hỗ trợ ảnh, video, PDF.
          </div>

          <div
            v-if="totalFiles === 0"
            class="text-sm text-slate-400 py-6 text-center border border-dashed border-slate-200 rounded-lg"
          >
            Chưa có tệp nào
          </div>

          <div
            v-else
            class="grid grid-cols-2 sm:grid-cols-3 gap-2.5"
          >
            <div
              v-for="att in survey?.attachments ?? []"
              :key="`saved-${att.id}`"
              class="relative border border-slate-200 rounded-lg overflow-hidden bg-white group"
            >
              <div class="aspect-square flex items-center justify-center bg-slate-50">
                <a
                  v-if="isImageMime(att.mime_type) && att.url"
                  :href="att.url"
                  target="_blank"
                  rel="noopener"
                  class="block w-full h-full"
                >
                  <img
                    :src="att.url"
                    :alt="att.original_name"
                    class="w-full h-full object-cover"
                  >
                </a>
                <video
                  v-else-if="isVideoMime(att.mime_type) && att.url"
                  :src="att.url"
                  controls
                  preload="metadata"
                  class="w-full h-full object-cover"
                />
                <a
                  v-else-if="att.url"
                  :href="att.url"
                  target="_blank"
                  rel="noopener"
                  class="flex flex-col items-center gap-1 text-slate-500"
                >
                  <UIcon
                    :name="fileIcon(att.mime_type)"
                    class="size-8"
                  />
                  <span class="text-[10px]">Mở tệp</span>
                </a>
              </div>
              <div class="px-2 py-1.5 text-[11px]">
                <div
                  class="truncate font-medium text-slate-700"
                  :title="att.original_name"
                >
                  {{ att.original_name }}
                </div>
                <div class="text-slate-400">
                  {{ formatFileSize(att.size_bytes) }}
                </div>
              </div>
              <UButton
                icon="i-lucide-trash-2"
                color="error"
                variant="solid"
                size="sm"
                square
                class="absolute top-1 right-1 shadow-md"
                aria-label="Xoá tệp"
                :loading="deletingAttachmentId === att.id"
                @click="onDeleteAttachment(att.id)"
              />
            </div>

            <div
              v-for="(file, idx) in pendingFiles"
              :key="`pending-${idx}`"
              class="relative border-2 border-dashed border-emerald-400 rounded-lg overflow-hidden bg-emerald-50 group"
            >
              <div class="aspect-square flex items-center justify-center bg-slate-50">
                <img
                  v-if="isImageMime(file.type) && previewUrl(file)"
                  :src="previewUrl(file)!"
                  :alt="file.name"
                  class="w-full h-full object-cover"
                >
                <video
                  v-else-if="isVideoMime(file.type) && previewUrl(file)"
                  :src="previewUrl(file)!"
                  controls
                  preload="metadata"
                  class="w-full h-full object-cover"
                />
                <UIcon
                  v-else
                  :name="fileIcon(file.type)"
                  class="size-8 text-emerald-500"
                />
              </div>
              <div class="px-2 py-1.5 text-[11px]">
                <div
                  class="truncate font-medium text-slate-700"
                  :title="file.name"
                >
                  {{ file.name }}
                </div>
                <div class="text-emerald-600">
                  Chưa lưu · {{ formatFileSize(file.size) }}
                </div>
              </div>
              <UButton
                icon="i-lucide-trash-2"
                color="error"
                variant="solid"
                size="sm"
                square
                class="absolute top-1 right-1 shadow-md"
                aria-label="Xoá tệp"
                @click="removePendingFile(idx)"
              />
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <UButton
            label="Lưu khảo sát"
            icon="i-lucide-save"
            color="primary"
            :disabled="!isDirty"
            :loading="isSaving"
            @click="onSave"
          />
        </div>
      </div>
    </div>
  </div>
</template>
