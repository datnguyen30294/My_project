export interface BreadcrumbItem {
  label?: string
  to?: string
  icon?: string
}

// Path-aware keys (e.g. "reports/commission") take precedence over plain
// segment keys, so the same segment can carry different labels in different
// contexts (e.g. "commission" under /pmc vs under /reports).
const ROUTE_LABELS: Record<string, string> = {
  'dashboard': 'Dashboard',
  'accounts': 'Tài khoản',
  'departments': 'Phòng ban',
  'job-titles': 'Chức danh',
  'projects': 'Dự án',
  'roles': 'Vai trò',
  'catalog': 'Danh mục',
  'suppliers': 'Nhà cung cấp',
  'items': 'Hàng hoá',
  'quotes': 'Báo giá',
  'orders': 'Đơn hàng',
  'commission': 'Cấu hình hoa hồng',
  'receivables': 'Công nợ phải thu',
  'finance': 'Kế toán/Tài chính',
  'reconciliation': 'Đối soát tài chính',
  'closing-periods': 'Kỳ kế toán',
  'commission-summary': 'Tổng hợp hoa hồng',
  'reports': 'Báo cáo',
  'cashflow': 'Dòng tiền',
  'revenue-ticket': 'Doanh thu (ticket)',
  'revenue-profit': 'Doanh thu & lợi nhuận',
  'reports/commission': 'Phân bổ hoa hồng',
  'sla': 'SLA',
  'csat': 'Hài lòng KH',
  'settings': 'Cài đặt',
  'bank-account': 'Tài khoản nhận CK',
  'create': 'Thêm mới',
  'vendors': 'Vendor của tôi',
  'partners': 'Partner Marketplace',
  'tao-moi': 'Đăng ký vendor',
  'edit': 'Chỉnh sửa'
}

// Maps route segments to their parent group label for breadcrumbs
const PARENT_GROUP: Record<string, string> = {
  'accounts': 'HRM',
  'departments': 'HRM',
  'job-titles': 'HRM',
  'projects': 'HRM',
  'roles': 'HRM',
  'catalog': 'Danh mục',
  'suppliers': 'Danh mục',
  'items': 'Danh mục',
  'quotes': 'Quản lý đơn hàng',
  'orders': 'Quản lý đơn hàng',
  'commission': 'Kế toán/Tài chính',
  'receivables': 'Kế toán/Tài chính',
  'finance': 'Kế toán/Tài chính',
  'reconciliation': 'Kế toán/Tài chính',
  'closing-periods': 'Kế toán/Tài chính',
  'commission-summary': 'Kế toán/Tài chính',
  'reports': 'Báo cáo',
  'settings': 'Cài đặt hệ thống',
  'vendors': 'Marketplace'
}

export function useBreadcrumb() {
  const route = useRoute()
  const dynamicLabel = useState<string | null>('breadcrumb:label', () => null)

  const items = computed<BreadcrumbItem[]>(() => {
    const allSegments = route.path.split('/').filter(Boolean)

    // Skip namespace prefixes (pmc, platform) — they're route containers, not breadcrumb items
    const NAMESPACE_SEGMENTS = new Set(['pmc', 'platform'])
    const segments = allSegments.filter(s => !NAMESPACE_SEGMENTS.has(s))
    const namespacePath = allSegments.length !== segments.length
      ? '/' + allSegments[0]
      : ''

    if (segments.length === 0) return []

    const result: BreadcrumbItem[] = [
      {
        icon: 'i-lucide-home',
        to: '/pmc/dashboard',
        label: 'Trang chủ'
      }
    ]

    // Insert parent group label (e.g. "HRM") before the first segment if applicable
    const firstSegment = segments[0]
    const parentGroupLabel = firstSegment ? PARENT_GROUP[firstSegment] : undefined
    if (parentGroupLabel) {
      result.push({ label: parentGroupLabel })
    }

    let currentPath = namespacePath
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === segments.length - 1
      const isNumericId = /^\d+$/.test(segment)
      const pathKey = segments.slice(0, index + 1).join('/')
      const staticLabel = ROUTE_LABELS[pathKey] ?? ROUTE_LABELS[segment] ?? segment

      // Skip first segment if its label duplicates the parent group
      if (index === 0 && parentGroupLabel && staticLabel === parentGroupLabel) {
        return
      }

      let label: string
      if (isNumericId) {
        label = dynamicLabel.value ?? '...'
      } else {
        label = isLast && dynamicLabel.value ? dynamicLabel.value : staticLabel
      }

      result.push({
        label,
        to: isLast ? undefined : currentPath
      })
    })

    return result
  })

  function setLabel(label: string | null) {
    dynamicLabel.value = label
  }

  function useDynamicLabel(labelRef: ComputedRef<string | null | undefined>) {
    watch(labelRef, (val) => {
      dynamicLabel.value = val ?? null
    }, { immediate: true })

    onUnmounted(() => {
      dynamicLabel.value = null
    })
  }

  return { items, setLabel, useDynamicLabel }
}
