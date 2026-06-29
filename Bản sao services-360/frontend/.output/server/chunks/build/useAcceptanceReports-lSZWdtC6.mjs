import { o as useApiFetch, v as vueExports, ax as getApiBaseUrl, aw as useFetch, $ as $api } from './server.mjs';

const ACCEPTANCE_REPORT_PLACEHOLDERS = [
  { token: "{{order_code}}", label: "Mã đơn hàng" },
  { token: "{{order_total}}", label: "Tổng giá trị đơn" },
  { token: "{{order_date}}", label: "Ngày tạo đơn" },
  { token: "{{today}}", label: "Ngày hôm nay" },
  { token: "{{customer_name}}", label: "Họ tên khách hàng" },
  { token: "{{customer_phone}}", label: "Điện thoại khách hàng" },
  { token: "{{customer_address}}", label: "Địa chỉ khách hàng" },
  { token: "{{ticket_subject}}", label: "Nội dung yêu cầu" },
  { token: "{{project_name}}", label: "Tên dự án" },
  { token: "{{organization_name}}", label: "Tên đơn vị thi công" },
  { token: "{{order_lines_table}}", label: "Bảng chi tiết hạng mục" },
  { token: "{{note}}", label: "Ghi chú đơn" }
];
function useAcceptanceReport(orderId, opts = {}) {
  return useApiFetch(
    vueExports.computed(() => `/pmc/orders/${vueExports.toValue(orderId)}/acceptance-report`),
    {
      watch: [() => vueExports.toValue(orderId)],
      immediate: opts.immediate ?? true
    }
  );
}
function apiUpdateAcceptanceReport(orderId, data) {
  return $api(
    `/pmc/orders/${orderId}/acceptance-report`,
    { method: "PUT", body: data }
  );
}
function apiRegenerateAcceptanceReport(orderId) {
  return $api(
    `/pmc/orders/${orderId}/acceptance-report/regenerate`,
    { method: "POST" }
  );
}
function apiUploadSignedAcceptanceReport(orderId, file) {
  const formData = new FormData();
  formData.append("file", file);
  return $api(
    `/pmc/orders/${orderId}/acceptance-report/signed`,
    { method: "POST", body: formData }
  );
}
function apiDeleteSignedAcceptanceReport(orderId) {
  return $api(
    `/pmc/orders/${orderId}/acceptance-report/signed`,
    { method: "DELETE" }
  );
}
function usePublicAcceptanceReport(token) {
  const baseUrl = getApiBaseUrl();
  return useFetch(
    vueExports.computed(() => `${baseUrl}/public/acceptance-reports/${vueExports.toValue(token)}`),
    { watch: [() => vueExports.toValue(token)] },
    "$4vUYuCpk7V"
    /* nuxt-injected */
  );
}
function apiConfirmPublicAcceptanceReport(token, data) {
  const baseUrl = getApiBaseUrl();
  return $fetch(
    `${baseUrl}/public/acceptance-reports/${token}/confirm`,
    { method: "POST", body: data }
  );
}

export { ACCEPTANCE_REPORT_PLACEHOLDERS as A, apiConfirmPublicAcceptanceReport as a, apiUpdateAcceptanceReport as b, apiDeleteSignedAcceptanceReport as c, apiRegenerateAcceptanceReport as d, apiUploadSignedAcceptanceReport as e, usePublicAcceptanceReport as f, useAcceptanceReport as u };
//# sourceMappingURL=useAcceptanceReports-lSZWdtC6.mjs.map
