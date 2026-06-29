<script setup lang="ts">
import type {
  ContractDetail,
  CreateContractDraftPayload
} from '~/composables/api/usePartnerCommissionContracts'
import {
  apiCreatePlatformContract,
  apiCreateTenantContract,
  apiSignPlatformContract,
  apiSignTenantContract,
  apiUpdatePlatformContractDraft,
  apiUpdateTenantContractDraft
} from '~/composables/api/usePartnerCommissionContracts'

interface Props {
  open: boolean
  partnerId: number | string
  /** Required in tenant scope; optional in platform scope (chosen in form). */
  projectId?: number | string
  /** When provided → edit mode (only draft contracts can be edited). */
  contract?: ContractDetail | null
  scope?: 'tenant' | 'platform'
}

const props = withDefaults(defineProps<Props>(), {
  projectId: undefined,
  contract: null,
  scope: 'tenant'
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  'saved': []
}>()

const toast = useToast()
const { tenantSubdomain } = useAppContext()

const isPlatform = computed(() => props.scope === 'platform')
const isEdit = computed(() => props.contract !== null)

const draft = ref<CreateContractDraftPayload>(emptyContractDraft())
const apiErrors = ref<Record<string, string[]>>({})
const isSubmitting = ref(false)
const showSignAfter = ref(false)

function hydrate(): void {
  apiErrors.value = {}
  if (props.contract) {
    draft.value = contractDraftFromDetail(props.contract)
    return
  }
  const fresh = emptyContractDraft()
  fresh.partner_id = Number(props.partnerId)
  if (isPlatform.value) {
    fresh.tenant_id = ''
    fresh.project_id = 0
  } else {
    fresh.tenant_id = tenantSubdomain.value ?? ''
    fresh.project_id = Number(props.projectId ?? 0)
  }
  draft.value = fresh
}

watch(() => props.open, (open) => {
  if (open) hydrate()
}, { immediate: true })

async function save(thenSign: boolean): Promise<void> {
  apiErrors.value = {}
  isSubmitting.value = true
  showSignAfter.value = thenSign
  try {
    let id: number
    if (props.contract) {
      await (isPlatform.value
        ? apiUpdatePlatformContractDraft(props.contract.id, draft.value)
        : apiUpdateTenantContractDraft(props.contract.id, draft.value))
      id = props.contract.id
    } else {
      const res = await (isPlatform.value
        ? apiCreatePlatformContract(draft.value)
        : apiCreateTenantContract(draft.value))
      id = res.data.id
    }

    if (thenSign) {
      await (isPlatform.value ? apiSignPlatformContract(id) : apiSignTenantContract(id))
      toast.add({
        title: isEdit.value ? 'Đã lưu và ký hợp đồng' : 'Tạo và ký hợp đồng thành công',
        color: 'success',
        icon: 'i-lucide-check-circle'
      })
    } else {
      toast.add({
        title: 'Đã lưu nháp hợp đồng',
        color: 'success',
        icon: 'i-lucide-check-circle'
      })
    }

    emit('saved')
    emit('update:open', false)
  } catch (err) {
    const errs = getApiValidationErrors(err)
    if (errs) {
      apiErrors.value = errs
      toast.add({
        title: 'Dữ liệu chưa hợp lệ',
        description: 'Vui lòng kiểm tra các ô bị đỏ.',
        color: 'error',
        icon: 'i-lucide-alert-circle'
      })
    } else {
      toast.add({
        title: getApiErrorMessage(err, 'Lưu nháp thất bại'),
        color: 'error',
        icon: 'i-lucide-alert-circle'
      })
    }
  } finally {
    isSubmitting.value = false
    showSignAfter.value = false
  }
}
</script>

<template>
  <UDrawer
    :open="open"
    direction="right"
    @update:open="(v: boolean) => emit('update:open', v)"
  >
    <template #content>
      <div class="w-screen max-w-3xl h-full flex flex-col bg-white">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-slate-200">
          <div>
            <h2 class="text-lg font-bold text-slate-900">
              {{ isEdit ? 'Sửa nháp hợp đồng' : 'Tạo nháp hợp đồng hoa hồng' }}
            </h2>
            <p class="text-sm text-slate-500 mt-0.5">
              {{ isEdit
                ? 'Chỉnh sửa bản nháp. Sau khi ký không sửa được điều khoản.'
                : 'Tạo bản nháp cho vendor × dự án. Sau khi ký không sửa được điều khoản.' }}
            </p>
          </div>
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            aria-label="Đóng"
            :disabled="isSubmitting"
            @click="emit('update:open', false)"
          />
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto p-4">
          <PartnerCommissionContractDraftForm
            v-model="draft"
            :api-errors="apiErrors"
            :submitting="isSubmitting"
            :scope="scope"
            :current-tenant-id="isPlatform ? '' : (tenantSubdomain ?? '')"
          />
        </div>

        <!-- Footer -->
        <div class="flex justify-end gap-3 p-4 border-t border-slate-200">
          <UButton
            label="Huỷ"
            color="neutral"
            variant="outline"
            :disabled="isSubmitting"
            @click="emit('update:open', false)"
          />
          <UButton
            label="Lưu nháp"
            color="primary"
            variant="outline"
            icon="i-lucide-save"
            :loading="isSubmitting && !showSignAfter"
            :disabled="isSubmitting"
            @click="save(false)"
          />
          <UButton
            label="Lưu & Ký"
            color="primary"
            icon="i-lucide-file-signature"
            :loading="isSubmitting && showSignAfter"
            :disabled="isSubmitting"
            @click="save(true)"
          />
        </div>
      </div>
    </template>
  </UDrawer>
</template>
