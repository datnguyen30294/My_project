<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type {
  ListPartnerOffersParams,
  PartnerOffer,
  VendorOfferStatusValue,
  VendorOfferTypeValue
} from '~/composables/api/usePartners'
import { usePlatformPartnerOffers } from '~/composables/api/usePartners'

interface Props {
  partnerId: number | string
}

const props = defineProps<Props>()

const params = reactive<ListPartnerOffersParams>({
  search: undefined,
  type: undefined,
  status: undefined,
  per_page: DEFAULT_PER_PAGE
})
const page = ref(1)

const { searchInput, onSearch } = useTableSearch((value) => {
  params.search = value || undefined
  page.value = 1
})

const typeItems: { label: string, value: VendorOfferTypeValue | undefined }[] = [
  { label: 'Tất cả loại', value: undefined },
  { label: 'Bán sản phẩm', value: 'sale' },
  { label: 'Cho thuê', value: 'rental' },
  { label: 'Dịch vụ', value: 'service' }
]

const statusItems: { label: string, value: VendorOfferStatusValue | undefined }[] = [
  { label: 'Tất cả trạng thái', value: undefined },
  { label: 'Công khai', value: 'published' },
  { label: 'Ẩn', value: 'draft' }
]

const { data, status, error } = usePlatformPartnerOffers(
  () => props.partnerId,
  computed(() => ({ ...params, page: page.value }))
)

const offers = computed<PartnerOffer[]>(() => data.value?.data ?? [])
const schemaMissing = computed(() => data.value?.warnings?.schema_missing ?? false)

type BadgeColor = 'neutral' | 'success' | 'warning' | 'error'

function offerStatusColor(color: string): BadgeColor {
  return (['neutral', 'success', 'warning', 'error'].includes(color) ? color : 'neutral') as BadgeColor
}

/** Platform detail route of the operating company (PMC tenant). */
function tenantTo(tenantId: string): string {
  return `/platform/tenants/${tenantId}`
}

/** Platform project detail route — the page reads the tenant from `?tenant=`. */
function projectTo(projectId: number, tenantId: string): string {
  return `/platform/quan-ly-van-hanh/du-an-tren-nen-tang/${projectId}?tenant=${tenantId}`
}

const columns: TableColumn<PartnerOffer>[] = [
  { id: 'name', header: 'Tên gói' },
  { id: 'type', header: 'Loại' },
  { id: 'tenant', header: 'Công ty vận hành' },
  { id: 'project', header: 'Dự án' },
  { accessorKey: 'price', header: 'Đơn giá' },
  { id: 'unit', header: 'Đơn vị' },
  { id: 'status', header: 'Trạng thái' }
]
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-3 flex-wrap">
      <UInput
        v-model="searchInput"
        icon="i-lucide-search"
        placeholder="Tìm theo tên gói..."
        class="max-w-xs"
        @update:model-value="onSearch"
      />
      <USelect
        v-model="params.type"
        :items="typeItems"
        value-key="value"
        class="min-w-[160px]"
      />
      <USelect
        v-model="params.status"
        :items="statusItems"
        value-key="value"
        class="min-w-[180px]"
      />
    </div>

    <UAlert
      v-if="schemaMissing"
      color="warning"
      variant="subtle"
      icon="i-lucide-database"
      title="Chưa có danh mục sản phẩm"
      description="Vendor chưa được kết nối với gian hàng trên resi_mart nên chưa có sản phẩm."
    />

    <UAlert
      v-else-if="error"
      color="error"
      variant="subtle"
      icon="i-lucide-alert-circle"
      description="Không thể tải danh sách sản phẩm."
    />

    <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <UTable
        :data="offers"
        :columns="columns"
        :loading="status === 'pending'"
      >
        <template #name-cell="{ row }">
          <div>
            <p class="text-sm font-medium text-slate-900">
              {{ row.original.name }}
            </p>
            <p
              v-if="row.original.sku"
              class="text-xs text-slate-500 font-mono"
            >
              {{ row.original.sku }}
            </p>
          </div>
        </template>

        <template #type-cell="{ row }">
          <UBadge
            color="neutral"
            variant="subtle"
            :label="row.original.type.label"
          />
        </template>

        <template #tenant-cell="{ row }">
          <NuxtLink
            v-if="row.original.tenant_id"
            :to="tenantTo(row.original.tenant_id)"
            class="text-sm text-primary-700 hover:underline"
          >
            {{ row.original.tenant_name ?? row.original.tenant_id }}
          </NuxtLink>
          <span
            v-else
            class="text-sm text-slate-400"
          >
            Chưa niêm yết
          </span>
        </template>

        <template #project-cell="{ row }">
          <div
            v-if="row.original.project_id"
            class="flex items-center gap-2"
          >
            <NuxtLink
              v-if="row.original.tenant_id"
              :to="projectTo(row.original.project_id, row.original.tenant_id)"
              class="text-sm text-primary-700 hover:underline"
            >
              {{ row.original.project_name ?? `Dự án #${row.original.project_id}` }}
            </NuxtLink>
            <span
              v-else
              class="text-sm text-slate-900"
            >
              {{ row.original.project_name ?? `Dự án #${row.original.project_id}` }}
            </span>
            <UBadge
              v-if="row.original.is_active === false"
              color="warning"
              variant="subtle"
              label="Tạm dừng"
            />
          </div>
          <span
            v-else
            class="text-sm text-slate-400"
          >
            —
          </span>
        </template>

        <template #price-cell="{ row }">
          <span class="font-medium">{{ formatCurrency(row.original.price) }}</span>
        </template>

        <template #unit-cell="{ row }">
          <span class="text-sm text-slate-600">{{ row.original.unit ?? '—' }}</span>
        </template>

        <template #status-cell="{ row }">
          <UBadge
            :color="offerStatusColor(row.original.status.color)"
            variant="subtle"
            :label="row.original.status.label"
          />
        </template>

        <template #empty>
          <div class="py-8 text-center text-sm text-slate-500">
            Chưa có sản phẩm nào.
          </div>
        </template>
      </UTable>

      <SharedCrudTablePagination
        v-model:page="page"
        :meta="data?.meta"
      />
    </div>
  </div>
</template>
