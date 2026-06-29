import { o as useApiFetch, v as vueExports, $ as $api } from './server.mjs';

function useAccountList(params) {
  return useApiFetch("/pmc/accounts", {
    query: params,
    watch: [params]
  });
}
function useAccountDetail(id) {
  return useApiFetch(
    vueExports.computed(() => `/pmc/accounts/${vueExports.toValue(id)}`)
  );
}
function apiCreateAccount(data) {
  return $api("/pmc/accounts", { method: "POST", body: data });
}
function apiUpdateAccount(id, data) {
  return $api(`/pmc/accounts/${id}`, { method: "PUT", body: data });
}
function apiDeleteAccount(id) {
  return $api(`/pmc/accounts/${id}`, { method: "DELETE" });
}
function apiChangeAccountPassword(id, data) {
  return $api(`/pmc/accounts/${id}/password`, { method: "PUT", body: data });
}
function apiUploadAccountAvatar(id, file) {
  const formData = new FormData();
  formData.append("avatar", file);
  return $api(`/pmc/accounts/${id}/avatar`, { method: "POST", body: formData });
}
function apiDeleteAccountAvatar(id) {
  return $api(`/pmc/accounts/${id}/avatar`, { method: "DELETE" });
}

export { apiUpdateAccount as a, apiChangeAccountPassword as b, apiDeleteAccount as c, useAccountList as d, apiCreateAccount as e, apiDeleteAccountAvatar as f, apiUploadAccountAvatar as g, useAccountDetail as u };
//# sourceMappingURL=useAccounts-BDWM8ZpB.mjs.map
