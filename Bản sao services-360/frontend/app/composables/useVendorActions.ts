import {
  apiApprovePartner,
  apiDeactivatePartner,
  apiReactivatePartner
} from '~/composables/api/usePartners'

export type VendorActionType = 'approve' | 'deactivate' | 'reactivate'

export interface VendorActionMeta {
  title: string
  description: string
  confirmLabel: string
  confirmColor: 'primary' | 'warning' | 'success'
  icon: string
  toast: string
}

export const VENDOR_ACTION_META: Record<VendorActionType, VendorActionMeta> = {
  approve: {
    title: 'Duyệt vendor',
    description: 'Vendor sẽ chuyển sang trạng thái "Đang hoạt động" và có thể nhận đơn.',
    confirmLabel: 'Duyệt',
    confirmColor: 'success',
    icon: 'i-lucide-check-circle',
    toast: 'Đã duyệt vendor'
  },
  deactivate: {
    title: 'Vô hiệu hoá vendor',
    description: 'Vendor sẽ ngừng nhận đơn mới cho đến khi được kích hoạt lại.',
    confirmLabel: 'Vô hiệu hoá',
    confirmColor: 'warning',
    icon: 'i-lucide-ban',
    toast: 'Đã vô hiệu hoá vendor'
  },
  reactivate: {
    title: 'Kích hoạt lại vendor',
    description: 'Vendor sẽ hoạt động trở lại và có thể nhận đơn.',
    confirmLabel: 'Kích hoạt',
    confirmColor: 'primary',
    icon: 'i-lucide-power',
    toast: 'Đã kích hoạt lại vendor'
  }
}

/**
 * Vendor approval-lifecycle mutations with shared toasts — reused by the
 * console list and detail pages.
 */
export function useVendorActions() {
  const toast = useToast()

  async function runVendorAction(type: VendorActionType, id: number | string): Promise<boolean> {
    const meta = VENDOR_ACTION_META[type]
    try {
      if (type === 'approve') {
        await apiApprovePartner(id)
      } else if (type === 'deactivate') {
        await apiDeactivatePartner(id)
      } else {
        await apiReactivatePartner(id)
      }
      toast.add({ title: meta.toast, color: 'success', icon: 'i-lucide-check-circle' })
      return true
    } catch (err) {
      toast.add({
        title: getApiErrorMessage(err, 'Thao tác thất bại'),
        color: 'error',
        icon: 'i-lucide-alert-circle'
      })
      return false
    }
  }

  return { runVendorAction }
}
