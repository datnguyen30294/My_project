<script setup lang="ts">
import type { CatalogItemResource, CatalogItemType } from '#api/generated/laravel'
import type { QuoteLineType } from '~/composables/api/useQuotes'

export interface QuoteLineData {
  line_type: QuoteLineType
  reference_id: number
  name: string
  quantity: number
  unit: string
  unit_price: number
  purchase_price: number
}

export interface QuoteLineEditData extends QuoteLineData {
  key: number
}

const emit = defineEmits<{
  add: [line: QuoteLineData]
  update: [line: QuoteLineEditData]
}>()

const toast = useToast()
const isOpen = ref(false)
const editingKey = ref<number | null>(null)
const isEditMode = computed(() => editingKey.value !== null)

// ─── Line form state ───
const lineForm = reactive({
  line_type: '' as QuoteLineType | '',
  reference_id: undefined as number | undefined,
  name: '',
  quantity: 1,
  unit: '',
  unit_price: 0,
  purchase_price: 0
})

// ─── Catalog creation modal ───
const showCatalogModal = ref(false)
const isCatalogSubmitting = ref(false)
const catalogApiErrors = ref<Record<string, string[]>>({})
const catalogDefaultName = ref('')

// ─── Catalog data ───
const debouncedCatalogSearch = ref('')
const { searchInput: catalogSearch, onSearch: debounceCatalogSearch } = useTableSearch((val) => {
  debouncedCatalogSearch.value = val ?? ''
})

const lineTypeForCatalog = computed<QuoteLineType | undefined>(() => lineForm.line_type || undefined)
const { data: catalogData, status: catalogStatus, execute: fetchCatalog } = useCatalogItemsByType(lineTypeForCatalog, debouncedCatalogSearch)

const catalogOptions = computed(() =>
  (catalogData.value?.data ?? []).map((item: CatalogItemResource) => ({
    label: `${item.name} (${item.unit})`,
    value: item.id,
    item
  }))
)

// ─── Watches ───
let skipLineTypeReset = false
watch(() => lineForm.line_type, (type) => {
  if (skipLineTypeReset) {
    skipLineTypeReset = false
    if (type) fetchCatalog()
    return
  }
  lineForm.reference_id = undefined
  lineForm.name = ''
  lineForm.unit = ''
  lineForm.unit_price = 0
  lineForm.purchase_price = 0
  catalogSearch.value = ''
  if (type) fetchCatalog()
})

watch(() => lineForm.reference_id, (refId) => {
  if (!refId) return
  const found = (catalogData.value?.data ?? []).find((i: CatalogItemResource) => i.id === refId)
  if (found) {
    lineForm.name = found.name
    lineForm.unit = found.unit
    lineForm.unit_price = parseFloat(found.unit_price)
    lineForm.purchase_price = found.purchase_price != null ? parseFloat(found.purchase_price) : 0
  }
})

// ─── Computed ───
const lineFormTotal = computed(() => lineForm.unit_price * lineForm.quantity)

const canAddLine = computed(() => {
  if (!lineForm.line_type || !lineForm.name || lineForm.quantity <= 0 || !lineForm.unit || lineForm.unit_price < 0 || lineForm.purchase_price < 0) {
    return false
  }
  return !!lineForm.reference_id
})

// ─── Actions ───
function open() {
  editingKey.value = null
  lineForm.line_type = 'material'
  lineForm.reference_id = undefined
  lineForm.name = ''
  lineForm.quantity = 1
  lineForm.unit = ''
  lineForm.unit_price = 0
  lineForm.purchase_price = 0
  catalogSearch.value = ''
  fetchCatalog()
  isOpen.value = true
}

function openEdit(line: QuoteLineEditData) {
  editingKey.value = line.key
  skipLineTypeReset = true
  lineForm.line_type = line.line_type
  lineForm.reference_id = line.reference_id
  lineForm.name = line.name
  lineForm.quantity = line.quantity
  lineForm.unit = line.unit
  lineForm.unit_price = line.unit_price
  lineForm.purchase_price = line.purchase_price
  catalogSearch.value = ''
  isOpen.value = true
}

function openCatalogCreate(prefilledName = '') {
  catalogApiErrors.value = {}
  catalogDefaultName.value = prefilledName
  showCatalogModal.value = true
}

async function handleCatalogSubmit(formData: {
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
}) {
  isCatalogSubmitting.value = true
  catalogApiErrors.value = {}
  try {
    const res = await apiCreateCatalogItem({
      ...formData,
      service_category_id: formData.service_category_id != null ? String(formData.service_category_id) : null
    })
    toast.add({ title: 'Tạo danh mục thành công', color: 'success' })
    showCatalogModal.value = false

    // Refresh catalog list and auto-fill the newly created item
    await fetchCatalog()
    const created = res.data
    lineForm.reference_id = created.id
    lineForm.name = created.name
    lineForm.unit = created.unit
    lineForm.unit_price = parseFloat(created.unit_price)
    lineForm.purchase_price = created.purchase_price != null ? parseFloat(created.purchase_price) : 0
  } catch (err: unknown) {
    const validationErrors = getApiValidationErrors(err)
    if (validationErrors) {
      catalogApiErrors.value = validationErrors
    } else {
      toast.add({ title: getApiErrorMessage(err, 'Tạo danh mục thất bại'), color: 'error' })
    }
  } finally {
    isCatalogSubmitting.value = false
  }
}

function handleSubmit() {
  if (!canAddLine.value) return

  const lineData = {
    line_type: lineForm.line_type as QuoteLineType,
    reference_id: lineForm.reference_id!,
    name: lineForm.name,
    quantity: lineForm.quantity,
    unit: lineForm.unit,
    unit_price: lineForm.unit_price,
    purchase_price: lineForm.purchase_price
  }

  if (isEditMode.value) {
    emit('update', { key: editingKey.value!, ...lineData })
  } else {
    emit('add', lineData)
  }
  isOpen.value = false
}

defineExpose({ open, openEdit })
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :title="isEditMode ? 'Sửa dòng báo giá' : 'Thêm dòng báo giá'"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <!-- Loại -->
        <UFormField
          label="Loại"
          required
        >
          <USelect
            v-model="lineForm.line_type"
            :items="QUOTE_LINE_TYPE_OPTIONS"
            placeholder="Chọn loại..."
            class="w-full"
          />
        </UFormField>

        <!-- Hạng mục: chọn từ catalog -->
        <template v-if="lineForm.line_type">
          <UFormField
            label="Hạng mục"
            required
          >
            <USelectMenu
              v-model="lineForm.reference_id"
              v-model:search-term="catalogSearch"
              :items="catalogOptions"
              value-key="value"
              placeholder="Tìm và chọn hạng mục..."
              searchable
              ignore-filter
              :loading="catalogStatus === 'pending'"
              class="w-full"
              @update:search-term="debounceCatalogSearch"
            >
              <template #empty="{ searchTerm }">
                <div class="flex flex-col items-stretch gap-2 p-2">
                  <p class="text-sm text-[var(--ui-text-muted)] text-center">
                    Không tìm thấy hạng mục phù hợp
                  </p>
                  <UButton
                    :label="searchTerm ? `Tạo mới “${searchTerm}”` : 'Tạo mới hạng mục'"
                    icon="i-lucide-plus"
                    color="primary"
                    variant="soft"
                    size="sm"
                    block
                    @click="openCatalogCreate(searchTerm)"
                  />
                </div>
              </template>
            </USelectMenu>
          </UFormField>

          <UButton
            label="Tạo mới danh mục"
            icon="i-lucide-plus"
            variant="link"
            color="primary"
            size="sm"
            class="self-start -mt-2"
            @click="openCatalogCreate(catalogSearch)"
          />
        </template>

        <!-- Số lượng + Đơn vị -->
        <div
          v-if="lineForm.line_type"
          class="grid grid-cols-2 gap-4"
        >
          <UFormField
            label="Số lượng"
            required
          >
            <UInput
              v-model.number="lineForm.quantity"
              type="number"
              :min="1"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Đơn vị"
            required
          >
            <UInput
              v-model="lineForm.unit"
              placeholder="vd: bình, cái, m2..."
              disabled
              class="w-full"
            />
          </UFormField>
        </div>

        <!-- Giá nhập + Đơn giá -->
        <div
          v-if="lineForm.line_type"
          class="grid grid-cols-2 gap-4"
        >
          <UFormField
            label="Giá nhập (đ)"
          >
            <SharedNumberInput
              v-model="lineForm.purchase_price"
              :min="0"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Đơn giá (đ)"
            required
          >
            <SharedNumberInput
              v-model="lineForm.unit_price"
              :min="0"
              class="w-full"
            />
          </UFormField>
        </div>

        <!-- Thành tiền -->
        <div
          v-if="lineForm.unit_price > 0 && lineForm.quantity > 0"
          class="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-2"
        >
          <span class="text-sm text-slate-600">Thành tiền</span>
          <span class="font-bold text-slate-900">{{ formatCurrency(lineFormTotal) }}</span>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2 w-full">
        <UButton
          label="Hủy"
          color="neutral"
          variant="ghost"
          @click="isOpen = false"
        />
        <UButton
          :label="isEditMode ? 'Cập nhật' : 'Thêm'"
          color="primary"
          :icon="isEditMode ? 'i-lucide-check' : 'i-lucide-plus'"
          :disabled="!canAddLine"
          @click="handleSubmit"
        />
      </div>
    </template>
  </UModal>

  <!-- Modal tạo danh mục (dùng chung component) -->
  <CatalogItemFormModal
    v-model:open="showCatalogModal"
    mode="create"
    :default-type="(lineForm.line_type as CatalogItemType) || null"
    :default-name="catalogDefaultName"
    :loading="isCatalogSubmitting"
    :api-errors="catalogApiErrors"
    @submit="handleCatalogSubmit"
  />
</template>
