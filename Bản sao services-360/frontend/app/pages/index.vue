<script setup lang="ts">
definePageMeta({
  layout: 'landing'
})

const title = 'Thần Nông - Gửi yêu cầu sửa chữa & bảo trì'
const description = 'Gửi yêu cầu sửa chữa, bảo trì căn hộ nhanh chóng. Đội ngũ kỹ thuật viên phản hồi trong 24 giờ.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  ogSiteName: 'Thần Nông'
})

const steps = [
  {
    number: '1',
    title: 'Điền thông tin',
    description: 'Họ tên, SĐT và mô tả sự cố.',
    gradient: 'from-indigo-500 to-indigo-600'
  },
  {
    number: '2',
    title: 'Tiếp nhận & phân công',
    description: 'Phân công kỹ thuật viên phù hợp.',
    gradient: 'from-violet-500 to-violet-600'
  },
  {
    number: '3',
    title: 'Xử lý & hoàn thành',
    description: 'KTV đến tận nơi, theo dõi qua mã.',
    gradient: 'from-fuchsia-500 to-fuchsia-600'
  }
]
</script>

<template>
  <div class="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f6f7f8]">
    <LandingHeader />

    <!-- Main Content -->
    <main class="flex-1">
      <!-- Hero Section — Gửi yêu cầu ticket -->
      <section class="relative overflow-hidden bg-slate-900">
        <!-- Subtle accent glow -->
        <div class="absolute top-0 left-1/3 size-[500px] rounded-full bg-indigo-500/10 blur-[150px]" />
        <div class="absolute bottom-0 right-1/4 size-[400px] rounded-full bg-violet-500/8 blur-[120px]" />

        <!-- Grid overlay -->
        <div
          class="absolute inset-0 opacity-[0.04]"
          style="background-image: linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px); background-size: 60px 60px;"
        />

        <div class="relative max-w-7xl mx-auto px-6 lg:px-20 py-20 lg:py-28">
          <!-- Top: Hero text + CTA -->
          <div class="max-w-2xl mx-auto text-center flex flex-col items-center gap-5 mb-16">
            <span class="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-slate-300 text-xs font-bold px-4 py-2 rounded-full">
              <span class="relative flex size-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span class="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              Hỗ trợ 24/7
            </span>

            <h1 class="text-white text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Cần sửa chữa, bảo trì?<br>
              <span class="text-indigo-400">
                Gửi yêu cầu ngay
              </span>
            </h1>

            <p class="text-slate-400 text-lg max-w-lg">
              Chỉ vài phút để gửi yêu cầu. Kỹ thuật viên phản hồi nhanh nhất có thể.
            </p>

            <div class="flex flex-wrap items-center justify-center gap-4 mt-2">
              <NuxtLink
                to="/ticket"
                class="flex items-center gap-3 h-14 px-10 rounded-2xl bg-indigo-500 text-white text-base font-bold shadow-xl shadow-indigo-500/30 hover:bg-indigo-400 hover:scale-105 active:scale-95 transition-all"
              >
                <span class="material-symbols-outlined text-xl">send</span>
                Gửi yêu cầu hỗ trợ
              </NuxtLink>
              <NuxtLink
                to="/dich-vu"
                class="flex items-center gap-2 h-14 px-8 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300 text-base font-semibold hover:bg-slate-700 hover:text-white transition-all"
              >
                <span class="material-symbols-outlined text-xl">storefront</span>
                Xem dịch vụ
              </NuxtLink>
            </div>
          </div>

          <!-- Bottom: 3 steps inline -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div
              v-for="(step, idx) in steps"
              :key="step.number"
              class="relative"
            >
              <div class="flex items-start gap-4 bg-slate-800/80 border border-slate-700/50 rounded-2xl px-5 py-5">
                <div
                  class="size-10 shrink-0 rounded-xl bg-gradient-to-br text-white flex items-center justify-center font-black text-sm"
                  :class="step.gradient"
                >
                  {{ step.number }}
                </div>
                <div>
                  <h3 class="text-white font-bold text-sm mb-1">
                    {{ step.title }}
                  </h3>
                  <p class="text-slate-400 text-xs leading-relaxed">
                    {{ step.description }}
                  </p>
                </div>
              </div>
              <!-- Arrow connector -->
              <div
                v-if="idx < steps.length - 1"
                class="hidden md:flex absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 size-5 rounded-full bg-slate-700 items-center justify-center"
              >
                <span
                  class="material-symbols-outlined text-slate-400"
                  style="font-size: 12px"
                >arrow_forward</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Modules Section -->
      <section class="py-16 px-6 lg:px-20">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-10">
            <h2 class="text-slate-900 text-3xl font-bold tracking-tight mb-2">
              Dịch vụ của chúng tôi
            </h2>
            <p class="text-slate-500">
              Chọn dịch vụ phù hợp với nhu cầu của bạn
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <NuxtLink
              to="/dich-vu"
              class="group flex flex-col p-8 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div class="size-14 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-3xl">storefront</span>
              </div>
              <h3 class="text-xl font-bold text-slate-900 mb-2">Danh mục dịch vụ</h3>
              <p class="text-slate-500 text-sm leading-relaxed mb-6">
                Xem danh sách các dịch vụ sửa chữa, bảo trì và tiện ích dành cho cư dân.
              </p>
              <div class="mt-auto flex items-center gap-2 text-slate-900 font-bold text-sm group-hover:underline underline-offset-4">
                Xem dịch vụ
                <span class="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </NuxtLink>

            <NuxtLink
              to="/ticket"
              class="group flex flex-col p-8 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div class="size-14 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-3xl">send</span>
              </div>
              <h3 class="text-xl font-bold text-slate-900 mb-2">Gửi yêu cầu hỗ trợ</h3>
              <p class="text-slate-500 text-sm leading-relaxed mb-6">
                Gửi yêu cầu sửa chữa, bảo trì nhanh chóng. Đội ngũ kỹ thuật phản hồi trong 24 giờ.
              </p>
              <div class="mt-auto flex items-center gap-2 text-slate-900 font-bold text-sm group-hover:underline underline-offset-4">
                Gửi yêu cầu
                <span class="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </NuxtLink>
          </div>
        </div>
      </section>
    </main>

    <LandingFooter />
  </div>
</template>
