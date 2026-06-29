<script setup lang="ts">
const { user } = useAuth()

const moduleGroups = [
  {
    label: 'Nhân sự',
    icon: 'i-lucide-users-round',
    children: [
      {
        label: 'Tài khoản',
        description: 'Quản lý tài khoản nhân viên',
        icon: 'i-lucide-users',
        to: '/pmc/accounts'
      },
      {
        label: 'Phòng ban',
        description: 'Quản lý danh sách phòng ban',
        icon: 'i-lucide-building',
        to: '/pmc/departments'
      },
      {
        label: 'Chức danh',
        description: 'Quản lý chức danh nhân viên',
        icon: 'i-lucide-briefcase',
        to: '/pmc/job-titles'
      },
      {
        label: 'Vai trò',
        description: 'Quản lý vai trò và phân quyền',
        icon: 'i-lucide-shield',
        to: '/pmc/roles'
      }
    ]
  },
  {
    label: 'Dự án',
    icon: 'i-lucide-folder-kanban',
    children: [
      {
        label: 'Dự án',
        description: 'Quản lý dự án và thành viên',
        icon: 'i-lucide-folder-kanban',
        to: '/pmc/projects'
      }
    ]
  },
  {
    label: 'Danh mục',
    icon: 'i-lucide-package',
    children: [
      {
        label: 'Nhà cung cấp',
        description: 'Quản lý danh sách nhà cung cấp',
        icon: 'i-lucide-truck',
        to: '/pmc/catalog/suppliers'
      },
      {
        label: 'Danh mục hàng',
        description: 'Quản lý vật tư và dịch vụ',
        icon: 'i-lucide-boxes',
        to: '/pmc/catalog/items'
      }
    ]
  },
  {
    label: 'Quản lý đơn hàng',
    icon: 'i-lucide-shopping-cart',
    children: [
      {
        label: 'Báo giá',
        description: 'Quản lý báo giá cho ticket',
        icon: 'i-lucide-file-text',
        to: '/pmc/quotes'
      },
      {
        label: 'Đơn hàng',
        description: 'Quản lý đơn hàng từ báo giá',
        icon: 'i-lucide-clipboard-list',
        to: '/pmc/orders'
      }
    ]
  }
]
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-[var(--ui-text-highlighted)]">
      Xin chào, {{ user?.name }}
    </h1>
    <p class="mt-1 text-[var(--ui-text-muted)]">
      Chào mừng bạn quay trở lại
    </p>

    <div class="mt-8 space-y-8">
      <section
        v-for="group in moduleGroups"
        :key="group.label"
      >
        <div class="mb-4 flex items-center gap-2">
          <UIcon
            :name="group.icon"
            class="size-5 text-[var(--ui-text-muted)]"
          />
          <h2 class="text-lg font-semibold text-[var(--ui-text-highlighted)]">
            {{ group.label }}
          </h2>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ULink
            v-for="mod in group.children"
            :key="mod.to"
            :to="mod.to"
            class="group flex items-start gap-4 rounded-lg border border-[var(--ui-border)] p-5 transition hover:border-[var(--ui-primary)] hover:bg-[var(--ui-bg-elevated)]"
          >
            <UIcon
              :name="mod.icon"
              class="size-10 shrink-0 text-[var(--ui-primary)]"
            />
            <div>
              <p class="font-semibold text-[var(--ui-text-highlighted)] group-hover:text-[var(--ui-primary)]">
                {{ mod.label }}
              </p>
              <p class="mt-1 text-sm text-[var(--ui-text-muted)]">
                {{ mod.description }}
              </p>
            </div>
          </ULink>
        </div>
      </section>
    </div>
  </div>
</template>
