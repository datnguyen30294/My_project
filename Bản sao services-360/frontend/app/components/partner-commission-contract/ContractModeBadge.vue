<script setup lang="ts">
import type { EnumOption, CommissionModeValue } from '~/composables/api/usePartnerCommissionContracts'

interface Props {
  mode: EnumOption<CommissionModeValue>
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  size: 'sm'
})
</script>

<template>
  <UBadge
    color="info"
    variant="subtle"
    :label="mode.label"
    :size="size"
  />
</template>
