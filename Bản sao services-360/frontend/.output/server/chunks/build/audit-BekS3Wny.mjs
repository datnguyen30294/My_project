import { f as formatDateTime } from './date-R5YK0ast.mjs';

const AUDIT_EVENT_LABELS = {
  created: "Tạo mới",
  updated: "Cập nhật",
  deleted: "Xoá",
  restored: "Khôi phục"
};
const AUDIT_EVENT_COLORS = {
  created: "success",
  updated: "info",
  deleted: "error",
  restored: "warning"
};
function formatAuditValue(key, value, datetimeFields) {
  if (value == null || value === "") return "—";
  if (datetimeFields.has(key)) return formatDateTime(String(value));
  return String(value);
}
function getAuditChangedFields(audit, fieldLabels, datetimeFields) {
  if (audit.event === "created") return [];
  const changes = [];
  const newVals = audit.new_values ?? {};
  const oldVals = audit.old_values ?? {};
  const allKeys = /* @__PURE__ */ new Set([...Object.keys(newVals), ...Object.keys(oldVals)]);
  for (const key of allKeys) {
    const label = fieldLabels[key] ?? key;
    changes.push({
      field: label,
      old: formatAuditValue(key, oldVals[key], datetimeFields),
      new: formatAuditValue(key, newVals[key], datetimeFields)
    });
  }
  return changes;
}

export { AUDIT_EVENT_COLORS as A, AUDIT_EVENT_LABELS as a, getAuditChangedFields as g };
//# sourceMappingURL=audit-BekS3Wny.mjs.map
