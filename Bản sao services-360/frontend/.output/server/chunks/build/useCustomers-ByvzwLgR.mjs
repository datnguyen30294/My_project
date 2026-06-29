import { o as useApiFetch, v as vueExports, ay as usePlatformApiFetch, $ as $api } from './server.mjs';

function usePlatformCustomerList(params) {
  return usePlatformApiFetch("/platform/customers", {
    query: vueExports.computed(() => vueExports.toValue(params))
  });
}
function usePlatformCustomerDetail(id) {
  const url = vueExports.computed(() => `/platform/customers/${vueExports.toValue(id)}`);
  return usePlatformApiFetch(url);
}
function useCustomerList(params) {
  return useApiFetch("/pmc/customers", {
    query: params,
    watch: [params]
  });
}
function useCustomerDetail(id) {
  return useApiFetch(
    vueExports.computed(() => `/pmc/customers/${vueExports.toValue(id)}`),
    { watch: [() => vueExports.toValue(id)] }
  );
}
function useCustomerTickets(id, params) {
  return useApiFetch(
    vueExports.computed(() => `/pmc/customers/${vueExports.toValue(id)}/tickets`),
    { query: params, watch: [params, () => vueExports.toValue(id)] }
  );
}
function useCustomerOrders(id, params) {
  return useApiFetch(
    vueExports.computed(() => `/pmc/customers/${vueExports.toValue(id)}/orders`),
    { query: params, watch: [params, () => vueExports.toValue(id)] }
  );
}
function useCustomerPayments(id, params) {
  return useApiFetch(
    vueExports.computed(() => `/pmc/customers/${vueExports.toValue(id)}/payments`),
    { query: params, watch: [params, () => vueExports.toValue(id)] }
  );
}
function apiGetCustomer(id) {
  return $api(`/pmc/customers/${id}`);
}
function apiCreateCustomer(body) {
  return $api("/pmc/customers", { method: "POST", body });
}
function apiUpdateCustomer(id, body) {
  return $api(`/pmc/customers/${id}`, { method: "PUT", body });
}
function apiDeleteCustomer(id) {
  return $api(`/pmc/customers/${id}`, { method: "DELETE" });
}
function apiCheckDeleteCustomer(id) {
  return $api(`/pmc/customers/${id}/check-delete`);
}

export { apiGetCustomer as a, apiCreateCustomer as b, apiUpdateCustomer as c, apiDeleteCustomer as d, apiCheckDeleteCustomer as e, usePlatformCustomerDetail as f, usePlatformCustomerList as g, useCustomerDetail as h, useCustomerTickets as i, useCustomerOrders as j, useCustomerPayments as k, useCustomerList as u };
//# sourceMappingURL=useCustomers-ByvzwLgR.mjs.map
