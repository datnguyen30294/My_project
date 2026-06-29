import { o as useApiFetch, v as vueExports, $ as $api } from './server.mjs';

const COMMISSION_VALUE_TYPE_OPTIONS = [
  { label: "Phần trăm", value: "percent" },
  { label: "Tiền cứng", value: "fixed" },
  { label: "Cả hai", value: "both" }
];
const COMMISSION_PARTY_LABELS = {
  operating_company: "Công ty vận hành",
  board_of_directors: "Ban quản trị",
  management: "Ban quản lý"
};
const COMMISSION_PARTY_ORDER = [
  "operating_company",
  "board_of_directors",
  "management"
];
function useCommissionProjects() {
  return useApiFetch("/pmc/commission/projects");
}
function useCommissionConfig(projectId) {
  return useApiFetch(
    vueExports.computed(() => `/pmc/commission/projects/${vueExports.toValue(projectId)}`),
    { watch: [() => vueExports.toValue(projectId)] }
  );
}
function useAvailableDepartments(projectId) {
  return useApiFetch(
    vueExports.computed(() => `/pmc/commission/projects/${vueExports.toValue(projectId)}/available-departments`),
    { watch: [() => vueExports.toValue(projectId)] }
  );
}
function apiSaveCommissionConfig(projectId, data) {
  return $api(`/pmc/commission/projects/${projectId}`, {
    method: "PUT",
    body: data
  });
}
function apiSaveCommissionAdjusters(projectId, data) {
  return $api(`/pmc/commission/projects/${projectId}/adjusters`, {
    method: "PUT",
    body: data
  });
}

export { COMMISSION_PARTY_ORDER as C, useCommissionConfig as a, useAvailableDepartments as b, COMMISSION_PARTY_LABELS as c, COMMISSION_VALUE_TYPE_OPTIONS as d, apiSaveCommissionConfig as e, apiSaveCommissionAdjusters as f, useCommissionProjects as u };
//# sourceMappingURL=useCommissionConfig-CzVSCENv.mjs.map
