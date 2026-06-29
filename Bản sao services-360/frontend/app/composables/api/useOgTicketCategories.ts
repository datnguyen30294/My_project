import type {
  OgTicketCategoriesIndex200,
  OgTicketCategoriesIndexParams,
  OgTicketCategoriesShow200,
  OgTicketCategoriesStore201,
  OgTicketCategoriesUpdate200,
  OgTicketCategoriesDestroy200,
  OgTicketCategoryCheckDelete200,
  CreateOgTicketCategoryRequest,
  UpdateOgTicketCategoryRequest
} from '#api/generated/laravel'

export function useOgTicketCategoryList(
  params: MaybeRefOrGetter<OgTicketCategoriesIndexParams & { page?: number, per_page?: number }>
) {
  return useApiFetch<OgTicketCategoriesIndex200>('/pmc/og-ticket-categories', {
    query: params,
    watch: [params]
  })
}

export function apiListOgTicketCategories(params?: OgTicketCategoriesIndexParams & { page?: number, per_page?: number }) {
  return $api<OgTicketCategoriesIndex200>('/pmc/og-ticket-categories', { query: params })
}

export function apiGetOgTicketCategory(id: number) {
  return $api<OgTicketCategoriesShow200>(`/pmc/og-ticket-categories/${id}`)
}

export function apiCreateOgTicketCategory(data: CreateOgTicketCategoryRequest) {
  return $api<OgTicketCategoriesStore201>('/pmc/og-ticket-categories', { method: 'POST', body: data })
}

export function apiUpdateOgTicketCategory(id: number, data: UpdateOgTicketCategoryRequest) {
  return $api<OgTicketCategoriesUpdate200>(`/pmc/og-ticket-categories/${id}`, { method: 'PUT', body: data })
}

export function apiDeleteOgTicketCategory(id: number) {
  return $api<OgTicketCategoriesDestroy200>(`/pmc/og-ticket-categories/${id}`, { method: 'DELETE' })
}

export function apiCheckDeleteOgTicketCategory(id: number) {
  return $api<OgTicketCategoryCheckDelete200>(`/pmc/og-ticket-categories/${id}/check-delete`)
}

export function apiSyncOgTicketCategories(ogTicketId: number, categoryIds: number[]) {
  return $api(`/pmc/og-tickets/${ogTicketId}/categories`, {
    method: 'PUT',
    body: { category_ids: categoryIds }
  })
}
