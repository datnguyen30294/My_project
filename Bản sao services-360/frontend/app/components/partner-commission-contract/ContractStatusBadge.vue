<script setup lang="ts">
import type { ContractStatusOption } from '~/composables/api/usePartnerCommissionContracts'

interface Props {
  status: ContractStatusOption
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'sm'
})

const color = computed(() => statusBadgeColor(props.status.value))
</script>

<template>
  <UBadge
    :color="color"
    variant="subtle"
    :label="status.label"
    :size="size"
  />
</template>
