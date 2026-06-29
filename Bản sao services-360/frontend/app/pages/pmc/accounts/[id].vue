<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { AccountResource } from '#api/generated/laravel'
import type { OgTicketItem } from '~/composables/api/useOgTickets'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const id = computed(() => Number(route.params.id))

const { data, status, error, refresh } = useAccountDetail(id)

const { useDynamicLabel } = useBreadcrumb()
useDynamicLabel(computed(() => data.value?.data?.name ?? null))

const account = computed(() => data.value?.data ?? null)

const bankQrUrl = computed(() => {
  const bank = account.value?.bank_info
  if (!bank?.bin || !bank?.account_number) return ''
  return buildVietQrImageUrl({
    bankBin: bank.bin,
    accountNumber: bank.account_number,
    accountName: bank.account_name
  })
})

// --- Tabs ---
const tabItems = [
  { label: 'Tổng quan', value: 'overview', icon: 'i-lucide-user' },
  { label: 'Ticket được giao', value: 'tickets', icon: 'i-lucide-ticket' },
  { label: 'Lịch làm việc', value: 'schedule', icon: 'i-lucide-calendar-days' }
]
const allowedTabs = tabItems.map(t => t.value)
const activeTab = ref(
  typeof route.query.tab === 'string' && allowedTabs.includes(route.query.tab)
    ? route.query.tab
    : 'overview'
)
watch(activeTab, (next) => {
  router.replace({ query: { ...route.query, tab: next } })
})

// --- Assigned Tickets ---
const ticketParams = computed(() => ({ assignee_id: id.value, per_page: 20 as const }))
const { data: ticketData, status: ticketStatus } = useOgTicketList(ticketParams)
const assignedTickets = computed<OgTicketItem[]>(() => ticketData.value?.data ?? [])

const ticketColumns: TableColumn<OgTicketItem>[] = [
  { accessorKey: 'code', header: 'Mã' },
  { accessorKey: 'subject', header: 'Tiêu đề' },
  { id: 'project', header: 'Dự án' },
  { id: 'status', header: 'Trạng thái' },
  { id: 'priority', header: 'Ưu tiên' },
  { id: 'received_at', header: 'Tiếp nhận' }
]

// --- CRUD ---
const crud = useCrudModals<AccountResource>()
const {
  showFormModal, formMode, editTarget, formApiErrors,
  openEditModal,
  showDeleteModal, deleteTarget, openDeleteModal
} = crud
const { isSubmitting: isUpdating, submitForm, isDeleting, submitDelete } = useCrudSubmit(crud, refresh)

function handleFormSubmit(formData: {
  email: string
  name: string
  employee_code: string
  gender: string | undefined
  department_ids: number[]
  job_title_id: number | null
  role_id: number | null
  project_ids: number[]
  is_active: boolean
  password: string
  bank_bin: string
  bank_label: string
  bank_account_number: string
  bank_account_name: string
  capability_rating: number | null
}) {
  submitForm(
    null,
    () => apiUpdateAccount(editTarget.value!.id, {
      name: formData.name,
      gender: (formData.gender as 'male' | 'female' | 'other') ?? null,
      department_ids: formData.department_ids,
      job_title_id: formData.job_title_id!,
      role_id: formData.role_id!,
      project_ids: formData.project_ids.length ? formData.project_ids : null,
      is_active: formData.is_active,
      bank_bin: formData.bank_bin || null,
      bank_label: formData.bank_label || null,
      bank_account_number: formData.bank_account_number || null,
      bank_account_name: formData.bank_account_name || null,
      capability_rating: formData.capability_rating != null ? Number(formData.capability_rating) : null
    }),
    { update: 'Cập nhật tài khoản thành công' }
  )
}

// --- Change Password ---
const toast = useToast()
const showPasswordModal = ref(false)
const passwordTarget = ref<AccountResource | null>(null)
const passwordApiErrors = ref<Record<string, string[]>>({})
const isChangingPassword = ref(false)

function openPasswordModal(item: AccountResource) {
  passwordTarget.value = item
  passwordApiErrors.value = {}
  showPasswordModal.value = true
}

async function handlePasswordSubmit(formData: { password: string, password_confirmation: string }) {
  passwordApiErrors.value = {}
  if (!passwordTarget.value) return

  isChangingPassword.value = true
  try {
    await apiChangeAccountPassword(passwordTarget.value.id, formData)
    toast.add({ title: 'Đổi mật khẩu thành công', color: 'success' })
    showPasswordModal.value = false
  } catch (err) {
    const errors = getApiValidationErrors(err)
    if (errors) {
      passwordApiErrors.value = errors
    } else {
      toast.add({ title: getApiErrorMessage(err, 'Đổi mật khẩu thất bại'), color: 'error' })
    }
  } finally {
    isChangingPassword.value = false
  }
}

// --- Delete ---
function handleDelete() {
  submitDelete(
    () => apiDeleteAccount(deleteTarget.value!.id),
    { message: 'Xoá tài khoản thành công', navigateAfter: '/pmc/accounts' }
  )
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex items-center gap-4">
      <UButton
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
        to="/pmc/accounts"
      />
      <div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight">
          Chi tiết tài khoản
        </h1>
        <p class="text-slate-500 text-sm mt-0.5">
          {{ account?.name ?? '...' }}
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="status === 'pending'"
      class="flex flex-col gap-6"
    >
      <div class="h-32 bg-slate-100 rounded-xl animate-pulse" />
      <div class="h-96 bg-slate-100 rounded-xl animate-pulse" />
    </div>

    <!-- Error -->
    <SharedCrudPageError
      v-else-if="error"
      :error="error"
      :retry="refresh"
    />

    <!-- Content -->
    <div
      v-else-if="account"
      class="flex flex-col gap-6"
    >
      <!-- Identity header card -->
      <div class="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div class="flex items-start gap-5 min-w-0">
            <UAvatar
              :src="account.avatar_url ?? undefined"
              :alt="account.name"
              size="3xl"
            />
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="text-lg font-bold text-slate-900 truncate">
                  {{ account.name }}
                </h2>
                <SharedStatusBadge :active="Boolean(account.is_active)" />
                <SharedCapabilityRatingBadge
                  :rating="account.capability_rating"
                  size="sm"
                />
                <UTooltip
                  v-if="account.has_active_assignment"
                  :text="`Đang xử lý ${account.active_assignment_count} ticket chưa hoàn thành`"
                >
                  <UBadge
                    :label="`Đang giao việc (${account.active_assignment_count})`"
                    color="warning"
                    variant="subtle"
                    size="sm"
                    icon="i-lucide-loader-circle"
                  />
                </UTooltip>
                <UBadge
                  v-else
                  label="Rảnh"
                  color="neutral"
                  variant="subtle"
                  size="sm"
                />
              </div>
              <p class="text-sm text-slate-500 mt-1">
                {{ account.email }}
              </p>
              <div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
                <span
                  v-if="account.employee_code"
                  class="inline-flex items-center gap-1"
                >
                  <UIcon
                    name="i-lucide-hash"
                    class="size-3.5 text-slate-400"
                  />
                  {{ account.employee_code }}
                </span>
                <template v-if="account.departments?.length">
                  <NuxtLink
                    v-for="dept in account.departments"
                    :key="dept.id"
                    :to="`/pmc/departments/${dept.id}`"
                    class="inline-flex items-center gap-1 text-primary-600 hover:underline"
                  >
                    <UIcon
                      name="i-lucide-building-2"
                      class="size-3.5"
                    />
                    {{ dept.name }}
                  </NuxtLink>
                </template>
                <NuxtLink
                  v-if="account.job_title"
                  :to="`/pmc/job-titles/${account.job_title.id}`"
                  class="inline-flex items-center gap-1 text-primary-600 hover:underline"
                >
                  <UIcon
                    name="i-lucide-briefcase"
                    class="size-3.5"
                  />
                  {{ account.job_title.name }}
                </NuxtLink>
                <NuxtLink
                  v-if="account.role"
                  :to="`/pmc/roles/${account.role.id}`"
                  class="inline-flex items-center gap-1 text-primary-600 hover:underline"
                >
                  <UIcon
                    name="i-lucide-shield"
                    class="size-3.5"
                  />
                  {{ account.role.name }}
                </NuxtLink>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2 shrink-0">
            <UButton
              icon="i-lucide-pencil"
              label="Chỉnh sửa"
              variant="soft"
              color="primary"
              @click="openEditModal(account)"
            />
            <UButton
              icon="i-lucide-key-round"
              label="Đổi mật khẩu"
              variant="soft"
              color="neutral"
              @click="openPasswordModal(account)"
            />
            <UButton
              icon="i-lucide-trash-2"
              variant="soft"
              color="error"
              aria-label="Xoá tài khoản"
              @click="openDeleteModal(account)"
            />
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <UTabs
        v-model="activeTab"
        :items="tabItems"
        variant="link"
        :content="false"
        class="w-full"
      />

      <!-- Tab: Tổng quan -->
      <div
        v-if="activeTab === 'overview'"
        class="flex flex-col gap-6"
      >
        <SharedSectionCard title="Thông tin chi tiết">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <SharedFieldDisplay label="Họ tên">
              <span class="font-medium">{{ account.name }}</span>
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Email">
              <span class="font-medium">{{ account.email }}</span>
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Mã nhân viên">
              <span class="font-medium">{{ account.employee_code ?? '—' }}</span>
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Giới tính">
              <span class="font-medium">{{ account.gender?.label ?? '—' }}</span>
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Phòng ban">
              <div
                v-if="account.departments?.length"
                class="flex flex-wrap gap-2"
              >
                <NuxtLink
                  v-for="dept in account.departments"
                  :key="dept.id"
                  :to="`/pmc/departments/${dept.id}`"
                  class="font-medium text-primary-600 hover:text-primary-800 hover:underline"
                >
                  {{ dept.name }}
                </NuxtLink>
              </div>
              <span
                v-else
                class="text-slate-400"
              >—</span>
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Chức danh">
              <NuxtLink
                v-if="account.job_title"
                :to="`/pmc/job-titles/${account.job_title.id}`"
                class="font-medium text-primary-600 hover:text-primary-800 hover:underline"
              >
                {{ account.job_title.name }}
              </NuxtLink>
              <span
                v-else
                class="text-slate-400"
              >—</span>
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Vai trò">
              <NuxtLink
                v-if="account.role"
                :to="`/pmc/roles/${account.role.id}`"
                class="font-medium text-primary-600 hover:text-primary-800 hover:underline"
              >
                {{ account.role.name }}
              </NuxtLink>
              <span
                v-else
                class="text-slate-400"
              >—</span>
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Trạng thái">
              <SharedStatusBadge :active="Boolean(account.is_active)" />
            </SharedFieldDisplay>
            <SharedFieldDisplay label="Năng lực">
              <SharedCapabilityRatingBadge
                :rating="account.capability_rating"
                show-when-null
                null-label="Chưa đánh giá"
              />
            </SharedFieldDisplay>
          </div>
        </SharedSectionCard>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SharedSectionCard title="Thông tin ngân hàng">
            <template #header-actions>
              <UBadge
                v-if="account.bank_info"
                label="Đã cấu hình"
                color="success"
                variant="subtle"
                size="sm"
              />
              <UBadge
                v-else
                label="Chưa cấu hình"
                color="neutral"
                variant="subtle"
                size="sm"
              />
            </template>

            <div
              v-if="account.bank_info"
              class="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"
            >
              <div class="grid grid-cols-1 gap-5 flex-1 min-w-0">
                <SharedFieldDisplay label="Ngân hàng">
                  <span class="font-medium">{{ account.bank_info.label || '—' }}</span>
                  <span class="text-xs text-slate-400 ml-2 font-mono">({{ account.bank_info.bin }})</span>
                </SharedFieldDisplay>
                <SharedFieldDisplay label="Số tài khoản">
                  <span class="font-mono font-medium">{{ account.bank_info.account_number }}</span>
                </SharedFieldDisplay>
                <SharedFieldDisplay label="Chủ tài khoản">
                  <span class="font-medium uppercase">{{ account.bank_info.account_name }}</span>
                </SharedFieldDisplay>
              </div>
              <div
                v-if="bankQrUrl"
                class="flex flex-col items-center gap-2 shrink-0"
              >
                <img
                  :src="bankQrUrl"
                  :alt="`QR ngân hàng ${account.name}`"
                  class="w-[220px] rounded-lg border border-slate-200 bg-white"
                  width="220"
                  height="280"
                  loading="lazy"
                >
                <p class="text-[11px] text-slate-400 text-center max-w-[220px]">
                  Quét bằng app ngân hàng để chuyển khoản (VietQR)
                </p>
              </div>
            </div>
            <UAlert
              v-else
              icon="i-lucide-info"
              color="neutral"
              variant="subtle"
              title="Chưa cấu hình thông tin ngân hàng"
              description="Cấu hình STK để hệ thống sinh QR khi chuyển tiền ứng vật tư hoặc tiền hoa hồng cho nhân sự."
            />
          </SharedSectionCard>

          <SharedSectionCard title="Dự án tham gia">
            <template #header-actions>
              <span class="text-xs text-slate-500">
                {{ account.projects?.length ?? 0 }} dự án
              </span>
            </template>

            <template v-if="account.projects?.length">
              <div class="flex flex-wrap gap-2">
                <NuxtLink
                  v-for="project in account.projects"
                  :key="project.id"
                  :to="`/pmc/projects/${project.id}`"
                >
                  <UBadge
                    :label="project.name"
                    color="primary"
                    variant="subtle"
                    size="md"
                    class="cursor-pointer hover:opacity-80"
                  />
                </NuxtLink>
              </div>
            </template>
            <div
              v-else
              class="py-6 text-center"
            >
              <UIcon
                name="i-lucide-folder-open"
                class="text-slate-300 size-10 mx-auto mb-3"
              />
              <p class="text-sm text-slate-500">
                Chưa tham gia dự án nào
              </p>
            </div>
          </SharedSectionCard>
        </div>
      </div>

      <!-- Tab: Ticket được giao -->
      <div
        v-else-if="activeTab === 'tickets'"
        class="flex flex-col gap-6"
      >
        <SharedSectionCard title="Ticket được giao">
          <template #header-actions>
            <span class="text-xs text-slate-500">
              {{ assignedTickets.length }} ticket
            </span>
          </template>

          <div
            v-if="ticketStatus === 'pending'"
            class="py-6 flex justify-center"
          >
            <UIcon
              name="i-lucide-loader-2"
              class="size-5 animate-spin text-slate-400"
            />
          </div>

          <template v-else-if="assignedTickets.length">
            <UTable
              :data="assignedTickets"
              :columns="ticketColumns"
              :ui="{ tr: 'cursor-pointer hover:bg-slate-50' }"
            >
              <template #code-cell="{ row }">
                <NuxtLink
                  :to="`/pmc/og-tickets/${row.original.id}`"
                  class="font-medium text-primary-600 hover:underline"
                >
                  {{ row.original.code ?? `#${row.original.id}` }}
                </NuxtLink>
              </template>

              <template #subject-cell="{ row }">
                <span class="line-clamp-1 max-w-xs">{{ row.original.subject }}</span>
              </template>

              <template #project-cell="{ row }">
                {{ row.original.project?.name ?? '—' }}
              </template>

              <template #status-cell="{ row }">
                <UBadge
                  :label="row.original.status.label"
                  :color="ogTicketStatusColor(row.original.status.value)"
                  variant="subtle"
                  size="sm"
                />
              </template>

              <template #priority-cell="{ row }">
                <UBadge
                  :label="row.original.priority.label"
                  :color="ogTicketPriorityColor(row.original.priority.value)"
                  variant="subtle"
                  size="sm"
                />
              </template>

              <template #received_at-cell="{ row }">
                <span class="text-sm text-slate-500">
                  {{ formatDateTime(row.original.received_at ?? null) }}
                </span>
              </template>
            </UTable>
          </template>

          <div
            v-else
            class="py-6 text-center"
          >
            <UIcon
              name="i-lucide-ticket"
              class="text-slate-300 size-10 mx-auto mb-3"
            />
            <p class="text-sm text-slate-500">
              Chưa có ticket nào được giao
            </p>
          </div>
        </SharedSectionCard>
      </div>

      <!-- Tab: Lịch làm việc -->
      <div
        v-else-if="activeTab === 'schedule'"
        class="flex flex-col gap-6"
      >
        <SharedSectionCard title="Lịch làm việc cá nhân">
          <SharedAccountSchedulePanel :account-id="id" />
        </SharedSectionCard>
      </div>
    </div>

    <!-- Modals -->
    <AccountFormModal
      v-model:open="showFormModal"
      :mode="formMode"
      :item="editTarget"
      :loading="isUpdating"
      :api-errors="formApiErrors"
      @submit="handleFormSubmit"
      @avatar-changed="refresh()"
    />

    <AccountChangePasswordModal
      v-model:open="showPasswordModal"
      :item="passwordTarget"
      :loading="isChangingPassword"
      :api-errors="passwordApiErrors"
      @submit="handlePasswordSubmit"
    />

    <SharedCrudDeleteModal
      v-model:open="showDeleteModal"
      title="Xoá tài khoản"
      :item-name="deleteTarget?.name"
      :loading="isDeleting"
      @confirm="handleDelete"
    />
  </div>
</template>
