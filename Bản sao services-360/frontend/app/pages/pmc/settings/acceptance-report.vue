<script setup lang="ts">
definePageMeta({ layout: 'default' })

const toast = useToast()

// ─── Data loading ───
const { data, status, error, refresh } = useSettingsGroup('acceptance_report')

const settings = computed(() => data.value?.data ?? {})

// ─── Form state ───
const form = reactive({
  template_title: '',
  template_html: '' as string
})
const formInitialized = ref(false)
const isSaving = ref(false)

watch(settings, (val) => {
  if (!val || formInitialized.value) return
  form.template_title = String(val.template_title ?? 'Biên bản nghiệm thu')
  form.template_html = String(val.template_html ?? '')
  formInitialized.value = true
})

function hasChanges(): boolean {
  const current = settings.value
  const origTitle = current.template_title ?? 'Biên bản nghiệm thu'
  const origHtml = current.template_html ?? ''
  return form.template_title !== origTitle || form.template_html !== origHtml
}

// ─── Placeholder insertion ───
const placeholderOptions = computed(() =>
  ACCEPTANCE_REPORT_PLACEHOLDERS.map(p => ({
    label: `${p.label}  ·  ${p.token}`,
    onSelect: () => insertAtCaret(p.token)
  }))
)

function insertAtCaret(token: string) {
  form.template_html = (form.template_html ?? '') + ` ${token}`
}

// ─── Preview modal ───
const isPreviewOpen = ref(false)

// ─── Save ───
async function handleSave() {
  if (!hasChanges()) {
    toast.add({ title: 'Không có thay đổi.', color: 'neutral' })
    return
  }

  isSaving.value = true
  try {
    await apiSaveSettings('acceptance_report', [
      { key: 'template_title', value: form.template_title },
      { key: 'template_html', value: form.template_html ?? '' }
    ])
    toast.add({ title: 'Lưu template thành công.', color: 'success' })
    await refresh()
    formInitialized.value = false
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Lưu template thất bại.'), color: 'error' })
  } finally {
    isSaving.value = false
  }
}

function handleReset() {
  formInitialized.value = false
  const current = settings.value
  form.template_title = String(current.template_title ?? 'Biên bản nghiệm thu')
  form.template_html = String(current.template_html ?? '')
  formInitialized.value = true
}

useSeoMeta({ title: 'Template biên bản nghiệm thu' })
</script>

<template>
  <div class="flex flex-col gap-5 sm:gap-6">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <div class="min-w-0">
        <h1 class="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
          Template biên bản nghiệm thu
        </h1>
        <p class="text-slate-500 text-sm mt-0.5">
          Template dùng khi lập biên bản nghiệm thu cho đơn hàng. Sử dụng các biến <code v-pre>{{biến}}</code> để chèn thông tin.
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="status === 'pending'"
      class="flex flex-col gap-4"
    >
      <div class="h-64 bg-slate-100 rounded-xl animate-pulse" />
    </div>

    <!-- Error -->
    <SharedCrudPageError
      v-else-if="error"
      :error="error"
      :retry="refresh"
    />

    <!-- Form -->
    <div
      v-else
      class="flex flex-col gap-4 sm:gap-6"
    >
      <!-- Title -->
      <SharedSectionCard title="Tiêu đề">
        <UFormField
          label="Tiêu đề biên bản"
          name="template_title"
        >
          <UInput
            v-model="form.template_title"
            placeholder="Biên bản nghiệm thu"
          />
        </UFormField>
      </SharedSectionCard>

      <!-- Template editor -->
      <SharedSectionCard title="Nội dung template">
        <div class="space-y-3">
          <UAlert
            icon="i-lucide-info"
            color="info"
            variant="subtle"
          >
            <template #description>
              Chèn biến bằng menu "Chèn biến" bên dưới. Khi lập biên bản cho một đơn hàng,
              các biến sẽ tự động được thay bằng thông tin của đơn.
            </template>
          </UAlert>

          <!-- Insert placeholder dropdown + Preview -->
          <div class="flex items-center gap-2 flex-wrap">
            <UDropdownMenu
              :items="[placeholderOptions]"
              :popper="{ placement: 'bottom-start' }"
            >
              <UButton
                label="Chèn biến"
                icon="i-lucide-braces"
                color="primary"
                variant="soft"
                size="sm"
              />
            </UDropdownMenu>
            <UButton
              label="Xem trước"
              icon="i-lucide-eye"
              color="neutral"
              variant="soft"
              size="sm"
              @click="isPreviewOpen = true"
            />
            <span class="text-xs text-slate-500">Biến sẽ được thêm vào cuối. Bạn có thể cắt/dán đến vị trí mong muốn.</span>
          </div>

          <!-- Editor -->
          <div class="border border-slate-200 rounded-lg">
            <SharedRichTextEditor
              v-model="form.template_html"
              placeholder="Nhập nội dung template biên bản nghiệm thu..."
              min-height="420px"
            />
          </div>
        </div>
      </SharedSectionCard>

      <!-- Actions (sticky bottom) -->
      <div class="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 flex items-center justify-end gap-3 z-10">
        <UButton
          label="Đặt lại"
          color="neutral"
          variant="ghost"
          :disabled="!hasChanges() || isSaving"
          @click="handleReset"
        />
        <UButton
          label="Lưu template"
          icon="i-lucide-save"
          color="primary"
          :loading="isSaving"
          :disabled="!hasChanges()"
          @click="handleSave"
        />
      </div>
    </div>

    <!-- Preview modal -->
    <UModal
      v-model:open="isPreviewOpen"
      title="Xem trước biên bản nghiệm thu"
      :ui="{ content: 'max-w-4xl' }"
    >
      <template #body>
        <div
          class="prose prose-sm max-w-none max-h-[70vh] overflow-y-auto p-2"
          v-html="form.template_html"
        />
      </template>
      <template #footer>
        <div class="flex items-center justify-end w-full">
          <UButton
            label="Đóng"
            color="neutral"
            variant="ghost"
            @click="isPreviewOpen = false"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
