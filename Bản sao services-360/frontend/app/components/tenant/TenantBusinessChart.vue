<script setup lang="ts">
import type { TenantBusinessSummaryMonth } from '~/composables/api/useTenants'

interface Props {
  months: TenantBusinessSummaryMonth[]
}

const props = defineProps<Props>()

const points = computed(() =>
  props.months.map(m => ({
    label: m.label,
    bar: m.tenant_revenue,
    line: m.order_count,
    dash: m.platform_fee
  }))
)
</script>

<template>
  <SharedDualAxisChart
    :points="points"
    bar-label="Doanh thu"
    line-label="Số đơn"
    dash-label="Phí platform"
    line-unit=" đơn"
  />
</template>
