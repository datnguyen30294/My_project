import { o as useApiFetch, v as vueExports, j as useToast, $ as $api } from './server.mjs';
import { D as DEFAULT_PER_PAGE } from './constants-G9YmtWtp.mjs';

function useCatalogItemList(params) {
  return useApiFetch("/pmc/catalog/items", {
    query: params,
    watch: [params]
  });
}
function useCatalogItemDetail(id, options = {}) {
  return useApiFetch(
    vueExports.computed(() => `/pmc/catalog/items/${vueExports.toValue(id)}`),
    {
      watch: options.immediate === false ? false : [() => vueExports.toValue(id)],
      immediate: options.immediate ?? true
    }
  );
}
function useCatalogItemsByType(lineType, search = void 0) {
  const params = vueExports.computed(() => {
    const type = vueExports.toValue(lineType);
    if (!type) return null;
    const s = vueExports.toValue(search);
    return { type, search: s || void 0, per_page: DEFAULT_PER_PAGE, status: "active" };
  });
  return useApiFetch(
    "/pmc/catalog/items",
    {
      query: params,
      watch: [params],
      immediate: false
    }
  );
}
function apiCreateCatalogItem(data) {
  return $api("/pmc/catalog/items", { method: "POST", body: data });
}
function apiUpdateCatalogItem(id, data) {
  return $api(`/pmc/catalog/items/${id}`, { method: "PUT", body: data });
}
function apiDeleteCatalogItem(id) {
  return $api(`/pmc/catalog/items/${id}`, { method: "DELETE" });
}
function apiUploadCatalogItemImage(id, file) {
  const formData = new FormData();
  formData.append("image", file);
  return $api(`/pmc/catalog/items/${id}/image`, { method: "POST", body: formData });
}
function apiDeleteCatalogItemImage(id) {
  return $api(`/pmc/catalog/items/${id}/image`, { method: "DELETE" });
}
function apiUploadCatalogItemGallery(id, files) {
  const formData = new FormData();
  files.forEach((f) => formData.append("images[]", f));
  return $api(`/pmc/catalog/items/${id}/gallery`, { method: "POST", body: formData });
}
function apiDeleteCatalogItemGalleryImage(id, imageId) {
  return $api(`/pmc/catalog/items/${id}/gallery/${imageId}`, { method: "DELETE" });
}
function useCatalogItemImage(itemId, onSuccess) {
  const toast = useToast();
  const isImageLoading = vueExports.ref(false);
  async function handleImageUpload(file) {
    const id = vueExports.toValue(itemId);
    if (!id) return;
    isImageLoading.value = true;
    try {
      await apiUploadCatalogItemImage(id, file);
      toast.add({ title: "Cập nhật ảnh thành công", color: "success" });
      await onSuccess();
    } catch {
      toast.add({ title: "Tải ảnh lên thất bại", color: "error" });
    } finally {
      isImageLoading.value = false;
    }
  }
  async function handleImageDelete() {
    const id = vueExports.toValue(itemId);
    if (!id) return;
    isImageLoading.value = true;
    try {
      await apiDeleteCatalogItemImage(id);
      toast.add({ title: "Xóa ảnh thành công", color: "success" });
      await onSuccess();
    } catch {
      toast.add({ title: "Xóa ảnh thất bại", color: "error" });
    } finally {
      isImageLoading.value = false;
    }
  }
  return { isImageLoading, handleImageUpload, handleImageDelete };
}
function useServiceCategoryList(params) {
  return useApiFetch("/pmc/catalog/service-categories", {
    query: params,
    watch: params ? [params] : void 0
  });
}
function useServiceCategoryDetail(id) {
  return useApiFetch(
    vueExports.computed(() => `/pmc/catalog/service-categories/${vueExports.toValue(id)}`)
  );
}
function apiCreateServiceCategory(data) {
  return $api("/pmc/catalog/service-categories", { method: "POST", body: data });
}
function apiUpdateServiceCategory(id, data) {
  return $api(`/pmc/catalog/service-categories/${id}`, { method: "PUT", body: data });
}
function apiCheckDeleteServiceCategory(id) {
  return $api(`/pmc/catalog/service-categories/${id}/check-delete`);
}
function apiDeleteServiceCategory(id) {
  return $api(`/pmc/catalog/service-categories/${id}`, { method: "DELETE" });
}
function apiUploadServiceCategoryImage(id, file) {
  const formData = new FormData();
  formData.append("image", file);
  return $api(`/pmc/catalog/service-categories/${id}/image`, { method: "POST", body: formData });
}
function apiDeleteServiceCategoryImage(id) {
  return $api(`/pmc/catalog/service-categories/${id}/image`, { method: "DELETE" });
}
function useServiceCategoryImage(categoryId, onSuccess) {
  const toast = useToast();
  const isImageLoading = vueExports.ref(false);
  async function handleImageUpload(file) {
    const id = vueExports.toValue(categoryId);
    if (!id) return;
    isImageLoading.value = true;
    try {
      await apiUploadServiceCategoryImage(id, file);
      toast.add({ title: "Cập nhật ảnh thành công", color: "success" });
      await onSuccess();
    } catch {
      toast.add({ title: "Tải ảnh lên thất bại", color: "error" });
    } finally {
      isImageLoading.value = false;
    }
  }
  async function handleImageDelete() {
    const id = vueExports.toValue(categoryId);
    if (!id) return;
    isImageLoading.value = true;
    try {
      await apiDeleteServiceCategoryImage(id);
      toast.add({ title: "Xóa ảnh thành công", color: "success" });
      await onSuccess();
    } catch {
      toast.add({ title: "Xóa ảnh thất bại", color: "error" });
    } finally {
      isImageLoading.value = false;
    }
  }
  return { isImageLoading, handleImageUpload, handleImageDelete };
}
function usePublicServices(params) {
  return useApiFetch("/public/services", {
    query: params,
    immediate: params.value !== void 0
  });
}
function usePublicServiceDetail(slug) {
  return useApiFetch(
    vueExports.computed(() => `/public/services/${vueExports.toValue(slug)}`),
    { watch: [() => vueExports.toValue(slug)] }
  );
}

export { usePublicServiceDetail as a, useCatalogItemsByType as b, apiCreateCatalogItem as c, useServiceCategoryList as d, useCatalogItemImage as e, useCatalogItemDetail as f, apiDeleteCatalogItemGalleryImage as g, apiUploadCatalogItemGallery as h, apiUpdateCatalogItem as i, apiDeleteCatalogItem as j, useCatalogItemList as k, useServiceCategoryDetail as l, useServiceCategoryImage as m, apiUpdateServiceCategory as n, apiDeleteServiceCategory as o, apiCheckDeleteServiceCategory as p, apiCreateServiceCategory as q, usePublicServices as u };
//# sourceMappingURL=useCatalogItems-Db1MWi3b.mjs.map
