// ─── Mindmap types ───

export interface MindmapNode {
  name: string
  children?: MindmapNode[]
}

interface DistributeResult {
  id: number
  name: string
  valueType: string
  percent: number | null
  fixed: number
  percentAmt: number
  total: number
}

// ─── Normalized input types ───

export interface CommissionDistributeStaff {
  id: number
  name: string
  sortOrder: number
  valueType: string // 'percent' | 'fixed' | 'both'
  percent: number | null
  valueFixed: number | null
}

export interface CommissionDistributeDept {
  id: number
  name: string
  sortOrder: number
  valueType: string // 'percent' | 'fixed' | 'both'
  percent: number | null
  valueFixed: number | null
  staff: CommissionDistributeStaff[]
}

export interface CommissionDistributeParty {
  id: string
  name: string
  valueType: string // 'percent' | 'fixed' | 'both'
  percent: number | null
  valueFixed: number | null
}

export interface CommissionDistributeInput {
  total: number
  platform: { percent: number, valueFixed: number }
  partyRules: CommissionDistributeParty[]
  deptRules: CommissionDistributeDept[]
}

// ─── Validation ───

export interface CommissionValidationError {
  level: 'party' | 'department' | 'staff'
  scope: string
  sumPercent: number
}

/**
 * Check that the configured percentages at every distribution level sum to ≤ 100.
 * Platform is always included at party level (sort_order = 1).
 * Fixed amounts are not validated here — the distribute algorithm clips them against the pool.
 */
export function validateCommissionConfig(input: CommissionDistributeInput): CommissionValidationError[] {
  const errors: CommissionValidationError[] = []

  const partyPercentSum = (input.platform.percent ?? 0)
    + input.partyRules
      .filter(p => p.valueType === 'percent' || p.valueType === 'both')
      .reduce((s, p) => s + (p.percent ?? 0), 0)

  if (partyPercentSum > 100) {
    errors.push({ level: 'party', scope: 'Platform + các bên', sumPercent: partyPercentSum })
  }

  const deptPercentSum = input.deptRules
    .filter(d => d.valueType === 'percent' || d.valueType === 'both')
    .reduce((s, d) => s + (d.percent ?? 0), 0)

  if (deptPercentSum > 100) {
    errors.push({ level: 'department', scope: 'Các phòng ban', sumPercent: deptPercentSum })
  }

  for (const dept of input.deptRules) {
    const staffPercentSum = dept.staff
      .filter(s => s.valueType === 'percent' || s.valueType === 'both')
      .reduce((s, x) => s + (x.percent ?? 0), 0)

    if (staffPercentSum > 100) {
      errors.push({ level: 'staff', scope: `Nhân viên phòng "${dept.name}"`, sumPercent: staffPercentSum })
    }
  }

  return errors
}

// ─── Core distribute algorithm ───

interface Recipient {
  id: number
  name: string
  valueType: string
  percent: number | null
  valueFixed: number | null
}

function distribute(pool: number, recipients: Recipient[]) {
  const fixedAmounts: Record<number, number> = {}
  let remaining = pool

  // Round 1: fixed amounts by order
  for (const r of recipients) {
    if (remaining <= 0) break
    if (r.valueType === 'fixed' || r.valueType === 'both') {
      const actual = Math.min(r.valueFixed ?? 0, remaining)
      fixedAmounts[r.id] = actual
      remaining -= actual
    }
  }

  // Round 2: percent on remaining
  const results: DistributeResult[] = []
  for (const r of recipients) {
    const fixed = fixedAmounts[r.id] ?? 0
    let percentAmt = 0
    if (remaining > 0 && (r.valueType === 'percent' || r.valueType === 'both')) {
      percentAmt = Math.round(remaining * (r.percent ?? 0) / 100)
    }
    results.push({
      id: r.id,
      name: r.name,
      valueType: r.valueType,
      percent: r.percent,
      fixed,
      percentAmt,
      total: fixed + percentAmt
    })
  }

  return results
}

function formatLabel(name: string, valueType: string, percent: number | null, fixed: number, total: number, hideAmount = false): string {
  if (hideAmount) {
    if (valueType === 'fixed') return `${name}: cứng ${formatCurrency(fixed)}/đơn`
    if (valueType === 'percent') return `${name}: ${formatPercent(percent)}`
    return `${name}: ${formatCurrency(fixed)} + ${formatPercent(percent)}`
  }
  if (valueType === 'fixed') return `${name}: ${formatCurrency(total)}`
  if (valueType === 'percent') return `${name}: ${formatPercent(percent)} = ${formatCurrency(total)}`
  return `${name}: ${formatCurrency(fixed)} + ${formatPercent(percent)} = ${formatCurrency(total)}`
}

// ─── Build mindmap from input ───

export function buildCommissionMindmap(input: CommissionDistributeInput): MindmapNode[] {
  const { total, platform, partyRules, deptRules } = input

  // Build Level 1 recipients: Platform (fixed order 1) + party rules
  const allParties: Recipient[] = [
    {
      id: 0,
      name: 'Platform',
      valueType: 'both',
      percent: platform.percent,
      valueFixed: platform.valueFixed
    },
    ...partyRules.map(p => ({
      id: typeof p.id === 'string' ? p.id.charCodeAt(0) : Number(p.id),
      name: p.name,
      valueType: p.valueType,
      percent: p.percent,
      valueFixed: p.valueFixed
    }))
  ]

  const partyResults = distribute(total, allParties)

  // Find management result for dept distribution
  const managementResult = partyResults.find(r => r.name === 'Ban quản lý')
  const managementTotal = managementResult?.total ?? 0

  // Distribute to departments from management share
  const sortedDepts = [...deptRules].sort((a, b) => a.sortOrder - b.sortOrder)
  const deptResults = distribute(managementTotal, sortedDepts.map(d => ({
    id: d.id,
    name: d.name,
    valueType: d.valueType,
    percent: d.percent,
    valueFixed: d.valueFixed
  })))

  // Build dept children with staff sub-nodes
  const deptChildren: MindmapNode[] = deptResults.map((dr) => {
    const dept = sortedDepts.find(d => d.id === dr.id)!
    const sortedStaff = [...dept.staff].sort((a, b) => a.sortOrder - b.sortOrder)

    const staffResults = distribute(dr.total, sortedStaff.map(s => ({
      id: s.id,
      name: s.name,
      valueType: s.valueType,
      percent: s.percent,
      valueFixed: s.valueFixed
    })))

    const staffChildren: MindmapNode[] = staffResults.map(sr =>
      ({ name: formatLabel(sr.name, sr.valueType, sr.percent, sr.fixed, sr.total) })
    )

    return {
      name: formatLabel(dr.name, dr.valueType, dr.percent, dr.fixed, dr.total, true),
      children: staffChildren.length > 0 ? staffChildren : undefined
    }
  })

  // Build root children from Level 1 results
  const children: MindmapNode[] = partyResults
    .filter(r => r.total > 0)
    .map((r) => {
      if (r.name === 'Ban quản lý') {
        return {
          name: formatLabel(r.name, r.valueType, r.percent, r.fixed, r.total, true),
          children: deptChildren.length > 0 ? deptChildren : [{ name: '(Chưa chọn phòng ban)' }]
        }
      }
      return { name: formatLabel(r.name, r.valueType, r.percent, r.fixed, r.total) }
    })

  return [{ name: `Tổng hoa hồng: ${formatCurrency(total)}`, children }]
}

// ─── Table rows builder ───

export interface CommissionTableRow {
  label: string
  formula: string
  amount: number
  level: 0 | 1 | 2 // 0=top, 1=dept, 2=staff
  isSummary?: boolean
  isIntermediary?: boolean // intermediary distribution levels (management, department) don't directly receive money
}

function buildFormula(valueType: string, percent: number | null, fixed: number, pool: number): string {
  if (valueType === 'fixed') return `cứng ${formatCurrency(fixed)}/đơn`
  if (valueType === 'percent') return `${formatPercent(percent)} × ${formatCurrency(pool)}`
  return `${formatCurrency(fixed)} + ${formatPercent(percent)} × ${formatCurrency(pool)}`
}

export function buildCommissionTableRows(input: CommissionDistributeInput): CommissionTableRow[] {
  const { total, platform, partyRules, deptRules } = input
  const rows: CommissionTableRow[] = []

  // Level 1: distribute among all parties (Platform + configurable parties)
  const allParties: Recipient[] = [
    { id: 0, name: 'Platform', valueType: 'both', percent: platform.percent, valueFixed: platform.valueFixed },
    ...partyRules.map(p => ({
      id: typeof p.id === 'string' ? p.id.charCodeAt(0) : Number(p.id),
      name: p.name,
      valueType: p.valueType,
      percent: p.percent,
      valueFixed: p.valueFixed
    }))
  ]

  const partyResults = distribute(total, allParties)
  const partyFixedTotal = partyResults.reduce((s, r) => s + r.fixed, 0)
  const partyPercentPool = total - partyFixedTotal

  for (const pr of partyResults) {
    if (pr.total <= 0) continue
    const pool = pr.valueType === 'percent' ? partyPercentPool : total
    const isManagement = pr.name === 'Ban quản lý'
    rows.push({ label: pr.name, formula: buildFormula(pr.valueType, pr.percent, pr.fixed, pool), amount: pr.total, level: 0, isIntermediary: isManagement })

    // Level 2+3: Only management gets dept/staff distribution
    if (isManagement && deptRules.length > 0) {
      const sortedDepts = [...deptRules].sort((a, b) => a.sortOrder - b.sortOrder)
      const deptResults = distribute(pr.total, sortedDepts.map(d => ({
        id: d.id, name: d.name, valueType: d.valueType, percent: d.percent, valueFixed: d.valueFixed
      })))

      const deptFixedTotal = deptResults.reduce((s, r) => s + r.fixed, 0)
      const deptPercentPool = pr.total - deptFixedTotal

      for (const dr of deptResults) {
        const dPool = dr.valueType === 'percent' ? deptPercentPool : pr.total
        rows.push({ label: dr.name, formula: buildFormula(dr.valueType, dr.percent, dr.fixed, dPool), amount: dr.total, level: 1, isIntermediary: true })

        const dept = sortedDepts.find(d => d.id === dr.id)!
        const sortedStaff = [...dept.staff].sort((a, b) => a.sortOrder - b.sortOrder)
        const staffResults = distribute(dr.total, sortedStaff.map(s => ({
          id: s.id, name: s.name, valueType: s.valueType, percent: s.percent, valueFixed: s.valueFixed
        })))

        const staffFixedTotal = staffResults.reduce((s, r) => s + r.fixed, 0)
        const staffPercentPool = dr.total - staffFixedTotal

        for (const sr of staffResults) {
          const sPool = sr.valueType === 'percent' ? staffPercentPool : dr.total
          rows.push({ label: sr.name, formula: buildFormula(sr.valueType, sr.percent, sr.fixed, sPool), amount: sr.total, level: 2 })
        }
      }
    }
  }

  rows.push({ label: 'Tổng cộng', formula: '', amount: total, level: 0, isSummary: true })
  return rows
}

// ─── Composable: reactive wrapper ───

export function useCommissionMindmap(input: ComputedRef<CommissionDistributeInput | null>) {
  const errors = computed<CommissionValidationError[]>(() => {
    const val = input.value
    if (!val || val.total <= 0) return []
    return validateCommissionConfig(val)
  })

  const isValid = computed(() => errors.value.length === 0)

  const mindmap = computed<MindmapNode[]>(() => {
    const val = input.value
    if (!val || val.total <= 0 || !isValid.value) return []
    return buildCommissionMindmap(val)
  })

  const tableRows = computed<CommissionTableRow[]>(() => {
    const val = input.value
    if (!val || val.total <= 0 || !isValid.value) return []
    return buildCommissionTableRows(val)
  })

  const diagramKey = computed(() => JSON.stringify(mindmap.value))

  return { mindmap, tableRows, diagramKey, errors, isValid }
}
