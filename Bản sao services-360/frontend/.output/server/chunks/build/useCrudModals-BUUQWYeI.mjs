import { v as vueExports } from './server.mjs';
import { a as getApiValidationErrors, g as getApiErrorMessage } from './apiError-DBrxF9au.mjs';

function useCrudModals() {
  const showFormModal = vueExports.ref(false);
  const formMode = vueExports.ref("create");
  const editTarget = vueExports.ref(null);
  const formApiErrors = vueExports.ref({});
  const formErrorMessage = vueExports.ref(null);
  function openCreateModal() {
    formMode.value = "create";
    editTarget.value = null;
    formApiErrors.value = {};
    formErrorMessage.value = null;
    showFormModal.value = true;
  }
  function openEditModal(item) {
    formMode.value = "edit";
    editTarget.value = item;
    formApiErrors.value = {};
    formErrorMessage.value = null;
    showFormModal.value = true;
  }
  function closeFormModal() {
    showFormModal.value = false;
  }
  function handleFormError(error) {
    const errors = getApiValidationErrors(error);
    if (errors) {
      formApiErrors.value = errors;
      formErrorMessage.value = null;
    } else {
      formErrorMessage.value = getApiErrorMessage(error);
    }
  }
  const showDeleteModal = vueExports.ref(false);
  const deleteTarget = vueExports.ref(null);
  function openDeleteModal(item) {
    deleteTarget.value = item;
    showDeleteModal.value = true;
  }
  function closeDeleteModal() {
    showDeleteModal.value = false;
    deleteTarget.value = null;
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
  };
}

export { useCrudModals as u };
//# sourceMappingURL=useCrudModals-BUUQWYeI.mjs.map
