interface PlatformSettingsResponse {
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

export function usePlatformSettingsGroup(group: MaybeRefOrGetter<string>) {
  return usePlatformApiFetch<PlatformSettingsResponse>(
    computed(() => `/platform/settings/${toValue(group)}`),
    { watch: [() => toValue(group)] }
  )
}

export function apiSavePlatformSettings(group: string, settings: SettingItem[]) {
  return $platformApi<SaveSettingsResponse>(`/platform/settings/${group}`, {
    method: 'PUT',
    body: { settings }
  })
}
