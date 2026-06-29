<script setup lang="ts">
interface Props {
  partnerId: number | string
}

const props = defineProps<Props>()

// Tab "Đơn hàng" trên trang chi tiết vendor = console đơn vendor khoá vào 1 vendor:
// hiển thị MỌI đơn (mọi trạng thái) giống màn hình "Đơn hàng vendor" gộp.
const lockedPartnerId = computed(() => Number(props.partnerId))
</script>

<template>
  <VendorOrderConsoleTable :locked-partner-id="lockedPartnerId" />
</template>
