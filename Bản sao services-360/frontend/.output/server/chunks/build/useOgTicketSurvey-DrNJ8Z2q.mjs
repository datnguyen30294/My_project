import { o as useApiFetch, v as vueExports, ax as getApiBaseUrl, aw as useFetch, $ as $api } from './server.mjs';

const SURVEY_MAX_FILES = 20;
const SURVEY_MAX_FILE_BYTES = 100 * 1024 * 1024;
const SURVEY_ALLOWED_MIMES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/heic",
  "image/heif",
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/webm",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain"
];
function useOgTicketSurvey(ogTicketId, opts = {}) {
  return useApiFetch(
    vueExports.computed(() => `/pmc/og-tickets/${vueExports.toValue(ogTicketId)}/survey`),
    {
      watch: [() => vueExports.toValue(ogTicketId)],
      immediate: opts.immediate ?? true
    }
  );
}
function apiUpsertOgTicketSurvey(ogTicketId, payload) {
  const formData = new FormData();
  if (payload.note !== void 0 && payload.note !== null) {
    formData.append("note", payload.note);
  }
  for (const file of payload.attachments ?? []) {
    formData.append("attachments[]", file);
  }
  return $api(
    `/pmc/og-tickets/${ogTicketId}/survey`,
    { method: "POST", body: formData }
  );
}
function apiDeleteOgTicketSurveyAttachment(ogTicketId, attachmentId) {
  return $api(
    `/pmc/og-tickets/${ogTicketId}/survey/attachments/${attachmentId}`,
    { method: "DELETE" }
  );
}
function usePublicOgTicketSurvey(code) {
  const baseURL = getApiBaseUrl();
  return useFetch(
    vueExports.computed(() => `${baseURL}/public/tickets/${vueExports.toValue(code)}/survey`),
    { watch: [() => vueExports.toValue(code)] },
    "$CCVw-ntvEI"
    /* nuxt-injected */
  );
}
function apiUpsertPublicOgTicketSurvey(code, payload) {
  const baseURL = getApiBaseUrl();
  const formData = new FormData();
  if (payload.note !== void 0 && payload.note !== null) {
    formData.append("note", payload.note);
  }
  for (const file of payload.attachments ?? []) {
    formData.append("attachments[]", file);
  }
  return $fetch(
    `${baseURL}/public/tickets/${code}/survey`,
    { method: "POST", body: formData }
  );
}
function apiDeletePublicOgTicketSurveyAttachment(code, attachmentId) {
  const baseURL = getApiBaseUrl();
  return $fetch(
    `${baseURL}/public/tickets/${code}/survey/attachments/${attachmentId}`,
    { method: "DELETE" }
  );
}

export { SURVEY_MAX_FILES as S, SURVEY_ALLOWED_MIMES as a, apiDeletePublicOgTicketSurveyAttachment as b, apiUpsertPublicOgTicketSurvey as c, useOgTicketSurvey as d, apiDeleteOgTicketSurveyAttachment as e, apiUpsertOgTicketSurvey as f, SURVEY_MAX_FILE_BYTES as g, usePublicOgTicketSurvey as u };
//# sourceMappingURL=useOgTicketSurvey-DrNJ8Z2q.mjs.map
