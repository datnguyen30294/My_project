import { j as useToast, v as vueExports } from './server.mjs';
import { o as apiTransitionQuote, n as clearQuoteCache } from './useQuotes-C1-4FXSr.mjs';
import { g as getApiErrorMessage } from './apiError-DBrxF9au.mjs';

function useQuoteTransition(id, options = {}) {
  const toast = useToast();
  const isTransitioning = vueExports.ref(false);
  const showRejectModal = vueExports.ref(false);
  const rejectNote = vueExports.ref("");
  async function handleTransition(targetStatus, note) {
    isTransitioning.value = true;
    try {
      await apiTransitionQuote(vueExports.toValue(id), { status: targetStatus, note });
      toast.add({ title: "Chuyển trạng thái thành công", color: "success" });
      clearQuoteCache(vueExports.toValue(id));
      await options.onSuccess?.();
    } catch (err) {
      toast.add({ title: getApiErrorMessage(err, "Chuyển trạng thái thất bại"), color: "error" });
    } finally {
      isTransitioning.value = false;
    }
  }
  function openRejectModal() {
    rejectNote.value = "";
    showRejectModal.value = true;
  }
  function confirmReject(currentStatus) {
    showRejectModal.value = false;
    const rejectStatus = currentStatus === "manager_approved" ? "resident_rejected" : "manager_rejected";
    handleTransition(rejectStatus, rejectNote.value || void 0);
  }
  return {
    isTransitioning,
    showRejectModal,
    rejectNote,
    handleTransition,
    openRejectModal,
    confirmReject
  };
}

export { useQuoteTransition as u };
//# sourceMappingURL=useQuoteTransition-C55tMBSm.mjs.map
