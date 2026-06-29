<script setup lang="ts">
import type { CatalogItemResource, CatalogItemType } from '#api/generated/laravel'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const id = computed(() => Number(route.params.id))

const { data, status, error, refresh } = useCatalogItemDetail(id)

const item = computed(() => data.value?.data ?? null)
const isMaterial = computed(() => item.value?.type.value === 'material')
const isService = computed(() => item.value?.type.value === 'service')

// --- CRUD ---
const crud = useCrudModals<CatalogItemResource>()
const { showFormModal, formMode, editTarget, formApiErrors, openEditModal, showDeleteModal, deleteTarget, openDeleteModal } = crud
const { isSubmitting: isUpdating, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, refresh)

function handleFormSubmit(formData: {
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
}) {
  const categoryId = formData.service_category_id != null ? String(formData.service_category_id) : null
  submitForm(
    null,
    () => apiUpdateCatalogItem(editTarget.value!.id, {
      code: formData.code,
      name: formData.name,
      unit: formData.unit,
      unit_price: formData.unit_price,
      purchase_price: formData.purchase_price,
      commission_rate: formData.commission_rate,
      supplier_id: formData.supplier_id,
      service_category_id: categoryId,
      description: formData.description,
      content: formData.content,
      sort_order: formData.sort_order,
      price_note: formData.price_note,
      is_published: formData.is_published,
      is_featured: formData.is_featured
    }),
    { update: 'Cập nhật danh mục hàng thành công' }
  )
}

// --- Image upload ---
const { isImageLoading, handleImageUpload, handleImageDelete } = useCatalogItemImage(
  computed(() => item.value?.id),
  () => refresh()
)

// --- Gallery ---
const galleryInput = ref<HTMLInputElement>()
const isGalleryLoading = ref(false)
const toast = useToast()

async function handleGalleryDelete(imageId: number) {
  if (!item.value) return
  isGalleryLoading.value = true
  try {
    await apiDeleteCatalogItemGalleryImage(item.value.id, imageId)
    toast.add({ title: 'Xóa ảnh thành công', color: 'success' })
    await refresh()
  } catch {
    toast.add({ title: 'Xóa ảnh thất bại', color: 'error' })
  } finally {
    isGalleryLoading.value = false
  }
}

async function onGalleryFilesSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  if (!files.length || !item.value) return
  isGalleryLoading.value = true
  try {
    await apiUploadCatalogItemGallery(item.value.id, files)
    toast.add({ title: 'Tải ảnh thành công', color: 'success' })
    await refresh()
  } catch {
    toast.add({ title: 'Tải ảnh thất bại', color: 'error' })
  } finally {
    isGalleryLoading.value = false
    input.value = ''
  }
}

function handleDelete() {
  submitDelete(
    () => apiDeleteCatalogItem(deleteTarget.value!.id),
    { message: 'Đã xoá danh mục hàng', navigateAfter: '/pmc/catalog/items' }
  )
}
</script>

<template>
  <div>
    <!-- Loading -->
    <div
      v-if="status === 'pending'"
      class="space-y-4"
    >
      <USkeleton class="h-8 w-48" />
      <USkeleton class="h-64 w-full" />
    </div>

    <!-- Error -->
    <SharedCrudPageError
      v-else-if="error"
      :error="error"
      :retry="refresh"
    />

    <!-- Content -->
    <div v-else-if="item">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <UButton
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="ghost"
            @click="navigateTo('/pmc/catalog/items')"
          />
          <div>
            <div class="flex items-center gap-2.5">
              <h1 class="text-2xl font-bold text-[var(--ui-text-highlighted)]">
                {{ item.name }}
              </h1>
              <UBadge
                :label="item.type.label"
                :color="isMaterial ? 'info' : 'secondary'"
                variant="subtle"
                size="sm"
              />
            </div>
            <p class="mt-1 text-sm text-[var(--ui-text-muted)]">
              {{ item.code }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <UButton
            icon="i-lucide-pencil"
            label="Sửa"
            variant="outline"
            @click="openEditModal(item)"
          />
          <UButton
            icon="i-lucide-trash-2"
            label="Xoá"
            color="error"
            variant="outline"
            @click="openDeleteModal(item)"
          />
        </div>
      </div>

      <!-- Detail Sections -->
      <div class="space-y-6">
        <!-- Image upload -->
        <SharedSectionCard
          title="Hình ảnh"
          compact
        >
          <SharedAvatarUpload
            :current-url="item.image_url"
            :alt="item.name"
            :loading="isImageLoading"
            @upload="handleImageUpload"
            @delete="handleImageDelete"
          />
        </SharedSectionCard>

        <SharedSectionCard
          title="Thông tin chung"
          compact
        >
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5">
            <SharedFieldDisplay label="Mã">
              <span class="font-medium">{{ item.code }}</span>
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Tên">
              <span class="font-medium">{{ item.name }}</span>
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Đơn vị">
              <span class="font-medium">{{ item.unit }}</span>
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Trạng thái">
              <SharedStatusBadge :active="item.status.value === 'active'" />
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Hiển thị cho cư dân">
              <UBadge
                :label="item.is_published ? 'Đã công bố' : 'Chưa công bố'"
                :color="item.is_published ? 'success' : 'neutral'"
                variant="subtle"
                size="sm"
              />
            </SharedFieldDisplay>
            <SharedFieldDisplay
              v-if="isService"
              label="Dịch vụ nổi bật"
            >
              <UBadge
                :label="item.is_featured ? 'Nổi bật' : 'Thường'"
                :color="item.is_featured ? 'warning' : 'neutral'"
                variant="subtle"
                size="sm"
              />
            </SharedFieldDisplay>
            <SharedFieldDisplay
              v-if="isService"
              label="Danh mục dịch vụ"
            >
              <span class="font-medium">{{ item.service_category?.name ?? '—' }}</span>
            </SharedFieldDisplay>
            <SharedFieldDisplay
              v-if="isService"
              label="Thứ tự sắp xếp"
            >
              <span class="font-medium">{{ item.sort_order ?? 0 }}</span>
            </SharedFieldDisplay>
            <SharedFieldDisplay
              v-if="item.slug"
              label="Slug"
            >
              <span class="font-mono text-xs">{{ item.slug }}</span>
            </SharedFieldDisplay>
          </div>
        </SharedSectionCard>

        <SharedSectionCard
          title="Giá & Hoa Hồng"
          compact
        >
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5">
            <SharedFieldDisplay :label="isMaterial ? 'Giá bán' : 'Đơn giá'">
              <span class="font-semibold text-base text-[var(--ui-text-highlighted)]">
                {{ Number(item.unit_price).toLocaleString('vi-VN') }} đ
              </span>
            </SharedFieldDisplay>
            <SharedFieldDisplay
              v-if="item.price_note"
              label="Ghi chú giá"
            >
              <span class="text-sm italic text-[var(--ui-text-muted)]">{{ item.price_note }}</span>
            </SharedFieldDisplay>
            <SharedFieldDisplay
              v-if="isMaterial"
              label="Giá mua"
            >
              <span class="font-semibold text-base text-[var(--ui-text-highlighted)]">
                {{ item.purchase_price ? `${Number(item.purchase_price).toLocaleString('vi-VN')} đ` : '—' }}
              </span>
            </SharedFieldDisplay>
            <SharedFieldDisplay
              v-if="isMaterial"
              label="Hoa Hồng (%)"
            >
              <span class="font-medium">{{ item.commission_rate ? `${item.commission_rate}%` : '—' }}</span>
            </SharedFieldDisplay>
            <SharedFieldDisplay
              v-if="isMaterial"
              label="Nhà cung cấp"
            >
              <NuxtLink
                v-if="item.supplier"
                :to="`/pmc/catalog/suppliers/${item.supplier.id}`"
                class="font-medium text-blue-600 hover:text-blue-800 hover:underline"
              >
                {{ item.supplier.name }}
              </NuxtLink>
              <span
                v-else
                class="font-medium"
              >—</span>
            </SharedFieldDisplay>
          </div>
        </SharedSectionCard>

        <SharedSectionCard
          title="Mô tả ngắn"
          compact
        >
          <p class="text-sm text-slate-700 leading-relaxed">
            {{ item.description || 'Chưa có mô tả.' }}
          </p>
        </SharedSectionCard>

        <!-- Content (Service only) -->
        <SharedSectionCard
          v-if="isService && item.content"
          title="Nội dung chi tiết"
          compact
        >
          <div
            class="prose prose-sm max-w-none"
            v-html="item.content"
          />
        </SharedSectionCard>

        <!-- Gallery -->
        <SharedSectionCard
          v-if="item.images && item.images.length > 0"
          title="Thư viện ảnh"
          compact
        >
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <div
              v-for="img in item.images"
              :key="img.id"
              class="relative group rounded-lg overflow-hidden border border-[var(--ui-border)]"
            >
              <img
                :src="img.image_url"
                :alt="`Gallery ${img.sort_order}`"
                class="w-full h-32 object-cover"
              >
              <button
                type="button"
                class="absolute top-1 right-1 p-1 rounded bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                title="Xóa ảnh"
                @click="handleGalleryDelete(img.id)"
              >
                <UIcon
                  name="i-lucide-x"
                  class="size-3.5"
                />
              </button>
            </div>
          </div>
        </SharedSectionCard>

        <!-- Gallery Upload -->
        <SharedSectionCard
          title="Tải thêm ảnh"
          compact
        >
          <div>
            <input
              ref="galleryInput"
              type="file"
              accept="image/*"
              multiple
              class="hidden"
              @change="onGalleryFilesSelected"
            >
            <UButton
              icon="i-lucide-image-plus"
              label="Chọn ảnh"
              variant="outline"
              :loading="isGalleryLoading"
              @click="galleryInput?.click()"
            />
          </div>
        </SharedSectionCard>
      </div>
    </div>

    <CatalogItemFormModal
      v-model:open="showFormModal"
      :mode="formMode"
      :item="editTarget"
      :loading="isUpdating"
      :api-errors="formApiErrors"
      @submit="handleFormSubmit"
      @image-changed="refresh()"
    />

    <SharedCrudDeleteModal
      v-model:open="showDeleteModal"
      title="Xoá danh mục hàng"
      :item-name="deleteTarget?.name"
      :loading="isDeleting"
      @confirm="handleDelete"
    />
  </div>
</template>
