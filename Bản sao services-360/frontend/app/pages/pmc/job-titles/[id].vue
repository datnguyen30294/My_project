<script setup lang="ts">
import type { JobTitleResource } from '#api/generated/laravel'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const id = computed(() => Number(route.params.id))

const { data, status, error, refresh } = useJobTitleDetail(id)

const { useDynamicLabel } = useBreadcrumb()
useDynamicLabel(computed(() => data.value?.data?.name ?? null))

const jobTitle = computed(() => data.value?.data ?? null)

// --- CRUD ---
const crud = useCrudModals<JobTitleResource>()
const { showFormModal, formMode, editTarget, formApiErrors, openEditModal, showDeleteModal, deleteTarget } = crud
const { isSubmitting: isUpdating, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, refresh)

function handleFormSubmit(formData: { project_id: number | null, code: string, name: string, description: string | null }) {
  submitForm(
    null,
    () => apiUpdateJobTitle(editTarget.value!.id, { project_id: formData.project_id, name: formData.name, description: formData.description }),
    { update: 'Cập nhật chức danh thành công' }
  )
}

// --- Delete with pre-check ---
const { isCheckingDelete, deleteBlockedMessage, openDeleteModal: onOpenDeleteModal, handleDelete } = useCheckDelete({
  crud,
  submitDelete,
  checkFn: apiCheckDeleteJobTitle,
  deleteFn: apiDeleteJobTitle,
  successMessage: 'Đã xoá chức danh',
  errorFallback: 'Không thể xoá chức danh này',
  navigateAfter: '/pmc/job-titles'
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
    <div v-else-if="jobTitle">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <UButton
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="ghost"
            @click="navigateTo('/pmc/job-titles')"
          />
          <div>
            <h1 class="text-2xl font-bold text-[var(--ui-text-highlighted)]">
              {{ jobTitle.name }}
            </h1>
            <p class="mt-1 text-sm text-[var(--ui-text-muted)]">
              Mã: {{ jobTitle.code }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <UButton
            icon="i-lucide-pencil"
            label="Sửa"
            variant="outline"
            @click="openEditModal(jobTitle)"
          />
          <UButton
            icon="i-lucide-trash-2"
            label="Xoá"
            color="error"
            variant="outline"
            @click="onOpenDeleteModal(jobTitle)"
          />
        </div>
      </div>

      <!-- Detail View -->
      <div class="max-w-xl rounded-xl border border-[var(--ui-border)] bg-[var(--ui-bg)] p-6 space-y-4">
        <SharedFieldDisplay label="Mã chức danh">
          <span class="font-medium">{{ jobTitle.code }}</span>
        </SharedFieldDisplay>
        <SharedFieldDisplay label="Tên chức danh">
          <span class="font-medium">{{ jobTitle.name }}</span>
        </SharedFieldDisplay>
        <SharedFieldDisplay label="Thuộc dự án">
          <NuxtLink
            v-if="jobTitle.project"
            :to="`/pmc/projects/${jobTitle.project.id}`"
            class="font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            {{ jobTitle.project.name }}
          </NuxtLink>
          <span
            v-else
            class="font-medium"
          >Trụ sở chính</span>
        </SharedFieldDisplay>
        <SharedFieldDisplay label="Mô tả">
          <span class="font-medium">{{ jobTitle.description ?? '—' }}</span>
        </SharedFieldDisplay>
      </div>
    </div>

    <JobTitleFormModal
      v-model:open="showFormModal"
      :mode="formMode"
      :item="editTarget"
      :loading="isUpdating"
      :api-errors="formApiErrors"
      @submit="handleFormSubmit"
    />

    <SharedCrudDeleteModal
      v-model:open="showDeleteModal"
      title="Xoá chức danh"
      :item-name="deleteTarget?.name"
      :blocked-message="deleteBlockedMessage"
      :loading="isDeleting"
      :checking="isCheckingDelete"
      @confirm="handleDelete"
    />
  </div>
</template>
