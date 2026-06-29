<script setup lang="ts">
import type {
  PartyRuleForm,
  DeptRuleForm,
  StaffRuleForm,
  CommissionValueType,
  CommissionPartyType,
  AvailableDepartment,
  CommissionConfigDetailResource,
  CommissionConfigDetailResourcePartyRulesItem,
  CommissionConfigDetailResourceDeptRulesItem,
  CommissionConfigDetailResourceDeptRulesItemStaffRulesItem
} from '~/composables/api/useCommissionConfig'
import type { MindmapNode } from '~/composables/useCommissionMindmap'

definePageMeta({ layout: 'default' })

const route = useRoute()
const toast = useToast()
const projectId = computed(() => Number(route.params.projectId))

// ─── Data loading ───
const { data: configData, status: configStatus, error: configError, refresh: refreshConfig } = useCommissionConfig(projectId)
const { data: deptsData, status: deptsStatus } = useAvailableDepartments(projectId)

const isLoading = computed(() => configStatus.value === 'pending' || deptsStatus.value === 'pending')

const configDetail = computed(() => configData.value?.data)
const project = computed(() => configDetail.value?.project)
const platformConfig = computed(() => configDetail.value?.platform ?? { percent: 5, value_fixed: 1000, source: 'fallback' })
const availableDepartments = computed<AvailableDepartment[]>(() => deptsData.value?.data ?? [])

// ─── Breadcrumb ───
const { useDynamicLabel } = useBreadcrumb()
useDynamicLabel(computed(() => project.value?.name ?? null))

useSeoMeta({
  title: computed(() =>
    project.value ? `${project.value.code} - Cấu hình hoa hồng` : 'Cấu hình hoa hồng'
  )
})

// ─── Form state ───
const partyRules = ref<PartyRuleForm[]>([])
const deptRules = ref<DeptRuleForm[]>([])
const formInitialized = ref(false)

// Init form when both data sources are ready
watch([configDetail, deptsData], ([config, rawDepts]) => {
  if (!config || !rawDepts || formInitialized.value) return
  initForm(config, rawDepts.data ?? [])
  formInitialized.value = true
})

function initForm(config: CommissionConfigDetailResource, depts: AvailableDepartment[]) {
  // Section 1: Party rules — init all 3 parties, pre-fill from existing config
  partyRules.value = COMMISSION_PARTY_ORDER.map((partyType) => {
    const existing = config.party_rules?.find((r: CommissionConfigDetailResourcePartyRulesItem) => r.party_type.value === partyType)
    return {
      party_type: partyType,
      label: COMMISSION_PARTY_LABELS[partyType],
      value_type: (existing?.value_type?.value as CommissionValueType) ?? 'percent',
      percent: existing?.percent ? parseFloat(existing.percent) : null,
      value_fixed: existing?.value_fixed ? parseFloat(existing.value_fixed) : null
    }
  })

  // Section 2: Dept rules — merge available depts with existing config
  deptRules.value = depts.map((dept, deptIdx) => {
    const existing = config.dept_rules?.find((r: CommissionConfigDetailResourceDeptRulesItem) => r.department.id === dept.id)

    if (existing) {
      const existingAccountIds = new Set(existing.staff_rules.map((s: CommissionConfigDetailResourceDeptRulesItemStaffRulesItem) => s.account.id))
      const staffRules: StaffRuleForm[] = [
        ...existing.staff_rules.map((s: CommissionConfigDetailResourceDeptRulesItemStaffRulesItem) => ({
          account_id: s.account.id,
          account_name: s.account.name,
          employee_code: s.account.employee_code,
          selected: true,
          sort_order: s.sort_order,
          value_type: s.value_type.value as CommissionValueType,
          percent: s.percent ? parseFloat(s.percent) : null,
          value_fixed: s.value_fixed ? parseFloat(s.value_fixed) : null
        })),
        ...dept.accounts
          .filter(acc => !existingAccountIds.has(acc.id))
          .map(acc => ({
            account_id: acc.id,
            account_name: acc.name,
            employee_code: acc.employee_code,
            selected: false,
            sort_order: existing.staff_rules.length + 1,
            value_type: 'percent' as CommissionValueType,
            percent: null,
            value_fixed: null
          }))
      ]

      return {
        department_id: dept.id,
        department_name: dept.name,
        selected: true,
        sort_order: existing.sort_order,
        value_type: existing.value_type.value as CommissionValueType,
        percent: existing.percent ? parseFloat(existing.percent) : null,
        value_fixed: existing.value_fixed ? parseFloat(existing.value_fixed) : null,
        expanded: false,
        staff_rules: staffRules
      }
    }

    return {
      department_id: dept.id,
      department_name: dept.name,
      selected: false,
      sort_order: deptIdx + 1,
      value_type: 'percent' as CommissionValueType,
      percent: null,
      value_fixed: null,
      expanded: false,
      staff_rules: []
    }
  })
}

// ─── Computed: totals ───
const totalPartyPercent = computed(() => {
  let sum = platformConfig.value.percent
  for (const p of partyRules.value) {
    if (p.value_type === 'percent' || p.value_type === 'both') {
      sum += (p.percent ?? 0)
    }
  }
  return sum
})

const totalLevel1Fixed = computed(() => {
  let sum = platformConfig.value.value_fixed ?? 0
  for (const p of partyRules.value) {
    if (p.value_type === 'fixed' || p.value_type === 'both') {
      sum += (p.value_fixed ?? 0)
    }
  }
  return sum
})

const hasManagement = computed(() => partyRules.value.some(p => p.party_type === 'management'))
const checkedDepts = computed(() => deptRules.value.filter(d => d.selected))

const totalDeptPercent = computed(() =>
  checkedDepts.value
    .filter(d => d.value_type === 'percent' || d.value_type === 'both')
    .reduce((sum, d) => sum + (d.percent ?? 0), 0)
)

const totalDeptFixed = computed(() =>
  checkedDepts.value
    .filter(d => d.value_type === 'fixed' || d.value_type === 'both')
    .reduce((sum, d) => sum + (d.value_fixed ?? 0), 0)
)

// ─── Helpers ───
function getAccountsForDept(departmentId: number) {
  return availableDepartments.value.find(d => d.id === departmentId)?.accounts ?? []
}

function formatPartyLabel(p: PartyRuleForm): string {
  if (p.value_type === 'percent') return `${p.percent ?? 0}%`
  if (p.value_type === 'fixed') return `${formatCurrency(p.value_fixed ?? 0)}/đơn`
  return `${p.percent ?? 0}% + ${formatCurrency(p.value_fixed ?? 0)}/đơn`
}

// ─── Mindmap diagram data ───
const EXAMPLE_BASE = 400_000

const mindmapConfig = computed<MindmapNode[]>(() => {
  const pf = platformConfig.value

  // Build party children (Level 1)
  const deptChildren: MindmapNode[] = checkedDepts.value.map((dept) => {
    let deptLabel = dept.department_name
    if (dept.value_type === 'percent') deptLabel += `: ${dept.percent ?? 0}%`
    else if (dept.value_type === 'fixed') deptLabel += `: ${formatCurrency(dept.value_fixed ?? 0)}/đơn`
    else deptLabel += `: ${dept.percent ?? 0}% + ${formatCurrency(dept.value_fixed ?? 0)}/đơn`

    const staffChildren: MindmapNode[] = dept.staff_rules
      .filter(s => s.selected)
      .map((s) => {
        let staffLabel = s.account_name
        if (s.value_type === 'percent') staffLabel += `: ${s.percent ?? 0}%`
        else if (s.value_type === 'fixed') staffLabel += `: ${formatCurrency(s.value_fixed ?? 0)}/đơn`
        else staffLabel += `: ${s.percent ?? 0}% + ${formatCurrency(s.value_fixed ?? 0)}/đơn`
        return { name: staffLabel }
      })

    return { name: deptLabel, children: staffChildren.length > 0 ? staffChildren : undefined }
  })

  const children: MindmapNode[] = []
  children.push({ name: `Platform: ${pf.percent}% + ${formatCurrency(pf.value_fixed)}/đơn` })

  for (const p of partyRules.value) {
    const node: MindmapNode = { name: `${p.label}: ${formatPartyLabel(p)}` }
    if (p.party_type === 'management') {
      node.children = deptChildren.length > 0 ? deptChildren : [{ name: '(Chưa chọn phòng ban)' }]
    }
    children.push(node)
  }

  const rootLabel = totalLevel1Fixed.value > 0
    ? `Tổng HH (100% + ${formatCurrency(totalLevel1Fixed.value)}/đơn)`
    : 'Tổng hoa hồng (100%)'
  return [{ name: rootLabel, children }]
})

const distributeInput = computed<CommissionDistributeInput | null>(() => {
  return {
    total: EXAMPLE_BASE,
    platform: {
      percent: platformConfig.value.percent,
      valueFixed: platformConfig.value.value_fixed
    },
    partyRules: partyRules.value.map(p => ({
      id: p.party_type,
      name: p.label,
      valueType: p.value_type,
      percent: p.percent,
      valueFixed: p.value_fixed
    })),
    deptRules: checkedDepts.value.map(dept => ({
      id: dept.department_id,
      name: dept.department_name,
      sortOrder: dept.sort_order,
      valueType: dept.value_type,
      percent: dept.percent,
      valueFixed: dept.value_fixed,
      staff: dept.staff_rules.filter(s => s.selected).map(s => ({
        id: s.account_id,
        name: s.account_name,
        sortOrder: s.sort_order,
        valueType: s.value_type,
        percent: s.percent,
        valueFixed: s.value_fixed
      }))
    }))
  }
})

const { mindmap: mindmapExample, diagramKey } = useCommissionMindmap(distributeInput)

// ─── Diagram validity ───
const isTopPercentValid = computed(() => Math.abs(totalPartyPercent.value - 100) < 0.001)
const hasDeptPercent = computed(() => checkedDepts.value.some(d => d.value_type === 'percent' || d.value_type === 'both'))
const hasDeptFixed = computed(() => checkedDepts.value.some(d => d.value_type === 'fixed' || d.value_type === 'both'))
const isDeptPercentSumValid = computed(() => Math.abs(totalDeptPercent.value - 100) < 0.001)

const isDeptPercentValid = computed(() => {
  if (!hasManagement.value) return true
  if (!hasDeptPercent.value) return true
  return isDeptPercentSumValid.value
})

const isStaffPercentValid = computed(() => {
  for (const dept of checkedDepts.value) {
    const checked = dept.staff_rules.filter(s => s.selected)
    const hasPercent = checked.some(s => s.value_type === 'percent' || s.value_type === 'both')
    if (!hasPercent) continue
    const sum = checked
      .filter(s => s.value_type === 'percent' || s.value_type === 'both')
      .reduce((acc, s) => acc + (s.percent ?? 0), 0)
    if (Math.abs(sum - 100) > 0.001) return false
  }
  return true
})

const isDiagramValid = computed(() => isTopPercentValid.value && isDeptPercentValid.value && isStaffPercentValid.value)

const configDiagramKey = computed(() => JSON.stringify(mindmapConfig.value))

// ─── Validation ───
const validationErrors = ref<string[]>([])

function validate(): boolean {
  const errors: string[] = []

  // Party percent sum (including platform)
  if (Math.abs(totalPartyPercent.value - 100) > 0.001) {
    errors.push(`Tổng phần trăm các bên (bao gồm Platform ${platformConfig.value.percent}%) phải bằng 100%. Hiện tại: ${totalPartyPercent.value}%`)
  }

  // Party rule field validations
  for (const p of partyRules.value) {
    if ((p.value_type === 'percent' || p.value_type === 'both') && (p.percent == null || p.percent < 0)) {
      errors.push(`${p.label}: Phần trăm là bắt buộc`)
    }
    if ((p.value_type === 'fixed' || p.value_type === 'both') && (p.value_fixed == null || p.value_fixed < 0)) {
      errors.push(`${p.label}: Tiền cứng là bắt buộc`)
    }
  }

  // Dept rules when management is present
  if (hasManagement.value) {
    if (checkedDepts.value.length === 0) {
      errors.push('Khi có Ban quản lý, phải chọn ít nhất 1 phòng ban')
    }

    const deptPercentDepts = checkedDepts.value.filter(d => d.value_type === 'percent' || d.value_type === 'both')
    if (deptPercentDepts.length > 0 && Math.abs(totalDeptPercent.value - 100) > 0.001) {
      errors.push('Tổng % phòng ban phải bằng 100%')
    }

    // Bậc 1→2: Validate fixed cascade (BQL → dept)
    const managementRule = partyRules.value.find(p => p.party_type === 'management')
    const managementHasFixed = managementRule && (managementRule.value_type === 'fixed' || managementRule.value_type === 'both')
    const managementFixed = managementHasFixed ? (managementRule.value_fixed ?? 0) : 0

    const deptsWithFixed = checkedDepts.value.filter(d => d.value_type === 'fixed' || d.value_type === 'both')
    if (!managementHasFixed && deptsWithFixed.length > 0) {
      errors.push('Ban quản lý không có tiền cứng — phòng ban không được dùng tiền cứng')
    }
    if (managementHasFixed && deptsWithFixed.length > 0) {
      const totalDeptFixedAmt = deptsWithFixed.reduce((sum, d) => sum + (d.value_fixed ?? 0), 0)
      if (totalDeptFixedAmt > managementFixed) {
        errors.push(`Tổng tiền cứng phòng ban (${formatCurrency(totalDeptFixedAmt)}) vượt quá tiền cứng Ban quản lý (${formatCurrency(managementFixed)})`)
      }
    }

    const deptSortOrders = checkedDepts.value.map(d => d.sort_order)
    if (new Set(deptSortOrders).size !== deptSortOrders.length) {
      errors.push('Thứ tự ưu tiên phòng ban không được trùng')
    }

    for (const dept of checkedDepts.value) {
      if ((dept.value_type === 'percent' || dept.value_type === 'both') && (dept.percent == null || dept.percent < 0)) {
        errors.push(`Phòng ban ${dept.department_name}: Phần trăm là bắt buộc`)
      }
      if ((dept.value_type === 'fixed' || dept.value_type === 'both') && (dept.value_fixed == null || dept.value_fixed < 0)) {
        errors.push(`Phòng ban ${dept.department_name}: Tiền cứng là bắt buộc`)
      }

      const checkedStaff = dept.staff_rules.filter(s => s.selected)

      if (checkedStaff.length === 0) {
        errors.push(`Phòng ban ${dept.department_name} phải có ít nhất 1 nhân viên`)
      }

      // Bậc 2→3: Validate fixed cascade (dept → staff)
      const deptHasFixed = dept.value_type === 'fixed' || dept.value_type === 'both'
      const staffWithFixed = checkedStaff.filter(s => s.value_type === 'fixed' || s.value_type === 'both')
      if (!deptHasFixed && staffWithFixed.length > 0) {
        errors.push(`${dept.department_name} không có tiền cứng — nhân viên không được dùng tiền cứng`)
      }
      if (deptHasFixed && staffWithFixed.length > 0) {
        const totalStaffFixed = staffWithFixed.reduce((sum, s) => sum + (s.value_fixed ?? 0), 0)
        if (totalStaffFixed > (dept.value_fixed ?? 0)) {
          errors.push(`Tổng tiền cứng NV trong ${dept.department_name} (${formatCurrency(totalStaffFixed)}) vượt quá tiền cứng phòng ban (${formatCurrency(dept.value_fixed ?? 0)})`)
        }
      }

      const staffPercentStaff = checkedStaff.filter(s => s.value_type === 'percent' || s.value_type === 'both')
      if (staffPercentStaff.length > 0) {
        const staffPercentSum = staffPercentStaff.reduce((sum, s) => sum + (s.percent ?? 0), 0)
        if (Math.abs(staffPercentSum - 100) > 0.001) {
          errors.push(`Tổng % nhân viên trong ${dept.department_name} phải bằng 100%`)
        }
      }

      const staffSortOrders = checkedStaff.map(s => s.sort_order)
      if (new Set(staffSortOrders).size !== staffSortOrders.length) {
        errors.push(`Thứ tự ưu tiên nhân viên trong ${dept.department_name} không được trùng`)
      }

      for (const staff of checkedStaff) {
        if ((staff.value_type === 'percent' || staff.value_type === 'both') && (staff.percent == null || staff.percent < 0)) {
          errors.push(`NV ${staff.account_name}: Phần trăm là bắt buộc`)
        }
        if ((staff.value_type === 'fixed' || staff.value_type === 'both') && (staff.value_fixed == null || staff.value_fixed < 0)) {
          errors.push(`NV ${staff.account_name}: Tiền cứng là bắt buộc`)
        }
      }
    }
  }

  validationErrors.value = errors
  return errors.length === 0
}

// ─── Submit ───
const isSaving = ref(false)

async function handleSave() {
  if (!validate()) {
    toast.add({ title: 'Vui lòng kiểm tra lại thông tin', color: 'error' })
    return
  }

  isSaving.value = true
  try {
    await apiSaveCommissionConfig(projectId.value, {
      party_rules: partyRules.value.map(p => ({
        party_type: p.party_type,
        value_type: p.value_type,
        percent: (p.value_type === 'percent' || p.value_type === 'both') ? p.percent! : null,
        value_fixed: (p.value_type === 'fixed' || p.value_type === 'both') ? p.value_fixed! : null
      })),
      dept_rules: hasManagement.value
        ? checkedDepts.value.map(dept => ({
            department_id: dept.department_id,
            sort_order: dept.sort_order,
            value_type: dept.value_type,
            percent: (dept.value_type === 'percent' || dept.value_type === 'both') ? dept.percent! : null,
            value_fixed: (dept.value_type === 'fixed' || dept.value_type === 'both') ? dept.value_fixed! : null,
            staff_rules: dept.staff_rules
              .filter(s => s.selected)
              .map(s => ({
                account_id: s.account_id,
                sort_order: s.sort_order,
                value_type: s.value_type,
                percent: (s.value_type === 'percent' || s.value_type === 'both') ? s.percent! : null,
                value_fixed: (s.value_type === 'fixed' || s.value_type === 'both') ? s.value_fixed! : null
              }))
          }))
        : undefined
    })
    toast.add({ title: 'Đã lưu cấu hình hoa hồng', color: 'success' })
    formInitialized.value = false
    await refreshConfig()
  } catch (err) {
    const serverErrors = getApiValidationErrors(err)
    if (serverErrors) {
      validationErrors.value = Object.values(serverErrors).flat()
    }
    toast.add({ title: getApiErrorMessage(err, 'Lưu cấu hình thất bại'), color: 'error' })
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="pb-20 lg:pb-0">
    <!-- Header -->
    <div class="mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4">
      <UButton
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
        to="/pmc/commission"
        class="shrink-0"
      />
      <div class="min-w-0">
        <h1 class="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
          Cấu hình hoa hồng
        </h1>
        <p
          v-if="project"
          class="text-slate-500 text-sm mt-0.5"
        >
          <span class="font-mono font-semibold">{{ project.code }}</span>
          — {{ project.name }}
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="isLoading"
      class="flex flex-col gap-4"
    >
      <div
        v-for="i in 3"
        :key="i"
        class="h-32 bg-slate-100 rounded-xl animate-pulse"
      />
    </div>

    <!-- Error -->
    <SharedCrudPageError
      v-else-if="configError"
      :error="configError"
      :retry="refreshConfig"
    />

    <!-- Form -->
    <div
      v-else-if="configDetail"
      class="flex flex-col gap-4 sm:gap-6"
    >
      <!-- Validation errors -->
      <UAlert
        v-if="validationErrors.length > 0"
        icon="i-lucide-alert-triangle"
        color="error"
        variant="subtle"
        title="Lỗi cấu hình"
      >
        <template #description>
          <ul class="list-disc pl-4 text-sm space-y-0.5">
            <li
              v-for="(err, idx) in validationErrors"
              :key="idx"
            >
              {{ err }}
            </li>
          </ul>
        </template>
      </UAlert>

      <!-- Preview Diagram -->
      <SharedSectionCard title="Sơ đồ phân bổ hoa hồng">
        <UTabs
          :items="[
            { label: 'Cấu hình tỷ lệ', value: 'config' },
            { label: 'Ví dụ phân phối', value: 'example' }
          ]"
          default-value="config"
          class="w-full"
        >
          <template #content="{ item }">
            <div class="pt-3">
              <UAlert
                v-if="!isDiagramValid"
                icon="i-lucide-triangle-alert"
                color="warning"
                variant="subtle"
                title="Tỷ lệ phân bổ chưa đúng — tổng % các cấp phải bằng 100%."
                class="mb-3"
              />
              <ClientOnly>
                <CommissionPreviewDiagram
                  :key="`${item.value}-${item.value === 'config' ? configDiagramKey : diagramKey}`"
                  :data="item.value === 'config' ? mindmapConfig : mindmapExample"
                />
                <template #fallback>
                  <div class="flex min-h-[300px] items-center justify-center rounded-lg border border-slate-200 bg-slate-50/30 py-12 text-slate-400 text-sm">
                    Đang tải sơ đồ...
                  </div>
                </template>
              </ClientOnly>
            </div>
          </template>
        </UTabs>
      </SharedSectionCard>

      <!-- Section 1: Phân bổ các bên (Level 1) -->
      <SharedSectionCard title="Phân bổ hoa hồng (tổng % = 100%)">
        <!-- Platform (read-only) -->
        <div class="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-sm font-semibold text-slate-700">1. Platform</span>
            <UBadge
              :label="platformConfig.source === 'api' ? 'Từ API' : 'Mặc định'"
              :color="platformConfig.source === 'api' ? 'primary' : 'neutral'"
              size="xs"
            />
          </div>
          <p class="text-sm text-slate-500">
            {{ platformConfig.percent }}% + {{ formatCurrency(platformConfig.value_fixed) }}/đơn
            <span class="text-xs text-slate-400">(không chỉnh được — lấy từ platform service)</span>
          </p>
        </div>

        <!-- Configurable parties -->
        <div class="flex flex-col gap-4">
          <div
            v-for="(party, idx) in partyRules"
            :key="party.party_type"
            class="p-3 bg-white rounded-lg border border-slate-200"
          >
            <div class="text-sm font-semibold text-slate-700 mb-2">
              {{ idx + 2 }}. {{ party.label }}
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <UFormField label="Loại giá trị">
                <USelect
                  v-model="party.value_type"
                  :items="COMMISSION_VALUE_TYPE_OPTIONS"
                  value-key="value"
                  label-key="label"
                />
              </UFormField>
              <UFormField
                v-if="party.value_type === 'percent' || party.value_type === 'both'"
                label="Phần trăm (%)"
              >
                <UInput
                  v-model.number="party.percent"
                  type="number"
                  :min="0"
                  :max="100"
                  :step="0.01"
                />
              </UFormField>
              <UFormField
                v-if="party.value_type === 'fixed' || party.value_type === 'both'"
                label="Tiền cứng (đ/đơn)"
              >
                <SharedNumberInput
                  v-model="party.value_fixed"
                  :min="0"
                />
              </UFormField>
            </div>
          </div>
        </div>

        <!-- Percent sum indicator -->
        <div class="mt-3 text-sm font-medium">
          <span
            v-if="isTopPercentValid"
            class="text-emerald-600"
          >
            Tổng %: 100% (Platform {{ platformConfig.percent }}% + các bên {{ totalPartyPercent - platformConfig.percent }}%)
          </span>
          <span
            v-else
            class="text-red-500"
          >
            Tổng %: {{ totalPartyPercent }}% — {{ totalPartyPercent < 100 ? `thiếu ${Math.round((100 - totalPartyPercent) * 100) / 100}%` : `dư ${Math.round((totalPartyPercent - 100) * 100) / 100}%` }}
          </span>
        </div>
      </SharedSectionCard>

      <!-- Section 2: Phân bổ phòng ban -->
      <SharedSectionCard
        title="Phân bổ theo phòng ban"
      >
        <!-- Summary bar -->
        <div class="flex flex-wrap gap-4 mb-4 text-sm">
          <span
            v-if="hasDeptPercent"
            :class="isDeptPercentSumValid ? 'text-emerald-600 font-medium' : 'text-red-500 font-medium'"
          >
            Tổng %: {{ totalDeptPercent }}%
            {{ isDeptPercentSumValid ? '✓' : '(phải bằng 100%)' }}
          </span>
          <span
            v-if="hasDeptFixed"
            class="text-slate-600"
          >
            Tổng tiền cứng: {{ formatCurrency(totalDeptFixed) }}/đơn
          </span>
        </div>

        <!-- Dept rule rows -->
        <div class="flex flex-col gap-3">
          <CommissionDeptRuleRow
            v-for="(dept, idx) in deptRules"
            :key="dept.department_id"
            v-model="deptRules[idx]!"
            :available-accounts="getAccountsForDept(dept.department_id)"
          />
        </div>

        <div
          v-if="deptRules.length === 0"
          class="text-sm text-slate-400 italic"
        >
          Không có phòng ban nào thuộc dự án này.
        </div>
      </SharedSectionCard>

      <!-- Section 3: Adjusters -->
      <CommissionAdjusterSection
        :project-id="projectId"
        :adjusters="configDetail.adjusters"
        @saved="refreshConfig()"
      />

      <!-- Section 4: Actions (sticky bottom) -->
      <div class="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 flex items-center justify-end gap-3 z-10">
        <UButton
          label="Hủy"
          color="neutral"
          variant="ghost"
          to="/pmc/commission"
        />
        <UButton
          label="Lưu cấu hình"
          icon="i-lucide-save"
          color="primary"
          :loading="isSaving"
          @click="handleSave"
        />
      </div>
    </div>
  </div>
</template>
