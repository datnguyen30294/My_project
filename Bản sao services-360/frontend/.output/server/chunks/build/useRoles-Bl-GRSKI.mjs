import { o as useApiFetch, v as vueExports, $ as $api } from './server.mjs';

function useRoleList(params) {
  return useApiFetch("/pmc/roles", {
    query: params,
    watch: [params]
  });
}
function useRoleDetail(id) {
  return useApiFetch(
    vueExports.computed(() => `/pmc/roles/${vueExports.toValue(id)}`),
    {
      watch: [() => vueExports.toValue(id)]
    }
  );
}
function apiGetRole(id) {
  return $api(`/pmc/roles/${id}`);
}
function apiSearchRoles(search) {
  return $api("/pmc/roles", { query: { search, per_page: 1 } });
}
function apiCreateRole(data) {
  return $api("/pmc/roles", { method: "POST", body: data });
}
function apiUpdateRole(id, data) {
  return $api(`/pmc/roles/${id}`, { method: "PUT", body: data });
}
function apiDeleteRole(id) {
  return $api(`/pmc/roles/${id}`, { method: "DELETE" });
}
function usePermissionList(options) {
  return useApiFetch("/pmc/permissions", {
    immediate: options?.immediate
  });
}

export { usePermissionList as a, apiUpdateRole as b, apiDeleteRole as c, useRoleList as d, apiCreateRole as e, apiSearchRoles as f, apiGetRole as g, useRoleDetail as u };
//# sourceMappingURL=useRoles-Bl-GRSKI.mjs.map
