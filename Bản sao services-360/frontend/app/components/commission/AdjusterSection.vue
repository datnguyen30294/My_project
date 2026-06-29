<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type {
  CommissionConfigDetailResourceAdjustersItem,
  AccountResource
} from '#api/generated/laravel'

interface Props {
  projectId: number
  adjusters: CommissionConfigDetailResourceAdjustersItem[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  saved: []
}>()

const toast = useToast()
const isSaving = ref(false)

// Local copy of adjusters for editing
const localAdjusters = ref<CommissionConfigDetailResourceAdjustersItem[]>([...props.adjusters])

watch(() => props.adjusters, (val) => {
  localAdjusters.value = [...val]
})

// Already added account IDs (for filtering search results)
const addedAccountIds = computed(() =>
  new Set(localAdjusters.value.map(a => a.account?.id).filter(Boolean))
)

// --- Server-side account search ---
const searchTerm = ref('')
const fetchedAccounts = ref<{ label: string, value: number, employeeCode: string | null, name: string }[]>([])
const isSearching = ref(false)
let searchTimeout: ReturnType<typeof setTimeout>

async function fetchAccounts(search?: string) {
  isSearching.value = true
  try {
    const query: Record<string, unknown> = { is_active: 1, per_page: 20 }
    if (search) query.search = search
    const res = await $api<{ data: AccountResource[] }>('/pmc/accounts', { query })
    fetchedAccounts.value = (res.data ?? []).map(acc => ({
      label: `${acc.name}${acc.employee_code ? ` (${acc.employee_code})` : ''}`,
      value: acc.id,
      name: acc.name,
      employeeCode: acc.employee_code ?? null
    }))
  } catch {
    fetchedAccounts.value = []
  } finally {
    isSearching.value = false
  }
}

// Load initial list
fetchAccounts()

watch(searchTerm, (val) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => fetchAccounts(val || undefined), 300)
})

// Items for USelectMenu: fetched results minus already-added adjusters and already-selected
const selectItems = computed(() =>
  fetchedAccounts.value.filter(acc => !addedAccountIds.value.has(acc.value))
)

const selectedAccountIds = ref<number[]>([])

function addAdjusters() {
  if (selectedAccountIds.value.length === 0) return

  for (const accId of selectedAccountIds.value) {
    const acc = fetchedAccounts.value.find(a => a.value === accId)
    if (!acc) continue
    localAdjusters.value.push({
      id: 0,
      account: { id: acc.value, name: acc.name, employee_code: acc.employeeCode }
    })
  }
  selectedAccountIds.value = []
  searchTerm.value = ''
  fetchedAccounts.value = []
}

function removeAdjuster(index: number) {
  localAdjusters.value.splice(index, 1)
}

const columns: TableColumn<CommissionConfigDetailResourceAdjustersItem>[] = [
  { id: 'name', header: 'Tên' },
  { id: 'employee_code', header: 'Mã NV' },
  stickyRight<CommissionConfigDetailResourceAdjustersItem>({ id: 'actions', header: '' }, { width: 'w-[80px] min-w-[80px]' })
]

async function save() {
  isSaving.value = true
  try {
    const accountIds = localAdjusters.value
      .map(a => a.account?.id)
      .filter((id): id is number => id != null)

    await apiSaveCommissionAdjusters(props.projectId, { account_ids: accountIds })
    toast.add({ title: 'Đã lưu danh sách người điều chỉnh', color: 'success' })
    emit('saved')
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Lưu thất bại'), color: 'error' })
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <SharedSectionCard title="Người được phép điều chỉnh hoa hồng theo đơn">
    <!-- Add row -->
    <div class="flex items-end gap-3 mb-4">
      <UFormField
        label="Chọn nhân viên"
        class="flex-1"
      >
        <USelectMenu
          v-model="selectedAccountIds"
          v-model:search-term="searchTerm"
          multiple
          :items="selectItems"
          value-key="value"
          ignore-filter
          :loading="isSearching"
          :search-input="{ placeholder: 'Gõ tên hoặc mã NV để tìm...' }"
          placeholder="Chọn nhân viên..."
        />
      </UFormField>
      <UButton
        label="Thêm"
        icon="i-lucide-plus"
        size="sm"
        :disabled="selectedAccountIds.length === 0"
        @click="addAdjusters"
      />
    </div>

    <!-- Table -->
    <div v-if="localAdjusters.length > 0">
      <UTable
        :data="localAdjusters"
        :columns="columns"
      >
        <template #name-cell="{ row }">
          {{ row.original.account?.name ?? '—' }}
        </template>
        <template #employee_code-cell="{ row }">
          <span class="font-mono text-sm text-slate-500">
            {{ row.original.account?.employee_code ?? '—' }}
          </span>
        </template>
        <template #actions-cell="{ row }">
          <UButton
            icon="i-lucide-trash-2"
            variant="ghost"
            color="error"
            size="xs"
            @click="removeAdjuster(row.index)"
          />
        </template>
      </UTable>
    </div>
    <p
      v-else
      class="text-sm text-slate-400 italic"
    >
      Chưa có người điều chỉnh nào.
    </p>

    <!-- Save button -->
    <div class="mt-4 flex justify-end">
      <UButton
        label="Lưu danh sách"
        icon="i-lucide-save"
        color="primary"
        variant="soft"
        size="sm"
        :loading="isSaving"
        @click="save"
      />
    </div>
  </SharedSectionCard>
</template>
