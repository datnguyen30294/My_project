<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()
const toast = useToast()

const policyType = computed(() => route.params.type as string)
const typeLabel = computed(() => POLICY_TYPE_LABELS[policyType.value] ?? policyType.value)

useSeoMeta({ title: computed(() => `Chỉnh sửa ${typeLabel.value}`) })

// ─── Data loading ───
const { data, status, error, refresh } = usePolicyDetail(policyType)

const policy = computed(() => data.value?.data)

// ─── Form state ───
const form = reactive({
  title: '',
  content: '' as string | null,
  is_published: false
})
const formInitialized = ref(false)
const isSaving = ref(false)

watch(policy, (val) => {
  if (!val || formInitialized.value) return
  form.title = val.title ?? ''
  form.content = val.content ?? ''
  form.is_published = val.is_published ?? false
  formInitialized.value = true
})

// ─── Image upload ───
async function handleUploadImage(file: File): Promise<string> {
  const res = await apiUploadPolicyImage(file)
  return res.data.url
}

// ─── Save ───
async function handleSave() {
  if (!form.title.trim()) {
    toast.add({ title: 'Vui lòng nhập tiêu đề.', color: 'error' })
    return
  }
  if (!form.content?.trim()) {
    toast.add({ title: 'Vui lòng nhập nội dung.', color: 'error' })
    return
  }

  isSaving.value = true
  try {
    await apiUpdatePolicy(policyType.value, {
      title: form.title,
      content: form.content ?? '',
      is_published: form.is_published
    })
    toast.add({ title: 'Lưu chính sách thành công.', color: 'success' })
    formInitialized.value = false
    await refresh()
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Lưu chính sách thất bại.'), color: 'error' })
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-5 sm:gap-6">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <NuxtLink
        to="/pmc/policies"
        class="p-2 rounded-lg hover:bg-slate-100 transition-colors"
      >
        <UIcon
          name="i-lucide-arrow-left"
          class="size-5 text-slate-600"
        />
      </NuxtLink>
      <div class="min-w-0">
        <h1 class="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
          {{ typeLabel }}
        </h1>
        <p class="text-slate-500 text-sm mt-0.5">
          Chỉnh sửa nội dung {{ typeLabel.toLowerCase() }}.
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="status === 'pending'"
      class="flex flex-col gap-4"
    >
      <div class="h-16 bg-slate-100 rounded-xl animate-pulse" />
      <div class="h-80 bg-slate-100 rounded-xl animate-pulse" />
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
      <!-- Title & Published -->
      <SharedSectionCard
        :title="`Thông tin ${typeLabel.toLowerCase()}`"
      >
        <div class="space-y-4">
          <UFormField
            label="Tiêu đề"
            name="title"
            required
          >
            <UInput
              v-model="form.title"
              placeholder="Nhập tiêu đề..."
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Xuất bản"
            name="is_published"
          >
            <USwitch
              v-model="form.is_published"
              label="Hiển thị trên trang công khai"
            />
          </UFormField>
        </div>
      </SharedSectionCard>

      <!-- Content -->
      <SharedSectionCard title="Nội dung">
        <SharedRichTextEditor
          v-model="form.content"
          placeholder="Nhập nội dung chính sách..."
          min-height="400px"
          :upload-image="handleUploadImage"
        />
      </SharedSectionCard>

      <!-- Actions (sticky bottom) -->
      <div class="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 flex items-center justify-end gap-3 z-10">
        <NuxtLink to="/pmc/policies">
          <UButton
            label="Hủy"
            color="neutral"
            variant="ghost"
          />
        </NuxtLink>
        <UButton
          label="Lưu chính sách"
          icon="i-lucide-save"
          color="primary"
          :loading="isSaving"
          @click="handleSave"
        />
      </div>
    </div>
  </div>
</template>
