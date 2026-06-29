<script setup lang="ts">
interface Props {
  currentUrl?: string | null
  alt?: string
  loading?: boolean
  maxSizeMb?: number
}

const props = withDefaults(defineProps<Props>(), {
  currentUrl: null,
  alt: '',
  loading: false,
  maxSizeMb: 10
})

const emit = defineEmits<{
  upload: [file: File]
  delete: []
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const previewUrl = ref<string | null>(null)
const deleted = ref(false)
const showConfirmDelete = ref(false)

const displayUrl = computed(() => {
  if (deleted.value) return null
  return previewUrl.value || props.currentUrl
})

const hasImage = computed(() => !!displayUrl.value)

const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

function openFilePicker() {
  fileInput.value?.click()
}

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (!allowedTypes.includes(file.type)) {
    useToast().add({ title: 'Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WebP)', color: 'error' })
    resetInput()
    return
  }

  const maxBytes = props.maxSizeMb * 1024 * 1024
  if (file.size > maxBytes) {
    useToast().add({ title: `Kích thước ảnh không được vượt quá ${props.maxSizeMb}MB`, color: 'error' })
    resetInput()
    return
  }

  previewUrl.value = URL.createObjectURL(file)
  deleted.value = false
  emit('upload', file)
  resetInput()
}

function confirmDelete() {
  showConfirmDelete.value = true
}

function handleDelete() {
  showConfirmDelete.value = false
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
  deleted.value = true
  emit('delete')
}

function resetInput() {
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

watch(() => props.currentUrl, () => {
  deleted.value = false
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
})

onBeforeUnmount(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})
</script>

<template>
  <div class="flex items-start gap-4">
    <div class="size-24 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-bg-muted)] flex items-center justify-center overflow-hidden shrink-0">
      <img
        v-if="displayUrl"
        :src="displayUrl"
        :alt="alt"
        class="size-full object-cover"
      >
      <UIcon
        v-else
        name="i-lucide-image"
        class="size-8 text-[var(--ui-text-dimmed)]"
      />
    </div>

    <div class="flex flex-col gap-2">
      <UButton
        icon="i-lucide-upload"
        :label="hasImage ? 'Đổi ảnh' : 'Tải ảnh lên'"
        variant="outline"
        size="sm"
        :loading="loading"
        @click="openFilePicker"
      />

      <UButton
        v-if="hasImage"
        icon="i-lucide-trash-2"
        label="Xóa ảnh"
        color="error"
        variant="outline"
        size="sm"
        :loading="loading"
        @click="confirmDelete"
      />
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/png,image/gif,image/webp"
      class="hidden"
      @change="handleFileChange"
    >

    <UModal
      v-model:open="showConfirmDelete"
      title="Xóa ảnh"
    >
      <template #body>
        <p>Bạn có chắc chắn muốn xóa ảnh này không?</p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="neutral"
            variant="outline"
            label="Huỷ"
            @click="showConfirmDelete = false"
          />
          <UButton
            color="error"
            label="Xóa"
            icon="i-lucide-trash-2"
            :loading="loading"
            @click="handleDelete"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
