<script setup lang="ts">
import type { ContractDetail } from '~/composables/api/usePartnerCommissionContracts'
import {
  apiCancelPlatformContract,
  apiCancelTenantContract,
  apiDeletePlatformContractDraft,
  apiDeleteTenantContractDraft,
  apiRevokePlatformContract,
  apiRevokeTenantContract,
  apiSignPlatformContract,
  apiSignTenantContract,
  apiSwitchTenantContract,
  apiUpdatePlatformContractNotes,
  apiUpdateTenantContractNotes,
  usePlatformContractDetail,
  useTenantContractDetail
} from '~/composables/api/usePartnerCommissionContracts'

interface Props {
  open: boolean
  contractId: number | null
  scope?: 'tenant' | 'platform'
}

const props = withDefaults(defineProps<Props>(), { scope: 'tenant' })

const isPlatform = computed(() => props.scope === 'platform')

const emit = defineEmits<{
  'update:open': [value: boolean]
  /** Fired after any state change so the parent panel can reload its lists. */
  'changed': []
  /** Request to edit this draft contract in the form drawer. */
  'edit': [contract: ContractDetail]
}>()

const toast = useToast()
const idRef = computed(() => props.contractId)

const detailFetch = isPlatform.value
  ? usePlatformContractDetail(idRef)
  : useTenantContractDetail(idRef)
const { data, status, error, execute, refresh } = detailFetch
const contract = computed<ContractDetail | null>(() => data.value?.data ?? null)
const statusValue = computed(() => contract.value?.status.value ?? null)

watch(() => [props.open, props.contractId], async ([open, id]) => {
  if (open && id) {
    await execute()
  }
}, { immediate: true })

function close(): void {
  emit('update:open', false)
}

async function afterChange(): Promise<void> {
  await refresh()
  emit('changed')
}

// ─── Edit notes ────────────────────────────────────────────────

const showNotesModal = ref(false)
const notesDraft = reactive({ contract_code: '', notes: '' })
const isNotesSaving = ref(false)
const notesErrors = ref<Record<string, string[]>>({})

function openNotesModal(): void {
  if (!contract.value) return
  notesDraft.contract_code = contract.value.contract_code ?? ''
  notesDraft.notes = contract.value.notes ?? ''
  notesErrors.value = {}
  showNotesModal.value = true
}

async function saveNotes(): Promise<void> {
  if (!contract.value) return
  isNotesSaving.value = true
  notesErrors.value = {}
  try {
    await (isPlatform.value ? apiUpdatePlatformContractNotes : apiUpdateTenantContractNotes)(
      contract.value.id,
      {
        contract_code: notesDraft.contract_code,
        notes: notesDraft.notes
      }
    )
    toast.add({ title: 'Đã cập nhật', color: 'success', icon: 'i-lucide-check-circle' })
    showNotesModal.value = false
    await afterChange()
  } catch (err) {
    const errs = getApiValidationErrors(err)
    if (errs) {
      notesErrors.value = errs
    } else {
      toast.add({
        title: getApiErrorMessage(err, 'Cập nhật thất bại'),
        color: 'error',
        icon: 'i-lucide-alert-circle'
      })
    }
  } finally {
    isNotesSaving.value = false
  }
}

// ─── Sign ──────────────────────────────────────────────────────

const showSignModal = ref(false)
const isSigning = ref(false)

async function handleSign(): Promise<void> {
  if (!contract.value) return
  isSigning.value = true
  try {
    await (isPlatform.value ? apiSignPlatformContract : apiSignTenantContract)(contract.value.id)
    toast.add({ title: 'Đã ký hợp đồng', color: 'success', icon: 'i-lucide-file-signature' })
    showSignModal.value = false
    await afterChange()
  } catch (err) {
    toast.add({
      title: getApiErrorMessage(err, 'Ký hợp đồng thất bại'),
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  } finally {
    isSigning.value = false
  }
}

// ─── Revoke (pending) ──────────────────────────────────────────

const showRevokeModal = ref(false)
const isRevoking = ref(false)

async function handleRevoke(reason: string): Promise<void> {
  if (!contract.value) return
  isRevoking.value = true
  try {
    await (isPlatform.value ? apiRevokePlatformContract : apiRevokeTenantContract)(contract.value.id, reason)
    toast.add({ title: 'Đã thu hồi hợp đồng', color: 'success' })
    showRevokeModal.value = false
    await afterChange()
  } catch (err) {
    toast.add({
      title: getApiErrorMessage(err, 'Thu hồi thất bại'),
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  } finally {
    isRevoking.value = false
  }
}

// ─── Switch (activate pending) ─────────────────────────────────

const showSwitchModal = ref(false)
const isSwitching = ref(false)

async function handleSwitch(): Promise<void> {
  if (!contract.value) return
  isSwitching.value = true
  try {
    await apiSwitchTenantContract(contract.value.id)
    toast.add({ title: 'Đã kích hoạt hợp đồng', color: 'success' })
    showSwitchModal.value = false
    await afterChange()
  } catch (err) {
    toast.add({
      title: getApiErrorMessage(err, 'Kích hoạt thất bại'),
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  } finally {
    isSwitching.value = false
  }
}

// ─── Cancel (active) ───────────────────────────────────────────

const showCancelModal = ref(false)
const isCancelling = ref(false)

async function handleCancel(reason: string): Promise<void> {
  if (!contract.value) return
  isCancelling.value = true
  try {
    await (isPlatform.value ? apiCancelPlatformContract : apiCancelTenantContract)(contract.value.id, reason)
    toast.add({ title: 'Đã huỷ hợp đồng', color: 'success' })
    showCancelModal.value = false
    await afterChange()
  } catch (err) {
    toast.add({
      title: getApiErrorMessage(err, 'Huỷ hợp đồng thất bại'),
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  } finally {
    isCancelling.value = false
  }
}

// ─── Delete draft ──────────────────────────────────────────────

const showDeleteModal = ref(false)
const isDeleting = ref(false)

async function handleDelete(): Promise<void> {
  if (!contract.value) return
  isDeleting.value = true
  try {
    await (isPlatform.value ? apiDeletePlatformContractDraft : apiDeleteTenantContractDraft)(contract.value.id)
    toast.add({ title: 'Đã xoá nháp hợp đồng', color: 'success' })
    showDeleteModal.value = false
    emit('changed')
    close()
  } catch (err) {
    toast.add({
      title: getApiErrorMessage(err, 'Xoá thất bại'),
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
    showDeleteModal.value = false
  } finally {
    isDeleting.value = false
  }
}

function requestEdit(): void {
  if (contract.value) emit('edit', contract.value)
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
        <div class="flex items-start justify-between gap-3 p-4 border-b border-slate-200">
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 flex-wrap">
              <h2 class="text-lg font-black text-slate-900 font-mono">
                {{ contract?.contract_code ?? 'Đang tải...' }}
              </h2>
              <PartnerCommissionContractStatusBadge
                v-if="contract"
                :status="contract.status"
              />
              <PartnerCommissionContractModeBadge
                v-if="contract"
                :mode="contract.commission_mode"
              />
            </div>
          </div>
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            aria-label="Đóng"
            @click="close"
          />
        </div>

        <!-- Action bar -->
        <div
          v-if="contract"
          class="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50"
        >
          <UButton
            v-if="statusValue === 'draft'"
            icon="i-lucide-pencil"
            label="Sửa nháp"
            color="primary"
            variant="soft"
            size="sm"
            @click="requestEdit"
          />
          <UButton
            v-if="statusValue === 'draft'"
            icon="i-lucide-file-signature"
            label="Ký hợp đồng"
            color="primary"
            size="sm"
            @click="showSignModal = true"
          />
          <UButton
            v-if="statusValue === 'draft'"
            icon="i-lucide-trash-2"
            color="error"
            variant="soft"
            size="sm"
            aria-label="Xoá nháp"
            @click="showDeleteModal = true"
          />
          <UButton
            v-if="statusValue === 'pending'"
            icon="i-lucide-pencil"
            label="Sửa ghi chú"
            color="primary"
            variant="soft"
            size="sm"
            @click="openNotesModal"
          />
          <UButton
            v-if="statusValue === 'pending' && !isPlatform"
            icon="i-lucide-power"
            label="Kích hoạt"
            color="success"
            size="sm"
            @click="showSwitchModal = true"
          />
          <UButton
            v-if="statusValue === 'pending'"
            icon="i-lucide-undo-2"
            label="Thu hồi"
            color="warning"
            variant="soft"
            size="sm"
            @click="showRevokeModal = true"
          />
          <UButton
            v-if="statusValue === 'active'"
            icon="i-lucide-x-circle"
            label="Huỷ hợp đồng"
            color="error"
            variant="soft"
            size="sm"
            @click="showCancelModal = true"
          />
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto p-4 space-y-5">
          <div
            v-if="status === 'pending' && !contract"
            class="space-y-4"
          >
            <div class="h-20 bg-slate-100 rounded-xl animate-pulse" />
            <div class="h-48 bg-slate-100 rounded-xl animate-pulse" />
          </div>

          <UAlert
            v-else-if="error && !contract"
            color="error"
            variant="subtle"
            icon="i-lucide-alert-circle"
            description="Không thể tải chi tiết hợp đồng."
          />

          <template v-else-if="contract">
            <UAlert
              v-if="statusValue === 'pending'"
              color="warning"
              variant="subtle"
              icon="i-lucide-clock"
              title="Hợp đồng chờ kích hoạt"
              :description="isPlatform
                ? 'Hợp đồng đã ký, đang chờ tenant kích hoạt ở phía PMC. Điều khoản tài chính không còn sửa được.'
                : 'Bấm \'Kích hoạt\' để gắn hợp đồng này vào vendor. Hợp đồng đang active hiện tại (nếu có) sẽ tự động chuyển sang trạng thái \'Đã bị thay thế\'.'"
            />
            <UAlert
              v-else-if="statusValue === 'active'"
              color="success"
              variant="subtle"
              icon="i-lucide-check-circle"
              title="Hợp đồng đang hiệu lực"
              description="Vendor đang nhận đơn theo điều khoản này. Để dừng nhận đơn, hãy huỷ hợp đồng."
            />
            <UAlert
              v-else-if="statusValue === 'replaced'"
              color="neutral"
              variant="subtle"
              icon="i-lucide-arrow-right-left"
              title="Đã bị thay thế"
              :description="contract.replaced_by_contract_id
                ? `Hợp đồng này đã bị thay thế bởi hợp đồng #${contract.replaced_by_contract_id}.`
                : 'Hợp đồng này đã bị thay thế.'"
            />
            <UAlert
              v-else-if="statusValue === 'cancelled' || statusValue === 'revoked' || statusValue === 'expired'"
              color="neutral"
              variant="subtle"
              icon="i-lucide-x-circle"
              :title="contract.status.label"
              description="Hợp đồng đã kết thúc và không thể tái sử dụng. Đơn cũ vẫn giữ snapshot riêng."
            />

            <SharedSectionCard title="Vendor & Phạm vi">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <SharedFieldDisplay label="Vendor">
                  <span class="font-medium">{{ contract.partner?.name ?? `#${contract.partner_id}` }}</span>
                  <p
                    v-if="contract.partner?.slug"
                    class="text-xs text-slate-500 font-mono"
                  >
                    {{ contract.partner.slug }}
                  </p>
                </SharedFieldDisplay>
                <SharedFieldDisplay label="Tenant">
                  <span v-if="contract.tenant_name">{{ contract.tenant_name }}</span>
                  <span class="text-xs text-slate-500 font-mono block">{{ contract.tenant_id }}</span>
                </SharedFieldDisplay>
                <SharedFieldDisplay label="Dự án">
                  {{ contract.project_name ?? `#${contract.project_id}` }}
                </SharedFieldDisplay>
              </div>
            </SharedSectionCard>

            <SharedSectionCard title="Loại & Điều khoản">
              <div class="mb-4 flex items-center gap-2 flex-wrap">
                <PartnerCommissionContractModeBadge
                  :mode="contract.commission_mode"
                  size="md"
                />
                <UBadge
                  color="info"
                  variant="subtle"
                  :label="`Doanh thu: ${contract.revenue_recipient.label}`"
                  icon="i-lucide-wallet"
                />
              </div>
              <PartnerCommissionContractTermsViewer
                :mode="contract.commission_mode.value"
                :terms="contract.terms"
              />
            </SharedSectionCard>

            <SharedSectionCard title="Hiệu lực">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <SharedFieldDisplay label="Ngày bắt đầu">
                  {{ contract.starts_at ? formatDate(contract.starts_at) : '—' }}
                </SharedFieldDisplay>
                <SharedFieldDisplay label="Ngày kết thúc">
                  {{ contract.ends_at ? formatDate(contract.ends_at) : 'Không thời hạn' }}
                </SharedFieldDisplay>
                <SharedFieldDisplay label="Ngày kích hoạt">
                  {{ contract.activated_at ? formatDateTime(contract.activated_at) : '—' }}
                </SharedFieldDisplay>
              </div>
            </SharedSectionCard>

            <SharedSectionCard
              v-if="contract.notes"
              title="Ghi chú"
            >
              <p class="whitespace-pre-line text-slate-700">
                {{ contract.notes }}
              </p>
            </SharedSectionCard>

            <SharedSectionCard title="Lịch sử trạng thái">
              <PartnerCommissionContractTimeline :contract="contract" />
            </SharedSectionCard>
          </template>
        </div>
      </div>
    </template>
  </UDrawer>

  <PartnerCommissionContractSignModal
    v-model:open="showSignModal"
    :contract="contract"
    :loading="isSigning"
    @confirm="handleSign"
  />

  <PartnerCommissionContractSwitchModal
    v-if="!isPlatform"
    v-model:open="showSwitchModal"
    :current="null"
    :target="contract"
    :loading="isSwitching"
    @confirm="handleSwitch"
  />

  <PartnerCommissionContractReasonModal
    v-model:open="showRevokeModal"
    title="Thu hồi hợp đồng"
    confirm-label="Xác nhận thu hồi"
    confirm-color="warning"
    warning="Hợp đồng pending sẽ bị thu hồi và không thể kích hoạt nữa."
    help-text="Lý do thu hồi (sẽ lưu lại để audit)."
    :loading="isRevoking"
    @confirm="handleRevoke"
  />

  <PartnerCommissionContractReasonModal
    v-model:open="showCancelModal"
    title="Huỷ hợp đồng đang hiệu lực"
    confirm-label="Xác nhận huỷ"
    confirm-color="error"
    :warning="contract?.commission_mode.value === 'subscription'
      ? 'Sau khi huỷ, vendor ngừng nhận đơn ngay lập tức. Hợp đồng thuê bao — kỳ thanh toán hiện tại sẽ không được hoàn lại.'
      : 'Sau khi huỷ, vendor SẼ NGAY LẬP TỨC không nhận được đơn mới ở dự án này.'"
    help-text="Lý do huỷ (sẽ lưu lại để audit)."
    :loading="isCancelling"
    @confirm="handleCancel"
  />

  <SharedCrudDeleteModal
    v-model:open="showDeleteModal"
    title="Xoá nháp hợp đồng"
    :item-name="contract?.contract_code ?? undefined"
    :loading="isDeleting"
    description="Hợp đồng nháp sẽ bị xoá vĩnh viễn."
    @confirm="handleDelete"
  />

  <UModal
    v-model:open="showNotesModal"
    title="Sửa thông tin hợp đồng"
  >
    <template #body>
      <div class="space-y-4">
        <UAlert
          color="warning"
          variant="subtle"
          icon="i-lucide-info"
          description="Hợp đồng đã ký — chỉ sửa được mã hợp đồng và ghi chú. Để thay đổi điều khoản, vui lòng thu hồi hợp đồng này và tạo nháp mới."
        />
        <UFormField
          label="Mã hợp đồng"
          :error="notesErrors.contract_code?.[0]"
        >
          <UInput v-model="notesDraft.contract_code" />
        </UFormField>
        <UFormField
          label="Ghi chú"
          :error="notesErrors.notes?.[0]"
        >
          <UTextarea
            v-model="notesDraft.notes"
            :rows="4"
            :maxlength="2000"
            class="w-full"
          />
        </UFormField>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          color="neutral"
          variant="outline"
          label="Huỷ"
          @click="showNotesModal = false"
        />
        <UButton
          color="primary"
          :label="isNotesSaving ? 'Đang lưu...' : 'Lưu thay đổi'"
          :loading="isNotesSaving"
          :disabled="isNotesSaving"
          @click="saveNotes"
        />
      </div>
    </template>
  </UModal>
</template>
