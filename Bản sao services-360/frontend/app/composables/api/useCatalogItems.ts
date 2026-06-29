import type {
  ItemsIndexParams,
  ItemsIndex200,
  ItemsShow200,
  ItemsStore201,
  ItemsUpdate200,
  ItemsDestroy200,
  CreateCatalogItemRequest,
  UpdateCatalogItemRequest,
  ServiceCategoriesIndex200,
  ServiceCategoriesIndexParams,
  ServiceCategoriesShow200,
  ServiceCategoriesStore201,
  ServiceCategoriesUpdate200,
  ServiceCategoriesDestroy200,
  ServiceCategoryCheckDelete200,
  CreateServiceCategoryRequest,
  UpdateServiceCategoryRequest,
  PublicServiceIndexParams,
  PublicServiceIndex200,
  PublicServiceShow200
} from '#api/generated/laravel'

// --- Queries ---
export function useCatalogItemList(params: MaybeRefOrGetter<ItemsIndexParams & { page?: number }>) {
  return useApiFetch<ItemsIndex200>('/pmc/catalog/items', {
    query: params,
    watch: [params]
  })
}

export function useCatalogItemDetail(id: MaybeRefOrGetter<number>, options: { immediate?: boolean } = {}) {
  return useApiFetch<ItemsShow200>(
    computed(() => `/pmc/catalog/items/${toValue(id)}`),
    {
      watch: options.immediate === false ? false : [() => toValue(id)],
      immediate: options.immediate ?? true
    }
  )
}

// --- Filtered query (for quote line selection) ---
export function useCatalogItemsByType(
  lineType: MaybeRefOrGetter<string | undefined>,
  search: MaybeRefOrGetter<string | undefined> = undefined
) {
  const params = computed(() => {
    const type = toValue(lineType)
    if (!type) return null
    const s = toValue(search)
    return { type, search: s || undefined, per_page: DEFAULT_PER_PAGE, status: 'active' as const }
  })

  return useApiFetch<ItemsIndex200>(
    '/pmc/catalog/items',
    {
      query: params,
      watch: [params],
      immediate: false
    }
  )
}

// --- Mutations ---
export function apiCreateCatalogItem(data: CreateCatalogItemRequest) {
  return $api<ItemsStore201>('/pmc/catalog/items', { method: 'POST', body: data })
}

export function apiUpdateCatalogItem(id: number, data: UpdateCatalogItemRequest) {
  return $api<ItemsUpdate200>(`/pmc/catalog/items/${id}`, { method: 'PUT', body: data })
}

export function apiDeleteCatalogItem(id: number) {
  return $api<ItemsDestroy200>(`/pmc/catalog/items/${id}`, { method: 'DELETE' })
}

export function apiUploadCatalogItemImage(id: number, file: File) {
  const formData = new FormData()
  formData.append('image', file)
  return $api(`/pmc/catalog/items/${id}/image`, { method: 'POST', body: formData })
}

export function apiDeleteCatalogItemImage(id: number) {
  return $api(`/pmc/catalog/items/${id}/image`, { method: 'DELETE' })
}

// --- Gallery ---
export function apiUploadCatalogItemGallery(id: number, files: File[]) {
  const formData = new FormData()
  files.forEach(f => formData.append('images[]', f))
  return $api(`/pmc/catalog/items/${id}/gallery`, { method: 'POST', body: formData })
}

export function apiDeleteCatalogItemGalleryImage(id: number, imageId: number) {
  return $api(`/pmc/catalog/items/${id}/gallery/${imageId}`, { method: 'DELETE' })
}

// --- Image composable ---
export function useCatalogItemImage(
  itemId: MaybeRefOrGetter<number | undefined>,
  onSuccess: () => void | Promise<void>
) {
  const toast = useToast()
  const isImageLoading = ref(false)

  async function handleImageUpload(file: File) {
    const id = toValue(itemId)
    if (!id) return
    isImageLoading.value = true
    try {
      await apiUploadCatalogItemImage(id, file)
      toast.add({ title: 'Cập nhật ảnh thành công', color: 'success' })
      await onSuccess()
    } catch {
      toast.add({ title: 'Tải ảnh lên thất bại', color: 'error' })
    } finally {
      isImageLoading.value = false
    }
  }

  async function handleImageDelete() {
    const id = toValue(itemId)
    if (!id) return
    isImageLoading.value = true
    try {
      await apiDeleteCatalogItemImage(id)
      toast.add({ title: 'Xóa ảnh thành công', color: 'success' })
      await onSuccess()
    } catch {
      toast.add({ title: 'Xóa ảnh thất bại', color: 'error' })
    } finally {
      isImageLoading.value = false
    }
  }

  return { isImageLoading, handleImageUpload, handleImageDelete }
}

// --- Service Categories ---
export function useServiceCategoryList(params?: MaybeRefOrGetter<ServiceCategoriesIndexParams & { page?: number }>) {
  return useApiFetch<ServiceCategoriesIndex200>('/pmc/catalog/service-categories', {
    query: params,
    watch: params ? [params] : undefined
  })
}

export function useServiceCategoryDetail(id: MaybeRefOrGetter<number>) {
  return useApiFetch<ServiceCategoriesShow200>(
    computed(() => `/pmc/catalog/service-categories/${toValue(id)}`)
  )
}

export function apiCreateServiceCategory(data: CreateServiceCategoryRequest) {
  return $api<ServiceCategoriesStore201>('/pmc/catalog/service-categories', { method: 'POST', body: data })
}

export function apiUpdateServiceCategory(id: number, data: UpdateServiceCategoryRequest) {
  return $api<ServiceCategoriesUpdate200>(`/pmc/catalog/service-categories/${id}`, { method: 'PUT', body: data })
}

export function apiCheckDeleteServiceCategory(id: number) {
  return $api<ServiceCategoryCheckDelete200>(`/pmc/catalog/service-categories/${id}/check-delete`)
}

export function apiDeleteServiceCategory(id: number) {
  return $api<ServiceCategoriesDestroy200>(`/pmc/catalog/service-categories/${id}`, { method: 'DELETE' })
}

export function apiUploadServiceCategoryImage(id: number, file: File) {
  const formData = new FormData()
  formData.append('image', file)
  return $api(`/pmc/catalog/service-categories/${id}/image`, { method: 'POST', body: formData })
}

export function apiDeleteServiceCategoryImage(id: number) {
  return $api(`/pmc/catalog/service-categories/${id}/image`, { method: 'DELETE' })
}

export function useServiceCategoryImage(
  categoryId: MaybeRefOrGetter<number | undefined>,
  onSuccess: () => void | Promise<void>
) {
  const toast = useToast()
  const isImageLoading = ref(false)

  async function handleImageUpload(file: File) {
    const id = toValue(categoryId)
    if (!id) return
    isImageLoading.value = true
    try {
      await apiUploadServiceCategoryImage(id, file)
      toast.add({ title: 'Cập nhật ảnh thành công', color: 'success' })
      await onSuccess()
    } catch {
      toast.add({ title: 'Tải ảnh lên thất bại', color: 'error' })
    } finally {
      isImageLoading.value = false
    }
  }

  async function handleImageDelete() {
    const id = toValue(categoryId)
    if (!id) return
    isImageLoading.value = true
    try {
      await apiDeleteServiceCategoryImage(id)
      toast.add({ title: 'Xóa ảnh thành công', color: 'success' })
      await onSuccess()
    } catch {
      toast.add({ title: 'Xóa ảnh thất bại', color: 'error' })
    } finally {
      isImageLoading.value = false
    }
  }

  return { isImageLoading, handleImageUpload, handleImageDelete }
}

// --- Public Services (for /dich-vu page) ---
export function usePublicServices(params: Ref<PublicServiceIndexParams & { page?: number, per_page?: number } | undefined>) {
  return useApiFetch<PublicServiceIndex200>('/public/services', {
    query: params,
    immediate: params.value !== undefined
  })
}

export function usePublicServiceDetail(slug: MaybeRefOrGetter<string>) {
  return useApiFetch<PublicServiceShow200>(
    computed(() => `/public/services/${toValue(slug)}`),
    { watch: [() => toValue(slug)] }
  )
}
