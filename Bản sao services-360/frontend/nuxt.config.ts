import { resolve } from 'node:path'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui'
  ],

  ssr: true,

  imports: {
    dirs: ['composables/api']
  },

  devtools: {
    enabled: true
  },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }
      ]
    }
  },

  css: ['~/assets/css/main.css', '@vuepic/vue-datepicker/dist/main.css'],

  runtimeConfig: {
    apiInternalUrl: process.env.NUXT_API_INTERNAL_URL || '',
    public: {
      // Hostname của platform (ví dụ: service360.demego.vn). Mọi host khác được coi là tenant domain.
      platformDomain: process.env.NUXT_PUBLIC_PLATFORM_DOMAIN || 'localhost',
      // Base domain dùng để tách slug tổ chức khỏi hostname tenant (ví dụ: demego.vn).
      // Chỉ dùng cho các filter hiển thị — tenant identification ở BE match full FQDN qua bảng domains.
      baseDomain: process.env.NUXT_PUBLIC_BASE_DOMAIN || 'localhost',
      // Fallback API URL khi không thể suy ra từ hostname (SSR, local dev).
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
    }
  },

  alias: {
    '#api': resolve(__dirname, 'lib/api')
  },

  build: {
    transpile: ['@vuepic/vue-datepicker']
  },

  routeRules: {
    '/': { ssr: true },
    '/dich-vu/**': { ssr: true },
    '/login': { ssr: false },
    '/pmc/**': { ssr: false },
    '/platform/**': { ssr: false },
    '/reports/**': { ssr: false },
    '/quan-ly-cong-viec/**': { ssr: false }
  },

  compatibilityDate: '2025-01-15',

  vite: {
    server: {
      host: true,
      allowedHosts: true
    } as Record<string, unknown>
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
