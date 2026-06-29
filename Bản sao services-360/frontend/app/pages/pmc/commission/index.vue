<script setup lang="ts">
definePageMeta({ layout: 'default' })

useSeoMeta({ title: 'Cấu hình hoa hồng' })

const { data, status, error, refresh } = useCommissionProjects()
const projects = computed(() => data.value?.data ?? [])
</script>

<template>
  <div>
    <SharedCrudPageHeader
      title="Cấu hình chia hoa hồng"
      description="Thiết lập quy tắc chia tiền hoa hồng theo dự án"
    />

    <!-- Loading -->
    <div
      v-if="status === 'pending'"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <div
        v-for="i in 6"
        :key="i"
        class="h-36 bg-slate-100 rounded-xl animate-pulse"
      />
    </div>

    <!-- Error -->
    <SharedCrudPageError
      v-else-if="error"
      :error="error"
      :retry="refresh"
    />

    <!-- Empty -->
    <div
      v-else-if="projects.length === 0"
      class="flex flex-col items-center justify-center py-12 text-center"
    >
      <UIcon
        name="i-lucide-building-2"
        class="size-12 text-slate-300"
      />
      <p class="mt-3 text-sm text-slate-400">
        Chưa có dự án nào.
      </p>
    </div>

    <!-- Card grid -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <NuxtLink
        v-for="project in projects"
        :key="project.id"
        :to="`/pmc/commission/${project.id}`"
        class="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
      >
        <div class="flex items-start justify-between gap-2 mb-2">
          <h3 class="text-sm font-bold text-slate-900 truncate">
            {{ project.name }}
          </h3>
          <UBadge
            :label="project.is_configured ? 'Đã cấu hình' : 'Chưa cấu hình'"
            :color="project.is_configured ? 'success' : 'neutral'"
            variant="subtle"
            size="xs"
            class="shrink-0"
          />
        </div>

        <div class="space-y-1 text-xs text-slate-500">
          <p>
            Mã: <span class="font-mono font-semibold text-slate-700">{{ project.code }}</span>
          </p>
          <p v-if="project.address">
            Địa chỉ: {{ project.address }}
          </p>
          <p v-if="project.is_configured">
            Phòng ban: {{ project.dept_rules_count }}
          </p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
