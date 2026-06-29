export const AUDIT_EVENT_LABELS: Record<string, string> = {
  created: 'Tạo mới',
  updated: 'Cập nhật',
  deleted: 'Xoá',
  restored: 'Khôi phục'
}

export const AUDIT_EVENT_COLORS: Record<string, 'success' | 'info' | 'error' | 'warning'> = {
  created: 'success',
  updated: 'info',
  deleted: 'error',
  restored: 'warning'
}

export interface AuditEntry {
  id: number
  event: string
  old_values: Record<string, unknown> | null
  new_values: Record<string, unknown> | null
  user: { id: number, name: string } | null
  created_at: string | null
}

export interface AuditFieldChange {
  field: string
  old: string
  new: string
}

/**
 * Format audit value: null → '—', datetime fields → formatted, otherwise string.
 */
export function formatAuditValue(
  key: string,
  value: unknown,
  datetimeFields: Set<string>
): string {
  if (value == null || value === '') return '—'
  if (datetimeFields.has(key)) return formatDateTime(String(value))
  return String(value)
}

/**
 * Extract changed fields from an audit entry.
 */
export function getAuditChangedFields(
  audit: AuditEntry,
  fieldLabels: Record<string, string>,
  datetimeFields: Set<string>
): AuditFieldChange[] {
  if (audit.event === 'created') return []
  const changes: AuditFieldChange[] = []
  const newVals = audit.new_values ?? {}
  const oldVals = audit.old_values ?? {}
  const allKeys = new Set([...Object.keys(newVals), ...Object.keys(oldVals)])
  for (const key of allKeys) {
    const label = fieldLabels[key] ?? key
    changes.push({
      field: label,
      old: formatAuditValue(key, oldVals[key], datetimeFields),
      new: formatAuditValue(key, newVals[key], datetimeFields)
    })
  }
  return changes
}
