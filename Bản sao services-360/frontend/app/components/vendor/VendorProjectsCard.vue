<script setup lang="ts">
import type { PartnerDetail } from '~/composables/api/usePartners'

interface Props {
  vendor: PartnerDetail
}

const props = defineProps<Props>()

const emit = defineEmits<{
  changed: []
}>()

const toast = useToast()

// ─── Project lookup ───────────────────────────────────
const { data: projectsData, status: projectsStatus } = useProjectList(
  computed(() => ({ per_page: SELECT_ALL_PER_PAGE }))
)
const projectsById = computed(() => {
  const map = new Map<number, string>()
  for (const p of projectsData.value?.data ?? []) {
    map.set(p.id, p.name)
  }
  return map
})

const servedProjects = computed(() =>
  (props.vendor.project_ids ?? []).map(id => ({
    id,
    name: projectsById.value.get(id) ?? `#${id}`
  }))
)

// Projects not yet linked — candidates for adding.
const addableOptions = computed(() => {
  const served = new Set(props.vendor.project_ids ?? [])
  return (projectsData.value?.data ?? [])
    .filter(p => !served.has(p.id))
    .map(p => ({ label: p.name, value: p.id }))
})

// ─── Add (attach) ─────────────────────────────────────
const addOpen = ref(false)
const addProjectIds = ref<number[]>([])
const isAttaching = ref(false)

function openAdd() {
  addProjectIds.value = []
  addOpen.value = true
}

async function confirmAdd() {
  if (addProjectIds.value.length === 0) return
  isAttaching.value = true
  try {
    await apiAttachTenantPartner(props.vendor.id, [...addProjectIds.value])
    toast.add({ title: 'Đã thêm dự án cho vendor', color: 'success', icon: 'i-lucide-check-circle' })
    addOpen.value = false
    emit('changed')
  } catch (err) {
    toast.add({
      title: getApiErrorMessage(err, 'Thêm dự án thất bại'),
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  } finally {
    isAttaching.value = false
  }
}

// ─── Remove (detach) ──────────────────────────────────
const detachingId = ref<number | null>(null)

async function removeProject(projectId: number) {
  detachingId.value = projectId
  try {
    await apiDetachTenantPartner(props.vendor.id, [projectId])
    toast.add({ title: 'Đã gỡ vendor khỏi dự án', color: 'success', icon: 'i-lucide-check-circle' })
    emit('changed')
  } catch (err) {
    const apiErr = err as { data?: { error_code?: string } }
    if (apiErr?.data?.error_code === 'PARTNER_HAS_ACTIVE_CONTRACT') {
      toast.add({
        title: 'Không thể gỡ — vendor còn hợp đồng hoa hồng đang hiệu lực',
        description: 'Vui lòng huỷ hợp đồng hoa hồng của dự án này trước khi gỡ vendor.',
        color: 'warning',
        icon: 'i-lucide-shield-alert'
      })
    } else {
      toast.add({
        title: getApiErrorMessage(err, 'Gỡ vendor khỏi dự án thất bại'),
        color: 'error',
        icon: 'i-lucide-alert-circle'
      })
    }
  } finally {
    detachingId.value = null
  }
}
</script>

<template>
  <SharedSectionCard title="Dự án phục vụ">
    <template #header-actions>
      <UButton
        icon="i-lucide-plus"
        label="Thêm dự án"
        color="primary"
        variant="soft"
        size="xs"
        :disabled="addableOptions.length === 0"
        @click="openAdd"
      />
    </template>

    <div
      v-if="servedProjects.length"
      class="flex flex-wrap gap-2"
    >
      <UBadge
        v-for="p in servedProjects"
        :key="p.id"
        color="info"
        variant="subtle"
        class="gap-1 pr-1"
      >
        {{ p.name }}
        <button
          type="button"
          class="ml-1 rounded hover:bg-black/10 p-0.5 disabled:opacity-50"
          :disabled="detachingId === p.id"
          aria-label="Gỡ dự án"
          @click="removeProject(p.id)"
        >
          <UIcon
            :name="detachingId === p.id ? 'i-lucide-loader-circle' : 'i-lucide-x'"
            :class="['size-3', detachingId === p.id && 'animate-spin']"
          />
        </button>
      </UBadge>
    </div>
    <p
      v-else
      class="text-sm text-slate-500"
    >
      Vendor chưa được gán cho dự án nào. Bấm "Thêm dự án" để liên kết.
    </p>

    <UModal
      v-model:open="addOpen"
      title="Thêm dự án cho vendor"
    >
      <template #body>
        <UFormField
          label="Dự án"
          required
        >
          <USelectMenu
            v-model="addProjectIds"
            :items="addableOptions"
            value-key="value"
            multiple
            searchable
            :loading="projectsStatus === 'pending'"
            placeholder="Chọn dự án..."
            class="w-full"
          />
        </UFormField>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton
            label="Huỷ"
            color="neutral"
            variant="ghost"
            :disabled="isAttaching"
            @click="addOpen = false"
          />
          <UButton
            label="Thêm"
            icon="i-lucide-check"
            color="primary"
            :loading="isAttaching"
            :disabled="addProjectIds.length === 0"
            @click="confirmAdd"
          />
        </div>
      </template>
    </UModal>
  </SharedSectionCard>
</template>
