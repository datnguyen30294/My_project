<script setup lang="ts">
interface Props {
  open: boolean
  orderId: number | string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const toast = useToast()

const orderIdRef = computed(() => props.orderId)
const { data, status, error, refresh } = useAcceptanceReport(orderIdRef)

const report = computed(() => data.value?.data)

const form = reactive({
  content_html: '',
  customer_name: '' as string | null,
  customer_phone: '' as string | null,
  note: '' as string | null
})
const initialized = ref(false)
const isSaving = ref(false)
const isRegenerating = ref(false)
const confirmRegenerateOpen = ref(false)

// Signed file state
const signedFileInput = ref<HTMLInputElement | null>(null)
const isUploadingSigned = ref(false)
const isDeletingSigned = ref(false)
const confirmDeleteSignedOpen = ref(false)

const ACCEPTED_SIGNED_MIME = 'application/pdf,image/jpeg,image/png'
const MAX_SIGNED_SIZE = 20 * 1024 * 1024
const isDraggingSigned = ref(false)

function formatBytes(bytes: number | null | undefined): string {
  if (!bytes) return ''
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${bytes} B`
}

const signedFileIsImage = computed(() => {
  const mime = report.value?.signed_file_mime
  return !!mime && mime.startsWith('image/')
})

const signedFileIsPdf = computed(() => report.value?.signed_file_mime === 'application/pdf')

function triggerUploadSigned() {
  signedFileInput.value?.click()
}

async function uploadSignedFile(file: File) {
  if (file.size > MAX_SIGNED_SIZE) {
    toast.add({ title: 'Kích thước tệp tối đa 20MB.', color: 'error' })
    return
  }

  const allowed = ['application/pdf', 'image/jpeg', 'image/png']
  if (!allowed.includes(file.type)) {
    toast.add({ title: 'Chỉ chấp nhận PDF, JPG hoặc PNG.', color: 'error' })
    return
  }

  isUploadingSigned.value = true
  try {
    await apiUploadSignedAcceptanceReport(props.orderId, file)
    toast.add({ title: 'Đã tải lên biên bản đã ký.', color: 'success' })
    await refresh()
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Tải lên thất bại.'), color: 'error' })
  } finally {
    isUploadingSigned.value = false
  }
}

function handleSignedDrop(event: DragEvent) {
  isDraggingSigned.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) void uploadSignedFile(file)
}

async function handleSignedFileSelected(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  await uploadSignedFile(file)
  target.value = ''
}

async function handleDeleteSigned() {
  isDeletingSigned.value = true
  try {
    await apiDeleteSignedAcceptanceReport(props.orderId)
    toast.add({ title: 'Đã xoá biên bản đã ký.', color: 'success' })
    confirmDeleteSignedOpen.value = false
    await refresh()
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Xoá thất bại.'), color: 'error' })
  } finally {
    isDeletingSigned.value = false
  }
}

watch(report, (val) => {
  if (!val || initialized.value) return
  form.content_html = val.content_html ?? ''
  form.customer_name = val.customer_name ?? ''
  form.customer_phone = val.customer_phone ?? ''
  form.note = val.note ?? ''
  initialized.value = true
}, { immediate: true })

watch(() => props.open, (val) => {
  if (!val) {
    initialized.value = false
  }
})

const shareUrl = computed(() => {
  const token = report.value?.share_token
  if (!token || typeof window === 'undefined') return ''
  return `${window.location.origin}/acceptance-report/${token}`
})

async function handleSave() {
  isSaving.value = true
  try {
    await apiUpdateAcceptanceReport(props.orderId, {
      content_html: form.content_html,
      customer_name: form.customer_name || null,
      customer_phone: form.customer_phone || null,
      note: form.note || null
    })
    toast.add({ title: 'Đã lưu biên bản.', color: 'success' })
    await refresh()
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Lưu biên bản thất bại.'), color: 'error' })
  } finally {
    isSaving.value = false
  }
}

async function handleRegenerate() {
  isRegenerating.value = true
  try {
    const res = await apiRegenerateAcceptanceReport(props.orderId)
    form.content_html = res.data?.content_html ?? ''
    toast.add({ title: 'Đã tạo lại biên bản từ template.', color: 'success' })
    await refresh()
    confirmRegenerateOpen.value = false
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Tạo lại biên bản thất bại.'), color: 'error' })
  } finally {
    isRegenerating.value = false
  }
}

async function handleCopyShareLink() {
  if (!shareUrl.value) return
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    toast.add({ title: 'Đã sao chép link chia sẻ.', color: 'success' })
  } catch {
    toast.add({ title: 'Không sao chép được. Vui lòng copy thủ công.', color: 'warning' })
  }
}

function handleOpenShareLink() {
  if (!shareUrl.value) return
  window.open(shareUrl.value, '_blank', 'noopener')
}
</script>

<template>
  <UModal
    :open="open"
    title="Biên bản nghiệm thu"
    :ui="{ content: 'max-w-[1200px]' }"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <div
        v-if="status === 'pending'"
        class="space-y-3"
      >
        <div class="h-6 bg-slate-100 rounded animate-pulse" />
        <div class="h-48 bg-slate-100 rounded animate-pulse" />
      </div>

      <SharedCrudPageError
        v-else-if="error"
        :error="error"
        :retry="refresh"
      />

      <div
        v-else
        class="grid grid-cols-1 lg:grid-cols-5 gap-6"
      >
        <!-- ═══════════ LEFT: FORM ═══════════ -->
        <section class="lg:col-span-3 space-y-4">
          <div class="flex items-center gap-2 pb-2 border-b border-slate-100">
            <UIcon
              name="i-lucide-file-pen"
              class="text-slate-400 size-4"
            />
            <h3 class="text-sm font-bold text-slate-800">
              Nội dung biên bản
            </h3>
          </div>

          <div
            v-if="shareUrl"
            class="flex items-center gap-2 text-sm"
          >
            <span class="text-slate-500 shrink-0 text-xs font-semibold uppercase tracking-wider">
              Link chia sẻ
            </span>
            <UInput
              :model-value="shareUrl"
              readonly
              class="flex-1 min-w-0"
              size="sm"
            />
            <UButton
              icon="i-lucide-copy"
              color="primary"
              variant="soft"
              size="sm"
              @click="handleCopyShareLink"
            />
            <UButton
              icon="i-lucide-external-link"
              color="neutral"
              variant="ghost"
              size="sm"
              @click="handleOpenShareLink"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <UFormField label="Họ tên bên A">
              <UInput
                v-model="form.customer_name"
                placeholder="Nguyễn Văn A"
              />
            </UFormField>
            <UFormField label="Điện thoại bên A">
              <UInput
                v-model="form.customer_phone"
                placeholder="0912xxxxxx"
              />
            </UFormField>
          </div>

          <UFormField label="Nội dung biên bản">
            <div class="border border-slate-200 rounded-lg">
              <SharedRichTextEditor
                v-model="form.content_html"
                placeholder="Nội dung biên bản nghiệm thu..."
                min-height="420px"
              />
            </div>
          </UFormField>

          <UFormField label="Ghi chú">
            <UTextarea
              v-model="form.note"
              :rows="2"
              placeholder="Ghi chú bổ sung nếu có..."
            />
          </UFormField>
        </section>

        <!-- ═══════════ RIGHT: SIGNED FILE ═══════════ -->
        <aside class="lg:col-span-2 flex flex-col">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100 mb-4">
            <div class="flex items-center gap-2">
              <UIcon
                name="i-lucide-file-signature"
                class="text-slate-400 size-4"
              />
              <h3 class="text-sm font-bold text-slate-800">
                Biên bản đã ký
              </h3>
            </div>
            <UBadge
              v-if="report?.is_confirmed"
              color="success"
              variant="subtle"
              size="xs"
              icon="i-lucide-check-circle"
            >
              Cư dân đã xác nhận
            </UBadge>
          </div>

          <UAlert
            v-if="report?.is_confirmed && report?.confirmed_signature_name"
            color="success"
            variant="subtle"
            icon="i-lucide-user-check"
            :title="report.confirmed_signature_name"
            :description="report.confirmed_at ? `Xác nhận online lúc ${formatDateTime(report.confirmed_at)}` : undefined"
            class="mb-4"
          />

          <input
            ref="signedFileInput"
            type="file"
            :accept="ACCEPTED_SIGNED_MIME"
            class="hidden"
            @change="handleSignedFileSelected"
          >

          <!-- Has file: preview + metadata -->
          <div
            v-if="report?.has_signed_file && report?.signed_file_url"
            class="flex flex-col gap-3 flex-1"
          >
            <!-- Preview -->
            <div class="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
              <iframe
                v-if="signedFileIsPdf"
                :src="report.signed_file_url"
                class="w-full h-[420px] bg-white"
                title="Biên bản đã ký"
              />
              <a
                v-else-if="signedFileIsImage"
                :href="report.signed_file_url"
                target="_blank"
                rel="noopener"
                class="block"
              >
                <img
                  :src="report.signed_file_url"
                  :alt="report.signed_file_original_name ?? 'Biên bản đã ký'"
                  class="w-full max-h-[420px] object-contain bg-white"
                >
              </a>
              <div
                v-else
                class="flex items-center justify-center h-[420px] text-slate-400 text-sm"
              >
                Không hỗ trợ xem trước định dạng này.
              </div>
            </div>

            <!-- File metadata + actions -->
            <div class="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/50">
              <div class="size-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                <UIcon
                  name="i-lucide-file-check"
                  class="text-emerald-500 size-4"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-slate-800 truncate">
                  {{ report.signed_file_original_name ?? 'Biên bản đã ký' }}
                </p>
                <p class="text-xs text-slate-500 mt-0.5">
                  {{ formatBytes(report.signed_file_size) }}
                  <template v-if="report.signed_uploaded_at">
                    &middot; {{ formatDateTime(report.signed_uploaded_at) }}
                  </template>
                </p>
              </div>
            </div>

            <div class="flex gap-2">
              <UButton
                :to="report.signed_file_url"
                target="_blank"
                icon="i-lucide-external-link"
                color="neutral"
                variant="outline"
                size="sm"
                label="Mở tab mới"
                class="flex-1 justify-center"
              />
              <UButton
                icon="i-lucide-refresh-cw"
                color="primary"
                variant="soft"
                size="sm"
                :loading="isUploadingSigned"
                label="Thay thế"
                class="flex-1 justify-center"
                @click="triggerUploadSigned"
              />
              <UButton
                icon="i-lucide-trash-2"
                color="error"
                variant="ghost"
                size="sm"
                :loading="isDeletingSigned"
                @click="confirmDeleteSignedOpen = true"
              />
            </div>
          </div>

          <!-- Empty state: drop zone -->
          <button
            v-else
            type="button"
            class="group flex-1 flex flex-col items-center justify-center gap-3 min-h-[420px] rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors"
            :class="isDraggingSigned
              ? 'border-primary-400 bg-primary-50/50'
              : 'border-slate-200 bg-slate-50/50 hover:border-primary-300 hover:bg-primary-50/30'"
            @click="triggerUploadSigned"
            @dragover.prevent="isDraggingSigned = true"
            @dragenter.prevent="isDraggingSigned = true"
            @dragleave.prevent="isDraggingSigned = false"
            @drop.prevent="handleSignedDrop"
          >
            <div
              class="size-14 rounded-2xl flex items-center justify-center transition-colors"
              :class="isDraggingSigned ? 'bg-primary-100' : 'bg-white border border-slate-200 group-hover:border-primary-300'"
            >
              <UIcon
                name="i-lucide-cloud-upload"
                class="size-7"
                :class="isDraggingSigned ? 'text-primary-500' : 'text-slate-400 group-hover:text-primary-500'"
              />
            </div>
            <div>
              <p class="text-sm font-semibold text-slate-700">
                Kéo-thả hoặc bấm để tải lên
              </p>
              <p class="text-xs text-slate-500 mt-1">
                PDF, JPG hoặc PNG — tối đa 20MB
              </p>
            </div>
            <UButton
              icon="i-lucide-upload"
              color="primary"
              variant="solid"
              size="sm"
              :loading="isUploadingSigned"
              label="Chọn tệp"
              as="span"
            />
          </button>
        </aside>
      </div>
    </template>

    <template #footer>
      <div class="flex items-center justify-between gap-2 w-full">
        <UButton
          label="Đóng"
          color="neutral"
          variant="ghost"
          @click="emit('update:open', false)"
        />
        <div class="flex gap-2">
          <UButton
            label="Tạo lại từ template"
            icon="i-lucide-refresh-cw"
            color="neutral"
            variant="outline"
            :disabled="!report"
            @click="confirmRegenerateOpen = true"
          />
          <UButton
            label="Lưu"
            icon="i-lucide-save"
            color="primary"
            :loading="isSaving"
            @click="handleSave"
          />
          <UButton
            label="Mở trang in"
            icon="i-lucide-printer"
            color="success"
            :disabled="!shareUrl"
            @click="handleOpenShareLink"
          />
        </div>
      </div>
    </template>
  </UModal>

  <UModal
    v-model:open="confirmDeleteSignedOpen"
    title="Xoá biên bản đã ký?"
    :ui="{ content: 'max-w-md' }"
  >
    <template #body>
      <UAlert
        color="warning"
        variant="subtle"
        icon="i-lucide-triangle-alert"
        title="Tệp đã tải lên sẽ bị xoá"
        description="Hành động này không thể hoàn tác."
      />
    </template>
    <template #footer>
      <div class="flex items-center justify-end gap-2 w-full">
        <UButton
          label="Huỷ"
          color="neutral"
          variant="ghost"
          :disabled="isDeletingSigned"
          @click="confirmDeleteSignedOpen = false"
        />
        <UButton
          label="Xoá"
          icon="i-lucide-trash-2"
          color="error"
          :loading="isDeletingSigned"
          @click="handleDeleteSigned"
        />
      </div>
    </template>
  </UModal>

  <UModal
    v-model:open="confirmRegenerateOpen"
    title="Tạo lại biên bản từ template?"
    :ui="{ content: 'max-w-md' }"
  >
    <template #body>
      <UAlert
        color="warning"
        variant="subtle"
        icon="i-lucide-triangle-alert"
        title="Nội dung biên bản hiện tại sẽ bị ghi đè"
        description="Toàn bộ nội dung đã chỉnh sửa tay trong biên bản sẽ bị thay thế bằng template hiện hành. Họ tên bên A, điện thoại, ghi chú và link chia sẻ được giữ nguyên."
      />
    </template>
    <template #footer>
      <div class="flex items-center justify-end gap-2 w-full">
        <UButton
          label="Huỷ"
          color="neutral"
          variant="ghost"
          :disabled="isRegenerating"
          @click="confirmRegenerateOpen = false"
        />
        <UButton
          label="Tạo lại"
          icon="i-lucide-refresh-cw"
          color="warning"
          :loading="isRegenerating"
          @click="handleRegenerate"
        />
      </div>
    </template>
  </UModal>
</template>
