import { o as useApiFetch, v as vueExports, $ as $api } from './server.mjs';

function useCatalogSupplierList(params) {
  return useApiFetch("/pmc/catalog/suppliers", {
    query: params,
    watch: [params]
  });
}
function useCatalogSupplierDetail(id, options = {}) {
  return useApiFetch(
    vueExports.computed(() => `/pmc/catalog/suppliers/${vueExports.toValue(id)}`),
    {
      watch: options.immediate === false ? false : [() => vueExports.toValue(id)],
      immediate: options.immediate ?? true
    }
  );
}
function apiGetCatalogSupplier(id) {
  return $api(`/pmc/catalog/suppliers/${id}`);
}
function apiCreateCatalogSupplier(data) {
  return $api("/pmc/catalog/suppliers", { method: "POST", body: data });
}
function apiUpdateCatalogSupplier(id, data) {
  return $api(`/pmc/catalog/suppliers/${id}`, { method: "PUT", body: data });
}
function apiDeleteCatalogSupplier(id) {
  return $api(`/pmc/catalog/suppliers/${id}`, { method: "DELETE" });
}
function apiCheckDeleteCatalogSupplier(id) {
  return $api(`/pmc/catalog/suppliers/${id}/check-delete`);
}

export { apiGetCatalogSupplier as a, useCatalogSupplierDetail as b, apiUpdateCatalogSupplier as c, apiDeleteCatalogSupplier as d, apiCheckDeleteCatalogSupplier as e, apiCreateCatalogSupplier as f, useCatalogSupplierList as u };
//# sourceMappingURL=useCatalogSuppliers-DJ8n9zOn.mjs.map
