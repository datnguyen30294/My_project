import { o as useApiFetch, v as vueExports, $ as $api } from './server.mjs';

function useJobTitleList(params) {
  return useApiFetch("/pmc/job-titles", {
    query: params,
    watch: [params]
  });
}
function useJobTitleDetail(id) {
  return useApiFetch(
    vueExports.computed(() => `/pmc/job-titles/${vueExports.toValue(id)}`),
    {
      watch: [() => vueExports.toValue(id)]
    }
  );
}
function apiGetJobTitle(id) {
  return $api(`/pmc/job-titles/${id}`);
}
function apiCreateJobTitle(data) {
  return $api("/pmc/job-titles", { method: "POST", body: data });
}
function apiUpdateJobTitle(id, data) {
  return $api(`/pmc/job-titles/${id}`, { method: "PUT", body: data });
}
function apiDeleteJobTitle(id) {
  return $api(`/pmc/job-titles/${id}`, { method: "DELETE" });
}
function apiCheckDeleteJobTitle(id) {
  return $api(`/pmc/job-titles/${id}/check-delete`);
}

export { apiGetJobTitle as a, useJobTitleDetail as b, apiUpdateJobTitle as c, apiDeleteJobTitle as d, apiCheckDeleteJobTitle as e, apiCreateJobTitle as f, useJobTitleList as u };
//# sourceMappingURL=useJobTitles-DzuQHrcS.mjs.map
