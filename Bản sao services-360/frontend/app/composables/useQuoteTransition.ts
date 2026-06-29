import type { TransitionQuoteRequest } from '#api/generated/laravel'

export function useQuoteTransition(
  id: Ref<number> | ComputedRef<number>,
  options: { onSuccess?: () => void | Promise<void> } = {}
) {
  const toast = useToast()
  const isTransitioning = ref(false)
  const showRejectModal = ref(false)
  const rejectNote = ref('')

  async function handleTransition(targetStatus: TransitionQuoteRequest['status'], note?: string) {
    isTransitioning.value = true
    try {
      await apiTransitionQuote(toValue(id), { status: targetStatus, note })
      toast.add({ title: 'Chuyển trạng thái thành công', color: 'success' })
      clearQuoteCache(toValue(id))
      await options.onSuccess?.()
    } catch (err) {
      toast.add({ title: getApiErrorMessage(err, 'Chuyển trạng thái thất bại'), color: 'error' })
    } finally {
      isTransitioning.value = false
    }
  }

  function openRejectModal() {
    rejectNote.value = ''
    showRejectModal.value = true
  }

  function confirmReject(currentStatus: string) {
    showRejectModal.value = false
    const rejectStatus = currentStatus === 'manager_approved' ? 'resident_rejected' : 'manager_rejected'
    handleTransition(rejectStatus, rejectNote.value || undefined)
  }

  return {
    isTransitioning,
    showRejectModal,
    rejectNote,
    handleTransition,
    openRejectModal,
    confirmReject
  }
}
