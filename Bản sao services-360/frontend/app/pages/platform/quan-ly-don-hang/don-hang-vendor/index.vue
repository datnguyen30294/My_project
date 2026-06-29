<script setup lang="ts">
definePageMeta({ layout: 'platform' })
useSeoMeta({ title: 'Đơn hàng vendor - Thần Nông' })
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-black text-slate-900 tracking-tight">
        Đơn hàng vendor
      </h1>
      <p class="text-slate-500 text-sm mt-1">
        Giám sát toàn bộ đơn cư dân đặt từ vendor trên sàn — gộp mọi vendor và mọi công ty vận hành. Màn hình đọc-chỉ.
      </p>
    </div>

    <VendorOrderConsoleTable />
  </div>
</template>
