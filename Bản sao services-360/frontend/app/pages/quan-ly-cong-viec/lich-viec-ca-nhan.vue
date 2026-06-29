<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const route = useRoute()

const selectedAccountId = ref<number | null>(
  route.query.accountId ? Number(route.query.accountId) : null
)

function clearSelection() {
  selectedAccountId.value = null
}
</script>

<template>
  <div class="space-y-4">
    <SharedCrudPageHeader
      title="Lịch việc cá nhân"
      description="Xem lịch đăng ký ca, dự án đang làm và ticket xử lý theo ngày"
    />

    <UCard :ui="{ body: 'p-0 sm:p-0' }">
      <template #header>
        <div class="flex flex-wrap items-end gap-4">
          <UFormField
            label="Nhân sự"
            class="min-w-[240px]"
          >
            <SharedAccountSelect
              :model-value="selectedAccountId"
              placeholder="Chọn nhân sự"
              @update:model-value="selectedAccountId = $event"
            />
          </UFormField>
          <UButton
            v-if="selectedAccountId"
            variant="subtle"
            size="sm"
            icon="i-lucide-x"
            class="mb-1"
            @click="clearSelection"
          >
            Bỏ chọn
          </UButton>
          <UButton
            v-if="selectedAccountId"
            variant="outline"
            size="sm"
            icon="i-lucide-user"
            class="mb-1"
            :to="`/pmc/accounts/${selectedAccountId}?tab=schedule`"
          >
            Chi tiết nhân sự
          </UButton>
        </div>
      </template>

      <div class="p-4 sm:p-6">
        <p
          v-if="!selectedAccountId"
          class="text-muted text-sm"
        >
          Chọn nhân sự để xem lịch ca đăng ký, dự án và ticket xử lý theo ngày.
        </p>

        <SharedAccountSchedulePanel
          v-else
          :account-id="selectedAccountId"
          show-account-summary
        />
      </div>
    </UCard>
  </div>
</template>
