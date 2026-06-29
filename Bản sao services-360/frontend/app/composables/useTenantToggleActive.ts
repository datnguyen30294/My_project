interface ToggleActiveTarget {
  id: string
  name: string
  is_active: boolean
}

/**
 * Shared vô hiệu hoá / kích hoạt lại tenant logic (modal confirm + API call + toast).
 * Dùng chung cho trang danh sách và trang chi tiết công ty vận hành.
 */
export function useTenantToggleActive(refresh: () => Promise<void>) {
  const toast = useToast()

  const showActiveConfirm = ref(false)
  const activeTarget = ref<ToggleActiveTarget | null>(null)
  const isTogglingActive = ref(false)
  const activating = computed(() => !(activeTarget.value?.is_active ?? true))

  function openActiveConfirm(item: ToggleActiveTarget) {
    activeTarget.value = item
    showActiveConfirm.value = true
  }

  async function confirmToggleActive() {
    if (!activeTarget.value) return
    isTogglingActive.value = true
    try {
      await apiToggleTenantActive(activeTarget.value.id, activating.value)
      toast.add({
        title: activating.value
          ? 'Đã kích hoạt lại công ty vận hành'
          : 'Đã vô hiệu hoá công ty vận hành',
        color: 'success',
        icon: 'i-lucide-check-circle'
      })
      showActiveConfirm.value = false
      await refresh()
    } catch (err) {
      toast.add({
        title: getApiErrorMessage(err, 'Không thể cập nhật trạng thái'),
        color: 'error',
        icon: 'i-lucide-alert-circle'
      })
    } finally {
      isTogglingActive.value = false
    }
  }

  return {
    showActiveConfirm,
    activeTarget,
    activating,
    isTogglingActive,
    openActiveConfirm,
    confirmToggleActive
  }
}
