import { o as useApiFetch, v as vueExports, $ as $api } from './server.mjs';

function useDepartmentList(params) {
  return useApiFetch("/pmc/departments", {
    query: params,
    watch: [params]
  });
}
function useDepartmentDetail(id, options = {}) {
  return useApiFetch(
    vueExports.computed(() => `/pmc/departments/${vueExports.toValue(id)}`),
    {
      watch: options.immediate === false ? false : [() => vueExports.toValue(id)],
      immediate: options.immediate ?? true
    }
  );
}
function apiGetDepartment(id) {
  return $api(`/pmc/departments/${id}`);
}
function apiCreateDepartment(data) {
  return $api("/pmc/departments", { method: "POST", body: data });
}
function apiUpdateDepartment(id, data) {
  return $api(`/pmc/departments/${id}`, { method: "PUT", body: data });
}
function apiDeleteDepartment(id) {
  return $api(`/pmc/departments/${id}`, { method: "DELETE" });
}
async function apiGetSelfAndDescendantIds(departmentId) {
  const res = await $api(`/pmc/departments/${departmentId}/descendant-ids`);
  return [departmentId, ...res.data];
}

export { apiCreateDepartment as a, apiUpdateDepartment as b, apiDeleteDepartment as c, apiGetDepartment as d, apiGetSelfAndDescendantIds as e, useDepartmentDetail as f, useDepartmentList as u };
//# sourceMappingURL=useDepartments-C8BvGnCs.mjs.map
