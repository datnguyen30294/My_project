<script setup lang="ts">
definePageMeta({ layout: 'platform' })
useSeoMeta({ title: 'Đơn hàng OG - Thần Nông' })
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-black text-slate-900 tracking-tight">
        Đơn hàng OG
      </h1>
      <p class="text-slate-500 text-sm mt-1">
        Giám sát toàn bộ đơn dịch vụ vận hành (sinh từ yêu cầu OG của cư dân) — gộp mọi công ty vận hành. Màn hình đọc-chỉ.
      </p>
    </div>

    <OgOrderConsoleTable />
  </div>
</template>
