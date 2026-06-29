<script setup lang="ts">
import type { OrganizationItem } from '~/composables/api/useOrganizations'
import type { PartnerListItem } from '~/composables/api/usePartners'
import type {
  CommissionModeValue,
  ContractTerms,
  CreateContractDraftPayload,
  RevenueRecipientValue
} from '~/composables/api/usePartnerCommissionContracts'
import {
  COMMISSION_MODE_OPTIONS,
  defaultTermsFor,
  REVENUE_RECIPIENT_OPTIONS
} from '~/composables/api/usePartnerCommissionContracts'

interface Props {
  modelValue: CreateContractDraftPayload
  apiErrors?: Record<string, string[]>
  /** Disable identity fields when editing pending contracts. */
  disableIdentity?: boolean
  /** Disable all terms/financial fields. */
  disableTerms?: boolean
  submitting?: boolean
  /**
   * Scope this form runs in. Tenant scope hides the tenant picker and
   * uses tenant-accessible APIs for partner / project lookups.
   */
  scope?: 'platform' | 'tenant'
  /** When scope='tenant', the tenant id of the current user (auto-set). */
  currentTenantId?: string
}

const props = withDefaults(defineProps<Props>(), {
  apiErrors: () => ({}),
  disableIdentity: false,
  disableTerms: false,
  submitting: false,
  scope: 'platform',
  currentTenantId: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: CreateContractDraftPayload]
}>()

const isTenant = computed(() => props.scope === 'tenant')

function update<K extends keyof CreateContractDraftPayload>(
  key: K,
  value: CreateContractDraftPayload[K]
): void {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

function updateMode(mode: CommissionModeValue): void {
  emit('update:modelValue', {
    ...props.modelValue,
    commission_mode: mode,
    terms: defaultTermsFor(mode)
  })
}

function updateTerms(terms: ContractTerms): void {
  emit('update:modelValue', { ...props.modelValue, terms })
}

function err(field: string): string | undefined {
  return props.apiErrors[field]?.[0]
}

// In tenant scope, ensure tenant_id is set on the draft (BE also enforces).
if (isTenant.value && props.currentTenantId && props.modelValue.tenant_id !== props.currentTenantId) {
  update('tenant_id', props.currentTenantId)
}

// ─── Partner (vendor) lookup ───────────────────────────────────

const partnerSearch = ref('')

const platformPartnersFetch = !isTenant.value
  ? usePlatformPartnerList(
      computed(() => ({ search: partnerSearch.value || undefined, per_page: 50 }))
    )
  : null

const tenantPartnersFetch = isTenant.value
  ? useTenantPartnerList(
      computed(() => ({ search: partnerSearch.value || undefined, per_page: 50 }))
    )
  : null

const partnersData = computed(() =>
  isTenant.value ? tenantPartnersFetch?.data.value : platformPartnersFetch?.data.value
)
const partnersStatus = computed(() =>
  isTenant.value ? tenantPartnersFetch?.status.value : platformPartnersFetch?.status.value
)

const partnerOptions = computed(() =>
  (partnersData.value?.data ?? []).map((p: PartnerListItem) => ({
    label: `${p.name} (${p.slug})`,
    value: p.id
  }))
)

// ─── Tenant lookup (platform scope only) ───────────────────────

const tenantSearch = ref('')
const platformTenantsFetch = !isTenant.value
  ? usePlatformOrganizationList(
      computed(() => ({ search: tenantSearch.value || undefined }))
    )
  : null
const tenantOptions = computed(() =>
  (platformTenantsFetch?.data.value?.data ?? []).map((o: OrganizationItem) => ({
    label: `${o.id} — ${o.name}`,
    value: o.id
  }))
)

// ─── Project lookup ────────────────────────────────────────────

const projectOptions = ref<{ label: string, value: number }[]>([])
const projectsLoading = ref(false)

async function loadProjectsFromPlatform(tenantId: string): Promise<void> {
  if (!tenantId) {
    projectOptions.value = []
    return
  }
  projectsLoading.value = true
  try {
    const projects = await apiGetOrganizationProjects(tenantId)
    projectOptions.value = projects.map(p => ({ label: p.name, value: Number(p.id) }))
  } finally {
    projectsLoading.value = false
  }
}

// Tenant scope: use the in-tenant project list (no need to pick tenant first).
const tenantProjectsFetch = isTenant.value
  ? useProjectList(computed(() => ({ per_page: SELECT_ALL_PER_PAGE })))
  : null

watch(
  () => tenantProjectsFetch?.data.value,
  (d) => {
    if (!isTenant.value || !d) return
    projectOptions.value = (d.data ?? []).map(p => ({ label: p.name, value: Number(p.id) }))
  },
  { immediate: true }
)

watch(
  () => props.modelValue.tenant_id,
  async (newId, oldId) => {
    if (isTenant.value) return
    if (!newId || newId === oldId) {
      if (!newId) projectOptions.value = []
      return
    }
    await loadProjectsFromPlatform(newId)
  },
  { immediate: true }
)
</script>

<template>
  <div class="space-y-6">
    <!-- Section 1: Identity -->
    <SharedSectionCard title="Thông tin cơ bản">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <UFormField
          label="Vendor"
          required
          :error="err('partner_id')"
        >
          <USelectMenu
            :model-value="modelValue.partner_id || undefined"
            :items="partnerOptions"
            value-key="value"
            placeholder="Chọn vendor..."
            searchable
            :loading="partnersStatus === 'pending'"
            :disabled="disableIdentity"
            class="w-full"
            @update:search-term="(v: string) => (partnerSearch = v)"
            @update:model-value="(v: number | null) => update('partner_id', Number(v ?? 0))"
          />
        </UFormField>

        <UFormField
          label="Mã hợp đồng"
          help="Để trống → tự sinh HD-YYYY-NNNN"
          :error="err('contract_code')"
        >
          <UInput
            :model-value="modelValue.contract_code ?? ''"
            placeholder="HD-2026-0001"
            :disabled="submitting"
            @update:model-value="(v) => update('contract_code', String(v || ''))"
          />
        </UFormField>

        <UFormField
          v-if="!isTenant"
          label="Tenant (PMC)"
          required
          :error="err('tenant_id')"
        >
          <USelectMenu
            :model-value="modelValue.tenant_id || undefined"
            :items="tenantOptions"
            value-key="value"
            placeholder="Chọn tenant..."
            searchable
            :disabled="disableIdentity"
            class="w-full"
            @update:search-term="(v: string) => (tenantSearch = v)"
            @update:model-value="(v: string | null) => update('tenant_id', String(v ?? ''))"
          />
        </UFormField>

        <UFormField
          v-else
          label="Tenant"
          help="Tự động gắn vào đơn vị của bạn"
        >
          <UInput
            :model-value="currentTenantId || modelValue.tenant_id"
            disabled
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Dự án"
          required
          :error="err('project_id')"
          :help="!isTenant && !modelValue.tenant_id ? 'Vui lòng chọn tenant trước' : undefined"
        >
          <USelectMenu
            :model-value="modelValue.project_id || undefined"
            :items="projectOptions"
            value-key="value"
            placeholder="Chọn dự án..."
            searchable
            :loading="projectsLoading"
            :disabled="disableIdentity || (!isTenant && !modelValue.tenant_id)"
            class="w-full"
            @update:model-value="(v: number | null) => update('project_id', Number(v ?? 0))"
          />
        </UFormField>

        <UFormField
          label="Ngày bắt đầu"
          required
          :error="err('starts_at')"
        >
          <UInput
            type="date"
            :model-value="modelValue.starts_at?.substring(0, 10) ?? ''"
            :disabled="disableTerms"
            @update:model-value="(v) => update('starts_at', String(v || ''))"
          />
        </UFormField>

        <UFormField
          label="Ngày kết thúc"
          help="Để trống = không thời hạn"
          :error="err('ends_at')"
        >
          <UInput
            type="date"
            :model-value="modelValue.ends_at?.substring(0, 10) ?? ''"
            :disabled="disableTerms"
            @update:model-value="(v) => update('ends_at', v ? String(v) : null)"
          />
        </UFormField>
      </div>
    </SharedSectionCard>

    <!-- Section 2: Mode -->
    <SharedSectionCard title="Loại hợp đồng">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          v-for="opt in COMMISSION_MODE_OPTIONS"
          :key="opt.value"
          type="button"
          :disabled="disableTerms"
          class="text-left border-2 rounded-lg p-4 transition-colors"
          :class="[
            modelValue.commission_mode === opt.value
              ? 'border-primary-500 bg-primary-50/50'
              : 'border-slate-200 hover:border-slate-300',
            disableTerms ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
          ]"
          @click="!disableTerms && updateMode(opt.value)"
        >
          <p class="font-semibold text-slate-900">
            {{ opt.label }}
          </p>
          <p class="text-xs text-slate-500 mt-1">
            <span v-if="opt.value === 'per_order'">% hoặc tiền cứng mỗi đơn + chia tỉ lệ cho các bên</span>
            <span v-else-if="opt.value === 'revenue_share'">Bậc thang doanh thu theo tháng/quý</span>
            <span v-else>Phí cố định theo tháng / quý / năm</span>
          </p>
        </button>
      </div>
      <p
        v-if="err('commission_mode')"
        class="text-xs text-red-600 mt-2"
      >
        {{ err('commission_mode') }}
      </p>

      <UFormField
        label="Doanh thu thuộc về"
        help="Ai nhận hoa hồng từ các đơn của vendor ở dự án này."
        class="mt-5 max-w-sm"
        :error="err('revenue_recipient')"
      >
        <USelect
          :model-value="modelValue.revenue_recipient"
          :items="REVENUE_RECIPIENT_OPTIONS"
          value-key="value"
          :disabled="disableTerms"
          class="w-full"
          @update:model-value="(v) => update('revenue_recipient', v as RevenueRecipientValue)"
        />
      </UFormField>
    </SharedSectionCard>

    <!-- Section 3: Terms -->
    <SharedSectionCard title="Điều khoản">
      <PartnerCommissionContractTermsEditor
        :mode="modelValue.commission_mode"
        :model-value="modelValue.terms"
        :disabled="disableTerms"
        :errors="apiErrors"
        @update:model-value="updateTerms"
      />
    </SharedSectionCard>

    <!-- Section 4: Notes -->
    <SharedSectionCard title="Ghi chú">
      <UFormField :error="err('notes')">
        <UTextarea
          :model-value="modelValue.notes ?? ''"
          :rows="3"
          :maxlength="2000"
          placeholder="Ghi chú nội bộ (tối đa 2000 ký tự)..."
          class="w-full"
          :disabled="submitting"
          @update:model-value="(v) => update('notes', String(v || ''))"
        />
      </UFormField>
    </SharedSectionCard>
  </div>
</template>
