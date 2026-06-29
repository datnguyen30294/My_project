import type {
  AccountsIndex200,
  AccountsIndexParams,
  AccountsStore201,
  AccountsShow200,
  AccountsUpdate200,
  AccountsDestroy200,
  AccountChangePassword200,
  CreateAccountRequest,
  UpdateAccountRequest,
  ChangePasswordRequest
} from '#api/generated/laravel'

export function useAccountList(params: MaybeRefOrGetter<AccountsIndexParams & { page?: number }>) {
  return useApiFetch<AccountsIndex200>('/pmc/accounts', {
    query: params,
    watch: [params]
  })
}

export function useAccountDetail(id: MaybeRefOrGetter<number>) {
  return useApiFetch<AccountsShow200>(
    computed(() => `/pmc/accounts/${toValue(id)}`)
  )
}

export function apiCreateAccount(data: CreateAccountRequest) {
  return $api<AccountsStore201>('/pmc/accounts', { method: 'POST', body: data })
}

export function apiUpdateAccount(id: number, data: UpdateAccountRequest) {
  return $api<AccountsUpdate200>(`/pmc/accounts/${id}`, { method: 'PUT', body: data })
}

export function apiDeleteAccount(id: number) {
  return $api<AccountsDestroy200>(`/pmc/accounts/${id}`, { method: 'DELETE' })
}

export function apiChangeAccountPassword(id: number, data: ChangePasswordRequest) {
  return $api<AccountChangePassword200>(`/pmc/accounts/${id}/password`, { method: 'PUT', body: data })
}

export function apiUploadAccountAvatar(id: number, file: File) {
  const formData = new FormData()
  formData.append('avatar', file)
  return $api<AccountsShow200>(`/pmc/accounts/${id}/avatar`, { method: 'POST', body: formData })
}

export function apiDeleteAccountAvatar(id: number) {
  return $api<AccountsShow200>(`/pmc/accounts/${id}/avatar`, { method: 'DELETE' })
}
