import { o as useApiFetch, v as vueExports, $ as $api } from './server.mjs';

function manualReconciliationStatusColor(value) {
  if (value === "reconciled") return "success";
  if (value === "rejected") return "error";
  return "warning";
}
function cashTransactionCategoryColor(value) {
  const map = {
    manual_topup: "success",
    manual_withdraw: "warning",
    receivable_collection: "primary",
    customer_refund: "secondary",
    commission_payout: "neutral"
  };
  return map[value] ?? "neutral";
}
const CASH_TRANSACTION_DIRECTION_OPTIONS = [
  { label: "Tiền vào", value: "inflow" },
  { label: "Tiền ra", value: "outflow" }
];
const CASH_TRANSACTION_CATEGORY_OPTIONS = [
  { label: "Nạp tiền thủ công", value: "manual_topup" },
  { label: "Rút tiền thủ công", value: "manual_withdraw" },
  { label: "Thu công nợ", value: "receivable_collection" },
  { label: "Hoàn tiền khách", value: "customer_refund" },
  { label: "Chi hoa hồng", value: "commission_payout" }
];
const CASH_TRANSACTION_INCLUDE_DELETED_OPTIONS = [
  { label: "Ẩn đã xoá", value: "none" },
  { label: "Chỉ xoá thủ công", value: "manual" },
  { label: "Chỉ xoá tự động", value: "auto" },
  { label: "Tất cả (kể cả đã xoá)", value: "all" }
];
function useCashAccountDefault() {
  return useApiFetch(
    "/pmc/treasury/cash-accounts/default",
    { key: "treasury-cash-account-default" }
  );
}
function useCashTransactionList(params) {
  return useApiFetch(
    "/pmc/treasury/transactions",
    { query: params, watch: [params] }
  );
}
const CASH_TRANSACTION_DETAIL_KEY = (id) => `cash-transaction-detail-${id}`;
function useCashTransactionDetail(id) {
  return useApiFetch(
    vueExports.computed(() => `/pmc/treasury/transactions/${vueExports.toValue(id)}`),
    {
      key: vueExports.computed(() => CASH_TRANSACTION_DETAIL_KEY(vueExports.toValue(id))),
      watch: [() => vueExports.toValue(id)]
    }
  );
}
function useTreasuryKpi(params) {
  return useApiFetch(
    "/pmc/treasury/summary",
    { query: params, watch: [params] }
  );
}
function apiManualTopup(data) {
  return $api(
    "/pmc/treasury/transactions/manual-topup",
    { method: "POST", body: data }
  );
}
function apiManualWithdraw(data) {
  return $api(
    "/pmc/treasury/transactions/manual-withdraw",
    { method: "POST", body: data }
  );
}
function apiDeleteCashTransaction(id, reason) {
  return $api(
    `/pmc/treasury/transactions/${id}`,
    { method: "DELETE", body: { reason } }
  );
}

export { CASH_TRANSACTION_DIRECTION_OPTIONS as C, useTreasuryKpi as a, useCashTransactionList as b, CASH_TRANSACTION_CATEGORY_OPTIONS as c, CASH_TRANSACTION_INCLUDE_DELETED_OPTIONS as d, cashTransactionCategoryColor as e, useCashTransactionDetail as f, apiManualTopup as g, apiManualWithdraw as h, apiDeleteCashTransaction as i, manualReconciliationStatusColor as m, useCashAccountDefault as u };
//# sourceMappingURL=useTreasury-BKILzBuO.mjs.map
