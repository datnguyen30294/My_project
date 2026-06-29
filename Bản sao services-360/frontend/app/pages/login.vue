<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'auth'
})

const { setAuth } = useAuth()
const { setAuth: setPlatformAuth } = usePlatformAuth()
const { isTenantDomain } = useAppContext()
const router = useRouter()
const toast = useToast()

const state = reactive({
  email: '',
  password: ''
})

const apiError = ref('')
const isPending = ref(false)

function validate(st: typeof state): FormError[] {
  const errors: FormError[] = []
  if (!st.email) errors.push({ name: 'email', message: 'Vui lòng nhập email' })
  if (!st.password) errors.push({ name: 'password', message: 'Vui lòng nhập mật khẩu' })
  return errors
}

async function onSubmit(event: FormSubmitEvent<typeof state>) {
  apiError.value = ''
  isPending.value = true

  try {
    if (isTenantDomain.value) {
      const response = await apiLogin({
        email: event.data.email,
        password: event.data.password
      })
      setAuth(response.data)
      toast.add({ title: 'Đăng nhập thành công', color: 'success' })
      router.push('/pmc/dashboard')
    } else {
      const response = await apiPlatformLogin({
        email: event.data.email,
        password: event.data.password
      })
      setPlatformAuth(response.data)
      toast.add({ title: 'Đăng nhập thành công', color: 'success' })
      router.push('/platform')
    }
  } catch (err) {
    apiError.value = getApiErrorMessage(err, 'Đăng nhập thất bại')
  } finally {
    isPending.value = false
  }
}
</script>

<template>
  <div>
    <!-- Logo -->
    <div class="mb-8 text-center">
      <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-xl bg-[var(--ui-primary)] text-white">
        <UIcon
          :name="isTenantDomain ? 'i-lucide-building-2' : 'i-lucide-globe'"
          class="size-7"
        />
      </div>
      <h1 class="text-2xl font-bold text-[var(--ui-text-highlighted)]">
        {{ isTenantDomain ? 'Residential Management' : 'Platform Management' }}
      </h1>
      <p class="mt-1 text-sm text-[var(--ui-text-muted)]">
        {{ isTenantDomain ? 'Đăng nhập vào hệ thống quản lý' : 'Đăng nhập vào hệ thống Platform' }}
      </p>
    </div>

    <!-- Login Form -->
    <div class="rounded-xl border border-[var(--ui-border)] bg-[var(--ui-bg)] p-6 shadow-sm">
      <!-- API Error -->
      <div
        v-if="apiError"
        class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400"
      >
        {{ apiError }}
      </div>

      <UForm
        :validate="validate"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          label="Email"
          name="email"
        >
          <UInput
            v-model="state.email"
            type="email"
            placeholder="email@example.com"
            icon="i-lucide-mail"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Mật khẩu"
          name="password"
        >
          <UInput
            v-model="state.password"
            type="password"
            placeholder="Nhập mật khẩu"
            icon="i-lucide-lock"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <UButton
          type="submit"
          label="Đăng nhập"
          icon="i-lucide-log-in"
          size="lg"
          block
          :loading="isPending"
        />
      </UForm>
    </div>

    <!-- Footer -->
    <p class="mt-6 text-center text-xs text-[var(--ui-text-muted)]">
      Residential Management System &copy; {{ new Date().getFullYear() }}
    </p>
  </div>
</template>
