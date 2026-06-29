import { o as useApiFetch, v as vueExports, $ as $api } from './server.mjs';

const POLICY_TYPES = {
  TERMS_OF_SERVICE: "terms_of_service",
  PRIVACY_POLICY: "privacy_policy"
};
const POLICY_TYPE_LABELS = {
  [POLICY_TYPES.TERMS_OF_SERVICE]: "Điều khoản sử dụng",
  [POLICY_TYPES.PRIVACY_POLICY]: "Chính sách bảo mật"
};
function usePolicyList() {
  return useApiFetch("/pmc/policies");
}
function usePolicyDetail(type) {
  return useApiFetch(
    vueExports.computed(() => `/pmc/policies/${vueExports.toValue(type)}`),
    { watch: [() => vueExports.toValue(type)] }
  );
}
function usePublicPolicy(type) {
  return useApiFetch(
    vueExports.computed(() => `/public/policies/${vueExports.toValue(type)}`),
    { watch: [() => vueExports.toValue(type)] }
  );
}
function apiUploadPolicyImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  return $api("/pmc/policies/upload-image", {
    method: "POST",
    body: formData
  });
}
function apiUpdatePolicy(type, data) {
  return $api(`/pmc/policies/${type}`, {
    method: "PUT",
    body: data
  });
}

export { POLICY_TYPES as P, usePolicyList as a, POLICY_TYPE_LABELS as b, usePolicyDetail as c, apiUploadPolicyImage as d, apiUpdatePolicy as e, usePublicPolicy as u };
//# sourceMappingURL=usePolicies-fLtp10Zn.mjs.map
