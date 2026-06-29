import type {
  ModulesPmcAccountAuthLogin200,
  AuthRegister201,
  ModulesPmcAccountAuthLogout200,
  ModulesPmcAccountAuthMe200,
  RegisterRequest,
  AppModulesPlatformAuthRequestsLoginRequest,
  ModulesPlatformAuthAuthLogin200,
  ModulesPlatformAuthAuthLogout200,
  ModulesPlatformAuthAuthMe200
} from '#api/generated/laravel'

// ─── PMC Auth ───────────────────────────────────────────────

interface LoginPayload {
  email: string
  password: string
}

export function apiLogin(data: LoginPayload) {
  return $api<ModulesPmcAccountAuthLogin200>('/auth/login', { method: 'POST', body: data })
}

export function apiRegister(data: RegisterRequest) {
  return $api<AuthRegister201>('/auth/register', { method: 'POST', body: data })
}

export function apiLogout() {
  return $api<ModulesPmcAccountAuthLogout200>('/auth/logout', { method: 'POST' })
}

export function apiMe() {
  return $api<ModulesPmcAccountAuthMe200>('/auth/me', { method: 'GET' })
}

// ─── Platform Auth ──────────────────────────────────────────

export function apiPlatformLogin(data: AppModulesPlatformAuthRequestsLoginRequest) {
  return $api<ModulesPlatformAuthAuthLogin200>('/platform/auth/login', { method: 'POST', body: data })
}

export function apiPlatformLogout() {
  return $platformApi<ModulesPlatformAuthAuthLogout200>('/platform/auth/logout', { method: 'POST' })
}

export function apiPlatformMe() {
  return $platformApi<ModulesPlatformAuthAuthMe200>('/platform/auth/me', { method: 'GET' })
}
