<script setup lang="ts">
import type { CreatePartnerPayload, UpdatePartnerPayload } from '~/composables/api/usePartners'

definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()
const toast = useToast()
const id = computed(() => Number(route.params.id))

const { data, status, error } = useTenantPartnerDetail(id)
const vendor = computed(() => data.value?.data ?? null)

const { useDynamicLabel } = useBreadcrumb()
useDynamicLabel(computed(() => vendor.value?.display_name ?? vendor.value?.name ?? null))

useSeoMeta({
  title: computed(() => vendor.value
    ? `Sửa ${vendor.value.display_name ?? vendor.value.name}`
    : 'Chỉnh sửa vendor')
})

watch(error, (e) => {
  if (!e) return
  const apiErr = e as { data?: { error_code?: string }, status?: number, statusCode?: number }
  const status = apiErr?.status ?? apiErr?.statusCode
  if (status === 404) {
    toast.add({
      title: 'Không tìm thấy vendor',
      description: 'Vendor không tồn tại hoặc không thuộc tenant của bạn.',
      color: 'error'
    })
    router.replace('/pmc/vendors')
  } else if (status === 403 && apiErr?.data?.error_code === 'VENDOR_FEATURE_DISABLED') {
    toast.add({ title: 'Tenant chưa kích hoạt gói vendor', color: 'warning' })
    router.replace('/pmc/dashboard')
  }
})

// Vendor dùng chung (do Platform/tenant khác sở hữu) chỉ được gắn dự án và tạo
// hợp đồng — không cho sửa thông tin vendor. Chuyển về trang chi tiết.
watch(vendor, (v) => {
  if (v && !v.is_owned) {
    toast.add({
      title: 'Không thể chỉnh sửa vendor dùng chung',
      description: 'Vendor này không thuộc PMC của bạn. Bạn chỉ có thể gắn dự án và tạo hợp đồng hoa hồng.',
      color: 'warning',
      icon: 'i-lucide-shield-alert'
    })
    router.replace(`/pmc/vendors/${v.id}`)
  }
}, { immediate: true })

const isSubmitting = ref(false)
const apiErrors = ref<Record<string, string[]>>({})

async function handleSubmit(payload: CreatePartnerPayload) {
  if (!vendor.value) return
  isSubmitting.value = true
  apiErrors.value = {}
  try {
    const { slug: _slug, ...updatable } = payload
    void _slug
    await apiUpdateTenantPartner(vendor.value.id, updatable as UpdatePartnerPayload)
    // Invalidate the detail page's useFetch cache so the next mount fetches fresh data.
    clearTenantPartnerCache(vendor.value.id)
    toast.add({
      title: 'Cập nhật vendor thành công',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
    router.push(`/pmc/vendors/${vendor.value.id}`)
  } catch (err) {
    const validation = getApiValidationErrors(err)
    if (validation) {
      apiErrors.value = validation
    }
    toast.add({
      title: getApiErrorMessage(err, 'Cập nhật vendor thất bại'),
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div>
    <div class="mb-6 flex items-center gap-4">
      <UButton
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
        :to="vendor ? `/pmc/vendors/${vendor.id}` : '/pmc/vendors'"
        class="shrink-0"
      />
      <div>
        <h1 class="text-xl font-bold text-slate-900">
          Chỉnh sửa vendor
        </h1>
        <p class="text-sm text-slate-500 mt-0.5">
          Slug không thể đổi sau khi đăng ký.
        </p>
      </div>
    </div>

    <div
      v-if="status === 'pending' && !vendor"
      class="h-64 bg-slate-100 rounded-xl animate-pulse"
    />

    <UAlert
      v-else-if="error && !vendor"
      color="error"
      variant="subtle"
      icon="i-lucide-alert-circle"
      description="Không tải được thông tin vendor."
    />

    <VendorForm
      v-else-if="vendor"
      mode="edit"
      :item="vendor"
      :loading="isSubmitting"
      :api-errors="apiErrors"
      :cancel-to="`/pmc/vendors/${vendor.id}`"
      @submit="handleSubmit"
    />
  </div>
</template>
