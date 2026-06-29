<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { ApiClientResource, ApiClientIndexParams } from '~/composables/api/useApiClients'

definePageMeta({ layout: 'platform' })
useSeoMeta({ title: 'Quản lý API Clients - Thần Nông' })

// --- List ---
const params = reactive<ApiClientIndexParams>({
  search: undefined,
  per_page: DEFAULT_PER_PAGE
})
const page = ref(1)

const { searchInput, onSearch } = useTableSearch((value) => {
  params.search = value || undefined
  page.value = 1
})

const hasFilters = computed(() => !!searchInput.value)

function clearFilters() {
  searchInput.value = ''
  params.search = undefined
  page.value = 1
}

const { data, status, error, refresh } = usePlatformApiClientList(
  computed(() => ({ ...params, page: page.value }))
)

const clients = computed<ApiClientResource[]>(() => data.value?.data ?? [])

const columns: TableColumn<ApiClientResource>[] = [
  { accessorKey: 'name', header: 'Tên ứng dụng' },
  { id: 'client_key', header: 'Client Key' },
  { id: 'organization', header: 'Tổ chức' },
  { id: 'project', header: 'Dự án' },
  { id: 'scopes', header: 'Scopes' },
  { id: 'is_active', header: 'Trạng thái' },
  { accessorKey: 'last_used_at', header: 'Lần dùng cuối' },
  stickyRight<ApiClientResource>({ id: 'actions', header: 'Thao tác' }, { width: 'w-[140px] min-w-[140px]' })
]

// --- CRUD ---
const crud = useCrudModals<ApiClientResource>()
const {
  showFormModal, formMode, editTarget, formApiErrors,
  openCreateModal, openEditModal,
  showDeleteModal, deleteTarget, openDeleteModal
} = crud
const { isSubmitting, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, refresh)

// --- Secret display ---
const secretKey = ref<string | null>(null)
const secretClientKey = ref<string | null>(null)
const showSecretModal = ref(false)

async function handleFormSubmit(formData: {
  organization_id: string
  project_id: number
  name: string
  scopes: string[]
  is_active?: boolean
}) {
  crud.formApiErrors.value = {}
  const isCreate = formMode.value === 'create'

  if (isCreate) {
    // For create, handle manually to show secret_key
    try {
      const result = await apiCreateApiClient(formData as Parameters<typeof apiCreateApiClient>[0])
      secretClientKey.value = result.data?.client_key ?? null
      secretKey.value = (result as { secret_key?: string }).secret_key ?? null
      showSecretModal.value = true
      crud.showFormModal.value = false
      await refresh()
    } catch (err) {
      crud.handleFormError(err)
    }
  } else {
    submitForm(
      null,
      () => apiUpdateApiClient(editTarget.value!.id, {
        name: formData.name,
        scopes: formData.scopes as Parameters<typeof apiUpdateApiClient>[1]['scopes'],
        is_active: formData.is_active
      }),
      { update: 'Cập nhật API client thành công' }
    )
  }
}

function handleDelete() {
  submitDelete(
    () => apiDeleteApiClient(deleteTarget.value!.id),
    { message: 'Đã xoá API client' }
  )
}

const toast = useToast()

// --- Regenerate Secret ---
const showRegenerateModal = ref(false)
const regenerateTarget = ref<ApiClientResource | null>(null)
const isRegenerating = ref(false)

function openRegenerateModal(client: ApiClientResource) {
  regenerateTarget.value = client
  showRegenerateModal.value = true
}

async function confirmRegenerateSecret() {
  if (!regenerateTarget.value) return
  isRegenerating.value = true
  try {
    const result = await apiRegenerateSecret(regenerateTarget.value.id)
    secretClientKey.value = regenerateTarget.value.client_key
    secretKey.value = (result as { secret_key?: string }).secret_key ?? null
    showRegenerateModal.value = false
    showSecretModal.value = true
    await refresh()
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Tạo lại secret thất bại'), color: 'error' })
  } finally {
    isRegenerating.value = false
  }
}

function copyElementById(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const range = document.createRange()
  range.selectNodeContents(el)
  const selection = window.getSelection()
  selection?.removeAllRanges()
  selection?.addRange(range)
  document.execCommand('copy')
  selection?.removeAllRanges()
  toast.add({ title: 'Đã copy', color: 'success' })
}

function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      toast.add({ title: 'Đã copy', color: 'success' })
    }).catch(() => {
      fallbackCopy(text)
    })
  } else {
    fallbackCopy(text)
  }
}

function fallbackCopy(text: string) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
  toast.add({ title: 'Đã copy', color: 'success' })
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-black text-slate-900 tracking-tight">
        API Clients
      </h1>
      <p class="text-slate-500 text-sm mt-1">
        Quản lý ứng dụng bên thứ 3 kết nối qua API.
      </p>
    </div>

    <!-- Search + Actions -->
    <div class="mb-4 flex items-center gap-3">
      <UInput
        v-model="searchInput"
        icon="i-lucide-search"
        placeholder="Tìm theo tên..."
        class="max-w-sm"
        @update:model-value="onSearch"
      />
      <UButton
        v-if="hasFilters"
        icon="i-lucide-x"
        label="Xóa bộ lọc"
        color="neutral"
        variant="ghost"
        size="sm"
        @click="clearFilters"
      />
      <div class="flex-1" />
      <UButton
        icon="i-lucide-plus"
        label="Tạo API Client"
        @click="openCreateModal"
      />
    </div>

    <!-- Error state -->
    <UAlert
      v-if="error"
      icon="i-lucide-alert-circle"
      color="error"
      variant="subtle"
      description="Không thể tải dữ liệu. Vui lòng thử lại."
      class="mb-4"
    />

    <!-- Table -->
    <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <UTable
        :data="clients"
        :columns="columns"
        :loading="status === 'pending'"
      >
        <template #client_key-cell="{ row }">
          <div class="flex items-center gap-1">
            <code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{{ row.original.client_key.slice(0, 20) }}...</code>
            <UButton
              icon="i-lucide-copy"
              color="neutral"
              variant="ghost"
              size="xs"
              title="Copy Client Key"
              @click="copyToClipboard(row.original.client_key)"
            />
          </div>
        </template>

        <template #organization-cell="{ row }">
          <div>
            <span class="text-sm">{{ (row.original as any).organization_name ?? row.original.organization_id }}</span>
            <span class="text-xs text-gray-400 ml-1">({{ row.original.organization_id }})</span>
          </div>
        </template>

        <template #project-cell="{ row }">
          {{ (row.original as any).project_name ?? `#${row.original.project_id}` }}
        </template>

        <template #scopes-cell="{ row }">
          <div class="flex flex-wrap gap-1">
            <UBadge
              v-for="scope in row.original.scopes"
              :key="scope"
              variant="subtle"
              color="info"
              :label="scope"
              size="xs"
            />
          </div>
        </template>

        <template #is_active-cell="{ row }">
          <UBadge
            :color="row.original.is_active ? 'success' : 'neutral'"
            variant="subtle"
            :label="row.original.is_active ? 'Hoạt động' : 'Đã tắt'"
          />
        </template>

        <template #last_used_at-cell="{ row }">
          {{ row.original.last_used_at ? formatDate(row.original.last_used_at) : '—' }}
        </template>

        <template #actions-cell="{ row }">
          <SharedCrudTableActions
            @edit="openEditModal(row.original)"
            @delete="openDeleteModal(row.original)"
          >
            <template #extra>
              <UButton
                icon="i-lucide-refresh-cw"
                color="neutral"
                variant="ghost"
                size="sm"
                title="Tạo lại Secret"
                @click="openRegenerateModal(row.original)"
              />
            </template>
          </SharedCrudTableActions>
        </template>
      </UTable>

      <SharedCrudTablePagination
        v-model:page="page"
        :meta="data?.meta"
      />
    </div>

    <!-- Form Modal -->
    <ApiClientFormModal
      v-model:open="showFormModal"
      :mode="formMode"
      :item="editTarget"
      :loading="isSubmitting"
      :api-errors="formApiErrors"
      @submit="handleFormSubmit"
    />

    <!-- Delete Modal -->
    <SharedCrudDeleteModal
      v-model:open="showDeleteModal"
      title="Xoá API Client"
      :item-name="deleteTarget?.name"
      :loading="isDeleting"
      @confirm="handleDelete"
    />

    <!-- Regenerate Secret Confirm Modal -->
    <UModal
      :open="showRegenerateModal"
      title="Tạo lại Secret Key"
      @update:open="showRegenerateModal = $event"
    >
      <template #body>
        <UAlert
          icon="i-lucide-alert-triangle"
          color="warning"
          variant="subtle"
          title="Cảnh báo"
          description="Secret key hiện tại sẽ bị vô hiệu hóa ngay lập tức. Tất cả access token đang hoạt động sẽ bị thu hồi. Ứng dụng bên thứ 3 sẽ không thể truy cập API cho đến khi cập nhật secret key mới."
          class="mb-4"
        />
        <p class="text-sm text-gray-600">
          Bạn có chắc chắn muốn tạo lại secret key cho <strong>{{ regenerateTarget?.name }}</strong>?
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="neutral"
            variant="outline"
            label="Huỷ"
            @click="showRegenerateModal = false"
          />
          <UButton
            color="warning"
            icon="i-lucide-refresh-cw"
            label="Tạo lại Secret"
            :loading="isRegenerating"
            @click="confirmRegenerateSecret"
          />
        </div>
      </template>
    </UModal>

    <!-- Secret Key Modal (shown once after create/regenerate) -->
    <UModal
      :open="showSecretModal"
      title="Thông tin xác thực"
      @update:open="showSecretModal = $event"
    >
      <template #body>
        <UAlert
          icon="i-lucide-alert-triangle"
          color="warning"
          variant="subtle"
          title="Lưu ý"
          description="Secret key chỉ hiển thị một lần duy nhất. Hãy sao chép và lưu trữ an toàn."
          class="mb-4"
        />

        <div class="space-y-3">
          <!-- Client Key -->
          <div>
            <label class="text-xs font-medium text-gray-500 mb-1 block">Client Key</label>
            <div class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
              <code
                id="client-key-display"
                class="flex-1 text-sm font-mono break-all whitespace-pre-wrap select-all"
              >{{ secretClientKey }}</code>
              <button
                type="button"
                class="shrink-0 p-1.5 rounded hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
                @click="copyElementById('client-key-display')"
              >
                <UIcon
                  name="i-lucide-copy"
                  class="size-4"
                />
              </button>
            </div>
          </div>

          <!-- Secret Key -->
          <div>
            <label class="text-xs font-medium text-gray-500 mb-1 block">Secret Key</label>
            <div class="flex items-start gap-2 p-3 bg-gray-50 rounded-lg border">
              <code
                id="secret-key-input"
                class="flex-1 text-sm font-mono break-all whitespace-pre-wrap select-all"
              >{{ secretKey }}</code>
              <button
                type="button"
                class="shrink-0 p-1.5 rounded hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
                @click="copyElementById('secret-key-input')"
              >
                <UIcon
                  name="i-lucide-copy"
                  class="size-4"
                />
              </button>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end">
          <UButton
            label="Đã lưu, đóng"
            @click="showSecretModal = false"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
