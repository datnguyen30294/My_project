import { defineConfig, devices } from '@playwright/test'
import type { LaravelOptions } from '@hyvor/laravel-playwright'

/**
 * E2E tests run on the HOST machine (not inside Docker).
 * Browser needs native OS support — Docker Alpine lacks shared libraries.
 *
 * URLs point to Docker-exposed ports on localhost:
 * - Frontend: http://tnp.residential.test:3000 (mapped from residential_frontend:3000)
 * - Laravel API: http://tnp.residential.test:8000 (mapped from residential_nginx:80)
 */
export default defineConfig<LaravelOptions>({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : 4,
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://e2e.residential.test:3000',
    laravelBaseUrl: process.env.E2E_LARAVEL_URL ?? 'http://e2e.residential.test:8000/playwright',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
})
