<script setup lang="ts">
import type { RoleResource, PermissionResource } from '#api/generated/laravel'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const id = computed(() => Number(route.params.id))

const { data, status, error, refresh } = useRoleDetail(id)

const { useDynamicLabel } = useBreadcrumb()
useDynamicLabel(computed(() => data.value?.data?.name ?? null))

const role = computed(() => data.value?.data ?? null)

const rolePermissions = computed<PermissionResource[]>(() => {
  const raw = role.value?.permissions
  if (!raw || !Array.isArray(raw)) return []
  return raw
})

// Group permissions by sub_module for display
const permissionGroups = computed(() => {
  const groups = new Map<string, { label: string, permissions: PermissionResource[] }>()

  for (const perm of rolePermissions.value) {
    const key = perm.sub_module.value
    if (!groups.has(key)) {
      groups.set(key, { label: perm.sub_module.label, permissions: [] })
    }
    groups.get(key)!.permissions.push(perm)
  }

  return Array.from(groups.values())
})

// --- Permissions (for form modal, fetched lazily) ---
const { data: permissionsData, execute: fetchPermissions } = usePermissionList({ immediate: false })
const permissionsFetched = ref(false)
const allPermissions = computed(() => {
  const raw = permissionsData.value?.data ?? []
  return raw
})

// --- CRUD ---
const crud = useCrudModals<RoleResource>()
const { showFormModal, formMode, editTarget, formApiErrors, openEditModal, showDeleteModal, deleteTarget } = crud
const { isSubmitting: isUpdating, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, refresh)

// Fetch permissions lazily on first modal open
watch(showFormModal, (open) => {
  if (open && !permissionsFetched.value) {
    permissionsFetched.value = true
    fetchPermissions()
  }
})

function handleFormSubmit(formData: { name?: string, description: string | null, is_active: boolean, permission_ids: number[] }) {
  submitForm(
    null,
    () => apiUpdateRole(editTarget.value!.id, { name: formData.name, description: formData.description, is_active: formData.is_active, permission_ids: formData.permission_ids }),
    { update: 'Cập nhật vai trò thành công' }
  )
}

// --- Delete ---
const { deleteBlockedMessage, openDeleteModal: _openDeleteModal, handleDelete } = useCheckDelete({
  crud,
  submitDelete,
  deleteFn: apiDeleteRole,
  successMessage: 'Đã xoá vai trò',
  errorFallback: 'Không thể xoá vai trò này',
  navigateAfter: '/pmc/roles'
})
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex items-center gap-4">
      <UButton
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
        to="/pmc/roles"
      />
      <div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight">
          Chi tiết vai trò
        </h1>
        <p class="text-slate-500 text-sm mt-0.5">
          {{ role?.name ?? '...' }}
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="status === 'pending'"
      class="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      <div class="lg:col-span-2 flex flex-col gap-6">
        <div
          v-for="i in 2"
          :key="i"
          class="h-48 bg-slate-100 rounded-xl animate-pulse"
        />
      </div>
      <div class="flex flex-col gap-4">
        <div class="h-64 bg-slate-100 rounded-xl animate-pulse" />
      </div>
    </div>

    <!-- Error -->
    <SharedCrudPageError
      v-else-if="error"
      :error="error"
      :retry="refresh"
    />

    <!-- Content -->
    <div
      v-else-if="role"
      class="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      <!-- Left: Main content -->
      <div class="lg:col-span-2 flex flex-col gap-6">
        <!-- Thông tin vai trò -->
        <SharedSectionCard title="Thông tin vai trò">
          <template #header-actions>
            <UBadge
              :color="role.type?.value === 'default' ? 'info' : 'neutral'"
              variant="subtle"
              size="sm"
            >
              {{ role.type?.label }}
            </UBadge>
            <SharedStatusBadge
              :active="Boolean(role.is_active)"
              inactive-label="Tắt"
            />
          </template>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <SharedFieldDisplay label="Tên vai trò">
              <span class="font-medium">{{ role.name }}</span>
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Loại vai trò">
              <UBadge
                :color="role.type?.value === 'default' ? 'info' : 'neutral'"
                variant="subtle"
                size="sm"
              >
                {{ role.type?.label }}
              </UBadge>
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Phòng ban">
              <NuxtLink
                v-if="role.department"
                :to="`/pmc/departments/${role.department.id}`"
                class="font-medium text-primary-600 hover:text-primary-800 hover:underline"
              >
                {{ role.department.name }}
              </NuxtLink>
              <span
                v-else
                class="text-slate-400"
              >—</span>
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Chức danh">
              <NuxtLink
                v-if="role.job_title"
                :to="`/pmc/job-titles/${role.job_title.id}`"
                class="font-medium text-primary-600 hover:text-primary-800 hover:underline"
              >
                {{ role.job_title.name }}
              </NuxtLink>
              <span
                v-else
                class="text-slate-400"
              >—</span>
            </SharedFieldDisplay>
            <SharedFieldDisplay
              v-if="role.description"
              label="Mô tả"
              class="sm:col-span-2"
            >
              <p class="leading-relaxed whitespace-pre-wrap">
                {{ role.description }}
              </p>
            </SharedFieldDisplay>
          </div>
        </SharedSectionCard>

        <!-- Phân quyền -->
        <SharedSectionCard title="Phân quyền">
          <template #header-actions>
            <span class="text-xs text-slate-500">
              {{ rolePermissions.length }} quyền
            </span>
          </template>

          <template v-if="permissionGroups.length > 0">
            <div class="space-y-4">
              <div
                v-for="(group, index) in permissionGroups"
                :key="group.label"
              >
                <div class="flex items-center gap-3 mb-2.5">
                  <UIcon
                    name="i-lucide-shield"
                    class="text-slate-400 size-4 shrink-0"
                  />
                  <span class="text-sm font-semibold text-slate-700">{{ group.label }}</span>
                  <span class="text-xs text-slate-400">({{ group.permissions.length }})</span>
                </div>
                <div class="flex flex-wrap gap-2 ml-7">
                  <UBadge
                    v-for="perm in group.permissions"
                    :key="perm.id"
                    color="primary"
                    variant="subtle"
                    size="sm"
                  >
                    {{ perm.action.label }}
                  </UBadge>
                </div>
                <USeparator
                  v-if="index < permissionGroups.length - 1"
                  class="mt-4"
                />
              </div>
            </div>
          </template>
          <div
            v-else
            class="py-6 text-center"
          >
            <UIcon
              name="i-lucide-shield-off"
              class="text-slate-300 size-10 mx-auto mb-3"
            />
            <p class="text-sm text-slate-500">
              Chưa có quyền nào được gán
            </p>
          </div>
        </SharedSectionCard>
      </div>

      <!-- Right sidebar -->
      <div class="flex flex-col gap-4">
        <!-- Actions -->
        <SharedSectionCard
          title="Thao tác"
          compact
        >
          <div class="flex flex-col gap-2.5">
            <UButton
              icon="i-lucide-pencil"
              label="Chỉnh sửa vai trò"
              variant="soft"
              color="primary"
              class="w-full justify-start"
              @click="openEditModal(role)"
            />
            <UButton
              icon="i-lucide-trash-2"
              label="Xoá vai trò"
              variant="soft"
              color="error"
              class="w-full justify-start"
              @click="_openDeleteModal(role)"
            />
          </div>
        </SharedSectionCard>

        <!-- Liên kết -->
        <SharedSectionCard
          title="Liên kết"
          compact
        >
          <div class="flex flex-col gap-3">
            <SharedFieldDisplay label="Phòng ban">
              <NuxtLink
                v-if="role.department"
                :to="`/pmc/departments/${role.department.id}`"
                class="font-medium text-primary-600 hover:text-primary-800 hover:underline inline-flex items-center gap-1"
              >
                {{ role.department.name }}
                <UIcon
                  name="i-lucide-external-link"
                  class="size-3.5"
                />
              </NuxtLink>
              <span
                v-else
                class="text-slate-400"
              >—</span>
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Chức danh">
              <NuxtLink
                v-if="role.job_title"
                :to="`/pmc/job-titles/${role.job_title.id}`"
                class="font-medium text-primary-600 hover:text-primary-800 hover:underline inline-flex items-center gap-1"
              >
                {{ role.job_title.name }}
                <UIcon
                  name="i-lucide-external-link"
                  class="size-3.5"
                />
              </NuxtLink>
              <span
                v-else
                class="text-slate-400"
              >—</span>
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Trạng thái">
              <SharedStatusBadge
                :active="Boolean(role.is_active)"
                inactive-label="Tắt"
              />
            </SharedFieldDisplay>
          </div>
        </SharedSectionCard>
      </div>
    </div>

    <RoleFormModal
      v-model:open="showFormModal"
      :mode="formMode"
      :item="editTarget"
      :loading="isUpdating"
      :api-errors="formApiErrors"
      :permissions="allPermissions"
      @submit="handleFormSubmit"
    />

    <SharedCrudDeleteModal
      v-model:open="showDeleteModal"
      title="Xoá vai trò"
      :item-name="deleteTarget?.name"
      :blocked-message="deleteBlockedMessage"
      :loading="isDeleting"
      @confirm="handleDelete"
    />
  </div>
</template>
