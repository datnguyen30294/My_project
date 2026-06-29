<script setup lang="ts">
import { VIETNAM_BANKS, findBankByBin } from '~/utils/vietqr'

interface Props {
  open: boolean
  projectId: number
  initial: {
    bqt_bank_bin: string | null | undefined
    bqt_bank_name: string | null | undefined
    bqt_account_number: string | null | undefined
    bqt_account_holder: string | null | undefined
  } | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [boolean]
  'saved': []
}>()

const toast = useToast()

const form = reactive({
  bqt_bank_bin: '',
  bqt_account_number: '',
  bqt_account_holder: ''
})
const isSaving = ref(false)

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return
    form.bqt_bank_bin = props.initial?.bqt_bank_bin ?? ''
    form.bqt_account_number = props.initial?.bqt_account_number ?? ''
    form.bqt_account_holder = props.initial?.bqt_account_holder ?? ''
  }
)

const bankOptions = computed(() =>
  VIETNAM_BANKS.map(b => ({
    label: `${b.shortName} — ${b.name}`,
    value: b.bin
  }))
)

const validationErrors = computed<string[]>(() => {
  const errors: string[] = []
  const bin = form.bqt_bank_bin.trim()
  const num = form.bqt_account_number.trim()
  const holder = form.bqt_account_holder.trim()

  const anyFilled = !!bin || !!num || !!holder
  const allFilled = !!bin && !!num && !!holder

  if (anyFilled && !allFilled) {
    errors.push('Vui lòng điền đủ Ngân hàng + Số tài khoản + Tên chủ tài khoản, hoặc xoá trống cả ba.')
  }
  if (num && !/^\d+$/.test(num)) errors.push('Số tài khoản chỉ được chứa chữ số.')
  if (bin && !/^\d{6}$/.test(bin)) errors.push('Mã BIN ngân hàng không hợp lệ.')

  return errors
})

async function handleSave() {
  if (validationErrors.value.length > 0) return
  isSaving.value = true
  try {
    const bin = form.bqt_bank_bin.trim()
    const bank = bin ? findBankByBin(bin) : null

    await apiUpdateProject(props.projectId, {
      bqt_bank_bin: bin || null,
      bqt_bank_name: bank?.shortName ?? null,
      bqt_account_number: form.bqt_account_number.trim() || null,
      bqt_account_holder: form.bqt_account_holder.trim() || null
    })

    toast.add({ title: 'Đã lưu tài khoản BQT', color: 'success' })
    emit('saved')
    emit('update:open', false)
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Lưu thất bại'), color: 'error' })
  } finally {
    isSaving.value = false
  }
}

function handleClear() {
  form.bqt_bank_bin = ''
  form.bqt_account_number = ''
  form.bqt_account_holder = ''
}
</script>

<template>
  <UModal
    :open="open"
    title="Cài đặt tài khoản Ban quản trị"
    :ui="{ content: 'sm:max-w-lg' }"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <UAlert
          color="info"
          variant="subtle"
          icon="i-lucide-info"
          description="Thông tin STK này dùng để in QR chuyển khoản hoa hồng BQT trên trang Tổng hợp hoa hồng."
        />

        <UAlert
          v-if="validationErrors.length > 0"
          color="error"
          variant="subtle"
          icon="i-lucide-alert-triangle"
          title="Lỗi cấu hình"
        >
          <template #description>
            <ul class="list-disc pl-4 text-sm space-y-0.5">
              <li
                v-for="(e, i) in validationErrors"
                :key="i"
              >
                {{ e }}
              </li>
            </ul>
          </template>
        </UAlert>

        <UFormField
          label="Ngân hàng"
          name="bqt_bank_bin"
        >
          <USelectMenu
            v-model="form.bqt_bank_bin"
            :items="bankOptions"
            value-key="value"
            placeholder="Chọn ngân hàng"
            :search-input="{ placeholder: 'Tìm theo tên ngân hàng...' }"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Số tài khoản"
          name="bqt_account_number"
        >
          <UInput
            v-model="form.bqt_account_number"
            placeholder="Nhập số tài khoản"
            :maxlength="30"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Tên chủ tài khoản"
          name="bqt_account_holder"
          hint="Viết hoa không dấu (sẽ hiển thị trên app ngân hàng của người chuyển)"
        >
          <UInput
            v-model="form.bqt_account_holder"
            placeholder="VD: BAN QUAN TRI CHUNG CU X"
            :maxlength="100"
            class="w-full"
          />
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-between w-full">
        <UButton
          label="Xoá thông tin"
          color="error"
          variant="ghost"
          icon="i-lucide-eraser"
          @click="handleClear"
        />
        <div class="flex gap-2">
          <UButton
            label="Huỷ"
            color="neutral"
            variant="outline"
            @click="emit('update:open', false)"
          />
          <UButton
            label="Lưu"
            icon="i-lucide-save"
            :loading="isSaving"
            :disabled="validationErrors.length > 0"
            @click="handleSave"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>
