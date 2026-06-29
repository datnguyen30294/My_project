<script setup lang="ts">
import type { OgTicketCategoryResource } from '#api/generated/laravel'

interface Props {
  open: boolean
  ogTicketId: number
  selectedIds: number[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [boolean]
  'saved': [OgTicketCategoryResource[]]
}>()

const modelOpen = computed({
  get: () => props.open,
  set: (v: boolean) => emit('update:open', v)
})

const toast = useToast()

const categories = ref<OgTicketCategoryResource[]>([])
const selected = ref<Set<number>>(new Set())
const isLoading = ref(false)
const isSubmitting = ref(false)

const newCategoryName = ref('')
const creatingNew = ref(false)

const editingId = ref<number | null>(null)
const editingName = ref('')

async function loadCategories() {
  isLoading.value = true
  try {
    const res = await apiListOgTicketCategories({ per_page: 200, sort_by: 'sort_order', sort_direction: 'asc' })
    categories.value = res.data
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Không tải được danh sách danh mục'), color: 'error' })
  } finally {
    isLoading.value = false
  }
}

watch(
  () => props.open,
  (v) => {
    if (v) {
      selected.value = new Set(props.selectedIds)
      editingId.value = null
      newCategoryName.value = ''
      loadCategories()
    }
  }
)

function toggle(id: number) {
  const next = new Set(selected.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  selected.value = next
}

async function handleCreate() {
  const name = newCategoryName.value.trim()
  if (!name) return
  creatingNew.value = true
  try {
    const res = await apiCreateOgTicketCategory({ name })
    categories.value = [...categories.value, res.data]
    selected.value = new Set([...selected.value, res.data.id])
    newCategoryName.value = ''
    toast.add({ title: 'Thêm danh mục thành công', color: 'success' })
  } catch (err) {
    const validation = getApiValidationErrors(err)
    const msg = validation?.name?.[0] ?? getApiErrorMessage(err, 'Thêm danh mục thất bại')
    toast.add({ title: msg, color: 'error' })
  } finally {
    creatingNew.value = false
  }
}

function startEdit(cat: OgTicketCategoryResource) {
  editingId.value = cat.id
  editingName.value = cat.name
}

function cancelEdit() {
  editingId.value = null
  editingName.value = ''
}

async function handleSaveEdit(id: number) {
  const name = editingName.value.trim()
  if (!name) return
  try {
    const res = await apiUpdateOgTicketCategory(id, { name })
    categories.value = categories.value.map(c => c.id === id ? res.data : c)
    editingId.value = null
    toast.add({ title: 'Cập nhật danh mục thành công', color: 'success' })
  } catch (err) {
    const validation = getApiValidationErrors(err)
    const msg = validation?.name?.[0] ?? getApiErrorMessage(err, 'Cập nhật thất bại')
    toast.add({ title: msg, color: 'error' })
  }
}

async function handleDelete(cat: OgTicketCategoryResource) {
  if (!confirm(`Xoá danh mục "${cat.name}"?`)) return
  try {
    await apiDeleteOgTicketCategory(cat.id)
    categories.value = categories.value.filter(c => c.id !== cat.id)
    const next = new Set(selected.value)
    next.delete(cat.id)
    selected.value = next
    toast.add({ title: 'Đã xoá danh mục', color: 'success' })
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Không thể xoá danh mục'), color: 'error' })
  }
}

async function handleSubmit() {
  isSubmitting.value = true
  try {
    await apiSyncOgTicketCategories(props.ogTicketId, Array.from(selected.value))
    const finalList = categories.value.filter(c => selected.value.has(c.id))
    toast.add({ title: 'Lưu danh mục thành công', color: 'success' })
    emit('saved', finalList)
    emit('update:open', false)
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Lưu danh mục thất bại'), color: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

function handleClose() {
  emit('update:open', false)
}
</script>

<template>
  <UModal
    v-model:open="modelOpen"
    title="Quản lý danh mục"
    description="Chọn hoặc tạo các danh mục mô tả yêu cầu."
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <!-- Add new -->
        <div class="flex gap-2">
          <UInput
            v-model="newCategoryName"
            placeholder="Tên danh mục mới"
            class="flex-1"
            :disabled="creatingNew"
            @keyup.enter="handleCreate"
          />
          <UButton
            icon="i-lucide-plus"
            :loading="creatingNew"
            :disabled="!newCategoryName.trim()"
            @click="handleCreate"
          >
            Thêm
          </UButton>
        </div>

        <!-- List -->
        <div
          v-if="isLoading"
          class="py-8 text-center text-slate-500 text-sm"
        >
          Đang tải...
        </div>
        <div
          v-else-if="categories.length === 0"
          class="py-8 text-center text-slate-500 text-sm"
        >
          Chưa có danh mục. Thêm danh mục đầu tiên phía trên.
        </div>
        <div
          v-else
          class="max-h-96 overflow-y-auto divide-y divide-slate-100 rounded-lg border border-slate-200"
        >
          <div
            v-for="cat in categories"
            :key="cat.id"
            class="flex items-center gap-3 px-3 py-2"
          >
            <UCheckbox
              :model-value="selected.has(cat.id)"
              @update:model-value="toggle(cat.id)"
            />

            <div class="flex-1 min-w-0">
              <UInput
                v-if="editingId === cat.id"
                v-model="editingName"
                size="sm"
                autofocus
                @keyup.enter="handleSaveEdit(cat.id)"
                @keyup.esc="cancelEdit"
              />
              <span
                v-else
                class="text-sm truncate"
              >{{ cat.name }}</span>
            </div>

            <div class="flex items-center gap-1">
              <template v-if="editingId === cat.id">
                <UButton
                  icon="i-lucide-check"
                  size="xs"
                  color="success"
                  variant="ghost"
                  @click="handleSaveEdit(cat.id)"
                />
                <UButton
                  icon="i-lucide-x"
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  @click="cancelEdit"
                />
              </template>
              <template v-else>
                <UButton
                  icon="i-lucide-pencil"
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  @click="startEdit(cat)"
                />
                <UButton
                  icon="i-lucide-trash-2"
                  size="xs"
                  color="error"
                  variant="ghost"
                  @click="handleDelete(cat)"
                />
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2 w-full">
        <UButton
          color="neutral"
          variant="ghost"
          :disabled="isSubmitting"
          @click="handleClose"
        >
          Huỷ
        </UButton>
        <UButton
          :loading="isSubmitting"
          @click="handleSubmit"
        >
          Lưu
        </UButton>
      </div>
    </template>
  </UModal>
</template>
