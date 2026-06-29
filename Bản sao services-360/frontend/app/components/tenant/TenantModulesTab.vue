<script setup lang="ts">
import type { OrganizationDetailResource, UpdateTenantConfigRequest } from '~/composables/api/useTenants'
import { TENANT_MODULE_OPTIONS, apiUpdateTenantConfig } from '~/composables/api/useTenants'

interface Props {
  tenant: OrganizationDetailResource
}

const props = defineProps<Props>()

const emit = defineEmits<{
  updated: []
}>()

const toast = useToast()

type ModuleValue = NonNullable<UpdateTenantConfigRequest['enabled_modules']>[number]

const allModuleValues = TENANT_MODULE_OPTIONS.map(m => m.value)

/** Tenant cũ chưa cấu hình (enabled_modules = null) → coi như bật tất cả. */
const enabledModules = ref<ModuleValue[]>([])

watch(
  () => props.tenant,
  (tenant) => {
    const configured = tenant.config?.enabled_modules
    enabledModules.value = configured === null || configured === undefined
      ? [...allModuleValues]
      : configured.filter((m): m is ModuleValue => (allModuleValues as string[]).includes(m))
  },
  { immediate: true }
)

const savingModule = ref<ModuleValue | null>(null)

async function toggleModule(module: ModuleValue, enabled: boolean) {
  const previous = [...enabledModules.value]
  enabledModules.value = enabled
    ? [...enabledModules.value, module]
    : enabledModules.value.filter(m => m !== module)

  savingModule.value = module
  try {
    await apiUpdateTenantConfig(props.tenant.id, { enabled_modules: enabledModules.value })
    toast.add({
      title: enabled ? 'Đã bật module cho tenant' : 'Đã tắt module cho tenant',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
    emit('updated')
  } catch (err) {
    enabledModules.value = previous
    toast.add({
      title: getApiErrorMessage(err, 'Không thể cập nhật module'),
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  } finally {
    savingModule.value = null
  }
}
</script>

<template>
  <SharedSectionCard title="Quản lý dịch vụ">
    <p class="text-sm text-slate-500 mb-4">
      Bật/tắt module nghiệp vụ cho công ty vận hành. Thay đổi được lưu ngay khi gạt công tắc.
    </p>
    <div class="divide-y divide-slate-100">
      <div
        v-for="module in TENANT_MODULE_OPTIONS"
        :key="module.value"
        class="flex items-center gap-4 py-3.5"
      >
        <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-50">
          <UIcon
            :name="module.icon"
            class="size-5 text-primary"
          />
        </div>
        <div class="min-w-0 flex-1">
          <div class="font-medium text-slate-900">
            {{ module.label }}
          </div>
          <div class="text-sm text-slate-500">
            {{ module.description }}
          </div>
        </div>
        <USwitch
          :model-value="enabledModules.includes(module.value)"
          :disabled="savingModule !== null"
          :loading="savingModule === module.value"
          @update:model-value="(v: boolean) => toggleModule(module.value, v)"
        />
      </div>
    </div>
  </SharedSectionCard>
</template>
