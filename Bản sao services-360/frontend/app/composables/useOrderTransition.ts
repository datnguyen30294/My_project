import type { TransitionOrderRequest } from '#api/generated/laravel'

export function useOrderTransition(
  id: Ref<number> | ComputedRef<number>,
  options: { onSuccess?: () => void | Promise<void> } = {}
) {
  const toast = useToast()
  const isTransitioning = ref(false)

  async function handleTransition(targetStatus: TransitionOrderRequest['status']) {
    isTransitioning.value = true
    try {
      await apiTransitionOrder(toValue(id), { status: targetStatus })
      toast.add({ title: 'Chuyển trạng thái thành công', color: 'success' })
      clearOrderCache(toValue(id))
      await options.onSuccess?.()
    } catch (err) {
      toast.add({ title: getApiErrorMessage(err, 'Chuyển trạng thái thất bại'), color: 'error' })
    } finally {
      isTransitioning.value = false
    }
  }

  return {
    isTransitioning,
    handleTransition
  }
}
