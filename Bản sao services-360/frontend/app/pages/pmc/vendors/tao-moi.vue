<script setup lang="ts">
import type { CreatePartnerPayload } from '~/composables/api/usePartners'

definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'Đăng ký vendor - Thần Nông' })

const router = useRouter()
const toast = useToast()

// ─── Mode: tạo mới vendor vs thêm vendor có sẵn từ catalog ──
type VendorCreateMode = 'create' | 'catalog'
const mode = ref<VendorCreateMode>('create')
const modeItems = [
  { value: 'create' as VendorCreateMode, label: 'Tạo vendor mới', icon: 'i-lucide-plus' },
  { value: 'catalog' as VendorCreateMode, label: 'Thêm vendor có sẵn', icon: 'i-lucide-library' }
]

function onAttached(vendorId: number) {
  router.push(`/pmc/vendors/${vendorId}`)
}

const isSubmitting = ref(false)
const apiErrors = ref<Record<string, string[]>>({})

async function handleSubmit(payload: CreatePartnerPayload) {
  isSubmitting.value = true
  apiErrors.value = {}
  try {
    const res = await apiCreateTenantPartner(payload)
    const provisioned = res.data.is_provisioned
    toast.add({
      title: 'Đăng ký vendor thành công',
      description: provisioned
        ? 'Shop đã sẵn sàng trên resi_mart.'
        : 'Hệ thống đang kích hoạt shop, có thể mất vài phút. Trạng thái sẽ tự cập nhật khi hoàn tất.',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
    router.push('/pmc/vendors')
  } catch (err) {
    const validation = getApiValidationErrors(err)
    if (validation) {
      apiErrors.value = validation
    }
    toast.add({
      title: getApiErrorMessage(err, 'Đăng ký vendor thất bại'),
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
        to="/pmc/vendors"
        class="shrink-0"
      />
      <div>
        <h1 class="text-xl font-bold text-slate-900">
          Thêm vendor
        </h1>
        <p class="text-sm text-slate-500 mt-0.5">
          Tạo vendor mới để bán trên marketplace, hoặc thêm vendor đã có sẵn trên hệ thống vào dự án của bạn.
        </p>
      </div>
    </div>

    <UTabs
      v-model="mode"
      :items="modeItems"
      variant="link"
      :content="false"
      class="mb-6"
    />

    <VendorForm
      v-if="mode === 'create'"
      mode="create"
      :loading="isSubmitting"
      :api-errors="apiErrors"
      cancel-to="/pmc/vendors"
      submit-label="Đăng ký vendor"
      @submit="handleSubmit"
    />

    <VendorCatalogPicker
      v-else
      @attached="onAttached"
    />
  </div>
</template>
