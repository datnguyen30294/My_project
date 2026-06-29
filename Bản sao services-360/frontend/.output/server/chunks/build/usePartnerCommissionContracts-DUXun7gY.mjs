import { v as vueExports, o as useApiFetch, ay as usePlatformApiFetch, aD as $platformApi, $ as $api } from './server.mjs';

const COMMISSION_MODE_OPTIONS = [
  { value: "per_order", label: "Chiết khấu mỗi đơn" },
  { value: "revenue_share", label: "Chia doanh thu" },
  { value: "subscription", label: "Thuê bao" }
];
const REVENUE_RECIPIENT_OPTIONS = [
  { value: "platform", label: "Platform TNP" },
  { value: "operating_company", label: "Công ty vận hành" }
];
const CONTRACT_STATUS_OPTIONS = [
  { value: "draft", label: "Nháp" },
  { value: "pending", label: "Chờ kích hoạt" },
  { value: "active", label: "Đang hiệu lực" },
  { value: "replaced", label: "Đã bị thay thế" },
  { value: "cancelled", label: "Đã huỷ" },
  { value: "expired", label: "Đã hết hạn" },
  { value: "revoked", label: "Đã thu hồi" }
];
const BILLING_PERIOD_OPTIONS = [
  { value: "monthly", label: "Hàng tháng" },
  { value: "quarterly", label: "Hàng quý" }
];
const SUBSCRIPTION_CYCLE_OPTIONS = [
  { value: "monthly", label: "Hàng tháng" },
  { value: "quarterly", label: "Hàng quý" },
  { value: "yearly", label: "Hàng năm" }
];
function statusBadgeColor(value) {
  switch (value) {
    case "draft":
      return "neutral";
    case "pending":
      return "warning";
    case "active":
      return "success";
    case "replaced":
    case "expired":
      return "neutral";
    case "cancelled":
    case "revoked":
      return "error";
    default:
      return "neutral";
  }
}
const PROJECT_HEALTH_META = {
  active: { label: "Đang hiệu lực", color: "success", icon: "i-lucide-circle-check", tone: "text-emerald-600" },
  pending: { label: "Chờ kích hoạt", color: "warning", icon: "i-lucide-clock", tone: "text-amber-600" },
  draft: { label: "Bản nháp", color: "neutral", icon: "i-lucide-file-pen-line", tone: "text-slate-500" },
  none: { label: "Chưa có hợp đồng", color: "error", icon: "i-lucide-circle-alert", tone: "text-red-600" }
};
const HEALTH_SORT_PRIORITY = {
  none: 0,
  pending: 1,
  draft: 2,
  active: 3
};
const TERMINAL_STATUSES = ["replaced", "cancelled", "expired", "revoked"];
function summarizeProjectContracts(contracts, projects, servedProjectIds) {
  const nameById = /* @__PURE__ */ new Map();
  for (const p of projects) {
    nameById.set(p.id, p.name);
  }
  const byProject = /* @__PURE__ */ new Map();
  for (const c of contracts) {
    const bucket = byProject.get(c.project_id) ?? [];
    bucket.push(c);
    byProject.set(c.project_id, bucket);
  }
  const projectIds = new Set(servedProjectIds);
  for (const c of contracts) {
    projectIds.add(c.project_id);
  }
  const summaries = [];
  for (const id of projectIds) {
    const list = byProject.get(id) ?? [];
    const active = list.find((c) => c.status.value === "active") ?? null;
    const pendingCount = list.filter((c) => c.status.value === "pending").length;
    const draftCount = list.filter((c) => c.status.value === "draft").length;
    const historyCount = list.filter((c) => TERMINAL_STATUSES.includes(c.status.value)).length;
    const health = active ? "active" : pendingCount > 0 ? "pending" : draftCount > 0 ? "draft" : "none";
    summaries.push({
      projectId: id,
      projectName: nameById.get(id) ?? list[0]?.project_name ?? `Dự án #${id}`,
      health,
      activeMode: active?.commission_mode ?? null,
      pendingCount,
      draftCount,
      historyCount
    });
  }
  return summaries.sort((a, b) => {
    const diff = HEALTH_SORT_PRIORITY[a.health] - HEALTH_SORT_PRIORITY[b.health];
    return diff !== 0 ? diff : a.projectName.localeCompare(b.projectName, "vi");
  });
}
function buildListQuery(p) {
  const query = new URLSearchParams();
  if (p.partner_id) query.set("partner_id", String(p.partner_id));
  if (p.tenant_id) query.set("tenant_id", p.tenant_id);
  if (p.project_id) query.set("project_id", String(p.project_id));
  if (p.status) query.set("status", p.status);
  if (p.commission_mode) query.set("commission_mode", p.commission_mode);
  if (p.search) query.set("search", p.search);
  if (p.sort_by) query.set("sort_by", p.sort_by);
  if (p.sort_direction) query.set("sort_direction", p.sort_direction);
  if (p.per_page) query.set("per_page", String(p.per_page));
  if (p.page) query.set("page", String(p.page));
  return query.toString();
}
function usePlatformContractList(params) {
  const url = vueExports.computed(() => {
    const qs = buildListQuery(vueExports.toValue(params));
    return `/platform/partner-commission-contracts${qs ? `?${qs}` : ""}`;
  });
  return usePlatformApiFetch(url);
}
function platformContractLocation(partnerId, contractId) {
  return {
    path: `/platform/partners/${partnerId}`,
    query: { tab: "contracts", contract: String(contractId) }
  };
}
function usePlatformContractDetail(id) {
  const url = vueExports.computed(() => {
    const v = vueExports.toValue(id);
    return v ? `/platform/partner-commission-contracts/${v}` : "";
  });
  return usePlatformApiFetch(url, {
    immediate: false,
    watch: [() => vueExports.toValue(id)]
  });
}
function apiCreatePlatformContract(data) {
  return $platformApi(
    "/platform/partner-commission-contracts",
    { method: "POST", body: data }
  );
}
function apiBulkApplyPlatformCommission(partnerId, data) {
  return $platformApi(
    `/platform/partners/${partnerId}/commission-contracts/bulk`,
    { method: "POST", body: data }
  );
}
function apiUpdatePlatformContractDraft(id, data) {
  return $platformApi(
    `/platform/partner-commission-contracts/${id}`,
    { method: "PUT", body: data }
  );
}
function apiUpdatePlatformContractNotes(id, data) {
  return $platformApi(
    `/platform/partner-commission-contracts/${id}/notes`,
    { method: "PATCH", body: data }
  );
}
function apiDeletePlatformContractDraft(id) {
  return $platformApi(
    `/platform/partner-commission-contracts/${id}`,
    { method: "DELETE" }
  );
}
function apiSignPlatformContract(id) {
  return $platformApi(
    `/platform/partner-commission-contracts/${id}/sign`,
    { method: "POST" }
  );
}
function apiRevokePlatformContract(id, cancellationReason) {
  return $platformApi(
    `/platform/partner-commission-contracts/${id}/revoke`,
    { method: "POST", body: { cancellation_reason: cancellationReason } }
  );
}
function apiCancelPlatformContract(id, cancellationReason) {
  return $platformApi(
    `/platform/partner-commission-contracts/${id}/cancel`,
    { method: "POST", body: { cancellation_reason: cancellationReason } }
  );
}
const TENANT_BASE = "/pmc/partner-commission-contracts";
function tenantContractLocation(vendorId, projectId, contractId) {
  return {
    path: `/pmc/vendors/${vendorId}`,
    query: { tab: "contracts", project: String(projectId), contract: String(contractId) }
  };
}
function useTenantContractList(params = () => ({})) {
  const url = vueExports.computed(() => {
    const qs = buildListQuery(vueExports.toValue(params));
    return `${TENANT_BASE}${qs ? `?${qs}` : ""}`;
  });
  return useApiFetch(url);
}
function useTenantContractDetail(id) {
  const url = vueExports.computed(() => {
    const v = vueExports.toValue(id);
    return v ? `${TENANT_BASE}/${v}` : "";
  });
  return useApiFetch(url, {
    immediate: false,
    watch: [() => vueExports.toValue(id)]
  });
}
function apiCreateTenantContract(data) {
  return $api(
    TENANT_BASE,
    { method: "POST", body: data }
  );
}
function apiUpdateTenantContractDraft(id, data) {
  return $api(
    `${TENANT_BASE}/${id}`,
    { method: "PUT", body: data }
  );
}
function apiUpdateTenantContractNotes(id, data) {
  return $api(
    `${TENANT_BASE}/${id}/notes`,
    { method: "PATCH", body: data }
  );
}
function apiDeleteTenantContractDraft(id) {
  return $api(
    `${TENANT_BASE}/${id}`,
    { method: "DELETE" }
  );
}
function apiSignTenantContract(id) {
  return $api(
    `${TENANT_BASE}/${id}/sign`,
    { method: "POST" }
  );
}
function apiRevokeTenantContract(id, cancellationReason) {
  return $api(
    `${TENANT_BASE}/${id}/revoke`,
    { method: "POST", body: { cancellation_reason: cancellationReason } }
  );
}
function apiSwitchTenantContract(id) {
  return $api(
    `${TENANT_BASE}/${id}/switch`,
    { method: "POST" }
  );
}
function apiCancelTenantContract(id, cancellationReason) {
  return $api(
    `${TENANT_BASE}/${id}/cancel`,
    { method: "POST", body: { cancellation_reason: cancellationReason } }
  );
}
function defaultPerOrderTerms() {
  return {
    percent: 10,
    fixed: null
  };
}
function defaultRevenueShareTerms() {
  return {
    billing_period: "monthly",
    tiers: [
      { min_gmv: 0, max_gmv: null, percent: 10 }
    ]
  };
}
function defaultSubscriptionTerms() {
  return {
    amount: 5e5,
    cycle: "monthly"
  };
}
function defaultTermsFor(mode) {
  switch (mode) {
    case "per_order":
      return defaultPerOrderTerms();
    case "revenue_share":
      return defaultRevenueShareTerms();
    case "subscription":
      return defaultSubscriptionTerms();
  }
}

export { apiBulkApplyPlatformCommission as A, BILLING_PERIOD_OPTIONS as B, COMMISSION_MODE_OPTIONS as C, PROJECT_HEALTH_META as P, REVENUE_RECIPIENT_OPTIONS as R, SUBSCRIPTION_CYCLE_OPTIONS as S, statusBadgeColor as a, usePlatformContractDetail as b, useTenantContractDetail as c, apiSignPlatformContract as d, apiSignTenantContract as e, apiSwitchTenantContract as f, apiRevokePlatformContract as g, apiRevokeTenantContract as h, apiCancelPlatformContract as i, apiCancelTenantContract as j, apiDeletePlatformContractDraft as k, apiDeleteTenantContractDraft as l, apiUpdatePlatformContractNotes as m, apiUpdateTenantContractNotes as n, defaultPerOrderTerms as o, apiUpdatePlatformContractDraft as p, apiUpdateTenantContractDraft as q, apiCreatePlatformContract as r, summarizeProjectContracts as s, tenantContractLocation as t, useTenantContractList as u, apiCreateTenantContract as v, defaultTermsFor as w, platformContractLocation as x, usePlatformContractList as y, CONTRACT_STATUS_OPTIONS as z };
//# sourceMappingURL=usePartnerCommissionContracts-DUXun7gY.mjs.map
