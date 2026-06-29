import { S as ServicePlan, U as UpdateTenantConfigRequestEnabledModulesItem, T as TenantFeeMode, a as SubscriptionCycle } from './laravel-BKHe1mna.mjs';
import { ay as usePlatformApiFetch, v as vueExports, aD as $platformApi } from './server.mjs';

const SERVICE_PLAN_OPTIONS = [
  { value: ServicePlan.starter, label: "Starter" },
  { value: ServicePlan.business, label: "Business" },
  { value: ServicePlan.enterprise, label: "Enterprise" }
];
const TENANT_FEE_MODE_OPTIONS = [
  { value: TenantFeeMode.none, label: "Không thu", description: "Tenant không bị tính phí nền tảng theo đơn hàng." },
  { value: TenantFeeMode.subscription, label: "Thu theo gói tháng/năm", description: "Thu phí cố định theo chu kỳ gói, không tính thêm trên từng đơn." },
  { value: TenantFeeMode.fixed_per_order, label: "Thu tiền mặt theo đơn hàng", description: "Mỗi đơn hàng thu một khoản cố định (đ/đơn)." },
  { value: TenantFeeMode.percent_per_order, label: "Thu theo % đơn hàng", description: "Mỗi đơn hàng thu theo phần trăm giá trị đơn." },
  { value: TenantFeeMode.both, label: "Thu theo cả 2", description: "Vừa thu cố định/đơn vừa thu % trên giá trị đơn hàng." }
];
const TENANT_SUBSCRIPTION_CYCLE_OPTIONS = [
  { value: SubscriptionCycle.monthly, label: "Theo tháng" },
  { value: SubscriptionCycle.yearly, label: "Theo năm" }
];
const TENANT_MODULE_OPTIONS = [
  { value: UpdateTenantConfigRequestEnabledModulesItem.hrm, label: "HRM", description: "Quản lý tài khoản, phòng ban, chức danh, dự án", icon: "i-lucide-users" },
  { value: UpdateTenantConfigRequestEnabledModulesItem["quan-ly-ticket"], label: "Quản lý ticket", description: "Tiếp nhận và xử lý yêu cầu của cư dân", icon: "i-lucide-ticket" },
  { value: UpdateTenantConfigRequestEnabledModulesItem["quan-ly-cong-viec"], label: "Quản lý công việc", description: "Phân ca, lịch làm việc, điều phối nhân sự", icon: "i-lucide-calendar-check" },
  { value: UpdateTenantConfigRequestEnabledModulesItem["quan-ly-don-hang"], label: "Quản lý đơn hàng", description: "Báo giá, đơn hàng dịch vụ, nghiệm thu", icon: "i-lucide-shopping-cart" },
  { value: UpdateTenantConfigRequestEnabledModulesItem["kho-va-dich-vu"], label: "Kho và dịch vụ", description: "Danh mục vật tư, nhà cung cấp, dịch vụ", icon: "i-lucide-package" },
  { value: UpdateTenantConfigRequestEnabledModulesItem["ke-toan-tai-chinh"], label: "Kế toán tài chính", description: "Công nợ, thu chi, đối soát, kỳ khoá sổ", icon: "i-lucide-wallet" },
  { value: UpdateTenantConfigRequestEnabledModulesItem["bao-cao"], label: "Báo cáo", description: "Báo cáo vận hành, doanh thu, SLA, CSAT", icon: "i-lucide-bar-chart-3" },
  { value: UpdateTenantConfigRequestEnabledModulesItem["cai-dat"], label: "Cài đặt", description: "Cấu hình hệ thống, hoa hồng, chính sách", icon: "i-lucide-settings" }
];
function usePlatformTenantList(params) {
  const url = vueExports.computed(() => {
    const p = vueExports.toValue(params);
    const query = new URLSearchParams();
    if (p.search) query.set("search", p.search);
    if (p.is_active !== void 0 && p.is_active !== null) query.set("is_active", p.is_active ? "1" : "0");
    if (p.service_plan) query.set("service_plan", p.service_plan);
    if (p.sort_by) query.set("sort_by", p.sort_by);
    if (p.sort_direction) query.set("sort_direction", p.sort_direction);
    if (p.page) query.set("page", String(p.page));
    if (p.per_page) query.set("per_page", String(p.per_page));
    const qs = query.toString();
    return `/platform/tenants${qs ? `?${qs}` : ""}`;
  });
  return usePlatformApiFetch(url);
}
function usePlatformTenantStats() {
  return usePlatformApiFetch("/platform/tenants/stats");
}
function usePlatformTenantDetail(id) {
  const url = vueExports.computed(() => `/platform/tenants/${vueExports.toValue(id)}`);
  return usePlatformApiFetch(url);
}
function useTenantProjects(tenantId, params) {
  const url = vueExports.computed(() => {
    const id = vueExports.toValue(tenantId);
    const p = vueExports.toValue(params);
    const query = new URLSearchParams();
    if (p.search) query.set("search", p.search);
    if (p.status) query.set("status", p.status);
    if (p.sort_by) query.set("sort_by", p.sort_by);
    if (p.sort_direction) query.set("sort_direction", p.sort_direction);
    if (p.page) query.set("page", String(p.page));
    if (p.per_page) query.set("per_page", String(p.per_page));
    const qs = query.toString();
    return `/platform/tenants/${id}/projects${qs ? `?${qs}` : ""}`;
  });
  return usePlatformApiFetch(url);
}
function useTenantResidentRatings(tenantId, params) {
  const url = vueExports.computed(() => {
    const id = vueExports.toValue(tenantId);
    const p = vueExports.toValue(params);
    const query = new URLSearchParams();
    if (p.rating) query.set("rating", String(p.rating));
    if (p.page) query.set("page", String(p.page));
    if (p.per_page) query.set("per_page", String(p.per_page));
    const qs = query.toString();
    return `/platform/tenants/${id}/resident-ratings${qs ? `?${qs}` : ""}`;
  });
  return usePlatformApiFetch(url);
}
function useTenantBusinessSummary(tenantId, months = 6) {
  const url = vueExports.computed(() => `/platform/tenants/${vueExports.toValue(tenantId)}/business-summary?months=${months}`);
  return usePlatformApiFetch(url);
}
function apiGetTenant(id) {
  return $platformApi(`/platform/tenants/${id}`);
}
function apiCreateTenant(data) {
  return $platformApi("/platform/tenants", {
    method: "POST",
    body: data
  });
}
function apiUpdateTenant(id, data) {
  return $platformApi(`/platform/tenants/${id}`, {
    method: "PUT",
    body: data
  });
}
function apiToggleTenantVendorFeature(id, isVendorEnabled) {
  return $platformApi(`/platform/tenants/${id}/vendor-feature`, {
    method: "PUT",
    body: { is_vendor_enabled: isVendorEnabled }
  });
}
function apiToggleTenantActive(id, isActive) {
  return $platformApi(`/platform/tenants/${id}/toggle-active`, {
    method: "PUT",
    body: { is_active: isActive }
  });
}
function apiUpdateTenantConfig(id, data) {
  return $platformApi(`/platform/tenants/${id}/config`, {
    method: "PUT",
    body: data
  });
}

export { SERVICE_PLAN_OPTIONS as S, TENANT_MODULE_OPTIONS as T, usePlatformTenantList as a, apiCreateTenant as b, apiUpdateTenant as c, apiToggleTenantVendorFeature as d, apiGetTenant as e, apiToggleTenantActive as f, usePlatformTenantDetail as g, TENANT_FEE_MODE_OPTIONS as h, TENANT_SUBSCRIPTION_CYCLE_OPTIONS as i, apiUpdateTenantConfig as j, useTenantProjects as k, useTenantBusinessSummary as l, useTenantResidentRatings as m, usePlatformTenantStats as u };
//# sourceMappingURL=useTenants-BTW8z9Mm.mjs.map
