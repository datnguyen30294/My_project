<script setup lang="ts">
import type { CatalogItemResource, CatalogItemType } from '#api/generated/laravel'

interface Props {
  open: boolean
  mode: 'create' | 'edit'
  /** Pre-selected type when creating from a specific tab */
  defaultType?: CatalogItemType | null
  /** Pre-filled name when creating (e.g. from a search term) */
  defaultName?: string
  item?: CatalogItemResource | null
  loading?: boolean
  apiErrors?: Record<string, string[]>
}

const props = withDefaults(defineProps<Props>(), {
  defaultType: null,
  defaultName: '',
  item: null,
  loading: false,
  apiErrors: () => ({})
})

const emit = defineEmits<{
  'update:open': [boolean]
  'submit': [data: {
    type: CatalogItemType
    code: string
    name: string
    unit: string
    unit_price: number
    purchase_price: number | null
    commission_rate: number | null
    supplier_id: number | null
    service_category_id: number | null
    description: string | null
    content: string | null
    sort_order: number
    price_note: string | null
    is_published: boolean
    is_featured: boolean
  }]
  'image-changed': []
}>()

const typeOptions = [
  { label: 'Vật tư', value: 'material' },
  { label: 'Dịch vụ', value: 'service' },
  { label: 'Dịch vụ tùy chọn', value: 'adhoc' }
]

const formState = reactive({
  type: 'material' as CatalogItemType,
  code: '',
  name: '',
  unit: '',
  unit_price: 0,
  purchase_price: null as number | null,
  commission_rate: null as number | null,
  supplier_id: null as number | null,
  service_category_id: null as number | null,
  description: null as string | null,
  content: null as string | null,
  sort_order: 0,
  price_note: null as string | null,
  is_published: false,
  is_featured: false
})

// --- Service Categories for dropdown ---
const { data: categoriesData } = useServiceCategoryList(computed(() => ({ per_page: SELECT_ALL_PER_PAGE, status: 'active' })))
const categoryOptions = computed(() =>
  (categoriesData.value?.data ?? []).map(c => ({ label: c.name, value: c.id }))
)

const selectedCategoryId = computed({
  get: () => formState.service_category_id ?? undefined,
  set: (val: number | undefined) => { formState.service_category_id = val ?? null }
})

const isMaterial = computed(() => formState.type === 'material')
const isService = computed(() => formState.type === 'service')
const isAdhoc = computed(() => formState.type === 'adhoc')

const modalTitle = computed(() =>
  props.mode === 'create' ? 'Thêm danh mục hàng' : 'Sửa danh mục hàng'
)

// Auto-fill commission_rate from supplier default when selecting NCC
watch(
  () => formState.supplier_id,
  async (supplierId) => {
    if (!supplierId || props.mode === 'edit') return
    try {
      const res = await apiGetCatalogSupplier(supplierId)
      if (res.data.commission_rate) {
        formState.commission_rate = Number(res.data.commission_rate)
      }
    } catch { /* ignore */ }
  }
)

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return
    if (props.mode === 'edit' && props.item) {
      formState.type = props.item.type.value as CatalogItemType
      formState.code = props.item.code
      formState.name = props.item.name
      formState.unit = props.item.unit
      formState.unit_price = Number(props.item.unit_price)
      formState.purchase_price = props.item.purchase_price ? Number(props.item.purchase_price) : null
      formState.commission_rate = props.item.commission_rate ? Number(props.item.commission_rate) : null
      formState.supplier_id = props.item.supplier?.id ?? null
      formState.service_category_id = props.item.service_category?.id ?? null
      formState.description = props.item.description || null
      formState.content = props.item.content || null
      formState.sort_order = props.item.sort_order ?? 0
      formState.price_note = props.item.price_note || null
      formState.is_published = props.item.is_published ?? false
      formState.is_featured = props.item.is_featured ?? false
    } else {
      formState.type = props.defaultType ?? 'material'
      formState.code = ''
      formState.name = props.defaultName ?? ''
      formState.unit = ''
      formState.unit_price = 0
      formState.purchase_price = null
      formState.commission_rate = null
      formState.supplier_id = null
      formState.service_category_id = null
      formState.description = null
      formState.content = null
      formState.sort_order = 0
      formState.price_note = null
      formState.is_published = false
      formState.is_featured = false
    }
  }
)

// --- Image upload (edit only) ---
const { isImageLoading, handleImageUpload, handleImageDelete } = useCatalogItemImage(
  computed(() => props.item?.id),
  () => emit('image-changed')
)
</script>

<template>
  <UModal
    :open="open"
    :title="modalTitle"
    :ui="{ content: 'sm:max-w-3xl' }"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <div class="space-y-5">
        <!-- Image upload (edit only) -->
        <div v-if="mode === 'edit' && item">
          <UFormField
            label="Hình ảnh"
            name="image"
          >
            <SharedImageUpload
              :current-url="item.image_url"
              :alt="item.name"
              :loading="isImageLoading"
              @upload="handleImageUpload"
              @delete="handleImageDelete"
            />
          </UFormField>
        </div>

        <!-- Section: Thông tin cơ bản -->
        <fieldset>
          <legend class="text-sm font-semibold text-[var(--ui-text-highlighted)] mb-3">
            Thông tin cơ bản
          </legend>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField
              label="Loại"
              name="type"
              required
            >
              <USelect
                v-model="formState.type"
                :items="typeOptions"
                value-key="value"
                class="w-full"
                :disabled="mode === 'edit'"
              />
              <SharedCrudFormFieldError :errors="apiErrors.type" />
            </UFormField>

            <UFormField
              v-if="!isAdhoc"
              label="Mã"
              name="code"
              required
            >
              <UInput
                v-model="formState.code"
                :placeholder="isMaterial ? 'VD: VT-001' : 'VD: DV-001'"
                class="w-full"
                :disabled="mode === 'edit'"
              />
              <SharedCrudFormFieldError :errors="apiErrors.code" />
            </UFormField>

            <UFormField
              label="Tên"
              name="name"
              required
              class="sm:col-span-2"
            >
              <UInput
                v-model="formState.name"
                :placeholder="isMaterial ? 'VD: Ống nước PVC D21' : 'VD: Dịch vụ sơn tường'"
                class="w-full"
              />
              <SharedCrudFormFieldError :errors="apiErrors.name" />
            </UFormField>

            <UFormField
              label="Đơn vị"
              name="unit"
              required
            >
              <UInput
                v-model="formState.unit"
                :placeholder="isMaterial ? 'VD: m, cái, kg' : 'VD: lần, giờ, ngày'"
                class="w-full"
              />
              <SharedCrudFormFieldError :errors="apiErrors.unit" />
            </UFormField>

            <UFormField
              v-if="isService"
              label="Danh mục dịch vụ"
              name="service_category_id"
              required
            >
              <USelect
                v-model="selectedCategoryId"
                :items="categoryOptions"
                value-key="value"
                placeholder="Chọn danh mục"
                class="w-full"
              />
              <SharedCrudFormFieldError :errors="apiErrors.service_category_id" />
            </UFormField>
          </div>
        </fieldset>

        <USeparator />

        <!-- Section: Giá -->
        <fieldset>
          <legend class="text-sm font-semibold text-[var(--ui-text-highlighted)] mb-3">
            Thông tin giá
          </legend>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField
              :label="isMaterial ? 'Giá bán' : 'Đơn giá'"
              name="unit_price"
              required
            >
              <SharedNumberInput
                v-model="formState.unit_price"
                placeholder="VD: 25.000"
                :min="0"
                class="w-full"
              />
              <SharedCrudFormFieldError :errors="apiErrors.unit_price" />
            </UFormField>

            <UFormField
              v-if="isMaterial"
              label="Giá mua"
              name="purchase_price"
            >
              <SharedNumberInput
                v-model="formState.purchase_price"
                placeholder="VD: 18.000"
                :min="0"
                class="w-full"
              />
              <SharedCrudFormFieldError :errors="apiErrors.purchase_price" />
            </UFormField>

            <UFormField
              v-if="isService"
              label="Ghi chú giá"
              name="price_note"
              class="sm:col-span-2"
            >
              <UInput
                v-model="formState.price_note"
                placeholder="VD: từ 500.000đ/lần, liên hệ báo giá"
                class="w-full"
              />
              <SharedCrudFormFieldError :errors="apiErrors.price_note" />
            </UFormField>
          </div>
        </fieldset>

        <!-- Section: Nhà cung cấp (chỉ Vật tư) -->
        <template v-if="isMaterial">
          <USeparator />

          <fieldset>
            <legend class="text-sm font-semibold text-[var(--ui-text-highlighted)] mb-3">
              Nhà cung cấp
            </legend>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormField
                label="Nhà cung cấp"
                name="supplier_id"
              >
                <SharedCatalogSupplierSelect v-model="formState.supplier_id" />
                <SharedCrudFormFieldError :errors="apiErrors.supplier_id" />
              </UFormField>

              <UFormField
                label="Hoa Hồng (%)"
                name="commission_rate"
              >
                <UInput
                  v-model.number="formState.commission_rate"
                  type="number"
                  placeholder="VD: 5"
                  :min="0"
                  :max="100"
                  step="0.01"
                  class="w-full"
                />
                <SharedCrudFormFieldError :errors="apiErrors.commission_rate" />
                <template #help>
                  <span class="text-xs text-[var(--ui-text-dimmed)] italic">Bỏ trống sẽ lấy từ cài đặt nhà cung cấp</span>
                </template>
              </UFormField>
            </div>
          </fieldset>
        </template>

        <USeparator />

        <!-- Section: Mô tả ngắn -->
        <UFormField
          label="Mô tả ngắn"
          name="description"
          :description="isService ? 'Hiển thị trên trang danh sách dịch vụ (listing)' : undefined"
        >
          <UTextarea
            v-model="formState.description"
            placeholder="Mô tả ngắn (tuỳ chọn)"
            :rows="3"
            class="w-full"
          />
        </UFormField>

        <!-- Section: Nội dung chi tiết (Service only) -->
        <template v-if="isService">
          <USeparator />

          <UFormField
            label="Nội dung chi tiết"
            name="content"
            description="Bài viết chi tiết hiển thị trên trang dịch vụ (dạng blog)"
          >
            <SharedRichTextEditor
              v-model="formState.content"
              placeholder="Viết nội dung chi tiết về dịch vụ..."
              min-height="250px"
            />
          </UFormField>
        </template>

        <USeparator />

        <!-- Section: Hiển thị & Sắp xếp -->
        <fieldset>
          <legend class="text-sm font-semibold text-[var(--ui-text-highlighted)] mb-3">
            Hiển thị
          </legend>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField
              label="Hiển thị cho cư dân"
              name="is_published"
              description="Bật để hiển thị trên trang dành cho cư dân"
            >
              <USwitch
                v-model="formState.is_published"
                color="success"
              />
            </UFormField>

            <UFormField
              v-if="isService"
              label="Dịch vụ nổi bật"
              name="is_featured"
              description="Đánh dấu ưu tiên hiển thị trên trang chính"
            >
              <USwitch
                v-model="formState.is_featured"
                color="warning"
              />
            </UFormField>

            <UFormField
              v-if="isService"
              label="Thứ tự sắp xếp"
              name="sort_order"
              description="Số nhỏ hơn hiển thị trước"
            >
              <UInput
                v-model.number="formState.sort_order"
                type="number"
                :min="0"
                class="w-full"
              />
              <SharedCrudFormFieldError :errors="apiErrors.sort_order" />
            </UFormField>
          </div>
        </fieldset>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          color="neutral"
          variant="outline"
          label="Huỷ"
          @click="emit('update:open', false)"
        />
        <UButton
          color="primary"
          :icon="loading ? 'i-lucide-loader-circle' : 'i-lucide-check'"
          :label="loading ? 'Đang lưu...' : 'Lưu'"
          :disabled="loading"
          @click="emit('submit', { ...formState })"
        />
      </div>
    </template>
  </UModal>
</template>
