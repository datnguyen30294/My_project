import { o as useApiFetch, v as vueExports, $ as $api } from './server.mjs';

function ogTicketStatusColor(value) {
  switch (value) {
    case "received":
      return "info";
    case "assigned":
      return "primary";
    case "surveying":
      return "warning";
    case "quoted":
      return "warning";
    case "approved":
      return "success";
    case "rejected":
      return "error";
    case "ordered":
      return "success";
    case "in_progress":
      return "info";
    case "accepted":
      return "success";
    case "completed":
      return "success";
    case "cancelled":
      return "error";
    default:
      return "neutral";
  }
}
function ogTicketPriorityColor(value) {
  switch (value) {
    case "low":
      return "neutral";
    case "normal":
      return "info";
    case "high":
      return "warning";
    case "urgent":
      return "error";
    default:
      return "neutral";
  }
}
const OG_TICKET_STATUS_OPTIONS = [
  { label: "Đã tiếp nhận", value: "received" },
  { label: "Đã phân công", value: "assigned" },
  { label: "Đang khảo sát", value: "surveying" },
  { label: "Đã báo giá", value: "quoted" },
  { label: "Đã chấp thuận", value: "approved" },
  { label: "Từ chối", value: "rejected" },
  { label: "Đã lên đơn", value: "ordered" },
  { label: "Đang thực hiện", value: "in_progress" },
  { label: "Đã nghiệm thu", value: "accepted" },
  { label: "Hoàn thành", value: "completed" },
  { label: "Đã hủy", value: "cancelled" }
];
const OG_TICKET_PRIORITY_OPTIONS = [
  { label: "Thấp", value: "low" },
  { label: "Bình thường", value: "normal" },
  { label: "Cao", value: "high" },
  { label: "Khẩn cấp", value: "urgent" }
];
const OG_TICKET_WORKFLOW_STEPS = [
  { value: "received", title: "Tiếp nhận", description: "Ticket đã được nhận", icon: "i-lucide-inbox" },
  { value: "assigned", title: "Phân công", description: "Đã gán người xử lý", icon: "i-lucide-user-check" },
  { value: "surveying", title: "Khảo sát", description: "Đang khảo sát hiện trường", icon: "i-lucide-search" },
  { value: "quoted", title: "Báo giá", description: "Đã gửi báo giá", icon: "i-lucide-file-text" },
  { value: "approved", title: "Chấp thuận", description: "Cư dân đã đồng ý", icon: "i-lucide-check-circle" },
  { value: "ordered", title: "Lên đơn", description: "Đã tạo đơn hàng", icon: "i-lucide-shopping-cart" },
  { value: "in_progress", title: "Thực hiện", description: "Đang thi công", icon: "i-lucide-hammer" },
  { value: "accepted", title: "Nghiệm thu", description: "Đã nghiệm thu", icon: "i-lucide-clipboard-check" },
  { value: "completed", title: "Hoàn thành", description: "Đã hoàn tất", icon: "i-lucide-circle-check-big" }
];
function ogTicketStatusToStepIndex(status) {
  const index = OG_TICKET_WORKFLOW_STEPS.findIndex((s) => s.value === status);
  return index >= 0 ? index : 0;
}
function usePoolTicketList(params) {
  return useApiFetch("/pmc/og-tickets/pool", {
    query: params,
    watch: [params]
  });
}
function useOgTicketList(params) {
  return useApiFetch("/pmc/og-tickets", {
    query: params,
    watch: [params]
  });
}
function useOgTicketDetail(id) {
  return useApiFetch(
    vueExports.computed(() => `/pmc/og-tickets/${vueExports.toValue(id)}`),
    { watch: [() => vueExports.toValue(id)] }
  );
}
function useOgTicketAudits(id) {
  return useApiFetch(
    vueExports.computed(() => `/pmc/og-tickets/${vueExports.toValue(id)}/audits`),
    { watch: [() => vueExports.toValue(id)] }
  );
}
function apiClaimTicket(data) {
  return $api("/pmc/og-tickets/claim", {
    method: "POST",
    body: data
  });
}
function apiCreateOgTicket(data) {
  const formData = new FormData();
  formData.append("requester_name", data.requester_name);
  formData.append("requester_phone", data.requester_phone);
  formData.append("subject", data.subject);
  formData.append("channel", data.channel);
  formData.append("priority", data.priority);
  if (data.description != null) formData.append("description", data.description);
  if (data.address != null) formData.append("address", data.address);
  if (data.apartment_name != null) formData.append("apartment_name", data.apartment_name);
  if (data.latitude != null) formData.append("latitude", String(data.latitude));
  if (data.longitude != null) formData.append("longitude", String(data.longitude));
  if (data.project_id != null) formData.append("project_id", String(data.project_id));
  if (data.internal_note != null) formData.append("internal_note", data.internal_note);
  if (data.received_by_id != null) formData.append("received_by_id", String(data.received_by_id));
  if (data.assigned_to_ids) {
    data.assigned_to_ids.forEach((id) => formData.append("assigned_to_ids[]", String(id)));
  }
  if (data.category_ids) {
    data.category_ids.forEach((id) => formData.append("category_ids[]", String(id)));
  }
  if (data.attachments) {
    data.attachments.forEach((file) => formData.append("attachments[]", file));
  }
  return $api("/pmc/og-tickets", {
    method: "POST",
    body: formData
  });
}
function apiUpdateOgTicket(id, data) {
  const formData = new FormData();
  formData.append("_method", "PUT");
  formData.append("priority", data.priority);
  if (data.received_by_id != null) formData.append("received_by_id", String(data.received_by_id));
  if (data.assigned_to_ids) {
    data.assigned_to_ids.forEach((id2) => formData.append("assigned_to_ids[]", String(id2)));
  }
  if (data.sla_quote_due_at) formData.append("sla_quote_due_at", data.sla_quote_due_at);
  if (data.sla_completion_due_at) formData.append("sla_completion_due_at", data.sla_completion_due_at);
  if (data.internal_note != null) formData.append("internal_note", data.internal_note);
  if (data.subject) formData.append("subject", data.subject);
  if (data.description != null) formData.append("description", data.description ?? "");
  if (data.address != null) formData.append("address", data.address ?? "");
  if (data.latitude != null) formData.append("latitude", String(data.latitude));
  if (data.longitude != null) formData.append("longitude", String(data.longitude));
  if (data.apartment_name != null) formData.append("apartment_name", data.apartment_name ?? "");
  if (data.project_id != null) formData.append("project_id", String(data.project_id));
  if (data.attachments) {
    data.attachments.forEach((file) => formData.append("attachments[]", file));
  }
  if (data.delete_attachment_ids) {
    data.delete_attachment_ids.forEach((id2) => formData.append("delete_attachment_ids[]", String(id2)));
  }
  return $api(`/pmc/og-tickets/${id}`, {
    method: "POST",
    body: formData
  });
}
function apiCheckDeleteOgTicket(id) {
  return $api(`/pmc/og-tickets/${id}/check-delete`);
}
function apiDeleteOgTicket(id) {
  return $api(`/pmc/og-tickets/${id}`, {
    method: "DELETE"
  });
}
function apiTransitionOgTicket(id, data) {
  return $api(`/pmc/og-tickets/${id}/transition`, {
    method: "PUT",
    body: data
  });
}
function apiReleaseOgTicket(id, data) {
  return $api(`/pmc/og-tickets/${id}/release`, {
    method: "PUT",
    body: data ?? {}
  });
}

export { OG_TICKET_PRIORITY_OPTIONS as O, ogTicketStatusColor as a, useOgTicketDetail as b, apiUpdateOgTicket as c, useOgTicketAudits as d, apiCheckDeleteOgTicket as e, apiTransitionOgTicket as f, apiReleaseOgTicket as g, OG_TICKET_WORKFLOW_STEPS as h, ogTicketStatusToStepIndex as i, apiDeleteOgTicket as j, usePoolTicketList as k, apiClaimTicket as l, OG_TICKET_STATUS_OPTIONS as m, apiCreateOgTicket as n, ogTicketPriorityColor as o, useOgTicketList as u };
//# sourceMappingURL=useOgTickets-DPRh9tlL.mjs.map
