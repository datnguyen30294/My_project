import { o as useApiFetch, v as vueExports, $ as $api, au as clearNuxtData } from './server.mjs';

function closingPeriodStatusColor(value) {
  return value === "closed" ? "success" : "primary";
}
const CLOSING_PERIOD_STATUS_OPTIONS = [
  { label: "Đang mở", value: "open" },
  { label: "Đã chốt", value: "closed" }
];
function useClosingPeriodList(params) {
  return useApiFetch(
    "/pmc/closing-periods",
    { query: params, watch: [params] }
  );
}
const CLOSING_PERIOD_DETAIL_KEY = (id) => `closing-period-detail-${id}`;
function useClosingPeriodDetail(id) {
  return useApiFetch(
    vueExports.computed(() => `/pmc/closing-periods/${vueExports.toValue(id)}`),
    { key: vueExports.computed(() => CLOSING_PERIOD_DETAIL_KEY(vueExports.toValue(id))), watch: [() => vueExports.toValue(id)] }
  );
}
function clearClosingPeriodCache(id) {
  clearNuxtData(CLOSING_PERIOD_DETAIL_KEY(id));
}
function useEligibleOrders(periodId) {
  return useApiFetch(
    vueExports.computed(() => `/pmc/closing-periods/${vueExports.toValue(periodId)}/eligible-orders`),
    { immediate: false, watch: false }
  );
}
const SNAPSHOT_RECIPIENT_TYPE_OPTIONS = [
  { label: "Platform", value: "platform" },
  { label: "Công ty vận hành", value: "operating_company" },
  { label: "Ban quản trị", value: "board_of_directors" },
  { label: "Nhân viên", value: "staff" }
];
function recipientTypeBadgeColor(value) {
  const map = {
    platform: "info",
    operating_company: "primary",
    board_of_directors: "secondary",
    management: "warning",
    department: "neutral",
    staff: "success"
  };
  return map[value] ?? "neutral";
}
function useCommissionSummary(params) {
  return useApiFetch(
    "/pmc/commission-summary",
    { query: params, watch: [params] }
  );
}
function apiCreateClosingPeriod(data) {
  return $api(
    "/pmc/closing-periods",
    { method: "POST", body: data }
  );
}
function apiAddOrders(periodId, data) {
  return $api(
    `/pmc/closing-periods/${periodId}/add-orders`,
    { method: "POST", body: data }
  );
}
function apiRemoveOrder(periodId, orderId) {
  return $api(
    `/pmc/closing-periods/${periodId}/orders/${orderId}`,
    { method: "DELETE" }
  );
}
function apiClosePeriod(periodId, data) {
  return $api(
    `/pmc/closing-periods/${periodId}/close`,
    { method: "POST", body: data }
  );
}
function apiReopenPeriod(periodId, data) {
  return $api(
    `/pmc/closing-periods/${periodId}/reopen`,
    { method: "POST", body: data }
  );
}
function payoutStatusBadgeColor(value) {
  const map = {
    unpaid: "warning",
    paid: "success",
    partial: "neutral"
  };
  return map[value] ?? "neutral";
}
function payoutStatusLabel(value) {
  const map = {
    unpaid: "Chưa thanh toán",
    paid: "Đã thanh toán",
    partial: "Một phần"
  };
  return map[value] ?? value;
}
function apiUpdatePayoutStatus(data) {
  return $api(
    "/pmc/commission-summary/payout",
    { method: "PATCH", body: data }
  );
}

export { CLOSING_PERIOD_STATUS_OPTIONS as C, SNAPSHOT_RECIPIENT_TYPE_OPTIONS as S, useEligibleOrders as a, apiCreateClosingPeriod as b, closingPeriodStatusColor as c, apiAddOrders as d, apiClosePeriod as e, apiReopenPeriod as f, useCommissionSummary as g, payoutStatusBadgeColor as h, apiUpdatePayoutStatus as i, useClosingPeriodDetail as j, clearClosingPeriodCache as k, apiRemoveOrder as l, payoutStatusLabel as p, recipientTypeBadgeColor as r, useClosingPeriodList as u };
//# sourceMappingURL=useClosingPeriods-HdCSZwWv.mjs.map
