import { v as vueExports, ay as usePlatformApiFetch, aw as useFetch, ax as getApiBaseUrl } from './server.mjs';

function getPublicFetch() {
  return (url, opts) => $fetch(url, { baseURL: getApiBaseUrl(), ...opts });
}
function usePlatformTicketList(params) {
  return usePlatformApiFetch("/platform/tickets", {
    query: vueExports.computed(() => vueExports.toValue(params))
  });
}
function usePlatformTicketDetail(id) {
  const url = vueExports.computed(() => `/platform/tickets/${vueExports.toValue(id)}`);
  return usePlatformApiFetch(url);
}
function usePublicTicketInfo(code) {
  const url = vueExports.computed(() => `/tickets/${vueExports.toValue(code)}/rating`);
  return useFetch(
    url,
    {
      baseURL: getApiBaseUrl()
    },
    "$Lg9VDN2Ykx"
    /* nuxt-injected */
  );
}
async function apiSubmitQuoteDecision(code, data) {
  const publicFetch = getPublicFetch();
  return publicFetch(`/tickets/${code}/quote-decision`, {
    method: "POST",
    body: data
  });
}
async function apiSubmitWarrantyRequest(code, data) {
  const publicFetch = getPublicFetch();
  const formData = new FormData();
  formData.append("subject", data.subject);
  formData.append("description", data.description);
  if (data.attachments) {
    data.attachments.forEach((file) => {
      formData.append("attachments[]", file);
    });
  }
  return publicFetch(`/tickets/${code}/warranty`, {
    method: "POST",
    body: formData
  });
}

export { apiSubmitQuoteDecision as a, apiSubmitWarrantyRequest as b, usePlatformTicketDetail as c, usePlatformTicketList as d, usePublicTicketInfo as u };
//# sourceMappingURL=useTickets-ChvwqcYd.mjs.map
