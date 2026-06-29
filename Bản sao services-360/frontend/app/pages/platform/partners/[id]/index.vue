<script setup lang="ts">
// Chi tiết "Partner" cũ đã được gộp vào console "Quản lý Vendor".
// Giữ route để link/bookmark cũ không vỡ — tự chuyển hướng sang trang mới.
definePageMeta({
  layout: 'platform',
  redirect: to => `/platform/quan-ly-van-hanh/quan-ly-vendor/${to.params.id}`
})
</script>

<template>
  <div />
</template>
