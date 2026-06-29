<script setup lang="ts">
definePageMeta({ layout: 'landing', auth: false })

const route = useRoute()
const token = computed(() => String(route.params.token))

const { data, status, error } = usePublicAcceptanceReport(token)

const report = computed(() => data.value?.data)
const contentHtml = computed(() => report.value?.content_html ?? '')

function handlePrint() {
  window.print()
}

useSeoMeta({ title: 'Biên bản nghiệm thu' })
</script>

<template>
  <div class="min-h-screen py-6 px-4">
    <div class="max-w-3xl mx-auto">
      <!-- Toolbar (ẩn khi in) -->
      <div class="acceptance-report-toolbar flex items-center justify-between gap-2 mb-4 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
        <div class="min-w-0">
          <h1 class="text-base font-semibold text-slate-900">
            Biên bản nghiệm thu
          </h1>
          <p class="text-xs text-slate-500">
            Xem và in biên bản để ký xác nhận.
          </p>
        </div>
        <UButton
          label="In"
          icon="i-lucide-printer"
          color="primary"
          size="sm"
          :disabled="status === 'pending' || !!error"
          @click="handlePrint"
        />
      </div>

      <!-- Loading -->
      <div
        v-if="status === 'pending'"
        class="space-y-3"
      >
        <div class="h-6 bg-slate-100 rounded animate-pulse" />
        <div class="h-96 bg-slate-100 rounded animate-pulse" />
      </div>

      <!-- Error -->
      <UAlert
        v-else-if="error"
        icon="i-lucide-alert-triangle"
        color="error"
        variant="subtle"
        title="Không tìm thấy biên bản"
      >
        <template #description>
          Đường dẫn không hợp lệ hoặc biên bản đã bị xoá.
        </template>
      </UAlert>

      <!-- View-only content -->
      <div
        v-else
        class="acceptance-report-body bg-white border border-slate-200 rounded-xl p-4 sm:p-8 shadow-sm"
      >
        <div
          class="acceptance-report-content prose prose-sm max-w-none"
          v-html="contentHtml"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
@media print {
  .acceptance-report-toolbar {
    display: none !important;
  }
  .acceptance-report-body {
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
  }
}
</style>
