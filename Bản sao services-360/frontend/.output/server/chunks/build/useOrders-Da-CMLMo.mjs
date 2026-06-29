import { o as useApiFetch, v as vueExports, $ as $api, au as clearNuxtData } from './server.mjs';

function orderStatusColor(value) {
  switch (value) {
    case "draft":
      return "neutral";
    case "confirmed":
      return "primary";
    case "in_progress":
      return "warning";
    case "accepted":
      return "success";
    case "completed":
      return "success";
    case "cancelled":
      return "error";
    default:
      return "neutral";
  }
}
const ORDER_STATUS_OPTIONS = [
  { label: "Nháp", value: "draft" },
  { label: "Đã xác nhận", value: "confirmed" },
  { label: "Đang thực hiện", value: "in_progress" },
  { label: "Đã nghiệm thu", value: "accepted" },
  { label: "Hoàn thành", value: "completed" },
  { label: "Đã hủy", value: "cancelled" }
];
const ORDER_WORKFLOW_STEPS = [
  { value: "draft", title: "Nháp", description: "Đơn hàng mới tạo", icon: "i-lucide-file-edit" },
  { value: "confirmed", title: "Đã xác nhận", description: "Chờ thực hiện", icon: "i-lucide-check-circle" },
  { value: "in_progress", title: "Đang thực hiện", description: "Đang thi công", icon: "i-lucide-loader" },
  { value: "accepted", title: "Đã nghiệm thu", description: "Đã nghiệm thu", icon: "i-lucide-clipboard-check" },
  { value: "completed", title: "Hoàn thành", description: "Đã hoàn tất", icon: "i-lucide-circle-check-big" }
];
const ORDER_STATUS_ALERT = {
  draft: { title: "Đơn hàng đang ở trạng thái nháp.", color: "neutral", icon: "i-lucide-file-edit" },
  confirmed: { title: "Đơn hàng đã xác nhận.", color: "info", icon: "i-lucide-check-circle" },
  in_progress: { title: "Đơn hàng đang thực hiện.", color: "warning", icon: "i-lucide-loader" },
  accepted: { title: "Đơn hàng đã nghiệm thu.", color: "success", icon: "i-lucide-clipboard-check" },
  completed: { title: "Đơn hàng đã hoàn thành.", color: "success", icon: "i-lucide-circle-check-big" },
  cancelled: { title: "Đơn hàng đã bị hủy.", color: "error", icon: "i-lucide-x-circle" }
};
function useOrderList(params) {
  return useApiFetch(
    "/pmc/orders",
    { query: params, watch: [params] }
  );
}
const ORDER_DETAIL_KEY = (id) => `order-detail-${id}`;
function useOrderDetail(id) {
  return useApiFetch(
    vueExports.computed(() => `/pmc/orders/${vueExports.toValue(id)}`),
    { key: vueExports.computed(() => ORDER_DETAIL_KEY(vueExports.toValue(id))), watch: [() => vueExports.toValue(id)] }
  );
}
function clearOrderCache(id) {
  clearNuxtData(ORDER_DETAIL_KEY(id));
}
function useAvailableQuotes() {
  return useApiFetch("/pmc/orders/available-quotes");
}
function apiCheckDeleteOrder(id) {
  return $api(`/pmc/orders/${id}/check-delete`);
}
function apiCreateOrder(data) {
  return $api("/pmc/orders", {
    method: "POST",
    body: data
  });
}
function apiUpdateOrder(id, data) {
  return $api(`/pmc/orders/${id}`, {
    method: "PUT",
    body: data
  });
}
function apiDeleteOrder(id) {
  return $api(`/pmc/orders/${id}`, {
    method: "DELETE"
  });
}
function apiTransitionOrder(id, data) {
  return $api(`/pmc/orders/${id}/transition`, {
    method: "POST",
    body: data
  });
}
const ADVANCE_STATUS_LABELS = {
  none: "Chưa gán",
  pending: "Chưa hoàn",
  paid: "Đã hoàn"
};
function advanceStatusColor(status) {
  switch (status) {
    case "paid":
      return "success";
    case "pending":
      return "warning";
    default:
      return "neutral";
  }
}
function useOrderActiveAccounts(search = void 0) {
  const params = vueExports.computed(() => ({ search: vueExports.toValue(search) || void 0 }));
  return useApiFetch(
    "/pmc/orders/active-accounts",
    {
      query: params,
      watch: [params],
      immediate: false
    }
  );
}
function apiSetOrderLineAdvancePayer(orderId, lineId, advancePayerId) {
  return $api(
    `/pmc/orders/${orderId}/lines/${lineId}/advance-payer`,
    {
      method: "PATCH",
      body: { advance_payer_id: advancePayerId }
    }
  );
}
function apiUpdateOrderLinePrices(orderId, lineId, data) {
  return $api(
    `/pmc/orders/${orderId}/lines/${lineId}/prices`,
    {
      method: "PATCH",
      body: data
    }
  );
}

export { ADVANCE_STATUS_LABELS as A, ORDER_STATUS_OPTIONS as O, useAvailableQuotes as a, apiCreateOrder as b, apiDeleteOrder as c, apiCheckDeleteOrder as d, useOrderDetail as e, ORDER_STATUS_ALERT as f, ORDER_WORKFLOW_STEPS as g, useOrderActiveAccounts as h, advanceStatusColor as i, apiUpdateOrder as j, clearOrderCache as k, apiSetOrderLineAdvancePayer as l, apiUpdateOrderLinePrices as m, apiTransitionOrder as n, orderStatusColor as o, useOrderList as u };
//# sourceMappingURL=useOrders-Da-CMLMo.mjs.map
