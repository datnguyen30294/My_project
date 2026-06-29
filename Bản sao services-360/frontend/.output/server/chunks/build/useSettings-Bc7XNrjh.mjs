import { o as useApiFetch, v as vueExports, $ as $api } from './server.mjs';

const SLA_DEFAULTS = {
  sla_quote_minutes: "60",
  sla_completion_minutes: "1440"
};
function parseBankAccountSettings(raw) {
  return {
    bank_bin: raw?.bank_bin ?? "",
    bank_name: raw?.bank_name ?? "",
    account_number: raw?.account_number ?? "",
    account_holder: raw?.account_holder ?? ""
  };
}
function isBankAccountConfigured(settings) {
  if (!settings) return false;
  return Boolean(settings.bank_bin && settings.account_number && settings.account_holder);
}
function useSettingsGroup(group) {
  return useApiFetch(
    vueExports.computed(() => `/pmc/settings/${vueExports.toValue(group)}`),
    { watch: [() => vueExports.toValue(group)] }
  );
}
function apiSaveSettings(group, settings) {
  return $api(`/pmc/settings/${group}`, {
    method: "PUT",
    body: { settings }
  });
}

export { SLA_DEFAULTS as S, apiSaveSettings as a, isBankAccountConfigured as i, parseBankAccountSettings as p, useSettingsGroup as u };
//# sourceMappingURL=useSettings-Bc7XNrjh.mjs.map
