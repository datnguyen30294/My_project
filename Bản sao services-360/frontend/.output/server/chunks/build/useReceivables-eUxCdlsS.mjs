import { o as useApiFetch, v as vueExports, $ as $api, au as clearNuxtData } from './server.mjs';

function receivableStatusColor(value) {
  switch (value) {
    case "unpaid":
      return "neutral";
    case "partial":
      return "warning";
    case "paid":
      return "success";
    case "overpaid":
      return "info";
    case "overdue":
      return "error";
    case "completed":
      return "success";
    case "written_off":
      return "neutral";
    default:
      return "neutral";
  }
}
const RECEIVABLE_STATUS_OPTIONS = [
  { label: "Chưa thu", value: "unpaid" },
  { label: "Thu một phần", value: "partial" },
  { label: "Đã thu đủ", value: "paid" },
  { label: "Thu thừa", value: "overpaid" },
  { label: "Quá hạn", value: "overdue" },
  { label: "Hoàn thành", value: "completed" },
  { label: "Xóa nợ", value: "written_off" }
];
const PAYMENT_METHOD_OPTIONS = [
  { label: "Tiền mặt", value: "cash" },
  { label: "Chuyển khoản", value: "transfer" }
];
function paymentReceiptTypeColor(value) {
  return value === "refund" ? "warning" : "success";
}
function formatAgingDays(agingDays, status) {
  if (status === "paid" || status === "overpaid" || status === "completed" || status === "written_off") return "—";
  if (agingDays === null || agingDays === 0) return "Chưa đến hạn";
  return `${agingDays} ngày`;
}
function useReceivableList(params) {
  return useApiFetch(
    "/pmc/receivables",
    { query: params, watch: [params] }
  );
}
function useReceivableSummary(params) {
  return useApiFetch(
    "/pmc/receivables/summary",
    { query: params, watch: [params] }
  );
}
const RECEIVABLE_DETAIL_KEY = (id) => `receivable-detail-${id}`;
function useReceivableDetail(id) {
  return useApiFetch(
    vueExports.computed(() => `/pmc/receivables/${vueExports.toValue(id)}`),
    { key: vueExports.computed(() => RECEIVABLE_DETAIL_KEY(vueExports.toValue(id))), watch: [() => vueExports.toValue(id)] }
  );
}
function clearReceivableCache(id) {
  clearNuxtData(RECEIVABLE_DETAIL_KEY(id));
}
function useReceivableAudits(id) {
  return useApiFetch(
    vueExports.computed(() => `/pmc/receivables/${vueExports.toValue(id)}/audits`),
    { watch: [() => vueExports.toValue(id)] }
  );
}
function apiCreatePayment(receivableId, data) {
  return $api(`/pmc/receivables/${receivableId}/payments`, {
    method: "POST",
    body: data
  });
}
function apiUpdatePayment(receivableId, paymentId, data) {
  return $api(`/pmc/receivables/${receivableId}/payments/${paymentId}`, {
    method: "PUT",
    body: data
  });
}
function apiWriteOffReceivable(receivableId, data) {
  return $api(`/pmc/receivables/${receivableId}/write-off`, {
    method: "POST",
    body: data
  });
}
function apiCreateRefund(receivableId, data) {
  return $api(`/pmc/receivables/${receivableId}/refund`, {
    method: "POST",
    body: data
  });
}
function apiMarkCompleted(receivableId) {
  return $api(`/pmc/receivables/${receivableId}/complete`, {
    method: "POST"
  });
}

export { PAYMENT_METHOD_OPTIONS as P, RECEIVABLE_STATUS_OPTIONS as R, useReceivableSummary as a, useReceivableDetail as b, useReceivableAudits as c, apiUpdatePayment as d, apiCreatePayment as e, formatAgingDays as f, clearReceivableCache as g, apiCreateRefund as h, apiMarkCompleted as i, apiWriteOffReceivable as j, paymentReceiptTypeColor as p, receivableStatusColor as r, useReceivableList as u };
//# sourceMappingURL=useReceivables-eUxCdlsS.mjs.map
