<script setup lang="ts">
import type { CreatePartnerPayload, PartnerDetail, PartnerStatusValue } from '~/composables/api/usePartners'

interface Props {
  mode: 'create' | 'edit'
  /** Initial values when editing. Required in edit mode. */
  item?: PartnerDetail | null
  loading?: boolean
  apiErrors?: Record<string, string[]>
  /** Override default labels (e.g. "Tạo partner" vs "Đăng ký vendor"). */
  submitLabel?: string
  cancelTo: string
}

const props = withDefaults(defineProps<Props>(), {
  item: null,
  loading: false,
  apiErrors: () => ({}),
  submitLabel: undefined
})

const emit = defineEmits<{
  submit: [CreatePartnerPayload]
}>()

const formState = reactive({
  slug: '',
  name: '',
  display_name: '',
  status: 'active' as PartnerStatusValue,
  custom_domain: '',
  categories: [] as string[],
  owner_email: '',
  owner_phone: '',
  logo_url: '',
  description: '',
  project_ids: [] as number[]
})

const newCategory = ref('')

// Load project list for multi-select (max 100 — tenant rarely has more)
const { data: projectsData, status: projectsStatus } = useProjectList(
  computed(() => ({ per_page: SELECT_ALL_PER_PAGE }))
)
const projectOptions = computed(() =>
  (projectsData.value?.data ?? []).map(p => ({ label: p.name, value: p.id }))
)

function reset() {
  if (props.mode === 'edit' && props.item) {
    formState.slug = props.item.slug
    formState.name = props.item.name
    formState.display_name = props.item.display_name ?? ''
    formState.status = props.item.status.value
    formState.custom_domain = props.item.custom_domain ?? ''
    formState.categories = [...(props.item.categories ?? [])]
    formState.owner_email = props.item.owner_email ?? ''
    formState.owner_phone = props.item.owner_phone ?? ''
    formState.logo_url = props.item.logo_url ?? ''
    formState.description = props.item.description ?? ''
    formState.project_ids = [...(props.item.project_ids ?? [])]
  } else {
    formState.slug = ''
    formState.name = ''
    formState.display_name = ''
    formState.status = 'active'
    formState.custom_domain = ''
    formState.categories = []
    formState.owner_email = ''
    formState.owner_phone = ''
    formState.logo_url = ''
    formState.description = ''
    formState.project_ids = []
  }
  newCategory.value = ''
}

watch(() => props.item, reset, { immediate: true })
watch(() => props.mode, reset)

function addCategory() {
  const value = newCategory.value.trim().toLowerCase().replace(/\s+/g, '_')
  if (!value) return
  if (formState.categories.includes(value)) {
    newCategory.value = ''
    return
  }
  formState.categories.push(value)
  newCategory.value = ''
}

function removeCategory(category: string) {
  formState.categories = formState.categories.filter(c => c !== category)
}

function handleSubmit() {
  const payload: CreatePartnerPayload = {
    slug: props.mode === 'create'
      ? formState.slug.trim().toLowerCase()
      : formState.slug,
    name: formState.name.trim(),
    display_name: formState.display_name.trim() || null,
    status: formState.status,
    custom_domain: formState.custom_domain.trim() || null,
    categories: formState.categories,
    owner_email: formState.owner_email.trim(),
    owner_phone: formState.owner_phone.trim() || null,
    logo_url: formState.logo_url.trim() || null,
    description: formState.description.trim() || null,
    project_ids: [...formState.project_ids]
  }
  emit('submit', payload)
}

const computedSubmitLabel = computed(() =>
  props.submitLabel ?? (props.mode === 'create' ? 'Đăng ký vendor' : 'Lưu thay đổi')
)
</script>

<template>
  <form
    class="flex flex-col gap-6 w-full"
    @submit.prevent="handleSubmit"
  >
    <SharedSectionCard title="Thông tin cơ bản">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormField
          v-if="mode === 'create'"
          label="Slug (định danh URL)"
          name="slug"
          required
          help="Chữ thường, số, gạch ngang. Dùng làm subdomain. Không sửa được sau khi tạo."
        >
          <UInput
            v-model="formState.slug"
            placeholder="vd: hoa-qua-abc"
            class="w-full"
          />
          <SharedCrudFormFieldError :errors="apiErrors.slug" />
        </UFormField>

        <UFormField
          v-else
          label="Slug"
          name="slug"
          help="Slug không thể đổi sau khi vendor đã đăng ký."
        >
          <UInput
            :model-value="formState.slug"
            disabled
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Trạng thái"
          name="status"
        >
          <USelect
            v-model="formState.status"
            :items="[
              { label: 'Đang hoạt động', value: 'active' },
              { label: 'Tạm khoá', value: 'suspended' },
              { label: 'Đã chấm dứt', value: 'terminated' }
            ]"
            class="w-full"
          />
          <SharedCrudFormFieldError :errors="apiErrors.status" />
        </UFormField>

        <UFormField
          label="Tên đầy đủ"
          name="name"
          required
        >
          <UInput
            v-model="formState.name"
            placeholder="VD: Hoa Quả Sạch ABC"
            class="w-full"
          />
          <SharedCrudFormFieldError :errors="apiErrors.name" />
        </UFormField>

        <UFormField
          label="Tên hiển thị (tuỳ chọn)"
          name="display_name"
          help="Bỏ trống = dùng tên đầy đủ."
        >
          <UInput
            v-model="formState.display_name"
            class="w-full"
          />
          <SharedCrudFormFieldError :errors="apiErrors.display_name" />
        </UFormField>
      </div>
    </SharedSectionCard>

    <SharedSectionCard title="Liên hệ chủ sở hữu">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormField
          label="Email chủ sở hữu"
          name="owner_email"
          required
          help="Email nhận thông báo từ marketplace."
        >
          <UInput
            v-model="formState.owner_email"
            type="email"
            placeholder="vd: admin@hoaquaabc.vn"
            class="w-full"
          />
          <SharedCrudFormFieldError :errors="apiErrors.owner_email" />
        </UFormField>

        <UFormField
          label="SĐT chủ sở hữu (tuỳ chọn)"
          name="owner_phone"
        >
          <UInput
            v-model="formState.owner_phone"
            class="w-full"
          />
          <SharedCrudFormFieldError :errors="apiErrors.owner_phone" />
        </UFormField>
      </div>
    </SharedSectionCard>

    <SharedSectionCard title="Storefront">
      <div class="flex flex-col gap-4">
        <UFormField
          label="Custom domain (tuỳ chọn)"
          name="custom_domain"
          help="CHỈ hostname (không http://, không dấu /). Vd: shop.hoaquaabc.vn."
        >
          <UInput
            v-model="formState.custom_domain"
            placeholder="vd: shop.hoaquaabc.vn"
            class="w-full"
          />
          <SharedCrudFormFieldError :errors="apiErrors.custom_domain" />
        </UFormField>

        <UFormField
          label="Logo URL (tuỳ chọn)"
          name="logo_url"
        >
          <UInput
            v-model="formState.logo_url"
            type="url"
            placeholder="https://..."
            class="w-full"
          />
          <SharedCrudFormFieldError :errors="apiErrors.logo_url" />
        </UFormField>

        <UFormField
          label="Danh mục"
          name="categories"
          help="Phân loại vendor (vd: hoa_qua, giat_la, sua_chua). Enter để thêm tag."
        >
          <div class="space-y-2">
            <div class="flex gap-2">
              <UInput
                v-model="newCategory"
                placeholder="vd: hoa_qua"
                class="flex-1"
                @keydown.enter.prevent="addCategory"
              />
              <UButton
                icon="i-lucide-plus"
                color="neutral"
                variant="outline"
                label="Thêm"
                :disabled="!newCategory.trim()"
                @click="addCategory"
              />
            </div>
            <div
              v-if="formState.categories.length"
              class="flex flex-wrap gap-2"
            >
              <UBadge
                v-for="cat in formState.categories"
                :key="cat"
                color="info"
                variant="subtle"
                class="gap-1 pr-1"
              >
                {{ cat }}
                <button
                  type="button"
                  class="ml-1 rounded hover:bg-black/10 p-0.5"
                  @click="removeCategory(cat)"
                >
                  <UIcon
                    name="i-lucide-x"
                    class="size-3"
                  />
                </button>
              </UBadge>
            </div>
            <p
              v-else
              class="text-sm text-gray-400"
            >
              Chưa có danh mục nào.
            </p>
            <SharedCrudFormFieldError :errors="apiErrors.categories" />
          </div>
        </UFormField>

        <UFormField
          label="Mô tả (tuỳ chọn)"
          name="description"
        >
          <UTextarea
            v-model="formState.description"
            :rows="4"
            class="w-full"
          />
          <SharedCrudFormFieldError :errors="apiErrors.description" />
        </UFormField>
      </div>
    </SharedSectionCard>

    <SharedSectionCard title="Dự án phục vụ">
      <UFormField
        label="Chọn dự án vendor được phép phục vụ"
        name="project_ids"
        help="Vendor sẽ được hiển thị trên storefront của các dự án đã chọn. Bỏ trống = vendor chỉ tồn tại trên marketplace, chưa gắn dự án nào."
      >
        <USelectMenu
          v-model="formState.project_ids"
          :items="projectOptions"
          value-key="value"
          multiple
          searchable
          :loading="projectsStatus === 'pending'"
          placeholder="Chọn dự án..."
          class="w-full"
        />
        <SharedCrudFormFieldError :errors="apiErrors.project_ids" />
        <SharedCrudFormFieldError :errors="apiErrors['project_ids.0']" />
      </UFormField>
    </SharedSectionCard>

    <div class="flex items-center justify-end gap-2">
      <UButton
        label="Huỷ"
        color="neutral"
        variant="ghost"
        :to="cancelTo"
        :disabled="loading"
      />
      <UButton
        type="submit"
        :label="computedSubmitLabel"
        icon="i-lucide-check"
        color="primary"
        :loading="loading"
      />
    </div>
  </form>
</template>
