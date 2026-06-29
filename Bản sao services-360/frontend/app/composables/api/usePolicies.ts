import type {
  PolicyListResource,
  PolicyDetailResource,
  PolicyIndex200,
  PolicyShow200,
  PolicyUpdate200,
  PolicyUploadImage200,
  PublicPolicyShow200,
  UpdatePolicyRequest
} from '#api/generated/laravel'

export type { PolicyListResource, PolicyDetailResource }

// ─── Policy type constants ───

export const POLICY_TYPES = {
  TERMS_OF_SERVICE: 'terms_of_service',
  PRIVACY_POLICY: 'privacy_policy'
} as const

export const POLICY_TYPE_LABELS: Record<string, string> = {
  [POLICY_TYPES.TERMS_OF_SERVICE]: 'Điều khoản sử dụng',
  [POLICY_TYPES.PRIVACY_POLICY]: 'Chính sách bảo mật'
}

// ─── Queries (Admin) ───

export function usePolicyList() {
  return useApiFetch<PolicyIndex200>('/pmc/policies')
}

export function usePolicyDetail(type: MaybeRefOrGetter<string>) {
  return useApiFetch<PolicyShow200>(
    computed(() => `/pmc/policies/${toValue(type)}`),
    { watch: [() => toValue(type)] }
  )
}

// ─── Queries (Public) ───

export function usePublicPolicy(type: MaybeRefOrGetter<string>) {
  return useApiFetch<PublicPolicyShow200>(
    computed(() => `/public/policies/${toValue(type)}`),
    { watch: [() => toValue(type)] }
  )
}

// ─── Mutations ───

export function apiUploadPolicyImage(file: File) {
  const formData = new FormData()
  formData.append('image', file)
  return $api<PolicyUploadImage200>('/pmc/policies/upload-image', {
    method: 'POST',
    body: formData
  })
}

export function apiUpdatePolicy(type: string, data: UpdatePolicyRequest) {
  return $api<PolicyUpdate200>(`/pmc/policies/${type}`, {
    method: 'PUT',
    body: data
  })
}
