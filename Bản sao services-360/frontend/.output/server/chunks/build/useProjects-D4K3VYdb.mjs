import { o as useApiFetch, v as vueExports, $ as $api } from './server.mjs';

function useProjectList(params) {
  return useApiFetch("/pmc/projects", {
    query: params,
    watch: [params]
  });
}
function useProjectDetail(id) {
  return useApiFetch(
    vueExports.computed(() => `/pmc/projects/${vueExports.toValue(id)}`),
    {
      watch: [() => vueExports.toValue(id)]
    }
  );
}
function apiGetProject(id) {
  return $api(`/pmc/projects/${id}`);
}
function apiCreateProject(data) {
  return $api("/pmc/projects", { method: "POST", body: data });
}
function apiUpdateProject(id, data) {
  return $api(`/pmc/projects/${id}`, { method: "PUT", body: data });
}
function apiDeleteProject(id) {
  return $api(`/pmc/projects/${id}`, { method: "DELETE" });
}
function apiSyncProjectMembers(id, accountIds) {
  return $api(`/pmc/projects/${id}/sync-members`, {
    method: "PUT",
    body: { account_ids: accountIds }
  });
}

export { apiUpdateProject as a, apiDeleteProject as b, apiSyncProjectMembers as c, useProjectList as d, apiGetProject as e, apiCreateProject as f, useProjectDetail as u };
//# sourceMappingURL=useProjects-D4K3VYdb.mjs.map
