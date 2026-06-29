<script setup lang="ts">
interface Props {
  ogTicketId: number
}

const props = defineProps<Props>()

const toast = useToast()

const { data, status, error, refresh } = useOgTicketSurvey(() => props.ogTicketId)

const survey = computed(() => data.value?.data ?? null)

const noteInput = ref<string | null>(null)
const pendingFiles = ref<File[]>([])
const pendingPreviews = ref<Map<File, string>>(new Map())
const fileInputRef = ref<HTMLInputElement | null>(null)
const isSaving = ref(false)
const deletingAttachmentId = ref<number | null>(null)

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
  if ((noteInput.value ?? '') !== (survey.value?.note ?? '')) {
    return true
  }
  if (pendingFiles.value.length > 0) return true
  return false
})

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
  const existingCount = (survey.value?.attachments.length ?? 0) + pendingFiles.value.length

  const accepted: File[] = []
  for (const f of files) {
    if (existingCount + accepted.length >= SURVEY_MAX_FILES) {
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
    await apiUpsertOgTicketSurvey(props.ogTicketId, {
      note: noteInput.value,
      attachments: pendingFiles.value
    })
    clearAllPreviews()
    pendingFiles.value = []
    await refresh()
    toast.add({ title: 'Đã lưu khảo sát', color: 'success' })
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Không thể lưu khảo sát'), color: 'error' })
  } finally {
    isSaving.value = false
  }
}

async function onDeleteAttachment(attachmentId: number) {
  if (!confirm('Xoá tệp đính kèm này?')) return
  deletingAttachmentId.value = attachmentId
  try {
    await apiDeleteOgTicketSurveyAttachment(props.ogTicketId, attachmentId)
    await refresh()
    toast.add({ title: 'Đã xoá tệp', color: 'success' })
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Không thể xoá tệp'), color: 'error' })
  } finally {
    deletingAttachmentId.value = null
  }
}

const formattedSurveyedAt = computed(() => {
  if (!survey.value?.surveyed_at) return null
  return new Date(survey.value.surveyed_at).toLocaleString('vi-VN')
})
</script>

<template>
  <SharedSectionCard title="Khảo sát hiện trạng">
    <template #header-actions>
      <div
        v-if="survey?.surveyor && formattedSurveyedAt"
        class="text-xs text-slate-500"
      >
        Cập nhật bởi <span class="font-medium text-slate-700">{{ survey.surveyor.name }}</span>
        lúc {{ formattedSurveyedAt }}
      </div>
    </template>

    <div
      v-if="status === 'pending'"
      class="text-sm text-slate-500 py-6 text-center"
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
        <label class="text-sm font-medium text-slate-700">Ghi chú khảo sát</label>
        <SharedRichTextEditor
          v-model="noteInput"
          placeholder="Mô tả hiện trạng: vết nứt, vị trí hư hỏng, tình trạng thiết bị..."
          min-height="180px"
        />
      </div>

      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-slate-700">
            Tệp đính kèm
            <span class="text-xs font-normal text-slate-400">
              ({{ (survey?.attachments.length ?? 0) + pendingFiles.length }} / {{ SURVEY_MAX_FILES }})
            </span>
          </label>
          <UButton
            icon="i-lucide-upload"
            label="Chọn tệp"
            size="xs"
            variant="soft"
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
          Hỗ trợ ảnh, video, PDF, Word, Excel, văn bản. Mỗi tệp tối đa 100MB.
        </div>

        <div
          v-if="(survey?.attachments.length ?? 0) === 0 && pendingFiles.length === 0"
          class="text-sm text-slate-400 py-4 text-center border border-dashed border-slate-200 rounded-lg"
        >
          Chưa có tệp nào
        </div>

        <div
          v-else
          class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
        >
          <!-- Existing attachments -->
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
                class="flex flex-col items-center gap-1 text-slate-500 hover:text-primary"
              >
                <UIcon
                  :name="fileIcon(att.mime_type)"
                  class="size-10"
                />
                <span class="text-xs">Mở tệp</span>
              </a>
              <UIcon
                v-else
                :name="fileIcon(att.mime_type)"
                class="size-10 text-slate-400"
              />
            </div>
            <div class="px-2 py-1.5 text-xs">
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

          <!-- Pending (unsaved) files -->
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
                class="size-10 text-emerald-500"
              />
            </div>
            <div class="px-2 py-1.5 text-xs">
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
  </SharedSectionCard>
</template>
