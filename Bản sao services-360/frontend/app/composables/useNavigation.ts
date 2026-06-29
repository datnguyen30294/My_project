export interface NavChild {
  label: string
  to: string
}

export interface NavItem {
  label: string
  icon: string
  to?: string
  defaultOpen?: boolean
  children?: NavChild[]
  /** Module nghiệp vụ tương ứng — bị platform tắt thì ẩn khỏi sidebar. */
  module?: string
}

export function useNavigation() {
  const { tenant } = useAuth()
  const isVendorEnabled = computed(() => tenant.value?.is_vendor_enabled === true)

  /** Chưa fetch xong tenant (null) → hiển thị đầy đủ, BE vẫn chặn API. */
  function isModuleEnabled(module: string): boolean {
    const enabled = tenant.value?.enabled_modules
    return !enabled || enabled.includes(module)
  }

  const allItems = computed<NavItem[]>(() => [
    {
      label: 'Trang chủ',
      icon: 'language',
      to: '/'
    },
    {
      label: 'Dashboard',
      icon: 'home',
      to: '/pmc/dashboard'
    },
    {
      label: 'HRM',
      icon: 'badge',
      defaultOpen: true,
      module: 'hrm',
      children: [
        { label: 'Tài khoản', to: '/pmc/accounts' },
        { label: 'Phòng ban', to: '/pmc/departments' },
        { label: 'Chức danh', to: '/pmc/job-titles' },
        { label: 'Vai trò', to: '/pmc/roles' },
        { label: 'Quản lý dự án', to: '/pmc/projects' }
      ]
    },
    {
      label: 'Khách hàng',
      icon: 'people',
      to: '/pmc/customers'
    },
    {
      label: 'Quản lý ticket',
      icon: 'confirmation_number',
      defaultOpen: true,
      module: 'quan-ly-ticket',
      children: [
        { label: 'Ticket Pool', to: '/pmc/og-tickets/pool' },
        { label: 'Danh sách ticket', to: '/pmc/og-tickets' }
      ]
    },
    {
      label: 'Quản lý công việc',
      icon: 'calendar_month',
      defaultOpen: true,
      module: 'quan-ly-cong-viec',
      children: [
        { label: 'Lịch việc cá nhân', to: '/quan-ly-cong-viec/lich-viec-ca-nhan' },
        { label: 'Lịch việc đội', to: '/quan-ly-cong-viec/lich-viec-doi' },
        { label: 'Năng lực nhân sự', to: '/quan-ly-cong-viec/nang-luc-nhan-su' },
        { label: 'Quản lý ca làm việc', to: '/quan-ly-cong-viec/shifts' }
      ]
    },
    {
      label: 'Danh mục',
      icon: 'inventory_2',
      defaultOpen: true,
      module: 'kho-va-dich-vu',
      children: [
        { label: 'Nhà cung cấp', to: '/pmc/catalog/suppliers' },
        { label: 'Loại dịch vụ', to: '/pmc/catalog/categories' },
        { label: 'Danh mục hàng', to: '/pmc/catalog/items' }
      ]
    },
    {
      label: 'Quản lý đơn hàng',
      icon: 'shopping_cart',
      defaultOpen: true,
      module: 'quan-ly-don-hang',
      children: [
        { label: 'Báo giá', to: '/pmc/quotes' },
        { label: 'Đơn hàng', to: '/pmc/orders' }
      ]
    },
    ...(isVendorEnabled.value
      ? [{
          label: 'Marketplace',
          icon: 'storefront',
          children: [
            { label: 'Vendor của tôi', to: '/pmc/vendors' },
            { label: 'Đơn hàng vendor', to: '/pmc/vendor-orders' }
          ]
        }]
      : []),
    {
      label: 'Kế toán/Tài chính',
      icon: 'account_balance',
      module: 'ke-toan-tai-chinh',
      children: [
        { label: 'Cấu hình hoa hồng', to: '/pmc/commission' },
        { label: 'Công nợ phải thu', to: '/pmc/receivables' },
        { label: 'Tiền ứng vật tư', to: '/pmc/finance/advance-payments' },
        { label: 'Đối soát tài chính', to: '/pmc/finance/reconciliation' },
        { label: 'Kỳ kế toán', to: '/pmc/finance/closing-periods' },
        { label: 'Tổng hợp hoa hồng', to: '/pmc/finance/commission-summary' },
        { label: 'Quản lý dòng tiền', to: '/pmc/finance/treasury' }
      ]
    },
    {
      label: 'Báo cáo',
      icon: 'assessment',
      module: 'bao-cao',
      children: [
        { label: 'Tổng quan', to: '/reports' },
        { label: 'Doanh thu (ticket)', to: '/reports/revenue-ticket' },
        { label: 'Doanh thu & lợi nhuận', to: '/reports/revenue-profit' },
        { label: 'Lợi nhuận VH (Vật tư + HH)', to: '/reports/operating-profit' },
        { label: 'Phân bổ hoa hồng', to: '/reports/commission' },
        { label: 'Dòng tiền', to: '/reports/cashflow' },
        { label: 'SLA', to: '/reports/sla' },
        { label: 'Hài lòng KH', to: '/reports/csat' },
        { label: 'Đơn hàng vendor (Marketplace)', to: '/reports/vendor-order' }
      ]
    },
    {
      label: 'Cài đặt hệ thống',
      icon: 'settings',
      module: 'cai-dat',
      children: [
        { label: 'Cài đặt SLA', to: '/pmc/settings' },
        { label: 'Tài khoản nhận CK', to: '/pmc/settings/bank-account' },
        { label: 'Template biên bản nghiệm thu', to: '/pmc/settings/acceptance-report' },
        { label: 'Chính sách', to: '/pmc/policies' }
      ]
    }
  ])

  const navigationItems = computed<NavItem[]>(() =>
    allItems.value.filter(item => !item.module || isModuleEnabled(item.module))
  )

  return { navigationItems }
}
