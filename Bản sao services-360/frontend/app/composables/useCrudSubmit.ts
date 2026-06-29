/**
 * Reusable CRUD submit/delete logic that wraps the try/catch/toast/refresh boilerplate.
 * Used together with useCrudModals() to eliminate repeated code in list & detail pages.
 */
export function useCrudSubmit<T>(
  crud: ReturnType<typeof useCrudModals<T>>,
  refresh: () => Promise<void>
) {
  const toast = useToast()

  // --- Form Submit ---
  const isSubmitting = ref(false)

  async function submitForm(
    createFn: (() => Promise<unknown>) | null,
    updateFn: (() => Promise<unknown>) | null,
    messages: { create?: string, update?: string }
  ) {
    crud.formApiErrors.value = {}
    isSubmitting.value = true

    try {
      if (crud.formMode.value === 'create' && createFn) {
        await createFn()
        toast.add({ title: messages.create ?? 'Thêm thành công', color: 'success' })
      } else if (crud.editTarget.value && updateFn) {
        await updateFn()
        toast.add({ title: messages.update ?? 'Cập nhật thành công', color: 'success' })
      }
      await refresh()
      crud.showFormModal.value = false
    } catch (err) {
      crud.handleFormError(err)

      // Lỗi nghiệp vụ (không phải validation per-field) → toast để mọi form
      // đều thấy thông báo, kể cả modal chưa render error-message.
      if (crud.formErrorMessage.value) {
        toast.add({ title: crud.formErrorMessage.value, color: 'error', icon: 'i-lucide-alert-circle' })
      }
    } finally {
      isSubmitting.value = false
    }
  }

  // --- Delete ---
  const isDeleting = ref(false)

  async function submitDelete(
    deleteFn: () => Promise<unknown>,
    options?: {
      message?: string
      /** Navigate to this path after successful delete (for detail pages) */
      navigateAfter?: string
      /** Custom error handler. Return true if error was handled. */
      onError?: (err: unknown) => boolean
    }
  ) {
    if (!crud.deleteTarget.value) return

    isDeleting.value = true
    try {
      await deleteFn()
      toast.add({ title: options?.message ?? 'Đã xoá thành công', color: 'success' })
      if (options?.navigateAfter) {
        navigateTo(options.navigateAfter)
      } else {
        await refresh()
        crud.closeDeleteModal()
      }
    } catch (err) {
      if (options?.onError?.(err)) {
        // Custom error handling took over
      } else {
        toast.add({ title: getApiErrorMessage(err, 'Xoá thất bại'), color: 'error' })
        crud.showDeleteModal.value = false
      }
    } finally {
      isDeleting.value = false
    }
  }

  return { isSubmitting, submitForm, isDeleting, submitDelete }
}
