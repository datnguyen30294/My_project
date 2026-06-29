<script setup lang="ts">
import type { CatalogSupplierResource } from '#api/generated/laravel'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const id = computed(() => Number(route.params.id))

const { data, status, error, refresh } = useCatalogSupplierDetail(id)

const { useDynamicLabel } = useBreadcrumb()
useDynamicLabel(computed(() => data.value?.data?.name ?? null))

const supplier = computed(() => data.value?.data ?? null)

// --- CRUD ---
const crud = useCrudModals<CatalogSupplierResource>()
const { showFormModal, formMode, editTarget, formApiErrors, openEditModal, showDeleteModal, deleteTarget } = crud
const { isSubmitting: isUpdating, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, refresh)

function handleFormSubmit(formData: {
  name: string
  code: string
  contact: string | null
  phone: string | null
  address: string | null
  email: string | null
  commission_rate: number | null
  status?: string
}) {
  submitForm(
    null,
    () => apiUpdateCatalogSupplier(editTarget.value!.id, {
      name: formData.name,
      contact: formData.contact,
      phone: formData.phone,
      address: formData.address,
      email: formData.email,
      commission_rate: formData.commission_rate,
      status: formData.status as 'active' | 'inactive'
    }),
    { update: 'Cập nhật nhà cung cấp thành công' }
  )
}

// --- Delete with pre-check ---
const { isCheckingDelete, deleteBlockedMessage, openDeleteModal: onOpenDeleteModal, handleDelete } = useCheckDelete({
  crud,
  submitDelete,
  checkFn: apiCheckDeleteCatalogSupplier,
  deleteFn: apiDeleteCatalogSupplier,
  successMessage: 'Đã xoá nhà cung cấp',
  errorFallback: 'Không thể xoá nhà cung cấp này',
  navigateAfter: '/pmc/catalog/suppliers'
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
    <div v-else-if="supplier">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <UButton
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="ghost"
            @click="navigateTo('/pmc/catalog/suppliers')"
          />
          <div>
            <div class="flex items-center gap-2.5">
              <h1 class="text-2xl font-bold text-[var(--ui-text-highlighted)]">
                {{ supplier.name }}
              </h1>
              <SharedStatusBadge :active="supplier.status.value === 'active'" />
            </div>
            <p class="mt-1 text-sm text-[var(--ui-text-muted)]">
              {{ supplier.code }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <UButton
            icon="i-lucide-pencil"
            label="Sửa"
            variant="outline"
            @click="openEditModal(supplier)"
          />
          <UButton
            icon="i-lucide-trash-2"
            label="Xoá"
            color="error"
            variant="outline"
            @click="onOpenDeleteModal(supplier)"
          />
        </div>
      </div>

      <!-- Detail Sections -->
      <div class="space-y-6">
        <SharedSectionCard
          title="Thông tin chung"
          compact
        >
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5">
            <SharedFieldDisplay label="Mã NCC">
              <span class="font-medium">{{ supplier.code }}</span>
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Tên nhà cung cấp">
              <span class="font-medium">{{ supplier.name }}</span>
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Trạng thái">
              <SharedStatusBadge :active="supplier.status.value === 'active'" />
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Hoa hồng (%)">
              <span class="font-medium">{{ supplier.commission_rate ? `${supplier.commission_rate}%` : '—' }}</span>
            </SharedFieldDisplay>
          </div>
        </SharedSectionCard>

        <SharedSectionCard
          title="Liên hệ"
          compact
        >
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5">
            <SharedFieldDisplay label="Người liên hệ">
              <span class="font-medium">{{ supplier.contact || '—' }}</span>
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Số điện thoại">
              <span class="font-medium">{{ supplier.phone || '—' }}</span>
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Email">
              <span class="font-medium">{{ supplier.email || '—' }}</span>
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Địa chỉ">
              <span class="font-medium">{{ supplier.address || '—' }}</span>
            </SharedFieldDisplay>
          </div>
        </SharedSectionCard>
      </div>
    </div>

    <CatalogSupplierFormModal
      v-model:open="showFormModal"
      :mode="formMode"
      :item="editTarget"
      :loading="isUpdating"
      :api-errors="formApiErrors"
      @submit="handleFormSubmit"
    />

    <SharedCrudDeleteModal
      v-model:open="showDeleteModal"
      title="Xoá nhà cung cấp"
      :item-name="deleteTarget?.name"
      :blocked-message="deleteBlockedMessage"
      :loading="isDeleting"
      :checking="isCheckingDelete"
      @confirm="handleDelete"
    />
  </div>
</template>
