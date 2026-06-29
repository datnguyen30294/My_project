<script setup lang="ts">
import type { RoleResource } from '#api/generated/laravel'

interface PermissionItem {
  id: number
  name: string
  module: string
  sub_module: { value: string, label: string }
  action: { value: string, label: string }
  description: string | null
}

interface Props {
  open: boolean
  mode: 'create' | 'edit'
  item?: RoleResource | null
  loading?: boolean
  apiErrors?: Record<string, string[]>
  permissions?: PermissionItem[]
}

const props = withDefaults(defineProps<Props>(), {
  item: null,
  loading: false,
  apiErrors: () => ({}),
  permissions: () => []
})

const emit = defineEmits<{
  'update:open': [boolean]
  'submit': [{ name?: string, description: string | null, is_active: boolean, permission_ids: number[] }]
}>()

const formState = reactive({
  name: '',
  description: null as string | null,
  is_active: true,
  selectedPermissionIds: new Set<number>()
})

const isDefault = computed(() => props.item?.type?.value === 'default')

const isEditMode = computed(() => props.mode === 'edit')

const modalTitle = computed(() => {
  if (props.mode === 'create') return 'Thêm vai trò'
  if (isDefault.value) return 'Sửa vai trò mặc định'
  return 'Sửa vai trò'
})

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return
    if (props.mode === 'edit' && props.item) {
      formState.name = props.item.name
      formState.description = props.item.description ?? null
      formState.is_active = Boolean(props.item.is_active)

      const permIds = (props.item.permissions ?? []) as unknown as PermissionItem[]
      formState.selectedPermissionIds = new Set(permIds.map(p => p.id))
    } else {
      formState.name = ''
      formState.description = null
      formState.is_active = true
      formState.selectedPermissionIds = new Set()
    }
  }
)

// Permission action sort order
const ACTION_ORDER: Record<string, number> = {
  view: 0,
  store: 1,
  update: 2,
  destroy: 3
}

function getActionOrder(action: string): number {
  return ACTION_ORDER[action] ?? 99
}

interface SubModuleGroup {
  key: string
  label: string
  permissions: PermissionItem[]
}

interface ModuleGroup {
  label: string
  subModules: SubModuleGroup[]
}

// Parent module grouping mirrors the left sidebar (useNavigation.ts).
// Each entry lists the sub-module keys that belong to that module, in display order.
const MODULE_LAYOUT: { label: string, subModules: string[] }[] = [
  { label: 'HRM', subModules: ['accounts', 'departments', 'job-titles', 'roles', 'projects'] },
  { label: 'Khách hàng', subModules: ['customers'] },
  { label: 'Quản lý ticket', subModules: ['ticket-pool', 'og-tickets'] },
  { label: 'Quản lý công việc', subModules: ['work-schedules', 'schedule-slots', 'workforce-capacity', 'shifts'] },
  { label: 'Danh mục', subModules: ['catalog-suppliers', 'service-categories', 'catalog-items'] },
  { label: 'Quản lý đơn hàng', subModules: ['quotes', 'orders'] },
  { label: 'Kế toán/Tài chính', subModules: ['commission', 'receivables', 'reconciliations', 'closing-periods', 'treasury'] },
  {
    label: 'Báo cáo',
    subModules: [
      'report-overview',
      'report-revenue-ticket',
      'report-revenue-profit',
      'report-operating-profit',
      'report-commission',
      'report-cashflow',
      'report-sla',
      'report-csat'
    ]
  },
  {
    label: 'Cài đặt hệ thống',
    subModules: [
      'settings-sla',
      'settings-bank-account',
      'settings-acceptance-report',
      'policies'
    ]
  }
]

// Bucket permissions by sub_module value.
const subModuleBuckets = computed(() => {
  const buckets = new Map<string, SubModuleGroup>()

  for (const perm of props.permissions) {
    const key = perm.sub_module.value
    if (!buckets.has(key)) {
      buckets.set(key, { key, label: perm.sub_module.label, permissions: [] })
    }
    buckets.get(key)!.permissions.push(perm)
  }

  for (const bucket of buckets.values()) {
    bucket.permissions.sort((a, b) => getActionOrder(a.action.value) - getActionOrder(b.action.value))
  }

  return buckets
})

// Organise sub-modules under their parent module, in sidebar order.
// Any sub-module not listed in MODULE_LAYOUT falls into a trailing "Khác" group so nothing is dropped.
const moduleGroups = computed<ModuleGroup[]>(() => {
  const buckets = subModuleBuckets.value
  const placed = new Set<string>()
  const result: ModuleGroup[] = []

  for (const module of MODULE_LAYOUT) {
    const subModules: SubModuleGroup[] = []
    for (const key of module.subModules) {
      const bucket = buckets.get(key)
      if (bucket) {
        subModules.push(bucket)
        placed.add(key)
      }
    }
    if (subModules.length > 0) {
      result.push({ label: module.label, subModules })
    }
  }

  const leftovers: SubModuleGroup[] = []
  for (const [key, bucket] of buckets) {
    if (!placed.has(key)) leftovers.push(bucket)
  }
  if (leftovers.length > 0) {
    result.push({ label: 'Khác', subModules: leftovers })
  }

  return result
})

// Flat list of all sub-module groups in display order — used by actionColumns and lookup helpers.
const permissionGroups = computed<SubModuleGroup[]>(() =>
  moduleGroups.value.flatMap(m => m.subModules)
)

// Collect unique action columns across all groups
const actionColumns = computed(() => {
  const seen = new Map<string, string>()
  for (const group of permissionGroups.value) {
    for (const perm of group.permissions) {
      if (!seen.has(perm.action.value)) {
        seen.set(perm.action.value, perm.action.label)
      }
    }
  }
  const entries = Array.from(seen.entries())
  entries.sort((a, b) => getActionOrder(a[0]) - getActionOrder(b[0]))
  return entries.map(([value, label]) => ({ value, label }))
})

// Find permission in a group by action
function findPermByAction(group: { permissions: PermissionItem[] }, actionValue: string): PermissionItem | undefined {
  return group.permissions.find(p => p.action.value === actionValue)
}

// Find the "view" permission in the same sub_module group
function findViewPermission(permId: number): PermissionItem | undefined {
  for (const group of permissionGroups.value) {
    const perm = group.permissions.find(p => p.id === permId)
    if (perm) {
      return group.permissions.find(p => p.action.value === 'view')
    }
  }
}

// Find all non-view permissions in the same group
function findNonViewPermissions(permId: number): PermissionItem[] {
  for (const group of permissionGroups.value) {
    const perm = group.permissions.find(p => p.id === permId)
    if (perm) {
      return group.permissions.filter(p => p.action.value !== 'view')
    }
  }
  return []
}

function togglePermission(id: number) {
  const perm = props.permissions.find(p => p.id === id)
  if (!perm) return

  if (formState.selectedPermissionIds.has(id)) {
    formState.selectedPermissionIds.delete(id)
    if (perm.action.value === 'view') {
      for (const p of findNonViewPermissions(id)) {
        formState.selectedPermissionIds.delete(p.id)
      }
    }
  } else {
    formState.selectedPermissionIds.add(id)
    if (['store', 'update', 'destroy'].includes(perm.action.value)) {
      const viewPerm = findViewPermission(id)
      if (viewPerm) {
        formState.selectedPermissionIds.add(viewPerm.id)
      }
    }
  }
}

function isGroupAllSelected(group: { permissions: PermissionItem[] }) {
  return group.permissions.every(p => formState.selectedPermissionIds.has(p.id))
}

function toggleGroup(group: { permissions: PermissionItem[] }) {
  const allSelected = isGroupAllSelected(group)
  for (const perm of group.permissions) {
    if (allSelected) {
      formState.selectedPermissionIds.delete(perm.id)
    } else {
      formState.selectedPermissionIds.add(perm.id)
    }
  }
}

function isViewDisabled(perm: PermissionItem, group: { permissions: PermissionItem[] }): boolean {
  if (perm.action.value !== 'view') return false
  return group.permissions.some(
    p => ['store', 'update', 'destroy'].includes(p.action.value) && formState.selectedPermissionIds.has(p.id)
  )
}

function isModuleAllSelected(module: ModuleGroup): boolean {
  return module.subModules.every(sub => isGroupAllSelected(sub))
}

function toggleModule(module: ModuleGroup) {
  const allSelected = isModuleAllSelected(module)
  for (const sub of module.subModules) {
    for (const perm of sub.permissions) {
      if (allSelected) {
        formState.selectedPermissionIds.delete(perm.id)
      } else {
        formState.selectedPermissionIds.add(perm.id)
      }
    }
  }
}

// Select all / deselect all
const isAllSelected = computed(() =>
  props.permissions.length > 0 && props.permissions.every(p => formState.selectedPermissionIds.has(p.id))
)

function toggleAll() {
  if (isAllSelected.value) {
    formState.selectedPermissionIds.clear()
  } else {
    for (const p of props.permissions) {
      formState.selectedPermissionIds.add(p.id)
    }
  }
}

function handleSubmit() {
  const payload: { name?: string, description: string | null, is_active: boolean, permission_ids: number[] } = {
    description: formState.description,
    is_active: formState.is_active,
    permission_ids: Array.from(formState.selectedPermissionIds)
  }

  if (!isDefault.value || !isEditMode.value) {
    payload.name = formState.name
  }

  emit('submit', payload)
}
</script>

<template>
  <UModal
    :open="open"
    :title="modalTitle"
    :ui="{ content: 'sm:max-w-3xl' }"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <div class="space-y-4">
        <UFormField
          label="Tên vai trò"
          name="name"
          :required="!isDefault || !isEditMode"
        >
          <UInput
            v-model="formState.name"
            placeholder="VD: Quản trị viên"
            class="w-full"
            :disabled="isDefault && isEditMode"
          />
          <SharedCrudFormFieldError :errors="apiErrors.name" />
          <p
            v-if="isDefault && isEditMode"
            class="text-xs text-muted mt-1"
          >
            Không thể đổi tên vai trò mặc định
          </p>
        </UFormField>

        <UFormField
          label="Mô tả"
          name="description"
        >
          <UTextarea
            v-model="formState.description"
            placeholder="Mô tả vai trò (tuỳ chọn)"
            :rows="2"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Trạng thái"
          name="is_active"
        >
          <USwitch
            v-model="formState.is_active"
            color="success"
            label="Hoạt động"
          />
          <SharedCrudFormFieldError :errors="apiErrors.is_active" />
        </UFormField>

        <!-- Permission Matrix Table -->
        <div
          v-if="permissionGroups.length > 0"
          class="border-t border-border-gray pt-4"
        >
          <div class="flex items-center justify-between mb-3">
            <p class="font-semibold text-sm text-slate-900">
              Phân quyền
            </p>
            <UButton
              :label="isAllSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'"
              color="neutral"
              variant="link"
              size="sm"
              @click="toggleAll"
            />
          </div>

          <div class="border border-border-gray rounded-lg overflow-hidden">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-slate-100 border-b border-border-gray">
                  <th class="text-left py-3 px-4 text-[13px] font-semibold text-slate-600">
                    Module
                  </th>
                  <th class="text-center py-3 px-4 text-[13px] font-semibold text-slate-600 w-20">
                    Admin
                  </th>
                  <th
                    v-for="col in actionColumns"
                    :key="col.value"
                    class="text-center py-3 px-4 text-[13px] font-semibold text-slate-600"
                  >
                    {{ col.label }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <template
                  v-for="module in moduleGroups"
                  :key="module.label"
                >
                  <tr class="bg-slate-200/70 border-t border-b border-border-gray">
                    <td class="py-2 px-4 text-[13px] font-bold uppercase tracking-wide text-slate-700">
                      {{ module.label }}
                    </td>
                    <td class="py-2 px-4 text-center">
                      <div class="flex justify-center">
                        <UCheckbox
                          :model-value="isModuleAllSelected(module)"
                          @update:model-value="toggleModule(module)"
                        />
                      </div>
                    </td>
                    <td :colspan="actionColumns.length" />
                  </tr>
                  <tr
                    v-for="(group, index) in module.subModules"
                    :key="group.key"
                    class="border-b border-border-gray transition-colors"
                    :class="index % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'"
                  >
                    <td class="py-3 px-4 pl-8 text-slate-800">
                      {{ group.label }}
                    </td>
                    <td class="py-3 px-4 text-center">
                      <div class="flex justify-center">
                        <UCheckbox
                          :model-value="isGroupAllSelected(group)"
                          @update:model-value="toggleGroup(group)"
                        />
                      </div>
                    </td>
                    <td
                      v-for="col in actionColumns"
                      :key="col.value"
                      class="py-3 px-4 text-center"
                    >
                      <div class="flex justify-center">
                        <UCheckbox
                          v-if="findPermByAction(group, col.value)"
                          :model-value="formState.selectedPermissionIds.has(findPermByAction(group, col.value)!.id)"
                          :disabled="isViewDisabled(findPermByAction(group, col.value)!, group)"
                          @update:model-value="togglePermission(findPermByAction(group, col.value)!.id)"
                        />
                        <span
                          v-else
                          class="text-slate-300"
                        >—</span>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>

          <p class="text-xs text-muted mt-2">
            Chọn quyền Tạo / Sửa / Xoá sẽ tự động bật quyền Xem.
          </p>
        </div>
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
          @click="handleSubmit"
        />
      </div>
    </template>
  </UModal>
</template>
