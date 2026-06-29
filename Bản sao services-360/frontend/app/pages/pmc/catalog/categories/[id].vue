<script setup lang="ts">
import type { ServiceCategoryResource, CatalogStatus } from '#api/generated/laravel'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const id = computed(() => Number(route.params.id))

const { data, status, error, refresh } = useServiceCategoryDetail(id)

const { useDynamicLabel } = useBreadcrumb()
useDynamicLabel(computed(() => data.value?.data?.name ?? null))

const category = computed(() => data.value?.data ?? null)

// --- CRUD ---
const crud = useCrudModals<ServiceCategoryResource>()
const { showFormModal, formMode, editTarget, formApiErrors, openEditModal, showDeleteModal, deleteTarget } = crud
const { isSubmitting: isUpdating, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, refresh)

function handleFormSubmit(formData: {
  name: string
  code: string
  description: string | null
  sort_order: number | null
  status?: string
}) {
  submitForm(
    null,
    () => apiUpdateServiceCategory(editTarget.value!.id, {
      name: formData.name,
      description: formData.description,
      sort_order: formData.sort_order,
      status: formData.status as CatalogStatus
    }),
    { update: 'Cập nhật loại dịch vụ thành công' }
  )
}

// --- Image upload ---
const { isImageLoading, handleImageUpload, handleImageDelete } = useServiceCategoryImage(
  computed(() => category.value?.id),
  () => refresh()
)

// --- Delete with pre-check ---
const { isCheckingDelete, deleteBlockedMessage, openDeleteModal: onOpenDeleteModal, handleDelete } = useCheckDelete({
  crud,
  submitDelete,
  checkFn: apiCheckDeleteServiceCategory,
  deleteFn: apiDeleteServiceCategory,
  successMessage: 'Đã xoá loại dịch vụ',
  errorFallback: 'Không thể xoá loại dịch vụ này',
  navigateAfter: '/pmc/catalog/categories'
})
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
    <div v-else-if="category">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <UButton
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="ghost"
            @click="navigateTo('/pmc/catalog/categories')"
          />
          <div>
            <div class="flex items-center gap-2.5">
              <h1 class="text-2xl font-bold text-[var(--ui-text-highlighted)]">
                {{ category.name }}
              </h1>
              <SharedStatusBadge :active="category.status.value === 'active'" />
            </div>
            <p class="mt-1 text-sm text-[var(--ui-text-muted)]">
              {{ category.code }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <UButton
            icon="i-lucide-pencil"
            label="Sửa"
            variant="outline"
            @click="openEditModal(category)"
          />
          <UButton
            icon="i-lucide-trash-2"
            label="Xoá"
            color="error"
            variant="outline"
            @click="onOpenDeleteModal(category)"
          />
        </div>
      </div>

      <!-- Image upload -->
      <SharedSectionCard
        title="Hình ảnh"
        compact
        class="mb-6"
      >
        <SharedImageUpload
          :current-url="category.image_url"
          :alt="category.name"
          :loading="isImageLoading"
          @upload="handleImageUpload"
          @delete="handleImageDelete"
        />
      </SharedSectionCard>

      <!-- Detail -->
      <SharedSectionCard
        title="Thông tin chung"
        compact
      >
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5">
          <SharedFieldDisplay label="Mã loại dịch vụ">
            <span class="font-medium">{{ category.code }}</span>
          </SharedFieldDisplay>
          <SharedFieldDisplay label="Tên loại dịch vụ">
            <span class="font-medium">{{ category.name }}</span>
          </SharedFieldDisplay>
          <SharedFieldDisplay label="Thứ tự sắp xếp">
            <span class="font-medium">{{ category.sort_order }}</span>
          </SharedFieldDisplay>
          <SharedFieldDisplay label="Trạng thái">
            <SharedStatusBadge :active="category.status.value === 'active'" />
          </SharedFieldDisplay>
          <SharedFieldDisplay
            label="Mô tả"
            class="lg:col-span-4"
          >
            <span class="font-medium">{{ category.description || '—' }}</span>
          </SharedFieldDisplay>
          <SharedFieldDisplay label="Số dịch vụ liên kết">
            <span class="font-medium">{{ category.items_count ?? 0 }}</span>
          </SharedFieldDisplay>
        </div>
      </SharedSectionCard>
    </div>

    <CatalogServiceCategoryFormModal
      v-model:open="showFormModal"
      :mode="formMode"
      :item="editTarget"
      :loading="isUpdating"
      :api-errors="formApiErrors"
      @submit="handleFormSubmit"
    />

    <SharedCrudDeleteModal
      v-model:open="showDeleteModal"
      title="Xoá loại dịch vụ"
      :item-name="deleteTarget?.name"
      :blocked-message="deleteBlockedMessage"
      :loading="isDeleting"
      :checking="isCheckingDelete"
      @confirm="handleDelete"
    />
  </div>
</template>
