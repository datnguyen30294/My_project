import { v as vueExports, o as useApiFetch, ay as usePlatformApiFetch, $ as $api, au as clearNuxtData, aD as $platformApi } from './server.mjs';

function partnerStatusBadgeColor(value) {
  switch (value) {
    case "pending":
      return "warning";
    case "active":
      return "success";
    case "terminated":
      return "error";
    default:
      return "neutral";
  }
}
function buildListQuery(p) {
  const query = new URLSearchParams();
  if (p.search) query.set("search", p.search);
  if (p.status) query.set("status", p.status);
  if (p.category) query.set("category", p.category);
  if (p.provisioned !== void 0 && p.provisioned !== null) {
    query.set("provisioned", p.provisioned ? "1" : "0");
  }
  if (p.owner_source) query.set("owner_source", p.owner_source);
  if (p.include) query.set("include", p.include);
  if (p.sort_by) query.set("sort_by", p.sort_by);
  if (p.sort_direction) query.set("sort_direction", p.sort_direction);
  if (p.per_page) query.set("per_page", String(p.per_page));
  if (p.page) query.set("page", String(p.page));
  return query.toString();
}
function usePlatformPartnerList(params) {
  const url = vueExports.computed(() => {
    const qs = buildListQuery(vueExports.toValue(params));
    return `/platform/partners${qs ? `?${qs}` : ""}`;
  });
  return usePlatformApiFetch(url);
}
function usePlatformPartnerDetail(id) {
  const url = vueExports.computed(() => `/platform/partners/${vueExports.toValue(id)}`);
  return usePlatformApiFetch(url);
}
function apiCreatePartner(data) {
  return $platformApi("/platform/partners", {
    method: "POST",
    body: data
  });
}
function apiUpdatePartner(id, data) {
  return $platformApi(`/platform/partners/${id}`, {
    method: "PUT",
    body: data
  });
}
function apiDeletePartner(id) {
  return $platformApi(`/platform/partners/${id}`, {
    method: "DELETE"
  });
}
function apiProvisionPartner(id) {
  return $platformApi(`/platform/partners/${id}/provision`, {
    method: "POST"
  });
}
function usePlatformPartnerStats() {
  return usePlatformApiFetch(
    "/platform/partners/stats"
  );
}
function apiApprovePartner(id) {
  return $platformApi(`/platform/partners/${id}/approve`, {
    method: "POST"
  });
}
function apiDeactivatePartner(id) {
  return $platformApi(`/platform/partners/${id}/deactivate`, {
    method: "POST"
  });
}
function apiReactivatePartner(id) {
  return $platformApi(`/platform/partners/${id}/reactivate`, {
    method: "POST"
  });
}
function usePlatformPartnerRevenueTrend(partnerId, months = () => 6) {
  const url = vueExports.computed(
    () => `/platform/partners/${vueExports.toValue(partnerId)}/revenue-trend?months=${vueExports.toValue(months)}`
  );
  return usePlatformApiFetch(url, {
    watch: [() => vueExports.toValue(partnerId), () => vueExports.toValue(months)]
  });
}
function buildSimpleQuery(p) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(p)) {
    if (v === void 0 || v === null || v === "") continue;
    q.set(k, String(v));
  }
  return q.toString();
}
function usePlatformPartnerOffers(partnerId, params = () => ({})) {
  const url = vueExports.computed(() => {
    const qs = buildSimpleQuery(vueExports.toValue(params));
    return `/platform/partners/${vueExports.toValue(partnerId)}/offers${qs ? `?${qs}` : ""}`;
  });
  return usePlatformApiFetch(url, {
    watch: [() => vueExports.toValue(partnerId), () => vueExports.toValue(params)]
  });
}
function usePlatformPartnerRatings(partnerId, params = () => ({})) {
  const url = vueExports.computed(() => {
    const qs = buildSimpleQuery(vueExports.toValue(params));
    return `/platform/partners/${vueExports.toValue(partnerId)}/ratings${qs ? `?${qs}` : ""}`;
  });
  return usePlatformApiFetch(url, {
    watch: [() => vueExports.toValue(partnerId), () => vueExports.toValue(params)]
  });
}
function useTenantPartnerList(params) {
  const url = vueExports.computed(() => {
    const qs = buildListQuery(vueExports.toValue(params));
    return `/pmc/partners${qs ? `?${qs}` : ""}`;
  });
  return useApiFetch(url);
}
const TENANT_PARTNER_DETAIL_KEY = (id) => `tenant-partner-${id}`;
function useTenantPartnerDetail(id) {
  return useApiFetch(
    vueExports.computed(() => `/pmc/partners/${vueExports.toValue(id)}`),
    {
      key: vueExports.computed(() => TENANT_PARTNER_DETAIL_KEY(vueExports.toValue(id))),
      watch: [() => vueExports.toValue(id)]
    }
  );
}
function clearTenantPartnerCache(id) {
  clearNuxtData(TENANT_PARTNER_DETAIL_KEY(id));
}
function apiCreateTenantPartner(data) {
  return $api("/pmc/partners", {
    method: "POST",
    body: data
  });
}
function apiUpdateTenantPartner(id, data) {
  return $api(`/pmc/partners/${id}`, {
    method: "PUT",
    body: data
  });
}
function apiDeleteTenantPartner(id) {
  return $api(`/pmc/partners/${id}`, {
    method: "DELETE"
  });
}
function apiProvisionTenantPartner(id) {
  return $api(`/pmc/partners/${id}/provision`, {
    method: "POST"
  });
}
function useTenantPartnerCatalog(params) {
  const url = vueExports.computed(() => {
    const qs = buildListQuery(vueExports.toValue(params));
    return `/pmc/partners/catalog${qs ? `?${qs}` : ""}`;
  });
  return useApiFetch(url);
}
function apiAttachTenantPartner(id, projectIds) {
  return $api(`/pmc/partners/${id}/attach`, {
    method: "POST",
    body: { project_ids: projectIds }
  });
}
function apiDetachTenantPartner(id, projectIds) {
  return $api(`/pmc/partners/${id}/detach`, {
    method: "POST",
    body: { project_ids: projectIds }
  });
}

export { apiProvisionTenantPartner as a, apiDeleteTenantPartner as b, apiCreateTenantPartner as c, useTenantPartnerCatalog as d, apiAttachTenantPartner as e, useTenantPartnerDetail as f, apiUpdateTenantPartner as g, clearTenantPartnerCache as h, apiDetachTenantPartner as i, usePlatformPartnerList as j, usePlatformPartnerDetail as k, apiProvisionPartner as l, apiUpdatePartner as m, usePlatformPartnerRevenueTrend as n, usePlatformPartnerOffers as o, partnerStatusBadgeColor as p, usePlatformPartnerRatings as q, apiApprovePartner as r, apiDeactivatePartner as s, apiReactivatePartner as t, useTenantPartnerList as u, usePlatformPartnerStats as v, apiCreatePartner as w, apiDeletePartner as x };
//# sourceMappingURL=usePartners-DhKs6EM6.mjs.map
