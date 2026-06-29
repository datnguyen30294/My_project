<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { PartnerListItem, ListTenantPartnersParams } from '~/composables/api/usePartners'

const emit = defineEmits<{
  attached: [vendorId: number]
}>()

const toast = useToast()

// ─── Catalog list ─────────────────────────────────────
const params = reactive<ListTenantPartnersParams>({
  search: undefined,
  per_page: DEFAULT_PER_PAGE
})
const page = ref(1)

const { searchInput, onSearch } = useTableSearch((value) => {
  params.search = value || undefined
  page.value = 1
})

const { data, status, error, refresh } = useTenantPartnerCatalog(
  computed(() => ({ ...params, page: page.value }))
)
const vendors = computed<PartnerListItem[]>(() => data.value?.data ?? [])

const columns: TableColumn<PartnerListItem>[] = [
  { id: 'logo', header: '' },
  { id: 'name', header: 'Vendor' },
  { id: 'categories', header: 'Danh mục' },
  { id: 'owner', header: 'Nguồn' },
  { id: 'linked', header: 'Đã dùng' },
  stickyRight<PartnerListItem>({ id: 'actions', header: '' }, { width: 'w-[140px] min-w-[140px]' })
]

function firstChar(name: string | null | undefined): string {
  const trimmed = (name ?? '').trim()
  return trimmed ? trimmed.charAt(0).toUpperCase() : '?'
}

// ─── Project options ──────────────────────────────────
const { data: projectsData, status: projectsStatus } = useProjectList(
  computed(() => ({ per_page: SELECT_ALL_PER_PAGE }))
)
const projectOptions = computed(() =>
  (projectsData.value?.data ?? []).map(p => ({ label: p.name, value: p.id }))
)

// ─── Attach modal ─────────────────────────────────────
const attachOpen = ref(false)
const selectedVendor = ref<PartnerListItem | null>(null)
const selectedProjectIds = ref<number[]>([])
const isAttaching = ref(false)

function openAttach(vendor: PartnerListItem) {
  selectedVendor.value = vendor
  selectedProjectIds.value = []
  attachOpen.value = true
}

async function confirmAttach() {
  if (!selectedVendor.value || selectedProjectIds.value.length === 0) return
  isAttaching.value = true
  try {
    await apiAttachTenantPartner(selectedVendor.value.id, [...selectedProjectIds.value])
    toast.add({
      title: 'Đã thêm vendor vào dự án',
      description: `${selectedVendor.value.display_name ?? selectedVendor.value.name} giờ có thể phục vụ các dự án đã chọn.`,
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
    const attachedId = selectedVendor.value.id
    attachOpen.value = false
    selectedVendor.value = null
    await refresh()
    emit('attached', attachedId)
  } catch (err) {
    toast.add({
      title: getApiErrorMessage(err, 'Thêm vendor vào dự án thất bại'),
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  } finally {
    isAttaching.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <UInput
      v-model="searchInput"
      icon="i-lucide-search"
      placeholder="Tìm vendor theo tên, slug, email..."
      class="max-w-sm"
      @update:model-value="onSearch"
    />

    <UAlert
      v-if="error"
      icon="i-lucide-alert-circle"
      color="error"
      variant="subtle"
      description="Không thể tải danh mục vendor. Vui lòng thử lại."
    />

    <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <UTable
        :data="vendors"
        :columns="columns"
        :loading="status === 'pending'"
        empty="Chưa có vendor active nào trên hệ thống."
      >
        <template #logo-cell="{ row }">
          <UAvatar
            :src="row.original.logo_url ?? undefined"
            :alt="row.original.name"
            :text="firstChar(row.original.display_name ?? row.original.name)"
            size="sm"
          />
        </template>

        <template #name-cell="{ row }">
          <div class="flex flex-col">
            <span class="font-medium text-slate-900">{{ row.original.display_name ?? row.original.name }}</span>
            <span class="font-mono text-xs text-slate-500">{{ row.original.slug }}</span>
          </div>
        </template>

        <template #categories-cell="{ row }">
          <div class="flex flex-wrap gap-1">
            <UBadge
              v-for="cat in row.original.categories.slice(0, 3)"
              :key="cat"
              variant="subtle"
              color="info"
              :label="cat"
              size="xs"
            />
            <span
              v-if="!row.original.categories?.length"
              class="text-xs text-gray-400"
            >—</span>
          </div>
        </template>

        <template #owner-cell="{ row }">
          <UBadge
            :color="row.original.owner_source.value === 'platform' ? 'primary' : 'neutral'"
            variant="subtle"
            :label="row.original.owner_source.value === 'platform' ? 'Platform' : 'PMC khác'"
            size="xs"
          />
        </template>

        <template #linked-cell="{ row }">
          <UBadge
            v-if="row.original.is_linked"
            color="success"
            variant="subtle"
            label="Đã dùng"
            icon="i-lucide-check"
            size="xs"
          />
          <span
            v-else
            class="text-xs text-slate-400"
          >—</span>
        </template>

        <template #actions-cell="{ row }">
          <UButton
            icon="i-lucide-plus"
            :label="row.original.is_linked ? 'Thêm dự án' : 'Thêm'"
            color="primary"
            variant="soft"
            size="xs"
            @click="openAttach(row.original)"
          />
        </template>
      </UTable>

      <SharedCrudTablePagination
        v-model:page="page"
        :meta="data?.meta"
      />
    </div>

    <UModal
      v-model:open="attachOpen"
      :title="`Thêm '${selectedVendor?.display_name ?? selectedVendor?.name}' vào dự án`"
    >
      <template #body>
        <div class="flex flex-col gap-4">
          <p class="text-sm text-slate-500">
            Chọn các dự án mà vendor này được phép phục vụ. Vendor không bị thay đổi — bạn chỉ liên kết nó với dự án của mình.
          </p>
          <UFormField
            label="Dự án"
            required
          >
            <USelectMenu
              v-model="selectedProjectIds"
              :items="projectOptions"
              value-key="value"
              multiple
              searchable
              :loading="projectsStatus === 'pending'"
              placeholder="Chọn dự án..."
              class="w-full"
            />
          </UFormField>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton
            label="Huỷ"
            color="neutral"
            variant="ghost"
            :disabled="isAttaching"
            @click="attachOpen = false"
          />
          <UButton
            label="Thêm vào dự án"
            icon="i-lucide-check"
            color="primary"
            :loading="isAttaching"
            :disabled="selectedProjectIds.length === 0"
            @click="confirmAttach"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
