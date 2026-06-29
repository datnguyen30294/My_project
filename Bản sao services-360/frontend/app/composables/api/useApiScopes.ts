export interface ApiScopeItem {
  value: string
  label: string
}

export interface ApiScopeGroup {
  key: string
  label: string
  icon: string
  scopes: ApiScopeItem[]
}

interface ApiScopeListResponse {
  success: boolean
  data: ApiScopeGroup[]
}

export function usePlatformApiScopeList() {
  return usePlatformApiFetch<ApiScopeListResponse>('/platform/api-scopes')
}
