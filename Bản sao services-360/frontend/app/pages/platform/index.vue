<script setup lang="ts">
definePageMeta({ layout: 'platform' })

useSeoMeta({ title: 'Tổng quan - Thần Nông' })

const { user } = usePlatformAuth()
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-black text-slate-900 tracking-tight">
        Xin chào, {{ user?.name }} 👋
      </h1>
      <p class="text-slate-500 text-sm mt-1">
        Chào mừng đến với hệ thống quản lý yêu cầu Thần Nông.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <NuxtLink
        to="/platform/tickets"
        class="group bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
      >
        <div class="size-12 rounded-xl bg-violet-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <span
            class="material-symbols-outlined text-violet-600"
            style="font-size: 24px"
          >confirmation_number</span>
        </div>
        <h3 class="font-bold text-slate-900 mb-1">Quản lý yêu cầu</h3>
        <p class="text-sm text-slate-500">Xem và xử lý các yêu cầu sửa chữa từ cư dân.</p>
      </NuxtLink>

      <NuxtLink
        to="/platform/settings/bank-account"
        class="group bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
      >
        <div class="size-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <span
            class="material-symbols-outlined text-emerald-600"
            style="font-size: 24px"
          >account_balance</span>
        </div>
        <h3 class="font-bold text-slate-900 mb-1">Tài khoản Platform</h3>
        <p class="text-sm text-slate-500">STK nhận hoa hồng Platform từ các công ty vận hành.</p>
      </NuxtLink>
    </div>
  </div>
</template>
