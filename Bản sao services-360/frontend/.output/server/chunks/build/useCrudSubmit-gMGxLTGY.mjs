import { j as useToast, v as vueExports, q as navigateTo } from './server.mjs';
import { g as getApiErrorMessage } from './apiError-DBrxF9au.mjs';

function useCrudSubmit(crud, refresh) {
  const toast = useToast();
  const isSubmitting = vueExports.ref(false);
  async function submitForm(createFn, updateFn, messages) {
    crud.formApiErrors.value = {};
    isSubmitting.value = true;
    try {
      if (crud.formMode.value === "create" && createFn) {
        await createFn();
        toast.add({ title: messages.create ?? "Thêm thành công", color: "success" });
      } else if (crud.editTarget.value && updateFn) {
        await updateFn();
        toast.add({ title: messages.update ?? "Cập nhật thành công", color: "success" });
      }
      await refresh();
      crud.showFormModal.value = false;
    } catch (err) {
      crud.handleFormError(err);
      if (crud.formErrorMessage.value) {
        toast.add({ title: crud.formErrorMessage.value, color: "error", icon: "i-lucide-alert-circle" });
      }
    } finally {
      isSubmitting.value = false;
    }
  }
  const isDeleting = vueExports.ref(false);
  async function submitDelete(deleteFn, options) {
    if (!crud.deleteTarget.value) return;
    isDeleting.value = true;
    try {
      await deleteFn();
      toast.add({ title: options?.message ?? "Đã xoá thành công", color: "success" });
      if (options?.navigateAfter) {
        navigateTo(options.navigateAfter);
      } else {
        await refresh();
        crud.closeDeleteModal();
      }
    } catch (err) {
      if (options?.onError?.(err)) ;
      else {
        toast.add({ title: getApiErrorMessage(err, "Xoá thất bại"), color: "error" });
        crud.showDeleteModal.value = false;
      }
    } finally {
      isDeleting.value = false;
    }
  }
  return { isSubmitting, submitForm, isDeleting, submitDelete };
}

export { useCrudSubmit as u };
//# sourceMappingURL=useCrudSubmit-gMGxLTGY.mjs.map
