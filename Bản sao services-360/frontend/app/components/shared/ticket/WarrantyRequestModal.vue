<script setup lang="ts">
import type { PublicWarrantyRequest } from '~/composables/api/useTickets'

interface Props {
  open: boolean
  mode: 'create' | 'view'
  ticketCode: string
  request?: PublicWarrantyRequest | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:open': [value: boolean]
  'submitted': []
}>()

const toast = useToast()

const subject = ref('')
const description = ref('')
const attachments = ref<File[]>([])
const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)

const attachmentPreviews = computed(() =>
  attachments.value.map(file => ({
    file,
    previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
  }))
)

onBeforeUnmount(() => {
  for (const preview of attachmentPreviews.value) {
    if (preview.previewUrl) URL.revokeObjectURL(preview.previewUrl)
  }
})

function resetForm() {
  for (const preview of attachmentPreviews.value) {
    if (preview.previewUrl) URL.revokeObjectURL(preview.previewUrl)
  }
  subject.value = ''
  description.value = ''
  attachments.value = []
  errors.value = {}
}

watch(() => props.open, (open) => {
  if (open && props.mode === 'create') {
    resetForm()
  }
})

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files) return

  for (const file of Array.from(input.files)) {
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
    attachments.value.push(file)
  }

  input.value = ''
}

function removeFile(index: number) {
  const preview = attachmentPreviews.value[index]
  if (preview?.previewUrl) URL.revokeObjectURL(preview.previewUrl)
  attachments.value.splice(index, 1)
  if (errors.value.attachments) delete errors.value.attachments
}

async function handleSubmit() {
  errors.value = {}
  const localErrors: Record<string, string> = {}
  if (!subject.value.trim()) localErrors.subject = 'Vui lòng nhập tiêu đề.'
  if (!description.value.trim()) localErrors.description = 'Vui lòng nhập mô tả.'
  if (Object.keys(localErrors).length > 0) {
    errors.value = localErrors
    return
  }

  isSubmitting.value = true
  try {
    await apiSubmitWarrantyRequest(props.ticketCode, {
      subject: subject.value.trim(),
      description: description.value.trim(),
      attachments: attachments.value.length > 0 ? attachments.value : undefined
    })
    toast.add({ title: 'Đã gửi yêu cầu bảo hành!', color: 'success' })
    emit('submitted')
    emit('update:open', false)
  } catch (err: unknown) {
    const validationErrors = getApiValidationErrors(err)
    if (validationErrors) {
      const mapped: Record<string, string> = {}
      for (const [key, messages] of Object.entries(validationErrors)) {
        if (messages.length > 0) mapped[key] = messages[0]!
      }
      errors.value = mapped
    } else {
      toast.add({ title: getApiErrorMessage(err, 'Có lỗi xảy ra, vui lòng thử lại.'), color: 'error' })
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <UModal
    :open="open"
    @update:open="(v: boolean) => emit('update:open', v)"
  >
    <template #content>
      <div class="p-6">
        <!-- ───── Header ───── -->
        <div class="flex items-center gap-3 mb-5">
          <div class="size-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
            <span
              class="material-symbols-outlined text-amber-500"
              style="font-size: 20px; font-variation-settings: 'FILL' 1"
            >verified</span>
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900">
              {{ mode === 'create' ? 'Yêu cầu bảo hành' : 'Chi tiết yêu cầu bảo hành' }}
            </h3>
            <p
              v-if="mode === 'create'"
              class="text-xs text-slate-500 mt-0.5"
            >
              Mô tả vấn đề để chúng tôi xử lý nhanh nhất
            </p>
            <p
              v-else-if="request?.created_at"
              class="text-xs text-slate-500 mt-0.5"
            >
              Gửi lúc {{ formatDateTime(request.created_at) }}
            </p>
          </div>
        </div>

        <!-- ───── CREATE MODE ───── -->
        <template v-if="mode === 'create'">
          <div class="mb-4">
            <label class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Tiêu đề <span class="text-red-400">*</span>
            </label>
            <UInput
              v-model="subject"
              placeholder="VD: Mái bị thấm nước sau mưa"
              :maxlength="500"
              class="w-full"
            />
            <p
              v-if="errors.subject"
              class="text-[11px] text-red-400 mt-1"
            >
              {{ errors.subject }}
            </p>
          </div>

          <div class="mb-4">
            <label class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Mô tả chi tiết <span class="text-red-400">*</span>
            </label>
            <UTextarea
              v-model="description"
              placeholder="Mô tả tình trạng và thời điểm phát hiện..."
              :rows="5"
              :maxlength="5000"
              class="w-full"
            />
            <p
              v-if="errors.description"
              class="text-[11px] text-red-400 mt-1"
            >
              {{ errors.description }}
            </p>
          </div>

          <!-- File upload -->
          <div class="mb-5">
            <label class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Hình ảnh/tệp đính kèm
              <span class="text-[10px] text-slate-400 font-normal">(tối đa {{ ATTACHMENT_MAX_FILES }})</span>
            </label>

            <div
              v-if="attachmentPreviews.length > 0"
              class="grid grid-cols-3 gap-2 mb-2"
            >
              <div
                v-for="(preview, idx) in attachmentPreviews"
                :key="idx"
                class="relative group rounded-lg overflow-hidden border border-slate-200 aspect-square bg-slate-50"
              >
                <img
                  v-if="preview.previewUrl"
                  :src="preview.previewUrl"
                  :alt="preview.file.name"
                  class="w-full h-full object-cover"
                >
                <div
                  v-else
                  class="w-full h-full flex flex-col items-center justify-center text-slate-400 p-2"
                >
                  <span
                    class="material-symbols-outlined"
                    style="font-size: 28px"
                  >draft</span>
                  <p class="text-[10px] mt-1 text-center line-clamp-2 break-all">
                    {{ preview.file.name }}
                  </p>
                </div>
                <button
                  type="button"
                  class="absolute top-1 right-1 size-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  @click="removeFile(idx)"
                >
                  <span
                    class="material-symbols-outlined"
                    style="font-size: 14px"
                  >close</span>
                </button>
              </div>
            </div>

            <label
              v-if="attachments.length < ATTACHMENT_MAX_FILES"
              class="flex items-center justify-center gap-2 w-full px-3 py-3 rounded-lg border-2 border-dashed border-slate-200 text-slate-500 text-sm font-medium cursor-pointer hover:border-amber-300 hover:text-amber-500 transition-colors"
            >
              <span
                class="material-symbols-outlined"
                style="font-size: 18px"
              >add_photo_alternate</span>
              Chọn tệp từ máy
              <input
                type="file"
                multiple
                :accept="ATTACHMENT_ALLOWED_TYPES.join(',')"
                class="hidden"
                @change="handleFileSelect"
              >
            </label>
            <p
              v-if="errors.attachments"
              class="text-[11px] text-red-400 mt-1"
            >
              {{ errors.attachments }}
            </p>
          </div>

          <div class="flex gap-3">
            <UButton
              color="neutral"
              variant="outline"
              size="md"
              class="flex-1"
              :disabled="isSubmitting"
              @click="emit('update:open', false)"
            >
              Huỷ
            </UButton>
            <UButton
              color="warning"
              size="md"
              class="flex-1"
              :loading="isSubmitting"
              @click="handleSubmit"
            >
              Gửi yêu cầu
            </UButton>
          </div>
        </template>

        <!-- ───── VIEW MODE ───── -->
        <template v-else-if="request">
          <div class="mb-4">
            <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Tiêu đề
            </p>
            <p class="text-sm font-semibold text-slate-900">
              {{ request.subject }}
            </p>
          </div>

          <div class="mb-4">
            <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Mô tả
            </p>
            <p class="text-sm text-slate-700 whitespace-pre-line">
              {{ request.description }}
            </p>
          </div>

          <div
            v-if="request.attachments.length > 0"
            class="mb-5"
          >
            <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Hình ảnh/tệp đính kèm
            </p>
            <div class="grid grid-cols-3 gap-2">
              <a
                v-for="attachment in request.attachments"
                :key="attachment.id"
                :href="attachment.url ?? '#'"
                target="_blank"
                rel="noopener"
                class="relative block rounded-lg overflow-hidden border border-slate-200 aspect-square bg-slate-50 hover:border-amber-300 transition-colors"
              >
                <img
                  v-if="attachment.mime_type.startsWith('image/') && attachment.url"
                  :src="attachment.url"
                  :alt="attachment.original_name"
                  class="w-full h-full object-cover"
                >
                <div
                  v-else
                  class="w-full h-full flex flex-col items-center justify-center text-slate-400 p-2"
                >
                  <span
                    class="material-symbols-outlined"
                    style="font-size: 28px"
                  >draft</span>
                  <p class="text-[10px] mt-1 text-center line-clamp-2 break-all">
                    {{ attachment.original_name }}
                  </p>
                </div>
              </a>
            </div>
          </div>

          <UButton
            color="neutral"
            variant="outline"
            size="md"
            block
            @click="emit('update:open', false)"
          >
            Đóng
          </UButton>
        </template>
      </div>
    </template>
  </UModal>
</template>
