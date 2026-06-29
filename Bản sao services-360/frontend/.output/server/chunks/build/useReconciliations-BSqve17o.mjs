import { o as useApiFetch, v as vueExports, $ as $api, au as clearNuxtData } from './server.mjs';

function reconciliationStatusColor(value) {
  if (value === "reconciled") return "success";
  if (value === "rejected") return "error";
  return "warning";
}
function reconciliationSourceColor(value) {
  return value === "manual_cash" ? "secondary" : "primary";
}
const RECONCILIATION_STATUS_OPTIONS = [
  { label: "Chờ đối soát", value: "pending" },
  { label: "Đã đối soát", value: "reconciled" },
  { label: "Từ chối", value: "rejected" }
];
const RECONCILIATION_SOURCE_OPTIONS = [
  { label: "Công nợ", value: "receivable" },
  { label: "Quỹ thủ công", value: "manual_cash" }
];
const PAYMENT_TYPE_FILTER_OPTIONS = [
  { label: "Thu tiền", value: "collection" },
  { label: "Hoàn trả", value: "refund" }
];
function useReconciliationList(params) {
  return useApiFetch(
    "/pmc/reconciliations",
    { query: params, watch: [params] }
  );
}
function useReconciliationSummary(params) {
  return useApiFetch(
    "/pmc/reconciliations/summary",
    { query: params, watch: [params] }
  );
}
const RECONCILIATION_DETAIL_KEY = (id) => `reconciliation-detail-${id}`;
function useReconciliationDetail(id) {
  return useApiFetch(
    vueExports.computed(() => `/pmc/reconciliations/${vueExports.toValue(id)}`),
    { key: vueExports.computed(() => RECONCILIATION_DETAIL_KEY(vueExports.toValue(id))), watch: [() => vueExports.toValue(id)] }
  );
}
function clearReconciliationCache(id) {
  clearNuxtData(RECONCILIATION_DETAIL_KEY(id));
}
function apiReconcile(id, data) {
  return $api(
    `/pmc/reconciliations/${id}/reconcile`,
    { method: "POST", body: data }
  );
}
function apiRejectReconcile(id, data) {
  return $api(
    `/pmc/reconciliations/${id}/reject`,
    { method: "POST", body: data }
  );
}
function apiBatchReconcile(data) {
  return $api(
    "/pmc/reconciliations/batch-reconcile",
    { method: "POST", body: data }
  );
}

export { PAYMENT_TYPE_FILTER_OPTIONS as P, RECONCILIATION_STATUS_OPTIONS as R, useReconciliationSummary as a, RECONCILIATION_SOURCE_OPTIONS as b, reconciliationSourceColor as c, apiReconcile as d, apiBatchReconcile as e, useReconciliationDetail as f, clearReconciliationCache as g, apiRejectReconcile as h, reconciliationStatusColor as r, useReconciliationList as u };
//# sourceMappingURL=useReconciliations-BSqve17o.mjs.map
