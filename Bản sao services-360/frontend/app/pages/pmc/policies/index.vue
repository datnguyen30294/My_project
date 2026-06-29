<script setup lang="ts">
definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'Quản lý chính sách' })

const { data, status, error, refresh } = usePolicyList()

const policies = computed(() => data.value?.data ?? [])

const policyByType = computed(() =>
  Object.fromEntries(policies.value.map(p => [p.type.value, p]))
)

function getIcon(type: string): string {
  return type === POLICY_TYPES.TERMS_OF_SERVICE ? 'i-lucide-scale' : 'i-lucide-shield-check'
}
</script>

<template>
  <div class="flex flex-col gap-5 sm:gap-6">
    <SharedCrudPageHeader
      title="Quản lý chính sách"
      description="Quản lý điều khoản sử dụng và chính sách bảo mật."
    />

    <!-- Loading -->
    <div
      v-if="status === 'pending'"
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
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

    <!-- Policy cards -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <!-- Render all policy types, merging with existing data -->
      <NuxtLink
        v-for="pType in [POLICY_TYPES.TERMS_OF_SERVICE, POLICY_TYPES.PRIVACY_POLICY]"
        :key="pType"
        :to="`/pmc/policies/${pType}`"
        class="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow group"
      >
        <div class="flex items-start gap-4">
          <div class="p-3 rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors">
            <UIcon
              :name="getIcon(pType)"
              class="size-6 text-slate-700"
            />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-slate-900 text-lg">
              {{ POLICY_TYPE_LABELS[pType] }}
            </h3>
            <p class="text-sm text-slate-500 mt-1">
              {{ policyByType[pType]?.title || 'Chưa có nội dung' }}
            </p>
            <div class="flex items-center gap-3 mt-3">
              <UBadge
                :label="policyByType[pType]?.is_published ? 'Đã xuất bản' : 'Chưa xuất bản'"
                :color="policyByType[pType]?.is_published ? 'success' : 'neutral'"
                variant="subtle"
              />
              <span
                v-if="policyByType[pType]?.updated_at"
                class="text-xs text-slate-400"
              >
                Cập nhật: {{ new Date(policyByType[pType]!.updated_at!).toLocaleDateString('vi-VN') }}
              </span>
            </div>
          </div>
          <UIcon
            name="i-lucide-chevron-right"
            class="size-5 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0 mt-1"
          />
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
