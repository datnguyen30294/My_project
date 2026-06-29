import { C as CreatePlatformProjectRequestStatus } from './laravel-BKHe1mna.mjs';
import { v as vueExports, ay as usePlatformApiFetch, aD as $platformApi } from './server.mjs';

const PROJECT_STATUS_OPTIONS = [
  { value: CreatePlatformProjectRequestStatus.managing, label: "Đang quản lý" },
  { value: CreatePlatformProjectRequestStatus.stopped, label: "Đã dừng" }
];
function useListPlatformProjects(params) {
  const url = vueExports.computed(() => {
    const p = vueExports.toValue(params);
    const query = new URLSearchParams();
    if (p.search) query.set("search", p.search);
    if (p.status) query.set("status", p.status);
    if (p.organization_id) query.set("organization_id", p.organization_id);
    if (p.platform_service_enabled !== void 0 && p.platform_service_enabled !== null) {
      query.set("platform_service_enabled", p.platform_service_enabled ? "1" : "0");
    }
    if (p.sort_by) query.set("sort_by", p.sort_by);
    if (p.sort_direction) query.set("sort_direction", p.sort_direction);
    if (p.page) query.set("page", String(p.page));
    if (p.per_page) query.set("per_page", String(p.per_page));
    const qs = query.toString();
    return `/platform/projects${qs ? `?${qs}` : ""}`;
  });
  return usePlatformApiFetch(url);
}
function usePlatformProjectDetail(tenantId, projectId) {
  const url = vueExports.computed(() => `/platform/tenants/${vueExports.toValue(tenantId)}/projects/${vueExports.toValue(projectId)}`);
  return usePlatformApiFetch(url);
}
function useProjectBusinessSummary(tenantId, projectId, months = 6) {
  const url = vueExports.computed(
    () => `/platform/tenants/${vueExports.toValue(tenantId)}/projects/${vueExports.toValue(projectId)}/business-summary?months=${months}`
  );
  return usePlatformApiFetch(url);
}
function useProjectOrders(tenantId, projectId, params) {
  const url = vueExports.computed(() => {
    const p = vueExports.toValue(params);
    const query = new URLSearchParams();
    if (p.search) query.set("search", p.search);
    if (p.status) query.set("status", p.status);
    if (p.page) query.set("page", String(p.page));
    if (p.per_page) query.set("per_page", String(p.per_page));
    const qs = query.toString();
    return `/platform/tenants/${vueExports.toValue(tenantId)}/projects/${vueExports.toValue(projectId)}/orders${qs ? `?${qs}` : ""}`;
  });
  return usePlatformApiFetch(url);
}
function useProjectResidentRatings(tenantId, projectId, params) {
  const url = vueExports.computed(() => {
    const p = vueExports.toValue(params);
    const query = new URLSearchParams();
    if (p.rating) query.set("rating", String(p.rating));
    if (p.page) query.set("page", String(p.page));
    if (p.per_page) query.set("per_page", String(p.per_page));
    const qs = query.toString();
    return `/platform/tenants/${vueExports.toValue(tenantId)}/projects/${vueExports.toValue(projectId)}/resident-ratings${qs ? `?${qs}` : ""}`;
  });
  return usePlatformApiFetch(url);
}
function useProjectFeeConfig(tenantId, projectId) {
  const url = vueExports.computed(() => `/platform/tenants/${vueExports.toValue(tenantId)}/projects/${vueExports.toValue(projectId)}/fee-config`);
  return usePlatformApiFetch(url);
}
function useProjectVendors(tenantId, projectId) {
  const url = vueExports.computed(() => `/platform/tenants/${vueExports.toValue(tenantId)}/projects/${vueExports.toValue(projectId)}/vendors`);
  return usePlatformApiFetch(url);
}
function apiCreatePlatformProject(tenantId, data) {
  return $platformApi(`/platform/tenants/${tenantId}/projects`, {
    method: "POST",
    body: data
  });
}
function apiUpdateProjectFeeConfig(tenantId, projectId, data) {
  return $platformApi(
    `/platform/tenants/${tenantId}/projects/${projectId}/fee-config`,
    { method: "PUT", body: data }
  );
}
async function apiToggleProjectService(tenantId, projectId, enabled) {
  const current = await $platformApi(
    `/platform/tenants/${tenantId}/projects/${projectId}/fee-config`
  );
  const config = current.data;
  return apiUpdateProjectFeeConfig(tenantId, projectId, {
    inherit_default: config.inherit_default,
    fee_mode: config.override.fee_mode?.value,
    fixed_fee_per_order: Number(config.override.fixed_fee_per_order),
    percent_fee_per_order: Number(config.override.percent_fee_per_order),
    subscription_amount: Number(config.override.subscription_amount),
    subscription_cycle: config.override.subscription_cycle?.value,
    platform_service_enabled: enabled,
    notes: config.notes
  });
}
function apiToggleProjectVendor(tenantId, projectId, partnerId, enabled) {
  return $platformApi(
    `/platform/tenants/${tenantId}/projects/${projectId}/vendors/${partnerId}/toggle`,
    { method: "PUT", body: { enabled } }
  );
}

export { PROJECT_STATUS_OPTIONS as P, useProjectResidentRatings as a, usePlatformProjectDetail as b, useProjectOrders as c, useProjectVendors as d, useProjectFeeConfig as e, apiToggleProjectVendor as f, apiUpdateProjectFeeConfig as g, useListPlatformProjects as h, apiCreatePlatformProject as i, apiToggleProjectService as j, useProjectBusinessSummary as u };
//# sourceMappingURL=usePlatformProjects-D8VBGqRs.mjs.map
