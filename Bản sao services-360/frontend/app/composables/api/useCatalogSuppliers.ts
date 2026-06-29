import type {
  SuppliersIndexParams,
  SuppliersIndex200,
  SuppliersShow200,
  SuppliersStore201,
  SuppliersUpdate200,
  SuppliersDestroy200,
  CatalogSupplierCheckDelete200,
  CreateCatalogSupplierRequest,
  UpdateCatalogSupplierRequest
} from '#api/generated/laravel'

// --- Queries ---
export function useCatalogSupplierList(params: MaybeRefOrGetter<SuppliersIndexParams & { page?: number }>) {
  return useApiFetch<SuppliersIndex200>('/pmc/catalog/suppliers', {
    query: params,
    watch: [params]
  })
}

export function useCatalogSupplierDetail(id: MaybeRefOrGetter<number>, options: { immediate?: boolean } = {}) {
  return useApiFetch<SuppliersShow200>(
    computed(() => `/pmc/catalog/suppliers/${toValue(id)}`),
    {
      watch: options.immediate === false ? false : [() => toValue(id)],
      immediate: options.immediate ?? true
    }
  )
}

export function apiGetCatalogSupplier(id: number) {
  return $api<SuppliersShow200>(`/pmc/catalog/suppliers/${id}`)
}

// --- Mutations ---
export function apiCreateCatalogSupplier(data: CreateCatalogSupplierRequest) {
  return $api<SuppliersStore201>('/pmc/catalog/suppliers', { method: 'POST', body: data })
}

export function apiUpdateCatalogSupplier(id: number, data: UpdateCatalogSupplierRequest) {
  return $api<SuppliersUpdate200>(`/pmc/catalog/suppliers/${id}`, { method: 'PUT', body: data })
}

export function apiDeleteCatalogSupplier(id: number) {
  return $api<SuppliersDestroy200>(`/pmc/catalog/suppliers/${id}`, { method: 'DELETE' })
}

export function apiCheckDeleteCatalogSupplier(id: number) {
  return $api<CatalogSupplierCheckDelete200>(`/pmc/catalog/suppliers/${id}/check-delete`)
}
