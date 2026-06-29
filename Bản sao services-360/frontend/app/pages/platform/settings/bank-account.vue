<script setup lang="ts">
import { VIETNAM_BANKS, buildVietQrPayload, findBankByBin } from '~/utils/vietqr'

definePageMeta({ layout: 'platform' })
useSeoMeta({ title: 'Cài đặt tài khoản Platform' })

const toast = useToast()

const { data, status, error, refresh } = usePlatformSettingsGroup('bank_account')
const settings = computed(() => parseBankAccountSettings(data.value?.data))

const form = reactive({
  bank_bin: '',
  account_number: '',
  account_holder: ''
})
const formInitialized = ref(false)
const isSaving = ref(false)

function syncFormFromSettings(val: typeof settings.value) {
  form.bank_bin = val.bank_bin
  form.account_number = val.account_number
  form.account_holder = val.account_holder
  formInitialized.value = true
}

if (data.value?.data) {
  syncFormFromSettings(settings.value)
}

watch(
  () => data.value?.data,
  (val) => {
    if (!val || formInitialized.value) return
    syncFormFromSettings(parseBankAccountSettings(val))
  }
)

const bankOptions = computed(() =>
  VIETNAM_BANKS.map(b => ({
    label: `${b.shortName} — ${b.name}`,
    value: b.bin
  }))
)

const selectedBank = computed(() => findBankByBin(form.bank_bin))

const validationErrors = computed<string[]>(() => {
  const errors: string[] = []
  if (!form.bank_bin) errors.push('Vui lòng chọn ngân hàng.')
  if (!form.account_number.trim()) errors.push('Vui lòng nhập số tài khoản.')
  else if (!/^\d+$/.test(form.account_number.trim())) errors.push('Số tài khoản chỉ được chứa chữ số.')
  if (!form.account_holder.trim()) errors.push('Vui lòng nhập tên chủ tài khoản.')
  return errors
})

function hasChanges(): boolean {
  return form.bank_bin !== settings.value.bank_bin
    || form.account_number.trim() !== settings.value.account_number
    || form.account_holder.trim() !== settings.value.account_holder
}

const previewAmount = ref<number | null>(500000)

const previewPayload = computed(() => {
  if (validationErrors.value.length > 0) return ''
  return buildVietQrPayload({
    bankBin: form.bank_bin,
    accountNumber: form.account_number.trim(),
    amount: previewAmount.value,
    description: `TEST ${form.account_holder.trim()}`
  })
})

async function handleSave() {
  if (validationErrors.value.length > 0) return
  if (!hasChanges()) {
    toast.add({ title: 'Không có thay đổi.', color: 'neutral' })
    return
  }

  isSaving.value = true
  try {
    const bank = findBankByBin(form.bank_bin)
    await apiSavePlatformSettings('bank_account', [
      { key: 'bank_bin', value: form.bank_bin },
      { key: 'bank_name', value: bank?.shortName ?? '' },
      { key: 'account_number', value: form.account_number.trim() },
      { key: 'account_holder', value: form.account_holder.trim() }
    ])
    toast.add({ title: 'Đã lưu cài đặt tài khoản Platform.', color: 'success' })
    formInitialized.value = false
    await refresh()
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Lưu cài đặt thất bại.'), color: 'error' })
  } finally {
    isSaving.value = false
  }
}

function handleReset() {
  formInitialized.value = false
  form.bank_bin = settings.value.bank_bin
  form.account_number = settings.value.account_number
  form.account_holder = settings.value.account_holder
  formInitialized.value = true
}
</script>

<template>
  <div class="flex flex-col gap-5 sm:gap-6">
    <div class="flex items-center gap-3">
      <div class="min-w-0">
        <h1 class="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
          Tài khoản Platform
        </h1>
        <p class="text-slate-500 text-sm mt-0.5">
          STK này dùng để thu hoa hồng Platform từ các đơn hàng của tất cả công ty vận hành.
        </p>
      </div>
    </div>

    <div
      v-if="status === 'pending' && !data"
      class="flex flex-col gap-4"
    >
      <div
        v-for="i in 2"
        :key="i"
        class="h-40 bg-slate-100 rounded-xl animate-pulse"
      />
    </div>

    <SharedCrudPageError
      v-else-if="error"
      :error="error"
      :retry="refresh"
    />

    <div
      v-else
      class="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6"
    >
      <div class="lg:col-span-3 flex flex-col gap-4 sm:gap-6">
        <UAlert
          icon="i-lucide-info"
          color="info"
          variant="subtle"
          title="Thông tin STK Platform"
          description="Mã QR trên trang Tổng hợp hoa hồng (mục Platform) sẽ được tạo tự động từ tài khoản cấu hình tại đây."
        />

        <UAlert
          v-if="validationErrors.length > 0"
          icon="i-lucide-alert-triangle"
          color="error"
          variant="subtle"
          title="Lỗi cấu hình"
        >
          <template #description>
            <ul class="list-disc pl-4 text-sm space-y-0.5">
              <li
                v-for="(err, idx) in validationErrors"
                :key="idx"
              >
                {{ err }}
              </li>
            </ul>
          </template>
        </UAlert>

        <SharedSectionCard title="Thông tin tài khoản">
          <div class="flex flex-col gap-4">
            <UFormField
              label="Ngân hàng"
              name="bank_bin"
              required
            >
              <USelectMenu
                v-model="form.bank_bin"
                :items="bankOptions"
                value-key="value"
                placeholder="Chọn ngân hàng"
                :search-input="{ placeholder: 'Tìm theo tên ngân hàng...' }"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Số tài khoản"
              name="account_number"
              required
            >
              <UInput
                v-model="form.account_number"
                placeholder="Nhập số tài khoản"
                :maxlength="30"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Tên chủ tài khoản"
              name="account_holder"
              required
              hint="Viết hoa không dấu (sẽ hiển thị trên app ngân hàng của người chuyển)"
            >
              <UInput
                v-model="form.account_holder"
                placeholder="Ví dụ: CONG TY TNHH PLATFORM"
                :maxlength="100"
                class="w-full"
              />
            </UFormField>
          </div>
        </SharedSectionCard>

        <div class="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 flex items-center justify-end gap-3 z-10">
          <UButton
            label="Đặt lại"
            color="neutral"
            variant="ghost"
            :disabled="!hasChanges() || isSaving"
            @click="handleReset"
          />
          <UButton
            label="Lưu cài đặt"
            icon="i-lucide-save"
            color="primary"
            :loading="isSaving"
            :disabled="validationErrors.length > 0 || !hasChanges()"
            @click="handleSave"
          />
        </div>
      </div>

      <div class="lg:col-span-2">
        <SharedSectionCard title="Xem trước mã QR">
          <div class="flex flex-col gap-4 items-center">
            <div class="w-full">
              <UFormField label="Số tiền xem trước (đ)">
                <SharedNumberInput
                  v-model="previewAmount"
                  placeholder="Nhập số tiền để xem trước"
                  :min="0"
                  class="w-full"
                />
              </UFormField>
            </div>

            <SharedQrCode
              v-if="previewPayload"
              :value="previewPayload"
              :size="220"
              file-name="vietqr-platform-preview.png"
            />
            <div
              v-else
              class="flex items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 w-[220px] h-[220px] text-center px-4"
            >
              <p class="text-xs text-slate-400">
                Điền đầy đủ thông tin tài khoản để xem mã QR.
              </p>
            </div>

            <div
              v-if="selectedBank && form.account_number"
              class="w-full text-center text-sm text-slate-600 space-y-0.5"
            >
              <p class="font-semibold">
                {{ selectedBank.shortName }}
              </p>
              <p class="font-mono">
                {{ form.account_number }}
              </p>
              <p class="uppercase">
                {{ form.account_holder || '—' }}
              </p>
            </div>
          </div>
        </SharedSectionCard>
      </div>
    </div>
  </div>
</template>
