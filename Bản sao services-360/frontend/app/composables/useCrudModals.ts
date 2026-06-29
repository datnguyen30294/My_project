type ModalMode = 'create' | 'edit'

export function useCrudModals<T>() {
  // --- Form Modal ---
  const showFormModal = ref(false)
  const formMode = ref<ModalMode>('create')
  const editTarget = ref<T | null>(null) as Ref<T | null>
  const formApiErrors = ref<Record<string, string[]>>({})
  const formErrorMessage = ref<string | null>(null)

  function openCreateModal() {
    formMode.value = 'create'
    editTarget.value = null
    formApiErrors.value = {}
    formErrorMessage.value = null
    showFormModal.value = true
  }

  function openEditModal(item: T) {
    formMode.value = 'edit'
    editTarget.value = item
    formApiErrors.value = {}
    formErrorMessage.value = null
    showFormModal.value = true
  }

  function closeFormModal() {
    showFormModal.value = false
  }

  function handleFormError(error: unknown) {
    const errors = getApiValidationErrors(error)
    if (errors) {
      formApiErrors.value = errors
      formErrorMessage.value = null
    } else {
      formErrorMessage.value = getApiErrorMessage(error)
    }
  }

  // --- Delete Modal ---
  const showDeleteModal = ref(false)
  const deleteTarget = ref<T | null>(null) as Ref<T | null>

  function openDeleteModal(item: T) {
    deleteTarget.value = item
    showDeleteModal.value = true
  }

  function closeDeleteModal() {
    showDeleteModal.value = false
    deleteTarget.value = null
  }

  return {
    showFormModal,
    formMode,
    editTarget,
    formApiErrors,
    formErrorMessage,
    openCreateModal,
    openEditModal,
    closeFormModal,
    handleFormError,

    showDeleteModal,
    deleteTarget,
    openDeleteModal,
    closeDeleteModal
  }
}
