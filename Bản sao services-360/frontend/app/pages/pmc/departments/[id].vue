<script setup lang="ts">
import type { DepartmentResource } from '#api/generated/laravel'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const id = computed(() => Number(route.params.id))

const { data, status, error, refresh } = useDepartmentDetail(id)

const { useDynamicLabel } = useBreadcrumb()
useDynamicLabel(computed(() => data.value?.data?.name ?? null))

const department = computed(() => data.value?.data ?? null)

// --- CRUD ---
const crud = useCrudModals<DepartmentResource>()
const { showFormModal, formMode, editTarget, formApiErrors, openEditModal, showDeleteModal, deleteTarget, openDeleteModal } = crud
const { isSubmitting: isUpdating, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, refresh)

function handleFormSubmit(formData: { project_id: number | null, code: string, name: string, parent_id: number | null, description: string | null }) {
  submitForm(
    null,
    () => apiUpdateDepartment(editTarget.value!.id, { project_id: formData.project_id, name: formData.name, parent_id: formData.parent_id, description: formData.description }),
    { update: 'Cập nhật phòng ban thành công' }
  )
}

function handleDelete() {
  submitDelete(
    () => apiDeleteDepartment(deleteTarget.value!.id),
    { message: 'Đã xoá phòng ban', navigateAfter: '/pmc/departments' }
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
    <div v-else-if="department">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <UButton
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="ghost"
            @click="navigateTo('/pmc/departments')"
          />
          <div>
            <h1 class="text-2xl font-bold text-[var(--ui-text-highlighted)]">
              {{ department.name }}
            </h1>
            <p class="mt-1 text-sm text-[var(--ui-text-muted)]">
              Mã: {{ department.code }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <UButton
            icon="i-lucide-pencil"
            label="Sửa"
            variant="outline"
            @click="openEditModal(department)"
          />
          <UButton
            icon="i-lucide-trash-2"
            label="Xoá"
            color="error"
            variant="outline"
            @click="openDeleteModal(department)"
          />
        </div>
      </div>

      <!-- Detail View -->
      <div class="max-w-xl rounded-xl border border-[var(--ui-border)] bg-[var(--ui-bg)] p-6 space-y-4">
        <SharedFieldDisplay label="Mã phòng ban">
          <span class="font-medium">{{ department.code }}</span>
        </SharedFieldDisplay>
        <SharedFieldDisplay label="Tên phòng ban">
          <span class="font-medium">{{ department.name }}</span>
        </SharedFieldDisplay>
        <SharedFieldDisplay label="Phòng ban cha">
          <NuxtLink
            v-if="department.parent"
            :to="`/pmc/departments/${department.parent.id}`"
            class="font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            {{ department.parent.name }}
          </NuxtLink>
          <span
            v-else
            class="font-medium"
          >—</span>
        </SharedFieldDisplay>
        <SharedFieldDisplay label="Thuộc dự án">
          <NuxtLink
            v-if="department.project"
            :to="`/pmc/projects/${department.project.id}`"
            class="font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            {{ department.project.name }}
          </NuxtLink>
          <span
            v-else
            class="font-medium"
          >Trụ sở chính</span>
        </SharedFieldDisplay>
        <SharedFieldDisplay label="Mô tả">
          <span class="font-medium">{{ department.description ?? '—' }}</span>
        </SharedFieldDisplay>
      </div>
    </div>

    <DepartmentFormModal
      v-model:open="showFormModal"
      :mode="formMode"
      :item="editTarget"
      :loading="isUpdating"
      :api-errors="formApiErrors"
      @submit="handleFormSubmit"
    />

    <SharedCrudDeleteModal
      v-model:open="showDeleteModal"
      title="Xoá phòng ban"
      :item-name="deleteTarget?.name"
      :loading="isDeleting"
      @confirm="handleDelete"
    />
  </div>
</template>
