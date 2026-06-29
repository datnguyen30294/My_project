<script setup lang="ts">
interface Props {
  policyType: string
}

const props = defineProps<Props>()

const { data, status } = usePublicPolicy(props.policyType)

const policy = computed(() => data.value?.data)
</script>

<template>
  <div class="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f6f7f8]">
    <LandingHeader />

    <main class="flex-1 max-w-4xl mx-auto w-full px-6 lg:px-20 py-10">
      <!-- Loading -->
      <div
        v-if="status === 'pending'"
        class="flex justify-center py-20"
      >
        <UIcon
          name="i-lucide-loader-circle"
          class="animate-spin text-4xl text-slate-400"
        />
      </div>

      <!-- No content -->
      <div
        v-else-if="!policy"
        class="flex flex-col items-center justify-center py-20"
      >
        <UIcon
          name="i-lucide-file-x"
          class="text-6xl text-slate-300 mb-4"
        />
        <p class="text-slate-500 text-lg">
          Nội dung chưa được cập nhật.
        </p>
      </div>

      <!-- Content -->
      <article
        v-else
        class="bg-white rounded-xl shadow-sm border border-slate-200 p-8 sm:p-12"
      >
        <h1 class="text-slate-900 text-3xl font-extrabold leading-tight tracking-tight mb-2">
          {{ policy.title }}
        </h1>
        <p
          v-if="policy.updated_at"
          class="text-sm text-slate-400 mb-8"
        >
          Cập nhật lần cuối: {{ new Date(policy.updated_at).toLocaleDateString('vi-VN') }}
        </p>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div
          class="prose prose-slate max-w-none"
          v-html="policy.content"
        />
      </article>
    </main>

    <LandingFooter />
  </div>
</template>
