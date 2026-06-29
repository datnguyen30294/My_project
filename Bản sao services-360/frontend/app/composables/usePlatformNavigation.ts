import type { NavItem } from '~/composables/useNavigation'

export function usePlatformNavigation() {
  const navigationItems = computed<NavItem[]>(() => [
    {
      label: 'Tổng quan',
      icon: 'dashboard',
      to: '/platform'
    },
    {
      label: 'Quản lý vận hành',
      icon: 'domain',
      defaultOpen: true,
      children: [
        { label: 'Công ty vận hành', to: '/platform/tenants' },
        { label: 'Dự án trên nền tảng', to: '/platform/quan-ly-van-hanh/du-an-tren-nen-tang' },
        { label: 'Quản lý Vendor', to: '/platform/quan-ly-van-hanh/quan-ly-vendor' },
        { label: 'Cư dân', to: '/platform/customers' },
        { label: 'Quản lý yêu cầu', to: '/platform/tickets' }
      ]
    },
    {
      label: 'Quản lý đơn hàng',
      icon: 'receipt_long',
      children: [
        { label: 'Đơn hàng vendor', to: '/platform/quan-ly-don-hang/don-hang-vendor' },
        { label: 'Đơn hàng OG', to: '/platform/quan-ly-don-hang/don-hang-og' }
      ]
    },
    {
      label: 'Báo cáo tổng hợp',
      icon: 'assessment',
      children: [
        { label: 'Tổng quan', to: '/platform/modules/bao-cao-tong-hop/tong-quan' },
        { label: 'Doanh thu nền tảng', to: '/platform/modules/bao-cao-tong-hop/doanh-thu-tong-hop' },
        { label: 'Chất lượng & CSAT', to: '/platform/modules/bao-cao-tong-hop/chat-luong-csat' },
        { label: 'Xu hướng dịch vụ', to: '/platform/modules/bao-cao-tong-hop/xu-huong-dich-vu' },
        { label: 'Phân khúc cư dân', to: '/platform/modules/bao-cao-tong-hop/phan-khuc-cu-dan' },
        { label: 'Sức khỏe công ty vận hành & dự án', to: '/platform/modules/bao-cao-tong-hop/suc-khoe-tenant-du-an' },
        { label: 'Hoa hồng & phân bổ', to: '/platform/modules/bao-cao-tong-hop/hoa-hong-phan-bo' },
        { label: 'Hiệu suất vendor', to: '/platform/modules/bao-cao-tong-hop/hieu-suat-vendor' }
      ]
    },
    {
      label: 'Hệ thống',
      icon: 'settings',
      children: [
        { label: 'API Clients', to: '/platform/api-clients' },
        { label: 'Tài khoản nhận CK', to: '/platform/settings/bank-account' }
      ]
    }
  ])

  return { navigationItems }
}
