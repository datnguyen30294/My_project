<script setup lang="ts">
import type { OrganizationItem } from '~/composables/api/useOrganizations'
import type { PartnerListItem, CreatePartnerPayload, PartnerStatusValue } from '~/composables/api/usePartners'

interface Props {
  open: boolean
  mode: 'create' | 'edit'
  item?: PartnerListItem | null
  /** Initial project_ids when editing — fetched from detail in the parent. */
  initialProjectIds?: number[]
  loading?: boolean
  apiErrors?: Record<string, string[]>
}

const props = withDefaults(defineProps<Props>(), {
  item: null,
  initialProjectIds: () => [],
  loading: false,
  apiErrors: () => ({})
})

const emit = defineEmits<{
  'update:open': [boolean]
  'submit': [CreatePartnerPayload & { id?: number }]
}>()

const formState = reactive({
  id: undefined as number | undefined,
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
  owner_tenant_id: '' as string,
  project_ids: [] as number[]
})

const newCategory = ref('')

// --- Tenant + Projects lookup ---
const orgParams = reactive({ search: '' })
const { data: orgsData, status: orgsStatus } = usePlatformOrganizationList(orgParams)
const tenantOptions = computed(() =>
  (orgsData.value?.data ?? []).map((o: OrganizationItem) => ({
    label: `${o.id} — ${o.name}`,
    value: o.id
  }))
)

const projectOptions = ref<{ label: string, value: number }[]>([])
const projectsLoading = ref(false)

async function loadProjects(tenantId: string) {
  if (!tenantId) {
    projectOptions.value = []
    return
  }
  projectsLoading.value = true
  try {
    const projects = await apiGetOrganizationProjects(tenantId)
    projectOptions.value = projects.map(p => ({ label: p.name, value: Number(p.id) }))
  } finally {
    projectsLoading.value = false
  }
}

watch(
  () => formState.owner_tenant_id,
  async (newId, oldId) => {
    if (newId === oldId) return
    // When tenant changes after initial prefill, drop project_ids (different
    // tenant = different project set). Skip clearing on first prefill in edit
    // mode — that case is handled inside the open watcher.
    if (oldId !== '' && oldId !== undefined) {
      formState.project_ids = []
    }
    await loadProjects(newId)
  }
)

watch(
  () => props.open,
  async (isOpen) => {
    if (!isOpen) return
    if (props.mode === 'edit' && props.item) {
      formState.id = props.item.id
      formState.slug = props.item.slug
      formState.name = props.item.name
      formState.display_name = props.item.display_name ?? ''
      formState.status = props.item.status.value
      formState.custom_domain = props.item.custom_domain ?? ''
      formState.categories = [...(props.item.categories ?? [])]
      // owner_email/phone/description are detail-only; left empty in list payload
      formState.owner_email = ''
      formState.owner_phone = ''
      formState.logo_url = props.item.logo_url ?? ''
      formState.description = ''
      formState.owner_tenant_id = props.item.owner_tenant_id ?? ''
      formState.project_ids = [...props.initialProjectIds]
      if (formState.owner_tenant_id) {
        await loadProjects(formState.owner_tenant_id)
      }
    } else {
      formState.id = undefined
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
      formState.owner_tenant_id = ''
      formState.project_ids = []
      projectOptions.value = []
    }
    newCategory.value = ''
  }
)

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
  const ownerTenantId = formState.owner_tenant_id.trim()
  const payload: CreatePartnerPayload & { id?: number } = {
    ...(formState.id ? { id: formState.id } : {}),
    ...(props.mode === 'create' ? { slug: formState.slug.trim().toLowerCase() } : { slug: formState.slug }),
    name: formState.name.trim(),
    display_name: formState.display_name.trim() || null,
    status: formState.status,
    custom_domain: formState.custom_domain.trim() || null,
    categories: formState.categories,
    owner_email: formState.owner_email.trim(),
    owner_phone: formState.owner_phone.trim() || null,
    logo_url: formState.logo_url.trim() || null,
    description: formState.description.trim() || null,
    owner_tenant_id: ownerTenantId || null,
    project_ids: ownerTenantId ? [...formState.project_ids] : []
  }
  emit('submit', payload)
}
</script>

<template>
  <SharedCrudBaseFormModal
    :open="open"
    :mode="mode"
    :loading="loading"
    :titles="{ create: 'Tạo partner', edit: 'Sửa partner' }"
    @update:open="emit('update:open', $event)"
    @submit="handleSubmit"
  >
    <UFormField
      v-if="mode === 'create'"
      label="Slug (định danh URL)"
      name="slug"
      required
      help="Chữ thường, số, gạch ngang. Dùng làm subdomain ở resi_mart. Không đổi được sau khi tạo."
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
    >
      <UInput
        :model-value="formState.slug"
        disabled
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="Tên partner"
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
      help="Tên hiển thị trên storefront. Bỏ trống = dùng Tên partner."
    >
      <UInput
        v-model="formState.display_name"
        class="w-full"
      />
      <SharedCrudFormFieldError :errors="apiErrors.display_name" />
    </UFormField>

    <UFormField
      label="Email chủ sở hữu"
      name="owner_email"
      :required="mode === 'create'"
      help="Email dùng để gửi credential cho partner login vào resi_mart."
    >
      <UInput
        v-model="formState.owner_email"
        type="email"
        :placeholder="mode === 'edit' ? 'Để trống nếu không đổi' : 'vd: admin@hoaquaabc.vn'"
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

    <UFormField
      label="Categories"
      name="categories"
      help="Phân loại vendor (vd: hoa_qua, giat_la, sua_chua). Enter để thêm."
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
          Chưa có category nào.
        </p>
        <SharedCrudFormFieldError :errors="apiErrors.categories" />
      </div>
    </UFormField>

    <UFormField
      label="Custom domain (tuỳ chọn)"
      name="custom_domain"
      help="CHỈ hostname (không http://, không dấu /). Vd: shop.hoaquaabc.vn hoặc hoaqua.localhost (dev)."
    >
      <UInput
        v-model="formState.custom_domain"
        placeholder="vd: shop.hoaquaabc.vn"
        class="w-full"
      />
      <SharedCrudFormFieldError :errors="apiErrors.custom_domain" />
    </UFormField>

    <UFormField
      label="Logo URL"
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
      label="Mô tả (tuỳ chọn)"
      name="description"
    >
      <UTextarea
        v-model="formState.description"
        :rows="3"
        class="w-full"
      />
      <SharedCrudFormFieldError :errors="apiErrors.description" />
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
      label="Gán cho tenant PMC (tuỳ chọn)"
      name="owner_tenant_id"
      help="Để trống = vendor central (chưa gán tenant). Khi gán tenant, vendor sẽ hiện trong list của tenant đó và phục vụ các dự án đã chọn."
    >
      <USelectMenu
        v-model="formState.owner_tenant_id"
        :items="tenantOptions"
        value-key="value"
        searchable
        :loading="orgsStatus === 'pending'"
        placeholder="Chọn PMC tenant..."
        class="w-full"
      />
      <SharedCrudFormFieldError :errors="apiErrors.owner_tenant_id" />
    </UFormField>

    <UFormField
      v-if="formState.owner_tenant_id"
      label="Dự án vendor được phục vụ"
      name="project_ids"
      required
      help="Vendor sẽ được hiển thị trên storefront của các dự án đã chọn trong tenant này."
    >
      <USelectMenu
        v-model="formState.project_ids"
        :items="projectOptions"
        value-key="value"
        multiple
        searchable
        :loading="projectsLoading"
        placeholder="Chọn dự án..."
        class="w-full"
      />
      <SharedCrudFormFieldError :errors="apiErrors.project_ids" />
      <SharedCrudFormFieldError :errors="apiErrors['project_ids.0']" />
    </UFormField>
  </SharedCrudBaseFormModal>
</template>
