import { v as vueExports } from './server.mjs';
import { b as getApiErrorStatus, g as getApiErrorMessage } from './apiError-DBrxF9au.mjs';

function useCheckDelete(options) {
  const isCheckingDelete = vueExports.ref(false);
  const deleteBlockedMessage = vueExports.ref(null);
  async function openDeleteModal(item) {
    deleteBlockedMessage.value = null;
    options.crud.openDeleteModal(item);
    if (options.checkFn) {
      isCheckingDelete.value = true;
      try {
        const result = await options.checkFn(item.id);
        if (!result.can_delete) {
          deleteBlockedMessage.value = result.message;
        }
      } catch {
        deleteBlockedMessage.value = "Không thể kiểm tra. Vui lòng thử lại.";
      } finally {
        isCheckingDelete.value = false;
      }
    }
  }
  function handleDelete() {
    const target = options.crud.deleteTarget.value;
    if (!target) return;
    options.submitDelete(
      () => options.deleteFn(target.id),
      {
        message: options.successMessage,
        navigateAfter: options.navigateAfter,
        onError: options.errorFallback ? (err) => {
          if (getApiErrorStatus(err) === 422) {
            deleteBlockedMessage.value = getApiErrorMessage(err, options.errorFallback);
            return true;
          }
          return false;
        } : void 0
      }
    );
  }
  return { isCheckingDelete, deleteBlockedMessage, openDeleteModal, handleDelete };
}

export { useCheckDelete as u };
//# sourceMappingURL=useCheckDelete-ka2wDn0T.mjs.map
