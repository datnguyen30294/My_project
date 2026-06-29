// ─── Types ───

interface SettingsResponse {
  success: boolean
  data: Record<string, string | null>
}

interface SaveSettingsResponse {
  success: boolean
  message: string
}

interface SettingItem {
  key: string
  value: string | number | null
}

// ─── SLA defaults ───

export const SLA_DEFAULTS: Record<string, string> = {
  sla_quote_minutes: '60',
  sla_completion_minutes: '1440'
}

// ─── Bank account setting ───

export interface BankAccountSettings {
  bank_bin: string
  bank_name: string
  account_number: string
  account_holder: string
}

export const BANK_ACCOUNT_KEYS = ['bank_bin', 'bank_name', 'account_number', 'account_holder'] as const

export function parseBankAccountSettings(raw: Record<string, string | null> | undefined | null): BankAccountSettings {
  return {
    bank_bin: raw?.bank_bin ?? '',
    bank_name: raw?.bank_name ?? '',
    account_number: raw?.account_number ?? '',
    account_holder: raw?.account_holder ?? ''
  }
}

export function isBankAccountConfigured(settings: BankAccountSettings | null | undefined): boolean {
  if (!settings) return false
  return Boolean(settings.bank_bin && settings.account_number && settings.account_holder)
}

// ─── Queries ───

export function useSettingsGroup(group: MaybeRefOrGetter<string>) {
  return useApiFetch<SettingsResponse>(
    computed(() => `/pmc/settings/${toValue(group)}`),
    { watch: [() => toValue(group)] }
  )
}

// ─── Mutations ───

export function apiSaveSettings(group: string, settings: SettingItem[]) {
  return $api<SaveSettingsResponse>(`/pmc/settings/${group}`, {
    method: 'PUT',
    body: { settings }
  })
}
