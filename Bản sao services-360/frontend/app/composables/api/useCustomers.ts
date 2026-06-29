import type {
  // Platform Customer (long-prefixed in generated output because it shares the
  // resource class name `CustomerListResource` with tenant PMC Customer).
  AppModulesPlatformCustomerResourcesCustomerListResource,
  AppModulesPlatformCustomerResourcesCustomerDetailResource,
  AppModulesPlatformCustomerResourcesCustomerDetailResourceTicketsItem,
  ModulesPlatformCustomerCustomerIndexParams,
  ModulesPlatformCustomerCustomerIndex200,
  ModulesPlatformCustomerCustomerShow200,
  // Tenant PMC Customer
  CustomerListResource,
  CustomerDetailResource,
  CustomerTicketItemResource,
  CustomerOrderItemResource,
  CustomerPaymentItemResource,
  CustomersIndexParams,
  CustomersIndex200,
  CustomersShow200,
  CustomersStore201,
  CustomersUpdate200,
  CustomersDestroy200,
  CustomerCheckDelete200,
  CustomerTicketsParams,
  CustomerTickets200,
  CustomerOrdersParams,
  CustomerOrders200,
  CustomerPaymentsParams,
  CustomerPayments200,
  CreateCustomerRequest,
  UpdateCustomerRequest
} from '#api/generated/laravel'

// ─── Platform aliases ─────────────────────────────────────────────────────
export type PlatformCustomerListResource = AppModulesPlatformCustomerResourcesCustomerListResource
export type PlatformCustomerDetailResource = AppModulesPlatformCustomerResourcesCustomerDetailResource
export type PlatformCustomerTicketsItem = AppModulesPlatformCustomerResourcesCustomerDetailResourceTicketsItem
export type PlatformCustomerIndexParams = ModulesPlatformCustomerCustomerIndexParams

// ─── Tenant PMC re-exports ────────────────────────────────────────────────
export type {
  CustomerListResource,
  CustomerDetailResource,
  CustomerTicketItemResource,
  CustomerOrderItemResource,
  CustomerPaymentItemResource,
  CustomersIndexParams,
  CustomerCheckDelete200,
  CustomerTicketsParams,
  CustomerOrdersParams,
  CustomerPaymentsParams,
  CreateCustomerRequest,
  UpdateCustomerRequest
}

// ═══════════════════════════════════════════════════════════════════════════
// Platform — Quản lý cư dân (central/non-tenant)
// ═══════════════════════════════════════════════════════════════════════════

export function usePlatformCustomerList(params: MaybeRefOrGetter<PlatformCustomerIndexParams>) {
  return usePlatformApiFetch<ModulesPlatformCustomerCustomerIndex200>('/platform/customers', {
    query: computed(() => toValue(params))
  })
}

export function usePlatformCustomerDetail(id: MaybeRefOrGetter<number | string>) {
  const url = computed(() => `/platform/customers/${toValue(id)}`)
  return usePlatformApiFetch<ModulesPlatformCustomerCustomerShow200>(url)
}

// ═══════════════════════════════════════════════════════════════════════════
// Tenant PMC — Danh bạ khách hàng (cư dân trong tenant)
// ═══════════════════════════════════════════════════════════════════════════

export function useCustomerList(params: MaybeRefOrGetter<CustomersIndexParams & { page?: number }>) {
  return useApiFetch<CustomersIndex200>('/pmc/customers', {
    query: params,
    watch: [params]
  })
}

export function useCustomerDetail(id: MaybeRefOrGetter<number | string>) {
  return useApiFetch<CustomersShow200>(
    computed(() => `/pmc/customers/${toValue(id)}`),
    { watch: [() => toValue(id)] }
  )
}

export function useCustomerTickets(
  id: MaybeRefOrGetter<number | string>,
  params: MaybeRefOrGetter<CustomerTicketsParams & { page?: number }>
) {
  return useApiFetch<CustomerTickets200>(
    computed(() => `/pmc/customers/${toValue(id)}/tickets`),
    { query: params, watch: [params, () => toValue(id)] }
  )
}

export function useCustomerOrders(
  id: MaybeRefOrGetter<number | string>,
  params: MaybeRefOrGetter<CustomerOrdersParams & { page?: number }>
) {
  return useApiFetch<CustomerOrders200>(
    computed(() => `/pmc/customers/${toValue(id)}/orders`),
    { query: params, watch: [params, () => toValue(id)] }
  )
}

export function useCustomerPayments(
  id: MaybeRefOrGetter<number | string>,
  params: MaybeRefOrGetter<CustomerPaymentsParams & { page?: number }>
) {
  return useApiFetch<CustomerPayments200>(
    computed(() => `/pmc/customers/${toValue(id)}/payments`),
    { query: params, watch: [params, () => toValue(id)] }
  )
}

export function apiGetCustomer(id: number | string) {
  return $api<CustomersShow200>(`/pmc/customers/${id}`)
}

export function apiCreateCustomer(body: CreateCustomerRequest) {
  return $api<CustomersStore201>('/pmc/customers', { method: 'POST', body })
}

export function apiUpdateCustomer(id: number | string, body: UpdateCustomerRequest) {
  return $api<CustomersUpdate200>(`/pmc/customers/${id}`, { method: 'PUT', body })
}

export function apiDeleteCustomer(id: number | string) {
  return $api<CustomersDestroy200>(`/pmc/customers/${id}`, { method: 'DELETE' })
}

export function apiCheckDeleteCustomer(id: number | string) {
  return $api<CustomerCheckDelete200>(`/pmc/customers/${id}/check-delete`)
}

export function apiSearchCustomerByPhone(phone: string) {
  return $api<CustomersIndex200>('/pmc/customers', {
    query: { search: phone, per_page: 1 }
  })
}
