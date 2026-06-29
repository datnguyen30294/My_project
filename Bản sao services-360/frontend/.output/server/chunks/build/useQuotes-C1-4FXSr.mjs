import { o as useApiFetch, v as vueExports, $ as $api, au as clearNuxtData } from './server.mjs';

function quoteStatusColor(value) {
  switch (value) {
    case "draft":
      return "neutral";
    case "sent":
      return "primary";
    case "manager_approved":
      return "warning";
    case "approved":
      return "success";
    case "manager_rejected":
    case "resident_rejected":
    case "cancelled":
      return "error";
    default:
      return "neutral";
  }
}
function isQuoteRejected(value) {
  return value === "manager_rejected" || value === "resident_rejected";
}
const QUOTE_STATUS_OPTIONS = [
  { label: "Nháp", value: "draft" },
  { label: "Đã gửi", value: "sent" },
  { label: "QL đã duyệt", value: "manager_approved" },
  { label: "Đã chấp thuận", value: "approved" },
  { label: "QL từ chối", value: "manager_rejected" },
  { label: "Cư dân từ chối", value: "resident_rejected" },
  { label: "Đã huỷ", value: "cancelled" }
];
const QUOTE_ACTIVE_OPTIONS = [
  { label: "Còn hiệu lực", value: "true" },
  { label: "Đã thay thế", value: "false" }
];
const QUOTE_LINE_TYPE_OPTIONS = [
  { label: "Vật tư", value: "material" },
  { label: "Dịch vụ", value: "service" },
  { label: "Dịch vụ tùy chọn", value: "adhoc" }
];
const QUOTE_LINE_TYPE_LABELS = Object.fromEntries(
  QUOTE_LINE_TYPE_OPTIONS.map((o) => [o.value, o.label])
);
const QUOTE_CREATE_STATUS_OPTIONS = [
  { label: "Nháp", value: "draft" },
  { label: "Gửi luôn (Chờ QL duyệt)", value: "sent" }
];
const QUOTE_WORKFLOW_STEPS = [
  { value: "draft", title: "Nháp", description: "Đang soạn báo giá", icon: "i-lucide-file-edit" },
  { value: "sent", title: "Đã gửi", description: "Chờ quản lý duyệt", icon: "i-lucide-send" },
  { value: "manager_approved", title: "QL duyệt", description: "Chờ cư dân chấp thuận", icon: "i-lucide-user-check" },
  { value: "approved", title: "Chấp thuận", description: "Cư dân đã đồng ý", icon: "i-lucide-check-circle" }
];
function useQuoteList(params) {
  return useApiFetch(
    "/pmc/quotes",
    { query: params, watch: [params] }
  );
}
const QUOTE_DETAIL_KEY = (id) => `quote-detail-${id}`;
const QUOTE_AUDITS_KEY = (id) => `quote-audits-${id}`;
function useQuoteDetail(id) {
  return useApiFetch(
    vueExports.computed(() => `/pmc/quotes/${vueExports.toValue(id)}`),
    { key: vueExports.computed(() => QUOTE_DETAIL_KEY(vueExports.toValue(id))), watch: [() => vueExports.toValue(id)] }
  );
}
function clearQuoteCache(id) {
  clearNuxtData(QUOTE_DETAIL_KEY(id));
  clearNuxtData(QUOTE_AUDITS_KEY(id));
}
function useQuoteVersions(ogTicketId) {
  const url = vueExports.computed(() => {
    const id = vueExports.toValue(ogTicketId);
    return id ? `/pmc/quotes/versions/${id}` : "";
  });
  return useApiFetch(
    url,
    { watch: [url] }
  );
}
function useQuoteCheckActive(ogTicketId) {
  return useApiFetch(
    "/pmc/quotes/check-active",
    {
      query: vueExports.computed(() => {
        const id = vueExports.toValue(ogTicketId);
        return id ? { og_ticket_id: id } : {};
      }),
      watch: [() => vueExports.toValue(ogTicketId)],
      immediate: false
    }
  );
}
function useQuoteAudits(id) {
  return useApiFetch(
    vueExports.computed(() => `/pmc/quotes/${vueExports.toValue(id)}/audits`),
    { key: vueExports.computed(() => QUOTE_AUDITS_KEY(vueExports.toValue(id))), watch: [() => vueExports.toValue(id)] }
  );
}
function apiGetQuoteVersions(ogTicketId) {
  return $api(`/pmc/quotes/versions/${ogTicketId}`);
}
function apiCreateQuote(data) {
  return $api("/pmc/quotes", {
    method: "POST",
    body: data
  });
}
function apiUpdateQuote(id, data) {
  return $api(`/pmc/quotes/${id}`, {
    method: "PUT",
    body: data
  });
}
function apiCheckDeleteQuote(id) {
  return $api(`/pmc/quotes/${id}/check-delete`);
}
function apiDeleteQuote(id) {
  return $api(`/pmc/quotes/${id}`, {
    method: "DELETE"
  });
}
function apiTransitionQuote(id, data) {
  return $api(`/pmc/quotes/${id}/transition`, {
    method: "POST",
    body: data
  });
}

export { QUOTE_STATUS_OPTIONS as Q, QUOTE_ACTIVE_OPTIONS as a, apiDeleteQuote as b, apiCheckDeleteQuote as c, useQuoteCheckActive as d, QUOTE_LINE_TYPE_LABELS as e, QUOTE_CREATE_STATUS_OPTIONS as f, apiCreateQuote as g, QUOTE_LINE_TYPE_OPTIONS as h, useQuoteVersions as i, apiGetQuoteVersions as j, isQuoteRejected as k, useQuoteDetail as l, apiUpdateQuote as m, clearQuoteCache as n, apiTransitionQuote as o, useQuoteAudits as p, quoteStatusColor as q, QUOTE_WORKFLOW_STEPS as r, useQuoteList as u };
//# sourceMappingURL=useQuotes-C1-4FXSr.mjs.map
