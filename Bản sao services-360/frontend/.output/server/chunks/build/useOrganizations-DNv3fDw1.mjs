import { v as vueExports, ay as usePlatformApiFetch, aD as $platformApi } from './server.mjs';

function usePlatformOrganizationList(params) {
  const url = vueExports.computed(() => {
    const p = vueExports.toValue(params);
    const query = new URLSearchParams();
    if (p.search) query.set("search", String(p.search));
    const qs = query.toString();
    return `/platform/organizations${qs ? `?${qs}` : ""}`;
  });
  return usePlatformApiFetch(url);
}
async function apiGetOrganizationProjects(orgId, search) {
  const query = new URLSearchParams();
  if (search) query.set("search", search);
  const qs = query.toString();
  const res = await $platformApi(
    `/platform/organizations/${orgId}/projects${qs ? `?${qs}` : ""}`
  );
  return res.data;
}

export { apiGetOrganizationProjects as a, usePlatformOrganizationList as u };
//# sourceMappingURL=useOrganizations-DNv3fDw1.mjs.map
