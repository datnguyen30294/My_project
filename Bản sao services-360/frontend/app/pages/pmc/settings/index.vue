<script setup lang="ts">
definePageMeta({ layout: 'default' })

const toast = useToast()

// ─── Data loading ───
const { data, status, error, refresh } = useSettingsGroup('og_ticket')

const settings = computed(() => data.value?.data ?? {})

// ─── Form state ───
const form = reactive({
  sla_quote_minutes: '',
  sla_completion_minutes: ''
})
const formInitialized = ref(false)
const isSaving = ref(false)

watch(settings, (val) => {
  if (!val || formInitialized.value) return
  form.sla_quote_minutes = String(val.sla_quote_minutes ?? SLA_DEFAULTS.sla_quote_minutes)
  form.sla_completion_minutes = String(val.sla_completion_minutes ?? SLA_DEFAULTS.sla_completion_minutes)
  formInitialized.value = true
})

function hasChanges(): boolean {
  const current = settings.value
  const origQuote = current.sla_quote_minutes ?? SLA_DEFAULTS.sla_quote_minutes
  const origCompletion = current.sla_completion_minutes ?? SLA_DEFAULTS.sla_completion_minutes
  return form.sla_quote_minutes !== origQuote || form.sla_completion_minutes !== origCompletion
}

// ─── Validation ───
const validationErrors = computed<string[]>(() => {
  const errors: string[] = []
  const quote = parseInt(form.sla_quote_minutes, 10)
  const completion = parseInt(form.sla_completion_minutes, 10)

  if (isNaN(quote) || quote < 1) errors.push('SLA Báo giá phải lớn hơn 0 phút.')
  if (isNaN(completion) || completion < 1) errors.push('SLA Hoàn thành phải lớn hơn 0 phút.')

  return errors
})

// ─── Save ───
async function handleSave() {
  if (validationErrors.value.length > 0) return
  if (!hasChanges()) {
    toast.add({ title: 'Không có thay đổi.', color: 'neutral' })
    return
  }

  isSaving.value = true
  try {
    await apiSaveSettings('og_ticket', [
      { key: 'sla_quote_minutes', value: Number(form.sla_quote_minutes) },
      { key: 'sla_completion_minutes', value: Number(form.sla_completion_minutes) }
    ])
    toast.add({ title: 'Cập nhật cài đặt SLA thành công.', color: 'success' })
    await refresh()
    formInitialized.value = false
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Lưu cài đặt thất bại.'), color: 'error' })
  } finally {
    isSaving.value = false
  }
}

function handleReset() {
  formInitialized.value = false
  const current = settings.value
  form.sla_quote_minutes = String(current.sla_quote_minutes ?? SLA_DEFAULTS.sla_quote_minutes)
  form.sla_completion_minutes = String(current.sla_completion_minutes ?? SLA_DEFAULTS.sla_completion_minutes)
  formInitialized.value = true
}

useSeoMeta({ title: 'Cài đặt SLA' })
</script>

<template>
  <div class="flex flex-col gap-5 sm:gap-6">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <div class="min-w-0">
        <h1 class="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
          Cài đặt SLA
        </h1>
        <p class="text-slate-500 text-sm mt-0.5">
          Cấu hình thời gian cam kết xử lý mặc định cho OG Ticket.
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="status === 'pending'"
      class="flex flex-col gap-4"
    >
      <div
        v-for="i in 2"
        :key="i"
        class="h-40 bg-slate-100 rounded-xl animate-pulse"
      />
    </div>

    <!-- Error -->
    <SharedCrudPageError
      v-else-if="error"
      :error="error"
      :retry="refresh"
    />

    <!-- Form -->
    <div
      v-else
      class="flex flex-col gap-4 sm:gap-6"
    >
      <!-- Validation errors -->
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

      <!-- SLA Báo giá -->
      <SharedSectionCard title="SLA Báo giá">
        <div class="space-y-4">
          <UAlert
            icon="i-lucide-info"
            color="info"
            variant="subtle"
          >
            <template #description>
              Thời gian tối đa từ khi <span class="font-semibold">Tiếp nhận</span> ticket
              đến khi có <span class="font-semibold">Báo giá</span>.
              SLA được tính tự động khi ticket được nhận vào hệ thống.
            </template>
          </UAlert>

          <!-- Flow -->
          <div class="flex items-center gap-2 text-sm">
            <UBadge
              label="Tiếp nhận"
              color="info"
              variant="subtle"
            />
            <UIcon
              name="i-lucide-arrow-right"
              class="size-4 text-slate-400"
            />
            <span class="text-slate-400">...</span>
            <UIcon
              name="i-lucide-arrow-right"
              class="size-4 text-slate-400"
            />
            <UBadge
              label="Báo giá"
              color="primary"
              variant="subtle"
            />
          </div>

          <!-- Input -->
          <div class="max-w-sm">
            <UFormField
              label="Thời gian SLA (phút)"
              name="sla_quote_minutes"
              required
            >
              <UInput
                v-model="form.sla_quote_minutes"
                type="number"
                min="1"
                placeholder="60"
                :trailing-icon="form.sla_quote_minutes ? undefined : 'i-lucide-clock'"
              />
              <template #hint>
                <span
                  v-if="formatDurationMinutes(form.sla_quote_minutes)"
                  class="text-xs text-slate-500"
                >
                  = {{ formatDurationMinutes(form.sla_quote_minutes) }}
                </span>
              </template>
            </UFormField>
          </div>
        </div>
      </SharedSectionCard>

      <!-- SLA Hoàn thành -->
      <SharedSectionCard title="SLA Hoàn thành">
        <div class="space-y-4">
          <UAlert
            icon="i-lucide-info"
            color="success"
            variant="subtle"
          >
            <template #description>
              Thời gian tối đa từ khi cư dân <span class="font-semibold">Chấp thuận</span> báo giá
              đến khi đơn hàng <span class="font-semibold">Hoàn thành</span>.
              SLA được tính lại khi phát sinh vòng mới (backtrack).
            </template>
          </UAlert>

          <!-- Flow -->
          <div class="flex items-center gap-2 text-sm">
            <UBadge
              label="Chấp thuận"
              color="success"
              variant="subtle"
            />
            <UIcon
              name="i-lucide-arrow-right"
              class="size-4 text-slate-400"
            />
            <span class="text-slate-400">...</span>
            <UIcon
              name="i-lucide-arrow-right"
              class="size-4 text-slate-400"
            />
            <UBadge
              label="Hoàn thành"
              color="success"
              variant="subtle"
            />
          </div>

          <!-- Input -->
          <div class="max-w-sm">
            <UFormField
              label="Thời gian SLA (phút)"
              name="sla_completion_minutes"
              required
            >
              <UInput
                v-model="form.sla_completion_minutes"
                type="number"
                min="1"
                placeholder="1440"
                :trailing-icon="form.sla_completion_minutes ? undefined : 'i-lucide-clock'"
              />
              <template #hint>
                <span
                  v-if="formatDurationMinutes(form.sla_completion_minutes)"
                  class="text-xs text-slate-500"
                >
                  = {{ formatDurationMinutes(form.sla_completion_minutes) }}
                </span>
              </template>
            </UFormField>
          </div>
        </div>
      </SharedSectionCard>

      <!-- Actions (sticky bottom) -->
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
  </div>
</template>
