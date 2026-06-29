import { v as vueExports, o as useApiFetch, ay as usePlatformApiFetch, aD as $platformApi } from './server.mjs';

function buildQuery(p) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(p)) {
    if (v === void 0 || v === null || v === "") continue;
    q.set(k, String(v));
  }
  return q.toString();
}
function partnerBase(partnerId) {
  return `/pmc/partners/${partnerId}/orders`;
}
function useVendorOrderList(partnerId, params = () => ({})) {
  const url = vueExports.computed(() => {
    const qs = buildQuery(vueExports.toValue(params));
    return `${partnerBase(vueExports.toValue(partnerId))}${qs ? `?${qs}` : ""}`;
  });
  return useApiFetch(url, {
    watch: [() => vueExports.toValue(partnerId), () => vueExports.toValue(params)]
  });
}
function useVendorOrderDetail(partnerId, orderId) {
  const url = vueExports.computed(() => {
    const oid = vueExports.toValue(orderId);
    return oid ? `${partnerBase(vueExports.toValue(partnerId))}/${oid}` : "";
  });
  return useApiFetch(url, {
    immediate: false,
    watch: [() => vueExports.toValue(partnerId), () => vueExports.toValue(orderId)]
  });
}
function useVendorOrderSummary(partnerId, params = () => ({})) {
  const url = vueExports.computed(() => {
    const qs = buildQuery(vueExports.toValue(params));
    return `${partnerBase(vueExports.toValue(partnerId))}/summary${qs ? `?${qs}` : ""}`;
  });
  return useApiFetch(url, {
    watch: [() => vueExports.toValue(partnerId), () => vueExports.toValue(params)]
  });
}
const ALL_ORDERS_BASE = "/pmc/vendor-orders";
function useAllVendorOrderList(params = () => ({})) {
  const url = vueExports.computed(() => {
    const qs = buildQuery(vueExports.toValue(params));
    return `${ALL_ORDERS_BASE}${qs ? `?${qs}` : ""}`;
  });
  return useApiFetch(url, {
    watch: [() => vueExports.toValue(params)]
  });
}
function useAllVendorOrderSummary(params = () => ({})) {
  const url = vueExports.computed(() => {
    const qs = buildQuery(vueExports.toValue(params));
    return `${ALL_ORDERS_BASE}/summary${qs ? `?${qs}` : ""}`;
  });
  return useApiFetch(url, {
    watch: [() => vueExports.toValue(params)]
  });
}
function platformPartnerBase(partnerId) {
  return `/platform/partners/${partnerId}/orders`;
}
function usePlatformVendorOrderDetail(partnerId, orderId) {
  const url = vueExports.computed(() => {
    const oid = vueExports.toValue(orderId);
    return oid ? `${platformPartnerBase(vueExports.toValue(partnerId))}/${oid}` : "";
  });
  return usePlatformApiFetch(url, {
    immediate: false,
    watch: [() => vueExports.toValue(partnerId), () => vueExports.toValue(orderId)]
  });
}
const CONSOLE_ORDERS_BASE = "/platform/vendor-orders";
function usePlatformVendorOrderConsoleList(params = () => ({})) {
  const url = vueExports.computed(() => {
    const qs = buildQuery(vueExports.toValue(params));
    return `${CONSOLE_ORDERS_BASE}${qs ? `?${qs}` : ""}`;
  });
  return usePlatformApiFetch(url, {
    watch: [() => vueExports.toValue(params)]
  });
}
function usePlatformVendorOrderConsoleSummary(params = () => ({})) {
  const url = vueExports.computed(() => {
    const qs = buildQuery(vueExports.toValue(params));
    return `${CONSOLE_ORDERS_BASE}/summary${qs ? `?${qs}` : ""}`;
  });
  return usePlatformApiFetch(url, {
    watch: [() => vueExports.toValue(params)]
  });
}
function apiAssignVendorOrderCommission(partnerId, orderId, payload) {
  return $platformApi(
    `/platform/partners/${partnerId}/orders/${orderId}/commission-override`,
    { method: "PUT", body: payload }
  );
}
function apiRemoveVendorOrderCommission(partnerId, orderId) {
  return $platformApi(
    `/platform/partners/${partnerId}/orders/${orderId}/commission-override`,
    { method: "DELETE" }
  );
}
function apiUpdateVendorOrderStatus(partnerId, orderId, payload) {
  return $platformApi(
    `/platform/partners/${partnerId}/orders/${orderId}/status`,
    { method: "PATCH", body: payload }
  );
}
const VENDOR_ORDER_TYPE_OPTIONS = [
  { value: "product", label: "Sản phẩm" },
  { value: "service", label: "Dịch vụ" },
  { value: "mixed", label: "Hỗn hợp" }
];
function vendorOrderStatusColor(value) {
  switch (value) {
    case "confirmed":
      return "info";
    case "completed":
      return "success";
    case "cancelled":
      return "error";
    default:
      return "warning";
  }
}
function revenueRecipientColor(value) {
  return value === "operating_company" ? "primary" : "success";
}
function vendorOrderTypeOption(items) {
  const hasService = items.some((i) => i.item_type === "service");
  const hasProduct = items.some((i) => i.item_type !== "service");
  const value = hasService && hasProduct ? "mixed" : hasService ? "service" : "product";
  return { value, label: VENDOR_ORDER_TYPE_OPTIONS.find((o) => o.value === value)?.label ?? "Sản phẩm" };
}
const VENDOR_ORDER_STATUS_OPTIONS = [
  { value: "pending", label: "Chờ xử lý", color: "amber" },
  { value: "confirmed", label: "Đã xác nhận", color: "info" },
  { value: "completed", label: "Hoàn thành", color: "success" },
  { value: "cancelled", label: "Đã huỷ", color: "error" }
];

export { VENDOR_ORDER_TYPE_OPTIONS as V, useVendorOrderList as a, usePlatformVendorOrderDetail as b, useVendorOrderDetail as c, useAllVendorOrderSummary as d, useAllVendorOrderList as e, VENDOR_ORDER_STATUS_OPTIONS as f, usePlatformVendorOrderConsoleSummary as g, usePlatformVendorOrderConsoleList as h, vendorOrderTypeOption as i, apiRemoveVendorOrderCommission as j, apiUpdateVendorOrderStatus as k, apiAssignVendorOrderCommission as l, revenueRecipientColor as r, useVendorOrderSummary as u, vendorOrderStatusColor as v };
//# sourceMappingURL=useVendorOrders-DqEI_vYD.mjs.map
