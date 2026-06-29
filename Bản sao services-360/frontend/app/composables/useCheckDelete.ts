/**
 * Reusable delete-with-precheck pattern.
 *
 * Handles: pre-check API call, blocked message state, 422 error catching.
 * Works alongside useCrudModals + useCrudSubmit.
 */
export function useCheckDelete<T extends { id: number }>(options: {
  crud: ReturnType<typeof useCrudModals<T>>
  submitDelete: ReturnType<typeof useCrudSubmit<T>>['submitDelete']
  /** Pre-check API. If omitted, no pre-check is performed. */
  checkFn?: (id: number) => Promise<{ can_delete: boolean, message: string }>
  /** Delete API */
  deleteFn: (id: number) => Promise<unknown>
  /** Toast message on successful delete */
  successMessage: string
  /** If provided, 422 errors set this as the blocked message instead of closing the modal */
  errorFallback?: string
  /** Navigate after successful delete (for detail pages) */
  navigateAfter?: string
}) {
  const isCheckingDelete = ref(false)
  const deleteBlockedMessage = ref<string | null>(null)

  async function openDeleteModal(item: T) {
    deleteBlockedMessage.value = null
    options.crud.openDeleteModal(item)

    if (options.checkFn) {
      isCheckingDelete.value = true
      try {
        const result = await options.checkFn(item.id)
        if (!result.can_delete) {
          deleteBlockedMessage.value = result.message
        }
      } catch {
        deleteBlockedMessage.value = 'Không thể kiểm tra. Vui lòng thử lại.'
      } finally {
        isCheckingDelete.value = false
      }
    }
  }

  function handleDelete() {
    const target = options.crud.deleteTarget.value
    if (!target) return

    options.submitDelete(
      () => options.deleteFn(target.id),
      {
        message: options.successMessage,
        navigateAfter: options.navigateAfter,
        onError: options.errorFallback
          ? (err: unknown) => {
              if (getApiErrorStatus(err) === 422) {
                deleteBlockedMessage.value = getApiErrorMessage(err, options.errorFallback!)
                return true
              }
              return false
            }
          : undefined
      }
    )
  }

  return { isCheckingDelete, deleteBlockedMessage, openDeleteModal, handleDelete }
}
